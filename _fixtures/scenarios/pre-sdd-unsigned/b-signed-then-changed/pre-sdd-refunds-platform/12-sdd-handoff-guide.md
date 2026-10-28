<!--
CHUNK: 12
TITLE: SDD Handoff Guide
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 03a-11
PART OF: Pre-SDD - Refunds Platform
AUDIENCE: sdd-unifier (the Software Architect). It reads this chunk first, then the master's gate line, then chunk 11, and never this skill's rule files, so the guide is self-contained.
-->

# 12. SDD Handoff Guide

> **What this guide is.** The contract between this Pre-SDD and the SDD that builds on it. The Pre-SDD settles numbers and shape (TPS and RPS, latency budgets, availability, RTO and RPO, data growth, bandwidth, cost; hosting target, fault scope, DR strategy, topology, data-store shape). Once G3 is signed, every item in § 12.2 is **locked** for the SDD: the SDD cites it and designs to it, and never changes it. The SDD picks the products, versions, architecture style, and detailed design (§ 12.4).

## 12.1 Pre-SDD, Gate and Signers

| Item | Value |
|------|-------|
| Pre-SDD | Refunds Platform, version 1.0 ([master link](./refunds-platform-pre-sdd-master.md)) |
| Source BRDs | REFUNDS v1.5 (In Review); LOYALTY v1.7 (In Review) |
| Gate | G2 |
| G3 status | Review |
| Authorized to start the SDD | No |
| Signers | Not signed |
| Engine | pre-sdd-engine 3.0.0, skill pre-sdd-unifier 1.0.0 |

**How the SDD reads this gate:**

- **G3 Approved or Approved with conditions** (authorized `Yes`, and the master's gate line does not read `Review`): load this Pre-SDD and lock every item in § 12.2.
- **Any other G3 status** (`Not signed`, `Blocked`, or `Review`): the Pre-SDD is not signed. Do not load it. Stop, and raise a handoff request to the E2E Architect (`pre-sdd-unifier`) on `unifier-status.md` that lists what G3 still needs (chunk 11 § 11.1).
- A content change after G3 sends G3 back to `Review` until every applicable role signs again; until then the SDD treats the Pre-SDD as not signed.

## 12.2 Locked Items

<!-- ENGINE-FRAGMENT: 12-locked-items.md -->
| ID | Value | Status | Lands in the SDD |
|---|---|---|---|
| HDR-07.1 | greenfield | Confirmed | Project Type |
| HDR-08.1 | cloud | Confirmed | Q8, §8.3, §8.6 |
| BUS-07.1 | Payouts go only to the card used for the purchase (REFUNDS 02 Constraint 2). Non-goals: refunds for online-shop purchases, cash refunds and a customer mobile app (REFUNDS 04 Out of Scope); redeeming points, handling member complaints about points and correcting points by hand (LOYALTY 04 Out of Scope). | Confirmed | §11 |
| BUS-08.1 | No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd). | Confirmed | §11 |
| CAP-01.1 | 2,000 transactions/day | Confirmed | §18, Q3 |
| CAP-01.2 | 40 transactions/day | Confirmed | §18, Q3 |
| CAP-02.1 | 0.2292 req/s | Confirmed | §18, Q3 |
| CAP-03.1 | 300 peak simultaneously active users (customers, members and branch managers) | Confirmed | §18, Q3 |
| CAP-04.1 | 3 × | Confirmed | §18, Q3 |
| CAP-05.1 | TBD | Open | §18, Q3 |
| CAP-06.1 | Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded | Confirmed | §18, Q3 |
| CAP-07.1 | 2,000 ms | Confirmed | §18, Q3 |
| CAP-07.2 | 2,000 ms | Confirmed | §18, Q3 |
| CAP-08.1 | Ingress edge; successful and failed requests measured separately | Confirmed | §18, §18.5 |
| CAP-09.1 | Points taken back after a paid refund show in the member's balance and history within 1 hour of the refund being paid (LOYALTY/NFR-02). A payout that still fails after 1 day is reported to the branch manager (REFUNDS UC-04 E1). The branch refund report is daily (REFUNDS 09). The time for points earned on a purchase to show is open in the BRD (LOYALTY/NFR-03 proposes the end of the purchase day). | Confirmed | §18, Q3 |
| CAP-10.1 | TBD | Open | §18, Q3 |
| REL-01.1 | 99.9 % | Confirmed | §8.6, §18.5, Q3 |
| REL-01.2 | 99.9 % | Confirmed | §8.6, §18.5, Q3 |
| REL-02.1 | TBD | Open | §18.5, Q3 |
| REL-03.1 | 14,400 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-03.2 | 300 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-04.1 | 900 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-04.2 | 5 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-05.1 | region | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-05.2 | az | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-06.1 | A message that does not reach the customer never stops or changes a refund request; the customer can always see the current status (REFUNDS 03). When Point-of-Sale Records cannot be reached, customers are asked to try again later (REFUNDS UC-01 E5). A payout result may be recorded by hand by a staff member and confirmed by a second staff member (REFUNDS 03 Decision record). When points cannot be shown, the member is asked to try again later and no balance is shown (LOYALTY UC-01 E1). The maximum tolerable interruption is not stated beyond REFUNDS/NFR-02. | Confirmed | §20 |
| REL-07.1 | TBD | Open | §20 |
| REL-10.1 | Refund money is never lost or paid twice: zero missing or duplicate payouts per month, where a payout still being tried again or waiting for a card dispute at month end counts as delayed or waiting, not missing (REFUNDS/NFR-01). The decision record of every status change cannot be changed (REFUNDS 03). Every points movement follows the points rules, with zero upheld balance complaints a month (LOYALTY/NFR-01); each paid refund takes points back once, and the points taken back for a purchase never exceed the points it earned (LOYALTY UC-02 BR-3, BR-6). | Confirmed | §8.6, §11, §18.5 |
| DAT-01.1 | Refund request with its items, amounts and lifecycle (Submitted, Approved, Rejected, Paid, Cancelled), and the decision record of every status change (who, when, amount, reason), which nobody can change; the Refunds Portal is the system of record (REFUNDS 03) (storeKind: relational) | Confirmed | §6 Notes, §8.3 |
| DAT-01.2 | Points movements (earned and taken back) with the purchase and refund details behind each, and the points balance as the sum of the movements; Loyalty Points keeps every movement while the member is in the program (LOYALTY 03) (storeKind: relational) | Confirmed | §6 Notes, §8.3 |
| DAT-02.1 | 0.016 GB/day | Confirmed | §18, Q3 |
| DAT-03.1 | sensitive | Confirmed | §11, §6 Notes |
| DAT-04.1 | yes | Confirmed | §8.6, §8.7, §11, §6 Notes |
| DAT-05.1 | strong | Confirmed | §6 Notes, §8.3 |
| DAT-05.2 | strong | Confirmed | §6 Notes, §8.3 |
| DAT-06.1 | Refund requests, decisions and payout results are kept for 10 years for tax records; customer contact details are deleted 90 days after a request ends; a member's points history is kept while the membership lasts and deleted within 30 days after it ends. | Confirmed | §11, §6 Notes |
| DAT-07.1 | TBD | Open | Q7, §11 |
| DAT-08.1 | A daily branch refund report for each branch manager: requests per status, amounts paid, average time from Submitted to decision and to Paid (REFUNDS 09; its period and format are open). A monthly check that no payout is missing or paid twice (REFUNDS/NFR-01; the team that checks is open, REFUNDS 04). Loyalty Points has no reporting in this release (LOYALTY 09). | Confirmed | §18, Q3 |
| DAT-09.1 | TBD | Open | §8.6, §20 |
| SEC-01.1 | TBD | Open | §11, §6 Notes |
| SEC-02.1 | Customers act only on their own refund requests after proving who they are (method open, REFUNDS 03 Customer identity); branch managers act only on their own branch's requests (REFUNDS 03, 07); staff who record a payout result by hand and the second staff member who confirms it (REFUNDS 03, NFR-04); members see only their own points after signing in (sign-in party open, LOYALTY UC-01; LOYALTY/NFR-05). External parties: CardPay Ltd, MsgHub, Point-of-Sale Records (REFUNDS 08, LOYALTY 08). | Confirmed | §11, §6 Notes |
| SEC-03.1 | TBD | Open | §8.7, §11, §6 Notes |
| SEC-04.1 | Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year. | Confirmed | §8.7, §11, §6 Notes |
| SEC-05.1 | Every refund status change is recorded with who made it, the date and time, the amount and the reason; a payout recorded by hand as paid keeps both staff members; nobody can change the record, and it is deleted only when the REFUNDS/NFR-06 retention period ends (REFUNDS 03 Decision record). | Confirmed | §11, §6 Notes |
| SEC-06.1 | TBD | Open | §11, §6 Notes |
| SEC-07.1 | A branch manager cannot decide on a refund request they submitted as a customer (REFUNDS UC-04 BR-6); a payout recorded by hand as paid needs a second staff member to confirm it (REFUNDS 03). Whether a second approver is needed above an amount is open (REFUNDS UC-04 BR-7). | Confirmed | §8.7, §11, §6 Notes |
| SEC-08.1 | TBD | Open | §11, §6 Notes |
| INT-02.1 | The receipt lookup answers while the customer enters a receipt number (REFUNDS UC-01 step 2). Refund outcomes (Paid, Rejected, Cancelled, back to Approved) go from the Refunds Portal to Loyalty Points when they happen, and are kept and sent when Loyalty Points starts (REFUNDS 04, 08). Branch purchases of members are known the same day (LOYALTY 02 Assumption 1). Customer messages follow each status change (REFUNDS 03). | Confirmed | §6 Notes, §8.3 |
| INT-03.1 | TBD | Open | §8.3, §18 |
| INT-03.2 | TBD | Open | §8.3, §18 |
| INT-03.3 | TBD | Open | §8.3, §18 |
| INT-04.1 | Point-of-Sale Records unreachable: the customer is asked to try again later and is not told the receipt is wrong (REFUNDS UC-01 E5). Payout refused or sent back: the request stays or goes back to Approved, the payout is tried again, the customer is told it is delayed and the branch manager is told after 1 day (REFUNDS UC-04 E1). Card dispute open: the payout waits for the bank's decision (REFUNDS UC-04 BR-8). A message that fails never stops a request (REFUNDS 03). Loyalty Points not started: the refund outcomes are kept and sent when it starts (REFUNDS 04). | Confirmed | §6 Notes, §8.3 |
| INT-05.1 | Each paid refund takes points back once, even when the Refunds Portal reports it more than once (LOYALTY UC-02 BR-3). A refund paid before its purchase earned points waits up to 30 days for the purchase (LOYALTY UC-02 BR-5). Points taken back show within 1 hour of the refund being paid (LOYALTY/NFR-02). A late purchase keeps its purchase date (LOYALTY 03). | Confirmed | §6 Notes, §8.3 |
| INT-06.1 | TBD | Open | §8.7 |
| INT-07.1 | Customers and members use web browsers on phones and computers (REFUNDS 11, LOYALTY 11); branch managers work in 40 branches (REFUNDS 02 Facts; the devices they use are open, REFUNDS 11). No offline operation is stated. | Confirmed | §8.6, §8.7 |
| INT-08.1 | public | Confirmed | §8.3, §8.7, §11 |
| OPS-04.1 | dev, test, stage, prod, dr | Confirmed | §19 |
| OPS-06.1 | TBD | Open | §20 |
| ECO-01.1 | One-time budget 250,000 EUR; run cost up to 12,000 EUR a month | Confirmed | §6 Notes |
| ECO-03.1 | 36 months | Confirmed | §6 Notes |

| Decision | Value |
|---|---|
| Hosting | cloud |
| Topology | Primary + independent recovery location (regional) |
| DR strategy, scope region | Pilot Light (pilot), replication asynchronous |
| DR strategy, scope az | Local HA only · broader DR not scoped (localHA), replication asynchronous |
| Data | kind relational, consistency strong |
| Chosen option | OPT-01 (One primary region with a pilot-light recovery region) |

| Lands in the SDD | Rows |
|---|---|
| Project Type | HDR-07 |
| Q3 | CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06, CAP-07, CAP-09, CAP-10, REL-01, REL-02, DAT-02, DAT-08 |
| Q7 | DAT-07 |
| Q8 | HDR-08 |
| §6 Notes | DAT-01, DAT-03, DAT-04, DAT-05, DAT-06, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, INT-02, INT-04, INT-05, ECO-01, ECO-03 |
| §8.3 | HDR-08, DAT-01, DAT-05, INT-02, INT-03, INT-04, INT-05, INT-08 |
| §8.6 | HDR-08, REL-01, REL-03, REL-04, REL-05, REL-10, DAT-04, DAT-09, INT-07 |
| §8.7 | DAT-04, SEC-03, SEC-04, SEC-07, INT-06, INT-07, INT-08 |
| §11 | BUS-07, BUS-08, REL-03, REL-04, REL-05, REL-10, DAT-03, DAT-04, DAT-06, DAT-07, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, INT-08 |
| §18 | CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06, CAP-07, CAP-08, CAP-09, CAP-10, DAT-02, DAT-08, INT-03 |
| §18.5 | CAP-08, REL-01, REL-02, REL-03, REL-04, REL-05, REL-10 |
| §19 | REL-03, REL-04, REL-05, OPS-04 |
| §20 | REL-03, REL-04, REL-05, REL-06, REL-07, DAT-09, OPS-06 |
<!-- /ENGINE-FRAGMENT -->

An item that reads `TBD` or `Open` is locked as open: the SDD carries it as an open question, links it to its register row through its `PSDD/<ID>` link (where its owner and due date stand), and never fills it.

## 12.3 Where Each Item Lands in the SDD

The lock is on numbers and shape, never on the SDD's own questions. Which rows land in each place is the landing table of the locked-items fragment in § 12.2, which the engine renders from its landing map; this section never copies it. How the SDD applies what lands in each place:

| SDD place | How the SDD applies it |
|-----------|------------------------|
| Project Type | Pre-fills the Project Type question with the change type (HDR-07). The Standard's brownfield means a workload or state to preserve; the SDD's means a codebase to extend. When this Pre-SDD is brownfield with no codebase to extend (for example a rewrite with a data migration), the SDD answers Greenfield and carries the migration context. |
| Q3 (load and availability) | The evidence for Q3, cited as `PSDD/<ID>`. Q3 stays the SDD's choice. |
| Q7 (multi-tenancy model) | Q7 is chosen within the isolation level of DAT-07 (tenancy model and isolation level): `single` allows Single tenant; `shared-logical` allows shared schema with `tenant_id`, schema per tenant, or database per tenant; `schema-isolated` allows schema per tenant or database per tenant; `database-isolated` and `deployment-isolated` allow database per tenant. DAT-07.1 is Open in this Pre-SDD, so Q7 waits for its owner. |
| Q8 (deployment target) | The hosting target (cloud, on-prem, or hybrid; a provider only when the business made it a hard constraint) is locked. The runtime option is the SDD's. |
| §6 Notes | Each affected §6 row carries the constraint in its Notes; the data-store row carries the store kind of each data workload (DAT-01), and the product stays the SDD's. A product that breaks a constraint becomes an open item (§ 12.6). |
| §8.3 (high-level architecture) | The diagram follows the hosting, data, integration, and network shape: the data workloads and their store kind (DAT-01), and the external dependencies with the partner quotas, latencies, SLAs, maintenance windows, and rate limits they impose (INT-03). |
| §8.6 (infrastructure architecture) | The deployment topology follows the hosting target, the topology, the availability targets, the failure scopes, the residency, and the client and edge locations: the regions or sites, the zones, and the redundancy cite them as `PSDD/<ID>`. §8.6.4 (backup and disaster recovery) is the home of the RTO and RPO per failure scope, with the DR strategy of each scope and the restore granularity; the §18.5 row of a recovery NFR links there and restates neither figure. The storage redundancy and replication meet the durability and correctness targets (REL-10). |
| §8.7 (network architecture) | The zones, the ingress and egress paths, TLS termination, the network policies, and administrative access follow the network constraints: address ranges and private connectivity, allow-lists, firewall, DNS and proxy dependencies, client and edge locations, where residency lets data flow, the threat posture, encryption in transit, and privileged access, each cited as `PSDD/<ID>`. |
| §11 (cross-cutting concerns) | The defaults follow the DR strategy, the data classification, residency and retention, the isolation level, the security obligations, and the durability and correctness targets (REL-10). |
| §18 (performance and capacity) | §18 cites the `PSDD/CALC-NN` values (chunk 04) and never recomputes them. It sizes within the partner quotas and latencies (INT-03) and for the peak simultaneously active users (CAP-03), which no calculation reads, and its latency targets are measured where CAP-08 says, with what counts as a failure. |
| §18.5 (NFR targets) | The settled targets; each BRD NFR row cites the entry that quantifies it. A latency target states its measurement point and what counts as a failure (CAP-08); a durability or correctness NFR takes its target from REL-10. |
| §19 (environments) | The environments follow the DR strategy and the environment list. |
| §20 (operations runbook) | The runbook follows the DR strategy, the recovery sequence, the failover authority, and the restore granularity. |

## 12.4 Left to the SDD

The Pre-SDD settles nothing below; the SDD decides each, within the locked items:

- **Products and versions** for every layer, and managed or self-managed.
- **The architecture style** (Q4), **communication** (Q5), and **data ownership** (Q6). The Pre-SDD gives only their drivers.
- **The provider**, when the business did not make one a hard constraint.
- **Detailed DR procedures**, failover mechanics, and the environment layout.
- **Per-service sizing**, the per-service breakdown, and caching.
- **The schema strategy** per service (Q7, within the isolation level), partitioning, and ERDs.
- **The integration mechanism** (broker, outbox, synchronous calls) and the contracts.
- **The identity product** and the authorization model; the network design, firewall rules, and routes; the cost per component.
- **The SDD ADRs** ADR-PERF-001 (workload processing model), ADR-INT-001 (integration reliability), and ADR-IAM-001 (identity and tenancy), each citing the Pre-SDD answers that drive it ([09 § 9.5](./09-decisions.md#95-sdd-adrs-driven-by-this-pre-sdd)). The Pre-SDD ADRs ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001 are locked ([09 § 9.4](./09-decisions.md#94-pre-sdd-adrs)). No migration overlay applies, so there is no ADR-MIG-001.
- **The service eligibility matrix** of the GF-CL path, within DAT-04.1 and SEC-01.1, and any new third-party service, which needs the product owner's approval before a design adopts it (project rule).

## 12.5 Conditions, Exceptions and Unknowns

**Conditions** (the SDD shows each open condition as a §4 risk citing `PSDD/COND-NN`):

| ID | Condition | Owner | Due |
|----|-----------|-------|-----|
| COND-01 | CardPay Ltd confirms in writing that it refunds branch card purchases to the original card, before the SDD fixes the payout integration. | Refunds and Loyalty Product Owner | 2026-12-15 |

**Exceptions** (an `Open` hard entry that a named person let pass G3 until its expiry; the person who granted it owns it, and the expiry is its due date):

| ID | Entry | Granted by (owner) | Expires (due) | Review |
|----|-------|--------------------|---------------|--------|
| EXC-01 | SEC-01.1 | Product Owner (fixture owner) | 2027-12-31 | 2027-03-31 |

**Unknowns** (open questions the SDD carries, never fills):

| ID | Question | Entry | Owner | Due |
|----|----------|-------|-------|-----|
| QD-01 | How many minutes per month may the points balance and history screens be unavailable, planned maintenance included (LOYALTY/NFR-04)? | REL-01.2 | Refunds and Loyalty Product Owner | 2026-11-20 |
| QD-02 | Within how many seconds must an everyday action in the Refunds Portal complete (REFUNDS/NFR-05)? | CAP-07.1 | Refunds and Loyalty Product Owner | 2026-11-20 |
| QD-03 | What are the launch dates, hard deadlines and change windows of the Refunds Portal pilot, its rollout, and Loyalty Points (REFUNDS 04, LOYALTY 04)? | BUS-05.1 | Refunds and Loyalty Product Owner | 2026-11-20 |
| QD-04 | Has CardPay Ltd confirmed refunds to the original card for branch card purchases, with its merchant account model, time limit, needed payment details, and whether it reports card disputes (REFUNDS 02 Dependencies)? | INT-03.1 | CardPay Ltd | 2026-11-20 |
| QD-05 | Has the Retail IT team agreed to give the receipt lookup and the member purchase feed, and how soon after a purchase can a receipt be found (REFUNDS 02 Assumption 4 and Dependencies, LOYALTY 02)? | INT-03.2 | Retail IT team | 2026-11-20 |
| QD-06 | Do branch purchases, and so the points movements of CAP-01.1, rise in the seasonal sales by the same factor as refund requests (CAP-04.1, REFUNDS/NFR-03), or by another factor? | CAP-04.1 | Refunds and Loyalty Product Owner | 2026-11-20 |
| QD-07 | Does a declared region disaster count toward the REFUNDS/NFR-02 limit of 2 hours of disruption a month and toward the REL-01.1 availability target? | REL-02.1 | Refunds and Loyalty Product Owner | 2026-11-20 |
| QD-08 | Within how many milliseconds must the member points balance and history screens respond (LOYALTY 10 states no performance measure)? | CAP-07.2 | Refunds and Loyalty Product Owner | 2026-11-20 |

## 12.6 When the SDD Disagrees

The SDD never edits a locked item, and never edits this Pre-SDD. When it finds a locked item wrong, or in conflict with a source or a design need:

1. It raises an open item in its chunk 18, with `Owner: E2E Architect (pre-sdd-unifier)`, citing the item as `PSDD/<ID>`. Its e2e gate treats the item like any other open item.
2. It raises a handoff request to the E2E Architect on `unifier-status.md`, naming the open item.
3. The E2E Architect decides with the owner: change the item, or keep it with the reason. A change runs one Pre-SDD update with a new version, a review, and the G3 sign-off again.
4. The E2E Architect raises a handoff request back to the Software Architect: "Pre-SDD has a new version", naming the open item, or the decision to keep the item with its reason. The SDD closes its open item on its next run.

## 12.7 Citing This Pre-SDD

Cite every Pre-SDD ID as `PSDD/<ID>`, with a link to where it lives (there is one Pre-SDD per SDD):

- a register row or entry links to its row heading: [PSDD/REL-03.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03);
- a calculation links to [04 § 4.2](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) (`PSDD/CALC-03`), and an option's rows to [07 § 7.1](../pre-sdd-refunds-platform/07-options-and-economics.md#71-options) (`PSDD/CALC-21@OPT-02`);
- a condition or an exception links to [11 § 11.1](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result) (`PSDD/COND-01`, `PSDD/EXC-01`);
- an unknown links to [10 § 10.1](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns) (`PSDD/QD-03`);
- a Pre-SDD ADR links to [09 § 9.4](../pre-sdd-refunds-platform/09-decisions.md#94-pre-sdd-adrs) (`PSDD/ADR-DR-001`), and a decision rule to [09 § 9.2](../pre-sdd-refunds-platform/09-decisions.md#92-decision-tree) (`PSDD/DT-07`).

Entry IDs are the row ID, a dot, and the entry number (`REL-03.2`; `.1` is the primary entry). BRD IDs keep their BRD key (`REFUNDS/NFR-03`). An ID is never renumbered or reused.

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 11-gate-and-sign-off.md | NEXT: 13-open-items-and-clarifications.md -->
