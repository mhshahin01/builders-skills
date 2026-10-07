# Triage: pre-brd

## Summary

Scope: P1 to P14 from `_fixtures/notes/step3-findings.md` § "3a pre-BRD stage (agent report, 84 min)". No file under `pre-brd-unifier/` has changed since 4b90ff9, and the step 3 run's base (057f137) already included that commit. The run therefore saw the current text, and later work fixed none of the findings. P8 is split into P8a (D) and P8b (S) so the S part can be applied now.

- Items: 15 (P1 to P14, with P8 split).
- Status: Present 15. Fixed 0. Partly fixed 0. Not reproducible 0. Not a skill issue 0.
- Class: M 2 (P1, P5). S 8 (P4, P7, P8b, P9, P10, P11, P12, P14). D 5 (P2, P3, P6, P8a, P13).
- New items: 3 (N-1 M, N-2 D, N-3 D).
- D items:
  - P2: the Markdown never defines the Tier-5 signal mappings. The workbook does, but its Competitive Risk formula gives 0 to 4 and its SAM thresholds assume USD. Recommend: write the workbook mappings into frameworks.md and chunk 22, use 7 - 2 x average, and grade SAM in USD.
  - P3: a strong threat raises the EFAS total, which pushes Strategic Fit the wrong way. Recommend: rate every EFAS factor by how well the product responds to it.
  - P6: chunk 00 is written for a template author, so "regenerate as the index" has nothing to fill. Recommend: make chunk 00 true for a filled deliverable, drop its duplicate fill contract, and say "copy".
  - P8a: research-orchestration asks for a canonical-figures note in 07 that the template has no slot for. Recommend: add a Canonical figures table to the 07 skeleton.
  - P13: the Excel scoreboard reads EFAS and IFAS rows by position, needs exactly 5 and 4 rows, and never rescales weights. A longer Markdown block therefore gives a different Excel verdict. Recommend: fix EFAS at 5 and IFAS at 4 factors, and have the workbook read O and S rows by type.
  - N-2: the Excel export drops the chunk 06 competitor columns (names, Available / Not available). Recommend: whitelist those cells.
  - N-3: the exported workbook keeps the EventHive example text (Market Sizing labels and notes, Executive Summary rationales and conditions). Recommend: make the workbook generic and map the rationale and condition cells.
- Decide P2, P3, and P13 together: they share chunk 22, frameworks.md, and the workbook's Executive Summary formulas.
- Line endings: most target files are CRLF in the working tree (`core.autocrlf=true`); `chunks/23-investor-assessment.md` and `pre-brd-unifier/README.md` are LF. Every M and S edit below changes text inside one line; insertions name the line they follow.

## Items

### P1: Investor and reviewer order contradicts itself in chunk 23
- Status: Present.
- Evidence:
  - `pre-brd-unifier/chunks/23-investor-assessment.md:10` "It is authored by a dedicated investor agent after all other chunks (including 22) are filled and the reviewer pass is complete."
  - Every other source says investor first: `pre-brd-unifier/SKILL.md:80` "Runs first so chunk 23 exists for the reviewer to check."; `SKILL.md:81` "Runs last and reviews **01–23** (including the investor verdict)."; `SKILL.md:90` "### Investor assessment pass (mandatory) - runs first"; `chunks/24-open-items-and-assumptions-log.md:6` "runs LAST, after the investor pass, reviewing chunks 01-23"; `pre-brd-unifier/README.md:58-59`; root `README.md:221` "chunk 24 is written last by a cleared-context reviewer over 01-23".
  - The step 3 run copied the wrong sentence into its deliverable (`_fixtures/scenarios/pre-brd-to-brd/run/pre-brd-clinic-reminders/23-investor-assessment.md:11`).
- Class: M (chunk 23 is the only outlier; both texts date from 7dff06b).
- Fix: `pre-brd-unifier/chunks/23-investor-assessment.md` / current: "It is authored by a dedicated investor agent after all other chunks (including 22) are filled and the reviewer pass is complete." / new: "It is authored by a dedicated investor agent after chunks 01 to 22 are filled. The reviewer pass runs after it and reviews this chunk with the rest."
- Files: `pre-brd-unifier/chunks/23-investor-assessment.md`.

### P2: Tier-5 scoreboard mappings are undefined
- Status: Present.
- Evidence:
  - `pre-brd-unifier/frameworks.md:23` "each scored 1–5 with weight 0.2; composite = Σ(score × weight); recommendation derived from the composite band. Competitive Risk is inverted from Porter's threat (higher threat → lower score)." Nothing maps a SAM in currency, or a Porter's average on 1 to 3, to a 1 to 5 score.
  - `frameworks.md:29` "| Market Attractiveness | SAM/SOM from 07 |"; `frameworks.md:33` "| Strategic Fit | EFAS net (10) + IFAS net (11) |" ("net" is undefined); `chunks/22-executive-summary-scoreboard.md:34` "| Strategic Fit | EFAS + IFAS blended (VRIO context) |".
  - The reference workbook (`SKILL.md:19`: "the authoritative styling + formula source") does define them, on sheet Executive Summary:
    - D17 grades the SAM value ('Market Sizing & analysis'!B27): 500,000,000 or more = 5, 100,000,000 or more = 4, 25,000,000 or more = 3, 5,000,000 or more = 2, else 1. Label C17 formats the SAM in "$".
    - D18 "ROUND(SUM(EFAS!F2:F4)/SUM(EFAS!D2:D4),1)" and D19 "ROUND(SUM('IFAS '!F2:F4)/SUM('IFAS '!D2:D4),1)".
    - D20 "ROUND(6-2*'Porter''s Five Forces'!D7,1)" and D21 "ROUND((SUM(EFAS!F2:F6)+SUM('IFAS '!F2:F5))/2,1)".
    - The composite is rounded to 2 decimals. Decimals are therefore allowed: one per signal.
  - The workbook has two defects of its own:
    - D20 maps a 1 to 3 threat average to 4 to 0. That is outside the 1 to 5 scale its own Method text states (B31 "Scale 1-5").
    - D17's thresholds are USD amounts, but it grades the SAM in whatever currency the payload uses.
  - The step 3 run invented its own mappings: SOM against a cost cap, "5 - 2 x (3.0 - 1)", "3 + EFAS net + IFAS net", and the IFAS total instead of strengths for Feasibility. Its chunk 22 cannot match the Excel scoreboard.
- Class: D (scoring and verdict logic).
- Options:
  - A. Write the workbook's mappings into frameworks.md and chunk 22 so the Markdown and Excel compute the same scores, with two corrections in both:
    - Competitive Risk = 7 - 2 x Porter's average (1 gives 5, 2 gives 3, 3 gives 1).
    - SAM is graded in USD: convert it at the canonical rate in 07, and the Excel payload enters the Market Sizing money values (global market, ARPU) in USD.
    - The other signals follow the workbook: Problem / Solution Fit and Feasibility are the weighted average ratings of the O rows and the S rows, and Strategic Fit = (EFAS total + IFAS total) / 2. Signals take one decimal, the composite two.
    - Tradeoff: one workbook edit (D20); for a non-USD pre-BRD, the Excel shows USD where the Markdown shows the local currency.
  - B. Write the workbook's mappings exactly as they are (6 - 2 x average, thresholds applied to the raw currency). Tradeoff: no workbook edit, but a high-threat market scores 0 on a 1 to 5 scale and a non-USD SAM is graded on the wrong scale.
  - C. Define mappings for the Markdown only (the run's style, for example the SOM against a stated cost hurdle) and declare the Markdown scoreboard authoritative. Tradeoff: on the same data, the Excel scoreboard can disagree with chunk 22.
  - D. Redesign both: relative market thresholds and a net-based Strategic Fit, in the Markdown and the workbook. Tradeoff: the largest change, with new workbook formulas and tests.
- Recommendation: A. One written mapping drives both outputs, and it fixes the two workbook defects with the smallest change.
- Files: `pre-brd-unifier/frameworks.md` (line 23, propagation map lines 29 to 33), `pre-brd-unifier/chunks/22-executive-summary-scoreboard.md` (Method line 24, Source signal cells on lines 30 and 34), `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx` (Executive Summary D20), `pre-brd-unifier/xlsx-export.md` (payload note: Market Sizing money values in USD). Decide with P3 and P13.

### P3: EFAS and IFAS ratings mean different things, and the EFAS total mixes opportunities and threats
- Status: Present.
- Evidence:
  - `pre-brd-unifier/chunks/10-efas.md:16` "- Rating: how strong the factor is or how likely it is to occur, from 1 (poor / weak) to 5 (strong)."
  - `pre-brd-unifier/chunks/11-ifas.md:16` "- Rating: internal performance on this factor, from 1 (poor / weak) to 5 (strong)."
  - `chunks/10-efas.md:18` "- Total score = sum of all weighted scores."; `frameworks.md:21` "total = sum of weighted scores".
  - The EFAS total feeds Strategic Fit (`frameworks.md:33`; workbook Executive Summary D21 averages the EFAS and IFAS totals). Under the chunk 10 meaning, a strong or likely threat gets a high rating. So a worse threat raises the EFAS total and the Strategic Fit score. IFAS has no such inversion: a weak area gets a low performance rating.
  - The workbook's own example rates threats by how favourable they are, not by strength: EFAS B5 "Competition from established SaaS providers", comment G5 "Strong competition from known brands", rating E5 = 2.
- Class: D (scoring logic).
- Options:
  - A. Rate every EFAS factor by how well the product's strategy responds to it (1 = poor response, 5 = strong response). This is the classic EFAS rating.
    - Both totals then read "higher is better", and Strategic Fit stays an average of the totals.
    - Problem / Solution Fit becomes "how well we capture the opportunities".
    - Tradeoff: the opportunity rating no longer measures how big an opportunity is (chunk 07 already does that).
  - B. Keep the strength meaning and invert threats in the total (6 - rating for T rows). Tradeoff: the workbook's F = D x E formulas cannot express this without a per-row workbook change.
  - C. Keep the meanings and define Strategic Fit on nets (opportunities minus threats, strengths minus weaknesses), as "EFAS net" hints. Tradeoff: it needs a mapping from net to 1 to 5 and a new D21 formula.
- Recommendation: A. It gives both blocks one meaning with no formula change, and it matches how the workbook's own example rates threats.
- Files: `pre-brd-unifier/chunks/10-efas.md` (line 16), `pre-brd-unifier/research-orchestration.md` (line 13), `pre-brd-unifier/frameworks.md` (line 30: "EFAS opportunity strength" becomes "EFAS opportunity rating"), `pre-brd-unifier/chunks/22-executive-summary-scoreboard.md` (line 31, same label). Optional: the workbook's EFAS guidance cell E12 and its Executive Summary label C18. Decide with P2 and P13.

### P4: TAM scope, divergent estimates, and the SOM for plans (chunk 07)
- Status: Present.
- Evidence:
  - `pre-brd-unifier/chunks/07-market-sizing-analysis.md:16` "| TAM (Total Addressable Market) | The total demand for the product globally. |  |". The same chunk computes a TAM for one segment in one region:
    - `:26` "| Regional market (TAM, all segments) |  | = Global x region share |"
    - `:28` "| Serviceable TAM (segment, region) |"
    - `:44` "| TAM |  | Average of top-down and bottom-up |"
  - `pre-brd-unifier/frameworks.md:19` agrees with the computation: "Regional TAM = Global × region share. Serviceable TAM = regional × % relevant. Bottom-up TAM = addressable customers × ARPU. TAM = average(top-down, bottom-up)."
  - No rule covers two estimates that diverge. The run averaged EGP 7.54M and EGP 121.69M (about 16x apart) into EGP 64.62M.
  - No rule says which SOM a plan uses. The run's SOM value gave about 116 clinics (SOM ÷ ARPU), while SOM % x SAM clinics gave 218.
- Class: S. The TAM wording on its own is M: the formulas are the rule the rest of the skill follows. The divergence flag and the customer-count rule are low-impact clarifications, and they keep the workbook's AVERAGE formula.
- Fix:
  - `pre-brd-unifier/chunks/07-market-sizing-analysis.md` / current: "The total demand for the product globally." / new: "The total demand for the product in the target segment and region, as sized in sections 1 to 3."
  - `pre-brd-unifier/frameworks.md` / current: "TAM = average(top-down, bottom-up). SAM = TAM × SAM%. SOM = SAM × SOM%." / new: "TAM = average(top-down, bottom-up); if one estimate is more than 3 times the other, keep the average and add `[NEEDS CLARIFICATION: <both values and the question that would reconcile them>]` to the TAM value. SAM = TAM × SAM%. SOM = SAM × SOM%. Where a plan (OKRs, roadmap, go-to-market) needs the SOM as a customer count, use SOM value ÷ ARPU so the count matches the SOM value."
  - Recommended for the divergence: flag it, do not replace the average.
    - This keeps the workbook formula 'Market Sizing & analysis'!B25 "=AVERAGE(B15,B22)", so the Excel agrees.
    - A gap above 3x usually means the two methods sized different pools.
    - Rejected: switching to the bottom-up or the lower figure. Excel would disagree, and the export may not write a formula cell.
- Files: `pre-brd-unifier/chunks/07-market-sizing-analysis.md`, `pre-brd-unifier/frameworks.md`. Optional: the workbook's read-only guidance cell 'Market Sizing & analysis'!E4 still says "globally".

### P5: The comment block in modes.md differs from the skeletons
- Status: Present.
- Evidence:
  - `pre-brd-unifier/modes.md:16-17` "PROJECT: [Project Name]" / "PART OF: PRE-BRD - [Project Name]".
  - Every skeleton instead has "PART OF: PRE-BRD Master" and no PROJECT line (for example `chunks/07-market-sizing-analysis.md:5`).
  - The run followed modes.md. brd-unifier uses the modes.md form both in its modes.md and in its skeletons (`brd-unifier/modes.md:49`, `brd-unifier/chunks/01-executive-summary-and-context.md:4`).
- Class: M. modes.md defines the output and matches the suite convention; it only needs to say that the skeleton's line is replaced.
- Fix: `pre-brd-unifier/modes.md` / current: "Each chunk keeps its self-describing comment block:" / new: "Each chunk keeps its self-describing comment block; in the output, add the `PROJECT:` line and set `PART OF:` to the project (the skeletons carry `PART OF: PRE-BRD Master` as a placeholder):"
- Files: `pre-brd-unifier/modes.md`.

### P6: "Regenerate the master as the index", but chunk 00 has no slots
- Status: Present.
- Evidence:
  - `pre-brd-unifier/SKILL.md:87` "regenerate `00-pre-brd-master.md` as the index."
  - `pre-brd-unifier/chunks/00-pre-brd-master.md:12` "Each linked file is a blank, fill-ready template: it keeps the framework definition, the section structure, and any scoring or calculation rules, but carries no sample values. A separate fill-skill is responsible for populating the answer slots."
  - `:14` "## Fill contract (for the fill-skill author)".
  - The skeleton has no Answer slots, and its text is false in a filled deliverable. The run kept the fill-contract section and rewrote line 12 by hand.
- Class: D (the master's section structure and content).
- Options:
  - A. Make the skeleton true for a deliverable:
    - Line 12 becomes "This master indexes every framework in the pre-BRD as a separate Markdown file. Each linked file keeps the framework definition, the section structure, and the scoring or calculation rules, with its Answer slots filled."
    - Delete the "Fill contract (for the fill-skill author)" section (lines 14 to 21). `frameworks.md` § Fill contract and § Row behaviour already hold it.
    - `SKILL.md:87` becomes "copy `chunks/00-pre-brd-master.md` as the index; it has no Answer slots, so only its comment block changes (see `modes.md`)".
    - Tradeoff: the master stays a static index, with no status at a glance.
  - B. A, plus a short Status section: project, date, mode, links to the 22 and 23 verdicts, and the step 7 counts. Tradeoff: one more place to refresh, and the counts go stale after edits.
  - C. Keep the skeleton and list in SKILL.md which passages each run rewrites. Tradeoff: every run rewrites template text, so the outputs vary (as in step 3).
- Recommendation: A. It is the smallest change, and each fact keeps one home (the verdicts stay in 22 and 23).
- Files: `pre-brd-unifier/chunks/00-pre-brd-master.md`, `pre-brd-unifier/SKILL.md`.

### P7: The source count has no defined presentation or count
- Status: Present.
- Evidence:
  - `pre-brd-unifier/SKILL.md:82` "inventory: chunks/sections, `[NEEDS CLARIFICATION]` count, open-items count, source count, and the investor verdict".
  - No chunk has a sources slot. `research-orchestration.md:20-21` require a source and a year for each figure, but not where or how to cite them.
  - The run counted "131 source URLs in 06-11".
- Class: S. Recommended: cite inline as Markdown links in the figure's cell, and count distinct links. This matches what the run did and needs no template change.
- Fix:
  - `pre-brd-unifier/research-orchestration.md` / current: "- Prefer recent data; record the year of each figure." / new: the same line, then a new line "- Cite each source inline as a Markdown link with its year, in the cell that holds the figure (or the table's Notes / source or Comments cell)."
  - `pre-brd-unifier/SKILL.md` / current: "open-items count, source count, and the investor verdict" / new: "open-items count, source count (distinct source links cited across the chunks), and the investor verdict"
- Files: `pre-brd-unifier/research-orchestration.md`, `pre-brd-unifier/SKILL.md`.

### P8a: The canonical-figures note in 07 has no slot
- Status: Present.
- Evidence:
  - `pre-brd-unifier/research-orchestration.md:30` "pick the narrowest defensible scope for the product, state it once, and make every chunk agree (a "Definitions / canonical figures" note in 07 is a good home)".
  - Against: `SKILL.md:67` "Write Answer cells only; guidance/sample content is read-only context."; `frameworks.md:6` "Fill **Answer** slots only."
  - Chunk 07 has no slot for such a note. The run added its own "Canonical figures" table under Definitions.
- Class: D (a template table's shape).
- Options:
  - A. Add a "Canonical figures" section to the 07 skeleton after Definitions:
    - A header-only table (Figure | Value | Scope and year | Source) and one line: "Shared magnitudes cited by more than one chunk. Other chunks use these values and link here."
    - research-orchestration line 30 points to it, frameworks.md lists it as variable rows, and xlsx-export.md lists it as Markdown-only.
    - Tradeoff: the template grows by one table that the Excel does not carry.
  - B. No register:
    - Each canonical value lives in the 07 cell that already holds it.
    - A magnitude 07 has no row for (exchange rate, population) is stated once in the first chunk that uses it and linked from the others.
    - Only research-orchestration line 30 changes.
    - Tradeoff: the reviewer has no single table to check shared figures against.
  - C. Keep the register in the synthesis context only, not in the deliverable. Tradeoff: the reviewer cannot see it, so the consistency check is weaker.
- Recommendation: A. research-orchestration already asks for it, the step 3 run used it well, and it gives the reviewer one table to check against.
- Files: `pre-brd-unifier/chunks/07-market-sizing-analysis.md`, `pre-brd-unifier/research-orchestration.md` (line 30), `pre-brd-unifier/frameworks.md` (line 15), `pre-brd-unifier/xlsx-export.md` (line 40).

### P8b: The Notes / source column in 07 mixes guidance and slots
- Status: Present.
- Evidence:
  - In `pre-brd-unifier/chunks/07-market-sizing-analysis.md`, the notes take four forms:
    - Some input rows have a blank note: `:24` "| Global market (current year) |  |  |".
    - Some input rows have a placeholder: `:37` "ARPU assumption".
    - Some computed rows have a formula note: `:26` "= Global x region share".
    - Other computed rows have plain text: `:28` "Top-down TAM for the niche", `:44` "Average of top-down and bottom-up".
  - The fill contract does not say which notes are slots.
  - The cell map settles it for the Excel: on 'Market Sizing & analysis', only the notes of input rows are writable (C11, C12, C14, C18, C19, C21, C26, C28), never those of computed rows.
- Class: S. Recommended: the notes of input rows are Answer slots, and the notes of computed rows stay. This mirrors the cell map.
- Fix:
  - `pre-brd-unifier/frameworks.md` / current: "- Unverifiable inputs → `[NEEDS CLARIFICATION: <question>]`." / new: the same line, then a new line "- Market Sizing (07): the Notes / source (or Basis) cell of a row you enter is an Answer slot; add the source, year, and assumption there. A note that starts with `=` is the row's formula; keep it."
  - `pre-brd-unifier/chunks/07-market-sizing-analysis.md` / current: "| Serviceable TAM (segment, region) |  | Top-down TAM for the niche |" / new: "| Serviceable TAM (segment, region) |  | = Regional market x % relevant (top-down TAM for the niche) |"
  - `pre-brd-unifier/chunks/07-market-sizing-analysis.md` / current: "| TAM |  | Average of top-down and bottom-up |" / new: "| TAM |  | = average of top-down and bottom-up TAM |"
- Files: `pre-brd-unifier/frameworks.md`, `pre-brd-unifier/chunks/07-market-sizing-analysis.md`.

### P9: Where the competitor names go in chunk 06
- Status: Present.
- Evidence:
  - `pre-brd-unifier/chunks/06-market-comparison.md:22` and `:30` "`Competitor 1`–`Competitor 5` map to those 5 products (use the same product names as in section 1)."
  - The names come from section 1, but the hint does not say where they go. The column headers are template text, and `SKILL.md:67` says "Write Answer cells only".
  - The workbook's matching headers are placeholders: 'Market Comparison'!M21:Q21 hold "Product_01_PlaceHolder" to "Product_05_PlaceHolder".
  - The run wrote headers such as "Competitor 1 (Vezeeta)".
- Class: S. Recommended: Competitor N is row N of section 1, and its name goes in the header in brackets. This is what the run did and what the workbook placeholders imply.
- Fix: `pre-brd-unifier/chunks/06-market-comparison.md`. The text appears twice, on lines 22 and 30; replace both. Current: "`Competitor 1`–`Competitor 5` map to those 5 products (use the same product names as in section 1)." / new: "`Competitor 1` to `Competitor 5` are the products in rows 1 to 5 of section 1, in the same order; add each product's name to its column header, for example `Competitor 1 (Product name)`."
- Files: `pre-brd-unifier/chunks/06-market-comparison.md`. See N-2 for the export side.

### P10: The IFAS research agent is asked for internal facts
- Status: Present.
- Evidence:
  - `pre-brd-unifier/research-orchestration.md:5` "Only chunks **06–11** do independent web research, so only they get an agent."
  - `:14` "6. **Chunk 11 - IFAS.** Internal strengths + weaknesses, each with weight 0–1 and rating 1–5."
  - Internal facts (team, budget, capabilities) come from the intake, not the web.
- Class: S. Recommended: keep the agent, so the six-agent fan-out is unchanged, and narrow its brief to benchmarks.
- Fix: `pre-brd-unifier/research-orchestration.md` / current: "6. **Chunk 11 - IFAS.** Internal strengths + weaknesses, each with weight 0–1 and rating 1–5." / new: "6. **Chunk 11 - IFAS.** Internal strengths + weaknesses, each with weight 0–1 and rating 1–5. The internal facts (team, budget, assets, capabilities) come from the intake, not the web; research only the benchmarks that rate them (for example typical build cost, salaries, or compliance effort). An internal fact the intake does not give gets `[NEEDS CLARIFICATION: <question>]`."
- Files: `pre-brd-unifier/research-orchestration.md`.

### P11: Principle 8 names no home chunk for each shared fact
- Status: Present.
- Evidence:
  - `pre-brd-unifier/SKILL.md:69` "State a shared fact - UVP, revenue levers, the KPI/success-metric list, target segment, cost drivers, the phase roadmap - **once** in its home chunk and reference it elsewhere with a link (e.g. "see [01-concept-sheet.md]") ... The Product Strategy Canvas (19) in particular should point to 01/03 for shared elements".
  - The templates ask for the same element in several chunks (chunk:line):
    - UVP: 01:19, 03:16, 19:17.
    - Target segment: 01:18, 03:15, 19:15.
    - Revenue: 01:21, 03:19, 19:21.
    - Channels: 03:18, 19:20, 21:36-40.
    - Vision: 02:19, 19:14.
    - Cost: 03:20, 19:22.
  - Chunk 02 already points to 01 for the problem, the key features, and the success metrics (02:18, 02:23, 02:26).
- Class: S. Recommended: 01 is the home for every shared fact it has a row for, which extends the pattern chunk 02 already uses; 02, 03, and 21 take the rest.
- Fix: `pre-brd-unifier/SKILL.md` / current: "Cross-reference, do not repeat. The Product Strategy Canvas (19) in particular should point to 01/03 for shared elements and add only its strategic framing." / new: "Cross-reference, do not repeat. Homes: 01 for the problem, target segment, UVP, key features, business model (revenue levers), and success metrics (the KPI list); 02 for the vision; 03 for channels and cost structure; 21 for the phase roadmap. A chunk that asks for one of these links to its home and adds only its own lens (for example 21 adds each channel's role, launch phase, and owner). The Product Strategy Canvas (19) in particular should point to 01/02/03 for shared elements and add only its strategic framing."
- Files: `pre-brd-unifier/SKILL.md`. No CROSS-SKILL edit: brd-unifier's pre-BRD mapping (`brd-unifier/sow-transformation.md:175-176`) reads chunk groups and can follow the links.

### P12: Chunk 23's conditions bullet has no wording for a No-Go
- Status: Present.
- Evidence:
  - `pre-brd-unifier/chunks/23-investor-assessment.md:57` "- **Conditions that would move a Conditional Go to a Go:** " covers one band only. The verdict can be Go, Conditional Go, or No-Go (`:16`).
  - `SKILL.md:92` calls this "conditions to clear".
  - The run wrote "Not applicable today (the verdict is No-Go); to earn a Conditional Go and then a Go, ...".
- Class: S. Recommended: one label for every band, built on SKILL.md's "conditions to clear".
- Fix: `pre-brd-unifier/chunks/23-investor-assessment.md` / current: "Conditions that would move a Conditional Go to a Go:" / new: "Conditions to clear (what would move the verdict up one band; for a Go, what must stay true):"
- Files: `pre-brd-unifier/chunks/23-investor-assessment.md`.

### P13: The Markdown EFAS and IFAS blocks grow freely; the Excel holds 5 and 4 rows, read by position
- Status: Present. The literal question ("author within Excel capacity?") is answered by `frameworks.md:37-39`: the Markdown may grow, and the export keeps the highest-priority items. That rule is incomplete.
- Evidence:
  - `pre-brd-unifier/frameworks.md:15` lists EFAS and IFAS as "Variable rows (add as needed)".
  - `frameworks.md:39` "Keep the highest-priority items in the sheet and note overflow in the Open Items log."; `xlsx-export.md:50` "fill within the provided rows and record any overflow in the Open Items log."
  - `reference/cell-map.json` holds EFAS rows 2 to 6 and IFAS rows 2 to 5.
  - The Executive Summary formulas read these rows by position:
    - D18 "SUM(EFAS!F2:F4)/SUM(EFAS!D2:D4)" takes rows 2 to 4 as the opportunities.
    - D19 "SUM('IFAS '!F2:F4)/SUM('IFAS '!D2:D4)" takes rows 2 to 4 as the strengths.
    - The readiness checks J6 and J7 need every row filled ("COUNT(EFAS!E2:E6)<5", "COUNT('IFAS '!E2:E5)<4").
  - Nothing says which factors go to which rows, or that the kept weights must be rescaled to sum to 1.0.
  - The run had 8 EFAS and 8 IFAS factors, so its Excel would compute a different composite from chunk 22, with no warning.
- Class: D (export behaviour, template row rules, scoring).
- Options:
  - A. Fix the Markdown to the workbook's capacity, and make the workbook read rows by type:
    - EFAS has exactly 5 factors and IFAS exactly 4, with weights summing to 1.0 in each.
    - The workbook's D18 and D19 read the opportunity and strength rows by the Type column (SUMIF). J6 and J7 also require at least one O row and one S row.
    - Both scoreboards then agree by construction.
    - Tradeoff: every run is capped at 5 and 4 factors, whether or not it exports to Excel. The workbook edit is small (D18, D19, C18, C19, J6, J7).
  - B. Keep the Markdown free and define how the export selects rows:
    - EFAS rows 2 to 4 take the three highest-weight opportunities, and rows 5 to 6 the two highest-weight threats.
    - IFAS rows 2 to 4 take the three highest-weight strengths, and row 5 the highest-weight weakness.
    - Rescale the kept weights to sum to 1.0, and at export report the Excel composite next to chunk 22's.
    - Tradeoff: the Excel can show a different composite or band from the Markdown, and a block with too few opportunities or threats still blocks the Excel scoreboard.
  - C. Make EFAS and IFAS variable-row in the workbook: a type-based SUMIF over a longer range, a variable_rows spec in the cell map, and new tests. Tradeoff: the largest change, and the READ-ONLY sample tables below the data have to move.
- Recommendation: A. Both outputs then agree with the smallest change, and 5 plus 4 weighted factors is the workbook's own design.
- Files: `pre-brd-unifier/chunks/10-efas.md` (line 20), `pre-brd-unifier/chunks/11-ifas.md` (line 20), `pre-brd-unifier/frameworks.md` (lines 14, 15, 39), `pre-brd-unifier/research-orchestration.md` (lines 13 and 14), `pre-brd-unifier/xlsx-export.md` (line 50), `pre-brd-unifier/chunks/00-pre-brd-master.md` (line 18, unless P6 option A deletes it), `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx` (Executive Summary C18, D18, C19, D19, J6, J7). Decide with P2 and P3.

### P14: BCG has no fallback when shares do not exist
- Status: Present.
- Evidence:
  - `pre-brd-unifier/chunks/16-bcg-matrix.md:21` "Relative Market Share = your market share / market leader's share."
  - `:23` "For each, list the competitor shares used to derive relative market share."
  - There is no fallback when shares are not published, and a product that has not launched has no share.
  - The run used clinic-count proxies, its year-one target, and a marker.
- Class: S. Recommended: codify what the run did. Use a sourced proxy named in Comments, or else the marker; a product that has not launched uses its target share, labelled as a target.
- Fix: `pre-brd-unifier/chunks/16-bcg-matrix.md` / current: "For each, list the competitor shares used to derive relative market share." / new: "For each, list the competitor shares used to derive relative market share. Where published shares do not exist, use a sourced proxy (for example customer counts or revenue) and name it in Comments; if no proxy can be sourced, flag `[NEEDS CLARIFICATION: <question>]`. Position a product that has not launched on its target share (for example from 15 OKRs or the 07 SOM), labelled as a target."
- Files: `pre-brd-unifier/chunks/16-bcg-matrix.md`.

## New items

### N-1: The README tier tables put OKRs in Tier 4
- Status: Present.
- Evidence:
  - `pre-brd-unifier/README.md:17` "| 3. Prioritization | 13-14 | RICE, MoSCoW |" and `:18` "| 4. Strategy and planning | 15-21 | OKRs, BCG Matrix, ...". The root `README.md:215-216` say the same.
  - Three sources put OKRs in Tier 3, with Tier 4 starting at BCG:
    - `pre-brd-unifier/chunks/15-okrs.md:4` "TIER: Tier 3: Prioritization".
    - `chunks/00-pre-brd-master.md:46-51`: the Tier 3 table lists 13, 14, and 15.
    - The workbook index, 'PRE-BRD Master' rows 16 to 20: Tier 3 holds RICE, MoSCoW, and OKRs.
- Class: M (three sources agree; the READMEs are stale).
- Fix:
  - `pre-brd-unifier/README.md` / current: "| 3. Prioritization | 13-14 | RICE, MoSCoW |" / new: "| 3. Prioritization | 13-15 | RICE, MoSCoW, OKRs |"
  - `pre-brd-unifier/README.md` / current: "| 4. Strategy and planning | 15-21 | OKRs, BCG Matrix," / new: "| 4. Strategy and planning | 16-21 | BCG Matrix,"
  - CROSS-FILE (repo root): `README.md` / current: "| 13-14 | 3. Prioritization | RICE, MoSCoW |" / new: "| 13-15 | 3. Prioritization | RICE, MoSCoW, OKRs |"
  - CROSS-FILE (repo root): `README.md` / current: "| 15-21 | 4. Strategy and planning | OKRs, BCG Matrix," / new: "| 16-21 | 4. Strategy and planning | BCG Matrix,"
- Files: `pre-brd-unifier/README.md`, `README.md`.

### N-2: The Excel export drops the chunk 06 competitor columns
- Status: Present.
- Evidence:
  - The "Market Comparison" entry in `pre-brd-unifier/reference/cell-map.json` whitelists only columns B to L of rows 22-33 (core features) and 36-47 (advanced features).
  - The workbook's competitor columns M to Q are not writable: the headers M21:Q21 and M35:Q35 ("Product_01_PlaceHolder" to "Product_05_PlaceHolder") and the cells M22:Q33 and M36:Q47.
  - So the export carries neither the competitor names nor the Available / Not available marks.
  - Against:
    - `research-orchestration.md:9` "The feature-by-feature comparison across competitors is required, not optional."
    - `xlsx-export.md:51` "never silently truncate".
    - `xlsx-export.md:40` lists only chunk 23 and the GTM section as Markdown-only.
- Class: D (export mapping and cell map).
- Options:
  - A. Whitelist M21:Q21, M22:Q33, M35:Q35, and M36:Q47 in cell-map.json, and say so in xlsx-export.md. The headers take the section 1 product names, and the cells take Available / Not available. Tradeoff: the export overwrites the placeholder headers, and the clear step blanks them when the payload omits them.
  - B. Declare the competitor columns Markdown-only in xlsx-export.md line 40. Tradeoff: the Excel loses a comparison that research-orchestration calls required.
- Recommendation: A. The workbook already has the columns, and the comparison is required content.
- Files: `pre-brd-unifier/reference/cell-map.json`, `pre-brd-unifier/xlsx-export.md`. The new cells hold no formulas, so the formula check in `scripts/tests/test_cell_map.py` is unaffected.

### N-3: The exported workbook keeps the EventHive example text
- Status: Present.
- Evidence:
  - The clear step blanks only whitelisted cells (`pre-brd-unifier/scripts/export_xlsx.py:80-96`). These example-specific cells are not whitelisted:
  - 'Market Sizing & analysis':
    - The answer table (B11 to C29; its input cells are whitelisted) is titled by A8 "EventHive ... Market Sizing (US, gated/HOA communities) Sample - Read only" (dash omitted).
    - Its row labels and computed-row notes are EventHive-specific, for example A11 "Global EMS market (2025)", A13 "US EMS market (TAM, all segments)", and C25 "Average of top-down ($198M) and bottom-up ($167M)".
  - 'Executive Summary':
    - G17 to G21 hold EventHive rationales, for example G17 "Niche but real SAM ($46M); modest absolute size caps the ceiling. Source: Market Sizing."
    - B26 to B28 hold EventHive conditions, for example B27 "3. Market ceiling is modest ... SAM ~$46M caps upside." (dash omitted).
    - The cell map's "Executive Summary" entry whitelists only C5.
  - 'PRE-BRD Master'!B10 includes "EventHive result (US): TAM ≈ $182M → SAM ≈ $46M → SOM ≈ $2.3M."
  - Against: `xlsx-export.md:38` "a global clear guarantees no leftover example value survives - not in a filled sheet, and not in a sheet the payload omits."
- Class: D (reference workbook and export mapping).
- Options:
  - A. Make the reference workbook generic, and map the Executive Summary text cells:
    - Give the Market Sizing title, row labels, and notes chunk 07's generic wording, and remove the example result from index cell B10.
    - Whitelist Executive Summary G17:G21 and B26:B28, so the export clears them and fills them from chunk 22's Rationale column and conditions.
    - Tradeoff: a reference-workbook edit. B25 stays an automatic condition, so chunk 22's conditions map from the second one on.
  - B. Only whitelist the example-specific cells, so the export blanks them. Tradeoff: the Market Sizing row labels come out blank, and the rationales and conditions stay empty.
- Recommendation: A. It restores the guarantee in xlsx-export.md and carries chunk 22's reasoning into the Excel.
- Files: `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx`, `pre-brd-unifier/reference/cell-map.json`, `pre-brd-unifier/xlsx-export.md`.
