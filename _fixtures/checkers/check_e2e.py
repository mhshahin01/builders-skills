import glob, os, re, sys

SDD = sys.argv[1]

def read(fn):
    with open(os.path.join(SDD, fn), encoding="utf-8") as f:
        return f.read()

def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]

def plain(s):
    s = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
    return s.replace("`", "").replace("**", "").strip()

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
                out.append(dict(zip(head, cells(r))))
            return out
    return []

def tables(txt):
    lines = txt.split("\n")
    for i, line in enumerate(lines):
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"^\|\s*:?-{3}", lines[i + 1]) and (i == 0 or not lines[i - 1].startswith("|")):
            head = cells(line)
            rows = []
            for r in lines[i + 2:]:
                if not r.startswith("|"):
                    break
                rows.append(dict(zip(head, cells(r))))
            yield head, rows

def first_int(s):
    m = re.search(r"\d+", s or "")
    return int(m.group(0)) if m else None

problems, notes = [], []
MARKER = "[NEEDS CLARIFICATION"

# ---- sources: 09, 10, 11, 03
c09, c10, c11, c03 = (read(f) for f in ("09-services-summary.md", "10-events-hub.md", "11-api-contracts.md", "03-users-and-use-cases.md"))
s13 = [dict(name=plain(r["Service"]), type=plain(r.get("Type", "")), status=plain(r.get("Status", ""))) for r in table(c09, "| Service | Type")]
services = [s["name"] for s in s13]
s144 = [dict(topic=plain(r["Topic"]), owner=plain(r.get("Owner (sole publisher)", ""))) for r in table(sect(c10, "## 14.4"), "| # | Topic")]
topics = [t["topic"] for t in s144]

events = []
sec145 = sect(c10, "## 14.5")
for m in re.finditer(r"^### 14\.5\.\d+ (.+?) - `([^`]+)`.*$", sec145, re.M):
    producer, topic = plain(m.group(1)), m.group(2)
    body = sect(sec145[m.start():], "### 14.5.")
    for r in table(body, "| Event | Consumers"):
        ev = plain(r["Event"])
        cons = [plain(c) for c in re.split(r",\s*", r.get("Consumers", "")) if plain(c) and plain(c) not in ("-", "None", "none")]
        events.append(dict(event=ev, producer=producer, topic=topic, consumers=cons))
cov = [plain(r["Event"]) for r in table(sect(c10, "### 14.9.99"), "| Event |")]
inproc = []
for r in table(sect(c10, "## 14.10"), "| Event | Publisher module"):
    ev = plain(r["Event"])
    if not re.search(r"[A-Za-z]", ev) or ev.lower().startswith(("none", "not applicable")):
        continue
    lis = [plain(c) for c in re.split(r",\s*", r.get("Listener modules", "")) if plain(c)]
    inproc.append(dict(event=ev, publisher=plain(r.get("Publisher module", "")), listeners=lis))
contracts = []
for r in table(sect(c11, "## 15.2"), "| API ID |"):
    if re.match(r"API-\d\d", r.get("API ID", "")):
        contracts.append(dict(id=r["API ID"], caller=plain(r.get("Consumer (caller)", "")), callee=plain(r.get("Provider (callee)", "")), type=plain(r.get("Type", ""))))
internal = [c for c in contracts if c["type"].startswith("Internal")]
external = [c for c in contracts if c["type"].startswith("External")]
s73 = set(re.findall(r"^\| \[((?:[A-Z]+)/UC-\d\d)\]", sect(c03, "## 7.3"), re.M))

print(f"sources: {len(services)} services, {len(topics)} topics, {len(events)} catalog events, {len(cov)} coverage rows, "
      f"{len(inproc)} in-process events, {len(internal)} internal and {len(external)} external contracts, {len(s73)} §7.3 rows")

# ---- e2e gate E1-E4 (SKILL.md step 8b)
c18 = read("18-open-items-and-clarifications.md")
ok = ("Accepted - applied", "Adjusted - applied", "Rejected")
e1 = [s for s in re.findall(r"^- \*\*Status:\*\* (.+)$", c18, re.M) if not s.strip().startswith(ok)]
e2 = []
for fn, head in (("10-events-hub.md", "## 14.8"), ("11-api-contracts.md", "## 15.5"), ("12-centralized-user-roles.md", "## 16.12")):
    for hd, rows in tables(sect(read(fn), head)):
        if "Status" in hd:
            e2 += [f"{head[3:]} {r.get(hd[0], '')}: {r['Status']}" for r in rows
                       if not r.get("Status", "").startswith("Fixed in v") and not all(plain(v) in ("-", "None", "") for v in r.values())]
e3 = {}
for fn in sorted(glob.glob(os.path.join(SDD, "*.md"))):
    b = os.path.basename(fn)
    if re.match(r"^(09|10|11|12|13[a-z])-", b):
        n = read(b).count(MARKER)
        if n:
            e3[b] = n
n73 = sect(c03, "## 7.3").count(MARKER)
if n73:
    e3["03 §7.3"] = n73
master = read(next(f for f in os.listdir(SDD) if f.endswith("-sdd-master.md")))
rec = re.search(r"\*\*Reconciled:\*\*\s*(\S+)", master)
c00 = read("00-cover-and-changelog.md")
log_dates = re.findall(r"^\|\s*\d+\.\d+\s*\|\s*(\d{4}-\d\d-\d\d)\s*\|", c00, re.M)
e4 = rec and log_dates and rec.group(1) >= max(log_dates)
gate = re.search(r"\*\*E2E gate \(chunk 19\):\*\*\s*(.+)$", master, re.M)
print(f"E1 open items not closed: {len(e1)} {e1[:5]}")
print(f"E2 open divergence rows: {len(e2)} {e2[:5]}")
print(f"E3 markers: {sum(e3.values())} {e3}")
print(f"E4 reconciled {rec.group(1) if rec else None} vs last Changes Log date {max(log_dates) if log_dates else None}: {'met' if e4 else 'NOT met'}")
print(f"master gate line: {gate.group(1).strip() if gate else None}")

f19 = sorted(glob.glob(os.path.join(SDD, "19-*.md")))
if not f19:
    print("chunk 19: not written")
    if gate and gate.group(1).startswith("Open"):
        problems.append("gate line says Open but chunk 19 does not exist")
else:
    c19 = read(os.path.basename(f19[0]))
    if e1 or e2 or e3 or not e4:
        problems.append("chunk 19 exists but the gate conditions are not all met")
    if not gate or not gate.group(1).strip().startswith("Open - Up to date"):
        problems.append(f"master gate line is {gate.group(1).strip() if gate else None!r}, not 'Open - Up to date'")
    if not re.search(r"\]\((?:\./)?" + re.escape(os.path.basename(f19[0])) + r"\)", master):
        problems.append("master does not link chunk 19")

    # §24.7 rows
    r247 = []
    for r in table(sect(c19, "## 24.7"), "| # |"):
        edge = next((v for k, v in r.items() if "Caller" in k), "")
        api = re.findall(r"API-\d\d", next((v for k, v in r.items() if k.startswith("API ID")), ""))
        if not api and plain(edge).lower() in ("", "-", "none"):
            continue
        r247.append(dict(edge=plain(edge), api=api, inproc="in-process" in edge.lower()))
    sagas = re.findall(r"^### 24\.8\.\d+ .*$", c19, re.M)

    # Counts at a Glance
    counts = {plain(r["Dimension"]): first_int(r.get("Count")) for r in table(c19, "| Dimension | Count")}
    expect = {
        "Services": [len(s13), len([s for s in s13 if s["status"].startswith("Active")])],
        "Topics": [len(topics)],
        "Distinct published events": [len(cov)],
        "Synchronous HTTP edges": [len([r for r in r247 if not r["inproc"]])],
        "In-process port calls": [len([r for r in r247 if r["inproc"]])],
        "Sagas documented": [len(sagas)],
    }
    for dim, exp in expect.items():
        got = next((v for k, v in counts.items() if k.startswith(dim)), "missing")
        if got not in exp:
            problems.append(f"Counts at a Glance {dim}: {got} vs {exp[0]}")
    if len([r for r in r247 if not r["inproc"]]) != len([c for c in internal if "in-process" not in c["type"]]):
        problems.append(f"§24.7 HTTP rows {len([r for r in r247 if not r['inproc']])} vs §15.2 internal HTTP contracts {len([c for c in internal if 'in-process' not in c['type']])}")
    if len([r for r in r247 if r["inproc"]]) != len([c for c in internal if "in-process" in c["type"]]):
        problems.append(f"§24.7 in-process rows vs §15.2 Internal (in-process) contracts differ")

    # §24.1 landscape
    r241 = table(sect(c19, "## 24.1"), "| # | Service")
    names = [plain(r["Service"]) for r in r241]
    if sorted(names) != sorted(services):
        problems.append(f"§24.1 services {names} vs §13 {services}")
    for r in r241:
        n = plain(r["Service"])
        s = next((x for x in s13 if x["name"] == n), None)
        row = " ".join(r.values())
        if s and "module" in s["type"] and "module" not in row:
            problems.append(f"§24.1 {n}: §13 Type is {s['type']!r} but the row never says module")
        pub = set(re.findall(r"`([^`]+)`", r.get("Publishes to", "")))
        con = set(re.findall(r"`([^`]+)`", r.get("Consumes from", "")))
        exp_pub = {t["topic"] for t in s144 if t["owner"].split(" (")[0] == n}
        exp_con = {e["topic"] for e in events if n in e["consumers"]}
        if pub & set(topics) != exp_pub:
            problems.append(f"§24.1 {n} publishes to {sorted(pub & set(topics))} vs §14.4 {sorted(exp_pub)}")
        if con & set(topics) != exp_con:
            problems.append(f"§24.1 {n} consumes from {sorted(con & set(topics))} vs §14.5 {sorted(exp_con)}")

    # §24.5 event map (Mermaid edges with resolved node labels)
    SHAPES = [(r"\[\[", r"\]\]"), (r"\[\(", r"\)\]"), (r"\(\[", r"\]\)"), (r"\(\(", r"\)\)"), (r"\{\{", r"\}\}"),
              (r"\[/", r"/\]"), (r"\[", r"\]"), (r"\(", r"\)"), (r"\{", r"\}")]
    NODE = re.compile(r"\b([A-Za-z_]\w*)\s*(?:" + "|".join(f"{o}(?P<c{i}>.*?){c}" for i, (o, c) in enumerate(SHAPES)) + ")")
    ARROW = re.compile(r"--\s*(?P<l2>[^\s|>-][^|]*?)\s*-->|-\.\s*(?P<l3>[^.\s>-][^.]*?)\s*\.->|==\s*(?P<l4>[^=\s>][^=]*?)\s*==>"
                       r"|(?:-->|-\.->|==>|---|-\.-|===)\s*(?:\|(?P<l1>[^|]*)\|)?")

    def graph(txt):
        label, edges = {}, []
        for block in re.findall(r"```mermaid\n(.*?)```", txt, re.S):
            for line in block.split("\n"):
                line = line.strip()
                if not line or line == "end" or line.startswith(("%%", "classDef", "class ", "style ", "linkStyle", "flowchart", "graph ", "direction")):
                    continue
                saved = []
                line = re.sub(r"\|([^|]*)\|", lambda m: saved.append(m.group(1)) or f"|@{len(saved) - 1}|", line)
                for m in NODE.finditer(line):
                    content = next(v for k, v in m.groupdict().items() if v is not None)
                    label.setdefault(m.group(1), content.strip().strip('"'))
                line = NODE.sub(lambda m: m.group(1), line)
                line = re.sub(r":::\w+", "", line)
                if line.startswith("subgraph"):
                    continue
                arrows = list(ARROW.finditer(line))
                segs, labs, pos = [], [], 0
                for m in arrows:
                    segs.append(line[pos:m.start()])
                    lab = next((g for g in (m.group("l1"), m.group("l2"), m.group("l3"), m.group("l4")) if g), "")
                    lab = re.sub(r"@(\d+)", lambda x: saved[int(x.group(1))], lab)
                    labs.append(lab.strip())
                    pos = m.end()
                segs.append(line[pos:])
                for i, lab in enumerate(labs):
                    for a in segs[i].split("&"):
                        for b in segs[i + 1].split("&"):
                            if a.strip() and b.strip():
                                edges.append((a.split()[-1], lab, b.split()[0]))
        return label, edges
    sec245 = sect(c19, "## 24.5")
    label, edges = graph(sec245)
    universal = sect(c19, "### 24.5.3")
    def nodes(name):
        n = name.lower()
        return {k for k, v in label.items() if n in plain(v).lower()} | ({name} if name in label else set())
    faith = sect(c19, "### Faithfulness")
    for e in events:
        pn, tn = nodes(e["producer"]), nodes(e["topic"])
        if not tn:
            problems.append(f"§24.5 has no node for topic {e['topic']}")
            continue
        if not any(a in pn and b in tn for a, _, b in edges):
            problems.append(f"§24.5 no edge {e['producer']} -> {e['topic']}")
        for c in e["consumers"]:
            if c in universal:
                continue
            cn = nodes(c)
            hit = [l for a, l, b in edges if a in tn and b in cn]
            if not any(e["event"] in l for l in hit):
                where = "in the Faithfulness list" if e["event"] in faith or c in faith else "not explained"
                problems.append(f"§24.5 {e['event']}: no edge {e['topic']} -> {c} labelled with it ({len(hit)} unlabelled or other edges; {where})")
    for e in inproc:
        pn = nodes(e["publisher"])
        for l in e["listeners"]:
            ln = nodes(l)
            if not any(a in pn and b in ln and "in-process" in lab and e["event"] in lab for a, lab, b in edges):
                problems.append(f"§24.5 {e['event']}: no edge {e['publisher']} -> {l} labelled 'in-process: {e['event']}'")
    for t in topics:
        if not nodes(t):
            problems.append(f"§24.5 topic {t} not drawn")

    # §24.7 against §15.2 internal contracts
    ids247 = {a for r in r247 for a in r["api"]}
    for c in internal:
        row = next((r for r in r247 if c["id"] in r["api"]), None)
        if not row:
            problems.append(f"§24.7 has no row for {c['id']} ({c['caller']} -> {c['callee']}, {c['type']})")
            continue
        if c["caller"].split(" (")[0] not in row["edge"] or c["callee"].split(" (")[0] not in row["edge"]:
            problems.append(f"§24.7 {c['id']} edge {row['edge']!r} vs §15.2 {c['caller']} -> {c['callee']}")
        if ("in-process" in c["type"]) != row["inproc"]:
            problems.append(f"§24.7 {c['id']} in-process label does not match §15.2 Type {c['type']!r}")
    for a in ids247 - {c["id"] for c in internal}:
        problems.append(f"§24.7 cites {a}, which is not an internal contract in §15.2")

    # §24.2 external systems
    s242 = sect(c19, "## 24.2")
    for c in external:
        ext = c["callee"] if c["type"].startswith("External outbound") else c["caller"]
        alts = [ext, ext.split(" (")[0]] + re.findall(r"\(([^)]+)\)", ext)
        if not any(a and a in s242 for a in alts):
            problems.append(f"§24.2 does not show external system {ext} ({c['id']})")

    # §24.8 sagas
    for h in sagas:
        body = sect(c19[c19.index(h):], "### 24.8.")
        ucl = re.search(r"^\*\*Use cases:\*\*(.*)$", body, re.M)
        if not ucl:
            problems.append(f"{h[4:]}: no Use cases line")
            continue
        ucs = re.findall(r"\[([A-Z]+/UC-\d\d)\]\(", ucl.group(1))
        if not ucs:
            problems.append(f"{h[4:]}: Use cases line has no keyed UC link")
        for u in ucs:
            if u not in s73:
                problems.append(f"{h[4:]}: {u} is not a §7.3 row")
        if "```mermaid" not in body:
            problems.append(f"{h[4:]}: no sequence diagram")

    # one fact, one home
    for hd, _ in tables(c19):
        h = "| " + " | ".join(hd) + " |"
        if h.startswith(("| # | Topic | Owner", "| Field | Type | Meaning", "| Event | Consumers", "| API ID | Operation")):
            problems.append(f"chunk 19 restates a registry table: {h[:60]}")
    if "10-events-hub.md" not in sect(c19, "## 24.4"):
        problems.append("§24.4 does not point to §14.2.1 in 10-events-hub.md")
    if re.search(r"^\|", sect(c19, "## 24.9"), re.M):
        problems.append("§24.9 holds a table (pointer section only)")
    if MARKER in c19:
        problems.append("chunk 19 holds a clarification marker")
    if "\u2014" in c19:
        problems.append("chunk 19 holds an em dash")
    notes.append(f"Faithfulness list: {[l.strip() for l in faith.splitlines() if l.strip().startswith('-')]}")

print("problems:", len(problems))
for p in problems:
    print(" -", p)
print("notes:", len(notes))
for n in notes:
    print(" -", n)
