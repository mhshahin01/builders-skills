# Step 6 findings triage

Runtime: Codex. Date: 2026-10-07. Stage: TRIAGE only. Status: proposed decisions, nothing applied.

Status update, 2026-10-07: the user approved option A for all 30 groups and the proposed M and S edits; Codex applied them in stage TRIAGE-APPLY (see `codex-log.md`). This file is the original triage record.

The current source files contain 55 rows: 40 in B-findings.md and 15 in R-findings.md. The resume brief says 33 + 15 = 48; that inventory is stale. All 55 current rows are retained, including duplicates and non-skill observations. One additional conflict, TX-01, is verified from the approved CHK diagram work and current skill text. Total: 56 rows. No source finding was silently dropped or marked fixed without current evidence.

The seven rows after the first 33 rows of B-findings are BL2-1, BL2-2, BL2-3, BL2-4, BL2-5, BL2-6 and BR3-8. This accounts for the numeric difference; it does not infer when they were added. Original observations are linked to their source rows. R2/CHK/R3 reports were read; document OIs, temporary handoff gaps and approved checker fixes are tracked separately below, not inflated into extra skill defects.

Classes: **M 2**, **S 11**, **D 43**. M is a mechanical wording/example fix. S is a simple clarification or a retain/no-skill-edit disposition. D covers policy, gates, schema/IDs, layouts, versioning, review, security or handoffs. When uncertain, D is used. The 30 shared decision groups offer two to four choices for every D row; a group is shared only when one policy addresses those linked observations. A is recommended in each group. A recommendation is not approval.

## Review order

Decide gate/review behavior first (D02, D10, D11, D15, D19, D22, D23, D25, D27-D29). Then storage/migration/versioning (D01, D03, D06K, D06, D07, D12, D16, D18, D20, D26). Then requirement/provenance/coverage (D04, D05, D08, D09, D13, D14, D17, D21, D24). D06K and D20 recommend retaining current behavior; D25 mainly clarifies existing pointers. D10/D11/D15 interact, as do D22/D23 and D12/D26. Do not apply conflicting choices independently.

## Inventory

| ID | Class | Current disposition | Subject | Recommendation / decision |
| --- | --- | --- | --- | --- |
| [BL1-1](#bl1-1) | D | Confirmed conflict | Accepted-item records | [D01](#d01) |
| [BL1-2](#bl1-2) | S | Confirmed ambiguity | Consistency run numbering | See verified item below |
| [BL1-3](#bl1-3) | D | Confirmed conflict | Findings on the last permitted run | [D02](#d02) |
| [BL1-4](#bl1-4) | D | Partly confirmed | Migration and editorial responsibilities | [D03](#d03) |
| [BL1-5](#bl1-5) | D | Partly covered | Complete new persona and use case proposals | [D04](#d04) |
| [BL1-6](#bl1-6) | D | Confirmed policy choice | Fixed responsive minimum | [D05](#d05) |
| [BL1-7](#bl1-7) | S | Not a skill defect | Unavailable brand default and outside facts | No skill edit |
| [BL1-8](#bl1-8) | D | Covered; retain recommended | BRD key ownership | [D06K](#d06k) |
| [BR1-1](#br1-1) | D | Duplicate of BL1-4 | Review during migration | [D03](#d03) |
| [BR1-2](#br1-2) | D | Partly confirmed | Migration records and source references | [D06](#d06) |
| [BR1-3](#br1-3) | D | Duplicate of BL1-3 | Third-run correction boundary | [D02](#d02) |
| [BR1-4](#br1-4) | D | Confirmed gap | Acceptance-loop open remainders | [D07](#d07) |
| [BR1-5](#br1-5) | S | Confirmed narrow ambiguity | Advice-style reviewer notes | See verified item below |
| [BR1-6](#br1-6) | D | Confirmed gap | Resolving an assumption | [D08](#d08) |
| [BR1-7](#br1-7) | D | Partly confirmed; includes BL1-6 | UI placeholders and defaults | [D05](#d05) |
| [BR1-8](#br1-8) | D | Confirmed provenance gap | Reviewer evidence from global instructions | [D09](#d09) |
| [BR1-9](#br1-9) | S | Covered; observation | Mockup P1/P2 assignment | See verified item below |
| [BR1-10](#br1-10) | S | Not a skill defect; duplicate brief issue | Brief default and update boundaries | No skill edit |
| [BR2-1](#br2-1) | D | Confirmed design choice | Diagram fixes and approved mockups | [D10](#d10) |
| [BR2-2](#br2-2) | D | Confirmed ambiguity | Figma links in UC text and versioning | [D12](#d12) |
| [BR2-3](#br2-3) | D | Confirmed conflict | Completed mockup evidence when the gate closes | [D11](#d11) |
| [BR2-4](#br2-4) | D | Confirmed review-policy ambiguity | Undocumented decline branches | [D13](#d13) |
| [BR2-5](#br2-5) | D | Confirmed gap | One-persona report delivery task | [D14](#d14) |
| [BR2-6](#br2-6) | S | Covered; brief issue | grill-me wrapper outside Claude Code | See verified item below |
| [BR2-7](#br2-7) | D | Covered rule; optional policy choice | Cost of a full check per request | [D15](#d15) |
| [BR2-8](#br2-8) | D | Confirmed design risk | New scope from repeated gate reviews | [D15](#d15) |
| [BR3-1](#br3-1) | D | Confirmed; same state family | Step 2 reopened by diagram/mockup completion | [D11](#d11) |
| [BR3-2](#br3-2) | M | Mechanical wording mismatch | G2 title and check wording | See verified item below |
| [BR3-3](#br3-3) | D | Confirmed; extends BR2-5 | Reports in tasks and test trace | [D14](#d14) |
| [BR3-4](#br3-4) | D | Confirmed conflict; CHK demonstrated a solution | Large use-case flowcharts | [D16](#d16) |
| [BR3-5](#br3-5) | D | Partly covered; same migration family | IDs from older delivery material | [D06](#d06) |
| [BR3-6](#br3-6) | D | Confirmed gap | Report mockups without a use case | [D17](#d17) |
| [BR3-7](#br3-7) | D | Confirmed omission | Change date across midnight | [D12](#d12) |
| [BL2-1](#bl2-1) | D | Confirmed policy choice | No-change grill confirmation | [D18](#d18) |
| [BL2-2](#bl2-2) | D | Confirmed defect in date-only wording | Same-day consistency completion | [D19](#d19) |
| [BL2-3](#bl2-3) | D | Covered; retain recommended | Unrequested chunk 17 with an open gate | [D20](#d20) |
| [BL2-4](#bl2-4) | S | Covered; optional example | Meaning of numeric-rule counts | See verified item below |
| [BL2-5](#bl2-5) | D | Partly covered | Case data versus start dependencies | [D21](#d21) |
| [BL2-6](#bl2-6) | S | Run violation; current rule sufficient | Gated draft and scratch hygiene | No skill edit |
| [BR3-8](#br3-8) | S | Run or brief issue | Rejected CF item missing its TD record | See verified item below |
| [R1-1](#r1-1) | D | Confirmed handoff gap | Owner-only lawful basis and E2E gate | [D22](#d22) |
| [R1-2](#r1-2) | D | Confirmed format ambiguity | First-build Chunks syntax | [D12](#d12) |
| [R1-3](#r1-3) | D | Historical attribution needs correction | Infrastructure versus integration APIs | [D24](#d24) |
| [R1-4](#r1-4) | S | Harness violation; covered | Reading prior session transcripts | No skill edit |
| [R1-5](#r1-5) | S | Harness ambiguity; covered now | Scope rejection applied only to review OIs | No skill edit |
| [R1b-1](#r1b-1) | D | Confirmed review-loop risk | Delta review after marker answers | [D15](#d15) |
| [R1b-2](#r1b-2) | D | Confirmed design issue | Marker placement determines E3 | [D23](#d23) |
| [R1b-3](#r1b-3) | D | Partly covered; retain common tail | Targeted update tail | [D25](#d25) |
| [R1b-4](#r1b-4) | D | Confirmed wording ambiguity | This run in same-day E4 | [D19](#d19) |
| [R1b-5](#r1b-5) | D | Confirmed format gap | Chunks list and companion version | [D26](#d26) |
| [R1c-1](#r1c-1) | D | Confirmed missing branch | Already-current E2E request | [D27](#d27) |
| [R1c-2](#r1c-2) | D | Confirmed gap | Partially answered marker | [D28](#d28) |
| [R1c-3](#r1c-3) | D | Confirmed precedence ambiguity | Source corrections during faithfulness | [D29](#d29) |
| [R1c-4](#r1c-4) | D | Duplicate of R1b-2; broader example | Out-of-gate dependent markers | [D23](#d23) |
| [R1c-5](#r1c-5) | M | Mechanical example gap | Single-release phase label | See verified item below |
| [TX-01](#tx-01) | D | New, verified from CHK | Editorial diagram edits and version bump | [D12](#d12) |

## Mechanical and simple items

### BR3-2

**M: G2 title and check wording.** Mechanical wording mismatch.

Current verification: The short title says no finding waiting; the actual check says none waiting on a decision and permits a finding routed to a resolved item.

Evidence: [brd-unifier/delivery-chunks.md:33](../../../brd-unifier/delivery-chunks.md).

Recommendation: Change the title to none waiting on a decision. Keep the existing check semantics.

Original record: [B-findings.md:60](B-findings.md).

### R1c-5

**M: Single-release phase label.** Mechanical example gap.

Current verification: The template already defines the no-topic fallback as the single release phase; its example only shows P1. The semantics exist but the display example is missing.

Evidence: [sdd-unifier/chunks/19-e2e-system-design.md:46](../../../sdd-unifier/chunks/19-e2e-system-design.md), [sdd-unifier/chunks/19-e2e-system-design.md:50](../../../sdd-unifier/chunks/19-e2e-system-design.md), [sdd-unifier/TEMPLATE-COMBINED.md:1835](../../../sdd-unifier/TEMPLATE-COMBINED.md).

Recommendation: Add a no-topic example labelled Single release (no topics), in the chunk and combined template; do not create another phase or ID policy.

Original record: [R-findings.md:41](R-findings.md).

### BL1-2

**S: Consistency run numbering.** Confirmed ambiguity.

Current verification: The generation instruction says Run 1, while refreshes retain existing CF/TD IDs and append a run record. It does not explicitly define the next run number in a migrated checklist.

Evidence: [brd-unifier/delivery-chunks.md:159](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:98](../../../brd-unifier/delivery-chunks.md).

Recommendation: Say: initial checklist uses Run 1; an existing checklist appends the next free run number. Keep the per-request three-run cap separate.

Original record: [B-findings.md:12](B-findings.md).

### BL1-7

**S: Unavailable brand default and outside facts.** Not a skill defect.

Current verification: Principle 16 asks for a confirmed brand color and explicitly forbids invention. Missing owner facts remain questions. The stage brief assumed a default and no outside input.

Evidence: [brd-unifier/SKILL.md:99](../../../brd-unifier/SKILL.md), [brd-unifier/delivery-chunks.md:182](../../../brd-unifier/delivery-chunks.md), [_fixtures/notes/step6-handoffs/resume-codex.md:25](resume-codex.md).

Recommendation: Retain the skill rule. Correct test briefs to supply named-owner fixture answers and avoid claiming an existing default.

Original record: [B-findings.md:17](B-findings.md).

### BR1-5

**S: Advice-style reviewer notes.** Confirmed narrow ambiguity.

Current verification: Step 1 includes a Reviewer Note that asks for a decision, but the template also permits stylistic advice and future suggestions. Optional advice need not become a blocking question.

Evidence: [brd-unifier/delivery-chunks.md:145](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:180](../../../brd-unifier/delivery-chunks.md).

Recommendation: Define the inclusion test: the current BRD cannot be finalized without a choice. Keep optional editorial advice as a note; apply only confirmed or mechanical corrections.

Original record: [B-findings.md:30](B-findings.md).

### BR1-9

**S: Mockup P1/P2 assignment.** Covered; observation.

Current verification: The current priority rule is deterministic: on the summarized main workflow means P1, otherwise P2. A changed workflow placement can legitimately change priority.

Evidence: [brd-unifier/delivery-chunks.md:125](../../../brd-unifier/delivery-chunks.md).

Recommendation: Retain the rule and record the source workflow used. Do not make a skill change for this observation.

Original record: [B-findings.md:34](B-findings.md).

### BR1-10

**S: Brief default and update boundaries.** Not a skill defect; duplicate brief issue.

Current verification: There is no invented brand default. A later PM request is a new update under the one-request rule; the recorded extra version follows it.

Evidence: [brd-unifier/SKILL.md:99](../../../brd-unifier/SKILL.md), [brd-unifier/delivery-chunks.md:426](../../../brd-unifier/delivery-chunks.md).

Recommendation: Retain skill behavior. Make fixture briefs explicit about owner answers and request boundaries.

Original record: [B-findings.md:35](B-findings.md).

### BR2-6

**S: grill-me wrapper outside Claude Code.** Covered; brief issue.

Current verification: The wrapper still calls grilling. The runtime adaptation now explicitly says to read the target SKILL.md when an alias cannot be invoked by name.

Evidence: [brd-unifier/SKILL.md:33](../../../brd-unifier/SKILL.md), [grill-me/SKILL.md:7](../../../grill-me/SKILL.md).

Recommendation: Keep the current adaptation. Name grilling directly in harness briefs where convenient.

Original record: [B-findings.md:48](B-findings.md).

### BL2-4

**S: Meaning of numeric-rule counts.** Covered; optional example.

Current verification: Coverage already defines every numeric or time-based business rule and demands counts. The report did not document which concrete rules formed its count.

Evidence: [brd-unifier/delivery-chunks.md:309](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:316](../../../brd-unifier/delivery-chunks.md).

Recommendation: Keep the rule. Add one short example separating distinct source limits from their below/at/above cases, and include the counted source-rule list in a run audit.

Original record: [B-findings.md:69](B-findings.md).

### BL2-6

**S: Gated draft and scratch hygiene.** Run violation; current rule sufficient.

Current verification: The current guardrail already forbids drafts, previews and outlines in any file or chat while the gate is shut. Deleting an early draft does not turn that into compliance.

Evidence: [brd-unifier/delivery-chunks.md:42](../../../brd-unifier/delivery-chunks.md).

Recommendation: No skill edit. Keep harness scratch paths explicit and audit writes at the gate boundary; do not reconstruct or claim earlier compliant execution.

Original record: [B-findings.md:71](B-findings.md).

### BR3-8

**S: Rejected CF item missing its TD record.** Run or brief issue.

Current verification: Step 2 requires OI plus TD for a business ambiguity and a disposition for every CF. The reject policy requires OI/log recording but does not explicitly authorize omitting the existing TD/disposition route.

Evidence: [brd-unifier/delivery-chunks.md:181](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:32](../../../brd-unifier/delivery-chunks.md), [_fixtures/notes/step6-handoffs/resume-codex.md:25](resume-codex.md).

Recommendation: Keep existing rules. Verify CF/disposition/TD links in later harness audits; any retroactive record repair needs a separately approved write scope.

Original record: [B-findings.md:72](B-findings.md).

### R1-4

**S: Reading prior session transcripts.** Harness violation; covered.

Current verification: The resume brief explicitly forbids transcript reads. The historical read is a runtime hygiene failure, not a reason to change a design template.

Evidence: [_fixtures/notes/step6-handoffs/resume-codex.md:20](resume-codex.md).

Recommendation: Retain the prohibition in harness briefs and use checked-in reports for continuity. No transcript was read in TRIAGE.

Original record: [R-findings.md:14](R-findings.md).

### R1-5

**S: Scope rejection applied only to review OIs.** Harness ambiguity; covered now.

Current verification: The fixed policy rejects a new item adding unstated business behavior without limiting its origin. Earlier narrow interpretation was a brief/run issue.

Evidence: [_fixtures/notes/step6-handoffs/resume-codex.md:25](resume-codex.md).

Recommendation: Apply the fixed test policy to reviewer, marker, grilling and checker suggestions. Keep this fixture policy out of ordinary production skills.

Original record: [R-findings.md:15](R-findings.md).

## Design items: verification

### BL1-1

**D: Accepted-item records.** Confirmed conflict.

Current verification: The majority rule stores accepted narrative in the companion and leaves a status stub. Step 7 item 5 and the master still describe complete items and answers without the accepted-item exception.

Evidence: [brd-unifier/SKILL.md:212](../../../brd-unifier/SKILL.md), [brd-unifier/SKILL.md:238](../../../brd-unifier/SKILL.md), [brd-unifier/chunks/13-open-items-and-clarifications.md:11](../../../brd-unifier/chunks/13-open-items-and-clarifications.md), [brd-unifier/chunks/brd-master.md:117](../../../brd-unifier/chunks/brd-master.md).

Recommendation: Choose one compact canonical stub and make every description agree. Options and tradeoffs: [D01](#d01).

Original record: [B-findings.md:11](B-findings.md).

### BL1-3

**D: Findings on the last permitted run.** Confirmed conflict.

Current verification: The third-run rule leaves new findings for the next session, while Special cases requires walking new OIs before applying them. Neither states clearly whether the last-run corrections or decisions may be applied now.

Evidence: [brd-unifier/delivery-chunks.md:159](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:185](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:449](../../../brd-unifier/delivery-chunks.md).

Recommendation: Define the stop boundary and permitted decision collection. Options and tradeoffs: [D02](#d02).

Original record: [B-findings.md:13](B-findings.md).

### BL1-4

**D: Migration and editorial responsibilities.** Partly confirmed.

Current verification: Migration review is not explicitly covered by first-build versus later-update wording. Confirmed mechanical corrections have an author route, but advisory Reviewer Notes, stable table numbering and Updated By attribution lack explicit rules.

Evidence: [brd-unifier/SKILL.md:198](../../../brd-unifier/SKILL.md), [brd-unifier/transform-detection.md:102](../../../brd-unifier/transform-detection.md), [brd-unifier/delivery-chunks.md:180](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:392](../../../brd-unifier/delivery-chunks.md), [brd-unifier/chunks/00-cover-and-changelog.md:21](../../../brd-unifier/chunks/00-cover-and-changelog.md), [brd-unifier/chunks/00-cover-and-changelog.md:36](../../../brd-unifier/chunks/00-cover-and-changelog.md).

Recommendation: Choose the migration review trigger and document the author, table and credit rules together. Options and tradeoffs: [D03](#d03).

Original record: [B-findings.md:14](B-findings.md).

### BL1-5

**D: Complete new persona and use case proposals.** Partly covered.

Current verification: The template already requires nine sections and a persona journey; the reviewer demands paste-ready answers but has no bundle check when an accepted answer introduces a whole persona/UC. The original incomplete answer was also a run failure.

Evidence: [brd-unifier/SKILL.md:86](../../../brd-unifier/SKILL.md), [brd-unifier/use-case-quality.md:24](../../../brd-unifier/use-case-quality.md), [brd-unifier/sow-transformation.md:74](../../../brd-unifier/sow-transformation.md), [brd-unifier/SKILL.md:208](../../../brd-unifier/SKILL.md).

Recommendation: Require a complete template-shaped proposal bundle, with unknown behavior still marked for a decision. Options and tradeoffs: [D04](#d04).

Original record: [B-findings.md:15](B-findings.md).

### BL1-6

**D: Fixed responsive minimum.** Confirmed policy choice.

Current verification: The chunk and combined template mandate desktop/tablet/mobile. This can exceed source scope, even though project files and source conflicts need decisions. The to-do also requires tablet frames for P1.

Evidence: [brd-unifier/chunks/11-summary-and-uiux.md:27](../../../brd-unifier/chunks/11-summary-and-uiux.md), [brd-unifier/TEMPLATE-COMBINED.md:376](../../../brd-unifier/TEMPLATE-COMBINED.md), [brd-unifier/SKILL.md:99](../../../brd-unifier/SKILL.md), [brd-unifier/delivery-chunks.md:201](../../../brd-unifier/delivery-chunks.md).

Recommendation: Decide whether UI defaults are mandatory requirements or proposals requiring confirmation. Options and tradeoffs: [D05](#d05).

Original record: [B-findings.md:16](B-findings.md).

### BL1-8

**D: BRD key ownership.** Covered; retain recommended.

Current verification: The SDD Source BRDs register owns the key. The BRD has no required local key field. The reported inability to keep such a field is expected, not a missing BRD schema field.

Evidence: [sdd-unifier/chunks/00-cover-and-changelog.md:31](../../../sdd-unifier/chunks/00-cover-and-changelog.md), [sdd-unifier/brd-to-sdd.md:91](../../../sdd-unifier/brd-to-sdd.md).

Recommendation: Keep key assignment in the SDD; adding a BRD key is an optional schema change. Options and tradeoffs: [D06K](#d06k).

Original record: [B-findings.md:18](B-findings.md).

### BR1-1

**D: Review during migration.** Duplicate of BL1-4.

Current verification: Transform authoring differs from a pure conversion, but the reviewer first-build/update split does not say whether a previously reviewed older-template BRD gets another full review. A missing chunk 13 is explicitly reviewed.

Evidence: [brd-unifier/SKILL.md:198](../../../brd-unifier/SKILL.md), [brd-unifier/transform-detection.md:102](../../../brd-unifier/transform-detection.md), [brd-unifier/transform-detection.md:128](../../../brd-unifier/transform-detection.md), [brd-unifier/sow-transformation.md:154](../../../brd-unifier/sow-transformation.md).

Recommendation: Use the migration trigger in D03; do not add another independent review loop. Options and tradeoffs: [D03](#d03).

Original record: [B-findings.md:26](B-findings.md).

### BR1-2

**D: Migration records and source references.** Partly confirmed.

Current verification: Source delivery material is explicitly Appendix input. Old readiness chunks retain IDs/results, but migration of incomplete closed OIs, reuse of old gate evidence and copy versus portable link are not fully stated.

Evidence: [brd-unifier/sow-transformation.md:144](../../../brd-unifier/sow-transformation.md), [brd-unifier/delivery-chunks.md:451](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:452](../../../brd-unifier/delivery-chunks.md), [brd-unifier/chunks/13-open-items-and-clarifications.md:11](../../../brd-unifier/chunks/13-open-items-and-clarifications.md).

Recommendation: Keep immutable reference history, available fields and stable IDs; define evidence revalidation. Options and tradeoffs: [D06](#d06).

Original record: [B-findings.md:27](B-findings.md).

### BR1-3

**D: Third-run correction boundary.** Duplicate of BL1-3.

Current verification: The cap, post-correction recheck and Special cases still leave the application timing of third-run discoveries unclear.

Evidence: [brd-unifier/delivery-chunks.md:159](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:185](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:449](../../../brd-unifier/delivery-chunks.md).

Recommendation: Apply the single D02 rule to both original findings. Options and tradeoffs: [D02](#d02).

Original record: [B-findings.md:28](B-findings.md).

### BR1-4

**D: Acceptance-loop open remainders.** Confirmed gap.

Current verification: Clarification records explicitly keep open remainders. The BRD handoff routes business-review remainders to an OI, but no equivalent general route from an acceptance-loop record to TD is explicit.

Evidence: [brd-unifier/decision-log.md:44](../../../brd-unifier/decision-log.md), [brd-unifier/SKILL.md:306](../../../brd-unifier/SKILL.md), [brd-unifier/delivery-chunks.md:181](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:182](../../../brd-unifier/delivery-chunks.md).

Recommendation: Collect every live remainder in the to-do, distinguishing choices from missing facts. Options and tradeoffs: [D07](#d07).

Original record: [B-findings.md:29](B-findings.md).

### BR1-6

**D: Resolving an assumption.** Confirmed gap.

Current verification: Step 1 includes assumptions needing validation. The gate explains dependency resolution, but not what evidence resolves an assumption or what happens when it is kept conditional.

Evidence: [brd-unifier/delivery-chunks.md:144](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:38](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:32](../../../brd-unifier/delivery-chunks.md).

Recommendation: Define confirmation, replacement and explicit conditional acceptance with a named owner. Options and tradeoffs: [D08](#d08).

Original record: [B-findings.md:31](B-findings.md).

### BR1-7

**D: UI placeholders and defaults.** Partly confirmed; includes BL1-6.

Current verification: Responsive text is fixed. The data-table placeholder lists paging/export/filtering examples without explicitly distinguishing suggestions from minimum requirements.

Evidence: [brd-unifier/chunks/11-summary-and-uiux.md:24](../../../brd-unifier/chunks/11-summary-and-uiux.md), [brd-unifier/chunks/11-summary-and-uiux.md:27](../../../brd-unifier/chunks/11-summary-and-uiux.md), [brd-unifier/SKILL.md:99](../../../brd-unifier/SKILL.md).

Recommendation: Use D05 for both fixed responsive text and optional table behaviors. Options and tradeoffs: [D05](#d05).

Original record: [B-findings.md:32](B-findings.md).

### BR1-8

**D: Reviewer evidence from global instructions.** Confirmed provenance gap.

Current verification: The runtime table names project/default sources and the reviewer requires evidence, but its brief does not require disclosure of a harness-global standard used without a project file.

Evidence: [brd-unifier/SKILL.md:29](../../../brd-unifier/SKILL.md), [brd-unifier/SKILL.md:99](../../../brd-unifier/SKILL.md), [brd-unifier/SKILL.md:208](../../../brd-unifier/SKILL.md).

Recommendation: Pass source paths and label external defaults explicitly; do not cite an absent project standard. Options and tradeoffs: [D09](#d09).

Original record: [B-findings.md:33](B-findings.md).

### BR2-1

**D: Diagram fixes and approved mockups.** Confirmed design choice.

Current verification: Parallel steps 4/5 reopen each other after a use-case change, even when a diagram clarification does not alter the actor-facing screen. This can invalidate an approval unnecessarily.

Evidence: [brd-unifier/delivery-chunks.md:203](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:419](../../../brd-unifier/delivery-chunks.md).

Recommendation: Choose impact-based reopening or a different final-approval order. Options and tradeoffs: [D10](#d10).

Original record: [B-findings.md:43](B-findings.md).

### BR2-2

**D: Figma links in UC text and versioning.** Confirmed ambiguity.

Current verification: The exemptions explicitly cover chunk 14 links and generic editorial wording, but not Figma links in a UC UI/UX section. Diagram steps also say to bump unconditionally.

Evidence: [brd-unifier/delivery-chunks.md:430](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:436](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:426](../../../brd-unifier/delivery-chunks.md), [brd-unifier/SKILL.md:263](../../../brd-unifier/SKILL.md).

Recommendation: Make metadata-only links and semantic diagram changes explicit in the version rule. Options and tradeoffs: [D12](#d12).

Original record: [B-findings.md:44](B-findings.md).

### BR2-3

**D: Completed mockup evidence when the gate closes.** Confirmed conflict.

Current verification: Verification requires both steps Pending gate whenever G1-G3 fail, even if a row has valid prior approval and its inputs did not change. Refresh rules instead reopen only affected inputs.

Evidence: [brd-unifier/delivery-chunks.md:474](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:419](../../../brd-unifier/delivery-chunks.md).

Recommendation: Define current gate status separately from valid completed-row evidence. Options and tradeoffs: [D11](#d11).

Original record: [B-findings.md:45](B-findings.md).

### BR2-4

**D: Undocumented decline branches.** Confirmed review-policy ambiguity.

Current verification: The defect test catches only one-sided documented content. The no-invention rule catches a branch with no documented termination, but there is no explicit test separating that gap from an optional newly imagined decline flow.

Evidence: [brd-unifier/use-case-quality.md:115](../../../brd-unifier/use-case-quality.md), [brd-unifier/mermaid-diagrams.md:144](../../../brd-unifier/mermaid-diagrams.md).

Recommendation: Check necessary closure of documented choices; classify proposed extra behavior separately. Options and tradeoffs: [D13](#d13).

Original record: [B-findings.md:46](B-findings.md).

### BR2-5

**D: One-persona report delivery task.** Confirmed gap.

Current verification: Use-case tasks need a UC. Foundation/Cross-cutting examples require shared evidence; a report used by one persona and no UC fits neither reliably.

Evidence: [brd-unifier/delivery-chunks.md:223](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:310](../../../brd-unifier/delivery-chunks.md).

Recommendation: Allow a requirement-derived delivery task without inventing a UC. Options and tradeoffs: [D14](#d14).

Original record: [B-findings.md:47](B-findings.md).

### BR2-7

**D: Cost of a full check per request.** Covered rule; optional policy choice.

Current verification: The current rule deliberately makes each request first run full and later runs scoped. The reported cost is real, but is not evidence that the rule failed.

Evidence: [brd-unifier/delivery-chunks.md:159](../../../brd-unifier/delivery-chunks.md), [brd-unifier/SKILL.md:198](../../../brd-unifier/SKILL.md).

Recommendation: Retain the full baseline scan while avoiding redundant new hunts after answers. Options and tradeoffs: [D15](#d15).

Original record: [B-findings.md:49](B-findings.md).

### BR2-8

**D: New scope from repeated gate reviews.** Confirmed design risk.

Current verification: C5 and reviewer missing-scenario prompts can suggest extra behavior. Business ambiguities require a decision, but there is no explicit must-fix versus optional-scope classification or loop convergence policy.

Evidence: [brd-unifier/delivery-chunks.md:159](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:181](../../../brd-unifier/delivery-chunks.md), [brd-unifier/SKILL.md:208](../../../brd-unifier/SKILL.md), [_fixtures/notes/step6-handoffs/resume-codex.md:25](resume-codex.md).

Recommendation: Separate stated-requirement gaps from scope candidates and bound answer validation. Options and tradeoffs: [D15](#d15).

Original record: [B-findings.md:51](B-findings.md).

### BR3-1

**D: Step 2 reopened by diagram/mockup completion.** Confirmed; same state family.

Current verification: The refresh rule reopens step 2 on content changes and rechecks after parallel work. Pure tracking does not reopen it, while verification broadly forces Pending gate states. Input changes and tracking updates need a consistent sequence.

Evidence: [brd-unifier/delivery-chunks.md:419](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:430](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:474](../../../brd-unifier/delivery-chunks.md).

Recommendation: Use D11 for state transitions, with D19 for same-day evidence order. Options and tradeoffs: [D11](#d11).

Original record: [B-findings.md:59](B-findings.md).

### BR3-3

**D: Reports in tasks and test trace.** Confirmed; extends BR2-5.

Current verification: Reports are explicit business acceptance sources, but Related UC and final verification still allow only UC/NFR. A no-UC report therefore needs an unjustified mapping.

Evidence: [brd-unifier/delivery-chunks.md:223](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:284](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:310](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:485](../../../brd-unifier/delivery-chunks.md).

Recommendation: Use D14 for task types and explicit section-derived test references. Options and tradeoffs: [D14](#d14).

Original record: [B-findings.md:61](B-findings.md).

### BR3-4

**D: Large use-case flowcharts.** Confirmed conflict; CHK demonstrated a solution.

Current verification: One-flowchart wording and compression-only guidance conflict with splitting large journeys. CHK split two UC diagrams into connected views while preserving every original edge and anchor.

Evidence: [brd-unifier/delivery-chunks.md:381](../../../brd-unifier/delivery-chunks.md), [brd-unifier/mermaid-diagrams.md:54](../../../brd-unifier/mermaid-diagrams.md), [brd-unifier/mermaid-diagrams.md:145](../../../brd-unifier/mermaid-diagrams.md), [_fixtures/notes/step6-handoffs/codex-log.md:149](codex-log.md).

Recommendation: Permit connected views of one logical UC and validate their union. Options and tradeoffs: [D16](#d16).

Original record: [B-findings.md:62](B-findings.md).

### BR3-5

**D: IDs from older delivery material.** Partly covered; same migration family.

Current verification: IDs/results must survive ordinary refresh and readiness migration; the legacy suite rule also preserves IDs. The Appendix-source migration path lacks the same explicit promise.

Evidence: [brd-unifier/delivery-chunks.md:98](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:452](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:318](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:451](../../../brd-unifier/delivery-chunks.md).

Recommendation: Extend the preservation rule to bundled legacy source material, with mapping for real conflicts. Options and tradeoffs: [D06](#d06).

Original record: [B-findings.md:63](B-findings.md).

### BR3-6

**D: Report mockups without a use case.** Confirmed gap.

Current verification: G4 and frame review ask for UC UI/UX links and UC labels. The suite permits feature areas with no UC, and existing report rows correctly use MK/source-section references.

Evidence: [brd-unifier/delivery-chunks.md:35](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:202](../../../brd-unifier/delivery-chunks.md), [brd-unifier/chunks/14-todo.md:193](../../../brd-unifier/chunks/14-todo.md), [brd-unifier/delivery-chunks.md:310](../../../brd-unifier/delivery-chunks.md).

Recommendation: Allow report source anchors and MK labels instead of a fabricated UC. Options and tradeoffs: [D17](#d17).

Original record: [B-findings.md:64](B-findings.md).

### BR3-7

**D: Change date across midnight.** Confirmed omission.

Current verification: A request is one update, but its Changes Log date is not defined when its content changes span local dates.

Evidence: [brd-unifier/delivery-chunks.md:426](../../../brd-unifier/delivery-chunks.md).

Recommendation: Choose one date convention and keep actual later decision/run dates in their own records. Options and tradeoffs: [D12](#d12).

Original record: [B-findings.md:65](B-findings.md).

### BL2-1

**D: No-change grill confirmation.** Confirmed policy choice.

Current verification: Special cases requires TD for a grill decision with no OI, without separating a new decision from confirmation of an unchanged prior rule.

Evidence: [brd-unifier/delivery-chunks.md:450](../../../brd-unifier/delivery-chunks.md), [brd-unifier/decision-log.md:44](../../../brd-unifier/decision-log.md).

Recommendation: Keep genuine new choices in TD; record pure confirmation only in evidence/history. Options and tradeoffs: [D18](#d18).

Original record: [B-findings.md:66](B-findings.md).

### BL2-2

**D: Same-day consistency completion.** Confirmed defect in date-only wording.

Current verification: A latest run dated after the last change cannot be established by date comparison when both share one day. Run order is valid evidence but is not explicitly named.

Evidence: [brd-unifier/delivery-chunks.md:161](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:159](../../../brd-unifier/delivery-chunks.md).

Recommendation: Use ordered per-request evidence tied to the current content. Options and tradeoffs: [D19](#d19).

Original record: [B-findings.md:67](B-findings.md).

### BL2-3

**D: Unrequested chunk 17 with an open gate.** Covered; retain recommended.

Current verification: The template now defines Locked as not written yet, waiting for gate or preceding chunk. Nothing requires generation of unrequested chunk 17; Locked need not mean the overall gate is shut.

Evidence: [brd-unifier/chunks/14-todo.md:54](../../../brd-unifier/chunks/14-todo.md), [brd-unifier/delivery-chunks.md:42](../../../brd-unifier/delivery-chunks.md).

Recommendation: Retain Locked and annotate not requested in the downstream note; no new state needed. Options and tradeoffs: [D20](#d20).

Original record: [B-findings.md:68](B-findings.md).

### BL2-5

**D: Case data versus start dependencies.** Partly covered.

Current verification: Needs now explicitly lists case-specific P prerequisites; all-case prerequisites are global. Ready for test needs delivery confirmation. Confirmed chunk 02 dependencies versus physically in place can still be confused.

Evidence: [brd-unifier/delivery-chunks.md:295](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:296](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:241](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:38](../../../brd-unifier/delivery-chunks.md).

Recommendation: Retain per-case readiness and distinguish business confirmation from actual milestone delivery. Options and tradeoffs: [D21](#d21).

Original record: [B-findings.md:70](B-findings.md).

### R1-1

**D: Owner-only lawful basis and E2E gate.** Confirmed handoff gap.

Current verification: The compliance skeleton asks for lawful basis. Marker settlement expressly refuses to invent it and E3 blocks module markers. The missing piece is an explicit owner-question handoff, not permission to invent a basis.

Evidence: [sdd-unifier/chunks/13a-service-detailed-template.md:268](../../../sdd-unifier/chunks/13a-service-detailed-template.md), [sdd-unifier/SKILL.md:297](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:309](../../../sdd-unifier/SKILL.md).

Recommendation: Keep named-owner answers and show a clear owner action while the gate is shut. Options and tradeoffs: [D22](#d22).

Original record: [R-findings.md:11](R-findings.md).

### R1-2

**D: First-build Chunks syntax.** Confirmed format ambiguity.

Current verification: The version rule says the first build lists none, without defining whether the literal Chunks field is absent, empty or none (initial build). R2 used the explicit none form; CHK checkers accept it.

Evidence: [sdd-unifier/SKILL.md:388](../../../sdd-unifier/SKILL.md).

Recommendation: Pick one canonical initial row representation. Options and tradeoffs: [D12](#d12).

Original record: [R-findings.md:12](R-findings.md).

### R1-3

**D: Infrastructure versus integration APIs.** Historical attribution needs correction.

Current verification: The current skill template does not contain the reported infrastructure exception. The generated SDD does at §15.1. Its scope can coexist with business integration contracts, but the broad reconciliation/reviewer phrase needs an explicit infrastructure boundary.

Evidence: [sdd-unifier/chunks/11-api-contracts.md:15](../../../sdd-unifier/chunks/11-api-contracts.md), [sdd-unifier/SKILL.md:240](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:264](../../../sdd-unifier/SKILL.md), _fixtures/runs-wip/step6-R/review/sdd-refunds-platform/11-api-contracts.md:39 (not kept).

Recommendation: Define the boundary in the skill; do not claim the current template already makes the exception. Options and tradeoffs: [D24](#d24).

Original record: [R-findings.md:13](R-findings.md).

### R1b-1

**D: Delta review after marker answers.** Confirmed review-loop risk.

Current verification: Any content-changing marker answer triggers a delta review; new items then go through the answer loop. There is no explicit rule separating new-scope suggestions from required unresolved risks or restricting repeated hunts after answers.

Evidence: [sdd-unifier/SKILL.md:253](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:297](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:298](../../../sdd-unifier/SKILL.md).

Recommendation: Use D15 for bounded scoped answer validation, while keeping required owner gaps visible. Options and tradeoffs: [D15](#d15).

Original record: [R-findings.md:23](R-findings.md).

### R1b-2

**D: Marker placement determines E3.** Confirmed design issue.

Current verification: E3 is physical: module markers block, chunk 07 markers do not. Moving a dependent staff basis between these locations changes the result without changing the unresolved fact.

Evidence: [sdd-unifier/SKILL.md:309](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:297](../../../sdd-unifier/SKILL.md).

Recommendation: Choose a semantic blocking inventory or explicitly retain a topology-only gate. Options and tradeoffs: [D23](#d23).

Original record: [R-findings.md:24](R-findings.md).

### R1b-3

**D: Targeted update tail.** Partly covered; retain common tail.

Current verification: The current step 10 preamble explicitly requires delta review before 8b for body changes. The targeted-update and transform bullets omit the explicit end-to-8b link, making the path easy to misread.

Evidence: [sdd-unifier/SKILL.md:253](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:341](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:347](../../../sdd-unifier/SKILL.md), [sdd-unifier/transform-detection.md:139](../../../sdd-unifier/transform-detection.md), [sdd-unifier/SKILL.md:298](../../../sdd-unifier/SKILL.md).

Recommendation: Keep the common tail and add a pointer in the short rows rather than inventing another gate policy. Options and tradeoffs: [D25](#d25).

Original record: [R-findings.md:25](R-findings.md).

### R1b-4

**D: This run in same-day E4.** Confirmed wording ambiguity.

Current verification: E4 refers to this run, whereas versioning defines one request through its handoff. The gate does not name what ordered evidence proves a same-day reconciliation.

Evidence: [sdd-unifier/SKILL.md:310](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:388](../../../sdd-unifier/SKILL.md).

Recommendation: Define run as the current request/update and record that reconciliation followed its final relevant change. Options and tradeoffs: [D19](#d19).

Original record: [R-findings.md:26](R-findings.md).

### R1b-5

**D: Chunks list and companion version.** Confirmed format gap.

Current verification: Every content-changed chunk is listed, but 00 synchronization versus content and chunk 18 review updates lack examples. The companion has VERSION without a maintenance rule.

Evidence: [sdd-unifier/SKILL.md:388](../../../sdd-unifier/SKILL.md), [sdd-unifier/decision-log.md:27](../../../sdd-unifier/decision-log.md), [sdd-unifier/decision-log.md:114](../../../sdd-unifier/decision-log.md), [sdd-unifier/chunks/00-cover-and-changelog.md:51](../../../sdd-unifier/chunks/00-cover-and-changelog.md).

Recommendation: Define content-list membership and decision-log version maintenance explicitly. Options and tradeoffs: [D26](#d26).

Original record: [R-findings.md:27](R-findings.md).

### R1c-1

**D: Already-current E2E request.** Confirmed missing branch.

Current verification: Step 8b says gate open writes chunk 19 and checks faithfulness on every write. It has no no-op path when source content and an existing consolidation are unchanged.

Evidence: [sdd-unifier/SKILL.md:302](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:312](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:253](../../../sdd-unifier/SKILL.md).

Recommendation: Verify current inputs/gate, then preserve an already-current body; run a new review only if asked or triggered. Options and tradeoffs: [D27](#d27).

Original record: [R-findings.md:37](R-findings.md).

### R1c-2

**D: Partially answered marker.** Confirmed gap.

Current verification: The walk tells the author to remove an accepted marker but does not say how to preserve an unanswered remainder of the same question.

Evidence: [sdd-unifier/SKILL.md:297](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:298](../../../sdd-unifier/SKILL.md).

Recommendation: Narrow the marker to its open part, retain owner and decision history, and leave relevant gates unmet. Options and tradeoffs: [D28](#d28).

Original record: [R-findings.md:38](R-findings.md).

### R1c-3

**D: Source corrections during faithfulness.** Confirmed precedence ambiguity.

Current verification: 8b explicitly permits one-truth source corrections plus Changes Log/reconciliation. The common preamble requires delta review for body changes; neither states whether mechanical post-review corrections trigger a new adversarial pass.

Evidence: [sdd-unifier/SKILL.md:312](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:253](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:341](../../../sdd-unifier/SKILL.md).

Recommendation: Separate mechanical verification from new design choice/review work. Options and tradeoffs: [D29](#d29).

Original record: [R-findings.md:39](R-findings.md).

### R1c-4

**D: Out-of-gate dependent markers.** Duplicate of R1b-2; broader example.

Current verification: Provider timeout and other referenced unresolved values can live outside 09-13x. The current physical gate permits that, even if the consolidation relies on the value. External-contract placeholders are intentionally exempt.

Evidence: [sdd-unifier/SKILL.md:309](../../../sdd-unifier/SKILL.md), [sdd-unifier/SKILL.md:310](../../../sdd-unifier/SKILL.md).

Recommendation: Use D23 once; distinguish permissible external black boxes from an unresolved value an E2E claim depends on. Options and tradeoffs: [D23](#d23).

Original record: [R-findings.md:40](R-findings.md).

### TX-01

**D: Editorial diagram edits and version bump.** New, verified from CHK.

Current verification: CHK preserved every original business edge and kept BRD 1.7. Step 8b/the diagram discipline still say bump, while the general version rule exempts editorial changes. This is a text conflict distinct from diagram size and UC link ambiguity.

Evidence: [_fixtures/notes/step6-handoffs/codex-log.md:149](codex-log.md), [brd-unifier/SKILL.md:263](../../../brd-unifier/SKILL.md), [brd-unifier/delivery-chunks.md:393](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:436](../../../brd-unifier/delivery-chunks.md), [brd-unifier/delivery-chunks.md:426](../../../brd-unifier/delivery-chunks.md).

Recommendation: Add explicit semantic versus editorial diagram examples under D12. Options and tradeoffs: [D12](#d12).

Original record: [codex-log.md:149](codex-log.md).

## Design choices

### D01

**Accepted OI storage.** Findings: [BL1-1](#bl1-1).

- A. Keep an OI-ID/title stub, current status and Resolution Log pointer in chunk 13; keep the full question/options/chosen answer in the companion. Update all master/template prose to describe the exception. Compact and consistent with most current rules.
- B. Retain the full OI block after acceptance and link its decision rationale to the companion. Easier local reading, with more repeated historical content.

Recommendation: **A**. A keeps stable references while using the existing single decision-history home. Specify the stub shape so no ID/anchor disappears.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/chunks/13-open-items-and-clarifications.md`, `brd-unifier/chunks/brd-master.md`, `brd-unifier/TEMPLATE-COMBINED.md`, `brd-unifier/decision-log.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D02

**Third-run boundary.** Findings: [BL1-3](#bl1-3), [BR1-3](#br1-3).

- A. Stop application of newly found third-run corrections until the next request. The user may give decisions now; save them as pending application, keep affected gate conditions unmet, and apply/recheck in the next request. Preserves the cap and verified-write boundary.
- B. Apply confirmed third-run corrections now, explicitly mark them unverified and keep the gate shut until the next request. Faster edits, with a knowingly unverified intermediate document.
- C. Permit one extra verification-only pass of the listed third-run corrections, with no new adversarial hunt. Can finish sooner, but changes the strict three-run policy.

Recommendation: **A**. A makes the cap real and avoids an unverified document being treated as ready. It still permits collecting owner decisions without starting another hunt.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/14-todo.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D03

**Migration review and editorial ownership.** Findings: [BL1-4](#bl1-4), [BR1-1](#br1-1).

- A. Treat the first substantive migration into the current schema as a first-build review when prior coverage does not cover the current risk areas; otherwise use the normal consistency update. Main author applies confirmed/mechanical notes; unresolved choices become OIs. Preserve existing table numbers and append new ones. Updated By names the actual editor/runtime; approvers remain user-named only. Explicit rules with a migration coverage check.
- B. Every migration gets a fresh full review, regardless of prior coverage; keep editorial/table/credit decisions case by case. Simple review trigger, with higher repeated cost and remaining author variation.
- C. Existing BRDs get consistency-only migration; require a full review only when chunk 13 is missing. Lower cost, but prior review coverage can survive a substantially changed schema without scrutiny.

Recommendation: **A**. A distinguishes authored migration from shape conversion and preserves useful prior review. Editorial ownership, table numbering and credit are subparts of this choice; none authorizes new product behavior.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/transform-detection.md`, `brd-unifier/sow-transformation.md`, `brd-unifier/chunks/00-cover-and-changelog.md`, `brd-unifier/chunks/13-open-items-and-clarifications.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D04

**New persona and UC completeness.** Findings: [BL1-5](#bl1-5).

- A. A whole-persona/UC recommendation includes its journey, nine UC sections, summary/matrix effects and source links. Unknown behavior stays an explicit proposal/question; acceptance of an incomplete bundle does not confirm invented answers. More complete review handoff.
- B. Permit partial recommendations; create TD rows for missing sections and obtain separate owner decisions before the gate opens. Smaller recommendation, more follow-up work.

Recommendation: **A**. A gives the author a reviewable complete bundle while keeping every unresolved business choice visible. It does not require a reviewer to guess missing requirements.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/chunks/13-open-items-and-clarifications.md`, `brd-unifier/use-case-quality.md`, `brd-unifier/TEMPLATE-COMBINED.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D05

**UI defaults versus product requirements.** Findings: [BL1-6](#bl1-6), [BR1-7](#br1-7).

- A. Source and confirmed project UI rules govern. Unstated paging/export/filtering/responsive behavior is a labelled proposal for confirmation, not a silently added requirement; no tablet minimum is injected when the source excludes it. Preserves scope, with more explicit questions.
- B. Keep the skill minimum of desktop/tablet/mobile and define paging/export defaults as mandatory unless the user opts out. Consistent baseline, with automatic product scope growth.
- C. Keep the responsive minimum only; turn data-table placeholders into optional examples. Smaller change, but the source-versus-responsive conflict remains a decision on each run.

Recommendation: **A**. A follows the existing no-invention/project-conflict rules and works with the test PM policy. Apply the choice to chunk 11, combined output and step 4 breakpoint rules together.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/chunks/11-summary-and-uiux.md`, `brd-unifier/TEMPLATE-COMBINED.md`, `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/14-todo.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D06K

**BRD key location.** Findings: [BL1-8](#bl1-8).

- A. Retain SDD assignment of stable BRD keys in its Source BRDs register. No BRD schema edit.
- B. Add a BRD-owned key field and a reconciliation rule when importing it into the SDD. Earlier key discovery, with a cross-skill schema/ID migration.

Recommendation: **A**. A is already defined and the reported condition is expected. This is a retain decision, not a proposed fix.

Proposed implementation scope after approval: `sdd-unifier/chunks/00-cover-and-changelog.md`, `sdd-unifier/brd-to-sdd.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D06

**Migration history and portability.** Findings: [BR1-2](#br1-2), [BR3-5](#br3-5).

- A. Bundle a read-only reference snapshot in the output tree and link it from Appendix. Keep available old OI records without fabricating missing options/Why; label incomplete historical records. Revalidate gate evidence against current rules. Preserve original TASK/TC IDs/results unless an explicit collision mapping is needed. Portable and auditable, with extra source files.
- B. Keep read-only links to original sources only when the user confirms those paths will be distributed with the output; otherwise request a bundle. Use the same history/evidence/ID rules. Smaller package, with a deployment-path dependency.

Recommendation: **A**. A matches the fixture source-folder solution and avoids broken external scratch links. Old test results are retained as historical evidence, not silently accepted against changed requirements.

Proposed implementation scope after approval: `brd-unifier/sow-transformation.md`, `brd-unifier/delivery-chunks.md`, `brd-unifier/decision-log.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D07

**Open remainders after any answer.** Findings: [BR1-4](#br1-4).

- A. Every live answer remainder gets a TD with owner/source pointer. A business choice also gets the existing full OI schema; a missing fact stays TD-only. The companion keeps settled-part history. Makes all unfinished work visible to the gate.
- B. Retain the special route for business-review remainders only; other partial answers stay in their existing markers/records until the user requests a follow-up. Less to-do bookkeeping, with possible undiscovered open work.

Recommendation: **A**. A reuses the existing choice-versus-fact distinction and closes the route gap without duplicate decision narratives.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/delivery-chunks.md`, `brd-unifier/decision-log.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D08

**Assumption resolution evidence.** Findings: [BR1-6](#br1-6).

- A. Resolve an assumption when the owner confirms it, replaces it, removes the dependent scope, or explicitly accepts it conditionally with owner, condition and consequence recorded. If behavior remains undecidable, TD stays open. Clear business disposition without pretending outside delivery occurred.
- B. Resolve only after external factual verification. Stronger evidence, but a documented conditional business assumption can block the requirements gate indefinitely.

Recommendation: **A**. A mirrors dependency disposition while requiring a concrete choice and consequence, not a status word.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/14-todo.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D09

**Reviewer source provenance.** Findings: [BR1-8](#br1-8).

- A. Pass project/default paths to the reviewer. Every borrowed standard cites an available file/section; harness-global or unavailable sources are explicitly disclosed and treated as proposals when they change requirements. Traceable evidence, with a slightly longer reviewer brief.
- B. Let the reviewer use global defaults freely but name them as defaults in Why. Simpler prompt, with more scope proposals unrelated to the supplied project.

Recommendation: **A**. A prevents an absent project standard being presented as fact while allowing justified, disclosed proposals.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/chunks/13-open-items-and-clarifications.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D10

**Mockup reopening.** Findings: [BR2-1](#br2-1).

- A. Reopen only rows whose actor-visible flow, state, rule, role or content changes; record an impact comparison for a diagram-only change that preserves approval. Precise invalidation, requiring evidence of unchanged screen behavior.
- B. Keep blanket reopening after UC changes but schedule the final mockup approval after diagram/C9 fixes. Easier invalidation rule, with a revised recommended order.
- C. Retain current parallel order and blanket reopening. No policy change, with repeated approvals accepted as the cost.

Recommendation: **A**. A protects real changes while preserving valid approvals for unchanged screens. It cannot turn a guessed or unobserved mockup review into approval.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/14-todo.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D11

**Gate status and completed-row evidence.** Findings: [BR2-3](#br2-3), [BR3-1](#br3-1).

- A. Keep completion evidence when that row's inputs are unchanged. Overall gate closure pauses downstream generation; only new/unstarted rows say Pending gate, and changed rows reopen In progress. Recheck step 2 after content work, then reverify G1-G5. Preserves valid history and clear current gating.
- B. Reset steps 4/5 to Pending gate whenever G1-G3 fail, retaining their old approvals only in history. Simpler state rendering, with repeated reapproval even for unchanged rows.

Recommendation: **A**. A aligns the refresh input rule with evidence preservation. A completed row never overrides a failed overall gate condition.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/14-todo.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D12

**Version and date conventions.** Findings: [BR2-2](#br2-2), [BR3-7](#br3-7), [R1-2](#r1-2), [TX-01](#tx-01).

- A. Preserve semantic content versioning. Link-only Figma edits and diagram layout/splits preserving every rule/actor/path are editorial; changed business labels/branches are content. Use the first content-change date for the update row, keep later actual event dates in logs, and write Chunks: none (initial build) on initial rows. Stable versions with explicit examples.
- B. Version every physical edit in body chunks, including diagram/layout/link edits; use the handoff date for the row. Simpler file-change accounting, with more bumps and downstream refreshes.

Recommendation: **A**. A follows the central content rule and the CHK solution. It still requires scope/trace checks for editorial edits; unchanged meaning must be demonstrated. SDD/LLD initial-row examples should use the same explicit none spelling.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/delivery-chunks.md`, `brd-unifier/mermaid-diagrams.md`, `sdd-unifier/SKILL.md`, `lld-unifier/SKILL.md`, `cover/changelog examples`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D13

**Missing path versus optional new behavior.** Findings: [BR2-4](#br2-4).

- A. Check termination/rejoin for choices the narrative actually asks the actor to make. Missing outcomes are owner questions, never invented branches. A new decline/cancel path not implied by supplied behavior is a scope candidate, not automatically a must-fix. Preserves stated behavior.
- B. Require an explicit decline path for every confirmation/control, even when unstated, with an owner decision before generation can finish. Broader completeness standard, with more scope/gate work.

Recommendation: **A**. A improves the documented-path test without requiring the checker to invent behavior for every possible UI action.

Proposed implementation scope after approval: `brd-unifier/use-case-quality.md`, `brd-unifier/mermaid-diagrams.md`, `brd-unifier/delivery-chunks.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D14

**Tasks and cases without a UC.** Findings: [BR2-5](#br2-5), [BR3-3](#br3-3).

- A. Add Requirement delivery tasks for an in-scope report/integration/other stated section capability. Cite the source section and actor; allow the test trace cell to cite that requirement section or NFR. Keep UC-driven task rules for actual UCs and never mint a UC for reporting. Explicit non-UC support.
- B. Expand Cross-cutting to cover any section-derived capability even for one persona/no UC, and allow section references in case trace. Smaller type vocabulary, with a less literal meaning of Cross-cutting.

Recommendation: **A**. A keeps task types clear and matches the LLD non-UC Workflow path. Update verification and examples with the chosen type so no checker forces fabricated UC IDs.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/15-implementation.md`, `brd-unifier/chunks/16-uat-bat-test-cases.md`, `brd-unifier/TEMPLATE-COMBINED.md`, `LLD trace/checker examples as needed`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D15

**Bounded reviews and scope suggestions.** Findings: [BR2-7](#br2-7), [BR2-8](#br2-8), [R1b-1](#r1b-1).

- A. Keep the full baseline review/check for a request, then use scoped verification of its accepted corrections and newly exposed necessary gaps. Separate stated-behavior gaps from optional scope candidates; only the former are must-fix gate work. Keep required unanswered facts/owner questions visible and stop at the declared limit. Bounded convergence without weakening stated requirements.
- B. Retain current fresh adversarial delta checks after each content change and rely on the PM to reject optional scope every time. Less skill change, with repeated proposal/reapproval loops.
- C. Keep reviewing until no item remains, without a hard pass limit. More repeated scrutiny, with no predictable stopping point.

Recommendation: **A**. A targets the observed loops while preserving a real full review and blocking actual unresolved requirements. A scope candidate is not quietly applied or moved into product scope; it requires an explicit owner choice. Combine with D02 for the third-run boundary and D22 for person-only facts.

Proposed implementation scope after approval: `brd-unifier/SKILL.md`, `brd-unifier/delivery-chunks.md`, `sdd-unifier/SKILL.md`, `reviewer templates/coverage rules`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D16

**One logical UC in multiple diagram views.** Findings: [BR3-4](#br3-4).

- A. Allow connected numbered views under the same UC Flowchart section. Preserve the original figure anchor, add stable figure IDs, name continuation nodes, and check the union of all nodes/edges against the narrative. Matches the proven CHK split.
- B. Keep one Mermaid block per UC and make large UC flowcharts an explicit size-cap exception. Easier continuity, with less readable long blocks.

Recommendation: **A**. A keeps every source path and readable sizes. Physical splitting alone does not change meaning or reapprove screens under D10/D12.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/mermaid-diagrams.md`, `brd-unifier/use-case-quality.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D17

**Report screen references.** Findings: [BR3-6](#br3-6).

- A. A screen with no UC cites its MK and owning report/requirement section. Its Figma link remains in chunk 14 and the owning section as appropriate; G4/frame checks accept those refs. No invented UC.
- B. Require every report screen to be assigned a new or existing UC before mockup approval. Uniform UC labels, with business/ID authoring required solely for the gate.

Recommendation: **A**. A matches the current report suites and downstream screen-only routes. It changes the exception wording, not the underlying product behavior.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/14-todo.md`, `brd-unifier/TEMPLATE-COMBINED.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D18

**Unchanged grilling confirmation.** Findings: [BL2-1](#bl2-1).

- A. Record a no-change confirmation in the existing decision/evidence history only. New or changed choices without an OI still get TD and normal application evidence. Less artificial backlog.
- B. Give every confirmation its own resolved TD even when nothing changed. Uniform audit rows, with more tracking noise.

Recommendation: **A**. A keeps confirmation traceable without making a new question where the owner merely reaffirmed a settled rule.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/decision-log.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D19

**Same-day ordering evidence.** Findings: [BL2-2](#bl2-2), [R1b-4](#r1b-4).

- A. Define a run/session as one request through its handoff. Record an ordered check/reconciliation entry tied to the final relevant content revision (hashes or explicit change/check order). Dates remain display fields, not sole proof of ordering.
- B. Require UTC timestamps for every content edit and check. Easy time comparison, with more timestamp bookkeeping and reliance on consistent clocks.

Recommendation: **A**. A fits existing run numbers and stage hash audits, and proves the actual version was checked even after a pause on the same day.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/14-todo.md`, `sdd-unifier/SKILL.md`, `sdd-unifier/chunks/sdd-master.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D20

**Unrequested delivery output.** Findings: [BL2-3](#bl2-3).

- A. Keep Locked for a never-written/unrequested chunk, with a note that the overall gate is Open and the output was not requested. No state schema change.
- B. Add Not requested as a distinct state in all three state locations and readers/checkers. Clearer vocabulary, with a cross-file state migration.

Recommendation: **A**. A is already supported by the Locked definition. No fix is required beyond a helpful handoff note.

Proposed implementation scope after approval: `brd-unifier/chunks/14-todo.md`, `brd-unifier/delivery-chunks.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D21

**Business confirmation and execution readiness.** Findings: [BL2-5](#bl2-5).

- A. Keep case-only data in Needs/P prerequisites. Define Confirmed dependency as the agreed source/owner/treatment; in place requires actual readiness evidence at its Build/BAT/go-live milestone. The requirements gate can close on a business disposition without claiming delivery.
- B. Put all prerequisite data into task start conditions and treat Confirmed as delivered. Simpler single prerequisite list, but later-case data can block early building and a business answer can overstate delivery.

Recommendation: **A**. A matches current per-case readiness and the two task milestones. It clarifies terminology without creating a new delivery gate.

Proposed implementation scope after approval: `brd-unifier/delivery-chunks.md`, `brd-unifier/chunks/02-glossary-assumptions-facts.md`, `brd-unifier/chunks/16-uat-bat-test-cases.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D22

**Named-owner legal/factual handoff.** Findings: [R1-1](#r1-1).

- A. Keep required markers blocking until the named owner supplies an answer; show the exact question, location, dependent output and next owner action. Use named fixture answers only in an explicitly authorized test run. No invented legal/provider/business facts.
- B. Allow a documented owner-deferred question to remain while opening the E2E gate, with the omission/risk visible. Faster topology output, but changes current gate and compliance posture.

Recommendation: **A**. A preserves the existing no-invention rule and adds the missing concrete handoff. No legal basis is recommended or validated by TRIAGE.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/chunks/13a-service-detailed-template.md`, `SDD gate/handoff examples`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D23

**Semantic versus location-based E3.** Findings: [R1b-2](#r1b-2), [R1c-4](#r1c-4).

- A. Gate unresolved values that the E2E consolidation depends on, following source references regardless of chunk location. List each blocker and owner. Preserve the explicit external-placeholder exception for a named black box with API IDs only. Prevents bypass by moving a marker.
- B. Block on every body marker anywhere. Strong simple rule, but runbook, capacity and deployment/library questions also prevent topology output.
- C. Keep the current physical 09-13x/7.3 boundary and explicitly label the gate as topology/contract consolidation only, with a separate unresolved-value inventory. Minimal change, with placement still affecting passage.

Recommendation: **A**. A ties blocking to what the consolidation actually asserts. The implementation brief must define that dependency test and retain the black-box exception, so this is a design decision, not a mechanical regex patch.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/chunks/18-open-items-and-clarifications.md`, `sdd-unifier/chunks/19-e2e-system-design.md`, `gate checker policy after approval`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D24

**Infrastructure contract scope.** Findings: [R1-3](#r1-3).

- A. Explicitly scope API-NN to domain/provider integration interfaces. Standard operational infrastructure use (database/Vault/IAM client/token operations) stays in ecosystem/security/operational configuration; a custom business integration cannot claim that exemption. Clear ownership without invented infrastructure contracts.
- B. Give every real synchronous HTTP infrastructure operation an API-NN and coverage row, including IAM admin/token operations. More exhaustive contract inventory, with many standard provider contracts and external placeholders.

Recommendation: **A**. A explains the generated fixture's boundary and narrows the broad reviewer wording. The original claim that the current template already states the exception is corrected in the finding.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/chunks/11-api-contracts.md`, `sdd-unifier/TEMPLATE-COMBINED.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D25

**Targeted SDD update endpoint.** Findings: [R1b-3](#r1b-3).

- A. Retain the common tail: relevant 6a reconciliation, delta review for semantic body changes, answer/marker handling, then 8b gate/status check and handoff. Add pointers in shorter target/transform rows. Existing policy, clearer navigation.
- B. End targeted updates with Stale status only and require a separate explicit E2E request to run 8b. Shorter updates, with a changed handoff policy.

Recommendation: **A**. A is already strongly stated in the current preamble and step 8 tail. The proposed edit is a pointer clarification, not a new automatic gate bypass.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/transform-detection.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D26

**Content lists and companion version.** Findings: [R1b-5](#r1b-5).

- A. List 18 when review content/status meaning changes; list 00 only when its content changes beyond synchronization. Exclude routine metadata/index/footer maintenance. A rewritten decision-log header records the current parent version, without a separate bump for decision/process tracking alone. Explicit examples, one semantic version rule.
- B. List every physically changed numbered file, including synchronized 00, and give the companion its last-changed version. Simpler physical inventory, with Chunks lists that mix semantic edits and metadata.

Recommendation: **A**. A preserves semantic Chunks lists and current-document metadata. Define header-only synchronization separately so it cannot trigger another version.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/decision-log.md`, `brd-unifier/decision-log.md`, `lld-unifier/decision-log conventions`, `cover/changelog examples`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D27

**Already-up-to-date E2E path.** Findings: [R1c-1](#r1c-1).

- A. Verify gate and source/current-output identity; if already current, keep chunk 19 and its version, report no change. A separately requested review still runs and any actual fix follows normal version rules. Avoids identical rewrites.
- B. Always regenerate and rerun faithfulness on explicit generate/refresh, even when identical. More fresh scrutiny, with repeated work and possible unrelated findings/version changes.

Recommendation: **A**. A separates a request for current consolidation from a request for another adversarial review. Store enough input identity/order evidence to justify the no-op.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/chunks/sdd-master.md`, `sdd-unifier/TEMPLATE-COMBINED.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D28

**Partial marker answers.** Findings: [R1c-2](#r1c-2).

- A. Apply the settled part, narrow the inline marker to the remaining question with its owner, and record both parts in the companion. The remainder still blocks where applicable. Accurate partial state.
- B. Keep the entire original marker until all parts are answered, recording partial answers only in the log. Less marker editing, with answered text continuing to look unresolved.

Recommendation: **A**. A matches the historical run technique and preserves a real unresolved remainder rather than removing the whole marker on partial acceptance.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/decision-log.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

### D29

**Faithfulness source corrections and review.** Findings: [R1c-3](#r1c-3).

- A. A correction with one unambiguous source of truth uses the current faithfulness check, Changes Log and affected 6a recheck; it does not start a fresh adversarial hunt. A new choice or substantive design change gets an OI/answer and the normal scoped delta review. Clear exception with no silent design changes.
- B. Every source-body correction after faithfulness starts another delta review, including mechanical pointers/counts. Uniform review trigger, with repeated loops after purely mechanical fixes.

Recommendation: **A**. A reconciles the explicit 8b mechanical-correction path with the general semantic update path. Keep the evidence/ambiguity test strict, not an excuse to skip review of actual design changes.

Proposed implementation scope after approval: `sdd-unifier/SKILL.md`, `sdd-unifier/decision-log.md`. All skeleton changes must be reflected in combined/chunk forms and affected readers; these are proposed destinations, not edits made by TRIAGE.

## Later-stage evidence and excluded duplicates

- R2 produced eight document OIs, accepted seven and rejected one under the test policy. These are implementation-document repairs, not eight additional skill defects. Runtime adaptations, source-version/provider/security flags and the explicit initial Chunks spelling are covered by the existing rows and limitations, not new scope.
- CHK identified rule violations in run output and parser/membership/lineage/delivery-version/Mermaid-counting issues in checkers. Approved fixes and 14 checker regressions are recorded in codex-log.md:137 and :169. Its 16 known check_e2e problems were all checker defects, partitioned 5 module-context + 6 declared subscriber omissions + 4 already-drawn POS self-edges + 1 no-topic pointer branch. They are not 16 unresolved skill findings. The old 5 + 7 + 3 + 1 split is corrected in that log. TX-01 is the remaining skill wording conflict verified during this triage; it changes no prior CHK decision.
- R3a's 25 panel comments merged into six business decisions, five Applied and one Rejected. They concern fixture report/cap/staff requirements, not skill rule defects. The explicit owner-status override for one rejection follows the user's test instructions; it is not evidence that the reviewer skill's owner-only rule is generally wrong.
- R3b corrected fixture indices/counts/source citations and completed three consistency runs per BRD. Its temporary checker gaps were expected owner handoffs. R3c fixed two unkeyed coverage-note references at their source; this was a run error under an existing rule. R3d cleared all seven trace gaps and updated its own parent row. None adds a distinct skill finding beyond the verified rows above.
- Same-context reviewer passes, noninteractive fixture values and heuristic-only Mermaid checks were authorized runtime adaptations. They are recorded as limits, not represented as independent review or real owner/legal/mockup approval. TRIAGE does not validate a legal basis or recommend one.

## Decision and write boundary

No skill, checker, run document, saved run, baseline, README or plan record was changed. The authorized writes are this file, the appended stage report in codex-log.md and TRIAGE backup/audits. Current source hashes and every cited path/line are recorded in the audit. Findings-triage.md does not retire or alter B-findings.md/R-findings.md.

Only approved M/S changes and D choices will be applied. Retain/no-change dispositions need no patch. The fixture accept-all policy does not approve these skill decisions. Next action after this stop is the approved TRIAGE implementation, if requested. FINAL runs only after a separate explicit go and completion of any required approved fixes. The after-Codex prompt stays unrun until FINAL is finished. No commit or push.
