<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: SDD - Refunds Platform
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: All chunks share the SDD version number. When any chunk is updated, bump the SDD version in this master and in the updated chunk(s).
MAINTENANCE: When adding or removing chunks (especially 13x service chunks), update the tables below, the dependency graph, and the reading-order table.
-->

# SDD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Solution Design Document. Each section below maps to a chunk file. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Lineage:** this SDD's source BRDs (parents, each with its key: REFUNDS, LOYALTY) and child LLDs are listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference in the chunks carries its BRD key (`REFUNDS/UC-04`).

> **Specs note:** The constitution-grade `Specs` chunk (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with each child LLD (`../lld-[lld-slug]/17-specs.md`), synthesised from this SDD's body. The SDD carries no Specs chunk.

> **Decision history:** [decision-log.md](./decision-log.md) holds the architecture questionnaire record, the intake and delegation record, and the clarification Q&A. The chunks below state only the settled design. It is never merged.

---

## Generation Progress

**Generation:** whole
**Intent:** derive-from-BRD
**Source:** ../brd-refunds-portal/refunds-portal-brd-master.md (REFUNDS v1.0); ../brd-loyalty-points/loyalty-points-brd-master.md (LOYALTY v1.0)

**Status:** Complete (2026-09-28): chunks 00-18 written, reviewer pass and acceptance loop done, e2e gate checked; chunk 19 Locked
**Reconciled:** 2026-09-28
**E2E gate (chunk 19):** Locked - E3 (clarification markers remain in chunks 10, 13a, 13b, 13c, and 13d); E1, E2, and E4 met

---

## Document Metadata & History

| Section | Chunk |
|---------|-------|
| Title block, Version, Author, Reviewers, Approvers, Status | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Document Lineage (source BRDs with keys, child LLDs) | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Changes Log | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Table of Contents, Figures & Tables indices | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |

## Strategic Context & Risk

| Section | Chunk |
|---------|-------|
| 1. Executive Summary (technical) | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 2. Scope (In / Out) | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 3. Assumptions | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 4. Risks (likelihood, impact, mitigation) | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 5. Glossary | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |

## Technology Foundation

| Section | Chunk | Beneficial/ used for |
|---------|-------|-------|
| 6. Ecosystem Overview (full tech stack table, incl. Architecture Doctrine: hybrid + EDA + DDD + Hexagonal) | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |
| Ecosystem-level rules | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |

## Actors & Use Cases

| Section | Chunk |
|---------|-------|
| 7.1 Actors | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 7.2 Use Case Diagram | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 7.3 Use Case Traceability (each BRD use case: owner service, entry points, flows, API contracts, events) | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |

## System Architecture

| Section | Chunk |
|---------|-------|
| 8.1 Architecture Style (What / Why / How) | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.2 Context Diagram | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.3 High-Level Architecture Diagram | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.4 Workflow Diagrams | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| 8.5 Sequence Diagrams | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |

## Governance & Decisions

| Section | Chunk |
|---------|-------|
| 9. Architecture Principles (AP-01 to AP-12) | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| 10. Architectural Decisions (ADRs) | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |

## Cross-Cutting Concerns

| Section | Chunk |
|---------|-------|
| 11.1 DB Modeling defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.2 Multi-Tenancy defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.3 Deployment defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.4 Observability defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.5 Configuration Management defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.6 Security defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |

## Integrations

| Section | Chunk |
|---------|-------|
| 12. Integrations (protocol, auth, retries, rate limits) | [08-integrations.md](./08-integrations.md) |

## Services & Platform Contracts

| Section | Chunk |
|---------|-------|
| 13. Services Decomposition (summary table) | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts) | [10-events-hub.md](./10-events-hub.md) |
| 15. Service Integration API Contracts (URI, headers, body, error codes, security, auth) | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities (platform-wide) | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 refund-service - Detailed Spec | [13a-service-refund.md](./13a-service-refund.md) |
| 17.2 payout-service - Detailed Spec | [13b-service-payout.md](./13b-service-payout.md) |
| 17.3 notification-service - Detailed Spec | [13c-service-notification.md](./13c-service-notification.md) |
| 17.4 loyalty-service - Detailed Spec | [13d-service-loyalty.md](./13d-service-loyalty.md) |

> **Contract consistency:** chunk 10 (event hub) is the platform event contract registry - topic names, event names, and payload contracts in every `13x` chunk must match it verbatim; chunk 11 is the same for synchronous API contracts (method and URI match each `13x` List of APIs; external contracts stay `TBD - external` until the user supplies them); chunk 12 is the same for roles and permission tokens. Divergences are flagged in the registries' consistency/drift sections, never silently reconciled.

### Service Spec Sub-Sections (within each 13x chunk)

| Sub-Section | Description |
|-------------|-------------|
| What | Service definition & bounded context |
| Boundaries | Owns / does not own / upstream / downstream |
| Input | Inbound triggers (REST, events, schedules) |
| Business Logic | Core logic + state machines, citing the owned BRD use cases |
| Output | Outbound responses and events |
| Integrations | Per-service integration details, each with its API ID (chunk 11) or event (chunk 10) |
| DB Modeling | ERD, tables, retention, archival, encryption |
| Multi-Tenancy Specifications | Overrides to platform defaults |
| API Standards | Style, versioning, auth, idempotency, List of APIs (the entry points §7.3 cites) |
| Event-Driven Architecture | Published + consumed events (must match chunk 10), messaging infra, DLQ |
| Constraints | Service-specific constraints |
| Error Handling | Sync + async error strategies, tied to BRD exception flows |
| Observability & Monitoring | Logging, metrics, tracing |
| Developer Notes | Patterns, anti-patterns, test strategy |
| Service-Level Diagrams | Flow charts, sequence diagrams (inline Mermaid) |
| Compliance | GDPR, PCI-DSS, ISO, local regs |
| Deployment Strategy | Replicas, strategy, health, rollback |
| Future Enhancements | Known gaps and planned improvements |

## Performance & Operations

| Section | Chunk |
|---------|-------|
| 18.1 Load Estimates | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 18.2 Throughput Targets | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 18.3 Peak Scenarios | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 18.4 Stress Testing Strategy | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 19. Environments (Dev/SIT/UAT/Prod) | [15-environments.md](./15-environments.md) |
| 20.1 Common Operations (runbook procedures) | [16-operations-runbook.md](./16-operations-runbook.md) |
| 20.2 Diagnostics Cheatsheet | [16-operations-runbook.md](./16-operations-runbook.md) |
| 20.3 On-Call | [16-operations-runbook.md](./16-operations-runbook.md) |

## Appendices

| Section | Chunk |
|---------|-------|
| 21. Appendix (references, specs, schemas) | [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md) |
| 22. Wishlist (platform-level future enhancements) | [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md) |

## Review Output

| Section | Chunk |
|---------|-------|
| 23. Open Items & Clarifications | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |

> Generated *after* the main SDD body by a cleared-context reviewer. Every item carries a **Recommended Answer** with the **Why** behind it; the acceptance loop applies the decided answers to the body and logs them in the Resolution Log.

## End-to-End View (gated)

| Section | Chunk |
|---------|-------|
| 24. End-to-End System Design (services · topics · producers · consumers) | 19-e2e-system-design.md - Locked until chunk 18 is cleared |

> Chunk 19 is written LAST and only when the e2e gate is open (SKILL.md step 8b): every open item in chunk 18 resolved (`Deferred` counts as open), no open contract divergence, no clarification marker in chunks 09-13x or in 03 §7.3, and the reconciliation rerun after the last change.

---

## Chunk Dependency Graph

```
refunds-platform-sdd-master.md (you are here)
|
+-- 00-cover-and-changelog.md ........... metadata, lineage (REFUNDS, LOYALTY; child LLDs), version history
+-- 01-executive-summary-scope-risks.md . why + what + boundaries + risks + glossary
+-- 02-ecosystem-overview.md ............ tech stack + architecture doctrine (single source of truth)
+-- 03-users-and-use-cases.md ........... actors + use case diagram + use-case traceability (BRD -> SDD)
+-- 04-architecture-style-and-diagrams.md architecture style + context + HLA
+-- 05-workflows-and-sequences.md ....... end-to-end flows + sequence diagrams
+-- 06-principles-and-decisions.md ...... governance: principles + ADRs
+-- 07-cross-cutting-concerns.md ........ platform defaults (DB, tenancy, deploy, observability, config, security)
+-- 08-integrations.md .................. external system connections
+-- 09-services-summary.md .............. decomposition overview table (use-case ownership)
|   +-- 10-events-hub.md ................ platform event catalog + payload contracts (event contract registry)
|   +-- 11-api-contracts.md ............. service integration API contracts (API contract registry)
|   +-- 12-centralized-user-roles.md .... platform-wide roles & authorities catalogue
|   +-- 13a-service-refund.md ........... refund-service (module of refunds-platform-core)
|   +-- 13b-service-payout.md ........... payout-service (own deployable)
|   +-- 13c-service-notification.md ..... notification-service (own deployable)
|   +-- 13d-service-loyalty.md .......... loyalty-service (module of refunds-platform-core)
+-- 14-performance-and-capacity.md ...... load, throughput, peaks, stress testing
+-- 15-environments.md .................. Dev / SIT / UAT / Prod
+-- 16-operations-runbook.md ............ procedures, diagnostics, on-call
+-- 17-appendix-and-wishlist.md ......... references + future platform enhancements
+-- 18-open-items-and-clarifications.md . reviewer findings with recommended answers (post-generation)
+-- 19-e2e-system-design.md ............. end-to-end system map (gated: only after 18 is cleared)
+-- decision-log.md ..................... decision register (companion; never merged)
```

### Reading Order by Task

| Agent Task | Start With | Then |
|------------|-----------|------|
| Understand the system | 01, 04 | 02, 09, 10 |
| Design a new service | 07, 02 | 10 (event contracts), 11 (API contracts), 13a (copy as template), 09 |
| Review architecture | 04, 06 | 05, 07 |
| Add an integration | 08 | 11 (API contract), the owning 13x chunk |
| Define DB schema | 07 (defaults) | the owning 13x chunk (DB Modeling) |
| Add / change an event | 10 (registry first) | the producing + consuming 13x chunks, then 18 |
| Define roles / permissions | 12 | 03, 11, the affected 13x chunks |
| Plan capacity / NFRs | 14 | 15, 01 (risks) |
| Write runbook procedures | 16 | 02 (ecosystem), 07 (observability) |
| Audit completeness | 00 (ToC) | all chunks sequentially |
| Check cross-cutting standards | 07 | 06 (principles), 02 (ecosystem) |
| Check contract consistency | 10 §14.8, 11 §15.5, 12 §16.12 | every 13x Event Model and List of APIs |
| Complete an external API contract | 11 §15.6 | the provider documentation, then 11 §15.3 |
| Map BRD use cases to services | 03 §7.3 (use-case traceability) | 09, then the owner's 13x chunk; each UC ID links to the use case in its BRD |
| Feed speckit `/constitution` | ../lld-[lld-slug]/17-specs.md (LLD-owned, one per child LLD) | 02, 09 |
| Steer `lld-unifier` (tech choices, contracts) | 02, 10, 11 | 09, 12; 00 § Document Lineage (Child LLDs) |
| Find the LLD for a use case | 03 §7.3 (owner service) | 00 § Document Lineage, the Child LLDs row whose scope names that service |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD <-> SDD)

| BRD Chunk | Related SDD Chunk(s) | Relationship |
|-----------|---------------------|--------------|
| [REFUNDS 01 - Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states the business problem; SDD states the technical solution |
| [REFUNDS 04 - Scope & Personas](../brd-refunds-portal/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | BRD personas become SDD actors |
| [REFUNDS 05 - User Journeys Overview](../brd-refunds-portal/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every REFUNDS use case gets one §7.3 row and one owner service in 09 |
| [REFUNDS 06a - Use Cases: Customer](../brd-refunds-portal/06a-use-cases-customer.md) | [sdd/03 §7.3](./03-users-and-use-cases.md), [13a refund-service](./13a-service-refund.md) | UC main and exception flows become business logic and error handling |
| [REFUNDS 06b - Use Cases: Branch Manager](../brd-refunds-portal/06b-use-cases-branch-manager.md) | [sdd/03 §7.3](./03-users-and-use-cases.md), [13a refund-service](./13a-service-refund.md), [13b payout-service](./13b-service-payout.md) | The decision, payout, and failure flows |
| [REFUNDS 07 - Users & Use Cases Matrix](../brd-refunds-portal/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md) | Matrix drives the role catalogue and the own-branch rule |
| [REFUNDS 08 - Integrations](../brd-refunds-portal/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md) | Partners get protocol, resilience, and TBD - external contracts |
| [REFUNDS 10 - NFRs](../brd-refunds-portal/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations become technical targets and architecture drivers |
| [REFUNDS 12 - Appendix (Technical Inputs for the SDD)](../brd-refunds-portal/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | REFUNDS/TI-01 and REFUNDS/TI-02 are BRD-mandated rows |
| [LOYALTY 01 - Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states the business problem; SDD states the technical solution |
| [LOYALTY 04 - Scope & Personas](../brd-loyalty-points/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | The Member persona becomes an actor sharing the customer identity |
| [LOYALTY 05 - User Journeys Overview](../brd-loyalty-points/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every LOYALTY use case gets one §7.3 row and one owner service in 09 |
| [LOYALTY 06a - Use Cases: Member](../brd-loyalty-points/06a-use-cases-member.md) | [sdd/03 §7.3](./03-users-and-use-cases.md), [13d loyalty-service](./13d-service-loyalty.md) | Balance, history, and the take-back rule (BR-1) |
| [LOYALTY 07 - Users & Use Cases Matrix](../brd-loyalty-points/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md) | Matrix drives the MEMBER role and the own-points rule |
| [LOYALTY 08 - Integrations](../brd-loyalty-points/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md) | POS Records shares INT-03 with REFUNDS; API-06 |
| [LOYALTY 10 - NFRs](../brd-loyalty-points/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md) | Balance integrity and the one-hour take-back target |
| [LOYALTY 12 - Appendix (Technical Inputs for the SDD)](../brd-loyalty-points/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | No technical input stated; defaults apply |
