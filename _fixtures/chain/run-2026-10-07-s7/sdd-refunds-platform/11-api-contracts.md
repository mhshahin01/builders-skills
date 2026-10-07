<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Platform
VERSION: 1.7
DEPENDS_ON: 02 (ecosystem: IAM, gateway), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (services), 12 (roles and permission tokens), 13a+ (per-service API lists)
PART OF: SDD - Refunds Platform
PURPOSE: The API contract registry for every synchronous integration: service-to-service calls, module-to-module port calls in a modular monolith or hybrid core, outbound calls from a service to an external system, and inbound calls from an external system into a service (callbacks, webhooks). Each HTTP contract states the URI, headers, body, responses, error codes, security, and auth, and each in-process port contract its port interface, operation, DTOs, raised errors, permission token, and behaviour (idempotency and transaction), so both sides implement the same contract with zero drift.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each per-service chunk (13x) lists an HTTP endpoint in its "List of APIs", or an in-process port call in its Integrations table, with the API ID and a link here; it never restates the headers, body, or error codes. Event contracts stay in chunk 10; roles and permission tokens stay in chunk 12 and are referenced here verbatim.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation. Provider-owned fields (URI, headers, body, responses, error codes, auth scheme) are written as `TBD` with the marker `**[TBD - EXTERNAL: ...]**`, never invented. Our-side policy (timeout, retries, circuit breaker, fallback, where credentials are stored) comes from §12 and is filled.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous integration API (`API-NN`), with everything an implementer on either side needs: endpoint, security, headers, parameters, body, responses, error codes, and behaviour (idempotency, timeouts, retries). Internal contracts are fully defined here. External contracts are placeholders marked `TBD - external` for the user to complete from the provider's documentation.
>
> **What this chunk is not.** It does not list client-facing endpoints that no other service or external party calls (those stay in each service's "List of APIs" in chunks 13x and in the OpenAPI specs, §21). It does not hold event contracts (§14, chunk 10).

---

## 15.1 Contract Conventions (platform defaults)

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 principles, platform doctrine |
| Transport | TLS 1.2 or later at the ingress and on every outbound provider call; no network hop between modules | §6, §11.6 |
| Internal authentication | Not applicable between modules (one process). User requests carry a Keycloak access token, validated at the gateway and in the deployable | §6 IAM row, §11.6, ADR-07 |
| Authorization | Per contract type (table below): a permission token from §16 on internal contracts; the provider's scheme on external ones | §16 (chunk 12) |
| Tenant context | Carried on every call: the `tenant_id` token claim on user requests, the call context on in-process ports, and the inbound credentials mapped to a tenant on external inbound calls | §11.2 |
| Correlation | Carried on every call and propagated downstream (`X-Correlation-Id`), into in-process calls and events; W3C trace context for tracing | §11.4 |
| Idempotency | `Idempotency-Key` header required on every write endpoint, including every write that touches money, notifications, or an external provider; an in-process port that writes takes an idempotency key in its request DTO | §9 principles, platform doctrine |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes in the table below); an Internal (in-process) contract raises typed errors carrying the same `errorCode` | Platform doctrine (RFC 9457) |
| Resilience | Timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per downstream; values per contract, from §12 for external systems | Platform doctrine; §12 for external systems |
| Sync chain depth | At most one synchronous hop between services; a deeper chain is a design defect, flagged in §15.5 | §9 principles, platform doctrine |

Platform infrastructure (PostgreSQL, the Keycloak admin client and token endpoint, Vault) is reached through its client libraries under §6 and §11; it is not an integration API and has no `API-NN`.

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
| `Authorization` | Request | Yes on user routes; the provider's scheme on provider routes; none on public routes | `Bearer <token>` | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| `X-Correlation-Id` | Request, Response | Yes | UUID | End-to-end correlation |
| `X-Tenant-Id` | Request | No: the tenant is the token's `tenant_id` claim | UUIDv7 | Tenant context |
| `Idempotency-Key` | Request | On every write | UUID | Safe retries |
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
| API-01 | Look up a receipt | refund-requests | POS Records | External outbound | TBD | INT-03 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | TBD - external |
| API-02 | Report the items of a request | refund-requests | POS Records | External outbound | TBD | INT-03 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-03 | Send a payout | payouts | Payment Provider | External outbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-04 | Receive a payout result | Payment Provider | payouts | External inbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-05 | Send an email or SMS | notifications | Notification Partner | External outbound | TBD | INT-02 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) | TBD - external |
| API-06 | Look up branch manager assignments | refund-requests | Staff sign-in (branch manager access) | External outbound | TBD | INT-05 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-07 | Receive member purchases | POS Records | loyalty-points | External inbound | TBD | INT-03 | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | TBD - external |
| API-08 | Receive membership changes | Member sign-in and membership | loyalty-points | External inbound | TBD | INT-04 | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) | TBD - external |
| API-09 | Receive opening balances | Points balances at go-live | loyalty-points | External inbound | TBD | INT-06 | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | TBD - external |
| API-10 | Broker a member sign-in | Platform IAM (Keycloak, §6) | Member sign-in and membership | External outbound | TBD | INT-04 | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | TBD - external |
| API-11 | Broker a staff sign-in | Platform IAM (Keycloak, §6) | Staff sign-in | External outbound | TBD | INT-05 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) | TBD - external |
| API-12 | Get a customer's contact details | notifications | customer-accounts | Internal (in-process) | `CustomerContactPort.getContact` | 13d § Integrations | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |
| API-13 | Get a branch's recipients | notifications | refund-requests | Internal (in-process) | `BranchRecipientsPort.getRecipients` | 13d § Integrations | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |
| API-14 | Send a message now | customer-accounts | notifications | Internal (in-process) | `MessageDispatchPort.sendNow` (outbound port owned by customer-accounts, implemented by an adapter in notifications) | 13a § Integrations | [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) | Defined |

---

## 15.3 Contract Details

### API-01: Look up a receipt (refund-requests -> POS Records)

- **Type:** External outbound
- **Purpose:** Find the receipt and its items for [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2 (A1, E1 to E5); the information exchanged is in [REFUNDS 08](../brd-refunds-portal/08-integrations.md#integrations); INT-03 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme; confirm that the answer carries the POS Records purchase reference and the original card payment reference the payout needs (R-08, §3 Assumption 3).]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | 2 s timeout, no retry, circuit breaker per §15.1 (§12 INT-03) |
| Fallback when unavailable | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E4: the customer is asked to try again later, never told the receipt is not found (§12 INT-03) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-02: Report the items of a request (refund-requests -> POS Records)

- **Type:** External outbound
- **Purpose:** Tell POS Records the current item state of a portal request, held or freed: [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2 and E1; INT-03 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme; confirm whether POS Records accepts an idempotency key.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | Recorded after commit and sent by the module's send job (§11.1), retried with exponential backoff and jitter; timeout per §12 INT-03 |
| Fallback when unavailable | Kept and retried, with a lag alert (§12 INT-03) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-03: Send a payout (payouts -> Payment Provider)

- **Type:** External outbound
- **Purpose:** Pay an approved refund back to the original card: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 6 and every retry of E1; INT-01 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Payment Provider (CardPay Ltd) API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme; confirm how the original card payment is referenced and that the provider honours an idempotency key on retries (R-04, R-07); which answers are definitive refusals; whether a reused key replays the stored result; whether a payout status query exists.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | Timeout per §12 INT-01; retries with exponential backoff and jitter until the payout deadline (§17.3), one key per attempt kept while its outcome is unknown; circuit breaker per §15.1 (§12 INT-01) |
| Fallback when unavailable | The request stays Approved while retries run, then becomes Payout failed (§12 INT-01) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-04: Receive a payout result (Payment Provider -> payouts)

- **Type:** External inbound
- **Purpose:** Receive the result of a payout: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 and E1; INT-01 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Payment Provider (CardPay Ltd) API documentation: the callback URI and version, headers, request body, the response it expects, error codes, and the signature or authentication scheme; our endpoint path, signature check, and replay protection are defined once the scheme is known.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider signature or scheme, verified by our endpoint) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | The provider retries per its scheme; our endpoint applies each result once by provider reference (§12 INT-01) |
| Fallback when unavailable | The payout stays pending; the retry job keeps the payout deadline (§17.3) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-05: Send an email or SMS (notifications -> Notification Partner)

- **Type:** External outbound
- **Purpose:** Send one email or SMS: [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7, A2, E1, and BR-5, [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) step 4, A3, and E1; INT-02 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Notification Partner (MsgHub) API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme for email and for SMS.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | Codes: one shared 2 s deadline, no retry (§12 INT-02); event-driven messages: timeout and give-up limit per §12 INT-02, retried by the module's send job (§11.1) with backoff and jitter |
| Fallback when unavailable | Codes: [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) E3; later messages wait while customers see the status in [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status) (§12 INT-02) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-06: Look up branch manager assignments (refund-requests -> Staff sign-in)

- **Type:** External outbound
- **Purpose:** Read who is a branch manager, their branch, any cover with its dates, and their email addresses and mobile numbers ([REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints), Assumption 3) for [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-1, BR-5, and BR-6; INT-05 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the documentation of the system that holds branch manager access (INT-05): URI, version, headers, request body, responses, error codes, and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | Timeout per §12 INT-05; retried at the next scheduled refresh |
| Fallback when unavailable | The last synced assignments stay in force, with an alert (§12 INT-05) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-07: Receive member purchases (POS Records -> loyalty-points)

- **Type:** External inbound
- **Purpose:** Receive each member purchase that earns points ([LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations); [LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints), Assumptions 1 and 2) for [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history); INT-03 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the POS Records documentation: how POS Records calls our endpoint (one call per purchase, or a batch per call), the URI and version, headers, body, the expected response, error codes, and the authentication scheme; our endpoint is defined once the scheme is known.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme, verified by our endpoint) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | The sender retries; our endpoint applies each purchase once per purchase reference and member (§12 INT-03) |
| Fallback when unavailable | Purchases wait at the sender; a feed-lag alert pages the on-call engineer (§11.4) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-08: Receive membership changes (Member sign-in and membership -> loyalty-points)

- **Type:** External inbound
- **Purpose:** Receive the date a member leaves or rejoins the program ([LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations)) for [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) E2, [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) E2, and [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) E1; INT-04 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Customer Accounts team's documentation: how the Customer Accounts team calls our endpoint with leave and rejoin notices, the URI and version, headers, body, the expected response, error codes, and the authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme, verified by our endpoint) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | The sender retries; our endpoint applies each notice once per member number, type, and date (§12 INT-04) |
| Fallback when unavailable | Notices wait at the sender |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-09: Receive opening balances (Points balances at go-live -> loyalty-points)

- **Type:** External inbound
- **Purpose:** Receive each member's points at the start of the go-live date, once ([LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations)), for [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) A5 and the balance of [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance); INT-06 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Marketing team: how the Marketing team calls our endpoint with the one-off balances (one call, or a batch of calls), the URI and version, headers, body, the expected response, error codes, and the authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme, verified by our endpoint) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Vault, one secret per tenant (§6 Secrets Management) |
| Timeout, retries, circuit breaker | One batch; the import applies each member once and can run again (§12 INT-06) |
| Fallback when unavailable | None: go-live waits (§11.3) |
| Source document | TBD (link the provider's documentation once supplied) |

---

### API-10: Broker a member sign-in (Platform IAM -> Member sign-in and membership)

- **Type:** External outbound
- **Purpose:** Sign a member in through the member sign-in so the token carries the member number ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)), the precondition of [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history); INT-04 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Customer Accounts team's documentation: the federation protocol and endpoints, the client registration, the claims (member number, membership), and the signing keys.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Keycloak identity provider settings, the client secret in Vault |
| Timeout, retries, circuit breaker | Per the Keycloak broker settings; no retry (§12 INT-04) |
| Fallback when unavailable | Members cannot sign in; Keycloak shows a plain-language error (§12 INT-04) |
| Source document | TBD (link the provider's documentation once supplied) |

---

### API-11: Broker a staff sign-in (Platform IAM -> Staff sign-in)

- **Type:** External outbound
- **Purpose:** Sign a staff member in through the staff sign-in so the token carries the staff identity and the Loyalty Administrator or branch manager role ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies); [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints), Assumption 3), the precondition of [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); INT-05 in §12.
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Retail IT team's documentation: the federation protocol and endpoints, the client registration, the claims (staff identity, roles), and the signing keys.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | Keycloak identity provider settings, the client secret in Vault |
| Timeout, retries, circuit breaker | Per the Keycloak broker settings; no retry (§12 INT-05) |
| Fallback when unavailable | Staff cannot sign in; Keycloak shows a plain-language error |
| Source document | TBD (link the provider's documentation once supplied) |

---

### API-12: Get a customer's contact details (notifications -> customer-accounts)

- **Type:** Internal (in-process)
- **Purpose:** Read the email address and mobile number of the customer a message is for: [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7, A2, and E1; the 13d Integrations row.
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `CustomerContactPort` |
| Operation | `getContact` |
| Request DTO | `CustomerContactQuery` |
| Response DTO | `CustomerContactDto` |
| Authorization | `customer-accounts.contact.read`, checked at the port |
| Tenant context | Per §15.1; carried in the call context |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `CustomerContactQuery` | `customerAccountId` | UUIDv7 | Yes | - | The account a message is for, from the event |
| `CustomerContactDto` | `customerAccountId` | UUIDv7 | Yes | - | Echo of the query |
| `CustomerContactDto` | `email` | string | Yes | Email format, max 254 | The confirmed email address |
| `CustomerContactDto` | `mobileNumber` | string | Yes | E.164 | The confirmed mobile number |

**Errors raised** (typed errors carrying the §15.1 `errorCode`)

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `CustomerAccountNotFound` | `NOT_FOUND` | No account with this id in the tenant | No | Skip the message and log it (§17.4) |
| `CustomerAccountClosed` | `CUSTOMER_ACCOUNT_CLOSED` | The account is closed and holds no contact details | No | Skip the message and log it (§17.4) |
| `PortAccessDenied` | `FORBIDDEN` | The caller lacks `customer-accounts.contact.read` | No | Do not retry; raise an alert |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | Read-only, so a repeated call returns the current contact details and changes nothing |
| Transaction | Runs in its own read-only transaction; the caller holds no transaction open during the call |

---

### API-13: Get a branch's recipients (notifications -> refund-requests)

- **Type:** Internal (in-process)
- **Purpose:** Read the manager and the active cover of a branch with their contact details: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1, BR-5, and BR-6; the 13d Integrations row.
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `BranchRecipientsPort` |
| Operation | `getRecipients` |
| Request DTO | `BranchRecipientsQuery` |
| Response DTO | `BranchRecipientsDto` |
| Authorization | `refund-requests.branch-recipients.read`, checked at the port |
| Tenant context | Per §15.1; carried in the call context |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `BranchRecipientsQuery` | `branchId` | string | Yes | Max 32 | POS Records branch id, from the event |
| `BranchRecipientsQuery` | `onDate` | date | Yes | ISO-8601 | The branch-local date the message is about (§6 Time rule) |
| `BranchRecipientsDto` | `branchId` | string | Yes | - | Echo of the query |
| `BranchRecipientsDto` | `recipients` | array of `BranchRecipient` | Yes | 1 or more | The manager and any cover active on `onDate` |
| `BranchRecipient` | `staffId` | string | Yes | Max 64 | Staff identity from the branch assignments |
| `BranchRecipient` | `role` | enum MANAGER, COVER | Yes | - | Why this person receives the message |
| `BranchRecipient` | `email`, `mobileNumber` | string, string | Yes | Email format; E.164 | Contact details from the last synced branch assignments (§17.2) |

**Errors raised** (typed errors carrying the §15.1 `errorCode`)

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `BranchNotFound` | `NOT_FOUND` | The branch is not in the tenant's branch reference data | No | Skip the message, log it, and alert |
| `NoBranchRecipient` | `BRANCH_HAS_NO_RECIPIENT` | Neither a manager nor an active cover is known for the branch on `onDate` | No | Skip the message and alert (§20.1.10) |
| `PortAccessDenied` | `FORBIDDEN` | The caller lacks `refund-requests.branch-recipients.read` | No | Do not retry; raise an alert |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | Read-only, so a repeated call returns the current recipients and changes nothing |
| Transaction | Runs in its own read-only transaction over the last synced branch assignments; it never calls API-06 |

---

### API-14: Send a message now (customer-accounts -> notifications)

- **Type:** Internal (in-process)
- **Purpose:** Send one confirmation or reset code at once and report the result to the caller: [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) step 4, A3, E1, and E3; the 13a Integrations row.
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `MessageDispatchPort` (owned by customer-accounts; notifications implements it) |
| Operation | `sendNow` |
| Request DTO | `SendNowCommand` |
| Response DTO | `SendNowResult` |
| Authorization | `notifications.message.send`, checked at the port |
| Tenant context | Per §15.1; carried in the call context |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `SendNowCommand` | `idempotencyKey` | string | Yes | Max 64 | One key per code send |
| `SendNowCommand` | `messageType` | enum SIGN_UP_CODE, RESET_CODE | Yes | - | The template to use |
| `SendNowCommand` | `channel` | enum EMAIL, SMS | Yes | - | One address per call |
| `SendNowCommand` | `destination` | string | Yes | Email format, or E.164 for SMS | The address; used for the call and never stored |
| `SendNowCommand` | `code` | string | Yes | 6 digits | Never stored or logged |
| `SendNowCommand` | `deadline` | timestamp | Yes | ISO-8601 UTC | The shared deadline of §12 INT-02 |
| `SendNowResult` | `messageId` | UUIDv7 | Yes | - | The message log row (§17.4) |
| `SendNowResult` | `status` | enum SENT | Yes | - | A send that did not happen raises an error instead |
| `SendNowResult` | `sentAt` | timestamp | Yes | ISO-8601 UTC | |

**Errors raised** (typed errors carrying the §15.1 `errorCode`)

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `NotificationPartnerUnavailable` | `UNAVAILABLE` | The partner did not answer before `deadline`, refused the send, or the code bulkhead is full | No, within this sign-up | Close the sign-up and answer [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) E3 (§17.1) |
| `InvalidDestination` | `VALIDATION_FAILED` | The address is malformed | No | Answer 400 `VALIDATION_FAILED` for the address field |
| `PortAccessDenied` | `FORBIDDEN` | The caller lacks `notifications.message.send` | No | Do not retry; raise an alert |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | On `idempotencyKey`: a repeated call returns the first outcome, the result or the same error, and sends nothing |
| Transaction | Runs in its own transaction (`REQUIRES_NEW`) that records the message outcome; the caller holds no database transaction open during the call (§8.1.1); the call ends by `deadline`, inside the API-14 bulkhead (§17.4) |

---

## 15.4 Coverage Matrix

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 - Payment Provider | API-03, API-04 | Yes |
| §12 | INT-02 - Notification Partner | API-05 | Yes |
| §12 | INT-03 - POS Records | API-01, API-02, API-07 | Yes |
| §12 | INT-04 - Member sign-in and membership | API-08, API-10 | Yes |
| §12 | INT-05 - Staff sign-in | API-06, API-11 | Yes |
| §12 | INT-06 - Points balances at go-live | API-09 | Yes |
| §8.5 | §8.5.1 Submit a refund request: receipt lookup, contact, message, items notice | API-01, API-12, API-05, API-02 | Yes |
| §8.5 | §8.5.2 Refund decision, payout, and points take-back: payout, result, messages | API-03, API-04, API-05 | Yes |
| §8.5 | §8.5.3 Sign-up with confirmation codes: send now, message | API-14, API-05 | Yes |
| §8.5 | §8.5.4 Member views points: brokered sign-in | API-10 | Yes |
| §8.5 | §8.5.5 Correct a member's points: brokered sign-in | API-11 | Yes |
| §17.1 | customer-accounts - notifications (send a code now) | API-14 | Yes |
| §17.1 | customer-accounts - notifications (customer contact, inbound) | API-12 | Yes |
| §17.2 | refund-requests - POS Records (receipt lookup, items notice) | API-01, API-02 | Yes |
| §17.2 | refund-requests - Staff sign-in (branch assignments) | API-06 | Yes |
| §17.2 | refund-requests - notifications (branch recipients, inbound) | API-13 | Yes |
| §17.3 | payouts - Payment Provider (payout, result) | API-03, API-04 | Yes |
| §17.4 | notifications - Notification Partner, customer-accounts, refund-requests | API-05, API-12, API-13, API-14 | Yes |
| §17.5 | loyalty-points - POS Records, member sign-in and membership, go-live import, brokered sign-ins | API-07, API-08, API-09, API-10, API-11 | Yes |

---

## 15.5 Consistency Notes & Drift Register

No divergence between this chunk and chunks 08, 12, and 13a to 13e. No synchronous chain is deeper than one hop: each port call (API-12, API-13, API-14) is one hop, and API-14 is followed only by the external API-05 call. API-14 followed by its API-05 send is the one accepted two-step synchronous path inside a user request (a module port, then the provider); its time budget is in §12 INT-02. The register has no row.

| # | Where | Divergence | Status |
|---|-------|------------|--------|

---

## 15.6 External Contracts Awaiting the User

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-01 | POS Records | URI, version, headers, body, responses, error codes, auth | POS Records receipt lookup API reference |
| API-02 | POS Records | URI, version, headers, body, responses, error codes, auth | POS Records request-items API reference |
| API-03 | Payment Provider (CardPay Ltd) | URI, version, headers, body, responses, error codes, auth, idempotency support | CardPay refund-to-original-card API reference |
| API-04 | Payment Provider (CardPay Ltd) | Callback URI, version, headers, body, expected response, signature scheme | CardPay payout result callback guide |
| API-05 | Notification Partner (MsgHub) | URI, version, headers, body, responses, error codes, auth | MsgHub email and SMS API reference |
| API-06 | Staff sign-in (branch manager access) | URI, version, headers, body, responses, error codes, auth | Branch manager access API reference (INT-05 owner) |
| API-07 | POS Records | Call pattern (one record or a batch per call), URI, version, headers, body, expected response, auth | POS Records member purchase feed specification |
| API-08 | Member sign-in and membership (Customer Accounts team) | Call pattern (one record or a batch per call), URI, version, headers, body, expected response, auth | Membership notice specification |
| API-09 | Points balances at go-live (Marketing team) | Call pattern (one record or a batch per call), URI, version, headers, body, expected response, auth | Opening balance call specification |
| API-10 | Member sign-in and membership (Customer Accounts team) | Federation protocol, endpoints, claims, keys | Member sign-in federation guide |
| API-11 | Staff sign-in (Retail IT team) | Federation protocol, endpoints, claims, keys | Staff sign-in federation guide |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
