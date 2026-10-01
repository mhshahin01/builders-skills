<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 02 (ecosystem: IAM, gateway), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (modules), 12 (roles and permission tokens), 13a-13d (per-module API lists and integrations)
PART OF: SDD - Refunds Platform
PURPOSE: The API contract registry for every synchronous integration: the module-to-module port call of the modular monolith and the outbound calls from modules to external systems. Each HTTP contract states the URI, headers, body, responses, error codes, security, and auth, and the in-process port contract its port interface, operation, DTOs, raised errors, and permission token, so both sides implement the same contract with zero drift.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each module chunk (13x) lists an in-process port call or a provider call in its Integrations table with the API ID and a link here; it never restates the headers, body, or error codes. Event contracts stay in chunk 10; roles and permission tokens stay in chunk 12 and are referenced here verbatim.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation. Provider-owned fields are `TBD` with the marker `**[TBD - EXTERNAL: ...]**`, never invented. Our-side policy comes from §12 and is filled.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous integration API (`API-NN`): the in-process port call between modules is fully defined; the external contracts are placeholders marked `TBD - external` for the user to complete from the providers' documentation.
>
> **What this chunk is not.** It does not list client-facing endpoints that no other module or external party calls (those stay in each module's List of APIs in chunks 13x and in the OpenAPI specs, §21). It does not hold event contracts (§14, chunk 10).

---

## 15.1 Contract Conventions (platform defaults)

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 principles, platform doctrine |
| Transport | TLS 1.2 or higher on every outbound provider call; in-process port calls have no transport | §6, §11.6 |
| Internal authentication | No internal HTTP calls in this release; an in-process port call runs with the caller's authenticated principal in the call context | §6 IAM row, §11.6 |
| Authorization | Per contract type (table below): a permission token from §16 on internal contracts; the provider's scheme on external ones | §16 (chunk 12) |
| Tenant context | In process: the `tenantId` of the call context, set from the `tenant_id` token claim; outbound to providers: per-tenant provider credentials, plus any tenant or merchant field the provider defines (TBD - external) | §11.2 |
| Correlation | `X-Correlation-Id` on inbound requests and on every outbound provider call, kept in the call context in process; W3C `traceparent` for tracing | §11.4 |
| Idempotency | `Idempotency-Key` header required on every write that touches money, notifications, or an external provider; outbound provider writes send the dispatch row ID as the key (ADR-09); API-01 is idempotent on `refundId` | §9 principles, platform doctrine |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes in the table below); an Internal (in-process) contract raises typed errors carrying the same `errorCode` | Platform doctrine (RFC 9457) |
| Resilience | Resilience4j timeout, retries with exponential backoff and jitter, circuit breaker, and bulkhead per provider; values per contract, from §12 for external systems; in-process calls do no I/O beyond the shared database and need none | Platform doctrine; §12 for external systems |
| Sync chain depth | At most one synchronous hop; API-01 makes no further synchronous call; provider calls run only in dispatchers or, for API-02, directly from the request that needs the receipt | §9 principles, platform doctrine |

### Authorization by contract type

| Type | Authorization value | §16 permission token |
|------|---------------------|----------------------|
| Internal | A permission token from §16, verbatim, checked by the provider (none in this release) | Required |
| Internal (in-process) | A permission token from §16, verbatim, checked at the port | Required |
| External outbound | None on our side: the provider authorizes the call with its own scheme (the Authentication row, `TBD` until the provider documentation is supplied) | None |
| External inbound | Our endpoint verifies the provider's signature or auth scheme (callback, webhook), `TBD - external` until the provider documentation is supplied (none in this release) | None |

### Standard headers

| Header | Direction | Required | Format / example | Purpose |
|--------|-----------|----------|------------------|---------|
| `Authorization` | Request | Yes | `Bearer <token>` (inbound); provider scheme (outbound, TBD - external) | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| `X-Correlation-Id` | Request, Response | Yes | UUID | End-to-end correlation |
| Tenant header | Request | No: the tenant is the `tenant_id` token claim inbound, and the per-tenant credentials outbound | - | Tenant context |
| `Idempotency-Key` | Request | On writes listed above | UUID | Safe retries |
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
| API-01 | Request payout | refund | payout | Internal (in-process) | `PayoutPort.requestPayout` | §17.1 Integrations, §17.2 Integrations | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |
| API-02 | Look up receipt | refund | POS Records | External outbound | TBD | INT-03 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | TBD - external |
| API-03 | Send refund payout | payout | CardPay | External outbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-04 | Send message (email or SMS) | notification | MsgHub | External outbound | TBD | INT-02 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |

---

## 15.3 Contract Details

### API-01: Request payout (refund -> payout)

- **Type:** Internal (in-process)
- **Purpose:** Records the payout instruction of an approved refund inside the approval transaction ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 5-6, A1: full or partial amount), so an approval never exists without its payout (REFUNDS/NFR-01); §17.1 and §17.2 Integrations.
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `PayoutPort` |
| Operation | `requestPayout` |
| Request DTO | `RequestPayoutCommand` |
| Response DTO | `PayoutAccepted` |
| Authorization | `payout.payout.request`, checked at the port against the call context's principal and its `branch_id` |
| Tenant context | The `tenantId` of the call context (§15.1); the payout row is written with it |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `RequestPayoutCommand` | `refundId` | uuid | Yes | UUIDv7 | The approved refund; the idempotency key of the call |
| `RequestPayoutCommand` | `refundReference` | string | Yes | max 20 | The request's reference number, used in messages and with CardPay |
| `RequestPayoutCommand` | `branchId` | string | Yes | max 32; equals the caller's `branch_id` | Branch of the purchase |
| `RequestPayoutCommand` | `purchaseReference` | string | Yes | max 64 | POS purchase reference of the original purchase |
| `RequestPayoutCommand` | `amount` | Money | Yes | amount > 0, scale <= 2; currency ISO 4217 | Approved amount, full or partial |
| `PayoutAccepted` | `payoutId` | uuid | Yes | - | The payout record; CardPay idempotency key |
| `PayoutAccepted` | `status` | enum | Yes | PENDING, RETRYING, SUCCEEDED, FAILED, UNKNOWN | PENDING on first call; the current status on an idempotent repeat |
| `PayoutAccepted` | `acceptedAt` | timestamp | Yes | UTC | When the instruction was recorded |

**Errors raised** (typed errors carrying the §15.1 `errorCode`; no HTTP status)

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `InvalidPayoutRequestException` | `VALIDATION_FAILED` | A field is missing, the amount is not more than 0, or the currency is unknown | No | Roll back the approval; return the error to the manager |
| `PayoutNotPermittedException` | `FORBIDDEN` | The call context lacks `payout.payout.request`, or its branch differs from `branchId` | No | Roll back the approval; alert |
| `PayoutConflictException` | `CONFLICT` | A payout exists for `refundId` with a different amount | No | Roll back the approval; re-read the request |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | Keyed on `refundId`: a repeat with the same amount returns the existing `PayoutAccepted`; no second payout is ever created |
| Transaction | Joins the caller's transaction; the payout row commits or rolls back with the approval |
| Side effects | Writes one `payout` row with status PENDING; no provider call inside the port (ADR-09) |
| Timeout and retries | Not applicable: no network I/O beyond the shared database |

---

### API-02: Look up receipt (refund -> POS Records)

- **Type:** External outbound
- **Purpose:** Reads a receipt with its lines, amounts, branch, and purchase date when the customer enters the receipt number and again at submission ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 2 and 5, A1, E1, E2); INT-03 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records API documentation (Retail IT team): URI, version, headers, request parameters, response body, error codes, and authentication scheme. The response must give, per receipt: branch, purchase timestamp, currency, the card-paid amount of the receipt (tender split), and per line a stable line ID, description, amount, and quantity; and, if POS records know it, whether a line is already refunded (R-07), the reference of the original card payment (R-03), any data on the receipt that could prove the buyer (customer or member ID, card digits; R-08), and the member ID of the purchase, if the receipt carries one. Also needed: the purchase reference the member purchase intake uses for the same purchase, and the uniqueness scope of receipt numbers.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map "receipt unknown" to `RECEIPT_NOT_FOUND`, and unavailability to `UNAVAILABLE`, once known) |
| Credentials storage | Secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-03 (a): one retry with jitter on timeout or 503; Resilience4j circuit breaker and bulkhead; timeout open in §12 |
| Fallback when unavailable | §12 INT-03 (a): 503 `UNAVAILABLE` to the customer, try again later |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-03: Send refund payout (payout -> CardPay)

- **Type:** External outbound
- **Purpose:** Sends the payout of an approved refund to the customer's original card and receives its result ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 6-7, E1); INT-01 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme; whether CardPay deduplicates on an idempotency key, offers a payout status query (R-01), and offers a payout report for the daily reconciliation of §17.2; which reference identifies the original card payment (purchase reference or card transaction reference, R-03); and whether the payout result returns in the response or by callback (a callback would add an External inbound contract).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` and to retry or no-retry once known) |
| Credentials storage | Secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-01: retries with exponential backoff and jitter for up to 24 h with the same idempotency key (the payout ID); Resilience4j circuit breaker and bulkhead; timeout open in §12 |
| Fallback when unavailable | §12 INT-01: the payout stays pending and the request stays Approved; after 24 h `PayoutFailed` |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-04: Send message (notification -> MsgHub)

- **Type:** External outbound
- **Purpose:** Sends one email or SMS to a customer or a branch manager ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7, A2, E1); INT-02 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the MsgHub API documentation: URI or URIs for email and SMS, version, headers, request body, responses, delivery status, error codes, authentication scheme, and idempotency support.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` and to retry or no-retry once known) |
| Credentials storage | Secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-02: retries with exponential backoff and jitter with the same idempotency key (the notification ID); Resilience4j circuit breaker and bulkhead; timeout and maximum attempts open in §12 |
| Fallback when unavailable | §12 INT-02: the message stays pending and is retried; refund state never depends on it |
| Source document | TBD (link the provider's API documentation once supplied) |

---

## 15.4 Coverage Matrix

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 - CardPay | API-03 | Yes |
| §12 | INT-02 - MsgHub | API-04 | Yes |
| §12 | INT-03 - POS Records, receipt lookup (a) | API-02 | Yes |
| §12 | INT-03 - POS Records, member purchase intake (b) | - | Not applicable yet: the intake mode is open in §12, so it is not known to be a synchronous call |
| §8.5 | 8.5.1 Refund submission, receipt lookup and re-read | API-02 | Yes |
| §8.5 | 8.5.1 Refund submission, email and SMS | API-04 | Yes |
| §8.5 | 8.5.2 Refund decision and payout, `requestPayout` | API-01 | Yes |
| §8.5 | 8.5.2 Refund decision and payout, CardPay payout | API-03 | Yes |
| §8.5 | 8.5.3 Cancel a refund request, email | API-04 | Yes |
| §17.1 | refund - POS Records | API-02 | Yes |
| §17.1 | refund - `payout` (outbound port call) | API-01 | Yes |
| §17.2 | payout - `refund` (inbound port call) | API-01 | Yes |
| §17.2 | payout - CardPay | API-03 | Yes |
| §17.3 | notification - MsgHub | API-04 | Yes |
| §17.4 | loyalty - POS Records purchase intake | - | Not applicable yet: same as INT-03 (b) |

---

## 15.5 Consistency Notes & Drift Register

No divergence found: API-01 matches the §17.1 and §17.2 Integrations rows and the §16.11 token `payout.payout.request`; API-02 to API-04 match §12 and the module Integrations rows; no synchronous chain is deeper than one hop.

| # | Where | Divergence | Status |
|---|-------|------------|--------|

---

## 15.6 External Contracts Awaiting the User

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-02 | POS Records (Retail IT team) | URI, version, headers, parameters, response body, error codes, auth; refunded-line flag, payment reference, tender split, line quantity, buyer data, member ID, purchase reference, and receipt-number uniqueness | POS records API reference |
| API-03 | CardPay Ltd | URI, version, headers, body, responses, error codes, auth; idempotency, status query or payout report, original-card reference, result channel | CardPay payout API reference and sandbox guide |
| API-04 | MsgHub | URIs for email and SMS, version, headers, body, responses, delivery status, error codes, auth, idempotency | MsgHub API reference |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
