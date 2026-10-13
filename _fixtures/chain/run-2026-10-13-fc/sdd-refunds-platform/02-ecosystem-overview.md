<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 01
PART OF: SDD - Refunds Platform
-->

# 6. Ecosystem Overview

Source labels in Notes: `BRD-mandated` (a parked Technical Input, with its BRD key), `questionnaire` (the architecture questionnaire, ADR-01), `default` (this skill's stack defaults; the project rules file `AGENTS.md` states no stack defaults), `recommended` (proposed from BRD evidence). A row marked **Proposed** names a new third-party dependency: under `AGENTS.md` it is not adopted until the product owner approves it, and its ADR stays Proposed until then.

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Modular monolith: one deployable, four modules with in-process ports and durable in-process domain events; provider work that follows a state change is queued in the owning module's tables in the same transaction and sent after commit; read-only provider queries are synchronous and change no state; DDD bounded contexts and hexagonal structure per module | n/a | questionnaire (ADR-01, ADR-02, ADR-05) |
| Compute / Infra | Managed container service, one container image, at least 2 replicas | Provider tier: pin at build | questionnaire (ADR-09). **[NEEDS CLARIFICATION: Which managed container service and hosting location (cloud provider and region, or on-premises) runs the deployable? Owner: product owner.]** The chosen service is a new managed service: Proposed until approved. |
| Container Runtime | OCI container image, run by the managed container service | n/a | recommended (ADR-09) |
| Service Mesh / Ingress | Not applicable: one deployable; TLS terminates at the hosting load balancer in front of it | n/a | recommended (one deployable) |
| Primary RDBMS | PostgreSQL | 17+ | BRD-mandated engine ([REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd): "Use PostgreSQL for all data."); version from default. One database, one schema per module (ADR-06). **[NEEDS CLARIFICATION: Which PostgreSQL 17 offering and which high-availability topology (standby, backups, point-in-time recovery) meets REFUNDS/NFR-02? Owner: product owner with the platform team.]** |
| Caching | Not applicable for this release | n/a | recommended: balances and lists are read from module tables at the volumes of §18.1 |
| Event Broker / Streaming | Not applicable for this release: no event leaves the deployable | n/a | questionnaire (ADR-02); the default broker (Kafka on-premises, SNS+SQS on AWS) is chosen when an ADR-01 extraction trigger fires |
| Object Storage | Not applicable for this release | n/a | recommended: no file is stored; revisit if the branch refund report becomes an export file ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)) |
| IAM / AuthN | Keycloak (OIDC), one realm for end customers and staff | Pin at build | default; **Proposed** (ADR-07): new dependency, needs product-owner approval. The customer and member sign-in method is open (§16.2). |
| Secrets Management | Secrets manager of the hosting environment | Pin at build | recommended. **[NEEDS CLARIFICATION: Which secrets manager stores the provider credentials and the IAM client secrets? Owner: product owner.]** |
| API Gateway | Not applicable: one deployable; authentication and routing are in the deployable's inbound adapters | n/a | recommended (one deployable) |
| CI/CD | Pipeline that builds, tests, scans, and deploys one container image | Pin at build | **[NEEDS CLARIFICATION: Which CI/CD platform builds and deploys the container image? Owner: product owner.]** |
| Observability: Logging | Structured JSON logs to stdout, shipped by the hosting environment | Pin at build | recommended; backend open (marker in the Tracing row) |
| Observability: Metrics | Micrometer metrics through Spring Boot Actuator, RED per endpoint | Spring Boot managed | recommended (part of Spring Boot, REFUNDS 12 TI-01) |
| Observability: Tracing | OpenTelemetry instrumentation, W3C trace context | Pin at build | **Proposed** (ADR-10). **[NEEDS CLARIFICATION: Which log, metrics, and trace backends receive the deployable's telemetry? Owner: product owner.]** |
| Backend Runtime | Java 21 / Spring Boot | Java 21; Spring Boot 3.5+ | BRD-mandated ([REFUNDS 12 TI-01](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd): "Backend services must be built with Java 21 and Spring Boot."); Spring Boot version from default. Layering: hexagonal per module (rules below). |
| Frontend Stack | Angular standalone components | 17+ | default; **Proposed** (ADR-11). Primary color: **[NEEDS CLARIFICATION: What is the brand or key color of the platform's web screens? REFUNDS 11 and LOYALTY 11 leave it open. Owner: product owner.]** |
| Testing | JUnit 5 and Mockito (Spring Boot test starter); ArchUnit; Testcontainers | Pin at build | JUnit 5 and Mockito: part of Spring Boot; ArchUnit and Testcontainers: **Proposed** (ADR-12) |
| Reporting / BI | Not applicable: the branch refund report is served by `refund-request` (§17.1 Output) | n/a | recommended (one report, [REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)); LOYALTY 09 has no report |

**[NEEDS CLARIFICATION: Which versions are pinned for the components whose Version / Tier cell reads "Pin at build"? Owner: platform team.]**

`AGENTS.md` states no stack defaults; the defaults above are this skill's (Java 21, Spring Boot 3.5+, PostgreSQL 17+, UUIDv7, Keycloak, Angular 17+ standalone), adapted to the modular monolith.

**Ecosystem-level rules:**

- **Event-driven by default (EDA), modular-monolith variant:** every state change one module needs from another travels as a durable in-process domain event (§14.10); synchronous calls between modules go through `Internal (in-process)` port contracts (§15), one hop at most. Provider work that follows a state change (payouts, messages) is recorded in the owning module's tables in the same transaction as the state change and sent after commit; the receipt lookup is a synchronous read (API-04); there are no dual-writes. The Centralized Event Hub (§14) carries no integration events in this release.
- **DDD bounded contexts:** one module owns one bounded context and its data: one PostgreSQL schema per module, no cross-module joins, no shared tables. The §13 decomposition follows the domain (refund request, payout, customer notification, loyalty points), not technical tiers.
- **Hexagonal architecture (ports & adapters) per module:** the domain core of each module is isolated from transport and infrastructure; REST controllers, event listeners, repositories, and provider clients are adapters on ports; modules call each other only through ports. Provider integrations sit behind anti-corruption adapters (§12).
- **Timezone:** UTC for every stored and exchanged date-time; the branch-local date is derived only where a BRD rule counts days.
- **ID strategy:** UUIDv7 primary keys, generated in the application.
- **Service-to-service auth:** not applicable inside the deployable (in-process calls carry the caller's security context); calls to providers authenticate with the provider's scheme (§15.1).
- **Secrets handling:** provider credentials and IAM client secrets live only in the secrets manager and reach the deployable as environment variables at start; they are never in the repository or in logs.
- **New dependencies:** a library, framework, or managed service not listed above as BRD-mandated or part of Spring Boot is proposed in a Proposed ADR and adopted only after the product owner approves it (`AGENTS.md`).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
