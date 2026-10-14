from pathlib import Path
import importlib.util
import re
import shutil
import unittest

spec = importlib.util.spec_from_file_location('rx_regressions', Path(__file__).with_name('test_rx_checker_regressions.py'))
existing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(existing)


class CheckerReviewRegressions(existing.RXCheckerRegressions):
    def rx_copy(self):
        source = existing.existing.CHECKERS.parents[3]/'fixture-runs/rx-2026-10-13/run'
        if not source.is_dir():
            self.skipTest('R-X fixture not present')
        run = self.run/'rx-run'
        shutil.copytree(source, run)
        return run

    def test_cr01_hashless_numbered_label_cannot_borrow_unnumbered_hash(self):
        run = self.rx_copy()
        sdd = run/'sdd-refunds-platform'
        master = next(sdd.glob('*-sdd-master.md'))
        text = re.sub(r'^\*\*Reconciled:\*\*.*\n', '', master.read_text(encoding='utf-8'), flags=re.M)
        newest = '**Reconciled:** (3) 2026-10-01, final without checked content hash.\n'
        old = '**Reconciled:** 2026-09-30, checked revision sha256:ea6870928a70a71b (chunks 00-17).\n'
        for labels in (newest + old, old + newest):
            master.write_text(text+'\n'+labels, encoding='utf-8')
            out = self.cli('check_e2e.py', sdd)
            self.assertIn('E4 reconciled 2026-10-01 vs last Changes Log date 2026-10-13: NOT met', out)
            self.assertNotIn('met (by content hash:', out)

    def test_cr01_unnumbered_record_bounds_a_numbered_entry_in_one_block(self):
        run = self.rx_copy()
        sdd = run/'sdd-refunds-platform'
        master = next(sdd.glob('*-sdd-master.md'))
        text = re.sub(r'^\*\*Reconciled:\*\*.*\n', '', master.read_text(encoding='utf-8'), flags=re.M)
        master.write_text(text+'\n**Reconciled:**\n(3) 2026-10-01, final without checked content hash.\n2026-09-30, checked revision sha256:ea6870928a70a71b (chunks 00-17).\n', encoding='utf-8')
        self.assertIn('E4 reconciled 2026-10-01 vs last Changes Log date 2026-10-13: NOT met', self.cli('check_e2e.py', sdd))

    def test_cr01_semicolon_entry_date_and_hash_have_one_owner(self):
        run = self.rx_copy()
        sdd = run/'sdd-refunds-platform'
        master = next(sdd.glob('*-sdd-master.md'))
        original = re.sub(r'^\*\*Reconciled:\*\*.*\n', '', master.read_text(encoding='utf-8'), flags=re.M)
        labels = '**Reconciled:** (1) 2026-10-12, checked revision sha256:ea6870928a70a71b (chunks 00-17); (2) 2026-10-13, checked revision sha256:0000000000000000 (chunks 00-17).\n'
        master.write_text(original+'\n'+labels, encoding='utf-8')
        out = self.cli('check_e2e.py', sdd)
        self.assertIn('E4 reconciled 2026-10-13 vs last Changes Log date 2026-10-13: NOT met', out)
        self.assertIn('not sha256:0000000000000000', out)
        labels = labels.replace('sha256:ea6870928a70a71b', 'sha256:1111111111111111').replace('sha256:0000000000000000', 'sha256:ea6870928a70a71b')
        master.write_text(original+'\n'+labels, encoding='utf-8')
        self.assertIn('E4 reconciled 2026-10-13 vs last Changes Log date 2026-10-13: met (by content hash:', self.cli('check_e2e.py', sdd))

    def test_cr01_historical_prose_cannot_replace_selected_entry_date(self):
        run = self.rx_copy()
        sdd = run/'sdd-refunds-platform'
        master = next(sdd.glob('*-sdd-master.md'))
        original = re.sub(r'^\*\*Reconciled:\*\*.*\n', '', master.read_text(encoding='utf-8'), flags=re.M)
        label = '**Reconciled:** 2026-10-14, step 6a ran after the last edit'
        master.write_text(original+'\n'+label+'.\n', encoding='utf-8')
        self.assertIn('E4 reconciled 2026-10-14 vs last Changes Log date 2026-10-13: met', self.cli('check_e2e.py', sdd))
        master.write_text(original+'\n'+label+'; compared with historical entry (9) 2026-10-12.\n', encoding='utf-8')
        self.assertIn('E4 reconciled 2026-10-14 vs last Changes Log date 2026-10-13: met', self.cli('check_e2e.py', sdd))

    def test_cr02_negated_pointer_does_not_supply_annotations(self):
        run = self.rx_copy()
        p = run/'lld-refunds-platform/04-implementation/refund-core.md'
        self.edit(p, 'Each method carries its own keyed @UseCase from §7.8', 'No @UseCase on these endpoints; see §7.8 for discussion')
        self.assertIn('no @UseCase for REFUNDS/UC-01 POST /v1/refunds', self.cli('check_trace.py', run))

    def test_cr02_negated_literal_annotation_is_not_affirmative_evidence(self):
        run = self.rx_copy()
        p = run/'lld-refunds-platform/04-implementation/refund-core.md'
        self.edit(p, 'Each method carries its own keyed @UseCase from §7.8', 'No @UseCase("REFUNDS/UC-01") on these endpoints; see §7.8 for discussion')
        self.assertIn('no @UseCase for REFUNDS/UC-01 POST /v1/refunds', self.cli('check_trace.py', run))

    def test_cr02_job_annotation_cannot_become_controller_annotation(self):
        run = self.rx_copy()
        p = run/'lld-refunds-platform/04-implementation/refund-core.md'
        self.edit(p, 'RefundController methods use @UseCase("REFUNDS/UC-01"); shared jobs use the combined value in §7.2.', 'RefundController methods carry no annotation; MessageRecoveryJob uses @UseCase("REFUNDS/UC-01"); other shared jobs use the combined value in §7.2.')
        self.assertIn('no @UseCase for REFUNDS/UC-01 POST /v1/refunds', self.cli('check_trace.py', run))

    def test_cr03_json_data_property_order_is_not_semantic(self):
        run = self.rx_copy()
        p = run/'lld-refunds-platform/14-frontend.md'
        self.edit(p, '"data":{"screen":"REFUNDS/MK-01","useCases":["REFUNDS/UC-01"]}', '"data":{"useCases":["REFUNDS/UC-01"],"screen":"REFUNDS/MK-01"}')
        self.assertNotIn('route /refunds/new: no route data', self.cli('check_trace.py', run))

    def test_cr03_json_route_cannot_borrow_non_path_first_neighbor_data(self):
        run = self.rx_copy()
        p = run/'lld-refunds-platform/14-frontend.md'
        self.edit(p, '{"path":"/refunds","data":{"screen":"REFUNDS/MK-02","useCases":["REFUNDS/UC-02","REFUNDS/UC-03"]}}', '{"path":"/refunds"},\n{"component":"Orphan","path":"/unknown","data":{"screen":"REFUNDS/MK-02","useCases":["REFUNDS/UC-02","REFUNDS/UC-03"]}}')
        self.assertIn('route /refunds: no route data', self.cli('check_trace.py', run))

    def test_cr03_typescript_route_cannot_borrow_non_path_first_neighbor_data(self):
        p = self.lld/'14-frontend.md'
        text = p.read_text(encoding='utf-8')
        original = next(l for l in text.splitlines() if "{ path: 'refunds/reports/branch'" in l)
        replacement = "{ path: 'refunds/reports/branch' },\n{ component: 'Orphan', path: 'unknown', data: { screen: 'REFUNDS/MK-05' } },"
        p.write_text(text.replace(original, replacement), encoding='utf-8')
        self.assertIn('route /refunds/reports/branch: no route data', self.cli('check_trace.py', self.run))

    def test_cr03_no_brd_screen_uses_the_same_owned_json_object(self):
        p = self.lld/'14-frontend.md'
        text = p.read_text(encoding='utf-8')
        row = '| /workflow | WorkflowPage | None - no BRD screen ([source](../sdd-refunds-platform/01-executive-summary-scope-risks.md)) | None - no BRD screen ([source](../sdd-refunds-platform/01-executive-summary-scope-risks.md)) | - | No |\n'
        table_line = next(l for l in text.splitlines() if l.startswith('| `/refunds/request` |'))
        text = text.replace(table_line, table_line+'\n'+row)
        text += '\n```json\n[{"path":"/workflow"},{"component":"Orphan","path":"/unknown","data":{"screen":"REFUNDS/MK-01"}}]\n```\n'
        p.write_text(text, encoding='utf-8')
        self.clean(self.cli('check_trace.py', self.run))
        self.edit(p, '{"path":"/workflow"}', '{"component":"WorkflowPage","data":{},"path":"/workflow"}')
        self.assertIn('route /workflow: a Workflow route carries no route data', self.cli('check_trace.py', self.run))

    def test_cr03_typescript_data_property_order_and_nested_braces(self):
        p = self.lld/'14-frontend.md'
        text = p.read_text(encoding='utf-8')
        original = next(l for l in text.splitlines() if "{ path: 'refunds/reports/branch'" in l)
        replacement = "{ component: 'Report}Page', data: { useCases: [], screen: 'REFUNDS/MK-05' }, path: 'refunds/reports/branch' },"
        p.write_text(text.replace(original, replacement), encoding='utf-8')
        self.clean(self.cli('check_trace.py', self.run))
        self.edit(p, "screen: 'REFUNDS/MK-05'", "screen: 'LOYALTY/MK-05'")
        self.assertIn('data LOYALTY/MK-05', self.cli('check_trace.py', self.run))

    def test_cr03_dynamic_spread_cannot_override_asserted_literal_data(self):
        p = self.lld/'14-frontend.md'
        text = p.read_text(encoding='utf-8')
        original = next(l for l in text.splitlines() if "{ path: 'refunds/reports/branch'" in l)
        replacement = "{ path: 'refunds/reports/branch', data: { screen: 'REFUNDS/MK-05', ...unverifiedData } },"
        p.write_text(text.replace(original, replacement), encoding='utf-8')
        self.assertIn('route /refunds/reports/branch: no route data', self.cli('check_trace.py', self.run))


for name in dir(existing.RXCheckerRegressions):
    if name.startswith('test_'):
        setattr(CheckerReviewRegressions, name, None)


if __name__ == '__main__':
    unittest.main()
