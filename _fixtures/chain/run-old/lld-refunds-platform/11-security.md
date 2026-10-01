<!--
CHUNK: 11
TITLE: Security
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 14. Security

> **Convention:** platform-wide auth lives in `09-cross-cutting.md` § 12.1. Security defaults are owned by [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) and the role catalogue by [SDD §16](../sdd-refunds-platform/12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action); this chunk covers data classification, PII handling, secrets, enforcement, and threat notes.

## 14.1 Data Classification

| Class | Description | Examples in this LLD | Handling |
|-------|-------------|----------------------|----------|
| Public | No restriction | None | - |
| Internal | Staff and platform only | Branch codes, event types, reference numbers in logs | TLS in transit |
| Confidential | Restricted by role or system | `tenant_id`, `original_payment_ref`, `provider_payout_ref`, partner keys, provider credentials | TLS; never logged at INFO; never returned to a client except as specified |
| Secret / PII | Personal data (REFUNDS/NFR-04) | `customer_id`, `member_number`, free-text reasons, purchase lines, contact details (in memory only) | TLS; storage encryption; masked in non-production; not logged |

## 14.2 PII Inventory

The PII columns are named by SDD §17.1 to §17.4 Data Encryption; this table adds the physical location and handling.

| Service | Table | Column | Classification | Encryption | Masking in non-prod |
|---------|-------|--------|----------------|------------|---------------------|
| refund-service | `refund_request` | `customer_id` | PII (pseudonymous) | Storage-level (SDD §11.6) | Yes |
| refund-service | `refund_request` | `reason`, `decision_reason` | PII (free text) | Storage-level | Yes |
| refund-service | `refund_request` | `original_payment_ref` | Confidential | Storage-level | Yes |
| refund-service | `refund_request_item` | `description` | PII (what was bought) | Storage-level | Yes |
| refund-service | `refund_status_history` | `reason` | PII (free text) | Storage-level | Yes |
| payout-service | `payout` | `original_payment_ref` | Confidential | Storage-level | Yes |
| payout-service | `payout_result` | `raw_body` | Confidential (provider payload) | Storage-level | Yes |
| notification-service | `notification` | `customer_id`, `template_params` (reason) | PII | Storage-level | Yes |
| loyalty-service | `member` | `member_number`, `customer_id` | PII | Storage-level | Yes |
| loyalty-service | `points_movement` | `purchase_reference` | PII (purchase history) | Storage-level | Yes |
| all consumers | `<consumer>.dlq` topics | Event payloads | PII (as on the source topic) | Kafka storage-level | Not copied below Prod |

Contact details (email, phone, locale) are never stored: notification-service holds them in memory while a message is rendered and sent (ADR-09).

> Confirm: PII inventory is complete - verify with security review (the DLQ topics and `payout_result.raw_body` are LLD additions to the SDD list).

## 14.3 Secrets Management

| Secret | Source | Rotation cadence | Rotation procedure |
|--------|--------|------------------|---------------------|
| Database passwords (`refund_app`, `loyalty_app`, `payout_app`, `notification_app`, migration roles) | Secrets manager (product open, SDD §6) | Open (SDD §11.6) | RB-03 |
| Kafka client credentials per deployable | Secrets manager | Open | RB-03 |
| Keycloak client secrets per deployable (notification-service for API-05) | Secrets manager | Open | RB-03 |
| Provider credentials per tenant (POS Records, CardPay, MsgHub) | Secrets manager | Open | RB-03 |
| Partner verification secrets per tenant and provider (ADR-11) | Secrets manager | Open | RB-03 |
| TLS certificates | Certificate authority open (SDD §11.6) | Open | Open |

> TODO: not derivable from inputs - the secrets manager product, certificate authority, and rotation cadences are open in SDD §6 and §11.6 - please specify.

> **Convention:** secrets never appear in env vars in committed files, never in logs, never in error responses.

## 14.4 Authentication / Authorisation Decisions

> Inherits SDD §11.6 and §16. The capability and permission catalogues are [SDD §16.5](../sdd-refunds-platform/12-centralized-user-roles.md#165-capability-matrix-canonical) and [SDD §16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide); they are not restated. Enforcement implementation:

| Concern | Decision |
|---------|----------|
| Public-facing endpoints | The client endpoints of 06 § 9.1 through the gateway user route (JWT required); API-03 and API-06 through the partner route (no JWT, partner key plus signature, ADR-11) |
| Endpoint permission | `@PreAuthorize("hasAuthority('<token>')")` on each controller method, with the SDD §16.11 token verbatim (`refund.request.decide` and so on); the detail endpoint accepts either of its two tokens |
| Role to permission | Each module's `PermissionMap` (application configuration, versioned with the code, SDD §16.12.1) maps `CUSTOMER`, `MEMBER`, `BRANCH_MANAGER` to their tokens; a unit test asserts the per-role counts equal the SDD §16.12.2 baseline (`CUSTOMER` 4, `MEMBER` 2, `BRANCH_MANAGER` 3) and fails on drift |
| Contextual gates (ABAC) | In the query predicate, never after loading: `customer_id = subject`, `branch_id = claim`, member from the `member_id` claim (ADR-08); 404 outside scope, 403 for another branch (SDD §16.2) |
| Service-to-service | None (ADR-05); Kafka ACLs per deployable; notification-service holds Keycloak's user-read role for API-05 (SDD §16.3) |
| Cross-tenant queries | Forbidden at the application layer; composite tenant keys and tenant parameters (05 § 8.4) |
| Admin endpoints | None; realm administration in the Keycloak admin console (SDD §16.4.3) |
| Realm seed | A versioned realm import in the deployment repository with the three realm roles, the `tenant_id`, `branch_id`, `member_id` user attributes mapped to token claims, and one client per deployable plus the web app client (PKCE) (SDD §16.12.1) |

## 14.5 Threat Notes

> **Convention:** lightweight threat notes here. The SDD has no threat model yet (SDD §21).

| Threat | Mitigation | Owner |
|--------|------------|-------|
| Receipt enumeration by a signed-in customer (R-09) | Gateway limit of 10 lookups per hour, minimal lookup response, `ReceiptNotFoundBurst` alert; proof of possession is a REFUNDS follow-up | refund-service team |
| Spoofed CardPay result or POS purchase | Partner route with allowlist, partner key resolved before signature verification with the tenant's secret, results stored and matched inside that tenant only (ADR-11) | payout-service, loyalty-service teams |
| Idempotency-key replay by another user | Key scope includes `subject` and `operation` (SDD §11.1) | refund-service team |
| Cross-tenant contact lookup | Contact `tenant_id` attribute checked against the event's tenant; mismatch fails the row with a security alert (SDD §11.2) | notification-service team |
| IDOR on `refundId` or `movementId` | Ownership in the query predicate; 404 hides existence (SDD §16.2) | refund-service, loyalty-service teams |
| Client-supplied amounts | Amounts only from POS Records and the approved amount; no amount field in `CreateRefundRequest` (08 § 11.2) | refund-service team |
| Payment reference leakage | `original_payment_ref` never in a response, log, or metric; only in `REFUND_APPROVED` to payout-service | refund-service, payout-service teams |
| DLQ payload exposure | DLQ topics readable only by the owning consumer and operators; payloads never printed at INFO during redrive | platform team |
| Disabled staff account keeps deciding until token expiry | Short access-token lifetime for `BRANCH_MANAGER` (SDD §16.8 revokes at the next refresh) | platform team |

> TODO: full threat model - verify or replace with link to threat model doc (SDD §21 threat model not written; the token lifetime for staff is not stated in SDD §16.2).

## 14.6 Compliance

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR | Yes: customer, member, and purchase data | Lawful basis, retention, and erasure open (SDD §17.1, §17.4 Compliance); purge jobs take the retention as configuration (05 § 8.6); erasure of Keycloak accounts stops further messages (SDD §16.8) |
| PCI-DSS | No: no card number is stored or processed (SDD §17.1, §17.2) | Adapters map CardPay's transaction reference only; a code review rule and a test reject any field that looks like a PAN in adapter DTOs |
| ISO 27001 / SOC 2 | Per SDD §17.x | Reviewed configuration changes (SDD §11.5); access to payout data logged |
| Local regulations | SMS sender registration and opt-out open (SDD §17.3) | MsgHub sender identity per tenant in the tenant registry |

> Confirm: compliance applicability per project - verify with legal/compliance (the PAN-rejection test is an LLD addition).

<!-- MASTER: lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
