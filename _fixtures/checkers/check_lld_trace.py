"""Check an LLD output for use-case traceability.

Usage: python check_lld_trace.py <lld_dir> <sdd_dir> KEY=<brd_dir> [KEY=<brd_dir> ...] [--json out.json]

Checks every relative Markdown link (file exists, anchor matches a real heading built with
GitHub's rules, duplicate headings suffixed -1, -2), every BRD ID's key, and counts the
traceability surfaces.
"""
import json
import os
import re
import sys
import unicodedata
from collections import Counter

LINK = re.compile(r"\[((?:[^\[\]]|\[[^\]]*\])*)\]\(([^)\s]+)\)")
HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
INLINE_CODE = re.compile(r"`[^`]*`")
COMMENT = re.compile(r"<!--.*?-->", re.S)
ID_CORE = r"(?:UC-\d{2,}|TC-[A-Z]{3}-\d{2,}|SCR-\d{2,}|MK-\d{2,}|LP-\d{2,}|NFR-\d{2,})"
ID_ANY = re.compile(r"(?<![A-Za-z0-9_-])((?:[A-Z][A-Z-]*[A-Z]/)?)(" + ID_CORE + r")(?![A-Za-z0-9])")


def slug(text):
    text = text.strip().lower()
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = text.replace("`", "")
    kept = []
    for ch in text:
        cat = unicodedata.category(ch)
        if ch in " -_" or cat[0] in ("L", "N") or cat == "Mn":
            kept.append(ch)
    return "".join(kept).replace(" ", "-")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def heading_anchors(path):
    seen = Counter()
    result = set()
    in_code = False
    for line in read(path).splitlines():
        if line.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = HEADING.match(line)
        if m:
            s = slug(m.group(2))
            n = seen[s]
            result.add(s if n == 0 else f"{s}-{n}")
            seen[s] += 1
    return result


def prose_lines(text):
    """Lines outside code fences, with HTML comments removed."""
    text = COMMENT.sub("", text)
    in_code = False
    for line in text.splitlines():
        if line.strip().startswith("```"):
            in_code = not in_code
            continue
        if not in_code:
            yield line


def md_files(root):
    for dirpath, _, names in os.walk(root):
        for n in sorted(names):
            if n.endswith(".md"):
                yield os.path.join(dirpath, n)


def section(text, heading_regex):
    lines = text.splitlines()
    out, on, level = [], False, 0
    for line in lines:
        m = HEADING.match(line)
        if m:
            if on and len(m.group(1)) <= level:
                break
            if re.search(heading_regex, line):
                on, level = True, len(m.group(1))
                continue
        if on:
            out.append(line)
    return out


def table_rows(lines):
    rows = [l for l in lines if l.strip().startswith("|")]
    return [r for r in rows[2:]] if len(rows) >= 2 else []


def register_keys(sdd_dir):
    c00 = os.path.join(sdd_dir, "00-cover-and-changelog.md")
    keys = []
    if os.path.isfile(c00):
        rows = table_rows(section(read(c00), r"Source BRDs"))
        for r in rows:
            cells = [c.strip() for c in r.strip().strip("|").split("|")]
            if cells and re.fullmatch(r"[A-Z][A-Z-]*", cells[0]):
                keys.append(cells[0])
    return keys


def child_llds(sdd_dir):
    c00 = os.path.join(sdd_dir, "00-cover-and-changelog.md")
    if not os.path.isfile(c00):
        return []
    return [r.strip() for r in table_rows(section(read(c00), r"Child LLDs"))]


def brd_ids(brd_dir):
    ids = set()
    for p in md_files(brd_dir):
        for m in re.finditer(ID_CORE, read(p)):
            ids.add(m.group(0))
    return ids


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--json")]
    json_out = None
    if "--json" in sys.argv:
        json_out = sys.argv[sys.argv.index("--json") + 1]
        args = [a for a in args if a != json_out]
    lld_dir, sdd_dir = os.path.abspath(args[0]), os.path.abspath(args[1])
    brds = {}
    for a in args[2:]:
        k, _, d = a.partition("=")
        brds[k] = os.path.abspath(d)
    keys = register_keys(sdd_dir)
    known = {k: brd_ids(d) for k, d in brds.items()}

    cache = {}
    stats = Counter()
    broken = []
    unkeyed = []
    unknown_ids = []
    ranges = []
    uc_blocks = []
    for path in md_files(lld_dir):
        rel = os.path.relpath(path, lld_dir)
        text = read(path)
        # IDs and keys: whole text, comments removed (code fences included: route data, tags)
        for line in COMMENT.sub("", text).splitlines():
            if re.search(r"TC-[A-Z]{3}-\d{2}\.\.", line):
                ranges.append((rel, line.strip()[:120]))
            for m in ID_ANY.finditer(line):
                prefix, ident = m.group(1), m.group(2)
                start = m.start()
                before = line[max(0, start - 12):start]
                if not prefix:
                    if re.search(r"Merged into\s*$", before):
                        stats["merged_status_plain"] += 1
                        continue
                    unkeyed.append((rel, ident, line.strip()[:120]))
                    continue
                key = prefix[:-1]
                stats["keyed_ids"] += 1
                if keys and key not in keys:
                    unknown_ids.append((rel, prefix + ident, "key not in register"))
                elif key in known and ident not in known[key]:
                    unknown_ids.append((rel, prefix + ident, "ID not in that BRD"))
        # Links: prose only (no code fences, comments, or inline code)
        for line in prose_lines(text):
            line = INLINE_CODE.sub("", line)
            for label, target in LINK.findall(line):
                if target.startswith(("http://", "https://", "mailto:")):
                    stats["external_links"] += 1
                    continue
                file_part, _, anchor = target.partition("#")
                resolved = path if file_part == "" else os.path.normpath(os.path.join(os.path.dirname(path), file_part))
                kind = "internal"
                low = resolved.replace("\\", "/").lower()
                if "/brd-" in low:
                    kind = "brd"
                elif "/sdd-" in low:
                    kind = "sdd"
                stats[f"links_{kind}"] += 1
                if not os.path.isfile(resolved):
                    broken.append((rel, label, target, "file missing"))
                    continue
                if anchor:
                    if resolved not in cache:
                        cache[resolved] = heading_anchors(resolved)
                    if anchor not in cache[resolved]:
                        broken.append((rel, label, target, "anchor missing"))
                        continue
                stats[f"links_{kind}_ok"] += 1
        for line in prose_lines(text):
            if re.match(r"^#{3,4}\s+(?:[A-Z][A-Z-]*/)?UC-\d+:", line):
                uc_blocks.append((rel, line.strip()))
            if re.match(r"^#{3,4}\s+Participates in ", line):
                stats["participates_blocks"] += 1
            if line.startswith("> **Traceability:**"):
                stats["traceability_lines"] += 1
            if re.match(r"^#{3,4}\s+Workflow:", line):
                stats["workflow_no_uc_blocks"] += 1
            stats["confirm_flags"] += line.count("> Confirm:")
            stats["todo_flags"] += line.count("> TODO:")
            stats["pending_brd16"] += line.count("Pending (BRD 16 not written)")
            stats["platform_pages"] += line.count("None - platform page")
        stats["use_case_mentions"] += len(re.findall(r"use_case", text))
        stats["usecase_annotations"] += len(re.findall(r"@UseCase\(", text))
        stats["e2e_tags"] += len(re.findall(r"@(?:[A-Z][A-Z-]*/)?(?:UC|TC)-", text))

    # Surfaces
    master = [p for p in os.listdir(lld_dir) if p.endswith("-lld-master.md") or p == "lld-master.md"]
    refs = os.path.join(lld_dir, "16-references.md")
    idx_rows = table_rows(section(read(refs), r"19\.9")) if os.path.isfile(refs) else []
    front = os.path.join(lld_dir, "14-frontend.md")
    route_rows = table_rows(section(read(front), r"17\.3")) if os.path.isfile(front) else []
    test = os.path.join(lld_dir, "13-testing.md")
    spec_rows = table_rows(section(read(test), r"16\.8")) if os.path.isfile(test) else []

    result = {
        "lld_dir": lld_dir,
        "master_files": master,
        "register_keys": keys,
        "uc_blocks": len(uc_blocks),
        "uc_block_headings": [h for _, h in uc_blocks],
        "index_rows_19_9": len(idx_rows),
        "route_rows_17_3": len(route_rows),
        "route_header_cols": (section(read(front), r"17\.3")[2] if os.path.isfile(front) and len(section(read(front), r"17\.3")) > 2 else ""),
        "spec_rows_16_8": len(spec_rows),
        "broken_links": broken,
        "unkeyed_ids": unkeyed,
        "unknown_ids": unknown_ids,
        "tc_ranges": ranges,
        "child_llds_rows_in_sdd": child_llds(sdd_dir),
        **{k: v for k, v in sorted(stats.items())},
    }
    for k in ("broken_links", "unkeyed_ids", "unknown_ids", "tc_ranges"):
        print(f"{k}: {len(result[k])}")
        for item in result[k][:40]:
            print("   ", item)
    for k, v in result.items():
        if k not in ("broken_links", "unkeyed_ids", "unknown_ids", "tc_ranges"):
            print(f"{k}: {v}")
    if json_out:
        with open(json_out, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)


if __name__ == "__main__":
    main()
