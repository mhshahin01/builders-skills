<!--
CHUNK: 09
TITLE: Cross-Cutting Concerns
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 12. Cross-Cutting Concerns

> **Convention:** these are platform-wide rules. Per-service overrides live in `04-implementation/<service>.md`. If a service deviates from a default here, it must justify the override in its own file and link back to this section.

The SDD defaults are [SDD §11](../sdd-refunds-platform/07-cross-cutting-concerns.md#11-cross-cutting-concerns-summarized) and the [SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) ecosystem rules; this chunk gives their concrete configuration. The shared code lives in `refunds-platform-commons` (01 § 3, A-01).

## 12.1 Authentication & Tenant Resolution

| Concern | Choice | Source |
|---------|--------|--------|
| Token issuer | Keycloak, one realm for every tenant, OIDC authorization code with PKCE for the web app | SDD §6 IAM / AuthN row; ADR-07 |
| Token type | JWT (Bearer) | Standard |
| Validation point | The API gateway (issuer, signature, audience, expiry, `tenant_id` present and equal to the host's tenant) and again in `refunds-platform-core` (Spring Security OAuth2 resource server, JWKS from the realm) | [SDD §16.2](../sdd-refunds-platform/12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action); ADR-07 |
| Internal service-to-service auth | None over HTTP: no deployable calls another (ADR-05). Kafka clients authenticate per deployable over TLS and topic ACLs limit writers and readers; in-process calls need none (SDD §15 has no port contract) | [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) |
| Tenant ID source | `tenant_id` JWT claim (web calls); envelope `tenant_id` (Kafka consumers); `RefundPaidEvent.tenantId` (in process) | [SDD §11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default) |
| Tenant ID propagation | `TenantContext` (thread-bound) plus `app.tenant_id` per transaction for RLS (05 § 8.4); written into every outbox envelope; no downstream HTTP call carries it (external calls select per-tenant credentials, SDD §15.1) | SDD §11.2, §15.1 |
| Caller context | `CallerContextResolver` builds `CallerContext` from the validated JWT: `sub`, realm roles, permission tokens (`RolePermissionMapper`), `branch_id`, `member_id`, `email`, `phone_number` | SDD §16.2; SDD §3 assumptions 2 to 4 |
| Logging policy | `tenant_id` never logged at INFO; never log PII at INFO; `tenant_ref` on every line (§ 12.7) | CLAUDE.md hard rule; SDD §11.4 |
| Receipt-lookup rate limit | At the gateway: per user, proposed 10 a minute and 50 a day on `GET /v1/receipts/{receiptNumber}/refundable-items`, 429 `RATE_LIMITED` | SDD §6 API Gateway row |

> Confirm: Spring Cloud Gateway's built-in request rate limiter keeps its counters in Redis, which SDD §6 does not provide (Caching: Not applicable); a per-user limit shared across gateway replicas needs either a Redis instance, a new dependency such as Bucket4j with a shared store, or per-replica counters that loosen the limit by the replica count - decide with the platform team (the gateway is outside this LLD's implementation files, 01 § 2.2).

## 12.2 Idempotency

| Concern | Choice |
|---------|--------|
| Header | `Idempotency-Key`, UUID format ([SDD §15.1](../sdd-refunds-platform/11-api-contracts.md#151-contract-conventions-platform-defaults) standard headers) |
| Required on | The three POST endpoints of refund-service (submit, cancellation, decision): all touch notifications and, for the decision, money ([SDD §17.1 API Standards](../sdd-refunds-platform/13a-service-refund.md#api-standards)); loyalty-service has no write endpoint |
| Dedup tuple | `(tenant_id, caller_subject, idempotency_key)`: scoped per caller, so two users cannot collide or read each other's cached response |
| TTL | 24 hours (`expires_at`; cleanup job hourly) |
| Storage | `refund.idempotency_record` via commons `JpaIdempotencyStore` (05 § 8.2), written in the business transaction |
| Conflict response | Same key with a different request hash: 409 `CONFLICT` + RFC 9457 (`type: .../idempotency/key-reused`) |
| In-flight handling | No in-flight state: two concurrent requests with one key both run; the second commit hits the primary key, rolls back, and replays the first response |
| Consumers | Inbox `(tenant_id, consumer, event_id)` in refund-service and payout-service; the unique delivery log in notification-service; the handled-refund record in loyalty-service ([SDD §14.6](../sdd-refunds-platform/10-events-hub.md#146-cross-cutting-event-guarantees)) |
| Provider calls | The payout id (API-02) and the message id (API-03) are the provider idempotency keys on every attempt |

> Confirm: the per-caller scope, the 24-hour TTL, and the no-in-flight-state design of the idempotency store are this LLD's answer to the item the SDD reviewer left for the LLD ([SDD chunk 18 Reviewer Notes](../sdd-refunds-platform/18-open-items-and-clarifications.md#reviewer-notes)); verify with the team.

## 12.3 Resilience (downstream calls)

> **Library:** Resilience4j (CLAUDE.md default). **Scope:** HTTP and broker calls; in-process port calls (06 § 9.6) take no timeout, retry, circuit breaker, or bulkhead.

| Instance (caller) | Timeout | Retry | Circuit breaker | Bulkhead |
|-------------------|---------|-------|-----------------|----------|
| `posRecords` (refund-service, API-01) | 3 s | 2 retries (3 attempts), 200 ms base, x2, jitter, idempotent read only | 50% failure over 20 calls, 30 s open | 10 concurrent |
| `posPurchases` (loyalty-service, API-04) | 30 s | 2 retries, 1 s base, x2, jitter | 50% over 10 calls, 5 min open | 2 concurrent |
| `cardPay` (payout-service, API-02 send) | 10 s | None in-call; persisted `RETRY_SCHEDULED` schedule (08 § 11.3) within the SDD §17.2 retry window | 50% over 20 calls, 60 s open | 5 concurrent |
| `cardPayStatus` (payout-service, API-02 status query) | 5 s | 2 retries, 500 ms base, x2, jitter | 50% over 20 calls, 60 s open | 5 concurrent |
| `msgHub` (notification-service, API-03) | 5 s | None in-call; persisted schedule, 30 s base, x2, max 30 min, jitter, `MESSAGE_MAX_ATTEMPTS` = 8 | 50% over 20 calls, 60 s open | 10 concurrent |
| Kafka producer (all relays) | `OUTBOX_SEND_TIMEOUT_MS` = 10 s | The next relay poll | - | - |
| Kafka consumers (all groups) | - | 3 attempts, 1 s, 2 s, 4 s, then the DLQ (07 § 10.4) | - | - |

> **Convention:** retries on idempotent calls only. Non-idempotent calls (without an idempotency key) must not be retried automatically.

> TODO: every timeout, retry count, delay, attempt limit, and breaker threshold above is a best guess; the timeouts per provider, the payout retry delays, the message attempt limit, and the receipt-lookup retries are NEEDS CLARIFICATION in [SDD §12](../sdd-refunds-platform/08-integrations.md#12-integrations), and the provider rate limits are `TBD - external` - verify with each provider's documentation.

## 12.4 Outbox Pattern (mandatory for state-changing integration events)

- **Scope:** integration events on the broker (07 § 10.1-10.5). The in-process domain events of 07 § 10.6 are published in process at their transaction phase and use no outbox.
- **Table:** `outbox_event` in the producer's schema (`refund`, `payout`; see `05-data-model.md`), columns per SDD §17.1 / §17.2 (`published_at` is the SDD's name for the processed mark).
- **Writer:** inserts the outbox row in the same local transaction as the aggregate write, so both commit or neither does. The write path never sends to Kafka directly, inside the transaction or after commit.
- **Publisher:** `OutboxRelay` (commons), a separate scheduled job with one active instance per deployable (advisory lock `outbox-relay-<schema>`), every `OUTBOX_POLL_INTERVAL_MS` = 1 s, batch `OUTBOX_BATCH_SIZE` = 100, oldest first, running under the worker role. A second concurrent publisher would re-send rows and break per-key order.
- **Processed only after acknowledgement:** the publisher waits up to `OUTBOX_SEND_TIMEOUT_MS` for the broker acknowledgement (`acks=all`) and only then sets `published_at`. A failed or timed-out send leaves `published_at` NULL, so the next poll retries the row; the poll stops at that row to keep per-key order.
- **At-least-once delivery:** if the broker acknowledges but the `published_at` update fails (database error, or a crash before the update), the next poll publishes the row again. A failed or timed-out send may also have reached the broker. The payload, including `event_id`, is fixed when the row is written, and consumer dedup is mandatory (`07-event-contracts.md` § 10.4).
- **Monitoring:** `OutboxBacklog` alert on backlog size and oldest-row age (`10-operations.md` § 13.7).

```text
OutboxRelay.poll():
  if !advisoryLock.tryAcquire("outbox-relay-" + schema): return       (session lock held while this replica is leader)
  rows = outbox.findUnpublishedOldestFirst(OUTBOX_BATCH_SIZE)          (worker role: all tenants)
  for row in rows:
    record = ProducerRecord(row.topic, key = row.messageKey, value = row.payload,
                            headers = { event_type, correlation_id, traceparent from the payload })
    outcome = await kafka.send(record) for OUTBOX_SEND_TIMEOUT_MS      -> ACKED | FAILED | TIMED_OUT
    if outcome != ACKED:
      metrics.outboxSendFailures.increment(outcome); return            (row keeps published_at = NULL)
    outbox.markPublished(row.eventId, now)                             (own short TX; failure -> re-sent next poll)
  gauges: outbox_unprocessed_count, outbox_oldest_age_seconds
```

## 12.5 Saga Pattern (cross-service transactions)

- **Default style:** choreography (each service reacts to events) per CLAUDE.md.
- **When to use orchestration:** flows with >3 steps, conditional branching, or required central visibility. Orchestrator-owning service named in `04-implementation/<orchestrator>.md`.
- **This LLD:** one saga, the refund payout, choreographed between refund-service and payout-service ([refund-service § Pattern: Saga (choreography)](./04-implementation/refund-service.md#pattern-saga-choreography)); no orchestrator, so no 04 file carries an orchestrator saga section. The take-back of points is an in-process reaction inside the core, not a saga.
- **Compensation:** every saga step has a documented compensation action. Compensation actions are themselves idempotent. Here the only automatic "compensation" is the bounded payout retry ending in `PAYOUT_FAILED`; what follows a `FAILED` payout is open (refund-service § 7.4 TODO).
- **Failure handling:** failed compensation triggers an alert; manual intervention via runbook (RB-05, 10 § 13.8).

## 12.6 Error Model (RFC 9457 ProblemDetails)

| Field | Type | Notes |
|-------|------|-------|
| `type` | string (URI) | `{TYPE_BASE}/<context>/<error>`, stable; `TYPE_BASE` = `https://errors.refunds-platform.example` |
| `title` | string | Short summary, localised to the tenant locale |
| `status` | int | HTTP status code |
| `detail` | string | Plain language: what went wrong and what the user can do next ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)) |
| `instance` | string | The path that produced the error |
| `errorCode` (extension) | string | From an SDD: the SDD §15.1 standard code or the contract's domain code, verbatim (`VALIDATION_FAILED`, `REFUND_WINDOW_PASSED`); from code with no SDD: the code the service returns |
| `traceId` (extension) | string | OpenTelemetry trace ID |
| `errors` (extension) | array | For validation failures: list of field-level errors (`field`, `code`, `message`) |

**Base exception:** `ServiceException` (CLAUDE.md). Every business exception extends it and carries an error code.

**Global handler:** `@RestControllerAdvice` translates exceptions to ProblemDetails. `GlobalProblemHandler` (commons) also maps Spring Security's 401 and 403 and never writes a stack trace or an exception message into the body; a 500 carries only the correlation id in `detail`.

> Confirm: `TYPE_BASE` is a placeholder URI under the reserved `.example` domain; SDD §15.1 fixes the `errorCode` values but not the `type` URIs - pick the real base before the first release.

## 12.7 Logging

| Concern | Choice |
|---------|--------|
| Format | JSON (structured), Logback with a JSON encoder |
| Mandatory fields | `timestamp`, `level`, `deployable`, `module`, `trace_id`, `span_id`, `correlation_id`, `tenant_ref`, `event` ([SDD §11.4](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), verbatim) |
| Use-case field | `use_case`: the keyed BRD use case ID(s) of the entry point handling the request (`REFUNDS/UC-04`), from the log MDC (§ 12.8). Absent on platform endpoints. |
| `tenant_ref` | First 12 hex characters of HMAC-SHA256(`tenant_id`, key from the secrets manager) (SDD §11.4), computed once per request or message by `TenantContext` |
| Level for tenant context | DEBUG (never INFO per CLAUDE.md): raw `tenant_id` only at DEBUG |
| Level for `use_case` | Any level, INFO included: a use case ID is not tenant data or PII |
| PII | Never at INFO or above: contact details, member numbers, receipt contents, message bodies (SDD §17.x Logging) |
| Aggregation | The SDD §6 central aggregator (product NEEDS CLARIFICATION there) |
| Hot retention | Per the SDD §6 logging row (NEEDS CLARIFICATION there) |
| Cold retention | Per the SDD §6 logging row |

## 12.8 Tracing

- **Library:** OpenTelemetry through Micrometer Tracing's OpenTelemetry bridge and the OTLP exporter (Spring Boot 3.5 managed), with Spring Kafka observation enabled so `traceparent` travels in Kafka headers ([SDD §17.1 Tracing](../sdd-refunds-platform/13a-service-refund.md#tracing)).
- **Backend:** the SDD §6 tracing backend (NEEDS CLARIFICATION there).
- **Sampling:** 100% in Dev and SIT, 10% probabilistic in UAT and Prod (a forced trace honours an incoming sampled `traceparent`).
- **Context propagation:** W3C Trace Context (`traceparent`, `tracestate` headers); the `RefundPaid` dispatch starts a span linked to the PAID transaction's span (SDD §17.4 Tracing).

> TODO: the sampling rate is NEEDS CLARIFICATION in the [SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) tracing row; 10% in UAT and Prod is a best guess - verify with the platform team.

### Use-case attribute

| Concern | Choice | Source |
|---------|--------|--------|
| Attribute | `use_case` on the server or consumer span of every entry point SDD §7.3 lists for an in-scope use case, and the same key in the log MDC | LLD convention |
| Value | The use case ID as §7.3 writes it, with its BRD key (`REFUNDS/UC-04`). An entry point §7.3 lists under several use cases carries all of them in one string, in §7.3 order, joined by commas without spaces (`REFUNDS/UC-02,REFUNDS/UC-04`) | SDD §7.3 |
| Lookup | Match one use case as a whole comma-delimited token, e.g. regex `(^\|,)REFUNDS/UC-04(,\|$)`; never equality (misses shared entry points) or a substring (`REFUNDS/UC-01` would match `a longer identifier`) | LLD convention |
| Set by | A project annotation, `@UseCase("[KEY]/UC-NN")`, on the controller method, listener, or scheduled method; one aspect puts the value into the SLF4J MDC and onto the current span (OpenTelemetry `Span.current().setAttribute`), and clears the MDC afterwards | LLD convention |
| Not set | Platform endpoints (health, actuator, sign-in) | LLD convention |
| Frontend | `screen` and `use_case` from the active route's data on every error report and RUM span (`14-frontend.md` § 17.3); `use_case` joins the route's `useCases` in the Value form | LLD convention |

**Entry points carrying `@UseCase`** (the 11 SDD §7.3 entry points; none is shared between use cases): refund-service `ReceiptController.lookup` and `RefundRequestController.submit` (`REFUNDS/UC-01`); `RefundRequestController.list` and `.get` (`REFUNDS/UC-02`); `RefundRequestController.cancel` (`REFUNDS/UC-03`); `BranchRefundRequestController.list`, `.get`, and `.decide` (`REFUNDS/UC-04`); loyalty-service `PointsController.balance` (`LOYALTY/UC-01`); `PointsController.movements` and `.movement` (`LOYALTY/UC-02`).

**Entry points without `@UseCase`:** `BranchRefundRequestController.report` (REFUNDS 09 report, no use case); the listeners `PayoutEventListener`, `RefundApprovedListener`, `RefundEventListener`, and `RefundPaidListener`; the jobs `payout-watchdog`, `payout-retry`, `message-retry`, `loyalty-purchase-import`, the outbox relays, and the publication-log replay. They realise parts of REFUNDS/UC-01, REFUNDS/UC-03, REFUNDS/UC-04, and LOYALTY/UC-02, but SDD §7.3 lists only REST entry points, and the LLD never states a mapping its home does not state.

> Confirm: `use_case` is an LLD convention; the SDD does not settle a use case attribute (drop this flag when SDD §11.4 or a 13x Observability section names one).

> Confirm: SDD §7.3 lists no `Event:` or `Schedule:` entry point, so payout, notification, take-back, and watchdog spans carry no `use_case` and a production bug in them is triaged by `refundRequestId` instead; adding `Event: REFUND_APPROVED (payout-service)` and the like to §7.3 would let them carry it (15 § 18.4 OQ-02).

## 12.9 Configuration

- **Source order:** environment variables > Spring profile properties > defaults; one Helm values file per environment is the source of truth ([SDD §11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default)); no hot reload.
- **Secrets:** the SDD §6 secrets manager (product NEEDS CLARIFICATION there), injected at runtime as mounted files - never in env vars committed to git, images, or logs. Provider credentials are per tenant.
- **Feature flags:** none in this release (SDD §11.5); the only runtime switch is `payout.provider.idempotency-key-supported` (payout-service § 7.4 Strategy), a configuration value, not a flag system.
- **Tenant settings:** `TenantSettingsRegistry` (commons) loads the Helm map `tenants.<tenant_id>` = { `zone`, `currency`, `locale`, `earnRate` } at start in the core and notification-service (SDD §11.2).
- **IDs:** `IdGenerator` (commons) produces UUIDv7 (RFC 9562 layout: 48-bit Unix milliseconds, version 7, random tail) without a new dependency; tests replace it with a deterministic sequence.

## 12.10 Health & Readiness

- **Liveness:** `/actuator/health/liveness` - fast in-process check (no DB).
- **Readiness:** `/actuator/health/readiness` - the database connection and completed Flyway migrations only. Kafka, the schema registry, and the providers are watched by alerts, never by readiness ([SDD §11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default)), so a broker outage never takes the portal down; the outbox keeps accepting writes.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 08-state-and-rules.md | NEXT: 10-operations.md -->
