<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 01
PART OF: SDD - Refunds Platform
-->

# 6. Ecosystem Overview

The platform-wide stack every deployable conforms to. Source technical mandates: [REFUNDS 12 § Technical Inputs for the SDD](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) (TI-01, TI-02); [LOYALTY 12 § Technical Inputs for the SDD](../brd-loyalty-points/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) states none, so the two BRDs do not conflict.

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Hybrid: modular monolith core (`refunds-platform-core`: refund-service and loyalty-service modules, in-process ports and domain events) plus the extracted payout-service and notification-service, linked by a Kafka event backbone with transactional outbox; DDD (bounded contexts) + Hexagonal (ports & adapters) in every deployable | n/a | questionnaire (ADR-01, ADR-05) |
| Compute / Infra | On-prem Kubernetes | [NEEDS CLARIFICATION: Kubernetes distribution, version, and cluster topology] | questionnaire (ADR-09); default (CLAUDE.md: one container and one Helm chart per deployable) |
| Container Runtime | containerd | [NEEDS CLARIFICATION: version] | recommended: the runtime of the Kubernetes distribution |
| Service Mesh / Ingress | Kubernetes ingress controller in front of the API gateway; no service mesh | [NEEDS CLARIFICATION: ingress controller product and version] | recommended: service mesh Not applicable, because three deployables with no synchronous calls between them (ADR-05) need no east-west traffic policy |
| Primary RDBMS | PostgreSQL | 17+ | BRD-mandated (REFUNDS 12 TI-02: "Use PostgreSQL for all data."), applied to the LOYALTY modules too, where it matches the CLAUDE.md default; version default (CLAUDE.md); one database for the core with the module schemas `refund` and `loyalty` and the infrastructure schema `core_events` (§11.1), one database each for payout-service and notification-service (ADR-06); [NEEDS CLARIFICATION: HA topology, replicas, and backup policy] |
| Caching | Not applicable | - | recommended: about 1,200 requests a month ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts)) need no cache tier |
| Event Broker / Streaming | Apache Kafka with a schema registry (JSON Schema payloads) | [NEEDS CLARIFICATION: Kafka version, schema registry product, and topic retention period; the retention also sets the dedup window of §14.6 rule 2] | default (CLAUDE.md: Kafka on-prem; JSON Schema or Avro through a schema registry, additive changes only); topics per §14.4 (ADR-02) |
| Object Storage | Not applicable | - | recommended: no files or exports are stored in this release; photo evidence of returned goods would need it, if [REFUNDS 13 § OI-16](../brd-refunds-portal/13-open-items-and-clarifications.md#oi-16-the-goods-before-the-money) allows refunds without the goods |
| IAM / AuthN | Keycloak, one realm for every tenant | [NEEDS CLARIFICATION: version] | default (CLAUDE.md: Keycloak on-prem, single-realm multi-tenancy); OIDC authorization code with PKCE for the web app (ADR-07) |
| Secrets Management | [NEEDS CLARIFICATION: secrets manager product + version + topology] | - | Holds the CardPay, MsgHub, and POS Records credentials and the database credentials (§11.6) |
| API Gateway | Spring Cloud Gateway | [NEEDS CLARIFICATION: version] | recommended: same Java 21 / Spring Boot stack the REFUNDS 12 TI-01 mandate sets; carries token validation, tenant resolution, rate limiting, and request logging (CLAUDE.md); per-user rate limit on `POST /v1/receipt-lookups` (proposed 10 a minute and 50 a day), 429 `RATE_LIMITED` beyond it; request logs and spans record the route template and `tenant_ref`, never the raw URL, a request body, or the host name (§11.4) |
| CI/CD | [NEEDS CLARIFICATION: CI/CD platform + version] | - | No BRD signal and no house default |
| Observability: Logging | Structured JSON logs shipped to a central aggregator | [NEEDS CLARIFICATION: aggregator product + version + retention] | default (CLAUDE.md: structured JSON logs with correlation id and tenant context) |
| Observability: Metrics | Prometheus + Grafana | [NEEDS CLARIFICATION: version] | default (CLAUDE.md: Prometheus metrics, RED per service); Grafana recommended for dashboards |
| Observability: Tracing | OpenTelemetry | [NEEDS CLARIFICATION: collector version, tracing backend, sampling rate] | default (CLAUDE.md: OpenTelemetry distributed tracing) |
| Backend Runtime | Java / Spring Boot | Java 21; Spring Boot 3.5+ | BRD-mandated (REFUNDS 12 TI-01: "Backend services must be built with Java 21 and Spring Boot."); version default (CLAUDE.md); hexagonal modules, constructor injection, records for DTOs |
| Frontend Stack | Angular (standalone components) with PrimeNG and Tailwind | Angular 17+ | default (CLAUDE.md); one web app for customers, members, and branch managers; [NEEDS CLARIFICATION: primary brand colour] |
| Reporting / BI | Not applicable | - | recommended: the REFUNDS reports ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics): branch and head-office) are served by refund-service (§17.1); [LOYALTY 09 § Reporting & Analytics](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics) has none |

**Ecosystem-level rules:**

- **Event-driven by default (EDA):** every cross-deployable state change travels as an asynchronous integration event through the Centralized Event Hub (§14); synchronous REST is reserved for true request-response (the web app to the core, and a deployable to an external system), capped at one hop. Inside the core, module-to-module changes use in-process domain events (§14.10) and `Internal (in-process)` port calls (§15); anything that leaves the core goes through the hub. Outbox pattern mandatory - no dual-writes.
- **DDD bounded contexts:** one service or module owns one bounded context, its data, and one team of decisions: one schema per module in the core database with no cross-module joins, and one database per extracted service. No shared schemas across services or modules; the §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports & adapters) per service or module:** domain core isolated from transport and infrastructure; inbound/outbound adapters (REST, messaging, persistence, providers) plug into ports, and modules call each other only through ports. Provider integrations (POS Records, CardPay, MsgHub) sit behind anti-corruption adapters.
- **Time:** UTC for every stored and exchanged datetime (ISO-8601); the web app shows dates in the tenant locale.
- **IDs:** UUIDv7 primary keys and event ids, generated in the application; refund requests also carry a human-readable reference number (§5).
- **Service-to-service auth:** no synchronous calls between deployables (ADR-05); Kafka clients authenticate per deployable and topic ACLs limit who writes and reads (§11.6); external providers use their own schemes (§15).
- **Secrets:** provider and database credentials live only in the secrets manager and are injected at runtime; never in images, Git, or logs.
- **Idempotency:** every write endpoint that touches money, notifications, or an external provider takes an `Idempotency-Key` (§15.1); every consumer dedups on `(consumer, event_id)` (§14.6).
- **Errors:** RFC 9457 Problem Details with an `errorCode` extension (§15.1); no stack traces or raw codes reach the user.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
