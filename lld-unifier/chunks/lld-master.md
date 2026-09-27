<!--
TYPE: Master Index
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
PURPOSE: Navigation graph for AI implementers and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: All chunks share the LLD version number. When any chunk is updated, bump the LLD version in this master and in the updated chunk(s).
MAINTENANCE: When adding or removing services (especially 04-implementation/<service>.md files), update the tables below, the dependency graph, and the reading-order table.
-->

# LLD Master Index - [Project Name]

> **How to use:** This file is the entry point for the Low-Level Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Mode:** [from-code | from-sdd | hybrid | partial]
>
> **Project Type:** [Greenfield | Brownfield] (recorded in [17-specs.md](./17-specs.md) § 4; resolved from the SDD at intake)
>
> **Tech Stack snapshot:** [Backend / Frontend / Mobile / Data / Messaging — canonical copy in [17-specs.md](./17-specs.md) § 2, consolidated from SDD `02-ecosystem-overview.md`]
>
> **Related SDD:** See [../sdd-[project-slug]/[project-slug]-sdd-master.md](../sdd-[project-slug]/[project-slug]-sdd-master.md) (if applicable).
>
> **Related BRD:** See [../brd-[project-slug]/[project-slug]-brd-master.md](../brd-[project-slug]/[project-slug]-brd-master.md) (if applicable).
>
> **Specs:** [17-specs.md](./17-specs.md) — owned by this LLD (Mission, Tech Stack, Roadmap, Project Type), synthesised from the SDD after the body; the direct input for speckit `/constitution`. (Legacy chains carried a Specs at `../sdd-[project-slug]/15-specs.md` or `../brd-[project-slug]/12-specs.md` — consumed as input if present.)

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

<!-- Add one row per service below: -->
<!-- | 7.1 [Service Name] | [04-implementation/[service-slug].md](./04-implementation/[service-slug].md) | -->

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
| 12. Cross-Cutting (auth/tenant, idempotency, retry/circuit breaker, RFC 9457) | [09-cross-cutting.md](./09-cross-cutting.md) |
| 13. Operations (config, health, RED metrics, logs, tracing, runbooks) | [10-operations.md](./10-operations.md) |
| 14. Security (data classification, PII, secrets, threat notes) | [11-security.md](./11-security.md) |
| 15. Performance (SLOs, throughput, caching, load tests) | [12-performance.md](./12-performance.md) |
| 16. Testing (unit, integration Testcontainers, contract, e2e Playwright) | [13-testing.md](./13-testing.md) |
| 17. Frontend (conditional — present only when UI exists) | [14-frontend.md](./14-frontend.md) |

## Audit & Reference

| Section | Chunk |
|---------|-------|
| 18. Open Questions / Drift Index / Confidence Flags | [15-open-questions.md](./15-open-questions.md) |
| 19. References (BRD/SDD links, ADRs, runbooks) | [16-references.md](./16-references.md) |
| 20. Specs (Mission, Tech Stack, Roadmap, Project Type — speckit `/constitution` input) | [17-specs.md](./17-specs.md) |
| 21. Open Items & Clarifications (reviewer output) | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |

---

## Confidence & Drift Marker Legend

| Marker | Meaning |
|--------|---------|
| `> Confirm:` | Medium-confidence inference. Reviewer should verify but content is usable. |
| `> TODO: <best-guess> — verify` | Low-confidence inference. Reviewer must verify or replace. |
| `✅` (implicit, no marker) | Aligned: from-code and from-sdd match (hybrid mode only). |
| `⚠ drift` | Hybrid only: SDD intent and code reality disagree. See `> Drift note:` block. |
| `🆕 code-only` | Hybrid only: present in code, not in SDD. |
| `⛔ sdd-only` | Hybrid only: in SDD, not yet built. |

All flags are indexed in [15-open-questions.md](./15-open-questions.md).

---

## Chunk Dependency Graph

```
lld-master.md (you are here)
|
+-- 00-metadata.md ............................. mode, version, authors, related BRD/SDD
+-- 01-purpose-and-scope.md .................... purpose, scope, assumptions, glossary
+-- 02-context.md .............................. bounded context, upstream/downstream
+-- 03-architecture.md ......................... component overview, deployment
+-- 04-implementation/ ......................... per-service deep-dive (load-bearing)
|   +-- [service-1-slug].md .................... classes, patterns, workflows
|   +-- [service-2-slug].md
|   +-- ...
+-- 05-data-model.md ........................... ERD, tables, indexes, tenant strategy
+-- 06-api-contracts.md ........................ REST endpoints, idempotency
+-- 07-event-contracts.md ...................... Kafka topics, schemas, outbox
+-- 08-state-and-rules.md ...................... state machines, business rules
+-- 09-cross-cutting.md ........................ auth, tenant, retry, circuit breaker
+-- 10-operations.md ........................... config, metrics, logs, tracing
+-- 11-security.md ............................. data classification, PII, secrets
+-- 12-performance.md .......................... SLOs, throughput, caching
+-- 13-testing.md .............................. unit, integration, contract, e2e
+-- 14-frontend.md ............................. (conditional) Angular module tree
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
| Add a new event | 07 | 04-implementation/[svc].md (event-publishing service) |
| Verify a design pattern | 04-implementation/[svc].md (Design Patterns) | (linked CLAUDE.md rule) |
| Audit drift (hybrid only) | 15 | grep `⚠`, `🆕`, `⛔` across the LLD |
| Plan migration / DB change | 05 | 04-implementation/[svc].md (DB-touching service) |
| Plan a runbook | 10 | 12, 11 |
| Write tests | 13 | 04-implementation/[svc].md, 06, 07 |
| Feed speckit `/constitution` | 17-specs.md | (only this) |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD ↔ SDD ↔ LLD)

| SDD Chunk | Related LLD Chunk | Relationship |
|-----------|-------------------|--------------|
| sdd/04 - Architecture Style | lld/03 - Architecture | SDD names the style; LLD operationalises with concrete component topology |
| sdd/05 - Workflows & Sequences | lld/04-implementation/[svc].md (workflows) | SDD describes the cross-service flow; LLD refines per service with idempotency, outbox, saga steps |
| sdd/07 - Cross-Cutting Concerns | lld/09 - Cross-Cutting | SDD sets defaults; LLD applies them concretely with Resilience4j config, error codes |
| sdd/10 - Centralized Event Hub | lld/07 - Event Contracts | SDD's contract registry (topics, events, payloads) carries verbatim into the LLD's event contracts |
| sdd/13a - Service Detailed Spec | lld/04-implementation/[svc].md | SDD defines the contract; LLD defines the implementation (classes, patterns, pseudocode) |
| sdd/11 - Centralized User Roles | lld/11 - Security + lld/09 - Cross-Cutting | SDD's role/permission catalogue carries verbatim into authZ decisions and checks |
| sdd/12 - Performance & Capacity | lld/12 - Performance | SDD lists targets; LLD describes the caching/index strategy that meets them |
| sdd/14 - Operations Runbook | lld/10 - Operations | SDD describes procedures; LLD links to runbook URLs and exposes the metrics/logs they reference |
| sdd/16 - E2E System Design | lld/02 - Context | SDD's reconciled system map orients the LLD's cross-service dependency view |
