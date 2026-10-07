<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Refunds Portal
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every unapplied item carries a concrete Recommended Answer and Why, ready to be applied to the BRD body once the user accepts it. Applied items keep their stable OI heading, Status and Resolution Log pointer; their decision narrative lives in `decision-log.md`.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to its Resolution Log row. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, and a live remainder in a decision or marker record that needs a business choice (a business review point included) can add open items after the first review; a missing fact stays a to-do (TD) item only. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open, Deferred, or Decided - pending application. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

## Open Items

### OI-01: Partial refunds as a separate use case

- **Where:** 06b
- **Status:** Accepted - applied

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|-----------------|-------------|---------|
| OI-01 | 2026-09-21 | 06b UC-04 A1; 05 Use Case Summary (UC-05 merged into UC-04) | Accepted recommendation |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
