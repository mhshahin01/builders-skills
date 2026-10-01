<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# Refunds Platform: Solution Design Document (SDD)

**Project / Product Name:** Refunds Platform
**Version:** 1.0
**Status:** Draft
**Author:** shahin
**Reviewers:** Not assigned yet
**Approvers:** Not assigned yet
**Date:** 2026-09-28
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

### Source BRDs (parents)

Every BRD reference in this SDD carries the key of its BRD (for example `LOYALTY/NFR-02`), and every use case is a link to its heading in that BRD (§7.3).

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds Portal | 1.0 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests, tracking and cancellation, branch decisions, payouts to the original card, customer messages |
| LOYALTY | Loyalty Points | 1.0 | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points balance and history for members, points taken back when a purchase's refund is paid |

### Child LLDs (children)

<!-- Written by lld-unifier: each LLD derived from this SDD (from-sdd or hybrid) adds or updates its own row, matched by Link. Checked by sdd-unifier on every run: links resolve, scope services exist in §13, sibling LLD masters (lld-*/*lld-master.md) and combined LLDs (LLD-*.md) whose Related SDD line links to this SDD's master are added if missing, stale rows are flagged, never deleted. Before any LLD exists: one row "None yet". -->

| LLD | Scope (§13 services) | Direction | Version | Link |
|-----|----------------------|-----------|---------|------|
| Refunds Platform | refund-service, payout-service, notification-service, loyalty-service | from-sdd | 1.0 | [refunds-platform-lld-master.md](../lld-refunds-platform/refunds-platform-lld-master.md) |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-09-28 | shahin | | | Initial SDD draft, derived from REFUNDS v1.0 and LOYALTY v1.0 via sdd-unifier. |
| 1.0 | 2026-09-28 | shahin | | | Open items OI-01 to OI-14 accepted and applied: ADR-11 (partner ingress), event `REFUND_PAYOUT_FAILED`, assumption A-9, risks R-08 and R-09, idempotency records, health and relay rules, and restated NFR targets. |

---

## Table of Contents

| Sections | Chunk |
|----------|-------|
| 1-5. Executive Summary, Scope, Assumptions, Risks, Glossary | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 6. Ecosystem Overview | [02-ecosystem-overview.md](./02-ecosystem-overview.md) |
| 7. System Users & Use Cases (incl. 7.3 Use Case Traceability) | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 8.1-8.3 Architecture Style, Context, High-Level Architecture | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.4-8.5 Workflows and Sequences | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| 9-10. Principles and Architectural Decisions | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| 11. Cross-Cutting Concerns | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 12. Integrations | [08-integrations.md](./08-integrations.md) |
| 13. Services Decomposition | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub | [10-events-hub.md](./10-events-hub.md) |
| 15. Service Integration API Contracts | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 refund-service | [13a-service-refund.md](./13a-service-refund.md) |
| 17.2 payout-service | [13b-service-payout.md](./13b-service-payout.md) |
| 17.3 notification-service | [13c-service-notification.md](./13c-service-notification.md) |
| 17.4 loyalty-service | [13d-service-loyalty.md](./13d-service-loyalty.md) |
| 18. Performance & Capacity Planning | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 19. Environments | [15-environments.md](./15-environments.md) |
| 20. Operations Runbook | [16-operations-runbook.md](./16-operations-runbook.md) |
| 21-22. Appendix and Wishlist | [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md) |
| 23. Open Items & Clarifications | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |
| 24. End-to-End System Design | 19-e2e-system-design.md - Locked (e2e gate shut) |

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | §7.2 (03) |
| Figure 2 | System Context Diagram | §8.2 (04) |
| Figure 3 | High-Level Architecture | §8.3 (04) |
| Figure 4 | Workflow - Refund request lifecycle | §8.4.1 (05) |
| Figure 5 | Workflow - Points movements and member views | §8.4.2 (05) |
| Figure 6 | Sequence - Submit a refund request | §8.5.1 (05) |
| Figure 7 | Sequence - Refund decision and payout | §8.5.2 (05) |
| Figure 8 | Sequence - Track and cancel a refund request | §8.5.3 (05) |
| Figure 9 | Async backbone - outbox to inbox | §14.2.1 (10) |
| Figure 10 | Hub topology and fan-out | §14.2.2 (10) |
| Figure 11 | Role taxonomy | §16.9.1 (12) |
| Figure 12 | Grant authority | §16.9.2 (12) |
| Figure 13 | Per-request authorization | §16.9.3 (12) |
| Figure 14 | refund-service - Refund request state machine | §17.1 (13a) |
| Figure 15 | refund-service - Entity relationship | §17.1 (13a) |
| Figure 16 | refund-service - Decision command handling | §17.1 (13a) |
| Figure 17 | payout-service - Payout state machine | §17.2 (13b) |
| Figure 18 | payout-service - Entity relationship | §17.2 (13b) |
| Figure 19 | notification-service - Entity relationship | §17.3 (13c) |
| Figure 20 | notification-service - Event to message | §17.3 (13c) |
| Figure 21 | loyalty-service - Entity relationship | §17.4 (13d) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Source BRDs and Child LLDs | Document Lineage (00) |
| Table 2 | Risks | §4 (01) |
| Table 3 | Glossary (technical delta) | §5 (01) |
| Table 4 | Ecosystem Overview | §6 (02) |
| Table 5 | Actors | §7.1 (03) |
| Table 6 | Use Case Traceability | §7.3 (03) |
| Table 7 | Architecture Principles | §9 (06) |
| Table 8 | Architectural Decisions | §10 (06) |
| Table 9 | Integrations | §12 (08) |
| Table 10 | Services Decomposition | §13 (09) |
| Table 11 | Topic Registry | §14.4 (10) |
| Table 12 | Platform Event Catalog | §14.5 (10) |
| Table 13 | Event Coverage Matrix | §14.9.99 (10) |
| Table 14 | API Contract Index | §15.2 (11) |
| Table 15 | API Coverage Matrix | §15.4 (11) |
| Table 16 | Capability Matrix | §16.5 (12) |
| Table 17 | Permission × Role Matrix | §16.11 (12) |
| Table 18 | List of APIs per service | §17.1-§17.4 (13a-13d) |
| Table 19 | BRD NFRs to technical targets | §18 (14) |
| Table 20 | Environments | §19 (15) |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
