<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 02, 06
PART OF: SDD - Refunds Platform
-->

# 11. Cross-Cutting Concerns (Summarized)

Each concern below is the platform-wide default; a module or service overrides it only in its own §17.X section, with the reason.

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL 17+ (ADR-06); the core database holds one schema per module, each extracted service has its own database.
- **PK strategy:** UUIDv7, generated in the application layer, never by the database. Every primary key leads with `tenant_id` (`(tenant_id, id)`, or `(tenant_id, <natural key>)` where a table has no id), and every foreign key is `(tenant_id, <parent id>)` referencing the parent's composite key, so no row can reference another tenant's row (ADR-03).
- **Auditing columns on every table:** `created_at`, `created_by`, `updated_at`, `updated_by` (UTC timestamps; the actor is the token subject or the deployable's name), and `version` for optimistic locking on aggregates.
- **Soft delete:** none. Lifecycle states replace deletes (a refund request is Cancelled, never deleted); retention jobs purge rows at the end of their retention period (§17.X Retention Policy).
- **Migrations:** Flyway, versioned SQL files only, one migration folder per module or service; expand-contract for breaking changes.
- **Naming:** `snake_case`, singular table names, schema per module in the core (`refund`, `loyalty`), plus the infrastructure schema `core_events`.
- **Indexing:** every index starts with `tenant_id` (CLAUDE.md platform rule), primary and foreign keys included (PK strategy above); unique business keys are unique per tenant.
- **JSON columns:** only for the outbox payload, the publication log payload, and the inbox; domain data is relational.
- **In-process publication log:** the core's in-process event publication log (`event_publication`) is core infrastructure in its own schema `core_events`, owned by no module: the eventing infrastructure writes an entry in the publisher's transaction and marks it completed when the listener's transaction completes; module code never reads or writes it. Each entry keeps the event's `schemaVersion`; the event evolves additively (§14.6 rule 5), so an entry written by the previous version still replays after a rolling update. Completed entries are purged after 7 days. The publication-log replay (one replica at a time, under a database lock) resubmits every publication still incomplete 5 minutes after it was recorded, every 5 minutes.

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` in every module and service (ADR-03).
- **Tenant context:** resolved by the API gateway from the `tenant_id` token claim and forwarded to the core; carried in the `tenant_id` field of every event envelope (§14.3); taken from the envelope by every consumer.
- **Isolation enforcement:** every repository query filters by the tenant of the request or event, and PostgreSQL row-level security policies on every tenant table enforce the same rule as a second line.
- **Cross-tenant access:** forbidden; no endpoint, query, or report spans tenants.
- **Messaging tables and workers:** messaging tables (outbox, inbox, publication log) and child tables carry `tenant_id` like every other table, leading their indexes (inbox key `tenant_id`, `consumer`, `event_id`). Background workers (outbox relays, `payout-retry`, `message-retry`, publication-log replay, `loyalty-purchase-import`) run under a worker database role whose row-level security policy lets it select due rows of its own work table across tenants; each unit of work then sets the row's tenant for its transaction, so domain tables stay under the tenant policy.
- **Tenant settings:** each tenant has an IANA time zone, an ISO 4217 currency, a locale, a points earn rate (the [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) earning rule, owned by the LOYALTY product manager and changed only with that rule; each member purchase records the rate it earned at, §17.4), the payout retry window `payoutRetryWindow` (its default is in §17.2 Constraints), and the retention settings `refundRecordRetention`, `contactDetailsRetention`, and `messageLogRetention` (§17.1, §17.3), held in the environment's Helm values keyed by `tenant_id` (§11.5) and read at start by the core, payout-service, and notification-service. refund-service uses the time zone for the 30-day window and the report day, and `payoutRetryWindow` for its payout watchdog; payout-service uses `payoutRetryWindow` for the retry window, so both count one window from the approval; loyalty-service earns only on purchases in the tenant currency; notification-service and the web app use the locale. A tenant has one locale; whether customers need more than one language is part of the REFUNDS rollout plan (REFUNDS OI-15), and a second language would make the locale a per-customer choice.

## 11.3 Deployment (Default)

- **Packaging:** one OCI container image per deployable, built once and promoted unchanged.
- **Orchestration:** on-prem Kubernetes, one Helm chart per deployable (ADR-09).
- **Strategy:** rolling update with readiness gates; database migrations run before the new version takes traffic and stay backward compatible with the running version.
- **Health checks:** readiness covers only what a deployable's synchronous requests need; asynchronous dependencies (Kafka, providers) are watched by alerts, never by readiness.
- **Configuration:** Helm values per environment; secrets injected at runtime from the secrets manager (§6).
- **Resource model:** requests and limits per container and an HPA per backend deployable. [NEEDS CLARIFICATION: CPU and memory requests and limits, and HPA minimum and maximum replicas per deployable.]
- **Promotion path:** Dev -> SIT -> UAT -> Prod; promotion to UAT and Prod needs green integration and contract tests, and Prod needs a UAT sign-off.

## 11.4 Observability (Default)

- **Logging:** structured JSON; mandatory fields `timestamp`, `level`, `deployable`, `module`, `trace_id`, `span_id`, `correlation_id`, `tenant_ref`, `event`. Every log line carries `tenant_ref`, a keyed hash of `tenant_id` (key in the secrets manager, first 12 hex characters); `tenant_id` itself stays DEBUG-only. Customer contact details and other personal data are never logged at INFO or above. No personal data travels in a URL path or query string, in any API: identifiers such as receipt numbers go in the request body. The gateway's request logs record the route template, the status, and `tenant_ref`, never the raw URL, a request body, or the tenant's host name.
- **Metrics:** Prometheus; RED metrics per endpoint and per consumer, plus outbox backlog, publication log backlog, consumer lag per group, DLQ depth, and provider call latency and errors per contract. RED metrics, consumer lag, and DLQ depth carry a `tenant_ref` label (one value per tenant).
- **Tracing:** OpenTelemetry with W3C trace context from the web app through the gateway, the core, Kafka headers, and the services; the sampling rate is set in the §6 tracing row. Spans record the route template, not the raw URL or the host name, and no personal data as an attribute. Gateway logs and trace storage are personal-data stores only by mistake; their §6 retention bounds such a mistake (§14.9 erasure map).
- **Dashboards:** one per deployable (RED, JVM, database pool, consumer lag) and one per business flow (requests submitted, decisions, payouts, take-backs).
- **Alerting:** on service level objectives, not on raw resource use: availability of the web and API paths against the §18 target, payout outcomes, `refund_payout_outcome_overdue_requests` above zero (§17.1), take-back lag against LOYALTY/NFR-02, earn lag against LOYALTY/NFR-03, DLQ depth above zero, outbox backlog age, and an incomplete publication older than 30 minutes.

## 11.5 Configuration Management (Default)

- **Source of truth:** Helm values in Git, one file per environment.
- **Tooling:** Helm and Kubernetes ConfigMaps for configuration; the secrets manager for credentials.
- **Hot reload:** no; a configuration change rolls the deployment.
- **Feature flags:** none in this release.
- **Audit:** every configuration change is a reviewed Git commit; secret access is audited by the secrets manager.

## 11.6 Security (Default)

- **Service-to-service auth:** no synchronous calls between deployables (ADR-05). Kafka clients authenticate per deployable over TLS, and topic ACLs let only the owner write a topic and only its listed consumers read it (§14.4). External providers authenticate with their own schemes (§15).
- **User auth:** Keycloak-issued JWTs, validated at the API gateway and again in the core (ADR-07); permission tokens per §16.
- **TLS:** TLS 1.2 or later on every connection, including database and Kafka connections. [NEEDS CLARIFICATION: certificate issuance and renewal on the on-prem platform.]
- **Data at rest:** database volumes and backups are encrypted at rest (REFUNDS/NFR-04). [NEEDS CLARIFICATION: encryption mechanism and key management on the on-prem platform.]
- **Secret rotation:** provider and database credentials rotate without a redeploy. [NEEDS CLARIFICATION: rotation cadence per secret.]
- **Vulnerability scanning:** container images scanned in CI; critical findings block promotion. [NEEDS CLARIFICATION: scanning tool and severity thresholds.]
- **Dependency scanning:** dependencies scanned on every build; a critical CVE blocks promotion until patched or accepted by the security owner. [NEEDS CLARIFICATION: scanning tool.]
- **CORS policy:** only the tenant hosts of the web app are allowed, per environment (§16.2); no wildcard origins.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
