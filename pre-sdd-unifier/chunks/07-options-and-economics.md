<!--
CHUNK: 07
TITLE: Options and Economics
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03a-03h, 04, 05
PART OF: Pre-SDD - [Project Name]
-->

# 7. Options and Economics

<!-- Rules: options-and-economics.md. Each option is a shape, never a product (for example "one region, multi-AZ" against "two regions, warm standby"). The Standard's § 9.4 worksheet: first the hard-constraint filter, then a comparison with weights a person approved, never invented ones. Scores (1 to 5 per criterion) are proposed by the E2E Architect as Estimated, each with a one-line reason, and a person confirms them; the one-time and monthly costs, the TCO horizon (ECO-03), and the weights come from a person. A light run compares the recommended shape with one alternative and gives no weighted comparison unless the weights are already approved; the fragment lists every option in the project state and stands as the engine wrote it, and only the prose follows the light run. -->

## 7.1 Options

<!-- The engine renders the options from the project state (fragment `07-options.md`): each OPT-NN with its shape, the hard-constraint result (pass, fail, or cannot run yet, with the failing check; an option a person excluded with the exclude-option op fails the check `excluded`, naming the entry it breaks), the criterion scores with status and reason, the costs with who gave them, the TCO (CALC-21@OPT-NN), the weighted score (CALC-22@OPT-NN), the weights with who approved them, the flags (UNWEIGHTED when no weights are approved), and the chosen option. An option that breaks a hard entry or a conflict is never ranked. A missing cost gives TBD and an unknown. Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 07-options.md -->
| Option | Shape | Hard constraints | TCO (CALC-21) | Weighted score (CALC-22) | Status |
|--------|-------|------------------|---------------|--------------------------|--------|
| OPT-01 | [Shape] | [pass / fail: check / cannot run yet] | [value, or TBD] | [value, or TBD, or UNWEIGHTED] | [Status] |
| OPT-02 | [Shape] | [...] | [...] | [...] | [...] |
<!-- /ENGINE-FRAGMENT -->

## 7.2 Reading the Comparison

<!-- Plain present tense, citing OPT-NN, CALC-21@OPT-NN, CALC-22@OPT-NN, and entry IDs; no number the fragment does not hold. Cover: which options the hard-constraint filter removes and why; whether the comparison is weighted (who approved the weights) or flagged UNWEIGHTED; the TCO over the horizon (ECO-03); the recommended shape and its rationale; the cost sensitivities; the pilots or PoCs still needed; and the condition that would reverse the recommendation. The decision itself (the chosen option, who chose it) is the engine's `decisions.chosen_option`, shown in the fragment; the story of how it was chosen goes in decision-log.md. -->

- **Hard-constraint filter:** [Which options pass, which fail and why]
- **Weights:** [Approved by <name> on <date>, or "None approved: the comparison is unweighted (UNWEIGHTED)"]
- **TCO:** [Reading of CALC-21 per option over the ECO-03 horizon]
- **Recommended shape:** [OPT-NN, with its rationale in one or two sentences]
- **Reversal condition:** [The evidence or change that would reverse it]
- **Pilots and PoCs needed:** [List, or "None"]

<!-- Footer: when chunk 06 is omitted (not brownfield or mixed), PREV is 05-target-shape.md; when chunk 08 is omitted (no overlay), NEXT is 09-decisions.md. -->
<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 06-existing-estate.md | NEXT: 08-migration-overlay.md -->
