# Frameworks: Fill Contract, Classification, Formulas, Propagation

Per-framework structure and guidance live in the embedded `chunks/*.md`. This file holds the cross-cutting rules.

## Fill contract
- Fill **Answer** slots only. Guidance/description/sample text is read-only context.
- Compute derived values from the formulas below - never leave a derived cell blank when its inputs exist, and never hardcode a derived value.
- Unverifiable inputs → `[NEEDS CLARIFICATION: <question>]`.
- Market Sizing (07): the Notes / source (or Basis) cell of a row you enter is an Answer slot; add the source, year, and assumption there. A note that starts with `=` is the row's formula; keep it.

## Row behaviour (Markdown)

| Behaviour | Frameworks |
|---|---|
| Fixed rows (keep as-is) | PESTLE (08), Porter's (09), EFAS (10, exactly 5 factors), IFAS (11, exactly 4 factors), SWOT (12), MoSCoW (14), Ansoff (17), Product Lifecycle (20) |
| Variable rows (add as needed) | Market Comparison (06), Market Sizing Canonical figures (07), RICE (13), OKRs (15), BCG (16), VRIO (18), Roadmap (21) |
| Per-persona (replicate block per persona) | Value Proposition Canvas (04), Empathy Map (05) |

## Formula catalog
- **Market Sizing (07):** Regional TAM = Global × region share. Serviceable TAM = regional × % relevant. Bottom-up TAM = addressable customers × ARPU. TAM = average(top-down, bottom-up); if one estimate is more than 3 times the other, keep the average and add `[NEEDS CLARIFICATION: <both values and the question that would reconcile them>]` to the TAM value. SAM = TAM × SAM%. SOM = SAM × SOM%. Where a plan (OKRs, roadmap, go-to-market) needs the SOM as a customer count, use SOM value ÷ ARPU so the count matches the SOM value.
- **Porter's (09):** each force scored 1 (low threat) to 3 (high threat); overall = average of the five.
- **EFAS (10) / IFAS (11):** weighted = weight × rating per factor; total = sum of weighted scores. Weights within a block sum to 1.0.
- **RICE (13):** score = (Reach × Impact × Confidence) / Effort.
- **Tier-5 Executive Summary (22):** five signals (Market Attractiveness, Problem/Solution Fit, Feasibility, Competitive Risk, Strategic Fit), each scored 1 to 5 by the mapping in the propagation map below, rounded to one decimal, with weight 0.2; composite = Σ(score × weight), rounded to two decimals; recommendation derived from the composite band. The reference workbook's scoreboard uses the same mapping. Competitive Risk is inverted from Porter's threat (higher threat → lower score).
- **Investor Assessment (23):** seven aspects scored 0–10 by judgment from the source chunks (not derived from a single framework). Weights: Market opportunity 0.20, Problem/solution fit 0.15, Moat 0.15, Business model & economics 0.15, Go-to-market 0.10, Team & execution 0.10, Financial/return 0.15 (sum 1.0). Composite = Σ(score × weight); verdict bands Go ≥ 7.0, Conditional 5.0–6.9, No-Go < 5.0. The composite weighted average is computed; the per-aspect scores are the investor agent's judgment, each cited to its source chunk.

## Tier-5 propagation map (keep signals coherent)
| Tier-5 signal | Source | Score (1 to 5) |
|---|---|---|
| Market Attractiveness | SAM value from 07, in USD | USD 500M or more = 5; USD 100M or more = 4; USD 25M or more = 3; USD 5M or more = 2; below USD 5M = 1. Convert a SAM in another currency at the canonical exchange rate in 07. |
| Problem / Solution Fit | EFAS opportunity rating (10) | Weighted average rating of the opportunity (O) rows: Σ their weighted scores ÷ Σ their weights. |
| Feasibility | IFAS strength rating (11) | Weighted average rating of the strength (S) rows: Σ their weighted scores ÷ Σ their weights. |
| Competitive Risk | Porter's threat (09), inverted | 7 - 2 × Porter's average (1 gives 5, 2 gives 3, 3 gives 1). |
| Strategic Fit | EFAS total (10) + IFAS total (11) | (EFAS total + IFAS total) ÷ 2. |

When filling 22, derive each signal from its source framework. If a source is missing or flagged, the corresponding Tier-5 signal inherits a `[NEEDS CLARIFICATION]`. If the EFAS opportunity weights or IFAS strength weights sum to zero, flag that signal `[NEEDS CLARIFICATION: the selected factors have zero total weight]`. Do not calculate its score or the composite until the source weights give that average a nonzero denominator.

## Markdown vs Excel row behaviour (important)
The row behaviour table above governs the **Markdown** output, where a variable-row framework may grow freely. The **Excel export** is more constrained - the reference workbook has fixed cross-sheet ranges and READ-ONLY sample blocks that row insertion can break. Therefore on export:
- **EFAS (10), IFAS (11), and VRIO (18) are fixed-row** - the export never inserts rows. EFAS and IFAS hold exactly 5 and 4 factors in the Markdown too, so they fill the sheet's rows exactly (EFAS rows 2 to 6, IFAS rows 2 to 5), and the scoreboard reads the opportunity and strength rows by the Type column. VRIO has formulas in its sample block below the data; keep its highest-priority items in the sheet and note overflow in the Open Items log.
- **RICE (13) is a single initiative in Excel** - the sheet has one editable column (D4:D7); columns E/F/G are READ-ONLY sample features. Additional RICE initiatives live in the Markdown and are noted as overflow.
- **Market Comparison (06) is fixed-cell** (answer blocks with set capacity). **BCG (16), OKRs (15), Roadmap (21)** can extend via `needed_rows`. All fill the provided rows first; overflow is noted. See `xlsx-export.md`.
