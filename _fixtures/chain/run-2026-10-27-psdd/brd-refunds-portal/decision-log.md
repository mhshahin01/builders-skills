<!--
TYPE: Decision Log
PROJECT: Refunds Portal
VERSION: 1.5
PART OF: BRD - Refunds Portal
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Refunds Portal

## How to read

The numbered chunks (00-13) hold the current settled requirements. This file holds why and how they were decided. Read the chunks for what the portal must do; read this file for the decision history behind it.

## Clarification register

Q-01 comes from BRD v1.0. Q-02 to Q-26 are the open items of the 2026-10-10 review (OI-02 to OI-26); 23 of them are decided and applied. Q-27 and Q-28 are the open items the consistency check raised on 2026-10-10 (OI-27, OI-28); both are decided and applied. Q-29 to Q-31 are the open items raised from the new questions N1 to N3 of the grill-me session of 2026-10-10 (OI-29 to OI-31); all three are decided and applied. Q-37, Q-38, Q-40, Q-41 and Q-44 are open items raised from the open remainders of the business review of 2026-10-10 (OI-32 to OI-47); these five are decided and applied. Q-48 and Q-49 are the open items consistency check Run 8 raised on 2026-10-10 (OI-48, OI-49), and Q-50 the one Run 9 raised (OI-50); all three are decided and applied. OI-10, OI-11, OI-32 to OI-36, OI-39, OI-42, OI-43 and OI-45 to OI-47 are still open in [chunk 13](./13-open-items-and-clarifications.md#open-items), so they have no record here yet.

### Q-01 - Partial refunds as a separate use case

**Question:** Not recorded in BRD v1.0 beyond its title, "Partial refunds as a separate use case" (OI-01, Where: 06b).

**Options considered:** OI-01. Not recorded in BRD v1.0: the v1.0 chunk 13 kept only the heading, the Where field, the Status and the Resolution Log row.

**Decision record, 2026-09-21:** Accepted recommendation (v1.0 Resolution Log). Who decided: not recorded in BRD v1.0. Applied outcome: UC-05 "Issue Partial Refund" was merged into UC-04, and a partial approval is UC-04 A1. Rationale: not recorded in BRD v1.0. Source: [source-snapshot-v1.0/13-open-items-and-clarifications.md](./source-snapshot-v1.0/13-open-items-and-clarifications.md).

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-02 - How a customer proves who they are

**Question:** The BRD never says how the portal knows who the customer is. UC-01 starts with only a receipt number. Yet UC-02 lists "their" requests, UC-03 lets them cancel "their" request, 04 limits the Customer to "Own requests only", and NFR-04 says only the customer can see a request. Without a stated way to prove identity, these rules cannot be tested. Anyone who has or guesses a receipt number could see the items on it (UC-01 step 2), submit a request for someone else's purchase, and follow or cancel it. The v1.0 test plan assumed customer accounts (source-snapshot-v1.0/16-uat-bat-test-cases.md, prerequisite P2 "Test accounts: one customer ..."), but no BRD section states it.

**Options considered:** OI-02 (Gap; Where: global - 03 Definitions; 06a / UC-01 step 2, UC-02, UC-03; 04 / Personas (Customer access "Own requests only"); 10 / NFR-04).

  - **A.** Customer account: the customer signs up and signs in before UC-01 to UC-03 - strongest link between a person and their requests; adds a sign-up and sign-in use case and changes the Customer journey.
  - **B.** No account: the customer proves who they are with a one-time code sent to the email or mobile number on the request - lighter for walk-in buyers; a code is needed on every visit, and one person's requests are not grouped.
  - **C.** State the rule now and ask the owner for the method - closes the testability gap at once; design of UC-01 to UC-03 waits for the answer.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option C. Add to 03 a new concept "## Customer identity" with "### Overview": "A customer must prove who they are before the portal shows a receipt's items, lists their refund requests, or lets them cancel one. A customer sees and acts only on the refund requests they submitted. **[NEEDS CLARIFICATION: How does a customer prove who they are: by signing in to a customer account, by a one-time code sent to their email or mobile number, or another way?]**" Add to the Preconditions of UC-01, UC-02 and UC-03: "The customer has proved who they are ([03 / Customer identity](./03-definitions-and-domain-concepts.md#customer-identity))." Add to UC-03 Business Rules: "Customers can cancel only their own requests." In 07, footnote ², add a link to this UC-03 rule. If the owner picks Option A, add a sign-up and sign-in use case with all nine sections, a Use Case Summary row, a matrix row and a Customer journey update in 05. The identity rule adds behaviour the sources do not state.

Rationale (Why): 04, UC-02 BR-1 and NFR-04 already demand "own requests only", which cannot be tested without identity, and UC-01 step 2 shows purchase details to anyone with a number. Choosing between A and B changes scope (A adds a use case), so only the owner can make it; the v1.0 test prerequisite P2 hints at A, which is why the marker names it first. Tradeoff: UC-01 to UC-03 design waits for the answer.

Open remainder (a choice for the product owner): the method of proving identity, asked by the marker in 03 / Customer identity. If a customer account is chosen, a sign-up and sign-in use case is added then.

Carried (same meaning): consistency check CF-10 (Run 3, 2026-10-10) worded UC-03 BR-2 as "Own requests only: see 03 / Customer identity".

**Rule home:** [03 / Customer identity](./03-definitions-and-domain-concepts.md#customer-identity)

### Q-03 - Refund requests made in person at a branch after go-live

**Question:** Today customers ask for refunds in person and staff record them on paper (01 Background). The BRD does not say whether branches still accept in-person requests after go-live, yet UC-01 E1 sends customers to the branch. If branches keep taking requests on paper, those requests stay outside the portal and Business Objective 2 ("every request is recorded") fails for them. The BRD also does not say what happens to paper requests still open on go-live day.

**Options considered:** OI-03 (Gap; Where: 04 / In Scope and Out of Scope; 06a / UC-01 E1; 01 / Background and Business Objective 2).

  - **A.** Branches stop taking requests in person and send customers to the portal - one record for every request; customers without internet access lose a channel.
  - **B.** Branch staff enter in-person requests into the portal for the customer - every request is recorded; adds a Branch Staff persona, a journey, a use case and a matrix column.
  - **C.** In-person requests stay outside the portal and are listed as Out of Scope - no extra build; Objective 2 then covers online requests only.
  - **D.** Ask the owner before choosing - no invented process; the scope edge stays open until answered.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option D. Add to 04 / Project Scope, under the heading the answer decides: "**[NEEDS CLARIFICATION: After go-live, do branches still accept refund requests in person, and if so, are those requests recorded in the portal?]**" and "**[NEEDS CLARIFICATION: What happens to paper refund requests that are still open on the go-live day?]**" If the answer is Option B, add a Branch Staff persona to 04, its journey to 05, its use case with all nine sections in a new 06c, a Use Case Summary row and a matrix column, and mark each unsettled step for the product owner.

Rationale (Why): The sources describe the in-person process (01) and send customers to the branch (UC-01 E1) but never say where those requests go, which directly limits Objective 2. A, B and C each change scope and branch staff work, so the evidence does not favour one; the owner must choose. Tradeoff: the scope boundary stays open until answered.

Open remainder: the two markers in 04 / Project Scope. If branch staff enter requests, a Branch Staff persona and use case are added then.

**Rule home:** [04 / Project Scope](./04-scope-and-personas.md#project-scope)

### Q-04 - Return of the items

**Question:** The portal refunds physical items bought in a branch. No section says whether the customer must give the items back, when, or how the branch manager knows they came back. UC-04 lets the manager approve and pay with no check on the goods. If returns are required, the lifecycle (03) and UC-04 need a step and a rule. If not, the business accepts paying for items it never gets back. Either way, design and test cases differ.

**Options considered:** OI-04 (Gap; Where: 04 / In Scope; 05 / Branch Manager Journey; 06b / UC-04; 03 / Refund request lifecycle).

  - **A.** The customer brings the items to the branch, and the manager approves only after they are back - protects stock and limits abuse; adds a step to UC-04 and slows payout against Objective 1.
  - **B.** No return needed; the manager decides on the customer's reason - fastest payout; the business may pay for items it never gets back.
  - **C.** Ask the owner first - no invented process; UC-04 stays open until answered.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option C. Add to 03 / Refund request / Overview: "**[NEEDS CLARIFICATION: Must the customer return the items to the branch before the branch manager approves a refund?]**" If the answer is yes, add to UC-04 Preconditions: "The items on the request are back at the branch." and to UC-04 Alternate & Exception Flows: "E3 - Items not returned: At step 3, the branch manager cannot approve a request whose items are not back at the branch." This adds behaviour the sources do not state.

Rationale (Why): Nothing in the sources covers the goods, yet it decides whether UC-04 can approve at once. A and B are policy choices that store refund policy v3 (12 / Appendix, not attached) may already settle, so the owner must answer. Tradeoff: UC-04 cannot be finalised until then.

Open remainder (a fact that store refund policy v3 may settle): the marker in 03 / Refund request. If returns are required, UC-04 gets the precondition and E3 that the Recommended Answer describes.

Carried (number only): E3 branches at UC-04 step 5, the Approve step after OI-17 was applied.

Carried (number only, BRD v1.5): UC-04 E3 is now "Original payment disputed" (Q-38). If returns are required, the flow "Items not returned" takes the next free exception ID, E4.

**Rule home:** [03 / Refund request](./03-definitions-and-domain-concepts.md#refund-request)

### Q-05 - "Web and Mobile": a mobile app or a phone browser

**Question:** UC-02 is titled "Track Refund Status (Web and Mobile)", and its Future Enhancements mention "Push notifications in the mobile app", which suggests a mobile app. But 04 / In Scope names no mobile app, and 11 says only that customer screens "work on phones and computers". Readers cannot tell whether a mobile app is in scope, or why only UC-02 names it while UC-01 and UC-03 do not. A mobile app is a separate deliverable with its own effort and release path. The title came unchanged from v1.0.

**Options considered:** OI-05 (Ambiguity; Where: 05 / Use Case Summary and 06a / UC-02 title; 06a / UC-02 Future Enhancements; 11 / Responsive Design; 04 / In Scope).

  - **A.** "Mobile" means the portal in a phone browser; no app is in scope - matches 04 and 11; the push-notification idea moves to the Wishlist.
  - **B.** A mobile app is in scope for UC-02, and maybe UC-01 and UC-03 - matches the UC-02 title; adds a deliverable 04 does not list.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to 11 / Responsive Design: "The customer use cases (UC-01 to UC-03) work in a web browser on phones and computers. No customer mobile app is in scope." Rename UC-02 to "Track Refund Status" in 05 / Use Case Summary, 06a and 07. Move "Push notifications in the mobile app" from UC-02 Future Enhancements to 12 / Wishlist as "A customer mobile app with push notifications".

Rationale (Why): 04 / In Scope is the scope authority and lists no app, and 11 already covers phones; A aligns the title with both. Tradeoff: if the business does want an app, it becomes a scope change with its own BRD update.

Carried: consistency check CF-09 (Run 3, 2026-10-10) listed the customer mobile app under 04 / Out of Scope; 11 / Responsive Design links to it.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### Q-06 - Refund rules from store refund policy v3 are not in the BRD

**Question:** 12 lists store refund policy v3 as "the refund rules the branches follow today", but it is not attached. UC-01 states only two rules: the 30-day window and one refund per item. Common store rules, such as items that can never be refunded (for example, gift cards or opened hygiene products; domain practice, not a project fact), are not covered. If the policy has such rules, the portal accepts requests the branches would refuse, and managers reject them by hand, which slows Objective 1. If the BRD and the policy disagree, nobody can say which one wins.

**Options considered:** OI-06 (Risk; Where: 12 / Appendix (Store refund policy v3, "Not attached to this BRD"); 06a / UC-01 Business Rules and step 2).

  - **A.** Attach policy v3, carry its rules into UC-01 Business Rules, and make the portal follow them - one set of rules, testable; needs the policy now.
  - **B.** Keep the two rules and treat the policy as background - no extra work; risk of requests the branch refuses later.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. In 12 / Appendix, replace "Not attached to this BRD" with the attached policy file, after the owner confirms: "**[NEEDS CLARIFICATION: Can store refund policy v3 be attached to this BRD?]**" Add to UC-01 Business Rules: "Items that can never be refunded cannot be selected. **[NEEDS CLARIFICATION: Which items or item types can never be refunded under store refund policy v3?]**" Add to UC-01 Alternate & Exception Flows: "A2 - Item cannot be refunded: At step 2, the item is shown with the reason it cannot be refunded, and it cannot be selected." The A2 flow adds behaviour the sources do not state.

Rationale (Why): 12 names the policy as the rules the branches follow, so the portal must not allow what the branches refuse. A turns those rules into testable requirements. Tradeoff: the policy owner's time is needed now.

Carried: the policy file is not attached; the Appendix row keeps "Not attached" and carries the marker that asks for it.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-07 - Preconditions that block their own exception flows

**Question:** UC-01 has the precondition "The purchase is within the 30-day refund window". But the system learns the purchase date only at step 2, and E1 handles a purchase older than 30 days. If the precondition holds, E1 can never happen. UC-02 has the same problem: "The customer has at least one refund request" makes A1 "No requests yet" unreachable. A tester reading the preconditions would plan no test for E1 or A1. The 30-day rule is also stated four times (02 Glossary, UC-01 Preconditions, BR-1, E1).

**Options considered:** OI-07 (Inconsistency; Where: 06a / UC-01 Preconditions and E1; 06a / UC-02 Preconditions and A1).

  - **A.** Replace the conflicting preconditions; the rules stay in Business Rules and the flows - flows and tests agree; nothing is lost.
  - **B.** Keep the preconditions and remove E1 and A1 - shorter use cases; drops behaviour the source states.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. In UC-01 Preconditions, replace "The purchase is within the 30-day refund window." with "The customer has a receipt number from a branch purchase." In UC-02 Preconditions, replace "The customer has at least one refund request." with "None." (or with the identity precondition, if OI-02 is accepted). UC-01 BR-1 stays the single home of the 30-day rule; E1 and the 02 Glossary entry stay as they are.

Rationale (Why): use-case-quality.md § Preconditions says a precondition is a state true before step 1, not a restated step. A keeps E1 and A1, which v1.0 and its test cases rely on (source-snapshot-v1.0/16-uat-bat-test-cases.md, TC-REQ-02 and TC-REQ-06). Tradeoff: none of substance.

Carried: OI-02 was accepted, so the UC-02 precondition is the identity precondition, as the Recommended Answer allows.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-08 - The customer's email address and mobile number are never collected

**Question:** UC-01 step 6 tells the customer by email and SMS, and 08 sends "customer contact details" to MsgHub. But no step collects an email address or a mobile number, and 08 / Point-of-Sale Records returns none (receipt number, items, amounts, branch, purchase date). So the portal has nothing to send the messages to. The BRD also does not say whether both are required, or whether the customer can correct a wrong one.

**Options considered:** OI-08 (Gap; Where: 06a / UC-01 Main Flow step 6; 08 / Notification Partner and Point-of-Sale Records).

  - **A.** The customer enters an email address and a mobile number in UC-01 before submitting - works with or without an account; adds one step.
  - **B.** The contact details come from a customer account - no extra step per request; works only if OI-02 settles on an account.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A, unless OI-02 settles on a customer account, in which case the account holds the contact details. Add to UC-01 Main Flow, between steps 4 and 5: "The customer enters their email address and mobile number." Renumber the steps that follow. Add to UC-01 Business Rules: "**[NEEDS CLARIFICATION: Must the customer give both an email address and a mobile number, or is one of them enough?]**" Add to UC-01 Alternate & Exception Flows: "E3 - Contact details not valid: At the new step 5, the system asks the customer to correct the email address or mobile number." This adds behaviour the sources do not state.

Rationale (Why): Without a source of contact details, step 6 and every later message cannot happen. A works whatever OI-02 decides; B depends on it. Tradeoff: one more step for the customer.

Carried: OI-02 did not settle on a customer account, so Option A applies as the Recommended Answer states. The new step is step 5; later steps are renumbered.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-09 - Purchases not paid by card

**Question:** Payouts go only to the original card (02 Assumption 2), and cash refunds are out of scope (04). But UC-01 has no flow for a purchase paid in cash, or paid partly by card and partly another way. Such a customer can submit a request that can never be paid. It then fails in UC-04 E1, wastes the manager's time, and leaves the request stuck.

**Options considered:** OI-09 (Missing scenario; Where: 06a / UC-01; 02 / Assumption 2; 04 / Out of Scope (Cash refunds); 08 / Point-of-Sale Records).

  - **A.** UC-01 stops a purchase with no card payment at step 2 and sends the customer to the branch - an honest early answer; the receipt lookup must return how the purchase was paid.
  - **B.** Accept the request and let the manager reject it - no change to UC-01; wastes manager time and the customer's wait.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to UC-01 Alternate & Exception Flows: "E4 - Purchase not paid by card: At step 2, the system tells the customer this purchase cannot be refunded online and that they can visit the branch." Add to UC-01 Business Rules: "A refund can be requested online only for a purchase paid by card. **[NEEDS CLARIFICATION: How is a purchase paid partly by card and partly another way refunded: only the card part online, or not online at all?]**" Add "how the purchase was paid" to the Information Exchanged of 08 / Point-of-Sale Records. This adds behaviour the sources do not state; it applies 02 Assumption 2 and 04 Out of Scope.

Rationale (Why): A enforces two rules the BRD already has, at the first moment the system can check them. B lets in requests the BRD says cannot be paid. Tradeoff: Point-of-Sale Records must supply the payment method, which 08 does not list today.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-12 - When an item can be requested again

**Question:** UC-01 BR-2 says "An item can be refunded only once", and A1 blocks items "already refunded". It does not say what happens to an item on a request that is Submitted or Approved but not yet paid. A customer could submit two requests for the same item and be paid twice, against NFR-01. It also does not say whether an item can be requested again after its request is Cancelled or Rejected, or after a partial refund. "Item" is unclear when one receipt line holds several units of the same product.

**Options considered:** OI-12 (Corner case; Where: 06a / UC-01 BR-2 and A1; 03 / Refund request lifecycle; 06b / UC-04 A1; 10 / NFR-01).

  - **A.** Block an item while it is on any Submitted, Approved or Paid request; free it when the request is Cancelled; count each unit as one item; ask the owner about Rejected and partial refunds - closes the double-payout gap; needs two owner answers.
  - **B.** Block only items on Paid requests, as the rule literally says - simplest; allows two open requests for one item.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Replace UC-01 BR-2 with: "An item can be on only one refund request that is Submitted, Approved or Paid. When a request is Cancelled, its items can be requested again within the refund window. Each unit counts as one item: a customer who bought 3 of the same product can request a refund for 1, 2 or 3 of them." Add to UC-01 Business Rules: "**[NEEDS CLARIFICATION: Can a customer request a refund again for an item whose earlier request was Rejected?]**" and "**[NEEDS CLARIFICATION: After a partial refund, can the customer request a refund for the rest of the item's amount?]**" Change UC-01 A1 to: "A1 - Some items already requested or refunded: At step 2, items on a Submitted, Approved or Paid request are shown but cannot be selected." The Cancelled rule and the unit rule add behaviour the sources do not state.

Rationale (Why): Blocking items on open requests is the only reading that meets NFR-01 (no duplicate payouts). Freeing items on cancelled requests matches UC-03's purpose: the customer withdrew and nothing was paid. Rejected and partial cases are policy choices for the owner. Tradeoff: longer rule text in UC-01.

Carried (wording): consistency check CF-01 (Run 3, 2026-10-10) narrowed BR-2 to items on a Submitted or Approved request or refunded in full, pointed Rejected and partly refunded items to BR-6 and BR-7, and changed A1 to items that BR-2 blocks.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-13 - Receipts cannot be checked

**Question:** UC-01 step 2 depends on Point-of-Sale Records, which 08 marks Critical. If that system cannot be reached, the only flow that fits is E2 "Receipt not found", which wrongly tells the customer their number is wrong. The customer re-enters a correct number, fails again, and may call customer care, the very complaint the portal is meant to reduce (01 Background).

**Options considered:** OI-13 (Missing scenario; Where: 06a / UC-01 step 2 and E2; 08 / Point-of-Sale Records (Critical)).

  - **A.** Add a separate exception: receipts cannot be checked right now, try again later - an honest message; no request can start until the check works.
  - **B.** Record the request without the check and check it later - the customer is not blocked; steps 2 to 4 cannot show items or an amount, and the request may later prove invalid.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to UC-01 Alternate & Exception Flows: "E5 - Receipts cannot be checked right now: At step 2, if the receipt records cannot be reached, the system tells the customer it cannot check receipts at the moment and asks them to try again later. It does not say the receipt number is wrong." Add to UC-01 Acceptance Criteria: "Given the receipt records cannot be reached, when the customer enters a valid receipt number, then they are asked to try again later and are not told the number is wrong." This adds behaviour the sources do not state.

Rationale (Why): Steps 2 to 4 need the receipt's items and amounts, so B cannot show them. A keeps E2's message true and gives the customer a clear next action. Tradeoff: no request can be started while the receipt records are down.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-14 - Which messages the customer gets, and how

**Question:** 01 and 04 promise the customer is told at each step, by email and SMS. But the move to Approved sends no message. UC-04 A2 "tells the customer the reason" without saying how. UC-03 step 5 uses email only, while UC-01 step 6 and UC-04 step 7 use email and SMS. Designers and testers will each fill these gaps differently.

**Options considered:** OI-14 (Inconsistency; Where: global - 01 / Executive Summary ("told the outcome at each step"); 04 / In Scope ("Customer messages by email and SMS"); 06a / UC-01 step 6, UC-03 step 5; 06b / UC-04 step 7 and A2).

  - **A.** One table in 03 lists every status change and its channels, using 04's email-and-SMS rule as the default - one home, easy to test; one owner question remains.
  - **B.** Fix each use case step by step - no new sub-section; the rule stays spread over four places.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to 03 / Refund request a sub-section "### Customer messages": "Every message to the customer goes by email and SMS, except where this table says otherwise." followed by this table:

  | Status change | Customer message | Source |
  |---------------|------------------|--------|
  | Submitted | Email and SMS, with the reference number | UC-01 step 6 |
  | Approved | **[NEEDS CLARIFICATION: Is the customer told when a request is Approved, before it is Paid?]** | 03 / Refund request lifecycle |
  | Rejected | Email and SMS, with the reason | UC-04 A2 |
  | Paid | Email and SMS | UC-04 step 7 |
  | Cancelled | Email only | UC-03 step 5 |

  Change UC-04 A2 to end: "...and tells the customer the reason by email and SMS."

Rationale (Why): 04 / In Scope already sets email and SMS as the channels, so A applies that rule to the rows the use cases left open. It keeps UC-03's email-only choice as a visible exception instead of silently changing source behaviour. Tradeoff: one more sub-section in 03.

Carried (number only): the table cites UC-01 step 7 and UC-04 step 9, the step numbers after OI-08 and OI-17 were applied.

Carried (wording): consistency check CF-12 (Run 4, 2026-10-10) split the Approved row into "Approved in part" (from Q-16) and "Approved in full"; the marker now asks only about a full approval.

Carried (wording, 2026-10-10, BRD v1.3 and v1.4): business review SME-03 changed the Paid row (it says when the money usually shows, with the days as a marker); business review PM-10 settled the "Approved in full" row; Q-38 added UC-04 BR-8 to the Source of the Rejected row; consistency check CF-24 (Run 8) added the row "Back to Approved (a Paid payout is sent back)" from Q-37.

**Rule home:** [03 / Customer messages](./03-definitions-and-domain-concepts.md#customer-messages)

### Q-15 - A message does not reach the customer

**Question:** Every flow assumes the email and SMS arrive. If MsgHub cannot send, or the email address or mobile number is wrong, the customer does not learn their reference number or the outcome. The BRD does not say whether a request is still recorded when the message fails, or where else the customer can see the reference number. Objective 2 depends on the customer always being able to see their request.

**Options considered:** OI-15 (Missing scenario; Where: 06a / UC-01 step 6; 06b / UC-04 step 7; 08 / Notification Partner (MsgHub, Important)).

  - **A.** A failed message never stops or changes a request; the reference number is shown on screen at submission, and UC-02 always shows the current status - the customer always has a way to see the request; no staff work.
  - **B.** As A, and the branch manager is also told when a message fails - staff can call the customer; adds manager work and a phone process.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Change UC-01 step 6 to: "The system records the request as Submitted, shows the reference number on screen, and tells the customer by email and SMS." Add to 03 / Refund request (under Customer messages, if OI-14 is accepted): "A message that does not reach the customer never stops or changes a refund request. The customer can always see the current status in UC-02." Add to UC-01 Acceptance Criteria: "Given messages cannot be sent, when the customer submits a request, then it is still recorded as Submitted and the reference number is shown on screen." This adds behaviour the sources do not state.

Rationale (Why): The portal exists so that no request is lost (01 Objective 2); tying the record to message delivery would bring lost requests back. Showing the number on screen is the simplest fallback. Tradeoff: a customer with a wrong contact detail learns outcomes only by checking UC-02.

Carried (number only): the change applies to UC-01 step 7, the step number after OI-08 was applied.

**Rule home:** [03 / Customer messages](./03-definitions-and-domain-concepts.md#customer-messages)

### Q-16 - The customer is not told about a partial approval

**Question:** In UC-04 A1 the branch manager lowers the amount and gives a reason. But UC-02 step 4 shows a reason only "if it was rejected", and no message carries the lower amount. The customer gets less money than they asked for, with no explanation. This invites the complaints the portal aims to reduce (01 Background).

**Options considered:** OI-16 (Gap; Where: 06b / UC-04 A1; 06a / UC-02 step 4 and Acceptance Criteria).

  - **A.** Show the requested amount, the approved amount and the partial-approval reason in UC-02, and tell the customer at approval - transparent; small change.
  - **B.** Show only the paid amount - no extra text; the customer does not know why it is lower.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Change UC-02 step 4 to: "The system shows its history with the date of each status change, the requested and approved amounts, and the reason for a rejection or a partial approval." Add to UC-04 A1: "The customer is told the approved amount and the reason." Add to UC-02 Acceptance Criteria: "Given a partially approved request, when the customer opens it, then they see the requested amount, the approved amount and the reason."

Rationale (Why): The manager already gives the reason (UC-04 A1), so showing it costs little and answers the customer's first question. B hides a decision that changes the customer's money. Tradeoff: managers must write reasons a customer can read.

Carried: consistency check CF-12 (Run 4, 2026-10-10) carried this decision to 03 / Customer messages (row "Approved in part") and narrowed the open Approved marker to a full approval.

**Rule home:** [06a / UC-02](./06a-use-cases-customer.md#uc-02-track-refund-status)

### Q-17 - What the branch manager sees before deciding

**Question:** The 05 journey says the branch manager "checks each one". But UC-04 goes from the list (step 2: amount and reason) straight to "opens a request and chooses Approve" (step 3), with no system response that shows the request. The BRD does not say what the manager sees to decide: the items, the purchase date, the receipt number. Designers cannot finish MK-03 from it, and testers cannot check it.

**Options considered:** OI-17 (Gap; Where: 06b / UC-04 Main Flow steps 2 and 3; 05 / Branch Manager Journey ("checks each one")).

  - **A.** Split step 3 into: the manager opens a request; the system shows its details; the manager chooses Approve - one action per step and a defined screen content; owner confirms one optional item.
  - **B.** Leave the content to design - faster now; the designer, not the business, decides what the manager needs.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Replace UC-04 step 3 with three steps: "3. The branch manager opens a request. 4. The system shows the receipt number, the purchase date, the items requested with their amounts, the total requested amount and the customer's reason. 5. The branch manager chooses Approve." Renumber the steps that follow and the step references in A1, A2 and E1. Add to UC-04 Business Rules: "**[NEEDS CLARIFICATION: Must the branch manager also see the customer's earlier refund requests when deciding?]**" The listed details come from UC-01 and 08 / Point-of-Sale Records; showing earlier requests would add behaviour the sources do not state.

Rationale (Why): writing-style.md rule 8 and use-case-quality.md § Main Flow ask for one action per step and responses the actor can see. A uses only information UC-01 already collects. Tradeoff: UC-04 step numbers change.

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-18 - The customer cancels while the branch manager is deciding

**Question:** UC-03 E1 covers one side of the race: the manager decides while the customer is cancelling. UC-04 has no flow for the other side: the customer cancels while the manager has the request open. If the manager then approves, a cancelled request could be paid, against UC-03 BR-1 and NFR-01.

**Options considered:** OI-18 (Missing scenario; Where: 06b / UC-04 Alternate & Exception Flows; 06a / UC-03 E1 and BR-1; 10 / NFR-01).

  - **A.** Add a UC-04 exception: if the request is no longer Submitted when the manager confirms, the system says so and records no decision - mirrors UC-03 E1; no payout for a cancelled request.
  - **B.** Stop the customer from cancelling while a manager has the request open - no race; takes away a right UC-03 BR-1 gives while the request is Submitted.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to UC-04 Alternate & Exception Flows: "E2 - Cancelled in the meantime: At step 5, if the customer has cancelled the request, the system tells the branch manager the request was cancelled and records no decision." Add to UC-04 Acceptance Criteria: "Given a request the customer cancels while the branch manager has it open, when the branch manager confirms, then no decision is recorded and no payout is sent." Step numbers follow the current UC-04; renumber if OI-17 is accepted.

Rationale (Why): A mirrors UC-03 E1, which the source already states, and protects NFR-01. B contradicts UC-03 BR-1. Tradeoff: a manager sometimes loses a little work on a request that was cancelled.

Carried (number only): E2 branches at UC-04 step 7, the confirm step after OI-17 was applied.

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-19 - A payout that never succeeds

**Question:** UC-04 E1 says the system "tries again" and tells the branch manager if the payout "still fails after one day". It does not say how long the system keeps trying, what the manager can do next, or what the customer is told. A payout can fail for good, for example when the original card is closed. Payouts go only to the original card (02 Assumption 2) and cash is out of scope (04), so such a request has no way to end. It stays Approved, the customer sees no change, and the money stays owed.

**Options considered:** OI-19 (Missing scenario; Where: 06b / UC-04 E1 and Acceptance Criteria; 03 / Refund request lifecycle; 02 / Assumption 2; 04 / Out of Scope (Cash refunds)).

  - **A.** After the manager is told, the refund is paid another way and the request gets a final status - every request ends; needs an owner rule on a payment way that 02 Assumption 2 and 04 currently rule out.
  - **B.** Keep trying until the payout succeeds - no new status; a closed card means the request never ends.
  - **C.** Tell the customer about the delay and ask the owner for the limit and the fallback - keeps both current rules intact and makes the gap visible.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option C. Add to UC-04 E1: "The customer is told the payout is delayed." Add to UC-04 E1: "**[NEEDS CLARIFICATION: How long does the system keep trying a failed payout before it stops?]**" and "**[NEEDS CLARIFICATION: How is a customer paid when the payout to their original card can never succeed, for example because the card is closed?]**" Once answered, add the final status for such a request to 03 / Refund request lifecycle. The delay message adds behaviour the sources do not state; it follows 01 ("Customers are told the outcome at each step").

Rationale (Why): A needs a payment way the BRD rules out today, so only the owner can choose it; B leaves money owed with no end. C keeps the current rules and replaces the vague "tries again" with a question that has a number for an answer. Tradeoff: UC-04 E1 cannot be fully tested until answered.

Applied together with the editorial split of E1 from Reviewer Notes (same meaning).

Open remainder: the two markers in UC-04 E1. Once answered, the final status for a payout that never succeeds is added to 03 / Refund request lifecycle.

Carried: consistency check CF-03 (Run 3, 2026-10-10) replaced the quoted 01 sentence; 01 now points to 03 / Customer messages, whose opening rule sets the channels for the delay message.

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-20 - No decision time limit, and no cover when the branch manager is away

**Question:** Objective 1 is 3 days from request to payout, and the Branch Manager's goal is to "decide quickly". But no rule says how long a request may wait for a decision. "Quickly" is a vague word that hides the target. Only the branch's own manager can decide (03, UC-04 BR-1), so a manager on leave, a vacant post, or a closed branch leaves every request for that branch stuck in Submitted.

**Options considered:** OI-20 (Gap; Where: 06b / UC-04; 04 / Personas (Branch Manager key goal "Decide quickly"); 01 / Business Objective 1; 03 / Branch ownership).

  - **A.** Set a decision time, mark late requests on the manager's list, and name who decides when the manager is away - protects Objective 1; the cover role may add a persona.
  - **B.** Set a decision time only, with no cover - simple; requests still stall during absences.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A, with the values from the owner. In 04 / Personas, replace "Decide quickly on refunds for the branch" with "Decide on each refund request for the branch within the decision time in UC-04". Add to UC-04 Business Rules: "A branch manager decides on a Submitted request within **[NEEDS CLARIFICATION: Within how many days must a branch manager decide on a Submitted request?]**." Add to UC-04 step 2: "Requests that have waited longer than the decision time are marked as late." Add to 03 / Branch ownership: "**[NEEDS CLARIFICATION: Who decides on a branch's refund requests when its branch manager is away or the post is vacant?]**" If the answer names a new role, add it as a persona in 04 with its journey in 05, its use cases with all nine sections, Use Case Summary rows and a matrix column, and mark each unsettled step for the product owner. Marking late requests adds behaviour the sources do not state.

Rationale (Why): Objective 1 cannot be met if a request can wait without limit, and the own-branch rule (03) turns any absence into a full stop. The number and the cover role are owner decisions. Tradeoff: a cover role may add a persona and use cases.

Open remainder: the decision-time marker in UC-04 BR-5 and the cover marker in 03 / Branch ownership. If a cover role is named, it is added as a persona then.

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-21 - A branch manager deciding on their own refund request

**Question:** A branch manager can also be a customer of their own branch. Nothing stops them from submitting a refund request and approving it themselves: UC-04 BR-1 checks only the branch. In a process that pays out money, a person deciding on their own request is a control gap. use-case-quality.md § Business Rules & Constraints gives "An operator may not approve their own refund request" as an example of a good rule; this is domain practice, not a project fact.

**Options considered:** OI-21 (Risk; Where: 06b / UC-04 Business Rules; 03 / Branch ownership; 10 / NFR-01).

  - **A.** A branch manager cannot decide on a request they submitted; someone else decides - closes the gap; the portal must know the manager is the customer, which depends on OI-02.
  - **B.** Accept the risk and spot it later in the branch report - no extra rule; the payout has already gone out.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to UC-04 Business Rules: "A branch manager cannot decide on a refund request they submitted as a customer. **[NEEDS CLARIFICATION: Who decides on a refund request that a branch manager submits for a purchase at their own branch?]**" Add to UC-04 Acceptance Criteria: "Given a request the branch manager submitted as a customer, when the branch manager opens it, then they cannot approve or reject it." This adds behaviour the sources do not state.

Rationale (Why): Prevention costs one rule; detection after payout (B) cannot undo the payout. Tradeoff: the portal must link a manager to their customer identity, which depends on OI-02.

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-22 - Business Objective 1 is not measured

**Question:** Objective 1 is to "cut the average time from request to payout from 10 days to 3 days". The only report shows "average time to decision" per branch. That leaves out the time from Approved to Paid, including payout retries (UC-04 E1). The report also does not say which period "Daily" covers. The business cannot tell from the portal whether Objective 1 is met.

**Options considered:** OI-22 (Gap; Where: 09 / Branch refund report; 01 / Business Objective 1).

  - **A.** Add the average time from Submitted to Paid to the branch refund report and state its period - measures Objective 1 per branch at small cost; still no portal-wide view.
  - **B.** As A, plus a portal-wide report for a head-office reader - full view; adds an audience that is not a persona today (see Reviewer Notes, Scope proposal 2).

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Change "What It Shows" in 09 / Branch refund report to: "Requests per status, amounts paid, average time from Submitted to decision, and average time from Submitted to Paid, for the branch." Add to 09: "**[NEEDS CLARIFICATION: What period does the daily branch refund report cover: the previous day, the month so far, or another period?]**"

Rationale (Why): An objective with no measure cannot be checked at BAT. A uses information the portal already holds (the status dates in UC-02 step 4). Tradeoff: a portal-wide view stays a scope proposal for the owner.

**Rule home:** [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

### Q-23 - No speed expectation, so NFR-03 cannot be tested

**Question:** NFR-03's measure, "with no slowdown customers notice", depends on how customers feel, so it cannot pass or fail at BAT. The NFR table also has no performance row: nothing says how fast the receipt lookup (UC-01 step 2), submission (UC-01 step 6) or the manager's list (UC-04 step 2) must respond. Without a stated speed, NFR-03 has nothing to hold at 3 times the load.

**Options considered:** OI-23 (Ambiguity; Where: 10 / NFR-03; 10 (no performance row)).

  - **A.** Add NFR-05 Performance with a time limit for everyday actions, and tie NFR-03 to it - both become testable; needs a number from the owner.
  - **B.** Keep NFR-03 as it is - no work; the scalability expectation stays untestable.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to 10: "| NFR-05 | Performance | Customers and branch managers do not wait on the portal during everyday actions: entering a receipt number, submitting a request, opening a request list. | Each everyday action completes within **[NEEDS CLARIFICATION: Within how many seconds must an everyday action in the portal complete?]** seconds. |" Change the NFR-03 Business Measure to: "3 times the normal number of requests for 3 weeks, while still meeting NFR-05."

Rationale (Why): The NFR skeleton (chunks/10-nfrs.md) expects a Performance row with a number, and writing-style.md rule 5 forbids vague measures. A makes NFR-03 testable with the same number. Tradeoff: the owner must give a figure.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Q-24 - No record of who decided what

**Question:** Refunds pay out money, but no section says the portal keeps a record of who made each status change, when, and with what amount and reason. UC-02 step 4 shows only dates. Without such a record, the business cannot answer "who approved this refund?", check NFR-01 (no lost or double payouts), or look into abuse such as OI-21. Lost paper records are the problem the portal replaces (02 Challenges 1).

**Options considered:** OI-24 (Gap; Where: 03 / Refund request; 06a / UC-02 step 4; 06b / UC-04; 10 / NFR-01).

  - **A.** Record every status change with who made it, when, the amount and the reason; nobody can change or delete it - a full trail; small extra effort.
  - **B.** Record only the final decision - lighter; payout retries and cancellations leave no trail.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to 03 / Refund request a sub-section "### Decision record": "For every status change, the portal records who made it (the customer, the branch manager, or the portal for a payout result), the date and time, the amount, and the reason when one is given. Nobody can change or delete this record. **[NEEDS CLARIFICATION: Who, besides the branch manager of the branch, may view the decision record?]**" Add to UC-04 Acceptance Criteria: "Given an approved request, then the decision record shows the branch manager who approved it, the date and time, and the amount." This adds behaviour the sources do not state; it is domain practice for payouts.

Rationale (Why): The portal replaces paper records that get lost (02 Challenges 1). A record nobody can change is the usual control for payouts (domain practice) and is the evidence NFR-01 needs. Tradeoff: if the answer names an auditor role, it becomes a new persona.

Carried (wording, 2026-10-10, BRD v1.3 and v1.4): business review SME-07 added the staff member who records a payout result by hand to the actors; business review DC-07 replaced "change or delete" with "change", and the record is deleted only when the NFR-06 period ends; Q-38 added the portal for a dispute outcome; Q-40 added the second staff member who confirms a payout recorded by hand as paid.

**Rule home:** [03 / Decision record](./03-definitions-and-domain-concepts.md#decision-record)

### Q-25 - How long refund data is kept

**Question:** The portal holds personal data (contact details, see OI-08; purchase details) and money records, but no section says how long they are kept, when they are deleted, or how long a customer can still see an old request in UC-02. Keeping personal data too long breaks privacy rules; deleting money records too early loses what finance and disputes need.

**Options considered:** OI-25 (Gap; Where: 10 (no retention row); 03 / Refund request; 06a / UC-02).

  - **A.** Add a retention NFR with separate periods for refund records and for customer contact details - each kind of data follows its own rule; needs two figures from the owner or legal.
  - **B.** Keep everything with no end date - simplest; privacy risk grows every year.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to 10: "| NFR-06 | Data retention | Refund records and customer personal data are kept only as long as the business needs them. | Refund requests, decisions and payout results are kept for **[NEEDS CLARIFICATION: For how long must refund requests, decisions and payout results be kept?]**. Customer contact details are kept for **[NEEDS CLARIFICATION: For how long may customer contact details be kept after a refund request ends?]**. |" Add to UC-02 Business Rules: "A customer sees their requests for as long as NFR-06 keeps them."

Rationale (Why): Retention periods are legal and finance decisions that no source gives, so markers ask for them. Splitting money records from personal data lets each follow its own rule. Tradeoff: two figures to obtain before build.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Q-26 - Laws and standards the portal must meet are not named

**Question:** The portal handles personal data and card refunds, deals with consumer refund rights, and is used by the public. No section names the data-protection law that applies. None says whether consumer law gives refund rights that differ from the 30-day store rule (such rights vary by country; domain practice, not a project fact). None names an accessibility standard for the customer screens. Each can change requirements: a legal right could override UC-01 BR-1, and an accessibility standard affects every screen.

**Options considered:** OI-26 (Gap; Where: global - 10 / NFR-04; 06a / UC-01 BR-1; 11 / UI/UX Expectations).

  - **A.** Name each applicable law or standard in the BRD, with a marker for the owner or legal team - requirements trace to their legal source; needs legal input now.
  - **B.** Leave compliance to the SDD and delivery - faster now; legal gaps found late cost more to fix.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to the NFR-04 Business Measure in 10: "Customer personal data is handled as **[NEEDS CLARIFICATION: Which data-protection law applies to customer personal data in the portal?]** requires." Add to UC-01 Business Rules: "**[NEEDS CLARIFICATION: Does any consumer law give customers refund rights that differ from the 30-day refund window?]**" Add to 11 / UI/UX Expectations: "- **Accessibility**: The customer screens meet **[NEEDS CLARIFICATION: Which accessibility standard and level must the customer screens meet?]**."

Rationale (Why): Only the owner or the legal team can name the laws; no source does. A legal refund right that differs from UC-01 BR-1 would change the core rule, so it must be known before build. Tradeoff: legal input is needed before BAT.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)
### Q-27 - Alternate and exception flows with no acceptance criterion

**Question:** Raised by consistency check CF-07 (Run 3, 2026-10-10). Ten alternate and exception flows have no acceptance criterion: UC-01 A1, A2, E2, E3, E4; UC-02 A1; UC-03 E1; UC-04 A1, A2 and the customer part of E1. These paths have nothing to test against at UAT/BAT. Should a criterion be added for each?

**Options considered:** OI-27 (Gap; Where: 06a / UC-01, UC-02, UC-03; 06b / UC-04 Acceptance Criteria; raised by consistency check CF-07).

  - **A.** Add one Given/When/Then criterion per flow, taken one-to-one from the stated flow - every path is testable; the lists get longer.
  - **B.** Leave the flows without criteria and let the test cases (chunk 16) cover them - shorter use cases; test cases would then prove behaviour the use case never states as a criterion.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to UC-01 Acceptance Criteria (AC-5 to AC-9) the criteria for A1, A2, E2, E3 and E4; to UC-02 (AC-3) the criterion for A1; to UC-03 (AC-2) the criterion for E1; to UC-04 (AC-6 to AC-8) the criteria for A1, A2 and the customer part of E1, each taken one-to-one from the stated flow, as the CF-07 recommendation in chunk 14 asks; the applied wording is in 06a and 06b.

Rationale (Why): check C7 asks for a criterion for every alternate and exception flow, and use-case-quality.md asks that each criterion trace to a step, branch, or rule. Each new criterion restates a flow the BRD already states, so no behaviour is added. Tradeoff: longer criteria lists.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-28 - Point-of-Sale Records missing from UC-01

**Question:** Raised by consistency check CF-08 (Run 3, 2026-10-10). UC-01 needs Point-of-Sale Records at step 2, and E5 is about that system failing, but UC-01 Supporting Actors says "None", and E5 and AC-3 call it "the receipt records", not by its 08 name. Should UC-01 name Point-of-Sale Records as a supporting external party?

**Options considered:** OI-28 (Inconsistency; Where: 06a / UC-01 Supporting Actors, E5, AC-3; 08 / Point-of-Sale Records; raised by consistency check CF-08).

  - **A.** Name Point-of-Sale Records as an external supporting party of UC-01 and use its 08 name in E5 and AC-3 - the link from use case to integration is traceable; one name for one thing.
  - **B.** As A, and also name the Notification Partner as an external supporting party of UC-01, UC-03 and UC-04 - every partner traced; treats a message channel as an actor, which the BRD does not do elsewhere.
  - **C.** Leave UC-01 as it is - no change; the integration stays untraced and is named two ways.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Set UC-01 Supporting Actors to "External: Point-of-Sale Records ([08](./08-integrations.md))". In E5 and AC-3, replace "the receipt records" with "Point-of-Sale Records".

Rationale (Why): 08 states that Point-of-Sale Records is used "when a customer requests a refund", so the actor field follows a stated source; writing-style.md rule 6 asks for one term for one thing. B is a modelling choice no source asks for. Tradeoff: none of substance. The matrix does not change, because external parties are never columns.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### Q-29 - Planned maintenance and the 2-hour disruption limit

**Question:** Raised by the grill-me session of 2026-10-10, N1 (from its stress test Q41 on NFR-02). NFR-02 allows "no more than 2 hours of disruption a month". It does not say whether planned maintenance counts toward the 2 hours. Under one reading the portal can close for planned work on top of the 2 hours; under the other it cannot. The measure cannot pass or fail at BAT until this is settled. The review of 2026-10-10 had noted the same point in chunk 13 / Reviewer Notes (NFRs row).

**Options considered:** OI-29 (Ambiguity; Where: 10 / NFR-02; raised by the grill-me session of 2026-10-10, N1).

  - **A.** Every disruption counts, planned maintenance included - matches the expectation that customers can use the portal at any time; planned work must fit inside the 2 hours.
  - **B.** Planned maintenance that customers are told about in advance does not count - more room for planned work; customers can still find the portal closed, which "at any time" does not allow, and the notice period needs a figure.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Change the NFR-02 Business Measure to: "No more than 2 hours of disruption a month. Planned maintenance counts toward the 2 hours."

Rationale (Why): The NFR-02 business expectation, unchanged since BRD v1.0, says "Customers can use the portal at any time". Only A keeps the measure true to it, and it needs no new figure. Tradeoff: planned work must fit inside the same 2 hours.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Q-30 - Partial approval of a request with several items

**Question:** Raised by the grill-me session of 2026-10-10, N2 (from its stress test Q38 on UC-04 BR-2). UC-04 step 4 shows each requested item with its amount. A1 then lowers "the amount", but does not say whether the branch manager lowers it item by item or on the request total. UC-01 BR-2 blocks an item once it is refunded in full, and BR-7 asks about the rest of a partly refunded item: both work per item. If only the total is lowered, nobody can tell which items were refunded in full, so BR-2 cannot be checked on a later request.

**Options considered:** OI-30 (Ambiguity; Where: 06b / UC-04 A1 and BR-2; 06a / UC-01 BR-2 and BR-7; raised by the grill-me session of 2026-10-10, N2).

  - **A.** The branch manager lowers the amount item by item, and the approved amount is the sum of the item amounts - each item's outcome is known, so UC-01 BR-2 and BR-7 work as written; the manager may enter more than one amount.
  - **B.** The branch manager lowers the request total only - one amount to enter; needs a further rule to split the lower total across the items, or treats every item on the request as partly refunded.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Replace UC-04 A1 with: "A1 - Partial approval: At step 6, the branch manager lowers the amount of one or more items and gives a reason. The approved amount is the sum of the item amounts. The rest of the flow continues with the approved amount. The customer is told the approved amount and the reason." Replace UC-04 BR-2 with: "A lowered item amount must be more than 0 and less than that item's requested amount. Once the request is Paid, an item whose amount was not lowered is refunded in full, and a lowered item is partly refunded ([06a / UC-01 BR-7](./06a-use-cases-customer.md#uc-01-request-a-refund))." Add to UC-04 Acceptance Criteria (AC-9): "Given a request for two items, when the branch manager lowers the amount of one item, then the approved amount is the full amount of the other item plus the lowered amount."

Rationale (Why): UC-04 step 4 already shows each item with its amount, and UC-01 BR-2 and BR-7 already decide per item. Only A gives those rules the item outcome they need. Tradeoff: the branch manager may enter one amount per lowered item instead of one total.

Not decided here: whether the rest of a partly refunded item can be requested again stays the open question in UC-01 BR-7 (TD-18); how each item's amount is worked out stays OI-10 (TD-01).

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-31 - Payouts still being retried at the end of a month

**Question:** Raised by the grill-me session of 2026-10-10, N3 (from its stress test Q40 on NFR-01). NFR-01 allows "zero missing or duplicate payouts per month". Under UC-04 E1 the system keeps trying a refused payout and tells the customer it is delayed. A payout that is still being tried when the month ends is neither paid nor lost. NFR-01 does not say whether it counts as missing, so the monthly measure can fail for a payout that succeeds the next day.

**Options considered:** OI-31 (Ambiguity; Where: 10 / NFR-01; 06b / UC-04 E1; raised by the grill-me session of 2026-10-10, N3).

  - **A.** A payout that the system is still trying under UC-04 E1 at the end of a month counts as delayed, not missing - matches what E1 tells the customer; how long a payout can stay delayed depends on the open question in UC-04 E1 (TD-20).
  - **B.** Any Approved request that is not Paid at the end of the month counts as missing - strict and simple; a payout refused on the last day of a month fails NFR-01 even if it succeeds the next day.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. Add to the NFR-01 Business Measure: "A payout that the system is still trying again under [06b / UC-04 E1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) at the end of a month counts as delayed, not missing."

Rationale (Why): UC-04 E1 already treats a refused payout as delayed and tells the customer so. NFR-01 is about money lost or paid twice, not about payouts that cross a month end. Tradeoff: until the UC-04 E1 question on how long the system keeps trying (TD-20) is answered, a payout can stay delayed without counting against NFR-01.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Q-37 - A Paid payout that the card issuer sends back

**Question:** Raised by business review SME-03 (open remainder of its decision record, below). Paid means the payment provider accepted the payout (03). The card issuer can still send the money back later, for example when the card is closed. Nothing said what happens to the request then: it stays Paid, the customer was told it is paid, Loyalty Points has taken back the points, and the money is owed with nobody told. NFR-01 ("refund money is never lost") cannot hold.

**Options considered:** OI-37 (Missing scenario; Where: 03 / Refund request lifecycle, marker; 06b / UC-04 E1; 08 / Loyalty Points; raised by business review SME-03).

  - **A.** The request goes back to Approved and follows UC-04 E1 like a refused payout: the system tries again, the customer is told the payout is delayed, the branch manager is told after one day, and the open E1 questions decide the end - one path for every payout that does not reach the card; a Paid request can change again, and Loyalty Points must be told.
  - **B.** A new final status, "Payout returned", and the team that handles stopped payouts (04) settles it outside the portal - clear for the customer; adds a status and a manual process whose team has no name yet.
  - **C.** The request stays Paid and the money is handled outside the portal - no change; the customer and the portal never learn the money did not arrive, against NFR-01.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. In 03 / Refund request lifecycle, the marker was replaced with: "If the card issuer sends a Paid payout back, for example because the card is closed, the request goes back to Approved and follows [06b / UC-04 E1]." UC-04 E1 now starts: "At step 9, the payment provider refuses the payout, or the card issuer sends back a payout after the request is Paid. The request stays Approved, or goes back to Approved if it was Paid." UC-04 AC-11 was added: "Given a Paid request whose payout the card issuer sends back, then the request goes back to Approved and the customer is told the payout is delayed." In 08 / Loyalty Points, the outcome is now "(Paid, Rejected or Cancelled, or back to Approved when a Paid payout is sent back)". This adds behaviour the sources do not state.

Rationale (Why): UC-04 E1 already handles a payout that does not reach the card, and Q-19 left the never-succeeds case to the owner on purpose; A reuses both, so the money stays visible as owed (NFR-01). B adds a status that depends on a team nobody has named; C hides the debt. Tradeoff: a Paid request can return to Approved, and Loyalty Points must handle that outcome.

Open remainder: none new. The end of such a payout follows the two open questions in UC-04 E1 (TD-20, TD-21). How Loyalty Points treats a refund that goes back to Approved is a question for the Loyalty Points owner (08 / Loyalty Points).

Carried (wording): consistency check CF-28 (Run 8, 2026-10-10) replaced "card issuer" with "the customer's bank", the wording of the Glossary's "Card dispute" definition, in 03 and UC-04 E1 and AC-11; CF-24 added the row "Back to Approved (a Paid payout is sent back)" to 03 / Customer messages, from this decision.

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-38 - A customer who also disputes the card payment

**Question:** Raised by business review SME-04 (open remainder of its decision record, below). A customer who waits for a refund may also dispute the original card payment with their bank. If the bank gives the money back and the portal pays the refund too, the business pays twice. NFR-01 counts only payouts, so it would not see this. The branch manager does not know about the dispute when deciding.

**Options considered:** OI-38 (Risk; Where: 06b / UC-04 BR-8; 03 / Refund request lifecycle and Decision record; 08 / Payment Provider; raised by business review SME-04).

  - **A.** Hold the payout until the bank decides: the branch manager sees the dispute; the payout waits; if the bank gives the money back, the request is Rejected with that reason; if the bank refuses the dispute, the payout is sent - no double payment; the portal must learn of disputes from the payment provider (TD-57), and the customer waits longer.
  - **B.** Reject at once: a request whose original payment is disputed is rejected with that reason - simple; if the bank refuses the dispute, the customer must ask again, which depends on the open UC-01 BR-6 question.
  - **C.** No rule in the portal: disputes are checked after the payout, outside the portal - no change; a double payment is found only after the money is paid twice.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. UC-04 BR-8 (the marker) was replaced with: "If the customer has disputed the original card payment with their bank, the payout waits until the bank decides the dispute. If the bank gives the money back to the customer, the system marks the request Rejected with the reason that the bank has already refunded the payment. If the bank refuses the dispute, the system sends the payout." UC-04 E3 "Original payment disputed" was added (at step 4, the system shows the dispute; if the branch manager approves, the payout waits as BR-8 says), with AC-12 and AC-13. 03 / Refund request lifecycle gained the move from Approved to Rejected for a dispute the bank gives back; 03 / Decision record names the portal for a dispute outcome; the Rejected row of 03 / Customer messages cites UC-04 BR-8; 08 / Payment Provider exchanges disputes of the original card payment and their outcome; 02 / Glossary defines "Card dispute". This adds behaviour the sources do not state.

Rationale (Why): Holding the payout is the review's direction (SME-04) and usual retail practice (domain practice, not a project fact). It is the only option that stops a double payment before it happens without making the customer start again. Tradeoff: the customer waits for the bank, and the rule works only if the payment provider reports disputes.

Open remainder (a fact for the payment provider): can CardPay Ltd report a dispute of the original card payment and its outcome (TD-57)? Consistency check CF-26 (Run 8, 2026-10-10) made it a marker in the Notes of the 02 / Dependencies CardPay row.

Carried (wording): consistency check CF-36 (Run 8, 2026-10-10) narrowed the Given of UC-04 AC-1 to "a Submitted request with no card dispute", so it agrees with AC-12. Q-48 (OI-48) settled how NFR-01 counts a held payout; Q-49 (OI-49) added UC-04 BR-9 after BR-8. Consistency check CF-37 (Run 9, 2026-10-10) added UC-04 AC-15 (the dispute is shown) and AC-16 (the payout is sent when the bank refuses the dispute), taken one-to-one from this decision.

**Rule home:** [06b / UC-04 Business Rules & Constraints](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-40 - A second person for a payout recorded by hand as paid

**Question:** Raised by business review SME-07 (open remainder of its decision record, below; the second question of the 04 / Personas payout marker). A staff member can record by hand that a payout was paid (03 / Decision record). That makes the refund Paid and closes the customer's claim. If one person can do this alone, a mistake or misuse closes a refund that was never paid, and NFR-01 does not catch it.

**Options considered:** OI-40 (Risk; Where: 04 / Personas, payout marker (second question); 03 / Decision record; raised by business review SME-07).

  - **A.** A second staff member confirms before the request becomes Paid, and the decision record keeps both - two people on a money decision; two people are needed for each such case.
  - **B.** One staff member is enough, and the decision record shows who did it - faster; a wrong entry is found only by the monthly check.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. 03 / Decision record now says: "When a staff member records by hand that a payout was paid, a second staff member must confirm it before the request becomes Paid. The decision record keeps both." The second question was removed from the 04 / Personas payout marker.

Rationale (Why): The BRD already stops one person from deciding alone where money is at risk (UC-04 BR-6, Q-21), and the review names two-person control on a manual "paid" as normal practice (SME-07). Tradeoff: two staff members for each payout recorded by hand.

**Rule home:** [03 / Decision record](./03-definitions-and-domain-concepts.md#decision-record)

### Q-41 - What the branch manager does when told a payout still fails

**Question:** Raised by business review SME-07 (open remainder of its decision record, below; the third question of the 04 / Personas payout marker). UC-04 E1 tells the branch manager when a payout still fails after one day, but no use case said what the branch manager does next.

**Options considered:** OI-41 (Ambiguity; Where: 06b / UC-04 E1; 04 / Personas, payout marker (third question); raised by business review SME-07).

  - **A.** The message is for information only: the branch manager has no action to take in the portal - keeps the flow BRD v1.0 states; the branch manager cannot change the payout.
  - **B.** The branch manager phones the customer - personal contact; adds work and a process outside the portal.
  - **C.** The message goes to the team that handles stopped payouts instead of the branch manager - it reaches someone who can act; changes the UC-04 E1 behaviour that BRD v1.0 states, and that team has no name yet (OI-39).

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. UC-04 E1 now says, after the branch manager is told: "This message is for information only: the branch manager has no action to take in the portal." The third question was removed from the 04 / Personas payout marker.

Rationale (Why): Payouts go only to the original card (02 Assumption 2), so the branch manager cannot pay another way; the source already tells them, and A says plainly that nothing more is expected. C changes a source flow and B adds a process no source asks for. Tradeoff: the branch manager knows of the problem but cannot fix it.

**Rule home:** [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-44 - How the branches start using the portal

**Question:** Raised by business review PM-02 (open remainder of its decision record, below). The BRD did not say whether all 40 branches start on the same day. What happens to paper requests open at go-live is still open (04, TD-14), and seasonal sales triple the requests for about 3 weeks (02 Facts 2). If every branch switches at once, any problem reaches every customer and branch at the same time.

**Options considered:** OI-44 (Gap; Where: 04 / Project Scope, rollout marker; 06a / UC-01; raised by business review PM-02).

  - **A.** All 40 branches start on the same day - one process everywhere, and Business Objective 2 holds everywhere from the first day; any problem hits every branch.
  - **B.** A pilot group of branches starts first, and the other branches start after the pilot - problems show up in a few branches first; for a while two processes run side by side, and customers of a branch that has not started are sent to the branch.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option B. The 04 rollout marker was replaced with: "The portal starts in a pilot group of branches. The other branches start after the pilot. Until a branch starts, it handles refund requests as it does today." followed by three markers: which branches form the pilot group; how long the pilot runs; after the pilot, whether the other branches start all on one day or in groups, and in what order. UC-01 E6 "Branch not using the portal yet" and UC-01 AC-10 were added. This adds behaviour the sources do not state.

Rationale (Why): The review found no rollout plan (PM-02), the paper cut-over is still open (TD-14), and requests triple in the seasonal sales (02 Facts 2); a pilot keeps a problem to a few branches. Tradeoff: two processes run side by side for a while, and customers of branches that have not started are sent to the branch (E6).

Open remainder: three questions for the product owner, asked by the three markers in 04 / Project Scope (TD-69 to TD-71).

Carried (wording): consistency check CF-29 (Run 8, 2026-10-10) added two 04 / In Scope bullets for settled capabilities (follow and cancel requests; the branch refund report); they do not change the rollout rule.

**Rule home:** [04 / Project Scope](./04-scope-and-personas.md#project-scope)

### Q-48 - How NFR-01 counts a payout held for a card dispute

**Question:** Raised by consistency check CF-25 (Run 8, 2026-10-10). NFR-01 says a payout still being tried under UC-04 E1 at the end of a month counts as delayed, not missing. UC-04 BR-8 (Q-38) now holds the payout of an approved request while the customer's card dispute is open. NFR-01 did not say how such a payout counts, so the monthly check could count every held payout as missing.

**Options considered:** OI-48 (Ambiguity; Where: 10 / NFR-01; 06b / UC-04 BR-8 and E3; raised by consistency check CF-25).

  - **A.** A payout held for a card dispute counts as waiting, not missing - matches the OI-31 rule for retries; a held payout can wait as long as the bank takes without counting against NFR-01.
  - **B.** Held payouts are counted on their own in the monthly check - visible to the business; NFR-01 then needs a second figure that no source gives.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. The NFR-01 Business Measure now adds: "A payout that waits for a card dispute under [06b / UC-04 BR-8] at the end of a month counts as waiting, not missing."

Rationale (Why): NFR-01 is about money lost or paid twice (Q-31); BR-8 holds the payout on purpose to avoid paying twice, so the money is neither lost nor paid. A follows the rule OI-31 set for retries and needs no new figure. Tradeoff: a long dispute does not show in NFR-01.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### Q-49 - Loyalty Points as a receiver in the use cases

**Question:** Raised by consistency check CF-27 (Run 8, 2026-10-10). 08 says the portal sends Loyalty Points the outcome of every refund request (Paid, Rejected, Cancelled, or back to Approved). No use case named Loyalty Points, no step or rule sent the outcome, and no criterion tested it.

**Options considered:** OI-49 (Gap; Where: 08 / Loyalty Points; 06a / UC-03; 06b / UC-04; raised by consistency check CF-27).

  - **A.** Name Loyalty Points as an external supporting party of UC-03 and UC-04, with one rule and one criterion in each - traceable and testable; longer use cases.
  - **B.** Keep the exchange in 08 only - no change to the use cases; the integration stays untraced and untested.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. UC-03 Supporting Actors is "External: Loyalty Points"; UC-03 BR-3: "When a request is Cancelled, the system tells Loyalty Points the outcome."; UC-03 AC-3: "Given a request the customer cancels, then Loyalty Points is told the outcome." UC-04 Supporting Actors adds "External: Loyalty Points"; UC-04 BR-9: "When a request becomes Paid or Rejected, or goes back to Approved after a Paid payout is sent back, the system tells Loyalty Points the outcome."; UC-04 AC-14: "Given a request that becomes Paid or Rejected, or goes back to Approved, then Loyalty Points is told the outcome." The matrix does not change: external parties are never columns.

Rationale (Why): OI-28 named Point-of-Sale Records in UC-01 because the use case relies on it. Loyalty Points is a separate business system with its own BRD, not a message channel (OI-28 option B), and 08 already states what it receives. A takes the rule one-to-one from 08. Tradeoff: longer use cases.

Carried: consistency check CF-38 (Run 9, 2026-10-10) added the 04 / In Scope bullet for telling Loyalty Points the outcome, applied with Q-50.

**Rule home:** [06b / UC-04 Business Rules & Constraints](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### Q-50 - Refund outcomes before Loyalty Points starts

**Question:** Raised by consistency check CF-38 (Run 9, 2026-10-10). UC-03 BR-3 and UC-04 BR-9 (Q-49) send the outcome of every refund request to Loyalty Points. 04 says the Refunds Portal can go live on its own date, before Loyalty Points (business review PM-02). Nothing said what happens to the outcomes while Loyalty Points cannot receive them; outcomes from that time could be lost, so the points of those paid refunds would never be taken back.

**Options considered:** OI-50 (Missing scenario; Where: 04 / Project Scope; 06a / UC-03 BR-3, AC-3; 06b / UC-04 BR-9, AC-14; 08 / Loyalty Points; raised by consistency check CF-38).

  - **A.** The portal keeps the outcomes and sends them when Loyalty Points starts - no outcome is lost; Loyalty Points gets a first batch of older outcomes.
  - **B.** Outcomes from before Loyalty Points starts are not sent, and the Loyalty Points owner handles those refunds - simple; points for those refunds are never taken back unless the Loyalty Points owner acts.

**Decision record, 2026-10-10:** Accepted recommendation. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Chosen answer: Option A. 04 / Project Scope now says: "Until Loyalty Points starts, the portal keeps the outcome of each refund request and sends the kept outcomes to Loyalty Points when it starts." 04 / In Scope adds: "Telling Loyalty Points the outcome of each refund request."

Rationale (Why): 08 states that Loyalty Points uses the outcomes to take back the points of paid refunds, and the two products may go live on different dates (PM-02). A loses nothing and needs no new figure; B leaves points that should be taken back. Tradeoff: Loyalty Points receives older outcomes in one batch when it starts. How Loyalty Points treats that batch is a question for the Loyalty Points owner.

Carried (BRD v1.5, 2026-10-10): consistency check CF-42 (Run 10), applied through TD-78, carried this rule into the use cases. UC-03 BR-3 and UC-04 BR-9 now end with "Before Loyalty Points starts, the system keeps the outcome and sends it when Loyalty Points starts", linking to 04 / Project Scope (the decided wording "the outcome is kept and sent when it starts" was put in plain language with the system as actor in the same request; the meaning is unchanged). UC-03 AC-4 and UC-04 AC-17 test it.

**Rule home:** [04 / Project Scope](./04-scope-and-personas.md#project-scope)

## Marker register

### 03 / Customer messages, Approved in full row (was Approved row)

**Resolution (2026-10-10):** Partly settled. The accepted answer to OI-16 (Q-16), applied under Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), tells the customer the approved amount and the reason at a partial approval. Consistency check CF-12 (Run 4) split the row: "Approved in part" now states that message, and the marker stays open only for a full approval (TD-10).

**Rule home:** [03 / Customer messages](./03-definitions-and-domain-concepts.md#customer-messages)

### 03 / Customer messages, Approved in full row (message on a full approval)

**Resolution (2026-10-10):** Settled by business review PM-10. The marker "Is the customer told when a request is Approved in full, before it is Paid?" was replaced by "Email and SMS, with the approved amount" (source UC-04 step 8); UC-04 step 8 and AC-10 carry the rule. The to-do row TD-10 is closed by it.

**Rule home:** [03 / Customer messages](./03-definitions-and-domain-concepts.md#customer-messages)

### 02 / Dependencies, payment provider row, Needed before cell

**Resolution (2026-10-10):** Settled by business review SME-05. The marker that asked before which milestone refunds to the original card must be in place (build of UC-04, BAT sign-off, or go-live) was replaced by "Build of UC-04", with the reason in Notes. The to-do row TD-07 is closed by it. The row's Status marker stays open, widened to CardPay's conditions (TD-06).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

## Business review register

### BO-02 - No cost baseline or expected saving

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that 01 / Background gives no cost of today's paper and phone process and no expected saving or budget. Decided: Option A, ask the owner in the BRD. A clarification marker in 01 / Background asks for today's cost and the expected saving or budget. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: one fact for this BRD's owner (the cost and saving figures), added as the marker in 01 / Background. Carried (2026-10-10, BRD v1.4): consistency check CF-31 (Run 8) split the marker into two, one question each (TD-44, TD-45).

**Rule home:** [01 / Background and Context / Problem Statement](./01-executive-summary-and-context.md#background-and-context--problem-statement)

### BO-06 - Legal confirmation before go-live

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the open questions on the data-protection law (NFR-04) and on consumer refund rights (UC-01 BR-8) gate nothing. Decided: Option A. 02 / Dependencies has a new Hard row "Legal confirmation", Status Pending, needed before go-live; the SDD Prod gate (§11.3) now includes it. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: one fact for this BRD's owner, who confirms the law and the consumer rights, added as the marker in the row's Owner cell; the law and the rights themselves stay the existing markers.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### BO-08 - Approval limits above the branch manager

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings BO-08, SME-08) found that a branch manager can approve a refund of any amount alone; the only control is UC-04 BR-6. Decided: Option A. UC-04 BR-7, added at the end of the list, is a clarification marker asking above which amount, if any, a second person must also approve, and who. It replaced nothing. The head-office view the findings also ask for is point PM-03; the owner of payout exceptions is point SME-07. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: one question for this BRD's owner, a business choice (whether a second approver applies, the amount and the role), added as the marker in UC-04 BR-7.

**Rule home:** [06b / UC-04 Business Rules & Constraints](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### BO-09 - Objectives for complaints and portal use

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the objectives in 01 measure neither the complaints that justify the project (01 / Background: 18% of complaints to customer care) nor how many refunds use the portal. Decided: Option A. Business Objectives 4 (fewer complaints about refunds) and 5 (customers use the portal) were added at the end of the list, each with its target and date as clarification markers. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: four business choices for this BRD's owner (the two targets and their dates), added as markers in 01 / Business Objectives. Counting in-branch requests depends on the open 04 / Project Scope question about in-person requests.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### SME-02 - Receipt number as the purchase key

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that UC-01 treats the receipt number as unique across 40 branches, and that nothing says how soon a receipt can be found after the purchase. Decided: Option A. 02 / Assumptions 3 (one receipt number identifies one purchase) and 4 (receipts can be found on the day of the purchase) were added, each with a clarification marker asking whether it holds. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: two facts for the Retail IT team (Point-of-Sale Records) through this BRD's owner, added as the markers in Assumptions 3 and 4. The SDD carries the same question as a marker in 13a.

**Rule home:** [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)

### SME-03 - What Paid means, and a refund returned after Paid

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings SME-03, PA-04) found that Paid is set when the payment provider accepts the payout, while the money takes days to reach the card, and that nothing says what happens when a Paid refund is sent back. Decided: Option A. 03 / Refund request lifecycle now says what Paid means and asks, by a marker, what happens when the card issuer sends a Paid payout back; the Paid row of 03 / Customer messages says when the money usually shows on the card, with the number of days as a marker. It replaced the Paid message "Email and SMS". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a fact for the payment provider (the usual number of days), and a business choice for this BRD's owner (what happens to a Paid request whose payout is sent back), both added as markers in 03. Once the business choice is made, the compensating design (a reversal fact and who reacts to it) is a design choice for the SDD owner. Carried (2026-10-10, BRD v1.4): the business choice was decided as Q-37 (OI-37), which replaced the 03 marker; the fact on the number of days stays the marker in the Paid row (TD-55).

**Rule home:** [03 / Refund request lifecycle](./03-definitions-and-domain-concepts.md#refund-request-lifecycle)

### SME-04 - Card disputes and double refunds

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that no rule covers a customer who disputes the original card payment with their bank while the refund is paid too, so the business can pay twice while NFR-01 reports no duplicate. Decided: Option A. UC-04 BR-8, added at the end of the list, is a clarification marker asking what happens to the request in that case. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner (marker in UC-04 BR-8); whether the payment provider can report disputes is a provider question that follows it. How NFR-01 and the SDD reconciliation count such a case follows the answer. Carried (2026-10-10, BRD v1.4): the business choice was decided as Q-38 (OI-38), which replaced the UC-04 BR-8 marker; NFR-01 was settled as Q-48 (OI-48); the provider question is the marker in the Notes of the 02 CardPay row (TD-57).

**Rule home:** [06b / UC-04 Business Rules & Constraints](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### SME-05 - The CardPay dependency and when it is needed

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the CardPay dependency asked only whether refunds to the original card are supported, and that its milestone was open (TD-07), while a refund of a card-present branch sale may need one merchant account per branch, a time limit or details of the original payment. Decided: Option A. In 02 / Dependencies, the Status marker now also asks CardPay's conditions, and Needed before is "Build of UC-04", with the reason in Notes. It answers the Needed-before marker of TD-07 and replaces it; it replaced the Notes text "None.". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a provider question for CardPay Ltd (whether it supports these refunds, and on which conditions), kept as the widened Status marker (TD-06). Carried (2026-10-10, BRD v1.4): consistency check CF-31 (Run 8) split the Status marker into two, one question each: whether CardPay confirmed (TD-06), and on which conditions (TD-74).

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### SME-06 - Tax and accounting records for a refund

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that no requirement covers the refund document the customer receives (for example a credit note) or the fiscal and accounting record of a refund. Decided: Option A. NFR-07 "Tax and accounting records" was added at the end of 10, with a marker asking the countries, the refund document and the fiscal or accounting record. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a fact for this BRD's owner (the countries and the legal duties), added as the marker in NFR-07. An integration with a finance or fiscal system, if the answer needs one, is a later business choice. Carried (2026-10-10, BRD v1.4): consistency check CF-31 (Run 8) split the NFR-07 marker into three, one question each (TD-58, TD-75, TD-76).

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### SME-07 - Who owns payout exceptions and the monthly check

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings SME-07, PM-05, and the operator-actor part of DC-05) found that the SDD gives an unnamed operations team money decisions (recording whether a stopped or unknown payout was paid, the monthly check for missing or double payouts) that no persona in 04 and no actor in 03 / Decision record covers, and that the branch manager told of a failing payout has no next step. Decided: Option A. 03 / Decision record now also names the staff member who records a payout result by hand; a marker under 04 / Personas asks which team does this work, whether a second person must confirm a payout recorded by hand as paid, and what the branch manager does when told of a failing payout. It replaced the actor list "the customer, the branch manager, or the portal for a payout result". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: business choices for this BRD's owner (the team, the second-person rule, the branch manager's action), added as the marker in 04. A persona, matrix column and use cases follow only if the owner adds the team to the product. The SDD derives the new decision-record actor at its hand-off. Carried (2026-10-10, BRD v1.4): the second-person rule was decided as Q-40 (OI-40) and the branch manager's action as Q-41 (OI-41); the 04 marker now asks only which team does this work (OI-39, TD-59). Consistency check CF-23 (Run 8) added these staff to the NFR-04 measure.

**Rule home:** [03 / Decision record](./03-definitions-and-domain-concepts.md#decision-record)

### SME-09 - Refund windows by period or item, and the reason list

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that UC-01 has one 30-day window for every purchase and a free-text reason, while retailers often extend the window for seasonal purchases and handle faulty items differently. Decided: Option A. UC-01 BR-9 (other windows for some periods or item types) and BR-10 (a reason list separating a change of mind from a faulty item, and the faulty item's window or remedy) were added at the end of the list as clarification markers. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: two business choices for this BRD's owner, likely settled by store refund policy v3 (not attached), added as the markers in UC-01 BR-9 and BR-10.

**Rule home:** [06a / UC-01 Business Rules & Constraints](./06a-use-cases-customer.md#uc-01-request-a-refund)

### PM-02 - Going live on its own, and the branch rollout

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings PM-02, BO-04) found that one shared Prod gate tied the Refunds Portal's go-live to the Loyalty Points purchase feed, and that no rollout order or pilot is stated. Decided: Option A. 04 / Project Scope now says the Refunds Portal can go live on its own date, and a marker asks whether all 40 branches start on the same day or a pilot group starts first. The SDD splits its Prod gate per product (§11.3, §11.5). It replaced nothing in this BRD. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner (rollout order and pilot), added as the marker in 04 / Project Scope. Carried (2026-10-10, BRD v1.4): decided as Q-44 (OI-44); the marker was replaced by the pilot rule and three new markers (TD-69 to TD-71).

**Rule home:** [04 / Project Scope](./04-scope-and-personas.md#project-scope)

### PM-03 - A view of the objectives across all branches

**Decision record, 2026-10-10:** The business review of 2026-10-10 (and the head-office view part of BO-08) found that the objectives in 01 are portal-wide but 09 has only a per-branch report read by branch managers, so the people who approved the BRD have no view (13 / Reviewer Notes, Scope proposal 2, is still undecided). Decided: Option A. A marker in 09 asks who outside the branches follows the objectives across all 40 branches, and in which report. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner (the reader and the report; Scope proposal 2 is one answer), added as the marker in 09.

**Rule home:** [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

### PM-04 - The branch refund report in the journey and the screens

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the branch refund report of 09 appears in no journey, no screen list and no mockup row. Decided: Option A. The 05 Branch Manager Journey now includes opening the report, and 11 / Screens says the report has no screen ID and no mockup yet. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none new; the report's format and period stay the existing 09 markers. For the hand-off: the report needs a mockup coverage row in chunk 14 (owned by this BRD's skill), and its acceptance cases trace to 09 / Branch refund report when chunk 16 is written.

**Rule home:** [05 / Branch Manager Journey](./05-user-journeys-overview.md#branch-manager-journey)

### PM-09 - When the wishlist items start

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the wishlist items in 12 and the UC-04 future enhancement (bulk approval of small refunds) have no target release or starting condition. Decided: Option A. A marker under 12 / Wishlist asks for a target release or a starting condition for each. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner, added as the marker in 12.

**Rule home:** [12 / Wishlist](./12-appendix-and-wishlist.md#wishlist)

### PM-10 - A message when a request is approved in full

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that a customer whose request is approved in full hears nothing until the money is paid, while a partial approval is messaged, which works against the complaints in 01 / Background. Decided: Option A. The "Approved in full" row of 03 / Customer messages is now "Email and SMS, with the approved amount" (source UC-04 step 8); UC-04 step 8 tells the customer; UC-04 AC-10, added at the end, tests it. It answers and replaces the marker "Is the customer told when a request is Approved in full, before it is Paid?" (TD-10; this register's Marker register entry "03 / Customer messages, Approved in full row" stays as the earlier record). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none.

**Rule home:** [03 / Customer messages](./03-definitions-and-domain-concepts.md#customer-messages)

### PM-11 - A view for customer care

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that customer care, who receive the complaints that justify the project, cannot see a refund request (NFR-04), and that Scope proposal 1 (13 / Reviewer Notes) has no owner question. Decided: Option A. A marker under 04 / Personas asks whether customer care agents get a read-only view of a customer's refund requests, and notes that a yes changes NFR-04. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner (Scope proposal 1), added as the marker in 04.

**Rule home:** [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors)

### DC-06 - Loyalty Points as a receiver, and the Point-of-Sale Records dependency

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings DC-06, BO-05, and the refund-outcome contract owner part of PA-03) found that Loyalty Points takes points back from the refund outcomes of this portal while 08 did not name Loyalty Points as a receiver, and that 02 had no dependency on Point-of-Sale Records although 08 marks it Critical. Decided: Option A. 08 has a new row "Loyalty Points" (we send the reference number, receipt number, refunded amount, outcome and paid date; Important; owner: the Loyalty Points owner); 02 / Dependencies has a new Hard row for Point-of-Sale Records (Retail IT team, Status asked by a marker, needed before the build of UC-01). It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a fact for the Retail IT team (whether the receipt lookup is agreed), added as the Status marker in 02. Whether the receipt number is the Loyalty Points purchase reference stays the SDD's open link question.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### DC-07 - The decision record and its retention period

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that 03 / Decision record said "Nobody can change or delete this record" while NFR-06 sets a period after which decisions are no longer kept. Decided: Option A. 03 / Decision record now says nobody can change the record, and it is deleted only when the NFR-06 retention period ends. It replaced "Nobody can change or delete this record." Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none new; the period stays the existing NFR-06 marker.

**Rule home:** [03 / Decision record](./03-definitions-and-domain-concepts.md#decision-record)

## Walkthrough and delegation history

**Delegation, recorded 2026-10-10:** The run that moved this BRD to the current template ran under an answer policy. Name: full-autonomous run policy. Set by Mahmoud on 2026-10-08. Words: "answer policy: accept the recommended option. Continue at part checkpoints. Stand-ins: Product Owner, Mockup, Approver." It names three stand-ins (Product Owner, Mockup, Approver) and one stop it may pass (the part checkpoints). The run was written `whole`, so no part checkpoint came up.

**Acceptance loop, 2026-10-10:** 25 new open items (OI-02 to OI-26) were presented in 7 batches of up to 4 items (OI-02 to OI-05, OI-06 to OI-09, OI-10 to OI-13, OI-14 to OI-17, OI-18 to OI-21, OI-22 to OI-25, OI-26). The policy took the Recommended Answer of 23 items. It left OI-10 (refund amount) and OI-11 (last day of the refund window) open: their Recommended Answers set refund rules that store refund policy v3 would settle, and that policy is not attached (SKILL.md step 8, Answer policy, rule 3). The platform's standing answer for items the policy did not decide was "later", so both stay Open for the next loop.

**Acceptance loop for items raised by the consistency check, 2026-10-10:** OI-27 (from CF-07) and OI-28 (from CF-08) were presented in one batch. The policy took both Recommended Answers. The brand or key color was not asked: the project rules say it stays an open question for the product owner, and under an answer policy the color is not asked.

**Acceptance loop for the request "update the todo: the grill-me session is done", 2026-10-10:** The same answer policy applied (recorded above). Five open items were presented in 2 batches: OI-10, OI-11, OI-29, OI-30, then OI-31. The policy took the Recommended Answer of OI-29, OI-30 and OI-31. It left OI-10 and OI-11 open again, on the same grounds as before: store refund policy v3 would settle them, and it is still not attached. The platform's standing answer for those two was "later", so both stay Open for the next loop. The brand or key color was not asked, for the reason above.

**Acceptance loop for the request "update the todo: decisions from the business review of 2026-10-10", 2026-10-10:** The same answer policy applied (recorded above). Eighteen open items were presented in 5 batches: OI-10, OI-11, OI-32, OI-33; OI-34 to OI-37; OI-38 to OI-41; OI-42 to OI-45; OI-46, OI-47. The policy took the Recommended Answer of OI-37, OI-38, OI-40, OI-41 and OI-44. It left 13 items open, because each Recommended Answer needs something the policy cannot supply (SKILL.md step 8, Answer policy, rule 3):

- OI-10, OI-11, OI-42 and OI-43: store refund policy v3 would settle them, and it is not attached (OI-43 also waits for the consumer-law question, TD-19).
- OI-32: the refund limit and the approving role are values no source gives.
- OI-33 to OI-36: the target shares and the number of months are values no source gives.
- OI-39: the team that does the payout work is a fact only the owner can give.
- OI-45: who follows the objectives across all branches is a fact only the owner can give.
- OI-46: the target release or starting condition of each item is a value no source gives.
- OI-47: the access needs a legal basis that the data-protection law (TD-26) gives.

The platform's standing answer for items the policy did not decide was "later", so all 13 stay Open for the next loop. The brand or key color was not asked, for the reason above.

**Acceptance loop for items raised by consistency check Run 8, same request, 2026-10-10:** OI-48 (from CF-25) and OI-49 (from CF-27) were presented in one batch. The policy took both Recommended Answers. The 13 items left "later" earlier in this request were not asked again in the same request.

**Acceptance loop for the item raised by consistency check Run 9, same request, 2026-10-10:** OI-50 (from CF-38) was presented alone. The policy took its Recommended Answer.

**Acceptance loop for the request "Apply the decisions waiting for application in the Refunds Portal BRD (TD-78, TD-79)", 2026-10-10:** The same answer policy applied (recorded above). The 13 items still Open were presented in 4 batches: OI-10, OI-11, OI-32, OI-33; OI-34, OI-35, OI-36, OI-39; OI-42, OI-43, OI-45, OI-46; OI-47. The policy took none of them, on the grounds recorded for the previous request (SKILL.md step 8, Answer policy, rule 3). Nothing they depend on has changed: store refund policy v3 is still not attached (TD-31), the consumer-law question (TD-19) and the data-protection law (TD-26) are still open, and no source gives the limits, roles, targets, periods, teams, readers or plans the other items need. The platform's standing answer for items the policy did not decide was "later", so all 13 stay Open for the next loop. The brand or key color was not asked, for the reason above.

**Acceptance loop for the request "Apply the decisions waiting for application in the Refunds Portal BRD (TD-81)", 2026-10-10:** The same answer policy applied (recorded above). The 13 items still Open were presented in 4 batches: OI-10, OI-11, OI-32, OI-33; OI-34, OI-35, OI-36, OI-39; OI-42, OI-43, OI-45, OI-46; OI-47. The policy took none of them, on the grounds recorded for the request that raised them (SKILL.md step 8, Answer policy, rule 3). Nothing they depend on has changed: store refund policy v3 is still not attached (TD-31), the consumer-law question (TD-19) and the data-protection law (TD-26) are still open, and no source gives the limits, roles, targets, periods, teams, readers or plans the other items need. Consistency check Runs 14 and 15 then reworded the undecided OI-32 (CF-55, CF-56, CF-59 to CF-61); the rewording keeps the limit and the role as owner values, so the grounds for leaving it Open are unchanged and it was not asked again in the same request. No new open item was raised. The platform's standing answer for items the policy did not decide was "later", so all 13 stay Open for the next loop. The brand or key color was not asked, for the reason above.

### Action entries

**Migration to the current template, 2026-10-10:** The Requirements Analyst agent (brd-unifier skill) moved BRD v1.0 from an older version of this template into the current one, as version 1.1. Source: `../source/brd-refunds-portal/`, kept as a read-only copy in [source-snapshot-v1.0/](./source-snapshot-v1.0/refunds-portal-brd-master.md). The v1.0 chunk 13 had no coverage record, so earlier review evidence covered none of the seven risk areas (scope, use-case exception coverage, matrix consistency, NFRs, integrations, security and privacy, data lifecycle). A full first review was run by a cleared-context reviewer; its coverage record is in [chunk 13](./13-open-items-and-clarifications.md#reviewer-notes). The v1.0 implementation plan and test cases were kept as reference files in [12 / Appendix](./12-appendix-and-wishlist.md#appendix), not as chunks 15 and 16. The v1.0 to-do evidence was checked again against the current rules in [chunk 14](./14-todo.md).

**Grill-me hand-back taken, 2026-10-10 (BRD v1.2):** Request: "update the todo: the grill-me session is done". The Requirements Analyst agent (brd-unifier skill) took the hand-back of the grill-me session of 2026-10-10 on BRD v1.1 ([../standins/refunds/grill-me-session.md](../standins/refunds/grill-me-session.md)). Stand-in: Product Owner (full-autonomous run policy, set by Mahmoud, 2026-10-08) confirmed on 2026-10-10 that the session took place and handed back its list. The session is not finished: 31 questions were asked in round 1, 12 wait for round 2, and the brand or key color was not asked. It returned no decision and left all 44 questions open. Questions Q1 to Q36 and Q44 already have to-do rows (TD-01 to TD-37). Its new questions N1, N2 and N3 need a business choice and became OI-29, OI-30 and OI-31 (decided and applied, Q-29 to Q-31). N4 and N5 ask again Scope proposals 1 and 2 of [chunk 13](./13-open-items-and-clarifications.md#scope-proposals); they stay scope proposals for the product owner. The stress tests Q37 to Q43 stay in to-do step 3 for the next session. First, the correction waiting for application, TD-40 (CF-19), was applied to 10 / NFR-04.

**Business review hand-off taken, 2026-10-10 (BRD v1.4):** Request: "update the todo: decisions from the business review of 2026-10-10 (W:\ITV\projects\hivantic\fixture-runs\fc-2026-10-10\run\review-comments-tracker.md)". The Requirements Analyst agent (brd-unifier skill) took the hand-off of the business review of 2026-10-10 on BRD v1.3. No earlier update had taken it. No item was Decided - pending application at the start. The review's decisions (its Changes Log row 1.3 and the Business review register above) were checked against the chunks, not applied again; consistency check Run 8 checked chunks 00-13 in full. Settled by the review and closed: TD-07 (point SME-05) and TD-10 (point PM-10), each with a Marker register entry. The open remainders of the review's records raised TD-44 to TD-68, and open items OI-32 to OI-47 for the business choices. The acceptance loop under the answer policy decided and applied OI-37, OI-38, OI-40, OI-41 and OI-44, and left 13 items Open ("later"). Runs 8, 9 and 10 raised OI-48 to OI-50 (decided and applied) and CF-23 to CF-43; CF-42 and CF-43, found by the third run, wait for the next request (TD-78, TD-79). New markers from applied decisions and splits raised TD-69 to TD-71 and TD-74 to TD-76. Version 1.4; chunks changed: 01, 02, 03, 04, 06a, 06b, 08, 10. Not signed: the request does not ask for sign-off. Chunks 15 to 17 do not exist and stay Locked.

**Decisions waiting for application applied, 2026-10-10 (BRD v1.5):** Request: "Apply the decisions waiting for application in the Refunds Portal BRD (TD-78, TD-79)". The Requirements Analyst agent (brd-unifier skill) first applied the two corrections that waited for application: TD-78 (CF-42, carries OI-50) to 06a / UC-03 BR-3 and AC-4 and 06b / UC-04 BR-9 and AC-17, with a Carried note on Q-50; TD-79 (CF-43) to the undecided OI-39 in chunk 13. Both were decided by the skill on 2026-10-10 as third-run corrections, so they have no Clarification register record of their own; their CF dispositions in chunk 14 are the record. The acceptance loop under the answer policy left all 13 open items Open ("later"; see the walkthrough above). Consistency check Runs 11 (full), 12 and 13 (scoped) found CF-44 to CF-53. CF-44 split the 11 / Language & Locale marker (new TD-80). CF-45 to CF-50 reworded undecided open items OI-32, OI-39, OI-45 and OI-47 so that applying them leaves no stale pointer. CF-51 and CF-53 corrected chunk 14. CF-52, found by the third run, waits for the next request (TD-81). The plain-language pass rewrote the new sentence in UC-03 BR-3 and UC-04 BR-9 with the system as actor. Version 1.5; chunks changed: 06a, 06b, 11. Not signed: the request does not ask for sign-off. Chunks 15 to 17 do not exist and stay Locked.

**Decision waiting for application applied, 2026-10-10 (BRD v1.5, no version bump):** Request: "Apply the decisions waiting for application in the Refunds Portal BRD (TD-81)". The Requirements Analyst agent (brd-unifier skill) first applied the correction that waited for application, TD-81 (CF-52), to the Recommended Answer of the undecided OI-32: the new UC-04 criterion now counts the approved amount. It was decided by the skill on 2026-10-10 as a third-run correction, so it has no Clarification register record; its CF disposition in chunk 14 is the record. The acceptance loop under the answer policy left all 13 open items Open ("later"; see the walkthrough above). Consistency check Runs 14 (full), 15 and 16 (scoped) found CF-54 to CF-62. CF-54 added a Carried note to Q-04 (the returns flow takes E4). CF-55, CF-56 and CF-59 to CF-61 reworded the undecided OI-32 so that applying it also covers NFR-01, 03 / Decision record and 03 / Refund request lifecycle, choosing no answer. CF-57 raised TD-82 (a fact: is 10 days the average or the longest wait today). CF-58 corrected chunk 14 step 3. CF-62, found by the third run, waits for the next request (TD-83). No change to chunks 00-12, and the chunk 13 changes only reword an undecided open item, so the version stays 1.5 with no new Changes Log row (delivery-chunks.md § Refresh triggers). Not signed: the request does not ask for sign-off. Chunks 15 to 17 do not exist and stay Locked.

<!-- MASTER: refunds-portal-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
