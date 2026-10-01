<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Portal
-->

# Refunds Portal: Solution Design Document (SDD)

**Project / Product Name:** Refunds Portal
**Version:** 1.0
**Status:** Draft
**Author:** **[NEEDS CLARIFICATION: SDD author]**
**Reviewers:** Pending
**Approvers:** Pending
**Date:** 2026-09-28
**Related BRD:** [Refunds Portal BRD v1.0](../brd-refunds-portal/refunds-portal-brd-master.md) (chunked, folder `../brd-refunds-portal/`)

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | 2026-09-28   | sdd-unifier |            |             | Initial SDD draft, derived from BRD v1.0 via sdd-unifier. |

---

## Table of Contents

| Sections | Chunk |
|----------|-------|
| 1-5. Executive Summary, Scope, Assumptions, Risks, Glossary | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 6. Ecosystem Overview | [02-ecosystem-overview.md](./02-ecosystem-overview.md) |
| 7. System Users & Use Cases (incl. 7.3 Use Case Traceability) | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 8.1-8.3 Architecture Style, Context Diagram, High-Level Architecture | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.4-8.5 Workflow and Sequence Diagrams | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| 9-10. Architecture Principles, Architectural Decisions | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| 11. Cross-Cutting Concerns | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 12. Integrations | [08-integrations.md](./08-integrations.md) |
| 13. Services Decomposition | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub | [10-events-hub.md](./10-events-hub.md) |
| 15. Service Integration API Contracts | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 refund | [13a-service-refund.md](./13a-service-refund.md) |
| 17.2 payout | [13b-service-payout.md](./13b-service-payout.md) |
| 17.3 notification | [13c-service-notification.md](./13c-service-notification.md) |
| 18. Performance & Capacity Planning | 14-performance-and-capacity.md - Pending |
| 19. Environments | 15-environments.md - Pending |
| 20. Operations Runbook | 16-operations-runbook.md - Pending |
| 21-22. Appendix, Wishlist | 17-appendix-and-wishlist.md - Pending |
| 23. Open Items & Clarifications | 18-open-items-and-clarifications.md - Pending |
| 24. End-to-End System Design | 19-e2e-system-design.md - Locked |

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | §7.2 (03) |
| Figure 2 | System Context Diagram | §8.2 (04) |
| Figure 3 | High-Level Architecture | §8.3 (04) |
| Figure 4 | Workflow - Refund request lifecycle | §8.4.1 (05) |
| Figure 5 | Workflow - Payout retry and escalation | §8.4.2 (05) |
| Figure 6 | Async backbone - outbox, relay, inbox | §14.2.1 (10) |
| Figure 7 | Hub topology - producers, channels, consumers | §14.2.2 (10) |
| Figure 8 | Role taxonomy | §16.9.1 (12) |
| Figure 9 | Per-request authorization | §16.9.3 (12) |
| Figure 10 | refund - refund request state machine | §17.1 Business Logic (13a) |
| Figure 11 | refund - conceptual entity relationship | §17.1 DB Modeling (13a) |
| Figure 12 | refund - submission flow | §17.1 Service-Level Diagrams (13a) |
| Figure 13 | refund - decision sequence | §17.1 Service-Level Diagrams (13a) |
| Figure 14 | payout - payout state machine | §17.2 Business Logic (13b) |
| Figure 15 | payout - conceptual entity relationship | §17.2 DB Modeling (13b) |
| Figure 16 | payout - dispatch flow | §17.2 Service-Level Diagrams (13b) |
| Figure 17 | payout - approval to payout sequence | §17.2 Service-Level Diagrams (13b) |
| Figure 18 | notification - conceptual entity relationship | §17.3 DB Modeling (13c) |
| Figure 19 | notification - message flow | §17.3 Service-Level Diagrams (13c) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Changes Log | Cover (00) |
| Table 2 | Risks | §4 (01) |
| Table 3 | Glossary (technical terms) | §5 (01) |
| Table 4 | Ecosystem Overview | §6 (02) |
| Table 5 | Actors | §7.1 (03) |
| Table 6 | Use Case Traceability | §7.3 (03) |
| Table 7 | Architecture Principles | §9 (06) |
| Table 8 | Architectural Decisions | §10 (06) |
| Table 9 | Integrations | §12 (08) |
| Table 10 | Services Decomposition | §13 (09) |
| Table 11 | Hub topology trade-offs | §14.2 (10) |
| Table 12 | Standard Event Envelope | §14.3 (10) |
| Table 13 | Topic Registry | §14.4 (10) |
| Table 14 | Event catalog - refund | §14.5.1 (10) |
| Table 15 | Event catalog - payout | §14.5.2 (10) |
| Table 16 | Event consistency notes | §14.8 (10) |
| Table 17 | Common value objects | §14.9.0 (10) |
| Table 18 | Payload contracts, one per event | §14.9.1-§14.9.8 (10) |
| Table 19 | Event coverage matrix | §14.9.99 (10) |
| Table 20 | Contract conventions, standard headers, standard error codes | §15.1 (11) |
| Table 21 | Contract index | §15.2 (11) |
| Table 22 | External contract blocks API-01 to API-04 | §15.3 (11) |
| Table 23 | API coverage matrix | §15.4 (11) |
| Table 24 | API drift register | §15.5 (11) |
| Table 25 | External contracts awaiting the user | §15.6 (11) |
| Table 26 | User types | §16.3 (12) |
| Table 27 | Role catalogue | §16.4 (12) |
| Table 28 | Capability matrix | §16.5 (12) |
| Table 29 | Grant authority | §16.6 (12) |
| Table 30 | Role to modules matrix | §16.7 (12) |
| Table 31 | Capability traceability | §16.10 (12) |
| Table 32 | Permission × role matrix | §16.11 (12) |
| Table 33 | Per-role action counts and role drift register | §16.12 (12) |
| Table 34 | refund - Input, Output, Integrations | §17.1 (13a) |
| Table 35 | refund - List of APIs | §17.1 (13a) |
| Table 36 | refund - Event Model (published and consumed) | §17.1 (13a) |
| Table 37 | refund - Metrics | §17.1 (13a) |
| Table 38 | payout - Input, Output, Integrations | §17.2 (13b) |
| Table 39 | payout - List of APIs | §17.2 (13b) |
| Table 40 | payout - Event Model (published and consumed) | §17.2 (13b) |
| Table 41 | payout - Metrics | §17.2 (13b) |
| Table 42 | notification - Input, message mapping, Output, Integrations | §17.3 (13c) |
| Table 43 | notification - Event Model (consumed) | §17.3 (13c) |
| Table 44 | notification - Metrics | §17.3 (13c) |

<!-- MASTER: refunds-portal-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
