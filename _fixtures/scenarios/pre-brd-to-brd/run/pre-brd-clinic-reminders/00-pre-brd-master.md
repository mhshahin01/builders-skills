<!--
PRE-BRD CHUNK: 00
TITLE: PRE-BRD Master Index
TIER: All tiers
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# PRE-BRD Master

A pre-BRD (pre Business Requirements Document) is the discovery layer that runs before a full BRD is authored. It validates that an idea is worth building by working through five tiers of analysis: idea definition, market and competition, prioritization, strategy and planning, and a final go / no-go synthesis.

This master indexes every framework of the Clinic Reminders pre-BRD (generated 2026-09-30, chunked mode) as a separate Markdown file. Each linked file keeps the framework definition, the section structure, and the scoring or calculation rules, with the Answer slots filled from the intake and a sourced research bundle. Unverifiable values carry the skill's clarification marker inline; shared magnitudes use the canonical figures in [07-market-sizing-analysis.md](07-market-sizing-analysis.md).

## Fill contract (for the fill-skill author)

- Every value the skill must supply lives in an empty cell of an **Answer** column (descriptive frameworks) or an empty value cell of a scoring table. Guidance / description columns are read-only context for the agent and must not be overwritten.
- Calculation rules and formulas are stated in prose inside each file. The skill computes derived cells (weighted scores, RICE scores, relative market share, composite scores) from the values it enters.
- Frameworks with a fixed row set (PESTLE, Porter's, SWOT, MoSCoW, Ansoff, Product Lifecycle) keep their rows. Frameworks with a variable row set (EFAS, IFAS, VRIO, BCG, RICE, OKRs, Market Comparison, Roadmap) ship with header-only tables; the skill adds rows.
- Per-persona frameworks (Value Proposition Canvas, Empathy Map) are filled once per persona; replicate the table block per persona.
- Files are self describing: the comment block at the top of each chunk identifies its number, title, and tier.

## How the files are organized

Filenames use a two-digit sequence so tier and reading order are preserved.

### Tier 1: Idea Definition
| # | Framework | Purpose | File |
|---|---|---|---|
| 01 | Concept Sheet | Concise statement of the core idea: what it is, the problem it solves, and for whom. Used to pitch an early proposal before a full plan or prototype. | [01-concept-sheet.md](01-concept-sheet.md) |
| 02 | Product Charter | Foundational document defining purpose, goals, scope, stakeholders, and boundaries. Aligns team and sponsors before development begins. | [02-product-charter.md](02-product-charter.md) |
| 03 | Lean Canvas | One-page business plan adapted from the Business Model Canvas for early-stage, high-uncertainty products. Focuses on problems, not features. | [03-lean-canvas.md](03-lean-canvas.md) |
| 04 | Value Proposition Canvas | Aligns the offer with customer needs across a customer profile (jobs, pains, gains) and a value map (products, pain relievers, gain creators). | [04-value-proposition-canvas.md](04-value-proposition-canvas.md) |
| 05 | Empathy Map | Captures what a user says, thinks, does, and feels to align design with real needs and pain points. | [05-empathy-map.md](05-empathy-map.md) |

### Tier 2: Market and Competition
| # | Framework | Purpose | File |
|---|---|---|---|
| 06 | Market Comparison | Compares competitor products and features (core, advanced, new) across a structured set of dimensions. | [06-market-comparison.md](06-market-comparison.md) |
| 07 | Market Sizing and Analysis | TAM, SAM, SOM sized two ways (top-down and bottom-up) and cross-checked. | [07-market-sizing-analysis.md](07-market-sizing-analysis.md) |
| 08 | PESTLE Analysis | External macro scan across Political, Economic, Social, Technological, Legal, and Environmental factors. | [08-pestle-analysis.md](08-pestle-analysis.md) |
| 09 | Porter's Five Forces | Competitive pressure assessment scored 1 (low threat) to 3 (high threat) across five forces. | [09-porters-five-forces.md](09-porters-five-forces.md) |
| 10 | EFAS | External Factors Analysis Summary: opportunities and threats, weighted and rated. | [10-efas.md](10-efas.md) |
| 11 | IFAS | Internal Factors Analysis Summary: strengths and weaknesses, weighted and rated. | [11-ifas.md](11-ifas.md) |
| 12 | SWOT | Strengths, weaknesses, opportunities, and threats consolidated. | [12-swot.md](12-swot.md) |

### Tier 3: Prioritization
| # | Framework | Purpose | File |
|---|---|---|---|
| 13 | RICE Framework | Prioritizes initiatives by Reach, Impact, Confidence, Effort. | [13-rice-framework.md](13-rice-framework.md) |
| 14 | MoSCoW Method | Categorizes requirements into Must, Should, Could, and Won't (now). | [14-moscow-method.md](14-moscow-method.md) |
| 15 | OKRs | Objectives and Key Results to align teams and measure success. | [15-okrs.md](15-okrs.md) |

### Tier 4: Strategy and Planning
| # | Framework | Purpose | File |
|---|---|---|---|
| 16 | BCG Matrix | Positions products by market growth rate and relative market share into Star, Question Mark, Cash Cow, Dog. | [16-bcg-matrix.md](16-bcg-matrix.md) |
| 17 | Ansoff Matrix | Selects a growth strategy across Market Penetration, Market Development, Product Development, Diversification. | [17-ansoff-matrix.md](17-ansoff-matrix.md) |
| 18 | VRIO | Tests resources for competitive advantage: Valuable, Rare, Inimitable, Organized to exploit. | [18-vrio.md](18-vrio.md) |
| 19 | Product Strategy Canvas | Captures the why, who, what, and how of the product to align stakeholders. | [19-product-strategy-canvas.md](19-product-strategy-canvas.md) |
| 20 | Product Lifecycle | Maps the product across Development, Introduction, Growth, Maturity, Decline. | [20-product-lifecycle.md](20-product-lifecycle.md) |
| 21 | Roadmap, Project Plan and Go-To-Market | Timeline of goals, features, dependencies, owners, and status by quarter, plus the go-to-market strategy (segment, positioning, pricing, channels, launch, CAC, KPIs). | [21-roadmap-project-plan.md](21-roadmap-project-plan.md) |

### Tier 5: Synthesis
| # | Framework | Purpose | File |
|---|---|---|---|
| 22 | Executive Summary Scoreboard | Mechanical go / no-go synthesis aggregating five signals into a single weighted composite and recommendation. | [22-executive-summary-scoreboard.md](22-executive-summary-scoreboard.md) |
| 23 | Investor Assessment | Independent investor-lens judgment: seven aspects scored out of 10, with a Go / No-Go verdict and an evidence-backed Why. | [23-investor-assessment.md](23-investor-assessment.md) |
| 24 | Open Items & Assumptions Log | Cleared-context reviewer output: every finding with Options, a Recommended Answer, and the Why behind it, plus the assumptions log (basis + risk if wrong). | [24-open-items-and-assumptions-log.md](24-open-items-and-assumptions-log.md) |
