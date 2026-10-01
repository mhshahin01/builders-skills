<!--
CHUNK: 11
TITLE: Security
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 14. Security

> **Convention:** platform-wide auth lives in `09-cross-cutting.md` § 12.1. This chunk covers data classification, PII handling, secrets management, and threat notes.

## 14.1 Data Classification

| Class | Description | Examples in this LLD | Handling |
|-------|-------------|----------------------|----------|
| Public | No restriction | Message templates without variables | None |
| Internal | Employee-only | Branch ids, reference numbers, receipt numbers, amounts, statuses | TLS in transit; RLS |
| Confidential | Restricted by role | `tenant_id`, `customer_id`, `payoutId`, provider references, `tenant_ref` key | TLS + role-based access; `tenant_id` only at DEBUG |
| Secret / PII | Strict regulatory | `customer_email`, `customer_mobile`, `customerContact` in events, `member_id`, purchase references, `delivery_payload`; provider and database credentials | TLS + at-rest encryption + audit on break-glass access; never logged at INFO |

## 14.2 PII Inventory

| Service | Table | Column | Classification | Encryption | Masking in non-prod |
|---------|-------|--------|----------------|------------|---------------------|
| `refund-service` | `refund.refund_request` | `customer_email`, `customer_mobile` | PII | Volume and backup encryption (SDD §11.6) | Not needed: non-prod holds synthetic data only (SDD §19) |
| `refund-service` | `refund.refund_request` | `customer_id` | Personal identifier | Volume encryption | Synthetic only |
| `refund-service` | `refund.outbox_event` | `payload.customerContact` (7 days) | PII | Volume encryption | Synthetic only |
| `loyalty-service` | `loyalty.points_movement`, `member_balance`, `refund_takeback`, `purchase_import_rejection` | `member_id`, `purchase_reference` | Personal identifier ([SDD §17.4](../sdd-refunds-platform/13d-service-loyalty.md#data-encryption)) | Volume encryption | Synthetic only |
| `notification-service` | `notification.notification_message` | `delivery_payload` | PII | AES-GCM at the application layer, key from the secrets manager; erased when final | Synthetic only |
| `notification-service` | `notification.notification_message` | `recipient_masked` | Masked PII | Volume encryption | Synthetic only |
| Kafka | `refunds-platform-refund-events` and its two DLQs | `customerContact` | PII | TLS; broker storage encryption per the platform | Synthetic only |
| `payout-service` | none | - | No PII stored (ADR-10) | - | - |

> Confirm: PII inventory is complete - verify with security review

## 14.3 Secrets Management

| Secret | Source | Rotation cadence | Rotation procedure |
|--------|--------|------------------|---------------------|
| Database passwords (`_app`, `_worker`, `_migrator` per deployable) | SDD §6 secrets manager, path per environment and deployable | 90 days | RB-03 in `10-operations.md` |
| Kafka client credentials (one identity per deployable) | Secrets manager | 180 days | RB-03 pattern |
| Provider credentials (POS Records, CardPay, MsgHub), per tenant | Secrets manager | Per provider policy | RB-03 pattern; rotated without a redeploy per SDD §11.6 by reading mounted secrets at each call |
| `TENANT_REF_KEY` (HMAC for `tenant_ref`) | Secrets manager | Never rotated in place: a new key changes every `tenant_ref` value | New key with a dashboard mapping period |
| `DELIVERY_PAYLOAD_KEYS` (AES, versioned) | Secrets manager | 365 days | Add a new key version; keep old versions until no `PENDING` message uses them |
| TLS certificates | Platform certificate service | Auto-renew at 30 days before expiry | Automated |

> **Convention:** secrets never appear in env vars in committed files, never in logs, never in error responses.

> TODO: the secrets manager product, the rotation cadences above (best guesses), and certificate issuance are NEEDS CLARIFICATION in [SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) and [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) - verify with the platform and security teams.

## 14.4 Authentication / Authorisation Decisions

> Inherits SDD §11.6 Security defaults. Per-service authorisation rules live in each service's `04-implementation/<service>.md` § 7.2 `### Authorization` (each entry point's SDD §16 permission token and enforcement point).

| Concern | Decision |
|---------|----------|
| Public-facing endpoints | None anonymous: every client-facing endpoint needs a JWT and an SDD §16 permission token ([SDD §16.11](../sdd-refunds-platform/12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide)); the web app's static assets are public |
| Service-to-service | None over HTTP (ADR-05), so no client-credentials token exists (SDD §16.3); SDD §15.1 internal-call rules have no call to apply to. Kafka: per-deployable identities and topic ACLs. In-process: no port calls (06 § 9.6) |
| Cross-tenant queries | Forbidden at application layer; enforced via Hibernate `@TenantId` and PostgreSQL RLS (05 § 8.4) |
| Admin endpoints | None in this release (SDD §16.4.3: no platform operator role); actuator endpoints are on a cluster-internal management port |
| Contextual gates | Own requests (404), own branch (403), own points (404), and the self-decision guard (403), in the owning module ([SDD §16.2](../sdd-refunds-platform/12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action)) |
| Role-to-token map | Seeded `role_permission` tables (05 § 8.5), loaded at start by `RolePermissionMapper` (SDD §16.12.1) |
| Break-glass | Production data access outside the web app per SDD §20.3 (approver, time-boxed account, audit) |

## 14.5 Threat Notes

> **Convention:** lightweight threat notes here. Full threat model lives in `[link to threat model doc]` (referenced in `16-references.md`).

| Threat | Mitigation | Owner |
|--------|------------|-------|
| Receipt enumeration (any customer looks up any receipt number) | Gateway per-user rate limit (SDD §6); POS data shown only for the lookup; second receipt factor raised to the REFUNDS owner (SDD OI-14) | `refund-service` team |
| Branch manager decides their own refund | Self-decision guard (403) plus the SDD §16.3 role separation | `refund-service` team |
| Cross-tenant data leak through a missing filter | Hibernate `@TenantId` plus RLS; worker role limited to its work tables | All services |
| Idempotency-key reuse across tenants or users | Dedup tuple is `(tenant_id, caller_subject, key)` | `refund-service` team |
| Double payout on provider timeout | Lease, version check, payout id as the provider key, status query when keys are not honoured | `payout-service` team |
| Contact data exposure in the retained Kafka log and DLQs | ADR-10 bounded retention; payout-service never binds contact fields; DLQ exception headers carry no payload values | Platform team |
| Forged or replayed `RefundPaid` | In-process only, no external entry; idempotent on `refund_request_id` | `loyalty-service` team |
| SQL injection through sort or filter parameters | Allow-listed sort fields and typed filter parameters (06 § 9.4) | All services |

> TODO: full threat model - verify or replace with link to threat model doc (owner and location NEEDS CLARIFICATION in [SDD §21](../sdd-refunds-platform/17-appendix-and-wishlist.md#21-appendix)).

## 14.6 Compliance

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR | Yes (customer contact details, member ledgers) | Lawful basis NEEDS CLARIFICATION in SDD §17.1, §17.3, §17.4 Compliance; retention windows in `05-data-model.md` § 8.6 Retention & Archival (partly open); right-to-erasure flow: not designed until the SDD sets the erasure path (the §14.9 erasure map covers the broker copies) |
| PCI-DSS | No, while no card data is handled | payout-service sends only a reference to the original payment; the CardPay reference question (payout-service § 7.4 TODO) decides it |
| ISO 27001 / SOC 2 | Open | NEEDS CLARIFICATION in SDD §17.1, §17.3, §17.4 Compliance |
| Local regulations | None stated by the BRDs | - |

> Confirm: compliance applicability per project - verify with legal/compliance

<!-- MASTER: refunds-platform-lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
