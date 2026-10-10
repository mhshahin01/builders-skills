"""Exercise the CHK parsers through their CLI on copied fixture documents."""
from pathlib import Path
import importlib.util
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

CHECKERS = Path(__file__).resolve().parents[1]
ROOT = CHECKERS.parents[1]
SAVED = ROOT / '_fixtures/chain/run-2026-10-06-final'
RUN = SAVED if SAVED.is_dir() else ROOT / '_fixtures/runs-wip/step6-R/run'
L1 = '[LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance)'
L2 = '[LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)'


class CheckerRegressions(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='chk-regression-')
        self.run = Path(self.tmp.name) / 'run'
        shutil.copytree(RUN, self.run)
        self.sdd = self.run / 'sdd-refunds-platform'
        self.lld = self.run / 'lld-refunds-platform'
        self.brd = self.run / 'brd-refunds-portal'

    def tearDown(self):
        self.tmp.cleanup()

    def cli(self, name, *args):
        p = subprocess.run([sys.executable, '-B', str(CHECKERS / name), *map(str, args)],
                           capture_output=True, text=True, encoding='utf-8',
                           env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONHASHSEED': '0'})
        self.assertEqual(p.returncode, 0, p.stderr)
        return p.stdout

    def edit(self, p, old, new):
        t = p.read_text(encoding='utf-8')
        self.assertIn(old, t)
        p.write_text(t.replace(old, new, 1), encoding='utf-8', newline='\n')

    def clean(self, text):
        self.assertRegex(text, r'(?im)^problems: 0$', text)

    def test_plain_metadata_and_surface_counts(self):
        args = [self.lld, self.sdd, 'REFUNDS='+str(self.brd),
                'LOYALTY='+str(self.run/'brd-loyalty-points')]
        out = self.cli('check_lld_trace.py', *args)
        self.assertIn('lineage_problems: 0', out)
        self.assertIn('index_rows_19_9: 9', out)
        self.assertIn('spec_rows_16_8: 8', out)
        self.assertIn('route_header_cols: | Route', out)
        self.edit(self.lld/'00-metadata.md', '| Version | 1.1 |', '| **Version** | 1.1 |')
        self.assertIn('lineage_problems: 0', self.cli('check_lld_trace.py', *args))
        self.edit(self.lld/'00-metadata.md', '| **Version** | 1.1 |', '| **Version** | 9.9 |')
        self.assertNotIn('lineage_problems: 0', self.cli('check_lld_trace.py', *args))

    def test_auxiliary_header_and_required_chunk_header(self):
        out = self.cli('_linkcheck.py', self.lld)
        self.assertNotIn('NO HEADER BLOCK decision-log.md', out)
        p = self.lld/'14-frontend.md'
        p.write_text(re.sub(r'^<!--.*?-->\s*', '', p.read_text(encoding='utf-8'), count=1, flags=re.S), encoding='utf-8')
        self.assertIn('NO HEADER BLOCK 14-frontend.md', self.cli('_linkcheck.py', self.lld))

    def test_report_route_stays_with_its_data(self):
        self.clean(self.cli('check_trace.py', self.run))
        p = self.lld/'14-frontend.md'
        self.edit(p, "screen: 'REFUNDS/MK-05'", "screen: 'LOYALTY/MK-05'")
        out = self.cli('check_trace.py', self.run)
        self.assertIn('data LOYALTY/MK-05', out)
        self.edit(p, "data: { screen: 'LOYALTY/MK-05' }", 'data: {}')
        self.assertIn('no route data', self.cli('check_trace.py', self.run))

    def test_sdd_trigger_tie_named_service_and_reverse(self):
        self.clean(self.cli('check_sdd.py', self.sdd))
        p = self.sdd/'03-users-and-use-cases.md'
        self.edit(p, "`Schedule: waiting-requests-summary` |", "`Schedule: waiting-requests-summary` (notifications) |")
        self.assertIn('not in the Input table of 13d-service-notifications.md', self.cli('check_sdd.py', self.sdd))
        self.edit(p, ", `Schedule: waiting-requests-summary` (notifications) |", " |")
        self.assertIn('13b-service-refund-requests.md Input Schedule waiting-requests-summary cites REFUNDS/UC-04, but is not in its entry points',
                      self.cli('check_sdd.py', self.sdd))

    def test_sdd_trigger_row_citation_note_vs_problem(self):
        note = '03 §7.3: Event: RefundPaid for LOYALTY/UC-02: its Input row in 13e-service-loyalty-points.md cites no use case (predates the trigger tie)'
        out = self.cli('check_sdd.py', self.sdd)
        self.clean(out)
        self.assertIn('NOTES: 1', out)
        self.assertIn(note, out)
        p = self.sdd/'13e-service-loyalty-points.md'
        self.edit(p, '| Takes back the points of a paid refund |', '| Takes back the points of a paid refund ('+L2+' BR-1) |')
        out = self.cli('check_sdd.py', self.sdd)
        self.clean(out)
        self.assertNotIn('NOTES:', out)
        self.edit(p, L2+' BR-1', L1+' BR-1')
        out = self.cli('check_sdd.py', self.sdd)
        self.assertIn('entry point Event: RefundPaid for LOYALTY/UC-02: its Input row in 13e-service-loyalty-points.md cites LOYALTY/UC-01, not LOYALTY/UC-02', out)
        self.assertIn('13e-service-loyalty-points.md Input Event RefundPaid cites LOYALTY/UC-01, but is not in its entry points', out)

    def test_sdd_trigger_name_in_description_cell(self):
        self.edit(self.sdd/'13b-service-refund-requests.md', '| Schedule | `waiting-requests-summary`, daily | Daily', '| Schedule | daily, 08:00 | `waiting-requests-summary`: daily')
        self.clean(self.cli('check_sdd.py', self.sdd))
        self.edit(self.sdd/'03-users-and-use-cases.md', ', `Schedule: waiting-requests-summary` |', ' |')
        self.assertIn('13b-service-refund-requests.md Input Schedule waiting-requests-summary cites REFUNDS/UC-04, but is not in its entry points',
                      self.cli('check_sdd.py', self.sdd))

    def test_sdd_bare_schedule_name_cell_only_for_schedules(self):
        self.edit(self.sdd/'13b-service-refund-requests.md', '| Schedule | `waiting-requests-summary`, daily | Daily', '| Schedule | waiting-requests-summary | Daily')
        self.clean(self.cli('check_sdd.py', self.sdd))
        self.edit(self.sdd/'13e-service-loyalty-points.md', '| Event | refund-requests: `RefundPaid` |', '| Event | RefundPaid |')
        self.assertIn('03 §7.3: entry point Event: RefundPaid not in the Input table of 13e-service-loyalty-points.md', self.cli('check_sdd.py', self.sdd))

    def test_sdd_bare_schedule_name_wins_over_description_backticks(self):
        p = self.sdd/'13b-service-refund-requests.md'
        self.edit(p, '| Schedule | `waiting-requests-summary`, daily | Daily', '| Schedule | waiting-requests-summary | Sent `daily` from the `outbox`:')
        self.clean(self.cli('check_sdd.py', self.sdd))
        self.edit(p, '| Schedule | waiting-requests-summary | Sent `daily` from the `outbox`:', '| Schedule | daily | `waiting-requests-summary`:')
        self.assertIn('03 §7.3: entry point Schedule: waiting-requests-summary not in the Input table of 13b-service-refund-requests.md', self.cli('check_sdd.py', self.sdd))

    def test_sdd_entry_point_service_name_resolves(self):
        p = self.sdd/'03-users-and-use-cases.md'
        self.edit(p, '`Schedule: waiting-requests-summary` |', '`Schedule: waiting-requests-summary` (Refund Requests) |')
        self.clean(self.cli('check_sdd.py', self.sdd))
        self.edit(p, '(Refund Requests)', '(refund-request-svc)')
        out = self.cli('check_sdd.py', self.sdd)
        self.assertIn("03 §7.3: entry point Schedule: waiting-requests-summary names service 'refund-request-svc', which matches no 13x file", out)
        self.assertNotIn('not in the Input table', out)

    def test_sdd_events_value_must_be_fired_by_the_use_case(self):
        p = self.sdd/'03-users-and-use-cases.md'
        t = p.read_text(encoding='utf-8')
        line = next(l for l in t.splitlines() if l.startswith('| [LOYALTY/UC-02]'))
        c = line.split(' | ')
        c[3] = c[3].replace(', `Event: RefundPaid`', '')
        c[6] = '`RefundPaid`'
        p.write_text(t.replace(line, ' | '.join(c)), encoding='utf-8', newline='\n')
        self.edit(self.sdd/'13e-service-loyalty-points.md', '| Takes back the points of a paid refund |', '| Takes back the points of a paid refund ('+L2+' BR-1) |')
        out = self.cli('check_sdd.py', self.sdd)
        self.assertIn('03 §7.3: LOYALTY/UC-02 Events lists RefundPaid, which §14.5/§14.10 do not fire for LOYALTY/UC-02', out)
        self.assertIn('13e-service-loyalty-points.md Input Event RefundPaid cites LOYALTY/UC-02, but is not in its entry points', out)

    def test_sdd_multi_event_row_cites_no_use_case(self):
        self.edit(self.sdd/'13d-service-notifications.md', '| One message per recipient and channel |', '| One message per recipient and channel ('+L2+' BR-1) |')
        out = self.cli('check_sdd.py', self.sdd)
        self.assertIn('13d-service-notifications.md Input row lists 6 events and cites a use case', out)
        self.assertNotIn('13d-service-notifications.md Input Event', out)

    def test_trace_route_cell_app_label(self):
        self.clean(self.cli('check_trace.py', self.run))
        self.edit(self.lld/'14-frontend.md', '| `/refunds/request` |', '| `/refunds/request` (Refunds Portal) |')
        self.clean(self.cli('check_trace.py', self.run))

    def test_hyphen_tokens_and_public_endpoints(self):
        self.clean(self.cli('check_sdd.py', self.sdd))
        self.edit(self.sdd/'13a-service-customer-accounts.md', 'None - public', 'None')
        self.assertIn("permission token cell 'None' names no token", self.cli('check_sdd.py', self.sdd))

    def test_backticked_public_marker_is_not_a_token(self):
        p = self.sdd/'13a-service-customer-accounts.md'
        self.edit(p, '| None - public |', '| `None - public` |')
        self.edit(p, '| None - public |', '| `-` |')
        self.clean(self.cli('check_sdd.py', self.sdd))
        self.edit(p, '| `None - public` |', '| `None` |')
        self.assertIn('permission token None not in §16.11', self.cli('check_sdd.py', self.sdd))

    def test_unknown_legacy_and_hyphen_tokens_rejected(self):
        p = self.sdd/'13b-service-refund-requests.md'
        for token in ('refund.missing.read', 'refund-requests.missing.read'):
            original = p.read_text(encoding='utf-8')
            p.write_text(original.replace('refund-requests.request.read-own', token), encoding='utf-8')
            out = self.cli('check_sdd.py', self.sdd)
            self.assertIn('token '+token+' not in', out)
            p.write_text(original, encoding='utf-8')
        p = self.lld/'04-implementation/refund-requests.md'
        self.edit(p, 'refund-requests.request.read-own', 'refund-requests.missing.read')
        self.assertIn('token refund-requests.missing.read not in', self.cli('check_trace.py', self.run))

    def test_e2e_modular_monolith(self):
        self.clean(self.cli('check_e2e.py', self.sdd))

    def test_legacy_broker_graph_labels(self):
        out = self.cli('check_e2e.py', ROOT/'_fixtures/chain/run-2026-10-01-e2e/sdd-refunds-platform')
        self.assertIn('problems: 5', out)
        self.assertNotIn('no edge', out)

    def test_stale_gate_over_chunk19_is_a_note(self):
        c18 = self.sdd/'18-open-items-and-clarifications.md'
        self.edit(c18, '- **Status:** Accepted - applied', '- **Status:** Decided - pending application')
        master = next(self.sdd.glob('*-sdd-master.md'))
        self.edit(master, '**E2E gate (chunk 19):** Open - Up to date', '**E2E gate (chunk 19):** Stale - E1 not met')
        out = self.cli('check_e2e.py', self.sdd)
        self.clean(out)
        self.assertIn('chunk 19 is Stale behind a shut gate', out)
        self.edit(master, '**E2E gate (chunk 19):** Stale - E1 not met', '**E2E gate (chunk 19):** Open - Up to date')
        self.assertIn('chunk 19 exists but the gate conditions are not all met', self.cli('check_e2e.py', self.sdd))

    def test_dead_letter_queue_names_are_not_tokens(self):
        out = self.cli('check_sdd.py', ROOT/'_fixtures/chain/run-2026-09-30/sdd-refunds-platform')
        self.assertNotIn('.dlq not in', out)
        self.assertIn('PROBLEMS: 37', out)

    def test_e2e_missing_real_edges(self):
        p = next(self.sdd.glob('19-*.md'))
        original = p.read_text(encoding='utf-8')
        for edge, listener in [('RefundRequestCancelled', 'POS adapter'), ('RefundPaid', 'loyalty-points')]:
            text, n = re.subn(r'^.*in-process: '+edge+r'.*\n', '', original, count=1, flags=re.M)
            self.assertEqual(n, 1)
            p.write_text(text, encoding='utf-8')
            self.assertRegex(self.cli('check_e2e.py', self.sdd), edge+r': no edge.*'+listener)
        p.write_text(original, encoding='utf-8')

    def test_universal_subscriber_needs_source_binding(self):
        self.edit(self.sdd/'10-events-hub.md', '- **notifications** listens to every refund event', '- **other** listens to every refund event')
        self.assertIn('RefundPaid: no edge refund-requests -> notifications', self.cli('check_e2e.py', self.sdd))

    def test_no_topics_claim_needs_empty_source(self):
        p = self.sdd/'10-events-hub.md'
        self.edit(p, '## 14.4', '## 14.4')
        t = p.read_text(encoding='utf-8')
        pos = t.index('## 14.5')
        t = t[:pos]+'| # | Topic | Owner (sole publisher) |\n|---|---|---|\n| 1 | `made-up-topic` | refund-requests |\n\n'+t[pos:]
        p.write_text(t, encoding='utf-8')
        self.assertIn('24.4 does not point', self.cli('check_e2e.py', self.sdd))

    def test_versions_per_module_and_brd_derived_chunks(self):
        self.clean(self.cli('check_versions.py', self.brd))
        self.clean(self.cli('check_versions.py', self.lld))
        self.edit(self.brd/'01-executive-summary-and-context.md', 'VERSION: 1.4', 'VERSION: 1.7')
        self.assertIn('does not list 01-executive-summary-and-context.md', self.cli('check_versions.py', self.brd))
        self.edit(self.lld/'04-implementation/notifications.md', 'VERSION: 1.0', 'VERSION: 1.1')
        self.assertIn('does not list 04-implementation/notifications.md', self.cli('check_versions.py', self.lld))
        self.edit(self.lld/'04-implementation/customer-accounts.md', 'VERSION: 1.1', 'VERSION: 0.1')
        self.assertIn('lists 04 but 04-implementation/customer-accounts.md', self.cli('check_versions.py', self.lld))

    def test_versions_skip_source_snapshot_folders(self):
        chunk = self.brd/'02-glossary-assumptions-facts.md'
        old = chunk.read_text(encoding='utf-8').replace('VERSION: 1.7', 'VERSION: 1.0', 1)
        for folder in ('source-snapshot', 'source-snapshot-v1.0'):
            (self.brd/folder).mkdir()
            (self.brd/folder/chunk.name).write_text(old, encoding='utf-8', newline='\n')
        self.clean(self.cli('check_versions.py', self.brd))
        (self.brd/'other-folder').mkdir()
        (self.brd/'other-folder'/chunk.name).write_text(old, encoding='utf-8', newline='\n')
        self.assertIn('lists 02 but other-folder/02-glossary-assumptions-facts.md', self.cli('check_versions.py', self.brd))

    def test_initial_chunks_none(self):
        p = next(self.sdd.glob('00-*.md'))
        t = p.read_text(encoding='utf-8')
        t = re.sub(r'Chunks: [^|\n]+', 'Chunks: none (initial build) ', t)
        p.write_text(t, encoding='utf-8')
        self.assertNotIn('names sections (a combined document)', self.cli('check_versions.py', self.sdd))

    def test_sdd_context_size_and_workflow_limit(self):
        self.assertIn('issues: 0', self.cli('check_mermaid.py', self.sdd))
        p = self.sdd/'04-architecture-style-and-diagrams.md'
        text = p.read_text(encoding='utf-8')
        text += '\n## 8.4 Workflow\n\n```mermaid\nflowchart TD\n'+''.join('  N'+str(i)+'["Node"]\n' for i in range(35))+'```\n'
        p.write_text(text, encoding='utf-8')
        self.assertNotIn('issues: 0', self.cli('check_mermaid.py', self.sdd))

    def test_diff_catalog_events_not_error_constants(self):
        spec = importlib.util.spec_from_file_location('diff_runs', CHECKERS/'diff_runs.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        p = Path(self.tmp.name)/'catalog.md'
        p.write_text('| Event | Publisher module |\n|---|---|\n| `RefundPaid` | refund-requests |\n\nError `REFUND_NOT_FOUND`; permission `refund-requests.request.read-own`.\n', encoding='utf-8')
        f = module.facts(p)
        self.assertEqual(f['events'], {'RefundPaid'})
        self.assertEqual(f['tokens'], {'refund-requests.request.read-own'})


if __name__ == '__main__':
    unittest.main()
