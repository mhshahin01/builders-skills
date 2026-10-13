<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 02 (ecosystem: IAM), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (modules), 12 (roles and permission tokens), 13a+ (per-module API lists)
PART OF: SDD - Refunds Platform
PURPOSE: The API contract registry for every synchronous domain or provider integration: module-to-module port calls, outbound calls to external systems, and inbound calls from external systems.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each 13x chunk lists an HTTP endpoint in its List of APIs, or a port call in its Integrations table, with the API ID; it never restates headers, body, or error codes.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation; provider-owned fields are `TBD` with a `**[TBD - EXTERNAL: ...]**` marker, never invented. Our-side policy comes from §12.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous domain or provider integration API (`API-NN`). The one internal contract (API-06) is fully defined; the eight external contracts are `TBD - external`: API-01 to API-05, API-07, and API-09 until the provider documentation is supplied, and API-08 until ADR-07 is settled (§15.6).
>
> **What this chunk is not.** It does not list the endpoints only the platform's own web app calls (those are in each module's List of APIs, §17.X, and the OpenAPI document, §21). It does not hold event contracts (§14).

---

## 15.1 Contract Conventions (platform defaults)

API-NN covers domain/provider integrations, including internal business ports. Standard operational database, Vault and IAM client/admin/token operations are infrastructure configuration in ecosystem/security/operations, not API-NN contracts. A custom business integration cannot claim that exemption.

Infrastructure boundary in this SDD: PostgreSQL access, secrets-manager reads, and platform IAM token validation are operational infrastructure, configured in §6 and §11.6 (source: the paragraph above). Finding the branch managers of a branch for the still-failing alert decides who receives a business message, so it is a business integration: API-08. Every provider call and the module ports remain in the coverage matrix.

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 AP-10, ADR-04 |
| Transport | TLS 1.2+ on every HTTP call; in-process calls do not cross a network | §6, §11.6 |
| Internal authentication | In-process: the caller's security context (a module identity for module calls, §16.3); no HTTP between modules | §6, §11.6 |
| Authorization | Per contract type (table below): a permission token from §16 on internal contracts; the provider's scheme on external ones | §16 (chunk 12) |
| Tenant context | Carried on every call: the in-process call context for API-06; the tenant's provider credentials for external calls | §11.2 |
| Correlation | `X-Correlation-Id` on every HTTP call and propagated downstream; W3C `traceparent` for tracing; carried in the call context in process | §11.4 |
| Idempotency | `Idempotency-Key` header required on every write that touches money, notifications, or an external provider | §9 AP-02 |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes below); an Internal (in-process) contract raises typed errors carrying the same `errorCode` | ADR-04 |
| Resilience | Timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per provider adapter; values per contract, from §12 | §12 |
| Sync chain depth | At most one synchronous hop between modules; API-06 calls no other port | ADR-05 |

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
| `Authorization` | Request | Yes on our endpoints; provider scheme on external calls | `Bearer <token>` or provider scheme | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| `X-Correlation-Id` | Request, Response | Yes | UUID | End-to-end correlation |
| `X-Tenant-Id` | Request | No: the tenant is a token claim on our endpoints and implied by the credentials on provider calls | UUIDv7 | Tenant context |
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
| API-01 | Request a payout | payout | CardPay Ltd | External outbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-02 | Receive a payout result | CardPay Ltd | payout | External inbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-03 | Send an email or SMS | customer-notification | MsgHub | External outbound | TBD | INT-02 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-04 | Look up a receipt | refund-request | Point-of-Sale Records | External outbound | TBD | INT-03 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | TBD - external |
| API-05 | Receive member purchases | POS Records | loyalty-points | External inbound | TBD | INT-03 | - | TBD - external |
| API-06 | Get customer contact details | customer-notification | refund-request | Internal (in-process) | `CustomerContactPort.getCustomerContact` | §17.3 Integrations | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |
| API-07 | Get refund records for reconciliation | payout | CardPay Ltd | External outbound | TBD | INT-01 | - | TBD - external |
| API-08 | Find the branch managers of a branch | customer-notification | Platform IAM | External outbound | TBD | INT-04 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-09 | Receive card dispute notices | CardPay Ltd | payout | External inbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |

---

## 15.3 Contract Details

### API-01: Request a payout (payout -> CardPay Ltd)

- **Type:** External outbound
- **Purpose:** Send the approved amount to the customer's original card ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8); INT-01.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd API documentation: URI, version, headers, request body, responses, error codes, authentication scheme, and whether it honours an idempotency key.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the key of the payout's current round as the idempotency key in the provider's field or header (the payout id for the first round, a new UUIDv7 for each round after a paid payout is sent back, §17.2 Send) |
| Request body | TBD; our side supplies the amount, currency, original-payment reference, and payout id |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Per INT-01 (§12) |
| Fallback when unavailable | Payout stays Approved and is retried (INT-01) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-02: Receive a payout result (CardPay Ltd -> payout)

- **Type:** External inbound
- **Purpose:** Receive the result of a payout attempt ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9, E1); INT-01. Whether CardPay reports results this way or only in the API-01 response is open (§17.2 Integrations), and so is whether it reports here a payout the customer's bank sent back (§17.2 Payout sent back).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd API documentation: callback URI requirements, version, headers, body, signature or auth scheme, expected responses, and retry behaviour of the provider.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD (our endpoint path is set once the provider's scheme is known) |
| Version | TBD |
| Authentication | TBD (provider signature scheme, verified by our endpoint) |
| Request headers | TBD |
| Request body | TBD; our side needs the payout id and the result |
| Responses | TBD; our side acknowledges only after the result is committed |
| Error codes | TBD |
| Credentials storage | Verification secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Not applicable on our side; idempotent on the payout id and provider result id (§17.2) |
| Fallback when unavailable | The provider's own retry; the payout is also resolved by the next API-01 attempt with the same idempotency key |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-03: Send an email or SMS (customer-notification -> MsgHub)

- **Type:** External outbound
- **Purpose:** Send the customer messages of [REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages) and the branch-manager alert ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8, step 9, A1, A2, E1, BR-8: rejection after a refunded card dispute); INT-02.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the MsgHub API documentation: URI, version, headers, request body, responses, error codes, authentication scheme, and idempotency support, for email and for SMS.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the message id as the idempotency key, or for the branch-manager alert a name-based UUID (RFC 9562 version 5) with the message id as namespace and the recipient's IAM user id as name (§17.3) |
| Request body | TBD; our side supplies channel, recipient, and message text |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Per INT-02 (§12) |
| Fallback when unavailable | Message stays queued; never blocks a refund (INT-02) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-04: Look up a receipt (refund-request -> Point-of-Sale Records)

- **Type:** External outbound
- **Purpose:** Get a receipt's items, amounts, branch, purchase date, and payment method for eligibility ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 2); INT-03.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Point-of-Sale Records API documentation: URI, version, headers, request and response body, error codes (including receipt not found), and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD; our side supplies the receipt number |
| Responses | TBD; our side needs the data of [REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations) and the original-payment reference (§17.2 marker) |
| Error codes | TBD; "receipt not found" maps to `RECEIPT_NOT_FOUND`, unreachable or timeout to `RECEIPTS_UNAVAILABLE` (§17.1) |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Per INT-03 (§12) |
| Fallback when unavailable | `RECEIPTS_UNAVAILABLE` to the customer ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E5) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-05: Receive member purchases (POS Records -> loyalty-points)

- **Type:** External inbound
- **Purpose:** Receive the member purchases that earn points ([LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points)); INT-03. No use case: earning is a platform flow (§8.4.4). Whether POS Records sends purchases or Loyalty Points fetches them is open (§17.4 Input): this block is written for the push the Type names; if `loyalty-points` fetches, the Type becomes External outbound and each aspect below takes its "if fetched" value.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records documentation: delivery mechanism and schedule, URI requirements, version, headers, body, auth scheme, and error handling.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD (if pushed: our endpoint path, set once the provider's scheme is known; if fetched: the POS Records interface) |
| Version | TBD |
| Authentication | TBD (provider scheme; if pushed, verified by our endpoint; if fetched, our credentials at POS Records) |
| Request headers | TBD |
| Request body | TBD; our side needs the data of [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations) |
| Responses | TBD; if pushed, our side acknowledges each purchase after it is committed; if fetched, POS Records returns the purchases of the period asked |
| Error codes | TBD; invalid data maps to `VALIDATION_FAILED` (§17.4) |
| Credentials storage | Per tenant in the secrets manager (§6): a verification secret if pushed, client credentials if fetched |
| Timeout, retries, circuit breaker | If pushed, not applicable on our side; if fetched, per INT-03 (§12); idempotent on the purchase reference either way (§17.4) |
| Fallback when unavailable | Late purchases still earn points when they arrive (INT-03) |
| Source document | TBD (link the provider's documentation once supplied) |

---

### API-06: Get customer contact details (customer-notification -> refund-request)

- **Type:** Internal (in-process)
- **Purpose:** Read the customer's email address and mobile number at send time, so that `customer-notification` stores no personal data ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9); §17.3 Integrations.
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `CustomerContactPort` |
| Operation | `getCustomerContact` |
| Request DTO | `CustomerContactQuery` |
| Response DTO | `CustomerContactDto` |
| Authorization | `refund.contact.read`, checked at the port |
| Tenant context | Carried in the call context; the query reads only the caller's tenant |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `CustomerContactQuery` | `refundRequestId` | UUIDv7 | Yes | - | The refund request the message is about |
| `CustomerContactDto` | `refundRequestId` | UUIDv7 | Yes | - | Echo of the query |
| `CustomerContactDto` | `email` | string | No | RFC 5322 address, max 254; `pii` | Email address given at submission, absent if not given |
| `CustomerContactDto` | `mobileNumber` | string | No | E.164, max 16; `pii` | Mobile number given at submission, absent if not given |

**Errors raised**

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `RefundRequestNotFound` | `NOT_FOUND` | No refund request with this id in the tenant | No | Mark the message `Failed` |
| `ContactDetailsErased` | `CONTACT_DETAILS_ERASED` | The retention purge has erased the contact details | No | Mark the message `Failed` |
| `AccessDenied` | `FORBIDDEN` | Caller lacks `refund.contact.read` | No | Alert; configuration defect |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | A read; repeated calls return the current contact details |
| Transaction | Runs in its own read-only transaction; never joins the caller's |

### API-07: Get refund records for reconciliation (payout -> CardPay Ltd)

- **Type:** External outbound
- **Purpose:** Read CardPay's records of refunds to the original card for the daily payout reconciliation (REFUNDS/NFR-01, §17.2 Reconciliation), including any refund the customer's bank sent back; INT-01.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd documentation: whether refund records come from a report endpoint or a settlement file, its interface, fields, auth, and schedule.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD; our side asks for one day's refunds |
| Responses | TBD; our side needs each refund's provider id, our payout id or idempotency key, amount, and result |
| Error codes | TBD |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Per INT-01 (§12); a failed run is retried the next day |
| Fallback when unavailable | The monthly comparison by hand from CardPay's statements (§17.2) |
| Source document | TBD (link the provider's documentation once supplied) |

### API-08: Find the branch managers of a branch (customer-notification -> Platform IAM)

- **Type:** External outbound
- **Purpose:** Find, at send time, the enabled staff accounts that hold `BRANCH_MANAGER` for a branch, so the still-failing alert reaches them ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1, AC-2: still failing after one day); §17.3 Select; INT-04. `customer-notification` calls it through its outbound port `StaffDirectoryPort.findBranchManagers(branchId)`, the anti-corruption layer: only the port's adapter knows the IAM's query. The response is a list of `{iamUserId, email}`; the email is `pii`, used for the send and never stored.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the documentation of the IAM that ADR-07 settles: the staff-user query by role and `branch_id`, its URI, version, auth scheme, response, error handling, and how a client is limited to reading only the users that hold a staff role, since staff and end customers share one realm (ADR-07).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (IAM scheme); a confidential IAM client whose only right is reading the users that hold a staff role and their attributes (§11.6) |
| Request headers | TBD |
| Request body | TBD; our side asks for the enabled staff users with `BRANCH_MANAGER` and the given `branch_id`, in the caller's tenant |
| Responses | TBD; our side needs each user's IAM user id and email address |
| Error codes | TBD; any failure maps to `StaffDirectoryUnavailable` (retryable); an empty list is not an error (§17.3 marks the message `Failed` and raises the operations alert) |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Per INT-04 (§12): timeout TBD (ADR-07), bounded by the message lease of §17.3; retried within the INT-02 bounds |
| Fallback when unavailable | The message stays queued and is retried; it never stops or changes a refund request |
| Source document | TBD (link the IAM documentation once ADR-07 is settled) |

---

### API-09: Receive card dispute notices (CardPay Ltd -> payout)

- **Type:** External inbound
- **Purpose:** Receive the disputes customers raise with their bank against an original card payment, and each dispute's outcome, so that the decision view shows them and the payout waits ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E3, BR-8: payout waits for a card dispute); INT-01; §17.2 Disputes. Whether CardPay can report disputes, and whether it sends them or `payout` fetches them, is open (§17.2 Disputes): this block is written for the push the Type names; if `payout` fetches, the Type becomes External outbound and each aspect below takes its "if fetched" value.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd documentation: whether and how disputes of an original card payment and their outcomes are reported, delivery mechanism and schedule, URI requirements, version, headers, body, signature or auth scheme, and error handling.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD (if pushed: our endpoint path, set once the provider's scheme is known; if fetched: the CardPay interface) |
| Version | TBD |
| Authentication | TBD (provider scheme; if pushed, verified by our endpoint; if fetched, our credentials at CardPay) |
| Request headers | TBD |
| Request body | TBD; our side needs CardPay's dispute id, the original-payment reference, the dispute's state, and, once closed, its outcome (refunded to the customer or refused) |
| Responses | TBD; if pushed, our side acknowledges each notice after it is committed; if fetched, CardPay returns the disputes changed in the period asked |
| Error codes | TBD; an invalid signature maps to `UNAUTHENTICATED` (§17.2) |
| Credentials storage | Per tenant in the secrets manager (§6): a verification secret if pushed, client credentials if fetched |
| Timeout, retries, circuit breaker | If pushed, not applicable on our side; if fetched, per INT-01 (§12); idempotent on the dispute id and state either way (§17.2) |
| Fallback when unavailable | A payout is not held for a dispute the platform has not received; R-09 |
| Source document | TBD (link the provider's documentation once supplied) |

---

## 15.4 Coverage Matrix

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 - CardPay Ltd | API-01, API-02, API-07, API-09 | Yes |
| §12 | INT-02 - MsgHub | API-03 | Yes |
| §12 | INT-03 - Point-of-Sale Records | API-04, API-05 | Yes |
| §8.5 | 8.5.1 Submit a refund request, receipt lookup | API-04 | Yes |
| §8.5 | 8.5.1 Submit a refund request, contact details | API-06 | Yes |
| §8.5 | 8.5.1 Submit a refund request, send email and SMS | API-03 | Yes |
| §8.5 | 8.5.2 Decide and pay out a refund, payout request | API-01 | Yes |
| §8.5 | 8.5.2 Decide and pay out a refund, payout result callback | API-02 | Yes |
| §17.1 | refund-request - Point-of-Sale Records | API-04 | Yes |
| §17.1 | refund-request - customer-notification (port provider) | API-06 | Yes |
| §17.2 | payout - CardPay Ltd (request) | API-01 | Yes |
| §17.2 | payout - CardPay Ltd (result) | API-02 | Yes |
| §17.2 | payout - CardPay Ltd (reconciliation) | API-07 | Yes |
| §17.2 | payout - CardPay Ltd (card dispute notices) | API-09 | Yes |
| §17.3 | customer-notification - MsgHub | API-03 | Yes |
| §17.3 | customer-notification - refund-request (port) | API-06 | Yes |
| §17.3 | customer-notification - Platform IAM (branch managers of a branch) | API-08 | Yes |
| §12 | INT-04 - Platform IAM (staff directory) | API-08 | Yes |
| §17.4 | loyalty-points - POS Records | API-05 | Yes |

---

## 15.5 Consistency Notes & Drift Register

No divergence: method and path in every `13x` List of APIs match §15.2 (API-02, API-05, and API-09 read `TBD` on both sides), API-06's permission token is in §16.11, and no synchronous chain is deeper than one hop.

| # | Where | Divergence | Status |
|---|-------|------------|--------|
| - | - | None | - |

---

## 15.6 External Contracts Awaiting the User

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-01 | CardPay Ltd | URI, version, headers, body, responses, error codes, auth, idempotency support | CardPay payout (refund to original card) API reference and sandbox guide |
| API-02 | CardPay Ltd | Callback URI requirements, headers, body, signature scheme, provider retry behaviour | CardPay result notification (webhook) documentation |
| API-03 | MsgHub | URI, version, headers, body, responses, error codes, auth, idempotency support | MsgHub email and SMS API reference |
| API-04 | Point-of-Sale Records | URI, version, headers, body, responses, error codes, auth | POS Records receipt lookup interface description (Retail IT team) |
| API-05 | POS Records | Delivery mechanism and schedule, URI requirements, headers, body, auth | POS Records member purchase feed description (Retail IT team) |
| API-07 | CardPay Ltd | Interface, format, fields, auth, schedule | CardPay refund reporting or settlement file description |
| API-08 | Platform IAM (per ADR-07) | URI, version, auth scheme, response, error codes, timeout | The staff-user query documentation of the IAM that ADR-07 settles |
| API-09 | CardPay Ltd | Whether disputes are reported at all, delivery mechanism and schedule, URI requirements, headers, body, signature scheme | CardPay dispute (chargeback) notification or reporting documentation |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
