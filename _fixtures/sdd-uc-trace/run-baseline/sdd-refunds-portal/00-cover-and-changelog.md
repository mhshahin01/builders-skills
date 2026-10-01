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
**Reviewers:** **[NEEDS CLARIFICATION: reviewers]**
**Approvers:** **[NEEDS CLARIFICATION: approvers]**
**Date:** 2026-09-28
**Related BRD:** [Refunds Portal BRD v1.0](../brd-refunds-portal/refunds-portal-brd-master.md) (chunk folder `../brd-refunds-portal/`)

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | 2026-09-28   | sdd-unifier |             |             | Initial SDD draft, derived from BRD v1.0 via sdd-unifier. |

---

## Table of Contents

| Section | Chunk |
|---------|-------|
| 1. Executive Summary · 2. Scope · 3. Assumptions · 4. Risks · 5. Glossary | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 6. Ecosystem Overview | [02-ecosystem-overview.md](./02-ecosystem-overview.md) |
| 7. System Users & Use Cases | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 8.1-8.3 Architecture Style, Context, High-Level Architecture | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.4-8.5 Workflow and Sequence Diagrams | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| 9. Architecture Principles · 10. Architectural Decisions | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| 11. Cross-Cutting Concerns | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 12. Integrations | [08-integrations.md](./08-integrations.md) |
| 13. Services Decomposition (Summary) | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub | [10-events-hub.md](./10-events-hub.md) |
| 15. Service Integration API Contracts | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 Refund Requests | [13a-service-refund-requests.md](./13a-service-refund-requests.md) |
| 17.2 Payouts | [13b-service-payouts.md](./13b-service-payouts.md) |
| 17.3 Notifications | [13c-service-notifications.md](./13c-service-notifications.md) |
| 18. Performance & Capacity Planning | 14-performance-and-capacity.md - Pending |
| 19. Environments | 15-environments.md - Pending |
| 20. Operations Runbook | 16-operations-runbook.md - Pending |
| 21. Appendix · 22. Wishlist | 17-appendix-and-wishlist.md - Pending |
| 23. Open Items & Clarifications | 18-open-items-and-clarifications.md - Pending |
| 24. End-to-End System Design | 19-e2e-system-design.md - Locked |

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | §7.2 (03) |
| Figure 2 | System Context Diagram | §8.2 (04) |
| Figure 3 | High-Level Architecture | §8.3 (04) |
| Figure 4 | Workflow - Refund Request Lifecycle | §8.4.1 (05) |
| Figure 5 | Workflow - Receipt Check and Submission | §8.4.2 (05) |
| Figure 6 | Workflow - Payout Dispatch, Retry, and Escalation | §8.4.3 (05) |
| Figure 7 | Sequence - Submit a Refund Request | §8.5.1 (05) |
| Figure 8 | Sequence - Approve, Pay Out, and Mark Paid | §8.5.2 (05) |
| Figure 9 | Sequence - Cancellation Racing a Decision | §8.5.3 (05) |
| Figure 10 | Async Backbone (in-process outbox hub) | §14.2.1 (10) |
| Figure 11 | Hub Topology & Fan-Out | §14.2.2 (10) |
| Figure 12 | Role Taxonomy | §16.9.1 (12) |
| Figure 13 | Grant Authority | §16.9.2 (12) |
| Figure 14 | Per-Request Authorization | §16.9.3 (12) |
| Figure 15 | Refund Request State Machine | §17.1 Business Logic (13a) |
| Figure 16 | Refund Requests Conceptual ERD | §17.1 DB Modeling (13a) |
| Figure 17 | Refund Requests - Decision Flow (UC-04) | §17.1 Service-Level Diagrams (13a) |
| Figure 18 | Refund Requests - Handling PAYOUT_SUCCEEDED | §17.1 Service-Level Diagrams (13a) |
| Figure 19 | Payout State Machine | §17.2 Business Logic (13b) |
| Figure 20 | Payouts Conceptual ERD | §17.2 DB Modeling (13b) |
| Figure 21 | Payouts - CardPay Callback Handling (API-04) | §17.2 Service-Level Diagrams (13b) |
| Figure 22 | Payouts - Attempt After a Timeout | §17.2 Service-Level Diagrams (13b) |
| Figure 23 | Message Dispatch State Machine | §17.3 Business Logic (13c) |
| Figure 24 | Notifications Conceptual ERD | §17.3 DB Modeling (13c) |
| Figure 25 | Notifications - Plan and Dispatch | §17.3 Service-Level Diagrams (13c) |
| Figure 26 | Notifications - Paid Message on Two Channels | §17.3 Service-Level Diagrams (13c) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Risks | §4 (01) |
| Table 2 | Glossary (SDD terms) | §5 (01) |
| Table 3 | Ecosystem Overview | §6 (02) |
| Table 4 | Actors | §7.1 (03) |
| Table 5 | Architecture Principles | §9 (06) |
| Table 6 | Architectural Decisions | §10 (06) |
| Table 7 | Integrations | §12 (08) |
| Table 8 | Services Decomposition | §13 (09) |
| Table 9 | Hub Topology Trade-offs | §14.2 (10) |
| Table 10 | Standard Event Envelope | §14.3 (10) |
| Table 11 | Topic Registry | §14.4 (10) |
| Table 12 | Event Catalog - refund-requests | §14.5.1 (10) |
| Table 13 | Event Catalog - payouts | §14.5.2 (10) |
| Table 14 | Event Consistency Notes & Open Flags | §14.8 (10) |
| Table 15 | Common Value Objects | §14.9.0 (10) |
| Table 16 | Payload Contracts (one per event) | §14.9.1-§14.9.7 (10) |
| Table 17 | Event Coverage Matrix | §14.9.99 (10) |
| Table 18 | Contract Conventions | §15.1 (11) |
| Table 19 | Standard Headers | §15.1 (11) |
| Table 20 | Standard Error Codes | §15.1 (11) |
| Table 21 | Contract Index | §15.2 (11) |
| Table 22 | API Coverage Matrix | §15.4 (11) |
| Table 23 | API Consistency Notes & Drift Register | §15.5 (11) |
| Table 24 | External Contracts Awaiting the User | §15.6 (11) |
| Table 25 | Authorization Gates | §16.2 (12) |
| Table 26 | User Types | §16.3 (12) |
| Table 27 | Role Catalogue | §16.4 (12) |
| Table 28 | Capability Matrix | §16.5 (12) |
| Table 29 | Grant Authority | §16.6 (12) |
| Table 30 | Role → Related-Services Matrix | §16.7 (12) |
| Table 31 | Role Traceability | §16.10 (12) |
| Table 32 | Permission × Role Matrix | §16.11 (12) |
| Table 33 | Per-Role Action Counts | §16.12.2 (12) |
| Table 34 | Role Drift & Reconciliation Register | §16.12.3 (12) |
| Table 35 | Refund Requests - List of APIs | §17.1 (13a) |
| Table 36 | Refund Requests - Event Model | §17.1 (13a) |
| Table 37 | Refund Requests - Domain Error Codes | §17.1 (13a) |
| Table 38 | Payouts - Event Model | §17.2 (13b) |
| Table 39 | Notifications - Message Plan | §17.3 (13c) |
| Table 40 | Notifications - Event Model | §17.3 (13c) |

Each §17.X section also carries its Input, Output, Integrations, Tables Design, and Metrics tables.

<!-- MASTER: refunds-portal-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
