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

The numbered chunks hold the settled values and shape. The project state ([studio/project-state.json](./studio/project-state.json)) holds each value of record with who confirmed it and when, and its history holds every op with its actor. This file holds how each decision was reached: what was asked, what was offered, who answered, and under which policy. This run is a fixture run under the test-run policy: facts come from the named fixture owner (`Fixture: Product Owner stand-in (test-run policy)`), choices with a recommended option or a stated default from the answer policy (`Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)`).

## Proposal record

| Entry | Proposed value | Reason (tied to the BRD where it can be) | Proposed | Outcome | Decided by | Decided | Rule home |
|-------|----------------|------------------------------------------|----------|---------|------------|---------|-----------|
| CAP-07.1 | 2000 ms | REFUNDS/NFR-05 asks that customers and branch managers do not wait during everyday actions and leaves the seconds open | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03b](./03b-register-capacity.md#cap-07) |
| CAP-07.2 | 2000 ms | No LOYALTY source gives a response time; one screen target for the platform (policy choice without a source) | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03b](./03b-register-capacity.md#cap-07) |
| REL-01.1 | 99.9 % | REFUNDS/NFR-02 allows no more than 2 hours of disruption a month, planned maintenance included; the engine's CALC-13 confirms the monthly budget stays inside it | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-01) |
| REL-01.2 | 99.9 % | LOYALTY/NFR-04 asks for the points screens at any time of day, every day, with the minutes open (policy choice without a source) | 2026-10-27 | Accepted | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-01) |
| REL-03.1 | 3600 s | REFUNDS/NFR-02 allows 2 hours of disruption a month in total; a recovery inside 1 hour leaves room for maintenance | 2026-10-27 | Superseded: the fixture owner gave 14400 s for scope region | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-03) |
| REL-04.1 | 0 s | REFUNDS/NFR-01: refund money is never lost or paid twice | 2026-10-27 | Superseded: the fixture owner gave 900 s for scope region | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27 | [03c](./03c-register-reliability.md#rel-04) |

## Clarification register

Twelve of the thirteen open items from the review (pass 1: OI-01 to OI-11; application pass 2: OI-12, OI-13) are decided on 2026-10-27; OI-06 waits for the fixture owner.

### OI-01 - Option shapes and the asynchronous replication of the shape

**Question:** Should the shape text of OPT-01 and OPT-02 follow the engine shape (asynchronous inside the primary region), or should the shape change to synchronous replication inside the primary region?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). OPT-01 and OPT-02 shape data now read "relational, strongly consistent; asynchronous to the zone standby and to the recovery region" (derive patch 20261027T171100Z-review-OI-01-policy.json); Fixture: Product Owner stand-in (test-run policy) confirmed the unchanged costs and scores again (20261027T171130Z-review-OI-01-fixture-reconfirm.json). ADR-DATA-001 carries the rationale.

**Open remainder:** None.

**Rule home:** [07 § 7.1 Options](./07-options-and-economics.md#71-options)

### OI-02 - The SLO-15@region finding

**Question:** Is the region outage that outlasts the 30-day downtime budget a measurement question for the SDD, or an open business answer?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). The finding stands in 04 § 4.3, and the exclusions are named as open under REL-02.1; no value changed.

**Open remainder:** Whether a declared region loss counts against REL-01.1 and REL-01.2 (REL-02.1), with the Refunds and Loyalty Product Owner, due 2026-11-30.

**Rule home:** [04 § 4.3 What the Numbers Mean](./04-targets-and-calculations.md#43-what-the-numbers-mean)

### OI-03 - Peak active users read by no calculation

**Question:** How does the Pre-SDD treat the peak simultaneously active users of CAP-03.1, which no calculation reads?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). 04 § 4.3 states that CALC-02 and CALC-03 count only CAP-01.1, and risk R7 joins 10 § 10.2; no value changed.

**Open remainder:** The screen request rate as a CAP-01 entry, with the Refunds and Loyalty Product Owner (risk R7).

**Rule home:** [10 § 10.2 Risks](./10-validation-risks-unknowns.md#102-risks)

### OI-04 - Lock-list gap in the engine's landing map

**Question:** Do DAT-01, INT-03, CAP-08 and REL-10 join the lock list through the engine's landing map?

**Decision record, 2026-10-27:** Option A, the recommendation, accepted by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27); pending application, since the change is to the engine's landing map, outside this project.

**Open remainder:** The landing-map change; the lock list stays as the engine renders it until the engine changes.

**Rule home:** [12 § 12.2 Locked Items](./12-sdd-handoff-guide.md#122-locked-items)

### OI-05 - The granter of EXC-01

**Question:** Does EXC-01 on SEC-01.1 stand with Product Owner (fixture owner) as its granter?

**Decision record, 2026-10-27:** The Recommended Answer read No change; Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) took it, so the item is Rejected and no document changed. Ruling R23 and the history op `add-exception` (actor type `person`) record the granter.

**Open remainder:** None for this fixture run; outside a fixture run, a named person who owns the risk of SEC-01.1 grants the exception.

**Rule home:** [11 § 11.1 Gate Result](./11-gate-and-sign-off.md#111-gate-result)

### OI-07 - Chunk 13 chained in

**Question:** Is chunk 13 chained into the footers, the master and the chunk 00 indexes?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). The chunk 12 footer, the master (index row, dependency graph, reading order) and the chunk 00 Table of Contents and ID Index now carry chunk 13.

**Open remainder:** None.

**Rule home:** [Master, Handoff and Review](./refunds-platform-pre-sdd-master.md#handoff-and-review)

### OI-08 - Unsourced numbers in 02 § 2.5

**Question:** Do the tier thresholds stay in 02 § 2.5 without a fragment that holds them?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). 02 § 2.5 cites the recovery tier of § 2.1 and the entries REL-03.1, REL-04.1, REL-03.2 and REL-04.2 instead of the numbers.

**Open remainder:** None.

**Rule home:** [02 § 2.5 Closest Worked Example](./02-classification-and-path.md#25-closest-worked-example)

### OI-09 - BRD references without a key

**Question:** Does every BRD ID in BUS-02.2, CAP-07.2, REL-01.1, REL-01.2 and 01 § 1.4 carry its BRD key?

**Decision record, 2026-10-27:** Option A, the recommendation, accepted by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27); pending application, since the engine refused the four wording changes from the policy (the entries are Confirmed and protected).

**Open remainder:** A person applies the four wording changes and the 01 § 1.4 text in the next request.

**Rule home:** [03a BUS-02](./03a-register-business.md#bus-02)

### OI-10 - OVL rows cited in a chunk 08 that does not exist

**Question:** Does the register guide keep citing OVL rows and a chunk 08 this Pre-SDD does not have?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). The guide states that the overlay does not apply, so there are no OVL rows and no chunk 08.

**Open remainder:** None.

**Rule home:** [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register)

### OI-11 - "Source unknown" in the classification fragment

**Question:** How does the reader take the fragment's `source unknown` while HDR-09.1 confirms there is no source platform?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). 02 § 2.4 explains that `source unknown` is the unset source field of the overlay, not an open question; the fragment is unchanged.

**Open remainder:** None.

**Rule home:** [02 § 2.4 Migration Overlay](./02-classification-and-path.md#24-migration-overlay)

### OI-06 - Two due dates for the data-protection law

**Question:** Does QD-02 take the due date of SEC-01.1 (2026-12-15)?

**Decision record, 2026-10-27:** Not decided. A due date comes only from a person or the fixture owner; the policy does not take it, and the fixture answers give no other date.

**Open remainder:** The due date of QD-02, with the fixture owner (the dates of QD-02 and SEC-01.1 stand as given).

**Rule home:** [10 § 10.1 Validation and Unknowns](./10-validation-risks-unknowns.md#101-validation-and-unknowns)

### OI-12 - Review decisions recorded in the decision log

**Question:** Does the decision log record each decided review item?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). This register now holds one entry per decided item.

**Open remainder:** None.

**Rule home:** [Clarification register](#clarification-register)

### OI-13 - ADR-PERF-001 drivers

**Question:** Does the ADR-PERF-001 row name CAP-03.1, which no calculation reads?

**Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). The row in 09 § 9.5 adds CAP-03.1 and the pointer to risk R7.

**Open remainder:** None.

**Rule home:** [09 § 9.5 SDD ADRs Driven by This Pre-SDD](./09-decisions.md#95-sdd-adrs-driven-by-this-pre-sdd)

## Marker register

No inline marker has been settled after it was written.

## Business review register

No business review has changed this Pre-SDD.

## Walkthrough and delegation history

### Action entries

**Input path, 2026-10-27:** the prompt path for all four stages, from the run's arguments (`full prompt chunks`); no switch.

**Start conditions, 2026-10-27:** REFUNDS v1.5 and LOYALTY v1.7 are both `In Review`, not `Approved`; the fixture owner (`Fixture: Product Owner stand-in (test-run policy)`) chose to go on. The BRD keys `REFUNDS` and `LOYALTY` were proposed and accepted by the fixture owner. Rule home: [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage).

**Answer policy, 2026-10-27:** `Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)`, recorded with `set-policy` by the person `Product Owner (fixture owner)` as the coordinator ruled, with the Approver stand-in (`Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27)`). It takes the recommended option or the stated default only, passes the G1 and G2 review stops, never passes the G3 sign-off stop, and its stand-in signs the applicable roles only when the engine's G3 result names no other problem. It first answered in stage 1 (the CAP-07 and REL-01 proposals). Facts in this run come from the fixture owner, `Fixture: Product Owner stand-in (test-run policy)`, under the test-run policy of the run brief.

**Stage 1, 2026-10-27:** four batches. The fixture owner answered HDR-07.1 (greenfield), HDR-08.1 (cloud), CAP-01.1 and CAP-01.2 (with the labels swapped so the primary entry is the busiest type), CAP-03.1, CAP-04.1 (kept), REL-05.1 and REL-05.2, REL-03.1 and REL-03.2, REL-04.1 and REL-04.2, the DAT-02.1 factors and its derived value, and ECO-01.1; the policy took the four proposals on CAP-07 and REL-01. BUS-05.1 was left open with its owner and due date; unknowns QD-01 to QD-04 were recorded with their owners and due dates from the fixture owner. Rule home: [03b](./03b-register-capacity.md), [03c](./03c-register-reliability.md).

**Stage 2, 2026-10-27:** groups HDR, BUS, SEC, DAT, INT, CAP, REL, OPS, ECO in that order. Each group's `Open` entries were answered by the fixture owner or left open with their owner names and due dates from the fixture owner; CAP-12.1 and ECO-05.1 were marked `N/A` with their reasons by the fixture owner. Each group confirm was taken by the policy (the engine skips the facts); no fact was left `Estimated`. The overlay switch was set to `applies: false` by the fixture owner. Unknowns QD-05 and QD-06 were recorded. The policy passed the G1 review stop. Rule home: [03a](./03a-register-business.md) to [03h](./03h-register-economics.md).

**Stage 3, 2026-10-27:** the skill named OPT-01 (pilot-light recovery region) and OPT-02 (warm-standby recovery region) and proposed every criterion score with its reason. The fixture owner gave the costs, the 36-month horizon and the weights, confirmed every proposed score unchanged, confirmed the costs, and excluded no option. The policy passed the G2 review stop (G2 then read `blocker` on `OPEN-SEC-01.1` and `DT-15-BLOCK`). Rule home: [07 § 7.1](./07-options-and-economics.md#71-options).

**Cost, horizon and weight approvals, 2026-10-27:** costs OPT-01 and OPT-02, horizon 36 months, weights nfr_fit 3, one_time_cost 1, recurring_tco 2, delivery_time 1, operability 2, security_compliance 2, reversibility 1, uncertainty 1, all by `Fixture: Product Owner stand-in (test-run policy)`. Rule home: [07 § 7.1](./07-options-and-economics.md#71-options).

**Stage 4, 2026-10-27:** no value was left `Estimated`, so no group confirm was asked. Topology override: none; DR override per scope: none; chosen option OPT-01, all by `Fixture: Product Owner stand-in (test-run policy)`. Reason for the choice, stated with it: "Highest weighted score under the approved weights; meets REL-03.1 and REL-04.1 for scope region." The engine stores no reason for a chosen option without an override, so the reason is recorded here and in ADR-DR-001. Rule home: [09 § 9.4](./09-decisions.md#94-pre-sdd-adrs).

**Exception, 2026-10-27 (ruling R23):** EXC-01 on SEC-01.1, granted by the person `Product Owner (fixture owner)`, who acts as the named person for this one time-bound exception under ruling R23 (decided 2026-10-27), so the exception path runs end to end in a fixture run; the name holds no "stand-in", because the skill forbids a stand-in granter. Reason: the applicable data-protection law is a hard BRD dependency needed before go-live, not before the SDD; Legal Counsel confirms it by 2026-12-15. Expires 2027-12-31, review 2027-03-31. No other exception was granted, and none was revoked. Rule home: [11 § 11.1](./11-gate-and-sign-off.md#111-gate-result).

## Sign-off record

No G3 sign-off round has taken place yet.

<!-- MASTER: refunds-platform-pre-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
