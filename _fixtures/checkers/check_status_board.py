import argparse
import os
import re
import sys
from collections import Counter
from datetime import datetime

from check_lld_trace import cells, section, table_rows

BOARD = "unifier-status.md"
RUN_MODES = ("Run mode: solo", "Run mode: team")
EMPLOYEE_HEADER = ["Employee", "Team", "Skill", "Folder", "State", "Version", "Updated (UTC)", "Next step", "Waiting on"]
REQUEST_HEADER = ["ID", "From", "To", "Request", "Why", "Raised (UTC)", "State", "Closed (UTC)", "Link"]
TEMPLATE_EMPLOYEES = ["Business development", "Product manager", "Business owner", "E2E Architect",
                      "Software Architect", "Tech Lead", "Developer / software engineer"]
REQUEST_STATES = ["Open", "Later", "Accepted", "Done", "Declined"]
FIXED_STATES = ("Not started", "Ready for handoff")
STEP_STATES = (re.compile(r"In progress: \S.*"), re.compile(r"Stale: \S.*"), re.compile(r"Done v[0-9]+\.[0-9]+"))
WAITING = re.compile(r"Waiting on: (.+) \((HR-[0-9]{3,})\)")
REQUEST_ID = re.compile(r"HR-([0-9]{3,})")
STAMP = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}")
STATES_HELP = "Not started; In progress: <step>; Waiting on: <employee> (<request ID>); Ready for handoff; Done v<X.Y>; Stale: <reason>"
STAMP_HELP = "YYYY-MM-DD HH:MM, a real UTC date and time"


def read_table(text, heading):
    lines = section(text, rf"^## {heading}\s*$")
    first = next((line for line in lines if line.strip().startswith("|")), None)
    if first is None:
        return None, []
    return cells(first), [cells(row) for row in table_rows(lines)]


def header_problem(heading, header, expected):
    if header is None:
        return f'{heading} table: no table under "## {heading}"'
    if header != expected:
        found = " | ".join(header)
        wanted = " | ".join(expected)
        return f'{heading} table: header reads "| {found} |", expected "| {wanted} |"'
    return None


def stamp_ok(value, unset_allowed):
    if value == "-":
        return unset_allowed
    if not STAMP.fullmatch(value):
        return False
    try:
        datetime.strptime(value, "%Y-%m-%d %H:%M")
    except ValueError:
        return False
    return True


def state_problem(state, names, ids):
    if state in FIXED_STATES or any(pattern.fullmatch(state) for pattern in STEP_STATES):
        return None
    waiting = WAITING.fullmatch(state)
    if not waiting:
        return f'State "{state}" is not one of: {STATES_HELP}'
    employee, request = waiting.groups()
    if employee not in names:
        return f'State "{state}" names "{employee}", who has no row in the Employees table'
    if request not in ids:
        return f'State "{state}" names {request}, which is not in the Handoff requests table'
    return None


def employee_problems(rows, ids):
    problems = []
    names = Counter(row[0] for row in rows)
    for name in TEMPLATE_EMPLOYEES:
        if name not in names:
            problems.append(f'Employees table: no row for "{name}"')
    for name, count in names.items():
        if count > 1:
            problems.append(f'Employees table: "{name}" has {count} rows, expected one')
    for row in rows:
        where = f'Employees table: "{row[0]}"'
        if len(row) != len(EMPLOYEE_HEADER):
            problems.append(f"{where} has {len(row)} cells, expected {len(EMPLOYEE_HEADER)}")
            continue
        if not row[0]:
            problems.append("Employees table: a row has no Employee name")
        problem = state_problem(row[4], names, ids)
        if problem:
            problems.append(f"{where}: {problem}")
        if not stamp_ok(row[6], True):
            problems.append(f'{where}: Updated (UTC) "{row[6]}" is not {STAMP_HELP}, or -')
    return problems


def request_problems(rows):
    problems = []
    seen = set()
    last = None
    for row in rows:
        where = f"Handoff requests table: {row[0] or 'a row'}"
        if len(row) != len(REQUEST_HEADER):
            problems.append(f"{where} has {len(row)} cells, expected {len(REQUEST_HEADER)}")
            continue
        match = REQUEST_ID.fullmatch(row[0])
        if not match:
            problems.append(f'{where}: ID "{row[0]}" is not of the form HR-NNN (three or more digits)')
        elif row[0] in seen:
            problems.append(f"{where}: ID appears twice")
        else:
            number = int(match.group(1))
            if last is not None and number <= last[0]:
                problems.append(f"{where}: ID comes after {last[1]}, IDs must increase down the table")
            seen.add(row[0])
            last = (number, row[0])
        if row[6] not in REQUEST_STATES:
            problems.append(f'{where}: State "{row[6]}" is not one of: {", ".join(REQUEST_STATES)}')
        if not stamp_ok(row[5], False):
            problems.append(f'{where}: Raised (UTC) "{row[5]}" is not {STAMP_HELP}')
        if not stamp_ok(row[7], True):
            problems.append(f'{where}: Closed (UTC) "{row[7]}" is not {STAMP_HELP}, or -')
    return problems


def check(text):
    problems = []
    modes = [line.rstrip() for line in text.splitlines() if line.startswith("Run mode:")]
    if not modes:
        problems.append('no Run mode line, expected "Run mode: solo" or "Run mode: team"')
    elif len(modes) > 1:
        problems.append(f"{len(modes)} Run mode lines, expected one")
    elif modes[0] not in RUN_MODES:
        problems.append(f'Run mode line reads "{modes[0]}", expected "Run mode: solo" or "Run mode: team"')
    employee_header, employees = read_table(text, "Employees")
    request_header, requests = read_table(text, "Handoff requests")
    for heading, header, expected in (("Employees", employee_header, EMPLOYEE_HEADER),
                                      ("Handoff requests", request_header, REQUEST_HEADER)):
        problem = header_problem(heading, header, expected)
        if problem:
            problems.append(problem)
    ids = {row[0] for row in requests}
    if employee_header is not None:
        problems.extend(employee_problems(employees, ids))
    if request_header is not None:
        problems.extend(request_problems(requests))
    return problems


def main():
    parser = argparse.ArgumentParser(prog="check_status_board.py")
    parser.add_argument("root", metavar="ROOT")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    path = os.path.join(args.root, BOARD)
    if os.path.isfile(path):
        with open(path, "rb") as f:
            problems = check(f.read().decode("utf-8", errors="replace"))
    else:
        problems = ["not found"]
    for problem in problems:
        print(f"{BOARD}: {problem}")
    print(f"{len(problems)} problems")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
