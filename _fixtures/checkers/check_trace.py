import os, re, sys

ROOT = sys.argv[1]
LLD = os.path.join(ROOT, "lld-refunds-platform")
SDD = os.path.join(ROOT, "sdd-refunds-platform")
BRD_R = os.path.join(ROOT, "brd-refunds-portal")

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

problems = []

# ---- SDD 7.3 rows
s73 = {}
for line in read(os.path.join(SDD, "03-users-and-use-cases.md")).splitlines():
    m = re.match(r"\| \[((REFUNDS|LOYALTY)/UC-\d\d)\]\([^)]*\) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|.*\| ([^|]+) \|\s*$", line)
    if m:
        uc, title, owner, entry, status = m.group(1), m.group(3).strip(), m.group(4).strip(), m.group(5).strip(), m.group(6).strip()
        owner = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", owner)
        s73[uc] = dict(title=title, owner=owner, entry=entry, status=status)
print("SDD 7.3 rows:", list(s73))

# ---- BRD REFUNDS chunk 16 Related UC
tc_by_uc = {}
for line in read(os.path.join(BRD_R, "16-uat-bat-test-cases.md")).splitlines():
    m = re.match(r"\| (TC-[A-Z]{3}-\d\d) \|(.*)$", line)
    if m:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        tc, related = cells[0], cells[5]
        for uc in re.findall(r"UC-\d\d", related):
            tc_by_uc.setdefault("REFUNDS/" + uc, []).append("REFUNDS/" + tc)

# ---- LLD 04 blocks and traceability lines
blocks = {}
for fn in os.listdir(os.path.join(LLD, "04-implementation")):
    txt = read(os.path.join(LLD, "04-implementation", fn))
    lines = txt.splitlines()
    for i, line in enumerate(lines):
        m = re.match(r"^### ((REFUNDS|LOYALTY)/UC-\d\d): (.*)$", line)
        if m:
            uc, title = m.group(1), m.group(3).strip()
            trace = next((l for l in lines[i+1:i+4] if l.startswith("> **Traceability:**")), None)
            if uc in blocks:
                problems.append(f"duplicate block {uc}")
            blocks[uc] = dict(file=fn, title=title, trace=trace)

for uc, row in s73.items():
    if row["status"] != "Active":
        if uc in blocks:
            problems.append(f"{uc} is {row['status']} but has a block")
        continue
    b = blocks.get(uc)
    if not b:
        problems.append(f"{uc} active, no block"); continue
    if b["title"] != row["title"]:
        problems.append(f"{uc} title differs: {b['title']!r} vs {row['title']!r}")
    if b["file"] != row["owner"] + ".md":
        problems.append(f"{uc} block in {b['file']}, owner {row['owner']}")
    t = b["trace"] or ""
    fields = dict()
    for part in t.replace("> **Traceability:** ", "").split(" · "):
        k, _, v = part.partition(": ")
        if k.startswith("BRD "): fields["BRD"] = k[4:]
        elif k.startswith("SDD "): fields["SDD"] = k[4:]
        else: fields[k] = v
    if fields.get("Owner") != row["owner"]:
        problems.append(f"{uc} owner {fields.get('Owner')} vs {row['owner']}")
    if fields.get("Entry points") != row["entry"]:
        problems.append(f"{uc} entry points differ:\n   LLD {fields.get('Entry points')}\n   SDD {row['entry']}")
    tcs = re.findall(r"\[((?:REFUNDS|LOYALTY)/TC-[A-Z]{3}-\d\d)\]", fields.get("UAT/BAT", ""))
    if uc.startswith("REFUNDS/"):
        if sorted(tcs) != sorted(tc_by_uc.get(uc, [])):
            problems.append(f"{uc} TCs {tcs} vs chunk16 {tc_by_uc.get(uc)}")
    else:
        if fields.get("UAT/BAT") != "Pending (BRD 16 not written)":
            problems.append(f"{uc} LOYALTY UAT/BAT should be Pending")
    blocks[uc]["screens_field"] = fields.get("Screens", "")

# ---- 14 17.3 routes
routes = []
fe = read(os.path.join(LLD, "14-frontend.md"))
sec = fe.split("## 17.3 Routing", 1)[1].split("## 17.4", 1)[0]
for line in sec.splitlines():
    if line.startswith("| `"):
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        route, screen, ucs = cells[0].strip("`"), cells[2], cells[3]
        routes.append((route, re.findall(r"\[((?:REFUNDS|LOYALTY)/(?:SCR|MK|LP)-\d\d)\]", screen),
                       re.findall(r"\[((?:REFUNDS|LOYALTY)/UC-\d\d)\]", ucs), screen, ucs))
for uc, b in blocks.items():
    exp_routes = [r[0] for r in routes if uc in r[2]]
    got_routes = re.findall(r"`(/[^`]*)`", b.get("screens_field", ""))
    if sorted(exp_routes) != sorted(got_routes):
        problems.append(f"{uc} screens field routes {got_routes} vs 17.3 {exp_routes}")
for r in routes:
    if not r[1] and "None - platform page" not in r[3]:
        problems.append(f"route {r[0]} has no screen and is not a platform page")

# route data matches rows
for r in routes:
    if not r[1]:
        continue
    path = r[0].lstrip("/")
    m = re.search(r"path: '" + re.escape(path) + r"'.*?data: \{ screen: '([^']+)', useCases: \[([^\]]*)\] \}", fe, re.S)
    if not m:
        problems.append(f"route {r[0]}: no route data"); continue
    scr = m.group(1); ucs = re.findall(r"'([^']+)'", m.group(2))
    if [scr] != r[1] or sorted(ucs) != sorted(r[2]):
        problems.append(f"route {r[0]} data {scr} {ucs} vs row {r[1]} {r[2]}")

# ---- 16 19.9 index rows in order
refs = read(os.path.join(LLD, "16-references.md"))
idx = refs.split("## 19.9", 1)[1]
order = re.findall(r"^\| \[((?:REFUNDS|LOYALTY)/UC-\d\d)\]", idx, re.M)
if order != list(s73):
    problems.append(f"index order {order} vs 7.3 {list(s73)}")
for line in idx.splitlines():
    m = re.match(r"^\| \[((?:REFUNDS|LOYALTY)/UC-\d\d)\]", line)
    if not m: continue
    uc = m.group(1)
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    title, status = cells[1], cells[8]
    if title != s73[uc]["title"] or status != s73[uc]["status"]:
        problems.append(f"index {uc} title/status mismatch")
    if s73[uc]["status"] == "Active":
        tcs = re.findall(r"\[((?:REFUNDS|LOYALTY)/TC-[A-Z]{3}-\d\d)\]", cells[6])
        if uc.startswith("REFUNDS/") and sorted(tcs) != sorted(tc_by_uc.get(uc, [])):
            problems.append(f"index {uc} TCs differ")
        rts = re.findall(r"`(/[^`]*)`", cells[5])
        if sorted(rts) != sorted([r[0] for r in routes if uc in r[2]]):
            problems.append(f"index {uc} routes differ")
    else:
        if any(c != "-" for c in cells[3:8]):
            problems.append(f"index {uc} merged row has mapping values")

# ---- @UseCase tables vs 7.3
for fn in ("refund-service.md", "loyalty-service.md"):
    txt = read(os.path.join(LLD, "04-implementation", fn))
    for m in re.finditer(r"^\| `([A-Z]+ [^`]+)` \| `[^`]+` \| `((?:REFUNDS|LOYALTY)/UC-\d\d)` \|", txt, re.M):
        ep, uc = m.group(1), m.group(2)
        if f"`{ep}`" not in s73[uc]["entry"]:
            problems.append(f"@UseCase {uc} on {ep} not in 7.3 entry points")
all_eps = [(uc, e) for uc, r in s73.items() for e in re.findall(r"`([^`]+)`", r["entry"])]
alltxt = read(os.path.join(LLD, "04-implementation", "refund-service.md")) + read(os.path.join(LLD, "04-implementation", "loyalty-service.md"))
for uc, e in all_eps:
    if not re.search(r"^\| `" + re.escape(e) + r"` \| `[^`]+` \| `" + re.escape(uc) + r"` \|", alltxt, re.M):
        problems.append(f"no @UseCase row for {uc} {e}")

# ---- 13 16.8 specs vs chunk 16
t13 = read(os.path.join(LLD, "13-testing.md"))
spec_tcs = set(re.findall(r"\[(REFUNDS/TC-[A-Z]{3}-\d\d)\]", t13))
all_tcs = set(x for v in tc_by_uc.values() for x in v) | {"REFUNDS/TC-NFR-01", "REFUNDS/TC-NFR-02"}
missing = all_tcs - spec_tcs
if missing:
    problems.append(f"test cases with no spec and no Not automated reason: {sorted(missing)}")

print("problems:", len(problems))
for p in problems:
    print(" -", p)
