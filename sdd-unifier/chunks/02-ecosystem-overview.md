<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01, 08 (the Integration landscape links the §12 rows)
PART OF: SDD - [Project Name]
-->

# 6. Ecosystem Overview

<!--
Summary of the platform-wide technology stack and shared infrastructure that all services in this SDD must conform to.
This section is the single source of truth for the implementation constitution and planned technology choices.
SELECTION FLOW: this table is never filled silently. SKILL.md step 3c shows the proposed ecosystem, each row Locked with its source or Proposed with its basis, and asks one question: accept all proposed, answer one by one, or import the project's eco-system file (`[project-slug]-eco-system.md` in the project root). The precedence, the import rules, and the label lists are in SKILL.md step 3c.
STATUS: `Confirmed` or `Proposed` (SKILL.md step 3c item 6). A finished first build has no `Proposed` row, except the one case step 3c item 6 names. A row a later update adds stays `Proposed`, with a [NEEDS CLARIFICATION: ...] marker, until the user confirms it.
SOURCE: one label per row, from the lists in SKILL.md step 3c items 1 and 6. The evidence behind it goes in Notes: the BRD Technical Input as a keyed link, the eco-system file section, or the ADR.
A table written before the Status and Source columns keeps its source labels in Notes and is read as it is (SKILL.md step 10).
-->

| Layer | Technology / Service | Version / Tier | Status | Source | Notes |
|-------|----------------------|----------------|--------|--------|-------|
| Architecture Doctrine | [Style and communication model from the architecture questionnaire, e.g., Modular monolith with in-process module ports, or Microservices + EDA backbone; DDD (bounded contexts) + Hexagonal (ports & adapters) in every style] | n/a | [Status] | [questionnaire; when it did not run, the source's label, else recommended and flagged in §8.1] | [ADR-01] |
| Compute / Infra | [On-prem Kubernetes / EKS / AKS / GKE] | [vX.Y] | [Status] | [Source] | [Notes; the regions or sites, clusters, zones, and node pools are in §8.6] |
| Container Runtime | [containerd / Docker] | [vX.Y] | [Status] | [Source] | [Notes] |
| Service Mesh / Ingress | [Istio / Linkerd / NGINX Ingress / Cloud LB] | [vX.Y] | [Status] | [Source] | [Notes; the mTLS points and network policies are in §8.7] |
| Primary RDBMS | [PostgreSQL / other] | [Version] | [Status] | [Source] | [Notes; the HA topology and backups are in §8.6] |
| Caching | [Redis / ElastiCache / other] | [Version] | [Status] | [Source] | [Eviction and other settings; the cluster mode and persistence are in §8.6] |
| Event Broker / Streaming | [Kafka / SNS+SQS / RabbitMQ / ActiveMQ] | [Version] | [Status] | [Source] | [Notes; the topics are in §14, their retention and partitions in each §17.X Messaging Infra, and the broker's topology and scale unit in §8.6] |
| Object Storage | [S3 / MinIO / Azure Blob / other] | [Tier] | [Status] | [Source] | [Bucket strategy, lifecycle policies] |
| IAM / AuthN | [Keycloak / Cognito / Auth0 / other] | [Version] | [Status] | [Source] | [Realms, federation, OIDC flows] |
| Secrets Management | [Vault / Secrets Manager / Sealed Secrets] | [Version] | [Status] | [Source] | [Rotation policy] |
| API Gateway | [Kong / API Gateway / Spring Cloud Gateway] | [Version] | [Status] | [Source] | [Auth, rate limiting, routing] |
| CI/CD | [GitHub Actions / GitLab CI / Jenkins / ArgoCD] | [Version] | [Status] | [Source] | [Pipeline standards] |
| Observability: Logging | [Loki / ELK / CloudWatch / other] | [Version] | [Status] | [Source] | [Retention, indices] |
| Observability: Metrics | [Prometheus + Grafana / Datadog / other] | [Version] | [Status] | [Source] | [Scrape interval, dashboards] |
| Observability: Tracing | [OpenTelemetry + Jaeger / Tempo / X-Ray] | [Version] | [Status] | [Source] | [Sampling rate] |
| Backend Runtime | [Language + Framework, e.g., Java 21 / Spring Boot 3.5+] | [Version] | [Status] | [Source] | [Layering rules] |
| Frontend Stack | [Framework + UI lib, e.g., Angular / Tailwind / PrimeNG] | [Version] | [Status] | [Source] | [Design system; primary color, as its `ui-ux-global-constitution.md` token name when the project has one (SKILL.md principle 19)] |
| Reporting / BI | [Tool] | [Version] | [Status] | [Source] | [Read-replica or warehouse-backed] |

**Ecosystem-level rules:**

<!-- The first three rules are platform defaults (EDA / DDD / Hexagonal), adapted to the style in ADR-01 (architecture-questionnaire.md § Effect on the SDD): microservices keep the service wording; a modular monolith or hybrid core also writes the module variant. Any other override of them needs an ADR in §10. -->

- **Event-driven by default (EDA):** every cross-service state change travels as an asynchronous event through the Centralized Event Hub (§14); synchronous REST is reserved for true request-response, capped at one hop. In a modular monolith or hybrid core, module-to-module changes use in-process domain events (§14.10) and `Internal (in-process)` port calls (§15); durable integration events that leave the process go through the hub. Durable publication and provider writes that must follow a state change use a transactional outbox - no dual-writes. Synchronous reads and in-process events have separate guarantees.
- **DDD bounded contexts:** one service or module owns one bounded context, its data, and one team of decisions: one database per service, or one schema per module with no cross-module joins in a modular monolith. No shared schemas across services or modules; the §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports & adapters) per service or module:** domain core isolated from transport and infrastructure; inbound/outbound adapters (REST, messaging, persistence, providers) plug into ports, and modules call each other only through ports. Provider integrations sit behind anti-corruption adapters.
- [Rule, e.g., timezone - UTC for all datetimes]
- [Rule, e.g., ID strategy - UUIDv7 primary keys]
- [Rule, e.g., service-to-service auth]
- [Rule, e.g., secrets handling]

**Integration landscape:**

<!-- One row per external system of the eco-system: every system in §12, and every system an imported eco-system file describes in its Part C (SKILL.md step 3c item 8). System: the name §12 uses, else the heading of the file's block. Owner (role): the role that owns the system on its side (the provider, a partner bank, another team), from the eco-system file or the BRD integrations, else a [NEEDS CLARIFICATION: ...] marker. Role in the eco-system: the kind of system it is for the platform, in a few words (payment provider, notification channel, identity provider, record system); the integration's purpose stays in §12. Interface style: how the platform and the system meet (synchronous API, callback, batch file, message channel). Spec source: the eco-system file section as a link, when an imported file describes the system; else another provider document the SDD cites; else `Awaiting`. §12 row: the INT-NN, linked to §12, or `-` when the platform does not integrate with the system in this release. Protocol, auth, timeouts, rate limits, and contract fields stay in §12 and §15: they are linked, never repeated. -->

| System | Owner (role) | Role in the eco-system | Interface style | Spec source | §12 row |
|--------|--------------|------------------------|-----------------|-------------|---------|
| [System] | [Owner role] | [Role] | [Interface style] | [[[project-slug]-eco-system.md § [System]](../[project-slug]-eco-system.md#[system-anchor]) / provider document / Awaiting] | [[INT-NN](./08-integrations.md#12-integrations) / -] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
