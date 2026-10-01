<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 02 (ecosystem: IAM, gateway), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (services), 12 (roles and permission tokens), 13a+ (per-service API lists)
PART OF: SDD - Refunds Portal
PURPOSE: The API contract registry for every synchronous integration: service-to-service calls, outbound calls from a service to an external system, and inbound calls from an external system into a service (callbacks, webhooks). Each contract states the URI, headers, body, responses, error codes, security, and auth, so both sides implement the same contract with zero drift.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each per-service chunk (13x) lists the endpoint in its "List of APIs" with the API ID and links here; it never restates the headers, body, or error codes. Event contracts stay in chunk 10; roles and permission tokens stay in chunk 12 and are referenced here verbatim.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation. Provider-owned fields (URI, headers, body, responses, error codes, auth scheme) are written as `TBD` with the marker `**[TBD - EXTERNAL: ...]**`, never invented. Our-side policy (timeout, retries, circuit breaker, fallback, where credentials are stored) comes from §12 and is filled.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous integration API (`API-NN`), with everything an implementer on either side needs. In this release every synchronous integration is external: the modules interact in-process through events only (ADR-05), so there is no internal service-to-service or in-process port contract. The four external contracts are placeholders marked `TBD - external` for the user to complete from the providers' documentation.
>
> **What this chunk is not.** It does not list the client-facing endpoints that only the SPA calls (those stay in the §17.1 List of APIs and the OpenAPI specifications, §21). It does not hold event contracts (§14, chunk 10).

---

## 15.1 Contract Conventions (platform defaults)

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` for every endpoint the platform exposes (URI-prefix versioning; a breaking change is a new major version, never an in-place change); provider URIs follow each provider's scheme | §9 AP-07, ADR-04 |
| Transport | HTTPS for every call; no service mesh (one deployable). **[NEEDS CLARIFICATION: minimum TLS version, §11.6.]** | §6, §11.6 |
| Internal authentication | Not applicable: modules interact in-process (ADR-05); no internal HTTP call exists in this release | ADR-01, ADR-05 |
| Client authentication | Keycloak-issued bearer JWT, validated at the gateway and in the application | §6 IAM row, §11.6 |
| External authentication | Each provider's scheme, per contract (TBD - external); credentials in the secrets manager | §6, §11.6 |
| Authorization | Permission tokens from §16, verbatim, on every endpoint a user calls; provider callbacks are authorized by the provider's scheme | §16 (chunk 12) |
| Tenant context | Tenant claim in the JWT for client calls; on every outgoing call in the form each provider supports (per contract, TBD - external) | §11.2 |
| Correlation | `X-Correlation-Id` on every call the platform makes or serves, propagated where the provider accepts it; W3C `traceparent` for tracing | §11.4 |
| Idempotency | `Idempotency-Key` required on every write that touches money, notifications, or an external provider; toward providers, each write reuses a stable key (payout id, message id) in the form the provider supports | §9 AP-02 |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes below); provider errors are mapped to these codes by the adapters | §11.6, ADR-04 |
| Resilience | Resilience4j timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per provider; values per contract, from §12 | §6, §12 |
| Sync chain depth | At most one synchronous hop: a module calls one provider and never chains a synchronous call behind another; any deeper chain is a design defect, flagged in §15.5 | §9 AP-03 |

### Standard headers

| Header | Direction | Required | Format / example | Purpose |
|--------|-----------|----------|------------------|---------|
| `Authorization` | Request | Yes | `Bearer <token>` (client calls); provider scheme on external calls | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| `X-Correlation-Id` | Request, Response | Yes | UUID | End-to-end correlation |
| `Idempotency-Key` | Request | On writes listed above | UUID | Safe retries |
| `traceparent` | Request | Yes | W3C trace context | Distributed tracing |

The tenant travels in the JWT claim on client calls, so no tenant header is defined for them; a provider's tenant or merchant identifier is part of its contract (TBD - external).

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
| API-01 | Look up a receipt | refund | POS Records (Retail IT team) | External outbound | TBD | INT-01; §17.1 Integrations | [UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | TBD - external |
| API-02 | Send a payout to the original card | payout | CardPay Ltd | External outbound | TBD | INT-02; §17.2 Integrations | [UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-03 | Receive a payout result | CardPay Ltd | payout | External inbound | TBD | INT-02; §17.2 Integrations | [UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-04 | Send an email or SMS message | notification | MsgHub | External outbound | TBD | INT-03; §17.3 Integrations | [UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |

---

## 15.3 Contract Details

### API-01: Look up a receipt (refund -> POS Records)

- **Type:** External outbound
- **Purpose:** Check the receipt the customer enters and return its lines, amounts, branch, and purchase date ([UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2 and the re-check at step 5; §17.1 Integrations; INT-01).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records (Retail IT team) API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme. Also confirm whether the response carries the original payment reference that API-02 may need (R-04).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map "receipt not found" to `RECEIPT_NOT_FOUND` and unavailability to `RECEIPT_LOOKUP_UNAVAILABLE`, §17.1, once known) |
| Credentials storage | Service credential in the secrets manager (§6 Secrets Management row) |
| Timeout, retries, circuit breaker | Per §12 INT-01 |
| Fallback when unavailable | Per §12 INT-01 |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-02: Send a payout to the original card (payout -> CardPay Ltd)

- **Type:** External outbound
- **Purpose:** Pay an approved refund back to the card of the original purchase ([UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 6-7 and E1; §17.2 Integrations; INT-02).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay API documentation: URI, version, headers, request body, responses, error codes (and which refusals are final), and authentication scheme. Also confirm: idempotency-key support; a payout status query to resolve an unknown outcome (R-03); and how the original card is referenced, by original payment reference or by receipt (R-04).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Merchant credential in the secrets manager (§6 Secrets Management row) |
| Timeout, retries, circuit breaker | Per §12 INT-02; the payout id is the idempotency key on every attempt (§17.2) |
| Fallback when unavailable | Per §12 INT-02 |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-03: Receive a payout result (CardPay Ltd -> payout)

- **Type:** External inbound
- **Purpose:** Receive CardPay's payout result so the payout completes or is retried ([UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 and E1; §17.2 Integrations; INT-02).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay API documentation: how results are reported (callback, the API-02 response, or polling), the callback URI the platform must expose, the payload, the signature or authentication scheme, and the provider's redelivery behaviour.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD (our endpoint path is defined once the provider's scheme is known) |
| Version | TBD |
| Authentication | TBD (provider signature or credential) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD |
| Idempotency and replay | Results deduplicated on the provider's result identifier; a result for an already `SUCCEEDED` payout is acknowledged and ignored (§17.2). Replay protection: TBD with the provider's scheme |
| Credentials storage | Verification secret or key in the secrets manager (§6 Secrets Management row) |
| Timeout, retries, circuit breaker | Not applicable on our side (inbound); the provider's redelivery: TBD |
| Fallback when unavailable | If results never arrive, the payout dispatcher resolves outcomes through API-02 (§17.2) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-04: Send an email or SMS message (notification -> MsgHub)

- **Type:** External outbound
- **Purpose:** Send the customer messages of [UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6, [UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, and [UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 and A2, and the branch-manager message of [UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 (§17.3 Integrations; INT-03).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the MsgHub API documentation: URI (one endpoint or separate email and SMS endpoints), version, headers, request body, responses, error codes (and which are permanent), authentication scheme, idempotency support, and delivery receipts.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Account credential in the secrets manager (§6 Secrets Management row) |
| Timeout, retries, circuit breaker | Per §12 INT-03; the message id is the idempotency key on every attempt (§17.3) |
| Fallback when unavailable | Per §12 INT-03 |
| Source document | TBD (link the provider's API documentation once supplied) |

---

## 15.4 Coverage Matrix

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 - POS Records | API-01 | Yes |
| §12 | INT-02 - CardPay, payout request | API-02 | Yes |
| §12 | INT-02 - CardPay, payout result | API-03 | Yes |
| §12 | INT-03 - MsgHub | API-04 | Yes |
| §8.5 | §8.5.1-§8.5.4 are pending architect input, so no synchronous edge is drawn yet | - | n/a |
| §17.1 | refund - POS Records row | API-01 | Yes |
| §17.2 | payout - CardPay payout request row | API-02 | Yes |
| §17.2 | payout - CardPay payout result row | API-03 | Yes |
| §17.3 | notification - MsgHub row | API-04 | Yes |

---

## 15.5 Consistency Notes & Drift Register

| # | Where | Divergence | Status |
|---|-------|------------|--------|
| - | API-01 to API-04 vs §12, §17.1-§17.3 List of APIs, §16 | None found: the only exposed integration endpoint (API-03) reads `TBD` in both places; no synchronous module-to-module call exists, so no chain is deeper than one hop | Reconciled 2026-09-28 |

---

## 15.6 External Contracts Awaiting the User

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-01 | POS Records (Retail IT team) | URI, version, headers, body, responses, error codes, auth; whether the original payment reference is returned | POS Records API reference |
| API-02 | CardPay Ltd | URI, version, headers, body, responses, error codes, auth; idempotency support, status query, original-card reference | CardPay payout (refund) API reference and sandbox guide |
| API-03 | CardPay Ltd | Result mechanism, callback URI, payload, signature scheme, redelivery | CardPay result notification (webhook) guide |
| API-04 | MsgHub | URI, version, headers, body, responses, error codes, auth; idempotency support, delivery receipts | MsgHub email and SMS API reference |

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
