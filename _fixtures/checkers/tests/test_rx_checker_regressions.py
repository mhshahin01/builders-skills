from pathlib import Path
import importlib.util
import re
import shutil
import unittest

spec = importlib.util.spec_from_file_location('existing_regressions', Path(__file__).with_name('test_chk_regressions.py'))
existing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(existing)


class RXCheckerRegressions(existing.CheckerRegressions):
    def test_rx_repeated_reconciliation_hash_rejects_changed_body(self):
        source = existing.CHECKERS.parents[3]/'fixture-runs/rx-2026-10-13/run/sdd-refunds-platform'
        if not source.is_dir():
            self.skipTest('R-X fixture not present')
        sdd = self.run/'rx-sdd'
        shutil.copytree(source, sdd)
        out = self.cli('check_e2e.py', sdd)
        self.assertIn('met (by content hash: chunks 00-17 hash to sha256:ea6870928a70a71b', out)
        p = sdd/'01-executive-summary-scope-risks.md'
        p.write_text(p.read_text(encoding='utf-8')+'\nA body edit after reconciliation.\n', encoding='utf-8')
        out = self.cli('check_e2e.py', sdd)
        self.assertIn('NOT met (by content hash:', out)
        self.assertIn('not sha256:ea6870928a70a71b', out)
        self.assertNotIn('met (by date only:', out)

    def test_rx_explicit_controller_pointer_requires_owned_trigger_annotation(self):
        source = existing.CHECKERS.parents[3]/'fixture-runs/rx-2026-10-13/run'
        if not source.is_dir():
            self.skipTest('R-X fixture not present')
        run = self.run/'rx-run'
        shutil.copytree(source, run)
        out = self.cli('check_trace.py', run)
        self.assertNotIn('no @UseCase', out)
        self.assertIn("no 'Permission token (SDD §16)' column", out)
        p = run/'lld-refunds-platform/04-implementation/refund-core.md'
        original = p.read_text(encoding='utf-8')
        broken = original.replace('RefundController methods use @UseCase("REFUNDS/UC-01")', 'OtherController methods use @UseCase("REFUNDS/UC-01")')
        p.write_text(broken, encoding='utf-8')
        self.assertIn('no @UseCase for REFUNDS/UC-01 POST /v1/refunds', self.cli('check_trace.py', run))
        broken = original.replace('RefundController methods use @UseCase("REFUNDS/UC-01")', 'RefundController methods use @UseCase("REFUNDS/UC-99")')
        p.write_text(broken, encoding='utf-8')
        self.assertIn('no @UseCase for REFUNDS/UC-01 POST /v1/refunds', self.cli('check_trace.py', run))
        broken = original.replace('RefundController methods use @UseCase("REFUNDS/UC-01")', 'RefundController methods have no recorded annotation')
        p.write_text(broken, encoding='utf-8')
        self.assertIn('no @UseCase for REFUNDS/UC-01 POST /v1/refunds', self.cli('check_trace.py', run))
        broken = broken.replace('**Trigger:** @UseCase("REFUNDS/UC-02")', '**Trigger:** @UseCase("REFUNDS/UC-01")')
        p.write_text(broken, encoding='utf-8')
        self.assertIn('no @UseCase for REFUNDS/UC-01 POST /v1/refunds', self.cli('check_trace.py', run))

    def test_rx_pointer_shared_annotation_preserves_source_uc_order(self):
        source = existing.CHECKERS.parents[3]/'fixture-runs/rx-2026-10-13/run'
        if not source.is_dir():
            self.skipTest('R-X fixture not present')
        run = self.run/'rx-run'
        shutil.copytree(source, run)
        p03 = run/'sdd-refunds-platform/03-users-and-use-cases.md'
        text = p03.read_text(encoding='utf-8')
        text = text.replace('|`POST /v1/refunds/{refundId}/cancellations`;', '|`POST /v1/refunds`; `POST /v1/refunds/{refundId}/cancellations`;')
        p03.write_text(text, encoding='utf-8')
        p = run/'lld-refunds-platform/04-implementation/refund-core.md'
        original = p.read_text(encoding='utf-8').replace('Entry points: POST /v1/refunds/{refundId}/cancellations;', 'Entry points: POST /v1/refunds; POST /v1/refunds/{refundId}/cancellations;')
        shared = original.replace('@UseCase("REFUNDS/UC-01")', '@UseCase("REFUNDS/UC-01,REFUNDS/UC-03")').replace('@UseCase("REFUNDS/UC-03") cancellation', '@UseCase("REFUNDS/UC-01,REFUNDS/UC-03") cancellation')
        p.write_text(shared, encoding='utf-8')
        self.assertNotIn('@UseCase on POST /v1/refunds in refund-core.md', self.cli('check_trace.py', run))
        p.write_text(shared.replace('@UseCase("REFUNDS/UC-01,REFUNDS/UC-03")', '@UseCase("REFUNDS/UC-03,REFUNDS/UC-01")'), encoding='utf-8')
        self.assertIn('@UseCase on POST /v1/refunds in refund-core.md is REFUNDS/UC-03,REFUNDS/UC-01', self.cli('check_trace.py', run))

    def test_rx_unpadded_use_case_cells_parse(self):
        p = self.sdd/'03-users-and-use-cases.md'
        p.write_text(p.read_text(encoding='utf-8').replace(' | ', '|'), encoding='utf-8')
        self.clean(self.cli('check_trace.py', self.run))

    def test_rx_trace_endpoint_and_route_literals_do_not_require_backticks(self):
        for p in [*self.lld.joinpath('04-implementation').glob('*.md'), self.lld/'14-frontend.md']:
            text = re.sub(r'`((?:GET|POST|PUT|DELETE|PATCH) /[^`]+|/[^`]+)`', r'\1', p.read_text(encoding='utf-8'))
            p.write_text(text, encoding='utf-8')
        self.clean(self.cli('check_trace.py', self.run))

    def test_rx_trace_wrong_plain_entry_point_remains_diagnosed(self):
        p = self.lld/'04-implementation/refund-requests.md'
        text = p.read_text(encoding='utf-8')
        text = text.replace('Entry points: `POST /v1/receipt-lookups`', 'Entry points: POST /v1/missing-lookups', 1)
        p.write_text(text, encoding='utf-8')
        self.assertIn('entry points differ', self.cli('check_trace.py', self.run))

    def test_rx_trace_permission_header_remains_required_without_empty_derivative(self):
        p = self.lld/'06-api-contracts.md'
        self.edit(p, 'Permission token (SDD §16)', 'Permission token')
        out = self.cli('check_trace.py', self.run)
        self.assertIn("no 'Permission token (SDD §16)' column", out)
        self.assertNotIn("token '' vs SDD", out)

    def test_rx_bare_route_metadata_stays_bound_to_its_route(self):
        p = self.lld/'14-frontend.md'
        text = p.read_text(encoding='utf-8')
        text = re.sub(r'\| `(/[^`]+)` \|', r'| \1 |', text)
        p.write_text(text, encoding='utf-8')
        self.clean(self.cli('check_trace.py', self.run))
        self.edit(p, "screen: 'REFUNDS/MK-05'", "screen: 'LOYALTY/MK-05'")
        self.assertIn('data LOYALTY/MK-05', self.cli('check_trace.py', self.run))

    def test_rx_json_route_metadata_is_owned_and_missing_data_cannot_borrow(self):
        p = self.lld/'14-frontend.md'
        text = p.read_text(encoding='utf-8')
        original = next(l for l in text.splitlines() if "{ path: 'refunds/reports/branch'" in l)
        replacement = '{"path":"/refunds/reports/branch","data":{"screen":"REFUNDS/MK-05"}},'
        p.write_text(text.replace(original, replacement), encoding='utf-8')
        self.clean(self.cli('check_trace.py', self.run))
        self.edit(p, '"screen":"REFUNDS/MK-05"', '"screen":"LOYALTY/MK-05"')
        self.assertIn('data LOYALTY/MK-05', self.cli('check_trace.py', self.run))
        self.edit(p, '"data":{"screen":"LOYALTY/MK-05"}', '"data":{}')
        self.assertIn('route /refunds/reports/branch: no route data', self.cli('check_trace.py', self.run))

    def test_rx_missing_use_case_row_is_diagnosed_without_crash(self):
        p = self.sdd/'03-users-and-use-cases.md'
        text = p.read_text(encoding='utf-8')
        p.write_text(re.sub(r'^\| \[REFUNDS/UC-01\].*\n', '', text, flags=re.M), encoding='utf-8')
        self.assertIn('not in SDD 7.3', self.cli('check_trace.py', self.run))

    def test_rx_duplicate_use_case_row_is_diagnosed(self):
        p = self.sdd/'03-users-and-use-cases.md'
        text = p.read_text(encoding='utf-8')
        line = next(l for l in text.splitlines() if l.startswith('| [REFUNDS/UC-01]'))
        p.write_text(text.replace(line, line+'\n'+line), encoding='utf-8')
        self.assertIn('duplicate SDD 7.3 REFUNDS/UC-01', self.cli('check_trace.py', self.run))

    def test_rx_owner_anchor_is_valid(self):
        p = self.sdd/'03-users-and-use-cases.md'
        text = p.read_text(encoding='utf-8')
        p.write_text(text.replace('./13b-service-refund-requests.md)', './13b-service-refund-requests.md#input)'), encoding='utf-8')
        self.clean(self.cli('check_sdd.py', self.sdd))

    def test_rx_bare_registered_permission_and_event_names_are_valid(self):
        for p in [self.sdd/'12-centralized-user-roles.md', *self.sdd.glob('13*.md'), *self.lld.joinpath('04-implementation').glob('*.md')]:
            text = re.sub(r'`([a-z][a-z-]*(?:\.[a-z][a-z-]*)+)`', r'\1', p.read_text(encoding='utf-8'))
            text = text.replace('refund-requests: `RefundPaid`', 'RefundPaid')
            p.write_text(text, encoding='utf-8')
        self.clean(self.cli('check_sdd.py', self.sdd))
        self.clean(self.cli('check_trace.py', self.run))

    def test_rx_bare_unknown_permission_is_diagnosed(self):
        p = self.sdd/'13b-service-refund-requests.md'
        self.edit(p, '`refund-requests.request.read-own`', 'refund-requests.missing.read')
        self.assertIn('permission token refund-requests.missing.read not in', self.cli('check_sdd.py', self.sdd))

    def test_rx_malformed_permission_cell_is_diagnosed(self):
        p = self.sdd/'13b-service-refund-requests.md'
        self.edit(p, '`refund-requests.request.read-own`', '`refund-requests.request.read-own` trailing')
        self.assertIn('names no token', self.cli('check_sdd.py', self.sdd))

    def test_rx_auxiliary_evidence_has_qualified_uc_scope(self):
        text = '# Author stage evidence\n\nRecorded original question: REFUNDS/UC-01.\n'
        (self.sdd/'author-stage-evidence.md').write_text(text, encoding='utf-8')
        out = self.cli('check_sdd.py', self.sdd)
        self.clean(out)
        self.assertIn('author-stage-evidence.md', out.split('NOTES:')[1])
        (self.sdd/'unknown-report.md').write_text(text, encoding='utf-8')
        self.assertIn('unknown-report.md:3: unlinked', self.cli('check_sdd.py', self.sdd))

    def test_rx_bare_lld_unknown_permission_is_diagnosed(self):
        p = self.lld/'04-implementation/refund-requests.md'
        self.edit(p, '`refund-requests.request.read-own`', 'refund-requests.missing.read')
        self.assertIn('token refund-requests.missing.read not in', self.cli('check_trace.py', self.run))

    def test_rx_lld_malformed_permission_cannot_disappear(self):
        p = self.lld/'04-implementation/refund-requests.md'
        self.edit(p, '`refund-requests.request.read-own`', 'refund-requests..read')
        self.assertIn('malformed permission token cell', self.cli('check_trace.py', self.run))

    def test_rx_raw_archive_does_not_shadow_current_versions(self):
        chunk = self.brd/'02-glossary-assumptions-facts.md'
        old = chunk.read_text(encoding='utf-8').replace('VERSION: 1.7', 'VERSION: 0.1', 1)
        for folder in ('_raw-source', 'source-snapshot-v1.0'):
            (self.brd/folder).mkdir()
            (self.brd/folder/chunk.name).write_text(old, encoding='utf-8')
        self.clean(self.cli('check_versions.py', self.brd))
        (self.brd/'_raw-source-extra').mkdir()
        (self.brd/'_raw-source-extra'/chunk.name).write_text(old, encoding='utf-8')
        self.assertIn('_raw-source-extra/02-glossary-assumptions-facts.md', self.cli('check_versions.py', self.brd))

    def test_rx_named_blocks_requires_exact_same_row_source(self):
        doc = self.brd
        doc.joinpath('14-todo.md').write_text('| ID | Priority | Kind | Source | Decision or clarification needed | Blocks | Owner | Status |\n|---|---|---|---|---|---|---|---|\n| TD-01 | P1 | Open question | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) | Which outcome? | Business Objectives | Proposed: author | Open |\n', encoding='utf-8')
        self.assertNotIn('TD-01: Blocks names no', self.cli('check_todo.py', doc))
        self.edit(doc/'14-todo.md', '| Business Objectives |', '| Global |')
        self.assertIn('TD-01: Blocks names no', self.cli('check_todo.py', doc))

    def test_rx_named_blocks_cannot_borrow_another_rows_source(self):
        doc = self.brd
        doc.joinpath('14-todo.md').write_text('| ID | Priority | Kind | Source | Decision or clarification needed | Blocks | Owner | Status |\n|---|---|---|---|---|---|---|---|\n| TD-01 | P1 | Open question | [13 / OI-01](./13-open-items-and-clarifications.md) | Which outcome? | Business Objectives | Proposed: author | Open |\n| TD-02 | P1 | Open question | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) | Which outcome? | UC-01 | Proposed: author | Open |\n', encoding='utf-8')
        self.assertIn('TD-01: Blocks names no', self.cli('check_todo.py', doc))


for name in dir(existing.CheckerRegressions):
    if name.startswith('test_'):
        setattr(RXCheckerRegressions, name, None)


if __name__ == '__main__':
    unittest.main()
