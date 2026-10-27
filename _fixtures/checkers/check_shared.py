import os
import re
import sys

MARKER = re.compile(r"^<!-- SHARED: ([A-Za-z0-9._-]+) \| HOME: ([a-z0-9-]+) \| COPIES: ([a-z0-9-]+(?:, [a-z0-9-]+)*) \| .* -->$")


def read(path):
    with open(path, "rb") as f:
        return f.read().replace(b"\r\n", b"\n")


def line_one(data):
    return data.split(b"\n", 1)[0].decode("utf-8-sig", "replace")


def first_difference(home, copy):
    home_lines, copy_lines = home.split(b"\n"), copy.split(b"\n")
    for index in range(max(len(home_lines), len(copy_lines))):
        if index >= len(home_lines) or index >= len(copy_lines) or home_lines[index] != copy_lines[index]:
            return index + 1
    return 0


def skill_folders(root):
    return sorted(d for d in os.listdir(root) if os.path.isfile(os.path.join(root, d, "SKILL.md")))


def markdown_paths(base):
    paths = []
    for folder, _, names in os.walk(base):
        paths += [os.path.relpath(os.path.join(folder, n), base).replace(os.sep, "/") for n in names if n.endswith(".md")]
    return sorted(paths)


def load(root, skills):
    return {(skill, rel): read(os.path.join(root, skill, rel)) for skill in skills for rel in markdown_paths(os.path.join(root, skill))}


def find_markers(files):
    markers = {}
    for (skill, rel), data in files.items():
        match = MARKER.match(line_one(data))
        if match:
            markers.setdefault(match.group(1), []).append((skill, rel, match.group(2), match.group(3).split(", ")))
    return markers


def names_file(skill_md, name):
    pattern = r"(?<![A-Za-z0-9._-])" + re.escape(name) + r"(?![A-Za-z0-9_-])"
    return re.search(pattern, skill_md.decode("utf-8", "replace")) is not None


def check_shared(skills, files):
    markers = find_markers(files)
    listing, problems, checked = [], [], 0
    for name in sorted(markers):
        entries = markers[name]
        for skill, rel, _, _ in entries:
            if rel != name:
                problems.append(f"{skill}/{rel}: marker names {name}, not this path")
        reference = next((e for e in entries if e[0] == e[2] and e[1] == name), entries[0])
        home, copies = reference[2], reference[3]
        carriers = list(dict.fromkeys([home] + copies))
        listing.append(f"  {name}: home {home}; copies {', '.join(copies)}")
        home_data = files.get((home, name))
        for carrier in carriers:
            label = f"{carrier}/{name}"
            kind = "home copy" if carrier == home else "copy"
            if carrier not in skills:
                problems.append(f"{label}: missing {kind} (no such skill folder)")
                continue
            data = files.get((carrier, name))
            if data is None:
                problems.append(f"{label}: missing {kind}")
                continue
            checked += 1
            if not MARKER.match(line_one(data)):
                problems.append(f"{label}: no shared marker on line 1")
            elif carrier != home and home_data is not None and data != home_data:
                problems.append(f"{label}: differs from the home copy {home}/{name} at line {first_difference(home_data, data)}")
            if not names_file(files.get((carrier, "SKILL.md"), b""), name):
                problems.append(f"{label}: {carrier}/SKILL.md never names it")
        for skill in skills:
            if skill not in carriers and (skill, name) in files:
                problems.append(f"{skill}/{name}: stray copy, {skill} is not named in the marker")
    return markers, listing, checked, problems


def reference_patterns(skills):
    patterns = {}
    for skill in skills:
        name = re.escape(skill)
        patterns[skill] = [
            re.compile(r"(?:\.\.[/\\])+" + name + r"(?![A-Za-z0-9_-])(?:[/\\][A-Za-z0-9_.-]*)*"),
            re.compile(r"(?<![A-Za-z0-9_.-])" + name + r"[/\\](?:[A-Za-z0-9_.-]+[/\\])*[A-Za-z0-9_.-]*\.[A-Za-z0-9]+"),
            re.compile(r"(?<![A-Za-z0-9_.-])" + name + r":[A-Za-z0-9_./-]*\.md"),
        ]
    return patterns


def line_references(line, patterns, own):
    spans = []
    for skill, regexes in patterns.items():
        if skill == own:
            continue
        for regex in regexes:
            for match in regex.finditer(line):
                text = match.group(0).rstrip(".")
                spans.append((match.start(), match.start() + len(text), text))
    spans.sort()
    references, end = [], 0
    for start, stop, text in spans:
        if start >= end:
            references.append(text)
            end = stop
    return references


def cross_skill_references(skills, files):
    patterns = reference_patterns(skills)
    problems = []
    for (skill, rel), data in files.items():
        marked = MARKER.match(line_one(data)) is not None
        for number, line in enumerate(data.decode("utf-8", "replace").split("\n"), 1):
            if number == 1 and marked:
                continue
            for reference in line_references(line, patterns, skill):
                problems.append(f"{skill}/{rel}:{number}: cross-skill reference {reference}")
    return problems


def main(root):
    skills = skill_folders(root)
    files = load(root, skills)
    markers, listing, checked, problems = check_shared(skills, files)
    problems += cross_skill_references(skills, files)
    print(f"skill folders: {len(skills)}")
    print(f"shared files: {len(markers)}")
    for line in listing:
        print(line)
    print(f"copies checked: {checked}")
    print(f"markdown files scanned: {len(files)}")
    print(f"problems: {len(problems)}")
    for problem in problems:
        print(f" - {problem}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) < 2 or not os.path.isdir(sys.argv[1]):
        print("problems: 1")
        print(" - ROOT is not a folder (usage: check_shared.py ROOT)")
    else:
        main(sys.argv[1])
