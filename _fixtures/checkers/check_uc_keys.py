import os
import re
import sys
from collections import Counter

from check_uc_links import LINK, anchors, strip_code

KEYED_LINK = re.compile(r"\[(?:\*\*)?([A-Z][A-Z0-9-]*)/(UC-\d{2,})[^\]]*\]\(([^)\s]+)\)")
UNKEYED_LINK = re.compile(r"\[(?:\*\*)?(UC-\d{2,})[^\]]*\]\(([^)\s]+)\)")
BARE = re.compile(r"(?<![\w/\[-])([A-Z][A-Z0-9-]*/UC-\d{2,}|UC-\d{2,})")
ROW = re.compile(r"^\|\s*([A-Z][A-Z0-9-]*)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\(([^)\s]+)\)")
TEMPLATE_HEAD = ["Key", "BRD", "Version", "Link"]


def register(sdd_dir):
    keys = {}
    path = os.path.join(sdd_dir, "00-cover-and-changelog.md")
    if not os.path.isfile(path):
        return keys, "", "00-cover-and-changelog.md not found"
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if "### Source BRDs" not in text:
        return keys, text, "no '### Source BRDs' heading in 00-cover-and-changelog.md"
    section = re.split(r"\n#{2,3} ", text.split("### Source BRDs", 1)[1], maxsplit=1)[0]
    rows = [l.strip() for l in section.splitlines() if l.strip().startswith("|")]
    if not rows:
        if "None - generated without a BRD" in section:
            return keys, text, None
        return keys, text, "no table under '### Source BRDs'"
    head = [c.strip() for c in rows[0].strip("|").split("|")]
    if head[:4] != TEMPLATE_HEAD:
        return keys, text, f"its header is '{rows[0]}', and the template's starts '| {' | '.join(TEMPLATE_HEAD)} |' (the link must be the fourth cell)"
    for line in rows[2:]:
        m = ROW.match(line)
        if m and m.group(1) not in ("KEY",):
            target = os.path.normpath(os.path.join(sdd_dir, m.group(4)))
            keys[m.group(1)] = (m.group(2), m.group(3), os.path.dirname(target))
    if not keys:
        return keys, text, "no row has a key and a link in its Link cell"
    return keys, text, None


def main(sdd_dir):
    sdd_dir = os.path.abspath(sdd_dir)
    keys, cover, unreadable = register(sdd_dir)
    print("Register:" + (f" not read ({unreadable})" if unreadable else ""))
    for k, (name, ver, folder) in keys.items():
        print(f"  {k}: {name} v{ver} -> {os.path.basename(folder)} (exists: {os.path.isdir(folder)})")
    print("Child LLDs section present:", "### Child LLDs" in cover)
    problems = []
    keyed = Counter()
    unkeyed = Counter()
    bare = Counter()
    for name in sorted(f for f in os.listdir(sdd_dir) if f.endswith(".md")):
        with open(os.path.join(sdd_dir, name), encoding="utf-8") as f:
            body = [re.sub(r"<!--.*?-->", "", l) for l in strip_code(f.readlines())]
        for line in body:
            for key, uc, target in KEYED_LINK.findall(line):
                keyed[name] += 1
                resolved = os.path.normpath(os.path.join(sdd_dir, target.split("#")[0]))
                if not unreadable:
                    if key not in keys:
                        problems.append((name, f"{key}/{uc}", "key not in register"))
                        continue
                    if not resolved.startswith(keys[key][2]):
                        problems.append((name, f"{key}/{uc}", f"links outside {os.path.basename(keys[key][2])}"))
                file_part, _, anchor = target.partition("#")
                if not os.path.isfile(resolved):
                    problems.append((name, f"{key}/{uc}", "file missing"))
                elif anchor and anchor not in anchors(resolved):
                    problems.append((name, f"{key}/{uc}", "anchor missing"))
            for uc, target in UNKEYED_LINK.findall(line):
                unkeyed[name] += 1
                problems.append((name, uc, "UC link without BRD key"))
            without = LINK.sub("", line)
            for m in BARE.findall(without):
                bare[name] += 1
    if unreadable and sum(keyed.values()):
        problems.insert(0, ("00-cover-and-changelog.md", "Source BRDs", f"cannot read the Source BRDs register: {unreadable}; "
                                                                        f"{sum(keyed.values())} keyed UC links were not checked against it"))
    print("Per file: keyed links / unkeyed links / bare mentions")
    for name in sorted(set(keyed) | set(unkeyed) | set(bare)):
        print(f"  {name}: {keyed[name]} / {unkeyed[name]} / {bare[name]}")
    print(f"Problems: {len(problems)}")
    for p in problems[:40]:
        print("  ", p)


if __name__ == "__main__":
    main(sys.argv[1])
