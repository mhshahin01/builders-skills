<!--
CHUNK: 09
TITLE: Cross-Cutting Concerns
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 12. Cross-Cutting Concerns

> **Convention:** these are platform-wide rules, implemented once in the shared package `refundsplatform.platform` of the deployable. Per-module overrides live in `04-implementation/<module>.md`, except per-instance resilience settings, which live in the § 12.3 instance table.

## 12.1 Authentication & Tenant Resolution

| Concern | Choice | Source |
|---------|--------|--------|
| Token issuer | Platform IAM (Keycloak, proposed, needs approval), one realm for end customers and staff per environment; each person has one identity (`sub`) that holds `CUSTOMER` and, once a member, `MEMBER`, and to which staff provisioning adds `BRANCH_MANAGER` (with `branch_id`) or `PAYOUT_OPERATOR` | SDD [§6 IAM / AuthN](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview), [ADR-07](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) (Proposed), [§19](../sdd-refunds-platform/15-environments.md#19-environments) Access controls |
| Token type | JWT (Bearer), OIDC authorization code with PKCE | SDD ADR-07 |
| Validation point | The deployable, as OAuth2 resource server (Spring Security, part of Spring Boot): issuer, audience, expiry, signature, against the one issuer `IAM_ISSUER_URI` (`10-operations.md` § 13.1) | SDD [§11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) (no API gateway, SDD §6) |
| Second sign-in factor | Required for a staff role (`BRANCH_MANAGER`, `PAYOUT_OPERATOR`) by the realm's sign-in policy | SDD ADR-07, §11.6 |
| Role to permission | `PermissionMap`: one code map from the `roles` claim to the SDD §16.11 tokens (including `payout.read`, `payout.resolution.record`, and `payout.resolution.confirm` for `PAYOUT_OPERATOR`), used by `RolesToAuthoritiesConverter`; `@PreAuthorize("hasAuthority('<token>')")` on each controller method and port | SDD [ADR-08](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions), [§16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide), [§16.12.1](../sdd-refunds-platform/12-centralized-user-roles.md#16121-seed-strategy) |
| Internal service-to-service auth | Not applicable: in-process calls carry the caller's security context; `ModuleIdentityRunner.runAs(ModuleRole role, UUID tenantId, Supplier<T> work)` sets, for the duration of `work`, a `ModuleAuthentication` (principal `module:customer-notification`, `tenantId`, authorities of the role from `PermissionMap`, here `refund.contact.read` for `NOTIFICATION_DISPATCHER`) in the `SecurityContextHolder` and restores the previous context in `finally` | SDD §6 ecosystem rules, [§16.3](../sdd-refunds-platform/12-centralized-user-roles.md#163-user-types-tier-1) |
| IAM staff read (API-08) | `customer-notification` reads the branch managers of a branch with the confidential IAM client of SDD §11.6 (`IAM_ADMIN_CLIENT_ID`), whose only right is reading the users that hold a staff role; never under a module role | SDD §11.6 IAM admin read, [§16.1](../sdd-refunds-platform/12-centralized-user-roles.md#161-business-overview), [API-08](../sdd-refunds-platform/11-api-contracts.md#api-08-find-the-branch-managers-of-a-branch-customer-notification---platform-iam) |
| Provider callbacks | API-02 (if CardPay calls back), API-05 (if POS Records pushes), API-09 (if CardPay sends dispute notices): no bearer token, permitted in the security filter chain; the inbound adapter verifies the provider scheme against each tenant's secret and sets the tenant of the matching secret before any repository call; no match -> 401 `UNAUTHENTICATED` | SDD [§11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default) |
| Tenant ID source | `tenant_id` JWT claim, which the realm sets for the one tenant; jobs and listeners: the row or event; provider callbacks: the matching secret | SDD §11.2, ADR-07 |
| Tenant ID propagation | `CallerContext` (record) passed explicitly to every application service; listeners get it from `EventMetadata`; jobs from `TenantJobRunner` | SDD §15.1 (in-process call context) |
| Contextual gates | Owner (`sub`), branch (`branch_id` claim), own-request (the request's customer `sub` equals the caller's `sub`: one identity per person), membership, and own-resolution (a `PAYOUT_OPERATOR` never confirms a resolution they recorded: 403 `SAME_PERSON_CONFIRMATION`): in each module's domain | SDD [§16.2](../sdd-refunds-platform/12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action), [§16.5](../sdd-refunds-platform/12-centralized-user-roles.md#165-capability-matrix-canonical) footnote 5 |
| Logging policy | No personal data at any level; `tenant_id` per § 12.7 | SDD §11.4, §11.6 |

> TODO: claim names `roles`, `branch_id`, `tenant_id`, and `member_id` follow SDD §16.2 item 2 except `member_id`, whose source is the SDD §16.6 [NEEDS CLARIFICATION] (membership source); and the whole sign-in is the SDD §16.2 [NEEDS CLARIFICATION] (R-06) - verify before building any customer or member endpoint.

## 12.2 Idempotency

| Concern | Choice |
|---------|--------|
| Header | `Idempotency-Key`, a UUID (SDD [§15.1](../sdd-refunds-platform/11-api-contracts.md#151-contract-conventions-platform-defaults) Standard headers) |
| Required on | `POST /v1/refund-requests`, `POST /v1/refund-requests/{refundRequestId}/cancellation`, `POST /v1/refund-requests/{refundRequestId}/decision` (SDD [§17.1 API Standards](../sdd-refunds-platform/13a-service-refund-request.md#api-standards)); `POST /v1/payouts/{payoutId}/resolutions`, `POST /v1/payouts/{payoutId}/resolutions/{resolutionId}/confirmation` (SDD [§17.2 API Standards](../sdd-refunds-platform/13b-service-payout.md#api-standards)) |
| Dedup tuple | `(tenant_id, idempotency_key)`, bound to the caller: the request hash (method, path, body) and `caller_sub` must both match; a different caller or body is 409 `CONFLICT` |
| TTL | 24 hours, then deleted by `refund-request-housekeeping` and `payout-housekeeping` |
| Storage | `refund_request.idempotency_record` and `payout.idempotency_record` (the two modules with idempotent write endpoints), one platform `IdempotencyService` bound to each module's DataSource |
| Conflict response | 409 `CONFLICT` (SDD §15.1: key reused with a different body) |
| In-flight handling | No in-flight 409: the record is inserted in the business transaction, so a concurrent twin waits on the key and then gets the stored response; a failed first request leaves no record |
| Listeners, jobs, and provider calls | Event-id dedup (`processed_event`) or the business keys of `07-event-contracts.md` § 10.6; provider calls carry a stable key: the payout round's key (the payout id in round 1, a new UUIDv7 for each round after a payment is sent back), the message id, the name-based UUID per alert recipient; the API-02 callback is idempotent on the provider result id, API-09 notices on the dispute id and state (SDD [AP-02](../sdd-refunds-platform/06-principles-and-decisions.md#9-architecture-principles), §17.2 API Standards) |

> Confirm: the 24-hour TTL is an LLD default; the SDD states no dedup window for the five endpoints.

## 12.3 Resilience (downstream calls)

> **Library:** Resilience4j (CLAUDE.md default; SDD ADR-10, Proposed, needs approval; until approved the adapters hand-write the same timeout, breaker, and bulkhead). **Scope:** provider HTTP calls and the API-08 IAM staff query; the in-process API-06 port takes no timeout, retry, circuit breaker, or bulkhead. An open breaker or a full bulkhead makes no call and is never counted as an attempt (payout `NOT_SENT`, customer-notification `NOT_SENT`).

| Pattern | Default config | Override mechanism |
|---------|----------------|-------------------|
| Timeout | 2s connect / 10s read | Per-instance `TimeLimiter` config |
| Retry | No in-call retry; retries are new claims of the owning job with exponential backoff and full jitter (`08-state-and-rules.md` § 11.3) | Per-job configuration |
| Circuit breaker | 50% failure rate over a 20-call sliding window, 30s open, 3 calls half-open | Per-instance `CircuitBreakerConfig` |
| Bulkhead | Per provider, 10 concurrent calls | Per-instance `BulkheadConfig` |

**Instances:** one row per Resilience4j instance; `Default` where a cell equals the defaults above.

| Instance | Caller (service, API ID) | Timeout | Retry | Circuit breaker | Bulkhead | Source |
|----------|--------------------------|---------|-------|-----------------|----------|--------|
| `cardpayPayout` | `payout`, [API-01](../sdd-refunds-platform/11-api-contracts.md#api-01-request-a-payout-payout---cardpay-ltd) | Default | Between claims: base 1 min, cap 1 h, same round key | Default | 5 | [SDD §12 INT-01](../sdd-refunds-platform/08-integrations.md#12-integrations), [§17.2 Integrations](../sdd-refunds-platform/13b-service-payout.md#integrations) |
| `cardpayRefundRecords` | `payout`, [API-07](../sdd-refunds-platform/11-api-contracts.md#api-07-get-refund-records-for-reconciliation-payout---cardpay-ltd) | 30s read | None (a failed day is re-run on the next run) | Default | 1 | [SDD API-07](../sdd-refunds-platform/11-api-contracts.md#api-07-get-refund-records-for-reconciliation-payout---cardpay-ltd), [§12 INT-01](../sdd-refunds-platform/08-integrations.md#12-integrations) |
| `cardpayDisputeNotices` | `payout`, [API-09](../sdd-refunds-platform/11-api-contracts.md#api-09-receive-card-dispute-notices-cardpay-ltd---payout) (only if `payout` fetches the notices) | Default | None in the call; a failed fetch is retried on the next `payout-dispute-fetch` run from the same cursor | Default | 1 | [SDD API-09](../sdd-refunds-platform/11-api-contracts.md#api-09-receive-card-dispute-notices-cardpay-ltd---payout) (if fetched, per INT-01), [§12 INT-01](../sdd-refunds-platform/08-integrations.md#12-integrations) |
| `msghubSend` | `customer-notification`, [API-03](../sdd-refunds-platform/11-api-contracts.md#api-03-send-an-email-or-sms-customer-notification---msghub) | 5s read | Between claims: base 30 s, cap 30 min, 8 attempts | Default; opens at once on an authentication failure | Default | [SDD §12 INT-02](../sdd-refunds-platform/08-integrations.md#12-integrations), [§17.3 Error Handling](../sdd-refunds-platform/13c-service-customer-notification.md#error-handling) |
| `posReceiptLookup` | `refund-request`, [API-04](../sdd-refunds-platform/11-api-contracts.md#api-04-look-up-a-receipt-refund-request---point-of-sale-records) | 1s connect / 3s read | One quick retry on a connection error only | Default | 20 | [SDD §12 INT-03](../sdd-refunds-platform/08-integrations.md#12-integrations) |
| `iamUserQuery` | `customer-notification`, [API-08](../sdd-refunds-platform/11-api-contracts.md#api-08-find-the-branch-managers-of-a-branch-customer-notification---platform-iam) | 3s read (below the message lease) | As `msghubSend`: the message is retried within the INT-02 bounds | Default | 5 | [SDD §12 INT-04](../sdd-refunds-platform/08-integrations.md#12-integrations), [API-08](../sdd-refunds-platform/11-api-contracts.md#api-08-find-the-branch-managers-of-a-branch-customer-notification---platform-iam) |

> TODO: every timeout and retry bound in the instance table is a best guess; the bounds are the SDD §12 INT-01, INT-02, and INT-03 [NEEDS CLARIFICATION] (solution architect, once each provider's documentation is supplied) and the INT-04 timeout `TBD (ADR-07)` - verify.

> **Convention:** retries on idempotent calls only. The CardPay and MsgHub calls repeat with the same idempotency key; the receipt lookup, the refund-records read, the dispute-notice fetch, and the IAM staff query are reads.

## 12.4 Outbox Pattern (mandatory for side effects that must follow a state change)

- **Scope:** (1) the durable in-process domain events of `07-event-contracts.md` § 10.6, whose publication log is their outbox (SDD §14.10 Delivery: Durable); (2) the provider writes that follow a state change: CardPay payouts (`payout.payout` rows) and MsgHub messages (`customer_notification.message` rows), which are queued in the owning module's tables (SDD [ADR-02](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions), §5 Outbox). There is no broker, so no integration-event outbox. The receipt lookup, the refund-records read, and the IAM staff query are reads and have none.
- **Table:** the SDD names the publication log, so this LLD uses `event_publication` and `event_publication_listener` with `completed_at` (SDD [§11.1](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default)), in the `refund_request` and `payout` schemas; never `outbox` / `processed_at`.
- **Writer:** `DomainEventPublisher.publish` inserts the event row and one listener row per registered listener in the same local transaction as the aggregate write; a due payout is committed by the change that makes it due (`PayoutServiceImpl.createForApproval`, a dispute released by `CardPaymentDisputeServiceImpl.recordNotice`, a not-paid resolution applied by `applyOpenResolutions`, a payment sent back in `recordReturn`), and a queued message by `MessageSelectionServiceImpl.select`, each in its own transaction. No write path calls a listener or a provider directly, inside the transaction or after commit, except through the dispatcher.
- **Publisher:** `PublicationDispatcher.afterCommit(eventIds)` does no listener work on the committing thread: it submits one task per listener row to `publicationDispatchExecutor` (`ThreadPoolTaskExecutor`, part of Spring; core 4, max 8, queue 200; on rejection the row is left to the redelivery job), copying `correlation_id`, `tenant_id`, and the stored `traceparent` into the task's MDC. Each task claims its row first: `UPDATE event_publication_listener SET next_attempt_at = now() + interval '60 seconds' WHERE tenant_id = ? AND event_id = ? AND listener_id = ? AND completed_at IS NULL AND next_attempt_at <= now()` in a `REQUIRES_NEW` transaction of the publisher's transaction manager (0 rows: another replica holds it; return), then runs `deliver(row)`. `markCompleted` and `attemptFailed` always run in a new transaction (`TransactionTemplate`, `REQUIRES_NEW`) of the publisher's transaction manager. Every `Throwable` is caught per row and recorded with `attemptFailed`; nothing propagates to the caller of `commit()`. Listener rows are inserted with `next_attempt_at = now()`. The per-module redelivery job (every 10 s, batch 100) claims incomplete listener rows that are due (`next_attempt_at <= now`) with `FOR UPDATE SKIP LOCKED` and the same 60 s lease, commits, and then calls `deliver(row)` directly, never the dispatcher's claim, so any replica can run it and a row is delivered by one replica at a time. On shutdown the executor waits up to 20 s; unfinished rows stay for the redelivery job. The provider-work publishers are `payout-retry` and `message-sender` (claim and lease, module files).
- **Switched-off product:** the dispatcher and the redelivery jobs skip every listener row for which `ListenerRegistry.isEnabled(listenerId)` is false (§ 12.9): the rows stay incomplete, so the publication log keeps the events for that product's listeners, and the redelivery job delivers them once the product is switched on (SDD §11.1). At application start, `ListenerRegistry` inserts, for each configured tenant and each listener of a publishing module whose product is on, `listener_enablement (tenant_id, listener_id, enabled_since = now())` with `ON CONFLICT DO NOTHING`, through that publishing module's DataSource.
- **Processed only after acknowledgement:** `completed_at` is set only after the listener's own transaction has committed (the "every listener's commit" acknowledgement); a payout is `SUCCEEDED` only on CardPay's success answer or a confirmed paid resolution; a message is `SENT` only on MsgHub's success answer. A failed or timed-out delivery leaves the row incomplete with `attempts`, `last_error`, and `next_attempt_at` (exponential backoff with jitter, base 10 s, cap 15 min).
- **Ordering:** listener rows are retried independently; a failing listener does not block later events, and events can reach a listener out of order. Every refund and payout event carries a `sequence` (SDD [§14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) Ordering), and each listener treats an older one as stale: `refund-request` ignores a payout fact older than one it handled (`last_payout_sequence`) and a dispute fact older than its dispute copy row, `customer-notification` serialises per refund request with an advisory lock and creates stale status messages `SUPERSEDED` (SDD §17.3), and `loyalty-points` applies the refund outcomes of one request in `sequence` order (refund-outcome log, SDD §17.4).
- **At-least-once delivery:** if a listener commits but the `completed_at` update fails or the process stops, the listener runs again; the payload, including the event id, is fixed when the row is written, and every listener dedupes (`07-event-contracts.md` § 10.6).
- **Monitoring:** `publication_incomplete_oldest_seconds` per listener and the `PublicationListenerLag` alert at 30 minutes, counted from the later of the event's publication and the switch-on of the listener's product; the listeners of a switched-off product are not counted (SDD [§11.4](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), `10-operations.md` § 13.7).

## 12.5 Saga Pattern (cross-service transactions)

- **Default style:** choreography of the in-process events of SDD §14.10, as the SDD [§14.7 saga doctrine](../sdd-refunds-platform/10-events-hub.md#147-universal-subscribers--cross-service-doctrines) sets it; no module orchestrates another. One saga crosses modules, the refund saga ([refund-request § 7.4](./04-implementation/refund-request.md#pattern-saga-choreography---refund-lifecycle-with-payout-and-take-back)): (1) `refund-request` approves (`RefundRequestApproved`); (2) `payout` pays out, holding the payout while the original card payment has an open card dispute (`PayoutSucceeded`, or `PayoutAttemptFailed` and `PayoutStillFailing`); (3) `refund-request` marks the request Paid (`RefundRequestPaid`); (4) `loyalty-points` takes points back. `customer-notification` listens to steps 1 to 3 and never changes the saga.
- **Timeout owners:** step 1 `refund-request` (the `late` flag); step 2 `payout` (the retry stop time, `PAYOUT_RETRY_STOP_AFTER`, open); step 3 `refund-request` (Approved for more than 3 days and not Paid: the gauge `refund_request_oldest_approved_unpaid_age_seconds`); step 4 `loyalty-points` (the LOYALTY/NFR-02 budget: `loyalty_takeback_lag_seconds` and the 30-minute listener alert).
- **When to use orchestration:** not used in this release.
- **Compensation:** the SDD's compensating steps: a payout that has not paid, whose original payment's dispute the bank refunded to the customer, is cancelled (`PayoutCancelled`) and the request becomes Rejected (`RefundRequestRejected`, `rejectionKind` `DISPUTE_REFUNDED`); a Paid refund whose payout the customer's bank sends back returns to step 2 in a new payout round (`PayoutReturned`, then `RefundRequestPayoutReturned`, request back to Approved). A refused payout is retried and the request stays Approved (REFUNDS/UC-04 E1); a stopped or unknown payout is resolved by payout operators through resolution rows (SDD §20.1.7). What a payout sent back does to points taken back in step 4 and how a payout that can never succeed is compensated are open in the SDD and flagged in the owning module files.
- **Failure handling:** a listener that keeps failing raises the 30-minute alert and is never dropped; `PayoutStopped`, `PayoutUnknown`, `PayoutDisputeRefundedUnresolved`, the approved-to-paid alert, and reconciliation mismatches alert operations (`10-operations.md` § 13.7).

## 12.6 Error Model (RFC 9457 ProblemDetails)

| Field | Type | Notes |
|-------|------|-------|
| `type` | string (URI) | `{problemBase}/<error-code-in-kebab-case>`, `{problemBase}` from `PROBLEM_TYPE_BASE_URI` |
| `title` | string | Short, locale-neutral summary |
| `status` | int | HTTP status code |
| `detail` | string | What to do next, in plain language; no codes or internals (REFUNDS 11 Error Messages) |
| `instance` | string | Request path |
| `errorCode` (extension) | string | SDD §15.1 standard code or the module's domain code, verbatim (`VALIDATION_FAILED`, `RECEIPTS_UNAVAILABLE`, `BRANCH_NOT_STARTED`, `SAME_PERSON_CONFIRMATION`, `MEMBERSHIP_ENDED`, ...) |
| `traceId` (extension) | string | Current trace id |
| `correlationId` (extension) | string | `X-Correlation-Id` of the request |
| `errors` (extension) | array | Validation: `field`, `code`, `message` per field |

**Base exception:** `ServiceException` (abstract; `errorCode()`, `status()`, `userMessageKey()`); every business exception of the module files extends it.

**Global handler:** `GlobalProblemHandler` (`@RestControllerAdvice`, extends `ResponseEntityExceptionHandler`) maps `ServiceException`, `AccessDeniedException`, `AuthenticationException`, and any other exception (500 `INTERNAL_ERROR`, no stack trace) with its own `@ExceptionHandler` methods; `MethodArgumentNotValidException` and the other Spring MVC exceptions are mapped only by overriding `handleMethodArgumentNotValid` and `handleExceptionInternal`, never by an `@ExceptionHandler` of their own (Spring rejects two handlers for one exception type at start-up); responses are `application/problem+json`.

- **(a) Security filter chain:** `ProblemDetailsAuthenticationEntryPoint` and `ProblemDetailsAccessDeniedHandler` (platform classes implementing Spring Security's `AuthenticationEntryPoint` and `AccessDeniedHandler`) are registered on the filter chain; they write `application/problem+json` with 401 `UNAUTHENTICATED` (keeping the `WWW-Authenticate` header) or 403 `FORBIDDEN`, plus `traceId` and `correlationId`.
- **(b) Framework exceptions:** `GlobalProblemHandler` extends `ResponseEntityExceptionHandler` and overrides `handleExceptionInternal`, so every Spring MVC exception keeps its 4xx status and gains `errorCode`: missing or malformed header, unreadable body, type mismatch on a path or query value -> 400 `VALIDATION_FAILED` with `errors[]`; unknown route -> 404 `NOT_FOUND`; 405, 406, 415 keep their status with `errorCode` `VALIDATION_FAILED`. Only exceptions outside these reach 500 `INTERNAL_ERROR`.
- **(c) Retry-After:** 429 and every 503 carry `Retry-After`.
- **(d) Product switched off:** an endpoint of a switched-off product answers 404 `NOT_FOUND` with the same body as an unknown resource (§ 12.9).

> Confirm: `PROBLEM_TYPE_BASE_URI` and the `correlationId` extension are LLD choices; SDD §15.1 fixes the error model and `errorCode` only.

## 12.7 Logging

| Concern | Choice |
|---------|--------|
| Format | JSON (structured) to stdout (SDD §6 Logging row) |
| Mandatory fields | The SDD [§11.4](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default) Logging fields, verbatim: `ts` (UTC), `level`, `module`, `logger`, `message`, `trace_id`, `span_id`, `correlation_id`, `tenant_id`, `event_id` (listeners); plus the module fields of SDD §17.1 to §17.4 Logging, internal ids only: `refund_request_id`, `payout_id`, `message_id`, `channel`, `movement_id`, `received_purchase_id`, `processed_refund_id` |
| Business references | Never logged: no reference number, receipt number, purchase reference, or refund reference (SDD [§17.1 Logging](../sdd-refunds-platform/13a-service-refund-request.md#logging), [§17.4 Logging](../sdd-refunds-platform/13d-service-loyalty-points.md#logging)) |
| Use-case field | `use_case`: the keyed BRD use case ID(s) of the entry point handling the request (`REFUNDS/UC-04`), from the log MDC (§ 12.8). Absent on platform endpoints and on entry points with no `@UseCase` |
| Level for tenant context | Every level, as SDD §11.4 lists `tenant_id` on every line |
| Level for `use_case` | Any level, INFO included: a use case ID is not tenant data or PII |
| Personal data | Never, at any level: no email address, mobile number, receipt items, member name or identifier, purchase details, message text, or payment reference in clear (SDD §11.4, §11.6, §17.2 Logging); an IAM user id is the only identifier of a branch-manager recipient that is logged |
| Aggregation | Backend open (SDD §6 Tracing row marker) |
| Hot retention | Per the logging backend (SDD §17.1 Logging) |
| Cold retention | Per the logging backend |

> Confirm: SDD §11.4 puts `tenant_id` on every log line (SDD OI-04 kept it, Rejected), while the CLAUDE.md default this skill applies writes the tenant only at DEBUG; this LLD follows the SDD. If the product owner adopts the CLAUDE.md rule, `tenant_id` moves to DEBUG-only and to a span attribute (SDD OI-04 option B).

## 12.8 Tracing

- **Library:** OpenTelemetry instrumentation (SDD §6 Tracing row; ADR-10, proposed, needs approval), with Micrometer Tracing and its OpenTelemetry bridge proposed alongside it (new dependencies, OQ-01). Until approved: a platform `TraceContextFilter` (`OncePerRequestFilter`) accepts an incoming W3C `traceparent` or creates one (16-byte trace id and 8-byte span id from `SecureRandom`, lowercase hex, flags `01`), puts `trace_id` and `span_id` in the MDC, returns `traceparent` on the response, and exposes `TraceContext.current()`; `DomainEventPublisher` stores it in `event_publication.trace_context`; the dispatcher starts each listener with the stored trace id and a new span id; a `ClientHttpRequestInterceptor` adds `traceparent` to every provider `RestClient`; `GlobalProblemHandler` reads `traceId` from it. Nothing is exported (no backend, SDD §6). `TraceContextFilter`, with the `X-Correlation-Id` handling of `02-context.md` § 5.5, is registered through a `FilterRegistrationBean` with order `SecurityProperties.DEFAULT_FILTER_ORDER - 1`, so it runs before the Spring Security filter chain and the § 12.6 (a) bodies carry `traceId` and `correlationId`. `TenantJobRunner` opens a new root `TraceContext` (new trace id and span id, flags `01`) and a new correlation id for each tenant run of a job, puts `trace_id`, `span_id`, and `correlation_id` in the MDC, and clears them afterwards; the dispatcher opens a new root context for a listener row whose `trace_context` is NULL.
- **Backend:** open (SDD §6 marker).
- **Sampling:** 100% (SDD §11.4).
- **Context propagation:** W3C Trace Context; the `event_publication.trace_context` column stores the publishing request's `traceparent`, and the dispatcher starts each listener span as a child of it (SDD §11.4).

### Use-case attribute

| Concern | Choice | Source |
|---------|--------|--------|
| Attribute | `use_case` on the server or consumer span of every entry point SDD §7.3 lists for an in-scope use case, and the same key in the log MDC | LLD convention |
| Value | The use case ID as §7.3 writes it, with its BRD key (`REFUNDS/UC-04`). No entry point in this SDD is listed under two use cases, so every value is one ID; the comma-joined form (`REFUNDS/UC-02,REFUNDS/UC-04`) applies if one ever is | SDD [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) |
| Lookup | Match one use case as a whole comma-delimited token, e.g. regex `(^\|,)REFUNDS/UC-04(,\|$)`; never equality or a substring | LLD convention |
| Set by | `@UseCase("[KEY]/UC-NN")` on the controller method, listener, or scheduled method; `UseCaseAspect` (Spring AOP, part of Spring Boot) puts the value into the SLF4J MDC and onto the current span, and clears the MDC afterwards | LLD convention |
| Annotated entry points | `REFUNDS/UC-01`: `ReceiptController.refundableItems`, `RefundRequestController.submit`; `REFUNDS/UC-02`: `RefundRequestController.listOwn`, `RefundRequestController.getOwn`; `REFUNDS/UC-03`: `RefundRequestController.cancel`; `REFUNDS/UC-04`: `BranchRefundRequestController.listBranch`, `BranchRefundRequestController.getBranchDetail`, `RefundDecisionController.decide`, `PayoutRetryJob.run` (payout, `Schedule: payout-retry`); `LOYALTY/UC-01`: `PointsBalanceController.balance`; `LOYALTY/UC-02`: `PointsMovementController.listMovements`, `PointsMovementController.getMovement`, `RefundRequestPaidListener.on`, `RefundRequestRejectedListener.on`, `RefundRequestCancelledListener.on` | Module files § 7.2 ([refund-request](./04-implementation/refund-request.md#controllers), [payout](./04-implementation/payout.md#controllers), [loyalty-points](./04-implementation/loyalty-points.md#controllers)) |
| Not set | Platform endpoints (health, actuator); the five payout and dispute listeners of `refund-request` (SDD §7.3 names their events under Events only); the `customer-notification` and `payout` listeners; `RefundRequestPayoutReturnedListener`; the payout operator endpoints; the provider callbacks; the card dispute intake (`CardPayDisputeNoticeController`, `PayoutDisputeFetchJob`: API-09 is not an SDD §7.3 entry point); `### Workflow:` entry points | LLD convention |
| Frontend | `screen` and `use_case` from the active route's data on every error report and RUM span (`14-frontend.md` § 17.3); a screen-only Workflow route has no `use_case` | LLD convention |

> Confirm: `use_case` is an LLD convention; the SDD does not settle a use case attribute (drop this flag when SDD §11.4 or a 13x Observability section names one).

## 12.9 Configuration

- **Source order:** environment variables > Spring profile properties > defaults (SDD [§11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default)).
- **Secrets:** the hosting environment's secrets manager (open, SDD §6 marker), injected as environment variables at start; never in the repository or logs.
- **Feature flags:** one enablement setting per product, as plain externalized configuration with no feature-flag library (SDD §11.5): `REFUNDS_PORTAL_ENABLED` and `LOYALTY_POINTS_ENABLED`, both off until that product's Prod gate of SDD [§11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default) is met. While a product is off: (1) its endpoints answer 404 `NOT_FOUND` before the controller runs: the platform `ProductEnablementInterceptor` (Spring MVC `HandlerInterceptor`) on the `refund-request` endpoints ([refund-request § 7.2](./04-implementation/refund-request.md#controllers)) and the three payout operator endpoints ([payout § 7.2](./04-implementation/payout.md#controllers)), and `LoyaltyPointsEnabledInterceptor` on the member endpoints and API-05 ([loyalty-points § 7.2](./04-implementation/loyalty-points.md#authorization)); the CardPay callbacks API-02 and API-09 and `PayoutDisputeFetchJob` are never switched off, so a dispute notice received before the Refunds Portal is on is recorded and holds a later payout (SDD API-09 Fallback); (2) its listeners are not dispatched: `ListenerRegistry.isEnabled(listenerId)` maps the `loyalty-points.*` listeners to `LOYALTY_POINTS_ENABLED` and the `refund-request.*`, `payout.*`, and `customer-notification.*` listeners to `REFUNDS_PORTAL_ENABLED` (§ 12.4). `REFUNDS_PORTAL_BRANCHES` lists the branches that use the portal (the pilot group first); a receipt from another branch is refused with `BRANCH_NOT_STARTED`. `LOYALTY_REFUND_REPORTING_START_DATE` is set in the configuration change that switches the second product on; the start fails when both products are on and it is unset ([loyalty-points § Workflow: Loyalty Points switch-on](./04-implementation/loyalty-points.md#workflow-loyalty-points-switch-on)). Behaviour that waits for an open answer is a configuration value with a safe default (`10-operations.md` § 13.1).

> Confirm: a `HandlerInterceptor` runs after the Spring Security filter chain, so a call without a valid token to a switched-off endpoint gets 401 `UNAUTHENTICATED`, not 404; confirm with the team (a servlet filter ordered before the security chain would answer 404 in every case).

## 12.10 Health & Readiness

- **Liveness:** `/actuator/health/liveness`: in-process check only.
- **Readiness:** `/actuator/health/readiness`: the four `DataSource` pools and the migration state of all four schemas; provider and IAM availability is not part of readiness (SDD §17.2, §17.3 Deployment Strategy).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 08-state-and-rules.md | NEXT: 10-operations.md -->
