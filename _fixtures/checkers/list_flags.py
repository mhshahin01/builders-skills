import os, re, sys

LLD = sys.argv[1]
rows = []
for dp, _, fs in os.walk(LLD):
    for fn in sorted(fs):
        if not fn.endswith(".md") or fn.startswith("18-") or fn.startswith("15-"):
            continue
        p = os.path.relpath(os.path.join(dp, fn), LLD).replace(os.sep, "/")
        h2 = h3 = ""
        inc = False
        with open(os.path.join(dp, fn), encoding="utf-8") as f:
            for ln, l in enumerate(f, 1):
                if l.lstrip().startswith("```"):
                    inc = not inc
                    continue
                if inc:
                    continue
                m = re.match(r"^(#{1,4}) (.*)", l)
                if m:
                    if len(m.group(1)) <= 2:
                        h2, h3 = m.group(2), ""
                    else:
                        h3 = m.group(2)
                if l.startswith("> Confirm:") or l.startswith("> TODO:"):
                    kind = "C" if l.startswith("> Confirm:") else "T"
                    rows.append((kind, p, ln, h2, h3, l.strip()[:150]))
for k in "TC":
    sel = [r for r in rows if r[0] == k]
    print("=====", k, len(sel))
    for r in sel:
        print(f"{r[1]}:{r[2]} | {r[3]} | {r[4]} | {r[5]}")
