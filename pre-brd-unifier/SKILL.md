---
name: pre-brd-unifier
description: >-
  Generate, transform, or reformat a pre-BRD (the discovery layer before a BRD) into the user's
  standard 22-framework template across five tiers, ending in a go/no-go scoreboard and an investor
  assessment. Use when asked to create, draft, write, or build a pre-BRD, discovery doc, market
  study, idea validation, or go/no-go analysis; to turn notes, an idea, a concept brief, or a Scope
  of Work into the pre-BRD template; or to run a competitor, market-sizing, PESTLE, SWOT, or RICE
  analysis, investor-style Go vs No-Go scoring, or go-to-market strategy as part of discovery. Runs
  multi-agent web research to fill the frameworks with sourced values. Arguments: [chunks|combined] [light].
  Output is Markdown; a styled .xlsx export is produced only on request, after the user approves the
  Markdown.
---

# Pre-BRD Unifier

Author, transform, and unify a pre-BRD: 22 analysis and market-study frameworks across five tiers, ending in a mechanical go/no-go Executive Summary Scoreboard followed by an independent Investor Assessment (chunk 23). This is the discovery-layer companion to `brd-unifier` - it performs the analysis (market sizing, competitor scan, macro/competitive/internal factors) rather than templating requirements.

The embedded templates in `chunks/` are the authoritative section skeletons. The embedded `reference/PRE-BRD-v1.1.xlsx` is the authoritative styling + formula source for Excel export.

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

## Argument parsing: do this first

`pre-brd-unifier [chunks|combined] [light]`, in any order.

| Argument | Action |
|---|---|
| `chunks` | CHUNKS mode, skip the prompt. |
| `combined` | COMBINED mode, skip the prompt. |
| `light` | A light run (§ Light run). It sets no output mode: alone, it still runs the prompt. The words "light run" and "light-work" count as `light`. Without it, the full run. |
| (empty) | Run the interactive prompt below. |
| anything else | State valid options and ignore it; a valid token passed with it still applies. Prompt when no output mode was passed. |

**Interactive prompt (chunks is default):**

> **Output format?** [chunks / combined] - default `chunks` (press Enter to accept).

Empty / Enter / `y` / `chunks` → CHUNKS. `combined` / `c` / `single` / `one file` → COMBINED. If the user already implied an output mode, do not ask. An answer policy can answer this prompt (§ Answer policy).

Excel is NOT a mode. It is the on-demand step in `xlsx-export.md`, run only after the user reviews and approves the Markdown.

---

## Core principles

1. **Templates are authoritative.** `chunks/*.md` define section order and structure; never rename headings.
2. **Markdown only by default.** `.xlsx` only on explicit request after review; never `.docx`/`.pdf`.
3. **Output mode is explicit** - from the argument or the prompt.
4. **Research is sourced.** Every researched figure carries a source (see `research-orchestration.md`). Unverifiable values → `[NEEDS CLARIFICATION: <question>]`. Never invent market numbers.
5. **Compute, do not hardcode.** Derived values (RICE, TAM→SAM→SOM, EFAS/IFAS weighted, Porter's averages, Tier-5 composite) come from the stated formulas in `frameworks.md`.
6. **Fill contract.** Write Answer cells only; guidance/sample content is read-only context.
7. **Coherent synthesis.** The Scoreboard (22) scores its five signals from tier 2 only: 07, 09, 10, and 11 (`frameworks.md` § Tier-5 propagation map). Its conditions and the Investor Assessment (23) may cite any tier. Chunks 22 and 23 must not contradict chunks 01-21.
8. **No duplication.** Each chunk adds only its own framework's lens. State a shared fact - UVP, revenue levers, the KPI/success-metric list, target segment, cost drivers, the phase roadmap - **once** in its home chunk and reference it elsewhere with a link (e.g. "see [01-concept-sheet.md]"), rather than restating it verbatim across 01/02/03/15/19/21. Cross-reference, do not repeat. Homes: 01 for the problem, target segment, UVP, key features, business model (revenue levers), and success metrics (the KPI list); 02 for the vision; 03 for channels and cost structure; 21 for the phase roadmap. A chunk that asks for one of these links to its home and adds only its own lens (for example 21 adds each channel's role, launch phase, and owner). The Product Strategy Canvas (19) in particular should point to 01/02/03 for shared elements and add only its strategic framing.
9. **No em dashes.** Author all output with hyphens or restructured clauses; never the em dash. (Applies to chunks, combined output, and Excel - the export engine scrubs em dashes from the workbook, including the reference template's own guidance text.)

---

## Workflow

1. **Resolve the output mode** (above) and **intent** - generate vs transform per `transform-detection.md`.
2. **Intake - ask at most 4 questions**, skipping anything already in context: product idea/concept; target segment/customer; geography/market footprint; currency + hard constraints. Under an answer policy, a missing one is flagged and the run continues (§ Answer policy).
3. **Research fan-out** per `research-orchestration.md` → a sourced research bundle. A light run dispatches fewer agents (§ Light run).
4. **Fill the 22 framework chunks (01–22)** tier by tier from the bundle, per `frameworks.md`. Replicate per-persona blocks. Add rows for variable-row frameworks. Flag gaps with `[NEEDS CLARIFICATION: ...]`. A light run fills only its set (§ Light run).
5. **Investor assessment pass** (dedicated investor agent) → fill `23-investor-assessment.md` (chunks) or an appended Investor Assessment section (combined). Runs first so chunk 23 exists for the reviewer to check. See "Investor assessment pass" below.
6. **Reviewer pass** (cleared-context) → `24-open-items-and-assumptions-log.md` (chunks) or an appended section (combined). Runs last and reviews **01–23** (including the investor verdict). See "Reviewer pass" below.
7. **Present** the Markdown deliverable with an inventory: chunks/sections, `[NEEDS CLARIFICATION]` count, open-items count, source count (distinct source links cited across the chunks), and the investor verdict (Go / Conditional / No-Go + composite). When they apply, also name the light run and its skipped frameworks (§ Light run), a zero-finding review (§ Reviewer pass), and each answer the answer policy gave (§ Answer policy). **Stop. Do not produce Excel.** An answer policy never passes this stop (§ Answer policy).
8. **On explicit approval** ("export excel" / "looks good, generate the sheet"): run the export per `xlsx-export.md`. Never after a light run (§ Light run), and never by an answer policy (§ Answer policy).

### Output modes

- **CHUNKS:** write `./pre-brd-[project-slug]/NN-*.md` using `chunks/*.md` as skeletons. Copy `chunks/00-pre-brd-master.md` as the index: it has no Answer slots, so only its comment block changes (see `modes.md`).
- **COMBINED:** concatenate the same content into `./PRE-BRD-[ProjectName]-v1.1.md` with a table of contents; no chunk comment blocks.

### Light run (`light`)

A light run fills a smaller set of frameworks:

- **Filled:** 01, 02, 06, 07, 09, 10, 11, 12 (derived), 14, and 22. A phase-based request (one that asks for phased delivery, for example it says "phase-based" or names delivery phases) also fills 21, and 03 with it: 03 is the one home of the channels and cost structure that 21's go-to-market rows link to (principle 8).
- **Research:** agents for 06, 07, 09, 10, and 11 only.
- **Still run:** the investor pass (23) and the reviewer pass (24); each brief covers the skipped frameworks (§ Investor assessment pass, § Reviewer pass).
- **Skipped:** every other framework keeps its skeleton (headings, tables, and in CHUNKS mode the comment block) with empty Answer cells, and the note `Not filled: light-work run.` sits under its first heading. The note is not a `[NEEDS CLARIFICATION]` marker. In a transform, a framework outside this set that the source document covers is filled from the source as `transform-detection.md` maps it (verbatim numbers kept), with no research for it; only one the source does not cover is skipped.
- **No Excel export:** step 8 does not run.

### Answer policy

An **answer policy** is a standing instruction the user sets for a run, in the request or in a run brief, for example "answer policy: accept the recommended option". It may cover less than the rules below allow, for example "accept the recommended option, but ask me about the investor lens": a question its wording leaves out waits for the user. With no answer policy, every rule in this skill stays as written.

1. **It takes the recommended option.** It answers a question only when the question carries a recommended option or a stated default, by taking that option: the output-mode prompt (`Output format?`, default `chunks`), the intent question (`transform-detection.md`), and the lens question (§ Investor assessment pass).
2. **It never chooses anything else.** Another option, Defer, a rejection, or a free-text answer stays with the user.
3. **It never supplies a fact** only a person or a provider can give. Under a policy, a missing intake fact (step 2: idea, segment, geography, currency, constraints) is flagged and the run continues: `[NEEDS CLARIFICATION: <question>]` sits where the fact is first used (for a currency, 07's Canonical figures table), as for a missing internal fact (`research-orchestration.md`), and the step 7 inventory's `[NEEDS CLARIFICATION]` count includes it. Without a policy, step 2 asks as written. Nor does the policy take a recommended option that makes a decision the user's standing instructions for the project reserve for the user, or that sets a business rule a source document rules out: that question waits for the user.
4. **Stops.** The step 7 stop ends the run. A policy never passes it, since the only later step, the Excel export (step 8), is never run by a policy.
5. **Records.** Name each answer the policy gave in the step 7 inventory, with the decider `Policy: <policy> (set by <name>, <date>)`. A lens it chose also carries that decider at the end of chunk 23's Active lens line, where the lens is recorded.

### Investor assessment pass (mandatory): runs first

Once the 22 framework chunks (01–22) and the Scoreboard are filled, dispatch a dedicated investor agent (`Agent`, `subagent_type: startup-business-analyst:startup-analyst`), framed as a skeptical early-stage investor, with read access to all filled chunks (01–22) including the Scoreboard. It fills `23-investor-assessment.md`: scores the seven aspects out of 10 - each with a one-line rationale citing its source chunk(s) - computes the weighted composite per `frameworks.md`, and writes a decisive **Go / No-Go** executive summary with a strong Why (top reasons, top risks, conditions to clear). It must reconcile its verdict with the mechanical Scoreboard (22): agree and reinforce, or disagree and explain. Per-aspect scores are judgment; the composite is computed, not hardcoded. The investor never edits chunks 01–22; it only authors chunk 23. In a light run, the brief also names the skipped frameworks (§ Light run): they are intentional. The investor scores from the filled chunks, and each aspect whose source chunks include a skipped framework names, in its one-line rationale, the evidence the light run left out.

**Conditional reframe for enterprise / internal initiatives.** The `startup-analyst` persona defaults to venture-return framing (fundability, exit, pre-seed→Series A). When the pre-BRD is for an internal product, enterprise initiative, or cost-center bet rather than a fundable startup - infer this from intake (no external raise, internal sponsor/budget, B2B/internal user base) or ask if ambiguous - instruct the agent to swap the lens to a **business-case lens** while keeping the same seven aspects, weights, 0–10 scale, and verdict bands. Specifically: read "Financial viability & return" as ROI / payback / TCO vs. internal hurdle rate (not investor return or exit multiple); read "Market opportunity" as addressable internal demand or strategic value; read "Go-to-market" as adoption/rollout and change management; and frame the Why and verdict as **fund-the-initiative vs. don't** for the sponsor, never as an investment thesis. Note the active lens (venture vs. business-case) in one line at the top of chunk 23. The lens question recommends business-case when an internal sponsor or budget exists, and venture-return otherwise; that recommendation is what an answer policy takes (§ Answer policy).

### Reviewer pass (cleared-context, mandatory): runs last

Dispatch a subagent (`Agent`, `subagent_type: general-purpose`) with no authoring memory, **after** the investor pass so chunk 23 already exists. It reviews **chunks 01–23** (the whole deliverable including the investor verdict). Brief: find unsourced/shaky market numbers, competitor coverage gaps, **cross-chunk figure inconsistencies** (the same market size / CAGR / region share / customer count cited differently across 06/07/09/10/16 - these are defects, see the reconciliation rule in `research-orchestration.md`), cross-tier incoherence (do SAM/SOM, EFAS/IFAS, Porter's feed the Tier-5 scoreboard coherently? does the investor verdict in 23 cohere with the scoreboard in 22 and the underlying tiers?), and weak go/no-go logic. In a light run, the brief also names the skipped frameworks (§ Light run): they are intentional, not coverage gaps. For each finding, follow the schema in `chunks/24-open-items-and-assumptions-log.md`: Where, Type, Concern, Options (≥2 with tradeoffs), **Recommended Answer** (the concrete resolution, ready to apply), **Why** (REQUIRED - the reason that option wins: the evidence behind it and the tradeoff accepted; never empty), Status: Open. Also fill the chunk's Assumptions Log (every material assumption with its basis and the risk if wrong). Write to the Open Items log (`24-…`, which is the reviewer's own output - do not flag 23 or 24 as "missing"). If it returns zero findings, re-dispatch with stronger adversarial framing, at most twice. Brief every pass to name the areas it checked if it finds nothing, and tell the third pass it is the last: if it also finds nothing, it writes `None: three reviewer passes found no issue` as its Open Items section. After that third zero-finding pass, the main context records the three passes and the areas each checked in chunk 24's Reviewer Notes (the only text the main context adds to chunk 24), and the step 7 inventory names the zero-finding result.

---

## Output conventions

- Project slug: kebab-case from the project name.
- Chunked folder: `./pre-brd-[project-slug]/`; filenames `NN-short-title.md`.
- Combined: `./PRE-BRD-[ProjectName]-v1.1.md`. Excel: `./PRE-BRD-[ProjectName]-v1.1.xlsx`.
- Encoding UTF-8, LF. Tables are pipe-tables, no hard wrap.
- No em dashes in any output; use hyphens or restructure (see principle 9).
- No duplicated content across chunks; cross-reference shared facts with a link (see principle 8).

## Things this skill never does

- Never emits Excel from the argument or before the user approves the Markdown, and never after a light run or by an answer policy (§ Light run, § Answer policy).
- Never overwrites guidance or READ-ONLY sample cells, or hardcodes a value where the workbook has a formula.
- Never invents market figures without a source - unverifiable → `[NEEDS CLARIFICATION]`.
- Never modifies the embedded `chunks/*.md` or `reference/PRE-BRD-v1.1.xlsx` during a run.
- Never silently drops a framework; an empty framework keeps its heading with a flagged note (a light run's skipped framework follows § Light run).

## Reference files

- `modes.md` - chunks vs combined + conversion.
- `transform-detection.md` - generate vs transform.
- `frameworks.md` - fill contract, classification, formula catalog, Tier-5 propagation.
- `research-orchestration.md` - multi-agent research playbook.
- `xlsx-export.md` - payload schema and the on-demand export procedure.
