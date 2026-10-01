<!--
CHUNK: 11
TITLE: Security
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 14. Security

> **Convention:** platform-wide authentication and tenant resolution live in `09-cross-cutting.md` § 12.1. The SDD security defaults are [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) and the role catalogue is [SDD §16](../sdd-refunds-platform/12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action); this chunk adds data handling, enforcement points, and threat notes.

## 14.1 Data Classification

| Class | Description | Examples in this LLD | Handling |
|-------|-------------|----------------------|----------|
| Public | No restriction | None | - |
| Internal | Staff and service use | Reference numbers, branch codes, statuses, event types | TLS in transit |
| Confidential | Restricted by role, never logged at INFO | `tenant_id`, `original_payment_ref`, `provider_payout_ref`, internal UUIDs | TLS + role-based access + storage encryption |
| Secret / PII | Personal data and credentials | `customer_id` (pseudonymous), free-text reasons, purchase lines, `member_number`, contact details (memory only), provider credentials, partner keys | TLS + storage encryption + masking below Prod + never logged |

## 14.2 PII Inventory

From the SDD's Data Encryption sections (§17.1 to §17.4) plus the LLD's own tables:

| Service | Table | Column | Classification | Encryption | Masking in non-prod |
|---------|-------|--------|----------------|------------|---------------------|
| refund-service | `refund_request` | `customer_id` | PII (pseudonymous) | Storage-level (SDD §11.6) | Replace with a random UUID per customer |
| refund-service | `refund_request` | `reason`, `decision_reason` | PII (free text) | Storage-level | Replace with `masked` |
| refund-service | `refund_request` | `original_payment_ref` | Confidential | Storage-level | Replace with a random token |
| refund-service | `refund_request_item` | `description` (purchase lines) | PII (purchase history) | Storage-level | Replace with `item <n>` |
| refund-service | `refund_status_history` | `changed_by`, `reason` | PII | Storage-level | As above |
| refund-service | `receipt_lookup_counter` | `customer_id` | PII (pseudonymous) | Storage-level | Not copied (7-day table) |
| payout-service | `payout` | `original_payment_ref`, `provider_payout_ref` | Confidential | Storage-level | Random tokens |
| payout-service | `payout_result` | `raw_body` | Confidential | Storage-level | Not copied |
| notification-service | `notification` | `customer_id`, `template_params.reason` | PII | Storage-level | Random UUID; `masked` |
| loyalty-service | `member` | `member_number`, `customer_id` | PII | Storage-level | Random values |
| loyalty-service | `points_movement` | `purchase_reference`, amounts | PII (purchase history) | Storage-level | Random references |

> **Convention:** production data is never copied to a lower environment unmasked (SDD §19); the masking script per schema lives next to the Flyway migrations and runs in the copy job before any lower-environment restore.

## 14.3 Secrets Management

| Secret | Source | Rotation cadence | Rotation procedure |
|--------|--------|------------------|---------------------|
| Database passwords (core, `payout`, `notification`) | Secrets manager (product open, SDD §6) | Open (SDD §11.6) | RB-05 in `10-operations.md` |
| Kafka client credentials per deployable | Secrets manager | Open | RB-05 |
| Keycloak client secret of `notification-service` | Secrets manager | Open | RB-05 |
| CardPay, MsgHub, POS Records credentials, per tenant | Secrets manager | Open | RB-05 |
| Partner keys and signature secrets for API-03 and API-06, per tenant and provider (ADR-11) | Secrets manager + tenant configuration (key only) | Open | RB-05 |
| Cursor HMAC key | Secrets manager | Open | Rolling: accept the previous key for one day |
| TLS certificates | Certificate authority open (SDD §11.6) | Open | Automated where the CA supports it |

> **Convention:** secrets never appear in committed files, logs, error responses, or events (SDD §6 rules).

> TODO: rotation cadences are open in SDD §11.6; best guess 90 days for database and Kafka credentials and provider secrets, 30 days for the cursor HMAC key - verify with security.

## 14.4 Authentication / Authorisation Decisions

> Inherits [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) and ADR-07/ADR-08. Permission tokens per [SDD §16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide), checked with `@PreAuthorize("hasAuthority('<token>')")` on each handler. The ownership gates are enforced in the service **and** in the SQL predicate:

| Gate | Enforcement point | Failure |
|------|-------------------|---------|
| Tenant | `TenantScopedJdbcRepository`: `tenant_id = :tenantId` on every statement | Row invisible (404) |
| Own records (`CUSTOMER`) | `customer_id = caller.subject` in `RefundQueryServiceImpl.listOwn` and `getDetail`, `RefundRequestServiceImpl.cancel` | 404 `NOT_FOUND` (existence not revealed) |
| Own branch (`BRANCH_MANAGER`) | `branch_id = caller.branchId` in `branchQueue`, `getDetail`, `decide`, `dailyReport` | 403 `FORBIDDEN` (REFUNDS/UC-04 BR-1) |
| Own points (`MEMBER`) | Member resolved from the `member_id` claim only; no member id in any path | 404 |
| Partner calls (API-03, API-06) | Partner key -> tenant, then signature with that tenant's secret (ADR-11) | 404 / 401, security event |
| Contact reads (API-05) | Keycloak user's `tenant_id` attribute = event tenant | Row FAILED, security alert |

| Concern | Decision |
|---------|----------|
| Public-facing endpoints | All business endpoints behind the gateway web route (JWT); the partner route carries no JWT (ADR-11) |
| Service-to-service | None over HTTP (ADR-05); Kafka ACLs per deployable |
| Cross-tenant queries | Forbidden at the application layer (SDD §11.2) |
| Admin endpoints | Actuator (including `dlqredrive`) on a separate management port, not routed by the ingress or gateway |

> Confirm: exposing actuator only on a management port that the ingress does not route is an LLD choice (the SDD does not describe admin access); verify with operations.

## 14.5 Threat Notes

> **Convention:** lightweight notes; no threat model exists yet (SDD §21: owner and date open).

| Threat | Mitigation | Owner |
|--------|------------|-------|
| Receipt enumeration by a signed-in customer (R-09) | Gateway limit of 10 lookups per hour per customer, minimal lookup response, not-found burst alert (SDD §17.1) | refund-service team |
| Replay or forgery of CardPay or POS partner calls | Per-tenant signature, `dedup_key` and natural-key idempotency, partner route rate limit and allowlist (ADR-11) | payout-service and loyalty-service teams |
| Idempotency-key replay by another user | Record scoped by `subject` and `operation` (SDD §11.1) | Kernel |
| IDOR on `refundId` or `movementId` | Ownership predicates inside the SQL, not only in code | refund-service and loyalty-service teams |
| Cross-tenant contact use | Tenant attribute check on every API-05 read | notification-service team |
| Cursor tampering to read another scope | HMAC-signed cursor, scope re-checked in the query | Kernel |
| PII in logs | Field allow-list in the log formatter; `tenant_ref` instead of `tenant_id`; a test that fails on PII keys at INFO | Kernel |
| A branch manager deciding a request filed from their own customer account | Not enforced (SDD reviewer note, open for the REFUNDS owner) | Product |
| A disabled branch manager acting until the token expires | Short staff token lifetime (not pinned, SDD reviewer note) | Keycloak realm owner |

> TODO: full threat model (STRIDE over the gateway routes, the partner route, and the event bus) - verify or replace with a link once the SDD §21 threat model exists.

## 14.6 Compliance

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR | Yes (customer ids, purchase history, member numbers) | Lawful basis, retention, and erasure open (SDD §17.1, §17.2, §17.4 Compliance); contact details never stored (ADR-09); erasure of retained topics follows the SDD §14.9 erasure-path note |
| PCI-DSS | No | No card number stored or processed; only provider transaction references (SDD §17.1, §17.2) |
| ISO 27001 / SOC 2 | Per organisation | Reviewed configuration changes (SDD §11.5), provider credentials in the secrets manager, access logging |
| Local regulations | SMS sender registration and opt-out rules open (SDD §17.3) | Templates and sender identities per tenant |

> Confirm: compliance applicability per project (GDPR retention and erasure decisions, SMS rules) must be settled with legal and compliance; this LLD implements no retention job until they are.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
