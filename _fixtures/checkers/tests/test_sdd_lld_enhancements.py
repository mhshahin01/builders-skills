from pathlib import Path
import contextlib
import hashlib
import importlib.util
import io
import re
import runpy
import shutil
import sys
import tempfile
import unittest
import warnings

CHECKERS = Path(__file__).resolve().parents[1]
ROOT = CHECKERS.parents[1]
FC = ROOT / '_fixtures/chain/run-2026-10-13-fc'
SDD_NEW = ('05-1-workflows.md', '05-2-sequences.md', '05a-infrastructure-and-network.md', '20-for-ppt.md')
LLD_NEW = ('03a-libraries-and-conventions.md', '19-for-ppt.md')
SDD_LINKS = '[architecture](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram) and [principles](./06-principles-and-decisions.md)'
LLD_LINKS = '[architecture](./03-architecture.md#6-architecture-overview) and [references](./16-references.md)'
SDD_BROKEN = '[gone](./no-such-file.md) and [anchor](./06-principles-and-decisions.md#no-such-heading)'
LLD_BROKEN = '[gone](./no-such-file.md) and [anchor](./03-architecture.md#no-such-heading)'
E4_MET = 'E4 reconciled 2026-10-10 vs last Changes Log date 2026-10-10: met (by content hash: chunks 00-17 hash to sha256:96819fd891ef423f'
EM_DASH = chr(0x2014)
SECTION_SIGN = chr(0xA7)
CHUNKS_LISTS = {
    'sdd': '13b, 18',
    'lld': '04-implementation/loyalty-points.md, 04-implementation/payout.md, 04-implementation/refund-request.md, 05, 07, 10, 13, 15, 18',
}


def chunk_id(name):
    return re.match(r'\d{2}[a-z0-9]*', name)[0]


def chunk(chunk_number, version, part, body):
    return (f'<!--\nCHUNK: {chunk_number}\nTITLE: Test chunk\nPROJECT: Refunds Platform\nVERSION: {version}\n'
            f'PART OF: {part} - Refunds Platform\n-->\n\n{body}\n')


def chunk_file(name, version, part, body):
    return chunk(chunk_id(name), version, part, body)


def decision_log(body):
    return f'<!--\nTYPE: Decision Log\nPROJECT: Refunds Platform\nVERSION: 1.2\nPART OF: LLD - Refunds Platform\n-->\n\n{body}\n'


def deck_text(number, state, version, part, extra=''):
    status = f'**Brief status:** {state} | **Basis:** {part} v{version} | **Gate verified:** 2026-10-25 | **New items raised while writing this brief:** 0'
    return chunk(number, version, part, f'# Deck Brief\n\n{status}\n\n{extra}')


def master_value(state):
    return {'Locked': 'Locked - not written', 'Stale': 'Stale - a cited chunk changed'}.get(state, state)


def sequence(messages=40):
    return '```mermaid\nsequenceDiagram\n' + ''.join(f'  A->>B: step {i}\n' for i in range(messages)) + '```\n'


def flowchart(nodes=40):
    return '```mermaid\nflowchart TB\n' + ''.join(f'  N{i}["Node"] --> M{i}["Node"]\n' for i in range(nodes)) + '```\n'


def to_new_shape(text):
    out = []
    in_table = False
    for line in text.split('\n'):
        if line.startswith('| Layer | Technology / Service | Version / Tier | Notes |'):
            out.append('| Layer | Technology / Service | Version / Tier | Status | Source | Notes |')
            in_table = True
        elif in_table and line.startswith('|-'):
            out.append('|-------|----------------------|----------------|--------|--------|-------|')
        elif in_table and line.startswith('|'):
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            notes = cells[3]
            status = 'Proposed' if '**Proposed**' in notes else 'Confirmed'
            source = ('BRD-mandated (REFUNDS)' if 'BRD-mandated' in notes else 'questionnaire' if 'questionnaire' in notes
                      else 'skill default' if 'default' in notes else 'recommended (evidence)')
            out.append('| ' + ' | '.join([*cells[:3], status, source, notes]) + ' |')
        else:
            in_table = False
            out.append(line)
    landscape = (
        '**Integration landscape:**\n\n'
        f'| System | Owner (role) | Role in the eco-system | Interface style | Spec source | {SECTION_SIGN}12 row |\n'
        '|--------|--------------|------------------------|-----------------|-------------|---------|\n'
        '| CardPay Ltd | Payment provider | Payment provider | Synchronous API and callback | Awaiting | [INT-01](./08-integrations.md#12-integrations) |\n'
        '| Platform IAM | Platform team | Identity provider | Synchronous API | Awaiting | [INT-04](./08-integrations.md#12-integrations) |\n\n')
    shaped = '\n'.join(out)
    marker = '<!-- MASTER:'
    return shaped.replace(marker, landscape + marker, 1)


class Base(unittest.TestCase):
    def cli(self, name, *args):
        argv, path = sys.argv, list(sys.path)
        out = io.StringIO()
        sys.argv = [name, *map(str, args)]
        sys.path.insert(0, str(CHECKERS))
        try:
            with contextlib.redirect_stdout(out), warnings.catch_warnings():
                warnings.simplefilter('ignore', ResourceWarning)
                runpy.run_path(str(CHECKERS / name), run_name='__main__')
        finally:
            sys.argv = argv
            sys.path[:] = path
        return out.getvalue()

    def write(self, path, text):
        Path(path).write_text(text, encoding='utf-8', newline='\n')

    def edit(self, path, old, new):
        text = path.read_text(encoding='utf-8')
        self.assertIn(old, text)
        self.write(path, text.replace(old, new, 1))

    def version(self, folder):
        master = next(folder.glob('*-master.md')).read_text(encoding='utf-8')
        return re.search(r'^VERSION:\s*(\S+)', master, re.M)[1]

    def problems(self, out):
        return int(re.search(r'^problems: (\d+)$', out, re.M)[1])

    def stat(self, out, key):
        return int(re.search(rf'^{key}: (\d+)', out, re.M)[1])

    def deck_number(self, folder):
        return '20' if folder.name.startswith('sdd-') else '19'

    def put_deck(self, folder, state, text=None):
        number = self.deck_number(folder)
        part = folder.name[:3].upper()
        self.write(folder / f'{number}-for-ppt.md', deck_text(number, state, self.version(folder), part) if text is None else text)

    def master_deck_line(self, folder, value):
        number = self.deck_number(folder)
        master = next(folder.glob('*-master.md'))
        text = re.sub(rf'^\*\*Deck brief \(chunk {number}\):\*\*.*\n', '', master.read_text(encoding='utf-8'), flags=re.M)
        if value is not None:
            line = f'**Deck brief (chunk {number}):** {value}\n'
            basis = re.search(r'^\*\*E2E basis:\*\*.*\n', text, re.M)
            text = text[:basis.end()] + line + text[basis.end():] if basis else text.rstrip('\n') + '\n\n' + line
        self.write(master, text)

    def set_gate(self, folder, value):
        master = next(folder.glob('*-master.md'))
        text = master.read_text(encoding='utf-8')
        text = re.sub(r'^\*\*E2E gate \(chunk 19\):\*\*.*\n', '' if value is None else f'**E2E gate (chunk 19):** {value}\n', text, flags=re.M)
        self.write(master, text)


class FcRun(Base):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='enh-chunks-')
        self.run = Path(self.tmp.name) / 'run'
        shutil.copytree(FC, self.run)
        self.sdd = self.run / 'sdd-refunds-platform'
        self.lld = self.run / 'lld-refunds-platform'

    def tearDown(self):
        self.tmp.cleanup()

    def linkcheck(self, folder):
        out = self.cli('_linkcheck.py', folder)
        links, bad = (int(v) for v in re.search(r'^LINKS (\d+) SDD_REFS \d+ BAD (\d+)$', out, re.M).groups())
        return links, bad, int(re.search(r'^FILES (\d+)$', out, re.M)[1]), out


class NewChunkNames(FcRun):
    def test_f1_sdd_deck_chunk_20_unlisted_gives_no_problem_while_other_unlisted_chunks_do(self):
        ver = self.version(self.sdd)
        self.assertEqual(self.problems(self.cli('check_versions.py', self.sdd)), 0)
        for name in ('19-for-ppt.md', '05a-infrastructure-and-network.md'):
            self.write(self.sdd / name, chunk_file(name, ver, 'SDD', '# Deck brief'))
            out = self.cli('check_versions.py', self.sdd)
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'Chunks: does not list {name} but it carries VERSION {ver}', out)
            (self.sdd / name).unlink()
        self.put_deck(self.sdd, 'Stale')
        self.master_deck_line(self.sdd, master_value('Stale'))
        self.assertEqual(self.problems(self.cli('check_versions.py', self.sdd)), 0)

    def test_f1_lld_deck_chunk_19_unlisted_gives_no_problem_while_other_unlisted_chunks_do(self):
        ver = self.version(self.lld)
        self.assertEqual(self.problems(self.cli('check_versions.py', self.lld)), 0)
        for name in ('20-for-ppt.md', '03a-libraries-and-conventions.md'):
            self.write(self.lld / name, chunk_file(name, ver, 'LLD', '# Deck brief'))
            out = self.cli('check_versions.py', self.lld)
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'Chunks: does not list {name} but it carries VERSION {ver}', out)
            (self.lld / name).unlink()
        self.put_deck(self.lld, 'Stale')
        self.master_deck_line(self.lld, master_value('Stale'))
        self.assertEqual(self.problems(self.cli('check_versions.py', self.lld)), 0)

    def test_f1_chunk_ids_05_and_05a_select_their_own_files(self):
        ver = self.version(self.sdd)
        self.edit(self.sdd / '00-cover-and-changelog.md', 'Chunks: 13b, 18', 'Chunks: 05, 05a, 13b, 18')
        (self.sdd / '05-workflows-and-sequences.md').unlink()
        names = {'05-1-workflows.md': '05', '05-2-sequences.md': '05', '05a-infrastructure-and-network.md': '05a'}
        for name, chunk_number in names.items():
            self.write(self.sdd / name, chunk(chunk_number, ver, 'SDD', 'text'))
        self.assertEqual(self.problems(self.cli('check_versions.py', self.sdd)), 0)
        self.write(self.sdd / '05-2-sequences.md', chunk('05', '1.3', 'SDD', 'text'))
        out = self.cli('check_versions.py', self.sdd)
        self.assertIn(f'Chunks: lists 05 but 05-2-sequences.md carries VERSION 1.3, not {ver}', out)
        self.assertEqual(self.problems(out), 1, out)
        self.write(self.sdd / '05-2-sequences.md', chunk('05', ver, 'SDD', 'text'))
        self.write(self.sdd / '05a-infrastructure-and-network.md', chunk('05a', '1.3', 'SDD', 'text'))
        out = self.cli('check_versions.py', self.sdd)
        self.assertIn(f'Chunks: lists 05a but 05a-infrastructure-and-network.md carries VERSION 1.3, not {ver}', out)
        self.assertEqual(self.problems(out), 1, out)
        self.write(self.sdd / '05a-infrastructure-and-network.md', chunk('05a', ver, 'SDD', 'text'))
        self.edit(self.sdd / '00-cover-and-changelog.md', 'Chunks: 05, 05a, 13b, 18', 'Chunks: 05, 13b, 18')
        out = self.cli('check_versions.py', self.sdd)
        self.assertIn(f'Chunks: does not list 05a-infrastructure-and-network.md but it carries VERSION {ver}', out)
        self.assertEqual(self.problems(out), 1, out)
        self.edit(self.sdd / '00-cover-and-changelog.md', 'Chunks: 05, 13b, 18', 'Chunks: 05a, 13b, 18')
        out = self.cli('check_versions.py', self.sdd)
        self.assertEqual(self.problems(out), 2, out)
        self.assertIn(f'Chunks: does not list 05-1-workflows.md but it carries VERSION {ver}', out)
        self.assertIn(f'Chunks: does not list 05-2-sequences.md but it carries VERSION {ver}', out)

    def test_f1_chunk_ids_13aa_and_13a1_select_their_own_files_and_longer_names_are_no_chunk(self):
        ver = self.version(self.sdd)
        path = self.sdd / '00-cover-and-changelog.md'
        for name, other in (('13aa-service-extra.md', '13aaa-service-extra.md'), ('13a1-service-refund-request-data.md', '13a12-service-refund-request-data.md')):
            ident = chunk_id(name)
            self.write(self.sdd / other, chunk_file(other, ver, 'SDD', 'text'))
            self.assertEqual(self.problems(self.cli('check_versions.py', self.sdd)), 0)
            (self.sdd / other).unlink()
            self.write(self.sdd / name, chunk_file(name, ver, 'SDD', 'text'))
            out = self.cli('check_versions.py', self.sdd)
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'Chunks: does not list {name} but it carries VERSION {ver}', out)
            self.edit(path, 'Chunks: 13b, 18', f'Chunks: {ident}, 13b, 18')
            out = self.cli('check_versions.py', self.sdd)
            self.assertEqual(self.problems(out), 0, out)
            self.write(self.sdd / name, chunk_file(name, '1.3', 'SDD', 'text'))
            out = self.cli('check_versions.py', self.sdd)
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'Chunks: lists {ident} but {name} carries VERSION 1.3, not {ver}', out)
            (self.sdd / name).unlink()
            out = self.cli('check_versions.py', self.sdd)
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'Chunks: lists chunk {ident}, which has no file', out)
            self.edit(path, f'Chunks: {ident}, 13b, 18', 'Chunks: 13b, 18')

    def test_e4_chunk_05_split_pieces_keep_the_hash_in_file_name_order(self):
        self.assertIn(E4_MET, self.cli('check_e2e.py', self.sdd))
        whole = self.sdd / '05-workflows-and-sequences.md'
        text = whole.read_text(encoding='utf-8')
        cut = text.index('\n## 8.5 ') + 1
        whole.unlink()
        self.write(self.sdd / '05-1-workflows.md', text[:cut])
        self.write(self.sdd / '05-2-sequences.md', text[cut:])
        self.assertIn(E4_MET, self.cli('check_e2e.py', self.sdd))
        self.write(self.sdd / '05-1-workflows.md', text[cut:])
        self.write(self.sdd / '05-2-sequences.md', text[:cut])
        out = self.cli('check_e2e.py', self.sdd)
        self.assertIn('NOT met (by content hash: chunks 00-17 hash to sha256:', out)
        self.assertIn('not sha256:96819fd891ef423f', out)
        self.assertNotIn(E4_MET, out)

    def test_e4_hash_takes_chunk_05a_and_leaves_out_the_deck_chunk_20(self):
        ver = self.version(self.sdd)
        self.assertIn(E4_MET, self.cli('check_e2e.py', self.sdd))
        self.write(self.sdd / '20-for-ppt.md', chunk('20', ver, 'SDD', '# Deck brief'))
        self.assertIn(E4_MET, self.cli('check_e2e.py', self.sdd))
        self.write(self.sdd / '05a-infrastructure-and-network.md', chunk('05a', ver, 'SDD', '## 8.6 Infrastructure Architecture'))
        out = self.cli('check_e2e.py', self.sdd)
        self.assertIn('NOT met (by content hash: chunks 00-17 hash to sha256:', out)
        self.assertIn('not sha256:96819fd891ef423f', out)
        (self.sdd / '05a-infrastructure-and-network.md').unlink()
        self.assertIn(E4_MET, self.cli('check_e2e.py', self.sdd))

    def test_e3_inventory_reads_markers_in_chunk_05a_and_not_in_the_deck_chunk_20(self):
        ver = self.version(self.sdd)
        base = self.cli('check_e2e.py', self.sdd)
        self.assertEqual(self.problems(base), 0, base)
        marker = '[NEEDS CLARIFICATION: which regions host the cluster?]'
        self.write(self.sdd / '20-for-ppt.md', chunk('20', ver, 'SDD', marker))
        self.assertEqual(self.cli('check_e2e.py', self.sdd), base)
        (self.sdd / '20-for-ppt.md').unlink()
        self.write(self.sdd / '05a-infrastructure-and-network.md', chunk('05a', ver, 'SDD', marker))
        out = self.cli('check_e2e.py', self.sdd)
        self.assertIn('E3 unclassified marker: 05a-infrastructure-and-network.md: which regions host the cluster?', out)
        self.assertIn("'unclassified markers': 1", out)
        self.assertEqual(self.problems(out), 1, out)

    def assert_service_chunk_name_is_read(self, name, longer):
        ver = self.version(self.sdd)
        base = self.cli('check_e2e.py', self.sdd)
        self.assertEqual(self.problems(base), 0, base)
        marker = '[NEEDS CLARIFICATION: which regions host the extra service?]'
        self.write(self.sdd / longer, chunk_file(longer, ver, 'SDD', marker))
        self.assertEqual(self.cli('check_e2e.py', self.sdd), base)
        (self.sdd / longer).unlink()
        self.write(self.sdd / name, chunk_file(name, ver, 'SDD', marker))
        out = self.cli('check_e2e.py', self.sdd)
        self.assertIn(f'E3 unclassified marker: {name}: which regions host the extra service?', out)
        self.assertIn("'unclassified markers': 1", out)
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn('NOT met (by content hash: chunks 00-17 hash to sha256:', out)

    def test_e3_inventory_reads_markers_in_a_27th_service_chunk_13aa_and_not_in_a_longer_name(self):
        self.assert_service_chunk_name_is_read('13aa-service-extra.md', '13aaa-service-extra.md')

    def test_e3_inventory_reads_markers_in_a_split_service_chunk_13a1_and_not_in_a_longer_name(self):
        self.assert_service_chunk_name_is_read('13a1-service-refund-request-data.md', '13a12-service-refund-request-data.md')

    def test_e3_legacy_scope_reads_markers_in_13aa_and_13a1_chunks_and_not_in_longer_names(self):
        ver = self.version(self.sdd)
        self.edit(next(self.sdd.glob('*-sdd-master.md')), '### E3 marker inventory', '### E3 marker list')
        base = self.cli('check_e2e.py', self.sdd)
        self.assertIn('E3 policy: legacy physical scope', base)
        count = self.stat(base, 'E3 markers')
        marker = '[NEEDS CLARIFICATION: which regions host the extra service?]'
        for name, longer in (('13aa-service-extra.md', '13aaa-service-extra.md'), ('13a1-service-refund-request-data.md', '13a12-service-refund-request-data.md')):
            self.write(self.sdd / longer, chunk_file(longer, ver, 'SDD', marker))
            self.assertEqual(self.stat(self.cli('check_e2e.py', self.sdd), 'E3 markers'), count)
            (self.sdd / longer).unlink()
            self.write(self.sdd / name, chunk_file(name, ver, 'SDD', marker))
            out = self.cli('check_e2e.py', self.sdd)
            self.assertEqual(self.stat(out, 'E3 markers'), count + 1, out)
            self.assertIn(f"'{name}': 1", out)
            (self.sdd / name).unlink()

    def test_linkcheck_sdd_scans_the_new_chunk_names_and_requires_their_header(self):
        links, bad, files, _ = self.linkcheck(self.sdd)
        self.assertEqual(bad, 0)
        for name in SDD_NEW:
            self.write(self.sdd / name, chunk_file(name, '1.4', 'SDD', f'## Section\n\n{SDD_LINKS}'))
        after = self.linkcheck(self.sdd)
        self.assertEqual(after[:3], (links + 2 * len(SDD_NEW), 0, files + len(SDD_NEW)))
        self.assertNotIn('NO HEADER BLOCK', after[3])
        for name in SDD_NEW:
            self.write(self.sdd / name, chunk_file(name, '1.4', 'SDD', f'## Section\n\n{SDD_BROKEN}'))
        broken = self.linkcheck(self.sdd)
        self.assertEqual(broken[1], 2 * len(SDD_NEW))
        for name in SDD_NEW:
            self.assertIn(f'MISSING FILE {name} ./no-such-file.md', broken[3])
            self.assertIn(f'MISSING ANCHOR {name} ./06-principles-and-decisions.md#no-such-heading', broken[3])
        for name in SDD_NEW:
            self.write(self.sdd / name, f'## Section\n\n{SDD_LINKS}\n')
        out = self.linkcheck(self.sdd)[3]
        for name in SDD_NEW:
            self.assertIn(f'NO HEADER BLOCK {name}', out)

    def test_linkcheck_lld_scans_the_new_chunk_names_and_the_companion_decision_log(self):
        links, bad, files, _ = self.linkcheck(self.lld)
        self.assertEqual(bad, 0)
        for name in LLD_NEW:
            self.write(self.lld / name, chunk_file(name, '1.2', 'LLD', f'## Section\n\n{LLD_LINKS}'))
        self.write(self.lld / 'decision-log.md', decision_log(f'# Decision Log\n\n{LLD_LINKS}'))
        after = self.linkcheck(self.lld)
        self.assertEqual(after[:3], (links + 2 * (len(LLD_NEW) + 1), 0, files + len(LLD_NEW) + 1))
        self.assertNotIn('NO HEADER BLOCK', after[3])
        for name in LLD_NEW:
            self.write(self.lld / name, chunk_file(name, '1.2', 'LLD', f'## Section\n\n{LLD_BROKEN}'))
        self.write(self.lld / 'decision-log.md', decision_log(f'## Section\n\n{LLD_BROKEN}'))
        broken = self.linkcheck(self.lld)
        self.assertEqual(broken[1], 2 * (len(LLD_NEW) + 1))
        for name in (*LLD_NEW, 'decision-log.md'):
            self.assertIn(f'MISSING FILE {name} ./no-such-file.md', broken[3])
            self.assertIn(f'MISSING ANCHOR {name} ./03-architecture.md#no-such-heading', broken[3])
        for name in (*LLD_NEW, 'decision-log.md'):
            self.write(self.lld / name, f'## Section\n\n{LLD_LINKS}\n')
        out = self.linkcheck(self.lld)[3]
        for name in LLD_NEW:
            self.assertIn(f'NO HEADER BLOCK {name}', out)
        self.assertNotIn('NO HEADER BLOCK decision-log.md', out)

    def test_check_links_scans_the_new_lld_chunk_names_and_the_companion_decision_log(self):
        base = self.cli('check_links.py', self.run)
        self.assertEqual(self.stat(base, 'broken'), 0)
        names = (*LLD_NEW, 'decision-log.md')
        for name in names:
            self.write(self.lld / name, f'## Section\n\n{LLD_LINKS}\n')
        out = self.cli('check_links.py', self.run)
        self.assertEqual(self.stat(out, 'links checked'), self.stat(base, 'links checked') + 2 * len(names))
        self.assertEqual(self.stat(out, 'broken'), 0)
        for name in names:
            self.write(self.lld / name, f'## Section\n\n{LLD_BROKEN}\n')
        out = self.cli('check_links.py', self.run)
        self.assertEqual(self.stat(out, 'broken'), 2 * len(names))
        for name in names:
            self.assertIn(f'{name} 3 ./no-such-file.md missing file', out)
            self.assertIn(f'{name} 3 ./03-architecture.md#no-such-heading missing anchor', out)

    def test_lld_trace_scans_the_new_lld_chunk_names_and_links_into_the_new_sdd_chunks(self):
        args = [self.lld, self.sdd, 'REFUNDS=' + str(self.run / 'brd-refunds-portal'), 'LOYALTY=' + str(self.run / 'brd-loyalty-points')]
        base = self.cli('check_lld_trace.py', *args)
        self.assertEqual(self.stat(base, 'broken_links'), 0)
        self.write(self.sdd / '05-1-workflows.md', chunk('05', '1.4', 'SDD', '## 8.4 Workflow Diagrams'))
        self.write(self.sdd / '05-2-sequences.md', chunk('05', '1.4', 'SDD', '## 8.5 Sequence Diagrams'))
        self.write(self.sdd / '05a-infrastructure-and-network.md', chunk('05a', '1.4', 'SDD', '## 8.6 Infrastructure Architecture'))
        self.write(self.sdd / '20-for-ppt.md', chunk('20', '1.4', 'SDD', '# Deck brief'))
        into_sdd = ('[workflows](../sdd-refunds-platform/05-1-workflows.md#84-workflow-diagrams) '
                    '[sequences](../sdd-refunds-platform/05-2-sequences.md#85-sequence-diagrams) '
                    '[infrastructure](../sdd-refunds-platform/05a-infrastructure-and-network.md#86-infrastructure-architecture) '
                    '[deck](../sdd-refunds-platform/20-for-ppt.md#deck-brief)')
        uc = '[REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund)'
        names = (*LLD_NEW, 'decision-log.md')
        for name in names:
            self.write(self.lld / name, f'## Section\n\n{LLD_LINKS} {into_sdd} {uc}\n')
        out = self.cli('check_lld_trace.py', *args)
        for key, added in (('broken_links', 0), ('unkeyed_ids', 0), ('unknown_ids', 0), ('links_sdd', 4 * len(names)), ('links_sdd_ok', 4 * len(names)),
                           ('links_internal', 2 * len(names)), ('links_internal_ok', 2 * len(names)),
                           ('links_brd', len(names)), ('links_brd_ok', len(names))):
            self.assertEqual(self.stat(out, key), self.stat(base, key) + added, key)
        for name in names:
            self.write(self.lld / name, '## Section\n\n[x](../sdd-refunds-platform/05a-infrastructure-and-network.md#no-such-heading) UC-01\n')
        out = self.cli('check_lld_trace.py', *args)
        self.assertEqual(self.stat(out, 'broken_links'), len(names))
        self.assertEqual(self.stat(out, 'unkeyed_ids'), len(names))
        self.assertEqual(self.stat(out, 'unknown_ids'), 0)
        for name in names:
            self.assertIn(f"('{name}', 'x', '../sdd-refunds-platform/05a-infrastructure-and-network.md#no-such-heading', 'anchor missing')", out)
            self.assertIn(f"('{name}', 'UC-01', '", out)

    def test_mermaid_sdd_sections_8_6_and_8_7_are_exempt_from_the_diagram_cap(self):
        base = self.cli('check_mermaid.py', self.sdd)
        self.assertIn('issues: 0', base)
        blocks = self.stat(base, 'mermaid blocks')
        exempt = ''.join(f'{head}\n\n{sequence()}\n' for head in (
            '## 8.6 Infrastructure Architecture', '### 8.6.1 Deployment view', '## 8.7 Network Architecture', '### 8.7.1 Ingress path'))
        exempt += ''.join(f'{head}\n\n{flowchart()}\n' for head in ('### 8.6.2 Deployment workflow', '### 8.7.3 Ingress workflow'))
        self.write(self.sdd / '05a-infrastructure-and-network.md', chunk('05a', '1.4', 'SDD', exempt))
        out = self.cli('check_mermaid.py', self.sdd)
        self.assertIn('issues: 0', out)
        self.assertEqual(self.stat(out, 'mermaid blocks'), blocks + 6)
        capped = ''.join(f'{head}\n\n{sequence()}\n' for head in (
            '## 8.5 Sequence Diagrams', '### 8.5.3 Sequence: Ingress', '## 8.8 Extra', '### 8.60 Extra', '### 18.6 Extra'))
        capped += '### 8.5.4 Deployment workflow\n\n' + flowchart() + '\n'
        self.write(self.sdd / '05b-controls.md', chunk('05b', '1.4', 'SDD', capped))
        out = self.cli('check_mermaid.py', self.sdd)
        self.assertEqual(self.stat(out, 'issues'), 6)
        self.assertEqual(out.count('05b-controls.md:'), 6)
        self.assertNotIn('05a-infrastructure-and-network.md:', out)

    def test_mermaid_lld_sections_8_6_and_8_7_stay_capped(self):
        self.assertIn('issues: 0', self.cli('check_mermaid.py', self.lld))
        self.write(self.lld / '03a-libraries-and-conventions.md', chunk('03a', '1.2', 'LLD', f'## 8.6 Deployment\n\n{flowchart()}\n## 8.7 Network\n\n{flowchart()}'))
        out = self.cli('check_mermaid.py', self.lld)
        self.assertEqual(self.stat(out, 'issues'), 2)
        self.assertEqual(out.count('03a-libraries-and-conventions.md:'), 2)


class E4HashScope(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location('e2e_gate_new_names', CHECKERS / '_e2e_gate.py')
        cls.gate = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.gate)

    def hash_of(self, texts, outside, order):
        def digest(names):
            return hashlib.sha256(''.join(texts[name] for name in names).encode('utf-8')).hexdigest()

        with tempfile.TemporaryDirectory(prefix='e4-new-names-') as tmp:
            folder = Path(tmp)
            for name, text in {**texts, **outside}.items():
                (folder / name).write_text(text, encoding='utf-8', newline='')
            self.assertEqual(self.gate.content_hash(str(folder)), digest(order))
            for name in texts:
                (folder / name).write_text(texts[name] + 'changed\n', encoding='utf-8', newline='')
                self.assertNotEqual(self.gate.content_hash(str(folder)), digest(order), name)
                (folder / name).write_text(texts[name], encoding='utf-8', newline='')
            for name in outside:
                (folder / name).write_text('changed\n', encoding='utf-8', newline='')
            self.assertEqual(self.gate.content_hash(str(folder)), digest(order))
            return digest

    def test_content_hash_new_chunk_names_join_in_file_name_order_and_the_deck_stays_out(self):
        texts = {'00-cover-and-changelog.md': '# Cover\n', '04-architecture.md': 'D\n', '05-1-workflows.md': 'W\n', '05-2-sequences.md': 'S\n',
                 '05a-infrastructure-and-network.md': 'I\n', '06-principles.md': 'P\n', '13a-service-a.md': 'A\n', '13b-service-b.md': 'B\n',
                 '17-appendix.md': 'Z\n'}
        outside = {'18-open-items.md': 'out\n', '19-e2e.md': 'out\n', '20-for-ppt.md': 'out\n', 'x-sdd-master.md': 'out\n', 'decision-log.md': 'out\n'}
        in_order = ['00-cover-and-changelog.md', '04-architecture.md', '05-1-workflows.md', '05-2-sequences.md', '05a-infrastructure-and-network.md',
                    '06-principles.md', '13a-service-a.md', '13b-service-b.md', '17-appendix.md']
        digest = self.hash_of(texts, outside, in_order)
        self.assertNotEqual(digest(['00-cover-and-changelog.md', '04-architecture.md', '05a-infrastructure-and-network.md', '05-1-workflows.md',
                                    '05-2-sequences.md', '06-principles.md', '13a-service-a.md', '13b-service-b.md', '17-appendix.md']), digest(in_order))
        self.assertNotEqual(digest(['00-cover-and-changelog.md', '04-architecture.md', '05-2-sequences.md', '05-1-workflows.md',
                                    '05a-infrastructure-and-network.md', '06-principles.md', '13a-service-a.md', '13b-service-b.md', '17-appendix.md']), digest(in_order))

    def test_content_hash_13aa_and_13a1_names_join_in_file_name_order_and_longer_names_stay_out(self):
        texts = {'00-cover-and-changelog.md': '# Cover\n', '13a-service-a.md': 'A\n', '13aa-service-aa.md': 'AA\n', '13ab-service-ab.md': 'AB\n',
                 '13b1-service-b-data.md': 'B1\n', '13b2-service-b-events.md': 'B2\n', '13z-service-z.md': 'Z\n', '14-performance.md': 'P\n'}
        outside = {'13aaa-service-x.md': 'out\n', '13a12-service-y.md': 'out\n', '13a1a-service-z.md': 'out\n', '20-for-ppt.md': 'out\n'}
        in_order = ['00-cover-and-changelog.md', '13a-service-a.md', '13aa-service-aa.md', '13ab-service-ab.md', '13b1-service-b-data.md',
                    '13b2-service-b-events.md', '13z-service-z.md', '14-performance.md']
        digest = self.hash_of(texts, outside, in_order)
        after_z = ['00-cover-and-changelog.md', '13a-service-a.md', '13b1-service-b-data.md', '13b2-service-b-events.md', '13z-service-z.md',
                   '13aa-service-aa.md', '13ab-service-ab.md', '14-performance.md']
        self.assertNotEqual(digest(after_z), digest(in_order))
        without = [name for name in in_order if name not in ('13aa-service-aa.md', '13b1-service-b-data.md')]
        self.assertNotEqual(digest(without), digest(in_order))


class Section6Shapes(FcRun):
    def checks(self):
        args = [self.lld, self.sdd, 'REFUNDS=' + str(self.run / 'brd-refunds-portal'), 'LOYALTY=' + str(self.run / 'brd-loyalty-points')]
        return {
            'check_sdd.py': self.cli('check_sdd.py', self.sdd),
            'check_e2e.py': self.cli('check_e2e.py', self.sdd),
            'check_uc_links.py': self.cli('check_uc_links.py', self.sdd),
            'check_uc_keys.py': self.cli('check_uc_keys.py', self.sdd),
            'check_versions.py': self.cli('check_versions.py', self.sdd),
            '_linkcheck.py': self.cli('_linkcheck.py', self.sdd),
            'check_mermaid.py': self.cli('check_mermaid.py', self.sdd),
            'check_trace.py': self.cli('check_trace.py', self.run),
            'check_lld_trace.py': self.cli('check_lld_trace.py', *args),
        }

    def normalized(self, name, out):
        out = re.sub(r'^LINKS \d+', 'LINKS n', out, flags=re.M)
        out = re.sub(r'^(Resolved internal links with anchors): \d+', r'\1: n', out, flags=re.M)
        return '\n'.join(line for line in out.splitlines() if not line.startswith('E4 reconciled'))

    def test_section_6_new_shape_table_passes_every_checker_that_reads_chunk_02(self):
        before = self.checks()
        c02 = self.sdd / '02-ecosystem-overview.md'
        legacy = c02.read_text(encoding='utf-8')
        shaped = to_new_shape(legacy)
        self.assertIn('| Layer | Technology / Service | Version / Tier | Status | Source | Notes |', shaped)
        self.assertIn('**Integration landscape:**', shaped)
        table = shaped.split('| Layer | Technology / Service | Version / Tier | Status | Source | Notes |\n', 1)[1].split('\n\n', 1)[0].split('\n')
        self.assertGreater(len(table), 10)
        self.assertTrue(all(row.count('|') == 7 for row in table))
        self.write(c02, shaped)
        after = self.checks()
        for name in before:
            self.assertEqual(self.normalized(name, after[name]), self.normalized(name, before[name]), name)
        links = int(re.search(r'^LINKS (\d+)', before['_linkcheck.py'], re.M)[1])
        self.assertIn(f'LINKS {links + 2} ', after['_linkcheck.py'])
        self.assertEqual(self.stat(after['check_uc_links.py'], 'Resolved internal links with anchors'),
                         self.stat(before['check_uc_links.py'], 'Resolved internal links with anchors') + 2)
        self.assertEqual(self.problems(after['check_e2e.py']), 0)
        self.assertIn('NOT met (by content hash: chunks 00-17 hash to sha256:', after['check_e2e.py'])
        self.assertEqual(self.problems(after['check_versions.py']), 0)
        self.assertEqual(self.stat(after['check_mermaid.py'], 'issues'), 0)
        self.assertIn('PROBLEMS: 0', after['check_sdd.py'])
        self.assertIn('Broken links: 0', after['check_uc_links.py'])
        for mutation, name, expected in (
                ('\n[gone](./no-such-file.md)\n', 'check_sdd.py', '02-ecosystem-overview.md: missing file ./no-such-file.md'),
                (f'\na {EM_DASH} b\n', 'check_sdd.py', '02-ecosystem-overview.md:'),
                ('\n[NEEDS CLARIFICATION: which landscape row is missing?]\n', 'check_e2e.py', 'E3 unclassified marker: 02-ecosystem-overview.md: which landscape row is missing?')):
            self.write(c02, shaped.replace('<!-- MASTER:', mutation + '<!-- MASTER:', 1))
            self.assertIn(expected, self.cli(name, self.sdd), mutation)


class MermaidSections(Base):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='enh-mermaid-')
        self.sdd = Path(self.tmp.name) / 'sdd-proto'
        self.lld = Path(self.tmp.name) / 'lld-proto'
        self.sdd.mkdir()
        self.lld.mkdir()

    def tearDown(self):
        self.tmp.cleanup()

    def mermaid(self, folder, name, body):
        path = folder / name
        self.write(path, chunk_file(name, '1.0', folder.name[:3].upper(), body))
        out = self.cli('check_mermaid.py', folder)
        fences = [i + 1 for i, line in enumerate(path.read_text(encoding='utf-8').splitlines()) if line.strip() == '```mermaid']
        flagged = [n for n in fences if f'{name}:{n} (' in out]
        return self.stat(out, 'issues'), flagged, fences

    def test_mermaid_sdd_diagram_under_an_unnumbered_sub_heading_of_8_6_or_8_7_is_exempt(self):
        heads = ('## 8.6 Infrastructure Architecture', '### Deployment view', '#### Deeper unnumbered view', '### 8.6.2 Scaling model',
                 '#### Unnumbered under 8.6.2', '## 8.7 Network Architecture', '### Ingress sketch')
        issues, flagged, fences = self.mermaid(self.sdd, '05a-infrastructure-and-network.md', ''.join(f'{head}\n\n{sequence()}\n' for head in heads))
        self.assertEqual((issues, flagged, len(fences)), (0, [], len(heads)))
        capped = ('## 8.5 Sequence Diagrams', '### Deployment view', '#### Deeper unnumbered view')
        issues, flagged, fences = self.mermaid(self.sdd, '05b-controls.md', ''.join(f'{head}\n\n{sequence()}\n' for head in capped))
        self.assertEqual((issues, flagged), (3, fences))

    def test_mermaid_sdd_an_unnumbered_heading_at_the_same_or_a_shallower_depth_ends_the_exemption(self):
        cases = (('## 8.6 Infrastructure Architecture', '## Appendix'), ('### 8.6.1 Deployment view', '### Summary notes'),
                 ('### 8.6.1 Deployment view', '## Appendix'), ('## 8.7 Network Architecture', '# Annex'))
        body = ''.join(f'{numbered}\n\n{sequence()}\n{plain}\n\n{sequence()}\n' for numbered, plain in cases)
        issues, flagged, fences = self.mermaid(self.sdd, '05a-infrastructure-and-network.md', body)
        self.assertEqual(len(fences), 2 * len(cases))
        self.assertEqual((issues, flagged), (len(cases), fences[1::2]))

    def test_mermaid_sdd_a_hash_line_inside_a_code_fence_is_not_a_heading(self):
        fenced = f'## 8.6 Infrastructure Architecture\n\n```bash\n# install the chart\nhelm install refunds\n```\n\n{sequence()}'
        issues, flagged, fences = self.mermaid(self.sdd, '05a-infrastructure-and-network.md', fenced)
        self.assertEqual((issues, flagged), (0, []))
        plain = f'## 8.6 Infrastructure Architecture\n\n# install the chart\n\n{sequence()}'
        issues, flagged, fences = self.mermaid(self.sdd, '05b-controls.md', plain)
        self.assertEqual((issues, flagged), (1, fences))

    def test_mermaid_sdd_longer_and_tilde_fences_hide_their_hash_lines_and_a_shorter_closer_does_not_close_them(self):
        ticks = chr(96)
        cases = {
            'four backticks around a three backtick fence': f'{ticks * 4}markdown\n{ticks * 3}bash\n# install the chart\n{ticks * 3}\n# still inside\n{ticks * 4}',
            'tildes': '~~~\n# install the chart\n~~~',
            'tildes around a backtick fence': f'~~~\n{ticks * 3}\n# install the chart\n{ticks * 3}\n~~~',
            'five backticks around four': f'{ticks * 5}\n{ticks * 4}\n# install the chart\n{ticks * 5}',
        }
        for label, fenced in cases.items():
            issues, flagged, fences = self.mermaid(self.sdd, '05a-infrastructure-and-network.md', f'## 8.6 Infrastructure Architecture\n\n{fenced}\n\n{sequence()}')
            self.assertEqual((issues, flagged), (0, []), label)
            issues, flagged, fences = self.mermaid(self.sdd, '05b-controls.md', f'## 8.6 Infrastructure Architecture\n\n{fenced}\n\n# install the chart\n\n{sequence()}')
            self.assertEqual((issues, flagged), (1, fences), label)
            (self.sdd / '05b-controls.md').unlink()

    def test_mermaid_lld_diagram_under_an_unnumbered_sub_heading_of_6_1_is_exempt_and_the_cap_returns_after_it(self):
        heads = ('## 6.1 Component Topology', '### Layered view', '## Appendix', '## 6.2 Deployment Topology')
        issues, flagged, fences = self.mermaid(self.lld, '03-architecture.md', ''.join(f'{head}\n\n{flowchart()}\n' for head in heads))
        self.assertEqual(len(fences), len(heads))
        self.assertEqual((issues, flagged), (2, fences[2:]))


class DeckFixtures(Base):
    KIND = 'sdd'

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='enh-deck-')
        self.doc = Path(self.tmp.name) / f'{self.KIND}-refunds-platform'
        shutil.copytree(FC / f'{self.KIND}-refunds-platform', self.doc)
        self.number = self.deck_number(self.doc)
        self.part = self.KIND.upper()
        self.deck = self.doc / f'{self.number}-for-ppt.md'
        self.ver = self.version(self.doc)

    def tearDown(self):
        self.tmp.cleanup()

    def versions(self):
        return self.cli('check_versions.py', self.doc)

    def set_states(self, status, master):
        self.put_deck(self.doc, status)
        self.master_deck_line(self.doc, None if master is None else master_value(master))

    def set_chunks(self, listing):
        path = next(self.doc.glob('00-*.md'))
        lines = path.read_text(encoding='utf-8').split('\n')
        start = next(i for i, line in enumerate(lines) if line.startswith('## Changes Log'))
        end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith('#')), len(lines))
        row = max(i for i in range(start + 1, end) if lines[i].startswith('|'))
        body = lines[row].rstrip()
        body = re.sub(r'\s*Chunks:.*$', '', body[:-1].rstrip() if body.endswith('|') else body)
        lines[row] = f'{body} Chunks: {listing} |'
        self.write(path, '\n'.join(lines))

    def open_gate(self):
        self.set_gate(self.doc, 'Open - Up to date')


class DeckRules:
    def test_deck_state_status_line_and_master_line_agree_for_every_state_and_a_difference_is_a_problem(self):
        base = self.versions()
        self.assertEqual(self.problems(base), 0, base)
        self.assertNotIn('gate state', base)
        self.open_gate()
        for state in ('Stale', 'Up to date', 'Provisional (OI-02)', 'Provisional (OI-01, OI-02)'):
            self.set_states(state, state)
            out = self.versions()
            self.assertEqual(self.problems(out), 0, out)
            self.assertIn(f'gate state {self.number}: status line {state}, master Deck brief line {state}', out)
        for status, master in (('Stale', 'Provisional (OI-02)'), ('Provisional (OI-01)', 'Provisional (OI-01, OI-02)')):
            self.set_states(status, master)
            out = self.versions()
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'chunk {self.number} state differs: status line {status}, master Deck brief line {master}', out)

    def test_deck_state_without_a_chunk_file_reads_locked_or_nothing(self):
        base = self.versions()
        self.master_deck_line(self.doc, None)
        self.assertEqual(self.versions(), base)
        self.master_deck_line(self.doc, 'Locked - not written')
        out = self.versions()
        self.assertEqual(self.problems(out), 0, out)
        self.assertIn(f'gate state {self.number}: master Deck brief line Locked (no chunk file)', out)
        for state in ('Stale', 'Up to date', 'Provisional (OI-02)'):
            self.master_deck_line(self.doc, master_value(state))
            out = self.versions()
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'chunk {self.number} does not exist but reads {state} in: master Deck brief line', out)

    def test_deck_state_with_a_chunk_file_never_reads_locked_and_needs_both_lines(self):
        self.set_states('Locked', 'Locked')
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'chunk {self.number} exists but reads Locked in: status line, master Deck brief line', out)
        self.set_states('Stale', None)
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} exists but the master has no Deck brief (chunk {self.number}) line', out)
        self.put_deck(self.doc, 'Stale', chunk(self.number, self.ver, self.part, '# Deck Brief\n\nNo status line here.'))
        self.master_deck_line(self.doc, master_value('Stale'))
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} exists but has no status line', out)
        self.set_states('Stale', 'Stale')
        self.assertEqual(self.problems(self.versions()), 0)

    def test_deck_state_unknown_state_text_is_a_problem(self):
        for bad in ('Draft', 'Provisional', 'Provisional ()', 'provisional (OI-02)', 'Up-to-date', 'Stale.', '[Up to date / Stale]'):
            self.set_states(bad, 'Stale')
            out = self.versions()
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'{self.deck.name}: status line carries no known state: {bad}', out)
            self.set_states('Stale', bad)
            out = self.versions()
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'master Deck brief (chunk {self.number}) line carries no known state: {bad}', out)
        self.set_states('Stale', 'Stale')
        self.assertEqual(self.problems(self.versions()), 0)

    def test_deck_state_provisional_names_only_items_that_exist_in_chunk_18(self):
        self.set_states('Provisional (OI-02)', 'Provisional (OI-02)')
        self.assertEqual(self.problems(self.versions()), 0)
        for state, missing in (('Provisional (OI-99)', 'OI-99'), ('Provisional (OI-02, OI-99)', 'OI-99')):
            self.set_states(state, state)
            out = self.versions()
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'{self.deck.name} names {missing}, which is not an item of chunk 18', out)

    def test_deck_state_provisional_reference_must_be_open_item_numbers_for_both_kinds(self):
        for bad in ('Provisional (flag 3)', 'Provisional (OI-1a)', 'Provisional (OI-02 OI-03)', 'Provisional (OI-02,OI-03)',
                    'Provisional (Confirm: 03a-libraries-and-conventions.md)', 'Provisional (TODO in 06-api-contracts.md, line 12)',
                    'Provisional (Confirm in OI-02)'):
            self.set_states(bad, 'Stale')
            out = self.versions()
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'{self.deck.name}: status line carries no known state: {bad}', out)
        self.set_states('Provisional (OI-02, OI-03)', 'Provisional (OI-02, OI-03)')
        self.assertEqual(self.problems(self.versions()), 0)

    def test_deck_state_provisional_does_not_count_an_item_heading_inside_an_html_comment(self):
        c18 = next(self.doc.glob('18-*.md'))
        text = c18.read_text(encoding='utf-8')
        self.write(c18, text.rstrip('\n') + '\n\n<!--\n### OI-77 Example item in a template comment\n- **Status:** Open\n-->\n')
        self.set_states('Provisional (OI-02)', 'Provisional (OI-02)')
        self.assertEqual(self.problems(self.versions()), 0)
        self.set_states('Provisional (OI-77)', 'Provisional (OI-77)')
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} names OI-77, which is not an item of chunk 18', out)
        self.write(c18, text.rstrip('\n') + '\n\n### OI-77 A real item\n- **Status:** Open\n')
        self.assertEqual(self.problems(self.versions()), 0)

    def test_deck_content_marker_em_dash_and_mermaid_block_are_problems(self):
        self.set_states('Stale', 'Stale')
        self.assertEqual(self.problems(self.versions()), 0)
        bad = (('[NEEDS CLARIFICATION: which region?]', 'holds a clarification marker'), (f'a {EM_DASH} b', 'holds an em dash'),
               ('```mermaid\nflowchart TB\n  A --> B\n```', 'holds a Mermaid block'))
        for extra, message in bad:
            self.put_deck(self.doc, 'Stale', deck_text(self.number, 'Stale', self.ver, self.part, extra))
            out = self.versions()
            self.assertEqual(self.problems(out), 1, out)
            self.assertIn(f'{self.deck.name} {message}', out)

    def test_deck_chunks_list_never_names_the_deck_chunk(self):
        self.set_states('Stale', 'Stale')
        self.set_chunks(CHUNKS_LISTS[self.KIND])
        out = self.versions()
        self.assertEqual(self.problems(out), 0, out)
        message = f'Chunks: lists chunk {self.number}, the deck brief, which a Changes Log row never lists'
        self.set_chunks(f'{CHUNKS_LISTS[self.KIND]}, {self.number}')
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(message, out)
        self.assertNotIn('carries VERSION', out)
        self.set_chunks(self.number)
        out = self.versions()
        self.assertIn(message, out)
        self.assertNotIn('names sections', out)

    def test_deck_state_is_read_only_in_the_chunk_of_its_own_kind(self):
        other = '19' if self.KIND == 'sdd' else '20'
        self.write(self.doc / f'{other}-for-ppt.md', chunk(other, '0.1', self.part, '# Not a deck\n\n**Brief status:** Locked | **Basis:** none'))
        out = self.versions()
        self.assertEqual(self.problems(out), 0, out)
        self.assertNotIn('gate state', out)
        self.set_states('Stale', 'Stale')
        self.assertIn(f'gate state {self.number}: status line Stale, master Deck brief line Stale', self.versions())


class DeckStateSdd(DeckRules, DeckFixtures):
    KIND = 'sdd'

    def test_deck_state_sdd_up_to_date_needs_the_e2e_gate_open(self):
        self.set_states('Up to date', 'Up to date')
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} is Up to date but the master E2E gate line reads: Locked - E1 met', out)
        for state in ('Stale', 'Provisional (OI-02)'):
            self.set_states(state, state)
            self.assertEqual(self.problems(self.versions()), 0)
        self.set_states('Up to date', 'Up to date')
        self.open_gate()
        self.assertEqual(self.problems(self.versions()), 0)
        self.set_gate(self.doc, None)
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} is Up to date but the master has no E2E gate (chunk 19) line', out)

    def test_deck_chunks_list_sdd_chunk_19_the_e2e_design_is_a_content_chunk_and_may_be_listed(self):
        self.set_states('Stale', 'Stale')
        self.write(self.doc / '19-e2e-system-design.md', chunk('19', self.ver, 'SDD', '# E2E'))
        self.set_chunks('13b, 18')
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'Chunks: does not list 19-e2e-system-design.md but it carries VERSION {self.ver}', out)
        self.set_chunks('13b, 18, 19')
        out = self.versions()
        self.assertEqual(self.problems(out), 0, out)


class DeckStateLld(DeckRules, DeckFixtures):
    KIND = 'lld'

    def open_gate(self):
        c18 = next(self.doc.glob('18-*.md'))
        self.write(c18, re.sub(r'^(- \*\*Status:\*\*) Open[ \t]*$', r'\1 Accepted - applied', c18.read_text(encoding='utf-8'), flags=re.M))

    def test_deck_state_lld_up_to_date_needs_chunk_18_cleared(self):
        self.set_states('Up to date', 'Up to date')
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} is Up to date but chunk 18 is not cleared: OI-29: Open, OI-35: Open, OI-67: Open', out)
        self.open_gate()
        self.assertEqual(self.problems(self.versions()), 0)
        c18 = next(self.doc.glob('18-*.md'))
        self.edit(c18, '- **Status:** Accepted - applied', '- **Status:** Deferred')
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} is Up to date but chunk 18 is not cleared: OI-01: Deferred', out)
        for state in ('Stale', 'Provisional (OI-02)'):
            self.set_states(state, state)
            self.assertEqual(self.problems(self.versions()), 0)
        self.set_states('Up to date', 'Up to date')
        self.set_chunks(CHUNKS_LISTS['lld'].rsplit(', ', 1)[0])
        c18.unlink()
        out = self.versions()
        self.assertEqual(self.problems(out), 1, out)
        self.assertIn(f'{self.deck.name} is Up to date but the LLD has no chunk 18', out)


class DeckStateScope(FcRun):
    def test_deck_state_is_not_read_in_a_brd_folder(self):
        brd = self.run / 'brd-refunds-portal'
        base = self.cli('check_versions.py', brd)
        self.assertEqual(self.problems(base), 0, base)
        master = next(brd.glob('*-master.md'))
        self.write(master, master.read_text(encoding='utf-8').rstrip('\n') + '\n\n**Deck brief (chunk 20):** Up to date\n')
        self.write(brd / '20-for-ppt.md', deck_text('20', 'Locked', '0.1', 'BRD'))
        out = self.cli('check_versions.py', brd)
        self.assertEqual(self.problems(out), 0, out)
        self.assertNotIn('gate state 20', out)
        self.put_deck(self.sdd, 'Locked')
        self.master_deck_line(self.sdd, master_value('Locked'))
        self.assertIn('gate state 20: status line Locked, master Deck brief line Locked', self.cli('check_versions.py', self.sdd))


if __name__ == '__main__':
    unittest.main()
