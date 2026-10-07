import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
README = ROOT / "README.md"
SKILLS = ["pre-brd-unifier", "brd-unifier", "sdd-unifier", "lld-unifier", "business-reviewer-unifier"]
SECTION_SKILL = {"1": "pre-brd-unifier", "2": "brd-unifier", "3": "sdd-unifier", "4": "lld-unifier", "5": "business-reviewer-unifier"}
PLACEHOLDER_MAP = {
    "brd-unifier": {"06a-use-cases-[persona].md": "chunks/06a-use-cases-detailed.md", "06a-use-cases-[persona-slug].md": "chunks/06a-use-cases-detailed.md"},
    "sdd-unifier": {"13a-service-[slug].md": "chunks/13a-service-detailed-template.md"},
    "lld-unifier": {"04-implementation/<service>.md": "chunks/04-implementation-template.md"},
}
OUTPUT_ONLY = {
    "review-comments-tracker.md", "review-panel-findings.md", "17-specs.md",
    "00-pre-brd-master.md", "AGENTS.md", "ui-ux-global-constitution.md", "SKILL.md",
    ".xlsx", "NN-kebab-name.md", "04-implementation/", "05-user-journeys-and-use-cases.md",
}


def anchor(text):
    t = text.strip().lower()
    t = re.sub(r"[^\w\- ]", "", t)
    return t.replace(" ", "-")


def cells(row):
    return len(re.split(r"(?<!\\)\|", row.strip())) - 2


def main():
    raw = README.read_bytes()
    text = raw.decode("utf-8")
    lines = text.splitlines()
    problems = []

    if raw.startswith(b"\xef\xbb\xbf"):
        problems.append("file starts with a BOM")
    crlf = raw.count(b"\r\n")
    lf_only = raw.count(b"\n") - crlf
    if lf_only:
        problems.append(f"{lf_only} line(s) end in LF only (the file uses CRLF)")

    headings = {anchor(re.sub(r"`", "", m.group(2))) for m in re.finditer(r"^(#+)\s+(.*?)\s*$", text, re.M)}
    for m in re.finditer(r"\]\(#([^)]+)\)", text):
        if m.group(1) not in headings:
            problems.append(f"anchor #{m.group(1)} has no heading")

    section = None
    in_code = False
    table_header = None
    for n, line in enumerate(lines, 1):
        if line.startswith("```"):
            in_code = not in_code
        h = re.match(r"^## (\d)\. ", line)
        if h:
            section = h.group(1)
        elif line.startswith("## "):
            section = None

        if not in_code and line.startswith("|"):
            if table_header is None:
                table_header = (n, cells(line))
            elif cells(line) != table_header[1]:
                problems.append(f"line {n}: {cells(line)} cells, header at line {table_header[0]} has {table_header[1]}")
        else:
            table_header = None

        for tok in re.findall(r"`([^`]+)`", line):
            if not re.search(r"\.(md|py|json|xlsx)$|/$", tok) or " " in tok:
                continue
            name = tok
            if (name in OUTPUT_ONLY or name.startswith("./") or "[project-slug]" in name or "PRE-BRD-[" in name
                    or ("[slug]" in name and not name.startswith(("06a", "13a")))):
                continue
            if name.startswith(tuple(f"{s}/" for s in SKILLS)):
                cands = [ROOT / name]
            else:
                skills = [SECTION_SKILL[section]] if section else SKILLS
                cands = []
                for s in skills:
                    mapped = PLACEHOLDER_MAP.get(s, {}).get(name)
                    if mapped:
                        cands.append(ROOT / s / mapped)
                    cands += [ROOT / s / name, ROOT / s / "chunks" / name]
            if not any(c.exists() for c in cands):
                elsewhere = [s for s in SKILLS if (ROOT / s / name).exists() or (ROOT / s / "chunks" / name).exists()]
                if elsewhere:
                    print(f"info: line {n}: `{tok}` is in {', '.join(elsewhere)}, not in section {section}'s skill")
                else:
                    problems.append(f"line {n}: `{tok}` not found (section {section or '-'})")

        for ch, label in (("—", "em dash"), ("–", "en dash")):
            if ch in line:
                problems.append(f"line {n}: {label}")
        for ch in line:
            if ord(ch) > 127 and ch not in "§·→" and unicodedata.category(ch) not in ("Ll", "Lu"):
                problems.append(f"line {n}: non-ASCII {ch!r} U+{ord(ch):04X}")
                break

    print(f"README: {len(lines)} lines, CRLF {crlf}, LF-only {lf_only}")
    print("\n".join(problems) if problems else "0 problems")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
