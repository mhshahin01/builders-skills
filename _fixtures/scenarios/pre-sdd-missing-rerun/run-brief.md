# Run brief: missing Pre-SDD, rerun after skill fixes (Task 7.4 Step 1)

Written 2026-10-27 16:17 UTC, before either run.

## Purpose

Rerun the "missing Pre-SDD" scenario after the skill fixes that followed the first run (`..\pre-sdd-missing\RESULT.md`: Run 1 PASS, Run 2 FAIL because a second stop raised a duplicate request). Prove that `sdd-unifier` refuses to derive an SDD from BRDs when no Pre-SDD of those BRDs exists (step 2a item 5), in team mode and then in solo mode, that the second stop reuses the first request instead of raising a new one, and that the status board records both stops.

## Inputs (this folder is the project root)

- `brd-refunds-portal/` and `brd-loyalty-points/`: fresh copies of the FC baseline BRD folders from `WT\_fixtures\chain\run-2026-10-13-fc` (checked identical with `diff -r`; not edited).
- `unifier-status.md`: the board template from `WT\sdd-unifier\SKILL.md` § Status board, with `Run mode: team` set by the user before Run 1.
- No `pre-sdd-*/` folder, no `PRE-SDD-*.md` file, no `sdd-*/` folder, no project instruction files (`AGENTS.md`, `AGENT.md`, `CLAUDE.md`, `ui-ux-global-constitution.md`).

Skill under test: `WT\sdd-unifier\SKILL.md` and its rule files, read from disk by path (WT = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier`). The installed skill and the Skill tool are not used. Prompt path, unattended; no browser.

## How questions are answered

The request sets a test-run answer policy: "answer policy: accept the recommended option" (set by the tester, 2026-10-27). It answers only questions that carry a recommended option or a stated default (SKILL.md step 8, Answer policy, rule 1). It never passes the step 2a stop (rule 5; step 2a last paragraph). The solo-mode offer to start `pre-sdd-unifier` is answered by the tester in person with "later", as the task says.

## Run 1: team mode

- Request: "Derive an SDD from these BRDs: ./brd-refunds-portal and ./brd-loyalty-points. Answer policy: accept the recommended option." (DERIVE-FROM-BRD, no arguments.)
- Expected:
  1. The run stops at step 2a (item 5, Missing) before step 3a.
  2. No SDD folder, no SDD chunk, no `decision-log.md` is written, although the answer policy answered the mode prompt.
  3. The board gets HR-001, From Software Architect, To E2E Architect, Request "Create the Pre-SDD for BRDs <KEY list>", Link the absolute path of each BRD master separated by `; `, State `Open`.
  4. The `sdd-unifier` row reads State `Waiting on: E2E Architect (HR-001)`, Waiting on `E2E Architect (HR-001)`, Folder `-`.
  5. In team mode the skill does not start `pre-sdd-unifier` and does not offer to.
  6. `check_status_board.py` reports 0 problems.

## Run 2: solo mode

- Before the run, the user changes the board header to `Run mode: solo` (only the user changes it). The board otherwise stays as Run 1 left it.
- Request: the same as Run 1.
- At the offer to start `pre-sdd-unifier`, the user answers "later".
- Expected:
  1. Step 2a restarts at item 1 (the search), finds nothing, and stops again; no SDD folder, chunk, or `decision-log.md`.
  2. No new request: HR-001 is reused (no HR-002 on the board); its Request wording is unchanged (same blocker) and its Why holds the current blocker.
  3. The skill offers to start `pre-sdd-unifier` now; on "later" HR-001 reads State `Later`.
  4. The `sdd-unifier` row still points at HR-001.
  5. `check_status_board.py` reports 0 problems.

## Evidence kept

- `snapshots/run-1/unifier-status.md` and `snapshots/run-2/unifier-status.md`: the board after each run.
- `RESULT.md`: expected, observed (board rows and the driving skill text with WT file:line), PASS or FAIL per run.
