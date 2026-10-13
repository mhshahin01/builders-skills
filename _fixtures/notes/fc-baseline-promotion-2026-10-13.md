# FC baseline promotion, 2026-10-13

ROADMAP step 5. Mahmoud selected the latest completed run, FC. Skills work starts at `a22f97e` on branch `test/fc-regression-baseline`; Mahmoud approved the step 5 release and all remaining roadmap steps on 2026-10-13.

## Baseline and preservation

- New baseline: [run-2026-10-13-fc](../chain/run-2026-10-13-fc/BASELINE-PROVENANCE.md).
- 157 FC files copied and hashed, including source inputs, source snapshots and both referenced interview records; one provenance document added, for 158 files.
- The original 157 FC files were rehashed after validation: no changes.
- Twelve copied files have documented editorial or delivery-tracking changes. All source files, source snapshots, interview records, SDD files and LLD files remain byte-identical. No earlier fixture was edited.
- [Per-file SHA-256 manifest](./fc-baseline-2026-10-13-sha256.json) distinguishes original and normalized bytes.

## Changes

`check_sdd.py` now reports a missing use-case citation in an Event/Schedule Input row as a problem, as required by step 5. The CLI regression covers a missing citation, the matching citation and a citation to another use case. The test first failed on the unchanged checker (`PROBLEMS: 0`, `NOTES: 1`); after the one-line checker correction, all 30 CHK tests passed. The saved 2026-10-06 fixture remains frozen; only each disposable test copy receives its missing citation in setup.

Eight compound BRD markers were split into nineteen questions without supplying answers. Ten extra Open TD rows track the separated questions, with original owners and blocking references. REFUNDS has 90 rows and 66 distinct clarification questions; LOYALTY has 76 rows and 32 distinct questions. The copied LOYALTY interview status and G3 reflect the already-approved FC-7 A ruling: an unfinished interview is not Complete. Source and interview evidence links were relocated into the self-contained snapshot. See the provenance document for the mapping and scope.

Versions remain REFUNDS 1.5, LOYALTY 1.7, SDD 1.4 and LLD 1.2. No product fact or rule changed, no owner fact was supplied, no sign-off was added, and no consistency-review or interview run was invented. Both BRD step 2 statuses are In progress and G2 is Not met: the original consistency checks predate the normalized copy, whose current consistency coverage is pending. Each checklist has 0 of 5 steps Complete. The BRD gates remain Shut; the E2E gate remains Locked on 23 E3 blockers, with E4 met by content hash `96819fd891ef423f`.

## Verification

Executed all 26 commands in README How to run, including the frozen S3 scenario and the two report commands, plus the three regression suites. Raw command arguments, stdout, stderr and exit codes: [checks JSON](./fc-baseline-2026-10-13-checks.json).

| Check group | Result |
|---|---|
| Baseline checker problems and notes | 0 problems, 0 notes |
| Links | REFUNDS 469, LOYALTY 628, SDD 936, LLD 1111, root 8; 0 bad |
| LLD lineage and trace | 0 problems; 6 UC blocks, 7 index rows, 15 routes, 6 spec rows |
| Versions | All four documents: 0 problems, 0 notes |
| Mermaid heuristics | 1 / 1 / 17 / 43 blocks for REFUNDS / LOYALTY / SDD / LLD; 0 issues; not rendered |
| BRD to-do | REFUNDS 90 rows, 71 not resolved; LOYALTY 76 rows, 35 not resolved; both 0 problems and 0 notes |
| LLD flags | 65 Confirm, 74 TODO; both counters agree |
| Skill references | 303 checked, 0 problems; anchors OK and Child LLDs columns MATCH |
| CHK / E3-E4 / to-do regression suites | 30 / 36 / 20 tests pass, 86 total |
| Frozen S3 scenario | Expected 1 TD-88 problem and 13 heuristic notes, unchanged; not the baseline |

The first full pass found two broken evidence-link targets after copying run and source; copying the two original interview records and relocating the links fixed the cause. The final full pass had 29 accepted results and no changed original FC files. The earlier baseline remains for open-gate coverage; its missing trigger citation now fails the stricter checker, as intended.

## Changed copied files

- `brd-loyalty-points/01-executive-summary-and-context.md`
- `brd-loyalty-points/11-summary-and-uiux.md`
- `brd-loyalty-points/14-todo.md`
- `brd-loyalty-points/loyalty-points-brd-master.md`
- `brd-refunds-portal/02-glossary-assumptions-facts.md`
- `brd-refunds-portal/06a-use-cases-customer.md`
- `brd-refunds-portal/06b-use-cases-branch-manager.md`
- `brd-refunds-portal/09-reporting-and-analytics.md`
- `brd-refunds-portal/11-summary-and-uiux.md`
- `brd-refunds-portal/14-todo.md`
- `brd-refunds-portal/decision-log.md`
- `brd-refunds-portal/refunds-portal-brd-master.md`

## Review and release

Fresh-context read-only review found no Critical findings, two Important evidence issues and two Minor synchronization issues. Corrections applied:

- Restored the original LOYALTY CF-59 row verbatim; a separate 2026-10-13 note records the promotion corrections.
- Reopened step 2 in both copied BRDs and marked G2 Not met. Original check runs and findings are labeled historical; current normalized-copy consistency coverage is pending. No new BRD consistency run is claimed.
- Corrected the interview wording: 13 additional questions were never asked because the frontier remained blocked; D1 and D2 remain applied.
- Updated current mockup dependencies with the split TD rows in both BRDs.

After these corrections the complete validation matrix was rerun: 29 accepted results, all 86 tests pass, 0 baseline problems and 0 notes; all 157 original FC files remain unchanged. The focused reviewer recheck confirmed all four findings resolved, all 123 historical CF rows preserved, and the corrected interview wording and manifest hash. No Critical, Important or Minor findings remain. Ready to merge; the user approved the release on 2026-10-13. The review does not constitute product sign-off, a full BRD consistency rerun or Mermaid rendering.

Approved release, 2026-10-13:

1. Skills commit: `fix: require use-case citations for SDD triggers` (checker and regression test).
2. Skills commit: `test: promote FC as the regression baseline` (README, 158 baseline files and three evidence notes).
3. Project commit: `docs: record FC baseline promotion` (ROADMAP and shared progress).
4. Merge each short branch into its repository's main with `--no-ff`, then push only skills main. The project has no remote. Next roadmap work: step 7 R-POC draft, after this closeout; no fixture launch until skills main is committed and clean.
