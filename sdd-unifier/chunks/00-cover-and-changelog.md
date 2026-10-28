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
**Status:** [Draft | In Review | Approved] <!-- Draft until a version is approved; Approved when the latest Changes Log row's Approved By cell is filled; In Review after a content change to an Approved SDD (SKILL.md § Output conventions, Cover status). -->
**Author:** [Author Name]
**Reviewers:** [Reviewer Name(s)]
**Approvers:** [Approver Name(s)]
**Date:** [YYYY-MM-DD]
**Lineage:** [Document Lineage](#document-lineage) (source BRDs, source Pre-SDD, and child LLDs)

---

## Document Lineage

<!-- Rules: brd-to-sdd.md § Source BRDs and lineage. With no source BRD, write "None - generated without a BRD" in Source BRDs. -->

### Source BRDs (parents)

<!-- One row per source BRD. Key: a short capital name from the BRD's project name (REFUNDS, WALLET), stable once seen; every BRD reference in this SDD carries it (REFUNDS/UC-04). Version: the BRD version this SDD was derived from or last reconciled against. Link: the BRD master (chunked) or combined file. -->

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| [KEY] | [BRD project name] | [X.X] | [[brd-slug]-brd-master.md](../brd-[brd-slug]/[brd-slug]-brd-master.md) | [What this BRD contributes] |

### Source Pre-SDD

<!-- Rules: brd-to-sdd.md § Source Pre-SDD. One row: the G3-signed Pre-SDD this SDD loaded (SKILL.md step 2a), key PSDD; every Pre-SDD ID this SDD cites is PSDD/<ID> with a link. Version and Gate: the version loaded and the gate its master's Gate line showed then (G3 Approved or G3 Approved with conditions). Link: the Pre-SDD master (chunked) or combined file. With none, one row whose Pre-SDD cell reads "None - <reason>" and the other cells "-": not derived from a BRD; declined, with the decision-log.md link; or not yet run, with the open request (HR-NNN). Checked on every run (SKILL.md step 1): a newer signed Pre-SDD version gets one offer. -->

| Key | Pre-SDD | Version | Gate | Link |
|-----|---------|---------|------|------|
| PSDD | [Pre-SDD project name] | [X.X] | [G3 Approved / G3 Approved with conditions] | [[pre-sdd-slug]-pre-sdd-master.md](../pre-sdd-[pre-sdd-slug]/[pre-sdd-slug]-pre-sdd-master.md) |

### Child LLDs (children)

<!-- Written by lld-unifier: each LLD that reads this SDD (Direction: from-sdd, hybrid, partial, or from-code with this SDD given) adds or updates its own row, matched by Link; SDD version is the SDD version that LLD reflects (lld-unifier step 6c). Checked by sdd-unifier on every run: links resolve, scope services exist in §13, sibling LLD masters (lld-*/*lld-master.md) and combined LLDs (LLD-*.md, skipping LLD-*-MERGED.md: a merged copy of a chunked LLD already registered through its master) whose Related SDD line links to this SDD's master are added if missing, stale rows are flagged, never deleted. A row whose SDD version is older than this SDD's version is out of date: sdd-unifier appends " (out of date: SDD is now v[X.X]; refresh through lld-unifier) Affected: [anchor links]" to its SDD version cell (replacing an earlier such note) and names the LLD in the handoff; Affected lists, by anchor link, every SDD section changed since the row's SDD version (the Anchors of the Changes Log rows after it; a row with no `Anchors:` contributes its `Chunks:` list, for example "Affected: see Chunks 11, 13b of v[X.X]"), and lld-unifier maps them to its own sections; it never writes into the LLD, whose next run rewrites its own row and clears the note only when the row then names this SDD's current version. Before any LLD exists: one row "None yet". -->

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| None yet | - | - | - | - | - |

---

## Changes Log

<!-- Initial row: names the open items the first build's acceptance loop applied (SKILL.md step 8 item 3), then Chunks: none (initial build), dated when the first build completes (when part 3 completes in parts, when the run completes in whole). Later rows: Chunks lists semantic edits only, excluding routine synchronized metadata; date = the request's first content change. Review-content changes count, a new coverage record row included when the update changes other content (coverage rows alone bump nothing); companion headers reflect current parent without a separate bump. -->

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial draft. Review: full. Chunks: none (initial build) |

<!-- One row per update that changes content (SKILL.md § Output conventions, Versions), ending with its `Chunks:` list. Before `Chunks:` the row carries its review stamp, `Review:` and the baseline that ran: `full` (the first build), `delta`, `application check`, `none needed: <reason>` (no content in chunks 01 to 17 changed), or `not run` (the review could not run, for example in a delta apply without it; SKILL.md § Running outside Claude Code). A replay adds `replays v[X.X]`. A `not run` row is a review owed (SKILL.md step 10, common tail). When the change reaches a child LLD (SKILL.md step 9a), `Anchors:` follows the stamp and lists each changed SDD section as an anchor link, for example `Anchors: [§15.2](./11-api-contracts.md#anchor)`. `Chunks:` stays last and unchanged. Reviewed By and Approved By: SKILL.md § Output conventions, Approvals. -->

---

## Table of Contents

<!-- Auto-generated or manually maintained: in CHUNKS mode one entry per chunk, in file-name order (05a follows 05; chunk 20, the deck brief, has no entry: SKILL.md step 8c item 7); in COMBINED mode one entry per numbered section (§8.6 and §8.7 follow §8.5). Include Figures and Tables indices if the document is large. -->

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | [Title] | [Section] |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | [Title] | [Section] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
