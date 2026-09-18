<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - [Project Name]
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the BRD body once the user accepts it.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s), the item moves to the Resolution Log, and the Changes Log is bumped.
LATER ITEMS: The consistency check (14-todo.md step 2) and the writing of chunks 15-17 can add open items after the first review. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open or Deferred. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body.
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
| **Status** | Open (awaiting your decision) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

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

---

## Resolution Log

<!-- When an open item is accepted (or adjusted) and applied, move its summary here with a pointer to the BRD update (chunk + heading). Keeps the audit trail. -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk and section, e.g., "06a / UC-04 Exception Flows"] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected] |

---

## Reviewer Notes

<!--
Optional. Free-form notes from the reviewer that did not crystallise into a numbered open item.
Examples: patterns observed across multiple use cases, stylistic concerns, suggestions for a future revision.
-->

- [Note 1]
- [Note 2]

<!-- MASTER: brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
