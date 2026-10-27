<!--
CHUNK: 00
TITLE: Cover, Changelog & Indexes
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: none
PART OF: Pre-SDD - [Project Name]
-->

# [Project / Product Name]: Pre-SDD (Pre-Solution Design)

**Project / Product Name:** [Project Name] <!-- HDR-01, as chunk 01 holds it. -->
**Version:** [X.X] <!-- The current Pre-SDD version (project.pre_sdd_version); the master carries the same. -->
**Mode:** [full | quick][, light] <!-- As the master's Generation line records it. -->
**Gate:** [the engine's gate label: Draft | G0 | G1 | G2 | Blocked | G3 Approved | G3 Approved with conditions | Discovery] <!-- Copied from the gate fragment in chunk 11 (quick mode: from the engine's gate result, which reads Discovery). Never written from memory. -->
**Engine:** pre-sdd-engine [3.0.0], skill pre-sdd-unifier [1.0.0] <!-- As `cli.mjs --version` prints them. -->
**Author:** E2E Architect (pre-sdd-unifier)
**Confirmer:** [Name of the person whose answers and confirmations this run records; one line per person who answered]
**Signers:** [Each G3 signer with the roles they signed, or "Not signed"] <!-- From chunk 11; writing a signature here bumps nothing. -->
**Date:** [YYYY-MM-DD]
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and the consuming SDD)

---

## Document Lineage

<!-- One Pre-SDD per system. Its parent BRDs are the ones the SDD will have. The project state holds the same list (project.brds), written by `cli.mjs new --brd` and later by the set-brd op. -->

### Source BRDs (parents)

<!-- One row per source BRD, in the project state's order. Key: the short capital key given at intake (REFUNDS, WALLET), stable once seen; every BRD reference in this Pre-SDD carries it (REFUNDS/NFR-03). Version: the BRD version this Pre-SDD was built from or last updated against. Status: the BRD cover's Status at that version; a BRD that is not Approved is named in the handoff summary, and the answer to "go on?" is in decision-log.md. Link: the BRD master (chunked) or combined file, relative to this folder. -->

| Key | BRD | Version | Status | Link | Covers |
|-----|-----|---------|--------|------|--------|
| [KEY] | [BRD project name] | [X.X] | [Draft / In Review / Approved] | [[brd-slug]-brd-master.md](../brd-[brd-slug]/[brd-slug]-brd-master.md) | [What this BRD contributes] |

### Consuming SDD (child)

<!-- The SDD that loads this Pre-SDD (sdd-unifier). This skill never writes into the SDD: it fills this row from the SDD's own chunk 00, whose Source Pre-SDD row names this Pre-SDD, the first time it finds one beside this folder. Filling the row adds a link, which is not a content change: it bumps nothing. Before any SDD exists: one row "None yet". -->

| SDD | Version | Pre-SDD version it loaded | Link |
|-----|---------|---------------------------|------|
| None yet | - | - | - |

---

## Changes Log

<!-- One update, one version (SKILL.md § Output conventions, Versions). The first build is 1.0 and its row ends with "Chunks: none (initial build)". A later update's first content change bumps the version one minor step (the set-version op) and opens one row, which every later change in the update joins; the row ends with "Chunks:" and the number of every chunk whose content changed. Sign-offs, gate and status lines, board rows, links, footers, and index rows bump nothing. Reviewed By: the cleared-context reviewer pass (chunk 13). Approved By: the G3 signers of that version, from chunk 11; filling it bumps nothing. -->

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial build. Chunks: none (initial build) |

---

## Indexes

### Table of Contents

<!-- One row per chunk this Pre-SDD holds. An omitted chunk (06 without brownfield or mixed, 08 without the overlay, 04 to 09 and 11 to 13 in quick mode) has no row. -->

| Section | Chunk |
|---------|-------|
| 1. Business Brief | [01-business-brief.md](./01-business-brief.md) |
| 2. Classification and Path | [02-classification-and-path.md](./02-classification-and-path.md) |
| 3. Requirement Register | [03a](./03a-register-business.md) to [03h](./03h-register-economics.md) |
| 4. Targets and Calculations | [04-targets-and-calculations.md](./04-targets-and-calculations.md) |
| 5. Target Shape | [05-target-shape.md](./05-target-shape.md) |
| 6. Existing Estate | [06-existing-estate.md](./06-existing-estate.md) |
| 7. Options and Economics | [07-options-and-economics.md](./07-options-and-economics.md) |
| 8. Migration Overlay | [08-migration-overlay.md](./08-migration-overlay.md) |
| 9. Decisions | [09-decisions.md](./09-decisions.md) |
| 10. Validation, Risks and Unknowns | [10-validation-risks-unknowns.md](./10-validation-risks-unknowns.md) |
| 11. Gate and Sign-off | [11-gate-and-sign-off.md](./11-gate-and-sign-off.md) |
| 12. SDD Handoff Guide | [12-sdd-handoff-guide.md](./12-sdd-handoff-guide.md) |
| 13. Open Items and Clarifications | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md) |

### Register Index

<!-- Where each register row lives, so a `PSDD/<ID>` link resolves. Each row is a `### <ROW-ID>` heading in its chunk. -->

| Rows | Group | Chunk |
|------|-------|-------|
| HDR-01 to HDR-10 | Project header | [01 § 1.1](./01-business-brief.md#11-project-header) |
| BUS-01 to BUS-08 | Business | [03a](./03a-register-business.md) |
| CAP-01 to CAP-12 | Capacity | [03b](./03b-register-capacity.md) |
| REL-01 to REL-10 | Reliability | [03c](./03c-register-reliability.md) |
| DAT-01 to DAT-09 | Data | [03d](./03d-register-data.md) |
| SEC-01 to SEC-08 | Security | [03e](./03e-register-security.md) |
| INT-01 to INT-09 | Integration | [03f](./03f-register-integration.md) |
| OPS-01 to OPS-08 | Operations | [03g](./03g-register-operations.md) |
| ECO-01 to ECO-06 | Economics | [03h](./03h-register-economics.md) |
| OVL-01 to OVL-12, per workload `WL-NN` | Migration overlay (only when it applies) | [08 § 8.1](./08-migration-overlay.md#81-overlay-register) |

### ID Index

| IDs | What | Chunk |
|-----|------|-------|
| `CALC-NN` (`CALC-21@OPT-NN`, `CALC-22@OPT-NN`) | Calculations; option TCO and weighted score | [04 § 4.2](./04-targets-and-calculations.md#42-calculations), [07 § 7.1](./07-options-and-economics.md#71-options) |
| `OPT-NN` | Options (shapes, never products) | [07 § 7.1](./07-options-and-economics.md#71-options) |
| `DT-01` to `DT-15` | Decision rules | [09 § 9.2](./09-decisions.md#92-decision-tree) |
| `ADR-<AREA>-NNN` | Pre-SDD ADRs | [09 § 9.4](./09-decisions.md#94-pre-sdd-adrs) |
| `QD-NN` | Unknowns | [10 § 10.1](./10-validation-risks-unknowns.md#101-validation-and-unknowns) |
| `R-NN` | Risks | [10 § 10.2](./10-validation-risks-unknowns.md#102-risks) |
| `G3-01` to `G3-14`, `COND-NN`, `EXC-NN` | G3 checklist, conditions, exceptions | [11 § 11.1](./11-gate-and-sign-off.md#111-gate-result) |
| `OI-NN` | Reviewer open items | [13](./13-open-items-and-clarifications.md) |

### Figures

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | [Title] | [Section] |

### Tables

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | [Title] | [Section] |

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: none | NEXT: 01-business-brief.md -->
