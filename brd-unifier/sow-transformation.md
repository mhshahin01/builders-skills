# Source Transformation — SoW, Existing BRD, or Loose Spec → Unified BRD

This file defines how to translate a source document into the unified BRD template, regardless of whether the source is a SoW, an existing BRD in another format, or a loose product spec.

It exists because the field mapping is not always obvious, and getting it wrong produces a BRD that looks structured but is semantically empty.

For deciding **whether** transformation is the right intent, see `transform-detection.md`. This file covers the **how**.

---

## Overall approach

1. **Read the source in full before writing anything.** The BRD sections are interdependent; you need the whole picture before you can populate Glossary, Assumptions, and Scope coherently.
2. **Classify each source paragraph into a BRD target section.** Keep a running map: "paragraph 3 → Business Objectives; paragraph 4 → Assumptions item 2; paragraph 5 → UC-02 Main Flow".
3. **Paraphrase, don't copy.** Source docs are often written for procurement, legal, or vendor audiences. The BRD is written for the delivery team. Same facts, different voice.
4. **Business language only.** The BRD states the WHAT. Any technical mandate in the source (named technologies, protocols, architecture rules, concrete technical targets) is parked **verbatim** in Appendix § Technical Inputs for the SDD — never spread into the body, never dropped.
5. **Flag gaps immediately.** Every gap becomes a `**[NEEDS CLARIFICATION: <specific question>]**` marker — never an invented plausible value.
6. **Preserve commitments verbatim.** Numbers, dates, percentages, named integration points are carried across exactly. "11 source systems currently in SIT" stays "11 source systems currently in SIT", not "approximately a dozen".

---

## Field-by-field mapping (SoW source)

### "Overview" / "Background" / "About the project"

→ **Executive Summary** (top 2–4 paragraphs) AND **Background and Context / Problem Statement**.

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

Classify each as Hard (blocks delivery) or Soft (affects quality but not blocking). Name the owner team or system where stated.

### "Scope"

The source's Scope section typically has three parts mapping to three BRD sections:

| Source content | BRD destination |
|---|---|
| "The vendor shall deliver..." list of deliverables | **Project Scope → In Scope** |
| Exclusions ("The following are explicitly out of scope...") | **Project Scope → Out of Scope** |
| Functional deliverables described as features/capabilities | **User Journeys & Use Cases** (journeys + detailed UC blocks per persona) |

The third row is the substantive work — see "Use case extraction" below.

### "Deliverables" / "Features" / "Capabilities" / "Requirements"

→ **User Journeys & Use Cases**.

Rules:

1. **One UC per distinct user goal**, not one UC per paragraph. A source paragraph may contain 3 capabilities; they become 3 use cases. A capability with no identifiable actor is a red flag — identify who triggers it or flag `[NEEDS CLARIFICATION: which user performs this?]`.
2. **Assign every UC to a persona.** The persona owns it in its detailed chunk (`06a`, `06b`, …) and gets a `Yes` in the Users & Use Cases Matrix. If the source doesn't say who, infer from role references and mark inferred, or flag.
3. **For each UC**, populate all blocks per the template:
   - **Actor & Goal** — primary/supporting actors, one-sentence goal, business trigger.
   - **Why** — if the source gives rationale, paraphrase it. If not, derive from Business Objectives and say so, or flag `[NEEDS CLARIFICATION: business value of UC-NN]`.
   - **Main Flow** — expand the source's bullets into detailed numbered steps alternating actor action and system response, in business terms. Where vague, either infer from domain knowledge (and mark inferred in `Business Rules & Constraints`) or flag gaps.
   - **Alternate & Exception Flows** — branches and failures as the user experiences them. Sources rarely state these; derive the obvious ones and flag the rest.
   - **Business Rules & Constraints** — rules, limits, eligibility conditions specific to this UC.
   - **Acceptance Criteria** — testable conditions ("Given X, when Y, then Z").
   - **Future Enhancements** — usually not in the source; write `- None identified at this time.` unless the source hints at future waves.
   - **UI/UX** — Figma link, wireframe reference, or pending note.
4. **Preserve numbering from the source** if it numbers requirements (map the source ID in a `Source-ref` note). Otherwise number `UC-01`, `UC-02`, … sequentially across the BRD, grouped per persona.
5. **After all UCs are written, derive the Users & Use Cases Matrix** (chunk 07) from the actor fields — see SKILL.md step 6a.

See `use-case-quality.md` for what a substantive use-case block looks like.

### "Technical requirements" / "Architecture expectations" / "Standards"

→ **Appendix § Technical Inputs for the SDD** — verbatim, with the source location.

These do NOT go into the BRD body. The BRD is business-language only; technical mandates (named technologies, architecture principles, integration standards, protocols) are parked verbatim in the Appendix table so `sdd-unifier` can consume them without loss. Exception: if a source "technical" statement is actually a business expectation in disguise ("the system must keep working if a partner is down" — that's an NFR; "reports must be exportable to Excel" — that's Reporting), translate it into the right business section AND keep the original in the parking table if it carried technical specifics.

### "Non-Functional Requirements" / "Performance" / "Availability" / "Security"

→ **Non-Functional Requirements** table, in business language.

Convert each NFR into a row: `NFR-NN | <quality> | <business expectation> | <business measure>`. State the WHAT ("highly available — customers are never blocked from paying"), and express the measure in terms the business can verify ("no more than X minutes of disruption per month"). Carry business-verifiable commitments verbatim. Technical targets in the source (uptime percentages, latency budgets, throughput numbers) are parked in Appendix § Technical Inputs for the SDD and referenced: the SDD owns the technical realisation. If the source names a quality without any measure ("the system shall be highly available"), flag it: `NFR-NN | Availability | Highly available | [NEEDS CLARIFICATION: how much disruption per month is tolerable to the business?]`.

### "Integrations" / "Interfaces" / "Connected systems"

→ **Integrations** section, business-level.

List every business system or partner the product must exchange information with: business purpose, information exchanged (in business terms), direction (we send / we receive / both ways), criticality, and provider/owner. Integration mechanisms stated in the source (protocols, endpoints, file formats, auth, SLAs) are parked verbatim in Appendix § Technical Inputs for the SDD — the SDD owns them.

### "Reporting" / "Dashboards" / "Analytics"

→ **Reporting / Analytics** section.

Convert reporting expectations into a list of named reports or dashboards with what each shows (the business question it answers), audience, frequency, and format. If the source only says "reporting shall be provided", flag it.

### "Personas" / "Users" / "Actors" (often implicit)

→ **Personas / Actors** section.

If not named explicitly, infer from role references scattered across the text ("operator", "campaign owner", "client admin", "external tenant"). Flag if no persona-level info available. Personas are load-bearing in this template: each one owns a use-case chunk and a matrix column, so getting the persona list right comes before use-case extraction.

### "Timeline" / "Milestones" / "Phases"

Timelines typically do **not** go into the BRD — the BRD describes the system, not the programme plan. Exception: if a phase fundamentally changes system behaviour (e.g., "in Phase 2, multi-tenancy is enabled"), that's an FR or domain concept.

### "Commercial" / "Pricing" / "Payment terms"

These do **not** go into the BRD. Ignore for BRD purposes.

### "Risks" / "Issues"

→ **Challenges** section.

Paraphrase each risk as a challenge. If the source provides evidence (data samples, failure examples), lift it into the challenge evidence table.

---

## Field-by-field mapping (existing-BRD source — different format / template)

When the source is already a BRD but in a different format (vendor template, IEEE 830/29148 style, Volere, Notion-flavoured, custom), the mapping is more direct because the source already has structure. The job is re-architecting, not extraction.

### Approach

1. **Build a section crosswalk first.** Before writing, map each source section to a target template section. Note any source sections with no target (often: change history in non-standard format, sign-off pages, glossary in a non-tabular format).
2. **For sections present in both:** carry content across, restructure to match the template's expected sub-structure (e.g., requirements become UC blocks using `Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules & Constraints / Acceptance Criteria / Future Enhancements / UI/UX`, grouped per persona). Technical content in the source body moves to Appendix § Technical Inputs for the SDD.
3. **For target sections missing from source:** flag the entire section with `[NEEDS CLARIFICATION: section X is required by the template but not present in the source]` and produce a stub with the heading.
4. **For source sections with no target:** evaluate — is the content useful? If yes, find the closest target section. If not (vendor sign-off block, commercial appendix), drop it and note in the handoff. Source test cases, delivery plans, or slide material go to the Appendix (12) as reference files: they are input for chunks 15-17 once the delivery gate opens, never chunks 15-17 themselves.

### Common source-format peculiarities

| Source format | Peculiarity | Handling |
|---|---|---|
| IEEE 830 / 29148 | "Specific Requirements" with deeply nested numbering | Flatten to UC-NN per user goal; preserve the numbering in a `Source-ref:` line in `Business Rules & Constraints` if traceability is needed. |
| Volere | "Shells" per requirement with ratings/priorities | Map shell content to `Actor & Goal / Why / Main Flow`; rating becomes a wishlist-vs-now decision. |
| Vendor / RFP-derived BRD | Vendor-obligation language, sign-off blocks | Rewrite to system voice (see "Voice and audience" below). Drop sign-off. |
| Notion / Confluence export | Mixed concerns per page, embedded design references | Re-classify each page into the target sections. Keep design-tool links. |
| Old version of this same template | Stale section names or missing sub-sections | Migrate to current template; bump version in Changes Log with "Migrated to template version X.Y". |

---

## Field-by-field mapping (loose product spec / informal source)

When the source has no clear structure (Notion brain-dump, single-page brief, scattered notes):

1. **Read everything first.** Identify the dominant content types: features (→ use cases, each assigned to a persona), constraints (→ Assumptions / Constraints), goals (→ Business Objectives), risks (→ Challenges), technical mandates (→ Appendix § Technical Inputs for the SDD).
2. **Classify paragraph by paragraph.** Heavier classification work than SoW transformation, because the source isn't pre-sorted.
3. **Expect more gaps.** Loose specs typically have no NFRs, no formal personas, no integration table. Each missing piece is a `[NEEDS CLARIFICATION: ...]` marker.
4. **The Glossary will need active construction.** Loose specs use jargon without defining it; you'll need to identify terms and either define them or flag for clarification.

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

At the end of any transformation, produce an internal count of `[NEEDS CLARIFICATION: ...]` markers and surface the total in the handoff summary.

Thresholds:

- **0–5 markers:** healthy. The source was rich; minimal follow-up needed.
- **6–14 markers:** typical. Recommend the user review and close before circulating.
- **15+ markers:** the source is significantly under-specified for this template. Recommend a clarification session **before** the BRD is circulated for review. Do not soften this recommendation — a BRD with 15+ open clarifications is not review-ready.

---

## RFP-specific notes

If the source is an RFP scope (the BRD is being derived from procurement language), the following do **not** carry into the BRD — they are RFP artefacts, not system requirements:

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
- [ ] Every UC is assigned to a persona; the Users & Use Cases Matrix covers every persona × every UC and matches the UC actor fields both ways.
- [ ] No technical language in the body — technology names, protocols, and technical targets from the source sit verbatim in Appendix § Technical Inputs for the SDD.
- [ ] NFRs and Integrations read as business statements (the what); no mechanism or technical target rows remain.
- [ ] The Glossary covers every acronym used in the BRD (business terms only).
- [ ] The Changes Log has a row for this transformation (version bumped if migrating from a prior version).
- [ ] The Figures index lists every Mermaid figure in the document (each with its prose summary).
- [ ] No section was silently dropped — empty sections still have their heading plus an explanation.
- [ ] No invented numbers — every quantitative claim traces to source or carries a `[NEEDS CLARIFICATION: ...]` marker.
- [ ] Plain-language pass done (`writing-style.md`): short sentences, common words, no vague wording, and no fact lost while simplifying.
- [ ] `14-todo.md` generated after the Open Items acceptance loop (SKILL.md step 8a) and the `delivery-chunks.md` verification list passed. Chunks 15, 16, and 17 NOT generated unless the delivery gate is open. No new use-case diagram or flowchart drawn yet (gated to to-do step 5).
