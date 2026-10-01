<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
PURPOSE: Navigation graph for AI implementers and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: All chunks share the LLD version number. When any chunk is updated, bump the LLD version in this master and in the updated chunk(s).
MAINTENANCE: When adding or removing services (especially 04-implementation/<service>.md files), update the tables below, the dependency graph, and the reading-order table.
-->

# LLD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Low-Level Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Mode:** from-sdd
>
> **Project Type:** Greenfield (recorded in [17-specs.md](./17-specs.md) § 4; resolved from the SDD at intake)
>
> **Tech Stack snapshot:** Backend Java 21 / Spring Boot 3.5+ (hybrid: `refunds-platform-core` plus payout-service and notification-service); Frontend Angular 17+ with PrimeNG and Tailwind; Mobile not applicable; Data PostgreSQL 17+; Messaging Apache Kafka with a JSON Schema registry - canonical copy in [17-specs.md](./17-specs.md) § 2, consolidated from SDD `02-ecosystem-overview.md`
>
> **Related SDD:** See [../sdd-refunds-platform/refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md).
>
> **Related BRD:** See [../brd-refunds-portal/refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS) and [../brd-loyalty-points/loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) (LOYALTY).
>
> **Specs:** [17-specs.md](./17-specs.md) - owned by this LLD (Mission, Tech Stack, Roadmap, Project Type), synthesised from the SDD after the body; the direct input for speckit `/constitution`. (No legacy Specs exists in the SDD or the BRDs.)

---

## Document Metadata

| Section | Chunk |
|---------|-------|
| Title block, Version, Author, Reviewers, Approvers, Status, Mode | [00-metadata.md](./00-metadata.md) |
| Related BRD/SDD reference | [00-metadata.md](./00-metadata.md) |
| Changes Log | [00-metadata.md](./00-metadata.md) |

## Strategic Framing

| Section | Chunk |
|---------|-------|
| 1. Purpose | [01-purpose-and-scope.md](./01-purpose-and-scope.md) |
| 2. Scope (In / Out) | [01-purpose-and-scope.md](./01-purpose-and-scope.md) |
| 3. Assumptions | [01-purpose-and-scope.md](./01-purpose-and-scope.md) |
| 4. Glossary | [01-purpose-and-scope.md](./01-purpose-and-scope.md) |
| 5. Context (Bounded Context, Upstream/Downstream) | [02-context.md](./02-context.md) |
| 6. Architecture Overview (Component Topology, Deployment) | [03-architecture.md](./03-architecture.md) |

## Implementation (load-bearing)

| Section | Chunk |
|---------|-------|
| 7. Per-Service Implementation (one file per service) | [04-implementation/](./04-implementation/) |
| 7.1 loyalty-service (module of `refunds-platform-core`) | [04-implementation/loyalty-service.md](./04-implementation/loyalty-service.md) |
| 7.2 notification-service (own deployable) | [04-implementation/notification-service.md](./04-implementation/notification-service.md) |
| 7.3 payout-service (own deployable) | [04-implementation/payout-service.md](./04-implementation/payout-service.md) |
| 7.4 refund-service (module of `refunds-platform-core`) | [04-implementation/refund-service.md](./04-implementation/refund-service.md) |

### Per-Service Sub-Sections (within each `04-implementation/<service>.md`)

| Sub-Section | Description |
|-------------|-------------|
| Responsibility | Service's bounded context in one paragraph |
| Class & Interface Map | Classes, interfaces, method signatures |
| Method Pseudocode | Method-level pseudocode for non-trivial logic |
| Design Patterns Applied | Per-pattern: name, triggering CLAUDE.md rule, roles, rationale, Mermaid class diagram, pseudocode skeleton |
| Dependency Injection Graph | Constructor wiring, bean composition |
| Transaction Boundaries | `@Transactional` propagation, isolation, rollback rules |
| Error Handling | Exceptions thrown, RFC 9457 codes, mapping to HTTP status |
| Use-Case Workflows | Per use case: control flow, sequence (Mermaid), saga steps, compensation, idempotency points, outbox emission, retries/timeouts |

## Contracts & Data

| Section | Chunk |
|---------|-------|
| 8. Data Model (ERD, tables, indexes, tenant strategy, Flyway plan) | [05-data-model.md](./05-data-model.md) |
| 9. API Contracts (REST endpoints, idempotency, auth, OpenAPI refs) | [06-api-contracts.md](./06-api-contracts.md) |
| 10. Event Contracts (Kafka topics, schemas, outbox, DLQ) | [07-event-contracts.md](./07-event-contracts.md) |
| 11. State Machines & Business Rules | [08-state-and-rules.md](./08-state-and-rules.md) |

## Platform Concerns

| Section | Chunk |
|---------|-------|
| 12. Cross-Cutting (auth/tenant, idempotency, retry/circuit breaker, outbox, SAGA-01, RFC 9457) | [09-cross-cutting.md](./09-cross-cutting.md) |
| 13. Operations (config, health, RED metrics, logs, tracing, runbooks) | [10-operations.md](./10-operations.md) |
| 14. Security (data classification, PII, secrets, threat notes) | [11-security.md](./11-security.md) |
| 15. Performance (SLOs, throughput, caching, load tests) | [12-performance.md](./12-performance.md) |
| 16. Testing (unit, integration Testcontainers, contract, e2e Playwright) | [13-testing.md](./13-testing.md) |
| 17. Frontend (present: Angular web app) | [14-frontend.md](./14-frontend.md) |

## Audit & Reference

| Section | Chunk |
|---------|-------|
| 18. Open Questions / Drift Index / Confidence Flags | [15-open-questions.md](./15-open-questions.md) |
| 19. References (BRD/SDD links, ADRs, runbooks) | [16-references.md](./16-references.md) |
| 20. Specs (Mission, Tech Stack, Roadmap, Project Type - speckit `/constitution` input) | [17-specs.md](./17-specs.md) |
| 21. Open Items & Clarifications (reviewer output) | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |

---

## Confidence & Drift Marker Legend

| Marker | Meaning |
|--------|---------|
| `> Confirm:` | Medium-confidence inference. Reviewer should verify but content is usable. |
| `> TODO: <best-guess> - verify` | Low-confidence inference. Reviewer must verify or replace. |
| (implicit, no marker) | Aligned: from-code and from-sdd match (hybrid mode only). |
| `[DRIFT]` | Hybrid only: SDD intent and code reality disagree. See `> Drift note:` block. Not used in this from-sdd LLD. |
| `[CODE-ONLY]` | Hybrid only: present in code, not in SDD. Not used here. |
| `[SDD-ONLY]` | Hybrid only: in SDD, not yet built. Not used here. |

All flags are indexed in [15-open-questions.md](./15-open-questions.md).

---

## Chunk Dependency Graph

```
lld-master.md (you are here)
|
+-- 00-metadata.md ............................. mode, version, authors, related BRD/SDD
+-- 01-purpose-and-scope.md .................... purpose, scope, assumptions, glossary
+-- 02-context.md .............................. bounded context, upstream/downstream
+-- 03-architecture.md ......................... component overview, deployment, runtime stack
+-- 04-implementation/ ......................... per-service deep-dive (load-bearing)
|   +-- loyalty-service.md ..................... ledger, take-back, earn, member views
|   +-- notification-service.md ................ send log, contacts, email and SMS
|   +-- payout-service.md ...................... payouts, attempts, results, reconciliation
|   +-- refund-service.md ...................... refund requests, decisions, payout outcomes
+-- 05-data-model.md ........................... ERD, tables, indexes, tenant strategy
+-- 06-api-contracts.md ........................ REST endpoints, idempotency
+-- 07-event-contracts.md ...................... Kafka topics, schemas, outbox
+-- 08-state-and-rules.md ...................... state machines, business rules
+-- 09-cross-cutting.md ........................ auth, tenant, retry, circuit breaker, SAGA-01
+-- 10-operations.md ........................... config, metrics, logs, tracing, runbooks
+-- 11-security.md ............................. data classification, PII, secrets
+-- 12-performance.md .......................... SLOs, throughput, caching
+-- 13-testing.md .............................. unit, integration, contract, e2e
+-- 14-frontend.md ............................. Angular web app
+-- 15-open-questions.md ....................... drift index, flag index
+-- 16-references.md ........................... BRD/SDD links, ADRs, runbooks
+-- 17-specs.md ................................ constitution-grade summary (synthesised after the body)
+-- 18-open-items-and-clarifications.md ........ reviewer findings (post-generation)
```

### Reading Order by Task

| Agent / Reader Task | Start With | Then |
|---------------------|-----------|------|
| Implement a service | 04-implementation/[svc].md | 05, 06, 07, 09 |
| Understand a workflow | 04-implementation/[svc].md (workflows section) | 07, 08 |
| Add a new API endpoint | 06 | 04-implementation/[svc].md, 09 |
| Add a new event | 07 (and SDD chunk 10 first) | 04-implementation/[svc].md (event-publishing service) |
| Verify a design pattern | 04-implementation/[svc].md (Design Patterns) | (linked CLAUDE.md rule) |
| Audit drift (hybrid only) | 15 | Not applicable (from-sdd) |
| Plan migration / DB change | 05 | 04-implementation/[svc].md (DB-touching service) |
| Plan a runbook | 10 | 12, 11 |
| Write tests | 13 | 04-implementation/[svc].md, 06, 07 |
| Build the web app | 14 | 06, 11 |
| Feed speckit `/constitution` | 17-specs.md | (only this) |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD <-> SDD <-> LLD)

| SDD Chunk | Related LLD Chunk | Relationship |
|-----------|-------------------|--------------|
| [sdd/04 - Architecture Style](../sdd-refunds-platform/04-architecture-style-and-diagrams.md) | 03 - Architecture | SDD names the style; LLD operationalises it with components, module isolation, package layout |
| [sdd/05 - Workflows & Sequences](../sdd-refunds-platform/05-workflows-and-sequences.md) | 04-implementation/[svc].md (workflows) | SDD describes the cross-service flow; LLD refines per service with idempotency, outbox, saga steps |
| [sdd/07 - Cross-Cutting Concerns](../sdd-refunds-platform/07-cross-cutting-concerns.md) | 09 - Cross-Cutting | SDD sets defaults; LLD implements them (idempotency interceptor, relay, inbox, Resilience4j instances) |
| [sdd/10 - Centralized Event Hub](../sdd-refunds-platform/10-events-hub.md) | 07 - Event Contracts | SDD owns topics, events, envelope, payloads; LLD matches names verbatim and adds consumer groups, serialisation, DLQ |
| [sdd/11 - API Contracts](../sdd-refunds-platform/11-api-contracts.md) | 06 - API Contracts | SDD owns API-01 to API-06 (all `TBD - external`); LLD adds clients and resilience |
| [sdd/12 - Centralized User Roles](../sdd-refunds-platform/12-centralized-user-roles.md) | 11 - Security + 09 - Cross-Cutting | SDD owns roles and permission tokens; LLD adds the permission maps and enforcement points |
| [sdd/13a-13d - Service Detailed Specs](../sdd-refunds-platform/13a-service-refund.md) | 04-implementation/[svc].md | SDD defines the contract; LLD defines the implementation (classes, patterns, pseudocode) |
| [sdd/14 - Performance & Capacity](../sdd-refunds-platform/14-performance-and-capacity.md) | 12 - Performance | SDD lists targets; LLD describes how they are met |
| [sdd/16 - Operations Runbook](../sdd-refunds-platform/16-operations-runbook.md) | 10 - Operations | SDD procedures are open templates; LLD gives runbook skeletons against this design |
| sdd/19 - E2E System Design (locked in the SDD) | 02 - Context | Not available; 02 derives the dependency view from SDD §8 and §14 |
| [BRD REFUNDS](../brd-refunds-portal/refunds-portal-brd-master.md), [BRD LOYALTY](../brd-loyalty-points/loyalty-points-brd-master.md) | 04 (UC workflows), 14, 17 | Use cases name the LLD workflows; screens seed the web app; UC ownership seeds the Roadmap |
