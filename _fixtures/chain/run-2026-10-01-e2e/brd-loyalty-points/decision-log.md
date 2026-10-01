<!--
TYPE: Decision Log
PROJECT: Loyalty Points
VERSION: 1.2
PART OF: BRD - Loyalty Points
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Loyalty Points

## How to read

The numbered chunks (00-13) hold the current, settled requirements. This file holds why and how they were decided. Read the chunks for what the product must do. Read this file for the decision history behind it.

## Clarification register

Nine review items (OI-01 to OI-09) and 16 grill-me decisions (TD-01 to TD-16) are decided. None is open. OI-02 to OI-09 carry the to-do rows TD-17 to TD-24.

### OI-01 - Points taken back after a refund

**Question:** Not recorded in a register at the time. The Resolution Log in chunk 13 records the outcome only.

**Decision record, 2026-09-24:** Accepted - applied: points earned on a purchase are taken back when that purchase is refunded. The options and the rationale were not recorded. This record was added on 2026-10-01, when this register was created. TD-06 later made the trigger precise.

**Rule home:** [06a / UC-02 View Points History](./06a-use-cases-member.md#uc-02-view-points-history) (Business Rules & Constraints)

### TD-01 - Who delivers sign-in (grill-me Q2)

**Question:** UC-01 and UC-02 need a signed-in member, but no use case, integration, or dependency delivered sign-in. Options: (a) members use their existing loyalty program account, outside this product; (b) add a sign-in use case to this product.

**Decision record, 2026-10-01:** (a), the interviewer's recommended answer, confirmed by the product manager. Sign-in and joining the program are out of scope; the sign-in is a confirmed dependency, and both preconditions point to it. Rationale: the BRD already expects members to sign in; a sign-in use case would be new scope.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope), [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### TD-02 - Missing acceptance criteria and a precise UC-01 A1 (grill-me Q8)

**Question:** UC-01 A1 had no criterion and did not say what shows instead of the last-movement date; "No points yet" could also mean a balance of 0 after a full refund. UC-02 had no criterion for its Main Flow list. Options: (a) add the criteria and make A1 precise; (b) leave as is.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. UC-01 A1 is "No points movements yet" and shows no date; UC-01 AC-2 and UC-02 AC-2 were added. Rationale: every flow needs a criterion a tester can check.

**Rule home:** [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history)

### TD-03 - Movement dates and what UC-02 step 4 shows (grill-me Q15)

**Question:** No rule said which date a movement carries, and UC-02 step 4 did not say what the member sees. Options: (a) earned: the purchase date; taken back: the date the refund was paid; step 4 shows reference, date, amount in EUR, and points; (b) the date the movement was recorded.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. 03 states the date rule, UC-02 step 4 names what is shown, UC-02 AC-3 and AC-4 were added, and the POS Records row in 08 now includes the purchase date. Rationale: the dates the member knows from the branch and the refund are the ones they can check.

**Rule home:** [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history), [08 / Integrations](./08-integrations.md#integrations)

### TD-04 - Earning points is in scope (grill-me Q1)

**Question:** 01, 02, 03, and 08 describe earning points on branch purchases, but 04 In Scope did not list it. Options: (a) earning is in scope; (b) earning happens elsewhere.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. Rationale: the rest of the BRD already treats earning as part of this product.

**Rule home:** [04 / In Scope](./04-scope-and-personas.md#in-scope)

### TD-05 - Refunds Portal is an integration (grill-me Q3)

**Question:** UC-02 takes points back from Refunds Portal refunds and 02 lists it as a dependency, but 08 did not list it. Options: (a) add it to 08; (b) leave 08 as is.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. Rationale: the product receives refund information from the Refunds Portal, so it is an information exchange.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### TD-06 - Points are taken back when the refund is paid (grill-me Q4)

**Question:** UC-02 BR-1 said "when that purchase is refunded"; NFR-02 counted from "the refund being paid". Options: (a) when the Refunds Portal reports the refund as paid; (b) when the refund is approved.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. UC-02 BR-1, UC-02 AC-1, and 03 were aligned. Rationale: it matches NFR-02, and an approved refund can still fail to be paid.

**Rule home:** [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) (BR-1)

### TD-07 - Only whole euros earn points (grill-me Q5)

**Question:** How many points does a 12.60 EUR purchase earn? Options: (a) 12, whole euros only; (b) 13, round up; (c) 13, round to the nearest euro.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. The earning rule moved to 03; the Glossary keeps the definition only. Rationale: "1 point per 1 EUR spent" and whole-number points (11) both point to whole euros.

**Rule home:** [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement)

### TD-08 - Same-day purchases confirmed (grill-me Q6)

**Question:** 02 Assumption 1 (every branch purchase by a member is known the same day) was not confirmed, and the balance, the history, and NFR-02 rely on it. Options: (a) confirm it and record POS Records as a confirmed dependency; (b) replace it with a different delay.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. The assumption became a confirmed dependency row, and Assumptions now reads "None." Rationale: a confirmed dependency states the commitment and its status in one place.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### TD-09 - UC-02 A1 continues at step 3 (grill-me Q9)

**Question:** UC-02 A1 did not say where the flow goes after a movement of points taken back is listed. Options: (a) the flow continues at step 3, so the member can open it; (b) such movements cannot be opened.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. Rationale: step 4 already shows "the purchase or refund it came from".

**Rule home:** [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) (A1)

### TD-10 - Exception flows when points cannot be shown (grill-me Q10)

**Question:** Neither use case had an exception flow. Options: (a) a plain message to try again later, with a criterion; (b) leave it to design.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. UC-01 E1 with AC-3 and UC-02 E1 with AC-5 were added. Rationale: the member must never be left with a blank or a wrong number.

**Rule home:** [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history)

### TD-11 - When a balance complaint is upheld (grill-me Q12)

**Question:** NFR-01 measured "zero balance complaints upheld per month" without saying what upheld means. Options: (a) upheld when the balance or a movement shown does not match the member's purchases and refunds under the rules in 03 and UC-02; (b) leave it to the complaint team.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. Rationale: the measure must be checkable against the BRD's own rules.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-01)

### TD-12 - Partial refunds (grill-me Q13, round 2)

**Question:** How many points does a refund of part of a purchase take back? Options: (a) 1 point per whole 1 EUR refunded, never more than the purchase earned, and all its points once the whole purchase is refunded; (b) all points on any refund; (c) none until the whole purchase is refunded.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. UC-02 BR-3 and AC-6 were added. Rationale: it mirrors the earning rule (TD-07), and the last sentence stops rounding from leaving points behind.

**Rule home:** [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) (BR-3)

### TD-13 - When the NFR-02 hour starts (grill-me Q14, round 2)

**Question:** A refund can be paid on the day of the purchase, before POS Records report the purchase. Options: (a) the hour runs from the later of the two events; (b) always from the refund being paid.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. Rationale: points cannot be taken back before the purchase that earned them is known.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-02)

### TD-14 - No 0-point movements (grill-me Q16, round 3)

**Question:** A 0.80 EUR purchase earns 0 points, and a 0.90 EUR partial refund takes back 0 points. Do they appear in the history? Options: (a) no, a change of 0 points creates no movement; (b) yes, show a 0-point movement.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. Rationale: 03 already defines a movement as a change to the balance.

**Rule home:** [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement)

### TD-15 - "At any time" sets no availability measure (grill-me Q7)

**Question:** Business Objective 2 says members check their points "at any time", but chunk 10 sets no availability expectation. Options: (a) it means checking online, on their own, without calling a branch, with no availability measure in this release; (b) add an availability NFR with a measure.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. The BRD stays as written. Rationale: option (b) would add a requirement and a measure that nobody has stated.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) (unchanged)

### TD-16 - POS Records in the Glossary (grill-me Q11)

**Question:** Chunk 08 named "POS Records", but the Glossary did not define POS. Options: (a) add a Glossary row; (b) rename the partner.

**Decision record, 2026-10-01:** (a), recommended and confirmed by the product manager. Rationale: the partner name stays stable for the SDD; only its meaning is added.

**Rule home:** [02 / Glossary](./02-glossary-assumptions-facts.md#glossary)

### OI-02 - Where the NFR-02 hour starts for a refund (CF-02, TD-17)

**Question:** BR-1 takes points back at the Refunds Portal's report, but NFR-02 counted from the payment. Options: (A) count from the Refunds Portal's report; (B) count from the payment and add the Refunds Portal's reporting time to 02.

**Decision record, 2026-10-01:** A, the Recommended Answer, accepted by the product manager in the acceptance loop. NFR-02, UC-02 AC-1, and UC-02 AC-6 now start at the Refunds Portal's report. This supersedes the refund side of the NFR-02 wording set by TD-13; the "later of the two reports" rule from TD-13 stays. Rationale: the product cannot act before it knows.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-02)

### OI-03 - A paid refund that arrives before its purchase (CF-03, TD-18)

**Question:** No rule said what happens to a paid refund reported before POS Records reports its purchase. Options: (A) add UC-02 BR-4; (B) leave it implied by NFR-02.

**Decision record, 2026-10-01:** A, accepted by the product manager. Rationale: TD-13 already rests on this behaviour, and a rule belongs in the use case.

**Rule home:** [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) (BR-4)

### OI-04 - Allowed times in NFR-01 and a target for earned points (CF-04, TD-19)

**Question:** NFR-01 ignored the delays the BRD accepts, and no NFR said how soon earned points show. Options: (A) new NFR-03 (1 hour after POS Records reports the purchase) plus allowed times in NFR-01; (B) allowed times only, with no earned-points target; (C) keep NFR-01 strict.

**Decision record, 2026-10-01:** A, accepted by the product manager. Rationale: NFR-01 can only be judged when every movement has an allowed time, and 1 hour is the only time target the business has stated (NFR-02).

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-01, NFR-03)

### OI-05 - An empty history in UC-02 (CF-06, TD-20)

**Question:** UC-02 had no flow or criterion for a member with no movements. Options: (A) add A2 and a criterion, mirroring UC-01 A1; (B) the history cannot be opened without movements.

**Decision record, 2026-10-01:** A, accepted by the product manager. UC-02 A2 and AC-8 were added. Rationale: one consistent message for the same state.

**Rule home:** [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) (A2)

### OI-06 - Partners as supporting actors (CF-08, TD-21)

**Question:** Both use cases said "Supporting Actors: None" although they show what POS Records and the Refunds Portal report. Options: (A) name both partners as external supporting actors; (B) keep "None".

**Decision record, 2026-10-01:** A, accepted by the product manager. The matrix (07) is unchanged, because external parties are never columns. Rationale: the use case and chunk 08 both record an external supporting party.

**Rule home:** [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-07 - The meaning of POS Records (CF-05, TD-22)

**Question:** The Glossary called POS Records a record, while the rest of the BRD treats it as a partner. Options: (A) reword the definition as a partner; (B) keep it.

**Decision record, 2026-10-01:** A, accepted by the product manager. This refines the wording added by TD-16. Rationale: one term, one meaning.

**Rule home:** [02 / Glossary](./02-glossary-assumptions-facts.md#glossary)

### OI-08 - Cover status after version 1.1 (CF-01, TD-23)

**Question:** The cover said Approved, but nobody approved version 1.1. Options: (A) In Review, dated 2026-10-01, until sign-off; (B) record the product manager as the version 1.1 approver.

**Decision record, 2026-10-01:** A, accepted by the product manager. Rationale: the Head of Retail approved version 1.0, and nobody in that role has signed version 1.1.

**Rule home:** [00 / Cover](./00-cover-and-changelog.md#loyalty-points-business-requirements-document-brd)

### OI-09 - A purchase that POS Records reports late (CF-10, TD-24)

**Question:** NFR-01 gave an unreported purchase no time limit, so a late POS Records report could be read as within or outside the measure. Options: (A) no limit, stated plainly; (B) limit it to the day of the purchase (02 dependency).

**Decision record, 2026-10-01:** A, accepted by the product manager. This refines the NFR-01 sentence added by OI-04. Rationale: both partners get one rule (OI-02): the product's measure covers what the product controls.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) (NFR-01)

## Walkthrough and delegation history

### Action entries

**Grill-me session, 2026-10-01:** Test fixture. The session ran non-interactively from the step 3 handoff prompt in [14-todo.md](./14-todo.md). Four rounds: 12 questions, then 3, then 1, then an empty frontier. The product manager answered every question with the interviewer's recommended answer, confirmed the shared understanding, and handed back decisions 1-16. Decision N is TD-NN; the grill-me question number is in each entry's title. brd-unifier applied them as BRD v1.1 and reran the consistency check (Run 2).

**Consistency check Run 2 and acceptance loop, 2026-10-01:** A cleared-context checker found eight findings (CF-01 to CF-08). CF-07 completed TD-10 (a criterion for the step 4 branch of UC-02 E1) and was corrected directly. The other seven became OI-02 to OI-08, each with a to-do row (TD-17 to TD-23). The product manager accepted every Recommended Answer (test fixture: fixed answer). The answers were applied in the same run, so the version stays 1.1. Run 3 rechecked the result.

**Consistency check Run 3, 2026-10-01:** CF-01 to CF-08 are closed in the text. Three new findings: CF-11 (03 did not cite UC-02 BR-4) was corrected as a mechanical cross-reference; CF-09 (01 still used the trigger wording that TD-06 replaced) was corrected under TD-06 and TD-12, and 01 now points to UC-02 instead of restating the rule; CF-10 became OI-09 (TD-24), accepted by the product manager and applied. Run 4 rechecked the result.

**Consistency check Run 4, 2026-10-01:** CF-09 to CF-11 are closed. Two new findings. CF-12: the Reviewed By cell of Changes Log 1.1 stopped at OI-08, corrected as a count. CF-13: 04 In Scope kept the trigger wording that TD-06 replaced, corrected under TD-06. The OI-01 row in the chunk 13 Resolution Log stays as written: it is a dated record of what was applied on 2026-09-24. Run 5 rechecked the result.

**Consistency check Run 5, 2026-10-01:** CF-12 and CF-13 are closed; no new finding. To-do steps 1-3 are complete; steps 4 and 5 can start.

**Mockup review (to-do step 4), 2026-10-01:** Test-fixture confirmation. The product manager reported that LP-01 and LP-02 were reviewed and approved: both playable, delivered at mobile, tablet, and desktop, with a play-through that passed. brd-unifier checked G1-G3 in the files first and recorded the evidence in 14-todo.md. No BRD content changed, so the version stays 1.1.

**Use-case diagrams and flowcharts (to-do step 5), 2026-10-01:** brd-unifier checked G1-G3 in the files, then added Figure 1 (use-case overview, chunk 05) and Figure 2 (UC-02 flowchart, chunk 06a). UC-01 was skipped: its Main Flow has fewer than 3 steps. No behaviour was added to complete a diagram, and no new to-do item was raised. BRD v1.2. Consistency check Run 6 (C1-C9) found no issue. A plain-language rewrite of the Figure 2 Summary followed; it changed no requirement. All five to-do steps are complete, and the delivery gate is open.

**Delivery chunks 15 and 16, 2026-10-01:** brd-unifier checked G1-G5 in the files, then wrote chunk 15: 4 tasks in 2 waves, no dependency problem, no new open item. It checked the gate again and wrote chunk 16: 31 test cases after corrections. Cleared-context C10 checks then ran seven times, Runs 7-13. The findings CF-14 to CF-36 were mechanical corrections to chunks 14-16. CF-21 stayed as written, because the product manager asked to keep the mockup IDs LP-01 and LP-02. No finding changed the BRD body or raised a to-do item, so the gate stays open and the version stays 1.2. Chunk 17 was not requested and was not written.

<!-- MASTER: loyalty-points-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
