<!--
CHUNK: 09
TITLE: Cross-Cutting Concerns
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 12. Cross-Cutting Concerns

> **Convention:** these are platform-wide rules. Per-service overrides live in `04-implementation/<service>.md`. The defaults are owned by [SDD §11](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default); this chunk is their implementation in the shared platform library (LA-03), package `<base>.platform`.

## 12.1 Authentication & Tenant Resolution

| Concern | Choice | Source |
|---------|--------|--------|
| Token issuer | Keycloak, one realm for all tenants; realm name per environment (10 § 13.1) | ADR-07 |
| Token type | JWT (Bearer); OIDC authorization code with PKCE in the web app | ADR-07 |
| Validation point | API gateway **and** each deployable (Spring Security resource server: signature, issuer, expiry) | ADR-07 (overrides the CLAUDE.md gateway-only default) |
| Role to permission | `JwtPermissionConverter` maps realm roles to the permission tokens of the module's `PermissionMap` (configuration versioned with the code) | ADR-08, SDD §16.12.1 |
| Internal service-to-service auth | None: there is no service-to-service HTTP (ADR-05); Kafka clients authenticate per deployable with ACLs on their own topics and groups | SDD §11.6 |
| Outbound provider auth | Per-tenant provider credentials from the secrets manager, selected by the adapter from the tenant | SDD §11.2, §15.1 |
| Tenant ID source | Users: `tenant_id` claim; partners: partner key in the path (ADR-11); events: envelope `tenant_id`; jobs: tenant registry | SDD §11.2 |
| Tenant ID propagation | No internal HTTP; the envelope carries it on Kafka; provider calls identify the tenant by its credential | SDD §11.2 |
| Logging policy | `tenant_ref` on every line; `tenant_id`, `customer_id`, `member_id`, contact details, and payment references never at INFO | SDD §11.4; CLAUDE.md |

**Shared components:**

| Component | Responsibility |
|-----------|----------------|
| `CallerContextResolver` | Builds `CallerContext` from the verified JWT once per request (tenant, subject, `branch_id`, `member_id` as member number, permission tokens) |
| `TenantContext` | Holds the tenant for the current request, listener record, or job iteration; sets MDC `tenant_ref`, `correlation_id` |
| `TenantRegistry` / `TenantSettingsPort` | Active tenants and their settings (IANA zone, default locale, `tenant_ref`, partner keys) from mounted configuration (LA-01) |
| `PartnerKeyResolver` | Partner key plus provider to `tenant_id` (ADR-11); unknown key is a security event |
| `PermissionMap` | Realm role to permission tokens per module (11 § 14.4) |

**API gateway requirements** (product open, SDD §6):

| Route | Requirement |
|-------|-------------|
| User route (web app) | Validate the JWT and a known `tenant_id`; per-user rate limit; 10 receipt lookups per customer per rolling hour on `GET /v1/receipts/*` (SDD §17.1, 429 `RATE_LIMITED`); request logging; CORS for the web app origin only (SDD §11.6) |
| Partner route (ADR-11) | Separate partner hostname; no JWT; per-provider IP allowlist and mutual TLS where supported; rate limit; request logging; forwards `/v1/partners/{partnerKey}/...` unchanged |

> TODO: not derivable from inputs - user-route rate limits other than the receipt lookup, and the partner allowlists, depend on the gateway product and the providers (SDD §6, ADR-11 `TBD - EXTERNAL`) - please specify.

## 12.2 Idempotency

The rules (record columns, key scope, replay, 409 answers, 24-hour expiry, delete on 5xx) are owned by [SDD §11.1 Idempotency records](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default); implementation:

| Concern | Choice |
|---------|--------|
| Header | `Idempotency-Key`, a UUID (SDD §15.1 standard headers); missing or malformed -> 400 `VALIDATION_FAILED` |
| Required on | `POST /v1/refund-requests`, `.../cancellation`, `.../decision` (SDD §17.1); outbound: CardPay (payout id), MsgHub (send-log row id) |
| Dedup tuple | (`tenant_id`, `subject`, `operation`, `idempotency_key`), `operation` = method plus route template, for example `POST /v1/refund-requests/{refundId}/decision` |
| Request hash | SHA-256 over the canonical JSON body (sorted keys, no insignificant whitespace) plus the resolved path variables |
| TTL | 24 hours (SDD §11.1); hourly purge job per tenant |
| Storage | `idempotency_record` in schema `refund` (05 § 8.2) |
| Conflict response | 409 `CONFLICT` (different hash), 409 `REQUEST_IN_PROGRESS` with `Retry-After: 1` (IN_PROGRESS) |
| In-flight handling | The server answers at once; the web app retries after `Retry-After` without showing an error (SDD §17.1) |

**Flow (`IdempotencyInterceptor` on handlers annotated `@IdempotentOperation`):**

```text
preHandle:
  1. key = header Idempotency-Key -> missing or not a UUID -> 400 VALIDATION_FAILED
  2. scope = (tenant, subject, operation, key); hash = sha256(canonical body + path variables)
  3. decision = idempotencyService.begin(scope, hash)                          (REQUIRES_NEW)
       INSERT ... status = IN_PROGRESS, expires_at = now + 24h ON CONFLICT DO NOTHING
       inserted                      -> PROCEED (scope stored as a request attribute)
       existing and expired          -> delete it and insert again -> PROCEED
       existing, different hash      -> 409 CONFLICT
       existing IN_PROGRESS          -> 409 REQUEST_IN_PROGRESS, Retry-After: 1
       existing COMPLETED, same hash -> write the stored status and body; the handler is not invoked
handler:  the application service calls idempotencyService.complete(scope, status, body) as its last statement,
          inside its own transaction (MANDATORY), so the record commits with the command (SDD §11.1)
afterCompletion (exception thrown):
  5xx -> idempotencyService.abandon(scope)            (REQUIRES_NEW: delete, the client may retry, SDD §11.1)
  4xx -> idempotencyService.recordError(scope, status, problem)   (REQUIRES_NEW: COMPLETED with the Problem body)
```

> Confirm: 4xx outcomes are stored as COMPLETED and replayed for the same key and body; SDD §11.1 states only the 5xx rule, and without this an IN_PROGRESS row would block the key for 24 hours after any business error - verify with the architect.

**Consumer idempotency (`InboxGuard`):** the first statement of every listener transaction is `INSERT INTO inbox_event (tenant_id, consumer, event_id, event_type, aggregate_id, processed_at) ... ON CONFLICT DO NOTHING`; zero rows inserted means a duplicate and the listener returns without effect. `consumer` is the consumer group name (`refund-service`, `payout-service`, `notification-service`, `loyalty-service`).

```text
listener(record):
  envelope = deserialize(record)                     (failure -> DLQ, not retried)
  if envelope.event_type not handled -> return       (no inbox row)
  TenantContext.set(envelope.tenant_id); MDC tenant_ref, correlation_id; continue the trace from record headers
  transaction REQUIRED:
     if not inbox.firstDelivery(tenant, consumer, envelope.event_id) -> return
     handler.apply(envelope)                         (domain change and any outbox rows, same transaction)
  offset committed by the container after the transaction commits
```

## 12.3 Resilience (downstream calls)

> **Library:** Resilience4j (CLAUDE.md default; SDD §15.1). One named instance per provider and channel. Values the SDD pins are marked; the rest are LLD proposals.

| Instance | Timeout | Retry (in-call) | Circuit breaker | Bulkhead | Source |
|----------|---------|-----------------|-----------------|----------|--------|
| `posRecords` (API-01) | 3 s | Up to 2 retries on idempotent failures (timeouts, 5xx, not 404), exponential from 200 ms with jitter | 50% failures over 20 calls, 30 s open | 20 concurrent | Retries: SDD §12 INT-03; rest proposed |
| `cardPay` (API-02) | 10 s | None in-call: retries are the persisted ADR-10 schedule (08 § 11.3) | 50% failures over 20 calls, 60 s open | 10 concurrent | Schedule: ADR-10; rest proposed |
| `msgHubEmail`, `msgHubSms` (API-04) | 5 s | None in-call: persisted message backoff (notification `next_attempt_at`) | 50% failures over 20 calls, 60 s open, per channel | 10 concurrent per channel | Bulkhead per channel: SDD §12 INT-02; rest proposed |
| `keycloakAdmin` (API-05) | 3 s | Up to 2 retries on idempotent failures, exponential from 200 ms with jitter | 50% failures over 20 calls, 30 s open | 10 concurrent | Retries: SDD §12 INT-04; rest proposed |

> TODO: best-guess timeouts, circuit-breaker thresholds, bulkhead sizes, and the notification message backoff (1 min base, 30 min cap, 6 attempts) - SDD §12 INT-01 to INT-04 leave them open - verify with the providers' documented limits and replace.

> **Convention:** retries on idempotent calls only. Non-idempotent calls (without an idempotency key) must not be retried automatically; CardPay and MsgHub calls carry a key and are retried only through the persisted schedules.

## 12.4 Outbox Pattern (mandatory for state-changing events)

The rule is owned by [SDD §11.3 Health and relays](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default) and [SDD §14.6](../sdd-refunds-platform/10-events-hub.md#146-cross-cutting-event-guarantees); implementation:

- **Table:** `outbox_event` in schema `refund` and database `payout` (05 § 8.2); loyalty-service and notification-service publish nothing and have none.
- **Writer:** `OutboxWriter.append`, `MANDATORY` propagation, inside the aggregate's transaction; `seq` gives insertion order.
- **Publisher:** `OutboxRelay`, a background loop on every replica that publishes only while it holds a PostgreSQL session advisory lock on a dedicated connection; losing the connection releases the lock and another replica takes over.
- **Order:** rows are read per tenant in `seq` order and sent one by one, waiting for each broker acknowledgement, so per-aggregate order holds (SDD §14.6 item 3). Rows are deleted only after acknowledgement; a crash between send and delete re-publishes the same `event_id`, which consumers dedup.
- **Cadence:** poll every 500 ms, batch up to 100 rows per tenant (10 § 13.1).
- **Monitoring:** `outbox_backlog_rows` and `outbox_oldest_age_seconds` per publisher; alert on age (10 § 13.7).

```text
OutboxRelay.run():                                                 (every OUTBOX_POLL_INTERVAL_MS)
  if not lockHeld: lockHeld = select pg_try_advisory_lock(RELAY_LOCK_KEY) on the relay connection
  if not lockHeld: return
  for tenant in tenantRegistry.activeTenants():
     rows = SELECT * FROM outbox_event WHERE tenant_id = :t ORDER BY seq LIMIT :batch
     sent = []
     for row in rows:
        try kafka.send(row.topic, key = row.aggregate_id, value = envelopeJson(row),
                       headers = { traceparent: row.traceparent, event_type: row.event_type }).get(sendTimeout)
            sent.add(row.id)
        catch -> break                                             (keep order; retry at the next poll)
     DELETE FROM outbox_event WHERE tenant_id = :t AND id IN (:sent)
  gauges: backlog rows and oldest age per tenant_ref
```

> Confirm: per-tenant polling, synchronous sends, and delete-after-acknowledge are LLD choices that implement the SDD's single active relay; verify throughput stays adequate at the seasonal peak (SDD §18.3).

## 12.5 Saga Pattern (cross-service transactions)

- **Default style:** choreography (CLAUDE.md; ADR-05). No orchestrator exists in this platform.
- **When to use orchestration:** not used; a future flow with branching across more than three services would need an ADR.
- **Compensation:** SAGA-01 moves money only once (the payout), so no step is rolled back; failures are surfaced (the request stays APPROVED, `REFUND_PAYOUT_FAILED` tells the branch's managers) and resolved by the manual procedure RB-04 (10 § 13.8).
- **Failure handling:** every step is idempotent (inbox plus a unique business key); an event that cannot be applied goes to the consumer's DLQ with an alarm.

### SAGA-01: Refund payout and points take-back

**Participating services:** refund-service, payout-service, loyalty-service; notification-service reacts to its facts. System view: [SDD §8.5.2](../sdd-refunds-platform/05-workflows-and-sequences.md#852-sequence-refund-decision-and-payout) (not redrawn here).

| Step | Service | Action | Compensating action | Idempotency |
|------|---------|--------|---------------------|-------------|
| 1 | refund-service | Decision: APPROVED, outbox `REFUND_APPROVED` | None (a decision is final; no cancel after decision, UC-03 BR-1) | `Idempotency-Key` on the decision; optimistic lock |
| 2 | payout-service | Create the payout (PENDING) | None | Inbox; UNIQUE (`tenant_id`, `refund_id`) |
| 3 | payout-service | Attempts inside the ADR-10 window; `PAYOUT_SUCCEEDED` or `PAYOUT_FAILED` | None: failure is reported, money is never reversed | CardPay key = payout id; lease; result dedup |
| 4 | refund-service | PAID and `REFUND_PAID`, or payout FAILED and `REFUND_PAYOUT_FAILED` | None | Inbox; status rules; `last_payout_event_version` |
| 5 | loyalty-service | TAKEN_BACK movement, or parked or closed take-back | None (a take-back stays matchable) | Inbox; UNIQUE `refund_id` |
| side effect | notification-service | Messages for steps 1, 4 | None | Inbox; unique send-log key |

**Compensation triggers:** none automatic. The ADR-10 window closing is the only failure outcome; it is resolved manually (RB-04) or by a late CardPay confirmation, which the machines of 08 § 11.1 already accept.

## 12.6 Error Model (RFC 9457 Problem Details)

The codes are owned by [SDD §15.1 Standard error codes](../sdd-refunds-platform/11-api-contracts.md#151-contract-conventions-platform-defaults) and the per-service Error Handling sections; the envelope:

| Field | Type | Notes |
|-------|------|-------|
| `type` | string (URI) | `{problemBase}/<errorCode in kebab case>`, for example `{problemBase}/refund-window-passed` |
| `title` | string | Short English summary per `errorCode`, locale-neutral |
| `status` | int | HTTP status code |
| `detail` | string | Plain language: what went wrong and what to do next (SDD §11.6, REFUNDS 11); English; the web app shows its own localised text keyed by `errorCode` |
| `instance` | string | Request path |
| `errorCode` (extension) | string | The SDD code verbatim, for example `REFUND_WINDOW_PASSED` (SDD §15.1 names the extension `errorCode`, not the template's `code`) |
| `traceId` (extension) | string | OpenTelemetry trace ID |
| `errors` (extension) | array | `VALIDATION_FAILED` only: `field`, `code`, `message` per field (SDD §15.1 `errors[]`) |

**Base exception:** `ServiceException` (abstract, CLAUDE.md), with `errorCode()` and `httpStatus()`. Every business exception extends it.

**Global handler:** `ProblemDetailsAdvice` (`@RestControllerAdvice`) maps `ServiceException`, Bean Validation errors (400 `VALIDATION_FAILED`), access denied (403 `FORBIDDEN`), authentication failures (401 `UNAUTHENTICATED`), and anything else (500 `INTERNAL_ERROR`, generic detail, no stack trace or internal code, CLAUDE.md). Media type `application/problem+json`.

> TODO: not derivable from inputs - the `problemBase` URI (a stable, dereferenceable host for problem types) is not in the SDD - please specify; until then `type` values are relative to a configurable base (`PROBLEM_BASE_URI`, 10 § 13.1).

## 12.7 Logging

| Concern | Choice |
|---------|--------|
| Format | JSON to stdout, Spring Boot structured logging with MDC fields (SDD §11.4) |
| Mandatory fields | `ts`, `level`, `service`, `module`, `trace_id`, `span_id`, `correlation_id`, `tenant_ref`, `event` (SDD §11.4), plus the per-service ids of SDD §17.x (for example `refund_id`, `payout_id`) |
| Level for tenant context | `tenant_ref` at every level; `tenant_id` never at INFO or above (CLAUDE.md, SDD §11.4) |
| Never logged | Contact details, `original_payment_ref`, `provider_payout_ref`, `customer_id`, `member_number`, free-text reasons, event payloads, request bodies |
| Aggregation | Log store open (SDD §6) |
| Hot retention | Open (SDD §6) |
| Cold retention | Open (SDD §6) |

> Confirm: Spring Boot's built-in structured logging (JSON with MDC) is proposed instead of a logging library, to avoid a new dependency; verify it meets the log store's format once chosen.

## 12.8 Tracing

- **Library:** OpenTelemetry SDK and instrumentation for Spring Boot HTTP server and client, JDBC, and Kafka (SDD §17.x Tracing).
- **Backend:** open (SDD §6).
- **Sampling:** open (SDD §11.4); parent-based, so a sampled web request keeps its sampled spans across Kafka hops.
- **Context propagation:** W3C Trace Context over HTTP and Kafka record headers; the outbox stores `traceparent` at write time and the relay puts it on the record, so a consumer span continues the producer's trace (SDD §17.1 Tracing).

## 12.9 Configuration

- **Source order:** environment variables and mounted files from the Helm values (SDD §11.5), over profile properties, over defaults. No hot reload: a change is a rolling restart (SDD §11.5).
- **Secrets:** delivered at runtime from the secrets manager (product open, SDD §6), mounted as files; never in images, Git, logs, or error responses.
- **Tenant registry:** mounted configuration listing each tenant's id, `tenant_ref`, IANA zone, default locale, partner keys per provider, and secret references for provider credentials and partner verification secrets (LA-01).
- **Feature flags:** none in this release (SDD §11.5).

## 12.10 Health & Readiness

- **Liveness:** `/actuator/health/liveness`, in-process only (no database, no broker).
- **Readiness:** `/actuator/health/readiness`, **database only** (SDD §11.3). Kafka, the relays, the consumers, and providers never gate readiness; they report through consumer lag, outbox backlog age, DLQ depth, and circuit-breaker metrics (10 § 13.7). This overrides the template default of checking Kafka in readiness.

<!-- MASTER: lld-master.md | PREV: 08-state-and-rules.md | NEXT: 10-operations.md -->
