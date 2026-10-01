<!--
CHUNK: 10
TITLE: Operations
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 09
PART OF: LLD - Refunds Platform
-->

# 13. Operations

## 13.1 Configuration (per service)

Environment rows per [SDD §19](../sdd-refunds-platform/15-environments.md#19-environments) (Dev, SIT, UAT, Prod; providers stubbed in Dev and SIT). Values that are secrets come from the secrets manager as mounted files.

| Service | Variable | Type | Default | Notes |
|---------|----------|------|---------|-------|
| all | `KEYCLOAK_ISSUER_URI` | string | (none) | Realm issuer per environment |
| all | `KAFKA_BROKERS`, `KAFKA_CLIENT_CREDENTIALS` | csv, secret | (none) | Per-deployable client identity (SDD §11.6; mechanism open) |
| all | `TENANT_REGISTRY_PATH` | path | `/config/tenants.yaml` | Tenant registry (LA-01, 09 § 12.9) |
| all | `PROBLEM_BASE_URI` | string | (none) | RFC 9457 `type` base (09 § 12.6) |
| all | `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_TRACES_SAMPLER_ARG` | string, float | (none) | Tracing backend and sampling (open, SDD §6) |
| refunds-platform-core | `REFUND_DB_URL`, `REFUND_DB_USER`, `REFUND_DB_PASSWORD` | string, string, secret | (none) | Role `refund_app`, schema `refund` |
| refunds-platform-core | `LOYALTY_DB_URL`, `LOYALTY_DB_USER`, `LOYALTY_DB_PASSWORD` | string, string, secret | (none) | Role `loyalty_app`, schema `loyalty` |
| refunds-platform-core | `POS_RECORDS_BASE_URL` | string | (none) | API-01 (`TBD - external`) |
| refunds-platform-core | `OUTBOX_POLL_INTERVAL_MS`, `OUTBOX_BATCH_SIZE` | int, int | 500, 100 | Refund outbox relay (09 § 12.4) |
| refunds-platform-core | `REFUND_PAYOUT_RETRY_WINDOW` | ISO-8601 duration | `PT24H` | Watchdog threshold input; the value is ADR-10's and changes only with ADR-10 |
| refunds-platform-core | `REFUND_WATCHDOG_CRON`, `LOYALTY_RECONCILIATION_CRON`, `LOYALTY_PARKING_INTERVAL` | cron, cron, duration | `0 0 6 * * *`, `0 30 5 * * *`, `PT15M` | Jobs run per tenant |
| payout-service | `PAYOUT_DB_URL`, `PAYOUT_DB_USER`, `PAYOUT_DB_PASSWORD` | string, string, secret | (none) | Role `payout_app` |
| payout-service | `CARDPAY_BASE_URL` | string | (none) | API-02 (`TBD - external`) |
| payout-service | `PAYOUT_RETRY_WINDOW` | ISO-8601 duration | `PT24H` | ADR-10 value; changes only with ADR-10 |
| payout-service | `PAYOUT_BACKOFF_BASE`, `PAYOUT_BACKOFF_CAP`, `PAYOUT_LEASE_GRACE` | durations | `PT1M`, `PT2H`, `PT60S` | 08 § 11.3; lease grace from SDD §17.2 |
| payout-service | `PAYOUT_SCHEDULER_DELAY_MS`, `PAYOUT_SCHEDULER_BATCH_SIZE`, `PAYOUT_RECONCILIATION_CRON` | int, int, cron | 5000, 20, `0 0 7 * * *` | |
| payout-service | `OUTBOX_POLL_INTERVAL_MS`, `OUTBOX_BATCH_SIZE` | int, int | 500, 100 | Payout outbox relay |
| notification-service | `NOTIFICATION_DB_URL`, `NOTIFICATION_DB_USER`, `NOTIFICATION_DB_PASSWORD` | string, string, secret | (none) | Role `notification_app` |
| notification-service | `MSGHUB_BASE_URL`, `KEYCLOAK_ADMIN_URL`, `KEYCLOAK_ADMIN_CLIENT_SECRET` | string, string, secret | (none) | API-04, API-05 |
| notification-service | `NOTIFICATION_MAX_ATTEMPTS`, `NOTIFICATION_BACKOFF_BASE`, `NOTIFICATION_BACKOFF_CAP` | int, duration, duration | 6, `PT1M`, `PT30M` | 09 § 12.3 (TODO values) |
| notification-service | `NOTIFICATION_DISPATCH_DELAY_MS`, `NOTIFICATION_DISPATCH_BATCH_SIZE` | int, int | 2000, 50 | |

## 13.2 Health & Readiness

> See `09-cross-cutting.md` § 12.10 (readiness on the database only, SDD §11.3). Per-service additions:

| Service | Liveness checks | Readiness checks |
|---------|-----------------|------------------|
| `refunds-platform-core` | App responds | Both module datasources reachable; Flyway migrations of both schemas complete |
| `payout-service` | App responds | `payout` database reachable; migrations complete |
| `notification-service` | App responds | `notification` database reachable; migrations complete |

## 13.3 Metrics (RED - Rate, Errors, Duration)

> **Default per service** (every metric also carries `tenant_ref`, SDD §11.4):

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_server_requests_seconds` | histogram | `method`, `uri`, `status`, `service` | Request rate, latency, error rate |
| `kafka_consumer_records_consumed_total` | counter | `topic`, `group`, `service` | Consumption throughput |
| `kafka_consumer_lag` | gauge | `topic`, `group`, `partition` | Consumer lag |
| `outbox_backlog_rows` | gauge | `service` | Outbox backlog (09 § 12.4) |
| `outbox_oldest_age_seconds` | gauge | `service` | Outbox liveness |
| `dlq_depth` | gauge | `consumer` | DLQ records not yet redriven |
| `db_pool_active` | gauge | `service`, `pool` | DB pool saturation (one pool per core module) |
| `resilience4j_circuitbreaker_state` | gauge | `name` | Provider circuits (`posRecords`, `cardPay`, `msgHubEmail`, `msgHubSms`, `keycloakAdmin`) |

**Per-service custom metrics:** names, types, and purposes are owned by the SDD Metrics tables ([§17.1](../sdd-refunds-platform/13a-service-refund.md#171-refund-service), [§17.2](../sdd-refunds-platform/13b-service-payout.md#172-payout-service), [§17.3](../sdd-refunds-platform/13c-service-notification.md#173-notification-service), [§17.4](../sdd-refunds-platform/13d-service-loyalty.md#174-loyalty-service)); this table gives only where each is recorded.

| Metric (SDD name) | Recorded in |
|-------------------|-------------|
| `refund_requests_submitted_total` | `RefundRequestServiceImpl.submit`, after commit |
| `refund_decisions_total` | `RefundDecisionServiceImpl.decide`, after commit |
| `refund_time_to_decision_seconds` | `RefundDecisionServiceImpl.decide`, `decided_at - submitted_at` |
| `refund_time_to_paid_seconds` | `PayoutOutcomeServiceImpl.applyPayoutSucceeded`, `paid_at - submitted_at` |
| `refund_payout_failed_open` | Gauge refreshed by `PayoutWatchdogJob` and on each payout outcome |
| `refund_payout_outcome_overdue` | `PayoutWatchdogJob.run` |
| `refund_receipt_lookup_duration_seconds` | `PosRecordsReceiptAdapter.lookup` |
| `payout_attempts_total`, `payout_provider_duration_seconds` | `PayoutAttemptServiceImpl` record step, `CardPayPayoutAdapter` |
| `payouts_in_retry` | Gauge per tenant from `payout` where status `RETRY_WAIT` |
| `payout_window_expired_total` | Window-close branch of the claim step |
| `payout_duplicate_blocked_total` | `PayoutServiceImpl.createFromApproval` |
| `payout_attempt_leases_expired_total` | Claim step, when the last attempt has no outcome |
| `payout_results_unmatched` | `PayoutResultServiceImpl.receive` and a periodic gauge |
| `payout_reconciliation_mismatches_total` | `PayoutReconciliationServiceImpl.reconcile` |
| `notifications_total`, `notification_send_duration_seconds` | `NotificationDispatchServiceImpl` record step, senders |
| `notifications_pending` | Gauge per channel from `notification` where status `PENDING` |
| `contact_lookup_duration_seconds` | `KeycloakContactDirectoryAdapter` |
| `points_movements_total` | `PurchaseIngestionServiceImpl.earnOne`, `TakeBackServiceImpl` |
| `points_take_back_lag_seconds` | `TakeBackServiceImpl`, after commit, `now - paidAt` |
| `points_take_backs_parked` | `TakeBackParkingJob` |
| `points_balance_drift_total` | `BalanceReconciliationServiceImpl.reconcile` |
| `points_take_backs_applied_late_total` | `TakeBackServiceImpl.applyWaiting` on a CLOSED row |

**LLD-added metrics:** `refund_receipt_not_found_total` (counter, no customer label; feeds 13.7), `refund_paid_amount_mismatch_total` (counter), `points_take_backs_parked_stale` (gauge of PARKED rows older than two days), `security_events_total` (counter, label `kind`: `partner_key_unknown`, `signature_invalid`, `tenant_mismatch`).

## 13.4 Logs

> See `09-cross-cutting.md` § 12.7 for the platform-wide log format. Per-service log volume estimates:

| Service | Estimated lines/day | Hot retention | Cold retention |
|---------|---------------------|---------------|----------------|
| `refunds-platform-core` | ~50,000 (baseline), ~150,000 at the seasonal peak | Open (SDD §6) | Open (SDD §6) |
| `payout-service` | ~5,000 | Open | Open |
| `notification-service` | ~15,000 (baseline), ~45,000 at the peak | Open | Open |

> TODO: best-guess log volumes derived from SDD §18.1 (1,200 requests and at most 7,200 messages a month) plus an assumed read traffic that SDD §18.1 leaves open - verify once read traffic is known.

## 13.5 Tracing

> See `09-cross-cutting.md` § 12.8. Per-service span naming convention:

- Controller spans: `<HTTP method> <route>` (for example `POST /v1/refund-requests`).
- Service spans: `<class>.<method>` (for example `RefundDecisionServiceImpl.decide`).
- Repository spans: `<repo>.<method>` (for example `RefundRequestRepository.findById`).
- Listener spans: `<topic> process` continuing the producer trace from the record `traceparent`.
- Outbox relay spans: `OutboxRelay.publish` with the row's `traceparent` as parent.
- Provider spans: `<Adapter>.<method>` with the Resilience4j instance name as an attribute.

## 13.6 Dashboards

Owned by [SDD §11.4](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default): one per deployable plus one refund-flow dashboard.

| Dashboard | Tool | Audience | URL |
|-----------|------|----------|-----|
| `Refunds Platform - refunds-platform-core` (RED, JVM, both pools, Kafka lag) | Open (SDD §6) | All | TBD |
| `Refunds Platform - payout-service` (RED, attempts, retries, window, reconciliation) | Open | SRE | TBD |
| `Refunds Platform - notification-service` (sends per channel, pending, failures) | Open | SRE | TBD |
| `Refunds Platform - Refund flow` (requests by status, time to PAID average and p90 vs the 3-day objective, payouts pending and failed, take-back lag) | Open | Product and SRE | TBD |

> TODO: dashboard URLs and the dashboard tool (SDD §6 "dashboard tool" open) - verify.

## 13.7 Alerts

| Alert | Threshold | Severity | Action |
|-------|-----------|----------|--------|
| `OutboxBacklogAge` | `outbox_oldest_age_seconds > 60` for 5m | Page | RB-01 |
| `DlqNotEmpty` | `dlq_depth > 0` (SDD §11.4) | Page | RB-02 |
| `PayoutWindowExpired` | `increase(payout_window_expired_total[15m]) > 0` | Page | RB-04 |
| `RefundPayoutFailedOpen` | `refund_payout_failed_open > 0` | Warn | RB-04 |
| `PayoutOutcomeOverdue` | `refund_payout_outcome_overdue > 0` | Page | RB-04 |
| `PayoutLeaseExpired` | `increase(payout_attempt_leases_expired_total[1h]) > 0` | Warn | Check restarts; RB-07 |
| `PayoutResultsUnmatched` | `payout_results_unmatched > 0` for 30m | Page | RB-06 |
| `PayoutReconciliationMismatch` | `increase(payout_reconciliation_mismatches_total[1d]) > 0` | Page | RB-04 |
| `BalanceDrift` / `TakeBackAppliedLate` / `ParkedTakeBackStale` | `points_balance_drift_total`, `points_take_backs_applied_late_total` increase, or `points_take_backs_parked_stale > 0` | Warn | RB-05 |
| `NotificationFailed` | `increase(notifications_total{status="FAILED"}[15m]) > 0` | Warn | Check provider circuit; RB-02 if dead-lettered |
| `ReceiptLookupCircuitOpen` | `resilience4j_circuitbreaker_state{name="posRecords",state="open"} == 1` for 2m | Page | Contact the Retail IT team (R-08) |
| `ReceiptNotFoundBurst` | more than 20 `RECEIPT_NOT_FOUND` answers for one customer in a day (SDD §17.1) | Warn | Security review of the account (R-09) |
| `SecurityEvent` | `increase(security_events_total[5m]) > 0` | Page | RB-09 |
| `5xx rate` | `rate(http_server_requests_seconds_count{status=~"5.."}[5m]) / rate(http_server_requests_seconds_count[5m]) > 0.05` for 1m | Page | REFUNDS/NFR-02 disrupted-minute definition (SDD §18) |
| `p99 latency SLO` | per-service target from `12-performance.md` § SLOs | Warn | Investigate slow path |

> TODO: the per-customer `ReceiptNotFoundBurst` alert needs a signal that identifies the customer without a customer label on a metric or `customer_id` at INFO; best guess: a WARN log event with a keyed hash of the subject, alerted in the log store - verify with the security review.

> TODO: best-guess thresholds for outbox age, unmatched results, and the paging tool (SDD §11.4 "paging tool and on-call rotation" open) - verify with the operations team.

## 13.8 Runbook Procedures

> **Convention:** every paging alert maps to a runbook procedure here. The SDD procedures (§20.1) are all open templates, so these are skeletons written against this design.

> TODO: concrete commands once code exists - verify (namespace names, deployment names, the log store query language, and the redrive switch are not fixed yet).

### RB-01: Drain outbox backlog

```text
Trigger: OutboxBacklogAge.
1. Identify the publisher: service label on outbox_oldest_age_seconds (refunds-platform-core or payout-service).
2. Check which replica holds the relay lock: kubectl logs -l app=<deployable> -n <env> | grep "OutboxRelay lock acquired"
3. Check the broker: kafka_consumer_lag and producer errors in the relay logs (event=outbox_publish_failed).
4. Broker healthy but no lock holder: restart one pod (kubectl delete pod <pod> -n <env>); the lock moves to another replica.
5. Broker unhealthy: follow the platform Kafka runbook; rows stay in outbox_event and are published in order when it recovers.
6. Verify: outbox_oldest_age_seconds falls below 60 s within 10 minutes; else escalate to the architect on-call.
```

### RB-02: Replay DLQ

```text
Trigger: DlqNotEmpty.
1. Read the DLQ record headers (exception class, message, original topic, offset); no payload is printed at INFO.
2. Classify: deserialization or schema -> fix the producer or schema; unknown aggregate or invalid transition -> investigate data first.
3. After the fix is deployed: start the consumer's redrive listener (management endpoint of the deployable; switch TBD).
4. The redrive feeds each record to the same handler; the inbox skips anything already applied (SDD §14.6 item 6: never republish to the source topic).
5. Verify dlq_depth returns to 0; stop the redrive listener.
```

### RB-03: Rotate secrets (SDD §20.1.4)

```text
Scope: database passwords per role, Kafka client credentials, Keycloak client secrets, provider credentials and partner verification secrets per tenant.
1. Create the new secret version in the secrets manager (product open).
2. Providers and partners: register the new credential or key with the provider first, keep both valid during the overlap.
3. Rolling restart of the deployable that mounts the secret; readiness gates each pod.
4. Revoke the old version after the overlap; verify no authentication errors in the provider circuits.
```

### RB-04: Payout failed after the retry window (SDD §20.1.7)

```text
Trigger: PayoutWindowExpired, RefundPayoutFailedOpen, PayoutOutcomeOverdue, or PayoutReconciliationMismatch.
1. Find the payout by refund reference number (payout.reference_number) in payout-service; read its attempts and last provider code.
2. Check with CardPay (status query or support) whether any attempt was paid; never create a second payout by hand for the same refund.
3. Paid at CardPay: wait for or request the API-03 result; the payout moves to SUCCEEDED and the request to PAID automatically.
4. Not paid: contact the branch manager (the request stays APPROVED and flagged); manual resolution path and record keeping TBD (SDD §20.1.7).
```

### RB-05: Balance drift, late take-back, or stale parked take-back

```text
1. BalanceDrift: compare the member's points_balance with the sum of points_movement; the ledger is the truth (SDD §17.4).
2. Rebuild the member's balance from the movements in one transaction (a reviewed SQL script); never edit movements.
3. TakeBackAppliedLate or ParkedTakeBackStale: check the POS member-purchase feed (API-06) for delays; confirm A-4 (purchase reference = receipt number) for the affected branch.
```

### RB-06: Unmatched payout results

```text
1. List payout_result rows with status UNMATCHED (tenant-scoped); compare echoed_reference and provider_payout_ref with payouts.
2. A result that matches after an API-02 response recorded the provider reference re-matches automatically; if not, link it by a reviewed script and apply it.
3. A result naming an unknown payout for the partner key's tenant: treat as a security event (RB-09).
```

### RB-07 to RB-09: Restart a deployable, database failover, tenant-specific incident (SDD §20.1.1, §20.1.5, §20.1.6)

```text
RB-07 Restart: kubectl rollout restart deployment/<deployable> -n <env>; payout attempts in flight resume in doubt when their leases expire.
RB-08 Failover: after the database fails over, relays re-acquire their advisory locks and consumers resume from committed offsets; verify outbox age and lag.
RB-09 Tenant incident: filter logs and metrics by tenant_ref; suspend the tenant's partner keys at the gateway; provider credentials per tenant can be revoked alone.
```

## 13.9 On-Call

- **Rota:** open (SDD §20.3).
- **Escalation policy:** open (SDD §20.3), including CardPay, MsgHub, and Retail IT contacts.
- **Communication channel:** open (SDD §20.3).

**Release readiness (CLAUDE.md new-service checklist, per deployable):**

| Item | refunds-platform-core | payout-service | notification-service |
|------|-----------------------|----------------|----------------------|
| Bounded context documented | SDD §17.1, §17.4; this LLD | SDD §17.2; this LLD | SDD §17.3; this LLD |
| Owned DB | schemas `refund`, `loyalty` | database `payout` | database `notification` |
| OpenAPI spec | `refunds-platform-core-v1.yaml` | `payout-service-v1.yaml` | Not applicable (no business API) |
| Kafka contracts | 07 | 07 | 07 |
| Helm chart, dashboards, runbook, on-call | Open | Open | Open |

> TODO: not derivable from inputs - on-call rota, escalation, communication channel (SDD §20.3), and the Helm chart owners - please specify.

<!-- MASTER: lld-master.md | PREV: 09-cross-cutting.md | NEXT: 11-security.md -->
