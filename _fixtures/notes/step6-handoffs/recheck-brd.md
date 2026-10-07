# BRD consistency re-check

## Summary

Counts: A 3, B 1, C 1 (5 total). All five findings are mechanical. Needs the user's decision: 0.

Needs-decision items: None. All requested BRD coverage is complete.

## A. Wrong or contradictory

### A-1. Re-chunk gives untouched body chunks the latest version

- Location: `brd-unifier/chunking.md:174`; related rule `brd-unifier/delivery-chunks.md:426`.
- Classification: **A, mechanical**. New defect in decision C11's implementation, following stage 4 `brd:B-9` and `brd:A-4`.
- Current text in `chunking.md` (exact and unique):
  ```text
  and for any other chunk from the newest Changes Log row whose `Chunks:` list names it or one of its sections, else from the cover
  ```
- Why: the first build's Changes Log row expressly lists no chunks. A combined BRD at 1.2 whose later rows change only Use Cases has no matching row for an untouched Glossary. This instruction assigns that chunk 1.2, although the version rule says unchanged chunks keep the version in which their content last changed. The failure occurs for normal new-format documents, not only old histories.
- Replace with:
  ```text
  and for any other chunk from the newest Changes Log row whose `Chunks:` list names it or one of its sections, else from the earliest Changes Log row (use the cover only if the log has no rows)
  ```
### A-2. The new gate comments forbid execution tracking that the workflow permits

- Locations: `brd-unifier/chunks/15-implementation.md:9`, `brd-unifier/chunks/16-uat-bat-test-cases.md:10`, and `brd-unifier/TEMPLATE-COMBINED.md:475`.
- Classification: **A, mechanical**. New contradiction introduced by this round's F4 status-mark wording. The related stage 4 finding `cross:A-8` fixed the link-update exception in chunk 17; execution tracking in 15 and 16 is a separate exception still omitted.
- Why: the headers now say only the status line may change while the gate is shut. `delivery-chunks.md:434` expressly permits a task's Delivery status and a case's Testing Result and Testing Comment at any time, including a shut gate. SKILL.md step 10's delivery-progress row also says no gate check is needed. A literal run must either refuse valid test results or break the template's new instruction.
- Exact fixes:
  1. In each of `brd-unifier/chunks/15-implementation.md` and `brd-unifier/chunks/16-uat-bat-test-cases.md`, current (unique in each file):
     ```text
     Never written or refreshed while the gate is shut; only its status line may change, to Stale (delivery-chunks.md § The delivery gate, Re-lock).
     ```
     New:
     ```text
     Never written or refreshed while the gate is shut. A Stale mark and execution tracking are allowed (delivery-chunks.md § The delivery gate, Re-lock, and § Refresh triggers).
     ```
  2. In `brd-unifier/TEMPLATE-COMBINED.md`, current (unique):
     ```text
     - Once written, they are never refreshed while the gate is shut; only their status lines (Plan status, Suite status) may change, to Stale (delivery-chunks.md § The delivery gate, Re-lock).
     ```
     New:
     ```text
     - Once written, they are never refreshed while the gate is shut. Stale marks on Plan status and Suite status, and execution tracking, are allowed (delivery-chunks.md § The delivery gate, Re-lock, and § Refresh triggers).
     ```
### A-3. Step 5 still puts planned skips in Pending gate

- Location: `brd-unifier/delivery-chunks.md:208`; conflicting text: the same file at line 123, and `brd-unifier/chunks/14-todo.md:229,234`.
- Classification: **A, mechanical**. This predates the round, but qualifies for the brief's cheap class A exception. It is not among stage 4's BRD findings.
- Current text in `brd-unifier/delivery-chunks.md` (exact and unique):
  ```text
  At first generation, fill both tracking tables (diagram plan for chunk 05; one row per use case with step count, decision points, and `Required` / `Skip - linear` / `Skip - fewer than 3 steps`) and leave every status `Pending gate`.
  ```
- Why: the status rule says a planned skip is `Skipped` from the start. Chunk 14's example follows that rule. The specific first-generation instruction instead puts every row in `Pending gate`, including the rows that should already be `Skipped`.
- Replace with:
  ```text
  At first generation, fill both tracking tables (diagram plan for chunk 05; one row per use case with step count, decision points, and `Required` / `Skip - linear` / `Skip - fewer than 3 steps`). Set planned skips to `Skipped` and every other row to `Pending gate`.
  ```
## B. Ambiguous

### B-1. The new remainder de-duplication rule matches the point, not the question

- Location: `brd-unifier/delivery-chunks.md:449`.
- Classification: **B, mechanical**. Introduced by the fix for stage 4 `brd:B-2`.
- Current text in `brd-unifier/delivery-chunks.md` (exact and unique):
  ```text
  (an item whose `Where` already names that point is not raised again)
  ```
- Why: SKILL.md's hand-off row raises an item for each open remainder. The new test only checks whether an item names the review point. If one point leaves two distinct questions, the first item can suppress the second. It also gives no way to distinguish point IDs from different review trackers. The BRD's own consolidation rule is one row per distinct question (`delivery-chunks.md:139`).
- Replace with:
  ```text
  (reuse an existing item only when it covers the same question from the same review point and tracker; otherwise raise a new item)
  ```
## C. Cosmetic

### C-1. The master still asks for the same state value, rather than the same state

- Location: `brd-unifier/chunks/brd-master.md:128`.
- Classification: **C, mechanical**. The wording mismatch from stage 4 `brd:C-7` remains in this newly added master comment. `delivery-chunks.md:53` was corrected to allow chunk 14 to add a date and basis after `Up to date`.
- Current text in `brd-unifier/chunks/brd-master.md` (exact and unique):
  ```text
  State is the same value as the chunk's status line and its Downstream outputs row in 14-todo.md (delivery-chunks.md § The delivery gate, Re-lock).
  ```
- Why: the three cells share a state, but not necessarily the same complete value. A chunk 14 row may read `Up to date ([date], BRD v[X.X])`, while the master and chunk status line read `Up to date`.
- Replace with:
  ```text
  State matches the chunk's status line and its Downstream outputs row in 14-todo.md; that row may add the date and basis after Up to date (delivery-chunks.md § The delivery gate, Re-lock).
  ```
## Coverage and verification

- Read `git diff HEAD -- brd-unifier` across all 20 changed files, with the changed passages in their current surrounding rules. Covered the main workflow, update and transform paths, merge/re-chunk behavior, decision log, delivery gate, derivation, diagrams, and use-case conventions.
- Compared all 19 chunk skeletons with `TEMPLATE-COMBINED.md`: 16 body copies, plus the deliberately separate 14, 17, and master. A read-only Python `difflib` comparison removed headers/footers and separators and adjusted the use-case heading levels. Manually checked its differences and the template comments, including the combined template's instructions to use the full 15/16 blocks. Remaining differences are mode-specific links/headings, example detail, or explicit delegated blocks, apart from A-2.
- Checked the BRD side of `sdd-unifier/brd-to-sdd.md`: Source BRDs register, source paths and versions, finished-parts detection, cover Status, all field-mapping inputs, `Needed before`, and delivery-context states. C1's `Build of UC-NN`, BAT sign-off, and go-live values agree with the current BRD skeleton and derivation rules. Go-live dependencies are listed with an owner at BAT sign-off, as decided.
- Checked `lld-unifier/sdd-to-lld.md` against the BRD master State cell, chunk 14's `MK-NN`, Use cases and Figma link columns and `#mockup-coverage` anchor, and chunk 16's feature headings, IDs, `Related UC`, traceability, and state vocabulary. No remaining interface mismatch found in that scope.
- Checked `business-reviewer-unifier/apply-and-verify.md` Apply rules and Hand-off item 1 against the BRD's `update the todo` row, Clarification/Marker/Business review registers, open remainders, one-version rule, cover-status rule, and all three Stale locations. The new duplicate rule is B-1; the status wording findings are A-2 and C-1.
- Reconciled all 28 items in `_fixtures/notes/step6-consistency/brd.md` and the BRD-related findings in the other stage 4 reports with the current text, plus the applicable F1-F4, BRD decisions and accepted C1/C8/C11 decisions. The old fixes are present. A-1 and B-1 identify defects introduced by those fixes; C-1 identifies the remaining wording from `brd:C-7`. A-3 uses the brief's explicit exception for a pre-existing, cheap class A correction.
- No source fixes, state-changing Git commands, scratch files, root README inspection, or checker changes. This scope does not run the LLD-only `check_refs.py` step. No requested BRD coverage remains incomplete.

Read-only Python verification passed: all seven current-text occurrences match exactly once at the reported lines; all five findings have replacement text. The report decodes as UTF-8, has no BOM and has zero carriage-return bytes. No proposed replacement contains an em dash or en dash.

Report: `_fixtures/notes/step6-handoffs/recheck-brd.md`.

Counts: A 3, B 1, C 1 (5 total). Mechanical: 5. Needs the user's decision: 0.

Needs-decision items: None.
