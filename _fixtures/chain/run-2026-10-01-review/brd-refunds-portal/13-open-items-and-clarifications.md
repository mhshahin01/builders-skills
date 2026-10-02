<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: all
PART OF: BRD - Refunds Portal
-->

# Open Items & Clarifications

## Open Items

Items raised by the business review of 2026-10-01 name their review point and the decision log of that review, [review-comments-tracker.md](../review-comments-tracker.md). Open: OI-03, OI-06 to OI-10, OI-13, OI-15 to OI-18, OI-20, OI-22, OI-24, OI-27, OI-32.

### OI-01: Partial refunds as a separate use case

- **Where:** 06b
- **Status:** Accepted - applied

### OI-02: The customer is not told when a payout keeps failing

- **Where:** 06b / UC-04 E1, AC-2; 06a / UC-02 step 4 (raised by the business review, BO-03)
- **Type:** Missing scenario
- **Concern:** UC-04 E1 told only the branch manager when a payout still failed after one day. The customer, whom 04 Project Scope and 05 step 4 promise to tell the outcome at each step, saw a plain Approved and heard nothing.
- **Options:**
  - **A.** Tell the customer by email and SMS, and show the delay on the request - meets the every-step rule; one more message pair for a failing payout.
  - **B.** Show the delay on the request only - no message; the customer learns it only by looking.
- **Recommended Answer:** A. UC-04 E1: "At step 7, if the payment provider refuses the payout, the request stays Approved and the system tries again. If it still fails one day after the approval, the branch manager is told, and the customer is told by email and SMS that the payout is delayed and that the system keeps trying." UC-04 AC-2: "Given a payout that still fails one day after the approval, then the branch manager is told, and the customer is told that the payout is delayed." UC-02 step 4 adds: "While the payout of an approved request is delayed (UC-04 E1), it also shows that the payout is delayed."
- **Why:** 04 Project Scope and 05 step 4 tell the customer the outcome at each step, and the branch manager alone has no lever to act on a failing payout. The tradeoff is one more message pair for each failing payout.
- **Status:** Accepted - applied (business review BO-03, 2026-10-01)

### OI-03: An end for a payout the payment provider refuses for good

- **Where:** 06b / UC-04 E1; 02 / Assumptions / Constraints 2; 04 / Out of Scope (cash refunds) (raised by the business review, BO-03; it carries the SDD follow-up of SDD CL-09)
- **Type:** Missing scenario
- **Concern:** A payout to a closed or replaced card can be refused for good. UC-04 E1 only tries again, payouts go only to the card used for the purchase (02), and cash refunds are out of scope (04). Such a request stays Approved forever: the customer is never paid, the retailer owes money that nobody reports, and the request never closes, so its items cannot be requested again.
- **Options:**
  - **A.** After the payment provider refuses a payout as final, or after a set number of days of failure, the request ends as Payout failed, the customer is told and asked to come to the branch, and the branch pays the refund outside the portal - every approved refund gets an end with existing channels; needs the provider's final-refusal answers, the number of days, and how the branch pays.
  - **B.** Pay through another route (bank transfer or store credit) - keeps the customer in the portal; new payment data, a legal review, and a new partner.
  - **C.** Keep trying with no end and report the open amounts to finance - no new behaviour; the debt stays open.
- **Recommended Answer:** A, with the number of days and the way the branch pays set by the product manager with finance, and the final-refusal answers taken from the payment provider's documentation (02 Dependencies). The same decision sets how often a payout that still fails after one day is tried again (the SDD uses every 6 hours until this is decided; SDD CL-09).
- **Why:** The objectives promise no lost refunds and a short wait (01 Objectives 1 and 2); only A gives every approved refund an end without new payment data. B adds scope that 02 and 04 keep out. The tradeoff is a branch visit for the few customers whose card cannot be credited.
- **Owner:** Product manager, with finance
- **Decide by:** before TASK-03 (Refund decisions and payout) starts
- **Status:** Open (raised by the business review, BO-03, 2026-10-01)

### OI-04: Dependencies with no owner, status, or confirmation point

- **Where:** 02 / Dependencies (raised by the business review, BO-05)
- **Type:** Risk
- **Concern:** 02 held one line, "The payment provider must support refunds to the original card. (Hard dependency)", with no status or owner, and did not list POS Records or the notification partner although 08 rates them Critical and Important. Whether CardPay can refund the original card without card details, pays a payout sent twice only once, and how it reports results is unconfirmed, and nothing stopped a task from starting before its partner answered.
- **Options:**
  - **A.** A dependency table with status, owner, what must be confirmed in writing, and the task it must be confirmed before - every blocker owned and visible; the delivery gate stays shut until partners answer.
  - **B.** Track the confirmations only in the SDD - fewer BRD edits; planners reading the BRD see no blocker.
- **Recommended Answer:** A. 02 Dependencies: rows 1 (CardPay, before TASK-03), 2 (POS Records receipt look-up, before TASK-01), and 3 (MsgHub, before TASK-01), each To confirm and owned by the product manager.
- **Why:** The dependencies are business commitments, so their status belongs where planners read; each needs someone who chases it before the task that relies on it. The tradeoff is a gate that waits for partners.
- **Status:** Accepted - applied (business review BO-05, 2026-10-01); the three confirmations are open in 02

### OI-05: Owner decisions held outside this BRD, and build on unsigned changes

- **Where:** 13; 14 / Delivery gate; 00 / cover (raised by the business review, BO-06)
- **Type:** Risk
- **Concern:** The SDD handed several business decisions back to this BRD's owner (SDD OI-13, OI-14, CL-02, CL-03, CL-05, CL-09, CL-15; the native-app question in SDD §2.2), but none was in this register, and the gate read "Next action: None". Changes made after the Head of Retail approved version 1.0 could reach build unsigned.
- **Options:**
  - **A.** Register each decision here as an open item with an owner and a decide-by point, and gate delivery on sign-off of the version - every decision visible to its owner; nothing built on unsigned scope.
  - **B.** Keep them in the SDD - one home; the owner must read the SDD to find them.
- **Recommended Answer:** A. OI-06 to OI-11 below, with the post-window retry interval folded into OI-03; 14 Delivery gate gains "G6 This version signed off by its approver"; the cover reads In Review until the business review's changes are signed off.
- **Why:** A register the owner and the gate already read cannot miss a decision. The tradeoff is a gate that waits for sign-off.
- **Status:** Accepted - applied (business review BO-06, 2026-10-01)

### OI-06: Purchases not fully paid by card

- **Where:** 06a / UC-01 step 2; 02 / Assumptions / Constraints 2; 04 / Out of Scope (raised by the business review, BO-06; it carries the SDD follow-up of SDD OI-13)
- **Type:** Missing scenario
- **Concern:** Payouts go only to the card used for the purchase (02), and cash refunds are out of scope (04). The SDD therefore refuses a receipt with no card payment at UC-01 step 2 ("this purchase can be refunded at the branch") and caps a receipt paid partly by card at its card-paid amount. Neither behaviour appears in UC-01 or in the UAT cases, and the owner has not confirmed it. The cap also decides whether a purchase paid partly in cash and returned in full takes back all its loyalty points (Loyalty Points OI-19, linked; business review DC-08).
- **Options:**
  - **A.** Keep the card-only rule and state it in UC-01: a receipt with no card payment is refused at step 2 and the customer is told to go to the branch (a new exception flow), and a receipt paid partly by card is refunded up to its card-paid amount (a new business rule) - matches 02 and 04; those customers still go to the branch.
  - **B.** Let cash and mixed purchases be requested in the portal and pay the cash part at the branch - every request recorded (01 Objective 2); needs a branch settlement step and links to cash refunds, now out of scope.
- **Recommended Answer:** A, worded in UC-01 as an exception flow and a business rule with acceptance criteria.
- **Why:** It states what the design already does and follows 02 and 04; B reopens the cash-refund scope. The tradeoff is that cash and mixed purchases stay a branch matter.
- **Owner:** Product manager
- **Decide by:** before TASK-01 (Refund requests) starts
- **Status:** Open (raised by the business review, BO-06, 2026-10-01)

### OI-07: Receipt look-up protection

- **Where:** 06a / UC-01 step 1 (raised by the business review, BO-06; it carries the SDD follow-up of SDD OI-14)
- **Type:** Risk
- **Concern:** Anyone with an account can type any receipt number, see what was bought, and request a refund that blocks the real buyer until a manager rejects it. The SDD limits look-ups per customer (10 a minute, 50 a day) and refuses more with a message UC-01 does not describe; a second check, such as the purchase date, needs this BRD to change step 1.
- **Options:**
  - **A.** Receipt number alone, with the look-up limit stated in UC-01 and a message when it is reached - no extra field; guessing stays possible within the limit.
  - **B.** Ask for the receipt number and the purchase date printed on it at step 1 - guessing becomes impractical; one more field for the customer.
- **Recommended Answer:** B, with the look-up limit also stated in UC-01 and a message when it is reached.
- **Why:** The receipt shows both values, so the honest customer types one more field while a guess must match two. The tradeoff is a slightly longer step 1.
- **Owner:** Product manager
- **Decide by:** before TASK-01 (Refund requests) starts
- **Status:** Open (raised by the business review, BO-06, 2026-10-01)

### OI-08: Who creates and removes branch manager accounts

- **Where:** 04 / Personas / Actors; 07 (raised by the business review, BO-06; it carries the SDD follow-up of SDD CL-02)
- **Type:** Missing scenario
- **Concern:** Branch managers need accounts tied to their branch, and an account must be removed when a manager leaves or moves. The SDD gives this to a staff administrator outside the portal, but no BRD names who that is or what happens when a manager joins, moves, or leaves.
- **Options:**
  - **A.** Name the team that administers staff accounts outside the portal (for example the Retail IT team) and state the joiner, mover, and leaver steps - no new portal screen.
  - **B.** A staff administration screen in the portal - self-service; a new persona and use case.
- **Recommended Answer:** A, with the team named by the product manager and the steps added to 04.
- **Why:** The SDD already keeps staff accounts outside the portal; only the owner and the steps are missing. The tradeoff is a manual process outside the product.
- **Owner:** Product manager, with the Retail IT team
- **Decide by:** before TASK-03 (Refund decisions and payout) starts
- **Status:** Open (raised by the business review, BO-06, 2026-10-01)

### OI-09: How the branch manager hears about a failing payout

- **Where:** 06b / UC-04 E1 (raised by the business review, BO-06; it carries the SDD follow-up of SDD CL-03)
- **Type:** Ambiguity
- **Concern:** UC-04 E1 says the branch manager "is told" after one day but names no channel. The SDD tells them only inside the portal (a list, a flag, and a count when the branch area opens), so a manager who does not open the portal does not hear.
- **Options:**
  - **A.** In the portal only, as designed - no staff messages; relies on managers opening the portal.
  - **B.** Also by email - the manager hears without opening the portal; staff contact details and a staff message type.
- **Recommended Answer:** A, stated in UC-04 E1, unless the owner wants managers alerted outside the portal.
- **Why:** 08 gives the notification partner customer messages only, and 01 Objective 3 makes the portal the managers' one place. The tradeoff is reliance on managers opening it.
- **Owner:** Product manager
- **Decide by:** before TASK-03 (Refund decisions and payout) starts
- **Status:** Open (raised by the business review, BO-06, 2026-10-01)

### OI-10: How long refund records, contact details, and message records are kept

- **Where:** 10 / NFR-04 (raised by the business review, BO-06; it carries the SDD follow-ups of SDD CL-05 and CL-15)
- **Type:** Missing scenario
- **Concern:** No BRD chunk says how long refund records, customers' contact details, or the record of messages sent are kept. The SDD uses placeholders (refund records 10 years, contact details 30 days, message records 90 days after a request closes) only so that nothing is deleted before the owner decides.
- **Options:**
  - **A.** Set the three periods with finance and the data protection owner, and state them in 10 - lawful, minimal keeping; needs their advice.
  - **B.** Keep the placeholders - no work; the periods may break a legal duty either way.
- **Recommended Answer:** A.
- **Why:** Keeping periods are legal and finance facts the design must not guess. The tradeoff is waiting for advice.
- **Owner:** Product manager, with finance and the data protection owner
- **Decide by:** before go-live
- **Status:** Open (raised by the business review, BO-06, 2026-10-01)

### OI-11: "Web and Mobile" in UC-02

- **Where:** 05 / Use Case Summary; 06a / UC-02 title and Future Enhancements; 11 / UI/UX Expectations (raised by the business review, BO-06; it carries the SDD question of SDD §2.2)
- **Type:** Ambiguity
- **Concern:** UC-02 is titled "Web and Mobile" and its future enhancement mentions "the mobile app", while 11 says the customer screens work on phones and computers. Design cannot tell whether a native app is in this release.
- **Options:**
  - **A.** "Mobile" means the web app on phones; there is no native app in this release, and push notifications wait for one - no new build.
  - **B.** A native app in this release - a second client to build and run.
- **Recommended Answer:** A, stated in UC-02 and 11.
- **Why:** 11 already describes one set of screens for phones and computers. The tradeoff is no push notifications in this release.
- **Owner:** Product manager
- **Decide by:** before TASK-02 (Request tracking and cancellation) starts
- **Status:** Accepted - applied (business review PM-12, 2026-10-01): UC-02 Business Rules & Constraints state there is no native app in this release; UC-02 Future Enhancements and 12 Wishlist move push notifications to a native app; 11 says the screens are in the web app

### OI-12: Legal clearances that can stop go-live

- **Where:** 02 / Dependencies (raised by the business review, BO-07)
- **Type:** Risk
- **Concern:** The lawful basis for customer data, the data processing agreements and data location of the payment provider and the notification partner, the keeping periods, the card-payment security (PCI DSS) scope, and any certification scope could each stop go-live, yet none was a listed dependency with an owner.
- **Options:**
  - **A.** A Legal clearances table in 02, each with an owner, what must be confirmed, and the point it is needed before (go-live; the card-payment security scope before TASK-03), and the clearances as a condition of the BAT sign-off - owned before release; planning and tests not held up.
  - **B.** Also gate this chunk's delivery outputs on legal sign-off - strongest; holds the plan and the tests on legal timelines.
- **Recommended Answer:** A. 02 Legal clearances L1 to L5.
- **Why:** The clearances gate the release, and the card-payment security scope decides whether card details may ever reach the portal, so it gates the payout task. The tradeoff is a release that waits for legal answers.
- **Status:** Accepted - applied (business review BO-07, 2026-10-01); the clearances are open in 02

### OI-13: Customer care, head office, and staff administration

- **Where:** 04 / Personas / Actors; 07; 10 / NFR-04; 01 / Background and Context (raised by the business review, BO-11)
- **Type:** Missing requirement
- **Concern:** Customer care receives the complaints this product exists to reduce (01: 18% of complaints are about slow or lost refunds), but no persona lets it see a request: NFR-04 allows only the customer and their branch's manager. The Operations Lead and Head of Retail have no view across branches, and the people who create and remove branch manager accounts (OI-08) appear in no matrix. Today the only way for anyone else to look at a request is emergency access to production data, which is not a support channel.
- **Options:**
  - **A.** A read-only Customer Care persona (find a request by its reference number and see its status and history; never decide or cancel), a read-only head-office view of every branch's requests, and the staff administrator's tasks, named in 04 and 07, with NFR-04 amended to "Only the customer, their branch's manager, customer care, and head office (both read-only) can see a request" - support and oversight inside the product; more people see personal data.
  - **B.** No new persona; customer care asks the branch manager - no scope change; slow answers, and complaints about a branch go to that branch.
- **Recommended Answer:** A, with what customer care and head office may see agreed with the Operations Lead and the data protection owner.
- **Why:** The objectives and the complaint figure in 01 depend on customer care and head office; least privilege keeps both read-only. The tradeoff is a wider circle of people who see requests.
- **Owner:** Product manager, with the Operations Lead and the data protection owner
- **Decide by:** before TASK-02 (Request tracking and cancellation) starts
- **Status:** Open (raised by the business review, BO-11, 2026-10-01)

### OI-14: How the portal reaches the branches

- **Where:** 02 / Assumptions / Constraints, Facts 2 (raised by the business review, BO-12)
- **Type:** Risk
- **Concern:** Nothing planned how the portal reaches 40 branches or kept a launch out of the seasonal sales period, when requests triple. A launch everywhere at once, untrained, risks both refund objectives, and branches falling back to paper (SDD risk R-01) had no owner.
- **Options:**
  - **A.** State the shape now (pilot branches first, then waves; no go-live or wave inside the seasonal sales period) and plan the details in OI-15, with the Operations Lead owning the paper risk - the safe shape is fixed now.
  - **B.** A launch in every branch at once - one date; no learning before the whole estate depends on the portal.
- **Recommended Answer:** A. 02 Assumptions / Constraints 3: "The portal goes live in pilot branches first, then in waves until every branch uses it. No go-live and no wave falls inside the seasonal sales period (Facts 2)."
- **Why:** 02 Facts 2 makes the seasonal period the worst time to learn a new process, and a pilot lets the branches find problems before all 40 depend on the portal. The tradeoff is a longer rollout.
- **Status:** Accepted - applied (business review BO-12, 2026-10-01)

### OI-15: The rollout plan

- **Where:** 02 / Assumptions / Constraints 3 (raised by the business review, BO-12)
- **Type:** Missing requirement
- **Concern:** Constraint 3 fixes the shape of the rollout but not its content: which branches pilot, the waves and their dates, how branch staff are trained, how customers learn about the portal and that they need an account, which languages customers need, how long before the seasonal period the last wave must end, and the date each branch stops recording refunds on paper.
- **Options:**
  - **A.** A rollout plan owned by the Operations Lead with all of the above, kept with this BRD - one plan the delivery and branch teams share.
  - **B.** Leave the plan to project management outside the BRD - lighter; the languages and the paper retirement dates stay invisible to the product.
- **Recommended Answer:** A.
- **Why:** The languages and the paper retirement dates change what the product must support (the SDD supports one language per retailer today). The tradeoff is a plan to keep up to date.
- **Owner:** Operations Lead
- **Decide by:** before the pilot starts
- **Status:** Open (raised by the business review, BO-12, 2026-10-01)

### OI-16: The goods before the money

- **Where:** 03 / Refund request lifecycle; 05 / Branch Manager Journey; 06b / UC-04 steps 3-6; 12 / Appendix (Store refund policy v3) (raised by the business review, SME-01)
- **Type:** Missing scenario
- **Concern:** Nothing between Submitted and Paid covers the customer handing the goods back, staff checking their condition, or deciding what happens to them (back to stock, written off, returned to the supplier). The manager "checks each one" (05) but has nothing to check against, so money can leave for goods the store never sees, stock stays wrong, and faulty items cannot be claimed back from suppliers.
- **Options:**
  - **A.** Approval waits until the goods are back at the branch: UC-04 gains a step where the manager confirms the goods were returned and records their condition and what happens to them - no refund without the goods; every customer visits the branch.
  - **B.** Refunds below a set amount, for set reasons, may be paid without the goods, on photo evidence; all others need the goods - small refunds stay online; needs thresholds and photo storage.
- **Recommended Answer:** A, unless Store refund policy v3 already allows refunds without the goods, in which case B with that policy's thresholds.
- **Why:** The branches' own policy decides, and a refund for goods never returned is the main loss in branch refunds. The tradeoff of A is a branch visit for every customer.
- **Owner:** Operations Lead (source: Store refund policy v3)
- **Decide by:** before TASK-03 (Refund decisions and payout) starts
- **Status:** Open (raised by the business review, SME-01, 2026-10-01)

### OI-17: What a paid refund must update outside the portal

- **Where:** 08 / Integrations (Point-of-Sale Records row: "We receive") (raised by the business review, SME-02)
- **Type:** Missing requirement
- **Concern:** At a till, a refund reverses the sale in the sales and VAT takings, returns the item to stock, and nets against the branch's takings. A refund paid through the portal updates none of these, issues no credit note or return document, and may not meet a fiscal-till rule where one applies. Nobody owns checking paid refunds against the payment provider's settlement records.
- **Options:**
  - **A.** Report each paid refund to POS Records or the finance system as a return (and to the fiscal device where required), and give finance a per-branch report of payouts to check against the provider's settlement - books, stock, and fiscal records stay right; a new partner flow in 08.
  - **B.** Keep the till as the record: the portal handles the request and the decision, and the branch completes the refund at the till - postings and fiscal rules as today; the card payout through the payment provider and the remote experience go.
- **Recommended Answer:** A, with the target system, the documents, and the fiscal rules confirmed with finance and the Retail IT team, and finance as the owner of payout reconciliation.
- **Why:** The sales, VAT, and stock figures must reflect every refund, whatever the channel; B undoes the product's purpose. The tradeoff is a second flow with POS Records or finance.
- **Owner:** Product manager, with finance and the Retail IT team
- **Decide by:** before TASK-03 (Refund decisions and payout) starts
- **Status:** Open (raised by the business review, SME-02, 2026-10-01)

### OI-18: The market, its rules, and faulty goods

- **Where:** 01; 02 / Assumptions / Constraints; 06a / UC-01 BR-1, E1 (raised by the business review, SME-03)
- **Type:** Missing requirement
- **Concern:** No chunk names the country or countries the branches are in, so no local rule can be checked: the keeping periods (OI-10), the return documents (OI-17), and the refund window itself. The 30-day window is a commercial return policy, but a faulty item usually falls under a legal guarantee with its own period and remedies (repair, replacement, price reduction, refund). UC-01 treats both alike: inside 30 days it refunds where the law lets the seller repair or replace; after 30 days E1 sends a valid legal claim to the branch with no record.
- **Options:**
  - **A.** Name the market or markets, add a per-market section of legal rules to 02, and split the request reason into "changed my mind" (the 30-day window) and "faulty or not as described" (the legal guarantee: handled at the branch, or in the portal without the 30-day limit) - every legal rule has a source; one more reason choice in UC-01.
  - **B.** Name the market only - the rules can be checked; faulty goods still go through the 30-day window.
- **Recommended Answer:** A, with the rules confirmed by the retailer's legal adviser.
- **Why:** A legal guarantee cannot be limited by a store's return policy, and every other legal question in this register waits for the market. The tradeoff is a second request path for faulty goods.
- **Owner:** Product manager, with the retailer's legal adviser
- **Decide by:** before TASK-01 (Refund requests) starts
- **Status:** Open (raised by the business review, SME-03, 2026-10-01)

### OI-19: Objective 2 and refunds handled at a branch

- **Where:** 01 / Business Objectives 2; 04 / Out of Scope (raised by the business review, SME-04)
- **Type:** Inconsistency
- **Concern:** Objective 2 promised that every request is recorded and visible to the customer, but refunds handled at a branch (walk-in requests, purchases older than the refund window, purchases not paid by card) have no way into the portal, so the objective could not hold for them.
- **Options:**
  - **A.** Limit Objective 2 to requests made in the portal and list branch-handled refunds as out of scope; decide a staff-assisted path in OI-20 - the BRD claims only what it delivers.
  - **B.** Keep the objective as written - no edit; a claim the scope cannot meet.
- **Recommended Answer:** A. 01 Objective 2: "Stop lost refund requests: every request made in the portal is recorded and visible to the customer. Refunds handled at a branch outside the portal stay outside this objective in this release (04 Out of Scope)." 04 Out of Scope adds: "Recording refunds handled at a branch outside the portal: walk-in requests, purchases older than the refund window, and purchases not paid by card."
- **Why:** An objective must match the scope that delivers it. The tradeoff is an objective that is honest but partial until OI-20 closes.
- **Status:** Accepted - applied (business review SME-04, 2026-10-01)

### OI-20: A staff-assisted request for refunds handled at a branch

- **Where:** 04 / Personas / Actors, Out of Scope; 06a / UC-01 E1; 07 (raised by the business review, SME-04)
- **Type:** Missing requirement
- **Concern:** Customers will keep walking in with goods, and some cases are sent to the branch by design. Without a way for branch staff to record those requests, they stay on paper, Objective 2 stays partial, and branches cannot fully retire paper (SDD risk R-01).
- **Options:**
  - **A.** A Store Associate persona records a walk-in request, and the outcome of a branch-handled refund (paid at the branch, exchanged, store credit), under the same kind of reference number, visible to the customer - every refund recorded; a new persona, use case, and staff training.
  - **B.** Keep branch-handled refunds on paper - no new scope; the paper channel stays.
- **Recommended Answer:** A, with the cases it covers and the staff who use it agreed with the Operations Lead.
- **Why:** Objective 2's purpose is that no request is lost; only A covers the requests that start at the counter. The tradeoff is a new persona and use case.
- **Owner:** Product manager, with the Operations Lead
- **Decide by:** before the rollout plan (OI-15) sets the paper retirement dates
- **Status:** Open (raised by the business review, SME-04, 2026-10-01)

### OI-21: A branch manager deciding their own refund

- **Where:** 06b / UC-04 Business Rules & Constraints (raised by the business review, SME-05)
- **Type:** Risk
- **Concern:** A branch manager who files a refund with their own customer account could approve it from their staff account: nothing in UC-04 forbids it, and the design's check compares only the two sign-ins, which are different accounts.
- **Options:**
  - **A.** Add the rule "A branch manager never decides on a refund request they made as a customer", with staff declaring their own customer account when their staff account is created - closes the main internal fraud path; relies on the declaration.
  - **B.** Rely on oversight after the fact - no new rule; the payout has already left.
- **Recommended Answer:** A. UC-04 Business Rules & Constraints adds: "A branch manager never decides on a refund request they made as a customer."
- **Why:** The person who benefits from a payment must not approve it. The tradeoff is a declaration duty for staff.
- **Status:** Accepted - applied (business review SME-05, 2026-10-01)

### OI-22: Decision deadline, reminders, escalation, deputy cover, and an approval limit

- **Where:** 03 / Branch ownership; 06b / UC-04 Trigger, Business Rules & Constraints; 08 (Notification Partner: customers only); 09 (raised by the business review, SME-05)
- **Type:** Missing requirement
- **Concern:** Each branch has one manager, who decides alone with no deadline, reminder, or escalation, no deputy for absences or a vacant post, no way to cover two small branches, and no amount above which a second person must agree. The 3-day objective (01 Objective 1) rests on each manager's habits, and the seasonal peak triples the queue.
- **Options:**
  - **A.** A decision target per request, a reminder and an escalation when it is missed, a named deputy per branch (and managers able to cover more than one branch), and an approval limit above which a second approver decides - the objective is managed; needs an escalation role (OI-13) and alert channels (OI-09).
  - **B.** Only a decision target shown in the branch report - visible, not enforced.
- **Recommended Answer:** A, with the target, the limit, and the escalation role set by the Operations Lead.
- **Why:** The objective needs a managed decision step, and money above a limit needs a second pair of eyes. The tradeoff is more roles and rules.
- **Owner:** Operations Lead, with the product manager
- **Decide by:** before TASK-03 (Refund decisions and payout) starts
- **Status:** Open (raised by the business review, SME-05, 2026-10-01)

### OI-23: What Paid means to the customer, and the card facts to confirm

- **Where:** 03 / Refund request lifecycle; 04 / Project Scope; 05 / Customer Journey; 06b / UC-04 step 7; 06a / UC-02 step 4; 02 / Dependencies 1 (raised by the business review, SME-06)
- **Type:** Ambiguity
- **Concern:** Paid means the payment provider accepted the payout, but the money reaches the card days later, while 04 and 05 promised customers could follow the request "until the money is back on their card". The Paid message gave no reference the customer can quote to their bank. Nothing confirmed that the payment provider is the acquirer of the branch card terminals, how long a refund takes to appear, or whether a purchase the customer has disputed with their bank can be detected before a payout, which could otherwise be refunded twice.
- **Options:**
  - **A.** Define Paid as accepted by the payment provider, tell the customer at Paid when to expect the money and give the payout reference, and add the card facts to dependency 1 - honest wording now; the facts confirmed before TASK-03.
  - **B.** A plus a dispute check before every payout - prevents double refunds; rests on a capability nobody has confirmed.
- **Recommended Answer:** A. 03: "An approved request becomes Paid once the payment provider accepts the payout; the money can take some days after that to appear on the customer's card." 04 Project Scope: "...follow them until they are paid, when the payout is sent to their card." 05 Customer Journey: "They follow the request until it is Paid, when the payout is sent to their card and they are told when to expect the money, ..." UC-04 step 7: "When the payment provider accepts the payout, the system marks the request Paid and tells the customer by email and SMS, with the payout reference and that the money can take some days to appear on their card." UC-02 step 4 adds: "Once the request is Paid, it shows the payout reference the customer can quote to their bank." 02 Dependencies 1 adds the acquirer link, the days to appear, the reference for the bank, and dispute detection.
- **Why:** The wording follows the lifecycle the BRD already defines; the rest are facts about the payment provider. A dispute check becomes a rule once the provider confirms it is possible. The tradeoff is a few days of honest uncertainty in the customer's message.
- **Status:** Accepted - applied (business review SME-06, 2026-10-01)

### OI-24: The store refund policy rules the portal applies

- **Where:** 12 / Appendix (Store refund policy v3); 06a / UC-01 step 2, BR-1, BR-2 (raised by the business review, SME-08)
- **Type:** Missing requirement
- **Concern:** The rules branches follow today live in Store refund policy v3, but UC-01 keeps only the 30-day window and "an item can be refunded only once". Category exclusions, a longer window for holiday purchases, gift receipts, final-sale items, refunding some units of a line, and items bought in a promotion are not stated, so the portal may show excluded items as refundable and managers will settle these cases differently in each branch.
- **Options:**
  - **A.** Bring the policy v3 rules into UC-01 as business rules (which categories are excluded, the holiday window, how a gift receipt is refunded, final sale), and state how part of a multi-unit line and an item bought in a promotion are refunded - one policy, applied the same way everywhere.
  - **B.** Keep two rules in the portal and let managers apply the rest - no change; inconsistent decisions.
- **Recommended Answer:** A, transcribed from Store refund policy v3 by the Operations Lead.
- **Why:** The policy already exists; the portal should apply it, not a subset. The tradeoff is more rules in UC-01 and more data from POS Records for each receipt line.
- **Owner:** Operations Lead (source: Store refund policy v3), with the product manager
- **Decide by:** before TASK-01 (Refund requests) starts
- **Status:** Open (raised by the business review, SME-08, 2026-10-01)

### OI-25: The customer account

- **Where:** 05 / Customer Journey; 06a / UC-01 Preconditions; 04 / In Scope; 03 (raised by the business review, PM-04)
- **Type:** Missing requirement
- **Concern:** Nothing said a customer needs an account, how they get one, or whether a mobile number is required, although the design requires self-registration and sends SMS only to a mobile number on the account. Registration was an unstated first step with no screen or test, and "email and SMS" read as a promise to every customer.
- **Options:**
  - **A.** Customers sign in, or register themselves with a verified email address and an optional mobile number; SMS goes only when a number is given - light sign-up; SMS reaches only customers who give a number.
  - **B.** As A with the mobile number required - SMS for everyone; more friction at sign-up.
  - **C.** Request and track without an account - least friction; changes who can see a request (NFR-04).
- **Recommended Answer:** A. 04 In Scope adds "Customer accounts: customers register themselves with an email address, which is verified, and may add a mobile number to receive SMS" and "Customer messages by email, and by SMS when the customer's account has a mobile number". 05 Customer Journey starts "The customer signs in, or registers with their email address and, if they want SMS, a mobile number." UC-01 Preconditions add "The customer is signed in with their customer account (04 In Scope)." 03 adds "Customer account and messages".
- **Why:** Sign-up friction is the main adoption risk for walk-in customers (Objective 2), and the design already behaves this way. The tradeoff is SMS only for customers who give a number.
- **Status:** Accepted - applied (business review PM-04, 2026-10-01)

### OI-26: Measuring the objectives

- **Where:** 01 / Business Objectives; 09 (raised by the business review, PM-05)
- **Type:** Missing requirement
- **Concern:** The objectives had no measure, target, owner, or review, and no report showed the Head of Retail or the Operations Lead whether they were met; the only report served one branch manager and showed time to decision, not time to payout.
- **Options:**
  - **A.** A measure, target, and starting figure per objective, an owner with a monthly review, and a monthly head-office report - the sponsors can see and act on the objectives.
  - **B.** Measures only, with measuring left to manual extracts - no new report.
- **Recommended Answer:** A. 01 adds "How the objectives are measured" (Objective 1: monthly average from Submitted to Paid, target 3 days; Objective 2: customer care's share of complaints about slow or lost refunds; Objective 3: branches deciding every portal request in the portal and off paper), owned by the Head of Retail with a monthly review. 09 adds the head-office refund report.
- **Why:** The start and end events, the target, and the complaint figure were already in the BRD; the report gives the sponsor the figures. The tradeoff is one more report.
- **Status:** Accepted - applied (business review PM-05, 2026-10-01); starting figures in OI-27

### OI-27: Starting figures and the complaint target

- **Where:** 01 / How the objectives are measured; 02 / Challenges 1 (raised by the business review, PM-05)
- **Type:** Missing requirement
- **Concern:** "Up to 10 days" is a maximum, and paper records that get lost cannot give a measured average, so Objective 1 has no starting figure to compare with. Objective 2 has no target for the share of complaints, and the complaint figure has no stated source.
- **Options:**
  - **A.** Measure a sample of paper requests before launch (time from request to payout), take the complaint share from customer care's records, and set a target for it - real starting figures.
  - **B.** Keep the estimates - no work; the objectives cannot be shown to have improved anything.
- **Recommended Answer:** A, with the sample and the target agreed by the Head of Retail and the Operations Lead.
- **Why:** An objective without a starting figure cannot show change. The tradeoff is a short measurement before launch.
- **Owner:** Operations Lead, with the Head of Retail
- **Decide by:** before the pilot starts
- **Status:** Open (raised by the business review, PM-05, 2026-10-01)

### OI-28: Reporting paid refunds to Loyalty Points

- **Where:** 04 / In Scope; 08 (raised by the business review, PM-07)
- **Type:** Missing requirement
- **Concern:** The Loyalty Points BRD depends on this portal reporting each paid refund, but this BRD never committed to it: no scope line, no integration row, no task, and no test, so a change here could stop points being taken back without anyone noticing.
- **Options:**
  - **A.** Commit to it here: a scope line, an 08 row to Loyalty Points, and a task and an acceptance case when chunks 15 and 16 are refreshed - both owners see the commitment.
  - **B.** Leave the commitment on the Loyalty Points side only - no change here; the dependency can break silently.
- **Recommended Answer:** A. 04 In Scope adds "Reporting each paid refund to Loyalty Points, so that points earned on the refunded purchase are taken back (08)"; 08 adds the Loyalty Points row. The launch order of the two products is Loyalty Points OI-17.
- **Why:** A dependency is real only when the providing side commits to it. The tradeoff is one more outgoing flow in this BRD.
- **Status:** Accepted - applied (business review PM-07, 2026-10-01)

### OI-29: The branch refund report as a use case

- **Where:** 09; 05 / Use Case Summary; 07; 11 / Screens (raised by the business review, PM-10)
- **Type:** Missing requirement
- **Concern:** The branch refund report existed only in 09: no use case, matrix row, screen, mockup, task, or test, no rule for which requests count on a day, and no meaning for "Daily". The decision screen also had no screen ID.
- **Options:**
  - **A.** A use case, UC-06, with a matrix row, screen SCR-04, a counting rule, and "Daily" defined as one day per view, on demand; SCR-03 for the decision screen - specified and testable.
  - **B.** Move the report to the wishlist - less to build; managers lose their only report.
- **Recommended Answer:** A. 06b adds UC-06 View Branch Refund Report (step 3: for the chosen day, the requests submitted that day by their current status, the amount paid that day, and the average time to decision of the requests decided that day; BR: own branch, local calendar day, on demand). 05, 07, 09, and 11 follow; UC-04's screen is SCR-03.
- **Why:** The report serves Objectives 1 and 3 and has an audience; the counting rule uses dates the lifecycle already records. The tradeoff is one more use case to build and test.
- **Status:** Accepted - applied (business review PM-10, 2026-10-01)

### OI-30: Measurable NFR-02 and NFR-03

- **Where:** 10 / NFR-02, NFR-03; 16 (raised by the business review, PM-11)
- **Type:** Ambiguity
- **Concern:** NFR-02 did not say what counts as disruption, and NFR-03's "no slowdown customers notice" had no measure, so neither could be tested, and the seasonal peak would pass or fail with no agreed measure. Chunk 16 also missed cases for NFR-03, NFR-04, and UC-02 BR-1, miscounted its coverage, and lacked the notification partner's test environment.
- **Options:**
  - **A.** Disruption is any time customers cannot submit, track, or cancel or managers cannot decide, whatever the cause; the peak measure compares response at 3 times the normal number with the normal number - both testable; partner outages count.
  - **B.** As A, but partner outages and announced maintenance do not count - easier to meet; the customer's experience of an outage is not measured.
- **Recommended Answer:** A. NFR-02: "No more than 2 hours a month in which customers cannot submit, track, or cancel a request, or branch managers cannot decide on one, whatever the cause, partner outages and planned maintenance included; measured over each month in live use." NFR-03: "At 3 times the normal number of requests, sustained for 3 weeks, every customer and branch manager action responds as quickly as at the normal number." The chunk 16 corrections are listed in 14 / Business review for its refresh.
- **Why:** Customers experience an outage the same way whatever its cause. The tradeoff is a measure that includes what partners do.
- **Status:** Accepted - applied (business review PM-11, 2026-10-01)

### OI-31: Deferred features: owners, decision points, and what users are told

- **Where:** 12 / Wishlist; 06a / UC-01 E2, UC-02; 06b / UC-04 Future Enhancements; 11 (raised by the business review, PM-12)
- **Type:** Missing requirement
- **Concern:** Deferred items (online-shop refunds, push notifications, bulk approval, checking payouts against the provider's records) had no owner or horizon, and an online-shop customer whose receipt the portal cannot find was only told to check the number.
- **Options:**
  - **A.** A wishlist table with an owner and a trigger or horizon per item (decided at the first monthly objectives review after every branch is live where no dependency sets one), and E2 telling the customer that online-shop purchases are refunded through the online shop - owned items; honest messages.
  - **B.** The table only - owned items; the online-shop customer is still misled.
- **Recommended Answer:** A. 12 Wishlist becomes a table; UC-01 E2 adds "and says that purchases from the online shop are refunded through the online shop". OI-11 is applied at the same time.
- **Why:** Every deferred item needs someone who decides when it comes, and users must not be told to retry what can never work. The tradeoff is a review point to keep.
- **Status:** Accepted - applied (business review PM-12, 2026-10-01)

### OI-32: Refund details shown on a loyalty member's points history

- **Where:** 10 / NFR-04; Loyalty Points BRD 06a / UC-02 step 4, A1, AC-1, AC-4, AC-6 (raised by the business review, PA-09; linked to Loyalty Points OI-18)
- **Type:** Inconsistency
- **Concern:** NFR-04 lets only the customer and their branch's manager see a request. Loyalty Points shows the refund reference, the date the refund was paid, and the refunded amount to the member whose purchase was refunded, and that member may not be the customer who requested the refund, because any customer can request a refund of any receipt they hold.
- **Options:**
  - **A.** The member sees the refunded amount and the date the refund was paid for a refund of their own purchase, but not the refund reference, which identifies another person's request - the member understands the points taken back; the request stays private.
  - **B.** The member sees the refund reference as well - one reference across both products; the request's reference reaches someone NFR-04 excludes.
  - **C.** The member sees only the points taken back - the strictest; the member cannot tell which refund took the points.
- **Recommended Answer:** A, decided together with Loyalty Points OI-18 and the data protection owner.
- **Why:** The amount and date describe the member's own purchase, while the reference belongs to the request. The tradeoff is a movement without the reference the customer would quote.
- **Owner:** Product manager, with the Loyalty Points product manager and the data protection owner
- **Decide by:** before Loyalty Points TASK-04 (the points history) starts
- **Status:** Open (raised by the business review, PA-09, 2026-10-01)

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|-----------------|-------------|---------|
| OI-01 | 2026-09-21 | 06b UC-04 A1; 05 Use Case Summary (UC-05 merged into UC-04) | Accepted recommendation |
| OI-02 | 2026-10-01 | 06b UC-04 E1, AC-2; 06a UC-02 step 4 | Accepted recommendation (business review BO-03) |
| OI-04 | 2026-10-01 | 02 Dependencies | Accepted recommendation (business review BO-05) |
| OI-05 | 2026-10-01 | 13 (OI-06 to OI-11; OI-03 extended); 14 Delivery gate G6; 00 cover | Accepted recommendation (business review BO-06) |
| OI-12 | 2026-10-01 | 02 Legal clearances | Accepted recommendation (business review BO-07) |
| OI-14 | 2026-10-01 | 02 Assumptions / Constraints 3 | Accepted recommendation (business review BO-12) |
| OI-19 | 2026-10-01 | 01 Business Objectives 2; 04 Out of Scope | Accepted recommendation (business review SME-04) |
| OI-21 | 2026-10-01 | 06b UC-04 Business Rules & Constraints | Accepted recommendation (business review SME-05) |
| OI-23 | 2026-10-01 | 03 lifecycle; 04 Project Scope; 05 Customer Journey; 06b UC-04 step 7; 06a UC-02 step 4; 02 Dependencies 1 | Accepted recommendation (business review SME-06) |
| OI-25 | 2026-10-01 | 04 In Scope; 05 Customer Journey; 06a UC-01 Preconditions; 03 Customer account and messages | Accepted recommendation (business review PM-04) |
| OI-26 | 2026-10-01 | 01 How the objectives are measured; 09 head-office refund report; 04 In Scope (refund reports, verification pass) | Accepted recommendation (business review PM-05) |
| OI-28 | 2026-10-01 | 04 In Scope; 08 Loyalty Points row | Accepted recommendation (business review PM-07) |
| OI-29 | 2026-10-01 | 06b UC-06 (new) and UC-04 UI/UX; 05 Use Case Summary, Branch Manager Journey; 07; 09; 11 Screens; 04 In Scope (refund reports, verification pass) | Accepted recommendation (business review PM-10) |
| OI-30 | 2026-10-01 | 10 NFR-02, NFR-03; 14 Business review (16 corrections) | Accepted recommendation (business review PM-11) |
| OI-11 | 2026-10-01 | 06a UC-02 Business Rules & Constraints, Future Enhancements; 11; 12 Wishlist | Accepted recommendation (business review PM-12) |
| OI-31 | 2026-10-01 | 12 Wishlist; 06a UC-01 E2; 02 Dependencies 1 (settlement records, the trigger of Wishlist item 4; verification pass) | Accepted recommendation (business review PM-12) |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->
