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

Reminders can only start once the clinic, its doctors, and its WhatsApp sender are in place (BO-01, BO-05). Onboarding is assisted and in person ([pre-BRD 03 Lean Canvas, Customer Relationships](../pre-brd-clinic-reminders/03-lean-canvas.md)). Each doctor's fee lets the weekly report show fees lost and recovered, which is how the owner sees the value of the subscription.

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
8. The system saves the setup and shows the clinic as ready to send reminders.

### Alternate & Exception Flows

- **A1 - Owner does not opt in to the weekly report:** At step 7 the owner skips the report. The system saves the setup and sends no weekly report. The owner can opt in later from clinic setup. **[NEEDS CLARIFICATION: proposed report opt-in later; confirm or replace]**
- **E1 - WhatsApp sender not ready:** At step 6, WhatsApp (Meta) may not have verified the business or approved the templates yet. The system then shows the clinic as not ready and names what is missing. No reminder is sent until the clinic is ready. **[NEEDS CLARIFICATION: proposed not-ready state; confirm or replace]**
- **E2 - Missing details:** At step 8, if a required field is empty, the system names the field and says what to enter (chunk 11, Forms).

### Business Rules & Constraints

- Only the owner can change clinic setup. **[NEEDS CLARIFICATION: proposed owner-only setup; confirm or replace]**
- The default reminder time is 24 hours before the visit. The owner can change it from the paid launch (UC-04).
- A doctor's consultation fee is used only to estimate lost and recovered fees in the weekly report (chunk 03).
- The weekly report goes only to an owner who opted in.

### Acceptance Criteria

- [ ] Given a profile, at least one doctor, and a connected WhatsApp sender, when the owner saves the setup, then the clinic shows as ready to send reminders.
- [ ] Given the owner opted in to the weekly report, when setup is saved, then the next weekly report goes to the number the owner entered.
- [ ] Given WhatsApp (Meta) has not approved the sender, when the owner opens setup, then the system shows the clinic as not ready and names what is missing.
- [ ] Given a receptionist login, when the receptionist looks for clinic setup, then the system does not show it.

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
4. The system creates the login and sends the receptionist a sign-in invitation by SMS. **[NEEDS CLARIFICATION: proposed invitation by SMS; confirm or replace]**
5. When a receptionist leaves, the owner selects that login and chooses to remove it.
6. The system asks the owner to confirm the removal and names the person.
7. The owner confirms.
8. The system ends the login at once and shows it as removed.

### Alternate & Exception Flows

- **A1 - Owner cancels the removal:** At step 7 the owner cancels. The login stays active. **[NEEDS CLARIFICATION: proposed cancel option; confirm or replace]**
- **E1 - Mobile number already used:** At step 3, if another login of the clinic already uses the number, the system refuses it and says why. **[NEEDS CLARIFICATION: proposed one login per mobile number; confirm or replace]**

### Business Rules & Constraints

- Each receptionist has a personal login. Logins are never shared. **[NEEDS CLARIFICATION: proposed personal logins; confirm or replace]**
- A removed login cannot sign in again. Its past actions stay in the clinic's records (UC-05).

### Acceptance Criteria

- [ ] Given the owner adds a receptionist, when the owner saves, then the new login is listed as active and the receptionist gets a sign-in invitation.
- [ ] Given an active receptionist login, when the owner removes it and confirms, then that person cannot sign in.
- [ ] Given a mobile number already used by a login of the clinic, when the owner adds it again, then the system refuses it and says why.

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
- **E1 - Report not delivered on WhatsApp:** At step 2, if WhatsApp does not deliver the report, the report stays available in the dashboard. No SMS is sent. **[NEEDS CLARIFICATION: proposed no SMS for the report; confirm or replace]**
- **E2 - Attendance not marked:** At step 1, some of the week's appointments may have no attended or no-show mark. The report then shows how many are unmarked, so the owner knows the no-show rate is incomplete. **[NEEDS CLARIFICATION: proposed unmarked count; confirm or replace]**

### Business Rules & Constraints

- The report is sent once a week, in Arabic, to the owner only.
- Fees in the report are estimates based on each doctor's fee (UC-01).
- The report shows counts and fees only, never patient names. **[NEEDS CLARIFICATION: proposed no patient names; confirm or replace]**

### Acceptance Criteria

- [ ] Given a week with 40 appointments due and 6 marked no-show, when the report is sent, then it shows 6 no-shows and a no-show rate of 15%.
- [ ] Given the owner reads the WhatsApp report, when the read is recorded, then the week counts toward the owners' read rate (BO-13).
- [ ] Given 3 appointments of the week have no attendance mark, when the report is built, then it shows that 3 appointments are unmarked.
- [ ] Given WhatsApp does not deliver the report, when the owner opens the dashboard, then the same report is there.

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

Configurable timing and a visit-day reminder are paid-launch items (chunk 04, items 9 and 10). A second reminder gives patients who did not answer another chance, which serves BO-07.

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
- The visit-day reminder goes only to patients who have not cancelled. **[NEEDS CLARIFICATION: proposed visit-day audience; confirm or replace]**
- Every reminder follows the same channel order: WhatsApp first, then SMS (chunk 03).

### Acceptance Criteria

- [ ] Given the owner sets the reminder to 48 hours before the visit, when a new appointment is entered for 3 days ahead, then its reminder goes 48 hours before the visit.
- [ ] Given the visit-day reminder is on, when the visit day arrives, then every patient who has not cancelled gets a second reminder.
- [ ] Given the owner picks a time outside the allowed range, when saving, then the system shows the range and keeps the old setting.

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

The owner is responsible for patient data and fears liability ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md)). An audit log of staff actions is a paid-launch item (chunk 04, item 13).

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

- **A1 - Nothing matches the filter:** At step 4 the system says no action matches and offers to clear the filter (chunk 11, Empty states).

### Business Rules & Constraints

- The log records adding, changing, and cancelling appointments; recording consent and opt-outs; waitlist changes; marking attendance; and adding or removing logins. **[NEEDS CLARIFICATION: proposed list of logged actions; confirm or replace]**
- No one in the clinic can change or delete the log. **[NEEDS CLARIFICATION: proposed read-only log; confirm or replace]**
- The log is kept as long as NFR-06 requires.

### Acceptance Criteria

- [ ] Given a receptionist cancelled an appointment, when the owner opens the log, then the cancellation shows with the receptionist's name, the appointment, and the time.
- [ ] Given the owner filters by one receptionist, when the filter applies, then only that receptionist's actions show.
- [ ] Given a filtered list, when the owner exports it, then the file holds the same rows.

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
3. The owner chooses to pay monthly or yearly.
4. The system opens the Payment Gateway's payment page with the amount due.
5. The owner pays.
6. The system confirms the payment, shows the receipt, and sets the next due date.

### Alternate & Exception Flows

- **E1 - Payment refused:** At step 5, if the payment does not go through, the system tells the owner and offers to try again. The plan does not change. **[NEEDS CLARIFICATION: proposed retry; confirm or replace]**
- **E2 - Payment overdue:** **[NEEDS CLARIFICATION: When a payment is overdue, for how long do reminders continue, and what happens to the clinic's data?]**
- **E3 - Reminder allowance used up:** **[NEEDS CLARIFICATION: When a clinic uses up its monthly reminder allowance, do reminders continue and bill as a top-up, or stop until the owner buys more?]**

### Business Rules & Constraints

- Prices are in EGP. Plans are tiered by the number of doctors and include a monthly reminder allowance. Plan prices are set in [pre-BRD 21 Roadmap, Pricing & packaging](../pre-brd-clinic-reminders/21-roadmap-project-plan.md).
- Paying yearly in advance gives two months free ([pre-BRD 03 Lean Canvas, Revenue Streams](../pre-brd-clinic-reminders/03-lean-canvas.md)).

### Acceptance Criteria

- [ ] Given a clinic on a monthly plan, when the owner pays the amount due, then the system shows the receipt and moves the next due date one month ahead.
- [ ] Given the owner chooses yearly payment, when the page opens, then the amount due is the price of 10 months.
- [ ] Given the Payment Gateway refuses the payment, when the owner returns, then the system says the payment did not go through and the plan is unchanged.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-receptionist.md -->
