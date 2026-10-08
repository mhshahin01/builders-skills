<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Refunds Platform
VERSION: 1.12
DEPENDS_ON: 02, 06
PART OF: SDD - Refunds Platform
-->

# 11. Cross-Cutting Concerns (Summarized)

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL 17+, one database `refunds_platform`, one schema per module (ADR-06).
- **PK strategy:** UUIDv7 generated in the application, never by the database (CLAUDE.md); with shared-schema tenancy every primary key is `(tenant_id, id)`.
- **Auditing columns on every table:** `created_at`, `created_by`, `updated_at`, `updated_by` (UTC, actor id or module name), and `version` for optimistic locking on every aggregate root.
- **Soft delete:** not used. Retention jobs unlink, anonymise, or delete rows as the BRDs set ([REFUNDS 03 § Refund records](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-records), [LOYALTY 03 § Membership end and data retention](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention)).
- **Migrations:** Flyway, versioned SQL files only (CLAUDE.md), one location per module schema, applied at deployment before the new version takes traffic.
- **Naming:** snake_case tables and columns, singular table names, `fk_`, `uk_`, `ix_` prefixes.
- **Indexing:** every key and index of a module table starts with `tenant_id` (CLAUDE.md, ADR-03).
- **JSON columns:** not used for business data; allowed only for the opaque payload of an inbound provider message kept for audit (§17.3), the first response of an idempotent request kept for replay, and the template parameters of a message waiting to be sent (§17.4).
- **Common module tables:** each module schema that needs them holds `inbox_entry` (one row per event a listener handled, DONE or PARKED), `idempotency_record` (the first response of each `Idempotency-Key`, replayed for a repeated key), and `role_permission` (the seed of §16.12.1).
- **Publication log (modular monolith, durable in-process events, §14.10):** `platform.event_publication` (Spring Modulith registry), written in the publisher's transaction. A listener that leads to an outside call records the work in its own schema under a unique key, so a redelivered event adds no second record (the payout of §17.3, one per refund request; the message of §17.4, one per source publication, channel, and recipient; the items notice of §17.2, one per request, marked due), and completes; it may make the first try right after its commit, and a send job of its module (one replica, under the job lock) makes every later try with exponential backoff and jitter until success or the module's give-up limit. A single `publication-resubmit` job (one replica, under the job lock) resubmits entries incomplete for more than 5 minutes, once a minute; nothing is resubmitted on restart. Completed entries are deleted after 7 days. A release keeps listener identities stable; a release that renames, moves, or removes a listener ships a migration that completes or re-targets that listener's incomplete entries.

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` in every module (ADR-03); one tenant at go-live.
- **Tenant context:** the `tenant_id` claim of the Keycloak token, set by a realm mapper; on user routes, the gateway rejects a token without it; on public routes, the gateway sets the tenant from the request host; the deployable keeps it in a request-scoped context and copies it into every port call and every in-process event, so listeners run in the publisher's tenant. Inbound provider calls map their credentials to a tenant in the inbound adapter.
- **Isolation enforcement:** a Hibernate tenant filter on every module repository, plus PostgreSQL row-level security on every module table keyed by a session setting the deployable sets per transaction.
- **Cross-tenant access:** forbidden; no endpoint, port, job, or report reads across tenants. `tenant_id` is never written to logs at INFO (CLAUDE.md).
- **Tenant registry:** `platform.tenant` (`tenant_id`, name, status) lists the tenants; every scheduled job runs one transaction per active tenant with the tenant session setting set, and row-level security returns no row to a transaction without it.
- **Tenant on redelivery:** every in-process event DTO carries `tenantId` and `correlationId`, and the listener sets both before it runs, so a resubmitted entry runs in its publisher's tenant without a request (§14.1).
- **Platform tables:** `platform.event_publication`, `platform.tenant`, any job-lock table, and the Flyway history tables are platform-owned and outside the `tenant_id`-first rule of ADR-03 and AP-06; no module query reads them.

## 11.3 Deployment (Default)

- **Packaging:** one OCI container image of the Spring Boot application.
- **Orchestration:** Kubernetes, one Helm chart `refunds-platform` (questionnaire Q8).
- **Strategy:** rolling update with no unavailable replica during the roll; Flyway runs before the new version takes traffic, with expand-then-contract changes so the old version keeps working.
- **Configuration:** Helm values per environment for non-secret settings; secrets from Vault, injected at start.
- **Resource model:** at least 2 replicas spread over two nodes; a database lock makes each scheduled job run on one replica. [NEEDS CLARIFICATION: CPU and memory requests and limits, and the autoscaling thresholds; §18 gives no load numbers to size them.]
- **Promotion path:** Dev, SIT, UAT, Prod. Promotion to Prod needs: the BAT sign-off of both BRD test suites ([REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md), [LOYALTY 16](../brd-loyalty-points/16-uat-bat-test-cases.md)); and, for go-live, the points balances at go-live delivered and imported (API-09), a dependency needed before go-live ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)).
- **Request path:** the ingress controller, the API gateway, and Keycloak each run at least 2 replicas over two nodes with rolling updates; Keycloak keeps its own PostgreSQL database with a standby; each PostgreSQL primary fails over to its standby automatically within 5 minutes; a pod that cannot reach Vault at start stays not ready and raises an alert, while running pods keep serving.

## 11.4 Observability (Default)

- **Logging:** JSON to stdout with `timestamp`, `level`, `module`, `correlation_id`, `trace_id`, `span_id`, `event`, and fields free of PII; no `tenant_id` or PII at INFO (CLAUDE.md); collected into Loki.
- **Metrics:** Prometheus; RED metrics per HTTP endpoint and per port, listener lag and incomplete publications from the publication log, provider call outcomes per adapter, JVM and connection-pool metrics.
- **Tracing:** OpenTelemetry across the gateway, HTTP endpoints, ports, listeners, and provider calls; W3C trace context on outbound calls; [NEEDS CLARIFICATION: trace sampling rate].
- **Dashboards:** one per module (RED, listener lag, provider outcomes) and one platform dashboard (availability against the §18.5 budgets).
- **Alerting:** on SLOs, not raw resource use (CLAUDE.md): error-budget burn for the availability budgets of §18.5, incomplete publications older than 15 minutes, purchase-feed lag, payouts nearing the payout deadline (§17.3), every give-up of a send job, and an `account-closure` run stopped by an incomplete read of the Keycloak sign-in events (§17.1).
- **Availability measure:** a minute is unavailable when, at the ingress, more than 5% of the `GET /v1/points-balance` and `GET /v1/points-movements` requests fail or exceed 2 s (LOYALTY/NFR-04), or more than 5% of the Refunds Portal web requests fail or exceed 3 s (REFUNDS/NFR-02); a synthetic probe runs every minute so quiet minutes are measured; answers that carry [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E4, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1, or [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) E3 do not count for REFUNDS/NFR-02.

## 11.5 Configuration Management (Default)

- **Source of truth:** the Helm values in Git per environment; secrets in Vault.
- **Tooling:** Spring Boot externalised configuration, bound to typed configuration records.
- **Hot reload:** No; a configuration change rolls the deployment.
- **Feature flags:** none in this release; each scheduled job has an enable setting per environment.
- **Audit:** Git history for configuration; Vault audit log for secrets.

## 11.6 Security (Default)

- **Service-to-service auth:** not applicable between modules (one process); ports check §16 tokens (§15.1). Outside systems use their own schemes, `TBD - external` (§15.6), with credentials from Vault.
- **TLS:** TLS 1.2 or later at the ingress and on every outbound provider call; certificates managed by the cluster. [NEEDS CLARIFICATION: certificate issuer and renewal tooling]
- **Secret rotation:** [NEEDS CLARIFICATION: rotation cadence for provider credentials and the Keycloak client secrets]
- **Vulnerability scanning:** [NEEDS CLARIFICATION: container image scanning tool, cadence, and the severity that blocks a release]
- **Dependency scanning:** [NEEDS CLARIFICATION: dependency scanning tool and the policy for critical CVEs]
- **CORS policy:** only the origins of the two web apps, per environment; credentials allowed only for them.
- **Gateway route classes:** user routes need a Keycloak token with the `tenant_id` claim (§11.2). Public routes, the five sign-up and password reset endpoints of §17.1, need no token and are rate-limited per client address and per email address. Provider routes, the inbound endpoints of API-04, API-07, API-08, and API-09, need no Keycloak token; each accepts only its provider's source addresses, has a body-size limit and a rate limit per provider, and is authenticated by the provider's signature or mutual TLS in the inbound adapter (`TBD - external`), which maps the credential to the tenant (§11.2).
- **Attempt limits:** the code, reset, and sign-in limits of §17.1 and ADR-07; the gateway also rate-limits `POST /v1/sign-ups/{signUpId}/confirmation`, `POST /v1/sign-ups/{signUpId}/codes`, and `POST /v1/password-resets/{passwordResetId}/confirmation` per client address.
- **UX standards that touch the backend:** errors are Problem Details with a plain-language `detail` and no technical codes shown to users; lists page server-side with 20 rows by default ([REFUNDS 11](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)); the two reports export to CSV and Excel; amounts carry EUR. Dates, numbers, and amounts follow each product's rule: the branch country's formats with the code EUR in Refunds Portal web, its messages, and the branch refund report ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); DD/MM/YYYY and two decimals with the code EUR (12.80 EUR) in Loyalty Points web and the monthly corrections report ([LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)). APIs and events carry `Money` (§14.9.0) and ISO-8601 dates; only the web apps, the message templates, and the report exports format them.
- **Staff personal data:** the branch manager and cover contact details synced from API-06 and the staff ids in decisions, status history, and staff sessions (§17.2), the staff ids of message recipients (§17.4), and the Loyalty Administrator id of each correction and of the monthly corrections report (§17.5) are personal data of employees, processed to run the branches' refund work and the points corrections, not under a customer's or a member's contract. Lawful basis: legitimate interests (GDPR Art. 6(1)(f)) for assigning branch refund work, sending staff their operational messages, and recording accountability for refund decisions and points corrections; owner the Data Protection Officer (LOYALTY/NFR-07). The deciding branch manager's id uses this staff basis; the customer refund-record basis in §17.2 does not supply a separate staff legal obligation.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
