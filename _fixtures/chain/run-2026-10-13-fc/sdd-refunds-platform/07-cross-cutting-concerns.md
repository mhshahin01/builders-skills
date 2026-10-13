<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 02, 06
PART OF: SDD - Refunds Platform
-->

# 11. Cross-Cutting Concerns (Summarized)

Each concern below is the platform default for every module; a module states an override in its own chunk (§17.X) with the reason.

## 11.1 DB Modeling (Default)

- **Engine:** PostgreSQL 17+ (ADR-06), one database, one schema per module.
- **PK strategy:** UUIDv7 generated in the application (time-ordered for index locality); composite primary keys lead with `tenant_id` (ADR-03).
- **Auditing columns on every table:** `created_at` and `updated_at` (`timestamptz`, UTC), `created_by` and `updated_by` (the subject of the access token, or `system:<module>` for jobs and listeners).
- **Soft delete:** none. Refund requests, decision records, payouts, and points movements are never deleted by a user action; rows leave only through the retention purge of each module (§17.X Retention Policy).
- **Migrations:** versioned SQL scripts per schema, applied before the new version takes traffic, expand-and-contract for breaking changes; tool per ADR-10 (Proposed).
- **Naming:** `snake_case` tables and columns; schema name equals the module name with underscores.
- **Indexing:** every index and unique key leads with `tenant_id`; foreign keys are indexed; no index spans schemas.
- **JSON columns:** only for the serialized event in `event_publication.payload`; domain data is relational.
- **Publication log (modular monolith, durable in-process events, §14.10):** every publishing module (`refund-request`, `payout`) has an `event_publication` table in its own schema: `event_publication`: `tenant_id`, `id` (UUIDv7, the event id; primary key `(tenant_id, id)`), `event_type`, `payload` (`jsonb`), `trace_context` (the W3C `traceparent` of the publishing request), `published_at`; `event_publication_listener`: `tenant_id`, `event_id`, `listener_id`, `completed_at`, `attempts`, `last_error`, primary key `(tenant_id, event_id, listener_id)`, and an index `(tenant_id, completed_at)` for the redelivery job. The row is written in the publisher's transaction; after commit the event is dispatched to each listener; a scheduled job re-dispatches every listener row not completed, with exponential backoff and jitter. A listener of a product that is switched off (§11.5: the `loyalty-points` listeners while `LOYALTY_POINTS_ENABLED` is off) is not dispatched: its rows stay incomplete, so the publication log keeps the events for it, and the redelivery job dispatches them once the product is switched on. Completed rows are purged by the module's retention job (§17.X Retention Policy).

## 11.2 Multi-Tenancy (Default)

- **Strategy:** shared schema with `tenant_id` (ADR-03); one tenant is configured.
- **Tenant context:** the `tenant_id` claim of the access token, which the realm (ADR-07) sets for the one tenant; jobs and listeners take the tenant from the row or event they process. Calls to providers carry the provider credentials of that tenant.
- **Isolation enforcement:** every repository query has a mandatory `tenant_id` predicate, added by the persistence adapter; architecture tests fail a query without it.
- **Cross-tenant access:** none, for any role.
- **Inbound provider calls (API-02 if CardPay calls back; API-05 if POS Records pushes; API-09 if CardPay sends dispute notices):** each tenant has its own verification secret per provider (§15.3); the inbound adapter verifies the call against the configured secrets, takes the tenant of the secret that matches, and sets the tenant context before any repository call; a call that matches no tenant's secret is 401 `UNAUTHENTICATED`.
- **Scheduled jobs (every `Schedule` row of §17.1 to §17.4 Input, and the publication-log redelivery job):** each run iterates over the configured tenants and runs its selection in that tenant's context, with the `tenant_id` predicate; no query spans tenants.
- **Module roles:** a module role acts only in the tenant of the event or row it is processing.
- **Scopes within a tenant:** branch scope (`branch_id` claim) for branch managers and owner scope (subject of the token) for customers and members (§16.2).

## 11.3 Deployment (Default)

- **Packaging:** one OCI container image for `refunds-platform-app`, built once and promoted unchanged.
- **Orchestration:** managed container service (ADR-09; the service is open in §6).
- **Strategy:** rolling update, at least 2 replicas, readiness probe on Actuator `/actuator/health/readiness`, liveness on `/actuator/health/liveness`; migrations are backward compatible with the running version (AP-10).
- **Configuration:** environment variables for settings; secrets from the secrets manager injected at start (§6).
- **Resource model:** **[NEEDS CLARIFICATION: What CPU and memory requests, limits, and autoscaling bounds does the deployable run with? Owner: platform team.]**
- **Promotion path:** Dev -> SIT -> UAT -> Prod. Gates: SIT needs the provider test environments (§19); UAT ends with BAT sign-off; Prod gates are per product, and each product is switched on in Prod by its own enablement setting (§11.5) once its own gates are met, so one product's slow dependency never holds the other. The Refunds Portal (the REFUNDS use cases, `payout`, `customer-notification`) needs its BAT sign-off and CardPay refunds to the original card confirmed ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies)), and it starts in the pilot branches of [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope), named in the started-branch setting (§11.5); Loyalty Points (the LOYALTY use cases and purchase intake in `loyalty-points`) needs its BAT sign-off and POS Records agreed with its owner ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)), and it starts in all branches at once ([LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope)). While Loyalty Points is off, the refund outcomes wait for `loyalty-points` in the publication log of `refund-request` (§11.1) and reach it when Loyalty Points is switched on ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope)); a refund paid before the refund-reporting start date takes back no points (§17.4 Take-back). REFUNDS 02 needs the CardPay confirmation before the build of [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), so it is also a start condition of the `payout` module build, and it needs the Point-of-Sale Records receipt lookup agreed with the Retail IT team before the build of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), so that agreement is a start condition of the receipt lookup build in `refund-request`; LOYALTY leaves the POS Records milestone open, so that gate moves to the milestone its BRD sets. Each product's Prod gate also needs the legal confirmation dependency of its BRD in place (the applicable data-protection law and consumer refund rights: [REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies), [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)), needed before go-live; the hosting location and region (§6) are chosen only after the applicable data-protection law is named.

## 11.4 Observability (Default)

- **Logging:** JSON to stdout; fields `ts` (UTC), `level`, `module`, `logger`, `message`, `trace_id`, `span_id`, `correlation_id`, `tenant_id`, `event_id` (listeners); no personal data (email address, mobile number, receipt items) at any level.
- **Metrics:** Micrometer through Actuator; RED (rate, errors, duration) per endpoint and per provider call; `publication_incomplete_oldest_seconds` per listener; payout attempts by outcome; messages by outcome.
- **Tracing:** W3C `traceparent` on every inbound and outbound HTTP call; the trace continues from a request into the listeners its events trigger (the event row stores the trace context); sampling at 100% at the volumes of §18.1. Instrumentation per ADR-10 (Proposed).
- **Dashboards:** one per module (RED, provider calls, publication lag) and one platform view (replicas, database, error budget for REFUNDS/NFR-02).
- **Alerting:** alerts on SLOs, not raw resources: availability burn rate against REFUNDS/NFR-02, measured by the synthetic probe of §18.5; any listener incomplete for more than 30 minutes (half the LOYALTY/NFR-02 budget), counted from the later of its event's publication and the switch-on of its product; the listeners of a product that is switched off are not counted (§11.1); any payout `Stopped`; any payout in `Unknown`; any card dispute closed as refunded to the customer while its payout is `Unknown` or `Stopped` (§17.2 Disputes); any refund request Approved for more than 3 days and not yet Paid, except a request whose original card payment has an open card dispute (its payout waits by [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute, and `payouts_held` shows it) (REFUNDS Business Objective 1: 3 days from request to payout; owner `refund-request`, the saga doctrine of §14.7); any payout or message whose lease expired twice; any member purchase that arrives more than 1 day after a take-back for it was parked ([LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints) 1: member purchases are known the same day); parked take-backs that wait are expected for refunds of non-member purchases, so their count is a dashboard gauge, not an alert. On-call: §20.3.

## 11.5 Configuration Management (Default)

- **Source of truth:** settings in the repository per environment; secrets only in the secrets manager.
- **Tooling:** Spring Boot externalized configuration; values reach the container as environment variables.
- **Hot reload:** no; a configuration change is a rolling restart.
- **Feature flags:** one enablement setting per product, as plain externalized configuration (no feature-flag library): `REFUNDS_PORTAL_ENABLED` switches on the REFUNDS endpoints and screens; `LOYALTY_POINTS_ENABLED` switches on the LOYALTY endpoints, the member screens and purchase intake (API-05). Both are off until that product's Prod gate of §11.3 is met; a switched-off product's endpoints answer 404, and its listeners are not dispatched (§11.1). `REFUNDS_PORTAL_BRANCHES` lists the branches that use the portal ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope): a pilot group first, the other branches after it); a receipt from another branch is refused (§17.1 Eligibility). `LOYALTY_REFUND_REPORTING_START_DATE` is the first date on which both products are switched on, the day the Refunds Portal starts to report refund outcomes to Loyalty Points ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-7); it is set in the same configuration change that switches the second product on.
- **Audit:** configuration changes go through the pipeline; its history is the audit trail.

## 11.6 Security (Default)

- **Service-to-service auth:** not applicable inside the deployable; outbound provider calls use each provider's scheme (`TBD - external`, §15.6); inbound provider callbacks verify the provider's signature (§15.1).
- **User auth:** OIDC access tokens from the platform IAM (ADR-07, Proposed), validated by the deployable as an OAuth2 resource server (issuer, audience, expiry, signature); the permission token check is per ADR-08; a staff role requires a second sign-in factor (ADR-07).
- **IAM admin read:** `customer-notification` reads staff users through a confidential IAM client whose only right is reading the users that hold a staff role and their attributes, never an end customer's account (ADR-07); its credentials are in the secrets manager.
- **TLS:** TLS 1.2 or higher on every external connection, including the database connection.
- **Secret rotation:** **[NEEDS CLARIFICATION: What rotation cadence applies to provider credentials and IAM client secrets? Owner: product owner.]**
- **Vulnerability scanning:** **[NEEDS CLARIFICATION: Which vulnerability and dependency scanning tools run in the pipeline, and which severity blocks a release? Owner: product owner.]**
- **Dependency scanning:** see the line above.
- **CORS policy:** only the web app's origin, per environment; no wildcard.
- **Personal data:** customer email address and mobile number, and member purchase data, are personal data; they are stored only in their owning module's schema, never in logs or event payloads except where §14.10 states it.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->
