---
name: brd-unifier
description: >-
  Generate, transform, or reformat a Business Requirements Document (BRD or BRD-HLD) into the user's
  standard template. Use when asked to create, draft, write, or build a BRD or BRD-HLD (business
  high-level design), or to convert a Scope of Work, Statement of Work, project brief, product spec,
  RFP scope, or old BRD into this template. Also use to update a BRD's to-do (14-todo.md), add
  use-case diagrams and flowcharts, or generate the implementation plan, UAT/BAT test cases, or
  presentation brief. Arguments: [chunks|combined] [parts|whole] [light] [phase=N]. The BRD is business language only
  (the WHAT); the technical HOW belongs to sdd-unifier. A technical HLD or architecture design
  belongs to sdd-unifier; an unqualified "HLD" request gets one short question (business or
  technical) unless the context decides. Output is Markdown only.
---

# BRD Unifier

Author, transform, and unify Business Requirements Documents (BRDs / BRD-HLDs) into the user's standardised template. This skill encapsulates the section structure, the per-persona use-case convention (`Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules & Constraints / Acceptance Criteria / Future Enhancements / UI/UX`), the Users & Use Cases Matrix, the chunking model, the SoW-and-BRD transformation rules, and the inline-Mermaid-first diagram policy.

The embedded templates in this skill folder are the authoritative source: `TEMPLATE-COMBINED.md` for the single-file layout and `chunks/*.md` for the chunked layout.

---

## Running outside Claude Code

This skill follows the Agent Skills format and also runs in Codex, Kimi Code, and other compatible agents. Where the text names a Claude Code tool or file, use the equivalent below. In Claude Code, follow the text as written.

| Written as | Outside Claude Code |
|---|---|
| `CLAUDE.md` defaults | The project instruction file (`AGENTS.md`, or `CLAUDE.md` if present). If neither states a default, use the defaults this skill states and flag the gap. |
| `Agent` tool with a `subagent_type` | Start a sub-agent with a fresh context if the runtime supports it. Otherwise run the step yourself as a separate pass: re-read the files from disk, set aside your drafting reasoning, and follow the same brief. For a named agent (for example `general-purpose` or a `plugin:agent` name), take on the role its brief describes. |
| `AskUserQuestion` (and `ToolSearch` to load it) | Ask in chat: numbered questions, each with options, tradeoffs, and your recommendation first. Wait for the answer before continuing. |
| Miro MCP | Use only if a Miro tool is available; otherwise follow this skill's rule for when Miro is unavailable. |
| `/grill-me` in the to-do (step 3) | The user starts the step 3 prompt the runtime's way (`$grill-me`, `/skill:grill-me`). If that skill only hands over to another skill and the runtime cannot load a skill by name, open that skill's `SKILL.md` and follow it. With no grill-me skill, drop `/grill-me` and paste the rest of the prompt into a new chat. |
| Invoking this skill | Claude Code: `/<skill-name> <args>`. Codex: `$<skill-name> <args>`. Kimi Code: `/skill:<skill-name> <args>`. |

Paths in this file are relative to the skill folder.

---

## Argument parsing: do this first

The skill is invoked with up to four optional arguments, in any order: `brd-unifier [chunks|combined] [parts|whole] [light] [phase=N]`. Match each argument by its value: `chunks` / `combined` set the **output mode**; `parts` / `whole` set the **generation option**; `light` asks for a **light run**; `phase=N` names the **current phase** of a phase-based BRD. Any of them can be left out.

| Argument received | Meaning | Action |
|---|---|---|
| `chunks` | Produce multi-file chunked output | Skip the mode prompt; proceed with CHUNKS mode. |
| `combined` | Produce a single consolidated `.md` file | Skip the mode prompt; proceed with COMBINED mode. |
| No mode passed | User has not chosen a mode | Run the resume check first (step 1): if the folder already holds a BRD, in progress (a resume) or finished (an update), continue with it in its own mode without asking, unless the request implies another mode (a merge or re-chunk). Otherwise run the **interactive mode prompt** below. |
| Anything else (not `chunks`, `combined`, `parts`, `whole`, `light`, or `phase=N`) | Unrecognised | Tell the user the valid options and ask them to re-invoke, or treat as `(empty)` and prompt. |

### Interactive mode prompt (when no arg passed)

**CHUNKS is the default.** Ask one question, accept Enter / empty / "y" as confirmation of the default. Do not ramble:

> **Output format?** [chunks / combined] - default `chunks` (press Enter to accept).
>
> - **`chunks`** (default): multi-file layout; one `.md` per template section grouping. Matches the embedded `chunks/*.md` skeleton.
> - **`combined`**: single monolithic `.md` file matching `TEMPLATE-COMBINED.md`.

Interpretation rules:

- Empty reply / Enter / `""` / `y` / `yes` / `chunks` / `default` → **CHUNKS mode**.
- `combined` / `c` / `single` / `one file` / `merged` → **COMBINED mode**.
- Anything else → re-prompt once with the same question; if still unclear, default to CHUNKS and note the fallback in the handoff summary.

If the user has already implied a mode in their request ("give me the full doc in one file" → `combined`; "split it into chunks" → `chunks`), do NOT ask: proceed with the implied mode and confirm in one short line in the handoff summary.

Under an answer policy (step 8, Answer policy), do not ask either: the policy takes the default, `chunks`, and the handoff confirms it in one short line.

### Generation option: `parts` (default) or `whole`

| Argument received | Meaning | Action |
|---|---|---|
| `parts`, or nothing | Write the BRD in three parts and stop for the user's review after each | **Default in CHUNKS mode.** Part 1 = chunks 00-05, part 2 = `06*` and 07, part 3 = 08-14. See `parts-mode.md`. |
| `whole` | Write chunks 00-14 in one run | Use when asked for, always in COMBINED mode, and always for pure conversions (merge, re-chunk) and targeted updates. |

- Never ask which one. In CHUNKS mode, with nothing said, use `parts` and say so in one line before starting: "Generation: parts (default). Say 'whole' to get everything in one go."
- Words count as the argument: "all at once", "in one go" mean `whole`; "part by part", "step by step" mean `parts`.
- `combined parts` is not available. Say so in one line and continue in `whole`.
- Chunks 15-17 are outside both options: they stay locked behind the delivery gate. "Whole" means 00-14.

### Light run: `light`

`light` asks for a light run. Words count as the argument: "light run", "light-work". Without it, the run is full. It works with every mode and generation option, and it skips only these:

- **Chunk 17.** It is not written or refreshed. A request for it in a light run gets one line, chunk 17 is skipped in a light run, instead of the gate check. A request made while a light build is unfinished (between its parts) belongs to that light run. A request after the build is a new request and follows step 8c as usual. Its state still follows `delivery-chunks.md` § The delivery gate, Re-lock (a status mark is not a write), and its Downstream outputs row in chunk 14 says it also waits for a run that is not light. The gate rules for chunks 15 and 16 do not change.
- **Consistency reruns.** The consistency check (to-do step 2) runs its first full run, then only the reruns that gate condition G2 needs (`delivery-chunks.md` § The delivery gate and § Step 2).
- **Miro.** No Miro board, even on request. Say in one line that it is skipped in a light run.

The reviewer pass (step 7) and the plain-language pass (step 6b) still run, and the reviewer's brief says these skips are intentional, not coverage gaps (step 7). In `parts`, write `light` on the Generation line of `[project-slug]-brd-master.md` (`**Generation:** parts, light`), so the later parts of the same build stay light. A request after the build is light only when it says so.

### Phase-based BRD: `phase=N`

A BRD is **phase-based** when the request names the current phase: `phase=N` (for example `phase=1`), or words such as "current phase 1" (the words count as the argument, and `P1` in the request means phase 1). A BRD whose Use Case Summary has a `Phase` column stays phase-based on later runs; its current phase is the highest phase in that column. Any other BRD is not phase-based, and nothing in this section applies to it.

- **Naming.** Inside the BRD a phase is written `Phase 1`, `Phase 2`, ..., never a bare `P1`: the to-do already uses `P1` to `P3` for priority (`delivery-chunks.md` § Step 1). The SDD and the LLD write the same phase as `P1`, `P2`, ...: `Phase N` in the BRD is `PN` downstream.
- **Phase numbers.** From a pre-BRD, the roadmap rows of its chunk 21 (keyed by `Quarter - Year`) are numbered 1, 2, ... in row order. From another source, the source or the request names the phases.
- **Scope (chunk 04).** Every scope item carries its phase label, and keeps the roadmap period when the source has one: `Refund self-service (Phase 1, Q1-2027)`. MoSCoW still decides scope, whatever the phase (`sow-transformation.md` § pre-BRD, the 13-14 row).
- **Personas.** A persona that only a later phase serves gets its chunk 05 journey now; only its use cases wait. It gets its use-case chunk (`06*`) when its phase starts, and is listed in chunk 04 with its phase label until then, for example `Loyalty Manager (Phase 2)`. The label is not part of the persona's name (`delivery-chunks.md` check C2).
- **Use cases.** Detailed use cases (`06*`) are written only for the current phase's scope items. A later phase's items stay labelled scope items, with no use cases and no chunk 15 task, until their phase starts. Until then they are not gaps: a check that asks for a use case per scope item, persona, or objective skips what only a later phase serves (`parts-mode.md`, part 1 exit checklist; the matrix red-flag review, step 6a; `delivery-chunks.md` checks C3 and C5; the reviewer, step 7).
- **Use Case Summary (chunk 05).** It gains a last column, `Phase` (`Phase 1`, `Phase 2`, ...), and lists the use cases of the current and earlier phases only: no row for a later phase. Every use case in it still has a detailed block (`parts-mode.md`, part 2 exit checklist). A BRD that is not phase-based keeps the four columns.
- **Starting the next phase** ("start phase 2") is a targeted update (step 10): it writes that phase's use cases, bumps one version, names the phase in its Changes Log row, and marks chunks 15-17 `Stale` (`delivery-chunks.md` § Refresh triggers, a use case is added).

---

## Core principles

1. **Templates are authoritative.** `TEMPLATE-COMBINED.md` and the files under `chunks/` define the section order, naming, and structure. Section headings are never silently renamed.
2. **Business language only: the BRD states the WHAT.** No technology names, protocols, frameworks, or implementation terminology anywhere in the body. NFRs are business expectations ("highly available", "handles seasonal peaks") with business measures; integrations name the business partner and purpose ("Integration with Payment Gateway"), not the mechanism. The HOW (tech stack, architecture, technical targets) is owned by `sdd-unifier`; the constitution-grade Specs section is owned by `lld-unifier`. Technical mandates found in source material are parked **verbatim** in Appendix § Technical Inputs for the SDD so nothing is lost.
3. **User-journey first.** Requirements are expressed as per-persona use cases (UC-NN) with detailed numbered steps, alternate and exception flows, not abstract feature statements. Every persona gets a journey narrative, a use-case chunk, and a column in the Users & Use Cases Matrix. In a phase-based BRD, a persona that only a later phase serves gets its use-case chunk when its phase starts, and is listed in chunk 04 with its phase label until then (§ Phase-based BRD).
4. **Markdown only.** No `.docx`, `.pdf`, `.html` unless the user explicitly asks in a follow-up.
5. **Mode is explicit.** Either it comes from the argument or from the interactive prompt. Never guess silently.
6. **Chunks are semantic, not size-based.** Never split by line count. Split where the reader naturally changes gear.
7. **Diagrams are inline Mermaid by default.** Any time the template asks for a diagram, author it as an inline Mermaid block with a 1-2 sentence prose summary. Miro boards are produced only when the user explicitly asks. See `mermaid-diagrams.md`.
8. **Flag gaps explicitly.** Where source material doesn't cover something the template requires, insert `**[NEEDS CLARIFICATION: <specific question>]**`. Never paper over gaps with plausible-sounding invention. A proposal for missing behaviour uses the same marker, `**[NEEDS CLARIFICATION: proposed <behaviour>; confirm or replace]**`, and is never presented as confirmed. A marker asks one distinct question that can be answered on its own: a gap with two such questions gets two markers, each at the home of its own content. The same holds for a marker a Recommended Answer inserts.
9. **Quality over theatre.** Use-case blocks are substantive (see `use-case-quality.md` for the bar).
10. **Generate or transform: detect, don't ask twice.** See `transform-detection.md`.
11. **One fact, one home (no duplication).** The BRD is the single home for business facts: UC-NN blocks, the Users & Use Cases Matrix, personas, business NFRs, business integrations. Downstream documents (SDD, LLD) reference them by ID and link, so IDs and names must stay stable across revisions (renaming a UC or persona breaks the chain; add a mapping note in the Changes Log if unavoidable). Within the BRD, no content is restated across chunks: cross-reference with a link. Restated content is a review defect (OI Type: Duplication).
12. **Decision history lives in the register, not in the body.** Content chunks state the settled rule in plain present tense ("The credential is revealed once, at generation"), never the decision narrative ("The user selected option A on...", "Q-10 remains partial", "three questions remain"). The decision story (the clarification Q&A, which option was chosen, who decided, when, what was delegated, what was superseded, walkthrough progress, per-decision impact assessments, part-handoff instructions, settled markers, business review records) goes into `decision-log.md`, the companion register in `./brd-[project-slug]/` (structure: the `decision-log.md` reference in this skill folder). Compact traceability references to stable IDs (Q-NN, UC-NN, OI-NN, TD-NN, NFR-NN, or any other ID the BRD defines) inside rule text and table cells are allowed; storytelling is not.
13. **Delivery chunks are derived, evidence-gated, and locked behind the to-do.** Every generation ends with `14-todo.md`, the product-manager checklist (`delivery-chunks.md`); in `parts` generation that is the end of part 3. **Chunks 15, 16, and 17 cannot be generated or refreshed until chunk 14 is cleared:** all five to-do steps `Complete` with evidence and every item `Resolved`. `Deferred` does not count, and there is no override. The order stays 14 -> 15 -> 16 -> 17. Delivery chunks cite the body (00-13) by ID and link and never add a requirement, decision, acceptance criterion, or resolution; a gap found while deriving them becomes a to-do item, not invented content, and shuts the gate again. Generating a checklist is never evidence that a decision or review happened: no step is `Complete` without recorded evidence. Use-case diagrams (chunk 05) and use-case flowcharts (chunks `06*`) are drawn only at to-do step 5, after steps 1-3 are complete, in parallel with the step 4 mockups.
14. **Plain language: simple, clear, precise, easy to understand.** An easy BRD is essential, and simplicity is essential. Short sentences, common words, active voice, one idea per sentence, one term for one thing, the exact number or name instead of a vague word. No complex words where a simple one fits. Simple never means vague or incomplete: every number, rule, exception, and limit stays. This applies to every chunk (00-17), table cell, diagram label, test case, slide, and voiceover. Readability covers the whole reading experience: requirement text never uses process vocabulary (delegation, walkthrough, checkpoint) and reads smoothly for someone who never saw the decision process. Rules, word list, and the mandatory plain-language pass: `writing-style.md`.
15. **Parts by default, with a real stop.** In CHUNKS mode the BRD is written in three parts (00-05, then `06*` and 07, then 08-14). After parts 1 and 2 the skill shows a short summary, says what to review, and **stops until the user says to continue** (an answer policy passes this stop only when it names part checkpoints: step 8, Answer policy). Scope, personas, and the use-case list are agreed before the use cases are detailed. `whole` writes everything in one run. Rules: `parts-mode.md`.
16. **Project files rule the generation when they exist.** Before any generation, transform, refresh, or delivery chunk, look in the project root (the folder that holds the BRD folder or file, normally the working directory) for `AGENTS.md` (or `AGENT.md`) and `ui-ux-global-constitution.md`. Both are optional; never ask for one the project does not have. When present, they govern the whole BRD (chunks 00-17): `AGENTS.md` gives the project's directions and how its features link together, so use it to connect related use cases, journeys, and integrations and to follow its conventions; the constitution is the UI/UX standard for chunk 11, the step 4 mockups, and the look of chunk 17 (color and typography tokens, named, never copied as raw hex; every citation of the constitution, in chunk 11, the step 4 mockups, and chunk 17, names its sections and never their numbers). Without a constitution, chunk 11 uses the brand or key color the user confirms (asked once, in the first batch of the step 8 acceptance loop; a color the run brief gives counts as a source color, and under an answer policy the color is not asked; never an invented value; until the answer comes, chunk 11 holds a clarification marker) and the responsive behaviour the source states or the user confirms, citing no constitution. Business language (principle 2) still applies: technical content from either file goes to Appendix § Technical Inputs, never into the body. If either file conflicts with the source material or another chunk, do not pick one: raise an `OI-NN`. Say in the handoff which of the two files were found and used. The user's global defaults (instructions for every project, kept outside the project folder) are not project files, and nothing in them is a project fact. Use one only where the source and the project files say nothing, and only as a proposal that names it: `[NEEDS CLARIFICATION: proposed (from the user's global defaults, not a project source): ...; confirm or replace]`.

---

## Workflow

### 1. Resolve mode and generation option

Per the Argument parsing section above, including `light` and the current phase when the request gives them. Do not skip this: the mode determines the output format, and the generation option determines whether the run stops for review between parts.

**Resume check.** If the target folder already holds a `[project-slug]-brd-master.md` whose Generation Progress shows a part that is `Pending` or `In progress`, this is a resume. A folder from an earlier version of this skill may hold the index as plain `brd-master.md`: treat it the same, rename it to `[project-slug]-brd-master.md`, and repoint the `MASTER:` footers and links (not a content change). Do not start over. Say which part is next, then act on what the user asked (`parts-mode.md` § Resuming): start that part only when the request says to go on ("continue", "next part", "part 3"); if the request is empty, ask "Continue with part N?" and wait; if the request is something else, do that and name the part that is still waiting.

### 2. Resolve intent: generate vs transform

See `transform-detection.md` for the decision rules. In short:

- **GENERATE**: fresh BRD from a conversation, a topic seed, or raw notes (meeting notes, a chat or email thread).
- **TRANSFORM**: re-shape an existing document (a SoW, Statement of Work, or RFP scope, a pre-BRD from `pre-brd-unifier`, an old-format BRD, a flat scope doc, a single-file BRD that needs chunking, or a chunked BRD that needs combining) into this template.

Both intents end in the same output mode (CHUNKS or COMBINED, per step 1). The difference is in step 6 (TRANSFORM intent).

### 3. Intake (short, not a clarification storm)

Ask at most **three** questions before starting, only those that genuinely block quality:

- **Project / system name**: if neither the request nor the source states it.
- **Source material**: SoW attached? A pre-BRD from `pre-brd-unifier`? Existing BRD to migrate? Conversation context only? From scratch?
- **Personas**: if the source does not make clear who the users are, ask for the user types once; personas drive the use-case chunks and the matrix.

If an answer is already in the conversation, do not re-ask.

Before asking, read the project's `AGENTS.md` / `AGENT.md` and `ui-ux-global-constitution.md` when they exist (principle 16). Do not ask what they already answer.

### 4. Plan internally

Enumerate which sections (combined) or chunks (chunked) will exist (including one use-case chunk per persona, plus `14-todo.md`; chunks 15-17 come later, behind the delivery gate) and which Mermaid diagrams each will carry. The canonical chunk list is in `chunking.md`.

### 5. Diagram policy (inline Mermaid; Miro on demand)

All diagrams (persona journey summaries, summarized workflows, context sketches) are authored as **inline Mermaid** blocks, each followed by a 1-2 sentence prose **Summary** so the content reads without a renderer. Keep BRD diagrams business-language only: swimlanes and steps named after personas and business actions, never components or protocols. Validate each Mermaid block parses; on failure fall back to a text description + a clarification flag.

**Gated diagrams:** the **use-case diagrams** in chunk 05 and the per-use-case **flowcharts** in chunks `06*` are NOT part of first generation. They are added at step 5 of the product-manager checklist (`14-todo.md`), only after steps 1-3 are confirmed complete (see step 8b); they run in parallel with the step 4 mockups. The Summarized Workflow and every other diagram are generated as usual.

**Miro only on explicit request, and never in a light run (§ Light run):** if the user asks for a board, create/reuse `BRD - [Project Name] - Diagrams` via the Miro MCP and append `> Miro: <url>` links below the corresponding Mermaid blocks. The inline Mermaid stays authoritative. See `mermaid-diagrams.md`.

### 6. Generate / transform output

**Parts or whole.** In `parts` (the default in CHUNKS mode), steps 6 to 9 are spread over three parts, each ending as `parts-mode.md` says:

| Part | Writes | Then |
|---|---|---|
| 1 | Chunks 00-05 and `[project-slug]-brd-master.md` with its Generation Progress table | Plain-language pass, exit checklist, part summary, **stop and wait** |
| 2 | Every `06*` chunk, then the matrix (step 6a); back-fill of 00-05 | Plain-language pass, exit checklist, part summary, **stop and wait** |
| 3 | Chunks 08-12; back-fill; plain-language pass and exit checklist; then steps 7, 8, and 8a (chunks 13 and 14) | Final `[project-slug]-brd-master.md` and chunk 00, full handoff (step 9) |

Never start the next part in the same turn, and never without the user's go-ahead, unless the run's answer policy names part checkpoints (step 8, Answer policy). In `whole`, run steps 6 to 9 straight through, as one run.

**CHUNKS mode:**

- Use `chunks/*.md` (embedded in this skill folder) as the section skeleton.
- Write output to `./brd-[project-slug]/` (relative to the working directory) unless the user specifies a different path.
- Each chunk starts with the self-describing comment block (see `chunking.md`).
- Write `[project-slug]-brd-master.md` from `chunks/brd-master.md`, linking this project's real chunk files (one row per `06*` persona chunk). In `parts` it is written in part 1 and updated at the end of every part; in `whole` it is written once the chunks exist and updated after step 8a. Chunks not written yet are plain text: `Pending (part N)`, or `Locked` for 15-17.
- Detailed use cases: one chunk per persona (`06a-use-cases-[persona-slug].md`, `06b-use-cases-[persona-slug].md`, … in the persona order of chunk 05). UC IDs are sequential across the whole BRD.
- The `USE CASE DIAGRAMS SLOT` (chunk 05) and `FLOWCHART SLOT` (each UC) in the skeletons stay empty at this stage: emit nothing for them, and do not copy the slot comments into the generated files. At to-do step 5, take the structure from the skeleton. Exception: a use-case diagram or flowchart that already exists in a transformed source is kept at the slot position, captioned `Pre-existing - re-verify at step 5`.
- `14-todo.md` is written in step 8a. Chunks 15-17 are written only in step 8c, behind the delivery gate.

**COMBINED mode:**

- Use `TEMPLATE-COMBINED.md` (embedded) as the structure.
- Write output to `./BRD-[ProjectName]-v[X.X].md` unless the user specifies a different path.
- Step 8a writes `14-todo.md` as a separate file in `./brd-[project-slug]/`. Step 8c (gated) later appends `# Implementation Plan` and `# UAT/BAT Test Cases` as the last two sections and writes `17-for-ppt.md` next to `14-todo.md`. Chunks 14 and 17 are never inside the combined file. See `delivery-chunks.md` § COMBINED mode adaptations.

**TRANSFORM intent (either mode; a merge or re-chunk is a pure conversion and follows step 10 only):**

- Read the source document fully before writing anything.
- Map content to template sections per `sow-transformation.md`.
- Preserve verbatim numbers, dates, and named commitments.
- Park any technical mandates verbatim in Appendix § Technical Inputs for the SDD, never spread them into the body.
- Flag every gap with `**[NEEDS CLARIFICATION: ...]**`.

### 6a. Build the Users & Use Cases Matrix (mandatory, AFTER the use-case chunks)

The matrix (`07-users-use-cases-matrix.md` / `# Users & Use Cases Matrix` section) is **derived**, not authored independently. Build it from the completed use cases:

1. Columns = every persona from chunk 04, in the same order; an external supporting party is never a column. Rows = every UC ID from chunk 05, in order (rows marked `Merged into UC-NN` or `Removed` are left out).
2. Cell = `Yes` where the persona is the UC's Primary or Supporting Actor; `-` otherwise.
3. Conditional access (own records only, requires approval, limited amounts) gets a numbered footnote, never a bare `Yes`.
4. Cross-check both directions: every persona named as a UC actor has a `Yes`; every `Yes` traces to a UC actor field. An external supporting party needs no `Yes`: it is recorded in the use case and in chunk 08 (Integrations). A mismatch means the UC or the matrix is wrong: fix the source of truth (the UC) first.
5. Red-flag review: a persona column with no `Yes`, or a matrix where everyone can do everything, means the personas or UC actors need another pass. A persona that only a later phase serves is the exception: its column has no `Yes` until its phase starts (§ Phase-based BRD).

### 6b. Plain-language pass (mandatory)

Before the review, reread every chunk against `writing-style.md` § The plain-language pass and rewrite what fails: long sentences, complex words, passive or actor-less sentences, vague words, two names for one thing. Replace a vague word with the fact, or flag it with `[NEEDS CLARIFICATION: ...]`. Never drop a number, rule, exception, or limit while simplifying. Repeat the pass on the delivery chunks at the end of step 8a. In `parts`, run the pass on the chunks written or changed in each part: at the end of parts 1 and 2, and in part 3 after chunks 08-12 and the back-fill, before the review.

### 7. Post-generation review (mandatory, cleared-context)

After the body of the BRD is written but **before** presenting to the user (in `parts`: once, in part 3, after chunks 08-12), run an adversarial review pass that produces the `Open Items & Clarifications` chunk (`13-open-items-and-clarifications.md` / `# Open Items & Clarifications` section in combined mode).

**On an update.** Review the first build and the first substantive migration into the current schema when prior review evidence does not cover its risk areas. Compare the prior coverage record with the current brief and record the gaps; a missing chunk 13 requires a review. An already-covered migration or later content change uses the to-do consistency check. A new full review runs only when the user asks. A pure merge or re-chunk is not a migration review.

**Why cleared context.** The reviewer must be independent. The same context that authored the body anchors on what was written and tends to confirm rather than challenge. The reviewer's job is gap-finding, not validation.

**How to run it.**

1. Use the `Agent` tool with `subagent_type: general-purpose`. The subagent starts with no conversation memory, which is the point.
2. Pass the subagent:
   - Absolute paths to all generated chunks (or the combined file).
   - The path to this BRD's templates so it knows the expected structure.
   - Available project/default source paths used by the author. Cite the file and section behind a borrowed standard. Label harness-global defaults and unavailable sources explicitly; a default that changes requirements is a proposal, not a project fact.
   - The brief: identify gaps, missing scenarios, corner cases, ambiguities, risks, and inconsistencies, including matrix inconsistencies (a persona named as a UC actor without a matrix `Yes`, a persona with no use cases; an external supporting party is never a column) and any technical language that leaked into the body. For each finding, propose 2-3 concrete options with one-line tradeoffs AND a **Recommended Answer** (the concrete resolution text, written so it can be pasted into the BRD as-is: the exact step, rule, row, or wording) AND a **Why** (REQUIRED: the reason that option wins, with the evidence behind it and the tradeoff accepted; never empty). Output goes into the chunk/section using the schema in `chunks/13-open-items-and-clarifications.md`, including the coverage record at the top of Reviewer Notes (item 4).
   - Constraint: the reviewer captures **external** findings only (gaps the body did not flag inline). Inline `[NEEDS CLARIFICATION: ...]` markers stay where they are; they do not move into Open Items.
   - Separate a gap in stated behaviour from an optional scope candidate. Name its source evidence. Record an optional scope proposal in Reviewer Notes with its source, recommendation and tradeoff, not as a blocking Open OI.
   - In a light run, say that the skips of § Light run are intentional, not coverage gaps. In a phase-based BRD, say that a later phase's scope items, and a persona that only a later phase serves, have no use cases yet on purpose (§ Phase-based BRD).
3. The subagent writes directly to `13-open-items-and-clarifications.md` (chunks mode) or appends to the `# Open Items & Clarifications` section (combined mode). When it cannot write files, it returns the text and the main agent inserts it unchanged.
4. Verify the output against its coverage record, the table at the top of Reviewer Notes: one row per major risk area (scope, use-case exception coverage, matrix consistency, NFRs, integrations, security/privacy, data lifecycle), each naming what was checked and its result, either `N findings (OI-NN, ...)` or `No issue found`. A zero-finding review is valid when every area is checked. Every OI must have a non-empty Recommended Answer AND a non-empty Why. Re-dispatch only when an area is unchecked, a finding lacks evidence, or the author holds a finding wrong, and name that area or finding in the new brief. A re-dispatch never changes an item's status. When the author holds, with evidence, that a finding is wrong, it re-dispatches the reviewer on that finding. The reviewer keeps the item, or rewrites it as a full item (Where, Type, Concern, Options, a Recommended Answer that reads `No change: <evidence>`, and Why) with Status `Open`, and the acceptance loop decides it like any other item. Taking that Recommended Answer marks the item `Rejected`.
5. Keep chunk 13 as the review output. An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks. No decision narrative goes into the body chunks.

**Whole-persona or use-case proposals.** A recommendation that adds a persona or use case includes the persona journey, all nine use-case sections, summary and matrix effects, and source references. Every unknown business behaviour stays an explicit question or proposal. An accepted incomplete bundle does not authorize filling the missing behaviour by invention.

**Scope candidates.** A scope candidate is not must-fix gate work unless the owner adopts it; do not apply it without a decision. If the owner adopts it, use the normal OI/decision/application route. After the baseline review, verify accepted corrections and necessary gaps exposed by those corrections within the scoped consistency check, rather than starting another unrelated hunt.

**Editorial ownership.** The main author applies confirmed or unambiguous mechanical Reviewer Notes through the consistency-check correction route. A note requiring a business choice becomes an OI; optional style advice stays a note. Preserve table numbers and append new ones, as for figures. Updated By names the actual editor or runtime; Reviewed/Approved By stays empty until the user names the approver, or an Approver stand-in fills it (step 8, Stand-ins).

**Reviewer prompt skeleton (adapt per project):**

> You are an independent adversarial reviewer for a Business Requirements Document. You have no memory of how this document was authored. Your job is to find what is missing, ambiguous, or risky, not to confirm what is present.
>
> Read these files: [paths]. Use [TEMPLATE-COMBINED.md path] as the structural reference.
>
> For each gap, missing scenario, corner case, ambiguity, risk, or inconsistency you find, write an OI entry following the schema in [chunks/13-open-items-and-clarifications.md path]. Each entry must include: Where, Type, Concern (one paragraph), Options (at least 2 with tradeoffs), **Recommended Answer (the concrete resolution text, ready to paste into the BRD)**, **Why (the reason that option wins over the alternatives: evidence + tradeoff accepted; never empty)**, Status: Open.
>
> Cover at minimum: scope edges, use-case exception flows the body assumes away, Users & Use Cases Matrix consistency (every persona named as a UC actor has a Yes; every persona has use cases; external supporting parties are never columns), NFR gaps, integration failure scenarios from the user's point of view, multi-tenancy implications if relevant, data lifecycle and retention, regulatory or compliance hooks not addressed, conflicts between sections, any technical/implementation language that leaked into the business text, duplication (the same fact stated in two chunks, or source content restated where a cross-reference belongs: one fact, one home; a pre-BRD verdict word named next to its link is a citation, not a duplicate), and plain language ([writing-style.md path]): wording so vague or complex that it hides a requirement is an OI of Type Ambiguity; purely editorial cases (long sentences, complex words) go under Reviewer Notes with the chunk and the simpler wording.
>
> Fill the coverage record at the top of Reviewer Notes: one row per major risk area (scope, use-case exception coverage, matrix consistency, NFRs, integrations, security/privacy, data lifecycle), naming what you checked and the result, either the findings (count and OI IDs) or `No issue found`. An area with no issue is a valid result; never raise a weak finding to fill a row.
>
> [Light run only:] This is a light run: it skips chunk 17, Miro boards, and extra consistency reruns on purpose. They are not coverage gaps. [Phase-based BRD only:] The current phase is Phase [N]. Scope items of later phases, and personas that only a later phase serves (listed in chunk 04 with their phase label), have no use cases yet on purpose; do not raise them as gaps.
>
> Cite the available source file/section for each standard. Disclose global defaults. Separate stated-requirement gaps from optional scope proposals. Whole-persona/UC answers include the journey, nine sections, summary and matrix effects; mark every unsettled behaviour for its owner. Optional scope stays in Reviewer Notes until adopted, not a blocking Open OI.
>
> Do not echo what the document says. Do not confirm what is present; find what is missing. Write directly to [output path].

### 8. Open Items review & acceptance loop (mandatory)

The Open Items are not left for the user to discover. Walk them through each item and get a decision. Each item means every item still `Open` in chunk 13 when the loop runs: the ones this request raised and the ones an earlier request's loop left `Open` (a "later", item 5, or a question an answer policy left for the user), and any item whose status is outside the chunk 13 Status legend, which counts as `Open`. `Deferred`, `Decided - pending application`, and closed items are not asked again.

1. Present the OI list compactly (ID, title, one-line concern, the Recommended Answer and its Why).
2. Ask the user to decide per item, batched via **AskUserQuestion** (load via ToolSearch if deferred; up to 4 items per call); the recommended option's description carries its Why so the user decides with the reason in view. With no UI/UX constitution and no brand or key color in the source, the first batch also asks for that color, once (principle 16). With no answer, the chunk 11 marker stays. Under an answer policy the color is not asked: a color the run brief gives counts as a source color, and otherwise the chunk 11 marker and its to-do row stay and the handoff names the color question once (§ Answer policy, rule 3). Options per item: **Accept recommendation** (recommended, listed first) / **Choose option [B/C]** / **Defer** / user types their own answer via "Other" (a rejection is typed through Other). Under an answer policy, the policy answers in place of the user (§ Answer policy, below).
3. For every **accepted** (or user-adjusted) item: A decision on a third-run discovery (`delivery-chunks.md` § Step 2) is recorded as pending application; its TD row and any OI it answers take Status `Decided - pending application` (`delivery-chunks.md` § Step 1) until the next request applies and rechecks it. Do not mark it applied merely because the owner answered. Skip all application, reconciliation and Applied-status actions below for those pending discoveries; resume them in the next request. For other accepted items, perform the following actions:
   - Apply accepted answers once every item in the loop is decided, or the user has left the undecided ones for later (item 5); under an answer policy, once it has answered what it can (§ Answer policy, rule 4). First compare each one with the items rejected, deferred, or still `Open`. A difference in a number or a link only (a footnote, table, or figure number, a cross-reference) is carried: the item stays `Accepted - applied`, and its decision record names the change. If the answer needs content that one of those items would have added, do not apply it: ask the user again, with an adjusted answer as the recommended option (`Adjusted - applied` once accepted), or defer it. When unsure, ask.
   - Apply the Recommended Answer (or the adjusted text) to the referenced chunk(s)/section(s): it was written to be paste-ready. Apply it as plain requirement text in present tense: the chunk never keeps a "resolved on <date>" stamp, an option letter, or a progress note, and any inline clarification marker the decision clears is removed.
   - Record the decision in `decision-log.md` (create the register on first use; structure: the `decision-log.md` reference in this skill folder): the question, its options, the chosen answer, who decided, the date, and the rationale (the Why), under the clarification register, with a `Rule home:` link to the chunk section now carrying the settled rule. A decision that replaces an earlier one keeps both records, the newer one marked as superseding.
   - If the change touches actors or permissions, re-verify the Users & Use Cases Matrix (step 6a rules).
   - Set the OI's Status to `Accepted - applied` (or `Adjusted - applied`), add a Resolution Log row, and add it to this update's Changes Log row (one bump per update: `delivery-chunks.md` § Refresh triggers, Version). An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
4. **Deferred / Rejected** items keep their entry with the new status and rationale, and get a Resolution Log row (their pointer for to-do step 1); they are not applied.
5. If the user says "later" / "I'll review offline", leave every item that has no decision yet `Open` and note in the handoff that the acceptance loop is pending; the next request that runs this loop presents those items again. A decision already given in the loop, the user's or an answer policy's (§ Answer policy, rule 4), stands and is applied. Do not apply anything without an explicit decision (an answer policy's answer is one).

**Answer policy.** The user can set an answer policy for a run: a standing instruction in the request or in a run brief, for example "answer policy: accept the recommended option". It may also name stand-ins (below) and the stops it may pass. It may cover less than the rules below allow, for example "accept the recommended option except on security items": a question its wording leaves out waits for the user, and its item stays `Open` (rule 4). With no answer policy, every rule in this skill stays as written. With one:

1. It answers a question only when the question carries a recommended option or a stated default, by taking that option. In this loop it takes each item's Recommended Answer (**Accept recommendation**); at the interactive mode prompt, `chunks`.
2. It never chooses Defer, another option, a rejection, or a free-text answer: only the user does. One exception: it takes a Recommended Answer that reads `No change: <evidence>` (a finding the reviewer kept after the author showed it wrong), which changes no document. The item becomes `Rejected` with the policy as decider, and the handoff lists it. The agent's own preference for another answer never holds an item back.
3. It never supplies a fact only a person or a provider can give: an intake fact (step 3), a figure, a provider document, a legal basis, a business number, a brand or key color (principle 16). Those stay questions or clarification markers, as this skill already handles them, and an item whose Recommended Answer would supply one stays `Open`. A target the business sets (a time limit, an NFR measure, a milestone) that a Recommended Answer proposes with its Why is a choice, not such a fact (`delivery-chunks.md` § Step 2, Dispositions), so the policy may take it; a figure that already exists somewhere (a volume, a contract term, a provider's limit) is a fact. The test: when the documents' evidence can build the options, each with its tradeoff, the question is a choice; a value that no offered option sets, or one that a named source not attached to the run would settle, is a fact. For example, a daily reminder once a refund request passes its 2-day approval target, recommended over a weekly digest, is a choice; whether goods must be returned before a refund, when the store's returns policy decides it and that policy is not attached, is a fact. Nor does the policy take a Recommended Answer that makes a decision the user's standing instructions for the project reserve for the user (for example adopting a new dependency; proposing one, as a `Proposed` decision with its alternative, is not reserved), or that sets a business rule a source document rules out: that item stays `Open`.
4. Items it leaves `Open` do not hold back the items it decided: item 3 applies those in the same run.
5. Each answer is recorded where this skill records that decision today (for an open item, item 3 above), with the decider written `Policy: <policy> (set by <name>, <date>)`. The policy itself is recorded once, as a delegation, in `decision-log.md` § Walkthrough and delegation history.
6. It passes a stop for the user's review only when it names that stop. "Continue at part checkpoints" passes the part checkpoints of `parts-mode.md`, and the resume question that repeats one.

**Stand-ins.** An answer policy can name stand-ins: agents that do a person's task in this skill.

| Stand-in | Task in this skill |
|---|---|
| `Product Owner` | Answers the grill-me session; confirms to-do steps 3 and 4; approves mockup rows |
| `Mockup` | Produces the step 4 mockups and runs the play-through |
| `Approver` | Fills Reviewed/Approved By in the Changes Log, only under the sign-off conditions of `delivery-chunks.md` § Refresh triggers, Cover status |

- A stand-in's output counts as evidence only when the run's answer policy names that stand-in. It is recorded as `Stand-in: <role> (<policy>, set by <name>, <date>)`, never with a person's name in its place. There `<date>` is the date the policy was set; the record adds the date the stand-in acted. The record goes where the person's would go: the step 3 and 4 Evidence cells, a mockup row's Status and Play-through cells, the Reviewed/Approved By cell, and the who-decided field of `decision-log.md`.
- A stand-in never approves its own work: mockups the Mockup stand-in produced are approved by the Product Owner stand-in or the user.
- The skill still never claims that a person did something: the record names the stand-in.
- Rules 1-3 of the answer policy bind a stand-in: it answers grill-me questions by taking the BRD's recommended options and proposals (an item's Recommended Answer, a `proposed` marker's proposal); anything else stays open for the user.
- With no policy naming a stand-in, the person rules stay as written: steps 3 and 4 need the product manager's confirmation, and the approval cells wait for the approver the user names.

### 8a. Generate the to-do, `14-todo.md` (mandatory, every full generation, both modes; in `parts` it closes part 3)

Read `delivery-chunks.md` and `chunks/14-todo.md` first. Chunk 14 is the only delivery chunk written on a normal run.

1. **Open items register.** Consolidate every unresolved question, assumption needing validation, and pending decision (`TD-NN`, each linked to its source chunk and identifier, stating the decision needed, sorted by priority).
2. **Consistency check, next run** (Run 1 on a new checklist; otherwise next free number) (checks C1-C10; C9 runs only after to-do step 5). Record every finding as `CF-NN` with its disposition; apply only confirmed corrections, raise business ambiguities as `OI-NN` + `TD-NN`, recheck (scoped reruns, at most three runs per session: `delivery-chunks.md` § Step 2).
3. **Steps 3-5.** The grill-me inputs and the ready-to-use handoff prompt (recommended, never claimed as executed); the Figma mockup coverage, review criteria and the ready-to-use mockup brief (which points the generating tool to the global UI/UX constitution); the step 5 tracking tables (`Pending gate`, or `Skipped` for planned skips).
4. **Delivery gate block.** Fill conditions G1-G5 with `Met` / `Not met` and what is still open, state the gate (`Shut` on a normal first run), and name the next action. Set the three Downstream outputs rows to `Locked`. In CHUNKS mode, update `[project-slug]-brd-master.md` (chunk 14 linked, chunks 15-17 listed as `Locked`) and add chunk 14 to the Table of Contents in chunk 00. In COMBINED mode, the combined file's Table of Contents links it as `./brd-[project-slug]/14-todo.md`.
5. Run the plain-language pass (`writing-style.md`) on chunk 14, then the "Whenever chunk 14 is written or updated" block of `delivery-chunks.md` § Verification before presenting.

**Do not write `15-implementation.md`, `16-uat-bat-test-cases.md`, or `17-for-ppt.md` here**, and do not write drafts, previews, or outlines of them. They belong to step 8c and are locked until chunk 14 is cleared.

Skip step 8a only when the user explicitly asks for the BRD alone, and report the skip in the handoff.

### 8b. Gated diagram step (to-do step 5, on a later invocation)

Triggered when the user asks to run step 5, add the use-case diagrams, or add the flowcharts.

1. If `14-todo.md` does not exist yet (part 3 of a `parts` generation is still pending, or the user skipped the to-do), the gate is shut: say that the to-do is written at the end of part 3 (or offer to write it now if it was skipped) and stop. Otherwise read `14-todo.md` and verify gate conditions G1-G3 **against the files** (`delivery-chunks.md` § The delivery gate): no `Open`, `Deferred`, or `Decided - pending application` item, no clarification marker left, a check run following the final relevant BRD change with ordered/current-revision evidence with every finding dispositioned, the grill-me session confirmed by the product manager, or by a Product Owner stand-in the run's answer policy names (step 8, Stand-ins). If anything is missing, list it and **stop**. That confirmation is valid evidence for step 3 only (record it with the date). No override. The mockups of step 4 are not a precondition.
2. Add the use-case diagram(s) to chunk 05 and a flowchart to every qualifying use case in chunks `06*` (3 or more Main Flow steps and at least one decision point; linear or shorter use cases are skipped with a recorded reason). Notation: `mermaid-diagrams.md`. Rules: `delivery-chunks.md` § The gated diagram step.
3. Do not invent behaviour to close a gap: record a `TD-NN`, mark the diagram `Provisional` in the tracking table, finalise it after the answer.
4. Validate every Mermaid block, add Summary lines and Figures index rows (next free figure numbers), then apply the semantic version rule in `delivery-chunks.md` § Refresh triggers, Version. Editorial layout/splits preserving all behaviour bump nothing; changed rules, actors or paths are content changes. Rerun the consistency check including C9, and update `14-todo.md` last. Mark existing delivery chunks Stale only when their source meaning changed.

### 8c. Gated delivery chunks: `15-implementation.md` -> `16-uat-bat-test-cases.md` -> `17-for-ppt.md`

**Guardrail. These three chunks cannot be generated or refreshed until chunk 14 is cleared: all five to-do steps `Complete` with evidence and every to-do item `Resolved`. `Deferred` does not count as closed. There is no override, even when the user asks for the chunks directly.**

Triggered when the user asks for the implementation plan, the test cases, the presentation or video brief, or a refresh of any of them; also checked whenever `14-todo.md` is written or updated. In a light run, a request for chunk 17 alone gets the one line of § Light run instead.

1. **Verify the gate against the files, never from the status cells alone:** conditions G1-G5 in `delivery-chunks.md` § The delivery gate. If `14-todo.md` does not exist yet, the gate is shut (see step 8b.1 for what to say).
2. **Gate shut:** write none of the three: no draft, preview, or outline, in a file or in the chat. A user's "I take responsibility" is not evidence for any step. Update the Delivery gate block, and set the state of each of 15-17 (`Locked` if it does not exist; an existing one keeps its state unless Re-lock makes it `Stale`, so a chunk whose own new item shut the gate stays `Provisional (TD-NN)`) in the three places of `delivery-chunks.md` § The delivery gate, Re-lock. Tell the user exactly what is still open (steps, `TD-NN`, `OI-NN`, `CF-NN`, clarification markers, mockup rows) and the next action. If the user insists, explain the rule and repeat the list.
3. **Gate open:** read the skeletons, then write **15**. Check the gate again, then write **16** (follow the skeleton exactly; it encodes the owner's reference format). Check the gate again, then write **17** (every storyboard sums to exactly 30 seconds); a light run stops after 16 (§ Light run). In COMBINED mode 15 and 16 are appended to the combined file as its last two sections.
4. **A gap found while writing** (a missing prerequisite, a circular dependency, an expected result the BRD does not state) becomes a `TD-NN`. Only the affected content is labelled: `Provisional (TD-NN)`, or `Blocked` for a task that cannot be delivered without the answer (`delivery-chunks.md` § Chunk 15). The chunk in hand is finished and **the next chunk is not started**. Report what must be decided.
5. Run the plain-language pass on what was written, then both blocks of `delivery-chunks.md` § Verification before presenting. Update `14-todo.md` last (links, `Blocks`, Downstream outputs), and set the state of each chunk written in the three places of `delivery-chunks.md` § The delivery gate, Re-lock.

### 9. Present

In `parts`, parts 1 and 2 end with the short part summary of `parts-mode.md` § The checkpoint, not with this handoff. This full handoff closes part 3, or a `whole` run.

After the body, the Open Items chunk, the acceptance loop, and the to-do, surface the output to the user with:

- Generation option used (`parts` or `whole`), and for `parts` the date each part was completed; `light` when set, with what it skipped (§ Light run).

- Project name, version, mode (chunks / combined), file paths.
- Number of chunks (if chunks mode) or section count (if combined), including the persona count and use-case count.
- Count of inline Mermaid diagrams generated (and the Miro board URL, only if one was requested).
- Count of inline `[NEEDS CLARIFICATION: ...]` markers by question (a marker repeated for one question, on a flow and on its acceptance criterion for example, counts once; the same marker words used for two different things, two flows or two rules, count as two questions), as two numbers: gaps (the explicit body-level gap inventory; for a transform, judged against the thresholds in `sow-transformation.md` § Gap inventory) and proposals to confirm (`[NEEDS CLARIFICATION: proposed ...]`).
- Plain-language pass: confirm it ran on the body and on every delivery chunk written; name any chunk that still reads heavy and why (for example, verbatim source wording that had to stay).
- Open Items summary: total, accepted & applied, adjusted, deferred, rejected (naming each item an answer policy rejected by taking a `No change: <evidence>` answer), decided and pending application, still open.
- Scope proposals: name each one recorded in Reviewer Notes, for the owner's choice.
- Matrix status: personas × use cases covered, plus any footnoted conditional cells.
- Chain handoff check: UC IDs, persona names, and integration partner names (the row names in chunk 08) are stable and internally consistent, so downstream `sdd-unifier` can cite each one with a link to its source chunk; `INT-NN` IDs are owned by the SDD, not the BRD. No content restated across chunks.
- To-do summary: the five steps with their status (none reported `Complete` without evidence); open `TD-NN` by priority; consistency findings by disposition, including the mechanical corrections that were applied; open items raised after the acceptance loop and not yet reviewed.
- **Delivery gate: `Shut` or `Open`.** When shut, say plainly that `15-implementation.md`, `16-uat-bat-test-cases.md`, and `17-for-ppt.md` were not generated, list the conditions (G1-G5) that are not met with what is open behind each, and state that `Deferred` items count as open and that there is no override.
- When 15-17 were written in this run: task count, waves, and dependency problems; test-case total with provisional scenarios and coverage gaps (including any task without a required case); slide count and video count (every storyboard verified at 30 seconds); any new `TD-NN` raised while writing them.
- The recommended next action for the product manager: the first incomplete to-do step (normally: decide the P1 open items, then run `/grill-me` with the prepared prompt). State plainly that the use-case diagrams and flowcharts wait for to-do steps 1-3, and the mockups wait for the same steps; the two run in parallel.
- One-line offer: "Want me to switch to the other mode?" / "Want me to merge the chunks?" / "Want me to re-chunk this combined file?"

### 10. Cross-mode conversion (on explicit request)

| User says | Action |
|---|---|
| "merge", "consolidate", "single file", "full doc" (after chunks exist) | Concatenate chunks per `chunking.md` § Merge handling. Write to `./brd-[project-slug]/BRD-[ProjectName]-v[X.X]-MERGED.md` (the same folder as the chunks, so relative links keep working). Keep originals. **Never merge `14-todo.md`, `17-for-ppt.md`, or `decision-log.md`**; 15 and 16 are merged after 13 once they exist. |
| "split into chunks", "re-chunk this", "chunk this BRD" (when a combined file exists) | Read the combined file and split it per `chunking.md` § Re-chunk handling (the heading map, chunk headers and footers, and `[project-slug]-brd-master.md`). Keep the original combined file. |
| "regenerate chunk N", "update section X" | Targeted regeneration of one chunk or section, leaving the rest untouched. If use cases change, re-derive the matrix (step 6a). A content change then reruns the consistency check (step 7, On an update), refreshes `14-todo.md`, and marks chunks 15-17 `Stale` if they exist and their source meaning changed (`delivery-chunks.md` § Refresh triggers and § The delivery gate, Re-lock). |
| "start phase 2" (a phase-based BRD) | Write that phase's use cases as § Phase-based BRD says, then follow the "regenerate chunk N" row above. |
| "update the todo", or decisions handed back from a grill-me session or a business review (`business-reviewer-unifier` hand-off) | For a business review hand-off, first check whether an earlier update took this review: a record this skill wrote after the review that records its hand-off (a Changes Log row below the review's row, a chunk 14 consistency run whose Trigger names this review, or an action entry in `decision-log.md` saying the hand-off was taken), never the review's own entries in this BRD's registers (its Changes Log row, its Business review register entries). If one did and the review has no row after it, the hand-off is already taken: say so with that version, apply any `Decided - pending application` items, and change nothing else; a new consistency run for the review runs only when the user asks for one. If the review has rows after it, what follows covers those rows only. Otherwise, apply any `Decided - pending application` items first (`delivery-chunks.md` § Step 1), then the confirmed decisions, through the step 8 mechanics, rerun the consistency check (a full run, then scoped reruns, at most three runs per session: `delivery-chunks.md` § Step 2; the run's Trigger names the review by its date and tracker path), and refresh `14-todo.md` (statuses, evidence, Delivery gate block). Every ID stays stable. Decisions a business review already applied are checked, not applied again, and the open items they answer are closed through the step 8 mechanics, with no new Changes Log entry: the review's row already holds the change, and this request bumps the version only if it changes chunks 00-13 itself (`delivery-chunks.md` § Refresh triggers, Version). Their record is the review's Business review register entry, so no Clarification register record is added. Each closed item's Resolution Log row has the Outcome "Settled by business review [point ID]", and each clarification marker a review decision removed gets a Marker register entry naming the point (`decision-log.md`). When the hand-off names pre-BRD chunks the review changed, recheck the BRD text taken from them (`sow-transformation.md` § pre-BRD (pre-brd-unifier output) to BRD): a changed persona, scope item, priority, or verdict word changes the BRD chunk that holds it; a linked figure needs no edit. When the review's decision records (the Business review register of `decision-log.md`, or the tracker's Decision cell for a point on the pre-BRD) state an open remainder, this request raises a `TD-NN` for each distinct question in the remainder, with its owner and source pointer, and also an open item when the remainder is a business choice (a missing fact stays TD-only), as for any item raised after the acceptance loop (`delivery-chunks.md` § Step 1 and § Special cases): the review applied the point, and the owner raises the question. A change to chunks 00-13, by the review or by this request, marks chunks 15-17 `Stale` if they exist and their source meaning changed (`delivery-chunks.md` § Refresh triggers and § The delivery gate, Re-lock); a use-case change also re-derives the matrix (step 6a), and a changed diagrammed use case reopens to-do step 5. |
| "apply the pending decisions", "apply the decisions waiting for application" | Apply every `Decided - pending application` item first and recheck it (`delivery-chunks.md` § Step 1, Decided - pending application). The request's normal decisions still run: the acceptance loop (step 8) for every item still `Open`, the ones this request raises included, under an answer policy too. Then rerun the consistency check (`delivery-chunks.md` § Step 2) and refresh `14-todo.md`. A change to chunks 00-13 is one version bump and marks chunks 15-17 `Stale` if they exist and their source meaning changed (`delivery-chunks.md` § Refresh triggers and § The delivery gate, Re-lock). |
| "generate / refresh the implementation plan", "the test cases", "the ppt or video brief", "the delivery chunks" | Step 8c (gated): verify G1-G5 first. Gate shut means nothing is written and the user gets the list of what is open. |
| "run step 5", "add the use-case diagrams", "add the flowcharts" | Step 8b (gated). |
| "TASK-NN is ready for test", test results handed back, "is TASK-NN done?" | Record delivery progress. It is tracking, not a refresh, so it needs no gate check. Set `Ready for test` only on the delivery team's confirmation, fill Testing Result and Testing Comment from the testers, and set `Accepted` only when every required case of the task passes (`delivery-chunks.md` § Chunk 15). |
| "sign off the BRD", "approve version X.X" | Sign-off only: change no content and apply nothing pending. Verify the sign-off conditions of `delivery-chunks.md` § Refresh triggers, Cover status against the files. When the user names the approver, that person signs: fill Reviewed/Approved By of the latest Changes Log row with the name and set the cover to `Approved`, whether or not the conditions hold. An Approver stand-in, under an answer policy that names it, fills the cell with its label and sets the cover to `Approved` only when the conditions hold; otherwise it fills nothing and the version stays unsigned. Report in three lines: the BRD (project name and path) and the version; signed, with who signed, or unsigned; each unmet condition with what is open behind it, or `None`. It bumps nothing. |
| "continue", "next part", "part 2", "part 3" (a part is `Pending` in `[project-slug]-brd-master.md`) | Resume with the next pending part, in order (`parts-mode.md`). Read every chunk already written first. |
| "redo part N" | Follow `parts-mode.md` § Resuming (redo a completed part). Decisions taken since are kept, not lost. |
| "just finish it", "do the rest in one go" | Switch to `whole` for the remaining parts; no more checkpoints. |

---

## Reference files (read these when the situation calls for them)

- `TEMPLATE-COMBINED.md`: the single-file template. Read at the start of any COMBINED-mode generation.
- `chunks/*.md`: the per-chunk template skeletons. Read at the start of any CHUNKS-mode generation.
- `chunking.md`: canonical chunk map, naming convention, heading map, merge and re-chunk rules.
- `modes.md`: chunks vs combined behavioural details.
- `parts-mode.md`: the generation option. The three parts, what each settles and what the user reviews, the checkpoint (stop and wait), the exit checklists, the back-fill of earlier parts, the progress record in `[project-slug]-brd-master.md`, and resuming. Read at the start of every CHUNKS-mode generation.
- `decision-log.md`: the companion decision register. What belongs there (clarification Q&A, choices, dates, rationales, superseded history, walkthrough and delegation notes, per-decision assessments, part-handoff records, settled markers, business review records), its canonical structure, the companion-file rules (created on first use, linked from `[project-slug]-brd-master.md` and chunk 00's Table of Contents, never merged), and the rule that content chunks carry only the settled outcome. Read whenever a clarification is raised, decided, or applied.
- `transform-detection.md`: rules for deciding generate vs transform.
- `sow-transformation.md`: how to map SoW or existing-BRD content into this template.
- `mermaid-diagrams.md`: inline Mermaid conventions for every diagram the template implies (including the gated use-case diagram and flowchart notation), plus the Miro-on-demand flow.
- `use-case-quality.md`: what makes a substantive use case vs a thin one, the flowchart quality bar, and the matrix consistency rules.
- `writing-style.md`: the plain-language style for everything the skill writes: the rules, the word list, before/after examples, and the mandatory plain-language pass. Read before writing any chunk.
- `delivery-chunks.md`: the rulebook for chunks 14-17: the delivery gate (G1-G5) that locks 15-17, the to-do steps and their evidence rule, the consistency check, task derivation, dependency ordering, and the two task milestones (`Ready for test`, `Accepted`), the UAT/BAT format, per-case readiness, and coverage rules, the presentation and video rules, the gated diagram step, refresh and re-lock rules, special cases (COMBINED mode, legacy BRDs), and the verification list. Read at steps 8a, 8b, and 8c, and on any refresh.
- `chunks/14-todo.md`, `chunks/15-implementation.md`, `chunks/16-uat-bat-test-cases.md`, `chunks/17-for-ppt.md`: the delivery chunk skeletons (used in both modes).

---

## Output conventions

- **Project slug**: kebab-case, lowercased, derived from the project name (e.g., "Wallet Management Service" → `wallet-management-service`).
- **Chunked output folder**: `./brd-[project-slug]/`.
- **Chunked filenames**: `NN-short-title.md` (two-digit prefix, optional letter for splits like `06a`, `06b`). See `chunking.md`.
- **Combined output filename**: `BRD-[ProjectName]-v[X.X].md` (PascalCase project name, no spaces).
- **Merged-from-chunks filename**: `BRD-[ProjectName]-v[X.X]-MERGED.md`, written inside `./brd-[project-slug]/`.
- **Delivery chunks**: `14-todo.md` (every generation; in `parts`, at the end of part 3), then `15-implementation.md`, `16-uat-bat-test-cases.md`, `17-for-ppt.md` (only once the delivery gate is open), in `./brd-[project-slug]/`. In COMBINED mode 15 and 16 are sections of the combined file; 14 and 17 are still files in `./brd-[project-slug]/`. 14 and 17 are never merged.
- **Decision register**: `decision-log.md`, the companion decision register, in `./brd-[project-slug]/` next to `[project-slug]-brd-master.md` (in COMBINED mode, next to `14-todo.md`). Created on first use (its first record: a decision, or a business review point), linked from `[project-slug]-brd-master.md` and chunk 00's Table of Contents (in COMBINED mode, from the combined file's Table of Contents as `./brd-[project-slug]/decision-log.md`), never merged into merged or combined output. Structure and rules: the `decision-log.md` reference in this skill folder.
- **Versions**: one update, one version (`delivery-chunks.md` § Refresh triggers, Version).
- **Delivery identifiers**: `TD-NN`, `CF-NN`, `MK-NN`, `TASK-NN`, `DP-NN`, `TC-[AREA]-NN`, `SL-NN`, `V-NN` / `V-NN-Cn`. The one list with meanings is in `delivery-chunks.md` § Ground rules. Stable across refreshes; never renumbered.
- **Encoding**: UTF-8, LF line endings.
- **Tables**: pipe-table format, no hard line wrap.

---

## Things this skill never does

- Never emits `.docx`, `.pdf`, `.xlsx`, or any non-Markdown output unless the user explicitly asks.
- Never puts technical stack, technical terminology, protocols, or implementation detail in the BRD body. Source-stated technical mandates go verbatim into Appendix § Technical Inputs for the SDD; everything else technical is left to `sdd-unifier`. The Specs section (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier`, not this skill.
- Never creates a Miro board unless the user explicitly asks. Inline Mermaid is the authoritative diagram medium; Miro links are additive. BRD Mermaid diagrams stay business-language (personas and actions, never components or protocols).
- Never invents NFR measures, counts, or business targets to fill a table. Missing measure → `[NEEDS CLARIFICATION: ...]`. A target an accepted Recommended Answer sets (the user's decision or an answer policy's, step 8) is decided, not invented.
- Never writes a matrix cell that contradicts a use case's actor fields: the UC is the source of truth; fix it first.
- Never applies an Open Item to the body without the user's explicit acceptance in the review loop, or the acceptance of an answer policy the user set for the run (step 8, Answer policy).
- Never produces a "here's a summary, let me know if you want the full version" preview. Generate the actual deliverable.
- Never silently drops template sections. Empty sections keep their heading and write `Not applicable for this release.` (with a clarification flag if surprising). Exception: the `# Implementation Plan` and `# UAT/BAT Test Cases` sections of a combined BRD are left out entirely (no heading, no stub) while the delivery gate is shut.
- Never modifies the embedded templates (`TEMPLATE-COMBINED.md` or `chunks/*.md`) during a generation run: they are read-only references.
- Never starts the next part in `parts` without the user's go-ahead (or an answer policy that names part checkpoints), never skips a part or changes their order, and never rewrites a completed part on a resume (only the back-fill touches it).
- Never writes a complex word, a long sentence, or a vague phrase where a simple, precise one fits (`writing-style.md`), and never drops a number, rule, or exception to make the text simpler.
- Never marks a to-do step `Complete` without recorded evidence, and never treats having generated a checklist, plan, test suite, or brief as evidence that a decision or review happened. Never claims the grill-me session, a mockup review or a prototype play-through took place unless the user confirms it, or a stand-in the run's answer policy names records it under its own label (step 8, Stand-ins).
- Never sets the cover Status to `Approved`, or fills Reviewed/Approved By in the Changes Log, unless the user names the approver, or the run's answer policy names an Approver stand-in and its sign-off conditions hold (step 8, Stand-ins).
- Never draws use-case diagrams (chunk 05) or use-case flowcharts (chunks `06*`) before to-do steps 1-3 are confirmed complete, and never puts those diagrams in `14-todo.md`: the to-do tracks them, chunks 05 and `06*` hold them.
- Never generates or refreshes `15-implementation.md`, `16-uat-bat-test-cases.md`, or `17-for-ppt.md`, not even as a draft, preview, or outline, in a file or in the chat, while any to-do step is not `Complete` with evidence or any item is not `Resolved`. `Deferred` counts as open. There is no override: when asked anyway, list what is still open instead.
- Never opens the delivery gate on status words alone: conditions G1-G5 are verified against the files, and the product manager's confirmation, or a named stand-in's (step 8, Stand-ins), covers to-do steps 3 and 4 only.
- Never invents requirements, decisions, acceptance criteria, expected test results, dependencies, or flow behaviour in a delivery chunk or a diagram. Gaps become to-do items, the affected content is labelled `Provisional (TD-NN)`, and the next chunk waits.
- Never presents a circular dependency, a missing prerequisite, or a blocked task as part of a valid implementation sequence.
- Never marks a task `Ready for test` without the delivery team's confirmation, keeps it there after a refresh changes its Expected deliverables, or marks it `Accepted` (complete) before every one of its required cases passes. Never makes a test case wait for the rest of its section or for a whole wave: each case runs once the tasks and prerequisites in its `Needs` cell are ready.
- Never resolves a business ambiguity found by the consistency check silently; only confirmed or purely mechanical corrections are applied, and each is logged.
- Never merges `14-todo.md` or `17-for-ppt.md` into the merged or combined BRD.
- Never merges `decision-log.md` into the merged or combined BRD, and never leaves decision-process narration ("resolved on <date>", option letters, delegation or progress notes) in the content chunks: the chunks state the settled rule, the register tells the story.
- Never renumbers delivery identifiers (`TD`, `CF`, `MK`, `TASK`, `DP`, `TC`, `SL`, `V`) on a refresh.
