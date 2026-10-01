<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
PURPOSE: Navigation graph for AI implementers and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
FILENAME: ./lld-refunds-platform/refunds-platform-lld-master.md. The SDD's Child LLDs row links to this file, and sdd-unifier finds this LLD through the Related SDD line below.
VERSIONING: All chunks share the LLD version number. When any chunk is updated, bump the LLD version in this master and in the updated chunk(s).
MAINTENANCE: When adding or removing services (04-implementation/<service>.md files), update the tables below, the dependency graph, and the reading-order table.
-->

# LLD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Low-Level Design Document. Each section below maps to a chunk file. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Mode:** from-sdd
>
> **Project Type:** Greenfield (recorded in [17-specs.md](./17-specs.md) § 4; resolved from SDD §1 at intake)
>
> **Tech Stack snapshot:** Backend Java 21 / Spring Boot 3.5+; Frontend Angular 17+ (standalone), PrimeNG, Tailwind; Mobile not applicable; Data PostgreSQL 17+; Messaging Apache Kafka with a JSON Schema registry. Canonical copy in [17-specs.md](./17-specs.md) § 2, consolidated from SDD [02-ecosystem-overview.md](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview).
>
> **Related SDD:** See [../sdd-refunds-platform/refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md).
>
> **Related BRD(s):** `REFUNDS` [../brd-refunds-portal/refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md); `LOYALTY` [../brd-loyalty-points/loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) (keys from the SDD's Source BRDs register).
>
> **Production bug?** Start at the [Use-Case Traceability Index](./16-references.md#199-use-case-traceability-index): from a use case, route, screen, or failing test case to the workflow, the SDD §7.3 row, the BRD use case, its UAT/BAT cases, and its e2e spec.
>
> **Specs:** [17-specs.md](./17-specs.md), owned by this LLD (Mission, Tech Stack, Roadmap, Project Type), synthesised from the SDD after the body; the direct input for speckit `/constitution`. No legacy SDD or BRD Specs chunk exists in this chain.

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
| 7.x loyalty-service (module of `refunds-platform-core`) | [04-implementation/loyalty-service.md](./04-implementation/loyalty-service.md) |
| 7.x notification-service (own deployable) | [04-implementation/notification-service.md](./04-implementation/notification-service.md) |
| 7.x payout-service (own deployable) | [04-implementation/payout-service.md](./04-implementation/payout-service.md) |
| 7.x refund-service (module of `refunds-platform-core`) | [04-implementation/refund-service.md](./04-implementation/refund-service.md) |

Services are listed alphabetically by slug; the order implies no hierarchy.

### Per-Service Sub-Sections (within each `04-implementation/<service>.md`)

| Sub-Section | Description |
|-------------|-------------|
| Responsibility | Service's bounded context in one paragraph |
| Class & Interface Map | Classes, interfaces, method signatures, `@UseCase` on traced entry points |
| Method Pseudocode | Method-level pseudocode for non-trivial logic |
| Design Patterns Applied | Per-pattern: name, triggering CLAUDE.md rule, roles, rationale, Mermaid class diagram, pseudocode skeleton |
| Dependency Injection Graph | Constructor wiring, bean composition |
| Transaction Boundaries | `@Transactional` propagation, isolation, rollback rules |
| Error Handling | Exceptions thrown, RFC 9457 codes, mapping to HTTP status |
| Use-Case Workflows | Per `KEY/UC-NN` block: traceability line (BRD, SDD §7.3, owner, entry points, UAT/BAT cases, screens and routes), control flow, sequence (Mermaid), idempotency points, outbox emission, retries/timeouts; `Participates in` blocks for the services that realise part of another owner's use case |

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
| 12. Cross-Cutting (auth/tenant, idempotency, retry/circuit breaker, RFC 9457, `use_case`) | [09-cross-cutting.md](./09-cross-cutting.md) |
| 13. Operations (config, health, RED metrics, logs, tracing, runbooks) | [10-operations.md](./10-operations.md) |
| 14. Security (data classification, PII, secrets, threat notes) | [11-security.md](./11-security.md) |
| 15. Performance (SLOs, throughput, caching, load tests) | [12-performance.md](./12-performance.md) |
| 16. Testing (unit, integration Testcontainers, contract, e2e Playwright) | [13-testing.md](./13-testing.md) |
| 17. Frontend (Angular web app: customer, member, and branch manager areas) | [14-frontend.md](./14-frontend.md) |

## Audit & Reference

| Section | Chunk |
|---------|-------|
| 18. Open Questions / Drift Index / Confidence Flags | [15-open-questions.md](./15-open-questions.md) |
| 19. References (BRD/SDD links, ADRs, runbooks) | [16-references.md](./16-references.md) |
| 19.9 Use-Case Traceability Index (production-bug entry point) | [16-references.md § 19.9](./16-references.md#199-use-case-traceability-index) |
| 20. Specs (Mission, Tech Stack, Roadmap, Project Type; speckit `/constitution` input) | [17-specs.md](./17-specs.md) |
| 21. Open Items & Clarifications (reviewer output) | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |

---

## Confidence & Drift Marker Legend

| Marker | Meaning |
|--------|---------|
| `> Confirm:` | Medium-confidence inference. Reviewer should verify but content is usable. |
| `> TODO: <best guess> - verify` | Low-confidence inference. Reviewer must verify or replace. |
| `✅` (implicit, no marker) | Aligned (hybrid mode only; not used in this from-sdd LLD). |
| `⚠ drift` | Hybrid only; not used in this from-sdd LLD. |
| `🆕 code-only` | Hybrid only; not used in this from-sdd LLD. |
| `⛔ sdd-only` | Hybrid only; not used in this from-sdd LLD. |

All flags are indexed in [15-open-questions.md](./15-open-questions.md).

---

## Chunk Dependency Graph

```
refunds-platform-lld-master.md (you are here)
|
+-- 00-metadata.md ............................. mode, version, authors, related BRDs (REFUNDS, LOYALTY) and SDD
+-- 01-purpose-and-scope.md .................... purpose, scope, assumptions, glossary
+-- 02-context.md .............................. bounded contexts, upstream/downstream
+-- 03-architecture.md ......................... component overview, deployment, runtime stack
+-- 04-implementation/ ......................... per-service deep-dive (load-bearing)
|   +-- loyalty-service.md ..................... LOYALTY/UC-01, LOYALTY/UC-02 (traced), earn and take-back
|   +-- notification-service.md ................ participates in REFUNDS/UC-01, REFUNDS/UC-03, REFUNDS/UC-04
|   +-- payout-service.md ...................... participates in REFUNDS/UC-04
|   +-- refund-service.md ...................... REFUNDS/UC-01, REFUNDS/UC-02, REFUNDS/UC-03, REFUNDS/UC-04 (traced), SAGA-01 step table
+-- 05-data-model.md ........................... ERD, DDL, indexes, tenant strategy, Flyway plan
+-- 06-api-contracts.md ........................ REST endpoints, idempotency, provider adapters
+-- 07-event-contracts.md ...................... Kafka topics, consumer groups, outbox, DLQ
+-- 08-state-and-rules.md ...................... state machines, cross-service rules, algorithms
+-- 09-cross-cutting.md ........................ auth, tenant, idempotency, resilience, outbox, errors, use_case
+-- 10-operations.md ........................... config, metrics, logs, tracing, alerts, runbooks
+-- 11-security.md ............................. data classification, PII, secrets, authZ enforcement
+-- 12-performance.md .......................... SLOs, caching, bulkheads, peaks
+-- 13-testing.md .............................. unit, integration, contract, e2e (specs tagged by use case)
+-- 14-frontend.md ............................. Angular app, routes -> screens -> use cases
+-- 15-open-questions.md ....................... flag index, decisions pending
+-- 16-references.md ........................... BRD/SDD links, ADRs, runbooks, use-case traceability index
+-- 17-specs.md ................................ constitution-grade summary (synthesised after the body)
+-- 18-open-items-and-clarifications.md ........ reviewer findings (post-generation)
```

### Reading Order by Task

| Agent / Reader Task | Start With | Then |
|---------------------|-----------|------|
| Triage a production bug (page, route, error report, log line, or failing UAT case) | 16 § 19.9 (the row of its `use_case`, route, screen, or test case) | the row's workflow block (04), BRD use case, SDD §7.3, UAT/BAT cases, e2e spec |
| Implement a service | 04-implementation/[svc].md | 05, 06, 07, 09 |
| Understand a workflow | 04-implementation/[svc].md (workflows section) | 07, 08 |
| Add a new API endpoint | 06 | 04-implementation/[svc].md, 09 |
| Add a new event | 07 (then SDD §14 first: the registry owns names and payloads) | 04-implementation/[svc].md (event-publishing service) |
| Verify a design pattern | 04-implementation/[svc].md (Design Patterns) | (linked CLAUDE.md rule) |
| Plan migration / DB change | 05 | 04-implementation/[svc].md (DB-touching service) |
| Plan a runbook | 10 | 12, 11 |
| Write tests | 13 (§ 16.8 for e2e) | 04-implementation/[svc].md, 06, 07, the BRD's UAT/BAT cases |
| Build the web app | 14 | 06, 13 § 16.8 |
| Feed speckit `/constitution` | 17-specs.md | (only this) |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD ↔ SDD ↔ LLD)

| Upstream chunk | Related LLD Chunk | Relationship |
|----------------|-------------------|--------------|
| REFUNDS and LOYALTY brd/05 + 06x - Use cases | lld/04-implementation/[svc].md (`KEY/UC-NN` blocks) + lld/16 § 19.9 | The BRD owns the use case IDs and titles; the LLD cites them, keyed, with links to their headings |
| REFUNDS brd/11, LOYALTY 06a UI/UX, REFUNDS brd/14 Mockup coverage - Screens | lld/14 § 17.3 | The BRD owns screen IDs (or `MK-NN`) and the use cases each serves; the LLD maps routes to them |
| REFUNDS brd/16 - UAT/BAT Test Cases (LOYALTY 16 Locked) | lld/13 § 16.8 + the 04 traceability lines | The BRD owns the test cases; the LLD tags e2e specs with them |
| sdd/00 - Document Lineage | lld/00 + lld/16 § 19.1 | SDD lists the source BRDs and their keys; the LLD registers itself in its Child LLDs table |
| sdd/03 - §7.3 Use Case Traceability | lld/04-implementation/[svc].md (traceability lines) + lld/16 § 19.9 | SDD traces each use case to its owner and entry points; LLD carries the trace to workflows, routes, tests, and spans |
| sdd/04 - Architecture Style | lld/03 - Architecture | SDD names the style; LLD operationalises with concrete component topology |
| sdd/05 - Workflows & Sequences | lld/04-implementation/[svc].md (workflows) | SDD describes the cross-service flow; LLD refines per service with idempotency, outbox, saga steps |
| sdd/07 - Cross-Cutting Concerns | lld/09 - Cross-Cutting | SDD sets defaults; LLD applies them concretely with Resilience4j config, error codes |
| sdd/10 - Centralized Event Hub | lld/07 - Event Contracts | SDD's contract registry (topics, events, payloads) is referenced by name; LLD adds groups, DLQs, serialisation |
| sdd/11 - Service Integration API Contracts | lld/06 - API Contracts | SDD's `API-NN` contracts are referenced; LLD adds clients, DTO records, resilience config |
| sdd/12 - Centralized User Roles | lld/11 - Security + lld/09 - Cross-Cutting | SDD's role/permission catalogue is referenced by name; LLD adds the enforcement implementation |
| sdd/13a to 13d - Service Detailed Specs | lld/04-implementation/[svc].md | SDD defines the contract; LLD defines the implementation (classes, patterns, pseudocode) |
| sdd/14 - Performance & Capacity | lld/12 - Performance | SDD lists targets; LLD describes the index and bulkhead strategy that meets them |
| sdd/16 - Operations Runbook | lld/10 - Operations | SDD holds procedure templates; LLD exposes the metrics/logs they reference and skeleton commands |
| sdd/19 - E2E System Design | lld/02 - Context | Locked in the SDD (e2e gate shut); not used |
