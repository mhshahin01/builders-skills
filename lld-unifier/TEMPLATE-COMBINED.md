# Low-Level Design Document — [Project Name]

| Field | Value |
|-------|-------|
| Document Title | Low-Level Design — [Project Name] |
| Version | [X.X] |
| Status | [Draft / In Review / Approved] |
| Mode | [from-code / from-sdd / hybrid / partial] |
| Date | [YYYY-MM-DD] |
| Author(s) | [Names] |
| Reviewers | [Names] |
| Approvers | [Names] |
| Related BRD(s) | [One per source BRD, with its key from the SDD's Source BRDs register: `[KEY]` [[brd-slug]-brd-master.md](./brd-[brd-slug]/[brd-slug]-brd-master.md); or `Not applicable`] |
| Related SDD | [[sdd-slug]-sdd-master.md](./sdd-[sdd-slug]/[sdd-slug]-sdd-master.md) [or `Not applicable`] |
| Source Code Path | [path or `Not applicable`] |

> **Production bug?** Start at [§19.9 Use-Case Traceability Index](#199-use-case-traceability-index).

---

## Changes Log

| Version | Date | Author | Mode | Change Summary |
|---------|------|--------|------|----------------|
| [X.X] | [YYYY-MM-DD] | [Author] | [mode] | Initial LLD draft via lld-unifier. |

---

# 1. Purpose

[One paragraph stating what this LLD enables a developer or AI implementer to do.]

# 2. Scope

## 2.1 In Scope

- [Item]

## 2.2 Out of Scope

- [Item]

# 3. Assumptions

| ID | Assumption | Source | Risk if false |
|----|------------|--------|---------------|
| A-01 | [Assumption] | [BRD / SDD / CLAUDE.md / inferred] | [Risk] |

# 4. Glossary

| Term | Definition | Source |
|------|------------|--------|

> **Convention:** from an SDD, link its glossary ([SDD §5](./sdd-[sdd-slug]/01-executive-summary-scope-risks.md#5-glossary)) instead of copying it, and add rows only for LLD-specific implementation terms. From code with no SDD, define every term here.

# 5. Context

## 5.1 Bounded Context

[One paragraph.]

## 5.2 Upstream Producers

| Upstream | Interaction | Protocol | Notes |
|----------|-------------|----------|-------|

## 5.3 Downstream Consumers

| Downstream | Interaction | Protocol | Notes |
|------------|-------------|----------|-------|

## 5.4 Cross-Service Dependencies

```mermaid
graph LR
  SVC_A --> SVC_B
```

# 6. Architecture Overview

## 6.1 Component Topology

```mermaid
graph TB
  GW[API Gateway] --> SVC_A[Service A]
  SVC_A --> DB_A[(PostgreSQL)]
  SVC_A -.publish.-> KAFKA[(Kafka)]
```

## 6.2 Deployment Topology

| Concern | Choice | Source |
|---------|--------|--------|
| Container | Docker | CLAUDE.md default |
| Orchestrator | Kubernetes (Helm) | CLAUDE.md default |
| Replicas | [N min / M max] | [SDD §17.X Deployment Strategy] |

## 6.3 Runtime Stack

| Layer | Technology | Version | Source |
|-------|-----------|---------|--------|
| Language | Java | 21 | CLAUDE.md |
| Framework | Spring Boot | 3.5+ | CLAUDE.md |
| Database | PostgreSQL | 17+ | CLAUDE.md |
| Broker | Kafka | [version] | CLAUDE.md |
| Auth | Keycloak | [version] | CLAUDE.md |
| Migrations | Flyway | [version] | CLAUDE.md |

## 6.4 Architectural Style — As Operationalised

[Concrete operationalisation of the SDD §8.1 style.]

---

# 7. Per-Service Implementation

> **Note:** in COMBINED mode, each service spec is a `### 7.X` block in this document. In CHUNKS mode, each service is its own file at `04-implementation/<service-slug>.md`. Use the chunked-template detail (`chunks/04-implementation-template.md`) as the structure for each service block below — the structure does not change.

## 7.1 [Service Name 1]

> **Owns use cases (SDD 09):** [[KEY]/UC-01](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]), [[KEY]/UC-02](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-02-[title-slug]) [or: None - what it serves / Not applicable - no source BRD]
>
> **Participates in:** [KEY]/UC-03 (owner: [service]) [or: None]

### Responsibility

### Class & Interface Map
- Controllers, Services, ServiceImpls, Repositories, Domain types (records), Method signatures
- Every entry point a use-case traceability line names (REST method, event listener, scheduled job) carries `@UseCase("[KEY]/UC-NN")` with that use case's keyed ID (§12.8). Platform endpoints carry none.

### Method-Level Pseudocode (non-trivial logic only)

### Design Patterns Applied
For each applied pattern: name, triggering CLAUDE.md rule, roles, rationale, Mermaid class diagram, pseudocode skeleton.

### Dependency Injection Graph

### Transaction Boundaries

### Error Handling
RFC 9457 mapping per exception.

### Use-Case Workflows
One subsection per active use case this service owns (SDD §7.3 Owner), headed with the SDD's BRD key and the BRD's ID and title exactly. A merged or removed use case gets no block. Each workflow has: the traceability line, control flow, sequence diagram (Mermaid), idempotency points, outbox emission points, retry/timeout choices.

<!--
TRACEABILITY LINE (required, directly under the heading; rules: sdd-to-lld.md § Use-case traceability). Fields in this order, read from their homes, never restated further:
  BRD: the use case link (BRD heading anchor, built from the real heading). SDD: the §7.3 link, the same in every block.
  Owner and Entry points: exactly as SDD §7.3 writes them (method + path, or Schedule: / Event: triggers, with the service named when it is not the owner).
  UAT/BAT: every non-retired BRD chunk 16 case whose Related UC names this use case, one by one, each linked to its feature-area heading; "Pending (BRD 16 not written)" while chunk 16 is locked; "None - BRD coverage gap" when chunk 16 has none.
  Screens: from §17.3, the screen ID (else the MK-NN, linked to 14-todo.md#mockup-coverage) and each route that starts the use case; "Not applicable - no UI" when §17 is omitted; "> Confirm: no screen ID or MK-NN in the BRD for [KEY]/UC-NN" when the BRD has neither.
Every BRD ID carries the key from the SDD's Source BRDs register. Paths start with ./ (this file sits next to the BRD and SDD folders); links to workflow blocks are same-file anchors.
No source BRD, or pure from-code: heading "#### Workflow: [Flow name]" and the line "> **Traceability:** Not applicable - no source BRD" (or "- no source SDD"). Never a made-up UC ID.
-->

#### [KEY]/UC-01: [Use case title, exactly as the BRD writes it]

> **Traceability:** BRD [[KEY]/UC-01](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) · SDD [§7.3](./sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) · Owner: [service-name] · Entry points: `[METHOD] /v1/[path]` · UAT/BAT: [[KEY]/TC-[AREA]-01](./brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]), [[KEY]/TC-[AREA]-02](./brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) · Screens: [[KEY]/SCR-NN](./brd-[brd-slug]/11-summary-and-uiux.md#[screens-heading-slug]) via `/[route]`

**Trigger:** [The entry point above and its handler, e.g. `FooController.create` with `@UseCase("[KEY]/UC-01")` / Kafka listener / Scheduled task]

**Control flow:**

```text
1. [Step] ([KEY]/UC-01 step 1)
2. [Step] ([KEY]/UC-01 step 3)
3. [Step: outbox emission point, emits foo.created]
4. [Idempotency check: ...]
5. [Step] ([KEY]/UC-01 E1: the exception flow this branch realises)
```

**Sequence diagram:**

```mermaid
sequenceDiagram
  participant Client
  participant Controller as FooController
  participant Service as FooServiceImpl
  Note over Client,Controller: [KEY]/UC-01 step 1
  Client->>Controller: POST /v1/foo (Idempotency-Key: K)
  Controller->>Service: create(cmd, K)
  Service-->>Controller: FooResponse
  Controller-->>Client: 201 Created
```

**Idempotency points / Outbox emission points / Retry and timeout policy:** [As in `chunks/04-implementation-template.md` § 7.8]

**Error handling:** [Validation → 400 + FooValidationException; [KEY]/UC-01 E1 → 409 + FooConflictException; DB failure → 500 + retry-after header]

#### [KEY]/UC-02: [Use case title, exactly as the BRD writes it]

<!-- Repeat the structure, traceability line included, for each active use case this service owns. -->

#### Participates in [KEY]/UC-03: [Use case title, exactly as the BRD writes it]

<!-- Only when this service realises part of a use case another service owns (a saga step, an event consumer). Never a second UC block: the owner's block holds the traceability line. -->

> **Owner's block:** [[owner-service] § [KEY]/UC-03](#[key-lowercase]uc-03-[title-slug]) · Part realised here: [[KEY]/UC-03 step N / A1 / E1] · Entry points here: [`Event: [EVENT_NAME]` as SDD §7.3 names it / None]

**Control flow:** [This service's steps only, each citing the part of the use case it realises.]

## 7.2 [Service Name 2]

[Repeat block.]

---

# 8. Data Model

## 8.1 ERD

```mermaid
erDiagram
```

## 8.2 Tables (per service schema)

## 8.3 Indexes

## 8.4 Multi-Tenancy Strategy

## 8.5 Migration Plan (Flyway)

## 8.6 Retention & Archival

## 8.7 Encryption

# 9. API Contracts

## 9.1 Endpoint Inventory

## 9.2 Request / Response Shapes

> **Source:** from an SDD, each endpoint links its SDD §15 `API-NN` contract and adds only the implementation delta; the full shape is written here only from code with no SDD, or for an endpoint the SDD does not define (flagged).

## 9.3 Authentication & Authorisation

## 9.4 Pagination, Sorting, Filtering

## 9.5 OpenAPI Snippets

# 10. Event Contracts

## 10.1 Topic Inventory

## 10.2 Event Schemas

> **Source:** from an SDD, each event links its SDD §14.9 payload contract and adds only the implementation delta; names match SDD §14 verbatim. The full schema is written here only from code with no SDD, or for an event the SDD does not define (flagged).

## 10.3 Producer Specs

## 10.4 Consumer Specs

## 10.5 DLQ Strategy

# 11. State Machines & Business Rules

## 11.1 Aggregate State Machines

## 11.2 Cross-Service Business Rules

## 11.3 Algorithm Pseudocode (non-trivial)

# 12. Cross-Cutting Concerns

## 12.1 Authentication & Tenant Resolution

## 12.2 Idempotency

## 12.3 Resilience (Resilience4j defaults)

## 12.4 Outbox Pattern

## 12.5 Saga Pattern

## 12.6 Error Model (RFC 9457)

## 12.7 Logging

| Concern | Choice |
|---------|--------|
| Mandatory fields | `ts`, `level`, `service`, `traceId`, `spanId`, `tenantId` (never PII), `event`, `attrs` |
| Use-case field | `use_case`: the keyed BRD use case ID(s) of the entry point handling the request (`REFUNDS/UC-04`), from the log MDC (§12.8). Absent on platform endpoints. |
| Level for tenant context | DEBUG (never INFO per CLAUDE.md) |
| Level for `use_case` | Any level, INFO included: a use case ID is not tenant data or PII |

## 12.8 Tracing

### Use-case attribute

<!-- Derive-from-SDD with a brd-unifier BRD only (sdd-to-lld.md § Use-case traceability). With no source BRD, write "Not applicable - no source BRD." Flag the convention "> Confirm:" unless SDD §11.4 Observability or a 13x Observability section already settles it. -->

| Concern | Choice | Source |
|---------|--------|--------|
| Attribute | `use_case` on the server or consumer span of every entry point SDD §7.3 lists for an in-scope use case, and the same key in the log MDC | [LLD convention / SDD §11.4] |
| Value | The use case ID as §7.3 writes it, with its BRD key (`REFUNDS/UC-04`). An entry point §7.3 lists under several use cases carries all of them in one string, in §7.3 order, joined by commas without spaces (`REFUNDS/UC-02,REFUNDS/UC-04`) | SDD §7.3 |
| Lookup | Match one use case as a whole comma-delimited token, e.g. regex `(^\|,)REFUNDS/UC-04(,\|$)`; never equality (misses shared entry points) or a substring (`UC-01` would match `UC-010`) | LLD convention |
| Set by | A project annotation, `@UseCase("[KEY]/UC-NN")`, on the controller method, listener, or scheduled method; one aspect puts the value into the SLF4J MDC and onto the current span (OpenTelemetry `Span.current().setAttribute`), and clears the MDC afterwards | LLD convention |
| Not set | Platform endpoints (health, actuator, sign-in) | LLD convention |
| Frontend | `screen` and `use_case` from the active route's data on every error report and RUM span (§17.3); `use_case` joins the route's `useCases` in the Value form | LLD convention |

> Confirm: `use_case` is an LLD convention; the SDD does not settle a use case attribute (drop this flag when SDD §11.4 or a 13x Observability section names one).

## 12.9 Configuration

## 12.10 Health & Readiness

# 13. Operations

## 13.1 Configuration (per service)

## 13.2 Health & Readiness

## 13.3 Metrics (RED)

## 13.4 Logs

> **Triage by use case:** filter logs on `use_case` matching the whole token `(^|,)[KEY]/UC-NN(,|$)` to see every request of one use case (equality misses entry points shared by several use cases; §12.8); the use case's row in §19.9 leads to its workflow, BRD use case, and test cases.

## 13.5 Tracing

- Entry-point spans (controller, listener, scheduled job) of a BRD use case carry `use_case` (§12.8), so a trace search by use case finds every request of it.

## 13.6 Dashboards

## 13.7 Alerts

## 13.8 Runbook Procedures

## 13.9 On-Call

# 14. Security

## 14.1 Data Classification

## 14.2 PII Inventory

## 14.3 Secrets Management

## 14.4 Authentication / Authorisation Decisions

## 14.5 Threat Notes

## 14.6 Compliance

# 15. Performance

## 15.1 SLOs

## 15.2 Caching Strategy

## 15.3 Hot-Path Indexes

## 15.4 Bulkhead & Concurrency

## 15.5 Peak Scenarios

## 15.6 Load-Test Strategy

# 16. Testing

## 16.1 Test Pyramid

| Tier | Tooling | Scope | Speed target |
|------|---------|-------|--------------|
| End-to-end | Playwright (frontend) + REST harness (backend) | One BRD use case across services, tagged per §16.8 | < 60s each |

## 16.2 Unit Conventions (JUnit 5 + Mockito)

## 16.3 Integration Conventions (Testcontainers)

## 16.4 Contract Tests

## 16.5 Frontend Tests (if applicable)

- End-to-end: Playwright; one spec per BRD use case, named and tagged per §16.8 (with no source BRD: one spec per critical user journey).

## 16.6 Test Data Strategy

## 16.7 CI Gates

## 16.8 E2E Spec Traceability

<!--
Derive-from-SDD with a brd-unifier BRD (sdd-to-lld.md § Use-case traceability). With no source BRD, write "Not applicable - no source BRD."
The home of spec -> use case and spec -> test case. One row per e2e spec: one spec per in-scope BRD use case, named from its key and BRD title.
Use cases and test cases carry the key from the SDD's Source BRDs register and link to their BRD headings (test cases to the chunk 16 feature-area heading that holds them), listed one by one, never as a range.
While BRD chunk 16 is not written (its delivery gate is shut): "Pending (BRD 16 not written)" in the test case column; specs carry use case tags only.
The Not automated line lists every non-retired chunk 16 case of an in-scope use case that no spec covers, with its reason. "None" when every case is automated.
-->

> **Convention:** one spec per BRD use case, named `e2e/[key-lowercase]-uc-NN-[title-slug].spec.ts`. Every test carries its keyed use case and test case IDs as tags: Playwright `test('[TC name]', { tag: ['@[KEY]/UC-NN', '@[KEY]/TC-[AREA]-NN'] }, async ({ page }) => { ... })`; a backend REST harness (JUnit 5) uses `@Tag("[KEY]/UC-NN")` and `@Tag("[KEY]/TC-[AREA]-NN")`. To re-run a failing UAT case or a production regression: `npx playwright test --grep "@[KEY]/TC-[AREA]-NN"`, or the JUnit Platform tag filter (the `groups` parameter of Maven Surefire or Failsafe).

| Spec | Use cases (BRD) | UAT/BAT test cases (BRD) | Parts covered | Runner |
|------|-----------------|--------------------------|---------------|--------|
| `e2e/[key-lowercase]-uc-01-[title-slug].spec.ts` | [[KEY]/UC-01](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | [[KEY]/TC-[AREA]-01](./brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) [or: Pending (BRD 16 not written)] | [step 1-5, A1, E1] | Playwright |

**Not automated:** [[KEY]/TC-NFR-02](./brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-nfr-acceptance-[ids-slug]) ([reason]) [or: None]

# 17. Frontend

> **Conditional section.** Generate only when the project has a UI surface (Angular, React, etc.). Omit entirely otherwise — do not stub.

## 17.1 Module / Component Tree

## 17.2 State Management Boundaries

## 17.3 Routing

<!--
Every route has a row (sdd-to-lld.md § Use-case traceability). This table is the home of route -> screen; a screen's use cases are read from the BRD, never guessed from the route.
  Screen (BRD): the screen ID the route implements, as the BRD defines it (chunk 11 or a use case's UI/UX section), linked to the heading it is defined under; else the MK-NN from BRD chunk 14 Mockup coverage, linked to 14-todo.md#mockup-coverage; else "None - platform page" (sign-in, not found, the shell).
  Use cases (BRD): the use cases the BRD gives that screen, linked to their BRD headings; "None - platform page" for platform pages.
Every BRD ID carries the key from the SDD's Source BRDs register. Every active use case with a screen the actor sees has at least one route; a use case with neither a screen ID nor an MK-NN gets "> Confirm: no screen ID or MK-NN in the BRD for [KEY]/UC-NN".
Route paths and components are this LLD's design choice (from-sdd: "> Confirm:"). With no source BRD, the two BRD columns read "Not applicable - no source BRD".
-->

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
|-------|-----------|--------------|-----------------|--------|--------------|
| `/foo` | `FooListComponent` | [[KEY]/SCR-01](./brd-[brd-slug]/11-summary-and-uiux.md#[screens-heading-slug]) | [[KEY]/UC-01](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | `authGuard` | Yes (`loadComponent`) |
| `/foo/:id` | `FooDetailComponent` | [[KEY]/MK-02](./brd-[brd-slug]/14-todo.md#mockup-coverage) | [[KEY]/UC-02](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-02-[title-slug]) | `authGuard`, `tenantGuard` | Yes |
| `/login` | `LoginComponent` | None - platform page | None - platform page | - | Yes |

**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case:

```ts
{
  path: 'foo/:id',
  loadComponent: () => import('./foo-detail.component').then(m => m.FooDetailComponent),
  data: { screen: '[KEY]/MK-02', useCases: ['[KEY]/UC-02'] },
}
```

The global `ErrorHandler` and the frontend telemetry read the data of the deepest active route and attach `screen` and `use_case` to every error report and RUM span (§12.8). Platform pages carry no such data.

## 17.4 PrimeNG Components Used

## 17.5 Theming

## 17.6 i18n

## 17.7 Accessibility (WCAG 2.1 AA)

## 17.8 Form Conventions

## 17.9 Component Architecture

# 18. Open Questions & Flag Index

## 18.1 Drift Markers (hybrid only)

## 18.2 Low-Confidence (TODO)

## 18.3 Medium-Confidence (Confirm)

## 18.4 Decisions Pending

## 18.5 Inference Confidence Summary

## 18.6 Policy Findings (every mode that reads code)

# 19. References

## 19.1 Source Documents (BRD, SDD, code repo)

<!-- One row per source BRD, keyed as in the SDD's Source BRDs register. The use-case trace rows record the upstream state the trace was built from, so a later run can see what changed (sdd-to-lld.md § Use-case traceability). -->

| Document | Path / URL | Version / state | Notes |
|----------|------------|-----------------|-------|
| Related BRD ([KEY]) | [[brd-slug]-brd-master.md](./brd-[brd-slug]/[brd-slug]-brd-master.md) | [version] | Key from the SDD's Source BRDs register |
| Related SDD | [[sdd-slug]-sdd-master.md](./sdd-[sdd-slug]/[sdd-slug]-sdd-master.md) | [version] | |
| SDD §7.3 Use Case Traceability | [03-users-and-use-cases.md § 7.3](./sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | SDD v[X.X] | Owners and entry points of the traced use cases |
| [KEY] UAT/BAT test cases (BRD chunk 16) | [16-uat-bat-test-cases.md](./brd-[brd-slug]/16-uat-bat-test-cases.md) [or `Not written`] | [Up to date / Provisional (TD-NN) / Stale / Pending (BRD 16 not written)] | Test case IDs and their `Related UC` |
| [KEY] Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](./brd-[brd-slug]/14-todo.md#mockup-coverage) | [as of BRD v[X.X]] | `MK-NN` and Figma links only |
| Source code repo | [URL] | [commit / branch] | (from-code / hybrid) |

## 19.2 Architectural Decision Records

## 19.3 OpenAPI Specifications

## 19.4 Event Schemas

## 19.5 Runbooks

## 19.6 Threat Model

## 19.7 External References

## 19.8 Related LLDs

## 19.9 Use-Case Traceability Index

<!--
The production-bug entry point: a consolidated view, never a home (sdd-to-lld.md § Use-case traceability). One row per SDD §7.3 row, in the same order and BRD groups (repeat §7.3's group rows), merged and removed use cases included. Each column is read from its home and never states a mapping its home does not state:
  Use case (BRD), Title, Status: SDD §7.3 (the BRD's ID and title, with the SDD's key).
  SDD §7.3: the §7.3 heading link.
  LLD workflow: the #### [KEY]/UC-NN heading in the owner's §7 block (a same-file anchor), labelled with the owner; "Not in this LLD - owner: [service]" when the owner is out of scope (linked to its LLD when the SDD's Child LLDs table names one); "Not built yet - [service]", linked to its placeholder, when the owner has no code yet.
  Screens (BRD), Routes (LLD): §17.3; "Not applicable - no UI" when §17 is omitted.
  UAT/BAT test cases (BRD): BRD chunk 16, one by one, never a range; "Pending (BRD 16 not written)" while it is locked.
  E2E specs (LLD): §16.8.
Merged and removed rows show "-" in every mapping column. Checked both ways: every §7.3 row has a row here, and every cell here equals its home.
With no source BRD, write "Not applicable - no source BRD."
-->

> **Start here for a production bug.** Take the `use_case` and `screen` from the error report, log line, or span (§12.7-12.8), or search this table for the route, screen, or test case. The row links to the workflow block, the BRD use case, the SDD §7.3 row, the test cases, and the spec.

| Use case (BRD) | Title | SDD §7.3 | LLD workflow | Screens (BRD) | Routes (LLD) | UAT/BAT test cases (BRD) | E2E specs (LLD) | Status |
|----------------|-------|----------|--------------|---------------|--------------|--------------------------|-----------------|--------|
| **[[BRD project name] v[X.X]](./brd-[brd-slug]/[brd-slug]-brd-master.md) ([KEY])** | | | | | | | | |
| [[KEY]/UC-01](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | [Title, as in the BRD] | [§7.3](./sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [[service-a]](#[key-lowercase]uc-01-[title-slug]) | [[KEY]/SCR-01](./brd-[brd-slug]/11-summary-and-uiux.md#[screens-heading-slug]) | `/foo` | [[KEY]/TC-[AREA]-01](./brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) | `e2e/[key-lowercase]-uc-01-[title-slug].spec.ts` | Active |
| [[KEY]/UC-02](./brd-[brd-slug]/05-user-journeys-overview.md#use-case-summary) | [Title] | [§7.3](./sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | - | - | - | - | - | [Merged into UC-01 / Removed] |
| [[KEY]/UC-03](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-03-[title-slug]) | [Title] | [§7.3](./sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | Not in this LLD - owner: [service-z] ([LLD](./lld-[other-slug]/[other-slug]-lld-master.md)) | - | - | [[KEY]/TC-[AREA]-03](./brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) | - | Active |

---

# 20. Specs

<!--
Constitution-grade summary, owned by lld-unifier and authored AFTER the LLD body. Synthesised from the source SDD: Mission from SDD §1 (2-3 sentences, core idea only), Tech Stack from SDD §6 verbatim with version pins (must equal §6.3 Runtime Stack above - a mismatch is drift to flag), Roadmap from SDD §13 + BRD UC ownership (3-6 delivery phases), Project Type from intake with the LLD direction taken. Direct input for speckit /constitution. Tone: short, precise, declarative. See chunks/17-specs.md for the full skeleton.
-->

## 20.1 Mission

[2-3 sentences. Core idea only.]

## 20.2 Tech Stack

- **Backend:** [Language + framework + version] 
- **Frontend:** [Framework + version] | Not applicable.
- **Mobile:** [Platform + framework] | Not applicable.
- **Data:** [Primary store + version]
- **Messaging:** [Broker] | Not applicable.

## 20.3 Roadmap

| Phase | Scope (one line) | Services / UC IDs |
|-------|------------------|-------------------|
| P1 - [Label] | [Scope] | [services; keyed UC IDs as SDD §7.3 writes them, e.g. [KEY]/UC-01, [KEY]/UC-02] |

## 20.4 Project Type

**Selected:** [Greenfield | Brownfield] — **Justification:** [one line]. **LLD direction taken:** [from-sdd | from-code | hybrid].

---

# 21. Open Items & Clarifications

<!--
Output of the post-generation cleared-context reviewer pass. Captures implementation-level gaps, missing edge cases, pattern misapplications, error path concerns, contract drift vs the SDD's Centralized Event Hub (§14) and User Roles catalogue (§16), Specs-body mismatches, and use-case traceability gaps. Each item carries options.
This section complements (does not replace) §18, which is the author-generated index of inline `> Confirm:` and `> TODO:` flags. §21 captures the external reviewer's adversarial findings.
-->

## 21.1 How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Service name + sub-section, or "global". |
| **Type** | Implementation gap / Missing edge case / Pattern misapplication / Error path / Concurrency hazard / Transaction boundary / Idempotency gap / Multi-tenancy leak / Test gap / Drift / Contract drift (vs SDD §14/§16) / Specs-body mismatch / Duplication (SDD content restated instead of referenced) / Traceability gap (a use case, route, test case, spec, or entry point the trace misses, a link that does not resolve, or a BRD ID without its key) / Missing scenario (behaviour no BRD use case covers; never a new UC). |
| **Concern** | One paragraph. What was missed and why it matters. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommendation** | REQUIRED. The reviewer's suggested option — always pick one, even for close calls. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins — the evidence (CLAUDE.md rule, SDD contract, code fact, risk avoided) and the tradeoff accepted. Never empty. |
| **Status** | Open / Resolved / Deferred. |

## 21.2 Open Items

### OI-01: [Short title]

- **Where:** [Service / sub-section, or "global"]
- **Type:** [Implementation gap | Missing edge case | Pattern misapplication | Error path | Concurrency hazard | Transaction boundary | Idempotency gap | Multi-tenancy leak | Test gap | Drift | Contract drift | Specs-body mismatch | Duplication | Traceability gap | Missing scenario]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] — [one-line tradeoff].
  - **B.** [Option B] — [one-line tradeoff].
- **Recommendation:** [Suggested option letter + the concrete change.]
- **Why:** [The reason this option wins: evidence + tradeoff accepted.]
- **Status:** Open

<!-- Repeat OI block for each open item. -->

## 21.3 Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Service / sub-section] | [Option chosen — short note] |

## 21.4 Reviewer Notes

<!-- The coverage table is required (SKILL.md step 7): one row per risk surface per service. Zero findings is valid for a surface that was checked. -->

| Service | Risk surface | Checked | Findings | What was checked |
|---------|--------------|---------|----------|------------------|
| [service-a] | [Error handling / Transactions / Idempotency / Multi-tenancy / Observability hooks / Test coverage] | [Yes / No] | [OI-NN, … or "No issue found"] | [What the reviewer read and verified] |

- [Note 1]
- [Note 2]
