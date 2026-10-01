<!--
TYPE: Decision Log
PROJECT: Clinic Reminders
VERSION: 1.1
PART OF: BRD - Clinic Reminders
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Clinic Reminders

## How to read

The numbered chunks hold the current, settled requirements of Clinic Reminders. This file holds why and how they were decided. Read the chunks for what the product must do. Read this file for the decision history behind it.

## Clarification register

Two intake questions (Q-01, Q-02) and the 30 open items of the first review (OI-01 to OI-30) were decided on 2026-09-30. The 14 open items raised by consistency check Run 1 (OI-31 to OI-44), the 3 raised by Run 2 (OI-45 to OI-47), the 1 raised by Run 3 (OI-48), the 3 raised by Run 4 (OI-49 to OI-51), and the 1 raised by Run 5 (OI-52) were decided on 2026-10-01. Every open item was decided by accepting its Recommended Answer. Each entry names the options; the full concern and options are in [chunk 13](./13-open-items-and-clarifications.md).

### Q-01 - Personas

**Question:** Which user types does the BRD use as personas?

**Decision record, 2026-09-30:** The user accepted the three personas proposed from the pre-BRD customer segments ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 05 Empathy Map](../pre-brd-clinic-reminders/05-empathy-map.md)): Clinic Owner, Receptionist, and Patient. A guardian who answers for a child is covered by the Patient persona. No internal Clinic Reminders staff persona was added, because the pre-BRD names no system use by internal staff.

**Decision record, 2026-09-30 (OI-06):** This record corrects the reason given above; the decision itself stands. The pre-BRD does name internal use: onboarding imports and an Arabic WhatsApp support line ([pre-BRD 03 Lean Canvas](../pre-brd-clinic-reminders/03-lean-canvas.md)). The three personas stay, with a new rule: Clinic Reminders staff never see a clinic's patient data, and at onboarding the founder guides while the clinic's own staff enter and import the data.

**Rule home:** [Personas / Actors](./04-scope-and-personas.md#personas--actors); [Users & Use Cases Matrix, Notes](./07-users-use-cases-matrix.md#notes)

### Q-02 - Brand or key color

**Question:** There is no UI/UX constitution. Which brand or key color does the product use?

**Decision record, 2026-09-30:** The user confirmed teal, #0F766E.

**Rule home:** [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### OI-01 - PDPC licence gate

**Question:** Is the PDPC licence needed before the first patient message, or before the first patient record is entered?

**Decision record, 2026-09-30:** Options: A, the first patient record; B, the first patient message. Chosen: A. Rationale: the licence is a condition for handling the data, and data entry comes before the first message. Tradeoff accepted: no clinic can import until the licence is granted.

**Rule home:** [Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### OI-02 - WhatsApp templates in the gate

**Question:** Which templates must WhatsApp approve by 2026-12-15?

**Decision record, 2026-09-30:** Options: A, all four service templates, with a question on the slot-filled notice; B, keep the gate as written. Chosen: A. Rationale: the weekly report is an MVP message and needs an approved template. Tradeoff accepted: one more template to approve.

**Rule home:** [Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### OI-03 - Facts restated in chunk 01

**Question:** Should chunk 01 restate facts that live in chunk 02 and in the pre-BRD?

**Decision record, 2026-09-30:** Options: A, one home per fact; B, fix the facts but keep the verdict word; C, keep every copy. Chosen: A. Rationale: one fact, one home; the competitor claim is still under review in the pre-BRD. Tradeoff accepted: chunk 01 sends readers elsewhere for the evidence.

**Rule home:** [Background and Context](./01-executive-summary-and-context.md#background-and-context--problem-statement)

### OI-04 - Confirmed share

**Question:** Does the confirmed share count messages or appointments?

**Decision record, 2026-09-30:** Options: A, appointments; B, messages. Chosen: A. Rationale: the report measures whether patients keep or free their visits, and the share stays comparable when settings change. Tradeoff accepted: message volumes leave the report.

**Rule home:** [Weekly no-show report measures](./03-definitions-and-domain-concepts.md#weekly-no-show-report-measures)

### OI-05 - One home for appointment statuses

**Question:** Where are the day's list statuses and the accepted-offer status defined?

**Decision record, 2026-09-30:** Options: A, one home each (UC-12 and UC-15); B, keep the lists in step by hand. Chosen: A. Rationale: UC-12 specifies the day's list, and UC-15 still decides the accepted-offer status. Tradeoff accepted: one more link for readers.

**Rule home:** [UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance)

### OI-06 - Clinic Reminders staff and patient data

**Question:** May Clinic Reminders staff see a clinic's patients?

**Decision record, 2026-09-30:** Options: A, never, with founder-guided onboarding; B, a fourth persona for support. Chosen: A. Rationale: owners fear liability and patients ask who sees their details. Tradeoff accepted: slower support, with an open question on checking one patient's reminder in the pilot.

**Rule home:** [Users & Use Cases Matrix, Notes](./07-users-use-cases-matrix.md#notes)

### OI-07 - Owner doing reception work

**Question:** Can the owner do the receptionist's work?

**Decision record, 2026-09-30:** Options: A, yes, for UC-07 to UC-11; B, require a receptionist login before the clinic is ready. Chosen: A. Rationale: the early adopters are owner-doctors who remind patients themselves, and the owner already sees every patient on the day's list. Tradeoff accepted: a blurred line between owner and receptionist duties.

**Rule home:** [Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix)

### OI-08 - Changing or removing a doctor

**Question:** What happens when a doctor's details change or a doctor leaves?

**Decision record, 2026-09-30:** Options: A, edit freely, block removal until future appointments are moved or cancelled; B, allow removal at any time. Chosen: A. Rationale: a removed doctor with live bookings would trigger reminders for visits that cannot happen. Tradeoff accepted: the owner clears the schedule first.

**Rule home:** [UC-01](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic)

### OI-09 - Regaining access

**Question:** How does a user who cannot sign in get back in?

**Decision record, 2026-09-30:** Options: A, self-service through the login's mobile number, plus a resent invitation; B, every reset through support. Chosen: A. Rationale: the owner login is the only route to setup and billing, and the BRD has no support role. Tradeoff accepted: the lost-phone and change-of-owner cases wait for an answer.

**Rule home:** [UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins)

### OI-10 - Definition of a read

**Question:** What counts as the owner reading the weekly report?

**Decision record, 2026-09-30:** Options: A, a WhatsApp read status or a dashboard open; B, a "Seen" button. Chosen: A. Rationale: BO-13 must be testable with signals the BRD already has. Tradeoff accepted: the read rate is a floor.

**Rule home:** [UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report)

### OI-11 - Paid-launch reminder settings

**Question:** How do longer reminder times and the visit-day reminder fit the MVP flows?

**Decision record, 2026-09-30:** Options: A, a rule in UC-04 and wider preconditions in UC-13 and UC-14; B, rewrite UC-07 A1. Chosen: A. Rationale: late entries would otherwise get no reminder, and confirmed patients would miss the visit-day reminder. Tradeoff accepted: MVP use cases point to a paid-launch one.

**Rule home:** [UC-04](./06a-use-cases-clinic-owner.md#uc-04-change-reminder-timing)

### OI-12 - Recording staff actions

**Question:** When does the system start recording staff actions?

**Decision record, 2026-09-30:** Options: A, from the MVP, with the owner's view at the paid launch; B, from the paid launch. Chosen: A. Rationale: the retention law and the consent evidence apply from the first patient record. Tradeoff accepted: a log nobody can view until April 2027.

**Rule home:** [UC-05](./06a-use-cases-clinic-owner.md#uc-05-review-staff-actions)

### OI-13 - Plan limits

**Question:** How does the product apply the plan a clinic pays for?

**Decision record, 2026-09-30:** Options: A, plan rules in the use cases, with questions; B, leave them on the pre-BRD pricing page. Chosen: A. Rationale: billing and UAT need rules to check against. Tradeoff accepted: two business answers before the paid launch.

**Rule home:** [UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription)

### OI-14 - End of a free period

**Question:** How does a free period end and paying start?

**Decision record, 2026-09-30:** Options: A, one free-period rule ending like an overdue payment; B, handle it outside the product. Chosen: A. Rationale: BO-10 depends on pilot clinics and trials turning into paying clinics. Tradeoff accepted: billing work for referral credits.

**Rule home:** [UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription)

### OI-15 - Tax on billing

**Question:** What tax document does each payment produce?

**Decision record, 2026-09-30:** Options: A, a rule plus a question for an accountant; B, treat the receipt as enough. Chosen: A. Rationale: billing starts on a fixed date, and the answer changes what is built. Tradeoff accepted: an open question until an accountant answers.

**Rule home:** [UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription)

### OI-16 - A clinic that leaves

**Question:** What happens when a clinic stops using the service?

**Decision record, 2026-09-30:** Options: A, a new MVP use case (UC-17); B, end the service by hand. Chosen: A. Rationale: the clinic must take its patients' data back, and no message may reach patients of a clinic that left. Tradeoff accepted: one more MVP use case.

**Rule home:** [UC-17](./06a-use-cases-clinic-owner.md#uc-17-end-the-clinics-service)

### OI-17 - Children under 15

**Question:** How does the system know a patient is under 15?

**Decision record, 2026-09-30:** Options: A, a yes or no mark; B, date of birth. Chosen: A. Rationale: the least data about children that enforces the guardian rule. Tradeoff accepted: the change at 15 stays manual.

**Rule home:** [UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-messaging-consent)

### OI-18 - Walk-ins

**Question:** How are walk-in visits handled?

**Decision record, 2026-09-30:** Options: A, a walk-in mark with no message, counted apart; B, never entered. Chosen: A. Rationale: walk-ins would make the no-show drop look larger than reminders made it. Tradeoff accepted: one more field at booking.

**Rule home:** [UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment)

### OI-19 - Service terms and consent wording

**Question:** Where are the clinic's service terms and the patient's consent wording recorded?

**Decision record, 2026-09-30:** Options: A, both in the product, with versions; B, paper agreements. Chosen: A. Rationale: explicit consent and the processor arrangement can be shown only if the exact text is on record. Tradeoff accepted: counsel writes both texts before the first clinic is onboarded.

**Rule home:** [UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-messaging-consent); [UC-01](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic)

### OI-20 - Correcting or removing patient details

**Question:** How are wrong details and patient data requests handled?

**Decision record, 2026-09-30:** Options: A, a new receptionist use case (UC-18); B, cancel and book again, handle requests outside the product. Chosen: A. UC-18 lists the owner as a supporting actor, to match the owner's matrix cell from OI-07. Rationale: a wrong number turns every reminder into a disclosure. Tradeoff accepted: one more MVP use case.

**Rule home:** [UC-18](./06b-use-cases-receptionist.md#uc-18-update-or-remove-a-patients-details)

### OI-21 - Clinic cancellations and moves

**Question:** Which changes start slot offers?

**Decision record, 2026-09-30:** Options: A, the receptionist says who asked, and a patient's move frees the old slot; B, treat every change alike. Chosen: A. Rationale: offers for an absent doctor create bookings that must be cancelled again, and clinic cancellations distort BO-07 and BO-09. Tradeoff accepted: one more choice at step 3.

**Rule home:** [UC-10](./06b-use-cases-receptionist.md#uc-10-change-or-cancel-an-appointment)

### OI-22 - End of a waitlist entry

**Question:** When does a waitlist entry end on its own?

**Decision record, 2026-09-30:** Options: A, link it to the patient's current appointment, with a time limit otherwise; B, keep entries open. Chosen: A. Rationale: an offer after the request lapsed breaks the rule that keeps offers non-promotional. Tradeoff accepted: a patient may need to be added again.

**Rule home:** [UC-11](./06b-use-cases-receptionist.md#uc-11-add-a-patient-to-the-waitlist)

### OI-23 - Correcting marks and bulk marking

**Question:** Can attendance marks be corrected or set several at once?

**Decision record, 2026-09-30:** Options: A, both; B, correction only; C, neither. Chosen: A. Rationale: one bulk action removes most daily taps, and corrections keep BO-07 right. Tradeoff accepted: a wrong bulk mark must be undone one by one.

**Rule home:** [UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance)

### OI-24 - Late taps

**Question:** What does a tap do when the appointment or slot has changed?

**Decision record, 2026-09-30:** Options: A, a tap acts only if it still fits the current state; B, the latest tap wins. Chosen: A. Rationale: no double bookings, and Cancelled stays final. Tradeoff accepted: a patient who cancelled by mistake must call.

**Rule home:** [UC-13](./06c-use-cases-patient.md#uc-13-confirm-or-cancel-from-the-whatsapp-reminder)

### OI-25 - WhatsApp stops for the whole clinic

**Question:** What happens when WhatsApp stops working for a whole clinic after go-live?

**Decision record, 2026-09-30:** Options: A, keep reminding by SMS and warn staff; B, pause all reminders. Chosen: A. Rationale: WhatsApp is the only Critical partner, and the SMS fallback already exists per message. Tradeoff accepted: higher SMS cost during the outage.

**Rule home:** [UC-13](./06c-use-cases-patient.md#uc-13-confirm-or-cancel-from-the-whatsapp-reminder)

### OI-26 - Doctor in the SMS

**Question:** Must the fallback SMS name the doctor?

**Decision record, 2026-09-30:** Options: A, narrow the content rule, the page shows the doctor; B, add the doctor to the SMS. Chosen: A. Rationale: a shorter SMS, and the rule and UC-14 agree. Tradeoff accepted: a patient with two visits that day opens the link to see the doctor.

**Rule home:** [Content rules](./03-definitions-and-domain-concepts.md#content-rules)

### OI-27 - Opt-out from a shared phone

**Question:** What does an opt-out cover when several patients share a number?

**Decision record, 2026-09-30:** Options: A, the whole mobile number for that clinic; B, only the patient answered. Chosen: A. Rationale: the person holding the phone asked to stop. Tradeoff accepted: one STOP silences every patient on the number.

**Rule home:** [UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages)

### OI-28 - Stop button

**Question:** How does a patient stop messages without a typed word slipping through?

**Decision record, 2026-09-30:** Options: A, a Stop messages button plus a named word list; B, typed words only. Chosen: A. Rationale: patients answer better by tapping, and every opt-out must be honoured. Tradeoff accepted: a template change before the December approval.

**Rule home:** [UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages)

### OI-29 - Breach notice to clinics

**Question:** Who is told about a data breach besides the regulator?

**Decision record, 2026-09-30:** Options: A, every affected clinic, with questions on timing and patients; B, the regulator only. Chosen: A. Rationale: the clinic answers to its patients for their data. Tradeoff accepted: a deadline the business must commit to.

**Rule home:** [Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-30 - Screen speed and data safety

**Question:** Do screen speed and acceptable data loss need NFRs?

**Decision record, 2026-09-30:** Options: A, two new NFRs with the numbers left to the business; B, leave both to the SDD. Chosen: A. Rationale: delay and loss tolerance are business decisions the SDD needs. Tradeoff accepted: two more numbers to settle.

**Rule home:** [Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-31 - Owner marking attendance

**Question:** May the owner mark attendance on the day's list (CF-01)?

**Decision record, 2026-10-01:** Options: A, the owner may also mark attendance; B, marks stay with receptionists. Chosen: A. Rationale: OI-07 was accepted for owner-doctors who do the reception work, and attendance marks feed BO-07. Tradeoff accepted: no split of duties on marks.

**Rule home:** [UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance)

### OI-32 - Nine proposals relied on elsewhere

**Question:** Should the nine proposals that other chunks already rely on be confirmed (CF-02)?

**Decision record, 2026-10-01:** Options: A, confirm them and align the text; B, keep them open and qualify the restatements. Chosen: A. Rationale: the BRD already relied on each proposed answer. Tradeoff accepted: nine proposals confirmed together.

**Rule home:** [Appointment lifecycle](./03-definitions-and-domain-concepts.md#lifecycle)

### OI-33 - Dashboard view in UC-03

**Question:** Should UC-03 assume the dashboard view whose MVP scope is open (CF-05)?

**Decision record, 2026-10-01:** Options: A, put the dashboard view in the MVP; B, make E1 and the criterion conditional. Chosen: B. Rationale: the open scope question in step 5 decides whether the view exists. Tradeoff accepted: a WhatsApp-only MVP leaves an undelivered report unseen that week.

**Rule home:** [UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report)

### OI-34 - Channel order in a clinic-wide stop

**Question:** During a clinic-wide WhatsApp stop, is WhatsApp still tried first (CF-06)?

**Decision record, 2026-10-01:** Options: A, skip WhatsApp and send by SMS at the reminder time; B, keep trying WhatsApp first. Chosen: A. Rationale: E4 already said by SMS, and B makes every reminder late by an open wait time. Tradeoff accepted: one exception to the channel order.

**Rule home:** [Reminder](./03-definitions-and-domain-concepts.md#reminder)

### OI-35 - Patient's own view in NFR-05

**Question:** How does NFR-05 treat the patient's view of their own appointment (CF-07)?

**Decision record, 2026-10-01:** Options: A, name the patient's own access; B, narrow NFR-05. Chosen: A. Rationale: chunk 07 footnote 2 already states this access. Tradeoff accepted: a longer NFR-05.

**Rule home:** [Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-36 - Objective tracing

**Question:** Which use cases does each objective list as Served by (CF-08)?

**Decision record, 2026-10-01:** Options: A, every use case whose Why cites it, and UC-04 drops its pilot claim; B, direct contributors only. Chosen: A. Rationale: each Why is the use case's own claim, and only UC-04's was wrong on dates. Tradeoff accepted: longer Served by cells.

**Rule home:** [Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### OI-37 - Meaning of cancelled slot

**Question:** What is a cancelled slot after OI-21 (CF-09)?

**Decision record, 2026-10-01:** Options: A, a slot freed by a patient's cancellation or move; B, keep the entry and add a new term. Chosen: A. Rationale: it matches OI-21 and limits BO-09 to slots the waitlist could fill. Tradeoff accepted: moved slots enter BO-09's base.

**Rule home:** [Glossary](./02-glossary-assumptions-facts.md#glossary)

### OI-38 - Opt-out recorded by staff

**Question:** Is a stop recorded at the desk an opt-out with the per-number scope (CF-10)?

**Decision record, 2026-10-01:** Options: A, an opt-out recorded by staff; B, a separate per-patient withdrawal. Chosen: A. Rationale: one term for one thing, and OI-27 set the per-number scope. Tradeoff accepted: a desk opt-out also stops siblings on that number.

**Rule home:** [UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-messaging-consent)

### OI-39 - Pilot clinics' free period

**Question:** When does a pilot clinic's free period end (CF-12)?

**Decision record, 2026-10-01:** Options: A, a set number of days after 2027-04-01; B, move the pilot notice into the MVP. Chosen: A. Rationale: billing stays in one release. Tradeoff accepted: some free days in April; the number of days stays open.

**Rule home:** [UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription)

### OI-40 - Consent and opt-out log

**Question:** Which use case delivers the consent and opt-out log (CF-15)?

**Decision record, 2026-10-01:** Options: A, a new MVP use case (UC-19); B, extend UC-05 at the paid launch. Chosen: A. Rationale: consent records exist from the first pilot booking, and chunk 03 already promised the export. Tradeoff accepted: one more MVP view.

**Rule home:** [UC-19](./06a-use-cases-clinic-owner.md#uc-19-export-the-consent-and-opt-out-log)

### OI-41 - Joining the waitlist

**Question:** Who can join the waitlist (CF-16)?

**Decision record, 2026-10-01:** Options: A, only patients known to the clinic; B, UC-11 also creates new patients. Chosen: A. Rationale: the smaller change, matching one consent recorded at booking. Tradeoff accepted: a new patient books a free slot first.

**Rule home:** [UC-11](./06b-use-cases-receptionist.md#uc-11-add-a-patient-to-the-waitlist)

### OI-42 - Logged staff actions

**Question:** Which staff actions does the activity log record (CF-17)?

**Decision record, 2026-10-01:** Options: A, extend the proposed list; B, confirm it as written. Chosen: A. Rationale: deleting a patient's data must leave a trail. Tradeoff accepted: more logged actions; the list stays a proposal.

**Rule home:** [UC-05](./06a-use-cases-clinic-owner.md#uc-05-review-staff-actions)

### OI-43 - Visit-day audience

**Question:** Who gets the visit-day reminder (CF-20)?

**Decision record, 2026-10-01:** Options: A, appointments not cancelled and not walk-ins, with consent and no opt-out, confirmed included; B, patients who have not replied. Chosen: A. Rationale: OI-11 included confirmed patients, and NFR-07 allows no message without consent. Tradeoff accepted: more visit-day messages.

**Rule home:** [UC-04](./06a-use-cases-clinic-owner.md#uc-04-change-reminder-timing)

### OI-44 - Criteria for alternate and exception flows

**Question:** Do the thirty flows without a criterion get one (CF-21)?

**Decision record, 2026-10-01:** Options: A, one criterion per flow from its own text; B, leave them to chunk 16. Chosen: A. Rationale: testers and chunk 16 need an expected result for every branch. Tradeoff accepted: about thirty new criteria to review.

**Rule home:** [UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance)

### OI-45 - Opt-out confirmation

**Question:** May one message follow an opt-out (CF-24)?

**Decision record, 2026-10-01:** Options: A, one confirmation of a WhatsApp opt-out as the single exception; B, delete the confirmation. Chosen: A. Rationale: OI-32 confirmed the step and chunk 08 relies on it; the exception is narrow and testable. Tradeoff accepted: one exception in the rule's homes.

**Rule home:** [UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages)

### OI-46 - Doctor filter release

**Question:** Does the MVP day's list filter by doctor (CF-31)?

**Decision record, 2026-10-01:** Options: A, keep the doctor filter in the MVP; B, it comes with per-doctor calendars at the paid launch. Chosen: B. Rationale: the release split comes from the pre-BRD MoSCoW, and the plan question in UC-06 depends on it. Tradeoff accepted: a multi-doctor pilot clinic works from one mixed list.

**Rule home:** [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### OI-47 - Reminders for refilled visits

**Question:** Does an appointment booked from an accepted offer get the regular reminder (CF-32)?

**Decision record, 2026-10-01:** Options: A, acceptance counts as confirmation, no reminder; B, remind it like any visit whose reminder time is ahead. Chosen: B. Rationale: UC-04 already reminds confirmed patients, and B keeps the promise in UC-01 and chunk 03. Tradeoff accepted: one more message per refill.

**Rule home:** [UC-13](./06c-use-cases-patient.md#uc-13-confirm-or-cancel-from-the-whatsapp-reminder)

### OI-48 - Ending the service in a free period

**Question:** When does the service end for a clinic that leaves during a free period (CF-35)?

**Decision record, 2026-10-01:** Options: A, on the date the owner picks, while a paid period runs to its end; B, one rule, the end of the current paid or free period. Chosen: A. Rationale: UC-17's Why and Assumption 4 rule out messages for a clinic that has chosen to leave, and a free period has no payment that must run its course. Tradeoff accepted: early exits can shrink the pilot sample.

**Rule home:** [UC-17](./06a-use-cases-clinic-owner.md#uc-17-end-the-clinics-service)

### OI-49 - No reply after an opt-out

**Question:** Does any message follow an opt-out made in the same message (CF-41)?

**Decision record, 2026-10-01:** Options: A, strict: no reply, and the opt-out closes open offers; B, a reply to the patient's own tap as a second exception. Chosen: A. Rationale: OI-45 chose one narrow exception on purpose, and Constraint 8 and NFR-07 count every message. Tradeoff accepted: no reply to a tap made after stopping.

**Rule home:** [UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages)

### OI-50 - Earlier-slot matching

**Question:** Which slots match a waitlisted patient (CF-42)?

**Decision record, 2026-10-01:** Options: A, the requested doctor and, for a linked entry, earlier than the linked appointment; B, doctor only. Chosen: A. Rationale: the waitlist is for earlier slots, and UC-11 step 3 records the link. Tradeoff accepted: an unlinked entry matches any slot with that doctor; the rule stays a proposal.

**Rule home:** [Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers)

### OI-51 - Complete imported consent

**Question:** What must an imported row hold to carry consent (CF-43)?

**Decision record, 2026-10-01:** Options: A, every field of a consent record, otherwise no consent record; B, imports carry no consent. Chosen: A. Rationale: it keeps one definition of a consent record and the evidence behind BO-04. Tradeoff accepted: only lists collected on the versioned wording arrive with consent.

**Rule home:** [UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file)

### OI-52 - Proposals relied on by OI-49 and OI-51

**Question:** Do the OI-49 and OI-51 decisions confirm the proposals they rely on (CF-49)?

**Decision record, 2026-10-01:** Options: A, treat them as confirmed and remove the markers; B, keep both open and make the rules conditional. Chosen: A. Rationale: the accepted options of OI-49 and OI-51 already state these outcomes, as with OI-32. Tradeoff accepted: two proposals (import without consent in UC-08; appointments kept after an opt-out in UC-16) close without their own walkthrough.

**Rule home:** [UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file); [UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages)

## Walkthrough and delegation history

The user's standing instruction for this run was to accept every Recommended Answer. All 30 items of the first review were accepted on 2026-09-30, and the 22 items raised by the consistency check (Runs 1 to 5) on 2026-10-01. Each was applied as written, in OI order.

### Action entries

**Intake, 2026-09-30:** Invoked as `brd-unifier chunks whole`. Mode: chunks. Generation: whole. Intent: transform (pre-BRD to BRD). Source: `../pre-brd-clinic-reminders/`, approved by the user as it is. No `AGENTS.md`, `AGENT.md`, or `ui-ux-global-constitution.md` was found in the project folder.

**Body and review, 2026-09-30:** Chunks 00 to 12 written (version 1.0). A cleared-context reviewer wrote chunk 13 with 30 open items, OI-01 to OI-30.

**Acceptance loop, 2026-09-30:** OI-01 to OI-30 accepted and applied. New UC-17 and UC-18, new NFR-10 and NFR-11. As a back-fill, chunk 04 In Scope items 1 and 2 now name UC-17 and UC-18. BRD version 1.1.

**Consistency check Run 1, 2026-10-01:** A cleared-context checker returned CF-01 to CF-23. Eight mechanical corrections were applied (CF-03, CF-04, CF-11, CF-13, CF-14, CF-18, CF-19, CF-22). Fourteen business ambiguities became OI-31 to OI-44. CF-23 needed no change.

**Acceptance loop for OI-31 to OI-44, 2026-10-01:** All 14 accepted and applied. New UC-19 and 30 new acceptance criteria. Thirteen proposals were confirmed by OI-31, OI-32, OI-40, and OI-43 and lost their markers. The BRD stays at version 1.1.

**Consistency check Run 2, 2026-10-01:** A cleared-context checker returned CF-24 to CF-32 and confirmed that OI-31 to OI-44 are applied as written. Six mechanical corrections were applied (CF-25 to CF-30). Three business ambiguities became OI-45 to OI-47, accepted and applied. The first reviewer's editorial notes were applied in the same pass: Dashboard and WhatsApp sender added to the Glossary, and three sentences simplified (UC-01 Why, UC-14 Business Rules, NFR-02).

**Consistency check Run 3, 2026-10-01:** A cleared-context checker returned CF-33 to CF-40 and confirmed OI-46 and the editorial changes. Six mechanical corrections were applied (CF-33, CF-34, CF-36 to CF-39); CF-34 and CF-33 completed OI-47 and OI-45. One business ambiguity became OI-48, accepted and applied. CF-40 needed no change.

**Consistency check Run 4, 2026-10-01:** A cleared-context checker confirmed the Run 3 dispositions and returned CF-41 to CF-47. Four mechanical corrections were applied (CF-44 to CF-47); CF-46 left one question, recorded in chunk 14 as TD-71. Three business ambiguities became OI-49 to OI-51, accepted and applied; OI-51 settled the consent-columns proposal in UC-08.

**Consistency check Run 5, 2026-10-01:** A targeted recheck confirmed the Run 4 dispositions and returned CF-48 to CF-52. Four mechanical corrections were applied (CF-48, CF-50, CF-51, CF-52). CF-49 became OI-52, accepted and applied. The Run 5 dispositions are not yet rechecked: Run 6 is due (chunk 14, step 2).

<!-- MASTER: clinic-reminders-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
