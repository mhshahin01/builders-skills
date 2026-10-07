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
| **Goal** | Open a clinic account so the clinic's patients start getting reminders. |
| **Trigger** | The owner of a clinic in Cairo or Giza decides to subscribe. |

### Why

Owners lose paid doctor time to no-shows and pay staff to make reminder calls ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Clinic owner). The clinic account is the starting point for every other use case. It serves BO-01 and BO-10.

### Preconditions

- The clinic is a private clinic in Cairo or Giza.

### Main Flow

1. The Clinic Owner starts a new clinic account. **[NEEDS CLARIFICATION: proposed: the Clinic Owner creates the account in the product, with a Clinic Reminders team member helping in person, as the pre-BRD plans assisted onboarding ([pre-BRD 03 Lean Canvas](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), Customer Relationships); confirm or replace]**
2. The system asks for the clinic's details. **[NEEDS CLARIFICATION: proposed: the details are the clinic's name, governorate, and specialty, and the owner's name and mobile number; confirm or replace]**
3. The Clinic Owner enters the details.
4. The system checks that the clinic is in Cairo or Giza governorate.
5. The system asks for the clinic's doctors.
6. The Clinic Owner adds each doctor by name.
7. The system shows the plan that fits the number of doctors ([chunk 03 Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans)).
8. The Clinic Owner agrees to receive the weekly no-show report on WhatsApp.
9. The system creates the clinic account and the owner login.
10. The system shows the account summary and the next steps: give receptionists logins (UC-02) and add appointments (UC-07).

### Alternate & Exception Flows

- **A1 - Owner does not agree to WhatsApp messages:** At step 8, the owner declines. **[NEEDS CLARIFICATION: proposed: the system still creates the account, sends the owner no WhatsApp message, and holds the weekly report until the owner agrees; confirm or replace]**
- **E1 - Clinic outside Cairo and Giza:** At step 4, the system tells the owner that the service is not available in that governorate yet. The system does not create the account.
- **E2 - More than 5 doctors:** At step 6, the owner adds a sixth doctor. **[NEEDS CLARIFICATION: can a clinic with more than 5 doctors subscribe? The plans stop at 5 doctors ([pre-BRD 21](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md), Pricing & packaging).]**

### Business Rules & Constraints

- Only clinics in Cairo and Giza governorates can open an account in this release ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 1).
- The plan follows the number of doctors ([chunk 03 Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans)).
- The system sends the owner WhatsApp messages only after the owner agrees (constraint 12).
- **[NEEDS CLARIFICATION: pre-BRD 24 OI-15 is open: do the clinic's messages go from the clinic's own WhatsApp number or from one shared Clinic Reminders number? This decides set-up, the sender name patients see, and whether the 250-user limit binds.]**

### Acceptance Criteria

- [ ] Given a clinic in Giza with 2 doctors, when the owner completes set-up, then the system creates the account and the owner login and shows the Starter plan.
- [ ] Given a clinic with 4 doctors, when the owner adds the doctors, then the system shows the Clinic plan.
- [ ] Given a clinic in Alexandria, when the owner enters the governorate, then the system does not create the account and says the service is not available there yet.
- [ ] Given the owner did not agree to WhatsApp messages, when set-up ends, then the system sends the owner no WhatsApp message.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-02: Give a receptionist a login

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | Persona: Receptionist |
| **Goal** | Give each receptionist a separate login to run the appointment book. |
| **Trigger** | A new clinic account is ready, or a receptionist joins or leaves the clinic. |

### Why

The Receptionist is the daily user, and reminder calls take hours of the Receptionist's day ([pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Receptionist). Separate logins show who did what in the staff activity log (UC-06). It serves BO-01.

### Preconditions

- The clinic account exists (UC-01).

### Main Flow

1. The Clinic Owner opens the staff list.
2. The system shows the clinic's logins and their roles.
3. The Clinic Owner adds a receptionist. **[NEEDS CLARIFICATION: proposed: the owner adds a receptionist by name and mobile number, and the system sends that person an invitation to set up the login; confirm or replace]**
4. The system creates the receptionist login and sends the invitation.
5. The Receptionist accepts the invitation and sets up the login.
6. The system shows the receptionist in the staff list as active.

### Alternate & Exception Flows

- **A1 - Receptionist leaves:** The Clinic Owner removes the receptionist's login. **[NEEDS CLARIFICATION: proposed: the removed login can no longer sign in, and the receptionist's past actions stay in the staff activity log; confirm or replace]**

### Business Rules & Constraints

- Each receptionist has a separate login ([pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md), Must (1)).
- A receptionist login can do the Receptionist use cases only ([chunk 07](./07-users-use-cases-matrix.md)).

### Acceptance Criteria

- [ ] Given the owner adds a receptionist, when the receptionist accepts the invitation, then the receptionist can sign in and open the day view.
- [ ] Given a receptionist login, when the receptionist tries to open billing, then the system refuses.
- [ ] Given the owner removes a receptionist, when that person tries to sign in, then the system refuses, and the person's past actions still show in the staff activity log.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-03: Read the weekly no-show report

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: WhatsApp Business Platform (Meta) (08) |
| **Goal** | See each week how many appointments were lost and how many were saved. |
| **Trigger** | The weekly report time arrives. **[NEEDS CLARIFICATION: which day and time does the weekly report go out, and which seven days does it cover?]** |

### Why

Owners have no reliable no-show number to act on ([pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Clinic owner). The report shows the return on the subscription in clinic terms ([pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Gain Creators). It is the weekly habit that keeps clinics subscribed ([pre-BRD 03](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), Customer Relationships). It serves BO-12 and BO-13.

### Preconditions

- The Clinic Owner agreed to receive WhatsApp messages (UC-01).

### Main Flow

1. At the weekly report time, the system counts the clinic's appointments for the week.
2. The system works out the report figures ([chunk 09](./09-reporting-and-analytics.md#reporting--analytics), Weekly no-show report).
3. The system sends the report to the Clinic Owner on WhatsApp.
4. The Clinic Owner opens the report.
5. The system records that the owner read the report.

### Alternate & Exception Flows

- **A1 - No appointments in the week:** At step 1, the clinic has no appointments. **[NEEDS CLARIFICATION: proposed: the system sends the report with zero counts; confirm or replace]**
- **E1 - Outcome not recorded:** At step 2, some appointments have no outcome. **[NEEDS CLARIFICATION: proposed: the report shows them as not recorded and does not count them as no-shows; confirm or replace]**
- **E2 - Report not delivered:** At step 3, WhatsApp does not deliver the report. **[NEEDS CLARIFICATION: proposed: the system keeps the report in the clinic account for the owner to read, with no SMS fallback; confirm or replace]**

### Business Rules & Constraints

- The report goes to the Clinic Owner only ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Proposed Solution).
- The report uses an approved template ([chunk 02 Dependencies](./02-glossary-assumptions-facts.md#dependencies)).
- The share of owners who read the report each week counts toward BO-13.
- **[NEEDS CLARIFICATION: pre-BRD 24 OI-12 is open: the MVP plan assumes the founders code full time; should the team re-estimate at 65% coding time and cut Must (7) to a manual-assist waitlist and Must (8) to a template-only report?]**

### Acceptance Criteria

- [ ] Given a week with 120 appointments, 18 no-shows, 80 confirmed, and 4 refilled slots, when the report time comes, then the owner gets a WhatsApp report with the week's no-show rate and confirmed share, worked out as chunk 09 states, and 4 refilled slots.
- [ ] Given the owner opens the report, then the system records it as read.
- [ ] Given an owner who did not agree to WhatsApp messages, when the report time comes, then the system sends nothing to that owner.

### Future Enhancements

- Add late cancellations and the estimated fees lost to no-shows and recovered by refills, as [pre-BRD 06](../../run/pre-brd-clinic-reminders/06-market-comparison.md) (section 4, Weekly owner no-show digest) describes. This needs a definition of a late cancellation and a consultation fee for each doctor.

### UI/UX

The report is a WhatsApp message from an approved template, not a screen. No wireframe required for this use case.

---

## UC-04: Set the reminder timing

| | |
|---|---|
| **Primary Actor** | Clinic Owner **[NEEDS CLARIFICATION: proposed: the Clinic Owner sets the reminder timing; pre-BRD 14 does not say who does; confirm or replace]** |
| **Supporting Actors** | None |
| **Goal** | Choose when reminders go out. |
| **Trigger** | The owner wants reminders at another time, or wants the visit-day reminder. |

### Why

Configurable reminder timing and a second reminder on the visit day are Should-have items ([pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). Timing that suits the clinic's patients raises the reply rate. It serves BO-07.

### Preconditions

- The clinic account exists (UC-01).

### Main Flow

1. The Clinic Owner opens the reminder settings.
2. The system shows the current timing. The default first-reminder time is in [chunk 03 Timing](./03-definitions-and-domain-concepts.md#timing), and the visit-day reminder is off by default.
3. The Clinic Owner changes when the first reminder goes out. **[NEEDS CLARIFICATION: which first-reminder times can the owner choose (the earliest and the latest before the visit)?]**
4. The Clinic Owner turns the visit-day reminder on. **[NEEDS CLARIFICATION: at what time on the visit day does the second reminder go out?]**
5. The system saves the settings.
6. The system applies the new settings to every reminder that is not sent yet. **[NEEDS CLARIFICATION: proposed: the new settings apply to all reminders not yet sent, for all the clinic's doctors; confirm or replace]**

### Alternate & Exception Flows

- **A1 - Owner turns the visit-day reminder off:** At step 4, the owner turns it off. The system sends no visit-day reminders from then on.

### Business Rules & Constraints

- The default first-reminder time is set in [chunk 03 Timing](./03-definitions-and-domain-concepts.md#timing).
- The visit-day reminder is a Q2-2027 item ([chunk 04](./04-scope-and-personas.md#in-scope), item 9).

### Acceptance Criteria

- [ ] Given a new clinic account, when the owner opens the reminder settings, then the first reminder shows the default time set in chunk 03 Timing.
- [ ] Given the owner turns the visit-day reminder on, when a visit day comes, then the system sends the second reminder that day as UC-14 A2 describes.
- [ ] Given the owner changes the first-reminder time, then every reminder not yet sent follows the new time.
- [ ] Given the visit-day reminder is off, when a visit day comes, then no visit-day reminder goes out.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-05: Pay for the subscription

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: Payment gateway (08) |
| **Goal** | Pay for the clinic's plan in EGP. |
| **Trigger** | A payment falls due, or the clinic needs more reminders than its allowance. |

### Why

The monthly subscription is how the business earns revenue ([pre-BRD 03 Lean Canvas](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), Revenue Streams). Billing in EGP through a local payment gateway is a Should-have item ([pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). It serves BO-10 and BO-11.

### Preconditions

- The clinic account exists (UC-01).
- The payment gateway contract is in place ([chunk 02 Dependencies](./02-glossary-assumptions-facts.md#dependencies)).

### Main Flow

1. The Clinic Owner opens billing.
2. The system shows the plan, its price, the reminders included and used this month, the SMS sent, and the next payment date.
3. The Clinic Owner chooses to pay for one month or for a year in advance.
4. The system shows the amount in EGP.
5. The Clinic Owner pays through the payment gateway.
6. The payment gateway confirms the payment.
7. The system records the payment and shows the date the clinic is paid until.

### Alternate & Exception Flows

- **A1 - Buy a top-up:** At step 3, the owner buys extra WhatsApp reminders in blocks of 100 at the top-up price ([chunk 03 Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans)). **[NEEDS CLARIFICATION: proposed: the owner buys top-ups from billing and pays through the payment gateway like a plan payment; confirm or replace]**
- **A2 - Number of doctors changes:** The owner adds a third doctor or removes one so the clinic fits another plan. **[NEEDS CLARIFICATION: proposed: the system moves the clinic to the plan that fits from the next payment; confirm or replace]**
- **E1 - Payment fails:** At step 6, the payment gateway refuses the payment. **[NEEDS CLARIFICATION: proposed: the system tells the owner the payment did not go through and changes nothing; confirm or replace]**
- **E2 - Payment not made by the due date:** **[NEEDS CLARIFICATION: what happens to the clinic's reminders when a payment is not made by its due date?]**
- **E3 - Allowance used up:** **[NEEDS CLARIFICATION: when the month's message allowance runs out, do reminders stop, or does the clinic pay for each extra block of reminders automatically?]**

### Business Rules & Constraints

- Prices are in EGP ([chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints), constraint 23).
- Plans, prices, allowances, and top-ups are as in [chunk 03 Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans).
- Billing starts with the paid launch in Q2-2027 ([chunk 04](./04-scope-and-personas.md#in-scope), item 14).
- **[NEEDS CLARIFICATION: proposed: plan and top-up prices exclude the 14% VAT; billing adds VAT to each payment and gives the Clinic Owner a receipt that shows it; confirm or replace]**

### Acceptance Criteria

- [ ] Given a Starter clinic, when the owner pays for a year in advance, then the system charges EGP 5,490 and shows the clinic as paid for 12 months.
- [ ] Given a Clinic plan, when the owner pays one month, then the system charges EGP 999.
- [ ] Given the owner buys one top-up, then the clinic gets 100 more WhatsApp reminders this month and is charged EGP 50.
- [ ] Given the payment gateway refuses a payment, then the clinic's paid-until date does not change.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

---

## UC-06: Review the staff activity log

| | |
|---|---|
| **Primary Actor** | Clinic Owner **[NEEDS CLARIFICATION: proposed: the Clinic Owner reads the staff activity log; pre-BRD 14 does not say who does; confirm or replace]** |
| **Supporting Actors** | None |
| **Goal** | See which staff member did what in the clinic account, and when. |
| **Trigger** | The owner wants to check a change to an appointment, a consent record, or the waitlist. |

### Why

The staff activity log is a Should-have item ([pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md): "audit log of staff actions"). Owners fear liability for patient data ([pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Clinic owner, Pains); the log shows who changed patient data. No business objective measures it.

### Preconditions

- Staff have used the clinic account.

### Main Flow

1. The Clinic Owner opens the staff activity log.
2. The system lists staff actions, newest first, with who did each one and when.
3. The Clinic Owner filters the list by staff member or by date.
4. The system shows the matching actions.
5. The Clinic Owner opens one action.
6. The system shows what changed.

**[NEEDS CLARIFICATION: proposed: the log records adding, changing, and cancelling appointments; recording consent and opt-outs; changes to the waitlist; attendance records; and changes to staff logins; staff cannot change or delete log entries; confirm or replace]**

### Alternate & Exception Flows

- **A1 - No matching actions:** At step 4, the system shows that no action matches the filter.

### Business Rules & Constraints

- How long the log is kept is open in [chunk 10](./10-nfrs.md#non-functional-requirements) NFR-05 and in [chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints) constraint 11.

### Acceptance Criteria

- [ ] Given a receptionist cancelled an appointment at 10:15, when the owner opens the log, then the cancellation shows with the receptionist's name and the time.
- [ ] Given the owner filters by one receptionist, then only that receptionist's actions show.
- [ ] Given a filter that matches no action, then the system says that no action matches.

### Future Enhancements

- None identified at this time.

### UI/UX

Wireframe pending - see global UI/UX standards in chunk 11.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-receptionist.md -->
