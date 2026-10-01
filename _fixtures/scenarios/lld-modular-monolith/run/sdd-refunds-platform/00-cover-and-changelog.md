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
**Author:** sdd-unifier (derived draft)
**Reviewers:** Pending
**Approvers:** Pending
**Date:** 2026-09-30
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds Portal | 1.0 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests, branch manager decisions, payouts to the original card, customer messages |
| LOYALTY | Loyalty Points | 1.0 | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points balance and history; points taken back when a purchase is refunded |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| Refunds Platform | refund, payout, notification, loyalty | from-sdd | 1.0 | 1.1 | [refunds-platform-lld-master.md](../lld-refunds-platform/refunds-platform-lld-master.md) |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-09-30 | sdd-unifier | | | Initial SDD draft, derived from REFUNDS v1.0 and LOYALTY v1.0 via sdd-unifier. |
| 1.1 | 2026-09-30 | sdd-unifier | | | Open items OI-01 to OI-22 accepted and applied (chunk 18 Resolution Log); contract reconciliation rerun. |

---

## Table of Contents

| Section | Chunk |
|---------|-------|
| 1-5. Executive Summary, Scope, Assumptions, Risks, Glossary | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 6. Ecosystem Overview | [02-ecosystem-overview.md](./02-ecosystem-overview.md) |
| 7. System Users & Use Cases | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 8.1-8.3 Architecture Style, Context, High-Level Architecture | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.4-8.5 Workflows and Sequences | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| 9-10. Principles and Architectural Decisions | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| 11. Cross-Cutting Concerns | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 12. Integrations | [08-integrations.md](./08-integrations.md) |
| 13. Services Decomposition | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub | [10-events-hub.md](./10-events-hub.md) |
| 15. Service Integration API Contracts | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 refund | [13a-service-refund.md](./13a-service-refund.md) |
| 17.2 payout | [13b-service-payout.md](./13b-service-payout.md) |
| 17.3 notification | [13c-service-notification.md](./13c-service-notification.md) |
| 17.4 loyalty | [13d-service-loyalty.md](./13d-service-loyalty.md) |
| 18. Performance & Capacity Planning | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 19. Environments | [15-environments.md](./15-environments.md) |
| 20. Operations Runbook | [16-operations-runbook.md](./16-operations-runbook.md) |
| 21-22. Appendix and Wishlist | [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md) |
| 23. Open Items & Clarifications | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |
| 24. End-to-End System Design | 19-e2e-system-design.md - Locked (e2e gate, see the master) |

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | §7.2 (03) |
| Figure 2 | System Context Diagram | §8.2 (04) |
| Figure 3 | High-Level Architecture | §8.3 (04) |
| Figure 4 | Workflow - Refund request to payout | §8.4.1 (05) |
| Figure 5 | Workflow - Points take-back after a paid refund | §8.4.2 (05) |
| Figure 6 | Sequence - Refund submission | §8.5.1 (05) |
| Figure 7 | Sequence - Refund decision and payout | §8.5.2 (05) |
| Figure 8 | Sequence - Cancel a refund request | §8.5.3 (05) |
| Figure 9 | Role taxonomy | §16.9.1 (12) |
| Figure 10 | Grant authority | §16.9.2 (12) |
| Figure 11 | Per-request authorization | §16.9.3 (12) |
| Figure 12 | refund - request state machine | §17.1 (13a) |
| Figure 13 | refund - entity relationship | §17.1 (13a) |
| Figure 14 | refund - decision command | §17.1 (13a) |
| Figure 15 | payout - payout state machine | §17.2 (13b) |
| Figure 16 | payout - entity relationship | §17.2 (13b) |
| Figure 17 | payout - dispatcher cycle | §17.2 (13b) |
| Figure 18 | notification - entity relationship | §17.3 (13c) |
| Figure 19 | notification - event to message | §17.3 (13c) |
| Figure 20 | loyalty - entity relationship | §17.4 (13d) |
| Figure 21 | loyalty - purchase intake and pending take-backs | §17.4 (13d) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Risks | §4 (01) |
| Table 2 | Glossary | §5 (01) |
| Table 3 | Ecosystem Overview | §6 (02) |
| Table 4 | Actors | §7.1 (03) |
| Table 5 | Use Case Traceability | §7.3 (03) |
| Table 6 | Architecture Principles | §9 (06) |
| Table 7 | Architectural Decisions | §10 (06) |
| Table 8 | Integrations | §12 (08) |
| Table 9 | Services Decomposition | §13 (09) |
| Table 10 | Hub topology trade-offs | §14.2 (10) |
| Table 11 | Common Value Objects | §14.9.0 (10) |
| Table 12 | In-Process Domain Events | §14.10 (10) |
| Table 13 | Contract Conventions | §15.1 (11) |
| Table 14 | Contract Index | §15.2 (11) |
| Table 15 | API-01 DTO fields and errors | §15.3 (11) |
| Table 16 | Coverage Matrix | §15.4 (11) |
| Table 17 | External Contracts Awaiting the User | §15.6 (11) |
| Table 18 | Capability Matrix | §16.5 (12) |
| Table 19 | Permission × Role Matrix | §16.11 (12) |
| Table 20 | refund - List of APIs | §17.1 (13a) |
| Table 21 | loyalty - List of APIs | §17.4 (13d) |
| Table 22 | NFR technical targets | §18 (14) |
| Table 23 | Load Estimates | §18.1 (14) |
| Table 24 | Throughput Targets | §18.2 (14) |
| Table 25 | Peak Scenarios | §18.3 (14) |
| Table 26 | Environments | §19 (15) |
| Table 27 | Diagnostics Cheatsheet | §20.2 (16) |
| Table 28 | Open Items Resolution Log | §23 (18) |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
