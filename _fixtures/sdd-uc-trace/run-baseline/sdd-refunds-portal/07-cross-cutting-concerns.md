<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 02, 06
PART OF: SDD - Refunds Portal
-->

# 11. Cross-Cutting Concerns (Summarized)

Each concern below is the default for every module of §13. A module that overrides a default states and justifies the override in its §17.X section.

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL per §6 and ADR-03: one database `refunds_portal`, one schema per module, no cross-schema joins, reads, or foreign keys.
- **PK strategy:** UUIDv7 generated in the application layer (time-ordered for index locality), never by the database. Business identifiers (for example the refund request reference number) are separate unique columns.
- **Auditing columns on every table:** `created_at`, `updated_at` (`timestamptz`, UTC), `created_by`, `updated_by` (IAM subject, or `system:<module>` for relay and scheduler writes); aggregate roots also carry `version` for optimistic locking.
- **Soft delete:** none. Lifecycle states replace deletion (a cancelled request stays, with status Cancelled); rows are physically deleted only by the retention jobs defined per module (§17.X Retention Policy).
- **Migrations:** Flyway, versioned SQL files only, one migration stream per module schema; migrations run before the new version takes traffic and follow expand-contract (§11.3).
- **Naming:** `snake_case` for schemas, tables, and columns; singular table names; constraint names prefixed by type (`pk_`, `uk_`, `fk_`, `ix_`).
- **Indexing:** every index and unique constraint on a tenant-scoped table leads with `tenant_id`; foreign keys only inside one module schema.
- **JSON columns:** only for outbox and inbox payloads and immutable snapshots; never for a field that is queried or constrained.
- **Money and time:** amounts as `numeric(19,4)` with a `char(3)` ISO-4217 currency column; timestamps as `timestamptz` in UTC.

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` in every module schema (ADR-04).
- **Tenant context:** the API gateway resolves the tenant from the access-token tenant claim and forwards it as `X-Tenant-Id`; the backend cross-checks the header against the validated token and holds it in a request-scoped tenant context. The outbox writes it into every event envelope (`tenant_id`, §14.3) and the relay restores it for each handler. Outbound provider calls select per-tenant credentials and account identifiers from it.
- **Isolation enforcement:** every repository query filters by the current tenant and every write stamps it; a request or event handler without a tenant context fails closed. **[NEEDS CLARIFICATION: add PostgreSQL row-level security as defense in depth, or rely on application-layer filtering alone?]**
- **Cross-tenant access:** forbidden. No API, handler, report, or job spans tenants; operational scripts run per tenant.
- **Logging rule:** `tenant_id` is never logged at INFO; it appears at DEBUG only (§11.4).

## 11.3 Deployment (Default)

- **Packaging:** one OCI image for `refunds-portal-backend`; the `refunds-portal-web` bundle is static files served from the edge (ADR-09).
- **Orchestration:** Kubernetes (§6), one Helm chart for the backend deployable (ADR-09).
- **Strategy:** rolling update with zero unavailable replicas, gated on readiness; a release whose readiness fails is rolled back to the previous chart revision. Database migrations run as a pre-deployment step and are backward compatible with the running version (expand-contract).
- **Configuration:** non-secret configuration from Helm values per environment; secrets injected at runtime from the secrets manager (§6); nothing sensitive in images or values.
- **Resource model:** at least two replicas at all times (NFR-02); CPU and memory requests, limits, and autoscaling thresholds **[NEEDS CLARIFICATION: sized from the §18 targets]**.
- **Promotion path:** Dev → SIT → UAT → Prod; the same image digest is promoted; promotion to UAT and Prod requires green automated tests and an approval **[NEEDS CLARIFICATION: approvers per environment]**.

## 11.4 Observability (Default)

- **Logging:** JSON to standard output. Mandatory fields: `timestamp` (UTC), `level`, `service` (`refunds-portal-backend`), `module`, `correlation_id`, `trace_id`, `span_id`, `message`, and an `event` key for business events. Tenant context at DEBUG only; personal data (email, mobile number, free-text reasons) is never logged. Aggregation product and retention per §6.
- **Metrics:** Prometheus. RED metrics per REST endpoint, event handler, and provider adapter; platform gauges: outbox lag (age of the oldest unpublished row per module), dead-lettered deliveries, open circuit breakers. Module business counters are listed in §17.X Metrics.
- **Tracing:** OpenTelemetry; W3C `traceparent` on every HTTP call; the trace context is stored with each outbox row and restored by the relay, so the asynchronous hop joins the originating trace. Sampling per §6.
- **Dashboards:** one per module (RED, business counters, provider adapter health) and one platform dashboard (relay, dead-letters, database, gateway).
- **Alerting:** on SLOs derived from NFR-02 (§18), not on raw resource usage; plus outbox lag above threshold, any dead-letter, any payout escalation, and an open circuit breaker on a provider. Thresholds and on-call routing **[NEEDS CLARIFICATION: thresholds per alert; on-call in §20]**.

## 11.5 Configuration Management (Default)

- **Source of truth:** Helm values in version control, one file per environment, for deployment configuration. Business parameters that the BRD states as rules (the refund window of [BRD 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and the escalation window of UC-04 E1) are tenant-level configuration whose launch values are the BRD values.
- **Tooling:** Spring Boot externalised configuration bound to typed, validated configuration records; the application fails at start-up on a missing or invalid value.
- **Hot reload:** no. Configuration changes roll out through a rolling update.
- **Feature flags:** not applicable for this release.
- **Audit:** deployment configuration changes are audited through version-control history; tenant-level parameter changes are recorded with actor and time.

## 11.6 Security (Default)

- **Service-to-service auth:** there are no network calls between modules (ADR-01). Edge to backend: the JWT is validated by the gateway and again by the backend (ADR-06). Backend to providers: each provider's scheme with per-tenant credentials from the secrets manager (`TBD - external`, §15.6). Provider callbacks (API-04) are authenticated with the provider's scheme (`TBD - external`).
- **TLS:** TLS 1.2 or higher on every hop that leaves the cluster (browser to edge, backend to providers). **[NEEDS CLARIFICATION: TLS inside the cluster (gateway to backend, backend to PostgreSQL) and certificate management.]**
- **Secret rotation:** secrets are read from the secrets manager at runtime so they rotate without a rebuild. **[NEEDS CLARIFICATION: rotation cadence per secret type.]**
- **Vulnerability scanning:** **[NEEDS CLARIFICATION: image scanner, cadence, and the severity that blocks a release.]**
- **Dependency scanning:** **[NEEDS CLARIFICATION: dependency scanning tool and the policy for critical CVEs.]**
- **CORS policy:** only the SPA's own origin per environment; no wildcards; no cross-origin credentials.
- **Personal data (NFR-04):** customer contact data is stored only in the refund-requests module, encrypted at rest (§17.1 Data Encryption), masked in non-production environments, and never placed in events or INFO logs.
- **Rate limiting:** at the gateway per user and per client address, stricter on receipt lookups (R-05). **[NEEDS CLARIFICATION: limits per route.]**

## 11.7 API Error Model & UX-Driven Standards

- **Error model:** every HTTP error is an RFC 9457 Problem Details document (`application/problem+json`) with `type`, `title`, `status`, `detail`, `instance`, and the extensions `errorCode` (stable, `SCREAMING_SNAKE_CASE`), `correlationId`, and `errors[]` (field, `errorCode`) for validation failures. Standard codes are in §15.1; each module's domain codes are in its §17.X Error Handling.
- **Actionable messages ([BRD 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)):** the SPA maps each `errorCode` to a localised message that says what went wrong and what the user can do next; raw codes, stack traces, and provider errors are never shown.
- **Amounts:** every amount in an API response or event is a `Money` (amount and ISO-4217 currency, §14.9.0), so the UI can always show the currency.
- **Dates:** ISO-8601 UTC in APIs; the SPA formats dates, numbers, and currency with the tenant locale, not the browser locale.
- **Responsive customer screens:** the customer area of `refunds-portal-web` is built for phones and computers.
- **Languages:** i18n from the first release with right-to-left support; message templates in §17.3 are per locale. **[NEEDS CLARIFICATION: languages to support at launch.]**

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
