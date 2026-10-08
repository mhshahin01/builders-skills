<!--
CHUNK: 10
TITLE: Operations
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 09
PART OF: LLD - [Project Name]
-->

# 13. Operations

## 13.1 Configuration (per service)

| Service | Variable | Type | Default | Notes | Source |
|---------|----------|------|---------|-------|--------|
| `[service-a]` | `DB_URL` | string | (none) | JDBC URL | [SDD §19 Environments] |
| `[service-a]` | `DB_USER` | string | (none) | DB username | [SDD §19 Environments] |
| `[service-a]` | `DB_PASSWORD` | secret | (none) | From [Vault path] | [SDD §19 Environments] |
| `[service-a]` | `KAFKA_BROKERS` | csv | (none) | Bootstrap servers | [SDD §19 Environments] |
| `[service-a]` | `KEYCLOAK_ISSUER_URI` | string | (none) | Token issuer | [SDD §19 Environments] |
| `[service-a]` | `OUTBOX_POLL_INTERVAL_MS` | int | 1000 | Outbox publisher cadence | LLD (`09-cross-cutting.md` § 12.4) |
| `[service-a]` | `OUTBOX_BATCH_SIZE` | int | 100 | Outbox publisher batch | LLD (`09-cross-cutting.md` § 12.4) |
| `[service-a]` | `OUTBOX_SEND_TIMEOUT_MS` | int | 10000 | Max wait for the target's acknowledgement; on timeout the row stays unprocessed | LLD (`09-cross-cutting.md` § 12.4) |

> **Source:** each Default restates the SDD value it comes from (SDD §19 Environments, or the `13x` section that sets it) and links it; `LLD` marks a variable or default the LLD adds. A default that differs from the SDD is drift to flag (`sdd-to-lld.md` § One fact, one home, rule 3).

## 13.2 Health & Readiness

> See `09-cross-cutting.md` § 12.10. Per-service additions:

| Service | Liveness checks | Readiness checks |
|---------|-----------------|------------------|
| `[service-a]` | App responds | DB pool healthy, Kafka producer ready, Flyway migrations complete |

## 13.3 Metrics (RED: Rate, Errors, Duration)

> **Default per service:**

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_server_requests_seconds` | histogram | `method`, `uri`, `status`, `service` | Request rate, latency, error rate |
| `kafka_consumer_records_consumed_total` | counter | `topic`, `group`, `service` | Consumption throughput |
| `kafka_consumer_lag` | gauge | `topic`, `group`, `partition` | Consumer lag |
| `outbox_unprocessed_count` | gauge | `service` | Outbox backlog |
| `outbox_oldest_age_seconds` | gauge | `service` | Outbox liveness |
| `db_pool_active` | gauge | `service`, `pool` | DB pool saturation |

> **Per-service custom metrics** (from each service's SDD `13x` Observability) are added to this table, one row per metric with its `service` label.

## 13.4 Logs

> See `09-cross-cutting.md` § 12.7 for the platform-wide log format. Per-service log volume estimates:

| Service | Estimated lines/day | Hot retention | Cold retention |
|---------|---------------------|---------------|----------------|
| `[service-a]` | [estimate] | 30 days | 1 year |

> **Triage by use case:** filter logs on `use_case` matching the whole token `(^|,)[KEY]/UC-NN(,|$)` to see every request of one use case (equality misses entry points shared by several use cases; `09-cross-cutting.md` § 12.8); the use case's row in `16-references.md` § 19.9 leads to its workflow, BRD use case, and test cases.

## 13.5 Tracing

> See `09-cross-cutting.md` § 12.8. Per-service span naming convention:

- Controller spans: `<HTTP method> <route>` (e.g. `POST /v1/foo`).
- Service spans: `<class>.<method>` (e.g. `FooServiceImpl.create`).
- Repository spans: `<repo>.<method>` (e.g. `FooRepository.save`).
- Outbox publisher spans: `OutboxPublisher.poll`.
- Entry-point spans (controller, listener, scheduled job) of a BRD use case carry `use_case` (§ 12.8), so a trace search by use case finds every request of it.

## 13.6 Dashboards

| Dashboard | Tool | Audience | URL |
|-----------|------|----------|-----|
| `[Project] - Service Health` | [Grafana] | All | [URL] |
| `[Project] - Outbox & Saga` | [Grafana] | SRE | [URL] |
| `[Project] - Tenant View` | [Grafana] | Customer Success | [URL] |

<!-- While the dashboard URLs are unknown, write: > TODO: dashboard URLs - verify -->

## 13.7 Alerts

| Alert | Threshold | Severity | Action | Source |
|-------|-----------|----------|--------|--------|
| `OutboxBacklog` | `outbox_unprocessed_count > 1000 for 5m` OR `outbox_oldest_age_seconds > 30 for 5m` | Page | See runbook §[X] | LLD (`09-cross-cutting.md` § 12.4) |
| `DLQ rows` | `kafka_messages_in_total{topic=~".+\\.dlq"} > 10 in 1h` | Page | See runbook §[X] | [SDD §11.4 Alerting] |
| `DB pool saturation` | `db_pool_active / db_pool_max > 0.9 for 5m` | Warn | Investigate query lockups | LLD |
| `5xx rate` | `rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.01` | Page | See runbook §[X] | [SDD §11.4 Alerting] |
| `p99 latency SLO` | per-service target from `12-performance.md` § SLOs | Warn | Investigate slow path | [SDD §11.4 Alerting] |

> **Source:** each alert the SDD raises links the place that raises it (SDD §11.4 Alerting, or the §12 integration row, §15 error row, or `13x` section that raises it); its Threshold is the metric and threshold that implement the SDD condition, and its Action links the SDD §20 procedure it triggers, or is a `> TODO:` when §20 has none. `LLD` marks an alert the LLD adds. An alert that differs from its SDD condition is drift to flag (`sdd-to-lld.md` § One fact, one home, rule 3).

## 13.8 Runbook Procedures

> **Convention:** every paging alert maps to a runbook procedure here. Procedures are step-by-step, copy-pasteable, and assume the on-call has not worked on this service before.

### RB-01: Drain outbox backlog

```text
1. Confirm backlog exists:
   curl -sS https://[grafana]/api/datasources/proxy/.../api/v1/query?query=outbox_unprocessed_count
2. Identify the service:
   kubectl get pods -n prod -l app=[service-a]
3. Check Kafka producer health:
   kubectl logs <pod> -n prod | grep "KafkaProducer"
4. If Kafka is healthy, restart the service (the publisher runs as one active instance, so adding replicas does not speed up the drain):
   kubectl rollout restart deployment/[service-a] -n prod
5. Verify drain progresses:
   watch -n 5 'kubectl exec ... -- curl -sS localhost:8080/actuator/metrics/outbox.unprocessed'
6. If drain stalls, escalate to architect on-call. See #incidents-[project].
```

> Never set `processed_at` by hand or delete unprocessed rows to clear a backlog: those events would be lost. If one row is always rejected, fix its cause (for example, a message-size limit or a topic ACL) so the next poll delivers it. A restart can re-send rows whose processed update had not completed; consumers dedupe them.

### RB-02: Replay DLQ

```text
[Step-by-step DLQ replay procedure]
```

### RB-03: Rotate database secret

```text
[Step-by-step rotation procedure]
```

## 13.9 On-Call

- **Rota:** [link to PagerDuty schedule].
- **Escalation policy:** [link].
- **Communication channel:** `#incidents-[project]` in [Slack / Teams].

<!-- MASTER: [project-slug]-lld-master.md | PREV: 09-cross-cutting.md | NEXT: 11-security.md -->
