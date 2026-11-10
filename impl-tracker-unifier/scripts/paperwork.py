"""Paired tracking writes (SKILL.md rule 1a), so a status change or a doc point is one command, not a hand edit.

  preflight.py --tracking <t> --set-status KEY/T-NNN "<State>" "<reason>"
      card Status cell + one History row + the task's index.md Status (and Agent/Updated) cells
  preflight.py --tracking <t> --gap-du KEY/T-NNN "type|severity|anchor|text|owner" "level|kind|anchors|what|decided"
      next KEY/GAP-NNN row in gaps.md (after the key's last gap) and next KEY/DU-NNN row in doc-updates.md;
      DU "-" writes the gap alone (an owner that is not a doc skill)
  preflight.py --tracking <t> --close-out KEY/T-NNN --reason "<verdict>" --evidence "<bullet>"...       --gap "type|severity|anchor|text|owner[||level|kind|anchors|what|decided]"... --journal "<line>"
      one command for a task's close-out: every gap (a doc gap with its DU, Owner naming the DU), every flake in
      tracking/flakes.md as a minor test gap (the file is then emptied), the card's ## Evidence bullets, Done
      (card + History + index), one journal line, then --history
Prints the ids it wrote. Never renumbers, never deletes.
"""
import datetime
import glob
import os
import re
import sys


def _today():
    return datetime.date.today().isoformat()


def _card(tracking, full):
    key, tid = full.split("/")
    cards = glob.glob(os.path.join(tracking, key, "tasks", tid + "-*.md"))
    if len(cards) != 1:
        sys.exit("paperwork: card for %s not found" % full)
    return cards[0]


def _cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def set_status(tracking, full, state, reason, agent):
    path = _card(tracking, full)
    card = open(path, encoding="utf-8").read()
    m = re.search(r"^\| Status \| ([^|]*)\|", card, re.M)
    if not m:
        sys.exit("paperwork: no Status row in " + path)
    old = m.group(1).strip()
    card = card[:m.start()] + "| Status | %s |" % state + card[m.end():]
    if state == "Done":
        card = re.sub(r"^(\| Agent / started / finished \| [^/|]*/ [^/|]*/ )—( \|)",
                      lambda g: g.group(1) + _today() + g.group(2), card, flags=re.M)
    card = card.rstrip("\n") + "\n| %s | %s | %s → %s | %s |\n" % (_today(), agent, old, state, reason)
    open(path, "w", encoding="utf-8").write(card)

    ipath = os.path.join(tracking, "index.md")
    lines = open(ipath, encoding="utf-8").read().split("\n")
    hit = False
    for i, l in enumerate(lines):
        if l.startswith("| [%s]" % full):
            c = _cells(l)
            head = next(x for x in lines if x.startswith("| Task") or x.startswith("| ID"))
            names = [h.lower() for h in _cells(head)]
            c[names.index("status")] = state
            for col, val in (("agent", agent), ("updated", _today())):
                if col in names:
                    c[names.index(col)] = val
            lines[i] = "| " + " | ".join(c) + " |"
            hit = True
    if not hit:
        sys.exit("paperwork: %s has no index.md row" % full)
    open(ipath, "w", encoding="utf-8").write("\n".join(lines))
    print("set-status: %s %s → %s" % (full, old, state))


def _next_id(text, key, kind):
    nums = [int(n) for n in re.findall(r"\b%s/%s-(\d+)" % (re.escape(key), kind), text)]
    return "%s/%s-%03d" % (key, kind, max(nums, default=0) + 1)


def gap_du(tracking, full, gap, du, agent):
    key = full.split("/")[0]
    g = [x.strip() for x in gap.split("|")]
    if len(g) != 5:
        sys.exit("paperwork: GAP needs 'type|severity|anchor|text|owner'")
    gpath = os.path.join(tracking, "gaps.md")
    gtext = open(gpath, encoding="utf-8").read()
    apath = os.path.join(tracking, "gaps-archive.md")  # IDs of archived gaps are never reused
    archived = open(apath, encoding="utf-8").read() if os.path.exists(apath) else ""
    gid = _next_id(gtext + "\n" + archived, key, "GAP")
    dpath = os.path.join(tracking, "doc-updates.md")
    dtext = open(dpath, encoding="utf-8").read()
    did = None
    if du.strip() != "-":
        d = [x.strip() for x in du.split("|")]
        if len(d) != 5:
            sys.exit("paperwork: DU needs 'level|kind|anchors|what|decided'")
        did = _next_id(dtext, key, "DU")
    owner = g[4] + (" (%s)" % did.split("/")[1] if did else "")
    row = "| %s | %s | %s | %s, %s, %s | %s | %s | %s | %s | Open |" % (
        gid, g[0], g[1], _today(), agent, full, g[2], g[3], owner, full)
    lines = gtext.split("\n")
    last = [i for i, l in enumerate(lines) if l.startswith("| %s/GAP-" % key)]
    at = (last[-1] + 1) if last else len(lines)
    lines.insert(at, row)
    open(gpath, "w", encoding="utf-8").write("\n".join(lines))
    if did:
        drow = "| %s | Queued | %s | %s | %s | %s | %s | %s | %s | — | — | — | — | %s |" % (
            did, d[0], d[1], full, gid, d[2], d[3], d[4], _today())
        open(dpath, "w", encoding="utf-8").write(dtext.rstrip("\n") + "\n" + drow + "\n")
    print("gap-du: %s%s" % (gid, " + " + did if did else ""))
    return gid, did


def close_out(tracking, full, evidence, gaps, reason, journal, agent, audit_report=""):
    """S-17 wave 3 cause (7): the close-out paperwork in one command (gaps, DUs, flakes, Evidence, Done, journal).
    audit_report: the auditor's returned text (a file path); saved as audits/T-NNN-audit-N.md and linked under Evidence
    with its verdict, so the slice gate S1 finds it (S-17: five Done tasks had no audit link)."""
    if audit_report:
        key, tid = full.split("/")
        adir = os.path.join(tracking, key, "audits")
        os.makedirs(adir, exist_ok=True)
        n = 1
        while os.path.exists(os.path.join(adir, "%s-audit-%d.md" % (tid, n))):
            n += 1
        text = open(audit_report, encoding="utf-8").read()
        verdict = re.search(r"\b(PASS-minor|PASS|FAIL)\b", text)
        verdict = verdict.group(1) if verdict else "PASS"
        open(os.path.join(adir, "%s-audit-%d.md" % (tid, n)), "w", encoding="utf-8").write(
            "# %s audit %d: %s\n\n%s\n" % (full, n, verdict, text.strip()))
        evidence = [e for e in evidence if not e.startswith("Audit:")] + [
            "Audit: [%s-audit-%d](../audits/%s-audit-%d.md) %s" % (tid, n, tid, n, verdict)]
    for g in gaps:
        gap, _, du = g.partition("||")
        gid, did = gap_du(tracking, full, gap, du or "-", agent)
        if did:  # P15: every DU the task raised is listed on its card
            path = _card(tracking, full)
            card = open(path, encoding="utf-8").read()
            m = re.search(r"^## Doc updates[^\n]*\n", card, re.M)
            line = "- %s (%s)\n" % (did, gid)
            card = card[:m.end()] + line + card[m.end():] if m else card.rstrip("\n") + "\n\n## Doc updates\n" + line
            open(path, "w", encoding="utf-8").write(card)
    fpath = os.path.join(tracking, "flakes.md")
    if os.path.exists(fpath):
        for line in open(fpath, encoding="utf-8").read().splitlines():
            c = _cells(line)
            if len(c) >= 3 and c[1]:
                gap_du(tracking, full, "test|minor|%s|order or start-up flake: %s failed in the %s run and passed "
                       "alone (pre-flight re-run once)|tracker" % (c[1], c[1], c[2]), "-", agent)
        open(fpath, "w", encoding="utf-8").write("")
    if evidence:
        path = _card(tracking, full)
        card = open(path, encoding="utf-8").read()
        bullets = "".join("- %s\n" % e for e in evidence)
        m = re.search(r"^## Evidence\n", card, re.M)
        if m:
            card = card[:m.end()] + bullets + card[m.end():]
        else:
            h = re.search(r"^## History", card, re.M)
            at = h.start() if h else len(card)
            card = card[:at] + "## Evidence\n" + bullets + "\n" + card[at:]
        open(path, "w", encoding="utf-8").write(card)
    set_status(tracking, full, "Done", reason or "Done", agent)
    if journal:
        jdir = os.path.join(tracking, "journal")
        os.makedirs(jdir, exist_ok=True)
        jpath = os.path.join(jdir, _today() + ".md")
        head = "" if os.path.exists(jpath) else "# Journal %s\n\n" % _today()
        with open(jpath, "a", encoding="utf-8") as f:
            f.write(head + "- %s\n" % journal)
    print("close-out: %s Done" % full)
