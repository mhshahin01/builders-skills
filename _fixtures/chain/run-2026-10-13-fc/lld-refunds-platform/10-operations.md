<!--
CHUNK: 10
TITLE: Operations
PROJECT: Refunds Platform
VERSION: 1.2
DEPENDS_ON: 09
PART OF: LLD - Refunds Platform
-->

# 13. Operations

## 13.1 Configuration (per service)

| Service | Variable | Type | Default | Notes | Source |
|---------|----------|------|---------|-------|--------|
| all | `SPRING_PROFILES_ACTIVE` | string | (none) | `dev`, `sit`, `uat`, `prod` | [SDD §19](../sdd-refunds-platform/15-environments.md#19-environments) |
| all | `IAM_ISSUER_URI` | string | (none) | The issuer of the one realm for end customers and staff; each environment has its own realm | [SDD ADR-07](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions), [§19](../sdd-refunds-platform/15-environments.md#19-environments) Access controls |
| all | `IAM_AUDIENCE` | string | `refunds-platform-app` | Expected `aud` | LLD |
| all | `CORS_ALLOWED_ORIGIN` | string | (none) | The web app's origin per environment, no wildcard | [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) |
| all | `PROBLEM_TYPE_BASE_URI` | string | (none) | Base of Problem Details `type` | LLD |
| all | `TENANT_IDS` | csv | (none) | Configured tenants for job loops | [SDD §11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default) |
| all | `REFUNDS_PORTAL_ENABLED` | bool | false | Switches on the Refunds Portal: `refund-request` endpoints, the payout operator endpoints, and the `refund-request`, `payout`, and `customer-notification` listeners, never the CardPay callbacks or the dispute fetch (`09-cross-cutting.md` § 12.9); on once its Prod gate is met | [SDD §11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default), [§11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default), [§19](../sdd-refunds-platform/15-environments.md#19-environments) Feature flags |
| all | `LOYALTY_POINTS_ENABLED` | bool | false | Switches on Loyalty Points: member endpoints, API-05, and the `loyalty-points` listeners; on once its Prod gate is met | [SDD §11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default), [§11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default) |
| all | `PUBLICATION_REDELIVERY_INTERVAL_MS` | int | 10000 | Redelivery job cadence | LLD (`09-cross-cutting.md` § 12.4) |
| all | `PUBLICATION_REDELIVERY_BATCH_SIZE` | int | 100 | | LLD |
| all | `PUBLICATION_LISTENER_TIMEOUT_MS` | int | 30000 | Max listener run before it counts as failed | LLD |
| `refund-request` | `REFUND_REQUEST_DB_URL`, `REFUND_REQUEST_DB_USER` | string | (none) | Module role, schema `refund_request` | [SDD ADR-06](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| `refund-request` | `REFUND_REQUEST_DB_PASSWORD` | secret | (none) | From the secrets manager | [SDD §6 Secrets](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) |
| `refund-request` | `POS_RECORDS_BASE_URL`, `POS_RECORDS_CREDENTIALS` | string, secret | (none) | Per tenant | [SDD API-04](../sdd-refunds-platform/11-api-contracts.md#api-04-look-up-a-receipt-refund-request---point-of-sale-records) |
| `refund-request` | `REFUNDS_PORTAL_BRANCHES` | csv | (empty: no branch has started) | Branches that use the portal; a receipt from another branch is refused with `BRANCH_NOT_STARTED` | [SDD §11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default), [§17.1 Eligibility](../sdd-refunds-platform/13a-service-refund-request.md#business-logic) |
| `refund-request` | `REFUND_WINDOW_DAYS` | int | 30 | REFUNDS/UC-01 BR-1: 30-day refund window | [SDD §17.1 Eligibility](../sdd-refunds-platform/13a-service-refund-request.md#business-logic) |
| `refund-request` | `REFUND_WINDOW_CHECK_AT_SUBMIT` | bool | (none: each environment sets it) | Whether the window is checked again at submission | [SDD §17.1 Submit](../sdd-refunds-platform/13a-service-refund-request.md#business-logic) (value open) |
| `refund-request` | `REFUND_CONTACT_DETAILS_REQUIRED` | enum `BOTH`, `AT_LEAST_ONE` | (none: each environment sets it) | Contact details the customer must give | [SDD §17.1 Submit](../sdd-refunds-platform/13a-service-refund-request.md#business-logic) (value open) |
| `refund-request` | `REFUND_ALLOW_REQUEST_AFTER_REJECTION`, `REFUND_ALLOW_REST_AFTER_PARTIAL_REFUND` | bool | false | The two eligibility settings | [SDD §17.1 Eligibility](../sdd-refunds-platform/13a-service-refund-request.md#business-logic) (values open) |
| `refund-request` | `REFUND_NEVER_REFUNDABLE_ITEM_TYPES` | csv | (empty) | | [SDD §17.1 Eligibility](../sdd-refunds-platform/13a-service-refund-request.md#business-logic) (list open) |
| `refund-request` | `REFUND_DECISION_LATE_AFTER_DAYS` | int | 3 | `late` flag | [SDD §17.1 Decide](../sdd-refunds-platform/13a-service-refund-request.md#business-logic) (days open) |
| `refund-request` | `REFUND_RATE_LIMIT_PER_MINUTE` | int | 30 | Per caller, receipt lookup and submit | [SDD §17.1 API Standards](../sdd-refunds-platform/13a-service-refund-request.md#api-standards) (value open to the solution architect) |
| `refund-request` | `REFUND_RETENTION_PERIOD`, `REFUND_CONTACT_RETENTION_PERIOD` | ISO-8601 duration | (none: purge off) | | [SDD §17.1 Retention Policy](../sdd-refunds-platform/13a-service-refund-request.md#retention-policy) |
| `refund-request`, `payout` | `IDEMPOTENCY_TTL` | duration | `PT24H` | | LLD (`09-cross-cutting.md` § 12.2) |
| `refund-request`, `payout` | `PROCESSED_EVENT_RETENTION` | duration | `P30D` | Housekeeping of `processed_event` | LLD |
| `payout` | `PAYOUT_DB_URL`, `PAYOUT_DB_USER`, `PAYOUT_DB_PASSWORD` | string, secret | (none) | Schema `payout` | [SDD ADR-06](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| `payout` | `CARDPAY_BASE_URL`, `CARDPAY_CREDENTIALS`, `CARDPAY_CALLBACK_SECRET` | string, secret | (none) | Per tenant; the credentials also serve API-07 and, if fetched, API-09 | [SDD API-01](../sdd-refunds-platform/11-api-contracts.md#api-01-request-a-payout-payout---cardpay-ltd), [API-02](../sdd-refunds-platform/11-api-contracts.md#api-02-receive-a-payout-result-cardpay-ltd---payout) |
| `payout` | `CARDPAY_DISPUTE_CALLBACK_SECRET` | secret | (none) | Per tenant; verifies pushed dispute notices (only if CardPay pushes them) | [SDD API-09](../sdd-refunds-platform/11-api-contracts.md#api-09-receive-card-dispute-notices-cardpay-ltd---payout) Credentials storage |
| `payout` | `CARDPAY_IDEMPOTENCY_CONFIRMED` | bool | false | Expired lease -> `RETRYING` when true, `UNKNOWN` when false | [SDD §17.2 Send](../sdd-refunds-platform/13b-service-payout.md#business-logic) |
| `payout` | `CARDPAY_PAYOUT_TIMEOUT` | duration | `PT10S` | Also sizes the lease (+ 1 min) | [SDD §17.2 Send](../sdd-refunds-platform/13b-service-payout.md#business-logic), INT-01 (bound open) |
| `payout` | `PAYOUT_RETRY_CRON` | cron | `0 * * * * *` | Every minute | [SDD §17.2 Input](../sdd-refunds-platform/13b-service-payout.md#input) |
| `payout` | `PAYOUT_RETRY_BASE_DELAY`, `PAYOUT_RETRY_MAX_DELAY` | duration | `PT1M`, `PT1H` | Backoff bounds | [SDD §12 INT-01](../sdd-refunds-platform/08-integrations.md#12-integrations) (bounds open) |
| `payout` | `PAYOUT_STILL_FAILING_AFTER` | duration | `P1D` | REFUNDS/UC-04 AC-2: still failing after one day; counted from the round's first attempt, held time excluded | [SDD §17.2 Result](../sdd-refunds-platform/13b-service-payout.md#business-logic) |
| `payout` | `PAYOUT_RETRY_STOP_AFTER` | duration | (none: never stops) | | [SDD §17.2 Result](../sdd-refunds-platform/13b-service-payout.md#business-logic) (stop time open) |
| `payout` | `PAYOUT_RECONCILIATION_CATCHUP_DAYS` | int | 7 | Days a missed or failed reconciliation is caught up | LLD |
| `payout` | `PAYOUT_DISPUTE_FETCH_INITIAL_LOOKBACK` | duration | `P60D` | How far back the first fetch reads; only if `payout` fetches dispute notices | LLD |
| `payout` | `PAYOUT_RETENTION_PERIOD` | duration | (none: purge off) | | [SDD §17.2 Retention Policy](../sdd-refunds-platform/13b-service-payout.md#retention-policy) |
| `customer-notification` | `CUSTOMER_NOTIFICATION_DB_URL`, `..._USER`, `..._PASSWORD` | string, secret | (none) | Schema `customer_notification` | [SDD ADR-06](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| `customer-notification` | `MSGHUB_BASE_URL`, `MSGHUB_CREDENTIALS` | string, secret | (none) | Per tenant | [SDD API-03](../sdd-refunds-platform/11-api-contracts.md#api-03-send-an-email-or-sms-customer-notification---msghub) |
| `customer-notification` | `MSGHUB_TIMEOUT`, `MSGHUB_MAX_ATTEMPTS` | duration, int | `PT5S`, 8 | | [SDD §12 INT-02](../sdd-refunds-platform/08-integrations.md#12-integrations) (bounds open) |
| `customer-notification` | `MSGHUB_RETRY_BASE_DELAY`, `MSGHUB_RETRY_MAX_DELAY` | duration | `PT30S`, `PT30M` | Backoff between claims; the max also delays a `CONFIG_DEFECT` retry | [SDD §12 INT-02](../sdd-refunds-platform/08-integrations.md#12-integrations) (bounds open) |
| `customer-notification` | `MESSAGE_SENDER_INTERVAL_MS` | int | 5000 | | LLD |
| `customer-notification` | `IAM_ADMIN_CLIENT_ID`, `IAM_ADMIN_CLIENT_SECRET` | string, secret | (none) | API-08: reads staff users only | [SDD §11.6 IAM admin read](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default), [API-08](../sdd-refunds-platform/11-api-contracts.md#api-08-find-the-branch-managers-of-a-branch-customer-notification---platform-iam) |
| `customer-notification` | `NOTIFICATION_DEFAULT_LOCALE` | string | (none) | Template language | [SDD §17.3 Language](../sdd-refunds-platform/13c-service-customer-notification.md#business-logic) (languages open) |
| `customer-notification` | `NOTIFICATION_RETENTION_PERIOD` | duration | (none: purge off) | | [SDD §17.3 Retention Policy](../sdd-refunds-platform/13c-service-customer-notification.md#retention-policy) |
| `loyalty-points` | `LOYALTY_POINTS_DB_URL`, `..._USER`, `..._PASSWORD` | string, secret | (none) | Schema `loyalty_points` | [SDD ADR-06](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| `loyalty-points` | `POS_RECORDS_PURCHASE_SECRET` | secret | (none) | API-05 verification, per tenant | [SDD API-05](../sdd-refunds-platform/11-api-contracts.md#api-05-receive-member-purchases-pos-records---loyalty-points) |
| `loyalty-points` | `LOYALTY_REFUND_REPORTING_START_DATE` | date | (none) | First date on which both products are on; set in the change that switches the second product on; start fails when both products are on and it is unset | [SDD §11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default), [§20.1.8](../sdd-refunds-platform/16-operations-runbook.md#2018-switch-on-a-product-or-start-more-branches) |
| `loyalty-points` | `LOYALTY_TAKEBACK_PARKING_PERIOD` | duration | `P30D` | Wait of a parked take-back, from the paid date | [SDD §17.4 Take-back](../sdd-refunds-platform/13d-service-loyalty-points.md#business-logic) (LOYALTY/UC-02 BR-5: refund paid before earning, 30 days) |
| `loyalty-points` | `LOYALTY_LATE_PURCHASE_ALERT_AFTER` | duration | `P1D` | A purchase arriving later than this after a take-back for it was parked is counted | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) |
| `loyalty-points` | `START_OF_POINTS_DATE` | date | (none: no purchase earns) | | [SDD §17.4 Purchase intake](../sdd-refunds-platform/13d-service-loyalty-points.md#business-logic) (date open) |
| `loyalty-points` | `LOYALTY_EARNING_ROUNDING` | enum | `DOWN` | | [SDD §17.4 Purchase intake](../sdd-refunds-platform/13d-service-loyalty-points.md#business-logic) (rounding open) |
| `loyalty-points` | `LOYALTY_DETAILS_RETENTION_PERIOD`, `LOYALTY_LEFT_MEMBER_RETENTION_PERIOD` | duration | (none: purge off) | | [SDD §17.4 Retention Policy](../sdd-refunds-platform/13d-service-loyalty-points.md#retention-policy) |

> **Source:** each Default restates the SDD value it comes from and links it; `LLD` marks a variable the LLD adds. Defaults for values the SDD leaves open are the best guesses flagged in the module files and `15-open-questions.md`; they are configuration, so an answer changes a value, not code. The enablement settings, the started-branch list, and the refund-reporting start date are set per environment (SDD §19 Feature flags).

## 13.2 Health & Readiness

> See `09-cross-cutting.md` § 12.10.

| Service | Liveness checks | Readiness checks |
|---------|-----------------|------------------|
| `refunds-platform-app` (all modules) | App responds | Four DataSource pools healthy; migrations of `refund_request`, `payout`, `customer_notification`, `loyalty_points` complete; no provider or IAM in readiness |

## 13.3 Metrics (RED: Rate, Errors, Duration)

> **Platform and per-module metrics are the SDD's:** [SDD §11.4 Metrics](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) and the Metrics tables of [§17.1](../sdd-refunds-platform/13a-service-refund-request.md#metrics), [§17.2](../sdd-refunds-platform/13b-service-payout.md#metrics), [§17.3](../sdd-refunds-platform/13c-service-customer-notification.md#metrics), [§17.4](../sdd-refunds-platform/13d-service-loyalty-points.md#metrics). They are implemented with Micrometer under those names. Rows below are only the metrics this LLD adds.

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `publication_listener_attempts_total` | counter | `module`, `listener_id`, `outcome` | Listener delivery outcomes (complements SDD `publication_incomplete_oldest_seconds`) |
| `payout_unknown_total` | counter | - | Payouts moved to `UNKNOWN` (alert source) |
| `lease_expired_total` | counter | `module` (`payout`, `customer-notification`) | Expired claims, and leases lost before a call |
| `lease_expired_twice_total` | counter | `module` | Incremented on the expiry that brings `lease_expiry_count` to 2, whatever the expired row becomes next |
| `payout_reconciliation_mismatches_total` | counter | `kind` | REFUNDS/NFR-01 measure |
| `payout_succeeded_after_stop_total` | counter | - | Succeeded result on a `STOPPED` payout, or on a `CANCELLED` payout (which stays `CANCELLED`) |
| `payout_dispute_refunded_unresolved_total` | counter | - | A card dispute closed as refunded to the customer while its payout is `UNKNOWN` or `STOPPED` (SDD §11.4 alert) |
| `payout_dispute_notices_failed_total` | counter | - | Fetched dispute notices skipped because they could not be mapped or recorded (retried by the next run) |
| `payout_dispute_fetch_lag_seconds` | gauge | - | Age of the dispute fetch cursor (snapshot per tenant every 60 s); 0 while dispute notices are not fetched |
| `loyalty_balance_mismatch_total` | counter | - | Daily verification differences |
| `loyalty_late_purchase_for_parked_takeback_total` | counter | - | A member purchase that arrives more than `LOYALTY_LATE_PURCHASE_ALERT_AFTER` after a take-back for it was parked (SDD §11.4 alert) |
| `api06_access_denied_total` | counter | - | API-06 `AccessDenied` seen by `customer-notification` |
| `refund_request_oldest_submitted_age_seconds` | gauge | `branch_id` | Age of the oldest Submitted request per branch (snapshot per tenant every 60 s); a branch with no Submitted request reports 0 |
| `refund_request_oldest_approved_unpaid_age_seconds` | gauge | `branch_id` | Age, from its latest move to Approved, of the oldest Approved request not yet Paid whose original card payment has no open card dispute, per branch (snapshot per tenant every 60 s); a branch with none reports 0 (SDD §11.4 approved-to-paid alert) |
| `refund_unusual_receipt_not_found_total` | counter | - | Incremented once per caller-hour when the caller's lookups reach 10 and the not-found share exceeds 50%; counted per caller and hour in `rate_limit_counter` (endpoints `receipt-lookup-hourly`, `receipt-lookup-not-found-hourly`) by `refundableItems` step 8; the caller's `sub` is logged at WARN, never a label |
| `idempotency_replays_total` | counter | `endpoint` | Replays served from `idempotency_record` (`refund-request` and `payout` write endpoints) |
| `rate_limited_total` | counter | `endpoint` | 429 responses |

> SDD metrics with an LLD delta: `messages_total{type, channel, outcome}` gains the outcome value `no_reachable_recipient`; `refund_requests_total` carries `branch_id` besides `status` (refund-request § 7.3, flagged there); `payout_attempts_total` counts only attempts with an outcome other than `NOT_SENT`; `loyalty_purchase_intake_total` gains the outcome `invalid` for a fetched purchase that fails validation. Gauges read a value cached per tenant by a 60-second snapshot query, never a query per scrape. A gauge without a tenant label reports one value from its per-tenant snapshot values: the maximum for an age gauge (`payout_open_age_seconds`, `payout_dispute_fetch_lag_seconds`, `message_queue_age_seconds`, and the two `refund_request_oldest_*` gauges per branch), the sum for a count gauge (`payouts_held`, `loyalty_parked_takebacks`, `refund_requests_late`).

## 13.4 Logs

> See `09-cross-cutting.md` § 12.7 for the format.

| Service | Estimated lines/day | Hot retention | Cold retention |
|---------|---------------------|---------------|----------------|
| `refunds-platform-app` | About 20,000 at the SDD §18.1 normal load (about 40 requests a day, about 2 messages per status change, jobs every minute); about 3 times that at the seasonal peak | Per backend | Per backend |

> TODO: the line estimate is a best guess from SDD §18.1 volumes with INFO logging per request, listener, and job run - verify after the first load test.

> **Triage by use case:** filter logs on `use_case` matching the whole token `(^|,)[KEY]/UC-NN(,|$)`; the use case's row in `16-references.md` § 19.9 leads to its workflow, BRD use case, and test cases.

## 13.5 Tracing

> See `09-cross-cutting.md` § 12.8.

- Controller spans: `<HTTP method> <route>` (e.g. `POST /v1/refund-requests`).
- Service spans: `<class>.<method>` (e.g. `RefundDecisionServiceImpl.decide`).
- Provider spans: `cardpay.payout`, `cardpay.refund-records`, `cardpay.dispute-notices` (if fetched), `msghub.send`, `pos.receipt-lookup`, `iam.user-query` (API-08).
- Listener spans: `listener <listener_id>`, child of the publishing request's span (stored `traceparent`); a listener whose stored `trace_context` is NULL starts a new root trace.
- Job spans: `job <job name>` per tenant run, each the root of a new trace opened by `TenantJobRunner` (`09-cross-cutting.md` § 12.8), so the provider calls a job makes carry its `traceparent`.
- Entry-point spans of a BRD use case carry `use_case` (§ 12.8).

## 13.6 Dashboards

| Dashboard | Tool | Audience | URL |
|-----------|------|----------|-----|
| `refund-request` (RED per endpoint, POS lookup, late requests, oldest Submitted and oldest Approved-not-Paid per branch) | Backend open | All | Not created |
| `payout` (attempts by outcome, open age, held (`payouts_held`), sent back, stopped, unknown, open resolutions, reconciliation) | Backend open | All, operations | Not created |
| `customer-notification` (messages by outcome, queue age, MsgHub and IAM latency) | Backend open | All | Not created |
| `loyalty-points` (movements, take-back lag, parked take-backs (`loyalty_parked_takebacks`: a dashboard gauge, not an alert, SDD §11.4), late purchases, intake outcomes) | Backend open | All | Not created |
| Platform view (replicas, database, REFUNDS/NFR-02 error budget, publication lag) | Backend open | Operations | Not created |

> The set is the SDD [§11.4 Dashboards](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) line (one per module and one platform view).

> TODO: dashboard tool and URLs - verify once the SDD §6 observability backends are chosen.

## 13.7 Alerts

| Alert | Threshold | Severity | Action | Source |
|-------|-----------|----------|--------|--------|
| `AvailabilityBurnRate` | Synthetic probe failures burn the 2 h / 720 h budget: 1 h burn rate > 14.4 or 6 h > 6 | Page | > TODO: no SDD §20 procedure for an availability incident; best guess [§20.1.1](../sdd-refunds-platform/16-operations-runbook.md#2011-restart-a-service) then escalation per §20.3 - verify | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), [§18.5 REFUNDS/NFR-02](../sdd-refunds-platform/14-performance-and-capacity.md#185-nfr-targets) |
| `PublicationListenerLag` | `publication_incomplete_oldest_seconds > 1800` for any listener; the age of an incomplete row is now - greatest(`event_publication.published_at`, `listener_enablement.enabled_since`) in the publisher's schema, and a listener with no `listener_enablement` row (product never switched on) reports nothing | Page | RB-01; [SDD §20.1.3](../sdd-refunds-platform/16-operations-runbook.md#2013-replay-dlq-messages) | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) |
| `PayoutStopped` | `increase(payouts_stopped_total[5m]) > 0` | Page | RB-02; [SDD §20.1.7](../sdd-refunds-platform/16-operations-runbook.md#2017-resolve-a-stopped-payout) | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), [§17.2 Result](../sdd-refunds-platform/13b-service-payout.md#business-logic) |
| `PayoutUnknown` | `increase(payout_unknown_total[5m]) > 0` | Page | RB-02; [SDD §20.1.7](../sdd-refunds-platform/16-operations-runbook.md#2017-resolve-a-stopped-payout) | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), [§17.2 Send](../sdd-refunds-platform/13b-service-payout.md#business-logic) |
| `PayoutDisputeRefundedUnresolved` | `increase(payout_dispute_refunded_unresolved_total[5m]) > 0` | Page | RB-02 (a not-paid resolution cancels the payout); [SDD §20.1.7](../sdd-refunds-platform/16-operations-runbook.md#2017-resolve-a-stopped-payout) | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), [§17.2 Disputes](../sdd-refunds-platform/13b-service-payout.md#business-logic) |
| `RefundApprovedNotPaid` | `refund_request_oldest_approved_unpaid_age_seconds > 259200` (3 days, in seconds) for any branch | Warn | > TODO: no SDD §20 procedure; best guess: find the request's payout on the operator screens, follow RB-02 when it is `STOPPED` or `UNKNOWN`, otherwise check the `payout-retry` backlog and the CardPay breaker - verify | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) (REFUNDS Business Objective 1, owner `refund-request`), [§14.7 saga doctrine](../sdd-refunds-platform/10-events-hub.md#147-universal-subscribers--cross-service-doctrines) step 3 |
| `PayoutSucceededAfterStop` | `increase(payout_succeeded_after_stop_total[5m]) > 0` | Page | RB-02; [SDD §20.1.7](../sdd-refunds-platform/16-operations-runbook.md#2017-resolve-a-stopped-payout) (no second payment) | [SDD §17.2 Result](../sdd-refunds-platform/13b-service-payout.md#business-logic) |
| `ResolutionNotApplicable` | > TODO: [payout § 7.3](./04-implementation/payout.md#payoutserviceimplapplyopenresolutions) `applyOpenResolutions` raises it but names no metric; best guess a counter `payout_resolution_not_applicable_total`, `increase(...[5m]) > 0` - verify | Warn | RB-02 (re-read the payout and record a new resolution if needed) | LLD (payout § 7.3) |
| `LeaseExpiredTwice` | `increase(lease_expired_twice_total[5m]) > 0` | Warn | RB-01; [SDD §20.1.3](../sdd-refunds-platform/16-operations-runbook.md#2013-replay-dlq-messages) | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) |
| `LatePurchaseForParkedTakeBack` | `increase(loyalty_late_purchase_for_parked_takeback_total[1h]) > 0` | Warn | > TODO: no SDD §20 procedure; best guess: ask the POS Records owner why member purchases arrive later than the same day (LOYALTY 02 Assumptions / Constraints 1) - verify | [SDD §11.4 Alerting](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) |
| `PayoutReconciliationMismatch` | `increase(payout_reconciliation_mismatches_total[1d]) > 0` | Page | > TODO: no SDD §20 procedure for a reconciliation mismatch - verify | [SDD §17.2 Reconciliation](../sdd-refunds-platform/13b-service-payout.md#business-logic) |
| `LoyaltyBalanceMismatch` | `increase(loyalty_balance_mismatch_total[1d]) > 0` | Page | > TODO: no SDD §20 procedure; LOYALTY has no correction movement (SDD §17.4 marker) - verify | [SDD §17.4 Concurrency](../sdd-refunds-platform/13d-service-loyalty-points.md#business-logic) |
| `NoBranchManagerForAlert` | `increase(messages_total{outcome="no_reachable_recipient"}[5m]) > 0` | Page | > TODO: no SDD §20 procedure; the operator tells the branch by another channel - verify | [SDD §17.3 Select](../sdd-refunds-platform/13c-service-customer-notification.md#business-logic), [§12 INT-04](../sdd-refunds-platform/08-integrations.md#12-integrations) Fallback |
| `MsgHubAuthFailed` | `msghubSend` breaker opened by a 401 or 403 | Page | RB-03; [SDD §20.1.4](../sdd-refunds-platform/16-operations-runbook.md#2014-rotate-secrets) | [SDD §17.3 Error Handling](../sdd-refunds-platform/13c-service-customer-notification.md#error-handling) |
| `UnusualReceiptNotFound` | `increase(refund_unusual_receipt_not_found_total[1h]) > 0` | Warn | > TODO: no SDD §20 procedure - verify | [SDD §17.1 API Standards](../sdd-refunds-platform/13a-service-refund-request.md#api-standards) |
| `RefundRequestStale` | `refund_request_oldest_submitted_age_seconds > 1036800` (4 x `REFUND_DECISION_LATE_AFTER_DAYS` of 3 days, in seconds; recalculated when the setting changes) | Warn | > TODO: no SDD §20 procedure; the operator contacts the branch - verify | REFUNDS/UC-04 BR-5: decide within the decision time (late flag; LLD threshold) |
| `DisputeFetchStalled` | `payout_dispute_fetch_lag_seconds > 1800` | Page | > TODO: no SDD §20 procedure; best guess: read the WARN log of `PayoutDisputeFetchJob` for the skipped dispute ids or the fetch error, fix the mapping (a code change) or the CardPay credentials (RB-03), and watch the lag fall - verify | LLD ([payout § 7.8 Card dispute intake](./04-implementation/payout.md#participates-in-refundsuc-04-approve--reject-refund); [SDD §17.2 Disputes](../sdd-refunds-platform/13b-service-payout.md#business-logic)) |
| `ApiContactAccessDenied` | `increase(api06_access_denied_total[5m]) > 0` | Page | > TODO: configuration defect; no SDD §20 procedure - verify | [SDD API-06](../sdd-refunds-platform/11-api-contracts.md#api-06-get-customer-contact-details-customer-notification---refund-request) |

> **Source:** each alert links the SDD place that raises it; its Threshold is the metric and value that implement the SDD condition (values for conditions the SDD does not quantify are LLD choices); its Action names the § 13.8 runbook and links the SDD §20 procedure, or carries a TODO flag when §20 has none. Every SDD §20 procedure is itself a heading with an open question, so the Actions link procedures without steps yet. Parked take-backs that wait are expected for refunds of non-member purchases, so SDD §11.4 raises no alert on them: their count is the `loyalty_parked_takebacks` dashboard gauge (§ 13.6).

## 13.8 Runbook Procedures

> **Convention:** the procedures are the SDD's (§20.1.1 to §20.1.8), whose steps are SDD [NEEDS CLARIFICATION] markers (hosting service, CI/CD, and backends open). The LLD adds the design facts an operator needs, here and in each module file.

### RB-01: Re-drive an incomplete listener (SDD §20.1.3)

Alerts: `PublicationListenerLag`, `LeaseExpiredTwice`.

```text
1. Find the listener: publication_incomplete_oldest_seconds by module and listener_id; logs filtered on event_id.
2. Read last_error in <schema>.event_publication_listener for (tenant_id, event_id, listener_id).
3. Fix the cause (code defect: deploy the fix; data: correct it through the owning module's own path).
4. Re-drive: UPDATE <schema>.event_publication_listener SET next_attempt_at = now()
   WHERE tenant_id = ? AND event_id = ? AND listener_id = ? AND completed_at IS NULL   (operational column, SDD §16.4.3)
5. Watch completed_at being set; listeners are idempotent, so a re-drive is safe.
6. Never re-drive the rows of a switched-off product's listener or a HELD payout: they wait by design (SDD §20.1.3).
```

> TODO: concrete commands (database access path, who may run step 4 in Prod) once the hosting service exists - verify (SDD §20.1.3 marker).

> Never set `completed_at` by hand or delete an incomplete row: that event would be lost for that listener. The operations database role never reads `event_publication.payload` (SDD §16.4.3).

### RB-02: Resolve an Unknown or Stopped payout (SDD §20.1.7)

Alerts: `PayoutStopped`, `PayoutUnknown`, `PayoutDisputeRefundedUnresolved`, `PayoutSucceededAfterStop`, `ResolutionNotApplicable`.

```text
1. A payout operator (role PAYOUT_OPERATOR) opens the payout list on the operator screens
   (GET /v1/payouts?status=STOPPED,UNKNOWN) and notes the payout's round keys and attempts.
2. Check CardPay (portal or support) for every attempt of the payout, using the round keys (round 1: the payout id).
3. Record the result through the operator screen: POST /v1/payouts/{payoutId}/resolutions (Idempotency-Key) with
   outcome PAID or NOT_PAID and the CardPay reference checked. A PAID resolution that no second operator has confirmed is
   replaced by recording a new resolution (it becomes SUPERSEDED); a confirmed PAID row or a NOT_PAID row waits for
   payout-retry (409 CONFLICT until it is applied).
4. PAID only: a second payout operator confirms it: POST /v1/payouts/{payoutId}/resolutions/{resolutionId}/confirmation
   (Idempotency-Key) with the CardPay reference the second operator checked, which must equal the recorded one (otherwise
   409 CONFLICT: the two operators checked different payments; re-check CardPay and record a new resolution); the operator
   who recorded it gets 403 SAME_PERSON_CONFIRMATION.
5. payout-retry applies the resolution within one minute: PAID on UNKNOWN or STOPPED -> SUCCEEDED and PayoutSucceeded
   (with resolvedBy and confirmedBy); NOT_PAID on UNKNOWN -> RETRYING with the same round key; NOT_PAID when a dispute of
   the payment was refunded to the customer -> CANCELLED and PayoutCancelled (the request becomes Rejected);
   NOT_PAID on STOPPED -> stays STOPPED.
6. A STOPPED payout with NOT_PAID: no other way to pay the customer exists until REFUNDS answers the never-succeeds
   marker, and any such way starts only after CardPay confirms that no attempt succeeded (SDD §20.1.7).
7. ResolutionNotApplicable: the payout left UNKNOWN and STOPPED before the resolution was applied; re-read it.
```

> Never record a resolution or change `payout.status` with SQL: resolutions are recorded only through the `PAYOUT_OPERATOR` endpoints, never by a database role (SDD [§16.4.3](../sdd-refunds-platform/12-centralized-user-roles.md#1643-platform-plane-operator---outside-tenant-tenancy), §20.1.7).

> TODO: who contacts the customer and which team holds `PAYOUT_OPERATOR` - verify (SDD §20.1.7 marker and the SDD §16.4.2 `PAYOUT_OPERATOR` marker; the never-succeeds path is the SDD §17.2 marker).

### RB-04: Re-drive failed messages (SDD §20.1.3)

Alerts: none (message status `FAILED`).

```text
1. Find the message: status FAILED, last_error_code, tenant_id, id (logs filtered on message_id).
2. Fix the cause (MsgHub outage over, credentials rotated).
3. UPDATE customer_notification.message SET status = 'QUEUED', attempts = 0, next_attempt_at = now(), last_error_code = NULL
   WHERE tenant_id = ? AND id = ? AND status = 'FAILED'
   AND last_error_code NOT IN ('CONTACT_DETAILS_ERASED', 'NOT_FOUND', 'CONTACT_NOT_GIVEN', 'REJECTED_INVALID_RECIPIENT')
4. The re-driven message is sent with the same MsgHub key (the message id, or the per-recipient key of the alert);
   nothing checks at send time whether the request has been Paid, or Rejected after a refunded dispute, since: the paid
   listener and the dispute-refunded rejection supersede only the PAYOUT_DELAYED and alert messages that are QUEUED or
   SENDING when they run.
```

> TODO: a `PAYOUT_DELAYED` message or a `PAYOUT_STILL_FAILING_ALERT` re-driven after the request was Paid, or Rejected after a refunded dispute, is sent after that message, because RB-04 step 3 sets it back to `QUEUED` after the paid listener has run; best guess: step 3 also excludes those two message types when `customer_notification.refund_status_seen.newest_status` of the message's refund request is `PAID` or `REJECTED` - verify with the team.

> TODO: concrete database access path and who may run step 3 in Prod - verify (SDD §20.1.3 marker).

### RB-03: Rotate a provider or IAM secret (SDD §20.1.4)

Alerts: `MsgHubAuthFailed`.

```text
1. Add the new secret in the secrets manager.  2. Rolling restart (secrets are read at start, SDD §11.5).
3. Verify provider call success metrics.  4. Revoke the old secret.
For CARDPAY_CALLBACK_SECRET, CARDPAY_DISPUTE_CALLBACK_SECRET, and POS_RECORDS_PURCHASE_SECRET, keep both secrets
accepted during the switch.
```

> TODO: concrete commands and rotation cadence - verify (SDD §20.1.4 and §11.6 markers).

### RB-05: Switch on a product or start more branches (SDD §20.1.8)

Alerts: none (a planned configuration change).

```text
1. Check the product's Prod gate of SDD §11.3 is met (BAT sign-off, provider confirmation, legal confirmation).
2. Change the configuration and do a rolling restart (SDD §11.5): REFUNDS_PORTAL_ENABLED or LOYALTY_POINTS_ENABLED to
   true, or more branches in REFUNDS_PORTAL_BRANCHES.
3. In the change that switches the second product on, set LOYALTY_REFUND_REPORTING_START_DATE to the date of that change,
   never an earlier one: a refund paid on or after it takes back points, and a take-back cannot be undone.
   The deployable does not start when both products are on and the date is unset.
4. Switching Loyalty Points on: loyalty-enablement-recorder records the first switch-on time, and the redelivery job
   delivers every refund outcome kept in refund-request's publication log; watch publication_incomplete_oldest_seconds
   for the loyalty-points listeners fall to 0 and loyalty_takeback_lag_seconds (LOYALTY/NFR-02: 1 hour).
5. Adding branches: a receipt from a branch not in REFUNDS_PORTAL_BRANCHES is refused with BRANCH_NOT_STARTED.
```

> TODO: concrete steps, approvals, and checks for the switch-on and for adding branches - verify (SDD [§20.1.8](../sdd-refunds-platform/16-operations-runbook.md#2018-switch-on-a-product-or-start-more-branches) marker; platform team with the product owner).

## 13.9 On-Call

- **Rota:** open (SDD [§20.3](../sdd-refunds-platform/16-operations-runbook.md#203-on-call) marker).
- **Escalation policy:** open (SDD §20.3).
- **Communication channel:** open (SDD §20.3).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 09-cross-cutting.md | NEXT: 11-security.md -->
