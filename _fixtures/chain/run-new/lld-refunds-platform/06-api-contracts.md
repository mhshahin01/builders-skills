<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04
PART OF: LLD - Refunds Platform
-->

# 9. API Contracts

> **OpenAPI source of truth:** one contract-first file per deployable with a REST surface: `refunds-platform-core/src/main/resources/openapi/refunds-platform-core.v1.yaml` (refund and loyalty endpoints) and `payout-service/src/main/resources/openapi/payout-service.v1.yaml` (API-03, once CardPay's contract is known). Written before the code and checked in CI against the implementation (AP-07, ADR-04).
>
> **Versioning:** URI prefix per CLAUDE.md and ADR-04 (`/v1`). Breaking changes require a new version.
>
> **Homes:** the client-facing endpoints (method, path, summary, auth scope) are owned by the SDD's List of APIs ([§17.1](../sdd-refunds-platform/13a-service-refund.md#171-refund-service), [§17.4](../sdd-refunds-platform/13d-service-loyalty.md#174-loyalty-service)); the integration contracts API-01 to API-06 by [SDD §15](../sdd-refunds-platform/11-api-contracts.md#152-contract-index); headers and error codes by [SDD §15.1](../sdd-refunds-platform/11-api-contracts.md#151-contract-conventions-platform-defaults). This chunk adds status codes, DTO shapes, and the implementing classes.

> Confirm: the OpenAPI file paths are an LLD proposal (SDD §21 leaves the repository path open), and the CI check of spec against code needs a tool the SDD does not pin (for example an OpenAPI diff or generated server interfaces); ask before adding it.

## 9.1 Endpoint Inventory

### Service: `refund-service` (module of `refunds-platform-core`)

| Method | Path | Summary | Idempotency-Key | Auth Scope | Status Codes |
|--------|------|---------|-----------------|------------|--------------|
| `GET` | `/v1/receipts/{receiptNumber}/refundable-items` | Receipt lines with amounts and a refundable flag | N/A | `refund.receipt.read` | 200, 400, 401, 403, 404, 422, 429, 503 |
| `POST` | `/v1/refund-requests` | Submit a refund request | Required | `refund.request.create` | 201, 400, 401, 403, 404, 409, 422, 503 |
| `GET` | `/v1/refund-requests` | List the caller's own refund requests | N/A | `refund.request.read-own` | 200, 400, 401, 403 |
| `GET` | `/v1/refund-requests/{refundId}` | Request detail with status history | N/A | `refund.request.read-own` or `refund.request.read-branch` | 200, 401, 403, 404 |
| `POST` | `/v1/refund-requests/{refundId}/cancellation` | Cancel a SUBMITTED request | Required | `refund.request.cancel-own` | 200, 400, 401, 403, 404, 409 |
| `GET` | `/v1/branches/{branchId}/refund-requests` | Branch queue: SUBMITTED oldest first, then failed payouts | N/A | `refund.request.read-branch` | 200, 400, 401, 403 |
| `POST` | `/v1/refund-requests/{refundId}/decision` | Approve in full or in part, or reject | Required | `refund.request.decide` | 200, 400, 401, 403, 404, 409, 422 |
| `GET` | `/v1/branches/{branchId}/refund-report` | Daily branch refund report (`date` query parameter) | N/A | `refund.report.read-branch` | 200, 400, 401, 403 |

> **Convention:** every write endpoint that touches money or notifications requires `Idempotency-Key` (CLAUDE.md, AP-02). Dedup tuple (`tenant_id`, `subject`, `operation`, `idempotency_key`), expiry 24 hours, replay and in-flight rules per [SDD §11.1](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default). The key must be a UUID (SDD §15.1 Standard headers), else 400.

### Service: `loyalty-service` (module of `refunds-platform-core`)

| Method | Path | Summary | Idempotency-Key | Auth Scope | Status Codes |
|--------|------|---------|-----------------|------------|--------------|
| `GET` | `/v1/members/me/points-balance` | Current balance and date of the last movement | N/A | `loyalty.balance.read-own` | 200, 401, 403, 404 |
| `GET` | `/v1/members/me/points-movements` | Movements, newest first | N/A | `loyalty.movement.read-own` | 200, 400, 401, 403, 404 |
| `GET` | `/v1/members/me/points-movements/{movementId}` | One movement with its purchase or refund | N/A | `loyalty.movement.read-own` | 200, 401, 403, 404 |
| TBD | TBD (API-06; ADR-11 pattern `/v1/partners/{partnerKey}/<resource>`) | Receive member purchases from POS Records | Natural key (`tenant_id`, branch, purchase reference) | POS Records scheme (TBD - external) | TBD |

### Service: `payout-service`

| Method | Path | Summary | Idempotency-Key | Auth Scope | Status Codes |
|--------|------|---------|-----------------|------------|--------------|
| TBD | TBD (API-03; ADR-11 pattern `/v1/partners/{partnerKey}/<resource>`) | Receive a payout result from CardPay | `payout_result.dedup_key` | CardPay scheme (TBD - external) | TBD |

### Service: `notification-service`

Not applicable for this service: no business endpoint (SDD §17.3); actuator only.

### Outbound integration calls (implementing classes)

| API ID (SDD §15) | Caller | Implementing class | Resilience4j instance | Contract status |
|------------------|--------|--------------------|-----------------------|-----------------|
| [API-01](../sdd-refunds-platform/11-api-contracts.md#api-01-look-up-a-receipt-refund-service---pos-records) | refund-service | `PosReceiptLookupAdapter` | `pos-receipt` | TBD - external |
| [API-02](../sdd-refunds-platform/11-api-contracts.md#api-02-pay-a-refund-back-to-the-original-card-payout-service---cardpay) | payout-service | `CardPayPayoutAdapter` | `cardpay` | TBD - external |
| [API-03](../sdd-refunds-platform/11-api-contracts.md#api-03-receive-a-payout-result-cardpay---payout-service) | CardPay (inbound) | `PayoutResultController` | - | TBD - external |
| [API-04](../sdd-refunds-platform/11-api-contracts.md#api-04-send-an-email-or-sms-notification-service---msghub) | notification-service | `MsgHubMessageSenderAdapter` | `msghub-email`, `msghub-sms` | TBD - external |
| [API-05](../sdd-refunds-platform/11-api-contracts.md#api-05-read-a-customers-contact-details-notification-service---keycloak-admin-api) | notification-service | `KeycloakContactDirectoryAdapter` | `keycloak-admin` | TBD - external |
| [API-06](../sdd-refunds-platform/11-api-contracts.md#api-06-receive-member-purchases-pos-records---loyalty-service) | POS Records (inbound) | `MemberPurchaseController` | - | TBD - external |

> TODO: all six integration contracts are `TBD - external` ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)); the adapters are coded against their ports with WireMock-style stubs (tool to be approved) until the provider documents arrive - verify each adapter against the supplied contract before SIT.

## 9.2 Request / Response Shapes

Money is `{ "amount": "<decimal string>", "currency": "<ISO-4217>" }`; timestamps ISO-8601 UTC; dates ISO-8601 in the tenant's calendar. Java records named in `04-implementation/<service>.md` § 7.2 (OpenAPI schema names from the SDD's List of APIs in parentheses).

> Confirm: the SDD pins only the DTO names and the request fields of `CreateRefundRequest` and `RefundDecision`; every other field below is an LLD proposal per CLAUDE.md REST conventions.

### `GET /v1/receipts/{receiptNumber}/refundable-items` -> `RefundableItemsResponse` (`RefundableItems`)

```json
{
  "receiptNumber": "0040-118273",
  "branchName": "Main Street",
  "purchaseDate": "2026-09-18",
  "lines": [
    { "lineId": "3", "description": "Kettle", "quantity": 1,
      "amount": { "amount": "49.99", "currency": "EUR" }, "refundable": true }
  ]
}
```

### `POST /v1/refund-requests` with `CreateRefundRequestDto` (`CreateRefundRequest`) -> 201 `RefundRequestResponse` (`RefundRequest`)

```json
{ "receiptNumber": "0040-118273", "lineIds": ["3"], "reason": "Damaged" }
```

```json
{
  "id": "0192f1c2-...", "referenceNumber": "RF00001234", "status": "SUBMITTED", "payoutStatus": "NONE",
  "branchId": "0040", "requestedAmount": { "amount": "49.99", "currency": "EUR" }, "approvedAmount": null,
  "submittedAt": "2026-09-28T09:15:00Z", "decidedAt": null, "paidAt": null
}
```

`RefundRequestPageResponse` (`RefundRequestPage`) = `{ "items": [RefundRequest], "nextCursor": "<opaque>" | null }`. `RefundRequestDetailResponse` (`RefundRequestDetail`) = `RefundRequest` plus `reason`, `decisionReason`, `lines[]` (`lineId`, `description`, `quantity`, `amount`), and `history[]` (`status`, `changedAt`).

### `POST /v1/refund-requests/{refundId}/decision` with `RefundDecisionDto` (`RefundDecision`) -> 200 `RefundRequestResponse`

```json
{ "decision": "APPROVE", "approvedAmount": { "amount": "20.00", "currency": "EUR" }, "reason": "One item used" }
```

`approvedAmount` is required for APPROVE (its currency must equal the request's) and ignored for REJECT; `reason` is required for REJECT and for an amount below the requested amount.

**Response 422 (partial amount rule, RFC 9457):**

```json
{
  "type": "{problem-base-uri}/invalid-partial-amount",
  "title": "Invalid partial amount",
  "status": 422,
  "detail": "The amount must be more than 0 and not more than the requested 50.00 EUR. Enter a new amount.",
  "instance": "/v1/refund-requests/0192f1c2-.../decision",
  "errorCode": "INVALID_PARTIAL_AMOUNT",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

### Other responses

| Record (OpenAPI schema) | Fields |
|-------------------------|--------|
| `BranchRefundReportResponse` (`BranchRefundReport`) | `branchId`, `date`, `requestsPerStatus` (map status to count), `amountsPaid[]` (Money per currency), `averageTimeToDecisionSeconds` (number or null) |
| `PointsBalanceResponse` (`PointsBalance`) | `balance` (int), `lastMovementAt` (timestamp or null), `hasMovements` (bool) |
| `PointsMovementPageResponse` (`PointsMovementPage`) | `items[]` (`id`, `type`, `points` signed int, `occurredAt`, `reference` = purchase reference or refund reference number), `nextCursor` |
| `PointsMovementDetailResponse` (`PointsMovementDetail`) | `id`, `type`, `points`, `occurredAt`, and either `purchase` (`receiptNumber`, `branchId`, `purchaseDate`, `amount`) or `refund` (`referenceNumber`, `paidAmount`, `paidAt`) |

> TODO: best guess reference-number format `RF` + 8-digit zero-padded value of `refund.reference_number_seq` (10 characters, within varchar(20)); the SDD only says "human-readable" - verify with the REFUNDS owner.

## 9.3 Authentication & Authorisation

- **Token issuer:** Keycloak, one realm for all tenants (ADR-07); realm name per environment (not pinned).
- **Token type:** JWT (Bearer), OIDC authorization code with PKCE in the web app.
- **Validation point:** the API gateway **and** each deployable (ADR-07, defence in depth); the core is a Spring Security OAuth2 resource server validating issuer, signature (JWKS), expiry, and the presence of `tenant_id`.
- **Scope mapping:** realm roles map to the permission tokens of [SDD §16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide) through each module's versioned permission map (`09-cross-cutting.md` § 12.1); endpoints check `@PreAuthorize("hasAuthority('<token>')")`; ownership gates run in the service and in the query (ADR-08).
- **Tenant resolution:** the `tenant_id` claim; partner routes resolve the tenant from the partner key (ADR-11). `X-Tenant-Id` is never trusted from a client (SDD §15.1).

## 9.4 Pagination, Sorting, Filtering

- **Pagination:** cursor-based, `?cursor=<opaque>&limit=<n>` (SDD §17.1, §17.4); `limit` default 20, maximum 100; the response carries `nextCursor`, null on the last page. The cursor is a base64url encoding of the last row's sort key, signed with an HMAC so a client cannot forge an offset into another scope.
- **Sorting:** fixed per endpoint by the BRD rules (own requests newest first; branch queue oldest SUBMITTED first, then failed payouts; movements newest first). No client sort parameter in `v1`.
- **Filtering:** none in `v1` (the BRDs name no filter).
- **Total-count:** not returned (cursor pagination).

> Confirm: CLAUDE.md asks tables for server-side sorting, bulk actions, and CSV/Excel export; the BRDs fix the orders, bulk approval is a REFUNDS/UC-04 future enhancement, and no BRD asks for export, so `v1` offers none of them (`14-frontend.md` § 17.4).

## 9.5 OpenAPI snippets

> **Convention:** the full OpenAPI spec lives in the files named at the top. The snippet is illustrative only; the spec is the one place to maintain it.

```yaml
# operationId: decideRefundRequest (refunds-platform-core.v1.yaml)
/v1/refund-requests/{refundId}/decision:
  post:
    summary: Approve in full or in part, or reject
    security: [ { keycloak: [ refund.request.decide ] } ]
    parameters:
      - { in: path, name: refundId, required: true, schema: { type: string, format: uuid } }
      - { in: header, name: Idempotency-Key, required: true, schema: { type: string, format: uuid } }
      - { in: header, name: X-Correlation-Id, required: false, schema: { type: string, format: uuid } }
    requestBody:
      required: true
      content: { application/json: { schema: { $ref: '#/components/schemas/RefundDecision' } } }
    responses:
      '200': { description: Decided, content: { application/json: { schema: { $ref: '#/components/schemas/RefundRequest' } } } }
      '403': { description: Another branch, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
      '409': { description: Already decided or key conflict, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
      '422': { description: Partial amount or reason rule, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
```

> **Convention:** the spec carries no use case ID; the `@UseCase` value of each handler has one home, `04-implementation/<service>.md` § 7.2, read from SDD §7.3.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->
