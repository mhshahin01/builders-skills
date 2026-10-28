# Run brief: missing Pre-SDD (Task 7.4 Step 1)

Written 2026-10-27 16:01 UTC, before either run.

## Purpose

Prove that `sdd-unifier` refuses to derive an SDD from BRDs when no Pre-SDD of those BRDs exists (step 2a item 5), in team mode and in solo mode, and that the status board records the stop.

## Inputs (this folder is the project root)

- `brd-refunds-portal/` and `brd-loyalty-points/`: copies of the FC baseline BRD folders from `WT\_fixtures\chain\run-2026-10-13-fc` (not edited).
- `unifier-status.md`: the board template from `WT\sdd-unifier\SKILL.md` § Status board, with `Run mode: team` set by the user before Run 1.
- No `pre-sdd-*/` folder, no `PRE-SDD-*.md` file, no `sdd-*/` folder, no project instruction files.

Skill under test: `WT\sdd-unifier\SKILL.md`, read from disk by path (WT = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier`). The installed skill and the Skill tool are not used.

## How questions are answered

The tester plays the user and answers each question in chat with the recommended option or stated default (for example Enter at the mode prompt). No standing answer policy is set in the request, and no test-run policy is set: the step 2a stop is not something either may pass (SKILL.md step 2a, last paragraph; step 8 Answer policy rule 5).

## Run 1: team mode

- Request: "Derive an SDD from these BRDs: ./brd-refunds-portal and ./brd-loyalty-points." (DERIVE-FROM-BRD, no arguments.)
- Expected:
  1. The run stops at step 2a (item 5, Missing) before step 3a.
  2. No SDD chunk is written (no `sdd-*/` folder or SDD file appears).
  3. The board gets HR-001, From Software Architect to E2E Architect, asking to create the Pre-SDD for these two BRDs, State `Open`.
  4. The `sdd-unifier` row reads `Waiting on: E2E Architect (HR-001)`.
  5. In team mode the skill does not start `pre-sdd-unifier` and does not offer to.
  6. `check_status_board.py` reports 0 problems.

## Run 2: solo mode

- Before the run, the user changes the board header to `Run mode: solo` (only the user changes it). The board otherwise stays as Run 1 left it.
- Request: the same as Run 1.
- At the offer to start `pre-sdd-unifier`, the user answers "later".
- Expected:
  1. The run stops at step 2a again; no SDD chunk is written.
  2. The skill offers to start `pre-sdd-unifier` now (solo mode).
  3. On "later", the request to create the Pre-SDD reads State `Later`.
  4. `check_status_board.py` reports 0 problems.

## Evidence kept

- `snapshots/run-1/unifier-status.md` and `snapshots/run-2/unifier-status.md`: the board after each run.
- `RESULT.md`: expected, observed (board rows and the driving skill text with WT file:line), PASS or FAIL per run.
