<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Retail Customer Platform
VERSION: 1.0
DEPENDS_ON: 02, 06
PART OF: SDD - Retail Customer Platform
-->

# 11. Cross-Cutting Concerns (Summarized)

Each concern below is the platform-wide default for every module of §13. A module that overrides a default states and justifies the override in its own chunk (13x, part 2).

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL 17+, one database with one schema per module (ADR-03).
- **PK strategy:** UUIDv7, generated in the application, not by the database.
- **Auditing columns on every table:** `created_at` and `updated_at` (UTC timestamps), `created_by` and `updated_by` (the acting subject or the module for system writes), and `version` for optimistic locking.
- **Soft delete:** none on refund, payout, ledger, voucher, and adjustment records: they are append-only or state-machine records, and a correction is a new record. Other rows are removed only by the retention rules of their module (13x).
- **Migrations:** Flyway, versioned SQL files only, one migration location per module schema; expand-contract for any change the previous release cannot read.
- **Naming:** snake_case for schemas, tables, and columns; each module's tables live only in its own schema.
- **Indexing:** `tenant_id` is the first column of every index; unique constraints carry the idempotency invariants (for example, one payout per refund request, one ledger entry per POS record id).
- **JSON columns:** only for outbox payloads and provider response snapshots; never for a field that is filtered, joined, or reported on.

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` in every module (ADR-04); one tenant at go-live.
- **Tenant context:** resolved at the API gateway from the tenant claim of the Keycloak token, carried in the request context through every in-process call, and written into every event and outbox row; outbound provider calls use the tenant's provider credentials.
- **Isolation enforcement:** every repository query filters by `tenant_id`; integration tests prove that a second tenant's rows are invisible; the branch scope inside a tenant is an authorization rule (ADR-08), not a tenant boundary.
- **Cross-tenant access:** none. No query, report, or event handler reads across tenants.

## 11.3 Deployment (Default)

- **Packaging:** one OCI container image for the deployable; the two web apps are built as static bundles.
- **Orchestration:** Kubernetes with one Helm chart for the deployable (ADR-01).
- **Strategy:** rolling update with readiness gates; Flyway migrations of every module schema run before the new version takes traffic and follow expand-contract, so the previous version keeps working during the roll.
- **Configuration:** non-secret settings in the Helm values per environment; secrets injected at runtime from the secrets manager (§6).
- **Resource model:** requests, limits, replica counts, and autoscaling thresholds are set from the §18 targets (part 3).
- **Promotion path:** Dev, then SIT, then UAT, then Prod (§19, part 3); each promotion requires a green pipeline.
- **Health:** liveness and readiness endpoints on the deployable; readiness fails while migrations are pending or the database is unreachable.

## 11.4 Observability (Default)

- **Logging:** structured JSON; mandatory fields: timestamp (UTC), level, module, correlation id, trace id, span id, event name, message. No `tenant_id` or PII at INFO or above; the tenant context is logged only at DEBUG. PII fields (names, email addresses, mobile numbers, card and loyalty card numbers) are masked.
- **Metrics:** Prometheus; RED metrics (rate, errors, duration) per module endpoint and per external adapter; business counters (refund requests submitted, payouts succeeded and failed, points earned, points taken back, vouchers issued, adjustments pending); outbox backlog age per module; Point-of-Sale feed lag.
- **Tracing:** OpenTelemetry across gateway, modules, outbox deliveries, and provider calls, with W3C trace context; sampling rate per §6.
- **Dashboards:** one per module and one per external integration, plus one for the outbox relay and the Point-of-Sale feed.
- **Alerting:** on SLOs (targets in §18, part 3), not on raw resource usage; plus alerts for outbox backlog age, feed lag, circuit breakers left open, and payouts still failing after one day.

## 11.5 Configuration Management (Default)

- **Source of truth:** the Helm values per environment, versioned and reviewed with the deployable.
- **Tooling:** Helm values rendered into Kubernetes configuration at deploy time; Spring Boot profiles per environment.
- **Hot reload:** no; a configuration change is rolled out as a new release.
- **Feature flags:** **[NEEDS CLARIFICATION: whether feature flags are needed at launch, and if so the tool and its scoping (per tenant or per environment).]**
- **Audit:** every configuration change is a reviewed, versioned change with its author and date.

## 11.6 Security (Default)

- **Service-to-service auth:** not applicable inside the deployable (in-process calls). Inbound calls carry Keycloak access tokens checked at the API gateway and again in the deployable (ADR-07); authorization per ADR-08. Outbound provider calls authenticate with credentials from the secrets manager.
- **TLS:** TLS 1.2 or later for every external connection; TLS terminates at the ingress; database connections use TLS.
- **Secret rotation:** **[NEEDS CLARIFICATION: rotation cadence for the database and provider credentials, and who performs it.]**
- **Vulnerability scanning:** **[NEEDS CLARIFICATION: image and dependency scanning tools, cadence, and the severity that blocks a release.]**
- **Dependency scanning:** covered by the tool and policy flagged under vulnerability scanning.
- **CORS policy:** only the origins of the customer and staff web apps; no wildcard origins.
- **Error responses:** RFC 9457 Problem Details with a plain-language `detail` ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); never a stack trace or an internal code in the response body.
- **Staff web app exposure:** **[NEEDS CLARIFICATION: whether the staff web app is reachable from the internet (and then whether staff sign-in needs multi-factor authentication) or only from the branch and head-office network.]**

<!-- MASTER: retail-customer-platform-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
