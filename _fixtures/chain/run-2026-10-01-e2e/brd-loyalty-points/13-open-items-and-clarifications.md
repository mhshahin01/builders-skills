<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Loyalty Points
VERSION: 1.1
DEPENDS_ON: all
PART OF: BRD - Loyalty Points
-->

# Open Items & Clarifications

## Open Items

None open. Every item below is applied. The decision history is in [decision-log.md](./decision-log.md).

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
