<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Clinic Owner
PROJECT: Clinic Reminders
VERSION: 1.1
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
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram, derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

---

## UC-01: Set up the clinic

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: WhatsApp (Meta) (08) |
| **Goal** | Get the clinic ready so that reminders can start. |
| **Trigger** | The clinic subscribes, during the onboarding visit by a Clinic Reminders founder. |

### Why

Reminders can only start once the clinic, its doctors, and its WhatsApp sender are in place (BO-01, BO-05). Onboarding is assisted and in person ([pre-BRD 03 Lean Canvas, Customer Relationships](../pre-brd-clinic-reminders/03-lean-canvas.md)). Each doctor's fee lets the weekly report show fees lost and recovered. That is how the owner sees what the subscription is worth.

### Preconditions

- The owner has an owner login for the clinic. **[NEEDS CLARIFICATION: proposed account opening: the Clinic Reminders team opens the clinic account during the onboarding visit and gives the owner the owner login; confirm or replace]**
- The clinic is in Cairo or Giza (chunk 02, Constraint 12).

### Main Flow

1. The owner signs in and opens clinic setup.
2. The system shows the clinic profile.
3. The owner enters the clinic name, address, and phone number.
4. The owner adds each doctor with name, specialty, and consultation fee in EGP.
5. The system shows the default reminder setting: one WhatsApp reminder 24 hours before each visit, with SMS fallback.
6. The owner connects the clinic's WhatsApp sender. **[NEEDS CLARIFICATION: proposed sender model: reminders come from the clinic's own WhatsApp number, connected in this step; confirm or replace with one shared Clinic Reminders number, and say how WhatsApp charges in US dollars are billed to the clinic in EGP (pre-BRD OI-15)]**
7. The owner opts in to the weekly report and enters the WhatsApp number that receives it.
8. The owner accepts the Clinic Reminders service terms, including how Clinic Reminders handles patient data for the clinic. The system records who accepted, the version, and the time.
9. The system saves the setup and shows the clinic as ready to send reminders.

### Alternate & Exception Flows

- **A1 - Owner does not opt in to the weekly report:** At step 7 the owner skips the report. The system saves the setup and sends no weekly report. The owner can opt in later from clinic setup. **[NEEDS CLARIFICATION: proposed report opt-in later; confirm or replace]**
- **A2 - Owner changes a doctor's details:** The owner edits a doctor's name, specialty, or fee. A new fee applies from the next weekly report. Reports already sent do not change.
- **E1 - WhatsApp sender not ready:** At step 6, WhatsApp (Meta) may not have verified the business or approved the templates yet. The system then shows the clinic as not ready and names what is missing. No reminder is sent until the clinic is ready. **[NEEDS CLARIFICATION: proposed not-ready state; confirm or replace]**
- **E2 - Missing details:** At step 9, if a required field is empty, the system names the field and says what to enter (chunk 11, Forms).
- **E3 - Doctor still has future appointments:** When the owner removes a doctor, the system lists the doctor's future appointments. It does not remove the doctor until each one is moved or cancelled (UC-10). The doctor's waitlist entries then end.
- **E4 - Doctor limit reached (from the paid launch):** At step 4, if the clinic's plan allows no more doctors, the system says so and names the plan that allows more (UC-06).

### Business Rules & Constraints

- Only the owner can change clinic setup. **[NEEDS CLARIFICATION: proposed owner-only setup; confirm or replace]**
- The default reminder time is 24 hours before the visit. The owner can change it from the paid launch (UC-04).
- A doctor's consultation fee is used only to estimate lost and recovered fees in the weekly report (chunk 03).
- The weekly report goes only to an owner who opted in.

### Acceptance Criteria

- [ ] Given a profile, at least one doctor, and a connected WhatsApp sender, when the owner saves the setup, then the clinic shows as ready to send reminders.
- [ ] Given the owner opted in to the weekly report, when setup is saved, then the next weekly report goes to the number the owner entered.
- [ ] Given WhatsApp (Meta) has not approved the sender, when the owner opens setup, then the system shows the clinic as not ready and names what is missing. **[NEEDS CLARIFICATION: proposed not-ready state; confirm or replace]**
- [ ] Given a receptionist login, when the receptionist looks for clinic setup, then the system does not show it. **[NEEDS CLARIFICATION: proposed owner-only setup; confirm or replace]**
- [ ] Given the owner skips the weekly report at step 7, when setup is saved, then no weekly report is sent until the owner opts in. **[NEEDS CLARIFICATION: proposed report opt-in later; confirm or replace]**
- [ ] Given the owner changes a doctor's fee, when the next weekly report is built, then it uses the new fee, and reports already sent do not change.
- [ ] Given a required field is empty, when the owner saves, then the system names the field and says what to enter.
- [ ] Given a doctor with future appointments, when the owner tries to remove the doctor, then the system lists those appointments and keeps the doctor until each one is moved or cancelled.
- [ ] Given the clinic's plan allows no more doctors, when the owner adds a doctor, then the system says so and names the plan that allows more.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-02: Manage receptionist logins

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: SMS Provider (08) |
| **Goal** | Give each receptionist a login, and end it when the receptionist leaves. |
| **Trigger** | A receptionist joins or leaves the clinic. |

### Why

The receptionist does the daily work, so the clinic needs a receptionist login (MVP item 1). A person who leaves must lose access to patient data at once (chunk 02, Constraint 6).

### Preconditions

- The clinic is set up (UC-01).

### Main Flow

1. The owner opens staff logins.
2. The system lists the clinic's receptionist logins and shows which are active.
3. The owner adds a receptionist with name and mobile number.
4. The system creates the login and sends the receptionist a sign-in invitation by SMS.
5. When a receptionist leaves, the owner selects that login and chooses to remove it.
6. The system asks the owner to confirm the removal and names the person.
7. The owner confirms.
8. The system ends the login at once and shows it as removed.

### Alternate & Exception Flows

- **A1 - Owner cancels the removal:** At step 7 the owner cancels. The login stays active. **[NEEDS CLARIFICATION: proposed cancel option; confirm or replace]**
- **A2 - Invitation not received:** At step 4, if the receptionist did not get the invitation, the owner selects the login and sends the invitation again.
- **E1 - Mobile number already used:** At step 3, if another login of the clinic already uses the number, the system refuses it and says why. **[NEEDS CLARIFICATION: proposed one login per mobile number; confirm or replace]**

### Business Rules & Constraints

- Each receptionist has a personal login. Logins are never shared. **[NEEDS CLARIFICATION: proposed personal logins; confirm or replace]**
- A removed login cannot sign in again. Its past actions stay in the clinic's records (UC-05).
- An owner or receptionist who cannot sign in regains access on their own through the mobile number of their login. **[NEEDS CLARIFICATION: Who restores access when the owner no longer has the owner login's mobile number, and how does the owner login pass to another person when the clinic changes owner?]**

### Acceptance Criteria

- [ ] Given the owner adds a receptionist, when the owner saves, then the new login is listed as active and the receptionist gets a sign-in invitation.
- [ ] Given an active receptionist login, when the owner removes it and confirms, then that person cannot sign in.
- [ ] Given a mobile number already used by a login of the clinic, when the owner adds it again, then the system refuses it and says why. **[NEEDS CLARIFICATION: proposed one login per mobile number; confirm or replace]**
- [ ] Given the owner chooses to remove a login, when the owner cancels at the confirmation, then the login stays active. **[NEEDS CLARIFICATION: proposed cancel option; confirm or replace]**
- [ ] Given a receptionist did not get the invitation, when the owner sends it again, then the receptionist gets a new invitation.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-03: Read the weekly no-show report

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: WhatsApp (Meta) (08) |
| **Goal** | See each week how many visits were lost, cancelled, and refilled. |
| **Trigger** | The weekly report time arrives (chunk 03, Weekly no-show report measures). |

### Why

Owners have no reliable no-show number today ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md)). One weekly number shows whether the clinic is improving and what the subscription returns (BO-07, BO-12, BO-13). The report is the habit that keeps clinics subscribed.

### Preconditions

- The owner opted in to the weekly report (UC-01).

### Main Flow

1. The system builds the report for the past week from the clinic's appointments (chunk 03, Weekly no-show report measures).
2. The system sends the report to the owner's WhatsApp number, in Arabic.
3. The owner opens and reads the report.
4. The system records that the owner read the report that week.
5. The owner opens the report for the same week in the clinic dashboard. **[NEEDS CLARIFICATION: Does the MVP include this dashboard view, or only the WhatsApp report (pre-BRD OI-12 recommends a WhatsApp-only report to fit the build time)?]**
6. The system shows the week's measures next to the previous week's. **[NEEDS CLARIFICATION: proposed week-on-week comparison; confirm or replace]**

### Alternate & Exception Flows

- **A1 - Week with no appointments:** At step 1, if the clinic had no appointments due, the report says so and shows no rates. **[NEEDS CLARIFICATION: proposed empty-week report; confirm or replace]**
- **E1 - Report not delivered on WhatsApp:** At step 2, if WhatsApp does not deliver the report, no SMS is sent. If the dashboard view in step 5 is in the MVP, the report stays available there. **[NEEDS CLARIFICATION: proposed no SMS for the report; confirm or replace]**
- **E2 - Attendance not marked:** At step 1, some of the week's appointments may have no attended or no-show mark. The report then shows how many are unmarked, so the owner knows the no-show rate is incomplete. **[NEEDS CLARIFICATION: proposed unmarked count; confirm or replace]**

### Business Rules & Constraints

- The report is sent once a week, in Arabic, to the owner only.
- Fees in the report are estimates based on each doctor's fee (UC-01).
- The report shows counts and fees only, never patient names. **[NEEDS CLARIFICATION: proposed no patient names; confirm or replace]**
- A week counts as read for BO-13 when WhatsApp reports the owner's report as read. It also counts as read when the owner opens that week's report in the dashboard, if the dashboard view in step 5 is in the MVP. A report read without either signal counts as unread, so the read rate is a floor.

### Acceptance Criteria

- [ ] Given a week with 40 appointments due and 6 marked no-show, when the report is sent, then it shows 6 no-shows and a no-show rate of 15%. **[NEEDS CLARIFICATION: proposed formula; confirm or replace]**
- [ ] Given the owner reads the WhatsApp report, when the read is recorded, then the week counts toward the owners' read rate (BO-13).
- [ ] Given 3 appointments of the week have no attendance mark, when the report is built, then it shows that 3 appointments are unmarked. **[NEEDS CLARIFICATION: proposed unmarked count; confirm or replace]**
- [ ] Given the dashboard view is in the MVP and WhatsApp does not deliver the report, when the owner opens the dashboard, then the same report is there.
- [ ] Given a week with no appointments due, when the report is built, then it says so and shows no rates. **[NEEDS CLARIFICATION: proposed empty-week report; confirm or replace]**

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-04: Change reminder timing

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | None |
| **Goal** | Send reminders at the times that suit the clinic's patients. |
| **Trigger** | The owner wants reminders earlier or later, or wants a second reminder on the visit day. |

### Why

Configurable timing and a visit-day reminder are paid-launch items (chunk 04, items 9 and 10). A same-day reminder for every patient still expected serves the no-show goal after the pilot.

### Preconditions

- The clinic is set up (UC-01).
- The paid launch is live (from 2027-04-01).

### Main Flow

1. The owner opens reminder settings.
2. The system shows the current reminder time and whether the visit-day reminder is on.
3. The owner chooses how many hours before the visit the reminder goes.
4. The owner turns the visit-day reminder on or off.
5. The owner saves the settings.
6. The system confirms the change and applies it to every appointment whose reminder has not gone yet. **[NEEDS CLARIFICATION: proposed: changes apply to reminders not yet sent; confirm or replace]**

### Alternate & Exception Flows

- **E1 - Time outside the allowed range:** At step 3, the owner may pick a time outside the allowed range. The system then shows the range and keeps the old setting. **[NEEDS CLARIFICATION: proposed range check; confirm or replace]**

### Business Rules & Constraints

- **[NEEDS CLARIFICATION: Which reminder times may the owner choose, and at what time on the visit day does the second reminder go?]**
- The visit-day reminder goes to appointments that are not cancelled and not walk-ins, whose patient has consent and has not opted out. Confirmed patients are included.
- Every reminder follows the same channel order: WhatsApp first, then SMS (chunk 03). While WhatsApp is stopped for the whole clinic, reminders go by SMS at the reminder time (UC-13, E4).
- An appointment entered after its reminder time has passed is handled as UC-07 A1 handles a visit less than 24 hours away.

### Acceptance Criteria

- [ ] Given the owner sets the reminder to 48 hours before the visit, when a new appointment is entered for 3 days ahead, then its reminder goes 48 hours before the visit.
- [ ] Given the visit-day reminder is on, when the visit day arrives, then every patient in the visit-day audience (Business Rules) gets a second reminder.
- [ ] Given the owner picks a time outside the allowed range, when saving, then the system shows the range and keeps the old setting. **[NEEDS CLARIFICATION: proposed range check; confirm or replace]**

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-05: Review staff actions

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | None |
| **Goal** | Know who changed an appointment, a consent record, the waitlist, or a login, and when. |
| **Trigger** | The owner wants to check a change, for example after a patient complains. |

### Why

The owner is responsible for patient data and fears liability ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md)). The owner's view and export of the staff activity log are a paid-launch item (chunk 04, item 13). The system records staff actions from the MVP.

### Preconditions

- The clinic is set up (UC-01).
- The paid launch is live (from 2027-04-01).

### Main Flow

1. The owner opens the staff activity log.
2. The system lists staff actions, newest first: who did it, what was done, to which appointment or patient, and when.
3. The owner filters by staff member, type of action, or date.
4. The system shows the matching actions.
5. The owner exports the list.
6. The system produces the file in CSV or Excel format (chunk 11, Data Tables).

### Alternate & Exception Flows

- **A1 - Nothing matches the filter:** At step 4 the system says no action matches and offers to clear the filter (chunk 11, Empty States).

### Business Rules & Constraints

- The log records adding, changing, and cancelling appointments; recording consent and opt-outs; waitlist changes; marking attendance; adding or removing logins; correcting, copying, and deleting patient details (UC-18); changes to clinic setup and reminder settings (UC-01, UC-04); and ending the service (UC-17). **[NEEDS CLARIFICATION: proposed list of logged actions; confirm or replace]**
- No one in the clinic can change or delete the log. **[NEEDS CLARIFICATION: proposed read-only log; confirm or replace]**
- The log is kept as long as NFR-06 requires.
- The system records the staff actions listed above from the first release (MVP). The paid launch adds this view for the owner.

### Acceptance Criteria

- [ ] Given a receptionist cancelled an appointment, when the owner opens the log, then the cancellation shows with the receptionist's name, the appointment, and the time.
- [ ] Given the owner filters by one receptionist, when the filter applies, then only that receptionist's actions show.
- [ ] Given a filtered list, when the owner exports it, then the file holds the same rows.
- [ ] Given a filter that matches no action, when it applies, then the system says no action matches and offers to clear the filter.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-06: Pay the subscription

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: Payment Gateway (08) |
| **Goal** | Pay the subscription in EGP so that reminders continue. |
| **Trigger** | The clinic moves to a paid plan, or a payment falls due. |

### Why

Paying clinics and recurring revenue are year-one objectives (BO-10, BO-11). Billing in EGP through a local payment gateway is a paid-launch item (chunk 04, item 14).

### Preconditions

- The clinic is set up (UC-01).
- The paid launch is live (from 2027-04-01) and the Payment Gateway contract is in place (chunk 02, Dependencies).

### Main Flow

1. The owner opens billing.
2. The system shows the clinic's plan, its price in EGP, the monthly reminder allowance, and the next due date.
3. The owner chooses the plan and whether to pay monthly or yearly.
4. The system opens the Payment Gateway's payment page with the amount due.
5. The owner pays.
6. The system confirms the payment, shows the receipt, and sets the next due date.

### Alternate & Exception Flows

- **A1 - Free period ends:** A pilot clinic stays free until **[NEEDS CLARIFICATION: how many days after 2027-04-01?]**, so its notice, plan choice, and first payment all happen after the paid launch. A clinic that joins from the paid launch gets a 14-day trial (pre-BRD 21). A paying clinic that refers another clinic that then pays gets one free month (pre-BRD 21). Before a free period ends, the system tells the owner the end date and the amount due. If no payment follows, the clinic is treated as overdue (E2).
- **E1 - Payment refused:** At step 5, if the payment does not go through, the system tells the owner and offers to try again. The plan does not change. **[NEEDS CLARIFICATION: proposed retry; confirm or replace]**
- **E2 - Payment overdue:** **[NEEDS CLARIFICATION: When a payment is overdue, for how long do reminders continue, and what happens to the clinic's data?]**
- **E3 - Reminder allowance used up:** **[NEEDS CLARIFICATION: When a clinic uses up its monthly reminder allowance, do reminders continue and bill as a top-up, or stop until the owner buys more?]**

### Business Rules & Constraints

- Prices are in EGP. Plans are tiered by the number of doctors and include a monthly reminder allowance. Plan prices are set in [pre-BRD 21 Roadmap, Pricing & packaging](../pre-brd-clinic-reminders/21-roadmap-project-plan.md).
- Paying yearly in advance gives two months free ([pre-BRD 03 Lean Canvas, Revenue Streams](../pre-brd-clinic-reminders/03-lean-canvas.md)).
- **[NEEDS CLARIFICATION: Are per-doctor calendars (UC-12, A2) for every plan or only the larger one, and is the per-doctor report that pre-BRD 21 lists for the larger plan in scope or a Wishlist item (chunk 12, item 4)?]**
- **[NEEDS CLARIFICATION: Which messages count against the monthly reminder allowance, and how are fallback SMS charged to the clinic?]**
- Each payment produces the receipt or tax invoice that Egyptian tax rules require. **[NEEDS CLARIFICATION: Do plan prices include VAT, and must each payment produce an electronic tax invoice through the Egyptian Tax Authority's system, issued by the product or by the company's accountant?]**

### Acceptance Criteria

- [ ] Given a clinic on a monthly plan, when the owner pays the amount due, then the system shows the receipt and moves the next due date one month ahead.
- [ ] Given the owner chooses yearly payment, when the page opens, then the amount due is the price of 10 months.
- [ ] Given the Payment Gateway refuses the payment, when the owner returns, then the system says the payment did not go through and the plan is unchanged.
- [ ] Given a clinic whose free period is ending, when the notice goes out, then the owner sees the end date and the amount due.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-17: End the clinic's service

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | None |
| **Goal** | Stop using Clinic Reminders on a set date and take the clinic's records along. |
| **Trigger** | The owner decides to stop using Clinic Reminders. |

### Why

Each clinic decides how its patients' data is used (chunk 02, Assumption 4), so it must be able to take that data back. Messages sent for a clinic that has left would reach patients with no clinic behind them.

### Preconditions

- The clinic is set up (UC-01).

### Main Flow

1. The owner opens clinic setup and chooses to end the service. In a free period, the owner also picks the end date.
2. The system shows the end date: the end of the current paid period, or, in a free period, the date the owner picks. It lists what will stop: reminders, slot offers, the weekly report, and every login of the clinic, the owner's included.
3. The system asks the owner to confirm and names what will stop (chunk 11, Destructive Actions).
4. The owner confirms.
5. Until the end date, the owner can download the clinic's appointments, waitlist, and consent and opt-out records.
6. On the end date, the system stops every scheduled message and ends every login of the clinic. The clinic's records are then kept or deleted as NFR-06 requires.

### Alternate & Exception Flows

- None identified at this time.

### Business Rules & Constraints

- A paid period runs to its end. In a free period (UC-06, A1), the service ends on the date the owner picks.
- After the end date, the clinic's records are kept or deleted as NFR-06 requires.

### Acceptance Criteria

- [ ] Given a clinic with reminders scheduled after its end date, when the end date arrives, then none of them is sent.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-19: Export the consent and opt-out log

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | None |
| **Goal** | Show that the clinic messages its patients lawfully. |
| **Trigger** | The owner needs evidence of consent, for example for the regulator or after a patient complaint. |

### Why

The clinic must be able to show consent for every patient it messages (chunk 02, Constraint 6; BO-04). Consent records exist from the first pilot booking.

### Preconditions

- The clinic is set up (UC-01).

### Main Flow

1. The owner opens the consent and opt-out log.
2. The system lists each patient's consent (who, how, when, recorded by, and the consent wording version) and each opt-out, newest first.
3. The owner filters by date or patient.
4. The system shows the matching records.
5. The owner exports the list.
6. The system produces the file in CSV or Excel format (chunk 11, Data Tables).

### Alternate & Exception Flows

- **A1 - Nothing matches the filter:** At step 4 the system says no record matches and offers to clear the filter (chunk 11, Empty States).

### Business Rules & Constraints

- Only the owner opens and exports the log.
- The log covers every consent and opt-out from the first release.

### Acceptance Criteria

- [ ] Given 3 consents and 1 opt-out recorded this week, when the owner opens the log, then all 4 records show with who, how, when, and who recorded them.
- [ ] Given a filtered list, when the owner exports it, then the file holds the same rows.
- [ ] Given a filter that matches no record, when it applies, then the system says no record matches and offers to clear the filter.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-receptionist.md -->
