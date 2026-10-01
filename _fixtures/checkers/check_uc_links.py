import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict

LINK = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")
HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
UC_BARE = re.compile(r"(?<![\[\w-])(UC-\d{2,})(?![\w])")
UC_LINKED = re.compile(r"\[(UC-\d{2,})[^\]]*\]\(")


def slug(text):
    text = re.sub(r"`", "", text.strip().lower())
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    kept = []
    for ch in text:
        cat = unicodedata.category(ch)
        if ch in " -_" or cat[0] in ("L", "N") or cat == "Mn":
            kept.append(ch)
    return "".join(kept).replace(" ", "-")


def anchors(path):
    seen = Counter()
    result = set()
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
                s = slug(m.group(2))
                n = seen[s]
                result.add(s if n == 0 else f"{s}-{n}")
                seen[s] += 1
    return result


def strip_code(lines):
    in_code = False
    for line in lines:
        if line.strip().startswith("```"):
            in_code = not in_code
            continue
        if not in_code:
            yield line


def main(sdd_dir):
    sdd_dir = os.path.abspath(sdd_dir)
    files = sorted(f for f in os.listdir(sdd_dir) if f.endswith(".md"))
    cache = {}
    broken = []
    ok_brd = 0
    ok_internal = 0
    file_only_brd = 0
    linked = Counter()
    bare = Counter()
    for name in files:
        path = os.path.join(sdd_dir, name)
        with open(path, encoding="utf-8") as f:
            lines = f.readlines()
        body = list(strip_code(lines))
        for line in body:
            no_comments = re.sub(r"<!--.*?-->", "", line)
            linked[name] += len(UC_LINKED.findall(no_comments))
            without_links = LINK.sub(lambda m: "", no_comments)
            bare[name] += len(UC_BARE.findall(without_links))
            for text, target in LINK.findall(no_comments):
                if target.startswith(("http://", "https://", "mailto:")):
                    continue
                file_part, _, anchor = target.partition("#")
                if file_part == "":
                    resolved = path
                else:
                    resolved = os.path.normpath(os.path.join(sdd_dir, file_part))
                is_brd = os.path.relpath(resolved, sdd_dir).startswith("..")
                if not os.path.isfile(resolved):
                    broken.append((name, text, target, "file missing"))
                    continue
                if not anchor:
                    if is_brd and text.startswith("UC-"):
                        file_only_brd += 1
                    continue
                if resolved not in cache:
                    cache[resolved] = anchors(resolved)
                if anchor not in cache[resolved]:
                    broken.append((name, text, target, "anchor missing"))
                    continue
                if is_brd:
                    ok_brd += 1
                else:
                    ok_internal += 1
    print(f"SDD folder: {sdd_dir}")
    print(f"Resolved links into the BRD (file + anchor): {ok_brd}")
    print(f"Resolved internal links with anchors: {ok_internal}")
    print(f"UC links to a BRD file with no anchor: {file_only_brd}")
    print(f"Broken links: {len(broken)}")
    for b in broken:
        print("  BROKEN", b)
    print("UC mentions outside code blocks and comments (linked / bare) per file:")
    for name in files:
        if linked[name] or bare[name]:
            print(f"  {name}: {linked[name]} linked / {bare[name]} bare")
    c03 = os.path.join(sdd_dir, "03-users-and-use-cases.md")
    c09 = os.path.join(sdd_dir, "09-services-summary.md")
    if os.path.isfile(c03):
        with open(c03, encoding="utf-8") as f:
            print("03 has a 7.3 section:", bool(re.search(r"^##\s+7\.3", f.read(), re.M)))
    if os.path.isfile(c09):
        with open(c09, encoding="utf-8") as f:
            print("09 has a 'Use cases (BRD)' column:", "Use cases (BRD)" in f.read())


if __name__ == "__main__":
    main(sys.argv[1])
