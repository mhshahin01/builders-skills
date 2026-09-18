# Pre-BRD Unifier

The discovery and validation layer of the Product Documentation Skill Suite: it answers "is this worth building?" before any requirements are written (stage 1, Discovery). See the repo-root `README.md` for the full lifecycle.

---

## What

`pre-brd-unifier` generates, transforms, or reformats a pre-BRD: 22 analysis and market-study frameworks across five tiers, ending in a mechanical go/no-go Executive Summary Scoreboard (chunk 22) followed by an independent Investor Assessment (chunk 23) and a reviewer-authored Open Items and Assumptions Log (chunk 24). It performs the analysis (market sizing, competitor scan, macro, competitive, and internal factors) through multi-agent web research, rather than only templating it.

The five tiers:

| Tier | Chunks | Frameworks |
| ---- | ------ | ---------- |
| 1. Idea definition | 01-05 | Concept Sheet, Product Charter, Lean Canvas, Value Proposition Canvas, Empathy Map |
| 2. Market and competition | 06-12 | Market Comparison, Market Sizing, PESTLE, Porter's Five Forces, EFAS, IFAS, SWOT |
| 3. Prioritization | 13-14 | RICE, MoSCoW |
| 4. Strategy and planning | 15-21 | OKRs, BCG Matrix, Ansoff Matrix, VRIO, Product Strategy Canvas, Product Lifecycle, Roadmap and Project Plan |
| 5. Synthesis | 22 | Executive Summary Scoreboard with composite score and go/no-go thresholds |

Output is Markdown, either as a chunked folder (the default) or one combined file. A styled `.xlsx` export is produced only on explicit request, after the user approves the Markdown.

## Why

Most idea docs are static templates filled from intuition. This skill exists to make the discovery layer sourced, computed, and challenged:

- **Research is sourced, never guessed.** Six parallel research agents (one per chunk 06-11) gather market data, and every figure carries a source. Unverifiable values become `[NEEDS CLARIFICATION: <question>]`, never invented numbers.
- **Compute, do not hardcode.** RICE, TAM/SAM/SOM (with a top-down vs bottom-up cross-check), EFAS/IFAS weighted scores, Porter's averages, and the Tier-5 composite all come from stated formulas in `frameworks.md`.
- **Two independent verdicts.** The mechanical Scoreboard (22) is checked by a skeptical investor agent (23) that scores seven aspects, computes a weighted composite, and must reconcile its Go/No-Go with the Scoreboard. Enterprise and internal initiatives get a business-case lens instead of a venture lens.
- **Adversarial review built in.** A cleared-context reviewer reviews chunks 01-23, hunting unsourced numbers, cross-chunk figure inconsistencies, and weak go/no-go logic. Zero findings triggers a re-dispatch with stronger framing.
- **Coherent synthesis.** Tier 5 must follow from the tier 2/3/4 signals, and shared facts (UVP, revenue levers, target segment) are stated once in their home chunk and cross-referenced elsewhere, never restated.
- **Excel on approval only.** The export clones the embedded reference workbook (styling, sample columns, 81 live formulas) and writes Answer cells only, per a whitelisted cell map.

## How

### Usage

```text
pre-brd-unifier [chunks|combined]
```

| Argument | Action |
| -------- | ------ |
| `chunks` | CHUNKS mode: `./pre-brd-[project-slug]/` with `00-pre-brd-master.md` as the index plus `NN-*.md` per framework. |
| `combined` | COMBINED mode: one `./PRE-BRD-[ProjectName]-v1.1.md` with a table of contents. |
| (empty) | Interactive prompt for the output format; chunks is the default. |

Excel is not a mode. Say "export to Excel" after approving the Markdown to run the on-demand export in `xlsx-export.md`.

Invocation prefix depends on the agent: `/pre-brd-unifier chunks` in Claude Code, `$pre-brd-unifier chunks` in Codex, `/skill:pre-brd-unifier chunks` in Kimi Code. Or describe the task in plain words ("validate this idea with a pre-BRD") and the agent picks the skill from its description.

### The workflow

1. **Resolve mode and intent.** Chunks vs combined from the argument or prompt; generate vs transform per `transform-detection.md` (a source document means transform, an idea alone means generate).
2. **Intake.** At most four questions, skipping anything already in context: product idea, target segment, geography and market footprint, currency and hard constraints.
3. **Research fan-out.** Six parallel research subagents, one per chunk 06-11, each returning structured sourced data for its chunk only, per `research-orchestration.md`. Tiers 1, 3, and 4 are authored from intake; SWOT (12) and the Scoreboard (22) are derived in synthesis.
4. **Fill the 22 frameworks.** Tier by tier from the research bundle, using `chunks/*.md` as authoritative skeletons. Answer cells only; guidance stays read-only; gaps are flagged with `[NEEDS CLARIFICATION: ...]`.
5. **Investor assessment pass.** A dedicated skeptical-investor agent reads chunks 01-22 and authors chunk 23: seven aspects scored out of 10 with cited rationales, a computed weighted composite, and a decisive Go/No-Go reconciled with the Scoreboard.
6. **Reviewer pass.** A cleared-context reviewer reviews chunks 01-23 and writes chunk 24: findings with Where, Type, Concern, Options, a concrete Recommended Answer, a mandatory Why, and the Assumptions Log.
7. **Present and stop.** The Markdown deliverable with an inventory: chunks, clarification count, open-items count, source count, and the investor verdict. No Excel yet.
8. **Export on approval.** Only on explicit request, run the `.xlsx` export per `xlsx-export.md`.

### Outputs

- CHUNKS: `./pre-brd-[project-slug]/` containing `00-pre-brd-master.md` plus chunks `01-*.md` through `24-*.md`.
- COMBINED: `./PRE-BRD-[ProjectName]-v1.1.md` with a table of contents.
- On approval only: `./PRE-BRD-[ProjectName]-v1.1.xlsx`, cloned from the reference workbook.
- Feeds into the BRD: a validated pre-BRD supplies the problem statement, target users, market context, and prioritized scope for `brd-unifier` (stage 2, Requirements).

### Reference files

| File | Contents |
| ---- | -------- |
| `modes.md` | Chunks vs combined output shapes and cross-mode conversion |
| `transform-detection.md` | Generate vs transform intent detection and transform procedure |
| `frameworks.md` | Fill contract, framework classification, formula catalog, Tier-5 propagation |
| `research-orchestration.md` | Multi-agent research playbook: six per-chunk agents, source rules, reconciliation |
| `xlsx-export.md` | Payload schema and the on-demand Excel export procedure |
| `chunks/` | The 25 authoritative section skeletons (`00` master index, `01`-`24`) |
| `reference/` | `PRE-BRD-v1.1.xlsx` (styling and formula source) and `cell-map.json` (writable-cell whitelist) |
| `scripts/` | `export_xlsx.py` export engine, `discover_cells.py`, and tests |
