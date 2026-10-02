<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 02 (ecosystem: IAM, gateway), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (services), 12 (roles and permission tokens), 13a+ (per-service API lists)
PART OF: SDD - Refunds Platform
PURPOSE: The API contract registry for every synchronous integration: service-to-service calls, module-to-module port calls in a modular monolith or hybrid core, outbound calls from a service to an external system, and inbound calls from an external system into a service (callbacks, webhooks). Each HTTP contract states the URI, headers, body, responses, error codes, security, and auth, and each in-process port contract its port interface, operation, DTOs, raised errors, and permission token, so both sides implement the same contract with zero drift.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each per-service chunk (13x) lists an HTTP endpoint in its "List of APIs", or an in-process port call in its Integrations table, with the API ID and a link here; it never restates the headers, body, or error codes. Event contracts stay in chunk 10; roles and permission tokens stay in chunk 12 and are referenced here verbatim.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation. Provider-owned fields (URI, headers, body, responses, error codes, auth scheme) are written as `TBD` with the marker `**[TBD - EXTERNAL: ...]**`, never invented. Our-side policy (timeout, retries, circuit breaker, fallback, where credentials are stored) comes from §12 and is filled.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous integration API (`API-NN`), with everything an implementer on either side needs: endpoint, security, headers, parameters, body, responses, error codes, and behaviour (idempotency, timeouts, retries). Internal contracts are fully defined here. External contracts are placeholders marked `TBD - external` for the user to complete from the provider's documentation.
>
> **What this chunk is not.** It does not list client-facing endpoints that no other service or external party calls (those stay in each service's "List of APIs" in chunks 13x and in the OpenAPI specs, §21). It does not hold event contracts (§14, chunk 10).

In this platform every synchronous integration is a call from a deployable to an external system, and no deployable calls another over HTTP (ADR-05), so there is no `Internal` contract. The only module-to-module interaction in this release is the in-process `RefundPaid` event (§14.10); no module calls another module's port, so §15 has no `Internal (in-process)` contract; a future port call gets its own API-NN of that type.

---

## 15.1 Contract Conventions (platform defaults)

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 principles, platform doctrine |
| Transport | TLS 1.2 or later on every call; no service mesh | §6, §11.6 |
| Internal authentication | Not applicable in this release: no deployable calls another over HTTP (ADR-05); users authenticate with Keycloak JWTs (ADR-07) | §6 IAM row, §11.6 |
| Authorization | Per contract type (table below): a permission token from §16 on internal contracts; the provider's scheme on external ones | §16 (chunk 12) |
| Tenant context | Carried on every call: the `tenant_id` token claim on web calls; on external calls the tenant selects the provider credentials and never travels as data | §11.2 |
| Correlation | Carried on every call and propagated downstream (`X-Correlation-Id`); W3C trace context for tracing | §11.4 |
| Idempotency | `Idempotency-Key` header required on every write that touches money, wallet, notifications, or an external provider | §9 principles, platform doctrine |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes in the table below); an Internal (in-process) contract raises typed errors carrying the same `errorCode` | Platform doctrine (RFC 9457) |
| Resilience | Timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per downstream; values per contract, from §12 for external systems | Platform doctrine; §12 for external systems |
| Sync chain depth | At most one synchronous hop between services; a deeper chain is a design defect, flagged in §15.5 | §9 principles, platform doctrine |

### Authorization by contract type

| Type | Authorization value | §16 permission token |
|------|---------------------|----------------------|
| Internal | A permission token from §16, verbatim, checked by the provider | Required |
| Internal (in-process) | A permission token from §16, verbatim, checked at the port | Required |
| External outbound | None on our side: the provider authorizes the call with its own scheme (the Authentication row, `TBD` until the provider documentation is supplied) | None |
| External inbound | Our endpoint verifies the provider's signature or auth scheme (callback, webhook), `TBD - external` until the provider documentation is supplied | None |

### Standard headers

| Header | Direction | Required | Format / example | Purpose |
|--------|-----------|----------|------------------|---------|
| `Authorization` | Request | Yes | `Bearer <token>` | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| `X-Correlation-Id` | Request, Response | Yes | UUID | End-to-end correlation |
| Tenant header | Request | No: carried in the token claim | - | Tenant context |
| `Idempotency-Key` | Request | On writes listed above | UUID | Safe retries |
| `traceparent` | Request | Yes | W3C trace context | Distributed tracing |

External contracts use the provider's own headers (`TBD`); our side still sends `X-Correlation-Id` and `traceparent` where the provider accepts them.

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
| API-01 | Look up a receipt and its items | refund-service | POS Records | External outbound | TBD | INT-03 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | TBD - external |
| API-02 | Send a refund payout to the original card | payout-service | Payment Provider (CardPay) | External outbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-03 | Send a customer email or SMS | notification-service | Notification Partner (MsgHub) | External outbound | TBD | INT-02 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-04 | Fetch member purchases after a cursor | loyalty-service | POS Records | External outbound | TBD | INT-03 | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | TBD - external |

---

## 15.3 Contract Details

### API-01: Look up a receipt and its items (refund-service -> POS Records)

- **Type:** External outbound
- **Purpose:** Read a receipt's items, amounts, branch, and purchase date when a customer starts a refund ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2); §12 INT-03.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records API documentation (Retail IT team): URI, version, headers, request body, responses, error codes, and authentication scheme; whether each item line carries its quantity, its product category, and the net amount paid after discounts, which the store policy rules of REFUNDS OI-24 may need; the format of the receipt number (case, padding, branch or till prefix) and whether it identifies one purchase across all branches and over time (§3 assumption 12); and whether the item amounts are the amounts paid after discounts, on the same basis as the member purchase amount of API-04 (§17.4 Take points back, LOYALTY OI-19).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known; an unknown receipt becomes `RECEIPT_NOT_FOUND`, §17.1) |
| Data the platform needs | Sends the receipt number in the normalised form (Receipt number form, below); needs the receipt number as POS Records holds it, each item line (line id, description, amount), the branch, the purchase date, the currency ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations)), and the receipt's payment methods and its card-paid amount |
| Credentials storage | Secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-03 |
| Fallback when unavailable | §12 INT-03 |
| Source document | TBD (link the provider's API documentation once supplied) |

**Receipt number form (API-01, API-04).** The receipt number is one value with one form across the platform: the API-01 adapter (`PosReceiptPort`) and the API-04 adapter (`PosPurchasePort`) apply the same normalisation rule, written here once POS Records documents the format (§15.6; until then `TBD - external`). refund-service stores the receipt number API-01 returns, not the value the customer typed, and carries it in `REFUND_APPROVED` and `RefundPaid`; loyalty-service stores the value API-04 returns, normalised by the same rule, so the take-back matches by equality (§17.4). If receipt numbers turn out to repeat across branches or tills, §3 assumption 12 states the fallback.

---

### API-02: Send a refund payout to the original card (payout-service -> Payment Provider)

- **Type:** External outbound
- **Purpose:** Pay an approved refund back to the card used for the purchase ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 6-7, E1); §12 INT-01.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme; whether CardPay honours an idempotency key; whether the payout result comes back in the response or by a callback, which would add an External inbound contract; and which reference of the original card payment CardPay needs (the receipt number or another reference), and confirmation that no card data is needed; whether CardPay is, or is linked to, the acquirer of the branch card terminals; how long a refund takes to appear on the card; whether its payout reference is one the customer can quote to their bank; whether an open dispute on the original transaction can be detected before a payout; and whether a payout CardPay has accepted can still fail or be reversed afterwards (for example at settlement), and how CardPay reports it. If it can, an External inbound contract, a route to payout-service, and the business rule for the customer, the Paid status, and the points taken back are designed before TASK-03 starts, because `paid_at` and the take-back follow acceptance (REFUNDS 02 § Dependencies 1).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Data the platform needs | Sends the payout id as the idempotency key, the amount and currency, and the reference that identifies the original card payment (§17.2 Original card); needs the outcome, the provider reference, and a failure code; needs a payout status query by payout id if CardPay does not honour idempotency keys (§17.2) |
| Credentials storage | Secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-01 |
| Fallback when unavailable | §12 INT-01 |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-03: Send a customer email or SMS (notification-service -> Notification Partner)

- **Type:** External outbound
- **Purpose:** Tell the customer about a refund step by email or SMS ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 6 and 7, A2, and E1); §12 INT-02.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the MsgHub API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme, and whether MsgHub honours an idempotency key.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Data the platform needs | Sends the channel, the address, the rendered content, and the message id as the idempotency key; needs acceptance, the provider message id, and a failure code |
| Credentials storage | Secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-02 |
| Fallback when unavailable | §12 INT-02 |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-04: Fetch member purchases after a cursor (loyalty-service -> POS Records)

- **Type:** External outbound
- **Purpose:** Import the member purchases POS Records reports, which earn the points the balance and history show ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)); §12 INT-03.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records API documentation (Retail IT team): URI, version, headers, request body, responses, error codes, and authentication scheme, and whether POS Records serves member purchases by cursor or time window or can only push them (R-05), whether it can send the receipt number with each member purchase (R-03), in the same format as API-01; whether the receipt number identifies one purchase across all branches and over time (§3 assumption 12); and whether the member purchase amount equals the sum of the receipt's item amounts returned by API-01, after discounts and including items that earn no points (§17.4 Take points back, LOYALTY OI-19).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Data the platform needs | Sends the stored cursor; needs, per purchase, the member number, the purchase reference, the amount and currency, the purchase date ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)), the receipt number, which a paid refund is matched on (§17.4), and the time POS Records reported the purchase, which starts the LOYALTY/NFR-03 hour |
| Credentials storage | Secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-03 |
| Fallback when unavailable | §12 INT-03; the next run resumes from the cursor (§17.4) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

## 15.4 Coverage Matrix

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 - Payment Provider (CardPay Ltd) | API-02 | Yes |
| §12 | INT-02 - Notification Partner (MsgHub) | API-03 | Yes |
| §12 | INT-03 - POS Records | API-01, API-04 | Yes |
| §8.5 | 8.5.1 Submit a refund request, receipt lookup | API-01 | Yes |
| §8.5 | 8.5.1 Submit a refund request, customer message | API-03 | Yes |
| §8.5 | 8.5.2 Refund decision and payout, payout call | API-02 | Yes |
| §8.5 | 8.5.2 Refund decision and payout, customer messages | API-03 | Yes |
| §17.1 | refund-service - POS Records | API-01 | Yes |
| §17.2 | payout-service - Payment Provider (CardPay) | API-02 | Yes |
| §17.3 | notification-service - Notification Partner (MsgHub) | API-03 | Yes |
| §17.4 | loyalty-service - POS Records | API-04 | Yes |

---

## 15.5 Consistency Notes & Drift Register

No divergence between this chunk and §12, the §17.X Integrations tables and Lists of APIs, and §16. No synchronous chain is deeper than one hop: every contract is a single call from a deployable to an external system.

---

## 15.6 External Contracts Awaiting the User

Each document is requested by the owner of the matching BRD dependency ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) for API-01 to API-03, [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) for API-04), and must arrive before the task that dependency names.

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-01 | POS Records (Retail IT team) | URI, version, headers, body, responses, error codes, auth, receipt number format and uniqueness scope, basis of the item amounts, each item line's quantity, category, and net amount paid after discounts (REFUNDS OI-24) | POS Records receipt lookup API reference |
| API-02 | Payment Provider (CardPay Ltd) | URI, version, headers, body, responses, error codes, auth, idempotency support, result delivery (response or callback), the reference of the original card payment, the link to the acquirer of the branch card terminals, the days a refund takes to appear on the card, a payout reference the customer can quote to their bank, whether a disputed purchase can be detected before a payout, whether an accepted payout can still fail or be reversed afterwards | CardPay refund payout API reference and sandbox guide |
| API-03 | Notification Partner (MsgHub) | URI, version, headers, body, responses, error codes, auth, idempotency support | MsgHub email and SMS API reference |
| API-04 | POS Records (Retail IT team) | URI, version, headers, body, responses, error codes, auth, pull or push, receipt number with each purchase in the API-01 format, purchase amount on the API-01 item basis | POS Records member purchase API reference |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
