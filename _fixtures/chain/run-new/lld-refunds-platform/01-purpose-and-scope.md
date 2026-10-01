<!--
CHUNK: 01
TITLE: Purpose, Scope, Assumptions, Glossary
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 1. Purpose

This LLD turns the Refunds Platform SDD v1.0 ([executive summary](../sdd-refunds-platform/01-executive-summary-scope-risks.md#1-executive-summary)) into a build target. It gives an implementer, human or AI, the class and port maps, method pseudocode, transaction and idempotency boundaries, Flyway DDL, event and API implementation detail, and Angular route design needed to scaffold `refunds-platform-core` (refund-service and loyalty-service modules), payout-service, notification-service, and the web app without re-deriving decisions the SDD already settled. It also carries every REFUNDS and LOYALTY use case from SDD §7.3 down to its workflow block, the routes and screens that start it, the UAT/BAT cases that accept it, the e2e spec that automates them, and the `use_case` attribute that names it at runtime, so a production bug on a page or a failing UAT case leads back to its requirement in a few clicks.

---

# 2. Scope

Solution scope is owned by the SDD and is not restated: [SDD §2.1 In Scope](../sdd-refunds-platform/01-executive-summary-scope-risks.md#21-in-scope) and [SDD §2.2 Out of Scope](../sdd-refunds-platform/01-executive-summary-scope-risks.md#22-out-of-scope). Implementation delta below.

## 2.1 In Scope

- All four SDD §13 services: refund-service and loyalty-service (modules of the core deployable `refunds-platform-core`), payout-service, and notification-service ([SDD §13](../sdd-refunds-platform/09-services-summary.md#13-services-decomposition-summary)).
- The Angular web app (customer, member, and branch manager areas) and its routes (`14-frontend.md`).
- The platform kernel library shared by the three deployables: tenant and caller context, idempotency executor, outbox relay, inbox, Problem Details translation, `@UseCase` observation, UUIDv7 generation.
- Flyway migrations for schemas `refund` and `loyalty` (core database) and databases `payout` and `notification`.
- The configuration keys each deployable reads from its Helm values, and the API gateway routes and limits this LLD depends on (the gateway product itself is not pinned, SDD §6).

## 2.2 Out of Scope

- Everything the SDD puts out of scope (link above), including native mobile apps, a staff administration UI, loyalty enrollment, and a BI store.
- The SDD's chunk 19 (end-to-end system design): Locked in the SDD (e2e gate shut); this LLD does not wait for it.
- Provider-side behaviour of CardPay, MsgHub, POS Records, and the Keycloak Admin API beyond our adapters: all six provider contracts are `TBD - external` ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)).
- CI/CD pipeline definitions, Helm chart templates, and cluster sizing (SDD §6 and §11.3 leave the products and sizes open).

> **From-sdd note:** scope here is the implementation scope. It equals the SDD scope: every §13 service and the web app are covered by this one LLD.

---

# 3. Assumptions

SDD assumptions A-1 to A-9 are referenced, not restated: [SDD §3](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions). LLD-specific implementation assumptions:

| ID | Assumption | Source | Risk if false |
|----|------------|--------|---------------|
| A-L01 | One Git repository with a Maven multi-module build: `refunds-platform-kernel` (library), `refunds-platform-core`, `payout-service`, `notification-service`, plus the `web-app` Angular workspace. Each deployable still has its own image, chart, and pipeline. | Inferred (SDD §6 leaves CI/CD and build tool open) | Separate repositories need the kernel published to an artifact repository and versioned per consumer. |
| A-L02 | Persistence uses Spring JDBC (`JdbcClient`) with explicit SQL and a tenant predicate on every statement, not JPA. | LLD choice (composite tenant-first keys, see `05-data-model.md` § 8.4) | A JPA preference means re-mapping composite keys with `@IdClass`; the port interfaces stay the same. |
| A-L03 | Tenant configuration (tenant ids, `tenant_ref` alias, IANA time zone, partner keys, locale, branding) is static per environment in Helm values; tenant secrets come from the secrets manager. | SDD §11.5 (Helm values are the source of truth) + inferred | A second retailer onboarded at runtime needs a tenant-configuration service. |
| A-L04 | The root Java package is `<base-package>`, chosen by the team; this LLD writes packages relative to it. | Not in SDD | None beyond naming. |
| A-L05 | UUIDv7 values come from an in-house `UuidV7Generator` in the kernel (RFC 9562 layout), so no new dependency is added. | CLAUDE.md (no new dependency without asking) | A library can replace it after approval; callers depend only on `IdGenerator`. |
| A-L06 | The payout retry window is a configuration value whose production value is the one ADR-10 sets; lower environments may shorten it so automated tests can reach the window end. | ADR-10 is the home of the value; test need from REFUNDS/TC-DEC-04 | If the window must never differ per environment, REFUNDS/TC-DEC-04 stays a manual UAT case. |

> Confirm: A-L01 to A-L03 and A-L06 are implementation choices the SDD does not settle; verify repository layout, persistence technology, tenant-configuration source, and per-environment retry window with the team.

---

# 4. Glossary

Business and SDD terms are referenced, not restated: [SDD §5](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary) (which links the REFUNDS and LOYALTY glossaries). LLD-specific terms:

| Term | Definition | Source |
|------|------------|--------|
| Platform kernel | The `refunds-platform-kernel` library: tenancy, caller context, idempotency, outbox, inbox, Problem Details, `@UseCase`, IDs. | New in LLD |
| `CallerContext` | Record built from the verified JWT: `tenantId`, `subject`, permission tokens, `branchId`, `memberId`, `correlationId`. | New in LLD |
| `TenantScopedJdbcRepository` | Base class of every JDBC adapter; every statement takes the tenant id and filters on it. | New in LLD |
| Idempotency executor | `IdempotentCommandExecutor`: runs a write command under the SDD §11.1 idempotency-record rules. | New in LLD |
| Outbox relay cycle | One poll of `outbox_event` under a transaction-level PostgreSQL advisory lock, per tenant, in `seq` order. | New in LLD (SDD §11.3 rule) |
| Attempt lease | The `next_attempt_at` value of an in-flight payout or message; when it passes with no recorded outcome, the attempt is in doubt. | SDD §17.2 (lease), LLD naming |
| Keyed ID | A BRD ID prefixed with its BRD key from the SDD's Source BRDs register (`REFUNDS/UC-04`, `LOYALTY/LP-02`). | SDD § Document Lineage |
| `use_case` attribute | Span attribute and log MDC key carrying the keyed use case ID of the entry point handling a request (`09-cross-cutting.md` § 12.8). | New in LLD |
| SAGA-01 | The choreographed refund decision, payout, message, and points take-back chain (`04-implementation/refund-service.md` § Cross-service Saga). | New in LLD (ADR-05) |
| `*Dto` / `*Response` / `*Command` | Record suffixes: inbound web body, outbound web body, application-layer command. | CLAUDE.md naming |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->
