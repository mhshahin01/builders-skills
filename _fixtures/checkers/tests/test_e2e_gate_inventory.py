"""Verify the semantic E3 inventory reader, including relocation and exemptions."""
from pathlib import Path
import importlib.util
import unittest
import tempfile,shutil,subprocess,sys,os,re,hashlib

PATH=Path(__file__).resolve().parents[1]/'_e2e_gate.py'
FB=Path(os.environ.get('FB_RUN_SDD',r'W:\ITV\projects\hivantic\fixture-runs\fb-2026-10-09\run\sdd-refunds-platform'))

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
        self.assertEqual(result['blockers'],{'07-cross-cutting-concerns.md':1,'unclassified markers':1})
        self.assertEqual(result['unclassified'],1)
        self.assertIn('E3 unclassified marker: 07-cross-cutting-concerns.md: lawful basis',result['problems'])

    def test_unclassified_marker_is_an_e3_blocker_and_obsolete_row_is_not(self):
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: lawful basis]\n[NEEDS CLARIFICATION: provider timeout]'}
        result=self.gate.evaluate_inventory(files,inventory(decision='No: no E2E claim uses it',claim='None'))
        self.assertEqual(result['blockers'],{'unclassified markers':1})
        obsolete=self.gate.evaluate_inventory({},inventory(decision='No: no E2E claim uses it',claim='None'))
        self.assertEqual(obsolete['blockers'],{})
        self.assertTrue(any(p.startswith('E3 obsolete or unmatched source/question') for p in obsolete['problems']))
        legacy=self.gate.evaluate_inventory(files,'No inventory')
        self.assertEqual(legacy['blockers'],{})

    def test_cli_unclassified_marker_shuts_the_gate(self):
        source=PATH.parents[2]/'_fixtures/chain/run-2026-10-07-review/sdd-refunds-platform'
        with tempfile.TemporaryDirectory(prefix='triage-e3-unclassified-') as tmp:
            sdd=Path(tmp)/'sdd';shutil.copytree(source,sdd)
            out=self.cli_e2e(sdd)
            self.assertIn('E3 markers: 0 {}',out)
            self.assertIn('problems: 0',out)
            p=sdd/'07-cross-cutting-concerns.md'
            p.write_text(p.read_text(encoding='utf-8')+'\n[NEEDS CLARIFICATION: lawful basis for staff data]\n',encoding='utf-8')
            out=self.cli_e2e(sdd)
            self.assertIn("E3 markers: 1 {'unclassified markers': 1}",out)
            self.assertIn('chunk 19 exists but the gate conditions are not all met',out)

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

    def test_parenthetical_owner_only_as_the_final_group(self):
        self.assertEqual(self.gate.marker_question('lawful basis (Owner: Finance Ops (J. Smith)).'),'lawful basis')
        self.assertEqual(self.gate.marker_question('lawful basis (Owner(s): DPO).'),'lawful basis')
        marker='lawful basis (Owner: DPO) and the retention period (see §18.5)?'
        self.assertEqual(self.gate.marker_question(marker),marker.lower())
        files={'07-cross-cutting-concerns.md':'[NEEDS CLARIFICATION: '+marker+']'}
        exact=self.gate.evaluate_inventory(files,inventory(question=marker))
        self.assertEqual(exact['problems'],[])
        paraphrase=self.gate.evaluate_inventory(files,inventory(question='lawful basis'))
        self.assertEqual(paraphrase['unclassified'],1)
        self.assertTrue(any(p.startswith('E3 obsolete or unmatched source/question') for p in paraphrase['problems']))

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

    def test_paraphrase_after_link_is_caught(self):
        marker='the hour the summary is sent ([REFUNDS/UC-04](../brd/06b.md#uc-04) BR-2); a business value for the owner'
        files={'15-environments.md':'[NEEDS CLARIFICATION: '+marker+']'}
        exact=self.gate.evaluate_inventory(files,inventory(source='15-environments.md',decision='No: no E2E claim uses it',claim='None',question=marker))
        self.assertEqual(exact['problems'],[])
        paraphrase=marker.replace('a business value for the owner','the owner decides')
        result=self.gate.evaluate_inventory(files,inventory(source='15-environments.md',decision='No: no E2E claim uses it',claim='None',question=paraphrase))
        self.assertEqual(result['unclassified'],1)
        self.assertTrue(any(p.startswith('E3 obsolete or unmatched source/question') for p in result['problems']))

    def test_trailing_period_before_owner_sentence_is_ignored(self):
        files={'02-ecosystem-overview.md':'HA: **[NEEDS CLARIFICATION: PostgreSQL HA topology that keeps REFUNDS/NFR-02. Owner: solution architect]**'}
        result=self.gate.evaluate_inventory(files,inventory(source='02-ecosystem-overview.md',decision='No: no E2E claim uses it',claim='None',question='PostgreSQL HA topology that keeps REFUNDS/NFR-02'))
        self.assertEqual(result['problems'],[])
        self.assertEqual(result['unclassified'],0)

    def test_balanced_brackets_on_both_sides(self):
        self.assertEqual(self.gate.bracketed('x [NEEDS CLARIFICATION: a ([L](u)) b] y [NEEDS CLARIFICATION: c]','[NEEDS CLARIFICATION:'),['a ([L](u)) b','c'])
        self.assertEqual(self.gate.bracketed('[NEEDS CLARIFICATION: a [b] c','[NEEDS CLARIFICATION:'),['a [b'])
        self.assertEqual(self.gate.before_close('a ([L](u)) b] trailing'),'a ([L](u)) b')
        self.assertEqual(self.gate.before_close('a ([L](u)) b'),'a ([L](u)) b')

    def test_reconciled_hash_reads_the_newest_entry(self):
        for master,expected in (
            ('**Reconciled:** (1) 2026-10-09, checked revision `sha256:1111111111111111 (chunks 00-17)`. (2) 2026-10-10, checked revision `sha256:2222222222222222 (chunks 00-17)`; the content before matched entry (1) (`sha256:1111111111111111`)\n','2222222222222222'),
            ('**Reconciled:** (2) 2026-10-10, before it `sha256:1111111111111111`, checked `sha256:2222222222222222 (chunks 00-17)`\n(1) 2026-10-09, `sha256:3333333333333333 (chunks 00-17)`\n','2222222222222222'),
            ('**Reconciled:** 2026-10-07, step 6a, checked content: chunks 01 to 17, sha256 c8dbd190559473ea\n',None),
            ('**Reconciled:** (2) 2026-10-10, order only\n(1) 2026-10-09, `sha256:3333333333333333 (chunks 00-17)`\n',None),
            ('No reconciliation yet.\n',None)):
            with self.subTest(master=master):
                self.assertEqual(self.gate.reconciled_hash(master),expected)

    def test_reconciled_hash_prefers_checked_revision_and_real_entry_starts(self):
        for master,expected in (
            ('**Reconciled:** (9) 2026-10-10, before: `sha256:1111111111111111 (chunks 00-17)`; checked revision `sha256:2222222222222222 (chunks 00-17)`\n','2222222222222222'),
            ('**Reconciled:** (8) 2026-10-09, checked revision `sha256:1111111111111111 (chunks 00-17)`. (9) 2026-10-10, unlike entry (8) 2026-10-09, checked revision `sha256:2222222222222222 (chunks 00-17)`\n','2222222222222222'),
            ('**Reconciled:** (9) 2026-10-10, unlike entry (8) 2026-10-09, checked revision sha256:2222222222222222 (chunks 00-17)\n','2222222222222222'),
            ('**Reconciled:** (1) 2026-10-10, checked revision `sha256:ABCDEF0123456789 (chunks 00-17)`\n','abcdef0123456789'),
            ('**Reconciled:** (1) 2026-10-10, checked revision `sha256:'+'a'*64+' (chunks 00-17)`\n','a'*64),
            ('**Reconciled:** (1) 2026-10-10, checked revision `sha256:'+'a'*65+' (chunks 00-17)`\n',None),
            ('**Reconciled:** (1) 2026-10-10, checked revision `sha256:222222222222 (chunks 00-17)`\n',None)):
            with self.subTest(master=master):
                self.assertEqual(self.gate.reconciled_hash(master),expected)
        self.assertEqual(self.gate.reconciled_date('**Reconciled:** (9) 2026-10-10, unlike entry (8) 2026-10-09, x\n'),'2026-10-10')

    def test_content_hash_scope_and_join(self):
        with tempfile.TemporaryDirectory(prefix='e4-hash-') as tmp:
            sdd=Path(tmp)
            c00='# Cover\r\n\r\n**Version:** 1.2\r\n**Status:** Draft\r\n**Reviewers:** None\r\n**Approvers:** None\r\n**Date:** 2026-10-10\r\n\r\n## Lineage\r\n\r\n### Child LLDs (children)\r\n\r\n| LLD | SDD version |\r\n|---|---|\r\n| X | 1.2 |\r\n\r\n### Other\r\n\r\nkept\r\n\r\n## Changes Log\r\n\r\n| Version |\r\n|---|\r\n| 1.2 |\r\n\r\n## Table of Contents\r\n'
            files={'00-cover-and-changelog.md':c00,'13b-service-b.md':'B\n','13a-service-a.md':'A\n','17-appendix.md':'Z\n','18-open-items.md':'out\n','19-e2e.md':'out\n','x-sdd-master.md':'out\n','decision-log.md':'out\n'}
            for name,text in files.items():(sdd/name).write_text(text,encoding='utf-8',newline='')
            kept='# Cover\n\n**Version:** 1.2\n\n## Lineage\n\n### Other\n\nkept\n\n## Table of Contents\n'
            self.assertEqual(self.gate.content_hash(str(sdd)),hashlib.sha256((kept+'A\n'+'B\n'+'Z\n').encode('utf-8')).hexdigest())
            before=self.gate.content_hash(str(sdd))
            (sdd/'00-cover-and-changelog.md').write_text(c00.replace('**Status:** Draft','**Status:** Approved').replace('| 1.2 |\r\n\r\n## Table','| 1.2 |\r\n| 1.3 |\r\n\r\n## Table'),encoding='utf-8',newline='')
            (sdd/'18-open-items.md').write_text('changed\n',encoding='utf-8')
            self.assertEqual(self.gate.content_hash(str(sdd)),before)
            (sdd/'13a-service-a.md').write_text('A2\n',encoding='utf-8')
            self.assertNotEqual(self.gate.content_hash(str(sdd)),before)
            empty=sdd/'empty';empty.mkdir()
            self.assertIsNone(self.gate.content_hash(str(empty)))

    def cli_e2e(self,sdd):
        result=subprocess.run([sys.executable,'-B',str(PATH.with_name('check_e2e.py')),str(sdd)],capture_output=True,text=True,encoding='utf-8',env={**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONHASHSEED':'0'})
        self.assertEqual(result.returncode,0,result.stderr)
        return result.stdout

    def test_cli_e4_by_content_hash(self):
        source=PATH.parents[2]/'_fixtures/chain/run-2026-10-06-final/sdd-refunds-platform'
        with tempfile.TemporaryDirectory(prefix='triage-e4-hash-') as tmp:
            sdd=Path(tmp)/'sdd';shutil.copytree(source,sdd)
            c00=sdd/'00-cover-and-changelog.md'
            text=c00.read_text(encoding='utf-8')
            last=[l for l in text.split('## Changes Log',1)[1].splitlines() if re.match(r'^\| \d+\.\d+ \|',l)][-1]
            c00.write_text(text.replace(last,last+'\n| 1.99 | 2026-10-06 | Author | | | Wording fix. Chunks: 18 |',1),encoding='utf-8')
            digest=self.gate.content_hash(str(sdd))[:16]
            master=next(sdd.glob('*-sdd-master.md'))
            line='**Reconciled:** (2) 2026-10-06, step 6a by the author, request R, checked revision `sha256:'+digest+' (chunks 00-17, Changes Log and Child LLDs left out)`\n(1) 2026-10-05, step 6a by the author, request Q, checked revision `sha256:0000000000000000 (chunks 00-17, Changes Log and Child LLDs left out)`'
            master.write_text(re.sub(r'^\*\*Reconciled:\*\*.*$',lambda m:line,master.read_text(encoding='utf-8'),count=1,flags=re.M),encoding='utf-8')
            self.assertIn('E4 reconciled 2026-10-06 vs last Changes Log date 2026-10-06: met (by content hash: chunks 00-17 hash to sha256:'+digest,self.cli_e2e(sdd))
            p=sdd/'13a-service-customer-accounts.md'
            p.write_text(p.read_text(encoding='utf-8')+'\nAn edit after the reconciliation.\n',encoding='utf-8')
            out=self.cli_e2e(sdd)
            self.assertIn('E4 reconciled 2026-10-06 vs last Changes Log date 2026-10-06: NOT met (by content hash:',out)
            self.assertIn('not sha256:'+digest,out)
            self.assertNotIn('E4 note:',out)

    def test_cli_unreadable_hash_prints_an_e4_note(self):
        source=PATH.parents[2]/'_fixtures/chain/run-2026-10-06-final/sdd-refunds-platform'
        with tempfile.TemporaryDirectory(prefix='triage-e4-note-') as tmp:
            sdd=Path(tmp)/'sdd';shutil.copytree(source,sdd)
            self.assertNotIn('E4 note:',self.cli_e2e(sdd))
            master=next(sdd.glob('*-sdd-master.md'))
            line='**Reconciled:** 2026-10-06, step 6a, checked content: chunks 01 to 17, sha256 c8dbd190559473ea'
            master.write_text(re.sub(r'^\*\*Reconciled:\*\*.*$',lambda m:line,master.read_text(encoding='utf-8'),count=1,flags=re.M),encoding='utf-8')
            out=self.cli_e2e(sdd)
            self.assertIn('E4 note: the newest Reconciled entry mentions sha256 but records no hash the checker can read',out)
            self.assertIn('notes: 2',out)

    @unittest.skipUnless(FB.is_dir(),'FB run not present')
    def test_fb_run_hash_reproduces_and_e4_met(self):
        self.assertTrue(self.gate.content_hash(str(FB)).startswith('225f294be5166d3d'))
        master=next(FB.glob('*-sdd-master.md')).read_text(encoding='utf-8')
        self.assertEqual(self.gate.reconciled_hash(master),'225f294be5166d3d')
        out=self.cli_e2e(FB)
        self.assertIn('E4 reconciled 2026-10-10 vs last Changes Log date 2026-10-10: met (by content hash',out)

    def test_e1_closed_status_is_an_allowlist_per_item(self):
        block=lambda oi,status:f'### {oi}: A question\n\n- **Question:** x\n'+(f'- **Status:** {status}\n' if status is not None else '')+'\n'
        closed=('Accepted - applied','Accepted - applied (see Resolution Log)','Adjusted - applied (§17.5): the recommended edits',
                'Rejected','Rejected: out of scope','Rejected - out of scope: the staged import','Rejected (2026-10-07). It adds a persona')
        unclosed=('Rejected - withdrawn by the reviewer','Accepted - applied in part','Rejected - reopened','Accepted - applied - Open again',
                  'Withdrawn by the reviewer on re-check','Superseded in part, 2026-10-01','Decided - pending application: Option A','Open','rejected',None)
        text=''.join(block(f'OI-{k:02}',s) for k,s in enumerate(closed+unclosed,1))
        found=dict(self.gate.unclosed_items(text))
        self.assertEqual(sorted(found),[f'OI-{k:02}' for k in range(len(closed)+1,len(closed)+len(unclosed)+1)])
        self.assertEqual(found[f'OI-{len(closed)+len(unclosed):02}'],'no Status line')
        two=self.gate.unclosed_items(block('OI-01','Rejected')+'- **Status:** Rejected\n')
        self.assertEqual(two,[('OI-01','2 Status lines')])
        self.assertEqual(self.gate.unclosed_items('<!-- ### OI-09: template\n- **Status:** Open -->\n'+block('OI-01','Rejected')),[])

    def test_cli_unknown_status_counts_open(self):
        source=PATH.parents[2]/'_fixtures/chain/run-2026-10-06-final/sdd-refunds-platform'
        with tempfile.TemporaryDirectory(prefix='triage-e1-') as tmp:
            sdd=Path(tmp)/'sdd';shutil.copytree(source,sdd)
            self.assertIn('E1 open items not closed: 0 []',self.cli_e2e(sdd))
            p=sdd/'18-open-items-and-clarifications.md'
            text=p.read_text(encoding='utf-8')
            old=re.search(r'^- \*\*Status:\*\* Accepted - applied.*$',text,re.M)[0]
            p.write_text(text.replace(old,'- **Status:** Withdrawn by the reviewer on re-check',1),encoding='utf-8')
            self.assertIn("E1 open items not closed: 1 ['OI-01: Withdrawn by the reviewer on re-check']",self.cli_e2e(sdd))

    def test_cli_withdrawn_rejection_and_missing_status_count_open(self):
        source=PATH.parents[2]/'_fixtures/chain/run-2026-10-06-final/sdd-refunds-platform'
        with tempfile.TemporaryDirectory(prefix='triage-e1-allow-') as tmp:
            sdd=Path(tmp)/'sdd';shutil.copytree(source,sdd)
            p=sdd/'18-open-items-and-clarifications.md'
            text=p.read_text(encoding='utf-8')
            first,second=re.findall(r'^- \*\*Status:\*\* Accepted - applied.*\n',text,re.M)[:2]
            text=text.replace(first,'- **Status:** Rejected - withdrawn by the reviewer on re-check\n',1)
            p.write_text(text.replace(second,'',1),encoding='utf-8')
            out=self.cli_e2e(sdd)
            self.assertIn("E1 open items not closed: 2 ['OI-01: Rejected - withdrawn by the reviewer on re-check', 'OI-02: no Status line']",out)
            self.assertIn('chunk 19 exists but the gate conditions are not all met',out)

if __name__=='__main__':unittest.main()
