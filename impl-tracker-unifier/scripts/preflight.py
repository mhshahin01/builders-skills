#!/usr/bin/env python3
"""impl-tracker-unifier pre-flight: the mechanical checks that run before any audit is spent.

Usage:
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN [--task ...]     # before In review
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --audit-mode     # auditor re-check
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --lint           # builder, right after coding
  python preflight.py --tracking <tracking dir> --push-check                      # before an auto push

Checks per task (rows: PASS / FAIL / INFO / SKIPPED; any FAIL fails the run):
  P1 clean tree      code root has no uncommitted or untracked change outside tracking/
  P2 commits         start commit is an ancestor of HEAD; no merges; every code commit since it has
                     exactly one `Task:` trailer (git trailer parsing); at least one is this task's
  P3 status          card Status equals index.md and is In progress, In review or Adopted
  P4 owned items     every Owns bullet parses and its item exists (types, files, migrations, tables,
                     endpoints, screens, jobs); unparsable bullets or no items FAIL
  P5 tests           every required suite runs; reports counted by <testcase>; any skipped, failure or
                     error FAILs; 0 testcases FAILs; fewer than the last passing run FAILs
  P6 local stack     every compose service running and healthy (when a compose file is configured)
  P7 lesson checks   every Active/Promoted lesson is covered by a checks.json entry (command, builtin
                     row, or judgement note); commands run with pipefail; errors and hidden stderr FAIL
  P8 task isolation  files changed by this task's commits are its own (Owns) or declared under
                     `## Touches`; nothing else
  P9 risk floor      a task marked low must not touch high-risk code (diff and Owns files), unless the
                     card quotes the user
Required suites run in parallel; each suite row ends with its time in seconds.
The report is printed and, outside --audit-mode and --lint, written to tracking/<KEY>/preflight/<T-NNN>-<short task head>.md.
The task head is the task's own last code `Task:` commit (repo HEAD for Adopted, which has no own commits, so
its counts match by definition); line 1 carries its full sha
and every suite row carries `tree <full sha>` (the repo HEAD the suites ran on). An auditor may reuse the
counts (any risk) only when the per-task `P5 reuse` row says reusable: tree == task head, or no code change
(outside tracking/) between them (audit-rules.md § 3a).
Never edits code or docs.
"""
import argparse
import datetime
import fnmatch
import glob
import json
import os
import re
import signal
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor

OK, FAIL, INFO, SKIP = "PASS", "FAIL", "INFO", "SKIPPED"
SKIP_DIRS = ("node_modules", "target", "dist", ".angular", ".git")
GREP_EXCLUDES = " ".join("--exclude-dir=" + d for d in SKIP_DIRS)
RISK_PATTERNS = (r"Cipher|_enc\b|encrypt|decrypt|KmsClient|@RequiresPermission|@PreAuthorize|authorize\(|"
                 r"AccessPort|volatile|synchronized|ReentrantLock|Atomic[A-Z]|ConcurrentHashMap|FOR UPDATE|"
                 r"SKIP LOCKED|[Cc]onsent|\bsend[A-Z(]|[Ss]ubmi(t|ssion)|DELETE FROM|UPDATE [a-z_.]+ SET|"
                 r"[Rr]etention|password|credential|[Ss]ecret")
DONE_STATES = ("Done", "Verified")


# ----------------------------------------------------------------------------- shell helpers
def find_bash():
    """Git Bash on Windows (never the WSL launcher, which loses the Windows environment); bash elsewhere."""
    if os.name != "nt":
        return "bash"
    candidates = []
    try:
        exec_path = subprocess.run(["git", "--exec-path"], capture_output=True, text=True).stdout.strip()
        root = os.path.normpath(os.path.join(exec_path, "..", "..", ".."))
        candidates += [os.path.join(root, "bin", "bash.exe"), os.path.join(root, "usr", "bin", "bash.exe")]
    except OSError:
        pass
    candidates += [r"C:\Program Files\Git\bin\bash.exe", r"C:\Program Files\Git\usr\bin\bash.exe"]
    for c in candidates:
        if os.path.exists(c):
            return c
    sys.exit("pre-flight: Git Bash not found (WSL bash is not used: it loses the Windows environment)")


BASH = find_bash()


def kill_tree(p):
    try:
        if os.name == "nt":
            subprocess.run(["taskkill", "/T", "/F", "/PID", str(p.pid)], capture_output=True)
        else:
            os.killpg(p.pid, signal.SIGKILL)
    except OSError:
        pass


def sh(cmd, cwd, timeout=1800):
    """Runs bash on a temp script file (no quoting games, no profile/rc, stdin closed, pipefail on). On
    timeout the whole process tree is killed. Returns (exit, output)."""
    fd, script = tempfile.mkstemp(suffix=".sh", prefix="preflight-")
    with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("set -o pipefail\n" + cmd + "\n")
    kwargs = {"start_new_session": True} if os.name != "nt" else \
        {"creationflags": subprocess.CREATE_NEW_PROCESS_GROUP}
    try:
        p = subprocess.Popen([BASH, "--noprofile", "--norc", script], cwd=cwd, stdin=subprocess.DEVNULL,
                             stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8",
                             errors="replace", **kwargs)
        try:
            out, _ = p.communicate(timeout=timeout)
            return p.returncode, out or ""
        except subprocess.TimeoutExpired:
            kill_tree(p)
            p.communicate()
            return 124, "timeout after %ss (process tree killed)" % timeout
    finally:
        try:
            os.remove(script)
        except OSError:
            pass


def git(args, cwd):
    p = subprocess.run(["git"] + args, cwd=cwd, capture_output=True, text=True, encoding="utf-8",
                       errors="replace")
    return p.returncode, p.stdout, p.stderr


def sh_quote(s):
    return "'" + s.replace("'", "'\\''") + "'"


# ----------------------------------------------------------------------------- markdown helpers
def table_value(md, key):
    m = re.search(r"^\|\s*" + re.escape(key) + r"\s*\|\s*(.*?)\s*\|\s*$", md, re.M)
    return m.group(1).strip() if m else None


def section(md, title):
    m = re.search(r"^## " + re.escape(title) + r"(?:\s*\([^\n]*\))?\s*$(.*?)(?=^## |\Z)", md, re.M | re.S)
    return m.group(1) if m else ""


def split_row(line):
    return [c.strip() for c in re.split(r"(?<!\\)\|", line.strip().strip("|"))]


def table_rows(md):
    rows = []
    for line in md.splitlines():
        line = line.strip()
        if not line.startswith("|") or re.match(r"^\|[\s\-|:]+\|$", line):
            continue
        rows.append(split_row(line))
    return rows[1:] if rows else []


def index_status(tracking, full_id):
    text = open(os.path.join(tracking, "index.md"), encoding="utf-8").read()
    first = next((l for l in text.splitlines() if l.strip().startswith("|")), "")
    header = split_row(first)
    col = header.index("Status") if "Status" in header else 4
    for cells in table_rows(text):
        if cells and re.search(r"\b" + re.escape(full_id) + r"\b", cells[0]):
            return cells[col] if col < len(cells) else None
    return None


# ----------------------------------------------------------------------------- P4 owned items
def owned_items(card_md):
    items, bad = [], []
    for line in section(card_md, "Owns").splitlines():
        s = line.strip()
        if not s:
            continue
        m = re.match(r"^[-*] (\w+) (.+)$", s)
        names = re.findall(r"`([^`]+)`", re.sub(r"\([^)]*\)", "", s))  # text in parentheses is a note
        if not m or not names:
            bad.append(s)
            continue
        kind = m.group(1).lower()
        for n in names:
            for part in ([n] if kind == "endpoint" else n.split(",")):
                part = re.sub(r"\s*\(.*\)\s*$", "", part).strip()
                if part:
                    items.append((kind, part))
    return items, bad


def brace_expand(p):
    m = re.search(r"\{([^}]+)\}", p)
    if not m:
        return [p]
    return [x for opt in m.group(1).split(",") for x in brace_expand(p[:m.start()] + opt + p[m.end():])]


def grep_files(pattern, code_root, includes="--include=*.java --include=*.kt --include=*.ts"):
    rc, out = sh("grep -rlE %s %s %s ." % (sh_quote(pattern), GREP_EXCLUDES, includes), code_root, 180)
    if rc >= 2:
        return rc, []
    files = [f[2:] if f.startswith("./") else f for f in out.strip().splitlines() if f.startswith("./")]
    return rc, files


def check_owned(kind, name, code_root):
    """Returns (result, detail, [paths that are this item])."""
    if kind in ("class", "interface", "record", "enum", "listener"):
        simple = name.split(".")[-1].lstrip("@")  # `@UseCase` is declared as `@interface UseCase`
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", simple):
            return INFO, "manual: not a plain type name", []
        rc, files = grep_files(r"(class|interface|record|enum) %s\b" % simple, code_root)
        if rc != 0 or not files:
            return FAIL, "not found (grep exit %s)" % rc, []
        return OK, files[0] + ("" if len(files) == 1 else " (+%d)" % (len(files) - 1)), files
    if kind == "file":
        paths = brace_expand(name)
        missing = [p for p in paths if not os.path.exists(os.path.join(code_root, p))]
        return (FAIL, "missing: " + ", ".join(missing), []) if missing else (OK, "exists", paths)
    if kind == "migration":
        hits = []
        for d, sub, names in os.walk(code_root):  # prune build and dependency dirs; glob ** walks node_modules
            sub[:] = [x for x in sub if x not in SKIP_DIRS]
            hits += [os.path.join(d, f) for f in fnmatch.filter(names, name)]
        rel = [os.path.relpath(h, code_root).replace("\\", "/") for h in hits]
        return (OK, rel[0], rel) if rel else (FAIL, "migration file not found", [])
    if kind == "table":
        table = name.split(".")[-1]
        rc, files = grep_files(r"[Cc][Rr][Ee][Aa][Tt][Ee] +[Tt][Aa][Bb][Ll][Ee] +([Ii][Ff] +[Nn][Oo][Tt] +"
                               r"[Ee][Xx][Ii][Ss][Tt][Ss] +)?([a-z_]+\.)?%s\b" % table, code_root, "--include=*.sql")
        return (OK, files[0], []) if files else (FAIL, "no CREATE TABLE in any migration", [])
    if kind == "endpoint":
        m = re.match(r"^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)", name)
        if not m:
            return INFO, "manual: endpoint not in METHOD /path form", []
        path = m.group(2)
        _, files = grep_files(re.escape('"' + path + '"'), code_root, "--include=*.java --include=*.kt")
        if files:
            return OK, files[0], files
        last = "/" + path.rstrip("/").split("/")[-1]
        prefix = "/".join(path.split("/")[:3])
        _, a = grep_files(re.escape('"' + last + '"'), code_root, "--include=*.java --include=*.kt")
        _, b = grep_files(re.escape('"' + prefix), code_root, "--include=*.java --include=*.kt")
        both = sorted(set(a) & set(b))
        return (OK, both[0] + " (split mapping)", both) if both else (FAIL, "mapping not found", [])
    if kind in ("screen", "route"):
        if not name.startswith("/"):
            return INFO, "manual: %s" % name, []
        seg = name.strip("/").split("/")[-1]
        _, files = grep_files(r"path: *['\"]%s['\"]|['\"]%s['\"]" % (re.escape(seg), re.escape(name.strip("/"))),
                              code_root, "--include=*.ts")
        return (OK, files[0], files) if files else (FAIL, "route not found", [])
    if kind == "job":
        _, files = grep_files(re.escape(name), code_root, "--include=*.java --include=*.kt --include=*.yml")
        return (OK, files[0], files) if files else (FAIL, "job type not referenced in code", [])
    return INFO, "manual (%s): the auditor verifies it" % kind, []


# ----------------------------------------------------------------------------- P5 tests
def suites(cfg):
    rows = table_rows(section(cfg, "Preflight suites"))
    return [{"name": r[0], "cmd": r[1], "reports": r[2], "when": r[3] if len(r) > 3 else "always"}
            for r in rows if len(r) >= 3]


def suite_required(s, changed, owned):
    w = s["when"].strip()
    if w.lower() in ("always", ""):
        return True
    if w.lower().startswith("paths:"):
        # "paths: a/, b/; not: a/e2e/" -- a file under a `not:` prefix never makes the suite required
        inc, _, exc = w.split(":", 1)[1].partition(";")
        prefixes = tuple(p.strip() for p in inc.split(",") if p.strip())
        excluded = tuple(p.strip() for p in exc.split(":", 1)[-1].split(",") if p.strip()) if exc else ()
        return any(c.startswith(prefixes) and not (excluded and c.startswith(excluded)) for c in changed | owned)
    return True


def run_suite(s, code_root, counts, accept_reason, tree):
    for f in glob.glob(os.path.join(code_root, s["reports"])):
        try:
            os.remove(f)
        except OSError as e:
            return FAIL, "cannot remove stale report %s (%s)" % (f, e), None
    t0 = time.time()
    rc, out = sh(s["cmd"], code_root)
    took = " · %ds" % (time.time() - t0)
    files = glob.glob(os.path.join(code_root, s["reports"]))
    total, bad = 0, []
    for f in files:
        x = open(f, encoding="utf-8", errors="replace").read()
        total += x.count("<testcase")
        for tag in ("<skipped", "<failure", "<error"):
            if x.count(tag):
                bad.append("%d %s in %s" % (x.count(tag), tag[1:], os.path.basename(f)))
    last = counts.get(s["name"], 0)
    if rc != 0 or bad or total == 0:
        return FAIL, "exit %s; tests=%d; tree %s; %s; tail: %s" % (
            rc, total, tree, "; ".join(bad) or ("0 testcases" if total == 0 else "-"), out.strip()[-400:]) + took, None
    if total < last and not accept_reason:
        return FAIL, ("%d testcases, fewer than the last passing run (%d); re-run with --accept-count "
                      "\"<reason>\" if tests were removed on purpose") % (total, last) + took, None
    note = " (fewer than %d accepted: %s)" % (last, accept_reason) if total < last else ""
    return OK, "tests=%d failures=0 errors=0 skipped=0 · exit 0 · tree %s%s%s" % (total, tree, note, took), total


# ----------------------------------------------------------------------------- P6 stack
def check_stack(cfg, code_root):
    compose = table_value(section(cfg, "Preflight"), "Compose file")
    if not compose or compose in ("-", "none"):
        return INFO, "no compose file configured"
    rc, out = sh("docker compose -f %s ps -a --format json" % sh_quote(compose), code_root, 120)
    if rc != 0:
        return FAIL, "docker compose ps failed: " + out.strip()[-300:]
    rows = []
    for line in out.strip().splitlines():
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        rows.extend(obj if isinstance(obj, list) else [obj])
    if not rows:
        return FAIL, "no compose services exist (run docker compose up -d)"
    bad = ["%s=%s/%s" % (r.get("Service"), r.get("State"), r.get("Health") or "-") for r in rows
           if r.get("State") != "running" or r.get("Health") not in ("", None, "healthy")]
    return (FAIL, "; ".join(bad)) if bad else (OK, "%d services running/healthy" % len(rows))


# ----------------------------------------------------------------------------- P7 lessons
def active_lessons(tracking):
    path = os.path.join(tracking, "lessons.md")
    if not os.path.exists(path):
        return []
    return [r[0] for r in table_rows(open(path, encoding="utf-8").read())
            if len(r) > 1 and re.fullmatch(r"L-\d+", r[0]) and r[1].split()[0] in ("Active", "Promoted")]


def lesson_checks(tracking, key, code_root, builtin_results):
    path = os.path.join(tracking, "checks.json")
    lessons = active_lessons(tracking)
    if not os.path.exists(path):
        return [(FAIL if lessons else INFO, "P7 checks.json", "missing; %d active lessons need coverage" % len(lessons))]
    try:
        entries = json.load(open(path, encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [(FAIL, "P7 checks.json", "invalid JSON: %s" % e)]
    covered, results = set(), []
    for c in entries:
        covered.update(c.get("lessons", []))
        label = "P7 %s (%s)" % (c.get("id", "?"), ", ".join(c.get("lessons", [])))
        keys = c.get("keys", ["*"])
        if "*" not in keys and key not in keys:
            results.append((SKIP, label, "not for key %s" % key))
            continue
        if "judgement" in c:
            results.append((INFO, label, "judgement, the auditor verifies: " + c["judgement"]))
            continue
        if "builtin" in c:
            results.append((builtin_results.get(c["builtin"], INFO), label, "covered by built-in %s" % c["builtin"]))
            continue
        cmd = c.get("cmd", "")
        if not cmd:
            results.append((FAIL, label, "entry has no cmd, builtin or judgement"))
            continue
        if re.search(r"2>\s*/dev/null", cmd):
            results.append((FAIL, label, "check hides errors (2>/dev/null); remove it and list 'paths'"))
            continue
        missing = [p for p in c.get("paths", []) if not glob.glob(os.path.join(code_root, p))]
        if missing:
            results.append((FAIL, label, "checked paths missing: " + ", ".join(missing)))
            continue
        rc, out = sh(cmd, code_root, c.get("timeout", 300))
        expect = c.get("expect", "empty")
        passed = (rc in (0, 1) and not out.strip()) if expect == "empty" else rc == 0
        if expect == "empty" and rc >= 2:
            detail = "check errored (exit %s): %s" % (rc, out.strip()[:300])
        else:
            detail = c.get("description", "") + ("" if passed else " -> " + out.strip()[:400])
        results.append((OK if passed else FAIL, label, detail))
    uncovered = [l for l in lessons if l not in covered]
    results.append((FAIL, "P7 lesson coverage", "no check, builtin or judgement entry for: " + ", ".join(uncovered))
                   if uncovered else (OK, "P7 lesson coverage", "%d active lessons covered" % len(lessons)))
    return results


# ----------------------------------------------------------------------------- commits
def task_commits(start, code_root, rel_tracking):
    rc, out, err = git(["log", "--no-merges",
                        "--format=%h%x1f%(trailers:key=Task,valueonly,separator=%x1d)%x1e",
                        "%s..HEAD" % start, "--", ".", ":(exclude)%s" % rel_tracking], code_root)
    if rc != 0:
        return None, err.strip()
    commits = []
    for c in out.split("\x1e"):
        if c.strip():
            sha, _, trailers = c.strip().partition("\x1f")
            commits.append((sha.strip(), [t.strip() for t in trailers.split("\x1d") if t.strip()]))
    return commits, None


def push_check(tracking, code_root):
    """PASS only when every code commit to be pushed carries exactly one Task trailer of a Done task. A commit that
    changes only tracking files never blocks (it holds no code): it carries a `Tracking:` trailer or its task's `Task:`
    trailer; one with neither is a warning. Commits that touch code stay strict."""
    rc, out, err = git(["log", "--no-merges",
                        "--format=%h%x1f%s%x1f%(trailers:key=Task,valueonly,separator=%x1d)%x1f"
                        "%(trailers:key=Tracking,valueonly,separator=%x1d)%x1e", "@{u}..HEAD"],
                       code_root)
    if rc != 0:
        print("PUSH-CHECK: FAIL (%s)" % err.strip())
        sys.exit(1)
    rel_tracking = os.path.relpath(tracking, code_root).replace("\\", "/")
    prefix = git(["rev-parse", "--show-prefix"], code_root)[1].strip()
    bad, warn = [], []
    for c in out.split("\x1e"):
        if not c.strip():
            continue
        sha, subject, trailers, tracking_trailer = (c.strip().split("\x1f") + ["", "", ""])[:4]
        tasks = [t.strip() for t in trailers.split("\x1d") if t.strip()]
        files = [f[len(prefix):] if prefix and f.startswith(prefix) else f
                 for f in git(["show", "--name-only", "--format=", sha], code_root)[1].splitlines() if f.strip()]
        tracking_only = bool(files) and all(f.startswith(rel_tracking + "/") for f in files)
        if tracking_only:  # holds no code: never blocks, whatever task it names
            if not tasks and not tracking_trailer.strip():
                warn.append("%s %s: tracking-only commit without a Task or Tracking trailer" % (sha, subject[:50]))
            continue
        if len(tasks) != 1:
            bad.append("%s %s: %d Task trailers" % (sha, subject[:50], len(tasks)))
            continue
        st = (index_status(tracking, tasks[0]) or "?").split(" (")[0]
        if st not in DONE_STATES:
            bad.append("%s %s: %s is %s" % (sha, subject[:50], tasks[0], st))
    for w in warn:
        print("WARN %s" % w)
    print("PUSH-CHECK: %s" % ("PASS" if not bad else "FAIL, ask the user:\n- " + "\n- ".join(bad)))
    sys.exit(1 if bad else 0)


# ----------------------------------------------------------------------------- main
def slice_check(tracking, full):
    """Slice delivery gate, mechanical part (slice-rules.md § 5): task status, audit links, open gaps, staleness."""
    key, sid = full.split("/")
    cards = glob.glob(os.path.join(tracking, key, "slices", sid + "-*.md"))
    if len(cards) != 1:
        sys.exit("PRE-FLIGHT SLICE %s: FAIL (slice card not found)" % full)
    card = open(cards[0], encoding="utf-8").read()
    tasks = re.findall(r"\b(?:%s/)?(T-\d{3,})\b" % re.escape(key), table_value(card, "Tasks") or "")
    gaps_md = os.path.join(tracking, "gaps.md")
    gaps = open(gaps_md, encoding="utf-8").read().splitlines() if os.path.exists(gaps_md) else []
    rows = []
    if not tasks:
        rows.append((FAIL, "S0 tasks", "slice card lists no tasks"))
    for tid in sorted(set(tasks)):
        tc = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
        if len(tc) != 1:
            rows.append((FAIL, "S1 " + tid, "task card not found"))
            continue
        t = open(tc[0], encoding="utf-8").read()
        status = (table_value(t, "Status") or "?").split(" (")[0].strip()
        if status == "Dropped":
            rows.append((INFO, "S1 " + tid, "Dropped"))
            continue
        ev = t.split("## Evidence", 1)[-1].split("## History", 1)[0]
        audited = re.search(r"audits/%s-audit-\d+\.md\)\s*PASS" % tid, ev) \
            or re.search(r"\[[^\]]*\bPASS[^\]]*\]\([^)]*audits/%s-audit-\d+\.md\)" % tid, ev) \
            or "audit skipped by user" in t
        ok = status in ("Done", "Verified") and bool(audited)
        rows.append((OK if ok else FAIL, "S1 " + tid, "status %s; audit %s" % (status, "PASS linked" if audited else "no PASS link")))
        for g in gaps:
            cells = [c.strip() for c in g.split("|")]
            # a bare T-NNN belongs to this key only on this key's gap rows; elsewhere it needs KEY/T-NNN
            own_row = len(cells) > 1 and cells[1].startswith(key + "/")
            hit = re.search(r"(?<![\w/])%s/%s\b" % (re.escape(key), tid), g) or \
                (own_row and re.search(r"(?<![\w/])%s\b" % tid, g))
            if len(cells) > 9 and cells[3] in ("blocker", "major") and hit \
                    and not re.match(r"(Closed|Deferred|Rejected)", cells[9]):
                rows.append((FAIL, "S2 " + tid, "open %s gap %s" % (cells[3], cells[1])))
    verdict = FAIL if any(r[0] == FAIL for r in rows) else OK
    print("| Check | Result | Detail |\n|---|---|---|")
    for r in rows:
        print("| %s | %s | %s |" % (r[1], r[0], r[2].replace("|", "/")))
    print("\nPRE-FLIGHT SLICE %s: %s (e2e specs are run separately by `slice deliver`)" % (full, verdict))
    sys.exit(0 if verdict == OK else 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tracking", required=True)
    ap.add_argument("--task", action="append", default=[])
    ap.add_argument("--audit-mode", action="store_true", help="auditor re-check: no tests, no stack, no report file")
    ap.add_argument("--lint", action="store_true",
                    help="builder's fast check right after coding: every check except tests and the stack; "
                         "uncommitted work counts; prints ready-to-paste ## Touches lines; no report file")
    ap.add_argument("--push-check", action="store_true")
    ap.add_argument("--slice", default="", help="slice delivery gate: KEY/S-NN (slice-rules.md § 5)")
    ap.add_argument("--accept-count", default="", help="reason for accepting fewer tests than last time")
    ap.add_argument("--history", action="store_true", help="rebuild tracking/history.md from git and the reports")
    ap.add_argument("--history-start", default="", help="stamp the start clock of KEY/T-NNN (run at `start`)")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass
    tracking = os.path.abspath(a.tracking)
    if a.history_start or a.history:
        import history
        cfg = open(os.path.join(tracking, "config.md"), encoding="utf-8").read()
        root = os.path.normpath(os.path.join(tracking, "..", (table_value(cfg, "Code root") or ".").split()[0]))
        if a.history_start:
            history.stamp_start(tracking, a.history_start)
        else:
            history.write(tracking, root)
        sys.exit(0)
    if a.slice:
        slice_check(tracking, a.slice)
    cfg = open(os.path.join(tracking, "config.md"), encoding="utf-8").read()
    code_root = os.path.normpath(os.path.join(tracking, "..", (table_value(cfg, "Code root") or ".").split()[0]))
    try:
        rel_tracking = os.path.relpath(tracking, code_root).replace("\\", "/")
    except ValueError:
        sys.exit("PRE-FLIGHT: FAIL (tracking and code root are on different drives)")
    rc, head, err = git(["rev-parse", "--short", "HEAD"], code_root)
    if rc != 0:
        sys.exit("PRE-FLIGHT: FAIL (code root is not a git repository: %s)" % err.strip())
    head = head.strip()
    head_full = git(["rev-parse", "HEAD"], code_root)[1].strip()
    if a.push_check:
        push_check(tracking, code_root)
    if not a.task:
        sys.exit("pre-flight: give --task KEY/T-NNN (one or more) or --push-check")
    stamp = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    repo_prefix = git(["rev-parse", "--show-prefix"], code_root)[1].strip()
    test_like = re.compile(r"(^|/)src/test/|(^|/)e2e/|\.spec\.ts$|\.test\.ts$|(^|/)playwright\.config\.ts$")

    per_task, all_changed, all_owned = {}, set(), set()
    for full in a.task:
        key, tid = full.split("/")
        rows = []
        cards = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
        card = open(cards[0], encoding="utf-8").read() if len(cards) == 1 else ""
        if not card:
            rows.append((FAIL, "P0 card", "task card not found"))
        status = (table_value(card, "Status") or "?").split(" (")[0]
        start = ((table_value(card, "Start commit") or "").split() or [""])[0]
        adopted = status.startswith("Adopted")

        rc, out, err = git(["status", "--porcelain", "--", ".", ":(exclude)%s" % rel_tracking], code_root)
        dirty = out.rstrip()  # keep the leading space of " M path": the path starts at column 3
        if a.lint:
            rows.append((INFO, "P1 clean tree", "lint: uncommitted work is checked as part of the task" if dirty.strip()
                         else "clean"))
        else:
            rows.append((FAIL if rc != 0 or dirty.strip() else OK, "P1 clean tree",
                         err.strip() if rc != 0 else (dirty.strip()[:400] or "clean")))

        mine = set()
        if a.lint:
            for line in dirty.splitlines():
                f = line[3:].strip().strip('"').split(" -> ")[-1]
                f = f[len(repo_prefix):] if repo_prefix and f.startswith(repo_prefix) else f
                if f and not f.startswith(rel_tracking + "/"):
                    mine.add(f)
        task_head = head_full
        if adopted:
            rows.append((INFO, "P2 commits", "Adopted: no commits expected; the audit covers the existing code"))
        elif not re.fullmatch(r"[0-9a-f]{7,40}", start):
            rows.append((FAIL, "P2 commits", "card has no start commit: run `start` first"))
        else:
            anc = git(["merge-base", "--is-ancestor", start, "HEAD"], code_root)[0]
            commits, e = task_commits(start, code_root, rel_tracking)
            date = git(["show", "-s", "--format=%ci", start], code_root)[1].strip()
            if anc != 0 or commits is None:
                rows.append((FAIL, "P2 commits", "start %s is not an ancestor of HEAD %s" % (start, e or "")))
            else:
                multi = [s for s, t in commits if len(t) != 1]
                own = [s for s, t in commits if t == [full]]
                ok = bool(commits) and not multi and bool(own)
                if a.lint and not multi and not own:
                    rows.append((INFO, "P2 commits", "lint: no %s commit yet; commit with exactly one Task trailer"
                                 % full))
                else:
                    rows.append((OK if ok else FAIL, "P2 commits", "start %s (%s); %d code commits, %d are %s%s" % (
                        start, date, len(commits), len(own), full,
                        "" if not multi else "; need exactly one Task trailer: " + ", ".join(multi))))
                if own:
                    # task_commits is git log order (newest first, parents before children in linear history)
                    task_head = git(["rev-parse", own[0]], code_root)[1].strip() or head_full
                for s in own:
                    for f in git(["show", "--name-only", "--format=", s], code_root)[1].split():
                        f = f[len(repo_prefix):] if repo_prefix and f.startswith(repo_prefix) else f
                        if not f.startswith(rel_tracking + "/"):
                            mine.add(f)

        idx = (index_status(tracking, full) or "").split(" (")[0]
        ok = status == idx and status in ("In progress", "In review", "Adopted")
        rows.append((OK if ok else FAIL, "P3 status", "card=%s index=%s" % (status, idx)))

        items, bad = owned_items(card)
        owned = set()
        for line in bad:
            rows.append((FAIL, "P4 Owns line", "does not parse as - kind `name`: " + line[:120]))
        if not items:
            rows.append((FAIL, "P4 owns", "no owned items parsed"))
        for kind, name in items:
            r, detail, paths = check_owned(kind, name, code_root)
            owned.update(paths)
            rows.append((r, "P4 %s `%s`" % (kind, name), detail))
        all_changed |= mine
        all_owned |= owned

        touches = set(re.findall(r"`([^`]+)`", section(card, "Touches")))
        allowed = owned | touches
        dirs = tuple(d.rstrip("/") + "/" for d in allowed if os.path.isdir(os.path.join(code_root, d)))

        def is_allowed(f):
            return f in allowed or f.startswith(dirs) or bool(test_like.search(f))

        outside = sorted(f for f in mine if not is_allowed(f))
        if adopted or not mine:
            rows.append((INFO, "P8 isolation", "Adopted" if adopted else "no task commits to check"))
        else:
            rows.append((FAIL if outside else OK, "P8 isolation",
                         ("changed outside Owns and not declared under ## Touches: " + ", ".join(outside))
                         if outside else "%d changed files, all owned or declared" % len(mine)))
            if outside and a.lint:
                print("# %s: paste under ## Touches, then replace each <reason>:" % full)
                for f in outside:
                    print("- `%s`: <reason>" % f)

        risk = table_value(card, "Risk") or ""
        hits = []
        for f in sorted(mine | owned):
            p = os.path.join(code_root, f)
            if os.path.isfile(p) and not test_like.search(f):
                with open(p, encoding="utf-8", errors="replace") as fh:
                    for n, line in enumerate(fh, 1):
                        if re.search(RISK_PATTERNS, line):
                            hits.append("%s:%d" % (f, n))
                            break
        if not risk:
            rows.append((FAIL, "P9 risk floor", "card has no Risk"))
        elif risk.startswith("low") and hits and 'user: "' not in risk:
            rows.append((FAIL, "P9 risk floor", "Risk is low but high-risk code is touched: %s; raise Risk to high "
                         "or quote the user's decision on the card" % ", ".join(hits[:6])))
        else:
            rows.append((OK, "P9 risk floor", "%s; %s" % (risk.split(" (")[0], "high-risk code in %d files" % len(hits)
                                                          if hits else "no high-risk code found")))
        if task_head == head_full:
            reuse = (INFO, "P5 reuse", "tree = task head %s: suite counts reusable" % task_head[:7])
        else:
            same = git(["diff", "--quiet", task_head, head_full, "--", ".", ":(exclude)%s" % rel_tracking],
                       code_root)[0] == 0
            reuse = (INFO, "P5 reuse", ("no code change between task head %s and tree %s: suite counts reusable"
                                        if same else "code changed between task head %s and "
                                        "tree %s: counts NOT reusable, auditor runs full suites")
                     % (task_head[:7], head_full[:7]))
        rows.append(reuse)
        per_task[full] = (key, tid, rows, task_head)

    if a.lint:
        tests = [(INFO, "P5 tests", "lint: tests not run; the full pre-flight runs them")]
        stack = (INFO, "P6 local stack", "lint")
    elif a.audit_mode:
        tests = [(INFO, "P5 tests", "audit mode: tests not run; reuse the pre-flight report counts when its P5 reuse "
                  "row says reusable and every suite has 0 failures, errors and skips, then run only the task's own "
                  "test classes; else run the full suites in the export (audit-rules.md § 3a)")]
        stack = (INFO, "P6 local stack", "audit mode")
    else:
        counts_path = os.path.join(tracking, "preflight-counts.json")
        counts = json.load(open(counts_path, encoding="utf-8")) if os.path.exists(counts_path) else {}
        tests, cfg_suites = [], suites(cfg)
        if not cfg_suites:
            tests.append((FAIL, "P5 tests", "config.md needs a '## Preflight suites' table"))
        # independent suites run side by side (config.md: no two suites share a build dir or report file)
        required = [s for s in cfg_suites if suite_required(s, all_changed, all_owned)]
        with ThreadPoolExecutor(max_workers=max(1, len(required))) as pool:
            done = dict(zip([s["name"] for s in required],
                            pool.map(lambda s: run_suite(s, code_root, counts, a.accept_count, head_full), required)))
        for s in cfg_suites:
            if s["name"] not in done:
                tests.append((SKIP, "P5 suite %s" % s["name"], "not required (%s)" % s["when"]))
                continue
            r, detail, total = done[s["name"]]
            tests.append((r, "P5 suite %s" % s["name"], detail))
            if r == OK:
                counts[s["name"]] = total
        if all(t[0] != FAIL for t in tests):
            json.dump(counts, open(counts_path, "w", encoding="utf-8"), indent=2)
        stack = (lambda r: (r[0], "P6 local stack", r[1]))(check_stack(cfg, code_root))
    p5 = FAIL if any(t[0] == FAIL for t in tests) else (INFO if a.audit_mode or a.lint else OK)

    failed = False
    print("# Pre-flight · head %s · %s%s" % (head, stamp, " · audit mode" if a.audit_mode else ""))
    for full, (key, tid, rows, task_head) in per_task.items():
        p1 = next((r for r, l, _ in rows if l == "P1 clean tree"), OK)
        rows = rows + tests + [stack] + lesson_checks(tracking, key, code_root, {"P1": p1, "P5": p5, "P6": stack[0]})
        verdict = "FAIL" if any(r == FAIL for r, _, _ in rows) else "PASS"
        failed |= verdict == "FAIL"
        lines = ["# Pre-flight %s · head %s · %s · %s%s" % (full, task_head, stamp, verdict,
                                                           " · audit mode" if a.audit_mode else ""),
                 "", "| Result | Check | Detail |", "|---|---|---|"]
        lines += ["| %s | %s | %s |" % (r, l, d.replace("\n", " ").replace("|", "\\|")) for r, l, d in rows]
        text = "\n".join(lines) + "\n"
        print("\n" + text)
        if not (a.audit_mode or a.lint):
            out_dir = os.path.join(tracking, key, "preflight")
            os.makedirs(out_dir, exist_ok=True)
            path = os.path.join(out_dir, "%s-%s.md" % (tid, task_head[:7]))
            open(path, "w", encoding="utf-8").write(text)
            print("report: %s" % os.path.relpath(path, tracking).replace("\\", "/"))
    print("\n%s: %s" % ("LINT" if a.lint else "PRE-FLIGHT", "FAIL" if failed else "PASS"))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
