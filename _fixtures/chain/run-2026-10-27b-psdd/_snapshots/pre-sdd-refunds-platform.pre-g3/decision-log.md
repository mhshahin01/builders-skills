<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: Pre-SDD - Refunds Platform
PURPOSE: Single home for the decision story behind the Pre-SDD: answers, proposals, review decisions, delegations, and the G3 sign-off record; the content chunks hold only the settled values and shape.
MAINTENANCE: New decisions are added here, never narrated in the content chunks.
-->

# Decision Log - Refunds Platform

## How to read

The numbered chunks hold the settled values and shape. The project state ([studio/project-state.json](./studio/project-state.json)) holds each value of record with who confirmed it and when, and its history holds every op with its actor; the patches sent are in [studio/patches/](./studio/patches/). This file holds how each decision was reached. This is a test run: facts only a person gives come from the fixture owner (`Fixture: Product Owner stand-in (test-run policy)`), and the choices with a recommended option or stated default are taken by the answer policy (`Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)`).

## Proposal record

| Entry | Proposed value | Reason (tied to the BRD where it can be) | Proposed | Outcome | Decided by | Decided | Rule home |
|-------|----------------|------------------------------------------|----------|---------|------------|---------|-----------|
| REL-01.1 | 99.9 % | REFUNDS/NFR-02 allows no more than 2 hours of disruption a month, planned maintenance included; 99.9 % keeps the downtime budget (CALC-13) inside that limit | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-01) |
| REL-01.2 | 99.9 % | LOYALTY/NFR-04 asks for the points screens at any time of day but gives no minutes; the same target as REL-01.1; no source states this value | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-01) |
| REL-03.1 | 7200 s | REFUNDS/NFR-02 limits disruption to 2 hours a month, so one recovery fits inside that limit | 2026-10-27 | Changed to 14400 s (scope region) | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-03) |
| REL-04.1 | 0 s | REFUNDS/NFR-01: refund money is never lost or paid twice | 2026-10-27 | Changed to 900 s (scope region) | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-04) |
| CAP-07.1 | 2000 ms | REFUNDS/NFR-05 asks for no wait on everyday actions but leaves the seconds open | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03b](./03b-register-capacity.md#cap-07) |
| CAP-07.2 | 2000 ms | LOYALTY 10 states no performance measure for the points screens; the same bound as CAP-07.1; no source states this value | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03b](./03b-register-capacity.md#cap-07) |

REL-03.2 and REL-04.2 were added with their values by the fixture owner, so no proposal was made beside them.

## Clarification register

All 14 open items of the baseline review (OI-01 to OI-14) were decided on 2026-10-27 by the answer policy `Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)`, which took each Accept recommendation (or the `No change` recommendation). Facts the applied answers needed (the owner and due date of each new unknown) came from `Fixture: Product Owner stand-in (test-run policy)`, as fixture-answers.md § 8 gives them.

### OI-01 - The register guide points to chunk 08 and OVL rows

**Question:** Replace the 03a sentence that names chunk 08 and the OVL rows?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. Applied as text in 03a.

**Open remainder:** None.

**Rule home:** [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register)

### OI-02 - Default source "project rule CAP-08" and "project rule OPS-04"

**Question:** Change the engine-written default source labels?

**Decision record, 2026-10-27:** The Recommended Answer reads `No change`; the policy took it, so the item is Rejected with the policy as decider. The label is reported to the skill owner as an engine wording issue.

**Open remainder:** None in this Pre-SDD.

**Rule home:** [03b § CAP-08](./03b-register-capacity.md#cap-08)

### OI-03 - The seasonal peak factor is applied to points movements

**Question:** Record an unknown on CAP-04.1 about the seasonal factor of the points movements?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. The unknown needs an owner and a due date, which only a person gives, so the policy did not apply it; the fixture owner applied it as QD-06 (owner Refunds and Loyalty Product Owner, due 2026-11-20 per fixture-answers.md § 8, where the recommendation read 2026-11-30), patch `20261027T190538Z-review1-OI-03-07-10-unknowns.json`. Status Adjusted - applied.

**Open remainder:** QD-06, Refunds and Loyalty Product Owner, 2026-11-20.

**Rule home:** [10 § 10.1](./10-validation-risks-unknowns.md#101-validation-and-unknowns)

### OI-04 - SEC-02.1 cites NFR-04 without its BRD key

**Question:** Rewrite SEC-02.1 with the keyed reference REFUNDS/NFR-04?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. SEC-02.1 is Confirmed (protected), so only a person may change it; the fixture answers hold no such change. Status Decided - waiting for a person.

**Open remainder:** A person runs `set` and `confirm` on SEC-02.1 with the keyed text; owner Refunds and Loyalty Product Owner.

**Rule home:** [03e § SEC-02](./03e-register-security.md#sec-02)

### OI-05 - INT-03.1 has no label

**Question:** Label INT-03.1 "Payment Provider (CardPay Ltd)"?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. The policy patch (`set` label on INT-03.1) was refused by the engine: INT-03 is a fact row the policy never writes. The recommendation named the skill's agent actor as the one to run the op, but the accept loop applies an answer by ops the decider may run, under the decider's name, so the actor was not changed. Status Decided - waiting for a person.

**Open remainder:** A person or the fixture owner runs `set` with the label on INT-03.1.

**Rule home:** [03f § INT-03](./03f-register-integration.md#int-03)

### OI-06 - The targets table calls daily volumes "Peak transactions"

**Question:** Relabel the CAP-01 rows of 04 § 4.1 as daily transactions?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. Applied as text.

**Open remainder:** None.

**Rule home:** [04 § 4.1](./04-targets-and-calculations.md#41-targets)

### OI-07 - Region recovery at REL-03.1 against REFUNDS/NFR-02

**Question:** Record the exclusion decision as an unknown on REL-02.1, link it from R-01, and state the conflict plainly in 05 § 5.3?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. The fixture owner applied the unknown as QD-07 (owner Refunds and Loyalty Product Owner, due 2026-11-20 per fixture-answers.md § 8, where the recommendation read 2026-11-30); the text in 05 § 5.3 and R-01 was applied. Status Adjusted - applied.

**Open remainder:** QD-07, Refunds and Loyalty Product Owner, 2026-11-20.

**Rule home:** [05 § 5.3](./05-target-shape.md#53-reading-the-shape)

### OI-08 - Option costs and scores show who but not when

**Question:** Add the confirmation time of the option costs and scores?

**Decision record, 2026-10-27:** The Recommended Answer reads `No change`; the policy took it. Rejected with the policy as decider. The missing At column is reported to the skill owner as an engine issue.

**Open remainder:** None in this Pre-SDD.

**Rule home:** [07 § 7.1](./07-options-and-economics.md#71-options)

### OI-09 - DT-15 says the risks are accepted while G3-11 is Open

**Question:** Reword the DT-15 outcome?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. Applied as text.

**Open remainder:** None.

**Rule home:** [09 § 9.2](./09-decisions.md#92-decision-tree)

### OI-10 - CAP-07.2 has no unknown to confirm it

**Question:** Record an unknown on CAP-07.2 and name it in R-06?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. The fixture owner applied the unknown as QD-08 (Refunds and Loyalty Product Owner, 2026-11-20); R-06 updated. Status Accepted - applied.

**Open remainder:** QD-08, Refunds and Loyalty Product Owner, 2026-11-20.

**Rule home:** [10 § 10.2](./10-validation-risks-unknowns.md#102-risks)

### OI-11 - R-06 cites HR-001 and HR-002

**Question:** Drop the board request IDs from R-06?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. Applied as text. (HR-001 and HR-002 exist on unifier-status.md; the Pre-SDD no longer cites them.)

**Open remainder:** None.

**Rule home:** [10 § 10.2](./10-validation-risks-unknowns.md#102-risks)

### OI-12 - 11 § 11.2 mentions a condition that does not exist

**Question:** Reword 11 § 11.2?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. Applied as text.

**Open remainder:** None.

**Rule home:** [11 § 11.2](./11-gate-and-sign-off.md#112-sdd-initiation-authorized-by)

### OI-13 - The lock list leaves out BUS-07.1 and BUS-08.1

**Question:** Add a G3 condition that names BUS-07.1 and BUS-08.1, and report the landing-map gap?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. `add-condition` is a person or fixture-owner op, and its owner and due date are facts only a person gives; fixture-answers.md § 12 gives one condition only (CardPay Ltd), so no second condition was recorded. Status Decided - waiting for a person. The landing-map gap is reported to the skill owner.

**Open remainder:** A person records the condition with its owner and due date, before the signatures of a later G3 round.

**Rule home:** [12 § 12.2](./12-sdd-handoff-guide.md#122-locked-items)

### OI-14 - Chunk 12 does not say where the store kind stands

**Question:** Reword the § 12.3 §6 Notes row?

**Decision record, 2026-10-27:** Accept recommendation, by the policy. Applied as text; the engine-side fix is reported to the skill owner.

**Open remainder:** None.

**Rule home:** [12 § 12.3](./12-sdd-handoff-guide.md#123-where-each-item-lands-in-the-sdd)

## Marker register

None yet.

## Business review register

None.

## Walkthrough and delegation history

### Action entries

**Start conditions, 2026-10-27:** REFUNDS v1.5 and LOYALTY v1.7 are both `In Review`, not `Approved`. Asked once whether to go on; Fixture: Product Owner stand-in (test-run policy) chose to go on (fixture-answers.md § 2). Rule home: [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage).

**Intake, 2026-10-27:** system name `Refunds Platform` (slug `refunds-platform`), source BRDs REFUNDS and LOYALTY with their proposed keys accepted, confirmer `Product Owner stand-in`; answered by the fixture owner. Input path `prompt` and output `chunks` came from the run arguments, so neither prompt was asked.

**Answer policy, 2026-10-27:** `Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)`, recorded with the `set-policy` op by the person `Product Owner (fixture owner)` (the engine accepted the person actor), with the stand-in `Approver`. It takes the recommended option or stated default only, may pass the G1 and G2 review stops, and never passes the G3 sign-off stop. Its first answer was the CAP-07.1 proposal in stage 1. It sets no fact, owner, date, cost, weight, score, decision, `N/A`, tick or exception. The run brief names it the test-run policy of Task 7.2.

**Input path, 2026-10-27:** prompt for every stage; no switch.

**Pre-fill, 2026-10-27:** the skill added the repeating entries and pre-filled the register from both BRDs with citations, and made the six proposals above.

**Stage 1, 2026-10-27:** five batches. The fixture owner answered HDR-07.1, HDR-08.1, CAP-01.1, CAP-01.2, CAP-03.1, CAP-04.1 (kept the BRD value), REL-03.1, REL-03.2, REL-04.1, REL-04.2, REL-05.1, REL-05.2 (the zone entries added), DAT-02.1 factors and the derived value, and ECO-01.1; the policy accepted the proposals of CAP-07.1, CAP-07.2, REL-01.1 and REL-01.2. BUS-05.1 stays Open with its owner and due date. Unknowns QD-01 to QD-05 were recorded with the owners and due dates the fixture owner gave.

**Stage 2, 2026-10-27:** groups HDR, BUS, SEC, DAT, INT, CAP, REL, OPS, ECO. The fixture owner answered the header rows HDR-01 to HDR-06, HDR-09, HDR-10, switched the migration overlay off (`set-overlay applies: false`), answered BUS-08.1, SEC-04.1, DAT-01.2 storeKind, DAT-04.1 with its locations, DAT-05.1 with transactionNeed, DAT-05.2, DAT-06.1, INT-08.1, CAP-06.1 with its factors, ECO-02.1, ECO-03.1, marked CAP-12.1 and ECO-05.1 `N/A` with their reasons, and gave the owner name and due date of every entry still Open. Each group ended with "Confirm all pre-filled values in this group?": the policy took it (`confirm-group`, skipping facts) for HDR, BUS, SEC, DAT, INT, CAP, REL and OPS; no fact was left `Estimated` for the fixture owner to confirm, and ECO had nothing left `Estimated`.

**G1 review stop, 2026-10-27:** G0 and G1 met (engine). Passed by the policy, which names the stop.

**Stage 3, 2026-10-27:** the skill named OPT-01 (one primary region with a pilot-light recovery region) and OPT-02 (one primary region with a warm-standby recovery region) and proposed all sixteen scores with reasons. The fixture owner gave the four costs, the horizon of 36 months and the weights, and confirmed every cost and score unchanged. No option was excluded or removed.

**G2 review stop, 2026-10-27:** G2 read `blocker` (OPEN-SEC-01.1, DT-15-BLOCK). Passed by the policy, which names the stop.

**Stage 4, 2026-10-27:** nothing was left `Estimated`, so no group confirm was needed. Decisions by the fixture owner: no topology override, no DR override per scope, chosen option OPT-01, by the stated rule of fixture-answers.md § 11 (the higher weighted score, CALC-22@OPT-01 above CALC-22@OPT-02). Reason for the choice: highest weighted score under the approved weights; meets REL-03.1 and REL-04.1 for scope region. Condition that would reverse it: a tighter REL-03.1 or REL-04.1, a business decision that a region loss must stay inside REFUNDS/NFR-02 (R-01), or a drill that misses REL-03.1. The `decide` op carries the option only (it takes a reason only with an override). Rule home: [09 § 9.4 ADR-DR-001](./09-decisions.md#adr-dr-001-resilience-topology).

**Exception, ruling R23, 2026-10-27:** at stage 4 step 3 (Validate), the person `Product Owner (fixture owner)` granted EXC-01 on SEC-01.1 (reason: the applicable data-protection law is needed before go-live, not before the SDD; Legal Counsel confirms by 2026-12-15), expiring 2027-12-31, review 2027-03-31. Under ruling R23 (decided 2026-10-27), the fixture owner acts as the named person for this one time-bound exception; the name contains no "stand-in". G2 then read `shortlist`. Rule home: [10 § 10.3](./10-validation-risks-unknowns.md#103-hard-entries-still-open).

## Sign-off record

No G3 round yet.

<!-- MASTER: refunds-platform-pre-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
