from pathlib import Path
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

CHECKERS = Path(__file__).resolve().parents[1]
WT = CHECKERS.parents[1]
STUDIO = WT / 'pre-sdd-unifier' / 'studio'
CLI = STUDIO / 'cli.mjs'
SLUG = 'refunds-platform'
NAME = 'Refunds platform'
MASTER = f'{SLUG}-pre-sdd-master.md'
PSDD = f'pre-sdd-{SLUG}'
SDD = f'sdd-{SLUG}'

STATES_SCRIPT = r'''
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const [studio, out] = process.argv.slice(2);
const st = await import(pathToFileURL(studio + '/tests/states.mjs').href);
const E = createRequire(import.meta.url)(studio + '/src/engine.js');
const settle = (s) => E.derive(E.applyDefaults(s, { now: st.NOW }).state, { now: st.NOW }).state;
const unsigned = settle(st.approvedState({ roles: [] }));
const overlay = settle(st.apply(unsigned, [
  { op: 'set', entry: 'HDR-07.1', value: 'brownfield' },
  { op: 'set-overlay', applies: true, source: 'onprem' },
]));
const owned = st.apply(overlay, E.OVERLAY_FIELDS.map((f) => ({ op: 'set', entry: `${f.id}.1`, owner_name: 'Dana Reyes', due: '2026-12-01' })));
const expired = settle(st.apply(unsigned, [
  { op: 'add-exception', entry: 'CAP-02.1', reason: 'Load model pending', expires: '2026-10-24', review: '2026-10-24' },
]));
const states = {
  approved: st.apply(unsigned, st.signOps(st.ROLES)),
  expired: st.apply(expired, st.signOps(st.ROLES)),
  overlay: st.apply(owned, st.signOps(st.ROLES)),
  quick: settle(st.newProject({ mode: 'quick' })),
  draft: settle(st.newProject()),
};
writeFileSync(out, JSON.stringify(states));
'''

CHUNKS = [
    ('00', '00-cover-and-changelog.md', 'Cover and Changelog', []),
    ('01', '01-business-brief.md', 'Business Brief', ['01-header.md']),
    ('02', '02-classification-and-path.md', 'Classification and Path', ['02-classification.md']),
    ('03a', '03a-register-business.md', 'Requirement Register - Business', ['03a-register-business.md']),
    ('03b', '03b-register-capacity.md', 'Requirement Register - Capacity', ['03b-register-capacity.md']),
    ('03c', '03c-register-reliability.md', 'Requirement Register - Reliability', ['03c-register-reliability.md']),
    ('03d', '03d-register-data.md', 'Requirement Register - Data', ['03d-register-data.md']),
    ('03e', '03e-register-security.md', 'Requirement Register - Security', ['03e-register-security.md']),
    ('03f', '03f-register-integration.md', 'Requirement Register - Integration', ['03f-register-integration.md']),
    ('03g', '03g-register-operations.md', 'Requirement Register - Operations', ['03g-register-operations.md']),
    ('03h', '03h-register-economics.md', 'Requirement Register - Economics', ['03h-register-economics.md']),
    ('04', '04-targets-and-calculations.md', 'Targets and Calculations', ['04-calculations.md']),
    ('05', '05-target-shape.md', 'Target Shape', ['05-target-shape.md']),
    ('06', '06-existing-estate.md', 'Existing Estate', []),
    ('07', '07-options-and-economics.md', 'Options and Economics', ['07-options.md']),
    ('08', '08-migration-overlay.md', 'Migration Overlay', ['08-overlay.md']),
    ('09', '09-decisions.md', 'Decisions', ['09-rule-trace.md']),
    ('10', '10-validation-risks-unknowns.md', 'Validation, Risks and Unknowns', ['10-validation.md']),
    ('11', '11-gate-and-sign-off.md', 'Gate and Sign-off', ['11-gate.md']),
    ('12', '12-sdd-handoff-guide.md', 'SDD Handoff Guide', ['12-locked-items.md']),
    ('13', '13-open-items-and-clarifications.md', 'Open Items and Clarifications', []),
]
QUICK = {'00', '01', '02', '03a', '03b', '03c', '03d', '03e', '03f', '03g', '03h', '10'}
GROUPS = {'03a': '3.1 Business', '03b': '3.2 Capacity', '03c': '3.3 Reliability', '03d': '3.4 Data',
          '03e': '3.5 Security', '03f': '3.6 Integration', '03g': '3.7 Operations', '03h': '3.8 Economics'}
SECTION = {'01': '1.1 Project Header', '02': '2.1 Classification', '04': '4.2 Calculations', '05': '5.1 Shape',
           '07': '7.1 Options', '08': '8.1 Overlay Register', '09': '9.3 Rule Trace',
           '10': '10.1 Validation and Unknowns', '11': '11.1 Gate Result', '12': '12.2 Locked Items'}
TWELVE = ['12.1 Pre-SDD, Gate and Signers', '12.2 Locked Items', '12.3 Where Each Item Lands in the SDD',
          '12.4 Left to the SDD', '12.5 Conditions, Exceptions and Unknowns', '12.6 When the SDD Disagrees',
          '12.7 Citing This Pre-SDD']

BASES = {}
WORK = None


def setUpModule():
    global WORK
    WORK = tempfile.mkdtemp(prefix='check-presdd-bases-')
    script = Path(WORK) / 'states.mjs'
    script.write_text(STATES_SCRIPT, encoding='utf-8', newline='\n')
    out = Path(WORK) / 'states.json'
    subprocess.run(['node', str(script), str(STUDIO), str(out)], check=True, capture_output=True)
    states = json.loads(out.read_text(encoding='utf-8'))
    for name, state in states.items():
        base = Path(WORK) / name
        (base / 'studio').mkdir(parents=True)
        state_file = base / 'studio' / 'project-state.json'
        state_file.write_text(json.dumps(state, indent=2) + '\n', encoding='utf-8', newline='\n')
        rendered = base / 'out'
        now = max(record['at'] for record in state['history'])
        subprocess.run(['node', str(CLI), 'compute', str(state_file), '--out', str(rendered), '--now', now],
                       check=True, capture_output=True)
        fragments = {p.name: p.read_text(encoding='utf-8') for p in (rendered / 'fragments').glob('*.md')}
        model = json.loads((rendered / 'model.json').read_text(encoding='utf-8'))
        BASES[name] = {'state': state, 'state_text': state_file.read_text(encoding='utf-8'),
                       'fragments': fragments, 'model': model}


def tearDownModule():
    shutil.rmtree(WORK, ignore_errors=True)


def written(name):
    base = BASES[name]
    state = base['state']
    if state['run']['mode'] == 'quick':
        return [c for c in CHUNKS if c[0] in QUICK]
    change = state['register']['header']['HDR-07'][0]['value']
    overlay = state['register']['overlay']['applies'] is True
    keep = []
    for chunk in CHUNKS:
        if chunk[0] == '06' and change not in ('brownfield', 'mixed'):
            continue
        if chunk[0] == '08' and not overlay:
            continue
        keep.append(chunk)
    return keep


def region(fragments, name):
    return f'<!-- ENGINE-FRAGMENT: {name} -->\n{fragments[name].rstrip()}\n<!-- /ENGINE-FRAGMENT -->'


def gate_line(model):
    g = model['gate']
    return f"**Gate:** {g['label']} - G3: {g['g3']['status']} - SDD authorized: {'Yes' if g['authorized'] else 'No'}"


def chunk_body(cid, title, frags, base):
    fragments = base['fragments']
    model = base['model']
    if cid == '00':
        return (f'# Pre-SDD - {NAME}\n\n**Version:** 1.0\n\n## Document Lineage\n\n'
                'Source BRDs: REFUNDS v1.5 (Approved).\n\n## Changes Log\n\n| Version | Summary |\n|---|---|\n'
                '| 1.0 | Initial Pre-SDD. Chunks: none (initial build) |\n\n## Indexes\n\nContents.')
    if cid.startswith('03'):
        return f'# 3. Requirement Register\n\n## {GROUPS[cid]}\n\n' + region(fragments, frags[0])
    number = str(int(cid))
    head = f'# {number}. {title}'
    if cid == '06':
        return f'{head}\n\nThe existing estate is the on-prem refunds service.'
    if cid == '13':
        return f'{head}\n\nNone.'
    if cid == '09':
        return (f'{head}\n\n## 9.2 Decision Tree\n\nDT-01 to DT-15 as the engine reads them; DT-07 holds.\n\n'
                f'## {SECTION[cid]}\n\n' + region(fragments, frags[0]) +
                '\n\n## 9.4 Pre-SDD ADRs\n\nADR-DR-001 records the DR strategy; ADR-DATA-001 the data shape.')
    if cid == '11':
        return (f'{head}\n\n## {SECTION[cid]}\n\n' + region(fragments, frags[0]) +
                '\n\n## 11.2 SDD Initiation Authorized By\n\n**SDD initiation authorized by:** Mahmoud, 2026-10-23')
    if cid == '12':
        label = model['gate']['label']
        parts = [head, f'## {TWELVE[0]}',
                 f'| Item | Value |\n|---|---|\n| Pre-SDD | {NAME}, version 1.0 |\n| Gate | {label} |',
                 f'## {TWELVE[1]}', region(fragments, frags[0])]
        for heading in TWELVE[2:]:
            parts += [f'## {heading}', 'As the template says.']
        return '\n\n'.join(parts)
    return f'{head}\n\n## {SECTION[cid]}\n\n' + region(fragments, frags[0])


def chunk_text(chunk, chain, base):
    cid, fname, title, frags = chunk
    names = [c[1] for c in chain]
    i = names.index(fname)
    prev = names[i - 1] if i else 'none'
    nxt = names[i + 1] if i + 1 < len(names) else 'none'
    header = (f'<!--\nCHUNK: {cid}\nTITLE: {title}\nPROJECT: {NAME}\nVERSION: 1.0\nDEPENDS_ON: 00\n'
              f'PART OF: Pre-SDD - {NAME}\n-->')
    footer = f'<!-- MASTER: {MASTER} | PREV: {prev} | NEXT: {nxt} -->'
    return f'{header}\n\n{chunk_body(cid, title, frags, base)}\n\n{footer}\n'


def master_text(name, chain):
    base = BASES[name]
    state = base['state']
    model = base['model']
    mode = state['run']['mode']
    g1 = 'Met' if model['gate']['g1']['met'] else 'Not met'
    rows = '\n'.join(f'| {c[2]} | [{c[1]}](./{c[1]}) |' for c in chain)
    return (f'<!--\nTYPE: Master Index\nPROJECT: {NAME}\nVERSION: 1.0\nPART OF: Pre-SDD - {NAME}\n-->\n\n'
            f'# Pre-SDD Master Index - {NAME}\n\n## Generation Progress\n\n'
            f'**Generation:** {mode}\n**Source BRDs:** REFUNDS v1.5 (Approved)\n{gate_line(model)}\n'
            '**Next:** stage 4, group - - waiting for: nothing: handed off\n\n'
            '| Stage | Status | Group | Gate | Write-up | Review | Handoff |\n'
            '|-------|--------|-------|------|----------|--------|---------|\n'
            '| 1. Discovery | Done | - | - | - | - | - |\n'
            f'| 2. Register | Done | - | G1 {g1} | - | - | - |\n'
            '| 3. Assess | Done | - | G2 shortlist | - | - | - |\n'
            '| 4. Confirm and decide | Done | - | G3 Approved | - | - | - |\n\n'
            f'## Chunks\n\n| Section | Chunk |\n|---------|-------|\n{rows}\n\n'
            '[decision-log.md](./decision-log.md)\n')


SDD_COVER = '''<!--
CHUNK: 00
TITLE: Cover and Changelog
-->

# SDD - Refunds platform

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds | 1.5 | [refunds-brd-master.md](../brd-refunds/refunds-brd-master.md) | Refunds |

### Source Pre-SDD

| Key | Pre-SDD | Version | Gate | Link |
|-----|---------|---------|------|------|
| {key} | Refunds platform | {version} | {gate} | [{master}]({link}) |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| None yet | - | - | - | - | - |
'''

SDD_PERF = '''<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
-->

# 18. Performance & Capacity Planning

<!-- With a loaded Pre-SDD, 18 cites its calculations as PSDD/CALC-NN with a link. -->

## 18.1 Load Estimates

| Dimension | Value | Source |
|-----------|-------|--------|
| Average business TPS | {avg} | [PSDD/CALC-01](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) |
| Peak business TPS | {peak} txn/s | [PSDD/CALC-02](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) |
| Peak API RPS | See the Pre-SDD | [PSDD/CALC-03](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) |

The TCO of the chosen shape is [PSDD/CALC-21@OPT-01](../pre-sdd-refunds-platform/07-options-and-economics.md#71-options).

# 19. Environments

| Item | Value |
|---|---|
| Unrelated | 55 PSDD/CALC-02 |
'''

SDD_INFRA = '''<!--
CHUNK: 05a
TITLE: Infrastructure
-->

# 8. Architecture

## 8.6 Infrastructure Architecture

The zones follow [PSDD/REL-03.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03) and \
[PSDD/REL-05](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05), per [PSDD/DT-07](x) and \
[PSDD/ADR-DR-001](y). Template guidance mentions PSDD/CALC-NN and PSDD/<ID>.
'''


class CheckPreSdd(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='check-presdd-')
        self.root = Path(self.tmp.name)
        self.psdd = self.root / PSDD
        self.sdd = self.root / SDD

    def tearDown(self):
        self.tmp.cleanup()

    def build(self, name='approved', newline='\n'):
        base = BASES[name]
        chain = written(name)
        (self.psdd / 'studio').mkdir(parents=True)
        (self.psdd / 'studio' / 'project-state.json').write_text(base['state_text'], encoding='utf-8', newline='\n')
        for chunk in chain:
            (self.psdd / chunk[1]).write_text(chunk_text(chunk, chain, base), encoding='utf-8', newline=newline)
        (self.psdd / MASTER).write_text(master_text(name, chain), encoding='utf-8', newline=newline)
        (self.psdd / 'decision-log.md').write_text('# Decision Log\n\nNone yet.\n', encoding='utf-8', newline=newline)

    def build_sdd(self, key='PSDD', version='1.0', gate='G3 Approved', link=f'../{PSDD}/{MASTER}',
                  avg='10', peak='50', extra=''):
        self.sdd.mkdir()
        cover = SDD_COVER.format(key=key, version=version, gate=gate, master=MASTER, link=link)
        (self.sdd / '00-cover-and-changelog.md').write_text(cover, encoding='utf-8', newline='\n')
        perf = SDD_PERF.format(avg=avg, peak=peak) + extra
        (self.sdd / '14-performance-and-capacity.md').write_text(perf, encoding='utf-8', newline='\n')
        (self.sdd / '05a-infrastructure.md').write_text(SDD_INFRA, encoding='utf-8', newline='\n')

    def path(self, fname):
        return self.psdd / fname

    def read(self, fname):
        return self.path(fname).read_text(encoding='utf-8')

    def write(self, fname, text):
        self.path(fname).write_text(text, encoding='utf-8', newline='\n')

    def edit(self, fname, old, new, count=1):
        text = self.read(fname)
        self.assertIn(old, text)
        self.write(fname, text.replace(old, new, count))

    def check(self, *extra, cli=str(CLI), env=None):
        args = [sys.executable, '-B', str(CHECKERS / 'check_presdd.py'), str(self.psdd)]
        if cli is not None:
            args += ['--cli', cli]
        p = subprocess.run(args + list(extra), capture_output=True, text=True, encoding='utf-8',
                           env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONHASHSEED': '0', **(env or {})})
        shown = p.stdout + p.stderr
        lines = p.stdout.splitlines()
        self.assertTrue(lines and re.fullmatch(r'\d+ problems', lines[-1]), shown)
        count = int(lines[-1].split()[0])
        self.assertEqual(len(lines) - 1, count, shown)
        self.assertEqual(p.returncode, 1 if count else 0, shown)
        return lines[:-1]

    def check_sdd(self):
        return self.check('--sdd', str(self.sdd))

    def expect(self, found, *groups):
        self.assertEqual(len(found), len(groups), found)
        left = list(found)
        for group in groups:
            hits = [line for line in left if all(fragment in line for fragment in group)]
            self.assertEqual(len(hits), 1, (group, found))
            left.remove(hits[0])

    def only(self, found, *fragments):
        self.expect(found, fragments)

    def mismatch(self, fname):
        return (fname, 'differs from the fragment')

    def test_check_full_approved_pass(self):
        self.build()
        before = sorted(str(p.relative_to(self.psdd)) for p in self.psdd.rglob('*'))
        self.assertEqual(self.check(), [])
        after = sorted(str(p.relative_to(self.psdd)) for p in self.psdd.rglob('*'))
        self.assertEqual(before, after)

    def test_check_overlay_brownfield_pass(self):
        self.build('overlay')
        self.assertTrue(self.path('06-existing-estate.md').is_file())
        self.assertTrue(self.path('08-migration-overlay.md').is_file())
        self.assertIn('Migration owner (if relevant)', self.read('11-gate-and-sign-off.md'))
        self.assertIn('| OVL-01.1 | WL-01 | TBD | TBD | TBD | TBD | target | Open | TBD | Dana Reyes | 2026-12-01 |',
                      self.read('08-migration-overlay.md'))
        self.assertIn('| G1 Met |', self.read(MASTER))
        self.assertEqual(self.check(), [])

    def test_check_overlay_open_without_owner_after_g1_problem(self):
        self.build('overlay')
        self.edit('08-migration-overlay.md', '| Open | TBD | Dana Reyes | 2026-12-01 |', '| Open | TBD | TBD | TBD |')
        self.expect(self.check(), ('08-migration-overlay.md', 'OVL-01.1', 'owner name and a due date'),
                    self.mismatch('08-migration-overlay.md'))

    def test_check_overlay_row_missing_problem(self):
        self.build('overlay')
        text = self.read('08-migration-overlay.md')
        start = text.index('### OVL-05')
        end = text.index('### OVL-06')
        self.write('08-migration-overlay.md', text[:start] + text[end:])
        self.expect(self.check(), ('08-migration-overlay.md', 'no "### OVL-05" row'),
                    self.mismatch('08-migration-overlay.md'))

    def test_check_overlay_row_outside_chunk_problem(self):
        self.build()
        self.edit('05-target-shape.md', '## 5.1 Shape', '### OVL-03\n\n## 5.1 Shape')
        self.only(self.check(), '05-target-shape.md', 'OVL-03', 'chunk 08')

    def test_check_slug_with_leading_digits_pass(self):
        self.build('draft')
        slug = '24-7-pay'
        master = f'{slug}-pre-sdd-master.md'
        path = self.path('studio/project-state.json')
        state = json.loads(path.read_text(encoding='utf-8'))
        state['project']['slug'] = slug
        path.write_text(json.dumps(state, indent=2), encoding='utf-8')
        self.path(MASTER).rename(self.path(master))
        for file in self.psdd.glob('*.md'):
            self.write(file.name, self.read(file.name).replace(f'MASTER: {MASTER}', f'MASTER: {master}'))
        self.assertEqual(self.check(), [])

    def test_check_quick_pass(self):
        self.build('quick')
        self.assertFalse(self.path('11-gate-and-sign-off.md').exists())
        self.assertEqual(self.check(), [])

    def test_check_draft_open_without_owner_pass(self):
        self.build('draft')
        self.assertIn('| CAP-01.1 | TBD | TBD | transactions/day | TBD | TBD | forecast | Open | TBD | B+E | TBD |',
                      self.read('03b-register-capacity.md'))
        self.assertEqual(self.check(), [])

    def test_check_expired_exception_pass(self):
        self.build('expired')
        self.assertIn('| EXC-01 | CAP-02.1 | Load model pending | Mahmoud | 2026-10-24 | 2026-10-24 | yes |',
                      self.read('11-gate-and-sign-off.md'))
        self.assertEqual(self.check(), [])

    def empty_history(self):
        path = self.path('studio/project-state.json')
        state = json.loads(path.read_text(encoding='utf-8'))
        state['history'] = []
        path.write_text(json.dumps(state, indent=2), encoding='utf-8')

    def test_check_expired_exception_generation_date_pass(self):
        self.build('expired')
        self.empty_history()
        self.edit(MASTER, '**Generation:** full', '**Generation:** full (2026-10-23)')
        self.assertEqual(self.check(), [])

    def test_check_expired_exception_later_generation_date_problem(self):
        self.build('expired')
        self.empty_history()
        self.edit(MASTER, '**Generation:** full', '**Generation:** full (2026-10-25)')
        self.only(self.check(), '11-gate-and-sign-off.md', 'differs from the fragment', '11-gate.md')

    def test_check_crlf_pass(self):
        self.build(newline='\r\n')
        self.assertIn(b'\r\n', self.path(MASTER).read_bytes())
        self.assertEqual(self.check(), [])

    def test_check_default_cli_pass(self):
        self.build()
        self.assertEqual(self.check(cli=None), [])

    def test_check_state_missing_problem(self):
        self.build()
        self.path('studio/project-state.json').unlink()
        self.only(self.check(), 'studio/project-state.json', 'not found')

    def test_check_master_missing_problem(self):
        self.build()
        self.path(MASTER).unlink()
        self.only(self.check(), MASTER, 'not found')

    def test_check_master_generation_problem(self):
        self.build()
        self.edit(MASTER, '**Generation:** full', '**Generation:** quick')
        self.only(self.check(), MASTER, 'Generation')

    def test_check_master_gate_line_problem(self):
        self.build()
        self.edit(MASTER, '**Gate:** G3 Approved - ', '**Gate:** G2 - ')
        self.only(self.check(), MASTER, 'Gate line', 'G3 Approved')

    def test_check_master_links_omitted_chunk_problem(self):
        self.build()
        self.edit(MASTER, '[decision-log.md]', '[06](./06-existing-estate.md) [decision-log.md]')
        self.only(self.check(), MASTER, '06-existing-estate.md', 'omitted')

    def test_check_master_missing_chunk_link_problem(self):
        self.build()
        self.edit(MASTER, '| Target Shape | [05-target-shape.md](./05-target-shape.md) |\n', '')
        self.only(self.check(), MASTER, '05-target-shape.md', 'no link')

    def test_check_chunk_missing_problem(self):
        self.build()
        chain = [c for c in written('approved') if c[0] != '07']
        self.path('07-options-and-economics.md').unlink()
        for chunk in chain:
            self.write(chunk[1], chunk_text(chunk, chain, BASES['approved']))
        self.write(MASTER, master_text('approved', chain))
        self.only(self.check(), '07-options-and-economics.md', 'missing')

    def test_check_chunk_not_written_problem(self):
        self.build()
        self.write('06-existing-estate.md', '# 6. Existing Estate\n')
        self.only(self.check(), '06-existing-estate.md', 'not be written')

    def test_check_overlay_chunk_missing_problem(self):
        self.build('overlay')
        chain = [c for c in written('overlay') if c[0] != '08']
        self.path('08-migration-overlay.md').unlink()
        for chunk in chain:
            self.write(chunk[1], chunk_text(chunk, chain, BASES['overlay']))
        self.write(MASTER, master_text('overlay', chain))
        self.only(self.check(), '08-migration-overlay.md', 'missing')

    def test_check_quick_extra_chunk_problem(self):
        self.build('quick')
        self.write('11-gate-and-sign-off.md', '# 11. Gate and Sign-off\n')
        self.only(self.check(), '11-gate-and-sign-off.md', 'not be written')

    def test_check_footer_chain_problem(self):
        self.build()
        self.edit('03c-register-reliability.md', 'NEXT: 03d-register-data.md', 'NEXT: 04-targets-and-calculations.md')
        self.only(self.check(), '03c-register-reliability.md', 'footer', '03d-register-data.md')

    def test_check_header_chunk_id_problem(self):
        self.build()
        self.edit('05-target-shape.md', 'CHUNK: 05', 'CHUNK: 5')
        self.only(self.check(), '05-target-shape.md', 'CHUNK')

    def test_check_header_version_missing_problem(self):
        self.build()
        self.edit('05-target-shape.md', 'VERSION: 1.0\n', '')
        self.only(self.check(), '05-target-shape.md', 'VERSION')

    def test_check_register_row_missing_problem(self):
        self.build()
        text = self.read('03b-register-capacity.md')
        start = text.index('### CAP-08')
        end = text.index('### CAP-09')
        self.write('03b-register-capacity.md', text[:start] + text[end:])
        self.expect(self.check(), ('CAP-08', 'no "### CAP-08" row'), self.mismatch('03b-register-capacity.md'))

    def test_check_register_row_duplicate_problem(self):
        self.build()
        self.edit('05-target-shape.md', '## 5.1 Shape', '### REL-03\n\n## 5.1 Shape')
        self.only(self.check(), 'REL-03', '05-target-shape.md')

    def test_check_header_row_missing_problem(self):
        self.build()
        self.edit('01-business-brief.md', '### HDR-04\n', '### HDR-4\n')
        self.expect(self.check(), ('HDR-04', 'no "### HDR-04" row'), self.mismatch('01-business-brief.md'))

    def test_check_status_invalid_problem(self):
        self.build()
        self.edit('03h-register-economics.md', '| Open | TBD |', '| Done | TBD |')
        self.expect(self.check(), ('03h-register-economics.md', 'Status "Done"'),
                    self.mismatch('03h-register-economics.md'))

    def test_check_source_invalid_problem(self):
        self.build('draft')
        self.edit('03b-register-capacity.md', '| Estimated | Default: policy appendix v1 |',
                  '| Estimated | Mahmoud said so |')
        self.expect(self.check(), ('03b-register-capacity.md', 'Source "Mahmoud said so"'),
                    self.mismatch('03b-register-capacity.md'))

    def test_check_source_missing_on_estimated_problem(self):
        self.build()
        self.edit('03a-register-business.md', '| Estimated | Answer: Mahmoud, 2026-10-23 |', '| Estimated | TBD |')
        self.expect(self.check(), ('03a-register-business.md', 'Source'), self.mismatch('03a-register-business.md'))

    def test_check_owner_code_invalid_problem(self):
        self.build()
        self.edit('03c-register-reliability.md', '| B+E (Dana Reyes) |', '| X+E (Dana Reyes) |')
        self.expect(self.check(), ('03c-register-reliability.md', 'Owner "X+E (Dana Reyes)"'),
                    self.mismatch('03c-register-reliability.md'))

    def test_check_confirmed_without_who_when_problem(self):
        self.build()
        self.edit('03c-register-reliability.md', '| Confirmed (Mahmoud, 2026-10-23T11:01:02Z) |', '| Confirmed |')
        self.expect(self.check(), ('03c-register-reliability.md', 'Confirmed', 'who and when'),
                    self.mismatch('03c-register-reliability.md'))

    def test_check_open_without_owner_after_g1_problem(self):
        self.build()
        self.edit('03g-register-operations.md', '| Open | TBD | Ops (Dana Reyes) | 2026-12-01 |', '| Open | TBD | Ops | TBD |')
        self.expect(self.check(), ('03g-register-operations.md', 'Open', 'owner name and a due date'),
                    self.mismatch('03g-register-operations.md'))

    def test_check_open_without_owner_g1_claimed_in_table_problem(self):
        self.build('draft')
        self.edit(MASTER, '| G1 Not met |', '| G1 Met |')
        found = self.check()
        self.assertGreater(len(found), 1)
        self.assertTrue(all('owner name and a due date' in line for line in found), found)
        self.assertTrue(any('HDR-01.1' in line for line in found), found)

    def test_check_fragment_edited_problem(self):
        self.build()
        self.edit('04-targets-and-calculations.md', 'daily_transactions / 86400', 'daily_transactions / 86000')
        self.only(self.check(), '04-targets-and-calculations.md', 'differs from the fragment', '04-calculations.md')

    def test_check_fragment_region_missing_problem(self):
        self.build()
        text = self.read('05-target-shape.md')
        text = text.replace('<!-- ENGINE-FRAGMENT: 05-target-shape.md -->\n', '').replace('<!-- /ENGINE-FRAGMENT -->\n', '')
        self.write('05-target-shape.md', text)
        self.only(self.check(), '05-target-shape.md', 'no ENGINE-FRAGMENT region', '05-target-shape.md')

    def test_check_fragment_region_unknown_problem(self):
        self.build()
        self.edit('13-open-items-and-clarifications.md', 'None.', '<!-- ENGINE-FRAGMENT: 08-overlay.md -->\nx\n<!-- /ENGINE-FRAGMENT -->')
        self.only(self.check(), '13-open-items-and-clarifications.md', '08-overlay.md')

    def test_check_fragment_cli_missing_problem(self):
        self.build()
        self.only(self.check(cli=str(self.root / 'nowhere' / 'cli.mjs')), 'cli.mjs', 'not found')

    def test_check_node_missing_problem(self):
        self.build()
        self.only(self.check(env={'PATH': str(self.root / 'no-node')}), 'cli.mjs', 'node could not run')

    def test_check_compute_failure_problem(self):
        self.build()
        path = self.path('studio/project-state.json')
        state = json.loads(path.read_text(encoding='utf-8'))
        state['kind'] = 'bogus'
        path.write_text(json.dumps(state, indent=2), encoding='utf-8')
        self.only(self.check(), 'cli.mjs', 'compute failed')

    def test_check_due_not_a_date_problem(self):
        self.build()
        self.edit('03g-register-operations.md', '| Ops (Dana Reyes) | 2026-12-01 |', '| Ops (Dana Reyes) | 2026-12 |')
        self.expect(self.check(), ('03g-register-operations.md', 'Due "2026-12"'),
                    self.mismatch('03g-register-operations.md'))

    def test_check_signoff_decision_invalid_problem(self):
        self.build()
        self.edit('11-gate-and-sign-off.md', '| Network owner | Mahmoud | Approved |', '| Network owner | Mahmoud | Okay |')
        self.expect(self.check(), ('11-gate-and-sign-off.md', 'Network owner', 'decision "Okay"'),
                    self.mismatch('11-gate-and-sign-off.md'))

    def test_check_signoff_at_not_utc_problem(self):
        self.build()
        self.edit('11-gate-and-sign-off.md', '| Data owner | Mahmoud | Approved | 2026-10-23T11:01:02Z |',
                  '| Data owner | Mahmoud | Approved | 2026-10-23 |')
        self.expect(self.check(), ('11-gate-and-sign-off.md', 'Data owner', 'UTC time'),
                    self.mismatch('11-gate-and-sign-off.md'))

    def test_check_signoff_role_missing_problem(self):
        self.build()
        text = self.read('11-gate-and-sign-off.md')
        line = next(l for l in text.splitlines() if l.startswith('| Data owner |'))
        self.write('11-gate-and-sign-off.md', text.replace(line + '\n', ''))
        self.expect(self.check(), ('11-gate-and-sign-off.md', 'Sign-off register', 'Data owner'),
                    self.mismatch('11-gate-and-sign-off.md'))

    def test_check_signoff_migration_owner_without_overlay_problem(self):
        self.build()
        text = self.read('11-gate-and-sign-off.md')
        line = next(l for l in text.splitlines() if l.startswith('| Data owner |'))
        extra = '| Migration owner (if relevant) | Mahmoud | Approved | 2026-10-23T11:01:02Z | Counted |'
        self.write('11-gate-and-sign-off.md', text.replace(line, line + '\n' + extra))
        self.expect(self.check(), ('11-gate-and-sign-off.md', 'Migration owner (if relevant)', 'overlay'),
                    self.mismatch('11-gate-and-sign-off.md'))

    def test_check_signoff_signed_without_name_problem(self):
        self.build()
        self.edit('11-gate-and-sign-off.md', '| Network owner | Mahmoud | Approved |', '| Network owner | TBD | Approved |')
        self.expect(self.check(), ('11-gate-and-sign-off.md', 'Network owner', 'name'),
                    self.mismatch('11-gate-and-sign-off.md'))

    def test_check_twelve_section_missing_problem(self):
        self.build()
        self.edit('12-sdd-handoff-guide.md', '## 12.6 When the SDD Disagrees', '## When the SDD Disagrees')
        self.only(self.check(), '12-sdd-handoff-guide.md', '12.6 When the SDD Disagrees')

    def test_check_twelve_gate_row_problem(self):
        self.build()
        self.edit('12-sdd-handoff-guide.md', '| Gate | G3 Approved |', '| Gate | G2 |')
        self.only(self.check(), '12-sdd-handoff-guide.md', 'Gate', 'G3 Approved')

    def test_check_em_dash_problem(self):
        self.build()
        self.edit('00-cover-and-changelog.md', 'Contents.', 'Contents \u2014 all of them.')
        self.only(self.check(), '00-cover-and-changelog.md', 'em or en dash')

    def test_check_en_dash_problem(self):
        self.build()
        self.edit('decision-log.md', 'None yet.', 'None yet \u2013 later.')
        self.only(self.check(), 'decision-log.md', 'em or en dash')

    def test_check_sdd_pass(self):
        self.build()
        self.build_sdd()
        self.assertEqual(self.check_sdd(), [])

    def test_check_sdd_cover_missing_problem(self):
        self.build()
        self.build_sdd()
        (self.sdd / '00-cover-and-changelog.md').unlink()
        self.only(self.check_sdd(), '00-cover-and-changelog.md', 'not found')

    def test_check_sdd_source_key_problem(self):
        self.build()
        self.build_sdd(key='PRE')
        self.only(self.check_sdd(), 'Source Pre-SDD', 'Key', 'PSDD')

    def test_check_sdd_source_version_problem(self):
        self.build()
        self.build_sdd(version='0.9')
        self.only(self.check_sdd(), 'Source Pre-SDD', 'Version', '1.0')

    def test_check_sdd_source_gate_problem(self):
        self.build()
        self.build_sdd(gate='G2')
        self.only(self.check_sdd(), 'Source Pre-SDD', 'Gate', 'G3 Approved')

    def test_check_sdd_source_link_problem(self):
        self.build()
        self.build_sdd(link=f'../pre-sdd-other/{MASTER}')
        self.only(self.check_sdd(), 'Source Pre-SDD', 'Link')

    def test_check_sdd_source_table_missing_problem(self):
        self.build()
        self.build_sdd()
        cover = self.sdd / '00-cover-and-changelog.md'
        text = cover.read_text(encoding='utf-8').replace('### Source Pre-SDD', '### Pre-SDD')
        cover.write_text(text, encoding='utf-8', newline='\n')
        self.only(self.check_sdd(), 'Source Pre-SDD', 'no')

    def test_check_sdd_unknown_entry_problem(self):
        self.build()
        self.build_sdd(extra='\nAlso [PSDD/REL-03.9](z).\n')
        self.only(self.check_sdd(), '14-performance-and-capacity.md', 'PSDD/REL-03.9')

    def test_check_sdd_unknown_row_problem(self):
        self.build()
        self.build_sdd(extra='\nAlso PSDD/OVL-04 for the 7R.\n')
        self.only(self.check_sdd(), '14-performance-and-capacity.md', 'PSDD/OVL-04')

    def test_check_sdd_unknown_id_problem(self):
        self.build()
        self.build_sdd(extra='\nAnd PSDD/QD-99 and PSDD/CALC-21@OPT-07.\n')
        self.expect(self.check_sdd(), ('PSDD/QD-99',), ('PSDD/CALC-21@OPT-07',))

    def test_check_sdd_calc_value_problem(self):
        self.build()
        self.build_sdd(peak='55')
        self.only(self.check_sdd(), '14-performance-and-capacity.md', 'PSDD/CALC-02', '55', '50')

    def test_check_sdd_calc_value_formatted_pass(self):
        self.build()
        self.build_sdd(avg='10.0')
        self.assertEqual(self.check_sdd(), [])


if __name__ == '__main__':
    unittest.main()
