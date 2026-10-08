<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Clinic Owner
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: BRD - Clinic Reminders
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - Clinic Owner

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

## UC-01: Set up the clinic account

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | None |
| **Goal** | Get the clinic ready to remind its patients. |
| **Trigger** | The clinic joins Clinic Reminders, for the pilot or as a paying clinic. |

### Why

Nothing can be sent until the clinic account exists. Owner and receptionist logins are a Must ([pre-BRD 14 MoSCoW, Must (1)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). The owner's opt-in and the doctors' fees feed the weekly report, which serves Business Objective 4 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- A founder has arranged the in-person onboarding visit with the owner ([pre-BRD 03 Lean Canvas, Customer Relationships](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)).

### Main Flow

1. The Clinic Owner opens the clinic setup. **[NEEDS CLARIFICATION: proposed: a founder starts the clinic account at the onboarding visit, and the owner completes the setup; confirm or replace]**
2. The system asks for the clinic name, the governorate (Cairo or Giza), and the owner's name and WhatsApp number. **[NEEDS CLARIFICATION: proposed: these are the clinic details asked at setup; confirm or replace]**
3. The Clinic Owner enters the details.
4. The system asks whether the owner agrees to get the weekly no-show report on WhatsApp.
5. The Clinic Owner agrees.
6. The system asks for each doctor's name and fee per visit, in EGP.
7. The Clinic Owner adds each doctor with the fee.
8. The system offers to add receptionist logins.
9. The Clinic Owner adds the receptionists (UC-02).
10. The system shows that the clinic account is ready and opens the dashboard.

### Alternate & Exception Flows

- **A1 - Owner does not opt in to the report:** At step 5, the owner declines. The system finishes the setup and sends no weekly report. **[NEEDS CLARIFICATION: proposed: the owner can opt in later from the clinic settings; confirm or replace]**
- **A2 - No receptionist yet:** At step 9, the owner skips this step. The system finishes the setup with no receptionist login, and the owner can add receptionists later (UC-02). **[NEEDS CLARIFICATION: proposed: the owner can finish the setup without any receptionist login; confirm or replace]**
- **E1 - More than five doctors:** At step 7, the owner tries to add a sixth doctor. **[NEEDS CLARIFICATION: proposed: the system refuses the sixth doctor and tells the owner that the service covers clinics with up to 5 doctors; confirm or replace]**
- **E2 - Fee left empty:** At step 7, the owner leaves a doctor's fee empty. **[NEEDS CLARIFICATION: proposed: the system accepts the doctor, and the weekly report shows no fee estimate for that doctor; confirm or replace]**

### Business Rules & Constraints

- Each clinic has one clinic account, with one owner login and receptionist logins ([03 / Clinic account and roles](./03-definitions-and-domain-concepts.md#clinic-account-and-roles)).
- The weekly report goes only to an owner who opted in ([03 / Weekly no-show report](./03-definitions-and-domain-concepts.md#weekly-no-show-report)).
- A clinic has 1 to 5 doctors ([04 / Project Scope](./04-scope-and-personas.md#project-scope)).
- Each doctor's fee per visit feeds the estimated fees in the weekly report ([03 / Doctors and fees](./03-definitions-and-domain-concepts.md#doctors-and-fees)).

### Acceptance Criteria

- [ ] Given a new clinic, when the owner completes steps 1 to 10, then the dashboard opens and reception can enter appointments for the listed doctors.
- [ ] Given the owner agreed at step 5, when the first report week ends, then the owner gets the weekly report on WhatsApp (UC-03).
- [ ] Given the owner declined at step 5 (A1), when the report week ends, then no weekly report is sent.
- [ ] Given the owner skips step 9 (A2), when the setup ends, then the clinic account is ready with no receptionist login.
- [ ] Given a clinic with five doctors, when the owner adds a sixth (E1), then the system refuses and explains the limit.
- [ ] Given a doctor with no fee (E2), when the weekly report is sent, then it shows no fee estimate for that doctor.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-02: Manage receptionist logins

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: SMS aggregator ([08](./08-integrations.md)) |
| **Goal** | Give each receptionist their own login, and end it when the receptionist leaves. |
| **Trigger** | A receptionist joins or leaves the clinic. |

### Why

Receptionists are the daily users of Clinic Reminders ([pre-BRD 04 Value Proposition Canvas, Receptionist](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). Owners fear liability when patient data sits in personal phones ([pre-BRD 04, Clinic owner](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). A login that ends when a receptionist leaves keeps patient data inside the clinic.

### Preconditions

- The clinic account exists (UC-01).

### Main Flow

1. The Clinic Owner opens the receptionist logins.
2. The system lists the clinic's receptionist logins.
3. The Clinic Owner chooses to add a receptionist.
4. The system asks for the receptionist's name and mobile number. **[NEEDS CLARIFICATION: proposed: a receptionist login needs the receptionist's name and mobile number; confirm or replace]**
5. The Clinic Owner enters the details.
6. The system creates the login and sends the receptionist a sign-in invitation by SMS.
7. The system shows the new login in the list.

### Alternate & Exception Flows

- **A1 - Remove a receptionist:** At step 3, the owner removes a receptionist's login instead. The system asks the owner to confirm, then ends that login's access at once. **[NEEDS CLARIFICATION: proposed: the owner can remove a receptionist login, and access ends at once after the owner confirms; confirm or replace]**
- **E1 - Mobile number already used:** At step 5, the mobile number already has a login in this clinic. **[NEEDS CLARIFICATION: proposed: the system refuses the duplicate login and shows the existing one; confirm or replace]**

### Business Rules & Constraints

- Each receptionist has their own login ([pre-BRD 14 MoSCoW, Must (1)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)).
- A receptionist login gives only the Receptionist access in the [Users & Use Cases Matrix](./07-users-use-cases-matrix.md).

### Acceptance Criteria

- [ ] Given a signed-in owner, when the owner adds a receptionist, then the receptionist gets an invitation and the new login shows in the list.
- [ ] Given a receptionist login, when the owner removes it (A1), then that receptionist can no longer sign in.
- [ ] Given a mobile number with a login in the clinic, when the owner adds it again (E1), then the system refuses and shows that login.
- [ ] Given a receptionist login, when the receptionist signs in, then the receptionist can do only what the matrix gives the Receptionist.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-03: Read the weekly no-show report

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: WhatsApp Business Platform ([08](./08-integrations.md)) |
| **Goal** | See each week how many appointments were lost, kept, and refilled. |
| **Trigger** | The weekly report time arrives ([03 / Weekly no-show report](./03-definitions-and-domain-concepts.md#weekly-no-show-report)). |

### Why

The owner wants one weekly number that shows whether the clinic is improving. The owner also wants to see the return on the subscription in clinic terms ([pre-BRD 04 Value Proposition Canvas, Clinic owner](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). The weekly report is the habit that keeps clinics subscribed ([pre-BRD 03 Lean Canvas, Customer Relationships](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)). It serves Business Objective 4 ([01](./01-executive-summary-and-context.md#business-objectives)).

### Preconditions

- The owner opted in to the weekly report (UC-01).

### Main Flow

1. The system builds the clinic's report for the past week ([03 / Measures](./03-definitions-and-domain-concepts.md#measures)).
2. The system sends the report to the owner on WhatsApp, in Arabic.
3. The Clinic Owner opens the message.
4. The message shows the week's measures listed in [03 / Measures](./03-definitions-and-domain-concepts.md#measures).
5. The Clinic Owner reads the report.

### Alternate & Exception Flows

- **A1 - No appointments in the week:** At step 1, the clinic had no due appointments that week. **[NEEDS CLARIFICATION: proposed: the report says that there were no appointments that week; confirm or replace]**
- **A2 - Appointments not marked:** At step 1, some past appointments have no attendance mark. The report counts them by the rule in [03 / Measures](./03-definitions-and-domain-concepts.md#measures).
- **E1 - Report not delivered:** At step 2, WhatsApp does not deliver the report. **[NEEDS CLARIFICATION: What happens when the weekly report is not delivered on WhatsApp?]**

### Business Rules & Constraints

- The measures and their definitions are in [03 / Measures](./03-definitions-and-domain-concepts.md#measures).
- The report goes only to an owner who opted in (UC-01, BR-2).
- The report is in Arabic ([pre-BRD 06 Market Comparison, section 4](../../run/pre-brd-clinic-reminders/06-market-comparison.md)).

### Acceptance Criteria

- [ ] Given an owner who opted in, when the report time arrives, then the owner gets the report on WhatsApp, in Arabic.
- [ ] Given a week with marked appointments, when the report is built, then it shows the four clinic measures defined in 03.
- [ ] Given a doctor's fee and no-shows in the week, when the report is built, then the doctor's estimated lost fees follow the formula in [03 / Measures](./03-definitions-and-domain-concepts.md#measures).
- [ ] Given a week with no due appointments (A1), when the report is built, then the report says so.
- [ ] Given unmarked past appointments (A2), when the report is built, then they are counted by the rule in 03.
- [ ] Given the owner reads the report, when WhatsApp shows it as read, then the report counts as read for Business Objective 4.

### Future Enhancements

- None identified at this time. A no-show breakdown by doctor, weekday, and specialty is on the [Wishlist](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

The report is a WhatsApp message. Message layout pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-04: Export the consent records

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | None |
| **Goal** | Show that the clinic messages its patients lawfully. |
| **Trigger** | The clinic needs proof of its patients' consent to messages, for example for the regulator. |

### Why

The consent records let the clinic show that it messages patients lawfully ([pre-BRD 06 Market Comparison, section 4](../../run/pre-brd-clinic-reminders/06-market-comparison.md)). Consent records for electronic marketing must be kept for three years (02 / Constraint 12).

### Preconditions

- The clinic account exists (UC-01).

### Main Flow

1. The Clinic Owner opens the consent records.
2. The system lists each patient's consent record: the status, when and how consent was given, the staff member who recorded it, where the proof is, the guardian, and any opt-out time.
3. The Clinic Owner chooses to export the records.
4. The system creates a file with all the clinic's consent records. **[NEEDS CLARIFICATION: proposed: the export is a spreadsheet file; confirm or replace]**
5. The Clinic Owner saves the file.

### Alternate & Exception Flows

- **E1 - No records yet:** At step 2, the clinic has no consent records. **[NEEDS CLARIFICATION: proposed: the system says that there are no records and offers no export; confirm or replace]**

### Business Rules & Constraints

- The export holds only the clinic's own patients ([10 / NFR-05](./10-nfrs.md)).
- The export holds every consent and every opt-out, with its time ([03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)).

### Acceptance Criteria

- [ ] Given a clinic with consent records, when the owner exports them, then the file holds every patient's consent record, as listed at step 2.
- [ ] Given a patient who opted out, when the owner exports the records, then the file shows the opt-out time.
- [ ] Given a clinic with no consent records (E1), when the owner opens the records, then the system says so and offers no export.
- [ ] Given two clinics, when one owner exports, then the file holds no patient of the other clinic.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-05: Change the reminder timing

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | None |
| **Goal** | Send reminders at the time that suits the clinic's patients. |
| **Trigger** | The owner wants reminders to go earlier or later than 24 hours before the visit. |

### Why

Configurable reminder timing is a Should ([pre-BRD 14 MoSCoW, Should](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). It lets each clinic pick its own reminder time instead of the 24-hour default ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)).

### Preconditions

- The clinic account exists (UC-01).
- Configurable timing is live: the Growth phase ([04 / Release phases](./04-scope-and-personas.md#release-phases)).

### Main Flow

1. The Clinic Owner opens the reminder settings.
2. The system shows the current reminder time: 24 hours before the visit by default.
3. The Clinic Owner picks a new reminder time. **[NEEDS CLARIFICATION: Which reminder times can a clinic choose?]**
4. The system saves the new time.
5. The system shows the date from which the new time applies. **[NEEDS CLARIFICATION: proposed: the new time applies to every reminder not sent yet; confirm or replace]**

### Alternate & Exception Flows

- None identified. A visit entered after its reminder time follows [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules).

### Business Rules & Constraints

- The default reminder time is 24 hours before the visit ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)).
- **[NEEDS CLARIFICATION: proposed: one reminder time applies to the whole clinic, not one per doctor; confirm or replace]**

### Acceptance Criteria

- [ ] Given the default setting, when the owner opens the settings, then the reminder time shows 24 hours before the visit.
- [ ] Given a new reminder time is saved, when a later appointment reaches the new time, then its reminder goes at the new time.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

---

## UC-06: Pay the subscription

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: Local payment gateway ([08](./08-integrations.md)) |
| **Goal** | Pay the clinic's subscription in EGP. |
| **Trigger** | A subscription payment falls due. |

### Why

The paid launch needs subscription billing in EGP through a local payment gateway ([pre-BRD 14 MoSCoW, Should](../../run/pre-brd-clinic-reminders/14-moscow-method.md); [pre-BRD 21 Roadmap, Q2-2027](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)).

### Preconditions

- The paid launch has started ([04 / Release phases](./04-scope-and-personas.md#release-phases)).
- The clinic has a plan, or picks one at its first payment (A3).

### Main Flow

1. The system tells the owner that a payment is due, with the plan and the amount in EGP. **[NEEDS CLARIFICATION: proposed: the system shows the due payment in the dashboard before the due date; confirm or replace]**
2. The Clinic Owner opens the payment page.
3. The system shows the plan, the period (a month or a year), and the amount in EGP.
4. The Clinic Owner pays through the local payment gateway.
5. The payment gateway confirms the payment.
6. The system records the payment and shows a receipt. **[NEEDS CLARIFICATION: proposed: the system shows a receipt that the owner can save; confirm or replace]**

### Alternate & Exception Flows

- **A1 - Annual prepayment:** At step 3, the owner chooses to prepay a year at the discount ([pre-BRD 03 Lean Canvas, Revenue Streams (3)](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)).
- **A2 - Message top-up:** At step 3, the owner buys extra reminders above the allowance ([03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance)).
- **A3 - First payment:** At step 3, the clinic has no plan yet. The Clinic Owner picks the plan that fits the clinic's number of doctors ([03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance)).
- **E1 - Payment refused:** At step 5, the gateway refuses the payment. **[NEEDS CLARIFICATION: proposed: the system tells the owner that the payment did not go through and offers a new try; confirm or replace]**
- **E2 - Payment not made by the due date:** The rule is still open ([03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance)).
- **E3 - Payment result unknown:** At step 5, the owner has paid, but the gateway has not confirmed the payment. The system shows the payment as waiting for confirmation and does not ask the owner to pay again for the same period. **[NEEDS CLARIFICATION: proposed: if the result is still unknown after 24 hours, the founders check it with the gateway and tell the owner; confirm or replace]**

### Business Rules & Constraints

- Prices are in EGP. Plans and prices are in [pre-BRD 21 Roadmap, Pricing & packaging](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md).
- The owner is never charged twice for the same period or the same top-up. A payment that waits for confirmation does not count as a missed payment.

### Acceptance Criteria

- [ ] Given a payment is due, when the owner pays and the gateway confirms, then the system records the payment and shows a receipt.
- [ ] Given the owner chooses annual prepayment (A1), when the payment succeeds, then the subscription runs for one year.
- [ ] Given the owner buys a top-up (A2), when the payment succeeds, then the clinic's allowance grows by the top-up.
- [ ] Given the gateway refuses the payment (E1), when the owner sees the result, then the system says the payment failed and offers a new try.
- [ ] Given a payment waiting for confirmation (E3), when the owner opens the payment page, then the system shows it as waiting and offers no second payment for that period.
- [ ] Given a clinic with no plan (A3), when the owner makes the first payment, then the owner picks the plan that fits the clinic's number of doctors.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-receptionist.md -->
