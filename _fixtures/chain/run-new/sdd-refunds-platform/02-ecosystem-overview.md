<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 01
PART OF: SDD - Refunds Platform
-->

# 6. Ecosystem Overview

Sources in Notes: `BRD-mandated` (a verbatim Technical Input, cited with its BRD key), `ADR` (an architectural decision in §10), `default` (platform default), `recommended` (proposed from BRD evidence). The LOYALTY BRD states no technical input ([LOYALTY 12 § Technical Inputs for the SDD](../brd-loyalty-points/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)); the REFUNDS inputs are [REFUNDS 12 § Technical Inputs for the SDD](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd).

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Hybrid: modular monolith core (`refunds-platform-core`: refund-service and loyalty-service modules) plus separately deployed payout-service and notification-service; EDA between deployables (Kafka, transactional outbox); DDD bounded contexts; hexagonal (ports and adapters) in every module and service | n/a | ADR-01. Deviation from the microservices default is recorded in ADR-01. |
| Compute / Infra | Kubernetes, on-premises | [NEEDS CLARIFICATION: distribution, version, node pools] | A-2; one Helm chart per deployable (3 charts). |
| Container Runtime | containerd | [NEEDS CLARIFICATION: version] | recommended (Kubernetes default runtime). |
| Service Mesh / Ingress | Ingress controller only; no service mesh | [NEEDS CLARIFICATION: ingress controller product and version] | recommended: there is no service-to-service HTTP between deployables (ADR-05), so a mesh adds cost without a caller to protect. |
| Primary RDBMS | PostgreSQL | 17+ | BRD-mandated for the refund services (REFUNDS/TI-02 "Use PostgreSQL for all data."); default for loyalty-service. One database for the core (schema per module), one per extracted service (ADR-06). [NEEDS CLARIFICATION: HA topology and backup policy] |
| Caching | None in this release | - | recommended: about 1,200 refund requests a month (REFUNDS 02 Facts) and read-your-own-data queries need no cache. |
| Event Broker / Streaming | Apache Kafka, with a schema registry (JSON Schema, additive-only) | [NEEDS CLARIFICATION: Kafka version, cluster size, schema registry product] | default (on-premises); ADR-02. Topic defaults: [NEEDS CLARIFICATION: partitions and retention per topic]. |
| Object Storage | Not applicable for this release | - | recommended: neither BRD stores files or documents. |
| IAM / AuthN | Keycloak, one realm (single-realm multi-tenancy) | [NEEDS CLARIFICATION: version] | default (on-premises). OIDC authorization code with PKCE for the web app; client credentials for service identities (ADR-07). At least two replicas (REFUNDS/NFR-02, §18). |
| Secrets Management | [NEEDS CLARIFICATION: secrets manager product (for example Vault or Sealed Secrets)] | [NEEDS CLARIFICATION: version] | recommended: provider credentials (CardPay, MsgHub, POS Records) are stored per tenant and never in images or Git. |
| API Gateway | API gateway at the edge: token validation, tenant resolution, rate limiting, request logging | [NEEDS CLARIFICATION: gateway product and version] | default (cross-cutting concerns live in the gateway). At least two replicas (REFUNDS/NFR-02, §18). |
| CI/CD | [NEEDS CLARIFICATION: CI/CD platform] | [NEEDS CLARIFICATION: version] | Pipeline standard: build, unit tests, Testcontainers integration tests, image scan, Helm deploy per deployable. |
| Observability: Logging | Structured JSON logs with correlation id and tenant context | [NEEDS CLARIFICATION: log store product and retention] | default. |
| Observability: Metrics | Prometheus | [NEEDS CLARIFICATION: version, dashboard tool] | default: RED metrics per deployable, alerts on SLOs (§18). |
| Observability: Tracing | OpenTelemetry | [NEEDS CLARIFICATION: tracing backend and sampling rate] | default: W3C trace context across HTTP and Kafka headers. |
| Backend Runtime | Java 21 / Spring Boot | Spring Boot 3.5+ | BRD-mandated for the refund services (REFUNDS/TI-01 "Backend services must be built with Java 21 and Spring Boot."); default for loyalty-service. Layered hexagonal packages per module; constructor injection; records for DTOs. |
| Frontend Stack | Angular (standalone components), PrimeNG, Tailwind | Angular 17+ | default. Responsive (REFUNDS 11, LOYALTY 11); i18n and RTL from day one; tenant theming at runtime. Key color: [NEEDS CLARIFICATION: brand key color]. |
| Reporting / BI | Not applicable for this release | - | recommended: the daily branch refund report (REFUNDS 09) is a refund-service query endpoint. |

**Ecosystem-level rules:**

- **Event-driven between deployables (EDA):** every state change that leaves a module or service travels as an asynchronous event through the Centralized Event Hub (§14); synchronous calls are reserved for client requests and external providers, capped at one hop. Outbox pattern mandatory: no dual-writes.
- **DDD bounded contexts:** one module or service owns one bounded context and its data. Modules in the core have separate schemas and never read each other's tables; extracted services have their own database.
- **Hexagonal architecture (ports and adapters) everywhere:** domain core isolated from transport and infrastructure; provider integrations (POS Records, CardPay, MsgHub, Keycloak Admin API) sit behind anti-corruption adapters.
- **Time:** UTC for every stored and transmitted timestamp (ISO-8601); the web app renders dates in the tenant locale. Business calendar rules (the refund window of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-1, the day a daily branch refund report covers, and the take-back parking deadline of §17.4) use calendar dates in the tenant's time zone, an IANA zone id held in tenant configuration; POS purchase dates are read as dates in that zone.
- **IDs:** UUIDv7 primary keys and event ids, generated in the application.
- **Service identity:** each deployable authenticates with its own Keycloak client (client credentials) wherever it calls a platform component.
- **Secrets:** delivered at runtime from the secrets manager; never logged, never in Git, rotated on the §20 procedure.
- **Money:** amounts are `decimal(19,4)` with an ISO-4217 currency; never floating point.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
