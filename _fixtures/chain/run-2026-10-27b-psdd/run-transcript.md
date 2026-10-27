# Run transcript: Pre-SDD Refunds Platform (run-2026-10-27b-psdd)

Unattended run of `pre-sdd-unifier full prompt chunks`, request: "Run the full Pre-SDD for the Refunds Platform from its two BRDs, REFUNDS and LOYALTY, under the test-run policy in run-brief.md." No one is at the keyboard: each question is written here as the skill asks it, followed by the answer the policy or the fixture file gives and who answered. Every answer was applied through `derive --apply` with the answering actor; the patch file name is given per batch (folder `pre-sdd-refunds-platform/studio/patches/`). All times UTC, 2026-10-27.

Actors: the skill `agent pre-sdd-unifier`; the answer policy `Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)`; the fixture owner `Fixture: Product Owner stand-in (test-run policy)`; the person `Product Owner (fixture owner)` (set-policy and the one exception, ruling R23).

## Step 1: arguments and resume (18:20)

- Arguments `full prompt chunks`: mode full, input path prompt, output chunks. Neither the input path prompt nor the output mode prompt is asked.
- Resume check: no `./pre-sdd-*` folder in the project root. New Pre-SDD (GENERATE).

## Step 2: status board (18:22)

- No `unifier-status.md`; this is the first chain skill to run here. Board created at 18:25 from the SKILL.md template, `Run mode: solo`, with only the E2E Architect row written.

## Step 4: start conditions and intake (18:22)

Start conditions read from the BRD files: both masters read `Generation: whole`, no part `Pending` or `In progress`. Both covers read `Status: In Review`.

**Q1. System name?** Neither BRD names the system that covers both. Options: a name you give.
Answer: `Refunds Platform` (slug `refunds-platform`). By: Fixture: Product Owner stand-in (test-run policy), fixture-answers.md § 2.

**Q2. Source BRDs?** REFUNDS = `../brd-refunds-portal/refunds-portal-brd-master.md` v1.5 (In Review), LOYALTY = `../brd-loyalty-points/loyalty-points-brd-master.md` v1.7 (In Review). Proposed keys in one line: `REFUNDS`, `LOYALTY`.
Answer: both BRDs; keys accepted. By: fixture owner, § 2.

**Q3. Neither BRD is `Approved` (both read `In Review`). Go on?** [go on / stop]
Answer: go on. By: fixture owner, § 2. Recorded in decision-log.md.

**Q4. Who answers and confirms values in this run?**
Answer: `Product Owner stand-in` (the fixture owner). By: fixture owner, § 2.

## Step 5: engine setup (18:22 to 18:26)

- `node --version`: v24.22.1. `cli.mjs --version`: engine 3.0.0, skill 1.0.0.
- 18:23:51 `cli.mjs new` with both `--brd`, `--mode full --input prompt --slug refunds-platform`: counts open 78, estimated 2; label `Draft`.
- 18:25:31 patch `set-policy` (person `Product Owner (fixture owner)`): policy `{ label: "test-run policy", stand_ins: ["Approver"] }`, accepted by the engine with the person actor. The policy may pass the G1 and G2 review stops (the brief: "continue at G1 and G2"), never the G3 sign-off stop.
- Master written from `chunks/pre-sdd-master.md`; board created.

## Step 6: pre-fill and proposals (18:28 to 18:30)

- 18:28:17 `prefill-add-entries` (agent): BUS-02.2 to .4, CAP-01.2, CAP-07.2, REL-01.2, DAT-01.2, DAT-05.2, INT-01.2 and .3, INT-03.2 and .3, each labelled as the BRDs name the journey, transaction type, workload or external system.
- 18:29:50 `prefill-values-proposals` (agent, 65 changes): BRD values with citations, evidence on the entries the BRDs do not answer, DAT-01.1 storeKind `relational` (REFUNDS 12 TI-02, shape only), and six proposals: REL-01.1 99.9 %, REL-01.2 99.9 %, REL-03.1 7200 s, REL-04.1 0 s, CAP-07.1 2000 ms, CAP-07.2 2000 ms. Counts after: open 58, estimated 34.

## Step 7: stage 1, discovery

### Batch 1 (18:30)

**1. HDR-07.1 Change type** (Open; no BRD states it; evidence REFUNDS 01: paper and phone today). Options: greenfield / brownfield / mixed.
Answer: `greenfield`. By: fixture owner, § 3.

**2. HDR-08.1 Intended target** (Open). Options: onprem / cloud / hybrid / undecided.
Answer: `cloud`, kind stays `target`, evidence "provider-hosted public cloud; no provider is a hard constraint". By: fixture owner, § 3.

**3. BUS-05.1 Launch date, hard deadlines, change windows** (Open; evidence REFUNDS 04 pilot, LOYALTY 04 all branches after BAT).
Answer: not known yet; left Open (fixture-answers.md § 7, "Left Open on purpose"). Owner and due asked at the end of stage 1.

**4. CAP-01.1 Points movement, transactions/day** (Open; fact; CALC-01 and CALC-02 read TBD).
Answer: `2000`. By: fixture owner, § 7.

Patch `20261027T183031Z-stage1-batch1.json` (fixture). Engine derived CAP-02.1 (CALC-03).

### Batch 2 (18:30)

**1. CAP-01.2 Refund request, transactions/day** (Open; evidence REFUNDS 02 Facts, about 1,200 a month).
Answer: `40`. By: fixture owner, § 7.

**2. CAP-03.1 Peak simultaneously active users** (Open; fact).
Answer: `300 peak simultaneously active users (customers, members and branch managers)`. By: fixture owner, § 7.

**3. CAP-04.1 Peak factor: keep or change?** Pre-filled `3` ×, window `3 weeks of seasonal sales` (BRD: REFUNDS/NFR-03).
Answer: keep. By: fixture owner (a fact), § 7.

**4. CAP-07.1 P99 latency, Refunds Portal everyday actions** (Open). Recommended: take the proposal 2000 ms. Why: REFUNDS/NFR-05 asks for no wait on everyday actions but leaves the seconds open.
Answer: accept the proposal. By: Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), § 5 (no fixture value).

Patches `20261027T183051Z-stage1-batch2-fixture.json` (fixture), `20261027T183052Z-stage1-batch2-policy.json` (policy).

### Batch 3 (18:31)

**1. CAP-07.2 P99 latency, member points screens** (Open). Recommended: the proposal 2000 ms. Why: LOYALTY 10 gives no measure; one interactive target for the platform; no source states the value.
Answer: accept the proposal. By: policy, § 5.

**2. REL-01.1 Availability, Refunds Portal journeys** (Open). Recommended: the proposal 99.9 %. Why: REFUNDS/NFR-02 allows 2 hours of disruption a month, maintenance included.
Answer: accept the proposal. By: policy, § 5.

**3. REL-01.2 Availability, member points screens** (Open). Recommended: the proposal 99.9 %. Why: LOYALTY/NFR-04 asks for any time of day but gives no minutes; no source states the value.
Answer: accept the proposal. By: policy, § 5.

**4. REL-03.1 RTO** (Open; proposal 7200 s, reason REFUNDS/NFR-02).
Answer: label `Whole platform, region loss`, scope `region`, value `14400` s. The fixture value replaces the proposal. By: fixture owner, § 4.

Patches `20261027T183103Z-stage1-batch3-policy.json`, `20261027T183104Z-stage1-batch3-fixture.json`.

### Batch 4 (18:31)

**1. REL-03, a second RTO entry for the zone scope?**
Answer: yes, `Whole platform, zone loss`, scope `az`, `300` s. By: fixture owner, § 4. The entry was added first (`20261027T183115Z-stage1-batch4-add.json`, REL-03.2 and REL-04.2), then answered.

**2. REL-04.1 RPO** (Open; proposal 0 s, reason REFUNDS/NFR-01).
Answer: label `All refund and points data, region loss`, scope `region`, `900` s. The fixture value replaces the proposal. By: fixture owner, § 4.

**3. REL-04.2 RPO, zone scope**.
Answer: label `All refund and points data, zone loss`, scope `az`, `5` s. By: fixture owner, § 4.

**4. REL-05.1 Failure scope** (Open; no BRD names one). Options: host / az / site / region / provider / cyber.
Answer: label `Loss of a whole region`, value `region`. By: fixture owner, § 4.

Patch `20261027T183126Z-stage1-batch4.json`. The engine added `dr` to OPS-04.1 (a REL-05 entry holds `region`).

### Batch 5 (18:31 to 18:32)

**1. REL-05, a second failure scope?**
Answer: `Loss of one zone`, value `az`. By: fixture owner, § 4. Added with `20261027T183136Z-stage1-batch5-add.json` (REL-05.2), then answered.

**2. DAT-02.1 New data per day** (Open; derived from CALC-10 once its inputs are given). Factors storedKB, initialGB, retentionDays?
Answer: `storedKB` 8, `initialGB` 1, `retentionDays` 3653. By: fixture owner, § 7. The engine then derived DAT-02.1 = 0.016 GB/day (CALC-10); keep the derived value: confirmed by the fixture owner (a fact; never the policy).

**3. ECO-01.1 Budget envelope** (Open; fact).
Answer: `One-time budget 250,000 EUR; run cost up to 12,000 EUR a month`, factor `budgetPressure` = `balanced`. By: fixture owner, § 7.

Patches `20261027T183146Z-stage1-batch5.json`, and `20261027T183204Z-stage1-owners-unknowns.json` (the DAT-02.1 confirm, the stage 1 owner, the unknowns).

### Stage 1 owners and unknowns (18:32)

**Owner name and due date for the stage 1 entries still Open:** BUS-05.1 (owner code B).
Answer: `Refunds and Loyalty Product Owner`, due `2026-11-20`. By: fixture owner, § 8.

**Unknowns, each with its owner and due date** (asked as one batch; owner of the entry it is about, due 2026-11-20, § 8):
- QD-01 (REL-01.2): minutes per month the points screens may be unavailable (LOYALTY/NFR-04). Owner Refunds and Loyalty Product Owner.
- QD-02 (CAP-07.1): seconds for an everyday portal action (REFUNDS/NFR-05). Owner Refunds and Loyalty Product Owner.
- QD-03 (BUS-05.1): launch dates, deadlines and change windows. Owner Refunds and Loyalty Product Owner.
- QD-04 (INT-03.1): CardPay Ltd's confirmations. Owner CardPay Ltd.
- QD-05 (INT-03.2): the Retail IT team's agreement to the receipt lookup and purchase feed. Owner Retail IT team.
By: fixture owner (owner names and due dates), recorded with `add-unknown`.

Pointer: `20261027T183214Z-pointer-stage2-HDR.json` (agent): stage 2, group HDR.

### Discovery summary (end of stage 1, 18:32 to 18:36)

- Classification: greenfield (HDR-07.1) crossed with cloud (HDR-08.1), path GF-CL.
- Business sponsor and lead architect: not given by the BRDs; asked at the start of stage 2 (HDR-02, HDR-04).
- Stage 1 values by status (engine, after the stage 1 patches): open 43, estimated 34, confirmed 18, na 0. BUS-05.1 is the only stage 1 entry still Open (Refunds and Loyalty Product Owner, 2026-11-20).
- Unknowns QD-01 to QD-05 as listed above.
- Requests raised on the board for the BRD owners (Product manager): HR-001 (REFUNDS NFR-05, NFR-06, NFR-07) and HR-002 (LOYALTY NFR-04, NFR-03, retention), both `Open` at 18:36.
- Board row: `In progress: stage 2, group HDR`.

## Step 8: stage 2, the register (18:36 to 18:39)

### Group HDR (18:36)

**1 to 6. HDR-01.1 to HDR-06.1** (Open; facts only a person gives; the BRDs name no sponsor, product owner, lead architect, review authority or budget owner; HDR-02.1 evidence REFUNDS 00).
Answers: `Refunds Platform`; `Head of Retail`; `Refunds and Loyalty Product Owner`; `Lead Architect, Retail IT`; `Architecture Review Board`; `Finance Director`. By: fixture owner, § 7.

**7. HDR-09.1 Source platforms; 8. HDR-10.1 Migration direction** (Open).
Answers: `None: there is no source platform; refunds are on paper and by phone today`; `none`. By: fixture owner, § 3.

**9. Migration overlay: does it apply, and the source platform?** Options: applies / does not apply.
Answer: `applies: false`. By: fixture owner, § 3 (never the policy). The state already read `applies: false`, so the engine recorded no change.

**10. Confirm all pre-filled values in group HDR?** Recommended: yes.
Answer: yes. By: policy (`confirm-group HDR`); nothing was left Estimated.

Patches `20261027T183656Z-stage2-HDR.json` (fixture), `20261027T183657Z-stage2-HDR-group-policy.json` (policy). Engine: G0 met; label `Blocked` (OPEN-BUS-08.1, OPEN-DAT-04.1, OPEN-DAT-06.1, OPEN-SEC-01.1, DT-15-BLOCK).

### Group BUS (18:37)

**1. BUS-04.1 Revenue or loss impact per outage** (Open; fact). Answer: not known; left Open. Owner and due: `Refunds and Loyalty Product Owner`, `2026-11-30` (fixture owner, § 8).
**2. BUS-08.1 Commercial and legal obligations** (Open; hard). Answer: `No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd).` By: fixture owner, § 6.
**3. Confirm all pre-filled values in group BUS?** (BUS-01.1, BUS-02.1 to .4, BUS-03.1, BUS-06.1, BUS-07.1 Estimated with BRD sources). Recommended: yes. Answer: yes. By: policy. BUS-07.1 was pre-filled from the BRDs, so the fixture value of § 6 was not used.

Patches `20261027T183710Z-stage2-BUS.json`, `20261027T183711Z-stage2-BUS-group-policy.json`.

### Group SEC (18:37)

**1. SEC-04.1 Encryption and key custody** (Open; hard). Answer: the § 6 text. By: fixture owner.
**2. Owners and due dates of the Open SEC entries** (SEC-01.1 Sec+D, SEC-03.1 Sec, SEC-06.1 Sec+Ops, SEC-08.1 B+Sec). Answer: SEC-01.1 `Legal Counsel` 2026-12-15; SEC-03.1 and SEC-06.1 `Security Lead` 2026-11-30; SEC-08.1 `Refunds and Loyalty Product Owner` 2026-11-30. By: fixture owner, § 8.
**3. Confirm all pre-filled values in group SEC?** (SEC-02.1, SEC-05.1, SEC-07.1). Answer: yes. By: policy.

Patches `20261027T183723Z-stage2-SEC.json`, `20261027T183724Z-stage2-SEC-group-policy.json`.

### Group DAT (18:37)

**1. DAT-01.2 storeKind** (Open). Answer: `relational`. By: fixture owner, § 7. DAT-01.1 storeKind was pre-filled `relational` from REFUNDS 12 TI-02, equal to the fixture value, and kept by the group confirm.
**2. DAT-04.1 Residency** (Open; hard). Answer: `yes`, primaryLocation `Within the European Union`, recoveryLocation `Within the European Union, in a second region`. By: fixture owner, § 6.
**3. DAT-05.1 and DAT-05.2 Consistency** (Open; evidence REFUNDS/NFR-01, LOYALTY/NFR-01). Answer: `strong` for both, transactionNeed `yes` on DAT-05.1. By: fixture owner, § 7.
**4. DAT-06.1 Retention** (Open; hard). Answer: the § 6 text. By: fixture owner.
**5. Owners and due dates:** DAT-07.1 `Refunds and Loyalty Product Owner`, DAT-09.1 `Data Owner, Retail Finance`, both 2026-11-30. By: fixture owner, § 8.
**6. Confirm all pre-filled values in group DAT?** (DAT-01.1, DAT-01.2, DAT-03.1 `sensitive`, DAT-08.1, the appendix factors indexFactor and copies). Answer: yes. By: policy. DAT-01.1 and DAT-03.1 were pre-filled, so the "if pre-filled, keep" answers of § 6 and § 7 applied.

Patches `20261027T183741Z-stage2-DAT.json`, `20261027T183742Z-stage2-DAT-group-policy.json`.

### Group INT (18:38)

**1. INT-08.1 Network** (Open). Answer: `public`, kind stays target. By: fixture owner, § 7.
**2. Owners and due dates:** INT-03.1 `CardPay Ltd`, INT-03.2 `Retail IT team`, INT-03.3 `MsgHub`, INT-06.1 `Lead Architect, Retail IT`, all 2026-11-30. By: fixture owner, § 8.
**3. Confirm all pre-filled values in group INT?** Answer: yes. By: policy.

Patches `20261027T183802Z-stage2-INT.json`, `20261027T183803Z-stage2-INT-group-policy.json`.

### Group CAP (18:38)

**1. CAP-06.1 Payload sizes** (Open; fact). Answer: the § 7 text, requestKB 4, responseKB 16. By: fixture owner.
**2. CAP-12.1 AI, ML or media jobs** (Open; fact). Answer: `N/A`, reason `No AI, ML or media jobs are in scope of either BRD.` By: fixture owner, § 7.
**3. Owners and due dates:** CAP-05.1 and CAP-10.1 `Refunds and Loyalty Product Owner`, 2026-11-30. By: fixture owner, § 8.
**4. Confirm all pre-filled values in group CAP?** (CAP-02.1 derived, CAP-08.1 default, CAP-09.1, CAP-11.1, the appendix factors utilization, networkOverhead, meanLatencyMs, callsPerTxn, requestFactor). Answer: yes. By: policy. No fact was left Estimated for the fixture owner's second group confirm.

Patches `20261027T183816Z-stage2-CAP.json`, `20261027T183817Z-stage2-CAP-group-policy.json`.

### Group REL (18:38)

**1. Owners and due dates:** REL-02.1, REL-07.1, REL-09.1 `Refunds and Loyalty Product Owner`, 2026-11-30. By: fixture owner, § 8.
**2. Confirm all pre-filled values in group REL?** (REL-06.1, REL-08.1, REL-10.1). Answer: yes. By: policy.

Patches `20261027T183840Z-stage2-REL.json`, `20261027T183841Z-stage2-REL-group-policy.json`.

### Group OPS (18:38)

**1. Owners and due dates:** OPS-02.1 and OPS-05.1 `Operations Lead`; OPS-03.1 and OPS-06.1 `Refunds and Loyalty Product Owner`; all 2026-11-30. By: fixture owner, § 8.
**2. Confirm all pre-filled values in group OPS?** (OPS-01.1, OPS-04.1 default, OPS-07.1, OPS-08.1). Answer: yes. By: policy.

Patches `20261027T183842Z-stage2-OPS.json`, `20261027T183843Z-stage2-OPS-group-policy.json`.

### Group ECO (18:38)

**1. ECO-02.1** (Open). Answer: `Currency EUR; operating expense preferred`. **2. ECO-03.1** (Open). Answer: `36 months`. **3. ECO-05.1** Answer: `N/A`, reason `The business states no energy or environmental footprint goal for this system.` **4. Owners and due dates:** ECO-04.1, ECO-06.1 `Refunds and Loyalty Product Owner`, 2026-11-30. By: fixture owner, § 7 and § 8.
**5. Confirm all pre-filled values in group ECO?** Nothing was left Estimated; no op sent.

Patch `20261027T183854Z-stage2-ECO.json`. Engine: counts open 23, estimated 0, confirmed 70, na 2; G0 met, G1 met; G2 `blocker` (OPEN-SEC-01.1, DT-15-BLOCK); G3 `Blocked`; label `Blocked`.

### G1 review stop (18:39)

Summary shown: counts as above; the 23 Open entries each with owner and due date; the hard Open entry SEC-01.1 (Legal Counsel, 2026-12-15); unknowns QD-01 to QD-05; stage 3 assesses the calculations, the target shape, and the options.
"Continue?" Answer: continue. By: policy (it names the G1 review stop). Pointer `20261027T183905Z-pointer-stage3.json` (agent): stage 3, group null.

## Step 9: stage 3, assess (18:39 to 18:40)

- `compute` (18:39): target shape cloud; topology primary plus independent recovery location (regional); scope region Pilot Light, asynchronous; scope az Local HA, asynchronous; data relational, strong; network public; no conflict. G2 `blocker` (OPEN-SEC-01.1, DT-15-BLOCK).
- `20261027T183933Z-stage3-options.json` (agent): OPT-01 one primary region with a pilot-light recovery region; OPT-02 one primary region with a warm-standby recovery region; shapes as fixture-answers.md § 10.
- `20261027T184002Z-stage3-proposed-scores.json` (agent): sixteen scores with reasons (OPT-01: 4, 4, 4, 4, 4, 4, 4, 3; OPT-02: 5, 3, 2, 3, 3, 4, 3, 4, in the order nfr_fit, one_time_cost, recurring_tco, delivery_time, operability, security_compliance, reversibility, uncertainty). These are the skill's own proposals; no fallback score was used.

**Costs, horizon and weights (one batch):** OPT-01 one-time and monthly cost? OPT-02? The TCO horizon in months? The criterion weights?
Answers: OPT-01 180000 and 6500; OPT-02 210000 and 9800; horizon 36; weights nfr_fit 3, one_time_cost 1, recurring_tco 2, delivery_time 1, operability 2, security_compliance 2, reversibility 1, uncertainty 1. By: fixture owner, § 10.

**Keep each proposed score?** Answer: keep all sixteen unchanged (`confirm` per option and criterion). By: fixture owner, § 10 (never the policy). Costs confirmed in the same patch.

**Exclude any option for a hard entry the engine does not check** (BUS-07.1, BUS-08.1, SEC-01.1, SEC-04.1, DAT-03.1, DAT-04.1, DAT-06.1)? Answer: none. By: fixture owner, § 10.

Patch `20261027T184003Z-stage3-costs-horizon-weights-scores.json` (fixture). `compute`: CALC-21@OPT-01 414,000 EUR, CALC-21@OPT-02 562,800 EUR, CALC-22@OPT-01 3.9231, CALC-22@OPT-02 3.5385, flags none.

### G2 review stop (18:40)

Shown: G2 `blocker` with OPEN-SEC-01.1 and DT-15-BLOCK (owner Legal Counsel; lifted only by a person's exception or a value), the DR strategy per scope, the shape without conflict, both options passing the hard checks with their TCO.
"Continue?" Answer: continue. By: policy (it names the G2 review stop). Pointer `20261027T184032Z-pointer-stage4.json`: stage 4.

## Step 10: stage 4 (18:40)

1. **Confirm:** counts estimated 0, so no group was left to confirm.
2. **Decide:** "Topology override?" Answer: none (auto). "DR override per scope?" Answer: none. "Chosen option?" Answer: OPT-01, by the stated rule (higher weighted score). By: fixture owner, § 11. Patch `20261027T184033Z-stage4-decide.json`: `decide { option: OPT-01 }`, no reason (the op takes one only with an override); the reason went to decision-log.md and ADR-DR-001.
3. **Validate:** blockers OPEN-SEC-01.1 and DT-15-BLOCK. "Grant a time-bound exception for SEC-01.1?" Answer: yes, EXC-01, reason as fixture-answers.md § 9, expires 2027-12-31, review 2027-03-31. By: person `Product Owner (fixture owner)` under ruling R23. Patch `20261027T184034Z-stage4-exception-R23.json`. Engine: G2 `shortlist`, G3 `Not signed`, label `G2`, no blocker, no conflict.

## Step 11: write-up (18:41 to 18:49)

- `compute` (18:41), then chunks 00, 01, 02, 03a to 03h, 04, 05, 07, 09, 10, 11, 12 written from the templates; every fragment and diagram pasted unchanged by a build script (TOOLS\psdd-run2\build.mjs) between its markers; chunks 06 and 08 omitted (greenfield, no overlay). Master index and progress table updated; decision-log.md written.
- Board row 18:49: `In progress: stage 4, review`.

## Step 12: review (18:49)

- 18:49 one `Agent` dispatch (general-purpose), the cleared-context reviewer, with the brief of review-and-open-items.md and the absolute paths of the chunks, the master, the project state, model.json, the fragments, the BRDs, the templates, handoff-guide.md, the op table and AGENTS.md.
- 19:04 the reviewer wrote chunk 13: 14 items OI-01 to OI-14, all Open, with the coverage record (11 rows).

### Accept loop, batches of up to four (19:05 to 19:08)

Each item was presented with its ID, title, concern, Recommended Answer and Why, and asked: **Accept recommendation** (first) / Choose option B or C / Defer / own answer.

**Batch 1: OI-01, OI-02, OI-03, OI-04.**
- OI-01 (03a points to chunk 08): Accept recommendation. By: policy. Applied as text.
- OI-02 (default source label): Recommended Answer reads `No change`; the policy takes it. Rejected, decider the policy.
- OI-03 (seasonal factor on points movements): Accept recommendation. By: policy. The unknown needs an owner and a due date, facts only a person gives: the fixture owner applied it with fixture-answers.md § 8 (owner of the entry, Refunds and Loyalty Product Owner; due 2026-11-20 for every unknown, where the recommendation read 2026-11-30). QD-06. Adjusted - applied.
- OI-04 (SEC-02.1 unkeyed NFR-04): Accept recommendation. By: policy. SEC-02.1 is Confirmed: only a person changes it, and the fixture answers hold no such change. Decided - waiting for a person.

**Batch 2: OI-05, OI-06, OI-07, OI-08.**
- OI-05 (INT-03.1 label): Accept recommendation. By: policy. Patch `20261027T190525Z-review1-OI-05-policy.json` (policy `set` label on INT-03.1) refused by the engine: "INT-03 is a fact only a person gives; an answer policy never sets, confirms or answers it." Moved out of `patches/` (TOOLS\psdd-run2\refused). The actor was not changed. Decided - waiting for a person.
- OI-06 (Peak transactions label): Accept recommendation. By: policy. Applied as text.
- OI-07 (REL-03.1 against REFUNDS/NFR-02): Accept recommendation. By: policy. Unknown QD-07 applied by the fixture owner (due 2026-11-20 per § 8); text in 05 § 5.3 and R-01 applied. Adjusted - applied.
- OI-08 (costs and scores without time): `No change`; the policy takes it. Rejected.

**Batch 3: OI-09, OI-10, OI-11, OI-12.**
- OI-09 (DT-15 wording): Accept recommendation. By: policy. Applied as text.
- OI-10 (CAP-07.2 without unknown): Accept recommendation. By: policy. Unknown QD-08 applied by the fixture owner (owner and due as recommended, which match § 8); R-06 updated. Accepted - applied.
- OI-11 (HR IDs in R-06): Accept recommendation. By: policy. Applied as text.
- OI-12 (condition in 11 § 11.2): Accept recommendation. By: policy. Applied as text.

**Batch 4: OI-13, OI-14.**
- OI-13 (BUS-07.1 and BUS-08.1 not locked): Accept recommendation. By: policy. `add-condition` is a person or fixture-owner op with owner and due date facts; fixture-answers.md § 12 gives one condition only. Decided - waiting for a person.
- OI-14 (store kind in chunk 12): Accept recommendation. By: policy. Applied as text.

Patch `20261027T190538Z-review1-OI-03-07-10-unknowns.json` (fixture): QD-06, QD-07, QD-08. `compute` 19:05; chunks rebuilt from the new fragments (build script); chunk 13 statuses, Resolution lines and Resolution Log written; decision-log.md § Clarification register written.

### Review pass 2, scoped application pass (19:10)

- SendMessage to the same reviewer (the approved reviewer dispatch, continued): check the applied answers OI-01, OI-03, OI-06, OI-07, OI-09, OI-10, OI-11, OI-12, OI-14 and what depends on them.
- 19:10 the reviewer added nine application-check rows (all "No issue found"), no new item, and one note "Out of scope, for the next review": the master's stage 4 row still read "Review passes 0 of 3". The master was rebuilt at 19:10 with "Review passes 2 of 3". Review passes used: 2 of 3.

## Step 13: G3 sign-off stop (19:10 to 19:11)

- 19:10 `compute`: G0 met, G1 met, G2 shortlist, G3 `Not signed`; problems: the ten roles to sign and the fourteen checklist lines. Board row `In progress: stage 4, G3 sign-off stop`; master Next "waiting for: the signers at the G3 stop".
- 19:10:40 pre-G3 copy: `_snapshots/pre-sdd-refunds-platform.pre-g3/`, the whole folder with `studio/`, identical to the Pre-SDD at that moment (`diff -r` empty). Not written since.

**Checklist (asked line by line with its evidence):** G3-01 to G3-08 and G3-11 to G3-14: Done. G3-09: N/A, `Greenfield (HDR-07): there is no existing estate.` G3-10: N/A, `No migration overlay (HDR-10 none).` By: fixture owner, § 12. Patch `...-g3-checklist.json`.

**Condition:** `CardPay Ltd confirms in writing that it refunds branch card purchases to the original card, before the SDD fixes the payout integration.`, owner `Refunds and Loyalty Product Owner`, due `2026-12-15`. By: fixture owner, § 12. Patch `...-g3-condition.json`. Engine after it: G3 `Not signed`, the only problems the ten roles still to sign.

**Who signs each role?** (asked once; the header rows name others for four roles.) Answer: the Approver stand-in signs every applicable role; nobody else signs; no role is marked not applicable. By: fixture owner, § 12.

**Signatures:** each role `Approved with conditions`, one patch each, 19:11:07 to 19:11:15, actor the policy's Approver stand-in, recorded `Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27)`. After the tenth: G3 `Approved with conditions`, label `G3 Approved with conditions`, authorized. No "Sign again" note.

- 19:11 `compute`; chunks 11, 12, 00 and the master rewritten from the new fragments (a signature bumps nothing); decision-log.md § Sign-off record written.

## Step 14: hand-off (19:11)

**"Next hop: SDD (Software Architect). Start now, or later?"** (Run mode: solo.)
Answer: later. By: fixture owner, § 13. HR-003 raised to the Software Architect, State `Later`, Link the master. Board row `Done v1.0`.

## Checks (19:12, from WT, PYTHONIOENCODING=utf-8)

- `cli.mjs validate .../project-state.json`: 4 PASS, exit 0.
- `check_status_board.py RUN`: 0 problems, exit 0.
- `check_presdd.py RUN/pre-sdd-refunds-platform --cli ...`: 0 problems, exit 0.
- `validate_handoff.py .../studio/blueprint.json --require-approved`: PASS, exit 0.
