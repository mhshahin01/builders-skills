<!--
CHUNK: 11
TITLE: Security
PROJECT: Refunds Platform
VERSION: 1.2
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 14. Security

## 14.1 Data Classification

Sources: SDD §11.6 and each module's Compliance. Contacts/free text/staff ids are personal data; payment and refund references are pseudonymous, not anonymous. Credentials/codes are secrets; statistical unlinked amounts/dates are non-identifying only after source unlink removes all linkable fields.

## 14.2 PII Inventory

Keep the column inventory in §8.2 and the source module Compliance sections. Account emails/mobiles, branch manager/cover contacts, actor ids, customer-linked refund fields, loyalty member/reference links, correction reason/staff identity and waiting refund references require retention and access controls. Notifications stores recipient references and temporary parameters, never recipient addresses. Request/trace logging must not serialize these objects.

## 14.3 Secrets Management

Vault tenant-scoped provider credentials and Keycloak clients; one realm with the SDD ADR-07 client settings. No password persistence outside Keycloak. Cryptographic code generation, hashed verification, latest-only semantics and wrong-entry/rate limits apply. Rotate through the source runbook.

> TODO: Certificate issuer/renewal, credential rotation cadence, image/dependency scan tools and blocking policies remain unspecified in SDD §11.6; verify there before a production release.

## 14.4 Authentication / Authorisation Decisions

Tokens remain exactly SDD §16 and §7.2 tables; never invent an admin role. Method permission is necessary but ownership/branch/member scope is also mandatory. FIXED module identity is internal code, not a public grant. Provider verification precedes parsing a business id for lookup. Ports require the publisher tenant in context and no current caller DB transaction.

## 14.5 Threat Notes

| Threat | Mitigation / verification |
| --- | --- |
| Cross-tenant id guessing / pool context reuse | Transaction-local setting, FORCE RLS, tenant-first repository keys; missing tenant negative tests |
| Replayed provider callback / event | Verified source credential, immutable identity and business unique key; repeated result integration tests |
| Double payout after timeout | Stable OPEN attempt identity until definitive refusal; provider contract gate remains unresolved |
| Confirmation brute force / enumeration | Source hourly/bad-entry limits; indistinguishable reset outward shape; no raw code logging |
| Spreadsheet formula injection | Export escapes cells beginning =,+,-,@ in text fields, while numeric points stay typed numbers |
| Leaking PII through errors / traces | Sanitized ProblemDetails, no DTO dumps, no tenant/PII INFO fields; log assertion tests |

The export mitigation is an implementation encoding choice, not a changed report value or business rule.

## 14.6 Compliance

Lawful basis and retention are owned by the source SDD Compliance sections and BRDs. [SDD §11.6 Staff personal data](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) now contains the Data Protection Officer-owned fixture answer for all existing staff processing, including the deciding branch-manager id. Implement access, minimization and retention against that source; the customer's refund-record obligation does not supply the staff basis. This supersedes the earlier local FX-03 reading, recorded without erasing history in the [decision log](./decision-log.md#r3d-targeted-refresh---2026-10-06). It is a test-fixture answer, not production approval.

Runbooks for access, rectification, erasure and portability use [SDD §20.1.15](../sdd-refunds-platform/16-operations-runbook.md). Waiting refunds/held purchases and former history retain their source legitimate-interest basis and retention; rejected early-deletion/complaint-access proposals are not reintroduced. No certification, PCI card storage or new customer behavior is added.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 10-operations.md | NEXT: 12-performance.md -->
