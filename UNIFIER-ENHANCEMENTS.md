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
| 5 | Business reviewer on the chain; close its Known gap | Done, awaiting review: option (c) chosen and implemented | `test/business-reviewer-chain` (from 8568446), nothing committed | 2026-10-01 |
| 6 | Fix round; fixture BRD upgrade decision; rerun the chain; README; baseline; memory | Not started | - | - |

**Git:** main is local only, 7 commits ahead of origin, not pushed. The branches `test/unifier-fixtures`, `test/chain-rerun`, `test/known-gap-scenarios`, and `test/e2e-gate-and-loyalty-uat` are merged but not deleted. Step 5 runs on `test/business-reviewer-chain`, branched from main 8568446. Its work is uncommitted there:
- the run and notes: `_fixtures/chain/run-2026-10-01-review/`, `_fixtures/notes/step5-findings.md`, `step5-plan.md`, `step5-logs/`, `_fixtures/README.md`, and this file;
- the option (c) skill change: every business-reviewer-unifier file except `reviewer-personas.md`, one request row each in `sdd-unifier/SKILL.md` and `brd-unifier/SKILL.md`, and the root `README.md`.

The four Band files in `C:\Users\negat\Downloads\` were synced as well; they are outside the repo.

## Context (all steps)

- **Skills.** The root `README.md` has the chunk maps, the handoffs, and "Known gaps". No skill file has changed since 86cab74.
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

## Step 5: business reviewer (Done, awaiting review)

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

## Step 6: fix round (Not started)

1. Fix what steps 2 to 5 find, the same way as the consistency rounds:
   - run parallel read-only checkers;
   - fix mechanical and simple issues using the recommended option;
   - hold design changes for the user's decision, with options and a recommendation.
2. Decide with the user whether to upgrade the fixture BRDs to the current brd-unifier rules (MK-NN rows, the chunk 15 and 16 format).
3. Rerun the chain.
4. Update the README ("Known gaps" empty, or listing what remains).
5. Refresh the fixture baseline (`chain/run-new`) with the passing outputs.
6. Update the memory files.

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

- The whole chain runs on current main with zero checker errors and no unexplained diffs.
- All four paths pass their scenarios.
- SDD chunk 19 has been written once, with the gate genuinely open.
- The reviewer has run on the chain, and its gap is closed.
- README "Known gaps" is empty or lists only items the user accepted.

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
