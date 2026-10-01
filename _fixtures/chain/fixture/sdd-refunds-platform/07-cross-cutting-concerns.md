<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 02, 06
PART OF: SDD - Refunds Platform
-->

# 11. Cross-Cutting Concerns (Summarized)

Each concern below is the platform default for every module and service; an override is stated and justified in the service's §17.X section.

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL 17+ (ADR-06); [NEEDS CLARIFICATION: HA topology (replicas, failover) and backup and point-in-time recovery policy].
- **PK strategy:** UUIDv7 generated in the application layer, never by the database, so keys are time-ordered and known before insert.
- **Auditing columns on every table:** `tenant_id`, `created_at`, `created_by`, `updated_at`, `updated_by` (UTC `timestamptz`), plus `version` (optimistic locking) on aggregate roots.
- **Soft delete:** none for business records: refund requests, payouts, and points movements are never deleted in normal operation; state changes are status transitions and new movements.
- **Migrations:** Flyway, versioned SQL files only, one history per schema or database; expand-contract for breaking changes.
- **Naming:** snake_case tables and columns, singular table names; `outbox_event` and `inbox_event` in every schema or database that publishes or consumes.
- **Idempotency records:** every module or service that accepts `Idempotency-Key` keeps `idempotency_record` (`tenant_id`, `subject`, `operation`, `idempotency_key`, `request_hash`, `status` in (IN_PROGRESS, COMPLETED), `response_status`, `response_body`, `expires_at`), primary key (`tenant_id`, `subject`, `operation`, `idempotency_key`), where `subject` is the token subject and `operation` the method and route. The record is inserted as IN_PROGRESS in its own transaction before the command runs and completed in the command's transaction. A repeat with the same key and hash replays the stored response; a different hash returns 409 `CONFLICT`; a repeat while IN_PROGRESS returns 409 `REQUEST_IN_PROGRESS` with `Retry-After`; a command that ends in 5xx deletes its record so the client can retry. Records expire 24 hours after creation.
- **Indexing:** every index starts with `tenant_id`; uniqueness rules are unique indexes, never application checks alone.
- **JSON columns:** only for the outbox payload, provider raw responses kept for audit, and `idempotency_record.response_body`; never for queried business fields.

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` (ADR-03).
- **Tenant context:** the `tenant_id` claim on the Keycloak token, resolved at the API gateway; carried in the event envelope (§14.3) and on every outgoing call (the per-tenant provider credential identifies the tenant to an external provider). Partner calls (API-03, API-06) carry no token: the tenant is resolved from the partner key in our path before the provider's signature is verified (ADR-11). Keycloak Admin API reads (API-05): the caller checks that the user's `tenant_id` attribute equals the `tenant_id` of the event it is serving before it uses the data.
- **Isolation enforcement:** repository base classes add the `tenant_id` filter; integration tests assert that a second tenant's rows are invisible.
- **Cross-tenant access:** forbidden in application code; platform operations use database roles outside the application.

## 11.3 Deployment (Default)

- **Packaging:** one OCI container image per deployable: `refunds-platform-core`, `payout-service`, `notification-service`.
- **Orchestration:** on-premises Kubernetes, one Helm chart per deployable (A-2).
- **Strategy:** rolling update with readiness gates; Flyway migrations run before the new version takes traffic and are backward compatible with the running version.
- **Configuration:** environment-specific values from the Helm values file; secrets injected at runtime from the secrets manager (§6).
- **Resource model:** requests and limits on every container; horizontal pod autoscaling on the core and notification-service. [NEEDS CLARIFICATION: CPU and memory requests and limits, replica minimum and maximum, and autoscaling thresholds per deployable.]
- **Promotion path:** Dev -> SIT -> UAT -> Prod; promotion to UAT and Prod needs a green pipeline and a recorded approval (§19).
- **Health and relays:** readiness checks only what a pod needs to answer its synchronous requests, the database. Outbox relays and Kafka consumers never gate readiness; they report through the outbox backlog age and consumer lag alerts (§11.4). Each publishing module or service runs one active relay: the relay holds a PostgreSQL advisory lock on its database, so one replica publishes at a time, in `outbox_event` insertion order.

## 11.4 Observability (Default)

- **Logging:** JSON to stdout with `ts`, `level`, `service`, `module`, `trace_id`, `span_id`, `correlation_id`, `event`; `tenant_id`, `customer_id`, `member_id`, contact details, and payment references are never logged at INFO. Every line carries `tenant_ref`, an opaque, non-reversible alias of the tenant from tenant configuration, never the `tenant_id`.
- **Metrics:** Prometheus; RED metrics (rate, errors, duration) per endpoint and per consumer, consumer lag per group, outbox backlog per publisher, DLQ depth per consumer. Every RED and business metric carries a `tenant_ref` label in addition to the labels listed in §17.1 to §17.4.
- **Tracing:** OpenTelemetry with W3C trace context propagated over HTTP headers and Kafka record headers. [NEEDS CLARIFICATION: sampling rate.]
- **Dashboards:** one per deployable (RED, JVM, database pool, Kafka lag) plus one refund-flow dashboard (requests by status, average and 90th percentile time from submission to PAID against the 3-day objective, payouts pending and failed, take-back lag).
- **Alerting:** alerts fire on SLO burn (§18), DLQ depth above zero, outbox backlog age, and payouts reaching the end of their retry window; [NEEDS CLARIFICATION: paging tool and on-call rotation].

## 11.5 Configuration Management (Default)

- **Source of truth:** Helm values in the deployment repository, one file per environment; permission maps (§16) versioned with the code.
- **Tooling:** Spring Boot externalized configuration read from environment variables and mounted files.
- **Hot reload:** no; a configuration change is a rolling restart.
- **Feature flags:** none in this release.
- **Audit:** every configuration change is a reviewed commit to the deployment repository.

## 11.6 Security (Default)

- **Service-to-service auth:** there is no service-to-service HTTP (ADR-05); a deployable calling a platform component (Keycloak Admin API) uses its own Keycloak client credentials; Kafka clients authenticate per deployable with ACLs limiting each to its own topics and consumer groups. [NEEDS CLARIFICATION: Kafka client authentication mechanism.]
- **TLS:** TLS 1.2 or higher on every connection, including Kafka and PostgreSQL. [NEEDS CLARIFICATION: certificate authority and rotation.]
- **Encryption at rest and key management:** storage-level encryption for PostgreSQL and Kafka volumes, keys held outside the cluster. [NEEDS CLARIFICATION: encryption mechanism and key management service.]
- **Secret rotation:** provider credentials and database passwords rotated on the §20.1.4 procedure. [NEEDS CLARIFICATION: rotation cadence.]
- **Vulnerability scanning:** container image scan in every pipeline; builds fail on critical findings. [NEEDS CLARIFICATION: scanner and threshold for high findings.]
- **Dependency scanning:** dependency check in every pipeline; critical CVEs block the release until patched or formally accepted.
- **CORS policy:** only the web app origin per environment; credentials not allowed cross-origin.
- **User-facing errors:** Problem Details with a plain-language `detail` that says what went wrong and what to do next ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); no stack traces or internal codes reach the user.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
