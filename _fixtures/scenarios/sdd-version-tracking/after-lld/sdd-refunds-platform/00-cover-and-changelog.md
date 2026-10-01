<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# Refunds Platform: Solution Design Document (SDD)

**Project / Product Name:** Refunds Platform
**Version:** 1.1
**Status:** Draft
**Author:** Solution Architecture Team
**Reviewers:** [NEEDS CLARIFICATION: architecture reviewers]
**Approvers:** [NEEDS CLARIFICATION: approvers]
**Date:** 2026-09-30
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds Portal | 1.0 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests, tracking, and cancellation; branch decisions; payouts to the original card; customer messages |
| LOYALTY | Loyalty Points | 1.1 | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points balance and history; points taken back after a paid refund |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| Refunds Platform | refund-service, loyalty-service, payout-service, notification-service; Angular web app | from-sdd | 1.1 | 1.1 | [refunds-platform-lld-master.md](../lld-refunds-platform/refunds-platform-lld-master.md) |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | 2026-09-30   | Solution Architecture Team |             |             | Initial SDD draft, derived from REFUNDS v1.0 and LOYALTY v1.0 via sdd-unifier. |
| 1.0     | 2026-09-30   | Solution Architecture Team |             |             | Open items OI-01 to OI-22 from the independent review accepted and applied: ADR-10 added, the `REFUND_APPROVED` and `RefundPaid` contracts extended, and the registers and §7.3 reconciled again. |
| 1.1     | 2026-09-30   | Solution Architecture Team |             |             | LOYALTY moved from v1.0 to v1.1 (LOYALTY/UC-02 BR-3 and AC-2: a partial refund takes back only the points of the refunded amount). §17.4 takes back the full EUR paid back on a purchase, capped at its earned points, and `refund_takeback` keeps the paid amount; the §17.4 clarification on partial refunds is closed. Source BRDs register, §7.3 group row, §1, R-03, §5 (take-back, and the two meanings of "partial refund", flagged), §8.4.2, §8.5.3, and §21 updated. Step 6a rerun clean; the Child LLD Refunds Platform is out of date. |

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

<!-- MASTER: refunds-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
