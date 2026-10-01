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
| 1.1 | 2026-09-30 | Solution Architecture Team | from-sdd | Targeted refresh for SDD v1.1 via lld-unifier (step 3c, accepted). SDD v1.1 Changes Log: LOYALTY v1.1 (LOYALTY/UC-02 BR-3 and AC-2: a partial refund takes back only the points of the refunded amount); SDD chunks 00, 01, 03, 05, 13d, 17 changed. Refreshed: loyalty-service (take-back counts the full EUR paid back on a purchase, capped at its earned points, minus earlier take-backs, via `PointsCalculator.takebackDue` and the shared `TakebackApplier`; `refund_takeback` keeps the paid amount; per-purchase `PurchaseLock`; the import applies pending take-backs in `paid_at` order and observes the take-back lag), 05 (`paid_amount`, `currency`, two indexes, `refund_takeback` retention), 08 § 11.1-11.2, 13 § 16.1-16.3 and § 16.8, 01 § 1 and § 4, 17 § 1 Mission, 16 § 19.1 and § 19.9 (LOYALTY v1.1), 10 RB-04, 15 (index regenerated; OQ-03 narrowed to the identifier, OQ-04 reason extended), 18 (OI-09 and OI-10 resolved upstream). Flags: 39 Confirm (+2), 30 TODO (+1). Not touched: 02, 03, 06, 07, 09, 11, 12, 14, and the other three service files. |

---

## Confidence Flag Summary

| Flag Type | Count | Notes |
|-----------|-------|-------|
| `> Confirm:` (medium confidence) | 39 | See `15-open-questions.md` for index. |
| `> TODO: <best-guess> - verify` (low confidence) | 30 | See `15-open-questions.md` for index. |
| `⚠ drift` (hybrid only) | 0 | Not applicable (from-sdd). |
| `🆕 code-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⛔ sdd-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⚠ policy` (every mode that reads code) | 0 | Not applicable: no code was read. |

<!-- MASTER: refunds-platform-lld-master.md | NEXT: 01-purpose-and-scope.md -->
