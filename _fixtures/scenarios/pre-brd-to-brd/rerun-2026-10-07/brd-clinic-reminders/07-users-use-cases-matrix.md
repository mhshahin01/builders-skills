<!--
CHUNK: 07
TITLE: Users & Use Cases Matrix
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 04, 05, 06a
PART OF: BRD - Clinic Reminders
PURPOSE: One consolidated view of who is allowed to do what. Every persona from chunk 04 is a column; every use case from chunks 05/06 is a row. The matrix is derived from the Actor fields of the detailed use cases - it must never contradict them.
CONSISTENCY RULES: (1) Every UC ID from chunk 05 appears exactly once as a row, except rows marked Merged into UC-NN or Removed, which are left out. (2) Every persona from chunk 04 appears exactly once as a column. (3) A "Yes" cell must match the UC's Primary or Supporting Actor; a persona listed as an actor in a UC must have "Yes" here. (4) Conditional access gets a numbered footnote, never a bare "Yes".
-->

# Users & Use Cases Matrix

Yes means the persona is a named primary or supporting actor. A dash means no permission is supplied by these use cases. External partners are listed in 08, never as columns.

| Use Case | Clinic Owner | Receptionist | Patient |
|----------|--------------|--------------|---------|
| UC-01 Use the clinic account | Yes¹ | Yes¹ | - |
| UC-02 Read the weekly no-show report | Yes¹ | - | - |
| UC-03 Pay the clinic subscription | Yes¹ | - | - |
| UC-04 Record patient consent | - | Yes¹ | Yes² |
| UC-05 Maintain clinic appointments | - | Yes¹ | - |
| UC-06 Run and inspect appointment reminders | - | Yes¹ | Yes² |
| UC-07 Maintain the waitlist | - | Yes¹ | Yes² |
| UC-08 Review the day's appointment status | - | Yes¹ | - |
| UC-09 Confirm or cancel a visit | - | - | Yes² |
| UC-10 Take an offered slot | - | - | Yes² |
| UC-11 Stop patient messages | - | - | Yes² |

¹ Clinic scope; the exact permissions remain unresolved in 03 and UC-01.

² The affected patient or guardian; opt-out does not require an active visit. Identity and consent authority remain unresolved in 03 and UC-04. These cells do not approve unstated access boundaries.


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06c-use-cases-patient.md | NEXT: 08-integrations.md -->
