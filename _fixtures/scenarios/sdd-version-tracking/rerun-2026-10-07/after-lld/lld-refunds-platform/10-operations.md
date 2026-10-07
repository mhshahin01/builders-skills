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

Per-environment values follow [SDD §19](../sdd-refunds-platform/15-environments.md#19-environments) (Dev uses provider stubs; SIT and UAT use sandboxes; separate secrets paths per environment).

| Service | Variable | Type | Default | Notes |
|---------|----------|------|---------|-------|
| all three | `DB_URL`, `DB_USER`, `DB_WORKER_USER` | string | (none) | JDBC URL; app and worker roles (05 § 8.4) |
| all three | `DB_PASSWORD`, `DB_WORKER_PASSWORD` | secret | (none) | From the secrets manager |
| all three | `KAFKA_BOOTSTRAP_SERVERS`, `SCHEMA_REGISTRY_URL` | csv, string | (none) | SDD §6 broker and registry |
| all three | `KAFKA_CLIENT_CREDENTIALS` | secret | (none) | Per-deployable Kafka identity (SDD §11.6) |
| all three | `OUTBOX_POLL_INTERVAL_MS`, `OUTBOX_BATCH_SIZE`, `OUTBOX_SEND_TIMEOUT_MS` | int | 1000, 100, 10000 | Relay (09 § 12.4); unused by notification-service, which has no outbox |
| all three | `TENANT_REF_KEY` | secret | (none) | HMAC key for `tenant_ref` (09 § 12.7) |
| all three | `OTEL_EXPORTER_OTLP_ENDPOINT`, `TRACING_SAMPLING_PROBABILITY` | string, float | (none), 0.1 | 09 § 12.8 |
| refunds-platform-core, notification-service | `TENANTS` | map | (none) | `tenant_id` -> zone, currency, locale, earn rate (SDD §11.2) |
| refunds-platform-core | `KEYCLOAK_ISSUER_URI` | string | (none) | JWT issuer and JWKS |
| refunds-platform-core | `POS_RECORDS_BASE_URL` | string | (none) | API-01 and API-04; `TBD - external` |
| refunds-platform-core | `POS_RECORDS_CREDENTIALS_<TENANT>` | secret | (none) | Per tenant |
| refunds-platform-core, payout-service | `PAYOUT_RETRY_WINDOW` | duration | `PT24H` | One value for both (08 § 11.2); home: SDD §17.2 Constraints |
| refunds-platform-core | `REFUND_PAYOUT_WATCHDOG_INTERVAL` | duration | `PT15M` | Watchdog tick |
| refunds-platform-core | `EVENT_PUBLICATION_REPLAY_INTERVAL` | duration | `PT1M` | 07 § 10.6 |
| refunds-platform-core | `LOYALTY_PURCHASE_IMPORT_CRON` | cron | `0 0 * * * *` | Hourly (SDD §17.4 Input) |
| payout-service | `CARDPAY_BASE_URL`, `CARDPAY_CREDENTIALS_<TENANT>` | string, secret | (none) | API-02; `TBD - external` |
| payout-service | `PAYOUT_PROVIDER_IDEMPOTENCY_KEY_SUPPORTED` | bool | `false` | Selects the `ResendGuard` (safe default: status query first) |
| payout-service | `PAYOUT_RETRY_FIRST_DELAY`, `PAYOUT_RETRY_MAX_DELAY`, `PAYOUT_CLAIM_BATCH` | duration, duration, int | `PT1M`, `PT1H`, 20 | 08 § 11.3 |
| notification-service | `MSGHUB_BASE_URL`, `MSGHUB_CREDENTIALS_<TENANT>` | string, secret | (none) | API-03; `TBD - external` |
| notification-service | `MESSAGE_MAX_ATTEMPTS`, `MESSAGE_RETRY_FIRST_DELAY`, `MESSAGE_RETRY_MAX_DELAY` | int, duration, duration | 8, `PT30S`, `PT30M` | 09 § 12.3 |
| notification-service | `DELIVERY_PAYLOAD_KEYS` | secret | (none) | Versioned AES keys for `delivery_payload` (05 § 8.7) |

## 13.2 Health & Readiness

> See `09-cross-cutting.md` § 12.10. Per-service additions:

| Service | Liveness checks | Readiness checks |
|---------|-----------------|------------------|
| `refunds-platform-core` (refund-service, loyalty-service) | App responds | Core DB pool healthy; Flyway `refund`, `loyalty`, `core_events` complete |
| `payout-service` | App responds | Payout DB pool healthy; Flyway complete |
| `notification-service` | App responds | Notification DB pool healthy; Flyway complete |

Kafka, the schema registry, Keycloak, and the providers are not in readiness ([SDD §11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default)); consumer lag, outbox backlog, and circuit-breaker alerts watch them.

## 13.3 Metrics (RED: Rate, Errors, Duration)

> **Default per service:**

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_server_requests_seconds` | histogram | `method`, `uri`, `status`, `service`, `tenant_ref` | Request rate, latency, error rate (SDD §11.4: RED with `tenant_ref`) |
| `kafka_consumer_records_consumed_total` | counter | `topic`, `group`, `service` | Consumption throughput |
| `kafka_consumer_lag` | gauge | `topic`, `group`, `partition`, `tenant_ref` | Consumer lag |
| `outbox_unprocessed_count` | gauge | `service` | Outbox backlog |
| `outbox_oldest_age_seconds` | gauge | `service` | Outbox liveness |
| `db_pool_active` | gauge | `service`, `pool` | DB pool saturation |

> **Per-service custom metrics** (from each service's SDD `13x` Observability) are added to this table, one row per metric with its `service` label.

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `refund_requests_submitted_total`, `refund_decisions_total`, `refund_time_to_decision_seconds`, `refund_request_to_paid_seconds`, `refund_payout_failing_requests`, `refund_payout_outcome_overdue_requests`, `pos_receipt_lookup_duration_seconds` | as in SDD | `service` = refund-service, plus the SDD labels | [SDD §17.1 Metrics](../sdd-refunds-platform/13a-service-refund.md#metrics) |
| `payouts_total`, `payout_attempts_total`, `payouts_retry_scheduled`, `payout_provider_call_duration_seconds` | as in SDD | `service` = payout-service, plus the SDD labels | [SDD §17.2 Metrics](../sdd-refunds-platform/13b-service-payout.md#metrics) |
| `notifications_sent_total`, `notification_send_latency_seconds`, `notifications_pending` | as in SDD | `service` = notification-service, plus the SDD labels | [SDD §17.3 Metrics](../sdd-refunds-platform/13c-service-notification.md#metrics) |
| `loyalty_points_movements_total`, `loyalty_takeback_lag_seconds`, `loyalty_purchase_import_last_success_timestamp`, `loyalty_purchase_import_records_total` | as in SDD | `service` = loyalty-service, plus the SDD labels | [SDD §17.4 Metrics](../sdd-refunds-platform/13d-service-loyalty.md#metrics) |
| `event_publication_incomplete_count`, `event_publication_oldest_age_seconds` | gauge | `listener_id` | LLD: the core publication log (07 § 10.6; SDD §11.4 "publication log backlog") |
| `payouts_held` | gauge | - | LLD: payouts whose CardPay status is unreadable (payout-service § 7.3) |
| `notifications_failed_total` | counter | `reason` (`TEMPLATE_MISSING`, `ATTEMPTS_EXHAUSTED`, `DECRYPTION`) | LLD: terminal message failures |
| `dlq_records_total` | counter | `topic` | LLD: DLQ depth input (SDD §11.4) |

## 13.4 Logs

> See `09-cross-cutting.md` § 12.7 for the platform-wide log format. Per-service log volume estimates:

| Service | Estimated lines/day | Hot retention | Cold retention |
|---------|---------------------|---------------|----------------|
| `refunds-platform-core` | Tens of thousands (about 40 requests a day, three times in seasonal sales, SDD §18.1, plus job ticks) | Per SDD §6 logging row | Per SDD §6 logging row |
| `payout-service` | Thousands | Per SDD §6 logging row | Per SDD §6 logging row |
| `notification-service` | Thousands | Per SDD §6 logging row | Per SDD §6 logging row |

> **Triage by use case:** filter logs on `use_case` matching the whole token `(^|,)[KEY]/UC-NN(,|$)` to see every request of one use case (equality misses entry points shared by several use cases; `09-cross-cutting.md` § 12.8); the use case's row in `16-references.md` § 19.9 leads to its workflow, BRD use case, and test cases.

Consumer and job log lines carry no `use_case` (09 § 12.8); search them by `refundRequestId`, `payoutId`, `source_event_id`, or movement id, the searchable fields of SDD §17.1 to §17.4 Logging.

## 13.5 Tracing

> See `09-cross-cutting.md` § 12.8. Per-service span naming convention:

- Controller spans: `<HTTP method> <route>` (e.g. `POST /v1/refund-requests`).
- Service spans: `<class>.<method>` (e.g. `RefundRequestServiceImpl.submit`).
- Repository spans: `<repo>.<method>` (e.g. `RefundRequestRepository.save`).
- Outbox publisher spans: `OutboxRelay.poll`.
- Consumer spans: `<topic> receive` linked to the producer span through `traceparent`; provider spans: `API-0N <operation>` (e.g. `API-02 send`).
- In-process spans: `RefundPaid dispatch <listener_id>`, linked to the PAID transaction's span.
- Entry-point spans (controller, listener, scheduled job) of a BRD use case carry `use_case` (§ 12.8), so a trace search by use case finds every request of it.

## 13.6 Dashboards

| Dashboard | Tool | Audience | URL |
|-----------|------|----------|-----|
| `Refunds Platform - refunds-platform-core` (RED, JVM, DB pool, consumer lag) | Grafana | All | Not created yet |
| `Refunds Platform - payout-service` | Grafana | All | Not created yet |
| `Refunds Platform - notification-service` | Grafana | All | Not created yet |
| `Refunds Platform - Refund flow` (submitted, decided, paid, overdue, failing) | Grafana | SRE, product | Not created yet |
| `Refunds Platform - Points flow` (earned, taken back, take-back lag, import freshness) | Grafana | SRE, product | Not created yet |
| `Refunds Platform - Outbox, publication log, DLQ` | Grafana | SRE | Not created yet |

One dashboard per deployable and one per business flow, as [SDD §11.4](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) requires.

> TODO: dashboard URLs - verify once the Grafana folders exist.

## 13.7 Alerts

| Alert | Threshold | Severity | Action |
|-------|-----------|----------|--------|
| `OutboxBacklog` | `outbox_unprocessed_count > 100 for 5m` OR `outbox_oldest_age_seconds > 60 for 5m` (per service) | Page | RB-01 |
| `DLQ rows` | `increase(dlq_records_total[15m]) > 0` | Page (refund-service and payout-service DLQs), Warn (notification-service DLQ) | RB-02 |
| `EventPublicationStuck` | `event_publication_oldest_age_seconds > 1800` | Page | RB-04 |
| `TakebackLagSLO` | `histogram_quantile(0.99, loyalty_takeback_lag_seconds) > 3600` over 1h | Page | RB-04 |
| `RefundPayoutOverdue` | `refund_payout_outcome_overdue_requests > 0` | Page | RB-05 |
| `PayoutHeld` | `payouts_held > 0 for 15m` | Page | RB-05 |
| `PayoutFailed` | `increase(payouts_total{outcome="failed"}[1h]) > 0` | Warn | RB-05 |
| `PurchaseImportStale` | `time() - loyalty_purchase_import_last_success_timestamp > 86400` | Page | RB-06 |
| `PurchaseImportRejections` | `increase(loyalty_purchase_import_records_total{outcome="rejected"}[1h]) > 0` | Warn | RB-06 |
| `NotificationTemplateMissing` | `increase(notifications_failed_total{reason="TEMPLATE_MISSING"}[1h]) > 0` | Warn | Add the template (product team) |
| `ProviderCircuitOpen` | Resilience4j circuit state open for `cardPay`, `msgHub`, `posRecords`, `posPurchases` for 5m | Warn | Check the provider status; RB-07 escalation list |
| `AvailabilitySLOBurn` | 30-day error-budget burn of the 99.7% web and API availability target ([SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service)) at 14x over 1h | Page | Investigate 5xx and gateway errors |
| `DB pool saturation` | `db_pool_active / db_pool_max > 0.9 for 5m` | Warn | Investigate query lockups |
| `p99 latency SLO` | per-service target from `12-performance.md` § SLOs | Warn | Investigate slow path |

Alerts target service level objectives and backlogs, not raw resource use (SDD §11.4); `DB pool saturation` stays as a warning only.

## 13.8 Runbook Procedures

> **Convention:** every paging alert maps to a runbook procedure here. Procedures are step-by-step, copy-pasteable, and assume the on-call has not worked on this service before.

The SDD runbook entries ([SDD §20.1](../sdd-refunds-platform/16-operations-runbook.md#201-common-operations)) are NEEDS CLARIFICATION for commands; the procedures below fix the steps. `<ns>` is the environment namespace and `<deployable>` one of `refunds-platform-core`, `payout-service`, `notification-service`.

> TODO: concrete commands once code exists - verify: namespaces, deployment names, Grafana and Kafka tool endpoints, and the database access path below are placeholders until the platform team names them (SDD §19 DNS and §20.1).

### RB-01: Drain outbox backlog

```text
1. Confirm backlog: Grafana "Outbox, publication log, DLQ", panel outbox_unprocessed_count for <deployable>.
   If it is falling, observe 2 minutes before acting.
2. Identify the pods:       kubectl get pods -n <ns> -l app=<deployable>
3. Check the relay:         kubectl logs <pod> -n <ns> | grep '"event":"outbox.send' | tail -20
4. Common cause A, broker down: follow SDD §20.1.7 (broker or schema registry outage); the relay drains by itself after recovery.
5. Common cause B, one row always rejected (size limit, ACL): the log names its event_id and exception class; fix the cause.
6. Relay stuck without errors: kubectl rollout restart deployment/<deployable> -n <ns>
   (one relay instance is active per deployable, so more replicas do not speed up the drain)
7. Verify: outbox_unprocessed_count and outbox_oldest_age_seconds fall within 10 minutes.
8. If the drain stalls past 10 minutes, escalate to the architect on call.
```

> Never set `processed_at` by hand or delete unprocessed rows to clear a backlog: those events would be lost. If one row is always rejected, fix its cause (for example, a message-size limit or a topic ACL) so the next poll delivers it. A restart can re-send rows whose processed update had not completed; consumers dedupe them. (Here the column is `published_at`.)

### RB-02: Replay DLQ

```text
1. Read the DLQ record headers (original topic, partition, offset) and the exception class with the Kafka tooling;
   never copy the payload into a ticket (it can hold contact data).
2. Fix the cause (deploy the fix, or correct reference data).
3. Stop the consumer group: kubectl scale deployment/<deployable> -n <ns> --replicas=0
4. Reset the group's offset on the source topic to the original offset:
   kafka-consumer-groups --bootstrap-server <brokers> --group <group> --topic <topic>:<partition> --reset-offsets --to-offset <offset> --execute
5. Scale back up; the inbox or delivery-log dedup skips every record already applied.
6. Verify the record was applied (refund status, payout row, or message row) and that no new DLQ record appeared.
```

### RB-03: Rotate database secret

```text
1. Create the new password for <deployable>_app (and _worker) in PostgreSQL alongside the old one's role grant.
2. Write it to the secrets manager path of <deployable>; the pods read mounted secrets at start.
3. kubectl rollout restart deployment/<deployable> -n <ns>; watch readiness.
4. Revoke the old password once all pods are ready. Provider and Kafka credentials follow the same steps (SDD §20.1.4).
```

### RB-04: RefundPaid publication stuck or take-back late

```text
1. Grafana panel event_publication_oldest_age_seconds; logs: grep '"event":"event_publication.dispatch_failed"' for the exception class.
2. Database cause (lock, constraint): fix, then wait one replay tick (1 minute); the row completes.
3. Data cause (purchase reference mismatch, R-03): record the refundRequestId, escalate to the LOYALTY owner; do not edit movements by hand.
4. Verify loyalty_takeback_lag_seconds returns under 3600 and the incomplete count reaches 0.
```

### RB-05: Payout failed, held, or overdue

```text
1. RefundPayoutOverdue: find the flagged requests in the branch payout-failing list or by refundRequestId in the logs;
   check payout-service for a payout row (none -> check the payout-service DLQ, RB-02).
2. PayoutHeld: CardPay status unreadable; ask CardPay support for the status of payout id <payoutId> before any action.
3. PayoutFailed: the request stays APPROVED and flagged; the next step is NEEDS CLARIFICATION in SDD §17.2 (manual retry,
   other route, or closing) - escalate to the REFUNDS owner; never create a second payout by hand (REFUNDS/NFR-01).
```

### RB-06: Purchase import stale or rejecting

```text
1. Stale: logs of refunds-platform-core, grep '"event":"purchase_import.run' for the failure; check the posPurchases circuit and credentials.
2. After the fix, the next hourly run resumes from the cursor; no manual cursor change.
3. Rejections: query loyalty.purchase_import_rejection for the last run (reason codes only); report till returns and voids to the LOYALTY owner.
```

### RB-07: Provider or shared-dependency outage

```text
CardPay, MsgHub, or POS Records down: circuits open; payouts and messages wait and retry by themselves; receipt lookups
answer 503 RECEIPT_LOOKUP_UNAVAILABLE. Escalate to the provider (list in SDD §20.3, NEEDS CLARIFICATION there).
Kafka or schema registry: SDD §20.1.7. Keycloak: SDD §20.1.8.
```

## 13.9 On-Call

- **Rota:** not assigned yet ([SDD §20.3](../sdd-refunds-platform/16-operations-runbook.md#203-on-call) rotation policy NEEDS CLARIFICATION).
- **Escalation policy:** architect on call, then the provider contacts of SDD §20.3 (NEEDS CLARIFICATION there).
- **Communication channel:** `#incidents-refunds-platform` in the team's chat tool.

> TODO: on-call rota, escalation path, paging policy, and the chat tool are NEEDS CLARIFICATION in SDD §20.3 - verify with operations before go-live (CLAUDE.md new-service checklist: runbook and on-call assignment).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 09-cross-cutting.md | NEXT: 11-security.md -->
