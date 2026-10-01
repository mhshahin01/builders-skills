<!--
CHUNK: 14
TITLE: Product Manager To-Do
PROJECT: Clinic Reminders
VERSION: 1.1
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

**Last updated:** 2026-10-01 | **BRD version:** 1.1 | **Steps complete:** 0 of 5

**Status values:** `Not started` / `In progress` / `Blocked` (by what) / `Pending gate` (steps 4 and 5, until steps 1-3 are complete; the two then run in parallel) / `Complete` (evidence mandatory). A `Complete` step goes back to `In progress` when its inputs change.

---

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | In progress | None yet. The register below has 71 open rows (2026-10-01). | Step 2 |
| 2 | Run a consistency check across all BRD chunks | In progress | Runs 1 to 5 on 2026-10-01, each by a cleared-context checker: CF-01 to CF-52 found, every one dispositioned. The Run 5 dispositions changed chunks 03, 06b, 06c, 08, and 13 after the last run, so Run 6 is due. | Step 3 |
| 3 | Finalise requirements with the grill-me skill | Not started | None yet. Recommended, not executed. | Steps 4 and 5 |
| 4 | Generate mockups in Figma | Pending gate | None yet | The delivery gate: chunks 15, 16, 17 (with step 5) |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Pending gate | None yet | The delivery gate: chunks 15, 16, 17 (with step 4) |

## Delivery gate

> Chunks 15, 16, and 17 are **locked** until every row below says `Met`. `Deferred` items do not count as closed. There is no override.

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete: every to-do item `Resolved`; no open or deferred item in chunk 13; no clarification marker left in chunks 00-12 | Not met | TD-01 to TD-71 are Open. Chunks 00-12 hold 119 clarification markers: 45 open questions and 74 proposals to confirm (47 distinct proposals, some repeated in acceptance criteria). Chunk 13: no open or deferred item (OI-01 to OI-52 accepted and applied). |
| G2 | Step 2 complete: check rerun after the last BRD change; every finding has a disposition and none is still waiting on a decision | Not met | Run 6 is due. The Run 5 dispositions (CF-48, CF-50 to CF-52, OI-52) changed chunks 03, 06b, 06c, 08, and 13 after the last check run. Every finding, CF-01 to CF-52, has a disposition, and none waits on a decision. |
| G3 | Step 3 complete: grill-me session confirmed; decisions applied | Not met | The session has not taken place. |
| G4 | Step 4 complete: every mockup approved; review and play-through confirmed; Figma links in the use cases | Not met | MK-01 to MK-16 not started (step 4 waits for G1 to G3). |
| G5 | Step 5 complete: use-case diagrams and flowcharts added; consistency check rerun | Not met | Three use-case diagrams and 19 flowcharts pending gate (step 5 waits for G1 to G3). |

**Gate:** Shut | **Next action:** Decide the P1 items TD-01 to TD-21 (counsel answers first: TD-03 to TD-07), then run /grill-me with the prompt in step 3. Rerun the consistency check (Run 6) after applying the decisions.

## Downstream outputs

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
| **Completion criteria** | Every row is `Resolved`, each pointing at where the decision was applied. No open or deferred item is left in chunk 13. No clarification marker is left in chunks 00-12. A `Deferred` row stays visible and keeps this step, and the delivery gate, open. |
| **Evidence** | None yet |

### Open items register

All 52 review items in chunk 13 are accepted and applied, so none appears here. The rows come from three sources: the inline markers in chunks 00-12, the unconfirmed assumptions and dependencies in chunk 02, and the chunk 13 reviewer notes that ask for a decision. Proposals (`[NEEDS CLARIFICATION: proposed ...; confirm or replace]`) are grouped per use case or section. The decision needed is to confirm or replace each one listed.

| ID | Priority | Kind | Source (chunk / identifier) | Decision or clarification needed | Blocks | Owner | Status |
|----|----------|------|-----------------------------|----------------------------------|--------|-------|--------|
| TD-01 | P1 | Open question | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) (after the table) | Does a low-cost validation gate (2026-10-01 to 2026-11-30) run before the build starts (pre-BRD OI-01)? | BO-01 to BO-09 dates; the start of the build | Recommendation: Clinic Reminders founding team | Open |
| TD-02 | P1 | Open question | [02 / Assumption 1](./02-glossary-assumptions-facts.md#assumptions--constraints) | What share of target clinics book timed slots, and does a clinic qualify only if it does (pre-BRD OI-03)? | UC-11, UC-15; BO-07, BO-09; 04 Market | Recommendation: Clinic Reminders founding team | Open |
| TD-03 | P1 | Open question | [02 / Constraint 6](./02-glossary-assumptions-facts.md#assumptions--constraints) | Does the PDPC treat appointment or specialty details as health data, does a WhatsApp opt-in count as written consent, and are slot offers electronic marketing? | UC-09 step 5; UC-15; NFR-07 | Recommendation: Clinic Reminders founding team | Open |
| TD-04 | P1 | Open question | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) (PDPC licence and registered DPO); 02 / Assumption 4 | Counsel to confirm the licence type, record counting, fee tier, whether each clinic needs its own licence, whether the portal is live, and whether the licence must be granted by 2027-01-15. | BO-04; UC-07 and UC-08 Preconditions; the pilot start | Recommendation: Clinic Reminders founding team | Open |
| TD-05 | P1 | Open question | [02 / Constraint 7](./02-glossary-assumptions-facts.md#assumptions--constraints) | Do the Code of Medical Ethics or Ministry of Health rules restrict a third party messaging patients for a clinic? | UC-03, UC-13 to UC-16 (every patient message) | Recommendation: Clinic Reminders founding team | Open |
| TD-06 | P1 | Open question | [10 / NFR-05](./10-nfrs.md#non-functional-requirements) | Is patient data kept in Egypt or abroad, and is messaging through WhatsApp (Meta) a transfer abroad that needs its own licence? | NFR-05; 08 / WhatsApp (Meta) | Recommendation: Clinic Reminders founding team | Open |
| TD-07 | P1 | Open question | [06b / UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-messaging-consent) Business Rules | Counsel to supply the consent wording in Arabic and English, and the service terms. | UC-09 step 3; UC-01 step 8; BO-04 | Recommendation: Clinic Reminders founding team | Open |
| TD-08 | P1 | Open question | [06c / UC-15](./06c-use-cases-patient.md#uc-15-accept-a-slot-offer) Business Rules | Are slot offers automatic in the MVP, or manual assist for the pilot (pre-BRD OI-11)? | UC-15 step 1; UC-11; BO-09 | Recommendation: Clinic Reminders founding team | Open |
| TD-09 | P1 | Open question | [03 / Waitlist and slot offers](./03-definitions-and-domain-concepts.md#rules) Rules | Do offers go to all matching patients at once or a few at a time, and how long does each offer stay open? | UC-15 step 1, A2; UC-15 AC-1: offer goes to waiting patients | Recommendation: Clinic Reminders founding team | Open |
| TD-10 | P1 | Open question | [06a / UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) step 5 | Is the dashboard view of the weekly report in the MVP (pre-BRD OI-12)? | UC-03 steps 5 and 6, E1; UC-03 AC-4: report in the dashboard; BO-13 read rule | Recommendation: Clinic Reminders founding team | Open |
| TD-11 | P1 | Open question | [03 / Reminder, Channel order](./03-definitions-and-domain-concepts.md#channel-order) | How long after sending does the system wait for WhatsApp delivery before it sends the SMS? | UC-14 Trigger; UC-14 AC-1: one SMS with a link; NFR-03 | Recommendation: Clinic Reminders founding team | Open |
| TD-12 | P1 | Open question | [01 / BO-06](./01-executive-summary-and-context.md#business-objectives) | Is the no-show reduction measured against a four-week baseline or against a concurrent control arm (pre-BRD OI-07)? | BO-06, BO-07; UC-13, UC-14 (a control arm withholds reminders) | Recommendation: Clinic Reminders founding team | Open |
| TD-13 | P1 | Open question | [06a / UC-04](./06a-use-cases-clinic-owner.md#uc-04-change-reminder-timing) Business Rules | Which reminder times may the owner choose, and when does the visit-day reminder go? | UC-04 steps 3 and 4, E1; UC-04 AC-3: time out of range | Recommendation: Clinic Reminders founding team | Open |
| TD-14 | P1 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) Business Rules | Do prices include VAT, and must each payment produce an electronic tax invoice, issued by the product or the accountant? | UC-06 step 6 | Recommendation: Clinic Reminders founding team | Open |
| TD-15 | P1 | Open question | [03 / Reminder, Content rules](./03-definitions-and-domain-concepts.md#content-rules); 03 / Waitlist and slot offers, Rules; 03 / Weekly no-show report measures | Confirm or replace 4 proposals: message language; matching rule; report week and send time; no-show rate formula. | UC-07 step 5; UC-11 step 3; UC-15 step 1; UC-03 | Recommendation: Clinic Reminders founding team | Open |
| TD-16 | P1 | Open question | [06a / UC-01](./06a-use-cases-clinic-owner.md#uc-01-set-up-the-clinic) | Confirm or replace 5 proposals: account opening; sender model (pre-BRD OI-15); report opt-in later; not-ready state; owner-only setup. | UC-01 Preconditions, step 6, A1, E1, Business Rules, criteria | Recommendation: Clinic Reminders founding team | Open |
| TD-17 | P1 | Open question | [06a / UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) | Confirm or replace 5 proposals: week-on-week comparison; empty-week report; no SMS for the report; unmarked count; no patient names. | UC-03 step 6, A1, E1, E2, Business Rules | Recommendation: Clinic Reminders founding team | Open |
| TD-18 | P1 | Open question | [06a / UC-04](./06a-use-cases-clinic-owner.md#uc-04-change-reminder-timing) | Confirm or replace 2 proposals: changes apply to reminders not yet sent; range check. | UC-04 step 6, E1 | Recommendation: Clinic Reminders founding team | Open |
| TD-19 | P1 | Open question | [06b / UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file) | Confirm or replace 4 proposals: downloadable file layout; layout check; duplicate skip; past-date rule. | UC-08 step 1, E1, E2, Business Rules | Recommendation: Clinic Reminders founding team | Open |
| TD-20 | P1 | Open question | [06b / UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-messaging-consent) | Confirm or replace 2 proposals: ways consent is given; opt-out recorded by staff. | UC-09 step 5, A1 | Recommendation: Clinic Reminders founding team | Open |
| TD-21 | P1 | Open question | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages) | Confirm or replace 2 proposals: opted-out flag; restart by new consent. | UC-16 step 5, A2 | Recommendation: Clinic Reminders founding team | Open |
| TD-22 | P2 | Open question | [01 / BO-02](./01-executive-summary-and-context.md#business-objectives) | Does the notice that a slot is filled (UC-15 step 6) need its own approved template? | BO-02; UC-15 step 6; 08 / WhatsApp (Meta) | Recommendation: Clinic Reminders founding team | Open |
| TD-23 | P2 | Open question | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) (company incorporated in Egypt) | Is the company incorporated in Egypt in time for WhatsApp verification and SMS sender registration? | BO-02, BO-03; 08 / WhatsApp (Meta), SMS Provider | Recommendation: Clinic Reminders founding team | Open |
| TD-24 | P2 | Open question | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) (15 pilot clinics) | Do the founders have clinic relationships (pilot sites or letters of intent) for the 15 pilot clinics? | BO-05 | Recommendation: Clinic Reminders founding team | Open |
| TD-25 | P2 | Open question | [03 / Weekly no-show report measures](./03-definitions-and-domain-concepts.md#weekly-no-show-report-measures) | How close to the visit does a cancellation count as late? | UC-03; 09 / Weekly no-show report | Recommendation: Clinic Reminders founding team | Open |
| TD-26 | P2 | Open question | [06a / UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins) Business Rules | Who restores access when the owner lost the owner login's number, and how does the owner login pass on a change of owner? | UC-02 | Recommendation: Clinic Reminders founding team | Open |
| TD-27 | P2 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) E2 | When a payment is overdue, for how long do reminders continue, and what happens to the data? | UC-06 E2, A1; NFR-06 | Recommendation: Clinic Reminders founding team | Open |
| TD-28 | P2 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) E3 | When the monthly reminder allowance is used up, do reminders continue and bill as a top-up, or stop? | UC-06 E3 | Recommendation: Clinic Reminders founding team | Open |
| TD-29 | P2 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) Business Rules | Are per-doctor calendars for every plan, and is a per-doctor report in scope or a Wishlist item? | UC-12 A2; UC-06; 12 / Wishlist item 4 | Recommendation: Clinic Reminders founding team | Open |
| TD-30 | P2 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) Business Rules | Which messages count against the allowance, and how are fallback SMS charged? | UC-06; 08 / SMS Provider | Recommendation: Clinic Reminders founding team | Open |
| TD-31 | P2 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) A1 | How many days after 2027-04-01 do pilot clinics stay free? | UC-06 A1; BO-10, BO-11 | Recommendation: Clinic Reminders founding team | Open |
| TD-32 | P2 | Open question | [06b / UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-messaging-consent) Business Rules | When a child turns 15, does the patient consent again, and who records it? | UC-09 | Recommendation: Clinic Reminders founding team | Open |
| TD-33 | P2 | Open question | [06b / UC-11](./06b-use-cases-receptionist.md#uc-11-add-a-patient-to-the-waitlist) Business Rules | After how many days does a waitlist entry with no linked appointment end? | UC-11; UC-15 | Recommendation: Clinic Reminders founding team | Open |
| TD-34 | P2 | Open question | [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance) Business Rules | In the pilot, before message status exists, how does the clinic check one patient's reminder? | UC-12 A3; UC-13, UC-14 | Recommendation: Clinic Reminders founding team | Open |
| TD-35 | P2 | Open question | [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance) Business Rules | For how long after the visit can an attendance mark be changed? | UC-12 A4 | Recommendation: Clinic Reminders founding team | Open |
| TD-36 | P2 | Open question | [06b / UC-18](./06b-use-cases-receptionist.md#uc-18-update-or-remove-a-patients-details) Business Rules | Counsel to confirm which patient requests the clinic must answer under the PDPL, and within what time. | UC-18 | Recommendation: Clinic Reminders founding team | Open |
| TD-37 | P2 | Open question | [06c / UC-15](./06c-use-cases-patient.md#uc-15-accept-a-slot-offer) E2 | When a waitlisted patient with a later appointment accepts an offer, is the later appointment cancelled automatically? | UC-15 E2 | Recommendation: Clinic Reminders founding team | Open |
| TD-38 | P2 | Open question | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages) Business Rules | With one shared sender number, does an opt-out stop every clinic's messages or only the clinic answered? | UC-16; UC-01 step 6 (TD-16) | Recommendation: Clinic Reminders founding team | Open |
| TD-39 | P2 | Open question | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages) Business Rules | Which Arabic and English words count as stop words? | UC-16 step 1; UC-13 E1 | Recommendation: Clinic Reminders founding team | Open |
| TD-40 | P2 | Open question | [09 / Pilot and business metrics](./09-reporting-and-analytics.md#reporting--analytics) | Who in the team views the cross-clinic metrics, and is it a report inside the product? | 09; BO-07, BO-08, BO-09, BO-13 | Recommendation: Clinic Reminders founding team | Open |
| TD-41 | P2 | Open question | [10 / NFR-01](./10-nfrs.md#non-functional-requirements) | How much disruption per month is tolerable, and may a reminder ever be late or missed? | NFR-01 | Recommendation: Clinic Reminders founding team | Open |
| TD-42 | P2 | Open question | [10 / NFR-02](./10-nfrs.md#non-functional-requirements); 02 / Assumption 2 | What are the average monthly appointments per clinic, and what share of patients needs SMS? | NFR-02; 02 / Assumption 2 | Recommendation: Clinic Reminders founding team | Open |
| TD-43 | P2 | Open question | [10 / NFR-03](./10-nfrs.md#non-functional-requirements) | How many minutes after the reminder time may a reminder go, and how soon must a reply show? | NFR-03 | Recommendation: Clinic Reminders founding team | Open |
| TD-44 | P2 | Open question | [10 / NFR-06](./10-nfrs.md#non-functional-requirements) | Counsel to confirm which records the Anti-Cybercrime Law 175 of 2018 requires. | NFR-06; UC-05 | Recommendation: Clinic Reminders founding team | Open |
| TD-45 | P2 | Open question | [10 / NFR-06](./10-nfrs.md#non-functional-requirements) | How long are patient and appointment records kept after the visit, and after a clinic leaves? | NFR-06; UC-17, UC-18 | Recommendation: Clinic Reminders founding team | Open |
| TD-46 | P2 | Open question | [10 / NFR-08](./10-nfrs.md#non-functional-requirements) | Within how many hours of finding a breach is each affected clinic told? | NFR-08 | Recommendation: Clinic Reminders founding team | Open |
| TD-47 | P2 | Open question | [10 / NFR-08](./10-nfrs.md#non-functional-requirements) | Must affected patients be told of a breach, and by the clinic or by Clinic Reminders? | NFR-08 | Recommendation: Clinic Reminders founding team | Open |
| TD-48 | P2 | Open question | [10 / NFR-09](./10-nfrs.md#non-functional-requirements) | What measure shows that a receptionist can use the screens without training? | NFR-09 | Recommendation: Clinic Reminders founding team | Open |
| TD-49 | P2 | Open question | [10 / NFR-10](./10-nfrs.md#non-functional-requirements) | Within how many seconds must everyday screens respond? | NFR-10 | Recommendation: Clinic Reminders founding team | Open |
| TD-50 | P2 | Open question | [10 / NFR-11](./10-nfrs.md#non-functional-requirements) | How many minutes of entered appointments and marks may be lost after a failure? | NFR-11 | Recommendation: Clinic Reminders founding team | Open |
| TD-51 | P2 | Open question | [06a / UC-02](./06a-use-cases-clinic-owner.md#uc-02-manage-receptionist-logins) | Confirm or replace 3 proposals: cancel option; one login per mobile number; personal logins. | UC-02 A1, E1, Business Rules | Recommendation: Clinic Reminders founding team | Open |
| TD-52 | P2 | Open question | [06a / UC-05](./06a-use-cases-clinic-owner.md#uc-05-review-staff-actions) | Confirm or replace 2 proposals: list of logged actions; read-only log. | UC-05 Business Rules; NFR-06 | Recommendation: Clinic Reminders founding team | Open |
| TD-53 | P2 | Open question | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) | Confirm or replace 1 proposal: retry after a refused payment. | UC-06 E1 | Recommendation: Clinic Reminders founding team | Open |
| TD-54 | P2 | Open question | [06b / UC-07](./06b-use-cases-receptionist.md#uc-07-enter-an-appointment) | Confirm or replace 4 proposals: immediate reminder; no-consent flag; double-booking warning; Egyptian numbers only. | UC-07 A1, A2, E1, E2; UC-12 statuses | Recommendation: Clinic Reminders founding team | Open |
| TD-55 | P2 | Open question | [06b / UC-10](./06b-use-cases-receptionist.md#uc-10-change-or-cancel-an-appointment) | Confirm or replace 1 proposal: double-booking warning. | UC-10 E1 | Recommendation: Clinic Reminders founding team | Open |
| TD-56 | P2 | Open question | [06b / UC-11](./06b-use-cases-receptionist.md#uc-11-add-a-patient-to-the-waitlist) | Confirm or replace 1 proposal: removal from the waitlist after acceptance. | UC-11 Business Rules; UC-15 | Recommendation: Clinic Reminders founding team | Open |
| TD-57 | P2 | Open question | [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance) | Confirm or replace 2 proposals: unmarked-visit prompt; timing rule for marks. | UC-12 E1, Business Rules | Recommendation: Clinic Reminders founding team | Open |
| TD-58 | P2 | Open question | [06c / UC-13](./06c-use-cases-patient.md#uc-13-confirm-or-cancel-from-the-whatsapp-reminder) | Confirm or replace 4 proposals: latest-answer rule; free-text handling; late-reply handling; one-reminder-one-appointment rule. | UC-13 A4, E1, E2, Business Rules | Recommendation: Clinic Reminders founding team | Open |
| TD-59 | P2 | Open question | [06c / UC-14](./06c-use-cases-patient.md#uc-14-confirm-or-cancel-from-the-sms-link) | Confirm or replace 3 proposals: not-reached flag; link end time; one-appointment link. | UC-14 E1, E2, Business Rules | Recommendation: Clinic Reminders founding team | Open |
| TD-60 | P2 | Open question | [06c / UC-15](./06c-use-cases-patient.md#uc-15-accept-a-slot-offer) | Confirm or replace 2 proposals: stay on the waitlist; open-slot display. | UC-15 A1, A2 | Recommendation: Clinic Reminders founding team | Open |
| TD-61 | P2 | Assumption to validate | [02 / Assumption 3](./02-glossary-assumptions-facts.md#assumptions--constraints) | Confirm that WhatsApp (Meta) approves the reminder, confirmation, slot offer, and weekly report messages as service templates. | UC-15; BO-02 | Recommendation: Clinic Reminders founding team | Open |
| TD-62 | P2 | Assumption to validate | [02 / Dependency "WhatsApp (Meta) business verification and approved service templates"](./02-glossary-assumptions-facts.md#dependencies) | Decide how the BRD treats this pending dependency (confirmed, replaced, or out of scope). | BO-02; UC-01, UC-13, UC-15 | Recommendation: Clinic Reminders founding team | Open |
| TD-63 | P2 | Assumption to validate | [02 / Dependency "SMS Provider contract and registered sender name"](./02-glossary-assumptions-facts.md#dependencies) | Decide how the BRD treats this pending dependency. | BO-03; UC-14 | Recommendation: Clinic Reminders founding team | Open |
| TD-64 | P2 | Assumption to validate | [02 / Dependency "Payment Gateway contract"](./02-glossary-assumptions-facts.md#dependencies) | Decide how the BRD treats this pending dependency. | UC-06 | Recommendation: Clinic Reminders founding team | Open |
| TD-65 | P2 | Pending decision | [13 / Reviewer Notes](./13-open-items-and-clarifications.md#reviewer-notes) (sending hours) | Do immediate reminders and slot offers keep to sending hours, and which hours? | UC-07 A1; UC-15 step 1 | Recommendation: Clinic Reminders founding team | Open |
| TD-66 | P2 | Pending decision | [13 / Reviewer Notes](./13-open-items-and-clarifications.md#reviewer-notes) (fee estimates) | Do the lost and recovered fee estimates use the full consultation fee for follow-up visits? | 03 / Weekly no-show report measures; UC-03 | Recommendation: Clinic Reminders founding team | Open |
| TD-71 | P2 | Pending decision | [14 / CF-46](#consistency-findings); [06a / UC-17](./06a-use-cases-clinic-owner.md#uc-17-end-the-clinics-service) | May the end date the owner picks in a free period fall after that free period ends? If so, UC-06 A1 would treat the clinic as overdue. | UC-17 step 1; UC-06 A1 | Recommendation: Clinic Reminders founding team | Open |
| TD-67 | P3 | Open question | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) (named product owner) | Which founder owns product management and approves this BRD? | Owner of every row here; Changes Log approval | Recommendation: Clinic Reminders founding team | Open |
| TD-68 | P3 | Open question | [11 / Data Tables](./11-summary-and-uiux.md#uiux-expectations) | Which other lists need bulk actions, and which actions? | 11 / Data Tables | Recommendation: Clinic Reminders founding team | Open |
| TD-69 | P3 | Pending decision | [13 / Reviewer Notes](./13-open-items-and-clarifications.md#reviewer-notes) (Language & Locale) | Name the number and date format, including which digits Arabic screens and messages use. | 11 / Language & Locale | Recommendation: Clinic Reminders founding team | Open |
| TD-70 | P3 | Pending decision | [13 / Reviewer Notes](./13-open-items-and-clarifications.md#reviewer-notes) (Reception screens) | Are all clinic screens, including setup and billing, in Arabic? | NFR-09; 11 / Language & Locale | Recommendation: Clinic Reminders founding team | Open |

---

## Step 2 - Run a consistency check across all BRD chunks

| | |
|---|---|
| **Status** | In progress |
| **Required inputs** | All BRD chunks 00-13 (and 05 / 06* diagrams once step 5 has run; chunk 14 itself, and 15-17 once they exist, for check C10) |
| **Expected output** | Every finding recorded below with its affected chunks and identifiers, impact, and a disposition; confirmed corrections applied to every affected chunk; a recheck run recorded |
| **Completion criteria** | The latest check run is dated after the last change to chunks 00-13, and every finding has a documented disposition. Findings deferred for clarification remain visible as open items (TD / OI), which keeps step 1 open. Run 1, made at generation, leaves this step `In progress`. |
| **Evidence** | Runs 1 to 5 on 2026-10-01, each by a cleared-context checker: CF-01 to CF-52 found, every one dispositioned. The Run 5 dispositions changed chunks 03, 06b, 06c, 08, and 13 after the last run, so Run 6 is due. |

**Checks performed:** C1 conflicting requirements, C2 terminology, C3 scope, C4 duplicated requirements, C5 missing requirements, C6 broken references, C7 use cases vs acceptance criteria, C8 derived views (Use Case Summary, matrix), C9 diagrams vs narrative (after step 5), C10 delivery chunks vs body (chunk 14 at every write; 15-17 once they exist).

### Check runs

| Run | Date | Trigger | Scope | Findings | Still open after run |
|-----|------|---------|-------|----------|----------------------|
| 1 | 2026-10-01 | Initial generation (after the acceptance loop for OI-01 to OI-30) | 00-13 | 23 (CF-01 to CF-23) | 0: 8 corrected, 14 raised as OI-31 to OI-44 and accepted and applied the same day, 1 no change |
| 2 | 2026-10-01 | Recheck after the Run 1 dispositions | 00-13 | 9 (CF-24 to CF-32) | 0: 6 corrected, 3 raised as OI-45 to OI-47 and accepted and applied the same day |
| 3 | 2026-10-01 | Recheck after the Run 2 dispositions | 00-13 | 8 (CF-33 to CF-40) | 0: 6 corrected, 1 raised as OI-48 and accepted and applied the same day, 1 no change |
| 4 | 2026-10-01 | Recheck after the Run 3 dispositions | 00-13 | 7 (CF-41 to CF-47) | 0: 4 corrected (CF-46 left question TD-71), 3 raised as OI-49 to OI-51 and accepted and applied the same day |
| 5 | 2026-10-01 | Targeted recheck of the Run 4 dispositions | Sections touched by CF-44 to CF-47 and OI-49 to OI-51 (02, 03, 04, 06a, 06b, 06c, 07, 08, 09, 10, 13) | 5 (CF-48 to CF-52) | 0: 4 corrected, 1 raised as OI-52 and accepted and applied the same day. Not yet rechecked: Run 6 is due. |

### Consistency findings

| ID | Check | Affected chunks and identifiers | Finding | Impact | Recommended correction or decision needed | Disposition | Rechecked |
|----|-------|---------------------------------|---------|--------|-------------------------------------------|-------------|-----------|
| CF-01 | C1 | 07 footnotes; [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance); 04; 09 | The owner could do reception work (footnote ³) but not mark attendance. | A clinic with no receptionist cannot complete its report (BO-07). | Decision: may the owner mark attendance? | Open item raised: OI-31 (accepted and applied, 2026-10-01) | Run 2 |
| CF-02 | C1 | UC-02, UC-07, UC-10, UC-11, UC-14, UC-15, UC-16; 03 Figure 1; 08 | Nine proposals were already relied on as settled elsewhere. | Two rules for one subject. | Decision: confirm or qualify them. | Open item raised: OI-32 (accepted and applied, 2026-10-01) | Run 2 |
| CF-03 | C1 | 04 Personas; [06b](./06b-use-cases-receptionist.md) UC-07 to UC-11, UC-18 Preconditions; 05 Owner Journey | Restatements did not follow OI-07 and OI-20 (owner acting as receptionist). | A clinic with no receptionist could not start these use cases. | Recommendation: align the restatements. | Corrected (04, 05, 06b Preconditions, 2026-10-01; completes accepted OI-07 and OI-20) | Run 2 |
| CF-04 | C1 | [06b / UC-12](./06b-use-cases-receptionist.md#uc-12-follow-the-days-list-and-mark-attendance) Business Rules | The closed status list missed walk-in and to-be-called, and stated a proposed flag as settled. | Incomplete list for design and tests. | Recommendation: align the list with UC-07 A3 and UC-10. | Corrected (06b / UC-12, 2026-10-01; completes accepted OI-05, OI-18, OI-21) | Run 2 |
| CF-05 | C1 | [06a / UC-03](./06a-use-cases-clinic-owner.md#uc-03-read-the-weekly-no-show-report) E1, criteria | E1 and a criterion assumed the dashboard view whose MVP scope is open. | Untestable in a WhatsApp-only MVP. | Decision: settle or make conditional. | Open item raised: OI-33 (accepted and applied, 2026-10-01) | Run 2 |
| CF-06 | C1 | 03 Reminder; UC-04; UC-13 E4; UC-14 | Channel order during a clinic-wide WhatsApp stop was unclear. | Late reminders or two rules. | Decision: skip WhatsApp during a stop or not. | Open item raised: OI-34 (accepted and applied, 2026-10-01) | Run 2 |
| CF-07 | C1 | 10 NFR-05; 07 footnote ² | NFR-05 forbade the patient's view of their own appointment. | UC-13 and UC-14 would break NFR-05. | Decision: name the exception. | Open item raised: OI-35 (accepted and applied, 2026-10-01) | Run 2 |
| CF-08 | C1 | 01 BO-07, BO-09; UC-04, UC-07, UC-10 Why | Objective tracing disagreed between Served by and the Whys. | Tracing differs by direction. | Decision: tracing rule. | Open item raised: OI-36 (accepted and applied, 2026-10-01) | Run 2 |
| CF-09 | C2 | 02 Glossary (Cancelled slot); 03; BO-09 | "Cancelled slot" no longer matched the offer rule after OI-21. | BO-09 countable two ways. | Decision: redefine the term. | Open item raised: OI-37 (accepted and applied, 2026-10-01) | Run 2 |
| CF-10 | C2 | UC-09; 02 Glossary (Opt-out); UC-16 | "Withdraw consent" and "opt-out" named one act. | Two terms, untestable scope. | Decision: one term and scope. | Open item raised: OI-38 (accepted and applied, 2026-10-01) | Run 2 |
| CF-11 | C2 | 01 Background; UC-11 Why | "Waiting list" used for the Glossary term "Waitlist". | Two names for one thing. | Recommendation: use "waitlist". | Corrected (01, 06b / UC-11, 2026-10-01) | Run 2 |
| CF-12 | C3 | [06a / UC-06](./06a-use-cases-clinic-owner.md#uc-06-pay-the-subscription) A1 | Pilot clinics' free period ended before billing existed. | No notice or unscoped MVP work. | Decision: when the free period ends. | Open item raised: OI-39 (accepted and applied, 2026-10-01) | Run 2 |
| CF-13 | C3 | 01 BO-01, BO-02 Served by | BO-01 left out UC-17 and UC-18; BO-02 left out UC-03. | Index rows wrong. | Recommendation: add them. | Corrected (01, 2026-10-01) | Run 2 |
| CF-14 | C4 | 02 Glossary; 03; [06b / UC-09](./06b-use-cases-receptionist.md#uc-09-record-a-patients-messaging-consent); 09 | Restatements missed accepted changes (Stop messages button, per-number opt-out, walk-in, consent wording version). | Two places with different facts. | Recommendation: align the restatements. | Corrected (02, 03, 06b / UC-09, 09, 2026-10-01; completes accepted OI-07, OI-18, OI-19, OI-27, OI-28) | Run 2 |
| CF-15 | C5 | 09 Consent and opt-out log; 03 | No use case delivered the consent and opt-out log. | Consent evidence unbuildable and untestable. | Decision: new use case or later release. | Open item raised: OI-40 (accepted and applied, 2026-10-01) | Run 2 |
| CF-16 | C5 | [06b / UC-11](./06b-use-cases-receptionist.md#uc-11-add-a-patient-to-the-waitlist); UC-09 | A new patient could never join the waitlist; E1 contradicted the precondition. | Precondition nothing delivers. | Decision: who can join. | Open item raised: OI-41 (accepted and applied, 2026-10-01) | Run 2 |
| CF-17 | C5 | [06a / UC-05](./06a-use-cases-clinic-owner.md#uc-05-review-staff-actions); UC-18 | The logged-action list left out patient data deletion and other sensitive actions. | No trail for deletions. | Decision: extend the list. | Open item raised: OI-42 (accepted and applied, 2026-10-01) | Run 2 |
| CF-18 | C6 | 04 Out of Scope; UC-07 Why | "Assumption 5" cited for "Constraint 5". | Wrong identifier. | Recommendation: cite Constraint 5. | Corrected (04, 06b / UC-07, 2026-10-01) | Run 2 |
| CF-19 | C6 | 13 Reviewer Notes | Marker count out of date. | Wrong count. | Recommendation: correct the count. | Corrected (13 / Reviewer Notes, 2026-10-01) | Run 2 |
| CF-20 | C7 | [06a / UC-04](./06a-use-cases-clinic-owner.md#uc-04-change-reminder-timing); NFR-07 | The visit-day audience included patients who must get no message. | AC-2 and NFR-07 could not both pass. | Decision: the audience. | Open item raised: OI-43 (accepted and applied, 2026-10-01) | Run 2 |
| CF-21 | C7 | 13 use cases (30 flows) | Thirty alternate and exception flows had no criterion. | Branches could not be signed off. | Decision: add criteria or leave to chunk 16. | Open item raised: OI-44 (accepted and applied, 2026-10-01) | Run 2 |
| CF-22 | C8 | 05 Use Case Summary (UC-10) | The summary hid the clinic-initiated change. | Derived view out of date. | Recommendation: follow the use case. | Corrected (05, 2026-10-01) | Run 2 |
| CF-23 | C6 | 08, 12 headers | VERSION 1.0 while the BRD is 1.1. | None: no change touched them. | No change. | No change (skill, chunks 08 and 12 were changed by no decision, so VERSION 1.0 is correct) | Run 2 |
| CF-24 | C1, C7 | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages); NFR-07; 03; 05; 08 | The opt-out confirmation broke the zero-message rule. | NFR-07 and UC-16 could not both pass. | Decision: keep or delete the confirmation. | Open item raised: OI-45 (accepted and applied, 2026-10-01) | Run 3 |
| CF-25 | C7 | [06a / UC-19](./06a-use-cases-clinic-owner.md#uc-19-export-the-consent-and-opt-out-log) A1 | A1 had no criterion. | Branch could not be signed off. | Recommendation: add the criterion. | Corrected (06a / UC-19, 2026-10-01; completes accepted OI-44) | Run 3 |
| CF-26 | C7 | 13 criteria in 06a, 06b, 06c | Older criteria on proposed flows lacked the flow's proposal marker. | Provisional criteria read as settled. | Recommendation: add the markers. | Corrected (06a, 06b, 06c, 2026-10-01; completes accepted OI-44) | Run 3 |
| CF-27 | C1, C6 | 13 Reviewer Notes | Four notes still described settled items as open. | Settled items could reopen. | Recommendation: add closing pointers. | Corrected (13 / Reviewer Notes, 2026-10-01) | Run 3 |
| CF-28 | C1 | 04 Personas (Receptionist) | Access level left out UC-18. | Two access scopes. | Recommendation: follow the use case. | Corrected (04, 2026-10-01) | Run 3 |
| CF-29 | C1 | [06a / UC-05](./06a-use-cases-clinic-owner.md#uc-05-review-staff-actions) Why | The Why still called the whole log a paid-launch item. | Pilot could lose its trail. | Recommendation: follow item 13. | Corrected (06a / UC-05, 2026-10-01) | Run 3 |
| CF-30 | C2 | 01; 02 Glossary; UC-05 A1 | "Waitlist offers" for the term "Slot offer"; "Empty states" for "Empty States". | Two names for one thing. | Recommendation: use the Glossary term and the standard's name. | Corrected (01, 02, 06a / UC-05, 2026-10-01) | Run 3 |
| CF-31 | C1, C3 | 11 Filtration; UC-12 A2; 04 item 11 | A doctor filter on the MVP day's list duplicated a paid-launch item. | MVP builds a Should-have early, or breaks chunk 11. | Decision: release of the doctor filter. | Open item raised: OI-46 (accepted and applied, 2026-10-01) | Run 3 |
| CF-32 | C1 | UC-15 step 4; UC-13, UC-14 Preconditions; 03 Confirmed share | A visit booked from an accepted offer got no regular reminder. | Two behaviours; Confirmed share overstated. | Decision: remind or not. | Open item raised: OI-47 (accepted and applied, 2026-10-01) | Run 3 |
| CF-33 | C7 | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages) criteria | The shared-phone criterion forbade the one confirmation that OI-45 kept. | A tester could not pass both. | Recommendation: name the confirmation in the criterion. | Corrected (06c / UC-16, 2026-10-01; completes accepted OI-45) | Run 4 |
| CF-34 | C1, C7 | [06c / UC-13](./06c-use-cases-patient.md#uc-13-confirm-or-cancel-from-the-whatsapp-reminder) A2 and criteria; UC-14 E1 | Texts still assumed a Booked appointment after OI-47, and no criterion tested the new reminder. | A refilled visit read as "no reply yet". | Recommendation: keep the status; add the criterion. | Corrected (06c / UC-13, UC-14, 2026-10-01; completes accepted OI-47) | Run 4 |
| CF-35 | C1 | [06a / UC-17](./06a-use-cases-clinic-owner.md#uc-17-end-the-clinics-service); UC-06 A1 | A clinic in a free period could not stop its messages before the paid launch. | A leaving pilot clinic kept messaging patients. | Decision: when the service ends in a free period. | Open item raised: OI-48 (accepted and applied, 2026-10-01) | Run 4 |
| CF-36 | C1 | 05 User Journeys | The journeys left out UC-17, UC-18, and UC-19, and said the owner never signs in. | The overview contradicted three MVP use cases. | Recommendation: follow the use cases. | Corrected (05, 2026-10-01) | Run 4 |
| CF-37 | C4 | 09 Weekly no-show report row; 03 | Chunk 09 copied the measure list and left one out. | Drift between two homes. | Recommendation: point to chunk 03. | Corrected (09, 2026-10-01) | Run 4 |
| CF-38 | C6 | 13 Reviewer Notes; 00 Changes Log | Three applied editorial notes still read as open. | Settled notes could reopen. | Recommendation: mark them applied. | Corrected (13 / Reviewer Notes, 00, 2026-10-01) | Run 4 |
| CF-39 | C2 | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages) A1 | One button had two labels. | Two names for one thing. | Recommendation: use "Stop messages". | Corrected (06c / UC-16, 2026-10-01) | Run 4 |
| CF-40 | C7 | UC-03, UC-06, UC-15 criteria | Three criteria on flows with a proposal test only the settled part. | None. | No change. | No change (skill, each criterion tests settled behaviour only) | Run 4 |
| CF-41 | C1 | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages); UC-13; UC-15 step 6; 03; NFR-07 | Replies and slot-filled notices could follow an opt-out made in the same message. | NFR-07 and UC-13 or UC-15 could not both pass. | Decision: strict rule or a second exception. | Open item raised: OI-49 (accepted and applied, 2026-10-01) | Run 5 |
| CF-42 | C1 | 03 / Waitlist and slot offers, Rules; UC-11; UC-15 E2 | The proposed matching rule offered later slots to patients who asked for earlier ones. | Offers outside the patient's request; double bookings. | Decision: matching rule. | Open item raised: OI-50 (accepted and applied, 2026-10-01) | Run 5 |
| CF-43 | C1 | [06b / UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file) Business Rules; 02; 03; UC-09; UC-19 | Imported consent lacked the fields every consent record holds. | Consent evidence incomplete (BO-04). | Decision: complete rows or no imported consent. | Open item raised: OI-51 (accepted and applied, 2026-10-01) | Run 5 |
| CF-44 | C2 | 02 Glossary; 04; 07 Notes; NFR-05; 08 SMS Provider; UC-16 A1 | The SMS accept link was undefined and missing from every list of what a patient uses. | Untestable patient page. | Recommendation: name the accept link everywhere. | Corrected (02, 04, 07, 08, 10, 06c / UC-16, 2026-10-01) | Run 5 |
| CF-45 | C4 | 09 Consent log and Message status rows | Two rows copied their use case's field lists. | Drift between two homes. | Recommendation: point to UC-19 and UC-12. | Corrected (09, 2026-10-01) | Run 5 |
| CF-46 | C5 | [06a / UC-17](./06a-use-cases-clinic-owner.md#uc-17-end-the-clinics-service) steps 1 and 2 | No step let the owner pick the end date, and the list of what stops left out the owner login. | Untestable step. | Recommendation: add the date choice; name every login. | Corrected (06a / UC-17, 2026-10-01); the follow-on question is TD-71 | Run 5 |
| CF-47 | C7 | UC-03 AC-1; UC-15 AC-1 | Two criteria tested proposed behaviour without the marker. | Provisional criteria read as settled. | Recommendation: add the markers. | Corrected (06a / UC-03, 06c / UC-15, 2026-10-01; completes accepted OI-44) | Run 5 |
| CF-48 | C7 | [06c / UC-15](./06c-use-cases-patient.md#uc-15-accept-a-slot-offer) criteria; 03 matching rule | The offer criterion still fitted doctor-only matching after OI-50. | The earlier-slot condition went untested. | Recommendation: limit the Given clause; add a criterion. | Corrected (06c / UC-15, 2026-10-01) | Run 6 due |
| CF-49 | C1 | [06b / UC-08](./06b-use-cases-receptionist.md#uc-08-import-appointments-from-a-file); [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages) | Rules settled by OI-49 and OI-51 relied on two open proposals. | Settled rules contradict any replacement. | Decision: confirm or make conditional. | Open item raised: OI-52 (accepted and applied, 2026-10-01) | Run 6 due |
| CF-50 | C1, C4 | 03 / Waitlist and slot offers, Overview | The overview still told every offered patient that the slot is filled. | Messages to opted-out numbers. | Recommendation: follow UC-15 step 6. | Corrected (03, 2026-10-01) | Run 6 due |
| CF-51 | C7 | [06c / UC-16](./06c-use-cases-patient.md#uc-16-stop-all-messages) criteria | The accept-page opt-out had no criterion. | Untested path. | Recommendation: cover both pages. | Corrected (06c / UC-16, 2026-10-01) | Run 6 due |
| CF-52 | C8 | [08 / Figure 3](./08-integrations.md#integrations) | The SMS edge did not show slot offers. | Figure and table disagreed. | Recommendation: name slot offers on the edge. | Corrected (08, 2026-10-01) | Run 6 due |

---

## Step 3 - Finalise requirements with the grill-me skill

| | |
|---|---|
| **Status** | Not started |
| **Required inputs** | Open rows of the register above (P1 first); unresolved consistency findings; the requirements listed below |
| **Expected output** | A decision list from the session; confirmed decisions applied to the affected BRD chunks; consistency check rerun |
| **Completion criteria** | The product manager confirms the session took place and hands back the decision list; every confirmed decision is applied and logged; the rerun of step 2 leaves no new undispositioned finding. New questions reopen steps 1-2. |
| **Evidence** | None yet. Recommended, not executed. |

**Take into the session**

| What | Items |
|------|-------|
| Open questions and pending decisions | P1: TD-01 to TD-21. Then P2: TD-22 to TD-66 and TD-71. Then P3: TD-67 to TD-70. |
| Unresolved consistency findings | None: CF-01 to CF-52 all have a disposition; Run 6 is still due to recheck the Run 5 corrections. |
| Requirements to stress-test even though nothing is flagged | Use cases carrying a Business Objective: UC-13, UC-14 (BO-07, BO-08), UC-15 and UC-11 (BO-09), UC-03 (BO-12, BO-13), UC-12 (BO-07). Criteria with numbers: UC-03 AC-1 (40 due, 6 no-shows, 15%), UC-04 AC-1 (48 hours), UC-08 AC-1 (50 rows), UC-12 AC-1 (12 appointments). NFR measures: NFR-04 (BO-08, 98% delivered), NFR-06 (3 years, 180 days), NFR-07 (zero messages without consent), NFR-08 (72 hours). |

**Ready-to-use handoff prompt** (recommended; run it yourself with `/grill-me`):

```text
/grill-me Finalise the requirements of the Clinic Reminders BRD v1.1 in ./brd-clinic-reminders/.
Read clinic-reminders-brd-master.md first, then 14-todo.md.
Grill me in this order:
1. Open questions and pending decisions, P1 first: TD-01 (validation gate, 01), TD-02 (timed slots, 02 Assumption 1), TD-03 to TD-07 (data protection and consent with counsel: 02 Constraints 6 and 7, 02 Dependencies, NFR-05, UC-09), TD-08 and TD-09 (slot offers, UC-15 and chunk 03), TD-10 (weekly report scope, UC-03), TD-11 (SMS wait, chunk 03), TD-12 (pilot measurement, BO-06), TD-13 (reminder timing, UC-04), TD-14 (tax, UC-06), TD-15 to TD-21 (proposals in chunk 03, UC-01, UC-03, UC-04, UC-08, UC-09, UC-16); then TD-22 to TD-71.
2. Unresolved consistency findings: None: CF-01 to CF-52 all have a disposition; Run 6 is still due to recheck the Run 5 corrections.
3. Requirements to stress-test: UC-13, UC-14, UC-15, UC-11, UC-03, UC-12; UC-03 AC-1, UC-04 AC-1, UC-08 AC-1, UC-12 AC-1; NFR-04, NFR-06, NFR-07, NFR-08.
For every decision I confirm, name the chunk and section it changes.
Do not edit any file during the session. End with a numbered decision list I can hand back to brd-unifier.
```

**After the session:** hand the decision list to brd-unifier. Confirmed decisions are applied to the affected chunks (status, Resolution Log, Changes Log), and step 2 is rerun. Chunks 15-17 still wait for the delivery gate; if they exist, they become `Stale`.

---

## Step 4 - Generate mockups in Figma

| | |
|---|---|
| **Status** | Pending gate |
| **Gate** | Starts only after steps 1-3 are `Complete` with evidence (conditions G1-G3 above, verified in the files). Runs in parallel with step 5; neither waits for the other. The product manager's confirmation is the evidence for step 3. No override. |
| **Required inputs** | Finalised use cases (06*), the matrix ([07](./07-users-use-cases-matrix.md)), UI/UX Expectations ([11](./11-summary-and-uiux.md)), decisions from steps 1-3, and the project's global UI/UX constitution when one exists. No UI/UX constitution found; chunk 11 used. |
| **Expected output** | A playable, responsive prototype covering the table below, reviewed against the criteria, with links recorded in each use case's UI/UX section |
| **Completion criteria** | Every row is `Approved`; the product manager confirms the review and a dated play-through; the Figma links are recorded in the use cases |
| **Evidence** | None yet. Play-through: date and result once confirmed. |

**Standard to follow.** The project has no constitution, so chunk 11 is the visual standard and the rules below still apply. For Figma, P1 rows have every Main Flow playable from the named start frame with no dead ends. Every actor-facing control is wired, with frames for mobile, tablet and desktop. P2 rows are connected to neighbouring frames, with desktop and mobile frames. States are variants, not duplicate frames. Simulated data and demo actions are labelled, and each frame names its `UC-NN`.

**Ready-to-use mockup brief** (recommended; run it yourself in the mockup tool or agent):

```text
Use the UI/UX Expectations in 11-summary-and-uiux.md as the visual baseline (primary color teal #0F766E; Arabic first, right to left; WCAG 2.1 AA).
Use the Clinic Reminders BRD v1.1 in ./brd-clinic-reminders/ for the workflows, fields, permissions and business rules. Read clinic-reminders-brd-master.md first, then 14-todo.md.
Create a playable Figma prototype covering every row of the Mockup coverage table below, for clinic owners, receptionists, and patients (WhatsApp messages, SMS, and the confirm or cancel page).
P1 rows: one named start frame, every Main Flow playable to its end with no dead ends, every actor-facing control wired, frames for mobile, tablet and desktop.
P2 rows: connected to neighbouring frames, desktop and mobile frames.
States are component variants. Variables and text styles map to the chunk 11 colors. Label simulated data and demo actions.
Name the UC-NN on each frame. Do not add behaviour the BRD does not describe; list it instead.
Return the share link (view permission, opening on the start frame) and the list of frames per breakpoint.
```

### Mockup coverage

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| MK-01 | Sign-in and clinic setup, including ending the service | UC-01, UC-17 | UC-01 and UC-17 Business Rules; 11 / Destructive Actions, Forms | Default, not ready, missing details, doctor limit, end-of-service confirmation | P2 | N | - | Blocked by TD-07, TD-16 | - | - |
| MK-02 | Staff logins | UC-02 | UC-02 Business Rules; 11 / Destructive Actions | Default, empty, number already used, removal confirmation | P2 | N | - | Blocked by TD-26, TD-51 | - | - |
| MK-03 | Weekly no-show report: WhatsApp message and dashboard view | UC-03 | 03 / Weekly no-show report measures; UC-03 Business Rules | Default, empty week, unmarked visits, not delivered | P1 | N | - | Blocked by TD-10, TD-15, TD-17, TD-25 | - | - |
| MK-04 | Reminder settings | UC-04 | UC-04 Business Rules | Default, out of range | P2 | N | - | Blocked by TD-13, TD-18 | - | - |
| MK-05 | Staff activity log | UC-05 | UC-05 Business Rules; 11 / Data Tables | Default, filtered, empty | P2 | N | - | Blocked by TD-52 | - | - |
| MK-06 | Billing and payment | UC-06 | UC-06 Business Rules | Default, free period ending, refused, overdue, allowance used up | P2 | N | - | Blocked by TD-14, TD-27 to TD-31, TD-53 | - | - |
| MK-07 | New and edited appointment, with walk-in and consent steps | UC-07, UC-10 | UC-07 and UC-10 Business Rules; 11 / Forms | Default, no consent, double booking, invalid number, walk-in, clinic-requested change | P1 | N | - | Blocked by TD-15, TD-54, TD-55 | - | - |
| MK-08 | Import from a file | UC-08 | UC-08 Business Rules | Preview, rows with errors, rows with no consent, unreadable file | P1 | N | - | Blocked by TD-19 | - | - |
| MK-09 | Patient consent record | UC-09 | UC-09 Business Rules; 02 / Constraint 6 | Default, child under 15, missing guardian details, opt-out recorded by staff | P2 | N | - | Blocked by TD-03, TD-07, TD-20, TD-32 | - | - |
| MK-10 | Waitlist | UC-11 | UC-11 Business Rules | Default, empty, no consent, entry ended | P2 | N | - | Blocked by TD-02, TD-33, TD-56 | - | - |
| MK-11 | Day's list and attendance marks | UC-12 | UC-12 Business Rules; 07 / footnote ³; 11 / Filtration | Default, no reply filter, unmarked visits, bulk mark, owner view, per-doctor calendar (paid launch), message status (paid launch) | P1 | N | - | Blocked by TD-34, TD-35, TD-57 | - | - |
| MK-12 | WhatsApp reminder, replies, and opt-out | UC-13, UC-16 | 03 / Content rules; UC-13 Business Rules; UC-16 Business Rules | Delivered, confirmed, cancelled, free text, late reply, clinic-wide stop warning, opt-out confirmation | P1 | N | - | Blocked by TD-05, TD-21, TD-39, TD-58 | - | - |
| MK-13 | SMS and confirm or cancel page | UC-14, UC-16 | UC-14 Business Rules; 02 / Constraint 9 | Default, confirmed, cancelled, time passed, appointment changed, stop messages | P1 | N | - | Blocked by TD-11, TD-59 | - | - |
| MK-14 | Slot offer messages | UC-15 | UC-15 Business Rules; 03 / Waitlist and slot offers | Offer, accepted, already filled, offer closed, SMS offer | P1 | N | - | Blocked by TD-08, TD-09, TD-22, TD-37, TD-60 | - | - |
| MK-15 | Patient details | UC-18 | UC-18 Business Rules; 11 / Destructive Actions | Default, copy requested, deletion confirmation | P2 | N | - | Blocked by TD-36 | - | - |
| MK-16 | Consent and opt-out log | UC-19 | UC-19 Business Rules; 11 / Data Tables | Default, filtered, empty | P2 | N | - | Blocked by TD-03 | - | - |

**Expected coverage:** every use case with an actor-facing interaction has at least one screen; every observable Main Flow step is visible on a screen; every alternate or exception flow with a user-visible state has that state; role differences follow the matrix; global standards follow chunk 11; P1 rows are fully interactive and delivered at mobile, tablet and desktop; P2 rows are connected and delivered at desktop and mobile.

**Review criteria**

- [ ] Each frame names the use case(s) it serves.
- [ ] Every flow can be walked end to end without a missing screen, and played in play mode from the named start frame with no dead ends.
- [ ] Every actor-facing control on a P1 screen is wired (navigation, overlays, drawers, dialogs, tabs, filters, form validation and error paths, destructive-action confirmation).
- [ ] Loading, empty, and error states are present where the use cases call for them, as variants rather than duplicate frames.
- [ ] Frames exist for every breakpoint the row's priority requires.
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

Nineteen use cases do not fit one diagram of about 30 lines, so there is one diagram per persona, in chunk 05 order.

| Diagram | Actors | Use cases | Relationships documented in the narratives | Status | Figure |
|---------|--------|-----------|--------------------------------------------|--------|--------|
| Clinic Owner | Clinic Owner; WhatsApp (Meta), SMS Provider, Payment Gateway | UC-01 to UC-06, UC-17, UC-19 | None between these use cases | Pending gate | - |
| Receptionist | Receptionist, Clinic Owner (footnote ³) | UC-07 to UC-12, UC-18 | UC-07 includes UC-09 (UC-07 step 6) | Pending gate | - |
| Patient | Patient; WhatsApp (Meta), SMS Provider | UC-13 to UC-16 | UC-14 extends UC-13 (UC-13 A3); UC-15 starts from a cancellation in UC-13 (A1) or UC-14 (A1), and from UC-10 | Pending gate | - |

### Use-case flowcharts (chunks 06*)

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-clinic-owner.md) | 9 | A1, A2, E1, E2, E3, E4 | Required | Pending gate | - |
| UC-02 | [06a](./06a-use-cases-clinic-owner.md) | 8 | A1, A2, E1 | Required | Pending gate | - |
| UC-03 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1, E1, E2 | Required | Pending gate | - |
| UC-04 | [06a](./06a-use-cases-clinic-owner.md) | 6 | E1 | Required | Pending gate | - |
| UC-05 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1 | Required | Pending gate | - |
| UC-06 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1, E1, E2, E3 | Required | Pending gate | - |
| UC-17 | [06a](./06a-use-cases-clinic-owner.md) | 6 | Business Rules (paid or free period sets the end date) | Required | Pending gate | - |
| UC-19 | [06a](./06a-use-cases-clinic-owner.md) | 6 | A1 | Required | Pending gate | - |
| UC-07 | [06b](./06b-use-cases-receptionist.md) | 8 | A1, A2, A3, E1, E2 | Required | Pending gate | - |
| UC-08 | [06b](./06b-use-cases-receptionist.md) | 6 | A1, E1, E2 | Required | Pending gate | - |
| UC-09 | [06b](./06b-use-cases-receptionist.md) | 7 | A1, E1 | Required | Pending gate | - |
| UC-10 | [06b](./06b-use-cases-receptionist.md) | 6 | A1, E1; Business Rules (who asked for the change) | Required | Pending gate | - |
| UC-11 | [06b](./06b-use-cases-receptionist.md) | 6 | E1 | Required | Pending gate | - |
| UC-12 | [06b](./06b-use-cases-receptionist.md) | 6 | A1, A2, A3, A4, A5, E1 | Required | Pending gate | - |
| UC-18 | [06b](./06b-use-cases-receptionist.md) | 4 | A1, A2 | Required | Pending gate | - |
| UC-13 | [06c](./06c-use-cases-patient.md) | 5 | A1, A2, A3, A4, E1, E2, E3, E4 | Required | Pending gate | - |
| UC-14 | [06c](./06c-use-cases-patient.md) | 5 | A1, E1, E2, E3 | Required | Pending gate | - |
| UC-15 | [06c](./06c-use-cases-patient.md) | 6 | A1, A2, A3, E1, E2 | Required | Pending gate | - |
| UC-16 | [06c](./06c-use-cases-patient.md) | 5 | A1, A2 | Required | Pending gate | - |

**Optional, later:** mirror the diagrams to a Miro board for collaboration or presentation. Ask brd-unifier for it explicitly; the inline Mermaid stays authoritative.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->
