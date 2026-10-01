<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 01
PART OF: SDD - Refunds Portal
-->

# 6. Ecosystem Overview

Every module in §13 conforms to this stack. Source labels in Notes: `BRD-mandated` (parked verbatim in [BRD 12 § Technical Inputs for the SDD](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)), `questionnaire` (architecture questionnaire, ADR-01), `default` (platform defaults), `recommended` (proposed from BRD evidence). Rows that do not apply to a single deployable are `Not applicable`.

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Modular monolith: DDD modules with hexagonal structure (ports and adapters) inside each module, one backend deployable; in-process port calls for queries, domain events through a per-module transactional outbox for state changes | n/a | `questionnaire` (ADR-01, ADR-02). Deviates from the microservices default of the doctrine; the ecosystem-level rules below are adapted to modules. |
| Compute / Infra | Kubernetes | **[NEEDS CLARIFICATION: Kubernetes distribution and version; depends on hosting (on-premises or cloud), R-08]** | `questionnaire` (ADR-09). At least two replicas of the backend across failure domains for NFR-02; cluster topology **[NEEDS CLARIFICATION: node pools and zones]**. |
| Container Runtime | containerd | **[NEEDS CLARIFICATION: version fixed by the chosen Kubernetes distribution]** | `recommended`: the Kubernetes default runtime; no BRD requirement. |
| Service Mesh / Ingress | Service mesh: Not applicable. Ingress: **[NEEDS CLARIFICATION: ingress controller + version; depends on hosting]** | - | Mesh: `questionnaire` (ADR-01): a mesh adds nothing for one deployable with no internal network hops. Ingress: `recommended` once hosting is decided. |
| Primary RDBMS | PostgreSQL | 17+ | `BRD-mandated` (TI-02: "Use PostgreSQL for all data."); version from `default`. One database `refunds_portal`, one schema per module (ADR-03). HA topology and backups **[NEEDS CLARIFICATION: replica count, failover mechanism, backup and point-in-time-recovery targets derived from NFR-02 in §18]**. |
| Caching | Not applicable for this release | - | `recommended`: request volume ([BRD 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts)) does not justify a cache; receipt lookups always go to the Point-of-Sale records for fresh eligibility data. |
| Event Broker / Streaming | Not applicable for this release | - | `questionnaire` (ADR-02): domain events are delivered in-process by the outbox relay. At the first module extraction the platform default applies: Kafka if on-premises, SNS + SQS on AWS; logical topic names (§14.4) carry over unchanged. |
| Object Storage | Not applicable for this release | - | `recommended`: no BRD use case stores files or attachments. |
| IAM / AuthN | Keycloak | **[NEEDS CLARIFICATION: Keycloak version]** | `default`: single realm with multi-tenancy by tenant claim; OIDC authorization code flow with PKCE for the SPA (ADR-06). Customer identity model and branch-manager identity source **[NEEDS CLARIFICATION: see §3 assumptions 5 and 6]**. |
| Secrets Management | **[NEEDS CLARIFICATION: secrets manager + version; depends on hosting (for example HashiCorp Vault on-premises or the cloud provider's secrets service)]** | - | `recommended`: required for per-tenant provider credentials (CardPay, MsgHub, Point-of-Sale records) and database credentials; product follows the hosting decision. **[NEEDS CLARIFICATION: rotation policy]** |
| API Gateway | **[NEEDS CLARIFICATION: gateway product + version]** | - | `default` responsibilities: token validation, tenant resolution, rate limiting, request logging (§11.6). Rate limits on receipt lookups mitigate R-05. |
| CI/CD | **[NEEDS CLARIFICATION: CI/CD platform + version]** | - | `recommended` pipeline standards from the platform testing defaults: build, unit and integration tests (Testcontainers), module-boundary tests, image scan, Helm release per environment (§11.3); product open. |
| Observability: Logging | **[NEEDS CLARIFICATION: log aggregation product + version]** | - | `default`: structured JSON logs with correlation id and tenant context; `tenant_id` and PII never logged at INFO (§11.4). Retention **[NEEDS CLARIFICATION: hot and cold retention]**. |
| Observability: Metrics | Prometheus | **[NEEDS CLARIFICATION: version]** | `default`: the deployable exposes a Prometheus metrics endpoint; RED metrics per endpoint, event handler, and provider adapter. Dashboard tool **[NEEDS CLARIFICATION: dashboard product]**. |
| Observability: Tracing | OpenTelemetry | **[NEEDS CLARIFICATION: SDK version and trace backend]** | `default`: W3C trace context propagated on HTTP calls and carried across the outbox. Sampling **[NEEDS CLARIFICATION: sampling rate]**. |
| Backend Runtime | Java 21 + Spring Boot | Java 21; Spring Boot 3.5+ | `BRD-mandated` (TI-01: "Backend services must be built with Java 21 and Spring Boot."); Spring Boot line from `default`. Hexagonal layering per module; constructor injection only; records for DTOs. |
| Frontend Stack | Angular (standalone components) + PrimeNG + Tailwind | Angular 17+ | `default`. One application with a customer area and a branch-manager area; signals for state, OnPush change detection, WCAG 2.1 AA, i18n with RTL support, responsive customer screens (BRD 11). Brand key color **[NEEDS CLARIFICATION: key color and brand tokens]**. |
| Reporting / BI | Not applicable for this release | - | `recommended`: the one report of [BRD 09](../brd-refunds-portal/09-reporting-and-analytics.md) is served in-app by the refund-requests module (§17.1). |

**Ecosystem-level rules:**

- **Event-driven between modules (EDA, adapted to the modular monolith, ADR-02):** every cross-module state change travels as a domain event through the producing module's transactional outbox and is delivered in-process to subscribing modules (§14); a module calls another module synchronously only through an in-process query port (§15), never across more than one hop. No dual-writes.
- **DDD bounded contexts (adapted, ADR-01, ADR-03):** one module owns one bounded context and one PostgreSQL schema; no module reads or writes another module's schema, and there are no cross-schema joins or foreign keys. The §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports and adapters) per module:** the domain core is isolated from REST, persistence, scheduling, and provider clients; external providers sit behind anti-corruption adapters. Module boundaries are checked at build time by module-boundary tests.
- **Time:** UTC for every stored and transmitted datetime (ISO-8601); display follows the tenant locale.
- **Identifiers:** UUIDv7 primary keys and event ids, generated by the application, never by the database.
- **Tenant context:** every inbound request, event, and outgoing provider call carries the tenant context (§11.2); `tenant_id` is never logged at INFO.
- **Module-to-module trust:** modules share one process, so there is no network authentication between them; the trust boundary is the deployable, and user permissions are checked where a request enters the deployable (§16.2).
- **Secrets:** provider and database credentials live only in the secrets manager, scoped per tenant for providers; never in images, Helm values, or the repository.
- **Money:** every amount is a decimal with an ISO-4217 currency code (`Money`, §14.9.0); floating-point types are never used for money.

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
