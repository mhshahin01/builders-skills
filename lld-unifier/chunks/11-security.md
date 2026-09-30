<!--
CHUNK: 11
TITLE: Security
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 14. Security

> **Convention:** platform-wide auth lives in `09-cross-cutting.md` § 12.1. This chunk covers data classification, PII handling, secrets management, and threat notes.

## 14.1 Data Classification

| Class | Description | Examples in this LLD | Handling |
|-------|-------------|----------------------|----------|
| Public | No restriction | [field, table] | None |
| Internal | Employee-only | [field] | TLS in transit |
| Confidential | Restricted by role | `tenant_id`, internal IDs | TLS + role-based access |
| Secret / PII | Strict regulatory | [email, phone, identifier] | TLS + at-rest encryption + audit log on access |

## 14.2 PII Inventory

| Service | Table | Column | Classification | Encryption | Masking in non-prod |
|---------|-------|--------|----------------|------------|---------------------|
| `[service-a]` | `[table]` | `[column]` | PII | [pgcrypto / column-level / disk-level only] | [Yes / No — strategy] |

> `> Confirm: PII inventory is complete — verify with security review`

## 14.3 Secrets Management

| Secret | Source | Rotation cadence | Rotation procedure |
|--------|--------|------------------|---------------------|
| Database password | [Vault path] | 90 days | RB-03 in `10-operations.md` |
| Kafka SASL credentials | [Vault path] | 180 days | [procedure] |
| Keycloak service account | [Vault path] | 365 days | [procedure] |
| TLS certificates | cert-manager / Vault PKI | Auto-renew at 30d before expiry | Automated |

> **Convention:** secrets never appear in env vars in committed files, never in logs, never in error responses.

## 14.4 Authentication / Authorisation Decisions

> Inherits SDD §11.6 Security defaults. Per-service authorisation rules live in each service's `04-implementation/<service>.md` § Auth section.

| Concern | Decision |
|---------|----------|
| Public-facing endpoints | None / [list] |
| Service-to-service | mTLS only — no JWT validation internally |
| Cross-tenant queries | Forbidden at application layer; enforced via Hibernate filter / RLS / query helper |
| Admin endpoints | Separate scope `admin:*`, gated to `[role]` |

## 14.5 Threat Notes

> **Convention:** lightweight threat notes here. Full threat model lives in `[link to threat model doc]` (referenced in `16-references.md`).

| Threat | Mitigation | Owner |
|--------|------------|-------|
| Tenant data leak via stale cache | Per-tenant cache key prefixes; invalidate on tenant change | `[service-a]` team |
| Replay of webhook payloads from external provider | Verify HMAC signature with rolling secret; reject `Date` header older than 5 min | `[service-b]` team |
| SQL injection via dynamic filter | Use parameterised queries / RSQL parser with allow-list | All services |
| Idempotency-key reuse across tenants | Dedup tuple is `(tenant_id, key)`, not `key` alone | All services |

> `> TODO: full threat model — verify or replace with link to threat model doc`

## 14.6 Compliance

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR | [Yes / No / Per-tenant] | Lawful basis: [contract]; retention windows in `05-data-model.md` § 8.6 Retention & Archival; right-to-erasure flow: [procedure] |
| PCI-DSS | [Yes / No] | [Approach if applicable] |
| ISO 27001 / SOC 2 | [Yes / No] | [Controls applicable] |
| Local regulations | [List] | [Approach] |

> `> Confirm: compliance applicability per project — verify with legal/compliance`

<!-- MASTER: [project-slug]-lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
