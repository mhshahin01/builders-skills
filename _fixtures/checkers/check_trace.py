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

BRDS = {"REFUNDS": BRD_R, "LOYALTY": os.path.join(ROOT, "brd-loyalty-points")}
SCREEN_REF = re.compile(r"\[(REFUNDS|LOYALTY)/([A-Z]{2,4}-\d\d)\]\(([^)\s]+)\)")


def mockup_rows(brd):
    t = read(os.path.join(brd, "14-todo.md"))
    if "### Mockup coverage" not in t:
        return {}
    sec = re.split(r"\n#{1,3} ", t.split("### Mockup coverage", 1)[1], maxsplit=1)[0]
    out = {}
    for line in sec.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if line.startswith("| ") and cells[0] != "Mockup" and len(cells) > 2:
            out[cells[0]] = set(re.findall(r"UC-\d\d", cells[2]))
    return out


def brd_text(brd):
    return "\n".join(read(os.path.join(brd, f)) for f in sorted(os.listdir(brd)) if f.endswith(".md") and not f.startswith("14-"))


mockups = {k: mockup_rows(d) for k, d in BRDS.items()}
texts = {k: brd_text(d) for k, d in BRDS.items()}
notes = []
for key, rows in mockups.items():
    odd = sorted(i for i in rows if not i.startswith("MK-"))
    if odd:
        notes.append(f"{key} BRD chunk 14 Mockup coverage rows without an MK-NN ID: {odd}")
for r in routes:
    for key, ident, target in SCREEN_REF.findall(r[3]):
        if ident.startswith("MK-"):
            if ident not in mockups[key]:
                problems.append(f"route {r[0]}: {key}/{ident} is not a row of BRD chunk 14 Mockup coverage")
            elif {u.split("/")[1] for u in r[2] if u.startswith(key + "/")} != mockups[key][ident]:
                problems.append(f"route {r[0]}: use cases {r[2]} vs {key}/{ident} row {sorted(mockups[key][ident])}")
            if not target.endswith("14-todo.md#mockup-coverage"):
                problems.append(f"route {r[0]}: {key}/{ident} links to {target}, not 14-todo.md#mockup-coverage")
        elif not re.search(r"(?<![\w-])" + re.escape(ident) + r"(?![\w-])", texts[key]):
            problems.append(f"route {r[0]}: screen ID {key}/{ident} is not in the {key} BRD text")
for uc, b in blocks.items():
    got = set()
    for part in re.split(r"(?=\[(?:REFUNDS|LOYALTY)/)", b.get("screens_field", "")):
        m = SCREEN_REF.match(part)
        if m:
            for route in re.findall(r"`(/[^`]*)`", part):
                got.add((f"{m.group(1)}/{m.group(2)}", route))
    exp = {(s, r[0]) for r in routes if uc in r[2] for s in r[1]}
    if got != exp:
        problems.append(f"{uc} screens field pairs {sorted(got)} vs 17.3 {sorted(exp)}")

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
        scr = {f"{k}/{i}" for k, i, _ in SCREEN_REF.findall(cells[4])}
        if scr != {s for r in routes if uc in r[2] for s in r[1]}:
            problems.append(f"index {uc} screens {sorted(scr)} differ from 17.3")
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
for uc, e in all_eps:
    owner_file = os.path.join(LLD, "04-implementation", s73[uc]["owner"] + ".md")
    owner_txt = read(owner_file) if os.path.isfile(owner_file) else ""
    row = re.search(r"^\| `" + re.escape(e) + r"` \| `[^`]+` \| `" + re.escape(uc) + r"` \|", owner_txt, re.M)
    if not row and not (f'@UseCase("{uc}")' in owner_txt and e in owner_txt):
        problems.append(f"no @UseCase for {uc} {e} in {s73[uc]['owner']}.md")

# ---- 13 16.8 specs vs chunk 16
t13 = read(os.path.join(LLD, "13-testing.md"))
spec_tcs = set(re.findall(r"\[(REFUNDS/TC-[A-Z]{3}-\d\d)\]", t13))
all_tcs = set(x for v in tc_by_uc.values() for x in v) | {"REFUNDS/TC-NFR-01", "REFUNDS/TC-NFR-02"}
missing = all_tcs - spec_tcs
if missing:
    problems.append(f"test cases with no spec and no Not automated reason: {sorted(missing)}")


def split_row(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


sdd_apis = []
for fn in sorted(os.listdir(SDD)):
    if not fn.startswith("13"):
        continue
    lines = read(os.path.join(SDD, fn)).splitlines()
    for i, line in enumerate(lines):
        if not line.startswith("| Method | Path |"):
            continue
        head = split_row(line)
        for row in lines[i + 2:]:
            if not row.startswith("|"):
                break
            c = dict(zip(head, split_row(row)))
            sdd_apis.append(((c.get("Method", "").strip("`"), c.get("Path", "").strip("`")),
                             c.get("Permission token (§16)", c.get("Auth Scope", "")).replace("`", ""),
                             re.findall(r"API-\d\d", c.get("API ID (§15)", ""))))
c11 = read(os.path.join(SDD, "11-api-contracts.md"))
sec152 = c11.split("\n## 15.2", 1)[1].split("\n## ", 1)[0] if "\n## 15.2" in c11 else ""
head152 = next((split_row(l) for l in sec152.splitlines() if l.startswith("| API ID |")), [])
contracts = {split_row(l)[0]: dict(zip(head152, split_row(l))) for l in sec152.splitlines() if re.match(r"^\| API-\d\d \|", l)}
api06 = read(os.path.join(LLD, "06-api-contracts.md"))
lines = api06.split("\n## 9.1", 1)[1].split("\n## 9.2", 1)[0].splitlines() if "\n## 9.1" in api06 else []
heading = ""
for i, line in enumerate(lines):
    if line.startswith("### "):
        heading = line
    if not (heading.startswith("### Service:") and line.startswith("| ") and "| Method |" in line and "| Path |" in line):
        continue
    head = split_row(line)
    for col in ("API ID (§15)", "Permission token (SDD §16)"):
        if col not in head:
            problems.append(f"06 §9.1 {heading[4:]}: no '{col}' column")
    for row in lines[i + 2:]:
        if not row.startswith("|"):
            break
        c = dict(zip(head, split_row(row)))
        key = (c.get("Method", "").strip("`"), c.get("Path", "").strip("`"))
        ids = set(re.findall(r"API-\d\d", row))
        outbound = [i for i in ids if contracts.get(i, {}).get("Type", "").startswith("External outbound")]
        if outbound:
            service = re.search(r"`([^`]+)`", heading)
            for i in outbound:
                if service and contracts[i].get("Consumer (caller)", "").replace("`", "") != service.group(1):
                    problems.append(f"06 §9.1 {heading[4:]}: {i} consumer is {contracts[i].get('Consumer (caller)')!r} in SDD §15.2")
            continue
        same = [e for e in sdd_apis if e[0] == key]
        if len(same) != 1:
            same = [e for e in sdd_apis if ids & set(e[2])] or same
        if not same:
            problems.append(f"06 §9.1 {' '.join(key)}: not in any SDD 13x List of APIs")
            continue
        _, token, apis = same[0]
        mine = c.get("Permission token (SDD §16)", c.get("Auth Scope", "")).replace("`", "")
        if mine != token:
            problems.append(f"06 §9.1 {' '.join(key)}: token {mine!r} vs SDD {token!r}")
        if "API ID (§15)" in head and re.findall(r"API-\d\d", c.get("API ID (§15)", "")) != apis:
            problems.append(f"06 §9.1 {' '.join(key)}: API ID {c.get('API ID (§15)')!r} vs SDD {apis}")
tokens = set(re.findall(r"^\| `([a-z]+\.[a-z]+\.[a-z\-]+)` \|", read(os.path.join(SDD, "12-centralized-user-roles.md")), re.M))
for fn in sorted(os.listdir(os.path.join(LLD, "04-implementation"))):
    lines = read(os.path.join(LLD, "04-implementation", fn)).splitlines()
    if not any(line.startswith("| Entry point | Kind |") for line in lines):
        problems.append(f"04 {fn}: no authorization table (| Entry point | Kind | Permission token ... |)")
    for i, line in enumerate(lines):
        if not line.startswith("| Entry point | Kind |"):
            continue
        head = split_row(line)
        col = next((h for h in head if h.startswith("Permission token")), None)
        if col is None:
            problems.append(f"04 {fn}: authorization table has no Permission token column")
            continue
        for row in lines[i + 2:]:
            if not row.startswith("|"):
                break
            for t in re.findall(r"`([a-z]+\.[a-z]+\.[a-z\-]+)`", dict(zip(head, split_row(row))).get(col, "")):
                if t not in tokens:
                    problems.append(f"04 {fn}: token {t} not in SDD §16.11")
if any(re.match(r"^\| API-\d\d \|", l) and split_row(l)[4:5] == ["Internal"] for l in c11.splitlines()):
    for fn in ("06-api-contracts.md", "11-security.md"):
        if "client-credentials" not in read(os.path.join(LLD, fn)):
            problems.append(f"{fn}: SDD §15.2 lists internal HTTP contracts but the LLD has no client-credentials rule")

print("problems:", len(problems))
for p in problems:
    print(" -", p)
print("notes:", len(notes))
for n in notes:
    print(" -", n)
