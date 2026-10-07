# Triage: sdd-core

## Summary

Scope: 38 finding IDs, of which 6 repeat another ID (D1 = S2-4i, D2 = S2-4a, D7 = S2-4f, S1 = C1, S7 = C7, and the first half of D9 = S2-4d), plus 4 new items. Since the step 2 base (86cab74), sdd-unifier changed only in two step 10 rows from step 5's option (c) (SKILL.md:343-344), so later work fixed nothing on this list. The new business-review row (SKILL.md:344) already uses the conditional Stale wording, which makes C1 a plain contradiction between rows.

**Status:** Present 37, Not reproducible 1 (S6), Fixed 0, Partly fixed 0. T7 is Present for its skill part; its doubled "and reports" is fixture content.

**Class** (by ID, a duplicate counted under each of its IDs):
- M 10: S2-4k, D8, D9, D11, C1, S1, C3, C7, S7, T4 (8 distinct fixes).
- S 17: S2-2, S2-4b, S2-4e, S2-4f, S2-4g, S2-4h, S2-4i, S2-4j, D1, D7, C4, C6, S4, S9, X1, T3, T7 (15 distinct fixes).
- D 10: S2-1, S2-4a, D2, S2-4c, S2-4d, D10, S3, S5, X2, T2 (9 distinct decisions).
- New items: N-1 to N-4, all M.

**D items:**
1. S2-1: ID rules in chunk 18, the Changes Log, and decision-log.md. Recommend one rule everywhere (keyed, use cases linked), stated in the reviewer brief and step 8.3, with no checker exemption.
2. S2-4a (= D2): the first-production-release profile gives two Q4 and two Q8 answers. Recommend modular monolith unless a stated driver needs a separate deployable; Q8 from the Technical Inputs or CLAUDE.md, else the simpler target.
3. S2-4c: proposed endpoints vs "never writes a per-service detailed spec from the BRD alone". Recommend proposing method and path (they are the §7.3 entry points), flagging request and response fields, and naming them as proposals at the part 2 stop.
4. S2-4d (= first half of D9): the API style ADR stays Proposed against the CLAUDE.md REST default. Recommend writing it Accepted from a stated default, like the §11 defaults; a marker only when no default states a style.
5. D10: nothing clears E3 markers in a first derivation. Recommend offering a proposed-answers pass for the 09 to 13x and §7.3 markers when the gate is shut on E3.
6. S3: author-raised open items vs "chunk 18 is never authored by the same context". Recommend that the author appends those items after the review pass.
7. S5: a source BRD whose cover is not Approved. Recommend asking once (recommended: proceed) and naming it in the handoff.
8. X2: step 6a has no data-model check. Recommend adding one: ERD vs Tables Design, `tenant_id` in shared-schema keys and indexes, NOT NULL for relied-on columns, Retention coverage.
9. T2: "leaving the rest untouched" vs back-fill in a targeted update. Recommend back-filling what the update makes wrong and naming those chunks in the Changes Log row.

**Apply notes.** Every quoted current text was checked to occur exactly once in its file, with no em dash in it. Some edits share a line with non-overlapping quotes, so they apply in any order: brd-to-sdd.md:45 (C7, T4), :69 (C3, S9), :88 (D8 twice). brd-to-sdd.md:430 is edited by S2-2; option A of S2-4c, if chosen, rewrites the same marker afterwards.

## Items

### S2-1: unlinked and unkeyed BRD IDs in chunk 18, the Changes Log, and the decision log

- Status: Present.
- Evidence:
  - SKILL.md:100 (principle 17) "Each use case the SDD cites carries its BRD key and links to its heading in that BRD".
  - SKILL.md:402 "never cites a BRD ID without its BRD key".
  - brd-to-sdd.md:34 "Every BRD reference carries its key, even when there is only one BRD".
  - The reviewer brief (SKILL.md:259) asks the reviewer to find "BRD references without their BRD key" in the SDD, but says nothing about the IDs the reviewer writes. The prompt skeleton (SKILL.md:270) says the same.
  - Step 8.3 (SKILL.md:286) lists what a decision-log record holds, with no ID rule. decision-log.md:101 even lists "Compact traceability references to stable IDs (OI-NN, ADR-NN, UC-NN, AP-NN)" unkeyed (N-2).
  - `_fixtures/checkers/check_sdd.py:75-106` checks every `.md` in the SDD folder, decision-log.md included. Its count went 37 (run-2026-09-30), 44 (3c), 50 (step 4), 68 (step 5) (`_fixtures/README.md:35`). The writers were the reviewer (chunk 18), the main agent (the Changes Log and decision-log records), and the business reviewer (decision-log records).
- Class: D
- Options:
  - A. One rule in every SDD file. Chunk 18, the Changes Log, and decision-log.md key every BRD ID and link every use case as brd-to-sdd.md § The link says. The reviewer brief and step 8.3 say so, and check_sdd stays as it is. Tradeoff: writers build anchors in history records too. The cost is low, because the decision log sits next to the chunks and uses the same relative paths.
  - B. Keys everywhere, links only in the numbered chunks (18 and 00 included). decision-log.md is exempt from links: it is a companion file, never merged, and its Rule home links lead into the chunks. check_sdd skips the link check (not the key check) for decision-log.md. Tradeoff: two rules, and a register you cannot click through.
  - C. Keys everywhere, and all three history places exempt from links. The checker exempts chunk 18, the Changes Log table, and decision-log.md from the link check. Tradeoff: a Recommended Answer pasted from chunk 18 brings unlinked IDs into content chunks (the 03:22 and 14:25 cases in step 4) unless the apply step links them.
  - D. The checker exempts all three from both checks, and the skill does not change. Tradeoff: this breaks SKILL.md:402; with two BRDs, "UC-02" is ambiguous.
- Recommendation: A. It is principle 17 and SKILL.md:402 as written, it needs no checker exemption, and the business reviewer's apply rule 6 ("table columns and ID schemes", business-reviewer-unifier/apply-and-verify.md:31) then holds it to the same rule.
- Files:
  - sdd-unifier/SKILL.md: the step 7 brief bullet (:259) and prompt skeleton (:270), one sentence each, for example "Write every BRD ID with its key and every use case as a link (brd-to-sdd.md § The link), so a Recommended Answer pastes as is."
  - sdd-unifier/SKILL.md: step 8.3 (:286), one clause saying the records and the Changes Log row follow the same ID rules.
  - sdd-unifier/decision-log.md: § Companion file rules, one bullet.
  - No change to check_sdd.py.

### S2-2: no rule against ID ranges

- Status: Present.
- Evidence:
  - No sdd-unifier file forbids ranges. A range's tail breaks the key rule at brd-to-sdd.md:34.
  - The skill's own example uses ranges: brd-to-sdd.md:407 "owner of UC-01..04 and of the ledger reads UC-08..09", :408 "owner of UC-05..07", :427 "derived from WALLET/UC-01..04 Main Flows", :430 "implied by WALLET/UC-01..04 acceptance criteria".
  - lld-unifier already has the rule: lld-unifier/sdd-to-lld.md:83 "List every test case ID, never a range".
- Class: S. Add a one-sentence "never a range" rule to rule 3 and remove the ranges from the example. Why: a range leaves its tail unkeyed and hides the middle IDs from a search, and lld-unifier already rules this way.
- Fix:
  1. brd-to-sdd.md / current: "SDD-owned IDs (`API-NN`, `ADR-NN`, `AP-NN`, `INT-NN`, `OI-NN`, risk IDs) carry no key." / new: "SDD-owned IDs (`API-NN`, `ADR-NN`, `AP-NN`, `INT-NN`, `OI-NN`, risk IDs) carry no key. BRD IDs are listed one by one, never as a range: `REFUNDS/NFR-01 to NFR-04` leaves `NFR-04` without its key and hides `NFR-02` and `NFR-03` from a search. Steps of one use case may be a range (`steps 3-5`)."
  2. brd-to-sdd.md / current: "owner of UC-01..04 and of the ledger reads UC-08..09" / new: "owner of WALLET/UC-01, WALLET/UC-02, WALLET/UC-03, and WALLET/UC-04, and of the ledger reads WALLET/UC-08 and WALLET/UC-09"
  3. brd-to-sdd.md / current: "owner of UC-05..07;" / new: "owner of WALLET/UC-05, WALLET/UC-06, and WALLET/UC-07;"
  4. brd-to-sdd.md / current: "derived from WALLET/UC-01..04 Main Flows," / new: "derived from the Main Flows of WALLET/UC-01, WALLET/UC-02, WALLET/UC-03, and WALLET/UC-04,"
  5. brd-to-sdd.md / current: "implied by WALLET/UC-01..04 acceptance criteria" / new: "implied by the acceptance criteria of the use cases it owns"
- Files: sdd-unifier/brd-to-sdd.md.

### S2-4a: "accept all" gave a hybrid (with D2)

- Status: Present.
- Evidence:
  - architecture-questionnaire.md:60, the First production release row: "Modular monolith, or Hybrid when one or two parts have clearly different scaling, failure, or release needs (for example, an external provider integration or a notification fan-out)", with Q8 "Managed container service or Kubernetes".
  - architecture-questionnaire.md:68 "When in doubt between two styles, recommend the simpler one". It covers style only and does not define "in doubt".
  - The examples (a provider integration, a fan-out) fit almost every BRD. The step 2 accept-all gave a hybrid on them alone (run-2026-09-30 decision-log.md:25), and the run's own reviewer raised OI-01 "The hybrid style rests on two unrecorded assumptions" (18:40).
  - SKILL.md:91 (principle 8): "for an MVP, POC, or small stable scope a modular monolith is usually the better fit".
- Class: D
- Options:
  - A. Tie-break by stated driver. In this profile, recommend Modular monolith unless a BRD NFR or Technical Input states a separate scaling, failure-isolation, or release need for one part. An external provider integration or a notification fan-out alone does not qualify; it becomes the ADR-01 extraction trigger. Q8: recommend the target the Technical Inputs or the CLAUDE.md defaults name (here Kubernetes, one Helm chart per deployable), else the managed container service. Tradeoff: fewer hybrids by default, with growth carried by the extraction trigger.
  - B. Recommend the walkthrough whenever the profile allows two answers, and show both. Tradeoff: one more interaction per derivation; no silent pick, but no default either.
  - C. Keep the hybrid condition and add only the Q8 tie-break. Tradeoff: most BRDs with a payment provider and notifications get a hybrid, so small systems get more deployables.
- Recommendation: A. Principle 8 and the existing "recommend the simpler one" rule already lean to the monolith, and the hybrid examples are too common to tell systems apart.
- Files: sdd-unifier/architecture-questionnaire.md (§ Recommendation rules: the First production release row, :60, and the "simpler one" rule, :68).

### S2-4b: the assumed Q2 team-count rule

- Status: Present.
- Evidence:
  - architecture-questionnaire.md:30 "An assumed Q2 counts as missing only when another team count would change the Q4 recommendation."
  - Read literally, "another team count" includes "Four or more teams", which moves any MVP or first release toward the platform-at-scale profile. So an assumed Q2 would always count as missing, and Accept all could never be recommended when the BRD is silent about teams.
  - The step 2 run read it as the next count ("two or three teams keep the same Q4 recommendation", run-2026-09-30 decision-log.md:23).
- Class: S. Name the next team count up. Why: it matches the run's reading and keeps the pre-filled assumption useful.
- Fix: architecture-questionnaire.md / current: "An assumed Q2 counts as missing only when another team count would change the Q4 recommendation." / new: "An assumed Q2 counts as missing only when the next team count up (one team to two or three, two or three to four or more) would change the Q4 recommendation."
- Files: sdd-unifier/architecture-questionnaire.md.

### S2-4c: derived API endpoints vs "never write a spec from the BRD alone"

- Status: Present.
- Evidence:
  - The prohibition:
    - SKILL.md:405 "Never writes a per-service detailed spec from the BRD alone. ... per-service detailed specs (DB Modeling, API list, Event Model) need architect input or are flagged."
    - brd-to-sdd.md:314 prescribes "`[NEEDS CLARIFICATION: full API list in OpenAPI form. ...]`" for the List of APIs.
    - parts-mode.md:101 "No per-service DB model, API list, or Event Model was invented from the BRD alone".
  - What §7.3 needs:
    - Entry points: "Method and path exactly as that list writes them" (brd-to-sdd.md:115). A missing entry point is a marker that keeps E3 shut (brd-to-sdd.md:122).
    - brd-to-sdd.md's own example contradicts itself: §7.3 shows `POST /v1/wallets/{walletId}/top-ups` (:420) while the API list is a marker (:430).
    - §14 already lets the derivation propose event names from use-case state changes (:302).
  - Every run proposed method and path and flagged only the field shapes (run-2026-09-30 13a-service-refund.md:198-210).
  - The user's global CLAUDE.md says "Do not invent endpoints, library APIs, or version numbers; verify or ask."
- Class: D
- Options:
  - A. Proposed endpoints. The derivation may propose each owned use case's endpoints (method and path, under the §15.1 conventions) as the §7.3 entry points. Request and response fields need architect input or a marker. The part 2 summary names the endpoints as proposals to review. Tradeoff: matches every run, §7.3, and E3, and the user confirms at the part 2 stop instead of writing them. It is a design proposal, which the user's rule might count as inventing.
  - B. Strict. The List of APIs stays a marker until the architect gives endpoints, every §7.3 Entry points cell is a marker, and E3 blocks. The example's §7.3 row is fixed to show the marker. Tradeoff: honours "do not invent endpoints" literally; a first derivation carries one marker per use case.
  - C. Propose, with a `proposed` mark per endpoint until the user confirms it. Tradeoff: explicit, but adds a column or status to the List of APIs template.
- Recommendation: A. §7.3 and E3 already require concrete entry points, §14 already proposes event names the same way, and the part 2 checkpoint is where the user confirms them.
- Files: sdd-unifier/SKILL.md (:405), sdd-unifier/brd-to-sdd.md (:171, :314, and the example marker at :430, after the S2-2 edit), sdd-unifier/parts-mode.md (:57 the part 2 summary, :101 the exit checklist).

### S2-4d: ADR-04 and ADR-08 left Proposed although CLAUDE.md states REST (first half of D9)

- Status: Present for ADR-04 (API style). ADR-08 (authorization enforcement) follows the rules, because no default states an enforcement approach.
- Evidence:
  - How the skill treats the defaults:
    - CLAUDE.md defaults seed §6 and are confirmed by the step 3c accept-all (SKILL.md:91, :160).
    - §11 defaults are applied and marked "default per CLAUDE.md" (brd-to-sdd.md:296).
    - Outside Claude Code, "use the defaults this skill states and flag the gap" (SKILL.md:31).
    - The templates already state REST: chunks/02-ecosystem-overview.md:43 "synchronous REST is reserved for true request-response", and the §15.1 URI pattern `/v{major}/` in chunks/11-api-contracts.md:27.
  - The conflict:
    - brd-to-sdd.md:291 still lists "Choice of API style (REST vs gRPC vs GraphQL) per service." among the ADRs the questionnaire and step 3c "leave open", each with a marker.
    - transform-detection.md:127 gives the matching example marker.
    - No §6 row holds the API style, so accept-all never confirms it.
  - Result: ADR-04 cites the CLAUDE.md default yet stays Proposed behind a marker (run-2026-09-30 06-principles-and-decisions.md:36).
- Class: D
- Options:
  - A. Treat the API style as a stated default. When CLAUDE.md (or, outside Claude Code, this skill's own doctrine) states REST with OpenAPI, the ADR is written from it as Accepted, with the source "default per CLAUDE.md", like the §11 defaults. The user still reviews ADRs at the part 1 stop (parts-mode.md:25). A marker only when a BRD mandate or the user asks for another style. Authorization enforcement keeps its marker. Tradeoff: one more default accepted without its own question; no template change.
  - B. Add an "API Style" row to the §6 table (chunk 02 and TEMPLATE-COMBINED §6), seeded from CLAUDE.md and confirmed in step 3c. Tradeoff: explicit confirmation, but it changes the §6 table that lld-unifier's Specs Tech Stack reads.
  - C. Keep the marker, and let its question carry the CLAUDE.md default as the recommended answer. Tradeoff: ADR-04 stays Proposed until someone answers. Chunk 06 markers do not block E3, so a Proposed ADR can become a chunk 19 doctrine home (V1 W7).
- Recommendation: A. The skill already applies every other CLAUDE.md default this way, and its own templates already state REST.
- Files: sdd-unifier/brd-to-sdd.md (§ SDD-only sections, §10, :289-292), sdd-unifier/transform-detection.md (:127, the "API style" example).

### S2-4e: the `candidate` legend

- Status: Present.
- Evidence:
  - chunks/10-events-hub.md:138 (and TEMPLATE-COMBINED.md:679): "candidate = name fixed, no consumer wired until the contract ratifies".
  - brd-to-sdd.md:302 has the derivation produce "candidate event names per UC state change (each flagged `candidate`)". That reads as a proposed name, not a fixed one. Meanwhile the Consumers column names consumers for an event that "no consumer" is wired to, and nothing says what makes a candidate committed.
  - The step 2 run filled the gap itself: "their names and consumers are designed, and each consumer is wired once its payload contract is ratified" (run-2026-09-30 10-events-hub.md:28). Step 4's CL-01 then ratified the contracts "as committed".
- Class: S. Define candidate as the run read it, with ratification as the move to committed. Why: it matches principle 14 (event names are stable once seen) and how steps 2 and 4 used the status.
- Fix:
  1. chunks/10-events-hub.md / current: "candidate = name fixed, no consumer wired until the contract ratifies;" / new: "candidate = name fixed; consumers may be named, but none is built against it until its payload contract (§14.9) is ratified, which makes it committed;"
  2. TEMPLATE-COMBINED.md / current: "candidate = name fixed, no consumer wired until the contract ratifies;" / new: "candidate = name fixed; consumers may be named, but none is built against it until its payload contract (§14.9) is ratified, which makes it committed;"
  3. brd-to-sdd.md / current: "candidate event names per UC state change (each flagged `candidate`)" / new: "event names per UC state change (each with Status `candidate` until its payload contract is ratified)"
- Files: sdd-unifier/chunks/10-events-hub.md, sdd-unifier/TEMPLATE-COMBINED.md, sdd-unifier/brd-to-sdd.md.

### S2-4f: the §7.3 Events column for use cases realised by a listener (= D7)

- Status: Present.
- Evidence:
  - brd-to-sdd.md:118 "| Events (§14) | 10 §14.5 "when" and the §14.10 When column | The event names, or `-` |".
  - The "when" is the step that fires the event (brd-to-sdd.md:100; chunks/10-events-hub.md:237 "This registry is the only home of the When"). So a use case realised by a listener, such as LOYALTY/UC-02 BR-1 applied when `RefundPaid` arrives, shows "-".
  - The step 2 run put `RefundPaid` in Events anyway (run-2026-09-30 03-users-and-use-cases.md:74) and stretched the §14.10 When cell.
  - A home already exists. The Entry points column allows `Event: [EVENT_NAME]` (brd-to-sdd.md:115), and lld-unifier reads a participating part from it: "Entry points here: [`Event: [EVENT_NAME]` as SDD §7.3 names it / None]" (lld-unifier/chunks/04-implementation-template.md:374).
- Class: S. State that a handled event is an Entry points trigger and that Events keeps fired events. Why: this uses the existing column rule and the form lld-unifier already reads, with no template shape change. It also gives the LLD's listeners an @UseCase (step 2 LLD item "listeners and jobs get no @UseCase").
- Fix:
  1. brd-to-sdd.md / current: "| Events (§14) | 10 §14.5 "when" and the §14.10 When column | The event names, or `-` |" / new: "| Events (§14) | 10 §14.5 "when" and the §14.10 When column | The events its steps fire, or `-`; an event the use case only handles (a listener that realises one of its parts, such as a business rule) is an `Event:` trigger in Entry points instead |"
  2. chunks/03-users-and-use-cases.md / current: "Events: the "when" citations in chunk 10 §14.5 and the When column of §14.10 (in-process domain events)." / new: "Events: the "when" citations in chunk 10 §14.5 and the When column of §14.10 (in-process domain events); an event the use case only handles is an Entry points trigger (Event: [EVENT_NAME])."
  3. TEMPLATE-COMBINED.md / current: "Events: the "when" citations in §14.5 and the When column of §14.10 (in-process domain events)." / new: "Events: the "when" citations in §14.5 and the When column of §14.10 (in-process domain events); an event the use case only handles is an Entry points trigger (Event: [EVENT_NAME])."
- Files: sdd-unifier/brd-to-sdd.md, sdd-unifier/chunks/03-users-and-use-cases.md, sdd-unifier/TEMPLATE-COMBINED.md. See also N-3.

### S2-4g: the 13b slug example in sdd-quality.md

- Status: Present.
- Evidence:
  - chunking.md:72 "Slug in kebab-case, derived from the service name."
  - The only example of a service named "...-service" drops the suffix: sdd-quality.md:208 "`[refund-service](./13b-service-refund.md)`". Read literally, refund-service would give `13b-service-refund-service.md`.
  - Every run used the short form (`13a-service-refund.md`).
- Class: S. State the suffix rule that the example and the runs follow. Why: no output changes, and the prefix already says "service".
- Fix: chunking.md / current: "- Slug in kebab-case, derived from the service name." / new: "- Slug in kebab-case, derived from the service name without a trailing `-service` (the prefix already says it): `refund-service` gives `13a-service-refund.md`."
- Files: sdd-unifier/chunking.md.

### S2-4h: the progress record has no whole-run completion field

- Status: Present.
- Evidence:
  - parts-mode.md:143 "In `whole` runs, **Generation:** reads `whole` and the Part table is left out; the Intent, Source, Reconciled, and E2E gate lines stay."
  - Parts get a Completed date (parts-mode.md:125-129), and step 9 reports completion dates for parts only (SKILL.md:314).
  - parts-mode.md:139 dates the Initial draft row for parts only ("dated when part 3 completes").
- Class: S. Point to the Changes Log's Initial draft row as the whole run's completion record. Why: no new field is needed, because a whole run is one run, so the date of its Initial draft row is its completion date. A Status line plus a resume path for interrupted whole runs is not recommended: the finding does not need it.
- Fix: parts-mode.md / current: "In `whole` runs, **Generation:** reads `whole` and the Part table is left out; the Intent, Source, Reconciled, and E2E gate lines stay." / new: "In `whole` runs, **Generation:** reads `whole` and the Part table is left out; the Intent, Source, Reconciled, and E2E gate lines stay. The Changes Log's Initial draft row, dated when the run completes, is the record of its completion."
- Files: sdd-unifier/parts-mode.md.

### S2-4i: Project Type has no recommended answer (= D1)

- Status: Present.
- Evidence:
  - SKILL.md:136-138 asks "Greenfield (new product, no existing code) or Brownfield (extending an existing codebase)? If brownfield, where is the codebase?" with no recommended option.
  - Every other question puts the recommendation first (SKILL.md:33, :152, :168), so a run that accepts every recommendation has nothing to accept here.
  - Both runs answered Greenfield because no BRD names an existing codebase (run-2026-09-30 01-executive-summary-scope-risks.md:30).
- Class: S. Recommend from the BRD evidence, as the runs did. Why: low impact, and it follows the house rule that every question carries a recommendation.
- Fix: SKILL.md / current: "> "Greenfield (new product, no existing code) or Brownfield (extending an existing codebase)? If brownfield, where is the codebase?"" / new: the same line, then a new paragraph indented three spaces: "Recommend Greenfield, listed first, when no source BRD names an existing codebase this system extends (external systems it only integrates with do not count); otherwise recommend Brownfield. Give the evidence in one line."
- Files: sdd-unifier/SKILL.md.

### S2-4j: the master is written before chunk 18

- Status: Present.
- Evidence:
  - SKILL.md:202 "in `whole` it is written once the chunks exist and updated after step 8. Chunks not written yet are plain text: `Pending (part N)`, or `Locked` for chunk 19 while the e2e gate is shut."
  - In `whole`, step 6a records the **Reconciled:** line in the master (SKILL.md:242) before step 7 writes chunk 18. So the master exists while chunk 18 does not, and `Pending (part N)` has no part number to give.
- Class: S. Write the master once 00-17 exist (step 6a needs it), and show chunk 18 as plain `Pending` until step 7 writes it. Why: step 6a's record stays where it is, and the interim gets one defined value.
- Fix: SKILL.md / current: "in `whole` it is written once the chunks exist and updated after step 8. Chunks not written yet are plain text: `Pending (part N)`, or `Locked` for chunk 19 while the e2e gate is shut." / new: "in `whole` it is written once chunks 00-17 exist, before step 6a records its **Reconciled:** line there, and updated after step 8. Chunks not written yet are plain text: `Pending (part N)` (in `whole`, `Pending` for chunk 18 until step 7 writes it), or `Locked` for chunk 19 while the e2e gate is shut."
- Files: sdd-unifier/SKILL.md.

### S2-4k: "serves" vs "drives" in §15.2

- Status: Present.
- Evidence:
  - chunks/11-api-contracts.md:85 (and TEMPLATE-COMBINED.md:865): "Use case ref (derive-from-BRD): the BRD use cases the call serves, ..., or "-" for a call no use case drives".
  - The two words give different §7.3 APIs cells. The step 2 run listed API-04, a scheduled import that serves but is not driven by a use case step, under LOYALTY/UC-01 and UC-02 (run-2026-09-30 11-api-contracts.md:88).
  - The rule home says "serves": brd-to-sdd.md:101 "The use case the call serves".
- Class: M
- Fix:
  1. chunks/11-api-contracts.md / current: "or "-" for a call no use case drives" / new: "or "-" for a call that serves no use case"
  2. TEMPLATE-COMBINED.md / current: "or "-" for a call no use case drives" / new: "or "-" for a call that serves no use case"
- Files: sdd-unifier/chunks/11-api-contracts.md, sdd-unifier/TEMPLATE-COMBINED.md.

### D1: Project Type has no recommended answer

- Status: Present (= S2-4i).
- Evidence: SKILL.md:136-138 (see S2-4i).
- Class: S
- Fix: see S2-4i.
- Files: sdd-unifier/SKILL.md.

### D2: two Q4 and two Q8 answers in the first-production-release profile

- Status: Present (= S2-4a; D2 adds the Q8 half, which option A of S2-4a covers).
- Evidence: architecture-questionnaire.md:60, :68 (see S2-4a).
- Class: D
- Options and recommendation: see S2-4a.
- Files: sdd-unifier/architecture-questionnaire.md.

### D7: §7.3 Events reads only the firing step

- Status: Present (= S2-4f).
- Evidence: brd-to-sdd.md:118 (see S2-4f).
- Class: S
- Fix: see S2-4f.
- Files: see S2-4f.

### D8: principle 17 "every cited UC is a link" vs the plain §7.3 Status cell

- Status: Present.
- Evidence:
  - SKILL.md:100 "Each use case the SDD cites carries its BRD key and links to its heading in that BRD".
  - The §7.3 Status value is plain: "`Merged into KEY/UC-NN` (keyed)" (brd-to-sdd.md:119; chunks/03-users-and-use-cases.md:53 and :68).
  - § The link names one exception (rule 6, Mermaid, brd-to-sdd.md:88) but not this one. check_sdd.py:91 already accepts it.
- Class: M (the template is clearly right; the rule's exception list just lacks it).
- Fix:
  1. brd-to-sdd.md / current: "6. **Diagrams.** Inside Mermaid blocks" / new: "6. **Diagrams and the §7.3 Status cell.** Inside Mermaid blocks"
  2. brd-to-sdd.md / current: "The links live in the text around the diagram and in §7.3." / new: "The links live in the text around the diagram and in §7.3. The §7.3 Status `Merged into KEY/UC-NN` is plain too: that use case's own row carries its link."
- Files: sdd-unifier/brd-to-sdd.md.

### D9: API style and authorization get markers; §6 flags rows with no CLAUDE.md default

- Status: Present.
- Evidence:
  - First half: see S2-4d.
  - Second half: brd-to-sdd.md:273 "For each missing row, fall back to user CLAUDE.md defaults if applicable, otherwise: `[NEEDS CLARIFICATION: <component> + version + topology]`." This contradicts SKILL.md:160 "Precedence per row: BRD Technical Inputs ... > user CLAUDE.md defaults > skill recommendation informed by the BRDs (NFRs, integrations, scale signals)" and chunks/02-ecosystem-overview.md:15 ("BRD-informed recommendations").
  - The run followed step 3c: the Caching, Object Storage, and Reporting rows read "recommended" (run-2026-09-30 02-ecosystem-overview.md:21-37).
- Class: M for the second half (step 3c and the chunk 02 selection flow are the procedure). The first half is D, under S2-4d.
- Fix: brd-to-sdd.md / current: "For each missing row, fall back to user CLAUDE.md defaults if applicable, otherwise: `[NEEDS CLARIFICATION: <component> + version + topology]`." / new: "For each missing row, fall back to user CLAUDE.md defaults if applicable, then to a recommendation the BRD evidence supports (SKILL.md step 3c, source `recommended`), otherwise: `[NEEDS CLARIFICATION: <component> + version + topology]`."
- Files: sdd-unifier/brd-to-sdd.md (and, for the first half, the S2-4d files).

### D10: a first derivation can practically never open the e2e gate (E3)

- Status: Present.
- Evidence:
  - SKILL.md:260: the reviewer "captures **external** findings only ... Inline `[NEEDS CLARIFICATION: ...]` markers stay where they are."
  - The acceptance loop walks only open items (SKILL.md:278-291), while E3 needs no marker in 09 to 13x or §7.3 (SKILL.md:302).
  - Nothing in steps 7 to 9 offers to clear those markers; step 9 only counts them (SKILL.md:325). brd-to-sdd.md:344 accepts that §24 "is normally absent from a first derivation".
  - Step 4 needed an outside architect agent and a decisions file (25 markers) to open the gate through the step 10 row at SKILL.md:338.
- Class: D
- Options:
  - A. Offer a marker pass on request. When the gate is shut on E3, the gate message (8b.2) and the handoff (step 9) offer: "I can propose an answer for each marker in 09 to 13x and §7.3; you accept or adjust them." The step 10 row "generate the e2e design" then takes "propose answers for the markers". A cleared-context agent writes the proposals, each with options, a Recommended Answer, and a Why (as step 4's A1 did). They are walked like open items and applied with the step 8 mechanics. Tradeoff: the first run still ends Locked unless the user takes the offer; existing mechanics are reused.
  - B. A mandatory marker loop (a step 8c) in every derive-from-BRD run, after the open items. Tradeoff: the first run can open the gate, but a 25-marker loop is long, and many answers are facts the architect may not have yet.
  - C. Status quo, with a pointer: the handoff names "fill in section Y now that I have decisions" as the way to clear markers. Tradeoff: no proposals, so the user writes every answer.
- Recommendation: A. It turns step 4's one-off path into an offer the skill makes, without lengthening every first run.
- Files: sdd-unifier/SKILL.md (step 8b item 2 at :304, the step 9 E2E gate bullet at :324, the step 10 row at :338). The home for marker decisions in the decision log is T1, which another checker owns.

### D11: decision-log.md, accept-all ecosystem "needs no record" vs a template that always has the section

- Status: Present.
- Evidence:
  - SKILL.md:171 "An "Accept all" with no override needs no register entry."
  - The canonical structure opens § Ecosystem selection record with "**Outcome, [YYYY-MM-DD]:** [Accept all | Walked through item by item]" (decision-log.md:50) and leaves out only the accepted rows (decision-log.md:57).
  - In derive-from-BRD the register always exists, because the questionnaire creates it. The step 2 run wrote the one Outcome line (run-2026-09-30 decision-log.md:31-33).
- Class: M (the template is clearly right).
- Fix: SKILL.md / current: "An "Accept all" with no override needs no register entry." / new: "An "Accept all" with no override gets only the Outcome line, and never creates the register on its own."
- Files: sdd-unifier/SKILL.md. See also N-1, the same split for the questionnaire record.

### C1: "mark chunk 19 Stale" is unconditional in the BRD update rows (= S1)

- Status: Present.
- Evidence:
  - SKILL.md:343 "rerun step 6a, mark chunk 19 `Stale`, bump the version."
  - brd-to-sdd.md:68 "Rerun step 6a, mark chunk 19 `Stale`, and bump the version with a Changes Log row." (:69 "Same ... `Stale` marking").
  - Everywhere else it is conditional: SKILL.md:304 (8b.2, `Stale` "if chunk 19 already exists"), :306 (8b.4, "marks an existing chunk 19 `Stale`"), and the step 10 rows at :337, :339, and :344 ("if it exists"). A2a kept the gate line `Locked`.
- Class: M
- Fix:
  1. SKILL.md / current: "rerun step 6a, mark chunk 19 `Stale`, bump the version." / new: "rerun step 6a, mark chunk 19 `Stale` if it exists, bump the version."
  2. brd-to-sdd.md / current: "Rerun step 6a, mark chunk 19 `Stale`, and bump the version with a Changes Log row." / new: "Rerun step 6a, mark chunk 19 `Stale` if it exists, and bump the version with a Changes Log row."
- Files: sdd-unifier/SKILL.md, sdd-unifier/brd-to-sdd.md.

### C3: the brd-to-sdd.md "new version" row omits the cross-BRD reconciliation

- Status: Present.
- Evidence:
  - SKILL.md:343 says, for both requests, "reconcile it against the other BRDs", and brd-to-sdd.md:68 ("Add BRD") says "Run the cross-BRD reconciliation".
  - brd-to-sdd.md:69 ("BRD <KEY> has a new version") never mentions it. X1 shows the kind of gap this misses.
- Class: M
- Fix: brd-to-sdd.md / current: "also repoint the register Link and every link into that file), then apply what changed in the BRD:" / new: "also repoint the register Link and every link into that file). With two or more BRDs, run the cross-BRD reconciliation on what changed. Then apply what changed in the BRD:"
- Files: sdd-unifier/brd-to-sdd.md.

### C4: a Glossary row per meaning vs reference-not-restate

- Status: Present.
- Evidence:
  - brd-to-sdd.md:56 "A §5 Glossary row per meaning, each citing its BRD, plus a `[NEEDS CLARIFICATION: ...]`."
  - The Glossary mapping says "Reference + delta. ... Business terms are not restated." (brd-to-sdd.md:230).
  - The 3c run restated each meaning next to its link (scenarios/sdd-version-tracking/after-sdd/sdd-refunds-platform/01-executive-summary-scope-risks.md:112-113).
- Class: S. One row per meaning that links its BRD's definition and adds only what tells the meanings apart. Why: the conflict stays visible, and one fact keeps one home.
- Fix: brd-to-sdd.md / current: "A §5 Glossary row per meaning, each citing its BRD, plus a `[NEEDS CLARIFICATION: ...]`." / new: "A §5 Glossary row per meaning, each linking its BRD's definition and adding only what tells the meanings apart (§ One fact, one home), plus a `[NEEDS CLARIFICATION: ...]`."
- Files: sdd-unifier/brd-to-sdd.md.

### C6: which handoff a targeted update gives

- Status: Present.
- Evidence:
  - SKILL.md:310 "In `parts`, parts 1 and 2 end with the short part summary ... This full handoff closes part 3, or a `whole` run."
  - The step 10 targeted updates (SKILL.md:337-344) name no handoff.
- Class: S. A short handoff that reports what the update touched. Why: low impact, and the step 9 lines already define each value.
- Fix: SKILL.md / current: "This full handoff closes part 3, or a `whole` run." / new: "This full handoff closes part 3, or a `whole` run. A targeted update (step 10) ends with a short one: the files it changed, the new version, the step 6a result, the E2E gate line, and each step 9 line whose value changed (for example, a Child LLDs row now out of date)."
- Files: sdd-unifier/SKILL.md.

### C7: the Child LLDs scope check prescribes no marker for a non-§13 entry (= S7, C1-6)

- Status: Present (reproduced in steps 2, 3c, and 4).
- Evidence:
  - brd-to-sdd.md:45 checks that "each scope service is a row in §13", but prescribes a marker only for a row "whose scope names a merged or removed service".
  - lld-unifier/sdd-to-lld.md:206 fills the column from "(§2.1 In Scope)", which held "Angular web app". check_lld_trace has reported that lineage problem since run-2026-09-30.
  - The column header is "Scope (§13 services)" (chunks/00-cover-and-changelog.md:39).
- Class: M (the header and sdd-unifier's check are clearly right).
- Fix:
  1. brd-to-sdd.md / current: "A row whose LLD is gone, or whose scope names a merged or removed service, stays and gets a `[NEEDS CLARIFICATION: ...]`;" / new: "A row whose LLD is gone, or whose scope names a merged or removed service or anything that is not a §13 row, stays and gets a `[NEEDS CLARIFICATION: ...]`;"
  2. CROSS-SKILL lld-unifier/sdd-to-lld.md / current: "| Scope (§13 services) | The services this LLD covers (§2.1 In Scope) |" / new: "| Scope (§13 services) | The SDD §13 services or modules this LLD covers, named as §13 names them; other in-scope items (a frontend app, for example) stay in the LLD's §2.1 In Scope |"
- Files: sdd-unifier/brd-to-sdd.md, lld-unifier/sdd-to-lld.md (CROSS-SKILL).

### S1: "mark chunk 19 Stale" unconditional

- Status: Present (= C1).
- Evidence: SKILL.md:343 (see C1).
- Class: M
- Fix: see C1.
- Files: see C1.

### S3: "chunk 18 is never authored by the same context" vs author-raised open items

- Status: Present.
- Evidence:
  - chunking.md:42: chunk 18 is "Generated *after* the body by an independent reviewer; never authored by the same context that wrote the SDD."
  - But brd-to-sdd.md:89 ("Behaviour the design needs that no BRD use case covers is a `Missing scenario` open item (chunk 18)") and :61 ("the overlap becomes an open item for the BRD owners") give the author items to raise during derivation, before chunk 18 exists.
  - The reviewer writes external findings only (SKILL.md:260). A2a added no OI.
- Class: D
- Options:
  - A. Markers, not open items. The author flags these cases inline and lists them as BRD follow-ups (brd-to-sdd.md:364). Tradeoff: no author-written OIs, but a marker in §7.3 or 09 to 13x blocks E3 and has no acceptance loop (D10).
  - B. Author items after the review. The review pass stays cleared-context. After it writes chunk 18, the author appends the open items the derivation rules name (next free OI-NN, same schema), so they go through the acceptance loop. In a later update the author appends them directly. Tradeoff: chunk 18 gets two writers, and the author's items lack an independent framing.
  - C. Hand them to the reviewer. The author parks them in decision-log.md, and the step 7 brief passes them on for the reviewer to write. Tradeoff: one writer, but an extra hand-off, and updates without a review still need A or B.
- Recommendation: B. It keeps the acceptance loop for these items, and the anchoring concern behind the rule applies to the review, not to items the rules tell the author to raise.
- Files: sdd-unifier/chunking.md (:42), sdd-unifier/SKILL.md (step 7, after item 3, :261), sdd-unifier/chunks/18-open-items-and-clarifications.md (:10 GENERATED_BY), sdd-unifier/brd-to-sdd.md (:61 and :89).

### S4: the mode prompt is skipped only for an SDD "in progress"

- Status: Present.
- Evidence: SKILL.md:49 "if the folder already holds an SDD in progress, continue with it in its own mode without asking. Otherwise run the **interactive mode prompt** below." So a targeted update on a finished SDD, with no mode argument, would get "Output format?".
- Class: S. An existing SDD, finished or not, sets the mode. Why: the files themselves make the mode explicit (principle 3), and asking would offer a format change in the middle of an update.
- Fix: SKILL.md / current: "if the folder already holds an SDD in progress, continue with it in its own mode without asking." / new: "if the folder already holds an SDD, in progress or finished, continue with it in its own mode without asking."
- Files: sdd-unifier/SKILL.md.

### S5: a source BRD whose cover is In Review (SDD side)

- Status: Present.
- Evidence:
  - brd-to-sdd.md:32 "Every BRD must be finished: a BRD whose master shows a part `Pending` or `In progress` stops the derivation". It checks parts only and never reads the cover Status (Draft, In Review, Approved).
  - A2a took LOYALTY v1.2 while its cover read In Review, with no approver on its 1.1 and 1.2 rows (X4).
  - The step 9 Lineage line reports key and version only (SKILL.md:322).
- Class: D
- Options:
  - A. No gate, but visible. Proceed with any finished BRD, and name a source that is not Approved in the part 1 summary and the step 9 Lineage line. Tradeoff: no extra question, but the design can rest on unsigned requirements without anyone choosing that.
  - B. Ask once. When a source BRD's cover is not Approved, say so in one line and ask whether to derive from it (Recommended: yes); then as A. A "new version" request does the same for the new version. Tradeoff: one question, and the user proceeds knowingly.
  - C. Gate it. Stop, as for an unfinished BRD, until it is Approved. Tradeoff: the SDD waits for a business sign-off that brd-unifier does not require before its own delivery gate.
- Recommendation: B. It raises the risk when it matters without blocking the architect. It adds no register column (a new column broke check_uc_keys in step 5).
- Files: sdd-unifier/brd-to-sdd.md (§ Source BRDs rule 1 at :32; the "new version" row at :69), sdd-unifier/SKILL.md (the step 9 Lineage bullet at :322).

### S6: "each external dependency becomes an Integration row" vs the part 1 checklist

- Status: Not reproducible.
- Evidence:
  - The finding quotes the checklist as "every §12 row owned by a service", but it reads "Every integration in 08 names the service that owns it, or is flagged." (parts-mode.md:85).
  - So an external dependency with no owning service is still an Integration row, flagged, which agrees with brd-to-sdd.md:234 ("Each external dependency becomes an Integration row").
  - A2a chose a §3 assumption with a marker for the member sign-in dependency instead (run-2026-10-01-e2e sdd-refunds-platform/01-executive-summary-scope-risks.md:62). That is a run deviation, not conflicting text.
- Class: none.
- Fix: none.
- Files: none.

### S7: the Child LLDs scope "Angular web app"

- Status: Present (= C7).
- Evidence: brd-to-sdd.md:45, lld-unifier/sdd-to-lld.md:206 (see C7).
- Class: M
- Fix: see C7, including the CROSS-SKILL edit.
- Files: see C7.

### S9: re-checking a BR-n label after the rule is reworded

- Status: Present.
- Evidence:
  - brd-to-sdd.md:69 "every cited `BR-n` and `AC-n` is re-checked against its label, and one that moved gets its new position;"
  - It says nothing about a label whose rule was reworded in place, or which files the check covers. A2a updated the content chunks and left chunk 18 and the decision log.
- Class: S. Labels follow the reworded rule, and records keep theirs. Why: a label exists to say what the rule says (SKILL.md:374), while decision records describe what was decided at the time.
- Fix: brd-to-sdd.md / current: "every cited `BR-n` and `AC-n` is re-checked against its label, and one that moved gets its new position;" / new: "every cited `BR-n` and `AC-n` is re-checked against its label: one that moved gets its new position, and a label the reworded rule no longer fits gets new words (the decision log and closed open items are records and keep theirs);"
- Files: sdd-unifier/brd-to-sdd.md.

### X1: the cross-BRD reconciliation missed half of a data dependency gap

- Status: Present.
- Evidence:
  - brd-to-sdd.md:60 "a gap in how the data reaches the other side is a `[NEEDS CLARIFICATION: ...]` and a §4 risk." This covers transport only, not data that the providing BRD does not hold.
  - LOYALTY 08's Refunds Portal row expects the member and the purchase reference, and REFUNDS v1.0 holds neither (step4-findings X1). The step 5 panel found the REFUNDS side (PM-07, DC-07).
- Class: S. Check the dependency from both sides, and treat missing data as a BRD follow-up. Why: the row's intent already covers it, and the BRD follow-up list already exists (brd-to-sdd.md:364).
- Fix: brd-to-sdd.md / current: "a gap in how the data reaches the other side is a `[NEEDS CLARIFICATION: ...]` and a §4 risk." / new: "check it from both sides: every item of data or event the needing BRD expects must be one the providing BRD holds or sends. A gap, in the data itself or in how it reaches the other side, is a `[NEEDS CLARIFICATION: ...]` and a §4 risk; data the providing BRD does not hold is also a BRD follow-up for both owners (§ Workflow when deriving from BRD, step 11)."
- Files: sdd-unifier/brd-to-sdd.md.

### X2: data-model slips that no reconciliation check catches

- Status: Present, as a check gap. The "update path skips the reviewer" part is S2, which another checker owns.
- Evidence:
  - Step 6a (SKILL.md:229-240) reconciles events, roles, API contracts, and §7.3, but nothing inside a 13x data model.
  - The 13d slips A2a introduced are cross-checks within one chunk: Figure 24 omits `tenant_id` from the take-back key; the rejection table has no `id` although Figure 24 shows one; a NOT NULL `purchase_reference` would stop the import; and a nullable `reported_at` is needed by the earn-lag metric (step4-findings X2).
  - The user's CLAUDE.md: "Every index in shared-schema includes `tenant_id`".
- Class: D
- Options:
  - A. A data-model item in step 6a. For each 13x whose DB Modeling changed: the ERD and Tables Design list the same tables, columns, and keys; every shared-schema key and index includes `tenant_id` (§11.2); a column that a rule, lock, or metric relies on is NOT NULL or its null case is stated; Retention covers every table. Tradeoff: step 6a grows by one item. It catches mechanical slips on every update, but not design slips (the take-back left pending forever).
  - B. Leave it to a review: a targeted update that changes a DB model runs a scoped review (S2). Tradeoff: catches design slips too, at the cost of a review per update.
  - C. Status quo. Tradeoff: slips reach the LLD (C1's `refund_takeback.refund_reference`).
- Recommendation: A. It is cheap and mechanical, and it runs on every path whatever S2 decides.
- Files: sdd-unifier/SKILL.md (step 6a, a new item after item 6), sdd-unifier/parts-mode.md (part 2 exit checklist, one line).

### T2: "leaving the rest untouched" vs back-fill

- Status: Present.
- Evidence:
  - SKILL.md:337 "Targeted regeneration of one chunk or section, leaving the rest untouched."
  - Against: principle 10 (SKILL.md:93) and the back-fill that parts mode requires (parts-mode.md:39-46).
  - A2b back-filled 04 §8.1.2, the 01 Glossary, and 16 §20.1.9, but left ADR-01's "one-day retries", the Figure 20 Summary, and §15.6 stale (step4-findings T2).
- Class: D
- Options:
  - A. Back-fill. The update changes the chunk it was asked for, then every other chunk the change makes wrong (the parts-mode back-fill list), and its Changes Log row names them all. Tradeoff: more files per update and a wider LLD refresh, but no stale text.
  - B. Untouched but flagged. Other chunks are not edited; each statement the update makes wrong is listed in the handoff or gets a marker. Tradeoff: a small, visible change set, but stale text stays until a second request, and a marker in 09 to 13x blocks E3.
  - C. Back-fill only through step 6a (the registries and §7.3), leaving narrative such as ADRs and Summaries. Tradeoff: cheapest, but the T2 drift recurs.
- Recommendation: A. Principle 10 already treats a stale restatement as a defect, and parts mode already defines the back-fill list.
- Files: sdd-unifier/SKILL.md (the step 10 row at :337), sdd-unifier/brd-to-sdd.md (§ Changes after the SDD exists, :68-69, one clause), sdd-unifier/transform-detection.md (:144, "Regenerate only those").

### T3: E4 compares dates only (skill side)

- Status: Present.
- Evidence:
  - SKILL.md:303 "(the `**Reconciled:**` date is not older than those changes)". A change made later on the day of the reconciliation passes.
  - Step 5's review did exactly that, and check_e2e read E4 as met (step5-findings § Checks).
- Class: S. On a same-day tie whose order this run cannot vouch for, rerun step 6a before deciding. Why: no format change, and 8b.1 already says to verify against the files; rerunning 6a is that check. Adding a time to the Reconciled line is the alternative, but it changes a format that check_e2e reads.
- Fix: SKILL.md / current: "(the `**Reconciled:**` date is not older than those changes)." / new: "(the `**Reconciled:**` date is not older than those changes; when it shares a date with the last change and this run did not make both, rerun step 6a before deciding)."
- Files: sdd-unifier/SKILL.md.

### T4: the Child LLDs out-of-date note: "append" vs replace

- Status: Present.
- Evidence:
  - SKILL.md:110 says the note is "appended to that cell". brd-to-sdd.md:45, chunks/00-cover-and-changelog.md:37, and TEMPLATE-COMBINED.md:32 say the same.
  - On a second bump, "append" would stack two notes. A2b replaced the v1.1 note with a v1.2 one, which matches the exact-note check in check_lld_trace.
- Class: M
- Fix:
  1. SKILL.md / current: "appended to that cell." / new: "appended to that cell, replacing an earlier such note."
  2. brd-to-sdd.md / current: "to its SDD version cell and names the LLD in the handoff." / new: "to its SDD version cell, replacing an earlier such note, and names the LLD in the handoff."
  3. chunks/00-cover-and-changelog.md / current: "to its SDD version cell and names the LLD in the handoff;" / new: "to its SDD version cell (replacing an earlier such note) and names the LLD in the handoff;"
  4. TEMPLATE-COMBINED.md / current: "to its SDD version cell and names the LLD in the handoff;" / new: "to its SDD version cell (replacing an earlier such note) and names the LLD in the handoff;"
- Files: sdd-unifier/SKILL.md, sdd-unifier/brd-to-sdd.md, sdd-unifier/chunks/00-cover-and-changelog.md, sdd-unifier/TEMPLATE-COMBINED.md.

### T7: decisions applied not quite as written

- Status: Present for the skill part. The doubled "and reports" in 13b came from the decisions file, so it is fixture content, not a skill issue.
- Evidence:
  - SKILL.md:285 "Apply the Recommended Answer (or adjusted text) ... as plain design text in present tense". It reads as verbatim.
  - A2b had to adapt three answers: bare IDs became keyed links (CL-06), an embedded edit instruction was dropped (CL-14), and a decision ID was replaced (CL-21). It also applied a wording defect verbatim (CL-09).
- Class: S. State that the text is fitted to the chunk. Why: principles 12 and 17 already require these adaptations; saying so removes the doubt and catches defects like CL-09's.
- Fix: SKILL.md / current: "as plain design text in present tense: the chunk never keeps" / new: "as plain design text in present tense, fitted to the chunk (keyed and linked BRD IDs, no IDs or edit instructions from the decision's source, and wording that reads correctly in place): the chunk never keeps"
- Files: sdd-unifier/SKILL.md.

## New items

### N-1: the questionnaire record on Accept all: "one-line record" vs "one row per question"

- Status: Present.
- Evidence:
  - architecture-questionnaire.md:88 "An "Accept all" with every answer recommended still gets a one-line record, because the style is a structural decision."
  - decision-log.md:46 "[One row per question, Q1-Q8. Always written, even for Accept all: the style is a structural decision.]"
  - The runs wrote all eight rows.
- Class: M (the template is clearly right).
- Fix: architecture-questionnaire.md / current: "still gets a one-line record, because the style is a structural decision." / new: "still gets the full record (the Outcome line and one row per question), because the style is a structural decision."
- Files: sdd-unifier/architecture-questionnaire.md.

### N-2: "UC-NN" listed unkeyed as an allowed compact reference

- Status: Present.
- Evidence:
  - SKILL.md:95 (principle 12) "Compact references to stable IDs (OI-NN, ADR-NN, UC-NN, AP-NN) ... are allowed". decision-log.md:101 says the same.
  - This contradicts principle 17 (SKILL.md:100) and brd-to-sdd.md:34 (every BRD reference keyed). Most unkeyed UC IDs show up in decision-log records (step 5 A6).
- Class: M
- Fix:
  1. SKILL.md / current: "Compact references to stable IDs (OI-NN, ADR-NN, UC-NN, AP-NN) inside design text and table cells are allowed; storytelling is not." / new: "Compact references to stable IDs (OI-NN, ADR-NN, KEY/UC-NN, AP-NN) inside design text and table cells are allowed; storytelling is not."
  2. decision-log.md / current: "Compact traceability references to stable IDs (OI-NN, ADR-NN, UC-NN, AP-NN)" / new: "Compact traceability references to stable IDs (OI-NN, ADR-NN, KEY/UC-NN, AP-NN)"
- Files: sdd-unifier/SKILL.md, sdd-unifier/decision-log.md.

### N-3: check 4 does not say where a trigger entry point is checked

- Status: Present.
- Evidence:
  - brd-to-sdd.md:132 "4. Each entry point exists, exactly as written, in the List of APIs of the service it names."
  - The Entry points column also allows `Schedule:` and `Event:` triggers (brd-to-sdd.md:115), which live in the service's Input table (chunks/13a-service-detailed-template.md:36-38), not in its List of APIs. S2-4f makes these triggers more common.
- Class: M
- Fix: brd-to-sdd.md / current: "4. Each entry point exists, exactly as written, in the List of APIs of the service it names." / new: "4. Each entry point exists, exactly as written, in the List of APIs of the service it names (a `Schedule:` or `Event:` trigger, in that service's Input table)."
- Files: sdd-unifier/brd-to-sdd.md.

### N-4: a decomposition heuristic that predates the questionnaire

- Status: Present.
- Evidence:
  - brd-to-sdd.md:387 "The tension is resolved by starting with one service per stable bounded context, not one service per use case." It sits after the quote of the CLAUDE.md line "default to microservices for new services".
  - The style is the questionnaire's decision: principle 8 (SKILL.md:91) and SKILL.md:389 ("Never assumes microservices (or any style) when deriving from a BRD").
- Class: M
- Fix: brd-to-sdd.md / current: "The tension is resolved by starting with one service per stable bounded context, not one service per use case." / new: "The tension is resolved by starting with one service or module per stable bounded context, not one per use case; the architecture questionnaire (SKILL.md step 3b) decides whether they are modules or services."
- Files: sdd-unifier/brd-to-sdd.md.
