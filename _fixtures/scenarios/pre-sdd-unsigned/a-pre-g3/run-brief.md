# Run brief: Pre-SDD present but not signed, before G3, team mode (Task 7.4 Step 2, case A)

Written 2026-10-27 19:53 UTC, before the run.

## Purpose

Prove that `sdd-unifier` refuses to derive an SDD when the Pre-SDD of its BRDs exists but G3 is not signed (step 2a item 4), lists the blockers, raises one request, and in team mode neither starts nor offers to start `pre-sdd-unifier`.

## Inputs (this folder is the project root)

- `brd-refunds-portal/`, `brd-loyalty-points/`, `AGENTS.md`: copies from the run `run-2026-10-27b-psdd` (the FC baseline BRDs).
- `pre-sdd-refunds-platform/`: a copy of `_snapshots\pre-sdd-refunds-platform.pre-g3\` of that run (v1.0, gate line `G2 - G3: Not signed - SDD authorized: No`, ten roles unsigned, G3-01 to G3-14 Open).
- `unifier-status.md`: the template of `WT\sdd-unifier\SKILL.md` § Status board with `Run mode: team` (set by the tester), the E2E Architect row `In progress: stage 4 (G3 sign-off stop)`, Folder `pre-sdd-refunds-platform/`, Version 1.0 (as the Pre-SDD master's progress table implies), no handoff requests.
- No `sdd-*` folder.

Skill under test: `WT\sdd-unifier\SKILL.md` and its rule files, read from disk by path (WT = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier`). Never the Skill tool; the pre-sdd-unifier rule files are not read in this case. No browser.

## Request and answers

"Derive an SDD from these BRDs: ./brd-refunds-portal and ./brd-loyalty-points. Answer policy: accept the recommended option." (set by the tester, 2026-10-27). The policy answers only questions with a recommended option or a stated default and never passes the step 2a stop.

## Expected

1. Step 2a finds the Pre-SDD (item 1), reads chunk 12, the master's gate line, then chunk 11 (item 2), finds it not signed (item 4), and stops before step 3a.
2. No `sdd-*` folder, no SDD chunk, no `decision-log.md`.
3. One request HR-001, From Software Architect, To E2E Architect, Request "Pre-SDD refunds-platform v1.0 blocks the SDD: <blockers>", the blockers as the gate line and chunk 11 name them (G3 Not signed; the ten roles; the open checklist lines), Link the absolute path of the Pre-SDD master, State `Open`.
4. The sdd-unifier row reads `Waiting on: E2E Architect (HR-001)`, Waiting on `E2E Architect (HR-001)`, Folder `-`.
5. Team mode: no offer to start `pre-sdd-unifier`.
6. `check_status_board.py` reports 0 problems.

## Evidence kept

`snapshots/run-0/unifier-status.md` (fresh board), `snapshots/unifier-status.md` (the board after the run), `RESULT.md`.
