import os, re, sys

ROOT = sys.argv[1]
LLD = os.path.join(ROOT, "lld-refunds-platform")
SDD = os.path.join(ROOT, "sdd-refunds-platform")
BRD_R = os.path.join(ROOT, "brd-refunds-portal")
BRDS = {"REFUNDS": BRD_R, "LOYALTY": os.path.join(ROOT, "brd-loyalty-points")}
PENDING = "Pending (BRD 16 not written)"

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

# ---- BRD chunk 16 Related UC (a BRD without chunk 16 is Pending)
tc_by_uc = {}
tcs_by_key = {}
for key, brd in BRDS.items():
    p16 = os.path.join(brd, "16-uat-bat-test-cases.md")
    if not os.path.isfile(p16):
        continue
    tcs_by_key[key] = set()
    for line in read(p16).splitlines():
        m = re.match(r"\| (TC-[A-Z]{3}-\d\d) \|(.*)$", line)
        if m:
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            tc, related = cells[0], cells[5]
            tcs_by_key[key].add(f"{key}/{tc}")
            for uc in dict.fromkeys(re.findall(r"UC-\d\d", related)):
                tc_by_uc.setdefault(f"{key}/{uc}", []).append(f"{key}/{tc}")
print("BRDs with chunk 16:", sorted(tcs_by_key))

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
    key = uc.split("/")[0]
    if key in tcs_by_key:
        if sorted(tcs) != sorted(tc_by_uc.get(uc, [])):
            problems.append(f"{uc} TCs {tcs} vs chunk16 {tc_by_uc.get(uc)}")
    elif fields.get("UAT/BAT") != PENDING:
        problems.append(f"{uc} {key} UAT/BAT should be Pending")
    blocks[uc]["screens_field"] = fields.get("Screens", "")

# ---- Workflow blocks (### Workflow: [name]): behaviour the BRD or SDD asks for that no use case covers (L2-6)
workflows = []
for fn in sorted(os.listdir(os.path.join(LLD, "04-implementation"))):
    lines = read(os.path.join(LLD, "04-implementation", fn)).splitlines()
    for i, line in enumerate(lines):
        m = re.match(r"^### Workflow: (.+)$", line)
        if m:
            end = next((k for k in range(i + 1, len(lines)) if re.match(r"^#{1,3} ", lines[k])), len(lines))
            trace = next((l for l in lines[i + 1:i + 4] if l.startswith("> **Traceability:**")), None)
            workflows.append(dict(file=fn, name=m.group(1).strip(), trace=trace, body="\n".join(lines[i:end])))
for w in workflows:
    t = w["trace"] or ""
    if not t.startswith("> **Traceability:** No BRD use case - realises ") or "](" not in t:
        problems.append(f"04 {w['file']} Workflow '{w['name']}': traceability line is not 'No BRD use case - realises [link ...]': {(w['trace'] or 'none')[:100]}")
    ids = sorted(set(re.findall(r"(?:(?:REFUNDS|LOYALTY)/)?UC-\d\d", w["name"] + " " + t)))
    if ids:
        problems.append(f"04 {w['file']} Workflow '{w['name']}' carries use case ID(s): {', '.join(ids)}")
    ucs = sorted(set(re.findall(r"@UseCase\([\"']?((?:(?:REFUNDS|LOYALTY)/)?UC-\d\d)", w["body"])))
    if ucs:
        problems.append(f"04 {w['file']} Workflow '{w['name']}' carries @UseCase: {', '.join(ucs)}")

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
    if r[1] or "None - platform page" in r[3]:
        continue
    if r[3].startswith("None - no BRD screen ("):
        if "](" not in r[3]:
            problems.append(f"route {r[0]}: Workflow route screen cell has no link: {r[3][:80]}")
        continue
    problems.append(f"route {r[0]} has no screen and is not a platform page")

# route data matches rows
for r in routes:
    if not r[1]:
        continue
    path = r[0].lstrip("/")
    # Bound the match to this route, so a missing data field cannot borrow the next one.
    route = re.search(r"\{\s*path:\s*'" + re.escape(path) + r"'(?:(?!\{\s*path:|```)[\s\S])*", fe)
    m = re.search(r"data:\s*\{\s*screen:\s*'([^']+)'(?:,\s*useCases:\s*\[([^\]]*)\])?\s*\}", route.group(0)) if route else None
    if not m:
        problems.append(f"route {r[0]}: no route data"); continue
    scr = m.group(1); ucs = re.findall(r"'([^']+)'", m.group(2) or "")
    if [scr] != r[1] or sorted(ucs) != sorted(r[2]):
        problems.append(f"route {r[0]} data {scr} {ucs} vs row {r[1]} {r[2]}")

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
        if ident in mockups[key]:
            if not target.endswith("14-todo.md#mockup-coverage"):
                problems.append(f"route {r[0]}: {key}/{ident} links to {target}, not 14-todo.md#mockup-coverage")
            if not r[4].startswith("None - no BRD use case (") and {u.split("/")[1] for u in r[2] if u.startswith(key + "/")} != mockups[key][ident]:
                problems.append(f"route {r[0]}: use cases {r[2]} vs {key}/{ident} row {sorted(mockups[key][ident])}")
        elif ident.startswith("MK-"):
            problems.append(f"route {r[0]}: {key}/{ident} is not a row of BRD chunk 14 Mockup coverage")
        elif not re.search(r"(?<![\w-])" + re.escape(ident) + r"(?![\w-])", texts[key]):
            problems.append(f"route {r[0]}: screen ID {key}/{ident} is not in the {key} BRD text")

# Workflow route forms (14-frontend.md §17.3 column descriptions; L2-6, C6)
for r in routes:
    if r[3].startswith("None - no BRD screen ("):
        if not (r[4].startswith("None - no BRD screen (") and "](" in r[4]):
            problems.append(f"route {r[0]}: a Workflow route reads 'None - no BRD screen ([link])' in both BRD columns, not {r[4][:80]!r}")
        if re.search(r"path: '" + re.escape(r[0].lstrip("/")) + r"'[^}]*data:", fe):
            problems.append(f"route {r[0]}: a Workflow route carries no route data")
    if r[4].startswith("None - no BRD use case ("):
        refs = SCREEN_REF.findall(r[3])
        if not refs:
            problems.append(f"route {r[0]}: 'None - no BRD use case' but the Screen cell names no screen reference")
        elif refs[0][1] not in mockups[refs[0][0]]:
            problems.append(f"route {r[0]}: 'None - no BRD use case' needs a screen with a chunk 14 row; {refs[0][0]}/{refs[0][1]} is not a row")
        if "](" not in r[4]:
            problems.append(f"route {r[0]}: Workflow route Use cases cell has no link: {r[4][:80]}")
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
        key = uc.split("/")[0]
        if key in tcs_by_key and sorted(tcs) != sorted(tc_by_uc.get(uc, [])):
            problems.append(f"index {uc} TCs differ")
        elif key not in tcs_by_key and cells[6] != PENDING:
            problems.append(f"index {uc} {key} UAT/BAT should be Pending")
        rts = re.findall(r"`(/[^`]*)`", cells[5])
        if sorted(rts) != sorted([r[0] for r in routes if uc in r[2]]):
            problems.append(f"index {uc} routes differ")
        scr = {f"{k}/{i}" for k, i, _ in SCREEN_REF.findall(cells[4])}
        if scr != {s for r in routes if uc in r[2] for s in r[1]}:
            problems.append(f"index {uc} screens {sorted(scr)} differ from 17.3")
    else:
        if any(c != "-" for c in cells[3:8]):
            problems.append(f"index {uc} merged row has mapping values")

# ---- @UseCase per 7.3 entry point, read from 04 7.2
UC_ID = re.compile(r"(?:REFUNDS|LOYALTY)/UC-\d\d")
REST = re.compile(r"^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) /")


def norm(ep):
    return re.sub(r"\s+", " ", ep).strip()


active_eps = {uc: [norm(e) for e in re.findall(r"`([^`]+)`", r["entry"])] for uc, r in s73.items() if r["status"] == "Active"}


def anchors_7_2(txt):
    m = re.search(r"^## 7\.2\b.*$", txt, re.M)
    sec = txt[m.end():] if m else ""
    n = re.search(r"^## ", sec, re.M)
    lines = (sec[:n.start()] if n else sec).splitlines()
    traced, rows = {}, []
    for i, line in enumerate(lines):
        if not line.startswith("|") or (i and lines[i - 1].startswith("|")) or i + 1 >= len(lines) or not re.match(r"^\|\s*:?-{3}", lines[i + 1]):
            continue
        head = [c.strip() for c in line.strip().strip("|").split("|")]
        ep_col = next((h for h in head if h.startswith("Entry point")), None)
        uc_col = next((h for h in head if "@UseCase" in h), None)
        for row in lines[i + 2:]:
            if not row.startswith("|"):
                break
            c = dict(zip(head, [x.strip() for x in row.strip().strip("|").split("|")]))
            if ep_col and uc_col:
                for ep in re.findall(r"`([^`]+)`", c.get(ep_col, "")):
                    traced.setdefault(norm(ep), []).extend(UC_ID.findall(c.get(uc_col, "")))
            elif head[:2] == ["Class", "Endpoints"]:
                notes, cell = c.get("Notes", ""), c.get("Endpoints", "")
                eps = [norm(p) for t in re.findall(r"`([^`]+)`", cell) for p in re.split(r",\s*(?=[A-Z]+ /)", t)]
                listed = re.search(r"`@UseCase` values?:?\s*(.+?)\s+in that order", notes)
                values = re.findall(r"`([^`]+)`", listed.group(1)) if listed else re.findall(r'@UseCase\("([^"]*)"\)', notes)
                rows.append(dict(cls=c.get("Class", ""), text=" ".join((c.get("Class", ""), cell, notes)),
                                 rest=[e for e in eps if REST.match(e)], values=values, ordered=bool(listed)))
    return traced, rows


anchors = {fn: anchors_7_2(read(os.path.join(LLD, "04-implementation", fn))) for fn in sorted(os.listdir(os.path.join(LLD, "04-implementation")))}
how = {"one by one": 0, "by Controllers row only": 0, "not found": 0}
checked = set()
for uc, eps in active_eps.items():
    fn = s73[uc]["owner"] + ".md"
    if fn not in anchors:
        problems += [f"no @UseCase for {uc} {e}: no 04 file {fn}" for e in eps]
        continue
    traced, rows = anchors[fn]
    for e in eps:
        if e in traced:
            got, where = traced[e], "its traced entry point row"
        else:
            if REST.match(e):
                hit = [r for r in rows if e in r["rest"]]
            else:
                name = e.split(":", 1)[-1].strip()
                hit = [r for r in rows if re.search(r"(?<![\w-])" + re.escape(name) + r"(?![\w-])", r["text"])]
            one = [r for r in hit if REST.match(e) and (len(r["rest"]) == 1 or (r["ordered"] and len(r["values"]) == len(r["rest"])))]
            if not hit:
                how["not found"] += 1
                problems.append(f"no @UseCase for {uc} {e} in {fn}: no §7.2 row lists this entry point")
                continue
            if not one:
                how["by Controllers row only"] += 1
                carried = sorted({t for r in hit for v in r["values"] for t in UC_ID.findall(v)})
                if uc not in carried:
                    problems.append(f"no @UseCase for {uc} {e} in {fn}: its §7.2 row ({', '.join(r['cls'] for r in hit)}) carries {carried or 'none'}")
                continue
            r = one[0]
            got = UC_ID.findall(r["values"][r["rest"].index(e)] if r["ordered"] and len(r["values"]) == len(r["rest"]) else ",".join(r["values"]))
            where = f"§7.2 {r['cls']}"
        how["one by one"] += 1
        want = [u for u, x in active_eps.items() if e in x]
        if uc not in got:
            problems.append(f"no @UseCase for {uc} {e} in {fn}: {where} carries {got or 'none'}")
        elif got != want and (fn, e) not in checked:
            problems.append(f"@UseCase on {e} in {fn} is {','.join(got)}; §7.3 lists it under {','.join(want)}")
        checked.add((fn, e))
for fn, (traced, rows) in anchors.items():
    for e, got in traced.items():
        for t in got:
            if (fn, e) not in checked and e not in active_eps.get(t, []):
                problems.append(f"@UseCase {t} on {e} in {fn}: §7.3 does not list it under {t}")
    for r in rows:
        for t in sorted({t for v in r["values"] for t in UC_ID.findall(v)}):
            if t not in active_eps:
                problems.append(f"@UseCase {t} in {fn} §7.2 {r['cls']}: not an Active §7.3 use case")
            elif r["rest"] and not set(r["rest"]) & set(active_eps[t]):
                problems.append(f"@UseCase {t} in {fn} §7.2 {r['cls']}: §7.3 lists none of its endpoints under {t}")
print("@UseCase anchors in 04 §7.2, per §7.3 use case and entry point:", ", ".join(f"{n} {k}" for k, n in how.items()))

# ---- 13 16.8 specs vs chunk 16
t13 = read(os.path.join(LLD, "13-testing.md"))
spec_tcs = set(re.findall(r"\[((?:REFUNDS|LOYALTY)/TC-[A-Z]{3}-\d\d)\]", t13))
all_tcs = set().union(*tcs_by_key.values())
missing = all_tcs - spec_tcs
if missing:
    problems.append(f"test cases with no spec and no Not automated reason: {sorted(missing)}")
unknown = spec_tcs - all_tcs
if unknown:
    problems.append(f"13 cites test cases that are not in a BRD chunk 16: {sorted(unknown)}")


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
tokens = set(re.findall(r"^\| `([a-z][a-z-]*\.[a-z][a-z-]*\.[a-z][a-z-]*)` \|", read(os.path.join(SDD, "12-centralized-user-roles.md")), re.M))
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
            for t in re.findall(r"`([a-z][a-z-]*\.[a-z][a-z-]*\.[a-z][a-z-]*)`", dict(zip(head, split_row(row))).get(col, "")):
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
