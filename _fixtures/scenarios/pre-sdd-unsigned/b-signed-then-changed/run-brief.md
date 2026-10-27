# Run brief: Pre-SDD signed, then changed after G3, solo mode (Task 7.4 Step 2, case B)

Written 2026-10-27 19:59 UTC, before the run.

## Purpose

Prove that `sdd-unifier` treats a Pre-SDD whose G3 went back to `Review` after a change as not signed (step 2a item 4: the gate line reads `Review`, so item 3 does not load it), names the roles that must sign again, raises one request, and in solo mode offers to start `pre-sdd-unifier` (answer "later").

## Setup (E2E Architect, pre-sdd-unifier; the steps are recorded in RESULT.md)

- `brd-refunds-portal/`, `brd-loyalty-points/`, `AGENTS.md`: copies from the run `run-2026-10-27b-psdd`.
- `pre-sdd-refunds-platform/`: a copy of the signed Pre-SDD of that run (G3 Approved with conditions, after the Task 7.2b refresh).
- One change after G3, the skill's way (`WT\pre-sdd-unifier\gates-and-signoff.md` § Change after G3): the person `Product Owner (fixture owner)` sets CAP-07.1 (the everyday-action latency target) from 2000 ms to 1500 ms by a patch through `cli.mjs derive --apply`, then `cli.mjs compute`. The engine's G3 must read `Review`. Then the master's **Gate:** line, chunk 00's gate line, chunk 11 (the gate fragment and "SDD initiation authorized by") and chunk 12 § 12.1 are rewritten from the new fragment and the engine's label.
- `unifier-status.md`: the template of `WT\sdd-unifier\SKILL.md` § Status board with `Run mode: solo`, the E2E Architect row `In progress: stage 4 (G3 sign-off stop)` (G3 back to Review, waiting for the signers), no handoff requests.

Skills under test: `WT\sdd-unifier\SKILL.md` and its rule files (the SDD side never reads the pre-sdd-unifier rule files). No browser.

## Request and answers

As in case A. At the offer to start `pre-sdd-unifier`, the tester answers "later".

## Expected

1. Step 2a finds the Pre-SDD (item 1), reads chunk 12, the master's gate line (`Review`), chunk 11 (item 2); not signed (item 4; item 3 does not load it); stop before step 3a.
2. No `sdd-*` folder, chunk or `decision-log.md`.
3. One request HR-001 to the E2E Architect "Pre-SDD refunds-platform v1.0 blocks the SDD: <blockers>", the blockers naming that G3 reads Review and the ten roles that must sign again, Link the absolute path of the Pre-SDD master.
4. The sdd-unifier row `Waiting on: E2E Architect (HR-001)`, Folder `-`.
5. Solo: the skill offers to start `pre-sdd-unifier`; on "later" HR-001 reads `Later`.
6. `check_status_board.py` reports 0 problems.

## Evidence kept

`snapshots/run-0/unifier-status.md`, `snapshots/unifier-status.md`, `RESULT.md`.
