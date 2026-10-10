<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: all preceding SDD chunks (00 through 17)
GATES: chunk 19 (End-to-End System Design). Chunk 19 is written only after every item here is resolved: Accepted - applied, Adjusted - applied, or Rejected. Open, Deferred, and Decided - pending application items keep the gate shut (SKILL.md step 8b). A status outside the Status legend below counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it.
PART OF: SDD - [Project Name]
PURPOSE: Output of the post-generation cleared-context reviewer pass. Captures architecture-level gaps, missing scenarios, integration corner cases, ADR ambiguities, and cross-chunk contract mismatches flagged by an independent reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the SDD body once the architect accepts it.
GENERATED_BY: sdd-unifier post-generation reviewer (cleared-context subagent run after the main SDD body is complete). After that review, the author appends only the open items the skill's rules tell it to raise: the derivation's (SKILL.md step 7), text an applied decision makes wrong that needs a choice (step 8 item 3), a source-chunk problem found by the chunk 19 faithfulness check that a chunk 19 claim depends on or that lies in text the request changed (step 8b), an open remainder of a business review decision that is a design choice left to the SDD owner (step 10), and a last-pass discovery decided for later application (step 8).
SCOPE: The reviewer reads ALL preceding chunks. Contract-consistency findings are first-class: topic names, event names, payload fields, and consumer lists that diverge between the Centralized Event Hub (chunk 10), the per-service chunks (13x), the Centralized User Roles catalogue (chunk 12), and the Service Integration API Contracts (chunk 11) are valid OI items. The End-to-End System Design (chunk 19) does not exist yet when the first review runs; it is written after this chunk is cleared.
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, defer, or reject the Recommended Answer (an answer policy the user set for the run accepts the recommendations it may: SKILL.md step 8, Answer policy). Accepted answers are applied to the referenced chunk(s), the item gets its Resolution Log row, and the change joins the update's Changes Log row (SKILL.md § Output conventions, Versions).
-->

# 23. Open Items & Clarifications

> **What this section is.** A structured backlog of architectural concerns identified after the main SDD was authored, by a reviewer running with cleared context. Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting the architect's acceptance: accept the recommendation (or adjust it), and it gets reflected into the SDD body.
>
> **What this section is not.** It is not a list of inline `[NEEDS CLARIFICATION: ...]` markers found in the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for, and contract inconsistencies between the centralized catalogues (chunks 10, 11, 12) and the per-service chunks they consolidate.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section number (e.g., §6, §17.1), service name, or "global" if cross-cutting. |
| **Type** | Architecture gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / NFR shortfall / ADR needed / Contract mismatch (topic, event, payload, consumer list, or role/permission divergence across chunks) / Duplication (BRD content or another chunk's content restated instead of referenced). |
| **Concern** | One paragraph. What was missed and why it matters for downstream LLD or implementation. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply SDD content (the exact row, decision, sub-section, or wording that would close the item). This is what gets injected into the body when accepted. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives - the evidence behind it (BRD requirement, NFR, doctrine/CLAUDE.md default, operational risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Decided - pending application (decision, decider and date in the item; the next request applies it) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it. |

---

## Open Items

### OI-01: [Short title]

- **Where:** [§N or service name or "global"]
- **Type:** [Architecture gap | Missing scenario | Corner case | Ambiguity | Risk | Inconsistency | NFR shortfall | ADR needed | Contract mismatch | Duplication]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
  - **C.** [Option C] - [one-line tradeoff]. *(Optional.)*
- **Recommended Answer:** [Option letter + the concrete resolution text, ready to paste into the SDD. E.g., "Option A - add ADR-07 to §10: 'Use the transactional outbox pattern for all state-change events; rationale: ...'"]
- **Why:** [The reason this option wins, e.g., "Option A is the platform doctrine default (EDA + outbox, no dual-writes) and closes the at-least-once gap the BRD's 'money movements are never lost' expectation implies; B (broker transactions) couples the DB to the broker version."]
- **Status:** Open

---

### OI-02: [Short title]

- **Where:** [...]
- **Type:** [...]
- **Concern:** [...]
- **Options:**
  - **A.** [...] - [...].
  - **B.** [...] - [...].
- **Recommended Answer:** [...]
- **Why:** [...]
- **Status:** Open

---

<!-- Repeat the OI block for each open item. -->

---

## Resolution Log

<!-- When an open item is decided, or settled by an upstream change, add its row here with a pointer to the SDD update (chunk + heading). Audit trail. A source is `[KEY] v[X.X]` or a business review point (brd-to-sdd.md § Changes after the SDD exists). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk and section] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected / Settled by [source] / Superseded by [source] / Reopened by [source]] |

---

## Reviewer Notes

<!-- Coverage record first (required): one row per risk surface in the review brief (SKILL.md step 7), each either "checked: N findings (OI IDs)" or "checked: no issue found", with what was checked. A zero-finding review is valid. A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN (vX.X)`; a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: OI-NN (vX.X)`, whose Checked cell names every chunk the item changed (`chunks 02 and 11`). The brackets are part of each label: `[2026-10-07] delta: chunk 13a (v1.8)`, `[2026-10-07] application check: OI-45 (v1.7)`. vX.X is the SDD version when the review runs; earlier rows keep their labels. An update that only applies pending items (SKILL.md step 7, On an update) starts with application check rows; an update that also runs a delta review covers them in its delta rows. Then optional free-form notes that did not crystallise into a numbered open item. -->

| Risk surface | Checked | Findings | Notes |
|---|---|---|---|
| [Architecture style] | [What was checked, e.g., ADR-01 against the BRD drivers, §8.1, §13 boundaries] | [N findings (OI-NN, OI-NN)] | [Notes] |
| [Observability] | [What was checked] | [No issue found] | [Notes] |

<!-- Optional new scope: label Scope proposal here with source, recommendation and tradeoff; not a blocking Open OI until owner-adopted. Required gaps keep the normal OI schema. -->
<!-- A source problem the chunk 19 faithfulness check found and neither fixed nor raised (SKILL.md step 8b item 3): a note here with its source, its owner, and why no chunk 19 claim depends on it. -->
<!-- Out of scope, for the next review: a defect a delta review, an application check, or the scoped verification of later answers noticed outside its scope (SKILL.md step 7, Review after answers): a note labelled `Out of scope, for the next review` with its location and what is wrong. It is not an open item and bumps nothing; the next delta or full review that covers that location reads it and raises it or drops it. A note whose problem a later change fixed is marked `Resolved in vX.X` (the version that fixed it) by any later pass or by the author. A note on the master's gate lines (the Reconciled, E2E gate, and E2E basis lines and the E3 marker inventory; in COMBINED mode, the cover's) is outside every review's scope: the step 8b run that rewrites those lines marks it `Resolved in vX.X`. The mark bumps nothing. -->

- [Note 1]
- [Note 2]

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 17-appendix-and-wishlist.md | NEXT: 19-e2e-system-design.md -->
