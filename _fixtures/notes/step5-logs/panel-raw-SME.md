Doc ids: REFUNDS = brd-refunds-portal, LOYALTY = brd-loyalty-points, SDD = sdd-refunds-platform; the number is the chunk file prefix (decision-log = decision-log.md).

Reviewer: SME
Concern: Refund paid without the goods being returned or inspected
Where: REFUNDS 03 § Refund request lifecycle; REFUNDS 06b UC-04 Main Flow steps 3-6; REFUNDS 05 § Branch Manager Journey; SDD 02 §6 (Object Storage row)
Why: Nothing between Submitted and Paid covers three things: the customer handing the goods back, staff checking their condition (tags, packaging, signs of use, the claimed damage), or a decision on what happens to the item (restock, write-off, return to the supplier). The manager "checks each one" but has nothing to check against: no photos (the SDD stores no files), no goods-received confirmation, no condition notes, no view of the customer's past refunds. Money therefore leaves on one click for goods the store never sees. That is the classic returnless-refund and wardrobing exposure, and it triples in the seasonal peak. Stock keeps showing the item as sold, and faulty items cannot be claimed back from suppliers.
Direction:
- Add a goods-received-and-inspected step and state at the branch before payout, recording condition and disposition
- Or define which reasons and amounts qualify for a returnless refund (for example low value with photo evidence) and require the return for the rest

---

Reviewer: SME
Concern: Paid refunds never posted to POS, stock, finance, or fiscal till
Where: REFUNDS 08 § Integrations (Point-of-Sale Records row, Direction "We receive"); SDD 08 §12 INT-03; SDD 17 §22 item 2
Why: In branch retail a refund is a till transaction. It reverses the sale in sales and VAT takings, returns the item to stock, and nets against the branch's takings. Here CardPay pays outside the POS and nothing flows back. POS Records is read-only. There is no stock, ERP, or ledger integration, and no credit note or return document, which invoiced business customers need and several EU fiscal-till regimes require for any return (country to confirm). The CardPay settlement reconciliation is parked in the SDD wishlist, with no finance actor to own it. At about 1,200 refunds a month, branch sales and VAT stay overstated, stock counts drift, and finance inherits a manual month-end reconciliation.
Direction:
- Add an outbound flow that posts each paid refund as a return to POS/ERP (and to the fiscal device where required), plus a per-branch payout reconciliation report for finance
- Or keep the till as system of record: the portal handles request and approval, and the branch completes the refund at the till

---

Reviewer: SME
Concern: Market unnamed; faulty-goods claims forced through the 30-day refund rule
Where: REFUNDS 06a UC-01 BR-1 and E1; REFUNDS 02 § Assumptions / Constraints; SDD 13a §17.1 Compliance (Local regulations; same line in 13b, 13c, 13d)
Why: Amounts are in EUR, so the branches are in the EU, but neither BRD names the country, and the SDD records "none stated" for local regulations in all four services. The 30-day window is a commercial return policy. A faulty or non-conforming item (the UAT example reason is "Damaged", REFUNDS 16 TC-REQ-01) falls under the statutory legal guarantee instead: at least two years in the EU, with repair or replacement first and price reduction or refund after. The portal treats both cases alike. Inside 30 days it forces money back where the seller could repair or replace. After 30 days, E1 sends a valid legal claim to the branch, where it is handled off-system. Country rules on record retention (the SDD's 10-year default is a placeholder) and on documenting returns cannot be checked until the market is named.
Direction:
- Name the country or countries and add a per-market regulatory section to REFUNDS 02 that the SDD Compliance sections trace to
- Split the request reason into change of mind (30-day policy) and faulty or non-conforming (statutory path, no 30-day cut-off, repair, replace, or refund)

---

Reviewer: SME
Concern: No counter-staff or customer-care role; branch-handled cases stay on paper
Where: REFUNDS 04 § Personas / Actors; REFUNDS 10 NFR-04; REFUNDS 06a UC-01 E1; SDD 13a §17.1 Business Logic (Receipt lookup, RECEIPT_NOT_CARD_PAID); SDD 01 §4 R-01
Why: Refunds start at the counter today, and customers will keep walking in with the goods. Yet the only intake is self-service by a customer with a registered account and contact details (SDD 01 §3 assumptions 1 and 4). A staff account may never act as a customer (SDD 12 §16.3), so no associate can record a request for a walk-in. Every case the design sends "to the branch" has no recording path: window passed, receipt not card-paid, no account or no smartphone, or an exchange or store credit instead of money back. So Objective 2 (every request recorded and visible) fails for the hardest cases, and R-01 has no mitigation. Customer care receives the 18% of complaints that justify the product (REFUNDS 01 § Background) but has no role. NFR-04 lets only the customer and the branch manager see a request, so agents still cannot answer "where is my refund".
Direction:
- Add a store-associate persona who records walk-in requests and off-portal outcomes (exchange, store credit, handled at the branch) under the same reference number
- Add a read-only customer-care role and amend NFR-04 to name it

---

Reviewer: SME
Concern: Branch manager decides alone: no cover, escalation, limits, or oversight
Where: REFUNDS 03 § Branch ownership; REFUNDS 09 § Reporting / Analytics; SDD 01 §3 assumption 2; SDD 12 §16.3 with SDD 13a §17.1 Business Logic (Decide)
Why: The BRD knows only one Branch Manager per branch. There is no deputy, duty manager, or temporary delegation for days off, holidays, or a vacant post. A manager covering two small branches cannot be modelled (one branch per account). No request that waits past a threshold escalates, although Objective 1 promises 3 days on average and the seasonal peak triples the queue. There is no approval limit by amount. Nobody above the branch sees refund rates per branch or per manager: not an area manager, not loss prevention, not the Head of Retail who approved the BRD (REFUNDS 00 Changes Log). The only report goes to the person it would audit. Staff and family purchases are the classic internal refund-fraud path. The SDD's one guard compares the deciding staff account with the request's customer account, and §16.3 requires those to be different accounts. A manager who approves a refund filed on their own customer account therefore passes the guard.
Direction:
- Add deputy and area-manager roles, ageing-based escalation, and an amount threshold that needs a second approver
- Add a head-office loss-prevention report (refund rate, value, and partials per branch and manager) and route staff purchases to an approver outside the buyer's branch

---

Reviewer: SME
Concern: Card refund mechanics idealized: acquirer link, posting lag, chargebacks
Where: REFUNDS 02 § Dependencies 1; REFUNDS 06b UC-04 step 7; REFUNDS 10 NFR-01; SDD 13b §17.2 Business Logic (Original card); SDD 10 §14.9.5
Why: A refund to a card used at a branch terminal normally goes through the acquirer that processed that terminal transaction, using that transaction's own reference. The BRD never states that CardPay is, or is linked to, the in-store acquirer. The SDD defaults to the retailer's receipt number, which an acquirer only knows if the POS passed it at the sale. "Paid" means only that CardPay accepted the refund; the money posts to the card statement days later. The customer journey (REFUNDS 05) promises "until the money is back on their card", but Objective 1 stops the clock at payout. Customers who see Paid but no money will call customer care unless they are told the posting time and given an acquirer reference (ARN) to quote to their bank. Neither the Paid message nor the request detail carries one. Customers tired of waiting also file "credit not processed" chargebacks. Paying the portal refund on a transaction already charged back refunds them twice, and NFR-01 counts only the portal's own payouts.
Direction:
- Confirm the in-store acquirer and have the receipt lookup return the terminal transaction reference and the last four card digits to show the customer
- Give the posting time and acquirer reference at Paid, and check for an open dispute on the original transaction before a payout is sent

---

Reviewer: SME
Concern: A payout that fails for good has no remedy, and the customer is not told
Where: REFUNDS 06b UC-04 E1; REFUNDS 04 § Out of Scope (Cash refunds); SDD 13b §17.2 Business Logic (After the retry window) and Constraints; SDD 13c §17.3 Business Logic (channel matrix)
Why: Card refunds fail permanently in normal operation: the account behind the card is closed, the card was replaced and the issuer does not route the credit, or the acquirer will not reference a sale that old (some acquirers limit this). The BRD stops at "tries again" and "the branch manager is told". The SDD retries every 6 hours with no end, keeps the request Approved with no closure, and sends the customer no message on failure, although customers are to be told the outcome at each step (REFUNDS 04 § Project Scope). The branch manager who is told has no lever: no alternative payout, no way to contact the customer, no closure. With cash out of scope, a customer owed money waits indefinitely. That recreates the "lost refund" complaint the product exists to remove and leaves an open liability in nobody's queue.
Direction:
- Define a permanent-failure outcome (hard decline codes or N days) that closes the payout and offers another remedy (bank transfer, store credit, or cash at the branch)
- Tell the customer when a payout is delayed or has failed, and route failed payouts to a finance or payments queue instead of the branch manager

---

Reviewer: SME
Concern: Store refund policy rules missing: exclusions, multi-unit lines, discounts
Where: REFUNDS 12 § Appendix (Store refund policy v3); REFUNDS 06a UC-01 step 2 and BR-2; SDD 13a §17.1 List of APIs (SubmitRefundRequest); SDD 11 §15.3 API-01 (Data the platform needs)
Why: The rules branches follow today are only referenced. UC-01 keeps just the 30-day window and "an item can be refunded only once". Retail return policies normally also:
- exclude categories (hygiene, underwear, perishables, personalised goods, opened media, gift cards, final-sale clearance)
- extend the window for holiday purchases (the seasonal peak of REFUNDS 02 Facts 2)
- treat gift receipts differently: a refund to the giver's card is wrong, and an exchange or store credit is the norm.
The receipt model is also simplified. A POS line often carries a quantity, but the SDD selects whole lines (posItemLineIds, no quantity) and locks a line once refunded, so a customer cannot return 1 of 3 units now and another later. An item bought in a multi-buy or basket promotion cannot be refunded at its line price without reallocating the discount. Managers will reject or adjust these cases by hand, inconsistently across 40 branches.
Direction:
- Carry the Store refund policy v3 rules into UC-01 business rules as configurable parameters (category exclusions, holiday window, gift receipts, final sale)
- Define unit-level refunds and promotion allocation, and add quantity, category, and net paid amount per line to the receipt lookup data

---

Reviewer: SME
Concern: Receipt number assumed unique across branches; usually it is not
Where: REFUNDS 02 § Assumptions / Constraints 1; SDD 13d §17.4 Tables Design (member_purchase.receipt_number UNIQUE per tenant, DUPLICATE_RECEIPT); SDD 13a §17.1 Tables Design (refund_item partial UNIQUE)
Why: In multi-branch POS estates the printed receipt number is typically a sequence per till, per branch, or per day. It is unique only together with branch, till, and date, and sequences restart when a till is replaced, the POS is upgraded, or a counter wraps. REFUNDS assumes the number alone identifies a purchase across 40 branches. The SDD builds three things on that assumption: the receipt lookup (receipt number only), the one-refund-per-line key, and the loyalty take-back match. It also rejects a second member purchase with the same number as DUPLICATE_RECEIPT. If the assumption fails, customers pull up another branch's receipt, valid requests are blocked as already refunded, and members lose points on colliding purchases.
Direction:
- Confirm the receipt number format and its uniqueness scope with the Retail IT team before build, as a dependency in REFUNDS 02 and LOYALTY 02
- If it is not unique, key the lookup and the loyalty match on the composite purchase identity or on a barcode printed on the receipt

---

Reviewer: SME
Concern: Refunds outside the portal never take points back
Where: LOYALTY 06a UC-02 BR-1; LOYALTY 08 § Integrations; SDD 13d §17.4 Business Logic (Earn points, NON_POSITIVE_AMOUNT); SDD decision-log OI-19 (2026-10-01 record)
Why: Points are taken back only when the Refunds Portal reports a refund as paid. Members also return goods through channels the portal never sees: till returns and exchanges, post-voids, cash refunds, the past-window cases REFUNDS UC-01 E1 sends to the branch, and receipts not paid by card. In each case the member keeps the points. If POS Records reports a till return or void as a negative member transaction, the SDD import rejects it as NON_POSITIVE_AMOUNT instead of using it. "Buy, earn, return at the till, keep the points" is a known loyalty abuse loop that inflates the points liability. The SDD still carries till returns as an open follow-up for the LOYALTY owner, while the LOYALTY BRD reads as closed.
Direction:
- Make POS Records' return and void transactions a second take-back source (LOYALTY 08 row and UC-02 BR-1) under the same whole-euro rule
- Or state in LOYALTY 04 that only portal refunds take points back, and size and accept the leakage

---

Reviewer: SME
Concern: Existing loyalty programme ignored: balances, cut-over, terms
Where: LOYALTY 02 § Dependencies (Member sign-in, existing loyalty program account); LOYALTY 06a UC-01 A1; LOYALTY 03 § Points movement (Earning); LOYALTY 09 § Reporting & Analytics
Why: Members already have loyalty accounts and member numbers, so a programme runs today. It likely already has earned points, shown on receipts or elsewhere, under published terms. LOYALTY starts every member at 0 (UC-01 A1 shows 0 and explains how to earn). There is no opening-balance migration and no cut-over date saying which purchases earn. The earn rule covers every whole euro, with no exclusions and no expiry. Programme terms usually exclude gift-card sales (otherwise points are earned on the gift card and again when it is spent) and categories such as tobacco or lottery, and they set an expiry. A balance that contradicts the existing terms breaks Objective 1 (members trust their balance) on day one, and the points liability grows with no report for finance.
Direction:
- Name the existing loyalty system and its terms, and add an opening-balance migration with a cut-over date to LOYALTY 04
- Align earn exclusions and expiry with the programme terms (or record that the new rules replace them, with member communication) and add a points-liability report

---

Reviewer: SME
Concern: No loyalty-operations role; upheld complaints cannot be corrected
Where: LOYALTY 04 § Personas / Actors; LOYALTY 10 NFR-01; LOYALTY 16 P7; SDD 13d §17.4 Tables Design (points_movement.movement_type) and Developer Notes
Why: NFR-01 defines an upheld balance complaint, and the UAT log records "how each was settled". Yet nobody in either BRD receives or settles a complaint. The ledger accepts only POS imports and paid refunds: there is no manual adjustment movement, and the SDD forbids editing movements. Routine loyalty operations are therefore impossible:
- missing-points claims when the member forgot to identify at the till (POS Records then never reports it as a member purchase)
- goodwill credits and reversing a wrong earn
- merging duplicate accounts, replacing a lost card, and household or secondary cards on one account
- closing an account.
An upheld complaint stays wrong in the ledger, so NFR-01 can be measured but the balance can never be put right.
Direction:
- Add a loyalty-operations persona with a manual adjustment use case (signed movement, reason code, second approver above a threshold, visible to the member) and a missing-points claim by receipt
- Define how account merges, card replacements, and closures in the existing programme reach the ledger
