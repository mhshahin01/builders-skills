import glob
import os
import re
import sys

from _e2e_gate import SERVICE_CHUNK, item_ids, unclosed_items

DOC = os.path.abspath(sys.argv[1])

problems = []
notes = []


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def cells(row):
    return [c.strip() for c in row.strip().strip("|").split("|")]


def sect(txt, head):
    lvl = len(head.split(" ")[0])
    out, on = [], False
    for line in txt.split("\n"):
        if not on and line.startswith(head):
            on = True
        elif on:
            m = re.match(r"^(#+) ", line)
            if m and len(m.group(1)) <= lvl:
                break
        if on:
            out.append(line)
    return "\n".join(out)


def table(txt, header_start):
    lines = txt.split("\n")
    for i, line in enumerate(lines):
        if line.startswith(header_start):
            head = cells(line)
            out = []
            for r in lines[i + 2:]:
                if not r.startswith("|"):
                    break
                out.append((dict(zip(head, cells(r))), r))
            return out
    return []


def version_of(path):
    m = re.search(r"^VERSION:\s*(\d+(?:\.\d+)*)", read(path), re.M)
    return m.group(1) if m else None


# ---- document shape
masters = sorted(f for f in os.listdir(DOC) if f.endswith("-master.md"))
master = masters[0] if masters else None
c00 = sorted(glob.glob(os.path.join(DOC, "00-*.md")))
base = os.path.basename(DOC)
kind = ("brd" if (master or "").endswith("-brd-master.md") or base.startswith("brd-") else
        "sdd" if (master or "").endswith("-sdd-master.md") or base.startswith("sdd-") else
        "lld" if (master or "").endswith("-lld-master.md") or base.startswith("lld-") else "other")
CHUNK_ID = SERVICE_CHUNK + r"|\d{2}[a-z]?"
DECK_CHUNK = {"sdd": "20", "lld": "19"}
DERIVED_CHUNKS = {"brd": {"14", "15", "16", "17"}, "sdd": {DECK_CHUNK["sdd"]}, "lld": {DECK_CHUNK["lld"]}}

chunk_files = {}  # chunk id -> [paths]
for dp, ds, fs in os.walk(DOC):
    ds[:] = [d for d in ds if d != '_raw-source' and not re.fullmatch(r'source-snapshot(?:-v\d+(?:\.\d+)*)?', d)]
    for fn in sorted(fs):
        if not fn.endswith(".md"):
            continue
        m = re.match(r"^(" + CHUNK_ID + r")-", fn) or (os.path.dirname(os.path.relpath(dp, DOC)) == "" and re.match(r"^(\d{2})-", os.path.basename(dp)))
        if m:
            chunk_files.setdefault(m.group(1), []).append(os.path.join(dp, fn))

print(f"document: {base} ({kind}), master {master}, chunks {sorted(chunk_files)}")

# ---- F1: the newest Changes Log row's Chunks: list against the chunk VERSION: headers
if not c00:
    problems.append("no 00-*.md file")
else:
    log = table(sect(read(c00[0]), "## Changes Log"), "| Version")
    if not log:
        notes.append("no Changes Log table in " + os.path.basename(c00[0]))
    else:
        row, raw = log[-1]
        ver = re.match(r"\s*(\d+(?:\.\d+)*)", row.get("Version", ""))
        ver = ver.group(1) if ver else None
        print(f"newest Changes Log row: v{ver} ({row.get('Updated Date', row.get('Date', '?'))[:10]})")
        summary = row.get("Update Summary", row.get("Change Summary", ""))
        cm = re.search(r"Chunks:\s*(.+?)\s*$", summary)
        if not cm:
            print(f"version check: no `Chunks:` list in the newest Changes Log row (v{ver})")
        elif re.match(r"none\s*\(initial build\)", cm.group(1), re.I):
            print("version check: initial build, no changed chunks listed")
        else:
            # A per-module path selects that file only; plain 04 still selects all modules.
            detail = cm.group(1)
            paths = re.findall(r"\b\d{2}-[\w-]+/[\w.-]+\.md\b", detail)
            rest = detail
            selected = set()
            for rel in paths:
                rest = rest.replace(rel, "")
                p = os.path.join(DOC, *rel.split("/"))
                if not os.path.isfile(p):
                    problems.append(f"Chunks: lists {rel}, which has no file")
                else:
                    selected.add(p)
            listed = set(re.findall(r"\b(" + CHUNK_ID + r")\b", rest))
            if not listed and not paths:
                notes.append(f"Chunks: names sections (a combined document), not chunk numbers: {detail[:80]}")
            else:
                if DECK_CHUNK.get(kind) in listed:
                    problems.append(f"Chunks: lists chunk {DECK_CHUNK[kind]}, the deck brief, which a Changes Log row never lists")
                    listed.discard(DECK_CHUNK[kind])
                for ch in sorted(listed):
                    if ch not in chunk_files:
                        problems.append(f"Chunks: lists chunk {ch}, which has no file")
                    selected.update(chunk_files.get(ch, []))
                for p in sorted(selected):
                    if version_of(p) != ver:
                        rel = os.path.relpath(p, DOC).replace("\\", "/")
                        ident = next((ch for ch, files in chunk_files.items() if p in files), rel)
                        problems.append(f"Chunks: lists {ident} but {rel} carries VERSION {version_of(p)}, not {ver}")
                for ch, files in sorted(chunk_files.items()):
                    # BRD 14 tracks decisions; BRD 15-17, SDD 20 and LLD 19 are derived outputs with their own basis/status.
                    if ch == "00" or ch in DERIVED_CHUNKS.get(kind, ()):
                        continue
                    for p in files:
                        if p not in selected and version_of(p) == ver:
                            rel = os.path.relpath(p, DOC).replace("\\", "/")
                            problems.append(f"Chunks: does not list {rel} but it carries VERSION {ver}")
                for label, p in (("master", master and os.path.join(DOC, master)), ("00", c00[0])):
                    if p and version_of(p) != ver:
                        problems.append(f"{label} {os.path.basename(p)} carries VERSION {version_of(p)}, not the newest row's {ver}")

# ---- F4 (BRD only): the state of chunks 15, 16, 17 reads the same in three places
def state_of(text):
    m = re.match(r"\s*(Up to date|Provisional|Stale|Locked)\b", text or "")
    return m.group(1) if m else None


if kind == "brd":
    todo = os.path.join(DOC, "14-todo.md")
    t14 = read(todo) if os.path.isfile(todo) else ""
    dstream = sect(t14, "## Downstream outputs") if t14 else ""
    mtxt = read(os.path.join(DOC, master)) if master else ""
    dchunks = sect(mtxt, "## Delivery Chunks") if mtxt else ""
    for nn, fn in (("15", "15-implementation.md"), ("16", "16-uat-bat-test-cases.md"), ("17", "17-for-ppt.md")):
        states = {}
        f15 = glob.glob(os.path.join(DOC, nn + "-*.md"))
        if f15:
            sm = re.search(r"^\*\*[^*\n]*[Ss]tatus:\*\*\s*(.+?)\s*(?:\||$)", read(f15[0]), re.M)
            if sm:
                states["status line"] = state_of(sm.group(1))
                if states["status line"] is None:
                    problems.append(f"{fn}: status line carries no known state: {sm.group(1)[:60]}")
            else:
                problems.append(f"{fn} exists but has no status line")
        rows = [c for c in (cells(r) for r in dstream.splitlines() if r.startswith("|")) if len(c) >= 3 and fn in c[1]]
        if not dstream.strip():
            notes.append("no Downstream outputs table in 14-todo.md")
        elif not rows:
            problems.append(f"14-todo.md Downstream outputs has no row for {fn}")
        else:
            states["chunk 14 row"] = state_of(rows[0][2])
        rows = [c for c in (cells(r) for r in dchunks.splitlines() if r.startswith("|")) if len(c) >= 3 and fn in c[1]]
        if not dchunks.strip():
            notes.append("no Delivery Chunks table in the master")
        elif not rows:
            problems.append(f"master Delivery Chunks has no row for {fn}")
        else:
            states["master State cell"] = state_of(rows[0][2])
        got = sorted({v for v in states.values() if v})
        if len(got) > 1:
            problems.append(f"chunk {nn} state differs: " + ", ".join(f"{k} {v}" for k, v in states.items()))
        elif not f15 and got and got != ["Locked"]:
            problems.append(f"chunk {nn} does not exist but reads {got[0]} in: " + ", ".join(k for k, v in states.items() if v != "Locked"))
        print(f"gate state {nn}: " + (", ".join(f"{k} {v}" for k, v in states.items()) if states else "no state found") + ("" if f15 else " (no chunk file)"))

DECK_STATE = {
    "sdd": re.compile(r"Locked|Up to date|Stale|Provisional \(OI-\d+(?:, OI-\d+)*\)"),
    "lld": re.compile(r"Locked|Up to date|Stale|Provisional \(OI-\d+(?:, OI-\d+)*\)"),
}


def deck_state(value):
    return re.split(r" (?:\||-) ", value.strip(), maxsplit=1)[0].strip()


if kind in DECK_CHUNK:
    num = DECK_CHUNK[kind]
    deck_files = sorted(glob.glob(os.path.join(DOC, num + "-*.md")))
    fn = os.path.basename(deck_files[0]) if deck_files else None
    dtxt = read(deck_files[0]) if fn else ""
    mtxt = read(os.path.join(DOC, master)) if master else ""
    c18 = sorted(glob.glob(os.path.join(DOC, "18-*.md")))
    states = {}
    if fn:
        sm = re.search(r"^\*\*Brief status:\*\*[ \t]*(.+?)[ \t]*$", dtxt, re.M)
        if not sm:
            problems.append(f"{fn} exists but has no status line")
        elif DECK_STATE[kind].fullmatch(deck_state(sm.group(1))):
            states["status line"] = deck_state(sm.group(1))
        else:
            problems.append(f"{fn}: status line carries no known state: {deck_state(sm.group(1))[:60]}")
    ml = re.search(r"^\*\*Deck brief \(chunk " + num + r"\):\*\*[ \t]*(.+?)[ \t]*$", mtxt, re.M)
    if ml and DECK_STATE[kind].fullmatch(deck_state(ml.group(1))):
        states["master Deck brief line"] = deck_state(ml.group(1))
    elif ml:
        problems.append(f"master Deck brief (chunk {num}) line carries no known state: {deck_state(ml.group(1))[:60]}")
    elif fn and master:
        problems.append(f"{fn} exists but the master has no Deck brief (chunk {num}) line")
    got = sorted(set(states.values()))
    if len(got) > 1:
        problems.append(f"chunk {num} state differs: " + ", ".join(f"{k} {v}" for k, v in states.items()))
    elif fn and got == ["Locked"]:
        problems.append(f"chunk {num} exists but reads Locked in: " + ", ".join(states))
    elif not fn and got and got != ["Locked"]:
        problems.append(f"chunk {num} does not exist but reads {got[0]} in: " + ", ".join(k for k, v in states.items() if v != "Locked"))
    if fn or ml:
        print(f"gate state {num}: " + (", ".join(f"{k} {v}" for k, v in states.items()) if states else "no state found") + ("" if fn else " (no chunk file)"))
    if fn:
        named = {oi for v in states.values() for oi in re.findall(r"OI-\d+", v)}
        for oi in sorted(named - (item_ids(read(c18[0])) if c18 else set())):
            problems.append(f"{fn} names {oi}, which is not an item of chunk 18")
        if "Up to date" in states.values():
            if kind == "sdd":
                gate = re.search(r"^\*\*E2E gate \(chunk 19\):\*\*[ \t]*(.+?)[ \t]*$", mtxt, re.M)
                if not gate:
                    problems.append(f"{fn} is Up to date but the master has no E2E gate (chunk 19) line")
                elif not gate.group(1).startswith("Open - Up to date"):
                    problems.append(f"{fn} is Up to date but the master E2E gate line reads: {gate.group(1)[:60]}")
            elif not c18:
                problems.append(f"{fn} is Up to date but the LLD has no chunk 18")
            else:
                unclosed = unclosed_items(read(c18[0]))
                if unclosed:
                    problems.append(f"{fn} is Up to date but chunk 18 is not cleared: " + ", ".join(f"{oi}: {status}" for oi, status in unclosed[:5]))
        if "[NEEDS CLARIFICATION" in dtxt:
            problems.append(f"{fn} holds a clarification marker")
        if chr(0x2014) in dtxt:
            problems.append(f"{fn} holds an em dash")
        if re.search(r"^[ \t]*```mermaid", dtxt, re.M):
            problems.append(f"{fn} holds a Mermaid block")

print("problems:", len(problems))
for p in problems:
    print(" -", p)
print("notes:", len(notes))
for n in notes:
    print(" -", n)
