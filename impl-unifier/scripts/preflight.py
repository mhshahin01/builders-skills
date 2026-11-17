#!/usr/bin/env python3
"""impl-unifier pre-flight: the mechanical checks that run before any audit is spent.

Usage:
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN [--task ...]     # before In review
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --audit-mode     # auditor re-check
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --lint           # builder, right after coding
  python preflight.py --tracking <tracking dir> --task KEY/T-NNN --quick          # builder, task tests + always-run tests
  python preflight.py --tracking <tracking dir> --push-check                      # before an auto push

Checks per task (rows: PASS / FAIL / INFO / SKIPPED; any FAIL fails the run):
  P1 clean tree      code root has no uncommitted or untracked change outside tracking/
  P2 commits         start commit is an ancestor of HEAD; no merges; every code commit since it has
                     exactly one `Task:` trailer (git trailer parsing); at least one is this task's
  P3 status          card Status equals index.md and is In progress, In review or Adopted
  P4 owned items     every Owns bullet parses and its item exists (types, files, migrations, tables,
                     endpoints, screens, jobs); unparsable bullets or no items FAIL
  P5 related tests   the --quick set (own, always-run, migration neighbours, covering tests), reused from a passing
                     --quick on the same code; no full suites, no mutation, no removals run
  P6 local stack     every compose service running and healthy (when a compose file is configured)
  P7 lesson checks   every Active/Promoted lesson is covered by a checks.json entry (command, builtin
                     row, or judgement note); commands run with pipefail; errors and hidden stderr FAIL
  P8 task isolation  files changed by this task's commits are its own (Owns) or declared under
                     `## Touches`; nothing else
  P9 risk floor      a high-risk pattern on a line the task changed needs Risk high; one elsewhere in a file the
                     task touches needs at least medium; unless the card quotes the user
  P19 tests map      every clause under the card's `## Tests` names a test that exists (`Class#method`,
                     `file.spec.ts#test name` or a bare test method), once the task has a code commit (L-046)
  P12 migrations     a migration the task adds has a version above every version present at its start (L-014),
                     and no test line still pins the schema's previous highest version
  P13 bean types     a bean the task declares is not a second bean of a single-instance type (L-061)
  P16 neighbours     INFO: test classes that name a table the task's added migrations write or alter (seed rows,
                     columns); --quick and the pre-flight run them
  P15 doc updates    every DU the task raised (doc-updates.md, Task column) is listed under the card's
                     `## Doc updates` and exists; none is Failed or Rejected without a reason; a `contract` DU is
                     Verified; every doc-owned gap of the task has a DU (doc-impact-rules.md § 9)
The report is printed and, outside --audit-mode and --lint, written to tracking/<KEY>/preflight/<T-NNN>-<short task head>.md.
The task head is the task's own last code `Task:` commit (repo HEAD for Adopted); line 1 carries its full sha.
Never edits code or docs.
"""
import argparse
import hashlib
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

OK, FAIL, INFO, SKIP, WARN = "PASS", "FAIL", "INFO", "SKIPPED", "WARN"
# files that are never code: a commit of only these never makes the --quick result stale
NON_CODE = ("*.md", "*.pdf", "*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.docx", "*.pptx", "*.xlsx", ".gitignore")


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
                    out, _ = p.communicate()
                    return 124, (out or "") + "\ntimeout after %ss (process tree killed)" % timeout
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
        # one kind per line: `- class `A`, interface `B`` would file B as a class
        if not m or not names or re.search(r"`\s*,\s*[a-z]+\s+`", s) or "..." in "".join(names):
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
def java_class(path):
    m = re.search(r"src/main/(?:java|kotlin)/(.+)\.(?:java|kt)$", path)
    return m.group(1).replace("/", ".") if m else ""


def java_test_class(path):
    m = re.search(r"src/test/(?:java|kotlin)/(.+)\.(?:java|kt)$", path)
    return m.group(1).replace("/", ".") if m and re.search(r"(Test|Tests|IT)\.(?:java|kt)$", path) else ""


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


def related_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, tasks, extra_tests, own_only=False):
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
        if own_only:
            continue
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
        by_cmd.setdefault(test_command(cfg, code_root, ref) if "/" in ref else "", set()).add(cls)
    default = next((c for c in by_cmd if c), "")
    if not default:
        for d in sorted(glob.glob(os.path.join(code_root, "*", "pom.xml"))):
            default = test_command(cfg, code_root, os.path.relpath(d, code_root).replace("\\", "/"))
            break
    by_cmd.setdefault(default, set()).update(by_cmd.pop("", set()))
    return {c: v for c, v in by_cmd.items() if c and v}, why


QUICK_TIMEOUT = int(os.environ.get("PREFLIGHT_QUICK_TIMEOUT", "900"))  # a healthy --quick takes 2-6 min


def hung_classes(out):
    """Surefire prints `Running X` when a class starts and `Tests run: ... - in X` when it ends: the classes
    started but never ended are the ones that hung."""
    started = re.findall(r"\[INFO\] Running (\S+)", out)
    ended = set(re.findall(r"Tests run: .* - in (\S+)", out))
    return [c.rsplit(".", 1)[-1] for c in started if c not in ended]


FLAKE_CTX = {}  # {"cfg", "tracking"}: set by main for the flake re-run
FLAKE_MAX = 3   # more failing classes than this is a real break, never re-run as flakes


def failed_classes(out, report_files=()):
    """Simple names of the test classes that failed or errored, from surefire console lines or JUnit XML reports."""
    names = set(c.rsplit(".", 1)[-1] for c in re.findall(r"<<< (?:FAILURE|ERROR)!\s*-+\s*in (\S+)", out))
    names |= set(c.rsplit(".", 1)[-1] for c in re.findall(
        r"Tests run: .*(?:Failures: [1-9]|Errors: [1-9]).* - in (\S+)", out))
    for f in report_files:
        try:
            x = open(f, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        if "<failure" in x or "<error" in x:
            m = re.search(r'<testsuite\b[^>]*\bname="([^"]+)"', x)
            if m:
                names.add(m.group(1).rsplit(".", 1)[-1])
    return sorted(names)


def flake_rerun(classes, code_root, mode):
    """Cause (5) of the S-17 wave-3 report: a class that fails inside a run (test order, a container start-up time-out
    such as LocalStack) but passes when run alone once is a flake, not a break. Re-runs each failing class alone, once;
    returns (all passed alone, detail). Each flake is appended to tracking/flakes.md and the close-out logs it as a
    gap. More than FLAKE_MAX failing classes, or one that fails alone, is a real FAIL; nothing is retried twice."""
    cfg, tracking = FLAKE_CTX.get("cfg"), FLAKE_CTX.get("tracking")
    if not cfg or not classes or len(classes) > FLAKE_MAX:
        return False, ""
    # a class the task itself added or changed is never a flake: its failure is the builder's bug (T-159 shared-DB test)
    own = sorted(set(classes) & FLAKE_CTX.get("own", set()))
    if own:
        return False, "%s: the task's own test class, not a flake" % ", ".join(own)
    paths = {fq.rsplit(".", 1)[-1]: rel for fq, (rel, _) in test_sources(code_root).items()}
    passed = []
    for c in classes:
        cmd = test_command(cfg, code_root, paths[c]) if c in paths else ""
        if not cmd:
            return False, "%s: no command to run it alone" % c
        rc, _ = sh(cmd.replace("{tests}", c), code_root, QUICK_TIMEOUT)
        if rc != 0:
            return False, "%s also fails alone" % c
        passed.append(c)
    try:
        with open(os.path.join(tracking, "flakes.md"), "a", encoding="utf-8") as f:
            for c in passed:
                f.write("| %s | %s | %s | failed in the run, passed alone |\n" % (
                    datetime.date.today().isoformat(), c, mode))
    except OSError:
        pass
    return True, "flake: %s failed in the run and passed alone (tracking/flakes.md)" % ", ".join(passed)


def run_related(by_cmd, code_root, cancel=None, run_root=None):
    """Runs each command of related_tests; returns [(result, command dir, detail)]. A class that fails in the set but
    passes alone once is a flake (flake_rerun): WARN, not FAIL."""
    rows = []
    for cmd, classes in by_cmd.items():
        t0 = time.time()
        rc, out = sh(cmd.replace("{tests}", ",".join(sorted(classes))), run_root or code_root, QUICK_TIMEOUT, cancel)
        if rc == 124:
            hung = hung_classes(out)
            rows.append((FAIL, cmd.split("&&")[0].strip(), "%d classes · %ds · timed out; still running: %s" % (
                len(classes), time.time() - t0, ", ".join(hung) or "unknown (no surefire Running line)")))
            continue
        tail = " ".join(l.strip() for l in out.splitlines() if re.match(
            r"\[(?:INFO|ERROR)\] +(?:Tests run: \d+, F|\S+\.\S+ .*<<<)", l.strip()))[-600:]
        res = OK if rc == 0 else FAIL
        if rc != 0 and not (cancel is not None and cancel.is_set()):
            ok, why = flake_rerun(failed_classes(out), code_root, "related")
            if ok:
                res, tail = WARN, why + " · " + tail
        rows.append((res, cmd.split("&&")[0].strip(), "%d classes · %ds · %s" % (
            len(classes), time.time() - t0, tail or "exit %d" % rc)))
    return rows


def quick_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, tasks, extra_tests, own_only=False):
    """--quick: related_tests (own, always-run, migration neighbours, covering), uncommitted work included, one run
    per build module. The cheapest gate that finds a broken module rule, a pinned version or a pinned row count
    before the audit spends minutes on it (L-060)."""
    by_cmd, why = related_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, tasks, extra_tests, own_only)
    if by_cmd is None:
        print("QUICK: %s" % why)
        return 1
    print("# Quick tests · %s" % ", ".join("%s %d" % kv for kv in why.items()))
    rows = run_related(by_cmd, code_root)
    for r, where, detail in rows:
        print("| %s | quick %s | %s |" % (r, where, detail))
    failed = any(r == FAIL for r, _, _ in rows)
    tree = "" if own_only else worktree_tree(code_root, rel_tracking)  # --own never stands in for --quick
    if tree:
        # a pass is kept with the code tree it ran on: the full run skips P5 related tests while the code is the same
        cache_path = os.path.join(tracking, "preflight-cache.json")
        cache = json.load(open(cache_path, encoding="utf-8")) if os.path.exists(cache_path) else {}
        key = "quick:" + "|".join(sorted(tasks))
        if failed:
            cache.pop(key, None)
        else:
            cache[key] = {"tree": tree, "detail": ", ".join("%s %d" % kv for kv in why.items())}
        json.dump(cache, open(cache_path, "w", encoding="utf-8"), indent=1)
    print("\n%s: %s" % ("OWN" if own_only else "QUICK", "FAIL" if failed else "PASS"))
    return 1 if failed else 0


def quick_reusable(tracking, cache_key, head_full, code_root, rel_tracking):
    """Detail for a P5 related tests row reused from a passing --quick on exactly this code, or '' (run them)."""
    # a wave --quick (every wave task's --task in one call: the union of their related sets, run once) covers each of
    # its tasks: any cached pass whose task set holds every requested task counts
    try:
        cache = json.load(open(os.path.join(tracking, "preflight-cache.json"), encoding="utf-8"))
    except (OSError, ValueError):
        return ""
    want = set(cache_key.split("|"))
    q = cache.get("quick:" + cache_key) or next(
        (v for k, v in cache.items() if k.startswith("quick:") and want <= set(k[6:].split("|"))), None)
    if not q or git(["diff", "--quiet", q["tree"], head_full, "--"] + code_spec(rel_tracking), code_root)[0] != 0:
        return ""
    return "%s · reused from --quick (code tree %s, same code)" % (q.get("detail", ""), q["tree"][:7])


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


def test_command(cfg, code_root, path):
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


SHARED_STATE = re.compile(r"\b(while|concurrent\w*|in flight|at once|at most one|never two|race|parallel|shared|"
                          r"same time|simultaneous\w*|paus\w*|lock\w*|lease\w*|claim\w*)\b", re.I)
RACE_TEST = re.compile(r"\b(latch\w*|concurrent\w*|two threads|two workers|interleav\w*|repeat\w*|race test)\b", re.I)


def race_test_row(card):
    """P17 (L-010, L-098): an invariant about state that other threads or fetches share ("no X while Y", "at most one",
    a pause, a lock, a claim) names a concurrent test in the Design check (latch-parked, repeated), before any code.
    T-153 audit 1 failed on a pause tested one thread at a time; the fix cost a whole second cycle."""
    design = section(card, "Design check")
    if not design:
        return INFO, "P17 race test", "no Design check on the card"
    shared = [l.split(":")[0].lstrip("- ").strip() for l in design.splitlines()
              if re.match(r"^\s*-\s*I\d+:", l) and SHARED_STATE.search(l)]
    if not shared:
        return OK, "P17 race test", "no invariant on shared state"
    plan = " ".join(l for l in design.splitlines() if re.match(r"^\s*-\s*(Test map|Test plan)", l))
    if RACE_TEST.search(plan):
        return OK, "P17 race test", "shared-state invariants %s; the test plan or map names a concurrent test" % (
            ", ".join(shared))
    return FAIL, "P17 race test", ("invariants on shared state (%s) but the Test plan / Test map names no concurrent "
                                   "test: add a latch-parked, repeated (20x) multi-thread test for each and say so in "
                                   "the Test map (L-010, L-098)" % ", ".join(shared))


# ----------------------------------------------------------------------------- --commit, --audit-pack, --archive
def task_commit(code_root, full, message, paths, tracking_only, coauthor):
    """Commits exactly these paths with one correct trailer block: a blank line before `Task:` puts it outside the
    trailers and P2 then rejects the commit."""
    if not paths:
        sys.exit("commit: --paths is required")
    rc, _, err = git(["add", "--"] + paths, code_root)
    if rc != 0:
        sys.exit("commit: git add failed: " + err.strip())
    trailer = ("Tracking: %s" if tracking_only else "Task: %s") % full
    if coauthor:
        trailer += "\nCo-Authored-By: " + coauthor
    fd, name = tempfile.mkstemp(prefix="commit-msg-")
    with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(message.strip() + "\n\n" + trailer + "\n")
    try:
        rc, out, err = git(["commit", "-q", "-F", name, "--"] + paths, code_root)
    finally:
        os.unlink(name)
    if rc != 0:
        sys.exit("commit: git commit failed: " + (err or out).strip())
    sha = git(["log", "-1", "--format=%h"], code_root)[1].strip()
    key = "Tracking" if tracking_only else "Task"
    got = git(["log", "-1", "--format=%%(trailers:key=%s,valueonly)" % key], code_root)[1].strip()
    if got != full:
        sys.exit("commit: %s has trailer %r, expected %r" % (sha, got, full))
    print("commit: %s %s: %s" % (sha, key, got))


def _slug(heading):
    h = re.sub(r"[^\w\- ]", "", heading.strip().lower().replace("`", ""))
    return h.replace(" ", "-")


def doc_excerpt(path, anchor, limit=150):
    """The section under a heading whose GitHub slug is the anchor, cut at the next heading of the same or higher level."""
    text = open(path, encoding="utf-8", errors="replace").read().splitlines()
    for i, line in enumerate(text):
        m = re.match(r"(#{1,6})\s+(.*)", line)
        if m and _slug(m.group(2)) == anchor:
            end = next((j for j in range(i + 1, len(text)) if re.match(r"#{1,%d}\s" % len(m.group(1)), text[j])), len(text))
            part = text[i:end]
            return "\n".join(part[:limit]) + ("\n[... %d more lines]" % (len(part) - limit) if len(part) > limit else "")
    return None


def audit_pack(tracking, code_root, rel_tracking, full, since=""):
    """One file holding an auditor's starting inputs: the card, this task's diff, the cited doc sections and lessons."""
    key, tid = full.split("/")
    found = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
    if not found:
        sys.exit("audit-pack: no card for " + full)
    card = open(found[0], encoding="utf-8").read()
    start = since or ((table_value(card, "Start commit") or "").split() or [""])[0]
    commits = [s for s, t in (task_commits(start, code_root, rel_tracking)[0] or []) if t == [full]]
    parts = ["# Audit pack %s (start %s)\n" % (full, start), "## Task card\n\n" + card,
             "## This task's commits\n\n" + (", ".join(commits) or "none")]
    for s in reversed(commits):
        parts.append("### %s\n\n```diff\n%s\n```" % (s, git(
            ["show", "--format=%h %s", s, "--"] + code_spec(rel_tracking), code_root)[1]))
    excerpts, missed, seen = [], [], set()
    for target in re.findall(r"\]\(<?([^)>\s]+\.md)#([^)>\s]+)>?\)", section(card, "Implements (LLD / SDD)") + "\n"
                             + section(card, "Realises")):
        if target in seen:
            continue
        seen.add(target)
        path = os.path.normpath(os.path.join(os.path.dirname(found[0]), target[0]))
        text = doc_excerpt(path, target[1]) if os.path.isfile(path) else None
        if text:
            excerpts.append("### %s#%s\n\n%s" % (os.path.basename(target[0]), target[1], text))
        else:
            missed.append("%s#%s" % target)
    parts.append("## Cited doc sections\n\n" + ("\n\n".join(excerpts) or "none extracted"))
    if missed:
        parts.append("## Anchors not extracted: open these yourself\n\n" + "\n".join("- " + m for m in missed))
    lessons = open(os.path.join(tracking, "lessons.md"), encoding="utf-8").read().splitlines()
    wanted = set(re.findall(r"\bL-\d+\b", section(card, "Lessons that apply (filled by start)")))
    parts.append("## Lessons named on the card\n\n" + ("\n".join(l for l in lessons if any(
        l.startswith("| %s |" % w) for w in wanted)) or "none"))
    out_dir = os.path.join(tempfile.gettempdir(), "impl-unifier-packs")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, "%s-%s.md" % (key, tid))
    text = "\n\n".join(parts) + "\n"
    open(path, "w", encoding="utf-8").write(text)
    print("audit-pack: %s (%d KB, %d commits, %d sections%s)" % (
        path, len(text) // 1024, len(commits), len(excerpts), ", %d anchors not found" % len(missed) if missed else ""))


def archive_gaps(tracking, days):
    """Moves rows Closed at least `days` ago from gaps.md to gaps-archive.md, which paperwork and history also read.
    Open rows, and rows of unknown close date only when older than the cut-off, stay rules-checked as before."""
    path, arch = os.path.join(tracking, "gaps.md"), os.path.join(tracking, "gaps-archive.md")
    raw = open(path, encoding="utf-8", newline="").read()
    nl = "\r\n" if "\r\n" in raw else "\n"
    cutoff = datetime.date.today() - datetime.timedelta(days=days)
    keep, moved = [], []
    for line in raw.split(nl):
        last = split_row(line)[-1] if line.startswith("| ") and "/GAP-" in line[:40] else ""
        m = re.match(r"Closed\s+(\d{4}-\d{2}-\d{2})", last)
        if m and datetime.date.fromisoformat(m.group(1)) <= cutoff:
            moved.append(line)
        else:
            keep.append(line)
    if not moved:
        print("archive: nothing to move")
        return
    header = [l for l in raw.split(nl) if l.startswith("| ID ") or l.startswith("|---")][:2]
    old = open(arch, encoding="utf-8", newline="").read() if os.path.exists(arch) else (
        "# Gaps archive\n\nClosed gaps moved out of gaps.md by `--archive`. IDs are never reused.\n\n".replace("\n", nl)
        + nl.join(header) + nl)
    tmp = arch + ".new"
    open(tmp, "w", encoding="utf-8", newline="").write(old.rstrip("\r\n") + nl + nl.join(moved) + nl)
    os.replace(tmp, arch)
    tmp = path + ".new"
    open(tmp, "w", encoding="utf-8", newline="").write(nl.join(keep))
    os.replace(tmp, path)
    print("archive: %d closed gaps moved to gaps-archive.md; gaps.md %d KB -> %d KB" % (
        len(moved), len(raw.encode("utf-8")) // 1024, len(nl.join(keep).encode("utf-8")) // 1024))


def risk_line_hits(start, files, code_root):
    """Files in which a line the task added, changed or removed since `start` matches a high-risk pattern (P9). The
    removed side counts: deleting an authorization check is a high-risk change with no high-risk line left."""
    out = []
    for f in files:
        diff = git(["diff", "-U0", start, "--", f], code_root)[1]
        for line in diff.splitlines():
            if line[:1] in "+-" and not line.startswith(("+++", "---")) and re.search(RISK_PATTERNS, line[1:]):
                out.append(f)
                break
    return out


_SPEC_TEXTS = {}


def spec_texts(code_root):
    """{spec path: text} for every *.spec.ts / *.test.ts outside the skipped dirs (read once per run)."""
    if code_root not in _SPEC_TEXTS:
        out = _SPEC_TEXTS[code_root] = {}
        for dirpath, dirnames, files in os.walk(code_root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for name in files:
                if name.endswith((".spec.ts", ".test.ts")):
                    p = os.path.join(dirpath, name)
                    out[os.path.relpath(p, code_root).replace("\\", "/")] = open(
                        p, encoding="utf-8", errors="replace").read()
    return _SPEC_TEXTS[code_root]


def test_ref_exists(ref, code_root):
    """A `## Tests` reference names a real test: `Class#method` (Java/Kotlin; `Outer.Inner#method` too),
    `file.spec.ts#part of the test name` (the removals form), a bare test method declared in a test class, or a
    test name found in a spec."""
    cls, sep, meth = ref.partition("#")
    cls, meth = cls.strip(), meth.strip()
    if sep and meth:
        if cls.endswith(".ts"):
            return any(p.endswith(cls) and meth in t for p, t in spec_texts(code_root).items())
        names = set(re.split(r"[.$]", cls))
        decl = re.compile(r"\b%s\s*\(" % re.escape(meth))
        return any(fq.rsplit(".", 1)[-1] in names and decl.search(text)
                   for fq, (_, text) in test_sources(code_root).items())
    if sep or not ref.strip():
        return False
    if re.fullmatch(r"[A-Za-z_]\w*", ref):
        decl = re.compile(r"\b(?:void|fun)\s+%s\s*\(" % re.escape(ref))
        if any(decl.search(text) for _, text in test_sources(code_root).values()):
            return True
    quoted = re.compile(r"""\b(?:it|test)\(\s*['"`]%s""" % re.escape(ref))
    return any(quoted.search(t) for t in spec_texts(code_root).values())


def tests_map_row(card, code_root, status, has_commits):
    """P19 (L-046): each clause under the card's `## Tests` names a test that exists. The first audit kept finding
    promised tests that were never written (`untested` is the top root cause in history.md); a missing name is
    found here in seconds instead. Enforced while the task is In progress and has code; a card already In review or
    Done is reported, never failed, so work in flight is not reopened by the rule."""
    clauses = [l.strip()[2:].strip() for l in section(card, "Tests").splitlines() if l.strip().startswith("- ")]
    clauses = [c for c in clauses if c and not re.match(r"(?i)(no test|none)\b", c)]
    if not clauses:
        return INFO, "P19 tests map", "no `## Tests` clauses on the card"
    if not has_commits:
        return INFO, "P19 tests map", "%d clauses; no task commits yet: name each clause's test before In review" \
            % len(clauses)
    missing = [c for c in clauses
               if not any(test_ref_exists(r, code_root) for r in re.findall(r"`([^`]+)`", c))]
    if not missing:
        return OK, "P19 tests map", "%d clauses, each names a test that exists" % len(clauses)
    detail = ("%d of %d `## Tests` clauses name no existing test; append ` → `Class#method`` (or "
              "`file.spec.ts#test name`) to each, or write `- no test: <reason>`: %s"
              % (len(missing), len(clauses), "; ".join(c[:80] for c in missing[:6])))
    return (FAIL if status == "In progress" else INFO), "P19 tests map", detail


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
def port_holder(port):
    """None when nothing listens on the local port, else a short description of the listener."""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(0.5)
        if probe.connect_ex(("127.0.0.1", port)) != 0:
            return None
    pid = ""
    if os.name == "nt":
        out = subprocess.run(["netstat", "-ano", "-p", "TCP"], capture_output=True, text=True).stdout
        m = re.search(r":%d\s+\S+\s+LISTENING\s+(\d+)" % port, out)
        pid = m.group(1) if m else ""
    return "pid %s" % pid if pid else "a running process"


RUN_LOCK = ".preflight.lock"


def run_lock_holder(tracking):
    """(mode, pid, started) of a live run holding the lock, else None."""
    try:
        held = json.load(open(os.path.join(tracking, RUN_LOCK), encoding="utf-8"))
    except (OSError, ValueError):
        return None
    pid = held.get("pid", 0)
    return (held.get("mode"), pid, held.get("started")) if pid != os.getpid() and pid_alive(pid) else None


def take_run_lock(tracking, mode):
    """One test-running mode at a time per tracking folder: two runs share the checkout, the test database,
    LocalStack and the ports, and break each other (AUTOAPPLY wave S-17, 2026-11-02). A lock whose process
    is gone is taken over."""
    path = os.path.join(tracking, RUN_LOCK)
    try:
        held = json.load(open(path, encoding="utf-8"))
        if pid_alive(held.get("pid", 0)) and held.get("pid") != os.getpid():
            sys.exit("PRE-FLIGHT: BUSY (another %s run, pid %s, started %s, is still running: wait for it; "
                     "never run two at once)" % (held.get("mode"), held.get("pid"), held.get("started")))
    except (OSError, ValueError):
        pass
    json.dump({"pid": os.getpid(), "mode": mode,
               "started": datetime.datetime.now().isoformat(timespec="seconds")}, open(path, "w", encoding="utf-8"))
    import atexit
    atexit.register(lambda: os.path.exists(path) and os.remove(path))


def pid_alive(pid):
    if not pid:
        return False
    if os.name == "nt":
        out = subprocess.run(["tasklist", "/FI", "PID eq %d" % pid, "/NH"], capture_output=True, text=True).stdout
        return str(pid) in out
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


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
    # D5 ports the tests bind (config.md `Test ports`): a dev server left running fails a suite after minutes
    ports = [int(x) for x in re.findall(r"\d+", (table_value(cfg, "Test ports") or "").split("(")[0])]
    for port in ports:
        holder = port_holder(port)
        rows.append((FAIL, "D5 port %d" % port, "in use by %s: stop it before the suites (a test binds this port)"
                     % holder) if holder else (OK, "D5 port %d" % port, "free"))
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
            # a built-in FAIL is already its own row: mirror it as INFO so one failure is not counted twice
            state = builtin_results.get(c["builtin"], INFO)
            results.append((INFO if state == FAIL else state, label, "covered by built-in %s%s"
                            % (c["builtin"], " (FAIL counted there)" if state == FAIL else "")))
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
                        "%s..HEAD" % start, "--"] + code_spec(rel_tracking), code_root)
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
        # .gitignore holds no code either (NON_CODE): a commit of tracking files and ignore rules never blocks
        tracking_only = bool(files) and all(f.startswith(rel_tracking + "/") or os.path.basename(f) == ".gitignore"
                                            for f in files)
        if tracking_only:  # holds no code: never blocks, whatever task it names
            if not tasks and not tracking_trailer.strip() and not subject.startswith("Tracking:"):
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
    ap.add_argument("--tests", default="", help="--quick: extra test classes (comma-separated FQCNs)")
    ap.add_argument("--own", action="store_true", help="only the task's own test classes (right after a builder's "
                    "cherry-pick, before --quick); never stands in for --quick")
    ap.add_argument("--close-out", default="", metavar="KEY/T-NNN", help="Done + Evidence + gaps/DUs + flakes + "
                    "journal + history in one command (paperwork.close_out)")
    ap.add_argument("--audit-report", default="", help="--close-out: file holding the auditor's returned text; saved "
                    "as audits/T-NNN-audit-N.md and linked under Evidence with its verdict")
    ap.add_argument("--evidence", action="append", default=[], help="--close-out: one Evidence bullet (repeatable)")
    ap.add_argument("--gap", action="append", default=[], help="--close-out: 'type|severity|anchor|text|owner', "
                    "or that plus '||level|kind|anchors|what|decided' for a doc gap with its DU (repeatable)")
    ap.add_argument("--reason", default="", help="--close-out: History reason (verdict, audit)")
    ap.add_argument("--journal", default="", help="--close-out: one line for journal/<today>.md")
    ap.add_argument("--quick", action="store_true", help="the task's own test classes plus config.md "
                    "'## Always-run tests' (architecture rules, schema gates), uncommitted work included; minutes; "
                    "run it before the pre-flight; writes nothing")
    ap.add_argument("--history", action="store_true", help="rebuild tracking/history.md from git and the reports")
    ap.add_argument("--history-start", default="", help="stamp the start clock of KEY/T-NNN (run at `start`)")
    ap.add_argument("--commit", default="", metavar="KEY/T-NNN", help="commit --paths with a correct trailer block")
    ap.add_argument("--message", default="", help="--commit: the commit subject")
    ap.add_argument("--paths", nargs="*", default=[], help="--commit: only these paths, relative to the code root")
    ap.add_argument("--tracking-only", action="store_true", help="--commit: a `Tracking:` trailer instead of `Task:`")
    ap.add_argument("--coauthor", default="", help="--commit: a Co-Authored-By value")
    ap.add_argument("--audit-pack", default="", metavar="KEY/T-NNN", help="write the auditor's starting inputs to one file")
    ap.add_argument("--since", default="", help="--audit-pack: only commits after this sha (delta re-audit)")
    ap.add_argument("--archive", action="store_true", help="move closed gaps to gaps-archive.md")
    ap.add_argument("--archive-days", type=int, default=7, help="--archive: only gaps closed at least this many days ago")
    ap.add_argument("--verbose", action="store_true", help="print every row; default prints FAIL rows and a "
                    "count of the rest (the report file always holds every row)")
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
    if a.set_status or a.gap_du or a.close_out:
        import paperwork
        if a.close_out:
            paperwork.close_out(tracking, a.close_out, a.evidence, a.gap, a.reason, a.journal, a.agent, a.audit_report)
            import history
            cfg = open(os.path.join(tracking, "config.md"), encoding="utf-8").read()
            history.write(tracking, os.path.normpath(os.path.join(
                tracking, "..", (table_value(cfg, "Code root") or ".").split()[0])))
            # the slice's last task: run the slice gate now, so a missing audit link or open major gap shows at once
            k = a.close_out.split("/")[0]
            card = glob.glob(os.path.join(tracking, k, "tasks", a.close_out.split("/")[1] + "-*.md"))
            sl = (table_value(open(card[0], encoding="utf-8").read(), "Slice") or "").strip() if card else ""
            idx = open(os.path.join(tracking, "index.md"), encoding="utf-8").read().splitlines()
            sid = sl.split("/")[-1]
            rows = [l for l in idx if sid and re.search(r"\|\s*%s\s*\|" % re.escape(sid), l)]
            if re.fullmatch(r"[A-Z]+/S-\d+", sl) and rows and all(
                    re.search(r"\|\s*(Done|Verified|Dropped)\b", l) for l in rows):
                print("all %d tasks of %s are Done: slice gate" % (len(rows), sl))
                slice_check(tracking, sl)
        elif a.set_status:
            paperwork.set_status(tracking, *a.set_status, agent=a.agent)
        else:
            paperwork.gap_du(tracking, *a.gap_du, agent=a.agent)
        sys.exit(0)
    if a.archive:
        archive_gaps(tracking, a.archive_days)
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
    if a.doctor or not (a.lint or a.audit_mode or a.push_check or a.slice or a.history):
        doctor_rows = doctor(cfg, code_root, tracking)
        doctor_fail = any(r == FAIL for r, _, _ in doctor_rows)
    if a.quick and doctor_fail:  # a busy port or a down Docker fails the run in seconds, not after the suite
        for r, l, d in doctor_rows:
            if r == FAIL:
                print("| %s | %s | %s |" % (r, l, d))
        sys.exit("QUICK: FAIL (doctor)")
    if a.doctor:
        for r, l, d in doctor_rows:
            if r == FAIL or a.verbose:
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
    if not a.task and not a.commit and not a.audit_pack:
        sys.exit("pre-flight: give --task KEY/T-NNN (one or more) or --push-check")
    stamp = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    repo_prefix = git(["rev-parse", "--show-prefix"], code_root)[1].strip()
    if a.lint:
        # lint compiles guards (javac, Maven classpath): beside a test run it loads the machine and breaks container
        # start-up (S-17 wave: LocalStack timed out while a lint ran), so it waits its turn like any run
        busy = run_lock_holder(tracking)
        if busy:
            sys.exit("LINT: BUSY (a %s run, pid %s, started %s, holds the lock: lint after it ends)" % busy)
    a.quick = a.quick or a.own
    own_tests = set()
    for full in a.task:
        k, t = full.split("/")
        found = glob.glob(os.path.join(tracking, k, "tasks", t + "-*.md"))
        st = ((table_value(open(found[0], encoding="utf-8").read(), "Start commit") or "").split() or [""])[0] if found else ""
        names = git(["diff", "--name-only", st, "--", "."], code_root)[1].split() if re.fullmatch(r"[0-9a-f]{7,40}", st) else []
        names += git(["ls-files", "--others", "--exclude-standard", "--", "."], code_root)[1].split()
        own_tests |= {os.path.splitext(os.path.basename(f))[0] for f in names if "/src/test/" in "/" + f}
    FLAKE_CTX.update(cfg=cfg, tracking=tracking, own=own_tests)
    if a.quick or not (a.lint or a.audit_mode):
        take_run_lock(tracking, "quick" if a.quick else "pre-flight")
    if a.commit:
        task_commit(code_root, a.commit, a.message, a.paths, a.tracking_only, a.coauthor)
        sys.exit(0)
    if a.audit_pack:
        audit_pack(tracking, code_root, rel_tracking, a.audit_pack, a.since)
        sys.exit(0)
    if a.quick:
        sys.exit(quick_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, a.task, a.tests, a.own))
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
                rows.append((FAIL, "P1 clean tree", "commit these before the pre-flight (it fails on an "
                             "uncommitted file): " + ", ".join(loose[:10])))
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
                # A card section quoting the user lists other sessions' commits made inside this task's range (shared checkout)
                foreign = re.findall(r"\b[0-9a-f]{7,40}\b", section(card, "Other sessions' commits") or "")
                multi = [s for s, t in commits if len(t) != 1
                         and not any(f.startswith(s) or s.startswith(f) for f in foreign)]
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
        # a Done card at close-out is not a lint failure (S-17 wave 3)
        ok = status == idx and status in ("In progress", "In review", "Adopted") + (("Done",) if a.lint else ())
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
                             "write; list them in the design check's neighbour scan (--quick and the pre-flight "
                             "run them): " + ", ".join("%s (%s)" % (fq.rsplit(".", 1)[-1], t)
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
            rows.append(race_test_row(card))
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
                for f in outside[:20]:
                    print("- `%s`: <reason>" % f)
                if len(outside) > 20:
                    print("# ... and %d more: an unrelated folder? ignore it or commit it apart" % (len(outside) - 20))

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
        # high = the task changes a high-risk line; medium = it edits a file that holds one. An Adopted task or one
        # with no usable start commit has no diff to read: every file hit counts as a changed line, as before.
        has_diff = bool(mine) and not adopted and bool(re.fullmatch(r"[0-9a-f]{7,40}", start or ""))
        line_hits = risk_line_hits(start, [f for f in sorted(mine) if not test_like.search(f)], code_root) \
            if has_diff else list(hits)
        tier, quoted = risk.split(" ")[0].strip(":").lower(), 'user: "' in risk
        if not risk:
            rows.append((FAIL, "P9 risk floor", "card has no Risk"))
        elif tier not in ("low", "medium", "high"):
            rows.append((FAIL, "P9 risk floor", "Risk is `%s`: use low, medium or high (task-splitting.md § Risk)"
                         % risk.split(" (")[0]))
        elif tier != "high" and line_hits and not quoted:
            rows.append((FAIL, "P9 risk floor", "Risk is %s but the task changes high-risk lines: %s; raise Risk to "
                         "high or quote the user's decision on the card" % (tier, ", ".join(line_hits[:6]))))
        elif tier == "low" and hits and not quoted:
            rows.append((FAIL, "P9 risk floor", "Risk is low but the task edits files that hold high-risk code: %s; "
                         "raise Risk to medium or quote the user's decision on the card" % ", ".join(hits[:6])))
        elif tier == "high" and has_diff and not line_hits:
            rows.append((OK, "P9 risk floor", "high; no high-risk line in the diff: `medium` is allowed when nothing "
                         "on the task-splitting.md § Risk high list applies (record `medium (P9: no high-risk line "
                         "in the diff)` on the card)"))
        else:
            rows.append((OK, "P9 risk floor", "%s; %s" % (risk.split(" (")[0], "high-risk code in %d files, changed "
                                                          "lines in %d" % (len(hits), len(line_hits))
                                                          if hits else "no high-risk code found")))
        rows.append(tests_map_row(card, code_root, status, bool(mine) and not adopted))
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
                                        if same else "commits after task head %s are other tasks' work; the suite "
                                        "rows are for the integrated tree %s (the code that is pushed): counts "
                                        "reusable while the code equals that tree")
                     % (task_head[:7], head_full[:7]))
        rows.append(reuse)
        per_task[full] = (key, tid, rows, task_head)

    if a.lint:
        tests = [(INFO, "P5 tests", "lint: tests not run; --quick and the pre-flight run them")]
        stack = (INFO, "P6 local stack", "lint")
    elif a.audit_mode:
        tests = [(INFO, "P5 tests", "audit mode: tests not run; reuse the pre-flight report's P5 related tests "
                  "row, then run only the task's own test classes in the export (audit-rules.md § 3a)")]
        stack = (INFO, "P6 local stack", "audit mode")
    elif any(r == FAIL for _, _, rows, _ in per_task.values() for r, _, _ in rows) or doctor_fail:
        # fail fast: a paperwork or environment FAIL is fixed in seconds; never spend the tests' minutes on it
        tests = [(FAIL, "P5 tests", "not run: fix the FAIL rows above (or the doctor rows) first; `--lint` "
                  "re-checks them in seconds")]
        stack = (INFO, "P6 local stack", "not run (fail fast)")
    else:
        # the related tests (the --quick set) are the only tests: no full suites, no mutation, no removals
        quick = quick_reusable(tracking, "|".join(sorted(a.task)), head_full, code_root, rel_tracking)
        if quick:
            tests = [(OK, "P5 related tests", quick)]
        else:
            by_cmd, why = related_tests(cfg, tracking, code_root, rel_tracking, repo_prefix, a.task, "")
            tests = [(r, "P5 related tests", "%s: %s" % (where, d))
                     for r, where, d in run_related(by_cmd or {}, code_root)]
        if not tests:
            tests = [(FAIL, "P5 related tests", "no related test found: the task needs at least one test class")]
        stack = (lambda r: (r[0], "P6 local stack", r[1]))(check_stack(cfg, code_root))
    # P5 is the related tests
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
            # FAIL rows only (the header line alone on a pass); WARN rows are counted, the report file lists them
            shown = [l for l in lines[4:] if l.startswith("| FAIL")]
            warns = sum(l.startswith("| WARN") for l in lines[4:])
            print("\n".join(lines[:1] + [l if len(l) <= 700 else l[:700] + " ... (%d chars; --verbose shows all)" % len(l)
                                          for l in shown]))
            print("(%d other rows, %d WARN; --verbose or the report file shows them)" % (len(lines) - 4 - len(shown), warns))
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
