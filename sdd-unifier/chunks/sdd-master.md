<!--
TYPE: Master Index
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: SDD - [Project Name]
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: All chunks share the SDD version number. When any chunk is updated, bump the SDD version in this master and in the updated chunk(s).
MAINTENANCE: When adding or removing chunks (especially 13x service chunks), update the tables below, the dependency graph, and the reading-order table.
-->

# SDD Master Index - [Project Name]

> **How to use:** This file is the entry point for the Solution Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Lineage:** this SDD's source BRDs (parents, each with its key) and child LLDs are listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference in the chunks carries its BRD key (`REFUNDS/UC-04`).

> **Specs note:** The constitution-grade `Specs` chunk (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with each child LLD (`../lld-[lld-slug]/17-specs.md`), synthesised from this SDD's body. The SDD carries no Specs chunk.

> **Decision history:** [decision-log.md](./decision-log.md) holds the ecosystem selection record, the clarification Q&A, and how each decision was reached. The chunks below state only the settled design. (Link it once the register exists; it is created on first use and never merged.)

---

## Generation Progress

<!-- parts: keep this table and update it at the end of every part (see parts-mode.md § The progress record). whole: set **Generation:** to whole and leave out the Part table; the Intent, Source, Reconciled, and E2E gate lines stay. -->

**Generation:** parts
**Intent:** [generate | transform | derive-from-BRD]
**Source:** [path of every source file, or "conversation"]

| Part | Chunks | Status | Completed |
|------|--------|--------|-----------|
| 1 | 00-09 | [Pending / In progress (last step) / Complete] | [YYYY-MM-DD] |
| 2 | 13x, 10, 12, 11 | [Pending (part 2)] | - |
| 3 | 14-18, 19 (gated) | [Pending (part 3)] | - |

**Reconciled:** [YYYY-MM-DD of the last clean step 6a run]
**E2E gate (chunk 19):** [Locked | Open - Up to date | Stale] - [open conditions E1-E4, if any]

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
| 6. Ecosystem Overview (full tech stack table, incl. Architecture Doctrine: EDA + DDD + Hexagonal defaults) | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |
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
| 17.1 Detailed Service Spec (full template) | [13a-service-detailed-template.md](./13a-service-detailed-template.md) |

<!-- When a real SDD has multiple services, add rows here:
| 17.2 [Service 2 Name] - Detailed Spec | [13b-service-[slug].md](./13b-service-[slug].md) |
| 17.3 [Service 3 Name] - Detailed Spec | [13c-service-[slug].md](./13c-service-[slug].md) |
-->

> **Contract consistency:** chunk 10 (event hub) is the platform event contract registry - topic names, event names, and payload contracts in every `13x` chunk must match it verbatim; chunk 11 is the same for synchronous API contracts (method and URI match each `13x` List of APIs; external contracts stay `TBD - external` until the user supplies them); chunk 12 is the same for roles and permission tokens. Divergences are flagged in the registries' consistency/drift sections, never silently reconciled.

### Service Spec Sub-Sections (within each 13x chunk)

Each `13x` service chunk contains these sub-sections in order:

| Sub-Section | Description |
|-------------|-------------|
| What | Service definition & bounded context |
| Boundaries | Owns / does not own / upstream / downstream |
| Input | Inbound triggers (REST, events, schedules) |
| Business Logic | Core logic + state machines |
| Output | Outbound responses and events |
| Integrations | Per-service integration details, each with its API ID (chunk 11) or event (chunk 10) |
| DB Modeling | ERD, tables, retention, archival, encryption |
| Multi-Tenancy Specifications | Overrides to platform defaults |
| API Standards | Style, versioning, auth, idempotency, API list (integration endpoints carry their API ID and link to chunk 11) |
| Event-Driven Architecture | Published + consumed events (must match chunk 10), messaging infra, DLQ |
| Constraints | Service-specific constraints |
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

> Generated *after* the main SDD body by a cleared-context reviewer. Captures architecture-level gaps, missing scenarios, ADR ambiguities, and cross-chunk contract mismatches. Every item carries a **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply; the skill walks the user through each item for acceptance, then reflects accepted answers into the body and logs them in the Resolution Log.

## End-to-End View (gated)

| Section | Chunk |
|---------|-------|
| 24. End-to-End System Design (services · topics · producers · consumers) | 19-e2e-system-design.md - [Locked until chunk 18 is cleared] |

> Chunk 19 is written LAST and only when the e2e gate is open (SKILL.md step 8b): every open item in chunk 18 resolved (`Deferred` counts as open), no open contract divergence, no clarification marker in chunks 09-13x or in 03 §7.3, and the reconciliation rerun after the last change. It consolidates chunks 09, 10, 11, 12, and 13x into one self-contained system map. Link it here once written.

---

## Chunk Dependency Graph

```
[project-slug]-sdd-master.md (you are here)
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
+-- 09-services-summary.md .............. decomposition overview table
|   +-- 10-events-hub.md ................ platform event catalog + payload contracts (event contract registry)
|   +-- 11-api-contracts.md ............. service integration API contracts (API contract registry)
|   +-- 12-centralized-user-roles.md .... platform-wide roles & authorities catalogue
|   +-- 13a-service-detailed-template.md  full spec for service 1 (events match 10, APIs match 11, roles match 12)
|   +-- [13b, 13c, ...] ................. one chunk per additional service
+-- 14-performance-and-capacity.md ...... load, throughput, peaks, stress testing
+-- 15-environments.md .................. Dev / SIT / UAT / Prod
+-- 16-operations-runbook.md ............ procedures, diagnostics, on-call
+-- 17-appendix-and-wishlist.md ......... references + future platform enhancements
+-- 18-open-items-and-clarifications.md . reviewer findings with recommended answers (post-generation)
+-- 19-e2e-system-design.md ............. end-to-end system map (gated: only after 18 is cleared; consolidates 09-13x)
```

### Reading Order by Task

| Agent Task | Start With | Then |
|------------|-----------|------|
| Understand the system | 19 (e2e, once written) | 01, 04, 02 |
| Design a new service | 07, 02 | 10 (event contracts), 11 (API contracts), 13a (copy as template), 09 |
| Review architecture | 04, 06 | 05, 07, 19 |
| Add an integration | 08 | 11 (API contract), 13a (service integrations sub-section) |
| Define DB schema | 07 (defaults) | 13a (DB Modeling sub-section) |
| Add / change an event | 10 (registry first) | the producing + consuming 13x chunks, then 18 |
| Define roles / permissions | 12 | 03, 11, the affected 13x chunks |
| Plan capacity / NFRs | 14 | 15, 01 (risks) |
| Write runbook procedures | 16 | 02 (ecosystem), 07 (observability) |
| Audit completeness | 00 (ToC) | all chunks sequentially |
| Check cross-cutting standards | 07 | 06 (principles), 02 (ecosystem) |
| Check contract consistency | 10 §14.8, 11 §15.5, 12 §16.12 | every 13x Event Model and List of APIs |
| Complete an external API contract | 11 §15.6 | the provider documentation, then 11 §15.3 |
| Map BRD use cases to services | 03 §7.3 (use-case traceability) | 09, then the owner's 13x chunk; each UC ID links to the use case in the BRD |
| Feed speckit `/constitution` | ../lld-[lld-slug]/17-specs.md (LLD-owned, one per child LLD) | 02, 09 |
| Steer `lld-unifier` (tech choices, contracts) | 02, 10, 11 | 09, 12; 00 § Document Lineage (Child LLDs) |
| Find the LLD for a use case | 03 §7.3 (owner service) | 00 § Document Lineage, the Child LLDs row whose scope names that service |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD <-> SDD)

<!-- Use the BRD's real file names and its key in the link text: one set of rows per source BRD (register order), and one row per BRD use-case chunk (06a, 06b, ...). The per-use-case map is §7.3; this table stays at chunk level. -->

| BRD Chunk | Related SDD Chunk(s) | Relationship |
|-----------|---------------------|--------------|
| [[KEY] 01 - Executive Summary](../brd-[brd-slug]/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [[KEY] 04 - Scope & Personas](../brd-[brd-slug]/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | BRD personas become SDD actors |
| [[KEY] 05 - User Journeys Overview](../brd-[brd-slug]/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner service in 09 |
| [[KEY] 06a - Use Cases: [Persona]](../brd-[brd-slug]/06a-use-cases-[persona-slug].md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), the owners' 13x chunks | UC main/exception flows become service business logic and error handling; each UC ID in the SDD links to its heading here |
| [[KEY] 07 - Users & Use Cases Matrix](../brd-[brd-slug]/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-service authorization rules |
| [[KEY] 08 - Integrations](../brd-[brd-slug]/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md) | BRD names partners and purpose; SDD details protocol/auth/retries and the API contract (external ones `TBD - external` until the provider documentation is supplied) |
| [[KEY] 10 - NFRs](../brd-[brd-slug]/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [[KEY] 12 - Appendix (Technical Inputs for the SDD)](../brd-[brd-slug]/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | Source technical mandates (parked verbatim in the BRD) seed the SDD ecosystem selection and override CLAUDE.md defaults |
