from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

CHECKERS = Path(__file__).resolve().parents[1]
MARKER = ('<!-- SHARED: x-rules.md | HOME: a-unifier | COPIES: b-unifier | Each skill reads only its own copy. '
          'Edit the HOME copy, then copy it byte for byte to every COPIES skill in the same change. '
          '_fixtures/checkers/check_shared.py compares the copies. -->')
BODY = MARKER + '\n\n# X Rules\n\n## One\n\nRule one.\n'
LF = BODY.encode('utf-8')
CRLF = BODY.replace('\n', '\r\n').encode('utf-8')
POINTER = '# Skill\n\n- `x-rules.md`: the x rules.\n'
SKILLS = ('a-unifier', 'b-unifier', 'c-unifier')
DIFFERS = 'b-unifier/x-rules.md: differs from the home copy a-unifier/x-rules.md at line '


def with_marker(old, new):
    return (MARKER.replace(old, new, 1) + BODY[len(MARKER):]).encode('utf-8')


class CheckShared(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='check-shared-')
        self.root = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, rel, data):
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data if isinstance(data, bytes) else data.encode('utf-8'))

    def repo(self, files, pointing=('a-unifier', 'b-unifier'), skills=SKILLS):
        for child in self.root.iterdir():
            shutil.rmtree(child)
        for skill in skills:
            self.write(f'{skill}/SKILL.md', POINTER if skill in pointing else '# Skill\n')
        for rel, data in files.items():
            self.write(rel, data)

    def run_on(self, *args):
        p = subprocess.run([sys.executable, '-B', str(CHECKERS / 'check_shared.py'), *map(str, args)],
                           capture_output=True, text=True, encoding='utf-8',
                           env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONHASHSEED': '0'})
        self.assertEqual(p.returncode, 0, p.stderr)
        return p.stdout

    def problems(self, out):
        return int(out.split('problems: ')[1].split('\n')[0])

    def lines(self, out):
        return [l[3:] for l in out.split('problems: ')[1].split('\n')[1:] if l.startswith(' - ')]

    def expect(self, files, expected, **kwargs):
        self.repo(files, **kwargs)
        out = self.run_on(self.root)
        self.assertEqual(self.lines(out), expected, out)
        self.assertEqual(self.problems(out), len(expected), out)
        return out

    def test_identical_copies_with_crlf_and_lf_have_no_problem(self):
        for home, copy in ((CRLF, LF), (LF, CRLF), (CRLF, CRLF), (LF, LF)):
            with self.subTest(home_crlf=home == CRLF, copy_crlf=copy == CRLF):
                self.repo({'a-unifier/x-rules.md': home, 'b-unifier/x-rules.md': copy})
                self.assertEqual(self.run_on(self.root),
                                 'skill folders: 3\nshared files: 1\n  x-rules.md: home a-unifier; copies b-unifier\n'
                                 'copies checked: 2\nmarkdown files scanned: 5\nproblems: 0\n')

    def test_one_changed_byte_is_a_problem(self):
        self.repo({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF})
        self.assertEqual(self.problems(self.run_on(self.root)), 0)
        self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF.replace(b'Rule one.', b'Rule 1ne.')}, [DIFFERS + '7'])

    def test_missing_copy_is_a_problem(self):
        self.expect({'a-unifier/x-rules.md': LF}, ['b-unifier/x-rules.md: missing copy'])

    def test_copy_in_a_skill_the_marker_does_not_name_is_a_problem(self):
        self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF, 'c-unifier/x-rules.md': LF},
                    ['c-unifier/x-rules.md: stray copy, c-unifier is not named in the marker'])

    def test_copy_without_the_marker_is_a_problem(self):
        self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF.split(b'\n', 2)[2]},
                    ['b-unifier/x-rules.md: no shared marker on line 1'])
        self.expect({'a-unifier/x-rules.md': LF.split(b'\n', 2)[2], 'b-unifier/x-rules.md': LF},
                    ['a-unifier/x-rules.md: no shared marker on line 1', DIFFERS + '1'])
        unfinished = b'<!-- SHARED: x-rules.md | HOME: a-unifier | Each skill reads only its own copy. -->\n' + LF.split(b'\n', 1)[1]
        self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': unfinished},
                    ['b-unifier/x-rules.md: no shared marker on line 1'])

    def test_marker_that_names_another_file_is_a_problem(self):
        self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF, 'a-unifier/y-rules.md': LF},
                    ['a-unifier/y-rules.md: marker names x-rules.md, not this path'])
        self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF, 'a-unifier/chunks/x-rules.md': LF},
                    ['a-unifier/chunks/x-rules.md: marker names x-rules.md, not this path'])
        misplaced = with_marker('COPIES: b-unifier', 'COPIES: c-unifier')
        self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF, 'a-unifier/chunks/x-rules.md': misplaced},
                    ['a-unifier/chunks/x-rules.md: marker names x-rules.md, not this path'])

    def test_copy_that_skill_md_never_names_is_a_problem(self):
        files = {'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF}
        self.expect(files, ['b-unifier/x-rules.md: b-unifier/SKILL.md never names it'], pointing=('a-unifier',))
        self.expect(files, ['a-unifier/x-rules.md: a-unifier/SKILL.md never names it'], pointing=('b-unifier',))
        self.repo(files)
        for other in ('my-x-rules.md', 'x-rules.mdx'):
            with self.subTest(other):
                self.write('b-unifier/SKILL.md', f'# Skill\n\n- `{other}`: another file.\n')
                self.assertEqual(self.lines(self.run_on(self.root)), ['b-unifier/x-rules.md: b-unifier/SKILL.md never names it'])
        self.write('b-unifier/SKILL.md', '# Skill\n\nRead x-rules.md.\n')
        self.assertEqual(self.problems(self.run_on(self.root)), 0)

    def test_folder_without_skill_md_is_not_scanned(self):
        self.repo({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': LF})
        self.write('_fixtures/x-rules.md', LF + b'changed\n')
        self.write('hivantic-org-unifier/notes.md', '# Notes\n\nRead ../a-unifier/x-rules.md.\n')
        self.write('docs/guide.md', '# Guide\n\nSee a-unifier/SKILL.md.\n')
        out = self.run_on(self.root)
        self.assertEqual(self.problems(out), 0, out)
        self.assertIn('skill folders: 3\n', out)
        self.assertIn('markdown files scanned: 5\n', out)

    def test_missing_home_copy_is_a_problem(self):
        self.expect({'b-unifier/x-rules.md': LF}, ['a-unifier/x-rules.md: missing home copy'])

    def test_carrier_in_a_missing_skill_folder_is_a_problem(self):
        body = with_marker('COPIES: b-unifier', 'COPIES: b-unifier, d-unifier')
        self.expect({'a-unifier/x-rules.md': body, 'b-unifier/x-rules.md': body},
                    ['d-unifier/x-rules.md: missing copy (no such skill folder)'])

    def test_home_in_a_missing_skill_folder_is_a_problem(self):
        body = with_marker('HOME: a-unifier | COPIES: b-unifier', 'HOME: z-unifier | COPIES: a-unifier, b-unifier')
        self.expect({'a-unifier/x-rules.md': body, 'b-unifier/x-rules.md': body},
                    ['z-unifier/x-rules.md: missing home copy (no such skill folder)'])

    def test_marker_with_two_copies_checks_each_copy(self):
        body = with_marker('COPIES: b-unifier', 'COPIES: b-unifier, c-unifier')
        files = {'a-unifier/x-rules.md': body, 'b-unifier/x-rules.md': body, 'c-unifier/x-rules.md': body}
        out = self.expect(files, [], pointing=SKILLS)
        self.assertIn('  x-rules.md: home a-unifier; copies b-unifier, c-unifier\n', out)
        self.assertIn('copies checked: 3\n', out)
        files['c-unifier/x-rules.md'] = body.replace(b'Rule one.', b'Rule 1ne.')
        self.expect(files, ['c-unifier/x-rules.md: differs from the home copy a-unifier/x-rules.md at line 7'], pointing=SKILLS)

    def test_two_shared_files_are_listed_in_name_order_and_both_checked(self):
        z_rules = with_marker('x-rules.md', 'z-rules.md')
        m_rules = with_marker('x-rules.md | HOME: a-unifier | COPIES: b-unifier', 'm-rules.md | HOME: b-unifier | COPIES: c-unifier')
        self.repo({'a-unifier/z-rules.md': z_rules, 'b-unifier/z-rules.md': z_rules,
                   'b-unifier/m-rules.md': m_rules, 'c-unifier/m-rules.md': m_rules})
        self.write('a-unifier/SKILL.md', '# Skill\n\n- `z-rules.md`: the z rules.\n')
        self.write('b-unifier/SKILL.md', '# Skill\n\n- `z-rules.md`: the z rules.\n- `m-rules.md`: the m rules.\n')
        self.write('c-unifier/SKILL.md', '# Skill\n\n- `m-rules.md`: the m rules.\n')
        self.assertEqual(self.run_on(self.root),
                         'skill folders: 3\nshared files: 2\n  m-rules.md: home b-unifier; copies c-unifier\n'
                         '  z-rules.md: home a-unifier; copies b-unifier\ncopies checked: 4\nmarkdown files scanned: 7\nproblems: 0\n')

    def test_trailing_space_missing_final_newline_and_bom_are_differences(self):
        changed = {'trailing space': (LF.replace(b'Rule one.', b'Rule one. '), '7'),
                   'missing final newline': (LF[:-1], '8'),
                   'BOM inside the body': (LF.replace(b'# X Rules', b'\xef\xbb\xbf# X Rules'), '3'),
                   'lone CR inside a line': (LF.replace(b'Rule one.', b'Rule\r one.'), '7')}
        for label, (data, line) in changed.items():
            with self.subTest(label):
                self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': data}, [DIFFERS + line])
        with self.subTest('final newline only in the copy'):
            self.expect({'a-unifier/x-rules.md': LF[:-1], 'b-unifier/x-rules.md': LF}, [DIFFERS + '8'])

    def test_bom_at_the_start_of_a_copy_is_a_difference_from_home(self):
        bom = b'\xef\xbb\xbf'
        with self.subTest('BOM in the copy'):
            self.expect({'a-unifier/x-rules.md': LF, 'b-unifier/x-rules.md': bom + LF}, [DIFFERS + '1'])
        with self.subTest('BOM in the home copy'):
            self.expect({'a-unifier/x-rules.md': bom + LF, 'b-unifier/x-rules.md': LF}, [DIFFERS + '1'])
        with self.subTest('BOM in both'):
            self.expect({'a-unifier/x-rules.md': bom + LF, 'b-unifier/x-rules.md': bom + LF}, [])

    def test_home_listed_in_copies_or_a_repeated_carrier_is_counted_once(self):
        listed = with_marker('COPIES: b-unifier', 'COPIES: a-unifier, b-unifier')
        out = self.expect({'a-unifier/x-rules.md': listed, 'b-unifier/x-rules.md': listed}, [])
        self.assertIn('copies checked: 2\n', out)
        repeated = with_marker('COPIES: b-unifier', 'COPIES: b-unifier, b-unifier')
        out = self.expect({'a-unifier/x-rules.md': repeated, 'b-unifier/x-rules.md': repeated}, [])
        self.assertIn('copies checked: 2\n', out)
        self.expect({'a-unifier/x-rules.md': repeated}, ['b-unifier/x-rules.md: missing copy'])
        self.expect({'b-unifier/x-rules.md': listed}, ['a-unifier/x-rules.md: missing home copy'])

    def test_cross_skill_reference_outside_line_1_is_a_problem(self):
        self.repo({
            'a-unifier/notes.md': ('# Notes\n'
                                   '\n'
                                   'Read ../b-unifier/x-rules.md.\n'
                                   'The rules are in b-unifier/chunks/01-intro.md.\n'
                                   'Same recognition rules as in `b-unifier:modes.md`.\n'
                                   'Both b-unifier:modes.md and ../b-unifier/modes.md apply.\n'),
            'a-unifier/chunks/02-part.md': '<!--\nCHUNK: 02\n-->\n\n[syntax](../../b-unifier/mermaid-diagrams.md#syntax)\n',
            'a-unifier/hooks/guard.js': '// guard\nconst rules = "../b-unifier/x-rules.md";\n',
            'b-unifier/README.md': '# B\n\nOn Windows: C:\\Users\\me\\.claude\\skills\\a-unifier\\SKILL.md.\n',
        })
        out = self.run_on(self.root)
        self.assertEqual(self.lines(out), [
            'a-unifier/chunks/02-part.md:5: cross-skill reference ../../b-unifier/mermaid-diagrams.md',
            'a-unifier/notes.md:3: cross-skill reference ../b-unifier/x-rules.md',
            'a-unifier/notes.md:4: cross-skill reference b-unifier/chunks/01-intro.md',
            'a-unifier/notes.md:5: cross-skill reference b-unifier:modes.md',
            'a-unifier/notes.md:6: cross-skill reference b-unifier:modes.md',
            'a-unifier/notes.md:6: cross-skill reference ../b-unifier/modes.md',
            'b-unifier/README.md:3: cross-skill reference a-unifier\\SKILL.md',
        ], out)
        self.assertEqual(self.problems(out), 7, out)

    def test_skill_named_in_prose_only_has_no_cross_skill_problem(self):
        self.repo({'a-unifier/notes.md': ('# Notes\n'
                                          '\n'
                                          'Hand off to b-unifier when the BRD is ready.\n'
                                          'The a-unifier and b-unifier skills differ.\n'
                                          'Same as in b-unifier: the status stays Open.\n'
                                          'Written by b-unifier: each row is matched by Link.\n'
                                          'The chain a-unifier/b-unifier/c-unifier is read left to right.\n'
                                          'A name that only contains a skill name, such as ../b-unifier-extra/x.md, '
                                          'pre-b-unifier/x.md or pre-b-unifier:x.md, is no reference.\n'
                                          'Write a reference as <skill>:<file>.md or ../<skill>/<file>, never in a skill.\n')})
        out = self.run_on(self.root)
        self.assertEqual(self.problems(out), 0, out)

    def test_reference_to_the_own_skill_folder_is_not_a_problem(self):
        notes = ('# Notes\n'
                 '\n'
                 'See ../a-unifier/x-rules.md and a-unifier/chunks/01-intro.md.\n'
                 'Run "$HOME/.claude/skills/a-unifier/hooks/guard.js" first.\n'
                 'Same as `a-unifier:modes.md`.\n')
        self.repo({'a-unifier/notes.md': notes})
        out = self.run_on(self.root)
        self.assertEqual(self.problems(out), 0, out)
        self.write('b-unifier/notes.md', notes)
        out = self.run_on(self.root)
        self.assertEqual(self.lines(out), [
            'b-unifier/notes.md:3: cross-skill reference ../a-unifier/x-rules.md',
            'b-unifier/notes.md:3: cross-skill reference a-unifier/chunks/01-intro.md',
            'b-unifier/notes.md:4: cross-skill reference a-unifier/hooks/guard.js',
            'b-unifier/notes.md:5: cross-skill reference a-unifier:modes.md',
        ], out)

    def test_line_1_without_the_marker_is_scanned_for_cross_skill_references(self):
        self.repo({'a-unifier/notes.md': 'See ../b-unifier/x-rules.md.\n\nText.\n',
                   'a-unifier/other.md': '<!-- header, see b-unifier:modes.md -->\n\nText.\n'})
        out = self.run_on(self.root)
        self.assertEqual(self.lines(out), [
            'a-unifier/notes.md:1: cross-skill reference ../b-unifier/x-rules.md',
            'a-unifier/other.md:1: cross-skill reference b-unifier:modes.md',
        ], out)
        body = with_marker('copy.', 'copy (see ../b-unifier/x-rules.md).')
        self.repo({'a-unifier/x-rules.md': body, 'b-unifier/x-rules.md': body})
        self.assertEqual(self.problems(self.run_on(self.root)), 0)
        bom = b'\xef\xbb\xbf' + body
        self.repo({'a-unifier/x-rules.md': bom, 'b-unifier/x-rules.md': bom})
        self.assertEqual(self.problems(self.run_on(self.root)), 0)

    def test_reference_on_line_1_is_not_a_problem(self):
        body = with_marker('copy.', 'copy (see ../b-unifier/x-rules.md and b-unifier:modes.md).')
        self.repo({'a-unifier/x-rules.md': body, 'b-unifier/x-rules.md': body})
        out = self.run_on(self.root)
        self.assertEqual(self.problems(out), 0, out)
        self.write('a-unifier/notes.md', '# Notes\n\nSee ../b-unifier/x-rules.md and b-unifier:modes.md.\n')
        out = self.run_on(self.root)
        self.assertEqual(self.lines(out), [
            'a-unifier/notes.md:3: cross-skill reference ../b-unifier/x-rules.md',
            'a-unifier/notes.md:3: cross-skill reference b-unifier:modes.md',
        ], out)

    def test_root_that_is_not_a_folder_is_a_problem_with_exit_code_0(self):
        for args in ((self.root / 'no-such-folder',), ()):
            with self.subTest(args=args):
                out = self.run_on(*args)
                self.assertEqual(self.problems(out), 1, out)
                self.assertIn('ROOT is not a folder', out)


if __name__ == '__main__':
    unittest.main()
