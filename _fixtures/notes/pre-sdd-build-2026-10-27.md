# Pre-SDD build: fixture runs and scenarios (2026-10-27)

The fixture runs of the pre-sdd-unifier build (plan Phase 7, Tasks 7.1 to 7.4), the checks they ran, and every skill or engine fix they caused. All times are UTC. The runs read the skills from the build worktree by path, never an installed copy. The briefs are in the plan folder `.superpowers/sdd/2026-10-23-pre-sdd-unifier-plan/` and are cited by name only.

## Copies and rulings (Task 7.5)

- Five trees were copied byte for byte from the session scratchpad into this folder: the chain runs [run-2026-10-27b-psdd](../chain/run-2026-10-27b-psdd/) (291 files) and [run-2026-10-27-psdd](../chain/run-2026-10-27-psdd/) (266 files), and the scenarios [pre-sdd-missing](../scenarios/pre-sdd-missing/) (75), [pre-sdd-missing-rerun](../scenarios/pre-sdd-missing-rerun/) (76) and [pre-sdd-unsigned](../scenarios/pre-sdd-unsigned/) (339). File counts and a sha256 list of each tree were equal before and after the copy.
- Scan before copying: no file over 2 MB. The owner's first name appears in 40 files, always in the sentence "full-autonomous run policy (set by ..., 2026-10-08)" that the FC BRDs carry, and in the two grill-me stand-in sessions. Absolute paths into the user folder appear in run briefs, `RESULT.md` files, `run-notes-sdd.md` (lines 218 and 231) and some board rows.
- Controller ruling: the no-name rule covers text the runs wrote. Inherited copies and the provenance paths are accepted, because the committed fixtures already carry the sentence and the paths. The check that backs the ruling: each of the 40 hit files was compared by sha256 with the file of the same relative path (inside its BRD folder or `standins/`) in `chain/run-2026-10-13-fc`. Result: 40 of 40 byte-equal, 0 different, so no run-written text holds the name. No copy was edited.
- Task 7.2c refreshed the chain run's Pre-SDD with the Task 7.0d engine: the lock list in chunk 12 gained the Measures and Owner columns and a calculations table. The SDD in that run was built before that fix, so 13 of its open markers still name the generic owner "E2E Architect (pre-sdd-unifier)" where the lock list now names the real owner. The SDD is kept as built, by ruling. The "Task 7.2c refresh" section of [run-notes.md](../chain/run-2026-10-27b-psdd/run-notes.md) lists the entries.
- FC (`chain/run-2026-10-13-fc`) stays the regression baseline for the BRD and SDD checks. The chain run `run-2026-10-27b-psdd` is the chain run for the Pre-SDD stage (evidence, not a BRD or SDD baseline).

## Runs and scenarios, in order

### Task 7.1: check_presdd.py

Brief: `task-7.1-brief.md`. The new checker [check_presdd.py](../checkers/check_presdd.py) and its 64 tests (`test_check_presdd.py`). It checks a chunked Pre-SDD against the state `compute` renders (fragment regions, gate line, signers, landing rows) and, with `--sdd`, an SDD that loaded it (Source Pre-SDD row, key, version, gate label, link, every cited `PSDD/<ID>`, the section 18 CALC values). Review round 1 fixed bare owner names in override rows, override headings in chunk 08, a dead branch, a two-digit slug read as a chunk, six sub-checks without a failing test and a fixed date. Counts after the fix: 64 tests, full checker suite 351.

### Task 7.2: first Pre-SDD run, kept as evidence

Brief: `task-7.2-brief.md` (prep in `task-7.2-prep-report.md`). Folder [run-2026-10-27-psdd](../chain/run-2026-10-27-psdd/): `pre-sdd-unifier full prompt chunks` on REFUNDS v1.5 and LOYALTY v1.7 under the test-run policy. Result: G3 Approved with conditions, SDD authorized; OPT-01 (one primary region with a pilot-light recovery region); COND-01; EXC-01 on SEC-01.1 granted by `Product Owner (fixture owner)` (ruling R23); 24 Open, 72 Confirmed, 2 N/A; review 2 passes of 3, 13 items. The pre-G3 copy is in `_snapshots/`. The runner found ten skill and engine problems (see Task 7.0b). The run is kept as the evidence of those defects, the way `run-2026-10-07-s7` is kept.

### Task 7.2 rerun: the chain run for the Pre-SDD stage

Brief: `task-7.2-brief.md`, adapted for the folder name. Folder [run-2026-10-27b-psdd](../chain/run-2026-10-27b-psdd/), run after Task 7.0b. Result: the same G3 outcome (Approved with conditions, OPT-01, COND-01, EXC-01); 23 Open, 70 Confirmed, 2 N/A; review 14 items; none of the first run's ten problems came back; six new problems (see Task 7.0c). Board: E2E Architect `Done v1.0`, HR-001 and HR-002 to the Product manager, HR-003 hand-off to the Software Architect (`Later`).

### Task 7.2b: refresh with the Task 7.0c engine

Brief: `task-7.2b-brief.md`. Derived files of the rerun were recomputed with the fixed engine on the unchanged state (content hash `4cb00d24633c9c0c...` equal before and after): the lock list gained BUS-07.1, BUS-08.1, the store kind and a Data decision row, the options fragment an At column, the risks table an ID column. OI-13 and OI-14 became `Adjusted - applied`. Checks: validate 4 PASS, check_status_board 0, check_presdd 0, validate_handoff PASS.

### Task 7.2c: refresh with the Task 7.0d engine

Brief: `task-7.2c-brief.md`. Only `12-locked-items.md` changed (Measures and Owner columns, calculations table CALC-01 to CALC-20) and chunk 12 was repasted. State hash equal. Checks: validate 4 PASS, check_status_board 0, check_presdd 0, validate_handoff PASS, check_presdd with `--sdd` 0. Step 6b read the SDD against the new chunk 12: REL-03 (RTO) and REL-04 (RPO) are the right way round everywhere, the section 18 CALC citations match, and all 15 open entries now name a real owner. 13 SDD markers keep the generic owner (see Copies and rulings).

### Task 7.3: the SDD run on the signed Pre-SDD

Brief: `task-7.3-brief.md`. In the same folder, `sdd-refunds-platform` v1.0 (modular monolith, four modules, 11 in-process events, 23 chunk files). Step 2a found `pre-sdd-refunds-platform` only (the `_snapshots` copy was not seen), judged it signed, loaded and locked it; every chunk 12 landing row is cited as `PSDD/<ID>` in its place. OI-23 and OI-24 (the locked peak request rate against the locked peak users) stay Open, owned by the E2E Architect (HR-004, HR-005); HR-003 went `Later`, `Accepted`, `Done`. E2E gate Locked (E1 5 items, E3 17 blockers, E4 met by content hash). Five skill problems found (see Task 7.0d). Report: [run-notes-sdd.md](../chain/run-2026-10-27b-psdd/run-notes-sdd.md).

### Task 7.4 step 1: missing Pre-SDD

Brief: `task-7.4-brief.md`. [pre-sdd-missing](../scenarios/pre-sdd-missing/RESULT.md): run 1 (team) PASS, stop at step 2a with HR-001 to the E2E Architect; run 2 (solo, answer "later") FAIL, a second stop raised a duplicate HR-002 while HR-001 stayed Open, step 2a resumed at item 2, and the Waiting on and Folder cells were undefined. This led to Task 7.0a. [pre-sdd-missing-rerun](../scenarios/pre-sdd-missing-rerun/RESULT.md) after the fix: run 1 team PASS, run 2 solo "later" PASS (restart at item 1, HR-001 reused and set `Later`, no HR-002).

### Task 7.4 step 2: Pre-SDD present but not signed

Brief: `task-7.4-step2-brief.md`. [pre-sdd-unsigned](../scenarios/pre-sdd-unsigned/) with two cases. `a-pre-g3` (team): the Pre-SDD copied from the pre-G3 snapshot, G3 Not signed, PASS, stop at step 2a item 4, HR-001 with the blockers. `b-signed-then-changed` (solo): the signed Pre-SDD with CAP-07.1 changed from 2000 to 1500 ms by the fixture owner, G3 back to Review, PASS, stop at step 2a item 4, HR-001 `Later` after "later". No SDD folder in either case. Four documentation gaps found (see Task 7.0d).

## Checks

| Check | Subject | Result |
|---|---|---|
| `cli.mjs validate project-state.json` | chain run Pre-SDD | 4 PASS (gate G3 Approved with conditions) |
| `check_presdd.py PSDD --cli ...` | chain run Pre-SDD | 0 problems |
| `check_presdd.py PSDD --sdd SDD --cli ...` | chain run Pre-SDD and SDD | 0 problems |
| `check_status_board.py` | chain run, first run, all four scenario cases | 0 problems each |
| `validate_handoff.py blueprint.json --require-approved` | chain run Pre-SDD | Schema + referential/governance validator: PASS |
| `check_presdd.py` | case A (pre-G3) | 2 problems, not recorded in its RESULT.md: the 07 options and 12 lock list regions differ from what the current engine renders, because the pre-G3 snapshot predates Tasks 7.0c and 7.0d |
| `check_presdd.py` | case B (G3 Review, limited setup) | 3 problems expected: the 03b, 10 and 12.2 regions differ from the recomputed fragments |
| `_linkcheck.py` | chain run SDD | 1605 links, 475 SDD references, 0 bad |
| `_linkcheck.py` | chain run Pre-SDD | 196 links, 8 SDD references, 0 bad |
| `check_chain_skills.py . --exclude ...` | worktree | 0 problems |
| `check_sdd`, `check_uc_keys`, `check_uc_links`, `check_e2e`, `check_versions`, `check_mermaid` | chain run SDD (Task 7.3, 21:45) | 0 problems each; E2E gate Locked (E1 5, E3 17), E4 met |

Case A and case B keep their `check_presdd` problems as evidence: case A's copy is the pre-G3 snapshot taken before the Task 7.0c and 7.0d engine fixes. The setup of case B rewrote only the gate files; a full update (version bump, delta review, content chunks) would clear them.

## Skill and engine fixes made from the runs

### Task 7.0a (from Task 7.4 step 1)

Brief: `task-7.0a-brief.md`. Shared `## Status board` section in all eight SKILL.md files (new section hash `550fe1b0b4fb07cd` after fix round 0) and sdd-unifier SKILL.md.
- One request per blocker: a raiser reuses its own `Open`, `Later` or `Accepted` request instead of raising a second one. Problem fixed: duplicate HR-002 in the solo "later" run.
- The raiser sets `Later` on its own request when the user answers "later". Problem fixed: the request stayed `Open`.
- Waiting on and Folder cells defined. Problem fixed: the board text never said what they hold before a folder exists.
- Step 2a Request wording, Link, and restart at item 1. Problem fixed: step 2a had neither wording nor link, and a resume skipped the search.
- Nothing written into `sdd-<slug>/` (the mode prompt record included) before step 2a passes. Problem fixed: the answer policy could write `decision-log.md` before the stop.

### Task 7.0b (from the first Pre-SDD run)

Brief: `task-7.0b-brief.md`, Part A engine (`task-7.0b-A-report.md`), Part B Markdown (`task-7.0b-B-report.md`).
- B1: the chosen option's reason goes to the decision log and the ADR, never into `decide`. Problem fixed: the engine refused `decide` with a reason and no override.
- B2: under an answer policy, an answer that changes a protected value becomes `Decided - waiting for a person`. Problem fixed: the accept loop could not apply a policy-accepted wording fix on a Confirmed entry.
- B3: a Recommended Answer must be one an op can apply (an unknown is closed and re-added). Problem fixed: OI-06 recommended a change no op can make.
- B4: chunk 12's Gate row holds the engine's gate label only. Problem fixed: two readings of the row, and a check_presdd failure.
- A1: landings for DAT-01, INT-03, CAP-08, REL-10 (CAP-03 already landed). Problem fixed: four hard answers had no place in the lock list.
- A2 and B6: a new Pre-SDD reads `Draft` until G0 is met, ahead of `Blocked`. Problem fixed: `Draft` was unreachable.
- A3: numbers print with four digits (0.2292 req/s), the currency comes from ECO-02 (ISO 4217 codes only, TCO and other acronyms skipped), and the Inputs column traces to register entries. Problem fixed: 0.22916666666666669 req/s, "currency units" and wrong inputs.
- B5: the security diagram is placed in chunk 05. Problem fixed: `security.mmd` was an orphan.
- B7: CAP-03 feeds no calculation in engine 3.0, and the docs now say so.
- The Option shape text in the fixture answers contradicted the engine shape. This was the fixture's fault, not a skill defect; the run is the test of the skill.

### Task 7.0c (from the Task 7.2 rerun)

Brief: `task-7.0c-brief.md`, report `task-7.0c-report.md`. Engine 472 of 472 tests.
- BUS-07 and BUS-08 land in section 11. Problem fixed: two hard entries were missing from the lock list.
- A fact only a person gives, under an answer policy, takes `Decided - waiting for a person` (docs only, engine unchanged). Problem fixed: the accept loop could not apply an agent-runnable fix on a person-only fact.
- The lock list shows the DAT-01 store kind (`<value> (storeKind: <kind>)`) and a Data decision row. Problem fixed: chunk 12 promised the store kind and did not print it.
- The options fragment gains an At column. Problem fixed: it showed who confirmed, not when.
- The risks table has an ID column and chunk 00's ID Index an R-NN row. Problem fixed: chunk 09 and the reviewer cited risks by an ID the template did not give.
- Not changed, parked: a `set-overlay` answer equal to the current value leaves no history record (see Parked below). The fixture's REL-03.1 over REFUNDS/NFR-02 is fixture data and shows SLO-15 firing; kept.

### Task 7.0d (from the SDD run and the unsigned scenarios)

Brief: `task-7.0d-brief.md`, report `task-7.0d-report.md`. Engine 474 of 474 tests.
- The lock list gains a Measures column. Problem fixed: the SDD could not tell what REL-03 or REL-04 measured (RTO or RPO).
- A calculations table (CALC-01 to CALC-20) in chunk 12. Problem fixed: section 18 had to cite CALC values that were not in the chunk the SDD reads.
- The lock list gains an Owner column. Problem fixed: the SDD's open markers had no owner for an open entry and fell back to the generic "E2E Architect (pre-sdd-unifier)".
- Header rows link to their row heading in chunk 01 section 1.1 (the combined mode too). Problem fixed: no link target for header rows.
- Q7 when DAT-07.1 is open: recorded open, waiting for the entry's owner (architecture-questionnaire.md and sdd-unifier SKILL.md step 3b). Problem fixed: the SDD had no rule for a locked isolation level that is still open.
- Change after G3 names the files it rewrites (gate lines, chunk 11, chunk 12 section 12.1, the touched regions). Problem fixed: case B's setup had to guess.
- Step 2a item 4 gives the blockers in short form. Problem fixed: case A and B wrote the blockers in their own words.
- OI-24 (CAP-02.1 0.2292 req/s against CAP-03.1 300 peak users) checked, no change: CALC-03 is 2,000 / 86,400 x 3 x 3 x 1.1, the formula is right and the cause is the fixture inputs.
- After review: the blocker example at sdd-unifier SKILL.md:161 now matches the printed text; engine-and-studio.md:284 kept in step.

## Parked for the final review

Read from `progress.md`, rulings that say "final review":
- `drLadderEntries` has an unused export (Task 3.4).
- The blueprint's `row_ids` through v2.2 requirement IDs (Task 6.2 to 6.3 part A).
- An upper-case word that is a real currency code (ALL, TOP, CUP, MOP) is read as the currency, and the code list is not checked against the official table; ANG, CUC, SLL and ZWL are kept, XXX, XTS and HRK are left out (Task 7.0b).
- INT-03's natural home is section 12 Integrations, which is not a landing target (Task 7.0b minor 4).
- A `set-overlay` answer equal to the current value leaves no history record, so a person's unchanged overlay answer lives only in `decision-log.md` (Task 7.2 rerun, item 5).
- Task 7.0c minors: the agent-actor wording at SKILL.md:279 and review-and-open-items.md:56 and :68, a repeated clause at SKILL.md:279, the At column printing ISO UTC with milliseconds.
- Task 7.0a minors: step 2a items 4 and 5 say "Raise" without pointing to the reuse rule; a `Later` request's move back to `Open` in team mode is not stated; check_status_board does not validate the Waiting on cell.
- Task 7.4 step 1 minors: the mode prompt is still asked before the stop (its record is held back); brd-to-sdd.md:32 (a BRD not Approved) has no stated place relative to step 2a; the `<KEY list>` names no separator.
- Earlier sign-offs after Review live only in the state history and `decision-log.md` (Task 7.4 step 2, gap 4).
- The header rows' owner reads "TBD" (Task 7.0d concern 2), and the HDR example wording (review minor 2).
