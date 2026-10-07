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

# 5. Section 7.3 entry points in owner List of APIs (a Schedule:/Event: trigger, in the owner's Input table)
c03 = read(os.path.join(SDD, "03-users-and-use-cases.md"))
api_lists = {}
inputs = {}
for fn in files:
    if fn.startswith("13"):
        body = read(os.path.join(SDD, fn))
        rows = set()
        for line in body.splitlines():
            m = re.match(r"^\| (GET|POST|PUT|PATCH|DELETE|TBD) \| `?([^`|]+?)`? \|", line)
            if m:
                rows.add(f"{m.group(1)} {m.group(2).strip()}")
        api_lists[fn] = rows
        ev, sc = set(), set()
        itab = body.split("### Input", 1)[1] if "### Input" in body else ""
        itab = re.split(r"\n#{2,3} ", itab, maxsplit=1)[0]
        for line in itab.splitlines():
            c = [x.strip() for x in line.strip().strip("|").split("|")]
            if line.startswith("|") and len(c) >= 2 and c[0] != "Type" and "---" not in c[0]:
                names = set(re.findall(r"`([^`]+)`", " ".join(c[1:])))
                if "event" in c[0].lower():
                    ev |= names
                if "schedule" in c[0].lower():
                    sc |= names
        inputs[fn] = {"event": ev, "schedule": sc}
for line in c03.splitlines():
    m = re.match(r"^\| \[(REFUNDS|LOYALTY)/UC-\d\d\]\([^)]*\) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|", line)
    if not m:
        continue
    owner_cell, entry_cell = m.group(3), m.group(4)
    om = re.search(r"\]\(\./(13[a-z]-[^)]+)\)", owner_cell)
    eps = re.findall(r"`([^`]+)`", entry_cell)
    if om:
        for ep in eps:
            tm = re.match(r"(Schedule|Event):\s*(.+?)\s*$", ep)
            if tm:
                if tm.group(2) not in inputs.get(om.group(1), {}).get(tm.group(1).lower(), set()):
                    problems.append(f"03 §7.3: entry point {ep} not in the Input table of {om.group(1)}")
            elif ep not in api_lists.get(om.group(1), set()):
                problems.append(f"03 §7.3: entry point {ep} not in {om.group(1)}")
    elif eps:
        problems.append(f"03 §7.3: entry points without owner: {line[:80]}")

# 6. Events: chunk 10 names vs 13x
c10 = read(os.path.join(SDD, "10-events-hub.md"))
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
                found = re.findall(r"`([^`]+)`", cell)
                if not found and cell not in ("-", "None - public"):
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
print("MARKERS:")
for fn, n in counts.items():
    print(f"  {fn}: {n}")
print("TOTAL MARKERS:", sum(counts.values()))
print("MERMAID BLOCKS:", sum(read(os.path.join(SDD, fn)).count("```mermaid") for fn in files))
