<!--
CHUNK: 00
TITLE: Metadata & Changelog
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# Low-Level Design Document - Refunds Platform

| Field | Value |
|-------|-------|
| **Document Title** | Low-Level Design - Refunds Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Mode** | from-sdd |
| **Date** | 2026-09-28 |
| **Author(s)** | shahin (generated with lld-unifier) |
| **Reviewers** | Not assigned yet |
| **Approvers** | Not assigned yet |
| **Related BRD(s)** | `REFUNDS` [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) (Refunds Portal v1.0); `LOYALTY` [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) (Loyalty Points v1.0). Keys from the SDD's [Source BRDs register](../sdd-refunds-platform/00-cover-and-changelog.md#document-lineage). |
| **Related SDD** | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) (SDD v1.0) |
| **Source Code Path** (from-code / hybrid) | Not applicable (greenfield, from-sdd) |

---

## Mode Summary

> **How to read this LLD given its mode:**
>
> - **`from-sdd`** (this LLD): every section was forward-designed from the SDD (and CLAUDE.md defaults). Treat it as a build target for the implementer. Patterns are proposals annotated with their triggering CLAUDE.md rule. Design-level facts stay in the SDD and are linked, not restated; this LLD adds the implementation delta.
> - Use-case trace: every REFUNDS and LOYALTY use case of SDD §7.3 is carried to its workflow block, its routes and screens, its UAT/BAT cases, its e2e spec, and its runtime `use_case` attribute (16 § 19.9).

---

## Changes Log

| Version | Date | Author | Mode | Change Summary |
|---------|------|--------|------|----------------|
| 1.0 | 2026-09-28 | shahin | from-sdd | Initial LLD draft, derived from SDD v1.0 (REFUNDS v1.0, LOYALTY v1.0) via lld-unifier. Mode: from-sdd. Scope: refund-service, payout-service, notification-service, loyalty-service, and the Angular web app. Child LLDs row added to the SDD. |

---

## Confidence Flag Summary

| Flag Type | Count | Notes |
|-----------|-------|-------|
| `> Confirm:` (medium confidence) | 44 | See `15-open-questions.md` § 18.3 for the index. |
| `> TODO: <best guess> - verify` (low confidence) | 31 | See `15-open-questions.md` § 18.2 for the index. |
| `⚠ drift` (hybrid only) | 0 | Not applicable (from-sdd). |
| `🆕 code-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⛔ sdd-only` (hybrid only) | 0 | Not applicable (from-sdd). |

<!-- MASTER: refunds-platform-lld-master.md | NEXT: 01-purpose-and-scope.md -->
