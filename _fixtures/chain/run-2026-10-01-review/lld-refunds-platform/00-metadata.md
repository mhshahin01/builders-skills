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
| **Date** | 2026-10-01 |
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
| 1.1 | 2026-10-01 | Solution Architecture Team | from-sdd | Refresh the trace, with the targeted refresh to SDD v1.2 that step 3c offered and the run accepted (SDD Changes Log rows 1.1 and 1.2; LOYALTY BRD now v1.2). Trace: the LOYALTY/UC-01 and LOYALTY/UC-02 traceability lines (9 and 22 UAT/BAT test cases), the LOYALTY rows and tags of 13 § 16.8, the LOYALTY screen notes of 14 § 17.3, and 16 § 19.9 follow LOYALTY chunk 16 and SDD §7.3; the REFUNDS trace is unchanged. Design taken in from SDD v1.2: payouts retried after the retry window with one `PAYOUT_FAILED`, the receipt-number match key and receipt lock, take-back by whole euros refunded, whole-euro earning, the 15-minute import, retention jobs and the two operations erasure jobs, the `claimed_until` claim, committed event contracts 1.0.0 with money as a decimal string and a conditional `customerContact`, consumer retries per SDD §14.6 rule 4, the 5-minute publication replay, and the pinned DTO fields. Regenerated: 00 to 16 and the master; 17 and 18 unchanged. 16 § 19.1 records SDD v1.2. Flags: 8 `> TODO:` and 2 `> Confirm:` settled upstream, 5 `> Confirm:` added (now 40 Confirm, 21 TODO); OQ-01, OQ-03, OQ-04, and OQ-07 settled. |

---

## Confidence Flag Summary

| Flag Type | Count | Notes |
|-----------|-------|-------|
| `> Confirm:` (medium confidence) | 40 | See `15-open-questions.md` for index. |
| `> TODO: <best-guess> - verify` (low confidence) | 21 | See `15-open-questions.md` for index. |
| `⚠ drift` (hybrid only) | 0 | Not applicable (from-sdd). |
| `🆕 code-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⛔ sdd-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⚠ policy` (every mode that reads code) | 0 | Not applicable: no code was read. |

<!-- MASTER: refunds-platform-lld-master.md | NEXT: 01-purpose-and-scope.md -->
