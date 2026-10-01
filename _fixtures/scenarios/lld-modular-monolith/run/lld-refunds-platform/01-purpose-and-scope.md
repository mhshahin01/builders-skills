<!--
CHUNK: 01
TITLE: Purpose, Scope, Assumptions, Glossary
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 1. Purpose

This LLD turns the Refunds Platform SDD v1.1 (a modular monolith, ADR-01) into a build target. For each of the four modules of the one deployable (`refund`, `payout`, `notification`, `loyalty`) it names the packages, classes, ports, adapters, method signatures, transaction boundaries, error mappings, and pseudocode an implementer (human or AI) needs to scaffold the Java 21 / Spring Boot backend and the Angular web app without further design questions, and it carries every BRD use case (REFUNDS, LOYALTY) from SDD §7.3 down to its workflow block, routes and screens, UAT/BAT test cases, e2e specs, and runtime `use_case` attribute.

---

# 2. Scope

Design scope: [SDD §2](../sdd-refunds-platform/01-executive-summary-scope-risks.md#2-scope). This LLD narrows it to the implementation units below.

## 2.1 In Scope

- `refund` module (SDD §13, Type `module`): [04-implementation/refund.md](./04-implementation/refund.md).
- `payout` module (SDD §13, Type `module`): [04-implementation/payout.md](./04-implementation/payout.md).
- `notification` module (SDD §13, Type `module`): [04-implementation/notification.md](./04-implementation/notification.md).
- `loyalty` module (SDD §13, Type `module`): [04-implementation/loyalty.md](./04-implementation/loyalty.md).
- Platform components shared inside the deployable (no module owns them): call context and tenant resolution, the row-level security hook, the `@UseCase` aspect, the idempotency component, the Problem Details advice, the event publication log in schema `platform`, and the single-replica job lock (chunk 09).
- The Angular web app routes for the customer, branch manager, and member screens (chunk 14).

## 2.2 Out of Scope

- The SDD exclusions: [SDD §2.2](../sdd-refunds-platform/01-executive-summary-scope-risks.md#22-out-of-scope).
- Keycloak realm configuration, API gateway configuration, Helm chart values, and CI pipeline definitions: referenced, not designed here.
- The transport of the POS member purchase intake (push API, pull API, or daily file): open in SDD §12 INT-03 (b); only the inbound port is designed (chunk 04, loyalty).
- Extraction of a module into its own service (ADR-01 trigger) and the Kafka outbox that would come with it.

> **From-sdd note:** scope here is the implementation scope. All four SDD §13 modules are in scope, so it equals the SDD scope.

---

# 3. Assumptions

Design assumptions: [SDD §3](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions). LLD-specific implementation assumptions:

| ID | Assumption | Source | Risk if false |
|----|------------|--------|---------------|
| A-01 | Spring Modulith's JDBC event publication registry realises the §14.10 publication log, configured to schema `platform`. | SDD §6 Backend Runtime row, ADR-02 | A custom publication table and re-delivery job are needed. |
| A-02 | Requests run on Spring MVC servlet threads, so a request-scoped `CallContext` holder carries principal and tenant; listeners and jobs set it explicitly. | Inferred (CLAUDE.md Spring Boot default) | Async work loses the tenant unless the context is copied. |
| A-03 | Dispatchers claim rows with a short lease and call the provider outside the claim transaction. | LLD design (SDD §8.1.3 row claims) | A lease shorter than the provider call re-sends the row; the provider idempotency key absorbs it. |
| A-04 | No library beyond SDD §6 and the CLAUDE.md defaults (Resilience4j, Flyway, Testcontainers) is added; single-replica jobs use a PostgreSQL advisory lock. | CLAUDE.md (no new dependencies without asking) | Hand-written lock code to test. |
| A-05 | Every module table follows the SDD §11.1 auditing columns, even where the SDD table list omits them. | SDD §11.1 | Schema drift between the SDD tables and the migrations. |

---

# 4. Glossary

Design glossary: [SDD §5](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary) (which links both BRD glossaries). LLD-specific terms:

| Term | Definition | Source |
|------|------------|--------|
| `CallContext` | Record carrying the principal (subject, roles, `branch_id`, `member_id`), `tenantId`, and `correlationId`; set by the inbound adapter, a listener, or a job, read by ports and repositories. | New in LLD |
| `@UseCase` | Project annotation on an entry point carrying its keyed BRD use case IDs; an aspect copies the value to the log MDC and the span (chunk 09 § 12.8). | New in LLD |
| `ServiceException` | Base class of every business exception; carries `errorCode` (SDD §15.1) and the HTTP status. | CLAUDE.md |
| Dispatch lease | `next_attempt_at` pushed forward at claim time so other replicas skip an in-flight dispatch row. | New in LLD |
| Event publication registry | Spring Modulith's store of in-process event publications (the SDD event publication log). | SDD §5 (Event publication log) |
| `*Controller`, `*Service`, `*ServiceImpl`, `*Repository`, `*Port`, `*Adapter`, `*Listener`, `*Job` | Class-suffix conventions: REST adapter, use-case interface, its implementation, persistence, hexagonal port, port implementation, in-process event listener, scheduled job. | CLAUDE.md naming |
| `MANDATORY` propagation | Spring transaction propagation that joins the caller's transaction or fails; used by the API-01 adapter so a payout instruction never commits alone. | New in LLD |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->
