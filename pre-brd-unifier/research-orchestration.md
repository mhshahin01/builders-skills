# Research Orchestration: One Agent Per Research Chunk

Fill the analysis-heavy frameworks with sourced findings by fanning out **one independent research subagent per research chunk** via the **Agent tool** (parallel, dispatched in a single message). Each agent owns exactly one chunk, returns structured sourced data for that chunk only, and is blind to the others. A single-threaded synthesis step then writes the consolidating chunks (12 SWOT, 22 scoreboard) and propagates shared values.

Only chunks **06–11** do independent web research, so only they get an agent; a light run has no 08 agent (`SKILL.md` § Light run). Chunk 12 (SWOT) and chunk 22 (Tier-5 scoreboard) are **not** agents - they are derived in synthesis from upstream chunks. Tiers 1, 3, 4 (chunks 01–05, 13–21) are authored from intake, not research.

## Per-chunk research agents (six, run concurrently)

1. **Chunk 06 - Competitor scan + feature comparison.** Identify the top 5 competing products. For each: provider, best-for, key features, pricing model, weaknesses, positioning, tech stack. Then build the **feature comparison matrix**: enumerate the relevant feature set as rows and mark each feature **Available / Not available** per competitor across the columns. The feature-by-feature comparison across competitors is required, not optional.
2. **Chunk 07 - Market sizing.** Size TAM/SAM/SOM both ways. Top-down: global market → region share → % relevant to segment. Bottom-up: addressable customers × ARPU. Return every figure with a source and the assumption behind it.
3. **Chunk 08 - PESTLE.** Political, Economic, Social, Technological, Legal, Environmental factors, each with a sourced rationale.
4. **Chunk 09 - Porter's Five Forces.** Each force scored 1–3 with a one-line rationale.
5. **Chunk 10 - EFAS.** Exactly 5 external factors (opportunities + threats, at least one opportunity), each with a weight from 0 to 1 (weights sum to 1.0) and a rating from 1 to 5 for how well the product's strategy responds to it.
6. **Chunk 11 - IFAS.** Exactly 4 internal factors (strengths + weaknesses, at least one strength), each with a weight from 0 to 1 (weights sum to 1.0) and a rating from 1 to 5 for internal performance. The internal facts (team, budget, assets, capabilities) come from the intake, not the web; research only the benchmarks that rate them (for example typical build cost, salaries, or compliance effort). An internal fact the intake does not give gets `[NEEDS CLARIFICATION: <question>]`.

Each agent's prompt must name its single target chunk and return only that chunk's Answer slots. Do not let an agent author or speculate about another chunk's content.

## Source rules
- Acceptable sources: industry reports (Statista, Gartner, IBISWorld), Crunchbase/PitchBook, Google Trends/Keyword Planner, government statistics portals, vendor sites for competitor facts.
- Every numeric claim cites a source. No source and not derivable → `[NEEDS CLARIFICATION: <question>]`, never a guessed number.
- Prefer recent data; record the year of each figure.
- Cite each source inline as a Markdown link with its year, in the cell that holds the figure (or the table's Notes / source or Comments cell).

## Output schema per agent
Return JSON-like structured text: the framework's Answer slots, each with `value`, `source`, `year`, and `assumption` (where relevant). The synthesis step maps these into the chunk tables and computes derived values per `frameworks.md`.

**Label the scope of every magnitude.** Each agent works blind to the others, so the same pool gets sized differently unless scoped. Every market size, CAGR, region/market share, and customer/unit count must carry an explicit scope label and year - e.g. "global all-asset PM software, 2024" vs "US residential community / HOA & condo software, 2024" vs "global proptech, 2024". An unlabelled magnitude is incomplete output.

## Synthesis and propagation (single-threaded, after all agents return)
This step runs in the main context, not as an agent, so cross-chunk coherence is preserved:
1. **Reconcile shared figures first.** Any magnitude cited by more than one chunk - market size, CAGR, region/market share, customer or unit counts - MUST resolve to a **single canonical value with one explicit scope label and year**, used identically everywhere it appears (06, 07, 09, 10, 16, 22). Different agents will return different numbers because they chose different scopes; pick the narrowest defensible scope for the product, state it once in the Canonical figures table in 07, and make every chunk agree. Where a chunk legitimately needs a different scope (e.g. Porter's rivalry sized on the broad market), keep the number but label the scope so it is visibly a different pool, not a contradiction. Divergent numbers for the same pool are a defect the reviewer will flag.
2. Write chunks 06–11 from each agent's returned bundle, applying the reconciled canonical figures.
3. Compute derived totals: Porter's average (from 09), EFAS/IFAS weighted sums (from 10, 11).
4. **Consolidate chunk 12 (SWOT)** from the EFAS (10) and IFAS (11) outputs - SWOT is derived here, never fetched by an agent.
5. Carry the propagation map in `frameworks.md` into the **Tier-5 Executive Summary (22)**. Its five signals come from tier 2 only (07, 09, 10, 11), and nothing in 22 may contradict chunks 01-21.

Tiers 1, 3, 4 are authored from intake + the research bundle (they are framing/prioritization, not new web research).

## Optional accelerator
The same playbook can run under the Workflow tool for heavier deterministic pipelines, but only when the user explicitly opts into multi-agent orchestration. Default is Agent-tool fan-out.
