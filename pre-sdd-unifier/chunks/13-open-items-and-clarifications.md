<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: all preceding Pre-SDD chunks (00 through 12)
PART OF: Pre-SDD - [Project Name]
PURPOSE: Output of the cleared-context reviewer pass (review-and-open-items.md). Captures the gaps, unsourced or guessed values, fragment mismatches, product names, open hard items, conflicts, lock-list gaps, and ID errors an independent reviewer finds. Every item carries a concrete Recommended Answer, ready to apply once a person accepts it.
GENERATED_BY: pre-sdd-unifier reviewer (a cleared-context subagent run after the write-up, before the G3 stop). Written in full mode only; a quick Pre-SDD has no review and no chunk 13.
WORKFLOW: After this chunk is written, the skill walks the user through each Open item: accept the recommendation, choose another option, defer, or give an own answer (an answer policy the user set for the run accepts the recommendations it may). An accepted answer that changes a value goes into the project state through `derive --apply` and a new `compute`, never into a fragment by hand; the item gets its Resolution Log row, and the decision story goes to decision-log.md § Clarification register.
-->

# 13. Open Items & Clarifications

> **What this section is.** A backlog of findings a reviewer with cleared context raised after the Pre-SDD was written. Each comes with a **Recommended Answer**, a concrete resolution ready to apply. Items are decisions awaiting a person's acceptance.
>
> **What this section is not.** It is not a list of the inline `[NEEDS CLARIFICATION: ...]` markers or the unknowns (`QD-NN`, chunk 10): those stay where they are. It is not the engine's validation (chunk 10) either; a finding here may point at one, for example a conflict the prose smooths over.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions, never renumbered or reused. |
| **Where** | Chunk and section (for example `03c § 3.3`, `05 § 5.3`), or "global". |
| **Type** | Missing source / Guessed value / Fragment mismatch / Product named / Open hard item / Conflict / Lock-list gap / ID error / Dash character / Ambiguity / Risk / Duplication (BRD content restated instead of cited). |
| **Concern** | One paragraph: what is wrong and why it matters for the G3 sign-off or the SDD. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The proposed resolution, ready to apply: the project-state change (the entry and its new value, status, or source) or the exact text for the chunk. A finding that needs no change reads `No change: <evidence>`. |
| **Why** | REQUIRED. One or two lines: the evidence behind the recommendation and the tradeoff it accepts. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Decided - pending application / Accepted - applied / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`. |

Write the Status field as the literal legend value, for example `- **Status:** Accepted - applied`. Put the update link on a separate `- **Resolution:**` line.

---

## Open Items

### OI-01: [Short title]

- **Where:** [Chunk and section, or "global"]
- **Type:** [Missing source | Guessed value | Fragment mismatch | Product named | Open hard item | Conflict | Lock-list gap | ID error | Dash character | Ambiguity | Risk | Duplication]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
  - **C.** [Option C] - [one-line tradeoff]. *(Optional.)*
- **Recommended Answer:** [Option letter + the concrete resolution, e.g. "Option A - set REL-04.2 to Open with owner and due date (its value has no source); ask the data owner".]
- **Why:** [The reason this option wins, with its evidence.]
- **Status:** Open

---

<!-- Repeat the OI block for each open item. -->

---

## Resolution Log

<!-- When an open item is decided, add its row here with a pointer to the change (the chunk and heading, or the project-state entry). A source is a person's answer, a BRD version (`[KEY] v[X.X]`), or an answer policy (`Policy: <policy> (set by <name>, <date>)`). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk and section, or entry ID] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected / Settled by [source]] |

---

## Reviewer Notes

<!-- Coverage record first (required): one row per check in the reviewer brief (review-and-open-items.md § The checks), each "checked: N findings (OI IDs)" or "checked: no issue found", with what was checked. A zero-finding review is valid. A delta review adds one dated row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN (vX.X)`; a scoped application pass adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: OI-NN (vX.X)`. A light run says so in the first row, so what it skips reads as intentional. A defect a delta review or an application pass notices outside its scope is a note labelled `Out of scope, for the next review`, not an open item. -->

| Check | Checked | Findings | Notes |
|---|---|---|---|
| [Every value has a source] | [What was checked] | [N findings (OI-NN), or No issue found] | [Notes] |

- [Note]

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 12-sdd-handoff-guide.md | NEXT: none -->
