<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: SDD - Refunds Platform
PURPOSE: Single home for the architecture questionnaire record, the ecosystem selection record, the Pre-SDD record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Refunds Platform

## How to read

The numbered chunks hold the current settled design; the ADRs in [chunk 06](./06-principles-and-decisions.md#10-architectural-decisions) hold each architecture decision and its rationale; this companion file holds how the decisions were reached, who decided, and when. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-10-27:** Accept all. Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Style: modular monolith; followed the recommendation. Pre-SDD: PSDD v1.0.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release of a product that will grow (Recommended) / MVP or proof of concept / Platform at scale | First production release | [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope): a pilot group of branches, then the rest; [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope): redeeming points in a later phase | [§8.1.2](./04-architecture-style-and-diagrams.md#812-why) |
| Q2 Teams in the next 12 months | One team (Recommended) / Two or three teams / Four or more | One team | assumption - BRD silent (both BRDs); the next count up (two or three teams) leaves the Q4 recommendation unchanged for this profile, so the assumption is not a missing driver | [§8.1.2](./04-architecture-style-and-diagrams.md#812-why) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | [PSDD/CAP-01.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-01), [PSDD/CAP-01.2](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-01), [PSDD/CAP-02.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-02), [PSDD/CAP-03.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-03), [PSDD/CAP-04.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-04), [PSDD/CAP-05.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-05) (open), [PSDD/CAP-06.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-06), [PSDD/CAP-07.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-07), [PSDD/CAP-07.2](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-07), [PSDD/CAP-09.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-09), [PSDD/CAP-10.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-10) (open), [PSDD/REL-01.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-01), [PSDD/REL-01.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-01), [PSDD/REL-02.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-02) (open), [PSDD/DAT-02.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-02), [PSDD/DAT-08.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-08); [REFUNDS/NFR-02](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), [REFUNDS/NFR-03](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q4 Architecture style | Modular monolith (Recommended) / Hybrid / Microservices | Modular monolith | Profile "first production release, one to three teams, moderate load"; no BRD NFR or Technical Input states a separate scaling, failure, or release need ([REFUNDS 12 TI-01](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) and [REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) name the stack, not a style) | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process ports and domain events, outbox for durable cross-process effects (Recommended) / Event-driven backbone with a broker / Mostly synchronous REST | In-process ports and domain events, outbox | Q4; three external partners, no internal consumer outside the deployable ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations), [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)) | [ADR-02](./06-principles-and-decisions.md#10-architectural-decisions), [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One database, one schema per module (Recommended) / One database per service / Per service plus a reporting store | One database, one schema per module | Q4; [REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd); one daily branch report ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)), no reporting in Loyalty Points ([LOYALTY 09 § Reporting / Analytics](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics)) | [ADR-04](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy model | No option offered: the isolation level of [PSDD/DAT-07.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-07) is open, so the allowed set is unknown | Open (waits for [PSDD/DAT-07.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-07)) | Isolation constraint [PSDD/DAT-07.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-07) (open in the Pre-SDD's lock list) | [ADR-05](./06-principles-and-decisions.md#10-architectural-decisions), [§11.2](./07-cross-cutting-concerns.md#112-multi-tenancy-default) |
| Q8 Deployment target | Hosting: locked, source Pre-SDD ([PSDD/HDR-08.1](../pre-sdd-refunds-platform/02-classification-and-path.md#21-classification)), cloud. Runtime: managed container service (Recommended) / Kubernetes with one Helm chart per deployable / A simple container or VM setup | Cloud (locked); managed container service | Q1; no Technical Input names a runtime; the stack defaults name none | [ADR-10](./06-principles-and-decisions.md#10-architectural-decisions), [§6 Compute / Infra](./02-ecosystem-overview.md#6-ecosystem-overview) |

## Ecosystem selection record

**Outcome, 2026-10-27:** Accept all proposed. Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). No `[project-slug]-eco-system.md` or other `*-eco-system.md` file is in the project root, so Import was not offered. Every row is `Confirmed` except the rows that adopt a new third-party library, framework, or managed service, which `AGENTS.md` reserves for the product owner: Container Runtime, IAM / AuthN, Secrets Management, CI/CD, Observability: Logging, Observability: Metrics, Observability: Tracing, and Frontend Stack stay `Proposed` with a marker naming the product owner; the managed database form of the Primary RDBMS row, the resilience library of the Backend Runtime row, the migration tool of §11.1, and the load-testing tool of §18.4 carry the same marker in their Notes or text. The policy did not adopt any of them (Answer policy rule 3).

## Pre-SDD record

**Loaded, 2026-10-27:** PSDD v1.0, Refunds Platform, gate `G3 Approved with conditions` (master **Gate:** line: "G3 Approved with conditions - G3: Approved with conditions - SDD authorized: Yes"; [PSDD 11 § 11.1 Gate Result](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result): G3 Approved with conditions, authorized Yes). Signers: each of the ten applicable roles signed as `Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27)`, a stand-in, Approved with conditions, 2026-10-27. The step 2a search looked in the project root for `pre-sdd-*/` folders and `PRE-SDD-*.md` files: one folder, `pre-sdd-refunds-platform/`, whose chunk 00 Source BRDs names REFUNDS v1.5 and LOYALTY v1.7 by the same links as this SDD's sources; no combined file. Read in order: chunk 12, the master's gate line, chunk 11, plus chunk 00's Source BRDs and the master's version. The load: every locked item of [PSDD 12 § 12.2 Locked Items](../pre-sdd-refunds-platform/12-sdd-handoff-guide.md#122-locked-items) applied where it lands: the Project Type ([PSDD/HDR-07.1](../pre-sdd-refunds-platform/02-classification-and-path.md#21-classification), §1), Q3, Q7, and Q8 (the questionnaire record above), the §6 Notes, §8.3, §8.6 with §8.6.4, §8.7, §11 (including [PSDD/BUS-07.1](../pre-sdd-refunds-platform/03a-register-business.md#bus-07) and [PSDD/BUS-08.1](../pre-sdd-refunds-platform/03a-register-business.md#bus-08)), §18, §18.5, §19, and §20; the open condition [PSDD/COND-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result) became risk R-03; the exception [PSDD/EXC-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result) and the unknowns [PSDD/QD-01](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns) to [PSDD/QD-08](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns), and every entry the lock list shows as `TBD` or `Open`, stay open and cited. Open items raised to the E2E Architect: OI-23 (zone replication and RPO, HR-004) and OI-24 (peak request rate against active users, HR-005).

**Rule home:** [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage)

**Requested, 2026-10-27:** HR-004 to the E2E Architect, a disagreement with locked items: OI-23 names [PSDD/REL-04.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04) and [PSDD/REL-05.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05) against [PSDD/REL-10.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-10).

**Requested, 2026-10-27:** HR-005 to the E2E Architect, a disagreement with locked items: OI-24 names [PSDD/CAP-02.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-02) against [PSDD/CAP-03.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-03).

## Clarification register

All 38 open items of the first build were presented on 2026-10-27 (OI-28 to OI-36 raised by the first scoped application pass, OI-37 and OI-38 by the last); 33 are decided and applied as below; OI-37 and OI-38 are decided and pending application. OI-23 and OI-24 are owned by the E2E Architect and wait for the answer to HR-004 and HR-005; OI-27 waits for the product owner, because AGENTS.md reserves the decision and the policy cannot take it.

### OI-01 - Notification listener reads the publisher's port

**Question:** Should the notification listener keep reading contact details through API-03, against ADR-03 and AP-03?

**Decision record, 2026-10-27:** Option A: the listener writes message rows from the event alone; the relay reads the contact at send time; `SKIPPED` status added. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.3 Business Logic](./13c-service-notification.md#business-logic)

### OI-02 - Monthly payout check without a port

**Question:** How does the monthly payout check learn which refunds were approved?

**Decision record, 2026-10-27:** Option A: new in-process contract API-09 `RefundOutcomePort.listApprovedRefunds`, module identity `PAYOUT_MODULE`, token `refund-request.approved-refund.read`. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§15.3 API-09](./11-api-contracts.md#api-09-approved-refunds-of-a-period-payout---refund-request)

### OI-03 - Publication log in-house or library

**Question:** Is the publication log built in-house or taken from a library?

**Decision record, 2026-10-27:** Option A: built in-house in a shared platform package; a library would need the product owner's approval. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27).

**Open remainder:** None.

**Rule home:** [ADR-02](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-04 - Aggregate version in event DTOs

**Question:** How do listeners apply the version check ADR-02 names?

**Decision record, 2026-10-27:** Option A: `aggregateVersion` in every DTO; `payout_version`, `dispute_version`, `card_dispute.version`, and the loyalty inbox `aggregate_version` columns. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-05 - Idempotency key on a payout resend

**Question:** Which key does a payout resend carry after a refusal or a return?

**Decision record, 2026-10-27:** Option A: the same key after a timeout or a retryable error, the next key generation after a definitive refusal or return; a marker asks CardPay Ltd's key semantics. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** The question of the marker this item added, with its owner.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### OI-06 - Payout results in other states

**Question:** What do late, unexpected, and not-paid results do to a payout?

**Decision record, 2026-10-27:** Option A: a table of results in other states, a late-acceptance transition, and an alert on unexpected results. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### OI-07 - Dispute reported after the first send

**Question:** Does a dispute reported while a payout is retried hold it, and what of a dispute refunded after success?

**Decision record, 2026-10-27:** Option A: a dispute check before every send and resend; a dispute refunded after success is a double-refund finding with a marker for the business. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** The question of the marker this item added, with its owner.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### OI-08 - Region failover data-loss window

**Question:** How does the design contain the region RPO's effect on payouts?

**Decision record, 2026-10-27:** Option A: payout sending paused at recovery, the window reconciled against CardPay Ltd, unmatched results kept, recovery egress addresses registered, risk R-08. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§20.1.5](./16-operations-runbook.md#2015-database-failover)

### OI-09 - Identity provider hosting and recovery

**Question:** Where does the Proposed identity provider run, and how is it recovered?

**Decision record, 2026-10-27:** Option A, conditional on the product owner's approval: a second deployable with its own database on the same PostgreSQL service, recovered with the platform. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§8.6.2](./05a-infrastructure-and-network.md#862-deployables-per-environment)

### OI-10 - Region recovery drill without a stage recovery region

**Question:** Where does the region recovery drill run?

**Decision record, 2026-10-27:** Option A: on stage with a temporary recovery footprint created for the drill. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§19](./15-environments.md#19-environments)

### OI-11 - Receipt data at submit

**Question:** Where does submit read the receipt data it re-checks?

**Decision record, 2026-10-27:** Option A: a `receipt_lookup` row kept 30 minutes; an expired lookup answers 409 `RECEIPT_LOOKUP_EXPIRED`. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.1 Business Logic](./13a-service-refund-request.md#business-logic)

### OI-12 - Idempotency key on cancellation

**Question:** Does the cancellation endpoint take an Idempotency-Key?

**Decision record, 2026-10-27:** Option A: yes, stored in `request_idempotency`. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.1 API Standards](./13a-service-refund-request.md#api-standards)

### OI-13 - Receipt lookup limit

**Question:** Is there a per-customer limit on receipt lookups?

**Decision record, 2026-10-27:** Option A: 10 lookups in 10 minutes per customer (recommended), 429 `RATE_LIMITED`. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.1 Business Logic](./13a-service-refund-request.md#business-logic)

### OI-14 - Member record creation

**Question:** When is a member row created, and how are the sign-in and feed identifiers linked?

**Decision record, 2026-10-27:** Option A: created from the feed on the first purchase; linked at first sign-in through the member number; a marker asks which number. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** The question of the marker this item added, with its owner.

**Rule home:** [§17.4 Business Logic](./13d-service-loyalty-points.md#business-logic)

### OI-15 - Loyalty reporting start day

**Question:** Which day does the reporting start rule use when the switch changes?

**Decision record, 2026-10-27:** Option A: `loyalty_reporting_started_on`, written once at the first switch-on; a later switch-off only pauses processing. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§11.5](./07-cross-cutting-concerns.md#115-configuration-management-default)

### OI-16 - Operations redelivery endpoint

**Question:** How is the runbook's redelivery endpoint defined and authorised?

**Decision record, 2026-10-27:** Option A: `POST /v1/operations/event-publications/{eventPublicationId}/redelivery` on the management port, token `platform.event-publication.redeliver`. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§16.11](./12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide)

### OI-17 - Procedures for check findings and switches

**Question:** Which procedures cover monthly check findings and the go-live switches?

**Decision record, 2026-10-27:** Option A: an alert on findings and procedures §20.1.8 to §20.1.10. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§20.1](./16-operations-runbook.md#201-common-operations)

### OI-18 - PSDD/CALC-NN citations in §18

**Question:** Does §18 cite the Pre-SDD's calculation values?

**Decision record, 2026-10-27:** Option A, adjusted: CALC-03, CALC-04, CALC-12, CALC-13, and CALC-15 cited with the values the Recommended Answer gives; the CALC-11 citation left out because the Recommended Answer gave no value for it and this SDD does not read the Pre-SDD's chunk 04. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§18.2](./14-performance-and-capacity.md#182-throughput-targets-per-service)

### OI-19 - §7.3 row of the points history use case

**Question:** Should the §7.3 row of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) list the handled Returned outcome?

**Decision record, 2026-10-27:** The reviewer, re-dispatched on the author's evidence, kept the item with the Recommended Answer `No change`; the policy took it: Rejected. The row follows the trigger tie and the Events column rule. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§7.3](./03-users-and-use-cases.md#73-use-case-traceability-brd--sdd)

### OI-20 - Refund reference and the flow's rating

**Question:** Which identifier is the refund reference, and at which rating does the outcome flow run?

**Decision record, 2026-10-27:** Option A: `referenceNumber` shown, `refundRequestId` as the take-back key; the flow runs as Critical. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.4 Tables Design](./13d-service-loyalty-points.md#tables-design)

### OI-21 - Poison threshold and inbox retention homes

**Question:** Where do the poison threshold and the inbox retention live?

**Decision record, 2026-10-27:** Option A: once in §11.1; the modules reference it. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§11.1](./07-cross-cutting-concerns.md#111-db-modeling-default)

### OI-22 - Narration in §14.8

**Question:** Does §14.8 keep the note about the authoring run?

**Decision record, 2026-10-27:** Option A: removed. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§14.8](./10-events-hub.md#148-consistency-notes--open-flags)

### OI-25 - Manual payout result without a use case

**Question:** Which BRD use case covers the manual payout result?

**Decision record, 2026-10-27:** Option A: the design stays; a marker for the REFUNDS owner. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** The question of the marker this item added, with its owner.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### OI-26 - Monthly payout check without a use case

**Question:** Which BRD use case and team cover the monthly payout check?

**Decision record, 2026-10-27:** Option A: the check stays; a marker for the REFUNDS owner. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). The rationale is the item's Why in chunk 18.

**Open remainder:** The question of the marker this item added, with its owner.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)


### OI-28 - OI-25 marker not in the body

**Question:** Was the OI-25 marker applied to §17.2?

**Decision record, 2026-10-27:** Option A: the marker is in §17.2; the application check had read the chunks before the author regenerated them after appending OI-25. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### OI-29 - OI-26 marker not in the body

**Question:** Was the OI-26 marker applied to §17.2?

**Decision record, 2026-10-27:** Option A: as OI-28. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### OI-30 - Listings that omit API-09

**Question:** Do the port listings and ADR-03 include `RefundOutcomePort`?

**Decision record, 2026-10-27:** Option A: §8.1.3, Figure 3, ADR-03, §13, the 13a and 13b Boundaries, and §14.9.0 updated. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-31 - Payout-sending switch at region recovery

**Question:** When is the replicated payout-sending switch turned off at a region recovery?

**Decision record, 2026-10-27:** Option A: in the promoted database before any replica starts, then confirmed. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§20.1.5](./16-operations-runbook.md#2015-database-failover)

### OI-32 - Recovering a missing payout

**Question:** How is a missing payout recovered when its publication row is gone?

**Decision record, 2026-10-27:** Option A: a management-port operation republishes the approval for the payout listener only. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§20.1.8](./16-operations-runbook.md#2018-monthly-payout-check-finding)

### OI-33 - Receipt lines as JSON

**Question:** Where are a lookup's item lines kept?

**Decision record, 2026-10-27:** Option A: a `receipt_lookup_line` table; §11.1's JSON rule restored; the lookup returns `lookupId`. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§17.1 Tables Design](./13a-service-refund-request.md#tables-design)

### OI-34 - Figures without the identity provider

**Question:** Do Figures 4 and 5 show the identity provider?

**Decision record, 2026-10-27:** Option A: both figures and summaries updated. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§8.6.6](./05a-infrastructure-and-network.md#866-deployment-diagram)

### OI-35 - Resolution model gaps

**Question:** Does §16.2 and §16.6 cover the operator role and `member_ref`?

**Decision record, 2026-10-27:** Option A: §16.2, §16.6, and §16.9.2 updated. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§16.2](./12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action)

### OI-36 - Stale wording after OI-01, OI-05, OI-06

**Question:** Are the three stale phrases corrected?

**Decision record, 2026-10-27:** Option A: §14.7, `payout_outbox.payout_id`, and the §17.2 `CANCELLED` row corrected. Decided by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the first scoped application pass. The rationale is the item's Why in chunk 18.

**Open remainder:** None.

**Rule home:** [§14.7](./10-events-hub.md#147-universal-subscribers--cross-service-doctrines)

## Marker register

No inline marker was settled after it was written in this build.

## Walkthrough and delegation history

**Policy: accept the recommended option (set by the tester (fixture), 2026-10-27).** Set in the request for this run: "Answer policy: accept the recommended option. Continue at part checkpoints. Stand-ins: Approver." It names the part checkpoints as stops it may pass (none occurred: the run is `whole`) and an Approver stand-in, `Approver`, which signs only in a request that asks for sign-off, not in this build. It takes a recommended option or a stated default only; it supplies no fact, adopts no dependency `AGENTS.md` reserves for the product owner, and never passes the Pre-SDD stop of step 2a.

Questions the policy answered, in order (each before or at step 2a is recorded here because the folder was first written after step 2a passed):

1. Output mode prompt: `chunks` (the default). Generation: `whole`, as the request said.
2. Deriving from BRDs whose covers are not `Approved` (REFUNDS v1.5 and LOYALTY v1.7, both `In Review`): proceed (recommended).
3. Project Type: Greenfield (recommended; evidence [PSDD/HDR-07.1](../pre-sdd-refunds-platform/02-classification-and-path.md#21-classification) and no codebase named in either BRD).
4. Architecture questionnaire: Accept all (recommended; drivers clear and consistent).
5. Ecosystem selection: Accept all proposed (recommended; no eco-system file).
6. The open items of the acceptance loop: as the Clarification register records.

Not asked, with the reason: the project name (the loaded Pre-SDD names the system "Refunds Platform"); the BRD keys REFUNDS and LOYALTY (proposed in one line, as the Pre-SDD already uses them); the service decomposition (the mapping from the BRD domain concepts is clean: one module per lifecycle, `brd-to-sdd.md` § Workflow when deriving from BRD, step 4); cross-BRD technical mandates (only REFUNDS states Technical Inputs, so there is no conflict to ask); the brand or key color (`AGENTS.md`: not asked during a run; it stays a marker for the product owner).

Cross-BRD reconciliation findings (no question): Customer (REFUNDS) and Member (LOYALTY) are two actors with different roles ([§7.1](./03-users-and-use-cases.md#71-actors)); Point-of-Sale Records and POS Records are one partner with one §12 row ([INT-03](./08-integrations.md#12-integrations)); the dependency of LOYALTY on REFUNDS refund outcomes was checked from both sides: the receipt number as the purchase reference ([§3](./01-executive-summary-scope-risks.md#3-assumptions) assumption 5, marker) and the back-to-Approved outcome that LOYALTY has no rule for (risk R-05, marker) are gaps and BRD follow-ups for both owners.

### Action entries

**Board, 2026-10-27:** took the request HR-003 (`Hand-off: Pre-SDD refunds-platform v1.0 is G3-signed`, from the E2E Architect) and set it `Accepted`; this skill's row set `In progress`.

**First build, 2026-10-27:** chunks 00 to 17, the master, and this register written in one `whole` run; step 6a run with 0 divergences.

**Review, 2026-10-27:** the baseline review (one cleared-context reviewer) wrote chunk 18 with OI-01 to OI-24; the author re-dispatched it once on OI-19 (a finding the author held wrong; not a new pass), and it rewrote the item as `No change`. The author appended OI-25 and OI-26 (behaviour no BRD use case covers) and OI-27 (an AGENTS.md conflict with [REFUNDS 12 TI-01](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) and [REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)).

**Acceptance loop, 2026-10-27:** under the policy, 22 items Accepted - applied, OI-18 Adjusted - applied, OI-19 Rejected; OI-23 and OI-24 shown with their handoff requests and left Open; OI-27 left Open for the product owner. Step 6a rerun after the application, with 0 divergences.

**Board, 2026-10-27:** raised HR-004 and HR-005 to the E2E Architect.

**Application pass 1, 2026-10-27:** the reviewer, continued for a scoped application pass, checked the applied items and raised OI-28 to OI-36; under the policy all nine were Accepted - applied (OI-28 and OI-29 were already in the regenerated chunks), and step 6a was rerun with 0 divergences.

**Application pass 2, 2026-10-27:** the last review pass of this request (3 of 3) checked OI-28 to OI-36 and raised OI-37 and OI-38; under the policy both are `Decided - pending application` (last-pass discoveries), with their records written here when the next request applies them.

**E2E gate, 2026-10-27:** step 8b found E1 and E3 not met; chunk 19 is not written and its gate line reads Locked.

<!-- MASTER: refunds-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
