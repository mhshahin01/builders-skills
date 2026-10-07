<!--
CHUNK: 16
TITLE: UAT/BAT Test Cases
PROJECT: Refunds Portal
VERSION: 1.9 (baselined against BRD v1.9)
DATE: 2026-10-06
DEPENDS_ON: 02, 05, 06a, 06b, 07, 08, 09, 10, 11, 14, 15
PART OF: BRD - Refunds Portal
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared (all five steps Complete with evidence, every to-do item Resolved, Deferred does not count, no override) and chunk 15 was written without raising a new open item. Never written or refreshed while the gate is shut. A Stale mark and execution tracking are allowed (delivery-chunks.md § The delivery gate, Re-lock, and § Refresh triggers).
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: Business-level acceptance test cases (UAT/BAT) derived from the BRD use cases (UC-01..UC-06; UC-05 is merged into UC-04), NFRs (NFR-01..NFR-06), the branch refund report (chunk 09), and the UI/UX expectations (chunk 11). Technical test cases (API contracts, data schemas, performance harnesses) are owned by the SDD test plan, not this file.
SCOPE NOTE: All cases run in the default execution scope; no scope tags are used. Cases that need another team's cooperation: TC-REQ-07, TC-REQ-12, TC-REQ-18, TC-DEC-03, and TC-DEC-04 (the Retail IT team, for the Point-of-Sale Records); TC-ACC-11 and TC-ACC-15 (the Notification Partner, MsgHub); TC-REQ-19, TC-DEC-04, TC-DEC-08, TC-DEC-09, TC-DEC-11, and TC-DEC-13 (the Payment Provider, CardPay Ltd); TC-NFR-01 to TC-NFR-04 (the delivery team, for the logs and the staged peak).
RULES: delivery-chunks.md in the brd-unifier skill. One combined UAT/BAT suite; "(BAT observation)" marks NFR acceptance cases judged over the UAT/BAT period rather than by one scripted check; the exit criteria are the BAT sign-off. Each case runs when the tasks and prerequisites in its Needs cell are ready, never per section; a task is Accepted when every case naming it in Related Task passes. Expected results come from the BRD; they are never invented.
-->

# Refunds Portal - UAT/BAT Test Cases

**Owner:** Product Team | **Prepared:** 2026-10-06 | **Baseline:** BRD v1.9 (all chunks) | **Design reference:** Figma - Refunds Portal UI/UX (5 screens, chunk 11)

**Suite status:** Up to date | **Gate verified:** 2026-10-06 (see [14-todo.md](./14-todo.md)) | **Flowchart cross-check:** done on 2026-10-06 | **New items raised while writing this suite:** 0

**Scope note:** All cases run in the default execution scope; no scope tags are used. Cases that need another team's cooperation: TC-REQ-07, TC-REQ-12, TC-REQ-18, TC-DEC-03, and TC-DEC-04 (the Retail IT team, for the Point-of-Sale Records); TC-ACC-11 and TC-ACC-15 (the Notification Partner, MsgHub); TC-REQ-19, TC-DEC-04, TC-DEC-08, TC-DEC-09, TC-DEC-11, and TC-DEC-13 (the Payment Provider, CardPay Ltd); TC-NFR-01 to TC-NFR-04 (the delivery team, for the logs and the staged peak).

## How to use this document

- **Testing Result** is filled during execution with one of: `Success`, `Failed`, `Blocked` (cannot execute due to environment/dependency), `Not Run`.
- **Testing Comment** records evidence on failure (what was observed vs expected, screen, day, data used) and any deviation accepted by the business.
- Every test case traces to a use case (UC-NN) or NFR, and to the task (TASK-NN) it counts toward: its **Related Task**, the task that delivers the screen or step it checks. The traceability matrix confirms the coverage, and anything not covered is listed under Coverage gaps.
- A test case passes only when its **Success Criteria** is fully met; partial behaviour is `Failed` with a comment.
- **Needs** lists what must be ready before the case can run: the tasks that must have reached `Ready for test` in [15-implementation.md](./15-implementation.md), then the prerequisites below that are not marked (all cases). Those marked (all cases) must be in place before the first case runs. Run each case as soon as its Needs are ready. Do not wait for the rest of its section or for a later wave: sections only group cases for the tester.
- A task is `Accepted` (complete) when every case that names it in Related Task passes (see Task acceptance). Record it in the task's Delivery status in chunk 15. `Ready for test` alone is not complete.
- A test case marked **(Provisional)** has an expected result that is not final yet; its Success Criteria names the to-do item it waits for. Do not sign off on it until that item is resolved and the case is refreshed.

## Test environment and data prerequisites

| # | Prerequisite |
|---|--------------|
| P1 | UAT environment with test versions of the Point-of-Sale Records, the Payment Provider, the Notification Partner, and Staff sign-in and branch manager access (08; BO-03 fixture confirmation) (all cases) |
| P2 | Test accounts: customers A and B, who can read the email and SMS sent to them; the branch managers of branches A and B, set up outside the portal (02 / Assumption 3); and a visitor who is not signed in (all cases) |
| P3 | Receipts in the test Point-of-Sale Records: purchases made 10, 29, 30, and 31 days before the test day; receipts with 2 and 3 items; a receipt with a total of 50.00 EUR; a cash-only purchase; items of 30.00, 20.00, and 30.00 EUR paid 50.00 EUR by card and 30.00 EUR in cash; items of 60.00 and 40.00 EUR with a 10.00 EUR discount on the whole receipt; a receipt with one item already refunded at the branch |
| P4 | Ability to stage partner failures with the delivery team: the Point-of-Sale Records do not answer, the Notification Partner does not answer, the Payment Provider refuses payouts for a set time |
| P5 | A cover set up outside the portal: the branch manager of branch A covers branch B for a set period (02 / Assumption 3) |
| P6 | Requests of branches A and B in every status, submitted and decided on several days before the test day, and 25 requests each for customer A and branch A |
| P7 | Ability to stage the seasonal peak, three times the usual number of requests (02 / Facts), with the delivery team |
| P8 | An availability log and a record of approved and paid refunds, kept by the delivery team across the UAT period |
| P9 | REFUNDS owner test fixtures: separate receipts paid 50 EUR by card, with distinct eligible items and requests in every status. Submission copies have Approved 30 EUR and Paid 10 EUR. Approval copies start with Approved 10 EUR and Paid 10 EUR; another eligible request is approved for 20 EUR before confirmation. Excluded statuses do not consume the cap. These are staged data, not a new request-entry flow. |
| P10 | REFUNDS owner test fixtures: branch-local submission, first decision and Paid dates; cancelled and undecided requests; decided-but-unpaid requests; empty samples; branch totals for the equal-request-weight objective check. |

---

## 1. Sign Up and Sign In (UC-06, UC-04, MK-04, MK-03)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-ACC-01 | Sign up | Verify a new customer can sign up with a confirmed email address and mobile number | Choose sign up; enter a.test@example.com, mobile 0700 000 001, and a password; enter the email code and the SMS code | The account is created and the customer is signed in | UC-06 (AC-1, BR-1) | TASK-04 | TASK-04 | | |
| TC-ACC-02 | Notice at sign-up | Verify the sign-up page says how the contact details are used and how long they are kept | Choose sign up and read the page before entering any detail | The notice appears before any detail is entered and says how the details are used and how long they are kept (03 / Refund records) | UC-06 (step 2) | TASK-04 | TASK-04 | | |
| TC-ACC-03 | Sign in | Verify a customer with an account can sign in with email address and password | Customer A enters their email address and password | Customer A is signed in | UC-06 (A1) | TASK-04 | TASK-04 | | |
| TC-ACC-04 | Not signed in: request | Verify a visitor who tries to request a refund is asked to sign in or sign up first | The visitor opens the refund request form | The system asks the visitor to sign in or sign up first | UC-06 (A2, AC-5), UC-01 | TASK-01 | TASK-01 | | |
| TC-ACC-05 | Not signed in: track or cancel | Verify a visitor who tries to track or cancel a refund is asked to sign in or sign up first | The visitor tries to open their refund requests, then tries to cancel a request | Each time, the system asks the visitor to sign in or sign up first | UC-06 (A2, AC-5), UC-02, UC-03 | TASK-02 | TASK-02 | | |
| TC-ACC-06 | Wrong code, new code | Verify a wrong code leads to a new code and that only the latest code works | Enter a wrong email code; ask for a new code; enter the earlier code, then the new one | The wrong code is refused with an offer of a new code; the earlier code is refused; the new code is accepted | UC-06 (E1, AC-3, AC-6, BR-4) | TASK-04 | TASK-04 | | |
| TC-ACC-07 | Wrong code, entered again | Verify the customer can enter the right code again after a wrong one | Mistype the SMS code; then enter the right SMS code within 15 minutes | The system says the code is wrong or expired; the right code is then accepted, and the sign-up goes on | UC-06 (E1, AC-8) | TASK-04 | TASK-04 | | |
| TC-ACC-08 | Code time limit | Verify a confirmation code works for 15 minutes after it is sent | Enter a code 14 minutes after it was sent; in a second sign-up, enter a code 16 minutes after it was sent | At 14 minutes the code is accepted; at 16 minutes the system says it is wrong or expired and offers a new one | UC-06 (BR-3, E1) | TASK-04 | TASK-04 | | |
| TC-ACC-09 | Email address used: sign in | Verify signing up with a used email address offers sign-in | Sign up with customer A's email address; accept the offer and enter A's password | The system says an account exists and offers to sign in; after accepting, customer A is signed in | UC-06 (E2, AC-4, BR-2) | TASK-04 | TASK-04 | | |
| TC-ACC-10 | Email address used: other address | Verify the customer can enter another email address instead | Sign up with customer A's email address; turn down the offer and enter b.test@example.com | The sign-up goes on with b.test@example.com | UC-06 (E2, AC-9) | TASK-04 | TASK-04 | | |
| TC-ACC-11 | Codes cannot be sent | Verify the customer is asked to try again later when codes cannot be sent | The Notification Partner does not answer when the codes are sent at step 4, and again when a new code is asked for | Each time, the system says it cannot send codes now and asks the customer to try again later | UC-06 (E3, AC-7) | TASK-04 | TASK-04; P4 | | |
| TC-ACC-12 | Sign-in fails | Verify a wrong password is refused and the customer can try again | Customer A enters their email address with a wrong password, then with the right one | The system says the email address or the password is wrong; the second try signs customer A in | UC-06 (E4, AC-11) | TASK-04 | TASK-04 | | |
| TC-ACC-13 | Forgotten password | Verify a customer who forgot the password can set a new one with a code sent by email | Customer A says they forgot the password, enters the code from the email, and chooses a new password | A code arrives at customer A's email address; after the new password is chosen, customer A is signed in | UC-06 (A3, AC-10) | TASK-04 | TASK-04 | | |
| TC-ACC-14 | Forgotten password: wrong or expired code | Verify a wrong or expired reset code is handled as in E1 | In A3, mistype the code and enter it again; then let a code pass 15 minutes and ask for a new one | The system says the code is wrong or expired and offers a new one; the code entered again works; the new code works | UC-06 (A3, E1, BR-3) | TASK-04 | TASK-04 | | |
| TC-ACC-15 | Forgotten password: code cannot be sent | Verify a reset code that cannot be sent is handled as in E3 | The Notification Partner does not answer when customer A asks for a reset code | The system says it cannot send codes now and asks customer A to try again later | UC-06 (A3, E3) | TASK-04 | TASK-04; P4 | | |
| TC-ACC-16 | Branch manager sign-in | Verify a branch manager signs in with the access set up outside the portal and sees the waiting requests | The branch manager of branch A signs in and opens the list of Submitted requests | The list shows branch A's Submitted requests, oldest first, each with amount and reason | UC-04 (Preconditions, steps 1-2) | TASK-03 | TASK-03; P6 | | |

## 2. Refund Requests (UC-01, UC-02, UC-03, MK-01 (SCR-01), MK-02 (SCR-02), NFR-04)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-REQ-01 | Submit a refund | Verify a customer can submit a refund request within the refund window | Customer A enters the receipt number and total of a purchase from 10 days ago, selects 2 items and a reason, and submits | The request is Submitted with a reference number; customer A gets an email and an SMS that ask them to bring the items to the branch | UC-01 (AC-1) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-02 | Refund window passed | Verify a purchase older than 30 days is refused at step 2 | Customer A enters the receipt of a purchase from 31 days ago | Customer A is told the refund window has passed and that they can visit the branch | UC-01 (E1, AC-2, BR-1) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-03 | Item already refunded at the branch | Verify an item refunded at a branch cannot be selected | Customer A enters a receipt with one item already refunded at the branch | That item is shown but cannot be selected; the other items can be selected | UC-01 (A1, AC-4, BR-2) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-04 | Receipt not found | Verify details that match no receipt are refused | Customer A enters a real receipt number with the total 49.00 EUR instead of 50.00 EUR | Customer A is asked to check the details and try again | UC-01 (E2, AC-5) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-09 | Refund window boundary | Verify the window counts calendar days from the day after purchase, by the branch's date | Customer A submits requests for purchases made 29, 30, and 31 days before the test day | 29 and 30 days: the request is Submitted; 31 days: customer A is told the refund window has passed | UC-01 (BR-7, AC-3, BR-1) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-10 | Window closes before submission | Verify the window is checked again at submission | Customer A enters the receipt of a purchase made 30 days ago at 23:55 branch time and submits at 00:05 | The request is not recorded; customer A is told the refund window has passed | UC-01 (E1, AC-8, BR-7) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-11 | Not paid by card | Verify a purchase with no card payment is refused | Customer A enters a cash-only receipt | Customer A is told only card purchases can be refunded online and that they can visit the branch | UC-01 (E3, AC-6) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-12 | Receipts cannot be checked | Verify the customer is asked to try later when the Point-of-Sale Records do not answer | The Point-of-Sale Records do not answer when customer A enters a real receipt | Customer A is asked to try again later and is not told the receipt is not found | UC-01 (E4, AC-7) | TASK-01 | TASK-01; P3, P4 | | |
| TC-REQ-13 | Item in another request | Verify an item in another request that is not Cancelled cannot be selected, while the others can still be submitted | Customer A submits a request for item 1 of a 3-item receipt, then enters the receipt again and selects items 2 and 3 | Item 1 is shown but cannot be selected; the new request for items 2 and 3 is Submitted | UC-01 (A1, AC-4, AC-9, BR-6) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-14 | Nothing left to refund | Verify a receipt with every item in another request offers nothing to select | Customer A submits a request for both items of a 2-item receipt, then enters the receipt again | No item can be selected; customer A is told nothing on this receipt can be refunded online and that they can visit the branch | UC-01 (E5, AC-10) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-15 | Card share limit | Verify a refund is at most the amount paid by card | On the receipt with items of 30.00, 20.00, and 30.00 EUR paid 50.00 EUR by card, select 1, then 2, then all 3 items | The refund amount shows 30.00, then 50.00, then 50.00 EUR | UC-01 (BR-4) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-16 | Receipt discount split | Verify a receipt discount is split across items in proportion to their prices | On the receipt with items of 60.00 and 40.00 EUR and a 10.00 EUR discount, select the 60.00 EUR item | The refund amount shows 54.00 EUR | UC-01 (BR-5) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-17 | No card details asked | Verify the customer never enters card details | Customer A walks a request from the receipt to submission | No screen asks for card details | UC-01 (BR-3) | TASK-01 | TASK-01; P3 | | |
| TC-REQ-18 | Point-of-Sale Records told | Verify the Point-of-Sale Records learn which items are in a portal request | The Retail IT team checks the items of a request just submitted and tries a till refund of one of them | The items show as in a portal request, and the till refund is stopped | UC-01 (step 6), 08 / Point-of-Sale Records | TASK-01 | TASK-01; P3 | | |
| TC-REQ-05 | See an approved request | Verify the customer sees the status and approval date of an approved request | Customer A opens a request that the branch manager approved on the test day | The history shows Approved with the approval date | UC-02 (AC-1) | TASK-02 | TASK-02, TASK-03 | | |
| TC-REQ-06 | No requests yet | Verify the empty list message | A customer who has just signed up opens their refund requests | The system says there are no refund requests | UC-02 (A1, AC-2) | TASK-02 | TASK-02 | | |
| TC-REQ-19 | Request list and reasons | Verify the list and the history show each request's details and reasons | Customer A has a rejected, a partly approved, and a Payout failed request; A opens the list, then each request | Each row shows reference number, amount, and status; each history shows its status changes with dates, and the reason of the rejection and of the partial approval | UC-02 (steps 2-4) | TASK-02 | TASK-02, TASK-03; P4 | | |
| TC-REQ-20 | Own requests only | Verify a customer sees only their own requests | Customers A and B each have a request; customer A opens their refund requests | Customer A sees only their own request, never customer B's | UC-02 (BR-1), UC-06 (AC-2), NFR-04 | TASK-02 | TASK-02 | | |
| TC-REQ-07 | Cancel a request | Verify a Submitted request can be cancelled | Customer A opens a Submitted request, chooses cancel, and confirms | The request is Cancelled; customer A gets an email and an SMS; the Point-of-Sale Records show the items can be refunded at the branch | UC-03 (AC-1, step 5) | TASK-02 | TASK-02 | | |
| TC-REQ-08 | Cancel after a decision | Verify a decided request cannot be cancelled | The branch manager approves request X; customer A then chooses to cancel it | Customer A is told the request can no longer be cancelled | UC-03 (E1, AC-2, BR-1) | TASK-02 | TASK-02, TASK-03 | | |
| TC-REQ-21 | Decided while confirming | Verify a request decided during the confirmation is not cancelled | Customer A chooses cancel; before A confirms, the branch manager rejects the request; then A confirms | The request stays Rejected; customer A is told it can no longer be cancelled | UC-03 (E2, AC-3) | TASK-02 | TASK-02, TASK-03 | | |
| TC-REQ-22 | Items freed by a cancellation | Verify the items of a Cancelled request can be selected again within the window | Customer A cancels a request for item 1, then enters the same receipt again within the refund window | Item 1 can be selected again | UC-01 (BR-6), UC-03 (step 5) | TASK-02 | TASK-02; P3 | | |
| TC-REQ-23 | Items of a decided request | Verify the items of a decided request cannot be selected again | The branch manager rejects a request for item 1 of one receipt and partly approves a request for items 1 and 2 of another; customer A enters both receipts again | Item 1 of the first receipt, and items 1 and 2 of the second, are shown but cannot be selected | UC-01 (BR-6), UC-04 (A1, A2) | TASK-03 | TASK-03; P3 | | |
| TC-REQ-24 | Current card-paid cap | Verify submission counts Approved and Paid amounts only | On separate P9 copies, choose eligible items worth 9.99, 10.00 and 10.01 EUR. Other requests include Submitted, Rejected, Cancelled and Payout failed | The amounts are 9.99, 10.00 and 10.00 EUR. Approved 30 plus Paid 10 leaves 10 EUR; the excluded statuses do not reduce it. Submission stays within this cap | UC-01 (BR-4, AC-11) | TASK-01 | TASK-01; P9 | | |

## 3. Refund Decisions (UC-04, MK-03, NFR-04)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-DEC-01 | Approve in full | Verify a full approval pays the customer | The branch manager of branch A opens a Submitted request of 50.00 EUR, chooses Approve, and confirms the amount | The request becomes Approved, then Paid; the customer gets an email and an SMS with the amount paid, 50.00 EUR | UC-04 (AC-1, steps 3-7) | TASK-03 | TASK-03 | | |
| TC-DEC-02 | Partial amount limits | Verify a partial amount must be more than 0 and less than the requested amount | On four Submitted requests of 50.00 EUR, lower the amount with a reason to 0.00, 0.01, 49.99, and 50.00 EUR | 0.00 and 50.00 EUR are not accepted, and the message says what to fix; 0.01 and 49.99 EUR are accepted | UC-04 (A1, BR-2) | TASK-03 | TASK-03 | | |
| TC-DEC-03 | Reject with a reason | Verify a rejection tells the customer the reason and frees the items at the branch | An item comes back damaged; the branch manager rejects the request with the reason "Item came back damaged" | The request is Rejected; the customer gets the reason by email and SMS; the Point-of-Sale Records show the items can be refunded at the branch | UC-04 (A2, AC-5, BR-3, BR-4) | TASK-03 | TASK-03 | | |
| TC-DEC-04 | Payout keeps failing | Verify a payout that still fails after 24 hours ends as Payout failed | The Payment Provider refuses every payout try for an approved request for 25 hours | The request becomes Payout failed; the branch manager and the customer get an email and an SMS; the customer is asked to visit the branch; the Point-of-Sale Records show the items can be refunded at the branch | UC-04 (E1, AC-2, AC-4) | TASK-03 | TASK-03; P4 | | |
| TC-DEC-05 | Other branch refused | Verify a branch manager cannot decide on another branch's request | The branch manager of branch A, who covers no branch, looks for a Submitted request of branch B | The request is not in branch A's list, and the manager cannot open or decide on it | UC-04 (BR-1), 07 (footnote 1), NFR-04 | TASK-03 | TASK-03 | | |
| TC-DEC-06 | Partial approval message | Verify the customer is told the amount paid and the reason after a partial approval | One of two items comes back damaged; the branch manager lowers 50.00 EUR to 30.00 EUR with the reason "One item damaged" | The request is Paid; the customer gets an email and an SMS with 30.00 EUR and the reason | UC-04 (A1, AC-3, BR-4) | TASK-03 | TASK-03 | | |
| TC-DEC-07 | Rejection needs a reason | Verify a rejection without a reason is not accepted | The branch manager chooses Reject and leaves the reason empty | The rejection is not accepted, and the message asks for a reason; the request stays Submitted | UC-04 (BR-3) | TASK-03 | TASK-03 | | |
| TC-DEC-08 | Later payout try succeeds | Verify a refused payout that succeeds on a later try ends as Paid | The Payment Provider refuses the first payout try and accepts a try 2 hours later | The request is Paid, and the customer gets the amount paid by email and SMS | UC-04 (E1, AC-8) | TASK-03 | TASK-03; P4 | | |
| TC-DEC-09 | 24-hour payout limit | Verify the 24-hour limit on each side of its end | The Payment Provider refuses payouts for request X for 23 hours and then accepts; it refuses request Y for 25 hours | X stays Approved through the 23 hours, then becomes Paid with no Payout failed message; Y becomes Payout failed once 24 hours have passed | UC-04 (E1) | TASK-03 | TASK-03; P4 | | |
| TC-DEC-10 | Cancelled meanwhile | Verify no decision is recorded on a request the customer has cancelled | Customer A cancels request X while the branch manager confirms its approval, and request Y while the manager confirms its rejection | Neither decision is recorded; the branch manager is told each request is Cancelled | UC-04 (E2, AC-6) | TASK-03 | TASK-03, TASK-02 | | |
| TC-DEC-11 | Payout failed request | Verify a Payout failed request opens for viewing only | The branch manager of branch A opens a Payout failed request of branch A | The request details are shown, and no Approve or Reject is offered | UC-04 (A3, AC-7, BR-7) | TASK-03 | TASK-03; P4 | | |
| TC-DEC-12 | Cover decides | Verify a cover decides on the covered branch's requests only while the cover lasts | Branch A's manager covers branch B from Monday to Wednesday; on Tuesday A approves a branch B request; on Thursday A opens the list again | On Tuesday the list holds branch B's Submitted requests, and the approval is recorded; on Thursday branch B's requests are no longer in the list | UC-04 (BR-6, BR-1, step 1), 07 (footnote 1), NFR-04 | TASK-03 | TASK-03; P5 | | |
| TC-DEC-13 | Cover gets the branch's messages | Verify a cover gets the covered branch's daily message and Payout failed messages | While branch A's manager covers branch B, branch B has 2 waiting requests, and a branch B payout fails for more than 24 hours | Branch A's manager gets branch B's daily waiting-requests message and its Payout failed message | UC-04 (BR-6) | TASK-03 | TASK-03; P4, P5, P6 | | |
| TC-DEC-14 | Daily waiting-requests message | Verify the daily message is sent only on days with waiting requests | Branch A has 1 Submitted request, waiting for 3 days, on day 1, and none on day 2 | Day 1: the branch manager is told 1 request is waiting and the oldest has waited 3 days; day 2: no message | UC-04 (BR-5) | TASK-03 | TASK-03; P6 | | |
| TC-DEC-15 | Customer refused the decision screens | Verify a customer cannot open the branch manager's screens | Customer A, signed in, tries to open the list of requests waiting for a decision | Access is refused | UC-04 (07 matrix: Customer -), NFR-04 | TASK-03 | TASK-03 | | |
| TC-DEC-16 | Cap changes before confirmation | Verify approval uses the cap at confirmation | P9 has 30 EUR left on a 50 EUR card receipt. Open a 30 EUR request; another request for distinct items is approved for 20 EUR. Confirm using A1 with a reason | The second approval is at most the current 10 EUR left. A1 keeps its lower-amount reason. Only Approved and Paid amounts count; other statuses do not reduce the cap | UC-04 (step 4, A1, AC-9), UC-01 (BR-4) | TASK-03 | TASK-03; P9 | | |

## 4. Branch Refund Report (MK-05)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-RPT-01 | Report measures | Verify the report shows its four measures for the branch | The branch manager of branch A opens the branch refund report | The report shows requests per status, amounts paid, the average time to decision, and the average time from Submitted to Paid, for branch A | 09 / Branch refund report | TASK-05 | TASK-05; P6 | | |
| TC-RPT-02 | Previous-day snapshot | Verify status and paid amounts at the branch-local cutoff | A request was Submitted two days ago and Approved yesterday; it becomes Paid today. Open today's and tomorrow's reports | Today it counts as Approved, without its paid amount or Paid duration. Tomorrow it counts as Paid, with both. A request first Submitted today appears tomorrow | 09 / Branch refund report | TASK-05 | TASK-05; P10 | | |
| TC-RPT-03 | Report export | Verify the report can be exported to CSV and Excel | Export the branch A report to CSV and to Excel | Both files open and hold the same figures as the on-screen table | 09 / Branch refund report | TASK-05 | TASK-05; P6 | | |
| TC-RPT-04 | Decision mean sample | Verify the first-decision denominator | P10 has a request first approved after 48 hours and one first rejected after 24 hours. Include one cancellation with no decision and one still Submitted at cutoff | The decision mean is (48 + 24) / 2 = 36 hours. The cancelled and undecided requests are excluded from this average and remain in their status counts | 09 / Branch refund report | TASK-05 | TASK-05; P10 | | |
| TC-RPT-05 | Paid mean sample | Verify Submitted-to-Paid time includes the return trip | P10 has Paid durations of 24 and 72 hours, including time before the items were returned. Include an Approved request not yet Paid at cutoff | The Paid mean is (24 + 72) / 2 = 48 hours. The Approved request is excluded from that average and remains in its status count | 09 / Branch refund report | TASK-05 | TASK-05; P10 | | |
| TC-RPT-06 | Empty average samples | Verify empty averages differ from zero | Open a P10 report with only Submitted requests. Then open a separate sample with one Approved request and no Paid request | In the first sample both averages show no average, not zero. In the second the decision average is present and the Paid average shows no average. Status counts remain visible | 09 / Branch refund report | TASK-05 | TASK-05; P10 | | |
| TC-RPT-07 | Paid objective weighting | Verify the REFUNDS owner weights requests equally across branches | Outside the product, the REFUNDS owner uses P10: one branch has one Paid duration of 24 hours; another has three of 72 hours. Compare with the owner's comparable 10-day paper baseline fixture | The owner's calculation is (24 + 3 x 72) / 4 / 24 = 2.5 days, within the 3-day target. It is not an unweighted mean of branch averages. No cross-branch report or new product field is required | 01 / Business Objective 1; 09 / Branch refund report | TASK-05 | TASK-05; P10 | | |

## 5. Cross-Cutting UI/UX Standards (chunk 11)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-UIX-01 | Language & Locale - request form | Verify amounts, dates, and language follow chunk 11 on the request form | Customer A enters a receipt and selects items | Every amount shows EUR; dates use the format of the branch's country; all text is in English | UC-01 | TASK-01 | TASK-01; P3 | | |
| TC-UIX-02 | Language & Locale - lists, detail, decision screen | Verify amounts, dates, and language follow chunk 11 on the request lists, the request detail, and the decision screen | Open customer A's list and one request; open branch A's list and one request | Every amount shows EUR; dates use the format of the branch's country; all text is in English | UC-02, UC-03, UC-04 | TASK-02, TASK-03 | TASK-02, TASK-03 | | |
| TC-UIX-03 | Language & Locale - report | Verify amounts, dates, and language follow chunk 11 on the branch refund report | Open the branch A report | Every amount shows EUR; dates use the format of the branch's country; all text is in English | 09 / Branch refund report | TASK-05 | TASK-05; P6 | | |
| TC-UIX-04 | Error Messages - sign-up and sign-in | Verify the error messages of sign-up and sign-in follow chunk 11 | Trigger UC-06 E1 to E4 | Each message says in plain language what went wrong and what to do next, with no technical codes | UC-06 | TASK-04 | TASK-04; P4 | | |
| TC-UIX-05 | Error Messages - request form | Verify the error messages of the request form follow chunk 11 | Trigger UC-01 E1 to E5 | Each message says in plain language what went wrong and what to do next, with no technical codes | UC-01 | TASK-01 | TASK-01; P3, P4 | | |
| TC-UIX-06 | Error Messages - cancel and decision screens | Verify the error messages of the cancel and decision screens follow chunk 11 | Trigger UC-03 E1 and E2, UC-04 E2, a refused partial amount, and a rejection with no reason | Each message says in plain language what went wrong and what to do next, with no technical codes | UC-03, UC-04 | TASK-02, TASK-03 | TASK-02, TASK-03 | | |
| TC-UIX-07 | Responsive Design and Primary Color - sign-up and sign-in | Verify sign-up and sign-in work on mobile, tablet, and desktop and use the primary color | Walk UC-06 on a phone, a tablet, and a computer | Every step can be done on each screen size; the primary color is #1F6FEB | UC-06 | TASK-04 | TASK-04 | | |
| TC-UIX-08 | Responsive Design and Primary Color - request form | Verify the request form works on mobile, tablet, and desktop and uses the primary color | Walk UC-01 on a phone, a tablet, and a computer | Every step can be done on each screen size; the primary color is #1F6FEB | UC-01 | TASK-01 | TASK-01; P3 | | |
| TC-UIX-09 | Responsive Design and Primary Color - lists, detail, decision screen | Verify the lists, the request detail, and the decision screen work on mobile, tablet, and desktop and use the primary color | Walk UC-02, UC-03, and UC-04 on a phone, a tablet, and a computer | Every step can be done on each screen size; the primary color is #1F6FEB | UC-02, UC-03, UC-04 | TASK-02, TASK-03 | TASK-02, TASK-03 | | |
| TC-UIX-10 | Responsive Design and Primary Color - report | Verify the report works on mobile, tablet, and desktop and uses the primary color | Open and export the branch A report on a phone, a tablet, and a computer | The report can be read and exported on each screen size; the primary color is #1F6FEB | 09 / Branch refund report | TASK-05 | TASK-05; P6 | | |
| TC-UIX-11 | Data Tables - request lists | Verify the request lists can be sorted and show 20 rows per page | Customer A's list and branch A's list each hold 25 requests; sort each list by amount | Page 1 shows 20 rows and page 2 shows 5; sorting by amount reorders the list | UC-02, UC-04 | TASK-02, TASK-03 | TASK-02, TASK-03; P6 | | |

## 6. NFR Acceptance (NFR-01..NFR-06)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-NFR-01 | No lost or double payouts | Verify every approved refund is paid exactly once | Compare the approved and the paid refunds across the UAT period (BAT observation) | Zero missing or duplicate payouts in the month | NFR-01 | TASK-03 | TASK-03; P8 | | |
| TC-NFR-02 | Available at any time | Verify customers can use the portal at any time | Keep an availability log of the refund request journey across the UAT period (BAT observation) | No more than 2 hours of disruption a month, planned or unplanned; partner outages the portal handles with its own message (UC-01 E4, UC-04 E1, UC-06 E3) do not count | NFR-02 | TASK-01 | TASK-01; P8 | | |
| TC-NFR-03 | Receipt check speed | Verify a receipt check completes within 3 seconds, also at the seasonal peak | Time 10 receipt checks at normal load, and 10 while the delivery team stages three times the usual requests | Every receipt check completes within 3 seconds in both runs | NFR-05, NFR-03 | TASK-01 | TASK-01; P3, P7 | | |
| TC-NFR-04 | Opening a request speed | Verify opening a request completes within 3 seconds, also at the seasonal peak | Time 10 openings of a request by a customer and 10 by a branch manager, at normal load and at the staged peak | Every opening completes within 3 seconds in both runs | NFR-05, NFR-03 | TASK-02, TASK-03 | TASK-02, TASK-03; P7 | | |
| TC-NFR-05 | Accessibility - sign-up and sign-in | Verify sign-up and sign-in meet WCAG 2.1 level AA | Walk UC-06 with a screen reader and with a keyboard only, and check the contrast of text and controls | Every step can be done with a screen reader and with a keyboard only; every screen meets WCAG 2.1 level AA | NFR-06 | TASK-04 | TASK-04 | | |
| TC-NFR-06 | Accessibility - request form | Verify the request form meets WCAG 2.1 level AA | Walk UC-01 with a screen reader and with a keyboard only, and check the contrast of text and controls | Every step can be done with a screen reader and with a keyboard only; every screen meets WCAG 2.1 level AA | NFR-06 | TASK-01 | TASK-01; P3 | | |
| TC-NFR-07 | Accessibility - lists, detail, decision screen | Verify the lists, the request detail, and the decision screen meet WCAG 2.1 level AA | Walk UC-02, UC-03, and UC-04 with a screen reader and with a keyboard only, and check the contrast | Every step can be done with a screen reader and with a keyboard only; every screen meets WCAG 2.1 level AA | NFR-06 | TASK-02, TASK-03 | TASK-02, TASK-03 | | |
| TC-NFR-08 | Accessibility - report | Verify the branch refund report meets WCAG 2.1 level AA | Open and export the report with a screen reader and with a keyboard only, and check the contrast | The report can be read and exported with a screen reader and with a keyboard only; it meets WCAG 2.1 level AA | NFR-06 | TASK-05 | TASK-05; P6 | | |

---

## Traceability Matrix

| BRD Reference | Covered By |
|---------------|-----------|
| UC-01 Request a Refund | TC-ACC-04, TC-REQ-01, TC-REQ-02, TC-REQ-03, TC-REQ-04, TC-REQ-09, TC-REQ-10, TC-REQ-11, TC-REQ-12, TC-REQ-13, TC-REQ-14, TC-REQ-15, TC-REQ-16, TC-REQ-17, TC-REQ-18, TC-REQ-22, TC-REQ-23, TC-REQ-24, TC-DEC-16, TC-UIX-01, TC-UIX-05, TC-UIX-08 |
| UC-02 Track Refund Status | TC-ACC-05, TC-REQ-05, TC-REQ-06, TC-REQ-19, TC-REQ-20, TC-UIX-02, TC-UIX-09, TC-UIX-11 |
| UC-03 Cancel a Refund Request | TC-ACC-05, TC-REQ-07, TC-REQ-08, TC-REQ-21, TC-REQ-22, TC-UIX-02, TC-UIX-06, TC-UIX-09 |
| UC-06 Sign Up and Sign In | TC-ACC-01, TC-ACC-02, TC-ACC-03, TC-ACC-04, TC-ACC-05, TC-ACC-06, TC-ACC-07, TC-ACC-08, TC-ACC-09, TC-ACC-10, TC-ACC-11, TC-ACC-12, TC-ACC-13, TC-ACC-14, TC-ACC-15, TC-REQ-20, TC-UIX-04, TC-UIX-07 |
| UC-04 Approve / Reject Refund | TC-ACC-16, TC-REQ-23, TC-DEC-01, TC-DEC-02, TC-DEC-03, TC-DEC-04, TC-DEC-05, TC-DEC-06, TC-DEC-07, TC-DEC-08, TC-DEC-09, TC-DEC-10, TC-DEC-11, TC-DEC-12, TC-DEC-13, TC-DEC-14, TC-DEC-15, TC-DEC-16, TC-UIX-02, TC-UIX-06, TC-UIX-09, TC-UIX-11 |
| 09 Branch refund report | TC-RPT-01..07, TC-UIX-03, TC-UIX-10 |
| 01 Business Objective 1 | TC-RPT-07 |
| 11 UI/UX Expectations | TC-UIX-01..11 |
| NFR-01 Reliability | TC-NFR-01 |
| NFR-02 Availability | TC-NFR-02 |
| NFR-03 Scalability | TC-NFR-03, TC-NFR-04 |
| NFR-04 Security & Privacy | TC-REQ-20, TC-DEC-05, TC-DEC-12, TC-DEC-15 |
| NFR-05 Performance | TC-NFR-03, TC-NFR-04 |
| NFR-06 Accessibility | TC-NFR-05..08 |

## Task acceptance

| Task | Wave | Required cases |
|------|------|----------------|
| TASK-04 Customer sign-up and sign-in | 1 | TC-ACC-01..03, TC-ACC-06..15, TC-UIX-04, TC-UIX-07, TC-NFR-05 |
| TASK-01 Refund requests | 2 | TC-ACC-04, TC-REQ-01..04, TC-REQ-09..18, TC-UIX-01, TC-UIX-05, TC-UIX-08, TC-NFR-02, TC-NFR-03, TC-NFR-06, TC-REQ-24 |
| TASK-02 Request tracking and cancellation | 3 | TC-ACC-05, TC-REQ-05..08, TC-REQ-19..22, TC-UIX-02, TC-UIX-06, TC-UIX-09, TC-UIX-11, TC-NFR-04, TC-NFR-07 |
| TASK-03 Refund decisions and payout | 3 | TC-ACC-16, TC-REQ-23, TC-DEC-01..16, TC-UIX-02, TC-UIX-06, TC-UIX-09, TC-UIX-11, TC-NFR-01, TC-NFR-04, TC-NFR-07 |
| TASK-05 Branch refund report | 4 | TC-RPT-01..07, TC-UIX-03, TC-UIX-10, TC-NFR-08 |

## Provisional and blocked scenarios

None. Every expected result is grounded in a confirmed requirement.

## Coverage gaps

**Checked:** 5 Main Flows, 8 alternate flows, 13 exception flows, 36 acceptance criteria, 9 numeric or time-based rules, 6 NFRs, 53 labelled flowchart branches (and 15 end outcomes), 5 tasks. **Without a case:** 0.

| BRD Reference | Gap | Reason | To-do item / action |
|---------------|-----|--------|---------------------|
| None | - | Every item counted above has at least one case, and every task has at least one required case | - |

## Execution summary (fill at the end of the cycle)

| Metric | Count |
|--------|-------|
| Total test cases | 82 |
| Success | |
| Failed | |
| Blocked | |
| Not Run | |

**Exit criteria (BAT sign-off):** all Critical-path cases pass (Recommendation: sections 1, 2, and 3, chosen because their use cases carry a Business Objective (UC-01, UC-02, UC-04, UC-06) or sit on the main journey (UC-01, UC-04); the product manager confirms the list); no open Failed case without a business-accepted deviation; no `(Provisional)` case left unresolved; the BAT observations TC-NFR-01 and TC-NFR-02 meet the NFR-01 and NFR-02 measures over the UAT period (no NFR names a persona who validates it); no dependency of chunk 02 is needed before BAT sign-off or go-live: all four are needed before the build of a use case, so chunk 15 lists them as blockers of TASK-04, TASK-01, and TASK-03.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 15-implementation.md | NEXT: 17-for-ppt.md -->
