# Chunking Strategy

The CHUNKS mode produces multiple `.md` files, one per logical template-section grouping. This file defines what a chunk is, the canonical chunk map, when to deviate, and how merge handling works.

The chunk skeletons are embedded in this skill folder under `chunks/` — they are the authoritative source for section structure inside each chunk.

---

## Principles

1. **A chunk is a unit of reading, not a unit of storage.** Each chunk groups sections that a reader would read in one sitting, usually to answer one class of question.
2. **Never split by size.** Line count is irrelevant to chunking. A 30-line chunk and a 600-line chunk can both be correct.
3. **Related sections stay together.** Glossary + Assumptions + Facts + Challenges + Dependencies all answer "what should I know before reading the rest?" — they belong in one chunk.
4. **Detailed use cases split per persona.** One chunk per persona (`06a`, `06b`, ...), in the same persona order as chunk 05. A persona with very many use cases may split by journey stage (`06a1`-style splits are not used; prefer `06a`, `06b` per persona and note the deviation).
5. **Every chunk is self-describing.** The first lines of every chunk are an HTML comment block identifying it.
6. **The embedded skeletons in `chunks/` define section structure, not content.** Copy the structure when generating; replace placeholders with project content.
7. **Business language only, everywhere.** Every chunk states the WHAT in business terms. No technology names, protocols, or implementation terminology — the HOW is owned by the SDD (`sdd-unifier`). Technical mandates found in source material are parked verbatim in chunk 12 § Technical Inputs for the SDD.

---

## Canonical chunk map

Use this as the default. Numbering is stable — `08-` is always "Integrations" regardless of how many use-case chunks precede it — because stable numbering makes the merge step trivial.

| # | Filename | Embedded skeleton | Content (template sections) | Typical size |
|---|---|---|---|---|
| 00 | `00-cover-and-changelog.md` | `chunks/00-cover-and-changelog.md` | Title block (name, version, author, date, status), Changes Log, Table of Contents placeholder, Figures index, Tables index. | Small |
| 01 | `01-executive-summary-and-context.md` | `chunks/01-executive-summary-and-context.md` | Executive Summary, Background and Context / Problem Statement, Business Objectives. | Small–Medium |
| 02 | `02-glossary-assumptions-facts.md` | `chunks/02-glossary-assumptions-facts.md` | Glossary (business terms only), Assumptions / Constraints, Facts, Challenges (incl. challenge evidence table), Dependencies. | Medium |
| 03 | `03-definitions-and-domain-concepts.md` | `chunks/03-definitions-and-domain-concepts.md` | Definitions & Important Details — the domain deep-dive, in business terms. Often the longest chunk; if >600 lines, split into `03a-`, `03b-`. | Medium–Large |
| 04 | `04-scope-and-personas.md` | `chunks/04-scope-and-personas.md` | Project Scope (narrative + In Scope / Out of Scope), Personas / Actors. Every persona becomes a matrix column and a use-case chunk. | Small |
| 05 | `05-user-journeys-overview.md` | `chunks/05-user-journeys-overview.md` | User Journeys (one narrative per persona), Summarized Workflow (inline Mermaid), Use Case Summary table. **No detailed UC blocks here.** A `Use Case Diagrams` section is added later, at checklist step 5 (gated; see `delivery-chunks.md`). | Medium |
| 06a, 06b, … | `06a-use-cases-[persona-slug].md` | `chunks/06a-use-cases-detailed.md` | Detailed use-case blocks, grouped **per persona** — one chunk per persona, in chunk-05 order. UC IDs sequential across the whole BRD. A `Flowchart` sub-section is added later to branching use cases, at checklist step 5 (gated). | Medium–Large each |
| 07 | `07-users-use-cases-matrix.md` | `chunks/07-users-use-cases-matrix.md` | **Users & Use Cases Matrix** — every persona (column) × every use case (row); Yes / - cells with footnotes for conditional access. Derived from the UC Actor fields; generated AFTER the 06x chunks and cross-checked against them. | Small–Medium |
| 08 | `08-integrations.md` | `chunks/08-integrations.md` | Integrations — business systems/partners, business purpose, information exchanged. No protocols, formats, auth, or SLAs (SDD-owned). | Small–Medium |
| 09 | `09-reporting-and-analytics.md` | `chunks/09-reporting-and-analytics.md` | Reporting / Analytics — what each report shows, audience, frequency, format. | Small |
| 10 | `10-nfrs.md` | `chunks/10-nfrs.md` | Non-Functional Requirements in business language: quality, business expectation (the what), business measure. Technical targets and realisation are SDD-owned. | Small–Medium |
| 11 | `11-summary-and-uiux.md` | `chunks/11-summary-and-uiux.md` | Summary, UI/UX Expectations. No Technical Implementation Expectations — that content lives in the SDD. | Small |
| 12 | `12-appendix-and-wishlist.md` | `chunks/12-appendix-and-wishlist.md` | Appendix (incl. optional **Technical Inputs for the SDD** — source technical mandates parked verbatim), Wishlist. | Small |
| 13 | `13-open-items-and-clarifications.md` | `chunks/13-open-items-and-clarifications.md` | **Open Items & Clarifications** — output of the post-generation cleared-context reviewer pass. Captures gaps, missing scenarios, corner cases; each item carries Options AND a concrete **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply. Generated *after* the body; never authored by the same context that wrote it. Followed by the user review-and-accept loop (see SKILL.md Step 8). | Small–Medium |
| 14 | `14-todo.md` | `chunks/14-todo.md` | **Product Manager To-Do** (delivery chunk) - prioritised living checklist: resolve open items, consistency check, grill-me, Figma mockups, use-case diagrams and flowcharts. Tracks the gated diagram step; never the home of a diagram. **Excluded from merge.** | Medium |
| 15 | `15-implementation.md` | `chunks/15-implementation.md` | **Implementation Plan** (delivery chunk) - every `06*` use case consolidated into dependency-ordered tasks (`TASK-NN`) with waves, dependency problems, completion criteria. **Locked until chunk 14 is cleared.** Included in merge. | Medium–Large |
| 16 | `16-uat-bat-test-cases.md` | `chunks/16-uat-bat-test-cases.md` | **UAT/BAT Test Cases** (delivery chunk) - business-level acceptance cases traced to use cases, NFRs, and tasks, with provisional scenarios and coverage gaps. **Locked until chunk 14 is cleared.** Included in merge. | Large |
| 17 | `17-for-ppt.md` | `chunks/17-for-ppt.md` | **Presentation & Video Brief** (delivery chunk) - executive slide sequence plus a series of 30-second use-case videos. **Locked until chunk 14 is cleared.** **Excluded from merge.** | Medium–Large |

Chunks 14-17 are **delivery chunks**, derived from the finished BRD in the order 14 -> 15 -> 16 -> 17. They cite the body by ID and link and never add requirements. **Chunk 14 is written at the end of every generation**, after the Open Items acceptance loop (in `parts` generation, at the end of part 3). **Chunks 15, 16, and 17 are locked**: they cannot be generated or refreshed until every action item in chunk 14 is closed (all five to-do steps `Complete` with evidence, every item `Resolved`; `Deferred` does not count; no override). Rules: `delivery-chunks.md` § The delivery gate.

Total typical chunk count: **15–19** after a first run (body plus `14-todo.md`), **18–22** once the delivery gate has opened, depending on how many personas / use-case chunks exist.

`brd-master.md` (also in `chunks/`) is a master index pointing at the chunks. Regenerate it per project so it links to that project's chunks specifically.

**Generation parts.** By default the chunks are written in three parts, with a stop for the user's review after parts 1 and 2: part 1 = 00-05 (plus `brd-master.md`), part 2 = every `06*` chunk and 07, part 3 = 08-14. `whole` writes 00-14 in one run. See `parts-mode.md`.

---

## Chunk naming

- Two-digit prefix with optional letter suffix (`06a`, `06b`) for multi-chunk sections.
- Slug in kebab-case, all lowercase, no special characters.
- `.md` extension.

Examples:
- `00-cover-and-changelog.md`
- `06a-use-cases-tenant-admin.md`
- `06b-use-cases-operator.md`
- `07-users-use-cases-matrix.md`

---

## Chunk header (mandatory)

Every chunk begins with this HTML comment block (invisible when rendered, parseable on merge):

```markdown
<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Tenant Admin
PROJECT: Wallet Management Service
VERSION: 1.0
PART OF: BRD - Wallet Management Service
-->

# Detailed Use Cases - Tenant Admin

...
```

Delivery chunks (14-17) add two keys to this block: `TYPE: Delivery chunk` and `MERGE: Included | Excluded`. The merge step reads `MERGE:` to decide whether the chunk is concatenated.

After the comment, the chunk's top-level heading begins at `#`. Sub-sections use `##`, `###`. Heading levels are scoped per chunk. The merge step does not demote headings — each chunk's `#` becomes a distinct major section of the merged doc.

---

## When to deviate from the canonical map

Deviate, and note the deviation in the final handoff summary, when:

1. **A template section is genuinely empty** (e.g., a back-office-only product has no Reporting / Analytics). Keep the chunk, but make it minimal: the heading plus "Not applicable for this release."
2. **Definitions & Important Details spans more than one substantial domain concept** and exceeds ~600 lines. Split into `03a-definitions-[concept-1].md`, `03b-definitions-[concept-2].md`.
3. **Persona count is very high (>6).** Group minor personas that share most use cases into one chunk (e.g., `06c-use-cases-viewers.md` covering Viewer + Auditor) and say so in the chunk title.
4. **Use case count is very low (≤6) with one or two personas.** Collapse `05-user-journeys-overview.md` and `06a-use-cases-*.md` into one chunk, `05-user-journeys-and-use-cases.md`. Keep chunk 07 (the matrix) separate — it is always its own chunk.

Do NOT deviate because a chunk "looks too short" — short chunks are fine when the template section is short. Do NOT deviate to merge semantically distinct chunks for the sake of fewer files. Never merge the matrix (07) into another chunk.

---

## Skip rules (sections that are optional per the template)

- **Figures / Tables index** on the cover chunk — include an empty skeleton; populate as Mermaid figures and tables are added across other chunks.
- **Challenge evidence table** in Challenges — include only if evidence examples were provided.
- **Future Enhancements per UC** — always include; if genuinely nothing, write `- None identified at this time.`
- **UI/UX per UC** — include the heading; if no wireframe yet, reference the global UI/UX Expectations and write `No wireframe required for this use case.` or `Wireframe pending — see global UI/UX standards in chunk 11.`
- **Technical Inputs for the SDD** in chunk 12 — include only if the source material contained technical mandates; otherwise omit the sub-section.
- **Matrix footnotes** in chunk 07 — only where access is conditional; a bare `Yes` / `-` is the norm.
- **Use Case Diagrams** in chunk 05 and **Flowchart** per UC in chunks `06*`: never emitted at first generation. They are added at checklist step 5 (`14-todo.md`) after steps 1-4 are confirmed complete. A flowchart is required only for use cases with 3 or more Main Flow steps and at least one decision point; linear or very short use cases skip it, with the reason recorded in `14-todo.md`.
- **`14-todo.md`**: generated at the end of every generation (in `parts`, at the end of part 3). Skipped only when the user explicitly asks for the BRD alone; say so in the handoff.
- **Chunks 15, 16, 17**: never generated while the delivery gate is shut. Their absence after a first run is expected, not a gap.

---

## Merge handling (chunks → combined)

On merge, chunks are concatenated in numeric order (00, 01, 02, 03, 03a, 03b, 04, 05, 06a, 06b, …, 07, 08, 09, 10, 11, 12, 13, then 15 and 16 when they exist). **Chunks 14 (`14-todo.md`) and 17 (`17-for-ppt.md`) are never merged**: skip every chunk whose header says `MERGE: Excluded`. They stay as separate files next to the merged BRD, and links to them keep working because the merged file lives in the same folder. The merge step:

1. Strips the `<!-- CHUNK: ... -->` comment from each chunk, and its `<!-- MASTER: ... | PREV: ... | NEXT: ... -->` footer comment.
2. Concatenates with a single blank line between chunks (no extra `---` separators unless the template calls for one).
3. Regenerates the Table of Contents in chunk 00 against the merged heading outline.
4. Regenerates the Figures and Tables indices if they exist.
5. Writes to `BRD-[ProjectName]-v[X.X]-MERGED.md` alongside the chunks.

Original chunks are kept — the merged file is a consolidated view.

---

## Re-chunk handling (combined → chunks)

When asked to split a combined BRD into chunks:

1. Read the combined file fully.
2. Identify section boundaries by `# ` and `## ` headings matching the canonical template order.
3. Group sections per the chunk map above.
4. For each output chunk:
   a. Prepend the `<!-- CHUNK: NN ... -->` comment block.
   b. Promote the first matching `## ` heading to `# ` (since chunks are scoped to a single major section).
   c. Adjust deeper heading levels accordingly (was `###` in combined → becomes `##` in chunk).
5. Write each chunk to `./brd-[slug]/NN-*.md`. The combined file's `# Implementation Plan` and `# UAT/BAT Test Cases` sections become chunks 15 and 16.
6. `14-todo.md` and `17-for-ppt.md` already exist as files in `./brd-[slug]/` (combined mode writes them there). Keep them, and repoint their BRD links from the combined file to the new chunk files.
7. Keep the original combined file.
