<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 02, 06
PART OF: SDD - Refunds Platform
-->

# 11. Cross-Cutting Concerns (Summarized)

Each concern below is the platform-wide default for every module; a module that overrides one states and justifies it in its §17.X chunk.

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL 17+, one database, one schema per module plus `platform` for the event publication log (ADR-06).
- **PK strategy:** UUIDv7 generated in the application, never by the database (default per CLAUDE.md).
- **Auditing columns on every table:** `created_at`, `created_by`, `updated_at`, `updated_by` (timestamptz, UTC; the actor is the token subject or `system` for dispatchers and listeners); aggregates also carry `version` for optimistic locking.
- **Soft delete:** none; business states (Cancelled, Rejected, Failed) replace deletes, and ledger rows are append-only.
- **Migrations:** Flyway versioned SQL files per module schema, run once per release by a Helm pre-upgrade job; expand-contract for breaking changes (default per CLAUDE.md).
- **Naming:** snake_case tables and columns; the schema carries the module name, so tables are not prefixed.
- **Indexing:** every index and unique constraint starts with `tenant_id` (default per CLAUDE.md).
- **Exception, schema `platform`:** holds only the event publication log, owned by the platform rather than a module; its rows need no `tenant_id` column (each serialized event carries `tenantId`), and only the deployable's event delivery reads them.
- **JSON columns:** only for event publication payloads and provider responses kept for audit; never read by business rules.

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` in every module (ADR-03).
- **Tenant context:** the gateway resolves the tenant from the `tenant_id` token claim; the deployable's inbound adapter sets it in the call context; ports and event DTOs carry `tenantId`; background jobs take it from the tenant loop (Cross-tenant access below) and listeners from the DTO.
- **Isolation enforcement:** repository tenant filter on every query, plus PostgreSQL row-level security on `tenant_id` set per transaction.
- **Cross-tenant access:** Forbidden for every role. No request-path query crosses tenants; background work (payout and notification dispatchers, the loyalty nightly job) loops over the tenants of the tenant configuration (§11.5) and runs each claim in that tenant's context, so row-level security applies to it too.

## 11.3 Deployment (Default)

- **Packaging:** one OCI container image for the deployable.
- **Orchestration:** Kubernetes, one Helm chart (ADR-01).
- **Strategy:** rolling update with no unavailable replica during the rollout; database changes are backward compatible for one release (expand-contract).
- **Configuration:** Helm values per environment in Git; secrets from the secrets manager (§6).
- **Resource model:** two or more replicas for REFUNDS/NFR-02. [NEEDS CLARIFICATION: CPU and memory requests and limits, and autoscaling bounds.]
- **Promotion path:** Dev -> SIT -> UAT -> Prod; promotion needs a green pipeline, and Prod needs UAT sign-off (§19).
- **Background work across replicas:** the dispatchers coordinate through row claims; every other scheduled job (event re-delivery, §14.10 rule 3; the loyalty nightly integrity job; the notification purge; the payout reconciliation, §17.2) runs in one replica at a time under a database lock; a starting replica does not re-deliver incomplete publications itself, the re-delivery job does, by age.

## 11.4 Observability (Default)

- **Logging:** JSON fields `ts`, `level`, `module`, `trace_id`, `span_id`, `correlation_id`, `event`, `attrs`; `tenant_id` and PII never at INFO or above (default per CLAUDE.md); customer email and mobile are always masked.
- **Metrics:** Prometheus, RED per module and endpoint, plus business gauges: oldest pending payout, take-back lag (§17.X Metrics). Platform metrics: `event_publication_oldest_incomplete_seconds` (gauge, label `event`) and `event_publication_stuck_total` (counter, label `event`), exported by the deployable's event delivery; the gauge alerts before it reaches the 1 hour of LOYALTY/NFR-02.
- **Tracing:** OpenTelemetry with W3C trace context across REST, in-process listeners, dispatchers, and provider calls. [NEEDS CLARIFICATION: sampling rate.]
- **Dashboards:** one per module plus a platform overview with the §18 targets.
- **Alerting:** on SLOs (availability from REFUNDS/NFR-02, payout completion from REFUNDS/NFR-01, take-back lag from LOYALTY/NFR-02), not on raw resource usage (default per CLAUDE.md); paging rules in §20.3.

## 11.5 Configuration Management (Default)

- **Source of truth:** Helm values in Git per environment; secrets in the secrets manager.
- **Tooling:** Helm; Spring Boot externalized configuration.
- **Hot reload:** no; a configuration change rolls out through a rolling update.
- **Feature flags:** [NEEDS CLARIFICATION: is a feature flag tool needed, and which one?]
- **Audit:** every configuration change goes through a reviewed Git change.
- **Tenant configuration:** per environment in the Helm values: tenant ID, currency, default locale, time zone, message template set, and the secrets-manager paths of the provider credentials; a new tenant is a reviewed change made together with its Keycloak configuration (§16.12.1).

## 11.6 Security (Default)

- **Service-to-service auth:** none needed inside the deployable (in-process calls carry the principal); provider calls use per-tenant provider credentials over TLS (§15.1).
- **TLS:** TLS 1.2 or higher on every network hop (recommended baseline). [NEEDS CLARIFICATION: certificate management.]
- **Secret rotation:** [NEEDS CLARIFICATION: rotation cadence for provider credentials and encryption keys.]
- **Vulnerability scanning:** [NEEDS CLARIFICATION: image scanning tool, cadence, and blocking severity.]
- **Dependency scanning:** [NEEDS CLARIFICATION: dependency scanning tool and the policy for critical CVEs.]
- **CORS policy:** only the web app origin of each environment; no wildcard.
- **Personal data:** customer email and mobile are encrypted at rest at column level with keys from the secrets manager and masked in non-production data (REFUNDS/NFR-04).
- **Error messages:** Problem Details `detail` says what went wrong and what the user can do next ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); stack traces and internal codes never reach the client.
- **Control set:** [NEEDS CLARIFICATION: which control set applies to the platform.]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
