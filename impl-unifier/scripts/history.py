"""impl-unifier history: tracking/history.md, rebuilt from recorded facts only.

  python preflight.py --tracking <t> --history-start KEY/T-NNN   # at `start`: stamps the start clock
  python preflight.py --tracking <t> --history                   # at `done`: rebuilds history.md

Sources (nothing else is read, nothing is inferred):
  git           commits whose `Task:` trailer is the task (times, count)
  clock         tracking/history-clock.json, written only by --history-start
  task card     Status, Slice, Risk, Size, History rows (reopen count)
  audits        tracking/<KEY>/audits/T-NNN-audit-N.md, verdict from line 1
  pre-flight    tracking/<KEY>/preflight/T-NNN-*.md, verdict from line 1, FAIL rows; for the Speed block: the
                date on line 1, the `P5 suites` row (deferred, or why not), suite and mutation times and reuse
  lessons.md    rows whose Trigger or Source cites the task (root cause, rule, hits)
  gaps.md       rows whose Found by or Linked task cites the task
The file is rebuilt every run, so it never holds duplicates or hand-written facts.
"""
import datetime
import glob
import json
import os
import re
import statistics

from preflight import git, split_row, table_rows, table_value

IDLE_GAP_MIN = 30


def _clock(tracking):
    p = os.path.join(tracking, "history-clock.json")
    return (json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}), p


def stamp_start(tracking, full):
    clock, p = _clock(tracking)
    if full in clock:
        print("history: %s start already stamped %s (kept)" % (full, clock[full]))
        return
    clock[full] = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    with open(p, "w", encoding="utf-8") as f:
        json.dump(clock, f, indent=1, sort_keys=True)
    print("history: %s start stamped %s" % (full, clock[full]))


def _verdict(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        m = re.search(r"\b(PASS-minor|FAIL|PASS)\b", f.readline())
    return m.group(1) if m else "?"


def _rel(tracking, p):
    return os.path.relpath(p, tracking).replace("\\", "/")


def _trailer_commits(code_root):
    """{task id: [(sha, time, subject)]} for every commit, oldest first; one git call for all tasks."""
    _, out, _ = git(["log", "--all", "--no-merges", "--reverse",
                     "--format=%h%x1f%aI%x1f%s%x1f%(trailers:key=Task,valueonly,separator=%x1d)%x1e"], code_root)
    by_task = {}
    for c in out.split("\x1e"):
        parts = c.strip().split("\x1f")
        if len(parts) != 4:
            continue
        for t in {t.strip() for t in parts[3].split("\x1d") if t.strip()}:
            by_task.setdefault(t, []).append((parts[0], datetime.datetime.fromisoformat(parts[1]), parts[2]))
    return by_task


def _task(tracking, key, tid, card_path, commits, clock, lessons, gaps, threshold):
    full = key + "/" + tid
    card = open(card_path, encoding="utf-8").read()
    started = clock.get(full)
    t0 = datetime.datetime.fromisoformat(started) if started else commits[0][1]
    t1 = commits[-1][1]
    times = sorted({t0} | {c[1] for c in commits})
    idle = [(a, b) for a, b in zip(times, times[1:]) if (b - a).total_seconds() > IDLE_GAP_MIN * 60]
    span = max((t1 - t0).total_seconds() / 60, 0)
    active = span - sum((b - a).total_seconds() for a, b in idle) / 60
    audits = sorted(glob.glob(os.path.join(tracking, key, "audits", tid + "-audit-*.md")),
                    key=lambda p: int(re.search(r"audit-(\d+)", p).group(1)))
    verdicts = [(_rel(tracking, p), _verdict(p)) for p in audits]
    pfs = glob.glob(os.path.join(tracking, key, "preflight", tid + "-*.md"))
    pf_fail = []
    for p in sorted(pfs):
        if _verdict(p) == "FAIL":
            with open(p, encoding="utf-8", errors="replace") as f:
                rows = [split_row(l) for l in f if l.startswith("| FAIL")]
            pf_fail.append((_rel(tracking, p), [r[1] for r in rows if len(r) > 1]))
    # a bare "T-NNN" in another key's file means that key's task, so match "KEY/T-NNN" or a bare id in its own key
    cite = re.compile(r"(?<![\w-])%s/%s\b" % (re.escape(key), re.escape(tid)))
    bare = re.compile(r"(?<![\w/-])%s\b" % re.escape(tid))
    own = lambda text, home: cite.search(text) or (home == key and bare.search(text))
    les = [r for r, home in lessons if own(r[2] + " " + r[8], home)]
    gps = [r for r in gaps if cite.search(r[3] + " " + (r[8] if len(r) > 8 else ""))]
    reopen = len(re.findall(r"Done\s*→\s*In progress", card))
    signals = []
    fails = sum(v == "FAIL" for _, v in verdicts)
    if fails:
        signals.append("audit FAIL ×%d" % fails)
    if pf_fail:
        checks = sorted({c.split()[0] for _, cs in pf_fail for c in cs if c})
        signals.append("pre-flight FAIL ×%d (%s)" % (len(pf_fail), ", ".join(checks)))
    if idle:
        signals.append("paused ×%d (%s)" % (len(idle), ", ".join(_fm((b - a).total_seconds() / 60) for a, b in idle)))
    if reopen:
        signals.append("reopened ×%d" % reopen)
    slice_ = table_value(card, "Slice") or table_value(card, "Phase / Layer") or table_value(card, "Phase") or "-"
    return dict(full=full, card=_rel(tracking, card_path), status=(table_value(card, "Status") or "?").split(" (")[0],
                slice=re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", slice_).split(" ")[0],
                risk=(table_value(card, "Risk") or "?").split()[0], size=table_value(card, "Size") or "?",
                t0=t0, src="clock" if started else "first commit", span=span, active=active,
                commits=commits, verdicts=verdicts, pfs=len(pfs), pf_fail=pf_fail, lessons=les, gaps=gps,
                reopen=reopen, over=span > threshold, signals=signals or ["no recorded signal"])


def _fm(m):
    return "%dm" % round(m) if m < 120 else "%.1fh" % (m / 60)


def _week(d):
    return (d - datetime.timedelta(days=d.weekday())).strftime("%Y-%m-%d")


def _reason(why):
    why = why.strip()
    for key in ("new bean type", "bean wiring", "no passing --mutate", "--full-suites"):
        if key in why:
            return key
    return "config or build file" if why else ""


def _speed(tracking, tasks):
    """## Speed: the numbers a tuning of the skill is judged by, per ISO week (Monday date), counted from the task
    rows and the pre-flight reports. Nothing is estimated: a week with no report shows `-`."""
    new = lambda: dict(n=0, deferred=0, fresh=[], reused=0, mfresh=0, mreused=0, why={})
    reports, total = {}, new()
    for p in glob.glob(os.path.join(tracking, "*", "preflight", "T-*.md")):
        if p.endswith("-removals.md"):
            continue
        with open(p, encoding="utf-8", errors="replace") as f:
            text = f.read()
        m = re.search(r"(\d{4}-\d\d-\d\d)T", text.split("\n", 1)[0])
        if not m:
            continue
        for r in (reports.setdefault(_week(datetime.date.fromisoformat(m.group(1))), new()), total):
            r["n"] += 1
            for line in text.splitlines():
                c = split_row(line) if line.startswith("|") else []
                if len(c) < 3:
                    continue
                label, detail = c[1], c[2]
                secs = re.search(r"· (\d+)s\b", detail)
                if label == "P5 suites":
                    if detail.startswith("deferred"):
                        r["deferred"] += 1
                    elif detail.startswith("not deferred:"):
                        for why in {_reason(w) for w in detail[len("not deferred:"):].split(";")} - {""}:
                            r["why"][why] = r["why"].get(why, 0) + 1
                elif label.startswith("P5 suite "):
                    if "reused from" in detail:
                        r["reused"] += 1
                    elif secs:
                        r["fresh"].append(int(secs.group(1)))
                elif label.startswith("P10 mutation") and c[0] in ("PASS", "FAIL"):
                    if "reused from" in detail:
                        r["mreused"] += 1
                    elif secs:
                        r["mfresh"] += 1
    by_week = {}
    for h in tasks:
        by_week.setdefault(_week(h["t0"].date()), []).append(h)
    share = lambda a, b: "%d%% (%d of %d)" % (round(100.0 * a / b), a, b) if b else "-"

    def row(name, hs, r):
        audited = [h for h in hs if h["verdicts"]]
        first = sum(h["verdicts"][0][1] != "FAIL" for h in audited)
        return "| %s | %d | %s | %s | %s | %s | %s | %s | %s | %s | %s |" % (
            name, len(hs), _fm(statistics.median(h["active"] for h in hs)) if hs else "-",
            "%.2f" % (sum(h["pfs"] for h in hs) / len(hs)) if hs else "-",
            "%.2f" % (sum(len(h["verdicts"]) for h in hs) / len(hs)) if hs else "-",
            share(first, len(audited)), r["n"] if r else "-", share(r["deferred"], r["n"]) if r else "-",
            ("%d (median %ds)" % (len(r["fresh"]), statistics.median(r["fresh"])) if r["fresh"] else "0") if r else "-",
            share(r["reused"], r["reused"] + len(r["fresh"])) if r else "-",
            share(r["mreused"], r["mreused"] + r["mfresh"]) if r else "-")

    out = ["## Speed", "",
           "Per ISO week (the Monday): tasks by their start, pre-flight reports by their date. A report is one "
           "pre-flight run that reached the tests. Compare the weeks after a change to the skill with those before.", "",
           "| Week | Tasks | Median active | Pre-flights / task | Audits / task | First audit passed | Pre-flight "
           "reports | Suites deferred | Suite runs | Suite rows reused | Mutation reused |",
           "|---|---|---|---|---|---|---|---|---|---|---|"]
    for w in sorted(set(by_week) | set(reports)):
        out.append(row(w, by_week.get(w, []), reports.get(w)))
    out.append(row("**All**", tasks, total))
    out.append(row("Last 20 tasks", tasks[-20:], None))
    if total["why"]:
        out += ["", "Suites not deferred, by reason (a report can name several): "
                + ", ".join("%s %d" % kv for kv in sorted(total["why"].items(), key=lambda x: -x[1])) + "."]
    return out + [""]


def write(tracking, code_root):
    cfg = open(os.path.join(tracking, "config.md"), encoding="utf-8").read()
    m = re.search(r"\d+", table_value(cfg, "History threshold (min)") or "")
    threshold = int(m.group(0)) if m else 20
    clock, _ = _clock(tracking)
    by_task = _trailer_commits(code_root)
    lessons = []
    for p in [os.path.join(tracking, "lessons.md")]:
        for r in table_rows(open(p, encoding="utf-8").read()):
            if len(r) > 8 and r[0].startswith("L-"):
                home = (re.search(r"\b([A-Z]+)/T-\d+", r[2] + r[8]) or re.search(r"·\s*([A-Z]+)\s*·", r[6]) or [None, None])[1]
                lessons.append((r, home))
    archive = os.path.join(tracking, "gaps-archive.md")  # archived gaps still count in a task's history
    gaps = [r for r in table_rows(open(os.path.join(tracking, "gaps.md"), encoding="utf-8").read()
                                  + ("\n" + open(archive, encoding="utf-8").read() if os.path.exists(archive) else ""))
            if len(r) > 3 and "GAP-" in r[0]]
    tasks = []
    for card in sorted(glob.glob(os.path.join(tracking, "*", "tasks", "T-*.md"))):
        key = os.path.basename(os.path.dirname(os.path.dirname(card)))
        tid = re.match(r"(T-\d+)", os.path.basename(card)).group(1)
        commits = by_task.get(key + "/" + tid)
        if commits:
            tasks.append(_task(tracking, key, tid, card, commits, clock, lessons, gaps, threshold))
    tasks.sort(key=lambda h: h["t0"])
    out = ["# Implementation history", "",
           "Rebuilt by `preflight.py --history` from git `Task:` trailers, the start clock, task cards, pre-flight "
           "and audit reports, lessons.md and gaps.md. Do not edit: every run rebuilds it. Each fact links to its source.",
           "",
           "- **Span**: start → last commit with the task's trailer. Start is the `start` clock when stamped "
           "(`clock`), else the task's first commit (`first commit`: time spent before that commit is not seen).",
           "- **Active**: span minus pauses longer than %d min between recorded events. Elapsed time, not focused time."
           % IDLE_GAP_MIN,
           "- **Over**: span above %d min (`History threshold (min)` in config.md)." % threshold, ""]
    out += _speed(tracking, tasks)
    out += ["## Tasks", "",
           "| Task | Slice / phase | Risk | Size | Status | Start (source) | Span | Active | Over | Commits | Audits | Pre-flight (FAIL) | Lessons | Gaps |",
           "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for h in tasks:
        out.append("| [%s](%s) | %s | %s | %s | %s | %s (%s) | %s | %s | %s | %d | %s | %d (%d) | %s | %d |" % (
            h["full"], h["card"], h["slice"], h["risk"], h["size"], h["status"], h["t0"].strftime("%Y-%m-%d %H:%M"),
            h["src"], _fm(h["span"]), _fm(h["active"]), "**yes**" if h["over"] else "no", len(h["commits"]),
            " → ".join("[%s](%s)" % (v, p) for p, v in h["verdicts"]) or "-", h["pfs"], len(h["pf_fail"]),
            ", ".join(r[0] for r in h["lessons"]) or "-", len(h["gaps"])))
    over = [h for h in tasks if h["over"]]
    out += ["", "## Over %d min: recorded signals" % threshold, "",
            "Counted from the files above; the cause of each signal is in the linked report or lesson.", "",
            "| Task | Span | Active | Signals |", "|---|---|---|---|"]
    out += ["| %s | %s | %s | %s |" % (h["full"], _fm(h["span"]), _fm(h["active"]), "; ".join(h["signals"])) for h in over]
    out += ["", "## Problems per task", "",
            "Audit FAILs, pre-flight FAIL checks, and the lessons whose trigger cites the task (root cause and the "
            "rule adopted as the solution, with how often it recurred).", ""]
    for h in tasks:
        fails = [p for p, v in h["verdicts"] if v == "FAIL"]
        if not (fails or h["pf_fail"] or h["lessons"] or h["reopen"]):
            continue
        out.append("### %s" % h["full"])
        out += ["- audit FAIL: [%s](%s)" % (os.path.basename(p), p) for p in fails]
        out += ["- pre-flight FAIL [%s](%s): %s" % (os.path.basename(p), p, "; ".join(cs)) for p, cs in h["pf_fail"]]
        out += ["- %s (%s) root cause `%s`, hits %s. Trigger: %s. Rule: %s" % (r[0], r[1], r[3], r[7], r[2], r[4])
                for r in h["lessons"]]
        if h["reopen"]:
            out.append("- reopened ×%d (card History)" % h["reopen"])
        out.append("")
    causes = {}
    for h in tasks:
        for r in h["lessons"]:
            causes.setdefault(r[3], set()).add(h["full"])
    out += ["## Root causes across tasks", "", "From the lessons.md Root cause column; counted, not judged.", "",
            "| Root cause | Tasks | Count |", "|---|---|---|"]
    out += ["| %s | %s | %d |" % (c, ", ".join(sorted(t)), len(t))
            for c, t in sorted(causes.items(), key=lambda x: (-len(x[1]), x[0]))]
    path = os.path.join(tracking, "history.md")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(out) + "\n")
    print("history: %d tasks, %d over %d min → %s" % (len(tasks), len(over), threshold, path))
