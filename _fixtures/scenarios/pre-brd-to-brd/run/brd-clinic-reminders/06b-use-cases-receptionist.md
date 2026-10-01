<!--
CHUNK: 06b
TITLE: Detailed Use Cases - Receptionist
PROJECT: Clinic Reminders
VERSION: 1.1
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
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram, derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

---

## UC-07: Enter an appointment

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³) |
| **Goal** | Book a patient with a doctor so that the reminder is scheduled. |
| **Trigger** | A patient books by phone, by WhatsApp, or at the desk. |

### Why

Appointments exist only if the receptionist enters or imports them (chunk 02, Constraint 5). Every reminder, reply, and report starts here (BO-01, BO-07).

### Preconditions

- The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02).
- The clinic is set up (UC-01).
- Clinic Reminders holds the PDPC licence (chunk 02, Dependencies).

### Main Flow

1. The receptionist opens a new appointment.
2. The system shows the appointment form.
3. The receptionist enters the patient's name and mobile number, and marks whether the patient is a child under 15. For a child, the number is the guardian's.
4. The system finds the patients who use the number. The receptionist picks one or adds a new patient, and the system shows the patient's consent status.
5. The receptionist picks the doctor, the date and time, and the message language.
6. If the patient has no consent record, the receptionist records it (UC-09).
7. The receptionist saves the appointment.
8. The system books the appointment as Booked, shows it on the day's list, and schedules the reminder for the reminder time.

### Alternate & Exception Flows

- **A1 - Visit is sooner than the reminder time:** At step 8, if the visit is less than 24 hours away, the system sends the reminder at once. **[NEEDS CLARIFICATION: proposed immediate reminder; confirm or replace]**
- **A2 - Patient does not consent:** At step 6, if the patient refuses, the system saves the appointment but sends no message. The day's list marks it "no consent" so the receptionist can call. **[NEEDS CLARIFICATION: proposed no-consent flag; confirm or replace]**
- **A3 - Walk-in visit:** At step 5, the receptionist marks the appointment as a walk-in. The system sends it no message and shows it on the day's list.
- **E1 - Doctor already booked at that time:** At step 7, the doctor may already have an appointment at that time. The system then warns the receptionist and asks for another time. **[NEEDS CLARIFICATION: proposed double-booking warning; confirm or replace]**
- **E2 - Mobile number not valid:** At step 7, if the number is not a valid Egyptian mobile number, the system says so and keeps the form open. **[NEEDS CLARIFICATION: proposed Egyptian numbers only; confirm or replace]**

### Business Rules & Constraints

- No message goes to a patient without a consent record (chunk 02, Constraints 6 and 8).
- Each appointment has one patient, one doctor, and one date and time.
- For a child under 15, messages go to the guardian.

### Acceptance Criteria

- [ ] Given a patient with a consent record, when the receptionist saves an appointment 3 days ahead, then it shows as Booked and its reminder is scheduled 24 hours before the visit.
- [ ] Given a patient who refuses consent, when the appointment is saved, then no message is sent and the day's list marks it "no consent". **[NEEDS CLARIFICATION: proposed no-consent flag; confirm or replace]**
- [ ] Given the doctor already has an appointment at 18:00, when the receptionist books another at 18:00, then the system warns and asks for another time. **[NEEDS CLARIFICATION: proposed double-booking warning; confirm or replace]**
- [ ] Given a visit less than 24 hours away, when the receptionist saves it, then the reminder is sent at once. **[NEEDS CLARIFICATION: proposed immediate reminder; confirm or replace]**
- [ ] Given the receptionist marks an appointment as a walk-in, when it is saved, then no message is sent and the visit shows on the day's list.
- [ ] Given a mobile number that is not a valid Egyptian mobile number, when the receptionist saves, then the system says so and keeps the form open. **[NEEDS CLARIFICATION: proposed Egyptian numbers only; confirm or replace]**

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-08: Import appointments from a file

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³) |
| **Goal** | Load many appointments at once instead of typing them one by one. |
| **Trigger** | The clinic starts with an existing appointment list, or keeps its schedule in a spreadsheet. |

### Why

Many receptionists keep the schedule on paper or in a spreadsheet ([pre-BRD 06 Market Comparison](../pre-brd-clinic-reminders/06-market-comparison.md)). CSV import is an MVP item (chunk 04, item 2) and cuts typing.

### Preconditions

- The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02).
- The clinic is set up (UC-01).
- Clinic Reminders holds the PDPC licence (chunk 02, Dependencies).

### Main Flow

1. The receptionist opens import and downloads the file layout. **[NEEDS CLARIFICATION: proposed downloadable file layout; confirm or replace]**
2. The receptionist chooses the CSV file.
3. The system reads the file and shows a preview: rows ready, rows with errors, and rows with no consent record.
4. The receptionist fixes or removes the rows with errors.
5. The receptionist confirms the import.
6. The system books the ready rows as Booked appointments, schedules their reminders, and shows how many were imported.

### Alternate & Exception Flows

- **A1 - Rows with no consent record:** At step 3, rows whose patient has no consent record are still imported. The system sends them no message until consent is recorded (UC-09).
- **E1 - File cannot be read:** At step 3, if the file does not follow the layout, the system says so and shows the expected layout. **[NEEDS CLARIFICATION: proposed layout check; confirm or replace]**
- **E2 - Appointment already booked:** At step 3, a row that repeats an existing appointment (same patient, doctor, date, and time) is skipped and listed. **[NEEDS CLARIFICATION: proposed duplicate skip; confirm or replace]**

### Business Rules & Constraints

- Imported appointments follow the same rules as entered ones (UC-07).
- A row carries consent only if it has every field of a consent record: who consented (and, for a child, the guardian's name), how, when, the consent wording version, and the staff member who took it. A row missing any field is imported with no consent record (A1).
- A row with a past date is not imported. **[NEEDS CLARIFICATION: proposed past-date rule; confirm or replace]**
- Each row says whether the patient is a child under 15. A row without it is listed with the errors at step 3.

### Acceptance Criteria

- [ ] Given a file of 50 valid rows with consent, when the receptionist confirms the import, then 50 Booked appointments appear and their reminders are scheduled.
- [ ] Given a file with 3 rows that have errors, when the preview shows, then those 3 rows are listed with the reason, and the other rows can still be imported.
- [ ] Given a row with no consent record, when it is imported, then no message is sent for it until consent is recorded.
- [ ] Given a file that does not follow the layout, when the receptionist chooses it, then the system says so and shows the expected layout. **[NEEDS CLARIFICATION: proposed layout check; confirm or replace]**
- [ ] Given a row that repeats an existing appointment, when the preview shows, then the row is skipped and listed. **[NEEDS CLARIFICATION: proposed duplicate skip; confirm or replace]**

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-09: Record a patient's messaging consent

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³) |
| **Goal** | Record that the patient, or the guardian of a child under 15, agreed to receive reminders and slot offers. |
| **Trigger** | A patient with no consent record books (UC-07) or is imported (UC-08), or a patient asks the clinic to stop messages (an opt-out recorded by staff). |

### Why

The law and WhatsApp's rules allow messages only to patients who agreed (chunk 02, Constraints 6 and 8). A consent record per patient lets the clinic show that it messages lawfully (BO-04).

### Preconditions

- The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02).
- The patient is known to the clinic (UC-07 or UC-08).

### Main Flow

1. The receptionist opens the patient's consent record.
2. The system shows the consent status and what consent covers: WhatsApp reminders, SMS reminders, and slot offers.
3. The system shows the consent wording. The receptionist reads it to the patient, or the guardian, and records who consents: the patient, or the guardian for a child under 15.
4. For a child under 15, the receptionist enters the guardian's name and mobile number.
5. The receptionist records how consent was given. **[NEEDS CLARIFICATION: proposed ways: in person, by phone, or by WhatsApp message; confirm or replace]**
6. The receptionist saves.
7. The system stores the consent with the date, the time, the name of the staff member who recorded it, and the version of the consent wording, and allows messages to the patient.

### Alternate & Exception Flows

- **A1 - Patient opts out by phone or at the desk:** At step 3, the receptionist records the opt-out. The system stops messages to the patient's mobile number, as in UC-16 (Business Rules). **[NEEDS CLARIFICATION: proposed opt-out recorded by staff; confirm or replace]**
- **E1 - Guardian details missing:** At step 6, the patient may be under 15 with the guardian's name or number missing. The system then does not save and says what is missing.

### Business Rules & Constraints

- One consent covers WhatsApp reminders, SMS reminders, and slot offers.
- A child under 15 needs the guardian's consent.
- Whether this record counts as written consent is open (chunk 02, Constraint 6).
- Consent records are kept as long as NFR-06 requires.
- **[NEEDS CLARIFICATION: When a child turns 15, does the patient give consent again, and who records it?]**
- **[NEEDS CLARIFICATION: Counsel to supply the consent wording in Arabic and English, and the service terms, including the roles of the clinic and Clinic Reminders (chunk 02, Assumption 4).]**

### Acceptance Criteria

- [ ] Given a patient with no consent record, when the receptionist records consent and saves, then the record shows who consented, how, when, who recorded it, and the version of the consent wording, and reminders are allowed.
- [ ] Given a patient marked as a child under 15, when the receptionist saves consent without guardian details, then the system does not save and says what is missing.
- [ ] Given a patient opts out at the desk, when the receptionist records it, then no further message goes to that patient's mobile number. **[NEEDS CLARIFICATION: proposed opt-out recorded by staff; confirm or replace]**

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-10: Change or cancel an appointment

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³) |
| **Goal** | Keep the schedule right when a patient asks to move or cancel a visit. |
| **Trigger** | A patient asks to move or cancel an appointment, or the clinic must move or cancel it, for example because the doctor is away. |

### Why

Reminders must follow the real schedule. A cancellation recorded early frees the slot for the waitlist (BO-09).

### Preconditions

- The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02).
- The appointment is Booked or Confirmed.

### Main Flow

1. The receptionist finds the appointment on the day's list or by the patient's name.
2. The system shows the appointment and its status.
3. The receptionist changes the date, time, or doctor, or chooses to cancel, and says who asked: the patient or the clinic.
4. For a cancellation, the system asks the receptionist to confirm and names the patient and time.
5. The receptionist confirms.
6. The system saves the change. A moved appointment gets a new reminder for the new time. A cancelled appointment becomes Cancelled, and its reminders stop. Slot offers follow the Business Rules.

### Alternate & Exception Flows

- **A1 - Reminder already sent before the change:** At step 6, if the reminder for the old time went out, the system sends a new reminder for the new time.
- **E1 - New time already taken:** At step 3, if the doctor is already booked at the new time, the system warns and asks for another time. **[NEEDS CLARIFICATION: proposed double-booking warning; confirm or replace]**

### Business Rules & Constraints

- A move or cancellation the patient asked for frees the old slot for the waitlist (UC-15). A move or cancellation the clinic asked for starts no slot offer, and the day's list marks the patient to be called.
- A moved appointment goes back to Booked until the patient confirms again.

### Acceptance Criteria

- [ ] Given a confirmed appointment the patient asked to cancel, when the receptionist cancels it and confirms, then it shows as Cancelled, no reminder goes, and slot offers start.
- [ ] Given an appointment moved from Monday to Wednesday, when it is saved, then its reminder is scheduled for the Wednesday visit.
- [ ] Given the doctor is booked at the new time, when the receptionist saves, then the system warns and asks for another time. **[NEEDS CLARIFICATION: proposed double-booking warning; confirm or replace]**
- [ ] Given the doctor is away, when the receptionist cancels an appointment as asked by the clinic, then no slot offer starts and the day's list marks the patient to be called.
- [ ] Given an appointment whose reminder already went out, when the receptionist moves it, then the patient gets a new reminder for the new time.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-11: Add a patient to the waitlist

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³) |
| **Goal** | Put a patient who wants an earlier slot on the clinic's waitlist. |
| **Trigger** | A patient asks for an earlier slot than the ones that are free. |

### Why

Today the waitlist sits on paper or in a personal phone, so a freed slot cannot be offered in time ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md)). The waitlist feeds slot offers (UC-15) and BO-09.

### Preconditions

- The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02).
- The patient is known to the clinic (UC-07, UC-08).

### Main Flow

1. The receptionist opens the waitlist.
2. The system shows the waitlisted patients in waitlist order.
3. The receptionist adds the patient, the doctor the patient wants to see, and the patient's current appointment with that doctor, if any.
4. The system adds the patient at the end of the waitlist with the date added.
5. When a patient no longer wants an earlier slot, the receptionist removes the patient.
6. The system removes the patient and keeps the order of the others.

### Alternate & Exception Flows

- **E1 - Patient has no consent record:** At step 3, the system does not add the patient and asks the receptionist to record consent first (UC-09).

### Business Rules & Constraints

- Waitlist order is the order in which patients were added.
- A slot offer serves only the patient's own waitlist request (chunk 03, Waitlist and slot offers).
- A patient leaves the waitlist after accepting an offer (UC-15). **[NEEDS CLARIFICATION: proposed removal after acceptance; confirm or replace]**
- A waitlist entry ends when its linked appointment's time passes or the appointment is cancelled. An entry with no linked appointment ends after **[NEEDS CLARIFICATION: how many days on the waitlist?]**. No slot offer goes to an ended entry.

### Acceptance Criteria

- [ ] Given a patient with consent, when the receptionist adds the patient for Dr. A, then the patient appears last on the waitlist with the date added.
- [ ] Given a patient with no consent record, when the receptionist tries to add the patient, then the system refuses and asks for consent first.
- [ ] Given three waitlisted patients, when the receptionist removes the second, then the other two keep their order.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-12: Follow the day's list and mark attendance

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³) |
| **Goal** | Know each morning who is coming, and record who came. |
| **Trigger** | The clinic day starts. |

### Why

The receptionist wants a morning view of who confirmed, who cancelled, and who has not replied. Calls then go only to the short no-reply list ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md)). Attendance marks feed the weekly report (BO-07).

### Preconditions

- The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02).

### Main Flow

1. The receptionist opens the day's list.
2. The system shows the day's appointments in time order, each with its status (Business Rules).
3. The receptionist filters the list to "no reply yet".
4. The system shows those patients with their mobile numbers, so the receptionist can call them.
5. After each visit time, the receptionist marks the appointment Attended or No-show.
6. The system records the mark and counts it in the weekly report.

### Alternate & Exception Flows

- **A1 - A patient replies while the list is open:** At any time, when a patient confirms or cancels, the system updates the list and alerts the receptionist.
- **A2 - One doctor's calendar (paid launch):** At step 2, the receptionist picks a doctor, and the system shows only that doctor's appointments.
- **A3 - Message status (paid launch):** At step 2, the receptionist opens an appointment. The system shows each message sent, its channel, whether it was delivered, and the patient's reply.
- **A4 - Wrong mark:** The receptionist changes an Attended mark to No-show, or the reverse. The system records the change in the staff activity log (UC-05) and uses the new mark from the next weekly report. A report already sent does not change.
- **A5 - Mark several at once:** At step 5, the receptionist selects several appointments and marks them Attended in one action, under the same timing rule as single marks.
- **E1 - Visits left unmarked:** At the start of the next clinic day, the system lists past visits with no attendance mark. It asks the receptionist to mark them. **[NEEDS CLARIFICATION: proposed unmarked-visit prompt; confirm or replace]**

### Business Rules & Constraints

- Only appointments whose time has passed can be marked Attended or No-show. **[NEEDS CLARIFICATION: proposed timing rule; confirm or replace]**
- The owner can do everything the receptionist does on the day's list, including marking attendance (chunk 07, footnote ³).
- Day's list statuses: confirmed, cancelled, no reply yet, walk-in (UC-07, A3), to be called after a change the clinic asked for (UC-10, Business Rules), refilled from the waitlist, attended, and no-show. The flags proposed in UC-07 A2 (no consent), UC-13 E1, UC-14 E1, UC-15 A2, and UC-16 step 5 join this list when they are confirmed.
- **[NEEDS CLARIFICATION: In the pilot, before message status (A3) exists, how does the clinic find out whether one patient's reminder went out?]**
- **[NEEDS CLARIFICATION: For how long after the visit can a mark be changed?]**

### Acceptance Criteria

- [ ] Given 12 appointments today, 8 confirmed, 1 cancelled, and 3 with no reply, when the receptionist filters to "no reply yet", then 3 patients show with their mobile numbers.
- [ ] Given a visit at 17:00, when the receptionist marks it No-show at 17:30, then the weekly report counts one more no-show.
- [ ] Given a patient cancels by WhatsApp, when the list is open, then the appointment shows as Cancelled and the receptionist is alerted.
- [ ] Given a clinic with no receptionist, when the owner marks a visit No-show, then the weekly report counts it.
- [ ] Given the paid launch is live, when the receptionist picks one doctor, then only that doctor's appointments show.
- [ ] Given the paid launch is live, when the receptionist opens an appointment, then each message sent shows its channel, whether it was delivered, and the patient's reply.
- [ ] Given a visit marked Attended by mistake, when the receptionist changes it to No-show, then the change is in the staff activity log and the next weekly report uses the new mark.
- [ ] Given 5 past visits, when the receptionist selects them and marks them Attended in one action, then all 5 show as Attended.
- [ ] Given 2 past visits with no attendance mark, when the next clinic day starts, then the system lists them and asks the receptionist to mark them. **[NEEDS CLARIFICATION: proposed unmarked-visit prompt; confirm or replace]**

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-18: Update or remove a patient's details

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³) |
| **Goal** | Keep a patient's details right, and act on a patient's request to see, correct, or delete their data. |
| **Trigger** | A patient's details change, a reminder reached the wrong person, or a patient asks to see, correct, or delete their data. |

### Why

A wrong mobile number turns every reminder into a disclosure to a stranger, which NFR-05 forbids. The clinic cannot meet a patient's request about their data without a way to find, change, or remove it (chunk 02, Assumption 4).

### Preconditions

- The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02).

### Main Flow

1. The receptionist finds the patient by name or mobile number.
2. The system shows the patient's details, consent status, future appointments, and waitlist entries.
3. The receptionist corrects the name, mobile number, message language, or guardian details.
4. The system saves the change, and every later message uses the new details.

### Alternate & Exception Flows

- **A1 - Copy requested:** The receptionist downloads the patient's details, appointments, and consent record.
- **A2 - Deletion requested:** The system asks for confirmation and names the patient. It then removes the patient's details, future appointments, and waitlist entries, and keeps only what NFR-06 requires.

### Business Rules & Constraints

- **[NEEDS CLARIFICATION: Counsel to confirm which patient requests the clinic must answer under the PDPL, and within what time.]**

### Acceptance Criteria

- [ ] Given a patient's mobile number changes, when the receptionist saves the new number, then every later message goes to the new number.
- [ ] Given a patient asks for a copy, when the receptionist downloads it, then the file holds the patient's details, appointments, and consent record.
- [ ] Given a patient asks for deletion, when the receptionist confirms, then the patient's details, future appointments, and waitlist entries are removed, and only what NFR-06 requires is kept.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06a-use-cases-clinic-owner.md | NEXT: 06c-use-cases-patient.md -->
