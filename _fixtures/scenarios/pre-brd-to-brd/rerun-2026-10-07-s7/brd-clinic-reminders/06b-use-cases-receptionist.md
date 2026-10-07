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

## UC-07: Add an appointment

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Enter a booked visit so the patient gets reminders. |
| **Trigger** | A patient books a visit by phone, by WhatsApp, or at the desk ([pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Patient). |

### Why

Reminders, the day view, and the waitlist all start from the appointment ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Proposed Solution). Reminders raise attendance ([pre-BRD 10 EFAS](../../run/pre-brd-clinic-reminders/10-efas.md), O2). It serves BO-01 and BO-07.

### Preconditions

- The Receptionist is signed in (UC-02).

### Main Flow

1. The Receptionist opens the appointment book on the visit date.
2. The system shows that day's appointments, per doctor once per-doctor calendars are live.
3. The Receptionist chooses to add an appointment.
4. The system asks for the patient's name, the patient's mobile number, whether the patient is under 15 (and if so the guardian's name and mobile number), the message language (Arabic or English), the date and time, and, once per-doctor calendars are live, the doctor. **[NEEDS CLARIFICATION: proposed: these are the appointment details, and the message language is Arabic unless the Receptionist picks English; confirm or replace]**
5. The Receptionist enters the details.
6. The system checks whether the patient has a consent record.
7. The system saves the appointment as Booked.
8. The system sets the reminder time from the clinic's reminder settings (UC-04).
9. The system shows the appointment in the day's list with its reminder time.

### Alternate & Exception Flows

- **A1 - No consent record:** At step 6, the patient has no consent record. The system asks the Receptionist to record consent first (UC-08). If the patient does not agree, the system saves the appointment and sends the patient no messages. The day view shows the appointment as "No consent".
- **A2 - Patient under 15:** At step 4, the Receptionist enters the guardian's mobile number. The guardian receives the messages and answers them ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 7; [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Target Audience).
- **E1 - Visit sooner than the reminder time:** At step 8, the visit is closer than the reminder lead time, for example later the same day. **[NEEDS CLARIFICATION: when an appointment is booked closer to the visit than the reminder lead time, does the system send the reminder at once, or send none?]**
- **E2 - Doctor already booked at that time:** At step 7, the doctor already has an appointment at that time. **[NEEDS CLARIFICATION: proposed: the system warns the Receptionist and saves the appointment if the Receptionist confirms, because some clinics overbook to cover no-shows ([pre-BRD 05](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Clinic owner, Does); confirm or replace]**

### Business Rules & Constraints

- Only patients with a consent record get messages (constraint 12).
- Each appointment has one patient and one date and time. Once per-doctor calendars are live, it also has one doctor ([chunk 03 Appointment](./03-definitions-and-domain-concepts.md#appointment)).
- Messages to the patient use the patient's message language, Arabic or English ([chunk 03 Message content](./03-definitions-and-domain-concepts.md#message-content)).
- **[NEEDS CLARIFICATION: do patients with a mobile number outside Egypt get reminders, and by which channel? The SMS fallback runs through an Egyptian aggregator registered with the four Egyptian networks (constraints 3 and 18).]**

### Acceptance Criteria

- [ ] Given a patient with a consent record, when the Receptionist adds an appointment for tomorrow at 18:00, then the system saves it as Booked and sets the reminder for today at 18:00.
- [ ] Given a patient with no consent record who does not agree, when the Receptionist saves the appointment, then the system sends no messages and shows the appointment as "No consent".
- [ ] Given a patient aged 9, when the Receptionist enters the guardian's mobile number, then the reminders go to the guardian.
- [ ] Given English as the message language, then the patient's reminders are in English.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-08: Record a patient's consent

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Patient |
| **Goal** | Record the patient's agreement to receive reminders and slot offers, so the clinic messages the patient lawfully. |
| **Trigger** | The Receptionist adds an appointment or a waitlist entry for a patient with no consent record (UC-07, UC-09, UC-12). |

### Why

The PDPL needs written explicit consent for health data, and WhatsApp needs an opt-in ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraints 6 and 12). A consent record per patient lets the clinic show that it messages patients lawfully ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Clinic owner, Pain Relievers). It serves BO-01.

### Preconditions

- The patient, or the guardian of a patient under 15, is in contact with the clinic by phone, by WhatsApp, or at the desk.

### Main Flow

1. The system shows that the patient has no consent record.
2. The Receptionist asks the patient to agree to reminders on WhatsApp and SMS and to slot offers.
3. The patient agrees. **[NEEDS CLARIFICATION: pre-BRD 08 Legal (2): does a WhatsApp opt-in count as the written explicit consent the PDPL requires? How does a patient who books by phone give it?]**
4. The Receptionist records the consent: who agreed and how the agreement was given.
5. The system stores the consent with the date and time and the name of the staff member who recorded it.
6. The system marks the patient as able to receive messages.

### Alternate & Exception Flows

- **A1 - Patient under 15:** At step 3, the guardian agrees. The system records the guardian as the person who consented and as the person who receives the messages (constraint 7).
- **E1 - Patient does not agree:** At step 3, the patient refuses. **[NEEDS CLARIFICATION: proposed: the system records the refusal with the date and time, sends the patient no messages, and keeps the appointment (UC-07 A1); confirm or replace]**

### Business Rules & Constraints

- One agreement covers every message type ([chunk 03 Consent record](./03-definitions-and-domain-concepts.md#consent-record)).
- Consent records are kept for at least three years (constraint 15).
- Each clinic keeps its own consent records ([chunk 03 Consent record](./03-definitions-and-domain-concepts.md#consent-record)).

### Acceptance Criteria

- [ ] Given a new patient who agrees, when the Receptionist records the consent, then the system stores who agreed, how, when, and which staff member recorded it.
- [ ] Given a patient aged 12, when the guardian agrees, then the record names the guardian, and the guardian receives the messages.
- [ ] Given a patient who refuses, then the system sends that patient no messages.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-09: Import appointments from a file

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Add many appointments at once from a CSV file. |
| **Trigger** | The clinic starts using the service, or keeps its appointment book in another tool or spreadsheet. |

### Why

Typing every appointment again is a burden for reception ([pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Receptionist, Thinks). Import is part of clinic onboarding ([pre-BRD 03 Lean Canvas](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), Key Activities). It serves BO-01 and BO-05.

### Preconditions

- The Receptionist has the appointments in a CSV file.

### Main Flow

1. The Receptionist chooses to import appointments.
2. The system shows the columns the file must have. **[NEEDS CLARIFICATION: proposed: the columns are the patient's name, mobile number, whether the patient is under 15, the guardian's name and mobile number, message language, date, time, and, once per-doctor calendars are live, the doctor; confirm or replace]**
3. The Receptionist uploads the file.
4. The system checks every row.
5. The system shows how many rows are ready, which rows have errors, and which patients have no consent record.
6. The Receptionist confirms the import.
7. The system adds the ready rows as Booked appointments and sets their reminder times.
8. The system lists the patients without a consent record, so the Receptionist can record consent (UC-08).

### Alternate & Exception Flows

- **E1 - File cannot be read:** At step 4, the file is not a CSV file or lacks a required column. The system rejects the file and names the missing columns.
- **E2 - Rows with errors:** At step 5, some rows have errors, such as a missing mobile number or a past date. The system skips those rows and lists each one with its reason.
- **E3 - Appointment already in the system:** At step 5, a row matches an existing appointment. The system skips it and lists it.

**[NEEDS CLARIFICATION: proposed: E1, E2, and E3 work as written above; confirm or replace]**

### Business Rules & Constraints

- Imported patients without a consent record get no messages until consent is recorded ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 12). Older patient lists may lack consent ([pre-BRD 06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md), consent and opt-out ledger row).

### Acceptance Criteria

- [ ] Given a file with 50 valid rows, when the Receptionist confirms the import, then the system adds 50 Booked appointments with reminder times.
- [ ] Given a file where 3 rows have no mobile number, then the system skips those 3 rows and lists them with the reason.
- [ ] Given imported patients without consent, then they get no messages until the Receptionist records consent.
- [ ] Given a file without a required column, when the Receptionist uploads it, then the system rejects the file and names the missing column.
- [ ] Given a row that matches an existing appointment, then the system skips the row and lists it.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-10: Check the day's appointment statuses

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | See who confirmed, who cancelled, and who did not reply, and call only the patients on the call list. |
| **Trigger** | The Receptionist starts the working day, or wants an update during the day. |

### Why

Today reception calls every patient the day before, and half do not answer ([pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Receptionist). A morning view of who confirmed, cancelled, or did not reply cuts the calls to a short list ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Receptionist). It serves BO-07 and BO-08.

### Preconditions

- The day has appointments.

### Main Flow

1. The Receptionist opens the day view.
2. The system shows the day's appointments with their statuses ([chunk 03 Appointment statuses](./03-definitions-and-domain-concepts.md#appointment-statuses)).
3. For each appointment, the system shows each message sent, its channel (WhatsApp or SMS), and whether it was delivered and answered.
4. The Receptionist opens the call list: the patients who did not reply.
5. The system shows the call list with each patient's mobile number.
6. The Receptionist calls a patient on the list.
7. The Receptionist records the patient's answer: a confirmation, or a cancellation as UC-11 describes. **[NEEDS CLARIFICATION: proposed: the Receptionist records answers given by phone in the day view; confirm or replace]**
8. The system updates the status.

### Alternate & Exception Flows

- **A1 - Another day or one doctor:** At step 1, the Receptionist picks another date, or one doctor's calendar once per-doctor calendars are live.
- **A2 - Patient not reached:** At step 4, appointments with the status Not reached also appear on the call list ([chunk 03 Appointment statuses](./03-definitions-and-domain-concepts.md#appointment-statuses)).
- **A3 - Patients the system cannot remind:** At step 4, the call list also shows the day's appointments that got no reminder, with the reason: No consent, Opted out, or Booked too late (only if the UC-07 E1 question is answered "send none"). **[NEEDS CLARIFICATION: proposed: as written; confirm or replace]**

### Business Rules & Constraints

- Patient answers update the status as they arrive ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Proposed Solution).
- The message channel and the delivery and reply status per message (step 3) are a Should-have item ([chunk 04](./04-scope-and-personas.md#in-scope), item 12).

### Acceptance Criteria

- [ ] Given 20 appointments today with 12 confirmed, 2 cancelled, and 6 with no reply, when the Receptionist opens the day view, then it shows each appointment with its status.
- [ ] Given the Receptionist opens the call list, then it shows the 6 patients without an answer, with their mobile numbers.
- [ ] Given the Receptionist records a phone cancellation, then the status becomes Cancelled and the freed slot is handled as UC-11 describes.
- [ ] Given a reminder that went by SMS, then the day view shows the SMS channel and its delivery status.
- [ ] Given an appointment today for a patient with no consent record, when the Receptionist opens the call list, then the appointment shows with the reason No consent.
- [ ] Given the Receptionist picks another date, then the day view shows that date's appointments.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-11: Cancel an appointment for a patient

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Cancel an appointment when the patient asks by phone or at the desk, and free the slot. |
| **Trigger** | A patient tells the clinic that they cannot come. |

### Why

Handling cancellations is part of the Receptionist's daily work, and today freed slots stay empty ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Receptionist). Freeing the slot early lets the waitlist refill it. It serves BO-09.

### Preconditions

- The appointment is Booked, Awaiting reply, Confirmed, or Not reached.

### Main Flow

1. The Receptionist finds the appointment.
2. The system shows the appointment details.
3. The Receptionist chooses to cancel it.
4. The system asks the Receptionist to confirm the cancellation (proposed in [chunk 11](./11-summary-and-uiux.md#uiux-expectations)).
5. The Receptionist confirms.
6. The system sets the status to Cancelled.
7. The system stops any reminder for this appointment that is not sent yet.
8. The system offers the freed slot to the waitlist (UC-16).

### Alternate & Exception Flows

- **A1 - No waitlisted patient matches:** At step 8, no one on the waitlist matches the slot. The slot stays free, and the day view shows it as Free slot ([chunk 03 Day view labels](./03-definitions-and-domain-concepts.md#appointment-statuses)).

### Business Rules & Constraints

- A cancellation sends the freed slot to the waitlist ([chunk 03 Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers)).
- A cancelled appointment gets no more reminders.

### Acceptance Criteria

- [ ] Given a confirmed appointment tomorrow at 11:00, when the Receptionist cancels it, then the status becomes Cancelled and no reminder goes out for it.
- [ ] Given a matching patient on the waitlist, when the Receptionist cancels an appointment, then the system offers the slot to the waitlist.
- [ ] Given no waitlisted patient matches the slot, when the Receptionist cancels the appointment, then the day view shows the slot as Free slot.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-12: Add a patient to the waitlist

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Put a patient who wants an earlier slot on the clinic's waitlist. |
| **Trigger** | A patient asks for an earlier slot. |

### Why

Today the waiting list sits on paper or in a personal phone. Waiting patients cannot be reached in time ([pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Receptionist; [pre-BRD 03 Lean Canvas](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), Problem). It serves BO-09.

### Preconditions

- None.

### Main Flow

1. The Receptionist opens the waitlist.
2. The system shows the waitlist in order.
3. The Receptionist adds the patient, with the doctor once per-doctor calendars are live, and the message language for a patient who has none yet.
4. The system checks the patient's consent record.
5. The system adds the patient to the waitlist ([chunk 03 Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers)).
6. The system shows the patient's place on the waitlist.

### Alternate & Exception Flows

- **A1 - Patient no longer wants an earlier slot:** The Receptionist removes the patient from the waitlist. **[NEEDS CLARIFICATION: proposed: the Receptionist can remove a patient from the waitlist at the patient's request; confirm or replace]**
- **E1 - No consent record:** At step 4, the patient has no consent record. The system asks for consent first (UC-08). Without consent, the patient cannot join the waitlist ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 12).

### Business Rules & Constraints

- Slot offers go only to patients who asked to join the waitlist (constraint 17).

### Acceptance Criteria

- [ ] Given a patient with consent, when the Receptionist adds the patient to the waitlist, then the system shows the patient's place on the waitlist.
- [ ] Given a patient without consent, when the Receptionist tries to add the patient, then the system asks for consent first and does not add the patient without it.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-13: Record whether the patient came

| | |
|---|---|
| **Primary Actor** | Receptionist **[NEEDS CLARIFICATION: proposed use case: the weekly no-show report (UC-03) needs the outcome of each appointment, and no pre-BRD chunk says who records it; proposed: the Receptionist records Attended or No-show after each visit; confirm or replace]** |
| **Supporting Actors** | None |
| **Goal** | Record whether each patient came, so the no-show count is right. |
| **Trigger** | The time of an appointment has passed. |

### Why

The weekly no-show report needs to know which patients did not come ([pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md), Must (8)). It serves BO-07 and BO-13.

### Preconditions

- The appointment time has passed, and the appointment was not cancelled.

### Main Flow

1. The Receptionist opens the day view after the visits.
2. The system lists the appointments whose time has passed and that have no outcome yet.
3. The Receptionist marks each one as Attended or No-show.
4. The system saves the outcome.
5. The system counts the outcome in the weekly no-show report (UC-03).

### Alternate & Exception Flows

- **A1 - Outcome marked by mistake:** After step 4, the Receptionist changes the outcome. **[NEEDS CLARIFICATION: proposed: the Receptionist can change an outcome until the weekly report for that week is sent; confirm or replace]**
- **E1 - Outcome never recorded:** The weekly report handles it as UC-03 E1 describes.

### Business Rules & Constraints

- A no-show is an appointment that was not cancelled, and the patient did not come ([chunk 02 Glossary](./02-glossary-assumptions-facts.md#glossary)).

### Acceptance Criteria

- [ ] Given a 10:00 appointment that was not cancelled, when the Receptionist marks it No-show at 13:00, then the weekly report counts one no-show.
- [ ] Given an appointment marked Attended, then the weekly report does not count it as a no-show.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06a-use-cases-clinic-owner.md | NEXT: 06c-use-cases-patient.md -->
