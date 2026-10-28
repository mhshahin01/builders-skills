from pathlib import Path
import os
import re
import subprocess
import sys
import tempfile
import unittest

CHECKERS = Path(__file__).resolve().parents[1]
PM = 'Product Management & Business Development'
SD = 'Software Development & Delivery'
EMPLOYEES = [
    ('Business development', PM, 'pre-brd-unifier'),
    ('Product manager', PM, 'brd-unifier'),
    ('Business owner', PM, 'business-reviewer-unifier'),
    ('E2E Architect', SD, 'pre-sdd-unifier'),
    ('Software Architect', SD, 'sdd-unifier'),
    ('Tech Lead', SD, 'lld-unifier'),
    ('Developer / software engineer', SD, 'impl-tracker-unifier'),
]
EMPLOYEE_HEAD = '| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |'
REQUEST_HEAD = '| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |'
RULE = '|---|---|---|---|---|---|---|---|---|'
ARABIC_DIGITS = {ord(d): chr(0x0660 + int(d)) for d in '0123456789'}
TEMPLATE = '''# Unifier status board

Run mode: solo

## Employees

| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |
|---|---|---|---|---|---|---|---|---|
| Business development | Product Management & Business Development | pre-brd-unifier | - | Not started | - | - | - | - |
| Product manager | Product Management & Business Development | brd-unifier | - | Not started | - | - | - | - |
| Business owner | Product Management & Business Development | business-reviewer-unifier | - | Not started | - | - | - | - |
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | - | Not started | - | - | - | - |
| Software Architect | Software Development & Delivery | sdd-unifier | - | Not started | - | - | - | - |
| Tech Lead | Software Development & Delivery | lld-unifier | - | Not started | - | - | - | - |
| Developer / software engineer | Software Development & Delivery | impl-tracker-unifier | - | Not started | - | - | - | - |

## Handoff requests

| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |
|---|---|---|---|---|---|---|---|---|
'''


def employee_row(name, team, skill, state='Not started', updated='-', waiting='-'):
    return f'| {name} | {team} | {skill} | - | {state} | - | {updated} | - | {waiting} |'


def request_row(rid='HR-001', state='Open', raised='2026-10-25 09:30', closed='-'):
    return (f'| {rid} | Product manager | E2E Architect | Hand-off: BRD is ready | Next hop in the chain '
            f'| {raised} | {state} | {closed} | - |')


def board(changes=None, skip=(), extra=(), requests=(), mode='Run mode: solo',
          employee_head=EMPLOYEE_HEAD, request_head=REQUEST_HEAD):
    changes = changes or {}
    rows = [employee_row(n, t, s, **changes.get(n, {})) for n, t, s in EMPLOYEES if n not in skip]
    lines = ['# Unifier status board', '']
    if mode is not None:
        lines += [mode, '']
    lines += ['## Employees', '', employee_head, RULE, *rows, *extra, '',
              '## Handoff requests', '', request_head, RULE, *requests]
    return '\n'.join(lines) + '\n'


class CheckStatusBoard(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='check-status-board-')
        self.root = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, text, newline='\n'):
        (self.root / 'unifier-status.md').write_text(text, encoding='utf-8', newline=newline)

    def check(self, text=None):
        if text is not None:
            self.write(text)
        p = subprocess.run([sys.executable, '-B', str(CHECKERS / 'check_status_board.py'), str(self.root)],
                           capture_output=True, text=True, encoding='utf-8',
                           env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONHASHSEED': '0'})
        shown = p.stdout + p.stderr
        lines = p.stdout.splitlines()
        self.assertTrue(lines and re.fullmatch(r'\d+ problems', lines[-1]), shown)
        count = int(lines[-1].split()[0])
        self.assertEqual(len(lines) - 1, count, shown)
        self.assertEqual(p.returncode, 1 if count else 0, shown)
        return lines[:-1]

    def only(self, found, *fragments):
        self.assertEqual(len(found), 1, found)
        self.assertTrue(found[0].startswith('unifier-status.md:'), found)
        for fragment in fragments:
            self.assertIn(fragment, found[0])

    def test_check_board_valid_pass(self):
        changes = {
            'Business development': {'state': 'Done v1.0', 'updated': '2026-10-20 09:15'},
            'Product manager': {'state': 'Ready for handoff', 'updated': '2026-10-21 10:00'},
            'Business owner': {'state': 'Stale: the BRD changed after the review', 'updated': '2026-10-22 11:45'},
            'E2E Architect': {'state': 'In progress: part 2 of 3', 'updated': '2026-10-25 08:05'},
            'Software Architect': {'state': 'Waiting on: E2E Architect (HR-002)', 'updated': '2026-10-25 08:10',
                                   'waiting': 'E2E Architect (HR-002)'},
        }
        requests = [
            request_row('HR-001', 'Done', '2026-10-21 10:05', '2026-10-21 10:30'),
            request_row('HR-002', 'Open'),
            request_row('HR-003', 'Later'),
            request_row('HR-004', 'Accepted'),
            request_row('HR-005', 'Declined', '2026-10-24 17:00', '2026-10-25 09:00'),
        ]
        text = board(changes, requests=requests)
        for state in ('Not started', 'In progress: ', 'Waiting on: ', 'Ready for handoff', 'Done v', 'Stale: '):
            self.assertIn('| ' + state, text)
        for state in ('Open', 'Later', 'Accepted', 'Done', 'Declined'):
            self.assertIn('| ' + state + ' |', text)
        self.assertEqual(self.check(text), [])

    def test_check_board_team_mode_pass(self):
        self.assertEqual(self.check(board(mode='Run mode: team')), [])

    def test_check_template_board_pass(self):
        self.assertEqual(board(), TEMPLATE)
        self.assertEqual(self.check(TEMPLATE), [])

    def test_check_board_crlf_pass(self):
        self.write(board(requests=[request_row()]), newline='\r\n')
        self.assertIn(b'\r\n', (self.root / 'unifier-status.md').read_bytes())
        self.assertEqual(self.check(), [])

    def test_check_future_employee_row_pass(self):
        extra = [employee_row('QA', 'Quality', 'qa-unifier', state='In progress: planning', updated='2026-10-25 09:00')]
        changes = {'Software Architect': {'state': 'Waiting on: QA (HR-001)', 'waiting': 'QA (HR-001)'}}
        self.assertEqual(self.check(board(changes, extra=extra, requests=[request_row('HR-001')])), [])

    def test_check_future_employee_row_invalid_state_problem(self):
        extra = [employee_row('QA', 'Quality', 'qa-unifier', state='Busy')]
        self.only(self.check(board(extra=extra)), 'QA', 'State')

    def test_check_future_employee_row_duplicate_problem(self):
        extra = [employee_row('QA', 'Quality', 'qa-unifier'), employee_row('QA', 'Quality', 'qa-unifier')]
        self.only(self.check(board(extra=extra)), 'QA', '2 rows')

    def test_check_board_missing_problem(self):
        self.only(self.check(), 'unifier-status.md', 'not found')

    def test_check_run_mode_missing_problem(self):
        self.only(self.check(board(mode=None)), 'Run mode')

    def test_check_run_mode_invalid_problem(self):
        for mode in ('Run mode: group', 'Run mode:', 'Run mode: Solo', 'run mode: solo', 'Run mode: solo or team'):
            with self.subTest(mode=mode):
                self.only(self.check(board(mode=mode)), 'Run mode')

    def test_check_run_mode_twice_problem(self):
        self.only(self.check(board(mode='Run mode: solo\n\nRun mode: team')), 'Run mode')

    def test_check_employees_header_differs_problem(self):
        renamed = EMPLOYEE_HEAD.replace('Updated (UTC)', 'Updated')
        swapped = EMPLOYEE_HEAD.replace('State | Version', 'Version | State')
        lowered = EMPLOYEE_HEAD.replace('Next step', 'Next Step')
        for head in (renamed, swapped, lowered):
            with self.subTest(head=head):
                self.only(self.check(board(employee_head=head)), 'Employees', 'header')

    def test_check_requests_header_differs_problem(self):
        renamed = REQUEST_HEAD.replace('Closed (UTC)', 'Closed')
        swapped = REQUEST_HEAD.replace('From | To', 'To | From')
        for head in (renamed, swapped):
            with self.subTest(head=head):
                self.only(self.check(board(request_head=head)), 'Handoff requests', 'header')

    def test_check_employees_table_missing_problem(self):
        self.only(self.check(board().replace('## Employees', '## People')), 'Employees')

    def test_check_requests_table_missing_problem(self):
        self.only(self.check(board().replace('## Handoff requests', '## Requests')), 'Handoff requests')

    def test_check_employee_missing_problem(self):
        self.only(self.check(board(skip=('Tech Lead',))), 'Tech Lead', 'no row')

    def test_check_employee_duplicate_problem(self):
        extra = [employee_row('Tech Lead', SD, 'lld-unifier', state='In progress: step 2')]
        self.only(self.check(board(extra=extra)), 'Tech Lead', '2 rows')

    def test_check_employee_name_empty_problem(self):
        row = employee_row('', SD, 'qa-unifier')
        self.only(self.check(board(extra=[row])), 'no Employee name')

    def test_check_employee_row_cell_count_problem(self):
        short = '| Tech Lead | ' + SD + ' | lld-unifier | - | Not started | - | - | - |'
        self.only(self.check(board(skip=('Tech Lead',), extra=[short])), 'Tech Lead', '8 cells')

    def test_check_employee_state_invalid_problem(self):
        for state in ('Working on it', 'not started', 'Done 1.0', 'Done v1', 'Done v1.0.0', 'In progress:', 'In progress',
                      'Stale:', 'Waiting on: E2E Architect', 'Ready for hand-off', '-', '', 'Done v' + '1.0'.translate(ARABIC_DIGITS)):
            with self.subTest(state=state):
                self.only(self.check(board({'Tech Lead': {'state': state}})), 'Tech Lead', 'State')

    def test_check_employee_state_forms_pass(self):
        for state in ('Not started', 'In progress: drafting chunk 05', 'Ready for handoff', 'Done v1.0', 'Done v12.30',
                      'Stale: the BRD has a new version'):
            with self.subTest(state=state):
                self.assertEqual(self.check(board({'Tech Lead': {'state': state}})), [])

    def test_check_waiting_on_unknown_request_problem(self):
        changes = {'Software Architect': {'state': 'Waiting on: E2E Architect (HR-009)'}}
        self.only(self.check(board(changes, requests=[request_row('HR-001')])), 'Software Architect', 'HR-009')

    def test_check_waiting_on_no_requests_problem(self):
        changes = {'Software Architect': {'state': 'Waiting on: E2E Architect (HR-001)'}}
        self.only(self.check(board(changes)), 'Software Architect', 'HR-001')

    def test_check_waiting_on_unknown_employee_problem(self):
        changes = {'Software Architect': {'state': 'Waiting on: Janitor (HR-001)'}}
        self.only(self.check(board(changes, requests=[request_row('HR-001')])), 'Software Architect', 'Janitor')

    def test_check_waiting_on_known_employee_and_request_pass(self):
        changes = {'Software Architect': {'state': 'Waiting on: Developer / software engineer (HR-001)'}}
        self.assertEqual(self.check(board(changes, requests=[request_row('HR-001')])), [])

    def test_check_request_state_invalid_problem(self):
        for state in ('Pending', 'open', 'Closed', ''):
            with self.subTest(state=state):
                self.only(self.check(board(requests=[request_row('HR-001', state)])), 'HR-001', 'State')

    def test_check_request_id_duplicate_problem(self):
        requests = [request_row('HR-001'), request_row('HR-002'), request_row('HR-002')]
        self.only(self.check(board(requests=requests)), 'HR-002', 'twice')

    def test_check_request_ids_not_increasing_problem(self):
        requests = [request_row('HR-001'), request_row('HR-003'), request_row('HR-002')]
        self.only(self.check(board(requests=requests)), 'HR-002', 'HR-003')

    def test_check_request_ids_equal_number_problem(self):
        requests = [request_row('HR-007'), request_row('HR-0007')]
        self.only(self.check(board(requests=requests)), 'HR-0007', 'HR-007')

    def test_check_request_ids_increase_numerically_pass(self):
        requests = [request_row('HR-001'), request_row('HR-009'), request_row('HR-010'), request_row('HR-999'),
                    request_row('HR-1000')]
        self.assertEqual(self.check(board(requests=requests)), [])

    def test_check_request_id_malformed_problem(self):
        for rid in ('HR-1', 'HR-12', 'REQ-001', 'hr-001', 'HR-0O1', '', 'HR-' + '001'.translate(ARABIC_DIGITS)):
            with self.subTest(rid=rid):
                self.only(self.check(board(requests=[request_row(rid)])), 'ID')

    def test_check_request_row_cell_count_problem(self):
        short = '| HR-001 | Product manager | E2E Architect | Hand-off | Why | 2026-10-25 09:30 | Open | - |'
        self.only(self.check(board(requests=[short])), 'HR-001', '8 cells')

    def test_check_stamp_malformed_problem(self):
        bad = ('2026-10-25T09:30Z', '2026-10-25 09:30:00', '2026-10-25', '25/10/2026 09:30', '2026-10-25 9:30',
               '2026-02-30 10:00', '2026-10-25 24:00', '2026-13-01 10:00', '2026-10-25 09:30 UTC', 'now',
               '2026-10-25 09:30'.translate(ARABIC_DIGITS))
        for stamp in bad:
            with self.subTest(stamp=stamp, column='Updated (UTC)'):
                self.only(self.check(board({'Tech Lead': {'updated': stamp}})), 'Tech Lead', 'Updated (UTC)')
            with self.subTest(stamp=stamp, column='Raised (UTC)'):
                self.only(self.check(board(requests=[request_row('HR-001', raised=stamp)])), 'HR-001', 'Raised (UTC)')
            with self.subTest(stamp=stamp, column='Closed (UTC)'):
                self.only(self.check(board(requests=[request_row('HR-001', 'Done', closed=stamp)])), 'HR-001', 'Closed (UTC)')

    def test_check_stamp_real_date_pass(self):
        requests = [request_row('HR-001', 'Done', '2028-02-29 00:00', '2028-12-31 23:59')]
        self.assertEqual(self.check(board({'Tech Lead': {'updated': '2026-10-25 09:30'}}, requests=requests)), [])
        self.only(self.check(board(requests=[request_row('HR-001', raised='2026-02-29 12:00')])), 'Raised (UTC)')

    def test_check_raised_stamp_not_set_problem(self):
        self.only(self.check(board(requests=[request_row('HR-001', raised='-')])), 'HR-001', 'Raised (UTC)')

    def test_check_unset_stamps_pass(self):
        self.assertEqual(self.check(board({'Tech Lead': {'updated': '-'}}, requests=[request_row('HR-001', closed='-')])), [])

    def test_check_every_problem_names_the_board_problem(self):
        text = board({'Tech Lead': {'state': 'Busy'}}, skip=('Business owner',), mode='Run mode: group',
                     requests=[request_row('HR-002'), request_row('HR-001', 'Pending')])
        found = self.check(text)
        self.assertEqual(len(found), 5, found)
        self.assertTrue(all(line.startswith('unifier-status.md:') for line in found), found)


if __name__ == '__main__':
    unittest.main()
