<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04
PART OF: LLD - Refunds Platform
-->

# 9. API Contracts

> **OpenAPI source of truth:** contract-first files, written before the code and checked in CI (ADR-04): `refunds-platform-core/src/main/resources/openapi/refunds-platform-core-v1.yaml` (refund and loyalty client endpoints, API-06), `payout-service/src/main/resources/openapi/payout-service-v1.yaml` (API-03).
>
> **Versioning:** URI prefix per CLAUDE.md and ADR-04 (`/v1`). Breaking changes require a new version.
>
> **Homes:** client-facing endpoints are owned by the SDD List of APIs ([SDD §17.1](../sdd-refunds-platform/13a-service-refund.md#171-refund-service), [§17.4](../sdd-refunds-platform/13d-service-loyalty.md#174-loyalty-service)); integration contracts API-01 to API-06 by [SDD §15](../sdd-refunds-platform/11-api-contracts.md#152-contract-index); error codes by [SDD §15.1](../sdd-refunds-platform/11-api-contracts.md#151-contract-conventions-platform-defaults). Method, path, schema names, and permission tokens below match the SDD character for character; this chunk adds idempotency, status codes, JSON shapes, and client classes.

> TODO: best-guess OpenAPI file paths (SDD §21 leaves the repository path open) - verify with the team.

## 9.1 Endpoint Inventory

### Service: `refund-service` (through the gateway user route)

| Method | Path | Summary | Idempotency-Key | Auth Scope | Status Codes |
|--------|------|---------|-----------------|------------|--------------|
| `GET` | `/v1/receipts/{receiptNumber}/refundable-items` | Receipt lines with amounts and a refundable flag | N/A | `refund.receipt.read` | 200, 401, 403, 404 `RECEIPT_NOT_FOUND`, 422 `REFUND_WINDOW_PASSED`, 429 `RATE_LIMITED` (gateway), 503 `RECEIPT_LOOKUP_UNAVAILABLE` |
| `POST` | `/v1/refund-requests` | Submit a refund request | Required | `refund.request.create` | 201, 400, 401, 403, 404 `RECEIPT_NOT_FOUND`, 409 `ITEM_ALREADY_REFUNDED` / `CONFLICT` / `REQUEST_IN_PROGRESS`, 422 `REFUND_WINDOW_PASSED`, 503 `RECEIPT_LOOKUP_UNAVAILABLE` |
| `GET` | `/v1/refund-requests` | List the caller's own refund requests | N/A | `refund.request.read-own` | 200, 400, 401, 403 |
| `GET` | `/v1/refund-requests/{refundId}` | Request detail with status history | N/A | `refund.request.read-own` or `refund.request.read-branch` | 200, 401, 403 (another branch), 404 (another customer or unknown) |
| `POST` | `/v1/refund-requests/{refundId}/cancellation` | Cancel a SUBMITTED request | Required | `refund.request.cancel-own` | 200, 401, 403, 404, 409 `REFUND_ALREADY_DECIDED` / `CONFLICT` / `REQUEST_IN_PROGRESS` |
| `GET` | `/v1/branches/{branchId}/refund-requests` | Branch queue: SUBMITTED oldest first, then failed payouts | N/A | `refund.request.read-branch` | 200, 400, 401, 403 |
| `POST` | `/v1/refund-requests/{refundId}/decision` | Approve in full or in part, or reject | Required | `refund.request.decide` | 200, 400, 401, 403, 404, 409 `REFUND_ALREADY_DECIDED` / `CONFLICT` / `REQUEST_IN_PROGRESS`, 422 `INVALID_PARTIAL_AMOUNT` / `REASON_REQUIRED` |
| `GET` | `/v1/branches/{branchId}/refund-report` | Daily branch refund report (`date` query parameter) | N/A | `refund.report.read-branch` | 200, 400, 401, 403 |

> **Convention:** every write endpoint touching money/wallet/notifications/external-providers requires an `Idempotency-Key` header (CLAUDE.md). The dedup tuple is (`tenant_id`, subject, operation, key) with a 24-hour expiry (SDD §11.1; mechanics 09 § 12.2).

### Service: `loyalty-service`

| Method | Path | Summary | Idempotency-Key | Auth Scope | Status Codes |
|--------|------|---------|-----------------|------------|--------------|
| `GET` | `/v1/members/me/points-balance` | Current balance and date of the last movement | N/A | `loyalty.balance.read-own` | 200, 401, 403, 404 `MEMBER_NOT_FOUND` |
| `GET` | `/v1/members/me/points-movements` | Movements, newest first | N/A | `loyalty.movement.read-own` | 200, 400, 401, 403, 404 `MEMBER_NOT_FOUND` |
| `GET` | `/v1/members/me/points-movements/{movementId}` | One movement with its purchase or refund | N/A | `loyalty.movement.read-own` | 200, 401, 403, 404 `MEMBER_NOT_FOUND` / `NOT_FOUND` |
| TBD (proposed `POST /v1/partners/{partnerKey}/member-purchases`, ADR-11 pattern) | API-06: receive member purchases from POS Records | Natural key (`tenant_id`, branch, purchase reference) | POS Records scheme (`TBD - external`) | 200, 400, 401, 404 |

### Service: `payout-service`

| Method | Path | Summary | Idempotency-Key | Auth Scope | Status Codes |
|--------|------|---------|-----------------|------------|--------------|
| TBD (proposed `POST /v1/partners/{partnerKey}/payout-results`, ADR-11 pattern) | API-03: receive a payout result from CardPay | `payout_result.dedup_key` | CardPay scheme (`TBD - external`) | 200, 400, 401, 404, 500 |

### Service: `notification-service`

No business endpoint (SDD §17.3 List of APIs). Each deployable exposes `/actuator/health/liveness`, `/actuator/health/readiness`, and `/actuator/prometheus` on a management port that is not routed by the gateway.

### Outbound integration clients (external, all `TBD - external`)

| API ID | Caller | Client class | Resilience4j instance | Our-side contract (SDD) |
|--------|--------|--------------|-----------------------|-------------------------|
| API-01 | refund-service | `PosRecordsReceiptAdapter` (+ `PosRecordsClient`) | `posRecords` | [SDD API-01](../sdd-refunds-platform/11-api-contracts.md#api-01-look-up-a-receipt-refund-service---pos-records) |
| API-02 | payout-service | `CardPayPayoutAdapter` (+ `CardPayClient`) | `cardPay` | [SDD API-02](../sdd-refunds-platform/11-api-contracts.md#api-02-pay-a-refund-back-to-the-original-card-payout-service---cardpay) |
| API-04 | notification-service | `MsgHubEmailSender`, `MsgHubSmsSender` (+ `MsgHubClient`) | `msgHubEmail`, `msgHubSms` | [SDD API-04](../sdd-refunds-platform/11-api-contracts.md#api-04-send-an-email-or-sms-notification-service---msghub) |
| API-05 | notification-service | `KeycloakContactDirectoryAdapter` (+ `KeycloakAdminClient`) | `keycloakAdmin` | [SDD API-05](../sdd-refunds-platform/11-api-contracts.md#api-05-read-a-customers-contact-details-notification-service---keycloak-admin-api) |

> TODO: not derivable from inputs - URI, headers, bodies, error codes, and authentication of API-01 to API-06 are `TBD - external` in SDD §15.6; adapters and partner endpoints are built against stubs and completed when the SDD is updated.

## 9.2 Request / Response Shapes

Proposed JSON shapes for the SDD schema names; the Java records are named `<Schema>Dto` (inbound) and `<Schema>Response` (outbound), and the OpenAPI schema keeps the SDD name. `Money` is `{ "amount": "<decimal string, 4 places>", "currency": "<ISO-4217>" }` so no client parses money as a binary float (SDD §6 Money rule).

> Confirm: request and response shapes below are proposals per CLAUDE.md REST conventions (SDD §17.1 and §17.4 name the schemas and a few fields only); verify with the web app team before the OpenAPI files are frozen.

> Confirm: amounts travel as decimal strings in REST and in event payloads (SDD §14.9 types them `decimal(19,4)` without fixing the JSON form); verify with the architect, since every consumer depends on it.

### `GET /v1/receipts/{receiptNumber}/refundable-items` -> `RefundableItems`

```json
{
  "receiptNumber": "string",
  "branchName": "string",
  "purchaseDate": "YYYY-MM-DD",
  "lines": [
    { "lineId": "string", "description": "string", "quantity": 1, "amount": { "amount": "19.9900", "currency": "EUR" }, "refundable": true }
  ]
}
```

### `POST /v1/refund-requests`

**Request body (`CreateRefundRequest`):**

```json
{
  "receiptNumber": "string (required, 1..40)",
  "lineIds": ["string (required, 1..n, distinct)"],
  "reason": "string (required, 1..500)"
}
```

**Response 201 (`RefundRequest`):**

```json
{
  "refundId": "uuid",
  "referenceNumber": "string",
  "status": "SUBMITTED",
  "requestedAmount": { "amount": "39.9800", "currency": "EUR" },
  "approvedAmount": null,
  "submittedAt": "ISO 8601 UTC"
}
```

### `GET /v1/refund-requests/{refundId}` -> `RefundRequestDetail`

```json
{
  "refundId": "uuid",
  "referenceNumber": "string",
  "branchId": "string",
  "receiptNumber": "string",
  "status": "APPROVED",
  "payoutStatus": "PENDING",
  "requestedAmount": { "amount": "39.9800", "currency": "EUR" },
  "approvedAmount": { "amount": "20.0000", "currency": "EUR" },
  "reason": "string",
  "items": [ { "lineId": "string", "description": "string", "quantity": 1, "amount": { "amount": "19.9900", "currency": "EUR" } } ],
  "history": [ { "toStatus": "SUBMITTED", "changedAt": "ISO 8601 UTC", "reason": null } ]
}
```

### `POST /v1/refund-requests/{refundId}/decision`

**Request body (`RefundDecision`):**

```json
{
  "decision": "APPROVE | REJECT (required)",
  "approvedAmount": { "amount": "20.0000", "currency": "EUR" },
  "reason": "string (0..500; required for REJECT and for a partial APPROVE)"
}
```

**Response 200 (`RefundRequest`):** as for `POST /v1/refund-requests`, with the new status.

### `GET /v1/refund-requests`, `GET /v1/branches/{branchId}/refund-requests` -> `RefundRequestPage`

```json
{
  "items": [ { "refundId": "uuid", "referenceNumber": "string", "status": "SUBMITTED", "payoutStatus": "NONE", "payoutFailed": false, "requestedAmount": { "amount": "39.9800", "currency": "EUR" }, "reason": "string", "submittedAt": "ISO 8601 UTC" } ],
  "nextCursor": "opaque string or null"
}
```

### `GET /v1/branches/{branchId}/refund-report?date=YYYY-MM-DD` -> `BranchRefundReport`

```json
{
  "branchId": "string",
  "date": "YYYY-MM-DD",
  "statusChanges": { "SUBMITTED": 0, "APPROVED": 0, "REJECTED": 0, "PAID": 0, "CANCELLED": 0 },
  "amountsPaid": [ { "amount": "0.0000", "currency": "EUR" } ],
  "averageTimeToDecisionSeconds": 0
}
```

### Loyalty: `PointsBalance`, `PointsMovementPage`, `PointsMovementDetail`

```json
{ "balance": 120, "lastMovementAt": "ISO 8601 UTC or null", "hasMovements": true }
```

```json
{
  "items": [ { "movementId": "uuid", "type": "TAKEN_BACK", "points": -50, "occurredAt": "ISO 8601 UTC", "reference": "refund reference or purchase reference" } ],
  "nextCursor": "opaque string or null"
}
```

```json
{
  "movementId": "uuid", "type": "EARNED", "points": 50, "occurredAt": "ISO 8601 UTC",
  "purchase": { "receiptNumber": "string", "branchId": "string", "purchasedAt": "ISO 8601 UTC", "amount": { "amount": "50.0000", "currency": "EUR" } },
  "refund": null
}
```

### Error responses (RFC 9457)

**Response 409 (`REQUEST_IN_PROGRESS`), with header `Retry-After: 1`:**

```json
{
  "type": "{problemBase}/request-in-progress",
  "title": "Request in progress",
  "status": 409,
  "detail": "Your previous request with this key is still being processed. It will be retried automatically.",
  "instance": "/v1/refund-requests",
  "errorCode": "REQUEST_IN_PROGRESS",
  "traceId": "string"
}
```

> **Convention:** all error responses follow RFC 9457 Problem Details with the SDD's `errorCode` extension. See `09-cross-cutting.md` § 12.6 for the canonical envelope.

## 9.3 Authentication & Authorisation

- **Token issuer:** Keycloak, one realm for all tenants (ADR-07); realm name per environment (10 § 13.1).
- **Token type:** JWT (Bearer), OIDC authorization code with PKCE in the web app.
- **Validation point:** the API gateway and again each deployable's Spring Security resource server (ADR-07; not gateway-only).
- **Scope mapping:** the permission tokens in the tables above; the role-to-token catalogue is owned by [SDD §16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide) and implemented as per-module permission maps (11 § 14.4).
- **Tenant resolution:** the `tenant_id` claim; the gateway rejects tokens with an unknown tenant; there is no `X-Tenant-Id` trust from clients (SDD §15.1 standard headers: the tenant is the claim). Partner routes resolve the tenant from the partner key (ADR-11).
- **Contextual gates:** own records (`customer_id` = subject), own branch (`branch_id` claim), own points (`member_id` claim), in the query predicate; outside the scope is 404, except another branch's request, which is 403 (SDD §16.2).

## 9.4 Pagination, Sorting, Filtering

- **Pagination:** cursor-based, `?cursor=<opaque>&limit=<n>` (SDD §17.1, §17.4 API Standards), replacing the template's page/size default. `limit` default 20, maximum 100. The cursor is an opaque base64url encoding of the last row's sort key and id (08 § 11.3); a malformed cursor is 400 `VALIDATION_FAILED`.
- **Sorting:** fixed per endpoint (own requests newest first; branch queue SUBMITTED oldest first, then failed payouts; movements newest first). No client-selected sort in this release.
- **Filtering:** none, except the `date` parameter of the daily report.
- **Total-count response:** not provided (cursor pagination); the web app shows "more" instead of page numbers.

> TODO: best-guess `limit` default 20 and maximum 100 (not stated in SDD §17.1 or §17.4) - verify with the team.

## 9.5 OpenAPI snippets

> **Convention:** the full OpenAPI spec lives at the paths in the header. Snippets in this section are illustrative only - do not maintain in two places.

Operation `createRefundRequest`, file `refunds-platform-core-v1.yaml`, path `/v1/refund-requests` (permission `refund.request.create` is enforced in the code, 11 § 14.4):

```yaml
post:
  operationId: createRefundRequest
  summary: Submit a refund request
  security: [ { keycloak: [] } ]
  parameters:
    - in: header
      name: Idempotency-Key
      required: true
      schema: { type: string, format: uuid }
  requestBody:
    required: true
    content:
      application/json:
        schema: { $ref: '#/components/schemas/CreateRefundRequest' }
  responses:
    '201': { description: Created, content: { application/json: { schema: { $ref: '#/components/schemas/RefundRequest' } } } }
    '409': { description: 'Item already refunded, conflict, or request in progress', content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
    '422': { description: Refund window passed, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
    '503': { description: Receipt lookup unavailable, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
```

<!-- MASTER: lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->
