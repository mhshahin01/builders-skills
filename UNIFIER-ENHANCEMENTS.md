# Unifier Enhancements Plan

The readiness plan for the five unifier skills (pre-brd-unifier, brd-unifier, sdd-unifier, lld-unifier, business-reviewer-unifier). This file is the single record of the steps and their status.

**How to use it.** When asked for the next unifier enhancement step:

1. Read this file and take the first step whose status is not `Done`.
2. Check the live state before acting: `git status`, `git worktree list`, `git branch -vv`, `git log --oneline -5 --all`, and the files the step names (another session may have moved things on).
3. Do the step, then update the [Status](#status) table, the step's own section, and the [Log](#log).
4. Stop for the user's review after each step.

## Status

| Step | What | Status | Branch and commits | Updated |
|------|------|--------|--------------------|---------|
| 1 | Save the chain fixtures, baseline runs, and checkers into `_fixtures/` | Done | `test/unifier-fixtures` 9148923, merged into main as 057f137 | 2026-09-30 |
| 2 | Rerun the SDD and LLD on main; extend the checkers; add `diff_runs.py` | Done | `test/chain-rerun` 6263882, merged into main as 057f137 | 2026-09-30 |
| 3 | Test the four untested paths from README "Known gaps" | Done | `test/known-gap-scenarios` ebc20a4, merged into main as 2855377 | 2026-10-01 |
| 4 | Open the SDD e2e gate once; write LOYALTY chunk 16; refresh the LLD trace | Done | `test/e2e-gate-and-loyalty-uat` d16e939, merged into main as 8568446 | 2026-10-01 |
| 5 | Business reviewer on the chain; close its Known gap | Done: option (c) chosen and implemented | `test/business-reviewer-chain` 5516e05 (skill) and bdbf5e4 (run), merged into main as de3baec | 2026-10-01 |
| 6 | Fix round; fixture BRD upgrade decision; rerun the chain; README; baseline; memory | Done | `fix/unifier-fix-round` (from de3baec): skills c830fd6, 71599c6, c4b9397, 3d3a26f, a250223; test 0c652c4; docs 8395250; merged into main as 548bf5d and pushed | 2026-10-07 |
| 7 | Next skill round: the 16 live findings, the S3 hardening (H1, H2), and the README-audit notes (N1-N7) | Done: fixes, 18 accepted decisions, consistency check, proof reruns, the 32 wording notes and the Band resync (all checks 0) | `fix/unifier-live-findings` (from 548bf5d): skills 1d8db77, c8bdab9, 73111e5, eec7784; test d60e6e7; then the docs commit, the merge into main and the push, on the user's word | 2026-10-07 |

**Git:** main is pushed to origin (548bf5d, 2026-10-07). The branches `test/unifier-fixtures`, `test/chain-rerun`, `test/known-gap-scenarios`, `test/e2e-gate-and-loyalty-uat`, `test/business-reviewer-chain`, and `fix/unifier-fix-round` are merged but not deleted. Step 7 is committed on `fix/unifier-live-findings`, branched from main 548bf5d; its merge into main and the push follow the docs commit.

The six Band files in `C:\Users\negat\Downloads\` were last synced in step 7 (`_fixtures/notes/step7-band/band-audit.md`); they are outside the repo.

## Context (all steps)

- **Skills.** The root `README.md` has the chunk maps, the handoffs, and "Known gaps". Skill files last changed in step 7 (1d8db77, c8bdab9, 73111e5, eec7784 on `fix/unifier-live-findings`); business-reviewer-unifier last changed in step 6.
- **Test material.** It is in `_fixtures/`, whose README explains every fixture, scenario, and checker and gives the PowerShell commands (set `PYTHONIOENCODING=utf-8`). `.gitattributes` keeps `_fixtures/**` on LF.
  - `chain/fixture`: the hand-made BRDs (refunds-portal REFUNDS, loyalty-points LOYALTY) and the 09-28 SDD.
  - `chain/run-new`: the regression baseline.
  - `chain/run-2026-09-30`: the step 2 rerun (hybrid SDD, e2e gate Locked on E3 with 25 markers).
  - `chain/run-2026-10-01-e2e`: the step 4 run (LOYALTY v1.2 with chunks 15 and 16, SDD v1.2 with the e2e gate open and chunk 19, LLD v1.1, and the decisions file).
  - `scenarios/`: the step 3 runs.
  - `notes/`: the detailed step logs.
  - `checkers/`: the scripts.
- **How a chain run is done.**
  - A background general-purpose subagent reads the skill from disk (SKILL.md and every file it references; not the Skill tool).
  - It works fully non-interactively with fixed answers: accept all recommendations, accept every Recommended Answer in the open-items loop, no Miro.
  - It writes only to its scratchpad run folder and checks Mermaid by reading.
  - It reports the files written, the rules it could not follow, and any instruction it found ambiguous or contradictory.
  - The second stage of a scenario runs as a fresh agent.
  - Never add a rule to a run brief that the run is meant to measure (for example, punctuation).
  - Agents have twice claimed files were CRLF when they were LF: verify before acting.
  - Typical durations: SDD run 1.5 to 2.5 h, LLD run 1.5 h, BRD whole run up to 3.5 h. Targeted updates are shorter: an SDD update 30 to 40 min, an LLD trace refresh with an SDD refresh 70 min.
  - Back up the run folder before each stage that writes, and verify each stage's write scope against the backup (step 4 did this for every stage).

## Step 1: save the test material (Done)

The 09-28/29 fixtures, baseline runs, and checkers were copied out of `%TEMP%` into `_fixtures/`, and three checkers were made path-independent.

## Step 2: rerun the chain on main (Done)

SDD and LLD runs on main 86cab74 became `chain/run-2026-09-30`. The checkers were extended (Child LLDs SDD version, permission tokens, MK-NN screens), and `diff_runs.py` was added. No regressions came from the 2026-09-29/30 changes, and the 47 output files hold 0 em dashes. Open findings are in [Findings to carry into step 6](#findings-to-carry-into-step-6).

## Step 3: test the four untested paths (Done)

All four paths pass; pre-BRD to BRD has two defects. The runs are in `_fixtures/scenarios/`, the details in `_fixtures/README.md` § Scenarios, and the full findings log in `_fixtures/notes/step3-findings.md`.

- **a. pre-BRD to BRD.**
  - Every pre-BRD chunk lands where `sow-transformation.md` maps it, and requirement-relevant markers carry over as markers.
  - Defect: the BRD reviewer's accepted OI-03 removed the verdict word the mapping requires.
  - Defect: BO-11 keeps a price the pre-BRD flags without a marker.
- **b. BRD heading map.** Merge then re-chunk gives back every chunk's heading outline and links, the 06* and chunk 16 titles, and every body line (10 cross-chunk links were added to the input because the fixture had none).
- **c. SDD version tracking.**
  - "BRD LOYALTY has a new version" gave SDD v1.1 and the exact out-of-date note in the Child LLDs row.
  - The next LLD run found the newer SDD in step 3c and refreshed only the mapped chunks.
- **d. LLD modular monolith.** One 04 file per module, the port contract in 06 §9.6, the in-process events in 07 §10.6, and no broker or HTTP resilience rules on them.
- **Checker fix.** `check_trace.py` now reads the owner files from §7.3, so module names work.

## Step 4: open the SDD e2e gate once, LOYALTY chunk 16, LLD trace refresh (Done)

**Result.** All three goals were met on one chain, saved as `_fixtures/chain/run-2026-10-01-e2e/`. The full log, with every finding and the 23 applied answers, is `_fixtures/notes/step4-findings.md`.
- **LOYALTY:** v1.2 with its delivery gate open, chunk 15 (4 tasks) and chunk 16 (31 test cases).
- **SDD:** v1.2. It took LOYALTY v1.2, then 23 accepted answers; the e2e gate opened (E1 to E4 met) and chunk 19 was written.
  - V1 found 17 mismatches in chunk 19 (1 wrong, 3 misleading).
  - The §24.7 scope for external contracts is ambiguous in the template (V-1).
- **LLD:** v1.1, with the SDD refresh taken in. All 31 LOYALTY test cases are traced in the 04 lines, 13 §16.8, and 16 §19.9.
- **Checks:** no new checker failure apart from V-1 and the check_sdd link class. diff_runs shows no unexplained removal.
- **Checkers:** `check_trace.py` extended, and `check_e2e.py` added.

**Goal.**
1. On a copy of `chain/run-2026-09-30`, work through the open-items loop until E1 to E4 all hold:
   - every open item is closed (Deferred counts as open);
   - no contract divergence is Open;
   - no clarification marker is left in 09 to 13x or §7.3;
   - the reconciliation is newer than the last change.
2. Confirm chunk 19 (§24) is written and matches 09 to 13x.
3. Write BRD chunk 16 (UAT/BAT) for loyalty-points, after its chunk 14 delivery gate is open.
4. Say "refresh the trace" in the LLD so the 04 lines, routes, e2e tags, and trace index pick it up.
5. Rerun every checker.
6. Save the result under `_fixtures/chain/` (planned name: `run-2026-10-01-e2e`).

**User decisions (2026-10-01).**
- **E3 markers.** An agent proposes one answer per marker (options, Recommended Answer, Why). The recommendations are accepted and applied through sdd-unifier's "apply any decisions the user gives" path (SKILL.md step 10 row "generate the e2e design ..." to step 8b). Every answer is listed in the step report and the decision log.
- **LOYALTY gate.** Simulate the product manager:
  - a non-interactive grill-me with recommended answers;
  - mockups LP-01 and LP-02 approved, with evidence labelled as a test-fixture confirmation;
  - diagrams drawn, then chunks 15 and 16 in the current format.
  - Mockup IDs stay; the MK-NN upgrade is a step 6 decision.

**Baseline.** 25 `[NEEDS CLARIFICATION]` markers block E3: SDD 10 (1), 12 (1), 13a (6), 13b (5), 13c (4), 13d (8). E1, E2, and E4 already hold. `[TBD - EXTERNAL]` markers do not block.

**Run folder.** `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\20a4b117-b71b-46de-b96b-9805a1f20b7e\scratchpad\s4\` (a copy of `chain/run-2026-09-30`). If it is gone, recreate it from `_fixtures/chain/run-2026-09-30` and rerun the stages. The briefs are in `_fixtures/notes/step4-plan.md`.

| Sub-step | What | Status | Output |
|----------|------|--------|--------|
| B1 | brd-unifier on `s4\brd-loyalty-points`: grill-me, mockups, diagrams, gate, chunks 15 and 16 | Done 2026-10-01 08:40 | LOYALTY v1.2, Status In Review. To-do 5 of 5 Complete; G1-G5 Met; gate Open. Chunk 15: 4 tasks in 2 waves. Chunk 16: 31 cases (TC-ACC, BAL, HIS, PTS, UIX, NFR). Chunk 17 not written. Grill-me gave 16 decisions; accepted OI-02 to OI-09 added UC-02 BR-4, NFR-03, A2, and more. 13 consistency runs (no stop rule). Verified: 185 links, 0 bad; 2 Mermaid blocks, 0 issues; 0 em dashes. Findings: `_fixtures/notes/step4-findings.md` (G1 to G17) |
| A1 | Read-only architect agent: proposals for the 25 markers | Done 2026-10-01 06:20 | `s4\sdd-marker-decisions.md`: 25 entries, CL-01 to CL-25 (10:1, 12:1, 13a:6, 13b:5, 13c:4, 13d:8). It reads LOYALTY v1.0. Its section "LOYALTY v1.1 draft found during this run" adjusts CL-18, CL-20, CL-21, and CL-23 to B1's v1.1. CL-09 is the one real design change: a payout keeps retrying every 6 h after `PAYOUT_FAILED`. Every value is a design default with a named owner, not a legal or provider fact |
| A2a | sdd-unifier on `s4\sdd-refunds-platform`: "BRD LOYALTY has a new version" (registered 1.0, now 1.2). This request only | Done 2026-10-01 10:07 (32 min). Backups in this session's scratchpad (`C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\a8c95831-7250-4aca-9d22-180a602206ed\scratchpad\`): `s4-backup-pre-A2a` (whole run folder) and `sdd-post-A2a` | SDD v1.1; LOYALTY row 1.2; Child LLDs row out of date; 19 SDD files changed, nothing outside the SDD; step 6a clean, Reconciled 2026-10-01; no OI added; E3 23 markers (13d 8 to 6: LOYALTY v1.2 answered cents rounding and partial take-back); two non-gate markers added (01 §3 member sign-in, 15 §19 UAT staging). Findings S1 to S10 in `_fixtures/notes/step4-findings.md` |
| A1b | Read-only architect agent: re-propose answers for every E3 marker the A2a update changed or added (at least CL-18 to CL-25 in 13d, against LOYALTY v1.2), keeping CL-01 to CL-17 unless the update touched them | Done 2026-10-01 10:31 (21 min). Copy: `sdd-marker-decisions-post-A1b.md` in this session's scratchpad | Section "Update after LOYALTY v1.2 (SDD v1.1)" (line 951) with an Apply list of 23 rows: 19 kept, 4 changed (CL-19, CL-21, CL-22, CL-25), CL-18 and CL-20 retired, none new; no registry row. Design call for the report: CL-19 matches on the receipt number from API-04 (option C, the LOYALTY purchase reference in `RefundPaid`, rejected). Findings X1 to X4 |
| A2b | sdd-unifier: "Here are my decisions on the open clarifications: `s4\sdd-marker-decisions.md`. Take each Recommended Answer named in the Apply list of its section 'Update after LOYALTY v1.2 (SDD v1.1)' as my decision. Apply them, then generate the e2e design (chunk 19)." | Done 2026-10-01 11:09 (36 min). Snapshots `sdd-post-A2a` and `sdd-post-A2b` in this session's scratchpad | SDD v1.2; 23 decisions applied; step 6a clean; gate E1-E4 met, line `Open - Up to date`; chunk 19 written. check_e2e: consistent except V-1 (§24.7 lists the 4 external contracts). check_sdd 50 (baseline 37; new unlinked IDs in the 1.1 Changes Log row, 03:22, 14:25, and new decision-log records). Findings V-1, T1 to T7 |
| V1 | Read-only check of chunk 19 against 09 to 13x, plus a mechanical script | Done 2026-10-01 11:32 (17 min). The script, `_fixtures/checkers/check_e2e.py SDD_DIR` (E1 to E4, the gate line, and chunk 19 against 09 to 13x), was written during A2a and tested on the baselines, a hand-made chunk 19 (0 problems), and ten planted errors (all caught) | 17 mismatches: 1 wrong (§24.5.2 "the one planned change", a claim no source makes), 3 misleading (§24.7 external edges = V-1; "system-context level only" while the chunk draws them in §24.3, §24.7, and the sagas; §24.8.2 publication completion drawn after the import), 13 cosmetic; 9 template and SKILL.md ambiguities (W1 to W9); 3 source-chunk problems. Mermaid valid by reading, links resolve |
| C1 | lld-unifier "refresh the trace"; accept the step 3c SDD refresh | Done 2026-10-01 12:25 (70 min). The brief did not mention LOYALTY chunk 16; step 3b found it | LLD v1.1 (SDD v1.0 to v1.2 taken in; 21 files, 17 and 18 unchanged); LOYALTY trace: UC-01 9 and UC-02 22 test cases in the 04 lines, 13 §16.8 rows and tags, 16 §19.9 cells, §19.1 (SDD 1.2, LOYALTY 1.2); Child LLDs row Version 1.1, SDD version 1.2; flags 21 TODO, 40 Confirm. Findings C1-1 to C1-10 and five SDD inconsistencies |
| Checks | Every checker, diff_runs against run-2026-09-30, E3 recount, em dash count; `check_trace.py` extended for LOYALTY chunk 16 | Done 2026-10-01 12:30. `check_trace.py` extended during A2a and tested on the baselines (unchanged), a simulated post-C1 copy, and three planted errors | check_links 512/0; check_uc_links 260/0; check_uc_keys 0; check_refs 0; check_lld_trace the two known items, Pending 8 to 0; check_trace 5 (the known route problems; LOYALTY 0); check_e2e gate met, V-1 only; check_sdd 50; Mermaid LLD 0 issues, SDD 6 over length; em dashes 0; diff_runs additions only, removals all from decisions |
| Save | Copy to `_fixtures/chain/run-2026-10-01-e2e/`, update `_fixtures/README.md`, report, stop for review | Done 2026-10-01 12:40 | 87 files, identical to `s4`, LF; README Layout row and a `run-2026-10-01-e2e` results column; `check_e2e.py` documented |

If B1 or A1 has no complete output when you resume, rerun its brief on a fresh copy of the affected folder. If A2 reports new markers, run A1 again for those only, then A2 again.

## Step 5: business reviewer (Done)

1. Run `business-reviewer-unifier panel` on the step 4 chain, then walkthrough, apply, and verify.
2. Then close its Known gap: it does not check the SDD's document lineage, the §7.3 use case traceability, or the contract registries. Give the user options with a recommendation, for example:
   - (a) one new "chain integrity" persona: the existing personas stay as they are, but each panel run costs one more agent;
   - (b) those checks added to the existing personas.
3. Implement only after the user decides.

**Result.** The run is saved as `_fixtures/chain/run-2026-10-01-review/` (88 files, with `review-comments-tracker.md` in its root). The full log is `_fixtures/notes/step5-findings.md`. The panel output, the walkthrough record, and the verify record are in `_fixtures/notes/step5-logs/`.
- **Panel.** 60 findings became 39 points. All were Applied with the recommended option, and the Verification pass scored 8/10 (26 remnants: 24 fixed, 2 rejected).
- **Versions.** REFUNDS 1.1 and LOYALTY 1.3 are In Review with their delivery gates Shut (open items 1 to 32 and 8 to 18, plus a new G6 sign-off condition). SDD 1.3 has its e2e gate `Shut - Stale` and chunk 19 at 1.2. The LLD is unchanged and out of date.
- **Detection.** Two panel reviewers called the Child LLDs row wrong, but it was right. The LLD was out of the default scope, and the SDD decision log's last check predates the LLD refresh.
- **Apply.** Links, §7.3, and the registry cross-references stayed consistent. But the walkthrough changed structures that other skills own: lineage table columns, a chunk 10 table column, the BRD 02 dependency table, chunk 18 status values, and the E3 and G6 gate conditions. It deferred version bumps, and it left the LLD and the gated chunks behind with no hand-off. Effects: check_uc_keys 0 to 166, E1 fails, check_trace 5 to 11, check_sdd 50 to 68.
- **Verify.** The remnant hunt looks for stale text, not template conformance.

**Known gap options (the user chose (c) on 2026-10-01; implemented, uncommitted).**
- (a) A sixth default persona, Chain Integrity. It checks lineage at both ends, §7.3 against its homes, the registries against 13x, and the gate and status vocabularies.
- (b) The same checks added to DC (lineage, §7.3) and PA (registries, gates).
- (c) Hand chain integrity to the owning skills:
  - apply changes content, never another skill's structures;
  - versions follow each document's own rule at apply time;
  - after apply, a hand-off: sdd-unifier "BRD <KEY> has a new version" for each changed BRD, the Child LLDs out-of-date note, and lld-unifier and brd-unifier refreshes;
  - intake reads each child LLD's version record;
  - the verify brief also checks template conformance.
- (d) (a) plus (c).

Recommended: (c). The tradeoffs are in the step 5 report and in `notes/step5-findings.md` § Summary.

**Option (c) as implemented (2026-10-01).**
- business-reviewer-unifier:
  - a BRD or SDD keeps its template structure, and a structural need becomes a Skill changes requested entry;
  - an LLD or a gated chunk is never edited;
  - the story goes in the owner's `decision-log.md`;
  - one version bump per document per review session, at the first content change, with a Changes Log row listing each point and the chunks it changed;
  - each child LLD's version record (master, `00-metadata.md`, `16-references.md` § 19.1) goes to the panel as lineage context;
  - the verify brief checks template conformance and lineage at both ends, and leaves lineage rows to the hand-off;
  - the close writes a Hand-offs block (`To run` or `Done`): brd-unifier "update the todo", then sdd-unifier "BRD <KEY> has a new version" (all changed BRDs in one request) or "the business review changed this SDD", then lld-unifier "the SDD has a new version" (plus "refresh the trace" when a BRD's use cases, test cases, or screens changed).
- sdd-unifier: a new step 10 row, "the business review changed this SDD", and several BRDs in one "new version" request.
- brd-unifier: the "update the todo" row takes a business review's decisions.
- Root README: a lineage bullet, §5, Suggested workflow; the reviewer's Known gap line removed.
- Band files synced.
- A read-only consistency check found 4 A, 15 B, and 12 C items. All are fixed except two: B15 (the pre-BRD is in the reviewer's scope in the README and Band files but not in the skill's Intake; it predates (c)) was then decided by the user: option A, with the pre-BRD optional (implemented: Intake lists a pre-BRD when there is one and never mentions it otherwise; a pre-BRD keeps its template, takes Answer-cell changes only with derived values recomputed, gets no version or changelog (the tracker lists its changed chunks), and reaches the BRD owner through the BRD hand-off). C11 (= K1) goes to step 6. A3 also showed that brd-unifier's own Stale rules omit the master's Delivery Chunks State cell, which lld-unifier reads; that goes to step 6.
- Not yet tested on a run: step 6's chain rerun covers it.

**Proposed run setup** (2026-10-01; the user confirms it by sending the step 5 prompt):
- **Before step 5:** commit step 4 on `test/e2e-gate-and-loyalty-uat`, merge it into main, and do not push. Step 5 then runs on `test/business-reviewer-chain`, branched from main.
- **Input:** a scratchpad copy of `_fixtures/chain/run-2026-10-01-e2e`, with the tracker in the copy's root.
- **Fixed answers:**
  - document scope: the skill's default (the whole chain it detects), recording whether it picks up the LLD;
  - SME domain: the one the skill infers;
  - panel: the default five personas, no add-ons.
- **Panel:** this session acts as the skill's orchestrator and dispatches one cleared-context background subagent per persona, in parallel, as panel-orchestration.md says. Background run agents may not be able to spawn subagents, and a single agent playing five personas would lose the cleared context the skill depends on.
- **Walkthrough and apply:** one background agent plays both the skill and the user. It accepts each point's recommended option, applies it per point, and lists every decision.
- **Verify:** a fresh agent.
- **After the run:**
  - rerun every checker and run diff_runs against `run-2026-10-01-e2e`;
  - save the result as `_fixtures/chain/run-<date>-review`;
  - log in `_fixtures/notes/step5-findings.md`;
  - then the Known gap options with a recommendation, and stop.

**Run folder.** `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\23e92d30-8ed6-494a-b8a9-6f1c0f209d91\scratchpad\s5\` (a copy of `chain/run-2026-10-01-e2e`, 87 files; the tracker goes in its root). If it is gone, recreate it from `_fixtures/chain/run-2026-10-01-e2e` and rerun the stages. The briefs are in `_fixtures/notes/step5-plan.md`.

**Intake (the orchestrator's answers, 2026-10-01).**
- **Scope:** the two BRDs (REFUNDS 1.0 Approved, LOYALTY 1.2 In Review) and the SDD (1.2 Draft), 63 files. The LLD is not picked up: SKILL.md step 1 detects "numbered business docs, BRD chunk folders, SDDs", and the LLD is none of these. `sdd-marker-decisions.md` in the root is not a chain document.
- **SME domain (inferred, accepted):** multi-branch retail store operations: customer refunds and returns handled at the branch and paid back to the original card, and a points-based member loyalty programme.
- **Panel:** the default five personas, no add-ons.

| Sub-step | What | Status | Output |
|----------|------|--------|--------|
| P | Panel: five cleared-context background reviewers (BO, SME, PM, PA, DC), read-only, launched in parallel by this session | Done 13:12 (30 to 38 min each, about 420K to 460K tokens each) | 60 raw findings, 12 per persona (`SP\s5-logs\panel-raw-*.md`). Merged by this session into `s5\review-comments-tracker.md`: 39 points (21 findings merged into 15 rows; BO 9, SME 9, PM 6, PA 10, DC 5). DC-11 and PA-12 call the Child LLDs row wrong; the LLD's own 16 §19.1 and Changes Log show it is right (the LLD was out of the panel's scope, and the SDD decision log's last Child LLDs check predates the LLD refresh) |
| W | Walkthrough and apply: one background agent plays the skill and the user, accepts each recommended option, applies per point, updates the tracker per point | Done about 16:20 (about 3 h; a 13:17 launch stopped at its first step on an API safeguard error and wrote nothing). Backup `SP\s5-backup-pre-W`, snapshot `SP\s5-post-W` | 39 of 39 Applied; 59 files changed (REFUNDS 19, LOYALTY 15, SDD 24, tracker), LLD untouched; log `SP\s5-logs\walkthrough-log.md`. REFUNDS OIs 1 to 32, LOYALTY 8 to 18; both BRD gates Shut on a new G6; e2e gate "Shut - Stale". Checkers: links clean, registry checks pass; check_uc_keys 169 (the register gained a Status column), E1 fails on a new "Superseded in part" status, check_sdd 50 to 66, check_trace 5 to 11 (LLD now behind). Details: `notes/step5-findings.md` § W |
| V | Verify: a fresh cleared-context agent hunts stale remnants (apply-and-verify.md brief); then remnant fixes, the Verification pass block, and versioning | V1 done 16:55 (28 min, read-only confirmed). V2 done about 17:40 (about 45 min); backup `SP\s5-backup-pre-V2` | V1: 8/10, 26 remnants (1 High, 5 Medium, 20 Low), report `SP\s5-logs\verify-report.md`; it does not check template conformance (it called the reshaped lineage rows right). V2: 24 fixed, 2 rejected (the chunk 19 banner, the dedup note); REFUNDS 1.1, LOYALTY 1.3, SDD 1.3 (chunk 19 stays 1.2), each with a Changes Log row; 55 files; three temporary files outside its scope, deleted |
| Checks | Every checker, diff_runs against `run-2026-10-01-e2e`, save as `chain/run-2026-10-01-review`, `notes/step5-findings.md` | Done 17:50 | The results are in the table in `notes/step5-findings.md` § Checks and in the `_fixtures/README.md` results column. The saved copy gives the same results. |

## Step 6: fix round (Done)

1. Fix what steps 2 to 5 find, the same way as the consistency rounds:
   - run parallel read-only checkers;
   - fix mechanical and simple issues using the recommended option;
   - hold design changes for the user's decision, with options and a recommendation.
2. Decide with the user whether to upgrade the fixture BRDs to the current brd-unifier rules (MK-NN rows, the chunk 15 and 16 format).
3. Rerun the chain.
4. Update the README ("Known gaps" empty, or listing what remains).
5. Save the user-authorized reviewed baseline at `chain/run-2026-10-07-review`; keep `run-new` as the former baseline.
6. Update memory files in the separately authorized follow-up. Codex FINAL updates repository records only.

**User decisions (2026-10-01).**
- **Git.** Step 5 committed (5516e05 skill, bdbf5e4 run) and merged into local main as de3baec, not pushed; step 6 runs on `fix/unifier-fix-round`.
- **Em dashes.** Clean all of them in the five skills' instruction files (539: brd 145, sdd 166, lld 225, pre-brd 3), one mechanical pass per skill, punctuation chosen by use.
- **Fixture BRDs.** Upgrade both (REFUNDS 1.0, LOYALTY 1.0) to the current template through brd-unifier before the chain rerun.

**Work folder.** SP = `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\cf4400a2-9146-402a-ac15-d7605c12cf05\scratchpad`. Triage reports in `SP\s6\triage\`, copied to `_fixtures/notes/step6-triage/`; proposed checker scripts in `SP\s6\scratch\checkers\` (adopted).

**Initial Codex sequence.** R2, CHK and approved repairs/save, R3a to R3d, TRIAGE/APPLY and FINAL completed on separate user instructions. TRIAGE covered 56 findings: 46 implemented, 10 retained. The immutable 126-file pre-review snapshot remains at [run-2026-10-06-final](_fixtures/chain/run-2026-10-06-final/). The reports preserve the earlier results and their limits.

**After Codex: Claude Code verification and repairs (2026-10-07).** VERIFY checked scopes, counts and results. FIX repaired the approved skill propagation, pending-decision and remainder rules, restored lost instructions, and corrected checker handling of older fixtures. GATE classified the legacy SDD's 69 live markers and found two blockers; E4 also failed. FIX2 clarified the resulting rules and brought the checker tests to 31. SDD16 took named-owner fixture answers, reached 1.6, and left OI-45 decided but pending application at the review cap. SDD17 applied it and the subsequent OI-46/OI-47 corrections, rewrote chunk 19 at 1.7, and opened the gate with 67 inventory rows and zero blockers. LLD13 refreshed to 1.3, applied OI-09 to OI-13, and recorded 38 TODO / 24 Confirm. Every baseline checker reports zero problems. The skills were frozen after LLD13; 16 findings remain next-round input in [live-findings.md](_fixtures/notes/step6-handoffs/live-findings.md).

**Codex close-out (2026-10-07).** The user authorized S1, S2, S3, SAVE, RECORDS and CLEAN continuously. S1 reran version tracking and targeted refresh; inherited old-fixture failures are explained, not hidden. S2 preserved headings, links and body through merge/re-chunk. S3 transformed the saved approved-as-is pre-BRD, retained No-Go and the BO-11 price marker, and kept owner questions open; the close-out review below found two defects in its output. No pre-BRD research generation was rerun. All three reruns are saved under their scenario folders. R2, R3d and LLD13 cover the five-module modular monolith.

SAVE copied all 129 reviewed files, including source and three review records, to [run-2026-10-07-review](_fixtures/chain/run-2026-10-07-review/), verified every source/copy SHA-256, then replaced five temporary tracker links with plain text. This is the regression baseline: REFUNDS 1.9, LOYALTY 1.8, SDD 1.7, LLD 1.3; E2E Open - Up to date. All prescribed checks report zero problems. RECORDS updated Known gaps and these records. CLEAN passed its preconditions, removed temporary links and runs-wip, and kept the ignore entry. Final checks: 45 pytest cases plus 7 subtests passed; root/notes links, README, 241 skill references and the full baseline suite have zero problems. Its dated report and commit file list complete the handoff.

**Close-out review and commits (Claude Code, 2026-10-07).** No state-changing git command ran in the Codex close-out, and it did not touch Claude memory or the Band files. Claude Code compared the repository with `handoff-manifest-2.txt` on repository paths: 353 files added (the baseline, the three reruns and the commit list), the 129-file working review removed, 11 records changed, and no skill file changed. The saved baseline equals the pre-Codex review copy except the five tracker links. Fresh checks reproduced every Codex result. Codex's own follow-up review found two S3 defects, both confirmed: the BRD drops the pre-BRD 08 rule that hosting in Egypt needs a licensed provider, and its 14-todo register does not follow the template (the same generic Blocks text in all 54 rows, chunk-only sources, a Kind outside the three values, TD-16 merging decisions). The rules exist; the run did not follow them. Both are recorded with two hardening candidates in [live-findings.md](_fixtures/notes/step6-handoffs/live-findings.md); the saved output stays as run evidence. The stale Band-sync notes and a pointer to deleted CHK evidence were corrected, and the absolute links in `findings-triage.md` made relative. Four read-only auditors then checked the root README against the final skills: 41 documentation gaps (1 High, 10 Medium, 30 Low; for example the BRD matrix rule, the `Decided - pending application` gate status, the sign-off rule, scope proposals and "add BRD"), each verified against the skill text and fixed in the docs commit; their skill-side notes went to live-findings.md. Step 6 was then committed on `fix/unifier-fix-round` on the user's word, in seven commits (one per skill, test, docs), merged into main as 548bf5d, and pushed by the user. The Band check (`manifest2.py`, which also reads the Band files) was blocked for Claude Code by the permission classifier; the user ran it after the merge, and it passed: the six Band files are unchanged since the 2026-10-07 sync. Details: the [stage table](_fixtures/notes/step6-plan.md) FOLLOW-UP row and the [Codex log](_fixtures/notes/step6-handoffs/codex-log.md).

| Sub-step | What | Status | Output |
|----------|------|--------|--------|
| T | Eight read-only triage agents in parallel: pre-brd, brd, sdd-core, sdd-templates, lld, reviewer, families (versions, reviews on update paths, retiring settled items, Stale against gates, em dash inventory), checkers (scripts fixed and tested in scratch) | Done 2026-10-02 about 01:45 (2 to 4 h each) | `SP\s6\triage\*.md`: per finding Status, Class (M mechanical, S simple, D design), the exact fix or the options. reviewer: 32 items (7 fixed already; M 5, S 14, D 5; new N-1 to N-5). brd: 44 (M 12, S 20, D 6; 5 not a skill issue, M3 not reproducible). pre-brd: 15 (M 2, S 8, D 5; new N-1 M, N-2 and N-3 D). sdd-core: 38 (M 10, S 17, D 10; S6 not reproducible; new N-1 to N-4 M). sdd-templates: 24 (M 4, S 10, D 9). lld: 41 (M 12, S 12, D 17 = 9 decisions; new N-1, N-2 M). families: 4 cross-skill decisions, 0 M; em dash inventory 539, of which 95 on 92 lines are copied into outputs, plus a replacement policy. checkers: 4 scripts fixed and tested in scratch, `.gitignore`, README edits |
| F | Apply the M and S fixes; checker fixes; em dash pass | M and S done; checker adoption done 07:00 (results match the triage's "after" tables); em dash pass after D | reviewer (this session; V-9 settled by F4), pre-brd (11 items, 9 files), brd (32 items, 53 edits, 13 files), lld (all listed, 21 files), sdd (sdd-core and sdd-templates lists, 15 files). Every file kept its line endings; no em dash added. Held for later: brd N-1 (settled by D12.2) and every root README edit (one pass at the end) |
| D | Design decisions to the user, with options and a recommendation | Decided 2026-10-02 (the user accepted all 44 recommendations); implementation launched about 05:30, one agent per skill folder: reviewer Done 07:00, pre-brd Done 08:35, brd Done 08:40, lld Done 08:50, sdd Done 09:07 (20 files; three gaps queued for C) | `_fixtures/notes/step6-decisions.md`: 44 decisions in 7 groups (A cross-skill policy F1-F4; B SDD derivation; C SDD templates with LLD E4; D LLD; E BRD; F reviewer; G pre-BRD scoring and export). Source-chunk problems found by the chunk 19 faithfulness check (F2): fixed in the source chunk when plainly inconsistent, else an open item. Then: a read-only consistency check of the whole change, the em dash pass, the root README and the Band files, the checker follow-ups the decisions need |
| C | Read-only consistency check of the whole change, then fixes | Done 2026-10-04 (the 2026-10-02 launch was stopped by the weekly limit; relaunched 06:00). 114 items (brd 28, lld 33, cross 29, sdd 24): the mechanical and simple ones applied by one agent per folder; 11 design items accepted by the user as recommended (C1 to C11) and applied; check_refs 239, 0 problems | Briefs, reports, and decisions in `_fixtures/notes/step6-consistency/`; fix list in `step6-plan.md` § Stage C fixes |
| E | Em dash pass (brd, sdd, lld) | Done 2026-10-04; follow-ups and C2 recheck complete | Original punctuation pass and its evidence are recorded in step6-plan.md; TRIAGE normalized five range-dash lines in rewritten files |
| RM | Root README and the six Band files | Done 2026-10-04; FINAL Known gaps update done 2026-10-07 | Earlier root README/Band sync and C2 fixes recorded in step6-plan.md; README and Band files resynced again in FIX (2026-10-07) |
| CK | Checker follow-ups the decisions need | Done 2026-10-04; approved CHK and semantic-inventory checker updates done | Checker adoption log, CHK reports and TRIAGE-APPLY report; 31 checker tests pass |
| B | Upgrade the fixture BRDs through brd-unifier | Done 2026-10-06; REFUNDS and LOYALTY 1.7, gates Open, 15/16 written | B snapshot and source history preserved; current inventory contains 40 B rows |
| R | Rerun the chain; checks; README; baseline; memory | Done; merged into main as 548bf5d | Reviewed baseline saved; S1-S3 rerun (S3 with two defects); records updated; CLEAN verified; close-out review done; Band check passed |

## Step 7: next skill round (Done)

**Input.** `_fixtures/notes/step6-handoffs/live-findings.md`: the 16 frozen skill findings (sdd-unifier 1 to 9, lld-unifier 10 to 16), the S3 hardening candidates H1 and H2, and the README-audit notes N1 to N7. The fixture design gaps stay with the fixture owners.

1. Triage, read-only, in three agents (sdd; lld; brd with pre-brd): verify each item against the current skill text, classify it (M mechanical, S simple, D design), and give the exact fix or options with a recommendation, the ripple, and the proof needed.
2. Apply the M and S fixes with the recommended option; bring every D item to the user. Live findings 3 (a faithfulness-found source problem that no chunk 19 claim depends on) and 16 (a scoped re-check after the LLD delta-review fixes) are policy decisions.
3. A read-only consistency check of the whole change; then the root README and the six Band files.
4. Proof: rerun S3 (pre-BRD to BRD) for H1 and H2, plus any rerun a fix needs; the How to run set on the baseline; the checker and exporter tests.
5. Commit on the user's word: one per skill, test, docs.

**Triage and fixes (2026-10-07).** Three read-only agents triaged 25 items; all reproduce: 5 mechanical, 14 simple, 6 design. Reports: `_fixtures/notes/step7-triage/` (sdd, lld, brd-prebrd). The 19 mechanical and simple fixes are applied with the recommended option: sdd-unifier 14 edits, lld-unifier 14, brd-unifier 11, pre-brd-unifier 7, the root README 4, and three wrong line references in live-findings.md. Checks: 249 skill references with 0 problems, README check 0, 45 tests pass, line endings kept, no dash added. Six design items wait for the user: sdd 1 (review kind for an update that only applies pending decisions), 3 (a faithfulness-found source problem that no chunk 19 claim depends on), 5 (Already current behind a Stale mark), 9 (text an applied decision leaves wrong), lld 16 (a scoped check of answers applied in the same update), and brd H2 (checks of the to-do register fields). The LLD fixture's `decision-log.md` is a run record, not a skill gap.

**Decisions (2026-10-07).** The user accepted all six recommendations, applied as proposed in the triage reports: sdd 1 B (an update that only applies pending decisions starts with their application check, pass 1 of 3), 3 B (a faithfulness-found source problem that no chunk 19 claim depends on, in text the request did not change, is recorded in chunk 18 Reviewer Notes for its owner and does not shut the gate), 5 A (behind a Stale mark, a chunk 19 whose asserted claims did not change is kept and verified by a faithfulness check), 9 B (the author carries an applied decision to text it makes wrong when one wording is clearly right, named in the Changes Log), lld 16 B (answers given before the handoff are applied in the same update, then one scoped application check; at most two review passes), brd H2 B (two chunk 14 verification checks: the TD fields, and one question per row with every marker and open item covered; the three Kinds and the Source and Blocks rules in the skeleton comment). The brd-prebrd report's optional extras were not taken: the H1 sanity-check line, a `check_todo.py` checker, the `discover_cells.py` formula test and a formula-count test, the pre-BRD chunk 24 tier label, the workbook's stray `EFAS!H7` formula, and an exporter edge case. Some optional ripples of the sdd and lld reports were applied with their items (for example the sdd README "fixes confirmed" and the lld §22 Wishlist row); their optional checker tests and checks were not added. Checks: 251 skill references with 0 problems, README check 0, 45 tests pass, baseline checks 0.

**Consistency check (2026-10-07).** Two read-only checkers reviewed the whole step 7 diff (reports in `_fixtures/notes/step7-consistency/`): sdd with lld found 19 items (M 1, S 16, D 2), brd, pre-brd, the root README and the records 20 (M 5, S 15, D 0). Every M and S item is applied, with one more N1 ripple (`sdd-unifier/brd-to-sdd.md`, BRD chunk 15 row), among them: the delta-review pronoun, the Stale branch keyed on unchanged chunk 19 claims, the raise or note condition stated the same way everywhere, the LLD refresh scope naming chunk 18 items and flags, the restored "if any" on the gate line, the re-chunk version fallback aligned with `chunking.md`, the H1 row covering all six PESTLE rows, the H2 checks accepting `CF-NN` and `DP-NN` sources and pending decisions, the export command's drive-letter paths, and the stale record lines. Checks after the fixes: 253 skill references with 0 problems, README check 0, 45 tests pass. Two design items went to the user: D1 (one application-check row label for both skills) and D2 (how the LLD applies answers: plain text and the carry rule of sdd item 9).

**D1, D2 and the proof reruns (2026-10-07).** The user accepted both: D1 C (the SDD takes the LLD's `[YYYY-MM-DD] application check: OI-NN` label and names the changed chunks in its Checked cell), D2 B (the LLD applies an answer as plain implementation text, removes the flags it answers, carries it to text with one clearly right wording, and leaves text that needs a choice to its application check). The skills are frozen for the proof reruns, which run in the session scratchpad: S3 (brd-unifier `chunks whole` from the saved pre-BRD); an SDD run on a copy of the baseline (a Developer Notes change in 13a, then "refresh the e2e"); then, on its result, an LLD "the SDD has a new version" run under the same answer policy.

**Proof reruns (2026-10-07).** All three ran in Claude Code with cleared-context sub-agents for the review and check passes; outputs saved and every check 0 problems on the saved copies; the skills repository was unchanged during the runs (state hashes). Reports: `_fixtures/notes/step7-runs/`.
- S3, saved as `scenarios/pre-brd-to-brd/rerun-2026-10-07-s7/`: both S3 defects are gone. Pre-BRD 08 Political (4) became 02 constraints 3 (licensed SMS sending) and 4 (licensed hosting in Egypt) (H1). The to-do register uses the three Kinds, an exact Source and a specific Blocks cell in all 84 open or pending rows (H2). 479 links, 0 bad; versions 0; Mermaid 0.
- SDD and LLD, saved as `chain/run-2026-10-07-s7/` (evidence, not the baseline): SDD 1.8 (`Chunks: 13a, 18`); chunk 19 kept byte-identical at 1.7 behind the Stale mark after a faithfulness check (5 A, item 4); gate a bare `Open - Up to date` (item 8); five faithfulness source problems recorded in chunk 18 Reviewer Notes, not raised (3 B); "refresh the e2e" already current, no bump. LLD 1.4: the delta review raised OI-14 to OI-19, all applied in the same update as plain text (16 B, D2); one application check (`[2026-10-07] application check: OI-NN`, D1) raised OI-20 to OI-27, left Open; two passes; SDD 18 read as input only (item 11); chunk 15 listed for its new flag (item 13).
- Not exercised: sdd 1 (pending-only update), 6 (a confirmed faithfulness fix) and 9 (carry rule); lld 14 and 15 (no SDD change answered an LLD flag).
- The runs reported 32 places where the skill text was unclear (SDD 11, LLD 9, BRD 12); each set got a read-only triage (reports with exact fix texts in `_fixtures/notes/step7-wording/`).

**Wording triage (2026-10-07).** SDD W1-W11: M 1, S 8, D 2. LLD L1-L9: M 1, S 5, D 3. BRD B1-B12: M 1, S 7, D 4. Every M and S item is applied, with the parity edits the reports named (the SDD mirror of the LLD reviewer and label wording, the version-cell and refresh-scope ripples): 44 files changed in step 7; references 255 with 0 problems, README check 0, 45 tests pass. Nine design items wait for the user: W2 (the faithfulness exception also covers the fix route), W10 (a direct design instruction as an Action entry), L1 (how far a new SDD version reaches), L2 (an answer policy and the application check's items), L8 (the fixture LLD's decision log), B2 (pre-BRD assumptions), B3 (business objectives no use case serves), B4 (when the key colour is asked), B10 (an accepted answer that depends on a rejected one).

**Wording decisions (2026-10-07).** The user accepted all nine recommendations, applied as written in the `step7-wording` reports: W2 A (a problem in unchanged text that no chunk 19 claim depends on is neither fixed nor raised, only recorded), W10 A (a direct design instruction is an Action entry with its `Rule home:`), L1 B (for each SDD section a change touched, the LLD destinations are compared with the whole current section), L2 A (an answer policy reaches the full or delta review's items; the application check's items wait for a new request), L8 A (no skill change; the fixture note in `_fixtures/README.md`), B2 A (every pre-BRD assumption the BRD rests on becomes an unconfirmed 02 assumption), B3 A (only key results a use case can serve become business objectives), B4 A (the key colour is asked once, with the first batch of open items), B10 A (accepted answers are applied after the loop; a number or link difference caused by a rejected item is carried, anything else is asked again). The root README Known gaps now report the step 7 proof runs and what no run has exercised yet. Checks: 45 files changed; references 255 with 0 problems, README check 0, 45 tests pass, 448 record links resolve.

**Band files (2026-10-07).** A read-only audit of the six Band role files against the step 7 working tree found 25 places (3 High, 10 Medium, 12 Low), each checked against the cited skill lines and applied: 20 lines in five files, the review-lead file unchanged, LF endings and the shared Room rules block kept (`_fixtures/notes/step7-band/band-audit.md`). The audit also raised R1, a skill question held for the user: the W3 wording makes a review's coverage row a chunk 18 content change, so an SDD re-check after a business review always bumps the version, although its row says it bumps only when it changes content itself. The user chose R1 A: a review's coverage rows alone bump nothing (like the faithfulness note); chunk 18 is listed for them only when the update changes other content. Applied in `sdd-unifier/SKILL.md` (Versions, Version bookkeeping, the business review row), both SDD template comments, the root README and two Band lines.

## Findings to carry into step 6

### Step 2, SDD (`chain/run-2026-09-30`)

1. **check_sdd reports 37 problems.** They are keyed use cases that are not links, and NFR or TI IDs without a key, in the reviewer-written chunk 18 and in the decision log. The reviewer brief carries no output conventions. In step 3 the main agent did the same in the Changes Log and the decision log. Decide whether those files must link keyed IDs, or the checker exempts them.
2. **ID ranges.** No rule against ranges such as "REFUNDS/NFR-01 to NFR-04".
3. **Mermaid size.** Some blocks are over the ~30-line guideline.
4. **Ambiguities:**
   - "accept all" gave a hybrid;
   - the assumed Q2 team-count rule;
   - derived API endpoints vs "never write a spec from the BRD alone";
   - ADR-04 and ADR-08 were left Proposed although CLAUDE.md states REST;
   - the `candidate` legend;
   - the §7.3 Events column for use cases realised by a listener;
   - SKILL.md step 8.3 "bump" vs parts-mode.md (runs differ: 1.0 vs 1.1);
   - the 13b slug example in sdd-quality.md;
   - the progress record has no whole-run completion field;
   - Project Type has no recommended answer;
   - the master is written before chunk 18;
   - "serves" vs "drives" in §15.2.

### Step 2, LLD (all reproduced in step 3)

5. 4 of 8 routes have no route data, and the run's own check missed it.
6. Reports and watchdog jobs have no home in 04 or §17.3.
7. The Child LLDs Scope listed "Angular web app": sdd-to-lld.md says "(§2.1 In Scope)" while sdd-unifier checks scope against §13.
8. The 09 §12.8 example became `REFUNDS/UC-010` (confirmed as a template issue).
9. 09 §12.3 dropped the "Pattern | Default config | Override mechanism" table.
10. **Ambiguities:**
    - Screens field vs § Checks 2;
    - the link target for screen-ID mockup rows;
    - a hybrid core with no in-process contracts;
    - listeners and jobs get no `@UseCase`;
    - `tenantId` on every log line vs CLAUDE.md, and its field names vs SDD §11.4;
    - `processed_at` vs `published_at`;
    - PAYOUT_REFUSED;
    - step 6b version pins;
    - backticked flags in the chunk 10-12 templates;
    - §7.2 has no Listener or Job rows;
    - "Direct lift" vs one fact, one home.

### Step 2, em dashes

83 instruction lines put an em dash inside text the agent copies as written: brd 13, sdd 19, lld 51 (including the LLD TODO format "[em dash] verify"). The instruction files hold 536 em dashes in total. Ask the user before cleaning.

### Step 3

The full log, with IDs, is `_fixtures/notes/step3-findings.md`.

**Likely design decisions:**
- **R1.** chunking.md deviation rule 4 collapses 05 and 06* for a small BRD "on an explicit conversion", against re-chunk's one 06* chunk per persona.
- **D10.** Accepted reviewer answers add markers in 09 to 13x and nothing clears them, so E3 is practically unreachable on a first run.
- **A1.** The BRD consistency check reruns did not converge (23, 9, 8, 7, 5 findings; a 3.5 h run).
- **Two pre-BRD to BRD defects.**
  - The reviewer's OI-03 removed the verdict word.
  - BO-11 keeps a flagged price without a marker.
  - A10: no rule for pre-BRD inline markers.
- **Version-bump rules disagree in all three skills** (A7, C2, D3, L4).
- **Targeted LLD refresh.**
  - L1: the refresh skips the reviewer.
  - L5: no rule for reviewer items settled upstream.
  - L3: two triggers, one offer.
- **Modular-monolith template gaps.**
  - D4: §14.1-§14.9 with only in-process events, and the §24 event count;
  - D5: §15.3 has no transaction or idempotency fields;
  - D6: the §14.10 durable publication phase;
  - D13: 13a "Not applicable" wording;
  - E4: the outbox for provider-write dispatch tables.
- **SDD update path.**
  - C1: "mark chunk 19 Stale" is unconditional.
  - C3: the brd-to-sdd new-version row omits reconciliation.
  - C5: decision-log has no section for a BRD-version update.
  - C7: the Child LLDs scope check.
- **pre-BRD.**
  - P1: the investor and reviewer order contradicts itself.
  - P2: the scoreboard mappings are undefined.

**Mechanical and checker items:**
- merge and re-chunk wording gaps (M2, M4, M5, M7, R2 to R10);
- the remaining P items;
- E9: TTL stated as fact;
- E12: boilerplate flags;
- a `.gitignore` entry for `.playwright-mcp/`;
- check_trace's per-entry-point `@UseCase` check is file-level only (a dead regex);
- check_sdd's false positive for API IDs in rejected options in chunk 18.

### Step 4

The full log, with IDs, is `_fixtures/notes/step4-findings.md` (B1 G1-G17, A2a S1-S10, A1b X1-X4, A2b V-1 and T1-T7, V1 W1-W9, C1 C1-1 to C1-10).

**Likely design decisions:**
- **Update paths skip the mandatory reviewer.** The SDD "BRD has a new version" path (S2) and the LLD refresh (C1-2, = L1) both skip it. The run errors V1 found in chunk 19 and the SDD slips A1b found (X2) are what that review would catch.
- **No rule retires items an upstream change settles.** This covers SDD OIs (S8, X3) and LLD open items (C1-2, = L5). decision-log.md also has no home for markers a BRD update answers, nor for user decisions on inline markers outside parts mode (T1).
- **Chunk 19 template.**
  - §24.7 scope when every contract is external (V-1, W1).
  - No-duplication against the required diagrams (W2).
  - The §24.1 archetype and phase have no source (W3).
  - Counts has no in-process events row (T5, W4).
  - Hybrid wording (W5, W6).
  - Faithfulness sources beyond 09-13x, and E3 not covering an ADR used as a doctrine home (W7).
  - No saga selection rule (W8).
  - 8b.3 validates counts and sync edges only, so the 1 wrong and 3 misleading statements passed.
- **Cross-BRD reconciliation missed half of a data dependency gap** (X1). LOYALTY 08's Refunds Portal row names data REFUNDS does not hold.
- **An unsigned source BRD.** No rule covers a source BRD that is In Review (S5, X4, G5).
- **"Leave the rest untouched" vs back-fill** (T2). The ADR-01 wording went stale.
- **The BRD consistency loop has no stop condition** (G2, = A1): 13 runs.
- **Version family:**
  - S10, C1-4, C1-5, C1-9, G4: minor vs major; chunk headers vs Changes Log rows; duplicate 1.0 rows.
  - S1 = C1: the unconditional Stale.

### Step 5

The full log, with IDs, is `_fixtures/notes/step5-findings.md` (I1-I2, K1-K6, L1-L4, A1-A8, and the agents' skill-text items).

**The Known gap decision:** (c), implemented (see the step 5 section); it addresses A1 to A5 and A8. Rerun the review under the new rules as part of the chain rerun.

**Held from the (c) consistency check:**
- B15: decided (option A, pre-BRD optional) and implemented.
- brd-unifier: its Stale rules (`delivery-chunks.md` § The delivery gate and § Refresh triggers, SKILL.md step 8c) omit the master's Delivery Chunks State cell.

**business-reviewer-unifier text:**
- K1: universal rule 3 field names.
- K2: the SME charter's PropTech examples and its pointer to the template rules.
- K3: the BO charter assumes a product sold to customers.
- K4: the 5-to-12 cap, which every reviewer hit.
- K5 (merge rules):
  - no seniority order for the primary;
  - "both sides" against tracker-schema.md;
  - no rule for a finding that two decisions resolve.
- K6: the tracker keeps no Why or Direction, so a resumed walkthrough loses them.
- I1: the default scope against an LLD in the root.
- Applied or Deferred for a point that becomes an open item.
- The walkthrough order question, the restatement format, and "security-related".
- The versioning checklist: per document or per chunk, gated chunks, bump size, and where the changelog lives.
- The hunt's scope ("structural changes" against "all decisions") and re-scoring after the fixes.
- "Mark Stale" against a gate that forbids writing the chunk.

**Fixture content the review left (accept, or fix with the decision):** the run is a fixture of a review in progress (gates Shut, LLD behind). Do not use it as the baseline.

**Checkers:**
- check_e2e: E4 compares dates only (same-day changes pass), and it prints set items in a varying order.
- check_uc_keys should say when it cannot read the register.

**Run hygiene:**
- Agents wrote temporary files outside their scope four times (`/tmp`, `s5-logs`), and each deleted them.
- One walkthrough edit was made before its decision (PA-11).
- A brief that mentions transcripts tripped an API safeguard at the first step.

**SDD content left wrong by the runs (fix in the fixture or accept):**
- the 17 V1 mismatches;
- the five SDD inconsistencies C1 reported (PII masking vs §19, INT-02 dead-letter vs §17.3, `refund_takeback.refund_reference`, 503 vs 500, Figure 18 vs §17.2);
- 13b's doubled "and reports" (T7);
- unlinked keyed IDs in 03:22 and 14:25 (check_sdd).

**Mechanical and checker items:**
- G15: brd-unifier chunk 16 points to an unreachable `PricePulse` reference file.
- G12 and G13: citation labels and figure captions.
- G6 and G7: to-do status values; two definitions of "Locked".
- C1-1: the em dashes in the lld-unifier step 2 question (part of the em dash item).
- C1-10: the §18.5 count.
- W9: Mermaid conventions for layered views and async arrows.
- check_sdd: the link class now also covers Changes Log rows.
- Run briefs: say whether a run may read its own transcript after compaction.

## Done when

| Criterion | Result at close-out |
|-----------|---------------------|
| Whole chain runs on current main with zero checker errors and no unexplained diffs | Working-tree evidence met: reviewed baseline has zero checker problems and explained differences. Current-main part met: step 6 is merged into main as 548bf5d. |
| All four paths pass their scenarios | Scoped outcomes met: S1 version/refresh behaviour, S2 lossless conversion, S3 source mapping, and modular-monolith R2/R3d/LLD13. S3 has two defects from the close-out review (a dropped hosting-licence constraint and a to-do register that does not follow the template), recorded in live-findings.md; step 7 fixed both, shown by its S3 rerun (`rerun-2026-10-07-s7`). S1 retains explained legacy SDD failures; this is not an all-zero result on that older input. From-code and hybrid were never among these four fixtures. |
| SDD chunk 19 written with the gate genuinely open | Met for fixture evidence at SDD 1.7: E1-E4 met, 67-row semantic inventory, zero blockers; named-owner fixture answers and documented faithfulness limits still apply. |
| Reviewer ran on the chain and its gap closed | Met for the exercised chain: R3a review and R3b-d owner handoffs, then Claude verification and corrections. No independent-context claim for the Codex passes. |
| README Known gaps empty or only accepted remaining items | Updated with the brief's accepted fixture limits, unrun directions, explained scenario limitations and frozen next-round findings. It does not claim those findings are fixed or approved production behaviour. Step 7 then fixed the findings in the skills; Known gaps now names what no run has exercised yet. |

## Rules

- One short-lived branch per step, with Conventional Commits. Commit, merge, push, or delete branches only when the user explicitly says so.
- Test outputs go in the scratchpad or `_fixtures/`, never inside a skill folder.
- No em dashes. The BRD stays in business language only (the WHAT), the SDD owns the HOW, and the LLD owns the specs. Diagrams are inline Mermaid.
- Skill descriptions stay under 1,024 characters. Codex and Kimi load these skills through junctions in `~/.agents/skills`, so nothing needs porting.
- Before trusting a checker change, run it on the baseline and on a copy with a planted error. Keep checkers free of literal em dashes (write "\u2014").
- Run each scenario or stage as its own background subagent. Do not use the Workflow tool unless the user says "use a workflow".
- If you use a git worktree, do not start a Claude session inside it. On Windows, that session's MCP servers keep the folder locked after `git worktree remove`.

## Log

| Date | Change |
|------|--------|
| 2026-09-30 | Steps 1 and 2 done on `test/unifier-fixtures` and `test/chain-rerun`. |
| 2026-10-01 | Steps 1-2 merged into local main (057f137). Step 3 done and committed (ebc20a4), merged into local main (2855377). Step 4 started on `test/e2e-gate-and-loyalty-uat`; B1 and A1 launched. Plan file created. |
| 2026-10-01 | A1 done (25 proposals; v1.1 adjustments for CL-18, CL-20, CL-21, CL-23). B1 still running; LOYALTY already at v1.1 (In Review) with grill-me changes, including a new NFR-03. |
| 2026-10-01 | B1 done (LOYALTY v1.2, gate Open, chunks 15 and 16). A2 split into A2a (SDD takes LOYALTY v1.2), A1b (re-propose the affected markers), A2b (apply and chunk 19). Next: A2a. Step 4 findings logged in `_fixtures/notes/step4-findings.md`. |
| 2026-10-01 | A2a launched 09:35 after backing up the run folder. sdd-unifier has no source-BRD status gate (brd-to-sdd.md § Changes after the SDD exists), so the "In Review" refusal case is not expected. |
| 2026-10-01 | While A2a ran: `check_trace.py` extended for LOYALTY chunk 16, and the new `check_e2e.py` (gate and chunk 19) added; both tested on baselines and planted errors; `_fixtures/README.md` updated. |
| 2026-10-01 | A2a done (SDD v1.1, E3 23 markers; findings S1 to S10). A1b launched 10:10. |
| 2026-10-01 | A1b done (Apply list of 23; CL-18 and CL-20 retired; findings X1 to X4). A2b launched 10:33. |
| 2026-10-01 | A2b done: SDD v1.2, e2e gate open, chunk 19 written (findings V-1, T1 to T7). V1 and C1 launched in parallel at 11:15. |
| 2026-10-01 | V1 done: 17 chunk 19 mismatches (1 wrong, 3 misleading, 13 cosmetic), ambiguities W1 to W9. C1 still running. |
| 2026-10-01 | C1 done (LLD v1.1, LOYALTY trace). Checks run, the run saved as `chain/run-2026-10-01-e2e`, README updated. Step 4 done, awaiting the user's review; nothing committed. Next: step 5. |
| 2026-10-01 | Step 5 run setup proposed (see the step 5 section); waiting for the user's go, which also covers committing and merging step 4. |
| 2026-10-01 | The user reviewed step 4. Committed as d16e939 and merged into local main as 8568446 (not pushed). Step 5 started on `test/business-reviewer-chain`; the five panel reviewers launched at 12:35. |
| 2026-10-01 | Panel done (60 findings) and merged into 39 points (13:17). Walkthrough and apply done about 16:20 (39 Applied). Verify: the hunt scored 8/10 with 26 remnants; fixes and versioning done about 17:40 (REFUNDS 1.1, LOYALTY 1.3, SDD 1.3). Checks run, the run saved as `chain/run-2026-10-01-review`, README and logs updated. The Known gap options were given to the user; nothing committed, no skill changed. Next: the user's decision on the Known gap, then step 6. |
| 2026-10-01 | The user chose option (c). Implemented in business-reviewer-unifier, sdd-unifier (one row), brd-unifier (one row), and the root README; Band files synced. A read-only consistency check (4 A, 15 B, 12 C) was fixed except B15 (held for the user) and C11 (step 6). Overview page published: https://claude.ai/artifact/GYQLZZeSBxQXkfmzV8uLKC. Nothing committed. Step 5 done, awaiting review; next: step 6. |
| 2026-10-01 | B15 decided by the user: option A, with the pre-BRD optional (never mentioned when absent). Implemented in business-reviewer-unifier (Intake, principle 9, Apply rules 3, 6, 7, the verify templates, the BRD hand-off row, the tracker's Versioning rule), both READMEs, the Band review-lead file, and the overview page. |
| 2026-10-01 | The user reviewed step 5. Committed as 5516e05 (skill) and bdbf5e4 (run), merged into local main as de3baec (not pushed). Step 6 started on `fix/unifier-fix-round`; decisions: clean all em dashes, upgrade the fixture BRDs through brd-unifier. Eight triage agents launched. |
| 2026-10-02 | Triage done (8 reports). M and S fixes applied in all five skills. The user accepted all 44 design recommendations (`_fixtures/notes/step6-decisions.md`); implementation launched, one agent per skill folder, plus the adoption of the tested checker scripts. |
| 2026-10-02 | Checker adoption done; reviewer decisions implemented. Progress persisted for a resume: triage reports copied to `_fixtures/notes/step6-triage/`, briefs and resume procedure in `_fixtures/notes/step6-plan.md`. brd, sdd, lld, and pre-brd implementation agents still running at 07:50. |
| 2026-10-02 | All five implementation agents done (sdd last, 09:07). The four consistency checkers launched at 09:08 and were stopped by the weekly limit within a minute; no report written. |
| 2026-10-04 | Resumed. Verified the tree unchanged since 09:07 on 2026-10-02 (check_refs 226 references, 0 problems; pre-BRD tests 14 pass). The user approved stage C; the four checkers relaunched with the same briefs, saving as they go. |
| 2026-10-04 | Stage C done: 114 findings; mechanical and simple fixes applied (5 agents); the user accepted all 11 design recommendations (C1 to C11), applied with the fix agents' follow-ons. check_refs 239 references, 0 problems; pre-BRD tests pass; no em dash added. Nothing committed. Next: the user's review, then stage E (em dash pass). |
| 2026-10-04 | Stages E and RM: em dashes 0 in all five skill folders (verified: punctuation only); Band files synced; the root README synced by Codex (75 edits, reviewed, 8 fixes); LLD diagram summary rule added; a Codex consistency re-check (19 findings, 18 applied; lld B-2 decided by the user: narrow the Figma trigger); CK done by Kimi (4 checkers changed, `check_versions.py` added; verified). Nothing committed. |
| 2026-10-05 | Stage B: the fixture BRDs migrated through brd-unifier and taken through the delivery gate (REFUNDS 1.7, LOYALTY 1.7; chunks 15 and 16 written); the PM supplies test-fixture values for facts no file holds; after a scope loop the user set the PM to reject new behavior-adding items. 33 skill findings in `_fixtures/notes/step6-handoffs/B-findings.md`. |
| 2026-10-06 | Stage R: R1 SDD derive (modular monolith, five modules), R1b and R1c settled the gate-blocking markers with test-fixture answers (lawful bases, owner the DPO); SDD 1.3, e2e gate Open, chunk 19 written, two faithfulness passes fixed 7 source inconsistencies. The user approves each R stage. 15 findings in `R-findings.md`. Paused; the remaining stages (R2 LLD, checks and save, business review and hand-offs, findings triage, final records) handed to Codex with `resume-codex.md`; the run copied to `_fixtures/runs-wip/step6-R/` (untracked). |
| 2026-10-07 | Codex finished R2, CHK and approved repairs/save, business review R3a and handoffs R3b-d, TRIAGE and its approved implementation, then FINAL on separate user go. Saved run-2026-10-06-final remains immutable; review versions REFUNDS 1.9, LOYALTY 1.8, SDD 1.5, LLD 1.2. All 56 findings have dispositions (46 implemented, 10 retained). FINAL checks: README 0, references 241/0, exporter tests 14 passed. Known gaps now lists final-policy live-rerun, semantic E3, source/readiness and scenario limits. Baseline replacement, memory sync and follow-up scenarios await the user. Nothing committed or pushed; after-Codex prompt unrun. |
| 2026-10-07 | After-Codex VERIFY/FIX/GATE/FIX2, SDD16/SDD17 and LLD13 complete in Claude Code. Codex reran S1-S3 continuously, saved and SHA-256 verified the reviewed 129-file baseline, and updated RECORDS. CLEAN passed its preconditions, removed temporary evidence, and verified 45 tests plus 7 subtests, records links, README, references and baseline checks. Versions 1.9/1.8/1.7/1.3, semantic E3 67 rows/0 blockers, 38 TODO/24 Confirm. Commits, memory sync and Band verification handed back to Claude Code; no git writes by Codex. |
| 2026-10-07 | Close-out review in Claude Code: the repository matched `handoff-manifest-2.txt` on repository paths, and fresh checks reproduced every Codex result. Codex's follow-up review found two S3 defects (a dropped hosting-licence constraint, a to-do register off the template); both confirmed and recorded in `live-findings.md`, records corrected. A read-only audit of the root README against the final skills found 41 documentation gaps, all verified and fixed. Step 6 committed on `fix/unifier-fix-round` in seven commits on the user's word (hashes in the Status table). |
| 2026-10-07 | Step 6 merged into main as 548bf5d and pushed by the user (86cab74..548bf5d). The Band check passed (the six Band files unchanged since the sync). Step 7 started on `fix/unifier-live-findings`: read-only triage of the next-round findings in three agents. |
| 2026-10-07 | Step 7 triage done (25 items: M 5, S 14, D 6); the 19 mechanical and simple fixes applied and checked; six design items to the user. Nothing committed. |
| 2026-10-07 | The user accepted all six design recommendations; applied and checked (references 251/0, README 0, 45 tests). Read-only consistency check of the step 7 change launched. |
| 2026-10-07 | Consistency check done (39 items: M 6, S 31, D 2); every M and S item applied (references 253/0, README 0, 45 tests); D1 and D2 to the user. Nothing committed. |
| 2026-10-07 | The user accepted D1 C and D2 B (applied; references 253/0, README 0) and approved the proof reruns: S3 BRD and the SDD run launched in parallel; the LLD run follows the SDD run. |
| 2026-10-07 | Proof reruns done and saved (S3 `rerun-2026-10-07-s7`, chain `run-2026-10-07-s7`; reports in `notes/step7-runs/`): H1, H2, sdd 3, 4, 5 and 8, lld 10, 11, 13 and 16, D1 and D2 behave as decided; all checks 0. Triage of the 32 wording notes the runs reported is running. |
| 2026-10-07 | Wording triage done (M 3, S 20, D 9); every M and S fix applied (44 files; references 255/0, README 0, 45 tests); nine design items to the user. Nothing committed. |
| 2026-10-07 | The user accepted all nine wording recommendations; applied and checked (references 255/0, README 0, 45 tests); README Known gaps updated for step 7. Next: the six Band files, then the commit proposal. |
| 2026-10-07 | Band files resynced (25 audit findings applied, five files; Room rules unchanged). R1 (a review coverage row and the SDD version) raised for the user. Nothing committed. |
| 2026-10-07 | The user chose R1 A and approved commit, merge and push. R1 applied; step 7 committed: skills 1d8db77 (pre-brd), c8bdab9 (brd), 73111e5 (sdd), eec7784 (lld); test d60e6e7; then docs. |
