# Run notes: Task 7.2, Pre-SDD fixture run (run-2026-10-27-psdd)

Runner: one unattended run of `pre-sdd-unifier full prompt chunks` on REFUNDS v1.5 and LOYALTY v1.7 under the test-run policy, with the skill read from WT by path (never the Skill tool), the CLI `node WT\pre-sdd-unifier\studio\cli.mjs`, writes only inside the run folder (temp files under TOOLS\psdd-run), no git, no browser. Results hold **as of 2026-10-27 (UTC)**. A recompute after 2027-12-31 reads G3 `Blocked`, because EXC-01 expires and no longer lifts `OPEN-SEC-01.1`.

## Outcome

- Pre-SDD `./pre-sdd-refunds-platform/`, version 1.0, chunks mode; gate label **G3 Approved with conditions**, G3 `Approved with conditions`, SDD authorized.
- Chosen option OPT-01 (one primary region with a pilot-light recovery region); DR per scope: region Pilot Light (asynchronous replication), az local HA (asynchronous); topology regional; no conflict.
- Engine counts: 24 Open, 0 Estimated, 72 Confirmed, 2 N/A.
- COND-01 (CardPay Ltd written confirmation; Refunds and Loyalty Product Owner, 2026-12-15). EXC-01 on SEC-01.1, granted by the person `Product Owner (fixture owner)` under ruling R23, expires 2027-12-31, review 2027-03-31.
- Review: an `Agent` dispatch (general-purpose), 2 passes of 3 (baseline, one scoped application pass); 13 items: 9 Accepted - applied, OI-04 and OI-09 Decided - pending application, OI-05 Rejected (No change, policy), OI-06 Open.
- Board: E2E Architect `Done v1.0`; HR-001 to HR-005 to the Product manager (`Open`); HR-006 hand-off to the Software Architect (`Later`).
- Pre-G3 copy: `./_snapshots/pre-sdd-refunds-platform.pre-g3/` (17:21Z, identical to the folder at that moment, not written since).

## Timeline (UTC)

| Time | Step |
|---|---|
| 16:19 | Read run-brief.md, fixture-answers.md, phase-7-context.md; SKILL.md and the rule files from WT by path |
| 16:21 | `node --version` v24.22.1; `cli.mjs --version` engine 3.0.0, skill 1.0.0 |
| 16:22 | `cli.mjs new` (78 Open, 2 Estimated; label Blocked) |
| 16:24 | Board created (Run mode: solo, only the E2E Architect row written); master written |
| 16:27 | `set-policy` by the person `Product Owner (fixture owner)` (accepted) |
| 16:27 to 16:32 | Pre-fill: entries added; 62-op pre-fill and proposals (59 Open, 36 Estimated) |
| 16:33 to 16:37 | Stage 1: four batches; owners; QD-01 to QD-04; HR-001 to HR-003; pointer stage 2 |
| 16:38 to 16:40 | Stage 2: HDR to ECO; G0 met after HDR; G1 met after ECO |
| 16:41 | G1 review stop passed by the policy; pointer stage 3; compute |
| 16:42 to 16:43 | Stage 3: options, proposed scores, fixture costs, horizon, weights, score and cost confirms; G2 `blocker` (OPEN-SEC-01.1, DT-15-BLOCK) |
| 16:44 | G2 review stop passed by the policy; stage 4: decide (one refused patch, then OPT-01); EXC-01 (R23); G2 `shortlist`, label G2 |
| 16:45 to 16:52 | Write-up: compute; chunks 00 to 05, 07, 09 to 12; master; decision-log.md |
| 16:52 to 17:08 | Review pass 1 (Agent): chunk 13 with OI-01 to OI-11 |
| 17:10 to 17:12 | Accept loop: OI-09 patch refused (protected entries); OI-01 applied and costs and scores re-confirmed by the fixture owner; text items applied |
| 17:13 to 17:19 | Review pass 2 (application pass, Agent): OI-12, OI-13; both applied |
| 17:21 | G3 stop: compute, board row, pre-G3 copy; checklist ticks; COND-01; ten stand-in signatures (17:21:33Z to 17:21:42Z); G3 Approved with conditions |
| 17:22 to 17:23 | Chunks 11, 12, 00 and the master rewritten; board Done v1.0 and HR-006 (Later); sign-off record; validate and checkers |

## Gate results (engine)

| Point | G0 | G1 | G2 | G3 | Label |
|---|---|---|---|---|---|
| After `new` | not met | not met | blocker | Blocked | Blocked |
| End of stage 2 | met | met | blocker (OPEN-SEC-01.1, DT-15-BLOCK) | Blocked | Blocked |
| After EXC-01 | met | met | shortlist | Not signed | G2 |
| After the tenth signature | met | met | shortlist | Approved with conditions | G3 Approved with conditions |

## Checker outputs (run from WT, PYTHONIOENCODING=utf-8)

```
> node pre-sdd-unifier/studio/cli.mjs validate RUN/pre-sdd-refunds-platform/studio/project-state.json
PASS kind: a Pre-SDD 3.0 project state
PASS state gate: it reads cleanly
PASS state schema: matches schema/project-state.schema.json
PASS state compute: gate G3 Approved with conditions, authorized to start the SDD
(exit 0)

> py -3 -B _fixtures/checkers/check_status_board.py RUN
0 problems
(exit 0)

> py -3 -B _fixtures/checkers/check_presdd.py RUN/pre-sdd-refunds-platform --cli pre-sdd-unifier/studio/cli.mjs
first run (17:23:03Z): 12-sdd-handoff-guide.md: 12.1 Gate reads "G3 Approved with conditions - G3: Approved with conditions - SDD authorized: Yes", expected "G3 Approved with conditions" (the engine's gate label, as the master shows it)
1 problems (exit 1)
after rewriting the 12.1 Gate row to the label (17:23:23Z): 0 problems (exit 0)
```

## Skill and engine problems found

1. **The chosen option's reason has no home** (worst for the fixture's expectations, low risk). SKILL.md:251 says each decision is written with `decide` (`topology`, `dr`, `reason`, `option`), and options-and-economics.md:121 says to "Record, with the choice, ... the condition that would reverse the decision"; but the engine (engine-and-studio.md:241) takes `reason` only with an override. `decide` with `option: OPT-01` and a reason was refused whole: "There is no override to give a reason for; give the reason together with a topology or DR override." (exit 2). I sent `decide` with the option only, and recorded the reason in decision-log.md and ADR-DR-001. fixture-answers.md § 11 expected the reason "recorded with the decision".
2. **The accept loop cannot apply a policy-accepted wording fix on a Confirmed entry.** SKILL.md:279 and review-and-open-items.md:68 say an accepted answer's value change goes into the state "under the decider's name (or the policy's label)", but register-and-entries.md:215 protects every Confirmed value from the policy, even a label. OI-09's patch (BUS-02.2 value, CAP-07.2, REL-01.1, REL-01.2 labels) was refused: "BUS-02.2 is protected (Confirmed, or answered by a person), so only a person may change it ..." I did not change the actor; OI-09 stays `Decided - pending application`. The reviewer brief does not tell the reviewer that its Recommended Answer must be one the decider can apply.
3. **A Recommended Answer that no op can apply.** OI-06 recommends changing `unknowns[QD-02].due`, but register-and-entries.md:234 says no op changes an unknown once added; the due date is also a fact the policy may not give. The item stays `Open`. review-and-open-items.md:56 lets the reviewer recommend a state change without checking that an op exists for it.
4. **Lock-list gap in the engine's landing map** (OI-04). `LANDINGS` (studio/src/engine.js:204) gives no landing to DAT-01 (store kind), INT-03 (partner SLAs), CAP-08 (latency measurement point) or REL-10 (data correctness), while handoff-guide.md (§ What is left to the SDD) and G3-05 treat them as Pre-SDD answers. Not fixable in a run (the skill never edits the engine); `Decided - pending application`.
5. **Two readings of the chunk 12 gate row.** chunks/12-sdd-handoff-guide.md:25 says `| Gate | [the engine's gate label] |`, while its comment at :19 and handoff-guide.md:32 say "The gate line reads exactly as the master's" (the master's Gate line holds label, G3 status and authorization). I wrote the full master line; check_presdd.py wants the label; I rewrote the row to the label after signing (a gate line, bumps nothing). The pre-G3 copy keeps the first form (`G2 - G3: Not signed - SDD authorized: No`) in its § 12.1.
6. **The Option shape text the fixture gave contradicts the engine shape.** fixture-answers.md § 10 gives each option's data as "synchronous inside the primary region", while the engine (REL-04.2 = 5 s) gives asynchronous for scope az; the engine does not check the free-text `data` part (options-and-economics.md:23), so only the reviewer caught it (OI-01). Applying it with `set-option` returned both options' confirmed costs and scores to `Estimated`, so the fixture owner confirmed them again.
7. **The gate label of a new Pre-SDD is `Blocked`, never `Draft`.** gates-and-signoff.md:45 puts `Blocked` (G3 Blocked) before `Draft` (:48); the seven default hard rows start `Open`, so `new` already reads `Blocked`. `Draft` is unreachable while any hard entry is Open; chunks/pre-sdd-master.md lists it as a value.
8. **Engine presentation.** The locked-items and register fragments print CAP-02.1 as `0.22916666666666669 req/s` while CALC-03 prints `0.2292 req/s`; the TCO reads "currency units" though ECO-02.1 states EUR; the Inputs column of 04-calculations.md lists DAT-01.1 for CALC-10 to CALC-12 although the derivation source reads "Derived: CALC-10 from CAP-01, DAT-02", and INT-08.1 for CALC-06 and CALC-07 where the overhead factor sits on CAP-06.
9. **Orphan diagram.** `compute` writes `diagrams/security.mmd`, which no chunk template places (SKILL.md:260 and chunks/05-target-shape.md name four diagrams).
10. **CAP-03 feeds no calculation** (OI-03): peak simultaneously active users are a stage 1 row, but no CALC reads them, so the capacity calculations size only the primary CAP-01 entry.

## Fixture answers used, fallbacks, and deviations

- Used: every answer in fixture-answers.md §§ 1 to 13 that applied to an entry still `Open` after the pre-fill: §1 policy (person actor accepted); §2 intake; §3 HDR-07, HDR-08, HDR-09, HDR-10, overlay off; §4 the REL-05/03/04 layout (REL-05.2, REL-03.2, REL-04.2 added; no entry removed); §6 BUS-08, SEC-04, DAT-04 with factors, DAT-06, SEC-01 left Open (Legal Counsel, 2026-12-15); §7 HDR-01 to HDR-06, CAP-01.1 and .2 (labels swapped), CAP-03, CAP-04 kept, CAP-06 with factors, CAP-12 N/A, DAT-01.2 storeKind, DAT-02 factors and derived value, DAT-05.1 and .2, INT-08, ECO-01 with budgetPressure, ECO-02, ECO-03, ECO-05 N/A; §8 owner names and due dates; §9 EXC-01; §10 costs, horizon 36, weights, score confirms, no exclusion; §11 decisions; §12 ticks, COND-01, stand-in signs; §13 later.
- Not used because the pre-fill already held a BRD value: BUS-07.1 (pre-filled from REFUNDS 02 Constraint 2 and the REFUNDS 04 and LOYALTY 04 Out of Scope lists, kept by the policy's group confirm); DAT-01.1 and DAT-03.1 "if pre-filled, keep" (kept by the policy); DAT-01.1 storeKind pre-filled `relational` from REFUNDS 12 (TI-02), equal to the fixture value.
- Fallbacks needed: **none**. No fallback proposal (the skill proposed every REL-01 and CAP-07 entry), no fallback score (the skill proposed all 16), no entry removed, no option added or removed.
- Policy choices without a source: CAP-07.1, CAP-07.2 (2000 ms), REL-01.1, REL-01.2 (99.9 %). CALC-13 (2,592 s) confirms REL-01.1 stays inside REFUNDS/NFR-02.

## Runner notes (not skill problems)

- Patch file-name stamps: several names carry a stamp ahead of or behind the time the patch was applied (names were chosen before applying); the state history holds the real times.
- Two refused patches (stage 4 decide with a reason; OI-09 policy wording) changed nothing and were moved out of `studio/patches/` to TOOLS\psdd-run.
- I missed the cost confirms in the first stage 3 fixture patch and sent them in a second fixture patch (same answer).
- The master's progress table and the board row were updated at each stage end and stop, not after every single batch (the batches of one group were applied seconds apart).
- The chunks were written by a generator script (TOOLS\psdd-run\gen-chunks.js) that pastes the fragments and diagrams unchanged; both review passes found every fragment region equal to its file byte for byte.
- Heredocs with apostrophes failed in the Bash tool; patch and script files were written with the Write tool instead.

## Files written (all inside the run folder)

`unifier-status.md`; `run-transcript.md`; `run-notes.md`; `pre-sdd-refunds-platform/` (master, chunks 00 to 05, 07, 09 to 13, `decision-log.md`, `studio/` with `project-state.json`, `patches/` (52 applied patches), `model.json`, `blueprint.json`, `blueprint.yaml`, `fragments/`, `diagrams/`); `_snapshots/pre-sdd-refunds-platform.pre-g3/`.
