import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CLI = os.path.normpath(os.path.join(HERE, "..", "..", "pre-sdd-unifier", "studio", "cli.mjs"))

CHUNKS = [
    ("00", "00-cover-and-changelog.md", []),
    ("01", "01-business-brief.md", ["01-header.md"]),
    ("02", "02-classification-and-path.md", ["02-classification.md"]),
    ("03a", "03a-register-business.md", ["03a-register-business.md"]),
    ("03b", "03b-register-capacity.md", ["03b-register-capacity.md"]),
    ("03c", "03c-register-reliability.md", ["03c-register-reliability.md"]),
    ("03d", "03d-register-data.md", ["03d-register-data.md"]),
    ("03e", "03e-register-security.md", ["03e-register-security.md"]),
    ("03f", "03f-register-integration.md", ["03f-register-integration.md"]),
    ("03g", "03g-register-operations.md", ["03g-register-operations.md"]),
    ("03h", "03h-register-economics.md", ["03h-register-economics.md"]),
    ("04", "04-targets-and-calculations.md", ["04-calculations.md"]),
    ("05", "05-target-shape.md", ["05-target-shape.md"]),
    ("06", "06-existing-estate.md", []),
    ("07", "07-options-and-economics.md", ["07-options.md"]),
    ("08", "08-migration-overlay.md", ["08-overlay.md"]),
    ("09", "09-decisions.md", ["09-rule-trace.md"]),
    ("10", "10-validation-risks-unknowns.md", ["10-validation.md"]),
    ("11", "11-gate-and-sign-off.md", ["11-gate.md"]),
    ("12", "12-sdd-handoff-guide.md", ["12-locked-items.md"]),
    ("13", "13-open-items-and-clarifications.md", []),
]
QUICK = ("00", "01", "02", "03a", "03b", "03c", "03d", "03e", "03f", "03g", "03h", "10")
CHUNK_FILE = re.compile(r"\d{2}[a-h]?-.+\.md")
GROUPS = [("03a", "BUS", 8), ("03b", "CAP", 12), ("03c", "REL", 10), ("03d", "DAT", 9),
          ("03e", "SEC", 8), ("03f", "INT", 9), ("03g", "OPS", 8), ("03h", "ECO", 6)]
HOME = {f"HDR-{n:02d}": "01" for n in range(1, 11)}
for _cid, _prefix, _count in GROUPS:
    HOME.update({f"{_prefix}-{n:02d}": _cid for n in range(1, _count + 1)})
HOME.update({f"OVL-{n:02d}": "08" for n in range(1, 13)})
REGISTER_CHUNKS = ("01", "03a", "03b", "03c", "03d", "03e", "03f", "03g", "03h", "08")
ROW_ID = re.compile(r"(?:HDR|BUS|CAP|REL|DAT|SEC|INT|OPS|ECO|OVL)-\d{2}")
ROW_HEADING = re.compile(r"^###\s+(" + ROW_ID.pattern + r")\s*$")
ANY_ROW_HEADING = re.compile(r"^###\s+([A-Z]{3}-\d{2})\s*$")
ENTRY_HEAD = ["Entry", "Label", "Value", "Unit", "Window", "Priority", "Kind", "Status", "Source", "Owner", "Due"]
FACTOR_HEAD = ["Entry", "Factor", "Value", "Unit", "Status", "Source"]
ENTRY_ID = re.compile(r"(" + ROW_ID.pattern + r")\.\d+")
UTC = r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z"
DATE = r"\d{4}-\d{2}-\d{2}"
CONFIRMED = re.compile(r"Confirmed \((.+), (" + UTC + r")\)")
STATUSES = ("Open", "Estimated", "N/A")
SOURCES = [
    re.compile(r"BRD: [A-Z0-9]+(?:-[A-Z0-9]+)*(?:/\S.*| \d{2}.*)"),
    re.compile(r"Derived: CALC-\d{2} from \S.*"),
    re.compile(r"Default: (?:policy appendix v\d+|project rule \S.*)"),
    re.compile(r"Import: Studio v2\.2"),
    re.compile(r"Answer: \S.*, " + DATE + r"(?: \((?:left open|proposal accepted)\))?"),
    re.compile(r"Policy: \S.* \(set by \S.*, " + DATE + r"\)"),
    re.compile(r"Fixture: \S.* \(test-run policy\)"),
]
CODES = r"(?:B|E|D|Sec|Ops|Fin|Legal)(?:\+(?:B|E|D|Sec|Ops|Fin|Legal))*"
OWNER_WITH_CODES = re.compile(r"(" + CODES + r")(?: \((.+)\))?")
ROLES = [("Business sponsor", False), ("Product owner / business process owner", False),
         ("Lead / principal architect", False), ("Infrastructure / platform owner", False),
         ("Network owner", False), ("Security and privacy/compliance", False), ("Data owner", False),
         ("SRE / operations", False), ("Finance / procurement", False), ("Migration owner (if relevant)", True),
         ("Architecture review authority", False)]
SIGNOFF_HEAD = ["Role", "Name", "Decision", "At", "Comments"]
DECISIONS = ("Approved", "Approved with conditions", "Rejected")
TWELVE = ["12.1 Pre-SDD, Gate and Signers", "12.2 Locked Items", "12.3 Where Each Item Lands in the SDD",
          "12.4 Left to the SDD", "12.5 Conditions, Exceptions and Unknowns", "12.6 When the SDD Disagrees",
          "12.7 Citing This Pre-SDD"]
G1_LABELS = ("G1", "G2", "G3 Approved", "G3 Approved with conditions")
SIGNED_LABELS = ("G3 Approved", "G3 Approved with conditions")
FRAGMENT_OPEN = re.compile(r"^<!--\s*ENGINE-FRAGMENT:\s*(\S+)\s*-->\s*$")
FRAGMENT_CLOSE = re.compile(r"^<!--\s*/ENGINE-FRAGMENT\s*-->\s*$")
GENERATION_DATE = re.compile(r"\s*,?\s*\(?\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?\)?\s*$")
DASHES = re.compile("[\u2013\u2014]")
CITE = re.compile(r"PSDD/([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d+(?:\.\d+)?(?:@[A-Z][A-Z0-9]*-\d+)?)(?![A-Za-z0-9])")
CALC_CITE = re.compile(r"PSDD/(CALC-\d+(?:@[A-Z][A-Z0-9]*-\d+)?)(?![A-Za-z0-9@])")
ID_TOKEN = re.compile(r"[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d+(?:\.\d+)?(?:@[A-Z][A-Z0-9]*-\d+)?")
NUMBER = re.compile(r"(?<![\w.])-?\d[\d,]*(?:\.\d+)?")
LINK_TARGET = re.compile(r"\]\([^)]*\)")
SECTION_SIGN = re.compile(r"§\s?\d+(?:\.\d+)*")
SDD_COVER = "00-cover-and-changelog.md"
SOURCE_PSDD_HEAD = ["Key", "Pre-SDD", "Version", "Gate", "Link"]


def read_text(path):
    with open(path, "rb") as f:
        return f.read().decode("utf-8", errors="replace").replace("\r\n", "\n")


def split_cells(line):
    body = line.strip()
    if body.startswith("|"):
        body = body[1:]
    if body.endswith("|") and not body.endswith("\\|"):
        body = body[:-1]
    return [c.strip() for c in re.split(r"(?<!\\)\|", body)]


def tables(lines):
    out = []
    i = 0
    while i < len(lines):
        if lines[i].strip().startswith("|") and i + 1 < len(lines) and re.fullmatch(r"\|?\s*:?-{3,}.*", lines[i + 1].strip()):
            head = split_cells(lines[i])
            rows = []
            j = i + 2
            while j < len(lines) and lines[j].strip().startswith("|"):
                rows.append((j + 1, split_cells(lines[j])))
                j += 1
            out.append((i + 1, head, rows))
            i = j
        else:
            i += 1
    return out


def first_number(text):
    m = NUMBER.search(text or "")
    return float(m.group(0).replace(",", "")) if m else None


def same_number(a, b):
    return abs(a - b) <= 1e-9 * max(1.0, abs(a), abs(b))


class Report:
    def __init__(self):
        self.problems = []

    def add(self, where, message):
        self.problems.append(f"{where}: {message}")


def load_state(psdd, report):
    path = os.path.join(psdd, "studio", "project-state.json")
    if not os.path.isfile(path):
        report.add("studio/project-state.json", "not found")
        return None, path
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f), path
    except (OSError, ValueError) as error:
        report.add("studio/project-state.json", f"cannot be read as JSON ({error})")
        return None, path


def stamp_of(text):
    m = re.search(r"(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?", text or "")
    if not m:
        return None
    return m.group(1) + (m.group(2) or "T00:00:00Z")


def history_now(state):
    stamps = []
    for record in state.get("history") or []:
        at = record.get("at") if isinstance(record, dict) else None
        if isinstance(at, str) and re.fullmatch(UTC, at):
            stamps.append(at)
    return max(stamps, key=lambda s: (s[:19], s)) if stamps else None


def generation_now(psdd, master):
    path = os.path.join(psdd, master)
    if not os.path.isfile(path):
        return None
    for line in read_text(path).splitlines():
        if line.startswith("**Generation:**"):
            return stamp_of(line.split("**Generation:**", 1)[1])
    return None


def run_compute(cli, state_path, now, report):
    if not os.path.isfile(cli):
        report.add("cli.mjs", f"not found at {cli}; pass --cli <path to cli.mjs>")
        return None
    with tempfile.TemporaryDirectory(prefix="check-presdd-compute-") as out:
        try:
            p = subprocess.run(["node", cli, "compute", state_path, "--out", out] + (["--now", now] if now else []),
                               capture_output=True, text=True, encoding="utf-8", errors="replace")
        except OSError as error:
            report.add("cli.mjs", f"node could not run ({error})")
            return None
        if p.returncode != 0:
            first = (p.stderr or p.stdout).strip().splitlines()
            report.add("cli.mjs", f"compute failed: {first[0] if first else 'exit ' + str(p.returncode)}")
            return None
        fragments = {}
        folder = os.path.join(out, "fragments")
        for name in sorted(os.listdir(folder)):
            if name.endswith(".md"):
                fragments[name] = read_text(os.path.join(folder, name))
        with open(os.path.join(out, "model.json"), encoding="utf-8") as f:
            model = json.load(f)
    return {"fragments": fragments, "model": model}


def path_facts(state):
    run = state.get("run") or {}
    register = state.get("register") or {}
    header = register.get("header") or {}
    hdr07 = header.get("HDR-07") or [{}]
    overlay = (register.get("overlay") or {}).get("applies") is True
    return {"mode": run.get("mode"), "light": run.get("light") is True,
            "change": hdr07[0].get("value") if hdr07 else None, "overlay": overlay}


def expected_chunks(facts):
    if facts["mode"] == "quick":
        return [c for c in CHUNKS if c[0] in QUICK], {c[0]: "a quick Pre-SDD writes only chunks 00, 01, 02, 03a to 03h, and 10" for c in CHUNKS if c[0] not in QUICK}
    omitted = {}
    keep = []
    for chunk in CHUNKS:
        if chunk[0] == "06" and facts["change"] not in ("brownfield", "mixed"):
            omitted["06"] = f"chunk 06 exists only for a brownfield or mixed change type (HDR-07.1 is {facts['change'] or 'not set'})"
            continue
        if chunk[0] == "08" and not facts["overlay"]:
            omitted["08"] = "chunk 08 exists only while the migration overlay applies"
            continue
        keep.append(chunk)
    return keep, omitted


def check_chunk_set(psdd, master, chain, omitted, report):
    present = {name for name in os.listdir(psdd)
               if name != master and CHUNK_FILE.fullmatch(name) and os.path.isfile(os.path.join(psdd, name))}
    names = {c[1] for c in chain}
    for chunk in chain:
        if chunk[1] not in present:
            report.add(chunk[1], f"missing: chunk {chunk[0]} is written in this mode and path")
    for name in sorted(present - names):
        known = next((c for c in CHUNKS if c[1] == name), None)
        if known and known[0] in omitted:
            report.add(name, f"written, but should not be written: {omitted[known[0]]}")
        else:
            report.add(name, "is not a chunk of the chunk map")
    return [c for c in chain if c[1] in present]


def gate_parts(model):
    g = model["gate"]
    return g["label"], g["g3"]["status"], "Yes" if g.get("authorized") else "No"


def check_master(psdd, master, chain, present, omitted, facts, model, report):
    path = os.path.join(psdd, master)
    if not os.path.isfile(path):
        report.add(master, "not found")
        return None
    text = read_text(path)
    lines = text.split("\n")
    generations = [l for l in lines if l.startswith("**Generation:**")]
    wanted = facts["mode"] + (", light" if facts["light"] else "")
    if len(generations) != 1:
        report.add(master, f'{len(generations)} Generation lines, expected one "**Generation:** {wanted}"')
    elif GENERATION_DATE.sub("", generations[0].split("**Generation:**", 1)[1]).strip() != wanted:
        report.add(master, f'Generation line reads "{generations[0].strip()}", expected "**Generation:** {wanted}" (the project state)')
    gates = [l for l in lines if l.startswith("**Gate:**")]
    label = None
    if len(gates) != 1:
        report.add(master, f"{len(gates)} Gate lines, expected one")
    else:
        m = re.fullmatch(r"\*\*Gate:\*\*\s+(.+?)\s+-\s+G3:\s+(.+?)\s+-\s+SDD authorized:\s+(\S+)\s*", gates[0])
        if not m:
            report.add(master, f'Gate line reads "{gates[0].strip()}", expected "**Gate:** <label> - G3: <status> - SDD authorized: <Yes | No>"')
        else:
            label = m.group(1)
            if model is not None:
                want = gate_parts(model)
                if m.groups() != want:
                    report.add(master, f'Gate line reads "{gates[0].strip()}", expected "**Gate:** {want[0]} - G3: {want[1]} - SDD authorized: {want[2]}" (the engine\'s gate result)')
    linked = set()
    for target in re.findall(r"\]\(\./([^)#\s]+)", text):
        linked.add(target)
    names = {c[1] for c in chain}
    for name in sorted(linked):
        known = next((c for c in CHUNKS if c[1] == name), None)
        if known and name not in names and known[0] in omitted:
            report.add(master, f"links {name}, a chunk this Pre-SDD omitted ({omitted[known[0]]})")
    for chunk in present:
        if chunk[1] not in linked:
            report.add(master, f"no link to {chunk[1]}, a written chunk")
    claimed = label in G1_LABELS
    for _, head, rows in tables(lines):
        if head[:1] == ["Stage"] and "Gate" in head:
            gi = head.index("Gate")
            for _, row in rows:
                if row and row[0].startswith("2.") and len(row) > gi and row[gi] == "G1 Met":
                    claimed = True
    return {"label": label, "claimed": claimed}


def check_header_footer(psdd, chain, master, report, texts):
    names = [c[1] for c in chain]
    for i, (cid, name, _) in enumerate(chain):
        text = texts[name]
        if not text.lstrip().startswith("<!--"):
            report.add(name, "does not open with the chunk header comment")
        else:
            header = text.lstrip().split("-->", 1)[0]
            m = re.search(r"^CHUNK:\s*(\S+)\s*$", header, re.M)
            if not m or m.group(1) != cid:
                report.add(name, f"header CHUNK reads {m.group(1) if m else 'nothing'}, expected {cid}")
            if not re.search(r"^VERSION:\s*\d+\.\d+\s*$", header, re.M):
                report.add(name, "header has no VERSION: X.Y line")
        prev = names[i - 1] if i else "none"
        nxt = names[i + 1] if i + 1 < len(names) else "none"
        want = f"<!-- MASTER: {master} | PREV: {prev} | NEXT: {nxt} -->"
        last = [l for l in text.split("\n") if l.strip()]
        got = last[-1].strip() if last else ""
        if got != want:
            report.add(name, f'footer reads "{got}", expected "{want}"')


def regions(text):
    out = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        m = FRAGMENT_OPEN.match(lines[i])
        if m:
            j = i + 1
            while j < len(lines) and not FRAGMENT_CLOSE.match(lines[j]):
                j += 1
            out.append((i + 1, m.group(1), "\n".join(lines[i + 1:j]), j < len(lines)))
            i = j + 1
        else:
            i += 1
    return out


def check_fragments(chain, texts, computed, report):
    for cid, name, frags in chain:
        found = regions(texts[name])
        counts = Counter(f for _, f, _, _ in found)
        for frag in frags:
            if counts[frag] == 0:
                report.add(name, f"no ENGINE-FRAGMENT region for {frag}")
            elif counts[frag] > 1:
                report.add(name, f"{counts[frag]} ENGINE-FRAGMENT regions for {frag}, expected one")
        for line, frag, body, closed in found:
            if frag not in frags:
                report.add(name, f"line {line}: ENGINE-FRAGMENT region for {frag}, which belongs to no section of chunk {cid}")
                continue
            if not closed:
                report.add(name, f"line {line}: ENGINE-FRAGMENT region for {frag} has no closing marker")
                continue
            if computed is None:
                continue
            if frag not in computed["fragments"]:
                report.add(name, f"line {line}: compute renders no fragment {frag} from the project state")
                continue
            want = computed["fragments"][frag].strip("\n").split("\n")
            got = body.strip("\n").split("\n")
            if [l.rstrip() for l in got] != [l.rstrip() for l in want]:
                k = next((n for n, (a, b) in enumerate(zip(got, want)) if a.rstrip() != b.rstrip()), min(len(got), len(want)))
                report.add(name, f"line {line}: region {frag} differs from the fragment compute renders from the project state, first at its line {k + 1}")


def valid_source(source):
    return any(p.fullmatch(source) for p in SOURCES)


def check_entry(name, row_cells, kind, claimed, report):
    entry = row_cells[0]
    where = f"{entry}"
    if kind == "entry":
        value, status, source, owner, due = row_cells[2], row_cells[7], row_cells[8], row_cells[9], row_cells[10]
    else:
        where = f"{entry} {row_cells[1]}"
        value, status, source, owner, due = row_cells[2], row_cells[4], row_cells[5], None, None
    if status.startswith("Confirmed"):
        if not CONFIRMED.fullmatch(status):
            report.add(name, f'{where}: Status "{status}" is Confirmed without who and when, expected "Confirmed (<who>, <UTC time>)"')
            return
    elif status not in STATUSES:
        report.add(name, f'{where}: Status "{status}" is not one of: Open, Estimated, Confirmed (<who>, <UTC time>), N/A')
        return
    if status == "N/A" and kind == "entry" and not re.fullmatch(r"N/A: \S.*", value):
        report.add(name, f'{where}: N/A without a reason, expected the value "N/A: <reason>"')
    if source == "TBD":
        if status not in ("Open", "N/A"):
            report.add(name, f'{where}: Source "TBD" on a {status.split(" ")[0]} value, which needs its source')
    elif not valid_source(source):
        report.add(name, f'Source "{source}" of {where} is not one of: BRD: KEY/ID, Derived: CALC-NN from <items>, Default: <appendix or rule>, Import: Studio v2.2, Answer: <who>, <date>, Policy: <policy> (set by <name>, <date>), Fixture: <owner> (test-run policy)')
    if kind != "entry":
        return
    header = entry.startswith(("HDR-", "OVL-"))
    owner_name = None
    if owner != "TBD":
        m = OWNER_WITH_CODES.fullmatch(owner)
        if m:
            owner_name = m.group(2)
        elif header:
            owner_name = owner
        else:
            report.add(name, f'Owner "{owner}" of {where} is not owner codes joined by + (B, E, D, Sec, Ops, Fin, Legal), with the owner name in brackets')
            return
    if due != "TBD" and not re.fullmatch(DATE, due):
        report.add(name, f'{where}: Due "{due}" is not a date, YYYY-MM-DD')
        return
    if status == "Open" and claimed and (not owner_name or due == "TBD"):
        report.add(name, f"{where} is Open without an owner name and a due date, and the master claims G1")


def check_register(chain, texts, claimed, report):
    seen = {}
    entries = set()
    for cid, name, _ in chain:
        lines = texts[name].split("\n")
        for n, line in enumerate(lines, 1):
            m = ANY_ROW_HEADING.match(line)
            if m:
                seen.setdefault(m.group(1), []).append((name, cid, n))
        if cid not in REGISTER_CHUNKS:
            continue
        for _, head, rows in tables(lines):
            if head == ENTRY_HEAD:
                kind = "entry"
            elif head == FACTOR_HEAD:
                kind = "factor"
            else:
                continue
            for _, row_cells in rows:
                if len(row_cells) != len(head) or not ENTRY_ID.fullmatch(row_cells[0]):
                    report.add(name, f'a {kind} row "| {" | ".join(row_cells)} |" does not fit the table')
                    continue
                if kind == "entry":
                    entries.add(row_cells[0])
                check_entry(name, row_cells, kind, claimed, report)
    written = {c[0]: c[1] for c in chain}
    for row, home in HOME.items():
        places = seen.get(row, [])
        home_places = [p for p in places if p[1] == home]
        if home in written and not home_places:
            report.add(written[home], f'no "### {row}" row: the register needs every row in its chunk')
        elif len(home_places) > 1:
            report.add(written[home], f'"### {row}" appears {len(home_places)} times, expected once')
        for name, cid, n in places:
            if cid != home:
                report.add(name, f'line {n}: "### {row}" belongs in chunk {home}, not chunk {cid}')
        if home_places and f"{row}.1" not in entries:
            report.add(written[home], f"row {row} has no primary entry {row}.1 in an entries table")
    rows = {row for row in seen}
    return rows, entries


def check_signoff(name, text, facts, report):
    lines = text.split("\n")
    table = None
    for k, line in enumerate(lines):
        if line.strip() == "**Sign-off register**":
            found = [t for t in tables(lines[k + 1:]) if t[1] == SIGNOFF_HEAD]
            table = found[0] if found else None
            break
    if table is None:
        report.add(name, "Sign-off register: no table with the header | Role | Name | Decision | At | Comments |")
        return
    applicable = [label for label, overlay_only in ROLES if not overlay_only or facts["overlay"]]
    labels = [label for label, _ in ROLES]
    present = Counter()
    for _, row in table[2]:
        if len(row) != len(SIGNOFF_HEAD):
            report.add(name, f'Sign-off register: a row "| {" | ".join(row)} |" has {len(row)} cells, expected 5')
            continue
        role, signer, decision, at, _ = row
        if role not in labels:
            report.add(name, f'Sign-off register: "{role}" is not a sign-off role')
            continue
        if role not in applicable:
            report.add(name, f'Sign-off register: "{role}" has a row, but the role applies only while the migration overlay applies')
            continue
        present[role] += 1
        if decision == "Not signed":
            continue
        if decision not in DECISIONS and not re.fullmatch(r"Not applicable: \S.*", decision):
            report.add(name, f'Sign-off register: "{role}" decision "{decision}" is not one of: Approved, Approved with conditions, Rejected, Not applicable: <reason>, Not signed')
        if signer in ("", "TBD"):
            report.add(name, f'Sign-off register: "{role}" reads "{decision}" without the signer\'s name')
        if not re.fullmatch(UTC, at):
            report.add(name, f'Sign-off register: "{role}" reads "{decision}" without a UTC time (At "{at}")')
    for role in applicable:
        if not present[role]:
            report.add(name, f'Sign-off register: no row for "{role}", an applicable role')


def check_twelve(name, text, model, report):
    lines = text.split("\n")
    headings = [re.sub(r"^##\s+", "", l).strip() for l in lines if re.match(r"^##\s+\S", l) and not l.startswith("###")]
    at = -1
    for heading in TWELVE:
        if heading not in headings:
            report.add(name, f'no "## {heading}" section')
            continue
        k = headings.index(heading)
        if k < at:
            report.add(name, f'"## {heading}" is out of order')
        at = max(at, k)
    if model is None:
        return
    label = model["gate"]["label"]
    start = next((k for k, l in enumerate(lines) if l.strip() == f"## {TWELVE[0]}"), None)
    if start is None:
        return
    end = next((k for k in range(start + 1, len(lines)) if lines[k].startswith("## ")), len(lines))
    rows = [row for t in tables(lines[start:end]) for _, row in t[2] if row and row[0] == "Gate"]
    if not rows:
        report.add(name, f'12.1 has no "| Gate | {label} |" row')
    elif rows[0][1] != label:
        report.add(name, f'12.1 Gate reads "{rows[0][1]}", expected "{label}" (the engine\'s gate label, as the master shows it)')


def check_dashes(psdd, report):
    for name in sorted(os.listdir(psdd)):
        path = os.path.join(psdd, name)
        if not name.endswith(".md") or not os.path.isfile(path):
            continue
        for n, line in enumerate(read_text(path).split("\n"), 1):
            if DASHES.search(line):
                report.add(name, f"line {n}: em or en dash")


def calc_values(computed):
    values = {}
    for frag in ("04-calculations.md", "07-options.md"):
        text = computed["fragments"].get(frag, "")
        for _, head, rows in tables(text.split("\n")):
            if "Result" not in head:
                continue
            ri = head.index("Result")
            for _, row in rows:
                if row and re.fullmatch(r"CALC-\d+(?:@OPT-\d+)?", row[0]) and len(row) > ri:
                    values[row[0]] = row[ri]
    return values


def source_row(sdd, report):
    path = os.path.join(sdd, SDD_COVER)
    where = f"SDD {SDD_COVER}"
    if not os.path.isfile(path):
        report.add(where, "not found")
        return None
    lines = read_text(path).split("\n")
    start = next((k for k, l in enumerate(lines) if re.match(r"^###\s+Source Pre-SDD\s*$", l)), None)
    if start is None:
        report.add(where, 'no "### Source Pre-SDD" table under Document Lineage')
        return None
    end = next((k for k in range(start + 1, len(lines)) if re.match(r"^#{1,3}\s", lines[k])), len(lines))
    found = [t for t in tables(lines[start:end]) if t[1] == SOURCE_PSDD_HEAD]
    if not found:
        report.add(where, "Source Pre-SDD: no table with the header | Key | Pre-SDD | Version | Gate | Link |")
        return None
    rows = found[0][2]
    if len(rows) != 1:
        report.add(where, f"Source Pre-SDD: {len(rows)} rows, expected one")
        return None
    return path, rows[0][1]


def check_sdd(sdd, psdd, master, state, model, computed, rows, entries, chunk_texts, report):
    if not os.path.isdir(sdd):
        report.add("SDD", f"folder not found: {sdd}")
        return
    where = f"SDD {SDD_COVER}"
    found = source_row(sdd, report)
    if found:
        path, row = found
        if len(row) != len(SOURCE_PSDD_HEAD):
            report.add(where, f"Source Pre-SDD: the row has {len(row)} cells, expected 5")
        else:
            key, _, version, gate, link = row
            if key != "PSDD":
                report.add(where, f'Source Pre-SDD: Key reads "{key}", expected PSDD')
            want_version = (state.get("project") or {}).get("pre_sdd_version")
            if version != want_version:
                report.add(where, f'Source Pre-SDD: Version reads "{version}", expected {want_version} (the Pre-SDD version)')
            want_gate = model["gate"]["label"] if model else None
            if gate not in SIGNED_LABELS or (want_gate is not None and gate != want_gate):
                report.add(where, f'Source Pre-SDD: Gate reads "{gate}", expected {want_gate} (the Pre-SDD gate label), a G3 Approved or G3 Approved with conditions label')
            m = re.fullmatch(r"\[[^\]]*\]\(([^)\s#]+)\)", link)
            target = os.path.normpath(os.path.join(os.path.dirname(path), m.group(1))) if m else None
            expected = os.path.join(psdd, master)
            if not target or not os.path.isfile(target) or not os.path.isfile(expected) or not os.path.samefile(target, expected):
                report.add(where, f'Source Pre-SDD: Link "{link}" does not resolve to the Pre-SDD master {master}')
    corpus = "\n".join(chunk_texts.values())
    values = calc_values(computed) if computed else None
    for dirpath, _, names in os.walk(sdd):
        for fname in sorted(names):
            if not fname.endswith(".md"):
                continue
            path = os.path.join(dirpath, fname)
            rel = os.path.relpath(path, sdd).replace(os.sep, "/")
            text = read_text(path)
            for n, line in enumerate(text.split("\n"), 1):
                for m in CITE.finditer(line):
                    cited = m.group(1)
                    if not cited_exists(cited, rows, entries, corpus):
                        report.add(f"SDD {rel}", f"line {n}: PSDD/{cited} is not in the Pre-SDD")
            if values is not None:
                check_section_18(rel, text, values, report)


def cited_exists(cited, rows, entries, corpus):
    if ROW_ID.fullmatch(cited):
        return cited in rows
    if ENTRY_ID.fullmatch(cited):
        return cited in entries
    parts = cited.split("@")
    return all(re.search(r"(?<![A-Za-z0-9-])" + re.escape(p) + r"(?![A-Za-z0-9])", corpus) for p in parts) and \
        (len(parts) == 1 or re.search(r"(?<![A-Za-z0-9-])" + re.escape(cited) + r"(?![A-Za-z0-9])", corpus))


def check_section_18(rel, text, values, report):
    lines = text.split("\n")
    on = False
    fence = False
    for n, line in enumerate(lines, 1):
        if line.strip().startswith("```"):
            fence = not fence
            continue
        if fence:
            continue
        if re.match(r"^#\s", line):
            on = bool(re.match(r"^#\s+18\.", line))
            continue
        if not on:
            continue
        cites = CALC_CITE.findall(line)
        if not cites:
            continue
        bare = LINK_TARGET.sub("]", line)
        bare = re.sub(r"<!--.*?-->", " ", bare)
        bare = ID_TOKEN.sub(" ", bare)
        bare = SECTION_SIGN.sub(" ", bare)
        bare = re.sub(r"\bp\d{2}\b", " ", bare)
        numbers = [float(x.replace(",", "")) for x in NUMBER.findall(bare)]
        if not numbers:
            continue
        for cited in cites:
            result = values.get(cited)
            model = first_number(result)
            if model is None:
                continue
            if not any(same_number(model, x) for x in numbers):
                shown = ", ".join(NUMBER.findall(bare))
                report.add(f"SDD {rel}", f"line {n}: PSDD/{cited} is cited with {shown}, but the model value is {result}")


def main():
    parser = argparse.ArgumentParser(prog="check_presdd.py")
    parser.add_argument("psdd", metavar="PSDD_DIR")
    parser.add_argument("--sdd", metavar="SDD_DIR")
    parser.add_argument("--cli", metavar="CLI", default=DEFAULT_CLI)
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    report = Report()
    psdd = os.path.abspath(args.psdd)
    if not os.path.isdir(psdd):
        report.add(args.psdd, "folder not found")
    else:
        run(psdd, args, report)
    for problem in report.problems:
        print(problem)
    print(f"{len(report.problems)} problems")
    sys.exit(1 if report.problems else 0)


def run(psdd, args, report):
    state, state_path = load_state(psdd, report)
    check_dashes(psdd, report)
    if state is None:
        return
    facts = path_facts(state)
    slug = (state.get("project") or {}).get("slug") or ""
    master = f"{slug}-pre-sdd-master.md"
    now = history_now(state) or generation_now(psdd, master)
    computed = run_compute(os.path.abspath(args.cli), state_path, now, report)
    model = computed["model"] if computed else None
    chain, omitted = expected_chunks(facts)
    present = check_chunk_set(psdd, master, chain, omitted, report)
    texts = {c[1]: read_text(os.path.join(psdd, c[1])) for c in present}
    claim = check_master(psdd, master, chain, present, omitted, facts, model, report)
    claimed = bool(claim and claim["claimed"])
    check_header_footer(psdd, present, master, report, texts)
    check_fragments(present, texts, computed, report)
    rows, entries = check_register(present, texts, claimed, report)
    if "11-gate-and-sign-off.md" in texts:
        check_signoff("11-gate-and-sign-off.md", texts["11-gate-and-sign-off.md"], facts, report)
    if "12-sdd-handoff-guide.md" in texts:
        check_twelve("12-sdd-handoff-guide.md", texts["12-sdd-handoff-guide.md"], model, report)
    if args.sdd:
        check_sdd(os.path.abspath(args.sdd), psdd, master, state, model, computed, rows, entries, texts, report)


if __name__ == "__main__":
    main()
