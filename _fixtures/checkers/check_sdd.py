import os
import re
import sys
from collections import defaultdict

SDD = os.path.abspath(sys.argv[1])

problems = []


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def gh_anchor(text):
    t = text.strip().lower()
    t = re.sub(r"[^\w\- ]", "", t, flags=re.UNICODE)
    t = t.replace("_", "_")
    return t.replace(" ", "-")


_anchor_cache = {}


def anchors_of(path):
    if path in _anchor_cache:
        return _anchor_cache[path]
    _anchor_cache[path] = _anchors_of(path)
    return _anchor_cache[path]


def _anchors_of(path):
    content = read(path)
    content = re.sub(r"```.*?```", "", content, flags=re.S)
    seen = defaultdict(int)
    result = set()
    for line in content.splitlines():
        m = re.match(r"^(#{1,6})\s+(.*?)\s*#*\s*$", line)
        if not m:
            continue
        a = gh_anchor(m.group(2))
        if seen[a]:
            result.add(f"{a}-{seen[a]}")
        else:
            result.add(a)
        seen[a] += 1
    return result


def strip_code(content):
    return re.sub(r"```.*?```", "", content, flags=re.S)


files = sorted(f for f in os.listdir(SDD) if f.endswith(".md"))

# 1. Links and anchors
link_re = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")
for fn in files:
    content = strip_code(read(os.path.join(SDD, fn)))
    content = re.sub(r"<!--.*?-->", "", content, flags=re.S)
    for m in link_re.finditer(content):
        target = m.group(2)
        if target.startswith("http"):
            continue
        path, _, anchor = target.partition("#")
        full = os.path.normpath(os.path.join(SDD, path)) if path else os.path.join(SDD, fn)
        if not os.path.exists(full):
            problems.append(f"{fn}: missing file {target}")
            continue
        if anchor and full.endswith(".md"):
            if anchor not in anchors_of(full):
                problems.append(f"{fn}: missing anchor {target}")

# 2. UC mentions: keyed, linked (outside code blocks)
for fn in files:
    content = strip_code(read(os.path.join(SDD, fn)))
    content = re.sub(r"<!--.*?-->", "", content, flags=re.S)
    for i, line in enumerate(content.splitlines(), 1):
        line = re.sub(r"`[^`]*`", "", line)
        for m in re.finditer(r"(?<![A-Z/])UC-\d\d", line):
            start = m.start()
            prefix = line[max(0, start - 8):start]
            if not (prefix.endswith("REFUNDS/") or prefix.endswith("LOYALTY/")):
                if "Merged into UC-04" in line and line[start - 12:start] == "Merged into ":
                    continue
                problems.append(f"{fn}:{i}: unkeyed {m.group(0)}: {line.strip()[:120]}")
        for m in re.finditer(r"(REFUNDS|LOYALTY)/UC-\d\d", line):
            before = line[:m.start()]
            after = line[m.end():]
            if before.endswith("Merged into "):
                continue
            if not (before.endswith("[") and after.startswith("](")):
                problems.append(f"{fn}:{i}: unlinked {m.group(0)}: {line.strip()[:120]}")

# 3. Unkeyed BRD IDs (NFR, TI, BR are fine after a UC link)
for fn in files:
    content = strip_code(read(os.path.join(SDD, fn)))
    for i, line in enumerate(content.splitlines(), 1):
        line = re.sub(r"`[^`]*`", "", line)
        for m in re.finditer(r"(?<![A-Z/\w])(NFR|TI)-\d\d", line):
            prefix = line[max(0, m.start() - 8):m.start()]
            if m.group(1) == "TI" and re.search(r"(?:REFUNDS|LOYALTY) \d\d $", line[:m.start()]):
                continue
            if not (prefix.endswith("REFUNDS/") or prefix.endswith("LOYALTY/")):
                problems.append(f"{fn}:{i}: unkeyed {m.group(0)}: {line.strip()[:120]}")

# 4. Em dashes
for fn in files:
    content = read(os.path.join(SDD, fn))
    for i, line in enumerate(content.splitlines(), 1):
        if "\u2014" in line:
            problems.append(f"{fn}:{i}: em dash")

# 5. Section 7.3 entry points in the List of APIs of the service they name, else the owner's
#    (a Schedule:/Event: trigger, on an Input row citing the use case); Events fired per chunk 10;
#    and every Input trigger row citing a use case is in its entry points, unless it fires the event
c03 = read(os.path.join(SDD, "03-users-and-use-cases.md"))
c10 = read(os.path.join(SDD, "10-events-hub.md"))
notes = []
api_lists = {}
inputs = {}
trig_ucs = {}
cited_triggers = []
trig_name = {"event": r"[A-Z][A-Za-z0-9_]+", "schedule": r"[a-z][a-z0-9]*(?:-[a-z0-9]+)*"}
for fn in files:
    if fn.startswith("13"):
        body = read(os.path.join(SDD, fn))
        rows = set()
        for line in body.splitlines():
            m = re.match(r"^\| (GET|POST|PUT|PATCH|DELETE|TBD) \| `?([^`|]+?)`? \|", line)
            if m:
                rows.add(f"{m.group(1)} {m.group(2).strip()}")
        api_lists[fn] = rows
        inputs[fn] = {"event": set(), "schedule": set()}
        itab = body.split("### Input", 1)[1] if "### Input" in body else ""
        itab = re.split(r"\n#{2,3} ", itab, maxsplit=1)[0]
        for line in itab.splitlines():
            c = [x.strip() for x in line.strip().strip("|").split("|")]
            if not (line.startswith("|") and len(c) >= 3 and c[0] != "Type" and "---" not in c[0]):
                continue
            kind = next((k for k in ("event", "schedule") if k in c[0].lower()), None)
            if not kind:
                continue
            names = []
            for n in re.findall(r"`([^`]+)`", c[1] + " | " + c[2]):
                if re.fullmatch(trig_name[kind], n) and n not in names:
                    names.append(n)
            if kind == "schedule" and "`" not in c[1] and re.fullmatch(trig_name[kind], c[1]):
                names = [c[1]]
            inputs[fn][kind] |= set(names)
            ucs = re.findall(r"\[((?:REFUNDS|LOYALTY)/UC-\d\d)\]\(", " ".join(c[1:]))
            if kind == "event" and len(names) > 1 and ucs:
                problems.append(f"{fn} Input row lists {len(names)} events and cites a use case")
                continue
            for name in names:
                trig_ucs.setdefault((fn, kind, name), set()).update(ucs)
                for uc in ucs:
                    if (fn, kind.capitalize(), name, uc) not in cited_triggers:
                        cited_triggers.append((fn, kind.capitalize(), name, uc))


def service_file(name):
    for fn in api_lists:
        if re.fullmatch(r"13[a-z]-(?:service-)?" + re.escape(name.strip().replace(" ", "-")) + r"\.md", fn, flags=re.I):
            return fn
    return None


def section(text, num):
    m = re.search(r"^## " + re.escape(num) + r"\b.*?(?=^## |\Z)", text, flags=re.M | re.S)
    return m.group(0) if m else ""


fired = defaultdict(set)
for num, col in (("14.5", "Business: what · when · why"), ("14.10", "When")):
    head = None
    for line in section(c10, num).splitlines():
        if not line.startswith("|"):
            head = None
            continue
        c = [x.strip() for x in line.strip().strip("|").split("|")]
        if c[0] == "Event":
            head = c
        elif head and col in head and re.fullmatch(r"`[^`]+`", c[0]) and len(c) > head.index(col):
            when = c[head.index(col)]
            parts = when.split(" · ")
            when = parts[1] if num == "14.5" and len(parts) >= 3 else when
            fired[c[0].strip("`")] |= set(re.findall(r"\[([A-Z]+/UC-\d\d)\]\(", when))

uc_rows = {}
for line in c03.splitlines():
    m = re.match(r"^\| \[(REFUNDS|LOYALTY)/UC-\d\d\]\([^)]*\) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|", line)
    if not m:
        continue
    owner_cell, entry_cell = m.group(3), m.group(4)
    om = re.search(r"\]\(\./(13[a-z]-[^)]+)\)", owner_cell)
    eps = re.findall(r"`([^`]+)`(?:\s*\(([A-Za-z][\w -]*)\))?", entry_cell)
    cells = [x.strip() for x in line.strip().strip("|").split("|")]
    uc_id = re.match(r"\[([A-Z]+/UC-\d\d)\]", cells[0]).group(1)
    own_events = set()
    for ev in re.findall(r"`([^`]+)`", cells[6] if len(cells) > 6 else ""):
        if uc_id in fired.get(ev, set()):
            own_events.add(ev)
        else:
            problems.append(f"03 §7.3: {uc_id} Events lists {ev}, which §14.5/§14.10 do not fire for {uc_id}")
    uc_rows[uc_id] = (entry_cell, own_events)
    if om:
        for ep, named in eps:
            target = service_file(named) if named else om.group(1)
            if not target:
                problems.append(f"03 §7.3: entry point {ep} names service '{named}', which matches no 13x file")
                continue
            tm = re.match(r"(Schedule|Event):\s*(.+?)\s*$", ep)
            if tm:
                kind, name = tm.group(1).lower(), tm.group(2)
                if name not in inputs.get(target, {}).get(kind, set()):
                    problems.append(f"03 §7.3: entry point {ep} not in the Input table of {target}")
                    continue
                cites = trig_ucs.get((target, kind, name))
                if cites is not None and not cites:
                    notes.append(f"03 §7.3: {ep} for {uc_id}: its Input row in {target} cites no use case (predates the trigger tie)")
                elif cites is not None and uc_id not in cites:
                    problems.append(f"03 §7.3: entry point {ep} for {uc_id}: its Input row in {target} cites {', '.join(sorted(cites))}, not {uc_id}")
            elif ep not in api_lists.get(target, set()):
                problems.append(f"03 §7.3: entry point {ep} not in {target}")
    elif eps:
        problems.append(f"03 §7.3: entry points without owner: {line[:80]}")
for fn, kind, name, uc in cited_triggers:
    if uc not in uc_rows:
        continue
    entry_cell, own_events = uc_rows[uc]
    if kind == "Event" and name in own_events:
        continue
    if not re.search(r"`" + kind + r":\s*" + re.escape(name) + r"`", entry_cell):
        problems.append(f"03 §7.3: {fn} Input {kind} {name} cites {uc}, but is not in its entry points")

# 6. Events: chunk 10 names vs 13x
hub_events = set(re.findall(r"^\| `([A-Z_]+)` \| ([^|]+) \| `", c10, flags=re.M))
hub_names = {e for e, _ in hub_events}
for fn in files:
    if fn.startswith("13"):
        body = read(os.path.join(SDD, fn))
        for m in re.finditer(r"^\| `([A-Z][A-Z_]+)` \|", body, flags=re.M):
            if m.group(1) not in hub_names:
                problems.append(f"{fn}: event {m.group(1)} not in chunk 10")

# 7. API IDs exist in chunk 11 index (chunk 18 proposals excepted)
def without_proposals(fn, text):
    if not fn.startswith("18-"):
        return text
    lines = text.split("\n")
    for s in [k for k, l in enumerate(lines) if re.match(r"^#{2,4} OI-\d+", l)]:
        e = next((k for k in range(s + 1, len(lines)) if re.match(r"^#{1,4} ", lines[k]) or lines[k].strip() == "---"), len(lines))
        applied = any(re.match(r"^- \*\*Status:\*\*\s*Accepted - applied", l) for l in lines[s:e])
        field = None
        for k in range(s + 1, e):
            m = re.match(r"^- \*\*([^*]+?):\*\*", lines[k])
            if m:
                field = m.group(1)
            if field in ("Options", "Why") or (field == "Recommended Answer" and not applied):
                lines[k] = ""
    return "\n".join(lines)


c11 = read(os.path.join(SDD, "11-api-contracts.md"))
index_ids = set(re.findall(r"^\| (API-\d\d) \|", c11, flags=re.M))
for fn in files:
    for m in re.finditer(r"API-\d\d", without_proposals(fn, read(os.path.join(SDD, fn)))):
        if m.group(0) not in index_ids:
            problems.append(f"{fn}: {m.group(0)} not in §15.2")

# 8. Permission tokens in 13x exist in chunk 12
c12 = read(os.path.join(SDD, "12-centralized-user-roles.md"))
tokens = set(re.findall(r"^\| `([a-z][a-z-]*\.[a-z][a-z-]*\.[a-z][a-z-]*)` \|", c12, flags=re.M))
c10_path = os.path.join(SDD, "10-events-hub.md")
topics = set(re.findall(r"^\| \d+ \| `([a-z0-9][a-z0-9.-]*)` \|", read(c10_path), flags=re.M)) if os.path.isfile(c10_path) else set()
for fn in files:
    if fn.startswith("13"):
        for m in re.finditer(r"`([a-z][a-z-]*\.[a-z][a-z-]*\.[a-z][a-z-]*)`", read(os.path.join(SDD, fn))):
            if m.group(1).endswith(".dlq") and m.group(1).split(".")[0] in topics:
                continue
            if m.group(1) not in tokens:
                problems.append(f"{fn}: token {m.group(1)} not in §16.11")


def cells(row):
    return [c.strip() for c in row.strip().strip("|").split("|")]


def norm_ep(text):
    return re.sub(r"\s+", " ", text.replace("`", "")).strip()


sec152 = re.split(r"\n## ", c11.split("\n## 15.2", 1)[1], maxsplit=1)[0] if "\n## 15.2" in c11 else ""
index = {}
for line in sec152.splitlines():
    if re.match(r"^\| API-\d\d \|", line):
        index[cells(line)[0]] = cells(line)
index_head = next((cells(l) for l in sec152.splitlines() if l.startswith("| API ID |")), [])
uri_col = index_head.index("Method & URI") if "Method & URI" in index_head else None
for fn in files:
    if not fn.startswith("13"):
        continue
    lines = read(os.path.join(SDD, fn)).splitlines()
    for i, line in enumerate(lines):
        if not line.startswith("| Method | Path |"):
            continue
        head = cells(line)
        for col in ("Permission token (§16)", "API ID (§15)"):
            if col not in head:
                problems.append(f"{fn}: List of APIs has no '{col}' column")
        for row in lines[i + 2:]:
            if not row.startswith("|"):
                break
            c = dict(zip(head, cells(row)))
            ep = norm_ep(f"{c.get('Method', '')} {c.get('Path', '')}")
            if "Permission token (§16)" in head:
                cell = c.get("Permission token (§16)", "")
                bare = cell.replace("`", "").strip()
                found = [] if bare in ("-", "None - public") else re.findall(r"`([^`]+)`", cell)
                if not found and bare not in ("-", "None - public"):
                    problems.append(f"{fn}: {ep}: permission token cell {cell!r} names no token")
                for token in found:
                    if token not in tokens:
                        problems.append(f"{fn}: {ep}: permission token {token} not in §16.11")
            for api in re.findall(r"API-\d\d", c.get("API ID (§15)", "")):
                if uri_col is not None and api in index and "TBD" not in index[api][uri_col] and norm_ep(index[api][uri_col]) != ep:
                    problems.append(f"{fn}: {ep}: {api} is {norm_ep(index[api][uri_col])!r} in §15.2")
for line in c11.splitlines():
    if line.startswith("| Authorization |"):
        for token in re.findall(r"`([a-z][a-z-]*\.[a-z][a-z-]*\.[a-z][a-z-]*)`", line):
            if token not in tokens:
                problems.append(f"11: contract Authorization token {token} not in §16.11")

# 9. Marker counts
counts = {}
for fn in files:
    counts[fn] = len(re.findall(r"\[NEEDS CLARIFICATION:", read(os.path.join(SDD, fn))))

print("PROBLEMS:", len(problems))
for p in problems:
    print(" -", p)
if notes:
    print("NOTES:", len(notes))
    for n in notes:
        print(" -", n)
print("MARKERS:")
for fn, n in counts.items():
    print(f"  {fn}: {n}")
print("TOTAL MARKERS:", sum(counts.values()))
print("MERMAID BLOCKS:", sum(read(os.path.join(SDD, fn)).count("```mermaid") for fn in files))
