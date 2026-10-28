<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 02 (ecosystem: IAM), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (modules), 12 (roles and permission tokens), 13a-13d (per-module API lists and integrations)
PART OF: SDD - Refunds Platform
PURPOSE: The API contract registry for every synchronous domain or provider integration: module-to-module port calls in the modular monolith, outbound calls to external systems, and inbound calls from external systems.
CONTRACT_RULE: This chunk is canonical. Each 13x chunk lists an integration endpoint or port call with its API ID and never restates its headers, body, or error codes.
EXTERNAL_RULE: A contract whose other side is an external system is TBD - external until the user supplies the provider's API documentation; provider-owned fields are TBD with the marker, never invented. Our-side policy comes from §12.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous domain or provider integration (`API-NN`): three `Internal (in-process)` port contracts between modules, fully defined, and six external contracts with CardPay Ltd, MsgHub, and Point-of-Sale Records, `TBD - external` until the providers' documentation is supplied.
>
> **What this chunk is not.** It does not list client-facing endpoints that only browsers call (each module's List of APIs, §17.X), and it holds no event contract (§14.10).

---

## 15.1 Contract Conventions (platform defaults)

API-NN covers domain/provider integrations, including internal business ports. Standard operational database, Vault and IAM client/admin/token operations are infrastructure configuration in ecosystem/security/operations, not API-NN contracts. A custom business integration cannot claim that exemption.

<!-- Infrastructure boundary for this platform: the PostgreSQL connections, the secrets and key service, and the identity provider's token and staff-directory calls (including the branch manager lookup of the notification module) are operational infrastructure (§6, §11.6, §20), not API-NN contracts. The provider integrations and the module ports are covered. -->

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 principles, platform doctrine |
| Transport | TLS 1.2 or higher on every HTTP call; module ports are in process | §6, §11.6 |
| Internal authentication | Module ports: the calling module's identity in the call context; no HTTP between modules | §6 IAM row, §11.6 |
| Authorization | Per contract type (table below): a permission token from §16 on internal contracts; the provider's scheme on external ones | §16 (chunk 12) |
| Tenant context | Not carried until the tenancy model is set ([§11.2](./07-cross-cutting-concerns.md#112-multi-tenancy-default)) | §11.2 |
| Correlation | `X-Correlation-Id` on every HTTP call and in every port call context, propagated downstream; W3C trace context for tracing | §11.4 |
| Idempotency | `Idempotency-Key` header required on every write that touches money, wallet, notifications, or an external provider | §9 principles, platform doctrine |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes in the table below); an Internal (in-process) contract raises typed errors carrying the same `errorCode` | Platform doctrine (RFC 9457) |
| Resilience | Timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per downstream; values per contract, from §12 for external systems | Platform doctrine; §12 for external systems |
| Sync chain depth | At most one synchronous hop between modules; a deeper chain is a design defect, flagged in §15.5 | §9 principles, platform doctrine |

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
| `X-Tenant-Id` | Request | No (no tenancy model yet, §11.2) | UUIDv7 | Tenant context, once §11.2 is set |
| `Idempotency-Key` | Request | On writes listed above | UUID | Safe retries |
| `traceparent` | Request | Yes | W3C trace context | Distributed tracing |

### Standard error codes

| HTTP status | `errorCode` | Meaning | Retryable | Consumer action |
|-------------|-------------|---------|-----------|-----------------|
| 400 | `VALIDATION_FAILED` | Request fails schema or field validation | No | Fix the request; `errors[]` lists each field |
| 401 | `UNAUTHENTICATED` | Missing or invalid credentials | No (refresh token once) | Obtain a new token, retry once |
| 403 | `FORBIDDEN` | Caller lacks the permission token | No | Do not retry; raise an alert |
| 404 | `NOT_FOUND` | Resource does not exist for this caller | No | Handle as a business outcome |
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
| API-01 | Receipt lookup | refund-request | Point-of-Sale Records | External outbound | TBD | INT-03 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | TBD - external |
| API-02 | Open card dispute lookup | refund-request | payout | Internal (in-process) | `CardDisputePort.findOpenDispute` | [13a § Integrations](./13a-service-refund-request.md#integrations) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |
| API-03 | Customer contact lookup | notification | refund-request | Internal (in-process) | `CustomerContactPort.findContact` | [13c § Integrations](./13c-service-notification.md#integrations) | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |
| API-04 | Send payout | payout | CardPay Ltd | External outbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-05 | Payout result notification | CardPay Ltd | payout | External inbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-06 | Card dispute notification | CardPay Ltd | payout | External inbound | TBD | INT-01 | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-07 | Send customer message | notification | MsgHub | External outbound | TBD | INT-02 | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TBD - external |
| API-08 | Member purchase feed | Point-of-Sale Records | loyalty-points | External inbound | TBD | INT-03 | - | TBD - external |
| API-09 | Approved refunds of a period | payout | refund-request | Internal (in-process) | `RefundOutcomePort.listApprovedRefunds` | [13b § Integrations](./13b-service-payout.md#integrations) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |

---

## 15.3 Contract Details

### API-01: Receipt lookup (refund-request -> Point-of-Sale Records)

- **Type:** External outbound
- **Purpose:** Look up a receipt's items, amounts, branch, purchase date, and how it was paid while the customer enters a receipt number ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 2; [INT-03](./08-integrations.md#12-integrations)).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Point-of-Sale Records API documentation: URI, version, headers, request parameters, response body (receipt, item lines, amounts, branch, purchase date, payment method, original payment reference), responses for an unknown receipt, error codes, and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known; an unknown receipt maps to `RECEIPT_NOT_FOUND`, unreachable to `RECEIPT_LOOKUP_UNAVAILABLE`) |
| Credentials storage | The secrets manager, one credential per environment ([§6](./02-ecosystem-overview.md#6-ecosystem-overview)) |
| Timeout, retries, circuit breaker | [§12 INT-03](./08-integrations.md#12-integrations): 1,500 ms, no retry inside the customer's action |
| Fallback when unavailable | [§12 INT-03](./08-integrations.md#12-integrations): [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E5 |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-02: Open card dispute lookup (refund-request -> payout)

- **Type:** Internal (in-process)
- **Purpose:** Tell the branch manager's decision screen whether the original card payment of a request is disputed ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E3; [13a § Integrations](./13a-service-refund-request.md#integrations)).
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `CardDisputePort` |
| Operation | `findOpenDispute` |
| Request DTO | `OpenDisputeQuery` |
| Response DTO | `OpenDisputeResult` |
| Authorization | `payout.card-dispute.read`, checked at the port |
| Tenant context | Per §15.1; carried in the call context once §11.2 is set |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `OpenDisputeQuery` | originalPaymentRef | string | Yes | max 128 | The original card payment of the request |
| `OpenDisputeResult` | disputed | boolean | Yes | - | True when a dispute on that payment is `OPEN` |
| `OpenDisputeResult` | disputeId | UUIDv7 | No | Present when `disputed` is true | The payout module's dispute ID |
| `OpenDisputeResult` | openedAt | timestamp (UTC) | No | Present when `disputed` is true | When CardPay Ltd reported it |

**Errors raised**

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `ForbiddenPortAccess` | `FORBIDDEN` | The caller's identity lacks the token | No | Configuration defect: alert |
| `DisputeLookupUnavailable` | `UNAVAILABLE` | The payout schema cannot be read | Yes | Answer 503 to the branch manager; take no decision |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | Read-only; repeated calls return the current state |
| Transaction | Runs in its own read-only transaction |

---

### API-03: Customer contact lookup (notification -> refund-request)

- **Type:** Internal (in-process)
- **Purpose:** Give the notification module the contact details of one refund request at the time it builds and sends a message ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 8-9, A1, A2, E1; [13c § Integrations](./13c-service-notification.md#integrations)).
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `CustomerContactPort` |
| Operation | `findContact` |
| Request DTO | `ContactQuery` |
| Response DTO | `ContactResult` |
| Authorization | `refund-request.customer-contact.read`, checked at the port |
| Tenant context | Per §15.1; carried in the call context once §11.2 is set |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `ContactQuery` | refundRequestId | UUIDv7 | Yes | - | The request |
| `ContactResult` | found | boolean | Yes | - | False when the contact was purged ([PSDD/DAT-06.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-06)) |
| `ContactResult` | email | string | No | max 254; personal data | Present when the customer gave one |
| `ContactResult` | mobile | string | No | E.164; personal data | Present when the customer gave one |

**Errors raised**

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `ForbiddenPortAccess` | `FORBIDDEN` | The caller's identity lacks the token | No | Configuration defect: alert |
| `RefundRequestNotFound` | `NOT_FOUND` | No request has that ID | No | The relay sets the message `SKIPPED` |
| `ContactLookupUnavailable` | `UNAVAILABLE` | The refund_request schema cannot be read | Yes | The relay leaves the outbox row unprocessed and retries per §12 INT-02 |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | Read-only; repeated calls return the current contact or `found` false |
| Transaction | Runs in its own read-only transaction, called by the notification relay, never by an event listener |

---

### API-04: Send payout (payout -> CardPay Ltd)

- **Type:** External outbound
- **Purpose:** Send an approved refund to the customer's original card ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8; [INT-01](./08-integrations.md#12-integrations)). Fixed only after CardPay Ltd's written confirmation ([PSDD/COND-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result)).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd API documentation: URI, version, headers, request body (amount, currency, original payment details, merchant account), idempotency header name, responses, error codes (refused, duplicate), and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the attempt's idempotency key (§17.2) in the header CardPay Ltd names |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to `REFUSED`, retryable, or a platform `errorCode` once known) |
| Credentials storage | The secrets manager, per environment; merchant account per CardPay Ltd's answer ([PSDD/QD-04](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)) |
| Timeout, retries, circuit breaker | [§12 INT-01](./08-integrations.md#12-integrations) |
| Fallback when unavailable | [§12 INT-01](./08-integrations.md#12-integrations): the payout stays in the outbox; manual result after the retry limit |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-05: Payout result notification (CardPay Ltd -> payout)

- **Type:** External inbound
- **Purpose:** Receive the result of a payout: accepted, refused, or sent back by the customer's bank ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9 and E1; [INT-01](./08-integrations.md#12-integrations)).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd API documentation: whether results are pushed or must be queried, the endpoint path we expose or the query we call, the signature or authentication scheme, the body (payout reference, our idempotency key, outcome, reason), redelivery behaviour, and error codes.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider signature or scheme, verified by our endpoint) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD |
| Credentials storage | The verification secret in the secrets manager |
| Timeout, retries, circuit breaker | Not applicable on our side for an inbound call; our endpoint answers after storing the notification |
| Fallback when unavailable | The provider's redelivery (TBD); a payout with no result is queried by `payout-retry` if CardPay Ltd offers a query |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-06: Card dispute notification (CardPay Ltd -> payout)

- **Type:** External inbound
- **Purpose:** Receive the opening and the bank's decision of a dispute of an original card payment ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E3 and BR-8: payout waits for a card dispute; [INT-01](./08-integrations.md#12-integrations)).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the CardPay Ltd API documentation, once CardPay Ltd confirms it can report disputes: the endpoint path or query, the signature or authentication scheme, the body (original payment reference, dispute reference, status, decision), redelivery behaviour, and error codes.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider signature or scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD |
| Credentials storage | The verification secret in the secrets manager |
| Timeout, retries, circuit breaker | Not applicable on our side for an inbound call |
| Fallback when unavailable | Until CardPay Ltd reports disputes, `CardDisputePort` knows of none (§17.2) |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-07: Send customer message (notification -> MsgHub)

- **Type:** External outbound
- **Purpose:** Send a customer email or SMS, or the branch manager's message, for a refund status change ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7, [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 8-9, A1, A2, E1; [INT-02](./08-integrations.md#12-integrations)).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the MsgHub API documentation: URI, version, headers, request body (channel, recipient, content or template, sender), idempotency support, responses, delivery reports, error codes, and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD; our side sends the message ID as the idempotency key if MsgHub supports one |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (an invalid recipient maps to a failed message with no retry) |
| Credentials storage | The secrets manager, per environment |
| Timeout, retries, circuit breaker | [§12 INT-02](./08-integrations.md#12-integrations) |
| Fallback when unavailable | [§12 INT-02](./08-integrations.md#12-integrations): recorded as failed; the refund request is untouched |
| Source document | TBD (link the provider's API documentation once supplied) |

---

### API-08: Member purchase feed (Point-of-Sale Records -> loyalty-points)

- **Type:** External inbound
- **Purpose:** Receive the branch purchases of members that earn points ([LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points); [INT-03](./08-integrations.md#12-integrations)). No BRD use case: earning has none ([LOYALTY 05 § Use Case Summary](../brd-loyalty-points/05-user-journeys-overview.md#use-case-summary)).
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the Point-of-Sale Records documentation: whether purchases are pushed, queried, or delivered as a daily file; the endpoint path, query, or file location; the authentication scheme; the record (member, purchase reference, purchase date, branch, amount); redelivery and error handling.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD |
| Credentials storage | The secrets manager, per environment |
| Timeout, retries, circuit breaker | As the provider's mechanism allows ([§12 INT-03](./08-integrations.md#12-integrations)) |
| Fallback when unavailable | Purchases are processed when they arrive, keeping their purchase date ([LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points)) |
| Source document | TBD (link the provider's documentation once supplied) |

---

### API-09: Approved refunds of a period (payout -> refund-request)

- **Type:** Internal (in-process)
- **Purpose:** Give the monthly payout check every refund request approved in a period with its current status ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements); [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 8-9; [13b § Integrations](./13b-service-payout.md#integrations)).
- **Status:** Defined

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `RefundOutcomePort` |
| Operation | `listApprovedRefunds` |
| Request DTO | `ApprovedRefundsQuery` |
| Response DTO | `ApprovedRefundsPage` |
| Authorization | `refund-request.approved-refund.read`, checked at the port |
| Tenant context | Per §15.1; carried in the call context once §11.2 is set |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `ApprovedRefundsQuery` | periodStart | date | Yes | - | The first day of the checked month |
| `ApprovedRefundsQuery` | periodEnd | date | Yes | At most 31 days after periodStart | The last day of the checked period |
| `ApprovedRefundsQuery` | cursor | string | No | max 64 | The page to continue from |
| `ApprovedRefundsQuery` | pageSize | integer | No | 1 to 500, default 200 (recommended) | Rows per page |
| `ApprovedRefundsPage` | items | list of `ApprovedRefund` | Yes | - | The approved refunds of the page |
| `ApprovedRefundsPage` | nextCursor | string | No | Absent on the last page | The next page |
| `ApprovedRefund` | refundRequestId | UUIDv7 | Yes | - | The refund request |
| `ApprovedRefund` | status | string | Yes | `APPROVED`, `PAID`, or `REJECTED` | Its current status |
| `ApprovedRefund` | approvedAmount | `Money` | Yes | - | The approved amount |
| `ApprovedRefund` | approvedAt | timestamp (UTC) | Yes | - | When it was approved |
| `ApprovedRefund` | paidAt | timestamp (UTC) | No | - | When it was paid, if it was |

**Errors raised**

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `ForbiddenPortAccess` | `FORBIDDEN` | The caller's identity lacks the token | No | Configuration defect: alert |
| `RefundOutcomeUnavailable` | `UNAVAILABLE` | The refund_request schema cannot be read | Yes | The check fails its run and retries in the next hour (recommended) |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | Read-only; repeated calls return the current state |
| Transaction | Runs in its own read-only transaction, called by the scheduled check, never by an event listener |

---

## 15.4 Coverage Matrix

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | INT-01 - CardPay Ltd | API-04, API-05, API-06 | Yes |
| §12 | INT-02 - MsgHub | API-07 | Yes |
| §12 | INT-03 - Point-of-Sale Records | API-01, API-08 | Yes |
| §8.5 | §8.5.1 Submit a refund request, receipt lookup and contact lookup | API-01, API-03 | Yes |
| §8.5 | §8.5.2 Approve and pay out, dispute lookup and payout | API-02, API-04, API-05 | Yes |
| §8.5 | §8.5.3 Payout fails, result and messages | API-04, API-05, API-07 | Yes |
| §17.1 | refund-request - Integrations rows | API-01, API-02, API-03, API-09 | Yes |
| §17.2 | payout - Integrations rows | API-02, API-04, API-05, API-06, API-09 | Yes |
| §17.3 | notification - Integrations rows | API-03, API-07 | Yes |
| §17.4 | loyalty-points - Integrations rows | API-08 | Yes |

---

## 15.5 Consistency Notes & Drift Register

No divergence is open: the Method & URI of each contract matches the 13x Lists of APIs (TBD for the external inbound paths), every internal contract's token is in §16.11, and no synchronous chain is deeper than one hop.

---

## 15.6 External Contracts Awaiting the User

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| API-01 | Point-of-Sale Records | URI, version, headers, parameters, response body, error codes, auth | Retail IT team's receipt lookup API reference ([PSDD/QD-05](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)) |
| API-04 | CardPay Ltd | URI, version, headers, body, idempotency header, responses, error codes, auth | CardPay Ltd refund API reference, after its written confirmation ([PSDD/COND-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result), [PSDD/QD-04](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)) |
| API-05 | CardPay Ltd | Push or query, path, signature, body, redelivery, error codes | CardPay Ltd result notification or query reference |
| API-06 | CardPay Ltd | Path or query, signature, body, redelivery, error codes | CardPay Ltd dispute reporting reference, once confirmed |
| API-07 | MsgHub | URI, version, headers, body, idempotency, delivery reports, error codes, auth | MsgHub messaging API reference |
| API-08 | Point-of-Sale Records | Mechanism, path or file, auth, record layout, redelivery | Retail IT team's member purchase feed specification ([PSDD/QD-05](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)) |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->
