<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Retail Customer Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Retail Customer Platform
-->

# Retail Customer Platform: Solution Design Document (SDD)

**Project / Product Name:** Retail Customer Platform
**Version:** 1.0
**Status:** Draft - part 1 of 3
**Author:** Solution Architecture (draft derived with sdd-unifier)
**Reviewers:** To be assigned
**Approvers:** To be assigned
**Date:** 2026-09-28
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds Portal | 1.0 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests for branch purchases, branch-manager decisions, payouts to the original card, and customer messages by email and SMS |
| LOYALTY | Loyalty Points | 1.2 | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points balance and history, vouchers bought with points, adjustments by loyalty managers, and points taken back when a purchase is refunded |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | Link |
|-----|----------------------|-----------|---------|------|
| Refunds Core | refunds, card-payouts | from-sdd | 0.1 | [refunds-core-lld-master.md](../lld-refunds-core/refunds-core-lld-master.md) |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | Pending (part 3) | Solution Architecture | | | Initial SDD draft, derived from REFUNDS v1.0 and LOYALTY v1.2 via sdd-unifier. |

---

## Table of Contents

**Sections**

| Section | Chunk |
|---------|-------|
| 1. Executive Summary, 2. Scope, 3. Assumptions, 4. Risks, 5. Glossary | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 6. Ecosystem Overview | [02-ecosystem-overview.md](./02-ecosystem-overview.md) |
| 7. System Users & Use Cases (Actors, Use Case Diagram, Use Case Traceability) | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 8.1 Architecture Style, 8.2 Context Diagram, 8.3 High-Level Architecture | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.4 Workflow Diagrams, 8.5 Sequence Diagrams | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| 9. Architecture Principles, 10. Architectural Decisions | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| 11. Cross-Cutting Concerns | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 12. Integrations | [08-integrations.md](./08-integrations.md) |
| 13. Services Decomposition | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub | 10-events-hub.md - Pending (part 2) |
| 15. Service Integration API Contracts | 11-api-contracts.md - Pending (part 2) |
| 16. Centralized User Roles & Authorities | 12-centralized-user-roles.md - Pending (part 2) |
| 17.1 refunds | 13a-service-refunds.md - Pending (part 2) |
| 17.2 card-payouts | 13b-service-card-payouts.md - Pending (part 2) |
| 17.3 loyalty | 13c-service-loyalty.md - Pending (part 2) |
| 17.4 notifications | 13d-service-notifications.md - Pending (part 2) |
| 18. Performance & Capacity Planning | 14-performance-and-capacity.md - Pending (part 3) |
| 19. Environments | 15-environments.md - Pending (part 3) |
| 20. Operations Runbook | 16-operations-runbook.md - Pending (part 3) |
| 21. Appendix, 22. Wishlist | 17-appendix-and-wishlist.md - Pending (part 3) |
| 23. Open Items & Clarifications | 18-open-items-and-clarifications.md - Pending (part 3) |
| 24. End-to-End System Design | 19-e2e-system-design.md - Locked until chunk 18 is cleared |

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | §7.2, [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| Figure 2 | System Context Diagram | §8.2, [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| Figure 3 | High-Level Architecture | §8.3, [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| Figure 4 | Workflow: Refund request lifecycle | §8.4.1, [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| Figure 5 | Workflow: Card payout with retry and escalation | §8.4.2, [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| Figure 6 | Workflow: Points earned and taken back | §8.4.3, [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| Figure 7 | Workflow: Redeem points for a voucher | §8.4.4, [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| Figure 8 | Workflow: Adjust a customer's points with second approval | §8.4.5, [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Source BRDs | 00 § Document Lineage |
| Table 2 | Child LLDs | 00 § Document Lineage |
| Table 3 | Changes Log | 00 § Changes Log |
| Table 4 | Risks | §4, [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| Table 5 | Glossary | §5, [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| Table 6 | Ecosystem Overview | §6, [02-ecosystem-overview.md](./02-ecosystem-overview.md) |
| Table 7 | Actors | §7.1, [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| Table 8 | Use Case Traceability | §7.3, [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| Table 9 | Architecture Principles | §9, [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| Table 10 | Architectural Decisions | §10, [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| Table 11 | Integrations | §12, [08-integrations.md](./08-integrations.md) |
| Table 12 | Services Decomposition | §13, [09-services-summary.md](./09-services-summary.md) |

<!-- MASTER: retail-customer-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
