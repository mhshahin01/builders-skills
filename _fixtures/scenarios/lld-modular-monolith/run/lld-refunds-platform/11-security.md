<!--
CHUNK: 11
TITLE: Security
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 14. Security

> **Convention:** platform-wide auth lives in `09-cross-cutting.md` § 12.1. This chunk covers data classification, PII handling, secrets management, and threat notes.

Design: [SDD §11.6 Security](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) and [SDD §16](../sdd-refunds-platform/12-centralized-user-roles.md#165-capability-matrix-canonical) (roles and permission tokens, referenced, not restated).

## 14.1 Data Classification

| Class | Description | Examples in this LLD | Handling |
|-------|-------------|----------------------|----------|
| Public | No restriction | None | None |
| Internal | Employee-only | Reference numbers, statuses, branch IDs, provider references | TLS in transit |
| Confidential | Restricted by role | `tenant_id`, `customer_id`, amounts, receipt and purchase references, decision and rejection reasons, `member_id` | TLS + role and ownership gates (04 § 7.2 Authorization) + row-level security |
| Secret / PII | Strict regulatory | Customer email and mobile, message recipients, provider credentials, encryption keys | TLS + column encryption (05 § 8.7) + masked in logs and non-production data |

## 14.2 PII Inventory

| Service | Table | Column | Classification | Encryption | Masking in non-prod |
|---------|-------|--------|----------------|------------|---------------------|
| `refund` | `refund_request` | `customer_email`, `customer_mobile` | PII | AES-256-GCM column encryption (`bytea`) | Yes - synthetic values (SDD §17.1) |
| `notification` | `notification` | `recipient` | PII | AES-256-GCM column encryption (`bytea`) | Yes - synthetic values (SDD §17.3) |
| platform | `event_publication` | serialized `contact` of four refund events | PII | `PiiEncryptingEventSerializer`; deleted on completion (SDD §14.10 rule 8) | Not applicable (transient) |
| `loyalty` | `points_movement`, `points_balance`, `pending_take_back` | `member_id` | Pseudonymous identifier | Disk-level only | Yes - masked (SDD §17.4) |
| `refund` | `refund_request`, `refund_status_history` | `reason`, `decision_reason` (free text) | Possible PII in free text | Disk-level only | Yes - replaced with fixed text |

> Confirm: PII inventory is complete - verify with security review; the free-text reason columns are an LLD addition to the SDD's PII list, since a customer or manager can type personal data into them.

## 14.3 Secrets Management

| Secret | Source | Rotation cadence | Rotation procedure |
|--------|--------|------------------|---------------------|
| Database password (application role) | Secrets manager (SDD §6) | Open (SDD §11.6) | Open (SDD §20.1.4) |
| CardPay, MsgHub, POS records credentials (per tenant) | Secrets manager, paths in `TenantConfig` | Open (SDD §11.6) | Open (SDD §20.1.4) |
| PII column and publication encryption keys | Secrets manager | Open (SDD §11.6) | Key-version prefix, lazy re-encryption (05 § 8.7) |
| TLS certificates | Open (SDD §11.6 certificate management) | Auto-renew | Automated |

> TODO: secret rotation cadence and procedure are open in SDD §11.6 and §20.1.4; best guess: provider credentials every 90 days, encryption keys yearly - verify.

> **Convention:** secrets never appear in env vars in committed files, never in logs, never in error responses.

## 14.4 Authentication / Authorisation Decisions

> Inherits SDD §11.6 Security defaults. Per-service authorisation rules live in each service's `04-implementation/<service>.md` § 7.2 `### Authorization` (each entry point's SDD §16 permission token and enforcement point).

| Concern | Decision |
|---------|----------|
| Public-facing endpoints | None: every endpoint needs a signed-in user with a `tenant_id` claim |
| Service-to-service | No internal HTTP in this release (SDD §15.1); the one in-process port call checks `payout.payout.request` at the port (04 § 7.2 Authorization, Kind Port) |
| Cross-tenant queries | Forbidden at the application layer; enforced by Hibernate `@TenantId` plus row-level security (05 § 8.4) |
| Ownership gates | Own requests (`customer_id` = subject, else 404), own branch (`branch_id` claim, else 403), own points (`member_id` claim) (SDD §16.2 step 4) |
| Self-decision | A branch manager cannot decide their own request (403, SDD §17.1); across accounts it is an open SDD question |
| Admin endpoints | None: no platform operator role (SDD §16.4.3) |

> TODO: whether a branch manager may decide a refund of their own purchase made through a separate customer account is open in SDD §17.1 Constraints; best guess: allowed (the guard only compares the same account) - verify with the REFUNDS owner.

## 14.5 Threat Notes

> **Convention:** lightweight threat notes here. Full threat model lives in `[link to threat model doc]` (referenced in `16-references.md`).

| Threat | Mitigation | Owner |
|--------|------------|-------|
| A customer reads or blocks another buyer's receipt by guessing its number (SDD R-08) | Per-customer lookup rate limit at the gateway; payouts only to the original card; rejection or cancellation releases the items | `refund` team |
| Cross-tenant leak through a missed filter | `@TenantId` on every entity plus row-level security; the application role owns no table, so it cannot bypass the policy | All modules |
| Idempotency-key reuse across tenants | Dedup tuple is `(tenant_id, key)`, not `key` alone | `refund` team |
| Payout paid twice after a timeout | Payout ID as CardPay idempotency key; Unknown never retried until reconciled | `payout` team |
| PII exposure through the publication log | PII fields encrypted on write; publication deleted on completion | Platform |
| A forged `member_id` or `branch_id` claim | Claims from account attributes the owner cannot edit (SDD §16.8 rule 5), token signature validated twice | IAM, platform |

> TODO: full threat model - verify or replace with link to threat model doc; SDD §21 records it as not yet written.

> TODO: the per-customer receipt lookup limit is open in SDD §17.1 Constraints; best guess: 20 lookups per customer per hour at the gateway - verify.

## 14.6 Compliance

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR | Yes (customer contact data, `member_id`) | Lawful basis open (SDD §17.1, §17.3, §17.4); retention windows in `05-data-model.md` § 8.6 Retention & Archival; right-to-erasure flow: clear contact columns and message recipients, and the `contact` of incomplete publications, keep financial fields (SDD §16.8 rule 4) |
| PCI-DSS | No, while CardPay pays to the original card without card data from the platform (SDD §17.2) | No card data stored or logged |
| ISO 27001 / SOC 2 | Open: control set per SDD §11.6 | - |
| Local regulations | Open (SDD §17.1 to §17.4 Compliance) | - |

> Confirm: compliance applicability per project - verify with legal/compliance.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
