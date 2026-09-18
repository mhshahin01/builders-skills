# Modes — Chunks vs Combined

The skill produces output in one of two shapes. The shape is determined either by the argument passed to the skill (`brd-unifier chunks` / `brd-unifier combined`) or, when no argument is passed, by the interactive mode prompt.

This file describes what each mode is, when to prefer which, and how the modes relate to each other.

---

## CHUNKS mode

**Output:** A folder of `.md` files, one per logical template-section grouping, written to `./brd-[project-slug]/`.

**Skeleton source:** `chunks/*.md` (embedded in this skill folder). Each file in `chunks/` is a section-scoped template skeleton — copy its structure, fill it with project-specific content, and save under the same filename in the output folder.

**File list (canonical):**

```
brd-[project-slug]/
├── 00-cover-and-changelog.md
├── 01-executive-summary-and-context.md
├── 02-glossary-assumptions-facts.md
├── 03-definitions-and-domain-concepts.md
├── 04-scope-and-personas.md
├── 05-user-journeys-overview.md
├── 06a-use-cases-[persona-slug].md   # one chunk per persona: 06a, 06b, ...
├── 07-users-use-cases-matrix.md
├── 08-integrations.md
├── 09-reporting-and-analytics.md
├── 10-nfrs.md
├── 11-summary-and-uiux.md
├── 12-appendix-and-wishlist.md
├── 13-open-items-and-clarifications.md
├── 14-todo.md                        # delivery chunk - every generation - never merged
├── 15-implementation.md              # delivery chunk - locked until 14 is cleared - merged
├── 16-uat-bat-test-cases.md          # delivery chunk - locked until 14 is cleared - merged
└── 17-for-ppt.md                     # delivery chunk - locked until 14 is cleared - never merged
```

`brd-master.md` (also in `chunks/`) is the master index pointing at the chunks; regenerate it for each output project.

Chunks 14-17 are the **delivery chunks**, in the order 14 -> 15 -> 16 -> 17. `14-todo.md` is generated at the end of every generation, after the Open Items acceptance loop (in `parts`, at the end of part 3). Chunks 15, 16, and 17 are locked until every action item in `14-todo.md` is closed, so they are absent after a first run. See `delivery-chunks.md` § The delivery gate.

**Each chunk starts with** the self-describing HTML comment block:

```markdown
<!--
CHUNK: 03
TITLE: Definitions & Important Details
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: BRD - [Project Name]
-->
```

See `chunking.md` for chunking strategy, deviation rules, and merge handling.

**When to prefer:**

- Teams will edit different sections in parallel (PMs, architects, designers each owning different sections).
- The BRD is large (>500 lines) — a single file becomes hard to navigate.
- Sections will be regenerated independently as requirements evolve.
- The user wants to share a specific section (e.g., FR detail) without exposing the whole BRD.

---

## COMBINED mode

**Output:** A single `.md` file written to `./BRD-[ProjectName]-v[X.X].md`.

**Skeleton source:** `TEMPLATE-COMBINED.md` (embedded in this skill folder). Copy its structure, fill section by section.

**Structure follows the template top-to-bottom:**

1. Title block (name, version, author, date, status)
2. Changes Log
3. Table of Contents (with Figures and Tables indices)
4. Executive Summary
5. Background and Context / Problem Statement
6. Business Objectives
7. Glossary (business terms only)
8. Assumptions / Constraints
9. Facts
10. Challenges
11. Dependencies
12. Definitions & Important Details
13. Project Scope (incl. In Scope / Out of Scope)
14. Personas / Actors
15. User Journeys & Use Cases (journeys per persona + Summarized Workflow + Use Case Summary + Detailed Use Cases per persona)
16. Users & Use Cases Matrix
17. Integrations (business-level)
18. Reporting / Analytics
19. Non-Functional Requirements (business language)
20. Summary
21. UI/UX Expectations
22. Appendix (incl. Technical Inputs for the SDD, if any)
23. Wishlist
24. Open Items & Clarifications (post-generation reviewer output; every item carries a Recommended Answer with its Why)
25. Implementation Plan (delivery chunk 15, as a section; appended only once the delivery gate is open)
26. UAT/BAT Test Cases (delivery chunk 16, as a section; appended only once the delivery gate is open)

**Never inside the combined file:** the Product Manager To-Do and the Presentation & Video Brief. In COMBINED mode they are separate files: `./brd-[project-slug]/14-todo.md` (every generation unless the user skips it; create the folder if needed) and `./brd-[project-slug]/17-for-ppt.md` (only once the delivery gate is open). Their links to the BRD target `../BRD-[ProjectName]-v[X.X].md` with the section name or identifier in the link text; the combined file links to them as `./brd-[project-slug]/14-todo.md`. Details: `delivery-chunks.md` § COMBINED mode adaptations.

**No chunk comment blocks** in combined mode — the file is a single artefact. (The two separate delivery files keep their comment blocks.)

**When to prefer:**

- Sharing the BRD as one attachment to a stakeholder, vendor, or external reviewer.
- Submitting for a formal review/approval pipeline that expects one file.
- Small BRDs (<300 lines) where chunking is overhead.
- Archiving a finalised version.

---

## Cross-mode conversion

The two modes are reversible.

### Chunks → Combined (merge)

When the user says "merge", "consolidate", "single file", "full doc" after a chunks-mode generation:

1. Read all `brd-[slug]/NN-*.md` files in numeric order (00, 01, 02, 03, 03a, 03b, 04, 05, 06a, 06b, …, 07, 08, 09, 10, 11, 12, 13, then 15 and 16 when they exist). **Skip `14-todo.md` and `17-for-ppt.md`** (header `MERGE: Excluded`); they are never part of the merged BRD.
2. Strip each chunk's `<!-- CHUNK: ... -->` HTML comment block and its `<!-- MASTER: ... | PREV: ... | NEXT: ... -->` footer comment.
3. Concatenate with a single blank line between chunks.
4. Regenerate the Table of Contents in the cover section against the merged heading outline.
5. Regenerate the Figures and Tables indices.
6. Write to `./brd-[slug]/BRD-[ProjectName]-v[X.X]-MERGED.md`.
7. Keep the original chunks — the merged file is a consolidated view, not a replacement.

### Combined → Chunks (re-chunk)

When the user says "split into chunks", "chunk this BRD", "re-chunk this":

1. Read the combined file fully.
2. Identify section boundaries by `# `, `## ` headings matching the template structure.
3. Group sections per the canonical chunk map (see `chunking.md`).
4. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block.
5. Demote the chunk's top-level heading appropriately (the chunk's first heading becomes `# `).
6. Write each chunk file to `./brd-[slug]/NN-*.md`. The `# Implementation Plan` and `# UAT/BAT Test Cases` sections become `15-implementation.md` and `16-uat-bat-test-cases.md`; the existing `14-todo.md` and `17-for-ppt.md` stay where they are, with their BRD links repointed to the chunk files.
7. Keep the original combined file alongside the chunks.

---

## When the user changes their mind mid-run

If the user has already approved a mode and then asks for the other shape mid-generation:

- If you've written nothing yet: switch silently and proceed.
- If you've written some output: finish writing the current file, then offer the cross-mode conversion. Do not silently delete what you've already produced.

---

## Generation option: parts or whole

A third, separate choice: **how much is written before the user looks at it**.

| Option | Behaviour | Applies to |
|---|---|---|
| `parts` (default) | Three parts: chunks 00-05, then `06*` and 07, then 08-14. The skill stops after parts 1 and 2 and waits for the user's go-ahead. | CHUNKS mode |
| `whole` | Chunks 00-14 in one run | CHUNKS mode on request; **always** COMBINED mode; always merge, re-chunk, and targeted updates |

A combined BRD is a single file, so it is always written whole. Rules, checklists, and resuming: `parts-mode.md`.

---

## Mode is independent of intent

Mode (CHUNKS / COMBINED) describes the **output shape**. Intent (GENERATE / TRANSFORM) describes the **input handling**. They are orthogonal:

|  | GENERATE | TRANSFORM |
|---|---|---|
| **CHUNKS** | Author a fresh BRD as 15+ chunked files (body 00-13 plus `14-todo.md`); 15-17 follow once the delivery gate is open. | Re-shape source material into 15+ chunked files. |
| **COMBINED** | Author a fresh BRD as a single file, plus `14-todo.md` as a separate file; `17-for-ppt.md` follows once the gate is open. | Re-shape source material into a single file, plus the separate to-do file. |

See `transform-detection.md` for how to decide intent.
