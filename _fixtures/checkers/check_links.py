import os, re, sys, unicodedata

ROOT = sys.argv[1]
LLD = os.path.join(ROOT, "lld-refunds-platform")

link_re = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")
heading_re = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")

def slugify(text):
    # strip inline markdown links to their text
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = text.strip().lower()
    out = []
    for ch in text:
        if ch.isalnum() or ch in (" ", "-", "_"):
            out.append(ch)
    s = "".join(out).replace(" ", "-")
    return s

anchor_cache = {}
def anchors(path):
    if path in anchor_cache:
        return anchor_cache[path]
    seen = {}
    result = set()
    in_code = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            if line.lstrip().startswith("```"):
                in_code = not in_code
                continue
            if in_code:
                continue
            m = heading_re.match(line.rstrip("\n"))
            if not m:
                continue
            base = slugify(m.group(2))
            if base in seen:
                seen[base] += 1
                slug = f"{base}-{seen[base]}"
            else:
                seen[base] = 0
                slug = base
            result.add(slug)
    anchor_cache[path] = result
    return result

total = 0
bad = []
for dirpath, _, files in os.walk(LLD):
    for fn in files:
        if not fn.endswith(".md"):
            continue
        p = os.path.join(dirpath, fn)
        in_code = False
        with open(p, encoding="utf-8") as f:
            for ln, line in enumerate(f, 1):
                if line.lstrip().startswith("```"):
                    in_code = not in_code
                    continue
                if in_code:
                    continue
                for m in link_re.finditer(line):
                    target = m.group(2)
                    if target.startswith("http://") or target.startswith("https://") or target.startswith("mailto:"):
                        continue
                    total += 1
                    if "#" in target:
                        fpart, anc = target.split("#", 1)
                    else:
                        fpart, anc = target, None
                    tpath = p if fpart == "" else os.path.normpath(os.path.join(dirpath, fpart))
                    if os.path.isdir(tpath):
                        if anc:
                            bad.append((p, ln, target, "anchor on directory"))
                        continue
                    if not os.path.exists(tpath):
                        bad.append((p, ln, target, "missing file"))
                        continue
                    if anc and anc not in anchors(tpath):
                        bad.append((p, ln, target, "missing anchor"))

print("links checked:", total)
print("broken:", len(bad))
for b in bad:
    print(os.path.relpath(b[0], ROOT), b[1], b[2], b[3])
