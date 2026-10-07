<!--
PRE-BRD CHUNK: 24
TITLE: Open Items & Assumptions Log
TIER: Review Output
PART OF: PRE-BRD Master
PURPOSE: Output of the post-generation cleared-context reviewer pass (runs LAST, after the investor pass, reviewing chunks 01-23). Captures unsourced or shaky figures, competitor coverage gaps, cross-chunk figure inconsistencies, cross-tier incoherence, and weak go/no-go logic. Every item carries a Recommended Answer AND the Why behind it. Also logs the assumptions the authoring pass made, each with its basis and the risk if wrong.
GENERATED_BY: pre-brd-unifier post-generation reviewer (cleared-context subagent). The reviewer authors this chunk only - it never edits chunks 01-23.
-->

# Open Items & Assumptions Log

> **What this section is.** A structured backlog of concerns identified after the pre-BRD was filled, by a reviewer running with cleared context, plus the log of assumptions the analysis rests on. Each open item comes with a **Recommended Answer** and its **Why**, so the decision-maker always has a reasoned default in hand.
>
> **What this section is not.** It is not a list of inline `[NEEDS CLARIFICATION: ...]` markers - those remain inline in the framework chunks. This section is the reviewer's *external* findings.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Framework chunk(s), e.g., "07 Market Sizing" or "22 ↔ 23" or "global". |
| **Type** | Unsourced figure / Figure inconsistency / Coverage gap / Cross-tier incoherence / Weak verdict logic / Ambiguity / Risk. |
| **Concern** | One paragraph. What is shaky or missing, and why it matters for the go/no-go decision. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | REQUIRED. The reviewer's concrete proposed resolution, ready to apply to the framework chunk(s) (the exact figure + source, row, or wording that would close the item). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives - the evidence behind it (source quality, cross-check result, framework logic) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: [Short title]

- **Where:** [Framework chunk(s) or "global"]
- **Type:** [Unsourced figure | Figure inconsistency | Coverage gap | Cross-tier incoherence | Weak verdict logic | Ambiguity | Risk]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
- **Recommended Answer:** [Option letter + the concrete resolution, e.g., "Option A - replace the 07 SAM figure with the bottom-up estimate ($412M) and cite [source]; update 22's Market signal accordingly."]
- **Why:** [The reason this option wins, e.g., "The bottom-up figure is built from sourced unit counts while the top-down one extrapolates a 2019 report; keeping the smaller, defensible number survives investor diligence at the cost of a less exciting headline."]
- **Status:** Open

---

<!-- Repeat the OI block for each open item. -->

---

## Assumptions Log

<!-- Every material assumption the authoring pass made while filling chunks 01-23. Each row: what was assumed, its basis, and the risk if it turns out wrong. The reviewer adds rows for implicit assumptions it uncovered. -->

| # | Assumption | Made in | Basis | Risk if wrong |
|---|------------|---------|-------|----------------|
| A-01 | [Assumption] | [Chunk] | [Source / heuristic / user statement] | [Effect on the verdict if false] |

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk and section] | [Accepted recommendation | Adjusted: short note | Deferred | Rejected] |

---

## Reviewer Notes

- [Note 1]
