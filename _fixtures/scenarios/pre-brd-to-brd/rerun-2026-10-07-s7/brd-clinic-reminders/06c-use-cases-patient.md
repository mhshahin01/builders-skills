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
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram (or in connected numbered views for a large use case), derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

For a patient under 15, the guardian receives the messages and acts for the patient in every use case below ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 7).

---

## UC-14: Confirm or cancel from the WhatsApp reminder

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp Business Platform (Meta) (08) |
| **Goal** | Confirm or cancel the appointment with one tap, without calling the clinic. |
| **Trigger** | The reminder time of the appointment arrives (the default is in chunk 03 Reminders, Timing). |

### Why

Patients forget appointments. Cancelling by phone is awkward, and the clinic line is often busy ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Patient; [pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Patient). Reminders raise attendance, and one-tap answers turn silent no-shows into early cancellations ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Proposed Solution). It serves BO-07 and BO-08.

### Preconditions

- The patient has a consent record and has not opted out (UC-08).
- The appointment is not cancelled.

### Main Flow

1. The system sends the patient a WhatsApp reminder from the approved template, in the patient's message language.
2. The reminder shows the appointment and two buttons: Confirm and Cancel ([chunk 03 Message content](./03-definitions-and-domain-concepts.md#message-content)).
3. The patient taps Confirm.
4. The system sets the appointment to Confirmed.
5. The system sends the patient a short confirmation message.
6. The day view shows the appointment as Confirmed (UC-10).

### Alternate & Exception Flows

- **A1 - Patient cancels:** At step 3, the patient taps Cancel. The system sets the appointment to Cancelled, sends a short message that the appointment is cancelled, and offers the freed slot to the waitlist (UC-16). The system tells the Receptionist about the cancellation. **[NEEDS CLARIFICATION: proposed: the day view shows each new patient cancellation as an alert until the Receptionist opens it, for today's and tomorrow's appointments only; confirm or replace]**
- **A2 - Visit-day reminder:** If the visit-day reminder is on (UC-04), the system sends a second reminder on the visit day. **[NEEDS CLARIFICATION: proposed: the second reminder has the same Confirm and Cancel buttons and goes only to patients who have not cancelled; confirm or replace]**
- **A3 - Patient types a reply:** At step 3, the patient types a message instead of tapping a button. **[NEEDS CLARIFICATION: proposed: a typed reply does not change the status, except the opt-out words (UC-17); the day view shows the reply so reception can act on it; confirm or replace]**
- **A4 - Patient changes the answer:** After step 5, the patient taps Cancel on the same reminder. **[NEEDS CLARIFICATION: proposed: the patient can cancel after confirming, up to the visit time, and the slot goes to the waitlist; confirm or replace]**
- **E1 - WhatsApp reminder not delivered:** At step 1, WhatsApp does not deliver the reminder. The system sends the reminder by SMS instead (UC-15).
- **E2 - No answer:** The patient does not answer. A Booked appointment becomes Awaiting reply and appears on the call list (UC-10). A Confirmed appointment stays Confirmed (proposed in chunk 03 Appointment statuses).
- **E3 - Reminder no longer valid:** At step 3, the patient taps a button on a reminder for an appointment that is already cancelled, moved, or past its time. The system does not change the appointment. It tells the patient that this appointment is no longer active and gives the clinic's phone number. **[NEEDS CLARIFICATION: proposed: as written; confirm or replace]**

### Business Rules & Constraints

- The first reminder goes at the clinic's reminder time (UC-04). The default is in [chunk 03 Timing](./03-definitions-and-domain-concepts.md#timing).
- Only patients with a consent record and no opt-out get reminders ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraints 12 and 13).
- Messages carry no diagnosis or other health detail (constraint 14).
- Reminder and confirmation templates carry no promotion (constraint 17).

### Acceptance Criteria

- [ ] Given a patient with consent and an appointment tomorrow at 18:00, when the reminder time comes, then the patient gets a WhatsApp reminder with Confirm and Cancel buttons.
- [ ] Given the patient taps Confirm, then the status becomes Confirmed and the patient gets a confirmation message.
- [ ] Given the patient taps Cancel, then the status becomes Cancelled, the patient gets a cancellation message, and the slot goes to the waitlist.
- [ ] Given the patient does not answer, then the appointment shows on the call list.
- [ ] Given WhatsApp does not deliver the reminder, then the system sends the SMS of UC-15.
- [ ] Given any reminder, then its text contains no diagnosis or health detail.
- [ ] Given a cancelled appointment, when the patient taps its reminder, then the status stays the same and the patient gets the clinic's phone number.

### Future Enhancements

- Reschedule by reply: [Wishlist](./12-appendix-and-wishlist.md#wishlist) item 1.

### UI/UX

The reminder is a WhatsApp message from an approved template, not a screen. No wireframe required for this use case.

---

## UC-15: Confirm or cancel through the SMS link

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: SMS aggregator (08) |
| **Goal** | Confirm or cancel when the WhatsApp reminder did not reach the patient. |
| **Trigger** | The WhatsApp reminder is not delivered. **[NEEDS CLARIFICATION: how long does the system wait for the WhatsApp reminder to be delivered before it sends the SMS?]** |

### Why

Part of the population is offline or does not get WhatsApp, so the SMS fallback is mandatory ([pre-BRD 08 PESTLE](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Social (2)). Patients cannot reply to an SMS in Egypt, so the SMS carries a link ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 19). It serves BO-08.

### Preconditions

- The patient has a consent record and has not opted out.
- The WhatsApp reminder for this appointment was not delivered (UC-14 E1).

### Main Flow

1. The system sends the patient an SMS reminder with a short confirm or cancel link.
2. The patient opens the link.
3. The system shows a page with the appointment and two buttons: Confirm and Cancel.
4. The patient taps Confirm.
5. The system sets the appointment to Confirmed.
6. The system shows a confirmation on the page.

### Alternate & Exception Flows

- **A1 - Patient cancels:** At step 4, the patient taps Cancel. The system sets the appointment to Cancelled, shows that it is cancelled, and offers the freed slot to the waitlist (UC-16). The system tells the Receptionist about the cancellation. **[NEEDS CLARIFICATION: proposed: the day view shows each new patient cancellation as an alert until the Receptionist opens it, for today's and tomorrow's appointments only; confirm or replace]**
- **E1 - SMS not delivered:** At step 1, the SMS is not delivered either. The system sets the appointment to Not reached, and it appears on the call list (UC-10 A2). **[NEEDS CLARIFICATION: proposed: the system sets Not reached when neither channel delivers the reminder, and the appointment joins the Receptionist's call list (UC-10, UC-15); confirm or replace]**
- **E2 - Link no longer valid:** At step 2, the visit time has passed, or the appointment was already cancelled. **[NEEDS CLARIFICATION: proposed: the page says the link no longer works and shows the clinic's phone number; confirm or replace]**

### Business Rules & Constraints

- The SMS goes only when the WhatsApp reminder is not delivered ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Proposed Solution).
- SMS goes out through an NTRA-licensed aggregator under a registered sender ID (constraints 3 and 18).
- The SMS and the link page carry no medicine-related content and no health detail (constraints 14 and 20).
- The link opens the page for this one appointment only. The page shows the clinic's name and the date and time, and no other detail about the patient. The link stops working at the visit time (E2). **[NEEDS CLARIFICATION: proposed: as written, with no extra check before Confirm or Cancel; confirm or replace]**

### Acceptance Criteria

- [ ] Given WhatsApp does not deliver the reminder, then the patient gets an SMS with a link.
- [ ] Given the patient opens the link and taps Confirm, then the status becomes Confirmed.
- [ ] Given the patient taps Cancel on the link page, then the status becomes Cancelled and the slot goes to the waitlist.
- [ ] Given neither WhatsApp nor SMS is delivered, then the appointment shows as Not reached on the call list.
- [ ] Given a WhatsApp reminder that is delivered, then the system sends no SMS for that reminder.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending for the link page - see global UI/UX standards in chunk 11.

---

## UC-16: Accept a waitlist slot offer

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp Business Platform (Meta) (08) |
| **Goal** | Take an earlier slot that another patient freed. |
| **Trigger** | An appointment is cancelled (UC-11, UC-14 A1, UC-14 A4 (proposed), UC-15 A1). |

### Why

Today freed slots stay empty because waiting patients cannot be reached in time ([pre-BRD 03 Lean Canvas](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), Problem). Waitlisted patients want an earlier slot ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Patient). Refilling slots recovers paid doctor time. It serves BO-09.

### Preconditions

- The patient is on the clinic's waitlist (UC-12) and has a consent record.

### Main Flow

1. The system finds the waitlisted patients who match the freed slot ([chunk 03 Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers)).
2. The system sends slot offers in waitlist order.
3. The patient gets the offer on WhatsApp, with the date and time of the slot and an Accept button.
4. The patient taps Accept.
5. The system books the slot for the first patient who accepts.
6. The system sends that patient a confirmation and takes the patient off the waitlist.
7. The day view shows the slot as refilled, and the weekly report counts it (UC-03).

### Alternate & Exception Flows

- **A1 - Slot already taken:** At step 5, another patient accepted first. The system tells the later patient that the slot is filled ([pre-BRD 06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md), section 3, Waitlist auto-fill row). **[NEEDS CLARIFICATION: proposed: the later patient stays on the waitlist; confirm or replace]**
- **A2 - Patient already has a later appointment:** At step 5, the patient who accepts already holds a later appointment. **[NEEDS CLARIFICATION: proposed: accepting moves the appointment to the freed slot, and the later slot is offered to the waitlist in turn; confirm or replace]**
- **E1 - No one accepts:** No waitlisted patient accepts while the offer is open. The slot stays free. How long an offer stays open is still open in [chunk 03 Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers).
- **E2 - Offer not delivered:** At step 3, WhatsApp does not deliver the offer. **[NEEDS CLARIFICATION: do slot offers also fall back to SMS with a link when WhatsApp does not deliver them?]**

### Business Rules & Constraints

- The first patient to accept takes the slot ([chunk 03 Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers)).
- Offers go only to waitlisted patients with consent (constraint 12).
- Each offer answers the patient's own waitlist request and carries no promotion ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 17).
- **[NEEDS CLARIFICATION: pre-BRD 08 Legal (2): do waitlist slot offers count as electronic marketing that needs its own licence?]**
- **[NEEDS CLARIFICATION: pre-BRD 24 OI-11 is open: should waitlist refill start as a manual-assist version (the system proposes the next patient and reception sends the offer in one click), with a keep-or-drop test in the pilot?]**

### Acceptance Criteria

- [ ] Given a cancelled 16:00 slot and two matching waitlisted patients, when the first patient taps Accept, then the slot is booked for that patient and the patient gets a confirmation.
- [ ] Given a refilled slot, then the day view shows it as refilled and the weekly report counts it.
- [ ] Given no waitlisted patient accepts while the offer is open, then the slot stays free.
- [ ] Given any slot offer, then it contains no promotion.
- [ ] Given another patient accepted first, when a second patient taps Accept, then the system tells that patient the slot is filled.

### Future Enhancements

- None identified at this time.

### UI/UX

The offer is a WhatsApp message from an approved template, not a screen. No wireframe required for this use case.

---

## UC-17: Stop all messages

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | Persona: Receptionist; External: WhatsApp Business Platform (Meta) (08) |
| **Goal** | Stop all messages from the clinic. |
| **Trigger** | The patient no longer wants messages. |

### Why

Patients are sensitive to unwanted messages ([pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Patient). The law and WhatsApp's rules require every opt-out to be honoured ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 13). It serves BO-01.

### Preconditions

- The patient has received at least one message from the clinic.

### Main Flow

1. The patient replies to a WhatsApp message with an opt-out word. **[NEEDS CLARIFICATION: proposed: the opt-out words are "STOP" and its Arabic equivalent ([pre-BRD 06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md), consent and opt-out ledger row); confirm or replace]**
2. The system records the opt-out in the patient's consent record, with the date and time.
3. The system stops all reminders and slot offers to the patient.
4. The system sends one last message that confirms no more messages will come. **[NEEDS CLARIFICATION: proposed: the system sends this one confirmation message after an opt-out; confirm or replace]**
5. The day view shows the patient as Opted out.

### Alternate & Exception Flows

- **A1 - Patient reached only by SMS:** The patient cannot reply to an SMS (constraint 19). **[NEEDS CLARIFICATION: proposed: the SMS link page also offers a Stop messages button; confirm or replace]**
- **A2 - Patient wants messages again:** The Receptionist records new consent (UC-08). **[NEEDS CLARIFICATION: proposed: a new consent record restarts messages after an opt-out; confirm or replace]**
- **A3 - Patient asks the clinic to stop messages:** The patient asks by phone or at the desk. The Receptionist records the opt-out in the patient's consent record. The system records the date, the time, and the staff member, and continues at step 3. **[NEEDS CLARIFICATION: proposed: as written; confirm or replace]**

### Business Rules & Constraints

- An opt-out stops all messages to the patient ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Patient, Pain Relievers). **[NEEDS CLARIFICATION: proposed: an opt-out applies to the clinic whose message the patient answered, since each clinic keeps its own consent records; confirm or replace]**
- The opt-out stays in the consent record (constraint 15).

### Acceptance Criteria

- [ ] Given a patient replies with an opt-out word (step 1), then the system records the opt-out with the date and time and sends no more reminders or slot offers.
- [ ] Given an opted-out patient with an appointment tomorrow, when the reminder time comes, then the system sends nothing.
- [ ] Given an opted-out patient, then the day view shows the patient as Opted out.
- [ ] Given a patient asks at the desk to stop messages, when the Receptionist records the opt-out, then the system sends that patient no more reminders or slot offers.

### Future Enhancements

- None identified at this time.

### UI/UX

The opt-out is a WhatsApp reply, not a screen. No wireframe required for this use case.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06b-use-cases-receptionist.md | NEXT: 07-users-use-cases-matrix.md -->
