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

Brief: `task-7.1-brief.md`. The new checker [check_presdd.py](../checkers/check_presdd.py) and its 64 tests (`test_check_presdd.py`). It checks a chunked Pre-SDD against the state `compute` renders (fragment regions, gate line, signers, landing rows) and, with `--sdd`, an SDD that loaded it (Source Pre-SDD row, key, version, gate label, link, every cited `PSDD/<ID>`, the section 18 CALC values). Review round 1 fixed bare owner names in override rows, override headings in chunk 08, a dead branch, a two-digit slug read as a chunk, six sub-checks without a failing test and a fixed date. Counts after the fix: 64 tests, full checker suite 351 (after the final review: 74 tests, suite 362).

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

The final review (2026-10-27 and 2026-10-28) read the whole branch in two scopes, `presdd` (the pre-sdd-unifier skill) and `chain` (how the other skills take the Pre-SDD), and one fix round followed. This list is the only committed copy of the parked items and of both reviews' verdicts: the plan folder is git-ignored. Each item names where it came from and reads "fixed in the final review", "known gap" with its reason, or "resolved before the final review".

### Findings of the final review

- presdd I1, the CLI could not load the engine inside a project whose `package.json` says `"type": "module"`: fixed in the final review (`studio/src/package.json` keeps the engine CommonJS; test `cli_version_insideEsmProject_loadsEngine`).
- presdd I2, on Node.js older than 22.18 (or 24.0 and 24.1) every CLI command exited 0 and did nothing (`import.meta.main`): fixed in the final review (`cli.mjs`, `build.mjs`, and the two schema generators in `tools/` compare `import.meta.url` with the real path of `process.argv[1]`). This also settles Task 2.10 M5 below.
- presdd I3, the web path cannot collect the migration overlay: fixed in the final review as a doc rule (`stages-and-input.md` § The web path and `SKILL.md`: the overlay items are taken in chat and applied with the CLI). A Studio overlay tab is a known gap: listed in the pre-sdd-unifier README's Known gaps.
- presdd M1, a Read of SKILL.md by path stops before its end: known gap: the skill loader loads the whole file; the pre-sdd-unifier README's Known gaps says to read it in two parts by path.
- chain I1, an E2E Architect "keep" answer closed the item and left the SDD text that breaks the lock: fixed in the final review (sdd-unifier `SKILL.md` step 10 and `brd-to-sdd.md`: the text is brought in line with the lock in the same update).
- chain I2, an SDD that keeps an older locked version read the newer Pre-SDD's chunk 12 as the loaded one: fixed in the final review (step 7 brief and `brd-to-sdd.md`).
- chain M1, `check_presdd.py` checked less than the fixtures README said: fixed in the final review (chunk 00's gate line against the engine's gate label, and every `[PSDD/<ID>](...)` link in the SDD resolves to a file and a heading anchor; 10 tests; README row reworded).
- chain M2, the fixtures README drifted from its checkers: fixed in the final review (a `check_chain_skills.py` row, the Pre-SDD in the chain list, today's counts).
- chain M3, brd-unifier still said the SDD owns the technical targets: fixed in the final review (`SKILL.md` principle 2, `chunking.md` row 10).
- chain M4, two sign-off rules listed Done evidence without the Pre-SDD: fixed in the final review (sdd-unifier `SKILL.md` Approvals, brd-unifier `delivery-chunks.md`).
- chain M5, a combined Pre-SDD's folder has no master: fixed in the final review (sdd-unifier step 2a item 1 reads the combined file).
- chain M6, step 2a could not match a Pre-SDD still in its stages: fixed in the final review (match by the master's **Source BRDs:** line; item 4 names that case).
- chain M7, "Add BRD" never checked that the loaded Pre-SDD covers the new BRD: fixed in the final review (`brd-to-sdd.md`: open markers for its targets and the step 2a item 5 request).
- chain M8, this list was incomplete: fixed in the final review (this section).

### Items parked during the build

- Task 1.2, the URL lookahead in `sources.test.mjs:10` is a deny-list: known gap: the only allowed URL is the SVG namespace, and every other `http://` or `https://` is still refused.
- Task 1.2, `srcFiles()` is not recursive: known gap: `studio/src/` has no subfolder, and the test asserts the sources it scanned.
- Task 1.2, `ui.js` composed the graph, blueprint and report inline: resolved before the final review: `exportMd` is gone and the save uses `saveWrapper`.
- Task 1.2, no node test exercises `ui.js`: known gap: `studio/tests/MANUAL-CHECK.md` and the headless `p3_smoke.mjs` harness cover it; the harness lives in the session tools folder, not in the repo.
- Task 2.7 M3, the schema's timestamp regex accepts impossible stamps: known gap: the engine checks stamps where they count (`validStamp`).
- Task 2.9a M2, `remove` and `remove-workload` leave exceptions, unknowns and exclusions pointing at removed entries: known gap: only unanswered entries can be removed, and an exception lifts by entry ID.
- Task 2.9a M3, the stand-in N/A message order: known gap: wording only, the refusal is right.
- Task 2.9a M4, a fixture's N/A can replace a person's sign-off: known gap: the fixture actor is test-only.
- Task 2.9a M5, `remove-brd` does not trim the key: known gap: the refusal names the listed keys.
- Task 2.9a M6, `set-version` stores leading zeros: known gap: the skill bumps by its own X.Y rule and never writes one.
- Task 2.9, `validate_handoff.py:68-74` checks conditions only for an approved hand-off: known gap: owner and due are now checked for every conditionally approved hand-off; the rest matters only for an approved one.
- Task 2.9, `engine.js` calls `classify(v)` instead of `model.a.path`: known gap: both come from the same input, so the values are equal.
- Task 2.9, `blueprint.test.mjs:250` calls the validator without the skip guard: known gap: the audit returns first when Python is missing.
- Task 2.9, `readSave` refuses a UTF-8 BOM: known gap: unreachable, the CLI strips the BOM and the Studio's `FileReader` drops it.
- Task 2.9, `tests/states.mjs` is a third copy of the fixture builders: known gap: test duplication only.
- Task 2.10 M1, regex dialect edges between JavaScript and Python: known gap: a test checks the shipped schemas against `jsonschema`, and no shipped pattern uses the edge characters.
- Task 2.10 M3, refuse look-alike engine source texts: known gap: optional hardening; the exact texts are refused.
- Task 2.10 M4, `cli_version_printsBoth` runs without a temp folder: known gap: `--version` writes nothing.
- Task 2.10 M5, `import.meta.main` needs Node.js 22.18 or 24.2: fixed in the final review (presdd I2).
- Task 2.10 M6, `project-state.json` is rewritten in place: known gap: one small write, `studio/patches/` keeps every patch, and a rename on Windows fails while an editor holds the file.
- Task 3.4, `drLadderEntries` is an unused export: known gap: dead code with no behaviour; drop it with the next engine change.
- Task 4.7, the exit-3 wording for `--brd` in `engine-and-studio.md` omitted cases: fixed in the final review.
- Checkers Minor 1, `check_chain_skills.py` matched `--exclude` globs case-insensitively on Windows: fixed in the final review (`fnmatch.fnmatchcase`, test `test_check_excluded_copy_case_differs_problem`).
- Checkers Minor 2, invalid UTF-8 is decoded silently: known gap: no file in the eight skill folders holds invalid UTF-8, and `heading_anchors` fails loudly on such bytes.
- Checkers Minor 3, the README link scan does not strip inline code: known gap: no `README.md#` link exists in the skill folders.
- Checkers Minor 4, `table_rows` drops the separator row unchecked: known gap: every board is written from the template, which has it.
- Checkers Minor 5, four description tests asserted only `description`: fixed in the final review (they assert `not read`).
- Checkers Minor 6, test run time: resolved before the final review: the two suites run in about 10 s each.
- Checkers Minor 7, `--exclude` has no help text: known gap: the fixtures README carries the full command.
- Checkers Minor 8, the fence-aware section boundary and a second heading: known gap: each SKILL.md holds one section, compared whole.
- Checkers Minor 9, tests added after GREEN: known gap: process, not a defect; the mutation evidence covers them.
- Task 6.5 Minor 1, the business review's hand-off list did not name the Pre-SDD's own re-check: fixed in the final review (`apply-and-verify.md`).
- Task 6.5 Minor 2, the business reviewer README did not say a Pre-SDD is reviewed and never edited: fixed in the final review.
- Task 6.5 Minor 3, one long rewrapped line: known gap: style only.
- Task 6.5 Minor 4, "names it" in the Pre-SDD Done evidence: fixed in the final review ("names the review").
- Task 6.7, REL-10 unmapped and INT-07's client and edge locations: resolved before the final review: the engine lands REL-10 in §8.6, §11 and §18.5, and `handoff-guide.md` names the locations.
- Task 6.8 nit, "GENERATE writes nothing" beside the one file the stop writes: fixed in the final review ("writes no SDD content" in sdd-unifier `SKILL.md`, `source-transformation.md`, `architecture-questionnaire.md`, `transform-detection.md` and the root README).
- Task 7.0a Minor 1, step 2a items 4 and 5 say "Raise" without the reuse rule: resolved before the final review: step 2a states one request per blocker right after items 4 and 5.
- Task 7.0a Minor 2, a `Later` request's move back to `Open` in team mode: known gap: a `Later` request is pending to its receiver either way.
- Task 7.0a Minor 3, `check_status_board.py` does not validate the Waiting on cell: known gap: stated in the fixtures README.
- Task 7.0b, the blueprint's `row_ids` through v2.2 requirement IDs: known gap: `validate_handoff.py` checks every `row_ids` value against the requirements, and the fixture blueprint passes.
- Task 7.0b, an upper-case word that is a real currency code (ALL, TOP, CUP, MOP) is read as the currency, and the code list is not checked against the official table: known gap: ECO-02 is a person's answer, and the code shows in the TCO label at the G2 stop; the list errs only toward accepting retired codes (not verified against the official table).
- Task 7.0b Minor 4, INT-03's natural home is §12 Integrations: known gap: INT-03 lands in §8.3 and §18, a §12 row may cite it, and a new landing place changes the engine's map and chunk 12.
- Task 7.2 rerun item 5, a `set-overlay` answer equal to the current value leaves no history record: known gap: `decision-log.md` records the answer, and changing the no-op rule of `applyPatch` reaches every op.
- Task 7.0c Minors 1 to 3 (the agent-actor wording at pre-sdd `SKILL.md:279` and `review-and-open-items.md:56` and `:68`, a repeated clause, the At column with milliseconds): known gap: wording only, the rule reads the same each time.
- Task 7.4 step 1, the mode prompt is asked before the stop: known gap: harmless; its answer is recorded once the SDD folder exists.
- Task 7.4 step 1, `brd-to-sdd.md:32` (a BRD not Approved) had no place relative to step 2a: fixed in the final review (the question is asked once step 2a has passed).
- Task 7.4 step 1, `<KEY list>` named no separator: fixed in the final review (keys separated by `, `).
- Task 7.4 step 2 gap 4, earlier sign-offs after `Review` live only in the state history and `decision-log.md`: known gap: the history keeps every sign-off record, and the SDD reads only the current signers.
- Task 7.0d concern 2, header rows show Owner `TBD` in the lock list: known gap: header rows have no owner code in the Standard, so `TBD` is accurate.
- Task 7.0d Minor 2, the HDR example wording: known gap: wording only; the example link resolves.
- Task 10.1 readme-hivantic H2, two version requests after a BRD change (brd-unifier `SKILL.md` against the root README): known gap: held for the owner, a wording call.
- Task 10.1 readme S10, the business-reviewer-unifier description names three skills instead of "each authoring skill": known gap: held for the owner; the text sits in the SKILL.md front matter, which the final review kept byte for byte.

## Verification

Task 10.2, the plan's design section 10 verification list, run on 2026-10-27 between 23:44 and 23:56 UTC on the worktree at head 02bbeaf with its uncommitted edits (39 changed files at the start). Node v24.22.1, Python 3 with PyYAML 6.0.3. `studio` is `pre-sdd-unifier/studio`, `TOOLS` is the session scratchpad tools folder named in the Task 3.5 record. Nothing was committed and no test was written. If a file changes under another agent, a count below can move by one rerun. The counts were rerun on 2026-10-28 between 00:59 and 01:10 UTC, after the final review's fixes, and the tables below show those final numbers: 475 node tests (one CLI test added), 362 checker suite tests (one chain-skill and ten Pre-SDD tests added), and 538 `check_refs.py` references.

### One row per design section 10 line

| Section 10 line | Result | Evidence |
|---|---|---|
| Golden: the two v2.2 example ZIPs and the demo export | PASS, 3 cases | `golden-fields.test.mjs` 7 of 7. The cases are `regional-zero` (16 calculations, 8 rules, 37 components, 36 connections, conflict `CONFLICT-rpo0`), `local-zero` (16, 8, 32, 30, no conflict) and `demo` (16, 5, 32, 29, no conflict), the demo being `examples/studio-v2.2-export`. `compute_importedGolden_matchesV22ComputedFields` loops the three and compares calculations, topology, DR strategy, rule IDs (with the two renames), components, connections and conflicts; the same fields hold with two options set. Ledger: Task 1.1 and Task 2.3 (`progress.md` lines 87 and 187; parity exact at 99, 88 and 84 values). |
| Unit: every CALC and rule, DR boundaries 30, 60, 900, 3600, 14400 s | PASS | See the coverage tables below. Ledger: Tasks 1.1, 2.4, 2.6, 2.7 (lines 87, 231, 296, 325). |
| Per scope: one strategy per scope, conflict when the shape fails a scope | PASS | `scopes.test.mjs` 23 of 23, plus the scope cases in `options.test.mjs` (27 of 27). Ledger: Task 2.5 (line 250). |
| Gate: each G3 outcome, condition, exception | PASS | `gate.test.mjs` 31 of 31 and `state-gate.test.mjs` 27 of 27. Ledger: Task 2.8 (line 357). |
| Derivation: every rule | PASS | `defaults.test.mjs` 37 of 37. Ledger: Task 2.4 (line 231). |
| Build: engine.js byte for byte | PASS | `node build.mjs` wrote `pre-sdd-studio.html` and `git status` shows it unchanged from the committed file. A direct compare: the page text contains `src/engine.js` (256,480 bytes) as a substring, true; page 390,138 bytes. `build.test.mjs` 5 of 5, including `buildStudio_blank_embedsEngineByteForByte` and `buildStudio_committedHtml_isUpToDate`. Ledger: Task 1.2 (line 112). |
| Schema: `validate_handoff.py` on every test blueprint | PASS, 38 blueprints, 3 expected FAIL | `handoffBlueprint_everyTestBlueprint_validates` audits every blueprint the suite builds (38 in this run, counted in a scratch copy; the test asserts at least 30) through the real `validate_handoff.py` audit: 0 failures each, plus the schema check on the first. `blueprint.test.mjs` 25 of 25 also holds the tampered cases, each failing for its expected reason, and the unreadable file exits 3. On disk: the two golden blueprints and the demo export blueprint are v2.2 files and fail the 3.0 schema as expected, each with `FAIL: SCHEMA: 'options' is a required property at []`, exit 2 (the 3.0 schema requires the options section). Ledger: Task 2.9 (line 507). |
| Studio: manual check in a browser | Done in headless Chrome; the owner's own browser check is pending the owner | By the controller's rule no agent used the Playwright MCP or claude-in-chrome. `node TOOLS\p3_smoke.mjs` (headless Chrome DevTools harness): 111 checks, 0 failed, 0 console errors, exit 0 (23:53 UTC). `studio/tests/MANUAL-CHECK.md` exists (Task 3.5, run 2026-10-27T14:03:13Z to 14:03:34Z, Chrome 156.0.8078.48 headless): 13 checks, 13 PASS, 0 FAIL (open filled, stage rows, name gate, blank RPO shows TBD, availability fix message, accept proposal, confirm group, keyboard focus ring, console, save, `validate --pick`, re-import parity, `compute` and `diff` parity). Firefox and Edge, and the owner's own browser check: pending the owner (C3). Ledger: Task 3.5 (line 624). |
| Skill: fixture runs | PASS | The runs in this file: Tasks 7.1 to 7.4 (chain run `run-2026-10-27b-psdd`, scenarios `pre-sdd-missing-rerun` and `pre-sdd-unsigned`), with their checks in the Checks table above. Ledger: Task 7.3 complete (line 786). |
| Skill: description at most 1024 characters, YAML parses | PASS, all eight | See the table below. |
| Skill: dash scan | PASS | `check_chain_skills.py` below, 0 problems (it scans for the en and em dash with the Q1 exemptions as excludes). |
| Skill: headless Codex and Kimi listings | pending Task 11.3 | `codex exec -s read-only "List the names and SKILL.md paths of the skills you can load."` and `kimi -p "List the names and SKILL.md paths of the skills you can load."` are not run here. Both must list `pre-sdd-unifier` with its path. |
| Chain: identical board section, README anchors resolve | PASS | `check_chain_skills.py` and `check_shared.py` below, 0 problems each. Ledger: Tasks 5.1 and 10.1. |

### node --test, by file

Run from `studio`: 475 tests, 475 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo (recount 2026-10-28; the Task 10.2 run at 23:44 to 23:48 UTC read 474, before `cli_version_insideEsmProject_loadsEngine`). The per-file runs sum to the same 475.

| File | Tests | File | Tests |
|---|---|---|---|
| blueprint | 25 | options | 27 |
| build | 5 | scopes | 23 |
| catalogue | 23 | sources | 3 |
| cli | 28 | state | 78 |
| decisions | 38 | state-gate | 27 |
| defaults | 37 | status-rules | 2 |
| engine-v22 | 6 | style | 6 |
| fragments | 15 | validation | 51 |
| gate | 31 | value-rules | 5 |
| golden-fields | 7 | view | 13 |
| import | 22 | import-page | 3 |

### Checks outside node

| Check | Result |
|---|---|
| Checker suites (`_fixtures/checkers/tests`, `py -3 -B -m unittest tests.<file>` from `_fixtures/checkers`) | 362 tests, all OK: chain_skills 54, presdd 74, shared 22, status_board 37, todo 20, checker_review_regressions 13, chk_regressions 30, e2e_gate_inventory 36, repeated_reconciled 7, rx_checker_regressions 21, sdd_lld_enhancements 48. The Task 10.2 run read 351 (chain_skills 53, presdd 64), the total recorded at Task 7.1; the final review added 11 tests. `regression_tests.py` and `e2e_dynamic_tests.py` were not run. |
| `check_refs.py lld-unifier sdd-unifier` | references checked: 538, problems: 0, Child LLDs columns MATCH |
| `check_shared.py .` | copies checked: 7, markdown files scanned: 231, problems: 0 |
| `check_chain_skills.py . --exclude 'pre-sdd-unifier/reference/*' 'pre-sdd-unifier/examples/*' 'pre-sdd-unifier/studio/tests/golden/*'` | 0 problems (identical status board section, role lines, README anchors, description limits, dash scan) |
| `validate_handoff.py` on the 3 on-disk blueprints | expected FAIL x 3 (v2.2 files, 3.0 schema), see the schema row above |

### SKILL.md descriptions (PyYAML parse of every front matter, `py -3 -I`)

| Skill | Description characters | Front matter keys | YAML |
|---|---|---|---|
| brd-unifier | 842 | name, description | parses |
| business-reviewer-unifier | 758 | name, description | parses |
| impl-tracker-unifier | 1008 | name, description | parses |
| lld-unifier | 895 | name, description | parses |
| pre-brd-unifier | 793 | name, description | parses |
| pre-sdd-unifier | 976 | name, description | parses |
| sdd-unifier | 912 | name, description | parses |
| tutorialize-unifier | 260 | name, description | parses |

All eight are at most 1024 characters. The tightest is impl-tracker-unifier at 1008.

### Coverage table

Files are in `pre-sdd-unifier/studio/tests/`. "Parity" is `compute_importedGolden_matchesV22ComputedFields` (the three golden cases, calculations 01 to 16) and `compute_importedFullRecord_matchesV22Blueprint` (a digest of all 20 base calculation rows, rules, topology, DR, components and connections for the full record), both in `golden-fields.test.mjs`. The inputs test is `fragments_calculations_inputsAreTheRowsRead` in `fragments.test.mjs`.

#### CALC-01 to CALC-22

| ID | Test and file |
|---|---|
| CALC-01 | Parity; `calculations_blankDailyTxn_chainIsNull` (engine-v22) |
| CALC-02 | Parity; `calculations_blankDailyTxn_chainIsNull` (engine-v22) |
| CALC-03 | Parity; `derive_cap01AndDefaults_setsCap02To165` (defaults); inputs test |
| CALC-04 | Parity; `calculations_blankDailyTxn_chainIsNull` (engine-v22); inputs test |
| CALC-05 | Parity; inputs test |
| CALC-06 | Parity; inputs test |
| CALC-07 | Parity; inputs test |
| CALC-08 | Parity only (no test names it) |
| CALC-09 | Parity only (no test names it) |
| CALC-10 | Parity; `derive_dat02_fromCap01AndStoredKb` (defaults); inputs test |
| CALC-11 | Parity; inputs test |
| CALC-12 | Parity; inputs test |
| CALC-13 | Parity; inputs test |
| CALC-14 | Parity only (no test names it) |
| CALC-15 | Parity; `calculations_zeroRpo_exposureIsZero` (engine-v22); inputs test |
| CALC-16 | Parity only (no test names it) |
| CALC-17 | Full-record parity (the golden cases do not reach it); inputs test (with and without the overlay) |
| CALC-18 | Full-record parity; inputs test |
| CALC-19 | Full-record parity; inputs test |
| CALC-20 | Full-record parity; `writers_importedFullRecord_listTwentyBaseCalculations` (blueprint) lists CALC-01 to CALC-20 in the blueprint and fragment |
| CALC-21 | `computeOptions_costsAndHorizon_tco280000`, `computeOptions_calcRows_cite21And22` (options); `handoffBlueprint_options_carryTheirRows` (blueprint) |
| CALC-22 | `computeOptions_approvedWeights_weighted3point2`, `computeOptions_calcRows_cite21And22` (options); `handoffBlueprint_options_carryTheirRows` (blueprint) |

No CALC row reads `no test`. CALC-08, 09, 14, 16 and 20 have value coverage through the parity digests only; no test names them.

#### Rule IDs

`rules_everyRuleId_hasTriggerCase` (validation.test.mjs) reads the rule IDs out of `decisionRules` and demands one trigger case per ID in code order, each firing exactly once in the v2.2 rules and in the 3.0 rules. `compute_importedV22Grid_rulesAndAdvisoriesMatchV22` (validation.test.mjs) runs 3,444 imported states and checks that every rule and every carried warning fires and that the rules and advisories equal the v2.2 output.

| Group | IDs | Test and file |
|---|---|---|
| Decision rules (19) | ARCH-01, HA-02, DR-03, LOAD-04 (v2.2 CAP-04), PERF-05, DR-06, DR-ZERO-01, DR-ZERO-02, DATA-07, DATA-08, DB-09, DB-10, DB-READ-17 (v2.2 DB-READ-11), SEC-11, NET-12, MIG-13, MIG-14, SLO-15, ADR-16 | `rules_everyRuleId_hasTriggerCase`, `compute_importedV22Grid_rulesAndAdvisoriesMatchV22`, `ruleIds_neverEqualItemIds`, `decisionRules_readPercentKnown_emitsDbRead17` (validation); the renames in Parity (golden-fields) |
| Per scope rules | DR-03, DR-06, DR-ZERO-01, DR-ZERO-02, DATA-07, DATA-08, SLO-15 with the `@scope` suffix | `rules_twoScopes_drFamilySuffixed`, `rules_twoScopes_ha02TriggerListsScopes`, `rules_drOverrideOnSecondScope_adr16Fires`, `rules_emptyExtraScopeEntry_idsUnchanged` (validation) |
| Carried warnings (12) | OPEN-01, DB-atomicity, DR-zeroRTO-unverified, DR-zero-scope, DATA-commit-protocol, DR-restore, DR-location, OVERRIDE-review, MIG-transfer, BF-inventory, DB-mixed, REL-test | `compute_importedV22Grid_rulesAndAdvisoriesMatchV22` (every one fires; the list equals the v2.2 list minus the two dropped); `validateState_twoScopes_drAdvisoriesSuffixed` (validation) |
| Carried blockers | OVERRIDE-reason, OPEN-migration-source, RESIDENCY-region | `compute_importedV22Grid_rulesAndAdvisoriesMatchV22` (each fires and stays quiet); `validateState_overrideWithoutReason_blocker`, `validateState_migrationSourceUnknown_blocker`, `validateState_residencyWithoutLocation_blocker` (validation) |
| Primary-only advisory | PRIMARY-ONLY-<row> | `validateState_secondJourneyStricter_primaryOnlyAdvisory`, `validateState_openOverlayEntryWithFactor_primaryOnlyAdvisory` (validation) |
| Conflicts | CONFLICT-region, CONFLICT-zone, CONFLICT-site, CONFLICT-active-dr, CONFLICT-provider (and CONFLICT-rpo0) | `conflictsFor_everyCombination_matchesV22ButRpo0RemoteOnly`, `targetShape_rpoZeroRegion_synchronousAndConflict`, `targetShape_overrideMultiAzWithRegion_conflictAtRegion` (scopes); the option hard checks in `computeOptions_topologyConflictsWithRegionScope_hardPassFalse` and `computeOptions_providerScopeHybridOption_noProviderConflict` (options); `CONFLICT-rpo0` in Parity |
| G3 checklist (14) | G3-01 to G3-14 | `G3_CHECKLIST_matchStandardLines` (catalogue); every line ticked and checked in `applyPatch_newOps_outputPassesGate` (decisions) and `gateStatus_checklistLineNotDone_notSigned` (gate) |

No rule ID reads `no test`.

#### DR thresholds

`defaultDR_thresholds_matchV22` (engine-v22.test.mjs) puts a case on each side of every threshold, and `assessScopes_boundaries_followThresholds` (scopes.test.mjs, 19 cases, each through the full scope assessment) repeats them.

| Threshold | Cases |
|---|---|
| 30 s | RTO 30 gives Active-Active, RTO 31 gives Warm Standby |
| 60 s | provider scope: RTO 60 gives Active-Active, RTO 61 gives Warm Standby (cyber scope RTO 60 gives Backup) |
| 900 s | RTO 900 and 901 with RPO 900 give Warm Standby; RTO 901 with RPO 901 gives Pilot Light |
| 3600 s | RTO 3600 with RPO 900 gives Warm Standby, RTO 3601 gives Pilot Light |
| 14400 s | tight budget, RPO 3600: RTO 14400 gives Pilot Light, RTO 14401 gives Backup; RPO 3599 or a balanced budget stays Pilot Light |

#### Per scope, gate and derivation cases

| Area | Cases and tests |
|---|---|
| Per scope | `assessScopes_azAndRegion_localHaAndWarm`, `assessScopes_twoRegionRtos_usesSmallest`, `assessScopes_unscopedEntry_appliesToEveryScope`, `assessScopes_scopeWithoutRto_unresolved`, `assessScopes_duplicateScope_blocker`, `assessScopes_emptyExtraEntry_notAScope`, `assessScopes_primaryNa_noScopes`, `assessScopes_drOverride_replacesThatScopeOnly`, `assessScopes_boundaries_followThresholds`; the shape: `targetShape_azAndRegion_topologyRegional`, `targetShape_everyCandidatePair_strongestInOrder`, `targetShape_blankState_undeterminedWithoutSource`, `targetShape_overrideMultiAzWithRegion_conflictAtRegion`, `targetShape_rpoZeroRegion_synchronousAndConflict`, `targetShape_openFailureScope_keyedUnknownNoConflict`, `targetShape_localScopeRpoZero_noRpo0Conflict`; the conflicts when a shape fails a scope: the five `conflictsFor_*` tests; the option side: `computeOptions_topologyConflictsWithRegionScope_hardPassFalse`, `computeOptions_localHaWithRegionScope_hardPassFalse`, `computeOptions_optionDr_appliesToRemoteScopesOnly` (scopes.test.mjs and options.test.mjs) |
| Gate outcomes | Approved: `gateStatus_allRolesApproved_approvedAndAuthorized`. Approved with conditions: `gateStatus_conditionWithOwnerDue_approvedWithConditions`. Not signed: `gateStatus_noSignoffs_notSigned`, `gateStatus_missingApplicableRole_notSigned`, `gateStatus_checklistLineNotDone_notSigned`, `gateStatus_criticalEntryEstimated_notSigned`, `gateStatus_criticalFactorEstimated_notSigned`, `gateStatus_g2NoPassingOption_incompleteAndG3NotSigned`. Blocked: `gateStatus_rejectedRole_blocked`, `gateStatus_conditionWithoutDue_blocked`, `gateStatus_g2Blocker_labelBlockedOnceG0MetDraftBefore`. Review: `gateStatus_editAfterSign_backToReview`, `gateStatus_reopened_backToReview`, `gateStatus_reviewBeatsNotSigned_precedence`. Draft and Discovery: `gateStatus_g0NotMet_labelDraftAheadOfBlocked`, `gateStatus_noGateMet_labelDraft`, `gateStatus_quickMode_labelDiscovery` (gate.test.mjs) |
| Gate conditions | `gateStatus_conditionalApprovalWithoutConditions_notAuthorized`, `gateStatus_conditionWithoutDue_blocked`, `gateStatus_g1OpenWithoutDue_notMet` (gate.test.mjs) |
| Gate exceptions | `gateStatus_namedException_hardOpenPasses`, `gateStatus_criticalOpenWithValidException_passes` (gate.test.mjs); `applyPatch_revokeException_entryBlocksAgain` (decisions.test.mjs) |
| Stand-ins, roles, policy | `gateStatus_standInWithoutPolicy_notSigned`, `gateStatus_standInWithPolicy_approved`, `gateStatus_staleStandInPolicy_notCounted`, `gateStatus_standInWithOtherProblem_notCounted`, `gateStatus_migrationOwnerNoOverlay_notRequired`, `gateStatus_roleNotApplicableWithReason_notRequired`, `sign_policyOverPersonSignoff_refused`, `sign_personOverStandIn_replacesRecord`, `check_policyOverPersonTick_refused` (gate.test.mjs) |
| Derivation: CAP-02 from CAP-01 (CALC-03) | `derive_cap01AndDefaults_setsCap02To165`, `derive_answeredCap02_notOverwritten`, `derive_missingCap01_leavesCap02OpenAndTbd`, `derive_cap01Changed_refreshesDerivedCap02`, `derive_cap01Cleared_returnsDerivedCap02ToOpen`, `derive_personClearsDerivedCap02_leavesItOpen` (defaults.test.mjs) |
| Derivation: DAT-02 from CAP-01 (CALC-10) | `derive_dat02_fromCap01AndStoredKb`, `derive_inputMissing_restoresRowDefaultKind` (defaults.test.mjs) |
| Derivation: defaults | `applyDefaults_newState_fillsSevenFactorsEstimated`, `applyDefaults_projectDefaults_onlyOps04AndCap08`, `applyDefaults_rel05SiteRegionOrProvider_addsDrToOps04`, `applyDefaults_confirmedFactor_untouched`, `applyDefaults_answeredOps04_untouched`, `applyDefaults_naEntry_skipsItsFactors`, `applyDefaults_newAppendixVersion_refreshesUnconfirmedOwnFactors`, `APPENDIX_values_matchPolicyAppendixFile` (defaults.test.mjs) |

No per-scope, gate or derivation case reads `no test`.

### Coverage gaps

- None reads `no test` in the CALC, rule, DR threshold, per-scope, gate or derivation tables.
- Weaker spots, not gaps: CALC-08, 09, 14, 16 and 20 are checked only through the parity digests (values against the v2.2 output), and no test names them; CALC-17 to CALC-20 are not reached by the three golden cases, only by the full-record case.
- The Studio browser check is headless (MANUAL-CHECK.md and `p3_smoke.mjs`); Firefox, Edge and the owner's own browser check are pending the owner at C3.
- The headless Codex and Kimi skill listings are pending Task 11.3.

### Stop

Stop C9 (proposal: `chore: consistency fixes and the pre-SDD build verification record`). Nothing is committed.
