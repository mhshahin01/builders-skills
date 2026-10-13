<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 04
PART OF: LLD - Refunds Platform
-->

# 9. API Contracts

> **OpenAPI source of truth:** one OpenAPI 3 document for `refunds-platform-app` (SDD [ADR-04](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions)), written spec-first (SDD AP-07) at `refunds-platform-app/src/main/resources/openapi/refunds-platform.yaml`. CI runs `OpenApiCoverageTest` (Spring Boot test reading `RequestMappingHandlerMapping`): it fails when a controller mapping is missing from the YAML or a YAML path has no mapping. A change to an existing `/v1` operation's parameters, required fields, or responses needs reviewer sign-off as additive (AP-10). springdoc-openapi (generation) and an OpenAPI TypeScript generator are proposed in OQ-01, not adopted.
>
> **Versioning:** URI prefix per CLAUDE.md and SDD [§15.1](../sdd-refunds-platform/11-api-contracts.md#151-contract-conventions-platform-defaults) (`/v1`); a breaking change is `/v2`.

## 9.1 Endpoint Inventory

### Service: `refund-request`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| - | `GET` | `/v1/receipts/{receiptNumber}/refundable-items` | Receipt units with refundable flag and reason | N/A | `refund.receipt.read` | 200, 401, 403, 404, 422, 429, 503 |
| - | `POST` | `/v1/refund-requests` | Submit a refund request | Required | `refund.request.create` | 201, 400, 401, 403, 404, 409, 422, 429, 503 |
| - | `GET` | `/v1/refund-requests` | List own refund requests | N/A | `refund.request.read-own` | 200, 400, 401, 403, 404 |
| - | `GET` | `/v1/refund-requests/{refundRequestId}` | Own request with its history | N/A | `refund.request.read-own` | 200, 400, 401, 403, 404 |
| - | `POST` | `/v1/refund-requests/{refundRequestId}/cancellation` | Cancel an own Submitted request | Required | `refund.request.cancel-own` | 200, 400, 401, 403, 404, 409 |
| - | `GET` | `/v1/branches/{branchId}/refund-requests` | Branch's Submitted requests, oldest first, late flag | N/A | `refund.request.read-branch` | 200, 400, 401, 403, 404 |
| - | `GET` | `/v1/branches/{branchId}/refund-requests/{refundRequestId}` | Branch request detail for a decision | N/A | `refund.request.read-branch` | 200, 400, 401, 403, 404 |
| - | `POST` | `/v1/refund-requests/{refundRequestId}/decision` | Approve (full or partial) or reject | Required | `refund.request.decide` | 200, 400, 401, 403, 404, 409, 422 |
| - | `GET` | `/v1/branches/{branchId}/refund-report` | Branch refund report for a period | N/A | `refund.report.read-branch` | 200, 400, 401, 403, 404 |

Every endpoint above answers 404 `NOT_FOUND` while `REFUNDS_PORTAL_ENABLED` is off (SDD [§11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default)); a receipt from a branch that has not started is 422 `BRANCH_NOT_STARTED`. Controllers: [refund-request § 7.2](./04-implementation/refund-request.md#controllers).

### Service: `payout`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| - | `GET` | `/v1/payouts` | Payouts by status (`Stopped`, `Unknown`) for resolution | N/A | `payout.read` | 200, 400, 401, 403, 404 |
| - | `POST` | `/v1/payouts/{payoutId}/resolutions` | Record a payout result found by checking CardPay | Required | `payout.resolution.record` | 201, 400, 401, 403, 404, 409 |
| - | `POST` | `/v1/payouts/{payoutId}/resolutions/{resolutionId}/confirmation` | Confirm a paid resolution another operator recorded | Required | `payout.resolution.confirm` | 200, 400, 401, 403, 404, 409 |
| [API-02](../sdd-refunds-platform/11-api-contracts.md#api-02-receive-a-payout-result-cardpay-ltd---payout) | TBD | TBD | Receive a payout result from CardPay Ltd (only if CardPay calls back) | N/A (idempotent on the payout id and the provider result id) | - | 200, 400, 401, 404, 500 |
| [API-09](../sdd-refunds-platform/11-api-contracts.md#api-09-receive-card-dispute-notices-cardpay-ltd---payout) | TBD | TBD | Receive card dispute notices from CardPay Ltd (only if CardPay sends them; a fetch has no inbound endpoint) | N/A (idempotent on the dispute id and state) | - | 200, 400, 401, 500 |

The operator endpoints serve `### Workflow: Payout resolution` ([payout § 7.8](./04-implementation/payout.md#workflow-payout-resolution)); 403 also covers `SAME_PERSON_CONFIRMATION`, and 404 also covers a switched-off Refunds Portal (`09-cross-cutting.md` § 12.9). API-02 and API-09 are served by `CardPayResultController` and `CardPayDisputeNoticeController` ([payout § 7.2](./04-implementation/payout.md#controllers)) and are never switched off.

### Service: `customer-notification`

No inbound endpoint (SDD [§17.3 List of APIs](../sdd-refunds-platform/13c-service-customer-notification.md#list-of-apis-swagger-friendly): not applicable). Outbound calls are in the table below; in-process API-06 is in § 9.6.

### Service: `loyalty-points`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| - | `GET` | `/v1/members/me/points-balance` | Own balance, last movement date, timing note | N/A | `loyalty.points.read-own` | 200, 401, 403, 404, 503 |
| - | `GET` | `/v1/members/me/points-movements` | Own movements, newest first | N/A | `loyalty.points.read-own` | 200, 400, 401, 403, 404, 503 |
| - | `GET` | `/v1/members/me/points-movements/{movementId}` | Details behind one movement | N/A | `loyalty.points.read-own` | 200, 400, 401, 403, 404, 503 |
| [API-05](../sdd-refunds-platform/11-api-contracts.md#api-05-receive-member-purchases-pos-records---loyalty-points) | TBD | TBD | Receive member purchases from POS Records (only if POS Records pushes; a fetch has no inbound endpoint) | N/A (idempotent on the purchase reference) | - | 200, 400, 401, 404, 500 |

Every endpoint above answers 404 `NOT_FOUND` while `LOYALTY_POINTS_ENABLED` is off (SDD §11.5); 403 also covers `MEMBERSHIP_ENDED`. Controllers: [loyalty-points § 7.2](./04-implementation/loyalty-points.md#controllers).

### Outbound calls (caller side)

| API ID (§15) | Caller module | Provider | Outbound port | Adapter | Resilience instance (`09-cross-cutting.md` § 12.3) | When |
|--------------|---------------|----------|---------------|---------|------------------------------------------------------|------|
| [API-01](../sdd-refunds-platform/11-api-contracts.md#api-01-request-a-payout-payout---cardpay-ltd) | `payout` | CardPay Ltd | `PayoutGateway` | `CardPayPayoutGatewayAdapter` | `cardpayPayout` | Every attempt, with the round's idempotency key |
| [API-03](../sdd-refunds-platform/11-api-contracts.md#api-03-send-an-email-or-sms-customer-notification---msghub) | `customer-notification` | MsgHub | `MessageGateway` | `MsgHubMessageGatewayAdapter` | `msghubSend` | Every claimed message (per recipient for the branch-manager alert) |
| [API-04](../sdd-refunds-platform/11-api-contracts.md#api-04-look-up-a-receipt-refund-request---point-of-sale-records) | `refund-request` | Point-of-Sale Records | `ReceiptLookupPort` | `PosRecordsReceiptLookupAdapter` | `posReceiptLookup` | Receipt lookup and submission |
| [API-05](../sdd-refunds-platform/11-api-contracts.md#api-05-receive-member-purchases-pos-records---loyalty-points) | `loyalty-points` | POS Records | Not named (the fetch job calls `PurchaseIntakeService.intake` per purchase) | `LoyaltyPurchaseFetchJob` (LLD name) | Not named (bounds per SDD §12 INT-03) | Only if `loyalty-points` fetches the purchases (SDD §17.4 Input) |
| [API-07](../sdd-refunds-platform/11-api-contracts.md#api-07-get-refund-records-for-reconciliation-payout---cardpay-ltd) | `payout` | CardPay Ltd | `CardPayRefundRecordsPort` | `CardPayRefundRecordsAdapter` | `cardpayRefundRecords` | Daily `payout-reconciliation` |
| [API-08](../sdd-refunds-platform/11-api-contracts.md#api-08-find-the-branch-managers-of-a-branch-customer-notification---platform-iam) | `customer-notification` | Platform IAM | `StaffDirectoryPort` (`findBranchManagers`) | `IamStaffDirectoryAdapter` | `iamUserQuery` | Each still-failing alert at send time |
| [API-09](../sdd-refunds-platform/11-api-contracts.md#api-09-receive-card-dispute-notices-cardpay-ltd---payout) | `payout` | CardPay Ltd | `CardPayDisputeNoticesPort` | `CardPayDisputeNoticesAdapter` | `cardpayDisputeNotices` | Only if `payout` fetches the dispute notices (`payout-dispute-fetch`) |

> **Convention:** every write endpoint touching money, notifications, or external providers requires `Idempotency-Key` (CLAUDE.md, SDD §15.1): here the three refund-request writes and the two payout operator writes (SDD [§17.2 API Standards](../sdd-refunds-platform/13b-service-payout.md#api-standards)). The dedup tuple and TTL are in `09-cross-cutting.md` § 12.2. API-02, API-05, and API-09 are provider callbacks with no bearer token and no §16 token: they are idempotent on the provider's own ids (SDD §17.2, §17.4).
>
> **API ID:** `-` for endpoints only the web app calls (SDD §15 does not list them); the owner's 04 file names the controller or client. Status codes 401 and 403 come from the security chain on every bearer endpoint, 400 also from a missing or malformed `Idempotency-Key`, path id, or cursor (`09-cross-cutting.md` § 12.6), and 404 also from the product-enablement guard. A provider-contract field stays as SDD §15 writes it (`TBD - external`, [§15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)).

> TODO: the API-02, API-05, and API-09 method and path are `TBD - external`, and whether CardPay calls back (API-02), reports disputes at all (API-09), and whether POS Records and CardPay push or are fetched (API-05, API-09) are open (SDD [§17.2 Integrations](../sdd-refunds-platform/13b-service-payout.md#integrations), [§17.2 Disputes](../sdd-refunds-platform/13b-service-payout.md#business-logic), [§17.4 Input](../sdd-refunds-platform/13d-service-loyalty-points.md#input)); best guesses for a push `POST /v1/providers/cardpay/payout-results`, `POST /v1/providers/cardpay/dispute-notices`, and `POST /v1/providers/pos-records/member-purchases` - verify once the provider documentation is supplied.

## 9.2 Request / Response Shapes

> **Source:** the SDD names each request and response record (SDD [§17.1](../sdd-refunds-platform/13a-service-refund-request.md#list-of-apis-swagger-friendly), [§17.2](../sdd-refunds-platform/13b-service-payout.md#list-of-apis-swagger-friendly), and [§17.4](../sdd-refunds-platform/13d-service-loyalty-points.md#list-of-apis-swagger-friendly) List of APIs) but leaves their fields open; the fields below are this LLD's proposals per CLAUDE.md REST conventions (records, Bean Validation), as the module files use them.

> TODO: every field below is a best guess for the SDD §17.1, §17.2, and §17.4 List of APIs [NEEDS CLARIFICATION] on request and response fields (solution architect); verify and record them in the SDD.

| Record | Direction | Fields (type, validation) |
|--------|-----------|---------------------------|
| `RefundableItemsResponse` | out | `receiptNumber`, `purchaseDate` (date), `branchId` (string), `currency`, `units[]`: `itemLine` (int), `unitNo` (int), `description`, `itemTypeCode`, `amount` (`Money`), `refundable` (bool), `reasonCode` (nullable: `ALREADY_REQUESTED`, `NOT_REFUNDABLE`); whole-receipt refusals are errors (`BRANCH_NOT_STARTED`, `REFUND_WINDOW_PASSED`, `NOT_PAID_BY_CARD`) |
| `SubmitRefundRequest` | in | `receiptNumber` (`@NotBlank`, max 40), `units[]` (`@NotEmpty`): `itemLine`, `unitNo`, `reason` (`@NotBlank`, max 500), `email` (`@Email`, max 254, nullable), `mobileNumber` (E.164 `@Pattern`, max 16, nullable); class-level check per `REFUND_CONTACT_DETAILS_REQUIRED`: both present (`BOTH`) or at least one (`AT_LEAST_ONE`) |
| `RefundRequestCreated` | out | `refundRequestId`, `referenceNumber`, `status` (`SUBMITTED`), `requestedAmount` (`Money`) |
| `RefundRequestPage` | out | `items[]`: `refundRequestId`, `referenceNumber`, `amount` (`Money`, approved if set, else requested), `status`, `submittedAt`; `nextCursor` (nullable) |
| `RefundRequestDetail` | out | `refundRequestId`, `referenceNumber`, `status`, `requestedAmount`, `approvedAmount` (nullable), `units[]` (requested and approved amounts), `history[]` (from the decision record, in `sequence` order): `status`, `occurredAt`, `amount` (nullable), `reason` (nullable), `rejectionKind` (nullable: `DECISION`, `DISPUTE_REFUNDED`); `cancellable` (bool) |
| `CancelRefundRequest` | in | empty object `{}`, or `note` (nullable free text) |
| `BranchRefundRequestPage` | out | `items[]`: `refundRequestId`, `referenceNumber`, `requestedAmount`, `customerReason`, `submittedAt`, `late` (bool); `nextCursor` |
| `BranchRefundRequestDetail` | out | `refundRequestId`, `receiptNumber`, `purchaseDate`, `units[]` (`unitId`, description, amount), `requestedAmount`, `customerReason`, `openCardDispute` (bool: the original payment has an open card dispute in the dispute copy, REFUNDS/UC-04 E3, AC-15: dispute shown), `ownRequest` (bool, UI disables the decision) |
| `RefundDecision` | in | `outcome` (`APPROVE` or `REJECT`, `@NotNull`), `loweredUnits[]` (`unitId`, `amount` `@Positive`), `reason` (max 500; required for `REJECT` and for an `APPROVE` with lowered units) |
| `BranchRefundReport` | out | `branchId`, `from`, `to`, `countsByStatus` (map), `paidAmount` (`Money`), `averageHoursToDecision`, `averageHoursToPaid` |
| `PayoutPage` | out | `items[]` (`PayoutForResolution`): `payoutId`, `refundRequestId`, `branchId`, `status`, `amount` (`Money`), `roundNo`, `roundKey`, `attemptCount`, `firstAttemptAt`, `lastAttemptAt`, `openResolution` (nullable `PayoutResolution`); `nextCursor`; query `status` (default `STOPPED`, `UNKNOWN`), `cursor`, `limit` (default 50, max 200) |
| `RecordPayoutResolution` | in | `outcome` (`PAID` or `NOT_PAID`, `@NotNull`), `cardPayReferenceChecked` (`@NotBlank`) |
| `ConfirmPayoutResolution` | in | `cardPayReferenceChecked` (`@NotBlank`) |
| `PayoutResolution` | out | `resolutionId`, `payoutId`, `outcome`, `cardPayReferenceChecked`, `recordedBy`, `recordedAt`, `confirmedBy` (nullable), `confirmedAt` (nullable), `status` (`AWAITING_CONFIRMATION`, `AWAITING_APPLICATION`, `APPLIED`, `NOT_APPLIED`, `SUPERSEDED`) |
| `PointsBalance` | out | `balance` (long), `lastMovementDate` (date, nullable), `hasMovements` (bool), `timingNote` (`purchasesBy`, `takeBacksWithin` text keys) |
| `PointsMovementPage` | out | `items[]`: `movementId`, `date`, `kind`, `points` (signed long), `purchaseReference` or `refundReference`; `timingNote`; `nextCursor` |
| `PointsMovementDetail` | out | `movementId`, `kind`, `date`, `points`, `detailsAvailable` (bool), `purchase` (`purchaseDate`, `branchId`, `purchaseReference`, `amount` EUR) or `refund` (`paidDate`, `refundReference`, `purchaseReference`, `refundedAmount` EUR, `pointsTakenBack`) |

**Example: `POST /v1/refund-requests` response 409 (concurrent claim, RFC 9457):**

```json
{
  "type": "{problemBase}/item-already-requested",
  "title": "Item already requested",
  "status": 409,
  "detail": "One of the selected items is already on another refund request. Open the receipt again to see which items you can still choose.",
  "instance": "/v1/refund-requests",
  "errorCode": "ITEM_ALREADY_REQUESTED",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

> **Convention:** all error responses follow RFC 9457 Problem Details with the SDD §15.1 `errorCode` (`09-cross-cutting.md` § 12.6). Amounts are `Money` (`amount` string with 4 decimals, `currency`), SDD [§14.9.0](../sdd-refunds-platform/10-events-hub.md#1490-common-value-objects). The payout operator records carry no customer personal data.

## 9.3 Authentication & Authorisation

- **Token issuer:** the platform IAM (Keycloak, SDD [§6 IAM / AuthN](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview), [ADR-07](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) Proposed): one realm for every person; each person has one identity (`sub`), end customers hold `CUSTOMER` and, once members, `MEMBER`, and staff provisioning adds `BRANCH_MANAGER` (with the `branch_id` attribute) or `PAYOUT_OPERATOR` to the same identity; a staff role requires a second sign-in factor.
- **Token type:** JWT (Bearer), OIDC authorization code with PKCE in the web app.
- **Validation point:** the deployable (no API gateway, SDD §6 API Gateway row): issuer, audience, expiry, signature (SDD [§11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default)); roles map to permission tokens by the one map of SDD ADR-08.
- **Internal HTTP calls:** none (modules call each other in process). The API-06 port checks `refund.contact.read` at the port (`04-implementation/refund-request.md` § 7.2 Authorization, Kind Port), held by the module role `NOTIFICATION_DISPATCHER`. The API-08 staff query uses the confidential IAM client of SDD §11.6, not a module role (SDD [§16.1](../sdd-refunds-platform/12-centralized-user-roles.md#161-business-overview)).
- **Permission tokens:** the endpoint inventory tables above, SDD [§16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide) verbatim: `refund.receipt.read`, `refund.request.create`, `refund.request.read-own`, `refund.request.cancel-own` (`CUSTOMER`); `refund.request.read-branch`, `refund.request.decide`, `refund.report.read-branch` (`BRANCH_MANAGER`); `payout.read`, `payout.resolution.record`, `payout.resolution.confirm` (`PAYOUT_OPERATOR`); `refund.contact.read` (`NOTIFICATION_DISPATCHER`); `loyalty.points.read-own` (`MEMBER`). No endpoint reads `None - public`. API-02, API-05, and API-09 carry no §16 token: they are External inbound contracts verified by the provider's scheme (SDD §15.1 Authorization by contract type).
- **Contextual gates (SDD [§16.2](../sdd-refunds-platform/12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action), applied in each module's domain):** owner (`CUSTOMER`, `MEMBER`), branch (`BRANCH_MANAGER`), not the decider's own request (the request's customer `sub` equals the caller's `sub`: 403 `OWN_REQUEST_DECISION`), membership active (`MEMBER`: 403 `MEMBERSHIP_ENDED`), and not the confirmation of a resolution the caller recorded (`PAYOUT_OPERATOR`: 403 `SAME_PERSON_CONFIRMATION`); `PAYOUT_OPERATOR` sees all branches of the tenant. Another person's record is 404, never 403.
- **Tenant resolution:** the `tenant_id` claim the realm sets; provider callbacks take the tenant of the verification secret that matches (SDD [§11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default)).

## 9.4 Pagination, Sorting, Filtering

- **Pagination:** cursor-based (SDD [§17.1 API Standards](../sdd-refunds-platform/13a-service-refund-request.md#api-standards), [§17.2 API Standards](../sdd-refunds-platform/13b-service-payout.md#api-standards), [§17.4 API Standards](../sdd-refunds-platform/13d-service-loyalty-points.md#api-standards)): `?cursor=<opaque>&size=N` (default 20, max 100; `GET /v1/payouts`: `limit`, default 50, max 200); the cursor encodes the last row's sort key and id.
- **Sorting:** fixed per list, as the use case states: own requests newest first; branch list oldest first ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 2); points movements newest first ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) step 2); payouts for resolution by payout id (UUIDv7). No client-chosen sort.
- **Filtering:** none for the REFUNDS and LOYALTY lists in this release (REFUNDS 11 and LOYALTY 11 leave filters open); `GET /v1/payouts` filters by `status` (`STOPPED`, `UNKNOWN`).
- **Total-count response:** not returned (cursor pagination); the screens do not show totals.

> Confirm: the CLAUDE.md data-table defaults (server-side sorting, export, persistent preferences) are not applied because the SDD fixes cursor pagination and the BRDs leave sorting, export, and filters open (REFUNDS 11, LOYALTY 11 markers).

## 9.5 OpenAPI snippets

> **Convention:** the full OpenAPI document is the hand-written spec-first YAML; snippets are illustrative only.

```yaml
# operationId: submitRefundRequest
# spec: refunds-platform.yaml (spec-first)
post:
  summary: Submit a refund request
  security: [ { bearerAuth: [] } ]
  parameters:
    - in: header
      name: Idempotency-Key
      required: true
      schema: { type: string, format: uuid }
    - in: header
      name: X-Correlation-Id
      required: true
      schema: { type: string, format: uuid }
    - in: header
      name: traceparent
      required: true
      schema: { type: string, pattern: '^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$' }
  requestBody:
    required: true
    content:
      application/json:
        schema: { $ref: '#/components/schemas/SubmitRefundRequest' }
  responses:
    '201': { description: Recorded, content: { application/json: { schema: { $ref: '#/components/schemas/RefundRequestCreated' } } } }
    '404': { description: Refunds Portal switched off, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
    '409': { description: Item already requested or key reused, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
    '422': { description: Branch not started, window passed, or not paid by card, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
    '503': { description: Receipts cannot be checked, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
```

## 9.6 In-Process Port Contracts (SDD §15)

| API ID (§15) | Port interface | Operation | Request / response DTO records | Raised errors (`errorCode`) | Idempotency | Transaction | Permission token (SDD §16) | Implementing adapter |
|--------------|----------------|-----------|--------------------------------|-----------------------------|-------------|-------------|----------------------------|----------------------|
| [API-06](../sdd-refunds-platform/11-api-contracts.md#api-06-get-customer-contact-details-customer-notification---refund-request) | `CustomerContactPort` | `getCustomerContact` | `CustomerContactQuery` / `CustomerContactDto` | `RefundRequestNotFound` (`NOT_FOUND`), `ContactDetailsErased` (`CONTACT_DETAILS_ERASED`), `AccessDenied` (`FORBIDDEN`) | A read; repeated calls return the current contact details | Runs in its own read-only transaction; never joins the caller's | `refund.contact.read` | `CustomerContactPortAdapter` in `refund-request` |

> **Convention:** the provider module's `04-implementation/refund-request.md` § 7.2 lists the port and its adapter and checks the token at the port; `customer-notification` depends on the port interface in `refundsplatform.refundrequest.api` only and calls it as `NOTIFICATION_DISPATCHER`, with the tenant in the call context. The DTO fields are SDD API-06's, not restated. `StaffDirectoryPort` (API-08) is not an in-process contract: it is an outbound port to the platform IAM (External outbound, § 9.1 Outbound calls).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->
