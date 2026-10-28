<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Refunds Portal
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every unapplied item carries a concrete Recommended Answer and Why, ready to be applied to the BRD body once the user accepts it. Applied items keep their stable OI heading, Status and Resolution Log pointer; their decision narrative lives in `decision-log.md`.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, defer, or reject the Recommended Answer; an answer policy the user set for the run accepts recommended answers in the user's place (SKILL.md step 8, Answer policy). Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, a Reviewer Note whose choice is needed to finalise the BRD (SKILL.md step 7, Editorial ownership), a live remainder in a decision or marker record that needs a business choice (a business review point included), and a grill-me question the session leaves open that needs a business choice can add open items after the first review; a missing fact stays a to-do (TD) item only. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)" or "(raised by the grill-me session of <date>, <question id>)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open, Deferred, or Decided - pending application. Closed means Accepted - applied, Adjusted - applied, or Rejected. A status outside the Status legend below counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Every unapplied item carries a concrete Recommended Answer and Why. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body. An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
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
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply BRD content (the exact rule, step, row, or wording that would close the item). This is what gets injected into the body when you accept. A clarification marker it inserts asks one distinct question that can be answered on its own (SKILL.md principle 8). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives: the evidence behind it (source section, stated business expectation, domain practice, risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting your decision) / Decided - pending application (decided on a third-run discovery; the next request applies it) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it. |

---

## Open Items

### OI-01: Partial refunds as a separate use case

- **Where:** 06b
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Historical item from BRD v1.0; its decision record is in [decision-log.md](./decision-log.md#q-01---partial-refunds-as-a-separate-use-case).

---

### OI-02: How a customer proves who they are

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-02](./decision-log.md#q-02---how-a-customer-proves-who-they-are).

---

### OI-03: Refund requests made in person at a branch after go-live

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-03](./decision-log.md#q-03---refund-requests-made-in-person-at-a-branch-after-go-live).

---

### OI-04: Return of the items

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-04](./decision-log.md#q-04---return-of-the-items).

---

### OI-05: "Web and Mobile": a mobile app or a phone browser

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-05](./decision-log.md#q-05---web-and-mobile-a-mobile-app-or-a-phone-browser).

---

### OI-06: Refund rules from store refund policy v3 are not in the BRD

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-06](./decision-log.md#q-06---refund-rules-from-store-refund-policy-v3-are-not-in-the-brd).

---

### OI-07: Preconditions that block their own exception flows

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-07](./decision-log.md#q-07---preconditions-that-block-their-own-exception-flows).

---

### OI-08: The customer's email address and mobile number are never collected

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-08](./decision-log.md#q-08---the-customers-email-address-and-mobile-number-are-never-collected).

---

### OI-09: Purchases not paid by card

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-09](./decision-log.md#q-09---purchases-not-paid-by-card).

---

### OI-10: How the refund amount is worked out

- **Where:** 06a / UC-01 Main Flow step 4; 06b / UC-04 BR-2; 02 / Facts 2 (seasonal sales)
- **Type:** Ambiguity
- **Concern:** Step 4 "shows the refund amount", but no rule says how the amount is worked out. Seasonal sales (02 Facts 2) mean many receipts carry discounts, including discounts on the whole receipt or on a group of items. If one item from such a group comes back, the amount could be the full price, the price paid, or a share of the discount. The partial-refund limit in UC-04 BR-2 ("less than that item's requested amount") depends on this number too.
- **Options:**
  - **A.** The amount is what the customer paid for each selected item after discounts, as the receipt records it - fair, and tied to a record both sides trust; needs a rule for receipt-wide discounts.
  - **B.** The amount is each item's full price - simple; pays back more than the customer paid on discounted purchases.
- **Recommended Answer:** Option A. Add to UC-01 Business Rules: "The refund amount is the sum of what the customer paid for each selected item, after discounts, as the receipt shows. **[NEEDS CLARIFICATION: When a discount applies to the whole receipt or to a group of items, how is the amount paid for one item worked out?]**" Add to UC-01 Acceptance Criteria: "Given a receipt with a discounted item, when the customer selects it, then the refund amount equals the price paid for it, not its full price."
- **Why:** Paying back more than was paid loses money; paying less causes complaints (01 Background: 18% of complaints are about refunds). A ties the amount to the receipt. Tradeoff: the discount split still needs an owner rule, possibly from store refund policy v3.
- **Status:** Open

---

### OI-11: The last day of the 30-day refund window

- **Where:** 06a / UC-01 BR-1, E1 and Acceptance Criteria; 02 / Glossary (Refund window)
- **Type:** Corner case
- **Concern:** "Within 30 days of purchase" does not say whether day 30 is inside the window, how days are counted, or which moment counts: when the customer enters the receipt (step 2) or when they submit (step 6). The acceptance criteria test only days 10 and 31. A customer who starts on day 30 and submits after midnight can be accepted under one reading and refused under another.
- **Options:**
  - **A.** Count calendar days, keep day 30 inside the window, and check at submission - one clear rule with a testable boundary; the day-count start needs the owner.
  - **B.** Check only at receipt entry (step 2) - kinder to customers who start late; a request can then be submitted after the window.
- **Recommended Answer:** Option A. Replace UC-01 BR-1 with: "A customer can submit a refund request until the end of the 30th calendar day after the purchase date, by the branch's local date. The system checks this when the customer submits (step 6), not when the branch manager decides. **[NEEDS CLARIFICATION: Does the 30-day refund window count the purchase day as day 0 or as day 1?]**" Add to UC-01 E1: "E1 also applies at step 6 if the window closes while the customer is filling in the request." Add to UC-01 Acceptance Criteria: "Given a purchase exactly 30 days old, when the customer submits, then the request is recorded as Submitted."
- **Why:** The window is the main eligibility rule, and day 30 is exactly where disputes happen. Checking at submission means the manager's decision time never costs the customer their refund. Tradeoff: the day-count start needs the owner or store refund policy v3.
- **Status:** Open

---

### OI-12: When an item can be requested again

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-12](./decision-log.md#q-12---when-an-item-can-be-requested-again).

---

### OI-13: Receipts cannot be checked

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-13](./decision-log.md#q-13---receipts-cannot-be-checked).

---

### OI-14: Which messages the customer gets, and how

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-14](./decision-log.md#q-14---which-messages-the-customer-gets-and-how).

---

### OI-15: A message does not reach the customer

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-15](./decision-log.md#q-15---a-message-does-not-reach-the-customer).

---

### OI-16: The customer is not told about a partial approval

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-16](./decision-log.md#q-16---the-customer-is-not-told-about-a-partial-approval).

---

### OI-17: What the branch manager sees before deciding

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-17](./decision-log.md#q-17---what-the-branch-manager-sees-before-deciding).

---

### OI-18: The customer cancels while the branch manager is deciding

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-18](./decision-log.md#q-18---the-customer-cancels-while-the-branch-manager-is-deciding).

---

### OI-19: A payout that never succeeds

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-19](./decision-log.md#q-19---a-payout-that-never-succeeds).

---

### OI-20: No decision time limit, and no cover when the branch manager is away

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-20](./decision-log.md#q-20---no-decision-time-limit-and-no-cover-when-the-branch-manager-is-away).

---

### OI-21: A branch manager deciding on their own refund request

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-21](./decision-log.md#q-21---a-branch-manager-deciding-on-their-own-refund-request).

---

### OI-22: Business Objective 1 is not measured

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-22](./decision-log.md#q-22---business-objective-1-is-not-measured).

---

### OI-23: No speed expectation, so NFR-03 cannot be tested

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-23](./decision-log.md#q-23---no-speed-expectation-so-nfr-03-cannot-be-tested).

---

### OI-24: No record of who decided what

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-24](./decision-log.md#q-24---no-record-of-who-decided-what).

---

### OI-25: How long refund data is kept

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-25](./decision-log.md#q-25---how-long-refund-data-is-kept).

---

### OI-26: Laws and standards the portal must meet are not named

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-26](./decision-log.md#q-26---laws-and-standards-the-portal-must-meet-are-not-named).

---
### OI-27: Alternate and exception flows with no acceptance criterion

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-27](./decision-log.md#q-27---alternate-and-exception-flows-with-no-acceptance-criterion).

---

### OI-28: Point-of-Sale Records missing from UC-01

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-28](./decision-log.md#q-28---point-of-sale-records-missing-from-uc-01).

---

### OI-29: Planned maintenance and the 2-hour disruption limit

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-29](./decision-log.md#q-29---planned-maintenance-and-the-2-hour-disruption-limit).

---

### OI-30: Partial approval of a request with several items

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-30](./decision-log.md#q-30---partial-approval-of-a-request-with-several-items).

---

### OI-31: Payouts still being retried at the end of a month

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-31](./decision-log.md#q-31---payouts-still-being-retried-at-the-end-of-a-month).

---

### OI-32: A second approval above a refund amount

- **Where:** 06b / UC-04 BR-7, BR-8, step 8, AC-1 and AC-16; 03 / Refund request lifecycle and Decision record; 04 / Personas; 05 / User Journeys and Use Case Summary; 07; 10 / NFR-01 and NFR-04 (raised by business review BO-08)
- **Type:** Risk
- **Concern:** A branch manager can approve a refund of any amount alone. The only control before the payout is UC-04 BR-6: nobody decides on their own request. A payout to a card cannot be taken back, so a wrong or abusive approval of a large refund is found only after the money is gone. Chain retailers often ask a second person, such as an area manager, to approve refunds above an amount (domain practice named by the review of 2026-10-10, not a project fact). No source names an amount or a role above the branch manager.
- **Options:**
  - **A.** A refund above a limit needs a second approval before the payout is sent; the owner names the limit and the role - control before the money leaves; adds a step for large refunds, a persona with its own use case and a matrix column, and slows those refunds against Business Objective 1.
  - **B.** No second approval: the branch manager approves any amount alone, and the decision record (03) shows who approved what - no new role and the fastest payout; a wrong approval is found only after the payout.
- **Recommended Answer:** Option A, with the limit and the role the owner gives. Replace UC-04 BR-7 with: "A refund whose approved amount is above [the limit the owner sets] needs a second approval by [the role the owner names] before the system sends the payout." UC-04 step 8 and the last sentence of UC-04 BR-8 send the payout of such a refund only after the second approval. The Given of UC-04 AC-1 becomes "a Submitted request at or below [the limit] with no card dispute", and the Given of UC-04 AC-16 becomes "a disputed card payment, for a request at or below [the limit], whose dispute the bank refuses". Add to UC-04 the criterion "Given a Submitted request, when the branch manager approves an amount above [the limit], then no payout is sent until [the role the owner names] gives the second approval." In [10 / NFR-04](./10-nfrs.md#non-functional-requirements), [the role the owner names] is added to those who can see a request, and the UC-04 BR-7 link leaves the list of open questions. In [10 / NFR-01](./10-nfrs.md#non-functional-requirements), add: "A payout that waits for the second approval under [06b / UC-04 BR-7](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) at the end of a month counts as waiting, not missing." In [03 / Decision record](./03-definitions-and-domain-concepts.md#decision-record), the record also keeps who gave the second approval, and the date and time. In [03 / Refund request lifecycle](./03-definitions-and-domain-concepts.md#refund-request-lifecycle), add: "An approved request above [the limit] waits for the second approval before the payout is sent ([06b / UC-04 BR-7](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)). **[NEEDS CLARIFICATION: What happens to an approved request above [the limit] when [the role the owner names] refuses the second approval?]**" Add that role as a persona in 04, its journey in 05, its use case "Give a Second Approval" with all nine sections in the next free 06 chunk, a Use Case Summary row and a matrix column, and mark each unsettled step for the product owner.
- **Why:** The BRD already prevents a risk before the payout rather than finding it after (Q-21: a payout cannot be undone), and the review names value limits as normal retail practice. The limit and the role are values no source gives, so they must come from the owner. In NFR-01, a payout held for the second approval counts as waiting, not missing. NFR-01 already counts a payout still being tried again as delayed (Q-31) and a payout held for a card dispute as waiting (Q-48). The decision record keeps both approvers, as it keeps both staff members for a payout recorded by hand (Q-40). Tradeoff: large refunds wait for a second person, and a slow second approver does not show in NFR-01.
- **Status:** Open

---

### OI-33: The target share of refund complaints

- **Where:** 01 / Business Objective 4, first marker (raised by business review BO-09)
- **Type:** Gap
- **Concern:** Business Objective 4 says complaints about slow or lost refund requests fall from 18% of all complaints to customer care, but it gives no target. Without one, nobody can say after go-live whether the portal cut the complaints that are the reason for the project (01 / Background). No source gives a target figure.
- **Options:**
  - **A.** The owner sets a target share now - the objective can pass or fail; needs a figure no source gives.
  - **B.** The share is measured every month from go-live and the target is set later - no guessed figure; the objective cannot be checked at go-live.
- **Recommended Answer:** Option A. Replace the first marker in Business Objective 4 with the target share the owner sets: "... fall from 18% of all complaints to customer care to [the owner's figure]% by ...".
- **Why:** An objective with no target cannot pass or fail (writing-style.md rule 5), and the 18% starting point already exists. The documents give no evidence for a figure, so only the owner can set it. Tradeoff: the owner commits to a number before go-live.
- **Status:** Open

---

### OI-34: The date for the refund-complaint target

- **Where:** 01 / Business Objective 4, second marker (raised by business review BO-09)
- **Type:** Gap
- **Concern:** Business Objective 4 has no date by which the complaint target must be reached. The go-live date is not fixed either, and branches may start at different times (04 / Project Scope). Without a date, the objective can never be called missed.
- **Options:**
  - **A.** A period counted from the day the last branch starts using the portal, for a number of months the owner sets - stays valid if go-live moves; needs a figure no source gives.
  - **B.** A calendar date the owner sets - easy to read; must change whenever go-live moves.
- **Recommended Answer:** Option A, with the number of months the owner sets. Replace the second marker in Business Objective 4 with: "[the owner's number] months after the last branch starts using the portal".
- **Why:** The go-live date and the branch start order are still open (04 / Project Scope), so a period tied to the start keeps the objective fair whatever date is chosen. The number of months is a value no source gives. Tradeoff: the objective has no fixed calendar date.
- **Status:** Open

---

### OI-35: The target share of refund requests made through the portal

- **Where:** 01 / Business Objective 5, first marker; 04 / Project Scope (raised by business review BO-09)
- **Type:** Gap
- **Concern:** Business Objective 5 says the share of refund requests made through the portal, rather than at a branch, reaches a target, but gives no figure. The share can be counted only if branches still take requests in person after go-live, which is still open (04 / Project Scope, TD-13). No source gives a target figure.
- **Options:**
  - **A.** The owner sets a target share now - the objective can pass or fail; needs a figure no source gives, and the in-person question answered.
  - **B.** The share is measured every month from go-live and the target is set later - no guessed figure; the objective cannot be checked at go-live.
- **Recommended Answer:** Option A. Replace the first marker in Business Objective 5 with the target share the owner sets: "... reaches [the owner's figure]% by ...".
- **Why:** The review found no measure of portal use (BO-09), and an objective with no target cannot pass or fail (writing-style.md rule 5). The documents give no evidence for a figure. Tradeoff: the owner commits to a number, and the figure means something only once TD-13 is answered.
- **Status:** Open

---

### OI-36: The date for the portal-share target

- **Where:** 01 / Business Objective 5, second marker (raised by business review BO-09)
- **Type:** Gap
- **Concern:** Business Objective 5 has no date by which the portal-share target must be reached. As for Business Objective 4, the go-live date and the branch start order are open (04 / Project Scope).
- **Options:**
  - **A.** A period counted from the day the last branch starts using the portal, for a number of months the owner sets - stays valid if go-live moves; needs a figure no source gives.
  - **B.** A calendar date the owner sets - easy to read; must change whenever go-live moves.
- **Recommended Answer:** Option A, with the number of months the owner sets. Replace the second marker in Business Objective 5 with: "[the owner's number] months after the last branch starts using the portal".
- **Why:** Same reason as OI-34: a period tied to the start stays fair while the go-live date is open. The number of months is a value no source gives. Tradeoff: no fixed calendar date.
- **Status:** Open

---

### OI-37: A Paid payout that the card issuer sends back

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-37](./decision-log.md#q-37---a-paid-payout-that-the-card-issuer-sends-back).

---

### OI-38: A customer who also disputes the card payment

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-38](./decision-log.md#q-38---a-customer-who-also-disputes-the-card-payment).

---

### OI-39: Who handles payout exceptions and the monthly check

- **Where:** 04 / Personas, payout marker; 03 / Decision record; 10 / NFR-01; 10 / NFR-04 (raised by business review SME-07)
- **Type:** Gap
- **Concern:** Some money work has no owner in the BRD: dealing with payouts that stop or keep failing, recording by hand whether such a payout was paid, and checking every month that no payout is missing or paid twice (NFR-01). 03 / Decision record names "the staff member who records a payout result by hand", but no persona or team does this work. Without an owner, nobody answers for NFR-01.
- **Options:**
  - **A.** A team the owner names does this work outside the portal's personas; 04 names the team and no persona is added - quick; the staff who record payouts by hand have no use case, screen or matrix column.
  - **B.** A Refunds Back Office persona with use cases for recording payout results and the monthly check - full tracing and testing; a new persona, use cases and a matrix column whose steps no source states.
- **Recommended Answer:** Option A, with the team the owner names. Replace the 04 / Personas payout marker with: "[The team the owner names] handles payouts that stop or keep failing, records by hand whether such a payout was paid, and checks every month that no payout is missing or paid twice ([NFR-01](./10-nfrs.md#non-functional-requirements))." In [10 / NFR-04](./10-nfrs.md#non-functional-requirements), the note after the 04 / Personas link no longer names the payout team; if the note then names nobody, the 04 / Personas link and its note are removed. If the owner wants this work inside the portal, Option B applies instead: NFR-04 names the new persona among those who can see a request, and the note after the 04 / Personas link changes as above.
- **Why:** The review found the work but no source names the team that does it; A records the owner without inventing a persona's steps. The team's name is a fact only the owner can give. Tradeoff: the manual recording stays outside the use cases and the matrix.
- **Status:** Open

---

### OI-40: A second person for a payout recorded by hand as paid

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-40](./decision-log.md#q-40---a-second-person-for-a-payout-recorded-by-hand-as-paid).

---

### OI-41: What the branch manager does when told a payout still fails

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-41](./decision-log.md#q-41---what-the-branch-manager-does-when-told-a-payout-still-fails).

---

### OI-42: Refund windows for some periods or item types

- **Where:** 06a / UC-01 BR-9, BR-1 and E1 (raised by business review SME-09)
- **Type:** Gap
- **Concern:** UC-01 applies one 30-day window to every purchase. Many retailers give a longer window for purchases in the seasonal sales (02 Facts 2) or for some item types. The branches follow store refund policy v3 today (12 / Appendix), and it is not attached. If the policy sets other windows, the portal refuses requests a branch would accept and sends those customers back to the branch.
- **Options:**
  - **A.** Carry the windows of store refund policy v3 into UC-01 BR-1 and BR-9 - the portal follows the branch rules; needs the policy.
  - **B.** Keep one 30-day window for every purchase - simple; customers with a longer window under the policy are sent back to the branch.
- **Recommended Answer:** Option A. Once store refund policy v3 is attached (TD-31), replace UC-01 BR-9 with the window it sets for each period or item type, and add one acceptance criterion for each window.
- **Why:** The branches follow the policy today (12 / Appendix), so the portal must not refuse what a branch accepts. Tradeoff: the rule waits for the policy.
- **Status:** Open

---

### OI-43: The refund reason list and faulty items

- **Where:** 06a / UC-01 BR-10 and step 3 (raised by business review SME-09)
- **Type:** Gap
- **Concern:** At step 3 the customer gives a reason in their own words. Faulty items often follow other rules than a change of mind: another window, or a repair or replacement instead of a refund. Consumer law may also give rights for faulty items (UC-01 BR-8, TD-19). With no reason list, the portal cannot apply a different rule to a faulty item.
- **Options:**
  - **A.** A reason list that separates a change of mind from a faulty item, with the faulty item's window and remedy taken from store refund policy v3 and the consumer law - the right rule for each reason; needs the policy and the law.
  - **B.** Keep the free reason and one rule for all - simple; faulty items follow the change-of-mind rule.
- **Recommended Answer:** Option A. Once store refund policy v3 is attached (TD-31) and the consumer-law question (TD-19) is answered, change UC-01 step 3 to "The customer selects the items and picks a reason from the list in BR-10.", and replace BR-10 with the reasons and the window and remedy for a faulty item.
- **Why:** The branches follow the policy today (12 / Appendix), and a legal right for faulty items would override the 30-day rule. Tradeoff: the rule waits for the policy and the law.
- **Status:** Open

---

### OI-44: How the branches start using the portal

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-44](./decision-log.md#q-44---how-the-branches-start-using-the-portal).

---

### OI-45: Who follows the objectives across all branches

- **Where:** 09 / Reporting / Analytics, cross-branch marker; 01 / Business Objectives; Scope proposal 2 below (raised by business review PM-03)
- **Type:** Gap
- **Concern:** The objectives in 01 cover all 40 branches, but the only report (09) shows one branch to its branch manager. The Operations Lead reviewed and the Head of Retail approved BRD v1.0 (00 Changes Log), but no section says who follows the objectives across all branches, or where. Without a reader and a report, nobody can say whether the portal met its objectives.
- **Options:**
  - **A.** A portal-wide refund report in 09 for the reader the owner names, who is added as a persona that can see every branch's figures - the objectives are followed in one place; a new persona with access across branches (Scope proposal 2).
  - **B.** No portal-wide report in this release: the reader the owner names combines the 40 branch refund reports - no new persona; manual work and no single view.
- **Recommended Answer:** Option A, with the reader the owner names. Add to 09 a row: "Portal-wide refund report | The figures of the branch refund report for all 40 branches together and for each branch | [the reader the owner names] | **[NEEDS CLARIFICATION: How often does [the reader the owner names] get the portal-wide refund report?]** | **[NEEDS CLARIFICATION: In what format does [the reader the owner names] get the portal-wide refund report: a screen in the portal, an export file, or both?]**". Add the reader as a persona in 04 with its journey in 05, its use case "View the Portal-wide Refund Report" with all nine sections in the next free 06 chunk, a Use Case Summary row and a matrix column, mark each unsettled step for the product owner, and remove the 09 cross-branch marker.
- **Why:** The objectives are portal-wide (01), so a view across branches is the only way to check them, as Scope proposal 2 says. No source says who owns the objectives; the 00 Changes Log only names two possible readers. Tradeoff: a new role that sees every branch's figures.
- **Status:** Open

---

### OI-46: When the wishlist items start

- **Where:** 12 / Wishlist, marker; 06b / UC-04 Future Enhancements (raised by business review PM-09)
- **Type:** Gap
- **Concern:** The wishlist items (online-shop refunds, a customer mobile app) and bulk approval of small refunds have no target release and no starting condition. Nobody can plan or budget them, and customers who ask about an app get no answer.
- **Options:**
  - **A.** The owner gives each item a target release or a starting condition - the items can be planned; needs the owner's plans.
  - **B.** The items stay undated, and the product owner reviews the list after go-live - no commitment now; nobody can plan them.
- **Recommended Answer:** Option A. Replace the 12 / Wishlist marker with one line per item: "[item]: [the target release or starting condition the owner sets]".
- **Why:** The review found no horizon for these items (PM-09), and only the owner knows the plans. Tradeoff: the owner commits to a release or a condition for each item.
- **Status:** Open

---

### OI-47: A view of refund requests for customer care

- **Where:** 04 / Personas, customer care marker; 10 / NFR-04; Scope proposal 1 below (raised by business review PM-11)
- **Type:** Gap
- **Concern:** 18% of complaints to customer care are about slow or lost refund requests (01 / Background), yet NFR-04 lets only the customer, the branch manager and the staff who record or confirm a payout result by hand see a request. Customer care agents answer refund calls without seeing the request. Giving them a view means another role sees customer personal data, and NFR-04 ties personal data to a data-protection law that no section names yet (TD-26).
- **Options:**
  - **A.** Customer care agents get a read-only view of a customer's refund requests: a Customer Care Agent persona, its journey, a use case "View a Customer's Refund Requests" with all nine sections, a matrix column and an NFR-04 change - agents answer calls with the facts; another role sees personal data, which needs a legal basis.
  - **B.** No view in this release; it goes on the Wishlist - no change to NFR-04; agents keep answering calls without the facts.
- **Recommended Answer:** Option A, once the data-protection law (TD-26) is named and allows the agents to see the personal data. Replace the 04 / Personas customer care marker with the row "Customer Care Agent | Answers customer calls about refunds | See a customer's refund requests to answer their questions | Read only, all branches"; add its journey to 05, the use case with all nine sections in the next free 06 chunk, a Use Case Summary row and a matrix column; add customer care agents to the NFR-04 measure, and remove customer care from the note after its 04 / Personas link (if the note then names nobody, the link and its note are removed); mark each unsettled step (how an agent finds a customer's requests, how the caller proves who they are) for the product owner.
- **Why:** The complaints the project exists to cut reach customer care (01 / Background), so a view helps them most. The legal basis for the access is a fact only the legal owner can give. Tradeoff: wider access to personal data.
- **Status:** Open

---

### OI-48: How NFR-01 counts a payout held for a card dispute

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-48](./decision-log.md#q-48---how-nfr-01-counts-a-payout-held-for-a-card-dispute).

---

### OI-49: Loyalty Points as a receiver in the use cases

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-49](./decision-log.md#q-49---loyalty-points-as-a-receiver-in-the-use-cases).

---

### OI-50: Refund outcomes before Loyalty Points starts

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log). Decision record: [decision-log.md / Q-50](./decision-log.md#q-50---refund-outcomes-before-loyalty-points-starts).

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-21 | 06b / UC-04 A1; 05 / Use Case Summary (UC-05 merged into UC-04) | Accepted recommendation |
| OI-02 | 2026-10-10 | 03 / Customer identity; 06a / UC-01, UC-02, UC-03 Preconditions; 06a / UC-03 BR-2; 07 footnote 2 | Accepted recommendation |
| OI-03 | 2026-10-10 | 04 / Project Scope | Accepted recommendation |
| OI-04 | 2026-10-10 | 03 / Refund request / Overview | Accepted recommendation |
| OI-05 | 2026-10-10 | 05 / Use Case Summary, 06a and 07 (UC-02 renamed); 11 / Responsive Design; 12 / Wishlist | Accepted recommendation |
| OI-06 | 2026-10-10 | 06a / UC-01 A2 and BR-3; 12 / Appendix | Accepted recommendation |
| OI-07 | 2026-10-10 | 06a / UC-01 and UC-02 Preconditions | Accepted recommendation |
| OI-08 | 2026-10-10 | 06a / UC-01 step 5, E3 and BR-4 | Accepted recommendation |
| OI-09 | 2026-10-10 | 06a / UC-01 E4 and BR-5; 08 / Point-of-Sale Records | Accepted recommendation |
| OI-12 | 2026-10-10 | 06a / UC-01 BR-2, BR-6, BR-7 and A1 | Accepted recommendation |
| OI-13 | 2026-10-10 | 06a / UC-01 E5 and AC-3 | Accepted recommendation |
| OI-14 | 2026-10-10 | 03 / Customer messages; 06b / UC-04 A2 | Accepted recommendation |
| OI-15 | 2026-10-10 | 06a / UC-01 step 7 and AC-4; 03 / Customer messages | Accepted recommendation |
| OI-16 | 2026-10-10 | 06a / UC-02 step 4 and AC-2; 06b / UC-04 A1 | Accepted recommendation |
| OI-17 | 2026-10-10 | 06b / UC-04 steps 3-5 and BR-4 | Accepted recommendation |
| OI-18 | 2026-10-10 | 06b / UC-04 E2 and AC-3 | Accepted recommendation |
| OI-19 | 2026-10-10 | 06b / UC-04 E1 | Accepted recommendation |
| OI-20 | 2026-10-10 | 04 / Personas; 06b / UC-04 step 2 and BR-5; 03 / Branch ownership | Accepted recommendation |
| OI-21 | 2026-10-10 | 06b / UC-04 BR-6 and AC-4 | Accepted recommendation |
| OI-22 | 2026-10-10 | 09 / Branch refund report | Accepted recommendation |
| OI-23 | 2026-10-10 | 10 / NFR-03, NFR-05 | Accepted recommendation |
| OI-24 | 2026-10-10 | 03 / Decision record; 06b / UC-04 AC-5 | Accepted recommendation |
| OI-25 | 2026-10-10 | 10 / NFR-06; 06a / UC-02 BR-2 | Accepted recommendation |
| OI-26 | 2026-10-10 | 10 / NFR-04; 06a / UC-01 BR-8; 11 / Accessibility | Accepted recommendation |
| OI-27 | 2026-10-10 | 06a / UC-01 AC-5 to AC-9, UC-02 AC-3, UC-03 AC-2; 06b / UC-04 AC-6 to AC-8 | Accepted recommendation |
| OI-28 | 2026-10-10 | 06a / UC-01 Supporting Actors, E5, AC-3 | Accepted recommendation |
| OI-29 | 2026-10-10 | 10 / NFR-02 | Accepted recommendation |
| OI-30 | 2026-10-10 | 06b / UC-04 A1, BR-2 and AC-9 | Accepted recommendation |
| OI-31 | 2026-10-10 | 10 / NFR-01 | Accepted recommendation |
| OI-37 | 2026-10-10 | 03 / Refund request lifecycle; 06b / UC-04 E1 and AC-11; 08 / Loyalty Points | Accepted recommendation |
| OI-38 | 2026-10-10 | 06b / UC-04 BR-8, E3, AC-12 and AC-13; 03 / Refund request lifecycle, Customer messages and Decision record; 08 / Payment Provider; 02 / Glossary | Accepted recommendation |
| OI-40 | 2026-10-10 | 03 / Decision record; 04 / Personas, payout marker | Accepted recommendation |
| OI-41 | 2026-10-10 | 06b / UC-04 E1; 04 / Personas, payout marker | Accepted recommendation |
| OI-44 | 2026-10-10 | 04 / Project Scope; 06a / UC-01 E6 and AC-10 | Accepted recommendation |
| OI-48 | 2026-10-10 | 10 / NFR-01 | Accepted recommendation |
| OI-49 | 2026-10-10 | 06a / UC-03 Supporting Actors, BR-3 and AC-3; 06b / UC-04 Supporting Actors, BR-9 and AC-14 | Accepted recommendation |
| OI-50 | 2026-10-10 | 04 / Project Scope and In Scope; 06a / UC-03 BR-3 and AC-4; 06b / UC-04 BR-9 and AC-17 | Accepted recommendation |

---

## Reviewer Notes

### Coverage record

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Every In Scope and Out of Scope item in 04 against the journeys (05), the use cases (06a, 06b), 01 Background, 02 Assumptions and 12 Wishlist | 4 (OI-03, OI-04, OI-05, OI-09) | Two optional scope candidates are recorded below as Scope proposals, not as Open items. |
| Use-case exception coverage | Every step where an actor decides or an outside party is involved: UC-01 steps 2, 4, 5, 6; UC-02 steps 2, 4; UC-03 steps 2 to 5; UC-04 steps 2 to 7; preconditions against flows | 10 (OI-07, OI-08, OI-10, OI-11, OI-12, OI-13, OI-16, OI-17, OI-18, OI-19) | UC-03 E1 already covers the race from the customer side; OI-18 adds the manager side. |
| Matrix consistency | 07 rows against the 05 Use Case Summary (UC-05 merged and correctly left out); 07 columns against 04 Personas; every Yes against the UC actor fields; external parties not shown as columns; footnotes for conditional access | No issue found | Editorial: footnote ² cites UC-02 BR-1 for the UC-03 row, but UC-03 has no own-requests rule of its own. OI-02's Recommended Answer adds it. |
| NFRs | NFR-01 to NFR-04 for a business measure that can pass or fail; missing quality areas against the skeleton (chunks/10-nfrs.md: performance, usability) | 2 (OI-23, OI-25) | OI-24 (decision record) also feeds NFR-01; it is counted under Security / privacy. NFR-02 does not say whether planned maintenance counts toward the 2 hours; left as a note because it is a measurement detail, not a missing requirement. |
| Integrations | Each partner in 08 (CardPay Ltd, MsgHub, Point-of-Sale Records) failing, from the customer's or manager's point of view; information each must supply against what the use cases need | 3 (OI-13, OI-15, OI-19) | OI-08 and OI-09 also add information that 08 does not list today (contact details, how the purchase was paid). |
| Security / privacy | How a customer is identified; who can see what (04 Access Level, NFR-04); segregation of duties for payouts; record of decisions | 3 (OI-02, OI-21, OI-24) | |
| Data lifecycle | Retention and deletion of requests, personal data and payout records; data moving in at go-live | 1 (OI-25) | Paper requests open at go-live are asked in OI-03. |
| Regulatory / compliance | Data protection, consumer refund rights, accessibility | 1 (OI-26) | No source names a law or standard; all three are marker questions, not project facts. |
| Business objectives and reporting | Each objective in 01 against a measure in 09 or a rule in the use cases | 2 (OI-20, OI-22) | |
| Conflicts between sections | 01 and 04 promises against the use-case steps; 03 lifecycle against 06a and 06b; 11 against 06a | 2 (OI-14, OI-05) | OI-07 also covers preconditions that conflict with flows in the same use case. |
| Multi-tenancy | Whether the sources describe more than one business or brand | No issue found | One retailer with 40 branches. The branch is an ownership boundary, already covered by 03 / Branch ownership and UC-04 BR-1; no tenant concept appears in any source. |
| Technical language | Every body chunk for technology names, protocols or implementation terms | No issue found | "SMS" is a business term and is defined in 02. See the process-vocabulary note below. |
| Duplication | The same fact in two or more chunks; source content restated instead of linked | No blocking issue; 1 related item (OI-07) | See the duplication notes below. |
| Plain language | Vague words that hide a requirement; long or complex sentences | Covered inside OI-19 ("tries again"), OI-20 ("decide quickly") and OI-23 ("no slowdown customers notice") | Editorial cases are listed below. |
| Migration fidelity | Every v1.0 chunk (source-snapshot-v1.0/) against v1.1, by line comparison | No requirement lost or changed | Metadata and ID notes are listed below. |

### Scope proposals

- **Scope proposal 1 - Customer care view of refund requests.** Source: 01 Background ("18% of complaints to customer care are about slow or lost refund requests"); 10 / NFR-04 lets only the customer and the branch manager see a request, so customer care cannot answer those complaints. Recommendation: the owner decides whether customer care agents get a view of a customer's requests. If adopted, add a Customer Care Agent persona to 04, its journey to 05, a use case "View a Customer's Refund Request" with all nine sections in a new 06c, a Use Case Summary row, a matrix column, and a change to the NFR-04 measure. Tradeoff: faster answers to complaints against wider access to personal data. Now asked as [OI-47](#oi-47-a-view-of-refund-requests-for-customer-care).
- **Scope proposal 2 - Portal-wide refund report.** Source: 01 Business Objectives 1 and 2 are portal-wide; 00 Changes Log names the Operations Lead and the Head of Retail as reviewer and approver; 09 serves only the Branch Manager. Recommendation: adopt only if the owner wants the objectives tracked in the portal. It needs a reader with access across branches, which is a new persona and a matrix decision. Tradeoff: central tracking of the objectives against a new role that sees every branch. Now asked as [OI-45](#oi-45-who-follows-the-objectives-across-all-branches).

### Notes

- **Flow IDs proposed in this review.** The new flow IDs assume every item is accepted: UC-01 A2 (OI-06), E3 (OI-08), E4 (OI-09), E5 (OI-13); UC-04 E2 (OI-18), E3 (OI-04, only if returns are required). Renumber when applying if some items are rejected. OI-17 renumbers UC-04 steps; OI-18 uses today's step numbers.
- **Migration fidelity - version headers.** The master's VERSIONING rule says a chunk carries the version in which its content last changed. Chunks 01, 03, 04, 06a and 06b changed in v1.1 (rewritten Executive Summary; new Overview sentence in 03; the Out of Scope wording in 04; the structure list, the mockup labels and the Supporting Actors label in 06a and 06b) but still show VERSION 1.0.
- **Migration fidelity - mockup IDs.** 06a now says "Mockup MK-01 (screen SCR-01 ...)" and "Mockup MK-02 (screen SCR-02 ...)". v1.0 and its to-do used SCR-01 and SCR-02 as the mockup IDs, and 11 / Screens uses only SCR IDs. MK-01 and MK-02 are new names for the same screens; writing-style.md rule 6 asks for one term for one thing. Simpler: "Screen SCR-01 (refund request form). Figma: ..." as in v1.0.
- **Migration fidelity - source evidence for existing markers.** These do not answer the markers, because delivery chunks never add requirements, but the owner may find them useful. For the 11 marker on the branch manager's devices: source-snapshot-v1.0/14-todo.md, Step 4, row MK-03 lists breakpoints "Desktop, tablet, mobile", approved by the PM on 2026-09-24. For the 11 currency marker: source-snapshot-v1.0/16-uat-bat-test-cases.md, TC-UIX-01 ("Every amount shows EUR") and TC-DEC-01 ("50.00 EUR").
- **Migration fidelity - Technical Inputs.** v1.0's line "Source technical mandates, parked verbatim for the SDD. Not BRD requirements." was dropped from 12. The table still cites "SoW section 4.2", but the Statement of Work is not listed in 12 / Appendix. Simpler: add an Appendix row for the SoW, or state that it is not attached.
- **Duplication.** The own-branch rule appears in 03 / Branch ownership, 04 / Personas (Access Level) and UC-04 BR-1, and the own-requests rule in 04, UC-02 BR-1 and NFR-04. The wording agrees, so nothing conflicts today. Simpler: keep 03 as the home and let UC-04 BR-1 link to it. 01 Executive Summary, 04 Project Scope and 11 Summary restate the same facts because the template asks for each.
- **Plain language, editorial.** 06b / UC-04 E1 is one 31-word sentence with four ideas. Simpler: "E1 - Payout fails: At step 7, the payment provider refuses the payout. The request stays Approved. The system tries again. If the payout still fails after one day, the system tells the branch manager." 02 / Dependencies: the Notes cell repeats the Dependency cell; simpler: "None." 12 / Appendix rows 3 and 4 use process words ("once the delivery gate opens", "chunk 15") and long brackets; simpler: "Implementation plan for BRD v1.0. Kept for reference. It lists TASK-01 to TASK-03." and the same pattern for the test cases. 11 / Screens says "It is mockup MK-03 in the to-do"; simpler: "Its mockup is MK-03."

<!-- MASTER: refunds-portal-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
