"""Verify cross-references inside the lld-unifier skill folder.

Usage: python check_refs.py <lld-unifier dir> <sdd-unifier dir>
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from check_lld_trace import slug  # noqa: E402

HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*$")


def headings(path):
    out = []
    in_code = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            if line.strip().startswith("```"):
                in_code = not in_code
                continue
            if in_code:
                continue
            m = HEADING.match(line.rstrip("\r\n"))
            if m:
                out.append(m.group(2).replace("`", ""))
    return out


def norm(t):
    t = re.sub(r"\s+", " ", t.replace("§", "").replace("`", "")).strip().lower()
    return t


def core(h):
    """Heading text without its leading section number and trailing parenthetical."""
    h = norm(h)
    h = re.sub(r"^\d+(\.\d+)*\.?\s+", "", h)
    return re.sub(r"\s*\(.*$", "", h).strip()


def matches(ref, heads):
    """ref (prose after the §) starts with a heading's core, or names its number."""
    r = norm(ref).rstrip(":;,. ")
    num = re.match(r"^(\d+(?:\.\d+)*)\b", r)
    if num:
        return any(re.match(re.escape(num.group(1)) + r"(\.|\s|$)", norm(h)) for h in heads)
    return any(core(h) and (r.startswith(core(h)) or core(h).startswith(r)) for h in heads)


def main(skill, sdd):
    files = {}
    for dp, _, names in os.walk(skill):
        for n in names:
            if n.endswith(".md"):
                files[os.path.relpath(os.path.join(dp, n), skill).replace("\\", "/")] = os.path.join(dp, n)
    skill_heads = headings(files["SKILL.md"])
    step_heads = {}
    for h in skill_heads:
        m = re.match(r"(\d+[a-z]?)\.\s", h)
        if m:
            step_heads[m.group(1)] = h
    problems, checked = [], 0
    for rel, path in sorted(files.items()):
        text = open(path, encoding="utf-8").read()
        for m in re.finditer(r"SKILL\.md step (\d+[a-z]?)", text):
            checked += 1
            if m.group(1) not in step_heads:
                problems.append((rel, m.group(0), "no such SKILL.md step heading"))
        for m in re.finditer(r"SKILL\.md §\s*([A-Za-z][^,.;:)\n`]*)", text):
            checked += 1
            target = norm(m.group(1))
            if not any(norm(h).startswith(target[:25]) for h in skill_heads):
                problems.append((rel, m.group(0)[:60], "no such SKILL.md heading"))
        # `file.md` § Heading [› Sub]  (skill-internal files)
        for m in re.finditer(r"`([\w./-]+\.md)`\s*§\s*([^\n|`]+?)(?=[\n|`)]|,\s|;|\.\s|\.$| and | or |$)", text):
            fname, ref = m.group(1), m.group(2).strip().rstrip(".")
            key = fname if fname in files else ("chunks/" + fname if "chunks/" + fname in files else None)
            if key is None:
                continue
            checked += 1
            heads = headings(files[key])
            parts = [p.strip() for p in ref.split("›")]
            ok = all(matches(p, heads) for p in parts)
            if not ok:
                problems.append((rel, f"`{fname}` § {ref}"[:90], "heading not found"))
        # sdd-to-lld.md internal "§ Name › Sub" references
        if rel == "sdd-to-lld.md":
            heads = headings(path)
            for m in re.finditer(r"(?<![`\w])§ (Use-case traceability|One fact, one home|BRD inputs|Specs ownership & synthesis)( › [^.\n)|]+)?", text):
                checked += 1
                ok = matches(m.group(1), heads)
                if m.group(2):
                    for sub in m.group(2).split("›")[1:]:
                        ok = ok and matches(sub, heads)
                if not ok:
                    problems.append((rel, m.group(0)[:80], "internal § not found"))
    print(f"references checked: {checked}")
    print(f"problems: {len(problems)}")
    for p in problems:
        print("  ", p)

    # Anchor examples
    sdd03 = os.path.join(sdd, "chunks", "03-users-and-use-cases.md")
    h73 = [h for h in headings(sdd03) if h.startswith("7.3 ")][0]
    lld16 = files["chunks/16-references.md"]
    h199 = [h for h in headings(lld16) if h.startswith("19.9 ")][0]
    for heading, expected in [(h73, "73-use-case-traceability-brd--sdd"), (h199, "199-use-case-traceability-index"), ("REFUNDS/UC-04: Approve / Reject Refund", "refundsuc-04-approve--reject-refund")]:
        got = slug(heading)
        print(f"anchor {'OK ' if got == expected else 'BAD'} {heading!r} -> #{got}")

    # Child LLDs headings and columns vs sdd-unifier chunk 00
    sdd00 = open(os.path.join(sdd, "chunks", "00-cover-and-changelog.md"), encoding="utf-8").read()
    s2l = open(files["sdd-to-lld.md"], encoding="utf-8").read()
    for token in ["## Document Lineage", "### Child LLDs (children)"]:
        print(f"heading {token!r}: in sdd-unifier 00={token in sdd00}, cited in sdd-to-lld.md={token in s2l}")
    m = re.search(r"### Child LLDs \(children\).*?\n(\|[^\n]*\|)\n", sdd00, re.S)
    cols = [c.strip() for c in m.group(1).strip("|").split("|")]
    mine = re.findall(r"^\| (LLD|Scope \(§13 services\)|Direction|Version|Link) \|", s2l, re.M)
    print(f"sdd-unifier Child LLDs columns: {cols}")
    print(f"sdd-to-lld.md column rows:     {mine} -> {'MATCH' if mine == cols else 'DIFFER'}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main(sys.argv[1], sys.argv[2])
