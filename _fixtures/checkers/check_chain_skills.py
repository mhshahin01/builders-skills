import argparse
import fnmatch
import json
import os
import re
import sys
from collections import Counter
from itertools import zip_longest

from check_lld_trace import LINK, heading_anchors

LIMIT = 1024
PM = "Product Management & Business Development"
SD = "Software Development & Delivery"
ROLES = {
    "pre-brd-unifier": ("Business development", PM),
    "brd-unifier": ("Product manager", PM),
    "business-reviewer-unifier": ("Business owner", PM),
    "pre-sdd-unifier": ("E2E Architect", SD),
    "sdd-unifier": ("Software Architect", SD),
    "lld-unifier": ("Tech Lead", SD),
    "impl-tracker-unifier": ("Developer / software engineer", SD),
    "tutorialize-unifier": ("Mentor / assistant", SD),
}
EXTENSIONS = (".md", ".py", ".mjs", ".js", ".json", ".yaml", ".yml", ".css", ".html", ".txt")
DASHES = (chr(0x2013), chr(0x2014))
FENCE = re.compile(r" {0,3}(`{3,}|~{3,})")
SCHEME = re.compile(r"[A-Za-z][A-Za-z0-9+.-]*:")
BLOCK = re.compile(r">([-+]?)")
DOUBLE_QUOTED = re.compile(r'"((?:[^"\\]|\\.)*)"\s*(?:#.*)?')
SINGLE_QUOTED = re.compile(r"'((?:[^']|'')*)'\s*(?:#.*)?")


def read_lines(path):
    with open(path, "rb") as f:
        text = f.read().decode("utf-8", errors="replace")
    return text.replace("\r\n", "\n").split("\n")


def fence_flags(lines):
    flags = []
    fence = None
    for line in lines:
        if fence is None:
            m = FENCE.match(line)
            fence = m.group(1) if m else None
            flags.append(fence is not None)
            continue
        flags.append(True)
        stripped = line.strip()
        if len(stripped) >= len(fence) and not stripped.strip(fence[0]):
            fence = None
    return flags


def status_section(lines):
    flags = fence_flags(lines)
    start = next((i for i, line in enumerate(lines) if not flags[i] and re.fullmatch(r"## Status board[ \t]*", line)), None)
    if start is None:
        return None
    end = next((i for i in range(start + 1, len(lines)) if not flags[i] and lines[i].startswith("## ")), len(lines))
    return "\n".join(lines[start:end]).rstrip()


def first_difference(a, b):
    pairs = zip_longest(a.split("\n"), b.split("\n"))
    return next(n for n, (x, y) in enumerate(pairs, 1) if x != y)


def role_problem(lines, skill):
    employee, team = ROLES[skill]
    expected = f"You act as the {employee} ({team}) in the unifier company."
    flags = fence_flags(lines)
    found = [line.rstrip() for line, fenced in zip(lines, flags) if not fenced and line.startswith("You act as the ")]
    if not found:
        return f'no role line, expected "{expected}"'
    if len(found) > 1:
        return f"{len(found)} role lines, expected exactly one"
    if found[0] != expected:
        return f'role line reads "{found[0]}", expected "{expected}"'
    return None


def fold(rest, chomp):
    body = []
    for line in rest:
        if line.strip() and line[0] != " ":
            break
        body.append(line)
    first = next((line for line in body if line.strip()), None)
    if first is None:
        return ""
    indent = len(first) - len(first.lstrip(" "))
    lines = []
    for line in body:
        if line.startswith(" " * indent):
            lines.append(line[indent:])
        elif line.strip():
            return None
        else:
            lines.append("")
    trailing = 0
    while lines and lines[-1] == "":
        lines.pop()
        trailing += 1
    text = ""
    gap = 0
    previous = None
    for line in lines:
        if line == "":
            gap += 1
            continue
        if previous is None:
            text = "\n" * gap + line
        elif previous[0] in " \t" or line[0] in " \t":
            text += "\n" * (gap + 1) + line
        elif gap:
            text += "\n" * gap + line
        else:
            text += " " + line
        previous = line
        gap = 0
    if chomp == "-":
        return text
    return text + "\n" * (1 if chomp == "" else 1 + trailing)


def flow(value):
    if value.startswith('"'):
        m = DOUBLE_QUOTED.fullmatch(value)
        if not m:
            return None
        try:
            return json.loads('"' + m.group(1) + '"', strict=False)
        except ValueError:
            return None
    if value.startswith("'"):
        m = SINGLE_QUOTED.fullmatch(value)
        return m.group(1).replace("''", "'") if m else None
    if not value or value[0] in "[]{}&*!|>%@`#," or value[:2].strip() in ("-", "?", ":"):
        return None
    text = re.split(r"\s#", value, maxsplit=1)[0].rstrip()
    return None if ": " in text or text.endswith(":") else text


def description(lines):
    if not lines or lines[0].rstrip() != "---":
        return None, "no front matter"
    end = next((i for i in range(1, len(lines)) if lines[i].rstrip() == "---"), None)
    if end is None:
        return None, "the front matter is not closed"
    front = lines[1:end]
    at = next((i for i, line in enumerate(front) if line.startswith("description:")), None)
    if at is None:
        return None, "no description in the front matter"
    value = front[at][len("description:"):].strip()
    rest = front[at + 1:]
    block = BLOCK.fullmatch(value)
    if block:
        text = fold(rest, block.group(1))
    else:
        following = next((line for line in rest if line.strip()), "")
        text = None if following[:1] in (" ", "\t") else flow(value)
    if text is None:
        return None, 'description not read, use the house form "description: >-"'
    return text, None


def authored(root, patterns):
    found = []
    for skill in ROLES:
        for dirpath, dirnames, filenames in os.walk(os.path.join(root, skill)):
            dirnames.sort()
            for name in sorted(filenames):
                if not name.lower().endswith(EXTENSIONS):
                    continue
                path = os.path.join(dirpath, name)
                rel = os.path.relpath(path, root).replace(os.sep, "/")
                if not any(fnmatch.fnmatchcase(rel, pattern) for pattern in patterns):
                    found.append((rel, path))
    return found


def dash_problem(rel, lines):
    hits = [n for n, line in enumerate(lines, 1) if any(d in line for d in DASHES)]
    if not hits:
        return None
    kinds = " and ".join(f"U+{ord(d):04X}" for d in DASHES if any(d in line for line in lines))
    shown = ", ".join(map(str, hits[:5])) + (", ..." if len(hits) > 5 else "")
    return f"{rel}: {kinds} on {len(hits)} line(s): {shown}"


def readme_problems(root, rel, path, lines, cache):
    problems = []
    for line, fenced in zip(lines, fence_flags(lines)):
        if fenced:
            continue
        for _, target in LINK.findall(line):
            file_part, _, anchor = target.partition("#")
            if SCHEME.match(target) or not anchor or os.path.basename(file_part) != "README.md":
                continue
            readme = os.path.normpath(os.path.join(os.path.dirname(path), file_part))
            shown = os.path.relpath(readme, root).replace(os.sep, "/")
            if not os.path.isfile(readme):
                problems.append(f"{rel}: link {target} points at {shown}, which does not exist")
                continue
            if readme not in cache:
                cache[readme] = heading_anchors(readme)
            if anchor not in cache[readme]:
                problems.append(f"{rel}: link {target} matches no heading in {shown}")
    return problems


def main():
    parser = argparse.ArgumentParser(prog="check_chain_skills.py")
    parser.add_argument("root", metavar="SKILLS_ROOT")
    parser.add_argument("--exclude", metavar="GLOB", nargs="+", action="extend", default=[])
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    root = os.path.abspath(args.root)
    problems = []
    texts = {}
    for skill in ROLES:
        path = os.path.join(root, skill, "SKILL.md")
        texts[skill] = read_lines(path) if os.path.isfile(path) else None
    sections = {skill: status_section(lines) for skill, lines in texts.items() if lines is not None}
    common = Counter(s for s in sections.values() if s is not None).most_common(1)
    reference = common[0][0] if common else None
    owner = next((skill for skill, s in sections.items() if s == reference), None)
    for skill, lines in texts.items():
        rel = f"{skill}/SKILL.md"
        if lines is None:
            problems.append(f"{rel}: file is missing")
            continue
        section = sections[skill]
        if section is None:
            problems.append(f'{rel}: no "## Status board" section')
        elif section != reference:
            problems.append(f'{rel}: "## Status board" section differs from the one in {owner}/SKILL.md, '
                            f"first difference at section line {first_difference(reference, section)}")
        role = role_problem(lines, skill)
        if role:
            problems.append(f"{rel}: {role}")
        text, error = description(lines)
        if error:
            problems.append(f"{rel}: {error}")
        elif len(text) > LIMIT:
            problems.append(f"{rel}: description is {len(text)} characters, the limit is {LIMIT}")
    cache = {}
    for rel, path in authored(root, args.exclude):
        lines = read_lines(path)
        problem = dash_problem(rel, lines)
        if problem:
            problems.append(problem)
        if rel.lower().endswith(".md"):
            problems.extend(readme_problems(root, rel, path, lines, cache))
    for problem in problems:
        print(problem)
    print(f"{len(problems)} problems")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
