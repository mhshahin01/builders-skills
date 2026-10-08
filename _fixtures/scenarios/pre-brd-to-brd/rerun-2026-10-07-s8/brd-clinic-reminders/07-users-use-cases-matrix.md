<!--
CHUNK: 07
TITLE: Users & Use Cases Matrix
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 04, 05, 06a, 06b, 06c
PART OF: BRD - Clinic Reminders
PURPOSE: One consolidated view of who is allowed to do what. Every persona from chunk 04 is a column; every use case from chunks 05/06 is a row. The matrix is derived from the Actor fields of the detailed use cases - it must never contradict them.
CONSISTENCY RULES: (1) Every UC ID from chunk 05 appears exactly once as a row, except rows marked Merged into UC-NN or Removed, which are left out. (2) Every persona from chunk 04 appears exactly once as a column. (3) A "Yes" cell must match the UC's Primary or Supporting Actor; a persona listed as an actor in a UC must have "Yes" here. (4) Conditional access gets a numbered footnote, never a bare "Yes".
-->

# Users & Use Cases Matrix

> **How to read.** Rows are the use cases (functions) of the system; columns are the users (personas). **Yes** = this user is allowed to perform the use case. **-** = not allowed. A numbered footnote marks conditional access (e.g., own records only, requires approval). External business parties are not users and never appear as columns: they appear in the use cases and in chunk 08 (Integrations).

| Use Case | Clinic Owner | Receptionist | Patient |
|----------|:-----------:|:-----------:|:-----------:|
| UC-01 Set up the clinic account | Yes | - | - |
| UC-02 Manage receptionist logins | Yes | - | - |
| UC-03 Read the weekly no-show report | Yes | - | - |
| UC-04 Export the consent records | Yes | - | - |
| UC-05 Change the reminder timing | Yes | - | - |
| UC-06 Pay the subscription | Yes | - | - |
| UC-07 Enter an appointment | - | Yes | - |
| UC-08 Import appointments from a file | - | Yes | - |
| UC-09 Record a patient's consent | - | Yes | - |
| UC-10 Check the day's replies | - | Yes | - |
| UC-11 Change or cancel an appointment | - | Yes | - |
| UC-12 Mark who attended | - | Yes | - |
| UC-13 Add a patient to the waitlist | - | Yes | - |
| UC-14 Confirm or cancel from the WhatsApp reminder | - | - | Yes¹ |
| UC-15 Confirm or cancel through the SMS link | - | - | Yes¹ |
| UC-16 Accept a waitlist offer | - | - | Yes¹ |
| UC-17 Stop all messages | - | - | Yes² |

¹ Own appointments only: each reminder, link, or offer acts only on the appointment or slot it was sent for ([03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules)).

² Own messages only: an opt-out stops the messages from the sender the patient answered ([03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 6).

## Notes

- Every user acts only inside their own clinic ([10 / NFR-05](./10-nfrs.md)).
- The Patient has no login. The Patient acts through WhatsApp replies and the SMS link page ([04 / Personas](./04-scope-and-personas.md#personas--actors)).
- Whether the Clinic Owner can also do the receptionist use cases is an open proposal in [04 / Personas](./04-scope-and-personas.md#personas--actors). The matrix follows the use-case actor fields as they stand.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06c-use-cases-patient.md | NEXT: 08-integrations.md -->
