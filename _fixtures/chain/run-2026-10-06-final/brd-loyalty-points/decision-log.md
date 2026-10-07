<!--
TYPE: Decision Log
PROJECT: Loyalty Points
VERSION: 1.7
PART OF: BRD - Loyalty Points
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Loyalty Points

## How to read

The numbered content chunks hold the current settled requirements. This companion file holds why and how they were decided. Read the chunks for what the product must do; read this file for the decision history behind it.

## Clarification register

All 37 review items are decided: OI-01 in BRD v1.0, OI-02 to OI-19 on 2026-10-04, and OI-20 to OI-37 on 2026-10-05. Six pending decisions from the to-do (TD-02, TD-03, TD-15, TD-16, TD-27, TD-40) were also decided on 2026-10-05, and thirteen decisions from the grill-me session of 2026-10-05 changed the BRD (TD-44 to TD-56). Every decision since BRD v1.0 was taken by the product manager, who accepted the recommended option or, where a fact was missing, supplied it. The values the product manager supplied on 2026-10-05 for TD-01, TD-03 to TD-06, TD-09 to TD-14, TD-20, TD-21, TD-23, TD-27, TD-28, and TD-40 are test-fixture values, recorded as such below.

### OI-01 - Points taken back after a refund

**Question:** Not recorded in BRD v1.0, which kept only the item's Resolution Log row.

**Decision record, 2026-09-24:** Accepted and applied in BRD v1.0: points earned on a purchase are taken back when that purchase is refunded. Who decided and which options were weighed are not recorded. OI-06 (2026-10-04) supersedes the trigger wording of this rule; the rule itself stands.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-02 - Earning rule

**Question:** How many points does a purchase earn, on which amount, and how are cents handled?

**Decision record, 2026-10-04:** Option A: 1 point per 1 EUR of the amount paid after discounts, rounded down on each purchase; earning added to In Scope. Not chosen: B (round to the nearest point), C (keep part points). Rationale: one testable rule where the Earned movement lives, consistent with whole points; members lose the cents on each purchase.

**Rule home:** [03 / Movement types](./03-definitions-and-domain-concepts.md#movement-types)

### OI-03 - Points held at go-live

**Question:** What happens to the points members already hold when the product goes live?

**Decision record, 2026-10-04:** Option A: carry each member's points over once, as an Opening balance movement dated on the go-live date. Not chosen: B (load past purchases and refunds), C (start everyone at 0). Rationale: balances stay unchanged at launch (Objective 1, NFR-01) without relying on old records; refunds of pre-launch purchases take nothing back. Open remainder: who holds today's balances (marker in chunk 02, Dependencies).

**Rule home:** [03 / Movement types](./03-definitions-and-domain-concepts.md#movement-types)

### OI-04 - Points expiry

**Question:** Do points expire?

**Decision record, 2026-10-04:** Option A: points do not expire in this release; any expiry rule comes with redemption. Not chosen: B (expiry a set time after earning), C (expiry after inactivity). Rationale: members cannot spend points yet, so expiry would hurt trust; the points owed to members build up until redemption.

**Rule home:** [03 / Expiry](./03-definitions-and-domain-concepts.md#expiry)

### OI-05 - Member sign-in and joining

**Question:** Who lets members join the program and sign in?

**Decision record, 2026-10-04:** Option A: both stay outside this product and are a hard dependency. Not chosen: B (bring them into scope with their own use cases). Rationale: the use cases and journey treat sign-in as given. Open remainder: the owning product or team (marker in chunk 02, Dependencies).

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### OI-06 - Refund outcome that takes points back

**Question:** Which refund outcome triggers the take-back: request, approval, or payment?

**Decision record, 2026-10-04:** Option A: points are taken back only when the Refunds Portal reports the refund as paid; rejected or cancelled refunds take back nothing. Not chosen: B (take back at approval, give back on cancellation). Rationale: matches NFR-02, which counts from payment; points stay while a refund is pending. This supersedes the trigger wording of OI-01.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-07 - Partial refunds

**Question:** What happens to points when only part of a purchase is refunded, or a purchase has several refunds?

**Decision record, 2026-10-04:** Option A: the purchase keeps the points its amount not refunded earns, and each refund takes back only points not already taken back. Not chosen: B (take back only on a full refund), C (take back everything on any refund). Rationale: the balance stays equal to what the net spend earns (NFR-01).

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-08 - Refund before its purchase shows

**Question:** What happens when a refund is paid before its purchase reaches the product, or refunds a purchase that earned no points?

**Decision record, 2026-10-04:** Option A: the take-back waits until the purchase shows; a purchase that earned no points loses nothing; the balance is never below 0; NFR-02 counts from the later event. Not chosen: B (record at once and allow a negative balance). Rationale: every balance stays explainable; a same-day refund can show later than 1 hour after payment.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-09 - Repeated reports

**Question:** What happens when the same purchase or refund is reported more than once?

**Decision record, 2026-10-04:** Option A: each purchase earns once and each refund takes back once, recognised by its reference. Not chosen: B (accept every report). Rationale: repeats would break NFR-01; relies on each reference being unique.

**Rule home:** [03 / Structure](./03-definitions-and-domain-concepts.md#structure)

### OI-10 - Correcting a wrong balance

**Question:** How is a wrong balance reported and corrected?

**Decision record, 2026-10-04:** Option A: a Loyalty Administrator persona, UC-03 Correct a Member's Points, a Corrected movement type, two new UC-02 flows (A3, A4), and a matrix column. Not chosen: B (fix only at the source), C (leave corrections out). Rationale: NFR-01's own measure implies upheld complaints, and the product needs a way to act on them. Open remainders: the team that holds the role and where members report a problem (markers in chunks 04 and 06a).

**Rule home:** [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### OI-11 - Exception flows and untested paths

**Question:** What does the member see when the balance or history cannot be shown, or the history is empty, and which paths need acceptance criteria?

**Decision record, 2026-10-04:** Option A: UC-01 E1, UC-02 A2 and E1, and one acceptance criterion per untested path. Not chosen: B (rely on the general error rule in chunk 11). Rationale: a wrong figure shown as real breaks Objective 1.

**Rule home:** [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance)

### OI-12 - Movement details

**Question:** Which date does a movement show, and what does opening a movement show?

**Decision record, 2026-10-04:** Option A: the date is the day of the purchase or refund; a purchase shows date, branch, amount paid, and points; a refund shows date, refunded purchase, amount refunded, and points; POS Records also sends purchase date and branch. Not chosen: B (show only what POS Records sends today). Rationale: members check points against receipts (Objective 2).

**Rule home:** [06a / UC-02 Main Flow](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-13 - External systems listed consistently

**Question:** How are POS Records and the Refunds Portal recorded across Dependencies, Integrations, and UC-02?

**Decision record, 2026-10-04:** Option A: both systems appear in both tables, both are supporting actors of UC-02, and both are Critical. Not chosen: B (keep each in one table). Rationale: both are hard prerequisites; two more rows to keep in step.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### OI-14 - Timeliness of earned points

**Question:** When must earned points show to the member?

**Decision record, 2026-10-04:** Option A: NFR-03, by the end of the purchase day (branch local time), and the balance screen says when new points show. Not chosen: B (within 1 hour), C (no target). Rationale: builds on the same-day assumption. Open remainder: the time by which POS Records reports a day's purchases (marker in chunk 02, Assumptions / Constraints).

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-15 - Availability, performance, usability

**Question:** Which availability, performance, and usability expectations apply?

**Decision record, 2026-10-04:** Option A: NFR-04, NFR-05, and NFR-06, with their measures left for the business to set. Not chosen: B (leave them to the SDD). Rationale: Objective 2's "at any time" needs an availability row; measures are never invented. Open remainder: three measures (markers in chunk 10).

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-16 - Security and privacy

**Question:** Which security and privacy requirement protects members' purchase data?

**Decision record, 2026-10-04:** Option A: NFR-07, access bound to the Users & Use Cases Matrix, plus the data protection rules that apply. Not chosen: B (rely on the own-points rules). Rationale: the history shows personal purchase data. Open remainder: which rules apply and who owns them (marker in chunk 10).

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-17 - Retention and leaving the program

**Question:** How long is points history kept, and what happens when a member leaves?

**Decision record, 2026-10-04:** Option A: the full history is kept while the person is a member; when they leave, their points end and the history is deleted after a set period. Not chosen: B (keep only recent years), C (keep everything forever). Rationale: balances depend on every movement; the period needs legal input. Open remainder: the retention period (marker in chunk 03).

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### OI-18 - Measurable objectives and NFR-01

**Question:** How are the Business Objectives and NFR-01 measured and tested?

**Decision record, 2026-10-04:** Option A: Objective 1 is measured by NFR-01; Objective 2 by a fall in calls to branches; NFR-01 is defined against reported purchases and refunds. Not chosen: B (keep the wording). Rationale: one home for the accuracy measure, and testers get a check before go-live. Open remainder: the target and the period (markers in chunk 01).

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### OI-19 - Facts stated twice

**Question:** Should the take-back rule and redemption each have one home?

**Decision record, 2026-10-04:** Option A: chunk 01 links to the take-back rule in UC-02, and chunk 04 links to Wishlist item 1. Not chosen: B (keep both copies). Rationale: both facts are likely to change soon, so each change is made once.

**Rule home:** [01 / Executive Summary](./01-executive-summary-and-context.md#executive-summary)

### OI-20 - Take-back after a correction

**Question:** What happens when a take-back would push the balance below 0 because a correction already removed points?

**Decision record, 2026-10-05:** Option A: a take-back never takes the balance below 0; the system takes back at most the balance. Not chosen: B (allow a negative balance), C (send the case to the Loyalty Administrator). Rationale: keeps the chunk 03 rule with no new flow; the member keeps the difference while points cannot be spent. Raised by consistency check CF-02.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-21 - Staff sign-in

**Question:** How does a Loyalty Administrator sign in?

**Decision record, 2026-10-05:** Option A: another product or team provides staff sign-in, recorded as a hard dependency, and the Out of Scope line covers it. Not chosen: B (the member sign-in also serves staff), C (this product provides it). Rationale: mirrors OI-05 without assuming the member sign-in serves staff. Open remainder: the owning product or team (marker in chunk 02, Dependencies). Raised by consistency check CF-08.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### OI-22 - Leaver notice and the other outside parties

**Question:** How does the product learn that a member left, and where are the membership and go-live balance parties recorded?

**Decision record, 2026-10-05:** Option A: two chunk 08 rows, one for member sign-in and membership (including the date a member left) and one for the go-live balances. Not chosen: B (dependencies only). Rationale: applies the OI-13 rule to both parties and names a source for the leaver rule. Raised by consistency check CF-09.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### OI-23 - A former member's balance

**Question:** What balance does a former member have, given that their points end and no new movements are added?

**Decision record, 2026-10-05:** Option B: leaving adds no movement; a former member has no points balance, only the history kept for the retention period. Not chosen: A (an Ended movement that brings the balance to 0). Rationale: keeps the OI-17 wording and needs no new movement type; the sum rule covers members only. Raised by consistency check CF-15.

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### OI-24 - Corrections for missing purchases

**Question:** How does a correction for a missing purchase stay consistent when the purchase is later reported or refunded?

**Decision record, 2026-10-05:** Option A: the correction names the purchase reference, and the purchase then counts as having earned the corrected points; a later report earns nothing more, and refunds follow the UC-02 rules. Not chosen: B (unlinked corrections fixed by hand), C (no corrections for missing purchases). Rationale: balances stay equal to what the net spend earns without manual checks. Raised by consistency check CF-18.

**Rule home:** [06b / UC-03 Business Rules & Constraints](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### OI-25 - Entering a missing purchase

**Question:** What does the Loyalty Administrator enter for a missing purchase, so that its refunds can be worked out?

**Decision record, 2026-10-05:** Option A: the purchase reference, date, branch, and amount paid instead of the points; the system works out the points with the earning rule. Not chosen: B (a second take-back rule), C (wait for the report). Rationale: one take-back rule covers every purchase. Raised by consistency check CF-22.

**Rule home:** [06b / UC-03 Main Flow](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### OI-26 - A purchase that already shows

**Question:** What happens when a correction names a purchase that already earned points, or one later reported for another member?

**Decision record, 2026-10-05:** Option A: exception flow E4 refuses a correction for a purchase that already shows in any member's history; a later report for another member earns points for that member as usual. Not chosen: B (check this member only), C (no check). Rationale: keeps "a purchase earns points once" true without taking points from another member. Raised by consistency check CF-23.

**Rule home:** [06b / UC-03 Alternate & Exception Flows](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### OI-27 - Rejoining members

**Question:** What balance does a former member have when they rejoin?

**Decision record, 2026-10-05:** Option A: they start with no points, the balance counts only movements from the day they rejoin, and the membership party also reports rejoining. Not chosen: B (restore old points), C (a new membership). Rationale: keeps the rule that a leaver's points end. Raised by consistency check CF-24.

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### OI-28 - The Loyalty Administrator role

**Question:** How does the product know who holds the Loyalty Administrator role?

**Decision record, 2026-10-05:** Option A: the staff sign-in tells this product whether the signed-in staff member holds the role. Not chosen: B (the product keeps its own list). Rationale: mirrors the member sign-in and adds no use case. Raised by consistency check CF-25.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### OI-29 - Movements after a rejoin

**Question:** Which movements count and show for a member who left and rejoined, and can the Loyalty Administrator find a former member?

**Decision record, 2026-10-05:** Option A: UC-01, UC-02, and UC-03 count and show only the movements since the person last joined; earlier movements are kept until the retention period ends but not shown; the search finds only current members. Not chosen: B (show earlier movements with a label), C (staff see earlier movements). Rationale: the history always adds up to the balance (NFR-01) and no flow is added. Raised by consistency check CF-28.

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### OI-30 - Purchases from before a rejoin

**Question:** Can a purchase made before a member last joined still change their new balance, through a refund or a correction?

**Decision record, 2026-10-05:** Option A: such a purchase never changes the current balance; its refunds take back no points (UC-02 BR-7), and UC-03 refuses a missing purchase dated before the day the member last joined (E5). Not chosen: B (take back from the current balance), C (no new rule). Rationale: the earlier membership's points already ended. Raised by consistency check CF-34.

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### OI-31 - Who the purchases-before-a-rejoin rule covers

**Question:** Do UC-02 BR-7 and UC-03 E5 cover only members who rejoined, or also the day each member first joined, a date nothing supplies?

**Decision record, 2026-10-05:** Option A: both rules cover a rejoin only. BR-7 now reads "before the day the member last rejoined", and E5 applies when the member has rejoined and the missing purchase is dated before the day they last rejoined. Not chosen: B (the membership party also sends the day each member joined, once at go-live for existing members). Decided by the product manager, who accepted the recommendation. Rationale: matches chunk 03, the OI-30 decision, and both criteria, and needs no new data; purchases made before a first join stay outside the rule. Raised by consistency check CF-37.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#uc-02-view-points-history)

### OI-32 - Purchases made on the go-live date

**Question:** The opening balance was dated "on the go-live date", "before go-live", and "at go-live", while UC-02 BR-8 exempts only purchases made before the go-live date. Does the opening balance include the purchases made on the go-live date, which reach the product that same day and earn points?

**Decision record, 2026-10-05:** Option A: the opening balance is the points a member held at the start of the go-live date, and purchases made on or after that date earn points in this product. 03 Movement types, 02 Dependencies and 08 Integrations (Points balances at go-live) now say "at the start of the go-live date", and UC-02 gained AC-19. Not chosen: B (the points held at the end of the go-live date; purchases made that day earn nothing here, BR-8 and AC-14 widen to "on or before"). Decided by the product manager, who accepted the recommendation. Rationale: matches BR-8, AC-14, and Challenge 2 as written, adds no scope, and keeps NFR-03 true on the go-live date; the Marketing team's handover must stop at the start of that date. Raised by consistency check CF-40.

**Rule home:** [03 / Movement types](./03-definitions-and-domain-concepts.md#movement-types)

### OI-33 - The maintenance exclusion in NFR-04

**Question:** NFR-04 excluded "maintenance announced to members in advance" from the 60 minutes a month, but nothing in the BRD announces anything to members, and the exclusion had no notice period or limit. How is maintenance counted?

**Decision record, 2026-10-05:** Option A: every disruption counts, planned maintenance included; the NFR-04 measure now reads "No more than 60 minutes of disruption per month, planned maintenance included." Not chosen: B (keep the exclusion with a notice period, a member notice, and a monthly limit), C (exclude only a fixed maintenance window). Decided by the product manager, who accepted the recommendation. Rationale: keeps the 60 minutes, makes NFR-04 testable, and adds no member notice; disruptive maintenance now counts toward the 60 minutes. Raised by consistency check CF-41.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-34 - A missing purchase dated before the go-live date

**Question:** What does UC-03 do when the Loyalty Administrator enters a missing purchase dated before the go-live date? The earning rule would give it points, while its points are already part of the opening balance and its refunds take nothing back (UC-02 BR-8).

**Decision record, 2026-10-05:** Option A: refuse it. UC-03 gained E6 (purchase before go-live) and AC-12, and 03 Movement types now says that a purchase made before the go-live date earns no points in this product, because its points are part of the opening balance. Not chosen: B (accept it with full points and let its refunds take points back), C (accept it with full points and keep BR-8 as it is). Decided by the product manager, who accepted the recommendation. Rationale: keeps the go-live rule and BR-8 whole, mirrors E5 for a rejoin (OI-30), and creates no points a refund can never take back; a wrong opening balance is fixed with a plain correction that names no purchase. Raised by consistency check CF-47.

**Rule home:** [06b / UC-03 Alternate & Exception Flows](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### OI-35 - A member who leaves and rejoins on the same day

**Question:** Movements carry a date only, and the product receives only the date a member left or rejoined. When a member leaves and rejoins on the same day, is a movement added earlier that day earlier history or a movement from the rejoin day?

**Decision record, 2026-10-05:** Option A: a member who rejoins on the day they left counts as rejoining on the next day. Chunk 03 Membership end and data retention carries the rule, and UC-02 gained AC-22. Not chosen: B (a movement added before the member left never counts again, even when dated on the rejoin day), C (the Customer Accounts team never lets a member rejoin on the day they left). Decided by the product manager, who accepted the recommendation. Rationale: settles the case with the dates the product already receives, so every rejoin rule stays date-based; a member who leaves and rejoins on the same day earns no points on purchases made later that day. Raised by consistency check CF-54.

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### OI-36 - The rest of the day a member leaves and rejoins

**Question:** A member who rejoins on the day they left counts as rejoining on the next day (OI-35). What are they for the rest of that day, and what does UC-02 AC-22 test?

**Decision record, 2026-10-05:** Option A: until the next day they count as a former member, so UC-01 E2, UC-02 E2, and UC-03 E1 apply. Chunk 03 carries the rule; UC-01 gained AC-6, UC-02 gained AC-23 and a reworded AC-22 (the purchases are on the leave day and the history is opened the next day), and UC-03 gained AC-14. Not chosen: B (a member with no movements that day, and a new UC-03 exception flow that refuses corrections), C (as B, with corrections recorded that never count). Decided by the product manager, who accepted the recommendation. Rationale: follows the OI-35 rule, reuses existing flows, and no correction can be recorded and then never count; for the rest of that day the member is told they have no loyalty points account. Raised by consistency check CF-57.

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### OI-37 - The amount paid for the other member's take-back

**Question:** When POS Records reports a corrected missing purchase for another member, a refund takes back points from both members (TD-46). Which amount paid does the other member's take-back use: the amount the Loyalty Administrator entered, or the amount POS Records reported?

**Decision record, 2026-10-05:** Option A: each member's take-back uses the amount paid on their own movement; for the other member, the amount POS Records reported. UC-03 BR-6 gained one sentence, and UC-03 gained AC-17 (40 EUR entered, 50 EUR reported, a 10 EUR refund takes back 10 points from each). Not chosen: B (both take-backs use the entered amount). Decided by the product manager, who accepted the recommendation. Rationale: keeps UC-03 BR-5 (the other member earns as usual) and NFR-01 true for each balance; one refund can take back different points from the two members. This refines the TD-46 decision for the other member. Raised by consistency check CF-58.

**Rule home:** [06b / UC-03 Business Rules & Constraints](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### TD-40 - How the Loyalty Administrator finds a member

**Question:** What identifies the member the Loyalty Administrator looks for in UC-03 step 1, and does Member sign-in and membership give that detail to this product? (Raised by consistency check CF-42.)

**Decision record, 2026-10-05:** The product manager supplied, as test-fixture values, that every member has a member number that the Customer Accounts team gives when the member joins, that Member sign-in and membership sends it to this product, and that the Loyalty Administrator finds the member by that number. UC-03 step 1, the chunk 08 Member sign-in and membership row, and the Glossary (Member number) carry it. The search covers that one detail only.

**Rule home:** [06b / UC-03 Main Flow](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### TD-44 - Movements worth 0 points

**Question:** What happens when a purchase earns 0 points, a refund takes back 0 points, or a member held 0 points at go-live? (Grill-me session, question 1.)

**Decision record, 2026-10-05:** None of them adds a movement. 03 Overview and Movement types (Opening balance) carry the rule; UC-02 gained AC-24 and AC-25. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [03 / Overview](./03-definitions-and-domain-concepts.md#overview)

### TD-45 - A purchase made before go-live and reported later

**Question:** What happens when POS Records reports, after go-live, a purchase made before the go-live date? (Grill-me session, question 2.)

**Decision record, 2026-10-05:** The earning rule and the go-live boundary are confirmed as written: such a purchase leaves the balance unchanged and adds no movement. UC-02 gained AC-26 to test it. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#uc-02-view-points-history)

### TD-46 - Refunds of a corrected missing purchase

**Question:** When a corrected missing purchase is also reported by POS Records, which amount paid do refunds use, and whose points does a refund take back? (Grill-me session, question 3.)

**Decision record, 2026-10-05:** Refunds use the amount paid the Loyalty Administrator entered, and a later report for the same member does not change it. If the purchase is reported for another member, a refund takes back points from both members, each under the UC-02 rules. UC-03 gained BR-6, AC-15, and AC-16, and 03 Structure gained one sentence. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [06b / UC-03 Business Rules & Constraints](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### TD-47 - A late rejoin notice

**Question:** What happens when POS Records reports a purchase made on the rejoin day before this product learns of the rejoin? (Grill-me session, question 5.)

**Decision record, 2026-10-05:** The purchase earns points once the product learns of the rejoin; the rules stay date-based. 03 Membership end and data retention carries the rule, the NFR-03 measure counts from the day the product learns of the rejoin when that is later, and UC-02 gained AC-27. No time for the rejoin notice was set, so no fact is needed. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### TD-48 - The Business Objective 2 measure

**Question:** Which month does the Business Objective 2 target measure, and how is the go-live month counted? (Grill-me session, question 6.)

**Decision record, 2026-10-05:** The 6th calendar month after the go-live month, compared with the monthly average of the 3 calendar months before the go-live month; the go-live month is left out of both. The values 50%, 6, and 3 stay as supplied for TD-09. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### TD-49 - What counts as disruption in NFR-04

**Question:** What does disruption mean in the NFR-04 measure? (Grill-me session, question 7.)

**Decision record, 2026-10-05:** Minutes in which members cannot open their balance (UC-01) or their history (UC-02); the 60 minutes and planned maintenance included (OI-33) stay. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### TD-50 - The screens NFR-06 covers

**Question:** Which screens must meet WCAG 2.1 level AA? (Grill-me session, question 7.)

**Decision record, 2026-10-05:** The screens of UC-01 and UC-02, as the rest of the NFR-06 row says. No level is set for the Loyalty Administrator screens; adding one would be new scope. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### TD-51 - NFR-07 and the Monthly corrections report

**Question:** Who may open the Monthly corrections report, and how is NFR-07 tested for staff? (Grill-me session, question 8.)

**Decision record, 2026-10-05:** Only the Loyalty Administrator (chunk 09) may open the report. The NFR-07 measure also tests that a staff member without the Loyalty Administrator role cannot open UC-03 or the report. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### TD-52 - Partial refunds with cents

**Question:** Do the UC-02 criteria test BR-3 when refunds leave cents? (Grill-me session, question 9.)

**Decision record, 2026-10-05:** BR-3 is confirmed as written; UC-02 gained AC-28 and AC-29, the 12.80 EUR example with two refunds of 0.80 EUR. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#uc-02-view-points-history)

### TD-53 - What the Monthly corrections report counts

**Question:** Does the Monthly corrections report count upheld complaints, when one complaint can need several corrections? (Grill-me session, question 10.)

**Decision record, 2026-10-05:** It counts corrections. A month with no corrections is a month with no upheld complaints, which is what NFR-01 needs; the chunk 09 row says so. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

### TD-54 - The objectives UC-02 supports

**Question:** Which Business Objectives does UC-02 support? (Grill-me session, question 11.)

**Decision record, 2026-10-05:** Business Objectives 1 and 2: members trust a balance whose movements they can see, and they check each movement against their receipts online instead of calling a branch. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [06a / UC-02 Why](./06a-use-cases-member.md#uc-02-view-points-history)

### TD-55 - The date UC-01 shows

**Question:** Which date does UC-01 step 2 show: the last movement recorded or the newest by date? (Grill-me session, question 11.)

**Decision record, 2026-10-05:** The date of the newest movement, the first one in the history (UC-02 step 2). UC-01 step 2 and AC-1 now say so. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [06a / UC-01 Main Flow](./06a-use-cases-member.md#uc-01-view-points-balance)

### TD-56 - A later refund after a capped take-back

**Question:** When a take-back was capped at the balance (BR-6), does a later refund of the same purchase take back what the cap left? (Grill-me session, question 12.)

**Decision record, 2026-10-05:** Yes, as BR-3 and BR-6 already say: the later refund takes back what the cap left, as far as the balance allows. UC-02 gained AC-30. Decided by the product manager in the grill-me session, accepting the interviewer's recommended answer.

**Rule home:** [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#uc-02-view-points-history)

### TD-27 - Unique references and the Refunds Portal reporting time

**Question:** Are purchase and refund references unique and never reused, does the Refunds Portal name the refunded purchase by its POS Records purchase reference, and how many minutes after payment does the Refunds Portal report a paid refund? (Raised by consistency check CF-10.)

**Decision record, 2026-10-05:** The product manager confirmed, as test-fixture values, that the Store Operations team and the Finance team confirm both references are unique and never reused, that the Refunds Portal names the refunded purchase by its POS Records purchase reference, and that the Refunds Portal reports a paid refund within 15 minutes of payment. Recorded as Assumptions / Constraints 2 and 3 in chunk 02. The 15 minutes leave room inside the 1 hour of NFR-02.

**Rule home:** [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)

### TD-02 - Opening balance and corrections in the history

**Question:** What do UC-02 steps 2 and 4 show for an Opening balance or a Corrected movement, and does a correction for a missing purchase show its purchase reference? (Raised in chunk 13 Reviewer Notes and by consistency check CF-03.)

**Decision record, 2026-10-05:** The product manager accepted the recommendation: a correction shows the label Correction, its day, points, reason, and, for a missing purchase, the purchase reference (UC-02 A3); an Opening balance shows its label, the go-live date, and its points (UC-02 A5); AC-4 and AC-5 cover purchase and refund movements, and AC-9 and AC-10 cover the two labels. Rationale: the history stays complete for every movement type.

**Rule home:** [06a / UC-02 Alternate & Exception Flows](./06a-use-cases-member.md#uc-02-view-points-history)

### TD-03 - Refunds Portal dependency status

**Question:** Does the Refunds Portal dependency stay Confirmed while its owner is unknown? (Raised in chunk 13 Reviewer Notes and by consistency check CF-04.)

**Decision record, 2026-10-05:** The product manager accepted the recommendation: Status is Pending until the owner is named and confirms. Open remainder: the owner (marker in chunk 02, Dependencies; TD-03 stays open).

**Decision record, 2026-10-05 (second stage):** The product manager named the Finance team as the owner and confirmed the dependency, as test-fixture values. Status is now Confirmed. This completes the record above; nothing remains open.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### TD-15 - Signed-in customers who are not members

**Question:** What does a signed-in customer who is not, or is no longer, a member see? (Raised in chunk 13 Reviewer Notes.)

**Decision record, 2026-10-05:** The product manager accepted the recommendation: UC-01 E2 and UC-02 E2 tell them they have no loyalty points account and show no balance or history, with UC-01 AC-4 and UC-02 AC-11. Rationale: the flow covers the case whether or not the sign-in serves non-members.

**Rule home:** [06a / UC-01 Alternate & Exception Flows](./06a-use-cases-member.md#uc-01-view-points-balance)

### TD-16 - Counting upheld complaints

**Question:** Who counts the balance complaints upheld each month for NFR-01? (Raised in chunk 13 Reviewer Notes and by consistency check CF-11.)

**Decision record, 2026-10-05:** The product manager accepted the recommendation: a Monthly corrections report for the Loyalty Administrator in chunk 09, and NFR-01 counts upheld complaints in it. Not chosen: chunk 09 stays not applicable and NFR-01 names someone outside the product. Rationale: it uses data the product already keeps (UC-03 BR-3).

**Rule home:** [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

## Marker register

### Background and Context / Problem Statement (chunk 01)

**Resolution (2026-10-05):** The section now states the current state the source implies: members call a branch to check their points. The trigger question was dropped. Settled by the product manager (TD-17).

**Rule home:** [01 / Background and Context / Problem Statement](./01-executive-summary-and-context.md#background-and-context--problem-statement)

### Facts (chunk 02)

**Resolution (2026-10-05):** The section points to where the facts already live (chunk 03 earning rule, Dependencies, chunk 08). Settled by the product manager (TD-18).

**Rule home:** [02 / Facts](./02-glossary-assumptions-facts.md#facts)

### Challenges (chunk 02)

**Resolution (2026-10-05):** Two challenges derived from the BRD: complete and timely reports from POS Records and the Refunds Portal, and an exact carry-over at go-live. Settled by the product manager (TD-19).

**Rule home:** [02 / Challenges](./02-glossary-assumptions-facts.md#challenges)

### Refunds Portal Needed before (chunk 02)

**Resolution (2026-10-05):** The proposal "Build of UC-02" was confirmed. Settled by the product manager (TD-03).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### UC-02 A4 reporting channel (chunk 06a)

**Resolution (2026-10-05):** Members report a points problem at any branch, which passes it to the Loyalty Administrator. Settled by the product manager (TD-07), who accepted that some contact with branches remains.

**Rule home:** [06a / UC-02 Alternate & Exception Flows](./06a-use-cases-member.md#uc-02-view-points-history)

### UC-03 proposed exception flows and criteria (chunk 06b)

**Resolution (2026-10-05):** Exception flows E1 to E3 and acceptance criteria AC-2 to AC-4 were confirmed as proposed. Settled by the product manager (TD-08).

**Rule home:** [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

### Data Tables and Filtration (chunk 11)

**Resolution (2026-10-05):** Both proposals were confirmed: 20 movements per page with no export, and no filters on the points history. Settled by the product manager (TD-22).

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### Member sign-in and membership owner (chunk 02)

**Resolution (2026-10-05):** The Customer Accounts team lets members join and sign in, is in place before the build of UC-01, and tells this product when a member leaves or rejoins. Status set to Confirmed. Test-fixture value supplied by the product manager (TD-01).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### Staff sign-in owner (chunk 02)

**Resolution (2026-10-05):** The Retail IT team lets Loyalty Administrators sign in, is in place before the build of UC-03, and tells this product who holds the Loyalty Administrator role. Status set to Confirmed. Test-fixture value supplied by the product manager (TD-28).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### Refunds Portal owner (chunk 02)

**Resolution (2026-10-05):** The Finance team owns the Refunds Portal and confirmed it is in place before the build of UC-02. Status set to Confirmed. Test-fixture value supplied by the product manager (TD-03).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### POS Records owner (chunk 08)

**Resolution (2026-10-05):** The Store Operations team provides and owns POS Records and confirmed it is in place before the build of UC-01. The chunk 02 Dependencies row is set to Confirmed. Test-fixture value supplied by the product manager (TD-04).

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### Points balances at go-live owner (chunk 02)

**Resolution (2026-10-05):** The Marketing team holds each member's points balance today and confirmed the balances can be handed over before go-live. Status set to Confirmed. Test-fixture value supplied by the product manager (TD-05).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### POS Records reporting time (chunk 02)

**Resolution (2026-10-05):** The Store Operations team confirmed that POS Records reports every member purchase by 22:00 (branch local time) on the day it is made; every branch closes by 21:00. Test-fixture values supplied by the product manager (TD-06).

**Rule home:** [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)

### Business Objective 2 target (chunk 01)

**Resolution (2026-10-05):** Calls to branches about points fall by 50% within 6 months after go-live, compared with the monthly average of the 3 months before go-live; branches count these calls in their daily call log. Test-fixture values supplied by the product manager (TD-09).

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### NFR-04 to NFR-07 measures (chunk 10)

**Resolution (2026-10-05):** NFR-04: no more than 60 minutes of disruption per month (TD-10). NFR-05: the balance and the first page of the history open within 2 seconds (TD-11). NFR-06: the screens meet WCAG 2.1 level AA (TD-12). NFR-07: members' personal data is handled under the GDPR, and the Data Protection Officer owns these rules (TD-13). Test-fixture values supplied by the product manager. GDPR, WCAG, and Data Protection Officer were added to the Glossary.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Former-member history retention (chunk 03)

**Resolution (2026-10-05):** A former member's points history is kept for 24 months after they leave, then deleted; a deletion request does not shorten this period, because the history backs complaint handling for that time. Test-fixture value supplied by the product manager (TD-14).

**Rule home:** [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention)

### Loyalty Administrator team (chunk 04)

**Resolution (2026-10-05):** The Customer Service team holds the Loyalty Administrator role. Test-fixture value supplied by the product manager (TD-20).

**Rule home:** [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors)

### Primary Color (chunk 11)

**Resolution (2026-10-05):** The primary color is #1F6FEB. Test-fixture value supplied by the product manager (TD-21). The project has no UI/UX constitution, so chunk 11 holds the value.

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### Language & Locale (chunk 11)

**Resolution (2026-10-05):** English only; dates show as DD/MM/YYYY; amounts show in EUR with two decimals. No right-to-left language is in scope. Test-fixture values supplied by the product manager (TD-23).

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

## Business review register

None.

## Walkthrough and delegation history

### Action entries

**Migration, 2026-10-04:** BRD v1.0, written in an earlier version of this template (../source/brd-loyalty-points/), was migrated to the current template as v1.1, written whole in chunks mode. Sections the template requires and the source lacks were flagged inline: Background and Context / Problem Statement, Facts, and Challenges. New template columns the source did not fill (dependency owner and needed-before, integration provider) and UI/UX standards it did not state were flagged inline, as gaps or as proposals. The source's "Technical Inputs for the SDD: None stated by the source." was dropped, because the template omits that sub-section when the source has no technical mandates. The source to-do's check run (2026-09-24) and its mockup rows were carried into the new chunk 14.

**Acceptance loop, 2026-10-04:** OI-02 to OI-19 were presented in five batches of up to four. The product manager accepted every recommendation. OI-10's Recommended Answer did not cover the new persona's journey or three template sub-sections of UC-03 (Alternate & Exception Flows, Future Enhancements, UI/UX): the journey was derived from UC-03, the exception flows were written as proposals with clarification markers, and the other two sub-sections take the template defaults.

**Editorial fixes from the Reviewer Notes, 2026-10-04:** chunk 05 Member Journey split into two sentences; chunk 05 Summarized Workflow gained "The member signs in." as step 1, matching Figure 1 and the journey; chunk 08 POS Records business purpose now names its actor. No fact changed.

**Consistency check Run 2, 2026-10-05:** a full run over chunks 00-13 found 14 issues (CF-01 to CF-14). Six were corrected because they only carry accepted decisions or are mechanical: CF-01, CF-05, CF-06, CF-07, CF-12, and CF-14, plus the UC-02 part of CF-13. Under CF-07, the accepted items in chunk 13 were reduced to their heading and status line, as the chunk 13 register rule asks; their question, options, choice, and rationale are recorded above. Three business ambiguities were raised as OI-20 to OI-22 and walked through the same acceptance loop: the product manager accepted every recommendation. CF-03, CF-11, and the UC-03 part of CF-13 point at the open rows TD-02, TD-16, and TD-08. CF-04 and CF-10 wait for facts (TD-03, TD-27).

**Consistency check Run 3, 2026-10-05:** a scoped recheck of chunks 00-06b, 08, 10, 13, and the master confirmed every Run 2 correction and the OI-20 to OI-22 decisions, and found 5 new issues (CF-15 to CF-19). CF-16 and CF-19 carry OI-22 (and the OI-13 rule) and were corrected. CF-17 removed Reviewer Notes in chunk 13 that described fixes already applied: the chunk 05 and chunk 08 editorial fixes (recorded in the 2026-10-04 entry above) and the chunk 03 Taken back wording, which OI-06 replaced. Two business ambiguities were raised as OI-23 and OI-24; the product manager accepted both recommendations.

**Consistency check Run 4, 2026-10-05:** the third and last check run of this session, scoped to chunks 00, 02, 03, 06b, 08, 13, and the master. It confirmed CF-16, CF-17, CF-19, OI-23, and OI-24, and found 7 issues (CF-20 to CF-26). CF-20 and CF-21 carry OI-24 into chunk 03 Structure and UC-03 AC-1 and AC-5, and CF-26 fixed a broken table cell in chunk 14; all three were corrected after the run, so the next session's first check run rechecks them. CF-22 to CF-25 were raised as OI-25 to OI-28 and are not yet reviewed: the session's three check runs are used, so they wait for the next session with their TD rows (TD-31 to TD-34).

**To-do step 1, 2026-10-05 (BRD v1.2):** OI-25 to OI-28 were walked through the acceptance loop, and the product manager accepted every recommendation. The open to-do rows were then walked through, P1 first, in batches of up to four. Rows with a recommendation the files support were decided by accepting it: TD-02, TD-03 (Needed before and Status), TD-07, TD-08, TD-15, TD-16, TD-17, TD-18, TD-19, and TD-22. Sixteen rows need a fact or a business target that no file holds, so no recommendation was possible and they stay Open: TD-01, TD-03 (owner), TD-04, TD-05, TD-06, TD-09, TD-10, TD-11, TD-12, TD-13, TD-14, TD-20, TD-21 (the brand color: the source records none and the skill has no default), TD-23, TD-27, and TD-28.

**Consistency check Run 5, 2026-10-05:** the first check run of the to-do step 2 session, full over chunks 00-13. It found 7 issues (CF-27 to CF-33). CF-27, CF-29, CF-30, and CF-32 carry decisions already taken (OI-26, TD-16, TD-02, TD-03, TD-15, OI-10, and the OI-11 rule) and were corrected; CF-31 (Tables index) and CF-33 (TD-01 wording in chunk 14) are mechanical. CF-28 was raised as OI-29 and walked through the acceptance loop: the product manager accepted the recommendation.

**Consistency check Run 6, 2026-10-05:** a scoped recheck of chunks 00, 03, 04, 06a, 06b, 13, and the master confirmed the Run 5 corrections and OI-29, and found 3 issues (CF-34 to CF-36). CF-35 and CF-36 carry OI-29 and OI-26 (with the OI-11 rule) and were corrected. CF-34 was raised as OI-30; the product manager accepted the recommendation.

**Consistency check Run 7, 2026-10-05:** the third and last check run of the to-do step 2 session, scoped to chunks 00, 03, 06a, 06b, 13, and the master. It confirmed CF-35, CF-36, and OI-30, and found 3 issues (CF-37 to CF-39). CF-38 carries the OI-03 decision record (refunds of purchases made before go-live take nothing back) into chunk 03 and UC-02 BR-8 and AC-14, and was corrected after the run. CF-39 fixed stale evidence cells in chunk 14. CF-37 was raised as OI-31 and is not yet reviewed: the session's three check runs are used, so it waits for the next session with TD-37, and the next session's first run rechecks CF-38.

**To-do step 1 finished, 2026-10-05 (BRD v1.3):** OI-31 was walked through the acceptance loop, and the product manager accepted the recommendation. The 16 rows that needed a fact no file held were then walked through, P1 first, in four batches of four: TD-01, TD-28, TD-03, TD-04; TD-05, TD-06, TD-09, TD-10; TD-11, TD-12, TD-13, TD-14; TD-20, TD-21, TD-23, TD-27. For each, the product manager supplied a value consistent with the BRD and said it is a test-fixture value; each is recorded as such in the Marker register or the Clarification register above. No scope was added. Every to-do row is now Resolved, and no clarification marker is left in chunks 00-12.

**Consistency check Run 8, 2026-10-05:** the first check run of the to-do step 1 session, full over chunks 00-13. It confirmed CF-38 and the OI-31 change, and found 7 issues (CF-40 to CF-46). CF-40 and CF-41 were raised as OI-32 and OI-33 and walked through the acceptance loop in one batch: the product manager accepted both recommendations. CF-42 needed a fact (TD-40); the product manager supplied the member number as a test-fixture value. CF-43 carries the OI-11 rule (one acceptance criterion per untested path, with OI-06, OI-08, OI-14, and OI-20) into UC-01 AC-5 and UC-02 AC-15 to AC-18. CF-44 to CF-46 fixed chunk 14: the Downstream outputs waiting list, the mockup brief version, the step 1 evidence, the step 3 inputs, and a missing mockup row for the Monthly corrections report (MK-04).

**Consistency check Run 9, 2026-10-05:** a scoped recheck of chunks 00, 02, 03, 06a, 06b, 08, 10, 13, 14, the master, and the decision-log rule homes, with the references into them from 01, 04, 05, 07, 09, 11, and 12. It confirmed CF-40 to CF-46, OI-32, OI-33, and TD-40, and found 3 issues (CF-47 to CF-49). CF-47 was raised as OI-34 and walked through the acceptance loop: the product manager accepted the recommendation. CF-48 and CF-49 fixed chunk 14 (the step 1 evidence, and the Rechecked cells of CF-37 and CF-38).

**Consistency check Run 10, 2026-10-05:** the third and last check run of the to-do step 1 session, scoped to chunks 00, 03, 06b, 13, 14, the master, and the decision log, with the references into them. It confirmed CF-47 (OI-34), CF-48, and CF-49, and found 1 issue (CF-50): no criterion tested a refund of a corrected missing purchase. CF-50 carries OI-25 (with OI-24 and the OI-11 rule) into UC-03 AC-13 and was corrected after the run. The session's three check runs are used, so the next session's first run rechecks CF-50. To-do step 1 is complete: every TD row is Resolved, no open item is open, and no clarification marker is left.

**Consistency check Run 11, 2026-10-05 (BRD v1.4):** the first check run of the to-do step 2 session, full over chunks 00-13. It confirmed CF-50 and found 3 issues (CF-51 to CF-53). CF-51 carries OI-31 (the rejoin day) into chunk 03 Membership end and data retention and UC-02 AC-13. CF-52 carries the OI-11 rule with TD-02 into UC-02 AC-20 and AC-21 (opening a Correction or an Opening balance movement). CF-53 set the Rechecked cell of CF-39. These corrections are a content change: the BRD moved to v1.4.

**Consistency check Run 12, 2026-10-05:** a scoped recheck of chunks 00, 03, 06a, 14, the master, and the decision log, with the references into them. It confirmed CF-51 to CF-53 and found 3 issues (CF-54 to CF-56). CF-54 was raised as OI-35 and walked through the acceptance loop: the product manager accepted the recommendation. CF-55 and CF-56 fixed the CF-53 Rechecked cell and the 1.4 Changes Log row.

**Consistency check Run 13, 2026-10-05:** the third and last check run of the to-do step 2 session, scoped to chunks 00, 03, 06a, 13, 14, and the decision log, with the references into them. It confirmed CF-54 (OI-35), CF-55, and CF-56, and found 1 issue (CF-57), raised as OI-36. The product manager accepted the recommendation, and it was applied after the run. The session's three check runs are used, so OI-36 waits for the next session's first run to be rechecked; until then step 2 stays in progress.

**Grill-me session, 2026-10-05 (to-do step 3, BRD v1.4 to v1.5):** the product manager ran the step 3 prompt with the grill-me skill and confirmed that the session took place. For this test fixture the session was played non-interactively: the interviewer asked 12 questions in 3 rounds, each with a recommended answer, and the product manager accepted every recommendation and added no scope. The product manager confirmed a shared understanding and handed back 19 decisions. Thirteen changed the BRD and are recorded above as TD-44 to TD-56 (Changes Log 1.5). Six confirmed the BRD as written, with no change: a refund paid before a missing-purchase correction (UC-02 BR-5, UC-03 BR-4); UC-03 BR-2, step 1, and E4 to E6; the same-day rejoin rule, the 24 months, and UC-02 BR-7; NFR-05; the NFR-01 to NFR-03 measures with Assumptions 1 to 3; and the Why of UC-01 and UC-03.

**Consistency check Run 14, 2026-10-05 (BRD v1.5):** the first check run of the to-do step 3 session, full over chunks 00-13. It confirmed OI-36 and the 13 grill-me decisions, and found 2 issues (CF-58, CF-59). CF-58 was raised as OI-37 and walked through the acceptance loop: the product manager accepted the recommendation. CF-59 refreshed the version and the objectives in the chunk 14 step 3 prompt.

**Consistency check Run 15, 2026-10-05:** a scoped recheck of chunks 00, 06b, 13, 14, and the decision log, with the references into them. It confirmed CF-58 (OI-37) and CF-59 and found nothing new, so the session stopped. To-do steps 2 and 3 are complete, and conditions G1 to G3 of the delivery gate are met; steps 4 and 5 can start.

**Mockups, to-do step 4, 2026-10-05 (BRD v1.6):** G1 to G3 were verified in the files first. The product manager reported that every prototype in the Mockup coverage table was reviewed and approved: playable, with mobile, tablet, and desktop frames, and a play-through that passed on 2026-10-05. This is a test-fixture confirmation. The product manager named MK-01, MK-02, and MK-03; MK-04, the Monthly corrections report screen added by CF-46, was taken as part of "every prototype in the table". The product manager gave test-fixture Figma links for the rows that had none (MK-03, MK-04). The MK-03 link was recorded in the UC-03 UI/UX section.

**Consistency check Run 16, 2026-10-05 (BRD v1.6):** the first check run of the to-do step 4 session, full over chunks 00-13. It confirmed the step 4 change and found 1 issue (CF-60): the MK-03 row and the UC-03 step 5 row in chunk 14 stopped at BR-5. It was corrected in chunk 14 only, which is not a content change, so the run stands as the step 2 recheck. No screen changed, so no mockup row reopened.

**Product manager policy, 2026-10-05 (test fixture):** from this point, a new item raised by a consistency run, the reviewer, or grill-me that adds behavior beyond the BRD's current scope (a new flow, path, rule, screen, or capability) is rejected as out of scope for this release (test-fixture policy), and recorded only in chunk 13 and this register. An item that only clarifies existing behavior, or is mechanical, is accepted as before. Mockup rows and step 5 diagrams that an applied change reopens are re-approved or redone.

**Diagrams, to-do step 5, 2026-10-05 (BRD v1.7):** G1 to G3 were verified in the files first. Figure 2 (use cases: overview) was added to chunk 05, and the flowcharts of UC-02 (Figure 3) and UC-03 (Figure 4) to chunks 06a and 06b; UC-01 has 2 Main Flow steps and gets no flowchart. Each block was checked by reading it against mermaid-diagrams.md; no renderer was run.

**Consistency check Run 17, 2026-10-05 (BRD v1.7):** the first check run of the to-do step 5 session, full over chunks 00-13, with C9. It confirmed Figures 1 and 2 and CF-60, and found 3 issues (CF-61 to CF-63). All three only clarify existing behavior or are mechanical, so they were accepted under the product manager's policy: Figure 3 now shows the missing-purchase half of UC-02 A4 (CF-61), Figure 4 uses the E5 wording (CF-62), and the chunk 14 step 5 rows say how each rule is drawn (CF-63). No item was rejected.

**Consistency check Run 18, 2026-10-05 (BRD v1.7):** a scoped recheck of chunks 00, 06a, 06b, 14, and this log, with the references into them, C9 included. It confirmed CF-61 to CF-63 and found nothing new, so the session stopped. To-do steps 2 and 5 are complete, and conditions G1 to G5 of the delivery gate are met.

**Delivery chunks 15 and 16, 2026-10-06 (BRD v1.7):** G1 to G5 were verified in the files before chunk 15 and again before chunk 16. Chunk 15 (10 tasks in 3 waves) and chunk 16 (78 test cases) were written and raised no new item. The product manager did not ask for chunk 17, so it stays locked.

## Per-decision ecosystem assessments

None recorded.

## Part N handoff record

Not applicable: this BRD was written whole.

<!-- MASTER: loyalty-points-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
