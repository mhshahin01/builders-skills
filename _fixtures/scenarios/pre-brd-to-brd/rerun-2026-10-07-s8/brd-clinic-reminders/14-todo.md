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
| 1 | Resolve open items and clarifications | In progress | None yet. 78 rows are Open (TD-01 to TD-74, TD-76 to TD-79), and 6 are Decided - pending application (TD-87 to TD-92). All 39 open items of chunk 13 are decided (30 applied, 9 rejected). | Step 2 |
| 2 | Run a consistency check across all BRD chunks | In progress | Runs 1 to 3 on 2026-10-07 (see step 2); 32 findings, each with a disposition. CF-27 to CF-32 wait for the next request (TD-87 to TD-92). | Step 3 |
| 3 | Finalise requirements with the grill-me skill | Not started | None yet. Recommended, not executed. | Steps 4 and 5 |
| 4 | Generate mockups in Figma | Pending gate | None yet | The delivery gate: chunks 15, 16, 17 (with step 5) |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Pending gate | None yet | The delivery gate: chunks 15, 16, 17 (with step 4) |

## Delivery gate

> Chunks 15, 16, and 17 are **locked** until every row below says `Met`. `Deferred` items do not count as closed. There is no override.

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete: every to-do item `Resolved`; no Open, Deferred, or Decided - pending application item in chunk 13; no clarification marker left in chunks 00-12 | Not met | 78 rows are Open (TD-01 to TD-74, TD-76 to TD-79), and 6 are Decided - pending application (TD-87 to TD-92). 106 clarification markers remain in chunks 00-12 (47 questions, 59 proposals). No item in chunk 13 is Open, Deferred, or Decided - pending application. |
| G2 | Step 2 complete: check rerun after the last BRD change; every finding has a disposition and none is still waiting on a decision or its application | Not met | Step 2 is In progress: the check of the first build leaves it so (delivery-chunks.md, Step 2). CF-05 waits on TD-09. Run 3 found 5 corrections (CF-27 to CF-31), and CF-32 was found after it; all 6 are Decided - pending application (TD-87 to TD-92) and wait for the next request. |
| G3 | Step 3 complete: grill-me session confirmed; decisions applied | Not met | No grill-me session is confirmed. Step 3 is Not started. |
| G4 | Step 4 complete: every mockup approved; review/play-through confirmed; links in UC UI/UX or owning no-UC report/requirement section | Not met | MK-01 to MK-16 are Pending gate. No mockup, review, or play-through exists. |
| G5 | Step 5 complete: use-case diagrams and flowcharts added; consistency check rerun | Not met | 3 use-case diagrams and 16 flowcharts are Pending gate (UC-05 is a planned skip). |

**Gate:** Shut | **Next action:** Decide the open P1 rows (TD-01 to TD-30, TD-32, TD-33), starting with counsel's answers (TD-04 to TD-10) and the sender model (TD-11). Then run /grill-me with the prompt in step 3. The next update of this BRD first applies TD-87 to TD-92.

## Downstream outputs

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | 15-implementation.md | Locked | G1, G2, G3, G4, G5 (all Not met) |
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
| **Evidence** | None yet. The 39 open items of chunk 13 were decided on 2026-10-07 ([Resolution Log](./13-open-items-and-clarifications.md#resolution-log); [decision-log.md](./decision-log.md)); 78 rows below are still Open, and 6 are Decided - pending application. |

### Open items register

Every row's Owner is a recommendation until the BRD author is named (TD-79).

| ID | Priority | Kind | Source (chunk / identifier) | Decision or clarification needed | Blocks | Owner | Status |
|----|----------|------|-----------------------------|----------------------------------|--------|-------|--------|
| TD-01 | P1 | Open question | [04 / Release phases](./04-scope-and-personas.md#release-phases), validation-gate marker (pre-BRD 24, OI-01) | Which MVP and pilot dates hold, given the validation gate proposed before the build? | 04 / Release phases; 04 / In Scope (MVP); 01 / Business Objectives 1 to 3 (pilot window) | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-02 | P1 | Open question | [02 / Assumption 21](./02-glossary-assumptions-facts.md#assumptions--constraints), timed-slot marker (pre-BRD 24, OI-03); pointers in 01 / Background and 03 / Waitlist and slot offers | Do target clinics book timed slots, what share of them, and are arrival-order clinics in the target market? The answer also validates Assumption 21. | UC-13; UC-16; 03 / Waitlist and slot offers; Business Objective 3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-03 | P1 | Open question | [03 / Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers), automatic-or-manual marker (pre-BRD 24, OI-11 and OI-12); pointer in 01 / Business Objective 3 | Does the MVP send waitlist offers automatically, or does reception send each one with one click in the pilot? Must half of the pilot clinics keep an active waitlist? | UC-16 Main Flow; UC-13; Business Objective 3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-04 | P1 | Open question | [02 / Constraint 1](./02-glossary-assumptions-facts.md#assumptions--constraints), licence marker (pre-BRD 08, Legal (1)); 02 / Assumption 25 | Which PDPC licence does Clinic Reminders need, how are records counted, which fee tier applies, does each clinic need its own licence, and is the portal live? The answer also validates Assumption 25. | 02 / Constraint 1; UC-09; every use case that handles patient data | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-05 | P1 | Open question | [02 / Constraint 6](./02-glossary-assumptions-facts.md#assumptions--constraints), data-location marker (pre-BRD 08, Legal (3)) | Will patient data be kept in Egypt or abroad, and does sending messages through WhatsApp count as a transfer abroad that needs a licence? | NFR-08; 02 / Constraints 6 and 15 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-06 | P1 | Open question | [02 / Constraint 10](./02-glossary-assumptions-facts.md#assumptions--constraints), health-data marker (pre-BRD 08, Legal (2)) | Does the PDPC treat appointment or specialty details as health data? | 03 / Message content; UC-14 step 1; UC-15 step 1; UC-16 step 1; NFR-06 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-07 | P1 | Open question | [02 / Constraint 13](./02-glossary-assumptions-facts.md#assumptions--constraints), ethics marker (pre-BRD 08, Legal (5)) | Do the Code of Medical Ethics or Ministry of Health rules restrict a third-party service that messages patients for a clinic? | UC-14 to UC-17; 02 / Constraint 13 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-08 | P1 | Open question | [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 11, marketing marker (pre-BRD 08, Legal (2)) | Do waitlist offers count as electronic marketing that needs its own licence? | UC-16; 03 / Offer rules; 02 / Constraints 11 and 12 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-09 | P1 | Open question | [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 3, written-consent marker (pre-BRD 08, Legal (2)); also rule 9 (the patient's WhatsApp message as proof) and the UC-09 step 4 proposal (CF-05) | Does a WhatsApp opt-in count as written consent under the PDPL? The answer also decides whether rule 9 keeps "the patient's WhatsApp message" as proof. | UC-09 step 4; UC-08 A1; 03 / Consent rules, rules 3 and 9; UC-04 export | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-10 | P1 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), "Counsel answers on the PDPL" (Pending) | Confirm who obtains counsel's answers on the licence type, the consent form, and the data location, and that they arrive before the build of UC-09. | UC-09; TD-04 to TD-09 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-11 | P1 | Open question | [08 / Integrations](./08-integrations.md#integrations), WhatsApp Business Platform row, sender-model marker (pre-BRD 24, OI-15); pointer in 02 / Dependencies, Meta row | Do messages go from each clinic's own WhatsApp number or from one shared Clinic Reminders number? | UC-01; UC-14 to UC-17; 03 / Consent rules, rule 6; 08; 02 / Dependencies | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-12 | P1 | Open question | [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules), SMS-wait marker | How long does Clinic Reminders wait for WhatsApp delivery before it sends the SMS? | UC-14 E1; UC-15 Trigger and AC-1; NFR-02 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-13 | P1 | Open question | [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds), length marker (raised by OI-12) | Do appointments need a length, so that a freed slot goes only to a waitlisted patient whose visit fits? | UC-07 step 5; UC-16; 03 / Offer rules, rules 2 and 3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-14 | P1 | Open question | [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 3 | Which waitlisted patients can get an offer for a freed slot, and what happens to a later appointment that the accepting patient holds? | UC-13 steps 4 and 5; UC-16 Trigger and E4 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-15 | P1 | Open question | [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 5 | Do waitlisted patients get an offer one at a time, in order, or several at once? | UC-16 steps 1 to 5 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-16 | P1 | Open question | [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 6 | How long does an offer stay open, and how close to the visit can a freed slot still be offered? | UC-16 step 2, A1, E2, AC-3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-17 | P1 | Open question | [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 6, opt-out-words marker | Which Arabic word or words count as an opt-out? | UC-17 step 1; UC-14 E4 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-18 | P1 | Open question | [03 / Weekly no-show report](./03-definitions-and-domain-concepts.md#weekly-no-show-report), report-time marker | On which day and at what time does the weekly report go, and which seven days does it cover? | UC-03 Trigger, step 1, AC-1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-19 | P1 | Open question | [06a / UC-05](./06a-use-cases-clinic-owner.md#uc-05-change-the-reminder-timing), step 3 | Which reminder times can a clinic choose? | UC-05 step 3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-20 | P1 | Open question | [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle) and [03 / What an appointment holds](./03-definitions-and-domain-concepts.md#what-an-appointment-holds): 3 proposals | Confirm or replace the proposals: a confirmed patient can still cancel; a cancelled appointment cannot be marked; what an appointment holds. | UC-07 step 5; UC-08 Preconditions and E2; UC-12; UC-14 A2; Figure 1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-21 | P1 | Open question | [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules), [03 / Message content](./03-definitions-and-domain-concepts.md#message-content), [03 / Reply rules](./03-definitions-and-domain-concepts.md#reply-rules): 6 proposals | Confirm or replace the proposals: a late entry is reminded at once; the reminder content; shared phones; the acknowledgement; typed replies; replies after the visit time. | UC-07 E4 and its criterion; UC-14 step 1, E2, E3, E5; UC-15 step 1; UC-10 E3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-22 | P1 | Open question | [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rules 4, 8, 9, 10, and 12: 5 proposals | Confirm or replace the proposals: the waitlist order; an accepted offer books a Confirmed appointment; nobody accepts; WhatsApp only; the 30-day entry limit. | UC-13; UC-16 step 4, A1, E3; Figure 1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-23 | P1 | Open question | [03 / Measures](./03-definitions-and-domain-concepts.md#measures), formula proposal | Confirm or replace the formulas of the no-show rate, the confirmed share, the refilled slots, and the estimated fees. | UC-03 AC-2 and AC-3; Business Objectives 1 and 3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-24 | P1 | Open question | [06a / UC-01](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic-account): 6 proposals (steps 1 and 2, A1, A2, E1, E2) | Confirm or replace the UC-01 proposals. | UC-01 Main Flow, A1, A2, E1, E2 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-25 | P1 | Open question | [06a / UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins): 3 proposals (step 4, A1, E1) | Confirm or replace the UC-02 proposals. | UC-02 step 4, A1, E1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-26 | P1 | Open question | [06a / UC-04](./06a-use-cases-clinic-owner.md#uc-04-export-the-consent-records): 2 proposals (step 4, E1) | Confirm or replace the UC-04 proposals. | UC-04 step 4, E1; 09 / Consent records | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-27 | P1 | Open question | [06a / UC-05](./06a-use-cases-clinic-owner.md#uc-05-change-the-reminder-timing): 2 proposals (step 5, Business Rules) | Confirm or replace the UC-05 proposals. | UC-05 step 5, Business Rules | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-28 | P1 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription): 4 proposals (steps 1 and 6, E1, E3) | Confirm or replace the UC-06 proposals. | UC-06 Main Flow, E1, E3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-29 | P1 | Open question | [06b / UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-consent), step 4: 1 proposal | Confirm or replace the proposal on how consent was given. | UC-09 step 4; 03 / Consent rules, rule 9 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-30 | P1 | Open question | [06b / UC-11](./06b-use-cases-receptionist.md#uc-11-change-or-cancel-an-appointment): 4 proposals (step 4, A1, A2, E1) | Confirm or replace the UC-11 proposals. | UC-11; Figure 1; 03 / Appointment lifecycle | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-32 | P1 | Open question | [06c / UC-16](./06c-use-cases-patient.md#uc-16-accept-a-waitlist-offer): 3 proposals (step 1, E1, E2) | Confirm or replace the UC-16 proposals. | UC-16 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-33 | P1 | Open question | [06c / UC-17](./06c-use-cases-patient.md#uc-17-stop-all-messages): 2 proposals (step 4, A1) | Confirm or replace the UC-17 proposals. | UC-17 step 4, A1; UC-15 A2; 02 / Glossary (Opt-out) | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-81 | P1 | Pending decision | [13 / OI-34](./13-open-items-and-clarifications.md#oi-34-chunk-04-gives-the-owner-rights-that-three-use-cases-still-ask-about) (raised by CF-07) | Settled by OI-34: the Clinic Owner is the Primary Actor of UC-02, UC-04, and UC-05. | UC-02; UC-04; UC-05; 07 | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-34; [decision-log.md, Q-34](./decision-log.md#q-34---oi-34)) |
| TD-31 | P2 | Open question | [06c / UC-15](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link): 2 proposals (E2, what the page says; E3) | Confirm or replace the UC-15 proposals. | UC-15 E2, E3; Figure 1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-34 | P2 | Open question | [02 / Assumption 23](./02-glossary-assumptions-facts.md#assumptions--constraints), pilot-design marker (pre-BRD 24, OI-07); pointers in 01 / Business Objective 1 and 02 / Dependencies | Should the no-show cut be measured against a random half of appointments with no reminder, instead of a baseline before go-live? The answer also validates Assumption 23. | Business Objective 1; 02 / Dependencies, no-show baseline | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-35 | P2 | Open question | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives), Objective 5 | What patient reply rate is the target? | Business Objective 5 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-36 | P2 | Open question | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives), Objective 6 | What cut in reminder-call time counts as success? | Business Objective 6; NFR-11 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-37 | P2 | Open question | [02 / Glossary](./02-glossary-assumptions-facts.md#glossary), Late cancellation | How close to the visit does a cancellation count as late? | 03 / Measures; UC-03 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-38 | P2 | Open question | [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules), second-reminder marker | At what time on the visit day does the second reminder go, and does it go to patients who already confirmed? | UC-14 A3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-39 | P2 | Open question | [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 6, shared-number marker | When several patients share one mobile number, does a STOP reply stop the messages for all of them? | UC-17; 07, footnote 2 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-40 | P2 | Open question | [03 / Weekly no-show report](./03-definitions-and-domain-concepts.md#weekly-no-show-report), MVP-form marker (pre-BRD 24, OI-12) | For the MVP, is the weekly report a fixed WhatsApp message with these measures only? | UC-03 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-41 | P2 | Open question | [03 / Measures](./03-definitions-and-domain-concepts.md#measures), unmarked-appointments marker | How does the report count a past appointment that reception did not mark? | UC-03 A2; UC-12 E1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-42 | P2 | Open question | [03 / Staff action log](./03-definitions-and-domain-concepts.md#staff-action-log), counsel marker (raised by OI-01) | Which activity must Clinic Reminders log under the Anti-Cybercrime Law 175/2018? | 03 / Staff action log; 04 / In Scope (record from go-live); 02 / Constraint 7 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-43 | P2 | Open question | [03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance), per-doctor-features marker (raised by OI-24) | Do per-doctor calendars and the per-doctor fee estimates come with every plan, or only with the Clinic plan? | UC-03; UC-10 A3; 04 / In Scope (paid launch) | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-44 | P2 | Open question | [03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance), allowance marker | When a clinic uses up its reminder allowance, does Clinic Reminders keep sending and bill top-ups, or stop? | UC-06 A2; UC-14 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-45 | P2 | Open question | [03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance), non-payment marker | What happens to reminders when a payment is not made by its due date? | UC-06 E2 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-46 | P2 | Open question | [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope), Trials and referral credits marker (raised by OI-02) | How do the founders apply a free month or a trial: by moving the clinic's next due date? | UC-06 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-47 | P2 | Open question | [06a / UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report), E1 | What happens when the weekly report is not delivered on WhatsApp? | UC-03 E1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-48 | P2 | Open question | [06b / UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment), A1, counsel marker (raised by OI-19) | What happens to a guardian's consent when the patient turns 15, and may messages keep going to the guardian's number? | UC-07 A1; UC-09 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-49 | P2 | Open question | [06b / UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file), A1, counsel marker (raised by OI-18) | Is consent taken from an imported file enough, or must each imported patient consent again? | UC-08 A1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-50 | P2 | Open question | [08 / Integrations](./08-integrations.md#integrations), SMS aggregator row | Which NTRA-licensed SMS aggregator? | 08; UC-02; UC-15; 02 / Dependencies | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-51 | P2 | Open question | [08 / Integrations](./08-integrations.md#integrations), local payment gateway row | Which local payment gateway? | 08; UC-06 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-52 | P2 | Open question | [10 / NFR-03](./10-nfrs.md#non-functional-requirements) | How much disruption per month can the business accept, for reminder sending and for the dashboard? | NFR-03 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-53 | P2 | Open question | [10 / NFR-04](./10-nfrs.md#non-functional-requirements), volume marker (pre-BRD 03, Cost Structure) | How many appointments does a target clinic have each month, and what share of patients needs the SMS fallback? | NFR-04 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-54 | P2 | Open question | [10 / NFR-07](./10-nfrs.md#non-functional-requirements), counsel marker (raised by OI-28) | By when must Clinic Reminders tell an affected clinic, and who tells the affected patients? | NFR-07 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-55 | P2 | Open question | [10 / NFR-09](./10-nfrs.md#non-functional-requirements) | How long are patient details, appointments, replies, and reminder consent records kept, and what happens to a clinic's data when it leaves? | NFR-09 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-56 | P2 | Open question | [10 / NFR-12](./10-nfrs.md#non-functional-requirements), marker (raised by OI-29) | How long after a disruption may an answer wait before it is applied? | NFR-12 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-57 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), Meta business verification row (Pending) | Confirm the owner, the 2026-12-15 target, and the treatment of Meta verification and the utility templates. | Go-live; UC-03; UC-14; UC-16; UC-17 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-58 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), SMS sender name row (Pending) | Confirm the owner and the 2026-12-31 target for the sender name on all four networks. | Go-live; UC-15 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-59 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), SMS aggregator contract row (Pending) | Confirm the owner, and that the contract is in place before the build of UC-02 and UC-15. | UC-02; UC-15 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-60 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), PDPC licence row (Pending; marker, pre-BRD 24, OI-05); 02 / Assumption 24 | By when must the PDPC licence be granted, not only filed, so that the pilot starts on time? | Go-live; the pilot | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-61 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), DPO row (Pending; marker, pre-BRD 11, W2) | Will the DPO be in-house or outsourced, and who appoints the DPO by 2026-12-31? | Go-live; 02 / Constraint 4 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-62 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), Incorporation row (Pending; marker, pre-BRD 11, S3) | Is the company incorporated in Egypt, with a commercial register and a tax card? | Go-live; TD-57; TD-58 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-63 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), payment gateway contract row (Pending) | Confirm the owner, and that the contract is in place before the build of UC-06. | UC-06 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-64 | P2 | Assumption to validate | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), no-show baseline row (Pending) | Confirm the owner, and how each pilot clinic's baseline is recorded before go-live (see TD-34). | Business Objective 1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-65 | P2 | Assumption to validate | [02 / Assumption 26](./02-glossary-assumptions-facts.md#assumptions--constraints) | Confirm that Meta approves the reminders, confirmations, and waitlist offers as utility templates, and also approves the weekly report template. | UC-03; UC-14; UC-16; 02 / Constraint 19 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-66 | P2 | Open question | [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 7: 1 proposal | Confirm or replace: after an opt-out, messages start again only after new consent. | UC-09 A2; UC-17 A3 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-67 | P2 | Open question | [03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance): 2 proposals | Confirm or replace: the pilot clinics' plan and first due date; the new price shown before a third doctor is saved. | UC-06 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-68 | P2 | Open question | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors), Clinic Owner access: 1 proposal | Confirm or replace: the Clinic Owner can also do every receptionist use case. | 07; UC-07 to UC-13 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-69 | P2 | Open question | [06a / UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report), A1: 1 proposal | Confirm or replace: the report says that there were no appointments that week. | UC-03 A1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-70 | P2 | Open question | [06b / UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment): 2 proposals (E1, E2) | Confirm or replace the UC-07 proposals. | UC-07 E1, E2; 03 / Offer rules, rule 2 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-71 | P2 | Open question | [06b / UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file): 3 proposals (E1, E2, E3) | Confirm or replace the UC-08 proposals. | UC-08 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-72 | P2 | Open question | [06b / UC-10](./06b-use-cases-receptionist.md#uc-10-check-the-days-replies), A1: 1 proposal | Confirm or replace: the day view can show any date. | UC-10 A1 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-73 | P2 | Open question | [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-mark-who-attended), A1: 1 proposal | Confirm or replace: reception can change a mark until that week's report is sent. | UC-12 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-74 | P2 | Open question | [06b / UC-13](./06b-use-cases-receptionist.md#uc-13-add-a-patient-to-the-waitlist), E2: 1 proposal | Confirm or replace: the system shows the existing entry instead of adding a second one. | UC-13 E2 | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-80 | P2 | Pending decision | [13 / OI-32](./13-open-items-and-clarifications.md#oi-32-nfr-08-settles-where-patient-data-is-kept-while-constraint-6-still-asks) (raised by CF-04) | Settled by OI-32: the NFR-08 measure is conditional; the data-location question stays in TD-05. | NFR-08 | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-32; [decision-log.md, Q-32](./decision-log.md#q-32---oi-32)) |
| TD-83 | P2 | Pending decision | [13 / OI-36](./13-open-items-and-clarifications.md#oi-36-uc-03-ac-3-restates-a-formula-that-is-still-a-proposal) (raised by CF-12) | Settled by OI-36: UC-03 AC-3 follows the formula in 03 / Measures. | UC-03 AC-3 | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-36; [decision-log.md, Q-36](./decision-log.md#q-36---oi-36)) |
| TD-84 | P2 | Pending decision | [13 / OI-37](./13-open-items-and-clarifications.md#oi-37-the-weekly-report-needs-an-approved-whatsapp-template-that-no-dependency-covers) (raised by CF-13) | Settled by OI-37: the Meta approvals and Assumption 26 include the weekly report template. | UC-03; 02 / Dependencies | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-37; [decision-log.md, Q-37](./decision-log.md#q-37---oi-37)) |
| TD-85 | P2 | Pending decision | [13 / OI-38](./13-open-items-and-clarifications.md#oi-38-four-preconditions-rule-out-flows-that-their-use-cases-then-handle) (raised by CF-19) | Settled by OI-38: the preconditions of UC-04, UC-08, UC-13, and UC-17 no longer rule out their own flows. | UC-04; UC-08; UC-13; UC-17 | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-38; [decision-log.md, Q-38](./decision-log.md#q-38---oi-38)) |
| TD-86 | P2 | Pending decision | [13 / OI-39](./13-open-items-and-clarifications.md#oi-39-fourteen-alternate-and-exception-flows-have-no-acceptance-criterion) (raised by CF-20) | Settled by OI-39: fourteen flows have acceptance criteria. | UC-06; UC-07; UC-10; UC-14; UC-15; UC-16 | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-39; [decision-log.md, Q-39](./decision-log.md#q-39---oi-39)) |
| TD-87 | P2 | Pending decision | [14 / CF-27](#consistency-findings) (third-run discovery); [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle); [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-mark-who-attended) | Decided on 2026-10-07 by the skill (mechanical correction: the use case wins over the figure drawn from it, carrying OI-07 and OI-38), to apply in the next request: (1) Figure 1: add `Attended --> NoShow : receptionist corrects a mark` and `NoShow --> Attended : receptionist corrects a mark`; (2) the bullet on proposal edges: add "a corrected attendance mark (UC-12, A1)"; (3) UC-12 second precondition: "The appointment is Booked or Confirmed, or, for a corrected mark (A1), Attended or No-show."; (4) UC-12 BR-1: "Only Booked or Confirmed appointments can be marked. A mark set by mistake can be changed as in A1 (03 / Appointment lifecycle)."; (5) TD-73 Blocks: "UC-12 Preconditions, A1, BR-1, AC-3; 03 / Appointment lifecycle, Figure 1". | UC-12 Preconditions, BR-1, A1, AC-3; Figure 1; 14 / TD-73 | Recommendation: BRD author (not named yet, TD-79) | Decided - pending application |
| TD-75 | P3 | Open question | [04 / Release phases](./04-scope-and-personas.md#release-phases), phase-conflict marker; [13 / OI-33](./13-open-items-and-clarifications.md#oi-33-the-phase-question-leaves-out-subscription-billing) (raised by CF-06) | Settled by OI-33: the second reminder, per-doctor calendars, and subscription billing come with the paid launch; the other Should items come in Growth. | 04 / In Scope | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-33; [decision-log.md, Q-33](./decision-log.md#q-33---oi-33)) |
| TD-76 | P3 | Open question | [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations), Responsive Design | Which screen sizes must the dashboard support? | 11; step 4 mockups | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-77 | P3 | Open question | [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations), Language & Locale | Which date, time, and number formats do the dashboard and the messages use? | 11; step 4 mockups | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-78 | P3 | Open question | [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations): 2 proposals from the user's global defaults (Data Tables, Accessibility) | Confirm or replace the two proposals. | 11; step 4 mockups | Recommendation: BRD author (not named yet, TD-79) | Open |
| TD-82 | P3 | Pending decision | [13 / OI-35](./13-open-items-and-clarifications.md#oi-35-chunk-11-names-a-status-filter-that-no-use-case-has) (raised by CF-08) | Settled by OI-35: chunk 11 names only the filters that UC-10 states. | 11 / Filtration | Recommendation: BRD author (not named yet, TD-79) | Resolved ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log), OI-35; [decision-log.md, Q-35](./decision-log.md#q-35---oi-35)) |
| TD-88 | P3 | Pending decision | [14 / CF-28](#consistency-findings) (third-run discovery) | Decided on 2026-10-07 by the skill (mechanical correction), to apply in the next request: set TD-70 Blocks to "UC-07 E1, E2; UC-08 E2 (past date, through UC-08 BR-1); 03 / Offer rules, rule 2". | 14 / TD-70 | Recommendation: BRD author (not named yet, TD-79) | Decided - pending application |
| TD-89 | P3 | Pending decision | [14 / CF-29](#consistency-findings) (third-run discovery) | Decided on 2026-10-07 by the skill (mechanical correction: the P1 rule for points to settle before the build), to apply in the next request: set TD-59 and TD-63 to P1, move them into the P1 block, and update the P1 lists in the gate's Next action, step 3, and the handoff prompt. | 14 / TD-59, TD-63; 14 / Step 3 | Recommendation: BRD author (not named yet, TD-79) | Decided - pending application |
| TD-90 | P3 | Pending decision | [14 / CF-30](#consistency-findings) (third-run discovery) | Decided on 2026-10-07 by the skill (mechanical correction: the P1 rule), to apply in the next request: set TD-37 to P1 with Blocks "03 / Measures; UC-03 step 4 and AC-2", and move it into the P1 block. | 14 / TD-37 | Recommendation: BRD author (not named yet, TD-79) | Decided - pending application |
| TD-91 | P3 | Pending decision | [14 / CF-31](#consistency-findings) (third-run discovery) | Decided on 2026-10-07 by the skill (mechanical correction), to apply in the next request: TD-60 Blocks "Go-live; 04 / Release phases (Pilot); 02 / Assumption 24"; TD-62 Blocks "Go-live; 02 / Dependencies, Meta business verification and SMS sender name rows (TD-57, TD-58)". | 14 / TD-60, TD-62 | Recommendation: BRD author (not named yet, TD-79) | Decided - pending application |
| TD-92 | P3 | Pending decision | [14 / CF-32](#consistency-findings) (found after the third run) | Decided on 2026-10-07 by the skill (mechanical correction), to apply in the next request: add UC-07 (Business Objectives 1 and 2) and UC-11 (Business Objective 3) to the step 3 stress-test row and to item 3 of the handoff prompt. | 14 / Step 3 | Recommendation: BRD author (not named yet, TD-79) | Decided - pending application |
| TD-79 | P3 | Open question | [00 Cover](./00-cover-and-changelog.md), Author line | Who is the BRD author? | 00 cover; the Owner cell of every to-do row | Recommendation: product manager | Open |

---

## Step 2 - Run a consistency check across all BRD chunks

| | |
|---|---|
| **Status** | In progress |
| **Required inputs** | All BRD chunks 00-13 (and 05 / 06* diagrams once step 5 has run; chunk 14 itself, and 15-17 once they exist, for check C10) |
| **Expected output** | Every finding recorded below with its affected chunks and identifiers, impact, and a disposition; confirmed corrections applied to every affected chunk; a recheck run recorded |
| **Completion criteria** | The latest full/scoped check follows the final relevant content change, with request/run order and checked revision or change-then-check evidence. Dates alone do not prove same-day order. Every finding has a disposition; pending TD/OI keeps step 1 incomplete. |
| **Evidence** | Run 1 (full) and Runs 2 and 3 (scoped) on 2026-10-07, each by a cleared-context sub-agent (general-purpose) dispatched by Claude Code with the brd-unifier skill. Run 3 checked revision b17b459b1c71, taken after the last content change of this request. 32 findings, each with a disposition: CF-05 is deferred to TD-09, and CF-27 to CF-32 are Decided - pending application (TD-87 to TD-92). The check of the first build leaves this step In progress (delivery-chunks.md, Step 2). |

**Checks performed:** C1 conflicting requirements, C2 terminology, C3 scope, C4 duplicated requirements, C5 missing requirements, C6 broken references, C7 use cases vs acceptance criteria, C8 derived views (Use Case Summary, matrix), C9 diagrams vs narrative (after step 5), C10 delivery chunks vs body (chunk 14 at every write; 15-17 once they exist).

### Check runs

**Checked content and order:** Request: the first build of this BRD ("Write a BRD from this pre-BRD"), one request. Run 1 came after the acceptance loop of OI-01 to OI-31 and checked revision f34e3273537e (a hash of chunks 00-13, the master index, and the decision log). The Run 1 corrections and OI-32 to OI-39 were then applied. Run 2 checked revision d97070666abe, taken after those changes. The Run 2 corrections and the Changes Log row were then applied. Run 3 checked revision b17b459b1c71 (chunks 00-14, the master index, and the decision log), taken after them. No content change followed Run 3. Checker for every run: a cleared-context sub-agent (general-purpose), dispatched by Claude Code with the brd-unifier skill on 2026-10-07. Start times in UTC on 2026-10-08: Run 1 01:50, Run 2 02:37, Run 3 03:09.

| Run | Date | Trigger | Scope | Findings | Still open after run |
|-----|------|---------|-------|----------|----------------------|
| 1 | 2026-10-07 | Initial generation | 00-13 in full, the master index, and decision-log.md | 20 (CF-01 to CF-20) | 1: CF-05, deferred to TD-09. The 8 open items it raised (OI-32 to OI-39) were decided and applied the same day. |
| 2 | 2026-10-07 | The Run 1 corrections and OI-32 to OI-39 | The changed chunks 02, 03, 04, 05, 06a, 06b, 06c, 08, 09, 10, 11, 13, and decision-log.md; their dependents 00, 01, 07, 12, and the master; C10 on chunk 14 | 6 (CF-21 to CF-26) | 0 |
| 3 | 2026-10-07 | The Run 2 corrections and the Changes Log row | The Run 2 corrections in 03, 06b, and 06c and their dependents; 00 (Changes Log); C10 on chunk 14 in full | 5 (CF-27 to CF-31), and CF-32 found after the run | 6: CF-27 to CF-32, Decided - pending application (TD-87 to TD-92) |

### Consistency findings

| ID | Check | Affected chunks and identifiers | Finding | Impact | Recommended correction or decision needed | Disposition | Rechecked |
|----|-------|---------------------------------|---------|--------|-------------------------------------------|-------------|-----------|
| CF-01 | C1 | [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules); [03 / Offer rules](./03-definitions-and-domain-concepts.md#offer-rules), rule 8; [06b / UC-10 E2, UC-13 A1](./06b-use-cases-receptionist.md); [06c / UC-15 Business Rules and E2, UC-17 A2](./06c-use-cases-patient.md) | Proposal markers still asked the owner to confirm behaviour that the applied OI-14, OI-23, and OI-30 had settled | The to-do would ask settled decisions again | Recommendation: carry the three decisions; the unsettled parts of rule 8 and UC-15 E2 stay proposals | Corrected (03, 06b, 06c; 2026-10-07), carrying OI-14, OI-23, OI-30 | Run 2 |
| CF-02 | C1 | [06c / UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder), Business Rules bullet 1 | "Each appointment gets one reminder" contradicted OI-10 (no reminder for a late waitlist booking), OI-07 (a moved visit gets a new reminder), and A3 (a second reminder) | Testers would fail valid behaviour | Recommendation: one channel per reminder; which appointments get one follows 03 / Channel rules | Corrected (06c UC-14 BR-1; 2026-10-07), carrying OI-10 and OI-07 | Run 2 |
| CF-03 | C1 | [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle), Figure 1 and its bullets | Figure 1 edges that come from proposals read as settled | A replaced proposal would leave Figure 1 wrong | Recommendation: a bullet saying these edges stand or fall with their proposals | Corrected (03 / Appointment lifecycle; 2026-10-07), carrying OI-07 | Run 2 |
| CF-04 | C1 | [10 / NFR-08](./10-nfrs.md#non-functional-requirements); 02 / Constraints 6 and 15 | NFR-08 stated that patient data is kept in Egypt while Constraint 6 still asks | The SDD would treat an open choice as a requirement | Decision needed: see OI-32 | Open item raised: OI-32 / TD-80 (now Accepted - applied) | Run 2 |
| CF-05 | C1 | [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 9 against the rule 3 marker; [06b / UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-consent) step 4 proposal | Rule 9 lists the patient's WhatsApp message as written proof while rule 3 asks counsel whether a WhatsApp opt-in counts as written consent | If counsel says no, some proof is invalid | Counsel's answer settles all three places | Deferred for clarification: TD-09 | Run 2 |
| CF-06 | C1 | [04 / Release phases](./04-scope-and-personas.md#release-phases), second marker; 04 / In Scope; 03 / Subscription and message allowance | The phase question left out subscription billing, which has the same source conflict | The billing phase was decided silently | Decision needed: see OI-33 | Open item raised: OI-33 / TD-75 (now Accepted - applied) | Run 2 |
| CF-07 | C1 | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors); UC-02, UC-04, UC-05 Primary Actor | Chunk 04 stated owner rights that three actor proposals still asked about | A "replace" answer would break 04, 05, and 07 | Decision needed: see OI-34 | Open item raised: OI-34 / TD-81 (now Accepted - applied) | Run 2 |
| CF-08 | C1 | [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations), Filtration; UC-10 | Chunk 11 named a status filter that UC-10 does not have | A filter no use case states could be built | Decision needed: see OI-35 | Open item raised: OI-35 / TD-82 (now Accepted - applied) | Run 2 |
| CF-09 | C2 | [06b / UC-10](./06b-use-cases-receptionist.md#uc-10-check-the-days-replies) step 2, AC-1, BR-2; [09](./09-reporting-and-analytics.md#reporting--analytics) / Day view; [05](./05-user-journeys-overview.md) / Receptionist Journey | The reply-status values of OI-23 were not carried | The day view would be built with three values | Recommendation: carry OI-23 | Corrected (06b, 09, 05; 2026-10-07), carrying OI-23 | Run 2 |
| CF-10 | C2 | [02 / Glossary](./02-glossary-assumptions-facts.md#glossary), Opt-out | The definition missed opt-outs given to reception and the sender scope | Readers would miss OI-15 and OI-16 | Recommendation: carry OI-15 and OI-16 | Corrected (02 / Glossary; 2026-10-07), carrying OI-15 and OI-16 | Run 2 |
| CF-11 | C2 | [06c / UC-15](./06c-use-cases-patient.md#uc-15-confirm-or-cancel-through-the-sms-link) Supporting Actors; [08](./08-integrations.md#integrations) row, Figure 3 and its Summary | One partner had several names | One thing, several names | Recommendation: the Glossary term "SMS aggregator" | Corrected (06c, 08; 2026-10-07); the Glossary wins | Run 2 |
| CF-12 | C4 | [06a / UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) AC-3; 03 / Measures | AC-3 restated a formula that is still a proposal | AC-3 would keep a replaced formula | Decision needed: see OI-36 | Open item raised: OI-36 / TD-83 (now Accepted - applied) | Run 2 |
| CF-13 | C5 | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), Meta row; 02 / Assumption 26 and Constraint 19; UC-03 | No dependency covered the weekly report template | UC-03 could not send at go-live | Decision needed: see OI-37 | Open item raised: OI-37 / TD-84 (now Accepted - applied) | Run 2 |
| CF-14 | C5 | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) 2 and 5; 09 | No report shows the delivery rate, the reply rate, or the pilot clinics together | Two objectives cannot be checked in the product | Same problem as OI-04 | No change (product manager, OI-04 rejected on 2026-10-07) | Run 2 |
| CF-15 | C5 | [06a / UC-01](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic-account) step 1 and UC-06 E3; 05 / Clinic Owner Journey; 04 / Out of Scope | Founders act in flows but are no persona | Onboarding's first step has no actor | Same problem as OI-03 | No change (product manager, OI-03 rejected on 2026-10-07) | Run 2 |
| CF-16 | C5 | [03 / Subscription and message allowance](./03-definitions-and-domain-concepts.md#subscription-and-message-allowance), plan-change rules; UC-01 A1 | No use case changes doctors or settings after setup | The plan-change rules cannot trigger | Same problem as OI-21 | No change (product manager, OI-21 rejected on 2026-10-07) | Run 2 |
| CF-17 | C6 | [decision-log.md](./decision-log.md) Q-06, Q-10, Q-31, Rule home | Three Rule home lines named a wrong or incomplete place | Readers land on the wrong section | Recommendation: correct the three lines | Corrected (decision-log.md; 2026-10-07); cross-reference | Run 2 |
| CF-18 | C7 | [06b / UC-13](./06b-use-cases-receptionist.md#uc-13-add-a-patient-to-the-waitlist) Acceptance Criteria; 13 / Resolution Log, OI-14 | The UC-13 criterion of OI-14 had not been applied | The end of a waitlist entry had no test | Recommendation: carry OI-14 | Corrected (06b UC-13; 13; 2026-10-07), carrying OI-14 | Run 2 |
| CF-19 | C7 | UC-04, UC-08, UC-13, and UC-17 Preconditions | Four preconditions ruled out flows that their use cases handle | Four criteria could not be reached | Decision needed: see OI-38 | Open item raised: OI-38 / TD-85 (now Accepted - applied) | Run 2 |
| CF-20 | C7 | UC-06 A3; UC-07 E4; UC-10 A1 to A3 and E2; UC-14 A2, A3, E2, E3, E6; UC-15 E3; UC-16 E1, E3 | Fourteen flows had no acceptance criterion | Untested paths | Decision needed: see OI-39 | Open item raised: OI-39 / TD-86 (now Accepted - applied) | Run 2 |
| CF-21 | C7 | [06b / UC-10](./06b-use-cases-receptionist.md#uc-10-check-the-days-replies) step 4 and criteria 7 and 12 | "Reminder not sent yet" also fit appointments with no consent, so criteria 7 and 12 expected opposite results | Conflicting test cases | Recommendation: limit "reminder not sent yet" to appointments with consent and no opt-out | Corrected (06b UC-10; 2026-10-07), carrying OI-23 | Run 3 |
| CF-22 | C1 | [06b / UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file) Preconditions and E2 | The precondition sends a row with any missing detail to E2, which named only three errors | E2 too narrow | Recommendation: widen the E2 condition | Corrected (06b UC-08 E2; 2026-10-07), carrying OI-38 | Run 3 |
| CF-23 | C7 | [06b / UC-13](./06b-use-cases-receptionist.md#uc-13-add-a-patient-to-the-waitlist) last criterion; [06c / UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-whatsapp-reminder) E6 criteria | Criteria with no flow or rule label | Coverage counts would miss them | Recommendation: add the rule 12 and E6 labels | Corrected (06b, 06c; 2026-10-07) | Run 3 |
| CF-24 | C8 | [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle), the bullet on proposal edges | The list missed UC-15 E3 and the Cancelled end state | The list read as complete | Recommendation: complete the list | Corrected (03; 2026-10-07), carrying OI-07 | Run 3 |
| CF-25 | C10 | 14 / TD-21, TD-25, TD-26, TD-27, TD-31, TD-33, TD-72, TD-74, TD-75 | Rows still asked questions that CF-01, OI-33, and OI-34 settled | Settled points would be asked again | Recommendation: narrow the rows; TD-75 Resolved; TD-31 to P2 | Corrected (14; 2026-10-07) | Run 3 |
| CF-26 | C10 | 14 / TD-20, TD-21, TD-57, TD-65 | Rows missed the weekly report template and two new dependents | The register was incomplete | Recommendation: widen the Decision and Blocks cells | Corrected (14; 2026-10-07) | Run 3 |
| CF-27 | C1 | [03 / Appointment lifecycle](./03-definitions-and-domain-concepts.md#appointment-lifecycle), Figure 1 and the bullet on proposal edges; [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-mark-who-attended) Preconditions, BR-1, A1, AC-3; 14 / TD-73 | The UC-12 A1 proposal changes an attendance mark, but Figure 1 has no edge between Attended and No-show, the bullet does not list it, and the UC-12 precondition and BR-1 exclude a marked appointment | A1 and AC-3 cannot be reached | Recommendation: add the two correction edges to Figure 1, list the corrected mark in the bullet, widen the UC-12 precondition and BR-1, and widen TD-73 Blocks (exact text in TD-87) | Decided - pending application: TD-87 | - |
| CF-28 | C10 | 14 / TD-70 Blocks; [06b / UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file) E2 and BR-1 | TD-70 does not name UC-08 E2, which follows the UC-07 past-date proposal through UC-08 BR-1 | A replaced proposal would leave UC-08 E2 unlinked | Recommendation: widen TD-70 Blocks | Decided - pending application: TD-88 | - |
| CF-29 | C10 | 14 / TD-59, TD-63; [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), Needed before | Two dependencies needed before a build are P2, while TD-10, worded the same way, is P1 | They would be decided too late | Recommendation: set TD-59 and TD-63 to P1 and update the P1 lists | Decided - pending application: TD-89 | - |
| CF-30 | C10 | 14 / TD-37; [06a / UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) step 4 and AC-2; 03 / Measures | The late-cancellation question blocks UC-03 AC-2 but is P2 | A Main Flow criterion waits in P2 | Recommendation: set TD-37 to P1 with Blocks "03 / Measures; UC-03 step 4 and AC-2" | Decided - pending application: TD-90 | - |
| CF-31 | C10 | 14 / TD-60 and TD-62, Blocks | The two Blocks cells name only a milestone and other rows | The link to the BRD runs only through other rows | Recommendation: name the BRD sections in both cells | Decided - pending application: TD-91 | - |
| CF-32 | C10 | 14 / Step 3, the stress-test row and item 3 of the handoff prompt | The list leaves out UC-07 (Business Objectives 1 and 2) and UC-11 (Business Objective 3) | Two use cases that carry objectives miss the stress test | Recommendation: add UC-07 and UC-11 to both | Decided - pending application: TD-92 | - |

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
| Open questions and pending decisions | TD-01 to TD-30, TD-32, TD-33 (P1), then TD-31 and TD-34 to TD-74 (P2), then TD-76 to TD-79 (P3) |
| Unresolved consistency findings | CF-05 (deferred to TD-09); CF-27 to CF-32 (decided, to apply at the start of the next request: TD-87 to TD-92) |
| Requirements to stress-test even though nothing is flagged | Use cases that carry a Business Objective: UC-14 and UC-15 (Objectives 1, 2, and 5), UC-13 and UC-16 (Objective 3), UC-03 (Objective 4), UC-10 (Objectives 5 and 6), UC-12 (Objective 1); criteria with numbers: UC-01 E1 and AC-5 (5 doctors); NFR measures: NFR-01 (98% delivered), NFR-04 (40 clinics), NFR-07 (the 72-hour deadline of 02 / Constraint 5) |

**Ready-to-use handoff prompt** (recommended; run it yourself with `/grill-me`):

```text
/grill-me Finalise the requirements of the Clinic Reminders BRD v1.0 in ./brd-clinic-reminders/.
Read clinic-reminders-brd-master.md first, then 14-todo.md.
Grill me in this order:
1. Open questions and pending decisions: TD-01 to TD-30, TD-32, TD-33 (P1), starting with counsel's answers TD-04 to TD-10 (02 / Constraints 1, 6, 10, 13; 03 / Offer rules; 03 / Consent rules) and the sender model TD-11 (08, WhatsApp row); then TD-31 and TD-34 to TD-74 (P2); then TD-76 to TD-79 (P3).
2. Unresolved consistency findings: CF-05 (03 / Consent rules, rules 3 and 9; deferred to TD-09); CF-27 to CF-32 (decided, to apply at the start of the next request: TD-87 to TD-92)
3. Requirements to stress-test: UC-14, UC-15, UC-16, and UC-03 against Business Objectives 1 to 4 (01); UC-01 E1 (5 doctors); NFR-01, NFR-04, NFR-07 (10).
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
| **Required inputs** | Finalised use cases (06*), the matrix ([07](./07-users-use-cases-matrix.md)), UI/UX Expectations ([11](./11-summary-and-uiux.md)), decisions from steps 1-3, and the project's global UI/UX constitution when one exists (`ui-ux-global-constitution.md`: its token, responsive, mockups and prototypes, and Figma prototypes sections, by name). No UI/UX constitution found; chunk 11 used. |
| **Expected output** | A playable, responsive prototype covering the table below, reviewed against the criteria, with links in each UC UI/UX or owning no-UC report/requirement section |
| **Completion criteria** | Every row is `Approved`; the product manager confirms the review and a dated play-through; the Figma links are in the UC UI/UX or owning no-UC report/requirement section |
| **Evidence** | None yet. Play-through: date and result once confirmed. |

**Approval impact:** No mockup exists yet, so no approval is affected.

**Standard to follow.** When the project has a constitution, the generating tool or agent reads it before producing any frame; otherwise chunk 11 is the visual standard and the rules below still apply. For Figma, the constitution's Figma prototypes section applies in full; for another tool, its responsive and mockups and prototypes sections apply and the Figma prototype rules are applied in their nearest equivalent. Source and confirmed project rules govern, with conflicts settled by the owner. Deliver confirmed breakpoints only; unstated breakpoints are proposals. P1 rows: every Main Flow playable from the named start frame with no dead ends, every actor-facing control wired. P2 rows: connected to neighbouring frames. States are variants, not duplicate frames. A no-UC screen names its MK and owning report/requirement section.

**Ready-to-use mockup brief** (recommended; run it yourself in the mockup tool or agent):

```text
Use the UI/UX Expectations in 11-summary-and-uiux.md as the visual baseline. The dashboard is in Arabic, right to left.
Use the Clinic Reminders BRD v1.0 in ./brd-clinic-reminders/ for the workflows, fields, permissions and business rules. Read clinic-reminders-brd-master.md first, then 14-todo.md.
Create a playable Figma prototype covering every row of the Mockup coverage table below, for clinic owners and receptionists (dashboard) and for patients (WhatsApp messages and the SMS link page).
P1 rows: one named start frame, every Main Flow playable with no dead ends and actor-facing controls wired. Deliver only source/owner-confirmed breakpoints from chunk 11.
P2 rows: connected to neighbouring frames, at the source/owner-confirmed breakpoints from chunk 11.
States are component variants. Variables and text styles map to the chunk 11 colors. Label simulated data and demo actions.
Name the UC-NN on each frame, or the MK-NN and owning report/requirement section for a no-UC screen. List unstated behaviour for a decision; do not add it.
Return the share link (view permission, opening on the start frame) and the list of frames per breakpoint.
```

### Mockup coverage

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| MK-01 | Clinic setup | UC-01 | UC-01 BR-1 to BR-4; 11 / Primary Color; TD-24; TD-11 | Default, doctor limit (E1), empty fee (E2), report declined (A1) | P2 | N | None yet (screen sizes open: TD-76) | Pending gate; blocked by TD-24 | - | - |
| MK-02 | Receptionist logins | UC-02 | UC-02 BR-1, BR-2; 07 matrix; TD-25 | Default, empty list, duplicate number (E1), remove confirmation (A1) | P2 | N | None yet (TD-76) | Pending gate; blocked by TD-25 | - | - |
| MK-03 | Weekly no-show report message | UC-03 | 03 / Measures; UC-03 BR-1 to BR-3; TD-18; TD-23; TD-37; TD-40; TD-41 | Normal week, no appointments (A1), unmarked appointments (A2) | P1 | N | Not applicable (WhatsApp message) | Pending gate; blocked by TD-23 | - | - |
| MK-04 | Consent records and export | UC-04, UC-09 | 03 / Consent rules; UC-04 BR-1, BR-2; TD-26; TD-09 | Default, no records (E1), opted-out patient, guardian consent | P2 | N | None yet (TD-76) | Pending gate; blocked by TD-26 | - | - |
| MK-05 | Reminder settings | UC-05 | UC-05 BR-1, BR-2; TD-19; TD-27 | Default 24 hours, changed time | P2 | N | None yet (TD-76) | Pending gate; blocked by TD-19 | - | - |
| MK-06 | Subscription payment | UC-06 | UC-06 BR-1, BR-2; 03 / Subscription and message allowance; TD-28; TD-43 to TD-46; TD-67 | Due, first payment (A3), annual (A1), top-up (A2), refused (E1), waiting for confirmation (E3) | P2 | N | None yet (TD-76) | Pending gate; blocked by TD-28 | - | - |
| MK-07 | New appointment, with the consent step | UC-07, UC-09 | 03 / What an appointment holds; UC-07 BR-1 to BR-3; UC-09 BR-1 to BR-3; TD-20; TD-29; TD-09; TD-70 | Default, returning patient, shared number, under 15 (A1), slot taken (E1), past date (E2), no consent (E3) | P1 | N | None yet (TD-76) | Pending gate; blocked by TD-20 | - | - |
| MK-08 | Appointment import | UC-08 | UC-08 BR-1 to BR-3; TD-49; TD-71 | Preview, consent in file (A1), no consent (E1), row errors (E2), duplicates (E3) | P1 | N | None yet (TD-76) | Pending gate; blocked by TD-71 | - | - |
| MK-09 | Day view, call list, and attendance marks | UC-10, UC-12 | UC-10 BR-1 to BR-3; UC-12 BR-1, BR-2; 03 / Appointment lifecycle; TD-21; TD-72; TD-73; TD-41 | Loading, empty day, call list, not reached (E1), no consent (E2), typed reply (E3), reminder not sent yet | P1 | N | None yet (TD-76) | Pending gate; blocked by TD-21 | - | - |
| MK-10 | Change or cancel an appointment | UC-11 | UC-11 BR-1, BR-2; TD-30 | Cancel confirmation, phone confirmation (A1), move (A2), past visit (E1) | P2 | N | None yet (TD-76) | Pending gate; blocked by TD-30 | - | - |
| MK-11 | Waitlist | UC-13 | 03 / Offer rules; UC-13 BR-1, BR-2; TD-14; TD-22; TD-74 | Default, empty, no consent (E1), already waitlisted (E2), removal (A1) | P2 | N | None yet (TD-76) | Pending gate; blocked by TD-14 | - | - |
| MK-12 | WhatsApp reminder message | UC-14 | 03 / Message content; 03 / Reply rules; UC-14 BR-1 to BR-3; TD-06; TD-21; TD-11 | Arabic, English, confirmed, cancelled, stale tap (E6) | P1 | N | Not applicable (WhatsApp message) | Pending gate; blocked by TD-06 | - | - |
| MK-13 | SMS and the confirm-or-cancel link page | UC-15, UC-17 | UC-15 BR-1 to BR-4; NFR-13; TD-12; TD-31; TD-33 | Default, confirmed, cancelled, visit time passed (E2), already answered (E3), stop messages (A2) | P1 | N | None yet (TD-76) | Pending gate; blocked by TD-31 | - | - |
| MK-14 | Waitlist offer message | UC-16 | 03 / Offer rules; UC-16 BR-1, BR-2; TD-15; TD-16; TD-32; TD-03 | Offer, accepted, slot filled (E1), offer closed (E2) | P1 | N | Not applicable (WhatsApp message) | Pending gate; blocked by TD-15 | - | - |
| MK-15 | Opt-out confirmation message | UC-17 | 03 / Consent rules; UC-17 BR-1 to BR-3; TD-17; TD-33; TD-39 | Opt-out by reply, opt-out from the link page (A1) | P2 | N | Not applicable (WhatsApp message) | Pending gate; blocked by TD-17 | - | - |
| MK-16 | Staff action log (no use case) | None; owning section [09 / Staff action log](./09-reporting-and-analytics.md#reporting--analytics) | 03 / Staff action log; 02 / Constraint 7; TD-42 | Default, empty | P2 | N | None yet (TD-76) | Pending gate; blocked by TD-42 | - | - |

**Expected coverage:** every actor-facing UC has a screen; every observable flow/state appears; roles follow the matrix and standards follow chunk 11. P1 rows are fully interactive, P2 rows connected. All rows use source/owner-confirmed breakpoints, not a priority-implied minimum.

**Review criteria**

- [ ] Each frame names its UC, or its MK and owning report/requirement section when no UC exists.
- [ ] Every flow can be walked end to end without a missing screen, and played in play mode from the named start frame with no dead ends.
- [ ] Every actor-facing control on a P1 screen is wired (navigation, overlays, drawers, dialogs, tabs, filters, form validation and error paths, destructive-action confirmation).
- [ ] Loading, empty, and error states are present where the use cases call for them, as variants rather than duplicate frames.
- [ ] Frames exist for every source/owner-confirmed breakpoint in chunk 11; no unstated tablet minimum was added.
- [ ] What each role sees matches the Users & Use Cases Matrix.
- [ ] Global UI/UX standards in chunk 11 hold on every screen.
- [ ] Variables and text styles map to the constitution's tokens (or, with no constitution, to the chunk 11 colors); no raw hex in components.
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

One overview would pass about 30 lines (17 use cases, 3 personas, 3 external parties), so there is one diagram per persona, in the chunk 05 order.

| Diagram | Actors | Use cases | Relationships documented in the narratives | Status | Figure |
|---------|--------|-----------|--------------------------------------------|--------|--------|
| Clinic Owner | Clinic Owner; External: WhatsApp Business Platform, SMS aggregator, Local payment gateway | UC-01 to UC-06 | UC-01 includes UC-02 (UC-01 step 9) | Pending gate | - |
| Receptionist | Receptionist | UC-07 to UC-13 | UC-07 includes UC-09 (UC-07 step 7); UC-10 includes UC-11 (UC-10 step 6); UC-12 includes UC-10 (UC-12 step 1) | Pending gate | - |
| Patient | Patient; External: WhatsApp Business Platform, SMS aggregator | UC-14 to UC-17 | UC-15 extends UC-14 (UC-14 E1); UC-17 extends UC-14 (UC-14 E4); UC-17 extends UC-15 (UC-15 A2) | Pending gate | - |

### Use-case flowcharts (chunks 06*)

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-clinic-owner.md) | 10 | A1, A2, E1, E2 | Required | Pending gate | - |
| UC-02 | [06a](./06a-use-cases-clinic-owner.md) | 7 | A1, E1 | Required | Pending gate | - |
| UC-03 | [06a](./06a-use-cases-clinic-owner.md) | 5 | A1, A2, E1 | Required | Pending gate | - |
| UC-04 | [06a](./06a-use-cases-clinic-owner.md) | 5 | E1 | Required | Pending gate | - |
| UC-05 | [06a](./06a-use-cases-clinic-owner.md) | 5 | None | Skip - linear: no alternate flow, no exception flow, and no rule that changes the path | Skipped | - |
| UC-06 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1, A2, A3, E1, E2, E3 | Required | Pending gate | - |
| UC-07 | [06b](./06b-use-cases-receptionist.md) | 9 | A1, E1, E2, E3, E4 | Required | Pending gate | - |
| UC-08 | [06b](./06b-use-cases-receptionist.md) | 7 | A1, E1, E2, E3 | Required | Pending gate | - |
| UC-09 | [06b](./06b-use-cases-receptionist.md) | 6 | A1, A2, A3, E1 | Required | Pending gate | - |
| UC-10 | [06b](./06b-use-cases-receptionist.md) | 7 | A1, A2, A3, E1, E2, E3 | Required | Pending gate | - |
| UC-11 | [06b](./06b-use-cases-receptionist.md) | 7 | A1, A2, E1 | Required | Pending gate | - |
| UC-12 | [06b](./06b-use-cases-receptionist.md) | 5 | A1, E1 | Required | Pending gate | - |
| UC-13 | [06b](./06b-use-cases-receptionist.md) | 6 | A1, E1, E2 | Required | Pending gate | - |
| UC-14 | [06c](./06c-use-cases-patient.md) | 6 | A1, A2, A3, E1, E2, E3, E4, E5, E6 | Required | Pending gate | - |
| UC-15 | [06c](./06c-use-cases-patient.md) | 6 | A1, A2, E1, E2, E3 | Required | Pending gate | - |
| UC-16 | [06c](./06c-use-cases-patient.md) | 6 | A1, E1, E2, E3, E4 | Required | Pending gate | - |
| UC-17 | [06c](./06c-use-cases-patient.md) | 5 | A1, A2, A3 | Required | Pending gate | - |

**Optional, later:** mirror the diagrams to a Miro board for collaboration or presentation. Ask brd-unifier for it explicitly; the inline Mermaid stays authoritative.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->
