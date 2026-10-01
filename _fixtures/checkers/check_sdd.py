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
            if not (before.endswith("[") and after.startswith("](")):
                problems.append(f"{fn}:{i}: unlinked {m.group(0)}: {line.strip()[:120]}")

# 3. Unkeyed BRD IDs (NFR, TI, BR are fine after a UC link)
for fn in files:
    content = strip_code(read(os.path.join(SDD, fn)))
    for i, line in enumerate(content.splitlines(), 1):
        for m in re.finditer(r"(?<![A-Z/\w])(NFR|TI)-\d\d", line):
            prefix = line[max(0, m.start() - 8):m.start()]
            if not (prefix.endswith("REFUNDS/") or prefix.endswith("LOYALTY/")):
                problems.append(f"{fn}:{i}: unkeyed {m.group(0)}: {line.strip()[:120]}")

# 4. Em dashes
for fn in files:
    content = read(os.path.join(SDD, fn))
    for i, line in enumerate(content.splitlines(), 1):
        if "\u2014" in line:
            problems.append(f"{fn}:{i}: em dash")

# 5. Section 7.3 entry points in owner List of APIs
c03 = read(os.path.join(SDD, "03-users-and-use-cases.md"))
api_lists = {}
for fn in files:
    if fn.startswith("13"):
        body = read(os.path.join(SDD, fn))
        rows = set()
        for line in body.splitlines():
            m = re.match(r"^\| (GET|POST|PUT|PATCH|DELETE|TBD) \| `?([^`|]+?)`? \|", line)
            if m:
                rows.add(f"{m.group(1)} {m.group(2).strip()}")
        api_lists[fn] = rows
for line in c03.splitlines():
    m = re.match(r"^\| \[(REFUNDS|LOYALTY)/UC-\d\d\]\([^)]*\) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|", line)
    if not m:
        continue
    owner_cell, entry_cell = m.group(3), m.group(4)
    om = re.search(r"\]\(\./(13[a-z]-[^)]+)\)", owner_cell)
    eps = re.findall(r"`([^`]+)`", entry_cell)
    if om:
        for ep in eps:
            if ep not in api_lists.get(om.group(1), set()):
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

# 7. API IDs in 13x exist in chunk 11 index
c11 = read(os.path.join(SDD, "11-api-contracts.md"))
index_ids = set(re.findall(r"^\| (API-\d\d) \|", c11, flags=re.M))
for fn in files:
    for m in re.finditer(r"API-\d\d", read(os.path.join(SDD, fn))):
        if m.group(0) not in index_ids:
            problems.append(f"{fn}: {m.group(0)} not in §15.2")

# 8. Permission tokens in 13x exist in chunk 12
c12 = read(os.path.join(SDD, "12-centralized-user-roles.md"))
tokens = set(re.findall(r"^\| `([a-z]+\.[a-z]+\.[a-z\-]+)` \|", c12, flags=re.M))
for fn in files:
    if fn.startswith("13"):
        for m in re.finditer(r"`((?:refund|loyalty|payout|notification)\.[a-z]+\.[a-z\-]+)`", read(os.path.join(SDD, fn))):
            if m.group(1) not in tokens:
                problems.append(f"{fn}: token {m.group(1)} not in §16.11")

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
