<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# Refunds Platform: Solution Design Document (SDD)

**Project / Product Name:** Refunds Platform
**Version:** 1.3
**Status:** Draft
**Author:** Solution Architecture Team
**Reviewers:** [NEEDS CLARIFICATION: architecture reviewers]
**Approvers:** [NEEDS CLARIFICATION: approvers]
**Date:** 2026-10-01
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

**Sign-off rule:** a child LLD is refreshed from this SDD, and build starts, only once this SDD is Approved and every source BRD version it reads is signed off by its approver (business review BO-06; [review-comments-tracker.md](../review-comments-tracker.md)).

### Source BRDs (parents)

| Key | BRD | Version | Status | Link | Covers |
|-----|-----|---------|--------|------|--------|
| REFUNDS | Refunds Portal | 1.1 | In Review: approved as 1.0; version 1.1 holds the changes of the business review of 2026-10-01 and needs sign-off (REFUNDS 14 / Delivery gate G6) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests, tracking, and cancellation; branch decisions; payouts to the original card; customer messages |
| LOYALTY | Loyalty Points | 1.3 | In Review: versions 1.1 to 1.3 not yet approved; 1.3 holds the changes of the business review of 2026-10-01 (LOYALTY 14 / Delivery gate G6) | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points earned on branch purchases; points balance and history; points taken back after a paid refund |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | SDD version | State | Link |
|-----|----------------------|-----------|---------|-------------|-------|------|
| Refunds Platform | refund-service, loyalty-service, payout-service, notification-service; Angular web app | from-sdd | 1.1 | 1.2 | Out of date since the business review of 2026-10-01: LLD 1.1 read SDD 1.2 (its 00 Changes Log, row 1.1), and the review changed this SDD to 1.3; lld-unifier refreshes it once this SDD is Approved (sign-off rule above) | [refunds-platform-lld-master.md](../lld-refunds-platform/refunds-platform-lld-master.md) |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | 2026-09-30   | Solution Architecture Team |             |             | Initial SDD draft, derived from REFUNDS v1.0 and LOYALTY v1.0 via sdd-unifier. |
| 1.0 (amended) | 2026-09-30   | Solution Architecture Team |             |             | Published without a version bump, against the master VERSIONING rule; kept as 1.0 because the LLD and the decision log cite 1.0 (business review DC-11). Open items OI-01 to OI-22 from the independent review accepted and applied: ADR-10 added, the `REFUND_APPROVED` and `RefundPaid` contracts extended, and the registers and §7.3 reconciled again. |
| 1.1     | 2026-10-01   | Solution Architecture Team |             |             | LOYALTY updated from v1.0 to v1.2 (targeted update via sdd-unifier). §17.4: whole-euro earning with no 0-point movement (LOYALTY 03 answers the rounding clarification), a member purchase record, take-backs per LOYALTY/UC-02 BR-3 (answers the partial take-back clarification), a refund reported before its purchase kept until POS Records reports it (BR-4, replacing the next-day `NO_EARN` close), movement dates, the step 4 movement detail, LOYALTY/UC-01 and LOYALTY/UC-02 E1, and a 15-minute import for the new LOYALTY/NFR-03; §18.2 earn and take-back lag targets; Figures 5, 8, 24, and 25 redrawn. The LOYALTY 08 Refunds Portal row is mapped to `RefundPaid` (§12, §14.10); BR-1 labels follow its new wording; the former LOYALTY 02 assumptions are cited as dependencies; member sign-in with the existing loyalty program account is flagged in §3; §19 takes the LOYALTY UAT prerequisites. Step 6a rerun with no divergence. |
| 1.2     | 2026-10-01   | Solution Architecture Team |             |             | The 23 clarification markers of chunks 10, 12, and 13a to 13d decided and applied. §14.9: the seven event payload contracts ratified as `committed` (version 1.0.0, money as decimal strings), with `customerContact` conditional and `customerId` tagged `pii`; §14.6 rule 4: one consumer retry and dead-letter rule by failure class; §16.6: branch managers provisioned by the tenant staff administrator in the Keycloak realm administration; §17.1 to §17.4: the remaining columns, constraints, and indexes, the DTO business fields of the refund-service and loyalty-service endpoints, and retention through the tenant settings `refundRecordRetention`, `contactDetailsRetention`, and `messageLogRetention` (§11.2); §17.2: a payout still failing after the retry window is reported once and retried at a post-window interval until paid, and no card data enters any deployable (§15.3 API-02 data need); §17.3: a claim lease for the message worker; §17.4: the receipt number as the take-back match key (§14.10 note, §15.3 API-04 data need), ledger retention, and the publication-log replay cadence and alert (§11.1, §11.4); the `refund-contact-erasure` and `loyalty-member-erasure` jobs (§17.1, §17.4, §16.8). Back-filled: §1, §3, §4 R-03, §5, §8.1.2, §12 INT-01, §13, §18.3, §20.1.9. Step 6a rerun with no divergence. Chunk 19 (End-to-End System Design) written. |
| 1.3     | 2026-10-01   | Solution Architecture Team | Business review panel (Business Owner, SME, Product Manager, Principal Architect, Document Consistency) |             | Business review of 2026-10-01 of REFUNDS, LOYALTY, and this SDD; its decision log is [review-comments-tracker.md](../review-comments-tracker.md), and the decisions that changed this SDD are in the Business review register of [decision-log.md](./decision-log.md). Source BRDs are now REFUNDS 1.1 and LOYALTY 1.3, both In Review. Main changes: `REFUND_PAYOUT_DELAYED` (eight integration events) and one payout clock, the tenant setting `payoutRetryWindow` counted from the approval (BO-03); `paid_at` as the one paid time (PA-02); one normalised receipt number and §3 assumption 12 (PA-03); POS Records as the source of member numbers and branch identifiers, and what each member sign-in answer requires in §16.2 (PA-05); the §14.3 wire format, final facts in §14.5, and a versioned `RefundPaidEvent` (PA-06); one relay per outbox and the dedup window (PA-07); the §14.7 extraction contract (PA-08); the refund attributes that leave the refund context (PA-09); `POST /v1/receipt-lookups` and no personal data in URLs (PA-10); composite primary and foreign keys led by `tenant_id` (PA-11); the wider e2e gate condition E3 (PA-12); the `own_customer_id` decision guard (SME-05); `payout_reference` (SME-06); the earn rate recorded per purchase (BO-09); REFUNDS/UC-06 in §7.3 (PM-10); risk owners in §4 (BO-05, BO-12); Compliance sections pointing to the BRD legal clearances (BO-07); Superseded statuses in chunk 18 (DC-03); State and Status columns in the Document Lineage (DC-11). Then the review's verification pass (tracker, Verification pass). Chunk 19 is not refreshed while the e2e gate is shut and stays 1.2; the child LLD is out of date (Document Lineage). Existing section numbers are unchanged. |

---

## Table of Contents

Sections and the chunks that hold them are listed in the [master index](./refunds-platform-sdd-master.md).

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | §7.2 ([03](./03-users-and-use-cases.md)) |
| Figure 2 | System Context Diagram | §8.2 ([04](./04-architecture-style-and-diagrams.md)) |
| Figure 3 | High-Level Architecture | §8.3 ([04](./04-architecture-style-and-diagrams.md)) |
| Figure 4 | Workflow - Refund lifecycle | §8.4.1 ([05](./05-workflows-and-sequences.md)) |
| Figure 5 | Workflow - Points balance, history, and takeback | §8.4.2 ([05](./05-workflows-and-sequences.md)) |
| Figure 6 | Sequence - Submit a refund request | §8.5.1 ([05](./05-workflows-and-sequences.md)) |
| Figure 7 | Sequence - Refund decision and payout | §8.5.2 ([05](./05-workflows-and-sequences.md)) |
| Figure 8 | Sequence - Points taken back after a refund is paid | §8.5.3 ([05](./05-workflows-and-sequences.md)) |
| Figure 9 | Async backbone | §14.2.1 ([10](./10-events-hub.md)) |
| Figure 10 | Hub topology and fan-out | §14.2.2 ([10](./10-events-hub.md)) |
| Figure 11 | Role taxonomy | §16.9.1 ([12](./12-centralized-user-roles.md)) |
| Figure 12 | Grant authority | §16.9.2 ([12](./12-centralized-user-roles.md)) |
| Figure 13 | Per-request authorization | §16.9.3 ([12](./12-centralized-user-roles.md)) |
| Figure 14 | refund-service - RefundRequest state machine | §17.1 ([13a](./13a-service-refund.md)) |
| Figure 15 | refund-service - Entity relationship | §17.1 ([13a](./13a-service-refund.md)) |
| Figure 16 | refund-service - Submit flow | §17.1 ([13a](./13a-service-refund.md)) |
| Figure 17 | refund-service - Payout outcome handling | §17.1 ([13a](./13a-service-refund.md)) |
| Figure 18 | payout-service - Payout state machine | §17.2 ([13b](./13b-service-payout.md)) |
| Figure 19 | payout-service - Entity relationship | §17.2 ([13b](./13b-service-payout.md)) |
| Figure 20 | payout-service - Send and retry flow | §17.2 ([13b](./13b-service-payout.md)) |
| Figure 21 | payout-service - Approved refund to payout | §17.2 ([13b](./13b-service-payout.md)) |
| Figure 22 | notification-service - Entity relationship | §17.3 ([13c](./13c-service-notification.md)) |
| Figure 23 | notification-service - Event to message flow | §17.3 ([13c](./13c-service-notification.md)) |
| Figure 24 | loyalty-service - Entity relationship | §17.4 ([13d](./13d-service-loyalty.md)) |
| Figure 25 | loyalty-service - Take-back flow | §17.4 ([13d](./13d-service-loyalty.md)) |
| Figure 26 | End-to-end system context | §24.2 ([19](./19-e2e-system-design.md)) |
| Figure 27 | End-to-end layered architecture | §24.3 ([19](./19-e2e-system-design.md)) |
| Figure 28 | Producer, topic, and consumer fan-out, phase 1 | §24.5.1 ([19](./19-e2e-system-design.md)) |
| Figure 29 | Saga - refund decision to payout | §24.8.1 ([19](./19-e2e-system-design.md)) |
| Figure 30 | Saga - points take-back after a paid refund | §24.8.2 ([19](./19-e2e-system-design.md)) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Source BRDs | [Document Lineage](#document-lineage) |
| Table 2 | Child LLDs | [Document Lineage](#document-lineage) |
| Table 3 | Changes Log | [Changes Log](#changes-log) |
| Table 4 | Risks | §4 ([01](./01-executive-summary-scope-risks.md)) |
| Table 5 | Glossary | §5 ([01](./01-executive-summary-scope-risks.md)) |
| Table 6 | Ecosystem Overview | §6 ([02](./02-ecosystem-overview.md)) |
| Table 7 | Actors | §7.1 ([03](./03-users-and-use-cases.md)) |
| Table 8 | Use Case Traceability | §7.3 ([03](./03-users-and-use-cases.md)) |
| Table 9 | Architecture Principles | §9 ([06](./06-principles-and-decisions.md)) |
| Table 10 | Architectural Decisions | §10 ([06](./06-principles-and-decisions.md)) |
| Table 11 | Integrations | §12 ([08](./08-integrations.md)) |
| Table 12 | Services Decomposition | §13 ([09](./09-services-summary.md)) |
| Table 13 | Topic Registry | §14.4 ([10](./10-events-hub.md)) |
| Table 14 | Platform Event Catalog | §14.5 ([10](./10-events-hub.md)) |
| Table 15 | Payload Coverage Matrix | §14.9.99 ([10](./10-events-hub.md)) |
| Table 16 | In-Process Domain Events | §14.10 ([10](./10-events-hub.md)) |
| Table 17 | Contract Index | §15.2 ([11](./11-api-contracts.md)) |
| Table 18 | API Coverage Matrix | §15.4 ([11](./11-api-contracts.md)) |
| Table 19 | External Contracts Awaiting the User | §15.6 ([11](./11-api-contracts.md)) |
| Table 20 | Capability Matrix | §16.5 ([12](./12-centralized-user-roles.md)) |
| Table 21 | Permission × Role Matrix | §16.11 ([12](./12-centralized-user-roles.md)) |
| Table 22 | Load Estimates | §18.1 ([14](./14-performance-and-capacity.md)) |
| Table 23 | Throughput Targets | §18.2 ([14](./14-performance-and-capacity.md)) |
| Table 24 | Environments | §19 ([15](./15-environments.md)) |
| Table 25 | Counts at a Glance | §24 ([19](./19-e2e-system-design.md)) |
| Table 26 | Service Landscape | §24.1 ([19](./19-e2e-system-design.md)) |
| Table 27 | Synchronous Edges | §24.7 ([19](./19-e2e-system-design.md)) |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
