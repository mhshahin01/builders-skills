<!--
CHUNK: 07
TITLE: Users & Use Cases Matrix
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04, 05, 06a
PART OF: BRD - [Project Name]
PURPOSE: One consolidated view of who is allowed to do what. Every persona from chunk 04 is a column; every use case from chunks 05/06 is a row. The matrix is derived from the Actor fields of the detailed use cases - it must never contradict them.
CONSISTENCY RULES: (1) Every UC ID from chunk 05 appears exactly once as a row, except rows marked Merged into UC-NN or Removed, which are left out. (2) Every persona from chunk 04 appears exactly once as a column. (3) A "Yes" cell must match the UC's Primary or Supporting Actor; a persona listed as an actor in a UC must have "Yes" here. (4) Conditional access gets a numbered footnote, never a bare "Yes".
-->

# Users & Use Cases Matrix

> **How to read.** Rows are the use cases (functions) of the system; columns are the users (personas). **Yes** = this user is allowed to perform the use case. **-** = not allowed. A numbered footnote marks conditional access (e.g., own records only, requires approval). External business parties are not users and never appear as columns: they appear in the use cases and in chunk 08 (Integrations).

| Use Case | [Persona 1] | [Persona 2] | [Persona 3] |
|----------|:-----------:|:-----------:|:-----------:|
| UC-01 [Short Title] | Yes | Yes | - |
| UC-02 [Short Title] | Yes | - | - |
| UC-03 [Short Title] | Yes | Yes | Yes¹ |

¹ [Condition, e.g., "Own region only."]

## Notes

<!-- Optional. Access rules that do not fit a footnote: role hierarchies, delegation, approval chains - in business terms. -->

- [Note 1, or remove this section if empty.]

<!-- MASTER: [project-slug]-brd-master.md | PREV: 06a-use-cases-[persona-slug].md | NEXT: 08-integrations.md -->
