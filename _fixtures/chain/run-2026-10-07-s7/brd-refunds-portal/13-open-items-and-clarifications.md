<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Refunds Portal
VERSION: 1.7
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Refunds Portal
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the BRD body once the user accepts it.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: When an item is accepted and applied, the decision narrative (the question, options, choice, date, rationale) is recorded in `decision-log.md`, the companion register, with a `Rule home:` link to the section now carrying the settled rule. This chunk keeps only the item's current status line and the Resolution Log row; no decision storytelling here or in the body chunks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, and the open remainder of a business review point can add open items after the first review. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open or Deferred. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body.
>
> **What this section is not.** It is not a list of `[NEEDS CLARIFICATION: ...]` markers found inside the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section, UC ID, or "global" if cross-cutting. |
| **Type** | Gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / Duplication (content restated instead of referenced - within the BRD or from source docs). |
| **Concern** | One paragraph. What was missed and why it matters. |
| **Options** | Concrete choices, each with a one-line tradeoff. At least 2 options per item where a choice exists. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply BRD content (the exact rule, step, row, or wording that would close the item). This is what gets injected into the body when you accept. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives: the evidence behind it (source section, stated business expectation, domain practice, risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting your decision) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: Partial refunds as a separate use case

- **Where:** 06b / UC-04; 05 / Use Case Summary
- **Type:** Not recorded in BRD v1.0 (the item was decided before the migration to this template).
- **Concern:** Not recorded in BRD v1.0. The title and the resolution show the question: is a partial refund its own use case, or a choice inside the refund decision?
- **Options:** Not recorded in BRD v1.0.
- **Recommended Answer:** Merge UC-05 Issue Partial Refund into UC-04 as alternate flow A1 (applied in BRD v1.0).
- **Why:** Not recorded in BRD v1.0.
- **Status:** Accepted - applied

---

### OI-02: Objective 1 cannot be measured as written

- **Where:** 01 / Background and Context, Business Objectives (Objective 1); 03 / Refund request lifecycle; 09 / Branch refund report
- **Type:** Inconsistency
- **Concern:** The Background says customers wait "up to 10 days", which is the longest wait, but Objective 1 cuts "the average time" from 10 days to 3 days. The end point is also open: a request is Paid "once the payout succeeds" (03), while 04 and 05 promise customers can follow it "until the money is back on their card". The only report shows the average time to decision (09), so nothing measures Objective 1.
- **Options:**
  - **A.** 10 days is today's average; the time runs from Submitted to Paid, and the branch report shows it - measurable with what the portal knows; the money can reach the card after Paid.
  - **B.** 10 days is today's longest wait; Objective 1 becomes "no refund takes more than 3 days" - a stricter promise; one slow case breaks it.
  - **C.** As A, plus a report across all branches for a head-office reader - tracks the objective for the whole business; needs a reader who is not a persona today.
- **Recommended Answer:** Option A - four edits:
  - 01 / Background and Context, paragraph 1, sentence 3 becomes: "Customers wait 10 days on average and do not know where their request stands."
  - 01 / Business Objectives, Objective 1, append: "The time runs from Submitted to Paid."
  - 03 / Refund request lifecycle, Lifecycle, append: "A request is Paid when the Payment Provider confirms the payout. The money can take longer to show on the customer's card, depending on their bank."
  - 09 / Branch refund report, What It Shows becomes: "Requests per status, amounts paid, average time to decision, and average time from Submitted to Paid for the branch".
- **Why:** Objective 1 is the measurable target and says "average", so the Background is the line to align, and Paid is the last event the portal can see. If 10 days is in fact the longest wait, choose B; C is a separate scope decision because it adds a new reader.
- **Status:** Accepted - applied

---

### OI-03: In Scope misses tracking, cancelling, and the branch report

- **Where:** 04 / In Scope; 01 / Executive Summary (core capabilities); 09 / Reporting / Analytics
- **Type:** Inconsistency
- **Concern:** 01 lists tracking and cancelling as core capabilities, and 09 defines a branch refund report, but 04 In Scope names only requests, decisions, payouts, and messages. Readers use In Scope as the list of what the release delivers, so UC-02, UC-03, and the report look out of scope.
- **Options:**
  - **A.** Add the three missing lines to In Scope - scope matches the use cases and 09; three more lines.
  - **B.** Keep In Scope as a short summary - no change; the list stays incomplete.
- **Recommended Answer:** Option A - 04 / In Scope, append three lines: "- Tracking of each refund request by the customer until it is paid.", "- Cancelling a request that is not decided yet.", and "- The branch refund report ([09](./09-reporting-and-analytics.md))."
- **Why:** Every current In Scope line maps to a use case or a section, so a missing line reads as out of scope. The report line links to 09 instead of repeating what the report shows.
- **Status:** Accepted - applied

---

### OI-04: Return of the items is not defined

- **Where:** 04 / In Scope; 05 / Branch Manager Journey; 06a / UC-01 step 6; 06b / UC-04 Business Rules
- **Type:** Gap
- **Concern:** The BRD never says whether the customer must bring the items back before a refund. The branch manager journey says the manager "checks each one", but UC-04 shows only the amount and the reason, so a refund can be paid while the customer keeps the goods. This is the main loss risk in a refund process, and it changes what Objective 1's 3 days must cover.
- **Options:**
  - **A.** The customer brings the items to the branch, and the branch manager approves only after they are back - no refund without the goods; adds a branch visit and waiting time.
  - **B.** No return; the branch manager decides on the request details - fastest; the business pays for goods it does not get back.
  - **C.** Return needed only for some reasons or amounts, as Store refund policy v3 sets - balanced; the policy's exceptions must be written into the BRD.
- **Recommended Answer:** Option A - three edits:
  - 04 / In Scope, append: "- Return of the items to the branch before a refund is approved."
  - 06a / UC-01 step 6, append: "The message tells the customer to bring the items to the branch."
  - 06b / UC-04 Business Rules, append: "The branch manager approves a request only after the items are back in the branch."
- **Why:** Without the goods, "checks each one" (05) has nothing to check, and Store refund policy v3 (12 Appendix), the rule branches follow today, is the source to confirm this against; choose C if the policy has exceptions. The cost is a trip to the branch inside Objective 1's 3 days; a request whose items never come back is rejected with a reason (UC-04 A2).
- **Status:** Accepted - applied

---

### OI-05: Customer identity and contact details are not defined

- **Where:** 04 / Personas; 06a / UC-01, UC-02, UC-03; 07 (footnote 2); 10 / NFR-04
- **Type:** Gap
- **Concern:** UC-02 and UC-03 limit customers to their own requests (07 footnote 2, NFR-04), and UC-01 step 6 sends email and SMS, but no chunk says how the portal knows who the customer is or where the email address and mobile number come from. Point-of-Sale Records hold no customer details (08). Without this, "own requests" cannot be enforced and the messages have no address.
- **Options:**
  - **A.** Customers sign up with a confirmed email address and mobile number, and sign in before UC-01 to UC-03 - enforces "own requests" and gives reliable contact details; adds a use case and a first-time step.
  - **B.** No account: the customer types an email address and mobile number with each request and tracks it by reference number - less friction; UC-02 cannot list all of a customer's requests, and a typo loses every message.
- **Recommended Answer:** Option A - four edits:
  - 04 / In Scope, append: "- Customer sign-up and sign-in, with a confirmed email address and mobile number."
  - 05 / Use Case Summary, Customer group, append: "| UC-06 | Sign Up and Sign In | Customer | The customer creates an account with a confirmed email address and mobile number, then signs in to request, track, and cancel refunds. |" The detailed use case goes in 06a after UC-03, in the 06a structure.
  - 07, add after the UC-03 row: "| UC-06 Sign Up and Sign In | Yes | - |"
  - 06a / UC-01, UC-02, and UC-03 Preconditions, append: "- The customer is signed in."
- **Why:** UC-02 step 2 lists each request of the customer, which needs one identity across requests, and UC-01 step 6 needs confirmed addresses for both channels; B fits a one-off request but breaks UC-02 as written. The cost is a sign-up before the first request.
- **Status:** Accepted - applied

---

### OI-06: Mobile app scope is unclear

- **Where:** 05 / Use Case Summary and 06a / UC-02 (title, Future Enhancements); 04 / In Scope; 11 / Responsive Design
- **Type:** Ambiguity
- **Concern:** UC-02 is titled "Track Refund Status (Web and Mobile)" and lists "Push notifications in the mobile app" as a future enhancement, but no In Scope line names a mobile app, and UC-01 and UC-03 do not mention one. 11 asks only that screens work on desktop, tablet, and mobile sizes. Whether an app is part of this release changes the size of the build.
- **Options:**
  - **A.** No app in this release: customers use one portal on any device, UC-02 loses "(Web and Mobile)", and the app idea moves to the Wishlist - matches 04 and 11; customers get no app.
  - **B.** A mobile app for all customer use cases - one experience on phones; a second product to build and test.
  - **C.** A mobile app for tracking only (UC-02) - a smaller app; customers switch between app and portal.
- **Recommended Answer:** Option A - four edits:
  - 04 / In Scope, append: "- One portal that customers use on a computer, tablet, or phone. A separate mobile app is not part of this release."
  - 05, 06a, and 07: rename UC-02 to "Track Refund Status", and point the UC-02 link in 03 / Refund request lifecycle, Overview, to the new heading. The ID stays UC-02; the 00 Changes Log row notes "UC-02 renamed from Track Refund Status (Web and Mobile)".
  - 06a / UC-02 Future Enhancements becomes: "- None identified at this time."
  - 12 / Wishlist, append: "2. A mobile app that alerts customers on their phone when a request changes status."
- **Why:** 04 and 11 describe one product for all screen sizes, and no use case defines app-only behaviour, so the title is the only sign of an app; an alert in an app that does not exist is not a low-complexity follow-up. The BRD does not say whether the business already runs a customer app; if it does, choose B or C.
- **Status:** Accepted - applied

---

### OI-07: Refunds given at the branch are invisible to the portal

- **Where:** 04 / Out of Scope; 06a / UC-01 A1, E1; 08 / Point-of-Sale Records; 10 / NFR-01
- **Type:** Risk
- **Concern:** UC-01 E1 sends customers to the branch, and paper requests may still be open at go-live, but the BRD does not say whether branches still give refunds in person. Point-of-Sale Records only send receipt details to the portal (08, "We receive"), so an item refunded at the till can be refunded again online, and the reverse. NFR-01 requires zero duplicate payouts.
- **Options:**
  - **A.** Branches keep in-person refunds outside the portal, and the portal and Point-of-Sale Records share which items each has refunded - blocks double refunds both ways; the exchange becomes two-way.
  - **B.** Every refund goes through the portal from go-live, and the branch manager enters in-person requests - one record for all refunds (Objective 2); needs a new use case and changes E1.
- **Recommended Answer:** Option A - two edits:
  - 04 / Out of Scope, append: "- Refunds given in person at a branch, including paper requests still open at go-live. The portal treats items refunded at a branch as already refunded (UC-01 A1)."
  - 08 / Point-of-Sale Records row: Business Purpose, append "and share which items have been refunded"; Information Exchanged, append "items refunded at a branch (we receive), items refunded through the portal (we send)"; Direction becomes "Both ways".
- **Why:** The Background shows branches handle refunds today and E1 keeps a branch route, so A keeps that route and still meets NFR-01's zero duplicates; B gives one record but adds scope the BRD never asks for. The cost is a two-way exchange with the Retail IT team's records.
- **Status:** Accepted - applied

---

### OI-08: A receipt number alone shows the purchase

- **Where:** 06a / UC-01 steps 1-2, E2; 10 / NFR-04
- **Type:** Risk
- **Concern:** In UC-01, anyone who types a receipt number sees the items on that receipt (step 2) and can ask for a refund on them. If receipt numbers follow a pattern, a stranger can see what other customers bought and file requests on their purchases. NFR-04 promises that customer personal data is protected.
- **Options:**
  - **A.** Ask for the receipt number and the total amount on the receipt, and show the items only when both match - stops guessing with one more field; anyone holding the paper receipt still passes.
  - **B.** Receipt number only - simplest; purchases stay open to guessing.
- **Recommended Answer:** Option A - three edits in 06a / UC-01:
  - Step 1 becomes: "The customer enters the receipt number and the total amount on the receipt."
  - E2 becomes: "**E2 - Receipt not found:** At step 2, if no receipt matches both details, the system asks the customer to check them and try again."
  - Business Rules, append: "The customer never enters card details."
- **Why:** NFR-04 limits who sees customer data, and a second detail printed on the receipt blocks guessing without asking for card data. The cost is one more field for the customer.
- **Status:** Accepted - applied

---

### OI-09: Purchases not paid in full by card

- **Where:** 06a / UC-01; 02 / Assumptions / Constraints (Constraint 2); 08 / Point-of-Sale Records
- **Type:** Missing scenario
- **Concern:** UC-01 assumes every purchase was paid by card, because payouts go only to the original card (02 Constraint 2). It has no flow for a receipt paid in cash, or paid partly by card and partly another way. The customer would reach a decision with no card to pay back, or get a card payout larger than the card charge.
- **Options:**
  - **A.** At step 2, a receipt with no card payment is refused with a message to visit the branch, and a mixed payment pays back at most the card share - follows Constraint 2; cash buyers still go to the branch.
  - **B.** Accept requests for cash purchases and settle them at the branch - every request in one place (Objective 2); conflicts with the cash line in 04 Out of Scope.
- **Recommended Answer:** Option A - three edits:
  - 06a / UC-01 Alternate & Exception Flows, append: "**E3 - Not paid by card:** At step 2, if no part of the purchase was paid by card, the system tells the customer that only card purchases can be refunded online and that they can visit the branch."
  - 06a / UC-01 Business Rules, append: "For a purchase paid partly by card, the refund is at most the amount paid by card."
  - 08 / Point-of-Sale Records row, Information Exchanged, append: "how the purchase was paid".
- **Why:** Constraint 2 and the cash line in 04 Out of Scope already rule out cash payouts in the portal, so A tells the customer at step 2 instead of after a decision. The cost is that cash buyers keep the branch route.
- **Status:** Accepted - applied

---

### OI-10: How the refund amount is worked out

- **Where:** 06a / UC-01 step 4, Business Rules; 02 / Glossary; 08 / Point-of-Sale Records
- **Type:** Ambiguity
- **Concern:** UC-01 step 4 shows "the refund amount", but nothing says how it is worked out when a receipt line holds several units or the purchase had a discount. The rule "An item can be refunded only once" does not say whether an item is one unit or one receipt line. The amount sets the payout and the partial-approval limit in UC-04 ("less than the requested amount").
- **Options:**
  - **A.** An item is one unit, refunded at the price paid after its share of any receipt discount - matches what the card was charged; Point-of-Sale Records must send discounts.
  - **B.** An item is one receipt line, refunded whole - simple; a customer cannot return 1 of 3 identical units.
- **Recommended Answer:** Option A - three edits:
  - 02 / Glossary, add: "| Item | One unit of a product on a receipt. A receipt line with 3 units holds 3 items. |"
  - 06a / UC-01 Business Rules, append: "The refund amount for an item is the price paid for it. A discount on the whole receipt is split across its items in proportion to their prices."
  - 08 / Point-of-Sale Records row, Information Exchanged, append: "discounts".
- **Why:** The payout goes back to the card that paid (Constraint 2), so A ties each refund to what the customer actually paid; Store refund policy v3 (12 Appendix) is the rule to confirm. The cost is one more detail from Point-of-Sale Records.
- **Status:** Accepted - applied

---

### OI-11: Repeat requests for the same items

- **Where:** 06a / UC-01 A1, Business Rules; 10 / NFR-01
- **Type:** Corner case
- **Concern:** The rule "An item can be refunded only once" and A1 cover items already refunded, but not items in a request that is still Submitted, or was Rejected, Cancelled, or partly approved. A customer could send a second request for an item that is still waiting, and both could be approved, which NFR-01 forbids.
- **Options:**
  - **A.** Items in a Submitted, Approved, Paid, or Rejected request cannot be chosen again; items in a Cancelled request can - no double payouts and no repeat asks after a decision; a wrongly rejected customer goes to the branch.
  - **B.** As A, but a rejected item can be asked for once more - a second chance; the branch manager decides on the same item twice.
- **Recommended Answer:** Option A - two edits in 06a / UC-01:
  - A1 becomes: "**A1 - Some items already refunded or requested:** At step 2, those items are shown but cannot be selected."
  - Business Rules, append: "An item in a request that is Submitted, Approved, Paid, or Rejected (or Payout failed, if OI-17 is accepted) cannot be selected again. An item in a Cancelled request can be selected again within the refund window. After a partial approval, every item in the request counts as refunded."
- **Why:** NFR-01 requires zero duplicate payouts, and blocking items while a request is open is the only way to rule them out; a rejection always has a reason (UC-04), so treating it as final respects the decision. The cost is that a disputed rejection goes to the branch.
- **Status:** Accepted - applied

---

### OI-12: Refund window boundary

- **Where:** 02 / Glossary (Refund window); 06a / UC-01 Business Rules, Acceptance Criteria
- **Type:** Corner case
- **Concern:** The window is "the 30 days after purchase" (02) and the rule is "within 30 days of purchase" (UC-01). Neither says whether day 30 is accepted, how days are counted, or whether the window is checked again at submission (step 5) after the check at step 2. AC-1 (10 days) and AC-2 (31 days) leave day 30 untested.
- **Options:**
  - **A.** Day 30 is the last day, in calendar days from the day after purchase by the branch's date, checked again at submission - the way customers count from a dated receipt; one more check.
  - **B.** 30 times 24 hours from the time of purchase - exact; customers cannot work it out from the receipt.
- **Recommended Answer:** Option A - two edits in 06a / UC-01:
  - Business Rules, append: "Day 1 of the refund window is the day after the purchase. A request submitted on day 30 is accepted. Days are calendar days, by the date in the branch's country. The system checks the window again when the customer submits."
  - Acceptance Criteria, append: "- [ ] Given a purchase made 30 days ago, when the customer submits a request, then it is recorded as Submitted."
- **Why:** A matches how a customer reads "30 days" from a dated receipt, and the second check closes the gap between steps 2 and 5; Store refund policy v3 (12 Appendix) is the rule to confirm. The cost is one more check at submission.
- **Status:** Accepted - applied

---

### OI-13: Preconditions assume away UC-01 E1 and UC-02 A1

- **Where:** 06a / UC-01 Preconditions, E1; 06a / UC-02 Preconditions, A1
- **Type:** Inconsistency
- **Concern:** UC-01 requires the purchase to be within the 30-day window before step 1, yet E1 handles a purchase older than 30 days. UC-02 requires at least one request, yet A1 handles a customer with none. A precondition is true before the flow starts, so as written E1 and A1 can never happen, and test cases built from the preconditions would skip them.
- **Options:**
  - **A.** Replace both preconditions with what the actor knows before step 1 - flows and preconditions agree; E1 and A1 keep the checks.
  - **B.** Remove UC-01 E1 and UC-02 A1 - matches the preconditions; drops two real scenarios.
- **Recommended Answer:** Option A - 06a / UC-01 Preconditions becomes "- The customer has the receipt of a branch purchase.", and 06a / UC-02 Preconditions becomes "- None.". If OI-05 is accepted, UC-01 also gets "- The customer is signed in.", which replaces "None." in UC-02.
- **Why:** The window is checked inside the flow (step 2, E1, Business Rules), so the precondition only repeats it. B would delete the route to the branch that E1 gives the customer.
- **Status:** Accepted - applied

---

### OI-14: Point-of-Sale Records cannot be reached

- **Where:** 06a / UC-01 step 2, E2; 08 / Point-of-Sale Records
- **Type:** Missing scenario
- **Concern:** UC-01 handles a receipt that is not found (E2), but not the case where the Point-of-Sale Records do not answer. The customer would be told to check a correct number, or would get no answer at all. Point-of-Sale Records are a Critical partner (08), and every request starts with them.
- **Options:**
  - **A.** Tell the customer receipts cannot be checked right now and to try again later - an honest message; the customer must come back.
  - **B.** Accept the request without the check and check it later - the customer is not turned away; unchecked requests reach branch managers and can break the UC-01 rules.
- **Recommended Answer:** Option A - 06a / UC-01 Alternate & Exception Flows, append: "**E4 - Receipt cannot be checked:** At step 2, if the Point-of-Sale Records do not answer, the system tells the customer it cannot check receipts right now and asks them to try again later. The system does not say the receipt is not found."
- **Why:** A keeps the item and window checks of step 2 in place (UC-01 Business Rules), while B lets requests through that may break them. The cost is a second visit for the customer.
- **Status:** Accepted - applied

---

### OI-15: Cancel and decision at the same moment

- **Where:** 06a / UC-03 E1; 06b / UC-04 steps 3-5, A2
- **Type:** Corner case
- **Concern:** UC-03 E1 checks for a decision only at step 2, so a branch manager can approve between steps 2 and 4 while the customer confirms the cancellation. UC-04 has no flow for a request the customer cancels while the branch manager is deciding. Either gap can send money for a cancelled request or cancel an approved one.
- **Options:**
  - **A.** Check the status again when each actor confirms; the first confirmed action wins, and the other actor is told - a clear rule; no money for a cancelled request.
  - **B.** Block cancelling while a branch manager has the request open - no clash; the customer cannot cancel while a manager is looking.
- **Recommended Answer:** Option A - two edits:
  - 06a / UC-03 Alternate & Exception Flows, append: "**E2 - Decided while confirming:** At step 4, if the branch manager has decided since step 2, the system does not cancel the request and tells the customer it can no longer be cancelled."
  - 06b / UC-04 Alternate & Exception Flows, append: "**E2 - Cancelled meanwhile:** When the branch manager confirms a decision (step 5, or the rejection in A2), if the customer has cancelled the request, the system does not record the decision and tells the branch manager the request is Cancelled."
- **Why:** A keeps "Only Submitted requests can be cancelled" (UC-03) and the UC-04 precondition true at the moment money moves (NFR-01). B blocks a customer only because a manager is looking.
- **Status:** Accepted - applied

---

### OI-16: The customer is not told why a refund was lowered

- **Where:** 06b / UC-04 A1, A2, step 7; 06a / UC-02 step 4; 04 / Project Scope
- **Type:** Gap
- **Concern:** UC-04 A1 makes the branch manager give a reason for a lower amount, but UC-02 step 4 shows a reason only for rejections, and no message tells the customer the amount was lowered. A2 says the customer is told the reason but not how, while 04 says customers are told the outcome at each step. A customer paid less with no reason cannot understand the decision and is likely to call customer care, where 18% of complaints are already about refunds (01).
- **Options:**
  - **A.** Show the partial reason in UC-02, put the amount and reason in the Paid message, and send the rejection by email and SMS - closes both gaps with no new message; the customer learns of a partial approval at payout.
  - **B.** Send an extra message at approval with the approved amount and any reason - earlier news; one more message for every request.
- **Recommended Answer:** Option A - four edits:
  - 06a / UC-02 step 4 becomes: "The system shows its history with the date of each status change and, if it was rejected or partly approved, the reason."
  - 06b / UC-04 step 7 becomes: "When the payout succeeds, the system marks the request Paid and tells the customer the amount paid by email and SMS. For a partial approval, the message also gives the reason."
  - 06b / UC-04 A2, last sentence becomes: "The system marks the request Rejected and tells the customer the reason by email and SMS."
  - 06b / UC-04 Acceptance Criteria, append: "- [ ] Given a partial approval, when the payout succeeds, then the customer is told the amount paid and the reason."
- **Why:** The payout is sent at the moment of approval (UC-04 step 6), so the Paid message reaches the customer about as soon as an approval message would, and decisions already reach customers by email and SMS (UC-04 step 7). B adds a message to every request for little gain.
- **Status:** Accepted - applied

---

### OI-17: A payout that keeps failing has no end

- **Where:** 06b / UC-04 E1; 03 / Refund request lifecycle (Figure 1); 02 / Assumptions / Constraints (Constraint 2)
- **Type:** Missing scenario
- **Concern:** UC-04 E1 keeps a failed payout Approved and, after one day, tells only the branch manager, who has no step to take. The customer is not told, and the lifecycle has no end for a payout that can never succeed, for example to a closed card. Constraint 2 allows payouts only to the original card, so the money has no other route.
- **Options:**
  - **A.** After one day of failed tries, the request becomes Payout failed, the customer and the branch manager are told, and the branch settles the refund outside the portal - the customer gets their money; a new status and one exception to Constraint 2.
  - **B.** Keep trying and tell the customer the payout is delayed - no new status; a payout to a closed card never ends.
  - **C.** Close the request as Payout failed and tell the customer to contact their bank - simple; the business keeps money it owes the customer.
- **Recommended Answer:** Option A - five edits:
  - 06b / UC-04 E1, last sentence becomes: "If the payout still fails after one day, the system marks the request Payout failed and tells the branch manager and the customer by email and SMS. The customer is asked to visit the branch, which settles the refund outside the portal."
  - 06b / UC-04 Acceptance Criteria, append: "- [ ] Given a payout that still fails after one day, then the request is Payout failed and the customer is asked to visit the branch."
  - 03 / Refund request lifecycle, Lifecycle, append: "An approved request becomes **Payout failed** if the payout still fails after one day. Payout failed is an end status." Figure 1 and its Summary line gain the step from Approved to Payout failed ("payout still fails after one day").
  - 06a / UC-02 step 2, status list, append "Payout failed".
  - 02 / Assumptions / Constraints, Constraint 2, append: "The only exception is a request in Payout failed, which the branch settles outside the portal."
- **Why:** The Executive Summary promises the money back and NFR-01 says refund money is never lost, and A is the only option where every approved refund ends with the customer paid. The cost is a few refunds handled by hand at the branch.
- **Status:** Accepted - applied

---

### OI-18: Decisions can wait without limit

- **Where:** 06b / UC-04 Trigger, Business Rules; 02 / Assumptions / Constraints; 07 (footnote 1); 01 / Objective 1
- **Type:** Risk
- **Concern:** UC-01 tells only the customer about a new request, and UC-04 starts when a request "is waiting", with nothing that alerts the branch manager. No rule covers a branch manager who is away, and the BRD does not say who gives branch managers access to their branch. Objective 1 (3 days to payout) depends on a quick decision.
- **Options:**
  - **A.** A daily message to each branch manager about waiting requests (proposed frequency, in line with the daily branch report in 09), and a cover branch manager who decides while the branch manager is away - protects Objective 1; footnote 1 widens to the covered branch.
  - **B.** The daily message only - simple; requests still wait while the branch manager is away.
  - **C.** A decision deadline with escalation to head office - the strongest control; needs a new persona and a time limit the BRD does not give.
- **Recommended Answer:** Option A - four edits:
  - 06b / UC-04 Business Rules, append: "Each day, the system tells the branch manager how many requests for their branch are waiting for a decision and how long the oldest has waited."
  - 06b / UC-04 Business Rules, append: "When a branch manager is away, a branch manager of another branch can be named to cover. The cover decides on the branch's requests until the branch manager is back."
  - 07, footnote 1 becomes: "¹ Own branch only, or a branch they cover."
  - 02 / Assumptions / Constraints, append: "3. **Branch manager access (assumption)**; who is a branch manager, which branch they run, and who covers them are set up outside the portal."
- **Why:** About 1,200 requests a month across 40 branches (02 Facts) is about 30 per branch, so one daily message reminds without flooding, and a cover keeps decisions inside the Branch Manager persona; C adds a persona and a number the source does not give. The cost is a cover rule in the matrix.
- **Status:** Accepted - applied

---

### OI-19: Two partners missing from Supporting Actors and Dependencies

- **Where:** 06a / UC-01, UC-03 Supporting Actors; 06b / UC-04 Supporting Actors; 02 / Dependencies; 08 / Integrations
- **Type:** Inconsistency
- **Concern:** 08 lists three partners, but only the Payment Provider appears as a Supporting Actor (UC-04) and as a Dependency (02). UC-01 uses Point-of-Sale Records at step 2 and the Notification Partner at step 6, and UC-03 and UC-04 send messages, yet none lists them. The use-case diagrams take external parties from Supporting Actors, and a missing Dependency hides a Critical partner from planning.
- **Options:**
  - **A.** Add both partners to the Supporting Actors of the use cases that use them and to Dependencies - one consistent picture; two more rows.
  - **B.** Add them to Supporting Actors only - fixes the use cases; Dependencies still miss a Critical partner.
- **Recommended Answer:** Option A - five edits:
  - 06a / UC-01 Supporting Actors becomes: "External: Point-of-Sale Records ([08](./08-integrations.md)); External: Notification Partner ([08](./08-integrations.md))"
  - 06a / UC-03 Supporting Actors becomes: "External: Notification Partner ([08](./08-integrations.md))"
  - 06b / UC-04 Supporting Actors becomes: "External: Payment Provider ([08](./08-integrations.md)); External: Notification Partner ([08](./08-integrations.md))"
  - 02 / Dependencies, append: "| Point-of-Sale Records with every branch's receipts | Hard | Retail IT team ([08](./08-integrations.md)) | To be verified | Build of UC-01 | Every request starts with a receipt check. |"
  - 02 / Dependencies, append: "| Notification Partner sending email and SMS to customers | Soft | Notification Partner (MsgHub, [08](./08-integrations.md)) | To be verified | Build of UC-01 | Customers still see the status in UC-02 if a message fails. |"
- **Why:** 08 rates Point-of-Sale Records Critical and the Notification Partner Important, which is why one is Hard and the other Soft; the diagrams and the plan read these fields, so the gap would carry forward. The cost is two rows.
- **Status:** Accepted - applied

---

### OI-20: No performance expectation

- **Where:** 10 / Non-Functional Requirements (NFR-03)
- **Type:** Gap
- **Concern:** 10 has no performance row, so nothing says how long a customer waits for a receipt check or a branch manager for the request list. NFR-03 asks for "no slowdown customers notice" at the seasonal peak, which cannot be tested without a normal speed to compare with.
- **Options:**
  - **A.** Add NFR-05 Performance with the measure "everyday actions complete within 3 seconds" (proposed value, not from the source) - testable, and it makes NFR-03 testable; the value needs business sign-off.
  - **B.** Add NFR-05 with the measure left as a clarification - no proposed value; NFR-03 and NFR-05 stay untestable until answered.
- **Recommended Answer:** Option A - two edits in 10:
  - Append: "| NFR-05 | Performance | Screens respond at once for customers and branch managers. | Everyday actions, such as checking a receipt or opening a request, complete within 3 seconds. |"
  - NFR-03 Business Measure: replace "with no slowdown customers notice" with "with everyday actions still within the NFR-05 time".
- **Why:** NFR-03 needs a normal speed to compare against, and the 3-second value is a proposal based on common practice for customer screens, not on anything in the BRD, so confirm or change it at acceptance. B avoids a proposed number but leaves two NFRs untestable.
- **Status:** Accepted - applied

---

### OI-21: No accessibility expectation

- **Where:** 10 / Non-Functional Requirements; 11 / UI/UX Expectations
- **Type:** Gap
- **Concern:** The portal serves the public, but no NFR or UI/UX line says that people with disabilities can use it, for example with a screen reader or with a keyboard only. Accessibility is costly to add after the screens are built, and for consumer services it can be a legal duty, depending on the country.
- **Options:**
  - **A.** Add NFR-06 Accessibility, measured against WCAG 2.1 level AA - a known, testable standard; more design and test effort.
  - **B.** No accessibility requirement in this release - less effort; some customers are shut out, and the business carries a legal risk.
- **Recommended Answer:** Option A - 10, append: "| NFR-06 | Accessibility | Customers and branch managers with disabilities can use the portal, including with a screen reader or with a keyboard only. | Every screen meets WCAG 2.1 level AA. |"
- **Why:** WCAG 2.1 AA is the accessibility level the project owner's UI/UX standards set and the usual test for public services. The cost is design and test effort on every screen.
- **Status:** Accepted - applied

---

### OI-22: No rule for keeping or deleting refund records

- **Where:** 03 / Definitions & Important Details; 06a / UC-02; 10 / NFR-04
- **Type:** Gap
- **Concern:** The portal needs customers' email addresses and mobile numbers (UC-01 step 6) and holds their purchases and refund decisions, but the BRD does not say how long it keeps them, when personal data is removed, or what record of each decision stays (who decided, when, and the amounts). Refunds move money, so finance record rules apply, and data protection law limits how long personal data is kept. Without a rule, UC-02 shows a customer's requests forever, and the SDD cannot plan deletion.
- **Options:**
  - **A.** Keep each request with its full decision record for the period the finance record rules require, then remove the customer's contact details and keep amounts and dates for reporting - meets both needs; the period must come from the finance or legal owner.
  - **B.** Keep everything with no limit - simple; breaks the limits on keeping personal data.
- **Recommended Answer:** Option A - 03, add a section "## Refund records" with an "### Overview" that reads: "Each refund request keeps its full history: every status change with its date, the branch manager who decided, the requested and approved amounts, and every reason. The portal keeps a request for [NEEDS CLARIFICATION: number of years that finance record rules require] after its last status change. After that, the customer's email address and mobile number are removed, and the amounts and dates stay for reporting. Before customers give their contact details, the portal tells them how the details are used and how long they are kept."
- **Why:** A decision record protects the business in audits and disputes, and the retention period differs by country, so it stays a marked question for the finance or legal owner instead of an invented number. The cost is one open question until that owner answers.
- **Status:** Accepted - applied

---

### OI-23: Refund window and seasonal peak stated in more than one place

- **Where:** 02 / Glossary (Refund window), Facts (Fact 2); 06a / UC-01 E1, Business Rules; 10 / NFR-03
- **Type:** Duplication
- **Concern:** The 30-day window is stated with its number in 02 Glossary, UC-01 E1, and UC-01 Business Rules (the UC-01 precondition is OI-13). The seasonal peak is in 02 Facts ("triple ... for about 3 weeks") and again in NFR-03 ("3 times ... for 3 weeks"), already with a small difference. If the policy or the forecast changes, every copy must change, and a missed one creates two rules.
- **Options:**
  - **A.** Keep each number in one home and link to it: the window in UC-01 Business Rules, the peak in 02 Facts - one place to change; readers follow a link.
  - **B.** Keep the copies - each section reads alone; the copies can drift apart.
- **Recommended Answer:** Option A - three edits:
  - 02 / Glossary, Refund window becomes: "The period after purchase during which a refund can be requested. Its length is set in the Business Rules of [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)."
  - 06a / UC-01 E1 becomes: "**E1 - Refund window has passed:** At step 2, the system tells the customer the refund window has passed and that they can visit the branch."
  - 10 / NFR-03 Business Measure: replace "3 times the normal number of requests for 3 weeks" with "The seasonal peak in [02 / Facts](./02-glossary-assumptions-facts.md#facts) (Fact 2)".
- **Why:** The BRD already keeps the monthly volume once, in 02 Facts, with a link from 01; a rule's home is the use case that enforces it, and a fact's home is Facts. Acceptance criteria keep their numbers because a test needs one.
- **Status:** Accepted - applied

---

### OI-24: The Notification Partner now gates every customer

- **Where:** 02 / Dependencies (Notification Partner); 08 / Notification Partner; 06a / UC-06 step 4, BR-1 (raised by consistency check CF-04)
- **Type:** Inconsistency
- **Concern:** The Notification Partner dependency was rated Soft, and 08 rated it Important, because customers still see the status in UC-02 if a message fails. Since UC-06, sign-up cannot finish without a code sent to each address, and UC-01 to UC-03 need a signed-in customer. A message failure now stops every new customer.
- **Options:**
  - **A.** Rate it Hard and Critical, needed before Build of UC-06 - honest planning; one more critical partner.
  - **B.** Keep Soft and Important, and add a UC-06 exception for a code that cannot be sent - the rating stays; sign-up still stops during an outage.
- **Recommended Answer:** Option A - 02 / Dependencies, Notification Partner row: Type "Hard"; Needed before "Build of UC-06"; Notes "Sign-up cannot finish without it (UC-06 step 4). For later messages, customers still see the status in UC-02." 08 / Notification Partner: Business Purpose "Confirm customers' email addresses and mobile numbers at sign-up, and tell customers and branch managers about refunds by email and SMS"; Criticality "Critical".
- **Why:** 02 and 08 rate a partner by whether use cases can go on without it (OI-19 made the Critical partner a Hard dependency), and after OI-05 no customer use case starts without this one. The cost is a second Critical partner to manage.
- **Status:** Accepted - applied

---

### OI-25: Removing contact details would break the customer account

- **Where:** 03 / Refund records; 06a / UC-06 (raised by consistency check CF-05)
- **Type:** Inconsistency
- **Concern:** 03 removed the customer's email address and mobile number when a request's keeping period ends. Since UC-06, these details belong to the customer's account, which the customer uses to sign in and to receive messages. Applying the rule as written would break the account of a customer who still uses the portal.
- **Options:**
  - **A.** At the end of the period, unlink the request from the account; the account keeps its details - sign-in keeps working; a rule for unused accounts is still needed.
  - **B.** Also remove the details from the account unless the customer has a newer request - less personal data kept; a returning customer must sign up again.
- **Recommended Answer:** Option A - 03 / Refund records, sentence 3 becomes: "After that, the request is no longer linked to the customer's account, and the amounts and dates stay for reporting. The account keeps its email address and mobile number ([06a / UC-06](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in))."
- **Why:** OI-22 aims to stop old requests carrying personal data, and OI-05 moved that data to the account, so unlinking meets the aim without breaking sign-in. The cost is that the keeping period of an unused account stays open.
- **Status:** Accepted - applied

---

### OI-26: Nothing tells the Point-of-Sale Records about portal requests

- **Where:** 08 / Point-of-Sale Records; 06a / UC-01 step 6, UC-03 step 5; 06b / UC-04 A2, E1; Supporting Actors of UC-03 and UC-04 (raised by consistency check CF-06)
- **Type:** Missing scenario
- **Concern:** OI-07 made the exchange with Point-of-Sale Records two-way, so the till cannot refund an item the portal refunds. No use-case step sends this information, and nothing says at which status the portal tells the branch records. An item can be refunded at the till while its online request waits.
- **Options:**
  - **A.** Tell the records when a request is Submitted, and free the items when it ends without a payout (Cancelled, Rejected, Payout failed) - the till is blocked while the request waits and the branch can still settle; more updates.
  - **B.** Tell them only at Paid - one update; a till refund during the wait can pay twice.
- **Recommended Answer:** Option A - 06a / UC-01 step 6, append: "The system tells the Point-of-Sale Records which items are in the request." 06a / UC-03 step 5 and 06b / UC-04 A2 and E1, append: "The system tells the Point-of-Sale Records that the items can be refunded at the branch." 06a / UC-03 and 06b / UC-04 Supporting Actors, append: "External: Point-of-Sale Records ([08](./08-integrations.md))". 08 / Point-of-Sale Records, Information Exchanged: "items refunded through the portal (we send)" becomes "items in a portal request, and items freed again (we send)".
- **Why:** UC-01 BR-6 already blocks the items online from Submitted on. A gives the till the same block, which is what OI-07 chose for NFR-01's zero duplicate payouts, and UC-04 E1 keeps the branch able to settle. The cost is more exchanges with the Retail IT team's records.
- **Status:** Accepted - applied

---

### OI-27: Alternate and exception flows without acceptance criteria

- **Where:** 06a / UC-01 A1, E2, E3, E4; UC-02 A1; UC-03 E1, E2; 06b / UC-04 A2, E2 (raised by consistency check CF-10)
- **Type:** Gap
- **Concern:** These alternate and exception flows have no acceptance criterion. One of them is UC-04 A2, one of the two decisions a branch manager can make. Without criteria, these branches can pass untested.
- **Options:**
  - **A.** One criterion per flow, worded from the flow's own outcome - every branch is testable; nine more criteria.
  - **B.** Criteria only for UC-04 A2, UC-03 E2 and UC-04 E2 - fewer criteria; the other branches are tested from the flows only.
- **Recommended Answer:** Option A - append to each Acceptance Criteria list. UC-01: "- [ ] Given an item already refunded or in another request, when the customer enters the receipt, then the item is shown but cannot be selected."; "- [ ] Given details that match no receipt, when the customer enters them, then they are asked to check them and try again."; "- [ ] Given a purchase with no card payment, when the customer enters the receipt, then they are told only card purchases can be refunded online."; "- [ ] Given the Point-of-Sale Records do not answer, when the customer enters a receipt, then they are asked to try again later and are not told the receipt is not found." UC-02: "- [ ] Given a customer with no requests, when they open their refund requests, then the system says there are none." UC-03: "- [ ] Given a request already decided, when the customer chooses to cancel, then they are told it can no longer be cancelled."; "- [ ] Given a request decided while the customer confirms, when they confirm, then it is not cancelled and they are told." UC-04: "- [ ] Given a Submitted request, when the branch manager rejects it with a reason, then it is Rejected and the customer is told the reason by email and SMS."; "- [ ] Given a request the customer has cancelled, when the branch manager confirms a decision, then the decision is not recorded and they are told it is Cancelled."
- **Why:** Every documented branch needs a criterion so it can be traced and tested, and A2 governs every rejected request. The cost is nine more criteria to maintain.
- **Status:** Accepted - applied

---

### OI-28: Covers do not get the covered branch's messages

- **Where:** 06b / UC-04 BR-5, BR-6, E1, AC-2 (raised by consistency check CF-13)
- **Type:** Inconsistency
- **Concern:** A cover sees the covered branch's requests (UC-04 step 1), but the daily waiting-requests message (BR-5) goes only to each branch's own manager. E1 and AC-2 tell only "the branch manager" about a Payout failed request. While a manager is away, the only reminder goes to the absent manager, so the covered branch's requests can wait.
- **Options:**
  - **A.** While a cover is named, the cover also gets the covered branch's daily message and its Payout failed messages - work keeps moving while the manager is away; more messages for the cover.
  - **B.** Only the branch's own manager gets them - nothing changes; during an absence nobody who can act is reminded.
- **Recommended Answer:** Option A - 06b / UC-04 Business Rules, append to BR-6: "While they cover, the cover also gets that branch's daily message about waiting requests and its Payout failed messages."
- **Why:** OI-18 added the daily message and the cover together so that decisions do not wait (Objective 1), and UC-04 step 1 already gives the cover the covered branch's list. The cost is more messages for the cover.
- **Status:** Accepted - applied

---

### OI-29: No keeping period for account contact details

- **Where:** 03 / Refund records; 06a / UC-06 step 2 (raised by consistency check CF-14)
- **Type:** Gap
- **Concern:** The notice in 03 and UC-06 step 2 tells customers how long their email address and mobile number are kept, but after OI-25 the account keeps them with no end date. Personal data of unused accounts is kept with no limit, and the notice cannot state a period.
- **Options:**
  - **A.** Close an account with no sign-in for a set period and no request still linked to it, and remove its contact details; the legal owner sets the period - the notice can state a period; a returning customer must sign up again.
  - **B.** Keep account details until the customer asks for deletion - no period to set; unused accounts keep personal data forever, and no use case handles a deletion request.
- **Recommended Answer:** Option A - 03 / Refund records, Overview, append: "An account with no sign-in for **[NEEDS CLARIFICATION: number of years the legal owner sets]** and no request still linked to it is closed, and its email address and mobile number are removed."
- **Why:** OI-25 named a rule for unused accounts as still needed, and the notice promises customers a keeping period. A gives that period without breaking sign-in for active customers, and leaves the number for the legal owner, as OI-22 did for requests. The cost is one more open number.
- **Status:** Accepted - applied

---

### OI-30: The 24-hour payout limit is stated in two homes

- **Where:** 03 / Refund request lifecycle (Lifecycle, Figure 1, Summary line); 06b / UC-04 E1 (raised by consistency check CF-26)
- **Type:** Duplication
- **Concern:** The time after which a failing payout becomes Payout failed is stated three times in 03 and once in UC-04 E1, besides UC-04 AC-2 and AC-4. Changing it to 24 hours meant editing four copies outside the acceptance criteria. A later change can miss a copy and leave two rules.
- **Options:**
  - **A.** One home in UC-04 E1, with 03 and Figure 1 pointing to it - one place to change (the acceptance criteria keep the number); 03 no longer shows the limit.
  - **B.** Keep both copies - 03 reads on its own; every change touches four places plus the acceptance criteria.
- **Recommended Answer:** Option A - 03 / Refund request lifecycle, Lifecycle, paragraph 3, sentence 1 becomes: "An approved request becomes **Payout failed** if the payout keeps failing for the time set in [06b / UC-04 E1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)." The Figure 1 label becomes "payout keeps failing (UC-04 E1)". The Summary line ends with "or Payout failed if the payout keeps failing (UC-04 E1)."
- **Why:** OI-23 set the rule that a number lives in the use case that enforces it, and only acceptance criteria keep copies; the 24-hour change showed what four copies cost. The tradeoff is a pointer in 03 instead of the number.
- **Status:** Accepted - applied

---

### OI-31: Sign-up has no flow for codes that cannot be sent

- **Where:** 06a / UC-06 step 4, E1; 10 / NFR-02; 02 / Dependencies (Notification Partner) (raised by consistency check CF-39)
- **Type:** Missing scenario
- **Concern:** Sign-up cannot finish without the Notification Partner (02: "Sign-up cannot finish without it (UC-06 step 4)"), but UC-06 has no flow for a confirmation code that cannot be sent. During an outage the customer's screen is undefined. NFR-02 leaves out only a partner outage that the portal handles with its own message, so this outage counts toward the 2 hours a month.
- **Options:**
  - **A.** Add UC-06 E3 for codes that cannot be sent, with its own criterion, and name it in NFR-02 - the outage is handled like UC-01 E4 and does not count; one more flow, one more criterion, one more MK-04 state.
  - **B.** Keep the text as written - nothing changes; the outage counts toward the 2 hours, and the sign-up screen stays undefined.
  - **C.** Make NFR-02 leave out every partner outage - one wording change; it drops the "with its own message" condition of TD-30, and the sign-up screen stays undefined.
- **Recommended Answer:** Option A - three edits:
  - 06a / UC-06 Alternate & Exception Flows, append: "**E3 - Codes cannot be sent:** At step 4, or when E1 sends a new code, if the Notification Partner does not answer, the system tells the customer it cannot send codes right now and asks them to try again later."
  - 06a / UC-06 Acceptance Criteria, append: "- [ ] Given the Notification Partner does not answer, when a confirmation code must be sent, then the customer is asked to try again later."
  - 10 / NFR-02 Business Measure: "(UC-01 E4, UC-04 E1)" becomes "(UC-01 E4, UC-04 E1, UC-06 E3)".
- **Why:** TD-30 keeps a partner outage out of NFR-02 when the portal tells the user what happens, and sign-up is the one flow a partner outage stops with no message. Option A reuses the UC-01 E4 pattern at the cost of one flow; B holds the portal to the partner's uptime; C drops the condition the product manager chose. OI-24 set the partner's rating, not what the customer sees during an outage.
- **Status:** Accepted - applied

---

### OI-32: Sign-up does not say what happens when the customer turns down an offer

- **Where:** 06a / UC-06 E1, E2; Figure 7 (raised by consistency check CF-47)
- **Type:** Missing scenario
- **Concern:** UC-06 E1 offers a new code and E2 offers to sign in, and each says only what happens when the customer takes the offer (TD-33). No flow says what happens when the customer turns it down, for example after mistyping the code or the email address. Figure 7 can show only the taken offers, so two paths have no stated end, and the tests and the MK-04 states have nothing to check for them.
- **Options:**
  - **A.** The customer corrects and goes on: after E1 they can enter the code again at step 5 while it still works (BR-3, BR-4); after E2 they can enter another email address at step 3 - nobody starts over because of a typo; two more paths and two more criteria.
  - **B.** Turning down the offer ends the sign-up with no account - one new outcome and no loop; a customer who mistyped starts again from step 1.
  - **C.** E2 as in A; E1 as in B, so a wrong code is answered only with a new code - tighter control of codes; a mistyped code always needs a new one.
- **Recommended Answer:** Option A - four edits in 06a / UC-06:
  - E1, append: "If the customer does not ask for a new code, they can enter the code again at step 5 while it still works (BR-3, BR-4)."
  - E2, append: "If the customer does not accept, they can enter another email address at step 3."
  - Acceptance Criteria, append: "- [ ] Given a wrong code, when the customer enters the right code again while it still works, then the sign-up goes on." and "- [ ] Given an email address that already has an account, when the customer enters another email address instead, then the sign-up goes on with that address."
  - Figure 7 gains the two paths: from E1 back to step 5, and from E2 back to step 3.
- **Why:** The reason behind TD-33, that the customer finishes without starting over and both paths reuse steps the use case already has, fits the turned-down offers too; BR-3 and BR-4 already say which code works, so another try needs no new rule. The tradeoff accepted: a limit on tries is left to the security design in the SDD. Choose C if the business wants a new code after every wrong one.
- **Status:** Accepted - applied

---

### OI-33: Sign-in has no failure path and no way back for a forgotten password

- **Where:** 06a / UC-06 A1, E2, BR-2, Acceptance Criteria, Figure 7; 08 / Notification Partner; 02 / Dependencies (Notification Partner) (raised by consistency check CF-54)
- **Type:** Missing scenario
- **Concern:** A1 says the customer signs in with their email address and password, and the system signs them in. No flow says what happens when the email address and the password do not match, or when the customer has forgotten the password. BR-2 (one account per email address) and E2 stop a second sign-up with the same address. UC-01 to UC-03 all need a signed-in customer, so a customer who forgets the password loses online access to their own requests, against Objective 2. Figure 7 ends every sign-in at "customer signed in", and MK-04 and the test cases have no expected result for a failed sign-in.
- **Options:**
  - **A.** Add A3 (forgotten password, with a code sent to the account's email address) and E4 (sign-in fails), each with an acceptance criterion - every customer keeps a way back in, and both cases can be tested; two more flows and two more criteria, and MK-04 and Figure 7 change again.
  - **B.** Add E4 only, and add "Resetting a forgotten password" to 04 / Out of Scope - a smaller change; a customer who forgets the password can never sign in again (BR-2, E2).
  - **C.** Leave both to the security design in the SDD - no BRD change now; what the customer sees stays unstated, and the test cases have nothing to check.
- **Recommended Answer:** Option A - five edits:
  - 06a / UC-06 Alternate & Exception Flows, append: "- **A3 - Forgotten password:** In A1, the customer says they have forgotten the password. The system sends a confirmation code to the account's email address. The customer enters the code and chooses a new password, and the system signs them in. A wrong or expired code is handled as in E1, and codes that cannot be sent as in E3." and "- **E4 - Sign-in fails:** In A1, if the email address and the password do not match an account, the system tells the customer that the email address or the password is wrong. The customer can try again or use A3."
  - 06a / UC-06 Acceptance Criteria, append: "- [ ] Given a customer who has forgotten the password, when they enter the code sent to the account's email address and choose a new password, then they are signed in." and "- [ ] Given an email address and a password that do not match an account, when the customer signs in, then they are told the email address or the password is wrong and can try again."
  - 06a / UC-06 Figure 7 gains the A3 and E4 paths, and its Summary line names them.
  - 08 / Notification Partner, Business Purpose: "Confirm customers' email addresses and mobile numbers at sign-up, and tell customers and branch managers about refunds by email and SMS" becomes "Confirm customers' email addresses and mobile numbers at sign-up, send the code that resets a forgotten password, and tell customers and branch managers about refunds by email and SMS".
  - 02 / Dependencies, Notification Partner, Notes: "Sign-up cannot finish without it (UC-06 step 4)." becomes "Sign-up and a password reset cannot finish without it (UC-06 step 4, A3)."
- **Why:** A1 is the only way back in for a returning customer, and BR-2 with E2 blocks a new account on the same email address, so without A3 a forgotten password locks the customer out of UC-01 to UC-03 for good, against Objective 2. Option A reuses what UC-06 already has (confirmation codes with BR-3 and BR-4, E1, E3, and the Notification Partner), so it adds no new rule or partner; a limit on tries stays with the security design in the SDD, as OI-32 left it for codes. The tradeoff accepted: two more flows and two more criteria, and MK-04 (to-do step 4) and Figure 7 (to-do step 5) change again.
- **Status:** Accepted - applied

---

### OI-34: A receipt with nothing left to refund has no outcome

- **Where:** 06a / UC-01 A1, BR-2, BR-6, AC-4, AC-9, Figure 4; 04 / Out of Scope (raised by consistency check CF-55)
- **Type:** Missing scenario
- **Concern:** A1 shows the items that are already refunded or in another request that is not Cancelled as not selectable, and the customer "goes on to step 3 with the other items". When every item on the receipt is blocked, there are no other items, and no flow says what the customer sees. This is a common case: the same receipt entered twice, or items already refunded at the till, which 04 / Out of Scope sends to A1. The customer meets a screen where nothing can be selected and no message says why, against 11 / Error Messages. Figure 4 sends A1 to step 3 in every case, and MK-01 and the test cases have no expected result.
- **Options:**
  - **A.** Add UC-01 E5 "Nothing left to refund", with an acceptance criterion - the case gets its own flow that the tests, Figure 4, and MK-01 can name; one more flow and one more criterion, and MK-01 and Figure 4 change.
  - **B.** Add one sentence to A1 for a receipt where no item can be selected - the same behaviour with no new flow; A1 then ends in two ways, and Figure 4 branches inside A1.
  - **C.** Keep the text as written - no change; the customer meets a dead end with no message, and the tests have no expected result.
- **Recommended Answer:** Option A - four edits:
  - 06a / UC-01 Alternate & Exception Flows, append: "- **E5 - Nothing left to refund:** At step 2, if every item on the receipt is already refunded or in another request that is not Cancelled, no item can be selected. The system tells the customer that nothing on this receipt can be refunded online and that they can visit the branch. No request is recorded."
  - 06a / UC-01 Acceptance Criteria, append: "- [ ] Given a receipt whose items are all already refunded or in another request that is not Cancelled, when the customer enters the receipt, then no item can be selected and they are told nothing on this receipt can be refunded online."
  - 06a / UC-01 Figure 4 shows E5 as a third answer at the A1 decision, ending at "no request, and the customer can visit the branch", and its Summary line names it.
  - 04 / Out of Scope: "(UC-01 A1)" becomes "(UC-01 A1, E5)".
- **Why:** The rejoin that A1 states ("goes on to step 3 with the other items") does not exist for a fully blocked receipt, and 11 / Error Messages asks for a message. Option A follows the E1 and E3 pattern (say why, point to the branch) and reuses an outcome Figure 4 already has. The message names no other request, because that request can belong to another customer (OI-08). The tradeoff accepted: one more flow and one more criterion, and MK-01 (to-do step 4) and Figure 4 (to-do step 5) change.
- **Status:** Accepted - applied

---

### OI-35: A3 does not say what happens when no account has the email address

- **Where:** 06a / UC-06 A3, E4, Acceptance Criteria; 06a / Figure 7; 14 / MK-04 (raised by consistency check CF-61)
- **Type:** Missing scenario
- **Concern:** A3 sends a confirmation code "to the account's email address", and E4 covers only an email address and a password that do not match an account. No flow says what happens when no account has the email address the customer gave, for example a mistyped or never-registered address. What the customer sees on the reset screen is not defined, and MK-04 and the test cases have no expected result for it.
- **Options:**
  - **A.** Add UC-06 E5: the system tells the customer that no account has this email address, and they can try another address or sign up - clear for a customer who mistyped; like E2, it shows whether an account has an email address; one more flow and criterion, and Figure 7 and MK-04 change again.
  - **B.** Add UC-06 E5 with the same message whether or not an account exists, and send a code only when one does - it reveals nothing; a customer who mistyped waits for a code that never comes.
  - **C.** Leave it to the security design in the SDD - no BRD change; MK-04 and the tests keep no expected result for this case.
- **Recommended Answer:** Option A - three edits in 06a / UC-06. Alternate & Exception Flows, append: "- **E5 - No account for the email address:** In A3, if no account has the email address the customer gave in A1, the system sends no code and tells the customer that no account has this email address. The customer can try again with another email address or sign up (step 1)." Acceptance Criteria, append: "- [ ] Given an email address that no account has, when the customer says they have forgotten the password, then no code is sent and they are told that no account has this email address." Figure 7 gains the decision "Does an account have this email address?" before A3, with the E5 path back to the sign-in or sign-up choice; MK-04 then gains the state "E5 no account for the email address".
- **Why:** A3 can send a code only when an account has the address, and a mistyped address is a common slip; 11 / Error Messages asks for a message that says what went wrong and what to do next. B protects nothing, because E2 already tells anyone at sign-up that an account has an email address, and it leaves a customer who mistyped waiting. The tradeoff accepted: one more flow and criterion, and Figure 7 and MK-04 change again.
- **Status:** Rejected: out of scope for this release (test-fixture policy). Not applied; UC-06, Figure 7, and MK-04 stay as they are.

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-21 | [06b / UC-04 A1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary) (UC-05 merged into UC-04) | Accepted recommendation |
| OI-02 | 2026-10-04 | 01 / Background and Context, Business Objectives; 03 / Refund request lifecycle; 09 / Branch refund report | Accepted recommendation |
| OI-03 | 2026-10-04 | 04 / In Scope | Accepted recommendation |
| OI-04 | 2026-10-04 | 04 / In Scope; 06a / UC-01 step 6; 06b / UC-04 Business Rules | Accepted recommendation |
| OI-05 | 2026-10-04 | 04 / In Scope; 05 / Use Case Summary; 06a / UC-06 (new), UC-01 to UC-03 Preconditions; 07 | Accepted recommendation (the UC-06 details the answer does not state are marked as proposals) |
| OI-06 | 2026-10-04 | 04 / In Scope; UC-02 renamed in 05, 06a, 07; 03 link; 06a / UC-02 Future Enhancements; 12 / Wishlist | Accepted recommendation |
| OI-07 | 2026-10-04 | 04 / Out of Scope; 08 / Point-of-Sale Records | Accepted recommendation |
| OI-08 | 2026-10-04 | 06a / UC-01 step 1, E2, Business Rules | Accepted recommendation |
| OI-09 | 2026-10-04 | 06a / UC-01 E3, Business Rules; 08 / Point-of-Sale Records | Accepted recommendation |
| OI-10 | 2026-10-04 | 02 / Glossary (Item); 06a / UC-01 Business Rules; 08 / Point-of-Sale Records | Accepted recommendation |
| OI-11 | 2026-10-04 | 06a / UC-01 A1, Business Rules | Accepted recommendation |
| OI-12 | 2026-10-04 | 06a / UC-01 Business Rules, Acceptance Criteria | Accepted recommendation |
| OI-13 | 2026-10-04 | 06a / UC-01 and UC-02 Preconditions | Accepted recommendation |
| OI-14 | 2026-10-04 | 06a / UC-01 E4 | Accepted recommendation |
| OI-15 | 2026-10-04 | 06a / UC-03 E2; 06b / UC-04 E2 | Accepted recommendation |
| OI-16 | 2026-10-04 | 06a / UC-02 step 4; 06b / UC-04 step 7, A2, Acceptance Criteria | Accepted recommendation |
| OI-17 | 2026-10-04 | 06b / UC-04 E1, Acceptance Criteria; 03 / Refund request lifecycle (Figure 1); 06a / UC-02 step 2; 02 / Constraint 2 | Accepted recommendation |
| OI-18 | 2026-10-04 | 06b / UC-04 Business Rules; 07 footnote 1; 02 / Assumption 3 | Accepted recommendation |
| OI-19 | 2026-10-04 | 06a / UC-01, UC-03 and 06b / UC-04 Supporting Actors; 02 / Dependencies | Accepted recommendation |
| OI-20 | 2026-10-04 | 10 / NFR-05, NFR-03 | Accepted recommendation |
| OI-21 | 2026-10-04 | 10 / NFR-06; 02 / Glossary (WCAG) | Accepted recommendation |
| OI-22 | 2026-10-04 | 03 / Refund records | Accepted recommendation |
| OI-23 | 2026-10-04 | 02 / Glossary (Refund window); 06a / UC-01 E1; 10 / NFR-03 | Accepted recommendation |
| OI-24 | 2026-10-04 | 02 / Dependencies (Notification Partner); 08 / Notification Partner | Accepted recommendation |
| OI-25 | 2026-10-04 | 03 / Refund records | Accepted recommendation |
| OI-26 | 2026-10-04 | 06a / UC-01 step 6, UC-03 step 5 and Supporting Actors; 06b / UC-04 A2, E1 and Supporting Actors; 08 / Point-of-Sale Records | Accepted recommendation |
| OI-27 | 2026-10-04 | 06a / UC-01, UC-02, UC-03 and 06b / UC-04 Acceptance Criteria | Accepted recommendation |
| OI-28 | 2026-10-04 | 06b / UC-04 Business Rules (BR-6) | Accepted recommendation |
| OI-29 | 2026-10-04 | 03 / Refund records | Accepted recommendation (adds the marker tracked as TD-24) |
| OI-30 | 2026-10-05 | 03 / Refund request lifecycle (Lifecycle, Figure 1, Summary line) | Accepted recommendation |
| OI-31 | 2026-10-05 | 06a / UC-06 E3, Acceptance Criteria; 10 / NFR-02 | Accepted recommendation |
| OI-32 | 2026-10-05 | 06a / UC-06 E1, E2, Acceptance Criteria, Figure 7 | Accepted recommendation |
| OI-33 | 2026-10-05 | 06a / UC-06 A3, E4, Acceptance Criteria, Figure 7; 08 / Notification Partner; 02 / Dependencies | Accepted recommendation |
| OI-34 | 2026-10-05 | 06a / UC-01 E5, Acceptance Criteria, Figure 4; 04 / Out of Scope | Accepted recommendation |
| OI-35 | 2026-10-05 | [13 / OI-35](#oi-35-a3-does-not-say-what-happens-when-no-account-has-the-email-address) (not applied) | Rejected: out of scope for this release (test-fixture policy) |

---

## Reviewer Notes

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Every In Scope and Out of Scope line against the 01 capabilities and objectives, the use cases, and 09; scope edges such as item returns and a mobile app | 4 (OI-02, OI-03, OI-04, OI-06) | Customer care access is a note below, not an item. |
| Use-case exception coverage | Every Main Flow step of UC-01 to UC-04 for branches the body assumes away: payment method, amount, repeat requests, window boundary, preconditions, timing clashes, customer messages, payout failure, decision delays | 9 (OI-09, OI-10, OI-11, OI-12, OI-13, OI-15, OI-16, OI-17, OI-18) | New E numbers assume the items are applied in OI order (see the notes). |
| Matrix consistency | Every 04 persona is a column; every 05 use case except merged UC-05 is a row; every Primary Actor has Yes; no persona is named as an actor without Yes; no external party is a column; conditional access has footnotes | No issue found | If accepted, OI-05 adds a UC-06 row and OI-18 widens footnote 1. The Supporting Actors gap is OI-19. |
| NFRs | NFR-01 to NFR-04 against the template qualities, and whether each measure can be tested | 2 (OI-20, OI-21) | NFR-01 and NFR-02 have testable measures. |
| Integrations | Each 08 partner against the use cases, Supporting Actors, and Dependencies; what the user sees when each partner fails | 3 (OI-07, OI-14, OI-19) | Payment Provider failure is OI-17. A failed message needs no item, because UC-02 always shows the status. |
| Security / privacy | Customer identity, who can see requests and receipts, card details, NFR-04 | 2 (OI-05, OI-08) | Accessibility (OI-21) and retention (OI-22) also carry legal duties. |
| Data lifecycle | End statuses in 03, old requests, the record of each decision, how long personal data is kept, paper requests open at go-live | 1 (OI-22) | A request stuck in Approved is OI-17; paper requests open at go-live are part of OI-07. |
| Duplication | Numbers and facts stated in more than one chunk, and source content restated instead of linked | 1 (OI-23) | The monthly volume is already kept once, in 02 Facts. |
| Plain language and technical terms | Sentence length, vague words, one term for one thing, and technical terms in the body chunks | No issue found | Vague wording that hides a requirement is part of OI-02 ("up to 10 days") and OI-20 ("no slowdown customers notice"). Editorial cases are below. The Java and PostgreSQL statements are parked in 12 Technical Inputs, as the template allows. |

- New flow numbers assume the items are applied in OI order: OI-09 adds UC-01 E3, OI-14 adds UC-01 E4, and OI-15 adds E2 to UC-03 and UC-04. If an earlier item is rejected, renumber the later one when it is applied.
- Linked items: OI-11 names the Payout failed status from OI-17, OI-13 uses the signed-in precondition from OI-05, and OI-20 and OI-23 edit different phrases of the NFR-03 measure.
- 05 / Customer Journey, sentence 2 (22 words, two ideas). Simpler: "They follow the request until the money is back on their card. They can cancel it while it waits for a decision."
- 05 / Branch Manager Journey (27 words). Simpler: "The branch manager sees the requests waiting for their branch and checks each one. They approve a request in full or in part, or reject it with a reason."
- 06b / UC-04 UI/UX: "(mockup MK-03; the source defines no screen ID for it)" is a note about the source, not a requirement. Simpler: "Branch manager decision screen (mockup MK-03)."
- 11 / Summary: "customers hear about every step" uses a second verb for "told". Simpler: "customers are told about every step."
- 06b / UC-04 E1 and AC-2: "after one day" can mean 24 hours or one working day, which matters over a weekend. Say which one.
- 06b / UC-04 Future Enhancements: "small refunds" needs an amount when the enhancement is planned.
- 06a / UC-03 step 5 tells the customer by email only, while every other customer message uses email and SMS. If that is deliberate, no change is needed.
- Customer care, where 18% of complaints land today (01), has no view of requests, because NFR-04 limits access to the customer and the branch manager. Not raised as an item, because UC-02 gives the customer the same view. Add a customer care view only if care staff must answer refund calls.
- 06b / UC-04 lists only Submitted requests, so a branch manager cannot open a decided request, for example after a Payout failed message (OI-17). Check this when OI-17 is applied.
- 04 / Out of Scope says a separate system handles online-shop refunds, and 12 / Wishlist lists them as a next feature. If the intent is to replace that system, say so in the Wishlist line.
- Multi-tenancy: not relevant. One retailer runs 40 branches, and branch separation is covered by 03 / Branch ownership and NFR-04.
- Consumer law: E1's route to the branch also serves claims for faulty goods after 30 days, where the law of the branch's country may give rights beyond the store policy. Confirm with the legal owner when OI-07 is applied.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
