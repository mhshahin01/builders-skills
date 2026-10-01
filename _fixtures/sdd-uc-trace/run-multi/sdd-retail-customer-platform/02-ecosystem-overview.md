<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Retail Customer Platform
VERSION: 1.0
DEPENDS_ON: 01
PART OF: SDD - Retail Customer Platform
-->

# 6. Ecosystem Overview

Source labels in the Notes column: `questionnaire` (the architecture style questionnaire of this SDD; the settled design is ADR-01, ADR-02, and ADR-06), `BRD-mandated` (a Technical Input of a source BRD, cited with its key), `default` (a platform default from CLAUDE.md), and `recommended` (proposed by this SDD from the BRDs). A `Not applicable` row has no component in this release. Every deviation from the platform defaults or from a BRD mandate has an ADR in §10.

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Modular monolith: one deployable of DDD modules (bounded contexts), hexagonal (ports & adapters) inside each module, in-process module ports, and a transactional outbox for every state change that leaves a module | n/a | Source: questionnaire. ADR-01 (style), ADR-02 (no broker), ADR-06 (cross-module interaction). Replaces the microservices-first platform default for this release. |
| Compute / Infra | Kubernetes | **[NEEDS CLARIFICATION: hosting (on-premises or which cloud), Kubernetes distribution and version, cluster topology]** | Source: questionnaire, following the platform deployment-unit default (one container, one Helm chart). The hosting answer also selects the broker for a later extraction (ADR-02). |
| Container Runtime | The container runtime of the Kubernetes distribution, running one OCI image | Follows the distribution | Source: recommended. |
| Service Mesh / Ingress | Service mesh: Not applicable (one deployable, no service-to-service network traffic). Ingress: a Kubernetes ingress controller in front of the API gateway | **[NEEDS CLARIFICATION: ingress controller product and version]** | Source: questionnaire (mesh), recommended (ingress). TLS terminates at the ingress (§11.6). |
| Primary RDBMS | PostgreSQL | 17+ | Source: BRD-mandated (REFUNDS/TI-02) and default. LOYALTY/TI-01 (loyalty data in MongoDB) is not applied: ADR-03. One database, one schema per module. **[NEEDS CLARIFICATION: HA topology, backup, and point-in-time recovery policy]** |
| Caching | None | n/a | Not applicable for this release: no BRD driver; revisit if the §18 targets (part 3) need it. Source: recommended. |
| Event Broker / Streaming | None | n/a | Not applicable for this release: nothing outside the deployable consumes platform events; cross-module events and provider calls are dispatched from the outbox (ADR-02). On extraction: Kafka if hosted on-premises, SNS and SQS if hosted on AWS (platform defaults). Source: questionnaire. |
| Object Storage | None | n/a | Not applicable for this release: neither BRD has files or attachments; report exports are generated on request. Source: recommended. |
| IAM / AuthN | Keycloak | **[NEEDS CLARIFICATION: Keycloak version, and whether an existing enterprise Keycloak is reused]** | Source: default. One realm for customers and staff, OIDC with PKCE for both web apps, tenant and branch as token claims (ADR-07). |
| Secrets Management | **[NEEDS CLARIFICATION: secrets manager product and version]** | - | Source: open; no BRD mandate or platform default names a product. Holds the database, CardPay, MsgHub, and Point-of-Sale credentials, injected at runtime, never in images or chart values. Rotation policy: §11.6. |
| API Gateway | **[NEEDS CLARIFICATION: API gateway product and version]** | - | Source: default (role). Authentication, tenant resolution, rate limiting, and request logging live at the gateway. |
| CI/CD | **[NEEDS CLARIFICATION: CI/CD platform and pipeline standards]** | - | Source: open; no BRD mandate or platform default names a product. One pipeline for the deployable and one for the web apps; Flyway migrations are part of each release (§11.3). |
| Observability: Logging | Structured JSON logs shipped to a central log store | **[NEEDS CLARIFICATION: log store product, version, and retention]** | Source: default (format and mandatory fields, §11.4). |
| Observability: Metrics | Prometheus | **[NEEDS CLARIFICATION: Prometheus version and dashboard tool]** | Source: default. RED metrics per module and per external adapter; alerting on SLOs (§11.4). |
| Observability: Tracing | OpenTelemetry | **[NEEDS CLARIFICATION: tracing backend, collector version, and sampling rate]** | Source: default. W3C trace context propagated to outbound provider calls. |
| Backend Runtime | Java 21 / Spring Boot | Java 21, Spring Boot 3.5+ | Source: BRD-mandated (REFUNDS/TI-01, no version given) and default (version 3.5+). Hexagonal structure per module; constructor injection only; records for DTOs. |
| Frontend Stack | Angular (standalone components) with PrimeNG and Tailwind | Angular 17+ | Source: default. Two apps: a customer app that works on phones and computers ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)) and a staff app. Signals and OnPush change detection, i18n with RTL support, WCAG 2.1 AA, currency and dates formatted with the tenant locale. **[NEEDS CLARIFICATION: brand key color for the theme]** |
| Reporting / BI | None: reports are served in-app | n/a | Not applicable for this release: the branch refund report and the monthly points report are served by their owning modules with CSV and Excel export (§13). Source: recommended. |

**Ecosystem-level rules:**

- **Event-driven by default (EDA):** every cross-module state change travels as a domain event registered in the Centralized Event Hub (§14) and published through the publishing module's transactional outbox; synchronous calls are reserved for true request-response through module ports, capped at one hop. Outbox pattern mandatory - no dual-writes. In this release the events stay inside the deployable (ADR-02).
- **DDD bounded contexts:** one module owns one bounded context, one PostgreSQL schema, and one set of decisions. No shared tables and no cross-schema joins; the §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports & adapters) per module:** domain core isolated from transport and infrastructure; inbound and outbound adapters (REST, outbox handlers, persistence, providers) plug into ports. Provider integrations (CardPay, MsgHub, Point-of-Sale Records) sit behind anti-corruption adapters.
- **Time:** UTC for every stored and exchanged date-time; conversion to local time happens only in the web apps, with the tenant locale.
- **IDs:** UUIDv7 primary keys, generated in the application.
- **Service authentication:** module-to-module calls are in-process and carry the caller's security context; inbound calls carry Keycloak access tokens, checked at the API gateway and again in the deployable; outbound provider calls use credentials from the secrets manager.
- **Secrets:** never in source code, images, or chart values; injected at runtime from the secrets manager.
- **Idempotency:** an `Idempotency-Key` on every write that touches money, notifications, or an external provider; every event handler deduplicates on `(consumer, event_id)`.
- **Money:** amounts are decimals with an ISO 4217 currency code, never floating point, and are always shown with their currency ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)).
- **Errors:** RFC 9457 Problem Details with an `errorCode` extension; the `detail` says what went wrong and what the user can do next ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); never a stack trace.
- **Schema changes:** Flyway, versioned SQL files only, one migration location per module schema.
- **API versioning:** URI prefix `/v1`; a breaking change is a new version, never an in-place change.

<!-- MASTER: retail-customer-platform-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
