<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: none
PART OF: SDD - [Project Name]
-->

# [Project / Product Name]: Solution Design Document (SDD)

**Project / Product Name:** [Project Name]
**Version:** [X.X]
**Status:** [Draft | In Review | Approved]
**Author:** [Author Name]
**Reviewers:** [Reviewer Name(s)]
**Approvers:** [Approver Name(s)]
**Date:** [YYYY-MM-DD]
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)

---

## Document Lineage

<!-- Rules: brd-to-sdd.md § Source BRDs and lineage. With no source BRD, write "None - generated without a BRD" in Source BRDs. -->

### Source BRDs (parents)

<!-- One row per source BRD. Key: a short capital name from the BRD's project name (REFUNDS, WALLET), stable once seen; every BRD reference in this SDD carries it (REFUNDS/UC-04). Version: the BRD version this SDD was derived from or last reconciled against. Link: the BRD master (chunked) or combined file. -->

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| [KEY] | [BRD project name] | [X.X] | [[brd-slug]-brd-master.md](../brd-[brd-slug]/[brd-slug]-brd-master.md) | [What this BRD contributes] |

### Child LLDs (children)

<!-- Written by lld-unifier: each LLD that reads this SDD (Direction: from-sdd, hybrid, partial, or from-code with this SDD given) adds or updates its own row, matched by Link; SDD version is the SDD version that LLD reflects (lld-unifier step 6c). Checked by sdd-unifier on every run: links resolve, scope services exist in §13, sibling LLD masters (lld-*/*lld-master.md) and combined LLDs (LLD-*.md, skipping LLD-*-MERGED.md: a merged copy of a chunked LLD already registered through its master) whose Related SDD line links to this SDD's master are added if missing, stale rows are flagged, never deleted. A row whose SDD version is older than this SDD's version is out of date: sdd-unifier appends " (out of date: SDD is now v[X.X]; refresh through lld-unifier)" to its SDD version cell (replacing an earlier such note) and names the LLD in the handoff; it never writes into the LLD, whose next run rewrites its own row and clears the note only when the row then names this SDD's current version. Before any LLD exists: one row "None yet". -->

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| None yet | - | - | - | - | - |

---

## Changes Log

<!-- Initial row: Chunks: none (initial build), dated when the first build completes (when part 3 completes in parts, when the run completes in whole). Later rows: Chunks lists semantic edits only, excluding routine synchronized metadata; date = the request's first content change. Review-content changes count; companion headers reflect current parent without a separate bump. -->

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial draft. Chunks: none (initial build) |

<!-- One row per update that changes content (SKILL.md § Output conventions, Versions), ending with its `Chunks:` list. -->

---

## Table of Contents

<!-- Auto-generated or manually maintained. Include Figures and Tables indices if the document is large. -->

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | [Title] | [Section] |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | [Title] | [Section] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
