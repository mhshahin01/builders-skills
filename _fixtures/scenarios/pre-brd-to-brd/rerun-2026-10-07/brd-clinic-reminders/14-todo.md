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

**Last updated:** 2026-10-07 | **BRD version:** 1.0 | **Steps complete:** 1 of 5

This checklist records pending decisions. It is not evidence that an owner answered them. The 54 rows consolidate repeated source concerns; compound source questions stay together. Every inline marker is linked by its owning chunk. No source assumption has been validated.

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | Blocked by owner answers | OI-01 and OI-02 applied; TD-01 to TD-54 Open | Step 2 final sign-off |
| 2 | Run a consistency check across all BRD chunks | Complete | Runs 1 and 2 below; owner ambiguities dispositioned to TD | Step 3 after step 1 |
| 3 | Finalise requirements with the grill-me skill | Not started | Owner session not held | Steps 4 and 5 |
| 4 | Generate mockups in Figma | Pending gate | G1 and G3 fail; no mockups produced or approved | Delivery gate |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Pending gate | G1 and G3 fail; no gated diagrams drawn | Delivery gate |

## Delivery gate

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Every question and assumption resolved | Not met | All TD rows Open; inline owner markers remain |
| G2 | Latest consistency check follows final relevant edit; no undecided finding | Met | Run 2 after corrections; questions remain tracked in step 1 |
| G3 | Requirements session confirmed, decisions applied | Not met | No owner session or answers |
| G4 | All mockups approved with play-through | Not met | Pending gate |
| G5 | Use-case diagrams and flowcharts added and rechecked | Not met | Pending gate |

**Gate:** Shut | **Next action:** Founders and named owners answer P1 questions, beginning with build commitment and legal readiness. Clarify this significantly underdefined source before circulating a final BRD. Deferred rows would still block the gate.

## Downstream outputs

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | 15-implementation.md | Locked | G1-G5 |
| UAT/BAT test cases | 16-uat-bat-test-cases.md | Locked | Gate, then 15 |
| Presentation and video brief | 17-for-ppt.md | Locked | Gate, then 15 and 16 |

## Step 1 - Resolve open items and clarifications

**Status:** Blocked by owner answers. Inputs are [13](./13-open-items-and-clarifications.md), inline markers in 00-12 and pending assumptions/dependencies in [02](./02-glossary-assumptions-facts.md). Completion needs recorded owner answers applied at every affected home and no remaining marker. Source 24 market-only questions stay upstream because their figures are not BRD requirements. Legal, commercial and operating dependencies below remain Pending; this register does not certify them.

### Open items register

| ID | Priority | Kind | Source (chunk / identifier) | Decision or clarification needed | Blocks | Owner | Status |
|----|----------|------|-----------------------------|----------------------------------|--------|-------|--------|
| TD-01 | P1 | Owner clarification | [00](./00-cover-and-changelog.md) | Founders to name the BRD author; pre-BRD 02 names no product manager. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-02 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md) | Founders to decide whether and when to commit to the build after the No-Go; pre-BRD 24 OI-01 remains Open. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-03 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md) | Founders to confirm the build commitment and schedule; pre-BRD 24 OI-01 and OI-12. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-04 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md); [06b](./06b-use-cases-receptionist.md); [06c](./06c-use-cases-patient.md); [10](./10-nfrs.md) | Egyptian counsel and founders to settle licence grant timing and per-clinic licensing; pre-BRD 24 OI-05 remains Open. | Linked requirement, objective or acceptance outcome | Egyptian counsel and founders | Open |
| TD-05 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md); [09](./09-reporting-and-analytics.md) | Founders and pilot clinic owners to settle pilot design, baseline comparability and consent for data collection; pre-BRD 24 OI-07 remains Open. | Linked requirement, objective or acceptance outcome | Founders and pilot clinic owners | Open |
| TD-06 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [04](./04-scope-and-personas.md); [05](./05-user-journeys-overview.md); [06b](./06b-use-cases-receptionist.md); [06c](./06c-use-cases-patient.md) | Founders and clinic owners to decide waitlist demand and automatic versus manual-assist scope; pre-BRD 24 OI-11 remains Open. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-07 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md); [06a](./06a-use-cases-clinic-owner.md) | Founders to validate the planning price and tier mix behind this target; pre-BRD 24 OI-10 flags pre-BRD 15 O3 KR2 and pre-BRD 21 Pricing. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-08 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md) | Founders to confirm funding, founder pay and the budget basis before commitment; pre-BRD 24 OI-06 remains Open. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-09 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md) | Founders to validate the cost, price and margin assumptions; pre-BRD 24 OI-09 and OI-10. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-10 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [03](./03-definitions-and-domain-concepts.md); [04](./04-scope-and-personas.md); [05](./05-user-journeys-overview.md); [06b](./06b-use-cases-receptionist.md); [06c](./06c-use-cases-patient.md) | Founders and clinic owners to validate timed-slot admission and waitlist suitability; pre-BRD 24 OI-03 remains Open. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-11 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md); [06a](./06a-use-cases-clinic-owner.md); [08](./08-integrations.md) | Founders to validate messaging cost, pricing and payback assumptions before subscription rules are final; pre-BRD 24 OI-09 remains Open. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-12 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [04](./04-scope-and-personas.md); [05](./05-user-journeys-overview.md); [06a](./06a-use-cases-clinic-owner.md); [06b](./06b-use-cases-receptionist.md); [06c](./06c-use-cases-patient.md); [09](./09-reporting-and-analytics.md) | Founders to re-estimate scope and build dates; waitlist and report reductions remain unaccepted upstream proposals; pre-BRD 24 OI-12 remains Open. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-13 | P1 | Owner clarification | [01](./01-executive-summary-and-context.md); [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md); [06a](./06a-use-cases-clinic-owner.md) | Founders to reconcile the source SMS charging conflict; linked figure and citation corrections remain upstream; pre-BRD 24 OI-16 remains Open. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-14 | P1 | Owner clarification | [02](./02-glossary-assumptions-facts.md) | Egyptian counsel to confirm licence type, clinic licensing, record counting, fee tier, portal status, written consent, health-data classification, waitlist marketing treatment, residency, cross-border treatment and medical-ethics restrictions; pre-BRD 08 Legal. | Linked requirement, objective or acceptance outcome | Egyptian counsel | Open |
| TD-15 | P1 | Owner clarification | [02](./02-glossary-assumptions-facts.md) | Founders to appoint the product manager and DPO and confirm their responsibilities; pre-BRD 02 and 11 leave those appointments open. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-16 | P1 | Owner clarification | [02](./02-glossary-assumptions-facts.md); [04](./04-scope-and-personas.md); [06b](./06b-use-cases-receptionist.md); [06c](./06c-use-cases-patient.md); [08](./08-integrations.md); [12](./12-appendix-and-wishlist.md) | SDD owner and founders to carry pre-BRD 24 OI-15 sender model and counsel-dependent residency from pre-BRD 08 into the technical design; no option is selected by this transform. | Linked requirement, objective or acceptance outcome | SDD owner and founders | Open |
| TD-17 | P1 | Owner clarification | [02](./02-glossary-assumptions-facts.md) | Founders to identify the contracted SMS aggregator and confirm registration evidence; pre-BRD 01 and 15. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-18 | P1 | Owner clarification | [02](./02-glossary-assumptions-facts.md) | Founders to name the payment provider and contractual payment outcomes; pre-BRD 21 Q2-2027. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-19 | P1 | Owner clarification | [02](./02-glossary-assumptions-facts.md) | Founders to classify each dependency milestone as Build of the affected UC, BAT sign-off or go-live; the source states operating prerequisites without this delivery distinction. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-20 | P1 | Owner clarification | [03](./03-definitions-and-domain-concepts.md) | Founders and clinic owners to confirm staff access boundaries, shared-family-phone identity and guardian authority across clinics; pre-BRD 01 and 04 describe roles but not the full access rules. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-21 | P1 | Owner clarification | [04](./04-scope-and-personas.md) | Founders to assign roadmap phases to configurable timing, per-message status and staff audit; pre-BRD 14 makes them Should but pre-BRD 21 assigns no phase. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-22 | P1 | Owner clarification | [06a](./06a-use-cases-clinic-owner.md) | Founders to define how accounts are provisioned, sign-in failures are shown and lost access is recovered; pre-BRD 01 states logins but no access lifecycle. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-23 | P1 | Owner clarification | [06a](./06a-use-cases-clinic-owner.md) | Founders to confirm account setup, staff changes and the exact permissions of each login; pre-BRD 01 and 14. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-24 | P1 | Owner clarification | [06a](./06a-use-cases-clinic-owner.md) | Founders and clinic owners to define missing-attendance-data and undelivered-report handling; pre-BRD 01 and 04. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-25 | P1 | Owner clarification | [06a](./06a-use-cases-clinic-owner.md) | Founders to define failed, late, duplicate and uncertain subscription payments and their effect on clinic access; pre-BRD 21 supplies no failure rule. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-26 | P1 | Owner clarification | [06a](./06a-use-cases-clinic-owner.md) | Founders to confirm subscription prices, included messages, annual terms, top-ups, referral credits and the inconsistent SMS charging rule; pre-BRD 21 and pre-BRD 24 OI-09, OI-10 and OI-16. No price is approved here. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-27 | P1 | Owner clarification | [06a](./06a-use-cases-clinic-owner.md) | Founders to define the observable successful-payment result and subscription activation; pre-BRD 14 and 21. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-28 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Egyptian counsel and founders to define the treatment of absent, disputed or insufficient consent, including legacy imports and guardian evidence; pre-BRD 08 Legal. | Linked requirement, objective or acceptance outcome | Egyptian counsel and founders | Open |
| TD-29 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders and clinic owners to specify required fields, duplicate/import errors, overlapping bookings, edits and cancellation by staff; pre-BRD 01 and 14 do not define these outcomes. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-30 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders to set the non-delivery waiting period and treatment of a late WhatsApp delivery; pre-BRD 01 and 14. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-31 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders and clinic owners to set visit-day timing and eligibility after a reply; pre-BRD 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-32 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders and clinic owners to define what reception and the patient see when both channels fail; pre-BRD 01 and 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-33 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders and clinic owners to identify who changes timing and the allowed values; pre-BRD 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-34 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders and clinic owners to define waitlist eligibility, ordering, offer expiry, no-response progression and what happens when no patient takes the slot; pre-BRD 01 and 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-35 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders to confirm automatic versus manual-assist waitlist behaviour; pre-BRD 24 OI-11 and OI-12 remain Open against pre-BRD 14. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-36 | P1 | Owner clarification | [06b](./06b-use-cases-receptionist.md) | Founders and clinic owners to specify status correction and actual-attendance capture used by the weekly no-show report; pre-BRD 04, 13 and 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-37 | P1 | Owner clarification | [06c](./06c-use-cases-patient.md) | Founders and clinic owners to define response cut-offs, conflicting replies, changed bookings and a link used by the wrong person; pre-BRD 01 and 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-38 | P1 | Owner clarification | [06c](./06c-use-cases-patient.md) | Founders and clinic owners to define the losing or late patient's outcome and concurrent acceptance treatment; pre-BRD 01 and 14 state first acceptance only. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-39 | P1 | Owner clarification | [06c](./06c-use-cases-patient.md) | Founders and clinic owners to specify whether the patient's existing later booking is retained or cancelled after accepting an earlier slot; pre-BRD 01 and 04. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-40 | P1 | Owner clarification | [06c](./06c-use-cases-patient.md) | Founders and Egyptian counsel to define opt-out identity, shared phones, cross-clinic scope and an SMS recipient's opt-out route; pre-BRD 04 says a reply stops all messages, while pre-BRD 08 says two-way SMS is unavailable. | Linked requirement, objective or acceptance outcome | Founders and Egyptian counsel | Open |
| TD-41 | P1 | Owner clarification | [06c](./06c-use-cases-patient.md) | Founders and counsel to confirm the accepted Arabic opt-out wording and treatment of pending messages; pre-BRD 06 consent ledger and 08. | Linked requirement, objective or acceptance outcome | Founders and counsel | Open |
| TD-42 | P2 | Owner clarification | [09](./09-reporting-and-analytics.md) | Founders and clinic owners to define reporting week, denominators, no-show and late-cancellation boundaries, attendance recording, zero-count handling and report-read evidence; pre-BRD 01, 04 and 15. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-43 | P2 | Owner clarification | [09](./09-reporting-and-analytics.md) | Founders to reconcile the proposed owner digest in pre-BRD 06 New features (late cancellations and estimated lost/recovered fees per doctor) with pre-BRD 14 Could report breakdowns; no extra report fields are adopted. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-44 | P2 | Owner clarification | [10](./10-nfrs.md) | Founders to define the delivery denominator, observation window and evidence for the pre-BRD 15 reminder-delivery target. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-45 | P2 | Owner clarification | [10](./10-nfrs.md) | Founders and clinic owners to set tolerable disruption, reminder lateness and recovery expectations; pre-BRD 15 calls the MVP reliable but supplies no business limit. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-46 | P2 | Owner clarification | [10](./10-nfrs.md) | Founders and counsel to define auditable actions, who can inspect them and required audit evidence; pre-BRD 14 states the log only. | Linked requirement, objective or acceptance outcome | Founders and counsel | Open |
| TD-47 | P2 | Owner clarification | [10](./10-nfrs.md) | Egyptian counsel and DPO to confirm retention, deletion, export and breach-notice treatment for appointments, consent and staff logs; pre-BRD 08 Legal. | Linked requirement, objective or acceptance outcome | Egyptian counsel and DPO | Open |
| TD-48 | P2 | Owner clarification | [10](./10-nfrs.md) | Founders and clinic owners to set task success and accessibility measures; pre-BRD 01, 04 and 14 provide no acceptance threshold. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-49 | P2 | Owner clarification | [10](./10-nfrs.md) | Founders to provide appointments per clinic, peak message volume and SMS fallback share; pre-BRD 03 Cost Structure leaves volume open. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-50 | P2 | Owner clarification | [11](./11-summary-and-uiux.md) | Founders to confirm the brand or key color. No project UI/UX constitution was supplied. | Linked requirement, objective or acceptance outcome | Founders | Open |
| TD-51 | P2 | Owner clarification | [11](./11-summary-and-uiux.md) | Founders and clinic owners to confirm sorting, paging and export behaviour; pre-BRD 04 and 14 do not state it. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-52 | P2 | Owner clarification | [11](./11-summary-and-uiux.md) | Founders and clinic owners to specify filters for the appointment and status views; pre-BRD 04 and 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-53 | P2 | Owner clarification | [11](./11-summary-and-uiux.md) | Founders and clinic owners to confirm supported screen sizes and responsive behaviour; no project constitution or breakpoints are supplied. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |
| TD-54 | P2 | Owner clarification | [11](./11-summary-and-uiux.md) | Founders and clinic owners to confirm date, time and number presentation; pre-BRD 01 and 14. | Linked requirement, objective or acceptance outcome | Founders and clinic owners | Open |

## Step 2 - Run a consistency check across all BRD chunks

**Status:** Complete. Codex re-read the body in a separate same-context pass. Checks: C1 conflicts, C2 terminology, C3 scope, C4 duplication, C5 coverage, C6 references, C7 flow/acceptance alignment, C8 summary/matrix, C9 existing diagrams, C10 delivery tracking. Gated UC diagrams and absent delivery outputs are not claimed as checked artifacts.

### Check runs

| Run | Date | Trigger | Scope | Findings | Still open after run |
|-----|------|---------|-------|----------|----------------------|
| 1 | 2026-10-07 | Post-review draft, OI-01/OI-02 applied | 00-13 | CF-01 and CF-02; owner ambiguities assigned to TD | Two corrections to recheck; all TD stay Open |
| 2 | 2026-10-07 | After CF-01/CF-02, wording, 00 indexes and 14/master creation | Changed 00, 02, 06b, 06c, 13, 14, master; links from all chunks | No new finding | No unresolved consistency finding; all TD stay Open |

**Checked content and order:** Draft -> same-context review -> OI corrections -> full check run 1 -> CF corrections and final navigation/register write -> disk reread and structural checks run 2. The scenario report records the final checker outputs. No third run or owner answer was fabricated.

### Consistency findings

| ID | Check | Affected chunks and identifiers | Finding | Impact | Recommended correction or decision needed | Disposition | Rechecked |
|----|-------|---------------------------------|---------|--------|-------------------------------------------|-------------|-----------|
| CF-01 | C7 | 06c UC-09 and UC-10 Preconditions | A shared visit-or-waitlist prerequisite did not distinguish reminder replies from slot offers | Could admit a reply without its corresponding appointment or offer | Use each source trigger and owning UC | Corrected in 06c, 2026-10-07; fixed policy accepts source-backed correction | Run 2 |
| CF-02 | C5 | 02 Dependencies | Product manager and DPO appointments were described as unresolved without a direct owner marker | Missing handoff could disappear from checklist | Add the source question with Founders as owner | Corrected in 02, 2026-10-07; recorded as an Open TD | Run 2 |

## Step 3 - Finalise requirements with the grill-me skill

**Status:** Not started. No product manager has confirmed a session. Bring all Open TD rows, BO-01 through BO-16, UC-01 through UC-11 acceptance criteria and NFR-01 through NFR-08. Completion needs the owner session, applied decisions and a consistency recheck.

**Ready-to-use handoff prompt:**

```text
Finalise the Clinic Reminders BRD v1.0. Read clinic-reminders-brd-master.md and 14-todo.md.
Ask the P1 owner questions first, then P2. Stress-test the objectives, use cases and quality measures.
Name the chunk each confirmed decision changes. Do not edit files during the session.
Return a numbered decision list for brd-unifier. Unanswered owner facts remain open.
```

## Step 4 - Generate mockups in Figma

**Status:** Pending gate. G1-G3 must all be Met. No project UI/UX constitution exists; [11](./11-summary-and-uiux.md) governs after its brand, breakpoints and behaviour questions are answered. No Figma link or approval is claimed. Every actor-facing UC needs a playable flow; confirmed branch, empty, error and role states must be covered. States are variants. Label simulated data, wire controls, check keyboard/focus/contrast, and return a view link opening at the named start frame. Never invent responsive breakpoints or permissions.

### Mockup coverage

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| MK-01 | Use the clinic account | UC-01 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-02 | Read the weekly no-show report | UC-02 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-03 | Pay the clinic subscription | UC-03 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-04 | Record patient consent | UC-04 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-05 | Maintain clinic appointments | UC-05 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-06 | Run and inspect appointment reminders | UC-06 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-07 | Maintain the waitlist | UC-07 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-08 | Review the day's appointment status | UC-08 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-09 | Confirm or cancel a visit | UC-09 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-10 | Take an offered slot | UC-10 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |
| MK-11 | Stop patient messages | UC-11 | Owning UC, 07 matrix, 11; related TD answers | Main and confirmed alternate/exception states | P1 | Pending | Pending owner answers | Pending gate | Not run | None |

## Step 5 - Update the use-case chunks with use-case diagrams and flowcharts

**Status:** Pending gate. Starts only when G1-G3 are Met, in parallel with step 4. Add persona use-case diagrams to 05 and branching UC flowcharts to 06a-06c. Derive every edge from confirmed narrative, number figures, add summaries and update 00. Recheck flow/diagram consistency. No Miro board is requested and no Mermaid renderer is available in this fixture.

| Use case | Chunk | Main Flow steps | Branching paths | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-clinic-owner.md) | 4 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-02 | [06a](./06a-use-cases-clinic-owner.md) | 4 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-03 | [06a](./06a-use-cases-clinic-owner.md) | 4 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-04 | [06b](./06b-use-cases-receptionist.md) | 5 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-05 | [06b](./06b-use-cases-receptionist.md) | 6 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-06 | [06b](./06b-use-cases-receptionist.md) | 5 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-07 | [06b](./06b-use-cases-receptionist.md) | 5 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-08 | [06b](./06b-use-cases-receptionist.md) | 4 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-09 | [06c](./06c-use-cases-patient.md) | 4 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-10 | [06c](./06c-use-cases-patient.md) | 4 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |
| UC-11 | [06c](./06c-use-cases-patient.md) | 3 | See Alternate & Exception Flows; unresolved outcomes stay TD | Required after clarification | Pending gate | None |


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: none (15 locked) -->
