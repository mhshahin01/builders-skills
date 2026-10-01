<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04
PART OF: LLD - Refunds Platform
-->

# 9. API Contracts

> **OpenAPI source of truth:** one OpenAPI document per module with REST endpoints, `src/main/resources/openapi/refund-v1.yaml` and `src/main/resources/openapi/loyalty-v1.yaml` (SDD ADR-04, AP-07).
>
> **Versioning:** URI prefix per CLAUDE.md (`/v1`, `/v2`). Breaking changes require a new version.

> TODO: the OpenAPI repository path is open in SDD §21; best guess: one YAML per module under `src/main/resources/openapi/` of the deployable, spec-first - verify.

## 9.1 Endpoint Inventory

### Service: `refund`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| - | `GET` | `/v1/receipts/{receiptNumber}/refundable-items` | Receipt lines with their refundability | N/A | `refund.receipt.read` | 200, 401, 403, 404, 422, 503 |
| - | `POST` | `/v1/refund-requests` | Submit a refund request | Required | `refund.request.create` | 201, 400, 401, 403, 409, 422, 503 |
| - | `GET` | `/v1/refund-requests` | The caller's requests, newest first | N/A | `refund.request.read` | 200, 400, 401, 403 |
| - | `GET` | `/v1/refund-requests/{refundId}` | One request with its status history | N/A | `refund.request.read` | 200, 401, 403, 404 |
| - | `POST` | `/v1/refund-requests/{refundId}/cancellation` | Cancel a Submitted request | Required | `refund.request.cancel` | 200, 400, 401, 403, 404, 409 |
| - | `GET` | `/v1/branches/{branchId}/refund-requests` | Submitted requests of the branch, oldest first | N/A | `refund.request.read` | 200, 400, 401, 403 |
| - | `POST` | `/v1/refund-requests/{refundId}/decision` | Approve in full or in part, or reject | Required | `refund.request.decide` | 200, 400, 401, 403, 404, 409, 422 |
| - | `GET` | `/v1/branches/{branchId}/refund-report` | Branch refund report for one day (`date`) | N/A | `refund.report.read` | 200, 400, 401, 403 |

Outbound (caller side, `refund`):

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| [API-02](../sdd-refunds-platform/11-api-contracts.md#api-02-look-up-receipt-refund---pos-records) | TBD - external | TBD - external | Look up receipt (POS Records); client `PosReceiptAdapter` | N/A (read) | None (provider scheme) | TBD - external |

### Service: `payout`

No REST endpoint (SDD §17.2). Inbound: the in-process port API-01 (§ 9.6). Outbound (caller side):

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| [API-03](../sdd-refunds-platform/11-api-contracts.md#api-03-send-refund-payout-payout---cardpay) | TBD - external | TBD - external | Send refund payout (CardPay); client `CardPayAdapter` | The payout ID | None (provider scheme) | TBD - external |

### Service: `notification`

No REST endpoint and no port (SDD §17.3). Outbound (caller side):

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| [API-04](../sdd-refunds-platform/11-api-contracts.md#api-04-send-message-notification---msghub) | TBD - external | TBD - external | Send message, email or SMS (MsgHub); client `MsgHubAdapter` | The notification ID | None (provider scheme) | TBD - external |

### Service: `loyalty`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| - | `GET` | `/v1/members/me/points` | Current balance and date of the last movement | N/A | `loyalty.balance.read` | 200, 401, 403 |
| - | `GET` | `/v1/members/me/points-movements` | Movements, newest first | N/A | `loyalty.movement.read` | 200, 400, 401, 403 |
| - | `GET` | `/v1/members/me/points-movements/{movementId}` | One movement with its purchase or refund | N/A | `loyalty.movement.read` | 200, 400, 401, 403, 404 |

> **Convention:** every write endpoint touching money/wallet/notifications/external-providers requires an `Idempotency-Key` header (CLAUDE.md). The dedup tuple is `(tenant_id, idempotency_key)` with the TTL of `09-cross-cutting.md` § 12.2 (open in SDD §17.1; best guess 24h).
>
> **API ID:** the SDD §15 HTTP contract (Type Internal or External) the endpoint implements, linked to its block; `-` for an endpoint no §15 contract covers (for example one only the frontend calls). The owner's 04 file names the controller (provider side) or client (caller side). Permission tokens are SDD §16 tokens, verbatim.

> TODO: API-02, API-03, and API-04 stay TBD - external until the provider documentation is supplied (SDD §15.6); the clients are designed against their ports only - verify once the contracts exist.

## 9.2 Request / Response Shapes

> **Source:** from an SDD, each endpoint links its SDD §15 `API-NN` contract and adds only the implementation delta (DTO records, validation, mapping, client and resilience config); the contract body stays in the SDD (`sdd-to-lld.md` § One fact, one home). Write the full shape below only from code with no SDD, or for an endpoint the SDD does not define (flagged `> Confirm:`; hybrid: `🆕 code-only`).

No client endpoint has an SDD §15 contract (the SDD keeps them in the module List of APIs). The request bodies are the SDD's ([§17.1 Business Logic, write bodies](../sdd-refunds-platform/13a-service-refund.md#business-logic)); this LLD adds only validation. The response bodies are named in SDD §17.1 and §17.4 but not shaped, so this LLD proposes them.

| Record (Java, OpenAPI schema) | Fields | Validation / notes |
|-------------------------------|--------|--------------------|
| `RefundRequestCreate` (SDD) | `receiptNumber`, `items[]` (`posLineId`), `reason` | `@NotBlank @Size(max = 64)` number; `@NotEmpty` items, each `posLineId` `@Size(max = 64)`, no duplicates; `@NotBlank @Size(max = 500)` reason |
| `RefundDecision` (SDD) | `outcome` (`APPROVE` or `REJECT`), `amount` (Money, partial approval only), `reason` | `@NotNull` outcome; amount `amount > 0`, scale <= 2, ISO 4217 currency; reason `@Size(max = 500)`, required for a rejection and a partial approval (checked in the service, 422) |
| `Money` (SDD §14.9.0) | `amount` (decimal string), `currency` | Serialized as a string to keep scale |
| `RefundableReceipt` | `receiptNumber`, `branchId`, `purchasedAt`, `currency`, `cardPaidAmount`, `lines[]` (`posLineId`, `description`, `quantity`, `amount`, `refundable`) | Proposed |
| `RefundRequestCreated` | `refundId`, `referenceNumber`, `status`, `requestedAmount`, `createdAt` | Proposed |
| `RefundRequestPage` | `items[]` (`refundId`, `referenceNumber`, `status`, `requestedAmount`, `approvedAmount`, `reason`, `createdAt`), `nextCursor` | Proposed; `reason` shown in the branch queue (REFUNDS/UC-04 step 2) |
| `RefundRequestDetail` | page item fields plus `receiptNumber`, `branchId`, `items[]`, `decisionReason`, `history[]` (`toStatus`, `changedAt`, `reason`) | Proposed; history gives the date of each change and the rejection reason (REFUNDS/UC-02 step 4) |
| `BranchRefundReport` | `branchId`, `date`, `requestsPerStatus` (map of status to count), `amountPaid`, `averageTimeToDecisionSeconds` | Proposed |
| `PointsBalanceResponse` (schema `PointsBalance`) | `balance` (integer), `lastMovementAt` (nullable) | Proposed |
| `PointsMovementPage` | `items[]` (`movementId`, `occurredAt`, `type`, `points`, `purchaseReference`, `refundReference`), `nextCursor` | Proposed; negative points for TAKE_BACK |
| `PointsMovementDetail` | page item fields plus `source` (`kind` PURCHASE or REFUND, `reference`, `date`, `amount`) | Proposed |

> Confirm: the response shapes are proposed per CLAUDE.md REST conventions (records, ISO-8601 UTC timestamps, Money as amount and currency); SDD §17.1 and §17.4 name the schemas but do not shape them.

**Response 409 (idempotency conflict, RFC 9457):**

```json
{
  "type": "/problems/idempotency/conflict",
  "title": "Idempotency key reused",
  "status": 409,
  "detail": "This Idempotency-Key was already used for a different request. Send a new key for a new request.",
  "instance": "/v1/refund-requests",
  "errorCode": "CONFLICT",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

> **Convention:** all error responses follow RFC 9457 ProblemDetails. See `09-cross-cutting.md` § Error Model for the canonical envelope.

## 9.3 Authentication & Authorisation

- **Token issuer:** Keycloak ([SDD §6 IAM / AuthN row](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview)), one realm for customers, members, and branch managers (ADR-07).
- **Token type:** JWT (Bearer).
- **Validation point:** the API gateway for inbound traffic, and again in the deployable (ADR-07: JWT validated at the gateway and in the deployable), with Spring Security's resource server against the realm's JWKS.
- **Internal HTTP calls (SDD §15.1):** none in this release (SDD §15.1 Internal authentication). In-process port calls check the token at the port (04 § 7.2 Authorization, Kind Port): `PayoutPort.requestPayout` checks `payout.payout.request`.
- **Permission tokens:** the endpoint inventory tables above (SDD §16, verbatim).
- **Tenant resolution:** `tenant_id` claim in JWT (a token without it gets 403 `FORBIDDEN`, SDD §16.8 rule 5); there are no downstream internal HTTP calls to carry it; in-process port calls carry it in `CallContext`.

## 9.4 Pagination, Sorting, Filtering

- **Pagination:** server-side, cursor-based (SDD ADR-04): `?cursor=<opaque>&size=N` (default size 20, max 100); the response carries `nextCursor`, null on the last page. The cursor encodes the sort key and the row ID (keyset pagination).
- **Sorting:** fixed per endpoint (SDD §17.1, §17.4): the customer's requests and the member's movements newest first, the branch queue oldest first; no client-selected sort.
- **Filtering:** none in this release.
- **Total-count response:** not provided (cursor pagination).

> Confirm: CLAUDE.md asks for sortable tables with export and bulk actions, while the SDD fixes the sort order and lists bulk approval as a future enhancement (SDD §17.1); this LLD follows the SDD.

## 9.5 OpenAPI snippets

> **Convention:** the full OpenAPI spec lives at `[path]`. Snippets in this section are illustrative only - do not maintain in two places. Cite the operation ID and the spec line.

```yaml
# operationId: decideRefundRequest
# spec: src/main/resources/openapi/refund-v1.yaml (path /v1/refund-requests/{refundId}/decision)
post:
  summary: Approve in full or in part, or reject
  parameters:
    - in: path
      name: refundId
      required: true
      schema: { type: string, format: uuid }
    - in: header
      name: Idempotency-Key
      required: true
      schema: { type: string, format: uuid }
  requestBody:
    required: true
    content:
      application/json:
        schema: { $ref: '#/components/schemas/RefundDecision' }
  responses:
    '200': { description: Decided, content: { application/json: { schema: { $ref: '#/components/schemas/RefundRequestDetail' } } } }
    '409': { description: Already decided or key reused, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
    '422': { description: Amount or reason rule broken, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
```

## 9.6 In-Process Port Contracts (SDD §15)

| API ID (§15) | Port interface | Operation | Request / response DTO records | Raised errors (`errorCode`) | Permission token (SDD §16) | Implementing adapter |
|--------------|----------------|-----------|--------------------------------|-----------------------------|----------------------------|----------------------|
| [API-01](../sdd-refunds-platform/11-api-contracts.md#api-01-request-payout-refund---payout) | `PayoutPort` | `requestPayout` | `RequestPayoutCommand` / `PayoutAccepted` | `InvalidPayoutRequestException` (`VALIDATION_FAILED`), `PayoutNotPermittedException` (`FORBIDDEN`), `PayoutConflictException` (`CONFLICT`) | `payout.payout.request` | `PayoutPortAdapter` in `payout` |

> **Convention:** the provider module's `04-implementation/<module>.md` § 7.2 lists the port and its adapter, and its Authorization table checks the token at the port (Kind Port). Caller modules depend on the port interface only.

LLD delta: the port and its DTO and error records live in package `payout.api` (the only `payout` package `refund` may import, verified by the module boundary test); the adapter runs with `MANDATORY` propagation so the call cannot run outside the caller's transaction ([payout § 7.6](./04-implementation/payout.md#76-transaction-boundaries)).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->
