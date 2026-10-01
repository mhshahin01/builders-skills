<!--
CHUNK: 06c
TITLE: Detailed Use Cases - Patient
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: BRD - Clinic Reminders
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - Patient

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

## UC-13: Confirm or cancel from the WhatsApp reminder

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp (Meta) (08) |
| **Goal** | Tell the clinic with one tap whether I will come. |
| **Trigger** | The reminder time of the patient's appointment arrives (chunk 03, Channel order). |

### Why

Forgetting is a leading cause of no-shows, and cancelling by phone is awkward, so patients skip the visit instead ([pre-BRD 05 Empathy Map](../pre-brd-clinic-reminders/05-empathy-map.md)). A one-tap answer turns a silent no-show into an early cancellation (BO-07, BO-08).

### Preconditions

- The appointment is Booked (UC-07, UC-08).
- The patient has a consent record and has not opted out (UC-09, UC-16).
- The clinic is ready to send reminders (UC-01).

### Main Flow

1. The system sends the WhatsApp reminder from the approved service template, in the patient's language. It names the clinic, the doctor, and the date and time, and has Confirm and Cancel buttons.
2. The patient reads the reminder.
3. The patient taps Confirm.
4. The system marks the appointment Confirmed and updates the day's list (UC-12).
5. The system sends the patient a short confirmation reply.

### Alternate & Exception Flows

- **A1 - Patient cancels:** At step 3 the patient taps Cancel. The system marks the appointment Cancelled, sends a short confirmation reply, alerts the receptionist, and starts slot offers (UC-15).
- **A2 - No reply:** The appointment stays Booked and shows as "no reply yet" on the day's list (UC-12).
- **A3 - WhatsApp reminder not delivered:** At step 1, the system sends the SMS fallback instead (UC-14).
- **A4 - Patient changes the answer:** After confirming, the patient taps Cancel in the same reminder before the visit time. The latest answer counts. **[NEEDS CLARIFICATION: proposed latest-answer rule; confirm or replace]**
- **E1 - Free-text reply:** At step 3, the patient may type a message instead of tapping a button. The system asks the patient to tap Confirm or Cancel. It shows the text to the receptionist on the day's list. **[NEEDS CLARIFICATION: proposed free-text handling; confirm or replace]**
- **E2 - Reply after the visit time:** If the patient answers after the visit time, the system says the time has passed and changes nothing. **[NEEDS CLARIFICATION: proposed late-reply handling; confirm or replace]**

### Business Rules & Constraints

- Reminder content follows chunk 03, Content rules: no diagnosis or medicine in any message.
- A reply applies only to the appointment named in that reminder, even when a family shares one phone. **[NEEDS CLARIFICATION: proposed one-reminder-one-appointment rule; confirm or replace]**
- No reminder goes to a patient who opted out (UC-16).

### Acceptance Criteria

- [ ] Given a Booked appointment for tomorrow at 18:00, when the reminder time arrives, then the patient gets a WhatsApp reminder naming the clinic, the doctor, and 18:00, with Confirm and Cancel buttons.
- [ ] Given the patient taps Confirm, when the reply arrives, then the appointment shows as Confirmed on the day's list and the patient gets a confirmation reply.
- [ ] Given the patient taps Cancel, when the reply arrives, then the appointment shows as Cancelled, the receptionist is alerted, and slot offers start.
- [ ] Given the patient does not answer, when the receptionist opens the day's list, then the appointment shows as "no reply yet".
- [ ] Given the patient types "I may be late", when the reply arrives, then the system asks the patient to tap a button and shows the text to the receptionist.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-14: Confirm or cancel from the SMS link

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: SMS Provider (08) |
| **Goal** | Confirm or cancel the appointment when WhatsApp did not reach me. |
| **Trigger** | The WhatsApp reminder is not delivered (chunk 03, Channel order). |

### Why

Part of the population is offline or does not use WhatsApp, so the SMS fallback is needed to reach them (chunk 02, Fact 3; BO-08). Egypt does not support two-way SMS, so the patient answers through a link (chunk 02, Constraint 9).

### Preconditions

- The appointment is Booked.
- The patient has a consent record and has not opted out (UC-09, UC-16).
- The WhatsApp reminder for this appointment was not delivered.

### Main Flow

1. The system sends one SMS under the registered sender name. It names the clinic and the date and time, and holds a short confirm or cancel link.
2. The patient opens the link.
3. The system shows a page with the clinic, the doctor, the date and time, and Confirm and Cancel buttons.
4. The patient taps Confirm.
5. The system marks the appointment Confirmed, updates the day's list, and shows a thank-you message on the page.

### Alternate & Exception Flows

- **A1 - Patient cancels:** At step 4 the patient taps Cancel. The system marks the appointment Cancelled, confirms it on the page, alerts the receptionist, and starts slot offers (UC-15).
- **E1 - SMS not delivered either:** At step 1, the SMS may not be delivered either. The appointment then stays "no reply yet". The day's list shows that no reminder reached the patient, so the receptionist can call. **[NEEDS CLARIFICATION: proposed not-reached flag; confirm or replace]**
- **E2 - Link opened after the visit time:** At step 3, the page says the time has passed. Nothing changes. **[NEEDS CLARIFICATION: proposed link end time; confirm or replace]**
- **E3 - Appointment already changed:** At step 3, the appointment may have been moved or cancelled after the SMS went out. The page then shows the current status and offers no buttons. **[NEEDS CLARIFICATION: proposed current-status page; confirm or replace]**

### Business Rules & Constraints

- The system never sends the SMS when the WhatsApp reminder was delivered: one reminder reaches the patient once.
- The SMS holds no diagnosis and no medicine-related words (chunk 02, Constraint 9).
- The link opens only the one appointment it was sent for. **[NEEDS CLARIFICATION: proposed one-appointment link; confirm or replace]**

### Acceptance Criteria

- [ ] Given the WhatsApp reminder is not delivered, when the fallback runs, then the patient gets one SMS with the clinic, the date and time, and a link.
- [ ] Given the patient opens the link and taps Confirm, when the page answers, then the appointment shows as Confirmed on the day's list.
- [ ] Given the patient taps Cancel on the page, when it is saved, then the appointment shows as Cancelled and slot offers start.
- [ ] Given the WhatsApp reminder was delivered, when the fallback check runs, then no SMS is sent.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-15: Accept a slot offer

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp (Meta) (08); External: SMS Provider (08), in E1 |
| **Goal** | Get an earlier slot when another patient cancels. |
| **Trigger** | A slot is cancelled (UC-10, UC-13, UC-14) and the waitlist holds matching patients. |

### Why

Freed slots stay empty today because waiting patients cannot be reached in time ([pre-BRD 03 Lean Canvas, Problem](../pre-brd-clinic-reminders/03-lean-canvas.md)). Refilling them recovers paid doctor time (BO-09), and the patient is seen sooner.

### Preconditions

- The patient is on the waitlist (UC-11).
- The patient has a consent record and has not opted out (UC-09, UC-16).

### Main Flow

1. The system sends the slot offer on WhatsApp to the matching waitlisted patients, in waitlist order. The offer names the clinic, the doctor, and the date and time, and has an Accept button.
2. The patient reads the offer.
3. The patient taps Accept.
4. The system books the slot for the patient as Confirmed. **[NEEDS CLARIFICATION: proposed Confirmed status for an accepted offer; confirm or replace]**
5. The system tells the patient the slot is theirs and updates the day's list.
6. The system tells the other patients who got the offer that the slot is filled.

### Alternate & Exception Flows

- **A1 - Another patient accepted first:** At step 3, the system tells the patient the slot is already filled. The patient stays on the waitlist. **[NEEDS CLARIFICATION: proposed stay on the waitlist; confirm or replace]**
- **A2 - Offer runs out:** No one accepts before the offer closes (chunk 03, Waitlist and slot offers). The slot stays free and shows as open on the day's list. **[NEEDS CLARIFICATION: proposed open-slot display; confirm or replace]**
- **E1 - Offer not delivered on WhatsApp:** At step 1, the system sends the offer by SMS with an accept link, as in UC-14. **[NEEDS CLARIFICATION: proposed SMS fallback for offers; confirm or replace]**
- **E2 - Patient already holds a later appointment:** **[NEEDS CLARIFICATION: When a waitlisted patient who holds a later appointment accepts an offer, is the later appointment cancelled automatically?]**

### Business Rules & Constraints

- The first patient to accept takes the slot. One slot goes to one patient only.
- An offer is a service message tied to the patient's own waitlist request and never contains promotion (chunk 03).
- **[NEEDS CLARIFICATION: Are slot offers sent automatically in the MVP, or does the MVP use manual assist for the pilot, where the system proposes the next waitlisted patient and the receptionist sends the offer with one click (pre-BRD OI-11)?]**
- Whether slot offers count as electronic marketing is open (chunk 02, Constraint 6).

### Acceptance Criteria

- [ ] Given a cancelled 18:00 slot with Dr. A and two patients waiting for Dr. A, when the slot frees, then both get the offer on WhatsApp in waitlist order.
- [ ] Given both patients tap Accept, when the first acceptance arrives, then that patient gets the slot and the other is told it is filled.
- [ ] Given no one accepts before the offer closes, when it closes, then the slot shows as open on the day's list.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-16: Stop all messages

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp (Meta) (08) |
| **Goal** | Stop receiving messages from the clinic through Clinic Reminders. |
| **Trigger** | The patient no longer wants messages. |

### Why

Patients dislike unwanted messages, and the law and WhatsApp's rules require every opt-out to be honoured (chunk 02, Constraints 6 and 8). Patients control how the clinic contacts them.

### Preconditions

- The patient has a consent record (UC-09).

### Main Flow

1. The patient replies "STOP", or the Arabic equivalent, to a WhatsApp message from the clinic.
2. The system records the opt-out, with the date and time, on the patient's consent record.
3. The system stops every scheduled reminder and slot offer for the patient.
4. The system sends one last message saying that no more messages will come. **[NEEDS CLARIFICATION: proposed opt-out confirmation message; confirm or replace]**
5. The system shows the patient as opted out on the day's list. **[NEEDS CLARIFICATION: proposed opted-out flag; confirm or replace]**

### Alternate & Exception Flows

- **A1 - Opt-out from the SMS page:** The confirm or cancel page (UC-14) also offers "stop messages". **[NEEDS CLARIFICATION: proposed opt-out on the SMS page; confirm or replace]**
- **A2 - Patient wants messages again:** Messages restart only after the receptionist records a new consent (UC-09). **[NEEDS CLARIFICATION: proposed restart by new consent; confirm or replace]**

### Business Rules & Constraints

- An opt-out stops every message to the patient: WhatsApp reminders, SMS reminders, and slot offers.
- The patient's appointments stay booked after an opt-out. Only the messages stop. **[NEEDS CLARIFICATION: proposed appointments kept; confirm or replace]**
- The opt-out is kept on the consent record as long as NFR-06 requires.

### Acceptance Criteria

- [ ] Given a patient with a reminder scheduled for tomorrow, when the patient replies "STOP", then no reminder goes tomorrow and the consent record shows the opt-out time.
- [ ] Given an opted-out patient on the waitlist, when a matching slot frees, then the patient gets no offer.
- [ ] Given an opted-out patient, when the receptionist records a new consent, then reminders start again for new appointments.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06b-use-cases-receptionist.md | NEXT: 07-users-use-cases-matrix.md -->
