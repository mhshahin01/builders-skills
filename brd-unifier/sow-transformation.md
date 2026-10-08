# Source Transformation: SoW, pre-BRD, Existing BRD, or Loose Spec → Unified BRD

This file defines how to translate a source document into the unified BRD template, regardless of whether the source is a SoW, a pre-BRD from `pre-brd-unifier`, an existing BRD in another format, or a loose product spec.

It exists because the field mapping is not always obvious, and getting it wrong produces a BRD that looks structured but is semantically empty.

For deciding **whether** transformation is the right intent, see `transform-detection.md`. This file covers the **how**.

---

## Overall approach

1. **Read the source in full before writing anything.** The BRD sections are interdependent; you need the whole picture before you can populate Glossary, Assumptions, and Scope coherently.
2. **Classify each source paragraph into a BRD target section.** Keep a running map: "paragraph 3 → Business Objectives; paragraph 4 → Assumptions item 2; paragraph 5 → UC-02 Main Flow".
3. **Paraphrase, don't copy.** Source docs are often written for procurement, legal, or vendor audiences. The BRD is written for the delivery team. Same facts, different voice.
4. **Business language only.** The BRD states the WHAT. Any technical mandate in the source (named technologies, protocols, architecture rules, concrete technical targets) is parked **verbatim** in Appendix § Technical Inputs for the SDD, never spread into the body, never dropped.
5. **Flag gaps immediately.** Every gap becomes a `**[NEEDS CLARIFICATION: <specific question>]**` marker, never an invented plausible value.
6. **Preserve commitments verbatim.** Numbers, dates, percentages, named integration points are carried across exactly. "11 source systems currently in SIT" stays "11 source systems currently in SIT", not "approximately a dozen".
7. **Never pick a side silently.** When two parts of the source disagree on something the BRD takes, use the version from the part this file maps to that BRD home, as a proposal that names the other part: `**[NEEDS CLARIFICATION: proposed <version> (<part>); <other part> says <other version>; confirm or replace]**`. When neither part maps to that home, flag both versions and propose neither.

---

## Field-by-field mapping (SoW source)

### "Overview" / "Background" / "About the project"

→ **Executive Summary** (top 2-4 paragraphs) AND **Background and Context / Problem Statement**.

Split: the *what this is* portion goes to Executive Summary; the *why this exists / what's broken today* portion goes to Background.

### "Objectives" / "Goals" / "Success criteria"

→ **Business Objectives** as a bulleted list.

If the source states measurable KPIs ("reduce notification latency by 40%", "onboard 30+ systems in Year 1"), carry them with the measurement intact. Don't invent numbers if the source is qualitative.

### "Definitions" / "Glossary" / scattered acronyms

→ **Glossary** table.

Also scan the body for acronyms used without expansion (common offenders: SMSC, IAM, SMPP, TADIG, CPaaS, NCA, PDPL, MSISDN, ICCID, KYC). Every acronym used in the BRD should be in the Glossary.

### "Assumptions" / "Constraints"

→ **Assumptions / Constraints** numbered list.

Source docs often mix assumptions and constraints. The template combines them into one list. Use the short-label format: `**Label**; description.`

### "Dependencies"

→ **Dependencies** table.

Classify each as Hard (blocks delivery) or Soft (affects quality but not blocking). Name the owner team or system where stated. Fill `Needed before` (the build of a use case, BAT sign-off, or go-live) as the source states it; when the source does not say, flag it with a clarification marker.

### "Scope"

The source's Scope section typically has three parts mapping to three BRD sections:

| Source content | BRD destination |
|---|---|
| "The vendor shall deliver..." list of deliverables | **Project Scope → In Scope** |
| Exclusions ("The following are explicitly out of scope...") | **Project Scope → Out of Scope** |
| Functional deliverables described as features/capabilities | **User Journeys & Use Cases** (journeys + detailed UC blocks per persona) |

The third row is the substantive work (see "Use case extraction" below).

### "Deliverables" / "Features" / "Capabilities" / "Requirements"

→ **User Journeys & Use Cases**.

Rules:

1. **One UC per distinct user goal**, not one UC per paragraph. A source paragraph may contain 3 capabilities; they become 3 use cases. A capability with no identifiable actor is a red flag: identify who triggers it or flag `[NEEDS CLARIFICATION: which user performs this?]`.
2. **Assign every UC to a persona.** The persona owns it in its detailed chunk (`06a`, `06b`, …) and gets a `Yes` in the Users & Use Cases Matrix. If the source doesn't say who, write the persona its role references point to as a proposal (`**[NEEDS CLARIFICATION: proposed <persona> as Primary Actor; confirm or replace]**`), or flag it when nothing points to one.
3. **For each UC**, populate all blocks per the template. Expanding what the source itself states into detailed steps stays unmarked. Any behaviour the source does not state (an inferred persona, rule, step, or exception flow) is written as a proposal with the clarification marker, `**[NEEDS CLARIFICATION: proposed <behaviour>; confirm or replace]**`, so the to-do collects it for the user to decide. Example: "Users can request refunds" becomes detailed request steps with no marker, but a refund window, an approval path, or a failure rule the source does not state is a proposal. Per block:
   - **Actor & Goal**: primary/supporting actors, one-sentence goal, business trigger.
   - **Why**: if the source gives rationale, paraphrase it. If not, write the value it serves, taken from the Business Objectives, as a proposal, or flag `[NEEDS CLARIFICATION: business value of UC-NN]`.
   - **Preconditions**: what must hold before step 1, as the source states it. A precondition the source does not state is a proposal; write `None.` when nothing must hold.
   - **Main Flow**: expand the source's bullets into detailed numbered steps alternating actor action and system response, in business terms. A step that adds behaviour the source does not state is a proposal; where the source is too vague to propose a step, flag the gap.
   - **Alternate & Exception Flows**: branches and failures as the user experiences them. Carry across the ones the source states. Sources rarely state these: write each other branch or failure as a proposal, and flag the ones you cannot propose.
   - **Business Rules & Constraints**: rules, limits, eligibility conditions specific to this UC. A rule or limit the source does not state is a proposal.
   - **Acceptance Criteria**: testable conditions ("Given X, when Y, then Z").
   - **Future Enhancements**: usually not in the source; write `- None identified at this time.` unless the source hints at future waves.
   - **UI/UX**: Figma link, wireframe reference, or pending note.
4. **Preserve numbering from the source** if it numbers requirements (map the source ID in a `Source-ref` note). Otherwise number `UC-01`, `UC-02`, … sequentially across the BRD, grouped per persona.
5. **After all UCs are written, derive the Users & Use Cases Matrix** (chunk 07) from the actor fields (see SKILL.md step 6a).

See `use-case-quality.md` for what a substantive use-case block looks like.

### "Technical requirements" / "Architecture expectations" / "Standards"

→ **Appendix § Technical Inputs for the SDD**, verbatim, with the source location.

These do NOT go into the BRD body. The BRD is business-language only; technical mandates (named technologies, architecture principles, integration standards, protocols) are parked verbatim in the Appendix table so `sdd-unifier` can consume them without loss. Exception: if a source "technical" statement is actually a business expectation in disguise ("the system must keep working if a partner is down": that's an NFR; "reports must be exportable to Excel": that's Reporting), translate it into the right business section AND keep the original in the parking table if it carried technical specifics.

### "Non-Functional Requirements" / "Performance" / "Availability" / "Security"

→ **Non-Functional Requirements** table, in business language.

Convert each NFR into a row: `NFR-NN | <quality> | <business expectation> | <business measure>`. State the WHAT ("highly available: customers are never blocked from paying"), and express the measure in terms the business can verify ("no more than X minutes of disruption per month"). Carry business-verifiable commitments verbatim. Technical targets in the source (uptime percentages, latency budgets, throughput numbers) are parked in Appendix § Technical Inputs for the SDD and referenced: the SDD owns the technical realisation. If the source names a quality without any measure ("the system shall be highly available"), flag it: `NFR-NN | Availability | Highly available | [NEEDS CLARIFICATION: how much disruption per month is tolerable to the business?]`.

### "Integrations" / "Interfaces" / "Connected systems"

→ **Integrations** section, business-level.

List every business system or partner the product must exchange information with: business purpose, information exchanged (in business terms), direction (we send / we receive / both ways), criticality, and provider/owner. Integration mechanisms stated in the source (protocols, endpoints, file formats, auth, SLAs) are parked verbatim in Appendix § Technical Inputs for the SDD: the SDD owns them.

### "Reporting" / "Dashboards" / "Analytics"

→ **Reporting / Analytics** section.

Convert reporting expectations into a list of named reports or dashboards with what each shows (the business question it answers), audience, frequency, and format. If the source only says "reporting shall be provided", flag it.

### "Personas" / "Users" / "Actors" (often implicit)

→ **Personas / Actors** section.

If not named explicitly, infer from role references scattered across the text ("operator", "campaign owner", "client admin", "external tenant"). Flag if no persona-level info available. Personas are load-bearing in this template: each one owns a use-case chunk and a matrix column, so getting the persona list right comes before use-case extraction.

### "Timeline" / "Milestones" / "Phases"

Timelines typically do **not** go into the BRD: the BRD describes the system, not the programme plan. Exception: if a phase fundamentally changes system behaviour (e.g., "in Phase 2, multi-tenancy is enabled"), that's a use case or domain concept.

### "Commercial" / "Pricing" / "Payment terms"

These do **not** go into the BRD. Ignore for BRD purposes.

### "Risks" / "Issues"

→ **Challenges** section.

Paraphrase each risk as a challenge. If the source provides evidence (data samples, failure examples), lift it into the challenge evidence table.

---

## Field-by-field mapping (existing-BRD source, different format / template)

When the source is already a BRD but in a different format (vendor template, IEEE 830/29148 style, Volere, Notion-flavoured, custom), the mapping is more direct because the source already has structure. The job is re-architecting, not extraction.

### Approach

Migration review follows SKILL.md step 7: compare prior/current risk coverage and run a first-build review when it is insufficient. Preserve existing table/figure numbers and use the actual editor/runtime in Updated By. Bundle a read-only source snapshot under the output tree, linked from Appendix. Preserve available closed-OI history and TASK/TC IDs/results; label missing historical fields rather than inventing them. Revalidate old gate evidence; inherited results are historical, not acceptance of changed behaviour. Map real ID collisions explicitly.

1. **Build a section crosswalk first.** Before writing, map each source section to a target template section. Note any source sections with no target (often: change history in non-standard format, sign-off pages, glossary in a non-tabular format).
2. **For sections present in both:** carry content across, restructure to match the template's expected sub-structure (e.g., requirements become UC blocks using `Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules & Constraints / Acceptance Criteria / Future Enhancements / UI/UX`, grouped per persona). Technical content in the source body moves to Appendix § Technical Inputs for the SDD.
3. **For target sections missing from source:** flag the entire section with `[NEEDS CLARIFICATION: section X is required by the template but not present in the source]` and produce a stub with the heading.
4. **For source sections with no target:** evaluate: is the content useful? If yes, find the closest target section. If not (vendor sign-off block, commercial appendix), drop it and note in the handoff. Source test cases, delivery plans, or slide material go to the Appendix (12) as reference files: they are input for chunks 15-17 once the delivery gate opens, never chunks 15-17 themselves.

### Common source-format peculiarities

| Source format | Peculiarity | Handling |
|---|---|---|
| IEEE 830 / 29148 | "Specific Requirements" with deeply nested numbering | Flatten to UC-NN per user goal; preserve the numbering in a `Source-ref:` line in `Business Rules & Constraints` if traceability is needed. |
| Volere | "Shells" per requirement with ratings/priorities | Map shell content to `Actor & Goal / Why / Main Flow`; rating becomes a wishlist-vs-now decision. |
| Vendor / RFP-derived BRD | Vendor-obligation language, sign-off blocks | Rewrite to system voice (see "Voice and audience" below). Drop sign-off. |
| Notion / Confluence export | Mixed concerns per page, embedded design references | Re-classify each page into the target sections. Keep design-tool links. |
| Old version of this same template | Stale section names or missing sub-sections | Migrate to current template; bump the version one minor step (`delivery-chunks.md` § Refresh triggers, Version), with a Changes Log row "Migrated to the current template". |

---

## Field-by-field mapping (loose product spec / informal source)

When the source has no clear structure (Notion brain-dump, single-page brief, scattered notes):

1. **Read everything first.** Identify the dominant content types: features (→ use cases, each assigned to a persona), constraints (→ Assumptions / Constraints), goals (→ Business Objectives), risks (→ Challenges), technical mandates (→ Appendix § Technical Inputs for the SDD).
2. **Classify paragraph by paragraph.** Heavier classification work than SoW transformation, because the source isn't pre-sorted.
3. **Expect more gaps.** Loose specs typically have no NFRs, no formal personas, no integration table. Each missing piece is a `[NEEDS CLARIFICATION: ...]` marker.
4. **The Glossary will need active construction.** Loose specs use jargon without defining it; you'll need to identify terms and either define them or flag for clarification.

---

## pre-BRD (pre-brd-unifier output) to BRD

A pre-BRD answers "is this worth building?". It holds discovery analysis, not requirements. Take from it the idea, the users, the scope, and the priorities, and write the requirements in this template. Market figures and scores stay in the pre-BRD: cite them with a link, never copy them (one fact, one home). The verdict word (`Go`, `Conditional Go`, or `No-Go`) is named next to its link, as the 22-23 row says: that is a citation, not a copy.

| pre-BRD chunks | BRD home | How |
|---|---|---|
| 01 Concept Sheet, 02 Product Charter, 15 OKRs | 01 Executive Summary, Background and Context / Problem Statement, Business Objectives | Restate the problem and the goals in business terms. Each OKR key result that a use case can serve becomes a business objective with its measure. A key result about the company itself (budget, funding, hiring, sales cost, investor material) stays in the pre-BRD, linked from 01. A key result that must be in place before launch (a licence, a registration, a partner approval) becomes a 02 dependency with its date, not an objective. |
| 03 Lean Canvas, 04 Value Proposition Canvas, 05 Empathy Map | 04 Personas, 05 User Journeys | Customer segments become personas. Jobs, pains, and gains shape each persona's journey and the use cases that serve it. |
| 06-12 Market and competition (Market Comparison, Market Sizing, PESTLE, Porter's Five Forces, EFAS, IFAS, SWOT) | 01 Background and Context; 02 Assumptions / Constraints, Facts and Challenges; 10 NFRs (candidates) | One short paragraph of market context plus a link; the figures stay in the pre-BRD. Every regulatory point in 08 PESTLE becomes a numbered 02 constraint, whichever of its six rows holds it, not only Legal. A regulatory point is a law, a licence, or a rule of a regulator, an operator, or a platform that the product must follow. A point with several obligations gives one constraint per obligation (licensed message sending and licensed hosting, for example). A constraint that sets a quality is also an NFR candidate in 10. |
| 13 RICE, 14 MoSCoW | 04 Project Scope; 12 Wishlist | MoSCoW decides scope: Must and Should items go in scope, whatever their roadmap phase; Could and Won't items go out of scope or to the wishlist. Their priority orders the use case list in part 1. |
| 16-20 Strategy (BCG Matrix, Ansoff Matrix, VRIO, Product Strategy Canvas, Product Lifecycle) | None: context only | Read for context. A strategy statement never becomes a requirement. |
| 21 Roadmap and Project Plan | 04 Project Scope; 12 Wishlist | Each scope item is labelled with its roadmap phase. MoSCoW decides scope, not the phase (the 13-14 row), so a later phase sends only its Could and Won't items to the wishlist. Its Must and Should items that change system behaviour become scope items or use cases (§ "Timeline" / "Milestones" / "Phases"). |
| 22 Executive Summary Scoreboard, 23 Investor Assessment | 01 Background and Context | Cite the verdict (`Go`, `Conditional Go`, or `No-Go`) with a link; never restate the scores. |
| 24 Open Items and Assumptions Log | 02 Assumptions; clarification markers | An assumption in the log that BRD content rests on (a persona, a scope item, a rule, a measure, or an objective the BRD took) becomes a numbered 02 assumption that cites its row (`pre-BRD 24, A-NN`). The log has no validation mark, so each one counts as not confirmed: it is an `Assumption to validate` row in the to-do when its falsity would change a use-case flow, an acceptance criterion, or an NFR measure (`delivery-chunks.md` § Step 1). An assumption that only supports the analysis (market sizing, scores, the verdict) stays in the pre-BRD. An open item becomes a `[NEEDS CLARIFICATION: ...]` marker at each BRD home that took the content the item is about. A marker asks one question: an item about two things gives two markers, each at the home of its own content. Only the part of a chunk that the item concerns counts, not every home fed by a chunk its Where names: an item on one 15 OKRs key result marks only the business objective made from that key result. An item about content the BRD only links or cites (market figures, scores, the verdict word) stays in the pre-BRD, as an inline marker on such content does (Rules, below). |

Rules:

- Business language only. A technical statement in the pre-BRD goes verbatim to Appendix § Technical Inputs for the SDD. A relative link inside it is repointed so it still resolves from the BRD folder; the words stay as they are.
- Link each cited chunk from its BRD home, for example `[pre-BRD 07 Market Sizing](../pre-brd-[slug]/07-market-sizing-analysis.md)`.
- A `No-Go` or `Conditional Go` verdict does not block the BRD. Name it, with its conditions, in the handoff.
- What the pre-BRD does not cover (detailed steps, exception flows, business rules, acceptance criteria) follows § "Deliverables" / "Features" / "Capabilities" / "Requirements": behaviour the source does not state is a proposal with the clarification marker.
- An inline `[NEEDS CLARIFICATION: ...]` marker in pre-BRD chunks 01-23 goes where its content goes. When the BRD takes the marked content (a persona, a scope item, a rule, a measure, an assumption), the BRD text keeps a marker that names the pre-BRD chunk. A marker on content the BRD only links (market figures, scores, team) stays in the pre-BRD.

---

## Handling voice and audience shift

Source docs are often written for one audience; the BRD targets the delivery team.

| Source voice | Target voice |
|---|---|
| "The Vendor shall implement X" (SoW) | "The system supports X" or "X works as follows: ..." |
| "The Supplier is responsible for ensuring Y" | "Y is ensured by ..." (active, system-as-subject) |
| "The user/client should be able to..." (vague capability) | "The system supports the following capability: ..." (concrete behaviour) |
| Passive contractual hedging ("It is intended that...") | Direct: "The system does X." |

Drop vendor-obligation scaffolding; keep the behavioural commitment.

Then apply the plain-language style (`writing-style.md`): sources written for procurement or legal readers use long sentences and heavy words. Rewrite them in short, simple sentences and keep every fact exactly (numbers, dates, names, commitments).

---

## Gap inventory

At the end of any transformation, count the `[NEEDS CLARIFICATION: ...]` markers by question (a marker repeated for one question counts once; the same marker words used for two different things, two flows or two rules, count as two questions) in two groups and surface both totals in the handoff summary: **gaps** (the source does not say, and nothing is proposed) and **proposals** (`[NEEDS CLARIFICATION: proposed ...]`, behaviour the skill proposed for the user to confirm). Both kinds go to the to-do and keep gate condition G1 shut until they are resolved.

Thresholds apply to gap markers only, because only they measure the source; proposals are reported as "to confirm":

- **0-5 gap markers:** healthy. The source was rich; minimal follow-up needed.
- **6-14 gap markers:** typical. Recommend the user review and close before circulating.
- **15+ gap markers:** the source is significantly under-specified for this template. Recommend a clarification session **before** the BRD is circulated for review. Do not soften this recommendation: a BRD with 15+ open gaps is not review-ready.

---

## RFP-specific notes

If the source is an RFP scope (the BRD is being derived from procurement language), the following do **not** carry into the BRD (they are RFP artefacts, not system requirements):

- Vendor Response Required bullets
- Eligibility criteria
- Evaluation methodology
- Commercial framework
- Bid bond / performance bond clauses
- Vendor company / capability sections

Only the system-behaviour scope of the RFP transfers.

---

## Sanity checks before completion

Before declaring the transformation done, verify:

- [ ] Every UC has all required sub-sections (`Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules & Constraints / Acceptance Criteria / Future Enhancements / UI/UX`).
- [ ] Every UC is assigned to a persona; the Users & Use Cases Matrix covers every persona × every UC and matches each UC's persona actors both ways (external parties are never columns).
- [ ] No technical language in the body: technology names, protocols, and technical targets from the source sit verbatim in Appendix § Technical Inputs for the SDD.
- [ ] NFRs and Integrations read as business statements (the what); no mechanism or technical target rows remain.
- [ ] The Glossary covers every acronym used in the BRD (business terms only).
- [ ] The Changes Log has a row for this transformation (version bumped if migrating from a prior version).
- [ ] The Figures index lists every Mermaid figure in the document (each with its prose summary).
- [ ] No section was silently dropped: empty sections still have their heading plus an explanation.
- [ ] No invented numbers: every quantitative claim traces to source or carries a `[NEEDS CLARIFICATION: ...]` marker.
- [ ] Plain-language pass done (`writing-style.md`): short sentences, common words, no vague wording, and no fact lost while simplifying.
- [ ] `14-todo.md` generated after the Open Items acceptance loop (SKILL.md step 8a) and the `delivery-chunks.md` verification list was run: every failure is fixed, or recorded as a `CF-NN` row when the third run or a later check found it and its fix changes chunks 00-13. Chunks 15, 16, and 17 NOT generated unless the delivery gate is open. No new use-case diagram or flowchart drawn yet (gated to to-do step 5).
