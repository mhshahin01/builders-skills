# Grill-me session - Refunds Portal BRD v1.1 (REFUNDS)

| | |
|---|---|
| **Date** | 2026-10-10 |
| **Run** | Fixture run FC |
| **BRD** | `run/brd-refunds-portal/` (BRD v1.1), key REFUNDS |
| **Answered by** | Product Owner stand-in (platform helper agent), under the full-autonomous run policy set by Mahmoud on 2026-10-08 ("accept the recommended option") |
| **Skill** | grilling, read from `C:\Users\negat\.claude\skills\grilling\SKILL.md` |
| **Started from** | 14-todo.md § Step 3: the handoff prompt (lines 190-201) and the "Take into the session" list (lines 182-188) |
| **Files edited during the session** | None. The BRD folder was only read. |

## Rules the stand-in followed

1. The stand-in takes only what the BRD itself recommends: an open item's Recommended Answer, or a `proposed` marker's proposal.
2. Facts come only from the BRD folder. A fact the BRD does not hold stays open.
3. Every other question stays open for the product owner. The stand-in answers none of them and supplies no fact.
4. The grilling skill works in rounds. A question whose prerequisite is still open belongs to a later round (SKILL.md line 24).

## Outcome at a glance

| | Count |
|---|---|
| Questions taken into the session | 44: 37 to-do rows (TD-01 to TD-37) and 7 stress-test groups |
| Asked in round 1 (the frontier) | 31 |
| Waiting for round 2: a prerequisite is still open | 12 |
| Not asked: kept for the product owner | 1 (TD-32, brand or key color) |
| Decisions taken | 0 |
| Questions left open | 44 |
| New questions the session raised | 5 (N1 to N5) |

**Session state.** The session is not finished. The grilling skill ends a session only when the frontier is empty (SKILL.md line 28). Here no round 1 question has a recommendation in the BRD, so none settles and round 2 cannot start. The stand-in confirms that the session took place and hands back this list. Step 3 of 14-todo.md cannot be marked Complete from this session.

---

## Design tree

Only prerequisites the BRD states are used:

- TD-31 (store refund policy v3) blocks TD-01, TD-03, TD-09 and TD-15. Source: 14-todo.md line 108, Blocks cell.
- TD-02 (customer identity) blocks TD-23 (UC-04 BR-6). Source: 14-todo.md line 79, Blocks cell, and decision-log.md / Q-21. It also decides where contact details come from (TD-04). Source: decision-log.md / Q-08.
- The stress-test groups hang off the to-do rows that block the same requirement:
  - UC-01 BR-1 hangs off TD-09 and TD-19.
  - UC-04 BR-2 hangs off TD-01.
  - UC-04 E1 hangs off TD-20.
  - NFR-01 hangs off TD-06.
  - NFR-03 hangs off TD-27.
  - Business Objectives 1 and 2 hang off TD-25 and TD-13.

**Round 1 (frontier):** Q2, Q5, Q6, Q7, Q8, Q10 to Q14, Q16 to Q22, Q24 to Q36, Q41.

**Round 2 (waiting):**
- Q1 and Q9: wait on Q31.
- Q3 and Q15: wait on Q31.
- Q4 and Q23: wait on Q2.
- Q37: waits on Q9 and Q19.
- Q38: waits on Q1.
- Q39: waits on Q20.
- Q40: waits on Q6.
- Q42: waits on Q27.
- Q43: waits on Q5, Q13 and Q25.

**Not asked:** Q44 (TD-32).

---

## Round 1

**Q2 - Customer identity (TD-02)**
- **Question:** How does a customer prove who they are: by signing in to a customer account, by a one-time code sent to their email or mobile number, or another way? (03 / Customer identity)
- **Recommended:** None in the BRD. decision-log.md / Q-02 chose Option C because only the owner can pick between A and B. Option A adds a sign-up and sign-in use case.
- **Stand-in:** Left open for the product owner.

**Q5 - Decision time (TD-05)**
- **Question:** Within how many days must a branch manager decide on a Submitted request? (06b / UC-04 BR-5)
- **Recommended:** None in the BRD. Q-20 asks the owner for the value.
- **Stand-in:** Left open.

**Q6 - Payment provider confirmation (TD-06)**
- **Question:** Has CardPay Ltd confirmed that it supports refunds to the original card? (02 / Dependencies, Status cell)
- **Recommended:** None. This is a fact the BRD does not hold.
- **Stand-in:** Left open.

**Q7 - Milestone for card refunds (TD-07)**
- **Question:** Before which milestone must refunds to the original card be in place: the build of UC-04, BAT sign-off, or go-live? (02 / Dependencies, Needed before cell)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q8 - Receipt numbers (TD-08)**
- **Question:** Can the Retail IT team confirm that every branch purchase has a receipt number the customer can enter? (02 / Assumption 1)
- **Recommended:** None. This is a fact the BRD does not hold.
- **Stand-in:** Left open.

**Q10 - Message at a full approval (TD-10)**
- **Question:** Is the customer told when a request is Approved in full, before it is Paid? (03 / Customer messages, Approved in full row)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q11 - Who may view the decision record (TD-11)**
- **Question:** Who, besides the branch manager of the branch, may view the decision record? (03 / Decision record)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q12 - Cover for an absent branch manager (TD-12)**
- **Question:** Who decides on a branch's refund requests when its branch manager is away or the post is vacant? (03 / Branch ownership)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q13 - In-person requests after go-live (TD-13)**
- **Question:** After go-live, do branches still accept refund requests in person, and if so, are those requests recorded in the portal? (04 / Project Scope)
- **Recommended:** None. Q-03 says the evidence does not favour one option.
- **Stand-in:** Left open.

**Q14 - Paper requests open at go-live (TD-14)**
- **Question:** What happens to paper refund requests that are still open on the go-live day? (04 / Project Scope)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q16 - Purchases paid partly by card (TD-16)**
- **Question:** How is a purchase paid partly by card and partly another way refunded: only the card part online, or not online at all? (06a / UC-01 BR-5)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q17 - New request after a rejection (TD-17)**
- **Question:** Can a customer request a refund again for an item whose earlier request was Rejected? (06a / UC-01 BR-6)
- **Recommended:** None. Q-12 leaves it to the owner.
- **Stand-in:** Left open.

**Q18 - The rest of a partly refunded item (TD-18)**
- **Question:** After a partial refund, can the customer request a refund for the rest of the item's amount? (06a / UC-01 BR-7)
- **Recommended:** None. Q-12 leaves it to the owner.
- **Stand-in:** Left open.

**Q19 - Consumer law (TD-19)**
- **Question:** Does any consumer law give customers refund rights that differ from the 30-day refund window? (06a / UC-01 BR-8)
- **Recommended:** None. This is a legal fact the BRD does not hold.
- **Stand-in:** Left open.

**Q20 - How long a failed payout is retried (TD-20)**
- **Question:** How long does the system keep trying a failed payout before it stops? (06b / UC-04 E1, first marker)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q21 - A payout that can never succeed (TD-21)**
- **Question:** How is a customer paid when the payout to their original card can never succeed, for example because the card is closed? (06b / UC-04 E1, second marker)
- **Recommended:** None. Q-19 chose Option C, which asks the owner.
- **Stand-in:** Left open.

**Q22 - The customer's earlier requests (TD-22)**
- **Question:** Must the branch manager also see the customer's earlier refund requests when deciding? (06b / UC-04 BR-4)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q24 - Report format (TD-24)**
- **Question:** In what format does the branch manager get the branch refund report: a screen in the portal, an export file, or both? (09 / Branch refund report, Format)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q25 - Report period (TD-25)**
- **Question:** What period does the daily branch refund report cover: the previous day, the month so far, or another period? (09)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q26 - Data-protection law (TD-26)**
- **Question:** Which data-protection law applies to customer personal data in the portal? (10 / NFR-04)
- **Recommended:** None. This is a legal fact the BRD does not hold.
- **Stand-in:** Left open.

**Q27 - Speed of everyday actions (TD-27)**
- **Question:** Within how many seconds must an everyday action in the portal complete? (10 / NFR-05)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q28 - Keeping refund records (TD-28)**
- **Question:** For how long must refund requests, decisions and payout results be kept? (10 / NFR-06, first marker)
- **Recommended:** None. Q-25 calls this a legal and finance decision.
- **Stand-in:** Left open.

**Q29 - Keeping contact details (TD-29)**
- **Question:** For how long may customer contact details be kept after a refund request ends? (10 / NFR-06, second marker)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q30 - Accessibility standard (TD-30)**
- **Question:** Which accessibility standard and level must the customer screens meet? (11 / Accessibility)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q31 - Attach store refund policy v3 (TD-31)**
- **Question:** Can store refund policy v3 be attached to this BRD? (12 / Appendix)
- **Recommended:** None in the BRD. The policy is not attached, and the answer gates Q1, Q3, Q9 and Q15.
- **Stand-in:** Left open.

**Q32 - Paging and export (TD-33)**
- **Question:** Do the refund request lists need paging or export, and if so which? (11 / Data Tables)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q33 - Filters (TD-34)**
- **Question:** Do the refund request lists need filters, for example by status? If so, which ones? (11 / Filtration)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q34 - Branch manager devices (TD-35)**
- **Question:** On which devices must the branch manager's screens work? (11 / Responsive Design)
- **Recommended:** None in the BRD. Chunk 13, line 316 points to v1.0 evidence: MK-03 breakpoints "Desktop, tablet, mobile". It also says this evidence does not answer the marker.
- **Stand-in:** Left open.

**Q35 - Languages (TD-36)**
- **Question:** Which languages does the portal support? (11 / Language & Locale, first marker)
- **Recommended:** None in the BRD.
- **Stand-in:** Left open.

**Q36 - Currency and formats (TD-37)**
- **Question:** Which currency and which date and number formats does the portal use? (11 / Language & Locale, second marker)
- **Recommended:** None in the BRD. Chunk 13, line 316 points to v1.0 test evidence ("EUR"). It also says this evidence does not answer the marker.
- **Stand-in:** Left open.

**Q41 - Stress test: NFR-02 availability**
- **Question:** "No more than 2 hours of disruption a month". Is 2 hours the right limit? How is it measured? (10 / NFR-02)
- **Recommended:** None. Confirming the figure unchanged is the product owner's call (14-todo.md line 203).
- **Stand-in:** Left open. This question raised N1.

---

## Round 2 (not reached)

These questions wait for a round 1 answer that is still open. Under SKILL.md line 24 they are not asked yet.

**Q1 - Refund amount (TD-01, OI-10)**
- **Question:** How is the refund amount worked out, including discounts? (06a / UC-01 step 4; 06b / UC-04 BR-2)
- **Recommended:** OI-10 Option A (13-open-items-and-clarifications.md line 113): the amount paid for each item after discounts, as the receipt shows. The Recommended Answer adds a new marker for discounts that apply to the whole receipt or to a group of items.
- **Waits on:** Q31.

**Q9 - End of the 30-day window (TD-09, OI-11)**
- **Question:** Where does the 30-day refund window end, and when is it checked? (06a / UC-01 BR-1, E1, AC-2)
- **Recommended:** OI-11 Option A (13-open-items-and-clarifications.md line 127):
  - Count calendar days by the branch's local date.
  - Day 30 is inside the window.
  - The window is checked at submission (step 6).
  - A new marker asks whether the purchase day is day 0 or day 1.
- **Waits on:** Q31.

**Q3 - Return of the items (TD-03)**
- **Question:** Must the customer return the items to the branch before the branch manager approves a refund? (03 / Refund request)
- **Recommended:** None. Q-04 chose to ask the owner.
- **Waits on:** Q31.

**Q15 - Items that can never be refunded (TD-15)**
- **Question:** Which items or item types can never be refunded under store refund policy v3? (06a / UC-01 BR-3)
- **Recommended:** None. The answer is a fact held in policy v3, which is not attached.
- **Waits on:** Q31.

**Q4 - Email and mobile, or one (TD-04)**
- **Question:** Must the customer give both an email address and a mobile number, or is one of them enough? (06a / UC-01 BR-4)
- **Recommended:** None. Q-08: if Q2 picks a customer account, the account holds the contact details.
- **Waits on:** Q2.

**Q23 - Branch manager's own request (TD-23)**
- **Question:** Who decides on a refund request that a branch manager submits for a purchase at their own branch? (06b / UC-04 BR-6)
- **Recommended:** None in the BRD.
- **Waits on:** Q2.

**Q37 - Stress test: the 30-day window and its tests**
- **Question:** UC-01 BR-1 (30 days), AC-1 (10 days) and AC-2 (31 days). Is 30 days right, and is the boundary tested? (06a lines 69, 80, 81)
- **Recommended:** None for the 30-day figure. Q9's Recommended Answer adds the missing day-30 test.
- **Waits on:** Q9 and Q19.

**Q38 - Stress test: the partial refund amount**
- **Question:** UC-04 BR-2 says a partial refund amount is more than 0 and less than the requested amount. Is this rule right? (06b line 68)
- **Recommended:** None in the BRD.
- **Waits on:** Q1. This question raised N2.

**Q39 - Stress test: failed payout after one day**
- **Question:** UC-04 E1 and AC-2 tell the branch manager when a payout still fails after one day. Is one day right? (06b lines 62, 77)
- **Recommended:** None in the BRD.
- **Waits on:** Q20.

**Q40 - Stress test: NFR-01 payout accuracy**
- **Question:** "Zero missing or duplicate payouts per month". Is the measure right, and can it be tested? (10 / NFR-01)
- **Recommended:** None in the BRD.
- **Waits on:** Q6. This question raised N3.

**Q42 - Stress test: NFR-03 seasonal load**
- **Question:** "3 times the normal number of requests for 3 weeks, while still meeting NFR-05". Are these figures right? (10 / NFR-03; 02 / Facts 1 and 2)
- **Recommended:** None in the BRD.
- **Waits on:** Q27.

**Q43 - Stress test: use cases against Business Objectives 1 to 3**
- **Question:** Do UC-01, UC-02 and UC-04 carry Business Objectives 1 to 3? (01 / Business Objectives; the Why sections of UC-01, UC-02 and UC-04)
  - Objective 1 is 10 days down to 3 days on average.
  - Objective 2 is that every request is recorded.
  - Objective 3 is one place to decide for each branch.
- **Recommended:** None in the BRD.
- **Waits on:** Q5, Q13 and Q25. This question raised N4 and N5.

## Not asked

**Q44 - Brand or key color (TD-32)**
- **Question:** What is the brand or key color of the Refunds Portal? (11 / Primary Color)
- **Why not asked:** The handoff prompt (14-todo.md line 196) and the TD-32 row (line 109) keep it for the product owner. It is not asked during a run.

---

## Decision list

There are no decisions. No question asked in round 1 has a Recommended Answer or a `proposed` marker in the BRD.

The BRD has only two Recommended Answers among the items taken in: OI-10 (Q1) and OI-11 (Q9). Both are in round 2 and wait on Q31, for these reasons:
- The BRD records that TD-31 (attach store refund policy v3) blocks TD-01 and TD-09 (14-todo.md line 108).
- Applied decision Q-06 makes the rules in policy v3 the rules the portal follows (decision-log.md line 115). The answers to Q1 and Q9 therefore depend on a fact the BRD does not hold.
- The same run policy left OI-10 and OI-11 open earlier on the same grounds (decision-log.md line 474). Nothing has changed since.

When Q31 is answered, the product owner can accept or adjust OI-10 Option A and OI-11 Option A as they stand in chunk 13.

No `proposed` marker exists in chunks 00-12. Every Owner cell in the to-do register reads "Proposed: Product Team". That proposes an owner, not an answer, so it settles no question.

---

## Questions left open

The "Why open" column uses these reasons:
- **No recommendation:** the BRD gives no recommended option.
- **Missing fact:** the answer is a fact the BRD does not hold.
- **Other:** the reason is given in the cell.

"Waits on" names a prerequisite question that is still open.

| Q | Question | Source item or marker | Why open | Waits on |
|---|----------|-----------------------|----------|----------|
| Q1 | How is the refund amount worked out, including discounts? | TD-01; 13 / OI-10 | Missing fact: store refund policy v3 is not attached, and TD-31 blocks this item. OI-10 Option A is the BRD's recommendation, ready once the fact is known | Q31 |
| Q2 | How does a customer prove who they are? | TD-02; 03 / Customer identity marker | No recommendation | - |
| Q3 | Must the items be returned before approval? | TD-03; 03 / Refund request marker | No recommendation; policy v3 may settle it (missing fact) | Q31 |
| Q4 | Both email and mobile number, or one? | TD-04; 06a / UC-01 BR-4 marker | No recommendation | Q2 |
| Q5 | Decision time in days | TD-05; 06b / UC-04 BR-5 marker | No recommendation | - |
| Q6 | Has CardPay Ltd confirmed refunds to the original card? | TD-06; 02 / Dependencies, Status marker | Missing fact | - |
| Q7 | Milestone for card refunds | TD-07; 02 / Dependencies, Needed before marker | No recommendation | - |
| Q8 | Does every branch purchase have a receipt number? | TD-08; 02 / Assumption 1 | Missing fact (Retail IT confirmation) | - |
| Q9 | End of the 30-day window and when it is checked | TD-09; 13 / OI-11 | Missing fact: policy v3 is not attached, and TD-31 blocks this item. OI-11 Option A is the BRD's recommendation, ready once the fact is known | Q31 |
| Q10 | Is the customer told at a full approval? | TD-10; 03 / Customer messages, Approved in full marker | No recommendation | - |
| Q11 | Who else may view the decision record? | TD-11; 03 / Decision record marker | No recommendation | - |
| Q12 | Who decides when the branch manager is away? | TD-12; 03 / Branch ownership marker | No recommendation | - |
| Q13 | In-person requests after go-live | TD-13; 04 / Project Scope, first marker | No recommendation | - |
| Q14 | Paper requests open on the go-live day | TD-14; 04 / Project Scope, second marker | No recommendation | - |
| Q15 | Items that can never be refunded | TD-15; 06a / UC-01 BR-3 marker | Missing fact (content of policy v3) | Q31 |
| Q16 | Purchases paid partly by card | TD-16; 06a / UC-01 BR-5 marker | No recommendation | - |
| Q17 | New request after a rejection | TD-17; 06a / UC-01 BR-6 marker | No recommendation | - |
| Q18 | The rest of a partly refunded item | TD-18; 06a / UC-01 BR-7 marker | No recommendation | - |
| Q19 | Consumer refund rights that differ from 30 days | TD-19; 06a / UC-01 BR-8 marker | Missing fact (legal) | - |
| Q20 | How long a failed payout is retried | TD-20; 06b / UC-04 E1, first marker | No recommendation | - |
| Q21 | Paying a customer when the card payout can never succeed | TD-21; 06b / UC-04 E1, second marker | No recommendation | - |
| Q22 | Does the branch manager see the customer's earlier requests? | TD-22; 06b / UC-04 BR-4 marker | No recommendation | - |
| Q23 | Who decides on a branch manager's own request? | TD-23; 06b / UC-04 BR-6 marker | No recommendation | Q2 |
| Q24 | Branch refund report format | TD-24; 09 / Format marker | No recommendation | - |
| Q25 | Branch refund report period | TD-25; 09 / period marker | No recommendation | - |
| Q26 | Applicable data-protection law | TD-26; 10 / NFR-04 marker | Missing fact (legal) | - |
| Q27 | Seconds allowed for an everyday action | TD-27; 10 / NFR-05 marker | No recommendation | - |
| Q28 | How long refund records are kept | TD-28; 10 / NFR-06, first marker | No recommendation (legal and finance decision, Q-25) | - |
| Q29 | How long contact details are kept | TD-29; 10 / NFR-06, second marker | No recommendation | - |
| Q30 | Accessibility standard and level | TD-30; 11 / Accessibility marker | No recommendation | - |
| Q31 | Can store refund policy v3 be attached? | TD-31; 12 / Appendix marker | No recommendation (the policy itself is the missing fact) | - |
| Q32 | Paging or export on the request lists | TD-33; 11 / Data Tables marker | No recommendation | - |
| Q33 | Filters on the request lists | TD-34; 11 / Filtration marker | No recommendation | - |
| Q34 | Branch manager devices | TD-35; 11 / Responsive Design marker | No recommendation (v1.0 evidence noted at 13 line 316 does not answer it) | - |
| Q35 | Languages | TD-36; 11 / Language & Locale, first marker | No recommendation | - |
| Q36 | Currency, date and number formats | TD-37; 11 / Language & Locale, second marker | No recommendation (v1.0 evidence noted at 13 line 316 does not answer it) | - |
| Q37 | Stress test: UC-01 BR-1, AC-1, AC-2 | Stress-test list (14-todo.md lines 188, 198) | No recommendation for the 30-day figure | Q9, Q19 |
| Q38 | Stress test: UC-04 BR-2 | Stress-test list | No recommendation | Q1 |
| Q39 | Stress test: UC-04 E1 and AC-2 (one day) | Stress-test list | No recommendation | Q20 |
| Q40 | Stress test: NFR-01 | Stress-test list | No recommendation | Q6 |
| Q41 | Stress test: NFR-02 (2 hours a month) | Stress-test list | No recommendation | - |
| Q42 | Stress test: NFR-03 (3 times for 3 weeks) | Stress-test list | No recommendation | Q27 |
| Q43 | Stress test: UC-01, UC-02, UC-04 against Business Objectives 1 to 3 | Stress-test list (table row only, 14-todo.md line 188) | No recommendation | Q5, Q13, Q25 |
| Q44 | Brand or key color | TD-32; 11 / Primary Color marker | Other: kept for the product owner and not asked during a run (14-todo.md lines 109, 196) | - |

---

## New questions the session raised

None of these is answered. Under 13-open-items-and-clarifications.md line 12, each one becomes an open item "(raised by the grill-me session of 2026-10-10, Nn)" if it needs a business choice. A missing fact stays a to-do item only.

| ID | Raised by | Question | Basis in the BRD | Why open |
|----|-----------|----------|------------------|----------|
| N1 | Q41 (NFR-02) | Does planned maintenance count toward the 2 hours of disruption a month? | 13 / Reviewer Notes, Coverage record, NFRs row (line 293): "NFR-02 does not say whether planned maintenance counts toward the 2 hours". It was left as a note and is not in the to-do register. | No recommendation |
| N2 | Q38 (UC-04 BR-2) | When a branch manager approves part of a request that has several items, is the lower amount set per item or on the request total? And how is it decided whether an item is "refunded in full" (UC-01 BR-2) or partly refunded (UC-01 BR-7)? | UC-04 step 4 shows each item with its amount. UC-04 A1 lowers "the amount". UC-01 BR-2 and BR-7 work per item. | No recommendation; tied to Q18 |
| N3 | Q40 (NFR-01) | Under NFR-01's monthly measure, does a payout still being retried at the end of a month count as missing? | NFR-01 "per month"; UC-04 E1 retries with no end date yet (Q20) | No recommendation; waits on Q20 |
| N4 | Q43 (Objective 2) | Do customer care agents get a view of a customer's refund requests? | 13 / Scope proposal 1 (line 308). It is not in the to-do register. Its recommendation is only "the owner decides". | No recommendation |
| N5 | Q43 (Objective 1) | Is a portal-wide refund report needed to track Business Objectives 1 and 2 across the 40 branches? | 13 / Scope proposal 2 (line 309). It is not in the to-do register. Its recommendation is only "adopt only if the owner wants". 09 serves only the branch manager. | No recommendation |

---

## Where the skill or the handoff prompt was unclear or could not be followed

1. **SKILL.md lines 8, 26, 28.** The skill expects the user to answer each round and to confirm a shared understanding. With no person available, the stand-in can take only BRD recommendations. Round 1 had none, so the frontier never moved and the session cannot reach the "frontier is empty" end state.
2. **SKILL.md line 26.** The skill sends a sub-agent to find facts in the environment. Here, facts could come only from the BRD folder. The stand-in looked there directly, and the facts the BRD does not hold (Q6, Q8, Q15, Q19, Q26, policy v3 for Q1 and Q9) stay open.
3. **SKILL.md lines 10-22.** The round format uses emoji markers. They were replaced by text labels because the platform instructions forbid emojis. The structure is unchanged: numbered question, recommended answer, separator.
4. **14-todo.md lines 190 and 193.** The prompt starts with `/grill-me`, which is only a pointer. The session ran from grilling/SKILL.md, read from disk as instructed. Its path `./brd-refunds-portal/` is relative and was resolved to `run/brd-refunds-portal/`.
5. **14-todo.md line 188 against line 198.** The "Take into the session" table lists "UC-01, UC-02 and UC-04, which carry Business Objectives 1 to 3" as a stress test. The handoff prompt's step 3 leaves it out. The stand-in took both lists together (Q43).
6. **14-todo.md line 186 against line 196.** The table puts TD-32 in the session list, while the prompt says TD-32 "is for the product owner". It was taken in but not asked (Q44).
7. **14-todo.md line 186.** The heading says "Open questions and pending decisions", but the only pending decision, TD-40 (line 115, Decided - pending application), is not listed. It was not taken in. It is already decided, and the next request applies it.
8. **14-todo.md line 52.** The to-do's Next action runs /grill-me only after TD-40 is applied and the P1 and P2 rows are decided. This session ran with all of them still open, as the run asked. That ordering is why no round 1 question could settle.
9. **14-todo.md lines 199-200.** The prompt asks for the chunk and section each confirmed decision changes, and a numbered decision list. No decision was taken, so the list is empty.
10. **Recommended Answers of OI-10 and OI-11** (13 lines 113, 127). The run allows taking them, but the BRD makes them wait on TD-31 and policy v3 (14-todo.md line 108; decision-log.md lines 115, 474). The stand-in left them open. This is a judgment call: if the product owner rules that policy v3 does not govern these two rules, both Recommended Answers can be taken as written.
11. **Owner cells "Proposed: Product Team"** (14-todo.md lines 78-117). These are the only "proposed" text in the register. They propose an owner, not an answer. They were not treated as `proposed` markers.
12. **decision-log.md line 474** cites "SKILL.md step 8, Answer policy, rule 3" of the brd-unifier skill. That file is outside the allowed reading scope and was not read.
13. **Instructions loaded by the runtime.** These add no questions and were not used to answer any:
    - The user-level CLAUDE.md has defaults that touch Q30, Q32, Q35, Q36 and Q44.
    - Reading 14-todo.md also triggered a hook that showed `run/AGENTS.md`. Its rule on the brand color matches the BRD's TD-32 handling.
