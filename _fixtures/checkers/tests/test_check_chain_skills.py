from pathlib import Path
import os
import re
import subprocess
import sys
import tempfile
import textwrap
import unittest

CHECKERS = Path(__file__).resolve().parents[1]
PM = 'Product Management & Business Development'
SD = 'Software Development & Delivery'
ROLES = {
    'pre-brd-unifier': ('Business development', PM),
    'brd-unifier': ('Product manager', PM),
    'business-reviewer-unifier': ('Business owner', PM),
    'pre-sdd-unifier': ('E2E Architect', SD),
    'sdd-unifier': ('Software Architect', SD),
    'lld-unifier': ('Tech Lead', SD),
    'impl-tracker-unifier': ('Developer / software engineer', SD),
    'tutorialize-unifier': ('Mentor / assistant', SD),
}
EM_DASH = '\u2014'
EN_DASH = '\u2013'
TEMPLATE = (
    '```markdown\n'
    '# Unifier status board\n'
    '\n'
    'Run mode: solo\n'
    '\n'
    '## Employees\n'
    '\n'
    '| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |\n'
    '|---|---|---|---|---|---|---|---|---|\n'
    '| Tech Lead | ' + SD + ' | lld-unifier | - | Not started | - | - | - | - |\n'
    '\n'
    '## Handoff requests\n'
    '\n'
    '| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |\n'
    '|---|---|---|---|---|---|---|---|---|\n'
    '```\n'
)
SECTION = '## Status board\n\nThe board is unifier-status.md in the project root.\n\n' + TEMPLATE
TAIL = '## Reference files\n\nNothing here.\n'


def words(n):
    text = ('abcdefghi ' * (n // 10 + 1))[:n]
    return text[:-1] + 'z' if text.endswith(' ') else text


def block(text):
    return '\n'.join('  ' + line for line in textwrap.wrap(text, 80))


def folded(text, indicator='>-'):
    return 'description: ' + indicator + '\n' + block(text) + '\n'


def skill_md(skill, description=None, section=SECTION, role=True):
    employee, team = ROLES[skill]
    if description is None:
        description = folded('Short description of ' + skill + '.')
    role_line = f'You act as the {employee} ({team}) in the unifier company.\n\n' if role else ''
    return (f'---\nname: {skill}\n{description}---\n\n# {skill}\n\nFirst paragraph.\n\n'
            f'{role_line}{section}\n{TAIL}')


class CheckChainSkills(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='check-chain-skills-')
        self.root = Path(self.tmp.name)
        for skill in ROLES:
            self.write(f'{skill}/SKILL.md', skill_md(skill))

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, rel, text, newline='\n'):
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8', newline=newline)

    def read(self, rel):
        return (self.root / rel).read_text(encoding='utf-8')

    def edit(self, rel, old, new):
        text = self.read(rel)
        self.assertIn(old, text)
        self.write(rel, text.replace(old, new))

    def check(self, *extra):
        p = subprocess.run([sys.executable, '-B', str(CHECKERS / 'check_chain_skills.py'), str(self.root), *extra],
                           capture_output=True, text=True, encoding='utf-8',
                           env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONHASHSEED': '0'})
        shown = p.stdout + p.stderr
        lines = p.stdout.splitlines()
        self.assertTrue(lines and re.fullmatch(r'\d+ problems', lines[-1]), shown)
        count = int(lines[-1].split()[0])
        self.assertEqual(len(lines) - 1, count, shown)
        self.assertEqual(p.returncode, 1 if count else 0, shown)
        return lines[:-1]

    def only(self, found, rel, *fragments):
        self.assertEqual(len(found), 1, found)
        self.assertTrue(found[0].startswith(rel + ':'), found)
        for fragment in fragments:
            self.assertIn(fragment, found[0])

    def test_check_identical_sections_pass(self):
        self.assertEqual(self.check(), [])

    def test_check_section_differs_problem(self):
        self.edit('lld-unifier/SKILL.md', 'The board is unifier-status.md', 'The board is kept in unifier-status.md')
        self.only(self.check(), 'lld-unifier/SKILL.md', 'Status board', 'differs', 'the one in pre-brd-unifier/SKILL.md')

    def test_check_section_differs_in_first_file_names_only_that_file_problem(self):
        self.edit('pre-brd-unifier/SKILL.md', 'Run mode: solo', 'Run mode: team')
        self.only(self.check(), 'pre-brd-unifier/SKILL.md', 'differs', 'the one in brd-unifier/SKILL.md')

    def test_check_section_differs_after_subheading_problem(self):
        section = SECTION + '\n### Notes\n\nOne note.\n'
        for skill in ROLES:
            self.write(f'{skill}/SKILL.md', skill_md(skill, section=section))
        self.assertEqual(self.check(), [])
        self.edit('sdd-unifier/SKILL.md', 'One note.', 'Another note.')
        self.only(self.check(), 'sdd-unifier/SKILL.md', 'differs')

    def test_check_section_heading_must_match_exactly_problem(self):
        self.write('sdd-unifier/SKILL.md', skill_md('sdd-unifier', section=SECTION.replace('## Status board', '## Status board and more')))
        self.only(self.check(), 'sdd-unifier/SKILL.md', 'no "## Status board" section')

    def test_check_section_differs_inside_template_problem(self):
        self.edit('sdd-unifier/SKILL.md', '| Tech Lead | ' + SD + ' | lld-unifier | - | Not started',
                  '| Tech Lead | ' + SD + ' | lld-unifier | - | In progress: x')
        self.only(self.check(), 'sdd-unifier/SKILL.md', 'differs')

    def test_check_section_line_endings_ignored_pass(self):
        self.write('brd-unifier/SKILL.md', skill_md('brd-unifier'), newline='\r\n')
        self.assertIn(b'\r\n', (self.root / 'brd-unifier/SKILL.md').read_bytes())
        self.assertEqual(self.check(), [])

    def test_check_section_blank_lines_before_next_heading_ignored_pass(self):
        self.edit('lld-unifier/SKILL.md', '```\n\n## Reference files', '```\n\n\n\n## Reference files')
        self.assertEqual(self.check(), [])

    def test_check_section_last_in_file_pass(self):
        head = skill_md('lld-unifier').split(SECTION)[0]
        self.write('lld-unifier/SKILL.md', head + TAIL + '\n' + SECTION)
        self.assertEqual(self.check(), [])

    def test_check_section_missing_problem(self):
        self.write('impl-tracker-unifier/SKILL.md', skill_md('impl-tracker-unifier', section=''))
        self.only(self.check(), 'impl-tracker-unifier/SKILL.md', 'no "## Status board" section')

    def test_check_section_heading_in_code_fence_not_a_section_problem(self):
        fenced = '```markdown\n## Status board\n\nExample only.\n```\n'
        self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', section=fenced))
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', 'no "## Status board" section')

    def test_check_skill_file_missing_problem(self):
        (self.root / 'pre-sdd-unifier/SKILL.md').unlink()
        self.only(self.check(), 'pre-sdd-unifier/SKILL.md', 'missing')

    def test_check_role_line_missing_problem(self):
        self.write('business-reviewer-unifier/SKILL.md', skill_md('business-reviewer-unifier', role=False))
        self.only(self.check(), 'business-reviewer-unifier/SKILL.md', 'role line')

    def test_check_role_line_wrong_employee_problem(self):
        self.edit('brd-unifier/SKILL.md', 'You act as the Product manager (' + PM + ')',
                  'You act as the Software Architect (' + SD + ')')
        self.only(self.check(), 'brd-unifier/SKILL.md', 'role line',
                  'You act as the Product manager (' + PM + ') in the unifier company.')

    def test_check_role_line_wrong_team_problem(self):
        self.edit('tutorialize-unifier/SKILL.md', 'Mentor / assistant (' + SD + ')', 'Mentor / assistant (' + PM + ')')
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', 'role line')

    def test_check_role_line_twice_problem(self):
        line = 'You act as the Tech Lead (' + SD + ') in the unifier company.\n\n'
        self.edit('lld-unifier/SKILL.md', line, line + line)
        self.only(self.check(), 'lld-unifier/SKILL.md', '2 role lines')

    def test_check_role_line_only_in_code_fence_problem(self):
        line = 'You act as the E2E Architect (' + SD + ') in the unifier company.\n\n'
        self.edit('pre-sdd-unifier/SKILL.md', line, '```\n' + line + '```\n\n')
        self.only(self.check(), 'pre-sdd-unifier/SKILL.md', 'role line')

    def test_check_role_line_only_in_nested_code_fence_problem(self):
        line = 'You act as the E2E Architect (' + SD + ') in the unifier company.\n\n'
        wrappers = {
            'longer outer fence': ('````\n```\n', '```\n````\n'),
            'tilde outer fence': ('~~~\n```\n', '~~~\n'),
            'backtick outer fence': ('```\n~~~\n', '```\n'),
        }
        for name, (opening, closing) in wrappers.items():
            with self.subTest(wrapper=name):
                self.write('pre-sdd-unifier/SKILL.md', skill_md('pre-sdd-unifier'))
                self.edit('pre-sdd-unifier/SKILL.md', line, opening + line + closing + '\n')
                self.only(self.check(), 'pre-sdd-unifier/SKILL.md', 'role line')

    def test_check_role_line_mentioned_in_prose_pass(self):
        self.edit('brd-unifier/SKILL.md', 'First paragraph.', 'First paragraph. Remember that you act as a reviewer, and You act as the owner of a section.')
        self.assertEqual(self.check(), [])

    def test_check_description_too_long_problem(self):
        self.write('sdd-unifier/SKILL.md', skill_md('sdd-unifier', description=folded(words(1025))))
        self.only(self.check(), 'sdd-unifier/SKILL.md', 'description', '1025 characters')

    def test_check_description_at_limit_pass(self):
        self.write('sdd-unifier/SKILL.md', skill_md('sdd-unifier', description=folded(words(1024))))
        self.assertEqual(self.check(), [])

    def test_check_description_counts_characters_not_bytes_pass(self):
        text = ' '.join(['\u00e9' * 9] * 100)
        self.assertGreater(len(text.encode('utf-8')), 1024)
        self.assertLess(len(text), 1024)
        self.write('lld-unifier/SKILL.md', skill_md('lld-unifier', description=folded(text)))
        self.assertEqual(self.check(), [])

    def test_check_description_strip_indicator_drops_final_newline_pass(self):
        self.write('brd-unifier/SKILL.md', skill_md('brd-unifier', description=folded(words(1024), '>-')))
        self.assertEqual(self.check(), [])

    def test_check_description_clip_indicator_keeps_final_newline_problem(self):
        self.write('brd-unifier/SKILL.md', skill_md('brd-unifier', description=folded(words(1024), '>')))
        self.only(self.check(), 'brd-unifier/SKILL.md', '1025 characters')

    def test_check_description_each_blank_line_counts_one_newline_pass(self):
        def paragraphs(second, blanks):
            return 'description: >-\n' + block(words(500)) + '\n' * (blanks + 1) + block(words(second)) + '\n'
        for blanks in (1, 2, 3):
            with self.subTest(blanks=blanks):
                self.write('brd-unifier/SKILL.md', skill_md('brd-unifier', description=paragraphs(524 - blanks, blanks)))
                self.assertEqual(self.check(), [])
                self.write('brd-unifier/SKILL.md', skill_md('brd-unifier', description=paragraphs(525 - blanks, blanks)))
                self.only(self.check(), 'brd-unifier/SKILL.md', '1025 characters')

    def test_check_description_paragraph_lines_join_with_one_space_pass(self):
        def three_lines(last):
            return 'description: >-\n  ' + words(400) + '\n  ' + words(400) + '\n  ' + words(last) + '\n'
        self.write('brd-unifier/SKILL.md', skill_md('brd-unifier', description=three_lines(222)))
        self.assertEqual(self.check(), [])
        self.write('brd-unifier/SKILL.md', skill_md('brd-unifier', description=three_lines(223)))
        self.only(self.check(), 'brd-unifier/SKILL.md', '1025 characters')

    def test_check_description_one_line_forms_pass(self):
        forms = {
            'plain': 'description: ' + words(1024) + '\n',
            'double': 'description: "' + words(1024) + '"\n',
            'single': "description: '" + words(1024) + "'\n",
        }
        for name, description in forms.items():
            with self.subTest(form=name):
                self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', description=description))
                self.assertEqual(self.check(), [])
        self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', description='description: "' + words(1025) + '"\n'))
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', '1025 characters')

    def test_check_description_quoted_escapes_count_once_pass(self):
        def set_description(text):
            self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', description=text))
        set_description('description: "Say \\"hi\\": a\\\\b"\n')
        self.assertEqual(self.check(), [])
        set_description('description: "' + 'x' * 1023 + '\\""\n')
        self.assertEqual(self.check(), [])
        set_description('description: "' + 'x' * 1024 + '\\""\n')
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', '1025 characters')
        set_description("description: '" + 'x' * 1023 + "'''\n")
        self.assertEqual(self.check(), [])
        set_description("description: '" + 'x' * 1024 + "'''\n")
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', '1025 characters')

    def test_check_description_plain_with_colon_space_problem(self):
        self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', description='description: Use it: now\n'))
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', 'not read')

    def test_check_description_plain_starting_with_list_marker_problem(self):
        self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', description='description: - a list entry\n'))
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', 'not read')

    def test_check_description_plain_continued_on_next_line_problem(self):
        self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', description='description: First part\n  and the rest\n'))
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', 'not read')

    def test_check_description_quoted_continued_on_next_line_problem(self):
        self.write('tutorialize-unifier/SKILL.md', skill_md('tutorialize-unifier', description='description: "First part\n  and the rest"\n'))
        self.only(self.check(), 'tutorialize-unifier/SKILL.md', 'not read')

    def test_check_description_missing_problem(self):
        self.write('impl-tracker-unifier/SKILL.md', skill_md('impl-tracker-unifier', description=''))
        self.only(self.check(), 'impl-tracker-unifier/SKILL.md', 'no description in the front matter')

    def test_check_front_matter_missing_problem(self):
        text = skill_md('impl-tracker-unifier')
        self.write('impl-tracker-unifier/SKILL.md', text[text.index('# impl-tracker-unifier'):])
        self.only(self.check(), 'impl-tracker-unifier/SKILL.md', 'no front matter')

    def test_check_front_matter_not_closed_problem(self):
        text = skill_md('impl-tracker-unifier')
        self.write('impl-tracker-unifier/SKILL.md', text.replace('---\n\n# impl-tracker-unifier', '\n# impl-tracker-unifier', 1))
        self.only(self.check(), 'impl-tracker-unifier/SKILL.md', 'front matter is not closed')

    def test_check_em_dash_problem(self):
        self.write('brd-unifier/chunks/10-nfrs.md', '# NFRs\n\nA line.\nA ' + EM_DASH + ' dash.\n')
        found = self.check()
        self.only(found, 'brd-unifier/chunks/10-nfrs.md', 'U+2014')
        self.assertNotIn('U+2013', found[0])
        self.assertTrue(found[0].endswith(': 4'), found)

    def test_check_en_dash_problem(self):
        self.write('sdd-unifier/notes.md', 'Pages 1' + EN_DASH + '3.\n')
        found = self.check()
        self.only(found, 'sdd-unifier/notes.md', 'U+2013')
        self.assertNotIn('U+2014', found[0])

    def test_check_both_dashes_one_problem_per_file(self):
        self.write('sdd-unifier/notes.md', 'a ' + EM_DASH + '\nb ' + EN_DASH + '\nc ' + EM_DASH + '\n')
        found = self.check()
        self.only(found, 'sdd-unifier/notes.md', 'U+2013', 'U+2014', '3 line(s)')

    def test_check_dash_on_many_lines_lists_the_first_five_problem(self):
        self.write('sdd-unifier/notes.md', ''.join(f'line {n} {EM_DASH}\n' for n in range(1, 8)))
        found = self.check()
        self.only(found, 'sdd-unifier/notes.md', '7 line(s)')
        self.assertTrue(found[0].endswith(': 1, 2, 3, 4, 5, ...'), found)

    def test_check_dash_in_skill_file_problem(self):
        self.edit('lld-unifier/SKILL.md', 'Nothing here.', 'Nothing ' + EM_DASH + ' here.')
        self.only(self.check(), 'lld-unifier/SKILL.md', 'U+2014')

    def test_check_dash_in_each_authored_extension_problem(self):
        for ext in ('.md', '.py', '.mjs', '.js', '.json', '.yaml', '.yml', '.css', '.html', '.txt'):
            with self.subTest(ext=ext):
                self.write('sdd-unifier/data/file' + ext, 'a ' + EM_DASH + ' b\n')
                self.only(self.check(), 'sdd-unifier/data/file' + ext, 'U+2014')
                (self.root / ('sdd-unifier/data/file' + ext)).unlink()

    def test_check_dash_outside_authored_files_pass(self):
        self.write('sdd-unifier/data/image.png', 'a ' + EM_DASH + ' b\n')
        self.write('sdd-unifier/data/diagram.mmd', 'a ' + EM_DASH + ' b\n')
        self.write('README.md', 'a ' + EM_DASH + ' b\n')
        self.write('docs/plan.md', 'a ' + EM_DASH + ' b\n')
        self.write('not-a-skill/notes.md', 'a ' + EM_DASH + ' b\n')
        self.assertEqual(self.check(), [])

    def test_check_dash_in_crlf_file_names_the_line_problem(self):
        self.write('sdd-unifier/notes.md', 'one\ntwo ' + EM_DASH + '\nthree\n', newline='\r\n')
        found = self.check()
        self.only(found, 'sdd-unifier/notes.md', 'U+2014')
        self.assertTrue(found[0].endswith(': 2'), found)

    def test_check_excluded_copy_ignored(self):
        self.write('pre-sdd-unifier/reference/Pre-SDD_Standard.md', 'a ' + EM_DASH + ' b\n')
        self.write('pre-sdd-unifier/examples/studio-v2.2-export/diagrams/notes.md', 'a ' + EN_DASH + ' b\n')
        self.write('pre-sdd-unifier/studio/tests/golden/local-zero/Pre-SDD.md', 'a ' + EM_DASH + ' b\n')
        self.assertEqual(len(self.check()), 3)
        found = self.check('--exclude', 'pre-sdd-unifier/reference/Pre-SDD_*.md',
                           'pre-sdd-unifier/examples/studio-v2.2-export/*', 'pre-sdd-unifier/studio/tests/golden/*')
        self.assertEqual(found, [])

    def test_check_excluded_copy_repeated_flag_ignored(self):
        self.write('pre-sdd-unifier/reference/Pre-SDD_Standard.md', 'a ' + EM_DASH + ' b\n')
        self.write('pre-sdd-unifier/studio/tests/golden/local-zero/Pre-SDD.md', 'a ' + EM_DASH + ' b\n')
        found = self.check('--exclude', 'pre-sdd-unifier/reference/*', '--exclude', 'pre-sdd-unifier/studio/tests/golden/*')
        self.assertEqual(found, [])

    def test_check_excluded_copy_leaves_other_files_checked_problem(self):
        self.write('pre-sdd-unifier/reference/Pre-SDD_Standard.md', 'a ' + EM_DASH + ' b\n')
        self.write('pre-sdd-unifier/reference/policy-appendix.md', 'a ' + EM_DASH + ' b\n')
        found = self.check('--exclude', 'pre-sdd-unifier/reference/Pre-SDD_*.md')
        self.only(found, 'pre-sdd-unifier/reference/policy-appendix.md', 'U+2014')

    def test_check_excluded_copy_case_differs_problem(self):
        self.write('pre-sdd-unifier/reference/x.md', 'a ' + EN_DASH + ' b\n')
        found = self.check('--exclude', 'pre-sdd-unifier/Reference/*')
        self.only(found, 'pre-sdd-unifier/reference/x.md', 'U+2013')

    def test_check_readme_anchor_missing_problem(self):
        self.write('README.md', '# Title\n\n## The chain\n')
        self.write('brd-unifier/notes.md', 'See [the chain](../README.md#the-chain) and [gone](../README.md#no-such-heading).\n')
        self.only(self.check(), 'brd-unifier/notes.md', '../README.md#no-such-heading')

    def test_check_readme_anchor_github_style_pass(self):
        self.write('README.md', '# Title\n\n## Status board & roles\n\n## Same\n\n## Same\n\n## 4. Stage (v2)\n\n```\n# Not a heading\n```\n')
        self.write('brd-unifier/notes.md', '[a](../README.md#status-board--roles) [b](../README.md#same) [c](../README.md#same-1) [d](../README.md#4-stage-v2)\n')
        self.assertEqual(self.check(), [])
        self.write('brd-unifier/notes.md', '[a](../README.md#status-board-roles)\n')
        self.only(self.check(), 'brd-unifier/notes.md', '#status-board-roles')
        self.write('brd-unifier/notes.md', '[a](../README.md#not-a-heading)\n')
        self.only(self.check(), 'brd-unifier/notes.md', '#not-a-heading')

    def test_check_readme_anchor_relative_to_file_problem(self):
        self.write('README.md', '# Title\n\n## Top\n')
        self.write('brd-unifier/README.md', '# Brd\n\n## Own\n')
        self.write('brd-unifier/chunks/10-nfrs.md', '[x](../README.md#own) [y](../../README.md#top) [z](../README.md#top)\n')
        self.only(self.check(), 'brd-unifier/chunks/10-nfrs.md', '../README.md#top', 'brd-unifier/README.md')

    def test_check_readme_missing_problem(self):
        self.write('brd-unifier/notes.md', '[x](../README.md#top)\n')
        self.only(self.check(), 'brd-unifier/notes.md', '../README.md#top')

    def test_check_readme_links_ignored_when_not_a_readme_anchor_pass(self):
        self.write('README.md', '# Title\n')
        self.write('brd-unifier/notes.md', '\n'.join([
            '[a](../README.md)', '[b](#top)', '[c](https://example.com/README.md#nope)', '[d](../OTHER.md#nope)',
            '```', '[e](../README.md#nope)', '```', '']))
        self.assertEqual(self.check(), [])

    def test_check_readme_link_in_excluded_copy_ignored(self):
        self.write('README.md', '# Title\n')
        self.write('pre-sdd-unifier/examples/PreSDD_Examples_README.md', '[x](../../README.md#nope)\n')
        self.assertEqual(len(self.check()), 1)
        self.assertEqual(self.check('--exclude', 'pre-sdd-unifier/examples/PreSDD_*.md'), [])

    def test_check_every_problem_names_its_file_problem(self):
        self.edit('lld-unifier/SKILL.md', 'The board is unifier-status.md', 'The board is kept in unifier-status.md')
        self.write('business-reviewer-unifier/SKILL.md', skill_md('business-reviewer-unifier', role=False))
        self.write('sdd-unifier/SKILL.md', skill_md('sdd-unifier', description=folded(words(1100))))
        self.write('brd-unifier/notes.md', 'a ' + EM_DASH + ' b\n[x](../README.md#nope)\n')
        (self.root / 'tutorialize-unifier/SKILL.md').unlink()
        found = self.check()
        self.assertEqual(len(found), 6, found)
        named = sorted(line.split(':')[0] for line in found)
        self.assertEqual(named, sorted(['lld-unifier/SKILL.md', 'business-reviewer-unifier/SKILL.md', 'sdd-unifier/SKILL.md',
                                        'brd-unifier/notes.md', 'brd-unifier/notes.md', 'tutorialize-unifier/SKILL.md']))


if __name__ == '__main__':
    unittest.main()
