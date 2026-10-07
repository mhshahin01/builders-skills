<!--
CHUNK: 14
TITLE: Product Manager To-Do
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: all BRD chunks (00 through 13); updated again after 15, 16, 17 are produced
PART OF: BRD - Clinic Reminders
TYPE: Delivery chunk - living checklist
MERGE: Excluded. Never part of the merged or combined BRD. Not an input to sdd-unifier.
PURPOSE: Prioritised checklist guiding the product manager from a drafted BRD to a finalised one, in a fixed order: resolve open items -> consistency check -> grill-me -> Figma mockups -> use-case diagrams and flowcharts.
EVIDENCE RULE: Creating this checklist completes none of its steps. A step is Complete only when its Evidence cell names what was checked, when, and by whom.
DELIVERY GATE: Chunks 15, 16, and 17 cannot be generated or refreshed until all five steps here are Complete with evidence and every to-do item is Resolved. Deferred does not count as closed. There is no override.
RULES: delivery-chunks.md in the brd-unifier skill.
-->

# Product Manager To-Do

> **What this is.** The ordered list of what still has to happen before this BRD can be treated as final, and what each downstream output is waiting for. It is a living checklist: statuses, links, and evidence are updated as work happens.
>
> **What this is not.** It is not a requirements document and not the home of any diagram. Requirements live in chunks 00-13; use-case diagrams and flowcharts are drawn in chunks 05 and 06*.

**Last updated:** 2026-10-07 | **BRD version:** 1.0 | **Steps complete:** 0 of 5

**Status values:** Not started / In progress / Blocked (by what) / Pending gate (new or unstarted work while G1-G3 fail) / Complete (evidence required). Reopen only changed inputs; unchanged completed rows keep their evidence while the overall gate pauses new work.

---

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | In progress | Not complete: TD-01 to TD-77 are open | Step 2 |
| 2 | Run a consistency check across all BRD chunks | In progress | Runs 1 to 3 on 2026-10-07; not complete: CF-28 to CF-34 wait for the next request | Step 3 |
| 3 | Finalise requirements with the grill-me skill | Not started | None yet. Recommended, not executed. | Steps 4 and 5 |
| 4 | Generate mockups in Figma | Pending gate | None yet | The delivery gate: chunks 15, 16, 17 (with step 5) |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Pending gate | None yet | The delivery gate: chunks 15, 16, 17 (with step 4) |

## Delivery gate

> Chunks 15, 16, and 17 are **locked** until every row below says `Met`. `Deferred` items do not count as closed. There is no override.

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete: every to-do item `Resolved`; no Open, Deferred, or Decided - pending application item in chunk 13; no clarification marker left in chunks 00-12 | Not met | TD-01 to TD-77 (TD-01 to TD-24 are P1); 130 clarification markers in chunks 00-12, proposals included. TD-86 to TD-92 and OI-33 (chunk 13) are Decided - pending application. |
| G2 | Step 2 complete: check rerun after the last BRD change; every finding has a disposition and none is still waiting on a decision | Not met | Run 3 found CF-28 to CF-34. The user decided all seven on 2026-10-07, but they are third-run discoveries: the next request applies them (TD-86 to TD-92) and runs a recheck. |
| G3 | Step 3 complete: grill-me session confirmed; decisions applied | Not met | The grill-me session has not run. |
| G4 | Step 4 complete: every mockup approved; review/play-through confirmed; links in UC UI/UX or owning no-UC report/requirement section | Not met | MK-01 to MK-14 are not started; they wait for G1 to G3. |
| G5 | Step 5 complete: use-case diagrams and flowcharts added; consistency check rerun | Not met | The 3 use-case diagrams and 17 flowcharts are not drawn; they wait for G1 to G3. |

**Gate:** Shut | **Next action:** Decide the P1 items TD-01 to TD-24, then run /grill-me with the prompt in step 3. The next brd-unifier request first applies TD-86 to TD-92.

## Downstream outputs

<!-- State: Locked (not written yet: it waits for the gate, or for the chunk before it) / Up to date ([date], BRD v[X.X]) / Provisional (TD-NN: a gap found while writing it) / Stale (a change listed in delivery-chunks.md § Refresh triggers came after it was written; locked until the gate is open again). -->

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | 15-implementation.md | Locked | G1, G2, G3, G4, G5 |
| UAT/BAT test cases | 16-uat-bat-test-cases.md | Locked | Gate, then chunk 15 written with no new open item |
| Presentation and video brief | 17-for-ppt.md | Locked | Gate, then chunks 15 and 16 written with no new open item |

---

## Step 1 - Resolve open items and clarifications

| | |
|---|---|
| **Status** | In progress |
| **Required inputs** | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md); every inline `[NEEDS CLARIFICATION: ...]` marker in chunks 00-12; Assumptions and Dependencies in [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md) |
| **Expected output** | Every row below is `Resolved`: the decision is applied to the BRD, and the Resolution Log and Changes Log are updated |
| **Completion criteria** | Every row is `Resolved`, each pointing at where the decision was applied. No Open, Deferred, or Decided - pending application item is left in chunk 13. No clarification marker is left in chunks 00-12. A `Deferred` row stays visible and keeps this step incomplete and the delivery gate shut. |
| **Evidence** | None yet. TD-01 to TD-77 are open. TD-86 to TD-92 are decided and wait for the next request. TD-78 to TD-85 were raised and resolved in this request (OI-25 to OI-32). |

### Open items register

<!-- One row per unresolved question, assumption needing validation, or pending decision. Sorted P1 first. Kind is one of: Open question, Assumption to validate, Pending decision. Source names the chunk and the exact place (for example a section, a UC step or ID, an OI-NN, a CF-NN or DP-NN, an assumption, or a dependency). Blocks names the use cases, NFRs, or chunk sections the row blocks. The row links to the source; it does not copy the source's options or recommended answer. Priority: P1 blocks a Main Flow or an acceptance criterion; P2 affects alternate/exception flows, NFR measures, integrations, reports; P3 is wording only. Every priority blocks the delivery gate. Status: Open / Decided - pending application (a third-run decision: the decision, who decided and the date in the Decision or clarification needed cell; still blocks the gate) / Resolved ([where applied]) / Deferred ([why]; still blocks the gate). "Resolved" means a decision is recorded and applied to the BRD. An assumption is Resolved when its owner confirms it, replaces it, removes its dependent scope, or accepts it conditionally with the owner, condition and consequence recorded; if a flow or expected result is still undecidable, the row stays open. -->

Open rows are sorted P1 first: TD-01 to TD-24 are P1, TD-25 to TD-68 are P2, and TD-69 to TD-77 are P3. TD-86 to TD-92 came from the third consistency run: each is decided and waits for the next request, and each sits with its priority group. The rows resolved in this request follow the open rows. No owner was named, and the BRD author is not named yet (TD-77), so every Owner cell reads "Recommendation: BRD author (not named; TD-77)". Rows marked "Counsel to answer" go to Egyptian data-protection counsel (pre-BRD 02, Stakeholders).

| ID | Priority | Kind | Source (chunk / identifier) | Decision or clarification needed | Blocks | Owner | Status |
|----|----------|------|-----------------------------|----------------------------------|--------|-------|--------|
| TD-01 | P1 | Open question | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives); [04 / Project Scope](./04-scope-and-personas.md#project-scope); pre-BRD 24 OI-01 | Does a low-cost validation gate (clinic records, owner interviews, a small hand-run test) run before the build, with the build starting only if it passes? | BO-01 to BO-09 dates; 04 In Scope phases | Recommendation: BRD author (not named; TD-77) | Open |
| TD-02 | P1 | Open question | [01 / BO-04](./01-executive-summary-and-context.md#business-objectives); [02 / Constraint 5](./02-glossary-assumptions-facts.md#assumptions--constraints); [02 / Dependency "PDPC licence and registered DPO"](./02-glossary-assumptions-facts.md#dependencies); pre-BRD 24 OI-05 | Is the target a granted PDPC licence by 2027-01-15 rather than a filed application, and does each clinic need its own licence? | BO-04; constraint 5; UC-01; go-live | Recommendation: BRD author (not named; TD-77) | Open |
| TD-03 | P1 | Open question | [04 / Project Scope](./04-scope-and-personas.md#project-scope); [06a / UC-03 Business Rules](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report); [09 / Weekly no-show report row](./09-reporting-and-analytics.md#reporting--analytics); pre-BRD 24 OI-12 | Does the team re-estimate the MVP at 65% coding time and cut Must (7) to a manual-assist waitlist and Must (8) to a template-only report? | 04 In Scope items 7 and 8; UC-03; UC-16 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-04 | P1 | Open question | [02 / Constraint 21](./02-glossary-assumptions-facts.md#assumptions--constraints); [02 / Dependency "Meta business verification and approved templates"](./02-glossary-assumptions-facts.md#dependencies); [06a / UC-01 Business Rules](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic-account); [08 / WhatsApp Business Platform row](./08-integrations.md#integrations); [12 / Technical Inputs, row 1](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd); pre-BRD 24 OI-15 | Do the clinic's messages go from the clinic's own WhatsApp number or from one shared Clinic Reminders number? | UC-01 Main Flow; 08 WhatsApp row; NFR-03; constraint 21 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-05 | P1 | Open question | [02 / Constraint 6](./02-glossary-assumptions-facts.md#assumptions--constraints); [06b / UC-08 step 3](./06b-use-cases-receptionist.md#uc-08-record-a-patients-consent); pre-BRD 08 Legal (2) | Does a WhatsApp opt-in count as the written explicit consent the PDPL requires, and how does a patient who books by phone give it? Counsel to answer. | UC-08 step 3; UC-07 A1; UC-09 step 8 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-06 | P1 | Open question | [03 / Waitlist and slot offers, Rules](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers) | Does the system offer a freed slot to one waitlisted patient at a time, in order, or to all matching patients at once? | UC-16 steps 2 to 5 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-07 | P1 | Open question | [03 / Waitlist and slot offers, Rules](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers); [06c / UC-16 E1](./06c-use-cases-patient.md#uc-16-accept-a-waitlist-slot-offer) | How long does a slot offer stay open, and how close to the visit time can a freed slot still go to the waitlist? | UC-16 Main Flow and E1 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-08 | P1 | Open question | [06a / UC-03 Trigger](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) | On which day and at what time does the weekly report go out, and which seven days does it cover? | UC-03 step 1; BO-13 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-09 | P1 | Open question | [06a / UC-04 step 3](./06a-use-cases-clinic-owner.md#uc-04-set-the-reminder-timing) | Which first-reminder times can the owner choose (the earliest and the latest before the visit)? | UC-04 step 3 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-10 | P1 | Open question | [06a / UC-04 step 4](./06a-use-cases-clinic-owner.md#uc-04-set-the-reminder-timing) | At what time on the visit day does the second reminder go out? | UC-04 step 4; UC-14 A2 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-11 | P1 | Open question | [06c / UC-15 Trigger](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link) | How long does the system wait for the WhatsApp reminder to be delivered before it sends the SMS? | UC-15 step 1; BO-08 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-12 | P1 | Open question | [03 / Reminders, Channels and Message content](./03-definitions-and-domain-concepts.md#reminders) | Confirm or replace the four proposals: SMS sent when WhatsApp cannot send at all is not charged; the latest answer across channels counts; what each reminder names; the message language belongs to the patient. | UC-14 step 2; UC-07 step 4; UC-12 step 3; UC-16 step 3; 03 Subscription plans | Recommendation: BRD author (not named; TD-77) | Open |
| TD-13 | P1 | Open question | [03 / Consent record, Rules](./03-definitions-and-domain-concepts.md#consent-record) | Confirm or replace the two proposals: how patients who share one mobile number are told apart and opt out; the under-15 mark with no date of birth (counsel to confirm). | UC-07 step 4; UC-08 A1; UC-09 step 2; UC-17 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-14 | P1 | Open question | [03 / Waitlist and slot offers, Rules](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers) | Confirm or replace the two proposals: waitlist order and slot matching; when a waitlist entry ends (and how long an entry with no booked appointment stays). | UC-12; UC-16 step 1 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-15 | P1 | Open question | [03 / Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans); [06a / UC-05 Business Rules](./06a-use-cases-clinic-owner.md#uc-05-pay-for-the-subscription) | Confirm or replace the two proposals: prices exclude the 14% VAT with a receipt; pilot clinics pay nothing until the paid launch (and by which date a pilot clinic must pay). | UC-05 AC-1 to AC-3; 03 Table 6 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-16 | P1 | Open question | [06a / UC-01 steps 1 and 2, A1](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic-account) | Confirm or replace the three UC-01 proposals: how the account is created, the account details, and what happens when the owner declines WhatsApp messages. | UC-01 Main Flow and A1 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-17 | P1 | Open question | [06a / UC-02 step 3, A1](./06a-use-cases-clinic-owner.md#uc-02-give-a-receptionist-a-login) | Confirm or replace the two UC-02 proposals: the receptionist invitation and the removal of a login. | UC-02 Main Flow and A1 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-18 | P1 | Open question | [06a / UC-04 Primary Actor, step 6](./06a-use-cases-clinic-owner.md#uc-04-set-the-reminder-timing) | Confirm or replace the two UC-04 proposals: the Clinic Owner sets the timing; new settings apply to all reminders not yet sent. | UC-04 actor and step 6; 07 UC-04 row | Recommendation: BRD author (not named; TD-77) | Open |
| TD-19 | P1 | Open question | [06a / UC-06 Primary Actor, Main Flow](./06a-use-cases-clinic-owner.md#uc-06-review-the-staff-activity-log) | Confirm or replace the two UC-06 proposals: the Clinic Owner reads the log; which actions the log records. | UC-06 actor and Main Flow; 07 UC-06 row | Recommendation: BRD author (not named; TD-77) | Open |
| TD-20 | P1 | Open question | [06b / UC-07 step 4, E2](./06b-use-cases-receptionist.md#uc-07-add-an-appointment) | Confirm or replace the two UC-07 proposals: the appointment details (with Arabic as the default language); the overlap warning. | UC-07 step 4 and E2; UC-09 step 2 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-21 | P1 | Open question | [06b / UC-09 step 2, E1 to E3](./06b-use-cases-receptionist.md#uc-09-import-appointments-from-a-file) | Confirm or replace the two UC-09 proposals: the file columns; how bad files, bad rows, and duplicates are handled. | UC-09 step 2 and E1 to E3 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-22 | P1 | Open question | [06b / UC-10 step 7, A3](./06b-use-cases-receptionist.md#uc-10-check-the-days-appointment-statuses) | Confirm or replace the two UC-10 proposals: answers given by phone are recorded in the day view; the call list also shows patients the system cannot remind. | UC-10 step 7 and A3 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-23 | P1 | Open question | [06b / UC-13 Primary Actor, A1](./06b-use-cases-receptionist.md#uc-13-record-whether-the-patient-came) | Confirm or replace the proposed use case UC-13 (the Receptionist records Attended or No-show) and its A1 (changing an outcome). | UC-13; UC-03 step 2; BO-07; BO-13 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-24 | P1 | Open question | [06c / UC-17 steps 1 and 4, A1 to A3, Business Rules](./06c-use-cases-patient.md#uc-17-stop-all-messages) | Confirm or replace the six UC-17 proposals: the opt-out words, the confirmation message, the Stop button on the SMS page, restarting after new consent, opt-out at the desk, and the opt-out scope per clinic. | UC-17 Main Flow, A1 to A3; 07 UC-17 row | Recommendation: BRD author (not named; TD-77) | Open |
| TD-86 | P1 | Pending decision | [14 / CF-28](#consistency-findings); [06c / UC-14 AC-4](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder); [03 / Figure 1 Summary](./03-definitions-and-domain-concepts.md#appointment-statuses) | Decision: apply CF-28 (UC-14 AC-4 covers Booked appointments only; the Figure 1 Summary names the Confirmed path). Decided: the user accepted the correction on 2026-10-07; a third-run discovery, so the next request applies it and rechecks. | UC-14 AC-4; 03 Figure 1 | Recommendation: BRD author (not named; TD-77) | Decided - pending application |
| TD-87 | P1 | Pending decision | [13 / OI-33](./13-open-items-and-clarifications.md#oi-33-the-message-language-of-a-returning-patient); [14 / CF-29](#consistency-findings); [03 / Message content](./03-definitions-and-domain-concepts.md#message-content); [06b / UC-07 step 4](./06b-use-cases-receptionist.md#uc-07-add-an-appointment); [06b / UC-09 step 2](./06b-use-cases-receptionist.md#uc-09-import-appointments-from-a-file) | Decision: OI-33 Option B (for a known patient, a different language entered in UC-07 step 4 or UC-09 step 2 changes the language for messages not yet sent; the Arabic default applies to new patients only). Decided by the user on 2026-10-07; the next request applies it and rechecks. | UC-07 step 4; UC-09 step 2; 03 Message content | Recommendation: BRD author (not named; TD-77) | Decided - pending application |
| TD-25 | P2 | Open question | [01 / Background](./01-executive-summary-and-context.md#background-and-context--problem-statement); [02 / Assumption 24](./02-glossary-assumptions-facts.md#assumptions--constraints); pre-BRD 24 OI-03 | Do the target clinics book timed slots, or admit patients in arrival order within a session? | UC-11; UC-16; BO-09 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-26 | P2 | Open question | [01 / BO-06](./01-executive-summary-and-context.md#business-objectives); [01 / BO-07](./01-executive-summary-and-context.md#business-objectives); pre-BRD 24 OI-07 | Does the pilot use a concurrent control (half of each clinic's appointments without reminders) because it overlaps Ramadan? | BO-06; BO-07; UC-14 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-27 | P2 | Open question | [01 / BO-09](./01-executive-summary-and-context.md#business-objectives); [03 / Waitlist and slot offers, Overview](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers); [04 / In Scope item 7](./04-scope-and-personas.md#in-scope); [06c / UC-16 Business Rules](./06c-use-cases-patient.md#uc-16-accept-a-waitlist-slot-offer); pre-BRD 24 OI-11 | Does waitlist refill start as a manual-assist version with a keep-or-drop test in the pilot? | UC-16; BO-09; 04 In Scope item 7 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-28 | P2 | Open question | [02 / Constraint 5](./02-glossary-assumptions-facts.md#assumptions--constraints); [02 / Assumption 27](./02-glossary-assumptions-facts.md#assumptions--constraints); pre-BRD 08 Legal (1) | Counsel to confirm the licence type (processor or controller), how records are counted across clinics, the fee tier, whether each clinic needs its own licence, and whether the PDPC portal is live. | Constraint 5; assumption 27; UC-01; go-live | Recommendation: BRD author (not named; TD-77) | Open |
| TD-29 | P2 | Open question | [02 / Constraint 14](./02-glossary-assumptions-facts.md#assumptions--constraints); pre-BRD 08 Legal (2) | Does the PDPC treat the appointment itself or the clinic's specialty as health data? Counsel to answer. | UC-14 step 2; 03 Message content; constraint 14 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-30 | P2 | Open question | [02 / Constraint 15](./02-glossary-assumptions-facts.md#assumptions--constraints); [06c / UC-16 Business Rules](./06c-use-cases-patient.md#uc-16-accept-a-waitlist-slot-offer); pre-BRD 08 Legal (2) | Do waitlist slot offers count as electronic marketing that needs its own licence? Counsel to answer. | UC-16; constraint 15 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-31 | P2 | Open question | [02 / Constraint 10](./02-glossary-assumptions-facts.md#assumptions--constraints); [02 / Dependency "Hosting location decision"](./02-glossary-assumptions-facts.md#dependencies); pre-BRD 08 Legal (3) | Is patient data hosted in Egypt or abroad, and does routing messages through Meta count as a transfer abroad that needs its own licence? | NFR-04; constraints 4 and 10 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-32 | P2 | Open question | [02 / Constraint 16](./02-glossary-assumptions-facts.md#assumptions--constraints); pre-BRD 08 Legal (5) | Do the Code of Medical Ethics or Ministry of Health rules restrict a third-party service from messaging patients for a clinic? Counsel to answer. | UC-14 to UC-17; constraint 16 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-33 | P2 | Open question | [02 / Constraint 11](./02-glossary-assumptions-facts.md#assumptions--constraints) | Which records count as logs under the law, and is 180 days a minimum or a fixed period? Counsel to answer. | NFR-05; UC-06; constraint 11 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-34 | P2 | Open question | [02 / Constraint 29](./02-glossary-assumptions-facts.md#assumptions--constraints) | Which data requests does the PDPL give patients, and what must Clinic Reminders do for the clinic, within what time? Counsel to answer. | NFR-04; constraint 29 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-35 | P2 | Open question | [02 / Assumption 28](./02-glossary-assumptions-facts.md#assumptions--constraints); [10 / NFR-03](./10-nfrs.md#non-functional-requirements); pre-BRD 03 Cost Structure | What are the average monthly appointments per target clinic, and what share of patients will need the SMS fallback? | NFR-03; 03 Subscription plans | Recommendation: BRD author (not named; TD-77) | Open |
| TD-36 | P2 | Open question | [02 / Dependency "Company incorporated in Egypt"](./02-glossary-assumptions-facts.md#dependencies); pre-BRD 11 IFAS S3 | Is the company incorporated in Egypt, so it can complete Meta verification and SMS sender ID registration before the pilot? Also confirm this dependency's owner and need date. | BO-02; BO-03; go-live | Recommendation: BRD author (not named; TD-77) | Open |
| TD-37 | P2 | Open question | [02 / Dependency "Meta business verification and approved templates"](./02-glossary-assumptions-facts.md#dependencies) | In which Meta category is the weekly report template approved, and does the receptionist invitation (UC-02) go by WhatsApp? | UC-03; UC-02 step 3; BO-02 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-38 | P2 | Open question | [03 / Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans); pre-BRD 24 OI-16 (5) | Which SMS charge applies to each plan: at cost (Starter) or at cost plus 20% (top-up row)? | UC-05; 03 Table 6 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-39 | P2 | Open question | [03 / Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans); [09 / closing line](./09-reporting-and-analytics.md#reporting--analytics); [12 / Wishlist item 4](./12-appendix-and-wishlist.md#wishlist) | Are per-doctor reports (pre-BRD 21, Clinic plan) in this release, although pre-BRD 14 puts the no-show breakdown by doctor in Could have? | 09; 03 Table 6; 12 Wishlist item 4 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-40 | P2 | Open question | [04 / In Scope](./04-scope-and-personas.md#in-scope) | Does the product run the 14-day trial and apply the referral credit that pre-BRD 21 plans, or are both handled outside the product? | UC-05 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-41 | P2 | Open question | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors) | Can the Clinic Owner also do the Receptionist's work with the owner login? | 07 matrix; UC-07 to UC-13 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-42 | P2 | Open question | [06a / UC-01 E2](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic-account) | Can a clinic with more than 5 doctors subscribe? | UC-01 E2; 03 Table 6 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-43 | P2 | Open question | [06a / UC-05 E2](./06a-use-cases-clinic-owner.md#uc-05-pay-for-the-subscription) | What happens to the clinic's reminders when a payment is not made by its due date? | UC-05 E2; UC-14 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-44 | P2 | Open question | [06a / UC-05 E3](./06a-use-cases-clinic-owner.md#uc-05-pay-for-the-subscription) | When the month's message allowance runs out, do reminders stop, or does the clinic pay for extra blocks automatically? | UC-05 E3; UC-14 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-45 | P2 | Open question | [06b / UC-07 E1](./06b-use-cases-receptionist.md#uc-07-add-an-appointment) | When an appointment is booked closer to the visit than the reminder lead time, does the reminder go at once, or not at all? | UC-07 E1; UC-10 A3; 03 Day view labels | Recommendation: BRD author (not named; TD-77) | Open |
| TD-46 | P2 | Open question | [06b / UC-07 Business Rules](./06b-use-cases-receptionist.md#uc-07-add-an-appointment); OI-32 | Do patients with a mobile number outside Egypt get reminders, and by which channel? | UC-07; UC-09; UC-15 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-47 | P2 | Open question | [06c / UC-16 E2](./06c-use-cases-patient.md#uc-16-accept-a-waitlist-slot-offer) | Do slot offers also fall back to SMS with a link when WhatsApp does not deliver them? | UC-16 E2 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-48 | P2 | Open question | [10 / NFR-02](./10-nfrs.md#non-functional-requirements) | How late can a reminder go out, and how long per month can the reception screens be unavailable? | NFR-02 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-49 | P2 | Open question | [10 / NFR-05](./10-nfrs.md#non-functional-requirements) | How long are appointments, patient details, and the staff activity log kept, and what happens to a clinic's data when it stops paying? | NFR-05; UC-06 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-50 | P2 | Open question | [10 / NFR-07](./10-nfrs.md#non-functional-requirements) | Within how many minutes of a patient's answer or a cancellation must the day view and the waitlist react? | NFR-07; 09 day view row | Recommendation: BRD author (not named; TD-77) | Open |
| TD-51 | P2 | Open question | [10 / NFR-08](./10-nfrs.md#non-functional-requirements) | How many minutes of recent work can a clinic afford to enter again after a failure? | NFR-08 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-52 | P2 | Open question | [02 / Constraint 9](./02-glossary-assumptions-facts.md#assumptions--constraints); [02 / Constraint 15](./02-glossary-assumptions-facts.md#assumptions--constraints) | Confirm or replace the two proposals: who reports a breach and tells the clinics; when the three-year consent period starts. Counsel to confirm. | Constraints 9 and 15; NFR-04; NFR-05 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-53 | P2 | Open question | [03 / Appointment statuses](./03-definitions-and-domain-concepts.md#appointment-statuses); [06c / UC-15 E1](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link) | Confirm or replace the three status proposals: a slot-offer booking starts as Confirmed; Not reached when no channel delivers; a Confirmed appointment stays Confirmed after an unanswered reminder. | Table 5; Figure 1; UC-14 E2; UC-15 E1; UC-16 step 5 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-54 | P2 | Open question | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors) | Confirm or replace the proposal that Clinic Reminders team members have no login to clinic accounts, and say how a Clinic Owner who loses the owner login gets it back. | NFR-04; UC-02 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-55 | P2 | Open question | [06a / UC-03 A1, E1, E2](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) | Confirm or replace the three UC-03 proposals: a week with no appointments, outcomes not recorded, and a report WhatsApp does not deliver. | UC-03 A1, E1, E2 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-56 | P2 | Open question | [06a / UC-05 A1, A2, E1](./06a-use-cases-clinic-owner.md#uc-05-pay-for-the-subscription) | Confirm or replace the three UC-05 proposals: buying top-ups, moving plans when the number of doctors changes, and a refused payment. | UC-05 A1, A2, E1 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-57 | P2 | Open question | [06b / UC-08 E1](./06b-use-cases-receptionist.md#uc-08-record-a-patients-consent) | Confirm or replace the proposal for a patient who refuses consent. | UC-08 E1; UC-07 A1 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-58 | P2 | Open question | [06b / UC-12 A1](./06b-use-cases-receptionist.md#uc-12-add-a-patient-to-the-waitlist) | Confirm or replace the proposal that the Receptionist can remove a patient from the waitlist at the patient's request. | UC-12 A1 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-59 | P2 | Open question | [06c / UC-14 A1 to A4, E3](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder); [06c / UC-15 A1](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link) | Confirm or replace the five UC-14 proposals: the cancellation alert (also UC-15 A1), the visit-day reminder, typed replies, changing an answer, and taps on a reminder that is no longer valid. | UC-14 A1 to A4 and E3; UC-15 A1; 09 day view row | Recommendation: BRD author (not named; TD-77) | Open |
| TD-60 | P2 | Open question | [06c / UC-15 E2, Business Rules](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link) | Confirm or replace the two UC-15 proposals: a link that is no longer valid, and what the link page shows with no extra check. | UC-15 E2 and Business Rules | Recommendation: BRD author (not named; TD-77) | Open |
| TD-61 | P2 | Open question | [06c / UC-16 A1, A2](./06c-use-cases-patient.md#uc-16-accept-a-waitlist-slot-offer) | Confirm or replace the two UC-16 proposals: a later patient stays on the waitlist; accepting moves a patient's later appointment. | UC-16 A1 and A2 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-62 | P2 | Open question | [09 / Weekly no-show report row](./09-reporting-and-analytics.md#reporting--analytics) | Confirm or replace how the weekly report works out the no-show rate and the confirmed share. | UC-03; 09; BO-07 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-63 | P2 | Assumption to validate | [02 / Assumption 26](./02-glossary-assumptions-facts.md#assumptions--constraints) | Confirm with Meta's template review that reminders, confirmations, and slot offers are approved in the utility category. | UC-14; UC-16; 03 Subscription plans | Recommendation: BRD author (not named; TD-77) | Open |
| TD-64 | P2 | Assumption to validate | [02 / Dependency "Meta business verification and approved templates"](./02-glossary-assumptions-facts.md#dependencies) | Confirm the owner of Meta verification and template approval and that it is needed before go-live (target 2026-12-15). | BO-02; UC-03; UC-14; UC-16; UC-17 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-65 | P2 | Assumption to validate | [02 / Dependency "SMS aggregator contract and sender ID on all four networks"](./02-glossary-assumptions-facts.md#dependencies) | Confirm the owner of the SMS aggregator contract and sender ID registration and that they are needed before go-live (target 2026-12-31). | BO-03; UC-15 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-66 | P2 | Assumption to validate | [02 / Dependency "PDPC licence and registered DPO"](./02-glossary-assumptions-facts.md#dependencies) | Confirm the owner of the PDPC licence and the DPO registration and that they are needed before the first patient message. | BO-04; constraint 5; go-live | Recommendation: BRD author (not named; TD-77) | Open |
| TD-67 | P2 | Assumption to validate | [02 / Dependency "Counsel opinion on the PDPL questions"](./02-glossary-assumptions-facts.md#dependencies) | Confirm the owner of the counsel opinion and the date it is needed, before go-live. | Constraints 5, 6, 9, 10, 11, 14, 15, 16, and 29 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-68 | P2 | Assumption to validate | [02 / Dependency "Payment gateway contract"](./02-glossary-assumptions-facts.md#dependencies) | Confirm the owner of the payment gateway contract and that it is needed before the build of UC-05. | UC-05 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-69 | P3 | Open question | [01 / BO-14](./01-executive-summary-and-context.md#business-objectives); pre-BRD 24 OI-06 | Is the year-one budget itemised with a three-month reserve, founder pay stated, and the seed process started at the pilot readout? | BO-14 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-70 | P3 | Open question | [02 / Challenge 2](./02-glossary-assumptions-facts.md#challenges); [03 / Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans); pre-BRD 24 OI-09 | Is the top-up price set on the reply-inclusive cost, given that charged replies, slot offers, and hosting are left out of the cost side? | 03 Table 6; UC-05 AC-3 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-71 | P3 | Open question | [01 / BO-11](./01-executive-summary-and-context.md#business-objectives); pre-BRD 24 OI-10 | Does the revenue plan use the company's own price list and plan mix (about EGP 594 a clinic) instead of the EGP 650 market anchor? | BO-11 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-72 | P3 | Open question | [02 / Constraint 8](./02-glossary-assumptions-facts.md#assumptions--constraints); pre-BRD 11 IFAS W2 | Will the DPO be appointed in-house or outsourced? | Constraint 8; BO-04 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-73 | P3 | Open question | [02 / Assumption 25](./02-glossary-assumptions-facts.md#assumptions--constraints); pre-BRD 10 EFAS O3 | What share of Egyptian internet users used WhatsApp monthly in 2025-2026? | Assumption 25; NFR-03 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-74 | P3 | Open question | [04 / In Scope](./04-scope-and-personas.md#in-scope) | Which roadmap phase delivers In Scope items 11, 12, and 13? | 04 In Scope items 11 to 13 | Recommendation: BRD author (not named; TD-77) | Open |
| TD-75 | P3 | Open question | [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) | Confirm or replace the four UI/UX proposals: data tables, screen sizes, date and time format, and the other global rules (two come from the author's global defaults, not a project source). | 11; step 4 mockups | Recommendation: BRD author (not named; TD-77) | Open |
| TD-76 | P3 | Open question | [11 / UI/UX Expectations, Primary Color](./11-summary-and-uiux.md#uiux-expectations) | What is the brand or key color of Clinic Reminders? | 11; step 4 mockups | Recommendation: BRD author (not named; TD-77) | Open |
| TD-77 | P3 | Open question | [00 / Cover, Author](./00-cover-and-changelog.md) | Who is the BRD author? | 00 cover; the Owner cells of this register | Recommendation: BRD author (not named; TD-77) | Open |
| TD-88 | P3 | Pending decision | [14 / CF-30](#consistency-findings); [decision-log.md, Clarification register](./decision-log.md#clarification-register) | Decision: apply CF-30 (the register counts 32 decided open items, not 28). Decided: the user accepted the correction on 2026-10-07; a third-run discovery, so the next request applies it and rechecks. | decision-log.md | Recommendation: BRD author (not named; TD-77) | Decided - pending application |
| TD-89 | P3 | Pending decision | [14 / CF-31](#consistency-findings); [11 / Language & Locale](./11-summary-and-uiux.md#uiux-expectations); [14 / TD-12 and TD-67](#open-items-register) | Decision: apply CF-31 (chunk 11 points to chunk 03 Message content; TD-12 Blocks adds UC-09 step 2; TD-67 Blocks adds the under-15 proposal). Decided: the user accepted the correction on 2026-10-07; a third-run discovery, so the next request applies it and rechecks. | 11 Language & Locale; this register | Recommendation: BRD author (not named; TD-77) | Decided - pending application |
| TD-90 | P3 | Pending decision | [14 / CF-32](#consistency-findings); [14 / TD-70 and TD-73](#open-items-register) | Decision: apply CF-32 (TD-70 and TD-73 become P2; the priority ranges in steps 1 and 3 change). Decided: the user accepted the correction on 2026-10-07; a third-run discovery, so the next request applies it and rechecks. | This register; the step 3 order | Recommendation: BRD author (not named; TD-77) | Decided - pending application |
| TD-91 | P3 | Pending decision | [14 / CF-33](#consistency-findings); [14 / MK-07, MK-08, MK-13, MK-14](#mockup-coverage) | Decision: apply CF-33 (MK-08 adds UC-17 A3, its state, and TD-24; MK-13 adds TD-24; MK-14 adds TD-27 and TD-47; MK-07 adds the overlap warning state). Decided: the user accepted the correction on 2026-10-07; a third-run discovery, so the next request applies it and rechecks. | Step 4 mockup coverage | Recommendation: BRD author (not named; TD-77) | Decided - pending application |
| TD-92 | P3 | Pending decision | [14 / CF-34](#consistency-findings); [14 / Step 5, Patient diagram row](#use-case-diagrams-chunk-05) | Decision: apply CF-34 (UC-16 extends UC-14 at A1 and the proposed A4; UC-17 extends UC-14 at the proposed A3). Decided: the user accepted the correction on 2026-10-07; a third-run discovery, so the next request applies it and rechecks. | Step 5 diagram plan | Recommendation: BRD author (not named; TD-77) | Decided - pending application |
| TD-78 | P2 | Pending decision | [13 / OI-25](./13-open-items-and-clarifications.md#oi-25-reminders-for-appointments-that-are-not-booked) (raised from CF-03) | Decided by the owner on 2026-10-07 and applied to UC-14 Preconditions. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-25) |
| TD-79 | P2 | Pending decision | [13 / OI-26](./13-open-items-and-clarifications.md#oi-26-which-plans-get-per-doctor-calendars) (raised from CF-04) | Decided by the owner on 2026-10-07 and applied to 03 Staff and doctors; 04 In Scope item 10. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-26) |
| TD-80 | P2 | Pending decision | [13 / OI-27](./13-open-items-and-clarifications.md#oi-27-the-language-of-patient-messages) (raised from CF-08) | Decided by the owner on 2026-10-07 and applied to UC-07 BR-3. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-27) |
| TD-81 | P2 | Pending decision | [13 / OI-28](./13-open-items-and-clarifications.md#oi-28-when-a-persona-counts-as-a-supporting-actor) (raised from CF-18) | Decided by the owner on 2026-10-07 and applied to 07 Notes. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-28) |
| TD-82 | P2 | Pending decision | [13 / OI-29](./13-open-items-and-clarifications.md#oi-29-the-supporting-actor-rule-and-the-uc-17-receptionist) (raised from CF-19) | Decided by the owner on 2026-10-07 and applied to 07 Notes. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-29) |
| TD-83 | P2 | Pending decision | [13 / OI-30](./13-open-items-and-clarifications.md#oi-30-reminders-for-a-confirmed-appointment) (raised from CF-20) | Decided by the owner on 2026-10-07 and applied to 03 Appointment statuses; Figure 1; UC-14 E2. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-30) |
| TD-84 | P2 | Pending decision | [13 / OI-31](./13-open-items-and-clarifications.md#oi-31-where-the-patients-message-language-is-set) (raised from CF-21) | Decided by the owner on 2026-10-07 and applied to 03 Message content; UC-12 step 3. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-31) |
| TD-85 | P2 | Pending decision | [13 / OI-32](./13-open-items-and-clarifications.md#oi-32-patients-with-a-mobile-number-outside-egypt) (raised from Reviewer Notes) | Decided by the owner on 2026-10-07 and applied to UC-07 Business Rules. | - | Recommendation: BRD author (not named; TD-77) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-32) |

---

## Step 2 - Run a consistency check across all BRD chunks

| | |
|---|---|
| **Status** | In progress |
| **Required inputs** | All BRD chunks 00-13 (and 05 / 06* diagrams once step 5 has run; chunk 14 itself, and 15-17 once they exist, for check C10) |
| **Expected output** | Every finding recorded below with its affected chunks and identifiers, impact, and a disposition; confirmed corrections applied to every affected chunk; a recheck run recorded |
| **Completion criteria** | The latest full/scoped check follows the final relevant content change, with request/run order and checked revision or change-then-check evidence. Dates alone do not prove same-day order. Every finding has a disposition; pending TD/OI keeps step 1 incomplete. |
| **Evidence** | Runs 1 to 3 on 2026-10-07, each by a cleared-context read-only checker, with content hashes (Check runs below). Not complete: the Run 3 findings CF-28 to CF-34 are decided but not applied; the next request applies them and rechecks. |

**Checks performed:** C1 conflicting requirements, C2 terminology, C3 scope, C4 duplicated requirements, C5 missing requirements, C6 broken references, C7 use cases vs acceptance criteria, C8 derived views (Use Case Summary, matrix), C9 diagrams vs narrative (after step 5), C10 delivery chunks vs body (chunk 14 at every write; 15-17 once they exist).

### Check runs

**Checked content and order:** Request: the first build of this BRD (whole), 2026-10-07. Each run was done by a cleared-context, read-only checker (a general-purpose sub-agent); the main author applied the corrections afterwards. The content hash is the first 16 hexadecimal characters of the SHA-256 of chunks 00 to 13, the master index, and decision-log.md, joined in file-name order. No file changed between a run's start and its report. Run 1 checked hash 40470fd17c7ce826, the state after the acceptance loop of OI-01 to OI-24; its corrections and OI-25 to OI-28 followed. Run 2 checked hash daf51c189dc5ffc2; its corrections, OI-29 to OI-31, and OI-32 followed. Run 3 checked hash 52f585a45fdede48 for chunks 00 to 13, the master index, and decision-log.md, and 106891bb99f55950 for 14-todo.md. Its findings are third-run discoveries, so they are not applied in this request.

<!-- Scope: 00-13 for a full run; for a scoped run, the chunks it checked: those changed since the run before, and the chunks that link to them (delivery-chunks.md § Step 2). -->

<!-- Run 1 starts a new checklist; an existing checklist appends the next free number. At most three runs in one request. Third-run discoveries stay pending application until the next request (TD Status Decided - pending application, register above); a pause does not reset the cap. -->

| Run | Date | Trigger | Scope | Findings | Still open after run |
|-----|------|---------|-------|----------|----------------------|
| 1 | 2026-10-07 | Initial generation, after the acceptance loop of OI-01 to OI-24 | 00-13 (full) | 18 | 0 (14 corrected; 4 raised as OI-25 to OI-28, accepted and applied) |
| 2 | 2026-10-07 | The Run 1 corrections and OI-25 to OI-28 | Changed chunks and their dependents: 00, 02, 03, 04, 05, 06a, 06b, 06c, 07, 09, 10, 11, 12, 13, and decision-log.md | 9 | 0 (6 corrected; 3 raised as OI-29 to OI-31, accepted and applied) |
| 3 | 2026-10-07 | The Run 2 corrections, OI-29 to OI-32, and the first write of chunk 14 | Changed chunks and their dependents: 00, 02, 03, 06a, 06b, 06c, 07, 11, 13, decision-log.md, the master index, and chunk 14 (C10) | 7 | 7 (CF-28 to CF-34: decided, pending application in the next request) |

### Consistency findings

<!-- Disposition is one of: Corrected ([where], [date]) | Open item raised: OI-NN / TD-NN | Deferred for clarification: TD-NN | No change ([who], [why]). Business ambiguities are never resolved silently: they become open items. -->

| ID | Check | Affected chunks and identifiers | Finding | Impact | Recommended correction or decision needed | Disposition | Rechecked |
|----|-------|---------------------------------|---------|--------|-------------------------------------------|-------------|-----------|
| CF-01 | C1 | 03 Waitlist overview; UC-03; 09; UC-15 E1; UC-05; 12 Wishlist item 4; UC-11 step 4 | Open points were open in one home and read as settled in another: missing marker copies, the alert scope and timing in chunk 09, and the confirmation step in UC-11. | Open points read as decided. | Copy the existing markers; chunk 09 points to the UC-14 A1 proposal and NFR-07; UC-11 step 4 says the step is proposed in chunk 11. | Corrected (03, 06a, 06b, 06c, 09, 12; 2026-10-07; marker copies; carries OI-03, OI-15, OI-24) | Run 2 |
| CF-02 | C1 | UC-16 A1; UC-11 A1 | Parts that the source or an applied decision already states were marked as proposals. | Settled points become to-dos. | UC-16 A1 states the pre-BRD 06 part and proposes only the rest; UC-11 A1 points to the Free slot label. | Corrected (06b UC-11 A1, 06c UC-16 A1; 2026-10-07; Reviewer Note; carries OI-06) | Run 2 |
| CF-03 | C1 | UC-14 Preconditions and A2; 03 Table 5, Figure 1 | UC-14 needed a Booked appointment, while Confirmed appointments get reminders too. | The reminder rule was unclear. | Choice: remind every appointment that is not cancelled, or Booked ones only. | Open item raised: OI-25 / TD-78 (accepted and applied 2026-10-07) | Run 2 |
| CF-04 | C1 | 03 Table 6, Staff and doctors; 04 In Scope item 10; UC-07; UC-10 A1 | Table 6 sells per-doctor calendars with the Clinic plan only; other homes gave them to every clinic. | Starter clinics were unspecified. | Choice: Clinic plan only, or every clinic. | Open item raised: OI-26 / TD-79 (accepted and applied 2026-10-07) | Run 2 |
| CF-05 | C1, C4 | UC-10 steps 7 and 8; UC-11; UC-16 Trigger | A phone cancellation had two homes; the UC-16 Trigger left out UC-14 A4. | Flows can drift. | UC-10 step 7 routes cancellations to UC-11; the UC-16 Trigger adds UC-14 A4 (proposed). | Corrected (06b UC-10 steps 7 and 8, 06c UC-16 Trigger; 2026-10-07) | Run 2 |
| CF-06 | C1 | 03 Day view labels; UC-10 A3; UC-07 E1 | The "Booked too late" reason had no home in the label list and depends on the open UC-07 E1 question. | A label had no home. | Add the label with its condition to chunk 03 and UC-10 A3. | Corrected (03 Day view labels, 06b UC-10 A3; 2026-10-07; carries OI-06 and OI-11) | Run 2 |
| CF-07 | C1 | UC-06 Why; NFR-01; NFR-04 | UC-06 traced to BO-01, which counts Must items only; NFR-01 promised every reminder; NFR-04 said "in time". | A wrong trace and vague expectations. | UC-06 names no objective; NFR-01 refers to BO-08; NFR-04 says within 72 hours. | Corrected (06a UC-06, 10 NFR-01 and NFR-04; 2026-10-07; Reviewer Notes) | Run 2 |
| CF-08 | C1 | 03 Message content; UC-07 BR-3; UC-14 step 1 | Two homes tied the message language to the patient and one to the appointment. | Slot offers had no language. | Choice: per patient or per appointment. | Open item raised: OI-27 / TD-80 (accepted and applied 2026-10-07) | Run 2 |
| CF-09 | C2 | 02 Glossary; 03; 04 item 13; 05; UC-05 E3; UC-06; UC-10; UC-14; 11 Filtration | Two names for one thing: "no-reply list" and "call list"; "reminder allowance" and "message allowance"; "audit log" and "staff activity log". | Readers see two lists or two logs. | Use "call list" (new Glossary row), "message allowance", and "staff activity log (audit log of staff actions)". | Corrected (02, 03, 04, 05, 06a, 06b, 06c, 11; 2026-10-07; the Glossary wins; carries OI-11 into chunk 05) | Run 2 |
| CF-10 | C2 | 02 Glossary "Opt-out"; UC-17 A3 | The definition said "reply", but OI-18 added an opt-out given at the desk. | The definition left out a flow. | "A patient's request that stops all messages (UC-17)." | Corrected (02 Glossary; 2026-10-07; carries OI-18) | Run 2 |
| CF-11 | C4 | 03 Timing; UC-04; UC-14; constraint 22; 04 Out of Scope; constraint 21; NFR-03 | The 24-hour default, the walk-in exclusion, and the 250-user limit each had two or more homes. | Copies drift. | Keep one home each and link to it from the others. | Corrected (02 constraint 22, 06a UC-04, 06c UC-14, 10 NFR-03; 2026-10-07; Reviewer Notes) | Run 2 |
| CF-12 | C4 | 03; UC-08 BR-1; UC-05 Business Rules; UC-11 BR-1; UC-16 BR-1 | Four facts were stated in chunk 03 and again in a use case. | Two homes per fact. | Keep chunk 03 and link to it; drop the duplicate UC-05 rule. | Corrected (06a UC-05, 06b UC-08 and UC-11, 06c UC-16; 2026-10-07) | Run 2 |
| CF-13 | C5 | 02 Dependencies, counsel row; constraint 11 | The counsel row left out constraint 11. | A question had no owner. | Add constraint 11 to the row. | Corrected (02 Dependencies; 2026-10-07; carries OI-23) | Run 2 |
| CF-14 | C6 | UC-16 E1; UC-06 Business Rules; 04 In Scope item 10 | Two references pointed at answers that do not exist yet; item 10 left out UC-09 and UC-12. | References pointed at missing answers. | Say the values are still open there; add UC-09 and UC-12. | Corrected (04, 06a UC-06, 06c UC-16 E1; 2026-10-07) | Run 2 |
| CF-15 | C7 | UC-03 Preconditions and E1; UC-12 Preconditions and E1 | Preconditions contradicted the use case's own exception flows. | The use case could not start in the case it handles. | Drop the second UC-03 precondition; UC-12 Preconditions "None." | Corrected (06a UC-03, 06b UC-12; 2026-10-07; Reviewer Note) | Run 2 |
| CF-16 | C7 | UC-04 A1; UC-06 A1; UC-09 E1 and E3; UC-10 A1; UC-14 E3; UC-17 AC-1 | Flows had no acceptance criterion, and UC-17 AC-1 tested a proposed word as settled. | Untested branches. | Add the criteria; reword UC-17 AC-1. | Corrected (06a, 06b, 06c; 2026-10-07) | Run 2 |
| CF-17 | C7 | UC-03 AC-1; 09 Weekly no-show report; 02 Glossary "No-show rate" | AC-1 tested counts that the report does not show. | AC-1 tested the wrong figures. | AC-1 tests the rate, the share, and the refilled slots; the Glossary points to chunk 09. | Corrected (02 Glossary, 06a UC-03 AC-1; 2026-10-07) | Run 2 |
| CF-18 | C8 | UC-08 Supporting Actors; UC-07, UC-10, UC-11, UC-12; 07 footnote 2 | The supporting-actor convention was not written down. | The matrix followed an unwritten rule. | Choice: write the rule down, or add more footnoted cells. | Open item raised: OI-28 / TD-81 (accepted and applied 2026-10-07) | Run 2 |
| CF-19 | C1, C8 | 07 Notes; UC-17 Supporting Actors; 07 UC-17 row and footnote 5 | The OI-28 rule (Main Flow steps only) contradicted the Receptionist in UC-17 A3 (OI-18). | Two applied decisions contradicted each other. | Choice: widen the rule, remove the Receptionist, or add an exception. | Open item raised: OI-29 / TD-82 (accepted and applied 2026-10-07) | Run 3 |
| CF-20 | C1, C5 | 03 Table 5, Figure 1; UC-14 E2; UC-15 E1 | Confirmed appointments get reminders (OI-25), but no outcome was defined for them. | The status and call-list rule were undefined. | Choice: stays Confirmed; Not reached when nothing is delivered; or back to Awaiting reply. | Open item raised: OI-30 / TD-83 (accepted and applied 2026-10-07) | Run 3 |
| CF-21 | C5, C1 | 03 Message content; UC-07 step 4; UC-09 step 2; UC-12 step 3; UC-16 step 3 | The language belongs to the patient (OI-27) but was still entered per appointment; waitlisted patients had none. | Some slot offers had no language. | Choice: set per patient, per appointment, or Arabic by default. | Open item raised: OI-31 / TD-84 (accepted and applied 2026-10-07) | Run 3 |
| CF-22 | C1 | 02 Dependencies, Meta row | The go-live template list gave only the reminder in both languages. | English confirmations and offers would miss go-live. | List the reminder, confirmation, and slot offer in both languages. | Corrected (02 Dependencies; 2026-10-07; carries OI-27) | Run 3 |
| CF-23 | C2 | UC-06 Why; decision-log.md Q-01; 03 Staff and doctors | Old wording was left after CF-09 and OI-26. | One thing had two names. | Use the Glossary terms; define the per-doctor phrase for the whole BRD. | Corrected (03, 06a UC-06, decision-log.md; 2026-10-07; carries OI-26) | Run 3 |
| CF-24 | C4, C7 | UC-04 AC-1; UC-10 AC-3 | AC-1 restated the 24-hour default; AC-3 tested a step that moved to UC-11. | Criteria go stale or fail. | Point AC-1 to chunk 03 Timing and AC-3 to UC-11. | Corrected (06a UC-04, 06b UC-10; 2026-10-07) | Run 3 |
| CF-25 | C7 | UC-11 A1; UC-16 A1 | Two stated branches had no criterion. | Untested branches. | Add one criterion to each. | Corrected (06b UC-11, 06c UC-16; 2026-10-07) | Run 3 |
| CF-26 | C5 | 02 Dependencies, counsel row | The counsel row left out the under-15 proposal. | A counsel question could stay open after the row closes. | Add it to the row. | Corrected (02 Dependencies; 2026-10-07; carries OI-08) | Run 3 |
| CF-27 | C6 | 13 Reviewer Notes | The notes that Run 1 acted on did not say so. | Step 1 could collect them again. | Add an "Action taken" note. | Corrected (13 Reviewer Notes; 2026-10-07) | Run 3 |
| CF-28 | C7, C1 | 06c UC-14 AC-4 and E2; 03 Figure 1 Summary line | AC-4 still says any unanswered appointment joins the call list, and the Figure 1 Summary names only the Booked path; after OI-30 a Confirmed appointment stays Confirmed. Follows up CF-20. | A correct build fails AC-4 for a confirmed booking; the Summary contradicts the figure. | UC-14 AC-4: "Given a Booked appointment and the patient does not answer the reminder, then the appointment shows on the call list." The Figure 1 Summary names the Booked and the Confirmed paths. | Decided - pending application: TD-86 (the user accepted it on 2026-10-07; carries OI-30) | - |
| CF-29 | C1, C5 | 03 Message content (the OI-31 proposal); 06b UC-07 step 4; UC-09 step 2 | "Can be changed later" has no flow, and the Arabic default in UC-07 step 4 could reset a known patient's language. Follows up CF-21; touches rejected OI-10. | A returning patient's language is undefined. | Choice: ask only once; keep asking and let a different choice change it; or add a question. | Open item raised: OI-33 / TD-87 (Decided - pending application: Option B, the user, 2026-10-07) | - |
| CF-30 | C6 | decision-log.md, Clarification register, first sentence | The register says 28 open items were decided; the same paragraph counts 32. | The decision record has a wrong count. | "32 open items from chunk 13 were decided on 2026-10-07." | Decided - pending application: TD-88 (the user accepted it on 2026-10-07) | - |
| CF-31 | C6, C10 | 11 Language & Locale; 14 TD-12 and TD-67 Blocks | Chunk 11 points at UC-07 as the home of the message language (now chunk 03, OI-27); TD-12 Blocks leaves out UC-09 step 2; TD-67 Blocks leaves out the under-15 proposal. Follows up CF-21 and CF-26. | Readers follow a stale home; the register understates what is blocked. | Chunk 11: "(chunk 03 Message content)"; add UC-09 step 2 to TD-12 Blocks and the under-15 proposal to TD-67 Blocks. | Decided - pending application: TD-89 (the user accepted it on 2026-10-07) | - |
| CF-32 | C10 | 14 TD-70, TD-73 | Both rows are P3, but TD-70 can change a price that UC-05 AC-3 tests, and TD-73 touches the NFR-03 measure: both are P2 by the priority rules. | The P1/P2/P3 split and the grill-me order are wrong. | Set both rows to P2 and update the ranges in steps 1 and 3. | Decided - pending application: TD-90 (the user accepted it on 2026-10-07) | - |
| CF-33 | C10 | 14 MK-07, MK-08, MK-13, MK-14; 07 UC-17 Receptionist cell; UC-17 A3 | No mockup row covers UC-17 A3 (an opt-out recorded at the desk); MK-13 and MK-14 miss blockers (TD-24; TD-27 and TD-47); MK-07 leaves out the UC-07 E2 overlap warning. | An actor-facing flow has no screen; rows show open behaviour without their blockers. | MK-08: add UC-17 (A3), the state "opt-out recorded at the desk", and TD-24; MK-13: add TD-24; MK-14: add TD-27 and TD-47; MK-07: add the state "overlap warning". | Decided - pending application: TD-91 (the user accepted it on 2026-10-07) | - |
| CF-34 | C10 | 14 step 5, Patient diagram row; 06c UC-16 Trigger; UC-14 A3 and A4 | The row misses two documented hand-overs: the proposed UC-14 A4 to UC-16, and the proposed UC-14 A3 to UC-17. | The step 5 diagram would miss documented paths. | "UC-16 extends UC-14 (UC-14 A1; A4, proposed)"; add "UC-17 extends UC-14 (UC-14 A3, proposed)". | Decided - pending application: TD-92 (the user accepted it on 2026-10-07) | - |
---

## Step 3 - Finalise requirements with the grill-me skill

| | |
|---|---|
| **Status** | Not started |
| **Required inputs** | Open rows of the register above (P1 first); unresolved consistency findings; the requirements listed below |
| **Expected output** | A decision list from the session; confirmed decisions applied to the affected BRD chunks; consistency check rerun |
| **Completion criteria** | The product manager confirms the session took place and hands back the decision list; every confirmed decision is applied and logged; the step 2 reruns that follow (delivery-chunks.md § Step 2) leave no new undispositioned finding. New questions reopen steps 1-2. |
| **Evidence** | None yet. Recommended, not executed. |

**Take into the session**

| What | Items |
|------|-------|
| Open questions and pending decisions | TD-01 to TD-24 (P1) first, then TD-25 to TD-68 (P2) and TD-69 to TD-77 (P3) |
| Unresolved consistency findings | CF-28 to CF-34 (decided, pending application in the next request) |
| Requirements to stress-test even though nothing is flagged | BO-07 and BO-08 with UC-14 and UC-15; BO-09 with UC-16; BO-12 and BO-13 with UC-03; the prices in UC-05 AC-1 to AC-3; NFR-01 |

**Ready-to-use handoff prompt** (recommended; run it yourself with `/grill-me`):

```text
/grill-me Finalise the requirements of the Clinic Reminders BRD v1.0 in ./brd-clinic-reminders/.
Read clinic-reminders-brd-master.md first, then 14-todo.md.
Grill me in this order:
1. Open questions and pending decisions: TD-01 (pre-BRD OI-01, 01 / Business Objectives), TD-02 (pre-BRD OI-05, 01 / BO-04), TD-03 (pre-BRD OI-12, 04 / Project Scope), TD-04 (pre-BRD OI-15, sender model), TD-05 (02 / Constraint 6, 06b / UC-08 step 3), TD-06 and TD-07 (03 / Waitlist and slot offers), TD-08 (06a / UC-03 Trigger), TD-09 and TD-10 (06a / UC-04 steps 3 and 4), TD-11 (06c / UC-15 Trigger), then the proposals TD-12 to TD-24, then TD-25 to TD-68 and TD-69 to TD-77.
2. Unresolved consistency findings: CF-28 to CF-34 (decided, pending application in the next request).
3. Requirements to stress-test: BO-07 and BO-08 (06c / UC-14, UC-15), BO-09 (06c / UC-16), BO-12 and BO-13 (06a / UC-03), 06a / UC-05 AC-1 to AC-3, 10 / NFR-01.
For every decision I confirm, name the chunk and section it changes.
Do not edit any file during the session. End with a numbered decision list I can hand back to brd-unifier.
```

**After the session:** apply new/changed confirmed choices through the decision/OI/TD mechanics and scoped recheck. A no-change confirmation goes only in evidence/history, not a new TD. Third-run choices wait for the next request. Recheck the gate; existing delivery outputs become Stale only when their source meaning changed.

---

## Step 4 - Generate mockups in Figma

| | |
|---|---|
| **Status** | Pending gate |
| **Gate** | Starts only after steps 1-3 are `Complete` with evidence (conditions G1-G3 above, verified in the files). Runs in parallel with step 5; neither waits for the other. The product manager's confirmation is the evidence for step 3. No override. |
| **Required inputs** | Finalised use cases (06*), the matrix ([07](./07-users-use-cases-matrix.md)), UI/UX Expectations ([11](./11-summary-and-uiux.md)), decisions from steps 1-3, and the project's global UI/UX constitution when one exists. No UI/UX constitution found; chunk 11 used. |
| **Expected output** | A playable, responsive prototype covering the table below, reviewed against the criteria, with links in each UC UI/UX or owning no-UC report/requirement section |
| **Completion criteria** | Every row is `Approved`; the product manager confirms the review and a dated play-through; the Figma links are in the UC UI/UX or owning no-UC report/requirement section |
| **Evidence** | None yet. Play-through: date and result once confirmed. |

**Approval impact:** No mockup exists yet, so there is no approval to keep or reopen.

**Standard to follow.** The project has no constitution, so chunk 11 is the visual standard and the rules below still apply. For Figma, the playable-flow, breakpoint, variant, token, simulated-data, and dated play-through rules apply in full. Source and confirmed project rules govern, with conflicts settled by the owner. Deliver confirmed breakpoints only; unstated breakpoints are proposals (TD-75). P1 rows: every Main Flow playable from the named start frame with no dead ends, every actor-facing control wired. P2 rows: connected to neighbouring frames. States are variants, not duplicate frames. A no-UC screen names its MK and owning report/requirement section.

**Ready-to-use mockup brief** (recommended; run it yourself in the mockup tool or agent):

```text
Use the UI/UX Expectations in 11-summary-and-uiux.md as the visual baseline. The project has no UI/UX constitution.
Use the Clinic Reminders BRD v1.0 in ./brd-clinic-reminders/ for the workflows, fields, permissions and business rules. Read clinic-reminders-brd-master.md first, then 14-todo.md.
Create a playable Figma prototype covering every row of the Mockup coverage table below, for the Clinic Owner, the Receptionist, and the Patient of small private clinics in Cairo and Giza.
P1 rows: one named start frame, every Main Flow playable with no dead ends and actor-facing controls wired. Deliver only source/owner-confirmed breakpoints from chunk 11 (none is confirmed yet: TD-75).
P2 rows: connected to neighbouring frames, at the source/owner-confirmed breakpoints from chunk 11.
States are component variants. Variables and text styles map to the chunk 11 colors (the key color is still open: TD-76). Label simulated data and demo actions.
The reception screens are in Arabic, right to left; patient messages are in Arabic or English.
Name the UC-NN on each frame, or the MK-NN and owning report/requirement section for a no-UC screen. List unstated behaviour for a decision; do not add it.
Return the share link (view permission, opening on the start frame) and the list of frames per breakpoint.
```

### Mockup coverage

<!-- One row per screen or flow, each with its own MK-NN: the BRD's screen reference. When the source material defined a screen ID, add it in the Screen / flow cell; never invent one. -->

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| MK-01 | Clinic account set-up | UC-01 | 03 Subscription plans; 02 constraint 1 | Default; loading; governorate not served; owner declines WhatsApp | P2 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-04, TD-16, TD-42 | - | - |
| MK-02 | Staff list and receptionist invitation | UC-02 | 07 matrix | Default; empty; invitation sent; login removed | P2 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-17, TD-37 | - | - |
| MK-03 | Weekly no-show report message (WhatsApp) | UC-03 | 09 Weekly no-show report | Normal week; week with no appointments; outcomes not recorded | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-03, TD-08, TD-55, TD-62 | - | - |
| MK-04 | Reminder settings | UC-04 | 03 Reminders, Timing | Default; changed timing; visit-day reminder on and off | P2 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-09, TD-10, TD-18 | - | - |
| MK-05 | Billing and top-ups | UC-05 | 03 Subscription plans | Default; payment refused; allowance used up; paid | P2 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-15, TD-38, TD-40, TD-43, TD-44, TD-56 | - | - |
| MK-06 | Staff activity log | UC-06 | 11 Filtration | Default; filtered; no matching action | P2 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-19 | - | - |
| MK-07 | Appointment book and add appointment | UC-07 | 03 Message content; 02 constraints 7 and 12 | Default; empty day; loading; error; No consent; patient under 15 | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-12, TD-13, TD-20, TD-45, TD-46 | - | - |
| MK-08 | Consent recording | UC-08 | 02 constraints 6, 7, 12, and 15 | Patient agrees; guardian agrees; patient refuses | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-05, TD-13, TD-57 | - | - |
| MK-09 | Appointment import | UC-09 | 02 constraint 12 | Upload; rows with errors; patients without consent; rejected file | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-21 | - | - |
| MK-10 | Day view and call list, with cancel and attendance | UC-10, UC-11, UC-13 | 03 Appointment statuses and Day view labels; 07 matrix | Default; call list; cancellation alert; empty; loading; error | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-22, TD-23, TD-53, TD-59 | - | - |
| MK-11 | Waitlist | UC-12 | 03 Waitlist and slot offers | Default; empty; no consent | P2 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-14, TD-58 | - | - |
| MK-12 | WhatsApp reminder, confirmation, cancellation, and opt-out messages | UC-14, UC-17 | 02 constraints 14 and 17 | Arabic; English; visit-day reminder; reminder no longer valid; opt-out confirmation | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-12, TD-24, TD-59 | - | - |
| MK-13 | SMS reminder and link page | UC-15 | 02 constraints 14, 19, and 20 | Confirm; cancel; link no longer valid; Stop messages | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-11, TD-60 | - | - |
| MK-14 | Slot offer message | UC-16 | 02 constraint 17 | Offer; accepted; slot filled | P1 | N | Not confirmed (TD-75) | Pending gate; blocked by TD-06, TD-07, TD-14, TD-61 | - | - |

**Expected coverage:** every actor-facing UC has a screen; every observable flow/state appears; roles follow the matrix and standards follow chunk 11. P1 rows are fully interactive, P2 rows connected. All rows use source/owner-confirmed breakpoints, not a priority-implied minimum.

**Review criteria**

- [ ] Each frame names its UC, or its MK and owning report/requirement section when no UC exists.
- [ ] Every flow can be walked end to end without a missing screen, and played in play mode from the named start frame with no dead ends.
- [ ] Every actor-facing control on a P1 screen is wired (navigation, overlays, drawers, dialogs, tabs, filters, form validation and error paths, destructive-action confirmation).
- [ ] Loading, empty, and error states are present where the use cases call for them, as variants rather than duplicate frames.
- [ ] Frames exist for every source/owner-confirmed breakpoint in chunk 11; no unstated tablet minimum was added.
- [ ] What each role sees matches the Users & Use Cases Matrix.
- [ ] Global UI/UX standards in chunk 11 hold on every screen.
- [ ] Variables and text styles map to the chunk 11 colors; no raw hex in components.
- [ ] Simulated data and demo actions are labelled; nothing implies a change to a production system.
- [ ] Contrast, focus order and keyboard order are annotated on key frames.
- [ ] The share link has view permission and opens on the start frame.
- [ ] No mockup shows behaviour the BRD does not describe (if one does, add a TD row; do not absorb it).

---

## Step 5 - Update the use-case chunks with use-case diagrams and flowcharts

| | |
|---|---|
| **Status** | Pending gate |
| **Gate** | Starts only after steps 1-3 are `Complete` with evidence (conditions G1-G3 above, verified in the files). Runs in parallel with step 4; neither waits for the other. The product manager's confirmation is the evidence for step 3. No override. |
| **Required inputs** | Finalised requirements and use-case narratives; this step's tracking tables |
| **Expected output** | Use-case diagrams added to [05-user-journeys-overview.md](./05-user-journeys-overview.md); a flowchart added to every qualifying use case in chunks 06*; consistency check rerun. Completing this step opens the delivery gate for chunks 15, 16, and 17. |
| **Completion criteria** | Chunk 05 contains the applicable use-case diagrams; every qualifying 06* use case has its flowchart and every other use case has a recorded skip reason; all Mermaid blocks parse; the updated chunks pass the consistency check |
| **Evidence** | None yet |

The diagrams are updates to chunks 05 and 06*. This file only tracks them. Gaps found while drawing are recorded in the register above and resolved before the affected diagram is finalised; behaviour is never invented to complete a diagram.

### Use-case diagrams (chunk 05)

An overview of 17 use cases, 3 personas, and 3 external parties would run well past 30 lines. The plan is one diagram per persona, in the chunk 05 order.

| Diagram | Actors | Use cases | Relationships documented in the narratives | Status | Figure |
|---------|--------|-----------|--------------------------------------------|--------|--------|
| Clinic Owner | Clinic Owner; Receptionist; External: WhatsApp Business Platform (Meta), payment gateway | UC-01 to UC-06 | None | Pending gate | - |
| Receptionist | Receptionist; Patient | UC-07 to UC-13 | UC-08 extends UC-07 (UC-07 A1) and UC-12 (UC-12 E1); UC-09 includes UC-08 (UC-09 step 8); UC-10 includes UC-11 (UC-10 step 7); UC-11 includes UC-16 (UC-11 step 8) | Pending gate | - |
| Patient | Patient; Receptionist; External: WhatsApp Business Platform (Meta), SMS aggregator | UC-14 to UC-17 | UC-15 extends UC-14 (UC-14 E1); UC-16 extends UC-14 (UC-14 A1) and UC-15 (UC-15 A1); UC-08 extends UC-17 (UC-17 A2) | Pending gate | - |

### Use-case flowcharts (chunks 06*)

<!-- Required: 3 or more Main Flow steps AND at least one decision point (an alternate flow, an exception flow, or a business rule that changes the path). Otherwise skipped with the reason. Status: Skipped (from the start, for planned skips) / Pending gate / Not started (gate open, not drawn yet) / Drafted / Provisional (TD-NN) / Final. A diagram that was already in the source is listed as "Pre-existing - re-verify at step 5". -->

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-clinic-owner.md) | 10 | A1, E1, E2 | Required | Pending gate | - |
| UC-02 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1 | Required | Pending gate | - |
| UC-03 | [06a](./06a-use-cases-clinic-owner.md) | 5 | A1, E1, E2 | Required | Pending gate | - |
| UC-04 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1 | Required | Pending gate | - |
| UC-05 | [06a](./06a-use-cases-clinic-owner.md) | 7 | A1, A2, E1, E2, E3 | Required | Pending gate | - |
| UC-06 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1 | Required | Pending gate | - |
| UC-07 | [06b](./06b-use-cases-receptionist.md) | 9 | A1, A2, E1, E2 | Required | Pending gate | - |
| UC-08 | [06b](./06b-use-cases-receptionist.md) | 6 | A1, E1 | Required | Pending gate | - |
| UC-09 | [06b](./06b-use-cases-receptionist.md) | 8 | E1, E2, E3 | Required | Pending gate | - |
| UC-10 | [06b](./06b-use-cases-receptionist.md) | 8 | A1, A2, A3 | Required | Pending gate | - |
| UC-11 | [06b](./06b-use-cases-receptionist.md) | 8 | A1 | Required | Pending gate | - |
| UC-12 | [06b](./06b-use-cases-receptionist.md) | 6 | A1, E1 | Required | Pending gate | - |
| UC-13 | [06b](./06b-use-cases-receptionist.md) | 5 | A1, E1 | Required | Pending gate | - |
| UC-14 | [06c](./06c-use-cases-patient.md) | 6 | A1, A2, A3, A4, E1, E2, E3 | Required | Pending gate | - |
| UC-15 | [06c](./06c-use-cases-patient.md) | 6 | A1, E1, E2 | Required | Pending gate | - |
| UC-16 | [06c](./06c-use-cases-patient.md) | 7 | A1, A2, E1, E2 | Required | Pending gate | - |
| UC-17 | [06c](./06c-use-cases-patient.md) | 5 | A1, A2, A3 | Required | Pending gate | - |

**Optional, later:** mirror the diagrams to a Miro board for collaboration or presentation. Ask brd-unifier for it explicitly; the inline Mermaid stays authoritative.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->
