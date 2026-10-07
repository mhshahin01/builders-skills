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
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, and a live remainder in a decision or marker record that needs a business choice (a business review point included) can add open items after the first review; a missing fact stays a to-do (TD) item only. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open, Deferred, or Decided - pending application. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Every unapplied item carries a concrete Recommended Answer and Why. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body. An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to its Resolution Log row. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
>
> **What this section is not.** It is not a list of `[NEEDS CLARIFICATION: ...]` markers found inside the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for.

---

## How to read each item

**Table 16 - How to read each item**

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

### OI-01: Which clinics can open an account

- **Where:** 02 Glossary ("Clinic"); 04 Project Scope (second paragraph); UC-01 Preconditions and step 4
- **Type:** Ambiguity
- **Concern:** Chunk 04 says the release "serves private clinics with 1 to 5 doctors in dentistry, dermatology, and pediatrics". UC-01 checks only the governorate. So a reader cannot tell if the three specialties are a sales focus or a rule that refuses other clinics at set-up. The word "private clinic" adds a second problem. Pre-BRD 07 (Total addressable customers row) says a private clinic has one physician or dentist under Law 51/1981, and it counts specialized clinics separately. Read that way, a clinic with 3 to 5 doctors is not a private clinic. The buyers the Clinic plan is priced for would then fail the UC-01 precondition. Set-up, sales, and test data all depend on the answer.
- **Options:**
  - **A.** Any clinic in Cairo or Giza with 1 to 5 doctors can join, private or specialized; the three specialties are the sales focus - widest market and matches MoSCoW; the pilot may include specialties the pre-BRD did not study.
  - **B.** Only the three specialties can join, and set-up refuses the rest - matches the target audience word for word; turns away paying clinics for no stated reason.
- **Recommended Answer:** Option A. In chunk 02, change the "Clinic" definition to: "A clinic in Cairo or Giza with 1 to 5 doctors that subscribes to the service. It can be a private clinic, which has one physician or dentist, or a specialized clinic (pre-BRD 07, Total addressable customers)." In UC-01, change the precondition to "The clinic is in Cairo or Giza." Add to UC-01 Business Rules: "Clinics of any specialty can open an account. Dentistry, dermatology, and pediatrics are the sales focus. **[NEEDS CLARIFICATION: proposed: clinics of any specialty can join; confirm or replace]**" In chunk 04, change "The release serves private clinics" to "The release targets clinics".
- **Why:** Pre-BRD 14 makes only "launch outside Cairo and Giza" a Won't-have. The specialties come from the target audience and the dental beachhead (pre-BRD 01, 21), which are sales choices, not product limits. Option A also stops the legal meaning of "private clinic" from shutting out 3 to 5 doctor clinics. The tradeoff is a less focused pilot if other specialties sign up.
- **Status:** Rejected: out of scope for this release (test-fixture policy). The Recommended Answer adds behaviour the pre-BRD does not state: clinics of any specialty can join, while the pre-BRD names three target specialties.

---

### OI-02: Pilot clinics have no rules for plan, allowance, or payment

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-03: Plan prices do not say whether VAT is included

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-04: The Clinic Reminders team has no defined access to clinic accounts

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-05: Appointments name no doctor before per-doctor calendars

- **Where:** 03 Staff and doctors, Appointment, Message content, Waitlist and slot offers, Table 6; UC-07 step 4 and E2; UC-09 step 2; UC-12 step 3; UC-16 step 1
- **Type:** Inconsistency
- **Concern:** Until per-doctor calendars arrive in Q2-2027, appointments and waitlist entries name no doctor (chunk 03; UC-07 step 4). Yet pilot clinics have 1 to 5 doctors (pre-BRD 01, Target Audience). In a 3-doctor clinic, two patients booked at 18:00 with different doctors set off UC-07 E2 ("doctor already booked") falsely. A freed slot with one doctor can go to a waitlisted patient who waits for another doctor (UC-16), in the pilot that measures BO-09. There is a second conflict. Pre-BRD 21 sells per-doctor calendars with the Clinic plan only, while chunk 03 and the use cases make them a feature for every clinic from Q2-2027. So the rules for a 2-doctor Starter clinic are unclear.
- **Options:**
  - **A.** From the first release, each appointment and waitlist entry names one doctor, used for the overlap warning and slot matching; separate calendar views stay a Q2-2027 Clinic-plan feature - correct matching in the pilot; one more field at entry and import.
  - **B.** Keep one clinic calendar until Q2-2027, and turn off the overlap warning and doctor matching for clinics with more than one doctor - no change now; wrong-doctor offers in the pilot.
  - **C.** Run the pilot with 1-doctor clinics only - simple; goes against the 1 to 5 doctor target and BO-05.
- **Recommended Answer:** Option A. In chunk 03 Staff and doctors, replace the last bullet with: "From the first release, each appointment and each waitlist entry names one of the clinic's doctors. The overlap warning (UC-07 E2) and slot matching (UC-16) use that doctor. Per-doctor calendars (Should, Q2-2027) add a separate calendar view for each doctor. **[NEEDS CLARIFICATION: proposed: as written, and per-doctor calendar views come with the Clinic plan only, as pre-BRD 21 prices them; confirm or replace]**" Then remove "once per-doctor calendars are live" where it limits the doctor's name in chunk 03 (Appointment overview, Message content proposal, Waitlist proposal), UC-07 step 4 and Business Rules, UC-09 step 2, and UC-12 step 3.
- **Why:** Only Option A keeps the overlap check and the BO-09 refill measure honest in a multi-doctor pilot, and naming a doctor is far smaller than building separate calendars. The split follows the source: pre-BRD 06 (section 3, Multi-doctor and multi-branch support row: "Owner adds doctors") and pre-BRD 21 (Clinic plan). The tradeoff is one more field at entry and import in the first release.
- **Status:** Rejected: out of scope for this release (test-fixture policy). The Recommended Answer adds behaviour the pre-BRD does not state: each appointment names a doctor from the first release, while the pre-BRD places per-doctor calendars in Q2-2027.

---

### OI-06: The status model misses two paths and the day-view labels

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-07: One mobile number can belong to several patients

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-08: Nothing records that a patient is under 15

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-09: Waitlist entries never end

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-10: Doctors, appointments, and patient details cannot be changed

- **Where:** UC-01; UC-05 A2; UC-06 (proposed log contents); UC-07; UC-11
- **Type:** Gap
- **Concern:** The BRD lets staff create and cancel, but never change. UC-05 A2 assumes "the owner adds a third doctor or removes one", and the UC-06 proposal logs "changing ... appointments", yet no use case covers either action. Daily reception work needs both. A patient moves a visit by phone, or the Receptionist corrects a wrong mobile number that made the reminder fail. Today the only route is to cancel and add again. That sends the patient a cancellation, offers the slot to the waitlist, and loses the confirmation. Removing a doctor who still has future appointments is also undefined.
- **Options:**
  - **A.** Add three flows to existing use cases: change doctors (UC-01), change an appointment, and correct the patient's details (UC-07) - small change; no new matrix rows.
  - **B.** Add two new use cases, "Manage the clinic's doctors" (Clinic Owner) and "Change an appointment" (Receptionist), each with a journey line, all nine sections, a Use Case Summary row, and a matrix row - clearer; more to write and test.
  - **C.** Keep cancel and add again - nothing to build; wrong messages and wrong waitlist offers.
- **Recommended Answer:** Option A. Add to UC-01: "**A2 - Doctors change later:** The Clinic Owner opens the clinic settings and adds or removes a doctor. The plan changes as UC-05 A2 describes. **[NEEDS CLARIFICATION: proposed: a doctor with future appointments cannot be removed until the Receptionist moves or cancels them; confirm or replace]**" Add to UC-07: "**A3 - Change an appointment:** The Receptionist changes the date, the time, or the doctor of an appointment. The system sets a new reminder time. **[NEEDS CLARIFICATION: proposed: the old slot goes to the waitlist (UC-16), the appointment goes back to Booked, and the patient gets a new reminder; confirm or replace]**" and "**A4 - Correct the patient's details:** The Receptionist corrects the patient's name, mobile number, or message language. Reminders not yet sent use the new details. **[NEEDS CLARIFICATION: proposed: as written; confirm or replace]**"
- **Why:** UC-05 A2 and the UC-06 proposal already depend on these actions, and pre-BRD 04 lists "handle cancellations, rebook from the waiting list, answer patient calls" as the Receptionist's daily jobs. Flows inside existing use cases add the behaviour without new matrix rows. The tradeoff is longer UC-01 and UC-07 blocks to build and test.
- **Status:** Rejected: out of scope for this release (test-fixture policy). The Recommended Answer adds behaviour the pre-BRD does not state: new flows to change doctors, change an appointment, and correct patient details.

---

### OI-11: Appointments that get no reminder never reach the call list

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-12: The owner's view of the day list is source-stated but not allowed

- **Where:** 07 Users & Use Cases Matrix (UC-10 row) and Notes; 11 UI/UX Expectations (Responsive Design); 04 Personas (Clinic Owner access level); UC-10 Supporting Actors
- **Type:** Inconsistency
- **Concern:** Pre-BRD 05 (Clinic owner, Does) says the owner "checks the day's list on a phone between patients", and the Responsive Design proposal in chunk 11 rests on that sentence. But chunk 07 gives the Clinic Owner "-" for UC-10, and the owner's access level in chunk 04 leaves the day view out. The open marker in chunk 04 asks whether the owner can do the Receptionist's work (add appointments, keep the waitlist, record attendance). Viewing the day is a narrower case, and the source already settles it.
- **Options:**
  - **A.** Give the owner view-only access to the day view now, and leave the write actions to the open question in chunk 04 - matches the source; the owner sees names and numbers of the clinic's own patients.
  - **B.** Keep "-" and drop the owner reason from chunk 11 - consistent; goes against the source.
- **Recommended Answer:** Option A. In UC-10, set Supporting Actors to "Persona: Clinic Owner (view only)" and add: "**A4 - Owner checks the day:** The Clinic Owner opens the day view and sees the day's appointments and statuses (steps 1 to 5). Whether the owner can also record answers or cancel follows the open question in chunk 04." In chunk 07, set the UC-10 Clinic Owner cell to "Yes⁵" with the footnote "⁵ View only (UC-10 steps 1 to 5)." In chunk 04, add "checks the day view" to the Clinic Owner's Access Level.
- **Why:** The source states the behaviour, so the matrix must not deny it. View-only access stays inside NFR-04, because the owner is the clinic's own staff, and the wider question stays open. The tradeoff is one more screen the owner must be able to use on a phone.
- **Status:** Rejected: out of scope for this release (test-fixture policy). The Recommended Answer adds behaviour the pre-BRD does not state: Clinic Owner access to the day view; pre-BRD 05 describes the owner's current habit, not a product feature.

---

### OI-13: A clinic's own cancellation goes to the waitlist

- **Where:** UC-11 Trigger, Main Flow, and Business Rules; 03 Waitlist and slot offers (Overview)
- **Type:** Missing scenario
- **Concern:** UC-11 covers only a patient who cannot come, but clinics cancel too: the doctor is ill, travels, or ends a session early. The UC-11 rule says "Every cancellation triggers slot offers to the waitlist, whoever cancels", and chunk 03 says the same. So when the Receptionist cancels a sick doctor's day, the system offers those slots to waitlisted patients. The first to accept is booked with a doctor who is not there. The patients whose visits the clinic cancelled also get no message, though the product exists to replace such calls. A message to them would also need its own approved template.
- **Options:**
  - **A.** Add a "cancelled by the clinic" choice: no waitlist offer, and the patient gets a short notice to book again - protects the waitlist; needs one more approved template.
  - **B.** Add the choice with no patient message; reception calls each patient - no new template; more calls.
  - **C.** Keep one cancel action - nothing to build; offers for slots no doctor can keep.
- **Recommended Answer:** Option A. Add to UC-11: "**A2 - Clinic cancels:** At step 3, the Receptionist cancels because the clinic cannot see the patient, for example because the doctor is absent, and marks the cancellation as made by the clinic. The system sets the status to Cancelled. **[NEEDS CLARIFICATION: proposed: a cancellation made by the clinic is not offered to the waitlist, and the system sends the patient a short message that the clinic cancelled the appointment and asks the patient to call the clinic to book again; confirm or replace]**" Change the UC-11 rule to: "Every cancellation by a patient, by message or through the Receptionist, triggers slot offers to the waitlist." In chunk 03 Waitlist and slot offers, change "When an appointment is cancelled" to "When a patient cancels an appointment".
- **Why:** Pre-BRD 01 (Proposed Solution) ties the waitlist trigger to the patient's cancel reply, so "whoever cancels" goes beyond the source and creates offers the clinic cannot honour. A short notice keeps the promise of no reminder calls (pre-BRD 01, Overview). The tradeoff is one more template for Meta to approve and one more choice for the Receptionist.
- **Status:** Rejected: out of scope for this release (test-fixture policy). The Recommended Answer adds behaviour the pre-BRD does not state: a cancelled-by-the-clinic flow with a new patient message.

---

### OI-14: Answers that arrive after the appointment changed

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-15: Reception is not told when a patient cancels

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-16: Who pays for SMS when WhatsApp cannot send at all

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-17: The SMS link page is open to anyone who holds the link

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-18: An opt-out given by phone or at the desk has no path

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-19: The weekly report template is missing from the launch plan

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-20: The weekly report drops two items the pre-BRD describes

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-21: No report measures the objectives across clinics

- **Where:** 09 Reporting / Analytics (Table 12); 01 BO-07, BO-08, BO-09, and BO-13
- **Type:** Gap
- **Concern:** BO-07 to BO-09 and BO-13 are measured across the pilot and the paying base (pre-BRD 15; pre-BRD 21, Q1-2027: "measure no-show change and waitlist use"). Every report in chunk 09 serves one clinic, and NFR-04 keeps each clinic's data with its own staff. So nobody can see, for example, whether 98% of reminders were delivered across all clinics (BO-08) without collecting each clinic's figures by hand. The founders, who own these objectives, are not personas and have no view of the product.
- **Options:**
  - **A.** A summary for the founders with counts per clinic and in total, and no patient names or numbers - measures every objective; one more report to build.
  - **B.** The founders collect figures from each clinic's weekly report - nothing to build; slow, and the weekly report has no delivery counts.
  - **C.** Give the founders a login to clinic data - complete; breaks NFR-04.
- **Recommended Answer:** Option A. Add a row to Table 12. Report / View: "Service results summary". What It Shows: "For each clinic and for all clinics: reminders delivered by WhatsApp and by SMS, patient answers, the no-show rate, cancelled slots refilled from the waitlist, and weekly reports read. Counts only, with no patient names or numbers (BO-07 to BO-09, BO-13). **[NEEDS CLARIFICATION: proposed: as written; confirm or replace]**" Audience: "Clinic Reminders founders". Frequency: "**[NEEDS CLARIFICATION: proposed: monthly, and weekly during the pilot; confirm or replace]**". Format: "**[NEEDS CLARIFICATION: how do the founders receive it, outside the clinic accounts?]**".
- **Why:** The objectives cannot be judged without figures across clinics, and counts with no patient details keep NFR-04 and the processor role (assumption 27) intact. The tradeoff is one more report to build before the pilot readout.
- **Status:** Rejected: out of scope for this release (test-fixture policy). The Recommended Answer adds behaviour the pre-BRD does not state: a new cross-clinic results report for the founders.

---

### OI-22: Breach notice and patient requests have no owner or path

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-23: Retention rules do not say which logs, or from when

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-24: The NFRs miss timeliness and data safety

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-25: Reminders for appointments that are not Booked

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-26: Which plans get per-doctor calendars

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-27: The language of patient messages

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-28: When a persona counts as a supporting actor

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-29: The supporting-actor rule and the UC-17 Receptionist

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-30: Reminders for a Confirmed appointment

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-31: Where the patient's message language is set

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-32: Patients with a mobile number outside Egypt

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log row](#resolution-log)

---

### OI-33: The message language of a returning patient

- **Where:** 03 Message content (first bullet, the OI-31 proposal); UC-07 step 4; UC-09 step 2 (raised by consistency check CF-29)
- **Type:** Gap
- **Concern:** OI-31 sets the message language once per patient and lets it be changed later. But UC-07 step 4 and UC-09 step 2 still ask for it with every appointment or file row, and no flow says what a different entry for a known patient does. So "can be changed later" has no home, and the Arabic default in UC-07 step 4 could reset a known patient's language without anyone noticing. OI-10, which would have added a flow to correct patient details, was rejected.
- **Options:**
  - **A.** Ask only when the patient has no language yet, as UC-12 step 3 does, and drop "can be changed later" - simplest; a patient can never switch language.
  - **B.** Keep asking with each appointment or file row; for a known patient, a different choice changes the language for messages not yet sent, and the Arabic default applies to new patients only - gives "can be changed later" a testable home in existing steps; one more rule to test.
  - **C.** Add a question to the proposal - settles nothing.
- **Recommended Answer:** Option B. In chunk 03 Message content, replace the proposal in the first bullet with: "**[NEEDS CLARIFICATION: proposed: the message language belongs to the patient; it is set when the patient is first added (UC-07, UC-09, or UC-12) and can be changed later; a change applies to messages not yet sent; for a patient the clinic already knows, a different language entered in UC-07 step 4 or UC-09 step 2 is such a change, and the Arabic default of UC-07 step 4 applies to new patients only; confirm or replace]**"
- **Why:** It gives the decided "can be changed later" (OI-31) a testable home without a new flow, and it stops the Arabic default from resetting a known patient's choice. The tradeoff is one more rule to test.
- **Status:** Decided - pending application. Option B, decided by the user on 2026-10-07. The consistency check raised this item in its third run, so the next request applies the decision and rechecks it (to-do TD-87).

---

## Resolution Log

**Table 17 - Resolution Log**

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-10-07 | The full entry above (OI-01) | Rejected: out of scope for this release (test-fixture policy) |
| OI-02 | 2026-10-07 | 03 / Subscription plans (Pilot clinics) | Accepted recommendation |
| OI-03 | 2026-10-07 | 03 / Subscription plans (marker under Table 6) | Accepted recommendation |
| OI-04 | 2026-10-07 | 04 / Personas / Actors (team paragraph) | Accepted recommendation |
| OI-05 | 2026-10-07 | The full entry above (OI-05) | Rejected: out of scope for this release (test-fixture policy) |
| OI-06 | 2026-10-07 | 03 / Appointment statuses (Table 5, Day view labels, Figure 1) | Accepted recommendation |
| OI-07 | 2026-10-07 | 03 / Consent record, Rules | Accepted recommendation |
| OI-08 | 2026-10-07 | 06b / UC-07 step 4; 06b / UC-09 step 2; 03 / Consent record, Rules | Accepted recommendation |
| OI-09 | 2026-10-07 | 03 / Waitlist and slot offers, Rules | Accepted recommendation |
| OI-10 | 2026-10-07 | The full entry above (OI-10) | Rejected: out of scope for this release (test-fixture policy) |
| OI-11 | 2026-10-07 | 06b / UC-10 A3 and Acceptance Criteria | Accepted recommendation |
| OI-12 | 2026-10-07 | The full entry above (OI-12) | Rejected: out of scope for this release (test-fixture policy) |
| OI-13 | 2026-10-07 | The full entry above (OI-13) | Rejected: out of scope for this release (test-fixture policy) |
| OI-14 | 2026-10-07 | 06c / UC-14 E3; 03 / Reminders, Channels | Accepted recommendation |
| OI-15 | 2026-10-07 | 06c / UC-14 A1 and UC-15 A1; 09 / Day view row | Accepted recommendation |
| OI-16 | 2026-10-07 | 03 / Reminders, Channels | Accepted recommendation |
| OI-17 | 2026-10-07 | 06c / UC-15 Business Rules & Constraints | Accepted recommendation |
| OI-18 | 2026-10-07 | 06c / UC-17 Supporting Actors, A3, Acceptance Criteria; 07 / UC-17 row and footnote 5 | Accepted recommendation |
| OI-19 | 2026-10-07 | 02 / Dependencies (Meta row); 06a / UC-03 Business Rules & Constraints | Accepted recommendation |
| OI-20 | 2026-10-07 | 06a / UC-03 Future Enhancements | Accepted recommendation |
| OI-21 | 2026-10-07 | The full entry above (OI-21) | Rejected: out of scope for this release (test-fixture policy) |
| OI-22 | 2026-10-07 | 02 / Assumptions / Constraints 9 and 29; 02 / Dependencies (counsel row) | Accepted recommendation |
| OI-23 | 2026-10-07 | 02 / Assumptions / Constraints 11 and 15; 10 / NFR-05 | Accepted recommendation |
| OI-24 | 2026-10-07 | 10 / NFR-07 and NFR-08 | Accepted recommendation |
| OI-25 | 2026-10-07 | 06c / UC-14 Preconditions | Accepted recommendation |
| OI-26 | 2026-10-07 | 03 / Staff and doctors; 04 / In Scope item 10 | Accepted recommendation |
| OI-27 | 2026-10-07 | 06b / UC-07 Business Rules & Constraints (BR-3) | Accepted recommendation |
| OI-28 | 2026-10-07 | 07 / Notes | Accepted recommendation |
| OI-29 | 2026-10-07 | 07 / Notes (supporting-actor rule) | Accepted recommendation |
| OI-30 | 2026-10-07 | 03 / Appointment statuses (proposal after Day view labels, Figure 1); 06c / UC-14 E2 | Accepted recommendation |
| OI-31 | 2026-10-07 | 03 / Message content; 06b / UC-12 step 3 | Accepted recommendation |
| OI-32 | 2026-10-07 | 06b / UC-07 Business Rules & Constraints | Accepted recommendation |

---

## Reviewer Notes

**Table 18 - Reviewer coverage record**

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Each In Scope and Out of Scope item against pre-BRD 01, 02, 14, and 21 and the use cases; phases; who may join; the pilot period | 2 findings (OI-01, OI-02) | Optional new scope is under Scope proposals below |
| Use-case exception coverage | Each Main Flow step of UC-01 to UC-17 where an actor decides or a partner is involved; changes after creation; who cancels; late answers; opt-out channels | 6 findings (OI-10, OI-11, OI-13, OI-14, OI-15, OI-18) | Many branches are already marked inline (for example UC-05 E2, UC-07 E1, UC-16 E2) and are not repeated |
| Matrix consistency | Every actor field of UC-01 to UC-17 against Table 10 both ways; every persona has use cases; no external party is a column; footnotes | 1 finding (OI-12) | OI-18 also adds a matrix cell; an actor-convention note is below |
| NFRs | NFR-01 to NFR-06 against the business objectives, constraints 9, 11, 15, and 21, and the use cases; missing qualities | 1 finding (OI-24) | The NFR-02, NFR-03, and NFR-05 measures are already marked; NFR-01 and NFR-04 wording notes are below |
| Integrations | Each partner in Table 11 for failures the user sees: not delivered, cannot send, template approval, payment refused | 2 findings (OI-16, OI-19) | SMS not delivered and payment refused are covered (UC-15 E1, UC-05 E1) |
| Security / privacy | Data separation between clinics, team access, consent for children, shared phones, the SMS link page, PDPL duties | 5 findings (OI-04, OI-07, OI-08, OI-17, OI-22) | Export proposal note below |
| Data lifecycle | Retention of each record type, the start of each period, waitlist entries, deletion on request, a clinic that leaves | 2 findings (OI-09, OI-23) | A clinic that stops paying is already marked in NFR-05; deletion on request is in OI-22 |
| Section conflicts | Chunk 03 rules and statuses against the use cases; chunk 11 against chunk 07 | 2 findings (OI-05, OI-06) | OI-12 is counted under Matrix consistency |
| Reporting and billing | Chunk 09 against pre-BRD 04, 06, and 15; plan prices and UC-05 against pre-BRD 03, 06, and 21 | 3 findings (OI-03, OI-20, OI-21) | |
| Multi-tenancy | Clinic data separation, the shared WhatsApp sender and its daily limit, team access across clinics, measuring across clinics | Counted above (OI-04, OI-16, OI-21) | Shared-sender quality note below |
| Regulatory hooks | Every constraint from pre-BRD 08 against the use cases; VAT; children's consent; breach notice; patient requests; retention | Counted above (OI-03, OI-08, OI-22, OI-23) | Patient rights are flagged for counsel, not stated (OI-22) |
| Technical language | All chunks except 12 for technology names, protocols, and technical targets | No issue found | "CSV file" is a user-facing format the source states, and the Glossary defines it |
| Duplication | Facts stated in two or more chunks; pre-BRD figures copied instead of linked | No open item; 3 notes below | The pre-BRD verdict and market figures are cited, not copied |
| Plain language | Wording so vague or complex that it hides a requirement; long or heavy sentences | No separate open item; 2 notes below | OI-01, OI-03, and OI-23 are Ambiguity items counted above |

**Scope proposals**

Owner decision, 2026-10-07: none of the four scope proposals below is adopted (out of scope for this release, test-fixture policy). See [decision-log.md](./decision-log.md).

- **Scope proposal - Close the clinic account.** Source: BO-12 (monthly logo churn at or below 3%, pre-BRD 15 O3 KR3) expects clinics to leave, and the NFR-05 marker asks what happens to a clinic's data when it stops paying. No use case lets the Clinic Owner end the subscription; today a clinic can leave only by not paying (UC-05 E2). Recommendation: once NFR-05 is answered, add a Clinic Owner use case "Close the clinic account" (stop all messages, settle the last payment, and hand over or delete the data), with a journey line, all nine sections, a Use Case Summary row, and a matrix row. Tradeoff: more scope before the paid launch, against an exit path that runs only through missed payments.
- **Scope proposal - Quiet hours for reminders and slot offers.** Source: patients are "sensitive to spam" (pre-BRD 05, Patient, Feels), and clinics run evening lists (pre-BRD 05, Clinic owner, Says: "Half my evening list did not come"). With the 24-hour default, a 23:00 visit gets its reminder at 23:00 the night before. A slot offer after a night-time cancellation favours patients who are awake, because the first to accept wins. Recommendation: a clinic setting in UC-04 for hours when no reminder or offer goes out, with the default set by the owner. Tradeoff: some reminders move away from the set lead time, and night offers wait until morning, which shortens the time to refill.
- **Scope proposal - Prompt reception to record whether patients came.** Source: pre-BRD 06 (section 3, No-show and cancellation analytics row: "depends on reception marking attendance") and a doctor's review quoted in pre-BRD 06 (section 2, Schedule and calendar management row) show that staff may skip this step; BO-07 and the weekly report (UC-03) depend on it (UC-13). Recommendation: the day view shows the count of past appointments with no outcome and asks the Receptionist to record them at the end of the day. Tradeoff: one more prompt in a busy day, against weekly reports with "not recorded" gaps (UC-03 E1).
- **Scope proposal - Cancel a doctor's whole day at once.** Source: the clinic cancellation case in OI-13; a sick doctor's day can hold many visits. Recommendation: if OI-13 is accepted, a UC-11 alternate flow that cancels all of one doctor's appointments on one day with a single confirmation. Tradeoff: much faster for reception; a bulk action needs a strong confirmation step (the chunk 11 proposal for destructive actions comes from the author's global UX defaults, not a project source).

**Notes**

- Action taken, 2026-10-07: the Duplication, Consistency, Plain language, Marker coverage, and Over-marking notes below were acted on by consistency check Run 1 (CF-01, CF-02, CF-07, CF-11, CF-15; the UC-08 actor note became OI-28). The Foreign mobile numbers note became OI-32. See [decision-log.md](./decision-log.md).
- Standards applied: the brd-unifier templates and rules, cited per item. The project has no AGENTS.md and no UI/UX constitution. The author's global UX defaults appear only where chunk 11 already labels them as proposals. The reviewer's general knowledge is labelled where used (OI-22 and the BO-13 and foreign-number notes below).
- Duplication: the 24-hour default reminder time is stated in chunk 03 (Reminders, Timing), in UC-04 (step 2, Business Rules, Acceptance Criteria), and in UC-14 (Trigger, Business Rules). Keep it in chunk 03 Timing and link to it from UC-04 and UC-14.
- Duplication: walk-ins appear as constraint 22 and as an Out of Scope line in chunk 04, both citing pre-BRD 02 Limitations (4). Keep the Out of Scope line and make constraint 22 a link to it.
- Duplication: NFR-03 repeats the 250-user limit of constraint 21. Simpler: "The new-sender limit in constraint 21 applies."
- Consistency: UC-06 Why says it serves BO-01, but UC-06 is a Should-have item (chunk 04, item 13) and BO-01 covers the eight Must-have items. Simpler: "It answers the owner's fear of liability for patient data (pre-BRD 04); no business objective measures it."
- Consistency: the second UC-03 precondition requires the week's outcomes to be recorded (UC-13), but UC-03 E1 handles outcomes that are not recorded. Drop that precondition; E1 already covers the case.
- Consistency: UC-08 lists the Patient as a supporting actor for a phone or desk conversation, while UC-10 (steps 6 and 7), UC-11, and UC-12 involve the patient the same way and list "None". Pick one convention; a listed patient needs a footnoted Yes in chunk 07.
- Plain language: NFR-01 "Every reminder reaches the patient" promises 100%, while its measure is 98% (BO-08). Simpler: "Reminders reach patients by WhatsApp or SMS. At least 98% are delivered (BO-08)."
- Plain language: NFR-04 "reported to the PDPC in time" is vague. Write "within 72 hours" in the expectation as well as in the measure.
- Marker coverage: pre-BRD 24 OI-11 (manual-assist waitlist) is marked in BO-09, In Scope item 7, and UC-16, but not in chunk 03 Waitlist and slot offers, which states the automatic-offer rule taken from pre-BRD 14 Must (7). Pre-BRD 24 OI-12 (template-only report) is marked only in chunk 04, not in UC-03 or chunk 09, and its outcome also affects the UC-03 E2 proposal to keep the report in the clinic account. sow-transformation.md (pre-BRD table, row 24) puts the marker at every home that took the content: copy the existing marker text there.
- Over-marking: UC-16 A1 is marked as a proposal, but "others told it is filled" is stated in pre-BRD 06 (section 3, Waitlist auto-fill row). Only "keeps that patient on the waitlist" is a proposal.
- Export proposal: the Data Tables proposal in chunk 11 (CSV and Excel export) would carry patient names and mobile numbers out of the product from the day view. Weigh it against NFR-04 when that marker is answered.
- Shared sender: if pre-BRD 24 OI-15 picks one shared WhatsApp number, one clinic's blocked or reported messages lower the quality rating for every clinic (pre-BRD 24 OI-15, option B). Weigh this when the constraint 21 marker is answered.
- Pilot design: if pre-BRD 24 OI-07 is decided as a concurrent control (a random half of appointments gets no reminder), the first release must hold back reminders for that half and report both halves. No use case covers this yet; raise it as an open item when that decision is made.
- BO-13 measure: UC-03 step 5 counts a report as read from WhatsApp's read signal. An owner who turns off read receipts in WhatsApp may never show as a reader, so BO-13 may read low. This is the reviewer's knowledge of WhatsApp, not a project source.
- Foreign mobile numbers: UC-07 and UC-09 have no rule for numbers outside Egypt. The SMS fallback runs through an Egyptian aggregator under a sender ID registered with the four Egyptian networks (constraints 3 and 18), and the pre-BRD gives only the Egypt WhatsApp rate (08, Technological (1)). Meta pricing by the patient's country is the reviewer's knowledge, not a project source. Decide whether foreign numbers get WhatsApp reminders only.
- Strategy: pre-BRD 19 (Differentiators) and 22 (condition 2) name a cross-clinic no-show dataset as the asset to build. Under assumption 27 each clinic controls its patients' data, so pooling data across clinics would need counsel and a BRD change. No action for this release.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
