<!--
CHUNK: 00
TITLE: Metadata & Changelog
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# Low-Level Design Document - [Project Name]

| Field | Value |
|-------|-------|
| **Document Title** | Low-Level Design - [Project Name] |
| **Version** | [X.X] |
| **Status** | [Draft / In Review / Approved] |
| **Direction** | [from-code / from-sdd / hybrid / partial] |
| **Date** | [YYYY-MM-DD] |
| **Author(s)** | [Names] |
| **Reviewers** | [Names of people, never a stand-in] |
| **Approvers** | [Names of people, never a stand-in] |
| **Related BRD(s)** | [One per source BRD, with its key from the SDD's Source BRDs register: `[KEY]` [[brd-slug]-brd-master.md](../brd-[brd-slug]/[brd-slug]-brd-master.md); or `Not applicable`] |
| **Related SDD** | [[sdd-slug]-sdd-master.md](../sdd-[sdd-slug]/[sdd-slug]-sdd-master.md) [or `Not applicable`] |
| **Source Code Path** (from-code / hybrid) | [path, or `Not applicable`] |

---

## Direction Summary

> **How to read this LLD given its direction:**
>
> - **`from-code`** - every section was reverse-engineered from existing source. Structural claims (class names, schemas, topics) are high-confidence; semantic claims (rationale, intent) are medium-confidence unless cross-validated.
> - **`from-sdd`** - every section was forward-designed from the SDD (and CLAUDE.md defaults). Treat as a build target for the implementer. Patterns are proposals annotated with their triggering CLAUDE.md rule.
> - **`hybrid`** - sections are unified across SDD intent and code reality. Drift markers (`⚠`, `🆕`, `⛔`) call out divergences. See `15-open-questions.md` for the drift index.
> - **`partial`** - code exists for some services; others are SDD-described placeholders.

---

## Changes Log

<!-- Initial row: Chunks: none (initial build), dated when the first build completes. Later rows: Chunks lists semantic edits only, excluding routine synchronized metadata; date = the request's first content change. Review-content changes count, and so do chunk 15 flag rows and the 16 § 19.1 upstream state (SKILL.md § Output conventions, Versions). -->

| Version | Date | Author | Direction | Change Summary |
|---------|------|--------|-----------|----------------|
| [X.X] | [YYYY-MM-DD] | [Author] | [direction] | Initial LLD draft via lld-unifier. Chunks: none (initial build) |

---

## Confidence Flag Summary

| Flag Type | Count | Notes |
|-----------|-------|-------|
| `> Confirm:` (medium confidence) | [N] | See `15-open-questions.md` for index. |
| `> TODO: <best-guess> - verify` (low confidence) | [N] | See `15-open-questions.md` for index. |
| `⚠ drift` (hybrid only) | [N] | SDD intent vs code reality divergences. |
| `🆕 code-only` (hybrid only) | [N] | Present in code, not in SDD. |
| `⛔ sdd-only` (hybrid only) | [N] | In SDD, not yet built. |
| `⚠ policy` (every direction that reads code) | [N] | Code that breaks a CLAUDE.md rule or a `pattern-rules.md` anti-pattern, indexed in `15-open-questions.md` § 18.6. |

<!-- MASTER: [project-slug]-lld-master.md | NEXT: 01-purpose-and-scope.md -->
