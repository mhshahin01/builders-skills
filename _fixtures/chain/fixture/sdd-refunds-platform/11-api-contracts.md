<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 02 (ecosystem: IAM, gateway), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (services), 12 (roles and permission tokens), 13a+ (per-service API lists)
PART OF: SDD - Refunds Platform
PURPOSE: The API contract registry for every synchronous integration: service-to-service calls, outbound calls from a service to an external system, and inbound calls from an external system into a service.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each 13x chunk lists the endpoint in its "List of APIs" with the API ID; it never restates headers, body, or error codes. Event contracts stay in chunk 10; roles and permission tokens stay in chunk 12.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation. Provider-owned fields are `TBD` with a `[TBD - EXTERNAL: ...]` marker, never invented; our-side policy comes from §12.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous integration API (`API-NN`). In this release every synchronous integration has an external system on the other side (ADR-05 leaves no call between modules or services), so every contract is `TBD - external` until the provider documentation is supplied (§15.6); our-side policy is filled from §12.
>
> **What this chunk is not.** It does not list the client-facing endpoints the web app calls (those are in the List of APIs of §17.1 and §17.4), and it does not hold event contracts (§14).

---

## 15.1 Contract Conventions (platform defaults)

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` for every endpoint we own (URI-prefix versioning; a breaking change is a new major version) | AP-07, ADR-04 |
| Transport | TLS 1.2 or higher on every call | §11.6 |
| Internal authentication | Keycloak client credentials per deployable (OAuth2); no internal contract exists in this release | §6 IAM row, §11.6 |
| Authorization | Per contract type (table below): a permission token from §16 on internal contracts; the provider's scheme on external ones | §16 (chunk 12) |
| Tenant context | Inbound from users: the `tenant_id` token claim. Inbound from partners (API-03, API-06): the partner key in our path, resolved before the signature is verified (ADR-11). Outbound to a provider: the per-tenant provider credential and account identify the tenant. API-05 reads: the user's `tenant_id` attribute must equal the tenant of the event being served. | §11.2, ADR-11 |
| Correlation | `X-Correlation-Id` on every call we make or receive, propagated downstream; W3C `traceparent` for tracing | §11.4 |
| Idempotency | `Idempotency-Key` on every write that touches money, notifications, or an external provider; replay, caller scope, and in-flight rules per the §11.1 idempotency records | AP-02, ADR-10 |
| Content type | `application/json`; errors as `application/problem+json` on endpoints we own | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension on endpoints we own; provider errors are mapped to these codes in the adapter | Platform doctrine (RFC 9457) |
| Resilience | Timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per provider, from §12 | §12 |
| Sync chain depth | At most one synchronous hop; every contract below is a single hop to or from an external system | AP-03, ADR-05 |

### Authorization by contract type

| Type | Authorization value | §16 permission token |
|------|---------------------|----------------------|
| Internal | A permission token from §16, verbatim, checked by the provider | Required |
| Internal (in-process) | A permission token from §16, verbatim, checked at the port | Required |
| External outbound | None on our side: the provider authorizes the call with its own scheme (the Authentication row, `TBD` until the provider documentation is supplied) | None |
| External inbound | Our endpoint verifies the provider's signature or auth scheme, `TBD - external` until the provider documentation is supplied | None |

### Standard headers

| Header | Direction | Required | Format / example | Purpose |
|--------|-----------|----------|------------------|---------|
| `Authorization` | Request | Yes | `Bearer <token>` on our endpoints; provider scheme outbound | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| `X-Correlation-Id` | Request, Response | Yes | UUID | End-to-end correlation |
| `X-Tenant-Id` | Request | No: the tenant is the `tenant_id` token claim | UUIDv7 | Tenant context |
| `Idempotency-Key` | Request | On the writes listed in the Idempotency row | UUID | Safe retries |
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
| API-01 | Look up a receipt | refund-service | POS Records | External outbound | TBD | INT-03; §17.1 Integrations | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | TBD - external |
| API-02 | Pay a refund back to the original card | payout-service | CardPay | External outbound | TBD | INT-01; §17.2 Integrations | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-03 | Receive a payout result | CardPay | payout-service | External inbound | TBD | INT-01; §17.2 Integrations | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-04 | Send an email or SMS | notification-service | MsgHub | External outbound | TBD | INT-02; §17.3 Integrations | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-05 | Read a customer's contact details | notification-service | Keycloak Admin API | External outbound | TBD | INT-04; §17.3 Integrations | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-06 | Receive member purchases | POS Records | loyalty-service | External inbound | TBD | INT-03; §17.4 Integrations | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | TBD - external |

---

## 15.3 Contract Details

### API-01: Look up a receipt (refund-service -> POS Records)

- **Type:** External outbound
- **Purpose:** refund-service reads a receipt's lines, amounts, branch, purchase date, and original payment reference (A-6) to show refundable items and to re-validate a submission ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 2 and 5); §12 INT-03.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records (Retail IT team) API documentation: URI, version, headers, request, response fields (including the original payment reference, A-6), error codes, and authentication scheme; whether a receipt number is unique per retailer or per branch; if per branch, `GET /v1/receipts/{receiptNumber}/refundable-items` takes a required `branchId` query parameter and SCR-01 gains a branch choice (a BRD follow-up for the REFUNDS owner).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD, plus `X-Correlation-Id` and `traceparent` if the provider accepts them |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD; "receipt not found" maps to 404 `RECEIPT_NOT_FOUND` and unavailability to 503 `RECEIPT_LOOKUP_UNAVAILABLE` on the refund-service endpoints (§17.1) |
| Idempotency | Read-only; safe to retry |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-03 (receipt lookup) |
| Fallback when unavailable | The customer is asked to try again later (§12 INT-03) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-02: Pay a refund back to the original card (payout-service -> CardPay)

- **Type:** External outbound
- **Purpose:** payout-service asks CardPay to pay the approved amount back to the card used for the purchase ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 6, E1 retries); §12 INT-01.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme; whether CardPay honours an idempotency key and under which header; whether the response is final or the result arrives through API-03; and how to query a payout whose outcome is unknown; whether CardPay offers a payout report or a query by date for daily reconciliation.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the payout id as the idempotency key on every attempt (ADR-10) |
| Request body | TBD; our side supplies the amount and currency, the original payment reference, and the refund reference number |
| Responses | TBD |
| Error codes | TBD (map each provider code to REFUSED, UNAVAILABLE, or IN_DOUBT in the payout adapter once known) |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-01; retries run inside the ADR-10 retry window |
| Fallback when unavailable | The payout waits for its next attempt; at the end of the window `PAYOUT_FAILED` (§12 INT-01) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-03: Receive a payout result (CardPay -> payout-service)

- **Type:** External inbound
- **Purpose:** CardPay reports the result of a payout to payout-service ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 and E1); §12 INT-01.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay API documentation: transport (callback or polling), our endpoint path, signature or authentication scheme, body, retry and replay rules; which of our identifiers (the idempotency key or the reference number) CardPay returns in the result.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD (when the provider pushes, our path follows the ADR-11 pattern `/v1/partners/{partnerKey}/<resource>`) |
| Version | TBD |
| Authentication | TBD (provider scheme), verified with the secret of the tenant resolved from the partner key (ADR-11) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD |
| Idempotency and replay | Our side: every result is stored in `payout_result` before it is acknowledged. It is matched to its payout by the payout id (sent as the idempotency key) or the refund reference number (sent in the API-02 body), whichever CardPay returns, and otherwise by the provider payout reference. A duplicate result is a no-op. A result that matches no payout stays UNMATCHED with an alarm and is re-matched whenever an API-02 response or status query records a provider payout reference. |
| Credentials storage | Verification secret per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Provider-driven redelivery (TBD) |
| Fallback when unavailable | Payout attempts keep resolving through API-02 status checks, if CardPay offers them |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-04: Send an email or SMS (notification-service -> MsgHub)

- **Type:** External outbound
- **Purpose:** notification-service sends the messages of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 6 and 7, A2, and E1; §12 INT-02.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the MsgHub API documentation: URI per channel, version, headers, request body, responses, error codes, authentication scheme, and idempotency support.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the send-log row id as the idempotency key if MsgHub supports one |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-02; bulkhead per channel |
| Fallback when unavailable | Message retried, then FAILED with an alert; refund state unaffected (§12 INT-02) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-05: Read a customer's contact details (notification-service -> Keycloak Admin API)

- **Type:** External outbound
- **Purpose:** notification-service reads the email, phone, and locale of the customer at send time (ADR-09), for the same use case steps as API-04, and the email of a branch's managers for `REFUND_PAYOUT_FAILED`; §12 INT-04.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Keycloak Admin REST API documentation of the deployed Keycloak version: user read URI, response fields for email, phone, and locale, and the service-account role notification-service needs; the read of the users holding a realm role with a given `branch_id` attribute.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (Keycloak service-account token of notification-service) |
| Request headers | TBD |
| Request body | None expected (read) |
| Responses | TBD |
| Error codes | TBD; an unknown user marks the message FAILED with an alert (§17.3) |
| Idempotency | Read-only; safe to retry |
| Credentials storage | Client secret of the notification-service Keycloak client in the secrets manager (§6) |
| Timeout, retries, circuit breaker | §12 INT-04 |
| Fallback when unavailable | The message waits for its next attempt (§12 INT-04) |
| Source document | TBD (link the Keycloak documentation for the deployed version) |

---

### API-06: Receive member purchases (POS Records -> loyalty-service)

- **Type:** External inbound
- **Purpose:** POS Records delivers the member purchases that earn points ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)), the source of the movements behind [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history); §12 INT-03.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records (Retail IT team) documentation: delivery mode (push, file, or pull), our endpoint path if pushed, fields (member number, purchase reference, amount, currency, branch, purchase time), authentication scheme, and redelivery rules.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD (when the provider pushes, our path follows the ADR-11 pattern `/v1/partners/{partnerKey}/<resource>`) |
| Version | TBD |
| Authentication | TBD (provider scheme), verified with the secret of the tenant resolved from the partner key (ADR-11) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD |
| Idempotency and replay | Our side: idempotent on (`tenant_id`, branch, purchase reference); a redelivered purchase is a no-op |
| Credentials storage | Per tenant in the secrets manager (§6) |
| Timeout, retries, circuit breaker | Provider-driven redelivery (TBD); §12 INT-03 |
| Fallback when unavailable | The balance shows the date of the last movement until the feed catches up (§12 INT-03) |
| Source document | TBD (link the provider's documentation once supplied) |

---

## 15.4 Coverage Matrix

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 - CardPay | API-02, API-03 | Yes |
| §12 | INT-02 - MsgHub | API-04 | Yes |
| §12 | INT-03 - POS Records | API-01, API-06 | Yes |
| §12 | INT-04 - Keycloak Admin API | API-05 | Yes |
| §8.5 | 8.5.1 Submit a refund request - receipt lookup | API-01 | Yes |
| §8.5 | 8.5.1 Submit a refund request - contact lookup | API-05 | Yes |
| §8.5 | 8.5.1 Submit a refund request - send email and SMS | API-04 | Yes |
| §8.5 | 8.5.2 Refund decision and payout - payout | API-02 | Yes |
| §8.5 | 8.5.2 Refund decision and payout - payout result | API-03 | Yes |
| §8.5 | 8.5.1 to 8.5.3 - web app calls to the core | - | Not applicable: client-facing endpoints (§17.1 List of APIs) |
| §17.1 | refund-service - POS Records | API-01 | Yes |
| §17.2 | payout-service - CardPay (outbound) | API-02 | Yes |
| §17.2 | payout-service - CardPay (inbound) | API-03 | Yes |
| §17.3 | notification-service - Keycloak Admin API | API-05 | Yes |
| §17.3 | notification-service - MsgHub | API-04 | Yes |
| §17.4 | loyalty-service - POS Records | API-06 | Yes |

---

## 15.5 Consistency Notes & Drift Register

Method and URI of API-03 and API-06 in the §17.2 and §17.4 List of APIs read `TBD`, matching this chunk; no internal contract exists, so no permission token is checked here; no synchronous chain is deeper than one hop. No open divergence.

| # | Where | Divergence | Status |
|---|-------|------------|--------|
| - | - | None | - |

---

## 15.6 External Contracts Awaiting the User

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-01 | POS Records (Retail IT team) | URI, version, headers, request, response (incl. original payment reference), error codes, auth | POS Records receipt API reference |
| API-02 | CardPay Ltd | URI, version, headers, body, responses, error codes, auth, idempotency support, status query, reconciliation report | CardPay payout (refund-to-card) API reference and sandbox guide |
| API-03 | CardPay Ltd | Transport, our path, signature scheme, body, replay rules | CardPay payout result (callback) documentation |
| API-04 | MsgHub | URI per channel, version, headers, body, responses, error codes, auth, idempotency support | MsgHub email and SMS API reference |
| API-05 | Keycloak (platform IAM) | User read URI, response fields, required service-account role | Keycloak Admin REST API documentation for the deployed version |
| API-06 | POS Records (Retail IT team) | Delivery mode, our path, fields, auth, redelivery rules | POS Records member purchase feed specification |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
