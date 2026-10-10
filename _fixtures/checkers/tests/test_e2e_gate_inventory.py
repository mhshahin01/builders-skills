"""Verify the semantic E3 inventory reader, including relocation and exemptions."""
from pathlib import Path
import importlib.util
import unittest
import tempfile,shutil,subprocess,sys,os,re

PATH=Path(__file__).resolve().parents[1]/'_e2e_gate.py'

def load():
    spec=importlib.util.spec_from_file_location('e2e_gate_inventory',PATH)
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

def inventory(source='07-cross-cutting-concerns.md',decision='Yes: needed by saga',owner='DPO',claim='24.8 staff retention claim',action='Supply the basis',question='lawful basis'):
    return ('### E3 marker inventory\n\n'
            '| Marker source / question | Owner | Dependent E2E claim / reference path | Blocks E3 / reason | Next action |\n'
            '|---|---|---|---|---|\n'
            f'| [{source}](./{source}#security): {question} | {owner} | {claim} | {decision} | {action} |\n')

class E3Inventory(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.gate=load()

    def test_claim_blocker_outside_old_scope(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]'}
        result=self.gate.evaluate_inventory(files,inventory())
        self.assertEqual(result['blockers'],{'07-cross-cutting-concerns.md':1})
        self.assertEqual(result['problems'],[])

    def test_move_marker_requires_inventory_update(self):
        files={'14-performance-and-capacity.md':'[NEEDS CLARIFICATION: lawful basis]'}
        result=self.gate.evaluate_inventory(files,inventory())
        self.assertTrue(result['problems'])
        moved=self.gate.evaluate_inventory(files,inventory(source='14-performance-and-capacity.md'))
        self.assertEqual(moved['blockers'],{'14-performance-and-capacity.md':1})

    def test_nonblocking_capacity_requires_reason(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]'}
        good=self.gate.evaluate_inventory(files,inventory(decision='No: not asserted by any E2E claim',claim='None',action='Owner follow-up'))
        self.assertEqual(good['blockers'],{})
        self.assertEqual(good['problems'],[])
        bad=self.gate.evaluate_inventory(files,inventory(decision='No',claim='None'))
        self.assertTrue(bad['problems'])

    def test_partial_answer_keeps_remainder_blocking(self):
        files={'07-cross-cutting-concerns.md':'Settled policy. [NEEDS CLARIFICATION: lawful basis]'}
        self.assertTrue(self.gate.evaluate_inventory(files,inventory())['blockers'])

    def test_owner_and_blocking_claim_required(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]'}
        for kwargs in ({'owner':'[Named owner]'},{'claim':'None'},{'action':''}):
            with self.subTest(kwargs=kwargs):
                self.assertTrue(self.gate.evaluate_inventory(files,inventory(**kwargs))['problems'])

    def test_external_black_box_placeholder_exempt(self):
        files={'11-api-contracts.md':'[TBD - EXTERNAL: provider URI]'}
        result=self.gate.evaluate_inventory(files,'### E3 marker inventory\n\nNone. Checked all body sources.\n')
        self.assertEqual(result['blockers'],{})
        self.assertEqual(result['problems'],[])

    def test_external_placeholder_row_blocks_when_exception_fails(self):
        files={'11-api-contracts.md':'**[TBD - EXTERNAL: provider URI]**'}
        result=self.gate.evaluate_inventory(files,inventory(source='11-api-contracts.md',claim='24.7 asserts the provider URI',question='provider URI'))
        self.assertEqual(result['blockers'],{'11-api-contracts.md':1})
        self.assertEqual(result['problems'],[])

    def test_no_inventory_is_legacy_not_semantic_pass(self):
        result=self.gate.evaluate_inventory({'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]'},'No inventory')
        self.assertEqual(result['mode'],'legacy')
        self.assertEqual(result['unclassified'],1)

    def test_incomplete_inventory_cannot_claim_open(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]\n[NEEDS CLARIFICATION: provider timeout]'}
        result=self.gate.evaluate_inventory(files,inventory())
        self.assertEqual(result['unclassified'],1)
        self.assertTrue(any('unclassified' in p for p in result['problems']))

    def test_duplicate_or_obsolete_rows_fail(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]'}
        text=inventory();row=text.splitlines()[-1]
        self.assertTrue(self.gate.evaluate_inventory(files,text+row+'\n')['problems'])
        self.assertTrue(self.gate.evaluate_inventory({},text)['problems'])

    def test_contained_question_does_not_classify_second_marker(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis for staff data]\n[NEEDS CLARIFICATION: lawful basis]'}
        result=self.gate.evaluate_inventory(files,inventory(question='lawful basis for staff data'))
        self.assertEqual(result['blockers'],{'07-cross-cutting-concerns.md':1})
        self.assertEqual(result['unclassified'],1)
        self.assertIn('E3 unclassified marker: 07-cross-cutting-concerns.md: lawful basis',result['problems'])

    def test_question_with_link_still_matches(self):
        question='the hour the summary is sent ([REFUNDS/UC-04](../brd/06b.md#uc-04) BR-2)'
        files={'15-environments.md':'[NEEDS CLARIFICATION: '+question+']'}
        result=self.gate.evaluate_inventory(files,inventory(source='15-environments.md',decision='No: no E2E claim uses it',claim='None',question=question))
        self.assertEqual(result['problems'],[])
        self.assertEqual(result['unclassified'],0)

    def test_owner_sentence_at_marker_end_still_matches(self):
        for marker in ('lawful basis? Owner: DPO.','lawful basis? Owners: DPO and Legal.'):
            files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: '+marker+']'}
            for asked in ('lawful basis?',marker):
                result=self.gate.evaluate_inventory(files,inventory(question=asked))
                self.assertEqual(result['problems'],[],(marker,asked))
                self.assertEqual(result['blockers'],{'07-cross-cutting-concerns.md':1})
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: which owner: field holds the basis?]'}
        result=self.gate.evaluate_inventory(files,inventory(question='which owner: field holds the basis?'))
        self.assertEqual(result['problems'],[])

    def test_owner_sentence_with_internal_stops_is_stripped(self):
        for marker,expected in (('lawful basis? Owner: Finance Ops (J. Smith).','lawful basis?'),('lawful basis? Owner: Retail IT, see v1.2 docs.','lawful basis?'),
                                ('lawful basis? Owners: X and Y','lawful basis?'),('lawful basis? Owner(s): X','lawful basis?'),
                                ('lawful basis; Owner: X','lawful basis'),('lawful basis (Owner: X)','lawful basis')):
            with self.subTest(marker=marker):
                self.assertEqual(self.gate.marker_question(marker),expected)
        for marker in ('What is the owner: field name?','who owns the basis? the owner decides.','lawful basis (Owner: X) for staff?'):
            with self.subTest(marker=marker):
                self.assertEqual(self.gate.marker_question(marker),marker.lower())
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis? Owner: Finance Ops (J. Smith).]'}
        result=self.gate.evaluate_inventory(files,inventory(question='lawful basis?'))
        self.assertEqual(result['problems'],[])
        self.assertEqual(result['blockers'],{'07-cross-cutting-concerns.md':1})

    def test_nonblocking_row_may_name_no_next_action(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]'}
        good=self.gate.evaluate_inventory(files,inventory(decision='No: runbook detail, no E2E claim uses it',claim='None',action='None'))
        self.assertEqual(good['problems'],[])
        for kwargs in ({'action':'None'},{'decision':'No: runbook detail','claim':'None','owner':'None'}):
            with self.subTest(kwargs=kwargs):
                self.assertTrue(any(p.startswith('E3 row needs a named owner and next action') for p in self.gate.evaluate_inventory(files,inventory(**kwargs))['problems']))
        dash=self.gate.evaluate_inventory(files,inventory(decision='No - runbook detail',claim='None',action='Owner follow-up'))
        self.assertTrue(any(p.startswith('E3 row needs Yes/No with a reason') for p in dash['problems']))

    def test_reconciled_numbered_entries_read_newest(self):
        for master,expected in (
            ('**Reconciled:** (2) 2026-10-09, step 6a, request 2\n(1) 2026-10-08, step 6a, request 1\n**E2E gate (chunk 19):** Locked','2026-10-09'),
            ('**Reconciled:** (1) 2026-10-08, request 1; (2) 2026-10-09, request 2\n','2026-10-09'),
            ('**Reconciled:** (3) 2026-10-09, request 3\n\n(9) 2026-12-31 outside the line\n','2026-10-09'),
            ('**Reconciled:** 2026-10-07, step 6a\n**E2E gate (chunk 19):** Open','2026-10-07'),
            ('No reconciliation yet.\n',None)):
            with self.subTest(master=master):
                self.assertEqual(self.gate.reconciled_date(master),expected)

    def test_cli_new_reconciled_entry_keeps_same_day_order_check(self):
        source=PATH.parents[2]/'_fixtures/chain/run-2026-10-06-final/sdd-refunds-platform'
        for line in ('**Reconciled:** 2026-10-06','**Reconciled:** 2026-10-06, step 6a by the author, request R, after its last edit','**Reconciled:** (2) 2026-10-06, step 6a by the author, request R\n(1) 2026-10-05, step 6a by the author, request Q'):
            with self.subTest(line=line),tempfile.TemporaryDirectory(prefix='triage-e4-') as tmp:
                sdd=Path(tmp)/'sdd';shutil.copytree(source,sdd)
                master=next(sdd.glob('*-sdd-master.md'))
                master.write_text(re.sub(r'^\*\*Reconciled:\*\*.*$',lambda m:line,master.read_text(encoding='utf-8'),count=1,flags=re.M),encoding='utf-8')
                c00=sdd/'00-cover-and-changelog.md'
                text=c00.read_text(encoding='utf-8')
                last=[l for l in text.split('## Changes Log',1)[1].splitlines() if re.match(r'^\| \d+\.\d+ \|',l)][-1]
                c00.write_text(text.replace(last,last+'\n| 1.99 | 2026-10-06 | Author | | | Wording fix. Chunks: 13a |',1),encoding='utf-8')
                result=subprocess.run([sys.executable,'-B',str(PATH.with_name('check_e2e.py')),str(sdd)],capture_output=True,text=True,encoding='utf-8',env={**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONHASHSEED':'0'})
                self.assertEqual(result.returncode,0,result.stderr)
                self.assertIn('E4 reconciled 2026-10-06 vs last Changes Log date 2026-10-06: NOT met',result.stdout)

    def test_cli_routes_claim_blocker_outside_old_range(self):
        root=PATH.parents[2]
        source=root/'_fixtures/chain/run-2026-10-06-final/sdd-refunds-platform'
        with tempfile.TemporaryDirectory(prefix='triage-e3-') as tmp:
            sdd=Path(tmp)/'sdd';shutil.copytree(source,sdd)
            p=sdd/'07-cross-cutting-concerns.md'
            p.write_text(p.read_text(encoding='utf-8')+'\n[NEEDS CLARIFICATION: lawful basis]\n',encoding='utf-8')
            master=next(sdd.glob('*-sdd-master.md'))
            master.write_text(master.read_text(encoding='utf-8')+'\n'+inventory(),encoding='utf-8')
            result=subprocess.run([sys.executable,'-B',str(PATH.with_name('check_e2e.py')),str(sdd)],capture_output=True,text=True,encoding='utf-8',env={**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONHASHSEED':'0'})
            self.assertEqual(result.returncode,0,result.stderr)
            self.assertIn('E3 policy: owner-classified inventory',result.stdout)
            self.assertIn("'07-cross-cutting-concerns.md': 1",result.stdout)
            self.assertIn('E3 unclassified marker:',result.stdout)

if __name__=='__main__':unittest.main()
