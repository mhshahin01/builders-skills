<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Clinic Reminders
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every unapplied item carries a concrete Recommended Answer and Why, ready to be applied to the BRD body once the user accepts it. Applied items keep their stable OI heading, Status and Resolution Log pointer; their decision narrative lives in `decision-log.md`.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to its Resolution Log row. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, a Reviewer Note whose choice is needed to finalise the BRD (SKILL.md step 7, Editorial ownership), and a live remainder in a decision or marker record that needs a business choice (a business review point included) can add open items after the first review; a missing fact stays a to-do (TD) item only. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open, Deferred, or Decided - pending application. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Every unapplied item carries a concrete Recommended Answer and Why. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body. An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to its Resolution Log row. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
>
> **What this section is not.** It is not a list of `[NEEDS CLARIFICATION: ...]` markers found inside the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section, UC ID, or "global" if cross-cutting. |
| **Type** | Gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / Duplication (content restated instead of referenced - within the BRD or from source docs). |
| **Concern** | One paragraph. What was missed and why it matters. |
| **Options** | Concrete choices, each with a one-line tradeoff. At least 2 options per item where a choice exists. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply BRD content (the exact rule, step, row, or wording that would close the item). This is what gets injected into the body when you accept. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives: the evidence behind it (source section, stated business expectation, domain practice, risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting your decision) / Decided - pending application (decided on a third-run discovery; the next request applies it) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: Records that the law and the pilot need start only in the Growth phase

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-01](./decision-log.md#q-01---oi-01)

---

### OI-02: Trials and referral credits are neither in scope nor out of scope

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-02](./decision-log.md#q-02---oi-02)

---

### OI-03: A founder takes part in UC-01, but no persona or matrix column covers the founders

- **Where:** [UC-01](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic-account) Preconditions and step 1; [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors); [07 Users & Use Cases Matrix](./07-users-use-cases-matrix.md); 10 / NFR-05
- **Type:** Inconsistency
- **Concern:** The UC-01 precondition names a founder, and the step 1 proposal says "a founder starts the clinic account at the onboarding visit". So a founder acts in the product, but no persona, Supporting Actor entry, or matrix column covers the founders, and the matrix no longer shows everyone who can do what. The gap is wider than UC-01. Nothing says who creates the owner's login, who sets a paying clinic's plan (UC-06 precondition: "The clinic has a plan"), or who reads the pilot results across clinics (OI-04). NFR-05 lets every user see one clinic only, which cannot hold for staff who serve every clinic. [Pre-BRD 03 Lean Canvas, Customer Relationships](../../run/pre-brd-clinic-reminders/03-lean-canvas.md) plans founder-led onboarding and an Arabic WhatsApp support line, so the founders do work inside the service.
- **Options:**
  - **A.** Add a persona, Service Team (the founders and later staff), with one use case, UC-18 Open a clinic account, and a matrix column - matches founder-led onboarding and keeps unknown senders off the service, at the cost of one more persona and a new chunk 06d.
  - **B.** Owner self sign-up: anyone opens a clinic account from a public page, and the founder only helps in person - no new persona, but any sender can message patients through the service, and it goes against founder-led onboarding.
  - **C.** Name "a founder" as a Supporting Actor of UC-01 with no matrix column - least change, but the matrix still hides the founders' access, and the owner login and the plan still have no owner.
- **Recommended Answer:** Option A. Apply these changes:
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
- **Why:** UC-01's own proposal already puts a founder in the flow, and pre-BRD 03 and 21 make founder-led onboarding the sales model. This actor is real and needs a persona and a matrix column. Opening accounts by the team, not by self sign-up, keeps a shared sender safe while the sender model is open (pre-BRD 24, OI-15). The tradeoff is one more persona, chunk, and column, plus a cross-clinic role that NFR-05 must limit.
- **Status:** Rejected (2026-10-07). It adds a persona (Service Team), a use case (UC-18), a new login type, and access rules that the source does not ask for. The pre-BRD names three personas. The founder step in UC-01 stays a proposal for the owner to confirm or replace.

---

### OI-04: No report measures the business objectives during the pilot

- **Where:** [09 Reporting / Analytics](./09-reporting-and-analytics.md); [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) 1, 2, 3, and 5
- **Type:** Gap
- **Concern:** Chunk 01 says Objectives 1, 2, and 3 are measured in the pilot, and Objective 5 (reply rate) is measured for each clinic. Chunk 09 has no report that shows them. The weekly report goes to one owner and shows the no-show rate, the confirmed share, and the refilled slots (03 / Measures). It shows neither the delivery rate (Objective 2) nor the reply rate (Objective 5), and nobody sees the 15 pilot clinics side by side. Any future Go rests on these pilot results ([pre-BRD 22, Conditions 2 and 4](../../run/pre-brd-clinic-reminders/22-executive-summary-scoreboard.md); [pre-BRD 24, OI-07](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)), so the pilot must produce them in a form the founders can read and share.
- **Options:**
  - **A.** Add a "Pilot measures" report for the Service Team (OI-03), clinic by clinic and in total, with counts only - the evidence comes from the product, at the cost of one more report in the MVP.
  - **B.** The founders work out the measures by hand from exports - no build, but slow and error-prone across 15 clinics, and no export holds delivery or reply data.
- **Recommended Answer:** Option A. Add a row to 09: `| Pilot measures | For each pilot clinic and for all pilot clinics together: the no-show rate against the clinic's baseline (Objective 1), the share of reminders delivered, by WhatsApp and by SMS (Objective 2), the share of cancelled slots refilled from the waitlist (Objective 3), and the share of reminders that got a confirm or cancel reply (Objective 5). Counts only, with no patient's details. The Service Team enters each clinic's baseline before go-live. | Service Team | Weekly during the pilot, and on demand | Table in the dashboard, with an export file |`. Add to 01 / Business Objectives, after "Objectives 1, 2, and 3 are measured in the pilot": "The Pilot measures report shows them (09)."
- **Why:** The pilot exists to produce this evidence ([pre-BRD 15 OKRs, O2](../../run/pre-brd-clinic-reminders/15-okrs.md)), and only the product holds the delivery and reply data. Counts with no patient details keep the Service Team out of patient data (OI-03). The tradeoff is one more MVP report; if OI-03 is not accepted, the audience must be named another way.
- **Status:** Rejected (2026-10-07). It adds a new report (Pilot measures) for a Service Team audience that the source does not ask for.

---

### OI-05: Business Objective 4 has a target but no way to tell that an owner read the report

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-05](./decision-log.md#q-05---oi-05)

---

### OI-06: The Glossary and 03 / Measures define the no-show rate in two different ways

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-06](./decision-log.md#q-06---oi-06)

---

### OI-07: Figure 1 does not show all the status changes that the use cases make

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-07](./decision-log.md#q-07---oi-07)

---

### OI-08: "A patient is known by their mobile number" merges family members who share a phone

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-08](./decision-log.md#q-08---oi-08)

---

### OI-09: Patient messages have no quiet hours, and the BRD names no time zone or service hours

- **Where:** [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules); [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules); [10 / NFR-03](./10-nfrs.md)
- **Type:** Gap
- **Concern:** Reminders go 24 hours before the visit, and any cancellation starts waitlist offers at once (03 / Offer rules, rule 2). Clinics run evening lists ("Half my evening list did not come", a hypothesis in [pre-BRD 05 Empathy Map, Clinic owner](../../run/pre-brd-clinic-reminders/05-empathy-map.md)), and Ramadan moves clinic hours later (pre-BRD 24, OI-07). A visit at 23:00 gets its reminder at 23:00 the day before. A Cancel tap at 01:00 sends offers at 01:00, and the offer may close before anyone wakes, so the slot stays empty. Patients are sensitive to unwanted messages (pre-BRD 05, Patient). No chunk says which clock the times use. NFR-03 promises the dashboard "during clinic hours" but names no hours, so it cannot be tested.
- **Options:**
  - **A.** Set one time zone, quiet hours for messages that Clinic Reminders starts, and named dashboard hours, with each value a proposal for the owner - clear and testable, but some reminders move away from exactly 24 hours.
  - **B.** Keep exact timing at all hours - simplest, but night messages, and night offers that expire unseen.
- **Recommended Answer:** Option A. Add to 03 / Channel rules: "All times in Clinic Reminders are Cairo local time." and "Reminders, SMS fallbacks, and waitlist offers do not go in the quiet hours. **[NEEDS CLARIFICATION: proposed: the quiet hours are 22:00 to 08:00; confirm or replace]** A reminder that falls in the quiet hours goes at the next 08:00. An answer to the patient's own tap or reply goes at once." Add a new rule to 03 / Offer rules: "A cancellation in the quiet hours starts the offers at the next 08:00, if the slot is still in the future (rule 6 sets how close to the visit a slot can still be offered)." In 10 / NFR-03, replace "during clinic hours" with "every day, **[NEEDS CLARIFICATION: proposed: from 08:00 to 24:00 Cairo local time; confirm or replace]**".
- **Why:** Evening lists make night messages a normal case, and an offer that nobody sees defeats Objective 3. One time zone fixes what "24 hours before" and "the report week" mean for every clinic, and named hours make NFR-03 testable. The tradeoff is that a reminder for a late visit arrives in the morning of the day before, still well ahead of the visit.
- **Status:** Rejected (2026-10-07). It adds quiet hours, a new sending rule that the source does not ask for. The source sends each reminder at a set time before the visit (pre-BRD 01).

---

### OI-10: An appointment confirmed before its reminder time never gets a reminder

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-10](./decision-log.md#q-10---oi-10)

---

### OI-11: No rule for a tap on a reminder after reception cancelled or moved the appointment

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-11](./decision-log.md#q-11---oi-11)

---

### OI-12: Cancelling one of two overbooked appointments offers a slot that is still taken

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-12](./decision-log.md#q-12---oi-12)

---

### OI-13: A cancellation made by the clinic is treated like a patient's cancellation

- **Where:** [UC-11](./06b-use-cases-receptionist.md#uc-11-change-or-cancel-an-appointment); 03 / Offer rules, rule 2; 03 / Measures; 01 / Business Objective 3
- **Type:** Missing scenario
- **Concern:** UC-11 covers a patient who cancels by phone or at the desk. It does not cover the clinic cancelling a visit, for example when the doctor is ill or the clinic closes for a holiday; Ramadan and Eid change clinic hours (pre-BRD 24, OI-07). UC-11 step 7 then offers the slot to the waitlist, although the doctor cannot see anyone at that time, so a waitlisted patient would accept a visit that will not happen. The patient whose visit the clinic cancelled gets no message from Clinic Reminders, and no reminder either, so they may travel to the clinic for nothing ([pre-BRD 08 PESTLE, Environmental (3)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). These cancellations would also count against the refill target of Objective 3.
- **Options:**
  - **A.** Reception marks the cancellation as made by the clinic; no offers go; reception tells the patient by phone; clinic cancellations stay out of Objective 3 and the late-cancellation count - no new message type, at the cost of reception calls.
  - **B.** As A, and Clinic Reminders also sends the patient a cancellation message - fewer calls, but one more template to get approved (02 / Constraint 19).
  - **C.** Keep one kind of cancellation - no change, but false offers and a distorted Objective 3.
- **Recommended Answer:** Option A. Add to UC-11: "**A3 - The clinic cancels:** At step 3, the receptionist cancels because the doctor or the clinic cannot hold the visit, and marks the cancellation as made by the clinic. At step 6, the system sets the appointment to Cancelled and does not offer the slot to the waitlist. The receptionist tells the patient by phone. **[NEEDS CLARIFICATION: Should Clinic Reminders also send the patient a cancellation message? It needs one more approved WhatsApp template (02 / Constraint 19).]**" Add to 03 / Offer rules, rule 2: "A cancellation made by the clinic starts no offers (UC-11, A3)." Add to 03 / Measures: "Cancellations made by the clinic count in neither the late cancellations nor the refilled slots." Add to 01 / Business Objective 3: "Only cancellations made by patients count."
- **Why:** Offering a slot the doctor cannot hold harms a waitlisted patient and the clinic's trust. The refill target is about patient cancellations that leave a doctor idle ([pre-BRD 01 Concept Sheet, Problem Statement](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)). Option A needs no new template and no new Meta approval before go-live. The tradeoff is reception calls for clinic cancellations; a one-step cancel for a doctor's whole day is a scope proposal in the Reviewer Notes.
- **Status:** Rejected (2026-10-07). It adds a new kind of cancellation (made by the clinic) with its own rules, and it changes the measure of Business Objective 3. The source asks for neither.

---

### OI-14: A waitlist entry never ends on its own

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-14](./decision-log.md#q-14---oi-14)

---

### OI-15: The BRD does not say whether an opt-out covers one clinic or every clinic on the service

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-15](./decision-log.md#q-15---oi-15)

---

### OI-16: A patient who asks reception to stop messages has no path

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-16](./decision-log.md#q-16---oi-16)

---

### OI-17: A patient who books by phone cannot give written consent, so gets no reminder

- **Where:** [UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment) Trigger and step 7; UC-09; [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 1
- **Type:** Missing scenario
- **Concern:** UC-07 starts when "A patient books a visit by phone, on WhatsApp, or at the desk", and patients book by phone or WhatsApp ([pre-BRD 05 Empathy Map, Patient](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). Consent must be written and explicit (02 / Constraint 2) and in place before any message (02 / Constraint 8). The only consent paths are reception recording it (UC-09, where the proposal names "in writing at the desk, or by WhatsApp") and an import file (UC-08). A new patient who books by phone is not at the desk and cannot sign anything. Under UC-07 E3, that patient gets no reminder before the first visit. [Pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md) says to "capture digital explicit consent at booking", and the BRD has no way to do that remotely. The inline marker asks whether a WhatsApp opt-in counts as written consent; it does not cover phone bookings.
- **Options:**
  - **A.** Consent link: for a new patient booked away from the desk, the system sends one SMS with a consent link, and the patient agrees on the page - remote patients get reminders, at the cost of one SMS each and a counsel check.
  - **B.** Desk only: first visits booked by phone get no reminder, and consent is taken at the first visit - no legal question, but first visits stay unreminded.
  - **C.** Reception records spoken consent during the call - simplest, but likely fails the written-consent rule (02 / Constraint 2).
- **Recommended Answer:** Option A. Add to UC-07: "**A2 - Booking away from the desk:** At step 7, the patient booked by phone or on WhatsApp and is not at the desk. The system sends the patient one SMS with a consent link. The patient opens the link, reads the consent text in the message language, and taps Agree. The system records the consent with its time and the source 'consent link'. Until then, no reminder goes, and the day view shows 'no consent' (UC-10, E2). **[NEEDS CLARIFICATION: Counsel to confirm that consent given on the link page counts as written explicit consent (02 / Constraint 2), and that the consent request SMS may go before consent.]**" Change 03 / Consent rules, rule 1 to: "Reception records consent when the patient books, the patient gives it on the consent link page (UC-07, A2), or the import file carries it (UC-09, UC-08)." Add to 08, SMS aggregator row, Information Exchanged: "consent link requests to new patients".
- **Why:** Option A follows the source's "digital explicit consent at booking" and keeps reminders for patients who never stand at the desk before their first visit. SMS needs no WhatsApp opt-in and already carries links (02 / Constraint 17). The tradeoff is one SMS for each new remote patient, at EGP 0.14 to 1.00 a segment ([pre-BRD 03 Lean Canvas, Cost Structure](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)). A legal question must also be settled before go-live.
- **Status:** Rejected (2026-10-07). It adds a consent request SMS and a consent link page that the source does not ask for. The counsel question on written consent stays open in 03 / Consent rules, rule 3.

---

### OI-18: Consent records do not show who recorded the consent or where the written proof is

- **Status:** Adjusted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-18](./decision-log.md#q-18---oi-18)

---

### OI-19: Nothing happens when a child patient turns 15

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-19](./decision-log.md#q-19---oi-19)

---

### OI-20: Reception cannot correct a patient's details or remove a patient

- **Where:** UC-07; [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds); 05 / Use Case Summary; 07
- **Type:** Gap
- **Concern:** UC-07 adds a patient, but no use case changes a patient's name, mobile number, or message language, or removes a patient. Numbers change and families share phones (02 / Challenge 4). A wrong number sends reminders to a stranger, who sees the clinic name and the visit time and can tap Cancel. A message delivered to the wrong phone never triggers the SMS fallback, so the real patient gets nothing. Patients already ask "Who else gets my number and my appointment details?" ([pre-BRD 05 Empathy Map, Patient](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). Each clinic, as controller, must also answer a patient who asks to have their data corrected or deleted, and Clinic Reminders, as processor, must let it (02 / Assumption 25). The BRD has no way to do either.
- **Options:**
  - **A.** Add a use case, UC-19 Correct or remove a patient's details, for the Receptionist - one clear home for corrections and removal requests, at the cost of one more use case.
  - **B.** Add an alternate flow to UC-07 for corrections only - smaller, but a correction has its own trigger, and removal still has no home.
- **Recommended Answer:** Option A. Apply it after OI-08, whose identity rule this use case uses. Apply these changes:
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
- **Why:** The Must-have reminders work only when the number is right, so correction belongs to the core scope rather than to a new feature. Removal is a duty of the controller that the processor must support. One use case keeps both under one trigger. The tradeoff is one more use case and a counsel question about what must be kept after a removal.
- **Status:** Rejected (2026-10-07). It adds a new use case (UC-19, correct or remove a patient's details) that the source does not ask for.

---

### OI-21: The owner cannot change doctors, fees, or the report choice after setup

- **Where:** UC-01 A1 and step 7; [03 / Doctors and fees](./03-definitions-and-domain-concepts.md#doctors-and-fees); 05 / Use Case Summary; 07
- **Type:** Gap
- **Concern:** UC-01 lists the doctors and their fees once, at setup. No use case adds a doctor later, removes one who leaves, or changes a fee. Fees move with inflation (urban inflation 14.5% in August 2026, [pre-BRD 08 PESTLE, Economic (1)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). The weekly report's lost and recovered fee estimates use each doctor's fee (03 / Doctors and fees). The UC-01 A1 proposal says the owner "can opt in later from the clinic settings", but no use case describes those settings. The owner's WhatsApp number, where the report goes, can also change. Nothing says what happens to a removed doctor's coming appointments.
- **Options:**
  - **A.** Add a use case, UC-20 Change the clinic settings, for the Clinic Owner - one home for every later change, at the cost of one more use case.
  - **B.** Add alternate flows to UC-01 - fewer use cases, but each change has its own trigger, so it breaks the rule that a branch with its own trigger becomes its own use case.
- **Recommended Answer:** Option A. Apply these changes:
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
- **Why:** Doctors and fees change during a subscription, and the report that keeps clinics subscribed ([pre-BRD 03 Lean Canvas, Customer Relationships](../../run/pre-brd-clinic-reminders/03-lean-canvas.md)) is only as good as the fees behind it. The owner's own STOP must also end the report, because every opt-out is honoured. The tradeoff is one more use case and a doctor-removal rule for the owner to confirm.
- **Status:** Rejected (2026-10-07). It adds a new use case (UC-20, change the clinic settings) that the source does not ask for.

---

### OI-22: The receptionist's sign-in invitation uses a channel that UC-02 and 08 do not name

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-22](./decision-log.md#q-22---oi-22)

---

### OI-23: The day view's call list does not say which appointments need a call

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-23](./decision-log.md#q-23---oi-23)

---

### OI-24: The BRD has no rules for plans: who sets them, their doctor limits, and how a clinic changes plan

- **Status:** Adjusted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-24](./decision-log.md#q-24---oi-24)

---

### OI-25: The BRD does not say which messages use the allowance, how SMS is charged, or where the owner sees usage

- **Where:** 03 / Subscription and message allowance; 02 / Glossary (Message allowance, Top-up); UC-06 A2; [09](./09-reporting-and-analytics.md)
- **Type:** Gap
- **Concern:** The Glossary defines the allowance as "the number of reminders a monthly subscription includes". Pre-BRD 21 sells "600 WhatsApp reminders a month", with the SMS fallback "at cost" in one row and "at cost plus 20%" in another ([pre-BRD 24, OI-16](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)). The BRD does not say whether the visit-day reminder, waitlist offers, acknowledgements, the opt-out confirmation, or the weekly report count, although Meta charges for each message, replies included (02 / Fact 7). It does not say how a fallback SMS is charged. UC-06 A2 lets the owner buy a top-up, but no report shows how much of the allowance is used, so the owner cannot tell when to buy one. The inline marker asks what happens when the allowance runs out; it does not cover what counts toward it.
- **Options:**
  - **A.** Count WhatsApp reminders only, charge each fallback SMS on top, and show the owner the month's usage with a warning near the limit - follows pre-BRD 21's wording, and Clinic Reminders bears the cost of the uncounted messages.
  - **B.** Count every message to patients - covers the cost fully, but the "600 reminders" sold then covers fewer visits than the owner expects.
- **Recommended Answer:** Option A. Add to 03 / Subscription and message allowance:
  - "The allowance counts WhatsApp reminders, including the visit-day reminder. Waitlist offers, acknowledgements, the opt-out confirmation, and the weekly report do not count."
  - "Each fallback SMS is charged on top of the subscription. **[NEEDS CLARIFICATION: Is the SMS charge at cost, or at cost plus 20%? Pre-BRD 21 states both (pre-BRD 24, OI-16).]**"
  - "**[NEEDS CLARIFICATION: proposed: the owner gets a WhatsApp message when the clinic has used 80% of its monthly allowance; confirm or replace]**"

  Add a row to 09: `| Message use | This month's reminders against the allowance, the fallback SMS sent and their charge, and the top-ups bought | Clinic Owner | Live | Table in the dashboard |`.
- **Why:** Billing and top-ups (UC-06, A2) cannot work without a counting rule, and an owner who cannot see usage finds out only when the allowance runs out. Option A sells exactly what pre-BRD 21 promises. The tradeoff is that offers, acknowledgements, and reports become a cost that Clinic Reminders absorbs, which already weighs on the margin (pre-BRD 24, OI-09).
- **Status:** Rejected (2026-10-07). It adds a new report (Message use) and a usage warning message that the source does not ask for. The allowance question stays open in 03 / Subscription and message allowance.

---

### OI-26: The payment-due notice appears only in the dashboard, which the owner rarely opens

- **Where:** [UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) step 1; 05 / Clinic Owner Journey; UC-01 step 4; 08
- **Type:** Inconsistency
- **Concern:** The UC-06 step 1 proposal shows the due payment "in the dashboard before the due date". The Clinic Owner Journey says that after setup "the owner does not need to sign in every day", and the owner's regular contact with the service is the weekly WhatsApp report. A notice in the dashboard alone will often go unseen. A missed payment then falls under the open non-payment rule (03 / Subscription and message allowance), which may stop reminders to the clinic's patients. UC-01 step 4 asks the owner's agreement for the weekly report only, so a WhatsApp notice about payments has no agreement behind it.
- **Options:**
  - **A.** Send the notice on WhatsApp and show it in the dashboard, widen the UC-01 agreement to account notices, and use SMS for owners who declined WhatsApp - the owner sees it where they already look, at the cost of one more template.
  - **B.** Dashboard only - no template, but notices are missed.
  - **C.** SMS to every owner - no opt-in needed, but costs more than WhatsApp and differs from the report channel.
- **Recommended Answer:** Option A. Change UC-06 step 1 to: "The system tells the owner on WhatsApp, and in the dashboard, that a payment is due, with the plan and the amount in EGP. **[NEEDS CLARIFICATION: proposed: the notice goes 7 days before the due date; confirm or replace]**" Change UC-01 step 4 to: "The system asks whether the owner agrees to get the weekly no-show report and account notices, such as payments due, on WhatsApp." Add to UC-06: "**A3 - Owner declined WhatsApp:** At step 1, the owner declined WhatsApp messages (UC-01, A1). The system sends the notice by SMS." In 08, add "payment-due notices to owners" to Information Exchanged in the WhatsApp row, and "payment-due notices to owners who declined WhatsApp" in the SMS aggregator row.
- **Why:** The journey makes WhatsApp the owner's channel, so a notice there is the one most likely to be read, and a missed payment can cut reminders for the clinic's patients. The tradeoff is one more approved utility template (02 / Constraint 19) and an SMS route for owners who declined WhatsApp.
- **Status:** Rejected (2026-10-07). It adds payment-due notices on WhatsApp and by SMS, and widens the owner's opt-in, which the source does not ask for. The dashboard notice stays a proposal in UC-06, step 1.

---

### OI-27: UC-06 does not cover a payment that the gateway takes but never confirms

- **Status:** Adjusted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-27](./decision-log.md#q-27---oi-27)

---

### OI-28: NFR-07 reports a breach to the regulator but not to the affected clinics

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-28](./decision-log.md#q-28---oi-28)

---

### OI-29: No NFR protects patients' answers, including opt-outs, during a disruption

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-29](./decision-log.md#q-29---oi-29)

---

### OI-30: No NFR covers the confirm-or-cancel link, which opens an appointment with no sign-in

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-30](./decision-log.md#q-30---oi-30)

---

### OI-31: The same open questions and facts are written in several chunks

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-31](./decision-log.md#q-31---oi-31)

---

### OI-32: NFR-08 settles where patient data is kept, while Constraint 6 still asks

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-32](./decision-log.md#q-32---oi-32)

---

### OI-33: The phase question leaves out subscription billing

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-33](./decision-log.md#q-33---oi-33)

---

### OI-34: Chunk 04 gives the owner rights that three use cases still ask about

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-34](./decision-log.md#q-34---oi-34)

---

### OI-35: Chunk 11 names a status filter that no use case has

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-35](./decision-log.md#q-35---oi-35)

---

### OI-36: UC-03 AC-3 restates a formula that is still a proposal

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-36](./decision-log.md#q-36---oi-36)

---

### OI-37: The weekly report needs an approved WhatsApp template that no dependency covers

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-37](./decision-log.md#q-37---oi-37)

---

### OI-38: Four preconditions rule out flows that their use cases then handle

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-38](./decision-log.md#q-38---oi-38)

---

### OI-39: Fourteen alternate and exception flows have no acceptance criterion

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full record in [decision-log.md, Q-39](./decision-log.md#q-39---oi-39)

---

<!-- Applied-item stub: keep the OI heading and anchor, then Status: Accepted - applied / Adjusted - applied, and Resolution: [row](#resolution-log). The Resolution Log row names the rule home in Resolved In; the full decision record is in `decision-log.md`. -->

---

## Resolution Log

<!-- When an open item is decided (accepted or adjusted and applied, deferred, or rejected), add its row here: for an applied item, a pointer to the BRD update (chunk + heading); for a deferred or rejected one, a pointer to its entry above. Keeps the audit trail. -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-10-07 | 04 / In Scope; 03 / Staff action log; 09 / Staff action log | Accepted recommendation |
| OI-02 | 2026-10-07 | 04 / Out of Scope | Accepted recommendation |
| OI-03 | 2026-10-07 | [OI-03 entry above](#oi-03-a-founder-takes-part-in-uc-01-but-no-persona-or-matrix-column-covers-the-founders) | Rejected |
| OI-04 | 2026-10-07 | [OI-04 entry above](#oi-04-no-report-measures-the-business-objectives-during-the-pilot) | Rejected |
| OI-05 | 2026-10-07 | 01 / Business Objective 4; 08 / WhatsApp Business Platform; UC-03 Acceptance Criteria | Accepted recommendation |
| OI-06 | 2026-10-07 | 02 / Glossary (No-show rate); 01 / Business Objective 1 | Accepted recommendation |
| OI-07 | 2026-10-07 | 03 / Appointment lifecycle (Figure 1) | Accepted recommendation |
| OI-08 | 2026-10-07 | 03 / What an appointment holds; UC-07 step 4 | Accepted recommendation |
| OI-09 | 2026-10-07 | [OI-09 entry above](#oi-09-patient-messages-have-no-quiet-hours-and-the-brd-names-no-time-zone-or-service-hours) | Rejected |
| OI-10 | 2026-10-07 | UC-14 Preconditions; 03 / Reply rules; 03 / Channel rules | Accepted recommendation |
| OI-11 | 2026-10-07 | UC-14 E6 and Acceptance Criteria; 03 / Reply rules | Accepted recommendation |
| OI-12 | 2026-10-07 | 03 / Offer rules, rule 2; 03 / What an appointment holds; UC-11 Acceptance Criteria | Accepted recommendation |
| OI-13 | 2026-10-07 | [OI-13 entry above](#oi-13-a-cancellation-made-by-the-clinic-is-treated-like-a-patients-cancellation) | Rejected |
| OI-14 | 2026-10-07 | 03 / Offer rules, rule 12; UC-13 Acceptance Criteria | Accepted recommendation |
| OI-15 | 2026-10-07 | 03 / Consent rules, rule 6; 07, footnote 2 | Accepted recommendation |
| OI-16 | 2026-10-07 | UC-09 A3 and Acceptance Criteria; 03 / Consent rules, rule 6 | Accepted recommendation |
| OI-17 | 2026-10-07 | [OI-17 entry above](#oi-17-a-patient-who-books-by-phone-cannot-give-written-consent-so-gets-no-reminder) | Rejected |
| OI-18 | 2026-10-07 | 03 / Consent rules, rule 9; UC-08 step 5, A1 and Acceptance Criteria; UC-04 step 2 | Adjusted: the consent link page left out of the proof list, because OI-17 was rejected |
| OI-19 | 2026-10-07 | UC-07 step 6 and A1 | Accepted recommendation |
| OI-20 | 2026-10-07 | [OI-20 entry above](#oi-20-reception-cannot-correct-a-patients-details-or-remove-a-patient) | Rejected |
| OI-21 | 2026-10-07 | [OI-21 entry above](#oi-21-the-owner-cannot-change-doctors-fees-or-the-report-choice-after-setup) | Rejected |
| OI-22 | 2026-10-07 | UC-02 Supporting Actors and step 6; 08 / SMS aggregator; 02 / Dependencies | Accepted recommendation |
| OI-23 | 2026-10-07 | UC-10 steps 3 and 4 and Acceptance Criteria; 02 / Glossary (Reply status) | Accepted recommendation |
| OI-24 | 2026-10-07 | 03 / Subscription and message allowance; UC-06 Preconditions and A3 | Adjusted: the owner picks the plan at the first payment (UC-06, A3) instead of a Service Team, because OI-03 was rejected; the pilot price is marked as a test-fixture value; the UC-01 E3 change is not made |
| OI-25 | 2026-10-07 | [OI-25 entry above](#oi-25-the-brd-does-not-say-which-messages-use-the-allowance-how-sms-is-charged-or-where-the-owner-sees-usage) | Rejected |
| OI-26 | 2026-10-07 | [OI-26 entry above](#oi-26-the-payment-due-notice-appears-only-in-the-dashboard-which-the-owner-rarely-opens) | Rejected |
| OI-27 | 2026-10-07 | UC-06 E3, Business Rules and Acceptance Criteria | Adjusted: the founders, not a Service Team, check an unknown payment result, because OI-03 was rejected |
| OI-28 | 2026-10-07 | 10 / NFR-07 | Accepted recommendation |
| OI-29 | 2026-10-07 | 10 / NFR-12 | Accepted recommendation |
| OI-30 | 2026-10-07 | 10 / NFR-13 | Accepted recommendation |
| OI-31 | 2026-10-07 | 01 / Background and Business Objectives; 02 / Assumptions 21, 23, 24 and Dependencies; 03 / Waitlist and slot offers; 08 | Accepted recommendation |
| OI-32 | 2026-10-07 | 10 / NFR-08 | Accepted recommendation |
| OI-33 | 2026-10-07 | 04 / Release phases | Accepted recommendation |
| OI-34 | 2026-10-07 | UC-02, UC-04, and UC-05 Primary Actor | Accepted recommendation |
| OI-35 | 2026-10-07 | 11 / UI/UX Expectations (Filtration) | Accepted recommendation |
| OI-36 | 2026-10-07 | UC-03 Acceptance Criteria (AC-3) | Accepted recommendation |
| OI-37 | 2026-10-07 | 02 / Dependencies (Meta row); 02 / Assumption 26 | Accepted recommendation |
| OI-38 | 2026-10-07 | UC-04, UC-08, UC-13, and UC-17 Preconditions | Accepted recommendation |
| OI-39 | 2026-10-07 | Acceptance Criteria of UC-06, UC-07, UC-10, UC-14, UC-15, and UC-16 | Accepted recommendation |

---

## Reviewer Notes

<!-- Coverage record (required): one row per major risk area. Checked: what the reviewer checked. Findings: the number of open items raised, with their IDs, or "No issue found". A risk area with no issue is a valid result. An area the reviewer could not check says "Not checked" and why. -->

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Every In Scope and Out of Scope item against pre-BRD 14 MoSCoW, the phases in pre-BRD 20 and 21, the pricing in pre-BRD 21, and the use cases | 3 (OI-02, OI-24, OI-25) | Three scope proposals below |
| Use-case exception coverage | Each actor decision and each step with an outside party in UC-01 to UC-17, for a branch or a failure | 11 (OI-10, OI-11, OI-12, OI-13, OI-14, OI-16, OI-17, OI-19, OI-23, OI-26, OI-27) | Missing use cases are counted under Matrix consistency and Data lifecycle |
| Matrix consistency | Every Primary and Supporting Actor, and every actor named in a flow, against the 07 columns; every persona has use cases; outside parties are not columns | 2 (OI-03, OI-22) | The 17 rows match their actor fields as written. OI-20 and OI-21 each add one row |
| NFRs | Each NFR for a business measure, and qualities with no NFR | 4 (OI-09, OI-28, OI-29, OI-30) | NFR-03, NFR-04, and NFR-09 already carry open markers |
| Integrations | Each 08 row against the use cases that use it, and each partner's failure as the user sees it | 4 (OI-05, OI-22, OI-26, OI-27) | A WhatsApp failure or sending limit already falls back to SMS, and a double failure shows "not reached" (03 / Channel rules); no extra item |
| Security / privacy | Patient identity, consent proof, opt-outs, access with no sign-in, breach notice, and staff who serve every clinic | 7 (OI-03, OI-08, OI-15, OI-18, OI-20, OI-28, OI-30) | |
| Data lifecycle | Records needed from go-live, retention, waitlist entries, corrections and removals, and a clinic that leaves | 4 (OI-01, OI-14, OI-20, OI-21) | Retention and clinic exit are already open in NFR-09; an exit export is a scope proposal below |
| Multi-tenancy | Rules that change when many clinics share the service: opt-outs, staff across clinics, the shared sender | 2 (OI-03, OI-15) | Shared quality rating: see the notes below |
| Regulatory and compliance | 02 / Constraints 1 to 20 against the use cases and NFRs | 6 (OI-01, OI-16, OI-17, OI-18, OI-19, OI-28) | |
| Conflicts between sections | Facts, definitions, and figures that two chunks state | 5 (OI-06, OI-07, OI-08, OI-12, OI-26) | |
| Technical language | Chunks 00 to 11 for technology names, protocols, and design terms | No issue found | Technical source text sits only in 12 / Technical Inputs for the SDD |
| Duplication | One fact or question in two chunks, and source text restated instead of cited | 1 (OI-31) | |
| Plain language | Vague words that hide a requirement, and long sentences | 1 (OI-09: "during clinic hours") | Editorial points below |

<!-- Optional new scope: label Scope proposal here with source, recommendation and tradeoff; not a blocking Open OI until owner-adopted. Required gaps keep the normal OI schema. -->

- **Scope proposal: a clinic leaves the service.** Source: 02 / Assumption 25 (each clinic is the controller of its patients' data); [pre-BRD 15 OKRs, O3 KR3](../../run/pre-brd-clinic-reminders/15-okrs.md) (a monthly churn target, so clinics will leave); the open marker in NFR-09. Recommendation: once NFR-09 is answered, add a Service Team use case that closes a clinic account, and let the owner export the clinic's patients, appointments, and consent records before it closes. Tradeoff: one more use case and one more export, against a leaving clinic having no way to take its own data.
- **Scope proposal: cancel a doctor's whole day.** Source: OI-13; Ramadan and Eid clinic hours ([pre-BRD 24, OI-07](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)). Recommendation: a Future Enhancement of UC-11 that cancels all of one doctor's appointments on one date in one step, as clinic cancellations, after the receptionist types the date to confirm. Tradeoff: saves many single cancellations, but a bulk cancel needs a strong confirmation step.
- **Scope proposal: automatic renewal.** Source: UC-06 (the owner pays by hand each period); [pre-BRD 15 OKRs, O3 KR3](../../run/pre-brd-clinic-reminders/15-okrs.md) (monthly churn at or below 3%). Recommendation: once the payment gateway is chosen (08), consider letting the owner save a payment method so that each renewal is charged automatically. Tradeoff: fewer missed payments, but it depends on the gateway's payment methods and adds payment rules.

- New use case IDs: OI-03, OI-20, and OI-21 propose UC-18, UC-19, and UC-20, in that order. If they are accepted in another order, or not all of them, each new use case takes the next free ID.
- Sender model marker (02 / Dependencies and 08): add one consequence that pre-BRD 24, OI-15 names. With one shared number, all clinics share one WhatsApp quality rating, so one clinic's poor practice can limit sending for every clinic.
- Phase marker in 04 / Release phases: it names only the second reminder and per-doctor calendars, but the same pre-BRD 20 and 21 conflict covers subscription billing. Extend the marker, or state that billing follows pre-BRD 21, because the revenue target ([pre-BRD 15 OKRs, O3 KR2](../../run/pre-brd-clinic-reminders/15-okrs.md)) needs billing from 2027-04-01.
- UC-03 Business Rules cite "UC-01, BR-2", but UC-01's rules have no numbers. Write "(UC-01, Business Rules)".
- Typed replies (03 / Reply rules proposal) may hold health details that the patient chose to write. Add typed replies to the list in the NFR-09 retention marker.
- Fallback SMS length: the SMS repeats the reminder content and adds a link, and an Arabic SMS over 70 characters is billed as two segments (12 / Technical Inputs for the SDD; [pre-BRD 08 PESTLE, Technological (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). Keep this in mind when the owner confirms the content proposal in 03 / Message content.
- Footnote ¹ of 07 says "Own appointments only". For a guardian, "own" means the appointments of the guardian's children; say so in the footnote.
- Editorial, 02 / Constraint 1: the marker packs five questions into one block. Simpler: five short questions, one each for the licence type, how records are counted, the fee tier, a licence for each clinic, and the portal status.
- Editorial, UC-14 E1 and the UC-15 Trigger say "not delivered in time". Until the SMS wait is set (03 / Channel rules marker), write "not delivered within the SMS wait (03 / Channel rules)", so the open value has one home.
- This review borrowed no standard from the user's global defaults. The two labelled proposals in chunk 11 (Data Tables, Accessibility) were left as they are.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
