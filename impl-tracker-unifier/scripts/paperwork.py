"""Paired tracking writes (SKILL.md rule 1a), so a status change or a doc point is one command, not a hand edit.

  preflight.py --tracking <t> --set-status KEY/T-NNN "<State>" "<reason>"
      card Status cell + one History row + the task's index.md Status (and Agent/Updated) cells
  preflight.py --tracking <t> --gap-du KEY/T-NNN "type|severity|anchor|text|owner" "level|kind|anchors|what|decided"
      next KEY/GAP-NNN row in gaps.md (after the key's last gap) and next KEY/DU-NNN row in doc-updates.md;
      DU "-" writes the gap alone (an owner that is not a doc skill)
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
    gid = _next_id(gtext, key, "GAP")
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
