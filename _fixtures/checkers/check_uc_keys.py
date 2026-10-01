import os
import re
import sys
from collections import Counter

from check_uc_links import LINK, anchors, strip_code

KEYED_LINK = re.compile(r"\[(?:\*\*)?([A-Z][A-Z0-9-]*)/(UC-\d{2,})[^\]]*\]\(([^)\s]+)\)")
UNKEYED_LINK = re.compile(r"\[(?:\*\*)?(UC-\d{2,})[^\]]*\]\(([^)\s]+)\)")
BARE = re.compile(r"(?<![\w/\[-])([A-Z][A-Z0-9-]*/UC-\d{2,}|UC-\d{2,})")
ROW = re.compile(r"^\|\s*([A-Z][A-Z0-9-]*)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\(([^)\s]+)\)")


def register(sdd_dir):
    keys = {}
    path = os.path.join(sdd_dir, "00-cover-and-changelog.md")
    with open(path, encoding="utf-8") as f:
        text = f.read()
    section = text.split("### Source BRDs", 1)[-1].split("###", 1)[0]
    for line in section.splitlines():
        m = ROW.match(line.strip())
        if m and m.group(1) not in ("KEY",):
            target = os.path.normpath(os.path.join(sdd_dir, m.group(4)))
            keys[m.group(1)] = (m.group(2), m.group(3), os.path.dirname(target))
    return keys, text


def main(sdd_dir):
    sdd_dir = os.path.abspath(sdd_dir)
    keys, cover = register(sdd_dir)
    print("Register:")
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
                if key not in keys:
                    problems.append((name, f"{key}/{uc}", "key not in register"))
                    continue
                resolved = os.path.normpath(os.path.join(sdd_dir, target.split("#")[0]))
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
    print("Per file: keyed links / unkeyed links / bare mentions")
    for name in sorted(set(keyed) | set(unkeyed) | set(bare)):
        print(f"  {name}: {keyed[name]} / {unkeyed[name]} / {bare[name]}")
    print(f"Problems: {len(problems)}")
    for p in problems[:40]:
        print("  ", p)


if __name__ == "__main__":
    main(sys.argv[1])
