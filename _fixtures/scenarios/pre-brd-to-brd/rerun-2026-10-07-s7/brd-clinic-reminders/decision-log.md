<!--
TYPE: Decision Log
PROJECT: Clinic Reminders
VERSION: 1.0
PART OF: BRD - Clinic Reminders
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Clinic Reminders

## How to read

The numbered chunks hold the current requirements of the Clinic Reminders BRD. This file holds the decision history behind them: which review item was decided, which option was chosen, who decided, when, and why. Read the chunks for what the product must do; read this file for how the text got there.

## Clarification register

28 open items from [chunk 13](./13-open-items-and-clarifications.md) were decided on 2026-10-07. Of the 24 review items, 18 were accepted and applied (Q-01 to Q-18 below) and 6 were rejected (see Walkthrough and delegation history). The 4 items the consistency check Run 1 raised (OI-25 to OI-28) were accepted and applied (Q-19 to Q-22). The 3 items Run 2 raised (OI-29 to OI-31) and the item the main author raised from the Reviewer Notes (OI-32) were accepted and applied (Q-23 to Q-26). Q-23 supersedes the rule wording of Q-22. Most accepted items add a proposal or a question for the owner, so their open remainder stays in the register of [chunk 14](./14-todo.md).

### Q-01 - Pilot clinics: plan, allowance, and payment (OI-02)

**Question:** What does a pilot clinic pay, does the monthly message allowance apply, and what happens at the paid launch?

**Options considered:** OI-02. A: pilot clinics use the service free, with no allowance limit, until the paid launch - clean pilot results; the company pays pilot message costs. B: pilot clinics get their plan's allowance, and reminders stop at the limit - lower cost; can stop reminders mid-measurement. C: pilot clinics pay from the start, outside the product - early revenue; manual invoices and a harder pilot sale.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers for this request). The Recommended Answer adds a proposal and a question, so nothing is settled yet. Why: the pilot exists to measure BO-07 to BO-09, and no payment path exists before Q2-2027, so a limit could only stop reminders. Open remainder: the proposal and the question about the payment date.

**Rule home:** [Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans)

### Q-02 - VAT on plan prices (OI-03)

**Question:** Do the plan and top-up prices include the 14% VAT?

**Options considered:** OI-03. A: prices exclude VAT; billing adds 14% and shows it on a receipt - keeps the BO-11 arithmetic; the clinic pays 14% above the list price. B: prices include VAT - the clinic pays the list price; net revenue is about 12.3% lower than BO-11 assumes.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). The proposal marker was added under Table 6. Why: BO-11 treats the price as company revenue, which holds only if VAT sits on top. Open remainder: the proposal itself; once the owner decides, UC-05 step 4 and the UC-05 acceptance criteria are restated with VAT, as the Recommended Answer says.

**Rule home:** [Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans)

### Q-03 - Clinic Reminders team access to clinic accounts (OI-04)

**Question:** Can Clinic Reminders team members sign in to a clinic account or see patient data, and who restores a lost owner login?

**Options considered:** OI-04. A: a Support persona with access inside the product - easiest support; widest exposure of patient data. B: no access; help in person or on the support line - keeps NFR-04; support needs the owner present. C: access only when the owner allows it, for a set time - balanced; a new permission flow.

**Decision record, 2026-10-07:** Option B accepted by the user (standing answers). Why: it keeps NFR-04 and the processor role (assumption 27) true without a new persona. Open remainder: the proposal and the owner-login recovery question.

**Rule home:** [Personas / Actors](./04-scope-and-personas.md#personas--actors)

### Q-04 - Status model paths and day-view labels (OI-06)

**Question:** Which status does an appointment booked from a slot offer start with, how is a phone confirmation before any reminder recorded, and what are the day-view labels?

**Options considered:** OI-06. A: add the two paths and define the four labels as display labels next to the status - one complete model. B: make the labels full statuses - one list; mixes patient facts with appointment states.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Table 5, Figure 1 (two new transitions and the Summary line), and a Day view labels paragraph were updated. Why: chunk 03 is the single home for statuses, so the use cases must not create states it does not list. Open remainder: the proposal that a slot-offer booking starts as Confirmed.

**Rule home:** [Appointment statuses](./03-definitions-and-domain-concepts.md#appointment-statuses)

### Q-05 - One mobile number for several patients (OI-07)

**Question:** How does the system handle a mobile number shared by several patients?

**Options considered:** OI-07. A: tell patients apart by name and mobile number; each message names the patient's first name; a STOP stops every patient on that number at this clinic - clear for families. B: one consent record per mobile number - simplest; cannot show whose consent covers which child.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Why: pediatrics is a target specialty, where one guardian number often serves several children. Open remainder: the proposal.

**Rule home:** [Consent record](./03-definitions-and-domain-concepts.md#consent-record)

### Q-06 - Recording that a patient is under 15 (OI-08)

**Question:** How does the system know that a patient is under 15, so it can apply constraint 7?

**Options considered:** OI-08. A: an under-15 mark plus the guardian's name and mobile number - least personal data. B: the patient's date of birth - the system knows the age; stores more personal data.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). The UC-07 step 4 and UC-09 step 2 proposals gained the fields, and a proposal was added to the consent rules. Why: the mark makes constraint 7 checkable with the least data. Open remainder: the proposals, with counsel to confirm.

**Rule home:** [Consent record](./03-definitions-and-domain-concepts.md#consent-record); [UC-07](./06b-use-cases-receptionist.md#uc-07-add-an-appointment)

### Q-07 - When a waitlist entry ends (OI-09)

**Question:** When does a patient leave the waitlist?

**Options considered:** OI-09. A: on acceptance, on request, on opt-out, or when the patient's own booked appointment takes place or is cancelled, with a time limit otherwise - offers stay wanted. B: entries stay until the Receptionist removes them - offers go to patients who no longer want them.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Why: ending stale entries keeps each offer tied to a live request (constraint 17). Open remainder: the proposal and the time-limit question.

**Rule home:** [Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers)

### Q-08 - Patients the system cannot remind (OI-11)

**Question:** Do appointments that get no reminder reach the Receptionist's call list?

**Options considered:** OI-11. A: add them to the call list with the reason - every patient gets a reminder by message or by phone. B: show them only in the full day view - shorter list; relies on the Receptionist spotting them.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). UC-10 A3 and one acceptance criterion were added. Why: calls are meant only for the short list of patients the system could not reach (pre-BRD 04). Open remainder: the proposal.

**Rule home:** [UC-10](./06b-use-cases-receptionist.md#uc-10-check-the-days-appointment-statuses)

### Q-09 - Answers after the appointment changed (OI-14)

**Question:** What happens when a patient taps a button on a reminder for an appointment that already changed, or answers on both channels?

**Options considered:** OI-14. A: a tap on a stale reminder changes nothing and the patient is told; across channels the latest answer before the visit counts, and a Confirm never brings back a cancelled appointment. B: the latest answer always wins - can double-book a refilled slot.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). UC-14 E3 and a channel rule proposal were added. Why: it protects a slot a waitlisted patient took. Open remainder: both proposals.

**Rule home:** [UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder); [Channels](./03-definitions-and-domain-concepts.md#channels)

### Q-10 - Reception told of patient cancellations (OI-15)

**Question:** How does reception learn that a patient cancelled?

**Options considered:** OI-15. A: the day view shows each new patient cancellation as an alert - no new channel. B: also a WhatsApp message to the clinic's phone - needs a template and the staff's agreement. C: status change only - same-day cancellations can go unseen.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). UC-14 A1, UC-15 A1, and the chunk 09 day-view row were updated. Why: it restores the step "reception notified" that pre-BRD 06 states. Open remainder: the alert proposal.

**Rule home:** [UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder); [UC-15](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link)

### Q-11 - SMS cost when WhatsApp cannot send at all (OI-16)

**Question:** Who pays for an SMS sent because WhatsApp cannot send at all?

**Options considered:** OI-16. A: the reminder goes by SMS, and the company pays when the cause is on the service side. B: the clinic pays, as for any fallback. C: hold reminders until WhatsApp works.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Why: the cause is the sender set-up the company chooses, not the clinic. Open remainder: the billing proposal.

**Rule home:** [Channels](./03-definitions-and-domain-concepts.md#channels)

### Q-12 - What the SMS link page shows (OI-17)

**Question:** What does the SMS link page show, and to whom?

**Options considered:** OI-17. A: only what the SMS already says, for this one appointment, until the visit time, with no extra check - keeps the one-tap answer. B: ask for a check, such as the patient's first name - safer; adds a step.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Why: a page that shows only what the SMS says adds no new exposure. Open remainder: the proposal.

**Rule home:** [UC-15](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link)

### Q-13 - Opt-out given by phone or at the desk (OI-18)

**Question:** How does the clinic honour an opt-out the patient gives by phone or at the desk?

**Options considered:** OI-18. A: the Receptionist records the opt-out in the consent record - honours every opt-out; the Receptionist becomes a supporting actor of UC-17. B: tell the patient to reply STOP - fails for patients reached only by SMS.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). UC-17 gained A3, the Receptionist as a supporting actor, and one acceptance criterion; the matrix gained a Receptionist cell for UC-17. The Recommended Answer named that footnote 6; it is footnote 5, the next free number, because OI-12 (which would have added footnote 5) was rejected. Why: constraint 13 has no exception for the channel. Open remainder: the proposal.

**Rule home:** [UC-17](./06c-use-cases-patient.md#uc-17-stop-all-messages); [Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix)

### Q-14 - Weekly report template in the launch plan (OI-19)

**Question:** Which templates must Meta approve before go-live?

**Options considered:** OI-19. A: add the report template to the launch dependency, with its category as an open question - keeps BO-02 as taken from the pre-BRD. B: rewrite BO-02 to list four templates - changes a pre-BRD key result.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). The Meta dependency row lists the four templates, and UC-03 now cites the dependency. Why: one launch list holds every template the first release needs. Open remainder: the question about the report's category and the invitation channel.

**Rule home:** [Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### Q-15 - Weekly report items from pre-BRD 06 (OI-20)

**Question:** Does the weekly report include late cancellations and the estimated fees lost and recovered?

**Options considered:** OI-20. A: keep the three figures and record the two items as a UC-03 future enhancement - matches Must (8). B: add both now - needs a fee per doctor and per-doctor figures that pre-BRD 14 puts in Could have.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Why: pre-BRD 14 names only a weekly no-show report. No open remainder.

**Rule home:** [UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report)

### Q-16 - Breach notice actor and patient requests (OI-22)

**Question:** Who reports a breach and tells the clinics, and which data requests can patients make?

**Options considered:** OI-22. A: name the actors for the breach notice and add the patient-request question to the counsel opinion. B: treat both as company procedures outside the BRD.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Constraint 9 gained a proposal, constraint 29 was added as a question, and the counsel dependency now lists constraints 9 and 29. Why: a duty with no actor cannot be built or tested. Open remainder: the proposal and the question, for counsel.

**Rule home:** [Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)

### Q-17 - Which logs, and from when (OI-23)

**Question:** Which records count as logs, is 180 days a minimum, and when does the three-year consent period start?

**Options considered:** OI-23. A: name the records and the start of each period, with counsel to confirm. B: leave the wording and let the SDD decide.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Constraints 11 and 15 were reworded with a question and a proposal. "Use the same wording in NFR-05" was applied by using the same words in NFR-05 and pointing to the open points in constraints 11 and 15, so each question keeps one home. Why: retention is a legal duty, so the business and counsel name the record and the start date. Open remainder: both markers.

**Rule home:** [Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints); [Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Q-18 - Timeliness and data safety NFRs (OI-24)

**Question:** How fast must answers and freed slots be handled, and how much recent work may a clinic lose after a failure?

**Options considered:** OI-24. A: add both rows, with the measures as questions. B: add timeliness only and leave data safety to the SDD.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). NFR-07 and NFR-08 were added. Why: both qualities decide whether the use cases deliver their value. Open remainder: both measures.

**Rule home:** [Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Q-19 - Reminders for appointments that are not Booked (OI-25, raised by CF-03)

**Question:** Does an appointment that is already Confirmed (by phone, or booked from a slot offer) still get its reminder?

**Options considered:** OI-25. A: remind every appointment that is not cancelled - matches pre-BRD 01 ("before each visit"), chunk 03, and UC-14 A2; more messages. B: send the first reminder to Booked appointments only - fewer messages; contradicts chunk 03, and a patient who confirmed early gets no reminder.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). The UC-14 precondition now reads "The appointment is not cancelled." Why: pre-BRD 01 sends a reminder before each visit, and an early confirmation does not stop a patient from forgetting. No open remainder.

**Rule home:** [UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder)

### Q-20 - Which plans get per-doctor calendars (OI-26, raised by CF-04)

**Question:** Do per-doctor calendars come with every plan or with the Clinic plan only?

**Options considered:** OI-26. A: Clinic plan only - matches pre-BRD 21; a 2-doctor Starter clinic keeps one clinic calendar. B: every clinic from Q2-2027 - simpler; the Clinic plan loses one of its listed features.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). Chunk 03 Staff and doctors and In Scope item 10 were updated. Why: pre-BRD 21 lists per-doctor calendars only in the Clinic plan. No open remainder; the separate question on per-doctor reports stays open in chunk 03.

**Rule home:** [Staff and doctors](./03-definitions-and-domain-concepts.md#staff-and-doctors)

### Q-21 - The language of patient messages (OI-27, raised by CF-08)

**Question:** Is the message language set per patient or per appointment?

**Options considered:** OI-27. A: per patient - one language for every message to that patient. B: per appointment - slot offers and other messages then need their own rule.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). UC-07 BR-3 now points to chunk 03 Message content. Why: two of three homes already said so, and some messages have no appointment. No open remainder.

**Rule home:** [Message content](./03-definitions-and-domain-concepts.md#message-content)

### Q-22 - When a persona counts as a supporting actor (OI-28, raised by CF-18)

**Question:** When is a persona listed as a supporting actor of a use case?

**Options considered:** OI-28. A: only when it takes a Main Flow step of that use case; no cell changes. B: add a footnoted Patient cell to four more rows.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). The rule is now in the chunk 07 Notes. Why: the actor fields already follow it, so no matrix cell changes. No open remainder. Later the same day, Q-23 superseded this rule wording, because UC-17 A3 (Q-13) gives the Receptionist a step outside the Main Flow.

**Rule home:** [Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix)

### Q-23 - The supporting-actor rule and the UC-17 Receptionist (OI-29, raised by CF-19)

**Question:** The Q-22 rule counted only Main Flow steps, but UC-17 A3 makes the Receptionist a supporting actor. Which rule holds?

**Options considered:** OI-29. A: widen the rule to any step, in the Main Flow or an alternate or exception flow - no cell changes; OI-18 stays. B: keep the rule and remove the Receptionist from UC-17 - undoes part of OI-18. C: keep the rule with a named exception for UC-17 A3 - ad hoc.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). This supersedes the rule wording of Q-22. Why: no other flow gains an actor, and the OI-18 opt-out path keeps its permission. No open remainder.

**Rule home:** [Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix)

### Q-24 - Reminders for a Confirmed appointment (OI-30, raised by CF-20)

**Question:** What status does a Confirmed appointment take when a later reminder is not answered or not delivered?

**Options considered:** OI-30. A: stays Confirmed whatever happens; never joins the call list. B: stays Confirmed when delivered and not answered; becomes Not reached and joins the call list when neither channel delivers. C: every delivered reminder sets it back to Awaiting reply.

**Decision record, 2026-10-07:** Option B accepted by the user (standing answers). A proposal was added in chunk 03, Figure 1 gained the path from Confirmed to Not reached, and UC-14 E2 now treats Booked and Confirmed appointments separately. Why: every patient is still reached by message or by phone (OI-11), and no patient confirms twice. Open remainder: the proposal.

**Rule home:** [Appointment statuses](./03-definitions-and-domain-concepts.md#appointment-statuses)

### Q-25 - Where the patient's message language is set (OI-31, raised by CF-21)

**Question:** Where is the patient's message language set, so every message, including slot offers, has one?

**Options considered:** OI-31. A: it belongs to the patient, set when the patient is first added and changeable later. B: asked with each appointment, latest wins. C: waitlisted patients with no appointment get Arabic.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). A proposal replaced the first Message content bullet, and UC-12 step 3 asks for the language of a patient who has none. Why: it completes Q-21 and gives every slot offer a language. Open remainder: the proposal.

**Rule home:** [Message content](./03-definitions-and-domain-concepts.md#message-content)

### Q-26 - Patients with a mobile number outside Egypt (OI-32, raised from the Reviewer Notes)

**Question:** Do patients with a foreign mobile number get reminders, and by which channel?

**Options considered:** OI-32. A: flag it as a question for the owner. B: propose WhatsApp only, with no SMS fallback. C: refuse foreign numbers at entry.

**Decision record, 2026-10-07:** Option A accepted by the user (standing answers). A question was added to the UC-07 Business Rules. Why: the project sources say nothing about foreign numbers, so any rule would be invented. Open remainder: the question, for the owner.

**Rule home:** [UC-07](./06b-use-cases-receptionist.md#uc-07-add-an-appointment)

## Marker register

No inline clarification marker was settled in this build.

## Business review register

No business review has changed this document.

## Walkthrough and delegation history

**Standing answers, 2026-10-07:** For this request the user gave standing answers for the acceptance loop: accept every recommendation and every Recommended Answer, but reject any item that would add business behaviour the pre-BRD does not state, with the reason "out of scope for this release (test-fixture policy)". Questions only a named owner can answer stay as markers for that owner.

**Acceptance loop, 2026-10-07:** OI-01 to OI-24 were presented in six batches of four, each with its Recommended Answer and Why. Each item was checked against the pre-BRD. These six were rejected, each because its Recommended Answer adds behaviour the pre-BRD does not state:

- OI-01: clinics of any specialty can join (the pre-BRD names three target specialties).
- OI-05: each appointment names a doctor from the first release (the pre-BRD places per-doctor calendars in Q2-2027).
- OI-10: new flows to change doctors, change an appointment, and correct patient details.
- OI-12: the Clinic Owner opens the day view (pre-BRD 05 describes the owner's current habit, not a product feature).
- OI-13: a "cancelled by the clinic" flow with a new patient message.
- OI-21: a cross-clinic results report for the founders.

The four scope proposals in chunk 13 Reviewer Notes (close the clinic account, quiet hours, prompt reception to record attendance, cancel a doctor's whole day) were not adopted, for the same reason.

### Action entries

**Whole generation, 2026-10-07:** Chunks 00 to 12 and the master index were written from the Clinic Reminders pre-BRD in one run (whole). A cleared-context reviewer wrote chunk 13 with 24 items. The acceptance loop applied 18 and rejected 6. Chunk 14 follows.

**Consistency check Run 1, 2026-10-07:** A read-only checker found 18 findings (CF-01 to CF-18, listed in chunk 14 step 2). 14 were corrected. CF-03, CF-04, CF-08, and CF-18 needed a choice and became OI-25 to OI-28. The user accepted all four in one batch, and they were applied.

**Consistency check Run 2, 2026-10-07:** A scoped read-only run checked the Run 1 corrections and OI-25 to OI-28. It found 9 findings (CF-19 to CF-27). Six were corrected. CF-19, CF-20, and CF-21 became OI-29 to OI-31. The main author also raised OI-32 from the Foreign mobile numbers note in chunk 13. The user accepted all four in one batch, and they were applied.

**Consistency check Run 3, 2026-10-07:** A scoped read-only run checked the Run 2 corrections, OI-29 to OI-32, and the first write of chunk 14. It found 7 findings (CF-28 to CF-34). They are third-run discoveries, so nothing from them was applied in this request. The user accepted the six corrections and chose Option B for OI-33, which CF-29 raised. All seven wait as Decided - pending application (TD-86 to TD-92 in chunk 14). Their decision records are written when the next request applies them.

## Per-decision ecosystem assessments

None in this build.

<!-- MASTER: clinic-reminders-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
