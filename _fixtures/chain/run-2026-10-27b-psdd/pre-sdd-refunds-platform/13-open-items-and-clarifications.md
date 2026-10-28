<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: all preceding Pre-SDD chunks (00 through 12)
PART OF: Pre-SDD - Refunds Platform
PURPOSE: Output of the cleared-context reviewer pass (review-and-open-items.md). Captures the gaps, unsourced or guessed values, fragment mismatches, product names, open hard items, conflicts, lock-list gaps, and ID errors an independent reviewer finds. Every item carries a concrete Recommended Answer, ready to apply once a person accepts it.
GENERATED_BY: pre-sdd-unifier reviewer (a cleared-context subagent run after the write-up, before the G3 stop). Written in full mode only; a quick Pre-SDD has no review and no chunk 13.
WORKFLOW: After this chunk is written, the skill walks the user through each Open item: accept the recommendation, choose another option, defer, or give an own answer (an answer policy the user set for the run accepts the recommendations it may). An accepted answer that changes a value goes into the project state through `derive --apply` and a new `compute`, never into a fragment by hand; the item gets its Resolution Log row, and the decision story goes to decision-log.md § Clarification register.
-->

# 13. Open Items & Clarifications

> **What this section is.** A backlog of findings a reviewer with cleared context raised after the Pre-SDD was written. Each comes with a **Recommended Answer**, a concrete resolution ready to apply. Items are decisions awaiting a person's acceptance.
>
> **What this section is not.** It is not a list of the inline `[NEEDS CLARIFICATION: ...]` markers or the unknowns (`QD-NN`, chunk 10): those stay where they are. It is not the engine's validation (chunk 10) either; a finding here may point at one, for example a conflict the prose smooths over.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions, never renumbered or reused. |
| **Where** | Chunk and section (for example `03c § 3.3`, `05 § 5.3`), or "global". |
| **Type** | Missing source / Guessed value / Fragment mismatch / Product named / Open hard item / Conflict / Lock-list gap / ID error / Dash character / Ambiguity / Risk / Duplication (BRD content restated instead of cited). |
| **Concern** | One paragraph: what is wrong and why it matters for the G3 sign-off or the SDD. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The proposed resolution, ready to apply: the project-state change (the entry and its new value, status, or source) or the exact text for the chunk. A finding that needs no change reads `No change: <evidence>`. Applicable: a value or label change names the op and who may run it (a Confirmed or person-answered value changes only by a person); a change no op can make is recommended as ops that can, for example "close QD-NN and add a new unknown with the corrected owner or due date". |
| **Why** | REQUIRED. One or two lines: the evidence behind the recommendation and the tradeoff it accepts. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Decided - pending application / Decided - waiting for a person / Accepted - applied / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`. |

Write the Status field as the literal legend value, for example `- **Status:** Accepted - applied`. Put the update link on a separate `- **Resolution:**` line.

---

## Open Items

### OI-01: The register guide points to chunk 08 and OVL rows this Pre-SDD does not have

- **Where:** 03a § How to Read the Register (last paragraph before § 3.1)
- **Type:** Ambiguity
- **Concern:** The paragraph says "the migration overlay rows `OVL-01` to `OVL-12` in chunk 08". This Pre-SDD is greenfield with no migration overlay (HDR-07.1, HDR-10.1, chunk 02 § 2.4, the 02-classification fragment: "Migration overlay: does not apply"), and the chunk set correctly omits chunk 08. A reader, or the SDD following a `PSDD/OVL-..` habit, is sent to a chunk and rows that do not exist.
- **Options:**
  - **A.** Replace the sentence so it states that no overlay applies - the guide matches the chunk set; a small text edit outside any fragment.
  - **B.** Keep the template sentence - no edit, but the register guide keeps naming a chunk the master and chunk 00 do not list.
- **Recommended Answer:** Option A. In 03a, replace "The header rows `HDR-01` to `HDR-10` are in chunk 01, and the migration overlay rows `OVL-01` to `OVL-12` in chunk 08." with "The header rows `HDR-01` to `HDR-10` are in chunk 01. No migration overlay applies (chunk 02 § 2.4), so this Pre-SDD has no `OVL` rows and no chunk 08." Prose only; no project-state op.
- **Why:** The master index and chunk 00 list no chunk 08, and 12 § 12.4 already says "No migration overlay applies"; the edit removes the one dangling pointer at no cost.
- **Status:** Accepted - applied
- **Resolution:** 03a § How to Read the Register states that no migration overlay applies. See the [Resolution Log](#resolution-log).

### OI-02: The default source "project rule CAP-08" and "project rule OPS-04" reads as a project rule that does not exist

- **Where:** 03b § 3.2 CAP-08.1; 03g § 3.7 OPS-04.1
- **Type:** Ambiguity
- **Concern:** CAP-08.1 and OPS-04.1 cite `Default: project rule CAP-08` and `Default: project rule OPS-04`. The project's rules (AGENTS.md) hold two rules only (third-party approval, brand colour), and elsewhere this Pre-SDD uses "project rule" for those (09 § 9.4 ADR-PLATFORM-001, 12 § 12.4). The label also names a rule by an item ID, which the rule-ID convention avoids (LOAD-04, DB-READ-17). The project state shows the real origin: both were set by `pre-sdd-engine` at `new` with the reason "Decision 11: project default", then confirmed by the policy.
- **Options:**
  - **A.** No change in the Pre-SDD; report the label to the skill owner so the engine's default text names its origin without "project rule" and without an item ID - keeps both Confirmed entries untouched.
  - **B.** The agent runs `set` on CAP-08.1 and OPS-04.1 with a clearer `source` (type `default`), and the policy runs `confirm` again - clearer now, but reopens two Confirmed entries for a wording issue.
- **Recommended Answer:** Option A. No change: the source is a valid engine default under the 03a Source form `Default: <appendix or rule>` (project-state history: actor `pre-sdd-engine`, op `set`, reason "Decision 11: project default", 2026-10-27T18:23:51.778Z for both). Report the label to the skill owner as an engine wording fix.
- **Why:** The value has a traceable source in the state history, so check 1 holds; only the label misleads, and fixing it at the engine avoids reopening two Confirmed entries.
- **Status:** Rejected
- **Resolution:** No change, as the Recommended Answer reads; the default source wording is an engine matter for the skill owner. Decider: Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27. See the [Resolution Log](#resolution-log).

### OI-03: The seasonal peak factor's source covers refund requests, but the calculations apply it to points movements

- **Where:** 03b § 3.2 CAP-04.1; 04 § 4.2 CALC-02 to CALC-09, § 4.3 Capacity
- **Type:** Risk
- **Concern:** CAP-04.1 (3 ×, 3 weeks of seasonal sales) cites REFUNDS/NFR-03 and REFUNDS 02 Fact 2, which say refund requests triple. The calculations size only the points movements of CAP-01.1 (advisory PRIMARY-ONLY-CAP-01) and apply CAP-04.1 to them in CALC-02 to CALC-09. No source states how branch purchases, and so points movements, change in the seasonal sales; LOYALTY states no seasonal figure. The peak load the SDD's §18 cites as `PSDD/CALC-02` and `PSDD/CALC-03` therefore rests on a factor borrowed from another transaction type.
- **Options:**
  - **A.** Add an unknown on CAP-04.1 asking whether points movements rise by the same factor - keeps CAP-04.1 as it is and makes the open scope visible to the SDD; one more open question.
  - **B.** No change - the load is tiny (CALC-04 well under 1 req/s), so a different factor would not change the shape; but G3-04 asks for measurable capacity per critical journey, and BUS-02.4 is one.
- **Recommended Answer:** Option A. A person or the fixture owner runs `add-unknown` with entry `CAP-04.1`, question "Do branch purchases, and so the points movements of CAP-01.1, rise in the seasonal sales by the same factor as refund requests (CAP-04.1, REFUNDS/NFR-03), or by another factor?", impact "Confirms or replaces the peak factor that CALC-02 to CALC-09 apply to the points movements.", owner "Refunds and Loyalty Product Owner", due "2026-11-30" (the owner and due date the fixture owner already gave the open capacity entries CAP-05.1 and CAP-10.1). Then `compute` and paste the new 10-validation and 12-locked-items fragments.
- **Why:** The BRD scope of REFUNDS/NFR-03 is refund requests only, while CALC-01 to CALC-09 read CAP-01.1; an unknown records the gap without changing any Confirmed value.
- **Status:** Adjusted - applied
- **Resolution:** QD-06 on CAP-04.1 (owner Refunds and Loyalty Product Owner, due 2026-11-20, the due date the fixture owner gives every unknown, in place of the recommended 2026-11-30), added by Fixture: Product Owner stand-in (test-run policy); 10 § 10.1 and 12 § 12.5 carry it. See the [Resolution Log](#resolution-log).

### OI-04: SEC-02.1 cites NFR-04 without its BRD key

- **Where:** 03e § 3.5 SEC-02.1 (and the same value in 12 § 12.2)
- **Type:** ID error
- **Concern:** SEC-02.1 reads "(REFUNDS 03, NFR-04)". Every BRD reference must carry its key (`REFUNDS/NFR-04`); with two source BRDs that both have an NFR-04 (REFUNDS/NFR-04 Security & Privacy, LOYALTY/NFR-04 Availability), the bare ID is ambiguous to the SDD that cites it.
- **Options:**
  - **A.** A person runs `set` on SEC-02.1 with the keyed reference and `confirm` - fixes the source value and both fragments at once.
  - **B.** Leave it - the preceding "REFUNDS 03" hints at the key, but the ID stays ambiguous between the two BRDs.
- **Recommended Answer:** Option A. SEC-02.1 is Confirmed, so a person (or the fixture owner in this test run) runs `set` with entry `SEC-02.1` and value "Customers act only on their own refund requests after proving who they are (method open, REFUNDS 03 Customer identity); branch managers act only on their own branch's requests (REFUNDS 03, 07); staff who record a payout result by hand and the second staff member who confirms it (REFUNDS 03, REFUNDS/NFR-04); members see only their own points after signing in (sign-in party open, LOYALTY UC-01; LOYALTY/NFR-05). External parties: CardPay Ltd, MsgHub, Point-of-Sale Records (REFUNDS 08, LOYALTY 08).", then `confirm` on `SEC-02.1`. Then `compute` and paste the new 03e-register-security and 12-locked-items fragments.
- **Why:** The only change is "NFR-04" to "REFUNDS/NFR-04" (REFUNDS 10 NFR-04 is the staff-visibility rule the sentence describes); the row's source already reads "BRD: REFUNDS/NFR-04".
- **Status:** Decided - waiting for a person
- **Resolution:** Decision: accept the recommendation, by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27. SEC-02.1 is Confirmed, so only a person changes it: a person runs `set` on SEC-02.1 with the keyed text, then `confirm`, then `compute`. Not applied. See the [Resolution Log](#resolution-log).

### OI-05: INT-03.1 has no label while its sibling entries name their partner

- **Where:** 03f § 3.6 INT-03.1 (and 12 § 12.2, 10 § 10.1 QD-04)
- **Type:** Ambiguity
- **Concern:** INT-03.2 and INT-03.3 carry the labels "Point-of-Sale Records (Retail IT team)" and "Notification Partner (MsgHub)", but the primary entry INT-03.1 reads Label `TBD`. Only its owner cell, "B+E (CardPay Ltd)", hints at the partner. QD-04 and R-03 point at INT-03.1, and the SDD's §8.3 and §18 size within the partner quotas per entry, so the entry should say which partner it answers.
- **Options:**
  - **A.** The agent runs `set` on INT-03.1 with the label, citing REFUNDS 08 - the entry stays Open with its owner and due date; one fragment change.
  - **B.** Leave the label blank - the owner cell implies the partner, but the register's own rule is that a repeating row's entries carry labels.
- **Recommended Answer:** Option A. The agent (`pre-sdd-unifier`) runs `set` with entry `INT-03.1`, label "Payment Provider (CardPay Ltd)", source `{ "type": "brd", "text": "BRD: REFUNDS 08" }`; the value, status (Open), owner and due date stay as they are. Then `compute` and paste the new 03f-register-integration fragment.
- **Why:** INT-01.1 already labels the same partner "Payment Provider (CardPay Ltd)" from REFUNDS 08; INT-03.1 is Open, not Confirmed, so the agent may set its label.
- **Status:** Decided - waiting for a person
- **Resolution:** Decision: accept the recommendation, by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27. INT-03 is a fact row and the engine refuses any write on it by the policy; a person runs `set` with the label on INT-03.1. Not applied. See the [Resolution Log](#resolution-log).

### OI-06: The targets table calls daily volumes "Peak transactions"

- **Where:** 04 § 4.1 Targets (rows CAP-01.1 and CAP-01.2)
- **Type:** Ambiguity
- **Concern:** § 4.1 labels CAP-01.1 (2,000 transactions/day) and CAP-01.2 (40 transactions/day) as "Peak transactions". The fragment treats CAP-01.1 as the daily volume: CALC-01 divides it by 86400 to get the average, and CALC-02 multiplies that average by the peak factor CAP-04.1. The prose label contradicts the calculation it sits above, and an SDD reading § 4.1 could size for 3 times too little.
- **Options:**
  - **A.** Relabel both rows as daily transactions - matches the unit and CALC-01; text edit outside the fragment.
  - **B.** Keep "Peak" - no edit, but the table disagrees with CALC-01 and CALC-02.
- **Recommended Answer:** Option A. In 04 § 4.1, replace "| Peak transactions, points movement | CAP-01.1 |" with "| Daily transactions, points movement | CAP-01.1 |" and "| Peak transactions, refund request | CAP-01.2 |" with "| Daily transactions, refund request | CAP-01.2 |". Prose only; no project-state op.
- **Why:** The unit is transactions/day and CALC-01 is "Average business TPS = daily_transactions / 86400"; the peak is CALC-02, already in § 4.2.
- **Status:** Accepted - applied
- **Resolution:** 04 § 4.1 labels CAP-01.1 and CAP-01.2 as daily transactions. See the [Resolution Log](#resolution-log).

### OI-07: A region recovery at REL-03.1 breaks the REFUNDS/NFR-02 limit, held only as a risk with no decision date

- **Where:** 05 § 5.3; 04 § 4.3; 10 § 10.2 R-01; 03c REL-02.1
- **Type:** Conflict
- **Concern:** REL-03.1 (14,400 s, Confirmed by the fixture owner) lets one region recovery take 4 hours, while REFUNDS/NFR-02 allows "no more than 2 hours of disruption a month" with no exclusion for disasters, and REL-01.1 gives a 30-day budget of CALC-13. Rule SLO-15@region reports it as "not inherently contradictory", and 05 § 5.3 calls it "the one tension". Against the BRD measure it is a conflict that stands until the business decides whether a declared region disaster counts. R-01 holds that decision but has no due date and does not link REL-02.1, the Open entry (owner Refunds and Loyalty Product Owner, due 2026-11-30) whose row asks exactly "what failures/exclusions count".
- **Options:**
  - **A.** Add an unknown on REL-02.1 for the exclusion decision, link it and REL-02.1 from R-01, and state the conflict plainly in 05 § 5.3 - the decision gets an owner and date; three small changes.
  - **B.** Keep R-01 as the only record - no change, but the G3 signers see a "tension" with no date to close it, and the SDD's §18.5 inherits two figures that disagree.
- **Recommended Answer:** Option A. (1) A person or the fixture owner runs `add-unknown` with entry `REL-02.1`, question "Does a declared region disaster count toward the REFUNDS/NFR-02 limit of 2 hours of disruption a month and toward the REL-01.1 availability target?", impact "Decides whether REL-03.1 conflicts with REFUNDS/NFR-02 and REL-01.1 (R-01), or whether a region loss is an exclusion of REL-02.1.", owner "Refunds and Loyalty Product Owner", due "2026-11-30" (REL-02.1's own owner and due date); then `compute` and paste the new 10-validation and 12-locked-items fragments. (2) In 10 § 10.2 R-01, add "REL-02.1" and the new unknown's ID to Linked IDs. (3) In 05 § 5.3, replace "The one tension is that a region recovery at REL-03.1 can exceed the monthly availability budget (rule SLO-15@region, risk R-01)." with "A region recovery at REL-03.1 exceeds the 30-day budget of REL-01.1 (CALC-13) and the REFUNDS/NFR-02 monthly limit unless a declared region disaster is excluded; that exclusion is open (REL-02.1, rule SLO-15@region, risk R-01)."
- **Why:** CALC-13 and REFUNDS/NFR-02 are both below 14,400 s, so the figures conflict today; the fix gives the decision an owner and date already on record for REL-02.1 and changes no Confirmed value.
- **Status:** Adjusted - applied
- **Resolution:** QD-07 on REL-02.1 (owner Refunds and Loyalty Product Owner, due 2026-11-20, the due date the fixture owner gives every unknown, in place of the recommended 2026-11-30), added by Fixture: Product Owner stand-in (test-run policy); R-01 links REL-02.1 and QD-07; 05 § 5.3 states the open exclusion. See the [Resolution Log](#resolution-log).

### OI-08: Option costs and scores show who confirmed them but not when

- **Where:** 07 § 7.1 (Scores and costs table, fragment 07-options)
- **Type:** Missing source
- **Concern:** The 20 cost and score rows read Status `Confirmed` with By "Fixture: Product Owner stand-in (test-run policy)" but no date and time; only the weights line carries one ("at 2026-10-27T18:40:04.027Z"). Every Confirmed value needs who and when in the Pre-SDD. The project state does hold the time (`options.list[].one_time.at`, `monthly.at`, `scores.*.at` = 2026-10-27T18:40:04.027Z for all 20), so the gap is in the fragment's columns, not in the record.
- **Options:**
  - **A.** No change in the chunk; report to the skill owner that the 07-options fragment omits an At column - the record is complete in the state and the chunk keeps the engine's fragment unchanged.
  - **B.** Add a prose line in 7.2 giving the confirmation time - visible now, but writes a value no fragment holds and duplicates the record by hand.
- **Recommended Answer:** Option A. No change: the confirmation time of every cost and score is in the project state (`options.list[*]` `at` = 2026-10-27T18:40:04.027Z, actor Fixture: Product Owner stand-in (test-run policy)); no op changes the fragment's columns, so report the missing At column to the skill owner as an engine fix.
- **Why:** Fragments are pasted unchanged and chunk prose must not carry values the fragments do not hold; the who and when exist in the state of record.
- **Status:** Rejected
- **Resolution:** No change, as the Recommended Answer reads; the missing At column of the options fragment is an engine matter for the skill owner. Decider: Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27. See the [Resolution Log](#resolution-log).

### OI-09: DT-15 says the risks "are accepted through G3-11" while G3-11 is Open

- **Where:** 09 § 9.2 DT-15
- **Type:** Ambiguity
- **Concern:** The DT-15 outcome reads "the risks of chunk 10 § 10.2 are accepted through G3-11". G3-11 is Open (11 § 11.1), no one has signed, and R-01 to R-04 are High impact. The present tense reads as if the high risks were already formally accepted, which smooths over the open gate line the signers must still tick.
- **Options:**
  - **A.** Reword the outcome to say the high risks still need acceptance at G3-11 - accurate gate state; text edit outside the fragment.
  - **B.** Keep the wording - shorter, but a signer reading chunk 09 alone may take G3-11 as done.
- **Recommended Answer:** Option A. In 09 § 9.2, replace the DT-15 outcome "Not triggered: no DT-15-BLOCK finding; the open hard entry SEC-01.1 passes under EXC-01, and the risks of chunk 10 § 10.2 are accepted through G3-11" with "Not triggered: no DT-15-BLOCK finding; the open hard entry SEC-01.1 passes under EXC-01. The high-impact risks R-01 to R-04 of chunk 10 § 10.2 are not yet accepted: G3-11 (Open) asks an empowered owner to accept or close them at the sign-off". Prose only; no project-state op.
- **Why:** The 11-gate fragment lists "G3-11 is Open" among the G3 problems; the edit keeps the decision tree in step with the gate.
- **Status:** Accepted - applied
- **Resolution:** 09 § 9.2 DT-15 says the high-impact risks still need acceptance at G3-11. See the [Resolution Log](#resolution-log).

### OI-10: CAP-07.2 rests on a policy-accepted proposal with no unknown to confirm it

- **Where:** 03b § 3.2 CAP-07.2; 10 § 10.1 Unknowns, § 10.2 R-06
- **Type:** Risk
- **Concern:** CAP-07.2 (2,000 ms for the member points screens) was proposed by the skill and accepted by the policy; LOYALTY 10 states no performance measure, so no source states the value. QD-01 tracks REL-01.2 and QD-02 tracks CAP-07.1, but nothing tracks CAP-07.2. R-06 names CAP-07.2 and gives the mitigation "Answer QD-01 and QD-02", which does not reach it, so the value would be locked for the SDD without anyone asked to confirm or replace it.
- **Options:**
  - **A.** Add an unknown on CAP-07.2 mirroring QD-01 and QD-02, and name it in R-06 - the value stays Confirmed and gets an owner and date; one unknown more.
  - **B.** Leave it to R-06 - no change, but the mitigation names no question for CAP-07.2.
- **Recommended Answer:** Option A. A person or the fixture owner runs `add-unknown` with entry `CAP-07.2`, question "Within how many milliseconds must the member points balance and history screens respond (LOYALTY 10 states no performance measure)?", impact "Confirms or replaces the policy-accepted 2000 ms latency target for the member points journey.", owner "Refunds and Loyalty Product Owner", due "2026-11-20" (the owner and due date of QD-01, the unknown on the same journey); then `compute` and paste the new 10-validation and 12-locked-items fragments. In 10 § 10.2 R-06, add the new unknown's ID to the Mitigation and to Linked IDs.
- **Why:** The decision log records CAP-07.2 as "no source states this value"; QD-01 and QD-02 set the pattern for the other two policy-accepted targets, and the owner and due date are the ones already given for that journey.
- **Status:** Accepted - applied
- **Resolution:** QD-08 on CAP-07.2 (Refunds and Loyalty Product Owner, 2026-11-20), added by Fixture: Product Owner stand-in (test-run policy); R-06 names QD-08. See the [Resolution Log](#resolution-log).

### OI-11: R-06 cites HR-001 and HR-002, which no Pre-SDD file defines

- **Where:** 10 § 10.2 R-06 (Mitigation)
- **Type:** ID error
- **Concern:** The mitigation reads "Answer QD-01 and QD-02 through the BRD owners (HR-001, HR-002)". No chunk, the master, the decision log, or the project state defines an `HR-NN` ID or links to where one lives, so a signer or the SDD cannot resolve them. They may be handoff requests on the status board, which this review could not read.
- **Options:**
  - **A.** Drop the two IDs - the sentence stays true and resolvable inside the Pre-SDD; loses a pointer that may exist on the board.
  - **B.** Keep them and say where they live ("handoff requests HR-001 and HR-002 on unifier-status.md") - keeps the pointer, but only if the writer confirms both exist there.
- **Recommended Answer:** Option A. In 10 § 10.2 R-06, replace "Answer QD-01 and QD-02 through the BRD owners (HR-001, HR-002)" with "Answer QD-01 and QD-02 through the BRD owners" (if OI-10 is accepted, its new unknown joins that list). Prose only; no project-state op.
- **Why:** IDs must exist where cited; the unknowns QD-01 and QD-02 already carry the owner and due date, so dropping the unresolved IDs loses nothing a reader of the Pre-SDD can use.
- **Status:** Accepted - applied
- **Resolution:** 10 § 10.2 R-06 no longer cites HR-001 and HR-002. See the [Resolution Log](#resolution-log).

### OI-12: Chunk 11 § 11.2 mentions "the condition" though no condition exists

- **Where:** 11 § 11.2
- **Type:** Ambiguity
- **Concern:** § 11.2 reads "The G3 checklist, the condition and the sign-offs are still to come." The 11-gate fragment shows "Conditions: None", and 12 § 12.5 says the same. A signer may look for a condition that was never recorded.
- **Options:**
  - **A.** Reword to match the fragment - accurate; text edit outside the fragment.
  - **B.** Keep it - no edit, but the line disagrees with the gate fragment above it.
- **Recommended Answer:** Option A. In 11 § 11.2, replace "The G3 checklist, the condition and the sign-offs are still to come." with "The G3 checklist and the sign-offs are still to come; no condition is recorded." Prose only; no project-state op.
- **Why:** The fragment's Conditions block reads "None"; the edit removes the only contradiction in the chunk.
- **Status:** Accepted - applied
- **Resolution:** 11 § 11.2 says no condition is recorded. See the [Resolution Log](#resolution-log).

### OI-13: The lock list leaves out the hard entries BUS-07.1 and BUS-08.1

- **Where:** 12 § 12.2 Locked Items (fragment 12-locked-items)
- **Type:** Lock-list gap
- **Concern:** Every other `hard` entry is locked (DAT-03.1, DAT-04.1, DAT-06.1, SEC-01.1, SEC-04.1), but BUS-07.1 (payouts go only to the card used for the purchase; the non-goals of both BRDs) and BUS-08.1 (payouts follow the refund terms agreed with CardPay Ltd) are not in § 12.2 and land in no SDD place; the landing table holds no BUS row. The SDD reads chunk 12, the master's gate line and chunk 11 only, so it never meets these two guardrails, although 07 § 7.2 checks both options against them and ADR-PLATFORM-001 lists BUS-07.1 as a hard constraint. Chunk 12 must not gain a locked item by hand; the gap is in the engine's landing map.
- **Options:**
  - **A.** A person adds a G3 condition that names BUS-07.1 and BUS-08.1, so chunk 12 § 12.5 carries them and the SDD shows them as a §4 risk citing `PSDD/COND-NN` - works today through an op; G3 then reads Approved with conditions at best.
  - **B.** Fix the landing map at the source (BUS-07 and BUS-08 into §6 Notes and §11), `compute`, and paste the new fragment - the right long-term fix, but no project-state op makes it; it needs a skill change.
  - **C.** No change - the SDD may meet BUS-07 through the BRDs, but the Pre-SDD's own hard entries stay outside its contract.
- **Recommended Answer:** Option A now, and report Option B to the skill owner. A person or the fixture owner runs `add-condition` with text "The SDD designs to the hard entries BUS-07.1 (payouts go only to the card used for the purchase; the non-goals of both BRDs) and BUS-08.1 (payouts follow the refund terms agreed with CardPay Ltd), cited as PSDD/BUS-07.1 and PSDD/BUS-08.1; the lock list of chunk 12 § 12.2 does not carry them." and the owner and due date that person gives (the Lead Architect, Retail IT, HDR-04.1, owns ADR-PLATFORM-001, which already lists BUS-07.1). Then `compute` and paste the new 11-gate fragment, and update 12 § 12.5 Conditions from it.
- **Why:** The handoff rule is that a missing item is raised here and fixed at its source; `add-condition` is the one op that puts the two guardrails in front of the SDD now, and the landing-map fix removes the need later.
- **Status:** Adjusted - applied
- **Resolution:** Settled by the engine fix of Task 7.0c (refresh 2026-10-27). See the [Resolution Log](#resolution-log).

### OI-14: Chunk 12 tells the SDD to carry the store kind of each data workload but never says what it is or where it stands

- **Where:** 12 § 12.2 (DAT-01.1, DAT-01.2 rows) and § 12.3 (§6 Notes row)
- **Type:** Lock-list gap
- **Concern:** § 12.3 says "the data-store row carries the store kind of each data workload (DAT-01)". In § 12.2, DAT-01.1 and DAT-01.2 show only the entity descriptions; the store kind is the factor `storeKind` (relational for both, 03d § 3.4; chunk 05 § 5.1 "kind relational"), and the target-shape decision table in § 12.2 has no Data row. A reader of chunk 12 alone cannot tell the store kind or where to find it, so the guide does not read on its own on this point.
- **Options:**
  - **A.** Reword the § 12.3 §6 Notes row to say where the store kind stands - the guide reads on its own without restating a value; text edit in template-derived prose.
  - **B.** Have the engine render the `storeKind` factor in the locked-items fragment (or a Data row in its decision table) - the cleanest fix, but no op makes it; it needs a skill change.
  - **C.** No change - the `PSDD/DAT-01` link opens the factor table, but the guide never says to look there.
- **Recommended Answer:** Option A, and report Option B to the skill owner. In 12 § 12.3, replace the §6 Notes cell "Each affected §6 row carries the constraint in its Notes; the data-store row carries the store kind of each data workload (DAT-01), and the product stays the SDD's. A product that breaks a constraint becomes an open item (§ 12.6)." with "Each affected §6 row carries the constraint in its Notes; the data-store row carries the store kind of each data workload, which stands as the factor `storeKind` of DAT-01.1 and DAT-01.2 in the register row the `PSDD/DAT-01` link opens, and the product stays the SDD's. A product that breaks a constraint becomes an open item (§ 12.6)." Prose only; no project-state op.
- **Why:** The handoff guide locks "data kind and consistency per workload"; consistency reaches § 12.2 through DAT-05.1 and DAT-05.2, but the kind does not, and the edit names its home without writing a value no fragment in chunk 12 holds.
- **Status:** Adjusted - applied
- **Resolution:** Settled by the engine fix of Task 7.0c (refresh 2026-10-27). See the [Resolution Log](#resolution-log).

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-10-27 | 03a § How to Read the Register | Accepted recommendation |
| OI-02 | 2026-10-27 | none | Rejected |
| OI-03 | 2026-10-27 | QD-06; 10 § 10.1; 12 § 12.5 | Adjusted: due 2026-11-20, given by the fixture owner |
| OI-04 | 2026-10-27 | SEC-02.1 (not applied) | Decided - waiting for a person |
| OI-05 | 2026-10-27 | INT-03.1 (not applied) | Decided - waiting for a person |
| OI-06 | 2026-10-27 | 04 § 4.1 | Accepted recommendation |
| OI-07 | 2026-10-27 | QD-07; 05 § 5.3; 10 § 10.2 R-01 | Adjusted: due 2026-11-20, given by the fixture owner |
| OI-08 | 2026-10-27 | none | Rejected |
| OI-09 | 2026-10-27 | 09 § 9.2 DT-15 | Accepted recommendation |
| OI-10 | 2026-10-27 | QD-08; 10 § 10.2 R-06 | Accepted recommendation |
| OI-11 | 2026-10-27 | 10 § 10.2 R-06 | Accepted recommendation |
| OI-12 | 2026-10-27 | 11 § 11.2 | Accepted recommendation |
| OI-13 | 2026-10-27 | 12 § 12.2 (engine fix, Task 7.0c) | Adjusted: settled by the engine fix, refresh 2026-10-27 |
| OI-14 | 2026-10-27 | 12 § 12.2 (engine fix, Task 7.0c) | Adjusted: settled by the engine fix, refresh 2026-10-27 |

---

## Reviewer Notes

| Check | Checked | Findings | Notes |
|---|---|---|---|
| 1. Every value has a source; every Confirmed value has who and when | All 10 HDR and 70 register rows (every entry and factor) in chunks 01 and 03a to 03h against studio/project-state.json; the 07 costs, scores and weights | 1 finding (OI-08) | Every Confirmed entry and factor shows who and when; Open entries read TBD with owner and due; N/A entries (CAP-12.1, ECO-05.1) give a reason. The `Default: project rule ...` sources are engine defaults (raised as wording, OI-02). Open factors without owner (CAP-07.2 meanLatencyMs, CAP-10.1 queryShape, DAT-05.2 transactionNeed, INT-08.1 cidrPrefix) feed no Confirmed result except Open CALC-18 |
| 2. No business number guessed, proposed outside REL-01, REL-03, REL-04, CAP-07, or set by a policy where only a person may give it | Proposal history (REL-01.1, REL-01.2, CAP-07.1, CAP-07.2 accepted by the policy; REL-03.1 and REL-04.1 changed by the fixture owner); every policy confirmation (BRD-sourced, derived or default values only); costs, weights and horizon (fixture owner); EXC-01 (named person) | 2 findings (OI-03, OI-10) | No proposal outside the four allowed rows and no policy-set fact, cost, weight, score, owner, date, N/A or exception. OI-03: a factor applied beyond its source's scope; OI-10: a policy-accepted target with no unknown to confirm it |
| 3. Fragment regions equal studio/fragments; prose numbers are in a fragment, cited by ID; chunk 05 diagrams equal studio/diagrams | All 17 ENGINE-FRAGMENT regions compared with their files (all equal); the 5 Mermaid blocks of 05 § 5.2 compared with infrastructure, network, dr, data and security .mmd (all equal); every number in the prose of 01, 02, 04, 05, 07, 09, 10, 11, 12 traced | 1 finding (OI-06) | All 17 fragment files are used once. The "2 hours" in 04 § 4.3 and 10 R-01 is held by the REL-08.1 fragment and cited as REFUNDS/NFR-02 |
| 4. Shape only: no product, version or architecture style; a provider only as a hard constraint | Searched every chunk for products, versions and style terms; read 05, 07, 09 § 9.4, 12 § 12.4 | No issue found | CardPay Ltd, MsgHub and Point-of-Sale Records are BRD partners, not solution products; REFUNDS 12 TI-01 and TI-02 are cited for shape only and their products are not restated; "broker, outbox" appear only in what is left to the SDD; no provider is named |
| 5. Every hard Open entry listed with owner and due date, blocking the gate or under a person's time-bound exception | All hard entries in the state (BUS-07.1, BUS-08.1, DAT-03.1, DAT-04.1, DAT-06.1, SEC-01.1, SEC-04.1); 10 § 10.3, 11 § 11.1, 12 § 12.5 | No issue found | SEC-01.1 is the only hard Open entry: Legal Counsel, 2026-12-15, under EXC-01 (granted by Product Owner (fixture owner), expires 2027-12-31, review 2027-03-31), listed in 10 § 10.3 and 12 § 12.5 |
| 6. Every conflict stands, unsmoothed and unranked | Engine validation (no blocker, no conflict); rule SLO-15@region; 04 § 4.3, 05 § 5.3, 07 § 7.2, 09 § 9.2, 10 § 10.2 | 2 findings (OI-07, OI-09) | OI-07: REL-03.1 against REFUNDS/NFR-02 is called a tension and has no decision date; OI-09: DT-15 states the risks as accepted while G3-11 is Open |
| 7. Chunk 12's lock list is complete and the guide reads on its own | 12-locked-items fragment against the register and the handoff topics; § 12.3 against the 13 places of the landing table (all named: Project Type, Q3, Q7, Q8, §6 Notes, §8.3, §8.6, §8.7, §11, §18, §18.5, §19, §20); § 12.1, § 12.5 against the master and the gate and validation fragments | 2 findings (OI-13, OI-14) | § 12.1 and § 12.5 match the engine (G2, Not signed, not authorized; EXC-01; QD-01 to QD-05). The guide does not claim the lock is in force |
| 8. IDs exist where cited; rule IDs use LOAD-04 and DB-READ-17; every BRD reference has its key; every row heading exists once | Every register, CALC, OPT, DT, ADR, QD, R, G3, EXC ID cited across the chunks against the state and the fragments; rule IDs in the 09-rule-trace fragment; BRD references by pattern; `### ` row headings | 4 findings (OI-02, OI-04, OI-05, OI-11) | Rule IDs are the engine's (ARCH-01, DR-03@region, LOAD-04, DATA-08@az, DB-10, SEC-11, SLO-15@region); no CAP-04 or DB-READ-11 rule ID. All 80 row headings exist once. COND-01 appears only as the citation-format example in 12 § 12.7. Sampled BRD IDs (REFUNDS/NFR-01 to NFR-07, UC-01 E5, UC-04 E1, BR-8, Facts 1 and 2, Constraint 2, Assumption 4, TI-01, TI-02; LOYALTY/NFR-01 to NFR-05, UC-01 E1) exist in the BRDs |
| 9. Chunk set matches mode and path; headers and footers chain; the master agrees with the engine | Chunk files present (00, 01, 02, 03a to 03h, 04, 05, 07, 09 to 12; no 06, no 08) for full mode, GF-CL, overlay off; every header block and MASTER/PREV/NEXT footer; master gate line, progress and index against model.json | 2 findings (OI-01, OI-12) | Footers chain 00 to 12 and to 13; the master's gate line "G2 - G3: Not signed - SDD authorized: No" equals the engine's gate (label G2, g3 Not signed, authorized false); source BRD versions and statuses match both BRD covers |
| 10. No decision story in the content chunks | Prose of every content chunk outside the fragments, searched for answer, proposal, policy and fixture narration | No issue found | Who decided what stays in decision-log.md; 07 § 7.2 restates only the weights approval the fragment shows |
| 11. No em dash or en dash in the chunks, the master or the decision log | Byte scan of all 18 chunk files, the master and decision-log.md for U+2014 and U+2013; also for CR bytes | No issue found | None found; all files are LF |
| [2026-10-27] application check: OI-01 (v1.0) | 03a § How to Read the Register, last paragraph | No issue found | The sentence now reads as recommended; no OVL or chunk 08 pointer is left in 03a; the 03a fragment still equals its file |
| [2026-10-27] application check: OI-03 (v1.0) | QD-06 in the 10-validation fragment and in 12 § 12.5; due date against the fixture answers as reported | No issue found | QD-06 on CAP-04.1 with the recommended question and impact, owner Refunds and Loyalty Product Owner, due 2026-11-20 (Adjusted from 2026-11-30); 12 § 12.5 row equals the fragment row |
| [2026-10-27] application check: OI-06 (v1.0) | 04 § 4.1 Targets, rows CAP-01.1 and CAP-01.2 | No issue found | Both rows read "Daily transactions, ..."; values, status and links unchanged; the 04-calculations fragment still equals its file |
| [2026-10-27] application check: OI-07 (v1.0) | QD-07 in the 10-validation fragment and 12 § 12.5; 10 § 10.2 R-01 Linked IDs; 05 § 5.3 | No issue found | QD-07 on REL-02.1 as recommended, due 2026-11-20 (Adjusted); R-01 links REL-02.1 and QD-07; 05 § 5.3 states the conflict as recommended and no longer calls it a tension; the 05 fragment and the 5 diagrams still equal their files |
| [2026-10-27] application check: OI-09 (v1.0) | 09 § 9.2 DT-15 outcome | No issue found | The outcome reads as recommended and matches the 11-gate fragment (G3-11 Open); R-01 to R-04 are still the High-impact risks in 10 § 10.2; the 09-rule-trace fragment still equals its file |
| [2026-10-27] application check: OI-10 (v1.0) | QD-08 in the 10-validation fragment and 12 § 12.5; 10 § 10.2 R-06 Mitigation and Linked IDs | No issue found | QD-08 on CAP-07.2 as recommended, due 2026-11-20; R-06 reads "Answer QD-01, QD-02 and QD-08 through the BRD owners" and links QD-08 |
| [2026-10-27] application check: OI-11 (v1.0) | 10 § 10.2 R-06; unifier-status.md (read only) | No issue found | HR-001 and HR-002 are no longer cited in any chunk. They do exist on unifier-status.md (Open, E2E Architect to Product manager, the REFUNDS and LOYALTY NFR values), so Option B would also have worked; the applied Option A loses only that pointer, and the decision log records it |
| [2026-10-27] application check: OI-12 (v1.0) | 11 § 11.2 | No issue found | Reads "The G3 checklist and the sign-offs are still to come; no condition is recorded."; matches the 11-gate fragment (Conditions: None), which still equals its file |
| [2026-10-27] application check: OI-14 (v1.0) | 12 § 12.3, §6 Notes row | No issue found | The cell reads as recommended; 12 § 12.3 still names all 13 landing places; the 12-locked-items fragment still equals its file. All 17 fragment regions equal studio/fragments after the re-paste; no U+2014 or U+2013 in any chunk, the master or decision-log.md |

- Run: full (not light), first full build, all chunks in scope.
- OI-02, OI-08, OI-13 and OI-14 each also point at an engine or skill-level fix (default source wording, the 07-options At column, BUS rows in the landing map, the storeKind factor in the locked items); no project-state op makes those, so each item recommends the ops or text that can act now.
- Not read, by the reviewer brief: unifier-status.md (so HR-001 and HR-002 in OI-11 could not be checked there), fixture-answers.md, the run brief and transcript, and the skill's other rule files.
- [2026-10-27] application pass (review pass 2): unifier-status.md was read, read only, for the HR IDs. No new finding inside the scope.
- Out of scope, for the next review: the master's progress row for stage 4 still reads "Review passes 0 of 3; open items: none yet", although review pass 1 wrote 14 items and the accept loop has applied or decided them (OI-04, OI-05 and OI-13 wait for a person). The row should give the passes done and the items still Open or waiting.

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 12-sdd-handoff-guide.md | NEXT: none -->
