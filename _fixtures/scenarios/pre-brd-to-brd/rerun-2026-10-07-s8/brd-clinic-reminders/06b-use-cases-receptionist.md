<!--
CHUNK: 06b
TITLE: Detailed Use Cases - Receptionist
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: BRD - Clinic Reminders
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - Receptionist

All detailed use cases follow this structure:

- **Actor & Goal**: Who performs it, what they want, what triggers it.
- **Why**: The business value of this use case.
- **Preconditions**: What must be true before the use case can start.
- **Main Flow**: Numbered detailed steps - actor action, system response, alternating.
- **Alternate & Exception Flows**: What happens when the path branches or fails, in business terms.
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram (or in connected numbered views for a large use case), derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

---

## UC-07: Enter an appointment

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Add a booked visit so that the patient gets a reminder. |
| **Trigger** | A patient books a visit by phone, on WhatsApp, or at the desk. |

### Why

Reminders, waitlist offers, and the weekly report work only on appointments in Clinic Reminders. Appointment entry is a Must ([pre-BRD 14 MoSCoW, Must (2)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). It serves Business Objectives 1 and 2 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The receptionist is signed in (UC-02).
- The doctor is listed in the clinic account (UC-01).

### Main Flow

1. The Receptionist opens a new appointment.
2. The system asks for the patient's mobile number.
3. The Receptionist enters the mobile number.
4. The system shows every patient the clinic knows under that mobile number, each with their consent status.
5. The Receptionist picks the patient, or adds a new patient with the details in [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds).
6. The system checks the patient's consent record. For a patient marked under 15, it asks the receptionist to confirm that the patient is still under 15.
7. If the patient has no consent record, the Receptionist records consent (UC-09).
8. The Receptionist enters the doctor, the date, and the time, and saves.
9. The system saves the appointment as Booked and shows when the reminder will go.

### Alternate & Exception Flows

- **A1 - Patient under 15:** At step 5, the receptionist marks the patient as under 15 and enters the guardian's details. The guardian gives consent and gets the messages ([03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)). If the patient is now 15 or older, the receptionist removes the mark and records the patient's own consent (UC-09). **[NEEDS CLARIFICATION: Counsel to confirm what happens to a guardian's consent when the patient turns 15, and whether messages may keep going to the guardian's number with the patient's consent.]**
- **E1 - Slot already taken:** At step 8, the doctor already has an appointment at that time. **[NEEDS CLARIFICATION: proposed: the system warns the receptionist and still allows the booking, because clinics overbook (02 / Fact 3); confirm or replace]**
- **E2 - Date in the past:** At step 8, the date and time have passed. **[NEEDS CLARIFICATION: proposed: the system refuses the appointment and asks for a future date; confirm or replace]**
- **E3 - No consent given:** At step 7, the patient does not give consent. The system saves the appointment and sends this patient no message (02 / Constraint 8). The day view marks the appointment (UC-10, E2).
- **E4 - Reminder time already passed:** At step 9, the visit is sooner than the usual reminder time. The reminder follows [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules).

### Business Rules & Constraints

- An appointment needs a patient with a mobile number, a listed doctor, and a date and time ([03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds)).
- Messages go only to patients with consent (02 / Constraint 8).
- The reminder time follows [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules).

### Acceptance Criteria

- [ ] Given a listed doctor, when the receptionist saves an appointment for a patient with consent, then it shows as Booked with its reminder time.
- [ ] Given a patient with no consent record, when the receptionist enters the patient, then the system asks for consent before saving (step 7).
- [ ] Given a patient under 15 (A1), when the reminder time comes, then the reminder goes to the guardian's mobile number.
- [ ] Given the doctor already has an appointment at that time (E1), when the receptionist saves, then the system warns and still saves the appointment.
- [ ] Given a past date (E2), when the receptionist saves, then the system refuses the appointment.
- [ ] Given a patient who gave no consent (E3), when the reminder time comes, then no message goes to the patient.
- [ ] Given a visit sooner than the usual reminder time (E4), when the receptionist saves it, then the reminder goes at once (03 / Channel rules).

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-08: Import appointments from a file

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Add many appointments at once from a file. |
| **Trigger** | Reception has a file of upcoming appointments, for example at onboarding. |

### Why

Receptionists worry that a new system means more typing ([pre-BRD 05 Empathy Map, Receptionist](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). Import saves them from typing every appointment again. It is a Must ([pre-BRD 14 MoSCoW, Must (2)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)).

### Preconditions

- The receptionist is signed in (UC-02).
- The receptionist has a file of appointments. A row that lacks a detail in [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds) follows E2.

### Main Flow

1. The Receptionist chooses to import appointments.
2. The system asks for the file.
3. The Receptionist picks the file.
4. The system checks each row and shows a preview: the rows ready to import, and the patients with no consent.
5. The Receptionist confirms the import, and confirms that the clinic holds written consent for every patient that the file marks with consent.
6. The system saves the ready rows as Booked appointments.
7. The system shows how many appointments it imported.

### Alternate & Exception Flows

- **A1 - File carries consent:** At step 4, the file states each patient's consent and when it was given. The system adds it to each patient's consent record ([03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)). **[NEEDS CLARIFICATION: Counsel to confirm whether consent taken from an imported file is enough, or whether each imported patient must consent again.]**
- **E1 - Patients with no consent:** At step 4, some patients have no consent; old lists may lack it ([pre-BRD 06 Market Comparison, section 4](../../run/pre-brd-clinic-reminders/06-market-comparison.md)). **[NEEDS CLARIFICATION: proposed: the system imports their appointments but sends them no message until reception records consent (UC-09); confirm or replace]**
- **E2 - Row errors:** At step 4, a row lacks a detail in [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds), such as the mobile number, names an unknown doctor, or has a past date. **[NEEDS CLARIFICATION: proposed: the system skips the row and lists it with the reason; confirm or replace]**
- **E3 - Duplicate rows:** At step 4, a row matches an existing appointment: the same patient, doctor, date, and time. **[NEEDS CLARIFICATION: proposed: the system skips the duplicate and lists it; confirm or replace]**

### Business Rules & Constraints

- Imported appointments follow the same rules as entered ones (UC-07).
- Consent from the file follows [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), including written explicit consent (02 / Constraint 2).
- The file format is for the SDD ([12 / Technical Inputs for the SDD](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)).

### Acceptance Criteria

- [ ] Given a valid file, when the receptionist confirms the import, then every valid row becomes a Booked appointment.
- [ ] Given a file that carries consent (A1), when the import completes, then each patient's consent record shows the consent and its time.
- [ ] Given a file that carries consent (A1), when the import completes, then each consent record shows the import date and the receptionist who confirmed it.
- [ ] Given patients with no consent (E1), when their reminder time comes, then no message goes to them.
- [ ] Given a row with an error (E2), when the import completes, then the row is not imported and the receptionist sees why.
- [ ] Given a duplicate row (E3), when the import completes, then no second appointment exists.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-09: Record a patient's consent

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Record the patient's consent so that the clinic may message the patient. |
| **Trigger** | A new patient books, or a patient with no consent agrees to get messages. |

### Why

Clinic Reminders may message only patients who gave consent (02 / Constraints 2, 3, and 8). Consent capture is a Must ([pre-BRD 14 MoSCoW, Must (6)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)).

### Preconditions

- The patient is known to the clinic (UC-07 or UC-08).

### Main Flow

1. The Receptionist opens the patient's consent record.
2. The system shows the consent status: none, given, or opted out.
3. The Receptionist asks the patient for consent to WhatsApp and SMS reminders and waitlist offers.
4. The Receptionist records the consent and how it was given. **[NEEDS CLARIFICATION: proposed: reception records how consent was given: in writing at the desk, or by WhatsApp; confirm or replace]**
5. The system saves the consent with its time.
6. The system shows that the patient can now get messages.

### Alternate & Exception Flows

- **A1 - Patient under 15:** At step 3, the guardian gives consent. The receptionist records the guardian's name and mobile number (02 / Constraint 3).
- **A2 - Patient who opted out:** At step 2, the record shows an opt-out. The patient agrees to messages again, and the receptionist records new consent ([03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)).
- **A3 - Patient stops messages at the desk or by phone:** At step 2, the patient asks the clinic to stop all messages. The receptionist records the opt-out. The system saves it with its time, stops every message to the patient, and handles the patient's waitlist entry as in UC-17.
- **E1 - Patient refuses:** At step 3, the patient refuses. The receptionist records no consent, and the system sends this patient no message (02 / Constraint 8).

### Business Rules & Constraints

- One consent covers WhatsApp and SMS reminders and waitlist offers ([03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)).
- Consent must be written and explicit (02 / Constraint 2).
- The consent record keeps how and when consent was given ([pre-BRD 06 Market Comparison, section 4](../../run/pre-brd-clinic-reminders/06-market-comparison.md)).

### Acceptance Criteria

- [ ] Given a patient with no consent, when the receptionist records consent, then the record shows its time and source, and messages can go to the patient.
- [ ] Given a patient under 15 (A1), when the guardian's consent is recorded, then the record names the guardian and messages go to the guardian.
- [ ] Given a patient who opted out (A2), when new consent is recorded, then messages start again.
- [ ] Given a patient who refuses (E1), when the reminder time comes, then no message goes to the patient.
- [ ] Given a patient who asks reception to stop messages (A3), when the receptionist records the opt-out, then no further message goes to the patient.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-10: Check the day's replies

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Know who confirmed, who cancelled, and who has not replied. |
| **Trigger** | The receptionist starts the working day, or checks the schedule during the day. |

### Why

Receptionists want a morning view of who confirmed, who cancelled, and who has not replied. They then call only the patients on the short call list ([pre-BRD 04 Value Proposition Canvas, Receptionist](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). It serves Business Objectives 5 and 6 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The receptionist is signed in (UC-02).

### Main Flow

1. The Receptionist opens the day view.
2. The system shows the day's appointments, each with its reply status: confirmed, cancelled, no reply, or reminder not sent yet.
3. The Receptionist opens the call list.
4. The system shows the call list: appointments whose reminder got no reply, appointments not reached (E1), and appointments with no consent or an opt-out (E2), each with the patient's name and mobile number. Appointments with consent and no opt-out whose reminder has not gone yet show "reminder not sent yet" and are not on the call list.
5. The Receptionist calls these patients by phone.
6. When a patient answers, the Receptionist records the result (UC-11).
7. The system updates the day view.

### Alternate & Exception Flows

- **A1 - Another day:** At step 1, the receptionist picks another date. **[NEEDS CLARIFICATION: proposed: the day view can show any date; confirm or replace]**
- **A2 - Message status (Growth):** At step 2, the system also shows, for each reminder, the channel used and whether it was delivered ([pre-BRD 14 MoSCoW, Should](../../run/pre-brd-clinic-reminders/14-moscow-method.md)).
- **A3 - One doctor (paid launch):** At step 2, the receptionist picks one doctor, and the system shows only that doctor's appointments ([03 / Doctors and fees](./03-definitions-and-domain-concepts.md#doctors-and-fees)).
- **E1 - Patient not reached:** At step 2, neither WhatsApp nor SMS delivered the reminder. The appointment shows as not reached ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)).
- **E2 - No consent:** At step 2, the patient has no consent or opted out. The day view marks the appointment "no consent" or "opted out", and the appointment is on the call list (step 4).
- **E3 - Typed reply:** At step 2, the patient typed a reply instead of tapping a button. The day view shows the typed text ([03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules)).

### Business Rules & Constraints

- A patient's reply updates the status in the day view ([pre-BRD 01 Concept Sheet, Proposed Solution](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)).
- The appointment statuses are those in [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle). The reply statuses are those of Reply status in the Glossary ([02](./02-glossary-assumptions-facts.md#glossary)).
- A receptionist sees only their own clinic's appointments ([10 / NFR-05](./10-nfrs.md)).

### Acceptance Criteria

- [ ] Given the day's appointments, when the receptionist opens the day view, then each appointment shows its reply status: confirmed, cancelled, no reply, or reminder not sent yet.
- [ ] Given a patient taps Confirm, when the receptionist looks at the day view, then that appointment shows confirmed.
- [ ] Given appointments with no reply, when the receptionist opens the call list, then they appear on it, with name and mobile number.
- [ ] Given a reminder that neither channel delivered (E1), when the receptionist opens the day view, then the appointment shows as not reached.
- [ ] Given a patient with no consent (E2), when the receptionist opens the day view, then the appointment shows "no consent".
- [ ] Given a typed reply (E3), when the receptionist opens the day view, then the typed text shows next to the appointment.
- [ ] Given an appointment with consent and no opt-out whose reminder has not gone yet, when the receptionist opens the call list, then the appointment is not on it.
- [ ] Given an appointment not reached (E1), when the receptionist opens the call list, then the appointment is on it.
- [ ] Given another date (A1), when the receptionist picks it, then the day view shows that date's appointments.
- [ ] Given the Growth phase (A2), when the receptionist opens the day view, then each reminder shows its channel and whether it was delivered.
- [ ] Given the paid launch (A3), when the receptionist picks one doctor, then only that doctor's appointments show.
- [ ] Given an appointment with no consent or an opt-out (E2), when the receptionist opens the call list, then the appointment is on it.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-11: Change or cancel an appointment

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Keep the schedule right when a patient cancels or confirms by phone or at the desk. |
| **Trigger** | A patient calls or comes to the desk to cancel, confirm, or move a visit. |

### Why

Handling cancellations is part of the receptionist's job ([pre-BRD 04 Value Proposition Canvas, Receptionist](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). A cancellation frees the slot for the waitlist ([pre-BRD 01 Concept Sheet, Proposed Solution](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)). It serves Business Objective 3 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The appointment exists.

### Main Flow

1. The Receptionist finds the appointment.
2. The system shows its details and status.
3. The Receptionist cancels the appointment.
4. The system asks the receptionist to confirm the cancellation. **[NEEDS CLARIFICATION: proposed: the system asks the receptionist to confirm before it cancels; confirm or replace]**
5. The Receptionist confirms.
6. The system sets the appointment to Cancelled and frees the slot.
7. The system offers the freed slot to the waitlist ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules)).

### Alternate & Exception Flows

- **A1 - Confirm by phone:** At step 3, the patient confirms by phone, and the receptionist marks the appointment Confirmed. **[NEEDS CLARIFICATION: proposed: reception can mark an appointment Confirmed after a phone call; confirm or replace]**
- **A2 - Move the visit:** At step 3, the receptionist changes the date, the time, or the doctor. **[NEEDS CLARIFICATION: proposed: a moved appointment keeps its patient, frees the old slot for the waitlist, and gets a new reminder for the new time; confirm or replace]**
- **E1 - Visit time passed:** At step 2, the visit time has passed. **[NEEDS CLARIFICATION: proposed: the system then allows only an attendance mark (UC-12), not a change or a cancellation; confirm or replace]**

### Business Rules & Constraints

- A cancellation starts the waitlist offers ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 2).
- The statuses follow [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle).

### Acceptance Criteria

- [ ] Given a booked appointment, when the receptionist cancels it, then it shows Cancelled and the slot goes to the waitlist.
- [ ] Given a patient who confirms by phone (A1), when the receptionist marks it, then the appointment shows Confirmed.
- [ ] Given a moved visit (A2), when the change is saved, then the old slot goes to the waitlist and a new reminder follows the new time.
- [ ] Given a past visit (E1), when the receptionist tries to cancel it, then the system refuses.
- [ ] Given two appointments for one doctor at the same date and time, when the receptionist cancels one, then no waitlist offer goes out.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-12: Mark who attended

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Record whether each patient came, so that the no-show report is right. |
| **Trigger** | A visit time passes. |

### Why

The no-show report depends on reception marking attendance ([pre-BRD 06 Market Comparison, No-show and cancellation analytics](../../run/pre-brd-clinic-reminders/06-market-comparison.md)). Business Objective 1 is measured from these marks ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The visit time has passed.
- The appointment is Booked or Confirmed.

### Main Flow

1. The Receptionist opens the day view (UC-10).
2. The system shows the day's past appointments that have no attendance mark.
3. The Receptionist marks each one as Attended or No-show.
4. The system saves each mark.
5. The system shows the appointment with its new status.

### Alternate & Exception Flows

- **A1 - Correct a mark:** At step 3, the receptionist changes a mark set by mistake. **[NEEDS CLARIFICATION: proposed: reception can change an attendance mark until the weekly report for that week is sent; confirm or replace]**
- **E1 - Appointment left unmarked:** The receptionist does not mark a past appointment. The weekly report counts it by the rule in [03 / Measures](./03-definitions-and-domain-concepts.md#measures).

### Business Rules & Constraints

- Only Booked or Confirmed appointments can be marked ([03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle)).
- Attendance marks feed the weekly report ([03 / Measures](./03-definitions-and-domain-concepts.md#measures)).

### Acceptance Criteria

- [ ] Given a past confirmed appointment, when the receptionist marks it No-show, then it shows No-show and counts in the week's no-show rate.
- [ ] Given a past booked appointment, when the receptionist marks it Attended, then it shows Attended.
- [ ] Given a mark set by mistake (A1), when the receptionist changes it before the report is sent, then the report uses the new mark.
- [ ] Given a cancelled appointment, when the receptionist opens the unmarked list, then it does not appear.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-13: Add a patient to the waitlist

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Put a patient who wants an earlier visit on the clinic's waitlist. |
| **Trigger** | A patient asks to be seen earlier if a slot frees up. |

### Why

Freed slots stay empty because waiting patients cannot be reached in time ([pre-BRD 01 Concept Sheet, Problem Statement](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)). The waitlist is a Must ([pre-BRD 14 MoSCoW, Must (7)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). It serves Business Objective 3 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The patient is known to the clinic (UC-07 or UC-08).

### Main Flow

1. The Receptionist opens the waitlist.
2. The system shows the waitlisted patients in order ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 4).
3. The Receptionist adds the patient.
4. The system asks which slots the patient can take. The details are open in [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 3.
5. The Receptionist enters the patient's choice.
6. The system adds the patient to the waitlist and shows the patient's place.

### Alternate & Exception Flows

- **A1 - Remove from the waitlist:** At step 3, the receptionist takes a patient off the waitlist at the patient's request ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 12).
- **E1 - No consent:** At step 3, the patient has no consent. The system refuses and asks for consent first (UC-09; [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 1).
- **E2 - Already waitlisted:** At step 3, the patient is already on the waitlist. **[NEEDS CLARIFICATION: proposed: the system shows the existing entry instead of adding a second one; confirm or replace]**

### Business Rules & Constraints

- A patient joins only at their own request, with consent ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 1).
- The waitlist order follows [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 4.

### Acceptance Criteria

- [ ] Given a patient with consent, when the receptionist adds the patient, then the patient appears on the waitlist with a place.
- [ ] Given a patient with no consent (E1), when the receptionist adds the patient, then the system refuses and asks for consent.
- [ ] Given a waitlisted patient (A1), when the receptionist removes the patient, then the patient gets no more offers.
- [ ] Given a patient already on the waitlist (E2), when the receptionist adds the patient again, then no second entry appears.
- [ ] Given a waitlisted patient whose own visit has passed, when a slot frees up, then the patient gets no offer ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 12).

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06a-use-cases-clinic-owner.md | NEXT: 06c-use-cases-patient.md -->
