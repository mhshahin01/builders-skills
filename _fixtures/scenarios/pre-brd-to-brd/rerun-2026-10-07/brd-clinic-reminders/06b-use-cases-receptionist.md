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

## UC-04: Record patient consent

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Patient |
| **Goal** | Record whether the patient agrees to receive clinic messages. |
| **Trigger** | Reception books or imports an appointment. |

### Why

The source requires consent records so clinics can show why a patient may receive messages. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. The Receptionist obtains the patient contact and consent information.
2. The system provides the per-patient consent record.
3. The Patient, or guardian for a child, supplies the consent.
4. The Receptionist records the consent source and time.
5. The system keeps the per-patient record used by message eligibility.

### Alternate & Exception Flows

- A1 - Child patient: a guardian supplies consent as stated in the source; legal applicability stays open in 02.
- E1 - Imported contact lacks valid consent: **[NEEDS CLARIFICATION: Egyptian counsel and founders to define the treatment of absent, disputed or insufficient consent, including legacy imports and guardian evidence; pre-BRD 08 Legal.]**

### Business Rules & Constraints

- Legal obligations and open applicability questions have one home in 02.

### Acceptance Criteria

- [ ] Given patient or guardian consent, when reception records it, then the per-patient record retains its source and time.
- [ ] Given a child patient, when consent is captured, then the record identifies guardian consent; the evidence needed is pending counsel.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-04 in [14](./14-todo.md).

---

## UC-05: Maintain clinic appointments

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | Keep the clinic appointment list available for reminders and status tracking. |
| **Trigger** | Reception enters or imports a booking. |

### Why

Appointment records let reception avoid repeatedly typing the same schedule into reminder messages. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 13](../../run/pre-brd-clinic-reminders/13-rice-framework.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. The Receptionist enters an appointment.
2. The system records it on the clinic schedule.
3. The Receptionist opens the appointment list.
4. The system shows the appointment statuses.
5. The Receptionist views the per-doctor calendar in the Should phase.
6. The system shows that doctor's appointments within the clinic.

### Alternate & Exception Flows

- A1 - Import: reception imports an appointment list instead of entering each booking; format mandate is parked in 12.
- E1 - Invalid or overlapping input: **[NEEDS CLARIFICATION: Founders and clinic owners to specify required fields, duplicate/import errors, overlapping bookings, edits and cancellation by staff; pre-BRD 01 and 14 do not define these outcomes.]**

### Business Rules & Constraints

- Clinic-management software integration and online self-booking are outside current scope.

### Acceptance Criteria

- [ ] Given an entered appointment, when reception opens the schedule, then its recorded status is shown.
- [ ] Given an imported appointment list, when import succeeds, then its appointments are available for the same reminder journey.
- [ ] Given the Should per-doctor calendar, when reception views a doctor, then that doctor's schedule is shown.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-05 in [14](./14-todo.md).

---

## UC-06: Run and inspect appointment reminders

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Patient; External: Meta; External: SMS Aggregator |
| **Goal** | Reach patients before visits and see their responses. |
| **Trigger** | An entered appointment reaches its reminder time. |

### Why

Automatic reminders reduce unanswered manual calls, while fallback reaches patients missed by WhatsApp. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. An appointment reaches its scheduled reminder time.
2. The system sends the approved Arabic or English WhatsApp reminder.
3. The Patient can respond through UC-09.
4. The Receptionist opens the message status view in the Should phase.
5. The system shows delivery and reply status per message.

### Alternate & Exception Flows

- A1 - WhatsApp not delivered: the system sends an SMS with a confirm or cancel link. **[NEEDS CLARIFICATION: Founders to set the non-delivery waiting period and treatment of a late WhatsApp delivery; pre-BRD 01 and 14.]**
- A2 - Visit-day reminder: the Should scope includes a second reminder on the visit day. **[NEEDS CLARIFICATION: Founders and clinic owners to set visit-day timing and eligibility after a reply; pre-BRD 14.]**
- E1 - SMS also fails: **[NEEDS CLARIFICATION: Founders and clinic owners to define what reception and the patient see when both channels fail; pre-BRD 01 and 14.]**

### Business Rules & Constraints

- Default reminder timing is 24 hours before the visit (pre-BRD 01); timing is configurable in the Should scope. **[NEEDS CLARIFICATION: Founders and clinic owners to identify who changes timing and the allowed values; pre-BRD 14.]**
- Consent and opt-out follow UC-04 and UC-11.

### Acceptance Criteria

- [ ] Given an eligible booked visit, when the default reminder time arrives, then an approved message is sent 24 hours before the visit.
- [ ] Given WhatsApp non-delivery under the pending waiting rule, when fallback runs, then the SMS carries the response link.
- [ ] Given Should message-status access, when reception inspects a message, then delivery and reply status are visible.
- [ ] Given the Should visit-day reminder and approved timing, when it is due, then the second reminder is sent.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-06 in [14](./14-todo.md).

---

## UC-07: Maintain the waitlist

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | Persona: Patient; External: Meta |
| **Goal** | Make cancelled slots available to waiting patients. |
| **Trigger** | Reception maintains patients waiting for an earlier visit. |

### Why

An ordered waitlist helps reception refill cancellations without repeated calls. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. The Receptionist records a patient on the clinic waitlist.
2. The system keeps the patient on the waiting list.
3. A booked appointment is cancelled through UC-09.
4. The system offers that slot to waitlisted patients in order.
5. Patients respond through UC-10.

### Alternate & Exception Flows

- E1 - No eligible patient or no acceptance: **[NEEDS CLARIFICATION: Founders and clinic owners to define waitlist eligibility, ordering, offer expiry, no-response progression and what happens when no patient takes the slot; pre-BRD 01 and 14.]**

### Business Rules & Constraints

- First acceptance takes the slot under UC-10. **[NEEDS CLARIFICATION: Founders to confirm automatic versus manual-assist waitlist behaviour; pre-BRD 24 OI-11 and OI-12 remain Open against pre-BRD 14.]**

### Acceptance Criteria

- [ ] Given a cancelled appointment and eligible waiting patients, when offers are sent, then they follow the agreed waitlist order. The order and expiry remain unresolved.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-07 in [14](./14-todo.md).

---

## UC-08: Review the day's appointment status

| | |
|---|---|
| **Primary Actor** | Receptionist |
| **Supporting Actors** | None |
| **Goal** | See who confirmed, cancelled or has not replied. |
| **Trigger** | Reception prepares the day's appointment list. |

### Why

The source asks for a morning view so reception can focus calls on patients who have not replied. Source: [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 13](../../run/pre-brd-clinic-reminders/13-rice-framework.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. The Receptionist opens the day's appointment list.
2. The system shows confirmed, cancelled and no-reply appointments.
3. The Receptionist checks which patients still need contact.
4. The Receptionist can use that list for the reminder calls described in the source.

### Alternate & Exception Flows

- E1 - A status is disputed or outdated: **[NEEDS CLARIFICATION: Founders and clinic owners to specify status correction and actual-attendance capture used by the weekly no-show report; pre-BRD 04, 13 and 14.]**

### Business Rules & Constraints

- A patient reply records intent; the no-show result needs actual attendance evidence under 09.

### Acceptance Criteria

- [ ] Given replies have been recorded, when reception opens the day's list, then confirmed, cancelled and no-reply appointments are distinguished.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-08 in [14](./14-todo.md).

## Upstream questions

- **[NEEDS CLARIFICATION: Founders and clinic owners to validate timed-slot admission and waitlist suitability; pre-BRD 24 OI-03 remains Open.]** Source: [pre-BRD OI-03](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-03-the-problem-and-the-waitlist-assume-timed-slots-but-many-target-clinics-may-admit-patients-in-arrival-order).
- **[NEEDS CLARIFICATION: Egyptian counsel and founders to settle licence grant timing and per-clinic licensing; pre-BRD 24 OI-05 remains Open.]** Source: [pre-BRD OI-05](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-05-the-pdpc-licence-gates-the-pilot-with-about-a-month-of-slack-and-per-clinic-licensing-is-unresolved).
- **[NEEDS CLARIFICATION: Founders and clinic owners to decide waitlist demand and automatic versus manual-assist scope; pre-BRD 24 OI-11 remains Open.]** Source: [pre-BRD OI-11](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-11-the-headline-differentiator-is-the-least-evidenced-must-have).
- **[NEEDS CLARIFICATION: Founders to re-estimate scope and build dates; waitlist and report reductions remain unaccepted upstream proposals; pre-BRD 24 OI-12 remains Open.]** Source: [pre-BRD OI-12](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-12-the-mvp-schedule-assumes-all-founder-time-goes-to-coding).
- **[NEEDS CLARIFICATION: Founders to decide the WhatsApp sender identity, onboarding and billing model; pre-BRD 24 OI-15 remains Open.]** Source: [pre-BRD OI-15](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-15-the-whatsapp-sender-model-is-undecided-but-drives-cost-limits-billing-and-trust).


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06a-use-cases-clinic-owner.md | NEXT: 06c-use-cases-patient.md -->
