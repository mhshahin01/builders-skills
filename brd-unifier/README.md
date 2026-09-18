# BRD Unifier

The requirements stage of the suite: it converts ideas, SoWs, and existing documents into the house-template Business Requirements Document (stage 2, Requirements). Part of the Product Documentation Skill Suite (see the repo-root `README.md` for the full lifecycle).

---

## What

`brd-unifier` generates, transforms, or reformats a Business Requirements Document (BRD or BRD-HLD) into the user's standardised template. It can build a fresh BRD from a SoW, project brief, product spec, RFP scope, conversation, or topic seed, and it can re-shape an existing document (an old-format BRD, a flat scope doc, a single-file BRD that needs chunking, or a chunked BRD that needs combining) into the template.

The BRD is business language only: the WHAT, never the HOW. No technology names, protocols, or implementation terminology in the body. Technical mandates found in source material are parked verbatim in Appendix § Technical Inputs for the SDD, and the technical design itself belongs to `sdd-unifier`.

The embedded templates are the authoritative source: `TEMPLATE-COMBINED.md` for the single-file layout and `chunks/*.md` for the chunked layout.

**Chunk map:**

| Chunks | Content |
| ------ | ------- |
| 00-04 | Cover and changelog, executive summary, glossary and assumptions, domain concepts, scope and personas |
| 05, 06a..., 07 | User journeys with use-case diagrams, one detailed UC-NN use-case chunk per persona, Users and Use Cases permission matrix |
| 08-12 | Business-level integrations, reporting, NFRs as business expectations, summary and UI/UX, appendix and wishlist |
| 13 | Open Items and Clarifications (reviewer output) |
| 14 | Product-manager to-do: resolve open items, consistency check, grill-me session, Figma mockups, use-case diagrams and flowcharts |
| 15-17 | Implementation plan, UAT/BAT test cases, presentation and video brief |

## Why

- **Business language only, enforced.** The BRD states the WHAT in plain language. Technical content is never spread into the body; it is parked verbatim in the appendix for the SDD, so nothing is lost and nothing leaks.
- **User-journey first.** Requirements are per-persona use cases (UC-NN) with numbered steps, alternate and exception flows, business rules, and acceptance criteria, not abstract feature statements. Every persona gets a journey, a use-case chunk, and a column in the matrix.
- **A real review, not a confirmation.** Every full generation ends with a cleared-context adversarial reviewer subagent that writes chunk 13 (Open Items and Clarifications). Each item carries options with tradeoffs, a paste-ready Recommended Answer, and the Why. The skill then walks the user through accept, adjust, or defer, and applies accepted answers to the body. A zero-findings review is pushed back and re-dispatched.
- **Parts by default, with a real stop.** In chunks mode the BRD is written in three parts, stopping after parts 1 and 2 so scope, personas, and the use-case list are agreed before the detail is written.
- **The matrix is derived, never authored.** The Users and Use Cases Matrix is built from the completed use cases and cross-checked both directions; a contradiction means the use case is fixed first, never the matrix.
- **Gaps are flagged, never papered over.** Anything the source does not cover becomes `**[NEEDS CLARIFICATION: ...]**`; nothing is invented to fill a table.
- **Delivery chunks are earned.** Chunks 15-17 (implementation plan, UAT/BAT test cases, presentation brief) are locked behind a delivery gate (conditions G1-G5): every to-do step in chunk 14 complete with evidence and every item resolved. `Deferred` does not count, and there is no override.
- **One fact, one home.** UC IDs, persona names, and integration IDs stay stable across revisions so the downstream SDD and LLD can reference them; nothing is restated across chunks. Decision history lives in `decision-log.md`, the companion register, never in the body.

## How

### Usage

```text
brd-unifier [chunks|combined] [parts|whole]
```

| Argument | Action |
| -------- | ------ |
| `chunks` | Multi-file chunked output, one `.md` per template section grouping, in `./brd-[project-slug]/`. Default. |
| `combined` | Single consolidated file `BRD-[ProjectName]-v[X.X].md`. |
| `parts` | Write the BRD in three parts (00-05, then `06*` and 07, then 08-14), stopping for the user's review after parts 1 and 2. Default in chunks mode. |
| `whole` | Write chunks 00-14 in one run. Always used in combined mode and for pure conversions and targeted updates. |
| (empty) | Resume check first: if `brd-master.md` shows a part Pending or In progress, continue it; otherwise prompt for the mode (chunks is the default). |

Invocation prefix depends on the agent: `/brd-unifier chunks parts` in Claude Code, `$brd-unifier chunks parts` in Codex, `/skill:brd-unifier chunks parts` in Kimi Code. Or describe the task in plain words ("turn this SoW into a BRD") and the agent picks the skill from its description. Words count as arguments too: "in one go" means `whole`, "part by part" means `parts`.

### The workflow

1. **Resolve mode and generation option.** From the arguments or the interactive prompt (chunks is the default; never guessed silently). A resume check on `brd-master.md` runs first, so an interrupted parts run continues instead of restarting.
2. **Resolve intent.** Generate (fresh BRD from a SoW, conversation, or seed) or transform (re-shape an existing document into the template), per `transform-detection.md`. Both end in the same output shape.
3. **Intake.** At most three questions: project name, source material, personas. Answers already in the conversation are not re-asked.
4. **Plan and generate.** Enumerate the chunks (one use-case chunk per persona, plus `14-todo.md`) and write them from the embedded skeletons. Diagrams are inline Mermaid with a prose summary; Miro only on explicit request. Transforms preserve verbatim numbers, dates, and commitments.
5. **Build the matrix.** The Users and Use Cases Matrix (chunk 07) is derived from the completed use cases, cross-checked in both directions, with conditional access footnoted.
6. **Plain-language pass.** Mandatory reread of every chunk against `writing-style.md`: short sentences, common words, no number, rule, or exception dropped.
7. **Adversarial review.** A cleared-context reviewer subagent hunts gaps, ambiguities, risks, matrix inconsistencies, and technical leaks, and writes chunk 13 with a Recommended Answer and Why per item.
8. **Acceptance loop.** The user decides each Open Item (accept, choose another option, defer); accepted answers are applied to the body and recorded in `decision-log.md`.
9. **Write the to-do.** `14-todo.md`: the open-items register, consistency check (C1-C8), grill-me inputs, mockup coverage, gated-diagram tracking, and the delivery gate block.
10. **Gated follow-ons, on later invocations.** Step 8b adds use-case diagrams and flowcharts once to-do steps 1-4 are confirmed. Step 8c writes chunks 15, 16, 17 in order, only once the delivery gate (G1-G5) verifies open against the files. Cross-mode conversion (merge, re-chunk, regenerate one chunk, refresh the to-do) is handled on explicit request.

### Outputs

- Chunked: `./brd-[project-slug]/` with `NN-short-title.md` chunks (`06a`, `06b`, ... per persona), `brd-master.md` with its Generation Progress table, and `decision-log.md`, the companion decision register.
- Combined: `./BRD-[ProjectName]-v[X.X].md`, with `14-todo.md` and `17-for-ppt.md` kept as separate files in `./brd-[project-slug]/`.
- Delivery chunks, once the gate opens: `15-implementation.md`, `16-uat-bat-test-cases.md`, `17-for-ppt.md` (in combined mode, 15 and 16 are appended as the last two sections).
- Markdown only, UTF-8, pipe tables, no hard line wrap. No `.docx` or `.pdf` unless explicitly requested.

### Reference files

| File | Contents |
| ---- | -------- |
| `TEMPLATE-COMBINED.md` | The single-file template, read at the start of any combined-mode generation |
| `chunks/*.md` | The per-chunk template skeletons, read at the start of any chunks-mode generation |
| `chunking.md` | Canonical chunk map, naming convention, merge rules |
| `modes.md` | Chunks vs combined behavioural details |
| `parts-mode.md` | The three parts, the checkpoint stop, exit checklists, back-fill, progress record, resuming |
| `transform-detection.md` | Rules for deciding generate vs transform |
| `sow-transformation.md` | Mapping SoW or existing-BRD content into the template |
| `mermaid-diagrams.md` | Inline Mermaid conventions for every diagram, plus the Miro-on-demand flow |
| `use-case-quality.md` | The bar for a substantive use case, flowchart quality, matrix consistency rules |
| `writing-style.md` | The plain-language style: rules, word list, and the mandatory plain-language pass |
| `decision-log.md` | The companion decision register: what belongs there, its structure, the companion-file rules |
| `delivery-chunks.md` | The rulebook for chunks 14-17: the delivery gate (G1-G5), to-do evidence rule, consistency check, task and test-case formats, refresh rules |
| `chunks/14-todo.md`, `chunks/15-implementation.md`, `chunks/16-uat-bat-test-cases.md`, `chunks/17-for-ppt.md` | The delivery chunk skeletons, used in both modes |
