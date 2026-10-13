<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.2
PART OF: LLD - Refunds Platform
PURPOSE: Navigation graph for AI implementers and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
FILENAME: ./lld-refunds-platform/refunds-platform-lld-master.md. The SDD's Child LLDs row links to this file.
VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and 00-metadata.md carry the current LLD version; every other chunk carries the version in which its content last changed.
MAINTENANCE: When adding or removing modules (04-implementation/<module>.md files), update the tables below, the dependency graph, and the reading-order table.
-->

# LLD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Low-Level Design Document. Each section below maps to a chunk file. Links are relative to this directory. Load this file first, identify the chunks relevant to the task, and navigate to only those chunks.

> **Direction:** from-sdd
>
> **Project Type:** Greenfield (recorded in [17-specs.md](./17-specs.md) § 4; resolved from SDD §1 at intake)
>
> **Tech Stack snapshot:** Backend Java 21 / Spring Boot 3.5+ (one deployable, modular monolith) / Frontend Angular 17+ standalone for customer, member, branch manager, and payout operator screens (proposed, ADR-11) / Mobile not applicable / Data PostgreSQL 17+ / Messaging none (durable in-process events) - canonical copy in [17-specs.md](./17-specs.md) § 2, consolidated from SDD `02-ecosystem-overview.md`
>
> **Related SDD:** See [../sdd-refunds-platform/refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md).
>
> **Related BRD(s):** `REFUNDS` [../brd-refunds-portal/refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md); `LOYALTY` [../brd-loyalty-points/loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md).
>
> **Production bug?** Start at the [Use-Case Traceability Index](./16-references.md#199-use-case-traceability-index): from a use case, route, screen, or failing test case to the workflow, the SDD §7.3 row, the BRD use case, its UAT/BAT cases, and its e2e spec.
>
> **Specs:** [17-specs.md](./17-specs.md) - owned by this LLD (Mission, Tech Stack, Roadmap, Project Type), synthesised from the SDD after the body; the direct input for speckit `/constitution`. No legacy Specs chunk exists in the SDD or the BRDs.

---

## Document Metadata

| Section | Chunk |
|---------|-------|
| Title block, Version, Author, Reviewers, Approvers, Status, Direction | [00-metadata.md](./00-metadata.md) |
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
| 7. Per-Service Implementation (one file per module) | [04-implementation/](./04-implementation/) |
| 7.1 customer-notification (SDD §17.3) | [04-implementation/customer-notification.md](./04-implementation/customer-notification.md) |
| 7.2 loyalty-points (SDD §17.4) | [04-implementation/loyalty-points.md](./04-implementation/loyalty-points.md) |
| 7.3 payout (SDD §17.2) | [04-implementation/payout.md](./04-implementation/payout.md) |
| 7.4 refund-request (SDD §17.1) | [04-implementation/refund-request.md](./04-implementation/refund-request.md) |

### Per-Service Sub-Sections (within each `04-implementation/<module>.md`)

| Sub-Section | Description |
|-------------|-------------|
| Responsibility | Module's bounded context in one paragraph |
| Class & Interface Map | Classes, interfaces, method signatures, ports and adapters, authorization per entry point |
| Method Pseudocode | Method-level pseudocode for non-trivial logic |
| Design Patterns Applied | Per pattern: name, triggering CLAUDE.md rule, roles, rationale, Mermaid class diagram, pseudocode skeleton |
| Dependency Injection Graph | Constructor wiring |
| Transaction Boundaries | Propagation, isolation, rollback rules |
| Error Handling | Exceptions, RFC 9457 codes, HTTP status |
| Use-Case Workflows | Per `KEY/UC-NN` block: traceability line, control flow, sequence (Mermaid), idempotency points, outbox emission, retries/timeouts |

## Contracts & Data

| Section | Chunk |
|---------|-------|
| 8. Data Model (ERD, tables, indexes, tenant strategy, migration plan) | [05-data-model.md](./05-data-model.md) |
| 9. API Contracts (REST endpoints, idempotency, auth, OpenAPI refs, in-process port contracts) | [06-api-contracts.md](./06-api-contracts.md) |
| 10. Event Contracts (no broker; in-process domain events) | [07-event-contracts.md](./07-event-contracts.md) |
| 11. State Machines & Business Rules | [08-state-and-rules.md](./08-state-and-rules.md) |

## Platform Concerns

| Section | Chunk |
|---------|-------|
| 12. Cross-Cutting (auth/tenant, idempotency, resilience, publication log, RFC 9457, logging, tracing) | [09-cross-cutting.md](./09-cross-cutting.md) |
| 13. Operations (config, health, metrics, logs, tracing, alerts, runbooks) | [10-operations.md](./10-operations.md) |
| 14. Security (data classification, PII, secrets, threat notes) | [11-security.md](./11-security.md) |
| 15. Performance (SLOs, caching, indexes, bulkheads, peaks, load tests) | [12-performance.md](./12-performance.md) |
| 16. Testing (unit, module, architecture, integration, contract, e2e) | [13-testing.md](./13-testing.md) |
| 17. Frontend (Angular web app: routes, screens, use-case context) | [14-frontend.md](./14-frontend.md) |

## Audit & Reference

| Section | Chunk |
|---------|-------|
| 18. Open Questions / Drift Index / Confidence Flags | [15-open-questions.md](./15-open-questions.md) |
| 19. References (BRD/SDD links, ADRs, runbooks) | [16-references.md](./16-references.md) |
| 19.9 Use-Case Traceability Index (production-bug entry point) | [16-references.md § 19.9](./16-references.md#199-use-case-traceability-index) |
| 20. Specs (Mission, Tech Stack, Roadmap, Project Type - speckit `/constitution` input) | [17-specs.md](./17-specs.md) |
| 21. Open Items & Clarifications (reviewer output) | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |

---

## Confidence & Drift Marker Legend

| Marker | Meaning |
|--------|---------|
| `> Confirm:` | Medium-confidence inference. Reviewer should verify but content is usable. |
| `> TODO: <best-guess> - verify` | Low-confidence inference. Reviewer must verify or replace. |
| `⚠ drift`, `🆕 code-only`, `⛔ sdd-only`, `⚠ policy` | Not used: from-sdd direction, no code read. |

All flags are indexed in [15-open-questions.md](./15-open-questions.md).

---

## Chunk Dependency Graph

```
refunds-platform-lld-master.md (you are here)
|
+-- 00-metadata.md ............................. direction, version, authors, related BRD/SDD
+-- 01-purpose-and-scope.md .................... purpose, scope, assumptions, glossary
+-- 02-context.md .............................. bounded context, upstream/downstream
+-- 03-architecture.md ......................... component overview, deployment, runtime stack
+-- 04-implementation/ ......................... per-module deep-dive (load-bearing)
|   +-- customer-notification.md ............... messages, MsgHub, branch-manager alert
|   +-- loyalty-points.md ...................... points ledger, LOYALTY/UC-01, LOYALTY/UC-02
|   +-- payout.md .............................. payouts, rounds, card disputes, CardPay, operator resolutions, reconciliation
|   +-- refund-request.md ...................... refund lifecycle, REFUNDS/UC-01 to REFUNDS/UC-04
+-- 05-data-model.md ........................... ERD, tables, indexes, tenant strategy
+-- 06-api-contracts.md ........................ REST endpoints, idempotency, in-process port
+-- 07-event-contracts.md ...................... in-process events (no broker)
+-- 08-state-and-rules.md ...................... state machines, cross-module rules
+-- 09-cross-cutting.md ........................ auth, tenant, resilience, publication log
+-- 10-operations.md ........................... config, metrics, alerts, runbooks
+-- 11-security.md ............................. data classification, PII, secrets
+-- 12-performance.md .......................... SLOs, indexes, bulkheads
+-- 13-testing.md .............................. unit, integration, e2e (specs tagged by use case)
+-- 14-frontend.md ............................. Angular routes -> screens -> use cases
+-- 15-open-questions.md ....................... flag index
+-- 16-references.md ........................... BRD/SDD links, ADRs, runbooks, use-case traceability index
+-- 17-specs.md ................................ constitution-grade summary (synthesised after the body)
+-- 18-open-items-and-clarifications.md ........ reviewer findings (post-generation)
```

### Reading Order by Task

| Agent / Reader Task | Start With | Then |
|---------------------|-----------|------|
| Triage a production bug (page, route, error report, log line, or failing UAT case) | 16 § 19.9 | the row's workflow block (04), BRD use case, SDD §7.3, UAT/BAT cases, e2e spec |
| Implement a module | 04-implementation/[module].md | 05, 06, 07, 09 |
| Understand a workflow | 04-implementation/[module].md (workflows section) | 07, 08 |
| Add a new API endpoint | 06 | 04-implementation/[module].md, 09 |
| Add a new event | 07 | 04-implementation/[module].md (publishing module) |
| Verify a design pattern | 04-implementation/[module].md (Design Patterns) | (linked CLAUDE.md rule) |
| Plan migration / DB change | 05 | 04-implementation/[module].md |
| Plan a runbook | 10 | 12, 11 |
| Write tests | 13 (§ 16.8 for e2e) | 04-implementation/[module].md, 06, 07 |
| Feed speckit `/constitution` | 17-specs.md | (only this) |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD ↔ SDD ↔ LLD)

| Upstream chunk | Related LLD Chunk | Relationship |
|----------------|-------------------|--------------|
| brd/05 + 06x - Use cases | lld/04-implementation/[module].md (`KEY/UC-NN` blocks) + lld/16 § 19.9 | The BRD owns the use case IDs and titles; the LLD cites them, keyed, with links |
| brd/14 Mockup coverage - Screens | lld/14 § 17.3 | The BRD owns the `MK-NN` rows; the LLD maps routes to them |
| brd/16 - UAT/BAT Test Cases | lld/13 § 16.8 + the 04 traceability lines | Not written in either BRD: `Pending (BRD 16 not written)` |
| sdd/00 - Document Lineage | lld/00 + lld/16 § 19.1 | SDD lists the source BRDs and keys; this LLD registers in its Child LLDs table |
| sdd/03 - §7.3 Use Case Traceability | lld/04 traceability lines + lld/16 § 19.9 | Owner and entry points carried to workflows, routes, tests, and spans |
| sdd/04 - Architecture Style | lld/03 - Architecture | Modular monolith operationalised as packages, ports, events |
| sdd/05 - Workflows & Sequences | lld/04 workflows | Refined per module with idempotency, outbox, retries |
| sdd/07 - Cross-Cutting Concerns | lld/09 - Cross-Cutting | Defaults applied concretely |
| sdd/10 - Centralized Event Hub | lld/07 § 10.6 | §14.10 events with publishing and listener classes |
| sdd/11 - Service Integration API Contracts | lld/06 | `API-NN` referenced; clients, adapters, port API-06 in § 9.6 |
| sdd/12 - Centralized User Roles | lld/11 + lld/09 + each 04 § 7.2 Authorization | Tokens verbatim; enforcement added |
| sdd/13a-13d - Module specs | lld/04-implementation/[module].md | SDD defines the contract; LLD the implementation |
| sdd/14 - Performance & Capacity | lld/12 | SDD targets (mostly open); LLD meeting-the-targets detail |
| sdd/16 - Operations Runbook | lld/10 | SDD procedures linked; design facts added |
| sdd/19 - E2E System Design | lld/02 | Not written (gate `Locked` at SDD v1.4); lld/02 built from SDD §8, §14.10, §15 |
