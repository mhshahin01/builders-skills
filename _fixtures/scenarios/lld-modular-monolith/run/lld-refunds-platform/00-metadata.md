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
| **Date** | 2026-09-30 |
| **Author(s)** | lld-unifier (derived draft) |
| **Reviewers** | Pending |
| **Approvers** | Pending |
| **Related BRD(s)** | `REFUNDS` [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md); `LOYALTY` [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| **Related SDD** | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) (v1.1) |
| **Source Code Path** (from-code / hybrid) | Not applicable |

---

## Mode Summary

> **How to read this LLD given its mode:**
>
> - **`from-code`** - every section was reverse-engineered from existing source. Structural claims (class names, schemas, topics) are high-confidence; semantic claims (rationale, intent) are medium-confidence unless cross-validated.
> - **`from-sdd`** - every section was forward-designed from the SDD (and CLAUDE.md defaults). Treat as a build target for the implementer. Patterns are proposals annotated with their triggering CLAUDE.md rule.
> - **`hybrid`** - sections are unified across SDD intent and code reality. Drift markers (`⚠`, `🆕`, `⛔`) call out divergences. See `15-open-questions.md` for the drift index.
> - **`partial`** - code exists for some services; others are SDD-described placeholders.

This LLD is **from-sdd**: a greenfield build target derived from SDD v1.1, a modular monolith with four modules.

---

## Changes Log

| Version | Date | Author | Mode | Change Summary |
|---------|------|--------|------|----------------|
| 1.0 | 2026-09-30 | lld-unifier | from-sdd | Initial LLD draft, derived from SDD v1.1 via lld-unifier. Mode: from-sdd. Use cases traced from REFUNDS v1.0 and LOYALTY v1.0. |

---

## Confidence Flag Summary

| Flag Type | Count | Notes |
|-----------|-------|-------|
| `> Confirm:` (medium confidence) | 46 | See `15-open-questions.md` for index. |
| `> TODO: <best-guess> - verify` (low confidence) | 43 | See `15-open-questions.md` for index. |
| `⚠ drift` (hybrid only) | 0 | Not applicable (from-sdd). |
| `🆕 code-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⛔ sdd-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⚠ policy` (every mode that reads code) | 0 | Not applicable (from-sdd reads no code). |

<!-- MASTER: refunds-platform-lld-master.md | NEXT: 01-purpose-and-scope.md -->
