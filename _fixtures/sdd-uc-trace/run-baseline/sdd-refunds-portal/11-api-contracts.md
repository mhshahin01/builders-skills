<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 02 (ecosystem: IAM, gateway), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (services), 12 (roles and permission tokens), 13a+ (per-service API lists)
PART OF: SDD - Refunds Portal
PURPOSE: The API contract registry for every synchronous integration: module-to-module calls (in-process port contracts in this modular monolith), outbound calls from a module to an external system, and inbound calls from an external system into a module (callbacks). Each contract states what both sides need to implement the same contract with zero drift.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each per-service chunk (13x) lists the endpoint in its "List of APIs" with the API ID and links here; it never restates the headers, body, or error codes. Event contracts stay in chunk 10; roles and permission tokens stay in chunk 12 and are referenced here verbatim.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation. Provider-owned fields (URI, headers, body, responses, error codes, auth scheme) are written as `TBD` with the marker `**[TBD - EXTERNAL: ...]**`, never invented. Our-side policy (timeout, retries, circuit breaker, fallback, where credentials are stored) comes from §12 and is filled.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous integration API (`API-NN`). The only module-to-module contract is an in-process port (the architecture is a modular monolith, ADR-01), so it has an interface and operation instead of a URI and headers. External contracts are placeholders marked `TBD - external` for the user to complete from the provider's documentation.
>
> **What this chunk is not.** It does not list the client-facing endpoints that only `refunds-portal-web` calls (those are in §17.1 List of APIs and in the OpenAPI specs, §21). It does not hold event contracts (§14, chunk 10).

---

## 15.1 Contract Conventions (platform defaults)

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 AP-07, ADR-05 |
| Transport | TLS 1.2 or higher on every hop that leaves the cluster; in-cluster TLS open in §11.6; in-process ports have no transport | §6, §11.6 |
| Internal authentication | In-process ports: none at runtime, because the callers are modules of the same deployable and the trust boundary is the process (ADR-01). Client calls into the backend: OIDC bearer JWT issued by Keycloak, validated by the gateway and by the backend (ADR-06). | §6 IAM row, §11.6 |
| Authorization | Permission tokens from §16, verbatim, on every client-facing endpoint (§17.1 List of APIs). In-process ports carry no permission token: they are called by module code after the user's permission was checked at the entry point, or by schedulers and event handlers with no user. External contracts use the provider's scheme (`TBD - external`). | §16 (chunk 12) |
| Tenant context | Client calls: the gateway resolves the tenant claim and forwards `X-Tenant-Id`, which the backend cross-checks against the token. In-process ports: an explicit `tenantId` parameter on every operation. External calls: the tenant selects the per-tenant credentials and account identifiers (provider field names `TBD - external`). | §11.2 |
| Correlation | `X-Correlation-Id` on every HTTP request and response, also sent to providers when they accept it; W3C `traceparent` for tracing; in-process calls share the current trace context | §11.4 |
| Idempotency | `Idempotency-Key` required on every client write (each one touches money or triggers messages) and sent on every provider write the provider supports: the payout id for CardPay, the dispatch id for MsgHub | §9 AP-02, platform doctrine |
| Content type | `application/json`; errors as `application/problem+json` | §11.7 |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes below, §11.7); in-process ports raise typed exceptions that carry the same `errorCode` values | §11.7 |
| Resilience | Timeout, retries with exponential backoff and jitter, circuit breaker, and bulkhead per provider adapter; values per contract, from §12 | §11, §12 |
| Sync chain depth | At most one synchronous hop: a client call reaches the backend and makes at most one provider call (API-01); a dispatcher makes one provider call per attempt; API-02 is a leaf in-process call that calls nothing further | §9 principles, platform doctrine |

### Standard headers

| Header | Direction | Required | Format / example | Purpose |
|--------|-----------|----------|------------------|---------|
| `Authorization` | Request | Yes (client calls) | `Bearer <token>` | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| `X-Correlation-Id` | Request, Response | Yes | UUID | End-to-end correlation |
| `X-Tenant-Id` | Request | Yes, set by the gateway from the token claim | UUIDv7 | Tenant context |
| `Idempotency-Key` | Request | On every client write | UUID | Safe retries |
| `traceparent` | Request | Yes | W3C trace context | Distributed tracing |

### Standard error codes

| HTTP status | `errorCode` | Meaning | Retryable | Consumer action |
|-------------|-------------|---------|-----------|-----------------|
| 400 | `VALIDATION_FAILED` | Request fails schema or field validation | No | Fix the request; `errors[]` lists each field |
| 401 | `UNAUTHENTICATED` | Missing or invalid credentials | No (refresh token once) | Obtain a new token, retry once |
| 403 | `FORBIDDEN` | Caller lacks the permission token | No | Do not retry; raise an alert |
| 404 | `NOT_FOUND` | Resource does not exist for this tenant | No | Handle as a business outcome |
| 409 | `CONFLICT` | State conflict or idempotency key reused with a different body | No | Re-read state; never reuse a key for a new request |
| 422 | `BUSINESS_RULE_VIOLATION` | Valid request that breaks a domain rule | No | Surface the domain error |
| 429 | `RATE_LIMITED` | Caller exceeded its limit | Yes, after `Retry-After` | Back off |
| 500 | `INTERNAL_ERROR` | Unexpected provider failure | Yes (idempotent calls only) | Retry with backoff, then circuit-break |
| 503 | `UNAVAILABLE` | Provider temporarily unavailable | Yes | Retry with backoff, then fallback |
| 504 | `UPSTREAM_TIMEOUT` | Provider's own dependency timed out | Yes (idempotent calls only) | Retry with backoff, then fallback |

---

## 15.2 Contract Index

| API ID | Operation | Consumer (caller) | Provider (callee) | Type | Method & URI | Integration ref | Use case ref | Status |
|--------|-----------|-------------------|-------------------|------|--------------|-----------------|--------------|--------|
| API-01 | Look up a receipt | refund-requests | Point-of-Sale Records | External outbound | TBD | INT-03; §17.1 Integrations | UC-01 | TBD - external |
| API-02 | Find the customer contact of a refund request | notifications | refund-requests | Internal (in-process) | Not applicable: `CustomerContactQuery.findContact` | §17.1 and §17.3 Integrations | UC-01, UC-03, UC-04 | Flagged (see §15.5) |
| API-03 | Request a payout | payouts | CardPay Ltd | External outbound | TBD | INT-01; §17.2 Integrations | UC-04 | TBD - external |
| API-04 | Receive a payout result | CardPay Ltd | payouts | External inbound | TBD | INT-01; §17.2 Integrations | UC-04 | TBD - external |
| API-05 | Send an email or SMS message | notifications | MsgHub | External outbound | TBD | INT-02; §17.3 Integrations | UC-01, UC-03, UC-04 | TBD - external |
| API-06 | Query a payout's status | payouts | CardPay Ltd | External outbound | TBD | INT-01; §17.2 Integrations | UC-04 | TBD - external |

---

## 15.3 Contract Details

### API-01: Look up a receipt (refund-requests -> Point-of-Sale Records)

- **Type:** External outbound
- **Purpose:** refund-requests reads a receipt's lines, amounts, branch, and purchase date to decide what can be refunded (UC-01 steps 2 and 5; INT-03; §17.1 Integrations).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Retail IT Point-of-Sale records API documentation: URI, version, headers, request parameters, response body (lines with line ids, amounts and currency, branch id, purchase timestamp, and the original payment reference if available), error codes (including "receipt not found"), and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side also sends `X-Correlation-Id` if accepted |
| Request body | TBD; our side supplies the receipt number and the tenant's account identifier |
| Responses | TBD |
| Error codes | TBD (map "not found" to `RECEIPT_NOT_FOUND`; timeouts, 5xx, and an open circuit to `PURCHASE_RECORDS_UNAVAILABLE`, §17.1) |
| Credentials storage | Per-tenant secret in the secrets manager (§6) |
| Timeout, retries, circuit breaker | From §12 INT-03: timeout **[NEEDS CLARIFICATION: value inside the customer-facing latency target of §18]**; at most one retry on a timeout or 503, with jitter; circuit breaker; bulkhead |
| Fallback when unavailable | Fail fast with `PURCHASE_RECORDS_UNAVAILABLE` and an actionable message; no cached receipts (§12 INT-03) |
| Source document | TBD (link the Retail IT documentation once supplied) |

---

### API-02: Find the customer contact of a refund request (notifications -> refund-requests)

- **Type:** Internal (in-process)
- **Purpose:** notifications resolves the customer's email address, mobile number, and locale for a refund request's messages, so contact data never travels in events (NFR-04; UC-01 step 6, UC-03 step 5, UC-04 step 7 and A2; §17.1 and §17.3 Integrations).
- **Status:** Flagged (§15.5 #1)

**Operation**

| Interface | Operation | Provider module | Published in | Call style |
|-----------|-----------|-----------------|--------------|------------|
| `CustomerContactQuery` | `findContact` | refund-requests | The module's published API package | Synchronous, in-process, read-only |

**Security and auth**

| Aspect | Value |
|--------|-------|
| Transport | None (in-process call) |
| Authentication | None at runtime; only notifications may depend on this port, checked by the module-boundary tests (ADR-01) |
| Authorization | Not applicable: no user context; the caller is the notifications dispatcher (§15.1) |
| Tenant context | `tenantId` parameter; the provider filters by it and returns `NOT_FOUND` across tenants |
| Data classification | The response is PII: never logged, never persisted by the caller (§17.3 Constraints) |

**Request parameters**

| Name | Type | Required | Constraints | Description |
|------|------|----------|-------------|-------------|
| `tenantId` | UUIDv7 | Yes | - | Tenant of the refund request (the event's `tenant_id`) |
| `refundRequestId` | UUIDv7 | Yes | - | The refund request (the event's `aggregate_id`) |

**Response (`CustomerContact` record)**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | string | No | Email address | Customer email; absent when none is on file (pii) |
| `mobileNumber` | string | No | E.164 | Customer mobile number; absent when none is on file (pii) |
| `locale` | string | Yes | BCP 47 language tag | Language of the message templates **[NEEDS CLARIFICATION: source of the customer's language (account setting, request form, or tenant default)]** |

**Errors raised** (typed exceptions carrying the `errorCode`)

| `errorCode` | When | Retryable | Caller action |
|-------------|------|-----------|---------------|
| `NOT_FOUND` | No refund request with that id in the tenant | No | Fail the dispatch and alarm (§17.3) |
| `INTERNAL_ERROR` | Unexpected failure, for example the database is unavailable | Yes | Retry the dispatch with backoff |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | Read-only, naturally idempotent |
| Timeout (consumer side) | Not applicable (in-process); bounded by the deployable's database query timeout |
| Retries and backoff | None inside the call; the caller's dispatch retry covers transient failures |
| Circuit breaker / bulkhead | Not applicable |
| Rate limit | Not applicable |
| Pagination | Not applicable |
| Fallback when unavailable | The dispatch is rescheduled (§17.3) |

**[NEEDS CLARIFICATION: confirm this port, and how refund-requests captures the contact snapshot at submission (verified account claims or the request form), which depends on the customer identity model (§3 assumption 5).]**

---

### API-03: Request a payout (payouts -> CardPay Ltd)

- **Type:** External outbound
- **Purpose:** payouts asks CardPay to refund the approved amount to the original card, reusing the payout id as the idempotency key on every attempt (UC-04 step 6; INT-01; ADR-08; §17.2 Integrations).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay API documentation: URI, version, headers, request body (how the original payment is referenced), idempotency-key support, responses (synchronous confirmation or asynchronous acceptance), error codes with their retryability, and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the payout id as the idempotency key if CardPay accepts one |
| Request body | TBD; our side supplies the payout id, the amount with currency, the original payment reference, and the refund request's reference number |
| Responses | TBD |
| Error codes | TBD (map each CardPay error to a retryable or permanent `failure_code`, §17.2) |
| Credentials storage | Per-tenant secret in the secrets manager (§6) |
| Timeout, retries, circuit breaker | From §12 INT-01: timeout **[NEEDS CLARIFICATION: per-attempt value]**; exponential backoff with jitter under the same key; status check through API-06 before a retry after a timeout, when offered; circuit breaker; bulkhead |
| Fallback when unavailable | The request stays Approved and the payout is retried; the branch manager is told when the escalation window passes (UC-04 E1) |
| Source document | TBD (link the CardPay documentation once supplied) |

---

### API-04: Receive a payout result (CardPay Ltd -> payouts)

- **Type:** External inbound
- **Purpose:** CardPay reports the final result of a payout it accepted asynchronously (UC-04 step 7 and E1; INT-01; §17.2 Integrations). The contract exists only if CardPay reports results by callback (§15.5 #2).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay callback documentation: whether callbacks exist, the delivery and retry semantics, the signature or mutual-TLS scheme, headers, body (payout reference, result, failure reason, provider event id), and the expected acknowledgement.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD; our endpoint lives under `/v1/` on the backend and is routed by the gateway without IAM token validation, because CardPay authenticates with its own scheme |
| Version | TBD |
| Authentication | TBD (provider signature or mutual TLS) |
| Request headers | TBD |
| Request body | TBD; our side needs the payout id or provider reference, the result, the failure reason, and a provider event id for deduplication |
| Responses | TBD (acknowledgement semantics that stop CardPay's retries) |
| Error codes | TBD |
| Credentials storage | Per-tenant verification secret in the secrets manager (§6) |
| Timeout, retries, circuit breaker | CardPay-side retry policy TBD; our side is idempotent on the provider event id (§17.2) |
| Fallback when unavailable | CardPay retries per its policy (TBD); a result that stays overdue is resolved by the dispatcher through API-06 or a retry with the same key |
| Source document | TBD (link the CardPay documentation once supplied) |

---

### API-05: Send an email or SMS message (notifications -> MsgHub)

- **Type:** External outbound
- **Purpose:** notifications sends one email or one SMS message for a planned dispatch (UC-01 step 6, UC-03 step 5, UC-04 step 7, A2, and E1; INT-02; §17.3 Integrations).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the MsgHub API documentation: URI or URIs per channel, version, headers, request body for email and SMS, idempotency support, responses, error codes with their retryability, sender identity rules, and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the dispatch id as the idempotency key if MsgHub accepts one |
| Request body | TBD; our side supplies the channel, the recipient address, the rendered subject and body, and the dispatch id |
| Responses | TBD |
| Error codes | TBD (map each MsgHub error to retryable or permanent, §17.3) |
| Credentials storage | Per-tenant secret in the secrets manager (§6) |
| Timeout, retries, circuit breaker | From §12 INT-02: timeout **[NEEDS CLARIFICATION: per-attempt value]**; exponential backoff with jitter; maximum attempts open in §12; circuit breaker; bulkhead |
| Fallback when unavailable | The dispatch is retried, then Failed with an alarm; the refund lifecycle is unaffected (§12 INT-02) |
| Source document | TBD (link the MsgHub documentation once supplied) |

---

### API-06: Query a payout's status (payouts -> CardPay Ltd)

- **Type:** External outbound
- **Purpose:** before retrying after a timeout, payouts asks CardPay whether the payout with our payout id already went through, so a retry never pays twice (ADR-08; R-03; §17.2 Integrations). The contract exists only if CardPay offers a status query (§15.5 #3).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay API documentation: whether a status query by our reference exists, and its URI, version, headers, parameters, responses, error codes, and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD; our side supplies the payout id |
| Responses | TBD |
| Error codes | TBD |
| Credentials storage | Per-tenant secret in the secrets manager (§6) |
| Timeout, retries, circuit breaker | From §12 INT-01, sharing API-03's circuit breaker and bulkhead |
| Fallback when unavailable | Retry the payout with the same idempotency key (ADR-08) |
| Source document | TBD (link the CardPay documentation once supplied) |

---

## 15.4 Coverage Matrix

Client-facing calls from `refunds-portal-web` to the backend are not integrations; they are listed in §17.1 List of APIs.

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 CardPay Ltd | API-03, API-04, API-06 | Yes |
| §12 | INT-02 MsgHub | API-05 | Yes |
| §12 | INT-03 Point-of-Sale Records | API-01 | Yes |
| §8.5 | 8.5.1 Submit a Refund Request, steps 4 and 10 (receipt lookup) | API-01 | Yes |
| §8.5 | 8.5.1 Submit a Refund Request, step 14 (contact) | API-02 | Yes |
| §8.5 | 8.5.1 Submit a Refund Request, step 15 (message) | API-05 | Yes |
| §8.5 | 8.5.2 Approve, Pay Out, and Mark Paid, step 7 (payout request) | API-03 | Yes |
| §8.5 | 8.5.2 Approve, Pay Out, and Mark Paid, step 8 (payout result) | API-03 response or API-04 | Yes |
| §8.5 | 8.5.2 Approve, Pay Out, and Mark Paid, steps 13 and 14 (contact, message) | API-02, API-05 | Yes |
| §8.5 | 8.5.3 Cancellation Racing a Decision | None: client-facing calls only | Not applicable |
| §17.1 | refund-requests → Point-of-Sale Records | API-01 | Yes |
| §17.1 | notifications → refund-requests (port provided) | API-02 | Yes |
| §17.2 | payouts → CardPay Ltd (payout request) | API-03 | Yes |
| §17.2 | payouts → CardPay Ltd (status query) | API-06 | Yes |
| §17.2 | CardPay Ltd → payouts (callback) | API-04 | Yes |
| §17.3 | notifications → refund-requests | API-02 | Yes |
| §17.3 | notifications → MsgHub | API-05 | Yes |

---

## 15.5 Consistency Notes & Drift Register

Method and URI of API-04, the only contract that appears in a §17.X List of APIs, match §17.2 (both `TBD`). No synchronous chain is deeper than one hop. The rows below stay open until decided.

| # | Where | Divergence | Status |
|---|-------|------------|--------|
| 1 | API-02 vs §3 assumption 5 | The port is a candidate; how refund-requests captures the contact snapshot, and the source of `locale`, depend on the customer identity model | Open |
| 2 | API-04 vs API-03 | API-04 exists only if CardPay reports results asynchronously; if CardPay confirms in the API-03 response, API-04 is withdrawn with its ID kept | Open (`TBD - external`) |
| 3 | API-06 vs ADR-08 | API-06 exists only if CardPay offers a status query; otherwise ADR-08 relies on the idempotency key alone | Open (`TBD - external`) |
| 4 | API-01 vs §14.9.3 | The original payment reference may come from API-01 or need a new CardPay lookup contract (§14.8 #2) | Open |
| 5 | §17.3 (UC-04 E1) | Telling the branch manager may need a synchronous lookup of the branch's managers and their contact data (for example from the IAM), which would need its own contract | Open |

---

## 15.6 External Contracts Awaiting the User

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-01 | Point-of-Sale Records (Retail IT team) | URI, version, headers, parameters, response body (including the original payment reference if available), error codes, auth | Retail IT receipt lookup API reference |
| API-03 | CardPay Ltd | URI, version, headers, body, idempotency-key support, responses, error codes, auth | CardPay refund or payout API reference and sandbox guide |
| API-04 | CardPay Ltd | Whether callbacks exist; delivery and retry semantics, signature scheme, headers, body, acknowledgement | CardPay callback (webhook) documentation |
| API-05 | MsgHub | URIs per channel, version, headers, email and SMS bodies, idempotency support, responses, error codes, auth | MsgHub messaging API reference |
| API-06 | CardPay Ltd | Whether a status query exists; URI, version, headers, parameters, responses, error codes, auth | CardPay payout status API reference |

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
