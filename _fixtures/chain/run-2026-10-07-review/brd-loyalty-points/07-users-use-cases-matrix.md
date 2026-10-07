<!--
CHUNK: 07
TITLE: Users & Use Cases Matrix
PROJECT: Loyalty Points
VERSION: 1.1
DEPENDS_ON: 04, 05, 06a, 06b
PART OF: BRD - Loyalty Points
PURPOSE: One consolidated view of who is allowed to do what. Every persona from chunk 04 is a column; every use case from chunks 05/06 is a row. The matrix is derived from the Actor fields of the detailed use cases - it must never contradict them.
CONSISTENCY RULES: (1) Every UC ID from chunk 05 appears exactly once as a row, except rows marked Merged into UC-NN or Removed, which are left out. (2) Every persona from chunk 04 appears exactly once as a column. (3) A "Yes" cell must match the UC's Primary or Supporting Actor; a persona listed as an actor in a UC must have "Yes" here. (4) Conditional access gets a numbered footnote, never a bare "Yes".
-->

# Users & Use Cases Matrix

> **How to read.** Rows are the use cases (functions) of the system; columns are the users (personas). **Yes** = this user is allowed to perform the use case. **-** = not allowed. A numbered footnote marks conditional access (e.g., own records only, requires approval). External business parties are not users and never appear as columns: they appear in the use cases and in chunk 08 (Integrations).

| Use Case | Member | Loyalty Administrator |
|----------|:------:|:---------------------:|
| UC-01 View Points Balance | Yes¹ | - |
| UC-02 View Points History | Yes¹ | - |
| UC-03 Correct a Member's Points | - | Yes |

¹ Own points only.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 06b-use-cases-loyalty-administrator.md | NEXT: 08-integrations.md -->
