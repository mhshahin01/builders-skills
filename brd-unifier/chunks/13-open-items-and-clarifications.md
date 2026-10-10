<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - [Project Name]
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every unapplied item carries a concrete Recommended Answer and Why, ready to be applied to the BRD body once the user accepts it. Applied items keep their stable OI heading, Status and Resolution Log pointer; their decision narrative lives in `decision-log.md`.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, defer, or reject the Recommended Answer; an answer policy the user set for the run accepts recommended answers in the user's place (SKILL.md step 8, Answer policy). Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, a Reviewer Note whose choice is needed to finalise the BRD (SKILL.md step 7, Editorial ownership), and a live remainder in a decision or marker record that needs a business choice (a business review point included) can add open items after the first review; a missing fact stays a to-do (TD) item only. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open, Deferred, or Decided - pending application. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Every unapplied item carries a concrete Recommended Answer and Why. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body. An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
>
> **What this section is not.** It is not a list of `[NEEDS CLARIFICATION: ...]` markers found inside the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section, UC ID, or "global" if cross-cutting. |
| **Type** | Gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / Duplication (content restated instead of referenced - within the BRD or from source docs). |
| **Concern** | One paragraph. What was missed and why it matters. |
| **Options** | Concrete choices, each with a one-line tradeoff. At least 2 options per item where a choice exists. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply BRD content (the exact rule, step, row, or wording that would close the item). This is what gets injected into the body when you accept. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives: the evidence behind it (source section, stated business expectation, domain practice, risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting your decision) / Decided - pending application (decided on a third-run discovery; the next request applies it) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: [Short title]

- **Where:** [Section name or UC ID, e.g., "UC-04 exception flows" or "global - NFRs" or "07 Users & Use Cases Matrix"]
- **Type:** [Gap | Missing scenario | Corner case | Ambiguity | Risk | Inconsistency | Duplication]
- **Concern:** [One paragraph. What is missing or unclear, and why it matters for downstream design or implementation.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
  - **C.** [Option C] - [one-line tradeoff]. *(Optional third option.)*
- **Recommended Answer:** [Option letter + the concrete resolution text, ready to paste into the BRD. E.g., "Option A - add to UC-04 Exception Flows: 'E2 - Payment partner unavailable: the system informs the customer the payment could not be completed and keeps the order reserved for 30 minutes.'"]
- **Why:** [The reason this option wins, e.g., "Option A preserves the sale (the SoW names cart abandonment as the top revenue leak) at the cost of a 30-minute inventory hold; B releases inventory faster but loses the recovery window."]
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

<!-- Applied-item stub: keep the OI heading and anchor, then Status: Accepted - applied / Adjusted - applied, and Resolution: [row](#resolution-log). The Resolution Log row names the rule home in Resolved In; the full decision record is in `decision-log.md`. -->

---

## Resolution Log

<!-- When an open item is decided (accepted or adjusted and applied, deferred, or rejected), add its row here: for an applied item, a pointer to the BRD update (chunk + heading); for a deferred or rejected one, a pointer to its entry above. Keeps the audit trail. -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk and section, e.g., "06a / UC-04 Exception Flows"] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected / Settled by business review [point ID]] |

---

## Reviewer Notes

<!-- Coverage record (required): one row per major risk area. Checked: what the reviewer checked. Findings: the number of open items raised, with their IDs, or "No issue found". A risk area with no issue is a valid result. An area the reviewer could not check says "Not checked" and why. -->

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | [What was checked, e.g., "Every In Scope item against the use cases"] | [N (OI-NN, OI-NN) / No issue found] | [Optional] |
| Use-case exception coverage | [...] | [...] | [...] |
| Matrix consistency | [...] | [...] | [...] |
| NFRs | [...] | [...] | [...] |
| Integrations | [...] | [...] | [...] |
| Security / privacy | [...] | [...] | [...] |
| Data lifecycle | [...] | [...] | [...] |

<!-- Optional new scope: label Scope proposal here with source, recommendation and tradeoff; not a blocking Open OI until owner-adopted. Required gaps keep the normal OI schema. -->

<!--
Optional. Free-form notes from the reviewer that did not crystallise into a numbered open item.
Examples: patterns observed across multiple use cases, stylistic concerns, suggestions for a future revision.
-->

- [Note 1]
- [Note 2]

<!-- MASTER: [project-slug]-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
