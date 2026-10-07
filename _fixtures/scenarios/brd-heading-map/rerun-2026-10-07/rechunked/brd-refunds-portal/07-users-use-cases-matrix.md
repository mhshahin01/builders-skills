<!--
CHUNK: 07
TITLE: Users & Use Cases Matrix
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 04, 05, 06a
PART OF: BRD - Refunds Portal
PURPOSE: One consolidated view of who is allowed to do what. Every persona from chunk 04 is a column; every use case from chunks 05/06 is a row. The matrix is derived from the Actor fields of the detailed use cases - it must never contradict them.
CONSISTENCY RULES: (1) Every UC ID from chunk 05 appears exactly once as a row, except rows marked Merged into UC-NN or Removed, which are left out. (2) Every persona from chunk 04 appears exactly once as a column. (3) A "Yes" cell must match the UC's Primary or Supporting Actor; a persona listed as an actor in a UC must have "Yes" here. (4) Conditional access gets a numbered footnote, never a bare "Yes".
-->

# Users & Use Cases Matrix

> **How to read.** Rows are the use cases; columns are the personas. **Yes** = allowed. **-** = not allowed. A numbered footnote marks conditional access.

| Use Case | Customer | Branch Manager |
|----------|:--------:|:--------------:|
| UC-01 Request a Refund | Yes | - |
| UC-02 Track Refund Status (Web and Mobile) | Yes | - |
| UC-03 Cancel a Refund Request | Yes | - |
| UC-04 Approve / Reject Refund | - | Yes¹ |

¹ Own branch only.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 06b-use-cases-branch-manager.md | NEXT: 08-integrations.md -->
