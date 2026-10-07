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

**Table 10 - Users & Use Cases Matrix**

| Use Case | Clinic Owner | Receptionist | Patient |
|----------|:-----------:|:-----------:|:-----------:|
| UC-01 Set up the clinic account | Yes | - | - |
| UC-02 Give a receptionist a login | Yes | Yes¹ | - |
| UC-03 Read the weekly no-show report | Yes | - | - |
| UC-04 Set the reminder timing | Yes | - | - |
| UC-05 Pay for the subscription | Yes | - | - |
| UC-06 Review the staff activity log | Yes | - | - |
| UC-07 Add an appointment | - | Yes | - |
| UC-08 Record a patient's consent | - | Yes | Yes² |
| UC-09 Import appointments from a file | - | Yes | - |
| UC-10 Check the day's appointment statuses | - | Yes | - |
| UC-11 Cancel an appointment for a patient | - | Yes | - |
| UC-12 Add a patient to the waitlist | - | Yes | - |
| UC-13 Record whether the patient came | - | Yes | - |
| UC-14 Confirm or cancel from the WhatsApp reminder | - | - | Yes³ |
| UC-15 Confirm or cancel through the SMS link | - | - | Yes³ |
| UC-16 Accept a waitlist slot offer | - | - | Yes⁴ |
| UC-17 Stop all messages | - | Yes⁵ | Yes³ |

¹ The Receptionist only accepts the invitation to their own login. A Receptionist cannot give logins.

² The Patient takes part by giving consent to the Receptionist. For a patient under 15, the guardian gives it.

³ Own appointments and own messages only. For a patient under 15, the guardian acts.

⁴ Only patients on the clinic's waitlist who have a consent record.

⁵ Records an opt-out the patient gives by phone or at the desk (UC-17 A3).

## Notes

- Whether the Clinic Owner can also do the Receptionist's use cases is open: see the marker in [chunk 04 Personas / Actors](./04-scope-and-personas.md#personas--actors).
- The Patient has no login. The Patient acts only through messages and the SMS link page.
- A persona is a supporting actor of a use case only when it takes a step of that use case, in the Main Flow or in an alternate or exception flow, as the Patient does in UC-08 step 3 and the Receptionist does in UC-17 A3. A patient who only talks to the Receptionist by phone or at the desk is not an actor of that use case.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06c-use-cases-patient.md | NEXT: 08-integrations.md -->
