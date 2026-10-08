from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest

CHECKERS = Path(__file__).resolve().parents[1]
ROOT = CHECKERS.parents[1]
S3 = ROOT / '_fixtures/scenarios/pre-brd-to-brd'
HEAD = ('| ID | Priority | Kind | Source (chunk / identifier) | Decision or clarification needed | Blocks | Owner | Status |\n'
        '|---|---|---|---|---|---|---|---|\n')


def row(tid='TD-01', kind='Open question', source='[13 / OI-01](./13-open-items-and-clarifications.md)',
        need='Which plan applies?', blocks='UC-01 Main Flow', owner='Recommendation: product manager', status='Open'):
    return f'| {tid} | P1 | {kind} | {source} | {need} | {blocks} | {owner} | {status} |\n'


class CheckTodo(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='check-todo-')
        self.doc = Path(self.tmp.name) / 'brd'
        self.doc.mkdir()

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, name, text):
        (self.doc / name).write_text(text, encoding='utf-8', newline='\n')

    def brd(self, rows, oi_status='Open', files=None):
        self.write('14-todo.md', '# 14. To-do\n\n' + HEAD + ''.join(rows))
        self.write('13-open-items-and-clarifications.md', f'### OI-01: A question\n\n- **Status:** {oi_status}\n')
        for name, text in (files or {}).items():
            self.write(name, text)

    def run_on(self, path):
        p = subprocess.run([sys.executable, '-B', str(CHECKERS / 'check_todo.py'), str(path)],
                           capture_output=True, text=True, encoding='utf-8',
                           env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONHASHSEED': '0'})
        self.assertEqual(p.returncode, 0, p.stderr)
        return p.stdout

    def problems(self, out):
        return int(out.split('problems: ')[1].split('\n')[0])

    def test_register_that_follows_the_template_has_no_problem(self):
        self.brd([row(), row('TD-02', 'Assumption to validate', '[02 / Assumption 1](./02-glossary.md#assumptions)', blocks='10 / NFR-02')],
                 files={'02-glossary.md': '## Assumptions\n\n1. Clinics send by SMS [NEEDS CLARIFICATION: which provider?]\n'})
        out = self.run_on(self.doc)
        self.assertEqual(self.problems(out), 0, out)

    def test_kind_outside_the_three_values_is_a_problem(self):
        self.brd([row(kind='Owner clarification')])
        self.assertIn("TD-01: Kind 'Owner clarification'", self.run_on(self.doc))

    def test_source_that_names_a_chunk_alone_is_a_problem(self):
        self.brd([row(source='[13](./13-open-items-and-clarifications.md)')])
        self.assertIn('names a chunk alone', self.run_on(self.doc))

    def test_generic_blocks_text_is_a_problem(self):
        self.brd([row(f'TD-0{k}', blocks='Linked requirement or outcome') for k in range(1, 5)])
        out = self.run_on(self.doc)
        self.assertIn('Blocks names no use case', out)
        self.assertIn('repeated in 4 of 4 live rows', out)

    def test_objective_and_needed_before_values_count_as_specific(self):
        self.brd([row(), row('TD-02', 'Assumption to validate', '[02 / Dependency 1](./02-glossary.md#dependencies)', blocks='Go-live; the pilot'),
                  row('TD-03', source='[01 / Business Objectives](./01-summary.md#business-objectives)', blocks='Business Objective 5')])
        out = self.run_on(self.doc)
        self.assertEqual(self.problems(out), 0, out)

    def test_resolved_row_needs_no_blocks(self):
        self.brd([row(blocks='-', status='Resolved (02 / Assumption 1)')], oi_status='Accepted - applied')
        out = self.run_on(self.doc)
        self.assertEqual(self.problems(out), 0, out)

    def test_open_item_with_no_row_is_a_problem(self):
        self.brd([row(source='[02 / Assumption 1](./02-glossary.md#assumptions)')])
        self.assertIn('OI-01 is not closed in chunk 13', self.run_on(self.doc))

    def test_pending_item_with_no_row_is_a_problem(self):
        self.brd([row(source='[02 / Assumption 1](./02-glossary.md#assumptions)')], oi_status='Decided - pending application: A')
        self.assertIn('OI-01 is not closed in chunk 13', self.run_on(self.doc))

    def test_closed_item_needs_no_row(self):
        self.brd([row(source='[02 / Assumption 1](./02-glossary.md#assumptions)')], oi_status='Accepted - applied')
        self.assertNotIn('OI-01', self.run_on(self.doc).split('problems:')[1])

    def test_marker_in_a_chunk_no_row_cites_is_a_problem(self):
        self.brd([row()], files={'08-integrations.md': '## Integrations\n\nSMS [NEEDS CLARIFICATION: which provider?]\n'})
        self.assertIn('chunk 08 has 1 clarification marker(s) and no TD row cites it', self.run_on(self.doc))

    def test_marker_inside_a_comment_is_ignored(self):
        self.brd([row()], files={'08-integrations.md': '## Integrations\n\n<!-- write [NEEDS CLARIFICATION: ...] here -->\n'})
        out = self.run_on(self.doc)
        self.assertEqual(self.problems(out), 0, out)

    def test_marker_under_a_use_case_the_source_does_not_name_is_a_note(self):
        self.brd([row(), row('TD-02', source='[06a / UC-01 step 2](./06a-use-cases-owner.md#uc-01)')],
                 files={'06a-use-cases-owner.md': '### UC-02: Send\n\nStep 1 [NEEDS CLARIFICATION: when?]\n'})
        out = self.run_on(self.doc)
        self.assertEqual(self.problems(out), 0, out)
        self.assertIn('a marker under UC-02', out)

    def test_step6_s3_output_shows_its_known_register_defects(self):
        out = self.run_on(S3 / 'rerun-2026-10-07/brd-clinic-reminders')
        self.assertIn("Kind 'Owner clarification'", out)
        self.assertIn('names a chunk alone', out)
        self.assertIn('repeated in 54 of 54 live rows', out)

    def test_step7_s3_output_has_only_the_td88_blocks_cell(self):
        out = self.run_on(S3 / 'rerun-2026-10-07-s7/brd-clinic-reminders')
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn("TD-88: Blocks names no use case, NFR, or chunk section ('decision-log.md')", out)
        self.assertIn('register rows: 92 (84 not resolved)', out)


if __name__ == '__main__':
    unittest.main()
