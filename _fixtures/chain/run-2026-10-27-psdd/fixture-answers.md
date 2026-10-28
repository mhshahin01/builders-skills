# Fixture answers: Pre-SDD fixture run, Refunds Platform

Run folder: `run-2026-10-27-psdd`. Prepared 2026-10-27 (UTC) for Task 7.2 of the pre-SDD unifier build. The run brief is [run-brief.md](./run-brief.md).

## How to use this file

- **Fixture owner:** `Product Owner stand-in`, named as in the FC stand-in records ([standins/refunds/grill-me-session.md](./standins/refunds/grill-me-session.md), [standins/loyalty/grill-me-session.md](./standins/loyalty/grill-me-session.md)). Every answer below is the fixture owner's answer: actor `{ "type": "fixture", "name": "Product Owner stand-in" }`, which the engine records as `Fixture: Product Owner stand-in (test-run policy)`. Two answers use another actor, named where they apply: the answer policy is recorded by the fixture owner as a person actor named `Product Owner (fixture owner)` (§ 1), and the one time-bound exception is granted by that same person actor (§ 9, ruling R23). No answer in this run carries the real owner's name.
- **The BRDs come first.** Every value the BRDs state is left to the skill's pre-fill (step 6). A fixture value applies only to an entry that is still `Open` after the pre-fill. Where this file says "if pre-filled, keep", the fixture owner confirms the BRD value (a fact) or the answer policy keeps it (a choice), and the fixture value is not used.
- **A fixture value replaces a proposal.** Where this file gives a value for an entry of REL-03 or REL-04, the fixture owner's value is the answer, and the skill's proposal beside that entry is not taken (a person's own value clears it).
- **Nothing else is a fact.** A fact only a person gives that this file does not answer stays `Open`, with its owner name and due date from § 8. Never fill it from a guess, a worked example, or a typical value.
- **Units** are the engine's row units: CAP-01 transactions/day, CAP-07 ms, REL-01 %, REL-03 s, REL-04 s, DAT-02 GB/day.
- Each value carries its **reason**. The reason says why the value was chosen for this fixture; it is not BRD evidence.
- **Entry IDs** below assume no entry of the row was removed. The engine numbers a new entry one above the highest number the row ever used, so after a removal the second entry may be `.3` or higher: read the real ID from the change `derive` prints, and match entries by label and scope.

## 1. The answer policy

| Item | Answer | Actor | Reason |
|---|---|---|---|
| `set-policy` | `{ "label": "test-run policy", "stand_ins": ["Approver"] }` | Person `Product Owner (fixture owner)` | Coordinator ruling (2026-10-27): the fixture owner records the policy, never the real owner's name, because a fixture run must not put the owner's name on a decision he did not make. The engine accepts `set-policy` from a person; if it refused this person actor, the fixture actor `Product Owner stand-in` would record it instead. The label matches the engine's own tests. |
| Stops it names | G1 review stop, G2 review stop | (recorded with the policy in `decision-log.md` § Walkthrough and delegation history) | "Continue at G1 and G2" in the test-run policy. It never passes the G3 sign-off stop. |

The policy's labels then read `Policy: test-run policy (set by Product Owner (fixture owner), <YYYY-MM-DD>)` and `Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), <YYYY-MM-DD>)`, with the date the engine stamps.

## 2. Intake and start conditions

| Question | Answer | Reason |
|---|---|---|
| System name | `Refunds Platform` (slug `refunds-platform`) | The FC SDD for these two BRDs is `sdd-refunds-platform`, and Task 7.2 names the folder `pre-sdd-refunds-platform`. |
| Source BRDs | Both: `REFUNDS` = `../brd-refunds-portal/refunds-portal-brd-master.md`, version 1.5, status `In Review`; `LOYALTY` = `../brd-loyalty-points/loyalty-points-brd-master.md`, version 1.7, status `In Review` | The FC SDD's Document Lineage lists both as its parent BRDs, and one Pre-SDD covers one system (SKILL.md step 4). |
| BRD keys (the skill proposes them in one line) | Accept `REFUNDS` and `LOYALTY` | The keys the FC SDD already uses. |
| Neither BRD is `Approved` (both covers read `In Review`): go on? | Go on | Fixture choice: the run tests the Pre-SDD hop on the FC baseline as it is. The skill records the answer in `decision-log.md`, and chunk 00 and the handoff summary name both BRDs as not `Approved`. |
| Confirmer's name | `Product Owner stand-in` (the fixture owner) | Under the test-run policy, the fixture owner answers and confirms in the person's place. |

## 3. Classification and overlay (stage 1 and the start of stage 2)

Use these only if the entry is still `Open` after the pre-fill (the BRDs do not state either row).

| Entry | Value | Reason |
|---|---|---|
| HDR-07.1 | `greenfield` | Refunds are handled on paper and by phone today (REFUNDS 01, 02 Challenges), and Loyalty Points is a new program: no software estate is replaced. No chunk 06. |
| HDR-08.1 | `cloud` (kind stays `target`; evidence: "provider-hosted public cloud; no provider is a hard constraint") | Fixture choice that gives the path `GF-CL`. Kept `target`, so no option is failed on hosting. |
| HDR-09.1 | `None: there is no source platform; refunds are on paper and by phone today` | Follows HDR-07. |
| HDR-10.1 | `none` | Follows HDR-07. |
| Overlay switch (`set-overlay`) | `applies: false` | HDR-10 is `none`, so there is no migration: no chunk 08, no OVL entries count, and the migration owner role does not apply. |

## 4. Failure scopes and recovery (case: two scopes, two strategies)

**Entry layout.** The fixture sizes recovery per failure scope only. REL-05, REL-03 and REL-04 each hold exactly the two entries below, `.1` for scope `region` and `.2` for scope `az`. If the skill added other entries to these rows, the fixture owner removes the added ones first (`remove`, reason "this fixture sizes recovery per failure scope only"), then adds or relabels so the layout matches.

| Entry | Label | Scope | Value | Reason |
|---|---|---|---|---|
| REL-05.1 | Loss of a whole region | (the value is the scope) | `region` | One of the two scopes the fixture exercises. Primary entry, so the DR diagram shows the regional strategy. |
| REL-05.2 | Loss of one zone | (the value is the scope) | `az` | The second scope. The engine gives `az` local high availability, so the two scopes get different strategies. |
| REL-03.1 | Whole platform, region loss | `region` | `14400` (4 hours) | With REL-04.1 the engine picks pilot light for `region` (RTO above 1 hour and not above 4 hours). Customers can wait a few hours for refunds and points after a regional disaster; payouts are retried (REFUNDS NFR-01). |
| REL-03.2 | Whole platform, zone loss | `az` | `300` (5 minutes) | A zone loss must stay well inside the 2 hours a month of REFUNDS/NFR-02. |
| REL-04.1 | All refund and points data, region loss | `region` | `900` (15 minutes) | Asynchronous copy to the recovery region; lost minutes are rebuilt from payout results and point-of-sale records. |
| REL-04.2 | All refund and points data, zone loss | `az` | `5` (5 seconds) | Refund money is never lost or paid twice (REFUNDS/NFR-01), so a zone loss may lose only seconds. Not 0, so the run exercises asynchronous replication and no zero-loss conflict. |

Expected engine result (read it from `derive` and `compute`, never by hand): `region` gets pilot light, `az` gets local high availability, the topology is the primary and recovery location shape (`regional`), and no shape conflict.

## 5. Availability and latency proposals (case: policy-accepted proposal for REL-01)

| Entry | Fixture answer | Reason |
|---|---|---|
| REL-01 (every entry) | **No fixture value.** The skill proposes a value beside each `Open` entry (REFUNDS/NFR-02, no more than 2 hours of disruption a month, is the reason it should cite for the refund journeys), and the answer policy takes each proposal with `accept-proposal`. | The case Step 2 asks for: a policy-accepted proposal on REL-01. A proposal for a journey no source gives a value for (the LOYALTY journeys: LOYALTY/NFR-04 is still an open question) is a policy choice without a source, and the handoff summary lists it. |
| CAP-07 (every entry) | **No fixture value.** The answer policy takes the skill's proposal for each `Open` entry. | CAP-07 is a proposal row and a critical row. Leaving it to the policy keeps the facts in this file to what only a person gives. |
| Fallback, only if the skill made no proposal for an `Open` REL-01 or CAP-07 entry | REL-01: `99.5`; CAP-07: `2000` | So the run can still reach G3. Using a fallback is a skill finding: the run report names each entry it was used on. |

## 6. Hard entries (case: one hard row under a time-bound exception)

The seven default hard rows are BUS-07, BUS-08, SEC-01, SEC-04, DAT-03, DAT-04 and DAT-06. SEC-01 stays `Open` under the exception in § 9. Each other value below is used only if its entry is still `Open` after the pre-fill.

| Entry | Value | Reason |
|---|---|---|
| BUS-07.1 | `Customer personal data and member data are not stored or processed outside the European Union.` | A prohibition the BRDs do not state; it matches DAT-04 and the EUR currency in ECO-02. |
| BUS-08.1 | `No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd).` | The BRDs name no customer contract; CardPay Ltd is the REFUNDS 08 payment provider. |
| SEC-01.1 | **Stays `Open`.** Owner name `Legal Counsel`, due `2026-12-15`. | The applicable data-protection law is an open, hard BRD dependency needed before go-live (REFUNDS 02 Dependencies, LOYALTY 02 Dependencies). It is the one hard row the exception lifts. |
| SEC-04.1 | `Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year.` | Shape words only, no product. |
| DAT-03.1 | If pre-filled (for example `sensitive` from REFUNDS/NFR-04), keep. Otherwise `sensitive`. | Customer personal data and card payout records (REFUNDS/NFR-04, REFUNDS 08). |
| DAT-04.1 | `yes`, with factors `primaryLocation` = `Within the European Union` and `recoveryLocation` = `Within the European Union, in a second region` | Residency held with both locations, so `RESIDENCY-region` does not block; the recovery location fits the `region` scope. |
| DAT-06.1 | `Refund requests, decisions and payout results are kept for 10 years for tax records; customer contact details are deleted 90 days after a request ends; a member's points history is kept while the membership lasts and deleted within 30 days after it ends.` | Answers REFUNDS/NFR-06 and NFR-07 for the fixture. Ten years matches `retentionDays` in § 7. |

Any other entry that is `hard` and still `Open` at stage 4 (for example one the skill made hard from a BRD statement) gets no fixture value: the run reports it, and G3 waits.

## 7. Facts only a person gives, and other open values

Use each value only if the entry is still `Open` after the pre-fill. Facts that keep their BRD pre-fill are kept by the fixture owner (`confirm`).

**Entry layout for the repeating rows the fixture sizes:** CAP-01 holds `.1` and `.2` below; DAT-01 and DAT-05 hold `.1` and `.2` below. Extra added entries on these rows are removed by the fixture owner first (reason "this fixture sizes this row with the entries in fixture-answers.md"); BUS-02, CAP-07, REL-01, INT-01 and INT-03 keep the entries the skill gives them.

| Entry or factor | Value | Reason |
|---|---|---|
| HDR-01.1 | `Refunds Platform` | The intake system name. |
| HDR-02.1 | `Head of Retail` | REFUNDS 09 names the Head of Retail as a candidate owner of the Business Objectives. Role titles stand in for names: no person is named in the BRDs, and the fixture implies no real person. |
| HDR-03.1 | `Refunds and Loyalty Product Owner` | One product owner for both BRDs of this system. |
| HDR-04.1 | `Lead Architect, Retail IT` | Retail IT owns Point-of-Sale Records (REFUNDS 08). |
| HDR-05.1 | `Architecture Review Board` | Fixture role. |
| HDR-06.1 | `Finance Director` | Fixture role. |
| CAP-01.1 | Label `Points movement (earned on a branch purchase, or taken back after a refund)`; value `2000` | The busiest transaction type, so it is the primary entry the engine sizes for. About 50 member purchases a branch a day across the 40 branches (REFUNDS 02 Facts names 40 branches); neither BRD gives this volume. |
| CAP-01.2 | Label `Refund request`; value `40` | REFUNDS 02 Facts gives about 1,200 a month; the daily figure needs a month length, so the BRD does not state it for this row (prefill rule 4). The fact owner gives 1,200 over 30 days. |
| CAP-03.1 | `300 peak simultaneously active users (customers, members and branch managers)` | Fixture forecast. |
| CAP-04.1 | If pre-filled (`3` from REFUNDS 02 Fact 2 or REFUNDS/NFR-03), keep. Otherwise `3`, window `3 weeks of seasonal sales`. | The BRD's own number. |
| CAP-06.1 | `Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded`, with factors `requestKB` = `4`, `responseKB` = `16` | Fixture payloads, so the bandwidth calculation has inputs. |
| CAP-12.1 | Mark `N/A`, reason `No AI, ML or media jobs are in scope of either BRD.` | Exercises an `N/A` with its reason (fixture owner). |
| DAT-01.1 | Label `Refund requests, decisions and payouts`. Value: if pre-filled from REFUNDS 03, keep; otherwise `Refund request, decision record and payout, with the Refunds Portal as the system of record`. Factor `storeKind` = `relational`. | A refund decision and its payout change together (REFUNDS/NFR-01). |
| DAT-01.2 | Label `Points ledger`. Value: if pre-filled from LOYALTY 03, keep; otherwise `Points balance and points movements, with Loyalty Points as the system of record`. Factor `storeKind` = `relational`. | Every movement follows the points rules (LOYALTY/NFR-01). G3 checks `storeKind` on every DAT-01 entry. |
| DAT-02.1 | Keep the value the engine derives (CALC-10). Factors `storedKB` = `8`, `initialGB` = `1`, `retentionDays` = `3653` | Fixture facts; 3653 days is the 10 years of DAT-06. The derived value is a fact, so the fixture owner confirms it, never the policy. |
| DAT-05.1 | `strong`, factor `transactionNeed` = `yes` | Never lost or paid twice (REFUNDS/NFR-01). |
| DAT-05.2 | `strong` | Points accuracy (LOYALTY/NFR-01). |
| INT-08.1 | `public` (kind stays `target`) | Customers and members reach the platform over the internet; partners are reached as named in REFUNDS 08 and LOYALTY 08. No `cidrPrefix`. |
| ECO-01.1 | `One-time budget 250,000 EUR; run cost up to 12,000 EUR a month`, factor `budgetPressure` = `balanced` | Fixture envelope, read beside each option's TCO (DT-10). `balanced` keeps the engine from preferring backup and restore. |
| ECO-02.1 | `Currency EUR; operating expense preferred` | The FC SDD counts 1 point per 1 EUR. |
| ECO-03.1 | `36 months` | The same horizon as § 10. |
| ECO-05.1 | Mark `N/A`, reason `The business states no energy or environmental footprint goal for this system.` | A second `N/A` with its reason. |

**Left `Open` on purpose** (each gets its owner name and due date from § 8, which exercises the G1 rule): BUS-04, BUS-05, CAP-05, CAP-10, every INT-03 entry, and every other entry this file does not answer.

## 8. Owner names and due dates for every entry still `Open`, and for every unknown

Asked in batches per group, as the skill does; this one table answers every batch. Owner names and due dates come only from the fixture owner (the engine refuses them from the skill and the policy).

| Entries | Owner name | Due |
|---|---|---|
| SEC-01.1 | `Legal Counsel` | `2026-12-15` |
| Stage 1 entries still `Open` (BUS-05 and any other) | By the owner-code rule below | `2026-11-20` |
| Header and overlay rows (no owner code) | `Refunds and Loyalty Product Owner` | `2026-11-30` |
| Owner code starting with `B` (B, B+E, B+D, B+Sec, B+Ops, B+Fin) | `Refunds and Loyalty Product Owner` | `2026-11-30` |
| Owner code starting with `E` (E, E+Sec) | `Lead Architect, Retail IT` | `2026-11-30` |
| Owner code starting with `D` (D, D+B, D+Sec, D+Legal, D+Ops) | `Data Owner, Retail Finance` | `2026-11-30` |
| Owner code starting with `Sec` (Sec, Sec+D, Sec+Ops) | `Security Lead` | `2026-11-30` |
| Owner code starting with `Ops` (Ops, Ops+E) | `Operations Lead` | `2026-11-30` |
| INT-03 entry for an external system the BRDs name an owner for | That owner, as the BRD names it (for example `CardPay Ltd`, `Retail IT team`, `MsgHub`) | `2026-11-30` |
| Every unknown `QD-NN` | The owner name of the entry it is about, by the rules above; a question with no entry: `Refunds and Loyalty Product Owner` | `2026-11-20` |

Reason: one owner per responsibility keeps the batches short; the dates give stage 1 questions three weeks and the rest about five, and SEC-01 the legal confirmation window. No unknown is closed in this run.

## 9. The time-bound exception (ruling R23)

| Field | Value |
|---|---|
| Op | `add-exception` |
| Actor | Person `{ "type": "person", "name": "Product Owner (fixture owner)" }` |
| Entry | `SEC-01.1` |
| Reason | `The applicable data-protection law is a hard BRD dependency needed before go-live (REFUNDS 02 and LOYALTY 02 Dependencies), not before the SDD; the SDD may start while Legal Counsel confirms it by 2026-12-15.` |
| Expires | `2027-12-31` |
| Review | `2027-03-31` |
| When | Stage 4, step 3 (Validate), after the decisions and before the write-up, so the exception is part of the content every signer reviews |

Reason for the actor: the engine and the skill let only a named person grant an exception (`add-exception` refuses a fixture actor). Ruling R23 (2026-10-27): the fixture owner acts as the named person for this one time-bound exception, so the exception path runs end to end. The person name is `Product Owner (fixture owner)`, never a name that contains "stand-in", because the skill forbids a stand-in granter (coordinator ruling, 2026-10-27). The run records this choice in `decision-log.md` (§ Walkthrough and delegation history and § Sign-off record) and in its final report. Reason for the dates: the review date sits before the expiry, and the expiry is far enough out that the fixture's G3 result stays valid for regression use through 2027. A recompute after 2027-12-31 reads G3 `Blocked`, because the exception no longer lifts `OPEN-SEC-01.1`; the fixture's results hold as of the run date.

## 10. Options (case: two options with approved weights)

**The two shapes.** The skill names the options (its rules ask for the engine's target shape and the credible alternatives). The fixture costs below are for these two shapes. If the skill names other options, the fixture owner adds the missing shape (`set-option`) and removes any option without a fixture cost (`remove-option`, reason "no fixture cost for this shape"), so the comparison holds exactly these two.

| Option | Name | Shape |
|---|---|---|
| First (expected `OPT-01`) | One primary region with a pilot-light recovery region | `hosting: cloud`, `topology: regional`, `dr: pilot`, `network: public`, `data: "relational, strongly consistent; synchronous inside the primary region, asynchronous to the recovery region"` |
| Second (expected `OPT-02`) | One primary region with a warm-standby recovery region | `hosting: cloud`, `topology: regional`, `dr: warm`, `network: public`, the same `data` |

Both should pass every hard check (the engine decides).

| Item | Value | Reason |
|---|---|---|
| Pilot-light option costs | One-time `180000`, monthly `6500` (EUR) | Fixture costs inside ECO-01. |
| Warm-standby option costs | One-time `210000`, monthly `9800` (EUR) | A running recovery region costs more each month. |
| TCO horizon (`set-horizon`) | `36` | Matches ECO-03. |
| Weights (`set-weights`), approved by the fixture owner | `nfr_fit 3`, `one_time_cost 1`, `recurring_tco 2`, `delivery_time 1`, `operability 2`, `security_compliance 2`, `reversibility 1`, `uncertainty 1` | Fit to the measurable NFRs counts most, then running cost, operability and security. Every criterion counts, so every option needs every score. |
| Scores | Keep every score the skill proposes: the fixture owner confirms each one unchanged (`confirm` with `option` and `criterion`). | Scores are the architect's assessment; the fixture tests that a person confirms them (the policy never may). |
| Fallback scores, only for a score the skill did not propose | Pilot light: nfr_fit 4, one_time_cost 4, recurring_tco 4, delivery_time 4, operability 3, security_compliance 4, reversibility 4, uncertainty 3. Warm standby: nfr_fit 5, one_time_cost 3, recurring_tco 2, delivery_time 3, operability 3, security_compliance 4, reversibility 3, uncertainty 4. | So the weighted score can be computed. Using a fallback is reported. |
| Excluded options | None | Both shapes meet BUS-07, BUS-08, SEC-04, DAT-03, DAT-04 and DAT-06 as stated in § 6. |

## 11. Stage 4 decisions and group confirms (case: appendix factors confirmed per group)

| Item | Answer | Reason |
|---|---|---|
| "Confirm all pre-filled values in this group?" (stage 2 at each group's end, and stage 4) | Yes, in two steps: the answer policy takes it first (`confirm-group` with the policy actor: a stated default is a choice, and the engine skips the facts), then the fixture owner confirms the facts left `Estimated` in the group (`confirm-group` with the fixture actor). | The appendix factors are the policy appendix's stated defaults, so they are confirmed per group by the group confirm: `utilization`, `networkOverhead`, `meanLatencyMs`, `callsPerTxn` and `requestFactor` with group CAP, and `indexFactor` and `copies` with group DAT. No appendix value is changed. |
| Topology override | None (`auto`) | The engine's target shape stands. |
| DR override per scope | None | The engine's strategy per scope stands. |
| Chosen option (`decide`, `option`) | The option with the higher weighted score (`CALC-22`) once the scores are confirmed; on a tie, the one with the lower TCO (`CALC-21`). Reason recorded with the decision: `Highest weighted score under the approved weights; meets REL-03.1 and REL-04.1 for scope region.` | A stated rule, so the fixture does not guess the engine's numbers ahead of the run. |

## 12. The G3 sign-off stop (case: Approved with conditions)

In this order: checklist ticks, then the condition, then the signatures, each signature in a patch of its own.

| Item | Answer | Actor | Reason |
|---|---|---|---|
| G3-09 | `N/A`, reason `Greenfield (HDR-07): there is no existing estate.` | Fixture owner | No chunk 06. |
| G3-10 | `N/A`, reason `No migration overlay (HDR-10 none).` | Fixture owner | No chunk 08. |
| G3-01 to G3-08, G3-11 to G3-14 | `Done`, once the chunk the line names holds its evidence | Fixture owner | Under the test-run policy, the fixture owner ticks in the person's place. G3-11 accepts EXC-01 and the risks chunk 10 lists. A line whose evidence is missing stays `Open`, and the run reports it. |
| Condition (`add-condition`) | Text `CardPay Ltd confirms in writing that it refunds branch card purchases to the original card, before the SDD fixes the payout integration.`, owner `Refunds and Loyalty Product Owner`, due `2026-12-15` | Fixture owner | An open, hard BRD dependency (REFUNDS 02 Dependencies) that should not stop the SDD from starting; with one condition recorded, an approved G3 reads `Approved with conditions`. |
| Who signs each role? (asked once; the header rows name others for four roles) | The Approver stand-in signs every applicable role; nobody else signs, and no role is marked not applicable. | Fixture owner | The header rows hold fixture role titles, not people who can sign. The migration owner does not apply (no overlay). |
| Each applicable role's decision | `Approved with conditions` | Approver stand-in (policy actor) | Only when the engine's G3 result names no problem other than the roles still to sign; COND-01 is recorded first. |

## 13. Hand-off

| Question | Answer | Reason |
|---|---|---|
| "Next hop: SDD (Software Architect). Start now, or later?" | `later` | The SDD hop is Task 7.3's separate run; the request to the Software Architect is raised with State `Later`. |
