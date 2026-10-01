<!--
CHUNK: 09
TITLE: Cross-Cutting Concerns
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 12. Cross-Cutting Concerns

> **Convention:** these are platform-wide rules. Per-service overrides live in `04-implementation/<service>.md`. If a service deviates from a default here, it must justify the override in its own file and link back to this section.

Design defaults: [SDD §11](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default) (§11.1 to §11.6). The platform components below live in package `platform` of the deployable; no module owns them and every module uses them.

| Component | Purpose | Section |
|-----------|---------|---------|
| `CallContextFilter`, `CallContextHolder`, `CallContext` | Principal, tenant, correlation ID per request, listener, or job | § 12.1 |
| `RolePermissionMap`, `PermissionAuthoritiesConverter` | Realm roles to SDD §16.11 permission tokens | § 12.1 |
| `TenantAwareTransactionManager` | `set_config('app.tenant_id', ...)` at transaction start (row-level security) | § 12.1, 05 § 8.4 |
| `IdempotencyService` | Idempotency-Key replay and storage | § 12.2 |
| `EventRedeliveryJob`, `EventPublicationMetrics`, `PiiEncryptingEventSerializer` | In-process event delivery guarantees (SDD §14.10) | § 12.4 |
| `ServiceException`, `ProblemDetailsAdvice` | RFC 9457 errors | § 12.6 |
| `@UseCase`, `UseCaseAspect` | `use_case` log field and span attribute | § 12.8 |
| `SingleReplicaJobLock` | One replica at a time for scheduled jobs (SDD §11.3) | § 12.9 |
| `TenantConfig` | Tenants with currency, locale, time zone, templates, credential paths (SDD §11.5) | § 12.9 |

## 12.1 Authentication & Tenant Resolution

| Concern | Choice | Source |
|---------|--------|--------|
| Token issuer | Keycloak, one realm for customers, members, and branch managers | SDD §6 IAM / AuthN row, ADR-07 |
| Token type | JWT (Bearer) | Standard |
| Validation point | API gateway for inbound traffic, and again in the deployable (Spring Security resource server against the realm JWKS) | ADR-07 |
| Internal service-to-service auth | None: no internal HTTP in this release; in-process port calls check the token at the port (04 § 7.2 Authorization, Kind Port) | SDD §15.1, §6 rules |
| Role to permission mapping | `RolePermissionMap`, a static map of SDD §16.11 (`CUSTOMER` 4 tokens, `MEMBER` 2, `BRANCH_MANAGER` 4); `PermissionAuthoritiesConverter` turns realm roles into authorities named by the tokens, so `@PreAuthorize("hasAuthority('refund.request.decide')")` checks the SDD token verbatim | ADR-08 (Proposed), SDD §16.12 |
| Tenant ID source | `tenant_id` JWT claim; a token without it gets 403 `FORBIDDEN` | SDD §16.8 rule 5 |
| Tenant ID propagation | `CallContext` in process; `tenantId` in every event DTO; the tenant loop in background jobs | SDD §11.2, §14.10 rule 6 |
| Logging policy | `tenant_id` never logged at INFO; never log PII at INFO; customer email and mobile always masked | CLAUDE.md hard rule; SDD §11.4 |

> TODO: ADR-08 is Proposed with an open question (static map in the deployable or Keycloak client roles); best guess: the static map above, changed only with SDD §16 in the same release - verify.

**`CallContext` lifecycle:** `CallContextFilter` (servlet filter, after Spring Security) builds it from the JWT (`sub`, realm roles, `tenant_id`, `branch_id`, `member_id`, `email`, `phone_number`, `locale`) and `X-Correlation-Id` (generated when absent), stores it in `CallContextHolder` (thread-bound), and clears it in `finally`. Listeners and jobs call `callContext.runAsSystem(tenantId, correlationId)`, which sets a system principal and clears it afterwards.

## 12.2 Idempotency

| Concern | Choice |
|---------|--------|
| Header | `Idempotency-Key`, a UUID (SDD §15.1 Standard headers) |
| Required on | Every POST of `refund` (SDD §17.1 API Standards): submit, cancellation, decision; no other module has a write endpoint |
| Dedup tuple | `(tenant_id, idempotency_key)` plus `request_hash` (SHA-256 of the canonical body) |
| TTL | Open (SDD §17.1 Retention Policy); best guess 24 hours, purged daily |
| Storage | `refund.idempotency_record` (05 § 8.2) |
| Conflict response | 409 + RFC 9457 ProblemDetails (`type: /problems/idempotency/conflict`, `errorCode` `CONFLICT`) |
| In-flight handling | No in-progress marker: the record is inserted in the business transaction; a concurrent duplicate fails on the primary key at commit, rolls back, and replays the stored response |

> TODO: the idempotency replay window is open in SDD §17.1; best guess: 24 hours - verify.

Consumers: every in-process listener dedups on `eventId` or the business key of SDD §14.10 Notes (07 § 10.6); every provider write carries the dispatch row ID as its idempotency key (ADR-09).

## 12.3 Resilience (downstream calls)

> **Library:** Resilience4j (CLAUDE.md default). **Scope:** HTTP and broker calls; in-process port calls (06 § 9.6) take no timeout, retry, circuit breaker, or bulkhead.

| Pattern | Default config | Override mechanism |
|---------|----------------|-------------------|
| Timeout | Per provider (table below); HTTP client connect 2 s | Per-instance client config |
| Retry | POS lookup only: 1 retry with jitter on timeout or 503 (SDD §12 INT-03); provider writes: no in-call retry, the dispatcher backoff (08 § 11.3) is the retry | Per-instance `RetryConfig` |
| Circuit breaker | 50% failure rate over a 20-call sliding window, 30 s open state | Per-instance `CircuitBreakerConfig` |
| Bulkhead | Per downstream provider, semaphore bulkhead (table below) | Per-instance `BulkheadConfig` |

| Instance | Provider (API) | Called from | Timeout | Bulkhead (concurrent calls) |
|----------|----------------|-------------|---------|-----------------------------|
| `pos-records` | POS Records (API-02) | Request thread, never inside a transaction (SDD R-06) | Open (SDD §12) | 20 |
| `cardpay` | CardPay (API-03) | `payout` dispatcher | Open (SDD §12) | 5 |
| `msghub` | MsgHub (API-04) | `notification` dispatcher | Open (SDD §12) | 10 |

> TODO: the provider call timeouts and rate limits are open in SDD §12 (INT-01 to INT-03); best guess: POS 3 s (a customer is waiting), CardPay 10 s, MsgHub 5 s, with the bulkhead sizes above - verify with each provider.

> **Convention:** retries on idempotent calls only. Non-idempotent calls (without an idempotency key) must not be retried automatically.

## 12.4 Outbox Pattern (mandatory for state-changing integration events)

- **Scope:** integration events on the broker (07 § 10.1-10.5). The in-process domain events of 07 § 10.6 are published in process at their transaction phase and use no outbox.
- **Table:** Not applicable - no integration events in this release (SDD ADR-02); no module has an `outbox` table.
- **Writer / Publisher:** Not applicable for the broker. The same contract is applied to provider writes through the dispatch tables of `payout` and `notification` (ADR-09): the row is written in the business transaction, a separate dispatcher (every replica, `FOR UPDATE SKIP LOCKED` and a lease) sends it, and the row is marked done (`SUCCEEDED`, `SENT`) only after the provider confirms ([payout § Pattern: Outbox](./04-implementation/payout.md#pattern-outbox-dispatch-table-for-provider-writes), [notification § Pattern: Outbox](./04-implementation/notification.md#pattern-outbox-dispatch-table-for-provider-writes)).
- **Processed only after acknowledgement:** a failed or timed-out provider call leaves the row retryable (`RETRYING`); nothing is marked done without the provider's confirmation.
- **At-least-once delivery:** a crash between the provider's acceptance and the outcome commit re-sends the row once its lease ends, with the same idempotency key; the providers must deduplicate (TBD - external, SDD §15.6).
- **Monitoring:** `payout_oldest_open_seconds` and `notification_oldest_pending_seconds` replace `outbox_unprocessed_count` (10 § 13.3, § 13.7).

**In-process event delivery (SDD §14.10):** the publication log is the Spring Modulith registry in schema `platform`; every listener is `@ApplicationModuleListener`; `EventRedeliveryJob` (one replica, `SingleReplicaJobLock`) re-delivers publications incomplete for longer than `EVENT_REDELIVERY_AGE` and stops after `EVENT_MAX_REDELIVERIES` (counted in `platform.event_publication_redelivery`), incrementing `event_publication_stuck_total`; a starting replica does not republish on its own (the registry's republish-on-restart switch stays off, SDD §11.3); `PiiEncryptingEventSerializer` encrypts the `pii` fields of `ContactPoint`; a publication is deleted when its last listener completes (SDD §14.10 rule 8).

```text
EventRedeliveryJob.run():                                   // every EVENT_REDELIVERY_INTERVAL, one replica
  incompletePublications.resubmitIncompletePublications(p ->
      p.publicationDate() < now - EVENT_REDELIVERY_AGE
      && redelivery.incrementAndGet(p.identifier()) <= EVENT_MAX_REDELIVERIES)   // over the limit: stuck, alert once
```

> TODO: the re-delivery age threshold, job interval, and maximum re-deliveries are open in SDD §14.10 rules 3 and 5; best guess: age 5 min, interval 1 min, at most 10 re-deliveries, which keeps a take-back well inside the 1 hour of LOYALTY/NFR-02 - verify.

## 12.5 Saga Pattern (cross-service transactions)

- **Default style:** choreography (each service reacts to events) per CLAUDE.md; here in process: approval and payout instruction in one transaction (API-01), then `PayoutSucceeded`, `RefundPaid` ([refund § 7.4 Pattern: Saga](./04-implementation/refund.md#pattern-saga-choreography-in-process)).
- **When to use orchestration:** flows with >3 steps, conditional branching, or required central visibility. Not used in this release.
- **Compensation:** none designed: a payout that ends `FAILED` or `UNKNOWN` leaves the request `APPROVED` and alerts the branch manager (REFUNDS/UC-04 E1); what happens after Failed is open in SDD §17.2.
- **Failure handling:** a failed listener is re-delivered (§ 12.4); a stuck publication or a Failed or Unknown payout alerts and follows the runbook (10 § 13.8).

> TODO: after a payout ends Failed, who may retry or cancel it, and through which use case, is open in SDD §17.2; best guess: no action in this release beyond the alert and the reconciliation - verify with the REFUNDS owner.

## 12.6 Error Model (RFC 9457 ProblemDetails)

| Field | Type | Notes |
|-------|------|-------|
| `type` | string (URI) | Relative URI `/problems/<module>/<error-slug>`, served by the gateway as a human-readable page |
| `title` | string | Human-readable summary |
| `status` | int | HTTP status code |
| `detail` | string | What went wrong and what the user can do next (SDD §11.6, REFUNDS 11 UI/UX) |
| `instance` | string | The path that produced the error |
| `errorCode` (extension) | string | The SDD §15.1 standard code or the SDD §17.x domain code, verbatim (`VALIDATION_FAILED`, `REFUND_ALREADY_DECIDED`) |
| `traceId` (extension) | string | OpenTelemetry trace ID |
| `errors` (extension) | array | For validation failures: `field`, `code`, `message` per field |

**Base exception:** `ServiceException` (CLAUDE.md). Every business exception extends it and carries an error code.

**Global handler:** `@RestControllerAdvice` translates exceptions to ProblemDetails.

`ProblemDetailsAdvice` maps `ServiceException` by its status and code; Bean Validation errors to 400 `VALIDATION_FAILED` with `errors[]`; Spring Security's 401 and 403 to `UNAUTHENTICATED` and `FORBIDDEN`; optimistic lock failures on refund requests to 409 `REFUND_ALREADY_DECIDED`; anything else to 500 `INTERNAL_ERROR` with a generic `detail`, never a stack trace.

> Confirm: the `type` URI scheme (`/problems/<module>/<error-slug>`) is an LLD choice; the SDD fixes only `errorCode`.

## 12.7 Logging

| Concern | Choice |
|---------|--------|
| Format | JSON (structured) |
| Mandatory fields | `ts`, `level`, `module`, `trace_id`, `span_id`, `correlation_id`, `event`, `attrs` (SDD §11.4, verbatim); `tenant_id` only at DEBUG |
| Use-case field | `use_case`: the keyed BRD use case ID(s) of the entry point handling the request (`REFUNDS/UC-04`), from the log MDC (§ 12.8). Absent on platform endpoints. |
| Level for tenant context | DEBUG (never INFO per CLAUDE.md) |
| Level for `use_case` | Any level, INFO included: a use case ID is not tenant data or PII |
| Aggregation | Central log store, open in SDD §6 |
| Hot retention | Open (SDD §6 Logging row) |
| Cold retention | Open (SDD §6 Logging row) |

Per-module INFO content follows SDD §17.1 to §17.4 Logging (reference numbers, statuses, IDs; never contact data; `member_id` only at DEBUG).

## 12.8 Tracing

- **Library:** OpenTelemetry SDK + automatic instrumentation for Spring Boot.
- **Backend:** open in SDD §6.
- **Sampling:** open in SDD §11.4.
- **Context propagation:** W3C Trace Context (`traceparent`, `tracestate` headers); into event publications through the DTO's `correlationId` and the listener span's link, and into payouts through `payout.trace_parent` (05 § 8.2).

> TODO: trace backend and sampling rate are open in SDD §6 and §11.4; best guess: 100% in Dev and SIT, 10% probabilistic in UAT and Prod, with errors always kept - verify.

### Use-case attribute

| Concern | Choice | Source |
|---------|--------|--------|
| Attribute | `use_case` on the server or consumer span of every entry point SDD §7.3 lists for an in-scope use case, and the same key in the log MDC | LLD convention |
| Value | The use case ID as §7.3 writes it, with its BRD key (`REFUNDS/UC-04`). An entry point §7.3 lists under several use cases carries all of them in one string, in §7.3 order, joined by commas without spaces (`REFUNDS/UC-02,REFUNDS/UC-04` on `GET /v1/refund-requests/{refundId}`) | SDD §7.3 |
| Lookup | Match one use case as a whole comma-delimited token, e.g. regex `(^\|,)REFUNDS/UC-04(,\|$)`; never equality (misses shared entry points) or a substring (`REFUNDS/UC-01` would match `REFUNDS/UC-010`) | LLD convention |
| Set by | A project annotation, `@UseCase("[KEY]/UC-NN")`, on the controller method, listener, or scheduled method; one aspect puts the value into the SLF4J MDC and onto the current span (OpenTelemetry `Span.current().setAttribute`), and clears the MDC afterwards | LLD convention |
| Not set | Platform endpoints (health, actuator, sign-in), the branch refund report (no use case), and the event listeners and jobs §7.3 does not list | LLD convention |
| Frontend | `screen` and `use_case` from the active route's data on every error report and RUM span (`14-frontend.md` § 17.3); `use_case` joins the route's `useCases` in the Value form | LLD convention |

The ten annotated entry points (seven in `refund`, three in `loyalty`) and their values are listed in [refund § 7.2](./04-implementation/refund.md#controllers) and [loyalty § 7.2](./04-implementation/loyalty.md#controllers).

> Confirm: `use_case` is an LLD convention; the SDD does not settle a use case attribute (drop this flag when SDD §11.4 or a 13x Observability section names one).

## 12.9 Configuration

- **Source order:** environment variables > Spring profile properties > defaults; values come from the Helm values per environment in Git (SDD §11.5).
- **Secrets:** the secrets manager outside the cluster configuration (SDD §6), loaded at startup; provider credentials per tenant at the paths named in `TenantConfig`; never in images, Git, or logs.
- **Feature flags:** none in this release.
- **Tenant configuration:** `TenantConfig` binds the Helm values block of SDD §11.5 (tenant ID, currency, default locale, time zone, message template set, credential paths); background jobs loop over it.
- **Single-replica jobs:** `SingleReplicaJobLock.runExclusively(name, task)` takes `pg_try_advisory_lock(hashtextextended(name, 0))` on a dedicated connection and skips the run when another replica holds it (SDD §11.3).

> TODO: whether a feature flag tool is needed is open in SDD §11.5; best guess: none for this release - verify.

## 12.10 Health & Readiness

- **Liveness:** `/actuator/health/liveness` - fast in-process check (no DB).
- **Readiness:** `/actuator/health/readiness` - database connection and Flyway migrations complete (SDD §17.1 to §17.4 Deployment Strategy); no broker; provider availability (POS, CardPay, MsgHub) is never a readiness condition (circuit breakers handle it).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 08-state-and-rules.md | NEXT: 10-operations.md -->
