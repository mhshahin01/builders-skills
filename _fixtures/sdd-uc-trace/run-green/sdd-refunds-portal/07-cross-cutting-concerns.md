<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 02, 06
PART OF: SDD - Refunds Portal
-->

# 11. Cross-Cutting Concerns (Summarized)

Each concern here is the default for every module. A module that overrides a default states and justifies the override in its §17.X chunk.

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL (§6), one database for the deployable, one schema per module (`refund`, `payout`, `notification`), each owned by that module's database role; no cross-schema joins, foreign keys, or grants (ADR-06).
- **PK strategy:** UUIDv7, generated in the application layer (not by the database) to keep index locality and time ordering.
- **Auditing columns on every table:** `created_at` and `updated_at` (timestamptz, UTC); `created_by` and `updated_by` (the caller's subject, or `system` for handlers and schedulers); `version` (optimistic locking) on every aggregate root.
- **Soft delete:** none. Refund requests, payouts, and messages end in terminal states and are never deleted by the application; rows leave only through retention and erasure jobs. **[NEEDS CLARIFICATION: retention periods and the erasure flow per table (see the Retention Policy of each §17.X).]**
- **Migrations:** Flyway, versioned SQL files only, one migration location per module schema; expand-contract changes so old and new application versions can run side by side during a rolling update (AP-10).
- **Naming:** snake_case for tables and columns; the schema name is the module name, so table names carry no module prefix.
- **Indexing:** every index includes `tenant_id`, and every unique business key includes `tenant_id` (ADR-03).
- **JSON columns:** `jsonb` only for outbox and inbox payloads and for raw provider results; domain data is relational.

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` on every row (ADR-03); one tenant at go-live.
- **Tenant context:** resolved from the tenant claim of the Keycloak token (single realm) at the gateway and again in the application; held in the request context; written into every event envelope (§14.3) and carried on every outgoing call in the form each provider supports (§15).
- **Isolation enforcement:** every repository query filters on `tenant_id` through the persistence adapter. Inside a tenant, `refund` adds the own-request (`customer_id`) and own-branch (`branch_id`) filters that NFR-04 requires (§16.2). **[NEEDS CLARIFICATION: add PostgreSQL row-level security as a second guard behind the repository filter?]**
- **Cross-tenant access:** forbidden for user requests. Background schedulers select due rows across tenants and process each row under that row's tenant context; this is the only cross-tenant read.

## 11.3 Deployment (Default)

- **Packaging:** one OCI image for the backend deployable. The SPA ships as static assets. **[NEEDS CLARIFICATION: where the SPA static assets are served from (ingress, CDN, or the backend).]**
- **Orchestration:** Kubernetes, one Helm chart for the deployable (ADR-09).
- **Strategy:** rolling update gated by readiness. **[NEEDS CLARIFICATION: confirm rolling update rather than blue-green for the single deployable.]**
- **Configuration:** Helm values per environment; secrets injected from the secrets manager (§6) at start-up.
- **Resource model:** **[NEEDS CLARIFICATION: CPU and memory requests and limits, minimum and maximum replicas, and autoscaling thresholds, sized from the §18 targets.]**
- **Promotion path:** Dev -> SIT -> UAT -> Prod (§19), each promotion gated by the automated suites of AP-11. **[NEEDS CLARIFICATION: manual approval gates per environment.]**

## 11.4 Observability (Default)

- **Logging:** structured JSON; mandatory fields `timestamp` (UTC), `level`, `module`, `correlation_id`, `trace_id`, `span_id`, `message`. `tenant_id`, customer contact details, and other PII are never logged at INFO level. Retention per the §6 logging row.
- **Metrics:** Prometheus; RED metrics (rate, errors, duration) per endpoint and per event handler; business metrics per module (§17.1-§17.3); outbox and dead-letter backlogs per module.
- **Tracing:** OpenTelemetry for inbound and outbound HTTP, JDBC, and event dispatch; the correlation id travels in the event envelope (§14.3) so one refund can be followed from submission to payout; sampling per the §6 tracing row.
- **Dashboards:** one per module (RED plus business metrics) and one for the outbox, inbox, and dead-letter tables.
- **Alerting:** on SLOs, not on raw resource usage (targets in §18), plus dead-letter arrivals, payout escalations, and payouts whose outcome stays unknown. **[NEEDS CLARIFICATION: alert threshold for a payout whose outcome stays unknown.]** On-call per §20.

## 11.5 Configuration Management (Default)

- **Source of truth:** Git (Helm values per environment); secrets only in the secrets manager.
- **Tooling:** Helm and Spring Boot externalised configuration.
- **Hot reload:** no; a configuration change rolls out as a Helm release.
- **Feature flags:** **[NEEDS CLARIFICATION: feature-flag tool and scoping, if any are needed for this release.]**
- **Audit:** configuration changes go through reviewed Git commits; secret access is audited by the secrets manager.

## 11.6 Security (Default)

- **Service-to-service auth:** not applicable inside the deployable (modules are in-process). Calls to external systems use each provider's scheme (§15) with credentials from the secrets manager. Client calls carry Keycloak-issued JWTs: the SPA uses the authorization code flow with PKCE, the gateway validates the token, and the application validates it again before evaluating the permission token (§16.2).
- **TLS:** HTTPS for every client and external connection. **[NEEDS CLARIFICATION: minimum TLS version and certificate management.]**
- **Secret rotation:** **[NEEDS CLARIFICATION: rotation policy and cadence for provider and database credentials.]**
- **Vulnerability scanning:** **[NEEDS CLARIFICATION: image scanning tool, cadence, and severity thresholds that block a release.]**
- **Dependency scanning:** **[NEEDS CLARIFICATION: tool and policy for critical CVEs.]**
- **CORS policy:** only the portal's own origins may call the API. **[NEEDS CLARIFICATION: origin list per environment.]**
- **Error content:** every error response is RFC 9457 Problem Details whose `title` and `detail` say in plain language what went wrong and what the user can do next, with no stack trace or internal code ([BRD UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)).

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
