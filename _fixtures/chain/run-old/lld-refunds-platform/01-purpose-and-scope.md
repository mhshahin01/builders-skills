<!--
CHUNK: 01
TITLE: Purpose, Scope, Assumptions, Glossary
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 1. Purpose

This LLD lets a developer or an AI implementer scaffold and build the Refunds Platform without going back to the architect: the three deployables (`refunds-platform-core` with the refund-service and loyalty-service modules, payout-service, notification-service) and the Angular web app, down to class and method signatures, transaction boundaries, Flyway migrations, outbox and inbox mechanics, error codes, and per-use-case control flow. It operationalises the settled design of the [Refunds Platform SDD v1.0](../sdd-refunds-platform/refunds-platform-sdd-master.md); the SDD stays the home of every design decision, contract name, and target, and this document adds only the implementation delta.

---

# 2. Scope

## 2.1 In Scope

Solution scope is owned by the SDD and is not restated: [SDD §2.1 In Scope](../sdd-refunds-platform/01-executive-summary-scope-risks.md#21-in-scope). This LLD covers all of it, as these implementation units:

- refund-service module of `refunds-platform-core`: [04-implementation/refund-service.md](./04-implementation/refund-service.md).
- loyalty-service module of `refunds-platform-core`: [04-implementation/loyalty-service.md](./04-implementation/loyalty-service.md).
- payout-service deployable: [04-implementation/payout-service.md](./04-implementation/payout-service.md).
- notification-service deployable: [04-implementation/notification-service.md](./04-implementation/notification-service.md).
- The Angular web app (customer, member, and branch manager areas): [14-frontend.md](./14-frontend.md).
- The shared platform components every deployable uses (tenant and caller context, permission map, idempotency records, outbox relay, inbox guard, Problem Details): [09-cross-cutting.md](./09-cross-cutting.md).
- Flyway migrations for the schemas `refund` and `loyalty` and the databases `payout` and `notification`: [05-data-model.md](./05-data-model.md).
- The Keycloak realm import and the per-module permission maps that seed SDD §16.12: [11-security.md](./11-security.md) § 14.4.
- The API gateway route and rate-limit requirements (user route and ADR-11 partner route), stated as requirements on the gateway product: [09-cross-cutting.md](./09-cross-cutting.md) § 12.1.

## 2.2 Out of Scope

Solution-level exclusions are owned by the SDD: [SDD §2.2 Out of Scope](../sdd-refunds-platform/01-executive-summary-scope-risks.md#22-out-of-scope). Implementation-level exclusions of this LLD:

- Installing and operating Kafka, Keycloak, the API gateway, the schema registry, and PostgreSQL: products and versions are open in SDD §6, so this LLD specifies only what the code needs from them.
- Provider-owned contract fields of API-01 to API-06: they stay `TBD - external` in [SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user); adapters are built against stubs until the SDD is updated.
- CI/CD pipeline definitions and Helm chart templates: the platform is open in SDD §6; this LLD lists the configuration keys and gates only.
- The e2e system view (SDD chunk 19): locked in the SDD (e2e gate E3 not met); this LLD derives its dependency view from SDD §8 and §14 instead.

> **From-sdd note:** the implementation scope equals the SDD scope; no SDD service is deferred in this LLD pass.

> **Hybrid note:** not applicable (from-sdd).

---

# 3. Assumptions

Design assumptions A-1 to A-9 are owned by the SDD and are not restated: [SDD §3 Assumptions](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions). LLD-specific implementation assumptions:

| ID | Assumption | Source | Risk if false |
|----|------------|--------|---------------|
| LA-01 | Tenant configuration (tenant id, `tenant_ref` alias, IANA zone id, default locale, partner keys, provider credential references) is delivered per environment as mounted configuration from the Helm values, the SDD's configuration source of truth. | inferred from SDD §11.5 and §11.4 (no service owns tenant configuration) | A tenant-configuration service or API is needed; `TenantSettingsPort` gets a remote adapter. |
| LA-02 | The Keycloak `member_id` claim carries the loyalty member number, the same value POS Records sends with a member purchase (API-06). | inferred from SDD A-5 and §17.4 | Member resolution in loyalty-service changes from `member_number` to a stored link (A-5 is open). |
| LA-03 | The three deployables share an internal platform library for the cross-cutting components of 09, versioned and released independently of each deployable. | inferred from SDD ADR-01 and CLAUDE.md "no shared release trains" | Each deployable copies the components; drift between copies becomes a review item. |
| LA-04 | Provider adapters can be built and tested against stubs that honour the SDD our-side policy (same idempotency key on every CardPay attempt, signature verification on partner calls) before the provider documentation arrives. | SDD §15.6, §19 (Dev and SIT use stubs) | Adapter rework once API-01 to API-06 are documented. |
| LA-05 | The web app is served on one hostname per tenant, so tenant branding can be loaded before sign-in. | inferred from CLAUDE.md multi-tenant theming; SDD §6 Frontend Stack | Branding can only load after sign-in (from the `tenant_id` claim). |

> Confirm: LA-01, LA-03, and LA-05 are LLD inferences the SDD does not state; confirm the tenant-configuration home, the shared platform library, and the per-tenant hostname with the architect.

> TODO: LA-02 best guess: the `member_id` claim is the loyalty member number (SDD A-5 is open) - verify with the A-5 owner before loyalty-service is built.

---

# 4. Glossary

Business and design terms are owned upstream and are not restated: [SDD §5 Glossary](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary), which links the REFUNDS and LOYALTY BRD glossaries. LLD-specific implementation terms:

| Term | Definition | Source |
|------|------------|--------|
| `CallerContext` | Record built once per request from the verified JWT: `tenantId`, `subject`, `branchId`, `memberNumber`, and the permission tokens mapped from the realm roles. | new in LLD |
| `TenantScopedId` | Composite primary key (`tenant_id`, `id`) used by every table, so a lookup by id is tenant-scoped by construction. | new in LLD |
| `IdempotencyScope` | The key of an `idempotency_record`: (`tenant_id`, `subject`, `operation`, `idempotency_key`), per SDD §11.1. | new in LLD |
| Inbox guard | The first statement of every consumer transaction: insert into `inbox_event`, and skip the event if the row already exists. | new in LLD |
| Outbox relay | The single active publisher per database; holds a PostgreSQL session advisory lock and publishes `outbox_event` rows in `seq` order. | new in LLD (SDD §11.3) |
| Attempt lease | The `next_attempt_at` value a payout gets while a CardPay call is in flight: call timeout plus 60 seconds (SDD §17.2). | SDD §17.2 |
| `tenant_ref` | Opaque, non-reversible tenant alias carried in logs and metric labels instead of `tenant_id`. | SDD §11.4 |
| `problemBase` | Base URI of the RFC 9457 `type` values; each error type is `{problemBase}/<kebab-case errorCode>`. | new in LLD |
| `*Port` / `*Adapter` | Outbound port interface in the application layer and its infrastructure implementation (hexagonal, SDD §6). | SDD §6 |
| `*Service` / `*ServiceImpl` | Inbound use-case interface and its application-layer implementation (CLAUDE.md layering names inside the hexagon). | CLAUDE.md |
| `*Dto` / `*Response` | Java record of an inbound request body / outbound response body; the OpenAPI schema keeps the SDD name. | new in LLD |
| SAGA-01 | The choreographed refund payout and points take-back saga, documented in 09 § 12.5. | new in LLD (SDD ADR-05) |

<!-- MASTER: lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->
