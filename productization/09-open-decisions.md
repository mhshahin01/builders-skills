# 09. Open decisions

Cross-skill divergences found by the 2026-10-07 consistency audit. Each is a product decision: align the skills, or productize the difference deliberately. Each entry gives context, options, a recommendation, and the product impact. Nothing in this file blocks the build; the guide documents current behavior everywhere.

## Applied fixes (closed on 2026-10-07)

The internal drift items were fixed in the skills before this guide was written, verified by greps and `check_refs.py` (256 references, 0 problems):

1. `brd-unifier`: consistency check renamed C1-C8 to C1-C10 (SKILL.md:258, README.md:65); chunk 17 DEPENDS_ON now includes 16; `TYPE: Delivery chunk - living checklist` documented in chunking.md; "Appendix > Technical Inputs" corrected to "Appendix §"; canonical "Users & Use Cases Matrix" name in README.
2. `sdd-unifier`: local path `W:\ITV\...` removed from SKILL.md:19; Specs path corrected to `../lld-[lld-slug]/17-specs.md`; bold/plain `[NEEDS CLARIFICATION]` equivalence stated at SKILL.md:89; the `Open`/`Shut` handoff shorthand mapped to gate-line values at SKILL.md:350.
3. `lld-unifier`: derived-view list at SKILL.md:92 aligned to the canonical list in sdd-to-lld.md; modes.md partial-mode wording now names the canonical placeholder.

The decisions below remain open.

## D1. One vocabulary for format, generation, and direction

**Context.** "Mode" means output mode (BRD/SDD), appears in "mode dimensions" (LLD modes.md), and names the direction field (LLD `Mode` metadata, mapped to the SDD's `Direction` column). BRD/SDD say "output mode" and "generation option"; LLD says "output shape" and "direction"; Discovery says both "mode" and "output shape" (pre-brd-unifier/SKILL.md:45-46; pre-brd-unifier/modes.md:3).

**Options.**
- a) Adopt the platform vocabulary (format / generation / direction) in the product only; skills keep their terms and the UI maps them. Fastest; the mapping is in `08-states-and-vocabulary.md` § 1.
- b) Also rename in the skills: LLD `Mode` field to `Direction`, "output shape" to "output mode". Cleaner long-term; touches templates, checkers, and existing documents that carry the `Mode` field.

**Recommendation:** a) now, b) at the next skill major revision. **Product impact:** the agent run view and artifact parsers need the mapping table regardless.

## D2. Implementation Designer has no parts-mode

**Context.** Requirements and Architecture generate in three reviewed parts with hard checkpoints. The Implementation Designer generates in one run (its interactive axis is direction, not parts).

**Options.**
- a) Document as designed: LLD generation is single-pass because its content is per-service and derived from an already-reviewed SDD.
- b) Add a parts option to lld-unifier (for example: foundations, per-service files, cross-cutting + Specs). More symmetry, real template work.

**Recommendation:** a). The SDD's own parts already gave the human two checkpoints before the LLD exists; a third document-level checkpoint adds little. **Product impact:** the run view shows no part checkpoints for this agent; do not render a parts control for it.

## D3. Implementation Designer has no decision register

**Context.** BRD and SDD keep a `decision-log.md` companion (principle: the register tells the story, the body states the settled rule). The LLD records decisions in chunk 15 §18.4 (OQ-NN) and the chunk 18 Resolution Log.

**Options.**
- a) Document as designed: the LLD's decision volume is lower and chunk-local; its register is the flag index.
- b) Add a `decision-log.md` to lld-unifier for symmetry.

**Recommendation:** a), revisit if LLD updates become as decision-heavy as BRD updates. **Product impact:** the decision-history panel reads from different homes per document (table in `08` § 1); no unified register file exists for the LLD.

## D4. Open-item schema and the missing acceptance loop in the LLD

**Context.** BRD/SDD reviewers produce `Recommended Answer` (paste-ready) with a six-value status enum and a mandatory batched acceptance loop. The LLD reviewer produces `Recommendation` with a three-value enum (`Open / Resolved / Deferred`) and answers are applied "in the same update" without a formal loop. The LLD also moves items on a refresh (`Settled by`, `Superseded by`, `Reopened by`, lld-unifier/sdd-to-lld.md:204), which a unified card must model. Discovery's chunk 24 has a fifth enum (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:29) and, by design, no acceptance loop: its items reach the BRD as markers (the skills' root README.md:54).

**Options.**
- a) Unify on the BRD/SDD schema and loop for all three (rename the LLD field, extend its statuses, add the loop). One review UI component for the whole suite.
- b) Keep the LLD's lighter model and build two UI modes.

**Recommendation:** a). The acceptance loop is the suite's signature interaction; fragmenting it complicates the decision queue. This is the biggest single alignment win. **Product impact:** with (a), one OI card component serves the BRD, SDD, and LLD agents; with (b), two. Either way, Discovery needs a no-loop variant.

## D5. Review pass limits differ (3 / 3 / 2)

**Context.** Requirements: at most three consistency runs per session. Architecture: at most three review passes per request. Implementation Designer: at most two.

**Options.**
- a) Keep per-agent limits, displayed in the run view.
- b) Unify at three everywhere.

**Recommendation:** a). The limits encode real workflow differences (the LLD has no third-pass discovery mechanism). **Product impact:** the run view should show the remaining pass budget per agent; hard-code the per-agent value, not a global one.

## D6. Merged-file location differs

**Context.** BRD and SDD write `*-MERGED.md` inside the chunk folder (relative links keep working). The LLD writes it at the project root and rebases links (`lld-unifier/chunking.md:139,157`). The pre-BRD also writes its merged file at the project root (`PRE-BRD-[ProjectName]-v1.1-MERGED.md`, pre-brd-unifier/modes.md:31).

**Options.**
- a) Keep both conventions; document which agent does what (this guide does).
- b) Move the LLD merged output into `lld-[slug]/` for symmetry (link rebasing already exists, so the move is small).

**Recommendation:** b) at the next lld-unifier revision; until then the artifact browser must look in both places (table in `08` § 7). Moving the LLD alone does not end the two-location lookup while the pre-BRD merges at the root. **Product impact:** one line of configuration per agent.

## D7. Two gap-marker families

**Context.** `[NEEDS CLARIFICATION: ...]` (Discovery, Requirements, Architecture; the proposal variants are Requirements only; the LLD carries these markers as `> TODO:`, and also turns an SDD item still `Decided - pending application` into a `> TODO:`, lld-unifier/sdd-to-lld.md:347) versus LLD-native `> Confirm:` / `> TODO:` / drift glyphs / `⚠ policy`. Architecture also has `[TBD - EXTERNAL: ...]` for provider-owned contract fields, with its own E3 rule (sdd-unifier/SKILL.md:321).

**Options.**
- a) Keep both families; the UI groups them under one "open questions" concept with per-family rendering.
- b) Unify syntax across all skills.

**Recommendation:** a). The LLD family carries confidence semantics the other family does not; merging would lose information. **Product impact:** the open-questions dashboard aggregates counts from both families (Discovery: marker count; BRD: marker count split gaps vs proposals; SDD: gap markers plus `[TBD - EXTERNAL]` placeholders; LLD: TODO + Confirm counts).

## D8. Three gate state vocabularies

**Context.** BRD chunk states (`Locked / Up to date / Provisional (TD-NN) / Stale`), SDD gate line (`Locked / Open - Up to date / Stale` with `Open`/`Shut` handoff shorthand), plus Review hand-off states (`To run / Done`).

**Options.**
- a) Map to one visual vocabulary in the UI (Locked, Blocked, Provisional, Stale, Current), sourced from the verbatim strings.
- b) Push one enum into the skills.

**Recommendation:** a). The strings are contracts other tools parse; remap in the UI layer only. **Product impact:** the gate dashboard needs the mapping table in `08` § 2.2.

## D9. Upstream coverage is asymmetric

**Context.** The Review Panel never reviews LLDs (structural, no opt-in) and the Architect never mentions the Discovery stage (grep-verified). A review that changes a pre-BRD reaches the BRD, but nothing in the SDD's own text acknowledges the Discovery artifact class.

**Options.**
- a) Accept as designed: LLDs are verified through their own reviewer and the trace checkers; the SDD meets pre-BRD content only through the BRD.
- b) Add an opt-in LLD review scope to business-reviewer-unifier; add a Discovery-aware note to the Architect's intake.

**Recommendation:** a), with one product-side addition: the lineage graph (`01` § 4) should display all four document classes regardless of review coverage, so the asymmetry is visible rather than hidden. **Product impact:** none on flows; one scoping label in the Review Panel's scope screen ("LLD folders are not reviewed").

## D10. Step numbers collide across skills

**Context.** Step 6a is the matrix build (BRD), the contract reconciliation (SDD), and the trace reconciliation (LLD). Step 8 is the acceptance loop (BRD/SDD), the presentation (LLD), and the Excel export (Discovery, pre-brd-unifier/SKILL.md:83).

**Options.**
- a) Use the canonical stage names in `08` § 8 everywhere in the product; never show raw step numbers.
- b) Renumber the skills (breaking change for every reference).

**Recommendation:** a), permanently. **Product impact:** stage names are product-level constants; the skill chapters map them to skill steps.

## D11. Discovery's zero-findings re-dispatch loop is uncapped

**Context.** The other review loops have explicit run or pass caps (three runs, three passes, two passes, one re-dispatch); the Requirements reviewer's re-dispatch is condition-based (an unchecked area or a finding without evidence) with no count cap (brd-unifier/SKILL.md:213). Discovery's chunk-24 reviewer rule is open-ended: "If it returns zero findings, re-dispatch with stronger adversarial framing" (pre-brd-unifier/SKILL.md:98), with no stated limit.

**Options.**
- a) Cap it in the product: two re-dispatches, then escalate to the decision queue with the evidence collected. No skill change.
- b) Also write the cap into pre-brd-unifier so the behavior is identical in and out of the platform.

**Recommendation:** a) now (this is what `02-agent-pre-brd.md` § 8 specifies), b) at the next pre-brd-unifier revision. **Product impact:** one run-view guardrail for the Discovery review job.

## D12. Hand-off Done evidence after the take-once check

**Context.** Found by the 2026-10-08 alignment audit. The Review Panel marks a hand-off row `Done` on the user's word or on the owner's own record: BRD, a consistency run in chunk 14 after the review; SDD, a Reconciled entry after the review; LLD, 16 §19.1 naming the new SDD version (business-reviewer-unifier/apply-and-verify.md:247-252). Since b4d6821 and 2bdbb90, the BRD and SDD first check, from their own records, whether an earlier update took the review, and answer a repeat as already taken, with the version that took it. The BRD reads a Changes Log row, a Business review register entry, or a chunk 14 consistency run whose Trigger names the review (brd-unifier/SKILL.md:318); the SDD reads a Changes Log row or a Reconciled entry (sdd-unifier/SKILL.md:373). The two sides read partly different records, so the launcher needs one rule. (Before 2026-10-08 a BRD take that changed nothing in chunks 00-13 wrote neither record the BRD's check read; the chunk 14 run was added to the check that day.)

**Options.**
- a) Accept either record as Done evidence, and treat an owner's "already taken" answer as Done.
- b) Use only the review's per-owner evidence list; an "already taken" answer leaves the row `To run` until that evidence exists.

**Recommendation:** a). A repeated launch then closes the row as a reported no-op instead of looping. **Product impact:** the launcher parses the owner's answer for "already taken" and the version that took it.

**Ruling (2026-10-08):** a), accepted by the user (decision log below).

## Decision log for this file

When the owner rules on a D-item, record the ruling here (date, choice, who decided) and update the affected chapters. This file is the guide's own small decision register.

| Date | Item | Ruling | Decided by |
|---|---|---|---|
| 2026-10-08 | D12 | Option a: either record counts as `Done` evidence, and an owner's "already taken" answer counts as `Done` (00 § 5.4, 06 § 10 updated). | The user (accepted the recommendation) |
| 2026-10-08 | Discovery hand-off lock | Kept as a product gate, labeled a product addition (the skill locks only the Excel export). | The user (accepted the recommendation) |
| 2026-10-08 | "Derive the SDD" launcher entry | Kept, labeled a product addition (brd-unifier emits no launcher phrase). | The user (accepted the recommendation) |
| 2026-10-08 | Reconciliation run log | Reduced to the step 6a result each Reconciled entry records; no per-check capture. | The user (accepted the recommendation) |
| 2026-10-08 | Product sign-off gate | None: sign-off stays the cover Status and the Changes Log's Reviewed/Approved By cells; the BRD gate stays G1-G5. | The user (accepted the recommendation) |
| 2026-10-08 | Skill fixes found by the audit | brd-unifier treats a SoW as TRANSFORM everywhere; its take-once check also reads a chunk 14 consistency run whose Trigger names the review; lld-unifier keeps an existing LLD's shape without asking. The guide chapters cite the changed lines. | The user (accepted the recommendation) |
