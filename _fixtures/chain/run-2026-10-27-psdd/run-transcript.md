# Run transcript: Pre-SDD Refunds Platform (test-run policy)

Run of `pre-sdd-unifier full prompt chunks` on 2026-10-27 (UTC), for the request "Run the full Pre-SDD for the Refunds Platform from its two BRDs, REFUNDS and LOYALTY, under the test-run policy in run-brief.md." No one is at the keyboard: each question is written as the skill asks it, then the answer the test-run policy or the fixture file gives, with who answered. Every answer is applied through `derive --apply` with that answer's actor; the patch file is named under each batch (folder `pre-sdd-refunds-platform/studio/patches/`).

Actors:

- **Fixture owner:** `{ "type": "fixture", "name": "Product Owner stand-in" }`, recorded as `Fixture: Product Owner stand-in (test-run policy)`. Source: [fixture-answers.md](./fixture-answers.md).
- **Answer policy:** `{ "type": "policy" }`, recorded as `Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)`. Takes only the recommended option or the stated default.
- **Approver stand-in:** the policy's stand-in on `sign`, recorded as `Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27)`.
- **Person:** `{ "type": "person", "name": "Product Owner (fixture owner)" }`, for `set-policy` and the one exception (ruling R23) only.
- **The skill:** `{ "type": "agent", "name": "pre-sdd-unifier" }`, for the pre-fill, the proposals, the options and proposed scores, the pointer and the version.

---

## Arguments and resume check (step 1)

- Arguments `full prompt chunks`: mode full, input path prompt, output chunks, not light. Neither the input path prompt nor the output mode prompt is asked.
- Resume check: no `./pre-sdd-*` folder in the project root, so this is a new Pre-SDD (GENERATE).

## Status board (step 2)

- No `unifier-status.md` in the project root and no chain skill has run here: this skill creates the board from the SKILL.md template, `Run mode: solo`, and writes only the E2E Architect row.

## Start conditions and intake (step 4)

Start conditions read from the BRD files: both masters read `Generation: whole` with no part `Pending` or `In progress`; both covers read `Status: In Review`.

**Q-I1. BRD keys** (proposed in one line): "Keys: `REFUNDS` for `../brd-refunds-portal/refunds-portal-brd-master.md` v1.5 and `LOYALTY` for `../brd-loyalty-points/loyalty-points-brd-master.md` v1.7. Accept?"
- Answer: Accept `REFUNDS` and `LOYALTY`. Answered by: Fixture owner (fixture-answers.md § 2).

**Q-I2. A BRD that is not Approved.** "Neither BRD is `Approved`: REFUNDS v1.5 and LOYALTY v1.7 both read `In Review`. Go on with the Pre-SDD? [Go on / Stop and wait for approval]"
- Answer: Go on. Answered by: Fixture owner (fixture-answers.md § 2). Recorded in `decision-log.md` § Walkthrough and delegation history.

**Q-I3. System name and source BRDs:** given by the request (Refunds Platform; REFUNDS and LOYALTY). Not asked.

**Q-I4. Confirmer's name.** "Who answers and confirms values in this run? Your name goes on every value you confirm."
- Answer: `Product Owner stand-in` (the fixture owner). Answered by: Fixture owner (fixture-answers.md § 2).

**Answer policy.** The run brief sets the test-run policy: "accept the recommended option; continue at G1 and G2; ... the Approver stand-in signs each applicable G3 role only when the conditions hold". Recorded with `set-policy` by the person `Product Owner (fixture owner)` (fixture-answers.md § 1): `{ "label": "test-run policy", "stand_ins": ["Approver"] }`. Patch `20261027T162600Z-set-policy.json`. The engine accepted the person actor.

## Engine setup (step 5)

`node --version` gives v24.22.1; `cli.mjs --version` gives `engine 3.0.0, skill 1.0.0`. `cli.mjs new` created `pre-sdd-refunds-platform/studio/project-state.json` (78 Open, 2 Estimated). The master was written from `chunks/pre-sdd-master.md`.

## Pre-fill and proposals (step 6)

Both BRDs read in full (chunks 00 to 12, and 13 for context). Patches, agent actor:

- `20261027T162800Z-prefill-add-entries.json`: one entry per journey (BUS-02.2 to BUS-02.7), transaction type (CAP-01.2), journey (CAP-07.2, REL-01.2), data workload (DAT-01.2, DAT-05.2) and external system (INT-01.2, INT-01.3, INT-03.2, INT-03.3).
- `20261027T163500Z-prefill-values-and-proposals.json`: 62 ops; the values the BRDs state, each with its BRD citation (`Estimated`); the BRD wording as `evidence` on the entries left `Open`; proposals beside CAP-07.1, CAP-07.2, REL-01.1, REL-01.2, REL-03.1 and REL-04.1.

Engine counts after the pre-fill: 59 Open, 36 Estimated, 0 Confirmed, 0 N/A.

Questions the pre-fill leaves (each later raised as an unknown or a request to `brd-unifier`): the REFUNDS/NFR-05 seconds; the LOYALTY/NFR-04 minutes; the applicable data-protection law (REFUNDS 02, LOYALTY 02); the retention periods (REFUNDS/NFR-06, LOYALTY 03); how a customer proves who they are and who signs a member in (REFUNDS 03, LOYALTY/UC-01); the countries the branches operate in (REFUNDS/NFR-07); the launch and pilot dates (REFUNDS 04); the CardPay Ltd refund conditions (REFUNDS 02).

---

## Stage 1: discovery (step 7)

Rows in order: HDR-07, HDR-08, BUS-05, CAP-01, CAP-03, CAP-04, CAP-07, REL-01, REL-03, REL-04, REL-05, DAT-02, ECO-01. Batches of up to four.

### Batch S1-1 (HDR-07, HDR-08, BUS-05, CAP-01)

**1. HDR-07.1 Change type.** "Is the workload greenfield, brownfield, or mixed? What exists today?" Options: greenfield / brownfield / mixed. Pre-filled: none (`Open`); evidence: REFUNDS 01 says refunds are handled on paper and by phone today; LOYALTY 01 does not state the current state. No recommendation (a classification fact).
- Answer: `greenfield`. Answered by: Fixture owner (fixture-answers.md § 3: refunds are on paper and by phone today, and Loyalty Points is a new program).

**2. HDR-08.1 Intended target.** "Is the target on-premises, provider-hosted cloud, hybrid, or undecided? Which choices are permitted or prohibited?" Options: onprem / cloud / hybrid / undecided. Pre-filled: none (`Open`). No recommendation.
- Answer: `cloud`, kind stays `target`, evidence "provider-hosted public cloud; no provider is a hard constraint". Answered by: Fixture owner (fixture-answers.md § 3).

**3. BUS-05.1 Launch date, hard deadlines, blackout or change windows.** Pre-filled: none (`Open`); evidence: no launch date is stated (REFUNDS 04 pilot group first, LOYALTY 04 all branches at once; REFUNDS 02 dependencies needed before the build of UC-01 and UC-04 and before go-live). Options: a value / not known yet.
- Answer: not known yet (fixture-answers.md § 7 leaves BUS-05 `Open` on purpose). Nothing is written on the value; its owner name and due date are asked with the stage 1 owners below, and the question becomes unknown QD-01.

**4. CAP-01 Transactions by type (transactions per day).** Entries: CAP-01.1 "Refund request", CAP-01.2 "Points movement (earned on a branch purchase, or taken back after a refund)". Both `Open`; evidence: REFUNDS 02 Facts gives about 1,200 refund requests a month (a daily figure needs a month length, so it is not stated for the row); LOYALTY gives no volume. Derived beside it: CALC-01 average business TPS = TBD, CALC-02 peak business TPS = TBD. A fact only a person gives: no proposal.
- Answer: CAP-01.1 label `Points movement (earned on a branch purchase, or taken back after a refund)`, value `2000`; CAP-01.2 label `Refund request`, value `40`. Answered by: Fixture owner (fixture-answers.md § 7: the busiest transaction type is the primary entry; the fact owner gives 1,200 over 30 days for refund requests). The two labels are swapped from the pre-fill so the primary entry is the one to size for.

Patch `20261027T163900Z-stage1-batch1-fixture.json` (fixture owner): `set` and `confirm` on HDR-07.1, HDR-08.1, CAP-01.1, CAP-01.2.

### Batch S1-2 (CAP-03, CAP-04, CAP-07, REL-01)

**1. CAP-03.1 Peak simultaneously active users.** Pre-filled: none (`Open`). A fact only a person gives: no proposal.
- Answer: `300 peak simultaneously active users (customers, members and branch managers)`. Answered by: Fixture owner (fixture-answers.md § 7).

**2. CAP-04.1 Peak factor (multiplier).** Pre-filled: `3`, window "About 3 weeks of seasonal sales", source `BRD: REFUNDS/NFR-03` (`Estimated`). Keep or change?
- Answer: keep. Answered by: Fixture owner (fixture-answers.md § 7: "If pre-filled, keep"; a fact, so the fixture owner confirms it, never the policy).

**3. CAP-07 P99 latency per critical journey (ms).** CAP-07.1 "Everyday portal actions (REFUNDS/NFR-05)": `Open`, proposal **2000 ms** (recommended). Why: REFUNDS/NFR-05 asks that customers and branch managers do not wait during everyday actions and leaves the seconds open. CAP-07.2 "Open the points balance and the points history": `Open`, proposal **2000 ms** (recommended). Why: no LOYALTY source gives a response time; one screen target for the platform. Options: Take the proposal (recommended) / another value / leave open.
- Answer: Take the proposal, for both. Answered by: Answer policy (fixture-answers.md § 5: no fixture value; the policy takes the proposal). Both set a target no source states as a number: listed under the policy choices without a source.

**4. REL-01 Availability per journey (%).** REL-01.1 "Refund journeys": `Open`, proposal **99.9%** (recommended). Why: REFUNDS/NFR-02 allows no more than 2 hours of disruption a month, planned maintenance included. REL-01.2 "Points screens": `Open`, proposal **99.9%** (recommended). Why: LOYALTY/NFR-04 asks for any time of day, every day, with the minutes open. Options: Take the proposal (recommended) / another value / leave open.
- Answer: Take the proposal, for both. Answered by: Answer policy (fixture-answers.md § 5). Both set a value no source states as a percentage: listed under the policy choices without a source (REL-01.2 has no source value at all).

Patches `20261027T164000Z-stage1-batch2-fixture.json` (fixture owner: CAP-03.1 set and confirm, CAP-04.1 confirm) and `20261027T164000Z-stage1-batch2-policy.json` (policy: `accept-proposal` on CAP-07.1, CAP-07.2, REL-01.1, REL-01.2).

### Batch S1-3 (REL-05, REL-03, REL-04, DAT-02)

**1. REL-05 Failure scopes to recover from.** "Which failures must the system survive: host, zone (az), site, region, provider, or cyber?" REL-05.1 `Open`, no pre-fill, no proposal (not a proposal row).
- Answer: two scopes: REL-05.1 `Loss of a whole region` = `region`; a second entry `Loss of one zone` = `az`. Answered by: Fixture owner (fixture-answers.md § 4).

**2. REL-03 RTO per scope (s).** REL-03.1 `Open`, proposal **3600 s** (recommended; why: REFUNDS/NFR-02 allows 2 hours of disruption a month in total). Options: Take the proposal / another value / leave open.
- Answer: REL-03.1 label `Whole platform, region loss`, scope `region`, value `14400`; a second entry `Whole platform, zone loss`, scope `az`, value `300`. Answered by: Fixture owner (fixture-answers.md § 4). A person's own value replaces the proposal on REL-03.1 (not taken).

**3. REL-04 RPO per scope (s).** REL-04.1 `Open`, proposal **0 s** (recommended; why: REFUNDS/NFR-01, refund money is never lost or paid twice). Options: Take the proposal / another value / leave open.
- Answer: REL-04.1 label `All refund and points data, region loss`, scope `region`, value `900`; a second entry `All refund and points data, zone loss`, scope `az`, value `5`. Answered by: Fixture owner (fixture-answers.md § 4). The fixture value replaces the proposal on REL-04.1 (not taken).

**4. DAT-02.1 New logical data per day (GB/day).** Derived by the engine (CALC-10) from CAP-01.1 and the factor `storedKB`; `Open` while `storedKB` is missing. Factors asked: `storedKB`, `initialGB`, `retentionDays` (facts); `indexFactor` 1.4 and `copies` 2 (appendix defaults, confirmed with the group).
- Answer: `storedKB` = `8`, `initialGB` = `1`, `retentionDays` = `3653`; keep the value the engine derives. Answered by: Fixture owner (fixture-answers.md § 7). The derived value is a fact, so the fixture owner confirms it once the engine has derived it.

Patches (fixture owner): `20261027T164100Z-stage1-batch3-add-entries.json` (`add` on REL-05, REL-03 with scope az, REL-04 with scope az), then `20261027T164200Z-stage1-batch3-fixture.json` (labels, scopes, values and confirms on REL-05.1, REL-05.2, REL-03.1, REL-03.2, REL-04.1, REL-04.2; the three DAT-02 factors set and confirmed), then `20261027T164300Z-stage1-batch3-dat02-confirm.json` (confirm DAT-02.1 once the engine derived it).

### Batch S1-4 (ECO-01)

**1. ECO-01.1 One-time budget and run-cost envelope.** Pre-filled: none (`Open`); evidence: REFUNDS 01 and LOYALTY 01 leave the cost open. A fact only a person gives. Factor `budgetPressure` asked with it.
- Answer: `One-time budget 250,000 EUR; run cost up to 12,000 EUR a month`, factor `budgetPressure` = `balanced`. Answered by: Fixture owner (fixture-answers.md § 7).

Patch `20261027T164400Z-stage1-batch4-fixture.json` (fixture owner).

### Stage 1 owners and unknowns

**Q. Owner names and due dates for the stage 1 entries still `Open`** (one question): BUS-05.1 (owner code B).
- Answer: BUS-05.1: `Refunds and Loyalty Product Owner`, due `2026-11-20`. Answered by: Fixture owner (fixture-answers.md § 8, stage 1 entries).

**Q. Owners and due dates of the open questions** (unknowns, collected before they are recorded): QD-01 launch and pilot dates (BUS-05.1); QD-02 applicable data-protection law (SEC-01.1); QD-03 REFUNDS/NFR-05 seconds (CAP-07.1); QD-04 LOYALTY/NFR-04 minutes (REL-01.2).
- Answer: QD-01, QD-03, QD-04: `Refunds and Loyalty Product Owner`; QD-02: `Legal Counsel`; all due `2026-11-20`. Answered by: Fixture owner (fixture-answers.md § 8, "Every unknown QD-NN"). Recorded with `add-unknown` under the fixture owner.

Patch `20261027T164700Z-stage1-owners-and-unknowns.json` (fixture owner).

### Discovery summary (end of stage 1)

- **Classification:** HDR-07.1 `greenfield`, HDR-08.1 `cloud` (both Confirmed by the fixture owner); the engine's path code is `GF-CL` (read from the classification fragment at the write-up).
- **Sponsor and lead architect:** HDR-02 and HDR-04 are not given by either BRD; they open stage 2 (owner: Refunds and Loyalty Product Owner).
- **Stage 1 values by status (engine):** after the stage 1 patches the engine counts 44 Open, 36 Estimated, 18 Confirmed, 0 N/A over the whole register. Stage 1 rows: HDR-07.1, HDR-08.1, CAP-01.1, CAP-01.2, CAP-03.1, CAP-04.1, CAP-07.1, CAP-07.2, REL-01.1, REL-01.2, REL-03.1, REL-03.2, REL-04.1, REL-04.2, REL-05.1, REL-05.2, DAT-02.1, ECO-01.1 Confirmed; BUS-05.1 Open (Refunds and Loyalty Product Owner, 2026-11-20).
- **Engine check of the REL-01.1 proposal:** CALC-13 (30-day downtime budget at REL-01.1) reads 2,592 s, inside the 2 hours of disruption a month of REFUNDS/NFR-02.
- **Unknowns:** QD-01 to QD-04 (above).
- **Requests to `brd-unifier`:** HR-001 (REFUNDS/NFR-05 seconds), HR-002 (LOYALTY/NFR-04 minutes), HR-003 (who confirms the data-protection law), raised on the board with State `Open`.
- **Pointer:** `set-run` stage 2, group HDR (agent), patch `20261027T164900Z-pointer-stage2-HDR.json`; master and board row updated.

---

## Stage 2: the register (step 8)

Order: the header rows still `Open`, the overlay switch, then BUS, SEC, DAT, INT, CAP, REL, OPS, ECO. Inside a group: `Open` without a proposal, `Open` with a proposal, `Estimated`, then `Confirmed` and `N/A`. Each group ends with "Confirm all pre-filled values in this group?" and one batched question for the owner names and due dates of the entries still `Open`.

Rule used for "keep" (fixture-answers.md § 11): the answer policy takes the group confirm first (`confirm-group`, policy actor; the engine skips the facts), then the fixture owner confirms any fact still `Estimated` in the group. The BRD-stated facts pre-filled on fact rows (CAP-04.1) were kept by the fixture owner in stage 1.

### Group HDR

Batch HDR-1. **1. HDR-01.1 Solution name** (`Open`, fact). **2. HDR-02.1 Business sponsor** (`Open`; REFUNDS 09 names the Head of Retail only inside an open question). **3. HDR-03.1 Product owner** (`Open`). **4. HDR-04.1 Lead architect** (`Open`). No recommendation: facts only a person gives.
- Answers: HDR-01.1 `Refunds Platform`; HDR-02.1 `Head of Retail`; HDR-03.1 `Refunds and Loyalty Product Owner`; HDR-04.1 `Lead Architect, Retail IT`. Answered by: Fixture owner (fixture-answers.md § 7).

Batch HDR-2. **1. HDR-05.1 Architecture review authority** (`Open`). **2. HDR-06.1 Business budget owner** (`Open`). **3. HDR-09.1 Source platforms** (`Open`). **4. HDR-10.1 Migration direction** (`Open`; options none / onprem-to-cloud / cloud-to-cloud / cloud-to-onprem / same-platform / mixed).
- Answers: HDR-05.1 `Architecture Review Board`; HDR-06.1 `Finance Director`; HDR-09.1 `None: there is no source platform; refunds are on paper and by phone today`; HDR-10.1 `none`. Answered by: Fixture owner (fixture-answers.md § 3 and § 7).

**Overlay switch.** "Does the migration overlay apply (an existing workload crosses a hosting or platform boundary)? [applies / does not apply], and the source platform." HDR-07 is greenfield and HDR-10 is none.
- Answer: `applies: false`. Answered by: Fixture owner (fixture-answers.md § 3). No workloads; no chunk 08; the migration owner role does not apply.

**Group confirm HDR.** "Confirm all pre-filled values in this group?" (recommended: yes). No HDR value is `Estimated`.
- Answer: yes. Answered by: Answer policy. The engine applied it with no change.

Patches `20261027T165200Z-stage2-HDR-fixture.json` (fixture owner, includes `set-overlay`) and `20261027T165300Z-stage2-HDR-policy-group.json` (policy). G0 met after this group (engine).

### Group BUS

**1. BUS-04.1 Revenue or loss per outage and per degraded minute** (`Open`, fact, owner code B). Not stated by either BRD.
- Answer: not known yet (fixture-answers.md § 7 leaves BUS-04 `Open`).

**2. BUS-08.1 Commercial and legal obligations and penalty conditions** (`Open`, hard; evidence REFUNDS/NFR-07, REFUNDS 02). No recommendation.
- Answer: `No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd).` Answered by: Fixture owner (fixture-answers.md § 6).

**3. BUS-07.1 Prohibitions and non-goals** (`Estimated`, pre-filled from REFUNDS 02 Constraint 2 and the REFUNDS 04 and LOYALTY 04 Out of Scope lists). Keep or change? The fixture value for BUS-07.1 applies only to an `Open` entry, so it is not used.
- Answer: keep, through the group confirm below.

**Group confirm BUS.** "Confirm all pre-filled values in this group?" (recommended: yes): BUS-01.1, BUS-02.1 to BUS-02.7, BUS-03.1, BUS-06.1, BUS-07.1.
- Answer: yes. Answered by: Answer policy (11 entries Confirmed). No fact is left `Estimated` in BUS.

**Owners of the `Open` BUS entries** (one question): BUS-04.1 (B); BUS-05.1 already has its owner.
- Answer: BUS-04.1 `Refunds and Loyalty Product Owner`, due `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

**Unknown:** QD-05 (BUS-06.1: countries, languages, formats, accessibility standard), owner `Refunds and Loyalty Product Owner`, due `2026-11-20` (fixture-answers.md § 8).

Patches `20261027T165500Z-stage2-BUS-fixture.json` (fixture owner) and `20261027T165600Z-stage2-BUS-policy-group.json` (policy).

### Group SEC

**1. SEC-01.1 Applicable laws, contracts, certifications and policies** (`Open`, hard, owner code Sec+D). No recommendation.
- Answer: stays `Open` (fixture-answers.md § 6); it is the one hard row the time-bound exception lifts at stage 4.

**2. SEC-03.1 Threat and risk classification** (`Open`, Sec). **3. SEC-06.1 Vulnerability, patch and incident reporting obligations** (`Open`, Sec+Ops). **4. SEC-08.1 Third-party processor and vendor restrictions** (`Open`, B+Sec).
- Answer: not known yet for all three (no fixture value).

**5. SEC-04.1 Encryption at rest and in transit, key custody, rotation** (`Open`, hard, Sec+D).
- Answer: `Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year.` Answered by: Fixture owner (fixture-answers.md § 6).

**Group confirm SEC** (recommended: yes): SEC-02.1, SEC-05.1, SEC-07.1.
- Answer: yes. Answered by: Answer policy.

**Owners of the `Open` SEC entries:** SEC-01.1, SEC-03.1, SEC-06.1, SEC-08.1.
- Answer: SEC-01.1 `Legal Counsel`, `2026-12-15`; SEC-03.1 and SEC-06.1 `Security Lead`, `2026-11-30`; SEC-08.1 `Refunds and Loyalty Product Owner`, `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

**Unknown:** QD-06 (SEC-02.1: how a customer proves who they are, and which party signs a member in), owner `Refunds and Loyalty Product Owner`, due `2026-11-20`.

Patches `20261027T165800Z-stage2-SEC-fixture.json` and `20261027T165801Z-stage2-SEC-policy-group.json`.

### Group DAT

**1. DAT-04.1 Residency and allowed locations** (`Open`, hard, D+Legal), with factors `primaryLocation` and `recoveryLocation`.
- Answer: `yes`, `primaryLocation` = `Within the European Union`, `recoveryLocation` = `Within the European Union, in a second region`. Answered by: Fixture owner (fixture-answers.md § 6).

**2. DAT-05.1 Consistency, refund requests, decisions and payouts** (`Open`; options strong / mixed / eventual), with factor `transactionNeed`. **3. DAT-05.2 Consistency, points ledger** (`Open`).
- Answer: DAT-05.1 `strong`, `transactionNeed` = `yes`; DAT-05.2 `strong`. Answered by: Fixture owner (fixture-answers.md § 7).

**4. DAT-06.1 Retention, deletion and erasure** (`Open`, hard, D).
- Answer: `Refund requests, decisions and payout results are kept for 10 years for tax records; customer contact details are deleted 90 days after a request ends; a member's points history is kept while the membership lasts and deleted within 30 days after it ends.` Answered by: Fixture owner (fixture-answers.md § 6).

**5. DAT-07.1 Multi-tenancy model** (`Open`, B+D). **6. DAT-09.1 Restore granularity** (`Open`, D+Ops).
- Answer: not known yet (no fixture value).

**7. DAT-01.2 store kind** (factor `storeKind` `Open` on the points ledger).
- Answer: `relational`. Answered by: Fixture owner (fixture-answers.md § 7). DAT-01.1's `storeKind` was pre-filled `relational` from REFUNDS 12 (TI-02) and is kept through the group confirm.

**Group confirm DAT** (recommended: yes): DAT-01.1 (value and `storeKind`), DAT-01.2, DAT-03.1, DAT-08.1, and the appendix factors `indexFactor` and `copies` on DAT-02.1.
- Answer: yes. Answered by: Answer policy. DAT-01.1 and DAT-03.1 "if pre-filled, keep" (fixture-answers.md § 6 and § 7) are kept this way, as choices.

**Owners of the `Open` DAT entries:** DAT-07.1 (B+D), DAT-09.1 (D+Ops).
- Answer: DAT-07.1 `Refunds and Loyalty Product Owner`, DAT-09.1 `Data Owner, Retail Finance`, both `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

Patches `20261027T170000Z-stage2-DAT-fixture.json` and `20261027T170001Z-stage2-DAT-policy-group.json`.

### Group INT

**1. INT-03.1, INT-03.2, INT-03.3 External quotas, latencies, SLAs** (`Open`, fact, B+E; one per partner). **2. INT-06.1 Existing IPs, allowlists, DNS, certificates** (`Open`, E+Sec). **3. INT-09.1 External SLA dependencies, peers that cannot move** (`Open`, B+E).
- Answer: not known yet (fixture-answers.md § 7 leaves every INT-03 entry `Open` on purpose).

**4. INT-08.1 Address ranges, routing and connectivity** (`Open`; options public / private / hybrid / partner).
- Answer: `public` (kind stays `target`, no `cidrPrefix`). Answered by: Fixture owner (fixture-answers.md § 7).

**Group confirm INT** (recommended: yes): INT-01.1 to INT-01.3, INT-02.1, INT-04.1, INT-05.1, INT-07.1.
- Answer: yes. Answered by: Answer policy.

**Owners of the `Open` INT entries.**
- Answer: INT-03.1 `CardPay Ltd`, INT-03.2 `Retail IT team`, INT-03.3 `MsgHub` (the owners REFUNDS 08 names); INT-06.1 `Lead Architect, Retail IT`; INT-09.1 `Refunds and Loyalty Product Owner`; all `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

Patches `20261027T170200Z-stage2-INT-fixture.json` and `20261027T170201Z-stage2-INT-policy-group.json`.

### Group CAP

**1. CAP-05.1 Growth forecast** (`Open`, fact, B). **2. CAP-10.1 Read and write mix** (`Open`, fact, B+E).
- Answer: not known yet (fixture-answers.md § 7 leaves both `Open` on purpose).

**3. CAP-06.1 Payload sizes** (`Open`, fact), with factors `requestKB` and `responseKB`.
- Answer: `Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded`, `requestKB` = `4`, `responseKB` = `16`. Answered by: Fixture owner (fixture-answers.md § 7).

**4. CAP-12.1 AI, ML or media jobs** (`Open`, fact).
- Answer: `N/A`, reason `No AI, ML or media jobs are in scope of either BRD.` Answered by: Fixture owner (fixture-answers.md § 7).

**Group confirm CAP** (recommended: yes): CAP-02.1 (derived), CAP-08.1 (project default), CAP-09.1, CAP-11.1, and the appendix factors `utilization`, `networkOverhead`, `meanLatencyMs`, `callsPerTxn`, `requestFactor`.
- Answer: yes. Answered by: Answer policy (fixture-answers.md § 11). No appendix value is changed.

**Owners of the `Open` CAP entries:** CAP-05.1, CAP-10.1.
- Answer: both `Refunds and Loyalty Product Owner`, `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

Patches `20261027T170400Z-stage2-CAP-fixture.json` and `20261027T170401Z-stage2-CAP-policy-group.json`.

### Group REL

**1. REL-02.1 SLA to customers against internal SLO** (`Open`, B). **2. REL-07.1 Recovery sequence** (`Open`, B+Ops). **3. REL-09.1 Drill frequency and evidence** (`Open`, B+Ops).
- Answer: not known yet (no fixture value).

**Group confirm REL** (recommended: yes): REL-06.1, REL-08.1, REL-10.1.
- Answer: yes. Answered by: Answer policy.

**Owners of the `Open` REL entries.**
- Answer: REL-02.1, REL-07.1, REL-09.1 `Refunds and Loyalty Product Owner`, `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

Patches `20261027T170600Z-stage2-REL-fixture.json` and `20261027T170601Z-stage2-REL-policy-group.json`.

### Group OPS

**1. OPS-02.1 Team skills and support model** (`Open`, Ops+E). **2. OPS-03.1 Release frequency and change freezes** (`Open`, B+Ops). **3. OPS-05.1 Logging and tracing retention** (`Open`, Ops). **4. OPS-06.1 Continuity runbooks and failover authority** (`Open`, B+Ops).
- Answer: not known yet (no fixture value).

**Group confirm OPS** (recommended: yes): OPS-01.1, OPS-04.1 (project default), OPS-07.1, OPS-08.1.
- Answer: yes. Answered by: Answer policy.

**Owners of the `Open` OPS entries.**
- Answer: OPS-02.1 and OPS-05.1 `Operations Lead`; OPS-03.1 and OPS-06.1 `Refunds and Loyalty Product Owner`; all `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

Patches `20261027T170800Z-stage2-OPS-fixture.json` and `20261027T170801Z-stage2-OPS-policy-group.json`.

### Group ECO

**1. ECO-02.1 CapEx and OpEx preferences, currency** (`Open`). **2. ECO-03.1 TCO horizon and required benefits** (`Open`). **3. ECO-05.1 Environmental footprint goals** (`Open`). **4. ECO-04.1 Delivery deadline and people** (`Open`). **5. ECO-06.1 Exit portability** (`Open`).
- Answers: ECO-02.1 `Currency EUR; operating expense preferred`; ECO-03.1 `36 months`; ECO-05.1 `N/A`, reason `The business states no energy or environmental footprint goal for this system.`; ECO-04.1 and ECO-06.1 not known yet. Answered by: Fixture owner (fixture-answers.md § 7).

**Group confirm ECO** (recommended: yes). No ECO value is `Estimated`.
- Answer: yes. Answered by: Answer policy.

**Owners of the `Open` ECO entries.**
- Answer: ECO-04.1 and ECO-06.1 `Refunds and Loyalty Product Owner`, `2026-11-30`. Answered by: Fixture owner (fixture-answers.md § 8).

Patches `20261027T171000Z-stage2-ECO-fixture.json` and `20261027T171001Z-stage2-ECO-policy-group.json`.

### G1 review stop

Shown (from the engine, after the ECO patches):

- **Counts by status:** 24 Open, 0 Estimated, 72 Confirmed, 2 N/A.
- **G0:** met. **G1:** met (no entry `Open` without an owner name and a due date).
- **`Open` entries with owner and due:** BUS-04.1, CAP-05.1, CAP-10.1, REL-02.1, REL-07.1, REL-09.1, DAT-07.1, SEC-08.1, INT-09.1, OPS-03.1, OPS-06.1, ECO-04.1, ECO-06.1 (Refunds and Loyalty Product Owner, 2026-11-30); BUS-05.1 (Refunds and Loyalty Product Owner, 2026-11-20); DAT-09.1 (Data Owner, Retail Finance, 2026-11-30); SEC-03.1, SEC-06.1 (Security Lead, 2026-11-30); INT-03.1 (CardPay Ltd), INT-03.2 (Retail IT team), INT-03.3 (MsgHub), INT-06.1 (Lead Architect, Retail IT), all 2026-11-30; OPS-02.1, OPS-05.1 (Operations Lead, 2026-11-30); SEC-01.1 (Legal Counsel, 2026-12-15).
- **Hard entries still `Open`:** SEC-01.1 (blocker `OPEN-SEC-01.1`).
- **Unknowns:** QD-01 to QD-06, each with owner and due date.
- **What stage 3 assesses:** the calculations, the DR strategy per failure scope (region, az), the target shape and its conflicts, the shape-level options with their scores, costs, the TCO horizon and the weights.
- Board row: `In progress: G1 review stop`; HR-004 and HR-005 raised to the Product manager (questions only a BRD owner can answer).

"Review the register above, then say continue to start stage 3."
- Answer: continue. Answered by: Answer policy (the test-run policy names the G1 review stop: "continue at G1 and G2"). Pointer `set-run` stage 3, group none (agent), patch `20261027T164200Z-pointer-stage3.json` (the file-name stamp is earlier than the time it was applied, 16:41:13Z; see run-notes.md).

---

## Stage 3: assess (step 9)

`compute` (16:41Z): target shape hosting `cloud`, topology `regional` (primary and independent recovery location), DR for scope `region` Pilot Light with asynchronous replication, scope `az` local HA with asynchronous replication, data `relational`, consistency `strong`, network `public`; no conflict. Path: greenfield, cloud, no overlay; no chunk 06 and no chunk 08.

### Options (named by the skill)

The engine's target shape is one option; the credible alternative the register leaves open is a stronger DR strategy for scope `region`. Patch `20261027T164400Z-stage3-options-agent.json` (agent): `set-option` OPT-01 "One primary region with a pilot-light recovery region" (`cloud`, `regional`, `pilot`, `public`, data "relational, strongly consistent; synchronous inside the primary region, asynchronous to the recovery region"); OPT-02 "One primary region with a warm-standby recovery region" (same, `warm`). A backup-and-restore option is not named: REL-04.1 (900 s) leaves it no credible fit. Then `set-score` for all 16 criterion scores with a one-line reason each, `Estimated`.

### Batch S3-1 (costs, horizon, weights, scores)

**1. Costs per option (EUR).** "Give the one-time and the monthly cost of each option." A fact only a person gives; no proposal.
- Answer: OPT-01 one-time `180000`, monthly `6500`; OPT-02 one-time `210000`, monthly `9800`. Answered by: Fixture owner (fixture-answers.md § 10).

**2. TCO horizon (months).** ECO-03.1 reads 36 months.
- Answer: `36`. Answered by: Fixture owner (fixture-answers.md § 10).

**3. Criterion weights.** "Which weight does each criterion carry? Without approved weights the comparison stays UNWEIGHTED."
- Answer: `nfr_fit 3`, `one_time_cost 1`, `recurring_tco 2`, `delivery_time 1`, `operability 2`, `security_compliance 2`, `reversibility 1`, `uncertainty 1`, approved by the fixture owner. Answered by: Fixture owner (fixture-answers.md § 10).

**4. The proposed scores** (each with its reason, shown in chunk 07). "Confirm each score, or change it."
- Answer: keep every score the skill proposed, unchanged (`confirm` with `option` and `criterion`). Answered by: Fixture owner (fixture-answers.md § 10). The fallback scores in fixture-answers.md § 10 were not needed: the skill proposed every score.

Patch `20261027T164600Z-stage3-batch1-fixture.json` (fixture owner). The costs came back `Estimated` after `set-cost`, so the fixture owner's confirmation of the four costs (the same answer: these are the costs) went in a second patch, `20261027T164400Z-stage3-batch1-fixture-confirm-costs.json` (applied 16:43:26Z).

### G2 review stop

Shown (from `compute`, 16:43Z):

- **G2:** `blocker`, missing `OPEN-SEC-01.1` and `DT-15-BLOCK` (DT-15 holds while another blocker remains and G3-11 is not done).
- **DR strategy per failure scope:** region: Pilot Light, asynchronous replication; az: local HA, asynchronous replication.
- **Target shape:** cloud, regional (primary and independent recovery location), relational, strongly consistent, public network. **Conflicts:** none.
- **Options:** OPT-01 pilot light: hard constraints pass, TCO (CALC-21@OPT-01) 414,000, weighted score (CALC-22@OPT-01) 3.7692; OPT-02 warm standby: pass, TCO 562,800, weighted score 3.5385. Flags: none. ECO-01.1 envelope: one-time 250,000 EUR, run cost up to 12,000 EUR a month.
- **Hard entries the engine does not check against the options** (BUS-07.1, BUS-08.1, SEC-01.1, SEC-04.1, DAT-03.1, DAT-04.1, DAT-06.1): both options keep the original-card payout and the non-goals (BUS-07.1), carry no penalty term (BUS-08.1), encrypt with business-held keys (SEC-04.1), protect sensitive data (DAT-03.1), keep both regions within the European Union (DAT-04.1) and can hold the DAT-06.1 retention; SEC-01.1 is `Open` and applies equally to both. "Does any option break one of these entries? If so, it is excluded with the entry and the reason."
- Answer: none excluded. Answered by: Fixture owner (fixture-answers.md § 10, "Excluded options: None").

"Review the assessment above, then say continue to start stage 4." G2 reads `blocker`; G3 cannot reach an approved status until G2 reads `shortlist` (the stage 4 exception on SEC-01.1 is what lifts it).
- Answer: continue. Answered by: Answer policy (it names the G2 review stop). Pointer `set-run` stage 4, group none.

---

## Stage 4: confirm and decide (step 10)

### Step 1, confirm

"Every value still `Estimated`, grouped, with one confirm per group." The engine counts 0 `Estimated` entries: every pre-filled value, default, derived value and appendix factor was confirmed at its stage 2 group confirm (fixture-answers.md § 11). No group confirm question is left to ask.

### Step 2, decide (batch S4-1)

**1. Topology override.** "The engine's topology is `regional`. Override it? [No override (default) / single / multiAZ / multiAZActive / active]"
- Answer: No override (`auto`). Answered by: Fixture owner (fixture-answers.md § 11; the engine refuses a policy here).

**2. DR override per failure scope.** "region: Pilot Light; az: local HA. Override either? [No override (default) / backup / pilot / warm / active]"
- Answer: No override for either scope. Answered by: Fixture owner (fixture-answers.md § 11).

**3. Chosen option.** "OPT-01 (weighted score 3.7692, TCO 414,000) or OPT-02 (3.5385, 562,800)? Both pass every hard check." The engine computes no recommended option.
- Answer: OPT-01, by the stated rule (the higher weighted score, CALC-22). Reason: `Highest weighted score under the approved weights; meets REL-03.1 and REL-04.1 for scope region.` Answered by: Fixture owner (fixture-answers.md § 11).

Patches `20261027T164500Z-pointer-stage4.json` (agent) and `20261027T164500Z-stage4-decide-fixture.json` (fixture owner, `decide` with `option: OPT-01`). The first try sent the reason with the option; the engine refused the whole patch ("There is no override to give a reason for; give the reason together with a topology or DR override.", exit 2, nothing applied). The refused patch is kept out of the patches folder (it changed nothing) and the reason for the choice is recorded in `decision-log.md` and chunk 09 instead; see run-notes.md.

### Step 3, validate

`compute` shows the validation: blocker `OPEN-SEC-01.1` (hard entry `Open`) and `DT-15-BLOCK`; no conflict; advisory `PRIMARY-ONLY-CAP-01`.

**Q. Time-bound exception for SEC-01.1.** "SEC-01.1 (applicable laws) is a hard entry and `Open`; it blocks the gate. A named person may grant a time-bound exception with its reason, expiry date and review date. Who grants it?"
- Answer (ruling R23): granted by the person `Product Owner (fixture owner)`; reason `The applicable data-protection law is a hard BRD dependency needed before go-live (REFUNDS 02 and LOYALTY 02 Dependencies), not before the SDD; the SDD may start while Legal Counsel confirms it by 2026-12-15.`; expires `2027-12-31`; review `2027-03-31`. Source: fixture-answers.md § 9. No other exception is granted, and none is revoked.

Patch `20261027T164700Z-stage4-exception-person.json` (person actor `Product Owner (fixture owner)`). The engine recorded `EXC-01` at 16:44:29Z. Engine result after it: G2 `shortlist`, label `G2`, G3 `Not signed`; the G3 problems left are the ten roles still to sign and the fourteen checklist lines; no critical-entry problem.

---

## Write-up (step 11)

`compute` at 16:45:25Z (gate label `G2`) wrote `model.json`, the blueprint, 18 fragments and six diagrams. Chunks written in `./pre-sdd-refunds-platform/`: 00, 01, 02, 03a to 03h, 04, 05, 07, 09, 10, 11, 12 (no 06: greenfield; no 08: no overlay), each fragment pasted unchanged between its markers; the infrastructure, network, DR and data diagrams pasted in chunk 05 with a summary each; the master rewritten with the index and the progress table; `decision-log.md` created (proposal record, walkthrough, the R23 exception). No question was asked in this step.

## Review (step 12)

Dispatched one cleared-context reviewer at 16:52Z with the `Agent` tool (`subagent_type: general-purpose`), with the brief of `review-and-open-items.md` and the absolute paths of the chunks, the master, the project state, `model.json`, the fragments, both BRDs, the templates, `handoff-guide.md`, and `AGENTS.md` (honour only its rules). Approved by the coordinator for this run.

The reviewer wrote chunk 13 (pass 1 of 3) with 11 open items and an 11-row coverage record. It could not read the text of ruling R23, the engine's landing map, or the values the engine takes for `register.overlay.source` (outside its file set).

### Accept loop (batches of up to four)

Each item was shown as: ID, title, one-line concern, the Recommended Answer and its Why. Options per item: **Accept recommendation** (listed first), Choose option B or C, Defer, or an own answer.

Batch R-1.
- **OI-01** (option shapes say synchronous inside the region; the engine shape says asynchronous). Recommended: A, set the shape data text of OPT-01 and OPT-02 to "relational, strongly consistent; asynchronous to the zone standby and to the recovery region". Answer: Accept recommendation. Answered by: Answer policy. Applied with `set-option` (patch `20261027T171100Z-review-OI-01-policy.json`); the engine returned both options' costs and scores to `Estimated`, so the fixture owner confirmed the same costs and scores again (patch `20261027T171130Z-review-OI-01-fixture-reconfirm.json`, fixture-answers.md § 10), then `compute`.
- **OI-02** (SLO-15@region smoothed in 04 § 4.3). Recommended: A, the given text. Answer: Accept recommendation. Answered by: Answer policy. Applied to 04 § 4.3.
- **OI-03** (CAP-03.1 read by no calculation). Recommended: A, the given text and risk R7. Answer: Accept recommendation. Answered by: Answer policy. Applied to 04 § 4.3 and 10 § 10.2.
- **OI-04** (lock list leaves out DAT-01, INT-03, CAP-08, REL-10). Recommended: A, add the rows to the engine's landing map. Answer: Accept recommendation. Answered by: Answer policy. Not applicable in this run: it is an engine change, and the run never edits the skill or the engine; Status `Decided - pending application`; reported as an engine finding in run-notes.md.

Batch R-2.
- **OI-05** (EXC-01 granted by "Product Owner (fixture owner)"). Recommended: A, `No change: <evidence>` (ruling R23). Answer: Accept recommendation, which is `No change`. Answered by: Answer policy. Status `Rejected`, decided by the policy.
- **OI-06** (QD-02 due 2026-11-20 against SEC-01.1 due 2026-12-15). Recommended: A, set QD-02's due date to 2026-12-15 after the fixture owner confirms. A due date is a fact only a person or the fixture owner gives, so the policy does not take it; fixture-answers.md § 8 gives exactly the two dates already recorded and nothing else; and no op changes an unknown once added. Answer: none; the item stays `Open`, waiting for the fixture owner.
- **OI-07** (chunk 13 not chained in). Recommended: A, the given footer and index rows. Answer: Accept recommendation. Answered by: Answer policy. Applied to chunk 12's footer, the master and chunk 00.
- **OI-08** (02 § 2.5 states numbers no fragment holds). Recommended: A, the given text. Answer: Accept recommendation. Answered by: Answer policy. Applied.

Batch R-3.
- **OI-09** (BRD references without a key). Recommended: A, wording changes on BUS-02.2, CAP-07.2, REL-01.1, REL-01.2 and in 01 § 1.4. Answer: Accept recommendation. Answered by: Answer policy. The engine refused the policy patch (exit 2, nothing applied): "BUS-02.2 is protected (Confirmed, or answered by a person), so only a person may change it; ask the owner, or record the question as an unknown." (the same for the other three). The actor was not changed; Status `Decided - pending application`; the refused patch is kept out of the patches folder.
- **OI-10** (03a cites OVL rows in an omitted chunk 08). Recommended: A, the given text. Answer: Accept recommendation. Answered by: Answer policy. Applied.
- **OI-11** (fragment says "source unknown"). Recommended: A, the given text in 02 § 2.4. Answer: Accept recommendation. Answered by: Answer policy. Applied.

After the loop: chunks regenerated from the new fragments (gate label `G2`, G3 `Not signed`); chunk 13 Status and Resolution lines and Resolution Log written.

### Application pass (pass 2 of 3)

A fresh dispatch of the same reviewer brief, scoped to the seven applied items and the chunks they changed. It confirmed the seven items applied and all 17 fragment regions equal to their files, and raised OI-12 (Missing source: the decision log's Clarification register held no review record) and OI-13 (Risk: ADR-PERF-001 drivers omit CAP-03.1).

Batch R-4.
- **OI-12.** Recommended: A, the given Clarification register entries. Answer: Accept recommendation. Answered by: Answer policy. Applied to `decision-log.md` (plus entries for OI-06, OI-12 and OI-13).
- **OI-13.** Recommended: A, add CAP-03.1 and the R7 pointer to the ADR-PERF-001 row. Answer: Accept recommendation. Answered by: Answer policy. Applied to 09 § 9.5.

No third pass was dispatched (the limit allows up to two application passes; one was enough to check the applied answers). Review: 2 passes of 3; open items: OI-06 Open; OI-04 and OI-09 Decided - pending application; OI-05 Rejected (No change, policy); the other nine Accepted - applied.

---

## G3 sign-off stop (step 13)

**Pre-G3 copy.** After the review and the accept loop, before the first checklist tick, `compute` (gate label `G2`) and the chunks were regenerated, and the whole folder `./pre-sdd-refunds-platform/` (with `studio/`) was copied unchanged to `./_snapshots/pre-sdd-refunds-platform.pre-g3/` at 17:21Z (`diff -r` showed no difference). Nothing was written into the copy afterwards.

**Show the gate** (engine): G0 met, G1 met, G2 `shortlist`, G3 `Not signed`; problems: the ten roles still to sign and the fourteen checklist lines; label `G2`.

**Q-G3-1. Checklist** (each line with its evidence: G3-01 HDR-02.1, HDR-03.1, BUS-01.1, BUS-03.1; G3-02 HDR-07.1, HDR-08.1, path GF-CL, chunk 02; G3-03 HDR-09.1, HDR-10.1, overlay off; G3-04 BUS-02, CAP-01, CAP-07, CAP-08, chunk 04; G3-05 REL-01, REL-03, REL-04, REL-05, REL-10, DAT-05, chunk 05; G3-06 SEC-01 to SEC-08, DAT-03, DAT-04, DAT-06; G3-07 INT-01 to INT-09; G3-08 ECO-01 to ECO-04, OPS-01, OPS-02, BUS-05 with owners; G3-09 chunk 06 absent (greenfield); G3-10 chunk 08 absent (no overlay); G3-11 chunk 10 blockers (none), conflicts (none), risks R1 to R7, EXC-01; G3-12 chunks 07 and 09; G3-13 09 § 9.1 validation evidence, OPS-08.1, chunk 12; G3-14 chunk 11). "Tick each line: Done, or N/A with a reason."
- Answer: G3-01 to G3-08 and G3-11 to G3-14 `Done`; G3-09 `N/A` "Greenfield (HDR-07): there is no existing estate."; G3-10 `N/A` "No migration overlay (HDR-10 none).". Answered by: Fixture owner (fixture-answers.md § 12). Patch `20261027T172200Z-g3-checklist-fixture.json`.

**Q-G3-2. Conditions.** "Approved with conditions needs each condition with its owner and due date before the signatures."
- Answer: COND-01 "CardPay Ltd confirms in writing that it refunds branch card purchases to the original card, before the SDD fixes the payout integration.", owner Refunds and Loyalty Product Owner, due 2026-12-15. Answered by: Fixture owner. Patch `20261027T172300Z-g3-condition-fixture.json`. Engine after it: G3 `Not signed`, the only problems the ten roles still to sign.

**Q-G3-3. Who signs each role?** (asked once; the header rows name the Head of Retail, the Refunds and Loyalty Product Owner, the Lead Architect, Retail IT and the Architecture Review Board for four roles; the migration owner does not apply).
- Answer: the Approver stand-in signs every applicable role; nobody else signs; no role is marked not applicable. Answered by: Fixture owner (fixture-answers.md § 12).

**Q-G3-4. Each role's decision** [Approved / Approved with conditions / Rejected].
- Answer: `Approved with conditions` for all ten applicable roles, signed by the Approver stand-in (policy actor), one patch per role (`20261027T172400Z-g3-sign-01-...` to `-10-...`), applied 17:21:33Z to 17:21:42Z. Before each, the engine's G3 result named no problem other than the roles still to sign. After the tenth: G3 `Approved with conditions`, label `G3 Approved with conditions`, authorized. No "Sign again" note.

**After signing.** `compute` (label `G3 Approved with conditions`), then chunks 11, 12 and 00 and the master rewritten from the new fragments (signers, gate lines; no content change, nothing reopened, nothing bumped). The sign-off record is in `decision-log.md` § Sign-off record. The § 12.1 Gate row was first written as the master's full gate line; `check_presdd.py` expects the engine's gate label alone, as the chunk 12 template row says, so the row was rewritten to the label (a gate line, which bumps nothing); see run-notes.md.

---

## Hand-off (step 14)

G3 reads `Approved with conditions`. Board row E2E Architect: `Done v1.0`. Request HR-006 to the Software Architect: "Hand-off: Pre-SDD refunds-platform v1.0 is G3-signed", Link the absolute path of the master.

**Q-H1.** "Next hop: SDD (Software Architect). Start now, or later?" (Run mode: solo)
- Answer: `later`. Answered by: Fixture owner (fixture-answers.md § 13). HR-006 State `Later`, set by the raiser.

### Handoff summary

- **Gate:** `G3 Approved with conditions`; G3 `Approved with conditions`; the SDD may start.
- **Signers:** all ten applicable roles (business sponsor, product owner / business process owner, lead / principal architect, infrastructure / platform owner, network owner, security and privacy/compliance, data owner, SRE / operations, finance / procurement, architecture review authority): `Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27)`, Approved with conditions, 2026-10-27. Migration owner: not applicable (no overlay).
- **Engine:** engine 3.0.0, skill 1.0.0.
- **Pre-SDD:** version 1.0, chunks mode, `./pre-sdd-refunds-platform/` (master `refunds-platform-pre-sdd-master.md`, chunks 00 to 05, 07, 09 to 13; decision log `./pre-sdd-refunds-platform/decision-log.md`).
- **Conditions:** COND-01 (Refunds and Loyalty Product Owner, 2026-12-15).
- **Exceptions:** EXC-01 on SEC-01.1, granted by Product Owner (fixture owner) under ruling R23, expires 2027-12-31, review 2027-03-31.
- **Unknowns:** QD-01 (BUS-05.1), QD-03 (CAP-07.1), QD-04 (REL-01.2), QD-05 (BUS-06.1), QD-06 (SEC-02.1): Refunds and Loyalty Product Owner, due 2026-11-20; QD-02 (SEC-01.1): Legal Counsel, due 2026-11-20.
- **Open items:** open: OI-06; accepted and applied: OI-01, OI-02, OI-03, OI-07, OI-08, OI-10, OI-11, OI-12, OI-13; adjusted: none; deferred: none; rejected: OI-05; decided but pending application: OI-04, OI-09.
- **Questions only a BRD owner can answer** (requests to `brd-unifier`, all `Open`): HR-001 (REFUNDS/NFR-05 seconds), HR-002 (LOYALTY/NFR-04 minutes), HR-003 (who confirms the data-protection law), HR-004 (countries, languages, formats, accessibility), HR-005 (customer identity and member sign-in).
- **Policy choices without a source:** CAP-07.1 and CAP-07.2 (P99 2000 ms: REFUNDS/NFR-05 leaves the seconds open, LOYALTY states none); REL-01.1 (99.9 %: REFUNDS/NFR-02 states hours a month, not a percentage) and REL-01.2 (99.9 %: LOYALTY/NFR-04 leaves the minutes open). The review items the policy accepted change text only and add no behaviour, except OI-03's risk R7, a risk record; the group confirms kept BRD-stated values and the appendix defaults.
- **Neither source BRD is Approved:** REFUNDS v1.5 and LOYALTY v1.7 are `In Review`.
