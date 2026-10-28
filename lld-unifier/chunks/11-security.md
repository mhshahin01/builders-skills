<!--
CHUNK: 11
TITLE: Security
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 14. Security

> **Convention:** platform-wide auth lives in `09-cross-cutting.md` § 12.1. This chunk covers data classification, PII handling, secrets management, deployable permissions, HTTP security headers, and threat notes.

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
| `[service-a]` | `[table]` | `[column]` | PII | [pgcrypto / column-level / disk-level only] | [Yes / No - strategy] |

<!-- Unless SDD §17.X lists the PII columns (confidence-rules.md), write: > Confirm: PII inventory is complete - verify with security review -->

## 14.3 Secrets Management

| Secret | Store | Loader | Rotation cadence | Rotation procedure |
|--------|-------|--------|------------------|---------------------|
| Database password | [Vault path] | [How the app reads it at start-up, for example a config import from the store] | 90 days | RB-03 in `10-operations.md` |
| Kafka SASL credentials | [Vault path] | [Loader] | 180 days | [procedure] |
| Keycloak service account | [Vault path] | [Loader] | 365 days | [procedure] |
| TLS certificates | cert-manager / Vault PKI | [Mounted file, reloaded on renewal] | Auto-renew at 30d before expiry | Automated |

> **Convention:** secrets never appear in env vars in committed files, never in logs, never in error responses. Every secret the LLD names (04, `09-cross-cutting.md` § 12.9, a § 14.3a role) has a row with its store, loader, and rotation. The Loader names the component or configuration that reads the secret, when it reads it (start-up or refresh), and what happens when it is missing (start-up fails, never a silent default). The loader is a buildable unit with this row as its anchor.

## 14.3a Deployable Permissions

<!-- When a deployable runs under a cloud role (SDD §8.1 deployment, ADR-01). With none, write "Not applicable - <reason>" and drop the table. One row per action; no wildcard action or resource unless the SDD states it. -->

| Deployable | Role | Action | Resource | Used by (code path) | Source |
|------------|------|--------|----------|---------------------|--------|
| `[deployable]` | `[role-name]` | `[service:Action]` | `[resource identifier]` | `[Class.method]` in 04 § 7.2 | [SDD § / LLD proposal flagged `> Confirm:`] |

> **Convention:** least privilege per deployable: every action the code calls has a row, and no row lacks a code path. A deployable that runs several roles from one image lists the actions per role (`03-architecture.md` § 6.2a). A secret read is a row here too, matching its § 14.3 Loader.

## 14.4 Authentication / Authorisation Decisions

> Inherits SDD §11.6 Security defaults. Per-service authorisation rules live in each service's `04-implementation/<service>.md` § 7.2 `### Authorization` (each entry point's SDD §16 permission token and enforcement point).

| Concern | Decision |
|---------|----------|
| Public-facing endpoints | None / [list] |
| Service-to-service | Per SDD §15.1: the caller sends its client-credentials token (`Authorization: Bearer`) and the provider (its filter or a sidecar) checks the contract's SDD §16 permission token; mTLS stays as the transport. In-process port calls check the token at the port (04 § 7.2 Authorization, Kind Port). |
| Cross-tenant queries | Forbidden at application layer; enforced via Hibernate filter / RLS / query helper |
| Admin endpoints | Separate scope `admin:*`, gated to `[role]` |

## 14.4a HTTP Security Headers

<!-- Every response header the platform sets for security. Set in one place (the gateway, the CDN, or one application filter), named in Set by. A value no source gives is an LLD default flagged "> Confirm:". -->

| Header | Value | Applies to | Set by | Source |
|--------|-------|------------|--------|--------|
| `Strict-Transport-Security` | [`max-age=31536000; includeSubDomains`] | Every HTTPS response | [Gateway / filter] | [SDD §11.6 / LLD default] |
| `Content-Security-Policy` | [Policy, with `frame-ancestors 'none'`] | Every HTML response | [Gateway / CDN] | [SDD §11.6 / LLD default] |
| `X-Content-Type-Options` | `nosniff` | Every response | [Gateway / filter] | [SDD §11.6 / LLD default] |
| `Referrer-Policy` | [`strict-origin-when-cross-origin`] by default; `no-referrer` on every route in the Token-in-URL routes line | Every response | [Gateway / filter] | [SDD §11.6 / LLD default] |
| `Cache-Control` | `no-store` | Authenticated responses and token routes | [Filter] | [SDD §11.6 / LLD default] |

**Token-in-URL routes:** [every backend route and frontend route (`14-frontend.md`) that carries a token in its path or query, for example an activation or reset link], each with `Referrer-Policy: no-referrer`. With none, write `None`.

## 14.5 Threat Notes

> **Convention:** lightweight threat notes here. Full threat model lives in `[link to threat model doc]` (referenced in `16-references.md`).

| Threat | Mitigation | Owner |
|--------|------------|-------|
| Tenant data leak via stale cache | Per-tenant cache key prefixes; invalidate on tenant change | `[service-a]` team |
| Replay of webhook payloads from external provider | Verify HMAC signature with rolling secret; reject `Date` header older than 5 min | `[service-b]` team |
| SQL injection via dynamic filter | Use parameterised queries / RSQL parser with allow-list | All services |
| Idempotency-key reuse across tenants | Dedup tuple is `(tenant_id, key)`, not `key` alone | All services |

<!-- Unless a threat model document exists (link it in 16-references.md § 19.6), write: > TODO: full threat model - verify or replace with link to threat model doc -->

## 14.6 Compliance

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR | [Yes / No / Per-tenant] | Lawful basis: [contract]; retention windows in `05-data-model.md` § 8.6 Retention & Archival; right-to-erasure flow: [procedure] |
| PCI-DSS | [Yes / No] | [Approach if applicable] |
| ISO 27001 / SOC 2 | [Yes / No] | [Controls applicable] |
| Local regulations | [List] | [Approach] |

<!-- Unless the SDD settles each regulation's applicability, write: > Confirm: compliance applicability per project - verify with legal/compliance -->

<!-- MASTER: [project-slug]-lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
