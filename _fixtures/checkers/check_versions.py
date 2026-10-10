import glob
import os
import re
import sys

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

chunk_files = {}  # chunk id -> [paths]
for dp, ds, fs in os.walk(DOC):
    ds[:] = [d for d in ds if not d.startswith("source-snapshot")]
    for fn in sorted(fs):
        if not fn.endswith(".md"):
            continue
        m = re.match(r"^(\d{2}[a-z]?)-", fn) or (os.path.dirname(os.path.relpath(dp, DOC)) == "" and re.match(r"^(\d{2})-", os.path.basename(dp)))
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
            listed = set(re.findall(r"\b(\d{2}[a-z]?)\b", rest))
            if not listed and not paths:
                notes.append(f"Chunks: names sections (a combined document), not chunk numbers: {detail[:80]}")
            else:
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
                    # BRD 14 tracks decisions; 15-17 are derived outputs with their own basis/status.
                    if ch == "00" or (kind == "brd" and ch in {"14", "15", "16", "17"}):
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

print("problems:", len(problems))
for p in problems:
    print(" -", p)
print("notes:", len(notes))
for n in notes:
    print(" -", n)
