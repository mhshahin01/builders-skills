<!--
CHUNK: 11
TITLE: Security
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 14. Security

> **Convention:** platform-wide auth lives in `09-cross-cutting.md` § 12.1. This chunk covers data classification, PII handling, secrets, and threat notes. Security defaults are SDD [§11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default).

## 14.1 Data Classification

| Class | Description | Examples in this LLD | Handling |
|-------|-------------|----------------------|----------|
| Public | No restriction | Problem `type` URIs, reason codes | None |
| Internal | Staff and module use | Refund status, amounts, branch ids, payout status, payout resolution status, message status | TLS in transit; owner or branch gate on every read; payout data only to `PAYOUT_OPERATOR` |
| Confidential | Restricted by role | `tenant_id`, `customer_sub`, IAM user ids, reference number, receipt number, purchase and refund references, original-payment reference, CardPay, dispute, and POS references; the serialized events in `event_publication.payload` (purchase and payment data of `RefundRequestPaid` and the card dispute events, SDD §14.10) | TLS; never in a response to another owner or branch; never logged (SDD §17.1, §17.4 Logging); payment reference masked; the operations role has no `SELECT` on `event_publication.payload` (SDD [§16.4.3](../sdd-refunds-platform/12-centralized-user-roles.md#1643-platform-plane-operator---outside-tenant-tenancy)) |
| Secret / PII | Personal data | Customer email and mobile number; member identifier and purchase details; branch managers' email addresses read through API-08 (memory only) | TLS + storage encryption; never logged or in event payloads (SDD §11.6: no contact or member data in the SDD §14.10 committed fields); masked outside Prod; the operations role has no `SELECT` on these columns (SDD §16.4.3) |
| Secret (credentials) | Provider and IAM secrets | `*_CREDENTIALS`, `*_SECRET` | Secrets manager only (§ 14.3) |

## 14.2 PII Inventory

| Service | Table | Column | Classification | Encryption | Masking in non-prod |
|---------|-------|--------|----------------|------------|---------------------|
| `refund-request` | `refund_request_contact` | `email` | PII | Storage encryption of the PostgreSQL offering | Yes: replaced with `masked+<id>@example.invalid` in UAT copies |
| `refund-request` | `refund_request_contact` | `mobile_number` | PII | Storage encryption | Yes: replaced with a fixed test number |
| `refund-request`, `payout` | `event_publication` | `payload` | Confidential, not PII: the SDD §14.10 committed fields carry no contact or member data | Storage encryption | No: synthetic or masked source data only |
| `loyalty-points` | `points_account` | `member_id` | PII | Storage encryption | Yes: hashed |
| `loyalty-points` | `received_purchase` | `member_id`, `purchase_date`, `branch_id`, `amount` | PII (purchase details) | Storage encryption | Yes: member id hashed, amounts kept |
| `loyalty-points` | `processed_refund`, `parked_takeback` | `purchase_reference`, `refunded_amount`, `paid_date` | PII (purchase details) | Storage encryption | Yes: references hashed |
| `customer-notification` | (none) | - | No PII stored: customer contact details (API-06) and branch-manager email addresses (API-08) pass through memory only | - | - |
| `payout` | (none) | - | No PII: the original-payment reference is not a card number (SDD §17.2) | - | - |

> PII columns follow the SDD Data Encryption lists ([§17.1](../sdd-refunds-platform/13a-service-refund-request.md#data-encryption), [§17.2](../sdd-refunds-platform/13b-service-payout.md#data-encryption), [§17.3](../sdd-refunds-platform/13c-service-customer-notification.md#data-encryption), [§17.4](../sdd-refunds-platform/13d-service-loyalty-points.md#data-encryption)); the masking rules are LLD choices.

> Confirm: PII inventory is complete - verify with security review; `refund_request.customer_sub` and `receipt_number` and the unit `description` returned by API-04 are treated as Confidential, not PII.

## 14.3 Secrets Management

| Secret | Source | Rotation cadence | Rotation procedure |
|--------|--------|------------------|---------------------|
| Module database passwords (4 roles) | Secrets manager (open, SDD §6) | Open (SDD §11.6 marker) | RB-03 in `10-operations.md` |
| CardPay credentials, callback secret, and dispute-notice secret (per tenant) | Secrets manager | Open | RB-03 |
| MsgHub credentials (per tenant) | Secrets manager | Open | RB-03 |
| POS Records credentials and purchase secret (per tenant) | Secrets manager | Open | RB-03 |
| IAM admin client secret (`customer-notification`, API-08 staff read) | Secrets manager | Open | RB-03 |
| TLS certificates | Hosting load balancer | Managed by the hosting service | Automated |

> TODO: rotation cadence for every secret is the SDD [§11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) [NEEDS CLARIFICATION] (product owner); best guess 90 days - verify.

> **Convention:** secrets never appear in the repository, logs, or error responses.

## 14.4 Authentication / Authorisation Decisions

> Inherits SDD §11.6 and [§16](../sdd-refunds-platform/12-centralized-user-roles.md#16-centralized-user-roles--authorities-platform-wide). Per-module authorisation is in each `04-implementation/<module>.md` § 7.2 `### Authorization`.

| Concern | Decision |
|---------|----------|
| Public-facing endpoints | None without a token, except the provider callbacks API-02, API-05, and API-09 (provider scheme verified per tenant) and Actuator health probes (not routed through the load balancer's public listener) |
| Service-to-service | Not applicable in process: API-06 checks `refund.contact.read` at the port; the API-08 staff query uses the IAM client of SDD §11.6, whose only right is reading the users that hold a staff role |
| Cross-tenant queries | Forbidden at the application layer; query-helper `tenant_id` predicate checked by ArchUnit (proposed) and the per-module database role |
| Staff sign-in | One realm for end customers and staff; a staff role (`BRANCH_MANAGER`, `PAYOUT_OPERATOR`) requires a second sign-in factor (SDD [ADR-07](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions), Proposed) |
| Payout operator endpoints | `GET /v1/payouts` (`payout.read`), `POST /v1/payouts/{payoutId}/resolutions` (`payout.resolution.record`), `POST /v1/payouts/{payoutId}/resolutions/{resolutionId}/confirmation` (`payout.resolution.confirm`), role `PAYOUT_OPERATOR`, all branches of the tenant (SDD [§16.4.2](../sdd-refunds-platform/12-centralized-user-roles.md#1642-staff-roles)); a paid resolution is applied only after a second operator confirms it, and the operator who recorded it is refused with 403 `SAME_PERSON_CONFIRMATION` (SDD [§16.5](../sdd-refunds-platform/12-centralized-user-roles.md#165-capability-matrix-canonical) footnote 5) |
| Operations access | No other admin endpoint; operations act through infrastructure access with the SDD §16.4.3 rules: no `SELECT` on personal-data columns or `event_publication.payload`, updates to operational columns only (publication-log listener rows and message status), payout resolutions only through the operator endpoints, break-glass for anything wider, logged with who, when, and why |
| Another owner's or branch's record | 404 to customers and members (existence not revealed); 403 `FORBIDDEN` to a branch manager for another branch (SDD [§17.1 Error Handling](../sdd-refunds-platform/13a-service-refund-request.md#error-handling)) |
| Product switched off | 404 `NOT_FOUND` on the product's endpoints (`09-cross-cutting.md` § 12.9) |

## 14.5 Threat Notes

| Threat | Mitigation | Owner |
|--------|------------|-------|
| Receipt enumeration by a signed-in customer | Per-caller rate limit across replicas; `UnusualReceiptNotFound` alert (SDD §17.1 API Standards) | `refund-request` |
| Forged CardPay result marking a payout succeeded | Signature verified per tenant before any processing; unknown payout id 404; reconciliation daily | `payout` |
| Forged CardPay dispute notice holding or cancelling payouts | API-09 signature verified per tenant before any processing; a repeated or older state is a no-op (dispute id and state rank) | `payout` |
| One operator recording and confirming a paid payout result | Own-resolution gate: 403 `SAME_PERSON_CONFIRMATION`; the payout changes only when `payout-retry` applies a confirmed row | `payout` |
| Forged POS purchase earning points | API-05 provider scheme verified per tenant; purchase reference unique | `loyalty-points` |
| Idempotency-key reuse across tenants or callers | Dedup tuple `(tenant_id, idempotency_key)` plus request hash plus `caller_sub` check (`09-cross-cutting.md` § 12.2) | `refund-request`, `payout` |
| Branch manager deciding own request | Own-request gate compares the request's customer `sub` with the caller's `sub`; each person has one identity in the one realm, so a branch manager's own request is always found (SDD ADR-07, Proposed) | `refund-request` |
| IAM staff client reading end customers | The API-08 client may read only the users that hold a staff role (SDD §11.6); whether the settled IAM supports that limit is the SDD API-08 `TBD - external` marker | `customer-notification` |
| Personal data or business references in logs or events | Logging field allow-list of internal ids (`09-cross-cutting.md` § 12.7); event DTOs carry the SDD §14.10 committed fields only, with no contact or member data | All |
| Operations reading personal or payment data | No `SELECT` on personal-data columns or `event_publication.payload`; break-glass logged (SDD §16.4.3) | All |
| SQL injection | Parameterised `JdbcClient` statements only; no dynamic filters | All |

> TODO: full threat model - not written (SDD [§21](../sdd-refunds-platform/17-appendix-and-wishlist.md#21-appendix) Threat Model row: not created yet); verify or replace with a link once it exists.

## 14.6 Compliance

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR or other data-protection law | Open; each product's Prod gate needs its BRD's legal confirmation, and the hosting location is chosen only after the law is named (SDD [§11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default)) | Retention and erasure through the purge jobs (`05-data-model.md` § 8.6) once the law and periods are set |
| PCI-DSS | Not applicable while no card number is stored or passed (SDD §17.1, §17.2 Compliance) | Only the original-payment reference is handled |
| ISO 27001 / SOC 2 | Not applicable for this release (SDD §17.x Compliance) | - |
| Local regulations | Consumer refund rights open (REFUNDS/UC-01 BR-8: consumer law); the tax and accounting records of each paid refund are open (REFUNDS/NFR-07, SDD [§18.5](../sdd-refunds-platform/14-performance-and-capacity.md#185-nfr-targets)); SMS rules follow the applicable law | `12-performance.md` § 15.1 NFR targets |

> TODO: which data-protection law applies, its lawful basis, and erasure duties are the SDD [§17.1 Compliance](../sdd-refunds-platform/13a-service-refund-request.md#compliance) [NEEDS CLARIFICATION] (REFUNDS and LOYALTY BRD owners) - verify.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
