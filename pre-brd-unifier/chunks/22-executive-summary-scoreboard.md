<!--
PRE-BRD CHUNK: 22
TITLE: Executive Summary Scoreboard
TIER: Tier 5: Synthesis
PART OF: PRE-BRD Master
-->

# Executive Summary Scoreboard

A go / no-go synthesis. It aggregates five signals (market attractiveness, problem / solution fit, feasibility, competitive risk, strategic fit) from the tier 2 analyses (07, 09, 10, 11) into a single weighted composite and a recommendation. Generate it only after its dependencies are filled.

## Dependencies to verify before scoring

| Dependency | Source file | Ready? |
|---|---|---|
| Product name | 01 Concept Sheet / 02 Product Charter |  |
| Market Sizing (SAM / SOM) | 07 Market Sizing and Analysis |  |
| EFAS ratings & weights | 10 EFAS |  |
| IFAS ratings & weights | 11 IFAS |  |
| Porter's threat levels | 09 Porter's Five Forces |  |

## Method

Each score is derived from the analysis files (not entered by hand), with the mapping below; the Excel scoreboard uses the same mapping. Scale is 1 to 5: 5 = strong / favorable, 1 = weak / unfavorable. Round each score to one decimal.

- Market Attractiveness: the SAM value from 07, in USD (convert a SAM in another currency at the canonical exchange rate in 07). USD 500M or more = 5; USD 100M or more = 4; USD 25M or more = 3; USD 5M or more = 2; below USD 5M = 1.
- Problem / Solution Fit: the weighted average rating of the EFAS opportunity rows = sum of their weighted scores / sum of their weights.
- Feasibility: the weighted average rating of the IFAS strength rows = sum of their weighted scores / sum of their weights.

If the opportunity weights or strength weights sum to zero, flag that signal `[NEEDS CLARIFICATION: the selected factors have zero total weight]`. Leave its score and the composite unresolved until the source weights give that average a nonzero denominator.
- Competitive Risk: 7 - 2 x Porter's average threat (1 gives 5, 2 gives 3, 3 gives 1). It is inverted: high threat maps to a low score.
- Strategic Fit: (EFAS total + IFAS total) / 2.

Composite = sum of (score x weight), rounded to two decimals. Verdict thresholds: 4.0 and above = Go; 3.0 to 3.99 = Conditional Go; below 3.0 = No-Go. Weights must sum to 1. End with a one-line **sensitivity check**: state whether a single ±1 notch on any one signal would flip the verdict band, so the recommendation's robustness (or fragility) is visible rather than implied by suspiciously tidy scores.

## Scoreboard

| Signal dimension | Source signal | Score (1 to 5) | Weight | Weighted | Rationale |
|---|---|---|---|---|---|
| Market Attractiveness | Market Sizing (SAM value, in USD) |  | 0.2 |  |  |
| Problem / Solution Fit | EFAS opportunity rating |  | 0.2 |  |  |
| Feasibility | IFAS strength rating |  | 0.2 |  |  |
| Competitive Risk | Porter's threat (inverted) |  | 0.2 |  |  |
| Strategic Fit | EFAS and IFAS totals, averaged (VRIO context) |  | 0.2 |  |  |
| **Composite** |  |  | **1.0** |  | Weights sum to 100% |

## Result

| Composite score | Recommendation |
|---|---|
|  |  |

## Conditions to resolve before full commitment

Add prioritized conditions derived from the weakest signals. Condition 1 is always the lowest-scoring signal (the first in table order on a tie), with its score and rationale: the Excel writes that one itself. Later conditions add the next ones (for example: thin competitive moat per VRIO, modest market ceiling per Market Sizing, prioritization inputs not yet populated per RICE).

| # | Condition | Source signal |
|---|---|---|
|  |  |  |

## Sources

Market Sizing (SAM / SOM), EFAS (opportunities), IFAS (strengths), Porter's Five Forces, VRIO / SWOT. Update any source file and regenerate this scoreboard.
