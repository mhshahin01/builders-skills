import os, re, sys

LLD = sys.argv[1]

# Folder kind, told by the master file name first, then the folder name prefix.
def folder_kind(d):
    names = [f for f in os.listdir(d) if f.endswith(".md")]
    if any(f.endswith("-sdd-master.md") for f in names) or os.path.basename(os.path.normpath(d)).startswith("sdd-"):
        return "sdd"
    if any(f.endswith("-lld-master.md") for f in names) or os.path.basename(os.path.normpath(d)).startswith("lld-"):
        return "lld"
    return "other"

KIND = folder_kind(LLD)
# Size-cap exemptions, one place per folder kind (sdd-unifier / lld-unifier mermaid-diagrams.md):
# which dialects never hit the ~30-line guideline, and under which numbered sections, an unnumbered sub-heading staying inside the section above it (SDD: the §8.3, §8.6, §8.7 and §24.3 layered views; LLD: the §6.1 Component Topology layered view).
UNCAPPED_KINDS = {"sdd": {"erDiagram"}, "lld": {"erDiagram"}, "other": set()}
UNCAPPED_HEADS = {"sdd": re.compile(r"^#{1,6}\s*(?:8\.3|8\.6|8\.7|24\.3)\b"), "lld": re.compile(r"^#{1,6}\s*6\.1\b"), "other": None}
issues = []
count = 0
for dp, _, fs in os.walk(LLD):
    for fn in sorted(fs):
        if not fn.endswith(".md"):
            continue
        p = os.path.join(dp, fn)
        lines = open(p, encoding="utf-8").read().splitlines()
        i = 0
        head = ""
        section = ""
        section_depth = 0
        fenced = None
        while i < len(lines):
            heading = re.match(r"^(#{1,6})\s+(\S*)", lines[i])
            fence = re.match(r"^ {0,3}(`{3,}|~{3,})(.*)$", lines[i])
            if heading and not fenced:
                head = lines[i]
                if re.match(r"\d+(?:\.\d+)*\b", heading.group(2)):
                    section, section_depth = lines[i], len(heading.group(1))
                elif len(heading.group(1)) <= section_depth:
                    section, section_depth = "", 0
            elif fence and lines[i].strip() != "```mermaid":
                if fenced is None:
                    if not (fence.group(1)[0] == "`" and "`" in fence.group(2)):
                        fenced = fence.group(1)
                elif fence.group(1)[0] == fenced[0] and len(fence.group(1)) >= len(fenced) and not fence.group(2).strip():
                    fenced = None
            if lines[i].strip() == "```mermaid":
                j = i + 1
                block = []
                while j < len(lines) and lines[j].strip() != "```":
                    block.append(lines[j]); j += 1
                count += 1
                kind = block[0].strip().split()[0] if block else ""
                where = f"{os.path.relpath(p, LLD)}:{i+1} ({kind})"
                # SDD caps workflows and sequences, not context or other architecture views.
                capped = KIND != "sdd" or kind == "sequenceDiagram" or bool(re.search(r"\b8\.4(?:\.|\b)|\bWorkflow\b", head, re.I))
                if capped and len(block) > 34 and kind not in UNCAPPED_KINDS[KIND] and not (UNCAPPED_HEADS[KIND] and UNCAPPED_HEADS[KIND].match(section)):
                    issues.append(f"{where}: {len(block)} lines (guideline ~30)")
                if kind == "sequenceDiagram":
                    depth = 0
                    for b in block[1:]:
                        s = b.strip()
                        w = s.split(" ", 1)[0] if s else ""
                        if w in ("alt", "opt", "loop", "par", "critical", "rect"):
                            depth += 1
                        elif w == "end":
                            depth -= 1
                        if ";" in s or "#" in s:
                            issues.append(f"{where}: ';' or '#' in: {s}")
                        if re.match(r"^[A-Za-z0-9_]+\s*(->>|-->>|-\)|--\)|-x|--x|->|-->)", s) and ":" not in s:
                            issues.append(f"{where}: message without text: {s}")
                    if depth != 0:
                        issues.append(f"{where}: unbalanced alt/end ({depth})")
                if kind == "classDiagram":
                    txt = "\n".join(block)
                    if txt.count("{") != txt.count("}"):
                        issues.append(f"{where}: unbalanced braces")
                if kind == "erDiagram":
                    opens = sum(1 for b in block if re.match(r"^\s*[\w\"-]+\s*\{\s*$", b))
                    closes = sum(1 for b in block if re.match(r"^\s*\}\s*$", b))
                    if opens != closes:
                        issues.append(f"{where}: unbalanced entity braces ({opens} open, {closes} close)")
                if kind in ("graph", "flowchart"):
                    for b in block[1:]:
                        for lab in re.findall(r"\[([^\]\"]*)\]", b):
                            if lab.startswith("(") and lab.endswith(")"):
                                lab = lab[1:-1]
                            if any(c in lab for c in "(){}"):
                                issues.append(f"{where}: unquoted special chars in label [{lab}]")
                if kind == "stateDiagram-v2":
                    for b in block[1:]:
                        s = b.strip()
                        if "-->" in s and s.count(":") > 1:
                            issues.append(f"{where}: extra ':' in transition label: {s}")
                i = j
            i += 1
print("mermaid blocks:", count)
print("issues:", len(issues))
for x in issues:
    print(" -", x)
