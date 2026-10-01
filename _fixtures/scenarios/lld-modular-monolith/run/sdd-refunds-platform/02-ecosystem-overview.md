<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 01
PART OF: SDD - Refunds Platform
-->

# 6. Ecosystem Overview

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Modular monolith: one deployable with four modules (`refund`, `payout`, `notification`, `loyalty`); `Internal (in-process)` port calls and in-process domain events from a durable event publication log; DDD bounded contexts + hexagonal (ports and adapters) in every module | n/a | questionnaire (ADR-01, ADR-05) |
| Compute / Infra | Kubernetes; one Helm chart for the deployable; two or more replicas on separate nodes | [NEEDS CLARIFICATION: Kubernetes version and hosting, on-prem cluster or managed cloud; both BRDs are silent] | questionnaire Q8 (ADR-01); replicas: recommended for REFUNDS/NFR-02 |
| Container Runtime | containerd, the cluster's runtime; one OCI image for the deployable | Cluster-managed | recommended |
| Service Mesh / Ingress | Service mesh: Not applicable (one deployable, no service-to-service traffic). Ingress: the cluster ingress controller in front of the API gateway | [NEEDS CLARIFICATION: ingress controller and version] | questionnaire (Q4, Q8) |
| Primary RDBMS | PostgreSQL; one database, one schema per module | 17+ | BRD-mandated ([REFUNDS 12 § Technical Inputs](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) TI-02: "Use PostgreSQL for all data."); version: default (CLAUDE.md); topology: ADR-06. [NEEDS CLARIFICATION: HA topology and backup policy; REFUNDS/NFR-02 allows 2 hours of disruption a month] |
| Caching | Not applicable for this release | - | recommended: about 1,200 refund requests a month ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 1) need no cache |
| Event Broker / Streaming | Not applicable for this release: no event leaves the deployable; modules use in-process domain events (§14.10) | - | questionnaire Q5 (ADR-02); Kafka (the on-prem default) is introduced when a module is extracted |
| Object Storage | Not applicable for this release | - | recommended: no use case stores files |
| IAM / AuthN | Keycloak, one realm for customers, members, and branch managers; OIDC authorization code with PKCE for the web app | [NEEDS CLARIFICATION: Keycloak version] | default (CLAUDE.md) (ADR-07); two or more replicas, like the deployable (REFUNDS/NFR-02) |
| Secrets Management | A secrets manager outside the cluster configuration, holding provider credentials (CardPay, MsgHub, POS records) and PII encryption keys | [NEEDS CLARIFICATION: product and version, chosen with the hosting] | recommended: provider credentials for the [REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations) partners |
| API Gateway | API gateway at the edge: token validation, tenant resolution, rate limiting, request logging | [NEEDS CLARIFICATION: product and version] | default (CLAUDE.md: cross-cutting concerns live in the gateway); two or more replicas, like the deployable (REFUNDS/NFR-02) |
| CI/CD | [NEEDS CLARIFICATION: CI/CD platform] | [NEEDS CLARIFICATION: version] | Pipeline stages: build, unit tests (JUnit 5 + Mockito), integration tests (Testcontainers PostgreSQL), module boundary tests, image, Helm deploy; default (CLAUDE.md testing rules) |
| Observability: Logging | Structured JSON logs with correlation id and tenant context, shipped to a central log store | [NEEDS CLARIFICATION: log store, version, and retention] | default (CLAUDE.md) |
| Observability: Metrics | Prometheus metrics (RED per module and endpoint), Grafana dashboards | [NEEDS CLARIFICATION: versions] | Prometheus: default (CLAUDE.md); Grafana: recommended |
| Observability: Tracing | OpenTelemetry, W3C trace context | [NEEDS CLARIFICATION: trace backend and sampling rate] | default (CLAUDE.md) |
| Backend Runtime | Java 21 / Spring Boot; Spring Modulith for module boundary verification and the event publication log | Java 21; Spring Boot 3.5+; [NEEDS CLARIFICATION: Spring Modulith version compatible with Spring Boot 3.5] | BRD-mandated ([REFUNDS 12 § Technical Inputs](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) TI-01: "Backend services must be built with Java 21 and Spring Boot."); version: default (CLAUDE.md); Spring Modulith: recommended (ADR-01, ADR-02) |
| Frontend Stack | Angular 17+ standalone components, Tailwind + PrimeNG | Angular 17+ | default (CLAUDE.md); responsive for phones and computers ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)). [NEEDS CLARIFICATION: brand key color] |
| Reporting / BI | Not applicable for this release: the branch refund report is served by the `refund` module API | - | recommended: one daily report ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)); none in LOYALTY |

**Ecosystem-level rules:**

- **Event-driven by default (EDA), module variant:** every cross-module state change travels as an in-process domain event (§14.10) or, when a command must commit with its caller, an `Internal (in-process)` port call (§15). No event leaves the deployable in this release, so the Centralized Event Hub carries no integration events (ADR-02); an event that later leaves the process goes through a transactional outbox and the hub. Provider writes leave the process through module dispatch tables (ADR-09). Outbox pattern mandatory - no dual-writes.
- **DDD bounded contexts:** one module owns one bounded context, its data, and one team of decisions: one schema per module in one PostgreSQL database, no cross-module joins, no cross-schema foreign keys, no shared tables; the §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports & adapters) per module:** the domain core is isolated from transport and infrastructure; REST, persistence, and provider adapters plug into ports, and modules call each other only through the ports in each module's `api` package. Provider integrations (CardPay, MsgHub, POS records) sit behind anti-corruption adapters.
- **Module dependencies are acyclic:** `refund` → `payout` (port and events); `notification` → `refund`, `payout` (events); `loyalty` → `refund` (events). Verified by module boundary tests in CI.
- **Time zone:** UTC for every stored and exchanged timestamp; ISO-8601 on the wire.
- **IDs:** UUIDv7 primary keys, generated in the application.
- **Service-to-service auth:** no service-to-service network calls in this release; in-process calls carry the authenticated principal and the tenant in the call context; provider calls authenticate with per-tenant provider credentials from the secrets manager.
- **Secrets handling:** never in images, Git, or logs; loaded from the secrets manager at startup.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
