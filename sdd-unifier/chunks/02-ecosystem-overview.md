<!--
CHUNK: 02
TITLE: Ecosystem Overview
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01
PART OF: SDD - [Project Name]
-->

# 6. Ecosystem Overview

<!--
Summary of the platform-wide technology stack and shared infrastructure that all services in this SDD must conform to.
This section is the single source of truth for the implementation constitution and planned technology choices.
SELECTION FLOW: this table is never filled silently. Per SKILL.md § Ecosystem selection, the skill first presents the proposed ecosystem (BRD Technical Inputs verbatim > CLAUDE.md defaults > BRD-informed recommendations; in TRANSFORM, the source SDD's named technologies, versions, and topology come first, locked as `source SDD`) for a one-shot accept-all; if not accepted, it walks the user through the items in grouped batches, highlighting the recommended option per item with the BRD evidence that drives it. Record the outcome per row in the Notes column (e.g., "BRD-mandated", "source SDD", "default accepted", "user override - see ADR-NN").
-->

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | [Microservices + EDA (event-driven backbone) + DDD (bounded contexts) + Hexagonal (ports & adapters) per service - the platform default] | n/a | [Confirmed in ecosystem selection; deviations need an ADR] |
| Compute / Infra | [On-prem Kubernetes / EKS / AKS / GKE] | [vX.Y] | [Cluster topology, node groups, multi-AZ, etc.] |
| Container Runtime | [containerd / Docker] | [vX.Y] | [Notes] |
| Service Mesh / Ingress | [Istio / Linkerd / NGINX Ingress / Cloud LB] | [vX.Y] | [mTLS, traffic policies] |
| Primary RDBMS | [PostgreSQL / other] | [Version] | [HA topology, replicas, backups] |
| Caching | [Redis / ElastiCache / other] | [Version] | [Cluster mode, persistence, eviction] |
| Event Broker / Streaming | [Kafka / SNS+SQS / RabbitMQ / ActiveMQ] | [Version] | [Topic strategy, retention, partitions] |
| Object Storage | [S3 / MinIO / Azure Blob / other] | [Tier] | [Bucket strategy, lifecycle policies] |
| IAM / AuthN | [Keycloak / Cognito / Auth0 / other] | [Version] | [Realms, federation, OIDC flows] |
| Secrets Management | [Vault / Secrets Manager / Sealed Secrets] | [Version] | [Rotation policy] |
| API Gateway | [Kong / API Gateway / Spring Cloud Gateway] | [Version] | [Auth, rate limiting, routing] |
| CI/CD | [GitHub Actions / GitLab CI / Jenkins / ArgoCD] | [Version] | [Pipeline standards] |
| Observability: Logging | [Loki / ELK / CloudWatch / other] | [Version] | [Retention, indices] |
| Observability: Metrics | [Prometheus + Grafana / Datadog / other] | [Version] | [Scrape interval, dashboards] |
| Observability: Tracing | [OpenTelemetry + Jaeger / Tempo / X-Ray] | [Version] | [Sampling rate] |
| Backend Runtime | [Language + Framework, e.g., Java 21 / Spring Boot 3.4+] | [Version] | [Layering rules] |
| Frontend Stack | [Framework + UI lib, e.g., Angular / Tailwind / PrimeNG] | [Version] | [Design system, primary color] |
| Reporting / BI | [Tool] | [Version] | [Read-replica or warehouse-backed] |

**Ecosystem-level rules:**

<!-- The first three rules are platform defaults (EDA / DDD / Hexagonal). Keep them unless the user explicitly overrode them during ecosystem selection - an override needs an ADR in §10. -->

- **Event-driven by default (EDA):** every cross-service state change travels as an asynchronous event through the Centralized Event Hub (§14); synchronous REST is reserved for true request-response, capped at one hop. Outbox pattern mandatory - no dual-writes.
- **DDD bounded contexts:** one service owns one bounded context, one database, one team of decisions. No shared schemas across services; the §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports & adapters) per service:** domain core isolated from transport and infrastructure; inbound/outbound adapters (REST, messaging, persistence, providers) plug into ports. Provider integrations sit behind anti-corruption adapters.
- [Rule, e.g., timezone - UTC for all datetimes]
- [Rule, e.g., ID strategy - UUIDv7 primary keys]
- [Rule, e.g., service-to-service auth]
- [Rule, e.g., secrets handling]

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 01-executive-summary-scope-risks.md | NEXT: 03-users-and-use-cases.md -->
