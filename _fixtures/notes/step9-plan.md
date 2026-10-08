# Step 9 plan: second and last proof round, on the step 8 text (planned 2026-10-08)

**Status (2026-10-08): not run.** The user chose a short close-out instead: D1 A and D2 A applied without a rerun, the step 8 records closed, the Band files resynced for D1, the unproven items in the README Known gaps, and the plan marked Done. This plan stays ready in case real use shows trouble; then skip stages 0a and 0c.

SP = the running session's scratchpad. Step 9 works in `SP\s9\`.
Branch: `test/unifier-proof-round-2`, from main after the step 8 merge (main equals origin). The user creates it: `! git switch -c test/unifier-proof-round-2`. The uncommitted step 9 plan moves with it.

**ID key.** `8-B3` is step 8 triage item B3 (`step8-triage/brd.md`); `8-S3a` is sdd item S3(a) (`step8-triage/sdd.md`); `8-L2` is lld item L2 (`step8-triage/lld.md`). `7-R1` is step 7's R1 A (`step7-band/band-audit.md` § Skill question raised by the audit); `7-B9` is step 7 wording item B9 (`step7-wording/brd-wording.md`); `7-W10` is step 7 wording item W10 (`step7-wording/sdd-wording.md`). `lld 15` is live finding 15 (`step6-handoffs/live-findings.md`).

## Why

Step 8 changed the skills after its runs: 14 design decisions, five optional wordings, and the M and S fixes (`step8-triage/`). No run has exercised them yet.
- Four change rules a step 8 run measured: 8-B3 and 8-B5 (S3), 8-L2 and 8-L3 (S4b).
- Three cases no step 7 or step 8 run triggered: 7-R1's "coverage rows alone" branch, 7-B9 (a Reviewer Note needed to finish the BRD), and lld 15 (an LLD flag outside the chunks a change maps to).
- Two design questions are open: D1 and D2 below.

Step 9 settles D1 and D2, runs the step 8 text once with plants for the cases that do not occur on their own, scores each rule, and fixes only what the runs show. It is the last proof round: § Exit rule says how it ends the plan.

## Exit rule (the user's word, 2026-10-08)

Step 9 is the last proof round. There is no step 10.
- **Close when no rule fails.** If every scored rule passes or is not exercised, the plan closes after step 9. The triage's M and S fixes are applied and checked, with no further proof round.
- **One targeted rerun for what matters.** A failed rule, or an accepted design item that changes a core rule, gets one scoped rerun inside step 9, on the smallest input that exercises it. The core rules: the delivery and e2e gates, versions and Changes Log rows, the hand-offs between the skills, the review passes, and the use-case trace. The rerun's result is final for this plan: a pass closes the item, and a failure goes to the README Known gaps with its evidence.
- **Everything else is an accepted limit.** Any other design item is decided by the user and applied without a rerun, or recorded in the README Known gaps with its reason. So is each rule scored not exercised.
- **Then the plan is Done.** Mark UNIFIER Status row 9, the § Step 9 heading and the Done when table. Later findings come from real projects: log them, and fix them in batches with the checkers as regression tests. The LLD from-code and hybrid directions and the fixture backlog are a separate plan, started only if the user wants them.

The tradeoff: some edge cases stay unproven. They are recorded as known gaps rather than chased round after round.

## Stages

| Stage | What | Status |
|---|---|---|
| 0 | Setup, in this order. (a) Close the step 8 records: the six step 8 commits, the merge into main and the user's push, read from `git log`, in UNIFIER (Status row 8, § Step 8 Commits, the Git paragraph, the Log) and in `step8-plan.md` stage 5. In step 8 the permission check blocked this edit as "Git Destructive", so ask the user before the first try, and if it is blocked again, leave it to the user. (b) `diff_runs.py` on the step 7 and step 8 outputs, as a report: the S3 reruns `-s7` and `-s8`, and the chains `run-2026-10-07-s7` and `run-2026-10-07-s8`. (c) D1 and D2 to the user, with the exact texts below; apply what is accepted, then the checks. (d) Build the run inputs and plants T1, T4 and T5 in `SP\s9\`, record each in `SP\s9\plants.md`, and hash the repository into `SP\s9\repo-state-before.txt` (skills frozen until the runs end). Stop for the user's go, and ask whether to run the optional C2 and C4 | (a) and (c) done at the short close-out (D1 A and D2 A applied); (b) and (d) not run |
| 1 | Runs, one background agent each; stop and report after each. S3 and C1 start in parallel. After C1: plant T3 and run C2 (optional), then C3. C4 (optional) any time after D1 is applied | Not run (short close-out) |
| 2 | Verify each claim against the files, not the agents' reports; run every checker; `diff_runs.py` against the step 8 outputs; fill the scorecard below with file:line evidence | Not run (short close-out) |
| 3 | Triage the runs' findings and unclear-text notes, read-only, one agent per skill: M and S applied, D to the user. Then apply § Exit rule: one targeted rerun inside step 9 for a failed rule or a core-rule design item; everything else applied or recorded in the README Known gaps | Not run (short close-out) |
| 4 | Save: S3 as `scenarios/pre-brd-to-brd/rerun-<date>-s9/`; C1 to C3 as `chain/run-<date>-s9/` (evidence, not the baseline); C4 next to them as `chain/run-<date>-s9-brd-probe/`; reports and the plant record in `notes/step9-runs/`; the fixture README rows; README Known gaps; the Band files if a skill changed (as `step8-band/band-audit.md` did) | Not run (short close-out) |
| 5 | Close the records (UNIFIER Status row 9, § Step 9, Log; this file) and, under § Exit rule, mark the plan Done (UNIFIER's Done when table). Commits on the user's word: one per changed skill, `test:` for `_fixtures/`, `docs:` for README.md and UNIFIER-ENHANCEMENTS.md. Merge into main on the user's word (commit-tree, update-ref, `git switch main`); the user pushes | Not run (short close-out) |

## Design questions (stage 0c, for the user)

### D1. brd-unifier takes a business review's hand-off again
**Decision (2026-10-08):** A, applied at the close-out without a rerun, with the root README line and two Band lines.

sdd-unifier now checks whether an earlier update took the review (8-S3a). brd-unifier's "update the todo" row (SKILL.md step 10) has no such check, so a repeated hand-off reruns the consistency check (a full run and up to two scoped reruns) and can raise findings unrelated to the review. The step 8 triage listed it for step 9 (`step8-triage/brd.md`, "Ripple not taken").
- **Recommendation A: mirror 8-S3a.**
  - brd-unifier/SKILL.md, old:
    `hand-off) | Apply any `Decided - pending application` items first (`delivery-chunks.md` § Step 1), then the confirmed decisions,`
  - New:
    `hand-off) | For a business review hand-off, first check whether an earlier update took this review: a Changes Log row, or a Business review register entry in `decision-log.md`, newer than the review's own Changes Log row, that records its hand-off. If one did and the review has no row after it, the hand-off is already taken: say so with that version, apply any `Decided - pending application` items, and change nothing else; a new consistency run for the review runs only when the user asks for one. If the review has rows after it, what follows covers those rows only. Otherwise, apply any `Decided - pending application` items first (`delivery-chunks.md` § Step 1), then the confirmed decisions,`
  - Root README, old: `` `sdd-unifier` takes a review's hand-off once ``. New: `` `brd-unifier` and `sdd-unifier` take a review's hand-off once ``.
  - Then search brd-unifier/README.md and `delivery-chunks.md` for a line that says a hand-off always reruns the check. The Band team guidelines (TM-2) and the business analyst file follow at the Band resync.
- **B:** keep the rerun, and say in the row that a repeat reruns the consistency check. One sentence, but the cost and the unrelated findings stay.
- **C:** no change.
- **Tradeoff:** A makes the BRD behave like the SDD and saves a full consistency run per repeat. The cost is one more check to get right, and a repeat no longer re-validates the BRD unless the user asks.
- **Proof:** the optional C4.

### D2. SDD §11.4 Metrics and Dashboards have no LLD home
**Decision (2026-10-08):** A, applied at the close-out without a rerun, with the root README row.

The chunk 07 row of `sdd-to-lld.md` sends SDD chunk 07 to `09-cross-cutting.md`, which has §12.7 Logging and §12.8 Tracing but no metrics or dashboards section. LLD 10 §13.3 Metrics and §13.6 Dashboards are reached only from a `13x` Observability section. After 8-L2, §11.4 Alerting goes to 10 §13.7. So a change to the platform metric or dashboard defaults reaches no LLD section, and a refresh does not recheck one. The step 8 triage left this open when the user chose L2 B without A's chunk 07 part (`step8-triage/lld.md`).
- **Recommendation A: extend the chunk 07 row.**
  - lld-unifier/sdd-to-lld.md, old: `| 07 Cross-Cutting Concerns | `09-cross-cutting.md` (entire chunk) |`
  - New: `| 07 Cross-Cutting Concerns | `09-cross-cutting.md` (entire chunk) + `10-operations.md` § 13.3 Metrics and § 13.6 Dashboards (from §11.4) |`
  - lld-unifier/sdd-to-lld.md, old: `concrete index strategy in `05-data-model.md` § 8.4. |`
  - New: `concrete index strategy in `05-data-model.md` § 8.4. §11.4 Metrics and Dashboards are referenced: 10 § 13.3 and § 13.6 add only the metrics and dashboards that implement them (reference + delta); §11.4 Alerting follows the alerts row. |`
  - Root README, old: `| 07 §11 Cross-cutting | 09 §12 (all of it); 05 §8.4 | Defaults become concrete configuration |`
  - New: `| 07 §11 Cross-cutting | 09 §12 (all of it); 05 §8.4; 10 §13.3 and §13.6 (§11.4 Metrics and Dashboards) | Defaults become concrete configuration; metrics and dashboards are referenced with their implementation delta |`
- **B:** a separate mapping row for §11.4 Metrics and Dashboards. The same effect, with one more row to keep in step.
- **C:** no change. The delta reviewer keeps catching what the mapping misses.
- **Tradeoff:** A is three edits, and makes a refresh recheck 10 §13.3 and §13.6 when §11.4 changes. C costs nothing now, but leaves the gap step 8 found.
- **Proof:** C3, only when C1 request 1 includes part (c).

Assert that each old string occurs once, and run the checks after applying (handoff, Checks).

## Rules for every run

The step 8 rules hold (`step8-plan.md` § Rules for every run):
- A background general-purpose agent reads the skill from disk (`C:\Users\negat\.claude\skills\<skill>\SKILL.md` and the reference files it names), not through the Skill tool.
- It writes only in its run folder under `SP\s9\`, never in the skills repository. It reads nothing under `_fixtures/` and no other run.
- It works without the user. Where the skill asks the user, it applies the run's answer policy and records the question, its batch and the answer.
- Review and check passes are fresh cleared-context sub-agents, as the skill says.
- The brief never states a rule the run measures.
- It returns its report as its final message (sub-agents cannot write report files): every question and answer; versions and Changes Log rows; review passes and their scopes; checks run and any deviation from the skill; each place the skill text was unclear (file:line).

Also:
- The plants T1, T4 and T5 are written into the inputs before the runs; T3 is written by the orchestrating session between C1 and C2. Plant details stay in `SP\s9\` until the runs end, then join the run report.
- The fixture LLD's `decision-log.md` (a run record, not skill output) stays in place, read-only; check it is byte-identical after C3 (L8 A).
- Back up each input before its run, and check the run's write scope against the backup afterwards.

## Runs

| Run | Input | Requests and answers | Measures |
|---|---|---|---|
| S3 | A copy of the saved pre-BRD (`scenarios/pre-brd-to-brd/run/pre-brd-clinic-reminders/`, the 25-file input of steps 7 and 8) plus plant T5; brd-unifier `chunks whole` | The test PM policy: accept recommendations; reject new items that add business behavior. Person-only questions, the key colour included, get test-fixture values with an owner named | H1, H2 (regression); 8-B1, 8-B3, 8-B4, 8-B5, 8-B6, 8-B7, 8-B8, 8-B10, 8-B11, 8-B12; 7-B9 when it occurs |
| C1 | A copy of `chain/run-2026-10-07-s8/` (SDD 1.12 with OI-60 and OI-61 `Decided - pending application` and its gate Stale on E1; LLD 1.4; the BRDs; the step 6 review tracker) plus plant T1 | 1. "Apply the decided items. Also, from the operations owner: add a §20.1 procedure for each alert that has none: the send-job give-up, a balance-invariant-check mismatch, an unknown receipt branch or API-13 BranchNotFound, an inbound feed record not applied, a waiting refund applied by the daily check, a pod that cannot reach Vault, and the availability budget burn. Page the on-call for the Vault and budget-burn alerts; the others open a ticket." Part (c), only when D2 is accepted: "And in §11.4 Dashboards: every scheduled job gets a panel with its last complete run and its read age." 2. "The business review changed this SDD", sent again for the step 6 review (step 8's S4a request 3 took it). Answer policy: accept recommendations | 8-S3b, 8-S6, 8-S4 (T1), 8-S5, 8-S2 when a mismatch is found, 7-W10 (regression), 8-S3a (request 2); the gate state C3 meets |
| C2 (optional) | C1's output plus plant T3 | "The business review changed this SDD" for the planted review; then the same request again. Answer policy: accept recommendations | 7-R1's coverage-rows branch; 8-S3a on a review not yet taken |
| C3 | LLD 1.4 with the final SDD (after C1, or after C2 when it runs), plus plant T4 | "The SDD has a new version." Answer policy: accept all, as in steps 7 and 8 | 8-L1, 8-L2, 8-L3, 8-L4, 8-L5, 8-L6, 8-L8a when the gate is shut, 8-L9 when answers are applied, the 8-S5/L7 labels, lld 15 (T4), D2 when applied |
| C4 (optional, D1 accepted) | A copy of the chain's REFUNDS BRD folder (`brd-refunds-portal/`) and the step 6 review tracker, from C1's input | "update the todo: decisions from the business review of [the tracker's Created date] ([tracker path])", sent twice | D1 |

**C1 facts behind the requests.** OI-60 and OI-61 change 13a §17.1 Metrics and Input, §11.4 Alerting (chunk 07) and §20.1.17 (chunk 16). LLD 1.4 holds TODO-39 (`04-implementation/customer-accounts.md`) and TODO-41 (10 §13.7), best guesses on OI-60 and OI-61, and TODO-42 (10 §13.7), which names the seven alerts with no §20 procedure. LLD OI-21 is Resolved, and its Resolution Log row names TODO-42. Request 1 answers all three flags, so C3 can exercise 8-L2, 8-L3 and 8-L4.

## Plants

- **T1 (C1, 8-S4): an edit made outside the skill.** Read the newest Reconciled entry of SDD 1.12 first, and pick content its revision or hash covers. In a `13x` chunk that neither request changes (13c or 13d), reword one Developer Notes sentence without changing its meaning, in text no chunk 19 claim rests on. Record nothing in the SDD: no Changes Log row, no Reconciled entry. Keep the old and new sentence in the plant record.
- **T3 (C2, 7-R1 and 8-S3a): a second business review, written after C1.** Record it as business-reviewer-unifier records a review: read its SKILL.md and copy the shapes of the step 6 review (the tracker and the SDD Changes Log row the review wrote). It has one decided and applied point, which rewords one step of a §20.1 procedure that C1 added, with the same meaning. The review bumps the SDD one minor step with its own Changes Log row and has a new Created date. It leaves no open remainder and answers no open item. If the skill keeps one tracker per project root and a second review cannot be recorded without changing what the step 6 tracker says, skip C2 and score its rules as not exercised, with the reason.
- **T4 (C3, lld 15): an LLD flag outside the mapped chunks.** In LLD 1.4's `04-implementation/notifications.md`, at the send-job give-up (line 118), add one flag in the LLD's own form: `> TODO: SDD §20 has no on-call procedure for the send-job give-up alert; best guess: check the provider and leave the message failed - verify with the §20 operations owner (TODO-43).` Index it in chunk 15 as TODO-43, and count it in the 00 Confidence Flag Summary, as an earlier update would have. C1 changes SDD chunks 07, 13a and 16, and none of them maps to `04-implementation/notifications.md`.
- **T5 (S3, 8-B10): two source parts that disagree.** In the pre-BRD input, pick a fact that `brd-unifier/sow-transformation.md` § pre-BRD (pre-brd-unifier output) to BRD maps from one pre-BRD chunk to a BRD home, and that a second pre-BRD chunk restates. Change the value in the second chunk only, and record both values.

## Scorecard (pass when)

| Rule | Run | Pass when |
|---|---|---|
| H1, H2 | S3 | As in steps 7 and 8: the hosting rule as numbered 02 constraints; the to-do register follows the template, and `check_todo.py` reports 0 |
| 8-B1 | S3 | Each rejected item reads `Rejected`, with the reason recorded as the user's own answer (typed through Other), and its content stays out of the BRD |
| 8-B3 | S3 | A pending dependency, or an unconfirmed assumption, whose marker asks its own question (for an assumption: whether it holds) has one `Assumption to validate` row; one whose marker asks something else has that row plus an `Open question` row |
| 8-B4 | S3 | When a check finds a rule restated outside its home, the home wins and the copy becomes a link; when it finds a statement that settles an open question with no decision record, the open question wins. Not exercised when neither occurs |
| 8-B5 | S3 | A correction found by or after the third run that changes only chunk 14 or a companion record is applied at once as `Corrected`, with § Verification before presenting rerun on chunk 14; one that changes chunks 00-13 waits as `Decided - pending application: TD-NN` |
| 8-B6 | S3 | An unstarted mockup row reads `Pending gate`, and its decisions cell names the blocking item; `Blocked by TD-NN` appears only on a started row |
| 8-B7 | S3 | A dependency needed before the build of a use case is P1; one needed before BAT sign-off or go-live is P2 |
| 8-B8 | S3 | Without a yes to the Mermaid CLI, the run uses the line-by-line check |
| 8-B10 | S3 | T5's BRD home holds one proposal marker with the mapped part's value that names the other part and its value; neither value is taken silently |
| 8-B11 | S3 | The project name is not asked, because the pre-BRD states it |
| 8-B12 | S3 | Each marker asks one question, and no to-do row holds two |
| 7-B9 | S3 | A Reviewer Note whose choice is needed to finish the BRD becomes a later open item with its raised-from label. Not exercised when no such note is recorded |
| 8-S3b | C1 request 1 | One delta review is the update's baseline: its scope includes the chunks OI-60 and OI-61 changed, it checks their applied text against the decisions, and no `application check` rows are written |
| 8-S6 | C1 request 1 | OI-60 and OI-61 each get a `decision-log.md` entry when they are applied |
| 7-W10 | C1 request 1 | The §20 instruction is an Action entry with its `Rule home:` link (regression) |
| 8-S4 | C1 | T1 is caught by the E4 check. When its passage is found, it is named in the update's Changes Log row as an edit no earlier row records, its chunk is listed after `Chunks:`, and the handoff names it; when it is not found, the handoff says so |
| 8-S5 | C1, C2, C3 | Every new dated review row carries the document version: `[YYYY-MM-DD] delta: chunk NN (vX.X)`, `[YYYY-MM-DD] application check: OI-NN (vX.X)`; an LLD per-service file by its name; earlier rows keep their labels |
| 8-S2 | C1 | Behind the Stale mark, chunk 19 is not regenerated: with no mismatch, its body and version are kept; a fix gives it the update's version and lists it after `Chunks:`. Not exercised when the gate check does not reach chunk 19 |
| 8-S3a | C1 request 2; C2 | The repeated hand-off is answered as already taken, with the version that took it: pending items applied if any, the Child LLDs check run, nothing else changed (no bump, no Changes Log row, no delta review) |
| 7-R1 | C2 | When the hand-off's delta review raises nothing, it adds only coverage rows and keeps the review's version (no bump of its own); when it raises an item, it bumps with chunk 18 listed. The rows-alone branch is exercised only in the first case |
| 8-L1 | C3 | For each mapping row whose SDD source changed (07 §11.4, 13a, 16 §20), every destination is compared with the whole source |
| 8-L2 | C3 | 10 §13.7 has one row per SDD alert, with the metric and threshold that implement its SDD condition (OI-61's new threshold included), a Source link to the place that raises it, and an Action that links its §20 procedure, or a `> TODO:` when §20 has none |
| 8-L3 | C3 | OI-21 stays Resolved and gets a `Settled by SDD vX.X` row that names the removed TODO-42 and links the §20.1 procedures. Not exercised when TODO-42 is only narrowed |
| 8-L4 | C3 | TODO-39 and TODO-41 are removed, and the body states the applied SDD text with links. Any SDD item still `Decided - pending application` at C3 gives a `> TODO:` with the decided option as its best guess, while the body follows the SDD text |
| 8-L5 | C3 | The LLD's Child LLDs row shows the new SDD version, and sdd-unifier's out-of-date note is gone |
| 8-L6 | C3 | Chunk 01's `[SDD 1.12]` label shows the new version, and that alone neither bumps chunk 01 nor lists it |
| 8-L8a | C3 | A `Locked` or `Stale` SDD gate does not stop the refresh, and 16 §19.1 and the handoff name its state. Not exercised when the gate is `Open - Up to date` |
| 8-L9 | C3 | An answer applied in the same update brings other text in line wherever it sits; the application check finds no stale wording. Not exercised when no answer is applied |
| lld 15 | C3 | T4's TODO-43 is removed or narrowed, and `04-implementation/notifications.md` is listed, though no changed SDD chunk maps to it |
| D2 | C3 | When D2 A is applied and part (c) ran, 10 §13.6 (and §13.3 when it applies) states the new §11.4 default by link, with only its implementation delta |
| D1 | C4 | The repeated hand-off (and the first one, when the BRD's records show step 6 took the review) is answered as already taken: no consistency run, no bump, nothing changed but pending items |

A rule with no triggering case in a run is scored "not exercised", with the reason.

## Results so far

Not run: the user chose a short close-out (2026-10-08). Checks after it: references 262 with 0 problems, README check 0.

## Effort

- **Agent time, about 7 to 9 h:** S3 up to 3.5 h; C1 about 2 h; C2 about 1 h (optional); C3 about 1.5 h; C4 about 1 h (optional).
- **Wall clock, about 5 h:** S3 runs parallel to C1, then C2 and C3.
- **Verification, triage and records:** about 2 to 3 h.
- **A targeted rerun under the exit rule:** about 1 h for an SDD or LLD request, up to 3.5 h for S3.
