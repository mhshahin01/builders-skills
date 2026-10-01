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

> **How to read.** Rows are the use cases (functions) of the system; columns are the users (personas). **Yes** = this user is allowed to perform the use case. **-** = not allowed. A numbered footnote marks conditional access (e.g., own records only, requires approval). External business parties are not users and never appear as columns: they appear in the use cases and in chunk 08 (Integrations).

| Use Case | Clinic Owner | Receptionist | Patient |
|----------|:-----------:|:-----------:|:-----------:|
| UC-01 Set up the clinic | Yes | - | - |
| UC-02 Manage receptionist logins | Yes | - | - |
| UC-03 Read the weekly no-show report | Yes | - | - |
| UC-04 Change reminder timing | Yes | - | - |
| UC-05 Review staff actions | Yes | - | - |
| UC-06 Pay the subscription | Yes | - | - |
| UC-07 Enter an appointment | - | Yes | - |
| UC-08 Import appointments from a file | - | Yes | - |
| UC-09 Record a patient's messaging consent | - | Yes | - |
| UC-10 Change or cancel an appointment | - | Yes | - |
| UC-11 Add a patient to the waitlist | - | Yes | - |
| UC-12 Follow the day's list and mark attendance | Yes¹ | Yes | - |
| UC-13 Confirm or cancel from the WhatsApp reminder | - | - | Yes² |
| UC-14 Confirm or cancel from the SMS link | - | - | Yes² |
| UC-15 Accept a slot offer | - | - | Yes² |
| UC-16 Stop all messages | - | - | Yes² |

¹ View only: the owner sees the day's list but does not mark attendance (UC-12, Business Rules).

² Own appointments and own waitlist request only, through the messages the patient receives. For a child under 15, the guardian acts.

## Notes

- The patient has no login. The patient acts only by answering messages and opening the confirm or cancel link.
- UC-04, UC-05, and UC-06 are available from the paid launch (2027-04-01).

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06c-use-cases-patient.md | NEXT: 08-integrations.md -->
