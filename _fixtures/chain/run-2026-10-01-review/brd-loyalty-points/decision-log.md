<!--
TYPE: Decision Log
PROJECT: Loyalty Points
VERSION: 1.3
PART OF: BRD - Loyalty Points
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Loyalty Points

## How to read

The numbered chunks (00-13) hold the current, settled requirements. This file holds why and how they were decided. Read the chunks for what the product must do. Read this file for the decision history behind it.

## Clarification register

Nine review items (OI-01 to OI-09) and 16 grill-me decisions (TD-01 to TD-16) are decided. OI-02 to OI-09 carry the to-do rows TD-17 to TD-24. The business review of 2026-10-01 records its decisions in the Business review register below; the open items it raised are in chunk 13 from OI-10 on, with to-do rows from TD-25.

### OI-01 - Points taken back after a refund

**Question:** Not recorded in a register at the time. The Resolution Log in chunk 13 records the outcome only.

**Decision record, 2026-09-24:** Accepted - applied: points earned on a purchase are taken back when that purchase is refunded. The options and the rationale were not recorded. This record was added on 2026-10-01, when this register was created. TD-06 later made the trigger precise.

**Rule home:** [06a / UC-02 View Points History](./06a-use-cases-member.md#uc-02-view-points-history) (Business Rules & Constraints)

### TD-01 - Who delivers sign-in (grill-me Q2)

**Question:** UC-01 and UC-02 need a signed-in member, but no use case, integration, or dependency delivered sign-in. Options: (a) members use their existing loyalty program account, outside this product; (b) add a sign-in use case to this product.

**Decision record, 2026-10-01:** (a), the interviewer's recommended answer, confirmed by the product manager. Sign-in and joining the program are out of scope; the sign-in is a confirmed dependency, and both preconditions point to it. Rationale: the BRD already expects members to sign in; a sign-in use case would be new scope.

**Superseded in part, 2026-10-01 (business review BO-05, Business review register below):** the sign-in stays a dependency outside this product, but its status is now To confirm, with an owner and TASK-02 as the point it must be confirmed before.

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

**Superseded in part, 2026-10-01 (business review BO-05, Business review register below):** the row's status is now To confirm: no written confirmation from POS Records exists, and the row also names the receipt number each member purchase must carry.

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

**Note, 2026-10-01 (business review PM-05, Business review register below):** the reading stands: "at any time" sets no availability measure. Objective 2 itself is no longer as written: PM-05 added that its measure and starting figure are open in OI-12 (TD-29).

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) (unchanged by this decision)

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

## Business review register

Decisions of the business review of 2026-10-01 that change this BRD, each decided by the user in the review walkthrough. The review's own decision log is [review-comments-tracker.md](../review-comments-tracker.md); each record names its tracker ID.

### BO-04 - Refunds made outside the Refunds Portal

**Question:** 01 and 04 promised that points are taken back after any refund of a purchase, while UC-02 BR-1 takes them back only when the Refunds Portal reports the refund as paid; refunds at a branch till, in cash, or after the refund window never take points back.

**Decision record, 2026-10-01:** Option B, over A (take POS Records' returns and voids as a second source now) and C (accept the loss with no measure): 01 and 04 In Scope now say the Refunds Portal's paid refunds take points back, and 04 Out of Scope lists refunds made outside it; whether they become a second take-back source is OI-10 (TD-25), open. Rationale: the promise must match BR-1; a second source needs POS Records facts nobody has confirmed. The tradeoff is that refunds outside the portal keep their points until OI-10 is decided.

**Rule home:** [01 / Executive Summary](./01-executive-summary-and-context.md#executive-summary), [04 / Project Scope](./04-scope-and-personas.md#project-scope)

### BO-05 - Dependencies marked Confirmed without a written confirmation

**Question:** 02 marked POS Records' same-day reporting and the member sign-in as Confirmed, while the SDD shows both unverified: the API-04 contract is not supplied, nobody knows whether POS Records sends a receipt number with each member purchase, and the sign-in system is unknown.

**Decision record, 2026-10-01:** Option A, over B (track the confirmations only in the SDD) and C (change the labels only): both rows are To confirm, each with an owner, what must be confirmed in writing, and the task it must be confirmed before (TASK-01 for POS Records, now naming the receipt number; TASK-02 for the sign-in). TD-26 and TD-27 track them. Supersedes in part TD-01 and TD-08. Rationale: a dependency is Confirmed only when its partner has confirmed it; until then the delivery gate stays shut.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### BO-06 - Owner decisions outside this BRD, and delivery on unsigned versions

**Question:** The SDD handed the LOYALTY owner a "member left" question (SDD CL-22) and the till returns question (SDD OI-19), but chunk 13 read "None open"; versions 1.1 and 1.2 have no approver, yet chunks 15 and 16 were written on them.

**Decision record, 2026-10-01:** Option A, over B (one register in the SDD) and C (register only): the SDD follow-ups are open items here (OI-10 from BO-04, OI-11 for the member-left question; the sign-in confirmation is TD-27 from BO-05), and the delivery gate gains G6, "this version signed off by its approver", so chunks 15 and 16 are refreshed only on a signed version. TD-15 already answered the availability question the SDD still carried; the SDD now cites it. Rationale: a register the owner and the gate already read cannot miss a decision.

**Rule home:** [13 / Open Items](./13-open-items-and-clarifications.md#open-items), [14 / Delivery gate](./14-todo.md#delivery-gate)

### BO-07 - Legal clearances as release conditions

**Question:** The lawful basis for member data and whether the loyalty program terms cover whole-euro earning and take-backs after refunds could each stop go-live, yet 02 listed no legal item.

**Decision record, 2026-10-01:** Option A, over B (leave them in the SDD) and C (also gate this BRD's delivery outputs on them): 02 Legal clearances L1 (lawful basis, data protection owner) and L2 (program terms, product manager with the retailer's legal adviser), both needed before go-live and before the BAT sign-off. Rationale: they gate the release, not the plan and the tests.

**Rule home:** [02 / Legal clearances](./02-glossary-assumptions-facts.md#legal-clearances)

### BO-09 - The program's outcome, redemption, and the earning rule's owner

**Question:** The release had no outcome objective, no horizon for redemption, and no figure of points owed, and the SDD held an earn rate with no owner that take-backs applied at the refund date.

**Decision record, 2026-10-01:** Option B, over A (decide the outcome, date, and report now) and C (earn rate only): 03 states that this BRD sets the earning rule, owned by its product manager, and that a purchase keeps the rule it earned under, so a refund takes points back by that rule; the outcome objective with its starting figure and volumes is OI-12 (TD-29), and the redemption horizon with a points-owed report is OI-13 (TD-30), both open. Rationale: keeping the rule per purchase follows from UC-02 BR-3 and NFR-01; the business facts come from the owner.

**Rule home:** [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement)

### BO-11 - Who receives and upholds balance complaints

**Question:** NFR-01 is judged on upheld balance complaints, but no persona receives, investigates, or upholds a complaint, nobody but the member can see their points, and no requirement creates the complaint log that 16 P7 relies on; the only other way to see a member's points is emergency access to production data.

**Decision record, 2026-10-01:** Option B, over A (add a customer-care persona now) and C (customer care works without access): raised as OI-14 (TD-31, P1, before go-live), recommending a read-only Customer Care persona that sees a member's balance and movements, upholds or rejects a balance complaint under NFR-01, and logs it with a response time; the Refunds Portal raises the same question as its OI-13. No requirement changes until the owners decide. Rationale: a new role widens who sees members' points, so the product manager, the Operations Lead, and the data protection owner decide it. This record was added in the review's verification pass.

**Rule home:** [13 / OI-14](./13-open-items-and-clarifications.md#oi-14-who-receives-and-upholds-balance-complaints)

### SME-11 - Moving from the existing loyalty program

**Question:** Members already hold accounts in a loyalty program, yet this BRD starts every balance at 0 and says nothing about the points members hold today, the date from which purchases earn, refunds of purchases made before launch, or the program's exclusions and expiry.

**Decision record, 2026-10-01:** Option C, over A (start every balance at 0 now) and B (carry balances over now): raised as OI-15 (TD-32, P1, before TASK-01), recommending one opening movement carried over from the existing program if members hold points today, and otherwise a start at 0 with member communication; whether the program's exclusions and expiry apply is part of Legal clearance L2 (02). No other requirement changes until the owner decides. Rationale: both answers are sound, and which one fits depends on facts only the existing program's owner has. This record was added in the review's verification pass.

**Rule home:** [13 / OI-15](./13-open-items-and-clarifications.md#oi-15-moving-from-the-existing-loyalty-program), [02 / Legal clearances](./02-glossary-assumptions-facts.md#legal-clearances)

### SME-12 - Putting a balance right

**Question:** Points movements come only from POS Records and the Refunds Portal and can never be changed, so an upheld complaint, a missing-points claim, or a goodwill credit cannot be put right, and merges, card replacements, and closures in the existing program cannot reach Loyalty Points.

**Decision record, 2026-10-01:** Option B, over A (add a loyalty-operations persona with adjustments now) and C (corrections come from the existing program through a partner flow): raised as OI-16 (TD-33, P1, before go-live), linked to OI-14 and OI-15, recommending adjustment movements made in this product if it holds the official balance, or a partner flow from the existing program if that program keeps it. Until it is decided, an upheld complaint cannot be corrected. Rationale: where corrections are made depends on which system holds the official balance (OI-15), and the approval rules are the program owner's policy. This record was added in the review's verification pass.

**Rule home:** [13 / OI-16](./13-open-items-and-clarifications.md#oi-16-putting-a-balance-right)

### PM-05 - Measuring the objectives

**Question:** Neither objective had a measure, a target, or a starting figure.

**Decision record, 2026-10-01:** Option A of the review point (it also set the REFUNDS measures and report): Objective 1 is measured by NFR-01 (zero balance complaints upheld per month); Objective 2's measure and starting figure join OI-12 (TD-29), open. Rationale: NFR-01 already measures trust; a measure of calls to branches needs a starting figure nobody has.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### PM-07 - The Refunds Portal dependency, both sides

**Question:** 02 called the Refunds Portal dependency Confirmed, while the Refunds Portal BRD committed to nothing, and neither plan sequenced the two launches.

**Decision record, 2026-10-01:** Option A, over B (keep it one-sided) and C (merge the plans): the Refunds Portal BRD now commits to report each paid refund (REFUNDS 04 In Scope, 08 Loyalty Points row, REFUNDS OI-28); 02 records that TASK-01's acceptance waits for the Refunds Portal's TASK-03 and the payment provider's test environment; the launch order is OI-17 (TD-34), open. Rationale: a dependency is real only when the providing side commits to it.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### PM-11 - Staging refunds above a purchase's amount (P8)

**Question:** TC-PTS-07 needs refund reports for one purchase that add up to more than its amount (P8), which the Refunds Portal never produces, because an item is refunded only once.

**Decision record, 2026-10-01:** Option A of the review point: P8 is staged through the POS Records test environment, which reports the member purchase for less than its receipt's items, so refunds of all the items add up to more than the purchase; no test-only reporter of paid refunds is used. Applied when chunk 16 is refreshed (14 / Business review). Rationale: it reproduces a real cause of over-refunding (a purchase amount that differs from its receipt) with the real reporting path.

**Rule home:** [16 / Test environment and data prerequisites](./16-uat-bat-test-cases.md#test-environment-and-data-prerequisites) (at its refresh)

### PM-12 - Deferred features and what members are told

**Question:** Redemption and history export had no owner or horizon, and nothing told members that their points cannot be spent yet.

**Decision record, 2026-10-01:** Option A of the review point: 12 Wishlist is a table with an owner and a trigger or horizon per item (redemption through OI-13; history export decided in the first month after go-live, when the first monthly NFR-01 figure is known); 04 Out of Scope and 11 state that the balance screen says points cannot be spent yet. Rationale: members trust a balance more when they know what it is for.

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations), [12 / Wishlist](./12-appendix-and-wishlist.md#wishlist)

### PA-02 - The date of points taken back

**Question:** 03 dated a take-back "the date the refund was paid", while OI-02 starts the NFR-02 hour when the Refunds Portal reports the refund as paid; near midnight the two readings give different dates.

**Decision record, 2026-10-01:** Option A of the review point: a movement of points taken back carries the date the Refunds Portal reported the refund as paid, which is the Paid date the customer sees in the Refunds Portal (03 Movement date). Extends OI-02 to the movement date; the SDD defines the one paid time the two products share.

**Rule home:** [03 / Points movement, Movement date](./03-definitions-and-domain-concepts.md#points-movement)

### PA-03 - The receipt number that links a refund to a purchase

**Question:** 08 did not list the receipt number POS Records reports with a member purchase, its Refunds Portal row still named a member and a purchase reference the Refunds Portal does not send, and nobody had confirmed that a receipt number identifies one purchase across all branches.

**Decision record, 2026-10-01:** Option A of the review point: 08 POS Records row adds the receipt number; the Refunds Portal row reports the receipt number of the purchase instead of the member and purchase reference; the POS Records dependency in 02 also asks that the receipt number comes in the same form as the Refunds Portal's receipt look-up and whether it identifies one purchase across all branches and over time. If it does not, the branch joins the receipt number (SDD §3 assumption 12).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies), [08 / Integrations](./08-integrations.md#integrations)

### PA-05 - The member number members sign in with

**Question:** Nothing said that the member number in a member's sign-in is the same, in the same form, as the one POS Records reports with each purchase, so a member could see no points, or another member's, with no error; and the UAT test members cannot be created by the platform.

**Decision record, 2026-10-01:** Option A of the review point: POS Records is the source of truth for member numbers; the member sign-in dependency in 02 and TD-27 now also ask that the member number reaches Loyalty Points in the same form as POS Records reports it. Test members for UAT come from the existing loyalty program (refresh item for 16 P2). Which system members sign in with stays open in TD-27.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### PA-08 - A refund that takes back points already spent

**Question:** The design keeps every balance at zero or above only because points cannot be spent; once redemption arrives, a refund can take back points the member has already spent, and no rule says what happens.

**Decision record, 2026-10-01:** Option A of the review point: OI-13 (TD-30) also asks whether the balance may go below zero, whether the take-back stops at the points left, or whether the member owes the difference, decided with the redemption horizon and before redemption is built. No requirement changes in this release.

**Rule home:** [13 / OI-13](./13-open-items-and-clarifications.md#oi-13-when-points-can-be-spent-and-what-the-retailer-owes)

### PA-09 - Refund details on a member's points history

**Question:** UC-02 shows the refund reference, paid date, and refunded amount to the member whose purchase was refunded, who may not be the customer who requested the refund, while the Refunds Portal lets only that customer and their branch's manager see a request.

**Decision record, 2026-10-01:** Option A of the review point: the conflict is raised as OI-18 (TD-35, P1, before TASK-04), linked to Refunds Portal OI-32, with the recommended answer to show the amount and date but not the refund reference. UC-02 is unchanged until both owners decide.

**Rule home:** [13 / OI-18](./13-open-items-and-clarifications.md#oi-18-refund-details-shown-to-a-member-who-did-not-request-the-refund)

### DC-08 - "The whole purchase has been refunded" for a purchase paid partly in cash

**Question:** UC-02 BR-3 takes back all points once the whole purchase is refunded, but the Refunds Portal refunds a purchase paid partly by card only up to its card-paid amount, so a fully returned purchase can keep points; the purchase amount and the receipt's item amounts may also differ.

**Decision record, 2026-10-01:** Option A of the review point: raised as OI-19 (TD-36, P1, before TASK-01), linked to Refunds Portal OI-06, with the recommended answer "every item returned". BR-3 is unchanged until the owners decide.

**Rule home:** [13 / OI-19](./13-open-items-and-clarifications.md#oi-19-what-the-whole-purchase-has-been-refunded-means-for-a-purchase-paid-partly-in-cash)

### DC-12 - Business rule and acceptance criterion labels

**Question:** Business rules and acceptance criteria in 06a were numbered only by position, while 13 to 16 and the SDD cite them by number; OI-03 had to pick its option to keep the positions stable.

**Decision record, 2026-10-01:** Option A of the review point: every business rule and acceptance criterion in 06a carries its BR-n or AC-n label inline, at its current position, so no citation changes; a new rule or criterion takes the next label. Extends OI-03, whose position constraint the labels now make explicit.

**Rule home:** [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history)

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
