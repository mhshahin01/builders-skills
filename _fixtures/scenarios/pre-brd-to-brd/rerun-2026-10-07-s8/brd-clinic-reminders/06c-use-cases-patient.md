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

---

## UC-14: Confirm or cancel from the WhatsApp reminder

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp Business Platform ([08](./08-integrations.md)) |
| **Goal** | Tell the clinic with one tap whether the patient will come. |
| **Trigger** | The reminder time before the visit arrives ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)). |

### Why

Patients forget visits, and cancelling by phone is awkward ([pre-BRD 05 Empathy Map, Patient](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). Reminders with one-reply confirm or cancel are Musts ([pre-BRD 14 MoSCoW, Must (3) and (4)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). This use case serves Business Objectives 1, 2, and 5 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The appointment is Booked or Confirmed (UC-07, UC-08, UC-11 A1, or UC-16).
- The patient has consent and has not opted out (UC-09).

### Main Flow

1. The system sends the patient a WhatsApp reminder in the appointment's message language, with Confirm and Cancel buttons ([03 / Message content](./03-definitions-and-domain-concepts.md#message-content)).
2. WhatsApp delivers the reminder to the patient's phone.
3. The Patient reads the reminder.
4. The Patient taps Confirm.
5. The system sets the appointment to Confirmed.
6. The day view shows the appointment as confirmed (UC-10).

### Alternate & Exception Flows

- **A1 - Patient cancels:** At step 4, the patient taps Cancel. The system sets the appointment to Cancelled, frees the slot, and offers it to the waitlist ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules)).
- **A2 - Patient cancels after confirming:** After step 6, the patient taps Cancel on the same reminder. The rule is in [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle).
- **A3 - Visit-day reminder (paid launch):** On the visit day, the patient gets a second reminder ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)).
- **E1 - WhatsApp not delivered:** At step 2, WhatsApp does not deliver the reminder in time. The system sends the SMS fallback (UC-15).
- **E2 - Typed reply:** At step 4, the patient types a reply instead of tapping a button. The rule is in [03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules).
- **E3 - Reply after the visit time:** At step 4, the patient taps a button after the visit time. The rule is in [03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules).
- **E4 - Opt-out word:** At step 4, the patient replies STOP or its Arabic equivalent. The system follows UC-17.
- **E5 - Shared phone:** One mobile number has several appointments. Each reminder answers only its own appointment ([03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules)).
- **E6 - Appointment already cancelled or moved:** At step 4, reception has already cancelled or moved the appointment (UC-11). The system does not change the appointment. It tells the patient the current status: cancelled, or the new date and time.

### Business Rules & Constraints

- Each reminder goes on one channel: WhatsApp first, and SMS only when WhatsApp is not delivered. Which appointments get a reminder, and when, follows [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules).
- The reminder carries no diagnosis, no health information, and no promotion ([03 / Message content](./03-definitions-and-domain-concepts.md#message-content)).
- A Confirm or Cancel tap updates the appointment status ([03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules)).

### Acceptance Criteria

- [ ] Given a booked appointment with consent, when the reminder time comes, then the patient gets a WhatsApp reminder with Confirm and Cancel buttons.
- [ ] Given a delivered reminder, when the patient taps Confirm, then the appointment shows confirmed in the day view.
- [ ] Given a delivered reminder, when the patient taps Cancel (A1), then the appointment shows cancelled and the slot is offered to the waitlist.
- [ ] Given WhatsApp does not deliver the reminder (E1), when the wait ends, then the patient gets the SMS fallback (UC-15).
- [ ] Given a patient who replies STOP (E4), when the reply arrives, then no further message goes to the patient.
- [ ] Given two appointments on one mobile number (E5), when the patient taps Cancel on one reminder, then only that appointment is cancelled.
- [ ] Given reception cancelled the appointment (E6), when the patient taps Confirm on the old reminder, then the appointment stays Cancelled and the patient is told so.
- [ ] Given a confirmed appointment (A2), when the patient taps Cancel on the same reminder before the visit time, then the appointment shows cancelled.
- [ ] Given the paid launch (A3), when the visit day comes, then the patient gets a second reminder.
- [ ] Given a typed reply (E2), when it arrives, then the appointment status does not change.
- [ ] Given a tap after the visit time (E3), when it arrives, then the status does not change and the patient is told that the visit time has passed.
- [ ] Given reception moved the appointment (E6), when the patient taps Confirm on the old reminder, then the appointment does not change and the patient is told the new date and time.

### Future Enhancements

- None identified at this time. Reschedule by reply is on the [Wishlist](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

The reminder is a WhatsApp message with two buttons. Message layout pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-15: Confirm or cancel through the SMS link

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: SMS aggregator ([08](./08-integrations.md)) |
| **Goal** | Confirm or cancel the visit when WhatsApp did not reach the patient. |
| **Trigger** | The WhatsApp reminder was not delivered in time ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)). |

### Why

Not every patient can be reached on WhatsApp (02 / Fact 4). The SMS fallback is a Must ([pre-BRD 14 MoSCoW, Must (5)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). It serves Business Objective 2 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The WhatsApp reminder was not delivered (UC-14, E1).
- The patient has consent and has not opted out (UC-09).

### Main Flow

1. The system sends the patient an SMS under the registered sender name. The SMS holds the reminder content ([03 / Message content](./03-definitions-and-domain-concepts.md#message-content)) and a short confirm-or-cancel link.
2. The SMS aggregator delivers the SMS.
3. The Patient opens the link.
4. The system shows a page with the reminder content and Confirm and Cancel buttons.
5. The Patient taps Confirm.
6. The system sets the appointment to Confirmed and shows a confirmation on the page.

### Alternate & Exception Flows

- **A1 - Patient cancels:** At step 5, the patient taps Cancel. The system sets the appointment to Cancelled, frees the slot, and offers it to the waitlist ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules)).
- **A2 - Stop all messages from the page:** At step 4, the patient chooses to stop all messages (UC-17, A1).
- **E1 - SMS not delivered:** At step 2, the SMS is not delivered. The day view shows the appointment as not reached ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)).
- **E2 - Link opened after the visit time:** At step 3, the visit time has passed. The page takes no answer ([10 / NFR-13](./10-nfrs.md#non-functional-requirements)). **[NEEDS CLARIFICATION: proposed: the page says that the visit time has passed and shows no buttons; confirm or replace]**
- **E3 - Appointment already answered:** At step 4, the appointment is already confirmed or cancelled, for example by reception. **[NEEDS CLARIFICATION: proposed: the page shows the current status, and a confirmed patient can still cancel; confirm or replace]**

### Business Rules & Constraints

- A patient cannot reply to the SMS. The link is the only way to answer it (02 / Constraint 17).
- The SMS carries no medicine-related content and no health information (02 / Constraints 10 and 18).
- The SMS goes only through the licensed aggregator, under the registered sender name (02 / Constraints 14 and 16).
- The link opens only this patient's appointment and needs no sign-in ([10 / NFR-10 and NFR-13](./10-nfrs.md#non-functional-requirements)).

### Acceptance Criteria

- [ ] Given WhatsApp did not deliver the reminder, when the wait ends, then the patient gets one SMS with a confirm-or-cancel link.
- [ ] Given the patient opens the link, when the patient taps Confirm, then the appointment shows confirmed in the day view.
- [ ] Given the patient taps Cancel on the page (A1), when the page confirms, then the slot is offered to the waitlist.
- [ ] Given the SMS is not delivered (E1), when the receptionist opens the day view, then the appointment shows as not reached.
- [ ] Given the visit time has passed (E2), when the patient opens the link, then the page says so and shows no buttons.
- [ ] Given an appointment already confirmed or cancelled (E3), when the patient opens the link, then the page shows the current status.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending for the link page - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-16: Accept a waitlist offer

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp Business Platform ([08](./08-integrations.md)) |
| **Goal** | Take an earlier slot that another patient cancelled. |
| **Trigger** | A slot that fits the patient's waitlist entry is cancelled ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules)). |

### Why

Patients want to be seen sooner when a slot opens ([pre-BRD 04 Value Proposition Canvas, Patient](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). Refilling cancelled slots is a Must ([pre-BRD 14 MoSCoW, Must (7)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). It serves Business Objective 3 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The patient is on the waitlist (UC-13), with consent and no opt-out.
- A slot was cancelled (UC-11, UC-14 A1, or UC-15 A1).

### Main Flow

1. The system sends the patient a WhatsApp offer for the freed slot. **[NEEDS CLARIFICATION: proposed: the offer shows the clinic name and the slot's date and time, and has one Accept button; confirm or replace]**
2. The Patient taps Accept before the offer closes.
3. The system checks that the slot is still free.
4. The system books the slot for the patient and tells the patient ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 8).
5. The system tells every other patient who got the offer that the slot is filled.
6. The day view shows the new appointment (UC-10).

### Alternate & Exception Flows

- **A1 - Patient ignores the offer:** At step 2, the patient does not tap Accept. The offer closes at its set time ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 6), and rule 9 applies if nobody accepts.
- **E1 - Slot already taken:** At step 3, another patient accepted first. The system tells the patient that the slot is filled. **[NEEDS CLARIFICATION: proposed: the patient stays on the waitlist in the same place; confirm or replace]**
- **E2 - Offer closed:** At step 2, the patient taps Accept after the offer closed. **[NEEDS CLARIFICATION: proposed: the system tells the patient that the offer has closed, and the patient stays on the waitlist; confirm or replace]**
- **E3 - Offer not delivered:** At step 1, WhatsApp does not deliver the offer. The rule is in [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 10.
- **E4 - Patient already holds a later appointment:** The rule is open in [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 3.

### Business Rules & Constraints

- The first patient to accept takes the slot, and the others are told it is filled ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 7).
- Offers carry no promotion (02 / Constraint 19) and go only to patients who asked to join the waitlist ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 1).

### Acceptance Criteria

- [ ] Given a cancelled slot that fits a waitlisted patient, when the offers go out, then the patient gets a WhatsApp offer with an Accept button.
- [ ] Given two patients got the offer, when the first taps Accept, then the first gets the slot, and the second is told it is filled.
- [ ] Given the patient taps Accept after the offer closed (E2), when the reply arrives, then the system says that the offer has closed.
- [ ] Given nobody accepts (A1), when the offer closes, then the slot follows [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 9.
- [ ] Given the patient accepts, when the receptionist opens the day view, then the new appointment shows in the freed slot.
- [ ] Given another patient accepted first (E1), when the patient taps Accept, then the patient is told that the slot is filled.
- [ ] Given an offer that WhatsApp does not deliver (E3), when the offer closes, then no SMS goes to the patient.

### Future Enhancements

- None identified at this time.

### UI/UX

The offer is a WhatsApp message with one button. Message layout pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-17: Stop all messages

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: WhatsApp Business Platform ([08](./08-integrations.md)) |
| **Goal** | Stop getting any message from the clinic through Clinic Reminders. |
| **Trigger** | The patient no longer wants messages. |

### Why

Patients are sensitive to unwanted messages ([pre-BRD 05 Empathy Map, Patient](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). An opt-out reply stops all messages ([pre-BRD 04 Value Proposition Canvas, Patient](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)), and every opt-out must be honoured (02 / Constraint 9). Opt-out by reply is a Must ([pre-BRD 14 MoSCoW, Must (6)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)).

### Preconditions

- The patient has received at least one message from Clinic Reminders, on WhatsApp or by SMS.

### Main Flow

1. The Patient replies STOP, or its Arabic equivalent, to a WhatsApp message from the clinic.
2. The system records the opt-out and its time in the patient's consent record.
3. The system stops every message to the patient: reminders, SMS, and waitlist offers.
4. The system sends the patient one message that confirms the opt-out. **[NEEDS CLARIFICATION: proposed: the patient gets one last message that confirms the opt-out; confirm or replace]**
5. The day view marks the patient's coming appointments as opted out (UC-10, E2).

### Alternate & Exception Flows

- **A1 - Opt out from the SMS link page:** A patient who gets only SMS cannot reply to it (02 / Constraint 17). **[NEEDS CLARIFICATION: proposed: the SMS link page offers a "stop all messages" choice that works like a STOP reply; confirm or replace]**
- **A2 - Waitlisted patient:** At step 3, the patient is on the waitlist. The system takes the patient off the waitlist ([03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 12).
- **A3 - Patient wants messages again:** Later, the patient agrees to messages again at the clinic. Reception records new consent (UC-09, A2).

### Business Rules & Constraints

- Every opt-out is honoured (02 / Constraint 9).
- The opt-out words are set in [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 6.
- An opt-out stops the messages only. The patient's appointments stay booked.

### Acceptance Criteria

- [ ] Given a patient with consent, when the patient replies STOP, then the consent record shows the opt-out and its time.
- [ ] Given an opted-out patient with a booked appointment, when the reminder time comes, then no WhatsApp reminder and no SMS go to the patient.
- [ ] Given an opted-out patient on the waitlist (A2), when a slot frees up, then the patient gets no offer.
- [ ] Given a patient who opted out, when the receptionist opens the day view, then the patient's appointments show as opted out.
- [ ] Given a patient who gets only SMS (A1), when the patient chooses to stop messages on the link page, then all messages stop.

### Future Enhancements

- None identified at this time.

### UI/UX

Message layout pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06b-use-cases-receptionist.md | NEXT: 07-users-use-cases-matrix.md -->
