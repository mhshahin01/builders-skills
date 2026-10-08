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

The numbered chunks (00 to 13) hold the current requirements of Clinic Reminders. This companion file holds why and how they were decided: each open item from the review in chunk 13, the answer, who gave it, and when. Read the chunks for what the product must do; read this file for the decision history behind it.

## Clarification register

All 31 open items of the first review (OI-01 to OI-31) were decided on 2026-10-07, in the acceptance loop of the first build: 19 accepted and applied, 3 adjusted and applied, and 9 rejected. The 8 items that consistency check Run 1 raised (OI-32 to OI-39) were decided the same day: all 8 accepted and applied. Each record Q-NN answers the open item with the same number.

### Q-01 - OI-01

**Question:** OI-01: Records that the law and the pilot need start only in the Growth phase. Where: [04 / In Scope](./04-scope-and-personas.md#in-scope) (Growth items); [03 / Staff action log](./03-definitions-and-domain-concepts.md#staff-action-log); 02 / Constraint 7; 01 / Business Objective 2; UC-10 A2. Type: Inconsistency.

**Options considered:** OI-01.

- **A.** Record from go-live, view in Growth: the MVP keeps a record of each staff action and of each message's channel and delivery result; the day-view columns and the owner's log view stay in Growth - small extra MVP work, meets the law, and lets the pilot measure Objective 2.
- **B.** Move both features, with their screens, into the MVP - full features early, but adds Should-have work to a tight build ([pre-BRD 24, OI-12](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)).
- **C.** Keep both in Growth - no extra work, but no legal log during the pilot and paid launch, and no way to measure Objective 2.

Recommended Answer: Option A. In 04 / In Scope, add to the MVP list: "A record of each staff action, and of each message's channel and delivery result, kept from go-live (02 / Constraint 7; Business Objective 2)." In the Growth list, change the two items to: "The day view shows the channel and delivery result of each message (UC-10, A2)." and "The Clinic Owner can read the staff action log (09)." In 03 / Staff action log, change the first sentence to: "From go-live, Clinic Reminders records which staff member did what, and when. The owner can read this record from the Growth phase (09)." Add after it: "**[NEEDS CLARIFICATION: Which activity must Clinic Reminders log under the Anti-Cybercrime Law 175/2018 (02 / Constraint 7)? Counsel to confirm.]**"

Why: The law applies from the first patient message, and [pre-BRD 15 OKRs, O2 KR4](../../run/pre-brd-clinic-reminders/15-okrs.md) sets the delivery target for the pilot, so the data must exist long before Growth. Splitting recording from viewing keeps the Should-have screens in Growth, where [pre-BRD 20](../../run/pre-brd-clinic-reminders/20-product-lifecycle.md) places them. The tradeoff is a little extra MVP work to keep records that nobody views until 2027-10.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 1 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. The accepted text also names the Clinic Owner as the reader of the staff action log, so the proposal marker on the 09 audience was removed (Marker register).

**Rule home:** [04 / In Scope](./04-scope-and-personas.md#in-scope); [03 / Staff action log](./03-definitions-and-domain-concepts.md#staff-action-log)

### Q-02 - OI-02

**Question:** OI-02: Trials and referral credits are neither in scope nor out of scope. Where: [04 / Project Scope](./04-scope-and-personas.md#project-scope) (In Scope and Out of Scope); UC-06. Type: Gap.

**Options considered:** OI-02.

- **A.** Out of scope for the product: Clinic Reminders does not track trials or credits, and the founders apply them by hand - no build work, but manual effort and a manual step in billing.
- **B.** In scope: UC-06 applies trial periods and referral credits itself - automatic and traceable, but adds paid-launch work that MoSCoW does not list.

Recommended Answer: Option A. Add to 04 / Out of Scope: "**Trials and referral credits**: the 14-day trial and the referral credit of one free month per referred paying clinic ([pre-BRD 21 Roadmap, Go-To-Market](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)) are go-to-market offers. Clinic Reminders does not track them in this release. The founders apply them by hand. **[NEEDS CLARIFICATION: How do the founders apply a free month or a trial: by moving the clinic's next due date (UC-06)?]**"

Why: The BRD's own scope rule is MoSCoW (04 / Project Scope), and neither offer is a Must or a Should, so building them adds scope with no source priority. At paid-launch volume (40 paying clinics by 2027-09-30, [pre-BRD 15 OKRs, O3 KR1](../../run/pre-brd-clinic-reminders/15-okrs.md)), handling them by hand is affordable. The tradeoff is founder time, and UC-06 must allow a due date that the founders move.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 1 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### Q-03 - OI-03

**Question:** OI-03: A founder takes part in UC-01, but no persona or matrix column covers the founders. Where: [UC-01](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic-account) Preconditions and step 1; [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors); [07 Users & Use Cases Matrix](./07-users-use-cases-matrix.md); 10 / NFR-05. Type: Inconsistency.

**Options considered:** OI-03.

- **A.** Add a persona, Service Team (the founders and later staff), with one use case, UC-18 Open a clinic account, and a matrix column - matches founder-led onboarding and keeps unknown senders off the service, at the cost of one more persona and a new chunk 06d.
- **B.** Owner self sign-up: anyone opens a clinic account from a public page, and the founder only helps in person - no new persona, but any sender can message patients through the service, and it goes against founder-led onboarding.
- **C.** Name "a founder" as a Supporting Actor of UC-01 with no matrix column - least change, but the matrix still hides the founders' access, and the owner login and the plan still have no owner.

Recommended Answer: Option A. Apply these changes:
  - 04 / Personas / Actors, new row: `| Service Team | The Clinic Reminders founders, and later staff, who open clinic accounts and support clinics ([pre-BRD 02 Product Charter, Stakeholders](../../run/pre-brd-clinic-reminders/02-product-charter.md); [pre-BRD 03 Lean Canvas, Customer Relationships](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)). | Open each new clinic at the onboarding visit. Follow the pilot results. | Service Team login: clinic accounts, owner logins, plans, and the pilot measures. **[NEEDS CLARIFICATION: proposed: the Service Team sees no patient's details; confirm or replace]** |`
  - 02 / Glossary, new term: `| Service Team | The Clinic Reminders founders and staff who open clinic accounts and support clinics (persona, chunk 04). |`
  - 05 / User Journeys, new "Service Team Journey": "A Service Team member visits a clinic that agreed to join. At the visit, the team member opens the clinic account and creates the owner's login (UC-18). The owner then completes the setup (UC-01). During the pilot, the Service Team follows the pilot measures of every pilot clinic (09). From the paid launch, the team member also records each paying clinic's plan."
  - 05 / Use Case Summary, new group and row: `| **Service Team** | | | |` and `| UC-18 | Open a clinic account | Service Team | The Service Team opens a new clinic's account and creates the owner's login at the onboarding visit. |`
  - New chunk 06d-use-cases-service-team.md, listed in the master index and in the 00 Table of Contents, with this block:
    - **UC-18: Open a clinic account.** Primary Actor: Service Team. Supporting Actors: External: SMS aggregator (08). Goal: Open a new clinic's account and give the owner a login. Trigger: A clinic agrees to join Clinic Reminders, for the pilot or as a paying clinic.
    - **Why:** Onboarding is in person and led by a founder ([pre-BRD 03 Lean Canvas, Customer Relationships](../../run/pre-brd-clinic-reminders/03-lean-canvas.md); [pre-BRD 21 Roadmap, Channels & launch plan](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)). An account opened by the team keeps unknown senders off the service, which protects the WhatsApp quality rating that clinics may share ([pre-BRD 24, OI-15](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)). Nothing reaches a patient before the account exists.
    - **Preconditions:** The clinic is a private clinic with 1 to 5 doctors in Cairo or Giza (04 / Project Scope). **[NEEDS CLARIFICATION: Must the clinic sign an agreement with Clinic Reminders, including how Clinic Reminders handles the clinic's patient data as its processor (02 / Assumption 25), before the account opens? Counsel to confirm.]**
    - **Main Flow:**
      1. The Service Team member opens a new clinic account.
      2. The system asks for the clinic name, the governorate (Cairo or Giza), and the owner's name and mobile number. **[NEEDS CLARIFICATION: proposed: these are the clinic details asked when the account opens; confirm or replace]**
      3. The Service Team member enters the details.
      4. The system creates the clinic account and the owner's login.
      5. The system sends the owner a sign-in invitation by SMS.
      6. The system shows the clinic account as waiting for the owner's setup (UC-01).
    - **Alternate & Exception Flows:**
      - **A1 - Paying clinic:** At step 3, from the paid launch, the team member also records the clinic's plan (03 / Subscription and message allowance).
      - **E1 - Clinic outside Cairo and Giza:** At step 3, the clinic is in another governorate. The system refuses and says that the service covers Cairo and Giza only (04 / Out of Scope).
      - **E2 - Owner number already used:** At step 3, the owner's mobile number already has an owner login. **[NEEDS CLARIFICATION: proposed: the system warns and still opens the account, because one owner can own two clinics; confirm or replace]**
    - **Business Rules & Constraints:** Only the Service Team opens clinic accounts; there is no self sign-up in this release. Each clinic has one clinic account with one owner login (03 / Clinic account and roles). A Service Team login sees no patient's details (10 / NFR-05).
    - **Acceptance Criteria:**
      - [ ] Given a clinic in Giza, when the team member opens its account, then the owner gets a sign-in invitation and the account shows as waiting for setup.
      - [ ] Given a paying clinic (A1), when the account opens, then it shows the recorded plan.
      - [ ] Given a clinic in Alexandria (E1), when the team member enters it, then the system refuses and explains why.
      - [ ] Given a Service Team login, when it opens any clinic account, then it shows no patient's details.
    - **Future Enhancements:** None identified at this time.
    - **UI/UX:** Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).
  - UC-01: replace the precondition with "The clinic account and the owner's login exist (UC-18)." Replace steps 1 to 3 with "1. The Clinic Owner signs in with the invitation from UC-18 and opens the clinic setup.", "2. The system shows the clinic details entered in UC-18.", and "3. The Clinic Owner checks the details and corrects them if needed." The markers at steps 1 and 2 are then settled.
  - 07: add a "Service Team" column. Every existing row gets "-" in it. New row: `| UC-18 Open a clinic account | - | - | - | Yes |`.
  - 10 / NFR-05, add to the Business Expectation: "Service Team users see clinic accounts, plans, and the pilot measures of every clinic, but no patient's details."

Why: UC-01's own proposal already puts a founder in the flow, and pre-BRD 03 and 21 make founder-led onboarding the sales model. This actor is real and needs a persona and a matrix column. Opening accounts by the team, not by self sign-up, keeps a shared sender safe while the sender model is open (pre-BRD 24, OI-15). The tradeoff is one more persona, chunk, and column, plus a cross-clinic role that NFR-05 must limit.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 1, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds a persona (Service Team), a use case (UC-18), a new login type, and access rules that the source does not ask for. The pre-BRD names three personas. The founder step in UC-01 stays a proposal for the owner to confirm or replace. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-03](./13-open-items-and-clarifications.md#oi-03-a-founder-takes-part-in-uc-01-but-no-persona-or-matrix-column-covers-the-founders).

### Q-04 - OI-04

**Question:** OI-04: No report measures the business objectives during the pilot. Where: [09 Reporting / Analytics](./09-reporting-and-analytics.md); [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) 1, 2, 3, and 5. Type: Gap.

**Options considered:** OI-04.

- **A.** Add a "Pilot measures" report for the Service Team (OI-03), clinic by clinic and in total, with counts only - the evidence comes from the product, at the cost of one more report in the MVP.
- **B.** The founders work out the measures by hand from exports - no build, but slow and error-prone across 15 clinics, and no export holds delivery or reply data.

Recommended Answer: Option A. Add a row to 09: `| Pilot measures | For each pilot clinic and for all pilot clinics together: the no-show rate against the clinic's baseline (Objective 1), the share of reminders delivered, by WhatsApp and by SMS (Objective 2), the share of cancelled slots refilled from the waitlist (Objective 3), and the share of reminders that got a confirm or cancel reply (Objective 5). Counts only, with no patient's details. The Service Team enters each clinic's baseline before go-live. | Service Team | Weekly during the pilot, and on demand | Table in the dashboard, with an export file |`. Add to 01 / Business Objectives, after "Objectives 1, 2, and 3 are measured in the pilot": "The Pilot measures report shows them (09)."

Why: The pilot exists to produce this evidence ([pre-BRD 15 OKRs, O2](../../run/pre-brd-clinic-reminders/15-okrs.md)), and only the product holds the delivery and reply data. Counts with no patient details keep the Service Team out of patient data (OI-03). The tradeoff is one more MVP report; if OI-03 is not accepted, the audience must be named another way.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 2, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds a new report (Pilot measures) for a Service Team audience that the source does not ask for. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-04](./13-open-items-and-clarifications.md#oi-04-no-report-measures-the-business-objectives-during-the-pilot).

### Q-05 - OI-05

**Question:** OI-05: Business Objective 4 has a target but no way to tell that an owner read the report. Where: 01 / Business Objective 4; UC-03 step 3; [08 / WhatsApp Business Platform](./08-integrations.md) row. Type: Ambiguity.

**Options considered:** OI-05.

- **A.** Count a report as read when WhatsApp shows it as read, and add the read status to what 08 receives - measurable from the product, but under-counts owners who hide read receipts.
- **B.** Ask each pilot owner each month whether they read the reports - catches hidden reads, but is self-reported and manual.
- **C.** A and B together - fuller picture, more founder effort.

Recommended Answer: Option A. Add to 01 / Business Objective 4: "A report counts as read when WhatsApp shows it as read. An owner who turns off read receipts counts as not read." In 08, WhatsApp Business Platform row, add to Information Exchanged: "the read status of each weekly report". Add to UC-03 Acceptance Criteria: "Given the owner reads the report, when WhatsApp shows it as read, then the report counts as read for Business Objective 4."

Why: Only a product signal makes the 70% target testable each week, and the read status is the one signal the report's channel gives. The tradeoff is a cautious, lower number; Option B can be added for the pilot if the gap looks large.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 2 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### Q-06 - OI-06

**Question:** OI-06: The Glossary and 03 / Measures define the no-show rate in two different ways. Where: [02 / Glossary](./02-glossary-assumptions-facts.md#glossary) (No-show rate); [03 / Measures](./03-definitions-and-domain-concepts.md#measures); 01 / Business Objective 1. Type: Inconsistency.

**Options considered:** OI-06.

- **A.** One home in 03 / Measures: the Glossary points to it, and the baseline uses the same formula - one definition, whatever the owner decides for the 03 proposal.
- **B.** Keep two definitions with labels (report and objective) - no edit to 03, but two numbers under one name.

Recommended Answer: Option A. Replace the Glossary definition with: "No-show rate: The no-show measure of the weekly report and of Business Objective 1, by the formula in 03 / Measures." Add to 01 / Business Objective 1: "The baseline and the pilot use the same no-show formula (03 / Measures)."

Why: One fact, one home: the formula is still a proposal in 03, so the Glossary must not settle it another way. Tying the baseline to the same formula protects the objective that the next go or no-go decision depends on (pre-BRD 24, OI-07). The tradeoff is that the Glossary entry no longer stands alone.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 2 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [02 / Glossary](./02-glossary-assumptions-facts.md#glossary) (No-show rate); [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) (Objective 1). The formula stays in [03 / Measures](./03-definitions-and-domain-concepts.md#measures).

### Q-07 - OI-07

**Question:** OI-07: Figure 1 does not show all the status changes that the use cases make. Where: [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle) (Figure 1 and its Summary). Type: Inconsistency.

**Options considered:** OI-07.

- **A.** Redraw Figure 1 from the use cases; each new edge stands or falls with the proposal it comes from - the figure matches the narrative.
- **B.** Drop the figure and keep the bullets - no drift, but no single view of the lifecycle.

Recommended Answer: Option A. Replace the transitions in Figure 1 with these, and keep the Attended and No-show edges and the three end states as they are:
  - `[*] --> Booked : receptionist enters or imports it`
  - `[*] --> Confirmed : patient accepts a waitlist offer`
  - `Booked --> Confirmed : patient confirms, or receptionist records a phone confirmation`
  - `Booked --> Cancelled : patient or receptionist cancels`
  - `Confirmed --> Cancelled : patient or receptionist cancels`
  - `Confirmed --> Booked : receptionist moves the visit`

  Replace the Summary with: "A new appointment is Booked, or Confirmed when a waitlisted patient accepts an offer. The patient or reception confirms or cancels it, and a moved visit becomes Booked again. After the visit time, the receptionist marks a booked or confirmed appointment as Attended or No-show." Add a bullet under the figure: "A moved appointment becomes Booked again and gets a new reminder (UC-11, A2)." If the owner rejects a proposal that an edge comes from, the edge goes too.

Why: The narrative is the source of truth for every diagram, and each new edge already exists in a use case or a 03 rule, so the figure adds no behaviour. The one new rule, a moved visit becomes Booked again, is what "gets a new reminder" in UC-11 A2 implies: the patient is asked again. The tradeoff is a busier figure.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 2 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. Applied with two carries: the Summary is merged into two sentences (the 1-2 sentence rule of mermaid-diagrams.md; no fact changed), and the first sentence of 03 / Appointment lifecycle now says an appointment can start as Confirmed.

**Rule home:** [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle)

### Q-08 - OI-08

**Question:** OI-08: "A patient is known by their mobile number" merges family members who share a phone. Where: [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds); UC-07 step 4; 03 / Consent rules. Type: Inconsistency.

**Options considered:** OI-08.

- **A.** A patient is known by name and mobile number together, and each patient has their own consent record - fits shared phones and guardians, at the cost of one pick from a short list at booking.
- **B.** Keep one patient per number - simplest lookup, but merges families and contradicts the reply and consent rules.

Recommended Answer: Option A. In 03 / What an appointment holds, replace the first bullet with: "A patient is known by their name and mobile number together. Several patients can share one mobile number, for example family members, or the children of one guardian. Each patient has their own consent record, and a patient who books again keeps it (03 / Consent and opt-out). For a patient under 15, the mobile number is the guardian's, and the guardian's consent is recorded for each child." In UC-07, replace step 4 with: "The system shows every patient the clinic knows under that mobile number, each with their consent status."

Why: The rule must hold for the cases the BRD already names: shared family phones, several appointments on one number, and guardians. Option A keeps each person's consent separate, as written consent for each person requires (02 / Constraint 2). The tradeoff is one extra choice for reception at UC-07 step 5, which already says "picks the patient".

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 3 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. The accepted step 4 replaces the UC-07 step 4 text, so its proposal marker was removed (Marker register).

**Rule home:** [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds)

### Q-09 - OI-09

**Question:** OI-09: Patient messages have no quiet hours, and the BRD names no time zone or service hours. Where: [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules); [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules); [10 / NFR-03](./10-nfrs.md). Type: Gap.

**Options considered:** OI-09.

- **A.** Set one time zone, quiet hours for messages that Clinic Reminders starts, and named dashboard hours, with each value a proposal for the owner - clear and testable, but some reminders move away from exactly 24 hours.
- **B.** Keep exact timing at all hours - simplest, but night messages, and night offers that expire unseen.

Recommended Answer: Option A. Add to 03 / Channel rules: "All times in Clinic Reminders are Cairo local time." and "Reminders, SMS fallbacks, and waitlist offers do not go in the quiet hours. **[NEEDS CLARIFICATION: proposed: the quiet hours are 22:00 to 08:00; confirm or replace]** A reminder that falls in the quiet hours goes at the next 08:00. An answer to the patient's own tap or reply goes at once." Add a new rule to 03 / Offer rules: "A cancellation in the quiet hours starts the offers at the next 08:00, if the slot is still in the future (rule 6 sets how close to the visit a slot can still be offered)." In 10 / NFR-03, replace "during clinic hours" with "every day, **[NEEDS CLARIFICATION: proposed: from 08:00 to 24:00 Cairo local time; confirm or replace]**".

Why: Evening lists make night messages a normal case, and an offer that nobody sees defeats Objective 3. One time zone fixes what "24 hours before" and "the report week" mean for every clinic, and named hours make NFR-03 testable. The tradeoff is that a reminder for a late visit arrives in the morning of the day before, still well ahead of the visit.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 3, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds quiet hours, a new sending rule that the source does not ask for. The source sends each reminder at a set time before the visit (pre-BRD 01). Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-09](./13-open-items-and-clarifications.md#oi-09-patient-messages-have-no-quiet-hours-and-the-brd-names-no-time-zone-or-service-hours).

### Q-10 - OI-10

**Question:** OI-10: An appointment confirmed before its reminder time never gets a reminder. Where: [UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder) Preconditions; UC-11 A1; 03 / Offer rules, rule 8; 03 / Channel rules. Type: Ambiguity.

**Options considered:** OI-10.

- **A.** Remind every appointment that is not Cancelled; a Confirm tap on a Confirmed appointment changes nothing; an offer accepted after its reminder time gets no extra reminder - every patient is reminded once, at the cost of one more message for each early confirmation.
- **B.** Remind only Booked appointments - fewer messages, but patients who confirmed early, including waitlist bookings, go unreminded.

Recommended Answer: Option A. In UC-14 Preconditions, replace "The appointment is Booked (UC-07 or UC-08)." with "The appointment is Booked or Confirmed (UC-07, UC-08, UC-11 A1, or UC-16)." Add to 03 / Reply rules: "A Confirm tap on a Confirmed appointment keeps it Confirmed." Add to 03 / Channel rules: "An appointment booked from a waitlist offer after its reminder time gets no reminder. The acceptance message (UC-16, step 4) serves as its reminder."

Why: The source sends a reminder "before each visit" with no status condition ([pre-BRD 01 Concept Sheet, Proposed Solution](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)), and NFR-01 promises that every reminder reaches the patient. The cost is one utility message, EGP 0.19 before VAT ([pre-BRD 08 PESTLE, Technological (1)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)), for each early confirmation. Option B saves that cost but leaves patients who confirmed days ahead with no reminder the day before.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 3 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules); [03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules); [UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder)

### Q-11 - OI-11

**Question:** OI-11: No rule for a tap on a reminder after reception cancelled or moved the appointment. Where: UC-14 Alternate & Exception Flows; [03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules). Type: Missing scenario.

**Options considered:** OI-11.

- **A.** The tap changes nothing, and the patient is told the current status - safe and clear, at the cost of one short message.
- **B.** The tap changes nothing, and the patient is not told - no message cost, but the patient believes the answer counted.

Recommended Answer: Option A. Add to UC-14: "**E6 - Appointment already cancelled or moved:** At step 4, reception has already cancelled or moved the appointment (UC-11). The system does not change the appointment. It tells the patient the current status: cancelled, or the new date and time." Add to 03 / Reply rules: "A tap on a reminder for an appointment that was cancelled, or moved to another time, changes nothing. The patient is told the current status." Add to UC-14 Acceptance Criteria: "Given reception cancelled the appointment, when the patient taps Confirm on the old reminder, then the appointment stays Cancelled and the patient is told so."

Why: Cancelled is a final status (03 / Figure 1), and the waitlist may already have filled the slot, so a silent reopen would double-book it. Telling the patient matches the link-page rule in UC-15 E3, so both channels behave alike. The tradeoff is one short message for each late tap.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 3 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules)

### Q-12 - OI-12

**Question:** OI-12: Cancelling one of two overbooked appointments offers a slot that is still taken. Where: UC-07 E1; [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 2; UC-11 step 7. Type: Inconsistency.

**Options considered:** OI-12.

- **A.** Offer a cancelled slot only when no other active appointment holds the same doctor, date, and start time - no false offers, and an overbooked cancellation recovers nothing, which is right.
- **B.** Refuse overbooking in UC-07 - no conflict, but goes against how clinics work today (02 / Fact 3).

Recommended Answer: Option A. Add to 03 / Offer rules, rule 2: "A cancellation starts the offers only when no other appointment that is not Cancelled holds the same doctor, date, and start time." Add to UC-11 Acceptance Criteria: "Given two appointments for one doctor at the same date and time, when the receptionist cancels one, then no waitlist offer goes out." Add under 03 / What an appointment holds: "**[NEEDS CLARIFICATION: Do appointments need a length, so that a freed slot goes only to a waitlisted patient whose visit fits? Dental visits can differ in length.]**"

Why: Option A keeps the overbooking proposal, which reflects real practice, and stops the waitlist from creating a double booking. The length question matters most for the dental beachhead ([pre-BRD 21 Roadmap, Target segment](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)), where a short freed visit may not fit a long treatment. The tradeoff is fewer offers from overbooked times, which were never free.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 4 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules)

### Q-13 - OI-13

**Question:** OI-13: A cancellation made by the clinic is treated like a patient's cancellation. Where: [UC-11](./06b-use-cases-receptionist.md#uc-11-change-or-cancel-an-appointment); 03 / Offer rules, rule 2; 03 / Measures; 01 / Business Objective 3. Type: Missing scenario.

**Options considered:** OI-13.

- **A.** Reception marks the cancellation as made by the clinic; no offers go; reception tells the patient by phone; clinic cancellations stay out of Objective 3 and the late-cancellation count - no new message type, at the cost of reception calls.
- **B.** As A, and Clinic Reminders also sends the patient a cancellation message - fewer calls, but one more template to get approved (02 / Constraint 19).
- **C.** Keep one kind of cancellation - no change, but false offers and a distorted Objective 3.

Recommended Answer: Option A. Add to UC-11: "**A3 - The clinic cancels:** At step 3, the receptionist cancels because the doctor or the clinic cannot hold the visit, and marks the cancellation as made by the clinic. At step 6, the system sets the appointment to Cancelled and does not offer the slot to the waitlist. The receptionist tells the patient by phone. **[NEEDS CLARIFICATION: Should Clinic Reminders also send the patient a cancellation message? It needs one more approved WhatsApp template (02 / Constraint 19).]**" Add to 03 / Offer rules, rule 2: "A cancellation made by the clinic starts no offers (UC-11, A3)." Add to 03 / Measures: "Cancellations made by the clinic count in neither the late cancellations nor the refilled slots." Add to 01 / Business Objective 3: "Only cancellations made by patients count."

Why: Offering a slot the doctor cannot hold harms a waitlisted patient and the clinic's trust. The refill target is about patient cancellations that leave a doctor idle ([pre-BRD 01 Concept Sheet, Problem Statement](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)). Option A needs no new template and no new Meta approval before go-live. The tradeoff is reception calls for clinic cancellations; a one-step cancel for a doctor's whole day is a scope proposal in the Reviewer Notes.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 4, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds a new kind of cancellation (made by the clinic) with its own rules, and it changes the measure of Business Objective 3. The source asks for neither. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-13](./13-open-items-and-clarifications.md#oi-13-a-cancellation-made-by-the-clinic-is-treated-like-a-patients-cancellation).

### Q-14 - OI-14

**Question:** OI-14: A waitlist entry never ends on its own. Where: [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules); UC-13; UC-16. Type: Corner case.

**Options considered:** OI-14.

- **A.** End an entry when the patient's own booked visit has passed, and give entries with no booked visit a time limit, as a proposal - a clean list, at the cost of some patients asking again.
- **B.** Keep entries until reception removes them - no new rule, but the list goes stale.

Recommended Answer: Option A. Add a new rule to 03 / Offer rules: "A waitlist entry ends when the patient accepts an offer, when reception removes it (UC-13, A1), when the patient opts out (UC-17), or when the patient's own booked visit with the clinic has passed. **[NEEDS CLARIFICATION: proposed: an entry for a patient with no booked visit ends after 30 days, unless reception renews it; confirm or replace]**" Add to UC-13 Acceptance Criteria: "Given a waitlisted patient whose own visit has passed, when a slot frees up, then the patient gets no offer."

Why: An entry exists to bring a visit forward, so it has no purpose once that visit is past. The 30-day value is only a proposal for the owner. The tradeoff is that a patient who still wants an earlier slot must ask reception again.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 4 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules)

### Q-15 - OI-15

**Question:** OI-15: The BRD does not say whether an opt-out covers one clinic or every clinic on the service. Where: [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 6; UC-17; [07](./07-users-use-cases-matrix.md) footnote ². Type: Ambiguity.

**Options considered:** OI-15.

- **A.** The opt-out covers every message from the sender the patient answered, and records stay separate for each clinic - fits either sender model, at the cost of other clinics seeing the opt-out.
- **B.** Always one clinic only - simple, but with a shared number the patient keeps getting messages from the sender they stopped.
- **C.** Always every clinic - simple, but with clinic numbers one clinic's STOP silences unrelated clinics.

Recommended Answer: Option A. Add to 03 / Consent rules, rule 6: "An opt-out covers every message from the sender that the patient answered. With a sender number for each clinic, it stops that clinic's messages only. With one shared Clinic Reminders number, it stops the messages of every clinic, and each of those clinics' records shows an opt-out by reply, without naming the other clinic. Each clinic keeps its own consent records." Change footnote ² of 07 to: "Own messages only: an opt-out stops the messages from the sender the patient answered (03 / Consent rules, rule 6)."

Why: The patient deals with the sender, not with the list of clinics behind it. Tying the opt-out to the sender honours every opt-out under either model (02 / Constraint 9). Separate records keep the processor model and name no other clinic. The tradeoff is that, with a shared number, a clinic sees an opt-out that the patient gave to another clinic's message.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 4 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)

### Q-16 - OI-16

**Question:** OI-16: A patient who asks reception to stop messages has no path. Where: [UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-consent); UC-17; 03 / Consent rules, rule 6. Type: Missing scenario.

**Options considered:** OI-16.

- **A.** Add an alternate flow to UC-09 so that reception records an opt-out given in person or by phone - closes the gap with no new screen.
- **B.** Tell reception to ask the patient to reply STOP - no change, but the patient may never do it, and the clinic knowingly keeps messaging.

Recommended Answer: Option A. Add to UC-09: "**A3 - Patient stops messages at the desk or by phone:** At step 2, the patient asks the clinic to stop all messages. The receptionist records the opt-out. The system saves it with its time, stops every message to the patient, and handles the patient's waitlist entry as in UC-17." Add to UC-09 Acceptance Criteria: "Given a patient who asks reception to stop messages (A3), when the receptionist records the opt-out, then no further message goes to the patient." Add to 03 / Consent rules, rule 6: "Reception can also record an opt-out that the patient gives at the desk or by phone (UC-09, A3)."

Why: An opt-out counts however the patient gives it, and the clinic will often hear it in person before any STOP reply. Option A reuses the consent record and the effects of UC-17. The tradeoff is one more branch to build and test in UC-09.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 5 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-consent)

### Q-17 - OI-17

**Question:** OI-17: A patient who books by phone cannot give written consent, so gets no reminder. Where: [UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment) Trigger and step 7; UC-09; [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 1. Type: Missing scenario.

**Options considered:** OI-17.

- **A.** Consent link: for a new patient booked away from the desk, the system sends one SMS with a consent link, and the patient agrees on the page - remote patients get reminders, at the cost of one SMS each and a counsel check.
- **B.** Desk only: first visits booked by phone get no reminder, and consent is taken at the first visit - no legal question, but first visits stay unreminded.
- **C.** Reception records spoken consent during the call - simplest, but likely fails the written-consent rule (02 / Constraint 2).

Recommended Answer: Option A. Add to UC-07: "**A2 - Booking away from the desk:** At step 7, the patient booked by phone or on WhatsApp and is not at the desk. The system sends the patient one SMS with a consent link. The patient opens the link, reads the consent text in the message language, and taps Agree. The system records the consent with its time and the source 'consent link'. Until then, no reminder goes, and the day view shows 'no consent' (UC-10, E2). **[NEEDS CLARIFICATION: Counsel to confirm that consent given on the link page counts as written explicit consent (02 / Constraint 2), and that the consent request SMS may go before consent.]**" Change 03 / Consent rules, rule 1 to: "Reception records consent when the patient books, the patient gives it on the consent link page (UC-07, A2), or the import file carries it (UC-09, UC-08)." Add to 08, SMS aggregator row, Information Exchanged: "consent link requests to new patients".

Why: Option A follows the source's "digital explicit consent at booking" and keeps reminders for patients who never stand at the desk before their first visit. SMS needs no WhatsApp opt-in and already carries links (02 / Constraint 17). The tradeoff is one SMS for each new remote patient, at EGP 0.14 to 1.00 a segment ([pre-BRD 03 Lean Canvas, Cost Structure](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)). A legal question must also be settled before go-live.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 5, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds a consent request SMS and a consent link page that the source does not ask for. The counsel question on written consent stays open in 03 / Consent rules, rule 3. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-17](./13-open-items-and-clarifications.md#oi-17-a-patient-who-books-by-phone-cannot-give-written-consent-so-gets-no-reminder).

### Q-18 - OI-18

**Question:** OI-18: Consent records do not show who recorded the consent or where the written proof is. Where: 03 / Consent rules; UC-09 step 4; [UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file) A1 and step 5; UC-04 step 2. Type: Risk.

**Options considered:** OI-18.

- **A.** Add the recorder and the place of the proof to each consent record, and have reception confirm at import that the clinic holds written consent - accountable, at the cost of one more confirmation per import.
- **B.** Treat every imported patient as having no consent until they consent again, for example by the consent link in OI-17 - safest, but delays reminders for the whole imported list at onboarding.
- **C.** Keep the records as they are - no work, but weak proof.

Recommended Answer: Option A. Add to 03 / Consent rules: "Each consent record also holds the staff member who recorded the consent and where the written proof is: a signed form kept at the clinic, the patient's WhatsApp message, the consent link page, or an imported file. For imported consent, the record holds the import date and the receptionist who confirmed it." Change UC-08 step 5 to: "The Receptionist confirms the import, and confirms that the clinic holds written consent for every patient that the file marks with consent." Add to UC-08 Acceptance Criteria: "Given a file that carries consent (A1), when the import completes, then each consent record shows the import date and the receptionist who confirmed it." Add to the list in UC-04 step 2: "the staff member who recorded it, and where the proof is". Add under UC-08 A1: "**[NEEDS CLARIFICATION: Counsel to confirm whether consent taken from an imported file is enough, or whether each imported patient must consent again.]**"

Why: UC-04 exists to prove consent, so each record must point to its proof. The clinic, as controller, keeps the signed forms, and Clinic Reminders, as processor, records where they are (02 / Assumption 25). Option A keeps onboarding fast, and Option B stays open through the counsel marker in case counsel requires it. The tradeoff is a slightly longer import and two more fields in each record.

**Decision record, 2026-10-07 (batch 5):** The product manager accepted the recommended answer. It was not applied: it needs content that rejected OI-17 would have added ("the consent link page" in the list of proof places). (SKILL.md step 8, item 3).

**Decision record, 2026-10-07 (batch 9):** The product manager accepted the adjusted answer, and it was applied. Adjusted answer: The recommended answer without "the consent link page": the proof list reads "a signed form kept at the clinic, the patient's WhatsApp message, or an imported file". Everything else is as recommended. This supersedes the batch 5 record. Carried to the Glossary entry Consent record and to the 09 Consent records row.

**Rule home:** [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)

### Q-19 - OI-19

**Question:** OI-19: Nothing happens when a child patient turns 15. Where: UC-07 A1 and step 6; 03 / Consent rules, rule 4; 02 / Constraint 3. Type: Corner case.

**Options considered:** OI-19.

- **A.** At each new booking of a patient marked under 15, reception confirms that the patient is still under 15; at 15, reception records the patient's own consent - keeps no birth date, at the cost of one question per pediatric booking.
- **B.** Keep the month and year of birth, and let the system flag the patient at 15 - automatic, but keeps more personal data about children.
- **C.** Keep the guardian's consent until reception changes it - no work, but may rest on consent that no longer applies.

Recommended Answer: Option A. Change UC-07 step 6 to: "The system checks the patient's consent record. For a patient marked under 15, it asks the receptionist to confirm that the patient is still under 15." Add to UC-07 A1: "If the patient is now 15 or older, the receptionist removes the mark and records the patient's own consent (UC-09). **[NEEDS CLARIFICATION: Counsel to confirm what happens to a guardian's consent when the patient turns 15, and whether messages may keep going to the guardian's number with the patient's consent.]**"

Why: Option A checks the age at the moment that matters, a new booking. It keeps no birth date, which suits children's data, a sensitive kind of data under the PDPL ([pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). The tradeoff is that reminders for appointments booked before the birthday still go to the guardian.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 5 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment)

### Q-20 - OI-20

**Question:** OI-20: Reception cannot correct a patient's details or remove a patient. Where: UC-07; [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds); 05 / Use Case Summary; 07. Type: Gap.

**Options considered:** OI-20.

- **A.** Add a use case, UC-19 Correct or remove a patient's details, for the Receptionist - one clear home for corrections and removal requests, at the cost of one more use case.
- **B.** Add an alternate flow to UC-07 for corrections only - smaller, but a correction has its own trigger, and removal still has no home.

Recommended Answer: Option A. Apply it after OI-08, whose identity rule this use case uses. Apply these changes:
  - 05 / Use Case Summary, Receptionist group, new row: `| UC-19 | Correct or remove a patient's details | Receptionist | The receptionist corrects a patient's name, mobile number, or message language, or removes a patient who asks to be removed. |`
  - 05 / Receptionist Journey, add: "When a patient's number changes, or a patient asks to be removed, the receptionist corrects or removes the patient's details (UC-19)."
  - 06b, new block:
    - **UC-19: Correct or remove a patient's details.** Primary Actor: Receptionist. Supporting Actors: None. Goal: Keep each patient's details right, and remove a patient who asks to be removed. Trigger: A patient gives a new mobile number or a correction, a message reaches the wrong person, or a patient asks the clinic to delete their details.
    - **Why:** A wrong number sends the clinic's messages to a stranger and leaves the real patient without a reminder (02 / Challenge 4). Patients worry about who sees their number and their appointments ([pre-BRD 05 Empathy Map, Patient](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). The clinic, as controller, must be able to correct and remove its patients' data (02 / Assumption 25).
    - **Preconditions:** The patient is known to the clinic (UC-07 or UC-08).
    - **Main Flow:**
      1. The Receptionist finds the patient by name or mobile number.
      2. The system shows the patient's details, consent status, coming appointments, and any waitlist entry.
      3. The Receptionist corrects the name, the mobile number, or the message language.
      4. The system saves the change.
      5. The system uses the new details for every coming appointment and message of the patient.
    - **Alternate & Exception Flows:**
      - **A1 - New mobile number:** At step 3, the mobile number changes. **[NEEDS CLARIFICATION: proposed: the patient's consent stays, and the receptionist confirms with the patient that messages may go to the new number; confirm or replace]**
      - **A2 - Remove the patient:** At step 3, the patient asks the clinic to delete their details. The system asks the receptionist to confirm. It then cancels the patient's coming appointments, takes the patient off the waitlist, stops every message, and removes the patient's details. **[NEEDS CLARIFICATION: Which records must Clinic Reminders keep after a removal, for example the consent record (02 / Constraint 12) and the activity log (02 / Constraint 7)? Counsel to confirm the patient's rights under the PDPL and their deadlines.]**
      - **E1 - Number shared with another patient:** At step 3, the new number already belongs to another patient of the clinic. The system shows that patient and still saves the change, because several patients can share one number (03 / What an appointment holds).
    - **Business Rules & Constraints:** Only the clinic's own staff can change or remove its patients (10 / NFR-05). Each change and each removal is recorded with the staff member and the time (03 / Staff action log). The cancelled appointments of a removed patient follow 03 / Offer rules, rule 2.
    - **Acceptance Criteria:**
      - [ ] Given a patient with a wrong number, when the receptionist corrects it, then the next reminder goes to the new number.
      - [ ] Given a patient who asks to be removed (A2), when the receptionist confirms, then the patient's coming appointments are cancelled and no message goes to the patient.
      - [ ] Given a new number already used by another patient (E1), when the receptionist saves, then both patients keep their own details and consent records.
    - **Future Enhancements:** None identified at this time.
    - **UI/UX:** Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).
  - 07, new row: `| UC-19 Correct or remove a patient's details | - | Yes | - |`, plus "-" in the Service Team column if OI-03 is accepted.

Why: The Must-have reminders work only when the number is right, so correction belongs to the core scope rather than to a new feature. Removal is a duty of the controller that the processor must support. One use case keeps both under one trigger. The tradeoff is one more use case and a counsel question about what must be kept after a removal.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 6, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds a new use case (UC-19, correct or remove a patient's details) that the source does not ask for. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-20](./13-open-items-and-clarifications.md#oi-20-reception-cannot-correct-a-patients-details-or-remove-a-patient).

### Q-21 - OI-21

**Question:** OI-21: The owner cannot change doctors, fees, or the report choice after setup. Where: UC-01 A1 and step 7; [03 / Doctors and fees](./03-definitions-and-domain-concepts.md#doctors-and-fees); 05 / Use Case Summary; 07. Type: Gap.

**Options considered:** OI-21.

- **A.** Add a use case, UC-20 Change the clinic settings, for the Clinic Owner - one home for every later change, at the cost of one more use case.
- **B.** Add alternate flows to UC-01 - fewer use cases, but each change has its own trigger, so it breaks the rule that a branch with its own trigger becomes its own use case.

Recommended Answer: Option A. Apply these changes:
  - 05 / Use Case Summary, Clinic Owner group, new row: `| UC-20 | Change the clinic settings | Clinic Owner | The owner adds or removes a doctor, changes a fee, changes the owner's WhatsApp number, or starts or stops the weekly report. |`
  - 05 / Clinic Owner Journey, add: "When a doctor joins or leaves, or a fee changes, the owner updates the clinic settings (UC-20)."
  - 06a, new block:
    - **UC-20: Change the clinic settings.** Primary Actor: Clinic Owner. Supporting Actors: None. Goal: Keep the clinic's doctors, fees, and report choice up to date. Trigger: A doctor joins or leaves, a fee changes, the owner's WhatsApp number changes, or the owner wants to start or stop the weekly report.
    - **Why:** The weekly report's fee estimates are right only with current fees (03 / Doctors and fees), and fees rise with inflation ([pre-BRD 08 PESTLE, Economic (1)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). UC-01 A1 already sends the owner to the clinic settings to opt in later.
    - **Preconditions:** The clinic account exists (UC-01).
    - **Main Flow:**
      1. The Clinic Owner opens the clinic settings.
      2. The system shows the doctors with their fees, the owner's WhatsApp number, and the weekly report choice.
      3. The Clinic Owner changes a doctor's fee.
      4. The system saves the new fee. **[NEEDS CLARIFICATION: proposed: a new fee counts from the next report week, and past reports keep the old fee; confirm or replace]**
      5. The system shows the updated settings.
    - **Alternate & Exception Flows:**
      - **A1 - Add a doctor:** At step 3, the owner adds a doctor with the fee. UC-01 E1 and the plan rules in 03 / Subscription and message allowance apply.
      - **A2 - Remove a doctor:** At step 3, the owner removes a doctor. **[NEEDS CLARIFICATION: proposed: the system refuses while the doctor has coming appointments, and lists them so that reception can move or cancel them (UC-11); confirm or replace]**
      - **A3 - Start or stop the weekly report:** At step 3, the owner changes the report choice. The change applies from the next report.
      - **A4 - New WhatsApp number:** At step 3, the owner enters a new number. **[NEEDS CLARIFICATION: proposed: the system sends a code to the new number and saves the number only after the owner enters the code; confirm or replace]**
      - **E1 - Owner replies STOP to the weekly report:** The system stops the weekly report and shows the change in the settings (02 / Constraint 9).
    - **Business Rules & Constraints:** A clinic has 1 to 5 doctors (04 / Project Scope). The weekly report goes only to an owner who opted in (03 / Weekly no-show report). Each change is recorded with the time (03 / Staff action log).
    - **Acceptance Criteria:**
      - [ ] Given a new fee, when the next weekly report is built, then its fee estimates use the new fee.
      - [ ] Given a doctor with coming appointments (A2), when the owner removes the doctor, then the system refuses and lists the appointments.
      - [ ] Given an owner who stops the report (A3), when the next report time comes, then no report is sent.
      - [ ] Given an owner who replies STOP to the report (E1), when the next report time comes, then no report is sent.
    - **Future Enhancements:** None identified at this time.
    - **UI/UX:** Wireframe pending - see global UI/UX standards in [chunk 11](./11-summary-and-uiux.md).
  - 07, new row: `| UC-20 Change the clinic settings | Yes | - | - |`, plus "-" in the Service Team column if OI-03 is accepted.

Why: Doctors and fees change during a subscription, and the report that keeps clinics subscribed ([pre-BRD 03 Lean Canvas, Customer Relationships](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)) is only as good as the fees behind it. The owner's own STOP must also end the report, because every opt-out is honoured. The tradeoff is one more use case and a doctor-removal rule for the owner to confirm.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 6, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds a new use case (UC-20, change the clinic settings) that the source does not ask for. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-21](./13-open-items-and-clarifications.md#oi-21-the-owner-cannot-change-doctors-fees-or-the-report-choice-after-setup).

### Q-22 - OI-22

**Question:** OI-22: The receptionist's sign-in invitation uses a channel that UC-02 and 08 do not name. Where: [UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins) step 6 and Supporting Actors; [08 Integrations](./08-integrations.md); 02 / Dependencies (SMS aggregator row). Type: Inconsistency.

**Options considered:** OI-22.

- **A.** Send invitations by SMS, and name the aggregator in UC-02, 08, and the dependency - works on every phone with no opt-in, at a small SMS cost.
- **B.** Send invitations by WhatsApp - cheaper for each message, but needs an opt-in and an approved template before the first receptionist can sign in.
- **C.** No message: the owner gives the receptionist a one-time code shown on screen - no outside party, but both must be together.

Recommended Answer: Option A. In UC-02, set Supporting Actors to "External: SMS aggregator (08)", and change step 6 to: "The system creates the login and sends the receptionist a sign-in invitation by SMS." In 08, SMS aggregator row, add to Business Purpose: "and send sign-in invitations to staff (UC-02)", and to Information Exchanged: "sign-in invitations". In 02 / Dependencies, change the SMS aggregator row's "Needed before" to "Build of UC-02 and UC-15" (and UC-18 if OI-03 is accepted).

Why: SMS reaches any phone and needs no WhatsApp opt-in, and the registered sender name is already a go-live dependency. Naming the channel keeps UC-02, 08, and the dependency plan in step. The tradeoff is an SMS cost for each invitation and an earlier aggregator contract.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 6 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. The answer's clause "and UC-18 if OI-03 is accepted" was not applied, because OI-03 was rejected (a cross-reference difference only). The accepted step 6 replaces the UC-02 step 6 text, so its proposal marker was removed (Marker register).

**Rule home:** [UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins)

### Q-23 - OI-23

**Question:** OI-23: The day view's call list does not say which appointments need a call. Where: [UC-10](./06b-use-cases-receptionist.md#uc-10-check-the-days-replies) steps 2 to 4, A1, E1, and E2; 02 / Glossary (Reply status). Type: Ambiguity.

**Options considered:** OI-23.

- **A.** Define the call list as: no reply after the reminder, not reached, and no consent or opted out; show "reminder not sent yet" and keep those appointments off the list - calls go where they help.
- **B.** Keep "no reply" only - simplest, but wasted calls and missed patients.

Recommended Answer: Option A. Change UC-10 step 3 to "The Receptionist opens the call list." and step 4 to: "The system shows the call list: appointments whose reminder got no reply, appointments not reached (E1), and appointments with no consent or an opt-out (E2), each with the patient's name and mobile number. Appointments whose reminder has not gone yet show 'reminder not sent yet' and are not on the call list." Change the 02 / Glossary entry "Reply status" to: "Whether the patient confirmed, cancelled, or has not replied, or the reminder has not gone yet." Add to UC-10 Acceptance Criteria: "Given an appointment whose reminder has not gone yet, when the receptionist opens the call list, then the appointment is not on it." and "Given an appointment not reached (E1), when the receptionist opens the call list, then the appointment is on it."

Why: Reception then calls only the patients that a call can help, which is the whole value of the day view for the receptionist and the measure behind Objective 6. The tradeoff is one more status for reception to learn.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 6 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. Carried to text that the call list contradicts: 01 / Business Objective 6, 04 / Project Scope, 05 (Receptionist Journey, Summarized Workflow step 6, Figure 2 node H), 09 / Day view, 10 / NFR-11, and the UC-10 Why and its first no-reply criterion.

**Rule home:** [UC-10](./06b-use-cases-receptionist.md#uc-10-check-the-days-replies)

### Q-24 - OI-24

**Question:** OI-24: The BRD has no rules for plans: who sets them, their doctor limits, and how a clinic changes plan. Where: [03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance); 03 / Doctors and fees; UC-06 Preconditions; UC-01 E1; 04 / In Scope (paid launch). Type: Gap.

**Options considered:** OI-24.

- **A.** Add plan rules to 03: the Service Team records the plan when the account opens (OI-03), a third doctor moves a Starter clinic to the Clinic plan, and each pilot clinic gets a plan at the paid launch - complete, with each value as a proposal.
- **B.** The owner picks and changes the plan in UC-06 - no Service Team step, but the doctor limit and the pilot move still need rules.

Recommended Answer: Option A. Add to 03 / Subscription and message allowance:
  - "There are two plans ([pre-BRD 21 Roadmap, Pricing & packaging](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)): Starter, for 1 to 2 doctors, and Clinic, for 3 to 5 doctors. Prices stay in pre-BRD 21."
  - "The Service Team records a paying clinic's plan when it opens the account (UC-18, A1)."
  - "Pilot clinics pay nothing during the pilot. **[NEEDS CLARIFICATION: proposed: at the paid launch, each pilot clinic gets the plan that fits its number of doctors, and its first payment falls due on 2027-04-01; confirm or replace]**"
  - "A Starter clinic that adds a third doctor moves to the Clinic plan. **[NEEDS CLARIFICATION: proposed: the system shows the owner the new price before it saves the doctor, and the new price applies from the next payment; confirm or replace]** A Clinic plan clinic that goes down to 2 doctors can move to Starter from its next payment."
  - "**[NEEDS CLARIFICATION: Do per-doctor calendars and the per-doctor fee estimates come with every plan, or only with the Clinic plan, as pre-BRD 21 lists them?]**"

  Change the UC-06 precondition to: "The clinic has a plan (UC-18, A1, or 03 / Subscription and message allowance)." Add to UC-01: "**E3 - Third doctor on the Starter plan:** At step 7, the clinic is on the Starter plan and the owner adds a third doctor. The plan rule in 03 / Subscription and message allowance applies."

Why: The plan sets the price, the doctor limit, and the allowance, so without these rules UC-06 cannot bill, and the doctor limit in UC-01 and UC-20 cannot hold. All 15 pilot clinics change status on one day, 2027-04-01, so their move must be planned. The tradeoff is more rules now, with values left for the owner; if OI-03 is not accepted, the owner picks the plan at the first payment (UC-06, step 3).

**Decision record, 2026-10-07 (batch 7):** The product manager accepted the recommended answer. It was not applied: it needs content that rejected OI-03 would have added (the Service Team records the plan, UC-18 A1). (SKILL.md step 8, item 3).

**Decision record, 2026-10-07 (batch 9):** The product manager accepted the adjusted answer, and it was applied. Adjusted answer: The recommended plan rules, with three changes: the owner picks the clinic's plan at the first payment (new UC-06 A3, and the UC-06 precondition reads "The clinic has a plan, or picks one at its first payment (A3)"); "Pilot clinics pay nothing during the pilot" carries "(test-fixture value; owner: product manager)", because a price is a person-only fact; the UC-01 E3 change is not made, because the plan is now picked after setup. This supersedes the batch 7 record. 

**Rule home:** [03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance)

### Q-25 - OI-25

**Question:** OI-25: The BRD does not say which messages use the allowance, how SMS is charged, or where the owner sees usage. Where: 03 / Subscription and message allowance; 02 / Glossary (Message allowance, Top-up); UC-06 A2; [09](./09-reporting-and-analytics.md). Type: Gap.

**Options considered:** OI-25.

- **A.** Count WhatsApp reminders only, charge each fallback SMS on top, and show the owner the month's usage with a warning near the limit - follows pre-BRD 21's wording, and Clinic Reminders bears the cost of the uncounted messages.
- **B.** Count every message to patients - covers the cost fully, but the "600 reminders" sold then covers fewer visits than the owner expects.

Recommended Answer: Option A. Add to 03 / Subscription and message allowance:
  - "The allowance counts WhatsApp reminders, including the visit-day reminder. Waitlist offers, acknowledgements, the opt-out confirmation, and the weekly report do not count."
  - "Each fallback SMS is charged on top of the subscription. **[NEEDS CLARIFICATION: Is the SMS charge at cost, or at cost plus 20%? Pre-BRD 21 states both (pre-BRD 24, OI-16).]**"
  - "**[NEEDS CLARIFICATION: proposed: the owner gets a WhatsApp message when the clinic has used 80% of its monthly allowance; confirm or replace]**"

  Add a row to 09: `| Message use | This month's reminders against the allowance, the fallback SMS sent and their charge, and the top-ups bought | Clinic Owner | Live | Table in the dashboard |`.

Why: Billing and top-ups (UC-06, A2) cannot work without a counting rule, and an owner who cannot see usage finds out only when the allowance runs out. Option A sells exactly what pre-BRD 21 promises. The tradeoff is that offers, acknowledgements, and reports become a cost that Clinic Reminders absorbs, which already weighs on the margin (pre-BRD 24, OI-09).

**Decision record, 2026-10-07:** Rejected by the product manager in batch 7, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds a new report (Message use) and a usage warning message that the source does not ask for. The allowance question stays open in 03 / Subscription and message allowance. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-25](./13-open-items-and-clarifications.md#oi-25-the-brd-does-not-say-which-messages-use-the-allowance-how-sms-is-charged-or-where-the-owner-sees-usage).

### Q-26 - OI-26

**Question:** OI-26: The payment-due notice appears only in the dashboard, which the owner rarely opens. Where: [UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) step 1; 05 / Clinic Owner Journey; UC-01 step 4; 08. Type: Inconsistency.

**Options considered:** OI-26.

- **A.** Send the notice on WhatsApp and show it in the dashboard, widen the UC-01 agreement to account notices, and use SMS for owners who declined WhatsApp - the owner sees it where they already look, at the cost of one more template.
- **B.** Dashboard only - no template, but notices are missed.
- **C.** SMS to every owner - no opt-in needed, but costs more than WhatsApp and differs from the report channel.

Recommended Answer: Option A. Change UC-06 step 1 to: "The system tells the owner on WhatsApp, and in the dashboard, that a payment is due, with the plan and the amount in EGP. **[NEEDS CLARIFICATION: proposed: the notice goes 7 days before the due date; confirm or replace]**" Change UC-01 step 4 to: "The system asks whether the owner agrees to get the weekly no-show report and account notices, such as payments due, on WhatsApp." Add to UC-06: "**A3 - Owner declined WhatsApp:** At step 1, the owner declined WhatsApp messages (UC-01, A1). The system sends the notice by SMS." In 08, add "payment-due notices to owners" to Information Exchanged in the WhatsApp row, and "payment-due notices to owners who declined WhatsApp" in the SMS aggregator row.

Why: The journey makes WhatsApp the owner's channel, so a notice there is the one most likely to be read, and a missed payment can cut reminders for the clinic's patients. The tradeoff is one more approved utility template (02 / Constraint 19) and an SMS route for owners who declined WhatsApp.

**Decision record, 2026-10-07:** Rejected by the product manager in batch 7, by this run's answer policy (reject a recommendation that adds business behaviour the source does not ask for). Rationale: It adds payment-due notices on WhatsApp and by SMS, and widens the owner's opt-in, which the source does not ask for. The dashboard notice stays a proposal in UC-06, step 1. Nothing was applied.

**Rule home:** None: nothing was applied. The full item stays in [13 / OI-26](./13-open-items-and-clarifications.md#oi-26-the-payment-due-notice-appears-only-in-the-dashboard-which-the-owner-rarely-opens).

### Q-27 - OI-27

**Question:** OI-27: UC-06 does not cover a payment that the gateway takes but never confirms. Where: UC-06 step 5 and Alternate & Exception Flows; 08 / Local payment gateway. Type: Missing scenario.

**Options considered:** OI-27.

- **A.** Show the payment as waiting for confirmation, never ask for the same period twice, and have the Service Team check any result that stays unknown - protects the owner, at the cost of a manual check.
- **B.** Let the owner pay again and refund later - simpler, but double charges and refund work.

Recommended Answer: Option A. Add to UC-06: "**E3 - Payment result unknown:** At step 5, the owner has paid, but the gateway has not confirmed the payment. The system shows the payment as waiting for confirmation and does not ask the owner to pay again for the same period. **[NEEDS CLARIFICATION: proposed: if the result is still unknown after 24 hours, the Service Team checks it with the gateway and tells the owner; confirm or replace]**" Add to UC-06 Business Rules: "The owner is never charged twice for the same period or the same top-up. A payment that waits for confirmation does not count as a missed payment." Add to UC-06 Acceptance Criteria: "Given a payment waiting for confirmation (E3), when the owner opens the payment page, then the system shows it as waiting and offers no second payment for that period."

Why: A double charge, or a paid clinic treated as unpaid, costs trust at the moment the paid launch needs it, while a waiting status costs nothing. The tradeoff is a manual check for rare unknown results; if OI-03 is not accepted, the founders do it.

**Decision record, 2026-10-07 (batch 7):** The product manager accepted the recommended answer. It was not applied: it needs content that rejected OI-03 would have added (the Service Team checks an unknown result). (SKILL.md step 8, item 3).

**Decision record, 2026-10-07 (batch 9):** The product manager accepted the adjusted answer, and it was applied. Adjusted answer: The recommended E3, business rule, and acceptance criterion, with "the founders" in place of "the Service Team" in the proposal marker, as the item's own Why allows. This supersedes the batch 7 record. 

**Rule home:** [UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription)

### Q-28 - OI-28

**Question:** OI-28: NFR-07 reports a breach to the regulator but not to the affected clinics. Where: [10 / NFR-07](./10-nfrs.md); 02 / Constraint 5; 02 / Assumption 25. Type: Gap.

**Options considered:** OI-28.

- **A.** Add the notice to clinics to NFR-07, and leave the deadline and the notice to patients to counsel - complete, and honest about the open law.
- **B.** Leave NFR-07 as it is - no change, but clinics learn of a breach late or never.

Recommended Answer: Option A. Change NFR-07 to: Business Expectation: "A personal-data breach is reported to the regulator in time. Every clinic whose patients are affected is told." Business Measure: "The PDPC deadline in 02 / Constraint 5. **[NEEDS CLARIFICATION: By when must Clinic Reminders tell an affected clinic, and must the clinic or Clinic Reminders tell the affected patients? Counsel to confirm under the PDPL.]**"

Why: The processor model in Assumption 25 makes each clinic answerable for its patients' data, so the clinic must hear of a breach. Leaving the deadline to counsel avoids inventing a legal value. The tradeoff is one more legal question to settle before go-live.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 8 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-07)

### Q-29 - OI-29

**Question:** OI-29: No NFR protects patients' answers, including opt-outs, during a disruption. Where: [10 / NFR-01 to NFR-03](./10-nfrs.md). Type: Gap.

**Options considered:** OI-29.

- **A.** Add an NFR that no answer is lost, and that a late answer is applied when the service is back, in the order the patient gave it - a clear business rule, and the SDD decides how.
- **B.** Rely on NFR-03 - simpler, but availability never reaches 100%, so some answers would still be lost.

Recommended Answer: Option A. Add to 10: `| NFR-12 | Safe answers | Every patient answer counts: a Confirm, a Cancel, an Accept, a link-page answer, or an opt-out. An answer that arrives during a disruption is applied when the service is back, in the order the patient gave it. | No answer is lost. No message goes after an opt-out (02 / Constraint 9). **[NEEDS CLARIFICATION: How long after a disruption may an answer wait before it is applied?]** |`

Why: Answers drive every outcome the business measures, and honouring an opt-out is a legal duty, so their safety is a business expectation, not only a technical one. Keeping the patient's order makes a Confirm followed by a Cancel end as Cancelled. The tradeoff is design effort, which the SDD owns.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 8 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-12)

### Q-30 - OI-30

**Question:** OI-30: No NFR covers the confirm-or-cancel link, which opens an appointment with no sign-in. Where: 10 / NFR-05; [UC-15](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link) Business Rules; UC-17 A1. Type: Gap.

**Options considered:** OI-30.

- **A.** Add an NFR for answer links in business terms, and let the SDD decide how - closes the gap with no change to the patient's one-tap answer.
- **B.** Ask patients to sign in on the link page - safer, but breaks NFR-10 (open the link, then one tap).

Recommended Answer: Option A. Add to 10: `| NFR-13 | Safe answer links | Only the person who got a link can use it. A link opens only its own appointment and shows only the reminder content. Nobody can work out another patient's link from their own. A link takes no answer after the visit time (UC-15, E2). | No link can change another patient's appointment or consent. |`

Why: The link is the only way an SMS patient can answer (02 / Constraint 17), so it must be safe without the extra step that NFR-10 rules out. Stating the expectation lets the SDD choose the means. The tradeoff is design effort in the SDD.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 8 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. 

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-13)

### Q-31 - OI-31

**Question:** OI-31: The same open questions and facts are written in several chunks. Where: 01 / Background and Business Objectives 1 and 3; 02 / Facts 1 and 2, Assumptions 21, 23, and 24, and Dependencies; 03 / Waitlist and slot offers; 08 / WhatsApp Business Platform row. Type: Duplication.

**Options considered:** OI-31.

- **A.** Keep each item in one home, and replace every other copy with a short pointer - one answer closes each question everywhere.
- **B.** Keep the copies and update them together - readable in place, but easy to miss one.

Recommended Answer: Option A. Keep each item in the home named here, and replace the other copies with the pointer shown:
  - timed slots: home 02 / Assumption 21; elsewhere "(open question: 02 / Assumption 21)";
  - Ramadan and control group: home 02 / Assumption 23; elsewhere "(open question: 02 / Assumption 23)";
  - licence grant date: home the PDPC licence row of 02 / Dependencies; in Assumption 24, "(open question: 02 / Dependencies, PDPC licence)";
  - sender model: home the WhatsApp row of 08; in 02 / Dependencies, "(open question: 08, WhatsApp Business Platform)";
  - manual or automatic waitlist offers: home 03 / Waitlist and slot offers; in 01, "(open question: 03 / Waitlist and slot offers)";
  - the two facts: home 02 / Facts 1 and 2; in 01 / Background, keep the story and cite "(02 / Facts 1 and 2)" instead of repeating the sentences and their sources.

Why: One fact, one home: a question answered once must close everywhere, and a pointer keeps the context where the reader needs it. The tradeoff is one extra step for readers of 01, who follow a pointer instead of reading the question in place.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 8 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item completes, measures, or fixes behaviour the source already asks for; the reviewer's Why above is the reason. The facts in 01 / Background now cite 02 / Facts 1 and 2.

**Rule home:** [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints); [08 / Integrations](./08-integrations.md#integrations); [03 / Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers); [02 / Facts](./02-glossary-assumptions-facts.md#facts); [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### Q-32 - OI-32

**Question:** OI-32: NFR-08 settles where patient data is kept, while Constraint 6 still asks. Where: [10 / NFR-08](./10-nfrs.md#non-functional-requirements); 02 / Constraints 6 and 15 (raised by consistency check CF-04). Type: Inconsistency.

**Options considered:** OI-32, raised by consistency check CF-04 (Run 1).

- **A.** Word the measure as a condition, and keep the question in Constraint 6 - nothing is decided early; NFR-08 says less until the answer comes.
- **B.** Decide now to keep patient data in Egypt - a clear NFR, but it needs the founders and counsel, and it narrows the SDD.
- **C.** Decide now to keep patient data abroad under a transfer licence - also clear, but it adds a licence and its fee.

Recommended Answer: Option A. Replace the NFR-08 Business Measure with: "If kept in Egypt, only with an NTRA-licensed provider (02 / Constraint 15). If sent abroad, only under a PDPC transfer licence (02 / Constraint 6, with its open question)."

Why: Both constraints and the source are conditional, and the question is still open (TD-05). Option A removes the early decision without making a new one. The tradeoff is a weaker NFR until counsel answers.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 10 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. 

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-08)

### Q-33 - OI-33

**Question:** OI-33: The phase question leaves out subscription billing. Where: [04 / Release phases](./04-scope-and-personas.md#release-phases) (second marker); 04 / In Scope (Paid launch); 03 / Subscription and message allowance; UC-06 Preconditions (raised by consistency check CF-06). Type: Ambiguity.

**Options considered:** OI-33, raised by consistency check CF-06 (Run 1).

- **A.** All three in the paid launch, as pre-BRD 21 says - matches the body; more paid-launch work.
- **B.** All three in Growth - no billing until 2027-10, so no revenue from the paid launch.
- **C.** Billing in the paid launch, the other two in Growth - splits pre-BRD 21's own Q2-2027 row.

Recommended Answer: Option A. Replace the second marker in 04 / Release phases with: "The second reminder, per-doctor calendars, and subscription billing come with the paid launch, as in [pre-BRD 21 Roadmap, Q2-2027](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md). The other Should items come in Growth ([pre-BRD 20 Product Lifecycle, Growth](../../run/pre-brd-clinic-reminders/20-product-lifecycle.md))."

Why: Pre-BRD 21 is the dated plan, and it names exactly these three items. Billing must start at the paid launch for the revenue key result ([pre-BRD 15 OKRs, O3 KR2](../../run/pre-brd-clinic-reminders/15-okrs.md)) and the proposed first payment on 2027-04-01. The tradeoff is more paid-launch work.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 10 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. The answer replaces the phase-conflict marker in 04 / Release phases (Marker register).

**Rule home:** [04 / Release phases](./04-scope-and-personas.md#release-phases)

### Q-34 - OI-34

**Question:** OI-34: Chunk 04 gives the owner rights that three use cases still ask about. Where: [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors), Clinic Owner Access Level; UC-02, UC-04, and UC-05 Primary Actor (raised by consistency check CF-07). Type: Inconsistency.

**Options considered:** OI-34, raised by consistency check CF-07 (Run 1).

- **A.** Confirm the Clinic Owner in all three, and remove the markers - one answer everywhere; the owner does these tasks personally.
- **B.** Keep the markers, and mark these rights in 04 as proposed - keeps the choice open, but 04 then holds proposals too.

Recommended Answer: Option A. Set the Primary Actor cells of UC-02, UC-04, and UC-05 to "Clinic Owner".

Why: The owner holds the only owner login and buys the service, and a receptionist login gives Receptionist access only (UC-02 BR-2). The tradeoff is that the owner does these tasks personally.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 10 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. The answer removes the three Primary Actor proposal markers (Marker register).

**Rule home:** [UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins); [UC-04](./06a-use-cases-clinic-owner.md#uc-04-export-the-consent-records); [UC-05](./06a-use-cases-clinic-owner.md#uc-05-change-the-reminder-timing)

### Q-35 - OI-35

**Question:** OI-35: Chunk 11 names a status filter that no use case has. Where: [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations), Filtration; UC-10 (raised by consistency check CF-08). Type: Inconsistency.

**Options considered:** OI-35, raised by consistency check CF-08 (Run 1).

- **A.** Align chunk 11 with UC-10 - no new behaviour; no status filter for now.
- **B.** Add a status filter to UC-10 - more flexible, but new behaviour that the source does not state.

Recommended Answer: Option A. Replace the Filtration line with: "**Filtration**: Each use case defines its own filters. In the day view: the call list (UC-10, steps 3 and 4) and, from the paid launch, one doctor (UC-10, A3)."

Why: Chunk 11 must not add behaviour that no use case states. The tradeoff is no status filter for now.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 10 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. 

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### Q-36 - OI-36

**Question:** OI-36: UC-03 AC-3 restates a formula that is still a proposal. Where: [UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) Acceptance Criteria, AC-3; [03 / Measures](./03-definitions-and-domain-concepts.md#measures) (raised by consistency check CF-12). Type: Duplication.

**Options considered:** OI-36, raised by consistency check CF-12 (Run 1).

- **A.** Point AC-3 at 03 / Measures - one fact, one home; AC-3 is less self-contained.
- **B.** Confirm the 03 formula now - AC-3 stays as written, but this decides a proposal that TD-23 still asks about.

Recommended Answer: Option A. Replace UC-03 AC-3 with: "Given a doctor's fee and no-shows in the week, when the report is built, then the doctor's estimated lost fees follow the formula in [03 / Measures](./03-definitions-and-domain-concepts.md#measures)."

Why: One fact, one home: the same approach as OI-06. The tradeoff is a less self-contained criterion.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 11 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. 

**Rule home:** [UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report)

### Q-37 - OI-37

**Question:** OI-37: The weekly report needs an approved WhatsApp template that no dependency covers. Where: [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), Meta row; 02 / Assumption 26; 02 / Constraint 19; UC-03 step 2 (raised by consistency check CF-13). Type: Gap.

**Options considered:** OI-37, raised by consistency check CF-13 (Run 1).

- **A.** Add the weekly report to the Meta approvals and to Assumption 26 - one more approval by 2026-12-15.
- **B.** Send the report by SMS - no template, but it loses the read status that Business Objective 4 uses.
- **C.** Leave it as it is - UC-03 cannot send.

Recommended Answer: Option A. In 02 / Dependencies, change the Meta row's Dependency cell to: "Meta business verification, and approval of the reminder, confirmation, waitlist-offer, and weekly-report templates in the utility category". Add to 02 / Assumption 26: "It also approves the weekly report template (02 / Constraint 19)."

Why: Constraint 19 already requires it, and the weekly report is a Must ([pre-BRD 14 MoSCoW, Must (8)](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). The tradeoff is one more approval by 2026-12-15.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 11 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. 

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies); [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints) (Assumption 26)

### Q-38 - OI-38

**Question:** OI-38: Four preconditions rule out flows that their use cases then handle. Where: UC-04, UC-08, UC-13, and UC-17 Preconditions (raised by consistency check CF-19). Type: Inconsistency.

**Options considered:** OI-38, raised by consistency check CF-19 (Run 1).

- **A.** Relax the preconditions - every flow stays reachable and testable.
- **B.** Drop the flows and their criteria - loses checks such as the UC-13 consent check.

Recommended Answer: Option A. UC-04 precondition: "- The clinic account exists (UC-01)." UC-08 second precondition: "- The receptionist has a file of appointments. A row that lacks a detail in [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds) follows E2." UC-13 precondition: "- The patient is known to the clinic (UC-07 or UC-08)." UC-17 precondition: "- The patient has received at least one message from Clinic Reminders, on WhatsApp or by SMS."

Why: A precondition must hold before step 1, so it cannot rule out a flow that the use case handles. The tradeoff is none of note.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 11 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. 

**Rule home:** [UC-04](./06a-use-cases-clinic-owner.md#uc-04-export-the-consent-records); [UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file); [UC-13](./06b-use-cases-receptionist.md#uc-13-add-a-patient-to-the-waitlist); [UC-17](./06c-use-cases-patient.md#uc-17-stop-all-messages)

### Q-39 - OI-39

**Question:** OI-39: Fourteen alternate and exception flows have no acceptance criterion. Where: UC-06 A3; UC-07 E4; UC-10 A1, A2, A3, and E2; UC-14 A2, A3, E2, E3, and E6 for a moved visit; UC-15 E3; UC-16 E1 and E3 (raised by consistency check CF-20). Type: Gap.

**Options considered:** OI-39, raised by consistency check CF-20 (Run 1).

- **A.** Add the criteria now, and test proposals as proposals - every flow can be tested; a criterion on a proposal changes with the answer.
- **B.** Leave them out - fewer criteria to keep up to date, but untested paths.

Recommended Answer: Option A. Add these criteria at the end of each list:
  - UC-06: "Given a clinic with no plan (A3), when the owner makes the first payment, then the owner picks the plan that fits the clinic's number of doctors."
  - UC-07: "Given a visit sooner than the usual reminder time (E4), when the receptionist saves it, then the reminder goes at once (03 / Channel rules)."
  - UC-10: "Given another date (A1), when the receptionist picks it, then the day view shows that date's appointments."; "Given the Growth phase (A2), when the receptionist opens the day view, then each reminder shows its channel and whether it was delivered."; "Given the paid launch (A3), when the receptionist picks one doctor, then only that doctor's appointments show."; "Given an appointment with no consent or an opt-out (E2), when the receptionist opens the call list, then the appointment is on it."
  - UC-14: "Given a confirmed appointment (A2), when the patient taps Cancel on the same reminder before the visit time, then the appointment shows cancelled."; "Given the paid launch (A3), when the visit day comes, then the patient gets a second reminder."; "Given a typed reply (E2), when it arrives, then the appointment status does not change."; "Given a tap after the visit time (E3), when it arrives, then the status does not change and the patient is told that the visit time has passed."; "Given reception moved the appointment, when the patient taps Confirm on the old reminder, then the appointment does not change and the patient is told the new date and time."
  - UC-15: "Given an appointment already confirmed or cancelled (E3), when the patient opens the link, then the page shows the current status."
  - UC-16: "Given another patient accepted first (E1), when the patient taps Accept, then the patient is told that the slot is filled."; "Given an offer that WhatsApp does not deliver (E3), when the offer closes, then no SMS goes to the patient."

Why: Every flow needs a testable criterion, or the UAT/BAT suite leaves it out. The tradeoff is that a criterion on a proposal changes with the answer.

**Decision record, 2026-10-07:** Accepted as recommended and applied. Decided by the product manager in batch 11 of the acceptance loop, by this run's answer policy (accept the recommended answer unless it adds business behaviour the source does not ask for). Rationale: the item fixes or completes text the source already asks for; the Why above is the reason. 

**Rule home:** [06a](./06a-use-cases-clinic-owner.md); [06b](./06b-use-cases-receptionist.md); [06c](./06c-use-cases-patient.md) (Acceptance Criteria of UC-06, UC-07, UC-10, UC-14, UC-15, UC-16)

## Marker register

### Primary color (chunk 11)

**Resolution (2026-10-07):** The product manager gave the key color in batch 1 of the acceptance loop: #0E7C86 (test-fixture value; owner: product manager). The project has no UI/UX constitution, so chunk 11 states the color the user confirmed.

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### Staff action log reader (chunk 09)

**Resolution (2026-10-07):** The proposal "the Clinic Owner reads the staff action log" was settled by the accepted answer to OI-01 (Q-01), which names the Clinic Owner as the reader.

**Rule home:** [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

### UC-07 step 4, returning patient (chunk 06b)

**Resolution (2026-10-07):** The proposal "the system finds a returning patient by mobile number and reuses the patient's details and consent record" was replaced by the accepted step 4 of OI-08 (Q-08): the system shows every patient the clinic knows under that mobile number.

**Rule home:** [UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment)

### UC-02 step 6, sign-in invitation (chunk 06a)

**Resolution (2026-10-07):** The proposal "the system sends the sign-in invitation to the receptionist's mobile number" was replaced by the accepted step 6 of OI-22 (Q-22): the invitation goes by SMS.

**Rule home:** [UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins)

### Release phase of the Should items (chunk 04)

**Resolution (2026-10-07):** The question "Which phase holds for the second reminder and per-doctor calendars?" was settled by the accepted answer to OI-33 (Q-33): the second reminder, per-doctor calendars, and subscription billing come with the paid launch, and the other Should items come in Growth.

**Rule home:** [04 / Release phases](./04-scope-and-personas.md#release-phases)

### Primary Actor of UC-02, UC-04, and UC-05 (chunk 06a)

**Resolution (2026-10-07):** The three proposals "Clinic Owner as Primary Actor" were confirmed by the accepted answer to OI-34 (Q-34).

**Rule home:** [UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins); [UC-04](./06a-use-cases-clinic-owner.md#uc-04-export-the-consent-records); [UC-05](./06a-use-cases-clinic-owner.md#uc-05-change-the-reminder-timing)

### Waitlist removals (chunks 03, 06b, 06c)

**Resolution (2026-10-07):** Three proposals were settled by the applied rule 12 of 03 / Offer rules (OI-14, Q-14), carried by consistency correction CF-01: reception can take a patient off the waitlist (UC-13, A1); an opted-out patient leaves the waitlist (UC-17, A2); an accepted offer ends the waitlist entry (rule 8). The rest of rule 8, a Confirmed appointment for the accepted offer, stays a proposal.

**Rule home:** [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules)

### Not reached, no consent, and opted out in the day view (chunks 03, 06b)

**Resolution (2026-10-07):** Two proposals were settled by the applied call list of UC-10 (OI-23, Q-23), carried by consistency correction CF-01: the day view shows "not reached" (03 / Channel rules) and "no consent" or "opted out" (UC-10, E2), and these appointments are on the call list.

**Rule home:** [UC-10](./06b-use-cases-receptionist.md#uc-10-check-the-days-replies)

### The SMS link (chunk 06c)

**Resolution (2026-10-07):** The proposal "the link opens only this patient's appointment and needs no sign-in" (UC-15, Business Rules) was settled by the applied NFR-13 (OI-30, Q-30) and NFR-10, carried by consistency correction CF-01. NFR-13 also settles that the link page takes no answer after the visit time (UC-15, E2); the rest of E2, what the page says, stays a proposal.

**Rule home:** [UC-15](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link)

## Business review register

No business review has changed this BRD yet.

## Walkthrough and delegation history

The open items were walked through in batches of up to four questions, recommendation first, with the Why in view. The product manager's answers in this test run come from a fixed answer policy: accept the recommended answer, except reject any recommendation that adds business behaviour the source does not ask for; give a person-only fact as a test-fixture value with an owner named. No delegation was given.

| Batch | Questions | Answers |
|-------|-----------|---------|
| 1 | Key color; OI-01, OI-02, OI-03 | Color #0E7C86 (test-fixture value; owner: product manager); OI-01 accepted; OI-02 accepted; OI-03 rejected |
| 2 | OI-04, OI-05, OI-06, OI-07 | OI-04 rejected; OI-05, OI-06, OI-07 accepted |
| 3 | OI-08, OI-09, OI-10, OI-11 | OI-09 rejected; OI-08, OI-10, OI-11 accepted |
| 4 | OI-12, OI-13, OI-14, OI-15 | OI-13 rejected; OI-12, OI-14, OI-15 accepted |
| 5 | OI-16, OI-17, OI-18, OI-19 | OI-17 rejected; OI-16, OI-18, OI-19 accepted |
| 6 | OI-20, OI-21, OI-22, OI-23 | OI-20 and OI-21 rejected; OI-22 and OI-23 accepted |
| 7 | OI-24, OI-25, OI-26, OI-27 | OI-25 and OI-26 rejected; OI-24 and OI-27 accepted |
| 8 | OI-28, OI-29, OI-30, OI-31 | All four accepted |
| 9 | OI-18, OI-24, OI-27 again, with adjusted answers | All three adjusted answers accepted |
| 10 | OI-32, OI-33, OI-34, OI-35 (raised by consistency check Run 1) | All four accepted |
| 11 | OI-36, OI-37, OI-38, OI-39 (raised by consistency check Run 1) | All four accepted |

### Action entries

**First build, 2026-10-07:** Chunks 00 to 12 and the master index were written in one run (whole) from the Clinic Reminders pre-BRD. A cleared-context reviewer wrote chunk 13 with 31 open items. The acceptance loop decided all of them; 22 were applied and 9 rejected. This register was created with the first decisions.

**Consistency check Run 1, 2026-10-07:** A cleared-context checker returned 20 findings (CF-01 to CF-20). Eight mechanical corrections were applied, three findings were covered by rejected items, one fact went to the to-do (TD-09), and eight business ambiguities became OI-32 to OI-39. Those eight were accepted and applied in batches 10 and 11.

**Consistency check Runs 2 and 3, 2026-10-07:** Run 2 (scoped) returned 6 findings (CF-21 to CF-26), all corrected. Run 3 (scoped, the last run of this request) returned 5 findings (CF-27 to CF-31), and CF-32 was found after it. The skill decided these six as mechanical corrections; they wait for the next request (TD-87 to TD-92, Decided - pending application), and their records are written here when they are applied.

## Per-decision ecosystem assessments

None recorded.

<!-- MASTER: clinic-reminders-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
