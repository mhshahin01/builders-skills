import glob
import os
import re
import sys

LLD = os.path.abspath(sys.argv[1])


def headings(path):
    out = []
    fence = False
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            if line.startswith("```"):
                fence = not fence
                continue
            if fence:
                continue
            m = re.match(r"^(#{1,6})\s+(.*)$", line.rstrip("\n"))
            if m:
                out.append(m.group(2))
    return out


def slug(text):
    t = text.strip().lower()
    t = re.sub(r"[^\w\- ]", "", t)
    return t.replace(" ", "-")


def slugs(path):
    seen = {}
    result = set()
    for h in headings(path):
        s = slug(h)
        if s in seen:
            seen[s] += 1
            result.add(f"{s}-{seen[s]}")
        else:
            seen[s] = 0
            result.add(s)
    return result


files = sorted(glob.glob(os.path.join(LLD, "*.md"))) + sorted(glob.glob(os.path.join(LLD, "04-implementation", "*.md")))
bad = 0
total = 0
sdd_refs = 0
for f in files:
    text = open(f, encoding="utf-8").read()
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    for m in re.finditer(r"\]\(([^)\s]+)\)", text):
        target = m.group(1)
        if target.startswith("http"):
            continue
        total += 1
        path, _, anchor = target.partition("#")
        full = os.path.normpath(os.path.join(os.path.dirname(f), path)) if path else f
        if "sdd-refunds-platform" in target:
            sdd_refs += 1
        if not os.path.exists(full):
            bad += 1
            print("MISSING FILE", os.path.relpath(f, LLD), target)
            continue
        if anchor and os.path.isfile(full):
            if anchor not in slugs(full):
                bad += 1
                print("MISSING ANCHOR", os.path.relpath(f, LLD), target)
print("LINKS", total, "SDD_REFS", sdd_refs, "BAD", bad)

for f in files:
    raw = open(f, encoding="utf-8", newline="").read()
    if "\r" in raw:
        print("CRLF", os.path.relpath(f, LLD))
    if "\u2014" in raw:
        print("EMDASH", os.path.relpath(f, LLD))
    required_header = bool(re.match(r"^\d{2}[a-z]?-", os.path.basename(f)) or
                           os.path.basename(f).endswith("-master.md") or
                           os.path.basename(os.path.dirname(f)) == "04-implementation")
    if required_header and not raw.lstrip().startswith("<!--"):
        print("NO HEADER BLOCK", os.path.relpath(f, LLD))
print("FILES", len(files))
