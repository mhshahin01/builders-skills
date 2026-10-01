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

Keys are Spring properties; Helm values render them as environment variables (Spring relaxed binding) or mounted files. Secrets come from the secrets manager (`09-cross-cutting.md` § 12.9).

| Service | Variable | Type | Default | Notes |
|---------|----------|------|---------|-------|
| all | `spring.datasource.url`, `spring.datasource.username` | string | (none) | Core, `payout`, or `notification` database |
| all | `spring.datasource.password` | secret | (none) | Secrets manager |
| all | `spring.kafka.bootstrap-servers` | csv | (none) | TLS; client credentials per deployable (SDD §11.6) |
| all | `refunds-platform.tenants[]` | list | (none) | Tenant id, `ref`, `time-zone`, `locale`, `partner-keys` |
| all | `refunds-platform.outbox.poll-interval`, `refunds-platform.outbox.batch-size` | duration, int | `PT0.5S`, `100` | Publishers only (core, payout-service) |
| all | `refunds-platform.problem.base-uri` | URI | (none) | § 12.6 TODO |
| refunds-platform-core | `spring.security.oauth2.resourceserver.jwt.issuer-uri` | URI | (none) | Keycloak realm |
| refunds-platform-core | `refunds-platform.refund.security.role-permissions.*`, `refunds-platform.loyalty.security.role-permissions.*` | map | (none) | Values from SDD §16.11 |
| refunds-platform-core | `refunds-platform.pos.base-url` | URI | (none) | API-01 (TBD - external) |
| refunds-platform-core | `refunds-platform.payout.retry-window` | duration | ADR-10 value | Watchdog cutoff |
| refunds-platform-core | `refunds-platform.refund.payout-watchdog.cron` | cron | `0 15 3 * * *` | UTC |
| payout-service | `refunds-platform.cardpay.base-url` | URI | (none) | API-02 and the report (TBD - external) |
| payout-service | `refunds-platform.payout.retry-window` | duration | ADR-10 value | Shortened only below Prod (A-L06) |
| payout-service | `refunds-platform.payout.backoff.base`, `refunds-platform.payout.backoff.cap` | duration | `PT1M`, `PT2H` | TODO in `04-implementation/payout-service.md` |
| payout-service | `refunds-platform.payout.in-doubt-resolution` | enum | `RESEND` | `RESEND` or `STATUS_QUERY` |
| payout-service | `refunds-platform.payout.scheduler.interval`, `refunds-platform.payout.scheduler.batch-size` | duration, int | `PT5S`, `10` | Per tenant per tick |
| payout-service | `refunds-platform.payout.reconciliation.cron` | cron | `0 30 4 * * *` | UTC |
| notification-service | `refunds-platform.msghub.base-url`, `refunds-platform.keycloak-admin.base-url` | URI | (none) | API-04, API-05 |
| notification-service | `spring.security.oauth2.client.registration.keycloak-admin.client-id` (+ secret) | string, secret | (none) | Client credentials for API-05 |
| notification-service | `refunds-platform.notification.max-attempts`, `refunds-platform.notification.dispatch.interval` | int, duration | `8`, `PT5S` | TODO in `04-implementation/notification-service.md` |

## 13.2 Health & Readiness

> See `09-cross-cutting.md` § 12.10. Per-service additions:

| Service | Liveness checks | Readiness checks |
|---------|-----------------|------------------|
| `refunds-platform-core` | App responds | Core database pool; both Flyway histories migrated |
| `payout-service` | App responds | `payout` database pool; Flyway migrated |
| `notification-service` | App responds | `notification` database pool; Flyway migrated |

## 13.3 Metrics (RED - Rate, Errors, Duration)

> **Default per deployable** (every metric carries `tenant_ref`, SDD §11.4):

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_server_requests_seconds` | histogram | `method`, `uri`, `status`, `service` | Request rate, latency, error rate |
| `kafka_consumer_records_consumed_total` | counter | `topic`, `group` | Consumption throughput |
| `kafka_consumer_lag` | gauge | `topic`, `group`, `partition` | Consumer lag |
| `outbox_unprocessed_count`, `outbox_oldest_age_seconds` | gauge | `service` | Outbox backlog and age |
| `dlq_depth` | gauge | `topic` | Dead-lettered records waiting |
| `db_pool_active` | gauge | `service`, `pool` | DB pool saturation |
| `resilience4j_circuitbreaker_state` | gauge | `name`, `state` | Provider circuits |

> **Per-service business metrics** are the SDD's, names verbatim: [§17.1 Metrics](../sdd-refunds-platform/13a-service-refund.md#171-refund-service), [§17.2](../sdd-refunds-platform/13b-service-payout.md#172-payout-service), [§17.3](../sdd-refunds-platform/13c-service-notification.md#173-notification-service), [§17.4](../sdd-refunds-platform/13d-service-loyalty.md#174-loyalty-service). LLD additions: `refund_receipt_lookup_not_found_burst_total` (counter), `refund_payout_amount_mismatch_total` (counter), `idempotency_replays_total` (counter, label `operation`), `inbox_duplicates_total` (counter, label `consumer`).

## 13.4 Logs

> See `09-cross-cutting.md` § 12.7 for the platform-wide log format. Per-service log volume estimates:

| Service | Estimated lines/day | Hot retention | Cold retention |
|---------|---------------------|---------------|----------------|
| `refunds-platform-core` | Not estimated (read traffic open, SDD §18.1) | Per SDD §6 (open) | Per SDD §6 (open) |
| `payout-service` | Low (at most 1,200 payouts a month, SDD §18.1) | Per SDD §6 | Per SDD §6 |
| `notification-service` | Low (at most 7,200 messages a month, SDD §18.1) | Per SDD §6 | Per SDD §6 |

> **Triage by use case:** filter logs on `use_case = "REFUNDS/UC-04"` (or any keyed ID) to see every request of one use case; the use case's row in `16-references.md` § 19.9 leads to its workflow, BRD use case, and test cases.

## 13.5 Tracing

> See `09-cross-cutting.md` § 12.8. Span naming:

- Controller spans: `<HTTP method> <route>` (for example `POST /v1/refund-requests/{refundId}/decision`).
- Service spans: `<class>.<method>` for the application services (`RefundDecisionServiceImpl.decide`), created with `@WithSpan`.
- Repository spans: JDBC auto-instrumentation.
- Outbox relay spans: `OutboxRelay.cycle`, with a publish span per record that continues the stored trace context.
- Consumer spans: `<topic> process` from the Kafka instrumentation, child of the producer's trace.
- Entry-point spans of a BRD use case carry `use_case` (§ 12.8), so a trace search by use case finds every request of it; the consumer spans of the same flow are found through the trace.

## 13.6 Dashboards

| Dashboard | Tool | Audience | URL |
|-----------|------|----------|-----|
| `Refunds Platform - refunds-platform-core` (RED, JVM, DB pool, Kafka lag) | Not pinned (SDD §6) | All | TBD |
| `Refunds Platform - payout-service` | Not pinned | All | TBD |
| `Refunds Platform - notification-service` | Not pinned | All | TBD |
| `Refunds Platform - refund flow` (requests by status, time from submission to PAID against the 3-day objective, payouts pending and failed, take-back lag) | Not pinned | Product, SRE | TBD |

> TODO: dashboard tool and URLs - verify once the observability products are chosen (SDD §6).

## 13.7 Alerts

| Alert | Threshold | Severity | Action |
|-------|-----------|----------|--------|
| `OutboxBacklog` | `outbox_oldest_age_seconds > 30 for 5m` | Page | RB-01 |
| `DlqNotEmpty` | `dlq_depth > 0` (page when more than 10 new records in 1h) | Warn / Page | RB-02 |
| `ConsumerLag` | `kafka_consumer_lag` above the per-group threshold for 10m | Warn | RB-03 |
| `PayoutWindowExpired` | `increase(payout_window_expired_total[1h]) > 0` | Page | RB-04 |
| `PayoutOutcomeOverdue` | `refund_payout_outcome_overdue > 0` | Page | RB-04 |
| `PayoutResultsUnmatched` | `payout_results_unmatched > 0 for 15m` | Warn | RB-04 |
| `PayoutReconciliationMismatch` | `increase(payout_reconciliation_mismatches_total[1d]) > 0` | Page | RB-04 |
| `PayoutLeaseExpired` | `increase(payout_attempt_leases_expired_total[1h]) > 0` | Warn | RB-04 |
| `NotificationFailed` | `increase(notifications_total{status="FAILED"}[1h]) > 0` | Warn | RB-06 |
| `PointsBalanceDrift` | `increase(points_balance_drift_total[1d]) > 0` | Page | RB-07 |
| `TakeBackParkedStale` / `TakeBackAppliedLate` | PARKED older than 2 days > 0 / `increase(points_take_backs_applied_late_total[1d]) > 0` | Warn | RB-07 |
| `ReceiptLookupCircuitOpen` | `pos-receipt` circuit open for 1m | Page | RB-05 |
| `SecurityEvents` | `refund_receipt_lookup_not_found_burst_total` or partner-signature failures increase | Warn | RB-08 |
| `RefundsNfr02Budget` | disrupted minutes (SDD §18 REFUNDS/NFR-02 definition) burn above budget | Page | RB-09 |
| `DbPoolSaturation` | `db_pool_active / db_pool_max > 0.9 for 5m` | Warn | RB-09 |

> TODO: consumer-lag thresholds are open (SDD §18 marks the loyalty-service lag threshold as `[NEEDS CLARIFICATION]`); best guess 100 records or 5 minutes of lag for `loyalty-service` (inside the LOYALTY/NFR-02 hour) and 500 for the others - verify.

## 13.8 Runbook Procedures

> **Convention:** every paging alert maps to a procedure here. The SDD's procedures (§20) are still templates; the steps below are skeletons built from this LLD's metrics and endpoints. Namespaces, deployment names, and dashboard paths are placeholders (`<ns>`).

> TODO: concrete commands, namespaces, and escalation contacts once code and clusters exist - verify every procedure in SIT (SDD §20.1 and §20.3 are `[NEEDS CLARIFICATION]`).

### RB-01: Drain outbox backlog (refunds-platform-core or payout-service)

```text
1. Confirm: dashboard panel "outbox oldest age" for the publisher; if falling and under 30 s, observe 2 minutes.
2. Find pods:        kubectl get pods -n <ns> -l app=<refunds-platform-core|payout-service>
3. Relay errors:     kubectl logs <pod> -n <ns> | grep '"event":"outbox_relay' | tail -50
4. Broker reachable? kubectl exec <pod> -n <ns> -- curl -s localhost:8080/actuator/health | jq
5. Lock holder:      SELECT pid, granted FROM pg_locks WHERE locktype = 'advisory';   (one holder expected)
6. If a relay is stuck: kubectl rollout restart deployment/<deployable> -n <ns>
7. Verify drain:     watch -n 5 'kubectl exec <pod> -n <ns> -- curl -s localhost:8080/actuator/metrics/outbox_unprocessed_count'
8. Stalled after 10 minutes: escalate to the architect on call.
```

### RB-02: Replay DLQ (SDD §20.1.3)

```text
1. Inspect: kafka-console-consumer --topic <consumer>.dlq --from-beginning --property print.headers=true (read the exception headers)
2. Fix the cause (deploy, data correction, or contract fix); record it in the incident ticket.
3. Start redrive: kubectl exec <pod> -n <ns> -- curl -s -X POST localhost:8080/actuator/dlqredrive -d '{"action":"start"}'
4. Watch dlq_depth fall to 0 and inbox_duplicates_total (duplicates are expected and harmless).
5. Stop redrive: same call with "stop". Never republish to the domain topic (SDD §14.6 item 6).
```

### RB-03: Consumer lag

```text
1. Identify the group and partition from kafka_consumer_lag; check the consumer pods' logs for retries.
2. A record blocking a partition in retry: wait for the retry budget (about 7 s) to dead-letter it, then RB-02.
3. Throughput: scale notification-service (HPA on lag) or restart the core if its listener threads are stuck.
```

### RB-04: Payout failed, overdue, unmatched, or mismatched (SDD §20.1.7)

```text
1. Identify the payout: payout-service logs by payout_id / refund_id (DEBUG ids are not at INFO: use the trace id from the alert).
2. Check CardPay status for the payout id (provider portal or status query, TBD - external).
3. Unmatched result: SELECT id, provider_payout_ref, echoed_reference FROM payout_result WHERE tenant_id = :t AND status = 'UNMATCHED';
4. Paid at CardPay but FAILED here: the next matched API-03 result or the reconciliation evidence moves it to SUCCEEDED (late confirmation).
5. Not paid at CardPay after the window: follow the manual resolution path agreed with the branch manager (SDD §20.1.7, open); never create a second payout row.
```

### RB-05: POS Records outage, secret or partner-key rotation (SDD §20.1.4)

```text
POS outage: confirm the pos-receipt circuit state; customers get 503 RECEIPT_LOOKUP_UNAVAILABLE; contact the Retail IT team; report POS-caused minutes separately (SDD §18).
Rotation: write the new secret or partner key to the secrets manager for the tenant, register it with the provider, roll the deployable (no hot reload), verify one signed partner call, retire the old value.
```

### RB-06: Notification failures

```text
1. Group FAILED rows: SELECT event_type, channel, last_error_code, count(*) FROM notification WHERE tenant_id = :t AND status = 'FAILED' GROUP BY 1,2,3;
2. Credential or circuit problem -> RB-05; unknown user or tenant mismatch -> security review (never re-send across tenants).
3. After the fix, set chosen rows back to PENDING with attempt_count = 0 (the row id keeps the MsgHub idempotency key).
```

### RB-07: Loyalty ledger alerts

```text
Drift: recompute the member's balance from points_movement; fix by a correcting movement only after the root cause is known (never an UPDATE of points_balance alone).
Parked stale: check the POS member-purchase feed (API-06) for the branch and date; parked take-backs apply automatically when purchases arrive.
Applied late: informational; confirm the delayed feed and close.
```

### RB-08: Security events

```text
Receipt not-found burst: identify the customer from the security audit stream (not the INFO log), review with security, consider disabling the account in Keycloak.
Partner signature invalid: check for a rotated secret (RB-05) before treating it as an attack; the gateway partner route logs the source IP.
```

### RB-09: Restart a deployable and availability budget (SDD §20.1.1)

```text
kubectl rollout restart deployment/<deployable> -n <ns>; kubectl rollout status deployment/<deployable> -n <ns>
Readiness checks the database only, so a restart never waits on Kafka; watch the 5xx rate at the gateway for the REFUNDS/NFR-02 budget.
```

## 13.9 On-Call

- **Rota:** not defined (SDD §20.3 open).
- **Escalation policy:** not defined; must include CardPay, MsgHub, and Retail IT contacts (SDD §20.3).
- **Communication channel:** not defined.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 09-cross-cutting.md | NEXT: 11-security.md -->
