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
**Author:** Architecture team (derived with sdd-unifier)
**Reviewers:** Not assigned yet
**Approvers:** Not assigned yet
**Date:** 2026-10-06
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds Portal | 1.7 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Customer sign-up and sign-in, refund requests, branch manager decisions, payouts to the original card, customer and branch manager messages, the branch refund report |
| LOYALTY | Loyalty Points | 1.7 | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points earned on branch purchases, points taken back on paid refunds, opening balances at go-live, corrections by the Loyalty Administrator, the monthly corrections report |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| Refunds Platform | customer-accounts, refund-requests, payouts, notifications, loyalty-points | from-sdd | 1.1 | 1.3 | [refunds-platform-lld-master.md](../lld-refunds-platform/refunds-platform-lld-master.md) |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-10-06 | Architecture team (sdd-unifier) | | | Initial SDD draft, derived from REFUNDS v1.7 and LOYALTY v1.7 via sdd-unifier. Open items OI-01 to OI-21 and OI-23 to OI-26 accepted and applied; OI-22 rejected as out of scope (business behaviour no BRD states). Decision walk: 47 clarification markers in chunks 10 to 13e settled and 3 settled in part; ADR-08 accepted; the lawful basis (13a, 13b, 13e) and the card-paid counting rule (13b) stay marked. |
| 1.1 | 2026-10-06 | Architecture team (sdd-unifier) | | | The four gate-blocking markers settled with the user's answers: the GDPR lawful basis in §17.1, §17.2, and §17.5 Compliance, and the card-paid counting rule in §17.2 Amounts (only Approved and Paid requests count), with the approval-time cap check that rule needs in §17.2 Decision, Tables Design, request fields, Error Handling, and Developer Notes. Delta review of 13a, 13b, and 13e: OI-27 to OI-34. OI-28 to OI-34 accepted and applied: one home for the card-paid amount left, R-15 for the counting rule's BRD follow-up, the most approvable amount on the branch read and in Figure 8, staff personal data in §11.6, the 7-year unlinking as anonymisation, the lawful-basis question for former-member history and waiting refunds in §17.5, and the §20.1.15 data subject request procedure, with its §5 Glossary row. OI-27 rejected (adds business behaviour no BRD states). Chunks: 01, 05, 07, 13a, 13b, 13d, 13e, 16, 18. |
| 1.2 | 2026-10-06 | Architecture team (sdd-unifier) | | | The last gate-blocking marker settled with the user's answer: in §17.5 Compliance, the lawful basis for former-member history and for paid refunds waiting for their purchase is legitimate interests (GDPR Art. 6(1)(f)), to settle refunds and complaints within the retention period, and an earlier erasure of former-member history is refused under GDPR Art. 17(3)(e) (legal claims). Delta review of 13e: OI-35 to OI-41. OI-37, OI-38, OI-40, and OI-41 accepted and applied: refunds still waiting at the end of their retention period deleted by `waiting-refund-check`, with the `retention_overdue_rows` alert and the §20.1.16 procedure; access requests in §20.1.15 that reach former-member history and waiting refunds; waiting refunds named as personal data, with the §17.5 PII columns; one home for the former-member retention rule in the §17.5 Retention Policy, referenced from §16.8. OI-36 adjusted and applied: held purchases named in §17.5 Compliance with the user's lawful basis, legitimate interests, and deleted with the former-member history. OI-35 and OI-39 rejected (add business behaviour no BRD states). E2E gate open: chunk 19 written. Its faithfulness check found two mismatches, fixed in chunk 19, and four source problems, fixed in their chunks: the E2 answer of §8.5.5 Figure 11 (400, not 422); the idempotency keys of §12 INT-03 and INT-04 and API-08, with the same purchase key in §4 R-02; and the timeout claim of §8.1.1, with the unset Keycloak timeouts of the confirmation and password reset marked. Chunks: 01, 04, 05, 08, 11, 12, 13e, 16, 18, 19. |
| 1.3 | 2026-10-06 | Architecture team (sdd-unifier) | | | The e2e design requested again: chunk 19 written again through step 8b from unchanged sources. Its faithfulness check found two mismatches, fixed in chunk 19: ADR-06 added to §24.6, with the scope of the doctrine list stated, and the §24.3 simplification bullet completed; and three source problems, fixed in their chunks: the CUSTOMER access to customer-accounts in §16.7 (read), the keys of the work records in §11.1, and the role catalogue pointer of ADR-07 (§16.4). CHK 2026-10-06: step 6a rerun after the approved keyed-link corrections; event/DTO symmetry, permissions, API coverage and use-case trace rechecked from disk in Codex. No contract or business behavior changed. Chunks: 06, 07, 12, 19. |

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
- [13a customer-accounts](./13a-service-customer-accounts.md)
- [13b refund-requests](./13b-service-refund-requests.md)
- [13c payouts](./13c-service-payouts.md)
- [13d notifications](./13d-service-notifications.md)
- [13e loyalty-points](./13e-service-loyalty-points.md)
- [14 Performance & Capacity Planning](./14-performance-and-capacity.md)
- [15 Environments](./15-environments.md)
- [16 Operations Runbook](./16-operations-runbook.md)
- [17 Appendix & Wishlist](./17-appendix-and-wishlist.md)
- [18 Open Items & Clarifications](./18-open-items-and-clarifications.md)
- [19 End-to-End System Design](./19-e2e-system-design.md)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | [03 §7.2](./03-users-and-use-cases.md#72-use-case-diagram) |
| Figure 2 | System Context Diagram | [04 §8.2](./04-architecture-style-and-diagrams.md#82-context-diagram) |
| Figure 3 | High-Level Architecture | [04 §8.3](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram) |
| Figure 4 | Workflow: Refund request to payout | [05 §8.4.1](./05-workflows-and-sequences.md#841-workflow-refund-request-to-payout) |
| Figure 5 | Workflow: Points from purchases and paid refunds | [05 §8.4.2](./05-workflows-and-sequences.md#842-workflow-points-from-purchases-and-paid-refunds) |
| Figure 6 | Workflow: Customer sign-up and sign-in | [05 §8.4.3](./05-workflows-and-sequences.md#843-workflow-customer-sign-up-and-sign-in) |
| Figure 7 | Sequence: Submit a refund request | [05 §8.5.1](./05-workflows-and-sequences.md#851-sequence-submit-a-refund-request) |
| Figure 8 | Sequence: Refund decision, payout, and points take-back | [05 §8.5.2](./05-workflows-and-sequences.md#852-sequence-refund-decision-payout-and-points-take-back) |
| Figure 9 | Sequence: Sign-up with confirmation codes | [05 §8.5.3](./05-workflows-and-sequences.md#853-sequence-sign-up-with-confirmation-codes) |
| Figure 10 | Sequence: Member views points | [05 §8.5.4](./05-workflows-and-sequences.md#854-sequence-member-views-points) |
| Figure 11 | Sequence: Correct a member's points | [05 §8.5.5](./05-workflows-and-sequences.md#855-sequence-correct-a-members-points) |
| Figure 12 | Role Taxonomy | [12 §16.9.1](./12-centralized-user-roles.md#1691-role-taxonomy-user-types--roles--sub-roles) |
| Figure 13 | Grant / Invitation Authority | [12 §16.9.2](./12-centralized-user-roles.md#1692-grant--invitation-authority-who-may-create-whom) |
| Figure 14 | Per-Request Authorization | [12 §16.9.3](./12-centralized-user-roles.md#1693-per-request-authorization-how-a-role-yields-a-decision) |
| Figure 15 | Entity Relationship - customer-accounts | [13a §17.1 DB Modeling](./13a-service-customer-accounts.md#entity-relationship) |
| Figure 16 | Implementation Flow - customer-accounts | [13a §17.1 Service-Level Diagrams](./13a-service-customer-accounts.md#implementation-flow-chart) |
| Figure 17 | State Machine - refund request | [13b §17.2 Business Logic](./13b-service-refund-requests.md#business-logic) |
| Figure 18 | Entity Relationship - refund-requests | [13b §17.2 DB Modeling](./13b-service-refund-requests.md#entity-relationship) |
| Figure 19 | Implementation Flow - refund-requests | [13b §17.2 Service-Level Diagrams](./13b-service-refund-requests.md#implementation-flow-chart) |
| Figure 20 | Sequence - decision and cancellation race | [13b §17.2 Service-Level Diagrams](./13b-service-refund-requests.md#sequence-diagram-service-internal) |
| Figure 21 | State Machine - payout | [13c §17.3 Business Logic](./13c-service-payouts.md#business-logic) |
| Figure 22 | Entity Relationship - payouts | [13c §17.3 DB Modeling](./13c-service-payouts.md#entity-relationship) |
| Figure 23 | Implementation Flow - payouts | [13c §17.3 Service-Level Diagrams](./13c-service-payouts.md#implementation-flow-chart) |
| Figure 24 | Entity Relationship - notifications | [13d §17.4 DB Modeling](./13d-service-notifications.md#entity-relationship) |
| Figure 25 | Implementation Flow - notifications | [13d §17.4 Service-Level Diagrams](./13d-service-notifications.md#implementation-flow-chart) |
| Figure 26 | State Machine - membership | [13e §17.5 Business Logic](./13e-service-loyalty-points.md#business-logic) |
| Figure 27 | Entity Relationship - loyalty-points | [13e §17.5 DB Modeling](./13e-service-loyalty-points.md#entity-relationship) |
| Figure 28 | Implementation Flow - loyalty-points | [13e §17.5 Service-Level Diagrams](./13e-service-loyalty-points.md#implementation-flow-chart) |
| Figure 29 | System Context - modules behind the actors and outside systems | [19 §24.2](./19-e2e-system-design.md#242-system-context) |
| Figure 30 | Layered Architecture - the publication log backbone and the module schemas | [19 §24.3](./19-e2e-system-design.md#243-layered-high-level-architecture) |
| Figure 31 | Event Map - in-process domain events between modules | [19 §24.5.1](./19-e2e-system-design.md#2451-phase-1-domains) |
| Figure 32 | Saga - refund payout and points take-back | [19 §24.8.1](./19-e2e-system-design.md#2481-refund-payout-and-points-take-back-choreographed) |
| Figure 33 | Saga - linked requests and account closure | [19 §24.8.2](./19-e2e-system-design.md#2482-linked-requests-and-account-closure-choreographed) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Source BRDs | [00 § Document Lineage](#source-brds-parents) |
| Table 2 | Child LLDs | [00 § Document Lineage](#child-llds-children) |
| Table 3 | Risks | [01 §4](./01-executive-summary-scope-risks.md#4-risks) |
| Table 4 | Glossary (SDD delta) | [01 §5](./01-executive-summary-scope-risks.md#5-glossary) |
| Table 5 | Ecosystem Overview | [02 §6](./02-ecosystem-overview.md#6-ecosystem-overview) |
| Table 6 | Actors | [03 §7.1](./03-users-and-use-cases.md#71-actors) |
| Table 7 | Use Case Traceability | [03 §7.3](./03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) |
| Table 8 | Architecture Principles | [06 §9](./06-principles-and-decisions.md#9-architecture-principles) |
| Table 9 | Architectural Decisions | [06 §10](./06-principles-and-decisions.md#10-architectural-decisions) |
| Table 10 | Integrations | [08 §12](./08-integrations.md#12-integrations) |
| Table 11 | Services Decomposition | [09 §13](./09-services-summary.md#13-services-decomposition-summary) |
| Table 12 | In-Process Domain Events | [10 §14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) |
| Table 13 | Contract Index | [11 §15.2](./11-api-contracts.md#152-contract-index) |
| Table 14 | Permission × Role Matrix | [12 §16.11](./12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide) |
| Table 15 | NFR Targets | [14 §18.5](./14-performance-and-capacity.md#185-nfr-targets) |
| Table 16 | Environments | [15 §19](./15-environments.md#19-environments) |
| Table 17 | Counts at a Glance | [19](./19-e2e-system-design.md#counts-at-a-glance) |
| Table 18 | Service Landscape | [19 §24.1](./19-e2e-system-design.md#241-service-landscape-archetype--phase) |
| Table 19 | Synchronous Edges | [19 §24.7](./19-e2e-system-design.md#247-synchronous-edges-one-hop-rule) |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
