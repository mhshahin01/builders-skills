# Step 8 plan: proof round on the final step 7 text (planned 2026-10-07)

SP = `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\b611c628-b7a5-4a58-8c04-7121c5dcd964\scratchpad` (this session's scratchpad). Step 8 works in `SP\s8\`.
Branch: `test/unifier-proof-round`, from main 8506a9b (step 7 merged and pushed).

## Why

Step 7 changed the skills after its proof runs: 23 wording fixes, nine wording decisions (W2 A, W10 A, L1 B, L2 A, L8 A, B2 A, B3 A, B4 A, B10 A) and R1 A. No run has exercised these yet, nor these step 7 rules:
- sdd 1 (an update that only applies pending decisions);
- sdd 6 (a confirmed faithfulness fix);
- sdd 9 (the carry rule);
- lld 14 (the retention mapping);
- lld 15 (flags outside the mapped chunks).

Step 8 runs the final text once, scores each rule, and fixes only what the runs show.

## Stages

| Stage | What | Status |
|---|---|---|
| 0 | Setup: close the step 7 records; build the run inputs in `SP\s8\` and the S4 plants; hash the repository (skills frozen until the runs end). Stop for the user's go | Done 2026-10-07. The user said go, with the S4a request 3 probe and a `check_todo.py` checker. S3 input `SP\s8\s3\run\` (identical to the step 7 S3 input, 25 files). S4 input `SP\s8\chain\`, from the step 7 snapshot `chain-after-sdd` (SDD 1.8, LLD 1.3), plus plants P1 to P3, kept as `chain-before-s4a\`; the plant record `SP\s8\plants.md` joins the notes after the run. Skill state: `SP\s8\repo-state-before.txt` (152 files). L8 A is applied as "leave the fixture LLD's `decision-log.md` in place, read-only, and check that it is unchanged after the run": 7 LLD files link to it, so moving it out would break those links and invite fixes the refresh did not cause |
| 1 | Runs S3 and S4a in parallel, then S4b (it needs S4a's SDD); X at any time. One background agent per run; stop and report after each | S3 and S4a launched 2026-10-07 at about 19:15 and 19:21 (briefs `SP\s8\briefs\`). X done 19:22: the documented line ran as written in Git Bash and in PowerShell (exit 0, absolute `C:/` paths, a four-cell RICE payload); both exports and the reference workbook hold 77 formula cells; the seven `= ...` notes in column C of `Market Sizing & analysis` are text; the control panel reads YES. Limit: the payload's RICE values equal the reference workbook's samples, so the write itself is not distinguishable there. `check_todo.py` built during the runs (13 tests; the suite now 58 plus 7 subtests). It reports 206 problems on the step 6 S3 output (the defects step 7 fixed) and 0 on the baseline BRDs. On the step 7 S3 output it reports 1 problem, TD-88, whose Blocks cell names only `decision-log.md`; that goes to stage 3 |
| 2 | Verify each claim against the files, not the agents' reports; run every checker; `diff_runs.py` against the step 7 outputs; fill the scorecard below | Done 2026-10-08: every claim checked against the files and every checker run; the scores are in § Results so far. No step 8 record shows a `diff_runs.py` run against the step 7 outputs |
| 3 | Triage the runs' findings and unclear-text notes: M and S applied, D to the user. A fix that changes a rule a run measured gets a scoped rerun, or goes to step 9 | Done 2026-10-08. **BRD** (13 notes, including TD-03 and TD-88): M 1, S 4, D 6, N 2. **SDD** (8 notes): S 3, D 3, N 3 (S6 and S7 are plant artifacts, S8 never triggered). Every M and S fix is applied, with its parity edits: B1 rejection through Other (chunk 13, both READMEs, the root README); B6 `Pending gate` in the mockup Status list; B9 "a link to the Resolution Log" in 6 places; B11 the project-name intake line (brd and sdd; lld after S4b); B12 one question per marker; S1 the unit of "text this request changed"; S2 a Stale-path fix takes the update's version; S3(b) a delta review covers pending items applied in the same update (also chunk 18 and the combined template). Checks: references 256 with 0 problems, README check 0, links 449 with 0 bad, the 16 and 15 unit tests pass. Design items to the user: B3, B4, B5, B7, B10, B13, S3(a), S4, S5. **Decisions (2026-10-08):** the user accepted all nine recommendations, plus three optional wordings: B8 (no yes to the Mermaid CLI: use the line-by-line check), S6 (a pending item gets its decision-log entry when applied), and `In progress` in the mockup Status list. The accepted options:
- B3 A: one `Assumption to validate` row when an assumption's marker asks whether it holds.
- B4 B: two "restore, never choose" mechanical fixes.
- B5 C: third-run mechanical fixes that touch only chunk 14 or a companion record are applied at once.
- B7 A: `Needed before` sets P1 or P2.
- B10 A: proposal from the mapped part when source parts disagree.
- B13 A: resolved by B5 C.
- S3(a) A: a repeated business-review hand-off is taken once; root README line added.
- S4 B: an edit no Changes Log row records joins this update.
- S5 A: `(vX.X)` in dated review labels.

All are applied in brd-unifier, sdd-unifier and the root README. Checks: references 256 with 0 problems, README check 0, links 449 with 0 bad, the 16 and 15 unit tests pass. Waiting for S4b to end: S5 in lld-unifier (SKILL.md, chunk 18, the combined template) and B11 in lld-unifier/SKILL.md. B3 and B5 change rules S3 measured (scorecard B12, B7 and B8); on the user's word they go to step 9 as unproven, with no scoped rerun. The LLD triage follows S4b.

**LLD triage (2026-10-08):** 8 notes plus one run miss (`step8-triage/lld.md`): S 3, D 5, N 2.
- Applied, with the accepted S5 lld half and B11: L1 (the whole mapped source, judged per destination, and the README line), L5 (an accepted refresh clears the out-of-date note), and L7 (a per-service file's label is its name), folded into S5.
- Checks: references 256 with 0 problems, README check 0, 59 tests and 7 subtests pass, links 451 with 0 bad.
- **Decisions (2026-10-08):** the user accepted all five recommendations (L2 B, L3 B with the sdd mirror, L4 A, L6 A with the root README clause, L8a A) and both extras (L9, and L8b in lld, brd and sdd). All are applied, with one parity edit: the lld-unifier README derived-view sentence. L4's optional confidence-rules.md row was reviewed and applied on the user's word. Not taken: L2 A's chunk 07 part, so §11.4 Metrics and Dashboards still reach no chunk 10 section.
- Checks: references 261 with 0 problems, README check 0, 59 tests and 7 subtests pass, the 16 and 15 unit tests pass, links 451 with 0 bad.
- **Unproven, to step 9** (no scoped rerun): B3 and B5 (rules S3 measured); L2 (the refresh reach of L1 B) and L3 (flag removal), rules S4b measured. |
| 4 | Save: S3 as `scenarios/pre-brd-to-brd/rerun-<date>-s8/`; S4a and S4b as `chain/run-<date>-s8/` (evidence, not the baseline); reports in `notes/step8-runs/`; README Known gaps; the Band files if a skill changed | Saved 2026-10-08, each copy SHA-256 equal to its scratch run:<br>- S3 as `scenarios/pre-brd-to-brd/rerun-2026-10-07-s8/` (19 files);<br>- S4a and S4b as `chain/run-2026-10-07-s8/` (129 files).<br>Checks on the saved copies are 0, except S4a's 3 `check_sdd` misses and S3's TD-03 note. Condensed reports, the plant record and its patch are in `notes/step8-runs/`; the BRD and SDD triage records are in `notes/step8-triage/`. The fixture README has rows for both runs, and the root README Known gaps now covers steps 7 and 8 (README check 0, links 451 with 0 bad). After the LLD triage, the Band files were resynced: 19 findings applied in four files, the Room rules block unchanged ([band audit](step8-band/band-audit.md)) |
| 5 | Commits on the user's word: test, docs, and one per skill if fixes were made | The 12 audit fixes are already committed on their own (6cc2f93). On the user's word (2026-10-08), the root README matrix rename (lines 71 and 139) goes into the step 8 docs commit. The rest waits for the user's word, as `fix(brd-unifier)`, `fix(sdd-unifier)`, `fix(lld-unifier)`, a `test:` commit for `_fixtures/`, and the `docs:` commit for README.md and UNIFIER-ENHANCEMENTS.md |

## Rules for every run

- A background general-purpose agent reads the skill from disk (`C:\Users\negat\.claude\skills\<skill>\SKILL.md` and the reference files it names), not through the Skill tool.
- It writes only in its run folder under `SP\s8\`, never in the skills repository. It reads nothing under `_fixtures/` and no other run.
- It works without the user. Where the skill asks the user, it applies the run's answer policy and records the question, its batch, and the answer.
- Review and check passes are fresh cleared-context sub-agents, as the skill says.
- The brief never states a rule the run measures.
- It returns its report as its final message (sub-agents cannot write report files), covering:
  - every question asked and its answer;
  - versions and Changes Log rows;
  - review passes and their scopes;
  - checks run, and any deviation from the skill;
  - each place the skill text was unclear (file:line).

## Runs

| Run | Input | Requests and answers | Measures |
|---|---|---|---|
| S3 | A copy of the saved pre-BRD in `scenarios/pre-brd-to-brd/`; brd-unifier `chunks whole` | The test PM policy: accept recommendations; reject new items that add business behavior. Person-only questions, the key colour included, get test-fixture values with an owner named | H1, H2 (regression); B1 to B12 |
| S4a | A copy of SDD 1.8 from `chain/run-2026-10-07-s7/` with its BRDs, plus the plants P1 to P3 below | 1. "Apply the decided items." 2. From the architecture owner: "In 13e § Retention Policy, add the two cases the LLD routed to you: a member's purchases dated before a first period that a rejoin notice opened belong to that first period's set; a notice that opened or closed no period is deleted with the member's last remaining period." 3 (optional probe). "The business review changed this SDD", sent again for the step 6 review. Answer policy: accept recommendations | sdd 1, 6, 9; W2 A; W10 A; W3 with R1 A |
| S4b | LLD 1.3 from `chain/run-2026-10-07-review/`, its run-record `decision-log.md` moved out (L8 A), with S4a's final SDD | "The SDD has a new version." Answer policy: accept all, as in step 7 | L1 B; lld 14 and 15; 16 B, D2 B, L2 A |
| X | The saved pre-BRD | The `pre-brd-unifier/xlsx-export.md` command exactly as written, in Git Bash and in PowerShell | N2; the 77 formula cells |

**S4a plants.** They are written into the input copy before the run. Their details stay in `SP\s8\` until the run ends, then go into its report.
- **P1.** One open item that an earlier request left `Decided - pending application`, recorded the way the skill records it: the decision, decider and date; the decision log; the gate Shut; chunk 19 marked Stale. Its answer changes a fact stated in two places with one clearly right wording, and no chunk 19 claim rests on it.
- **P2.** One count or name in chunk 19 that disagrees with its source chunk.
- **P3.** One mechanical inconsistency, with one clearly right side, in a chunk 02 to `13x` that the requests do not change and that no chunk 19 claim rests on.

## Scorecard (pass when)

| Rule | Run | Pass when |
|---|---|---|
| sdd 1 | S4a request 1 | The baseline is an application check of P1 (`[YYYY-MM-DD] application check: OI-NN` rows, changed chunks named), not a delta review |
| sdd 9 | S4a request 1 | P1's second statement is carried in the same step, named with the OI ID in the Changes Log row, and covered by the check |
| sdd 6 | S4a request 1 | The faithfulness check behind the Stale mark finds P2; it is fixed in chunk 19 and confirmed without a full rerun; chunk 19 takes the new version and is listed under `Chunks:` |
| W2 A | S4a request 1 | P3 is recorded in chunk 18 Reviewer Notes with its source, owner and reason, neither fixed nor raised; the note bumps nothing; the handoff names it |
| W10 A | S4a request 2 | `decision-log.md` has an Action entry with the instruction and its `Rule home:` link to 13e |
| W3, R1 A | S4a requests 1 and 2 | Chunk 18 is listed with its coverage rows in each content-changing update |
| R1 A | S4a request 3 | No version bump when the delta review raises nothing; a bump with chunk 18 listed when it raises an item |
| L1 B | S4b | The refresh itself, before the delta review, brings in the `IdentityProviderPort` and its Keycloak adapter that step 7's delta review had to raise as OI-19 |
| lld 14 | S4b | The retention change is checked in both destinations, 04 `loyalty-points.md` §7.3 and 05 §8.6 |
| lld 15 | S4b | CONFIRM-23 and CONFIRM-24 are removed; their text states the rule with a link to 13e; their chunks and chunk 15 are listed |
| 16 B, D2 B, L2 A | S4b | Answers applied as plain text in the same update; one fresh application check; the check's items stay Open and are offered for a new request |
| H1, H2 | S3 | As in step 7: the hosting rule as numbered 02 constraints; the to-do register follows the template |
| B1 | S3 | An open item marks only the homes that took the content it is about |
| B2 | S3 | Each pre-BRD log assumption the BRD rests on is a numbered, unconfirmed 02 assumption citing its row |
| B3 | S3 | Company key results stay in the pre-BRD; launch prerequisites are 02 dependencies; only key results a use case can serve become business objectives |
| B4 | S3 | The key colour is asked once, in the first batch of the acceptance loop |
| B5 | S3 | Global defaults appear only as named proposal markers |
| B6, B9 | S3 | The to-do Owner and the raised-from labels follow the new wording |
| B7, B8 | S3 | A failure found by or after the third run waits as `Decided - pending application: TD-NN` |
| B10 | S3 | An accepted answer that needs a rejected item's content is asked again; a number or link difference is carried |
| B11, B12 | S3 | Markers are counted by question; a pending dependency with its own marker has one row |
| N2 | X | The documented command runs as written in both shells; the workbook has 77 formula cells |

A rule with no triggering case in a run is scored "not exercised", with the reason.

## Results so far (2026-10-07)

**The freeze was broken mid-run.** At 19:45, during S3 and S4a, the user's other session applied 12 one-line consistency fixes to 9 skill files and added `productization/`. A read-only review against the canonical sources found none of the 12 touches a rule this step measures, so the results stand. On the user's word, they were committed on their own as 6cc2f93, together with the end of change 6: the matrix name "Users & Use Cases Matrix" at brd-unifier/README.md:32 and :61 and sdd-unifier/README.md:91. Before that commit: 256 skill references with 0 problems, the 16 CHK regression and 15 E3 inventory tests pass. S4b runs on the post-fix text (`SP\s8\repo-state-before-s4b.txt`).

**S3** (19:12 to 22:41; reviewed against the files):
- **Output:** BRD 1.0, gate Shut. 822 links resolve; versions, Mermaid and the source pre-BRD are unchanged or clean.
- **Pass:**
  - H1: 02 constraints 14 and 15 carry the licensed SMS sending and licensed hosting rules.
  - B2: the 02 assumptions cite their pre-BRD 24 rows.
  - B3: company targets stay in the pre-BRD, linked from 01.
  - B4: the key colour was asked once, in batch 1, and chunk 11 holds the fixture value.
  - B5: two proposals are named "from the user's global defaults, not a project source".
  - B6: 91 rows read `Recommendation: BRD author (not named yet, TD-79)`, and TD-79 is the product manager's.
  - B7 and B8: CF-27 to CF-32 are `Decided - pending application: TD-87` to `TD-92`.
  - B10: OI-18, OI-24 and OI-27 needed a rejected item's content, were asked again, and are `Adjusted - applied`.
  - B11: 106 questions are counted.
- **H2:** pass, with one miss: TD-03 holds two questions (`check_todo.py` note).
- **Not exercised:** B9 (no Reviewer Note was needed to finalise the BRD).
- **B1 pass:** of the 16 pre-BRD 24 items, the 7 about content the BRD took each mark one home and have one to-do row. The 9 about market figures, scores, the budget and investor metrics stay in the pre-BRD. In OI-16, part (5), the per-plan SMS charge, is content the BRD does not take, and part (1) is pre-BRD arithmetic behind a target the BRD restates as its own.
- **B12 pass:** TD-60, the PDPC licence dependency whose marker asks when it is needed, is one `Assumption to validate` row.
- **Deviation:** the reviewer sub-agent wrote a scratch folder outside the run folder, then deleted it.
- **Triage input:** 11 unclear-text notes.

**S4a** (19:21 to about 23:30; reviewed against the files):
- **Output:** SDD 1.9 to 1.12, and nothing outside the SDD folder changed. The gate is Stale on E1: OI-60 and OI-61 are pending.
- **Checkers:** every SDD checker reports 0 except `check_sdd`, which reports 3 link and key problems the run added. An earlier note said 0; only the checker's last line had been read.
  - `REFUNDS/UC-01` unlinked in the OI-54 heading (chunk 18).
  - `LOYALTY/UC-01` unlinked in a v1.10 decision-log entry.
  - `NFR-01` unkeyed in a v1.12 delta row.

  These are run misses against an existing rule, not skill gaps, and they stay in the saved evidence.
- **Request 1 (1.10):**
  - sdd 1 pass: the only pass was `[2026-10-07] application check: OI-48`.
  - sdd 9 pass: the Input row, the INT-05 When cell and the alert threshold (10 minutes, two refresh intervals) were carried and named in the row.
  - sdd 6 pass: P2 was found as "wrong", fixed in chunk 19 and confirmed by the same agent; chunk 19 took the new version and is listed.
  - The run also caught P3 through E4: the v1.8 Reconciled hash would not reproduce.
  - P3 went the fix route, not the W2 route, because chunk 19 Figure 33 names the job. That plant assumption was wrong.
  - W2 A pass on real problems: 11 source problems recorded in chunk 18, neither fixed nor raised.
- **Request 2 (1.11):**
  - W10 A pass: the decision log has Action entries quoting the instruction, with `Rule home:` §17.5 Retention Policy.
  - The faithfulness check behind the Stale mark kept chunk 19 and fixed 3 cosmetic mismatches.
  - A source problem with a dependent claim was raised as OI-52 and left pending at the review cap.
- **Request 3 (1.12):**
  - R1 A's "rows alone" branch was not exercised: the request applied OI-52 and raised OI-53 to OI-61, so it bumped correctly.
  - The repeated hand-off has no rule (a design question for the triage).
- **W3 and R1 A, other-content branch:** pass; chunk 18 is listed in all three rows.
- **Deviation:** a pass-3 reviewer wrote a scratch file outside the folder, then deleted it.
- **Triage input:** 8 unclear-text notes.

**S4b** (23:36 to 01:12; reviewed against the files):
- **Output:** LLD 1.3 to 1.4, from SDD 1.7 to 1.12 in one update.
  - Nothing outside the LLD folder changed except its own Child LLDs row in the SDD.
  - The fixture `decision-log.md` is byte-identical (L8 A held).
  - Links 1,314 with 0 bad; trace, lineage and versions 0; Mermaid 0.
  - Flags: 43 TODO and 23 Confirm.
- **L1 B pass, in part.** The refresh, before the delta review, named `IdentityProviderPort` in customer-accounts §7.4 and added the Keycloak container to 13 §16.3. That is the gap step 7's delta review had to raise as OI-19, and none of the new OI-14 to OI-28 asks for it. Two parts did not come from the refresh:
  - the §7.2 `KeycloakIdentityProviderAdapter` row came with review item OI-17, a tenancy fix;
  - the §16.2 port mock that step 7's OI-19 added is not in 1.4, and the SDD does not settle it.
- **lld 14 pass:** the 13e Retention Policy change was checked in loyalty-points §7.3 and in 05 §8.1, §8.2 and §8.6.
- **Flag removal pass:** CONFIRM-23 and CONFIRM-24 were removed; the replacement text links the SDD Retention Policy; chunk 15 is listed.
- **lld 15 not exercised:** both flags sat in a mapped chunk.
- **16 B, D2 B and L2 A pass:**
  - The delta review raised OI-14 to OI-23, all applied in the same update.
  - One fresh application check followed (ten rows).
  - Its OI-24 to OI-28 stay Open and are offered for a new request.
  - Two passes in all.
- **D2 B carry:** one run miss. OI-16's "orphan" wording was not brought in line; the check caught it as OI-26.
- **Specs:** re-synthesised (SDD chunk 01 changed), and identical.
- **Deviations:** an empty folder made and removed; the fixture decision log scanned by searches but never read or written.
- **Triage input:** 8 unclear-text notes.

## Effort

- **Agent time, about 7 to 8 h:** S3 up to 3.5 h, S4a about 2 to 3 h, S4b about 1.5 h.
- **Wall clock, about 6 h:** S3 runs parallel to S4a, then S4b.
- **Verification and records:** about 2 h, done by Claude.
