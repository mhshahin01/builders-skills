<!--
TYPE: Master Index
PROJECT: Retail Customer Platform
VERSION: 1.0
PART OF: SDD - Retail Customer Platform
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: All chunks share the SDD version number. When any chunk is updated, bump the SDD version in this master and in the updated chunk(s).
MAINTENANCE: When adding or removing chunks (especially 13x service chunks), update the tables below, the dependency graph, and the reading-order table.
-->

# SDD Master Index - Retail Customer Platform

> **How to use:** This file is the entry point for the Solution Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks. A chunk not written yet is plain text followed by its pending part.

> **Lineage:** this SDD's source BRDs (parents, each with its key: REFUNDS, LOYALTY) and child LLDs are listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference in the chunks carries its BRD key, for example [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) or [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-customer.md#uc-02-redeem-points-for-a-voucher).

> **Specs note:** The constitution-grade `Specs` chunk (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with the LLD (`../lld-retail-customer-platform/17-specs.md`), synthesised from this SDD's body. The SDD carries no Specs chunk.

> **Decision history:** [decision-log.md](./decision-log.md) holds the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, and how each decision was reached. The chunks below state only the settled design. It is never merged into a combined SDD.

---

## Generation Progress

**Generation:** parts
**Intent:** derive-from-BRD
**Source:** [../brd-refunds-portal/refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS v1.0); [../brd-loyalty-points/loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) (LOYALTY v1.2)

| Part | Chunks | Status | Completed |
|------|--------|--------|-----------|
| 1 | 00-09 | Complete | 2026-09-28 |
| 2 | 13x, 10, 12, 11 | Pending (part 2) | - |
| 3 | 14-18, 19 (gated) | Pending (part 3) | - |

**Reconciled:** Not run yet (step 6a runs in part 2)
**E2E gate (chunk 19):** Locked - E1 (chunk 18 not written) and E4 (no reconciliation run yet) are not met

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
| 6. Ecosystem Overview (full tech stack table, incl. Architecture Doctrine: modular monolith, DDD, hexagonal, outbox) | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |
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
| 10. Architectural Decisions (ADR-01 to ADR-08) | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |

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
| 13. Services Decomposition (summary table; modules of one deployable) | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts) | 10-events-hub.md - Pending (part 2) |
| 15. Service Integration API Contracts (URI, headers, body, error codes, security, auth) | 11-api-contracts.md - Pending (part 2) |
| 16. Centralized User Roles & Authorities (platform-wide) | 12-centralized-user-roles.md - Pending (part 2) |
| 17.1 refunds - Detailed Module Spec | 13a-service-refunds.md - Pending (part 2) |
| 17.2 card-payouts - Detailed Module Spec | 13b-service-card-payouts.md - Pending (part 2) |
| 17.3 loyalty - Detailed Module Spec | 13c-service-loyalty.md - Pending (part 2) |
| 17.4 notifications - Detailed Module Spec | 13d-service-notifications.md - Pending (part 2) |

> **Contract consistency:** chunk 10 (event hub) is the platform event contract registry - topic names, event names, and payload contracts in every `13x` chunk must match it verbatim; chunk 11 is the same for synchronous API contracts (method and URI match each `13x` List of APIs; external contracts stay `TBD - external` until the user supplies them); chunk 12 is the same for roles and permission tokens. Divergences are flagged in the registries' consistency/drift sections, never silently reconciled.

### Service Spec Sub-Sections (within each 13x chunk)

Each `13x` module chunk contains these sub-sections in order:

| Sub-Section | Description |
|-------------|-------------|
| What | Module definition & bounded context |
| Boundaries | Owns / does not own / upstream / downstream |
| Input | Inbound triggers (REST, events, schedules) |
| Business Logic | Core logic + state machines |
| Output | Outbound responses and events |
| Integrations | Per-module integration details, each with its API ID (chunk 11) or event (chunk 10) |
| DB Modeling | ERD, tables, retention, archival, encryption |
| Multi-Tenancy Specifications | Overrides to platform defaults |
| API Standards | Style, versioning, auth, idempotency, API list (integration endpoints carry their API ID and link to chunk 11) |
| Event-Driven Architecture | Published + consumed events (must match chunk 10), messaging infra, DLQ |
| Constraints | Module-specific constraints |
| Error Handling | Sync + async error strategies |
| Observability & Monitoring | Logging, metrics, tracing |
| Developer Notes | Patterns, anti-patterns, test strategy |
| Service-Level Diagrams | Flow charts, sequence diagrams (inline Mermaid) |
| Compliance | GDPR, PCI-DSS, ISO, local regs |
| Deployment Strategy | Replicas, strategy, health, rollback |
| Future Enhancements | Known gaps and planned improvements |

## Performance & Operations

| Section | Chunk |
|---------|-------|
| 18.1 Load Estimates | 14-performance-and-capacity.md - Pending (part 3) |
| 18.2 Throughput Targets | 14-performance-and-capacity.md - Pending (part 3) |
| 18.3 Peak Scenarios | 14-performance-and-capacity.md - Pending (part 3) |
| 18.4 Stress Testing Strategy | 14-performance-and-capacity.md - Pending (part 3) |
| 19. Environments (Dev/SIT/UAT/Prod) | 15-environments.md - Pending (part 3) |
| 20.1 Common Operations (runbook procedures) | 16-operations-runbook.md - Pending (part 3) |
| 20.2 Diagnostics Cheatsheet | 16-operations-runbook.md - Pending (part 3) |
| 20.3 On-Call | 16-operations-runbook.md - Pending (part 3) |

## Appendices

| Section | Chunk |
|---------|-------|
| 21. Appendix (references, specs, schemas) | 17-appendix-and-wishlist.md - Pending (part 3) |
| 22. Wishlist (platform-level future enhancements) | 17-appendix-and-wishlist.md - Pending (part 3) |

## Review Output

| Section | Chunk |
|---------|-------|
| 23. Open Items & Clarifications | 18-open-items-and-clarifications.md - Pending (part 3) |

> Generated *after* the main SDD body by a cleared-context reviewer. Captures architecture-level gaps, missing scenarios, ADR ambiguities, and cross-chunk contract mismatches. Every item carries a **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply; the skill walks the user through each item for acceptance, then reflects accepted answers into the body and logs them in the Resolution Log.

## End-to-End View (gated)

| Section | Chunk |
|---------|-------|
| 24. End-to-End System Design (services · topics · producers · consumers) | 19-e2e-system-design.md - Locked until chunk 18 is cleared |

> Chunk 19 is written LAST and only when the e2e gate is open (SKILL.md step 8b): every open item in chunk 18 resolved (`Deferred` counts as open), no open contract divergence, no clarification marker in chunks 09-13x or in 03 §7.3, and the reconciliation rerun after the last change. It consolidates chunks 09, 10, 11, 12, and 13x into one self-contained system map. Link it here once written.

---

## Chunk Dependency Graph

```
retail-customer-platform-sdd-master.md (you are here)
|
+-- 00-cover-and-changelog.md ........... metadata, lineage (source BRDs, child LLDs), version history
+-- 01-executive-summary-scope-risks.md . why + what + boundaries + risks + glossary
+-- 02-ecosystem-overview.md ............ tech stack + architecture doctrine (single source of truth)
+-- 03-users-and-use-cases.md ........... actors + use case diagram + use-case traceability (BRD -> SDD)
+-- 04-architecture-style-and-diagrams.md architecture style + context + HLA
+-- 05-workflows-and-sequences.md ....... end-to-end flows + sequence diagrams
+-- 06-principles-and-decisions.md ...... governance: principles + ADRs
+-- 07-cross-cutting-concerns.md ........ platform defaults (DB, tenancy, deploy, observability, config)
+-- 08-integrations.md .................. external system connections
+-- 09-services-summary.md .............. decomposition overview table (modules)
|   +-- 10-events-hub.md ................ domain event catalog + payload contracts (event contract registry) [part 2]
|   +-- 11-api-contracts.md ............. integration API and port contracts (API contract registry) [part 2]
|   +-- 12-centralized-user-roles.md .... platform-wide roles & authorities catalogue [part 2]
|   +-- 13a-service-refunds.md .......... module spec: refunds (§17.1) [part 2]
|   +-- 13b-service-card-payouts.md ..... module spec: card-payouts (§17.2) [part 2]
|   +-- 13c-service-loyalty.md .......... module spec: loyalty (§17.3) [part 2]
|   +-- 13d-service-notifications.md .... module spec: notifications (§17.4) [part 2]
+-- 14-performance-and-capacity.md ...... load, throughput, peaks, stress testing [part 3]
+-- 15-environments.md .................. Dev / SIT / UAT / Prod [part 3]
+-- 16-operations-runbook.md ............ procedures, diagnostics, on-call [part 3]
+-- 17-appendix-and-wishlist.md ......... references + future platform enhancements [part 3]
+-- 18-open-items-and-clarifications.md . reviewer findings with recommended answers [part 3]
+-- 19-e2e-system-design.md ............. end-to-end system map (gated: only after 18 is cleared; consolidates 09-13x)
+-- decision-log.md ..................... decision register (companion file; never merged)
```

### Reading Order by Task

| Agent Task | Start With | Then |
|------------|-----------|------|
| Understand the system | 19 (e2e, once written) | 01, 04, 02 |
| Design a new module | 07, 02 | 10 (event contracts), 11 (API contracts), a 13x chunk as the pattern, 09 |
| Review architecture | 04, 06 | 05, 07, 19 |
| Add an integration | 08 | 11 (API contract), the owning 13x chunk (Integrations sub-section) |
| Define DB schema | 07 (defaults) | the owning 13x chunk (DB Modeling sub-section) |
| Add / change an event | 10 (registry first) | the producing + consuming 13x chunks, then 18 |
| Define roles / permissions | 12 | 03, 11, the affected 13x chunks |
| Plan capacity / NFRs | 14 | 15, 01 (risks) |
| Write runbook procedures | 16 | 02 (ecosystem), 07 (observability) |
| Audit completeness | 00 (ToC) | all chunks sequentially |
| Check cross-cutting standards | 07 | 06 (principles), 02 (ecosystem) |
| Check contract consistency | 10 §14.8, 11 §15.5, 12 §16.12 | every 13x Event Model and List of APIs |
| Complete an external API contract | 11 §15.6 | the provider documentation, then 11 §15.3 |
| Map BRD use cases to services | 03 §7.3 (use-case traceability) | 09, then the owner's 13x chunk; each UC ID links to the use case in its BRD |
| Feed speckit `/constitution` | ../lld-retail-customer-platform/17-specs.md (LLD-owned) | 02, 09 |
| Steer `lld-unifier` (tech choices, contracts) | 02, 10, 11 | 09, 12; 00 § Document Lineage (Child LLDs) |
| Find the LLD for a use case | 03 §7.3 (owner service) | 00 § Document Lineage, the Child LLDs row whose scope names that service |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD <-> SDD)

| BRD Chunk | Related SDD Chunk(s) | Relationship |
|-----------|---------------------|--------------|
| [REFUNDS 01 - Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [REFUNDS 04 - Scope & Personas](../brd-refunds-portal/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md), [sdd/01 - Scope](./01-executive-summary-scope-risks.md) | BRD personas become SDD actors; BRD scope is referenced, SDD adds its delta |
| [REFUNDS 05 - User Journeys Overview](../brd-refunds-portal/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner module in 09 |
| [REFUNDS 06a - Use Cases: Customer](../brd-refunds-portal/06a-use-cases-customer.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), 13a-service-refunds.md - Pending (part 2) | UC main/exception flows become module business logic and error handling; each UC ID in the SDD links to its heading here |
| [REFUNDS 06b - Use Cases: Branch Manager](../brd-refunds-portal/06b-use-cases-branch-manager.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), 13a-service-refunds.md and 13b-service-card-payouts.md - Pending (part 2) | UC main/exception flows become module business logic and error handling; each UC ID in the SDD links to its heading here |
| [REFUNDS 07 - Users & Use Cases Matrix](../brd-refunds-portal/07-users-use-cases-matrix.md) | 12-centralized-user-roles.md - Pending (part 2), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-module authorization rules |
| [REFUNDS 08 - Integrations](../brd-refunds-portal/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), 11-api-contracts.md - Pending (part 2) | BRD names partners and purpose; SDD details protocol/auth/retries and the API contract (external ones `TBD - external` until the provider documentation is supplied) |
| [REFUNDS 10 - NFRs](../brd-refunds-portal/10-nfrs.md) | 14-performance-and-capacity.md - Pending (part 3), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [REFUNDS 12 - Appendix (Technical Inputs for the SDD)](../brd-refunds-portal/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md), [sdd/06 - Decisions](./06-principles-and-decisions.md) | Source technical mandates seed the ecosystem; REFUNDS/TI-01 and REFUNDS/TI-02 are applied |
| [LOYALTY 01 - Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [LOYALTY 04 - Scope & Personas](../brd-loyalty-points/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md), [sdd/01 - Scope](./01-executive-summary-scope-risks.md) | BRD personas become SDD actors (the Customer persona is unified with REFUNDS Customer) |
| [LOYALTY 05 - User Journeys Overview](../brd-loyalty-points/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner module in 09 |
| [LOYALTY 06a - Use Cases: Customer](../brd-loyalty-points/06a-use-cases-customer.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), 13c-service-loyalty.md - Pending (part 2) | UC main/exception flows become module business logic and error handling; each UC ID in the SDD links to its heading here |
| [LOYALTY 06b - Use Cases: Loyalty Manager](../brd-loyalty-points/06b-use-cases-loyalty-manager.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), 13c-service-loyalty.md - Pending (part 2) | UC main/exception flows become module business logic and error handling; each UC ID in the SDD links to its heading here |
| [LOYALTY 07 - Users & Use Cases Matrix](../brd-loyalty-points/07-users-use-cases-matrix.md) | 12-centralized-user-roles.md - Pending (part 2), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-module authorization rules |
| [LOYALTY 08 - Integrations](../brd-loyalty-points/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), 11-api-contracts.md - Pending (part 2) | BRD names partners and purpose; SDD details protocol/auth/retries; shared partners get one row citing both BRDs |
| [LOYALTY 10 - NFRs](../brd-loyalty-points/10-nfrs.md) | 14-performance-and-capacity.md - Pending (part 3), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [LOYALTY 12 - Appendix (Technical Inputs for the SDD)](../brd-loyalty-points/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md), [sdd/06 - Decisions](./06-principles-and-decisions.md) | LOYALTY/TI-01 conflicts with REFUNDS/TI-02 and is not applied (ADR-03) |
