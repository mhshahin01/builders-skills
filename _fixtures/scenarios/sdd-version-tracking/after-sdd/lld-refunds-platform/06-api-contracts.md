<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04
PART OF: LLD - Refunds Platform
-->

# 9. API Contracts

> **OpenAPI source of truth:** one document for the client-facing endpoints of the core, `refunds-platform-core/core-app/src/main/resources/openapi/refunds-platform-core-v1.yaml` (repository path NEEDS CLARIFICATION in [SDD §21](../sdd-refunds-platform/17-appendix-and-wishlist.md#21-appendix); this is the proposed location).
>
> **Versioning:** URI prefix per CLAUDE.md (`/v1`, `/v2`). Breaking changes require a new version.

## 9.1 Endpoint Inventory

### Service: `refund-service` (module of `refunds-platform-core`)

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| - | `GET` | `/v1/receipts/{receiptNumber}/refundable-items` | Look up a receipt and its refundable items | N/A | `refund.receipt.read` | 200, 400, 401, 403, 404, 422, 429, 503 |
| - | `POST` | `/v1/refund-requests` | Submit a refund request | Required | `refund.request.create` | 201, 400, 401, 403, 404, 409, 422, 503 |
| - | `GET` | `/v1/refund-requests` | List the caller's refund requests | N/A | `refund.request.read-own` | 200, 400, 401, 403 |
| - | `GET` | `/v1/refund-requests/{refundRequestId}` | Get one of the caller's requests with its history | N/A | `refund.request.read-own` | 200, 401, 403, 404 |
| - | `POST` | `/v1/refund-requests/{refundRequestId}/cancellation` | Cancel a Submitted request | Required | `refund.request.cancel-own` | 200, 400, 401, 403, 404, 409 |
| - | `GET` | `/v1/branches/{branchId}/refund-requests` | List the branch's requests, Submitted and oldest first by default | N/A | `refund.request.read-branch` | 200, 400, 401, 403 |
| - | `GET` | `/v1/branches/{branchId}/refund-requests/{refundRequestId}` | Get one of the branch's requests | N/A | `refund.request.read-branch` | 200, 401, 403, 404 |
| - | `POST` | `/v1/branches/{branchId}/refund-requests/{refundRequestId}/decision` | Approve in full or in part, or reject with a reason | Required | `refund.request.decide` | 200, 400, 401, 403, 404, 409, 422 |
| - | `GET` | `/v1/branches/{branchId}/refund-report` | Daily branch refund report for one date | N/A | `refund.report.read-branch` | 200, 400, 401, 403 |
| [API-01](../sdd-refunds-platform/11-api-contracts.md#api-01-look-up-a-receipt-and-its-items-refund-service---pos-records) (client side) | `TBD` | `TBD` | Look up a receipt at POS Records (`PosReceiptHttpAdapter`) | N/A (read) | None (external outbound) | `TBD - external` |

### Service: `loyalty-service` (module of `refunds-platform-core`)

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| - | `GET` | `/v1/members/me/points` | Get the caller's points balance and the date of the last movement | N/A | `loyalty.points.read-own` | 200, 401, 403 |
| - | `GET` | `/v1/members/me/points/movements` | List the caller's points movements, newest first | N/A | `loyalty.points.read-own` | 200, 400, 401, 403 |
| - | `GET` | `/v1/members/me/points/movements/{movementId}` | Get one movement with the purchase or refund it came from | N/A | `loyalty.points.read-own` | 200, 401, 403, 404 |
| [API-04](../sdd-refunds-platform/11-api-contracts.md#api-04-fetch-member-purchases-after-a-cursor-loyalty-service---pos-records) (client side) | `TBD` | `TBD` | Fetch member purchases after a cursor (`PosPurchaseHttpAdapter`) | N/A (read) | None (external outbound) | `TBD - external` |

### Service: `payout-service`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| [API-02](../sdd-refunds-platform/11-api-contracts.md#api-02-send-a-refund-payout-to-the-original-card-payout-service---payment-provider) (client side) | `TBD` | `TBD` | Send a refund payout to the original card (`CardPayPayoutAdapter`) | Payout id on every attempt (provider support `TBD - external`) | None (external outbound) | `TBD - external` |

No inbound business endpoint (SDD §17.2 List of APIs).

### Service: `notification-service`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| [API-03](../sdd-refunds-platform/11-api-contracts.md#api-03-send-a-customer-email-or-sms-notification-service---notification-partner) (client side) | `TBD` | `TBD` | Send a customer email or SMS (`MsgHubAdapter`) | Message id on every attempt (provider support `TBD - external`) | None (external outbound) | `TBD - external` |

No inbound business endpoint (SDD §17.3 List of APIs).

> **Convention:** every write endpoint touching money/wallet/notifications/external-providers requires an `Idempotency-Key` header (CLAUDE.md). The dedup tuple here is `(tenant_id, caller_subject, idempotency_key)` with TTL 24h (09 § 12.2).
>
> **API ID:** the SDD §15 HTTP contract (Type Internal or External) the endpoint implements, linked to its block; `-` for an endpoint no §15 contract covers (for example one only the frontend calls). The owner's 04 file names the controller (provider side) or client (caller side). Permission tokens are SDD §16 tokens, verbatim.

> TODO: API-01 to API-04 are `TBD - external` in [SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user); method, URI, auth scheme, bodies, and error mapping stay open in this LLD until the SDD is updated from the provider documentation - verify then and regenerate this chunk and the four adapters.

## 9.2 Request / Response Shapes

> **Source:** from an SDD, each endpoint links its SDD §15 `API-NN` contract and adds only the implementation delta (DTO records, validation, mapping, client and resilience config); the contract body stays in the SDD (`sdd-to-lld.md` § One fact, one home). Write the full shape below only from code with no SDD, or for an endpoint the SDD does not define (flagged `> Confirm:`; hybrid: `🆕 code-only`).

The client-facing endpoints have no §15 contract, and [SDD §17.1](../sdd-refunds-platform/13a-service-refund.md#list-of-apis-swagger-friendly) and [SDD §17.4](../sdd-refunds-platform/13d-service-loyalty.md#list-of-apis-swagger-friendly) name their body types but leave the fields NEEDS CLARIFICATION, so the fields below are this LLD's proposal. External contracts API-01 to API-04 are referenced, never shaped here.

> Confirm: the record fields below are proposed per CLAUDE.md REST conventions (records, Bean Validation, ISO-8601 UTC instants, amounts as `Money`); verify with the frontend and the architect, then write them into the OpenAPI document.

```java
public record Money(@NotNull @Digits(integer = 15, fraction = 4) BigDecimal amount,
                    @NotBlank @Size(min = 3, max = 3) String currency) {}

public record RefundableItemsView(String receiptNumber, String branchId, LocalDate purchaseDate,
                                  Money refundableCap, List<RefundableLine> lines) {}
public record RefundableLine(String posItemLineId, String description, Money amount, boolean refundable) {}

public record SubmitRefundRequest(@NotBlank @Size(max = 64) String receiptNumber,
                                  @NotEmpty List<@NotBlank String> posItemLineIds,
                                  @NotBlank @Size(max = 500) String reason,
                                  @NotNull @Valid Money expectedAmount) {}

public record CancelRefundRequest() {}

public record RefundDecision(@NotNull DecisionType type,
                             @Valid Money partialAmount,
                             @Size(max = 500) String reason) {}

public record RefundRequestDetail(UUID id, String referenceNumber, RefundStatus status, String branchId,
                                  String receiptNumber, Money requestedAmount, Money approvedAmount,
                                  Money paidAmount, String customerReason, String decisionReason,
                                  boolean payoutFailing, List<RefundItemView> items,
                                  List<StatusChange> history) {}
public record RefundItemView(String posItemLineId, String description, Money amount) {}
public record StatusChange(RefundStatus status, Instant changedAt, String reason) {}

public record RefundRequestPage(List<RefundRequestSummary> items, int page, int size, long totalElements) {}
public record RefundRequestSummary(UUID id, String referenceNumber, Money amount, RefundStatus status,
                                   Instant createdAt) {}

public record BranchRefundRequestPage(List<BranchRefundRequestSummary> items, int page, int size,
                                      long totalElements) {}
public record BranchRefundRequestSummary(UUID id, String referenceNumber, Money requestedAmount,
                                         String customerReason, RefundStatus status, Instant submittedAt,
                                         Instant payoutFailingSince, Instant payoutOutcomeOverdueSince) {}

public record BranchRefundReport(String branchId, LocalDate day, Map<RefundStatus, Long> requestsPerStatus,
                                 Money amountPaid, Duration averageTimeToDecision) {}

public record PointsBalanceView(int points, Instant lastMovementAt) {}
public record PointsMovementPage(List<PointsMovementSummary> items, int page, int size, long totalElements) {}
public record PointsMovementSummary(UUID id, MovementType type, int points, Instant occurredAt,
                                    String purchaseReference, String refundReference) {}
public record PointsMovementDetail(UUID id, MovementType type, int points, Instant occurredAt,
                                   PurchaseView purchase, RefundView refund) {}
public record PurchaseView(String purchaseReference, Money amount, Instant purchasedAt) {}
public record RefundView(String refundReference, UUID refundRequestId) {}
```

**Mapping notes:** `RefundRequestSummary.amount` is the approved amount once approved, else the requested amount; `payoutFailing` is true when `payout_failing_since` or `payout_outcome_overdue_since` is set; `RefundDecision.partialAmount` is required for `APPROVE_PARTIAL` and ignored otherwise; the web app sums `RefundableLine.amount` of the selected refundable lines (capped at `refundableCap`) as `expectedAmount` (SDD §17.1 Submit). No response carries the customer's contact details.

**Response 409 (reused idempotency key, RFC 9457):**

```json
{
  "type": "https://errors.refunds-platform.example/idempotency/key-reused",
  "title": "Idempotency key already used",
  "status": 409,
  "detail": "This Idempotency-Key was already used for a different request. Send the new request with a new key.",
  "instance": "/v1/refund-requests",
  "errorCode": "CONFLICT",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

> **Convention:** all error responses follow RFC 9457 ProblemDetails. See `09-cross-cutting.md` § Error Model for the canonical envelope.

## 9.3 Authentication & Authorisation

- **Token issuer:** Keycloak ([SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) IAM / AuthN row), the single realm of ADR-07 (realm name in Helm values).
- **Token type:** JWT (Bearer).
- **Validation point:** the API gateway for inbound traffic, and again in the core as an OAuth2 resource server (ADR-07; CLAUDE.md keeps cross-cutting edge concerns at the gateway).
- **Internal HTTP calls (SDD §15.1):** none exist in this release (ADR-05), so no client-credentials token is issued; external outbound calls use each provider's own scheme (`TBD - external`). There are no in-process port calls (§ 9.6).
- **Permission tokens:** the endpoint inventory tables above (SDD §16, verbatim). `RolePermissionMapper` maps realm roles to tokens from the seeded `role_permission` tables at start and a `JwtAuthenticationConverter` exposes them as authorities, so `@PreAuthorize("hasAuthority('<token>')")` checks them.
- **Tenant resolution:** `tenant_id` claim in the JWT (the gateway also rejects a token whose tenant differs from the host's, SDD §16.2). No downstream HTTP call carries a tenant: external calls select per-tenant credentials instead (SDD §15.1).

## 9.4 Pagination, Sorting, Filtering

- **Pagination:** server-side, `?page=N&size=N` (default size 20, max 100), per [SDD §17.1 API Standards](../sdd-refunds-platform/13a-service-refund.md#api-standards).
- **Sorting:** `?sort=field,asc|desc`, allow-listed per endpoint (`createdAt` for the customer list, `submittedAt` for the branch queue, `occurredAt` for movements); defaults: customer list newest first, branch queue oldest first, movements newest first.
- **Filtering:** query-param-per-field, applied uniformly: `status` and `payoutFailing` on the branch queue, `date` on the branch report.
- **Total-count response:** `totalElements` in the page record (no `X-Total-Count` header).

## 9.5 OpenAPI snippets

> **Convention:** the full OpenAPI spec lives at `[path]`. Snippets in this section are illustrative only - do not maintain in two places. Cite the operation ID and the spec line.

```yaml
# operationId: submitRefundRequest
# spec: refunds-platform-core-v1.yaml (line assigned when the document is written)
post:
  summary: Submit a refund request
  parameters:
    - in: header
      name: Idempotency-Key
      required: true
      schema: { type: string, format: uuid }
  requestBody:
    required: true
    content:
      application/json:
        schema: { $ref: '#/components/schemas/SubmitRefundRequest' }
  responses:
    '201': { description: Created, content: { application/json: { schema: { $ref: '#/components/schemas/RefundRequestDetail' } } } }
    '409': { description: Amount changed or key reused, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
    '422': { description: Domain rule broken, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
```

## 9.6 In-Process Port Contracts (SDD §15)

Not applicable - no in-process contracts: [SDD §15](../sdd-refunds-platform/11-api-contracts.md#15-service-integration-api-contracts) states that no module calls another module's port in this release, so it defines no `Internal (in-process)` contract. The only module-to-module interaction of the hybrid core is the in-process `RefundPaid` event (07 § 10.6); a future port call gets its own SDD `API-NN` of that type and a row here.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->
