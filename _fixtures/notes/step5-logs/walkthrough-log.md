# Walkthrough Log - business-reviewer-unifier

**Run:** 2026-10-01, non-interactive fixture run
**Request:** "business-reviewer-unifier walkthrough"
**Project root:** `s5/` (tracker `s5/review-comments-tracker.md`, 39 Pending points)
**User's fixed answers:** accept the recommended option exactly as presented on every point; the skill's default or recommended answer to any other question; "Not yet." when verify is offered.

Each point below holds: the presentation the skill gives in chat (per `walkthrough-protocol.md`), the user's answer, and the files changed with a one-line reason each.

---

## Opening

**Skill (chat):**

> Walkthrough phase, resumed from `review-comments-tracker.md`: 39 points are Pending (60 raw findings, 21 merged into 15 surviving rows). SME domain on record: multi-branch retail store operations (branch refunds paid back to the original card, and a points-based member loyalty programme).
>
> I will take one point at a time, in the tracker order (reviewer, then sequence: BO, SME, PM, PA, DC), which is the stable order of the tracker. Each point gets the issue with its exact location, why it matters, an options table, and one recommendation; nothing is applied before you decide. A decided point is applied chain-wide at once (BRDs, SDD, and their registers) and the tracker row is updated before the next point.
>
> Two defaults, unless you want otherwise: (1) the tracker order above; (2) apply each point as soon as it is decided, rather than deciding everything first. Shall I start with Point 1 (BO-03)?

**User:** Default: tracker order, apply per point.

**Working rules fixed for this run (from the documents' own rules, stated once here):**

- BRD delivery chunks 15 and 16 (both BRDs) and SDD chunk 19 carry gate rules that forbid refreshing them while their gate is shut. A review decision that changes a BRD body or raises a BRD open item shuts that BRD's delivery gate (G1 or G2 in its chunk 14), and any SDD change after the last reconciliation shuts the e2e gate (E4). So those chunks are marked Stale, with the review points that made them stale, and are not edited; their required corrections are recorded in the owning chunk 14 (BRDs) or in the master gate line (SDD).
- Versions are not bumped during the walkthrough: the skill bumps versions and writes changelog entries in its verify and version step (SKILL.md step 7).
- The child LLD (`lld-refunds-platform`) is outside the panel's review scope (tracker Source line); SDD changes make it out of date, which DC-11 records in the SDD lineage.
- Decision records: REFUNDS keeps its decision history in chunk 13 (open items and Resolution Log); LOYALTY in chunk 13, its decision log, and the chunk 14 register; the SDD in its decision log. Each review decision is recorded there with its tracker ID, and a superseded record gets a supersession note.

---

## Point 1 (BO-03): An approved refund whose payout the provider refuses for good stays Approved and unpaid forever: no end state, no other remedy, the customer is not told, and the saga deadline runs on two clocks (merged with PM-02, SME-07, PA-01)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| **BO-03** | **Payout refused for good: no end state** | **Current** |
| BO-04 | Off-portal refunds keep their points | Pending |
| BO-05 | Dependencies without owners or gates | Pending |
| BO-06 | Unsigned scope; follow-ups untracked | Pending |
| BO-07 | Legal clearances not dependencies | Pending |
| BO-08 | Multi-tenancy without a business case | Pending |
| BO-09 | Loyalty outcome, redemption, earn rate | Pending |
| BO-11 | No customer-care or back-office role | Pending |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** Four reviewers found the same hole from four sides.

- *Business rule.* REFUNDS 06b UC-04 E1 reads: "if the payment provider refuses the payout, the request stays Approved, the system tries again, and the branch manager is told if it still fails after one day". AC-2 tells only the branch manager. Payouts go only to the card used for the purchase (REFUNDS 02 Assumptions / Constraints 2), and cash refunds are out of scope (REFUNDS 04 Out of Scope). Nothing says what happens when the card can never be credited (closed, replaced, or too old for the acquirer to reference).
- *Design.* SDD 13b §17.2 "After the retry window" retries a `FAILED` payout every 6 hours "until the provider accepts it" and states: "The platform has no manual retry, other payout route, or closing of a refund: neither BRD states one." The SDD decision log CL-09 handed "an end for a payout the provider refuses for good" to the REFUNDS owner as a follow-up, but REFUNDS 13 holds only OI-01 (applied).
- *Customer.* SDD 13c §17.3 sends messages for five events only, none on a failing payout, and SDD 13a §17.1 shows `payoutFailingSince` "on the branch endpoints only", so the customer's tracking shows a plain Approved, although REFUNDS 04 Project Scope and 05 step 4 promise the customer is told the outcome at each step.
- *Side effects (PA-01).* While the request stays `APPROVED`, its items stay `active` under the BR-2 partial unique index (13a Tables Design), so the customer cannot request them again; `closed_at` is never set, so `refundRecordRetention` and `contactDetailsRetention` never start (13a Retention Policy); 13b Retention keeps "a payout that has not succeeded", and `payout_attempt` gains about four rows a day.
- *Two clocks (PA-01).* refund-service's payout watchdog flags a request at approval plus the retry window plus one hour (13a Business Logic, Payout watchdog). payout-service starts the window at the first API-02 attempt (13b Tables Design: "The retry window starts at the first attempt"; Constraints: "24 hours from the first attempt") and, per Figure 20, checks it only after a failed attempt, whose delay is the maximum backoff still open in SDD 08 §12 INT-01; Figure 18 shows a timer transition `RETRY_SCHEDULED --> FAILED` instead. The window value sits in two Helm charts (ADR-09). SDD 19 §24.8.1 rolls nothing back.

**Why it matters.** A customer whose card cannot be credited waits indefinitely, is told nothing, and calls customer care: the "slow or lost refund" complaint (18% of complaints, REFUNDS 01) that Objectives 1 and 2 exist to remove. The retailer owes money that nobody reports or owns; the branch manager who is told has no lever. The request never closes, so the customer cannot re-request its items and the contact details are kept with no end. On the clocks: any delay between approval and the first attempt (an outbox backlog during a broker outage, which SDD 16 §20.1.7 accepts; consumer lag; a `REFUND_APPROVED` in the DLQ) or a backoff above one hour puts healthy payouts on the overdue list, pages on-call, and books a false REFUNDS/NFR-01 breach in SDD 14 §18.2; implementers reading Figure 18 and Figure 20 build different behaviour.

| Option | Trade-off |
|---|---|
| A. Decide the end state now: after a final refusal or a set number of days, the request ends as Payout failed, the customer is told and asked to come to the branch, and the branch pays outside the portal; plus B's customer message and one clock | Closes the loop today, but sets money policy (how many days, how the branch pays, which refusals are final) without finance or CardPay's refusal codes |
| B. Decide now what the documents already require (tell the customer by email and SMS and on the request when the payout still fails after one day, per the every-step rule; give the saga one clock: the window starts at the approval, ends on a timer, and is one setting both deployables read), and raise the end state (final refusal, days, remedy, owner) as a gating REFUNDS open item | The customer is informed and the saga is consistent now; a permanently refused payout keeps retrying until the owner decides |
| C. Accept indefinite retry as the rule, with wording for the Approved state and a support script | No new behaviour; the debt never closes and nobody owns it |

**Recommendation.** Option B. Telling the customer follows from a rule the BRD already states (REFUNDS 04 Project Scope, 05 step 4), the same rule SDD OI-11 used for the approval message, and one clock is a design consistency fix. The end state is a money-handling choice (a branch payment, a bank transfer, or store credit) that needs finance and CardPay's final-refusal codes, which no document holds; as a gating open item with an owner it can no longer be lost the way the CL-09 follow-up was.

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied chain-wide; tracker row BO-03 set to Applied.

**Files changed for Point 1:**

- `brd-refunds-portal/06b-use-cases-branch-manager.md` - UC-04 E1 and AC-2: the customer is told the payout is delayed when it still fails one day after the approval.
- `brd-refunds-portal/06a-use-cases-customer.md` - UC-02 step 4 shows a delayed payout.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-02 (applied decision) and OI-03 (open: the end for a payout refused for good, owner and decide-by) with the Resolution Log row.
- `brd-refunds-portal/14-todo.md` - steps 1, 2, and 4 back to In progress, gate Shut, chunks 15 and 16 Stale, Business review table with what the refresh must cover.
- `brd-refunds-portal/15-implementation.md` - status line Stale (gate rule: not refreshed while the gate is shut).
- `brd-refunds-portal/16-uat-bat-test-cases.md` - status line Stale (same reason).
- `brd-refunds-portal/refunds-portal-brd-master.md` - Delivery Chunks state Stale.
- `sdd-refunds-platform/13a-service-refund.md` - Payout outcome writes `REFUND_PAYOUT_DELAYED`; watchdog on the shared window setting; outputs, event model, and `payoutFailingSince` on the customer DTO.
- `sdd-refunds-platform/13b-service-payout.md` - window counted from the approval and ending on its own due time; end-state caveat to REFUNDS OI-03; Figures 18, 19, 20; tables, indexes, constraints, future enhancements.
- `sdd-refunds-platform/13c-service-notification.md` - input, channel matrix, integrations, and consumed-events row for `REFUND_PAYOUT_DELAYED`.
- `sdd-refunds-platform/10-events-hub.md` - counts (eight events), Figure 10, catalog row, `PAYOUT_FAILED` business cell, value objects, §14.9.8 contract, erasure map, coverage matrix, `firstAttemptAt` note.
- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-10 lists the new contact-carrying event.
- `sdd-refunds-platform/08-integrations.md` - INT-02 trigger list and INT-01 fallback text.
- `sdd-refunds-platform/09-services-summary.md` - refund-service output and notification-service input lists.
- `sdd-refunds-platform/03-users-and-use-cases.md` - §7.3 REFUNDS/UC-04 events cell.
- `sdd-refunds-platform/05-workflows-and-sequences.md` - Figure 4 (customer told, retry loop to PAID) and Figure 7 (delay message, post-window retries) with summaries.
- `sdd-refunds-platform/14-performance-and-capacity.md` - message estimate: at most eight messages per request.
- `sdd-refunds-platform/11-api-contracts.md` - API-03 purpose cites UC-04 E1.
- `sdd-refunds-platform/07-cross-cutting-concerns.md` - tenant setting `payoutRetryWindow`, read by both deployables.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §5 Tenant settings definition.
- `sdd-refunds-platform/decision-log.md` - CL-09 supersession note; new Business review register with the BO-03 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - e2e gate line: Shut - Stale (E4), chunk 19 not refreshed.
- `review-comments-tracker.md` - BO-03 Applied with the decision; targets extended; Progress; structural decision 1.

---

## Point 2 (BO-04): Refunds handled outside the portal (branch, cash, past the window, till returns and voids) never take points back, and the POS purchase mirror has no reversal contract (merged with SME-10, PA-04; in-branch channel: see SME-04)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| **BO-04** | **Off-portal refunds keep their points** | **Current** |
| BO-05 | Dependencies without owners or gates | Pending |
| BO-06 | Unsigned scope; follow-ups untracked | Pending |
| BO-07 | Legal clearances not dependencies | Pending |
| BO-08 | Multi-tenancy without a business case | Pending |
| BO-09 | Loyalty outcome, redemption, earn rate | Pending |
| BO-11 | No customer-care or back-office role | Pending |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** The promise is wider than the rule and the design.

- *Promise.* LOYALTY 01 Executive Summary: "Points earned on a purchase are taken back after a refund of that purchase." LOYALTY 04 In Scope: "Taking points back after a refund of a purchase." Neither limits it to one channel.
- *Rule.* LOYALTY 06a UC-02 BR-1: "Points earned on a purchase are taken back when the Refunds Portal reports the refund of that purchase as paid." LOYALTY 08 lists the Refunds Portal as the only refund source.
- *Channels the portal never sees.* REFUNDS 06a UC-01 E1 sends purchases older than 30 days to the branch; SDD 13a §17.1 Receipt lookup answers `RECEIPT_NOT_CARD_PAID` ("this purchase can be refunded at the branch") and caps split-tender receipts at the card-paid amount; REFUNDS 04 Out of Scope excludes cash refunds; till returns, exchanges, and post-voids happen at the till.
- *Design.* SDD 13d §17.4 Earn points rejects any POS Records record with a non-positive amount as `NON_POSITIVE_AMOUNT` into `purchase_import_rejection` (an alert fires on every run that rejects one), and Developer Notes keep the ledger append-only with no correction path. The SDD decision log OI-19 still carries "how till returns and voids affect points" as an open follow-up for the LOYALTY owner, while LOYALTY 13 reads "None open".

**Why it matters.** "Buy, earn, return at the till, keep the points" is a known loyalty abuse loop: a member pays cash, earns, gets a cash refund at the branch, and keeps the points. That inflates the points members hold, which becomes spendable value once redemption arrives (LOYALTY 12 Wishlist). LOYALTY/NFR-01 cannot catch it: over-credited members do not complain, and the difference follows BR-1, so it is not a mismatch; SDD 14 §18.2 balance correctness does not count it either. Neither BRD estimates how many refunds stay outside the portal, so the loss is unsized and unowned. If POS Records reports till returns as negative member records, every import run raises a rejection alert that nobody can act on.

| Option | Trade-off |
|---|---|
| A. Take points back for POS Records' return and void records too, now: a second refund source in LOYALTY 08, a wider BR-1, and an import that applies BR-3 to them | Closes the loop, but rests on POS Records data nobody has confirmed (whether it reports member returns and voids, and with the original receipt) |
| B. State today's scope truthfully now (LOYALTY 01 and 04 say points are taken back when the Refunds Portal reports a refund as paid; refunds outside it take none back in this release) and raise a gating LOYALTY open item on a second take-back source, with the loss sized and measured next to NFR-01 | The documents stop over-promising today; the decision waits for the POS Records facts, and off-portal refunds keep their points until then |
| C. Narrow the scope and accept the loss for good, with no measure | No work; the abuse loop stays open and invisible |

**Recommendation.** Option B. Aligning LOYALTY 01 and 04 with BR-1 is a consistency fix the BRD already implies. Adding POS Records' returns and voids as a second source depends on facts only the Retail IT team holds (whether POS Records reports member returns and voids with the original receipt number) and on the size of the loss, so it belongs to the LOYALTY owner as a gating open item; this also moves the SDD OI-19 follow-up into a BRD register.

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied chain-wide; tracker row BO-04 set to Applied.

**Files changed for Point 2:**

- `brd-loyalty-points/01-executive-summary-and-context.md` - Executive Summary limits the take-back to refunds the Refunds Portal reports as paid.
- `brd-loyalty-points/04-scope-and-personas.md` - In Scope bullet narrowed; Out of Scope lists refunds made outside the Refunds Portal.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-10 (open: a second take-back source and a loss measure; owner, decide-by); intro now names the open item.
- `brd-loyalty-points/decision-log.md` - register intro; new Business review register with the BO-04 record.
- `brd-loyalty-points/14-todo.md` - steps 1 and 2 In progress, Business review table, G1 and G2 Not met, gate Shut, TD-25 register row, 15 and 16 Stale.
- `brd-loyalty-points/15-implementation.md` - plan status Stale (gate rule: not refreshed while shut).
- `brd-loyalty-points/16-uat-bat-test-cases.md` - suite status Stale (same reason).
- `brd-loyalty-points/loyalty-points-brd-master.md` - Delivery Chunks states Stale; 17 locked by the shut gate.
- `sdd-refunds-platform/13d-service-loyalty.md` - Earn points: non-positive till returns and voids are rejected and take no points back; pointer to LOYALTY OI-10.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §1: the take-back follows refunds paid through the Refunds Portal.
- `sdd-refunds-platform/14-performance-and-capacity.md` - §18.2 Balance correctness: off-portal refunds are not a LOYALTY/NFR-01 difference.
- `sdd-refunds-platform/decision-log.md` - OI-19 tracking note; BO-04 record in the Business review register.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists BO-04.
- `review-comments-tracker.md` - BO-04 Applied; targets extended; Progress; structural decision 2.

---

## Point 3 (BO-05): External dependencies have no owner and no launch gate: CardPay, POS Records, the platform team, and two LOYALTY dependencies marked Confirmed that the SDD shows unverified (receipt number, member sign-in) (merged with BO-01)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| **BO-05** | **Dependencies without owners or gates** | **Current** |
| BO-06 | Unsigned scope; follow-ups untracked | Pending |
| BO-07 | Legal clearances not dependencies | Pending |
| BO-08 | Multi-tenancy without a business case | Pending |
| BO-09 | Loyalty outcome, redemption, earn rate | Pending |
| BO-11 | No customer-care or back-office role | Pending |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *No owners.* Every Owner cell of the SDD risk table is a marker (SDD 01 §4, R-01 to R-06), including the three risks that can stop the business: R-02 (CardPay cannot refund to the original card, impact H), R-03 (the receipt-number link between the products), and R-04 (a POS Records outage blocks new requests and earning, impact H).
- *CardPay unconfirmed.* REFUNDS 02 Dependencies holds one line: "The payment provider must support refunds to the original card. (Hard dependency)", with no status, owner, or date. SDD 11 §15.3 API-02 and §15.6 still ask whether CardPay honours an idempotency key, whether the result comes back in the response or by callback, and which reference of the original payment it needs; its fees appear nowhere. REFUNDS 14 showed the gate open with "Next action: None" (Point 1 shut it for other reasons).
- *LOYALTY "Confirmed" rows the SDD contradicts (BO-01).* LOYALTY 02 Dependencies marks "POS Records (every branch purchase by a member, reported on the day of the purchase)" and "Member sign-in (existing loyalty program account)" as Confirmed, and LOYALTY 15 plans every task with "Assumption: none". Yet SDD 11 §15.3 API-04 is `TBD - external` and asks whether POS Records can send the receipt number with each member purchase (R-03); SDD 13d rejects every member purchase without one, so a "no" means no member earns a single point. SDD 01 §3 assumption 3 still asks whether members sign in with an account in this realm or through the loyalty programme's own identity provider. R-03 is rated M impact although, since CL-19, it can stop all earning.
- *Platform and partners.* SDD 01 §3 assumption 11 assumes a shared on-prem team already runs Kafka, Keycloak, PostgreSQL, and Kubernetes, but no service level from it, or from the Retail IT team for POS Records, backs the 2-hour monthly budget of REFUNDS/NFR-02. SDD 16 §20.3 leaves the escalation path to CardPay, MsgHub, and the Retail IT team blank.

**Why it matters.** The answers that decide whether the products can work at all arrive, if ever, after build: a CardPay that needs card data forces a new ADR and a payout redesign (R-02); a POS Records that cannot send receipt numbers with member purchases stops every point; a member sign-in that lives in another identity provider changes the identity model. The "Confirmed" labels tell planners there is nothing to chase, so nobody chases it, and nothing in either BRD stops a task from starting before its partner has answered.

| Option | Trade-off |
|---|---|
| A. Give every dependency an owner, a status, what must be confirmed, and the task it must be confirmed before: REFUNDS 02 becomes a table (CardPay, POS Records receipt lookup, MsgHub); the two LOYALTY rows become "To confirm" with the receipt number named; the SDD names owners for R-02 to R-06, re-rates R-03 to High impact, and adds the platform team's service levels to §3 assumption 11; the confirmations gate the BRD delivery outputs | Every blocker is owned and visible before build; the BRD gates stay shut until partners answer in writing |
| B. Leave the BRD lists as they are and track the confirmations only in the SDD (§15.6 and §4 owners) | Fewer BRD edits; anyone planning from the BRDs still reads "Confirmed" |
| C. Downgrade the two LOYALTY labels only | Removes the false signal; CardPay, POS Records, and the platform still have no owner or gate |

**Recommendation.** Option A. The dependencies are business commitments, so their status belongs in the BRDs that planners read, and each needs an owner who chases it before the task that relies on it. R-01's owner is left to BO-12 (the rollout point). Owners are named by the roles the documents already use: the product manager of each BRD for the business dependencies, the Retail IT team for POS Records availability, the Solution Architecture Team for the design risks, and the data protection owner for R-06.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row BO-05 set to Applied.

**Files changed for Point 3:**

- `brd-refunds-portal/02-glossary-assumptions-facts.md` - Dependencies table: CardPay, POS Records receipt look-up, MsgHub, each To confirm with owner, what to confirm, and the task it gates.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-04 decision record (applied) and Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row BO-05, G1 waits for the three confirmations, stale lists.
- `brd-loyalty-points/02-glossary-assumptions-facts.md` - Dependencies table gains Owner, What must be confirmed, Needed before; POS Records (with the receipt number) and Member sign-in To confirm.
- `brd-loyalty-points/decision-log.md` - TD-01 and TD-08 superseded-in-part notes; BO-05 record.
- `brd-loyalty-points/14-todo.md` - TD-26 and TD-27 register rows, Business review row, G1, stale lists.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §3 assumptions 3, 6 (to confirm) and 11 (platform service levels, owner, re-open trigger); §4 owners R-02 to R-06, R-03 impact High with the earning stop stated.
- `sdd-refunds-platform/08-integrations.md` - INT-03 notes: both POS Records uses are dependencies to confirm.
- `sdd-refunds-platform/11-api-contracts.md` - §15.6: each document requested by the BRD dependency owner, before the task it gates.
- `sdd-refunds-platform/16-operations-runbook.md` - §20.3 escalation points to the dependency and risk owners (marker kept for the path itself).
- `sdd-refunds-platform/decision-log.md` - BO-05 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists BO-05.
- `review-comments-tracker.md` - BO-05 Applied; targets extended; Progress.

---

## Point 4 (BO-06): Build proceeds on unsigned scope (LOYALTY v1.1 and v1.2 unapproved, SDD Draft) while about ten business decisions the SDD handed to the BRD owners sit in no BRD register, and a BRD answer (LOYALTY TD-15) never reached the SDD (merged with PM-09, DC-07)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| **BO-06** | **Unsigned scope; follow-ups untracked** | **Current** |
| BO-07 | Legal clearances not dependencies | Pending |
| BO-08 | Multi-tenancy without a business case | Pending |
| BO-09 | Loyalty outcome, redemption, earn rate | Pending |
| BO-11 | No customer-care or back-office role | Pending |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *Unsigned scope.* LOYALTY 00 Changes Log: v1.1 (24 decisions, earning brought into scope by TD-04, take-back rules changed) and v1.2 have "Approved By: -", and the cover reads In Review. LOYALTY 14 step 3 evidence records those decisions as the interviewer's recommended answers from a non-interactive session. The SDD cover is Draft with markers for Reviewers and Approvers (SDD 00), and the SDD decision log notes that the BRD's In Review status is something the generator "does not gate on". LOYALTY 15 and 16, SDD v1.2, the e2e chunk, and a child LLD were all produced on top.
- *Owner decisions outside the BRD registers.* The SDD decision log hands these to the BRD owners as follow-ups: the card-only rule for cash and split tender (OI-13, which already shows the customer a 422 `RECEIPT_NOT_CARD_PAID` at REFUNDS UC-01 step 2), a second receipt factor at look-up (OI-14, alongside a 429 look-up limit no use case mentions), who holds the staff administrator account (CL-02), an active staff alert (CL-03), the real retention values (CL-05, CL-15), the post-window retry interval (CL-09), and a "member left" signal (CL-22); SDD 01 §2.2 still asks native app or web. REFUNDS 13 had one closed item, and LOYALTY 13 read "None open". Points 1 to 3 already registered three of them (REFUNDS OI-03, LOYALTY OI-10, LOYALTY TD-27).
- *A BRD answer that never arrived.* LOYALTY TD-15 settled that "at any time" sets no availability measure in this release, yet SDD 14 §18.2 still carries an open marker asking for a LOYALTY availability target.

**Why it matters.** Build can start on scope the Head of Retail never signed, with customer-visible behaviour (a refused cash receipt, a look-up limit) that no BRD use case or UAT case states, and with owner decisions nobody is chasing because no register holds them. The documents also disagree on whether LOYALTY has an availability target, so testers and operators cannot tell what to measure.

| Option | Trade-off |
|---|---|
| A. Register every SDD follow-up not yet registered as an open item in the owning BRD's chunk 13 (owner, decide-by), with the post-window interval folded into REFUNDS OI-03; close the SDD §18.2 marker by citing LOYALTY TD-15; make sign-off a gate: each BRD delivery gate gains "this version signed off by its approver", REFUNDS reads In Review until the review's changes are signed off, and the SDD records that its child LLD is refreshed and build starts only after the SDD is Approved and its source BRD versions are signed off | Every owner decision is visible where its owner works, and nothing is built on unsigned scope; the BRD gates stay shut longer |
| B. One cross-document register in SDD chunk 18 ("Awaiting BRD owner" items) that both BRDs and the SDD gate on | One home; BRD owners must read the SDD to find their own decisions |
| C. Register the follow-ups only and leave sign-off to project governance | Decisions become visible; build can still start on unsigned scope |

**Recommendation.** Option A. A BRD register is where its owner and its delivery gate already look, so a follow-up registered there cannot be missed; the legal follow-ups (lawful basis, erasure path, PCI DSS and certification scope) are left to BO-07, the next point, which is about exactly those. Making sign-off a gate is what the LOYALTY cover already implies ("In Review until version 1.1 is signed off") but nothing enforced.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row BO-06 set to Applied.

**Files changed for Point 4:**

- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-05 decision record (applied); OI-06 to OI-11 open (card-only rule, look-up check and limit, staff accounts, manager alert channel, keeping periods, native app or web); OI-03 extended with the post-window interval; Resolution Log row.
- `brd-refunds-portal/00-cover-and-changelog.md` - status In Review until the review's changes are signed off.
- `brd-refunds-portal/14-todo.md` - Business review row BO-06, G1 list, new G6 sign-off condition, next action, stale lists.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-11 open (member-left signal); intro lists OI-10 and OI-11.
- `brd-loyalty-points/00-cover-and-changelog.md` - status names the sign-off gate.
- `brd-loyalty-points/decision-log.md` - BO-06 record.
- `brd-loyalty-points/14-todo.md` - TD-28 row, Business review row, G1 list, G6 sign-off condition, next action, stale lists.
- `sdd-refunds-platform/14-performance-and-capacity.md` - §18.2 availability: marker replaced by the LOYALTY TD-15 answer.
- `sdd-refunds-platform/00-cover-and-changelog.md` - Document Lineage sign-off rule.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §2.2 and §3 assumption 3 markers point to REFUNDS OI-11 and LOYALTY TD-27.
- `sdd-refunds-platform/decision-log.md` - tracking notes on OI-13, OI-14, CL-02, CL-03, CL-05, CL-15, CL-22; BO-06 record.
- `review-comments-tracker.md` - BO-06 Applied; targets extended; Progress; structural decision 3.

---

## Point 5 (BO-07): Legal clearances that can stop go-live (lawful basis, processor agreements and data location, retention periods, PCI scope, loyalty programme terms) are not listed as dependencies

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| **BO-07** | **Legal clearances not dependencies** | **Current** |
| BO-08 | Multi-tenancy without a business case | Pending |
| BO-09 | Loyalty outcome, redemption, earn rate | Pending |
| BO-11 | No customer-care or back-office role | Pending |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (this point touches card-data security and personal-data processing).**

- *Lawful basis.* Under the GDPR every use of personal data needs a recorded legal ground (for example, performing the customer's refund). It protects customers from uses they never expected; without it, a regulator or a customer complaint can stop the processing, which here means stopping refunds.
- *Processor agreements and data location.* When a partner handles our customers' data for us (MsgHub sends messages with their contact details; CardPay receives payment references), a written data processing agreement binds it to our instructions and security, and the place it processes the data decides whether transfer rules apply. Without one, the retailer, as controller, is answerable for what the partner does.
- *PCI DSS scope.* The card-industry security standard applies to every system that stores, processes, or transmits card data. Keeping card data out of the platform keeps it out of scope; if CardPay turns out to need card data from us, the platform falls into scope, with audits and controls the design does not have.

**Issue.** Neither BRD lists a legal item among its dependencies (REFUNDS 02 and LOYALTY 02 now list partners only). The SDD leaves the lawful basis to "the one the retailer's data protection owner records" (SDD 13a §17.1 Compliance, CL-08), the PCI DSS scope to "a scope the retailer's security owner confirms with CardPay" (SDD 13b §17.2 Compliance, CL-10), and certification scope to the security owner; its 10-year record retention exists only to prevent an early purge (SDD decision log CL-05, now REFUNDS OI-10). No document mentions a data processing agreement with MsgHub or CardPay or where they process data. For loyalty, the program rules (whole-euro earning, points taken back after refunds: LOYALTY 03, UC-02 BR-1 to BR-4) may differ from what members of the existing program agreed to, and nothing checks the program terms.

**Why it matters.** Each of these can stop go-live after the build is finished: a missing processor agreement, an unrecorded lawful basis, a card-scheme finding, or members contesting take-backs their terms never mentioned. Because none is a listed dependency, none has an owner or a deadline.

| Option | Trade-off |
|---|---|
| A. Add a "Legal clearances" table to REFUNDS 02 and LOYALTY 02 (each clearance, owner, what must be confirmed, needed before go-live or before the task it shapes), point the SDD Compliance sections to the rows, and make the clearances a condition of BAT sign-off when chunk 16 is refreshed | Every legal blocker is owned and dated before release; planning and testing are not held up by legal timelines |
| B. Keep them in the SDD Compliance sections, with owners | No BRD change; the business owners who must obtain the clearances do not see them |
| C. A plus legal sign-off as a condition of each BRD's delivery gate (chunks 15 and 16) | Strongest, but blocks the implementation plan and the test cases on legal timelines that only gate the release |

**Recommendation.** Option A. The clearances gate the release, not the writing of the plan and the test cases, so they belong in the dependency lists with "needed before go-live", and in the BAT exit criteria; the one that shapes the design (the card-payment security scope, which decides whether card data may enter the platform) is due before TASK-03, like the CardPay dependency. Retention values stay in REFUNDS OI-10 and the member-left question in LOYALTY OI-11; the clearance rows point to them.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row BO-07 set to Applied.

**Files changed for Point 5:**

- `brd-refunds-portal/02-glossary-assumptions-facts.md` - Legal clearances table L1 to L5 (owner, what to confirm, needed before go-live; L4 before TASK-03).
- `brd-loyalty-points/02-glossary-assumptions-facts.md` - Legal clearances table L1 (lawful basis) and L2 (loyalty program terms).
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-12 decision record (applied) and Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row BO-07 (16 exit criteria, TASK-03 waits for L4), stale lists; rows put back in point order.
- `brd-loyalty-points/decision-log.md` - BO-07 record.
- `brd-loyalty-points/14-todo.md` - Business review row BO-07, stale lists.
- `sdd-refunds-platform/13a-service-refund.md` - Compliance: lawful basis and certifications point to REFUNDS L1, L2, L5.
- `sdd-refunds-platform/13b-service-payout.md` - Compliance: PCI DSS scope confirmed before TASK-03 (REFUNDS L4).
- `sdd-refunds-platform/13c-service-notification.md` - Compliance: lawful basis and the MsgHub agreement (REFUNDS L1, L2).
- `sdd-refunds-platform/13d-service-loyalty.md` - Compliance: lawful basis and program terms (LOYALTY L1, L2).
- `sdd-refunds-platform/decision-log.md` - tracking notes on CL-08, CL-10, CL-17, CL-25; BO-07 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists BO-07.
- `review-comments-tracker.md` - BO-07 Applied; targets extended; Progress.

---

## Point 6 (BO-08): The platform is built multi-tenant with no business reason, commercial model, or running-cost estimate in either BRD

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| **BO-08** | **Multi-tenancy without a business case** | **Current** |
| BO-09 | Loyalty outcome, redemption, earn rate | Pending |
| BO-11 | No customer-care or back-office role | Pending |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** Neither BRD mentions another retailer, brand, resale, or white-label offer. The SDD makes the platform multi-tenant "by platform rule" (SDD 01 §3 assumption 7; ADR-03: "Single tenant rejected: the platform rule makes every product multi-tenant") and pays for it throughout: a separate host and sign-in client per tenant (SDD 12 §16.2), per-tenant settings and database row-level security (SDD 07 §11.2), per-tenant monitoring labels (§11.4), and choices deferred until "a second tenant" (ADR-10). Nothing states pricing, packaging, onboarding cost, a tenant contract, or per-tenant branding (SDD 02 §6 asks for a single brand colour). Running costs a funding decision needs are never estimated: up to 9,600 customer messages a month (28,800 at the seasonal rate, SDD 14 §18.1, after Point 1), CardPay fees, and three databases plus Kafka.

**Why it matters.** The multi-tenant cost is certain and the return is undefined, so a sponsor reading the BRDs cannot see why the platform is built this way or what it costs to run. A reader may also take "multi-tenant" as a commercial promise (selling the platform to other retailers) that nobody has made.

| Option | Trade-off |
|---|---|
| A. Keep multi-tenancy and say plainly why: it is the house platform rule, not a commercial offer; SDD §3 assumption 7 and ADR-03 state that neither BRD plans a second tenant and list what each tenant costs to onboard; §18.1 adds the running-cost drivers (messages, payouts, databases, Kafka, sign-in, compute), priced once CardPay's fees (REFUNDS 02 Dependencies 1) and the platform team's charges (§3 assumption 11) are known | The reason and the cost are visible; no commercial case is invented |
| B. Ask the business owners to state a multi-tenant purpose (group brands, resale, white-label) with pricing, packaging, and onboarding, as open items in both BRDs | A business case if one exists; likely invents a purpose nobody has |
| C. Build single-tenant now | Cheaper today; breaks the non-negotiable house rule and costs a rebuild for any second tenant |

**Recommendation.** Option A. Multi-tenancy is a non-negotiable house platform rule (the SDD cites it as such), not a business requirement, so the BRDs need no commercial model; what is missing is an honest statement of the reason and the cost, and the running-cost drivers the funding decision needs. Unit prices come from the partners and the platform team; the SDD names the drivers without guessing prices.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied; tracker row BO-08 set to Applied. No BRD changed.

**Files changed for Point 6:**

- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §3 assumption 7: no second tenant planned; multi-tenancy is the house rule, not a commercial offer.
- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-03 Consequences: not a commercial offer; per-tenant onboarding cost.
- `sdd-refunds-platform/14-performance-and-capacity.md` - §18.1 Running-cost drivers (no prices guessed).
- `sdd-refunds-platform/decision-log.md` - BO-08 record.
- `review-comments-tracker.md` - BO-08 Applied; Progress.

---

## Point 7 (BO-09): The loyalty release has no business outcome, no dated redemption phase, no report of points owed, and an earn rate with no business owner

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| **BO-09** | **Loyalty outcome, redemption, earn rate** | **Current** |
| BO-11 | No customer-care or back-office role | Pending |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *No outcome.* LOYALTY 01 Business Objectives: "1. Members trust their points balance. 2. Members can check their points at any time without calling a branch." Both are about seeing a balance; neither says why the retailer funds points (repeat visits, more spending, keeping customers, fewer calls to branches), and neither has a baseline.
- *Redemption undated.* LOYALTY 04 Out of Scope: "Redeeming points (a later phase)", with no reason, date, or trigger; the only use for points the BRD names (12 Wishlist: "Redeem points at checkout") is outside this release, so members are asked to trust a balance they cannot spend.
- *No view of what is owed.* LOYALTY 09: "Not applicable for this release." Finance gets no figure for points issued, outstanding, or taken back, which is what the retailer will owe members once points can be spent. Member and purchase volumes are unknown (SDD 14 §18.1 marker), so neither value nor cost can be sized.
- *Earn rate.* LOYALTY 03 fixes "1 point for each whole 1 EUR spent", but the SDD holds a per-tenant "points earn rate" in deployment settings (SDD 07 §11.2) with no business owner or effective date, and takes points back at the rate in force on the refund date (SDD 13d §17.4 Take points back: "paidAmount rounded down to whole euros, times the tenant's earn rate"), so any rate change takes back a different number of points than were earned.

**Why it matters.** Without an outcome objective the sponsor cannot tell whether the program pays for itself, and without a horizon for redemption members accumulate a balance with no stated use. Points issued today become a liability the day they can be spent, and nobody reports it. A rate change through a deployment setting would silently break UC-02 BR-3 ("never more than the purchase earned") and LOYALTY/NFR-01 for every purchase refunded after the change.

| Option | Trade-off |
|---|---|
| A. Decide everything now: add an outcome objective, a redemption date, and a points-owed report to the BRD | Complete on paper, but invents a target, a baseline, and a date nobody has supplied |
| B. Fix the earn rate now (it is the LOYALTY 03 rule, owned by the LOYALTY product manager; each purchase keeps the rate it earned at, and its take-backs use that rate), and raise the outcome objective with its baseline and volumes, and the redemption phase with its reason, horizon or trigger, and a points-owed report for finance, as LOYALTY open items | The take-back stays consistent with what was earned today; the business facts come from their owner |
| C. Fix the earn rate only | Consistent ledger; the program's purpose and liability stay unstated |

**Recommendation.** Option B. Keeping each purchase's rate is a consistency fix that follows from BR-3 and NFR-01, and the rule's owner is already the LOYALTY product manager. The outcome, its baseline, the member volumes, and the redemption horizon are business facts only the owner can supply; a points-owed report matters most once points can be spent, so it belongs with the redemption item.

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied chain-wide; tracker row BO-09 set to Applied.

**Files changed for Point 7:**

- `brd-loyalty-points/03-definitions-and-domain-concepts.md` - "Earning rule changes": the BRD sets and owns the rule; a purchase keeps the rule it earned under.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-12 (outcome objective, starting figure, volumes) and OI-13 (redemption horizon, points-owed report) open.
- `brd-loyalty-points/decision-log.md` - BO-09 record.
- `brd-loyalty-points/14-todo.md` - TD-29 and TD-30 rows, Business review row, G1 list, stale lists.
- `sdd-refunds-platform/07-cross-cutting-concerns.md` - §11.2: the earn rate is the LOYALTY 03 rule with its owner; purchases record their rate.
- `sdd-refunds-platform/13d-service-loyalty.md` - Earn points records `earn_rate`; Take points back uses it; Tables Design row; Figure 24 attribute.
- `sdd-refunds-platform/14-performance-and-capacity.md` - §18.1 member-volume marker points to LOYALTY OI-12.
- `sdd-refunds-platform/decision-log.md` - BO-09 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists BO-09.
- `review-comments-tracker.md` - BO-09 Applied; targets extended; Progress.

---

## Point 8 (BO-11): No customer-care or back-office role: complaints can be investigated only through break-glass access, and head-office and staff-administrator capabilities sit outside both matrices (merged with PM-08; approval limit: see SME-05; customer-care part of SME-04 resolved here)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| **BO-11** | **No customer-care or back-office role** | **Current** |
| BO-12 | No rollout plan; R-01 unowned | Pending |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (this point is about who may see personal data).**

- *Least privilege.* Each role sees only what its job needs; a support agent who must answer "where is my refund" needs to read one request, not decide it or see every customer. The rule limits the harm of a mistaken or malicious user, and it is what REFUNDS/NFR-04 ("Only the customer and their branch's manager can see a request") expresses.
- *Break-glass.* Emergency, approved, time-boxed, audited access to production data outside the application (SDD 16 §20.3). It exists for incidents and approved data requests; used for routine work, it bypasses every role check the application enforces and its audit trail turns into noise, so real misuse is no longer visible.

**Issue.**

- *Customer care.* REFUNDS 01: "18% of complaints to customer care are about slow or lost refund requests", and LOYALTY/NFR-01 is judged on "balance complaints upheld per month". Yet neither BRD has a customer-care or back-office persona (REFUNDS 04, LOYALTY 04), REFUNDS 10 NFR-04 lets only the customer and the branch manager see a request, and only the member sees their points (LOYALTY 07). LOYALTY 13 OI-09 refers to "the complaint team", which no persona describes, and LOYALTY 16 P7 relies on a complaint log that no requirement creates.
- *Operators and staff administration.* SDD 12 §16.1: "Neither BRD names a platform operator"; §16.4.3 is Not applicable; the tenant staff administrator of §16.6 sits outside both matrices. The only way to look at a customer's refund or a member's ledger is break-glass (SDD 16 §20.3).
- *Head office (PM-08).* The Operations Lead and Head of Retail who reviewed and approved REFUNDS 1.0 (REFUNDS 00) have no persona and no cross-branch view; branch managers can approve any amount with no oversight (the approval limit belongs to SME-05, the report to PM-05).

**Why it matters.** Agents will answer blind or open break-glass for routine calls, which defeats its purpose and its audit. The complaint objective cannot be measured, because nobody receives, investigates, or upholds a balance complaint, and its cost of support is unknown. Provisioning staff, removing a manager who has left, and support access have no permissions owned by either BRD.

| Option | Trade-off |
|---|---|
| A. Add now a read-only Customer Care persona to both BRDs (find a refund by reference and see it; see a member's movements), amend NFR-04 to name it, say who upholds a balance complaint and how it is logged, and add head-office and staff-administrator rows to the matrices; the SDD adds the roles, permissions, endpoints, and audit | Support works from day one; a scope and privacy change decided without the sponsor, the Operations Lead, or the data protection owner |
| B. Raise the roles as gating open items in both BRDs (customer care: what it sees and does; who upholds and logs a balance complaint, and how fast; head office: what it sees; staff administration with REFUNDS OI-08), with A as their recommended answer, and state now that break-glass is never a routine support channel | The privacy model changes only with its owners' agreement; until decided, customer care has no platform access |
| C. Accept that customer care works without platform access | No change; complaints stay unanswerable and NFR-01 cannot be operated |

**Recommendation.** Option B. The need is clear from the BRDs' own objectives, but a new persona widens who sees personal data (NFR-04) and adds scope the Head of Retail approved without; the sponsor, the Operations Lead, and the data protection owner must agree what care and head office may see. Stating now that break-glass is not a support channel closes the immediate misuse path.

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied chain-wide; tracker row BO-11 set to Applied.

**Files changed for Point 8:**

- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-13 open (customer care, head office, staff administration; read-only roles recommended).
- `brd-refunds-portal/14-todo.md` - Business review row BO-11, G1 list; Stale cells now point to the Business review table.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-14 open (who receives, upholds, and logs balance complaints).
- `brd-loyalty-points/14-todo.md` - TD-31 row (moved into the P1 block), Business review row, G1 list; Stale cells point to the Business review table.
- `sdd-refunds-platform/12-centralized-user-roles.md` - §16.1: no platform role for these people until the BRD items close; break-glass is not support.
- `sdd-refunds-platform/16-operations-runbook.md` - §20.3: break-glass serves incidents and approved data requests only.
- `sdd-refunds-platform/decision-log.md` - BO-11 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists BO-11.
- `review-comments-tracker.md` - BO-11 Applied; targets extended; Progress.

---

## Point 9 (BO-12): No rollout plan for the 40 branches (pilot, waves, training, customer communication, languages, seasonal peak) and no owner for R-01 (paper-channel part: see SME-04)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| **BO-12** | **No rollout plan; R-01 unowned** | **Current** |
| SME-01 | Refund paid without goods returned | Pending |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** REFUNDS 15 Waves orders only the build tasks (TASK-01 in wave 1, TASK-02 and TASK-03 in wave 2). Nothing in either document plans how the portal reaches 40 branches: no pilot, no branch-by-branch waves, no cut-over date, no branch training, and nothing telling customers the portal exists or that they must register themselves (SDD 12 §16.6). No document lists the customer languages, while the SDD supports one locale per tenant (SDD 07 §11.2). Nothing stops a launch during the 3-week seasonal peak, when requests triple (REFUNDS 02 Facts 2). SDD 01 §4 R-01 ("Branches keep recording refunds on paper during rollout") has markers for both its mitigation and its owner. The paper channel that the design itself keeps for some cases (REFUNDS 06a UC-01 E1; SDD 13a `RECEIPT_NOT_CARD_PAID`) belongs to SME-04.

**Why it matters.** Launching everywhere at once, untrained, possibly into the seasonal peak, risks both refund objectives at the same moment (REFUNDS 01 Objectives 1 and 2): requests pile up with managers who have not used the portal, customers keep walking in, and branches fall back to paper, which is exactly R-01, and nobody owns it.

| Option | Trade-off |
|---|---|
| A. Decide now the rollout constraints the documents support (go-live in pilot branches first, then waves to every branch; no go-live or wave inside the seasonal sales period) as REFUNDS 02 Constraint 3, name the Operations Lead as R-01's owner with the rollout as its mitigation, and raise the rollout plan itself (pilot branches, waves and dates, branch training, customer communication, languages, and the buffer before the peak) as a gating REFUNDS open item owned by the Operations Lead | The safe shape is fixed now; dates and branches come from the person who runs the branches |
| B. Write the whole rollout plan now (branches, dates, languages) | Complete, but invents dates, branches, and languages |
| C. Leave rollout to project management and only name R-01's owner | Minimal; nothing stops a big-bang launch into the peak |

**Recommendation.** Option A. A pilot-then-waves rollout outside the seasonal peak follows from REFUNDS 02 Facts 2 and R-01 itself, while the branch list, dates, training, and languages are facts only operations can supply. The Operations Lead reviewed REFUNDS 1.0 and runs the branches, so the paper risk sits naturally with that role.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row BO-12 set to Applied.

**Files changed for Point 9:**

- `brd-refunds-portal/02-glossary-assumptions-facts.md` - Assumptions / Constraints 3: pilot then waves, none inside the seasonal sales period.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-14 decision record (applied); OI-15 open (the rollout plan, owner Operations Lead); Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row BO-12, G1 list.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §4 R-01: mitigation and owner (markers replaced).
- `sdd-refunds-platform/07-cross-cutting-concerns.md` - §11.2: one locale per tenant until the rollout plan settles the languages.
- `sdd-refunds-platform/decision-log.md` - BO-12 record.
- `review-comments-tracker.md` - BO-12 Applied; targets extended; Progress.

---

## Point 10 (SME-01): A refund is paid without the goods being returned or inspected: no condition, disposition, or evidence step before payout

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| **SME-01** | **Refund paid without goods returned** | **Current** |
| SME-02 | Paid refunds not posted to POS or finance | Pending |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** REFUNDS 03 Refund request lifecycle goes Submitted, then Approved (in full or in part) or Rejected, then Paid; nothing in between covers the customer handing the goods back, staff checking their condition (tags, packaging, signs of use, the claimed damage), or deciding what happens to the item (back to stock, written off, returned to the supplier). REFUNDS 05 Branch Manager Journey says the manager "checks each one", and REFUNDS 06b UC-04 steps 3 to 6 go straight from opening the request to Approve and payout, but the manager has nothing to check against: no photos (SDD 02 §6 Object Storage: Not applicable, "no files or exports are stored in this release"), no goods-received confirmation, no condition notes, and no view of the customer's past refunds. The rules branches follow today are referenced only as "Store refund policy v3" (REFUNDS 12 Appendix).

**Why it matters.** Money leaves on one click for goods the store may never see: the classic returnless-refund and "wardrobing" (use, then return) exposure, which triples with the seasonal peak (REFUNDS 02 Facts 2). Stock keeps showing the item as sold, faulty items cannot be claimed back from suppliers, and each manager will improvise a different check across 40 branches.

| Option | Trade-off |
|---|---|
| A. Decide now: approval waits until the goods are back at the branch; the manager records their condition and what happens to them (restock, write off, return to supplier) before approving | Closes the exposure; makes every customer visit the branch, which changes the product's promise, decided without the store policy |
| B. Decide now: define which refunds may be returnless (by reason and amount, with photo evidence) and require the goods for the rest | Keeps small refunds fully online; needs photo storage and thresholds nobody has set |
| C. Raise a gating REFUNDS open item, owned by the Operations Lead with Store refund policy v3 as its source: must the goods come back before payout, who confirms and inspects them, what is recorded, and whether any refund may be returnless, with A as its recommended answer and B as the alternative for low-value items | The decision rests on the policy the branches already follow; until it closes, UC-04 build waits |

**Recommendation.** Option C. Whether goods must return before payout is a policy choice that changes the customer journey (an online request may still mean a branch visit) and the branch workload, and the rules already exist in Store refund policy v3, which no reviewer has seen. Recording A as the open item's recommended answer keeps the safe default visible to the owner.

Accept, or adjust?

**User:** Accept C.

**Applied (skill, chat):** Option C applied; tracker row SME-01 set to Applied.

**Files changed for Point 10:**

- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-16 open (the goods before the money; owner Operations Lead, source Store refund policy v3).
- `brd-refunds-portal/14-todo.md` - Business review row SME-01, G1 list.
- `sdd-refunds-platform/02-ecosystem-overview.md` - §6 Object Storage notes that photo evidence would need storage, pending OI-16.
- `sdd-refunds-platform/decision-log.md` - SME-01 record.
- `review-comments-tracker.md` - SME-01 Applied; targets extended; Progress.

---

## Point 11 (SME-02): Paid refunds are never posted back to the POS, stock, finance, or a fiscal till, and no one owns payout reconciliation

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| **SME-02** | **Paid refunds not posted to POS or finance** | **Current** |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Pending |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** In branch retail a refund is a till transaction: it reverses the sale in the sales and VAT takings, returns the item to stock, and nets against the branch's takings. Here the payment provider pays outside the POS and nothing flows back. REFUNDS 08 lists Point-of-Sale Records with Direction "We receive" only (receipt look-up); SDD 08 §12 INT-03 is read-only (look-up and purchase import). There is no stock, ERP, or ledger integration, and no credit note or return document, which invoiced business customers need and several EU fiscal-till regimes require for any return (the country is unnamed: SME-03). The reconciliation of paid refunds against CardPay's settlement records is parked in SDD 17 §22 item 2 ("once CardPay offers them"), with no finance actor to own it.

**Why it matters.** At about 1,200 refunds a month (REFUNDS 02 Facts 1), branch sales and VAT stay overstated, stock counts drift, and finance inherits a manual month-end reconciliation; where a fiscal till is mandatory, refunds made outside it may not be lawful. The one control that would prove REFUNDS/NFR-01 ("never lost or paid twice") against the provider's own records has no owner.

| Option | Trade-off |
|---|---|
| A. Decide now: post each paid refund back as a return to POS Records or the ERP (and to the fiscal device where required), and add a per-branch payout reconciliation report for finance | Books and stock stay right; a new outbound integration whose target system, format, and fiscal rules nobody has confirmed |
| B. Keep the till as the system of record: the portal handles request and approval, and the branch completes the refund at the till | Postings and fiscal rules come for free; drops the card payout through the payment provider and the remote experience the product promises |
| C. Raise a gating REFUNDS open item owned by the product manager with finance and the Retail IT team: what a paid refund must update (sales and VAT, stock, a fiscal record, a credit note), through which system, and who owns reconciling payouts with the provider's settlement; with A as its recommended answer | The facts come from the people who own the books, the tills, and the country's rules; until it closes, the books gap stays known and owned |

**Recommendation.** Option C. What must be posted, and where, depends on the fiscal regime of a country not yet named (SME-03) and on what POS Records and the finance systems accept, which only finance and the Retail IT team know; B would reverse the product's core design. The item also gives payout reconciliation an owner.

Accept, or adjust?

**User:** Accept C.

**Applied (skill, chat):** Option C applied; tracker row SME-02 set to Applied.

**Files changed for Point 11:**

- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-17 open (what a paid refund must update outside the portal; reconciliation owner).
- `brd-refunds-portal/14-todo.md` - Business review row SME-02, G1 list.
- `sdd-refunds-platform/08-integrations.md` - INT-03 notes: read-only today; posting back is REFUNDS OI-17.
- `sdd-refunds-platform/17-appendix-and-wishlist.md` - §22 item 2: owner and posting question point to REFUNDS OI-17.
- `sdd-refunds-platform/decision-log.md` - SME-02 record.
- `review-comments-tracker.md` - SME-02 Applied; targets extended; Progress.

---

## Point 12 (SME-03): The market is unnamed, and faulty-goods claims go through the 30-day change-of-mind rule instead of a statutory guarantee path

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| **SME-03** | **Market unnamed; faulty goods on the 30-day rule** | **Current** |
| SME-04 | No path for branch-handled refunds | Pending |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** Amounts are in EUR, but neither BRD names the country or countries the 40 branches are in (REFUNDS 01, 02), and the SDD records "Local regulations: none stated by the BRDs" in all four services (SDD 13a to 13d Compliance). REFUNDS 06a UC-01 BR-1 ("A refund can be requested only within 30 days of purchase") and E1 ("the purchase is older than 30 days ... they can visit the branch") treat every request as a commercial return. A faulty or non-conforming item (the UAT example reason is "Damaged", REFUNDS 16 TC-REQ-01) usually falls under a statutory legal guarantee instead; where EU consumer law applies, that guarantee lasts at least two years, with repair or replacement first and a price reduction or refund after. Country rules on how long records are kept (REFUNDS OI-10) and on documenting returns (REFUNDS OI-17) cannot be checked until the market is named.

**Why it matters.** Inside 30 days the portal hands out money where the law would let the seller repair or replace; after 30 days E1 turns a valid legal claim into an off-system branch matter, which reads to the customer like a refusal of a right they have. Without a named market, nobody can confirm that the keeping periods, the return documents, or the 30-day policy itself meet local law.

| Option | Trade-off |
|---|---|
| A. Name the country now and add the per-market rules | Settles it, but the market is a fact no document holds |
| B. Raise a gating REFUNDS open item: name the market or markets, add a per-market regulatory section to 02 that the SDD Compliance sections trace to, and split the request reason into change of mind (30-day policy) and faulty or not as described (the legal guarantee path: at the branch, or in the portal without the 30-day limit), checking OI-10 and OI-17 against the market's rules | Every legal rule gets a traceable source; the split waits for the market and its law |
| C. Split the reasons now, sending faulty claims to the branch at any time, and raise only the market | Fixes the guarantee path early, on an assumption about which law applies |

**Recommendation.** Option B. The country is a fact, and the guarantee rules follow from it; EUR alone does not prove which law applies. One open item that names the market and derives the reason split, the keeping periods, and the return documents from its law avoids guessing, and the SDD Compliance sections then trace to a real source instead of "none stated".

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied; tracker row SME-03 set to Applied.

**Files changed for Point 12:**

- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-18 open (the market, its rules, and the faulty-goods path).
- `brd-refunds-portal/14-todo.md` - Business review row SME-03 (TC-REQ-01 example reason as a refresh item), G1 list.
- `sdd-refunds-platform/13a-service-refund.md` - Compliance: Local regulations points to REFUNDS OI-18.
- `sdd-refunds-platform/13b-service-payout.md` - same.
- `sdd-refunds-platform/13c-service-notification.md` - same.
- `sdd-refunds-platform/13d-service-loyalty.md` - same.
- `sdd-refunds-platform/decision-log.md` - SME-03 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists SME-03.
- `review-comments-tracker.md` - SME-03 Applied; targets extended; Progress.

---

## Point 13 (SME-04): Branch-handled refunds have no path into the portal (no store-associate role, no staff-assisted request), so Objective 2 holds only for online requests and R-01 has no mitigation (merged with PM-03; loyalty take-back part: see BO-04; customer-care part: see BO-11)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| **SME-04** | **No path for branch-handled refunds** | **Current** |
| SME-05 | Branch manager decides alone | Pending |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** Refunds start at the counter today: "Customers of our retail branches ask for refunds in person today. Staff record requests on paper" (REFUNDS 01). The BRD neither withdraws that channel nor gives it a path. REFUNDS 04 has two personas, Customer and Branch Manager; the only intake is self-service by a customer with a registered account and contact details (SDD 01 §3 assumptions 1 and 4), and a staff account may never act as a customer (SDD 12 §16.3), so no associate can record a request for a walk-in. Every case the design sends "to the branch" has no recording path: a purchase older than 30 days (REFUNDS 06a UC-01 E1, "they can visit the branch"), a receipt not paid by card (SDD 13a §17.1 Receipt lookup, `RECEIPT_NOT_CARD_PAID`; now REFUNDS OI-06), a customer with no account or no smartphone, and an exchange or store credit instead of money back. Yet REFUNDS 01 Objective 2 reads "Stop lost refund requests: every request is recorded and visible to the customer". SDD 01 §4 R-01 (paper continues during rollout) now has an owner and the rollout as mitigation (Point 9), but nothing covers these cases. (The loyalty side of branch refunds was decided in Point 2; customer care in Point 8.)

**Why it matters.** Objective 2 cannot hold for the hardest cases, which stay on paper indefinitely by design, so the claim the BRD makes to its sponsor is not true; customers walking in with goods keep the old process, and R-01 can never fully close.

| Option | Trade-off |
|---|---|
| A. Add a staff-assisted request now: a Store Associate persona records walk-in requests and off-portal outcomes (exchange, store credit, handled at the branch) under the same reference numbers, so every refund enters the portal | Objective 2 holds everywhere; a new persona, use case, and role model, decided without the sponsor |
| B. State the truth now: Objective 2 covers requests made in the portal, and refunds handled at a branch outside the portal are out of scope in this release (REFUNDS 01, 04); raise the staff-assisted path as a gating REFUNDS open item with A as its recommended answer; R-01's mitigation names both the rollout and the open item | The BRD stops over-claiming today; the channel decision goes to its owner |
| C. State the truth and accept that branch-handled refunds stay on paper for good | Simplest; the objective is permanently partial |

**Recommendation.** Option B. The objective must match the scope the BRD actually delivers, which is a consistency fix; adding a staff persona is a scope and staffing decision for the sponsor and the Operations Lead, who also owns R-01. This mirrors Point 2, where LOYALTY's promise was narrowed to the Refunds Portal and the second source became an open item.

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied chain-wide; tracker row SME-04 set to Applied.

**Files changed for Point 13:**

- `brd-refunds-portal/01-executive-summary-and-context.md` - Objective 2 covers requests made in the portal; branch-handled refunds outside it.
- `brd-refunds-portal/04-scope-and-personas.md` - Out of Scope: recording refunds handled at a branch outside the portal.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-19 decision record (applied), OI-20 open (staff-assisted request), Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row SME-04, G1 list.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §4 R-01 mitigation also names REFUNDS OI-20.
- `sdd-refunds-platform/decision-log.md` - SME-04 record.
- `review-comments-tracker.md` - SME-04 Applied; targets extended; Progress; structural decision 4.

---

## Point 14 (SME-05): The branch manager decides alone: no decision deadline, reminder, escalation, deputy cover, approval limit, or oversight, and a manager can approve a refund filed on their own customer account (merged with PM-01; head-office report: see PM-05)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| **SME-05** | **Branch manager decides alone** | **Current** |
| SME-06 | Card refund mechanics idealized | Pending |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (segregation of duties).** The person who benefits from a payment must never be the person who approves it, and large or unusual payments get a second pair of eyes. The control protects the retailer's money from internal fraud (a manager refunding their own or their family's purchases) and protects honest staff from suspicion. Without it, one person can create and approve their own payout, and only an after-the-fact audit can catch it.

**Issue.**

- *Alone and unprompted.* REFUNDS 03 Branch ownership knows one Branch Manager per branch, and a manager account carries exactly one branch (SDD 01 §3 assumption 2): no deputy, duty manager, or delegation for days off or a vacant post, and no way to model a manager covering two small branches. REFUNDS 06b UC-04's trigger is passive ("A request for the branch is waiting for a decision"); no decision deadline, reminder, or escalation exists; staff get no email or SMS (SDD CL-03, now REFUNDS OI-09); and REFUNDS 09 reports average time to decision with no threshold. At about 30 requests per branch per month, the 3-day objective (REFUNDS 01 Objective 1) rests on each manager's habits, and the seasonal peak triples the queue.
- *No limit or oversight.* UC-04 Business Rules bound only the partial amount (BR-2); one manager can pay out any sum, and nobody above the branch sees refund rates per branch or per manager (the head-office report belongs to PM-05; the head-office role to REFUNDS OI-13).
- *The self-approval loophole.* SDD 13a §17.1 Decide refuses a decision "whose caller `sub` equals the request's `customer_id`", but SDD 12 §16.3 makes staff use a separate customer account, so a manager who files a refund on their own customer account and approves it from their staff account passes the guard.

**Why it matters.** Requests wait as long as a manager's habits allow, absences stall a branch entirely, and the single most common internal refund fraud (refunding one's own or family purchases) is open by design, with no limit on the amount.

| Option | Trade-off |
|---|---|
| A. Decide every control now: a decision deadline with reminders, escalation to an area manager, deputy cover, an approval limit above which a second approver decides, and staff purchases routed outside the buyer's branch | Complete control set; invents deadlines, limits, and roles the business has not set |
| B. Decide now the rule the BRD already intends, "a branch manager never decides on a refund request they made as a customer" (UC-04 BR-4), and close the loophole in the SDD: the staff administrator records each staff member's own customer account on their staff account, and the decision guard refuses a request from either account; raise the decision deadline, reminders, escalation, deputy cover, and approval limit as one gating REFUNDS open item | The fraud path closes now; the operating rules come from operations, with the residual risk that an undeclared customer account still slips through (caught only by oversight, PM-05) |
| C. Raise everything, the loophole included, as an open item | No design change now; the self-approval path stays open until the item closes |

**Recommendation.** Option B. Nobody deciding their own refund is the intent of the existing guard (SDD OI-14), so closing the loophole is a consistency fix; the deadline, deputy, escalation, and limit values are operating policy that the Operations Lead must set, and they interact with the head-office role (REFUNDS OI-13) and the alert channel (REFUNDS OI-09).

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied chain-wide; tracker row SME-05 set to Applied.

**Files changed for Point 14:**

- `brd-refunds-portal/06b-use-cases-branch-manager.md` - UC-04 Business Rules: new last rule, no branch manager decides their own refund (BR-4).
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-21 decision record (applied); OI-22 open (deadline, reminders, escalation, deputy cover, approval limit); Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row SME-05, G1 list.
- `sdd-refunds-platform/13a-service-refund.md` - Decide guard and Auth errors compare `own_customer_id` too (BR-4).
- `sdd-refunds-platform/12-centralized-user-roles.md` - §16.2 claim `own_customer_id`; §16.3 staff note; §16.6 staff administrator records the declared customer account.
- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-07 claims list.
- `sdd-refunds-platform/decision-log.md` - OI-14 extension note; CL-03 tracking note (reminders in OI-22); SME-05 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists SME-05.
- `review-comments-tracker.md` - SME-05 Applied; targets extended; Progress.

---

## Point 15 (SME-06): Card refund mechanics are idealized: the acquirer link to the in-store terminal, the posting lag after Paid, the acquirer reference, and chargebacks that can refund twice

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| **SME-06** | **Card refund mechanics idealized** | **Current** |
| SME-08 | Store refund policy rules missing | Pending |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *Acquirer link.* A refund to a card used at a branch terminal normally goes through the acquirer that processed that terminal transaction, using that transaction's own reference. REFUNDS 02 Dependencies 1 says only that the payment provider "refunds to the original card"; nothing states that CardPay is, or is linked to, the acquirer of the branch terminals. SDD 13b §17.2 (Original card) identifies the original payment by the retailer's receipt number, which an acquirer knows only if the POS passed it at the sale.
- *Posting lag.* "Paid" means CardPay accepted the payout (REFUNDS 03: "becomes Paid once the payout succeeds"; REFUNDS 06b UC-04 step 7); the money reaches the card statement days later. Yet REFUNDS 04 Project Scope and 05 Customer Journey promise customers follow the request "until the money is back on their card", while REFUNDS 01 Objective 1 stops the clock at payout.
- *Reference.* Neither the Paid message nor the request detail carries a reference the customer can quote to their bank: `REFUND_PAID` holds `referenceNumber`, `customerId`, `customerContact`, `paidAmount`, and `payoutId` (SDD 10 §14.9.5), and the provider's reference stays inside payout-service.
- *Chargebacks.* A customer tired of waiting may file a "credit not processed" dispute with their bank; paying the portal refund on a transaction already charged back refunds them twice, and REFUNDS 10 NFR-01 ("never lost or paid twice") counts only the portal's own payouts.

**Why it matters.** Customers who see Paid but no money call customer care, the complaint the product exists to cut. If CardPay is not the terminals' acquirer, the payout design may not work at all. A disputed purchase can be refunded twice, which NFR-01 would never show.

| Option | Trade-off |
|---|---|
| A. Decide the customer-facing parts now (Paid means the payment provider accepted the payout; the Paid message and the request detail give the payout reference and say the money can take some days to reach the card; the scope and journey promise follow the request until it is Paid), and add to the CardPay dependency (REFUNDS 02 Dependencies 1, SDD API-02) the acquirer link, the typical posting time, a reference the customer can quote to their bank, and whether an open dispute can be detected before a payout | Honest customer wording and a quotable reference now; the acquirer facts come from CardPay in writing before TASK-03 |
| B. A plus a mandatory open-dispute check before every payout | Prevents double refunds; rests on a CardPay capability nobody has confirmed |
| C. Leave it to customer care to explain posting times | No change; the calls and the double-refund risk stay |

**Recommendation.** Option A. What Paid means and what the customer is told follow from the lifecycle the BRD already defines; the acquirer link, the posting time, the bank-quotable reference, and dispute detection are facts about CardPay, so they belong in the dependency that must be confirmed before TASK-03. A dispute check becomes a requirement once CardPay confirms it is possible.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row SME-06 set to Applied.

**Files changed for Point 15:**

- `brd-refunds-portal/03-definitions-and-domain-concepts.md` - Paid means the payment provider accepted the payout; the money can take some days.
- `brd-refunds-portal/04-scope-and-personas.md` - Project Scope: follow the request until it is paid.
- `brd-refunds-portal/05-user-journeys-overview.md` - Customer Journey: until Paid, told when to expect the money.
- `brd-refunds-portal/06b-use-cases-branch-manager.md` - UC-04 step 7: payout reference and posting delay in the Paid message.
- `brd-refunds-portal/06a-use-cases-customer.md` - UC-02 step 4 shows the payout reference once Paid.
- `brd-refunds-portal/02-glossary-assumptions-facts.md` - Dependencies 1: acquirer link, days to appear, bank-quotable reference, dispute detection.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-23 decision record (applied) and Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row SME-06 (TC-DEC-01, SCR-02 refresh items); row order fixed.
- `sdd-refunds-platform/13a-service-refund.md` - Payout outcome stores and sends the payout reference; `payout_reference` column; DTO field; REFUND_PAID schema; PAYOUT_SUCCEEDED effect.
- `sdd-refunds-platform/13c-service-notification.md` - Paid message: payout reference and posting delay (channel matrix, consumed events).
- `sdd-refunds-platform/10-events-hub.md` - §14.5.1 REFUND_PAID payload and business cell; §14.9.5 `payoutReference` field.
- `sdd-refunds-platform/13b-service-payout.md` - Original card: the CardPay acquirer and dispute facts are REFUNDS dependency questions.
- `sdd-refunds-platform/11-api-contracts.md` - API-02 external question extended.
- `sdd-refunds-platform/decision-log.md` - SME-06 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists SME-06.
- `review-comments-tracker.md` - SME-06 Applied; targets extended; Progress.

---

## Point 16 (SME-08): Store refund policy rules are missing: category exclusions, holiday window, gift receipts, final sale, unit-level refunds, and promotion allocation

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| **SME-08** | **Store refund policy rules missing** | **Current** |
| SME-11 | Existing loyalty programme ignored | Pending |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** The rules branches follow today are only referenced: REFUNDS 12 Appendix lists "Store refund policy v3 | The refund rules the branches follow today". REFUNDS 06a UC-01 keeps just two of them: the 30-day window (BR-1) and "An item can be refunded only once" (BR-2). Retail return policies normally also exclude categories (hygiene, underwear, perishables, personalised goods, opened media, gift cards, final-sale clearance), extend the window for holiday purchases (the seasonal peak of REFUNDS 02 Facts 2), and treat gift receipts differently (a refund to the giver's card is wrong; an exchange or store credit is the norm). The receipt model is also simplified: SDD 13a §17.1 `SubmitRefundRequest` selects whole lines (`posItemLineIds`, no quantity) and locks a line once refunded, so a customer cannot return 1 of 3 units now and another later, and SDD 11 §15.3 API-01 asks POS Records for line amounts only, so an item bought in a multi-buy or basket promotion would be refunded at its line price without reallocating the discount.

**Why it matters.** Managers will reject or adjust these cases by hand, inconsistently across 40 branches, and customers will be shown items as refundable that the store's own policy excludes. Promotion lines refunded at full line price overpay; whole-line locking blocks valid later returns.

| Option | Trade-off |
|---|---|
| A. Carry the policy v3 rules into UC-01 now | Consistent from day one, but nobody in the review has the policy text |
| B. Raise a gating REFUNDS open item owned by the Operations Lead, sourced from Store refund policy v3: which rules the portal enforces (category exclusions, holiday window, gift receipts, final sale) as configurable business rules in UC-01, and how multi-unit lines and promotions are refunded; meanwhile add to the API-01 questions for POS Records whether each line carries its quantity, category, and net amount paid after discounts, so the answer can be designed when it arrives | The rules come from their real source; the data question runs in parallel |
| C. Let branch managers apply policy v3 at decision time | No portal change; inconsistent outcomes and customers misled at step 2 |

**Recommendation.** Option B. The policy exists and its owner is operations; transcribing it requires the document, and the design needs line data (quantity, category, net amount) that only POS Records can confirm, so asking now avoids a second round trip.

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied; tracker row SME-08 set to Applied.

**Files changed for Point 16:**

- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-24 open (store refund policy rules; owner Operations Lead).
- `brd-refunds-portal/14-todo.md` - Business review row SME-08, G1 list.
- `sdd-refunds-platform/13a-service-refund.md` - Submit: whole-line refunds until REFUNDS OI-24 decides.
- `sdd-refunds-platform/11-api-contracts.md` - API-01 external question: quantity, category, and net amount per line.
- `sdd-refunds-platform/decision-log.md` - SME-08 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists SME-08.
- `review-comments-tracker.md` - SME-08 Applied; targets extended; Progress.

---

## Point 17 (SME-11): The existing loyalty programme is ignored: no opening balances, cut-over date, rule for pre-launch purchases, or alignment with the programme's terms (exclusions, expiry) (merged with BO-02, PM-06)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| **SME-11** | **Existing loyalty programme ignored** | **Current** |
| SME-12 | No loyalty-operations role | Pending |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** Members already hold loyalty program accounts and member numbers: LOYALTY 04 Out of Scope ("Members use their existing loyalty program account") and 02 Dependencies (Member sign-in). So a program runs today, very likely with points earned under published terms, and LOYALTY 01 Objective 2 ("Members can check their points at any time without calling a branch") implies members ask branches about points now. Yet LOYALTY starts every member at 0: UC-01 A1 shows a balance of 0 and explains how points are earned (LOYALTY 06a). Nothing says whether today's balances carry over, which system holds the official balance after go-live, or from which purchase date points are earned: SDD 13d §17.4 `purchase_import_cursor` has no defined starting position. The earning rule covers every whole euro (LOYALTY 03) with no exclusions (gift-card sales earn twice: when sold and when spent; tobacco or lottery are usually excluded) and no expiry, while a program's terms normally set both. A refund of a purchase made before launch finds no member purchase and stays a pending take-back for ever (SDD 13d Take points back: "A pending take-back has no expiry"). LOYALTY 09 has no report of what is owed (now LOYALTY OI-13).

**Why it matters.** On launch day members may see 0, or a figure that contradicts what branches told them, the opposite of Objective 1 ("Members trust their points balance"), and LOYALTY/NFR-01's zero-upheld-complaints target breaks at once. Rules that differ from the program's terms invite disputes (LOYALTY 02 Legal clearances L2). The cut-over is decided during build by whoever sets the import cursor.

| Option | Trade-off |
|---|---|
| A. Decide now: balances start at 0 at go-live, purchases from the go-live date earn, refunds of earlier purchases take nothing back, and members are told at launch | Simple and buildable; contradicts any points members hold today, decided without knowing whether they hold any |
| B. Decide now: migrate each member's opening balance from the existing program at a cut-over date, as one opening movement, and align exclusions and expiry with its terms | Continuity for members; needs the existing system's data and terms, which no document names |
| C. Raise a gating LOYALTY open item: name the existing program and its system; decide the opening balances (migrate, or start at 0 with member communication), the cut-over date (the first purchase date that earns), how refunds of pre-cut-over purchases are treated, and whether the program's exclusions and expiry apply (tied to Legal clearance L2); B as the recommended answer if members hold points today, A otherwise | The launch rule rests on facts about the program; the import's starting position is set from the decision, not during build |

**Recommendation.** Option C. Whether members hold points today, in which system, and under which terms are facts only the loyalty program's owner has; both A and B are sensible depending on them, so the open item records both with the condition that picks one. The SDD notes now that the import's starting position comes from that decision.

Accept, or adjust?

**User:** Accept C.

**Applied (skill, chat):** Option C applied; tracker row SME-11 set to Applied.

**Files changed for Point 17:**

- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-15 open (moving from the existing loyalty program).
- `brd-loyalty-points/14-todo.md` - TD-32 row, Business review row SME-11, G1 list.
- `sdd-refunds-platform/13d-service-loyalty.md` - import cursor's first position is the earning start date (LOYALTY OI-15); pre-cut-over refunds stay pending take-backs.
- `sdd-refunds-platform/decision-log.md` - SME-11 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists SME-11.
- `review-comments-tracker.md` - SME-11 Applied; targets extended; Progress.

---

## Point 18 (SME-12): No loyalty-operations role: upheld balance complaints, missing-points claims, goodwill credits, account merges, card replacements, and closures cannot reach the ledger

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| **SME-12** | **No loyalty-operations role** | **Current** |
| PM-04 | Customer account step missing | Pending |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** LOYALTY 10 NFR-01 defines when a balance complaint is upheld, and LOYALTY 16 P7 logs "how each was settled", but nothing can settle one: the ledger accepts only POS Records imports and paid refunds (SDD 13d §17.4: movement types `EARNED` and `TAKEN_BACK`), and the SDD forbids changing movements ("Avoid: updating or deleting a movement or a member purchase, except through the member erasure job", §17.4 Developer Notes). LOYALTY 04 has one persona, the Member. Routine loyalty operations therefore have no path: a missing-points claim when the member forgot to identify at the till (POS Records never reports it as a member purchase), a goodwill credit, reversing a wrong earn, merging duplicate accounts, replacing a lost card, household or secondary cards on one account, and closing an account. (Who receives and upholds complaints is LOYALTY OI-14, from Point 8.)

**Why it matters.** An upheld complaint stays wrong in the ledger, so NFR-01 can be measured but the balance can never be put right, which defeats Objective 1. Members who forgot their card at the till lose points for good, and card or account changes in the existing program may orphan a member's history.

| Option | Trade-off |
|---|---|
| A. Add a loyalty-operations persona now with a manual adjustment use case (a signed movement with a reason code, a second approver above a threshold, visible to the member) and a missing-points claim by receipt; the SDD adds an adjustment movement type, endpoints, and a role | Complaints can be put right in this release; a new persona and money-like control decided without the program's owner |
| B. Raise a gating LOYALTY open item, linked to OI-14 and OI-15: how an upheld complaint is put right in the ledger (adjustment movements, reasons, approval, member visibility), missing-points claims, and how merges, card replacements, and closures in the existing program reach Loyalty Points; A as its recommended answer, C as the alternative if the existing program keeps that role | The ledger correction model is decided by the program's owner with the facts of OI-15; until then an upheld complaint cannot be corrected, which the SDD states |
| C. Corrections stay in the existing loyalty program's system, which reports adjustments to Loyalty Points through a partner flow | One place for corrections; a second partner flow and dependence on a system nobody has named |

**Recommendation.** Option B. Whether corrections are made here or in the existing program depends on the facts of LOYALTY OI-15 (which system holds the official balance), and the approval thresholds are the program owner's policy. Stating in the SDD that an upheld complaint cannot yet be corrected keeps the gap visible until the item closes.

Accept, or adjust?

**User:** Accept B.

**Applied (skill, chat):** Option B applied; tracker row SME-12 set to Applied.

**Files changed for Point 18:**

- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-16 open (putting a balance right; merges, cards, closures).
- `brd-loyalty-points/14-todo.md` - TD-33 row, Business review row SME-12, G1 list.
- `sdd-refunds-platform/13d-service-loyalty.md` - Developer Notes: a correction is never an edit; none possible until LOYALTY OI-16 closes.
- `sdd-refunds-platform/decision-log.md` - SME-12 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists SME-12.
- `review-comments-tracker.md` - SME-12 Applied; targets extended; Progress.

---

## Point 19 (PM-04): REFUNDS never says a customer needs an account: self-registration, verification, and whether a mobile number is mandatory are missing from the journey and the UAT (LOYALTY sign-in part: see PA-05)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| **PM-04** | **Customer account step missing** | **Current** |
| PM-05 | Objectives not measurable | Pending |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** REFUNDS never says a customer needs an account: REFUNDS 05 Customer Journey starts at "The customer enters the receipt number", REFUNDS 06a UC-01's only precondition is "The purchase is within the 30-day refund window", REFUNDS 02 lists no identity dependency, and REFUNDS 04 In Scope promises "Customer messages by email and SMS". The SDD, however, requires self-registration before any customer use case (SDD 12 §16.6: "The person, by self-registration | `CUSTOMER`") and reads the email address and mobile number for messages from that profile (SDD 01 §3 assumptions 1 and 4); SDD 13c §17.3 records SMS as `SKIPPED` when there is no mobile number. Registration is therefore an unstated first step with no screen, mockup, task, or UAT case: REFUNDS 16 P2 assumes accounts already exist. The SDD's own rule that it never adds a use case (SDD decision log CL-02 rationale) should have sent this customer-facing step back to the BRD. (The LOYALTY sign-in is PA-05.)

**Why it matters.** For walk-in customers moving off paper, sign-up is the biggest adoption hurdle to Objective 2, yet nobody has decided how heavy it is. Whether a mobile number is required decides whether "email and SMS" is a promise to every customer or only to some, and testers have no case for the first thing every customer does.

| Option | Trade-off |
|---|---|
| A. State the account step now: customers sign in, or register themselves with a verified email address and, if they want SMS, a mobile number; UC-01 requires a signed-in customer; messages go by email, and by SMS when the account has a mobile number | Low sign-up friction and matches the design; SMS reaches only customers who give a number |
| B. As A, but the mobile number is required at registration | Keeps "email and SMS" for every customer; more friction at sign-up |
| C. Allow requesting and tracking without an account (receipt number, reference number, and email) | Least friction; changes who can see a request (REFUNDS/NFR-04) and the role design |

**Recommendation.** Option A. It makes explicit what the design already does (self-registration through the identity provider, SMS skipped without a number) and keeps sign-up light for the walk-in customers Objective 2 needs, while a verified email guarantees every customer can be told about each step. C would reopen the privacy model for little gain.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PM-04 set to Applied.

**Files changed for Point 19:**

- `brd-refunds-portal/04-scope-and-personas.md` - In Scope: customer accounts (verified email, optional mobile number); messages by email, SMS when a number is given.
- `brd-refunds-portal/05-user-journeys-overview.md` - Customer Journey starts with sign-in or registration.
- `brd-refunds-portal/06a-use-cases-customer.md` - UC-01 Preconditions: the customer is signed in.
- `brd-refunds-portal/03-definitions-and-domain-concepts.md` - new "Customer account and messages" section.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-25 decision record (applied) and Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row PM-04 (registration screen, TASK-01, 16 P2, cases).
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §3 assumptions 1 and 4 cite the BRD account rules.
- `sdd-refunds-platform/12-centralized-user-roles.md` - §16.6 self-registration row: verified email, optional mobile number.
- `sdd-refunds-platform/13c-service-notification.md` - Missing address: a customer without a mobile number gets email only.
- `sdd-refunds-platform/decision-log.md` - PM-04 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PM-04.
- `review-comments-tracker.md` - PM-04 Applied; targets extended; Progress.

---

## Point 20 (PM-05): Objectives have no baselines, measurable start and end events, targets, or owners, and no sponsor or head-office report shows whether they are met (merged with BO-10; decision deadline and approval limit: see SME-05)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| **PM-05** | **Objectives not measurable** | **Current** |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Pending |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *REFUNDS Objective 1* ("Cut the average time from request to payout from 10 days to 3 days", REFUNDS 01) has no measured start: the summary says customers wait "up to 10 days", a maximum, not an average, and paper records that "get lost" (REFUNDS 02 Challenges 1) cannot supply a measured average. Its end event was ambiguous until Point 15 defined Paid as the payment provider's acceptance (REFUNDS 03).
- *Objective 2 and the complaint figure.* "18% of complaints to customer care are about slow or lost refund requests" (REFUNDS 01 Background) has no target, no data source, and no owner; Objective 2 now covers portal requests (Point 13).
- *Nobody sees whether it worked (with BO-10).* The only report (REFUNDS 09) serves one branch manager for one branch and one day, and shows time to decision, not time to payout. The Operations Lead and Head of Retail who reviewed and approved REFUNDS 1.0 (REFUNDS 00) have no view across branches; SDD 13a §17.1 `refund_request_to_paid_seconds` is an operations metric, and the analytics subscriber is wishlist only "if reporting grows" (SDD 17 §22 item 3).
- *LOYALTY.* Objectives 1 and 2 (LOYALTY 01) have no baseline, target, or measure, LOYALTY 02 has no facts, and LOYALTY 09 is "Not applicable" (the outcome objective and volumes are LOYALTY OI-12 from Point 7).

**Why it matters.** The sponsors cannot tell from the product whether it worked, the 10-to-3 claim can never be checked, and nobody is accountable for acting when a branch misses it.

| Option | Trade-off |
|---|---|
| A. Define the objectives measurably now from the lifecycle the BRD already has (Objective 1: the monthly average from Submitted to Paid of the requests paid that month, target 3 days; Objective 2 judged by customer care's share of complaints about slow or lost refunds; LOYALTY Objective 1 measured by NFR-01), name the Head of Retail as their owner with a monthly review, add a monthly head-office refund report to REFUNDS 09 (per branch: requests by status, time to payout, time to decision, approved and paid amounts, delayed payouts), and raise the starting figures and the complaint target as a REFUNDS open item, with LOYALTY Objective 2's measure added to LOYALTY OI-12 | Measurable objectives and a sponsor view now; starting figures are collected before launch rather than invented |
| B. Define the measures, but leave measuring to the Operations Lead outside the product, with no report | No new report; the sponsor depends on manual extracts |
| C. Raise everything as open items | No change now; the objectives stay unmeasurable meanwhile |

**Recommendation.** Option A. The start and end events, the 3-day target, and the complaint figure are already in the BRD, so the measures can be fixed now; the report follows from them and from the sponsor's need (BO-10), and its head-office audience matches the role recommended in REFUNDS OI-13. Only the starting figures, which need a pre-launch sample, and a complaint target are genuinely unknown.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PM-05 set to Applied.

**Files changed for Point 20:**

- `brd-refunds-portal/01-executive-summary-and-context.md` - "How the objectives are measured" table, owner, and monthly review.
- `brd-refunds-portal/09-reporting-and-analytics.md` - monthly head-office refund report.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-26 decision record (applied); OI-27 open (starting figures, complaint target); Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row PM-05, G1 list.
- `brd-loyalty-points/01-executive-summary-and-context.md` - Objective 1 measured by NFR-01; Objective 2 measure open in OI-12.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-12 widened to Objective 2's measure.
- `brd-loyalty-points/decision-log.md` - PM-05 record.
- `brd-loyalty-points/14-todo.md` - TD-29 text, Business review row PM-05.
- `sdd-refunds-platform/13a-service-refund.md` - Business Logic: head-office report content; endpoint waits for REFUNDS OI-13.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §2.1 In Scope names the head-office report.
- `sdd-refunds-platform/02-ecosystem-overview.md` - §6 Reporting row names both reports.
- `sdd-refunds-platform/09-services-summary.md` - refund-service owns both reports.
- `sdd-refunds-platform/10-events-hub.md` - §14.7: the BRD reports come from refund-service's tables.
- `sdd-refunds-platform/17-appendix-and-wishlist.md` - §22 item 3 names both reports.
- `sdd-refunds-platform/decision-log.md` - PM-05 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PM-05.
- `review-comments-tracker.md` - PM-05 Applied; targets extended; Progress.

---

## Point 21 (PM-07): LOYALTY depends on REFUNDS reporting paid refunds, but REFUNDS has no scope line, integration row, task, or test for it, and neither plan sequences the two launches

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| **PM-07** | **LOYALTY-REFUNDS dependency one-sided** | **Current** |
| PM-10 | Branch report has no use case | Pending |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** LOYALTY 02 Dependencies records "Refunds Portal (refund outcomes) | Confirmed", and LOYALTY 08 lists the Refunds Portal as the source of refunded purchases. REFUNDS, however, never mentions loyalty: no scope line (REFUNDS 04 In Scope), no integration row (REFUNDS 08), no task (REFUNDS 15 Waves), and no test commits REFUNDS to reporting paid refunds. The two deliveries are coupled but not sequenced: LOYALTY TASK-01 can be accepted only once refunds are paid end to end (LOYALTY 16 P1; SDD 15 §19 runs this through refund-service and the payment provider sandbox), which means after REFUNDS TASK-03 in wave 2 and after the CardPay contract (SDD 11 §15.6 API-02), still awaiting documentation; yet LOYALTY 15 lists no missing prerequisite. With a pilot-then-waves REFUNDS rollout (Point 9), refunds in branches not yet on the portal stay on paper and take no points back (Point 2).

**Why it matters.** If REFUNDS ships later than LOYALTY, or only in pilot branches, points on refunded purchases are not taken back in the gap, and a REFUNDS change can break LOYALTY with neither owner noticing, because only one side records the commitment.

| Option | Trade-off |
|---|---|
| A. Record REFUNDS' side now (04 In Scope: report each paid refund to Loyalty Points; an 08 row to Loyalty Points; a task and an acceptance case in the refresh of REFUNDS 15 and 16), make the cross-product dependency explicit in LOYALTY 02 (TASK-01's acceptance waits for REFUNDS TASK-03 and the payment provider's test environment), and raise the launch order, with the rule for refunds paid while only one product is live, as a LOYALTY open item | Both owners see the commitment and the coupling; the launch order is decided with the rollout plan |
| B. Keep the dependency on the LOYALTY side only | No REFUNDS change; REFUNDS can drop or change the feed unnoticed |
| C. Merge the two implementation plans into one | One sequence; entangles two BRDs' plans and their gates |

**Recommendation.** Option A. A dependency is only real when the providing side commits to it, so REFUNDS must carry the scope line, the integration row, a task, and a test. The launch order depends on the REFUNDS rollout plan (REFUNDS OI-15) and on how much loss LOYALTY OI-10 accepts, so it is raised, with "LOYALTY goes live once the Refunds Portal runs in every branch" as the recommended answer.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PM-07 set to Applied.

**Files changed for Point 21:**

- `brd-refunds-portal/04-scope-and-personas.md` - In Scope: report each paid refund to Loyalty Points.
- `brd-refunds-portal/08-integrations.md` - Loyalty Points row (We send, High).
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-28 decision record (applied) and Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row PM-07 (task and case for the refresh).
- `brd-loyalty-points/02-glossary-assumptions-facts.md` - Refunds Portal row: confirmed by the REFUNDS commitment; TASK-01 acceptance waits for REFUNDS TASK-03.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-17 open (launch order).
- `brd-loyalty-points/decision-log.md` - PM-07 record.
- `brd-loyalty-points/14-todo.md` - TD-34 row, Business review row PM-07, G1 list.
- `sdd-refunds-platform/08-integrations.md` - §12 intro cites both BRD rows.
- `sdd-refunds-platform/10-events-hub.md` - §14.10 RefundPaid realises both BRD rows.
- `sdd-refunds-platform/decision-log.md` - PM-07 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PM-07.
- `review-comments-tracker.md` - PM-07 Applied; targets extended; Progress.

---

## Point 22 (PM-10): The daily branch refund report has no use case, matrix row, screen, mockup, task, or test, its counting rule dangles, and "Daily" silently became on demand (merged with DC-09)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| **PM-10** | **Branch report has no use case** | **Current** |
| PM-11 | NFRs not measurable; UAT gaps | Pending |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** REFUNDS 09 requires a "Branch refund report | Branch Manager | Daily | Requests per status, amounts paid, and average time to decision for the branch". It exists only there: no use case in REFUNDS 05, no row in the REFUNDS 07 matrix (the SDD derived the permission directly from 09: SDD 12 §16.10 traces it to the Proposed ADR-08), no screen ID in REFUNDS 11, no mockup in REFUNDS 14, no task in REFUNDS 15, and no case in REFUNDS 16, whose Coverage gaps still reports 0 gaps. The SDD nonetheless ships an endpoint, a permission token, and two indexes for it (SDD 13a §17.1 List of APIs row 9, `refund.report.read-branch`). The `BranchRefundReport` DTO says "the counting rule is the one §17.1 Branch report states", but §17.1 never says which date places a request in a day's "requests per status" (submitted, decided, or current status). "Daily" silently became an on-demand query by date. The branch manager's decision screen (mockup MK-03) also still has no screen ID (REFUNDS 11). (The new monthly head-office report from Point 20 waits for its role, REFUNDS OI-13.)

**Why it matters.** The report will either be built from an API with no agreed screen and accepted without a test, or quietly dropped, while chunks 15 and 16 claim full coverage; and two developers can compute "requests per status for a day" in three different ways.

| Option | Trade-off |
|---|---|
| A. Promote the report to REFUNDS UC-06 "View Branch Refund Report" (Branch Manager): a matrix row, screen SCR-04 (and SCR-03 for the decision screen), and a defined counting rule (for the chosen day, in the branch's local time: requests submitted that day by their current status, the amount paid that day, and the average time to decision of the requests decided that day); "Daily" means one day per view, opened on demand in the portal; the SDD traces the endpoint to UC-06; the mockup, task, and cases are refresh items | The report is specified, traceable, and testable; one more use case to build and test |
| B. Move the report to the wishlist with a horizon and remove the SDD endpoint and permission | Less to build; branch managers lose their only report and Objective 3 its view |
| C. Keep it in 09 only, define "Daily" and the counting rule there, and add a screen ID | Smallest change; still no matrix row, flow, or criteria for testers |

**Recommendation.** Option A. The report has an audience and serves Objectives 1 and 3, so it deserves a use case with criteria; the counting rule above uses only dates the lifecycle already records, and on-demand viewing matches the portal-only way managers are told things today (REFUNDS OI-09).

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PM-10 set to Applied.

**Files changed for Point 22:**

- `brd-refunds-portal/06b-use-cases-branch-manager.md` - new UC-06 View Branch Refund Report; UC-04 UI/UX names screen SCR-03.
- `brd-refunds-portal/05-user-journeys-overview.md` - Use Case Summary row UC-06; Branch Manager Journey mentions the report.
- `brd-refunds-portal/07-users-use-cases-matrix.md` - UC-06 row (own branch only).
- `brd-refunds-portal/09-reporting-and-analytics.md` - "Daily" defined (one day per view, on demand) and linked to UC-06.
- `brd-refunds-portal/11-summary-and-uiux.md` - Screens SCR-03 (decision) and SCR-04 (report).
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-29 decision record (applied) and Resolution Log row.
- `brd-refunds-portal/14-todo.md` - SCR-04 mockup row (Not started), MK-03 names SCR-03, UC-06 flowchart row, Business review row PM-10.
- `sdd-refunds-platform/03-users-and-use-cases.md` - §7.3 REFUNDS/UC-06 row; Figure 1 node and edge; summary.
- `sdd-refunds-platform/09-services-summary.md` - refund-service owns REFUNDS/UC-06.
- `sdd-refunds-platform/12-centralized-user-roles.md` - §16.10 traces the report to UC-06 and the matrix row.
- `sdd-refunds-platform/13a-service-refund.md` - Branch report counting rule; Constraints and DTO cite UC-06.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §2.1 cites UC-06.
- `sdd-refunds-platform/decision-log.md` - PM-10 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PM-10.
- `review-comments-tracker.md` - PM-10 Applied; targets extended; Progress; structural decision 5.

---

## Point 23 (PM-11): REFUNDS NFR-02 and NFR-03 are not measurable; NFR-03, NFR-04, and UC-02 BR-1 have no test; the coverage counts are wrong; and UAT prerequisites are missing (MsgHub sandbox, a second customer, LOYALTY P8 staging) (merged with DC-10)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| **PM-11** | **NFRs not measurable; UAT gaps** | **Current** |
| PM-12 | Deferred features: no horizon or notice | Pending |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *Unmeasurable NFRs.* REFUNDS 10 NFR-03 ("3 times the normal number of requests for 3 weeks, with no slowdown customers notice") has no threshold and no acceptance case, and every SDD latency target, the load-test tool, cadence, and sign-off are still open (SDD 14 §18.2, §18.4). NFR-02 ("No more than 2 hours of disruption a month") does not say what counts as disruption: a POS Records outage that stops new requests (SDD 01 §4 R-04), a messaging outage, planned maintenance. REFUNDS 16 TC-NFR-02 observes only the UAT period, not a production month.
- *Missing cases.* NFR-04 ("Only the customer and their branch's manager can see a request") has no case of one customer trying to open another customer's request (only TC-DEC-05 covers branches), and REFUNDS 06a UC-02 BR-1 ("Customers see only their own requests") has none either; P2 provides a single customer, so the isolation cannot be tested, and P2's no-role account is used by no case.
- *Wrong counts.* REFUNDS 16 Coverage gaps reports "2 NFRs ... Without a case: 0" when REFUNDS 10 has four NFRs, and counts 3 alternate flows (4 exist) and 5 acceptance criteria (6 exist).
- *Prerequisites.* Neither REFUNDS 16 P1 nor SDD 15 §19 provides the notification partner's sandbox, yet TC-REQ-07 and TC-DEC-01 pass only if the customer gets a message. LOYALTY 16 TC-PTS-07 is required for TASK-01, TASK-04, and the BAT exit, but SDD 15 §19 says refund-service can never produce its P8 scenario (refunds of one purchase adding up to more than its amount) and leaves the staging open; one option it names, a UAT-only publisher of `RefundPaid`, breaks the §14.10 single-publisher contract.

**Why it matters.** The seasonal peak, the one period that tests the platform, will pass or fail with no agreed measure; NFR-02 can be argued both ways; two privacy rules ship untested while the suite reports full coverage; and two required cases cannot run as written.

| Option | Trade-off |
|---|---|
| A. Restate NFR-02 (no more than 2 hours a month in which customers cannot submit, track, or cancel a request or branch managers cannot decide, whatever the cause, partner outages and planned maintenance included, measured over each production month) and NFR-03 (at 3 times the normal number of requests for 3 weeks, every customer and branch manager action responds as quickly as at normal volume); record the REFUNDS 16 corrections for its refresh (cases for NFR-03, NFR-04, and UC-02 BR-1; a second customer and a use for the no-role account in P2; the MsgHub sandbox in P1; the correct counts; TC-NFR-02 over a production month); add the MsgHub sandbox to SDD §19; stage LOYALTY P8 through the POS Records sandbox (a member purchase reported for less than its receipt's items), with no UAT-only publisher | Every NFR becomes testable and every required case runnable; partner outages count against NFR-02, which the platform does not fully control |
| B. Same as A, but NFR-02 excludes partner outages and announced maintenance | Easier to meet; the customer's experience of an outage is no longer measured |
| C. Fix the test suites only and leave the NFR wording | Less change; the measures stay arguable |

**Recommendation.** Option A. Customers experience an outage the same way whatever its cause, so the business measure should count it; the SDD can then size the POS Records dependency (R-04) against it. The 16 corrections are recorded rather than written, because chunk 16 cannot be refreshed while its gate is shut. Staging P8 through the POS Records sandbox reproduces a real cause of over-refunding (a member purchase amount that differs from the receipt, the subject of DC-08) without a second publisher of `RefundPaid`.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PM-11 set to Applied.

**Files changed for Point 23:**

- `brd-refunds-portal/10-nfrs.md` - NFR-02 and NFR-03 business measures restated, measurable.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-30 decision record (applied) and Resolution Log row.
- `brd-refunds-portal/14-todo.md` - Business review row PM-11 with the chunk 16 corrections for the refresh.
- `brd-loyalty-points/14-todo.md` - Business review row PM-11 (P8 staging, TC-PTS-07).
- `brd-loyalty-points/decision-log.md` - PM-11 record (P8 staging).
- `sdd-refunds-platform/14-performance-and-capacity.md` - §18.2 availability: what counts as disruption; seasonal peak sustained 3 weeks.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §4 R-04 counts against REFUNDS/NFR-02.
- `sdd-refunds-platform/15-environments.md` - §19 UAT adds the MsgHub sandbox; P8 staged through the POS Records sandbox; marker narrowed to P5 and P6.
- `sdd-refunds-platform/decision-log.md` - PM-11 record.
- `review-comments-tracker.md` - PM-11 Applied; targets extended; Progress.

---

## Point 24 (PM-12): Deferred features (redemption, mobile push, bulk approval, online-shop refunds, history export, CardPay reconciliation) have no horizon or trigger, and nothing tells users they are not available

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| **PM-12** | **Deferred features: no horizon or notice** | **Current** |
| PA-02 | PAID is acceptance; paid time unclear | Pending |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** No deferred item has a target release, date, trigger, or owner: points redemption (LOYALTY 04 Out of Scope: "a later phase"; LOYALTY 12 Wishlist), push notifications "in the mobile app" (REFUNDS 06a UC-02 Future Enhancements), bulk approval of small refunds (REFUNDS 06b UC-04 Future Enhancements), online-shop refunds (REFUNDS 12 Wishlist), points history export (LOYALTY 06a UC-02 Future Enhancements), and the CardPay reconciliation that would prove REFUNDS/NFR-01 beyond the SDD's duplicate proxy (SDD 17 §22 item 2, SDD 14 §18.2). Several are visible at launch with no explanation: members collect points they cannot spend, and no screen says so; REFUNDS UC-02 is titled "Web and Mobile" (REFUNDS 05) while the scope delivers a responsive web app and SDD 01 §2.2 still asks which is meant (now REFUNDS OI-11, from Point 4); and online-shop buyers who try the portal get UC-01 E2's "check the number and try again" instead of being told online orders are refunded elsewhere. SDD 06 ADR-01 ties extracting loyalty-service to redemption, so the missing horizon also leaves that architecture trigger undated. (Redemption's horizon is now LOYALTY OI-13; the reconciliation's owner is REFUNDS OI-17.)

**Why it matters.** Members trust a balance they cannot spend and nobody tells them why; online-shop customers are told to retype a valid receipt; and every deferred item stays deferred by default, with no date at which anyone decides.

| Option | Trade-off |
|---|---|
| A. Give each BRD's 12 Wishlist a roadmap table (item, owner, trigger or horizon: an evident dependency where one exists, otherwise decided at the first monthly objectives review after every branch is live), add launch wording now (the balance screen says points cannot be spent yet; UC-01 E2 says online-shop purchases are refunded through the online shop), and close REFUNDS OI-11 with its recommended answer (no native app in this release; "Mobile" means the web app on phones; push notifications move to the wishlist as needing a native app), which also resolves the SDD §2.2 marker | Users are told what is not there yet, every deferred item has an owner and a decision point, and one open question closes; no invented dates |
| B. The roadmap table only | Owners and decision points; users still meet unexplained gaps |
| C. Launch wording only | Users are told; deferred items still have no owner or decision point |

**Recommendation.** Option A. The wording follows from what the BRDs already exclude, and OI-11's recommended answer is already supported by REFUNDS 11 ("The customer screens work on phones and computers"), so closing it here is consistent. Where no dependency sets a horizon, tying the decision to the monthly objectives review introduced in Point 20 gives a real decision point without inventing dates.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PM-12 set to Applied. Where LOYALTY has no objectives review, the history-export decision is tied to the first monthly NFR-01 figure instead (LOYALTY 01 Objective 1).

**Files changed for Point 24:**

- `brd-refunds-portal/12-appendix-and-wishlist.md` - Wishlist is a table with owner and trigger or horizon per item; push notifications and bulk approval added.
- `brd-refunds-portal/06a-use-cases-customer.md` - UC-01 E2 names the online shop; UC-02 states there is no native app; Future Enhancements points to the wishlist.
- `brd-refunds-portal/06b-use-cases-branch-manager.md` - UC-04 Future Enhancements points to the wishlist.
- `brd-refunds-portal/11-summary-and-uiux.md` - screens are in the web app; no native app.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-11 applied; OI-31 decision record; Resolution Log rows; Open list.
- `brd-refunds-portal/14-todo.md` - Business review row PM-12; SCR-01 mockup Update needed; G1 open list.
- `brd-loyalty-points/04-scope-and-personas.md` - Out of Scope: the balance screen says points cannot be spent yet.
- `brd-loyalty-points/11-summary-and-uiux.md` - display rule: points cannot be spent yet.
- `brd-loyalty-points/12-appendix-and-wishlist.md` - Wishlist is a table with owner and trigger or horizon.
- `brd-loyalty-points/06a-use-cases-member.md` - UC-02 Future Enhancements points to the wishlist.
- `brd-loyalty-points/14-todo.md` - Business review row PM-12; step 4 and G4 reopened; LP-01 Update needed; steps complete 2 of 5.
- `brd-loyalty-points/decision-log.md` - PM-12 record.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §2.2 marker replaced by the OI-11 decision.
- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-01 redemption trigger reviewed with LOYALTY OI-13.
- `sdd-refunds-platform/17-appendix-and-wishlist.md` - §22 items 1 and 2 cite LOYALTY OI-13 and the REFUNDS wishlist owner.
- `sdd-refunds-platform/14-performance-and-capacity.md` - §18.2 payout correctness cites the reconciliation's owner.
- `sdd-refunds-platform/decision-log.md` - PM-12 record.
- `review-comments-tracker.md` - PM-12 Applied; targets extended; Progress.

---

## Point 25 (PA-02): PAID means synchronous CardPay acceptance: a later settlement failure has no way back, and the paid time (paid_at, the LOYALTY/NFR-02 clock) is stated three ways with no source (merged with DC-05)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| **PA-02** | **PAID is acceptance; paid time unclear** | **Current** |
| PA-03 | Receipt-number join key unsafe | Pending |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *No way back from Paid.* SDD 13b §17.2 Business Logic (Succeed) moves a payout to `SUCCEEDED` on "an accepted payout", and refund-service marks the request PAID, sends the "paid" email and SMS, and starts the take-back, which has no compensation step (§24.8.2). SDD 08 §12 INT-01 and SDD 11 §15.3 API-02 still leave open whether CardPay returns the result in the response or by callback. If acceptance only means "accepted for processing", a later settlement failure has nowhere to land: §15.2 holds no External inbound contract, payout-service has no endpoint or ingress route (§24.2), and refund-service ignores `PAYOUT_FAILED` once a request is PAID. The customer would be told the money is back, and lose points, while it is not (REFUNDS/NFR-01, LOYALTY/NFR-01). REFUNDS 03 now says Paid means the provider accepted the payout (Point 15, SME-06), but nobody asks CardPay whether an accepted payout can still fail.
- *No single paid time.* SDD 13a §17.1 Tables Design fills `paid_at` "From `PAYOUT_SUCCEEDED`", whose payload (§14.9.6) has no time field. The LOYALTY/NFR-02 hour, which also dates the take-back, is phrased three ways: SDD 13d §17.4 Constraints "when the refund is marked Paid", SDD 14 §18.2 "within 1 hour of the refund being paid", and the lag metric from `paidAt`; LOYALTY 13 OI-02 deliberately starts it at "the Refunds Portal reporting the refund as paid", and LOYALTY 03 Movement date still says "the date the refund was paid". So a broker outage between acceptance and the PAID commit counts against the loyalty hour under one reading and not the other, and near midnight the member's movement date can differ from the Paid date the same person sees in the Refunds Portal.

**Why it matters.** Paid is the moment the customer is told the money is back and points are taken; if it can be undone, the platform has no path for it, and if its time has no single definition, LOYALTY/NFR-02 cannot be measured the way the business decided.

| Option | Trade-off |
|---|---|
| A. Define the paid time once: `paid_at` is the time of the PAID transition in refund-service, the same value as `RefundPaidEvent.paidAt`, the `REFUND_PAID` envelope `occurred_at`, and the PAID row of the status history; it starts the LOYALTY/NFR-02 hour (the Refunds Portal's report, LOYALTY OI-02) and dates the take-back; align §17.4, §18.2, §19, the §14.10 and §14.9.5 notes, and LOYALTY 03. Make "can an accepted payout still fail afterwards, and how is it reported" a written CardPay confirmation (REFUNDS 02 Dependencies 1, the INT-01 and API-02 external questions, R-02), gating TASK-03; if it can, the way back (inbound contract, a state between Approved and Paid or a reversal, and what happens to the customer and the points) is designed then | One clock everyone measures the same way; no contract surface built for a case CardPay may never have; the settlement question is gated before the payout is built |
| B. As A, and reserve now an External inbound contract, an ingress route for payout-service, a settlement-failed reversal, and a compensating loyalty reversal | Ready for a later failure; designs and secures an inbound surface, and a business rule for the customer, before anyone knows whether CardPay needs them |
| C. `paid_at` is CardPay's acceptance time, carried in `PAYOUT_SUCCEEDED` | Matches the provider's record; broker and consumer delays before the PAID commit then count against the loyalty hour, against LOYALTY OI-02 |

**Recommendation.** Option A. OI-02 already decided that the loyalty hour starts at the Refunds Portal's report, so the PAID transition is the one honest origin, and taking it once in the PAID transaction gives the customer and the member the same date. Whether acceptance can be undone is a fact only CardPay can give; gating TASK-03 on it, as the other CardPay facts are, avoids building an inbound contract that may never be called.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-02 set to Applied.

**Files changed for Point 25:**

- `sdd-refunds-platform/13a-service-refund.md` - `paid_at` defined once (PAID transition); Payout outcome sets it; RefundPaid row cites it.
- `sdd-refunds-platform/10-events-hub.md` - §14.9.5 envelope `occurred_at` equals `paid_at`; §14.10 `paidAt` defined.
- `sdd-refunds-platform/13d-service-loyalty.md` - Timing starts at `paidAt` (the Refunds Portal's report); movement date note; RefundPaid row.
- `sdd-refunds-platform/14-performance-and-capacity.md` - §18.2 take-back lag counts from the Refunds Portal's report.
- `sdd-refunds-platform/15-environments.md` - §19 testers read `paid_at`.
- `sdd-refunds-platform/08-integrations.md` - INT-01 asks whether an accepted payout can still fail.
- `sdd-refunds-platform/11-api-contracts.md` - API-02 external question and §15.6 row add the settlement-failure question.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - R-02 covers a payout that fails after acceptance.
- `sdd-refunds-platform/decision-log.md` - PA-02 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-02.
- `brd-refunds-portal/02-glossary-assumptions-facts.md` - Dependency 1 adds the settlement-failure confirmation.
- `brd-refunds-portal/14-todo.md` - Business review row PA-02.
- `brd-loyalty-points/03-definitions-and-domain-concepts.md` - Movement date: the date the Refunds Portal reported the refund as paid.
- `brd-loyalty-points/14-todo.md` - Business review row PA-02 (TC-PTS-05 refresh).
- `brd-loyalty-points/decision-log.md` - PA-02 record.
- `review-comments-tracker.md` - PA-02 Applied; targets extended; Progress.

---

## Point 26 (PA-03): The receipt number is the cross-product join key, yet POS Records may not send it, its source is mis-cited, its uniqueness across branches is unconfirmed, it has no canonical form, and a mismatch parks take-backs forever without an alert (merged with SME-09, DC-01)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| **PA-03** | **Receipt-number join key unsafe** | **Current** |
| PA-05 | Member sign-in has no contract | Pending |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *Mis-cited source.* SDD 01 §3 assumption 6 lists the receipt number among the fields POS Records serves and cites LOYALTY 08, whose POS Records row exchanges only "Member, purchase reference, amount, purchase date"; LOYALTY 08's Refunds Portal row still says the Refunds Portal sends "Member, purchase reference", while REFUNDS 08 and the SDD send the receipt number. Whether POS Records can send the receipt number is now a gated LOYALTY dependency (Point 3, BO-05) and R-03 is rated High; since CL-19, SDD 13d §17.4 rejects every member purchase without one.
- *Unconfirmed uniqueness.* REFUNDS 02 Assumptions / Constraints 1 says only that every purchase has a receipt number the customer can enter. The SDD builds on uniqueness across the 40 branches: the receipt lookup takes no branch (SDD 13a §17.1), the BR-2 partial unique index is (tenant, receipt number, item line), `member_purchase.receipt_number` is UNIQUE per tenant (a second purchase is rejected as `DUPLICATE_RECEIPT`), and the take-back matches on it. In multi-branch POS estates the printed number is often a sequence per till, branch, or day, which restarts when a till is replaced.
- *No canonical form.* `refund_request.receipt_number` is stored "From the submission" (the value the customer typed), while loyalty-service stores what API-04 returns; no rule normalises the two (padding, case, branch or till prefix).
- *Silent failure.* If the forms differ, every take-back parks as `PENDING_EARN`, which has no expiry and looks exactly like a refund of a non-member purchase; §17.4 measures only applied take-backs and nothing alerts.

**Why it matters.** If receipt numbers repeat or differ in form, customers can pull up another branch's receipt, valid requests are blocked as already refunded, genuine member purchases are dropped as duplicates, and members keep points on refunded purchases, with no signal (REFUNDS/UC-01, LOYALTY/UC-02 BR-1, LOYALTY/NFR-01).

| Option | Trade-off |
|---|---|
| A. One receipt number: a single normalisation rule, defined once in SDD §15.3 from the POS Records format and applied by both POS adapters, with refund-service storing the value API-01 returns (not the typed one); make the format and the uniqueness scope written confirmations (REFUNDS 02 Assumption 1 and Dependency 2, LOYALTY 02 POS Records dependency, the API-01 and API-04 external questions, a new SDD §3 assumption 12) before TASK-01, with the fallback stated now (branch plus receipt number, or a code printed on the receipt, if numbers repeat); correct the §3 assumption 6 citation and both LOYALTY 08 rows; keep rejecting member purchases without a receipt number (CL-19), gated by the dependency; add a take-back outcome counter and an alert on the share of take-backs left pending, against a baseline measured in the pilot (not a raw pending count, which non-member purchases grow for ever) | One join key with one form; the uniqueness risk is confirmed before build, with its fallback known; a systematic mismatch shows within days; no number is invented for the alert |
| B. Key everything on branch plus receipt number now (lookup, BR-2 index, take-back match, `RefundPaid`), whatever POS Records answers | Safe if numbers repeat; changes the customer's lookup (the branch must be known) and three contracts before anyone knows it is needed |
| C. As A, but a member purchase without a receipt number still earns, and only its take-back is blocked | Earning survives a POS Records "no"; refunds of those purchases then keep their points silently, against LOYALTY/UC-02 BR-1 |

**Recommendation.** Option A. The uniqueness question is a fact about POS Records that the Retail IT team can answer before either build starts, as the other POS confirmations are; stating the fallback now means the answer changes keys, not architecture. Storing the POS-returned value removes the typed-value drift, and an alert on the pending share (rather than the count) detects a mismatch without paging on every non-member refund. Keeping the CL-19 rejection makes a POS gap visible instead of silently weakening BR-1.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-03 set to Applied.

**Files changed for Point 26:**

- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §3 assumption 6 citation corrected; new assumption 12 (receipt numbers, with fallback); R-03 description and mitigation.
- `sdd-refunds-platform/11-api-contracts.md` - API-01 and API-04 external questions; Receipt number form rule; §15.6 rows.
- `sdd-refunds-platform/13a-service-refund.md` - Receipt lookup normalises and keeps the POS-returned value; `refund_request.receipt_number` source.
- `sdd-refunds-platform/13d-service-loyalty.md` - Earn points uses the one form; pending take-backs detected by share; new `loyalty_takeback_total` metric and alert.
- `sdd-refunds-platform/decision-log.md` - PA-03 record; extension note on CL-19.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-03.
- `brd-refunds-portal/02-glossary-assumptions-facts.md` - Assumption 1 and Dependency 2: receipt number format and uniqueness.
- `brd-refunds-portal/14-todo.md` - Business review row PA-03.
- `brd-loyalty-points/02-glossary-assumptions-facts.md` - POS Records dependency: same form, uniqueness.
- `brd-loyalty-points/08-integrations.md` - POS Records row adds the receipt number; Refunds Portal row reports it.
- `brd-loyalty-points/14-todo.md` - Business review row PA-03.
- `brd-loyalty-points/decision-log.md` - PA-03 record.
- `review-comments-tracker.md` - PA-03 Applied; targets extended; Progress.

---

## Point 27 (PA-05): Member sign-in has no integration contract, §16 states the identity source two ways, and member and branch IDs are matched across Keycloak and POS Records with no owner (merged with DC-06)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| **PA-05** | **Member sign-in has no contract** | **Current** |
| PA-06 | Event wire format; RefundPaid unversioned | Pending |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (security).** Every "own data" rule in this platform is a comparison between a value in the signed-in user's token and a value in the data. Keycloak issues the token; its claims (`tenant_id`, `member_id`, `branch_id`) are trusted because only the realm can sign them. The modules then compare: a member sees the points whose `member_id` equals the claim; a branch manager sees the requests whose `branch_id` equals the claim; the gateway admits only a token whose `tenant_id` matches the host. This protects against one member reading another's points, a manager deciding another branch's refunds, and one tenant's user reaching another tenant. It only works if both sides of each comparison come from one owner in one form. If the claim and the data use different identifiers, the gate fails closed and silently (a member sees zero points, a manager an empty queue); if the mapping is wrong in a way that collides, it fails open (a member sees someone else's points). An account with no `tenant_id` is refused at the gateway.

**Issue.** Every LOYALTY use case needs a member signed in with "their existing loyalty program account" (LOYALTY 02 Dependencies, now To confirm before TASK-02, LOYALTY TD-27), yet SDD 08 §12 has no integration for that account system and §15 no contract, and SDD 01 §3 assumption 3 still asks whether it is a realm account or one the realm brokers to the loyalty program's identity provider. SDD 12 states the source two ways: §16.3 makes every `END_CUSTOMER` (members included) a "Keycloak realm, self-registered account", while §16.6 grants `MEMBER` from an account outside the platform. If brokered, the registration flow of §16.2 step 1 never sets the member's `tenant_id` (the gateway then rejects the token), and a person who is both customer and member (§7.1) has two identities nothing links. §16.6 cites §3 assumption 1 for "one account per person", which assumption 1 does not say, while §16.3 requires staff to hold a second, customer account. On identifiers: `points_movement.member_id` is the member number from POS Records (SDD 13d §17.4), compared with the `member_id` claim; `refund_request.branch_id` comes from POS Records (SDD 13a §17.1), compared with a `branch_id` the staff administrator types into Keycloak (§16.6); no document says either pair uses the same identifier or form, or who owns it. LOYALTY 16 P2 expects test members "created as needed", which the platform cannot do.

**Why it matters.** A mismatch in either pair hides a member's points or a branch's queue with no error, or, worse, shows the wrong person's data; and the identity model the LOYALTY build needs is undecided while §16 reads as if it were decided.

| Option | Trade-off |
|---|---|
| A. Name POS Records the source of truth for member numbers and branch identifiers (the `member_id` claim carries the member number POS Records reports with each purchase, in its form; the staff administrator copies `branch_id` from the branch identifiers POS Records uses); make §16.2, §16.3, §16.6, and §16.8 consistent with the still-open §3 assumption 3, stating what each answer requires (realm account: as today; brokered: `tenant_id` from the host's client, `member_id` from the provider, and linking to the person's customer account), with the INT row, contract, and mapping added when LOYALTY TD-27 is answered; §3 assumption 1 states "one account per person, staff excepted"; LOYALTY 02 and TD-27 ask for the member number in POS Records' form; LOYALTY 16 P2 takes test members from the existing program (refresh item) | Identifier ownership decided now; §16 no longer pretends the identity model is known; the build waits for TD-27 only where it must |
| B. Decide now that members sign in with a realm account in this platform (no brokering) and state "no integration needed" | Simple; decides a fact about the loyalty program's own account system that the platform does not own, and may be wrong |
| C. Decide now that the realm brokers to the loyalty program's identity provider, and write the INT row, contract, and account linking now | Complete if right; designs an integration to a system nobody has described yet |

**Recommendation.** Option A. Who owns the identifiers is a design decision the SDD can make now, and POS Records already issues both values the gates compare against; the identity model is a fact about the existing loyalty program that TD-27 must supply, so §16 should state what each answer requires instead of picking one.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-05 set to Applied.

**Files changed for Point 27:**

- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §3 assumption 1 (one account per person, staff excepted); assumptions 2 and 3 name POS Records as the identifier owner; marker points to §16.2.
- `sdd-refunds-platform/12-centralized-user-roles.md` - §16.2 step 1 states both identity answers; §16.3, §16.6, §16.8 consistent.
- `sdd-refunds-platform/08-integrations.md` - §12 member sign-in note.
- `sdd-refunds-platform/13a-service-refund.md` - `branch_id` source of truth.
- `sdd-refunds-platform/13d-service-loyalty.md` - `member_id` source of truth.
- `sdd-refunds-platform/decision-log.md` - PA-05 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-05.
- `brd-loyalty-points/02-glossary-assumptions-facts.md` - member sign-in dependency asks for the POS Records form.
- `brd-loyalty-points/14-todo.md` - TD-27 widened; Business review row PA-05 (P2 refresh).
- `brd-loyalty-points/decision-log.md` - PA-05 record.
- `review-comments-tracker.md` - PA-05 Applied; targets extended; Progress.

---

## Point 28 (PA-06): The event catalog has no wire format (headers, subject naming), the in-process RefundPaid event is unversioned, and PAYOUT_FAILED names a fact that is not terminal

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| **PA-06** | **Event wire format; RefundPaid unversioned** | **Current** |
| PA-07 | Ordering and dedup retention unstated | Pending |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (security, data minimisation).** A Kafka record has a key, headers, and a value. A consumer can read the headers without parsing the value. ADR-10 relies on this: payout-service is meant to look at the event type and drop the five refund events it does not need before it ever parses their content, so the customer's contact details in those events never enter its memory, logs, or error reports. That is data minimisation: the fewer components that ever handle personal data, the fewer places it can leak from and the fewer copies erasure has to reach. It only works if the event type is in a header; if it sits inside the value, every consumer must parse every event, contact details included, to find out what it is.

**Issue.**

- *No wire format.* SDD 06 ADR-10 says payout-service "filters by `event_type` before deserializing", but SDD 10 §14.3 defines the envelope only as record content, the outbox `payload` "holds the whole §14.3 envelope" (SDD 13a §17.1 Tables Design), and the only Kafka header named anywhere is `traceparent` (§17.1 Tracing). §14.2 registers "JSON Schema subjects per event" on topics that carry several event types, but names no subject-naming strategy, so the CI compatibility check cannot be configured from the catalog.
- *Unversioned in-process event.* The in-process `RefundPaid` (§14.10) has no envelope, no schema version, and no evolution rule (§14.6 rule 5 covers registry subjects only), yet it is stored as JSON in the publication log (SDD 07 §11.1) and replayed every 5 minutes by whichever replica holds the lock, also during a rolling update, so a field change can break the replay of entries the previous version wrote.
- *Non-terminal "failed".* `PAYOUT_FAILED` names a failure that is not terminal: since CL-09 and BO-03, the payout keeps retrying and `PAYOUT_SUCCEEDED` can still follow (SDD 13b §17.2), a meaning every future consumer must learn from prose; `REFUND_PAYOUT_DELAYED` is in the same position.

**Why it matters.** Without headers, ADR-10's promise is not implementable and payout-service handles contact data it has no use for; without a subject strategy, the compatibility check that protects consumers cannot be set up; an unversioned in-process event can break replay during a deployment; and a consumer that reads `PAYOUT_FAILED` as final will act wrongly when the payout later succeeds.

| Option | Trade-off |
|---|---|
| A. Add a wire format to §14.3: record key `refundRequestId`; headers `event_id`, `event_type`, `schema_version`, `tenant_id`, `correlation_id`, `traceparent`, written by the relay from the outbox row and envelope, so consumers filter on the `event_type` header before reading the value; value the whole JSON envelope; one registry subject per event type (`<topic>-<EVENT_TYPE>`); `RefundPaidEvent` gains `schemaVersion` and falls under §14.6 rule 5 (additive only; a breaking change is a new event name), and the publication log keeps entries replayable across a rolling update; keep the `PAYOUT_FAILED` name and type every event in the catalog as terminal or not (`PAYOUT_FAILED` and `REFUND_PAYOUT_DELAYED`: not terminal) | ADR-10 becomes implementable; the CI check can be configured; replay survives deployments; consumers read finality from the catalog; no rename churn |
| B. As A, but rename `PAYOUT_FAILED` to a name that says "retry window exceeded" | The name carries the meaning; renames an event across the SDD (figures, three service chunks, chunk 19) for what a catalog column also says |
| C. Leave the event type in the value only and accept that payout-service parses every refund event | No wire-format work; ADR-10's minimisation promise is dropped and contact data reaches a service with no use for it |

**Recommendation.** Option A. Headers are the standard way to route without parsing, and they make ADR-10 true at no cost; a subject per event type is what lets several event types share a topic and still evolve independently; the in-process event needs the same evolution rule because the publication log makes it durable. Typing finality in the catalog gives every consumer the meaning without renaming an event that 2026-10-01's decisions just wired through the design.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-06 set to Applied.

**Files changed for Point 28:**

- `sdd-refunds-platform/10-events-hub.md` - §14.3 Wire format; §14.2 subject rule; §14.5 Final column and legend; §14.6 rule 5 covers `RefundPaidEvent`; §14.9.7 and §14.9.8 finality notes; §14.10 `schemaVersion`.
- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-10 filters on the `event_type` header.
- `sdd-refunds-platform/07-cross-cutting-concerns.md` - §11.1 publication log keeps `schemaVersion`; replay across rolling updates.
- `sdd-refunds-platform/13a-service-refund.md` - outbox row names the headers; RefundPaid row versioned.
- `sdd-refunds-platform/13b-service-payout.md` - consumed events: header filter.
- `sdd-refunds-platform/13d-service-loyalty.md` - RefundPaid row versioned.
- `sdd-refunds-platform/decision-log.md` - PA-06 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-06.
- `review-comments-tracker.md` - PA-06 Applied; targets extended; Progress.

Run note: while preparing this point, a temporary text file was briefly written to `/tmp` (outside RUN) and deleted at once; the edit was redone with an in-memory variable.

---

## Point 29 (PA-07): Per-refund ordering and exactly-once claims rest on unstated relay-concurrency and dedup-retention rules

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| **PA-07** | **Ordering and dedup retention unstated** | **Current** |
| PA-08 | Loyalty extraction plan incomplete | Pending |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.**

- *Ordering.* SDD 10 §14.3 promises that "all facts about one refund stay in order on one partition", but partition order is the order in which relays publish, and no chunk says how many relays publish one outbox. SDD 18 §23 Reviewer Notes left "outbox relay concurrency across core replicas" to the LLD on the premise that "each refund has one payout event type"; CL-09 and Point 1 (BO-03) broke that premise, since `PAYOUT_SUCCEEDED` can now follow `PAYOUT_FAILED`, and `REFUND_PAID` can follow `REFUND_PAYOUT_DELAYED`. Draining a backlog after a broker outage (SDD 16 §20.1.7) with several relays can publish a refund's later fact before its earlier one: the customer is told "paid" and then "delayed". The planned consumers (the §22 analytics subscriber, an extracted loyalty-service) would rely on an order that does not hold.
- *Dedup retention.* The exactly-once effect holds only while each dedup record outlives every redelivery. Yet inbox rows are purged after 7 days (SDD 13a and 13b Retention Policy), topic and DLQ retention is still a §6 marker (SDD 02 §6), replay is an offset reset (§14.2) with no written procedure (§20.1.3 marker), and notification-service's only dedup is its delivery log, deleted after `messageLogRetention`, a tenant setting the REFUNDS owner may shorten (SDD 13c Retention Policy). A replay older than that window re-sends customer messages.

**Why it matters.** Customers can receive messages out of order, a replay can send them twice, and future consumers would be built on an ordering promise the publishing side does not keep.

| Option | Trade-off |
|---|---|
| A. State the publishing contract in §14.6 rule 3 (one active relay per outbox, under a database lock, publishing in commit order with an idempotent producer; consumers that rely on per-refund order listed: notification-service, refund-service, and any future loyalty or analytics subscriber; `aggregate_version` stays the state guard); add a dedup-window rule to §14.6 rule 2 (every dedup record is kept at least the topic retention plus the DLQ retention plus the replay window, §6 and §20.1.3); the inbox purge follows that window instead of a flat 7 days (kept until those values are set); `messageLogRetention` can never be set below it; §20.1.7, §20.1.3, the §6 marker, and the §23 reviewer note follow | The ordering promise becomes true and the exactly-once claim holds for any replay the runbook allows; one relay per outbox caps publishing throughput, ample for about 1,200 requests a month |
| B. Drop the ordering promise: consumers must tolerate any order, and relays may run in parallel | Simpler relays; customers can still get "paid" before "delayed", and every future consumer must handle reordering |
| C. Keep the 7-day purge and limit topic retention, DLQ retention, and the replay window to fit inside it | No retention changes in the services; replay and DLQ recovery are limited to under a week |

**Recommendation.** Option A. A single relay under a lock is the simplest way to make partition order equal commit order, and at this volume it costs nothing measurable; tying the dedup window to the retention values makes the exactly-once claim a rule instead of a coincidence, and the floor on `messageLogRetention` costs little privacy because the clear address is already erased when a message is final.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-07 set to Applied.

**Files changed for Point 29:**

- `sdd-refunds-platform/10-events-hub.md` - §14.6 rule 2 dedup window; rule 3 publishing order; §14.2 delivery semantic.
- `sdd-refunds-platform/13a-service-refund.md` - inbox purge follows the dedup window; purge index note.
- `sdd-refunds-platform/13b-service-payout.md` - inbox purge follows the dedup window.
- `sdd-refunds-platform/13c-service-notification.md` - `messageLogRetention` floor.
- `sdd-refunds-platform/02-ecosystem-overview.md` - §6 Kafka marker notes the dedup window.
- `sdd-refunds-platform/16-operations-runbook.md` - §20.1.7 one relay per outbox; §20.1.3 marker notes the replay window.
- `sdd-refunds-platform/18-open-items-and-clarifications.md` - §23 reviewer note superseded in part.
- `sdd-refunds-platform/decision-log.md` - PA-07 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-07.
- `review-comments-tracker.md` - PA-07 Applied; targets extended; Progress.

---

## Point 30 (PA-08): The loyalty extraction trigger has no contract delta, PII boundary, cutover rule, or negative-balance policy for redemption

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| **PA-08** | **Loyalty extraction plan incomplete** | **Current** |
| PA-09 | Refund data shown to another member | Pending |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** SDD 06 ADR-01 reduces extracting loyalty-service to "consumes `REFUND_PAID` from Kafka instead of `RefundPaid` in process; extraction adds `receiptNumber` to `REFUND_PAID`" (also SDD 10 §14.7 and SDD 17 §22 item 1; decided in SDD OI-04). But `REFUND_PAID` (SDD 10 §14.9.5) is not a drop-in replacement for `RefundPaidEvent`: it carries `customerId` and `customerContact`, which ADR-10 says "every reader" of the refund topic receives, so an extracted loyalty-service, and the §22 item 3 analytics subscriber "on both topics", would receive contact data they have no use for, while ADR-10 revisits a separate topic only "with a second tenant". No cutover rule covers the move from the core's publication log to a Kafka consumer with its own database: a refund paid during the switch can be applied twice or not at all, because the take-back dedup (`refund_takeback`, keyed on `refund_request_id`) lives in the core database. And one of the two triggers, points redemption, voids the SDD 13d §17.4 Constraints invariant "a balance cannot go below zero", which holds only because points are never spent; a take-back after redemption needs a negative-balance policy that no BRD question asks for (LOYALTY 13 OI-13 covers the redemption horizon only).

**Why it matters.** When the trigger fires, the team would extract with a contract that leaks contact data into loyalty, a cutover that can lose or double take-backs, and no rule for a refund that takes back points a member has already spent.

| Option | Trade-off |
|---|---|
| A. Write the extraction contract now in §14.7: an extracted loyalty-service consumes a PII-free paid-refund event carrying exactly the `RefundPaidEvent` fields (key `refundRequestId`) on a topic of its own that carries no contact details, never `refunds-platform-refund-events` (event and topic names set when the extraction is designed); a cutover rule (publish both ways in one transaction for a release, drain the publication log, copy the `loyalty` schema with `refund_takeback`, start the consumer from the topic's start so already-applied refunds are no-ops, then drop the in-process path); ADR-10 gains the revisit trigger "any new reader of the refund topic" and the §22 analytics subscriber reads PII-free feeds only; LOYALTY OI-13 also asks what happens when a refund takes back points already spent | Extraction becomes a planned, PII-safe change with no lost or doubled take-backs; one more topic at extraction; a business question raised now instead of at redemption |
| B. As A for cutover and the negative-balance question, but loyalty-service consumes `REFUND_PAID` with `receiptNumber` and `paidAt` added, as ADR-01 says today | One topic fewer; contact data reaches a service with no use for it, against ADR-10 |
| C. Leave the extraction delta to the extraction project | No work now; the trigger can fire with no contract, no cutover rule, and no policy for spent points |

**Recommendation.** Option A. The in-process `RefundPaidEvent` already has exactly the PII-free shape loyalty needs, so the integration twin should keep that shape rather than inherit `REFUND_PAID`'s contact data; publishing both ways inside one transaction and carrying the dedup across makes the cutover safe without a freeze; and the negative-balance question belongs with the redemption horizon in LOYALTY OI-13, where the business decides both together.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-08 set to Applied.

**Files changed for Point 30:**

- `sdd-refunds-platform/10-events-hub.md` - §14.7 Extraction contract (PII-free feed, cutover, redemption); §14.9.5 note.
- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-01 Consequences cite the contract; ADR-10 revisit trigger.
- `sdd-refunds-platform/17-appendix-and-wishlist.md` - §22 items 1 and 3.
- `sdd-refunds-platform/13d-service-loyalty.md` - "No redemption" invariant points to LOYALTY OI-13.
- `sdd-refunds-platform/18-open-items-and-clarifications.md` - OI-04 status: extraction part superseded.
- `sdd-refunds-platform/decision-log.md` - PA-08 record; supersession note on OI-04.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-08.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-13 asks about points already spent.
- `brd-loyalty-points/14-todo.md` - TD-30 widened; Business review row PA-08.
- `brd-loyalty-points/decision-log.md` - PA-08 record.
- `review-comments-tracker.md` - PA-08 Applied; targets extended; Progress.

---

## Point 31 (PA-09): Loyalty screens show refund details to the member whose number was used at checkout, who may not be the refund's customer, against REFUNDS/NFR-04

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| **PA-09** | **Refund data shown to another member** | **Current** |
| PA-10 | Receipt number in the URL path | Pending |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (security).** Each bounded context enforces its own access rule on the data it owns: refund-service lets only the request's customer (`customer_id` equals the token's `sub`) and their branch's manager see a request. When data is copied into another context, it arrives without that rule; the receiving context applies its own rule instead (loyalty-service: "own points", the `member_id` claim). If the receiving rule admits a different set of people, the data is now visible to people the owner's rule refuses, without anyone deciding so. That is why a cross-context contract must say which attributes may leave the owning context and who may see them on the other side; otherwise the weakest rule on any copy becomes the real rule.

**Issue.** REFUNDS 10 NFR-04 says "Only the customer and their branch's manager can see a request", and refund-service enforces it (SDD 12 §16.2 step 4). LOYALTY 06a UC-02 step 4, A1, AC-1, AC-4, and AC-6 require showing the refund reference, the paid date, and the refunded amount on the taken-back movement. SDD 13d §17.4 serves these from `refund_takeback` (`PointsMovementDetail.refund`) to whoever holds the matching `member_id`. But the take-back is matched by receipt number to the member whose number was used at checkout, not to the customer who filed the refund: SDD 03 §7.1 treats Member and Customer as different roles and possibly different people, and SDD OI-14 records that any signed-in customer can file against any receipt number. So refund data crosses into the loyalty context and is shown to a person the refund context's own rule refuses. Neither cross-BRD reconciliation in the SDD decision log mentions it, and the §14.10 `RefundPaid` contract does not say which refund attributes may leave the refund context.

**Why it matters.** A requirement of one BRD (NFR-04) is broken by a requirement of the other (LOYALTY UC-02 AC-4) without either owner having decided it; the member learns that someone refunded their purchase, for how much, and the request's reference.

| Option | Trade-off |
|---|---|
| A. Raise linked open items in both BRDs (REFUNDS OI-32, LOYALTY OI-18 with TD-35, owners: both product managers, with the data protection owner; decide before TASK-04 of LOYALTY), recommending that the member sees the refunded amount and paid date of a refund of their own purchase but not the REFUNDS reference, which identifies another person's request; meanwhile the §14.10 contract lists the refund attributes that leave the refund context (`referenceNumber`, `receiptNumber`, `paidAmount`, `paidAt`) and that the loyalty context shows them only to the member whose purchase it was, with the reference's display pending the open items | Neither owner's requirement is overridden by the design; the conflict is visible and gated; the contract states the boundary now |
| B. Decide now: replace the REFUNDS reference on the loyalty screens with a loyalty-side reference, keep amount and date (change LOYALTY UC-02 A1, AC-1, AC-4, AC-6 and §17.4 now) | Closes the gap at once; a reviewer changes a LOYALTY requirement without its owner |
| C. Decide now that NFR-04 covers the request record only, and a refund of a member's purchase may be shown to that member in full | No change to LOYALTY; weakens a REFUNDS privacy requirement without its owner |

**Recommendation.** Option A. The conflict sits between two business owners' requirements, so the design must not settle it silently; stating the attribute boundary in §14.10 now makes the exposure explicit and narrow, and the recommended answer keeps what the member needs to understand a take-back (amount and date of their own purchase's refund) while withholding the identifier of another person's request.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-09 set to Applied.

**Files changed for Point 31:**

- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-32 (open, linked to LOYALTY OI-18); Open list.
- `brd-refunds-portal/14-todo.md` - G1 lists OI-32; Business review row PA-09.
- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-18 (open, linked to REFUNDS OI-32); Open list.
- `brd-loyalty-points/14-todo.md` - TD-35 (P1); G1; Business review row PA-09.
- `brd-loyalty-points/decision-log.md` - PA-09 record.
- `sdd-refunds-platform/10-events-hub.md` - §14.10 attributes that leave the refund context.
- `sdd-refunds-platform/13d-service-loyalty.md` - `PointsMovementDetail` note.
- `sdd-refunds-platform/12-centralized-user-roles.md` - §16.2 step 4 cross-context rule.
- `sdd-refunds-platform/decision-log.md` - PA-09 record; note after the cross-BRD reconciliation.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-09.
- `review-comments-tracker.md` - PA-09 Applied; targets extended; Progress.

---

## Point 32 (PA-10): The receipt lookup puts a declared personal-data value in the URL path, which gateway logs and spans record, and gateway logs and traces are in no erasure path

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| **PA-10** | **Receipt number in the URL path** | **Current** |
| PA-11 | Single-column keys vs the tenant rule | Pending |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (security).** A URL is copied far more widely than a request body: gateway and proxy access logs, tracing spans (the path is a standard span attribute), browser history, and error reports all record it by default, each with its own retention and none of them reached by an application's erasure job. Bodies are not logged unless someone chooses to. So personal data placed in a URL spreads to stores that the data owner cannot see or erase, and a "never log personal data" rule cannot be enforced in code, because the leak comes from the API's shape. The same applies to identifying hosts: when each tenant has its own host name, a log line that records the host names the tenant in clear, which is exactly what the keyed `tenant_ref` exists to avoid.

**Issue.** SDD 13d §17.4 Compliance declares receipt numbers personal data, and SDD 07 §11.4 bars personal data from logs at INFO or above. Yet the receipt lookup is `GET /v1/receipts/{receiptNumber}/refundable-items` (SDD 13a §17.1 List of APIs; SDD 03 §7.3; SDD 05 Figure 6), and the API gateway is defined to log requests (SDD 02 §6 API Gateway row), while OpenTelemetry spans run from the gateway through the core. §17.1 Logging forbids "receipt contents" but not the number. This is also the route SDD OI-14 identifies as an enumeration target. Gateway logs and trace storage appear in no erasure path (SDD 10 §14.9 map, §17.1 and §17.4 Compliance). And since each tenant runs on its own host (SDD 12 §16.2), an INFO request log that records the host names the tenant in clear.

**Why it matters.** Receipt numbers, which link a person to a purchase, would land in the gateway logs and traces of every lookup, beyond any erasure, against the platform's own logging rule; and tenant identities would appear in clear in every request log.

| Option | Trade-off |
|---|---|
| A. Move the receipt number into a body: `POST /v1/receipt-lookups` with `ReceiptLookupRequest` (`receiptNumber`), answering 200 with `RefundableItemsView`; a read that changes no state, so no `Idempotency-Key`; the gateway rate limit moves to this route. Add to §11.4 that no personal data travels in URL paths or query strings, that gateway logs and spans record the route template only, and that the tenant host is logged only as `tenant_ref`; add the gateway log and trace stores to the §14.9 erasure map with their §6 retention as the bound; update §7.3, Figure 6, §6, §16.2, §17.1, and §17.4 | The leak is removed by the API's shape, not by configuration; one rule covers every future endpoint; a POST for a read is less idiomatic and not cacheable, which this lookup does not need |
| B. Keep the GET and mandate redaction of this route at the gateway and in span attributes | No API change; depends on configuration in two places, and any new tool that records raw URLs leaks again |
| C. Keep the GET and treat receipt numbers as not personal | No change; contradicts §17.4 Compliance, since a receipt number links a member to a purchase |

**Recommendation.** Option A. Taking the value out of the URL is the only fix that does not depend on every log and trace pipeline being configured correctly, and stating the rule in §11.4 prevents the next endpoint from repeating it; the lookup has no caching or bookmarking need that a GET would serve, and the change happens before any client exists.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-10 set to Applied.

**Files changed for Point 32:**

- `sdd-refunds-platform/13a-service-refund.md` - List of APIs: `POST /v1/receipt-lookups`; Idempotency rule; `ReceiptLookupRequest` DTO; Logging rule.
- `sdd-refunds-platform/03-users-and-use-cases.md` - §7.3 REFUNDS/UC-01 row uses the new route.
- `sdd-refunds-platform/05-workflows-and-sequences.md` - Figure 6 lookup message.
- `sdd-refunds-platform/02-ecosystem-overview.md` - §6 API Gateway row: route and log content.
- `sdd-refunds-platform/07-cross-cutting-concerns.md` - §11.4 no personal data in URLs; route-template logs and spans; erasure bound.
- `sdd-refunds-platform/10-events-hub.md` - §14.9 erasure map row for log and trace stores.
- `sdd-refunds-platform/12-centralized-user-roles.md` - §16.2 step 2: tenant only as `tenant_ref`.
- `sdd-refunds-platform/13d-service-loyalty.md` - Compliance: no personal data in URLs.
- `sdd-refunds-platform/18-open-items-and-clarifications.md` - OI-14 status notes the new route.
- `sdd-refunds-platform/decision-log.md` - PA-10 record; extension note on OI-14.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-10.
- `review-comments-tracker.md` - PA-10 Applied; targets extended; Progress.

---

## Point 33 (PA-11): Single-column primary and foreign keys break the "tenant_id leads every index" rule, and each Tables Design bars the LLD from changing them

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| **PA-11** | **Single-column keys vs the tenant rule** | **Current** |
| PA-12 | E2E gate overstates readiness | Pending |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**First principles (security).** In a shared-schema multi-tenant database, every row carries `tenant_id`, and two mechanisms keep tenants apart: queries filter by tenant (backed by PostgreSQL row-level security), and the schema's own constraints keep relationships inside one tenant. Row-level security filters what a query can see, but PostgreSQL does not apply it to referential-integrity checks, so a foreign key on a bare `id` will accept a child row that points at another tenant's parent. A composite foreign key `(tenant_id, parent_id)` that references a composite primary key `(tenant_id, id)` makes such a row impossible: the database itself refuses a cross-tenant reference, whatever bug or misused worker role produced it. It also makes the platform's indexing rule (every index leads with `tenant_id`) true for the keys, which are indexes too.

**Issue.** SDD 06 ADR-03 makes `tenant_id` "the leading column of every index", and SDD 07 §11.1 restates "every index starts with `tenant_id`" as the platform rule. Yet `refund_request`, `refund_item`, `refund_status_history` (SDD 13a §17.1), `payout`, `payout_attempt` (SDD 13b §17.2), `notification_message`, `message_template` (SDD 13c §17.3), `member_purchase`, `points_movement`, and `purchase_import_rejection` (SDD 13d §17.4) are keyed on `id` alone, and both outbox tables on `event_id` alone (SDD OI-06 fixed only the inbox key). Every foreign key (for example `refund_item.refund_request_id`) references the bare `id`. Figures 15, 19, 22, and 24 show the same. Each Tables Design then tells the child LLD it may "never change a key, a uniqueness rule, or a tenant rule above", so the LLD inherits a contradiction it may not resolve.

**Why it matters.** Nothing in the schema stops a child row from pointing at another tenant's parent, which is exactly the failure multi-tenancy rules exist to prevent, and the LLD is told both to follow the tenant rule and never to change the keys that break it.

| Option | Trade-off |
|---|---|
| A. Make every key composite: primary keys `(tenant_id, id)` (or a natural key that leads with `tenant_id`), foreign keys `(tenant_id, parent id)` referencing the parent's composite key, outboxes `(tenant_id, event_id)`; state the rule in ADR-03 and §11.1 and apply it to every Tables Design and Figures 15, 19, 22, and 24 | The schema refuses cross-tenant references, and the indexing rule holds without exception; keys are wider and every join names `tenant_id`, which the tenant filter already requires |
| B. Record an explicit exception: UUIDv7 keys stay single-column, with a named compensating control (for example a check in each repository that the parent's tenant matches) | Narrower keys; isolation of references then rests on code that every new table must remember |

**Recommendation.** Option A. The tenant rule is a house rule the platform cannot opt out of, and composite keys enforce it in the one place no code path can bypass; the cost (wider keys, `tenant_id` in every join) is already paid by the tenant filter every query applies.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row PA-11 set to Applied.

**Files changed for Point 33:**

- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-03: composite primary and foreign keys.
- `sdd-refunds-platform/07-cross-cutting-concerns.md` - §11.1 PK strategy and Indexing.
- `sdd-refunds-platform/13a-service-refund.md` - Tables Design keys; Figure 15.
- `sdd-refunds-platform/13b-service-payout.md` - Tables Design keys (new `payout_attempt` key row); Figure 19.
- `sdd-refunds-platform/13c-service-notification.md` - Tables Design keys (new `template_id` row); Figure 22.
- `sdd-refunds-platform/13d-service-loyalty.md` - Tables Design keys and foreign keys; Figure 24.
- `sdd-refunds-platform/decision-log.md` - PA-11 record.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists PA-11.
- `review-comments-tracker.md` - PA-11 Applied; targets extended; Progress.

Run note: for this point the SDD edits were made before this log entry was written; the presentation above was composed from the text as it stood before the change.

---

## Point 34 (PA-12): The e2e gate reads Open while gated specs depend on open markers and Proposed ADRs outside E3's scope (§12 timeouts, ADR-04, ADR-08, broker retention) (merged with DC-02; lineage-row part: see DC-11)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| PA-11 | Single-column keys vs the tenant rule | Applied |
| **PA-12** | **E2E gate overstates readiness** | **Current** |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Pending |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** Gate condition E3 checks clarification markers only in chunks 09 to 13x and §7.3 (SDD master, End-to-End View note; chunk 19 GATE header). So the gate opened on 2026-10-01 (SDD decision-log "E2E gate check, 2026-10-01 (after the clarification decisions)") while the gated specs compute from values that are still open elsewhere:

- the payout lease is "the INT-01 timeout plus one minute" (SDD 13b §17.2) and the message claim "the INT-02 timeout plus one minute" (SDD 13c §17.3), and a message fails at "the attempt limit of §12 INT-02", but the §12 timeouts and retry delays are markers (SDD 08 §12 INT-01 to INT-03), as SDD 11 §15.3's "Timeout, retries, circuit breaker" rows inherit;
- chunk 19 §24.6 item 8 names the Proposed ADR-08 as a normative home, and 13a and 13d base their API style on the Proposed ADR-04 (SDD 06);
- the only bound on customer PII in the retained refund topic and its DLQs is ADR-10's "no longer than the replay window §20.1.3 needs", while SDD 16 §20.1.3 is an empty placeholder and the SDD 02 §6 retention is a marker, so the §14.9 erasure map, 13a Compliance, and SDD 01 §4 R-06 ("one bounded retention") promise a limit no document sets.

The business review has since shut the gate for E4 (master: "Shut - Stale"), but once the reconciliation reruns, E3 as written would open it again over the same gaps. (The §2.2 native-app question PA-12 also raised was closed in Point 24, PM-12.)

**Why it matters.** "Open" tells LLD authors and implementers that the gated contracts are complete, when the lease, claim, retry, retention, and authorization rules they depend on are not.

| Option | Trade-off |
|---|---|
| A. Widen E3 in this SDD: it also covers every marker or Proposed ADR that a rule in chunks 09-13x or a §24.6 doctrine cites normatively (today: §12 INT-01 to INT-03 timeouts and retries, §6 Kafka version, registry, and retention, §20.1.3, ADR-04, ADR-08); state it in the master's End-to-End View note; the master gate line lists them as unmet and flags that §24.6 item 8 rests on the Proposed ADR-08; R-06 and the §14.9 erasure map say their bound is not set yet; chunk 19's GATE header takes the wider wording at its next refresh (chunk 19 is not edited while the gate is shut) | The gate opens only when what the gated specs compute from is decided; the SDD sets a stricter local condition than the skill's minimum |
| B. Keep E3 and list each cited marker and Proposed ADR as an accepted exception in chunk 19 | The gate can open with known gaps; needs a chunk 19 edit while it is shut, and implementers still build on missing values |
| C. Resolve the markers now (set timeouts, retention, accept ADR-04 and ADR-08) | Closes the gaps; needs values from the platform team and the provider documentation, which this review does not have |

**Recommendation.** Option A. The gate's purpose is to stop implementation-facing consolidation over undecided inputs, and a marker one hop away is as undecided as one inside the gated chunks; widening E3 in the SDD keeps the skill's condition as the floor while making the gate honest, and it needs no invented value.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied; tracker row PA-12 set to Applied. Structural decisions 6 (PA-08, recorded now) and 7 (PA-12) added to the tracker.

**Files changed for Point 34:**

- `sdd-refunds-platform/refunds-platform-sdd-master.md` - End-to-End View note widens E3; gate line lists the unmet items and flags §24.6 item 8.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - R-06: the retention bound is still open.
- `sdd-refunds-platform/10-events-hub.md` - §14.9 erasure map: retention value still open.
- `sdd-refunds-platform/decision-log.md` - PA-12 record; supersession note on the 2026-10-01 gate check.
- `review-comments-tracker.md` - PA-12 Applied; targets extended; Progress; structural decisions 6 and 7.

---

## Point 35 (DC-03): Chunk 18 still shows OI-18 and OI-19 as applied in forms the clarification decisions superseded, with no Superseded status or note

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| PA-11 | Single-column keys vs the tenant rule | Applied |
| PA-12 | E2E gate overstates readiness | Applied |
| **DC-03** | **Chunk 18 shows superseded OI-18, OI-19** | **Current** |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Pending |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** SDD 18 (still v1.0) shows OI-18 as "Accepted - applied" with a `NO_EARN` close one day after `paidAt`, a match on the purchase reference, "no `EARNED` movement" as the trigger, and a citation of "LOYALTY 02 § Assumptions 1", which now reads "None."; it shows OI-19 rejecting 0-point purchases into `purchase_import_rejection`. The live SDD 13d §17.4 does none of this: `PENDING_EARN` has no expiry, the match is on the receipt number (CL-19), the pending status applies only while the purchase is unreported, and a 0-point purchase is recorded as `no_points`. The supersession is written only in the SDD decision log (OI-18 and OI-19 records of 2026-10-01), and chunk 18's Status legend has no value for it (Open / Accepted - applied / Adjusted - applied / Deferred / Rejected). The decision log's own "LOYALTY v1.2 update clarification register" entry on partial take-backs and its "Targeted update, 2026-10-01" entry still say the take-back runs "under a lock on the purchase reference"; CL-19 replaced that lock but does not list them among what it supersedes. The same gap now affects OI-04, whose extraction part this review superseded (Point 30, PA-08).

**Why it matters.** The master sends reviewers to chunk 18 to triage findings; a reader who takes it as the decision record would restore the one-day close (dropping BR-4 take-backs, against LOYALTY/NFR-01) and the false rejection alerts.

| Option | Trade-off |
|---|---|
| A. Add `Superseded` (in full or in part, with a pointer to the superseding record) to chunk 18's Status legend and to its GATES note as a resolved status; set OI-18, OI-19, and OI-04 to "Superseded in part" with pointers and the live rule's home, and annotate their Resolution Log rows; mark the decision-log v1.2 register entry and the targeted-update entry as superseded by CL-19, and list them in the CL-19 record | History stays intact and every stale answer points to the live one, on both sides; one more status value for the gate check to read |
| B. Rewrite OI-18 and OI-19 in place to the current design | Chunk 18 reads current; the record of what was decided on 2026-09-30, and why, is lost |
| C. Leave chunk 18 as is; the decision log already holds the supersession | No change; the stale answers keep misleading anyone triaging from chunk 18 |

**Recommendation.** Option A. A supersession is a status, not a rewrite: marking it where the stale answer sits, with a pointer, keeps the audit trail and stops it from being reapplied; listing the entries in CL-19 makes the supersession visible from both sides, as the review rules require.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied; tracker row DC-03 set to Applied.

**Files changed for Point 35:**

- `sdd-refunds-platform/18-open-items-and-clarifications.md` - GATES note and Status legend add Superseded; OI-18, OI-19, OI-04 Superseded in part; Resolution Log rows annotated.
- `sdd-refunds-platform/decision-log.md` - DC-03 record; supersession notes on the v1.2 register entry and the targeted-update entry; CL-19 lists them.
- `review-comments-tracker.md` - DC-03 Applied; targets extended; Progress.

---

## Point 36 (DC-04): Figures 4 and 7 and ADR-01 still end the payout at the retry window, contradicting CL-09, and Figure 3 omits core_events

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| PA-11 | Single-column keys vs the tenant rule | Applied |
| PA-12 | E2E gate overstates readiness | Applied |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Applied |
| **DC-04** | **Figures 4, 7, ADR-01 contradict CL-09** | **Current** |
| DC-08 | Card-paid cap vs whole-purchase rule | Pending |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** Since CL-09, a payout still failing after the retry window keeps retrying at the post-window interval, and `PAYOUT_SUCCEEDED` can still follow (SDD 13b §17.2, §14.5.2). When the panel ran, SDD 05 §8.4.1 Figure 4 ended at "Stays APPROVED: branch manager told" with no path to PAID, and §8.5.2 Figure 7 presented the two outcomes as alternatives; Point 1 (BO-03) has since redrawn both with the post-window loop and the delay notice, so that part is closed. Still open: SDD 06 ADR-01 argues from "one-day retries" (Why) and "one-day retry loops" (Alternatives & Trade-offs), although retries now continue past the window, which is a tenant setting (`payoutRetryWindow`, default 24 hours); SDD 04 §8.3 Figure 3 labels the core database "refund and loyalty schemas", although OI-03 added the `core_events` schema for the publication log (§11.1, and Figure 27 shows it); and the decision-log record "Clarification decisions applied, 2026-10-01" lists the CL-09 back-fill (§8.1.2) but not §8.4.1, §8.5.2, or ADR-01, which it left stale.

**Why it matters.** The master's "Review architecture" path reads chunks 04, 06, and 05 before 19, so readers meet the stale model first; an ADR that argues from a one-day loop misstates the failure isolation it buys, and a diagram that hides a schema hides the infrastructure the in-process events depend on.

| Option | Trade-off |
|---|---|
| A. Reword ADR-01 to the current model (retries within the tenant's retry window, then at the post-window interval until the provider accepts), add `core_events` to the Figure 3 core database node, and add a note to the back-fill record listing §8.4.1 and §8.5.2 (redrawn by BO-03) and ADR-01 (reworded now) | Every architecture view agrees with CL-09 and BO-03; the record shows what the back-fill missed and when it was closed |
| B. Fix ADR-01 and Figure 3 only | Same reading experience; the back-fill record keeps overstating what it covered |

**Recommendation.** Option A. The two remaining edits are wording and a label, and the record note makes the history accurate at no cost; versions are bumped at the verify step for every chunk the review changed, chunks 04, 05, and 06 included.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied; tracker row DC-04 set to Applied.

**Files changed for Point 36:**

- `sdd-refunds-platform/06-principles-and-decisions.md` - ADR-01 Why and Alternatives & Trade-offs: retry window, then post-window retries.
- `sdd-refunds-platform/04-architecture-style-and-diagrams.md` - Figure 3 core database node and summary show `core_events`.
- `sdd-refunds-platform/decision-log.md` - DC-04 record; notes on the CL-09 record and the "Clarification decisions applied" record.
- `review-comments-tracker.md` - DC-04 Applied; targets extended; Progress.

---

## Point 37 (DC-08): The card-paid cap makes LOYALTY UC-02 BR-3's "whole purchase refunded" unreachable for split-tender receipts, and the two compared amounts have no shared basis

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| PA-11 | Single-column keys vs the tenant rule | Applied |
| PA-12 | E2E gate overstates readiness | Applied |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Applied |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Applied |
| **DC-08** | **Card-paid cap vs whole-purchase rule** | **Current** |
| DC-11 | SDD lineage rows misstate state | Pending |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** SDD 13a §17.1 (Receipt lookup, Submit) caps every refund of a receipt paid partly by card at its card-paid amount (SDD OI-13; the business rule is open as REFUNDS OI-06). SDD 13d §17.4 (Take points back) realises LOYALTY 06a UC-02 BR-3 ("When the whole purchase has been refunded, all the points it earned are taken back") by comparing the refunded money total with the member purchase amount. For a split-tender receipt, every item can be returned, yet the refunded total never reaches the purchase amount, so the member keeps points for a fully returned purchase. The comparison also mixes two sources: the API-01 receipt item amounts that refunds are built from, and the API-04 member purchase amount (SDD 11 §15.3); nothing states that they share a basis (after discounts, with items that earn no points). If they differ, the whole-purchase branch fires wrongly or never, and that divergence is the only way the BR-3 cap can trigger in production (SDD 15 §19). The SDD decision-log "Cross-BRD reconciliation, 2026-10-01" concluded "no glossary split" without examining either effect, and OI-13's question went to the REFUNDS owner only.

**Why it matters.** Members keep points on purchases they have fully returned whenever part was paid in cash, against LOYALTY/UC-02 BR-3 and LOYALTY/NFR-01, and an unconfirmed amount basis can make take-backs wrong in either direction.

| Option | Trade-off |
|---|---|
| A. Raise LOYALTY OI-19 (TD-36, before TASK-01), linked to REFUNDS OI-06: does "whole purchase refunded" mean every item returned or the full amount repaid (recommended: every item returned, which needs the Refunds Portal to report when a refund completes the purchase); add to the API-01 and API-04 external questions whether the receipt's item amounts and the member purchase amount share one basis; §17.4 notes that the whole-purchase branch is unreachable for split tender until OI-19 is decided and rests on that basis | The business owners decide the meaning; the amount basis is confirmed with POS Records before the build; no contract change until then |
| B. Decide now: `RefundPaid` reports whether the refund completes the receipt (every line refunded), and loyalty takes back all remaining points then | Fixes split tender at once; changes the §14.10 contract and LOYALTY's rule without its owner |
| C. Leave as is | No work; fully returned split-tender purchases keep points |

**Recommendation.** Option A. Whether "whole purchase" means items or money is a business definition the LOYALTY owner must give, and it interacts with the card-only rule REFUNDS OI-06 is deciding; the amount basis is a POS Records fact. Recording both now, with the likely contract change named in the recommended answer, keeps the design from silently choosing.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row DC-08 set to Applied.

**Files changed for Point 37:**

- `brd-loyalty-points/13-open-items-and-clarifications.md` - OI-19 (open, linked to REFUNDS OI-06); Open list.
- `brd-loyalty-points/14-todo.md` - TD-36 (P1); G1; Business review row DC-08.
- `brd-loyalty-points/decision-log.md` - DC-08 record.
- `brd-refunds-portal/13-open-items-and-clarifications.md` - OI-06 links Loyalty Points OI-19.
- `brd-refunds-portal/14-todo.md` - Business review row DC-08.
- `sdd-refunds-platform/11-api-contracts.md` - API-01 and API-04 amount-basis questions; §15.6 rows.
- `sdd-refunds-platform/13d-service-loyalty.md` - Take points back: the two open limits of the whole-purchase rule.
- `sdd-refunds-platform/decision-log.md` - DC-08 record; note after the cross-BRD reconciliation.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists DC-08.
- `review-comments-tracker.md` - DC-08 Applied; targets extended; Progress.

---

## Point 38 (DC-11): SDD lineage: the Child LLDs row (LLD 1.1, SDD 1.2) disagrees with the decision log's last check (LLD 1.0, SDD 1.0), Source BRDs shows no status for the unapproved LOYALTY 1.2, and the Changes Log has two 1.0 rows (lineage-row part of PA-12 resolved here)

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| PA-11 | Single-column keys vs the tenant rule | Applied |
| PA-12 | E2E gate overstates readiness | Applied |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Applied |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Applied |
| DC-08 | Card-paid cap vs whole-purchase rule | Applied |
| **DC-11** | **SDD lineage rows misstate state** | **Current** |
| DC-12 | Colliding and positional IDs | Pending |

**Issue.** SDD 00 Document Lineage shows the Child LLDs row as LLD 1.1 against SDD 1.2, while the SDD decision-log "Child LLDs check, 2026-10-01 (clarification decisions run)" records LLD 1.0 having read SDD 1.0 and says "only lld-unifier refreshes the row"; the row shows no out-of-date state. Reading the LLD itself (`lld-refunds-platform/00-metadata.md`, Changes Log row 1.1) settles the first part: lld-unifier refreshed the LLD to 1.1 against SDD 1.2 on 2026-10-01, after that check, so the row's numbers are right and the decision-log check is simply older. But the business review has since changed the SDD after 1.2 (the version bump waits for the verify step), so the LLD is now out of date, and the row cannot say so. Source BRDs lists REFUNDS 1.0 and LOYALTY 1.2 with no status, though both covers now read In Review (LOYALTY 1.1 and 1.2 were never approved; REFUNDS changed after approval, Point 3, BO-06). The Changes Log has two rows numbered 1.0; the second applied 22 open items, contract changes included, against the master's VERSIONING rule.

**Why it matters.** Anyone tracing from the LLD to the SDD cannot tell whether the LLD carries the current contracts, and anyone reading the SDD cannot see that it rests on BRD versions nobody has signed off.

| Option | Trade-off |
|---|---|
| A. Add a State column to Child LLDs ("Out of date since the business review of 2026-10-01: LLD 1.1 read SDD 1.2, as its Changes Log row 1.1 records; refreshed by lld-unifier once this SDD is Approved") and a Status column to Source BRDs (both In Review, awaiting sign-off, BRD 14 / G6); relabel the second 1.0 Changes Log row "1.0 (amended)" with a note that it was published without a bump; mark the decision-log Child LLDs check as superseded by the LLD's own 1.1 record | The lineage tells the truth about both directions; history keeps the numbers other documents cite |
| B. Renumber the second 1.0 row to 1.1 and shift the later rows (1.1 to 1.2, 1.2 to 1.3) | Strictly sequential versions; breaks every citation of SDD 1.1 and 1.2 in the LLD, the chunk headers, and the decision log |
| C. Merge the two 1.0 rows into one | One 1.0; hides which of the two states the LLD's "derived from SDD v1.0" read |

**Recommendation.** Option A. The LLD's own record shows the row's numbers are right, so the fix is a state, not a reset; status columns make the unsigned BRDs visible where implementers look; and relabelling, rather than renumbering, keeps every existing citation valid while admitting the missed bump.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied; tracker row DC-11 set to Applied. The LLD master and `lld-refunds-platform/00-metadata.md` were read (not changed) to confirm the LLD's version and SDD basis.

**Files changed for Point 38:**

- `sdd-refunds-platform/00-cover-and-changelog.md` - Source BRDs Status column; Child LLDs State column; second 1.0 row relabelled "1.0 (amended)".
- `sdd-refunds-platform/decision-log.md` - DC-11 record; supersession note on the Child LLDs check.
- `review-comments-tracker.md` - DC-11 Applied; Progress.

---

## Point 39 (DC-12): IDs collide or resolve ambiguously: CL-NN entries live outside the SDD with duplicates, the SDD's OI-NN overlap the BRDs' OI-NN, a UC citation lacks its key, and BR-n and AC-n are numbered only by position

**Skill (chat):**

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| PA-11 | Single-column keys vs the tenant rule | Applied |
| PA-12 | E2E gate overstates readiness | Applied |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Applied |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Applied |
| DC-08 | Card-paid cap vs whole-purchase rule | Applied |
| DC-11 | SDD lineage rows misstate state | Applied |
| **DC-12** | **Colliding and positional IDs** | **Current** |

**Issue.**

- *CL IDs.* CL-NN IDs point into `../sdd-marker-decisions.md`, outside the SDD set (SDD decision-log, Clarification register intro). There, CL-19, CL-21, CL-22, and CL-25 each have a first and a replacement entry, and CL-18 and CL-20 appear only as unapplied first-part entries, so a bare "CL-19" resolves to two texts; each SDD record names the Apply list row it applied, but nothing says that the SDD record is what a CL citation means.
- *OI IDs.* The SDD's own OI-01 to OI-22 carry no key and overlap the BRDs' open items: SDD 10 §14.8 row 1's "(OI-04)" is the SDD tenant fix, while LOYALTY OI-04 is the NFR-01 allowed-times decision; the SDD 01 §5 Glossary "BRD key" rule covers BRD references only.
- *A UC citation without its key.* The SDD 00 Changes Log v1.1 row cites "UC-01 and UC-02 E1" without the LOYALTY key, although REFUNDS also has a UC-01 and a UC-02, against the §5 rule.
- *Positional BR and AC numbers.* In REFUNDS 06a, REFUNDS 06b, and LOYALTY 06a, business rules and acceptance criteria are unlabelled bullets numbered only by position, yet BRD chunks 13 to 16 and the SDD cite them by number (UC-04 BR-4, UC-02 AC-6); LOYALTY OI-03 had to choose its option to keep those positions stable, and any insertion silently renumbers every downstream citation. This review has just added rules and criteria (UC-04 BR-4, UC-02 BR-2 in REFUNDS, the new UC-06).

**Why it matters.** Every traceability link in the chain (page to UC to SDD to BRD to UAT) depends on IDs that resolve to one thing; an ID that resolves to two texts, or shifts when a bullet is inserted, sends implementers and testers to the wrong rule.

| Option | Trade-off |
|---|---|
| A. Make every ID resolve inside the chain: the decision log states that a CL-NN citation in this SDD means the SDD's own record with that ID (which names its Apply list row; for duplicated IDs, the applied entry), and that CL-18 and CL-20 are not cited; unkeyed OI-NN in the SDD means the SDD's chunk 18 item, BRD items always carry their key, and the ambiguous §14.8 citation becomes "SDD OI-04" (rule in chunk 18's ID field and the §5 Glossary); key the v1.1 Changes Log citation (LOYALTY/UC-01, LOYALTY/UC-02 E1); label BR-n and AC-n inline in REFUNDS 06a, 06b, and LOYALTY 06a at their current positions, so the numbers become names | IDs resolve without the decisions file and survive insertions; no existing citation changes meaning, because labels keep today's positions |
| B. Renumber the CL entries into new SDD-unique IDs and key every SDD OI as "SDD/OI-NN" across all chunks | Fully unique IDs; rewrites dozens of citations across the SDD and the LLD for little gain over a stated convention |
| C. Label BR and AC only | Fixes the most fragile IDs; CL and OI citations stay ambiguous |

**Recommendation.** Option A. It removes every ambiguity named by the review while changing no citation's meaning: CL records already carry their Apply list rows, the SDD's chunk 18 items are the only unkeyed OI-NN it should contain, and inline labels freeze today's BR and AC numbers so later insertions append instead of renumbering.

Accept, or adjust?

**User:** Accept A.

**Applied (skill, chat):** Option A applied chain-wide; tracker row DC-12 set to Applied.

**Files changed for Point 39:**

- `brd-refunds-portal/06a-use-cases-customer.md` - BR-n and AC-n labelled inline (UC-01 to UC-03).
- `brd-refunds-portal/06b-use-cases-branch-manager.md` - BR-n and AC-n labelled inline (UC-04, UC-06).
- `brd-loyalty-points/06a-use-cases-member.md` - BR-n and AC-n labelled inline (UC-01, UC-02).
- `brd-refunds-portal/14-todo.md` - Business review row DC-12.
- `brd-loyalty-points/14-todo.md` - Business review row DC-12.
- `brd-loyalty-points/decision-log.md` - DC-12 record.
- `sdd-refunds-platform/decision-log.md` - how CL IDs resolve; decisions file marked as outside the SDD; DC-12 record.
- `sdd-refunds-platform/18-open-items-and-clarifications.md` - ID field: unkeyed OI-NN is the SDD's own.
- `sdd-refunds-platform/01-executive-summary-scope-risks.md` - §5 Glossary BRD key row covers OI, CL, BR, and AC citations.
- `sdd-refunds-platform/10-events-hub.md` - §14.8 row 1 cites SDD OI-04.
- `sdd-refunds-platform/13d-service-loyalty.md` - keyed LOYALTY OI-19 citation.
- `sdd-refunds-platform/00-cover-and-changelog.md` - v1.1 row cites LOYALTY/UC-01 and LOYALTY/UC-02 E1.
- `sdd-refunds-platform/refunds-platform-sdd-master.md` - gate line lists DC-12.
- `review-comments-tracker.md` - DC-12 Applied; targets extended; Progress.

---

## Close of the walkthrough

**Skill (chat):** Every point is closed.

**Tracker:**

| ID | Concern (short) | Status |
|----|-----------------|--------|
| BO-03 | Payout refused for good: no end state | Applied |
| BO-04 | Off-portal refunds keep their points | Applied |
| BO-05 | Dependencies without owners or gates | Applied |
| BO-06 | Unsigned scope; follow-ups untracked | Applied |
| BO-07 | Legal clearances not dependencies | Applied |
| BO-08 | Multi-tenancy without a business case | Applied |
| BO-09 | Loyalty outcome, redemption, earn rate | Applied |
| BO-11 | No customer-care or back-office role | Applied |
| BO-12 | No rollout plan; R-01 unowned | Applied |
| SME-01 | Refund paid without goods returned | Applied |
| SME-02 | Paid refunds not posted to POS or finance | Applied |
| SME-03 | Market unnamed; faulty goods on the 30-day rule | Applied |
| SME-04 | No path for branch-handled refunds | Applied |
| SME-05 | Branch manager decides alone | Applied |
| SME-06 | Card refund mechanics idealized | Applied |
| SME-08 | Store refund policy rules missing | Applied |
| SME-11 | Existing loyalty programme ignored | Applied |
| SME-12 | No loyalty-operations role | Applied |
| PM-04 | Customer account step missing | Applied |
| PM-05 | Objectives not measurable | Applied |
| PM-07 | LOYALTY-REFUNDS dependency one-sided | Applied |
| PM-10 | Branch report has no use case | Applied |
| PM-11 | NFRs not measurable; UAT gaps | Applied |
| PM-12 | Deferred features: no horizon or notice | Applied |
| PA-02 | PAID is acceptance; paid time unclear | Applied |
| PA-03 | Receipt-number join key unsafe | Applied |
| PA-05 | Member sign-in has no contract | Applied |
| PA-06 | Event wire format; RefundPaid unversioned | Applied |
| PA-07 | Ordering and dedup retention unstated | Applied |
| PA-08 | Loyalty extraction plan incomplete | Applied |
| PA-09 | Refund data shown to another member | Applied |
| PA-10 | Receipt number in the URL path | Applied |
| PA-11 | Single-column keys vs the tenant rule | Applied |
| PA-12 | E2E gate overstates readiness | Applied |
| DC-03 | Chunk 18 shows superseded OI-18, OI-19 | Applied |
| DC-04 | Figures 4, 7, ADR-01 contradict CL-09 | Applied |
| DC-08 | Card-paid cap vs whole-purchase rule | Applied |
| DC-11 | SDD lineage rows misstate state | Applied |
| DC-12 | Colliding and positional IDs | Applied |

**Progress:** 39 of 39 decision points resolved: 39 Applied, 0 Pending (60 raw comments, 21 merged into 15 surviving rows).

Major structural decisions this session: 7 (BO-03, BO-04, BO-06, SME-04, PM-10, PA-08, PA-12), listed in the tracker.

All points are Applied, and the tracker has no verification record yet. The next phase is **verify**: a fresh cleared-context agent hunts for stale remnants of these decisions across the BRDs and the SDD (counts, ID lists, section references, superseded phrasing, scope statements), I fix what it confirms and record the pass and score in the tracker, and then the versioning step bumps the versions of every edited document, adds the changelog entries that name this review and its tracker, and presents the close-out summary. Run verify now?

**User:** Not yet.

**Skill (chat):** Understood. The walkthrough stops here; the tracker records every decision, and `business-reviewer-unifier verify` picks up from it.

---
