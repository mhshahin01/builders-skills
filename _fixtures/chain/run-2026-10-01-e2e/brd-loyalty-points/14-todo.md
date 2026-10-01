<!--
CHUNK: 14
TITLE: Product Manager To-Do
PROJECT: Loyalty Points
VERSION: 1.2
DEPENDS_ON: all BRD chunks (00 through 13); updated again after 15, 16, 17 are produced
PART OF: BRD - Loyalty Points
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

**Last updated:** 2026-10-01 | **BRD version:** 1.2 | **Steps complete:** 5 of 5

**Status values:** `Not started` / `In progress` / `Blocked` (by what) / `Pending gate` (steps 4 and 5, until steps 1-3 are complete; the two then run in parallel) / `Complete` (evidence mandatory). A `Complete` step goes back to `In progress` when its inputs change.

---

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | Complete | TD-01 to TD-24 Resolved and applied in BRD v1.1; OI-01 to OI-09 applied; no marker in 00-12 (checked by brd-unifier, 2026-10-01) | Step 2 |
| 2 | Run a consistency check across all BRD chunks | Complete | Run 6, 2026-10-01, after the v1.2 diagrams (C1-C9): 0 new findings on 00-13. C10 on chunks 14-16: Runs 7-13. CF-01 to CF-36 dispositioned | Step 3 |
| 3 | Finalise requirements with the grill-me skill | Complete | The product manager confirmed the session on 2026-10-01 and handed back decisions 1-16 (test fixture); all applied as TD-01 to TD-16 | Steps 4 and 5 |
| 4 | Generate mockups in Figma | Complete | The product manager confirmed the review, approval, and a passed play-through of LP-01 and LP-02 on 2026-10-01 (test-fixture confirmation); Figma links in UC-01 and UC-02 UI/UX | The delivery gate: chunks 15, 16, 17 (with step 5) |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Complete | Figure 1 in 05 and Figure 2 (UC-02) in 06a, BRD v1.2; UC-01 skip recorded; blocks checked by reading; Run 6 (C9 included) clean, 2026-10-01 | The delivery gate: chunks 15, 16, 17 (with step 4) |

## Delivery gate

> Chunks 15, 16, and 17 are **locked** until every row below says `Met`. `Deferred` items do not count as closed. There is no override.

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete: every to-do item `Resolved`; no open or deferred item in chunk 13; no clarification marker left in chunks 00-12 | Met | None (verified in the files, 2026-10-01) |
| G2 | Step 2 complete: check rerun after the last BRD change; every finding has a disposition and none is still waiting on a decision | Met | None (Run 6 follows the last content change, the v1.2 diagrams) |
| G3 | Step 3 complete: grill-me session confirmed; decisions applied | Met | None |
| G4 | Step 4 complete: every mockup approved; review and play-through confirmed; Figma links in the use cases | Met | None (LP-01 and LP-02 Approved; review and play-through confirmed by the product manager on 2026-10-01; links in UC-01 and UC-02 UI/UX) |
| G5 | Step 5 complete: use-case diagrams and flowcharts added; consistency check rerun | Met | None (Figures 1 and 2 added; UC-01 skip recorded; Run 6 rerun after them) |

**Gate:** Open (verified in the files on 2026-10-01, before chunk 15 and again before chunk 16) | **Next action:** Chunk 17 (presentation and video brief) can be written on request. Record each task's delivery status in chunk 15 and each test result in chunk 16 as delivery runs.

## Downstream outputs

<!-- State: Locked (gate shut, never generated) / Up to date ([date], BRD v[X.X]) / Provisional (TD-NN: a gap found while writing it) / Stale (a change listed in delivery-chunks.md § Refresh triggers came after it was written; locked until the gate is open again). -->

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | [15-implementation.md](./15-implementation.md) | Up to date (2026-10-01, BRD v1.2) | - |
| UAT/BAT test cases | [16-uat-bat-test-cases.md](./16-uat-bat-test-cases.md) | Up to date (2026-10-01, BRD v1.2) | - |
| Presentation and video brief | 17-for-ppt.md | Locked (not written) | A request only: the gate is open, and chunks 15 and 16 raised no new open item |

---

## Step 1 - Resolve open items and clarifications

| | |
|---|---|
| **Status** | Complete |
| **Required inputs** | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md); every inline `[NEEDS CLARIFICATION: ...]` marker in chunks 00-12; Assumptions and Dependencies in [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md); the step 3 decisions; the step 2 findings |
| **Expected output** | Every row below is `Resolved`: the decision is applied to the BRD, and the Resolution Log and Changes Log are updated |
| **Completion criteria** | Every row is `Resolved`, each pointing at where the decision was applied. No open or deferred item is left in chunk 13. No clarification marker is left in chunks 00-12. A `Deferred` row stays visible and keeps this step, and the delivery gate, open. |
| **Evidence** | Checked by brd-unifier on 2026-10-01. TD-01 to TD-24 are Resolved, each applied in BRD v1.1 (Changes Log v1.1, [decision-log.md](./decision-log.md)). OI-01 to OI-09 are applied (chunk 13 Resolution Log). Chunk 13 has no open or deferred item, and chunks 00-12 hold no clarification marker. |

### Open items register

<!-- One row per unresolved question, assumption needing validation, or pending decision. Sorted P1 first. The row links to the source; it does not copy the source's options or recommended answer. Every priority blocks the delivery gate. "Resolved" means a decision is recorded and applied to the BRD. TD-01 to TD-16 come from the grill-me session (decisions with no open item); TD-17 to TD-24 carry the open items raised by the consistency check. -->

| ID | Priority | Kind | Source (chunk / identifier) | Decision or clarification needed | Blocks | Owner | Status |
|----|----------|------|-----------------------------|----------------------------------|--------|-------|--------|
| TD-01 | P1 | Open question | [06a / UC-01, UC-02 Preconditions](./06a-use-cases-member.md) (grill-me Q2) | Who delivers the member sign-in that both use cases need? | UC-01, UC-02 Main Flow; TASK-02, TASK-03, TASK-04; TC-ACC-01..04 | Product manager | Resolved (04 Out of Scope; 02 Dependencies; UC-01, UC-02 Preconditions; Changes Log v1.1) |
| TD-02 | P1 | Open question | [06a / UC-01 A1, UC-02 Main Flow](./06a-use-cases-member.md) (grill-me Q8) | Add the missing acceptance criteria and make UC-01 A1 precise | UC-01 A1; UC-02 Main Flow; TASK-03, TASK-04; TC-BAL-02, TC-BAL-03, TC-HIS-01 | Product manager | Resolved (UC-01 A1, AC-2; UC-02 AC-2; Changes Log v1.1) |
| TD-03 | P1 | Open question | [06a / UC-02 step 4](./06a-use-cases-member.md#uc-02-view-points-history), [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement) (grill-me Q15) | Which date does a movement carry, and what does step 4 show? | UC-01 step 2; UC-02 steps 2 and 4; TASK-01, TASK-03, TASK-04; TC-BAL-01, TC-BAL-03, TC-HIS-02, TC-HIS-04, TC-PTS-05 | Product manager | Resolved (03 Movement date; UC-02 step 4, AC-3, AC-4; 08 POS Records; Changes Log v1.1) |
| TD-04 | P2 | Open question | [04 / In Scope](./04-scope-and-personas.md#in-scope) (grill-me Q1) | Is earning points on branch purchases in scope? | 04 In Scope; 08 POS Records; TASK-01, TASK-04; TC-PTS-01 | Product manager | Resolved (04 In Scope; Changes Log v1.1) |
| TD-05 | P2 | Open question | [08 / Integrations](./08-integrations.md#integrations) (grill-me Q3) | Is the Refunds Portal an integration? | UC-02 BR-1; 08; TASK-01, TASK-04; TC-PTS-02..04, TC-NFR-03..04 | Product manager | Resolved (08; Changes Log v1.1) |
| TD-06 | P2 | Open question | [06a / UC-02 BR-1](./06a-use-cases-member.md#uc-02-view-points-history) vs [10 / NFR-02](./10-nfrs.md#non-functional-requirements) (grill-me Q4) | Which refund event takes points back: paid or approved? | UC-02 A1, BR-1, AC-1; NFR-02; TASK-01, TASK-04; TC-PTS-02, TC-HIS-03, TC-NFR-03 | Product manager | Resolved (UC-02 BR-1, AC-1; 03; Changes Log v1.1) |
| TD-07 | P2 | Open question | [02 / Glossary, Points](./02-glossary-assumptions-facts.md#glossary) (grill-me Q5) | Do cents earn points? | 03 earning rule; UC-02 step 2; TASK-01, TASK-04; TC-PTS-01, TC-HIS-02 | Product manager | Resolved (03 Earning; 02 Glossary; Changes Log v1.1) |
| TD-08 | P2 | Assumption to validate | [02 / Assumption 1](./02-glossary-assumptions-facts.md#assumptions) in v1.0 (grill-me Q6) | Confirm that every branch purchase by a member is known the same day | NFR-02; UC-01, UC-02 balance and history; TASK-01, TASK-04; TC-NFR-04 | Product manager | Resolved (02 Dependencies, POS Records; Changes Log v1.1) |
| TD-09 | P2 | Open question | [06a / UC-02 A1](./06a-use-cases-member.md#uc-02-view-points-history) (grill-me Q9) | Where does the flow go after A1? | UC-02 A1; UC-02 flowchart; TASK-01, TASK-04; TC-HIS-03, TC-HIS-04 | Product manager | Resolved (UC-02 A1; Changes Log v1.1) |
| TD-10 | P2 | Open question | [06a / UC-01, UC-02 Alternate & Exception Flows](./06a-use-cases-member.md) (grill-me Q10) | What does the member see when points cannot be shown? | UC-01, UC-02 exception flows; TASK-03, TASK-04; TC-BAL-04, TC-HIS-06..07 | Product manager | Resolved (UC-01 E1, AC-3; UC-02 E1, AC-5; Changes Log v1.1) |
| TD-11 | P2 | Open question | [10 / NFR-01](./10-nfrs.md#non-functional-requirements) (grill-me Q12) | When is a balance complaint upheld? | NFR-01 measure; TASK-01, TASK-03, TASK-04; TC-NFR-02 | Product manager | Resolved (NFR-01; Changes Log v1.1) |
| TD-12 | P2 | Open question | [06a / UC-02 BR-1](./06a-use-cases-member.md#uc-02-view-points-history) (grill-me Q13) | How many points does a partial refund take back? | UC-02 A1, BR-3; TASK-01, TASK-04; TC-PTS-03..04, TC-PTS-06..07 | Product manager | Resolved (UC-02 BR-3, AC-6; Changes Log v1.1) |
| TD-13 | P2 | Open question | [10 / NFR-02](./10-nfrs.md#non-functional-requirements) (grill-me Q14) | When does the NFR-02 hour start if the refund is paid before the purchase is reported? | NFR-02 measure; TASK-01, TASK-04; TC-NFR-04 | Product manager | Resolved (NFR-02; Changes Log v1.1) |
| TD-14 | P2 | Open question | [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement) (grill-me Q16) | Do 0-point purchases or refunds create a movement? | UC-02 step 2; 03; TASK-01, TASK-04; TC-PTS-01, TC-PTS-04 | Product manager | Resolved (03 No 0-point movements; Changes Log v1.1) |
| TD-17 | P2 | Open question | [13 / OI-02](./13-open-items-and-clarifications.md) (CF-02) | Where does the NFR-02 hour start for a refund? | NFR-02; UC-02 AC-1, AC-6; TASK-01, TASK-04; TC-HIS-03, TC-PTS-03, TC-NFR-03..04 | Product manager | Resolved (OI-02 Accepted - applied: NFR-02, UC-02 AC-1, AC-6) |
| TD-18 | P2 | Open question | [13 / OI-03](./13-open-items-and-clarifications.md) (CF-03) | What happens to a paid refund reported before its purchase? | UC-02 BR-4; NFR-02; TASK-01, TASK-04; TC-NFR-04 | Product manager | Resolved (OI-03 Accepted - applied: UC-02 BR-4) |
| TD-19 | P2 | Open question | [13 / OI-04](./13-open-items-and-clarifications.md) (CF-04) | Which delays does NFR-01 allow, and how soon do earned points show? | NFR-01; NFR-03; TASK-01, TASK-03, TASK-04; TC-NFR-02, TC-NFR-04..05 | Product manager | Resolved (OI-04 Accepted - applied: NFR-01, NFR-03) |
| TD-20 | P2 | Open question | [13 / OI-05](./13-open-items-and-clarifications.md) (CF-06) | What does UC-02 show when there are no movements? | UC-02 A2, AC-8; TASK-04; TC-HIS-05 | Product manager | Resolved (OI-05 Accepted - applied: UC-02 A2, AC-8) |
| TD-21 | P2 | Open question | [13 / OI-06](./13-open-items-and-clarifications.md) (CF-08) | Are POS Records and the Refunds Portal supporting actors? | UC-01, UC-02 actor fields; use-case diagram (Figure 1) | Product manager | Resolved (OI-06 Accepted - applied: UC-01, UC-02 Supporting Actors) |
| TD-24 | P2 | Open question | [13 / OI-09](./13-open-items-and-clarifications.md) (CF-10) | Does a late POS Records report count against NFR-01? | NFR-01; TASK-01, TASK-03, TASK-04; TC-NFR-02 | Product manager | Resolved (OI-09 Accepted - applied: NFR-01) |
| TD-15 | P3 | Open question | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) (grill-me Q7) | Does "at any time" set an availability measure? | Objective 2; chunk 10 | Product manager | Resolved (confirmed as written; Changes Log v1.1) |
| TD-16 | P3 | Open question | [08 / POS Records](./08-integrations.md#integrations) (grill-me Q11) | Define POS in the Glossary | 02 Glossary | Product manager | Resolved (02 Glossary; Changes Log v1.1) |
| TD-22 | P3 | Open question | [13 / OI-07](./13-open-items-and-clarifications.md) (CF-05) | Define POS Records as a partner | 02 Glossary | Product manager | Resolved (OI-07 Accepted - applied: 02 Glossary) |
| TD-23 | P3 | Open question | [13 / OI-08](./13-open-items-and-clarifications.md) (CF-01) | What does the cover say while version 1.1 is not signed off? | 00 cover | Product manager | Resolved (OI-08 Accepted - applied: 00 cover) |

---

## Step 2 - Run a consistency check across all BRD chunks

| | |
|---|---|
| **Status** | Complete |
| **Required inputs** | All BRD chunks 00-13 (and 05 / 06* diagrams once step 5 has run; chunk 14 itself, and 15-17 once they exist, for check C10) |
| **Expected output** | Every finding recorded below with its affected chunks and identifiers, impact, and a disposition; confirmed corrections applied to every affected chunk; a recheck run recorded |
| **Completion criteria** | The latest check run is dated after the last change to chunks 00-13, and every finding has a documented disposition. Findings deferred for clarification remain visible as open items (TD / OI), which keeps step 1 open. Run 1, made at generation, leaves this step `In progress`. |
| **Evidence** | Run 6 by a cleared-context checker on 2026-10-01, after the last content change to 00-13 (the v1.2 diagrams): C1-C9 clean, 0 new findings. Runs 7-13 checked C10 on chunks 14-16 after chunks 15 and 16 were written; they changed only 14-16. CF-01 to CF-36 carry the dispositions below. |

**Checks performed:** C1 conflicting requirements, C2 terminology, C3 scope, C4 duplicated requirements, C5 missing requirements, C6 broken references, C7 use cases vs acceptance criteria, C8 derived views (Use Case Summary, matrix), C9 diagrams vs narrative (after step 5), C10 delivery chunks vs body (chunk 14 at every write; 15-17 once they exist).

### Check runs

| Run | Date | Trigger | Scope | Findings | Still open after run |
|-----|------|---------|-------|----------|----------------------|
| 1 | 2026-09-24 | Initial generation | 00-13 | 0 | 0 |
| 2 | 2026-10-01 | Grill-me decisions TD-01 to TD-16 applied (v1.1) | 00-13 | 8 (CF-01 to CF-08) | 0: CF-07 corrected; the other seven raised as OI-02 to OI-08, accepted and applied |
| 3 | 2026-10-01 | Recheck after the Run 2 dispositions | 00-13 | 3 (CF-09 to CF-11) | 0: CF-09 and CF-11 corrected; CF-10 raised as OI-09, accepted and applied |
| 4 | 2026-10-01 | Recheck after the Run 3 dispositions | 00-13 | 2 (CF-12, CF-13) | 0: both corrected |
| 5 | 2026-10-01 | Recheck after the Run 4 corrections | 00-13 | 0 | 0 |
| 6 | 2026-10-01 | To-do step 5: Figures 1 and 2 added (v1.2) | 00-13, C1-C9 | 0 | 0 |
| 7 | 2026-10-01 | Chunks 15 and 16 written | 14-16 against 00-13, C10 | 11 (CF-14 to CF-24) | 0: ten corrected in 14-16; CF-21 No change (product manager) |
| 8 | 2026-10-01 | Recheck after the Run 7 corrections | 14-16 against 00-13, C10 | 6 (CF-25 to CF-30) | 0: all six corrected in 14-16 |
| 9 | 2026-10-01 | Recheck after the Run 8 corrections | 14-16 against 00-13, C10 | 2 (CF-31, CF-32) | 0: both corrected in 15 and 16 |
| 10 | 2026-10-01 | Recheck after the Run 9 corrections (changed text only) | 14-16 against 00-13, C10 | 2 (CF-33, CF-34) | 0: both corrected in 14 and 15 |
| 11 | 2026-10-01 | Recheck after the Run 10 corrections (changed text only) | 14-16 against 00-13, C10 | 1 (CF-35) | 0: corrected in 14 |
| 12 | 2026-10-01 | Recheck after the Run 11 correction (changed text only) | 14 against 16, C10 | 1 (CF-36) | 0: corrected in 14 |
| 13 | 2026-10-01 | Recheck after the Run 12 correction (changed text only) | 14 against 16, C10 | 0 | 0 |

### Consistency findings

<!-- Disposition is one of: Corrected ([where], [date]) | Open item raised: OI-NN / TD-NN | Deferred for clarification: TD-NN | No change ([who], [why]). Business ambiguities are never resolved silently: they become open items. -->

| ID | Check | Affected chunks and identifiers | Finding | Impact | Recommended correction or decision needed | Disposition | Rechecked |
|----|-------|---------------------------------|---------|--------|-------------------------------------------|-------------|-----------|
| CF-01 | C1 | [00 / cover and Changes Log 1.1](./00-cover-and-changelog.md) | The cover read "Approved" and 2026-09-24, but version 1.1 had no approver | Readers and the SDD would take v1.1 as signed off | Decision needed: the cover status and date while v1.1 is not signed off | Open item raised: OI-08 / TD-23 (Accepted - applied) | Run 3 |
| CF-02 | C1 | [06a / UC-02 BR-1, AC-1, AC-6](./06a-use-cases-member.md#uc-02-view-points-history) vs [10 / NFR-02](./10-nfrs.md#non-functional-requirements) | BR-1 acts on the Refunds Portal's report; NFR-02 counted from the payment | NFR-02 could fail while the product follows BR-1; testers could not tell where the hour starts | Decision needed: where the NFR-02 hour starts | Open item raised: OI-02 / TD-17 (Accepted - applied) | Run 3 |
| CF-03 | C1 | [06a / UC-02 BR-1](./06a-use-cases-member.md#uc-02-view-points-history) vs [10 / NFR-02](./10-nfrs.md#non-functional-requirements) | NFR-02 accepts a paid refund before its purchase is reported, but no rule kept that refund | A build could drop the refund; the points would never be taken back | Decision needed: state the rule | Open item raised: OI-03 / TD-18 (Accepted - applied) | Run 3 |
| CF-04 | C1 | [10 / NFR-01, NFR-02](./10-nfrs.md#non-functional-requirements) vs [02 / Dependency "POS Records"](./02-glossary-assumptions-facts.md#dependencies) | NFR-01 counted every difference as a mismatch, ignoring the delays the BRD accepts; no target for earned points | NFR-01 could fail while the product meets NFR-02 and the dependency | Decision needed: allowed times and an earned-points target | Open item raised: OI-04 / TD-19 (Accepted - applied) | Run 3 |
| CF-05 | C2 | [02 / Glossary "POS Records"](./02-glossary-assumptions-facts.md#glossary) vs 02 Dependencies, 08, NFR-02 | The Glossary called POS Records a record; everywhere else it is a partner | The SDD could model it as data the product owns | Decision needed: the definition | Open item raised: OI-07 / TD-22 (Accepted - applied) | Run 3 |
| CF-06 | C5 | [06a / UC-02 step 2](./06a-use-cases-member.md#uc-02-view-points-history) vs UC-01 A1 | UC-02 had no flow or criterion for a member with no movements | Design would invent the empty state; testers could not check it | Decision needed: add UC-02 A2 and a criterion | Open item raised: OI-05 / TD-20 (Accepted - applied) | Run 3 |
| CF-07 | C7 | [06a / UC-02 E1, AC-5](./06a-use-cases-member.md#uc-02-view-points-history) | AC-5 covered E1 at step 2 only | The step 4 failure was untested | Recommendation: add a criterion for the step 4 branch | Corrected (06a / UC-02 AC-7, 2026-10-01; confirmed by TD-10) | Run 3 |
| CF-08 | C8 | [06a / UC-01, UC-02 Supporting Actors](./06a-use-cases-member.md) vs UC-02 BR-1, step 4, 08 | "Supporting Actors: None", although both use cases show what POS Records and the Refunds Portal report | Readers who take partners from the actor fields would miss POS Records | Decision needed: name the partners | Open item raised: OI-06 / TD-21 (Accepted - applied) | Run 3 |
| CF-09 | C1 | [01 / Executive Summary](./01-executive-summary-and-context.md) vs 06a / UC-02 BR-1, BR-3 | 01 kept "taken back when that purchase is refunded", the wording TD-06 replaced | The first text a reader sees stated another trigger | Recommendation: point 01 to UC-02 BR-1, BR-3, and BR-4 | Corrected (01 / Executive Summary, 2026-10-01; rule confirmed by TD-06 and TD-12) | Run 4 |
| CF-10 | C1 | [10 / NFR-01](./10-nfrs.md#non-functional-requirements) vs 02 / Dependency "POS Records" | NFR-01 gave an unreported purchase no limit, so it had two readings | Testers and the complaint team could judge the same complaint differently | Decision needed: whether a late POS Records report counts | Open item raised: OI-09 / TD-24 (Accepted - applied) | Run 4 |
| CF-11 | C6 | [03 / Points movement, Taking back](./03-definitions-and-domain-concepts.md#points-movement) vs 06a / UC-02 BR-4 | 03 cited UC-02 BR-1 and BR-3 but not BR-4 | Readers who use 03 as the index of refund rules would miss BR-4 | Correct the cross-reference | Corrected (03 / Points movement, 2026-10-01; mechanical: cross-reference) | Run 4 |
| CF-12 | C6 | [00 / Changes Log 1.1, Reviewed By](./00-cover-and-changelog.md) | The cell said "OI-02 to OI-08", but OI-09 was also accepted | The log would miss OI-09 from the product manager's review | Correct the count | Corrected (00 / Changes Log 1.1, 2026-10-01; mechanical: wrong count, the counted items win) | Run 5 |
| CF-13 | C1 | [04 / In Scope](./04-scope-and-personas.md#in-scope) bullet 3; 13 / Resolution Log, OI-01 row | 04 kept "when a purchase is refunded", the wording TD-06 replaced | An SDD reader taking scope from 04 could pick the wrong trigger | Recommendation: reword 04; keep the dated OI-01 row | Corrected (04 / In Scope, 2026-10-01; rule confirmed by TD-06). The OI-01 row: No change (skill, a dated record of what was applied on 2026-09-24) | Run 5 |
| CF-14 | C10 | [16 / TC-NFR-01](./16-uat-bat-test-cases.md) | Needs held TASK-04 (wave 2), which Related Task did not name, so TASK-01's acceptance waited on a later wave | TASK-04 had an unrecorded required case | Name TASK-04 in Related Task; update Task acceptance | Corrected (16 / TC-NFR-01, Task acceptance, 2026-10-01; mechanical: Readiness and acceptance rule) | Run 8 |
| CF-15 | C10 | [16 / TC-PTS-01, TC-PTS-05, TC-NFR-01; Traceability Matrix](./16-uat-bat-test-cases.md) | These cases named no use case, although they check UC-02 and UC-01 screens; the UC rows of the matrix did not match | A trace from UC-02 missed the earning and date cases | Add UC-01 / UC-02 step 2 to Related UC; rebuild the matrix rows from Related UC | Corrected (16, 2026-10-01; mechanical: every case traces to a use case or NFR) | Run 8 |
| CF-16 | C10 | [15 / TASK-03, TASK-04 Completion criteria](./15-implementation.md) | Shared rules checked on LP-01 and LP-02 (sign-in, 03 rules, BR-1, BR-3, BR-4, NFR-01 to NFR-03) were missing from the screens' own task criteria | Delivery teams could not see that their acceptance depends on these cases | Carry each shared rule in the criteria of the task whose screen shows it | Corrected (15 / TASK-03, TASK-04, 2026-10-01; mechanical: a shared rule is checked where it shows) | Run 8 |
| CF-17 | C10 | [15 / TASK-01](./15-implementation.md) criterion UC-02 AC-1; [16 / TC-HIS-03](./16-uat-bat-test-cases.md) | TASK-01 lists AC-1, but the only AC-1 case named TASK-04 alone | TASK-01 could be accepted without its AC-1 criterion tested | Name TASK-01 in TC-HIS-03's Related Task and Needs | Corrected (16 / TC-HIS-03, Task acceptance, 2026-10-01; mechanical) | Run 8 |
| CF-18 | C10 | [16 / TC-BAL-03, TC-HIS-03, TC-HIS-04, TC-PTS-01 to 05, TC-UIX-02, TC-NFR-03, TC-NFR-05](./16-uat-bat-test-cases.md) | Examples checked right after a purchase or refund, inside the hour NFR-02 and NFR-03 allow; two NFR cases had a 30-minute check with no expected result | False passes or failures | Wait 1 hour after the reports; check at the hour | Corrected (16, 2026-10-01; mechanical: 10 / NFR-01 to NFR-03) | Run 8 |
| CF-19 | C10 | [16 / UC-02 BR-3 boundary](./16-uat-bat-test-cases.md) | No "at" case for a whole-euro part refund, and no "above" case for the cap | The at / below / above rule was incomplete | Add TC-PTS-06 (30.00 EUR, at) and TC-PTS-07 (refunds above the purchase, P8) | Corrected (16 / TC-PTS-06, TC-PTS-07, P8, 2026-10-01; mechanical: 06a / UC-02 BR-3) | Run 8 |
| CF-20 | C10 | [16 / Exit criteria](./16-uat-bat-test-cases.md) | The recommended critical-path sections left out section 6, which holds the only BR-4 case, although the stated reason covers it | BR-4 could be signed off through a deviation | Recommend all six sections | Corrected (16 / Exit criteria, 2026-10-01; mechanical: Exit criteria rule) | Run 8 |
| CF-21 | C10 | 14 / Mockup coverage; 15 and 16 references | The mockup rows use LP-01 and LP-02, not MK-NN | No MK-NN exists for 15 and 16 to cite | Recommendation: MK-01, MK-02 with LP-01, LP-02 as screen IDs | No change (product manager: keep the mockup IDs LP-01 and LP-02 as they are) | Run 8 |
| CF-22 | C10 | 14 / Step 4 mockup brief | The brief said "BRD v1.1" while the BRD is v1.2, under a "run it yourself" label | Rerunning the brief would point at an old version | Label it as the brief behind the 2026-10-01 review | Corrected (14 / Step 4, 2026-10-01; mechanical) | Run 8 |
| CF-23 | C10 | 14 / Open items register, Blocks | TD-03, TD-06, and TD-17 left out tasks and cases that 15 and 16 tie to them | Blocks was incomplete | Rebuild every TASK list in Blocks from the cases' Related Task | Corrected (14 / register, 2026-10-01; mechanical: 16 Related Task) | Run 8 |
| CF-24 | C10 | [16 / TC names and section headings](./16-uat-bat-test-cases.md) | "(boundary)" at the end of five TC names read as a scope tag; three headings held more than use cases, screen IDs, and NFRs | Undefined tags; headings drift from the format | "- boundary" in names; headings with use cases, screen IDs, and NFRs only | Corrected (16, 2026-10-01; mechanical: chunks/16 skeleton) | Run 8 |
| CF-25 | C10 | [16 / TC-BAL-03, TC-HIS-03, TC-HIS-04, TC-PTS-03 to 07, TC-UIX-02](./16-uat-bat-test-cases.md) | The examples waited 1 hour after the refund report only; NFR-02 counts from POS Records' report when it is later | A correct product could fail a check made inside the allowed hour | State that POS Records reports the purchase first | Corrected (16, 2026-10-01; mechanical: 10 / NFR-02) | Run 9 |
| CF-26 | C10 | [16 / P8, TC-PTS-07](./16-uat-bat-test-cases.md) | P8 let TC-PTS-07 be Blocked when the setup could not report refunds above the purchase amount, but TC-PTS-07 is a required case | TASK-01 and TASK-04 could never be Accepted | Make P8 a setup the delivery team stages, like P5 and P6 | Corrected (16 / P8, 2026-10-01; the cap is a stated rule, UC-02 BR-3, so no body fact is needed) | Run 9 |
| CF-27 | C10 | [15 / TASK-03, TASK-04 NFR-01 criteria](./15-implementation.md) | The NFR-01 criteria did not name the UAT/BAT period measure that TC-NFR-02 checks | Teams could not see that acceptance waits for the period's end | Name the period measure in both criteria | Corrected (15 / TASK-03, TASK-04, 2026-10-01; mechanical: a shared rule is checked where it shows) | Run 9 |
| CF-28 | C10 | [16 / Exit criteria, TC-NFR-05, Traceability Matrix](./16-uat-bat-test-cases.md) | The exit criteria said every case belongs to UC-01 or UC-02, but TC-NFR-02 and TC-NFR-05 named no use case | The reason contradicted the Related UC column | Reword the reason; add UC-02 (step 2) to TC-NFR-05 and the UC-02 matrix row | Corrected (16, 2026-10-01; mechanical: 16 Related UC column) | Run 9 |
| CF-29 | C10 | [14 / Open items register, Blocks of TD-02, TD-03, TD-05, TD-06, TD-07](./14-todo.md) | The case lists left out cases whose Related UC cites a flow, step, rule, or criterion the row's decision set, or a partner row it added | Blocks under-reported the cases to refresh | TD-02 and TD-03: add TC-BAL-03; TD-05: add TC-NFR-03..04; TD-06: add TC-NFR-03; TD-07: add TC-HIS-02. Each is a case whose Related UC cites a flow, step, rule, or criterion the decision set, or a partner row it added | Corrected (14 / register, 2026-10-01; mechanical: 16 Related UC) | Run 9 |
| CF-30 | C10 | [14 / Checklist row 2, Step 2 Evidence, Check runs](./14-todo.md) | The step 2 evidence stopped at Run 6, and "Run 8" was not recorded | The evidence did not show every current finding dispositioned | Name Runs 7 and 8 and CF-14 to CF-30; add the Run 8 row | Corrected (14, 2026-10-01; mechanical) | Run 9 |
| CF-31 | C10 | [15 / TASK-01 Expected deliverables and criterion](./15-implementation.md) | The deliverables left out how many points a part refund takes back and that a 0-point refund creates no movement | The delivery team could confirm Ready for test without them | Name both in deliverable 2 and in the criterion label | Corrected (15 / TASK-01, 2026-10-01; mechanical: 03 No 0-point movements, UC-02 BR-3) | Run 10 |
| CF-32 | C10 | [16 / TC-PTS-07](./16-uat-bat-test-cases.md) | "The movements show -6 and then -4 points" read as screen order, while the history lists newest first | A correct screen could be judged Failed | Name the amounts per refund, as TC-PTS-04 does | Corrected (16 / TC-PTS-07, 2026-10-01; mechanical: UC-02 step 2, BR-3) | Run 10 |
| CF-33 | C10 | [15 / TASK-01 criterion "03 / No 0-point movements"](./15-implementation.md) | The label said a 0.90 EUR refund creates no movement without a condition, while UC-02 BR-3 takes back all remaining points when a refund completes the whole purchase (TC-PTS-04) | The criterion contradicted its own task's required case | Limit it to a refund that leaves part of the purchase unrefunded | Corrected (15 / TASK-01, 2026-10-01; mechanical: the body wins, 03 and UC-02 BR-3) | Run 11 |
| CF-34 | C10 | [14 / CF-29 record](./14-todo.md) | The CF-29 correction text did not say which case belongs to which register row, and its rule was worded too widely | The CF-29 record could not be checked row by row | Name the row for each case; narrow the rule; leave the register as it is | Corrected (14 / CF-29 record, 2026-10-01; mechanical) | Run 11 |
| CF-35 | C10 | [14 / CF-29 record](./14-todo.md) | The narrowed rule in the CF-29 record still did not match the register row by row: it named no flow (TD-02 links through UC-01 A1) and read too widely for TD-03 | The CF-29 record could not be confirmed row by row | Use one criterion in both cells: a flow, step, rule, or criterion the decision set, or a partner row it added; register unchanged | Corrected (14 / CF-29 record, 2026-10-01; mechanical: 16 Related UC, register Resolved cells) | Run 12 |
| CF-36 | C10 | [14 / Open items register, TD-09 Blocks](./14-todo.md) | TD-09 set UC-02 A1, and TC-HIS-03 cites UC-02 A1, but TD-09's Blocks listed only TC-HIS-04 | Blocks under-reported a case to refresh if UC-02 A1 changes | Add TC-HIS-03, and TASK-01 with it | Corrected (14 / TD-09 Blocks, 2026-10-01; mechanical: 16 Related UC, the CF-29 criterion) | Run 13 |

---

## Step 3 - Finalise requirements with the grill-me skill

| | |
|---|---|
| **Status** | Complete |
| **Required inputs** | Open rows of the register above (P1 first); unresolved consistency findings; the requirements listed below |
| **Expected output** | A decision list from the session; confirmed decisions applied to the affected BRD chunks; consistency check rerun |
| **Completion criteria** | The product manager confirms the session took place and hands back the decision list; every confirmed decision is applied and logged; the rerun of step 2 leaves no new undispositioned finding. New questions reopen steps 1-2. |
| **Evidence** | The product manager confirmed the session on 2026-10-01 and handed back decisions 1-16. Test fixture: the session ran non-interactively, and the product manager answered every question with the interviewer's recommended answer. All 16 decisions are applied as TD-01 to TD-16 (BRD v1.1; [decision-log.md](./decision-log.md)). The step 2 reruns (Runs 2-5) end with no undispositioned finding. |

**Take into the session**

| What | Items |
|------|-------|
| Open questions and pending decisions | None before the session: no to-do rows, and chunk 13 had no open item |
| Unresolved consistency findings | None: Run 1 (2026-09-24) had 0 findings |
| Requirements to stress-test even though nothing is flagged | UC-01 (Business Objective 2) and UC-02 (Business Objective 1); UC-01 AC-1 (120 points) and UC-02 AC-1 (-50 points); NFR-01 (zero upheld balance complaints per month) and NFR-02 (within 1 hour of the refund being paid); 02 Assumption 1 (every branch purchase is known the same day) |

**Ready-to-use handoff prompt** (the prompt used for the 2026-10-01 session):

```text
/grill-me Finalise the requirements of the Loyalty Points BRD v1.0 in ./brd-loyalty-points/.
Read loyalty-points-brd-master.md first, then 14-todo.md.
Grill me in this order:
1. Open questions and pending decisions: none open (no TD rows; no open item in chunk 13).
2. Unresolved consistency findings: none (Run 1, 2026-09-24, 0 findings).
3. Requirements to stress-test: UC-01 (Business Objective 2) and UC-02 (Business Objective 1); UC-01 AC-1 (120 points) and UC-02 AC-1 (-50 points); NFR-01 (zero balance complaints upheld per month) and NFR-02 (within 1 hour of the refund being paid); 02 Assumption 1 (every branch purchase is known the same day).
For every decision I confirm, name the chunk and section it changes.
Do not edit any file during the session. End with a numbered decision list I can hand back to brd-unifier.
```

**After the session:** the decision list was handed to brd-unifier. Confirmed decisions are applied to the affected chunks (status, Changes Log, decision log), and step 2 was rerun. Chunks 15-17 still wait for the delivery gate.

---

## Step 4 - Generate mockups in Figma

| | |
|---|---|
| **Status** | Complete |
| **Gate** | Starts only after steps 1-3 are `Complete` with evidence (conditions G1-G3 above, verified in the files). Runs in parallel with step 5; neither waits for the other. The product manager's confirmation is the evidence for step 3. No override. |
| **Required inputs** | Finalised use cases ([06a](./06a-use-cases-member.md)), the matrix ([07](./07-users-use-cases-matrix.md)), UI/UX Expectations ([11](./11-summary-and-uiux.md)), decisions from steps 1-3. No UI/UX constitution found; chunk 11 used. |
| **Expected output** | A playable, responsive prototype covering the table below, reviewed against the criteria, with links recorded in each use case's UI/UX section |
| **Completion criteria** | Every row is `Approved`; the product manager confirms the review and a dated play-through; the Figma links are recorded in the use cases |
| **Evidence** | Test-fixture confirmation, 2026-10-01: the product manager reported that the prototypes LP-01 and LP-02, at the Figma links below, were reviewed and approved. Both are playable and delivered at mobile, tablet, and desktop. The play-through passed. brd-unifier checked G1-G3 in the files before recording this, and checked that the Figma links are in the UI/UX sections of UC-01 and UC-02. brd-unifier did not open the Figma files. |

**Standard to follow.** The project has no `ui-ux-global-constitution.md`, so chunk 11 is the visual standard and the rules below still apply. P1 rows: every Main Flow playable from the named start frame with no dead ends, every actor-facing control wired, frames for mobile, tablet and desktop. P2 rows: connected to neighbouring frames, desktop and mobile. States are variants, not duplicate frames.

**Ready-to-use mockup brief** (the brief behind the 2026-10-01 mockup review, written for BRD v1.1; v1.2 added only diagrams, so it still applies):

```text
No ui-ux-global-constitution.md was found in the project. Use the UI/UX Expectations in 11-summary-and-uiux.md as the visual baseline.
Use the Loyalty Points BRD v1.1 in ./brd-loyalty-points/ for the workflows, fields, permissions and business rules. Read loyalty-points-brd-master.md first, then 14-todo.md.
Create a playable Figma prototype covering every row of the Mockup coverage table below, for loyalty program members.
P1 rows: one named start frame, every Main Flow playable to its end with no dead ends, every actor-facing control wired, frames for mobile, tablet and desktop.
P2 rows: connected to neighbouring frames, desktop and mobile frames.
States are component variants. Variables and text styles map to the chunk 11 standards; chunk 11 names no colors. Label simulated data and demo actions.
Name the UC-NN on each frame. Do not add behaviour the BRD does not describe; list it instead.
Return the share link (view permission, opening on the start frame) and the list of frames per breakpoint.
```

### Mockup coverage

<!-- One row per screen or flow. This BRD uses the screen references LP-01 and LP-02 as its mockup IDs. -->

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| LP-01 | Points balance | UC-01 | UC-01 BR-1, A1, E1; 03 Movement date; 07 footnote (1); 11 whole numbers, phones and computers; TD-02, TD-10 | Default (balance and last-movement date); no movements yet (A1); cannot be shown (E1) | P1 | Y | Mobile, tablet, desktop | Approved | Confirmed by the product manager, 2026-10-01, pass (test-fixture confirmation) | https://www.figma.com/proto/LOYL01/loyalty-points?node-id=lp-01 |
| LP-02 | Points history | UC-02 | UC-02 BR-1 to BR-4, steps 3-4, A1, A2, E1; 03 Movement date and no 0-point movements; 07 footnote (1); 11 whole numbers, minus sign, phones and computers; TD-03, TD-09, TD-10, TD-12, TD-20 | Default list, newest first; points taken back (A1); no movements yet (A2); purchase details; refund details; cannot be shown at step 2 or step 4 (E1) | P1 | Y | Mobile, tablet, desktop | Approved | Confirmed by the product manager, 2026-10-01, pass (test-fixture confirmation) | https://www.figma.com/proto/LOYL01/loyalty-points?node-id=lp-02 |

**Expected coverage:** every use case with an actor-facing interaction has at least one screen; every observable Main Flow step is visible on a screen; every alternate or exception flow with a user-visible state has that state; role differences follow the matrix; global standards follow chunk 11; P1 rows are fully interactive and delivered at mobile, tablet and desktop; P2 rows are connected and delivered at desktop and mobile.

**Review criteria** (review result: LP-01 and LP-02 approved by the product manager on 2026-10-01, test-fixture confirmation; the boxes stay as the checklist, because the confirmation was given for the review as a whole)

- [ ] Each frame names the use case(s) it serves.
- [ ] Every flow can be walked end to end without a missing screen, and played in play mode from the named start frame with no dead ends.
- [ ] Every actor-facing control on a P1 screen is wired (navigation, overlays, drawers, dialogs, tabs, filters, form validation and error paths, destructive-action confirmation).
- [ ] Loading, empty, and error states are present where the use cases call for them, as variants rather than duplicate frames.
- [ ] Frames exist for every breakpoint the row's priority requires.
- [ ] What each role sees matches the Users & Use Cases Matrix.
- [ ] Global UI/UX standards in chunk 11 hold on every screen.
- [ ] Variables and text styles map to the chunk 11 standards; no raw hex in components.
- [ ] Simulated data and demo actions are labelled; nothing implies a change to a production system.
- [ ] Contrast, focus order and keyboard order are annotated on key frames.
- [ ] The share link has view permission and opens on the start frame.
- [ ] No mockup shows behaviour the BRD does not describe (if one does, add a TD row; do not absorb it).

---

## Step 5 - Update the use-case chunks with use-case diagrams and flowcharts

| | |
|---|---|
| **Status** | Complete |
| **Gate** | Starts only after steps 1-3 are `Complete` with evidence (conditions G1-G3 above, verified in the files). Runs in parallel with step 4; neither waits for the other. The product manager's confirmation is the evidence for step 3. No override. |
| **Required inputs** | Finalised requirements and use-case narratives; this step's tracking tables |
| **Expected output** | Use-case diagrams added to [05-user-journeys-overview.md](./05-user-journeys-overview.md); a flowchart added to every qualifying use case in chunks 06*; consistency check rerun. Completing this step opens the delivery gate for chunks 15, 16, and 17. |
| **Completion criteria** | Chunk 05 contains the applicable use-case diagrams; every qualifying 06* use case has its flowchart and every other use case has a recorded skip reason; all Mermaid blocks parse; the updated chunks pass the consistency check |
| **Evidence** | Executed by brd-unifier on 2026-10-01 after checking G1-G3 in the files. Figure 1 is in [05 / Use Case Diagrams](./05-user-journeys-overview.md#use-case-diagrams); Figure 2 is in [06a / UC-02 Flowchart](./06a-use-cases-member.md#flowchart). The UC-01 skip is recorded below. Both blocks were checked line by line against the Mermaid syntax rules (no renderer run). Each has a Summary line and a Figures index row in chunk 00. Consistency check Run 6 (C1-C9) found no issue. BRD v1.2. |

The diagrams are updates to chunks 05 and 06*. This file only tracks them. Gaps found while drawing are recorded in the register above and resolved before the affected diagram is finalised; behaviour is never invented to complete a diagram.

### Use-case diagrams (chunk 05)

| Diagram | Actors | Use cases | Relationships documented in the narratives | Status | Figure |
|---------|--------|-----------|--------------------------------------------|--------|--------|
| Overview | Member; external: POS Records, Refunds Portal | UC-01, UC-02 | None (no use case includes or extends another) | Final | Figure 1 |

### Use-case flowcharts (chunks 06*)

<!-- Required: 3 or more Main Flow steps AND at least one decision point. Otherwise skipped with the reason. Status: Skipped / Pending gate / Not started (gate met, not drawn yet) / Drafted / Provisional (TD-NN) / Final. -->

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-member.md#uc-01-view-points-balance) | 2 | A1, E1 | Skip - fewer than 3 steps | Skipped | - |
| UC-02 | [06a](./06a-use-cases-member.md#uc-02-view-points-history) | 4 | A1, A2, E1 | Required | Final | Figure 2 |

**Optional, later:** mirror the diagrams to a Miro board for collaboration or presentation. Ask brd-unifier for it explicitly; the inline Mermaid stays authoritative.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->
