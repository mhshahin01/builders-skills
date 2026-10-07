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

## UC-09: Confirm or cancel a visit

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: Meta; External: SMS Aggregator |
| **Goal** | Tell the clinic whether the booked visit will be kept. |
| **Trigger** | A patient receives an appointment reminder. |

### Why

An easy reply exposes cancellations early and avoids a phone call to the clinic. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The appointment exists under UC-05 and its reminder is sent under UC-06. Message eligibility follows UC-04.

### Main Flow

1. The Patient receives the reminder.
2. The reminder offers Confirm and Cancel.
3. The Patient selects Confirm.
4. The system updates the appointment status to confirmed.

### Alternate & Exception Flows

- A1 - Cancel at step 3: the Patient selects Cancel; the system updates the status to cancelled and triggers the waitlist offer journey.
- A2 - SMS fallback: the Patient uses its short confirm or cancel link instead of replying to SMS.
- E1 - Late, repeated or conflicting response: **[NEEDS CLARIFICATION: Founders and clinic owners to define response cut-offs, conflicting replies, changed bookings and a link used by the wrong person; pre-BRD 01 and 14.]**

### Business Rules & Constraints

- Rescheduling by reply is a Could item, not part of this flow.

### Acceptance Criteria

- [ ] Given a valid appointment reminder, when the patient selects Confirm, then its appointment is confirmed.
- [ ] Given the patient selects Cancel, when the reply is processed, then its appointment is cancelled and the waitlist journey is triggered.
- [ ] Given an SMS fallback reminder, when the patient uses its link, then Confirm and Cancel are available without two-way SMS.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-09 in [14](./14-todo.md).

---

## UC-10: Take an offered slot

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: Meta |
| **Goal** | Take an earlier clinic appointment from the waitlist. |
| **Trigger** | A cancelled slot is offered to a waiting patient. |

### Why

An earlier slot helps the waiting patient and recovers appointment capacity for the clinic. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The patient is on the waitlist and receives the cancelled-slot offer under UC-07. Message eligibility follows UC-04.

### Main Flow

1. The Patient receives a slot offer from the clinic waitlist.
2. The Patient accepts the offered slot.
3. The system gives the slot to the first patient who accepts.
4. The accepted slot becomes that patient's appointment.

### Alternate & Exception Flows

- E1 - Offer expired or another patient accepted first: **[NEEDS CLARIFICATION: Founders and clinic owners to define the losing or late patient's outcome and concurrent acceptance treatment; pre-BRD 01 and 14 state first acceptance only.]**

### Business Rules & Constraints

- Offer ordering and expiry belong to UC-07. **[NEEDS CLARIFICATION: Founders and clinic owners to specify whether the patient's existing later booking is retained or cancelled after accepting an earlier slot; pre-BRD 01 and 04.]**

### Acceptance Criteria

- [ ] Given an offered cancelled slot, when the first patient accepts, then that patient receives the slot.
- [ ] Given two patients try to take the same slot, only the first acceptance receives it; the other patient's visible result is unresolved.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-10 in [14](./14-todo.md).

---

## UC-11: Stop patient messages

| | |
|---|---|
| **Primary Actor** | Patient |
| **Supporting Actors** | External: Meta; External: SMS Aggregator |
| **Goal** | Stop receiving clinic messages. |
| **Trigger** | A patient sends an opt-out reply. |

### Why

The source identifies unwanted messages after a visit as a patient pain; opt-out gives the patient control. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The Patient asks to stop messages. An active booking, a waitlist entry or renewed consent is not an opt-out prerequisite. Matching the request to the patient remains the open identity question below.

### Main Flow

1. The Patient sends an opt-out reply.
2. The system records the patient's opt-out.
3. The system stops messages to that patient.

### Alternate & Exception Flows

- E1 - Opt-out cannot be matched to a patient: **[NEEDS CLARIFICATION: Founders and Egyptian counsel to define opt-out identity, shared phones, cross-clinic scope and an SMS recipient's opt-out route; pre-BRD 04 says a reply stops all messages, while pre-BRD 08 says two-way SMS is unavailable.]**

### Business Rules & Constraints

- The source includes STOP or its Arabic equivalent. **[NEEDS CLARIFICATION: Founders and counsel to confirm the accepted Arabic opt-out wording and treatment of pending messages; pre-BRD 06 consent ledger and 08.]**

### Acceptance Criteria

- [ ] Given a matched patient opt-out, when it is recorded, then messages to that patient stop.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-11 in [14](./14-todo.md).

## Upstream questions

- **[NEEDS CLARIFICATION: Founders and clinic owners to validate timed-slot admission and waitlist suitability; pre-BRD 24 OI-03 remains Open.]** Source: [pre-BRD OI-03](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-03-the-problem-and-the-waitlist-assume-timed-slots-but-many-target-clinics-may-admit-patients-in-arrival-order).
- **[NEEDS CLARIFICATION: Egyptian counsel and founders to settle licence grant timing and per-clinic licensing; pre-BRD 24 OI-05 remains Open.]** Source: [pre-BRD OI-05](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-05-the-pdpc-licence-gates-the-pilot-with-about-a-month-of-slack-and-per-clinic-licensing-is-unresolved).
- **[NEEDS CLARIFICATION: Founders and clinic owners to decide waitlist demand and automatic versus manual-assist scope; pre-BRD 24 OI-11 remains Open.]** Source: [pre-BRD OI-11](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-11-the-headline-differentiator-is-the-least-evidenced-must-have).
- **[NEEDS CLARIFICATION: Founders to re-estimate scope and build dates; waitlist and report reductions remain unaccepted upstream proposals; pre-BRD 24 OI-12 remains Open.]** Source: [pre-BRD OI-12](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-12-the-mvp-schedule-assumes-all-founder-time-goes-to-coding).
- **[NEEDS CLARIFICATION: Founders to decide the WhatsApp sender identity, onboarding and billing model; pre-BRD 24 OI-15 remains Open.]** Source: [pre-BRD OI-15](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-15-the-whatsapp-sender-model-is-undecided-but-drives-cost-limits-billing-and-trust).


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 06b-use-cases-receptionist.md | NEXT: 07-users-use-cases-matrix.md -->
