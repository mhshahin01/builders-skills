<!--
CHUNK: 10
TITLE: Operations
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 09
PART OF: LLD - Refunds Platform
-->

# 13. Operations

Design: [SDD §11.4 Observability](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), [SDD §19 Environments](../sdd-refunds-platform/15-environments.md#19-environments), [SDD §20 Operations Runbook](../sdd-refunds-platform/16-operations-runbook.md#20-operations-runbook). One deployable, so the Service column names the module that reads the variable.

## 13.1 Configuration (per service)

| Service | Variable | Type | Default | Notes |
|---------|----------|------|---------|-------|
| deployable | `DB_URL`, `DB_USER` | string | (none) | JDBC URL and the application role (owns no table, ADR-06) |
| deployable | `DB_PASSWORD` | secret | (none) | From the secrets manager |
| deployable | `KEYCLOAK_ISSUER_URI` | string | (none) | Token issuer of the realm |
| deployable | `TENANT_CONFIG` | Helm values block | (none) | Tenants, currency, locale, time zone, templates, credential paths (SDD §11.5) |
| deployable | `EVENT_REDELIVERY_AGE`, `EVENT_REDELIVERY_INTERVAL`, `EVENT_MAX_REDELIVERIES` | duration, duration, int | 5m, 1m, 10 | Best guesses, open in SDD §14.10 (09 § 12.4) |
| deployable | `OTEL_EXPORTER_OTLP_ENDPOINT` | string | (none) | Trace backend (open in SDD §6) |
| refund | `POS_BASE_URL`, `POS_TIMEOUT_MS` | string, int | (none), 3000 | API-02; timeout best guess (09 § 12.3) |
| refund | `REFUND_WINDOW_HOURS` | int | 720 | 30 x 24 h (08 § 11.3) |
| payout | `CARDPAY_BASE_URL`, `CARDPAY_TIMEOUT_MS` | string, int | (none), 10000 | API-03 |
| payout | `PAYOUT_DISPATCH_INTERVAL_MS`, `PAYOUT_BATCH_SIZE`, `PAYOUT_CLAIM_LEASE_MS` | int | 30000, 50, 120000 | Best guesses (payout § 7.3 TODO) |
| payout | `PAYOUT_BACKOFF_INITIAL_MS`, `PAYOUT_BACKOFF_MAX_MS`, `PAYOUT_RETRY_WINDOW_HOURS` | int | 60000, 3600000, 24 | 24 h from REFUNDS/UC-04 E1 |
| payout | `PAYOUT_RECONCILIATION_CRON` | cron | `0 0 4 * * *` | Daily, tenant time zone independent (UTC) |
| notification | `MSGHUB_BASE_URL`, `MSGHUB_TIMEOUT_MS` | string, int | (none), 5000 | API-04 |
| notification | `NOTIFICATION_DISPATCH_INTERVAL_MS`, `NOTIFICATION_MAX_ATTEMPTS`, `NOTIFICATION_RETENTION_DAYS` | int | 15000, 10, 90 | Best guesses (notification § 7.3 TODO, 05 § 8.6 TODO) |
| loyalty | `LOYALTY_PENDING_TAKE_BACK_WAIT_DAYS`, `LOYALTY_NIGHTLY_CRON` | int, cron | 30, `0 30 2 * * *` | Wait best guess (loyalty § 7.3 TODO) |

Provider credentials are not variables: they are per tenant, at the secrets-manager paths of `TENANT_CONFIG`.

## 13.2 Health & Readiness

> See `09-cross-cutting.md` § 12.10. Per-service additions:

| Service | Liveness checks | Readiness checks |
|---------|-----------------|------------------|
| deployable (all modules) | App responds | DB pool healthy, Flyway migrations complete; provider and Keycloak availability excluded |

## 13.3 Metrics (RED: Rate, Errors, Duration)

> **Default per service:**

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_server_requests_seconds` | histogram | `method`, `uri`, `status`, `module` | Request rate, latency, error rate per module and endpoint (SDD §11.4) |
| `db_pool_active` | gauge | `pool` | DB pool saturation |
| `event_publication_oldest_incomplete_seconds` | gauge | `event` | Oldest incomplete in-process publication (SDD §11.4) |
| `event_publication_stuck_total` | counter | `event` | Publications over the re-delivery limit (SDD §11.4) |
| `resilience4j_circuitbreaker_state` | gauge | `name` (`pos-records`, `cardpay`, `msghub`) | Provider circuit state |

Broker metrics (`kafka_*`) and `outbox_*` are not applicable (no broker, no outbox table).

> **Per-service custom metrics** (from each service's SDD `13x` Observability) are added to this table, one row per metric with its `service` label.

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `refund_requests_total` | counter | `status` | SDD §17.1 |
| `refund_decision_seconds` | histogram | `outcome` | SDD §17.1 |
| `refund_awaiting_decision` | gauge | - | SDD §17.1 |
| `refund_pos_lookup_seconds` | histogram | `outcome` | SDD §17.1, API-02 |
| `refund_poison_events_total` | counter | `event` | LLD-only: `PayoutSucceeded` that cannot apply (refund § 7.3) |
| `payout_attempts_total` | counter | `outcome` | SDD §17.2 |
| `payout_oldest_open_seconds` | gauge | - | SDD §17.2 (REFUNDS/NFR-01 alert) |
| `payout_failed_total` | counter | - | SDD §17.2 |
| `payout_reconciliation_mismatches_total` | counter | - | SDD §17.2 |
| `payout_cardpay_seconds` | histogram | `outcome` | SDD §17.2, API-03 |
| `notification_messages_total` | counter | `channel`, `status` | SDD §17.3 |
| `notification_oldest_pending_seconds` | gauge | `channel` | SDD §17.3 |
| `notification_msghub_seconds` | histogram | `channel`, `outcome` | SDD §17.3, API-04 |
| `loyalty_take_back_lag_seconds` | histogram | - | SDD §17.4 (LOYALTY/NFR-02) |
| `loyalty_pending_take_backs` | gauge | - | SDD §17.4 |
| `loyalty_late_purchase_after_expiry_total` | counter | - | SDD §17.4 |
| `loyalty_balance_mismatch_total` | counter | - | SDD §17.4 (LOYALTY/NFR-01) |
| `loyalty_purchases_ingested_total` | counter | `outcome` | SDD §17.4 |

> Confirm: the `module` label on `http_server_requests_seconds` is derived from the handler's top-level package by an observation filter; SDD §11.4 asks for RED per module but does not say how the label is set.

## 13.4 Logs

> See `09-cross-cutting.md` § 12.7 for the platform-wide log format. Per-service log volume estimates:

| Service | Estimated lines/day | Hot retention | Cold retention |
|---------|---------------------|---------------|----------------|
| deployable (all modules) | About 50,000 (about 40 refunds a day, reads, dispatcher cycles) | Open (SDD §6) | Open (SDD §6) |

> TODO: log volume is an LLD estimate and the retention of the central log store is open in SDD §6; best guess: 30 days hot, 1 year cold - verify.

> **Triage by use case:** filter logs on `use_case` matching the whole token `(^|,)[KEY]/UC-NN(,|$)` to see every request of one use case (equality misses entry points shared by several use cases; `09-cross-cutting.md` § 12.8); the use case's row in `16-references.md` § 19.9 leads to its workflow, BRD use case, and test cases.

## 13.5 Tracing

> See `09-cross-cutting.md` § 12.8. Per-service span naming convention:

- Controller spans: `<HTTP method> <route>` (e.g. `POST /v1/refund-requests/{refundId}/decision`).
- Service spans: `<class>.<method>` (e.g. `RefundDecisionServiceImpl.decide`).
- Repository spans: `<repo>.<method>` (e.g. `RefundRequestRepository.save`).
- Port spans: `PayoutPort.requestPayout` (API-01, SDD §17.2 Tracing).
- Listener spans: `<Listener>.on <Event>` (e.g. `RefundPaidListener.on RefundPaid`), linked to the publishing trace.
- Dispatcher spans: `PayoutDispatcher.run`, `NotificationDispatcher.run`, with one child span per provider call (`CardPayAdapter.send`, `MsgHubAdapter.send`).
- Entry-point spans (controller, listener, scheduled job) of a BRD use case carry `use_case` (§ 12.8), so a trace search by use case finds every request of it.

## 13.6 Dashboards

| Dashboard | Tool | Audience | URL |
|-----------|------|----------|-----|
| `Refunds Platform - Overview` (SDD §18 targets) | Grafana | All | Not yet created |
| `Refunds Platform - refund` / `payout` / `notification` / `loyalty` (one per module, SDD §11.4) | Grafana | Development, SRE | Not yet created |
| `Refunds Platform - Event delivery and dispatch` | Grafana | SRE | Not yet created |

> TODO: dashboard URLs - verify once the Grafana folders exist.

## 13.7 Alerts

| Alert | Threshold | Severity | Action |
|-------|-----------|----------|--------|
| `AvailabilitySLO` (REFUNDS/NFR-02) | Gateway 5xx burn rate against 99.7% monthly (SDD §18) | Page | RB-04 when POS-caused, else investigate |
| `PayoutNotTerminal` (REFUNDS/NFR-01) | `payout_oldest_open_seconds > 86400 + PAYOUT_DISPATCH_INTERVAL` | Page | RB-01 |
| `PayoutFailedOrUnknown` | `increase(payout_failed_total[15m]) > 0` | Warn | RB-05 |
| `PayoutReconciliationMismatch` | `increase(payout_reconciliation_mismatches_total[1d]) > 0` | Page | RB-05 |
| `EventPublicationLag` (LOYALTY/NFR-02) | `event_publication_oldest_incomplete_seconds > 1800` | Page | RB-02 |
| `EventPublicationStuck` | `increase(event_publication_stuck_total[15m]) > 0` | Page | RB-02 |
| `TakeBackLag` (LOYALTY/NFR-02) | p99 of `loyalty_take_back_lag_seconds` over 1 h > 2700 | Warn | RB-02 |
| `BalanceMismatch` (LOYALTY/NFR-01) | `increase(loyalty_balance_mismatch_total[1d]) > 0` | Page | RB-06 |
| `MessageBacklog` | `notification_oldest_pending_seconds > 3600` | Warn | RB-03 |
| `PosLookupDown` | `resilience4j_circuitbreaker_state{name="pos-records",state="open"} == 1 for 5m` | Page | RB-04 |
| `RefundPoisonEvent` | `increase(refund_poison_events_total[15m]) > 0` | Page | RB-02 |

> TODO: alert thresholds and severities are LLD best guesses; the paging policy is open in SDD §20.3 - verify with on-call.

## 13.8 Runbook Procedures

> **Convention:** every paging alert maps to a runbook procedure here. Procedures are step-by-step, copy-pasteable, and assume the on-call has not worked on this service before.

> TODO: concrete commands once code exists - verify; namespace, deployment name, and database access are open in SDD §20.1 (the placeholders `<ns>`, `<deploy>`, `<db>` below).

### RB-01: Payouts not turning Paid (payout backlog)

```text
1. Confirm: Grafana "Event delivery and dispatch", panel payout_oldest_open_seconds; note the circuit state of cardpay.
2. List open payouts (read-only, in the tenant's context):
   psql <db> -c "SELECT set_config('app.tenant_id','<tenant>',false); SELECT id, status, attempt_count, first_attempt_at, next_attempt_at, last_failure_reason FROM payout.payout WHERE status IN ('PENDING','RETRYING') ORDER BY next_attempt_at LIMIT 50;"
3. If the circuit is open: CardPay outage. Check payout_attempts_total{outcome} and the CardPay status page; wait, payouts retry by themselves.
4. If the circuit is closed and next_attempt_at is in the past for many rows: dispatchers are not running.
   kubectl get pods -n <ns> -l app=<deploy>; kubectl logs <pod> -n <ns> | grep PayoutDispatcher | tail -50
5. Restart one replica at a time: kubectl rollout restart deployment/<deploy> -n <ns>; claimed rows are released when their lease ends.
6. Escalate to the architect on call if the oldest payout passes 24 h and the circuit is closed.
```

> Never set a payout to SUCCEEDED or FAILED by hand and never change its id: the id is the CardPay idempotency key, and a manual change can pay twice (REFUNDS/NFR-01).

### RB-02: Stuck or poison event publications

```text
1. Confirm: event_publication_oldest_incomplete_seconds and event_publication_stuck_total by event label.
2. Find the publications (schema platform):
   psql <db> -c "SELECT id, listener_id, event_type, publication_date FROM platform.event_publication WHERE completion_date IS NULL ORDER BY publication_date LIMIT 50;"
3. Read the listener's ERROR log for the event type: kubectl logs <pod> -n <ns> | grep -i '<listener id>' | tail -50
4. Poison PayoutSucceeded (refund): compare the payout amount with approved_amount; fix the data cause through a reviewed change, then reset the redelivery count:
   psql <db> -c "DELETE FROM platform.event_publication_redelivery WHERE publication_id = '<id>';"
5. Transient cause (database or lock timeout): reset the count as in step 4; EventRedeliveryJob re-delivers within EVENT_REDELIVERY_INTERVAL.
6. Never delete an incomplete publication: the event (a take-back, a Paid status, a message) would be lost.
```

### RB-03: Message backlog (MsgHub)

```text
1. Confirm: notification_oldest_pending_seconds by channel; circuit state of msghub.
2. Circuit open with authentication errors in the log: rotate the MsgHub credential (RB-07, open) and wait for the half-open probe.
3. Circuit closed but rows not moving: check NotificationDispatcher in the logs and restart as in RB-01 step 5.
4. FAILED rows: messages that exhausted their attempts; refunds are not affected. Re-queueing is open in SDD §20.1.3.
```

### RB-04: Customers cannot submit refunds (POS records unavailable)

```text
1. Confirm: PosLookupDown alert; refund_pos_lookup_seconds{outcome} errors.
2. Customers receive 503 UNAVAILABLE with a try-again message; tracking, decisions, and loyalty keep working (SDD §18.3).
3. Contact the Retail IT team (POS records owner); check whether the POS credentials expired (secrets manager).
4. No data repair is needed: no request is created without the receipt.
```

### RB-05: Payout ended Failed or Unknown, or reconciliation mismatch

```text
1. Find the payout: SELECT id, refund_id, status, last_failure_reason FROM payout.payout WHERE status IN ('FAILED','UNKNOWN') ORDER BY updated_at DESC;
2. UNKNOWN: do nothing by hand; the daily reconciliation settles it from CardPay's records.
3. FAILED: the branch manager was told (PayoutFailed); what may follow is open in SDD §17.2 (After Failed).
4. Reconciliation mismatch: export the payout rows and the CardPay report lines for finance; never re-request a payout.
```

### RB-06: Balance differs from the sum of its movements

```text
1. Confirm: loyalty_balance_mismatch_total and the nightly job log (member_id only at DEBUG).
2. Recompute for the member: SELECT sum(points) FROM loyalty.points_movement WHERE member_id = '<member>';
3. A correction is a new movement through a reviewed change (movements are never updated, SDD §17.4), followed by a balance update in the same transaction.
```

> The SDD §20.1 procedures for restart, secret rotation (RB-07), database failover, and tenant incidents are open in the SDD and are not designed here.

## 13.9 On-Call

- **Rota:** open in SDD §20.3.
- **Escalation policy:** open in SDD §20.3.
- **Communication channel:** open in SDD §20.3.

> TODO: on-call rota, escalation, and channel are open in SDD §20.3; best guess: the development team's rota with escalation to the architect on call - verify.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 09-cross-cutting.md | NEXT: 11-security.md -->
