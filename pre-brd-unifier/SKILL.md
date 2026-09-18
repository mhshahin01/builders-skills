---
name: pre-brd-unifier
description: >-
  Generate, transform, or reformat a pre-BRD (the discovery layer before a BRD) into the user's
  standard 22-framework template across five tiers, ending in a go/no-go scoreboard and an investor
  assessment. Use when asked to create, draft, write, or build a pre-BRD, discovery doc, market
  study, idea validation, or go/no-go analysis; to turn notes, an idea, a concept brief, or a Scope
  of Work into the pre-BRD template; or to run a competitor, market-sizing, PESTLE, SWOT, or RICE
  analysis, investor-style Go vs No-Go scoring, or go-to-market strategy as part of discovery. Runs
  multi-agent web research to fill the frameworks with sourced values. Arguments: [chunks|combined].
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

## Argument parsing - do this first

`pre-brd-unifier [chunks|combined]`.

| Argument | Action |
|---|---|
| `chunks` | CHUNKS mode, skip the prompt. |
| `combined` | COMBINED mode, skip the prompt. |
| (empty) | Run the interactive prompt below. |
| anything else | State valid options; treat as empty and prompt. |

**Interactive prompt (chunks is default):**

> **Output format?** [chunks / combined] - default `chunks` (press Enter to accept).

Empty / Enter / `y` / `chunks` → CHUNKS. `combined` / `c` / `single` / `one file` → COMBINED. If the user already implied a shape, do not ask.

Excel is NOT a mode. It is the on-demand step in `xlsx-export.md`, run only after the user reviews and approves the Markdown.

---

## Core principles

1. **Templates are authoritative.** `chunks/*.md` define section order and structure; never rename headings.
2. **Markdown only by default.** `.xlsx` only on explicit request after review; never `.docx`/`.pdf`.
3. **Mode is explicit** - from the argument or the prompt.
4. **Research is sourced.** Every researched figure carries a source (see `research-orchestration.md`). Unverifiable values → `[NEEDS CLARIFICATION: <question>]`. Never invent market numbers.
5. **Compute, do not hardcode.** Derived values (RICE, TAM→SAM→SOM, EFAS/IFAS weighted, Porter's averages, Tier-5 composite) come from the stated formulas in `frameworks.md`.
6. **Fill contract.** Write Answer cells only; guidance/sample content is read-only context.
7. **Coherent synthesis.** Tier-5 must follow from the tier-2/3/4 signals; do not contradict them.
8. **No duplication.** Each chunk adds only its own framework's lens. State a shared fact - UVP, revenue levers, the KPI/success-metric list, target segment, cost drivers, the phase roadmap - **once** in its home chunk and reference it elsewhere with a link (e.g. "see [01-concept-sheet.md]"), rather than restating it verbatim across 01/02/03/15/19/21. Cross-reference, do not repeat. The Product Strategy Canvas (19) in particular should point to 01/03 for shared elements and add only its strategic framing.
9. **No em dashes.** Author all output with hyphens or restructured clauses; never the em dash. (Applies to chunks, combined output, and Excel - the export engine scrubs em dashes from the workbook, including the reference template's own guidance text.)

---

## Workflow

1. **Resolve mode** (above) and **intent** - generate vs transform per `transform-detection.md`.
2. **Intake - ask at most 4 questions**, skipping anything already in context: product idea/concept; target segment/customer; geography/market footprint; currency + hard constraints.
3. **Research fan-out** per `research-orchestration.md` → a sourced research bundle.
4. **Fill the 22 framework chunks (01–22)** tier by tier from the bundle, per `frameworks.md`. Replicate per-persona blocks. Add rows for variable-row frameworks. Flag gaps with `[NEEDS CLARIFICATION: ...]`.
5. **Investor assessment pass** (dedicated investor agent) → fill `23-investor-assessment.md` (chunks) or an appended Investor Assessment section (combined). Runs first so chunk 23 exists for the reviewer to check. See "Investor assessment pass" below.
6. **Reviewer pass** (cleared-context) → `24-open-items-and-assumptions-log.md` (chunks) or an appended section (combined). Runs last and reviews **01–23** (including the investor verdict). See "Reviewer pass" below.
7. **Present** the Markdown deliverable with an inventory: chunks/sections, `[NEEDS CLARIFICATION]` count, open-items count, source count, and the investor verdict (Go / Conditional / No-Go + composite). **Stop. Do not produce Excel.**
8. **On explicit approval** ("export excel" / "looks good, generate the sheet"): run the export per `xlsx-export.md`.

### Output shapes

- **CHUNKS:** write `./pre-brd-[project-slug]/NN-*.md` using `chunks/*.md` as skeletons; regenerate `00-pre-brd-master.md` as the index.
- **COMBINED:** concatenate the same content into `./PRE-BRD-[ProjectName]-v1.1.md` with a table of contents; no chunk comment blocks.

### Investor assessment pass (mandatory) - runs first

Once the 22 framework chunks (01–22) and the Scoreboard are filled, dispatch a dedicated investor agent (`Agent`, `subagent_type: startup-business-analyst:startup-analyst`), framed as a skeptical early-stage investor, with read access to all filled chunks (01–22) including the Scoreboard. It fills `23-investor-assessment.md`: scores the seven aspects out of 10 - each with a one-line rationale citing its source chunk(s) - computes the weighted composite per `frameworks.md`, and writes a decisive **Go / No-Go** executive summary with a strong Why (top reasons, top risks, conditions to clear). It must reconcile its verdict with the mechanical Scoreboard (22): agree and reinforce, or disagree and explain. Per-aspect scores are judgment; the composite is computed, not hardcoded. The investor never edits chunks 01–22; it only authors chunk 23.

**Conditional reframe for enterprise / internal initiatives.** The `startup-analyst` persona defaults to venture-return framing (fundability, exit, pre-seed→Series A). When the pre-BRD is for an internal product, enterprise initiative, or cost-center bet rather than a fundable startup - infer this from intake (no external raise, internal sponsor/budget, B2B/internal user base) or ask if ambiguous - instruct the agent to swap the lens to a **business-case lens** while keeping the same seven aspects, weights, 0–10 scale, and verdict bands. Specifically: read "Financial viability & return" as ROI / payback / TCO vs. internal hurdle rate (not investor return or exit multiple); read "Market opportunity" as addressable internal demand or strategic value; read "Go-to-market" as adoption/rollout and change management; and frame the Why and verdict as **fund-the-initiative vs. don't** for the sponsor, never as an investment thesis. Note the active lens (venture vs. business-case) in one line at the top of chunk 23.

### Reviewer pass (cleared-context, mandatory) - runs last

Dispatch a subagent (`Agent`, `subagent_type: general-purpose`) with no authoring memory, **after** the investor pass so chunk 23 already exists. It reviews **chunks 01–23** (the whole deliverable including the investor verdict). Brief: find unsourced/shaky market numbers, competitor coverage gaps, **cross-chunk figure inconsistencies** (the same market size / CAGR / region share / customer count cited differently across 06/07/09/10/16 - these are defects, see the reconciliation rule in `research-orchestration.md`), cross-tier incoherence (do SAM/SOM, EFAS/IFAS, Porter's feed the Tier-5 scoreboard coherently? does the investor verdict in 23 cohere with the scoreboard in 22 and the underlying tiers?), and weak go/no-go logic. For each finding, follow the schema in `chunks/24-open-items-and-assumptions-log.md`: Where, Type, Concern, Options (≥2 with tradeoffs), **Recommended Answer** (the concrete resolution, ready to apply), **Why** (REQUIRED - the reason that option wins: the evidence behind it and the tradeoff accepted; never empty), Status: Open. Also fill the chunk's Assumptions Log (every material assumption with its basis and the risk if wrong). Write to the Open Items log (`24-…`, which is the reviewer's own output - do not flag 23 or 24 as "missing"). If it returns zero findings, re-dispatch with stronger adversarial framing.

---

## Output conventions

- Project slug: kebab-case from the project name.
- Chunked folder: `./pre-brd-[project-slug]/`; filenames `NN-short-title.md`.
- Combined: `./PRE-BRD-[ProjectName]-v1.1.md`. Excel: `./PRE-BRD-[ProjectName]-v1.1.xlsx`.
- Encoding UTF-8, LF. Tables are pipe-tables, no hard wrap.
- No em dashes in any output; use hyphens or restructure (see principle 9).
- No duplicated content across chunks; cross-reference shared facts with a link (see principle 8).

## Things this skill never does

- Never emits Excel from the argument or before the user approves the Markdown.
- Never overwrites guidance or READ-ONLY sample cells, or hardcodes a value where the workbook has a formula.
- Never invents market figures without a source - unverifiable → `[NEEDS CLARIFICATION]`.
- Never modifies the embedded `chunks/*.md` or `reference/PRE-BRD-v1.1.xlsx` during a run.
- Never silently drops a framework; an empty framework keeps its heading with a flagged note.

## Reference files

- `modes.md` - chunks vs combined + conversion.
- `transform-detection.md` - generate vs transform.
- `frameworks.md` - fill contract, classification, formula catalog, Tier-5 propagation.
- `research-orchestration.md` - multi-agent research playbook.
- `xlsx-export.md` - payload schema and the on-demand export procedure.
