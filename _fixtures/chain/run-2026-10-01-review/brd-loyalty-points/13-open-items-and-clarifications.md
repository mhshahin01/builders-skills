<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Loyalty Points
VERSION: 1.3
DEPENDS_ON: all
PART OF: BRD - Loyalty Points
-->

# Open Items & Clarifications

## Open Items

Open: OI-10 to OI-19. OI-02 to OI-09 are applied. Items from OI-10 on were raised by the business review of 2026-10-01 and name their review point; that review's decision log is [review-comments-tracker.md](../review-comments-tracker.md). The decision history is in [decision-log.md](./decision-log.md).

### OI-02: Where the NFR-02 hour starts for a refund

- **Where:** 10 / NFR-02; 06a / UC-02 AC-1, AC-6 (raised by consistency check CF-02)
- **Type:** Inconsistency
- **Concern:** UC-02 BR-1 takes points back when the Refunds Portal reports the refund as paid, but NFR-02 counted the hour from the payment itself. Nothing says how late the Refunds Portal may report. If it reports late, the product misses NFR-02 while following BR-1, and testers cannot tell where the hour starts.
- **Options:**
  - **A.** Count the hour from the Refunds Portal's report, and start AC-1 and AC-6 there - measures what the product controls; the Refunds Portal's own delay falls outside the measure.
  - **B.** Keep counting from the payment and add the Refunds Portal's reporting time to 02 - keeps the member promise, but needs a number from the Refunds Portal owner.
- **Recommended Answer:** A. NFR-02 business measure: "Within 1 hour of the Refunds Portal reporting the refund as paid, or within 1 hour of POS Records reporting the purchase if that is later." UC-02 AC-1: "Given a purchase that earned 50 points, when the Refunds Portal reports its full refund as paid and the member opens the history, then they see a movement of -50 points with the refund reference." UC-02 AC-6: "Given an 80.00 EUR purchase that earned 80 points, when the Refunds Portal reports a refund of 30.50 EUR for part of it as paid, then the member's history shows a movement of -30 points with the refund reference."
- **Why:** BR-1 (TD-06) makes the Refunds Portal's report the trigger, and TD-13 already counts from POS Records' report: the product cannot act before it knows. The tradeoff accepted is that the Refunds Portal's own delay is not measured here.
- **Status:** Accepted - applied

### OI-03: A paid refund that arrives before its purchase

- **Where:** 06a / UC-02 Business Rules & Constraints (raised by consistency check CF-03)
- **Type:** Missing scenario
- **Concern:** NFR-02 accepts that a paid refund can arrive before POS Records reports its purchase, but no rule says what happens to that refund. A build that follows BR-1 literally could drop it, and the points would never be taken back.
- **Options:**
  - **A.** Add the rule as UC-02 BR-4 - the rule sits with the other refund rules; BR-1 to BR-3 keep their positions.
  - **B.** Leave it implied by NFR-02 - no edit, but the behaviour lives only in a measure.
- **Recommended Answer:** A. Add at the end of UC-02 Business Rules & Constraints: "A refund that the Refunds Portal reports as paid before POS Records reports its purchase is kept. Its points are taken back when POS Records reports the purchase."
- **Why:** TD-13 already rests on this behaviour: points cannot be taken back before the purchase that earned them is known. A rule belongs in the use case, not only in a measure. The tradeoff is one more rule.
- **Status:** Accepted - applied

### OI-04: Allowed times in NFR-01 and a target for earned points

- **Where:** 10 / NFR-01, NFR-02 (raised by consistency check CF-04)
- **Type:** Inconsistency
- **Concern:** NFR-01 counts a complaint as upheld whenever the balance or a movement does not match the rules. The BRD itself accepts delays: POS Records reports a purchase on the day of the purchase (02), and NFR-02 allows 1 hour for points taken back. A complaint raised inside an accepted delay would count as upheld. No NFR says how soon earned points show after POS Records reports the purchase, so a late earned movement cannot be judged.
- **Options:**
  - **A.** Add NFR-03 for earned points, 1 hour after POS Records reports the purchase (the same as NFR-02), and exclude the allowed times from NFR-01 - one more NFR; every movement then has an allowed time.
  - **B.** Exclude only an unreported purchase and the NFR-02 hour from NFR-01, with no target for earned points - no new NFR, but a late earned movement cannot be judged.
  - **C.** Keep NFR-01 strict - no edit; NFR-01 conflicts with NFR-02 and the same-day dependency.
- **Recommended Answer:** A. Add row NFR-03: "Points earned on a purchase show quickly. | Within 1 hour of POS Records reporting the purchase." Add to the end of the NFR-01 business measure: "A difference that is still inside its allowed time is not a mismatch: a purchase that POS Records has not reported yet, points earned within the NFR-03 hour, or points taken back within the NFR-02 hour."
- **Why:** NFR-01 can only be judged when every movement has an allowed time (TD-11 made "upheld" checkable against the BRD's own rules). 1 hour is the only time target the business has stated (NFR-02), so earned points and points taken back get the same promise. The tradeoff is one more NFR to test.
- **Status:** Accepted - applied

### OI-05: An empty history in UC-02

- **Where:** 06a / UC-02 Alternate & Exception Flows, Acceptance Criteria (raised by consistency check CF-06)
- **Type:** Missing scenario
- **Concern:** UC-01 A1 says what a member with no movements sees, but UC-02 has no flow or criterion for an empty history. Design would invent its own empty state, and testers cannot check it.
- **Options:**
  - **A.** Add UC-02 A2 and a criterion, mirroring UC-01 A1 - one more flow and criterion; one consistent message.
  - **B.** The history cannot be opened while there are no movements - changes the UC-01 screen and needs its own criterion.
- **Recommended Answer:** A. Add to UC-02 Alternate & Exception Flows: "A2 - No points movements yet: At step 2, the system shows that there are no points movements yet and explains how points are earned. The use case ends." Add at the end of UC-02 Acceptance Criteria: "Given a member with no points movements, when they open the history, then they see that there are no points movements yet and an explanation of how points are earned."
- **Why:** The same state gets the same treatment as UC-01 A1 (TD-02), so the member sees one consistent message. The tradeoff is one more flow and one more criterion.
- **Status:** Accepted - applied

### OI-06: Partners as supporting actors

- **Where:** 06a / UC-01 and UC-02 Supporting Actors (raised by consistency check CF-08)
- **Type:** Inconsistency
- **Concern:** Both use cases said "Supporting Actors: None", yet UC-02 BR-1 names the Refunds Portal, UC-02 step 4 shows details that POS Records and the Refunds Portal report (08), and the UC-01 balance is built from their reports. POS Records was named in no use case, so readers who take partners from the actor fields miss it.
- **Options:**
  - **A.** Name both partners as external supporting actors of UC-01 and UC-02 - two field edits; the matrix stays the same because external parties are never columns.
  - **B.** Keep "None", because the partners report outside the member's flow - no edit, but POS Records stays absent from every use case.
- **Recommended Answer:** A. UC-01 and UC-02 Supporting Actors: "External: POS Records (08); External: Refunds Portal (08)".
- **Why:** Both use cases show what these partners report, and an external supporting party is recorded in the use case and in chunk 08. The tradeoff is that the actor fields name parties that take no part in the member's screen actions.
- **Status:** Accepted - applied

### OI-07: The meaning of POS Records

- **Where:** 02 / Glossary, POS Records (raised by consistency check CF-05)
- **Type:** Ambiguity
- **Concern:** The Glossary defined POS Records as "the record of member purchases", but 02, 08, and NFR-02 use it as a partner that reports purchases. One term with two meanings could lead the SDD to treat it as data this product owns.
- **Options:**
  - **A.** Reword the definition as a partner - one cell; matches every other use.
  - **B.** Keep the definition - no edit; the two meanings stay.
- **Recommended Answer:** A. Glossary row: "POS Records | The partner that reports member purchases made at branch checkouts. POS means point of sale."
- **Why:** Every other use (02 Dependencies, 08, NFR-02) treats POS Records as a partner. The partner name stays the same, so nothing that cites it breaks.
- **Status:** Accepted - applied

### OI-08: Cover status after version 1.1

- **Where:** 00 / cover and Changes Log (raised by consistency check CF-01)
- **Type:** Inconsistency
- **Concern:** The cover read "Status: Approved" and "Date: 2026-09-24", but version 1.1 (2026-10-01) has no approver in the Changes Log. Readers, and the SDD, would take the version 1.1 changes as signed off.
- **Options:**
  - **A.** Set the cover to "In Review" and the date to 2026-10-01 until version 1.1 is signed off; the approver is added to the Changes Log at sign-off - the cover tells the truth; the BRD reads In Review for now.
  - **B.** Record the product manager as the version 1.1 approver and keep "Approved" - the cover stays Approved, but version 1.0 was approved by the Head of Retail, and nobody in that role has signed version 1.1.
- **Recommended Answer:** A. Cover: "**Status:** In Review" and "**Date:** 2026-10-01".
- **Why:** The Head of Retail approved version 1.0, and nobody with that role has signed version 1.1. The cover must not claim an approval that has not happened. The tradeoff is that the BRD reads In Review until sign-off.
- **Status:** Accepted - applied

### OI-09: A purchase that POS Records reports late

- **Where:** 10 / NFR-01 business measure (raised by consistency check CF-10)
- **Type:** Ambiguity
- **Concern:** NFR-01 called an unreported purchase "inside its allowed time", but gave it no limit, while 02 says POS Records reports every purchase on the day of the purchase. One reading never counts a late report against NFR-01; the other counts it once the purchase day has passed. Testers and the complaint team could judge the same complaint differently.
- **Options:**
  - **A.** No time limit, stated plainly - NFR-01 measures only what the product controls, as OI-02 chose for the Refunds Portal; a late POS Records report shows only as a broken 02 dependency.
  - **B.** Limit it by the 02 dependency ("not reported yet on the day of the purchase") - a late POS Records report becomes an upheld complaint, so the product's measure depends on a partner.
- **Recommended Answer:** A. Replace the third sentence of the NFR-01 business measure with: "A difference is not a mismatch when it comes from a purchase that POS Records has not reported yet, from points earned within the NFR-03 hour, or from points taken back within the NFR-02 hour."
- **Why:** OI-02 keeps the Refunds Portal's delay outside the measures, so both partners get one rule. An unreported purchase is not yet a movement, so every movement still has an allowed time (OI-04). The tradeoff is that NFR-01 no longer catches a late POS Records report; only the 02 dependency does.
- **Status:** Accepted - applied

### OI-10: Refunds made outside the Refunds Portal

- **Where:** 01 / Executive Summary; 04 / In Scope, Out of Scope; 06a / UC-02 BR-1; 08 / Integrations; 10 / NFR-01 (raised by the business review, BO-04; it carries the SDD follow-up of SDD OI-19 on till returns and voids)
- **Type:** Missing scenario
- **Concern:** Points are taken back only when the Refunds Portal reports a refund as paid (UC-02 BR-1). Refunds made at a branch till, in cash, after the refund window, for a purchase not paid by card, and voided sales never reach Loyalty Points, so the member keeps the points. "Buy, earn, return at the till, keep the points" inflates the points members hold, which becomes spendable value once redemption arrives (12 Wishlist). NFR-01 does not catch it: over-credited members do not complain, and the difference follows BR-1. Nobody has sized how many refunds stay outside the portal.
- **Options:**
  - **A.** Take points back for POS Records' return and void records too, under the BR-3 rule: a second refund source in 08 and a wider BR-1 - closes the loop; needs POS Records to report member returns and voids with the original receipt.
  - **B.** Keep portal refunds only and accept the loss, with a monthly measure of the points kept on refunded purchases reported next to NFR-01 - no new partner data; the loss is visible and owned.
  - **C.** Keep portal refunds only, with no measure - no work; the loss stays invisible.
- **Recommended Answer:** A if the Retail IT team confirms that POS Records reports member returns and voids with the original receipt number; otherwise B, with the loss measured monthly and owned by the product manager.
- **Why:** Objective 1 is a balance members can trust; points kept on refunded purchases make the balance wrong in the member's favour and grow what the programme owes. The tradeoff of A is a second partner flow; of B, an accepted loss.
- **Owner:** Product manager, with the Retail IT team (POS Records)
- **Decide by:** before TASK-01 (Record points earned and taken back) starts
- **Status:** Open (raised by the business review, BO-04, 2026-10-01)

### OI-11: What happens to a member's points record when they leave the program

- **Where:** 04 / Out of Scope (joining the program); 10 / NFR-01 (raised by the business review, BO-06; it carries the SDD follow-up of SDD CL-22)
- **Type:** Missing scenario
- **Concern:** Joining and leaving the loyalty program happen outside this product, and nothing tells Loyalty Points that a member has left. The SDD therefore keeps a member's purchases and movements until a deletion request, and keeps refunds of purchases that no member made with no end. No BRD says whether that is what the program wants.
- **Options:**
  - **A.** No leave signal: a member's points record stays until a deletion request, as designed - no new partner flow; records of former members stay.
  - **B.** The loyalty program reports members who leave, and their points record is deleted after a set period - records end with membership; a new partner flow.
- **Recommended Answer:** A, unless the loyalty program's terms or the data protection owner require deletion when a member leaves.
- **Why:** Leaving the program is outside this product (04), and B needs a partner flow nobody has offered. The tradeoff is keeping the records of former members.
- **Owner:** Product manager, with the data protection owner
- **Decide by:** before go-live
- **Status:** Open (raised by the business review, BO-06, 2026-10-01)

### OI-12: Why the retailer funds the program

- **Where:** 01 / Business Objectives (raised by the business review, BO-09)
- **Type:** Missing requirement
- **Concern:** Both objectives are about members seeing a balance. Neither says what the retailer gains from points (repeat visits, more spending, keeping customers, fewer calls to branches), Objective 2 has no measure or starting figure (for example, how many calls branches get about points today; business review PM-05), and no BRD chunk states how many members and member purchases there are, so the program's value and cost cannot be sized.
- **Options:**
  - **A.** Add one outcome objective with a starting figure, a target, and its source, give Objective 2 a measure and a starting figure, and state member and member-purchase volumes in 02 Facts - the program can be judged and sized.
  - **B.** Keep the two objectives and state that the outcome is measured outside this product - no BRD change; the sponsor's case stays outside the BRD.
- **Recommended Answer:** A, with the objective, its starting figure, and the volumes supplied by the product manager.
- **Why:** A balance members trust serves a business purpose that the BRD should name, or nobody can tell whether the release worked. The tradeoff is gathering a starting figure before go-live.
- **Owner:** Product manager
- **Decide by:** before go-live
- **Status:** Open (raised by the business review, BO-09, 2026-10-01)

### OI-13: When points can be spent, and what the retailer owes

- **Where:** 04 / Out of Scope (redeeming points); 09; 12 / Wishlist (raised by the business review, BO-09)
- **Type:** Missing requirement
- **Concern:** Redeeming points is "a later phase" with no reason, date, or trigger, so members collect a balance with no stated use. 09 has no report, so finance gets no figure for points issued, outstanding, or taken back, which becomes what the retailer owes members once points can be spent. Once points can be spent, a refund can also take back points the member has already spent: nothing says whether the balance may then go below zero, whether the take-back stops at the points left, or whether the member owes the difference (raised by the business review, PA-08).
- **Options:**
  - **A.** State why redemption comes after this release, its horizon or trigger, and a points-owed report for finance (points issued, taken back, and outstanding per month) in 09 - members and finance know what to expect.
  - **B.** Add the points-owed report now and leave the horizon open - finance sees the figure; members still have no date.
- **Recommended Answer:** A, with the horizon or trigger set by the product manager and the report's audience and frequency agreed with finance; the rule for taking back points already spent is decided with the horizon, before redemption is built.
- **Why:** A balance without a use or an owner of its liability weakens Objective 1. The tradeoff is a report to build in this release.
- **Owner:** Product manager, with finance
- **Decide by:** before go-live
- **Status:** Open (raised by the business review, BO-09, 2026-10-01)

### OI-14: Who receives and upholds balance complaints

- **Where:** 04 / Personas / Actors; 07; 10 / NFR-01; 13 / OI-09 ("the complaint team") (raised by the business review, BO-11)
- **Type:** Missing requirement
- **Concern:** NFR-01 is judged on upheld balance complaints, and OI-09 refers to a complaint team, but no persona receives, investigates, or upholds a complaint, nobody but the member can see their points, and no requirement creates the complaint log the measure needs. Today the only way for anyone else to see a member's points is emergency access to production data, which is not a support channel.
- **Options:**
  - **A.** A read-only Customer Care persona that sees a member's balance and movements, upholds or rejects a balance complaint under NFR-01, and records each complaint and its outcome in a complaint log, with a response time - NFR-01 can be operated; another role sees members' points.
  - **B.** Complaints go to the existing loyalty program's support, outside this product - no scope change; NFR-01 is measured outside the product, from records it cannot see.
- **Recommended Answer:** A, with the response time and what customer care may see agreed with the Operations Lead and the data protection owner.
- **Why:** NFR-01 is a complaint measure, so someone must receive, judge, and log complaints. The tradeoff is a new role that sees members' points.
- **Owner:** Product manager, with the Operations Lead and the data protection owner
- **Decide by:** before go-live
- **Status:** Open (raised by the business review, BO-11, 2026-10-01)

### OI-15: Moving from the existing loyalty program

- **Where:** 01 / Business Objectives; 02 / Dependencies; 03 / Points movement; 04 / Out of Scope; 06a / UC-01 A1; 09 (raised by the business review, SME-11)
- **Type:** Missing requirement
- **Concern:** Members already have loyalty program accounts and member numbers, so a program runs today and probably holds points under published terms. This BRD starts every member at 0 (UC-01 A1), says nothing about the points they hold now, from which purchase date points are earned, or what happens to a refund of a purchase made before launch, and its earning rule has no exclusions (such as gift cards) and no expiry, which the program's terms may have. Members could see a balance on launch day that contradicts what they were told.
- **Options:**
  - **A.** Start every balance at 0 at go-live: purchases from the go-live date earn, a refund of an earlier purchase takes nothing back, and members are told at launch - simple; right only if members hold no points today.
  - **B.** Carry each member's balance over from the existing program at a set date as one opening movement, earn from that date, and align exclusions and expiry with the program's terms - continuity for members; needs the existing system's data and terms.
- **Recommended Answer:** B if members hold points today, A otherwise; in both cases name the existing program and its system, set the date from which purchases earn, and decide whether the program's exclusions and expiry apply (02 Legal clearances L2).
- **Why:** Objective 1 is a balance members trust; a balance that contradicts what they hold today fails it on day one. The tradeoff of B is a data migration.
- **Owner:** Product manager, with the owner of the existing loyalty program
- **Decide by:** before TASK-01 (Record points earned and taken back) starts
- **Status:** Open (raised by the business review, SME-11, 2026-10-01)

### OI-16: Putting a balance right

- **Where:** 04 / Personas / Actors; 10 / NFR-01; 03 / Points movement; 16 / P7 (raised by the business review, SME-12)
- **Type:** Missing requirement
- **Concern:** Points movements come only from purchases POS Records reports and refunds the Refunds Portal reports, and none can be changed. When a complaint is upheld (NFR-01), when a member forgot to identify at the till, or when a goodwill credit is agreed, nobody can correct the balance. Merging duplicate accounts, replacing a lost card, secondary cards on one account, and closing an account in the existing program have no way to reach Loyalty Points.
- **Options:**
  - **A.** A loyalty-operations persona that records an adjustment movement (points added or removed, with a reason, a second approver above a set number of points, shown to the member in the history) and handles a missing-points claim by receipt - balances can be put right here.
  - **B.** Corrections, merges, card changes, and closures stay in the existing program's system, which reports them to Loyalty Points - one place for corrections; a second partner flow.
- **Recommended Answer:** A if this product holds the official balance (OI-15); B if the existing program keeps it. In both cases state how merges, card replacements, and closures reach Loyalty Points.
- **Why:** NFR-01 is meaningless if an upheld complaint cannot be corrected. The tradeoff of A is a new persona and an approval rule; of B, a partner flow.
- **Owner:** Product manager, with the owner of the existing loyalty program and the Operations Lead
- **Decide by:** before go-live
- **Status:** Open (raised by the business review, SME-12, 2026-10-01)

### OI-17: Launch order with the Refunds Portal

- **Where:** 02 / Dependencies (Refunds Portal); 08 (raised by the business review, PM-07)
- **Type:** Missing requirement
- **Concern:** Points are taken back only for refunds the Refunds Portal reports as paid, and the Refunds Portal goes live in pilot branches first, then in waves (REFUNDS 02 Assumptions / Constraints 3). If Loyalty Points goes live first, refunds in branches still on paper keep their points for as long as the rollout lasts, and nothing says which product launches when.
- **Options:**
  - **A.** Loyalty Points goes live once the Refunds Portal runs in every branch - no rollout gap; earning waits for the end of the refund rollout.
  - **B.** Loyalty Points goes live with the Refunds Portal pilot, accepting that refunds in branches not yet on the portal keep their points (counted by the measure of OI-10) - earlier earning; a known, temporary loss.
- **Recommended Answer:** A, unless the product manager prefers earlier earning and accepts the loss under OI-10.
- **Why:** The take-back rule depends on the Refunds Portal, so its rollout bounds where the rule can work. The tradeoff is a later start for earning.
- **Owner:** Product manager, with the Refunds Portal's product manager and the Operations Lead (REFUNDS rollout plan, REFUNDS OI-15)
- **Decide by:** before the REFUNDS rollout plan is agreed
- **Status:** Open (raised by the business review, PM-07, 2026-10-01)

### OI-18: Refund details shown to a member who did not request the refund

- **Where:** 06a / UC-02 step 4, A1, AC-1, AC-4, AC-6 (raised by the business review, PA-09; linked to Refunds Portal OI-32)
- **Type:** Inconsistency
- **Concern:** A movement of points taken back shows the refund reference, the date the refund was paid, and the refunded amount. The points are taken back from the member whose purchase was refunded, but the refund may have been requested by another person who holds the receipt, and the Refunds Portal lets only that customer and their branch's manager see the request (Refunds Portal NFR-04).
- **Options:**
  - **A.** Show the refunded amount and the date the refund was paid, but not the refund reference - the member still sees why points were taken back; the request stays private.
  - **B.** Keep showing the refund reference - one reference across both products; against the Refunds Portal's rule.
  - **C.** Show only the points taken back - the strictest; the member cannot tell which refund took the points.
- **Recommended Answer:** A, decided together with Refunds Portal OI-32 and the data protection owner; UC-02 A1, AC-1, AC-4, and AC-6 then name the purchase instead of the refund reference.
- **Why:** The amount and date describe the member's own purchase, while the reference belongs to someone else's request. The tradeoff is a movement without the refund reference.
- **Owner:** Product manager, with the Refunds Portal's product manager and the data protection owner
- **Decide by:** before TASK-04 (the points history) starts
- **Status:** Open (raised by the business review, PA-09, 2026-10-01)

### OI-19: What "the whole purchase has been refunded" means for a purchase paid partly in cash

- **Where:** 06a / UC-02 BR-3 (raised by the business review, DC-08; linked to Refunds Portal OI-06)
- **Type:** Ambiguity
- **Concern:** BR-3 takes back all the points a purchase earned once the whole purchase has been refunded. The Refunds Portal refunds a purchase paid partly by card only up to the card-paid amount (Refunds Portal OI-06), so when every item of such a purchase is returned, the refunded amount never reaches the purchase amount, and the member keeps points for a purchase they returned in full. It is also not confirmed that the amount POS Records reports for a member purchase equals what the receipt's items add up to (after discounts, with items that earn no points).
- **Options:**
  - **A.** "The whole purchase has been refunded" means every item was returned: all remaining points are taken back when the last item is refunded, whatever amount was repaid - points follow what the member returned; the Refunds Portal must report when a refund completes the purchase.
  - **B.** It means the full amount was repaid - nothing new to report; a purchase paid partly in cash keeps the points of its cash part even when every item is returned.
- **Recommended Answer:** A, agreed with the Refunds Portal's product manager (Refunds Portal OI-06), with POS Records confirming that the purchase amount and the receipt's items share one basis.
- **Why:** The member returned everything they bought, so they should keep no points for it. The tradeoff is one more fact the Refunds Portal reports with a paid refund.
- **Owner:** Product manager, with the Refunds Portal's product manager
- **Decide by:** before TASK-01 (Record points earned and taken back) starts
- **Status:** Open (raised by the business review, DC-08, 2026-10-01)

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-24 | 06a / UC-02 BR-1 | Accepted - applied: points are taken back when the purchase is refunded. |
| OI-02 | 2026-10-01 | 10 / NFR-02; 06a / UC-02 AC-1, AC-6 | Accepted recommendation |
| OI-03 | 2026-10-01 | 06a / UC-02 BR-4 | Accepted recommendation |
| OI-04 | 2026-10-01 | 10 / NFR-01, NFR-03 | Accepted recommendation |
| OI-05 | 2026-10-01 | 06a / UC-02 A2, AC-8 | Accepted recommendation |
| OI-06 | 2026-10-01 | 06a / UC-01, UC-02 Supporting Actors | Accepted recommendation |
| OI-07 | 2026-10-01 | 02 / Glossary | Accepted recommendation |
| OI-08 | 2026-10-01 | 00 / cover | Accepted recommendation |
| OI-09 | 2026-10-01 | 10 / NFR-01 | Accepted recommendation |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
