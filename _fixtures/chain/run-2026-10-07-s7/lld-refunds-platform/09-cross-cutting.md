<!--
CHUNK: 09
TITLE: Cross-Cutting Concerns
PROJECT: Refunds Platform
VERSION: 1.4
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 12. Cross-Cutting Concerns

## 12.1 Authentication & Tenant Resolution

Follow [SDD §11.2 / §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md) and [§15.1](../sdd-refunds-platform/11-api-contracts.md). Gateway validates JWT tenant for user routes, resolves host tenant for public routes, and delegates provider signature/credential validation to the inbound adapter. Port adapters check fixed module identities and exact source permissions. No in-process mTLS, JWT hop, or X-Tenant-Id header is added. Outbound provider adapters carry tenant context in the provider's agreed form.

Staff identity and assignments consume the existing Retail IT source in [SDD INT-05](../sdd-refunds-platform/08-integrations.md#12-integrations). Keep the first-session refresh, fifteen-minute schedule, last-synced fallback and source alert; no new staff administration API is introduced. Staff-data processing uses the single [SDD §11.6 home](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default), including decision actor ids.

## 12.2 Idempotency

User REST writes use Idempotency-Key, max 64 characters; tenant/key is the storage tuple, with canonical method/path/body hash and first status/body. Source TTL is 24 hours. Lock the tuple before processing; same key/hash replays, changed hash returns 409 CONFLICT. In-flight conflicts return 409 for a retry with the same key. An application advisory lock or equivalent bounded operation guard serializes calls spanning external effects, without adding a fictitious status column to the SDD table. Monetary state + successful replay response commit together. Provider inbound business deduplication outlives the 24-hour request cache where its source unique key does. API-14 is the explicit exception: message.message_key / status / last_error_code / ended_at replay its first outcome for the message retention period. It neither needs an idempotency_record table nor adds a new contract error.

> Confirm: cross-system operation reservation uses a bounded per-key advisory lock plus source reconciliation; verify lock release, crash recovery and outcome persistence without holding a DB transaction over provider I/O.

## 12.3 Resilience (downstream calls)

Use Resilience4j on external calls only. Worker scheduling owns long retries, so client retry must not multiply worker attempts. Read-only API-12/13 and code port API-14 have no Resilience4j wrapper; the actual API-05 provider path owns its deadline and bulkhead.

| Pattern | Default config | Override mechanism |
| --- | --- | --- |
| Timeout | No unsafe universal production timeout; source budgets per instance | Typed adapter configuration |
| Retry | No immediate retry; source worker schedule with exponential backoff and jitter | Worker schedule, not nested client retry |
| Circuit breaker | Proposed 50% of last 20 calls, open 60 seconds | Per instance; codes must fail promptly |
| Bulkhead | Proposed ten concurrent calls per external provider path | Separate code/event sends |

| Instance | Caller (service, API ID) | Timeout | Retry | Circuit breaker | Bulkhead | Source |
| --- | --- | --- | --- | --- | --- | --- |
| receiptLookup | refund-requests, API-01 | 2 seconds total | None | Default | Default | SDD INT-03 / 13b |
| posItemsNotice | refund-requests, API-02 | Unresolved upstream | Worker 1 minute, x2, max 30 minutes, jitter | Default | Default | SDD 13b / INT-03 |
| payoutProvider | payouts, API-03 | Unresolved upstream | Worker 5 minutes, x2, max 30 minutes, jitter, stored 24-hour deadline | Default | Default | SDD 13c / INT-01 |
| codeSend | notifications, API-05 | Remaining shared 2-second command deadline | None | Default, fail immediately when open | Separate ten slots | SDD INT-02 / 13d; bulkhead proposal |
| eventMessage | notifications, API-05 | Unresolved upstream | Worker 1 minute, x2, max 30 minutes, jitter, 24-hour give-up | Default | Separate ten slots | SDD INT-02 / 13d |
| branchAssignments | refund-requests, API-06 | Unresolved upstream | Next 15-minute refresh | Default | Default | SDD INT-05 / 13b |
| keycloakAdmin | customer-accounts, `KeycloakIdentityProviderAdapter` (IdentityProviderPort; platform IAM, no API ID) | 500 ms create; remaining operations unresolved | No immediate request retry; source reconciliation jobs | Default | Default | SDD 13a / ADR-07 |

> Confirm: default circuit-breaker and bulkhead values are LLD proposals for unpinned instances, not added SDD facts; test their saturation and fast-failure effect on the source budgets.
> TODO: Verify production provider timeouts for API-02, API-03, event API-05 and API-06 at SDD §12; no invented production values.
> TODO: Verify Keycloak confirmation/reset/admin time budgets at SDD 13a; the stated 500 ms value covers creation, not every operation.

## 12.4 Outbox Pattern (mandatory for side effects that must follow a state change)

Source [SDD §11.1](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default). platform.event_publication is the durable publication registry. Aggregate and registry append share one transaction; no REQUIRES_NEW append. Listener writes module work and inbox atomically before completing delivery. Module workers call providers after commit; only positive provider acknowledgement completes that work. Unknown send outcome preserves payload and business identity. publication-resubmit runs once/minute under DB job lock for entries older than five minutes, no restart resubmit; completed publications expire after seven days. After ten failures park inbox, complete publication and alert. A listener identity change ships a migration for incomplete deliveries.

## 12.5 Saga Pattern (cross-service transactions)

Refund decision -> payout -> refund outcome -> notification/points is source choreography. No distributed 2PC. Success flows forward; payout refusal retries until source deadline, final failure reports PAYOUT_FAILED, and a late success records/pages without reversing status. Account/Keycloak compensation disables/deletes the orphan user as SDD 13a states. Do not invent refund reversal, points reversal or automatic staff approval as a compensation. Steps live in their modules' §7.3.

## 12.6 Error Model (RFC 9457 ProblemDetails)

Global RestControllerAdvice maps ServiceException to type, title, status, detail, instance, errorCode, traceId and field errors. errorCode is the SDD standard/domain value verbatim; type is a stable URI (proposed urn:refunds-platform:problem:<category>). User-visible detail states the remedy and suppresses internal codes, stack traces, tenant ids and provider payloads. Port errors remain typed exceptions; controller advice maps only HTTP boundaries.

> Confirm: proposed problem type URNs are a project convention; agree stable identifiers with the implementer without changing the SDD errorCode.

## 12.7 Logging

JSON stdout -> Loki. Mandatory SDD fields: timestamp, level, module, correlation_id, trace_id, span_id, event. Add use_case from MDC for traced entry points; absence on platform work is meaningful. No tenant_id or PII at INFO; DEBUG tenant diagnostics require restricted access. Log provider outcome classes, not addresses, codes, payment references or full messages. Retention stays in SDD §11.4.

## 12.8 Tracing

OpenTelemetry -> Tempo; W3C trace context travels where providers accept it. Instrument HTTP, ports, listeners and workers. Restore captured correlation/tenant/span context around each listener, rather than depending on request thread locals.

### Use-case attribute

Use use_case in server/consumer spans and MDC. @UseCase values follow SDD §7.3, including Event: RefundPaid in loyalty-points and Schedule: waiting-requests-summary. Shared values preserve §7.3 order, joined by commas with no spaces. Match whole comma-delimited tokens, never substring/equality. Aspect saves previous MDC, sets value, and restores it in finally, including failures. Unannotated jobs/health/brokered sign-in start with no stale use_case. Frontend error/RUM telemetry reads the deepest active route's screen and joins its useCases; screen-only report routes have no use_case.

> Confirm: @UseCase, use_case MDC/span and frontend route data are LLD conventions; the source SDD does not settle them. Test context restoration with a reused worker thread.
> TODO: Trace sampling rate is unspecified in SDD §11.4 - verify there; use deterministic full sampling in test fixtures only.

## 12.9 Configuration

Typed configuration records; environment overrides profile values then defaults. Helm contains non-secret settings; Vault injects secrets at startup. No hot reload or feature flags are added. Job enable settings follow SDD §11.5. Source date rules are separate from display locale.

## 12.10 Health & Readiness

Liveness checks in-process health only; readiness requires reachable database, completed migrations and initialized required startup secrets. Provider outages raise their own source alerts and never restart healthy replicas into a retry storm. One deployable probe, not five independently deployed services. Proposed actuator paths are /actuator/health/liveness and /actuator/health/readiness.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 08-state-and-rules.md | NEXT: 10-operations.md -->
