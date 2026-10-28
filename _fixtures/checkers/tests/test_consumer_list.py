from pathlib import Path
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

CHECKERS = Path(__file__).resolve().parents[1]
ROOT = CHECKERS.parents[1]
S8 = ROOT / '_fixtures/chain/run-2026-10-07-s8'
FC = ROOT / '_fixtures/chain/run-2026-10-13-fc'
SECTION = chr(0xA7)
ARROW = chr(0x2192)
API12 = '| API-12 | Get a customer\'s contact details | notifications | customer-accounts |'
EDGE4 = (f'| 4 | refund-requests {ARROW} customer-accounts (in-process) | API-12 | Get a customer\'s contact details '
         '| Contact details never travel in events (ADR-05) |\n')
API07 = '| API-07 | Get refund records for reconciliation | payout | CardPay Ltd |'
DISPUTES = '| [API-09](../sdd-refunds-platform/11-api-contracts.md#api-09-receive-card-dispute-notices-cardpay-ltd---payout) |'
OUTBOUND = ('| [API-07](../sdd-refunds-platform/11-api-contracts.md#api-07-get-refund-records-for-reconciliation-payout---cardpay-ltd) '
            '| TBD | TBD | Fetch the refund records from CardPay Ltd | N/A | - | 200 |\n')


def run(name, *args):
    p = subprocess.run([sys.executable, '-B', str(CHECKERS / name), *map(str, args)], capture_output=True, text=True,
                       encoding='utf-8', env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONHASHSEED': '0'})
    return p.stdout + p.stderr


def problem_lines(out):
    count = int(re.search(r'^problems: (\d+)$', out, re.M)[1])
    block = out.split('problems:', 1)[1].split('\nnotes:', 1)[0]
    lines = [line[3:] for line in block.splitlines() if line.startswith(' - ')]
    return count, lines


class Copy(unittest.TestCase):
    SOURCE = None

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='consumer-list-')
        self.run_dir = Path(self.tmp.name) / 'run'
        shutil.copytree(self.SOURCE, self.run_dir)
        self.sdd = self.run_dir / 'sdd-refunds-platform'

    def tearDown(self):
        self.tmp.cleanup()

    def edit(self, path, old, new):
        text = path.read_text(encoding='utf-8')
        self.assertIn(old, text)
        path.write_text(text.replace(old, new, 1), encoding='utf-8', newline='')


class E2eConsumerList(Copy):
    SOURCE = S8

    def callers(self, cell):
        self.edit(self.sdd / '11-api-contracts.md', API12, API12.replace('| notifications |', f'| {cell} |'))

    def add_edge(self):
        c19 = self.sdd / '19-e2e-system-design.md'
        text = c19.read_text(encoding='utf-8')
        row3 = re.search(r'^\| 3 \| customer-accounts .*\n', text, re.M)
        self.assertIsNotNone(row3)
        self.edit(c19, row3[0], row3[0] + EDGE4)
        self.edit(c19, '| In-process port calls | 3 |', '| In-process port calls | 4 |')

    def e2e(self):
        count, lines = problem_lines(run('check_e2e.py', self.sdd))
        return count, [line for line in lines if f'{SECTION}24.' in line or 'Counts at a Glance' in line]

    def test_checkE2e_oneConsumer_pass(self):
        self.assertEqual(self.e2e()[1], [])

    def test_checkE2e_twoConsumersBothEdges_pass(self):
        base = self.e2e()[0]
        self.callers('notifications, refund-requests')
        self.add_edge()
        self.assertEqual(self.e2e(), (base, []))

    def test_checkE2e_twoConsumersOneRowNamingBoth_pass(self):
        base = self.e2e()[0]
        self.callers('notifications, refund-requests')
        c19 = self.sdd / '19-e2e-system-design.md'
        self.edit(c19, f'| 1 | notifications {ARROW} customer-accounts', f'| 1 | notifications, refund-requests {ARROW} customer-accounts')
        self.assertEqual(self.e2e(), (base, []))

    def test_checkE2e_twoConsumersOneEdgeMissing_problem(self):
        base = self.e2e()[0]
        self.callers('notifications, refund-requests')
        count, lines = self.e2e()
        self.assertEqual(count, base + 1)
        self.assertEqual(len(lines), 1, lines)
        self.assertIn('API-12 has no edge refund-requests -> customer-accounts', lines[0])

    def test_checkE2e_parenthesisedCommaKeptInOneConsumer_pass(self):
        sys.path.insert(0, str(CHECKERS))
        try:
            from _sdd_values import consumers
        finally:
            sys.path.remove(str(CHECKERS))
        self.assertEqual(consumers(f'Platform IAM (Keycloak, {SECTION}6)'), [f'Platform IAM (Keycloak, {SECTION}6)'])
        self.assertEqual(consumers('`payout`, [refund-request](./13a.md#x)'), ['payout', 'refund-request'])


class TraceConsumerList(Copy):
    SOURCE = FC

    def trace(self, cell=None):
        api06 = self.run_dir / 'lld-refunds-platform' / '06-api-contracts.md'
        row = next(line for line in api06.read_text(encoding='utf-8').splitlines(keepends=True) if line.startswith(DISPUTES))
        self.edit(api06, row, row + OUTBOUND)
        if cell is not None:
            self.edit(self.sdd / '11-api-contracts.md', API07, API07.replace('| payout |', f'| {cell} |'))
        return problem_lines(run('check_trace.py', self.run_dir))

    def test_checkTrace_oneConsumer_pass(self):
        self.assertEqual(self.trace(), (0, []))

    def test_checkTrace_twoConsumersIncludingService_pass(self):
        self.assertEqual(self.trace('refund-request, payout'), (0, []))

    def test_checkTrace_serviceNotAmongConsumers_problem(self):
        count, lines = self.trace('refund-request, loyalty-points')
        self.assertEqual(count, 1, lines)
        self.assertIn('API-07 consumer is', lines[0])


if __name__ == '__main__':
    unittest.main()
