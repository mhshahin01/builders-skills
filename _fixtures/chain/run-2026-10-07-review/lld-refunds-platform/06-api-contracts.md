<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: Refunds Platform
VERSION: 1.3
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 9. API Contracts

## 9.1 Endpoint Inventory

User endpoint definitions live in the corresponding SDD module. API IDs attach only to actual §15 integration contracts; user REST APIs have no invented integration ID.

### Service: `customer-accounts`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |
| - | POST | `/v1/sign-ups` | [`SignUpRequest` / `SignUpResponse`](../sdd-refunds-platform/13a-service-customer-accounts.md#list-of-apis-swagger-friendly) | Required | None - public | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/sign-ups/{signUpId}/confirmation` | [`SignUpConfirmationRequest` / `SignUpConfirmationResponse`](../sdd-refunds-platform/13a-service-customer-accounts.md#list-of-apis-swagger-friendly) | Required | None - public | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/sign-ups/{signUpId}/codes` | [`NewCodeRequest` / `NewCodeResponse`](../sdd-refunds-platform/13a-service-customer-accounts.md#list-of-apis-swagger-friendly) | Required | None - public | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/password-resets` | [`PasswordResetRequest` / `PasswordResetResponse`](../sdd-refunds-platform/13a-service-customer-accounts.md#list-of-apis-swagger-friendly) | Required | None - public | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/password-resets/{passwordResetId}/confirmation` | [`PasswordResetConfirmationRequest` / `PasswordResetConfirmationResponse`](../sdd-refunds-platform/13a-service-customer-accounts.md#list-of-apis-swagger-friendly) | Required | None - public | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/customer-accounts/me` | [- / `CustomerAccountResponse`](../sdd-refunds-platform/13a-service-customer-accounts.md#list-of-apis-swagger-friendly) | Not required | customer-accounts.profile.read | Source module Error Handling; RFC 9457 |

### Service: `loyalty-points`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |
| - | GET | `/v1/points-balance` | [- / `PointsBalanceResponse`](../sdd-refunds-platform/13e-service-loyalty-points.md#list-of-apis-swagger-friendly) | Not required | loyalty-points.balance.read-own | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/points-movements` | [- / `PointsMovementPage`](../sdd-refunds-platform/13e-service-loyalty-points.md#list-of-apis-swagger-friendly) | Not required | loyalty-points.movement.read-own | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/points-movements/{movementId}` | [- / `PointsMovementDetailResponse`](../sdd-refunds-platform/13e-service-loyalty-points.md#list-of-apis-swagger-friendly) | Not required | loyalty-points.movement.read-own | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/members/{memberNumber}/points` | [- / `MemberPointsResponse`](../sdd-refunds-platform/13e-service-loyalty-points.md#list-of-apis-swagger-friendly) | Not required | loyalty-points.member.read | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/members/{memberNumber}/point-corrections` | [`PointCorrectionRequest` / `PointCorrectionResponse`](../sdd-refunds-platform/13e-service-loyalty-points.md#list-of-apis-swagger-friendly) | Required | loyalty-points.correction.create | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/point-correction-reports/{month}` | [- / `CorrectionReport`](../sdd-refunds-platform/13e-service-loyalty-points.md#list-of-apis-swagger-friendly) | Not required | loyalty-points.correction-report.read | Source module Error Handling; RFC 9457 |

### Service: `notifications`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |

### Service: `payouts`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |

### Service: `refund-requests`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
| --- | --- | --- | --- | --- | --- | --- |
| - | POST | `/v1/receipt-lookups` | [`ReceiptLookupRequest` / `ReceiptLookupResponse`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Required | refund-requests.receipt.lookup | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/refund-requests` | [`RefundRequestCreateRequest` / `RefundRequestResponse`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Required | refund-requests.request.create | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/refund-requests` | [- / `RefundRequestPage`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Not required | refund-requests.request.read-own | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/refund-requests/{refundRequestId}` | [- / `RefundRequestDetailResponse`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Not required | refund-requests.request.read-own | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/refund-requests/{refundRequestId}/cancellation` | [`CancellationRequest` / `RefundRequestResponse`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Required | refund-requests.request.cancel-own | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/branch-refund-requests` | [- / `BranchRefundRequestPage`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Not required | refund-requests.branch-request.read | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/branch-refund-requests/{refundRequestId}` | [- / `RefundRequestDetailResponse`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Not required | refund-requests.branch-request.read | Source module Error Handling; RFC 9457 |
| - | POST | `/v1/refund-requests/{refundRequestId}/decision` | [`DecisionRequest` / `RefundRequestResponse`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Required | refund-requests.request.decide | Source module Error Handling; RFC 9457 |
| - | GET | `/v1/branch-refund-reports` | [- / `BranchRefundReport`](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly) | Not required | refund-requests.branch-report.read | Source module Error Handling; RFC 9457 |

### External provider contracts

| API ID (§15) | Method / URI | Shape / authentication home | Implementation adapter |
| --- | --- | --- | --- |
| API-01 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-02 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-03 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-04 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-05 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-06 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-07 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-08 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-09 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-10 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |
| API-11 | TBD - external | [SDD §15](../sdd-refunds-platform/11-api-contracts.md) | Provider-specific anti-corruption adapter only |


> TODO: API-01 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

> TODO: API-02 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

> TODO: API-03 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

> TODO: API-04 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

> TODO: API-05 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

> TODO: API-06 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

> TODO: API-07 stays TBD - external; POS Records calls our provider route (SDD §3 Assumption 8): obtain the call pattern (one record or a batch per call), method, URI, version, headers, body, expected response, error codes, auth scheme and resend behaviour from POS Records ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)) before adapter implementation; a file-only or feed-only delivery is an SDD design change.

> TODO: API-08 stays TBD - external; the Customer Accounts team calls our provider route with leave and rejoin notices (SDD §3 Assumption 8): obtain the call pattern (one record or a batch per call), method, URI, version, headers, body, expected response, error codes, auth scheme and resend behaviour from that team ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)) before adapter implementation; a file-only or feed-only delivery is an SDD design change.

> TODO: API-09 stays TBD - external; the Marketing team calls our provider route with the one-off balances (SDD §3 Assumption 8), verified with the tenant's own Vault secret: obtain the call pattern (one record or a batch per call), method, URI, version, headers, body, expected response, error codes, auth scheme and resend behaviour from the Marketing team ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)) before adapter implementation; a file-only or feed-only delivery is an SDD design change.

> TODO: API-10 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

> TODO: API-11 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation.

## 9.2 Request / Response Shapes

Use the exact named record DTOs and field validation in each linked SDD module API Standards. Source contracts remain the shape home. Transport adapters map records to domain commands; no generic map payloads or entity serialization. Money stays decimal(19,4) plus EUR and dates ISO-8601, with presentation formatting in frontend/messages/export only.

Report transport mapping follows the existing [SDD refund report DTO](../sdd-refunds-platform/13b-service-refund-requests.md#list-of-apis-swagger-friendly): preserve null for each empty average through serialization and exports, rather than a primitive decimal default. [SDD INT-05](../sdd-refunds-platform/08-integrations.md#12-integrations) settles the Retail IT staff source for API-06/API-11 only; their external method, URI, authentication and payload TODOs remain.

## 9.3 Authentication & Authorisation

§7.2 inventories every endpoint token from SDD §16. Public account routes resolve tenant from host and rate-limit; user routes require token tenant/subject and ownership or branch scope. Provider paths authenticate their contract credential and map it to tenant before any lookup. No invented internal HTTP authentication between modules.

## 9.4 Pagination, Sorting, Filtering

Server-side size 20 defaults; whitelisted sorts only. Refund lists and points history have no user filters. Branch Submitted/PAYOUT_FAILED selection implements source [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A3; it does not add arbitrary filtering. History orders by movementDate descending with stable id tie-break, current period only.

## 9.5 OpenAPI snippets

OpenAPI files are planned build artifacts, not present application code. Produce one deployable document with module tags and /v1 user operations; schema references use source DTO names. Provider operations cannot have working paths until their external contracts arrive. Breaking URI/schema changes require /v2, never in-place replacement.

## 9.6 In-Process Port Contracts (SDD §15)

Source [SDD §15](../sdd-refunds-platform/11-api-contracts.md); the following is the permitted implementation binding view. No HTTP headers, status mapping or network resilience on these calls.

| API ID (§15) | Port interface | Operation | Request / response DTO records | Raised errors (errorCode) | Idempotency | Transaction | Permission token (SDD §16) | Implementing adapter |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API-12 | CustomerContactPort | getContact | CustomerContactQuery / CustomerContactDto | CustomerAccountNotFound (NOT_FOUND), CustomerAccountClosed (CUSTOMER_ACCOUNT_CLOSED), PortAccessDenied (FORBIDDEN) | Read only; repeat returns current contacts | Runs in its own read-only transaction; caller holds no DB transaction | customer-accounts.contact.read | CustomerContactPortAdapter in customer-accounts |
| API-13 | BranchRecipientsPort | getRecipients | BranchRecipientsQuery / BranchRecipientsDto | BranchNotFound (NOT_FOUND), NoBranchRecipient (BRANCH_HAS_NO_RECIPIENT), PortAccessDenied (FORBIDDEN) | Read only; repeat returns current recipients | Runs in its own read-only transaction over last-synced assignments; caller holds none; never refreshes API-06 | refund-requests.branch-recipients.read | BranchRecipientsPortAdapter in refund-requests |
| API-14 | MessageDispatchPort (owned by customer-accounts) | sendNow | SendNowCommand / SendNowResult | NotificationPartnerUnavailable (UNAVAILABLE), InvalidDestination (VALIDATION_FAILED), PortAccessDenied (FORBIDDEN) | tenant/key, max 64 characters; repeat first outcome including error; send nothing | Own REQUIRES_NEW outcome persistence; caller holds no DB transaction; provider call outside transaction | notifications.message.send | MessageDispatchPortAdapter in notifications |


<!-- MASTER: refunds-platform-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->
