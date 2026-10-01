<!--
PRE-BRD CHUNK: 22
TITLE: Executive Summary Scoreboard
TIER: Tier 5: Synthesis
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# Executive Summary Scoreboard

A go / no-go synthesis. It aggregates five signals (market attractiveness, problem / solution fit, feasibility, competitive risk, strategic fit) from the analysis tiers above into a single weighted composite and a recommendation. Generate it only after its dependencies are filled.

## Dependencies to verify before scoring

| Dependency | Source file | Ready? |
|---|---|---|
| Product name | 01 Concept Sheet / 02 Product Charter | Yes: Clinic Reminders |
| Market Sizing (SAM / SOM) | 07 Market Sizing and Analysis | Yes: SAM EGP 18.09M, SOM EGP 0.90M a year (one open input: the Giza clinic count) |
| EFAS ratings & weights | 10 EFAS | Yes: 8 factors, weights sum to 1.00 |
| IFAS ratings & weights | 11 IFAS | Yes: 8 factors, weights sum to 1.00 |
| Porter's threat levels | 09 Porter's Five Forces | Yes: 5 forces scored, average 3.0 |

## Method

Each score is derived from the analysis files (not entered by hand). Scale is 1 to 5: 5 = strong / favorable, 1 = weak / unfavorable. Competitive Risk is inverted (high threat maps to a low score). Composite = sum of (score x weight). Verdict thresholds: 4.0 and above = Go; 3.0 to 3.99 = Conditional Go; below 3.0 = No-Go. Weights must sum to 1. End with a one-line **sensitivity check**: state whether a single ±1 notch on any one signal would flip the verdict band, so the recommendation's robustness (or fragility) is visible rather than implied by suspiciously tidy scores.

## Scoreboard

| Signal dimension | Source signal | Score (1 to 5) | Weight | Weighted | Rationale |
|---|---|---|---|---|---|
| Market Attractiveness | Market Sizing (SAM / SOM) | 1.5 | 0.2 | 0.300 | From [07-market-sizing-analysis.md](07-market-sizing-analysis.md): SOM EGP 0.90M a year against the EGP 2,000,000 first-year cost cap = 0.45x. Bands: below 0.5x = 1, 0.5 to 1.0x = 2, 1.0 to 1.5x = 3, 1.5 to 3.0x = 4, 3.0x or more = 5; plus 0.5 when category growth is 10% or more (12.9%). Score = 1 + 0.5 = 1.5. Even full capture of SAM (EGP 18.09M a year) is a small pool. |
| Problem / Solution Fit | EFAS opportunity strength | 3.85 | 0.2 | 0.770 | From [10-efas.md](10-efas.md): weighted-average opportunity rating = sum of opportunity weighted scores / sum of opportunity weights = 2.00 / 0.52 = 3.85. Strong evidence for the problem (O1) and the mechanism (O2); no local baseline yet. |
| Feasibility | IFAS strength rating | 2.52 | 0.2 | 0.504 | From [11-ifas.md](11-ifas.md): IFAS total weighted score on the 1 to 5 performance scale = 2.52, below the 3.0 midpoint: no sales or DPO capability, and a budget that fits only at median developer pay. |
| Competitive Risk | Porter's threat (inverted) | 1.0 | 0.2 | 0.200 | From [09-porters-five-forces.md](09-porters-five-forces.md): average threat 3.0 on the 1 to 3 scale, mapped linearly to the inverted 1 to 5 score: 5 - 2 x (3.0 - 1) = 1.0. All five forces are high. |
| Strategic Fit | EFAS + IFAS blended (VRIO context) | 2.70 | 0.2 | 0.540 | 3 + EFAS net + IFAS net. EFAS net = opportunity weighted sum - threat weighted sum = 2.00 - 1.82 = +0.18 (10); IFAS net = IFAS total - 3.0 midpoint = 2.52 - 3.0 = -0.48 (11); 3 + 0.18 - 0.48 = 2.70. VRIO context: every differentiator is a temporary advantage and sales reach is a disadvantage ([18-vrio.md](18-vrio.md)). |
| **Composite** |  |  | **1.0** | 2.314 | Weights sum to 100% |

## Result

| Composite score | Recommendation |
|---|---|
| 2.31 | No-Go (below 3.0) as scoped: a Greater Cairo reminder product for small clinics. Sensitivity check: a single ±1 notch on any one signal moves the composite by ±0.20 (at most to 2.51), so no single change flips the band; reaching Conditional Go (3.0) needs +0.69, about 3.5 notches across signals. The verdict is robust, not fragile. |

## Conditions to resolve before full commitment

Add prioritized conditions derived from the weakest signals (for example: thin competitive moat per VRIO, modest market ceiling per Market Sizing, prioritization inputs not yet populated per RICE).

| # | Condition | Source signal |
|---|---|---|
| 1 | Show a path to a venture-scale market: the SOM (EGP 0.90M a year by 2029-09-30) is below the first-year cost base, so widen the serviceable market (more specialties, governorates, or countries) or raise ARPU through product development, with sized numbers, before full commitment. | Market Attractiveness (07, 17) |
| 2 | Build a defensible position: all five forces are high and every differentiator can be copied in 1 to 8 developer-weeks; prove waitlist-refill demand in the pilot (RICE 2.86, the lowest Must-have) and start the cross-clinic no-show dataset. | Competitive Risk (09, 18, 13) |
| 3 | Close the team and budget gaps: name a product and sales owner, appoint a DPO, settle founder pay, and incorporate in Egypt. | Feasibility (11) |
| 4 | Validate locally before scaling: measure the baseline no-show rate and willingness to pay in Greater Cairo clinics during discovery and the pilot. | Strategic Fit, Problem / Solution Fit (10) |
| 5 | Confirm the PDPL licence type, consent form, and data residency with counsel before the first patient message. | Strategic Fit, Feasibility (08, 10 T2, 11 W2) |

## Sources

Market Sizing (SAM / SOM), EFAS (opportunities), IFAS (strengths), Porter's Five Forces, VRIO / SWOT. Update any source file and regenerate this scoreboard.
