<!--
CHUNK: 09
TITLE: Cross-Cutting Concerns
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 12. Cross-Cutting Concerns

> **Convention:** these are platform-wide rules, implemented once in the `refunds-platform-kernel` library used by all three deployables. The defaults are the SDD's ([§11](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default), [§15.1](../sdd-refunds-platform/11-api-contracts.md#151-contract-conventions-platform-defaults)); this chunk gives their concrete configuration. Per-service overrides live in `04-implementation/<service>.md`.

**Kernel components:** `CallerContext` and `TenantContext`, `JwtCallerContextConverter`, `PermissionMap`, `TenantScopedJdbcRepository`, `TenantDirectory` and `TenantCalendar`, `PartnerKeyResolver`, `IdempotentCommandExecutor` and `IdempotencyRecordRepository`, `OutboxEventWriter` and `OutboxRelay`, `InboxGuard`, `EventEnvelope` and `EnvelopeReader`, `ServiceException` and `ProblemDetailsAdvice`, `UseCase` with `UseCaseHandlerInterceptor` and `UseCaseObservationAspect`, `IdGenerator` (`UuidV7Generator`), `AdvisoryLocks`, `ProviderCredentials`, `HousekeepingJob`.

## 12.1 Authentication & Tenant Resolution

| Concern | Choice | Source |
|---------|--------|--------|
| Token issuer | Keycloak, one realm for all tenants | ADR-07 (on-prem default) |
| Token type | JWT (Bearer); OIDC authorization code with PKCE in the web app | ADR-07 |
| Validation point | API gateway **and** each deployable (Spring Security resource server) | ADR-07 overrides the CLAUDE.md "gateway only" default (defence in depth for money-moving endpoints) |
| Internal service-to-service auth | None needed: no service-to-service HTTP (ADR-05); Kafka clients authenticate per deployable with topic and group ACLs; notification-service uses its own Keycloak client (client credentials) for API-05 | SDD §11.6 |
| Tenant ID source | `tenant_id` claim (users); partner key in our path (API-03, API-06, ADR-11); envelope `tenant_id` (consumers) | SDD §11.2 |
| Tenant ID propagation | Event envelope; per-tenant provider credentials on outbound calls; `X-Tenant-Id` is never trusted from a client | SDD §15.1 |
| Logging policy | `tenant_id`, `customer_id`, `member_id`, contact details, and payment references never at INFO; `tenant_ref` alias on every line | CLAUDE.md hard rule; SDD §11.4 |

**Role to permission.** `JwtCallerContextConverter` (a Spring Security `Converter<Jwt, AbstractAuthenticationToken>`) reads the realm roles (`realm_access.roles`) and maps each to permission tokens through `PermissionMap`, merged from each module's configuration key `refunds-platform.<module>.security.role-permissions` (for example `refunds-platform.refund.security.role-permissions.BRANCH_MANAGER`). The values are exactly the role and token names of [SDD §16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide), seeded per [SDD §16.12](../sdd-refunds-platform/12-centralized-user-roles.md#1612-implementation-seed--reconciliation); a unit test asserts the loaded map against the §16.12.2 per-role counts. The converter also builds `CallerContext` from the `sub`, `tenant_id`, `branch_id`, and `member_id` claims and rejects a token without `tenant_id` (401).

**Tenant context.** `TenantContextFilter` (web), the listener wrapper (consumers), and each scheduler loop set `TenantContext` (a `ThreadLocal`, cleared in `finally`) and put `tenant_ref` (from tenant configuration) into the MDC. `TenantScopedJdbcRepository` refuses a call whose tenant argument differs from `TenantContext`.

## 12.2 Idempotency

| Concern | Choice |
|---------|--------|
| Header | `Idempotency-Key`, a UUID (SDD §15.1) |
| Required on | `POST /v1/refund-requests`, `POST /v1/refund-requests/{refundId}/cancellation`, `POST /v1/refund-requests/{refundId}/decision` (SDD §17.1); outbound: CardPay (payout id) and MsgHub (send-log row id) |
| Dedup tuple | (`tenant_id`, `subject`, `operation`, `idempotency_key`); `operation` = method + route template |
| TTL | 24 hours (`expires_at`), cleaned hourly by `HousekeepingJob` |
| Storage | `idempotency_record` in the module's schema (SDD §11.1) |
| Conflict response | Different request hash: 409 `CONFLICT`; still IN_PROGRESS: 409 `REQUEST_IN_PROGRESS` with `Retry-After: 2` |
| Consumers | Inbox (`tenant_id`, `consumer`, `event_id`) for every consumer group, plus the natural-key indexes named in `07-event-contracts.md` § 10.4 |

**`IdempotentCommandExecutor.execute(ctx, command)`:**

```text
1. requiresNew: inserted = records.tryInsertInProgress(ctx, requestHash, expiresAt = now + 24h)   // ON CONFLICT DO NOTHING
2. if !inserted:
     r = records.find(ctx)
     r.requestHash != ctx.requestHash -> 409 CONFLICT
     r.status == IN_PROGRESS          -> 409 REQUEST_IN_PROGRESS, Retry-After
     r.status == COMPLETED            -> replay r.responseStatus + r.responseBody (+ header Idempotent-Replayed: true)
3. try:
     response = command.run()            // the service completes the record inside its own transaction
     return response
   catch ServiceException e (4xx):
     requiresNew: records.complete(ctx, e.status, problemDetailsOf(e)); rethrow   // replay returns the same problem
   catch any other exception (5xx):
     requiresNew: records.delete(ctx); rethrow                                     // SDD §11.1: the client may retry
```

> Confirm: the `Idempotent-Replayed: true` response header on a replay is an LLD addition that lets the web app and tests tell a replay from a first response.

## 12.3 Resilience (downstream calls)

> **Library:** Resilience4j (CLAUDE.md default), Spring Boot 3 integration; instances configured under `resilience4j.*` in each deployable's `application.yml`.

| Pattern | Default config | Override mechanism |
|---------|----------------|-------------------|
| Timeout | HTTP client connect 2 s, read 5 s (sync calls use client timeouts; Resilience4j `TimeLimiter` is not used on blocking calls) | Per-client `RestClient` settings |
| Retry | 2 retries, exponential backoff 200 ms x2 with randomized wait (jitter), only on idempotent reads | `resilience4j.retry.instances.<name>` |
| Circuit breaker | 50% failure rate over a 20-call sliding window, 30 s open, 3 half-open calls; 4xx business answers (for example POS "not found") are not failures | `resilience4j.circuitbreaker.instances.<name>` |
| Bulkhead | Semaphore bulkhead, 10 concurrent calls per provider instance | `resilience4j.bulkhead.instances.<name>` |

| Instance | Caller | Timeout | Retry | Circuit breaker | Bulkhead | Source |
|----------|--------|---------|-------|-----------------|----------|--------|
| `pos-receipt` | refund-service (API-01) | Default | 2 retries with jitter (SDD INT-03) | Default | 20 | SDD §12 INT-03 |
| `cardpay` | payout-service (API-02) | Connect 3 s, read 20 s (sets the attempt lease) | None in-call: scheduled attempts inside the ADR-10 window | Default | 10 | SDD §12 INT-01, ADR-10 |
| `msghub-email`, `msghub-sms` | notification-service (API-04) | Default | None in-call: scheduled message retries | Default, per channel | 10 per channel | SDD §12 INT-02 |
| `keycloak-admin` | notification-service (API-05) | Default | 2 retries with jitter (SDD INT-04) | Default | 10 | SDD §12 INT-04 |

> TODO: every timeout and bulkhead size above is a best guess; SDD §12 marks the per-call timeouts of INT-01 to INT-04 as open - verify with the providers' documentation and load tests.

> **Convention:** retries on idempotent calls only. A write to a provider is retried only as a new scheduled attempt with the same idempotency key (payouts, messages).

## 12.4 Outbox Pattern (mandatory for state-changing events)

- **Table:** `outbox_event` per publishing schema or database (`refund`, `payout`; `05-data-model.md`).
- **Writer:** `OutboxEventWriter.append(...)` inside the same transaction as the aggregate write; it builds the §14.3 envelope (new `event_id`, `occurred_at`, `correlation_id` from the MDC, `causation_id` when given) and stores the current trace context in `headers`.
- **Publisher:** `OutboxRelay`, `@Scheduled(fixedDelay = 500 ms)` on every replica; one replica publishes at a time.
- **At-least-once delivery:** a row is deleted only after Kafka acknowledged it; consumer dedup is mandatory.
- **Monitoring:** gauges `outbox_unprocessed_count` and `outbox_oldest_age_seconds` per publisher; alert when the oldest row is older than 30 s for 5 minutes (SDD §11.4 "outbox backlog age").

```text
OutboxRelay.cycle():
  for tenant in tenantDirectory.all():
    transaction:
      if !pg_try_advisory_xact_lock(hash("<schema>.outbox-relay")): return        // another replica is relaying
      rows = SELECT * FROM outbox_event WHERE tenant_id = :t ORDER BY seq LIMIT 100
      futures = rows.map(r -> kafka.send(record(r.topic, key = r.aggregate_id, value = r.envelope, headers = r.headers)))
      await all futures (timeout 10 s)            // idempotent producer keeps per-partition order
      DELETE FROM outbox_event WHERE tenant_id = :t AND id IN (rows.id)
    on failure: rollback (rows stay; any row already sent is re-sent and deduplicated by the inbox)
```

> Confirm: the relay takes a transaction-level advisory lock per cycle rather than a session lock held for the pod's lifetime; this satisfies SDD §11.3 ("one replica publishes at a time, in `outbox_event` insertion order") without pinning a connection, and ordering per aggregate holds because two transactions cannot both update one aggregate (optimistic version).

## 12.5 Saga Pattern (cross-service transactions)

- **Default style:** choreography (CLAUDE.md, ADR-05). The only cross-service business transaction is SAGA-01 (refund decision, payout, messages, points take-back); its step table is in [refund-service § Cross-service Saga](./04-implementation/refund-service.md#cross-service-saga-orchestrator-role).
- **When to use orchestration:** not in this release; ADR-05 rejected an orchestrated saga for this linear flow.
- **Compensation:** SAGA-01 has none by design: payouts recover forward inside the ADR-10 window, a closed window is reported (`REFUND_PAYOUT_FAILED`), and resolution is manual (SDD §20.1.7).
- **Failure handling:** every consumer step is idempotent (§ 12.2); a step that cannot apply its event dead-letters it with an alarm.

## 12.6 Error Model (RFC 9457 ProblemDetails)

| Field | Type | Notes |
|-------|------|-------|
| `type` | string (URI) | `{problem-base-uri}/<error-code-in-kebab-case>`, for example `.../refund-already-decided` |
| `title` | string | Short, locale-neutral summary |
| `status` | int | HTTP status code |
| `detail` | string | Plain-language, localized to the caller's locale: what went wrong and what to do next (SDD §11.6, REFUNDS 11) |
| `instance` | string | The request path |
| `errorCode` (extension) | string | SDD §15.1 code, for example `REFUND_ALREADY_DECIDED` (the SDD's name for the template's `code`) |
| `traceId` (extension) | string | OpenTelemetry trace id |
| `errors` (extension) | array | Validation only: `field`, `code`, `message` |

**Base exception:** `ServiceException(errorCode, status, detailKey, args...)` (CLAUDE.md). Every business exception extends it; `detailKey` resolves through the `MessageSource` of the caller's locale.

**Global handler:** `ProblemDetailsAdvice` (`@RestControllerAdvice`, kernel) returns `application/problem+json` for `ServiceException`, Bean Validation errors (400 `VALIDATION_FAILED`), `AccessDeniedException` (403 `FORBIDDEN`), authentication failures (401 `UNAUTHENTICATED`), and anything else (500 `INTERNAL_ERROR`, no internals, logged at ERROR with the trace id).

> TODO: best guess `problem-base-uri` = `https://problems.<platform-domain>/refunds-platform`; the SDD does not name a problem-type base URI - verify (the value is configuration, `refunds-platform.problem.base-uri`).

## 12.7 Logging

| Concern | Choice |
|---------|--------|
| Format | JSON to stdout (Spring Boot structured logging with a custom formatter for the SDD field names) |
| Mandatory fields | `ts`, `level`, `service`, `module`, `trace_id`, `span_id`, `correlation_id`, `event`, `tenant_ref` (SDD §11.4); never `tenant_id` or PII at INFO |
| Use-case field | `use_case`: the keyed BRD use case ID(s) of the entry point handling the request (`REFUNDS/UC-04`), from the log MDC (§ 12.8). Absent on platform endpoints, listeners, and jobs. |
| Level for tenant context | `tenant_id` only at DEBUG (never INFO, CLAUDE.md); `tenant_ref` at every level |
| Level for `use_case` | Any level, INFO included: a use case ID is not tenant data or PII |
| Aggregation | Log store product not pinned (SDD §6) |
| Hot retention | Per SDD §6 logging row (open) |
| Cold retention | Per SDD §6 logging row (open) |

## 12.8 Tracing

- **Library:** OpenTelemetry Java agent (auto-instrumentation for Spring MVC, JDBC, Kafka, and `RestClient`), W3C trace context over HTTP headers and Kafka record headers (SDD §11.4).
- **Backend:** not pinned (SDD §6).
- **Sampling:** not pinned (SDD §11.4 leaves the rate open); parent-based, so a sampled request keeps its consumer spans.
- **Context propagation:** `traceparent` and `tracestate`; the outbox stores the context at write time so the relay's publish and every consumer continue the request's trace.

### Use-case attribute

| Concern | Choice | Source |
|---------|--------|--------|
| Attribute | `use_case` on the server span of every entry point SDD §7.3 lists for an in-scope use case, and the same key in the log MDC | LLD convention |
| Value | The use case ID as §7.3 writes it, with its BRD key (`REFUNDS/UC-04`); comma-separated when §7.3 lists the entry point under several use cases | SDD §7.3 |
| Set by | A project annotation, `@UseCase("KEY/UC-NN")`, on the controller method. For web handlers, `UseCaseHandlerInterceptor` (a Spring MVC `HandlerInterceptor`) reads it in `preHandle`, puts it into the SLF4J MDC and onto `Span.current()`, and removes it in `afterCompletion`, so `ProblemDetailsAdvice` and the access log see it too; `UseCaseObservationAspect` (`@Around("@annotation(useCase)")`) does the same for a listener or scheduled method, should §7.3 ever list one | LLD convention |
| Not set | Platform endpoints (health, actuator, sign-in callback), the partner endpoints (API-03, API-06), the daily report endpoint, and every listener and job (§7.3 lists no event or schedule entry point) | LLD convention |
| Frontend | `screen` and `use_case` from the active route's data on every error report and RUM span (`14-frontend.md` § 17.3) | LLD convention |

```java
@Target(ElementType.METHOD) @Retention(RetentionPolicy.RUNTIME)
public @interface UseCase { String[] value(); }   // e.g. @UseCase("REFUNDS/UC-04")
```

> Confirm: `use_case` is an LLD convention; the SDD does not settle a use case attribute (drop this flag when SDD §11.4 or a 13x Observability section names one).

> Confirm: SDD §7.3 lists only REST entry points, so the event consumers and jobs that realise parts of use cases (payout-service on `REFUND_APPROVED`, refund-service on `PAYOUT_SUCCEEDED` and `PAYOUT_FAILED`, notification-service on the refund events, loyalty-service on `REFUND_PAID` for LOYALTY/UC-02 BR-1) carry no `use_case`; their spans still join the originating request's trace. If §7.3 adds `Event:` entry points, annotate those listeners with the listed values.

## 12.9 Configuration

- **Source order:** environment variables > Spring profile properties > defaults (Spring Boot externalized configuration, SDD §11.5); per-environment values in the Helm values file; no hot reload (a change is a rolling restart).
- **Secrets:** delivered at runtime from the secrets manager (product not pinned, SDD §6) as mounted files read through Spring's config tree; never in Git, images, or logs. Per-tenant provider credentials are resolved by `ProviderCredentials.forTenant(tenantId, provider)`.
- **Tenant configuration:** `refunds-platform.tenants[]` in Helm values: `id`, `ref` (the `tenant_ref` alias), `time-zone` (IANA), `locale`, `partner-keys` (provider to opaque key), and branding for the web app.
- **Feature flags:** none in this release (SDD §11.5).

> TODO: the secrets manager product is open in SDD §6; best guess mounted Kubernetes secrets fed by the chosen manager, read with `spring.config.import=configtree:` - verify.

## 12.10 Health & Readiness

- **Liveness:** `/actuator/health/liveness`, in-process only.
- **Readiness:** `/actuator/health/readiness`, the database only (SDD §11.3). Kafka, the outbox relay, consumers, and providers never gate readiness; they report through the outbox-age, consumer-lag, DLQ-depth, and circuit-breaker alerts.
- **Startup:** Flyway migrations complete before the web server accepts traffic (`05-data-model.md` § 8.5).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 08-state-and-rules.md | NEXT: 10-operations.md -->
