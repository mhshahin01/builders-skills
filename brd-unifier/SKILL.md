---
name: brd-unifier
description: >-
  Generate, transform, or reformat a Business Requirements Document (BRD or BRD-HLD) into the user's
  standard template. Use when asked to create, draft, write, or build a BRD, BRD-HLD, or High-Level
  Design, or to convert a Scope of Work, Statement of Work, project brief, product spec, RFP scope,
  or old BRD into this template. Also use to update a BRD's to-do (14-todo.md), add use-case
  diagrams and flowcharts, or generate the implementation plan, UAT/BAT test cases, or presentation
  brief. Arguments: [chunks|combined] [parts|whole]. The BRD is business language only (the WHAT);
  the technical HOW belongs to sdd-unifier. Output is Markdown only.
---

# BRD Unifier

Author, transform, and unify Business Requirements Documents (BRDs / BRD-HLDs) into the user's standardised template. This skill encapsulates the section structure, the per-persona use-case convention (`Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules / Acceptance Criteria / Future Enhancements / UI/UX`), the Users & Use Cases Matrix, the chunking model, the SoW-and-BRD transformation rules, and the inline-Mermaid-first diagram policy.

The embedded templates in this skill folder are the authoritative source — `TEMPLATE-COMBINED.md` for the single-file layout and `chunks/*.md` for the chunked layout.

---

## Running outside Claude Code

This skill follows the Agent Skills format and also runs in Codex, Kimi Code, and other compatible agents. Where the text names a Claude Code tool or file, use the equivalent below. In Claude Code, follow the text as written.

| Written as | Outside Claude Code |
|---|---|
| `CLAUDE.md` defaults | The project instruction file (`AGENTS.md`, or `CLAUDE.md` if present). If neither states a default, use the defaults this skill states and flag the gap. |
| `Agent` tool with a `subagent_type` | Start a sub-agent with a fresh context if the runtime supports it. Otherwise run the step yourself as a separate pass: re-read the files from disk, set aside your drafting reasoning, and follow the same brief. For a named agent (for example `general-purpose` or a `plugin:agent` name), take on the role its brief describes. |
| `AskUserQuestion` (and `ToolSearch` to load it) | Ask in chat: numbered questions, each with options, tradeoffs, and your recommendation first. Wait for the answer before continuing. |
| Miro MCP | Use only if a Miro tool is available; otherwise follow this skill's rule for when Miro is unavailable. |
| Invoking this skill | Claude Code: `/<skill-name> <args>`. Codex: `$<skill-name> <args>`. Kimi Code: `/skill:<skill-name> <args>`. |

Paths in this file are relative to the skill folder.

---

## Argument parsing — do this first

The skill is invoked with two optional arguments, in any order: `brd-unifier [chunks|combined] [parts|whole]`. Match each argument by its value: `chunks` / `combined` set the **output mode**; `parts` / `whole` set the **generation option**. Either one can be left out.

| Argument received | Meaning | Action |
|---|---|---|
| `chunks` | Produce multi-file chunked output | Skip the mode prompt; proceed with CHUNKS mode. |
| `combined` | Produce a single consolidated `.md` file | Skip the mode prompt; proceed with COMBINED mode. |
| No mode passed | User has not chosen a mode | Run the resume check first (step 1): if the folder already holds a BRD in progress, continue with it in its own mode without asking. Otherwise run the **interactive mode prompt** below. |
| Anything else (not `chunks`, `combined`, `parts`, or `whole`) | Unrecognised | Tell the user the valid options and ask them to re-invoke, or treat as `(empty)` and prompt. |

### Interactive mode prompt (when no arg passed)

**CHUNKS is the default.** Ask one question, accept Enter / empty / "y" as confirmation of the default. Do not ramble:

> **Output format?** [chunks / combined] — default `chunks` (press Enter to accept).
>
> - **`chunks`** (default) — multi-file layout; one `.md` per template section grouping. Matches the embedded `chunks/*.md` skeleton.
> - **`combined`** — single monolithic `.md` file matching `TEMPLATE-COMBINED.md`.

Interpretation rules:

- Empty reply / Enter / `""` / `y` / `yes` / `chunks` / `default` → **CHUNKS mode**.
- `combined` / `c` / `single` / `one file` / `merged` → **COMBINED mode**.
- Anything else → re-prompt once with the same question; if still unclear, default to CHUNKS and note the fallback in the handoff summary.

If the user has already implied a mode in their request ("give me the full doc in one file" → `combined`; "split it into chunks" → `chunks`), do NOT ask — proceed with the implied mode and confirm in one short line in the handoff summary.

### Generation option: `parts` (default) or `whole`

| Argument received | Meaning | Action |
|---|---|---|
| `parts`, or nothing | Write the BRD in three parts and stop for the user's review after each | **Default in CHUNKS mode.** Part 1 = chunks 00-05, part 2 = `06*` and 07, part 3 = 08-14. See `parts-mode.md`. |
| `whole` | Write chunks 00-14 in one run | Use when asked for, always in COMBINED mode, and always for pure conversions (merge, re-chunk) and targeted updates. |

- Never ask which one. In CHUNKS mode, with nothing said, use `parts` and say so in one line before starting: "Generation: parts (default). Say 'whole' to get everything in one go."
- Words count as the argument: "all at once", "in one go" mean `whole`; "part by part", "step by step" mean `parts`.
- `combined parts` is not available. Say so in one line and continue in `whole`.
- Chunks 15-17 are outside both options: they stay locked behind the delivery gate. "Whole" means 00-14.

---

## Core principles

1. **Templates are authoritative.** `TEMPLATE-COMBINED.md` and the files under `chunks/` define the section order, naming, and structure. Section headings are never silently renamed.
2. **Business language only — the BRD states the WHAT.** No technology names, protocols, frameworks, or implementation terminology anywhere in the body. NFRs are business expectations ("highly available", "handles seasonal peaks") with business measures; integrations name the business partner and purpose ("Integration with Payment Gateway"), not the mechanism. The HOW — tech stack, architecture, technical targets — is owned by `sdd-unifier`; the constitution-grade Specs section is owned by `lld-unifier`. Technical mandates found in source material are parked **verbatim** in Appendix § Technical Inputs for the SDD so nothing is lost.
3. **User-journey first.** Requirements are expressed as per-persona use cases (UC-NN) with detailed numbered steps, alternate and exception flows — not abstract feature statements. Every persona gets a journey narrative, a use-case chunk, and a column in the Users & Use Cases Matrix.
4. **Markdown only.** No `.docx`, `.pdf`, `.html` unless the user explicitly asks in a follow-up.
5. **Mode is explicit.** Either it comes from the argument or from the interactive prompt. Never guess silently.
6. **Chunks are semantic, not size-based.** Never split by line count. Split where the reader naturally changes gear.
7. **Diagrams are inline Mermaid by default.** Any time the template asks for a diagram, author it as an inline Mermaid block with a 1-2 sentence prose summary. Miro boards are produced only when the user explicitly asks. See `mermaid-diagrams.md`.
8. **Flag gaps explicitly.** Where source material doesn't cover something the template requires, insert `**[NEEDS CLARIFICATION: <specific question>]**`. Never paper over gaps with plausible-sounding invention.
9. **Quality over theatre.** Use-case blocks are substantive — see `use-case-quality.md` for the bar.
10. **Generate or transform — detect, don't ask twice.** See `transform-detection.md`.
11. **One fact, one home (no duplication).** The BRD is the single home for business facts: UC-NN blocks, the Users & Use Cases Matrix, personas, business NFRs, business integrations. Downstream documents (SDD, LLD) reference them by ID and link — so IDs and names must stay stable across revisions (renaming a UC or persona breaks the chain; add a mapping note in the Changes Log if unavoidable). Within the BRD, no content is restated across chunks — cross-reference with a link. Restated content is a review defect (OI Type: Duplication).
12. **Delivery chunks are derived, evidence-gated, and locked behind the to-do.** Every generation ends with `14-todo.md`, the product-manager checklist (`delivery-chunks.md`); in `parts` generation that is the end of part 3. **Chunks 15, 16, and 17 cannot be generated or refreshed until chunk 14 is cleared:** all five to-do steps `Complete` with evidence and every item `Resolved`. `Deferred` does not count, and there is no override. The order stays 14 -> 15 -> 16 -> 17. Delivery chunks cite the body (00-13) by ID and link and never add a requirement, decision, acceptance criterion, or resolution; a gap found while deriving them becomes a to-do item, not invented content, and shuts the gate again. Generating a checklist is never evidence that a decision or review happened: no step is `Complete` without recorded evidence. Use-case diagrams (chunk 05) and use-case flowcharts (chunks `06*`) are drawn only at to-do step 5, after steps 1-4 are complete.
13. **Plain language: simple, clear, precise, easy to understand.** An easy BRD is essential, and simplicity is essential. Short sentences, common words, active voice, one idea per sentence, one term for one thing, the exact number or name instead of a vague word. No complex words where a simple one fits. Simple never means vague or incomplete: every number, rule, exception, and limit stays. This applies to every chunk (00-17), table cell, diagram label, test case, slide, and voiceover. Rules, word list, and the mandatory plain-language pass: `writing-style.md`.
14. **Parts by default, with a real stop.** In CHUNKS mode the BRD is written in three parts (00-05, then `06*` and 07, then 08-14). After parts 1 and 2 the skill shows a short summary, says what to review, and **stops until the user says to continue**. Scope, personas, and the use-case list are agreed before the use cases are detailed. `whole` writes everything in one run. Rules: `parts-mode.md`.

---

## Workflow

### 1. Resolve mode and generation option

Per the Argument parsing section above. Do not skip this — the mode determines the output shape, and the generation option determines whether the run stops for review between parts.

**Resume check.** If the target folder already holds a `brd-master.md` whose Generation Progress shows a part that is `Pending` or `In progress`, this is a resume. Do not start over. Say which part is next, then act on what the user asked (`parts-mode.md` § Resuming): start that part only when the request says to go on ("continue", "next part", "part 3"); if the request is empty, ask "Continue with part N?" and wait; if the request is something else, do that and name the part that is still waiting.

### 2. Resolve intent: generate vs transform

See `transform-detection.md` for the decision rules. In short:

- **GENERATE** — fresh BRD from a SoW, conversation, or topic seed.
- **TRANSFORM** — re-shape an existing document (an old-format BRD, a flat scope doc, a single-file BRD that needs chunking, or a chunked BRD that needs combining) into this template.

Both intents end with the same output shape (CHUNKS or COMBINED, per step 1) — the difference is in step 3.

### 3. Intake (short — not a clarification storm)

Ask at most **three** questions before starting, only those that genuinely block quality:

- **Project / system name** — if not stated.
- **Source material** — SoW attached? Existing BRD to migrate? Conversation context only? From scratch?
- **Personas** — if the source does not make clear who the users are, ask for the user types once; personas drive the use-case chunks and the matrix.

If an answer is already in the conversation, do not re-ask.

### 4. Plan internally

Enumerate which sections (combined) or chunks (chunked) will exist — including one use-case chunk per persona, plus `14-todo.md` (chunks 15-17 come later, behind the delivery gate) — and which Mermaid diagrams each will carry. The canonical chunk list is in `chunking.md`.

### 5. Diagram policy (inline Mermaid; Miro on demand)

All diagrams (persona journey summaries, summarized workflows, context sketches) are authored as **inline Mermaid** blocks, each followed by a 1-2 sentence prose **Summary** so the content reads without a renderer. Keep BRD diagrams business-language only — swimlanes and steps named after personas and business actions, never components or protocols. Validate each Mermaid block parses; on failure fall back to a text description + a clarification flag.

**Gated diagrams:** the **use-case diagrams** in chunk 05 and the per-use-case **flowcharts** in chunks `06*` are NOT part of first generation. They are added at step 5 of the product-manager checklist (`14-todo.md`), only after steps 1-4 are confirmed complete (see step 8b). The Summarized Workflow and every other diagram are generated as usual.

**Miro only on explicit request:** if the user asks for a board, create/reuse `BRD — [Project Name] — Diagrams` via the Miro MCP and append `> Miro: <url>` links below the corresponding Mermaid blocks — the inline Mermaid stays authoritative. See `mermaid-diagrams.md`.

### 6. Generate / transform output

**Parts or whole.** In `parts` (the default in CHUNKS mode), steps 6 to 9 are spread over three parts, each ending as `parts-mode.md` says:

| Part | Writes | Then |
|---|---|---|
| 1 | Chunks 00-05 and `brd-master.md` with its Generation Progress table | Exit checklist, plain-language pass, part summary, **stop and wait** |
| 2 | Every `06*` chunk, then the matrix (step 6a); back-fill of 00-05 | Exit checklist, plain-language pass, part summary, **stop and wait** |
| 3 | Chunks 08-12; back-fill; plain-language pass and exit checklist; then steps 7, 8, and 8a (chunks 13 and 14) | Final `brd-master.md` and chunk 00, full handoff (step 9) |

Never start the next part in the same turn, and never without the user's go-ahead. In `whole`, run steps 6 to 9 straight through, as one run.

**CHUNKS mode:**

- Use `chunks/*.md` (embedded in this skill folder) as the section skeleton.
- Write output to `./brd-[project-slug]/` (relative to the working directory) unless the user specifies a different path.
- Each chunk starts with the self-describing comment block (see `chunking.md`).
- Write `brd-master.md` from `chunks/brd-master.md`, linking this project's real chunk files (one row per `06*` persona chunk). In `parts` it is written in part 1 and updated at the end of every part; in `whole` it is written once the chunks exist and updated after step 8a. Chunks not written yet are plain text: `Pending (part N)`, or `Locked` for 15-17.
- Detailed use cases: one chunk per persona — `06a-use-cases-[persona-slug].md`, `06b-use-cases-[persona-slug].md`, … in the persona order of chunk 05. UC IDs are sequential across the whole BRD.
- The `USE CASE DIAGRAMS SLOT` (chunk 05) and `FLOWCHART SLOT` (each UC) in the skeletons stay empty at this stage: emit nothing for them, and do not copy the slot comments into the generated files. At to-do step 5, take the structure from the skeleton. Exception: a use-case diagram or flowchart that already exists in a transformed source is kept at the slot position, captioned `Pre-existing - re-verify at step 5`.
- `14-todo.md` is written in step 8a. Chunks 15-17 are written only in step 8c, behind the delivery gate.

**COMBINED mode:**

- Use `TEMPLATE-COMBINED.md` (embedded) as the structure.
- Write output to `./BRD-[ProjectName]-v[X.X].md` unless the user specifies a different path.
- Step 8a writes `14-todo.md` as a separate file in `./brd-[project-slug]/`. Step 8c (gated) later appends `# Implementation Plan` and `# UAT/BAT Test Cases` as the last two sections and writes `17-for-ppt.md` next to `14-todo.md`. Chunks 14 and 17 are never inside the combined file. See `delivery-chunks.md` § COMBINED mode adaptations.

**TRANSFORM intent (either mode):**

- Read the source document fully before writing anything.
- Map content to template sections per `sow-transformation.md`.
- Preserve verbatim numbers, dates, and named commitments.
- Park any technical mandates verbatim in Appendix § Technical Inputs for the SDD — never spread them into the body.
- Flag every gap with `**[NEEDS CLARIFICATION: ...]**`.

### 6a. Build the Users & Use Cases Matrix (mandatory, AFTER the use-case chunks)

The matrix (`07-users-use-cases-matrix.md` / `# Users & Use Cases Matrix` section) is **derived**, not authored independently. Build it from the completed use cases:

1. Columns = every persona from chunk 04, in the same order. Rows = every UC ID from chunk 05, in order (rows marked `Merged into UC-NN` or `Removed` are left out).
2. Cell = `Yes` where the persona is the UC's Primary or Supporting Actor; `-` otherwise.
3. Conditional access (own records only, requires approval, limited amounts) gets a numbered footnote — never a bare `Yes`.
4. Cross-check both directions: every actor named in a UC has a `Yes`; every `Yes` traces to a UC actor field. A mismatch means the UC or the matrix is wrong — fix the source of truth (the UC) first.
5. Red-flag review: a persona column with no `Yes`, or a matrix where everyone can do everything, means the personas or UC actors need another pass.

### 6b. Plain-language pass (mandatory)

Before the review, reread every chunk against `writing-style.md` § The plain-language pass and rewrite what fails: long sentences, complex words, passive or actor-less sentences, vague words, two names for one thing. Replace a vague word with the fact, or flag it with `[NEEDS CLARIFICATION: ...]`. Never drop a number, rule, exception, or limit while simplifying. Repeat the pass on the delivery chunks at the end of step 8a. In `parts`, run the pass on the chunks written or changed in each part: at the end of parts 1 and 2, and in part 3 after chunks 08-12 and the back-fill, before the review.

### 7. Post-generation review (mandatory, cleared-context)

After the body of the BRD is written but **before** presenting to the user (in `parts`: once, in part 3, after chunks 08-12), run an adversarial review pass that produces the `Open Items & Clarifications` chunk (`13-open-items-and-clarifications.md` / `# Open Items & Clarifications` section in combined mode).

**Why cleared context.** The reviewer must be independent. The same context that authored the body anchors on what was written and tends to confirm rather than challenge. The reviewer's job is gap-finding, not validation.

**How to run it.**

1. Use the `Agent` tool with `subagent_type: general-purpose` (or `comprehensive-review:full-review` if appropriate for the project complexity). The subagent starts with no conversation memory, which is the point.
2. Pass the subagent:
   - Absolute paths to all generated chunks (or the combined file).
   - The path to this BRD's templates so it knows the expected structure.
   - The brief: identify gaps, missing scenarios, corner cases, ambiguities, risks, and inconsistencies — including matrix inconsistencies (a UC actor without a matrix `Yes`, a persona with no use cases) and any technical language that leaked into the body. For each finding, propose 2-3 concrete options with one-line tradeoffs AND a **Recommended Answer** (the concrete resolution text, written so it can be pasted into the BRD as-is — the exact step, rule, row, or wording) AND a **Why** (REQUIRED: the reason that option wins — the evidence behind it and the tradeoff accepted; never empty). Output goes into the chunk/section using the schema in `chunks/13-open-items-and-clarifications.md`.
   - Constraint: the reviewer captures **external** findings only — gaps the body did not flag inline. Inline `[NEEDS CLARIFICATION: ...]` markers stay where they are; they do not move into Open Items.
3. The subagent writes directly to `13-open-items-and-clarifications.md` (chunks mode) or appends to the `# Open Items & Clarifications` section (combined mode).
4. Verify the output: at least one OI item per major risk area (scope, use-case exception coverage, matrix consistency, NFRs, integrations, security/privacy, data lifecycle). Every OI must have a non-empty Recommended Answer AND a non-empty Why. If the reviewer returned zero OIs, push back — that almost always means the review was confirmatory rather than adversarial; re-dispatch with a stronger adversarial framing.

**Reviewer prompt skeleton (adapt per project):**

> You are an independent adversarial reviewer for a Business Requirements Document. You have no memory of how this document was authored. Your job is to find what is missing, ambiguous, or risky — not to confirm what is present.
>
> Read these files: [paths]. Use [TEMPLATE-COMBINED.md path] as the structural reference.
>
> For each gap, missing scenario, corner case, ambiguity, risk, or inconsistency you find, write an OI entry following the schema in [chunks/13-open-items-and-clarifications.md path]. Each entry must include: Where, Type, Concern (one paragraph), Options (at least 2 with tradeoffs), **Recommended Answer (the concrete resolution text, ready to paste into the BRD)**, **Why (the reason that option wins over the alternatives — evidence + tradeoff accepted; never empty)**, Status: Open.
>
> Cover at minimum: scope edges, use-case exception flows the body assumes away, Users & Use Cases Matrix consistency (every UC actor has a Yes; every persona has use cases), NFR gaps, integration failure scenarios from the user's point of view, multi-tenancy implications if relevant, data lifecycle and retention, regulatory or compliance hooks not addressed, conflicts between sections, any technical/implementation language that leaked into the business text, duplication (the same fact stated in two chunks, or source content restated where a cross-reference belongs — one fact, one home), and plain language ([writing-style.md path]): wording so vague or complex that it hides a requirement is an OI of Type Ambiguity; purely editorial cases (long sentences, complex words) go under Reviewer Notes with the chunk and the simpler wording.
>
> Do not echo what the document says. Do not confirm. Find what is missing. Write directly to [output path].

### 8. Open Items review & acceptance loop (mandatory)

The Open Items are not left for the user to discover — walk them through each item and get a decision:

1. Present the OI list compactly (ID, title, one-line concern, the Recommended Answer and its Why).
2. Ask the user to decide per item, batched via **AskUserQuestion** (load via ToolSearch if deferred; up to 4 items per call); the recommended option's description carries its Why so the user decides with the reason in view. Options per item: **Accept recommendation** (recommended, listed first) / **Choose option [B/C]** / **Defer** / user types their own answer via "Other".
3. For every **accepted** (or user-adjusted) item:
   - Apply the Recommended Answer (or the adjusted text) to the referenced chunk(s)/section(s) — it was written to be paste-ready.
   - If the change touches actors or permissions, re-verify the Users & Use Cases Matrix (step 6a rules).
   - Set the OI's Status to `Accepted - applied` (or `Adjusted - applied`), add a Resolution Log row, and bump the Changes Log in chunk 00 once for the batch.
4. **Deferred / Rejected** items keep their entry with the new status and rationale; they are not applied.
5. If the user says "later" / "I'll review offline", leave all items `Open` and note in the handoff that the acceptance loop is pending — do not apply anything without an explicit decision.

### 8a. Generate the to-do, `14-todo.md` (mandatory, every full generation, both modes; in `parts` it closes part 3)

Read `delivery-chunks.md` and `chunks/14-todo.md` first. Chunk 14 is the only delivery chunk written on a normal run.

1. **Open items register.** Consolidate every unresolved question, assumption needing validation, and pending decision (`TD-NN`, each linked to its source chunk and identifier, stating the decision needed, sorted by priority).
2. **Consistency check, Run 1** (checks C1-C8). Record every finding as `CF-NN` with its disposition; apply only confirmed corrections, raise business ambiguities as `OI-NN` + `TD-NN`, recheck.
3. **Steps 3-5.** The grill-me inputs and the ready-to-use handoff prompt (recommended, never claimed as executed); the Figma mockup coverage and review criteria; the step 5 tracking tables (`Pending gate`, or `Skipped` for planned skips).
4. **Delivery gate block.** Fill conditions G1-G5 with `Met` / `Not met` and what is still open, state the gate (`Shut` on a normal first run), and name the next action. Set the three Downstream outputs rows to `Locked`. In CHUNKS mode, update `brd-master.md` (chunk 14 linked, chunks 15-17 listed as `Locked`) and add chunk 14 to the Table of Contents in chunk 00. In COMBINED mode, the combined file's Table of Contents links it as `./brd-[project-slug]/14-todo.md`.
5. Run the plain-language pass (`writing-style.md`) on chunk 14, then the "Whenever chunk 14 is written or updated" block of `delivery-chunks.md` § Verification before presenting.

**Do not write `15-implementation.md`, `16-uat-bat-test-cases.md`, or `17-for-ppt.md` here**, and do not write drafts, previews, or outlines of them. They belong to step 8c and are locked until chunk 14 is cleared.

Skip step 8a only when the user explicitly asks for the BRD alone, and report the skip in the handoff.

### 8b. Gated diagram step (to-do step 5, on a later invocation)

Triggered when the user asks to run step 5, add the use-case diagrams, or add the flowcharts.

1. If `14-todo.md` does not exist yet (part 3 of a `parts` generation is still pending, or the user skipped the to-do), the gate is shut: say that the to-do is written at the end of part 3 (or offer to write it now if it was skipped) and stop. Otherwise read `14-todo.md` and verify gate conditions G1-G4 **against the files** (`delivery-chunks.md` § The delivery gate): no `Open` or `Deferred` item, no clarification marker left, a check run dated after the last BRD change with every finding dispositioned, the grill-me session and the mockup review confirmed by the product manager. If anything is missing, list it and **stop**. The product manager's confirmation is valid evidence for steps 3 and 4 only (record it with the date). No override.
2. Add the use-case diagram(s) to chunk 05 and a flowchart to every qualifying use case in chunks `06*` (3 or more Main Flow steps and at least one decision point; linear or shorter use cases are skipped with a recorded reason). Notation: `mermaid-diagrams.md`. Rules: `delivery-chunks.md` § The gated diagram step.
3. Do not invent behaviour to close a gap: record a `TD-NN`, mark the diagram `Provisional` in the tracking table, finalise it after the answer.
4. Validate every Mermaid block, add Summary lines and Figures index rows (next free figure numbers), bump the version and the Changes Log, rerun the consistency check (C9 included), and update `14-todo.md` last. If chunks 15-17 already exist, mark them `Stale`.

### 8c. Gated delivery chunks: `15-implementation.md` -> `16-uat-bat-test-cases.md` -> `17-for-ppt.md`

**Guardrail. These three chunks cannot be generated or refreshed until chunk 14 is cleared: all five to-do steps `Complete` with evidence and every to-do item `Resolved`. `Deferred` does not count as closed. There is no override, even when the user asks for the chunks directly.**

Triggered when the user asks for the implementation plan, the test cases, the presentation or video brief, or a refresh of any of them; also checked whenever `14-todo.md` is written or updated.

1. **Verify the gate against the files, never from the status cells alone:** conditions G1-G5 in `delivery-chunks.md` § The delivery gate. If `14-todo.md` does not exist yet, the gate is shut (see step 8b.1 for what to say).
2. **Gate shut:** write none of the three: no draft, preview, or outline, in a file or in the chat. A user's "I take responsibility" is not evidence for any step. Update the Delivery gate block and the Downstream outputs rows in `14-todo.md` (`Locked`, or `Stale` if they already exist). Tell the user exactly what is still open (steps, `TD-NN`, `OI-NN`, `CF-NN`, clarification markers, mockup rows) and the next action. If the user insists, explain the rule and repeat the list.
3. **Gate open:** read the skeletons, then write **15**. Check the gate again, then write **16** (follow the skeleton exactly; it encodes the owner's reference format). Check the gate again, then write **17** (every storyboard sums to exactly 30 seconds). In COMBINED mode 15 and 16 are appended to the combined file as its last two sections.
4. **A gap found while writing** (a missing prerequisite, a circular dependency, an expected result the BRD does not state) becomes a `TD-NN`. Only the affected content is labelled: `Provisional (TD-NN)`, or `Blocked` for a task that cannot be delivered without the answer (`delivery-chunks.md` § Chunk 15). The chunk in hand is finished and **the next chunk is not started**. Report what must be decided.
5. Run the plain-language pass on what was written, then both blocks of § Verification before presenting. Update `14-todo.md` last (links, `Blocks`, Downstream outputs).

### 9. Present

In `parts`, parts 1 and 2 end with the short part summary of `parts-mode.md` § The checkpoint, not with this handoff. This full handoff closes part 3, or a `whole` run.

After the body, the Open Items chunk, the acceptance loop, and the to-do, surface the output to the user with:

- Generation option used (`parts` or `whole`), and for `parts` the date each part was completed.

- Project name, version, mode (chunks / combined), file paths.
- Number of chunks (if chunks mode) or section count (if combined), including the persona count and use-case count.
- Count of inline Mermaid diagrams generated (and the Miro board URL, only if one was requested).
- Count of inline `[NEEDS CLARIFICATION: ...]` markers — explicit body-level gap inventory.
- Plain-language pass: confirm it ran on the body and on every delivery chunk written; name any chunk that still reads heavy and why (for example, verbatim source wording that had to stay).
- Open Items summary: total, accepted & applied, adjusted, deferred, rejected, still open.
- Matrix status: personas × use cases covered, plus any footnoted conditional cells.
- Chain handoff check: UC IDs, persona names, and integration IDs are stable and internally consistent (downstream `sdd-unifier` references them by ID); no content restated across chunks.
- To-do summary: the five steps with their status (none reported `Complete` without evidence); open `TD-NN` by priority; consistency findings by disposition, including the mechanical corrections that were applied; open items raised after the acceptance loop and not yet reviewed.
- **Delivery gate: `Shut` or `Open`.** When shut, say plainly that `15-implementation.md`, `16-uat-bat-test-cases.md`, and `17-for-ppt.md` were not generated, list the conditions (G1-G5) that are not met with what is open behind each, and state that `Deferred` items count as open and that there is no override.
- When 15-17 were written in this run: task count, waves, and dependency problems; test-case total with provisional scenarios and coverage gaps; slide count and video count (every storyboard verified at 30 seconds); any new `TD-NN` raised while writing them.
- The recommended next action for the product manager: the first incomplete to-do step (normally: decide the P1 open items, then run `/grill-me` with the prepared prompt). State plainly that the use-case diagrams and flowcharts wait for to-do steps 1-4.
- One-line offer: "Want me to switch to the other mode?" / "Want me to merge the chunks?" / "Want me to re-chunk this combined file?"

### 10. Cross-mode conversion (on explicit request)

| User says | Action |
|---|---|
| "merge", "consolidate", "single file", "full doc" (after chunks exist) | Concatenate chunks per `chunking.md` § Merge handling. Write to `./brd-[project-slug]/BRD-[ProjectName]-v[X.X]-MERGED.md` (the same folder as the chunks, so relative links keep working). Keep originals. **Never merge `14-todo.md` or `17-for-ppt.md`**; 15 and 16 are merged after 13 once they exist. |
| "split into chunks", "re-chunk this", "chunk this BRD" (when a combined file exists) | Read the combined file, slice by template sections per `chunks/*.md` skeleton, write chunked output. Keep the original combined file. |
| "regenerate chunk N", "update section X" | Targeted regeneration of one chunk or section, leaving the rest untouched. If use cases change, re-derive the matrix (step 6a), refresh `14-todo.md`, and mark chunks 15-17 `Stale` if they exist (`delivery-chunks.md` § Refresh triggers). |
| "update the todo", or decisions handed back from a grill-me session | Apply confirmed decisions through the step 8 mechanics, rerun the consistency check, and refresh `14-todo.md` (statuses, evidence, Delivery gate block). Every ID stays stable. |
| "generate / refresh the implementation plan", "the test cases", "the ppt or video brief", "the delivery chunks" | Step 8c (gated): verify G1-G5 first. Gate shut means nothing is written and the user gets the list of what is open. |
| "run step 5", "add the use-case diagrams", "add the flowcharts" | Step 8b (gated). |
| "continue", "next part", "part 2", "part 3" (a part is `Pending` in `brd-master.md`) | Resume with the next pending part, in order (`parts-mode.md`). Read every chunk already written first. |
| "redo part N" | Follow `parts-mode.md` § Resuming (redo a completed part). Decisions taken since are kept, not lost. |
| "just finish it", "do the rest in one go" | Switch to `whole` for the remaining parts; no more checkpoints. |

---

## Reference files (read these when the situation calls for them)

- `TEMPLATE-COMBINED.md` — the single-file template. Read at the start of any COMBINED-mode generation.
- `chunks/*.md` — the per-chunk template skeletons. Read at the start of any CHUNKS-mode generation.
- `chunking.md` — canonical chunk map, naming convention, merge rules.
- `modes.md` — chunks vs combined behavioural details.
- `parts-mode.md`: the generation option. The three parts, what each settles and what the user reviews, the checkpoint (stop and wait), the exit checklists, the back-fill of earlier parts, the progress record in `brd-master.md`, and resuming. Read at the start of every CHUNKS-mode generation.
- `transform-detection.md` — rules for deciding generate vs transform.
- `sow-transformation.md` — how to map SoW or existing-BRD content into this template.
- `mermaid-diagrams.md` — inline Mermaid conventions for every diagram the template implies (including the gated use-case diagram and flowchart notation), plus the Miro-on-demand flow.
- `use-case-quality.md` — what makes a substantive use case vs a thin one, the flowchart quality bar, and the matrix consistency rules.
- `writing-style.md`: the plain-language style for everything the skill writes: the rules, the word list, before/after examples, and the mandatory plain-language pass. Read before writing any chunk.
- `delivery-chunks.md`: the rulebook for chunks 14-17: the delivery gate (G1-G5) that locks 15-17, the to-do steps and their evidence rule, the consistency check, task derivation and dependency ordering, the UAT/BAT format and coverage rules, the presentation and video rules, the gated diagram step, refresh and re-lock rules, special cases (COMBINED mode, legacy BRDs), and the verification list. Read at steps 8a, 8b, and 8c, and on any refresh.
- `chunks/14-todo.md`, `chunks/15-implementation.md`, `chunks/16-uat-bat-test-cases.md`, `chunks/17-for-ppt.md`: the delivery chunk skeletons (used in both modes).

---

## Output conventions

- **Project slug**: kebab-case, lowercased, derived from the project name (e.g., "Wallet Management Service" → `wallet-management-service`).
- **Chunked output folder**: `./brd-[project-slug]/`.
- **Chunked filenames**: `NN-short-title.md` (two-digit prefix, optional letter for splits like `06a`, `06b`). See `chunking.md`.
- **Combined output filename**: `BRD-[ProjectName]-v[X.X].md` (PascalCase project name, no spaces).
- **Merged-from-chunks filename**: `BRD-[ProjectName]-v[X.X]-MERGED.md`, written inside `./brd-[project-slug]/`.
- **Delivery chunks**: `14-todo.md` (every generation; in `parts`, at the end of part 3), then `15-implementation.md`, `16-uat-bat-test-cases.md`, `17-for-ppt.md` (only once the delivery gate is open), in `./brd-[project-slug]/`. In COMBINED mode 15 and 16 are sections of the combined file; 14 and 17 are still files in `./brd-[project-slug]/`. 14 and 17 are never merged.
- **Delivery identifiers**: `TD-NN`, `CF-NN`, `MK-NN`, `TASK-NN`, `DP-NN`, `TC-[AREA]-NN`, `SL-NN`, `V-NN` / `V-NN-Cn`. The one list with meanings is in `delivery-chunks.md` § Ground rules. Stable across refreshes; never renumbered.
- **Encoding**: UTF-8, LF line endings.
- **Tables**: pipe-table format, no hard line wrap.

---

## Things this skill never does

- Never emits `.docx`, `.pdf`, `.xlsx`, or any non-Markdown output unless the user explicitly asks.
- Never puts technical stack, technical terminology, protocols, or implementation detail in the BRD body. Source-stated technical mandates go verbatim into Appendix § Technical Inputs for the SDD; everything else technical is left to `sdd-unifier`. The Specs section (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier`, not this skill.
- Never creates a Miro board unless the user explicitly asks. Inline Mermaid is the authoritative diagram medium; Miro links are additive. BRD Mermaid diagrams stay business-language (personas and actions, never components or protocols).
- Never invents NFR measures, counts, or business targets to fill a table. Missing measure → `[NEEDS CLARIFICATION: ...]`.
- Never writes a matrix cell that contradicts a use case's actor fields — the UC is the source of truth; fix it first.
- Never applies an Open Item to the body without the user's explicit acceptance in the review loop.
- Never produces a "here's a summary, let me know if you want the full version" preview. Generate the actual deliverable.
- Never silently drops template sections. Empty sections keep their heading and write `Not applicable for this release.` (with a clarification flag if surprising). Exception: the `# Implementation Plan` and `# UAT/BAT Test Cases` sections of a combined BRD are left out entirely (no heading, no stub) while the delivery gate is shut.
- Never modifies the embedded templates (`TEMPLATE-COMBINED.md` or `chunks/*.md`) during a generation run — they are read-only references.
- Never starts the next part in `parts` without the user's go-ahead, never skips a part or changes their order, and never rewrites a completed part on a resume (only the back-fill touches it).
- Never writes a complex word, a long sentence, or a vague phrase where a simple, precise one fits (`writing-style.md`), and never drops a number, rule, or exception to make the text simpler.
- Never marks a to-do step `Complete` without recorded evidence, and never treats having generated a checklist, plan, test suite, or brief as evidence that a decision or review happened. Never claims the grill-me session or a mockup review took place unless the user confirms it.
- Never draws use-case diagrams (chunk 05) or use-case flowcharts (chunks `06*`) before to-do steps 1-4 are confirmed complete, and never puts those diagrams in `14-todo.md`: the to-do tracks them, chunks 05 and `06*` hold them.
- Never generates or refreshes `15-implementation.md`, `16-uat-bat-test-cases.md`, or `17-for-ppt.md`, not even as a draft, preview, or outline, in a file or in the chat, while any to-do step is not `Complete` with evidence or any item is not `Resolved`. `Deferred` counts as open. There is no override: when asked anyway, list what is still open instead.
- Never opens the delivery gate on status words alone: conditions G1-G5 are verified against the files, and the product manager's confirmation covers to-do steps 3 and 4 only.
- Never invents requirements, decisions, acceptance criteria, expected test results, dependencies, or flow behaviour in a delivery chunk or a diagram. Gaps become to-do items, the affected content is labelled `Provisional (TD-NN)`, and the next chunk waits.
- Never presents a circular dependency, a missing prerequisite, or a blocked task as part of a valid implementation sequence.
- Never resolves a business ambiguity found by the consistency check silently; only confirmed or purely mechanical corrections are applied, and each is logged.
- Never merges `14-todo.md` or `17-for-ppt.md` into the merged or combined BRD.
- Never renumbers delivery identifiers (`TD`, `CF`, `MK`, `TASK`, `DP`, `TC`, `SL`, `V`) on a refresh.
