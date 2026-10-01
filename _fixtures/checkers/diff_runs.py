import os
import re
import sys
from collections import Counter

HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
LINK = re.compile(r"\]\(([^)\s]+)\)")
IDS = re.compile(r"(?<![\w/-])(?:[A-Z][A-Z-]*/)?(?:UC|TC-[A-Z]{3}|SCR|MK|LP|NFR|BR|TD|TASK|API|INT|ADR|OI|R)-\d{2,}(?![\w])")
EVENT = re.compile(r"`([A-Z][A-Z0-9]+(?:_[A-Z0-9]+)+)`")
TOKEN = re.compile(r"`([a-z]+\.[a-z]+\.[a-z][a-z-]*)`")
LIMIT = 12
LEVELS = 6


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def prose(text):
    in_code = False
    for line in text.splitlines():
        if line.strip().startswith("```"):
            in_code = not in_code
            continue
        if not in_code:
            yield line


def facts(path):
    text = read(path)
    lines = list(prose(re.sub(r"<!--.*?-->", "", text, flags=re.S)))
    headings = Counter()
    tables = Counter()
    for i, line in enumerate(lines):
        m = HEADING.match(line)
        if m and len(m.group(1)) <= LEVELS:
            headings[f"{m.group(1)} {m.group(2)}"] += 1
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:|-]+\|$", lines[i + 1].strip()):
            tables[" | ".join(c.strip() for c in line.strip().strip("|").split("|"))] += 1
    return {
        "headings": headings,
        "tables": tables,
        "ids": set(IDS.findall(text)),
        "events": set(EVENT.findall(text)),
        "tokens": set(TOKEN.findall(text)),
        "counts": Counter({
            "mermaid": text.count("```mermaid"),
            "links": len(LINK.findall("\n".join(lines))),
            "clarification": text.count("[NEEDS CLARIFICATION"),
            "todo": text.count("> TODO:"),
            "confirm": text.count("> Confirm:"),
            "em_dash": text.count("\u2014"),
            "bytes": len(text.encode("utf-8")),
        }),
    }


def md_files(root):
    out = {}
    for dp, _, names in os.walk(root):
        for n in names:
            if n.endswith(".md"):
                out[os.path.relpath(os.path.join(dp, n), root).replace("\\", "/")] = os.path.join(dp, n)
    return out


def show(label, items):
    items = sorted(items)
    if not items:
        return
    print(f"    {label} ({len(items)}):")
    for x in items[:LIMIT]:
        print(f"      {x}")
    if len(items) > LIMIT:
        print(f"      ... {len(items) - LIMIT} more")


def compare(name, base, new):
    a, b = md_files(base), md_files(new)
    print(f"== {name}")
    show("files only in base", set(a) - set(b))
    show("files only in new", set(b) - set(a))
    total_a, total_b = Counter(), Counter()
    for rel in sorted(set(a) | set(b)):
        fa = facts(a[rel]) if rel in a else None
        fb = facts(b[rel]) if rel in b else None
        if fa:
            total_a.update(fa["counts"])
        if fb:
            total_b.update(fb["counts"])
        if not (fa and fb):
            continue
        parts = []
        for key in ("headings", "tables"):
            gone = list((fa[key] - fb[key]).elements())
            added = list((fb[key] - fa[key]).elements())
            if gone or added:
                parts.append((key, gone, added))
        for key in ("ids", "events", "tokens"):
            gone, added = fa[key] - fb[key], fb[key] - fa[key]
            if gone or added:
                parts.append((key, gone, added))
        if parts:
            print(f"  {rel}")
            for key, gone, added in parts:
                show(f"{key} only in base", gone)
                show(f"{key} only in new", added)
    keys = sorted(set(total_a) | set(total_b))
    print("  totals (base -> new): " + ", ".join(f"{k} {total_a[k]} -> {total_b[k]}" for k in keys))


def main(base_root, new_root):
    docs = sorted(d for d in set(os.listdir(base_root)) | set(os.listdir(new_root))
                  if re.match(r"(brd|sdd|lld)-", d) and (os.path.isdir(os.path.join(base_root, d)) or os.path.isdir(os.path.join(new_root, d))))
    for d in docs:
        a, b = os.path.join(base_root, d), os.path.join(new_root, d)
        if not os.path.isdir(a) or not os.path.isdir(b):
            print(f"== {d}: only in {'new' if os.path.isdir(b) else 'base'}")
            continue
        compare(d, a, b)


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--levels" in args:
        i = args.index("--levels")
        LEVELS = int(args[i + 1])
        del args[i:i + 2]
    if len(args) != 2:
        print("usage: python diff_runs.py BASE_RUN_DIR NEW_RUN_DIR [--levels N]")
        sys.exit(2)
    sys.stdout.reconfigure(encoding="utf-8")
    main(args[0], args[1])
