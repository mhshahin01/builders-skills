<!--
TYPE: Decision Log
PROJECT: Refunds Portal
VERSION: 1.7
PART OF: BRD - Refunds Portal
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Refunds Portal

## How to read

The numbered chunks hold the current settled requirements. This file holds why and how they were decided. Read the chunks for what the product must do; read this file for the decision history behind it.

## Clarification register

All 35 review items are decided: OI-01 in BRD v1.0 on 2026-09-21, OI-02 to OI-23 (reviewer pass), OI-24 to OI-27 (raised by consistency check Run 1), and OI-28 and OI-29 (raised by Run 2) on 2026-10-04, and OI-30 (raised by Run 4), OI-31 (raised by Run 9), OI-32 (raised by Run 13), OI-33 and OI-34 (raised by Run 16), and OI-35 (raised by Run 17, rejected) on 2026-10-05. Every record below names its options, the choice, who decided, and the rationale.

The to-do step 1 decisions of 2026-10-05 that settled no marker follow the review items: TD-04 and TD-05, TD-06, TD-07, TD-09 to TD-12, TD-17, then TD-13 from the second session of that day. The grill-me session of 2026-10-05 (to-do step 3) settled 15 more questions, recorded last as TD-26 to TD-40.

### OI-01 - Partial refunds as a separate use case

**Question:** Is a partial refund its own use case (UC-05 Issue Partial Refund), or a choice inside the refund decision (UC-04)?

**Decision record, 2026-09-21:** The recommendation was accepted in BRD v1.0: UC-05 was merged into UC-04 as alternate flow A1. BRD v1.0 does not record the options, who decided, or the rationale. The record was carried over when the BRD moved to the current template on 2026-10-04.

**Rule home:** [06b / UC-04 Alternate & Exception Flows](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### OI-02 - Objective 1 cannot be measured as written

**Question:** Is 10 days today's average or longest wait, where does the measured time end, and what shows it?

**Options:** A. 10 days is the average; time runs from Submitted to Paid; the branch report shows it. B. 10 days is the longest wait; no refund may take more than 3 days. C. As A, plus a report across all branches.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: Objective 1 is the measurable target and says "average", so the Background follows it, and Paid is the last event the portal can see.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives); [03 / Refund request lifecycle](./03-definitions-and-domain-concepts.md#refund-request-lifecycle); [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

### OI-03 - In Scope misses tracking, cancelling, and the branch report

**Question:** Does In Scope list every capability the use cases and the report deliver?

**Options:** A. Add the three missing lines. B. Keep In Scope as a short summary.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: every In Scope line maps to a use case or a section, so a missing line reads as out of scope.

**Rule home:** [04 / In Scope](./04-scope-and-personas.md#in-scope)

### OI-04 - Return of the items is not defined

**Question:** Must the customer bring the items back before a refund is approved?

**Options:** A. Yes, items back in the branch before approval. B. No return. C. Return only for some reasons or amounts, per Store refund policy v3.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: without the goods the branch manager has nothing to check; a request whose items never come back is rejected with a reason (UC-04 A2). Tradeoff accepted: a branch visit inside the 3-day target.

**Rule home:** [04 / In Scope](./04-scope-and-personas.md#in-scope); [06a / UC-01 Main Flow](./06a-use-cases-customer.md#uc-01-request-a-refund); [06b / UC-04 Business Rules](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### OI-05 - Customer identity and contact details are not defined

**Question:** How does the portal know who the customer is, and where do the email address and mobile number come from?

**Options:** A. Sign-up and sign-in with a confirmed email address and mobile number (new UC-06). B. No account; contact details typed with each request.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: UC-02 lists all of a customer's requests, which needs one identity, and the messages need confirmed addresses. The answer did not give the UC-06 detail, so the details it does not state (password, confirmation codes, wrong code handling, one account per email address) were written as proposals for the product manager to confirm.

**Rule home:** [06a / UC-06 Sign Up and Sign In](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in); [04 / In Scope](./04-scope-and-personas.md#in-scope); [07 / Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix)

### OI-06 - Mobile app scope is unclear

**Question:** Is a mobile app part of this release?

**Options:** A. No app; one portal on any device; UC-02 renamed; the app idea goes to the Wishlist. B. An app for all customer use cases. C. An app for tracking only.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: 04 and 11 describe one product for all screen sizes, and no use case defines app-only behaviour. UC-02 was renamed from "Track Refund Status (Web and Mobile)" to "Track Refund Status"; the ID stays UC-02.

**Rule home:** [04 / In Scope](./04-scope-and-personas.md#in-scope); [06a / UC-02](./06a-use-cases-customer.md#uc-02-track-refund-status); [12 / Wishlist](./12-appendix-and-wishlist.md#wishlist)

### OI-07 - Refunds given at the branch are invisible to the portal

**Question:** How does the portal avoid refunding an item that was already refunded at a branch, and the reverse?

**Options:** A. In-person refunds stay outside the portal; the portal and Point-of-Sale Records share refunded items both ways. B. Every refund goes through the portal from go-live.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: branches handle refunds today and UC-01 E1 keeps a branch route, so a two-way exchange keeps NFR-01's zero duplicates.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope); [08 / Integrations](./08-integrations.md#integrations)

### OI-08 - A receipt number alone shows the purchase

**Question:** What must the customer enter before the portal shows the items on a receipt?

**Options:** A. Receipt number plus the receipt total. B. Receipt number only.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: a second detail printed on the receipt blocks guessing without asking for card data (NFR-04).

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund)

### OI-09 - Purchases not paid in full by card

**Question:** What happens to a receipt paid in cash, or partly by card?

**Options:** A. No card payment: refused at step 2 with a branch route; mixed payment: at most the card share. B. Accept cash purchases and settle them at the branch.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: Constraint 2 and the cash line in Out of Scope already rule out cash payouts, so the customer is told at step 2.

**Rule home:** [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund); [08 / Integrations](./08-integrations.md#integrations)

### OI-10 - How the refund amount is worked out

**Question:** What is an item, and how is its refund amount set when a receipt has several units or a discount?

**Options:** A. An item is one unit, refunded at the price paid after its share of any receipt discount. B. An item is one receipt line, refunded whole.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: the payout goes back to the card that paid, so each refund matches what the customer paid.

**Rule home:** [02 / Glossary](./02-glossary-assumptions-facts.md#glossary); [06a / UC-01 Business Rules](./06a-use-cases-customer.md#uc-01-request-a-refund)

### OI-11 - Repeat requests for the same items

**Question:** Can an item be requested again while it sits in another request?

**Options:** A. Items in Submitted, Approved, Paid, Rejected, or Payout failed requests are blocked; items in Cancelled requests are free again. B. As A, but a rejected item can be asked for once more.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. The answer named Payout failed only if OI-17 was accepted; OI-17 was accepted, so the rule lists it. Rationale: blocking items while a request is open is the only way to meet NFR-01's zero duplicate payouts.

**Rule home:** [06a / UC-01 Business Rules](./06a-use-cases-customer.md#uc-01-request-a-refund)

### OI-12 - Refund window boundary

**Question:** Is day 30 accepted, how are days counted, and is the window checked again at submission?

**Options:** A. Day 30 is the last day, calendar days from the day after purchase, checked again at submission. B. 30 times 24 hours from the time of purchase.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: it matches how a customer counts from a dated receipt, and the second check closes the gap between steps 2 and 5.

**Rule home:** [06a / UC-01 Business Rules](./06a-use-cases-customer.md#uc-01-request-a-refund)

### OI-13 - Preconditions assume away UC-01 E1 and UC-02 A1

**Question:** Should the preconditions repeat checks the flows make?

**Options:** A. Replace both preconditions with what the actor knows before step 1. B. Remove UC-01 E1 and UC-02 A1.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. With OI-05 accepted, the UC-01 to UC-03 preconditions also require a signed-in customer. Rationale: the window is checked inside the flow, and E1 keeps the customer's route to the branch.

**Rule home:** [06a / UC-01 Preconditions](./06a-use-cases-customer.md#uc-01-request-a-refund); [06a / UC-02 Preconditions](./06a-use-cases-customer.md#uc-02-track-refund-status)

### OI-14 - Point-of-Sale Records cannot be reached

**Question:** What does the customer see when receipts cannot be checked?

**Options:** A. Tell the customer to try again later. B. Accept the request and check it later.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: the step 2 checks stay in place, and the customer is never told a real receipt is not found.

**Rule home:** [06a / UC-01 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-01-request-a-refund)

### OI-15 - Cancel and decision at the same moment

**Question:** What happens when a customer cancels while the branch manager decides?

**Options:** A. Check the status again when each actor confirms; the first confirmed action wins. B. Block cancelling while a manager has the request open.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: no money moves for a cancelled request, and no customer is blocked only because a manager is looking.

**Rule home:** [06a / UC-03 E2](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request); [06b / UC-04 E2](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### OI-16 - The customer is not told why a refund was lowered

**Question:** How does the customer learn the amount and reason of a partial approval, and how is a rejection sent?

**Options:** A. Reason shown in UC-02 and in the Paid message; rejections by email and SMS. B. An extra message at approval.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: the payout is sent at approval, so the Paid message arrives about as soon as an approval message would.

**Rule home:** [06b / UC-04 Main Flow](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); [06a / UC-02 Main Flow](./06a-use-cases-customer.md#uc-02-track-refund-status)

### OI-17 - A payout that keeps failing has no end

**Question:** What happens when a payout can never succeed?

**Options:** A. New end status Payout failed after one day; customer and branch manager told; the branch settles outside the portal. B. Keep trying and tell the customer of a delay. C. Close as Payout failed and send the customer to their bank.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: it is the only option where every approved refund ends with the customer paid (NFR-01). Tradeoff accepted: a few refunds handled by hand, as one exception to Constraint 2.

**Rule home:** [06b / UC-04 E1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); [03 / Refund request lifecycle](./03-definitions-and-domain-concepts.md#refund-request-lifecycle); [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)

### OI-18 - Decisions can wait without limit

**Question:** What keeps requests from waiting, including when a branch manager is away?

**Options:** A. A daily message about waiting requests plus a cover branch manager. B. The daily message only. C. A decision deadline with escalation to head office.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: about 30 requests a branch a month makes one daily message enough, and a cover keeps decisions inside the Branch Manager persona.

**Rule home:** [06b / UC-04 Business Rules](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); [07 / Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix); [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)

### OI-19 - Two partners missing from Supporting Actors and Dependencies

**Question:** Should Point-of-Sale Records and the Notification Partner appear as Supporting Actors and Dependencies?

**Options:** A. Add both to the use cases that use them and to Dependencies. B. Supporting Actors only.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: 08 rates one partner Critical and the other Important, so one dependency is Hard and the other Soft.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies); [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund); [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### OI-20 - No performance expectation

**Question:** How fast must everyday actions be, so that NFR-03 can be tested?

**Options:** A. NFR-05 at 3 seconds (a proposed value, not from the source). B. NFR-05 with the measure left open.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager, who confirmed the proposed 3 seconds. Rationale: NFR-03 needs a normal speed to compare against.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-21 - No accessibility expectation

**Question:** Must people with disabilities be able to use the portal, and to what standard?

**Options:** A. NFR-06 against WCAG 2.1 level AA. B. No accessibility requirement in this release.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale as given: WCAG 2.1 AA is the level in the project owner's UI/UX standards and the usual test for public services. The project holds no UI/UX standards file, so the standing evidence is the usual test for public services.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-22 - No rule for keeping or deleting refund records

**Question:** What record of each request is kept, for how long, and when are contact details removed?

**Options:** A. Keep the full decision record for the finance retention period, then remove contact details. B. Keep everything with no limit.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. The number of years is a fact for the finance or legal owner, so it stays a marked question in the rule.

**Rule home:** [03 / Refund records](./03-definitions-and-domain-concepts.md#refund-records)

### OI-23 - Refund window and seasonal peak stated in more than one place

**Question:** Where does each number live, and what links to it?

**Options:** A. One home each: the window in UC-01 Business Rules, the peak in 02 Facts. B. Keep the copies.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: a rule's home is the use case that enforces it, and a fact's home is Facts.

**Rule home:** [06a / UC-01 Business Rules](./06a-use-cases-customer.md#uc-01-request-a-refund); [02 / Facts](./02-glossary-assumptions-facts.md#facts)

### OI-24 - The Notification Partner now gates every customer

**Question:** How is the Notification Partner rated, now that sign-up needs it? (Raised by consistency check CF-04.)

**Options:** A. Hard and Critical, needed before Build of UC-06. B. Keep Soft and Important, and add a UC-06 exception for a code that cannot be sent.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: after OI-05 no customer use case starts without this partner, and a Critical partner is a Hard dependency (OI-19). This supersedes the Soft and Important rating of the Notification Partner that the OI-19 record names.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies); [08 / Integrations](./08-integrations.md#integrations)

### OI-25 - Removing contact details would break the customer account

**Question:** What happens to the customer's contact details when a request's keeping period ends, now that they belong to the account? (Raised by consistency check CF-05.)

**Options:** A. Unlink the request from the account; the account keeps its details. B. Also remove the details from the account unless the customer has a newer request.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: unlinking stops old requests carrying personal data without breaking sign-in. Open remainder: how long an unused account is kept. This supersedes the removal of the customer's contact details at the end of the keeping period in OI-22.

**Rule home:** [03 / Refund records](./03-definitions-and-domain-concepts.md#refund-records)

### OI-26 - Nothing tells the Point-of-Sale Records about portal requests

**Question:** When does the portal tell the Point-of-Sale Records about items in a portal request? (Raised by consistency check CF-06.)

**Options:** A. At Submitted, and free the items when the request ends without a payout. B. Only at Paid.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: the till gets the same block as the portal from Submitted on, which OI-07 chose for NFR-01's zero duplicate payouts. This supersedes what the portal sends under OI-07: it now sends the items in each request and the items freed again, not the items refunded through the portal.

**Rule home:** [06a / UC-01 Main Flow](./06a-use-cases-customer.md#uc-01-request-a-refund); [06a / UC-03 Main Flow](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request); [06b / UC-04 Alternate & Exception Flows](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); [08 / Integrations](./08-integrations.md#integrations)

### OI-27 - Alternate and exception flows without acceptance criteria

**Question:** Does every alternate and exception flow get an acceptance criterion? (Raised by consistency check CF-10.)

**Options:** A. One criterion per flow (nine more). B. Criteria only for UC-04 A2, UC-03 E2 and UC-04 E2.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: every documented branch can then be traced and tested.

**Rule home:** [06a / UC-01 Acceptance Criteria](./06a-use-cases-customer.md#uc-01-request-a-refund); [06a / UC-02 Acceptance Criteria](./06a-use-cases-customer.md#uc-02-track-refund-status); [06a / UC-03 Acceptance Criteria](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request); [06b / UC-04 Acceptance Criteria](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### OI-28 - Covers do not get the covered branch's messages

**Question:** Does a cover get the covered branch's daily message and Payout failed messages? (Raised by consistency check CF-13.)

**Options:** A. Yes, while the cover is named. B. No, only the branch's own manager.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. Rationale: the daily message and the cover were added together so that decisions do not wait (Objective 1).

**Rule home:** [06b / UC-04 Business Rules](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### OI-29 - No keeping period for account contact details

**Question:** How long does an account keep the customer's contact details? (Raised by consistency check CF-14.)

**Options:** A. Close an account after a period with no sign-in and no linked request, and remove its details; the legal owner sets the period. B. Keep the details until the customer asks for deletion.

**Decision record, 2026-10-04:** Option A, the recommendation, accepted by the product manager. The period is a number for the legal owner, so it stays a marked question in the rule (TD-24). This closes the open remainder of OI-25.

**Rule home:** [03 / Refund records](./03-definitions-and-domain-concepts.md#refund-records)

### OI-30 - The 24-hour payout limit is stated in two homes

**Question:** Where does the time limit for a failing payout live? (Raised by consistency check CF-26.)

**Options:** A. Only in UC-04 E1, with 03 and Figure 1 pointing to it. B. In both 03 and UC-04 E1.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: a number lives in the use case that enforces it (OI-23); acceptance criteria keep their copies.

**Rule home:** [06b / UC-04 E1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); [03 / Refund request lifecycle](./03-definitions-and-domain-concepts.md#refund-request-lifecycle)

### OI-31 - Sign-up has no flow for codes that cannot be sent

**Question:** What does the customer see when confirmation codes cannot be sent, and does that outage count toward NFR-02? (Raised by consistency check CF-39.)

**Options:** A. Add UC-06 E3 with its own criterion, and name it in NFR-02. B. Keep the text as written. C. Make NFR-02 leave out every partner outage.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager in the acceptance loop of the grill-me session's update. Rationale: sign-up is the one flow a partner outage stops with no message, and TD-30 leaves out only outages the portal handles with its own message.

**Rule home:** [06a / UC-06 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in); [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### OI-32 - Sign-up does not say what happens when the customer turns down an offer

**Question:** What happens when the customer turns down the offer in UC-06 E1 (a new code) or E2 (sign in instead)? (Raised by consistency check CF-47, while the step 5 flowchart of UC-06 was drawn.)

**Options:** A. The customer corrects and goes on (enter the code again at step 5; enter another email address at step 3). B. Turning down the offer ends the sign-up. C. E2 as in A, E1 as in B.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager in the acceptance loop of the step 5 update. Until the answer was applied, Figure 7 was Provisional (TD-42). Rationale: the customer finishes without starting over, as TD-33 chose for the taken offers. The change to UC-06 reopens its mockup row MK-04 at to-do step 4, because the approval of 2026-10-05 came before it.

**Rule home:** [06a / UC-06 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

### OI-33 - Sign-in has no failure path and no way back for a forgotten password

**Question:** What happens when a sign-in fails, and how does a customer who has forgotten the password get back in? (Raised by consistency check CF-54.)

**Options:** A. Add UC-06 A3 (forgotten password, with a code sent to the account's email address) and E4 (sign-in fails), each with a criterion. B. Add E4 only, and put resetting a forgotten password out of scope. C. Leave both to the security design in the SDD.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager in the acceptance loop of the consistency check session (Run 16). Rationale: A1 is the only way back in for a returning customer, and BR-2 with E2 blocks a new account on the same email address; A reuses the confirmation codes, E1, E3, and the Notification Partner. Test fixture: at that point the test brief set the product manager to accept every recommendation. The change to UC-06 reopens its mockup row MK-04 (to-do step 4) and its flowchart, Figure 7 (to-do step 5).

**Rule home:** [06a / UC-06 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in); [08 / Integrations](./08-integrations.md#integrations); [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### OI-34 - A receipt with nothing left to refund has no outcome

**Question:** What does the customer see when every item on the receipt is already refunded or in another request that is not Cancelled? (Raised by consistency check CF-55.)

**Options:** A. Add UC-01 E5 "Nothing left to refund", with a criterion. B. Add one sentence to A1. C. Keep the text as written.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager in the same acceptance loop. Rationale: the rejoin that A1 states does not exist for a fully blocked receipt, and 11 / Error Messages asks for a message; E5 follows the E1 and E3 pattern. Test fixture: as for OI-33. The change to UC-01 reopens its mockup row MK-01 (to-do step 4) and its flowchart, Figure 4 (to-do step 5).

**Rule home:** [06a / UC-01 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-01-request-a-refund); [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### OI-35 - A3 does not say what happens when no account has the email address

**Question:** What does the customer see in UC-06 A3 when no account has the email address they gave? (Raised by consistency check CF-61.)

**Options:** A. Add UC-06 E5: tell the customer no account has this email address, and let them try another address or sign up. B. Add E5 with the same message whether or not an account exists. C. Leave it to the security design in the SDD.

**Decision record, 2026-10-05:** Rejected by the product manager: out of scope for this release (test-fixture policy). Every option that closes the gap adds a flow (UC-06 E5), so the PM policy for new items (see the action entry of 2026-10-05) applies. Nothing is applied: UC-06, Figure 7, and MK-04 stay as they are, and the item is recorded only here and in chunk 13.

**Rule home:** [06a / UC-06 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) (unchanged)

### TD-04 and TD-05 - Point-of-Sale Records and Notification Partner dependencies

**Question:** Are these dependencies confirmed, or are their owners and Needed before confirmed while they stay to be verified?

**Options:** A. Keep them to be verified; confirm the owners and Needed before. B. Mark them confirmed (needs the partners' word).

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager at to-do step 1: Retail IT team, Build of UC-01; MsgHub, Build of UC-06. Rationale: a pending dependency is settled for the BRD once its owner and Needed before are confirmed.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### TD-06 - Receipt number assumption

**Question:** Does every branch purchase have a receipt number the customer can enter?

**Options:** A. Confirm the assumption. B. Add a route for purchases without one.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: a branch sale is identified by its receipt; UC-01 requires the receipt, and E2 and E4 cover a number that cannot be found or checked.

**Rule home:** [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)

### TD-07 - Branch manager access, contact details, and sign-in

**Question:** Are branch managers, their branches, covers, and contact details set up outside the portal, and do branch managers sign in with that access? (Includes CF-08 and CF-15.)

**Options:** A. Confirm, and add a signed-in precondition to UC-04. B. Add a use case to manage branch managers in the portal.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: it keeps the portal's scope to refunds, and UC-04 BR-1 and NFR-04 can then be tested.

**Rule home:** [02 / Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints); [06b / UC-04 Preconditions](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-09 - "After one day" for a failing payout

**Question:** Does "after one day" mean 24 hours or one working day?

**Options:** A. 24 hours. B. One working day.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: payouts can fail on any day; 24 hours treats every day the same, is easy to test, and does not hold a Friday failure until Monday against Objective 1.

**Rule home:** [06b / UC-04 E1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-10 - Cancellation message channel

**Question:** Is the cancellation message sent by email only on purpose?

**Options:** A. Email and SMS, like the other customer messages. B. Email only.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: In Scope sends customer messages by email and SMS, and no reason for an exception is recorded.

**Rule home:** [06a / UC-03 Main Flow](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request)

### TD-11 - Payout failed requests for the branch manager

**Question:** Can the branch manager open the branch's Payout failed requests?

**Options:** A. Yes, to settle them at the branch, with no decision in the portal. B. No; the branch settles from the message alone.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: the branch needs the request details to settle the refund (UC-04 E1).

**Rule home:** [06b / UC-04 Business Rules](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-12 - Customer care view

**Question:** Do customer care staff need a view of refund requests in this release?

**Options:** A. No; add it to the Wishlist. B. Yes; add a persona and a use case.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: UC-02 gives the customer the same view, and NFR-04 limits who can see a request.

**Rule home:** [12 / Wishlist](./12-appendix-and-wishlist.md#wishlist)

### TD-17 - Online-shop refunds on the Wishlist

**Question:** Does the Wishlist item mean replacing the separate system that handles online-shop refunds?

**Options:** A. Yes, refunds for online-shop purchases in the portal would replace it. B. No, the separate system stays.

**Decision record, 2026-10-05:** Option A, the recommendation, accepted by the product manager. Rationale: a Wishlist item that adds these refunds to the portal only makes sense if it takes them over.

**Rule home:** [12 / Wishlist](./12-appendix-and-wishlist.md#wishlist)

### TD-13 - Consumer-law refund rights beyond the refund window

**Question:** Does the law of the branch's country give refund rights beyond the store's 30-day window that the portal must support? (From 13 / Reviewer Notes, consumer law.)

**Options:** A. No right the portal must support: the 30-day window stays, and claims under consumer law after it are handled in person at the branch. B. The portal also takes consumer-law claims after the window (new flows and rules).

**Decision record, 2026-10-05:** Option A. The product manager gave the answer as a test-fixture value, not a confirmed legal opinion: the consumer law of the branch's country gives no refund right that the portal must support beyond the 30-day window, and claims such as those for faulty goods after the window are handled in person at the branch. No new scope: UC-01 E1 already sends the customer to the branch, and 04 Out of Scope now names these claims. Rationale: it keeps one window in the portal and keeps the branch route that UC-01 E1 gives.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### TD-26 - Objective 1 and the trip back to the branch (grill-me Q1)

**Question:** Does the 3-day average of Objective 1 (Submitted to Paid) include the customer's trip to bring the items back, which UC-04 BR-4 requires before approval?

**Options:** A. Yes; say so in Objective 1. B. Measure from the return of the items to Paid (needs a step that records the return). C. Keep both and add a time limit for the return (a new rule and a new rejection path).

**Decision record, 2026-10-05:** Option A, the interviewer's recommended answer, accepted by the product manager. Rationale: the customer waits for the whole time, the branch report (09) measures Submitted to Paid, and B or C would add a step or a rule the BRD does not have. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### TD-27 - What records that the items are back (grill-me Q2)

**Question:** How does the portal know the items are back before the branch manager approves (UC-04 BR-4)?

**Options:** A. The approval itself confirms it; no separate step. B. A new step where the branch manager marks the items as received (a new step and status).

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: it adds no step or status, and the branch manager is the person who checks the items (05 / Branch Manager Journey). Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06b / UC-04 Business Rules](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-28 - Refund window counting (grill-me Q3)

**Question:** Do UC-01 BR-1, BR-7, AC-2, AC-3, and AC-8 settle the refund window fully, or does any reason get a different window?

**Options:** A. Confirm as written: one 30-day window for every reason; consumer-law claims after it go to the branch (TD-13). B. Different windows per reason (new rules).

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager: confirmed as written, no change. Rationale: BR-7 already fixes day 1, day 30, calendar days, the branch's date, and the second check at submission. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06a / UC-01 Business Rules](./06a-use-cases-customer.md#uc-01-request-a-refund)

### TD-29 - Partial amount limits (grill-me Q4)

**Question:** Are the limits of a partial amount in UC-04 BR-2 (more than 0 and less than the requested amount) complete?

**Options:** A. Confirm as written: amounts are in euro with cents, so a partial amount runs from 0.01 EUR to 0.01 EUR below the requested amount, and the requested amount is already at most the card share (UC-01 BR-4). B. Add a minimum partial amount (a number no source gives).

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager: confirmed as written, no change. Rationale: the two limits are testable as written, and B would need a number nobody has given. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06b / UC-04 Business Rules](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-30 - What counts as disruption (grill-me Q5)

**Question:** Does planned maintenance count toward the 2 hours a month of NFR-02, and does a partner outage count?

**Options:** A. Every disruption of the portal counts, planned or not; a partner outage that the portal handles with its own message (UC-01 E4, UC-04 E1) does not. B. Only unplanned disruption counts. C. Partner outages count too.

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: "at any time" means planned breaks count too, and the business cannot hold the portal to partners it does not run; E4 and E1 already tell the user what happens. OI-31 (2026-10-05) later added UC-06 E3 to the list in NFR-02. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### TD-31 - Speed and accessibility measures (grill-me Q6)

**Question:** Should NFR-05 allow a share of slower actions, and does NFR-06 cover the email and SMS messages?

**Options:** A. Confirm as written: every everyday action within 3 seconds, at normal load and at the seasonal peak (NFR-03), and NFR-06 covers every screen. B. Allow a share of slower actions. C. Extend NFR-06 to the messages.

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager: confirmed as written, no change. Rationale: the measure is the business promise and the SDD sets the technical targets behind it; messages are not screens. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)

### TD-32 - Where UC-01 A1 goes on (grill-me Q7)

**Question:** After A1 shows items that cannot be selected, what happens next?

**Options:** A. The customer goes on to step 3 with the other items. B. The request stops.

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: A1 only limits which items can be chosen; the other items can still be refunded. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06a / UC-01 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-01-request-a-refund)

### TD-33 - Where UC-06 E1 and E2 lead (grill-me Q8)

**Question:** What happens after E1 offers a new code, and after E2 offers to sign in?

**Options:** A. E1: on request, the system sends a new code to that address and the customer goes back to step 5; E2: if the customer accepts, they sign in as in A1. B. Both end the sign-up, and the customer starts again.

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: the customer finishes without starting over, and both paths reuse steps the use case already has. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06a / UC-06 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

### TD-34 - A later payout try that succeeds (grill-me Q9)

**Question:** UC-04 E1 keeps trying a refused payout for 24 hours. What happens when a later try succeeds?

**Options:** A. The flow goes on at step 7: the request becomes Paid and the customer is told. B. The branch manager confirms first (a new step).

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: the approval is already given, and step 7 is the documented outcome of a payout that succeeds. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06b / UC-04 Alternate & Exception Flows](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-35 - How long a confirmation code works (grill-me Q10)

**Question:** UC-06 E1 handles an expired code, but no rule says when a code expires. How long does a code work?

**Options:** A. 15 minutes after it is sent. B. 24 hours. C. No expiry, so the "expired" case of E1 could never happen.

**Decision record, 2026-10-05:** Option A, the interviewer's recommended value, accepted by the product manager; it is a test-fixture value like every answer in this session. Rationale: short enough that a code in an old message stops working, long enough to read an email or an SMS; E1 offers a new code. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06a / UC-06 Business Rules](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

### TD-36 - The daily message on a day with nothing waiting (grill-me Q11)

**Question:** UC-04 BR-5 sends a daily message about waiting requests. Is it sent on a day with none?

**Options:** A. No message on a day with no waiting request. B. A message every day, saying none are waiting.

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: the message exists to stop requests waiting (OI-18), and a message about nothing adds noise. A cover gets the same message (UC-04 BR-6). Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06b / UC-04 Business Rules](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-37 - Which requests the branch report counts (grill-me Q12)

**Question:** 09 shows requests per status, amounts paid, and two average times for the branch, daily. Which requests count, and up to when?

**Options:** A. All of the branch's requests, up to the end of the previous day. B. A period the branch manager chooses (needs a filter, which 11 rules out). C. The current month only (a period no source gives).

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: it matches "Daily" and "no filters" (11), and the amounts and dates of old requests stay for reporting (03 / Refund records). Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

### TD-38 - Items that come back incomplete or damaged (grill-me Q13)

**Question:** With the approval as the only record of the return (TD-27), what does the branch manager do when only some items come back, or an item comes back damaged?

**Options:** A. As written: a partial approval with a reason (UC-04 A1) or a rejection with a reason (UC-04 A2). B. A new "items incomplete" status (new scope).

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager: confirmed as written, no change. Rationale: A1 and A2 already give the branch manager both outcomes, each with a reason the customer sees. Consistency check Run 9 (CF-38) then carried this decision into UC-04 BR-4, which read as if no approval could be given before every item was back. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06b / UC-04 Business Rules and Alternate & Exception Flows](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

### TD-39 - A reminder to bring the items (grill-me Q14)

**Question:** Since the 3 days of Objective 1 include the return trip (TD-26), should the portal remind a customer who has not brought the items?

**Options:** A. No reminder in this release: UC-01 step 6 tells the customer to bring the items, and the daily message (UC-04 BR-5) shows the branch manager how long requests wait. B. A reminder after a set number of days (a new message and a new number).

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager: confirmed as written, no change. Rationale: B adds scope, and the product manager asked for none. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06a / UC-01 Main Flow](./06a-use-cases-customer.md#uc-01-request-a-refund)

### TD-40 - The earlier code after a new one is sent (grill-me Q15)

**Question:** When the customer asks for a new code (TD-33), does the earlier code still work for the rest of its 15 minutes (TD-35)?

**Options:** A. Only the latest code sent to an address works. B. Every code works until it expires.

**Decision record, 2026-10-05:** Option A, the recommended answer, accepted by the product manager. Rationale: one working code per address is simpler for the customer and harder to misuse. Test fixture: the session ran non-interactively, and the product manager accepted every recommended answer.

**Rule home:** [06a / UC-06 Business Rules](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

## Marker register

Ten inline markers were settled on 2026-10-05, at to-do step 1: the product manager confirmed every proposal. Each could instead have been replaced with another answer. Three more markers (TD-02, TD-24, TD-14) were settled later on 2026-10-05, in a second session, with values the product manager gave as test-fixture values.

### 02 / Payment Provider dependency, Needed before (TD-03)

**Resolution (2026-10-05):** The product manager confirmed the proposed Build of UC-04 and the owner, the Payment Provider (CardPay Ltd). The dependency stays to be verified. Rationale: UC-04 step 6 sends the first payout.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### 03 / Refund records, keeping period of a request (TD-02)

**Resolution (2026-10-05):** The product manager gave 7 years after the request's last status change, as a test-fixture value, not a confirmed finance record rule. The marker was replaced with the number.

**Rule home:** [03 / Refund records](./03-definitions-and-domain-concepts.md#refund-records)

### 03 / Refund records, closing an unused account (TD-24)

**Resolution (2026-10-05):** The product manager gave 2 years with no sign-in and no linked request, as a test-fixture value, not a period set by the legal owner. The marker was replaced with the number.

**Rule home:** [03 / Refund records](./03-definitions-and-domain-concepts.md#refund-records)

### 04 / Cash refunds reason (TD-16)

**Resolution (2026-10-05):** The product manager confirmed the proposed reason: payouts go only to the card used for the purchase. Rationale: it is the stated constraint 2.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### 06a / UC-06 password for sign-in (TD-01)

**Resolution (2026-10-05):** The product manager confirmed that the customer chooses a password at sign-up and uses it to sign in. Rationale: it is the simplest sign-in a customer can see and a tester can check.

**Rule home:** [06a / UC-06 Main Flow](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

### 06a / UC-06 confirmation codes (TD-01)

**Resolution (2026-10-05):** The product manager confirmed a confirmation code sent to each address. Rationale: it meets the rule that both addresses are confirmed (OI-05) with a step the customer can see.

**Rule home:** [06a / UC-06 Main Flow](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

### 06a / UC-06 wrong or expired code (TD-01)

**Resolution (2026-10-05):** The product manager confirmed that the system offers a new code for a wrong or expired one. Rationale: the customer can finish sign-up without help.

**Rule home:** [06a / UC-06 Alternate & Exception Flows](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

### 06a / UC-06 one account per email address (TD-01)

**Resolution (2026-10-05):** The product manager confirmed one account per email address, with UC-06 E2 as its flow. Rationale: it keeps "own requests only" (07 footnote 2) enforceable.

**Rule home:** [06a / UC-06 Business Rules](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

### 09 / Branch refund report format (TD-08)

**Resolution (2026-10-05):** The product manager confirmed an on-screen table with export to CSV and Excel. CSV was added to the Glossary.

**Rule home:** [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)

### 11 / Primary Color (TD-14)

**Resolution (2026-10-05):** The product manager gave the primary color #1F6FEB, as a test-fixture value, not a confirmed brand color. The project has no UI/UX constitution, so chunk 11 states the value. White text on this color has a contrast of about 4.6:1, above the 4.5:1 that NFR-06 (WCAG 2.1 AA) needs for normal text.

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### 11 / Data Tables (TD-15)

**Resolution (2026-10-05):** The product manager confirmed sortable lists with 20 rows per page by default. The report export is stated once, in 09, and 11 links to it.

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### 11 / Filtration (TD-15)

**Resolution (2026-10-05):** The product manager confirmed no filters in this release. The request volume is linked to 02 Facts instead of repeated.

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

### 11 / Language & Locale (TD-15)

**Resolution (2026-10-05):** The product manager confirmed English only, amounts in euro with the code EUR, and dates and numbers in the format of the branch's country.

**Rule home:** [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)

## Business review register

No business review has changed this BRD.

## Walkthrough and delegation history

### Action entries

**Migration to the current template, 2026-10-04:** BRD v1.0 ([source](../source/brd-refunds-portal/refunds-portal-brd-master.md), older template) moved to the current template as v1.1, in one run (chunks, whole). Chunks 00-13 written; the v1.0 implementation plan and test cases kept in 12 / Appendix as reference files; the v1.0 to-do replaced by a new chunk 14.

**Review and acceptance loop, 2026-10-04:** The independent reviewer raised OI-02 to OI-23. The product manager accepted every recommendation, in one batch, with no adjustment and no deferral. The editorial Reviewer Notes were applied as plain-language edits (05 journeys, 06b / UC-04 UI/UX, 11 Summary).

**Consistency check Run 1, 2026-10-04:** 12 findings. Two mechanical corrections (CF-09, CF-12) and five corrections that carry applied decisions (CF-01, CF-02, CF-03, CF-07, CF-11) were applied. Four business ambiguities became OI-24 to OI-27; the product manager accepted every recommendation, and they were applied. One missing fact (CF-08) extends TD-07.

**Consistency check Run 2 (scoped), 2026-10-04:** 6 findings. Two corrections carry applied decisions (CF-16, CF-17) and one is mechanical (CF-18). Two business ambiguities became OI-28 and OI-29; the product manager accepted both recommendations, and they were applied. One missing fact (CF-15) extends TD-07.

**Consistency check Run 3 (scoped), 2026-10-04:** 4 findings, each carrying an applied decision (CF-19 OI-11, CF-20 OI-12, CF-21 OI-26) or mechanical (CF-22); all corrected. This was the third run of the session, so the recheck waits for the next session.

**Handoff, 2026-10-04:** v1.1 delivered with chunks 00-14 and this register. The delivery gate is shut; chunks 15-17 are Locked.

**To-do step 1, 2026-10-05:** The product manager asked for the to-do steps that need no outside input (steps 1 and 2) and accepted every recommendation. 14 register rows were decided and applied (v1.2). TD-02, TD-13, TD-14, and TD-24 need an answer from outside (finance or legal owner, brand owner) and stay open.

**Consistency check Run 4 (full), 2026-10-05:** 7 findings. Five corrections carry applied decisions (CF-23 TD-11, CF-24 OI-18 and OI-28, CF-25 TD-07, CF-27 OI-27, CF-28 TD-07) and one is mechanical (CF-29). One business ambiguity became OI-30; the product manager accepted the recommendation, and it was applied.

**Consistency check Run 5 (scoped), 2026-10-05:** 2 findings, both outside chunks 00-13: CF-30 (chunk 14 evidence, mechanical) and CF-31 (this register's TD-09 Rule home, carries OI-30); both corrected. To-do step 2 is complete: Run 5 is dated after the last change to chunks 00-13, and every finding has a disposition.

**Consistency check Run 6 (scoped), 2026-10-05:** 4 findings, all in chunk 14 (CF-32 to CF-35), corrected. The session's three runs are used; step 2 stays complete because nothing in chunks 00-13 changed.

**Handoff, 2026-10-05:** v1.2 delivered. To-do step 2 is complete; step 1 waits for four outside answers (TD-02, TD-13, TD-14, TD-24). The delivery gate is shut; chunks 15-17 are Locked.

**To-do step 1 finished, 2026-10-05 (second session):** The product manager asked to finish step 1 and gave the four outside answers as test-fixture values: TD-02 (7 years), TD-24 (2 years), TD-13 (consumer-law claims after the window go to the branch), and TD-14 (#1F6FEB). All four were applied (v1.3); no new scope. Every to-do row is Resolved, no review item is open, and no clarification marker is left in chunks 00-12.

**Consistency check Run 7 (full), 2026-10-05:** The first run of this session, after the step 1 decisions. 2 findings: CF-36 (chunk 14's step 2 record, mechanical) and CF-37 (UC-01 step 2 hid the items A1 shows, carries OI-11 and OI-27); both corrected. It rechecked CF-32 to CF-35, which hold.

**Consistency check Run 8 (scoped), 2026-10-05:** No new finding; CF-36 and CF-37 hold. To-do step 2 is complete: Run 8 is dated after the last change to chunks 00-13. Two of the session's three runs were used.

**Handoff, 2026-10-05:** v1.3 delivered. To-do steps 1 and 2 are complete. Next: the grill-me session (step 3). The delivery gate is shut; chunks 15-17 are Locked.

**To-do step 2 finished, 2026-10-05:** The product manager asked to finish step 2, with the recheck of the corrections the earlier session could not recheck. The files show step 2 already complete: Run 7 rechecked CF-32 to CF-35, Run 8 rechecked CF-36 and CF-37, and nothing in chunks 00-13 changed after Run 8. No run was due, so this session used none of its three runs. No content change; the version stays 1.3.

**Grill-me session (to-do step 3), 2026-10-05:** The product manager ran the session with the prompt in 14-todo.md step 3 (BRD v1.3). The interviewer followed the grilling skill: a design tree worked in rounds, each question with a recommended answer. Round 1 asked the 12 questions with no open prerequisite (Q1-Q12); round 2 asked the 3 questions their answers opened (Q13 after Q2, Q14 after Q1, Q15 after Q8 and Q10). The frontier was then empty. The product manager accepted every recommended answer, confirmed the shared understanding, and handed back 15 decisions. Test fixture: the session ran non-interactively, and the product manager's answers were set by the test brief (accept every recommended answer; no new scope). brd-unifier applied the decisions as TD-26 to TD-40 (v1.4): 10 change the BRD and 5 confirm it as written. None matched an open item.

**Consistency check Run 9 (full), 2026-10-05:** The first run of the grill-me session's update. 6 findings. Two corrections carry applied decisions (CF-38 TD-38, CF-40 OI-27 with TD-32 to TD-34) and three are mechanical (CF-41, CF-42, CF-43); all corrected. One business ambiguity became OI-31 (CF-39); the product manager accepted the recommendation in the acceptance loop, and it was applied.

**Consistency check Run 10 (scoped), 2026-10-05:** No new finding; CF-38 to CF-43 and the applied OI-31 hold. To-do steps 2 and 3 are complete: Run 10 is dated after the last change to chunks 00-13. Two of the session's three runs were used.

**Handoff, 2026-10-05:** v1.4 delivered. To-do steps 1, 2, and 3 are complete (G1-G3 met). Next: steps 4 and 5, in parallel. The delivery gate is shut; chunks 15-17 are Locked.

**Mockups approved (to-do step 4), 2026-10-05:** The product manager reported that every prototype in the Mockup coverage table (MK-01 to MK-05) was reviewed and approved: playable, delivered at mobile, tablet, and desktop, and played through with a pass. Test fixture: the confirmation came from the test brief, and the MK-04 and MK-05 links (https://www.figma.com/proto/TEST-FIXTURE/refunds-portal-MK-04 and -MK-05) are test-fixture links. brd-unifier recorded the evidence in 14-todo.md step 4 and put the MK-04 link in UC-06 UI/UX (v1.5). The mockup IDs are unchanged.

**Consistency check Run 11 (full), 2026-10-05:** The first run of the mockups session. 2 findings, both in chunk 14 and mechanical (CF-44 the step 2 record and G5, CF-45 the mockup brief link); both corrected. Chunks 00-13 are consistent.

**Consistency check Run 12 (scoped), 2026-10-05:** No new finding; CF-44 and CF-45 hold. To-do step 2 is complete again. Two of the session's three runs were used.

**Handoff, 2026-10-05:** v1.5 delivered. To-do steps 1 to 4 are complete (G1-G4 met). Next: step 5. The delivery gate is shut; chunks 15-17 are Locked.

**Use-case diagrams and flowcharts (to-do step 5), 2026-10-05:** The product manager asked for the diagrams. G1-G3 were verified in the files first. brd-unifier drew the use-case diagram (Figure 3, chunk 05) and one flowchart for each of the five use cases, all of which qualify (Figures 4-8, chunks 06a and 06b); v1.6. No gap needed a new to-do item: every branch end is stated in the narratives (TD-32 to TD-34 settled the last three before this step). The extend relationships of Figure 3 come from UC-06 A2. The Mermaid blocks were checked by reading, against the rules of mermaid-diagrams.md; no renderer was run.

**Consistency check Run 13 (full, with C9), 2026-10-05:** The first run of the step 5 update. 5 findings. Two corrections carry applied decisions in the figures (CF-46 OI-11 in Figure 4, CF-48 OI-30 in Figure 8) and two are mechanical in chunk 14 (CF-49, CF-50); all corrected. One business ambiguity became OI-32 (CF-47): UC-06 E1 and E2 did not say what happens when the customer turns down the offer, so the step 5 entry above ("every branch end is stated") did not hold for Figure 7. Figure 7 was marked Provisional (TD-42). The product manager accepted the recommendation in the acceptance loop; it was applied to UC-06 and Figure 7, and the UC-06 flowchart row went back to Drafted. Because UC-06 changed after the mockups were approved, its mockup row MK-04 reopens at to-do step 4 (delivery-chunks.md § Refresh triggers).

**Consistency check Run 14 (scoped, with C9), 2026-10-05:** CF-46 to CF-50 and the applied OI-32 hold. 1 new finding, CF-51: Figure 7 branched on two customer choices without decision nodes; corrected (mechanical).

**Consistency check Run 15 (scoped, with C9), 2026-10-05:** CF-51 holds. 2 new findings, CF-52 (the v1.6 Changes Log row) and CF-53 (the Figure 7 Summary had three sentences), both corrected; neither changes what the BRD says about the product. This was the session's third run, so their recheck waits for the next session. To-do steps 2 and 5 are complete.

**Handoff, 2026-10-05:** v1.6 delivered. To-do steps 1, 2, 3, and 5 are complete. Step 4 is back in progress: MK-04 reopened because OI-32 changed UC-06 after the mockup approval. The delivery gate is shut (G4); chunks 15-17 are Locked.

**Delivery chunks requested, 2026-10-05:** The product manager asked for the implementation plan (chunk 15), then for the UAT/BAT test cases (chunk 16). brd-unifier verified G1-G5 in the files each time: G1 (42 to-do rows Resolved, 32 review items closed, no marker in chunks 00-12), G2 (Run 15 after the last content change, every finding dispositioned), G3, and G5 are met. G4 is not met: MK-04 is In review, because OI-32 changed UC-06 E1 and E2 after the mockup approval of 2026-10-05, and only the product manager's review and a dated play-through can approve it again. The gate is shut, so neither chunk was written, and no draft or outline of them exists. Chunk 17 was not requested. No content change; the version stays 1.6.

**Mockup MK-04 approved again (to-do step 4), 2026-10-05:** The product manager reported that MK-04 was reviewed again against UC-06 as OI-32 changed it (v1.6), and approved: playable, delivered at mobile, tablet, and desktop, and played through with a pass, at the same link. Test fixture: the confirmation came from the test brief, and no real review or play-through took place. brd-unifier recorded the evidence in 14-todo.md step 4. UC-06 UI/UX already links MK-04, so no BRD chunk changed, and the version stays 1.6. Steps 4 and 5 are both Complete again, so the consistency check is due (delivery-chunks.md § Refresh triggers); step 2 is In progress until it runs.

**Consistency check Run 16 (full, with C9), 2026-10-05:** The product manager asked for the consistency check that to-do step 2 needs now that steps 4 and 5 are both Complete again, with the recheck of CF-52 and CF-53. The first run of this session checked chunks 00-13, 14 for C10, this register, and the master, with a cleared-context checker. CF-52 and CF-53 hold. 6 findings: two business ambiguities (CF-54, CF-55) became OI-33 and OI-34, and four mechanical record corrections (CF-56 to CF-59) were applied: the v1.6 Changes Log row, the run records in 14, and three supersede notes in this register.

**Acceptance loop for OI-33 and OI-34, 2026-10-05:** The product manager accepted both recommendations (test fixture: the test brief still set "accept every recommendation" for these two). brd-unifier applied them as v1.7: UC-06 A3, E4, AC-10, AC-11, and Figure 7; UC-01 E5, AC-10, and Figure 4; the reset code in 08 and 02; the pointer in 04 / Out of Scope. The matrix (07) was re-derived and is unchanged: no actor changed. The use-case changes reopened MK-01 and MK-04 (to-do step 4) and Figures 4 and 7 (to-do step 5).

**PM policy for new items, 2026-10-05:** After OI-33 and OI-34 were accepted, the test brief changed the product manager's answers for any new item raised from then on, by a consistency run, the reviewer, or grill-me: an item that adds behavior beyond the BRD's current scope (a new flow, path, rule, screen, or capability) is rejected, with the reason "out of scope for this release (test-fixture policy)", and recorded only in chunk 13 and this register. An item that only clarifies existing behavior, or is mechanical, is accepted as before.

**Mockups MK-01 and MK-04 approved again (to-do step 4), 2026-10-05:** The product manager confirmed that MK-01 and MK-04 were reviewed again against the changed UC-01 and UC-06 and approved: playable, delivered at mobile, tablet, and desktop, and played through with a pass, at the same links. Test fixture: no real review or play-through took place. Step 4 is Complete again.

**Flowcharts redrawn (to-do step 5), 2026-10-05:** brd-unifier redrew Figure 4 (E5 as a third answer at the A1 decision) and Figure 7 (the A3 and E4 paths, 58 lines), by reading them against mermaid-diagrams.md; no renderer was run. Both are Drafted until Run 17 checks them (C9).

**Consistency check Run 17 (scoped, with C9 for Figures 4 and 7), 2026-10-05:** CF-54 to CF-59 and the applied OI-33 and OI-34 hold, and Figures 4 and 7 pass C9, so both are Final and to-do step 5 is Complete again. 2 new findings: CF-60 (a stale sentence in the step 5 record of 14, mechanical) was corrected; CF-61 became OI-35 (no flow for an email address that no account has in UC-06 A3). Every option that closes OI-35 adds a flow, so under the PM policy for new items the product manager rejected it as out of scope for this release; nothing was applied, and it is recorded only in chunk 13 and here. Steps 4 and 5 are both Complete again, so Run 18 is due.

**Consistency check Run 18 (scoped), 2026-10-06:** CF-60 and the OI-35 record hold. 2 new findings, CF-62 (the step 1 record in 14) and CF-63 (the v1.7 Changes Log row), both mechanical and corrected; neither changes what the BRD says about the product. This was the session's third run, so their recheck waits for the next session. To-do step 2 is complete: Run 18 is dated after the last content change, and every finding has a disposition.

**Handoff, 2026-10-06:** v1.7 delivered. All five to-do steps are complete, every to-do row is Resolved, and every review item is closed (OI-35 as Rejected). G1-G5 are met in the files, so the delivery gate is open; chunks 15-17 are still Locked because none is written yet.

**Delivery chunks written, 2026-10-06:** The product manager asked for the implementation plan (chunk 15), then for the UAT/BAT test cases (chunk 16). brd-unifier verified G1-G5 in the files before each. Chunk 15: 5 tasks in 4 waves, no dependency problem, no new item. TASK-01 to TASK-03 keep the IDs of the BRD v1.0 plan, the reference input in 12 / Appendix; TASK-04 (UC-06) and TASK-05 (the 09 report, which has no use case, as a Cross-cutting task) are new. Chunk 16: 76 cases in 6 sections, each with its Related Task and Needs cell; no provisional case and no coverage gap; Figures 4-8 were cross-checked branch by branch. The v1.0 case IDs are kept where a case carries over (TC-REQ-01 to TC-REQ-08, TC-DEC-01 to TC-DEC-05, TC-UIX-01, TC-NFR-01, TC-NFR-02); new cases take the next free numbers. Chunk 17 was not requested and was not written. No content change; the version stays 1.7.

<!-- MASTER: refunds-portal-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->

## CHK editorial diagram correction - 2026-10-06

User approved in Codex: split UC-06 and UC-04 flowcharts into connected views of at most 30 lines. Original Figures 7 and 8 keep their numbers and anchors; continuations take new Figures 9-12. Every original node label and decision edge is preserved. BRD business content, version 1.7, delivery bases and source case IDs remain unchanged. C9 was rechecked against the narratives. The REFUNDS owner re-approves MK-03 and MK-04 under the fixed test-fixture policy; no real Figma review or play-through is claimed.
