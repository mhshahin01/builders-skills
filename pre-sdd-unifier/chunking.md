# Chunking Strategy

The CHUNKS mode writes one `.md` file per chunk, plus the master index, into `./pre-sdd-[slug]/`. This file defines the chunk map (quick and full, brownfield, overlay), the master and its progress table, the chunk header and footer, the engine fragments each chunk holds, combined mode, merge, and re-chunk.

The chunk templates are embedded in this skill folder under `chunks/`: they are the authoritative source for the structure inside each chunk. `TEMPLATE-COMBINED.md` is the same structure as one file.

---

## Principles

1. **A chunk is a unit of reading, not a unit of storage.** Each chunk answers one question a reader asks in one sitting: what the business needs, which path, what the register says, what the numbers are, what shape follows, which option, what is decided, what is still open, who signed, and what the SDD gets.
2. **Never split by size.** Line count is irrelevant.
3. **One register group, one chunk.** The 70 items split into eight chunks, `03a` to `03h`, one per group, in the engine's chunk letters (BUS a, CAP b, REL c, DAT d, SEC e, INT f, OPS g, ECO h). The stage 2 question order (BUS, SEC, DAT, INT, CAP, REL, OPS, ECO) is the order of asking, not of the chunks.
4. **Every chunk is self-describing.** It opens with an HTML comment block and closes with a footer comment.
5. **Numbers come from the engine.** Every number in a chunk is pasted from an engine fragment or cited by its ID; none is worked out by hand or in prose.
6. **An omitted chunk is omitted, not stubbed.** A chunk the mode or the path does not need is not written at all: no file, no index row, no footer link to it.

---

## Chunk map

| # | File | Template | Content | Written |
|---|---|---|---|---|
| 00 | `00-cover-and-changelog.md` | `chunks/00-cover-and-changelog.md` | Title block (version, mode, gate label, engine version, signers), Document Lineage (source BRDs with keys, versions, statuses, and links; the consuming SDD), Changes Log, indexes (contents, register, IDs, figures, tables) | quick and full |
| 01 | `01-business-brief.md` | `chunks/01-business-brief.md` | § 1.1 the project header rows HDR-01 to HDR-10; outcome, scope, critical journeys, and business constraints, linked to the BRD | quick and full |
| 02 | `02-classification-and-path.md` | `chunks/02-classification-and-path.md` | Classification (path code, hybrid, overlay, recovery tier, closest worked example), path evidence and required outputs, hybrid boundary | quick and full |
| 03a to 03h | `03a-register-business.md`, `03b-register-capacity.md`, `03c-register-reliability.md`, `03d-register-data.md`, `03e-register-security.md`, `03f-register-integration.md`, `03g-register-operations.md`, `03h-register-economics.md` | `chunks/03a-register-business.md` to `chunks/03h-register-economics.md` | The register, one chunk per group; 03a also holds "How to Read the Register" | quick (the stage 1 rows answered; every other value as `Estimated` with its source, or `Open`) and full |
| 04 | `04-targets-and-calculations.md` | `chunks/04-targets-and-calculations.md` | Targets (SLOs, latency budgets, RTO and RPO, capacity) by entry ID; every `CALC-NN` with formula, inputs, result, and status; what the numbers mean | full |
| 05 | `05-target-shape.md` | `chunks/05-target-shape.md` | Hosting, topology, DR strategy per failure scope, data shape, network shape, conflicts; the infrastructure, network, and DR diagrams, and the data, security, integration, and deployment diagrams when compute writes them | full |
| 06 | `06-existing-estate.md` | `chunks/06-existing-estate.md` | Brownfield inventory, observed baseline, constraints, as-is and to-be | full, brownfield or mixed |
| 07 | `07-options-and-economics.md` | `chunks/07-options-and-economics.md` | Options (shapes), the hard-constraint filter, a comparison with approved weights only, TCO | full |
| 08 | `08-migration-overlay.md` | `chunks/08-migration-overlay.md` | The overlay rows per workload, 7R per workload, cutover and fallback, transfer math, hazards, waves | full, overlay only |
| 09 | `09-decisions.md` | `chunks/09-decisions.md` | Requirement-to-consequence trace, decision tree (`DT-01` to `DT-15`), rule trace, Pre-SDD ADRs, the SDD ADRs this Pre-SDD drives | full |
| 10 | `10-validation-risks-unknowns.md` | `chunks/10-validation-risks-unknowns.md` | Blockers, conflicts, advisories, unknowns (`QD-NN`) with owner and due date; risks; the hard entries still `Open`, with their exceptions | quick and full |
| 11 | `11-gate-and-sign-off.md` | `chunks/11-gate-and-sign-off.md` | G0 to G3, the G3 checklist, the sign-off register, conditions, exceptions, "SDD initiation authorized by" | full |
| 12 | `12-sdd-handoff-guide.md` | `chunks/12-sdd-handoff-guide.md` | The contract for `sdd-unifier` (`handoff-guide.md`) | full |
| 13 | `13-open-items-and-clarifications.md` | `chunks/13-open-items-and-clarifications.md` | Reviewer findings `OI-NN` (`review-and-open-items.md`) | full |

**Which chunks a Pre-SDD has:**

- **Quick mode:** 00, 01, 02, 03a to 03h, and 10. No review, so no chunk 13; no gate, so no chunk 11 or 12.
- **Full mode:** 00 to 13 with 03a to 03h, except:
  - **06** only when the change type (HDR-07) is brownfield or mixed;
  - **08** only while the migration overlay applies (the engine's overlay switch, set with the `set-overlay` op).
- A light run writes the same chunks as a full run. It leaves out only what § Light run in SKILL.md lists (the data, security, integration, and deployment diagrams in 05, the weighted comparison in 07 unless the weights are approved, the closest-example pointer in 02, and review passes beyond one application pass).
- A quick Pre-SDD that continues into the full Pre-SDD keeps its chunks and adds the full-mode ones at the write-up.

When the path changes later (an update turns the overlay on or off, or the change type changes), the chunk is added or removed in that update, its index rows and the neighbours' footers follow, and the Changes Log row names it.

---

## The master

`[slug]-pre-sdd-master.md` (template: `chunks/pre-sdd-master.md`) is the index and the run's progress record. It is written at setup (SKILL.md step 5), right after `cli.mjs new`, before any chunk exists, and updated after every answered batch, every save, and every stop.

Its **Generation Progress** section holds:

- **Generation:** the mode (`full` or `quick`), plus `light` when set. A resume keeps it.
- **Source BRDs:** the system's BRDs with key, version, and status, so a resume matches this Pre-SDD to its system.
- **Gate:** the engine's gate label, the G3 status, and whether the SDD may start. `sdd-unifier` reads this line after chunk 12; a line that reads `Review` means the Pre-SDD is not signed.
- **Next:** the stage and group the run continues with, and what it waits for. The `set-run` op writes the same pointer into the project state.
- **The progress table:** one row per stage, with the columns Stage, Status, Group, Gate, Write-up, Review, and Handoff.

The index rows are added as the chunks are written. An omitted chunk has no row.

`decision-log.md` is a **companion file**, not a numbered chunk (`decision-log.md` in this skill folder): created on first use, linked from the master, and never merged.

`studio/` holds the project state, the Studio, and the `compute` output. It is never merged and never moved by a conversion.

---

## Chunk header and footer

Every chunk opens with this comment block:

```markdown
<!--
CHUNK: 03c
TITLE: Requirement Register - Reliability
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - Refunds Platform
-->
```

Chunks 06 and 08 add a `WRITTEN:` line that says when they exist; chunk 12 adds `AUDIENCE:`; chunk 13 adds `PURPOSE:`, `GENERATED_BY:`, and `WORKFLOW:`.

Every chunk closes with its footer, the last line of the file:

```markdown
<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03b-register-capacity.md | NEXT: 03d-register-data.md -->
```

The footers chain the chunks the Pre-SDD actually has, in file order, without gaps: chunk 00 has `PREV: none`, the last chunk `NEXT: none`. The templates show the full-mode chain with every optional chunk present. When a chunk is omitted, its neighbours link past it:

- without 06: 05's NEXT and 07's PREV name each other;
- without 08: 07's NEXT and 09's PREV name each other;
- in quick mode: 03h's NEXT is `10-validation-risks-unknowns.md`, and 10's PREV is `03h-register-economics.md` and its NEXT `none`.

The comment line above a template's footer says which of these applies; the written chunk keeps only the footer.

**Headings** keep the template's numbering (`# 4. Targets and Calculations`, `## 4.2 Calculations`), so a merge needs no promotion or demotion. Section numbers follow the chunk numbers, so an omitted chunk leaves a gap in the numbering; that is expected. The register chunks share the parent heading `# 3. Requirement Register`, and each holds one `## 3.N` group.

**Row headings and anchors.** Every register row is a `### <ROW-ID>` heading (`### REL-03`), its bold title line, and its entries table. The header rows are in chunk 01 § 1.1 and the overlay rows in chunk 08 § 8.1. A downstream citation `PSDD/REL-03.2` links to `03c-register-reliability.md#rel-03`; the anchor is the row ID in lower case.

---

## Engine fragments

`cli.mjs compute` writes one Markdown fragment per engine-rendered section into `studio/fragments/`. The skill pastes each one unchanged between its markers and never edits it:

```markdown
<!-- ENGINE-FRAGMENT: 03c-register-reliability.md -->
...the fragment, exactly as compute wrote it...
<!-- /ENGINE-FRAGMENT -->
```

The marker names the fragment file. The placeholder content between the markers in a template shows the shape the fragment gives; the pasted fragment replaces it whole. A wrong value is fixed in the project state through `derive --apply`, then recomputed and pasted again.

| Fragment | Chunk and section |
|---|---|
| `01-header.md` | 01 § 1.1 Project Header |
| `02-classification.md` | 02 § 2.1 Classification |
| `03a-register-business.md` to `03h-register-economics.md` | 03a § 3.1 to 03h § 3.8 |
| `04-calculations.md` | 04 § 4.2 Calculations |
| `05-target-shape.md` | 05 § 5.1 Shape |
| `07-options.md` | 07 § 7.1 Options |
| `08-overlay.md` | 08 § 8.1 Overlay Register (the fragment exists only while the overlay applies) |
| `09-rule-trace.md` | 09 § 9.3 Rule Trace |
| `10-validation.md` | 10 § 10.1 Validation and Unknowns |
| `11-gate.md` | 11 § 11.1 Gate Result |
| `12-locked-items.md` | 12 § 12.2 Locked Items |

Chunks 00, 06, and 13 hold no fragment. The diagrams in chunk 05 come from `studio/diagrams/*.mmd`, pasted unchanged into mermaid blocks. Prose around the fragments cites values by ID and states no number a fragment does not hold.

---

## Combined mode

COMBINED writes one file, `PRE-SDD-[ProjectName]-vX.Y.md` (PascalCase project name), in the project root, matching `TEMPLATE-COMBINED.md`. `./pre-sdd-[slug]/` still exists and holds `studio/` and `decision-log.md`; it holds no master and no chunks.

- **The cover is written at setup** (SKILL.md step 5), right after `cli.mjs new`: the title block, the **Generation:**, **Source BRDs:**, **Gate:**, and **Next:** lines, and the progress table, exactly as the master holds them. The title block has no **Mode:** or **Gate:** line of its own: the Generation and Gate lines below it carry both. `sdd-unifier` reads the cover's gate line where it reads a chunked Pre-SDD's master. The rest of the file is written at the write-up. Update the cover's lines and table after every answered batch, every save, and every stop, as the master is updated.
- The sections follow the chunk map in order, with the same headings, fragments, and markers. An omitted chunk's section is omitted, not stubbed.
- In-file links use anchors (`#rel-03`); links to the BRDs and to `./pre-sdd-[slug]/decision-log.md` are relative to the project root.
- The file name carries the Pre-SDD version (`vX.Y`), as the cover and the project state do. On a version bump the file is renamed to the new version, and the old name is not kept.

---

## Merge handling (chunks to one file)

On "merge" or "single file", with chunks present:

1. Read the master and every chunk the Pre-SDD has.
2. Strip each chunk's header comment and its footer, and the comment lines above the footer.
3. Concatenate in file order: 00, 01, 02, 03a to 03h, 04, 05, 06 (if present), 07, 08 (if present), 09, 10, 11, 12, 13, with a `---` rule between chunks, as `TEMPLATE-COMBINED.md` shows.
4. Keep only the first `# 3. Requirement Register` heading.
5. Copy the master's **Generation:**, **Source BRDs:**, **Gate:**, and **Next:** lines and the progress table into the cover, after the title block, unchanged. They replace chunk 00's **Mode:** and **Gate:** title lines, which the merged cover leaves out.
6. Rebase the links: a link to a chunk heading (`./03c-register-reliability.md#rel-03`) becomes an in-file anchor (`#rel-03`); a link to a chunk without an anchor becomes the anchor of its first heading; a link to `../brd-...` or `../sdd-...` stays; a link to `./decision-log.md` and `./studio/...` stays.
7. Regenerate the contents, figures, and tables indexes against the merged outline.
8. Write `PRE-SDD-[ProjectName]-vX.Y-MERGED.md` in `./pre-sdd-[slug]/`, beside the chunks.
9. Never include the master or `decision-log.md` in the merged file, and leave `studio/` as it is.

The original chunks are kept. A pure conversion changes no content and bumps nothing.

---

## Re-chunk handling (one file to chunks)

On "split into chunks" or "re-chunk", with a combined file present:

1. Read the combined file fully.
2. Find the section boundaries by their headings (`# 1.`, `# 2.`, `# 3. Requirement Register` with its `## 3.1` to `## 3.8` groups, `# 4.`, and so on).
3. Write one chunk per section, with the register's `## 3.N` groups as 03a to 03h, each starting with the shared `# 3. Requirement Register` heading. A section the combined file does not have is not written.
4. Add each chunk's header and footer. Its VERSION is the combined file's version for chunk 00, and for any other chunk the version of the newest Changes Log row whose `Chunks:` list names it, else the version of the first row.
5. Rebase the links: an in-file anchor becomes a link to the chunk that now holds that heading (`#rel-03` becomes `./03c-register-reliability.md#rel-03`); a link to a BRD or SDD gains `../` when it was relative to the project root; `./pre-sdd-[slug]/decision-log.md` becomes `./decision-log.md`.
6. Write the master: the cover's **Generation:**, **Source BRDs:**, **Gate:**, and **Next:** lines and the progress table move into its Generation Progress, and chunk 00 does not keep them. Chunk 00's title block gets its **Mode:** and **Gate:** lines back, from the Generation line and the engine's gate label.
7. Keep the original combined file, and leave `studio/` and `decision-log.md` as they are.

A pure conversion changes no content and bumps nothing.
