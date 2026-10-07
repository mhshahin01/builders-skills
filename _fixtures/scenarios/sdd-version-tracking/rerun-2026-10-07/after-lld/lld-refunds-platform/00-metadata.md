<!--
CHUNK: 00
TITLE: Metadata & Changelog
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# Low-Level Design Document - Refunds Platform

| Field | Value |
|-------|-------|
| **Document Title** | Low-Level Design - Refunds Platform |
| **Version** | 1.1 |
| **Status** | Draft |
| **Mode** | from-sdd |
| **Date** | 2026-09-30 |
| **Author(s)** | Solution Architecture Team (drafted with lld-unifier) |
| **Reviewers** | Not named yet (the SDD has none either) |
| **Approvers** | Not named yet |
| **Related BRD(s)** | `REFUNDS` [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md); `LOYALTY` [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| **Related SDD** | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) |
| **Source Code Path** (from-code / hybrid) | Not applicable |

---

## Mode Summary

> **How to read this LLD given its mode:**
>
> - **`from-code`** - every section was reverse-engineered from existing source. Structural claims (class names, schemas, topics) are high-confidence; semantic claims (rationale, intent) are medium-confidence unless cross-validated.
> - **`from-sdd`** - every section was forward-designed from the SDD (and CLAUDE.md defaults). Treat as a build target for the implementer. Patterns are proposals annotated with their triggering CLAUDE.md rule.
> - **`hybrid`** - sections are unified across SDD intent and code reality. Drift markers (`⚠`, `🆕`, `⛔`) call out divergences. See `15-open-questions.md` for the drift index.
> - **`partial`** - code exists for some services; others are SDD-described placeholders.

This LLD is **`from-sdd`**.

---

## Changes Log

| Version | Date | Author | Mode | Change Summary |
|---------|------|--------|------|----------------|
| 1.0 | 2026-09-30 | Solution Architecture Team | from-sdd | Initial LLD draft, derived from SDD v1.0 via lld-unifier. Mode: from-sdd. Scope: refund-service, loyalty-service, payout-service, notification-service, and the Angular web app. |
| 1.1 | 2026-10-07 | Codex fixture run | from-sdd | Accepted SDD 1.1 and LOYALTY 1.1 targeted refresh; partial-refund amount, pending data, owner gaps, trace and delta review. Chunks: 04-implementation/loyalty-service.md, 04-implementation/notification-service.md, 04-implementation/refund-service.md, 05, 09, 13, 14, 15, 16, 17, 18 |

---

## Confidence Flag Summary

| Flag Type | Count | Notes |
|-----------|-------|-------|
| `> Confirm:` (medium confidence) | 37 | See `15-open-questions.md` for index. |
| `> TODO: <best-guess> - verify` (low confidence) | 33 | See `15-open-questions.md` for index. |
| `⚠ drift` (hybrid only) | 0 | Not applicable (from-sdd). |
| `🆕 code-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⛔ sdd-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⚠ policy` (every mode that reads code) | 0 | Not applicable: no code was read. |

<!-- MASTER: refunds-platform-lld-master.md | NEXT: 01-purpose-and-scope.md -->
