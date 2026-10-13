# Review Panel Findings

**Tracker:** [review-comments-tracker.md](review-comments-tracker.md)
**Panel run:** 2026-10-10. Five cleared-context reviewers (BO, SME, PM, PA, DC), one pass each. No reviewer returned zero findings, so none was re-dispatched.
**Raw findings:** 50 (BO 9, SME 9, PM 11, PA 11, DC 10). Merged into 39 points (11 merges).

Each finding is kept as the reviewer returned it, under the point it ended in. A finding's own reviewer number (for example BO-03) is its position in that reviewer's output; a merged finding keeps its number only as a reference.

Left out (as each reviewer reported):
- BO: `Left out: 4 (CardPay commercial terms and fallback path; POS Records owner named in REFUNDS but open in LOYALTY; localisation, language and currency unpriced, with SDD assuming EUR; open paper requests at go-live with R-01 owner unassigned)`
- SME: `Left out: 5 (customer-care persona already a REFUNDS scope proposal; gift receipts where the recipient is not the card holder; goods return and stock re-entry once TD-03 is answered; branch-manager alerts by email only for staff on the shop floor; members' "missing points" claims for purchases made without their loyalty ID)`
- PM: `Left out: 3 (process gates: REFUNDS 14 step 3 In progress vs LOYALTY 14 step 3 Complete after equally inconclusive stand-in sessions; SDD v1.1 and LLD v1.0 derived while both BRD delivery gates are shut with P1 sign-in and CardPay items open; LOYALTY/NFR-04 has no target of its own and borrows REFUNDS/NFR-02 in SDD 14 §18.5)`
- PA: `Left out: 3 (synthetic availability probe depends on the open customer sign-in method; API-06 read-at-send fails once contact details are purged while messages are still queued; LLD v1.0 was built on SDD v1.1 with chunk 19 locked and 16 blocking markers open, while the LLD lineage rows themselves are consistent)`
- DC: `Left out: 4 (REFUNDS 09 "Daily" report frequency has no job, and the master E3 lacks the REFUNDS 09 format and period markers; §8.4.1 Figure 4 has no Approved-to-message edge; eligibility, decision-time and contact "settings" have no configuration catalogue in §11.5; 13a lists UC-02 requests newest first, an order the BRD does not state)`

---

## BO-01: Refunds made outside the portal never take loyalty points back

```
Reviewer: BO
Concern: Refunds outside the portal never take loyalty points back, so points leak on every off-portal refund
Where: LOYALTY 06a UC-02 BR-1; LOYALTY 02 §Glossary (Refund); REFUNDS 04 §Out of Scope (Cash refunds); REFUNDS 06a UC-01 E1, E4, BR-5; SDD 08 §12 (note under Table 8)
Why: LOYALTY 03 §Earning points gives points on every branch purchase, cash purchases included. Points come back only when the Refunds Portal reports a refund as paid, and SDD §12 consumes only `RefundRequestPaid`. But the Refunds Portal handles only card-paid branch purchases that are requested online inside the 30-day window. Cash refunds are out of scope. UC-01 E1 and E4 send late or non-card customers to "visit the branch". Partly-card purchases (BR-5) and in-person requests (REFUNDS 04 marker) are open. None of these refunds ever reaches Loyalty Points. A member can buy for cash, earn points, get a cash refund at the branch, and keep the points. LOYALTY 02 Glossary defines the Refunds Portal as the system that "handles refunds", as if it saw every refund. Neither BRD, nor the LOYALTY 13 integrations review, nor the SDD Cross-BRD reconciliation raises this. Once redemption ships, the leak costs real money, and LOYALTY/NFR-01 ("balance trust") is measured only by complaints, so it will never catch it.
Direction: Name every refund channel (portal, branch cash, branch card, online shop) and decide which one must report outcomes to Loyalty Points.
Direction: Or limit earning to purchases whose refunds the portal can see (card-paid), and state the leakage you accept.
```

Merged (SME-01):

```
Reviewer: SME
Concern: Points take-back only sees portal refunds; till, cash, in-person and online-shop refunds keep their points
Where: LOYALTY 06a UC-02 BR-1; LOYALTY 08 Integrations (Refunds Portal row, the only refund source); SDD 13d §17.4 Input; SDD 01 §4 R-08
Why: LOYALTY takes points back only when "the Refunds Portal reports that the refund of that purchase is paid". In a branch chain most refunds never go through that portal. Cash refunds and online-shop refunds are out of portal scope (REFUNDS 04 Out of Scope). Returns, exchanges and post-voids are rung up at the till. In-person requests after go-live are an open REFUNDS 04 marker. None of these reaches loyalty-points, so a member can buy, earn points, return the goods at the till and keep the points. The leak is small today but becomes a money liability once redemption ships (LOYALTY 12 Wishlist). The open in-person marker is known, but neither BRD names this loyalty consequence. SDD R-08 records only state and entry-point impacts inside refund-request, and LOYALTY NFR-01 (accuracy) cannot hold.
Direction: Make the take-back source "any refund of a member purchase": negative or return transactions from POS Records, not only the portal.
Direction: Add to LOYALTY 08 / 02 Dependencies a refund feed from POS Records and the online shop, or state the leak in scope as an accepted risk.
```

Merged (PA-03; its refund-outcome contract owner part is under DC-06):

```
Reviewer: PA
Concern: Refunds made outside the portal never reach loyalty, and no REFUNDS document owns the refund-outcome contract
Where: SDD 08 §12 (paragraph after the table: the LOYALTY 08 Refunds Portal row "is not an external integration"); REFUNDS 04 Out of Scope (cash refunds) and the Project Scope markers (in-person requests, open paper requests); REFUNDS 06a UC-01 E1 and E4 ("visit the branch"); REFUNDS 08; LOYALTY 02 Glossary "Refund" and Dependencies (owner open)
Why: LOYALTY earns 1 point per EUR on every branch purchase, whatever the payment method. It assumes every refund goes through the Refunds Portal (Glossary "Refund"). But REFUNDS sends cash-paid and out-of-window customers to the branch, excludes cash refunds, and leaves open whether in-person and paper requests are ever recorded. None of those refunds produce `RefundRequestPaid`, so members keep points on refunded purchases (LOYALTY/NFR-01, UC-02 BR-1). REFUNDS 08 does not list Loyalty as a receiver, and the LOYALTY 02 dependency owner is open (LOYALTY 14 TD-17). The SDD treats `RefundRequestPaid` as a complete feed. The SDD's E3 row for the in-person marker lists only "a staff-assisted entry point and a role", which misses the loyalty consequence.
Direction: Raise a cross-BRD item naming the producer-side owner of the refund-outcome contract and which refund channels must report to loyalty.
Direction: If branch refunds stay outside the portal, define a second inbound refund source to loyalty-points (POS refunds feed) behind an ACL, or record the gap as an accepted loyalty inaccuracy.
```

## BO-02: Neither product has a business case

```
Reviewer: BO
Concern: Neither product has a business case: no cost, savings, budget, or run-cost estimate
Where: REFUNDS 01 §Business Objectives; LOYALTY 01 §Background and Context (marker, TD-25 at P3); SDD 06 §9 AP-12; SDD 14 §18.1, §18.5 REFUNDS/NFR-02 row; SDD 02 §6
Why: REFUNDS sets time and loss targets but gives no figure for what paper handling, phone approvals, or the 18% refund complaints cost today, and no budget for the build. LOYALTY has no problem statement at all, and its to-do ranks that gap P3, below UI paging. The SDD calls itself "cost-aware" (AP-12) but prices nothing. Several cost-bearing choices are unpriced:
- a highly available IAM with at least 2 nodes and its own HA database, to meet 99.72% (§18.5);
- a managed container service, PostgreSQL HA and a secrets manager (all open in §6);
- up to 2 messages (email and SMS) per status change through MsgHub;
- CardPay fees per refund.

Loyalty volumes are unknown (§18.1 marker), so the loyalty side cannot be sized or priced at all. Nobody can say whether either product pays back, or defend the spend when the build is approved.
Direction: Add a cost and savings baseline per product (current handling cost, complaint cost, expected run cost) before the SDD leaves Draft.
Direction: Give LOYALTY's problem statement a P1 rank and make it a gate for the SDD's loyalty module.
```

## BO-06: Legal launch gates are not gating anywhere

```
Reviewer: BO
Concern: Legal launch gates (data-protection law, consumer refund rights, hosting location) are not gating anywhere
Where: SDD refunds-platform-sdd-master.md §E3 marker inventory (13a §Compliance row and 02 §6 hosting row, both "Blocks E3: No"); SDD 07 §11.3 (Promotion path); REFUNDS 10 NFR-04 (TD-26, P2); REFUNDS 06a UC-01 BR-8 (TD-19, P2); LOYALTY 03 §Member leaves the loyalty program
Why: The applicable data-protection law is unnamed in both BRDs. Whether consumer law gives refund rights beyond the 30-day window is open, and an answer could override the core eligibility rule. The hosting location (cloud region or on-premises), which decides data residency, is open too. Yet the SDD marks both the law and the hosting location as non-blocking "platform settings", and its Prod promotion gates list only CardPay and POS Records. Both BRDs rank these questions P2. The retention purges, erasure on leaving, and the lawful basis for member purchase data all wait on the law. As written, the product could pass BAT and go live with no legal sign-off and no residency decision.
Direction: Add a legal sign-off (data-protection law, consumer refund rights, residency of the hosting location) to the §11.3 Prod gate and to both BRDs' P1 rows.
Direction: Choose the hosting region only after the law is named, and record that order.
```

## BO-07: No human business owner has approved anything since v1.0

```
Reviewer: BO
Concern: No human business owner has approved anything since v1.0; cost-bearing choices were made by an answer policy
Where: REFUNDS 00 §Changes Log (v1.1, v1.2 Reviewed/Approved blank; Status In Review); LOYALTY 00 §Changes Log (v1.1 to v1.3 blank); SDD 00 (Reviewers/Approvers "Not named yet"); SDD decision-log §Action entries ("Unapproved source BRDs"); REFUNDS 14 Step 3 (0 decisions, 44 questions open); LOYALTY 14 Step 3 (marked Complete)
Why: v1.0 of each BRD was approved by the Head of Retail. Since then, about 60 business decisions were "accepted" by the full-autonomous run policy and stand-ins, not by the budget holder. Examples:
- planned maintenance counts toward 2 hours a month (REFUNDS OI-29), which pushes the SDD to an HA IAM;
- points never expire (LOYALTY D1);
- partial approval item by item (OI-30).

The SDD was derived from BRDs still In Review because the policy answered "Yes, proceed". An LLD (v1.0) is already built on it. The REFUNDS grill-me returned zero decisions, and the LOYALTY grill-me is marked Complete on two self-confirmations. If the Head of Retail later reverses any of these, the change runs through three documents and an implementation design, with no named person accountable.
Direction: Have a human business owner re-approve each BRD version, and name SDD reviewers and approvers before the LLD goes further.
Direction: Mark every policy-taken decision that carries cost or liability for explicit owner ratification.
```

## BO-08: No approval limits or escalation for refund decisions

```
Reviewer: BO
Concern: No financial control or central oversight: no approval limits, no head-office view, reconciliation owner is "operations"
Where: REFUNDS 06b UC-04 BR-2; REFUNDS 13 §Reviewer Notes (Scope proposal 2, portal-wide report); REFUNDS 09 §Reporting / Analytics; SDD 13b §17.2 (Reconciliation); SDD 12 §16.4.3; SDD 18 §Reviewer Notes (Scope proposal 1, OPERATOR role)
Why: A branch manager can approve any amount up to the requested total. There is no ceiling, no second approver for large refunds, and the item-return question is still open. The only control is the ban on deciding one's own request. The only report is per branch, and the portal-wide report that would let the Head of Retail track Objective 1 across 40 branches is still an undecided scope proposal. SDD payout reconciliation sends mismatches to "operations", but no role or person owns money discrepancies, and the operator role was declined. No one in the design is accountable for refund leakage, duplicate payouts, or abuse patterns across branches.
Direction: Set refund authority limits (amount thresholds, second approval) and name a finance owner for the reconciliation and NFR-01 reporting.
Direction: Decide Scope proposal 2 now, with a head-office or finance reader persona.
```

Merged (SME-08):

```
Reviewer: SME
Concern: A single branch-manager tier with no value limits, escalation or oversight actor
Where: REFUNDS 04 Personas; REFUNDS 06b UC-04 BR-1, BR-2; REFUNDS 07 matrix; SDD 12 §16.4.2
Why: Any branch manager can approve any amount for their branch, and the only control is the own-request rule (BR-6). Chain retail normally sets value thresholds above which an area or regional manager approves. Loss prevention watches refund patterns per store, customer and manager, for example collusion with a friend's receipt or repeat refunders. Area or regional managers, loss prevention and head office are absent from every persona list and role catalogue. The only report is per branch (REFUNDS 09), so abuse across branches or by one manager over time cannot be seen. The open cover-role marker addresses absence, not limits or oversight.
Direction: Add approval value thresholds with an escalation role (area manager) to UC-04 business rules.
Direction: Add a read-only oversight role (loss prevention / head office) with cross-branch refund pattern reporting.
```

## BO-09: The objectives do not measure complaints or portal adoption

```
Reviewer: BO
Concern: The objectives do not measure the problem that justifies the project (complaints) or whether customers use the portal
Where: REFUNDS 01 §Background and Context / Problem Statement, §Business Objectives; REFUNDS 09 §Reporting / Analytics
Why: The case for the project is that 18% of customer-care complaints are about slow or lost refunds. No objective sets a complaint target, and nothing measures how many refunds go through the portal rather than the branch. Adoption faces friction the documents create themselves:
- an undecided sign-in or account step;
- mandatory email and mobile entry;
- card-only, online-only eligibility;
- non-card and late customers sent back to the branch.

If customers keep going to branches, the "3 days" objective can be met on a small online minority while complaints and paper stay the same, and the project would still report success.
Direction: Add objectives for complaint reduction and for the portal's share of all refunds, each with a baseline and an owner who counts it.
Direction: Track the in-branch refund volume after go-live as the adoption measure.
```

## SME-02: The receipt number is treated as a unique purchase key across 40 branches

```
Reviewer: SME
Concern: The receipt number alone is treated as a unique purchase key across 40 branches
Where: REFUNDS 02 Assumption 1; REFUNDS 06a UC-01 step 1, E2; SDD 13a §17.1 Submit (unit-claim index on (tenant_id, receipt_number, item_line, unit_no)) and List of APIs (GET /v1/receipts/{receiptNumber}); SDD 11 §15.3 API-04 Request body
Why: Retail POS receipt numbers usually restart per store, per till or per day. The unique identifier is usually branch + till + date + transaction number, or a barcode. TD-08 only checks that every purchase has a number the customer can enter, not that the number is unique. If it is not unique, a lookup can return another branch's purchase, so the wrong branch manager decides and the payout goes to someone else's card reference. The unit-claim index can also block a different customer's items. A separate point: REFUNDS has no data-freshness assumption, unlike LOYALTY Assumption 1. If POS Records syncs branches overnight, a same-day request hits E2 and is wrongly told "check the number".
Direction: Confirm the POS receipt identifier structure with the Retail IT team; key lookups and the unit-claim index on the full identifier (or a printed barcode/QR).
Direction: Add a freshness assumption for receipt availability and a distinct "receipt not available yet" message.
```

## SME-03: "Paid" means the provider accepted the refund; post-Paid returns are unmodelled

```
Reviewer: SME
Concern: "Paid" means the provider accepted the refund, not that money reached the card; post-Paid returns are unmodelled
Where: REFUNDS 03 Refund request lifecycle (Paid); REFUNDS 06b UC-04 step 9; REFUNDS 01 Business Objective 1; SDD 13b §17.2 Figure 17 (Succeeded terminal) and Reconciliation
Why: Paid is set when CardPay reports success, and the customer is then sent a "Paid" email and SMS. A card refund typically takes several business days to appear on the statement. Customers told "paid" with nothing on their card produce the very complaints behind the 18% complaint figure (REFUNDS 01). An issuer can also return a refund after the acquirer accepted it (closed or replaced card). The SDD has no transition out of Succeeded or Paid, and reconciliation checks only that CardPay holds a record. Such a refund stays Paid, the points stay taken back, and the money is owed with nobody told. Objective 1 (3 days) is also measured at acceptance, not at crediting.
Direction: Paid message and UC-02 state the expected crediting time (confirmed with CardPay).
Direction: Add a post-Paid "returned by issuer" outcome fed by CardPay settlement or returns data, routed to the never-succeeds path.
```

Merged (PA-04):

```
Reviewer: PA
Concern: There is no compensation path when a money fact already marked Paid turns out to be wrong
Where: SDD 13b §17.2 Business Logic (Reconciliation; resolution rows under Send); SDD 13a §17.1 Figure 16 (Paid is terminal); SDD 13d §17.4 Business Logic (Corrections); SDD 12 §16.4.3 (operations insert resolution rows)
Why: The daily reconciliation can report "each `Succeeded` payout CardPay has no record of" and "each payout CardPay paid more than once". A `paid` resolution row inserted by operations also drives `PayoutSucceeded`. By the time any of these is detected, the request is Paid, the customer has been told, and loyalty has written an append-only TakenBack movement. The only reaction defined is an operations alert. There is no reversal event, no state that reopens a Paid request, and no ledger correction, and LOYALTY 03 has no correction movement either. The saga is forward-only across three modules with no compensating step for its one irreversible fact.
Direction: Define a compensating fact (for example a payout-reversed event) and which modules react to it, or declare explicitly that reversals are handled outside the system with a named owner.
Direction: Gate the `paid` resolution path with a second check (reconciliation match) before `PayoutSucceeded` is recorded.
```

## SME-04: Card chargebacks and disputes can produce a double refund

```
Reviewer: SME
Concern: Card chargebacks and disputes can produce a double refund that NFR-01 cannot see
Where: REFUNDS 10 NFR-01; SDD 13b §17.2 Reconciliation; SDD 11 §15.3 API-07
Why: A customer waiting on a slow or rejected portal refund often disputes the charge with their bank. If the dispute succeeds and the portal payout also succeeds, the retailer pays twice. Neither document mentions chargebacks or disputes. CardPay is consulted only for refund records (API-07), so reconciliation compares refunds with refunds and never flags a chargeback. "Zero duplicate payouts" can therefore be reported as met while money is lost. Branch managers also have no view of a dispute on the original payment when deciding.
Direction: Ask CardPay/acquirer for chargeback/dispute notifications on the original payment; block or hold a payout when one exists.
Direction: Extend the NFR-01 measure and reconciliation to count refund-plus-chargeback on the same original payment.
```

## SME-05: The CardPay question is too narrow and is answered only at promotion

```
Reviewer: SME
Concern: The CardPay question is too narrow for card-present branch sales, and it is answered only at promotion
Where: REFUNDS 02 Dependencies (CardPay row); SDD 01 §4 R-02; SDD 13b §17.2 Multi-Tenancy Specifications ("CardPay credentials per tenant"); SDD 11 §15.3 API-01
Why: The dependency asks only whether CardPay "supports refunds to the original card". Branch card sales are card-present, often under per-branch merchant IDs or terminals. A remote refund without the card must usually go through the same merchant account as the sale, may be limited in time by the acquirer, and may not be allowed at all for card-present transactions. The SDD assumes one CardPay credential set per tenant and a single online refund call. R-02 makes CardPay's confirmation a promotion gate, which comes after the payout module is built. A "no" or "only per branch MID" answer then reshapes UC-04, the payout module and the original-payment-reference marker late.
Direction: Expand the CardPay question: per-branch merchant accounts, card-present-to-remote refund rules, refund time limits, required original-transaction data.
Direction: Move the confirmation from a promotion gate to a pre-build gate for UC-04 and the payout module.
```

## SME-06: No VAT credit note, fiscal record or accounting posting for a refund

```
Reviewer: SME
Concern: No VAT credit note, fiscal record or accounting posting for a refund
Where: REFUNDS 08 Integrations (only Payment Provider, Notification Partner, POS Records); REFUNDS 10 (no fiscal/tax row); SDD 13a §17.1 Compliance (Local regulations); SDD 13b §17.2 Compliance ("Local regulations: none stated")
Why: The platform assumes EUR (SDD 01 §5), which points to EU markets. A refund of a branch sale there normally needs a credit note or refund receipt that corrects the VAT, and in several countries it must be recorded on the fiscal till or fiscal register. Each refund also has to be posted to the branch's books and matched against till and acquirer settlement. Neither BRD names the target country, a fiscal or VAT rule, an ERP or finance system, or a document the customer receives. Refunds paid outside the till could then be non-compliant and leave branch sales, VAT returns and stock records overstated.
Direction: Name the target market(s) and their refund document and fiscal-register duties in REFUNDS 10 or 03.
Direction: Add a finance/ERP posting integration (and refund document issuance) to REFUNDS 08 and the SDD integration set.
```

## SME-07: Payout exceptions and reconciliation money decisions have no business owner

```
Reviewer: SME
Concern: Payout exceptions and reconciliation money decisions have no business owner, only a technical operator
Where: REFUNDS 04 Personas; REFUNDS 06b UC-04 E1; SDD 12 §16.4.3; SDD 13b §17.2 Send, Result and Reconciliation; SDD 16 §20.1.7
Why: The design routes several money decisions to "operations" with database insert rights and no screen, approval or business role. These are recording "paid / not paid" resolutions, deciding that a Stopped payout is "paid another way", acting on reconciliation mismatch alerts and doing the monthly reconciliation "by hand from CardPay's statements". The branch manager is alerted after one day (UC-04 E1) but has no action available in any use case. In retail this work sits with a finance or refunds back-office team under dual control. As designed, a platform engineer can confirm money movements alone, and nobody is accountable for the NFR-01 count. SDD Scope proposal 1 addresses the technical access path, not the missing business actor.
Direction: Add a finance/refunds back-office persona owning payout exceptions, alternative payment and reconciliation, with a two-person rule on manual "paid" outcomes.
Direction: Give the branch-manager alert a defined next action, or route it to that back-office role instead.
```

Merged (PM-05):

```
Reviewer: PM
Concern: An unnamed operations team makes money decisions that appear in no persona, matrix or decision record
Where: SDD 12 §16.4.3 ("No operator role is named by either BRD"); SDD 13b §17.2 Send (resolution rows) and Reconciliation (monthly comparison by hand); SDD 13c §17.3 Select (operations alert when no branch manager exists); SDD 16 §20.1.7; SDD master §E3 inventory, 20.1.7 row ("No"); REFUNDS 03 Decision record; REFUNDS 04 Personas; REFUNDS 07
Why: The SDD gives operations several jobs. They record "paid" or "not paid" resolutions that move a payout to Succeeded, which then marks the refund Paid. They pay a stopped payout "another way", contact customers, compare payouts with CardPay statements by hand each month to produce the REFUNDS/NFR-01 figure, and receive branch alerts that no branch manager account can take. REFUNDS 03 lists only the customer, the branch manager and the portal as actors in the decision record, and REFUNDS 04 and 07 have no operations column. The SDD marks the runbook question non-blocking. These money actions have no business owner, no permissions and no BAT coverage, and the record does not hold a human "paid" decision.
Direction: Add an Operations or Finance persona to REFUNDS 04 and 07, with use cases for resolving stopped or unknown payouts and for reconciliation, and extend the actors in 03 § Decision record.
Direction: Or state in REFUNDS 04 that these are outside the product and name the team that owns them, and make the SDD 20.1.7 marker blocking.
```

## SME-09: A fixed 30-day window ignores seasonal extensions and faulty-goods claims

```
Reviewer: SME
Concern: A fixed 30-day window with a free-text reason ignores seasonal extensions and faulty-goods claims
Where: REFUNDS 06a UC-01 BR-1, E1, step 3; REFUNDS 02 Facts 2; SDD 13a §17.1 Eligibility (REFUND_WINDOW_PASSED refuses the whole receipt)
Why: Retailers commonly extend return windows for gift-season purchases, which is exactly the 3-week triple-volume peak in Facts 2. Faulty goods fall under statutory guarantee rights that are not bound by a 30-day change-of-mind window, and the remedy may be a repair or replacement rather than a refund. UC-01 step 3 takes "a reason" with no categories, and the SDD refuses the whole receipt after 30 days whatever the reason. The BR-8 consumer-law marker is known, but the SDD classifies it as a non-blocking setting. The likely answer, a reason-dependent window and remedy, changes the request form, eligibility and decision flow. Peak-season returns of gifts and faulty items will be sent back to branches by hand, against Objectives 1 and 2.
Direction: Replace the fixed rule with a policy table: window per purchase period and item category, owned by store refund policy v3.
Direction: Add a reason list that separates change-of-mind from faulty goods, with the faulty path's remedy and window stated.
```

## PM-01: The points take-back for a partial refund is undefined

```
Reviewer: PM
Concern: Partial refunds are the normal case, but the points take-back for them is an open P2 item that nothing gates
Where: LOYALTY 06a UC-02 BR-1 (partial-refund marker); LOYALTY 14 TD-03 (P2); REFUNDS 06a UC-01 step 3 and BR-2; REFUNDS 06b UC-04 A1 and BR-2; SDD master §E3 inventory, 13d row ("Blocks E3: No"); SDD 13d §17.4 Take-back
Why: In REFUNDS the customer picks single units from a receipt (UC-01 step 3, BR-2), and the branch manager lowers amounts item by item (UC-04 A1). So most paid refunds cover only part of the LOYALTY "purchase". LOYALTY treats the partial case as a P2 corner case. Its only acceptance criterion on take-back amounts (UC-02 AC-1) tests a full refund (-50 of 50). The SDD marks the marker non-blocking because "only the amount changes". As a result, the rule that decides most take-back movements is undefined. LOYALTY/NFR-01 (zero upheld balance complaints) cannot be tested, and the BR-6 cap is the only guard. The LOYALTY 08 Refunds Portal row also exchanges a single "refunded amount" per refund, not per item, so even a later answer may lack the data it needs.
Direction: Raise TD-03 to P1 and make it gate LOYALTY step 1 and SDD E3. Define the take-back per refunded item or amount, then add a partial-refund acceptance criterion.
Direction: Decide whether the paid-refund event carries per-unit amounts, and record that in LOYALTY 08.
```

## PM-02: One deployable and one Prod gate tie both products' go-live together

```
Reviewer: PM
Concern: One shared deployable and one Prod gate tie both products' go-live together, with no release plan, pilot or way to switch features off
Where: SDD 07 §11.3 Promotion path; SDD 07 §11.5 Feature flags ("not applicable"); SDD 06 ADR-01; SDD decision-log § Architecture questionnaire Q1 ("no pilot wording in either BRD"); REFUNDS 02 Dependencies "Needed before"; LOYALTY 02 Dependencies "Needed before"; REFUNDS 04 Project Scope (in-person and open paper requests at go-live)
Why: Prod needs both CardPay refunds confirmed (REFUNDS) and POS Records agreed (LOYALTY). So Loyalty Points, which needs no payment provider, cannot launch until CardPay confirms. The Refunds Portal also waits on the LOYALTY purchase feed (API-05), whose delivery method is still open. Neither BRD has milestones, a branch rollout order or a pilot, and the SDD rules out feature flags. All 40 branches therefore switch from paper at once, with the paper cut-over (TD-13, TD-14) undecided. The "Needed before" milestone for every hard dependency is still a marker in both BRDs. Nobody can tell which product's value lands first, or whether a slip in one blocks the other.
Direction: Add a release and rollout section (milestones, pilot branches, cut-over) to each BRD, and set the dependency milestones against it.
Direction: Reconsider feature flags or per-product enablement in SDD §11.5, so each product can go live on its own.
```

Merged (BO-04):

```
Reviewer: BO
Concern: One deployable ties Loyalty's go-live to CardPay, and Refunds' go-live to the POS purchase feed
Where: SDD 07 §11.3 (Promotion path); SDD 06 ADR-01; SDD 14 §18.5 LOYALTY/NFR-04 row; SDD 00 (project name "Refunds Platform")
Why: Both products ship as one image with one release (ADR-01). §11.3 lets Prod go live only when CardPay refunds to the original card are confirmed and the POS Records feed is agreed with its owner. As a result:
- Loyalty Points cannot launch until a payment vendor it never uses confirms a refund capability;
- the Refunds Portal cannot launch until the loyalty purchase feed is agreed.

Each product's go-to-market depends on the other's slowest vendor. LOYALTY/NFR-04 is left open and the SDD fills it with the Refunds target, so loyalty availability is inherited, not decided. A refund defect or seasonal spike also affects member screens (R-07). Housing the loyalty ledger in a platform named after refunds hides who funds and owns it. Loyalty is extracted only when "a second team takes over loyalty".
Direction: Allow each module to go live on its own (feature toggle or separate Prod gate per BRD), with the gate list split per product.
Direction: Name a business owner and cost centre for the shared platform, and how its cost is split between the two products.
```

## PM-03: REFUNDS objectives are measurable only per branch

```
Reviewer: PM
Concern: REFUNDS objectives are measurable only per branch, and the people who approved the BRD get no view of them
Where: REFUNDS 01 Business Objectives 1-3; REFUNDS 09 Branch refund report (audience: Branch Manager); REFUNDS 13 Reviewer Notes Scope proposal 2; REFUNDS 14 Step 3 ("Scope proposals ... not blocking"); SDD 13a §17.1 Metrics (`refund_decision_wait_seconds` labelled "BRD Objective 1"); SDD 12 §16.4.2
Why: Objective 1 (10 days down to 3 days, portal-wide average) has only a per-branch daily report that the branch manager reads. The Head of Retail and the Operations Lead approved the BRD (00 Changes Log) but have no role or report. The portal-wide view is a non-blocking scope proposal with no TD row, so the delivery gate can open without it. Objective 2 (no lost requests) and Objective 3 (one place to decide) have no measure at all. The 10-day baseline has no stated source. The SDD's Objective 1 metric measures time to decision, not time to payout. Success therefore cannot be reported at portfolio level after go-live.
Direction: Turn Scope proposal 2 into a TD or OI row that gates the BRD, with a named head-office reader and a measure for each of the three objectives.
Direction: Fix the SDD metric so Objective 1 is measured from submission to Paid, and record where the 10-day baseline comes from.
```

## PM-04: The branch refund report has no screen, mockup or acceptance criterion

```
Reviewer: PM
Concern: The branch refund report, the only KPI tool, has no use case, screen, mockup or acceptance criterion
Where: REFUNDS 09 Reporting / Analytics; REFUNDS 05 Branch Manager Journey; REFUNDS 11 § Screens; REFUNDS 14 Step 4 Mockup coverage (MK-01 to MK-03 only); SDD 13a §17.1 Branch refund report
Why: The Branch Manager journey never mentions the report. 11 lists no screen for it, and the mockup table, whose review criteria cover screens with no use case, has no MK row for it. Its format and period are open (TD-24, TD-25), and no acceptance criterion defines a correct figure. The SDD built an endpoint that takes a from/to date range "that serves whichever period REFUNDS 09 settles". BAT has nothing to sign off for the one tool that measures Objective 1, and the feature can ship without anyone checking that it shows the right figures.
Direction: Add the report to the Branch Manager journey and give it a screen ID, an MK row and acceptance criteria (figures, period, rounding).
Direction: Or name an owning requirement section that UAT can trace to, before chunk 16 is written.
```

## PM-06: Earning points has no use case, and the SDD hand-off never reached the BRD

```
Reviewer: PM
Concern: Earning points is LOYALTY's first in-scope capability but has no use case, and the SDD's hand-off never reached the BRD
Where: LOYALTY 04 In Scope bullet 1; LOYALTY 01 Executive Summary core capabilities; LOYALTY 05 Use Case Summary; LOYALTY 07; LOYALTY 14 Open items register and Step 5; SDD 01 §2.1; SDD 18 OI-21
Why: The only use cases are UC-01 and UC-02 (viewing points). The earning rules (1 point per EUR, start date, late purchases, members who left) live only in LOYALTY 03, with no acceptance criteria and no flowchart. SDD OI-21 was accepted with "the LOYALTY BRD owner decides whether to add a use case". But LOYALTY 13 and 14 have no OI or TD row for it, and LOYALTY 14 step 3 is marked Complete. So the hand-off is lost, and nothing confirms at BAT that the main value-creating flow earns the right points. LOYALTY/NFR-01 detects errors only after the fact, through upheld complaints.
Direction: Add a LOYALTY TD or OI row for an earning use case (system-triggered), with acceptance criteria for rounding, start date, late purchases and members who left.
Direction: Or name LOYALTY 03 as the owning section and add testable criteria there.
```

## PM-07: The SDD quietly settles open REFUNDS questions

```
Reviewer: PM
Concern: The SDD quietly settles open REFUNDS questions, including a P1 item
Where: SDD 13a §17.1 Submit ("until it is answered, both are accepted as optional and at least one is required"); REFUNDS 06a UC-01 BR-4; REFUNDS 14 TD-04 (P1); SDD 13a §17.1 Submit ("re-runs the eligibility check at submission"); REFUNDS 13 OI-11 (Open)
Why: TD-04 asks whether both an email address and a mobile number are required, and it is a P1 item. The SDD builds "at least one", with no marker in its E3 inventory and no OI. For the 30-day window, re-checking eligibility at submission adopts OI-11 Option A while OI-11 is still Open (its marker covers only how days are counted). SDD OI-11 states the principle that "a derive-from-BRD SDD realises business rules and never decides them", but the design does not follow it here. The BRD owner will not learn that the build already took a side. A different answer changes UC-01 E3, AC-8, MK-01 and messages already sent.
Direction: Put both points into the SDD as markers or OIs, and list them in the master E3 inventory.
Direction: Or confirm the SDD defaults as BRD decisions through the REFUNDS acceptance loop.
```

Merged (DC-03):

```
Reviewer: DC
Concern: The SDD quietly answers an open P1 BRD question (both contact details or one), which breaks the email-only cancellation message
Where: SDD 13a §17.1 Business Logic, Submit ("both are accepted as optional and at least one is required"); SDD 11 API-06 DTO; SDD 13c §17.3 Send; REFUNDS 06a UC-01 step 5 and BR-4 marker (TD-04, P1); REFUNDS 03 Customer messages (Cancelled = email only); REFUNDS 06a UC-03 step 5
Why: REFUNDS UC-01 step 5 has the customer enter both an email address and a mobile number. BR-4 (TD-04, P1 Open) asks whether one is enough. 13a adopts an interim answer ("at least one") with no marker and no open item. This is the same pattern OI-11 rejected for BR-6 and BR-7. A customer who gives only a mobile number can never receive the cancellation message: 13c says it "skips that channel", and REFUNDS 03 makes Cancelled email only. UC-03 step 5 then fails without anyone noticing. The BRD owner is never told the build has taken a side.
Direction: Replace the interim rule with a setting and a [NEEDS CLARIFICATION] marker linked to REFUNDS BR-4, as OI-11 did.
Direction: If an interim rule must stay, make it "both required" (matches UC-01 step 5) and add an E3 note covering the email-only Cancelled message.
```

## PM-08: Both LOYALTY objectives rely on data the product never collects

```
Reviewer: PM
Concern: Both LOYALTY objectives rely on data the product never collects, and the baseline must be counted before go-live
Where: LOYALTY 01 Business Objectives 1-2; LOYALTY 09 ("Not applicable"); LOYALTY 10 NFR-01; LOYALTY 04 Out of Scope (complaints); LOYALTY 14 TD-08, TD-22 to TD-24, TD-36 (all P2); SDD 14 §18.5 LOYALTY/NFR-01
Why: Objective 2 is measured by branch phone calls about points, which no system, persona or report records. Objective 1 is measured by upheld complaints, counted by a complaints team that is out of scope and unnamed. A before/after comparison needs the pre-go-live call count, so the baseline has to be collected before launch. No TD row is marked as time-critical or gating, and LOYALTY 14 step 3 is Complete. The SDD stands in a daily balance-check job for NFR-01, which shows the system is consistent but does not measure the business KPI. The business case cannot be shown after launch.
Direction: Make TD-22 and TD-36 P1, with a "start counting by" date before go-live, and name the complaints team (TD-08) as owner of the KPI data.
Direction: Consider adding the KPI source (call log or complaint register) to LOYALTY 08 or 09.
```

## PM-09: "Later" items have no horizon or trigger

```
Reviewer: PM
Concern: "Later" items have no horizon or trigger, and the "no expiry" decision builds up a liability for when redeeming is added
Where: LOYALTY 04 Out of Scope ("Redeeming points (a later phase)"); LOYALTY 12 Wishlist; LOYALTY 03 Overview ("Points do not expire in this release"); LOYALTY decision-log Q-16 Why; SDD 06 ADR-01 extraction triggers; REFUNDS 12 Wishlist; REFUNDS 06b UC-04 Future Enhancements
Why: Members collect points from day one with no way to spend them and no stated date for redeeming. Q-16 notes that bringing in expiry with redeeming will need a rule for existing balances, and that liability grows every month the product runs. The SDD's only trigger for redeeming is architectural (module extraction), not a business milestone. On the REFUNDS side, online-shop refunds, the mobile app and bulk approval have no horizon or condition either. Members and branches will ask what the points are for, and nobody can plan or budget the next phase.
Direction: Give each later item a target release or a measurable trigger, starting with redeeming, plus a statement on what members are told at launch.
Direction: Record a decision on how existing balances are treated when expiry or redeeming arrives.
```

Merged (BO-03):

```
Reviewer: BO
Concern: Loyalty launches with earning only: redemption deferred with no date or reason, while points never expire
Where: LOYALTY 04 §Out of Scope ("Redeeming points (a later phase)"); LOYALTY 03 §Points movement (Expiry); LOYALTY 12 §Wishlist; LOYALTY decision-log §Marker register (Points expiry, D1); SDD 06 ADR-01 (extraction triggers)
Why: Redemption is what makes points worth anything to a member, and it is the usual reason members stay. It sits in "a later phase" with no date, no rationale and no phase plan, so Objective 1 (members trust their balance) and Objective 2 (fewer branch calls) are the only value delivered. The release also takes on a growing liability. Points never expire, and that was settled by a stand-in confirming the BRD's own proposal (D1). There is no redemption to use points up and no correction movement (03 marker). So the outstanding points balance grows with no accounting owner, no cap and no expiry lever, and later adding expiry would take value away from members. The SDD only treats redemption as a future extraction trigger.
Direction: State the redemption phase, its target date, and why launching earn-only is acceptable. Or drop the loyalty release until redemption is ready.
Direction: Have finance own the points liability (valuation, expiry policy) before go-live, and reopen D1 with a human owner.
```

## PM-10: Behaviour switched off at launch that customers and members will expect

```
Reviewer: PM
Concern: Behaviour switched off at launch that customers and members will expect to be there
Where: SDD 13c §17.3 Select (no message on full approval "until the BRD settles it"); REFUNDS 03 Customer messages, "Approved in full" row; REFUNDS 05 Figure 1; LOYALTY 13 Reviewer Notes, scope proposal "tell members when points are taken back"; LOYALTY 06a UC-01 step 2
Why: If TD-10 is still open at launch, a customer whose request is approved in full hears nothing until the money arrives. A partial approval does trigger a message. This silence on the most common positive outcome works against the 18% complaint driver (REFUNDS 01). In LOYALTY, a paid refund lowers a member's balance with no notice, and the member only finds out by opening the history. The scope proposal to tell them is parked with no owner date. Both gaps are likely to create the very calls and complaints the two products aim to cut.
Direction: Make TD-10 a launch blocker, or record "no message on full approval" as an explicit, accepted launch limitation.
Direction: Decide on the take-back notice before go-live, or add a line about refunds to the balance-screen note.
```

## PM-11: Customer care has no persona, and the design now locks them out

```
Reviewer: PM
Concern: The customer care team that handles the baseline complaints has no persona, and the design now locks them out
Where: REFUNDS 01 Background ("18% of complaints to customer care"); REFUNDS 13 Reviewer Notes Scope proposal 1; REFUNDS 10 NFR-04; SDD 12 §16.4.3 (operations database role has no SELECT on personal data); LOYALTY 04 Out of Scope (complaints team open, TD-08)
Why: The problem statement is about customer care complaints, yet customer care cannot see a refund request (NFR-04) or a member's points (LOYALTY/NFR-05). Scope proposal 1 is not a TD row, so nothing makes anyone decide it. The SDD has since built the access model with no care role and with operations barred from personal data, so adding care later changes both NFRs, the matrices and the role catalogue. Care agents will keep answering refund and points calls blind, which undercuts both products' objectives.
Direction: Make Scope proposal 1, together with LOYALTY TD-08, a decision that gates the BRDs before the SDD role catalogue is treated as stable.
Direction: If care is adopted, add a read-only persona that crosses both products to REFUNDS and LOYALTY 04 and 07.
```

## PA-01: A payout that stops or can never succeed never ends the refund saga

```
Reviewer: PA
Concern: A payout that stops or can never succeed has no outcome back to refund-request, so the refund saga never ends
Where: SDD 13b §17.2 Business Logic (Result, Stopped bullet and the never-succeeds marker); SDD 13a §17.1 Figure 16; SDD 10 §14.10; master E3 inventory row for the 13b never-succeeds marker
Why: Only `PayoutSucceeded` crosses back to refund-request. `Stopped` raises an operations alert and nothing else; no `PayoutStopped`/`PayoutAbandoned` event exists in §14.10. In Figure 16 the only exit from Approved is Paid. So a stopped payout, or a customer "paid another way" (§17.2, §20.1.7), leaves the request Approved forever. As a result: the unit claims stay held (the unique index covers Submitted/Approved), the branch report never counts the amount as paid, the customer never gets the paid message, `RefundRequestPaid` never fires, and LOYALTY/UC-02 BR-1 takes back no points. The E3 row scopes this marker to "Saga outcome (§8.4.2)" and says the answer "may add a payout path". It misses that any answer also changes the refund-request state machine, the event catalog, and the loyalty saga. The marker is therefore under-scoped as single-module.
Direction: Add a terminal payout-failure event that refund-request owns a reaction to (new state such as PaidOutOfBand or PayoutAbandoned), and decide whether that state emits a paid fact for loyalty.
Direction: Widen the E3 dependent-claim cell of the never-succeeds marker to §17.1 Figure 16, §14.10 and §8.4.3.
```

Merged (DC-05; its operator-actor part is under SME-07):

```
Reviewer: DC
Concern: Manual payout resolution and "pay another way" fall outside the REFUNDS decision record and payment rules, and skip the loyalty take-back
Where: SDD 13b §17.2 Send (resolution rows) and Result ("paid another way"); SDD 16 §20.1.7; SDD 12 §16.4.3; SDD 13a §17.1 Paid (decision-record actor "portal, payout result"); REFUNDS 03 Decision record; REFUNDS 02 Assumption 2; REFUNDS 04 Out of Scope (Cash refunds); REFUNDS 06b UC-04 E1 second marker (TD-21); LOYALTY 06a UC-02 BR-1
Why: An operator's "paid" resolution row leads to Paid. The decision record then shows actor "portal, payout result", but REFUNDS 03 requires the record to show who made each change, and an operator is not one of its actors. 13b and §20.1.7 also assume the customer can be "paid another way". REFUNDS rules that out (payout to the original card only; cash out of scope) and keeps it open in TD-21. A payment made that way never produces RefundRequestPaid. The request stays Approved, the customer gets no paid message, and LOYALTY never takes back the points. Each document is consistent on its own, but together they do not hold.
Direction: Record the operator as a separate actor in the decision record, or raise an open item for the REFUNDS owner to extend REFUNDS 03.
Direction: Remove "paid another way" until TD-21 is answered, or define the terminal status and event the answer would add, including the take-back.
```

## PA-02: Parked take-backs never expire

```
Reviewer: PA
Concern: Parked take-backs have no expiry, so every non-member or never-delivered purchase parks forever and fires the alert
Where: SDD 13d §17.4 Business Logic (Take-back, first bullet); SDD 07 §11.4 Alerting (parked take-back older than 1 day); SDD 05 §8.4.3 Figure 6; LOYALTY 06a UC-02 BR-4 and AC-10; LOYALTY 08 POS Records row
Why: loyalty-points receives `RefundRequestPaid` for every paid refund. POS Records sends only member purchases (LOYALTY 08: "Member, purchase reference..."). The listener cannot tell "purchase not arrived yet" from "purchase will never arrive", so it parks. This happens for every refund of a non-member purchase and for purchases before the start of points. LOYALTY's own record (decision-log Q-07, Q-24) says a refund of a non-member purchase or of a purchase that never arrives "adds no movement". The design meets that only by keeping an unbounded set of parked rows. It also turns the §11.4 1-day alert into a standing alarm for most refunds. No step owns a timeout that turns a parked take-back into a final "no purchase" outcome.
Direction: Carry a membership indicator (or the member identifier) in `RefundRequestPaid`, or derive it at match time, so non-member refunds close at receipt.
Direction: Give parking a bounded window tied to LOYALTY Assumption 1 (same-day purchases), with a final no-movement outcome and an alert only on exceptions.
```

## PA-05: No saga is declared, and no one owns the approved-to-paid deadline

```
Reviewer: PA
Concern: No saga is declared: the style, steps, compensations and timeout owners are named only in the gate inventory
Where: SDD master E3 marker inventory (rows naming "Saga 'take back points for a paid refund'", "payout saga", "§24.8"); SDD 10 §14.7; SDD 05 §8.4; SDD 07 §11.4 Alerting; SDD 13b §17.2 Metrics (`payout_open_age_seconds`)
Why: Chunks 00-17 never say "choreography" or "saga". §14.7 implies choreography through the refund status doctrine, but there is no per-saga table of steps, owning module, compensation and deadline. Chunk 19 is planned to "add saga views" that have no body source. Timeouts are owned piecemeal. The retry stop time is open. A payout in Pending or Retrying, the state before any stop time applies, has only a gauge (`payout_open_age_seconds`) with no alert in §11.4. A Submitted request past the decision time gets only a UI flag. Nothing owns end-to-end "approved but not paid within N" for REFUNDS Business Objective 1 (3 days to payout).
Direction: Add a saga catalog section (e.g. §14.7 or §8.4) listing each cross-module flow with its style, steps, compensations and timeout owner.
Direction: Add an SLO alert on approved-to-paid age, owned by one named module.
```

## PA-06: Event payloads are open, although ownership and personal-data rules depend on them

```
Reviewer: PA
Concern: The event DTO marker is rated non-blocking, but data ownership and the personal-data rules depend on what the payloads carry
Where: SDD 10 §14.10 (DTO marker); master E3 row for §14.10 ("No: chunk 19 names events, not DTO fields"); SDD 13c §17.3 Select (`PayoutStillFailing` recipients by the request's `branch_id`); SDD 07 §11.6 Personal data; SDD 07 §11.1 (`event_publication.payload` jsonb); SDD 12 §16.4.3
Why: Several cross-module behaviours depend on the payload:
- customer-notification needs the request's `branch_id` for `PayoutStillFailing`, which payout does not own. Payout must copy refund-request data into its own schema, or customer-notification needs a second port that API-06 does not offer.
- The paid take-back needs a purchase/member link, which is personal data.
§11.6 allows personal data in payloads only "where §14.10 states it", and §14.10 states nothing. Payloads are persisted as jsonb in each module's publication log. That jsonb is outside the separate contact-detail erasure of §17.1 Retention and outside the column-level operations privileges of §16.4.3. There is no canonical schema artifact (§21 "Event Schemas: Not created yet"), yet these DTOs become the integration contracts on extraction (ADR-01).
Direction: Make the §14.10 DTO marker blocking, and give each DTO a field list that names its data owner and marks personal-data fields.
Direction: Either keep payloads to ids plus a port read, or extend retention and the operations privileges to `event_publication.payload`.
```

Merged (DC-01):

```
Reviewer: DC
Concern: RefundRequestPaid payload duties are spread across chunks while the event registry says the DTO is open and does not block
Where: SDD 10 §14.10 (DTO marker) and §14.8; SDD 01 §4 R-04; SDD 01 §5 (Refund reference row); SDD 18 Notes (OI-14 note); master E3 row for 10 §14.10; LOYALTY 06a UC-02 step 4; REFUNDS 06b UC-04 A1
Why: §14.10 says every DTO field is open, and §14.8 claims "full reconciliation". Other chunks already commit to fields. R-04 says RefundRequestPaid "carries the receipt number". §5 makes the REFUNDS reference number the loyalty inbox key. The 18 notes say PayoutAttemptFailedDto must carry the refund request id, and OI-24 and OI-27 depend on it, but that field is not in §14.10. LOYALTY UC-02 step 4 needs the paid date, the purchase reference and the refunded amount in EUR. REFUNDS UC-04 A1 means the refunded amount is the approved amount (per item), not the requested amount. The partial-refund take-back (LOYALTY TD-03) cannot be computed without per-item approved amounts. The master marks the DTO marker "No" for E3 ("chunk 19 names events, not DTO fields"), yet the take-back saga it does treat as blocking (the §5 marker) cannot run without these fields. The LLD will have to invent the payload or collect it from prose.
Direction: Record the committed fields (reference number, receipt or purchase link, paid date, approved amount per unit, currency, refund request id) in §14.10 and mark the rest open.
Direction: Reclassify the §14.10 marker as E3-blocking, or tie it explicitly to the §5 blocking row.
```

## PA-07: The staff lookup through the IAM is exempted as infrastructure and has no port

```
Reviewer: PA
Concern: The staff lookup through the IAM is exempted as infrastructure, which breaks the §15.1 rule, and it has no ACL port
Where: SDD 11 §15.1 (Infrastructure boundary paragraph); SDD 13c §17.3 Select (`PayoutStillFailing` bullet); SDD 07 §11.6 (IAM admin read); SDD 08 §12 (IAM paragraph); SDD 06 ADR-07 (Proposed)
Why: §15.1 says "a custom business integration cannot claim that exemption". It then exempts "reading a branch manager's email address by `branch_id`". That lookup is a business query that decides who receives a UC-04 E1 alert, which is a business rule, not token validation. As a result, customer-notification binds directly to the IAM admin user query. That query has no port, no contract (timeout, errors, data shape) and no anti-corruption layer. Meanwhile ADR-07 is still Proposed, with "the hosting environment's managed identity service" as the alternative, and the source of record for branch assignments is open (§16.6). If ADR-07 changes, or staff provisioning moves to an HR system, the notification module breaks with no seam.
Direction: Define a staff-directory port (an API-NN Internal contract) owned by one module or adapter, with typed errors and a timeout.
Direction: Alternatively, carry the recipient resolution out of the send path (a branch-contact record fed by the provisioning source).
```

## PA-08: Membership ownership is stated three ways

```
Reviewer: PA
Concern: Membership ownership is stated three ways, and the loyalty mirror has no staleness or ordering contract
Where: SDD 13d §17.4 Boundaries ("does not own ... membership records") vs SDD 13d Business Logic (Membership: "their account is closed") vs SDD 12 §16.6 and §16.8 item 3; SDD 12 §16.2 item 4 (membership gate)
Why: The SDD names three owners of membership status:
- The IAM grants and never removes `MEMBER` (§16.8).
- An external "membership source" records joining and leaving (§16.6).
- loyalty-points closes the account and is the effective authority for `MEMBERSHIP_ENDED`. The decision log for OI-17 calls it the "single source", while 13d Boundaries disclaims ownership.
Earning ("still in the program when the purchase arrives") and take-back ("left before the refund was paid") read a local copy of the leave fact. No contract defines the arrival lag or ordering of that copy relative to purchases and `RefundRequestPaid`. The ledger is append-only and LOYALTY has no correction movement, so any late leave signal produces permanent wrong movements. The §16.6 marker asks only "how does Loyalty Points learn" this, not with what freshness.
Direction: Name one owner of membership state, and state loyalty-points' copy as a mirror with an effective-dated leave time and a maximum lag.
Direction: Evaluate earn and take-back against effective dates (purchase date, paid date), not arrival time, so ordering does not decide outcomes.
```

## PA-09: ADR-01 extraction triggers miss the message fan-out and the wishlist splits

```
Reviewer: PA
Concern: The extraction triggers in ADR-01 drop the message fan-out trigger and miss two known splits from the BRD wishlists
Where: SDD 06 ADR-01 (Alternatives & Trade-offs, Extraction triggers); SDD decision-log Architecture questionnaire Q4 ("the CardPay integration and the message fan-out become extraction triggers"); REFUNDS 12 Wishlist items 1 and 2; SDD 17 §22 item 1
Why: The questionnaire record commits to a message fan-out trigger. ADR-01 lists triggers only for payout and loyalty-points, so customer-notification has none. Yet REFUNDS 12 Wishlist 2 (a mobile app with push notifications) is exactly the change that grows that fan-out. REFUNDS 12 Wishlist 1 (online-shop refunds, handled today by "a separate system") would add a second producer of paid-refund facts into loyalty, and no trigger or ACL doctrine covers it. §14 is "Not applicable" throughout, with no envelope, versioning or schema-registry plan. Only AP-10's additive rule covers what must exist on first extraction.
Direction: Reconcile ADR-01 with the Q4 record: add or explicitly reject a customer-notification trigger.
Direction: Add a trigger and an inbound-refund ACL stance for non-portal refund sources, and a minimal integration-event envelope to adopt on first extraction.
```

## PA-10: Event ordering is fixed for one pair only

```
Reviewer: PA
Concern: Event ordering is fixed for one pair only; the other out-of-order cases still reach customers and branch managers
Where: SDD 10 §14.10 (Delivery line); SDD 07 §11.1 (redelivery with backoff and jitter); SDD 13c §17.3 Select (supersede rules and advisory lock)
Why: §14.10 promises durable at-least-once delivery but no ordering per refund request. Redelivery with backoff means any failed listener can run after later events of the same request. OI-14, OI-24 and OI-27 fixed only the delayed-then-paid pair. Two cases remain unhandled:
- `PayoutStillFailing` is never superseded by `RefundRequestPaid`, so the branch manager can be told a payout is failing after it was paid.
- A redelivered `RefundRequestSubmitted` or partial-approval message can arrive after the Rejected or Paid message.
No doctrine states which events per aggregate must be ordered or superseded.
Direction: State a per-aggregate ordering stance in §14.10 (per-request sequence number, with listeners dropping stale events), or a general supersede rule in customer-notification keyed on request status.
```

## PA-11: Purchase and refund references are logged although they are personal data

```
Reviewer: PA
Concern: Purchase and refund references are logged, although the SDD classes purchase data as personal data that is never logged
Where: SDD 13d §17.4 Observability & Monitoring, Logging (`purchase_reference`, `refund_reference`); SDD 13a §17.1 Logging (reference number); SDD 07 §11.6 Personal data; SDD 01 §5 (purchase reference vs receipt number marker); SDD 13a §17.1 API Standards (any signed-in customer can look up a receipt)
Why: §11.6 says member purchase data is personal data and never in logs, and 13d lists "member identifier and purchase details" as PII columns. Yet 13d logs `purchase_reference` on every line. If the §5 marker resolves the purchase reference to the receipt number, each logged value is a key that any signed-in customer can use to read the receipt's items through API-04. Logs are also outside the erasure that LOYALTY 03 requires after a member leaves, so that erasure cannot be complete.
Direction: Log an internal surrogate id (movement or purchase UUID) instead of business references, or classify the references explicitly and bound log retention to the erasure period.
```

## DC-02: The direction of API-05 and the API-02 callback are open but stated as settled

```
Reviewer: DC
Concern: The direction of API-05 and the existence of the API-02 callback are open, yet several chunks state them as settled
Where: SDD 03 §7.1 (CardPay and POS Records rows); SDD 04 §8.2 Figure 2; SDD 05 §8.5.2 Figure 9; SDD 11 §15.2 (API-05 Type) and §15.4; SDD 07 §11.2 (Inbound provider calls); SDD 13d Input and Integrations; master E3 rows for 13d § Input and 13b § Integrations
Why: The master lists both questions as E3-blocking ("exists only if CardPay calls back"; "push or fetch"). Other chunks assume an answer anyway. §7.1 says CardPay "calls in with payout results" and calls POS Records "External inbound API-05". Figure 9 draws the callback with no condition. §15.2 types API-05 as External inbound. §15.4 counts the callback as covered. §11.2 resolves the tenant from a per-tenant inbound verification secret. 13d lists API-05 as "Inbound, sync". If POS Records only lets us fetch, then the tenant-resolution rule, the credentials model, the Input table (no `Schedule` row for fetching) and the purchase-intake idempotency path are all wrong. The LLD will build an inbound endpoint the provider may never call.
Direction: Show both variants (or a neutral "TBD direction") in §7.1, Figures 2 and 9, §15.2 Type and §11.2. Add the fetch-job alternative to §17.4 Input under the marker.
Direction: State in the E3 rows which chunks change for each answer.
```

## DC-04: The SDD measure for REFUNDS/NFR-01 leaves out Stopped and Unknown payouts

```
Reviewer: DC
Concern: The SDD measure for REFUNDS/NFR-01 leaves out Stopped and Unknown payouts, which the BRD measure would count as missing
Where: SDD 13b §17.2 Reconciliation; SDD 14 §18.5 REFUNDS/NFR-01 row; REFUNDS 10 NFR-01; REFUNDS 03 Refund request lifecycle
Why: REFUNDS NFR-01 counts every missing payout. Its only exception is a payout "still being tried again under UC-04 E1" at month end. 13b defines the monthly measure as CardPay mismatches only: duplicates, Succeeded payouts CardPay has no record of, and CardPay refunds with no payout. A payout in `Stopped` or `Unknown` is approved and unpaid but is no longer retried. Under the BRD wording it is missing, yet the SDD count never includes it. §18.5 repeats only the "delayed" clause. `Stopped` is a state the SDD added, and the REFUNDS lifecycle has no matching status, so the BRD measure and the built measure will disagree at BAT.
Direction: Add "Approved requests whose payout is Stopped or Unknown at month end" to the §17.2 measure, or raise an SDD open item that asks the REFUNDS owner how NFR-01 treats them.
Direction: Feed the result back to REFUNDS 10 NFR-01 as a BRD follow-up (link to TD-20 and TD-21).
```

## DC-06: Cross-BRD follow-ups exist only in the SDD decision log

```
Reviewer: DC
Concern: Cross-BRD follow-ups exist only in the SDD decision log, and the BRD trackers still list as open the points the SDD has settled
Where: SDD decision-log "Cross-BRD reconciliation" entry; SDD 01 §5 (POS Records row); SDD 08 INT-03 Notes; SDD 07 §11.3 Promotion path; REFUNDS 08 and REFUNDS 02 Dependencies; LOYALTY 02 Dependencies (Refunds Portal row "Confirmed"); LOYALTY 14 TD-16, TD-17, TD-34
Why: The SDD records "BRD follow-up for REFUNDS" (REFUNDS 08 does not name Loyalty Points as a receiver of refund outcomes) and "BRD follow-up for LOYALTY" (POS Records owner). Neither appears as an open item or to-do in REFUNDS 13 or 14, LOYALTY 13 or 14, or SDD 18. Meanwhile:
- SDD §5 and INT-03 state that Point-of-Sale Records and POS Records are one partner owned by the Retail IT team, which answers LOYALTY TD-16 and TD-19.
- The in-process event answers LOYALTY TD-34 by design.
- LOYALTY 02 marks the Refunds Portal dependency "Confirmed" while its owner (TD-17) and timing are open.
- REFUNDS 02 has no POS Records dependency even though 08 marks it Critical, so the §11.3 Prod gate cites only the LOYALTY row.
A REFUNDS change, such as a new terminal status from TD-21, can break LOYALTY with no trace in either BRD.
Direction: Raise the follow-ups as open items in each BRD (a Loyalty receiver row in REFUNDS 08, a POS Records row in REFUNDS 02, and closing or relinking LOYALTY TD-16, TD-17 and TD-34).
Direction: Or add an SDD 18 item listing the BRD back-propagations with an owner.
```

Merged (BO-05):

```
Reviewer: BO
Concern: The Refunds owner has never agreed to feed Loyalty, yet Loyalty marks that dependency Confirmed
Where: REFUNDS 08 §Integrations; REFUNDS 14 Step 1 register (TD-01 to TD-43); LOYALTY 02 §Dependencies (Refunds Portal row, Status "Confirmed"); LOYALTY decision-log §Marker register (Refunds Portal integration row, D2); SDD decision-log §Action entries (Cross-BRD reconciliation)
Why: REFUNDS 08 lists only CardPay, MsgHub and Point-of-Sale Records; Loyalty Points does not appear as a receiver of refund outcomes. The SDD notes this as a "BRD follow-up for REFUNDS", but REFUNDS 14 has no TD row for it, so the Refunds owner will never be asked. On the LOYALTY side, the dependency's owner and milestone are open (TD-17, TD-18), and the row was "confirmed" only by the Loyalty stand-in taking its own proposal (D2). In practice:
- REFUNDS changes that alter what Loyalty sees (item-level partial approvals in OI-30, the in-person channel) carry no duty to tell Loyalty;
- LOYALTY/NFR-02 (1-hour take-back) relies on a provider that has made no commitment;
- the matching key between receipt number and purchase reference is still open (SDD §5, R-04).

The dependency is "Confirmed" only on paper.
Direction: Add a REFUNDS 08 row and a REFUNDS to-do row for the Loyalty feed, owned and accepted by the Refunds business owner.
Direction: Change the LOYALTY 02 Status to "Proposed" until both owners sign the shared contract (outcomes, matching key, timing).
```

## DC-07: Retention deletion and immutable records contradict each other

```
Reviewer: DC
Concern: Statements about retention deletion and immutable records contradict each other within and across documents
Where: SDD 13d §17.4 Constraints vs §17.4 Input (loyalty-retention-purge) and Retention Policy; LOYALTY 03 Member leaves the loyalty program; REFUNDS 03 Decision record vs REFUNDS 10 NFR-06; SDD 13a §17.1 Decision record (DELETE grant for the purge role)
Why: 13d Constraints says movements are "never updated or deleted, except detail columns cleared by the retention purge". 13d Input says the purge removes "the history of members who left", which LOYALTY 03 requires. On the REFUNDS side, 03 says "Nobody can change or delete this record", while NFR-06 sets a retention period for decisions. 13a settles the clash by giving the purge role DELETE on `decision_record`, but no marker or open item tells the REFUNDS owner that the immutability rule now has an exception. The LLD will build to one of two incompatible statements.
Direction: Correct the 13d Constraints so they allow full history deletion after a member leaves.
Direction: Raise a REFUNDS open item (or an SDD 18 item) stating that immutability ends at the NFR-06 retention period, and cite it from 13a.
```

## DC-08: ADR-07's separate customer and staff realms do not support the own-request rule

```
Reviewer: DC
Concern: ADR-07 fixes separate customer and staff realms, which the own-request rule and the NFR-02 target do not support
Where: SDD 06 ADR-07; SDD 12 §16.2 item 4 and §16.3; SDD 13a §17.1 Decide (BR-6 clause); master E3 row for 12 §16.2; SDD 14 §18.5 REFUNDS/NFR-02; SDD 07 §11.2 Tenant context; REFUNDS 06b UC-04 BR-6 and AC-4
Why: With one realm for end customers and one for staff, a branch manager's staff `sub` never equals their customer `sub`. The §16.2 own-request gate cannot be evaluated, and 13a admits the link "depends on the sign-in method". The master E3 row for §16.2 still lists only the sign-in edge as dependent, not UC-04 BR-6 and AC-4, so their dependency on the realm split is untracked. §18.5 lets the IAM be "the hosting environment's managed identity service", which ADR-07 lists as an alternative, not its choice, and ADR-07 was never revised. §11.2 says the IAM sets `tenant_id` "per realm", which is unclear with two realms for one tenant.
Direction: Add BR-6 and AC-4 to the §16.2 E3 row, and either keep ADR-07 open on the realm split or define the attribute that links the two identities.
Direction: Bring ADR-07 and §18.5 into agreement on the IdP choice, and state how `tenant_id` is set across both realms.
```

## DC-09: The §7.3 entry points leave out the detail endpoints

```
Reviewer: DC
Concern: The §7.3 entry points leave out the detail endpoints that the use-case steps need
Where: SDD 03 §7.3 (REFUNDS/UC-02, REFUNDS/UC-04 and LOYALTY/UC-02 rows) vs SDD 13a and 13d List of APIs; SDD 18 Reviewer Notes ("§7.3 agrees with every home chunk")
Why: 13a defines `GET /v1/refund-requests/{refundRequestId}` (UC-02 steps 3-4) and `GET /v1/branches/{branchId}/refund-requests/{refundRequestId}` (UC-04 steps 3-4). 13d defines `GET /v1/members/me/points-movements/{movementId}` (LOYALTY UC-02 steps 3-4). None appears in §7.3. The reviewer note says the traceability was checked in both directions, but these rows show otherwise. The LLD traceability index (16 § 19.9) copies its rows from §7.3, so anyone tracing a production bug or a UAT case to the detail screens finds no SDD anchor.
Direction: Add the three detail endpoints to the §7.3 entry-point cells.
Direction: Add a mechanical check that every 13x List of APIs row maps to a §7.3 row or is marked as a platform endpoint (for example, the branch report).
```

## DC-10: REFUNDS 13 keeps its v1.1 header after v1.2

```
Reviewer: DC
Concern: REFUNDS 13 changed in v1.2 but keeps its v1.1 header, and the v1.2 log does not list it
Where: REFUNDS 13 header (VERSION 1.1); REFUNDS 00 Changes Log v1.2 row ("Chunks: 06b, 10"); REFUNDS master VERSIONING rule; compare LOYALTY 13 (VERSION 1.3, listed in v1.3)
Why: In v1.2, REFUNDS 13 gained OI-29 to OI-31 with Resolution Log rows, and CF-21 edited the OI-10 Concern text, which is a content change to an open item. The master rule says a chunk carries the version in which its content last changed. LOYALTY applies that rule to its chunk 13 for the same kind of change; REFUNDS does not. The SDD lineage records REFUNDS v1.2, so a reader who compares chunk versions to decide what changed since the SDD read will miss chunk 13.
Direction: Bump REFUNDS 13 to 1.2 and add 13 to the v1.2 Chunks list, or record why bookkeeping-only edits to 13 are exempt and apply the same rule in LOYALTY.
```
