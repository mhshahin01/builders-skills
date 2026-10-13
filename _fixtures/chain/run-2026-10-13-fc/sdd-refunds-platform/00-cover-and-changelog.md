<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Platform
VERSION: 1.4
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# Refunds Platform: Solution Design Document (SDD)

**Project / Product Name:** Refunds Platform
**Version:** 1.4
**Status:** Draft
**Author:** Solution Architect agent (sdd-unifier skill, Claude Code)
**Reviewers:** Not named yet
**Approvers:** Not named yet
**Date:** 2026-10-10
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds Portal | 1.5 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests, branch-manager decisions, payouts to the original card (held for a card dispute, paid again when sent back), customer messages, refund outcomes reported to Loyalty Points, the branch refund report, the pilot rollout |
| LOYALTY | Loyalty Points | 1.7 | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Earning points on branch purchases, points balance and history, taking points back after a paid refund reported from the refund-reporting start date |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| Refunds Platform | refund-request, payout, customer-notification, loyalty-points | from-sdd | 1.2 | 1.4 | [refunds-platform-lld-master.md](../lld-refunds-platform/refunds-platform-lld-master.md) |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | 2026-10-10   | Solution Architect agent (sdd-unifier skill, Claude Code) |             |             | Initial SDD draft, derived from REFUNDS v1.2 and LOYALTY v1.3 via sdd-unifier. The acceptance loop applied OI-01, OI-02, OI-03, OI-05, OI-06, OI-07, OI-08, OI-09, OI-10, OI-11, OI-12, OI-13, OI-14, OI-15, OI-16, OI-17, OI-18, OI-19, OI-20, OI-21, OI-22, OI-23, OI-24, and OI-25 (accepted), rejected OI-04 (No change), and answered the ADR-08 enforcement-point marker (ADR-08 Accepted); OI-26 and OI-27 are decided and pending application. Step 6a fixes after the last review pass: BRD key on the REFUNDS 12 TI-01 and REFUNDS 12 TI-02 citations of §8.1.2. Chunks: none (initial build) |
| 1.1     | 2026-10-10   | Solution Architect agent (sdd-unifier skill, Claude Code) |             |             | Applied the decisions that waited for application. OI-26: the `payout-retention-purge` and `notification-retention-purge` jobs are `Schedule` rows of §17.2 and §17.3 Input; the INT-01 When and Auth cells name API-07; API-03 Request headers and §17.3 API Standards give the branch-manager alert its per-recipient idempotency key; the Figure 17 Summary places a paid resolution on an Unknown or Stopped payout; §17.2 Boundaries and Entity Relationship (concepts and marker) name the payout resolution rows; brought in line with OI-26, the §17.3 Tenant filter names the per-tenant run of each `Schedule` job. OI-27: the `PayoutAttemptFailed` and `RefundRequestPaid` listeners of §17.3 take an advisory lock per refund request. OI-28, raised by this update's application check and accepted: the branch-manager alert's per-recipient idempotency key is a name-based UUID (RFC 9562 version 5) of the message id and the recipient's IAM user id, in API-03 Request headers and §17.3 Select and API Standards. Chunks: 08, 11, 13b, 13c, 18 |
| 1.2     | 2026-10-10   | Review Panel agent (business-reviewer-unifier skill, Claude Code) |             |             | Business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md)); its points were decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Points applied: BO-06 (07: each product's Prod gate needs its BRD's legal confirmation; hosting location after the law); SME-02 (13a: receipt-number uniqueness marker); SME-05 (01: R-02, CardPay confirmed before the payout build; 07: §11.3; 13b: per-branch merchant account marker); PM-01 (13d: partial take-back rule replaces its marker); PM-02 (07: a Prod gate and an enablement setting per product, §11.3 and §11.5); PM-03 (13a: Objective 1 metric `refund_submitted_to_paid_seconds`); PM-07 (13a: contact-detail rule and window re-check are settings with markers); PM-10 (13c, 10: full-approval message); PA-01 (13b, 16: no other way to pay until REFUNDS answers; widened never-succeeds marker); PA-02 (13d: parked take-backs end after the parking period, marker; 07: §11.4 alert on a late purchase); PA-05 (10: §14.7 saga doctrine; 07: approved-to-paid alert); PA-06 (10: committed DTO fields, no contact or member data, narrowed marker; 12: §16.4.3 payload column; 13b: payout keeps the branch); PA-07 (11: API-08 `StaffDirectoryPort` in §15.1 to §15.4; 08: IAM paragraph; 13c: Boundaries, Select, Integrations); PA-08 (13d, 12: the membership source owns membership, leave-date copy, §16.6 marker asks the delay); PA-09 (06: ADR-01 customer-notification trigger and second refund source); PA-10 (10: §14.10 Ordering and `sequence`; 13c: stale messages superseded); PA-11 (13a, 13d: no business references in logs); DC-02 (03, 04, 05, 07, 11, 13d: API-05 direction and API-02 callback stated as open); DC-04 (13b, 14: Stopped or Unknown payouts count as missing); DC-07 (13d: Constraints allow the leaver purge); DC-08 (06: ADR-07 same tenant claim, own-request link open; 07: §11.2; 14: §18.5 per ADR-07 outcome); DC-09 (03: §7.3 detail endpoints). Verify fixes: PM-10 (13c Input and Event Model; 05 Figure 4 and the Figure 9 Summary: the full-approval message); PA-01 (13a Decide: the identity link is open in ADR-07, with DC-08); PA-02 (05 Figure 6 and Summary: parking period, 1 point per 1 EUR; 07 §11.3: take-backs park while Loyalty Points is off); PA-06 (10 §14.1 and §14.9.0: committed fields); PA-07 (08: INT-04 Platform IAM staff directory and Figure 12 edge; 11: API-08 on the external template, §15.4 and §15.6 rows, §15 intro count; 03: §7.3 [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) APIs; 09: customer-notification row; 13c Output, Error Handling, In transit; 04 Figures 2 and 3 edges; 12 §16.1; 06 ADR-05 wording); DC-02 (11: API-05 block written for a push with the fetch values, Type back to the template value; 08 INT-01, 09 payout Input, 13b Boundaries, Input and Output: API-02 only if CardPay calls back; 13d Boundaries, Output, List of APIs and Error Handling: push or fetch; 04 Figure 2 Summary and Figure 3, 08 Figure 12: conditional edges). Records: [decision-log / Business review register](./decision-log.md#business-review-register). Chunks: 01, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13a, 13b, 13c, 13d, 14, 16 |
| 1.3     | 2026-10-10   | Solution Architect agent (sdd-unifier skill, Claude Code) |             |             | Took REFUNDS v1.5 and LOYALTY v1.7, the versions after the business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md)), with the review's hand-off. Derived: card disputes (payout `Held`, `Cancelled`, API-09, the `CardPaymentDisputeOpened` and `CardPaymentDisputeClosed` events, an Approved request Rejected after a refunded dispute); a Paid payout sent back (payout rounds, `PayoutReturned`, `RefundRequestPayoutReturned`, back-to-Approved message); the refund outcomes reported to Loyalty Points (loyalty-points listens to Paid, Rejected, Cancelled, and sent back; kept while Loyalty Points is off; the refund-reporting start date of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-7: only refunds the Refunds Portal reports); the pilot branches (`REFUNDS_PORTAL_BRANCHES`, `BRANCH_NOT_STARTED`); the POS Records start condition; REFUNDS/NFR-07 and REFUNDS Business Objectives 4 and 5; the [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-5: refund paid before earning wait and LOYALTY/NFR-02; R-09; markers for [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-9: other refund windows and BR-10: reason list, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-7: second approval above an amount, the customer care view, and the payout and loyalty effects CardPay and LOYALTY must answer. The §17.4 parking-period marker is settled by LOYALTY v1.5; OI-14 and OI-24 are superseded by REFUNDS v1.4. Applied, by the answer policy: OI-29 (one IAM realm, ADR-07), OI-30 (complete DTO types), OI-31 (`PAYOUT_OPERATOR` and payout resolutions with a second operator's confirmation), raised by the author; OI-32 to OI-42, raised by the delta review; OI-43 to OI-46, raised by the application check. OI-47, raised by the last review pass, is decided and pending application. Step 6a fixes: BRD keys on `REFUNDS/NFR-01` and `REFUNDS/NFR-04` citations; short labels on BR-8 and AC-13 citations. Chunks: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13a, 13b, 13c, 13d, 14, 15, 16, 17, 18 |
| 1.4     | 2026-10-10   | Solution Architect agent (sdd-unifier skill, Claude Code) |             |             | Applied the decision that waited for application. OI-47: §17.2 Disputes states the `refund-request` dispute copy as §17.1 Boundaries and Decide set it: a copy of each dispute with its state and highest `sequence`, with the open ones shown at decision time. Step 6a fix: BRD key on the REFUNDS 12 TI-01 citation of the §6 Observability: Metrics row (an editorial key fix, not a content change, so chunk 02 is not listed). Chunks: 13b, 18 |

---

## Table of Contents

- [00 Cover, Changelog & Table of Contents](./00-cover-and-changelog.md)
- [01 Executive Summary, Scope, Assumptions, Risks & Glossary](./01-executive-summary-scope-risks.md)
- [02 Ecosystem Overview](./02-ecosystem-overview.md)
- [03 System Users & Use Cases](./03-users-and-use-cases.md)
- [04 Architecture Style, Context & HLA Diagrams](./04-architecture-style-and-diagrams.md)
- [05 Workflow & Sequence Diagrams](./05-workflows-and-sequences.md)
- [06 Architecture Principles & Architectural Decisions](./06-principles-and-decisions.md)
- [07 Cross-Cutting Concerns](./07-cross-cutting-concerns.md)
- [08 Integrations](./08-integrations.md)
- [09 Services Decomposition Summary](./09-services-summary.md)
- [10 Centralized Event Hub](./10-events-hub.md)
- [11 Service Integration API Contracts](./11-api-contracts.md)
- [12 Centralized User Roles & Authorities](./12-centralized-user-roles.md)
- [13a refund-request](./13a-service-refund-request.md)
- [13b payout](./13b-service-payout.md)
- [13c customer-notification](./13c-service-customer-notification.md)
- [13d loyalty-points](./13d-service-loyalty-points.md)
- [14 Performance & Capacity Planning](./14-performance-and-capacity.md)
- [15 Environments](./15-environments.md)
- [16 Operations Runbook](./16-operations-runbook.md)
- [17 Appendix & Wishlist](./17-appendix-and-wishlist.md)
- [18 Open Items & Clarifications](./18-open-items-and-clarifications.md)
- 19 End-to-End System Design - Locked (e2e gate)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | 03 §7.2 |
| Figure 2 | System Context Diagram | 04 §8.2 |
| Figure 3 | High-Level Architecture | 04 §8.3 |
| Figure 4 | Refund request lifecycle | 05 §8.4.1 |
| Figure 5 | Payout with retries | 05 §8.4.2 |
| Figure 6 | Points take-back after a paid refund | 05 §8.4.3 |
| Figure 7 | Earning points from POS purchases | 05 §8.4.4 |
| Figure 8 | Submit a refund request | 05 §8.5.1 |
| Figure 9 | Decide and pay out a refund | 05 §8.5.2 |
| Figure 10 | Take back points for a paid refund | 05 §8.5.3 |
| Figure 11 | View own refund requests and points | 05 §8.5.4 |
| Figure 12 | Integration topology | 08 §12 |
| Figure 13 | Role taxonomy | 12 §16.9.1 |
| Figure 14 | Grant authority | 12 §16.9.2 |
| Figure 15 | Per-request authorization | 12 §16.9.3 |
| Figure 16 | Refund request state machine | 13a §17.1 |
| Figure 17 | Payout state machine | 13b §17.2 |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Risks | 01 §4 |
| Table 2 | Glossary | 01 §5 |
| Table 3 | Ecosystem Overview | 02 §6 |
| Table 4 | Actors | 03 §7.1 |
| Table 5 | Use Case Traceability | 03 §7.3 |
| Table 6 | Architecture Principles | 06 §9 |
| Table 7 | Architectural Decisions | 06 §10 |
| Table 8 | Integrations | 08 §12 |
| Table 9 | Services Decomposition | 09 §13 |
| Table 10 | In-Process Domain Events | 10 §14.10 |
| Table 11 | Contract Index | 11 §15.2 |
| Table 12 | Permission × Role Matrix | 12 §16.11 |
| Table 13 | NFR Targets | 14 §18.5 |
| Table 14 | Environments | 15 §19 |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
