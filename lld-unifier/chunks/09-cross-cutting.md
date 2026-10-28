<!--
CHUNK: 09
TITLE: Cross-Cutting Concerns
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 12. Cross-Cutting Concerns

> **Convention:** these are platform-wide rules. Per-service overrides live in `04-implementation/<service>.md`, except per-instance resilience settings, which live in the § 12.3 instance table with their source. If a service deviates from another default here, it must justify the override in its own file and link back to this section.

## 12.1 Authentication & Tenant Resolution

| Concern | Choice | Source |
|---------|--------|--------|
| Token issuer | [SDD §6 IAM / AuthN row], realm `[name]` | SDD §6 (CLAUDE.md default, Keycloak on-prem, only when SDD §6 is silent) |
| Token type | JWT (Bearer) | Standard |
| Validation point | API gateway for inbound traffic; for internal HTTP calls the provider (its filter or a sidecar) validates the caller's token and checks the contract's SDD §16 permission token | CLAUDE.md (gateway for edge concerns); SDD §15.1 (internal calls) |
| Internal service-to-service auth | The caller's client-credentials token (`Authorization: Bearer`), with mTLS via [Istio / Linkerd / NGINX] as the transport; in-process port calls check the token at the port (04 § 7.2 Authorization, Kind Port) | SDD §15.1 |
| Tenant ID source | `tenant_id` JWT claim | CLAUDE.md multi-tenancy rule |
| Tenant ID propagation | `X-Tenant-Id` header on internal HTTP calls; in-process calls carry the tenant in the call context | SDD §15.1 (LLD convention when it is silent) |
| Logging policy | `tenant_id` never logged at INFO; never log PII at INFO | CLAUDE.md hard rule |

## 12.2 Idempotency

| Concern | Choice |
|---------|--------|
| Header | `Idempotency-Key` (max 64 chars) |
| Required on | Every write endpoint a client may retry, except the Excluded routes row; every consumer dedupes by `eventId` (`07-event-contracts.md` § 10.4). Money, wallet, notification, and external-provider writes keep their stricter rules (`pattern-rules.md` § Idempotency) (CLAUDE.md) |
| Dedup tuple | `(tenant_id, idempotency_key)` |
| Sameness tuple | A retry is the same request only when every part matches the stored record: the dedup tuple, the caller identity (the principal; on a route with no principal, the identity the route acts on, such as the submitted email), the method and route template, and a fingerprint of the request body (for example SHA-256 of its bytes). With the dedup tuple matched, any other part different returns the Conflict response |
| Client key lifetime | One key per logical submission. The client mints it when the user first submits and reuses it on every retry of that submission: after a timeout, a network drop, or a reload that restores the draft. It mints a new key only when the body changes (the user edits and submits again) or after a final outcome (a success, or a refusal the user must act on). Never one key per attempt. `14-frontend.md` § 17.3c Idempotent Submissions names the pages and client services that send the key |
| Cached-body cap | [N KB request / N KB response, from the SDD when it states one; otherwise an LLD default flagged `> Confirm:`]. The idempotency step buffers at most the request cap to fingerprint the body, and the request cap never exceeds the route's § 12.6a limit. A request body over the cap is refused with 413 `PAYLOAD_TOO_LARGE` (SDD §15.1). A response over the cap is stored as a resource reference that the replay re-reads, never truncated |
| Completion record | Written in the same local transaction as the business write, so a commit makes both visible and a rollback leaves the key retryable. Never in its own transaction (`REQUIRES_NEW`) and never after commit. Only the in-flight marker may commit on its own |
| Pre-lock refusals | Any refusal the idempotency step takes before it holds the key's lock (for example the Cached-body cap) first re-reads the key: a completed record with the same sameness tuple returns the stored response, one in flight returns the In-flight handling response, and only an unknown key is refused. Authentication and tenant resolution run before the re-read, because the sameness tuple needs the caller identity. A refusal by an earlier filter of the § 12.6 Filter chain (body limit, rate limiter) is not a pre-lock refusal of this step |
| Replay after TTL | After the TTL the record is purged and the key is unknown, so the request runs as new. Each Required route's 06 § 9.2 Idempotency field states what that re-run returns (for example 409 `CONFLICT` from a natural unique key, or the existing resource). A side effect that must never repeat (a payment, a notification) also keeps its own guard (a business unique key or the provider's idempotency key) that outlives the TTL |
| Excluded routes | [Routes that take no key, one per line, each with its own duplicate guard: for example multipart uploads guarded by a client upload ID]. Never a money, wallet, notification, or provider write. Enforced by `[IdempotencyScopeTest]`: it walks the framework's route registry and fails when a write route is neither in the idempotency step's scope nor in this row, or when a route in this row is in scope |
| TTL | [The SDD's dedup window (its §15 contract Behaviour row, or the owner's `13x` API Standards) when it states one, with one value per contract where they differ; otherwise 24 hours, an LLD default flagged `> Confirm:`] |
| Storage | `idempotency_record` table per service |
| Conflict response | 409 + RFC 9457 ProblemDetails (`type: idempotency/conflict`) |
| In-flight handling | Wait + retry (caller pattern); server returns 409 immediately |

## 12.3 Resilience (downstream calls)

> **Library:** the resilience library, with its Status, is the row of § 6.3 or of `03a-libraries-and-conventions.md` § 6.5.1; this section gives its configuration only. **Scope:** HTTP and broker calls; in-process port calls (06 § 9.6) take no timeout, retry, circuit breaker, or bulkhead. Every outbound client is a row of `12-performance.md` § 15.4c Outbound Clients, which holds its connect and read timeouts; for a client an instance below wraps, that row names the instance, and the call timeout and retries are here.

| Pattern | Default config | Override mechanism |
|---------|----------------|-------------------|
| Timeout | Call timeout [N s] (connect and read: 12 § 15.4c) | Per-call annotation |
| Retry | 3 attempts, exponential backoff (100ms base, 2x multiplier, 1s max), with jitter | Per-call annotation |
| Circuit breaker | 50% failure rate over 20-call sliding window, 30s open state | Per-instance `CircuitBreakerConfig` bean |
| Bulkhead | Per downstream provider, 10 concurrent calls | Per-provider `BulkheadConfig` |

**Instances:** one row per instance of that library; `Default` where a cell equals the defaults above.

| Instance | Caller (service, API ID) | Timeout | Retry | Circuit breaker | Bulkhead | Source |
|----------|--------------------------|---------|-------|-----------------|----------|--------|
| `[instanceName]` | `[service-a]`, [API-NN](../sdd-[sdd-slug]/11-api-contracts.md#[api-nn-heading-slug]) | Default | Default | [50% over 10 calls, 60s open] | Default | [SDD §17.X Integrations / LLD default] |

> **Convention:** retries on idempotent calls only. Non-idempotent calls (without an idempotency key) must not be retried automatically.

## 12.4 Outbox Pattern (mandatory for side effects that must follow a state change)

- **Scope:** every side effect that must follow a state change and must not be lost: integration events on the broker (07 § 10.1-10.5), writes to an external provider, and the in-process domain events of 07 § 10.6 whose SDD §14.10 Delivery line is durable (the outbox is then their publication log). In-memory § 10.6 events are published in process at their transaction phase and use no outbox.
- **Table:** `outbox` per service schema (see `05-data-model.md`). When the SDD names the outbox table, the publication log, or their columns (in a `13x` DB Modeling, for example `outbox_event.published_at`, or for the publication log of a durable §14.10 Delivery line in SDD §11.1), use the SDD names everywhere in this LLD; `outbox` and `processed_at` apply only when it names none.
- **Writer:** inserts the outbox row in the same local transaction as the aggregate write, so both commit or neither does. The write path never delivers a side effect in scope directly (a Kafka send, a provider call), inside the transaction or after commit.
- **Publisher:** separate scheduled job with one active instance per service (scheduler lock or leader election; row locks such as `FOR UPDATE SKIP LOCKED` instead when the SDD requires every replica to be able to run it, with the per-key order rule stated), every 1s, batch up to 100 rows, oldest first. A second concurrent publisher would re-send rows and break per-key order.
- **Processed only after acknowledgement:** the publisher waits up to `OUTBOX_SEND_TIMEOUT_MS` for the target's acknowledgement (the broker's `acks=all`, the provider's success response, or every listener's commit) and only then sets `processed_at`. A failed or timed-out send leaves `processed_at` NULL, so the next poll retries the row; the poll stops at that row to keep per-key order.
- **At-least-once delivery:** if the target acknowledges but the `processed_at` update fails (database error, or a crash before the update), the next poll delivers the row again. A failed or timed-out send may also have reached its target. The payload, including `eventId`, is fixed when the row is written, and every receiver dedupes the re-send (broker consumers: `07-event-contracts.md` § 10.4).
- **Monitoring:** `OutboxBacklog` alert on backlog size and oldest-row age (`10-operations.md` § 13.7).

## 12.5 Saga Pattern (cross-service transactions)

- **Default style:** choreography (each service reacts to events) per CLAUDE.md.
- **When to use orchestration:** flows with >3 steps, conditional branching, or required central visibility. Orchestrator-owning service named in `04-implementation/<orchestrator>.md`.
- **Compensation:** every saga step has a documented compensation action. Compensation actions are themselves idempotent.
- **Failure handling:** failed compensation triggers an alert; manual intervention via runbook.

## 12.6 Error Model (RFC 9457 ProblemDetails)

| Field | Type | Notes |
|-------|------|-------|
| `type` | string (URI) | Stable, dereferenceable error type identifier |
| `title` | string | Human-readable summary |
| `status` | int | HTTP status code |
| `detail` | string | Specific to this occurrence |
| `instance` | string | The path that produced the error |
| `errorCode` (extension) | string | From an SDD: the SDD §15.1 standard code or the contract's domain code, verbatim (`VALIDATION_FAILED`, `[DOMAIN_CODE]`); from code with no SDD: the code the service returns |
| `traceId` (extension) | string | OpenTelemetry trace ID |
| `errors` (extension) | array | For validation failures: list of field-level errors. Always an array, never a joined string |
| `reason` (extension) | string | Only where a 06 § 9.2 block declares it, with its full value list there (06 § 9.2 Convention, Distinct outcomes) |

**Base exception:** `ServiceException` (CLAUDE.md). Every business exception extends it and carries an error code.

**Global handler:** `@RestControllerAdvice` translates exceptions to ProblemDetails.

### Filter chain

<!-- The filters of 03 § 6.2a Runtime Roles, in the order its Filters (in order) column gives; this table adds what each one returns. Never set an order here. 06 § 9.1 Status Codes cites it; never repeat it there. Drop a row the SDD and code do not have. -->

| Order (03 § 6.2a) | Filter or interceptor | Runs on | Can return (status, `errorCode`) | Source |
|-------------------|-----------------------|---------|----------------------------------|--------|
| 1 | Correlation and trace context | Every route | None | § 12.7, § 12.8 |
| 2 | Tenant resolution | Every route but public ones | 401 `UNAUTHENTICATED` or 403 `FORBIDDEN` as § 12.1 states | § 12.1 |
| 3 | Body limit (§ 12.6a) | Every route that takes a body | 413 `PAYLOAD_TOO_LARGE`, 413 `PART_TOO_LARGE` (SDD §15.1) | SDD §15.1 |
| 4 | Origin or CSRF check, only when browser clients use cookie or session auth | [Cookie-authenticated routes] | 403 `ORIGIN_REFUSED` | SDD §15.1 |
| 5 | Authentication and session | Every route but public ones | 401 `UNAUTHENTICATED` | § 12.1 |
| 6 | Rate limiter | [Routes] | 429 `RATE_LIMITED` | SDD §15.1 |
| 7 | Idempotency (§ 12.2) | Writes in its scope | 409 `CONFLICT`; 413 `PAYLOAD_TOO_LARGE` (Cached-body cap) | § 12.2 |
| 8 | Permission check | Every route with a permission token | 403 `FORBIDDEN` | 06 § 9.3 |
| - | Provider call (a § 12.3 instance) | Routes whose handler calls a provider | 503 `UNAVAILABLE`, 504 `UPSTREAM_TIMEOUT` | § 12.3 |

> **Convention:** an endpoint's 06 § 9.1 Status Codes cell is its own outcomes plus every status a row of this table returns on its path. A new filter is a new row here, and every affected Status Codes cell gains its statuses. The run order and the role or profile that loads each filter are in `03-architecture.md` § 6.2a Process and Profile Wiring, never restated here.

### Framework and container errors

<!-- Every error the handler advice does not see by default, mapped to the same envelope. Name the framework's exception or hook only as an example. -->

| Origin | Status | `errorCode` | How it reaches the envelope |
|--------|--------|-------------|------------------------------|
| No route matches | 404 | `NOT_FOUND` | [The framework's no-handler exception, handled by the global handler] |
| Method not allowed | 405 | [The SDD §15.1 code; when §15.1 has none, an open item up to the SDD] | [Global handler] |
| Unsupported or missing media type | 415 | [The SDD §15.1 code; when §15.1 has none, an open item up to the SDD] | [Global handler] |
| Unreadable body, type mismatch, or validation | 400 | `VALIDATION_FAILED` with `errors[]` | [Global handler, one mapping for every validation exception] |
| Multipart: part too large, too many parts, malformed | 413 / 400 | `PART_TOO_LARGE` / `VALIDATION_FAILED` | [Global handler, or the § 12.6a filter] |
| Downstream unavailable or timed out | 503 / 504 | `UNAVAILABLE` / `UPSTREAM_TIMEOUT` | [Global handler, from the § 12.3 instance's exception] |
| Raised before the framework's handler (in a filter or by the container, for example a servlet filter exception or a connector reject) | [The row's status] | [Its code] | [One shared envelope writer that every filter calls, and the container's error path mapped to an endpoint that renders the envelope, for example an error controller] |

> **Convention:** no response of any status leaves the service in another shape. `[ErrorEnvelopeTest]` sends one request per row above and asserts the envelope, its `type` and its `errorCode`.

## 12.6a Request Body Limits

<!-- From SDD §15.1 (its Request body policy row and its `PAYLOAD_TOO_LARGE` and `PART_TOO_LARGE` standard error codes), the contract's Request body limit Behaviour row, and the owner's 13x List of APIs notes. A value no source gives is an LLD default flagged "> Confirm:". -->

| Concern | Choice | Source |
|---------|--------|--------|
| Default cap | [N KB] for every route that takes a body, checked against `Content-Length` first and counted while a chunked body streams | [SDD §15.1 / LLD default] |
| Per-route limits | Only routes the SDD lists as exceptions (a contract's Request body limit Behaviour row, or a note on a 13x List of APIs row). The owning module declares each one in one registry that the body limit filter reads ([a handler annotation or a route table in configuration]), and the route's 06 § 9.2 Request body field names the limit. A route outside the registry gets the default | [SDD §15 Behaviour row / 13x List of APIs] |
| Multipart routes | [Route: max part size, max parts, max request size, allowed media types], one line per route. Multipart parsing is on only for these routes, never globally, so no other route parses an anonymous multipart body | [SDD §15.1 Request body policy / §15 Behaviour row] |
| Filter order | Its place in the 03 § 6.2a filter order: after correlation, before any filter or framework step that reads or buffers the body (idempotency, request logging, multipart parsing). The container's own body limit is set at or above the largest route limit, so the container never refuses first in another shape | LLD convention |
| Refusal | The SDD §15.1 rows, status and `errorCode` verbatim: `PAYLOAD_TOO_LARGE` for the request, `PART_TOO_LARGE` for one part. When §15.1 has no such row, raise an open item up to the SDD and never invent the code | SDD §15.1 |
| Client discovery | A configurable limit reaches the client through [a config read endpoint listed in 06 § 9.1, or a field of an existing response]. The client never hard-codes a limit that the server can change | [SDD / LLD proposal flagged `> Confirm:`] |

## 12.7 Logging

| Concern | Choice |
|---------|--------|
| Format | JSON (structured) |
| Mandatory fields | The SDD §11.4 Logging fields, verbatim; when it names none: `ts`, `level`, `service`, `traceId`, `spanId`, `correlationId`, `event`, `attrs`. No PII at INFO; the tenant ID only at DEBUG (Level for tenant context). Each has a row in the Mandatory fields table below |
| Never logged | [Secrets, tokens, passwords, one-time codes, and PII at INFO]. The list applies under every profile and flag, local and dev included; no debug or local flag turns it off |
| Masking | `[LogMaskingComponent]`: [a mechanism the chosen encoder calls, for example a field masker or JSON-generator decorator of that encoder], never a mechanism the encoder skips (for example a pattern-layout converter under a JSON encoder). It masks the Never logged list and is a buildable unit with this row as its anchor. Source: the encoder's § 6.3 row |
| Port call line | Each call through a port (an in-process port of 06 § 9.6, or an outbound client of `12-performance.md` § 15.4c) logs one line on completion: `port`, `outcome` (`success` / `failure`), `failureCategory` from a closed list ([`timeout`, `unavailable`, `rejected`, `invalid_response`, `unauthorized`, `rate_limited`, `internal`]), `durationMs`. A new category is a change to this row |
| Use-case field | `use_case`: the keyed BRD use case ID(s) of the entry point handling the request (`REFUNDS/UC-04`), from the log MDC (§ 12.8). Absent on platform endpoints. |
| Level for tenant context | DEBUG (never INFO per CLAUDE.md) |
| Level for `use_case` | Any level, INFO included: a use case ID is not tenant data or PII |
| Aggregation | [Loki / Elasticsearch / other] |
| Hot retention | 30 days |
| Cold retention | 1 year |

**Mandatory fields:** one row per mandatory field, in the order of the row above, then `use_case` (Use-case field row). Meaning follows SDD §11.4.

| Field | Source | Set/cleared by | Value on framework lines |
|-------|--------|----------------|--------------------------|
| `ts`, `level` | The encoder, per line (UTC) | The encoder | Always set |
| `service` | Static configuration (the deployable name) | The encoder, at start-up | Always set |
| `traceId`, `spanId` | The current span | The tracing library's log context bridge: set when a span starts, removed when it ends | Set inside a request or message; absent on start-up and shutdown lines |
| `correlationId` | The correlation header, or a new UUID when absent | The correlation filter (§ 12.6 Filter chain): set on entry, removed on exit | [Set inside a request; `-` elsewhere] |
| `use_case` | The `@UseCase` value (§ 12.8) | The § 12.8 aspect | Absent |
| `event`, `attrs` | The log call | Each call site | [The framework's logger name and message] |

> **Convention:** whoever sets a log context key removes only the keys it set, and restores a value it replaced, so an inner scope never drops an outer key. Every SDD §11.4 field has a row; a field whose source the LLD cannot name is an open item up to the SDD (18), never dropped.

## 12.8 Tracing

- **Library:** the tracing library, with its Status, is the row of § 6.3 or of `03a-libraries-and-conventions.md` § 6.5.1; this section gives its use only.
- **Backend:** [Tempo / Jaeger / other].
- **Sampling:** 100% in dev/sit, 10% probabilistic in prod (override with `traceparent` header for forced trace).
- **Context propagation:** W3C Trace Context (`traceparent`, `tracestate` headers).

### Use-case attribute

<!-- Derive-from-SDD with a brd-unifier BRD only (sdd-to-lld.md § Use-case traceability). With no source BRD, write "Not applicable - no source BRD." Flag the convention "> Confirm:" unless SDD §11.4 Observability or a 13x Observability section already settles it. -->

| Concern | Choice | Source |
|---------|--------|--------|
| Attribute | `use_case` on the server or consumer span of every entry point SDD §7.3 lists for an in-scope use case, and the same key in the log MDC | [LLD convention / SDD §11.4] |
| Value | The use case ID as §7.3 writes it, with its BRD key (`REFUNDS/UC-04`). An entry point §7.3 lists under several use cases carries all of them in one string, in §7.3 order, joined by commas without spaces (`REFUNDS/UC-02,REFUNDS/UC-04`) | SDD §7.3 |
| Lookup | Match one use case as a whole comma-delimited token, e.g. regex `(^\|,)REFUNDS/UC-04(,\|$)`; never equality (misses shared entry points) or a substring (it also matches a longer ID that contains the one searched for) | LLD convention |
| Set by | A project annotation, `@UseCase("[KEY]/UC-NN")`, on the controller method, listener, or scheduled method; one aspect puts the value into the SLF4J MDC and onto the current span (OpenTelemetry `Span.current().setAttribute`), and afterwards removes only the `use_case` key it set (§ 12.7 Mandatory fields) | LLD convention |
| Not set | Platform endpoints (health, actuator, sign-in); an endpoint the LLD proposes that SDD §7.3 does not list | LLD convention |
| Frontend | `screen` and `use_case` from the active route's data on every error report and RUM span (`14-frontend.md` § 17.3); `use_case` joins the route's `useCases` in the Value form when present; a screen-only Workflow route has no `use_case` | LLD convention |

> Confirm: `use_case` is an LLD convention; the SDD does not settle a use case attribute (drop this flag when SDD §11.4 or a 13x Observability section names one).

## 12.9 Configuration

- **Source order:** environment variables > Spring profile properties > defaults.
- **Secrets:** [Vault / AWS Secrets Manager / Kubernetes Secrets - pick one] - never in env vars committed to git.
- **Feature flags:** [system + naming convention].

## 12.10 Health & Readiness

- **Liveness:** `/actuator/health/liveness` - fast in-process check (no DB).
- **Readiness:** `/actuator/health/readiness` - checks DB connectivity, Kafka cluster reachable, schema migrations complete.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 08-state-and-rules.md | NEXT: 10-operations.md -->
