<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Clinic Reminders
VERSION: 1.1
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Clinic Reminders
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the BRD body once the user accepts it.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and the Changes Log is bumped. Deferred and rejected items get a Resolution Log row too.
REGISTER: When an item is accepted and applied, the decision narrative (the question, options, choice, date, rationale) is recorded in `decision-log.md`, the companion register, with a `Rule home:` link to the section now carrying the settled rule. This chunk keeps only the item's current status line and the Resolution Log row; no decision storytelling here or in the body chunks.
LATER ITEMS: The consistency check (14-todo.md step 2) and the writing of chunks 15-17 can add open items after the first review. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open or Deferred. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body.
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
| **Status** | Open (awaiting your decision) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: The PDPC licence gate is tied to the first message, not the first patient record

- **Where:** 01 Business Objectives (BO-04); 02 Dependencies (PDPC licence row); 02 Assumptions / Constraints (Constraint 6); UC-07 and UC-08 Preconditions
- **Type:** Inconsistency
- **Concern:** BO-04 and the Dependencies row say the PDPC licence is held "before the first patient message". Constraint 6 ties the licence to handling health and children's data, not to messaging. Handling starts earlier: when the receptionist enters or imports patients' names, mobile numbers, and appointments with a named specialist (UC-07, UC-08). To remind patients of the first pilot visits on 2027-02-01 (BO-05), clinics must load those appointments before the first reminder goes out. So patient data can sit in the product without the licence while BO-04 still reads as met. In pediatric clinics this data is about children, which Constraint 6 treats as sensitive, whatever the PDPC decides about appointment details.
- **Options:**
  - **A.** Tie the gate to the first patient record entered or imported - matches Constraint 6, but pilot onboarding waits for the licence.
  - **B.** Keep "first patient message" - more time to get the licence, but patient data is handled without it.
- **Recommended Answer:** Option A. In chunk 01, BO-04, Measure, replace "The licence is held before the first patient message." with "The licence is held before the first patient record is entered or imported (UC-07, UC-08)." In chunk 02, Dependencies, PDPC licence row, Notes, replace "Held before the first patient message (BO-04)." with "Held before the first patient record is entered or imported (BO-04)." Keep the existing clarification marker in that row as it is. In UC-07 and UC-08, Preconditions, add "Clinic Reminders holds the PDPC licence (chunk 02, Dependencies)."
- **Why:** Constraint 6 makes the licence a condition for handling the data, and the pilot timeline puts data entry before the first message. The tradeoff is a tighter January 2027: no clinic can import until the licence is granted.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-02: The WhatsApp gate leaves out the weekly report template

- **Where:** 01 Business Objectives (BO-02); 02 Assumptions / Constraints (Assumption 3); UC-03 step 2; UC-15 step 6
- **Type:** Inconsistency
- **Concern:** BO-02 sets the WhatsApp gate as "the reminder, confirmation, and waitlist templates approved ... by 2026-12-15". Assumption 3 names four service templates: reminder, confirmation, slot offer, and weekly report. The weekly report is an MVP message that the system starts every week (UC-03, step 2), so it needs an approved template too. BO-02 can be met while the report has none, and UC-03 then fails in the pilot. UC-15 step 6 also tells patients who never answered an offer that the slot is filled. The BRD does not say whether that notice needs its own template.
- **Options:**
  - **A.** Align BO-02 with Assumption 3 and ask about the slot-filled notice - a complete gate, one more template in the December window.
  - **B.** Keep BO-02 and approve the report template later - less work before December, but UC-03 may not run in the pilot.
- **Recommended Answer:** Option A. In chunk 01, BO-02, Measure, replace the text with "WhatsApp business verification complete, and the reminder, confirmation, slot offer, and weekly report templates approved as service (utility) templates by 2026-12-15. **[NEEDS CLARIFICATION: Does the notice that a slot is filled (UC-15, step 6) need its own approved template?]**"
- **Why:** Assumption 3 already counts the weekly report as a service template, and UC-03 serves BO-13 from the pilot onward. The tradeoff is one more template to approve by 2026-12-15.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-03: Chunk 01 restates facts that live in chunk 02 and in the pre-BRD

- **Where:** 01 Background and Context ("Why it matters", "Market context", "Pre-BRD verdict"); 02 Facts 1 and 6, Challenge 1; 02 Assumption 3 and Constraint 8
- **Type:** Duplication
- **Concern:** Several facts have two homes. "Why it matters" in chunk 01 restates three items from chunk 02, each with its own pre-BRD links. They are Fact 1 (an empty slot is lost cash), Fact 6 (reminders raise attendance), and Challenge 1 (no local baseline). Inside chunk 02, Assumption 3 and Constraint 8 both say that a promotional message is billed as marketing. "Market context" restates a competitor claim ("None of the five products compared ... offers automatic waitlist refill or automatic SMS fallback"). The pre-BRD's own review still questions that claim (pre-BRD OI-08 and OI-13, both Open). "Pre-BRD verdict" restates the verdict, although market claims and verdicts are meant to stay in the pre-BRD and be cited by link. When one copy changes, the other goes stale.
- **Options:**
  - **A.** One home per fact: chunk 02 holds the facts, and chunk 01 links to chunk 02 and the pre-BRD - no drift, but chunk 01 reads thinner.
  - **B.** Fix the facts and the market claim, but keep the verdict word - readers see the No-Go at once, but one verdict stays restated.
  - **C.** Keep every copy - an easier first read, but each change must be made twice.
- **Recommended Answer:** Option A. In chunk 01, replace the "Why it matters" paragraph with "**Why it matters.** Published studies show that no-shows are common and that forgetting is a leading cause ([pre-BRD 10 EFAS, O1](../pre-brd-clinic-reminders/10-efas.md)). The cost of an empty slot, the evidence that reminders raise attendance, and the missing local baseline are in chunk 02 (Facts 1 and 6, Challenge 1)." In "Market context", replace the second sentence with "The competitor comparison is in [pre-BRD 06 Market Comparison](../pre-brd-clinic-reminders/06-market-comparison.md)." In "Pre-BRD verdict", replace the first sentence with "The pre-BRD's go / no-go verdict and its conditions are in [pre-BRD 22 Executive Summary Scoreboard](../pre-brd-clinic-reminders/22-executive-summary-scoreboard.md) and [pre-BRD 23 Investor Assessment](../pre-brd-clinic-reminders/23-investor-assessment.md)." In chunk 02, change the last sentence of Assumption 3 to "A message judged promotional, including one that mixes service and promotion, is billed at the much higher marketing rate." Then delete the last sentence of Constraint 8.
- **Why:** The BRD's rule is one fact, one home. The competitor claim is still under review in the pre-BRD, so a copy in the BRD can turn wrong unnoticed. The tradeoff is that chunk 01 sends readers elsewhere for the evidence.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-04: "Confirmed share" counts messages, not appointments

- **Where:** 03 Weekly no-show report measures (Confirmed share); UC-04; UC-14; 09 Weekly no-show report row
- **Type:** Ambiguity
- **Concern:** The measure is "Appointments confirmed by the patient, divided by reminders sent". The denominator counts messages, and one appointment can get two or three. A WhatsApp reminder that is not delivered is followed by the SMS fallback (UC-14). From the paid launch, a visit-day reminder can follow too (UC-04). The share then falls when a clinic turns on the visit-day reminder, or when more patients need SMS, although no fewer patients confirmed. The owner reads the report to see whether the clinic is improving (chunk 05, Clinic Owner Journey). So the measure misleads exactly when the clinic changes its settings.
- **Options:**
  - **A.** Count appointments: confirmed appointments divided by appointments that got at least one reminder - stable when channels or reminder counts change.
  - **B.** Count messages, and say how visit-day reminders and SMS are counted - matches message costs, but the share moves for reasons other than patient behaviour.
- **Recommended Answer:** Option A. In chunk 03, Weekly no-show report measures, Confirmed share, replace the Meaning with "Appointments confirmed by the patient, divided by appointments that got at least one reminder".
- **Why:** The report measures whether patients keep or free their visits (UC-03, Goal), so the unit is the appointment. Option A also keeps the share comparable across the paid-launch change in UC-04. The tradeoff is that message volumes leave the report; they stay visible in message status (UC-12, A3).
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-05: Appointment statuses are defined in several places that disagree

- **Where:** 03 Appointment, Lifecycle; UC-15 step 4; UC-12 step 2; 09 Day's list row; UC-13 E1, UC-14 E1, UC-15 A2, UC-16 step 5
- **Type:** Inconsistency
- **Concern:** There are two kinds of drift. First, chunk 03 says an accepted slot "becomes a new Booked appointment", while UC-15 step 4 proposes Confirmed. Chunk 03 states its version as settled, so the two will disagree whichever way UC-15 is decided. Second, the statuses on the day's list appear in at least seven places. UC-12 step 2 names five, and chunk 09 adds attended and no-show. UC-13 E1, UC-14 E1, UC-15 A2, and UC-16 step 5 each add a flag of their own: free-text reply, not reached, open slot, and opted out. A designer or tester cannot tell which list is complete.
- **Options:**
  - **A.** One home each: chunk 03 points to UC-15 for the accepted-offer status, and UC-12 holds the one list of statuses - no drift, one more link.
  - **B.** Keep the lists where they are and keep them in step by hand - no restructuring, but they drift again.
- **Recommended Answer:** Option A. In chunk 03, Appointment, Lifecycle, replace "A cancelled slot that a waitlisted patient accepts becomes a new Booked appointment for that patient (UC-15)." with "A cancelled slot that a waitlisted patient accepts becomes a new appointment for that patient, with the status UC-15 sets." In UC-12, Business Rules, add "Day's list statuses: confirmed, cancelled, no reply yet, no consent, refilled from the waitlist, attended, and no-show. The flags proposed in UC-13 E1, UC-14 E1, UC-15 A2, and UC-16 step 5 join this list when they are confirmed." In UC-12, replace step 2 with "The system shows the day's appointments in time order, each with its status (Business Rules)." In chunk 09, Day's list row, What It Shows, replace the status list with "Each appointment with its status (UC-12, Business Rules)".
- **Why:** UC-12 is where the day's list is specified. UC-15 step 4 is where the accepted-offer status is still being decided, so pointing there leaves that proposal open. The tradeoff is one more link for readers of chunks 03 and 09.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-06: No rule on whether Clinic Reminders staff see a clinic's patients

- **Where:** 04 Personas / Actors; 07 Notes; 10 NFR-05; decision-log.md Q-01; UC-01 Trigger; 09 Pilot and business metrics row
- **Type:** Inconsistency
- **Concern:** Decision Q-01 added no persona for Clinic Reminders staff "because the pre-BRD names no system use by internal staff". The pre-BRD does name it. Its key activities include "onboard clinics (import, templates, consent)", and its customer relationships include "an Arabic WhatsApp support line" ([pre-BRD 03 Lean Canvas](../pre-brd-clinic-reminders/03-lean-canvas.md)). The BRD itself puts a founder at the onboarding visit (UC-01, Trigger) and gives founders the cross-clinic pilot metrics (chunk 09). Yet NFR-05 says only the clinic's own staff see its patients, and the matrix gives import only to the receptionist. Nothing says whether a founder may see patient data while helping with an import or a support question. In practice the gap gets filled by borrowing a receptionist login, which UC-02 proposes to forbid.
- **Options:**
  - **A.** Keep three personas and add the rule that Clinic Reminders staff never see a clinic's patient details - keeps NFR-05 strict, but support is slower.
  - **B.** Add a fourth persona, Clinic Reminders Support, with logged access only while the owner allows it - easier support, but a new column and use case, and more legal exposure.
- **Recommended Answer:** Option A. In chunk 07, Notes, add "Clinic Reminders staff never see a clinic's patient names, mobile numbers, appointments, or consent records. During the onboarding visit, the founder guides while the clinic's own staff enter and import the data (UC-07, UC-08)." In chunk 10, NFR-05, Business Measure, after "No clinic sees another clinic's patients." add "Clinic Reminders staff see no clinic's patients." In UC-12, Business Rules, add "**[NEEDS CLARIFICATION: In the pilot, before message status (A3) exists, how does the clinic find out whether one patient's reminder went out?]**" In decision-log.md, under Q-01, record that the pre-BRD does name internal use (onboarding import, support line) and that the three-persona decision stands with this rule.
- **Why:** Owners fear liability for patient data (pre-BRD 04), and patients ask who else gets their details (pre-BRD 05). A strict NFR-05 is part of what the clinic buys, and in-person onboarding lets the receptionist import with the founder beside them. The tradeoff is slower support: no one outside the clinic can look up a single patient's message.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-07: The owner cannot do reception work in a clinic without a receptionist

- **Where:** 07 Users & Use Cases Matrix (UC-07 to UC-11); 04 Personas / Actors (Clinic Owner, Access Level); UC-01 Acceptance Criteria; UC-02 E1
- **Type:** Gap
- **Concern:** The matrix gives the owner no access to UC-07 to UC-11. The owner cannot book, import, record consent, change an appointment, or add a patient to the waitlist. The pre-BRD's early adopters are "owner-doctors of 1 to 2 doctor dental and dermatology clinics ... who already message patients from a personal WhatsApp" ([pre-BRD 03 Lean Canvas](../pre-brd-clinic-reminders/03-lean-canvas.md), Customer Segments). In exactly these clinics the owner does reception work, at least when the assistant is away. UC-01 marks a clinic ready without any receptionist login. If UC-02 E1's proposal holds (one login per mobile number), the owner cannot open a receptionist login on their own number either. A clinic with no receptionist can be set up but cannot book a single appointment.
- **Options:**
  - **A.** The owner can also do UC-07 to UC-11 - fits the early adopters, and adds no data access, since the owner already sees every patient (UC-12).
  - **B.** A clinic needs at least one receptionist login before it shows as ready - keeps the owner an administrator, but a solo owner-doctor needs a second login.
- **Recommended Answer:** Option A. In chunk 07, set the Clinic Owner cell for UC-07, UC-08, UC-09, UC-10, and UC-11 to "Yes³". Add the footnote "³ The owner can also do the receptionist's work, for example in a clinic with no receptionist." UC-12 keeps footnote ¹. In chunk 04, Personas, Clinic Owner, Access Level, add "; can also enter appointments, record consent, and manage the waitlist (UC-07 to UC-11)". In UC-07 to UC-11, Supporting Actors, add "Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³)".
- **Why:** The target early adopter is the owner-doctor who reminds patients in person (pre-BRD 03). The owner already sees each patient's name and number on the day's list, so option A widens no data access. The tradeoff is a blurred line between owner and receptionist duties; the staff activity log (UC-05) still shows who did what.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-08: No flow for changing or removing a doctor after setup

- **Where:** UC-01 Main Flow and Business Rules; UC-10; UC-11; 03 Weekly no-show report measures (fee estimates)
- **Type:** Missing scenario
- **Concern:** UC-01 covers the first setup only. Its rule "Only the owner can change clinic setup" assumes later changes, but no flow says what happens when a doctor's fee changes or a doctor leaves. Both are common in a clinic of up to 5 doctors. If the owner removes a doctor who still has booked patients, their reminders name a doctor the clinic no longer lists. The doctor's waitlist entries can never be matched either. A fee change also leaves open whether past weekly estimates change.
- **Options:**
  - **A.** Let the owner edit a doctor, apply a new fee from the next report, and block removal while the doctor has future appointments - no orphaned bookings, one more step.
  - **B.** Allow removal at any time, and let the receptionist clean up - faster for the owner, but reminders may go out for a doctor who left.
- **Recommended Answer:** Option A. In UC-01, Alternate & Exception Flows, add "**A2 - Owner changes a doctor's details:** The owner edits a doctor's name, specialty, or fee. A new fee applies from the next weekly report. Reports already sent do not change." Also add "**E3 - Doctor still has future appointments:** When the owner removes a doctor, the system lists the doctor's future appointments. It does not remove the doctor until each one is moved or cancelled (UC-10). The doctor's waitlist entries then end."
- **Why:** UC-01's rule already promises changes without a flow. A removed doctor with live bookings would send patients reminders for visits that cannot happen. The tradeoff is that the owner must clear the doctor's schedule first.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-09: A user who cannot sign in has no way back

- **Where:** UC-02; 07 Users & Use Cases Matrix (owner-only UC-01, UC-02, UC-04 to UC-06)
- **Type:** Missing scenario
- **Concern:** No flow covers a user who cannot sign in. A receptionist whose invitation never arrives (UC-02 step 4 depends on the SMS Provider), or who forgets how to sign in, has no path back. The owner case is worse. Only the owner login can change setup, manage logins, change reminder timing, review staff actions, and pay (chunk 07). A lost owner login stops the clinic's administration and, from the paid launch, its payments. Nothing says how the owner login passes to another person when a clinic changes owner.
- **Options:**
  - **A.** Self-service through the mobile number of each login, and the owner can resend an invitation - no support work, but a user who lost the phone needs another route.
  - **B.** Every reset goes through Clinic Reminders support - simple for users, but it needs an internal role the BRD decided against (decision Q-01).
- **Recommended Answer:** Option A. In UC-02, Alternate & Exception Flows, add "**A2 - Invitation not received:** At step 4, if the receptionist did not get the invitation, the owner selects the login and sends the invitation again." In UC-02, Business Rules, add "An owner or receptionist who cannot sign in regains access on their own through the mobile number of their login. **[NEEDS CLARIFICATION: Who restores access when the owner no longer has the owner login's mobile number, and how does the owner login pass to another person when the clinic changes owner?]**"
- **Why:** The owner login is the only route to setup, logins, and billing, so getting it back cannot depend on a support role the BRD rejected. Self-service reuses the mobile number the clinic gave for each login (UC-02, step 3). The tradeoff is that the lost-phone and change-of-owner cases wait for an answer.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-10: The owners' read rate has no definition of a read

- **Where:** UC-03 step 4 and Acceptance Criteria; 01 Business Objectives (BO-13, BO-16); 08 Integrations (WhatsApp row)
- **Type:** Ambiguity
- **Concern:** UC-03 step 4 says the system "records that the owner read the report that week". BO-13 (at least 70% of owners read the report each week) and the seed data room (BO-16) rest on that record. The system learns of a read only from the read status WhatsApp sends back (chunk 08). The BRD does not say what counts when no read status arrives for a report the owner did read. It also does not say whether opening the same report in the dashboard counts. Without a definition, the rate cannot be tested, and it may understate real reading.
- **Options:**
  - **A.** A read is a WhatsApp read status, or opening that report in the dashboard if that view is in the MVP - testable, but the rate may run low.
  - **B.** Ask the owner to tap a "Seen" button in the report - a clear signal, but one more reply a week per owner, which Meta charges for (chunk 02, Fact 5).
- **Recommended Answer:** Option A. In UC-03, Business Rules, add "A week counts as read for BO-13 when WhatsApp reports the owner's report as read, or when the owner opens that week's report in the dashboard (if the dashboard view in step 5 is in the MVP). A report read without either signal counts as unread, so the read rate is a floor."
- **Why:** BO-13 carries a 70% target and feeds the seed data room, so its measure must be testable in UAT. Option A uses only chunk 08's read status and UC-03 step 5, and it leaves the dashboard question open. The tradeoff is a rate that can sit below real reading.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-11: Paid-launch reminder settings break two MVP rules

- **Where:** UC-04 Business Rules and Acceptance Criteria; UC-07 A1; UC-13 and UC-14 Preconditions
- **Type:** Corner case
- **Concern:** UC-04 lets the owner move the reminder time and turn on a visit-day reminder, but two MVP rules still assume one reminder 24 hours ahead. First, UC-07 A1 sends at once only when "the visit is less than 24 hours away". Take a longer setting, such as the 48 hours in UC-04's first acceptance criterion. An appointment entered after its reminder time, but more than 24 hours ahead, matches no rule and gets no reminder. Second, UC-13 and UC-14 start only when "The appointment is Booked". Yet UC-04's second acceptance criterion sends the visit-day reminder to "every patient who has not cancelled", which includes Confirmed patients.
- **Options:**
  - **A.** Add a rule in UC-04 for late entries, and let UC-13 and UC-14 follow UC-04's visit-day audience - the MVP flows and UC-07 A1's open proposal stay as they are.
  - **B.** Rewrite UC-07 A1 around the clinic's reminder time - one rule in one place, but it edits a flow whose proposal is still open.
- **Recommended Answer:** Option A. In UC-04, Business Rules, add "An appointment entered after its reminder time has passed is handled as UC-07 A1 handles a visit less than 24 hours away." In UC-13 and UC-14, Preconditions, replace "The appointment is Booked." with "The appointment is Booked, or it is in the visit-day audience set in UC-04."
- **Why:** Without the rule, a clinic that lengthens its reminder time has appointments that are never reminded. A confirmed patient also never gets the visit-day reminder that UC-04 promises. The tradeoff is that two MVP use cases now point to a paid-launch one.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-12: Staff actions go unrecorded until the paid launch

- **Where:** 04 In Scope (item 13); UC-05 Preconditions and Business Rules; UC-02 Business Rules; 10 NFR-06
- **Type:** Inconsistency
- **Concern:** The audit log of staff actions is a paid-launch item (chunk 04, item 13), and UC-05 needs the paid launch. But staff change patient data from the first day: they record consent, cancel appointments, and mark attendance during the pilot. UC-02, an MVP use case, already promises that a removed receptionist's "past actions stay in the clinic's records (UC-05)". NFR-06 keeps "Records of activity" for at least 180 days under the Anti-Cybercrime Law, which does not wait for the paid launch. If recording starts in April 2027, the pilot leaves no trail of who changed what. NFR-06 also does not say what "records of activity" are: staff actions, sign-ins, messages, or all three.
- **Options:**
  - **A.** Record from the first release; the paid launch adds only the owner's view (UC-05) - a full trail from day one, with a log nobody sees until April 2027.
  - **B.** Start recording at the paid launch - a smaller MVP, but no trail for the pilot, and NFR-06 unmet for two months.
- **Recommended Answer:** Option A. In chunk 04, In Scope, replace item 13 with "The owner's view and export of the staff activity log (UC-05). The system records staff actions from the MVP." In UC-05, Business Rules, add "The system records the staff actions listed above from the first release (MVP). The paid launch adds this view for the owner." In chunk 10, NFR-06, Business Measure, replace "Records of activity" with "Records of activity (staff actions, sign-ins, and messages sent and received) **[NEEDS CLARIFICATION: Counsel to confirm which records the Anti-Cybercrime Law 175 of 2018 requires Clinic Reminders to keep.]**"
- **Why:** The retention law in NFR-06 and the consent evidence behind BO-04 apply from the first patient record. UC-02 already relies on the trail. The tradeoff is an MVP that keeps a log nobody can view until April 2027.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-13: No use case applies the plan limits a clinic pays for

- **Where:** UC-06 steps 2 and 3, Business Rules; UC-01 step 4; UC-12 A2; 04 In Scope (item 11); 12 Appendix (pricing link)
- **Type:** Gap
- **Concern:** UC-06 says plans are "tiered by the number of doctors and include a monthly reminder allowance", and it links to the pre-BRD for prices. But no use case applies a plan. The linked pricing ([pre-BRD 21, Pricing & packaging](../pre-brd-clinic-reminders/21-roadmap-project-plan.md)) caps the smaller plan at fewer doctors and lists "per-doctor calendars and reports" for the larger plan. Yet UC-01 lets the owner add any number of doctors, and UC-12 A2 offers per-doctor calendars to every clinic. No use case delivers a per-doctor report; a breakdown by doctor is Wishlist item 4. UC-06 also does not say how the owner picks or changes a plan. Nor does it say which messages count against the allowance: reminders only, or also visit-day reminders, fallback SMS, and slot offers. It is also silent on how fallback SMS reach the bill, which pre-BRD 21 prices in two different ways.
- **Options:**
  - **A.** Put the plan rules in the use cases now, with questions where the business must choose - billing and UAT have rules to apply.
  - **B.** Leave the plan rules on the pre-BRD pricing page - no BRD work, but the build and the tests have nothing to check against.
- **Recommended Answer:** Option A. In UC-01, Alternate & Exception Flows, add "**E4 - Doctor limit reached (from the paid launch):** At step 4, if the clinic's plan allows no more doctors, the system says so and names the plan that allows more (UC-06)." In UC-06, replace step 3 with "The owner chooses the plan and whether to pay monthly or yearly." In UC-06, Business Rules, add "**[NEEDS CLARIFICATION: Are per-doctor calendars (UC-12, A2) for every plan or only the larger one, and is the per-doctor report that pre-BRD 21 lists for the larger plan in scope or a Wishlist item (chunk 12, item 4)?]**" Also add "**[NEEDS CLARIFICATION: Which messages count against the monthly reminder allowance, and how are fallback SMS charged to the clinic?]**"
- **Why:** UC-06 makes the doctor count and the allowance part of what a clinic buys, and BO-11 depends on clinics paying for the plan they use. An unenforced doctor limit lets a five-doctor clinic choose the smaller plan. The tradeoff is two business answers needed before the paid launch.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-14: No rule for how a free period ends and paying starts

- **Where:** UC-06 Trigger and Alternate & Exception Flows; 01 Business Objectives (BO-05, BO-10); 02 Glossary (Pilot, Paid launch)
- **Type:** Gap
- **Concern:** Clinics start paying only at the paid launch (Glossary, Paid launch). No use case says what happens to a pilot clinic on 2027-04-01: when it is asked to pay, how long it has, and whether reminders continue meanwhile. The go-to-market plan behind BO-10 also relies on a 14-day trial and one free month for each referred paying clinic ([pre-BRD 21, Go-To-Market](../pre-brd-clinic-reminders/21-roadmap-project-plan.md)). UC-06 has neither. The path to 40 paying clinics runs through a step the product does not support, so three founders would track every end date by hand.
- **Options:**
  - **A.** One free-period rule for pilot clinics, trials, and referral credits, ending like an overdue payment - the same path for every clinic, reusing UC-06 E2 once settled.
  - **B.** Handle free periods outside the product - no build work, but founders must track each end date and stop reminders themselves.
- **Recommended Answer:** Option A. In UC-06, Alternate & Exception Flows, add "**A1 - Free period ends:** A pilot clinic is free until 2027-03-31. A clinic that joins from the paid launch gets a 14-day trial (pre-BRD 21). A paying clinic that refers another clinic that then pays gets one free month (pre-BRD 21). Before a free period ends, the system tells the owner the end date and the amount due. If no payment follows, the clinic is treated as overdue (E2)."
- **Why:** BO-10 depends on trials and pilot clinics turning into paying clinics (pre-BRD 21 funnel). The 15 pilot clinics are the first ones asked to pay. The tradeoff is that referral credits add billing work at the paid launch.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-15: Billing does not address tax

- **Where:** UC-06 step 6, Business Rules; 02 Dependencies (company incorporated in Egypt)
- **Type:** Gap
- **Concern:** From the paid launch, Clinic Reminders charges clinics in EGP, and UC-06 step 6 "shows the receipt". The BRD does not say whether plan prices include VAT. It also does not say whether each payment must produce a tax invoice in the form Egyptian tax rules require for business customers. The BRD names the other regulators (PDPC, NTRA) but not the tax authority. If an electronic tax invoice is required, it is either a product feature or a manual task for the founders, and neither is planned. The reviewer cannot confirm the Egyptian tax rules, so the answer must come from an accountant before UC-06 is built.
- **Options:**
  - **A.** Add a rule that every payment produces the document the tax rules require, and ask who issues it - nothing is built on a guess.
  - **B.** Treat the receipt as enough - no delay, but invoices may not meet the rules and need rework after launch.
- **Recommended Answer:** Option A. In UC-06, Business Rules, add "Each payment produces the receipt or tax invoice that Egyptian tax rules require. **[NEEDS CLARIFICATION: Do plan prices include VAT, and must each payment produce an electronic tax invoice through the Egyptian Tax Authority's system, issued by the product or by the company's accountant?]**"
- **Why:** Billing starts on a fixed date (2027-04-01), and the incorporation that tax registration depends on is still pending (chunk 02, Dependencies). Asking now avoids rebuilding the receipt. The tradeoff is an open question in UC-06 until an accountant answers.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-16: No use case for a clinic that leaves

- **Where:** UC-06; 04 In Scope; 10 NFR-06; 02 Assumption 4; 09 Consent and opt-out log row
- **Type:** Gap
- **Concern:** No use case covers a clinic that stops using the service. It may be a pilot clinic that does not start paying on 2027-04-01, or a paying clinic that cancels. Nothing says that scheduled reminders, slot offers, and the weekly report stop, or that staff logins end. Nothing says the clinic can take its records with it. Under Assumption 4, Clinic Reminders handles patient data on the clinic's behalf. So the clinic needs its appointments, waitlist, and consent and opt-out records back when it leaves. NFR-06 asks how long records are kept after a clinic ends its subscription, but no flow reaches that moment. UC-06 cannot carry it, because UC-06 starts only at the paid launch.
- **Options:**
  - **A.** A new owner use case from the MVP that ends the service on a set date, offers a download first, then stops every message - a clean exit for every clinic.
  - **B.** End the service by hand through the founders - no build work, but messages may keep reaching the patients of a clinic that has left.
- **Recommended Answer:** Option A. In chunk 06a, add "**UC-17: End the clinic's service** (Primary Actor: Clinic Owner; Supporting Actors: None; MVP). Trigger: the owner decides to stop using Clinic Reminders. Precondition: the clinic is set up (UC-01). Main Flow: 1. The owner opens clinic setup and chooses to end the service. 2. The system shows the end date, which is the end of the current paid or free period. It lists what will stop: reminders, slot offers, the weekly report, and every staff login. 3. The system asks the owner to confirm and names what will stop (chunk 11, Destructive Actions). 4. The owner confirms. 5. Until the end date, the owner can download the clinic's appointments, waitlist, and consent and opt-out records. 6. On the end date, the system stops every scheduled message and ends every login of the clinic. The clinic's records are then kept or deleted as NFR-06 requires. Acceptance criterion: Given a clinic with reminders scheduled after its end date, when the end date arrives, then none of them is sent." Add UC-17 to the Use Case Summary in chunk 05, and add a chunk 07 row: Clinic Owner Yes, Receptionist -, Patient -.
- **Why:** Assumption 4 makes each clinic the party that decides how its patients' data is used, so it must be able to take that data back. Messages sent for a clinic that has left reach patients with no clinic behind them. The tradeoff is one more MVP use case.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-17: The system cannot tell which patients are under 15

- **Where:** 03 Appointment, Overview; UC-07 step 3; UC-08 Business Rules; UC-09 steps 3 and 4, E1, Acceptance Criteria; 02 Constraint 6
- **Type:** Gap
- **Concern:** The guardian rule depends on knowing that a patient is under 15. Messages go to the guardian (UC-07, Business Rules), consent must come from the guardian (UC-09), and UC-09 E1 refuses to save without guardian details, tested with "a patient aged 9". But the patient details the BRD collects hold no age, birth date, or child mark (chunk 03, Appointment Overview; UC-07 step 3; the import file in UC-08). The system cannot enforce E1, and an imported list from a pediatric clinic cannot tell children from adults. Pediatrics is one of the three target specialties (chunk 04).
- **Options:**
  - **A.** A yes or no mark, "child under 15", at booking and import - the least data that works, but the system cannot tell when a child turns 15.
  - **B.** Date of birth - the system knows when a child turns 15, but it stores more data about children, which Constraint 6 treats as sensitive.
- **Recommended Answer:** Option A. In chunk 03, Appointment, Overview, after "message language," add "whether the patient is a child under 15,". In UC-07, replace step 3 with "The receptionist enters the patient's name and mobile number, and marks whether the patient is a child under 15. For a child, the number is the guardian's." In UC-08, Business Rules, add "Each row says whether the patient is a child under 15. A row without it is listed with the errors at step 3." In UC-09, Acceptance Criteria, replace "Given a patient aged 9" with "Given a patient marked as a child under 15". In UC-09, Business Rules, add "**[NEEDS CLARIFICATION: When a child turns 15, does the patient give consent again, and who records it?]**"
- **Why:** Constraint 6 requires guardian consent under 15, and UC-09's own acceptance criterion assumes the age is known. One mark meets that with the least data about children. The tradeoff is reliance on the receptionist, and the change at 15 stays manual.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-18: Walk-ins get reminders and lower the no-show rate

- **Where:** 02 Assumptions / Constraints (Constraint 11); UC-07 A1; 03 Weekly no-show report measures (Appointments due); 01 BO-07
- **Type:** Gap
- **Concern:** Constraint 11 says reminders do not help walk-in patients and "the pilot measures the walk-in share separately". No use case says whether or how walk-ins are entered. The receptionist keeps one list for the day, so walk-ins will likely be entered as appointments. UC-07 A1 then sends a reminder at once to a patient who is standing at the desk. Each walk-in also counts as an attended appointment due. That lowers the no-show rate with no reminder effect and inflates BO-07, the pilot's main proof. If walk-ins are not entered at all, the pilot cannot count them in the product.
- **Options:**
  - **A.** A walk-in mark at booking: no message, and counted apart from appointments due - a clean BO-07 and the walk-in share in one place.
  - **B.** Walk-ins are never entered, and founders count them outside the product - no build work, but receptionists who enter them anyway skew the report.
- **Recommended Answer:** Option A. In UC-07, Alternate & Exception Flows, add "**A3 - Walk-in visit:** At step 5, the receptionist marks the appointment as a walk-in. The system sends it no message and shows it on the day's list." In chunk 03, Weekly no-show report measures, change the Appointments due meaning to "Appointments of the week that were not cancelled and are not walk-ins". Add the row "Walk-ins | Walk-in visits of the week, counted apart".
- **Why:** BO-07 asks for a no-show rate at least 25% lower than baseline. Walk-ins always attend, so counting them would make the drop look larger than reminders made it. Constraint 11 already asks for the walk-in share. The tradeoff is one more field at booking.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-19: No service terms for the clinic and no fixed consent wording for the patient

- **Where:** UC-01 Main Flow; UC-09 steps 3 to 5, Business Rules; 03 Consent and opt-out (Consent record); 02 Assumption 4, Constraint 6
- **Type:** Gap
- **Concern:** Two agreements have no place in the flows. First, the clinic never accepts service terms. UC-01 goes from profile to ready with no step where the owner agrees how Clinic Reminders handles the clinic's patient data. Yet Assumption 4 rests on that arrangement. Second, the patient's consent has no fixed wording. UC-09 step 3 says the receptionist "asks the patient" but not what the patient is told. Each receptionist may describe the messages differently, and the consent record cannot show what the patient agreed to. Whether the record counts as written consent is open (UC-09). Under any answer, the wording must be the same for every patient, and the record must show which wording was used.
- **Options:**
  - **A.** Put both texts in the product, and keep the version in each record - evidence for BO-04, but counsel must write two texts before the pilot.
  - **B.** Keep paper agreements outside the product - no build work, but no link between a consent record and what the patient heard.
- **Recommended Answer:** Option A. In UC-01, Main Flow, add a new step 8: "The owner accepts the Clinic Reminders service terms, including how Clinic Reminders handles patient data for the clinic. The system records who accepted, the version, and the time." The save step becomes step 9, and E2 then refers to step 9. In UC-09, replace step 3 with "The system shows the consent wording. The receptionist reads it to the patient, or the guardian, and records who consents: the patient, or the guardian for a child under 15." In chunk 03, Consent and opt-out, Consent record, add "and the version of the consent wording" after "how it was given". In UC-09, Business Rules, add "**[NEEDS CLARIFICATION: Counsel to supply the consent wording in Arabic and English, and the service terms, including the roles of the clinic and Clinic Reminders (chunk 02, Assumption 4).]**"
- **Why:** Constraint 6 requires explicit consent, and Assumption 4 a processor arrangement. Both can be shown only if the exact text agreed to is on record (BO-04). The tradeoff is that counsel must write both texts before the first clinic is onboarded.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-20: Patient details cannot be corrected or removed

- **Where:** UC-07; UC-09; UC-10 step 3; 03 Appointment, Overview; 10 NFR-05, NFR-06; 02 Constraint 6, Assumption 4
- **Type:** Gap
- **Concern:** No use case lets staff change a patient's details after the first booking; UC-10 changes only the date, time, or doctor. If a patient changes mobile number, or the receptionist typed it wrong, every later reminder goes to someone else. Each one names the clinic, the doctor, and the visit time, which shows patient data to a stranger (NFR-05). There is also no flow for a patient who asks the clinic to see, correct, or delete the data it holds. An opt-out (UC-16) stops messages but keeps the data. The PDPL gives patients rights over their own data (counsel to confirm which apply). As the party that decides how the data is used (Assumption 4), the clinic needs the product to act on such requests.
- **Options:**
  - **A.** A new receptionist use case to update or remove a patient's details, with a download for copy requests - covers wrong numbers and patient requests in one place.
  - **B.** Correct details by cancelling and booking again, and handle requests outside the product - no build work, but scheduled reminders still reach the wrong number, and nothing is deleted.
- **Recommended Answer:** Option A. In chunk 06b, add "**UC-18: Update or remove a patient's details** (Primary Actor: Receptionist; Supporting Actors: None; MVP). Trigger: a patient's details change, a reminder reached the wrong person, or a patient asks to see, correct, or delete their data. Main Flow: 1. The receptionist finds the patient by name or mobile number. 2. The system shows the patient's details, consent status, future appointments, and waitlist entries. 3. The receptionist corrects the name, mobile number, message language, or guardian details. 4. The system saves the change, and every later message uses the new details. Alternate flows: **A1 - Copy requested:** The receptionist downloads the patient's details, appointments, and consent record. **A2 - Deletion requested:** The system asks for confirmation and names the patient. It then removes the patient's details, future appointments, and waitlist entries, and keeps only what NFR-06 requires. Business Rules: **[NEEDS CLARIFICATION: Counsel to confirm which patient requests the clinic must answer under the PDPL, and within what time.]**" Add UC-18 to the Use Case Summary in chunk 05. Add a chunk 07 row: Clinic Owner - (or Yes³ if OI-07 is accepted), Receptionist Yes, Patient -.
- **Why:** A wrong number turns every reminder into a disclosure to a stranger, which NFR-05 forbids. The clinic also cannot meet a patient's request without a way to find, change, or remove the data. The tradeoff is one more MVP use case, and the deletion limit still depends on NFR-06.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-21: Clinic cancellations start slot offers, and moves never do

- **Where:** UC-10 Trigger, steps 3 and 6, Business Rules, Acceptance Criteria; UC-15 Trigger; 03 Weekly no-show report measures (Cancellations, Slots refilled); 01 BO-09
- **Type:** Missing scenario
- **Concern:** UC-10 starts only when a patient asks to move or cancel, and it treats every receptionist cancellation as a freed slot that starts slot offers. Two cases are missing. Sometimes the clinic itself cancels, for example when the doctor is ill or the clinic closes for a holiday. The system then offers waitlisted patients a slot with a doctor who will not be there. The weekly report also counts that cancellation against patients and in the refill share (BO-09). When a patient's appointment moves to another day, the old slot is freed just as by a cancellation. Yet no offer starts, so the waitlist never hears of it.
- **Options:**
  - **A.** The receptionist records who asked for the change, and only a patient's change frees a slot for offers - offers match slots that are really free.
  - **B.** Treat every change alike, and let the receptionist stop wrong offers by hand - no new choice at step 3, but wrong offers go out first.
- **Recommended Answer:** Option A. In UC-10, replace the Trigger with "A patient asks to move or cancel an appointment, or the clinic must move or cancel it, for example because the doctor is away." Replace step 3 with "The receptionist changes the date, time, or doctor, or chooses to cancel, and says who asked: the patient or the clinic." Replace step 6 with "The system saves the change. A moved appointment gets a new reminder for the new time. A cancelled appointment becomes Cancelled, and its reminders stop. Slot offers follow the Business Rules." In Business Rules, replace "A cancellation by the receptionist frees the slot for the waitlist, as a patient cancellation does." with "A move or cancellation the patient asked for frees the old slot for the waitlist (UC-15). A move or cancellation the clinic asked for starts no slot offer, and the day's list marks the patient to be called." In Acceptance Criteria, make the first criterion begin "Given a confirmed appointment the patient asked to cancel". Add "Given the doctor is away, when the receptionist cancels an appointment as asked by the clinic, then no slot offer starts and the day's list marks the patient to be called." In UC-15, replace the Trigger with "A slot is freed by a patient's cancellation or move (UC-10, UC-13, UC-14) and the waitlist holds matching patients." In chunk 03, Weekly no-show report measures, add to the Cancellations meaning "Cancellations by the clinic are shown apart and are not counted in Slots refilled."
- **Why:** An offer for an absent doctor creates a booking that the clinic must cancel again. Counting clinic cancellations against patients distorts two measures the owner reads (BO-07, BO-09). A moved appointment frees exactly the earlier slot that waitlisted patients asked for (chunk 03, Waitlist). The tradeoff is one more choice for the receptionist at step 3.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-22: Waitlist entries never end on their own

- **Where:** UC-11 step 3, Business Rules; 03 Waitlist and slot offers; UC-15
- **Type:** Corner case
- **Concern:** A waitlist entry ends only when the patient accepts an offer (proposed in UC-11) or the receptionist removes it (UC-11, step 5). Nothing ends it when the patient no longer needs an earlier slot: their own appointment takes place, is cancelled, or weeks pass. Patients then keep getting slot offers after their visit. The pre-BRD names this pain directly: "unwanted messages after the visit" ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md)). An offer that no longer serves a request is also the kind most likely to be judged promotional. Whether slot offers count as electronic marketing is still open (chunk 02, Constraint 6).
- **Options:**
  - **A.** Link the entry to the patient's current appointment with that doctor, and end it when that visit passes or is cancelled - offers stay tied to a live request.
  - **B.** Keep entries open until someone removes them - no new rule, but the waitlist fills with patients who no longer want offers.
- **Recommended Answer:** Option A. In UC-11, replace step 3 with "The receptionist adds the patient, the doctor the patient wants to see, and the patient's current appointment with that doctor, if any." In UC-11, Business Rules, add "A waitlist entry ends when its linked appointment's time passes or the appointment is cancelled. An entry with no linked appointment ends after **[NEEDS CLARIFICATION: how many days on the waitlist?]**. No slot offer goes to an ended entry."
- **Why:** Chunk 03 ties every offer to "the patient's own waitlist request". An offer after the request has lapsed breaks the rule that keeps offers non-promotional, and the link costs one field. The tradeoff is that a patient with no appointment must be added again when the entry ends.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-23: Attendance marks cannot be corrected, and bulk actions are undefined

- **Where:** UC-12 step 5, Alternate & Exception Flows, Business Rules; 03 Appointment, Lifecycle (Figure 1); 11 UI/UX Expectations (Data Tables); 02 Challenges (Challenge 2, CH-01)
- **Type:** Missing scenario
- **Concern:** The weekly report is "only right if the receptionist marks attended and no-show every day" (Challenge 2). The evidence for it is a doctor complaining about clicking "no show" every day (CH-01). Yet UC-12 offers one mark at a time and no way to fix a wrong one. Attended and No-show are final states in Figure 1, so a mis-tap stays in the owner's numbers. Chunk 11 says "Bulk actions appear where a list allows them", which names no list and no action. So whether the day's list lets the receptionist mark several visits at once is undecided. The vague wording hides the one bulk action that CH-01 asks for.
- **Options:**
  - **A.** Allow correcting a mark (recorded) and marking several visits Attended at once - fewer taps, and mistakes can be fixed.
  - **B.** Correction only - fixes errors, but keeps the daily load that CH-01 warns about.
  - **C.** Neither - simplest, but report accuracy rests on perfect daily marking.
- **Recommended Answer:** Option A. In UC-12, Alternate & Exception Flows, add "**A4 - Wrong mark:** The receptionist changes an Attended mark to No-show, or the reverse. The system records the change in the staff activity log (UC-05) and uses the new mark from the next weekly report. A report already sent does not change." Also add "**A5 - Mark several at once:** At step 5, the receptionist selects several appointments and marks them Attended in one action, under the same timing rule as single marks." In UC-12, Business Rules, add "**[NEEDS CLARIFICATION: For how long after the visit can a mark be changed?]**" In chunk 03, Figure 1, add the transitions `Attended --> NoShow : receptionist corrects the mark` and `NoShow --> Attended : receptionist corrects the mark`. In chunk 11, Data Tables, replace "Bulk actions appear where a list allows them." with "Bulk actions: on the day's list, the receptionist marks several appointments Attended at once (UC-12, A5). **[NEEDS CLARIFICATION: Which other lists need bulk actions, and which actions?]**"
- **Why:** Most visits end Attended, so one bulk action removes most of the daily taps that CH-01 complains about. A correction path keeps BO-07 measured on right marks. The tradeoff is that a wrong bulk mark changes many visits at once, which A4 lets the receptionist undo one by one.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-24: Late taps can double-book a slot or confirm a time that moved

- **Where:** UC-13 A1, A4, Acceptance Criteria; UC-15 step 3, A1, Business Rules; UC-07; UC-10; 03 Appointment, Lifecycle (Figure 1)
- **Type:** Corner case
- **Concern:** A slot can change hands while older messages are still open, and the BRD does not say what a late tap does. (1) A patient taps Cancel, a waitlisted patient accepts the freed slot (UC-15), and then the first patient taps Confirm in the same reminder. Figure 1 makes Cancelled final, but UC-13 A4 says "The latest answer counts". That can be read as allowing the re-confirmation, which double-books the slot. (2) The receptionist moves an appointment (UC-10) after its reminder went out. The patient then taps Confirm on the old reminder and confirms a time that no longer exists. UC-14 E3 proposes a fix for the SMS page, but UC-13 has none. (3) While a slot is on offer, the receptionist books it for a caller (UC-07 or UC-10), and a waitlisted patient then taps Accept. UC-15 A1 covers only another waitlisted patient accepting first.
- **Options:**
  - **A.** One rule: a tap counts only if it still matches the current state; otherwise nothing changes, and the patient is told the current status - no double bookings.
  - **B.** Let the latest tap win, and leave clashes to the receptionist - fewer rules, but double bookings reach the day's list.
- **Recommended Answer:** Option A. In chunk 03, Appointment, Lifecycle, add "A cancelled appointment stays cancelled. A patient who wants to come after all calls the clinic, and the receptionist books again (UC-07)." In UC-13, Alternate & Exception Flows, add "**E3 - Reply that no longer fits:** If the appointment was cancelled, or moved after this reminder went out, a Confirm or Cancel tap changes nothing. The system tells the patient the current status and, for a moved appointment, the new date and time." In UC-13, Acceptance Criteria, add "Given a patient cancelled and a waitlisted patient took the slot, when the first patient taps Confirm in the old reminder, then the appointment stays Cancelled and the patient is told the current status." In UC-15, Alternate & Exception Flows, add "**A3 - Receptionist booked the slot first:** If the receptionist books the offered slot before anyone accepts, the system closes the offer. A patient who then taps Accept is told the slot is already filled, as in A1."
- **Why:** Figure 1 already makes Cancelled final, and UC-15 promises "One slot goes to one patient only". This rule enforces both and matches what UC-14 E3 proposes for the SMS page. The tradeoff is that a patient who cancelled by mistake must call instead of tapping Confirm again.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-25: No one is told when WhatsApp stops working for the whole clinic

- **Where:** UC-13 A3; UC-01 E1; UC-07 and UC-08 Preconditions; 08 Integrations (WhatsApp row); 02 Assumption 3
- **Type:** Missing scenario
- **Concern:** Every WhatsApp failure in the BRD is either for one message (UC-13, A3) or at setup (UC-01, E1). Nothing covers WhatsApp stopping for the whole clinic after go-live. The sender number can be restricted, a template can be paused or moved to the marketing category (Assumption 3), or WhatsApp can be down. Each reminder then falls back to SMS one by one, at a higher cost. No one at the clinic learns why patients now get SMS, or why the weekly report stopped. If the clinic shows as not ready again, the receptionist cannot even enter appointments, because UC-07 and UC-08 require a ready clinic.
- **Options:**
  - **A.** Keep reminders going by SMS, warn the owner and the receptionist, and let booking continue - patients are still reached, and staff know why.
  - **B.** Pause all reminders until WhatsApp works, and warn staff - no surge in SMS cost, but patients go unreminded and BO-08 falls.
- **Recommended Answer:** Option A. In UC-13, Alternate & Exception Flows, add "**E4 - WhatsApp stops working for the whole clinic:** If WhatsApp (Meta) stops the clinic's sender or a template, or WhatsApp is down, the system sends each due reminder by SMS (UC-14). It shows the owner and the receptionist a warning that names the problem, until WhatsApp works again. This differs from a clinic that is not yet ready at setup (UC-01, E1)." In UC-07 and UC-08, Preconditions, replace "The clinic is ready to send reminders (UC-01)." with "The clinic is set up (UC-01)."
- **Why:** WhatsApp is the only Critical partner (chunk 08), and Meta decides template categories (Assumption 3), so a clinic-wide stop is foreseeable. The SMS fallback already exists per message, so option A adds only a warning and keeps the schedule usable. The tradeoff is a higher SMS cost during the outage, which the open SMS charging question in UC-06 must cover.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-26: The SMS leaves out the doctor that every reminder must name

- **Where:** 03 Reminder, Content rules; UC-14 step 1 and first Acceptance Criterion; 02 Glossary (SMS fallback); 02 Constraint 9
- **Type:** Inconsistency
- **Concern:** Chunk 03 says "Every reminder names the clinic, the doctor, and the date and time of the visit." The SMS fallback is a reminder (Glossary), yet UC-14 step 1 and its first acceptance criterion name only the clinic and the date and time. A tester cannot pass both. The omission may be deliberate: an Arabic SMS holds 70 characters per part, and a longer one is billed as two (Constraint 9).
- **Options:**
  - **A.** Narrow the content rule: the SMS names the clinic and the date and time, and its page shows the doctor - a shorter SMS, and rule and use case agree.
  - **B.** Add the doctor to the SMS - the same content on both channels, but a longer SMS that is more likely billed as two parts.
- **Recommended Answer:** Option A. In chunk 03, Reminder, Content rules, replace the first bullet with "Every WhatsApp reminder names the clinic, the doctor, and the date and time of the visit. The SMS names the clinic and the date and time, and its confirm or cancel page shows the doctor (UC-14, step 3)."
- **Why:** UC-14 says the same thing in two places (step 1 and its first acceptance criterion), and its page already shows the doctor (step 3). Changing the general rule is the smaller edit, and it keeps the SMS short (Constraint 9). The tradeoff is that a patient with two visits at the clinic on the same day must open the link to see which doctor.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-27: A STOP from a shared phone leaves other patients on that number messaged

- **Where:** UC-16 steps 2 and 3, Business Rules, Acceptance Criteria; 03 Consent and opt-out; 02 Challenge 4, Constraint 8; 10 NFR-07; UC-01 step 6
- **Type:** Corner case
- **Concern:** Opt-outs are recorded per patient (UC-16, step 2). But families often share one phone (Challenge 4), and for children every message goes to the guardian's number (UC-07). When a guardian with two children at the clinic replies STOP to one child's reminder, only that child is opted out. The other child's reminders keep reaching the person who asked to stop. WhatsApp's rules require every opt-out to be honoured (Constraint 8), and NFR-07 allows zero messages after an opt-out. The BRD also does not say which clinic an opt-out covers under one shared sender number (UC-01, step 6). There, one chat can hold messages from several clinics.
- **Options:**
  - **A.** An opt-out covers its mobile number, for every patient of that clinic who uses it - honours the person who asked, but a sibling's reminders stop too.
  - **B.** An opt-out covers only the patient whose message was answered - precise per patient, but keeps messaging a person who asked to stop.
- **Recommended Answer:** Option A. In UC-16, Business Rules, add "An opt-out covers the mobile number it came from. The system stops messages from the clinic to that number for every patient of the clinic who uses it, and each of their consent records shows the opt-out. **[NEEDS CLARIFICATION: If one shared sender number is chosen (UC-01, step 6), does an opt-out stop messages from every clinic that uses Clinic Reminders, or only from the clinic whose message was answered?]**" In UC-16, Acceptance Criteria, add "Given two children on one guardian's mobile number, when the guardian replies STOP to one child's reminder, then no message goes to that number for either child."
- **Why:** The person holding the phone is the one who asked to stop, and Constraint 8 and NFR-07 count messages to that person. The receptionist can still call the family about the sibling's visit. The tradeoff is that one STOP silences every patient on the number.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-28: "STOP, or the Arabic equivalent" lets typed stop requests slip through

- **Where:** UC-16 step 1; UC-13 step 1, E1, Acceptance Criteria; UC-15 step 1; 02 Fact 4, Challenge 4, Constraint 8; 10 NFR-07
- **Type:** Ambiguity
- **Concern:** UC-16 starts when the patient replies "STOP", "or the Arabic equivalent". The BRD does not say which Arabic words count, and patients write Egyptian Arabic in many ways (Challenge 4). A typed stop request that the system does not recognise falls into UC-13 E1. The patient is then asked to tap Confirm or Cancel and keeps getting messages, which breaks NFR-07. Reminders and offers carry Confirm, Cancel, or Accept buttons, but no button to stop. Yet tap buttons work better than typed replies (Fact 4).
- **Options:**
  - **A.** Add a "Stop messages" button to every reminder and slot offer, and name the stop words - one tap to opt out, and a clear list to test.
  - **B.** Keep typed STOP only, and name the stop words - no template change, but typed variants still slip through.
- **Recommended Answer:** Option A. In UC-16, replace step 1 with "The patient taps Stop messages, or replies with a stop word, in a WhatsApp message from the clinic." In UC-16, Business Rules, add "Every reminder and slot offer has a Stop messages button. **[NEEDS CLARIFICATION: Which Arabic and English words count as stop words?]**" In UC-13, step 1 and the first acceptance criterion, change "Confirm and Cancel buttons" to "Confirm, Cancel, and Stop messages buttons". In UC-15, step 1, change "has an Accept button" to "has Accept and Stop messages buttons".
- **Why:** Constraint 8 requires every opt-out to be honoured, and Fact 4 shows that patients answer better by tapping than by typing. A button removes the guesswork that a word list alone leaves. The tradeoff is a template change before the December approval (BO-02), and a patient can stop all messages by mistake.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-29: Breach notices reach the regulator but not the affected clinics

- **Where:** 10 NFR-08; 02 Constraint 6, Assumption 4
- **Type:** Gap
- **Concern:** NFR-08 covers only the regulator: "The PDPC is told within 72 hours of a breach." Under Assumption 4, each clinic decides why its patients' data is used, and Clinic Reminders handles it for the clinic. A breach therefore exposes the clinic's patients and the clinic's own legal position. The BRD does not say that affected clinics are told, or by when. It also does not say whether patients are told, and by whom. Owners already fear liability for patient data ([pre-BRD 04 Value Proposition Canvas](../pre-brd-clinic-reminders/04-value-proposition-canvas.md)).
- **Options:**
  - **A.** Extend NFR-08 to every affected clinic, and ask about patients - clinics can act on their own duties, but the business must commit to a time limit.
  - **B.** Keep NFR-08 to the regulator - simpler, but clinics may learn of a breach from someone else.
- **Recommended Answer:** Option A. In chunk 10, NFR-08, replace the Business Expectation with "A data breach is reported in time to the regulator and to every affected clinic." Replace the Business Measure with "The PDPC is told within 72 hours of a breach (chunk 02, Constraint 6). The owner of each affected clinic is told within **[NEEDS CLARIFICATION: how many hours of finding the breach?]**. **[NEEDS CLARIFICATION: Must affected patients be told, and by the clinic or by Clinic Reminders?]**"
- **Why:** The clinic answers to its patients for their data (Assumption 4), so it must hear of a breach directly and early. The tradeoff is a notice deadline the business must commit to.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-30: No NFR for screen speed or for how much data may be lost

- **Where:** 10 Non-Functional Requirements; NFR-01, NFR-03, NFR-07; 05 Receptionist Journey
- **Type:** Gap
- **Concern:** Two qualities the business relies on have no NFR. The first is screen speed. NFR-03 covers when reminders go and how fast replies show, but not how fast the receptionist's everyday screens respond. Yet the receptionist books patients at a busy desk ([pre-BRD 05 Empathy Map](../pre-brd-clinic-reminders/05-empathy-map.md): "Overloaded at peak hours"). The second is data safety. NFR-01 says patient replies are never lost. Nothing says how much entered work (appointments, attendance marks, consent records, opt-outs) the business can lose after a failure. A lost opt-out means messages to a patient who asked to stop, which breaks NFR-07.
- **Options:**
  - **A.** Add two NFRs, and leave the numbers for the business to set - the SDD gets targets to design for.
  - **B.** Leave both to the SDD - no business numbers, so the SDD guesses the tolerance.
- **Recommended Answer:** Option A. In chunk 10, add a row with NFR ID "NFR-10", Quality "Responsiveness", Business Expectation "The receptionist's everyday screens (the day's list, a new appointment, marking attendance) respond fast enough to use with a patient at the desk.", and Business Measure "**[NEEDS CLARIFICATION: Within how many seconds must everyday screens respond?]**". Add a row with NFR ID "NFR-11", Quality "Data safety", Business Expectation "Consent records and opt-outs are never lost. Other entered work is lost only within an agreed limit after a failure.", and Business Measure "**[NEEDS CLARIFICATION: How many minutes of entered appointments and attendance marks may be lost after a failure?]**".
- **Why:** How much delay and loss the clinic can bear is a business decision, and the SDD needs it as input. Consent and opt-out records carry legal weight (Constraint 6, NFR-07), so they get a zero-loss expectation now. The tradeoff is two more numbers to settle before the SDD.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-31: The owner can do reception work but cannot mark attendance

- **Where:** UC-12 (Supporting Actors, Preconditions, Business Rules, Acceptance Criteria); 07 footnotes ¹ and ³; 04 Personas; 09 Day's list and Message status rows (raised by consistency check CF-01)
- **Type:** Inconsistency
- **Concern:** OI-07 lets the owner do the receptionist's work, for example in a clinic with no receptionist (chunk 07, footnote ³). UC-12 still keeps the owner view-only: footnote ¹, a proposed rule, an acceptance criterion, chunk 04, and both chunk 09 audiences. In a clinic with no receptionist nobody can mark attendance, so the weekly report and BO-07 are never complete.
- **Options:**
  - **A.** The owner may also mark attendance and change the day's list - matches OI-07, no split of duties on marks.
  - **B.** Marks stay with receptionists, and a clinic needs at least one receptionist login - keeps a split of duties, but a solo owner-doctor needs a second login.
- **Recommended Answer:** Option A. In chunk 07, set the Clinic Owner cell of UC-12 to "Yes³" and delete footnote ¹. In UC-12, set Supporting Actors to "Persona: Clinic Owner (can act as receptionist, chunk 07 footnote ³)" and the precondition to "The receptionist, or the owner acting as receptionist (chunk 07, footnote ³), is signed in (UC-01, UC-02)." Replace the rule on owner view-only access with "The owner can do everything the receptionist does on the day's list, including marking attendance (chunk 07, footnote ³)." Replace the fourth acceptance criterion with "Given a clinic with no receptionist, when the owner marks a visit No-show, then the weekly report counts it." In chunk 04, Clinic Owner, Access Level, use "Clinic administrator: clinic setup, staff logins, reminder settings, reports, billing; can also do the receptionist's work: enter appointments, record consent, manage the waitlist, follow the day's list and mark attendance, and update or remove patient details (UC-07 to UC-12, UC-18)". In chunk 09, set the audience of the Day's list and Message status rows to "Receptionist; Clinic Owner (chunk 07, footnote ³)".
- **Why:** OI-07 was accepted for owner-doctors who do the reception work, and attendance marks feed BO-07. The tradeoff is no split of duties on marks; the staff activity log (UC-05) still shows who marked.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-32: Nine proposals are already relied on as settled elsewhere

- **Where:** UC-02 step 4; UC-07 step 4; UC-10 A1 and Business Rules; UC-11 Business Rules; UC-14 step 3 and E3; UC-15 step 4 and E1; UC-16 step 4 and A1; 03 Figure 1; 08 Integrations (raised by consistency check CF-02)
- **Type:** Inconsistency
- **Concern:** Settled text already depends on nine open proposals. Chunk 08 lists SMS invitations, the opt-out confirmation, and SMS slot offers. UC-10 step 6 gives a moved appointment a new reminder. UC-13 E3 settles late taps for WhatsApp but not for the SMS page. UC-16 puts a Stop messages button on every reminder, but the SMS page has none. Figure 1 has no start for an accepted offer and no way back to Booked. UC-11 step 4 adds patients at the end of the waitlist. Several patients can share one mobile number, but UC-07 step 4 finds "the patient". Replacing any of these proposals silently would break other chunks.
- **Options:**
  - **A.** Confirm the nine proposals in one pass and align the text around them - one rule per subject.
  - **B.** Keep them open and mark each settled restatement as provisional - more qualifiers, and step 1 still decides them.
- **Recommended Answer:** Option A. Remove the proposal markers from UC-02 step 4, UC-10 A1, UC-10 Business Rules (reset to Booked), UC-11 Business Rules (first-come order), UC-15 step 4, UC-15 E1, UC-16 step 4, and UC-16 A1. In UC-14 E3, replace the outcome with "The page then shows the current status and, for a moved appointment, the new date and time, and offers no buttons." and remove its marker. In UC-14 step 3, change "Confirm and Cancel buttons" to "Confirm, Cancel, and Stop messages buttons". Replace UC-07 step 4 with "The system finds the patients who use the number. The receptionist picks one or adds a new patient, and the system shows the patient's consent status." and remove its marker. In chunk 03, Figure 1, add `[*] --> Confirmed : waitlisted patient accepts an offer` and `Confirmed --> Booked : appointment moved`, and extend the Summary with "An accepted slot offer starts as Confirmed, and a moved appointment goes back to Booked."
- **Why:** In every case the BRD already relies on the proposed answer, so confirming it removes two versions of one rule. The tradeoff is nine proposals confirmed together.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-33: UC-03 assumes the dashboard view whose MVP scope is open

- **Where:** UC-03 E1 and Acceptance Criteria (raised by consistency check CF-05)
- **Type:** Inconsistency
- **Concern:** UC-03 step 5 asks whether the MVP has the dashboard view of the report. E1 and the fourth acceptance criterion state that view as settled. If the MVP is WhatsApp-only, they cannot be tested.
- **Options:**
  - **A.** Put the dashboard view in the MVP now - E1 stands, but more build before 2027-01-31.
  - **B.** Keep step 5 open and make E1 and the criterion conditional - no pre-emption of the open scope question.
- **Recommended Answer:** Option B. In UC-03, replace E1 with "**E1 - Report not delivered on WhatsApp:** At step 2, if WhatsApp does not deliver the report, no SMS is sent. If the dashboard view in step 5 is in the MVP, the report stays available there." and keep its existing marker. Replace the fourth acceptance criterion with "Given the dashboard view is in the MVP and WhatsApp does not deliver the report, when the owner opens the dashboard, then the same report is there."
- **Why:** The open build-scope question in step 5 decides whether the view exists, so the flow and criterion must follow it. The tradeoff is that a WhatsApp-only MVP leaves an undelivered report unseen that week.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-34: The channel order during a clinic-wide WhatsApp stop

- **Where:** 03 Reminder; UC-04 Business Rules; UC-13 E4; UC-14 Trigger and Preconditions (raised by consistency check CF-06)
- **Type:** Ambiguity
- **Concern:** Chunk 03 and UC-04 say WhatsApp is always tried first. UC-13 E4 sends each due reminder by SMS when WhatsApp is stopped for the whole clinic. UC-14 starts only when a WhatsApp reminder is not delivered. During a clinic-wide stop it is unclear whether each reminder waits out the delivery wait first.
- **Options:**
  - **A.** During a clinic-wide stop, skip WhatsApp and send by SMS at the reminder time - on-time reminders, one named exception.
  - **B.** Keep trying WhatsApp first and fall back after the wait - one rule, but every reminder is late by an open wait time.
- **Recommended Answer:** Option A. In chunk 03, Reminder, Overview, replace "WhatsApp is always tried first." with "WhatsApp is always tried first, except while WhatsApp is stopped for the whole clinic (UC-13, E4)." In UC-04, Business Rules, add to the channel-order rule "While WhatsApp is stopped for the whole clinic, reminders go by SMS at the reminder time (UC-13, E4)." In UC-13 E4, replace "the system sends each due reminder by SMS (UC-14)" with "the system sends each due reminder by SMS at the reminder time, without trying WhatsApp (UC-14)". In UC-14, add to the Trigger and to the third precondition ", or WhatsApp is stopped for the whole clinic (UC-13, E4)".
- **Why:** E4 already says "by SMS", and option B makes every reminder late by a wait time that is still open. The tradeoff is one exception to the channel order.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-35: NFR-05 forbids the patient's own view

- **Where:** 10 NFR-05; 07 footnote ²; UC-13; UC-14 (raised by consistency check CF-07)
- **Type:** Inconsistency
- **Concern:** NFR-05 says only the clinic's own staff see its patients. Each patient, or guardian, sees their own appointment in the reminder and on the confirm or cancel page. Read literally, UC-13 and UC-14 break NFR-05.
- **Options:**
  - **A.** Name the patient's own access in NFR-05 - explicit, slightly longer.
  - **B.** Narrow NFR-05 to the patient list and other patients' details - shorter, but the patient's own access stays implied.
- **Recommended Answer:** Option A. In chunk 10, NFR-05, Business Expectation, add "A patient, or the guardian of a child, sees only their own appointment, through the messages and the confirm or cancel page (chunk 07, footnote ²)."
- **Why:** Footnote ² already states this access, and the first reviewer asked for it to be named in NFR-05. The tradeoff is a longer NFR-05.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-36: Objectives and use cases trace each other differently

- **Where:** 01 BO-07 and BO-09 (Served by); UC-04, UC-07, and UC-10 (Why) (raised by consistency check CF-08)
- **Type:** Inconsistency
- **Concern:** UC-04's Why says the visit-day reminder serves BO-07, but BO-07 is measured in the pilot, before the paid launch that UC-04 needs. UC-07's Why cites BO-07 and UC-10's Why cites BO-09, but neither objective lists them.
- **Options:**
  - **A.** Served by lists every use case whose Why cites the objective, and UC-04 drops its pilot claim - both directions agree.
  - **B.** Served by keeps only direct contributors, and the Whys drop the other objectives - shorter lists, weaker use-case reasons.
- **Recommended Answer:** Option A. In chunk 01, add UC-07 to BO-07, Served by, and UC-10 to BO-09, Served by. In UC-04, Why, replace the second sentence with "A same-day reminder for every patient still expected serves the no-show goal after the pilot."
- **Why:** Each Why is the use case's own claim, and only UC-04's claim is wrong on dates. The tradeoff is longer Served by cells.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-37: "Cancelled slot" no longer matches the offer rule

- **Where:** 02 Glossary (Cancelled slot); 03 Waitlist and slot offers; 01 BO-09; 03 Weekly no-show report measures (raised by consistency check CF-09)
- **Type:** Ambiguity
- **Concern:** The Glossary defines a cancelled slot as freed when a patient or the receptionist cancels. Since OI-21, only a patient's cancellation or move starts offers. BO-09 and the refill share can each be counted two ways.
- **Options:**
  - **A.** Redefine Cancelled slot as freed by a patient's cancellation or move - matches OI-21; moved slots enter BO-09's base.
  - **B.** Keep the entry and add a separate term for slots that start offers - two terms to keep apart.
- **Recommended Answer:** Option A. In chunk 02, Glossary, replace the Cancelled slot definition with "The date and time freed when a patient cancels or moves an appointment (UC-10, UC-13, UC-14). A slot the clinic frees is not a cancelled slot." In chunk 03, Waitlist and slot offers, Overview, replace "When a slot is cancelled, the system offers it" with "When a patient frees a slot, the system offers it".
- **Why:** It matches the accepted OI-21 rule and limits BO-09 to slots the waitlist could fill. The tradeoff is that moved slots enter BO-09's base.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-38: "Withdraw consent" and "opt-out" name one act

- **Where:** UC-09 Trigger, A1, Acceptance Criteria; 02 Glossary (Opt-out); UC-16 Business Rules (raised by consistency check CF-10)
- **Type:** Ambiguity
- **Concern:** UC-09 calls a stop recorded by staff "withdraw consent", while the Glossary and UC-16 call it an opt-out. It is not stated whether a stop recorded at the desk covers the whole mobile number, as an opt-out by reply does (OI-27).
- **Options:**
  - **A.** Treat it as an opt-out recorded by staff, with the same per-number scope - one term and one rule.
  - **B.** Keep a separate per-patient withdrawal - two rules for one outcome.
- **Recommended Answer:** Option A. In UC-09, replace the end of the Trigger with "or a patient asks the clinic to stop messages (an opt-out recorded by staff)." Replace A1 with "**A1 - Patient opts out by phone or at the desk:** At step 3, the receptionist records the opt-out. The system stops messages to the patient's mobile number, as in UC-16 (Business Rules)." and keep its marker, reworded "proposed opt-out recorded by staff". Replace the third acceptance criterion with "Given a patient opts out at the desk, when the receptionist records it, then no further message goes to that patient's mobile number." In chunk 02, Glossary, Opt-out, add "It can also be recorded by staff (UC-09, A1)."
- **Why:** One term for one thing (writing-style rule 6), and OI-27 already set the per-number scope. The tradeoff is that one desk opt-out also stops siblings on that number until new consent (UC-16 A2).
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-39: Pilot clinics' free period ends before billing exists

- **Where:** UC-06 A1 and Preconditions; 04 In Scope item 14 (raised by consistency check CF-12)
- **Type:** Gap
- **Concern:** UC-06 A1 ends a pilot clinic's free period on 2027-03-31 and tells the owner the amount due before that. But UC-06 needs the paid launch (2027-04-01), and the plan is chosen only at step 3. The notice to pilot clinics would have to run before its own release.
- **Options:**
  - **A.** Pilot clinics stay free for a set number of days after 2027-04-01, so the notice, plan choice, and first payment all happen in UC-06 - billing stays in one release; some free days delay first revenue.
  - **B.** Move the pilot notice into the MVP - more MVP scope, and the plan rules must be settled before January 2027.
- **Recommended Answer:** Option A. In UC-06, A1, replace "A pilot clinic is free until 2027-03-31." with "A pilot clinic stays free until **[NEEDS CLARIFICATION: how many days after 2027-04-01?]**, so its notice, plan choice, and first payment all happen after the paid launch."
- **Why:** It keeps billing in one release and needs only one number from the business. The tradeoff is some free days in April.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-40: No use case delivers the consent and opt-out log

- **Where:** 09 Consent and opt-out log row; 03 Consent record; 04 In Scope; 05; 07 (raised by consistency check CF-15)
- **Type:** Gap
- **Concern:** Chunk 03 says the owner can export the consent and opt-out log, while chunk 09 only proposes it, and no use case delivers it. The evidence that a clinic messages lawfully (BO-04, Constraint 6) has no release, no matrix row, and no acceptance criterion.
- **Options:**
  - **A.** A new owner use case in the MVP - evidence from the first pilot booking; one more MVP view.
  - **B.** Ship it with the staff activity log at the paid launch - no evidence in the product during the pilot.
- **Recommended Answer:** Option A. Add **UC-19: Export the consent and opt-out log** to chunk 06a (Primary Actor: Clinic Owner; Supporting Actors: None; MVP). Goal: show that the clinic messages its patients lawfully. Trigger: the owner needs evidence of consent, for example for the regulator or after a patient complaint. Precondition: the clinic is set up (UC-01). Main Flow: 1. The owner opens the consent and opt-out log. 2. The system lists each patient's consent (who, how, when, recorded by, and the consent wording version) and each opt-out, newest first. 3. The owner filters by date or patient. 4. The system shows the matching records. 5. The owner exports the list. 6. The system produces the file in CSV or Excel format (chunk 11, Data Tables). A1 - Nothing matches the filter: the system says so and offers to clear the filter (chunk 11, Empty States). Business Rules: only the owner opens and exports the log; the log covers every consent and opt-out from the first release. Acceptance criteria: "Given 3 consents and 1 opt-out recorded this week, when the owner opens the log, then all 4 records show with who, how, when, and who recorded them." and "Given a filtered list, when the owner exports it, then the file holds the same rows." Add UC-19 to chunk 05 (Use Case Summary), chunk 07 (Clinic Owner Yes, Receptionist -, Patient -), chunk 04 In Scope item 6, and chunk 01 BO-01 and BO-04 (Served by). In chunk 09, remove the proposal marker from the log row and name UC-19. In chunk 03, Consent record, point the export sentence to UC-19.
- **Why:** Consent records exist from the first pilot booking, and chunk 03 already promises the export. The tradeoff is one more MVP view.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-41: A new patient can never join the waitlist

- **Where:** UC-11 Preconditions, E1, Acceptance Criteria; UC-09 Preconditions (raised by consistency check CF-16)
- **Type:** Gap
- **Concern:** UC-11 requires a consent record, and UC-09 records consent only for a patient known through UC-07 or UC-08. UC-11's own E1 and second acceptance criterion handle a patient with no consent record, which the precondition rules out.
- **Options:**
  - **A.** Only patients known to the clinic can join, and E1 handles a known patient with no consent - the smaller change.
  - **B.** UC-11 also creates new patients - a second place where patients are created.
- **Recommended Answer:** Option A. In UC-11, replace the precondition "The patient has a consent record (UC-09)." with "The patient is known to the clinic (UC-07, UC-08)."
- **Why:** It is the smaller change and matches chunk 03, "One consent, recorded at booking". The tradeoff is that a new patient must book a free slot first.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-42: The staff activity log leaves out the most sensitive actions

- **Where:** UC-05 Business Rules; UC-18; UC-01; UC-04; UC-17; 10 NFR-06 (raised by consistency check CF-17)
- **Type:** Gap
- **Concern:** UC-05's proposed list of logged actions predates UC-18. It leaves out correcting, copying, and deleting a patient's details, changes to clinic setup and reminder settings, and ending the service. Deleting a patient's data would leave no trail.
- **Options:**
  - **A.** Extend the proposed list - every sensitive action leaves a trail.
  - **B.** Confirm the list as written - deletions cannot be traced.
- **Recommended Answer:** Option A. In UC-05, Business Rules, extend the proposed list of logged actions with "correcting, copying, and deleting patient details (UC-18); changes to clinic setup and reminder settings (UC-01, UC-04); and ending the service (UC-17)". The list stays a proposal.
- **Why:** The owner relies on the log for liability over patient data (UC-05, Why), and deletion is the most sensitive staff action. The tradeoff is more logged actions.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-43: The visit-day audience includes patients who must get no message

- **Where:** UC-04 Why, Business Rules, Acceptance Criteria; 10 NFR-07; UC-07 A2 and A3 (raised by consistency check CF-20)
- **Type:** Inconsistency
- **Concern:** UC-04 sends the visit-day reminder to every patient who has not cancelled. That includes opted-out patients and patients with no consent, which NFR-07 forbids, and walk-ins, who get no message (UC-07 A3). UC-04's Why aims at patients who did not answer, while OI-11 includes confirmed patients.
- **Options:**
  - **A.** The audience is appointments that are not cancelled and not walk-ins, whose patient has consent and has not opted out, confirmed patients included - matches OI-11 and NFR-07.
  - **B.** Only patients who have not replied - matches the old Why, but undoes part of OI-11.
- **Recommended Answer:** Option A. In UC-04, replace the visit-day audience rule with "The visit-day reminder goes to appointments that are not cancelled and not walk-ins, whose patient has consent and has not opted out. Confirmed patients are included." and remove its proposal marker. Replace the second acceptance criterion with "Given the visit-day reminder is on, when the visit day arrives, then every patient in the visit-day audience (Business Rules) gets a second reminder."
- **Why:** OI-11 was accepted on the basis that confirmed patients get the visit-day reminder, and NFR-07 allows no message without consent. The tradeoff is more visit-day messages.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-44: Thirty alternate and exception flows have no acceptance criterion

- **Where:** UC-01, UC-02, UC-03, UC-05, UC-06, UC-07, UC-08, UC-10, UC-12, UC-13, UC-14, UC-15, UC-16 (raised by consistency check CF-21)
- **Type:** Gap
- **Concern:** Thirty alternate and exception flows across 13 use cases have no acceptance criterion (UC-01 A1, A2, E2, E3, E4; UC-02 A1, A2; UC-03 A1; UC-05 A1; UC-06 A1; UC-07 A1, A3, E2; UC-08 E1, E2; UC-10 A1; UC-12 A2, A3, A4, A5, E1; UC-13 A4, E2, E4; UC-14 E1, E2, E3; UC-15 A3, E1; UC-16 A1). These branches cannot be signed off, and chunk 16 may not invent their expected results.
- **Options:**
  - **A.** Add one Given/When/Then criterion per flow, written from the flow text, at the end of each list - every branch testable.
  - **B.** Leave them to chunk 16 as provisional test cases - thirty to-do rows keep the gate shut anyway.
- **Recommended Answer:** Option A. Append one criterion per listed flow, written only from the flow's own text, at the end of each use case's Acceptance Criteria list so existing positions stay stable. A criterion on a flow that is still a proposal carries the same proposal marker.
- **Why:** Testers and chunk 16 need an expected result for every branch, and the flows already state it. The tradeoff is about thirty new criteria to review.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-45: The opt-out confirmation breaks the zero-message rule

- **Where:** UC-16 step 4 and A1; 10 NFR-07; 03 Consent and opt-out; 05 Use Case Summary (UC-16); 08 WhatsApp row (raised by consistency check CF-24)
- **Type:** Inconsistency
- **Concern:** OI-32 confirmed that UC-16 step 4 sends one last message after an opt-out, and chunk 08 counts it. NFR-07, chunk 03, and chunk 05 say no message follows an opt-out. A tester cannot pass both. UC-16 A1 does not say whether a page opt-out gets the confirmation.
- **Options:**
  - **A.** Keep one confirmation for an opt-out made in WhatsApp and name it as the single exception - the patient gets proof the stop worked.
  - **B.** Delete the confirmation - the zero rule holds as written, but part of OI-32 is reversed.
- **Recommended Answer:** Option A. In chunk 10, NFR-07, Business Measure, use "Zero messages to a patient with no consent record, and none after an opt-out apart from the one confirmation in UC-16 step 4 (UC-09, UC-16)." In chunk 03, Consent record, change "is opted out: no further message" to "is opted out: apart from one confirmation of a WhatsApp opt-out (UC-16, step 4), no further message". In chunk 05, UC-16 row, use "MVP. The patient replies to stop messages, and the system confirms once and then sends nothing more." In UC-16, A1, add "The page confirms the opt-out, and no message is sent."
- **Why:** OI-32 just confirmed the step and chunk 08 relies on it; the exception is narrow and testable. The tradeoff is one exception stated in the rule's homes.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-46: The doctor filter on the MVP day's list is a paid-launch item

- **Where:** 11 UI/UX Expectations (Filtration); UC-12 A2; 04 In Scope item 11 (raised by consistency check CF-31)
- **Type:** Inconsistency
- **Concern:** Chunk 11 says lists filter by doctor, with no release. On the MVP day's list, a doctor filter is exactly the per-doctor calendar of UC-12 A2, a paid-launch item that UC-06 may tie to one plan.
- **Options:**
  - **A.** Keep the doctor filter in the MVP and redefine the paid-launch item - pilot clinics get the filter.
  - **B.** The day's list gets its doctor filter with per-doctor calendars at the paid launch - keeps the pre-BRD release split.
- **Recommended Answer:** Option B. In chunk 11, Filtration, add "On the day's list, the doctor filter comes with per-doctor calendars at the paid launch (UC-12, A2)."
- **Why:** The release split comes from the pre-BRD MoSCoW (chunk 04), and the plan question in UC-06 depends on it. The tradeoff is that a multi-doctor pilot clinic works from one mixed day's list.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-47: An appointment from an accepted offer gets no regular reminder

- **Where:** UC-15 step 4; UC-13 and UC-14 Preconditions; UC-01 step 5; 03 Reminder; 03 Weekly no-show report measures (Confirmed share) (raised by consistency check CF-32)
- **Type:** Inconsistency
- **Concern:** An accepted offer books the slot as Confirmed (UC-15 step 4). UC-13 and UC-14 start only for Booked appointments or the visit-day audience, so a refilled visit days ahead gets no regular reminder, although UC-01 and chunk 03 promise one for every visit. The Confirmed share also counts these appointments above the line but not below it.
- **Options:**
  - **A.** Acceptance counts as the confirmation, so no regular reminder - a patient who accepts days ahead is not reminded.
  - **B.** Remind it like any visit whose reminder time is still ahead - one more message per refill.
- **Recommended Answer:** Option B. In UC-13 and UC-14, add to the first precondition "or it was booked from an accepted slot offer (UC-15) before its reminder time". In chunk 03, Weekly no-show report measures, Confirmed share, use "Appointments that got at least one reminder and were confirmed by the patient, divided by appointments that got at least one reminder".
- **Why:** UC-04 already reminds confirmed patients on the visit day to serve the no-show goal, and option B changes only two preconditions while keeping the promise in UC-01 and chunk 03. The tradeoff is one more message per refill.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-48: A clinic in a free period cannot stop its messages

- **Where:** UC-17 step 2, Business Rules, Why; UC-06 A1 (raised by consistency check CF-35)
- **Type:** Inconsistency
- **Concern:** UC-17 ends the service at the end of the current paid or free period. Since OI-39, a pilot clinic stays free until some days after 2027-04-01, and before the paid launch every clinic is a pilot clinic. So a clinic that leaves the pilot keeps messaging its patients for weeks, which UC-17's own Why and chunk 02 Assumption 4 rule out.
- **Options:**
  - **A.** In a free period, the service ends on the date the owner picks; a paid period still runs to its end - stops messages for a clinic that left, one more rule.
  - **B.** Keep one rule, the end of the current paid or free period - simple, but a leaving pilot clinic keeps messaging until after the paid launch.
- **Recommended Answer:** Option A. In UC-17, Business Rules, replace "The service ends at the end of the current paid or free period." with "A paid period runs to its end. In a free period (UC-06, A1), the service ends on the date the owner picks." In UC-17, replace step 2 with "The system shows the end date: the end of the current paid period, or, in a free period, the date the owner picks. It lists what will stop: reminders, slot offers, the weekly report, and every staff login."
- **Why:** UC-17's Why and Assumption 4 rule out messages for a clinic that has chosen to leave, and a free period has no payment that must run its course. The tradeoff is that early exits can shrink the pilot sample.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-49: Messages still follow an opt-out made in the same message

- **Where:** UC-16 Business Rules; UC-15 step 6; UC-13 replies; 03 Consent and opt-out; 10 NFR-07 (raised by consistency check CF-41)
- **Type:** Inconsistency
- **Concern:** Every reminder and offer has a Stop messages button next to Confirm and Cancel, or Accept, and appointments stay booked after an opt-out. A patient can tap Stop messages and then Cancel or Accept in the same message. UC-13 then sends a confirmation reply, and UC-15 step 6 tells every patient who got an offer that the slot is filled, including one who tapped Stop. Chunk 03, NFR-07, and UC-16 allow no message after an opt-out apart from the one confirmation.
- **Options:**
  - **A.** Strict: no message of any kind after an opt-out; a later tap still updates the appointment but gets no reply, and the opt-out closes any open offer - keeps the single exception of OI-45.
  - **B.** A reply to the patient's own tap becomes a second exception - the patient sees each result, but the rule gets a second exception.
- **Recommended Answer:** Option A. In UC-16, Business Rules, add "After an opt-out, a Confirm or Cancel tap in an earlier message still updates the appointment, but no reply goes to that number. The opt-out also closes any open slot offer for that number." In UC-15, replace step 6 with "The system tells the other patients who got the offer and have not opted out that the slot is filled."
- **Why:** OI-45 chose one narrow exception on purpose, and Constraint 8 and NFR-07 count every message to a number that asked to stop; the clinic still gets the cancellation and the freed slot (BO-09). The tradeoff is no reply to a tap made after stopping.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-50: The proposed matching rule offers later slots to patients who asked for earlier ones

- **Where:** 03 Waitlist and slot offers, Rules (matching rule); UC-11 step 3; UC-15 E2 (raised by consistency check CF-42)
- **Type:** Inconsistency
- **Concern:** The proposed rule matches a patient to any slot with the requested doctor. The waitlist is for patients who asked for an earlier slot, and UC-11 links each entry to the patient's current appointment. Under the proposal, a slot after that appointment still matches, so a patient can be offered a later slot than the one they hold.
- **Options:**
  - **A.** Match on the requested doctor and, for a linked entry, a slot earlier than the linked appointment - every offer fits the request.
  - **B.** Keep doctor-only matching - simple, but later slots go to patients who asked for earlier ones.
- **Recommended Answer:** Option A. In chunk 03, Waitlist and slot offers, Rules, replace the matching rule's text with "A waitlisted patient matches a slot when the slot is with the doctor the patient asked for and, if the entry is linked to an appointment, earlier than that appointment." Keep its proposal marker until the rule is confirmed.
- **Why:** The Glossary, chunk 03, UC-11, and UC-15 E2 already assume an earlier slot, and option A uses the link that UC-11 step 3 records. The tradeoff is that an entry with no linked appointment still matches any slot with that doctor.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-51: Imported consent lacks fields every consent record must hold

- **Where:** UC-08 Business Rules (consent columns); 02 Glossary (Consent record); 03 Consent record; UC-09; UC-19 (raised by consistency check CF-43)
- **Type:** Inconsistency
- **Concern:** A consent record holds who consented, how, when, the staff member who recorded it, and the consent wording version, plus the guardian's name for a child. The proposed import columns carry only who, how, and when, and imported rows can then get reminders. An imported consent would not show which wording the patient agreed to.
- **Options:**
  - **A.** A row carries consent only if it has every field of a consent record; otherwise it is imported with no consent record - one definition, a complete UC-19 log.
  - **B.** The import carries no consent, and every imported patient goes through UC-09 - one consent path, more onboarding work.
- **Recommended Answer:** Option A. In UC-08, Business Rules, replace the consent-columns rule with "A row carries consent only if it has every field of a consent record: who consented (and, for a child, the guardian's name), how, when, the consent wording version, and the staff member who took it. A row missing any field is imported with no consent record (A1)." This settles the consent-columns proposal, so its marker is removed.
- **Why:** It keeps the chunk 03 definition and the evidence behind BO-04 intact while keeping bulk import useful, and A1 already handles incomplete rows. The tradeoff is that only lists collected on the versioned wording arrive with consent.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-52: Two settled rules rely on proposals that are still open

- **Where:** UC-08 Business Rules, A1, Acceptance Criteria; UC-16 Business Rules (raised by consistency check CF-49)
- **Type:** Inconsistency
- **Concern:** OI-51 settled that a row missing a consent field is imported with no consent record (A1), but A1 and its criterion still mark import without consent as a proposal. OI-49 settled that a tap after an opt-out still updates the appointment, which holds only if appointments stay booked after an opt-out, still a proposal in UC-16.
- **Options:**
  - **A.** Treat the OI-49 and OI-51 acceptances as confirming both proposals and remove their markers - one rule per subject, as in OI-32.
  - **B.** Keep both proposals open and make the settled rules conditional - no implied decision, but two conditional rules.
- **Recommended Answer:** Option A. Remove the "proposed import without consent" marker from UC-08 A1 and from the UC-08 criterion on rows with no consent record. Remove the "proposed appointments kept" marker from UC-16 Business Rules.
- **Why:** The accepted options of OI-49 and OI-51 already state these outcomes, and OI-32 confirmed proposals that settled rules relied on in the same way. The tradeoff is that two proposals close without their own walkthrough.
- **Status:** Accepted - applied (see Resolution Log)

---

<!-- Repeat the OI block for each open item. -->

---

## Resolution Log

<!-- When an open item is decided (accepted or adjusted and applied, deferred, or rejected), add its row here: for an applied item, a pointer to the BRD update (chunk + heading); for a deferred or rejected one, a pointer to its entry above. Keeps the audit trail. -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-30 | 01 / Business Objectives (BO-04); 02 / Dependencies (PDPC licence); 06b / UC-07 and UC-08 Preconditions | Accepted recommendation |
| OI-02 | 2026-09-30 | 01 / Business Objectives (BO-02) | Accepted recommendation |
| OI-03 | 2026-09-30 | 01 / Background and Context; 02 / Assumptions / Constraints (Assumption 3, Constraint 8) | Accepted recommendation |
| OI-04 | 2026-09-30 | 03 / Weekly no-show report measures (Confirmed share) | Accepted recommendation |
| OI-05 | 2026-09-30 | 03 / Appointment, Lifecycle; 06b / UC-12 step 2 and Business Rules; 09 / Day's list | Accepted recommendation |
| OI-06 | 2026-09-30 | 07 / Notes; 10 / NFR-05; 06b / UC-12 Business Rules; decision-log.md / Q-01 | Accepted recommendation |
| OI-07 | 2026-09-30 | 07 / Matrix (UC-07 to UC-11, footnote 3); 04 / Personas / Actors; 06b / UC-07 to UC-11 Supporting Actors | Accepted recommendation |
| OI-08 | 2026-09-30 | 06a / UC-01 Alternate & Exception Flows (A2, E3) | Accepted recommendation |
| OI-09 | 2026-09-30 | 06a / UC-02 Alternate & Exception Flows (A2) and Business Rules | Accepted recommendation |
| OI-10 | 2026-09-30 | 06a / UC-03 Business Rules | Accepted recommendation |
| OI-11 | 2026-09-30 | 06a / UC-04 Business Rules; 06c / UC-13 and UC-14 Preconditions | Accepted recommendation |
| OI-12 | 2026-09-30 | 04 / In Scope (item 13); 06a / UC-05 Business Rules; 10 / NFR-06 | Accepted recommendation |
| OI-13 | 2026-09-30 | 06a / UC-01 (E4); 06a / UC-06 step 3 and Business Rules | Accepted recommendation |
| OI-14 | 2026-09-30 | 06a / UC-06 Alternate & Exception Flows (A1) | Accepted recommendation |
| OI-15 | 2026-09-30 | 06a / UC-06 Business Rules | Accepted recommendation |
| OI-16 | 2026-09-30 | 06a / UC-17; 05 / Use Case Summary; 07 / Matrix | Accepted recommendation |
| OI-17 | 2026-09-30 | 03 / Appointment, Overview; 06b / UC-07 step 3, UC-08 Business Rules, UC-09 Business Rules and Acceptance Criteria | Accepted recommendation |
| OI-18 | 2026-09-30 | 06b / UC-07 (A3); 03 / Weekly no-show report measures | Accepted recommendation |
| OI-19 | 2026-09-30 | 06a / UC-01 step 8; 06b / UC-09 step 3 and Business Rules; 03 / Consent and opt-out, Consent record | Accepted recommendation |
| OI-20 | 2026-09-30 | 06b / UC-18; 05 / Use Case Summary; 07 / Matrix | Accepted recommendation |
| OI-21 | 2026-09-30 | 06b / UC-10; 06c / UC-15 Trigger; 03 / Weekly no-show report measures (Cancellations) | Accepted recommendation |
| OI-22 | 2026-09-30 | 06b / UC-11 step 3 and Business Rules | Accepted recommendation |
| OI-23 | 2026-09-30 | 06b / UC-12 (A4, A5) and Business Rules; 03 / Figure 1; 11 / Data Tables | Accepted recommendation |
| OI-24 | 2026-09-30 | 03 / Appointment, Lifecycle; 06c / UC-13 (E3) and Acceptance Criteria; 06c / UC-15 (A3) | Accepted recommendation |
| OI-25 | 2026-09-30 | 06c / UC-13 (E4); 06b / UC-07 and UC-08 Preconditions | Accepted recommendation |
| OI-26 | 2026-09-30 | 03 / Reminder, Content rules | Accepted recommendation |
| OI-27 | 2026-09-30 | 06c / UC-16 Business Rules and Acceptance Criteria | Accepted recommendation |
| OI-28 | 2026-09-30 | 06c / UC-16 step 1 and Business Rules; 06c / UC-13 step 1 and Acceptance Criteria; 06c / UC-15 step 1 | Accepted recommendation |
| OI-29 | 2026-09-30 | 10 / NFR-08 | Accepted recommendation |
| OI-30 | 2026-09-30 | 10 / NFR-10, NFR-11 | Accepted recommendation |
| OI-31 | 2026-10-01 | 07 / Matrix (UC-12, footnote 3); 06b / UC-12; 04 / Personas / Actors; 09 / Day's list and Message status | Accepted recommendation |
| OI-32 | 2026-10-01 | 06a / UC-02 step 4; 06b / UC-07 step 4, UC-10, UC-11; 06c / UC-14 step 3 and E3, UC-15, UC-16; 03 / Figure 1 | Accepted recommendation |
| OI-33 | 2026-10-01 | 06a / UC-03 E1 and Acceptance Criteria | Accepted recommendation |
| OI-34 | 2026-10-01 | 03 / Reminder, Overview; 06a / UC-04 Business Rules; 06c / UC-13 E4, UC-14 Trigger and Preconditions | Accepted recommendation |
| OI-35 | 2026-10-01 | 10 / NFR-05 | Accepted recommendation |
| OI-36 | 2026-10-01 | 01 / Business Objectives (BO-07, BO-09); 06a / UC-04 Why | Accepted recommendation |
| OI-37 | 2026-10-01 | 02 / Glossary (Cancelled slot); 03 / Waitlist and slot offers | Accepted recommendation |
| OI-38 | 2026-10-01 | 06b / UC-09 Trigger, A1, Acceptance Criteria; 02 / Glossary (Opt-out) | Accepted recommendation |
| OI-39 | 2026-10-01 | 06a / UC-06 A1 | Accepted recommendation |
| OI-40 | 2026-10-01 | 06a / UC-19; 05 / Use Case Summary; 07 / Matrix; 04 / In Scope (item 6); 01 / BO-01, BO-04; 09 / Consent and opt-out log; 03 / Consent record | Accepted recommendation |
| OI-41 | 2026-10-01 | 06b / UC-11 Preconditions | Accepted recommendation |
| OI-42 | 2026-10-01 | 06a / UC-05 Business Rules | Accepted recommendation |
| OI-43 | 2026-10-01 | 06a / UC-04 Business Rules and Acceptance Criteria | Accepted recommendation |
| OI-44 | 2026-10-01 | 06a, 06b, 06c / Acceptance Criteria of UC-01, UC-02, UC-03, UC-05, UC-06, UC-07, UC-08, UC-10, UC-12, UC-13, UC-14, UC-15, UC-16 | Accepted recommendation |
| OI-45 | 2026-10-01 | 06c / UC-16 A1; 10 / NFR-07; 03 / Consent record; 05 / Use Case Summary (UC-16) | Accepted recommendation |
| OI-46 | 2026-10-01 | 11 / Filtration | Accepted recommendation |
| OI-47 | 2026-10-01 | 06c / UC-13 and UC-14 Preconditions; 03 / Weekly no-show report measures (Confirmed share) | Accepted recommendation |
| OI-48 | 2026-10-01 | 06a / UC-17 step 2 and Business Rules | Accepted recommendation |
| OI-49 | 2026-10-01 | 06c / UC-16 Business Rules; 06c / UC-15 step 6 | Accepted recommendation |
| OI-50 | 2026-10-01 | 03 / Waitlist and slot offers, Rules | Accepted recommendation |
| OI-51 | 2026-10-01 | 06b / UC-08 Business Rules | Accepted recommendation |
| OI-52 | 2026-10-01 | 06b / UC-08 A1 and Acceptance Criteria; 06c / UC-16 Business Rules | Accepted recommendation |

---

## Reviewer Notes

<!-- Coverage record (required): one row per major risk area. Checked: what the reviewer checked. Findings: the number of open items raised, with their IDs, or "No issue found". A risk area with no issue is a valid result. An area the reviewer could not check says "Not checked" and why. -->

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Every In Scope item (1 to 14) and Out of Scope line against the use cases; the pre-BRD Must and Should lists, pricing, and go-to-market plan (pre-BRD 14 and 21) for dropped items | 4 (OI-13, OI-14, OI-15, OI-18) | See also OI-07 (owner work in small clinics) and OI-16 (a clinic that leaves). The Out of Scope list agrees with the flows. |
| Use-case exception coverage | Main, alternate, and exception flows of UC-01 to UC-16 for reversals, late or out-of-date actions, clashes over one slot, and changes after setup | 6 (OI-08, OI-09, OI-11, OI-21, OI-23, OI-24) | Single-message delivery failures, payment refusal, and empty states are covered or marked inline. |
| Matrix consistency | Chunk 07 rules 1 to 4 against the actor fields of every use case, the columns against chunk 04, and external parties against chunk 08 | 2 (OI-06, OI-07) | The four mechanical rules pass: each persona named as an actor has a Yes, each persona has use cases, and no external party is a column. |
| NFRs | NFR-01 to NFR-09 against the template's quality set, the use cases, and the legal constraints in chunk 02 | 3 (OI-12, OI-29, OI-30) | The open measures in NFR-01, NFR-02, NFR-03, NFR-05, NFR-06, and NFR-09 are marked inline and are not repeated here. |
| Integrations | Each partner in chunk 08 against the use cases that rely on it, the WhatsApp gate (BO-02), and partner failures as the clinic and the patient see them | 3 (OI-02, OI-10, OI-25) | Payment Gateway: refusal and overdue cases are covered or marked in UC-06; no further issue found. |
| Security / privacy | Consent, opt-out, children's data, licence timing, access by people outside the clinic, separation between clinics, and data shown to patients (chunk 02 Constraints 6 to 8, NFR-05, NFR-07, NFR-08, UC-09, UC-14, UC-16) | 5 (OI-01, OI-17, OI-19, OI-27, OI-28) | See also OI-06 (Clinic Reminders staff) and OI-29 (breach notice). NFR-05 keeps clinics apart, and patient look-up is per clinic (UC-07, step 4). |
| Data lifecycle | Creation, change, retention, and end of patient, appointment, waitlist, consent, staff-action, and clinic records (UC-05 to UC-16, NFR-06) | 3 (OI-16, OI-20, OI-22) | See also OI-12 (records kept from the first release). The retention periods are marked inline in NFR-06. |

<!--
Optional. Free-form notes from the reviewer that did not crystallise into a numbered open item.
Examples: patterns observed across multiple use cases, stylistic concerns, suggestions for a future revision.
-->

- **Other checks.** Conflicts between sections: OI-05 and OI-26, besides OI-01, OI-02, OI-11, and OI-12 above. Duplication: OI-03, and OI-05 for the status lists. Wording so vague that it hides a requirement: OI-04, plus OI-10, OI-23, and OI-28 above. Technical language in business text: no issue found. The body uses business terms, and chunk 12 parks the source's technical statements. Diagrams: Figures 1 to 3 were checked by reading. The Mermaid syntax is valid, and each figure has a Summary line.
- **Inline markers.** At review (version 1.0) the body held 88 `[NEEDS CLARIFICATION: ...]` markers, 63 of them proposals. Later decisions changed this count; chunk 14, step 1 lists the current markers. No item here repeats one, and no Recommended Answer settles or removes one. Where a Recommended Answer touches a flow with an open proposal, it points to that flow instead of restating it.
- **Numbering.** The new flows, use cases, footnote, and NFRs in the Recommended Answers assume the items are applied in OI order. Renumber when an earlier item is rejected or deferred.
  - UC-01: A2 and E3 (OI-08), E4 (OI-13), and a new step 8 (OI-19).
  - UC-02 A2 (OI-09), UC-06 A1 (OI-14), UC-07 A3 (OI-18), and UC-12 A4 and A5 (OI-23).
  - UC-13 E3 and UC-15 A3 (OI-24), and UC-13 E4 (OI-25).
  - New use cases UC-17 (OI-16) and UC-18 (OI-20), chunk 07 footnote ³ (OI-07), and NFR-10 and NFR-11 (OI-30).
- **Multi-tenancy.** Each clinic is a separate customer. The items that touch this are OI-06 (staff who could see several clinics), OI-16 (a clinic that leaves), and OI-27 (which clinic an opt-out covers under a shared sender number).
- **Figure 1.** OI-23 adds two transitions for corrected marks. If UC-10's proposed reset to Booked is confirmed, Figure 1 also needs a transition from Confirmed back to Booked. Done by OI-32 (2026-10-01).
- **Consent and opt-out log.** Chunk 09 lists it, but no use case delivers it, so it has no acceptance criteria and no matrix row. Who opens and exports it stays with the chunk 09 marker. Once that is settled, attach the log to a use case. Resolved by OI-40 (2026-10-01): UC-19.
- **The patient's own page.** NFR-05 says only the clinic's own staff see its patients. Yet each patient also sees their own appointment on the confirm or cancel page (UC-14). Name that exception the next time NFR-05 is edited. Resolved by OI-35 (2026-10-01).
- **Not raised as items (weaker evidence).**
  - No sending hours: UC-07 A1 sends at once, and UC-15 sends offers as soon as a slot frees, at any hour of the night. A rule with the hours left open may help.
  - Fee estimates: lost and recovered fees use the full consultation fee for every visit. Follow-up visits may cost less or nothing in Egyptian private practice (the reviewer did not check this), so the estimates may run high. UC-03 already calls them estimates.
- **Plain language (editorial).**
  - UC-01, Why: split the 22-word sentence into "Each doctor's fee lets the weekly report show fees lost and recovered. That is how the owner sees what the subscription is worth." Applied (2026-10-01).
  - UC-05, Business Rules, first bullet: five kinds of action sit in one sentence. Make it a list (writing-style rule 9).
  - UC-14, Business Rules, first bullet: "one reminder reaches the patient once" is hard to follow. Simpler: "The system sends the SMS only when the WhatsApp reminder was not delivered, so the patient gets each reminder once." Applied (2026-10-01).
  - NFR-02: "with no slower experience for clinics or patients". Simpler: "and clinics and patients notice no slowdown". Applied (2026-10-01).
  - One term for one thing: "withdraw consent" (UC-09 trigger, A1, and acceptance criteria) and "opt-out" (Glossary, UC-16) name the same act. Use "opt-out", or define withdrawal in the Glossary as an opt-out that staff record (writing-style rule 6). Resolved by OI-38 (2026-10-01).
  - "WhatsApp sender" (UC-01 step 6, E1, and acceptance criteria) and "dashboard" (UC-03, chunk 09) are used but are not in the Glossary (writing-style rule 7). Added to the Glossary (2026-10-01).
  - "Reception screens" (NFR-09, chunk 11) leaves out the owner's setup and billing screens. Say "clinic screens" if every screen is in Arabic.
  - Chunk 11, Language & Locale: "Numbers and dates follow the clinic's language setting" points to a setting that no use case creates. Name the format instead, including which digits Arabic screens and messages use.
  - Acceptance criteria run 25 to 35 words because of the Given, when, then form. That is acceptable.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
