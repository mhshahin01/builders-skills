import glob
import os
import re
import sys

from _e2e_gate import unclosed_items

DOC = os.path.abspath(sys.argv[1])

problems = []
notes = []

KINDS = ("Open question", "Assumption to validate", "Pending decision")
STATUS = re.compile(r"^(Open|Decided - pending application|Resolved|Deferred)\b")
SPECIFIC = re.compile(r"UC-\d+|NFR|\bAC-?\d+|BO-\d+|MK-\d+|TASK-\d+|TC-\d+|BR-\d+|§|\b\d{2}[a-z]?\b|Main Flow|\bstep \d+|Business Objective \d+|Objective \d+|go-live|BAT sign-off|Build of|Table \d+|Figure \d+", re.I)
PLACEHOLDER = re.compile(r"^(\[.*\]|-|\u2014|n/a|none|tbd|\.\.\.)?$", re.I)
LINK = re.compile(r"\[([^\]]*)\]\(([^)]*)\)")
MARKER = "[NEEDS CLARIFICATION"


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def cells(row):
    return [c.strip() for c in re.split(r"(?<!\\)\|", row.strip().strip("|"))]


def uncomment(txt):
    return re.sub(r"<!--.*?-->", "", txt, flags=re.S)


def chunk_id(name):
    m = re.match(r"^(\d{2}[a-z]?)-", os.path.basename(name))
    return m.group(1) if m else None


def locations(source):
    out = []
    for part in re.split(r";\s*", source):
        part = part.strip()
        if not part:
            continue
        m = LINK.search(part)
        text = (m.group(1) if m else part).strip()
        url = m.group(2) if m else ""
        rest = LINK.sub("", part).strip()
        out.append((text, url, rest))
    return out


def cited_chunk(text, url):
    m = re.match(r"^(\d{2}[a-z]?)\s*/", text)
    if m:
        return m.group(1)
    m = re.match(r"^(?:\./)?(\d{2}[a-z]?)-", os.path.basename(url.split("#")[0])) if url else None
    return m.group(1) if m else None


todo = os.path.join(DOC, "14-todo.md")
if not os.path.isfile(todo):
    print("problems: 1")
    print(" - no 14-todo.md in", DOC)
    print("notes: 0")
    sys.exit(0)

lines = read(todo).split("\n")
head = next((i for i, l in enumerate(lines) if re.match(r"^\|\s*ID\s*\|\s*Priority\s*\|\s*Kind\s*\|", l)), None)
if head is None:
    problems.append("14-todo.md has no Open items register (header | ID | Priority | Kind | ...)")
    rows = []
    cols = {}
else:
    hdr = cells(lines[head])
    cols = {h.split(" (")[0].strip().lower(): k for k, h in enumerate(hdr)}
    rows = [cells(l) for l in lines[head + 2:] if l.startswith("| TD-")]


def col(r, name):
    k = cols.get(name)
    return r[k] if k is not None and k < len(r) else ""


live = []
blocks_seen = {}
cited_ois = set()
cited_chunks = {}
for r in rows:
    tid = col(r, "id")
    kind = col(r, "kind")
    source = col(r, "source")
    blocks = col(r, "blocks")
    owner = col(r, "owner")
    status = col(r, "status")
    if kind not in KINDS:
        problems.append(f"{tid}: Kind {kind!r} is not one of {', '.join(KINDS)}")
    if not STATUS.match(status):
        problems.append(f"{tid}: Status {status!r} is not Open, Decided - pending application, Resolved (...), or Deferred (...)")
    if PLACEHOLDER.match(owner):
        problems.append(f"{tid}: Owner is empty or a placeholder ({owner!r})")
    locs = locations(source)
    if not locs:
        problems.append(f"{tid}: Source is empty")
    for text, url, rest in locs:
        if re.fullmatch(r"(chunk\s*)?\d{2}[a-z]?", text, re.I) and not rest:
            problems.append(f"{tid}: Source names a chunk alone ({text!r}), not the exact place")
        ch = cited_chunk(text, url)
        if ch:
            cited_chunks.setdefault(ch, set()).add(tid)
            if ch == "13":
                cited_ois.update(re.findall(r"\bOI-\d+\b", text + " " + rest))
    if status.startswith("Resolved"):
        continue
    live.append(tid)
    if PLACEHOLDER.match(blocks):
        problems.append(f"{tid}: Blocks is empty or a placeholder ({blocks!r})")
    elif not SPECIFIC.search(blocks):
        problems.append(f"{tid}: Blocks names no use case, NFR, or chunk section ({blocks!r})")
    blocks_seen.setdefault(blocks, []).append(tid)
    if col(r, "decision or clarification needed").count("?") > 1:
        notes.append(f"{tid}: the decision cell asks more than one question; check it is one question or the proposals of one use case or section")

for text, tids in blocks_seen.items():
    if len(tids) >= 4 and len(tids) * 2 >= len(live) and not PLACEHOLDER.match(text):
        problems.append(f"Blocks text repeated in {len(tids)} of {len(live)} live rows, so it is generic: {text!r}")

c13 = os.path.join(DOC, "13-open-items-and-clarifications.md")
open_ois = []
if os.path.isfile(c13):
    open_ois = [oi for oi, _ in unclosed_items(read(c13))]
    for oi in open_ois:
        if oi not in cited_ois:
            problems.append(f"{oi} is not closed in chunk 13 but no TD row cites 13 / {oi} in its Source")
else:
    notes.append("no 13-open-items-and-clarifications.md")

marker_chunks = {}
for p in sorted(glob.glob(os.path.join(DOC, "*.md"))):
    ch = chunk_id(p)
    if not ch or int(ch[:2]) > 12:
        continue
    txt = uncomment(read(p))
    n = txt.count(MARKER)
    if not n:
        continue
    marker_chunks[ch] = n
    if ch not in cited_chunks:
        problems.append(f"chunk {ch} has {n} clarification marker(s) and no TD row cites it in its Source")
        continue
    srcs = " ".join(col(r, "source") for r in rows)
    heading = ""
    for line in txt.split("\n"):
        if line.startswith("#"):
            heading = line
        if MARKER in line:
            uc = re.search(r"\bUC-\d+\b", heading)
            if uc and not re.search(rf"\b{ch}\s*/[^;|]*\b{uc.group(0)}\b", srcs):
                notes.append(f"chunk {ch}: a marker under {uc.group(0)} ({heading.strip()[:60]}) has no TD Source naming {ch} / {uc.group(0)}")

print(f"register rows: {len(rows)} ({len(live)} not resolved); kinds: " + ", ".join(f"{k} {sum(1 for r in rows if col(r, 'kind') == k)}" for k in KINDS))
print(f"chunk 13 items not closed: {len(open_ois)}; chunks 00-12 with markers: " + (", ".join(f"{k} ({v})" for k, v in sorted(marker_chunks.items())) or "none"))
print("problems:", len(problems))
for p in problems:
    print(" -", p)
print("notes:", len(notes))
for n in notes:
    print(" -", n)
