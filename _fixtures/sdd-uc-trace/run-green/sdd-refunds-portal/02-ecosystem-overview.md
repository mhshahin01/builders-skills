<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 01
PART OF: SDD - Refunds Portal
-->

# 6. Ecosystem Overview

Source labels in Notes: `BRD-mandated` (parked verbatim in [BRD Technical Inputs for the SDD](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)), `questionnaire` (architecture questionnaire, ADR-01), `default` (platform defaults), `recommended` (derived from BRD evidence for the chosen style).

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Modular monolith: DDD modules (refund, payout, notification) with hexagonal ports and adapters inside each module, one deployable; module-to-module state changes as domain events through a transactional outbox; everything that leaves the process goes through the outbox or an anti-corruption adapter | n/a | `questionnaire` (ADR-01, ADR-05). Deviates from the microservices house default; justified in ADR-01 with its extraction triggers. |
| Compute / Infra | Kubernetes | **[NEEDS CLARIFICATION: on-prem or managed cloud Kubernetes + version + topology (node pools, zones)]** | `questionnaire` (ADR-09); `default` (one Helm chart per deployable). The hosting answer also settles the IAM hosting (ADR-07) and the broker used on extraction (ADR-02). |
| Container Runtime | OCI container image, one image for the backend deployable | **[NEEDS CLARIFICATION: container runtime + version, set by the Kubernetes platform]** | `default` (one deployable, one container). |
| Service Mesh / Ingress | Service mesh: Not applicable (one deployable, no service-to-service traffic). Ingress: **[NEEDS CLARIFICATION: ingress controller + version + topology]** | - | `recommended`: a mesh brings nothing to a single deployable; revisit on the first extraction (ADR-01). |
| Primary RDBMS | PostgreSQL | 17+ | `BRD-mandated` (TI-02: "Use PostgreSQL for all data."); version: `default`. One database, one schema per module (ADR-06). HA topology and backups: **[NEEDS CLARIFICATION: HA topology, backup schedule, and restore targets]** |
| Caching | Not applicable for this release | - | `recommended`: the volume in [BRD Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 1-2 needs no cache; the idempotency and inbox records live in PostgreSQL. Revisit if §18 latency targets are missed. |
| Event Broker / Streaming | Not applicable for this release: an in-process relay over per-module outbox tables in PostgreSQL (§14.2) | - | `recommended` (ADR-02). On the first extraction the relay publishes to Kafka (on-prem) or SNS+SQS (AWS), per the platform default. |
| Object Storage | Not applicable for this release | - | `recommended`: no use case stores or serves files. |
| IAM / AuthN | Keycloak (OIDC), single realm | **[NEEDS CLARIFICATION: Keycloak version and deployment]** | `default` (Keycloak, single-realm multi-tenancy). Realm roles and claims per §16; authentication decision in ADR-07. |
| Secrets Management | **[NEEDS CLARIFICATION: secrets manager + version + topology; depends on the hosting decision]** | - | Holds the POS Records, CardPay, and MsgHub credentials (§15) and the database credentials. |
| API Gateway | **[NEEDS CLARIFICATION: API gateway product + version + topology]** | - | `default`: authentication, tenant resolution, rate limiting, and request logging live in the gateway. |
| CI/CD | **[NEEDS CLARIFICATION: CI/CD platform + version + pipeline standards]** | - | `default`: trunk-based development, Conventional Commits. |
| Observability: Logging | Structured JSON logs with correlation id and tenant context | **[NEEDS CLARIFICATION: log aggregation stack + retention]** | `default`. Field rules in §11.4. |
| Observability: Metrics | Prometheus, RED metrics per endpoint and per event handler | **[NEEDS CLARIFICATION: Prometheus version and dashboard tool]** | `default`. Alerting on SLOs (§11.4). |
| Observability: Tracing | OpenTelemetry | **[NEEDS CLARIFICATION: trace back end + sampling rate]** | `default`. |
| Backend Runtime | Java / Spring Boot | Java 21; Spring Boot 3.5+ | `BRD-mandated` (TI-01: "Backend services must be built with Java 21 and Spring Boot."); Spring Boot version: `default`. Layered code inside each hexagonal module, constructor injection, records for DTOs, Resilience4j for timeouts, retries, circuit breakers, and bulkheads (`default`). |
| Frontend Stack | Angular (standalone components, signals, OnPush) + PrimeNG + Tailwind | Angular 17+ | `default`. Responsive customer and branch-manager screens ([BRD UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); design tokens and i18n from day one. Key colour: **[NEEDS CLARIFICATION: brand key colour for the design tokens]** |
| Reporting / BI | Not applicable: the daily branch refund report is served by the refund module (§17.1) | - | `recommended`: [BRD Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics) names one daily report over data the refund module owns. |

**Ecosystem-level rules:**

- **Event-driven between modules (EDA, adapted by ADR-01, ADR-02, ADR-05):** every cross-module state change travels as a domain event, written to the producing module's outbox in the same transaction and dispatched after commit (§14); synchronous calls are reserved for request-response with external systems (§15), capped at one hop. No dual writes.
- **DDD bounded contexts (adapted by ADR-06):** one module owns one bounded context and one schema in the shared PostgreSQL database; no cross-schema joins, foreign keys, or grants. The §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports and adapters) per module:** the domain core is isolated from transport and infrastructure; inbound adapters (REST controllers, event handlers, schedulers) and outbound adapters (persistence, outbox, POS Records, CardPay, MsgHub clients) plug into ports. Provider integrations sit behind anti-corruption adapters.
- **Time zone:** UTC for every stored and exchanged date-time.
- **ID strategy:** UUIDv7 primary keys generated in the application; customer-facing reference numbers are separate identifiers (§17.1).
- **Service-to-service auth:** not applicable inside the deployable (modules are in-process); outbound calls use each provider's scheme (§15) with credentials from the secrets manager.
- **Secrets handling:** credentials are read from the secrets manager at start-up, never stored in the repository or the image, and never logged.
- **Tenant context:** carried on every request, every event envelope, and every outgoing call (ADR-03, §11.2).
- **Idempotency:** an `Idempotency-Key` is required on every write endpoint that touches money, notifications, or an external provider; every event consumer deduplicates (AP-02).
- **API versioning:** URI prefix (`/v1`); a breaking change is a new version (ADR-04).

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
