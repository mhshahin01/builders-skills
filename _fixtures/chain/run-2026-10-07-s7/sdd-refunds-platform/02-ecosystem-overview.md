<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: Refunds Platform
VERSION: 1.7
DEPENDS_ON: 01
PART OF: SDD - Refunds Platform
-->

# 6. Ecosystem Overview

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | Modular monolith: one deployable (`refunds-platform`) with five DDD modules (§13); in-process module ports and durable in-process domain events; a publication log as the outbox for every outside call that follows a committed state change (exceptions in §8.1.1); hexagonal structure inside each module | n/a | questionnaire (ADR-01, ADR-02, ADR-05) |
| Compute / Infra | Kubernetes, one Helm chart for the one deployable | [NEEDS CLARIFICATION: hosting (an on-premises cluster or a managed cloud Kubernetes service) and the version pins of the cluster stack: Kubernetes, containerd, the ingress controller, Keycloak, Vault, the gateway, and the observability components. Neither BRD names a hosting target.] | questionnaire Q8; default per CLAUDE.md (one container, one Helm chart per deployable) |
| Container Runtime | containerd, the cluster runtime | Per Compute / Infra | recommended |
| Service Mesh / Ingress | Mesh: Not applicable (one deployable, no network calls between modules). Ingress: NGINX Ingress Controller in front of the API gateway, TLS terminated here | Per Compute / Infra | recommended; mesh Not applicable for the chosen style |
| Primary RDBMS | PostgreSQL, one database `refunds_platform`, one schema per module plus the `platform` schema for the publication log | 17+ | BRD-mandated ([REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) "Use PostgreSQL for all data.", [REFUNDS 12 § Technical Inputs for the SDD](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)); version default per CLAUDE.md; one schema per module from questionnaire Q6; primary with one standby replica and point-in-time recovery, recommended for REFUNDS/NFR-02 and LOYALTY/NFR-04 |
| Caching | Not applicable for this release | - | recommended: reads come from PostgreSQL inside the REFUNDS/NFR-05 and LOYALTY/NFR-05 budgets; revisited if the §18.4 tests miss them |
| Event Broker / Streaming | Not applicable for this release | - | questionnaire Q5 (ADR-02): no integration events; in-process domain events in §14.10; Kafka on-premises or SNS+SQS on AWS (CLAUDE.md) at the first extraction (ADR-01 trigger) |
| Object Storage | Not applicable for this release | - | recommended: no files are kept; CSV and Excel exports stream from the modules ([REFUNDS 09](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics), [LOYALTY 09](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics)) |
| IAM / AuthN | Keycloak, one realm: local customer accounts ([REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)) and identity brokering to the member sign-in and the staff sign-in ([LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations)) | Per Compute / Infra | default per CLAUDE.md (Keycloak, single realm); ADR-07 |
| Secrets Management | HashiCorp Vault | Per Compute / Infra | recommended: provider credentials (CardPay Ltd, MsgHub, POS Records, the two sign-in brokers, and the Marketing team for the points balances at go-live) kept per tenant; rotation per §11.6 |
| API Gateway | Spring Cloud Gateway | Per Compute / Infra | recommended: CLAUDE.md places authentication, tenant resolution, rate limiting, and request logging in the gateway; it applies the route classes of §11.6, validates tokens on user routes, and rate-limits sign-up, password reset, the code confirmation endpoints, and receipt lookups |
| CI/CD | [NEEDS CLARIFICATION: CI platform and deployment tool; neither the BRDs nor the CLAUDE.md defaults name one] | - | - |
| Observability: Logging | Structured JSON logs with correlation id, stored in Grafana Loki | Per Compute / Infra | default per CLAUDE.md (format); recommended (store, pairs with Prometheus and Grafana) |
| Observability: Metrics | Prometheus + Grafana | Per Compute / Infra | default per CLAUDE.md (Prometheus metrics, RED per module) |
| Observability: Tracing | OpenTelemetry + Grafana Tempo | Per Compute / Infra | default per CLAUDE.md (OpenTelemetry); recommended (backend) |
| Backend Runtime | Java 21, Spring Boot 3.5+, Spring Modulith (module boundaries and the event publication registry), Resilience4j, Flyway | Java 21; Spring Boot 3.5+ | BRD-mandated ([REFUNDS 12 TI-01](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) "Backend services must be built with Java 21 and Spring Boot."); Spring Boot 3.5+, Resilience4j, and Flyway default per CLAUDE.md; Spring Modulith recommended |
| Frontend Stack | Angular 17+ standalone components, PrimeNG, Tailwind; two apps: Refunds Portal web and Loyalty Points web | Angular 17+ | default per CLAUDE.md; primary color #1F6FEB ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)) |
| Reporting / BI | Not applicable for this release | - | recommended: the two reports are module queries with CSV and Excel export |

**Ecosystem-level rules:**

- **Event-driven by default (EDA):** every cross-service state change travels as an asynchronous event through the Centralized Event Hub (§14); synchronous REST is reserved for true request-response, capped at one hop. In this modular monolith, module-to-module changes use in-process domain events (§14.10) and `Internal (in-process)` port calls (§15); every outside call that follows a committed state change goes through the publication log, which is the outbox (exceptions in §8.1.1). Outbox pattern mandatory - no dual-writes.
- **DDD bounded contexts:** one module owns one bounded context, its data, and one team of decisions: one schema per module with no cross-module joins and no foreign keys across schemas. No shared schemas across modules; the §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports & adapters) per module:** domain core isolated from transport and infrastructure; inbound/outbound adapters (REST, inbound feeds, event listeners, persistence, providers) plug into ports, and modules call each other only through ports. Provider integrations sit behind anti-corruption adapters.
- **Time:** every timestamp is stored and exchanged in UTC (CLAUDE.md). A business date is computed once, by the module that owns the fact, in the branch's time zone: refund-requests for the refund window ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-7: calendar days by the branch's date), the waiting-requests summary, and the refund date in `RefundPaid`; POS Records for the purchase date it reports (API-07). Other modules use the business date they receive and never turn a UTC time into a branch date. Dates with no branch (the day of a correction, the month of the corrections report) use the tenant's business time zone setting. [NEEDS CLARIFICATION: the business time zone for LOYALTY corrections and the monthly corrections report.] Code reads the time only through the business clock (§19).
- **IDs:** UUIDv7 primary keys generated in the application (CLAUDE.md). Business references (reference number, purchase reference, refund reference, member number) are separate columns.
- **Money:** amounts are `decimal(19,4)` with an ISO-4217 code; EUR is the only currency ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary)).
- **Module-to-module auth:** an in-process port checks a §16 permission token held by the calling module's identity; there is no network authentication between modules.
- **External auth and secrets:** outside systems use their own schemes (`TBD - external`, §15.6); credentials live in Vault, never in images, Helm values, or logs.
- **Idempotency:** every write endpoint takes an `Idempotency-Key` and every listener applies each event once (CLAUDE.md).
- **Tenant context:** taken from the token claim on user routes, from the request host on public routes, and from the inbound credential on provider routes, and carried on every port call and in every in-process event DTO (§11.2).
- **Errors:** RFC 9457 Problem Details with plain-language messages and no technical codes shown to users ([REFUNDS 11](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations), Error Messages).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
