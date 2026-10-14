import importlib.util
import unittest
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / '_e2e_gate.py'
spec = importlib.util.spec_from_file_location('gate', MODULE)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)

class RepeatedReconciledEvidence(unittest.TestCase):
    def test_repeated_labels_select_latest_hash(self):
        master = ('**Reconciled:** 1. 2026-10-13, author before review, no disk hash claimed.\n'
                  '**Reconciled:** 2. 2026-10-13T15:17:54-05:00, parent final on-disk step 6a. Checked sha256:ea6870928a70a71b (chunks 00-17).\n')
        self.assertEqual(gate.reconciled_hash(master), 'ea6870928a70a71b')

    def test_repeated_labels_do_not_reuse_old_hash(self):
        master = ('**Reconciled:** (1) 2026-10-12, checked revision sha256:1111111111111111 (chunks 00-17).\n'
                  '**Reconciled:** (2) 2026-10-13, final order record with no hash.\n')
        self.assertIsNone(gate.reconciled_hash(master))
        self.assertEqual(gate.reconciled_date(master), '2026-10-13')

    def test_repeated_blocks_choose_highest_number(self):
        master = ('**Reconciled:**\n10. 2026-10-13, checked revision sha256:aaaaaaaaaaaaaaaa (chunks 00-17).\n'
                  '**Reconciled:**\n2. 2026-10-12, checked revision sha256:2222222222222222 (chunks 00-17).\n')
        self.assertEqual(gate.reconciled_hash(master), 'aaaaaaaaaaaaaaaa')
        self.assertEqual(gate.reconciled_date(master), '2026-10-13')

    def test_later_block_has_highest_number(self):
        master = ('**Reconciled:**\n2. 2026-10-12, checked revision sha256:2222222222222222 (chunks 00-17).\n'
                  '**Reconciled:**\n10. 2026-10-13, checked revision sha256:aaaaaaaaaaaaaaaa (chunks 00-17).\n')
        self.assertEqual(gate.reconciled_hash(master), 'aaaaaaaaaaaaaaaa')
        self.assertEqual(gate.reconciled_date(master), '2026-10-13')

    def test_equal_numbers_prefer_later_record(self):
        master = ('**Reconciled:** (2) 2026-10-12, checked revision sha256:1111111111111111 (chunks 00-17).\n'
                  '**Reconciled:** (2) 2026-10-13, checked revision sha256:2222222222222222 (chunks 00-17).\n')
        self.assertEqual(gate.reconciled_hash(master), '2222222222222222')
        self.assertEqual(gate.reconciled_date(master), '2026-10-13')

    def test_unnumbered_blocks_prefer_later_record(self):
        master = ('**Reconciled:** 2026-10-12, checked revision sha256:1111111111111111 (chunks 00-17).\n'
                  '**Reconciled:** 2026-10-13, checked revision sha256:2222222222222222 (chunks 00-17).\n')
        self.assertEqual(gate.reconciled_hash(master), '2222222222222222')
        self.assertEqual(gate.reconciled_date(master), '2026-10-13')

    def test_newest_record_does_not_import_neighbor_hash(self):
        master = ('**Reconciled:** (3) 2026-10-13, final order record without hash.\n'
                  '**E2E gate (chunk 19):** Locked, historical checked revision sha256:3333333333333333 (chunks 00-17).\n'
                  '**Reconciled:** (2) 2026-10-12, checked revision sha256:2222222222222222 (chunks 00-17).\n')
        self.assertIsNone(gate.reconciled_hash(master))
        self.assertEqual(gate.reconciled_date(master), '2026-10-13')

if __name__ == '__main__':
    unittest.main()
