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
| [KEY] | [BRD project name] | [X.X] | [[project-slug]-brd-master.md](../brd-[project-slug]/[project-slug]-brd-master.md) | [What this BRD contributes] |

### Child LLDs (children)

<!-- Written by lld-unifier: each LLD derived from this SDD (from-sdd or hybrid) adds or updates its own row, matched by Link. Checked by sdd-unifier on every run: links resolve, scope services exist in §13, sibling lld-*/*lld-master.md files whose Related SDD line links here are added if missing, stale rows are flagged, never deleted. Before any LLD exists: one row "None yet". -->

| LLD | Scope (§13 services) | Direction | Version | Link |
|-----|----------------------|-----------|---------|------|
| None yet | - | - | - | - |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial draft. |

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
