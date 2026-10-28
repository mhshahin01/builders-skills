#!/usr/bin/env python3
"""impl-tracker-unifier pre-flight: the mechanical checks that run before any audit is spent.

Usage:
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN [--task ...]     # before In review
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --audit-mode     # auditor re-check
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --lint           # builder, right after coding
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --quick          # builder, task tests + always-run tests
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --mutate         # builder, before the full run (L-060)
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --removals       # builder, Design check guards (L-046)
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
  P10 mutation       surviving mutants on the task's changed lines; `## Equivalent mutants` bullets match by
                     `file:line`, or by the quoted code of the line (second backtick group), so a moved line
                     still matches
  P12 migrations     a migration the task adds has a version above every version present at its start (L-014),
                     and no test line still pins the schema's previous highest version
  P13 bean types     a bean the task declares is not a second bean of a single-instance type (L-061)
  P14 removals       a card with `## Design check` has `## Removals`, and a --removals report shows every guard
                     the card lists killed by its named test, with no production code, build file or named test
                     changed since (other test files keep the report)
  P16 neighbours     INFO: test classes that name a table the task's added migrations write or alter (seed rows,
                     columns); --quick runs them, and the full run runs them first
  P15 doc updates    every DU the task raised (doc-updates.md, Task column) is listed under the card's
                     `## Doc updates` and exists; none is Failed or Rejected without a reason; a `contract` DU is
                     Verified; every doc-owned gap of the task has a DU (doc-impact-rules.md § 9)
P10 targets the covering tests only (PIT -DtargetTests): the task's own test classes plus every test class that
names a changed class or an interface it implements, or sits in its package; none found -> the suite default.
Reuse: a full run stores its suite rows and raw mutation survivors in tracking/preflight-cache.json; a later full
run whose code (everything outside tracking/, docs and binaries excluded: NON_CODE) is unchanged reuses both and re-judges the survivors against the
current cards, in seconds. --mutate runs mutation on the task's changed classes (uncommitted work included)
against the task's own test classes only (PIT -DtargetTests), prints survivors with their code, writes nothing.
Required suites run in parallel; each suite row ends with its time in seconds. Beside them, in private copies of the
Maven module (two Maven runs in one module clash on target/): the related tests (own, always-run, migration
neighbours, covering), which stop the suites when they fail, and each Maven mutation suite. --removals runs its guards
in up to --jobs module copies at once and never edits the working tree.
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
import html
import json
import os
import queue
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from concurrent.futures import ThreadPoolExecutor

OK, FAIL, INFO, SKIP = "PASS", "FAIL", "INFO", "SKIPPED"
# files that are never code: a commit of only these never makes the removals report or the suite cache stale
NON_CODE = ("*.md", "*.pdf", "*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.docx", "*.pptx", "*.xlsx")


def code_spec(rel_tracking):
    """git pathspec for code only: everything outside tracking/ except docs and binaries (NON_CODE)."""
    return [".", ":(exclude)%s" % rel_tracking] + [":(exclude,glob)**/%s" % p for p in NON_CODE]


def worktree_tree(code_root, rel_tracking):
    """The git tree of the code as it is on disk now, uncommitted and untracked work included, written through a
    temporary index so the real index is never touched. `git diff --quiet <tree> <commit> -- code` then tells whether
    a later commit holds exactly this code. '' when git fails."""
    fd, idx = tempfile.mkstemp(prefix="preflight-index-")
    os.close(fd)
    os.remove(idx)  # git creates the index file itself
    env = dict(os.environ, GIT_INDEX_FILE=idx)
    run = lambda *args: subprocess.run(["git"] + list(args), cwd=code_root, env=env, capture_output=True, text=True,
                                       encoding="utf-8", errors="replace")
    try:
        if run("read-tree", "HEAD").returncode or run("add", "-A", "--", *code_spec(rel_tracking)).returncode:
            return ""
        out = run("write-tree")
        return out.stdout.strip() if out.returncode == 0 else ""
    finally:
        if os.path.exists(idx):
            os.remove(idx)
SKIP_DIRS = ("node_modules", "target", "dist", ".angular", ".git", ".stryker-tmp", "reports")
GREP_EXCLUDES = " ".join("--exclude-dir=" + d for d in SKIP_DIRS)
RISK_PATTERNS = (r"Cipher|_enc\b|encrypt|decrypt|KmsClient|@RequiresPermission|@PreAuthorize|authorize\(|"
                 r"AccessPort|volatile|synchronized|ReentrantLock|Atomic[A-Z]|ConcurrentHashMap|FOR UPDATE|"
                 r"SKIP LOCKED|[Cc]onsent|\bsend[A-Z(]|[Ss]ubmi(t|ssion)|DELETE FROM|UPDATE [a-z_.]+ SET|"
                 r"[Rr]etention|password|credential|[Ss]ecret")
# template bindings that change behaviour (not display): state, focus, events, control flow
TEMPLATE_BINDINGS = (r"\[(?:disabled|hidden|required|readonly|attr\.[\w-]+|tabindex)\]=\"[^\"]+\"|"
                     r"\((?!ngModelChange\b)[\w.]+\)=\"[^\"]+\"|"
                     r"@(?:if|for|switch)\s*\([^)\n]*\)")
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


def kill_tree(p, cwd=None, since=None):
    """Kills the process tree. On Windows a JVM started from Git Bash hangs under an MSYS stub that has already
    exited, so taskkill /T from bash never reaches it: the java.exe processes started after `since` whose command
    line names `cwd` (Maven writes -Dmaven.multiModuleProjectDirectory=C:/x/module) are killed with their own tree
    (cmd, the surefire fork, PIT minions). Nothing older and nothing outside that folder is touched."""
    try:
        if os.name == "nt":
            subprocess.run(["taskkill", "/T", "/F", "/PID", str(p.pid)], capture_output=True)
            if cwd and since:
                path = os.path.abspath(cwd)
                ps = ("$t=[datetime]::Parse('%s'); $a=[Management.Automation.WildcardPattern]::Escape('%s'); "
                      "$b=[Management.Automation.WildcardPattern]::Escape('%s'); "
                      "Get-CimInstance Win32_Process -Filter \"Name='java.exe'\" | Where-Object { $_.CreationDate -ge $t "
                      "-and ($_.CommandLine -like ('*' + $a + '*') -or $_.CommandLine -like ('*' + $b + '*')) } | "
                      "ForEach-Object { taskkill /T /F /PID $_.ProcessId | Out-Null }") % (
                    since.isoformat(), path.replace("\\", "/"), path.replace("/", "\\"))
                subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", ps], capture_output=True,
                               timeout=60)
        else:
            os.killpg(p.pid, signal.SIGKILL)
    except (OSError, subprocess.TimeoutExpired):
        pass


def sh(cmd, cwd, timeout=1800, cancel=None):
    """Runs bash on a temp script file (no quoting games, no profile/rc, stdin closed, pipefail on). On
    timeout, or when the `cancel` event is set, the whole process tree is killed. Returns (exit, output)."""
    fd, script = tempfile.mkstemp(suffix=".sh", prefix="preflight-")
    with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("set -o pipefail\n" + cmd + "\n")
    kwargs = {"start_new_session": True} if os.name != "nt" else \
        {"creationflags": subprocess.CREATE_NEW_PROCESS_GROUP}
    try:
        p = subprocess.Popen([BASH, "--noprofile", "--norc", script], cwd=cwd, stdin=subprocess.DEVNULL,
                             stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8",
                             errors="replace", **kwargs)
        deadline, since = time.time() + timeout, datetime.datetime.now()
        while True:
            try:
                out, _ = p.communicate(timeout=2)  # a timed-out communicate keeps its output for the next call
                return p.returncode, out or ""
            except subprocess.TimeoutExpired:
                if cancel is not None and cancel.is_set():
                    kill_tree(p, cwd, since)
                    out, _ = p.communicate()
                    return 130, (out or "")[-400:] + "\ncancelled (process tree killed)"
                if time.time() > deadline:
                    kill_tree(p, cwd, since)
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


# ----------------------------------------------------------------------------- private module copies
def maven_module(cmd, code_root):
    """The Maven module a `cd <dir> && mvn ...` command builds, when that module can be copied alone: it has a
    pom.xml and the code root has no aggregator pom (a module with an on-disk parent needs its siblings). Else ''."""
    m = re.match(r"\s*cd\s+([\w./-]+)\s*&&\s*mvn\b", cmd or "")
    if not m or os.path.exists(os.path.join(code_root, "pom.xml")):
        return ""
    d = m.group(1).strip("/")
    return d if os.path.isfile(os.path.join(code_root, d, "pom.xml")) else ""


def link_dir(src, dst):
    """A directory link that needs no admin rights (a junction on Windows)."""
    if os.name == "nt":
        subprocess.run(["cmd", "/c", "mklink", "/J", dst, src], capture_output=True)
    else:
        os.symlink(src, dst)


def is_link(path):
    return os.path.islink(path) or getattr(os.path, "isjunction", lambda p: False)(path)


def module_copy(code_root, module, label):
    """A private copy of one Maven module, its build dir included so the build stays incremental. Two Maven runs in
    one module dir clash on target/ (the backend suite starts with `clean`), so every run beside another one, and
    every guard removal, runs in its own copy; the working tree is never edited. The copy keeps the module's place:
    the code root's other folders and the folders beside the code root are linked in, so a test that reads
    `../../tech/...` (the docs next to the code) reads the real file. Returns the copy's code root: commands that
    start with `cd <module> &&` run there unchanged."""
    root = os.path.abspath(code_root)
    base = tempfile.mkdtemp(prefix="preflight-%s-" % label)
    dest = os.path.join(base, os.path.basename(root))
    os.makedirs(dest)
    for outer, inner, skip in ((os.path.dirname(root), base, {os.path.basename(root), ".git"}),
                               (root, dest, {module.split("/")[0], ".git"})):
        for e in os.listdir(outer):
            if e not in skip and os.path.isdir(os.path.join(outer, e)):
                link_dir(os.path.join(outer, e), os.path.join(inner, e))
    shutil.copytree(os.path.join(root, module), os.path.join(dest, module), symlinks=True,
                    ignore=shutil.ignore_patterns("surefire-reports", "pit-reports", "failsafe-reports"))
    return dest


def drop_copy(dest):
    """Removes a module_copy: the links first (never their targets), then the copied files. A file still held by a
    dying JVM stays in the temp dir; harmless."""
    base = os.path.dirname(dest)
    for d in (base, dest):
        for e in os.listdir(d) if os.path.isdir(d) else []:
            p = os.path.join(d, e)
            if is_link(p):
                try:
                    os.rmdir(p) if os.name == "nt" else os.unlink(p)
                except OSError:
                    pass
    if any(is_link(os.path.join(d, e)) for d in (base, dest) if os.path.isdir(d) for e in os.listdir(d)):
        return  # a link could not be removed: leave the temp dir rather than risk deleting through it
    shutil.rmtree(base, ignore_errors=True)


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


def run_suite(s, code_root, counts, accept_reason, tree, cancel=None):
    for f in glob.glob(os.path.join(code_root, s["reports"])):
        try:
            os.remove(f)
        except OSError as e:
            return FAIL, "cannot remove stale report %s (%s)" % (f, e), None
    t0 = time.time()
    rc, out = sh(s["cmd"], code_root, cancel=cancel)
    took = " · %ds" % (time.time() - t0)
    if rc == 130 and cancel is not None and cancel.is_set():
        return FAIL, "stopped: the related tests failed first (see P5 related tests)" + took, None
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
        first = failing_cases(files)
        return FAIL, "exit %s; tests=%d; tree %s; %s; %s" % (
            rc, total, tree, "; ".join(bad) or ("0 testcases" if total == 0 else "-"),
            ("failing: " + " | ".join(first)) if first else "tail: " + out.strip()[-400:]) + took, None
    if total < last and not accept_reason:
        return FAIL, ("%d testcases, fewer than the last passing run (%d); re-run with --accept-count "
                      "\"<reason>\" if tests were removed on purpose") % (total, last) + took, None
    note = " (fewer than %d accepted: %s)" % (last, accept_reason) if total < last else ""
    return OK, "tests=%d failures=0 errors=0 skipped=0 · exit 0 · tree %s%s%s" % (total, tree, note, took), total


def failing_cases(report_files, limit=3):
    """`Class#method: first message line` for the first failing or erroring test cases of JUnit XML reports, read
    from the copy the suite ran in (SHAREDKERNEL/T-011: the row showed Maven boilerplate only)."""
    out = []
    for f in report_files:
        try:
            x = open(f, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        for m in re.finditer(r"<testcase\b([^>]*?)(?:/>|>(.*?)</testcase>)", x, re.S):
            attrs, body = m.group(1), m.group(2) or ""
            fm = re.search(r"<(failure|error)\b([^>]*?)(?:/>|>(.*?)</\1>)", body, re.S)
            if not fm:
                continue
            name = (re.search(r'\bname="([^"]*)"', attrs) or [None, "?"])[1]
            cls = (re.search(r'\bclassname="([^"]*)"', attrs) or [None, "?"])[1]
            msg = re.search(r'\bmessage="([^"]*)"', fm.group(2) or "")
            text = html.unescape(msg.group(1) if msg else (fm.group(3) or ""))
            line = next((l.strip() for l in text.splitlines() if l.strip()), fm.group(1))
            out.append("%s#%s: %s" % (cls.rsplit(".", 1)[-1], name, line[:160]))
            if len(out) >= limit:
                return out
    return out


# ----------------------------------------------------------------------------- P10 mutation
def mutation_suites(cfg):
    rows = table_rows(section(cfg, "Mutation suites"))
    return [{"name": r[0], "cmd": r[1], "report": r[2], "prefix": r[3].strip(), "ext": r[4].strip(),
             "exclude": [g.strip().strip("`") for g in (r[5] if len(r) > 5 else "").split(",") if g.strip().strip("`")]}
            for r in rows if len(r) >= 5]


# files with no logic: never mutated (L-054); a suite's Exclude column adds its own globs
NO_LOGIC = ["*-options.ts", "*.routes.ts", "guides.ts"]
# a field or constant declaration line: its starting value is set once and overwritten or bound before use
DECLARATION = re.compile(r"^\s*(?:export\s+)?(?:(?:public|protected|private|static|readonly|final|const)\s+)+"
                         r"[\w$<>,\[\]?\s]*?[\w$]+\s*(?::[^=()]+)?=(?!\s*computed\b)(?![^;]*=>)[^;]*;?\s*$")
# literal mutators only: a condition, call or return on a declaration line still counts; numbers are limits, and
# a string is skipped only as a signal/model/input starting value, so constant UI messages are still mutated
INITIAL_MUTATORS = {"BooleanLiteral", "StringLiteral", "ArrayDeclaration", "ObjectLiteral"}
STATE_START = re.compile(r"\b(?:signal|model|input)\s*(?:<[^>]*>)?\(")


def no_logic(path, extra):
    return any(fnmatch.fnmatch(os.path.basename(path), g) or fnmatch.fnmatch(path, g) for g in NO_LOGIC + extra)


def initial_value(code_root, path, line, mutator):
    """True for a literal mutant on a field or constant declaration line (auto-equivalent, L-054)."""
    if mutator not in INITIAL_MUTATORS:
        return False
    try:
        text = open(os.path.join(code_root, path), encoding="utf-8", errors="replace").read().splitlines()[int(line) - 1]
    except (OSError, IndexError, ValueError):
        return False
    return bool(DECLARATION.match(text)) and (mutator != "StringLiteral" or bool(STATE_START.search(text)))


def java_class(path):
    m = re.search(r"src/main/(?:java|kotlin)/(.+)\.(?:java|kt)$", path)
    return m.group(1).replace("/", ".") if m else ""


def survivors(report_glob, code_root):
    """(basename, line, mutator) for every mutant no test killed, from PIT XML or Stryker JSON."""
    out = []
    for f in glob.glob(os.path.join(code_root, report_glob)):
        text = open(f, encoding="utf-8-sig", errors="replace").read()
        if f.endswith(".xml"):
            for m in re.finditer(r"<mutation [^>]*status='(SURVIVED|NO_COVERAGE)'[^>]*>(.*?)</mutation>", text, re.S):
                body = m.group(2)
                g = lambda t: (re.search(r"<%s>(.*?)</%s>" % (t, t), body, re.S) or [None, "?"])[1]
                out.append((g("sourceFile"), g("lineNumber"), g("mutator").split(".")[-1]))
        else:
            for path, data in json.loads(text).get("files", {}).items():
                for mu in data.get("mutants", []):
                    if mu.get("status") in ("Survived", "NoCoverage"):
                        out.append((os.path.basename(path), str(mu["location"]["start"]["line"]), mu.get("mutatorName", "?")))
    return out


def changed_lines(start, files, code_root):
    """{file: set of line numbers} the task added or changed since its start commit (new side of the diff)."""
    out = {}
    for f in files:
        diff = git(["diff", "-U0", start, "--", f], code_root)[1] if start else ""
        lines = set()
        for a, b in re.findall(r"^@@ -\S+ \+(\d+)(?:,(\d+))? @@", diff, re.M):
            lines.update(range(int(a), int(a) + (int(b) if b != "" else 1)))
        if lines or not start:
            out[f] = lines
    return out


def ranges(lines):
    """[(first, last)] runs of consecutive line numbers."""
    runs, prev = [], None
    for n in sorted(lines):
        if prev is not None and n == prev + 1:
            runs[-1][1] = n
        else:
            runs.append([n, n])
        prev = n
    return runs


def norm_code(text):
    return re.sub(r"\s+", " ", text or "").strip()


def line_text(code_root, path, line):
    try:
        return open(os.path.join(code_root, path), encoding="utf-8", errors="replace").read().splitlines()[int(line) - 1]
    except (OSError, IndexError, ValueError):
        return ""


def equivalent_entries(card_texts):
    """(file, line, code) per `## Equivalent mutants` bullet: `File.java:46`, optionally followed by the line's code in
    a second backtick group; with code, the entry also matches the line after it moves (no rerun for a moved line)."""
    out = []
    for text in card_texts:
        for bullet in section(text, "Equivalent mutants").splitlines():
            ticks = re.findall(r"`([^`]+)`", bullet)
            m = re.fullmatch(r"(?:.*/)?([\w.\-]+):(\d+)", ticks[0].strip()) if ticks else None
            if not m:
                continue
            code = norm_code(ticks[1]) if len(ticks) > 1 else ""
            out.append((m.group(1), m.group(2), code))
    return out


def is_equivalent(m, entries):
    base, line, _, text = m[0], m[1], m[2], m[3]
    return any(base == f and (line == n or (code and norm_code(text) == code)) for f, n, code in entries)


def run_mutation(s, code_root, changed, extra_args="", run_root=None, cancel=None):
    """Mutation run on the lines this task changed (changed = {file: line numbers}). Returns (SKIP|FAIL, detail) when
    nothing ran, else (None, raw): raw holds every surviving mutant on those lines with its code, judged later by
    judge_mutation, so a cached raw run can be re-judged without running again. Code the task did not touch is never
    mutated or reported. run_root: a private module copy to run in (beside the suites), else code_root."""
    run_root = run_root or code_root
    tooling = re.compile(r"(^|/)(stryker|vitest|karma|jest|playwright)[\w.-]*$|\.config\.\w+$|(^|/)index\.ts$")
    files = sorted(f for f in changed if f.startswith(s["prefix"]) and f.endswith(s["ext"]) and not tooling.search(f)
                   and changed[f] and not no_logic(f, s["exclude"]))
    if not files:
        return SKIP, "no changed %s lines under %s" % (s["ext"], s["prefix"])
    for f in glob.glob(os.path.join(run_root, s["report"])):
        os.remove(f)
    # Stryker takes file:first-last ranges; PIT takes classes and its survivors are filtered by line below
    rel = ["%s:%d-%d" % (f[len(s["prefix"]):], a, b) for f in files for a, b in ranges(changed[f])]
    cmd = s["cmd"].replace("{classes}", ",".join(filter(None, map(java_class, files)))).replace("{files}", ",".join(rel))
    t0 = time.time()
    rc, out = sh(cmd + extra_args, run_root, cancel=cancel)
    took = int(time.time() - t0)
    if rc == 130 and cancel is not None and cancel.is_set():
        return FAIL, "stopped: the related tests failed first · %ds" % took
    if not glob.glob(os.path.join(run_root, s["report"])):
        return FAIL, "no report (exit %s): %s · %ds" % (rc, out.strip()[-300:], took)
    mine = {(os.path.basename(f), str(n)) for f in files for n in changed[f]}
    path_of = {os.path.basename(f): f for f in files}
    found = []
    for m in survivors(s["report"], run_root):
        if (m[0], m[1]) not in mine:
            continue
        path = path_of.get(m[0], m[0])
        kind = "initial" if initial_value(code_root, path, m[1], m[2]) else "wiring" if bean_return(code_root, path, m[1], m[2]) else ""
        found.append([m[0], m[1], m[2], line_text(code_root, path, m[1]), kind])
    return None, {"files": len(files), "survivors": found, "took": took}


RETURN_MUTATORS = {"NullReturnValsMutator", "EmptyObjectReturnValsMutator"}


def bean_return(code_root, path, line, mutator):
    """True for a return-value mutant on the `return` line of a Spring @Bean method: the bean is null and the context
    does not start, which a narrow test set cannot see once a context is cached (auto-equivalent, shown to the
    auditor)."""
    if mutator not in RETURN_MUTATORS:
        return False
    try:
        lines = open(os.path.join(code_root, path), encoding="utf-8", errors="replace").read().splitlines()
        n = int(line) - 1
    except (OSError, ValueError):
        return False
    if not 0 <= n < len(lines) or not lines[n].strip().startswith("return "):
        return False
    for i in range(n - 1, max(-1, n - 40), -1):
        if re.match(r"\s*(?:(?:public|protected|private|static|final)\s+)*[\w.<>,\s]+\s+\w+\s*\(", lines[i])                 and not lines[i].strip().startswith(("return", "if", "for", "while", "new ")):
            return any("@Bean" in lines[j] for j in range(max(0, i - 4), i))
    return False


def mutate_reusable(local, head_full, code_root, rel_tracking):
    """A --mutate result stands for the full run while no production file and none of the test classes it ran changed
    since its tree: a fix to another test (a neighbour's poll, a pinned count) keeps it (SHAREDKERNEL/T-011 re-mutated
    for 168 s after a test-only fix). A cache entry without its test list needs the whole code unchanged."""
    rc, out, _ = git(["diff", "--name-only", local["tree"], head_full, "--"] + code_spec(rel_tracking), code_root)
    if rc != 0:
        return False
    changed = [l.strip() for l in out.splitlines() if l.strip()]
    if not changed:
        return True
    if "tests" not in local:
        return False
    test_like = re.compile(r"(^|/)src/test/|(^|/)e2e/|\.spec\.ts$|\.test\.ts$")
    ran = set(local["tests"])
    return all(test_like.search(f) and os.path.splitext(os.path.basename(f))[0] not in ran for f in changed)


def judge_mutation(raw, entries, reused=""):
    """P10 verdict of a raw run against the cards' current ## Equivalent mutants (auto-equivalent never fails, L-054)."""
    left = [m for m in raw["survivors"] if not m[4] and not is_equivalent(m, entries)]
    auto = [m for m in raw["survivors"] if m[4] and m[4] != "wiring"]
    wiring = [m for m in raw["survivors"] if m[4] == "wiring"]
    seen = "; auto (initial values, L-054): %s" % ", ".join("%s:%s %s" % tuple(m[:3]) for m in auto[:15]) if auto else ""
    seen += "; auto (bean wiring): %s" % ", ".join("%s:%s %s" % tuple(m[:3]) for m in wiring[:15]) if wiring else ""
    took = " · %ds%s" % (raw["took"], reused)
    if left:
        return FAIL, ("%d surviving mutants (add a test, or list `file:line` `code` with a reason under ## Equivalent "
                      "mutants): %s%s%s") % (len(left), "; ".join("%s:%s %s `%s`" % (m[0], m[1], m[2], norm_code(m[3]))
                                                                for m in left[:15]), seen, took)
    scope = " · tests: %s" % raw["tests"] if "tests" in raw else ""
    return OK, "%d files mutated; every mutant killed or listed equivalent%s%s%s" % (raw["files"], seen, scope, took)


def java_test_class(path):
    m = re.search(r"src/test/(?:java|kotlin)/(.+)\.(?:java|kt)$", path)
    return m.group(1).replace("/", ".") if m and re.search(r"(Test|Tests|IT)\.(?:java|kt)$", path) else ""


def local_mutation(cfg, tracking, code_root, rel_tracking, repo_prefix, tasks, extra_tests):
    """--mutate (L-060): mutation on the task's changed production lines, uncommitted work included, against the
    task's own test classes only. Minutes instead of the full run's whole-suite coverage pass. Writes nothing."""
    msuites = mutation_suites(cfg)
    if not msuites:
        print("MUTATE: config.md has no '## Mutation suites' table")
        return 1
    test_like = re.compile(r"(^|/)src/test/|(^|/)e2e/|\.spec\.ts$|\.test\.ts$")
    prod, tests, cards = {}, set(t for t in extra_tests.split(",") if t), []
    for full in tasks:
        key, tid = full.split("/")
        found = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
        card = open(found[0], encoding="utf-8").read() if found else ""
        cards.append(card)
        start = ((table_value(card, "Start commit") or "").split() or [""])[0]
        if not re.fullmatch(r"[0-9a-f]{7,40}", start):
            print("MUTATE: %s has no start commit" % full)
            return 1
        # the task's own commits plus uncommitted work; other tasks' commits in the range are not this task's
        commits = task_commits(start, code_root, rel_tracking)[0] or []
        names = set()
        for sha in [c for c, t in commits if t == [full]]:
            names |= {f[len(repo_prefix):] if repo_prefix and f.startswith(repo_prefix) else f
                      for f in git(["show", "--name-only", "--format=", sha], code_root)[1].split()}
        names |= set(git(["diff", "--name-only", "--relative", "HEAD", "--", "."], code_root)[1].split())
        untracked = set(git(["ls-files", "--others", "--exclude-standard", "--", "."], code_root)[1].split())
        for f in sorted(names | untracked):
            if f.startswith(rel_tracking + "/") or not os.path.isfile(os.path.join(code_root, f)):
                continue
            if test_like.search(f):
                tests.add(java_test_class(f))
            elif f in untracked:
                n = len(open(os.path.join(code_root, f), encoding="utf-8", errors="replace").read().splitlines())
                prod.setdefault(f, set()).update(range(1, n + 1))
            else:
                for g, ls in changed_lines(start, [f], code_root).items():
                    prod.setdefault(g, set()).update(ls)
    tests.discard("")
    entries, failed, raws = equivalent_entries(cards), False, {}
    print("# Local mutation (L-060) · tests: %s" % (", ".join(sorted(tests)) or "suite default"))
    for s in msuites:
        extra = " -DtargetTests=%s" % ",".join(sorted(tests)) if tests and "pitest" in s["cmd"] else ""
        r, raw = run_mutation(s, code_root, prod, extra)
        if r is None:
            raws[s["name"]] = dict(raw, tests="%d own test classes (--mutate)" % len(tests) if tests else "suite default")
            r, raw = judge_mutation(raw, entries)
        failed |= r == FAIL
        print("| %s | P10 mutation %s (local) | %s |" % (r, s["name"], raw))
    # The raw survivors are kept with a tree of the code they ran on (uncommitted work included): the full run reuses
    # them while its code equals that tree. Its covering tests are a superset of the task's own tests, and more tests
    # only kill more mutants, so a pass here is a pass there.
    tree = worktree_tree(code_root, rel_tracking)
    if raws and tree:
        cache_path = os.path.join(tracking, "preflight-cache.json")
        cache = json.load(open(cache_path, encoding="utf-8")) if os.path.exists(cache_path) else {}
        cache["local-mutation:" + "|".join(sorted(tasks))] = {
            "tree": tree, "mutation": raws, "tests": sorted(t.rsplit(".", 1)[-1] for t in tests)}
        json.dump(cache, open(cache_path, "w", encoding="utf-8"), indent=1)
        print("kept for the full run: code tree %s (reused while the code is unchanged)" % tree[:7])
    print("\nMUTATE: %s" % ("FAIL" if failed else "PASS"))
    return 1 if failed else 0


WRITE_SQL = re.compile(r"\b(?:insert\s+into|update|alter\s+table(?:\s+if\s+exists)?|delete\s+from)\s+(?:only\s+)?"
                       r"([a-z_]\w*(?:\.[a-z_]\w*)?)", re.I)
CREATE_SQL = re.compile(r"\bcreate\s+table\s+(?:if\s+not\s+exists\s+)?([a-z_]\w*(?:\.[a-z_]\w*)?)", re.I)
SQL_WORDS = {"set", "cascade", "restrict", "no", "nothing", "only"}


def migration_neighbours(start, files, code_root, repo_prefix):
    """{test FQCN: schema.table}: test classes naming a table that a migration the task adds writes or alters but did
    not create (seed rows, a new column). They count or pin that table's rows and break without any change to their
    files (PLATFORM/T-029: V1_009 seeded an eighth config_setting row; ConfigurationControllerIT pinned seven). A
    table name without an underscore must appear schema-qualified, so a plain word never matches."""
    tables = set()
    for f in sorted(files):
        if not MIGRATION.search(f) or not os.path.isfile(os.path.join(code_root, f)):
            continue
        if start and git(["cat-file", "-e", "%s:%s%s" % (start, repo_prefix, f)], code_root)[0] == 0:
            continue
        schema = f.split("/")[-2].lower()
        sql = re.sub(r"--[^\n]*", "", open(os.path.join(code_root, f), encoding="utf-8", errors="replace").read())
        created = {t.split(".")[-1].lower() for t in CREATE_SQL.findall(sql)}
        for t in WRITE_SQL.findall(sql):
            bare = t.split(".")[-1].lower()
            if bare not in created and bare not in SQL_WORDS:
                tables.add((t.split(".")[0].lower() if "." in t else schema, bare))
    out = {}
    for fq, (_, text) in sorted(test_sources(code_root).items()) if tables else []:
        for schema, bare in sorted(tables):
            if re.search(r"\b%s\.%s\b" % (schema, bare) if "_" not in bare else r"\b%s\b" % bare, text):
                out[fq] = "%s.%s" % (schema, bare)
                break
    return out


def task_names(start, code_root):
    """Files the task changed since its start commit, uncommitted and untracked work included (code-root relative)."""
    names = set(git(["diff", "--name-only", "--relative", start, "--", "."], code_root)[1].split())
    names |= set(git(["ls-files", "--others", "--exclude-standard", "--", "."], code_root)[1].split())
    return {f for f in names if os.path.isfile(os.path.join(code_root, f))}


def related_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, tasks, extra_tests):
    """The tests a task can break, cheapest first: its own test classes, config.md '## Always-run tests', the test
    classes that name a table its migrations write (migration_neighbours), and the covering tests of its changed
    production classes (covering_tests). Returns ({test command: {simple class name}}, {reason: count}) or
    (None, error)."""
    always = [r[0].strip().strip("`") for r in table_rows(section(cfg, "Always-run tests")) if r and r[0].strip()]
    paths = {fq: rel for fq, (rel, _) in test_sources(code_root).items()}
    picked, why = {}, {}

    def add(ref, reason):
        if ref and ref not in picked:
            picked[ref] = reason
            why[reason] = why.get(reason, 0) + 1
    for t in extra_tests.split(","):
        add(t.strip(), "--tests")
    for full in tasks:
        key, tid = full.split("/")
        found = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
        card = open(found[0], encoding="utf-8").read() if found else ""
        start = ((table_value(card, "Start commit") or "").split() or [""])[0]
        if not re.fullmatch(r"[0-9a-f]{7,40}", start):
            return None, "%s has no start commit" % full
        names = {f for f in task_names(start, code_root) if not f.startswith(rel_tracking + "/")}
        for f in sorted(names):
            if "/src/test/" in "/" + f and f.endswith((".java", ".kt")):
                add(f, "own")
        for t in always:
            add(t, "always-run")
        for fq in migration_neighbours(start, names, code_root, repo_prefix):
            add(paths.get(fq, fq), "migration neighbour")
        prod = [f for f in names if f.endswith((".java", ".kt")) and "/src/main/" in "/" + f]
        for fq in sorted(covering_tests(code_root, prod, set())):
            add(paths.get(fq, fq), "covering")
        for fq in sorted(neighbour_scan_tests(card, paths)):
            add(paths.get(fq, fq), "design-check neighbour")
        for fq in sorted(covering_tests(code_root, list_consumers(code_root, prod), set())):
            add(paths.get(fq, fq), "list consumer")
    by_cmd = {}
    for ref in picked:
        cls = os.path.splitext(os.path.basename(ref))[0] if "/" in ref else ref.rsplit(".", 1)[-1]
        if not java_test_class(ref) and "/" in ref:
            continue  # a support file under src/test (no Test/IT suffix) is not a test class
        by_cmd.setdefault(removal_command(cfg, code_root, ref) if "/" in ref else "", set()).add(cls)
    default = next((c for c in by_cmd if c), "")
    if not default:
        for d in sorted(glob.glob(os.path.join(code_root, "*", "pom.xml"))):
            default = removal_command(cfg, code_root, os.path.relpath(d, code_root).replace("\\", "/"))
            break
    by_cmd.setdefault(default, set()).update(by_cmd.pop("", set()))
    return {c: v for c, v in by_cmd.items() if c and v}, why


def run_related(by_cmd, code_root, cancel=None, run_root=None):
    """Runs each command of related_tests; returns [(result, command dir, detail)]."""
    rows = []
    for cmd, classes in by_cmd.items():
        t0 = time.time()
        rc, out = sh(cmd.replace("{tests}", ",".join(sorted(classes))), run_root or code_root, 1800, cancel)
        tail = " ".join(l.strip() for l in out.splitlines() if re.match(
            r"\[(?:INFO|ERROR)\] +(?:Tests run: \d+, F|\S+\.\S+ .*<<<)", l.strip()))[-600:]
        rows.append((OK if rc == 0 else FAIL, cmd.split("&&")[0].strip(), "%d classes · %ds · %s" % (
            len(classes), time.time() - t0, tail or "exit %d" % rc)))
    return rows


DEFER_BLOCKERS = re.compile(r"(^|/)(db/migration|migration)/|\.sql$|(^|/)application[^/]*\.(ya?ml|properties)$|"
                            r"(^|/)(pom\.xml|build\.gradle(\.kts)?|package(-lock)?\.json|angular\.json)$")


def defer_blockers(code_root, changed, tracking, cache_key, head_full, rel_tracking):
    """Why --defer-suites cannot stand in for the full suites here (rule 8f); empty = it can."""
    why = [f for f in changed if DEFER_BLOCKERS.search(f)]
    for f in changed:
        if f.endswith((".java", ".kt")) and "/src/main/" in f:
            try:
                if re.search(r"@(Component|Service|Repository|Configuration|Bean|RestController|Controller)\b",
                             open(os.path.join(code_root, f), encoding="utf-8").read()):
                    why.append(f + " (bean wiring)")
            except OSError:
                pass
    try:
        local = json.load(open(os.path.join(tracking, "preflight-cache.json"), encoding="utf-8")).get(
            "local-mutation:" + cache_key, {})
    except (OSError, ValueError):
        local = {}
    if not (local.get("tree") and mutate_reusable(local, head_full, code_root, rel_tracking)):
        why.append("no passing --mutate on this code")
    if why:
        print("# --defer-suites not allowed (full suites run): " + "; ".join(why[:5]))
    return why


def quick_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, tasks, extra_tests):
    """--quick: related_tests (own, always-run, migration neighbours, covering), uncommitted work included, one run
    per build module. The cheapest gate that finds a broken module rule, a pinned version or a pinned row count
    before --removals and the full run spend minutes on it (L-060)."""
    by_cmd, why = related_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, tasks, extra_tests)
    if by_cmd is None:
        print("QUICK: %s" % why)
        return 1
    print("# Quick tests · %s" % ", ".join("%s %d" % kv for kv in why.items()))
    rows = run_related(by_cmd, code_root)
    for r, where, detail in rows:
        print("| %s | quick %s | %s |" % (r, where, detail))
    failed = any(r == FAIL for r, _, _ in rows)
    print("\nQUICK: %s" % ("FAIL" if failed else "PASS"))
    return 1 if failed else 0


_TEST_SOURCES = {}


def test_sources(code_root):
    """{test class FQCN: (path, text)} for every Java/Kotlin test class under src/test (read once per run)."""
    if code_root in _TEST_SOURCES:
        return _TEST_SOURCES[code_root]
    out = _TEST_SOURCES[code_root] = {}
    for dirpath, dirnames, files in os.walk(code_root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        norm = dirpath.replace("\\", "/")
        if "/src/test/" not in norm + "/":
            continue
        for name in files:
            if name.endswith((".java", ".kt")):
                rel = os.path.relpath(os.path.join(dirpath, name), code_root).replace("\\", "/")
                fq = java_test_class(rel)
                if fq:
                    out[fq] = (rel, open(os.path.join(code_root, rel), encoding="utf-8", errors="replace").read())
    return out


def covering_tests(code_root, prod_files, own_tests):
    """Test classes that can kill a mutant in prod_files: the task's own, plus every test class that names a changed
    class or an interface it implements, or sits in a changed class's package (a test reaching it through Spring)."""
    names, packages = set(), set()
    for f in prod_files:
        cls = java_class(f)
        if not cls:
            continue
        names.add(cls.split(".")[-1])
        packages.add(cls.rsplit(".", 1)[0])
        try:
            text = open(os.path.join(code_root, f), encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        m = re.search(r"\bimplements\s+([\w.,\s<>]+?)\s*\{", text)
        if m:
            names.update(re.sub(r"<[^>]*>", "", n).strip().split(".")[-1] for n in m.group(1).split(",") if n.strip())
    if not names:
        return set(own_tests)
    pattern = re.compile(r"\b(?:%s)\b" % "|".join(sorted(map(re.escape, names))))
    found = set(t for t in own_tests if t)
    for fq, (_, text) in test_sources(code_root).items():
        if fq.rsplit(".", 1)[0] in packages or pattern.search(text):
            found.add(fq)
    return found


def neighbour_scan_tests(card, paths):
    """Test classes the card's Design check names in its neighbour scan (SHAREDKERNEL/T-011: a neighbour named there
    but never run failed only in the full suite). Matched by simple name against the test sources."""
    m = re.search(r"Neighbour scan\**\s*:?(.*?)(?:\n\s*\n|\Z)", section(card, "Design check"), re.S)
    if not m:
        return set()
    names = set(re.findall(r"\b([A-Z]\w*(?:Test|IT|Tests))\b", m.group(1)))
    return {fq for fq in paths if fq.rsplit(".", 1)[-1] in names}


def list_consumers(code_root, prod_files):
    """Production files that take a List<X> (Collection, Set, Iterable, ObjectProvider) by injection, for each type X
    a changed class implements or a @Bean method in it returns: one more X changes what they see (a schedule, a job
    type, a handler). SHAREDKERNEL/T-011: a new RecurringSchedule bean filled RecurringSchedulerRaceTest's poll."""
    types = set()
    for f in prod_files:
        try:
            text = open(os.path.join(code_root, f), encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        for m in re.finditer(r"\bimplements\s+([\w.,\s<>]+?)\s*\{", text):
            types.update(re.sub(r"<[^>]*>", "", n).strip().split(".")[-1] for n in m.group(1).split(",") if n.strip())
        types.update(re.findall(r"@Bean\b(?:\s*@\w+(?:\([^)]*\))?)*\s+(?:public\s+|static\s+)*([A-Z]\w*)(?:<[^>]*>)?\s+\w+\s*\(",
                                text))
    types.discard("")
    if not types:
        return []
    pattern = re.compile(r"\b(?:List|Collection|Set|Iterable|ObjectProvider)<\s*(?:%s)\b" % "|".join(
        sorted(map(re.escape, types))))
    out = []
    for d in glob.glob(os.path.join(code_root, "*", "src", "main")) + glob.glob(os.path.join(code_root, "src", "main")):
        for root, _, files in os.walk(d):
            for n in files:
                if not n.endswith((".java", ".kt")):
                    continue
                full = os.path.join(root, n)
                rel = os.path.relpath(full, code_root).replace("\\", "/")
                if rel in prod_files:
                    continue
                try:
                    if pattern.search(open(full, encoding="utf-8", errors="replace").read()):
                        out.append(rel)
                except OSError:
                    pass
    return out


# `- I7: no guard line: <reason>` -- an invariant with nothing to delete (a "never" kept by absence, a log rule)
NO_GUARD = re.compile(r"^\s*-\s*\*{0,2}(I\d+(?:\s*,\s*I\d+)*)\*{0,2}[^:`\n]*:\s*no guard\b[^:]*:\s*\S", re.I)
INVARIANT = re.compile(r"^\s*-\s*\*{0,2}(I\d+)\b", re.M)


def invariant_gaps(card):
    """Invariants of the Design check with no `## Removals` guard tagged `(In)` and no `- In: no guard line: <reason>`
    bullet. An invariant with no guard proven by a removal is how a test that passes with the mechanism removed
    reached the audit (SHAREDKERNEL/T-008, T-009, PLATFORM/T-029 audit 1: the at-most-once guard was listed against
    a test that did not exercise the race)."""
    declared = INVARIANT.findall(section(card, "Design check"))
    covered = set()
    for bullet in section(card, "Removals").splitlines():
        m = NO_GUARD.match(bullet)
        if m:
            covered.update(re.findall(r"I\d+", m.group(1)))
        elif bullet.strip().startswith("-"):
            covered.update(re.findall(r"\bI\d+\b", re.sub(r"`[^`]*`", "", bullet)))
    return [i for i in dict.fromkeys(declared) if i not in covered]


def lone_guard_problem(code_root, path, code):
    """A text check (no build) for guard lines whose deletion cannot compile: the only statement of a block that
    must return, or the last element of an argument list (the line before it then ends with a comma)."""
    m = re.match(r"(.*?)\s+@(\d+)$", code)
    code, nth = (m.group(1), int(m.group(2))) if m else (code, 1)
    try:
        lines = open(os.path.join(code_root, path), encoding="utf-8").read().splitlines()
    except OSError:
        return None
    hits = [i for i, l in enumerate(lines) if code.strip() in l]
    if len(hits) < nth:
        return None
    i = hits[nth - 1]
    prev = next((lines[j].strip() for j in range(i - 1, -1, -1) if lines[j].strip()), "")
    nxt = next((lines[j].strip() for j in range(i + 1, len(lines)) if lines[j].strip()), "")
    line = lines[i].strip()
    label = "%s:%d" % (os.path.basename(path), i + 1)
    if re.match(r"\)+;", line.split("//")[0].strip()[-2:]) and prev.endswith(","):
        return label + " ends an argument list"
    signature = re.match(r"^(?:(?:public|protected|private|static|final|synchronized|abstract|default)\s+)*"
                         r"(?!(?:if|for|while|switch|catch|return|new|else)\b)[\w<>\[\],.? ]+\s+\w+\([^;]*\)\s*"
                         r"(?:throws\s+[\w., ]+)?\{$", prev)
    if line.startswith(("return ", "throw ")) and signature and nxt.startswith("}") and not re.search(r"\bvoid\b", prev):
        return label + " is its method's only statement"
    if line.startswith(("return ", "throw ")) and re.match(r"^\}?\s*catch\s*\(.*\)\s*\{$", prev) and nxt.startswith("}"):
        return label + " is its catch block's only statement (the try's variable is then unassigned; use a no guard line)"
    return None


def guard_match_problem(code_root, path, code):
    """The --removals match rule (norm_code; ` @N` inside the code quote picks the Nth match) as a seconds-long text
    check for --lint, so an ambiguous guard is fixed before a removals run (SHAREDKERNEL/T-011 lost two runs)."""
    try:
        lines = open(os.path.join(code_root, path), encoding="utf-8", errors="replace").read().splitlines()
    except OSError:
        return "%s: file not found" % path
    nth = re.search(r"\s@(\d+)$", code)
    bare = code[:nth.start()] if nth else code
    hits = [i for i, l in enumerate(lines) if norm_code(bare) in norm_code(l)]
    if nth:
        k = int(nth.group(1))
        return None if 1 <= k <= len(hits) else "%s matches %d lines, none is match %d" % (
            removal_label(path, code), len(hits), k)
    return None if len(hits) == 1 else "%s matches %d lines" % (removal_label(path, code), len(hits))


def removal_entries(card):
    """(file, code, tests) per `## Removals` bullet: `path/File.java` `guard code` → `TestClass#method[, ...]`."""
    out, bad = [], []
    for bullet in section(card, "Removals").splitlines():
        if not bullet.strip().startswith("-") or NO_GUARD.match(bullet):
            continue
        ticks = re.findall(r"`([^`]+)`", bullet)
        if len(ticks) < 3:
            bad.append(bullet.strip()[:120])
            continue
        out.append((ticks[0].strip(), ticks[1], [t.strip() for t in ",".join(ticks[2:]).split(",") if t.strip()]))
    return out, bad


def removal_command(cfg, code_root, path):
    """The test command template ({tests} = Class#method,...) for a guard in path: config.md `## Removal suites`
    (Path prefix | Command), else the nearest Maven module above the file."""
    for r in table_rows(section(cfg, "Removal suites")):
        if len(r) >= 2 and path.startswith(r[0].strip()):
            return r[1]
    d = os.path.dirname(path)
    while d and not os.path.exists(os.path.join(code_root, d, "pom.xml")):
        d = os.path.dirname(d)
    if d and os.path.exists(os.path.join(code_root, d, "pom.xml")):
        return "cd %s && mvn -B -q -o test -Dtest={tests} -Dsurefire.failIfNoSpecifiedTests=false" % d
    return ""


def removal_label(f, code):
    return "%s `%s`" % (os.path.basename(f), norm_code(code)[:80])


def run_removals(cfg, tracking, code_root, rel_tracking, full, head_full, stamp, jobs=4):
    """--removals: for each `## Removals` guard, delete its line, run its named tests (they must fail), restore the
    file byte for byte. A positive control: the named tests pass on the unchanged code. A guard in a Maven module
    that can be copied alone (maven_module) runs in a private module copy, up to `jobs` copies side by side with the
    positive control among them, so the working tree is never edited; anything else runs in place, one at a time.
    Writes tracking/<KEY>/preflight/<T-NNN>-removals.md (with the code tree it ran on) and returns the exit code."""
    key, tid = full.split("/")
    found = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
    card = open(found[0], encoding="utf-8").read() if found else ""
    entries, bad = removal_entries(card)
    rows = [(FAIL, "removals syntax", "not `file` `code` → `Test#method`: " + b) for b in bad]
    if not entries:
        rows.append((FAIL, "removals", "card has no `## Removals` bullets"))
    groups = {}
    for f, code, tests in entries:
        groups.setdefault(removal_command(cfg, code_root, f), set()).update(tests)
    items = []  # (label, cmd, file or None, line index, original bytes, tests)
    for cmd, tests in groups.items():
        if not cmd:
            rows.append((FAIL, "positive control", "no test command for: " + ", ".join(sorted(tests))))
            continue
        items.append(("positive control", cmd.replace("{tests}", ",".join(sorted(tests))), None, None, None, tests))
    for f, code, tests in entries:
        path = os.path.join(code_root, f)
        label = removal_label(f, code)
        try:
            original = open(path, "rb").read()
        except OSError:
            rows.append((FAIL, label, "file not found: " + f))
            continue
        lines = original.decode("utf-8", errors="replace").splitlines(keepends=True)
        nth = re.search(r"\s@(\d+)$", code)
        bare = code[:nth.start()] if nth else code
        hits = [i for i, l in enumerate(lines) if norm_code(bare) in norm_code(l)]
        if nth and 1 <= int(nth.group(1)) <= len(hits):
            hits = [hits[int(nth.group(1)) - 1]]
        if len(hits) != 1:
            rows.append((FAIL, label, "guard code matches %d lines; quote more of it, or put ` @N` inside the "
                         "backticks for the Nth match, e.g. `ctx.extendLease(d); @2`" % len(hits)))
            continue
        items.append((label, removal_command(cfg, code_root, f).replace("{tests}", ",".join(tests)), f, hits[0],
                      original, tests))
    if any(r == FAIL for r, _, _ in rows):
        items = [i for i in items if i[2] is None]  # a broken card: only the positive control still runs

    def judge(item, rc, out, took):
        label, _, f, n, _, tests = item
        if f is None:
            return (OK if rc == 0 else FAIL, label, "named tests pass on the unchanged code" if rc == 0 else
                    "named tests fail before any removal (exit %s): %s" % (rc, out.strip()[-300:]))
        if re.search(r"COMPILATION ERROR|compilation failed|cannot find symbol", out):
            return FAIL, label, "removing line %d does not compile; name a guard line that can go alone%s" % (n + 1, took)
        if rc == 0:
            return FAIL, label, "line %d removed and %s still pass: the guard is untested%s" % (
                n + 1, ", ".join(tests), took)
        return OK, label, "line %d removed: %s failed (killed)%s" % (n + 1, ", ".join(tests), took)

    def run_in(root, item):
        """Deletes the guard line in root, runs the tests, restores the file; (rc, out, took, restored)."""
        label, cmd, f, n, original, _ = item
        if root != code_root:
            # a copy has new absolute paths, so Maven's incremental compiler would rebuild the whole module on each
            # copy's first run; timestamp staleness (mtimes kept by the copy) recompiles only the edited file
            cmd += " -Dmaven.compiler.useIncrementalCompilation=false"
        t0 = time.time()
        if f is None:
            rc, out = sh(cmd, root)
            return rc, out, " · %ds" % (time.time() - t0), True
        path = os.path.join(root, f)
        lines = original.decode("utf-8", errors="replace").splitlines(keepends=True)
        try:
            open(path, "wb").write("".join(lines[:n] + lines[n + 1:]).encode("utf-8"))
            rc, out = sh(cmd, root)
        finally:
            open(path, "wb").write(original)
        return rc, out, " · %ds" % (time.time() - t0), open(path, "rb").read() == original

    modules = {maven_module(i[1], code_root) for i in items}
    results = {}
    if items and "" not in modules and len(modules) == 1 and jobs > 1:
        module, work = modules.pop(), queue.Queue()
        for i, item in enumerate(items):
            work.put(i)
        workers = min(jobs, len(items))
        t_all = time.time()
        copies = [module_copy(code_root, module, "removals%d" % w) for w in range(workers)]

        def worker(root):
            while True:
                try:
                    i = work.get_nowait()
                except queue.Empty:
                    return
                rc, out, took, restored = run_in(root, items[i])
                results[i] = judge(items[i], rc, out, took) if restored else (
                    FAIL, items[i][0], "file not restored in the private copy %s" % root)
        threads = [threading.Thread(target=worker, args=(c,)) for c in copies]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        for c in copies:
            drop_copy(c)
        rows.append((INFO, "parallel", "%d items in %d private copies of %s · %ds (the working tree was not edited)"
                     % (len(items), workers, module, time.time() - t_all)))
    else:
        for i, item in enumerate(items):
            if any(r == FAIL for r, l, _ in results.values() if l == "positive control"):
                break  # in place, guards wait for a green positive control
            rc, out, took, restored = run_in(code_root, item)
            if not restored:
                results[i] = (FAIL, item[0], "file not restored: restore %s from git now" % item[2])
                break
            results[i] = judge(item, rc, out, took)
    control_failed = any(results[i][0] == FAIL for i in results if items[i][2] is None)
    for i in sorted(results):
        r, l, d = results[i]
        if control_failed and items[i][2] is not None:
            r, d = FAIL, "not judged: the positive control failed · " + d
        rows.append((r, l, d))
    verdict = "FAIL" if any(r == FAIL for r, _, _ in rows) else "PASS"
    text = "# Removals %s · code %s · %s · %s\n\n| Result | Guard | Detail |\n|---|---|---|\n" % (
        full, head_full, stamp, verdict) + "".join("| %s | %s | %s |\n" % (r, l, d.replace("|", "\\|").replace(
            "\n", " ")) for r, l, d in rows)
    print(text)
    out_dir = os.path.join(tracking, key, "preflight")
    os.makedirs(out_dir, exist_ok=True)
    open(os.path.join(out_dir, "%s-removals.md" % tid), "w", encoding="utf-8").write(text)
    print("report: %s/preflight/%s-removals.md\n\nREMOVALS: %s" % (key, tid, verdict))
    return 1 if verdict == "FAIL" else 0


def removals_stale(report_sha, head_full, entries, code_root, rel_tracking):
    """Files changed since the removals report that can change its result: production code and build files (anything
    not under a test tree), and the test classes the guards name. Other test files (a neighbour test's pinned count,
    shared test support) never make a guard live or dead, so they keep the report (PLATFORM/T-029 re-ran it twice
    for a test-only change). The working tree counts too, so --lint sees uncommitted changes."""
    named = {t.split("#")[0].strip().rsplit(".", 1)[-1] for _, _, tests in entries for t in tests}
    test_like = re.compile(r"(^|/)src/test/|(^|/)e2e/|\.spec\.ts$|\.test\.ts$")
    changed = set(git(["diff", "--name-only", "--relative", report_sha, "--"] + code_spec(rel_tracking),
                      code_root)[1].split())
    changed |= set(git(["ls-files", "--others", "--exclude-standard", "--"] + code_spec(rel_tracking),
                       code_root)[1].split())
    if head_full:
        changed |= set(git(["diff", "--name-only", "--relative", report_sha, head_full, "--"] + code_spec(rel_tracking),
                           code_root)[1].split())
    return sorted(f for f in changed if not test_like.search(f)
                  or os.path.splitext(os.path.basename(f))[0] in named)


def removals_row(tracking, card, full, head_full, code_root, rel_tracking):
    """P14: a card with `## Design check` lists `## Removals`, and the last --removals report killed every guard the
    card lists now, with no production code or named test changed since it ran (removals_stale)."""
    if "## Design check" not in card:
        return INFO, "P14 removals", "no Design check on the card"
    entries = removal_entries(card)[0]
    if not entries:
        return FAIL, "P14 removals", ("Design check without `## Removals`: list each guard as `file` `guard code` → "
                                      "`Test#method` (In), then run --removals (L-046)")
    gaps = invariant_gaps(card)
    if gaps:
        return FAIL, "P14 removals", ("invariants with no guard: %s. Tag each guard bullet with the invariant it keeps, "
                                      "`file` `guard code` → `Test#method` (I4), naming the test that exercises it (for "
                                      "a race: the interleaving test); or add `- I7: no guard line: <reason>`"
                                      % ", ".join(gaps))
    ambiguous = [p for f, code, _ in entries for p in [guard_match_problem(code_root, f, code)] if p]
    if ambiguous:
        return FAIL, "P14 removals", ("guard code must match exactly one line (quote more of it, or put ` @N` inside "
                                      "the backticks for the Nth match, e.g. `ctx.extendLease(d); @2`): %s"
                                      % "; ".join(ambiguous))
    lone = [p for f, code, _ in entries for p in [lone_guard_problem(code_root, f, code)] if p]
    if lone:
        return FAIL, "P14 removals", ("guard lines that cannot go alone (deleting them does not compile; name another "
                                      "line or write `- In: no guard line: <reason>`): %s" % "; ".join(lone))
    key, tid = full.split("/")
    path = os.path.join(tracking, key, "preflight", "%s-removals.md" % tid)
    if not os.path.exists(path):
        return FAIL, "P14 removals", "no removals report: run --removals"
    report = open(path, encoding="utf-8").read()
    m = re.search(r"code ([0-9a-f]{40}) .* (PASS|FAIL)\s*$", report.splitlines()[0] if report else "")
    if not m or m.group(2) != "PASS":
        return FAIL, "P14 removals", "the last --removals run failed: fix and re-run it"
    killed = {l for r, l, _ in (split_row(x) for x in report.splitlines() if x.startswith("| PASS |"))}
    missing = [removal_label(f, c) for f, c, _ in entries if removal_label(f, c) not in killed]
    if missing:
        return FAIL, "P14 removals", "guards not in the report %s: re-run --removals (%s)" % (
            m.group(1)[:7], "; ".join(missing[:5]))
    stale = removals_stale(m.group(1), head_full, entries, code_root, rel_tracking)
    if stale:
        return FAIL, "P14 removals", "production code or a named test changed since the removals report %s: re-run " \
                                     "--removals (%s)" % (m.group(1)[:7], ", ".join(stale[:6]))
    same = git(["diff", "--quiet", m.group(1), head_full, "--"] + code_spec(rel_tracking), code_root)[0] == 0
    return OK, "P14 removals", "every guard killed (report on %s, %s)" % (
        m.group(1)[:7], "no code change since" if same else "only other test files changed since")


DU_ID = re.compile(r"\b[A-Z][A-Z0-9_]*/DU-\d+\b")
DOC_GAP_TYPES = ("doc-gap", "doc-update", "doc-changed")


def header_col(text, name, default):
    first = next((l for l in text.splitlines() if l.strip().startswith("|")), "")
    header = split_row(first)
    return header.index(name) if name in header else default


def cell(cells, i):
    return cells[i] if i < len(cells) else ""


def doc_updates_row(tracking, card, full, lint):
    """P15: the task's doc updates are listed, exist, and none is left Failed (doc-impact-rules.md § 9)."""
    tid = full.split("/")[1]
    listed = set(DU_ID.findall(section(card, "Doc updates")))
    path = os.path.join(tracking, "doc-updates.md")
    text = open(path, encoding="utf-8").read() if os.path.exists(path) else ""
    c_status, c_kind, c_task = (header_col(text, "Status", 1), header_col(text, "Kind", 3),
                                header_col(text, "Task", 4))
    known, mine = set(), {}
    for cells in table_rows(text):
        m = DU_ID.search(cells[0]) if cells else None
        if not m:
            continue
        known.add(m.group(0))
        if re.search(r"\b" + re.escape(full) + r"\b", cell(cells, c_task)):
            mine[m.group(0)] = (cell(cells, c_status), cell(cells, c_kind))
    bad, waiting = [], []
    bad += ["%s not listed under ## Doc updates" % d for d in sorted(set(mine) - listed)]
    bad += ["%s missing from doc-updates.md" % d for d in sorted(listed - known)]
    for d, (status, kind) in sorted(mine.items()):
        if status.startswith("Failed"):
            bad.append("%s Failed: settle it with the user (docs approve / reject)" % d)
        elif status.strip() == "Rejected":
            bad.append("%s Rejected without a reason" % d)
        elif kind.strip() == "contract" and not status.startswith(("Verified", "Rejected")):
            (waiting if lint else bad).append("%s is a contract DU, %s: it must be Verified before Done"
                                              % (d, status or "no status"))
    gpath = os.path.join(tracking, "gaps.md")
    gtext = open(gpath, encoding="utf-8").read() if os.path.exists(gpath) else ""
    g_type, g_found, g_owner, g_status = (header_col(gtext, "Type", 1), header_col(gtext, "Found (date, agent, during)", 3),
                                          header_col(gtext, "Owner", 6), header_col(gtext, "Status", 8))
    key = full.split("/")[0]
    for cells in table_rows(gtext):
        # a bare T-NNN names this task only on a gap of the same key (AUTOAPPLY/T-010 is not SHAREDKERNEL/T-010)
        own_key = bool(cells) and cells[0].strip().startswith(key + "/")
        pattern = (re.escape(full) + "|(?<!/)" + re.escape(tid)) if own_key else re.escape(full)
        if (cell(cells, g_type).strip() in DOC_GAP_TYPES and not cell(cells, g_status).startswith("Closed")
                and re.search(r"\b(" + pattern + r")\b", cell(cells, g_found))
                and not DU_ID.search(cell(cells, g_owner)) and "DU-" not in cell(cells, g_owner)):
            bad.append("%s (%s) has no DU: queue it (doc-impact-rules.md § 1)" % (cells[0], cell(cells, g_type)))
    if bad:
        return FAIL, "P15 doc updates", "; ".join(bad)
    if waiting:
        return INFO, "P15 doc updates", "lint: " + "; ".join(waiting)
    return ((OK, "P15 doc updates", "%d DU(s) raised, all listed: %s" % (len(mine), ", ".join(
        "%s %s" % (d, v[0].split(" (")[0]) for d, v in sorted(mine.items())))) if mine
            else (OK, "P15 doc updates", "no doc updates raised"))


# single-instance types: a second bean of one makes every by-type injection ambiguous (L-061)
SINGLE_BEAN_TYPES = {"S3Client", "KmsClient", "SesClient", "SesV2Client", "SsmClient", "SqsClient", "SnsClient",
                     "SecretsManagerClient", "CognitoIdentityProviderClient", "HttpClient", "JsonMapper", "ObjectMapper",
                     "Clock", "DataSource", "JdbcClient", "PlatformTransactionManager"}
BEAN_DECL = re.compile(r"@Bean\b[^\n]*\n(?:\s*@[\w.]+(?:\([^)]*\))?\s*\n)*\s*"
                       r"(?:(?:public|protected|private|static|final)\s+)*([\w.]+)(?:<[^>\n]*>)?\s+(\w+)\s*\(")


def bean_types(code_root):
    """{simple type: [(file, method)]} for every @Bean method under src/main."""
    out = {}
    for dirpath, dirnames, files in os.walk(code_root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if "src" + os.sep + "main" not in dirpath and "src/main" not in dirpath:
            continue
        for name in files:
            if name.endswith((".java", ".kt")):
                p = os.path.join(dirpath, name)
                text = open(p, encoding="utf-8", errors="replace").read()
                if "@Bean" not in text:
                    continue
                rel = os.path.relpath(p, code_root).replace("\\", "/")
                for m in BEAN_DECL.finditer(text):
                    out.setdefault(m.group(1).split(".")[-1], []).append((rel, m.group(2)))
    return out


MIGRATION = re.compile(r"(^|/)db/migration/[^/]+/V(\d+)_(\d+)__[^/]*\.sql$")


def migration_order(start, mine, code_root, repo_prefix):
    """FAIL rows text for each migration the task adds at or below a version present at its start (L-014)."""
    bad = []
    for f in sorted(mine):
        m = MIGRATION.search(f)
        if not m or not os.path.isfile(os.path.join(code_root, f)):
            continue
        if git(["cat-file", "-e", "%s:%s%s" % (start, repo_prefix, f)], code_root)[0] == 0:
            continue
        folder = f[:f.rfind("/")]
        names = git(["ls-tree", "--name-only", start, "--", folder + "/"], code_root)[1].split()
        present = [(int(x.group(1)), int(x.group(2))) for n in names for x in [re.search(r"V(\d+)_(\d+)__", n)] if x]
        new = (int(m.group(2)), int(m.group(3)))
        if present and new <= max(present):
            bad.append("%s: V%d_%03d is not above the highest version at start V%d_%03d (use the next free version)"
                       % (f, new[0], new[1], max(present)[0], max(present)[1]))
        elif present:
            bad += pinned_versions(code_root, folder.rsplit("/", 1)[-1], max(present))
    return bad


def pinned_versions(code_root, schema, old):
    """A test line that names the schema and the old highest version ('1.007' or V1_007) still pins it after a new
    migration: it fails in the full run, so name it now (SHAREDKERNEL/T-009 pre-flight 1)."""
    lit = re.compile(r"(?<![\d.])(?:%d\.%03d|V%d_%03d)(?![\d])" % (old[0], old[1], old[0], old[1]))
    out = []
    for fq, (rel, text) in test_sources(code_root).items():
        for n, line in enumerate(text.splitlines(), 1):
            if schema in line and lit.search(line):
                out.append("%s:%d still pins %s %d.%03d (the new migration is the highest now)"
                           % (rel, n, schema, old[0], old[1]))
    return out


# ----------------------------------------------------------------------------- P0 doctor
def doctor(cfg, code_root, tracking):
    """Environment health in seconds, before any suite: start or repair what is safe to, fail with the fix
    otherwise. Every past environment failure (Docker down, verify worktree gone, Node below the CLI minimum,
    the shared test Postgres out of connections) is one row here."""
    rows = []
    # D1 Docker: start it (never install or reconfigure), wait up to 3 min
    rc, _ = sh("docker info --format {{.ServerVersion}}", code_root, 30)
    if rc != 0:
        starters = [r"C:\Program Files\Docker\Docker\Docker Desktop.exe"]
        for exe in starters:
            if os.path.exists(exe):
                subprocess.Popen([exe], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if not any(os.path.exists(e) for e in starters):
            sh("systemctl start docker || colima start", code_root, 120)
        for _ in range(36):
            time.sleep(5)
            rc, _ = sh("docker info --format {{.ServerVersion}}", code_root, 30)
            if rc == 0:
                break
        rows.append((OK, "D1 docker", "was down; started") if rc == 0 else
                    (FAIL, "D1 docker", "down and did not start within 3 min: start Docker Desktop"))
    else:
        rows.append((OK, "D1 docker", "running"))
    # D2 verify worktree named in config.md: recreate it when it is gone
    path = (table_value(section(cfg, "Verify worktree"), "Path") or "-").split()[0]
    if path in ("-", "", "<e.g."):
        rows.append((INFO, "D2 verify worktree", "none configured"))
    elif os.path.isdir(path):
        rows.append((OK, "D2 verify worktree", path))
    else:
        git(["worktree", "prune"], code_root)
        rc, out, err = git(["worktree", "add", "--detach", path, "HEAD"], code_root)
        rows.append((OK, "D2 verify worktree", "%s was gone; recreated at HEAD (run npm ci there)" % path) if rc == 0
                    else (FAIL, "D2 verify worktree", "%s missing and not recreated: %s" % (path, (err or out)[-200:])))
    # D3 Node meets every package.json engines.node minimum
    rc, out = sh("node -v", code_root, 30)
    have = tuple(int(x) for x in re.findall(r"\d+", out)[:3]) if rc == 0 else ()
    for pj in glob.glob(os.path.join(code_root, "*", "package.json")):
        want = (json.load(open(pj, encoding="utf-8")).get("engines") or {}).get("node", "")
        mins = [tuple(int(x) for x in m) for m in re.findall(r"[\^>=~]*(\d+)\.(\d+)\.(\d+)", want)]
        name = os.path.basename(os.path.dirname(pj))
        if not mins:
            continue
        ok = bool(have) and any(have >= m and (have[0] == m[0] or m is mins[-1]) for m in mins)
        rows.append((OK if ok else FAIL, "D3 node %s" % name, "node %s meets %s" % (out.strip(), want) if ok
                     else "node %s is below %s: upgrade Node" % (out.strip() or "missing", want)))
    # D4 shared test database: contexts x pool must stay under 80% of max_connections
    for f in glob.glob(os.path.join(code_root, "**", "src", "test", "**", "*.java"), recursive=True):
        text = open(f, encoding="utf-8", errors="replace").read()
        m = re.search(r"max_connections=(\d+)", text)
        iface = re.search(r"interface (\w+)", text)
        if not (m and iface):
            continue
        users = sum(1 for g in glob.glob(os.path.join(code_root, "**", "src", "test", "**", "*.java"), recursive=True)
                    if re.search(r"implements [^{]*\b%s\b" % iface.group(1), open(g, encoding="utf-8", errors="replace").read()))
        need, cap = users * 12, int(m.group(1))   # one Hikari pool (10) plus the job runner's spare per context
        rows.append((FAIL if need > cap * 0.8 else OK, "D4 shared test DB %s" % iface.group(1),
                     "%d classes x 12 connections = %d of max_connections %d%s" % (
                         users, need, cap, ": raise max_connections before the suite runs out" if need > cap * 0.8 else "")))
    return rows


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


def docs_only_with_wave(tracking):
    """config.md § Delivery has a `Docs-only commits` row saying they are pushed with the wave (user decision)."""
    path = os.path.join(tracking, "config.md")
    text = open(path, encoding="utf-8").read() if os.path.exists(path) else ""
    m = re.search(r"^\|\s*Docs-only commits\s*\|([^\n]*)", text, re.M | re.I)
    return bool(m and re.search(r"pushed with the wave", m.group(1), re.I))


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
        if not tasks and docs_only_with_wave(tracking) and files and all(
                f.startswith(("tech/", "features/")) or f.startswith(("../tech/", "../features/")) for f in files):
            warn.append("%s %s: docs-only commit, pushed with the wave (config.md § Delivery)" % (sha, subject[:50]))
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
    # a slice may hold tasks of several keys (KEY/T-NNN); a bare T-NNN belongs to the slice's own key
    listed = table_value(card, "Tasks") or ""
    tasks = [(k or key, t) for k, t in re.findall(r"(?<![\w/])(?:([A-Z][A-Z0-9]*)/)?(T-\d{3,})\b", listed)]
    gaps_md = os.path.join(tracking, "gaps.md")
    gaps = open(gaps_md, encoding="utf-8").read().splitlines() if os.path.exists(gaps_md) else []
    rows = []
    if not tasks:
        rows.append((FAIL, "S0 tasks", "slice card lists no tasks"))
    for tkey, tid in sorted(set(tasks)):
        name = "%s/%s" % (tkey, tid)
        tc = glob.glob(os.path.join(tracking, tkey, "tasks", tid + "-*.md"))
        if len(tc) != 1:
            rows.append((FAIL, "S1 " + name, "task card not found"))
            continue
        t = open(tc[0], encoding="utf-8").read()
        status = (table_value(t, "Status") or "?").split(" (")[0].strip()
        if status == "Dropped":
            rows.append((INFO, "S1 " + name, "Dropped"))
            continue
        ev = t.split("## Evidence", 1)[-1].split("## History", 1)[0]
        audited = re.search(r"audits/%s-audit-\d+\.md\)\s*PASS" % tid, ev) \
            or re.search(r"\[[^\]]*\bPASS[^\]]*\]\([^)]*audits/%s-audit-\d+\.md\)" % tid, ev) \
            or "audit skipped by user" in t
        ok = status in ("Done", "Verified") and bool(audited)
        rows.append((OK if ok else FAIL, "S1 " + name, "status %s; audit %s" % (status, "PASS linked" if audited else "no PASS link")))
        for g in gaps:
            cells = [c.strip() for c in g.split("|")]
            # a bare T-NNN belongs to this key only on this key's gap rows; elsewhere it needs KEY/T-NNN
            own_row = len(cells) > 1 and cells[1].startswith(tkey + "/")
            hit = re.search(r"(?<![\w/])%s/%s\b" % (re.escape(tkey), tid), g) or \
                (own_row and re.search(r"(?<![\w/])%s\b" % tid, g))
            if len(cells) > 9 and cells[3] in ("blocker", "major") and hit \
                    and not re.match(r"(Closed|Deferred|Rejected)", cells[9]):
                rows.append((FAIL, "S2 " + name, "open %s gap %s" % (cells[3], cells[1])))
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
    ap.add_argument("--doctor", action="store_true", help="environment health only (Docker, verify worktree, Node, "
                    "shared test DB headroom); starts or repairs what it safely can; seconds")
    ap.add_argument("--slice", default="", help="slice delivery gate: KEY/S-NN (slice-rules.md § 5)")
    ap.add_argument("--accept-count", default="", help="reason for accepting fewer tests than last time")
    ap.add_argument("--mutate", action="store_true", help="local mutation on the task's changed classes against its "
                    "own test classes only (L-060); uncommitted work included; writes nothing")
    ap.add_argument("--tests", default="", help="--mutate / --quick: extra test classes (comma-separated FQCNs)")
    ap.add_argument("--quick", action="store_true", help="the task's own test classes plus config.md "
                    "'## Always-run tests' (architecture rules, schema gates), uncommitted work included; minutes; "
                    "run it before --removals, --mutate and the full run; writes nothing")
    ap.add_argument("--removals", action="store_true", help="delete each `## Removals` guard line, run its named "
                    "tests (they must fail), restore the file; writes <T-NNN>-removals.md")
    ap.add_argument("--jobs", type=int, default=4, help="--removals: private module copies run side by side "
                    "(default 4; 1 = in place, one at a time)")
    ap.add_argument("--history", action="store_true", help="rebuild tracking/history.md from git and the reports")
    ap.add_argument("--history-start", default="", help="stamp the start clock of KEY/T-NNN (run at `start`)")
    ap.add_argument("--verbose", action="store_true", help="print every row; default prints FAIL/WARN rows and a "
                    "count of the rest (the report file always holds every row)")
    ap.add_argument("--defer-suites", action="store_true", help="per-task run: replace the full suites with the "
                    "related tests when the task adds no migration, bean wiring, config or build file and a passing "
                    "--mutate covers its code; the full suites run once at the wave or slice end (rule 8f)")
    ap.add_argument("--set-status", nargs=3, metavar=("KEY/T-NNN", "STATE", "REASON"),
                    help="paired write (rule 1a): card Status + History row + index row")
    ap.add_argument("--gap-du", nargs=3, metavar=("KEY/T-NNN", "GAP", "DU"),
                    help="paired write (rule 1a): GAP = 'type|severity|anchor|text|owner', "
                    "DU = 'level|kind|anchors|what|decided' (DU '-' = gap only)")
    ap.add_argument("--agent", default="claude-opus-5-5", help="--set-status / --gap-du attribution")
    a = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass
    tracking = os.path.abspath(a.tracking)
    # run from a git hook (post-commit lint), git exports GIT_DIR / GIT_INDEX_FILE for the hook's own repo; in a linked
    # worktree they point every git call here at the wrong index and status turns into a list of every file
    for v in ("GIT_DIR", "GIT_INDEX_FILE", "GIT_WORK_TREE", "GIT_PREFIX"):
        os.environ.pop(v, None)
    if a.set_status or a.gap_du:
        import paperwork
        if a.set_status:
            paperwork.set_status(tracking, *a.set_status, agent=a.agent)
        else:
            paperwork.gap_du(tracking, *a.gap_du, agent=a.agent)
        sys.exit(0)
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
    doctor_rows, doctor_fail = [], False
    if a.doctor or not (a.lint or a.audit_mode or a.push_check or a.slice or a.history or a.mutate or a.removals
                        or a.quick):
        doctor_rows = doctor(cfg, code_root, tracking)
        doctor_fail = any(r == FAIL for r, _, _ in doctor_rows)
    if a.doctor:
        print("| Result | Check | Detail |\n|---|---|---|")
        for r, l, d in doctor_rows:
            print("| %s | %s | %s |" % (r, l, d))
        print("\nDOCTOR: %s" % ("FAIL" if doctor_fail else "PASS"))
        sys.exit(1 if doctor_fail else 0)
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
    if a.quick:
        sys.exit(quick_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, a.task, a.tests))
    if a.mutate:
        sys.exit(local_mutation(cfg, tracking, code_root, rel_tracking, repo_prefix, a.task, a.tests))
    if a.removals:
        sys.exit(max(run_removals(cfg, tracking, code_root, rel_tracking, t, head_full, stamp, a.jobs) for t in a.task))
    test_like = re.compile(r"(^|/)src/test/|(^|/)e2e/|\.spec\.ts$|\.test\.ts$|(^|/)playwright\.config\.ts$")

    per_task, all_changed, all_owned, cards_seen, task_starts = {}, set(), set(), [], []
    for full in a.task:
        key, tid = full.split("/")
        rows = []
        cards = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
        cards_seen += cards[:1]
        card = open(cards[0], encoding="utf-8").read() if len(cards) == 1 else ""
        if not card:
            rows.append((FAIL, "P0 card", "task card not found"))
        status = (table_value(card, "Status") or "?").split(" (")[0]
        start = ((table_value(card, "Start commit") or "").split() or [""])[0]
        adopted = status.startswith("Adopted")

        rc, out, err = git(["status", "--porcelain", "-uall", "--", ".", ":(exclude)%s" % rel_tracking], code_root)
        dirty = out.rstrip()  # keep the leading space of " M path": the path starts at column 3
        if a.lint:
            loose = [l[3:].strip() for l in dirty.splitlines()
                     if any(fnmatch.fnmatch(l[3:].strip().lower(), "*" + p[1:]) for p in NON_CODE)]
            if loose:
                rows.append((FAIL, "P1 clean tree", "commit these before --removals and the full run (the full run "
                             "fails on an uncommitted file): " + ", ".join(loose[:10])))
            else:
                rows.append((INFO, "P1 clean tree", "lint: uncommitted work is checked as part of the task"
                             if dirty.strip() else "clean"))
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
        if re.fullmatch(r"[0-9a-f]{7,40}", start):
            # a file the task added and then removed (a rename inside the task) is no change: no Touches line needed
            mine = {f for f in mine if os.path.exists(os.path.join(code_root, f))
                    or git(["cat-file", "-e", "%s:%s%s" % (start, repo_prefix, f)], code_root)[0] == 0}
            bad_mig = migration_order(start, mine, code_root, repo_prefix)
            rows.append((FAIL if bad_mig else OK, "P12 migrations", "; ".join(bad_mig) if bad_mig else
                         "%d added migration(s), each above the versions present at start"
                         % sum(1 for f in mine if MIGRATION.search(f))))
            neighbours = migration_neighbours(start, mine, code_root, repo_prefix)
            if neighbours:
                rows.append((INFO, "P16 migration neighbours", "test classes naming a table this task's migrations "
                             "write; list them in the design check's neighbour scan (--quick and the full run run "
                             "them first): " + ", ".join("%s (%s)" % (fq.rsplit(".", 1)[-1], t)
                                                         for fq, t in sorted(neighbours.items()))))
        java_mine = [f for f in mine if f.endswith((".java", ".kt")) and "/src/main/" in "/" + f]
        if java_mine:
            beans = bean_types(code_root)
            dup = sorted("%s (%s)" % (t, ", ".join("%s#%s" % x for x in decl)) for t, decl in beans.items()
                         if t in SINGLE_BEAN_TYPES and len(decl) > 1 and any(x[0] in java_mine for x in decl))
            rows.append((FAIL if dup else OK, "P13 bean types",
                         ("second bean of a single-instance type; keep the client private to its adapter (L-061): "
                          + "; ".join(dup)) if dup else "no second bean of a single-instance type"))
        if not adopted:
            rows.append(removals_row(tracking, card, full, head_full, code_root, rel_tracking))
        rows.append(doc_updates_row(tracking, card, full, a.lint))
        all_changed |= mine
        task_starts.append((start, sorted(mine)))
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
        # P11: Stryker never mutates .html templates, so each behaviour binding in a changed template is
        # mapped on the card to a spec test that exists (AUTOAPPLY/T-111: [disabled] and focus bindings)
        html = sorted(f for f in mine if f.endswith(".html") and os.path.isfile(os.path.join(code_root, f)))
        if html and not adopted:
            mapped, specs = section(card, "Template bindings"), None
            missing = []
            for f in html:
                # only lines this task added or changed (start commit → working tree), never older bindings
                diff = git(["diff", "-U0", start, "--", f], code_root)[1] if start else ""
                text = "\n".join(l[1:] for l in diff.splitlines() if l.startswith("+") and not l.startswith("+++"))
                for b in sorted(set(re.findall(TEMPLATE_BINDINGS, text))):
                    # a line naming this template wins, so one binding on two pages maps to two tests
                    cands = [l for l in mapped.splitlines() if b in l]
                    line = next((l for l in cands if os.path.basename(f) in l), cands[0] if cands else "")
                    test = (re.findall(r"→\s*`([^`]+)`", line) or [""])[0]
                    if not test:
                        missing.append("%s: `%s` not mapped" % (os.path.basename(f), b))
                        continue
                    if specs is None:
                        specs = "".join(open(p, encoding="utf-8", errors="replace").read() for p in
                                        glob.glob(os.path.join(code_root, "**", "*.spec.ts"), recursive=True)
                                        if "node_modules" not in p)
                    if test not in specs:
                        missing.append("%s: test `%s` not found in any spec" % (os.path.basename(f), test))
            rows.append((FAIL if missing else OK, "P11 template bindings",
                         ("%d to map under ## Template bindings as `<file>`: `<binding>` → `<test name>`: %s"
                          % (len(missing), "; ".join(missing)))
                         if missing else "%d changed templates, every behaviour binding mapped to a spec test" % len(html)))
        if task_head == head_full:
            reuse = (INFO, "P5 reuse", "tree = task head %s: suite counts reusable" % task_head[:7])
        else:
            same = git(["diff", "--quiet", task_head, head_full, "--"] + code_spec(rel_tracking),
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
    elif any(r == FAIL for _, _, rows, _ in per_task.values() for r, _, _ in rows) or doctor_fail:
        # fail fast: a paperwork or environment FAIL is fixed in seconds; never spend the suites' minutes on it
        tests = [(FAIL, "P5 tests", "not run: fix the FAIL rows above (or the doctor rows) first; `--lint` "
                  "re-checks them in seconds")]
        stack = (INFO, "P6 local stack", "not run (fail fast)")
    elif a.defer_suites and not defer_blockers(code_root, all_changed, tracking, "|".join(sorted(a.task)),
                                                 head_full, rel_tracking):
        by_cmd, why = related_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, a.task, "")
        tests = [(r, "P5 related tests", "%s: %s" % (where, d)) for r, where, d in run_related(by_cmd or {}, code_root)]
        if not tests:
            tests = [(FAIL, "P5 related tests", "no related test found: run without --defer-suites")]
        tests.append((INFO, "P5 suites", "deferred to the wave or slice end (--defer-suites, rule 8f): no migration, "
                      "bean wiring, config or build file in the diff"))
        local = json.load(open(os.path.join(tracking, "preflight-cache.json"), encoding="utf-8")).get(
            "local-mutation:" + "|".join(sorted(a.task)), {})
        entries = equivalent_entries(open(p, encoding="utf-8").read() for p in cards_seen)
        for name, raw in local.get("mutation", {}).items():
            r, d = judge_mutation(raw, entries, " · reused from --mutate (code tree %s)" % local["tree"][:7])
            tests.append((r, "P10 mutation %s" % name, d))
        stack = (lambda r: (r[0], "P6 local stack", r[1]))(check_stack(cfg, code_root))
    else:
        counts_path = os.path.join(tracking, "preflight-counts.json")
        counts = json.load(open(counts_path, encoding="utf-8")) if os.path.exists(counts_path) else {}
        tests, cfg_suites = [], suites(cfg)
        if not cfg_suites:
            tests.append((FAIL, "P5 tests", "config.md needs a '## Preflight suites' table"))
        # a full run on code identical to the cached run (only tracking/ changed) reuses its results (rule 8c)
        cache_path = os.path.join(tracking, "preflight-cache.json")
        cache = json.load(open(cache_path, encoding="utf-8")) if os.path.exists(cache_path) else {}
        cache_key = "|".join(sorted(a.task))
        cached = cache.get(cache_key) or {}
        same_code = bool(cached) and git(["diff", "--quiet", cached.get("head", ""), head_full, "--"]
                                         + code_spec(rel_tracking), code_root)[0] == 0
        reused = " · reused from %s (no code change since)" % cached.get("head", "")[:7] if same_code else ""
        # independent suites run side by side (config.md: no two suites share a build dir or report file)
        required = [s for s in cfg_suites if suite_required(s, all_changed, all_owned)]
        cached_suites = cached.get("suites", {}) if same_code else {}
        cached_mut = cached.get("mutation", {}) if same_code else {}
        entries = equivalent_entries(open(p, encoding="utf-8").read() for p in cards_seen)
        # a passing --mutate on exactly this code stands for the full run's mutation (rule 8c): the full run's covering
        # tests include the task's own, so they kill at least every mutant those killed
        local = cache.get("local-mutation:" + cache_key) or {}
        mut_note = {}
        if local.get("tree") and mutate_reusable(local, head_full, code_root, rel_tracking):
            for name, raw in local.get("mutation", {}).items():
                if name not in cached_mut and judge_mutation(raw, entries)[0] == OK:
                    cached_mut[name] = raw
                    mut_note[name] = " · reused from --mutate (code tree %s, same code)" % local["tree"][:7]
        # mutation inputs come first: a Maven mutation suite runs beside the test suites, not after them
        prod = {}
        for t_start, t_files in task_starts:
            for f, ls in changed_lines(t_start, [f for f in t_files if not test_like.search(f)], code_root).items():
                prod.setdefault(f, set()).update(ls)
        msuites = mutation_suites(cfg)
        own_tests = {java_test_class(f) for _, t_files in task_starts for f in t_files}
        cover = covering_tests(code_root, [f for f in prod if f.endswith((".java", ".kt"))], own_tests)
        cover.discard("")

        def mutate(s, run_root=None, cancel=None):
            if s["name"] in cached_mut:
                return None, cached_mut[s["name"]], mut_note.get(s["name"], reused)
            # covering tests only: minutes instead of the whole suite's coverage pass (rule 8c)
            extra = " -DtargetTests=%s" % ",".join(sorted(cover)) if cover and "pitest" in s["cmd"] else ""
            r, raw = run_mutation(s, code_root, prod, extra, run_root, cancel)
            if r is not None:
                return r, raw, ""
            raw["tests"] = "%d covering classes" % len(cover) if extra else "suite default"
            return None, raw, ""
        mut_done = {}
        if required and all(cached_suites.get(s["name"], [FAIL])[0] == OK for s in required):
            done = {n: (r, d + reused, t) for n, (r, d, t) in cached_suites.items()}
        else:
            # Three things at once, each in its own build dir: the suites in the tree; the related tests (own,
            # always-run, migration neighbours, covering) in a private module copy, which stop the suites when they
            # fail; each Maven mutation suite in its own copy (the backend suite starts with `clean`). A failing
            # pre-flight ends at the related tests' time; a passing one costs the slowest of the three.
            cancel, copies, beside = threading.Event(), [], {}
            by_cmd, why = related_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, a.task, "") \
                if required else ({}, {})
            rel_mods = {maven_module(c, code_root) for c in by_cmd or {}}
            related_root = None
            if by_cmd and len(rel_mods) == 1 and "" not in rel_mods:
                related_root = module_copy(code_root, next(iter(rel_mods)), "related")
                copies.append(related_root)
            for s in msuites if required and prod else []:
                mod = maven_module(s["cmd"], code_root)
                if mod and s["name"] not in cached_mut:
                    beside[s["name"]] = module_copy(code_root, mod, "mutation")
                    copies.append(beside[s["name"]])
            try:
                with ThreadPoolExecutor(max_workers=max(1, len(required) + len(beside))) as pool:
                    suite_f = {s["name"]: pool.submit(run_suite, s, code_root, counts, a.accept_count, head_full,
                                                      cancel) for s in required}
                    mut_f = {s["name"]: pool.submit(mutate, s, beside[s["name"]], cancel)
                             for s in msuites if s["name"] in beside}
                    if related_root:
                        rel_rows = run_related(by_cmd, code_root, cancel, related_root)
                        rel_fail = any(r == FAIL for r, _, _ in rel_rows)
                        if rel_fail:
                            cancel.set()
                        tests.append((FAIL if rel_fail else OK, "P5 related tests", "%s · %s" % (
                            ", ".join("%s %d" % kv for kv in why.items()),
                            "; ".join("%s: %s" % (w, d) for _, w, d in rel_rows))))
                    elif by_cmd:
                        tests.append((INFO, "P5 related tests", "not run first: the module cannot be copied alone"))
                    done = {n: f.result() for n, f in suite_f.items()}
                    mut_done = {n: f.result() for n, f in mut_f.items()}
            finally:
                for c in copies:
                    drop_copy(c)
            cached = {"head": head_full, "suites": {}, "mutation": {}}
        cached["suites"] = {n: [r, d.split(" · reused from ")[0], t] for n, (r, d, t) in done.items()}
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
        # P10 is judged only on green tests: a mutant run over failing tests says nothing
        if all(t[0] != FAIL for t in tests):
            if not msuites:
                tests.append((INFO, "P10 mutation", "config.md has no '## Mutation suites' table"))
            # the rest (cached, or not a copyable Maven module, e.g. Stryker) run now, side by side
            rest = [s for s in msuites if s["name"] not in mut_done]
            with ThreadPoolExecutor(max_workers=max(1, len(rest))) as pool:
                mut_done.update(zip([s["name"] for s in rest], pool.map(mutate, rest)))
            cached["mutation"] = {}
            for s in msuites:
                r, raw, note = mut_done[s["name"]]
                if r is None:
                    cached["mutation"][s["name"]] = raw
                    r, raw = judge_mutation(raw, entries, note)
                tests.append((r, "P10 mutation %s" % s["name"], raw))
        if all(t[0] != FAIL for t in tests if t[1].startswith("P5")):
            cache[cache_key] = cached
            json.dump(cache, open(cache_path, "w", encoding="utf-8"), indent=1)
    # P5 is the test suites alone; P10 rows ride in `tests` but never count as a suite result
    p5 = FAIL if any(t[0] == FAIL and t[1].startswith("P5") for t in tests) else (INFO if a.audit_mode or a.lint else OK)

    failed = False
    print("# Pre-flight · head %s · %s%s" % (head, stamp, " · audit mode" if a.audit_mode else ""))
    for full, (key, tid, rows, task_head) in per_task.items():
        p1 = next((r for r, l, _ in rows if l == "P1 clean tree"), OK)
        builtin = {"P1": p1, "P5": p5, "P6": stack[0]}
        builtin.update({l.split()[0]: r for r, l, _ in rows if l.startswith(("P12 ", "P13 "))})
        rows = doctor_rows + rows + tests + [stack] + lesson_checks(tracking, key, code_root, builtin)
        verdict = "FAIL" if any(r == FAIL for r, _, _ in rows) else "PASS"
        failed |= verdict == "FAIL"
        lines = ["# Pre-flight %s · head %s · %s · %s%s" % (full, task_head, stamp, verdict,
                                                           " · audit mode" if a.audit_mode else ""),
                 "", "| Result | Check | Detail |", "|---|---|---|"]
        lines += ["| %s | %s | %s |" % (r, l, d.replace("\n", " ").replace("|", "\\|")) for r, l, d in rows]
        text = "\n".join(lines) + "\n"
        if a.verbose:
            print("\n" + text)
        else:
            shown = [l for l in lines[4:] if l.startswith(("| FAIL", "| WARN"))]
            print("\n" + "\n".join(lines[:4] + shown))
            print("(%d other rows PASS/INFO/SKIPPED; --verbose or the report file shows them)" % (len(lines) - 4 - len(shown)))
        # a fail-fast run (suites not run) writes no report, so it never replaces a real run's report
        fast = any(l == "P5 tests" and d.startswith("not run") for _, l, d in rows)
        if not (a.audit_mode or a.lint or fast):
            out_dir = os.path.join(tracking, key, "preflight")
            os.makedirs(out_dir, exist_ok=True)
            path = os.path.join(out_dir, "%s-%s.md" % (tid, task_head[:7]))
            open(path, "w", encoding="utf-8").write(text)
            print("report: %s" % os.path.relpath(path, tracking).replace("\\", "/"))
    print("\n%s: %s" % ("LINT" if a.lint else "PRE-FLIGHT", "FAIL" if failed else "PASS"))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
