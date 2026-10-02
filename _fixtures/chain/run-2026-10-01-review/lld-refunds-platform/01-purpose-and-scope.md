<!--
CHUNK: 01
TITLE: Purpose, Scope, Assumptions, Glossary
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 1. Purpose

This LLD turns the Refunds Platform SDD v1.2 into a build target. For the refund-service and loyalty-service modules of the `refunds-platform-core` deployable, the extracted payout-service and notification-service, and the Angular web app, it names the build modules, classes, method signatures, transactions, outbox, inbox and idempotency mechanics, error mappings, and one workflow block per BRD use case, so an AI implementer or a developer can scaffold the code without further design questions. It also carries every REFUNDS and LOYALTY use case from [SDD §7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) down to its workflow, routes and screens, UAT/BAT cases, e2e specs, and the runtime `use_case` attribute, with the production-bug entry point in [16 § 19.9](./16-references.md#199-use-case-traceability-index).

---

# 2. Scope

The solution scope is [SDD §2.1](../sdd-refunds-platform/01-executive-summary-scope-risks.md#21-in-scope) and [SDD §2.2](../sdd-refunds-platform/01-executive-summary-scope-risks.md#22-out-of-scope). This section states only the implementation scope of this LLD.

## 2.1 In Scope

- **refund-service**, module of `refunds-platform-core` (SDD §13 Type `module`): [04-implementation/refund-service.md](./04-implementation/refund-service.md).
- **loyalty-service**, module of `refunds-platform-core` (SDD §13 Type `module`): [04-implementation/loyalty-service.md](./04-implementation/loyalty-service.md).
- **payout-service**, extracted service: [04-implementation/payout-service.md](./04-implementation/payout-service.md).
- **notification-service**, extracted service: [04-implementation/notification-service.md](./04-implementation/notification-service.md).
- **Core infrastructure** shared by the two modules: the durable publication log in schema `core_events` ([SDD §11.1](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default)) and its dispatcher (07 § 10.6, 09 § 12.4).
- **Platform library** `refunds-platform-commons` used by the three backend deployables: outbox relay, inbox, idempotency store, RFC 9457 handler, tenant context, `@UseCase` aspect (09).
- **Angular web app** for customers, members, and branch managers: [14-frontend.md](./14-frontend.md).

## 2.2 Out of Scope

- API gateway (Spring Cloud Gateway) routes, filters, and the receipt-lookup rate limit, and the Keycloak realm configuration: named in SDD §2.1 but not SDD §13 rows, so they get no implementation file; this LLD consumes them as configuration (09 § 12.1, 10 § 13.1).
- Business and solution exclusions of [SDD §2.2](../sdd-refunds-platform/01-executive-summary-scope-risks.md#22-out-of-scope) (member accounts and member sign-in of its own, staff account provisioning, native mobile app, push notifications).
- A cache tier, object storage, and a service mesh ([SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) rows Not applicable).

SDD chunk 19 (end-to-end system design, [SDD §24](../sdd-refunds-platform/19-e2e-system-design.md#24-end-to-end-system-design-services--topics--producers--consumers)) is written since SDD v1.2; this LLD reads it as the system map behind 02 § 5.4 and the two saga views (refund-service § 7.4 Saga, loyalty-service take-back).

> Confirm: the API gateway and Keycloak realm configuration stay out of this LLD's implementation files; if the team wants them designed here, add a `04-implementation/api-gateway.md` and a realm-configuration section in 09.

> **From-sdd note:** scope here is the implementation scope. It may be narrower than the SDD scope if some SDD-described services are not yet being built in this LLD pass.

---

# 3. Assumptions

SDD assumptions are referenced, not restated: [SDD §3](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions). LLD-specific implementation assumptions:

| ID | Assumption | Source | Risk if false |
|----|------------|--------|---------------|
| A-01 | One shared library, `refunds-platform-commons`, implements the outbox relay, inbox, idempotency store, problem-details handler, tenant context, and `@UseCase` aspect for all three backend deployables, versioned with the platform. | Inferred from [SDD §14.2](../sdd-refunds-platform/10-events-hub.md#142-hub-topology-decision) ("one messaging library / pattern") | Each deployable re-implements delivery semantics and they drift. |
| A-02 | Persistence uses Spring Data JPA on Hibernate 6, with Hibernate's `@TenantId` column discriminator on every tenant table. | Inferred (SDD §6 names Spring Boot, not the persistence API) | Repository and tenant-filter code changes shape (JDBC template or jOOQ). |
| A-03 | PostgreSQL row-level security reads the tenant from the transaction-local setting `app.tenant_id`, set by `TenantContext` at the start of every transaction. | Inferred from [SDD §11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default) | RLS policies need a different key source. |
| A-04 | Every background job that must run once per deployable (outbox relays, publication-log replay, payout watchdog, purchase import, retention and purge jobs) takes a PostgreSQL advisory lock; no scheduler-lock library is added. | Inferred; CLAUDE.md (no new dependency without asking) | Two replicas run the same job and double work or break per-key order. |
| A-05 | The payout retry window of [SDD §17.2 Constraints](../sdd-refunds-platform/13b-service-payout.md#constraints) is configuration in payout-service and in refund-service (payout watchdog), and both deployables carry the same value; the post-window retry interval is payout-service configuration only. | Inferred from SDD §17.1 Payout watchdog | The watchdog flags payouts too early or too late. |
| A-06 | The tenant settings of [SDD §11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default) are read at start from Helm values into an immutable `TenantSettingsRegistry` in the core, payout-service, and notification-service. | SDD §11.2 | A new tenant or a changed retention setting needs a restart (accepted by SDD §11.5). |
| A-07 | The web app reads its tenant's branding and locale from a per-host `tenant-config.json` served by the web container from Helm values. | Inferred from SDD §11.2 and CLAUDE.md multi-tenant theming | The web app needs a config endpoint on the core instead. |

---

# 4. Glossary

Business and SDD terms are defined upstream and not restated: [SDD §5](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary) (which links both BRD glossaries). LLD-specific implementation terms:

| Term | Definition | Source |
|------|------------|--------|
| `@UseCase` | Project annotation on an entry point that carries its keyed BRD use case ID; an aspect copies it into the MDC and the span (09 § 12.8). | New in LLD |
| `CallerContext` | Record built from the validated JWT: tenant, subject, roles, permission tokens, `branch_id`, `member_id`, `email`, `phone_number`. | New in LLD |
| `TenantContext` | Thread-bound tenant holder that also sets `app.tenant_id` for row-level security at transaction start. | New in LLD |
| `EventEnvelope<T>` | Record mirroring the [SDD §14.3](../sdd-refunds-platform/10-events-hub.md#143-standard-event-envelope-every-event-every-topic) envelope, generic over the payload record. | New in LLD |
| `OutboxRelay` | The commons publisher that reads committed outbox rows and marks them published only after the broker acknowledges (09 § 12.4). | New in LLD |
| `InboxDeduplicator` | The commons component that inserts `(tenant_id, consumer, event_id)` in the consumer's transaction and reports a duplicate. | New in LLD |
| `IdempotencyStore` | The commons component behind the `Idempotency-Key` header: `(tenant_id, caller_subject, idempotency_key)` with the cached response (09 § 12.2). | New in LLD |
| `DurableEventPublisher` | Core eventing infrastructure that records an in-process domain event in `core_events.event_publication` in the publisher's transaction and dispatches it after commit (07 § 10.6). | New in LLD |
| Worker role | The database role background jobs use; its RLS policy lets it select due rows of its own work table across tenants (SDD §11.2). | SDD §11.2, named here |
| Advisory lock | A PostgreSQL session or transaction lock keyed by a job name, used to keep one active instance of a job. | New in LLD |
| Receipt lock | The transaction-scoped advisory lock on `tenant_id` and receipt number that serialises the `RefundPaid` listener, the purchase import, and the member erasure job on one purchase (SDD §17.4 Take points back; `ReceiptLock`, loyalty-service § 7.2). | New in LLD (names the SDD §17.4 lock) |
| Operations job | A one-off job run by operations under the SDD §20.3 break-glass rule (`refund-contact-erasure`, `loyalty-member-erasure`; RB-08). | SDD §17.1, §17.4, named here |
| Class suffixes | `*Controller` (REST adapter), `*Service` / `*ServiceImpl` (application service), `*Repository` (Spring Data), `*Port` (outbound port), `*Adapter` (port implementation), `*Listener` (event consumer), `*Job` / `*Worker` (scheduled). | CLAUDE.md naming, extended |
| Default transaction policy | `@Transactional` with `REQUIRED` propagation and `READ_COMMITTED` isolation unless 04 § 7.6 says otherwise. | CLAUDE.md, `sdd-to-lld.md` |

> **Convention:** from an SDD, link its glossary ([SDD §5](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary)) instead of copying it, and add rows only for LLD-specific implementation terms (pattern names, class-suffix conventions, transaction-policy names). From code with no SDD, define every term here.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->
