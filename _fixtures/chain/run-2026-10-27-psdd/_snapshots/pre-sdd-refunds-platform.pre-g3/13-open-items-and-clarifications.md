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
| **Recommended Answer** | The proposed resolution, ready to apply: the project-state change (the entry and its new value, status, or source) or the exact text for the chunk. A finding that needs no change reads `No change: <evidence>`. |
| **Why** | REQUIRED. One or two lines: the evidence behind the recommendation and the tradeoff it accepts. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Decided - pending application / Accepted - applied / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`. |

Write the Status field as the literal legend value, for example `- **Status:** Accepted - applied`. Put the update link on a separate `- **Resolution:**` line.

---

## Open Items

### OI-01: The option shapes say synchronous replication inside the primary region; the locked shape says asynchronous

- **Where:** 07 § 7.1 (fragment `07-options.md`, the Shape of OPT-01 and OPT-02); project state `options.list[].shape.data`
- **Type:** Conflict
- **Concern:** The shape of OPT-01 and OPT-02 reads "synchronous inside the primary region, asynchronous to the recovery region". The engine's target shape says the replication inside the primary region is asynchronous: 05 § 5.1 ("DR strategy, scope az ... replication asynchronous"; "Data ... asynchronous (az)"), `model.json` `shape.replication.az = asynchronous`, the locked decision row in 12 § 12.2, and ADR-DATA-001 ("replication to the zone standby and to the recovery region is asynchronous"), with the lag measured against REL-04.2 (DATA-08@az). The chosen option and the locked shape therefore give the SDD two answers for §8.6 and §11, and the G3 signers sign a comparison whose option text does not match the shape. The engine does not check the free-text option shape, so chunk 10 shows no conflict.
- **Options:**
  - **A.** Correct the option text to the engine shape, run `compute`, and paste the new `07-options.md` - matches 05, 09 and 12; no confirmed value changes.
  - **B.** Keep synchronous replication inside the primary region and change the shape instead (a DR override for scope az with its reason, and ADR-DATA-001 rewritten) - stricter than REL-04.2 needs (it is not 0), adds write latency, and needs a person's override reason.
  - **C.** Keep both texts and explain the difference in 07 § 7.2 - the contradiction stays in material the SDD locks.
- **Recommended Answer:** Option A - project-state change: `options.list[OPT-01].shape.data` and `options.list[OPT-02].shape.data` = "relational, strongly consistent; asynchronous to the zone standby and to the recovery region"; then `compute` and paste `07-options.md` unchanged.
- **Why:** `model.json` `shape.replication` = region asynchronous, az asynchronous, and 05 § 5.1, 09 § 9.4 and 12 § 12.2 agree; the option text came from the skill (history op `set-option`, 2026-10-27T16:42:47.268Z), not from a person, and no criterion score or reason mentions in-region replication, so the scores stand.
- **Status:** Accepted - applied
- **Resolution:** OPT-01 and OPT-02 shape data now read "relational, strongly consistent; asynchronous to the zone standby and to the recovery region" ([07 § 7.1](./07-options-and-economics.md#71-options)); decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27); patch 20261027T171100Z-review-OI-01-policy.json, then the fixture owner confirmed the unchanged costs and scores again (20261027T171130Z-review-OI-01-fixture-reconfirm.json).

---

### OI-02: The SLO-15@region finding is smoothed into "a measurement question for the SDD"

- **Where:** 04 § 4.3 (Availability and recovery bullet)
- **Type:** Conflict
- **Concern:** The rule trace SLO-15@region (09 § 9.3) finds that one full-length region outage (RTO 4 h, REL-03.1) is longer than the 30-day downtime budget (43.2 min, CALC-13), and its verification asks to "clarify measurement exclusions". 04 § 4.3 settles it in prose as "a measurement question for the SDD, not a contradiction". Which outages count against REL-01.1 and REL-01.2 is a business answer, not a design choice: the REL-01 row asks for the denominator, service window and measurement period, and both entries read Window `TBD`; REL-02.1 (what failures and exclusions count) is `Open` with the Refunds and Loyalty Product Owner, due 2026-11-30. Handing the question to the SDD hides an open business answer behind a locked 99.9 %. The same bullet cites the 2 hours of disruption a month through the BRD only, not through REL-08.1, the entry that holds the number in a fragment.
- **Options:**
  - **A.** Let the finding stand and point it to its business owner (text below) - no value changes; the open question stays visible through REL-02.1.
  - **B.** No change: the engine's assessment itself says "not inherently contradictory" - keeps the bullet short, but assigns a business exclusion to the SDD.
  - **C.** Raise a new unknown on REL-01.1 for the measurement exclusions - more visible, but duplicates REL-02.1, which already holds the question.
- **Recommended Answer:** Option A - in 04 § 4.3, replace "CALC-13 stays inside the 2 hours of disruption a month of [REFUNDS/NFR-02](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)." with "CALC-13 stays inside the 2 hours of disruption a month of REL-08.1 ([REFUNDS/NFR-02](../brd-refunds-portal/10-nfrs.md#non-functional-requirements))." and replace "The rule trace (SLO-15@region, chunk 09) notes that one full-length region outage can use more than the monthly availability allowance; that is a measurement question for the SDD, not a contradiction." with "The rule trace (SLO-15@region, chunk 09) stands: one full-length region outage at REL-03.1 lasts longer than the 30-day downtime budget of CALC-13. Whether a declared region loss counts against REL-01.1 and REL-01.2 is open: their measurement window reads TBD, and the exclusions belong to REL-02.1 (`Open`, Refunds and Loyalty Product Owner, 2026-11-30)."
- **Why:** Fragment `09-rule-trace.md` reads "RTO=4 h; 30-day budget=43.2 min ... Clarify measurement exclusions", and fragment `03c-register-reliability.md` shows REL-01 Window `TBD` and REL-02.1 `Open`; the new text names the owner instead of deciding the answer, and every number in it is already in a fragment.
- **Status:** Accepted - applied
- **Resolution:** [04 § 4.3](./04-targets-and-calculations.md#43-what-the-numbers-mean), Availability and recovery; decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

### OI-03: The capacity prose reads the load as small while the peak active users are read by no calculation

- **Where:** 04 § 4.3 (Capacity bullet); 10 § 10.2
- **Type:** Risk
- **Concern:** CALC-01 to CALC-09 and LOAD-04 read only CAP-01.1 (points movements, which arrive from the Point-of-Sale Records purchase feed), giving the peak API rate of CALC-03. CAP-03.1 (300 peak simultaneously active users across customers, members and branch managers) is read by no calculation, and no entry gives the request rate of the screens that CAP-07.1 and CAP-07.2 budget (receipt lookup, request lists, points balance and history). The prose "CALC-02 (peak business TPS) and CALC-03 (peak API RPS) are small, so capacity is driven by failure-mode headroom and the seasonal peak of CAP-04.1, not by raw throughput" may understate the load that §18 and ADR-PERF-001 size for. The advisory PRIMARY-ONLY-CAP-01 and risk R6 cover only CAP-01.2, not CAP-03.1.
- **Options:**
  - **A.** State the gap in the prose and carry it as a risk (text below) - no value changes; the SDD sees that CALC-03 counts only points movements.
  - **B.** Add a CAP-01 entry for screen requests (`Open`, owner B+E, Refunds and Loyalty Product Owner, with that owner's due date) and make it the primary entry once answered - sizes from the real driver, but needs a person's number and reruns every calculation.
  - **C.** No change: PRIMARY-ONLY-CAP-01 and R6 already warn that only CAP-01.1 is read - CAP-03.1 stays unread without a word.
- **Recommended Answer:** Option A - in 04 § 4.3, replace "CALC-02 (peak business TPS) and CALC-03 (peak API RPS) are small, so capacity is driven by failure-mode headroom and the seasonal peak of CAP-04.1, not by raw throughput;" with "CALC-02 (peak business TPS) and CALC-03 (peak API RPS) count only the points movements of CAP-01.1; the peak simultaneously active users of CAP-03.1 are read by no calculation (risk R7);" and add this row to the table in 10 § 10.2: "| R7: the screen load of the peak simultaneously active users is not sized; CALC-03 counts only points movements | Medium | Medium | The business gives the screen request rate as a CAP-01 entry before the SDD fixes §18; until then the SDD sizes the screens from CAP-03.1 and states its assumption | Refunds and Loyalty Product Owner | CAP-03.1, CAP-01.1, CALC-03, LOAD-04 |".
- **Why:** Fragment `04-calculations.md` lists CAP-01.1 as the only capacity input of CALC-01 to CALC-09, no CALC row reads CAP-03, and fragment `10-validation.md` names only CAP-01.2 in its advisory; Option A keeps every number as the engine wrote it and names the owner who can close the gap.
- **Status:** Accepted - applied
- **Resolution:** [04 § 4.3](./04-targets-and-calculations.md#43-what-the-numbers-mean), Capacity, and risk R7 in [10 § 10.2](./10-validation-risks-unknowns.md#102-risks); decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

### OI-04: The lock list leaves out the data-store kind, the partner SLAs, the latency measurement point, and data correctness

- **Where:** 12 § 12.2 (fragment `12-locked-items.md`, from the engine's landing map)
- **Type:** Lock-list gap
- **Concern:** The handoff guide says the Pre-SDD settles "data kind and consistency per workload", "partner SLAs" and "latency budgets", and G3-05 asks for business approval of "data correctness". The lock list carries DAT-05 but not DAT-01 (the relational store kind of both workloads, the data-store shape of 05 § 5.1 and rule DB-10), not INT-03.1 to INT-03.3 (the partner SLAs and quotas, `Open`), not CAP-08.1 (where the CAP-07 budgets are measured: the ingress edge, successes and failures apart) and not REL-10.1 (zero missing or duplicate payouts; the balance equals the sum of the movements). The decision table has no data row either. An SDD that locks only § 12.2 may pick a store of another kind, measure latency elsewhere, or size integrations without carrying the open partner SLAs.
- **Options:**
  - **A.** Fix at the source: add the four rows to the engine's landing map, run `compute`, and paste the new `12-locked-items.md` unchanged - the lock matches the guide; needs an engine change outside this project.
  - **B.** No change: the SDD reaches these rows through the register links - no engine change, but the rows arrive as context, not as locked items.
  - **C.** Add the four rows to § 12.2 by hand - not allowed: the fragment is pasted unchanged and a missing item is fixed at its source (handoff-guide.md § Never).
- **Recommended Answer:** Option A - engine landing map: DAT-01 lands in §6 Notes and §8.3; INT-03 in §6 Notes and §8.3; CAP-08 in §18 and Q3; REL-10 in §11 and §18.5; then `compute` and paste `12-locked-items.md` unchanged.
- **Why:** handoff-guide.md § What is left to the SDD (the Data, Integration and Capacity rows) and G3-05 name these as Pre-SDD answers, and fragment `12-locked-items.md` holds none of DAT-01, INT-03, CAP-08 or REL-10; the landing places follow those of the rows that sit beside them (DAT-05, INT-02, CAP-07, REL-01).
- **Status:** Decided - pending application
- **Resolution:** Recommendation accepted by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) on 2026-10-27. Its application is a change to the engine's landing map, outside this project; this run never edits the skill or the engine, so the lock list stays as the engine renders it until the engine changes.

---

### OI-05: EXC-01 on hard entry SEC-01.1 is granted by a person labelled "fixture owner"

- **Where:** 11 § 11.1 (Exceptions), 10 § 10.3, 12 § 12.5
- **Type:** Open hard item
- **Concern:** SEC-01.1 (applicable laws, contracts and policies; hard) is `Open` (Legal Counsel, 2026-12-15) and passes G3 only through EXC-01, which reads "Granted by: Product Owner (fixture owner)". The handoff guide, the rule the SDD reads beside chunk 12, says only a named person grants an exception, "never a stand-in, an answer policy, a fixture owner, or the skill". An SDD reader who sees "(fixture owner)" in 12 § 12.5 may treat EXC-01 as invalid and SEC-01.1 as blocking. The decision log records ruling R23, which makes `Product Owner (fixture owner)` the person for this one exception, distinct from the fixture owner who gives facts (`Fixture: Product Owner stand-in (test-run policy)`), and the history op `add-exception` carries actor type `person`. Separately, EXC-01 expires 2027-12-31 while its reason says the law is needed before go-live, and the go-live date is open (QD-01).
- **Options:**
  - **A.** No change for this fixture run: ruling R23 names the granter as a person, and the dates make the exception time-bound; the G3 signers weigh it under G3-11 - the exception path runs end to end; the label still reads like a fixture owner to an outside reader.
  - **B.** Before the G3 stop, a named person who owns the risk of SEC-01.1 (Legal Counsel, or the business sponsor of HDR-02.1) grants the exception in their own name, with an expiry no later than the go-live date once QD-01 is answered, and EXC-01 is revoked - meets the guide literally; needs a real person, which a fixture run lacks.
  - **C.** Revoke EXC-01 so SEC-01.1 blocks G3 until Legal Counsel answers - strictest; stops the SDD for a dependency the BRDs need only before go-live.
- **Recommended Answer:** Option A - No change: decision-log.md § Walkthrough and delegation history, "Exception, 2026-10-27 (ruling R23)", and the project-state history op `add-exception` (actor type `person`, 2026-10-27T16:44:29.967Z) record `Product Owner (fixture owner)` as the person who granted EXC-01; expires 2027-12-31 and review 2027-03-31 make it time-bound. Outside a fixture run, Option B applies.
- **Why:** Check 5 needs a person's time-bound exception, and R23 supplies the person for this run while the dates supply the bound; the tradeoff accepted is a granter label the handoff guide would refuse in a real run, so the G3 signers should read this item before they tick G3-11. The text of R23 itself is not in the reviewed files.
- **Status:** Rejected
- **Resolution:** The Recommended Answer reads No change; taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) on 2026-10-27, so no document changes.

---

### OI-06: QD-02 and SEC-01.1 give two due dates for the same answer

- **Where:** 10 § 10.1 (QD-02), 12 § 12.5 (QD-02 row); 03e SEC-01.1
- **Type:** Ambiguity
- **Concern:** QD-02 (which data-protection law applies; entry SEC-01.1; owner Legal Counsel) is due 2026-11-20, while SEC-01.1 is due 2026-12-15, and the reason of EXC-01 and risk R2 both say Legal Counsel confirms the law by 2026-12-15. The SDD carries QD-02 with one date and the register row with another, and whoever follows up with Legal Counsel cannot tell which date holds.
- **Options:**
  - **A.** Set the due date of QD-02 to 2026-12-15, once the fixture owner confirms it - matches SEC-01.1, the EXC-01 reason and R2.
  - **B.** Set the due date of SEC-01.1 to 2026-11-20, once the fixture owner confirms it - matches QD-02, but the EXC-01 reason and R2 then need new text.
  - **C.** Keep both and describe QD-02 as an earlier checkpoint - one answer keeps two dates.
- **Recommended Answer:** Option A - project-state change: `unknowns[QD-02].due` = 2026-12-15, after the fixture owner, who gave both dates, confirms it; then `compute`, paste `10-validation.md`, and update the QD-02 row of 12 § 12.5.
- **Why:** Both dates come from the fixture owner (history: `add-unknown` QD-02 at 2026-10-27T16:36:28.649Z; SEC-01.1 due 2026-12-15 set at 2026-10-27T16:40:25.038Z); the later one is the newer answer and is repeated in EXC-01 and R2. A due date is the owner's commitment, so the owner confirms before it is applied.
- **Status:** Open
- **Resolution:** Waits for the fixture owner: a due date comes only from a person or a fixture owner, the fixture answers give QD-02 2026-11-20 and SEC-01.1 2026-12-15 and nothing else, and no op changes an unknown once it is added.

---

### OI-07: Chunk 13 is not chained in: chunk 12 ends the set, and the master and chunk 00 have no row for it

- **Where:** 12 footer; master (Handoff and Review table, Chunk Dependency Graph, Reading Order by Task); 00 § Indexes (Table of Contents, ID Index)
- **Type:** ID error
- **Concern:** This is a full-mode run and chunk 13 now exists. The footer of chunk 12 reads `NEXT: none`, while the template's chunk 12 footer reads `NEXT: 13-open-items-and-clarifications.md`. The master has no chunk 13 row, no dependency-graph line and no triage task, and the "Sign G3" reading order omits 13; chunk 00's Table of Contents and ID Index stop before 13 and `OI-NN`. A reader who follows the footers or the indexes never reaches the open items before the G3 stop.
- **Options:**
  - **A.** Chain chunk 13 in (text below) - matches the full-mode template set.
  - **B.** Leave as is until the open items are closed - the chain stays broken while the items wait for decisions, which is when signers need them.
- **Recommended Answer:** Option A - (1) chunk 12 footer: `<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 11-gate-and-sign-off.md | NEXT: 13-open-items-and-clarifications.md -->`; (2) master, Handoff and Review table, add the row `| 13. Open items and clarifications (OI-NN) | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md) |`; (3) master dependency graph, after the chunk 12 line, add `+-- 13-open-items-and-clarifications.md .. reviewer findings with recommended answers`; (4) master Reading Order by Task, change the "Sign G3" row to `| Sign G3 | 11 | 10, 12, 13 |` and add `| Triage reviewer findings | 13 | the chunks each item names |`; (5) chunk 00 Table of Contents, add `| 13. Open Items and Clarifications | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md) |`, and ID Index, add ``| `OI-NN` | Reviewer open items | [13](./13-open-items-and-clarifications.md) |``.
- **Why:** The template files `chunks/12-sdd-handoff-guide.md` (footer), `chunks/pre-sdd-master.md` (chunk 13 rows) and `chunks/00-cover-and-changelog.md` (Table of Contents and ID Index rows for 13) hold these lines for full mode; footers and index rows bump no version.
- **Status:** Accepted - applied
- **Resolution:** Chunk 12 footer, the master (index row, dependency graph, reading order) and chunk 00 (Table of Contents, ID Index); decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

### OI-08: Chunk 02 § 2.5 states two numbers that no fragment holds

- **Where:** 02 § 2.5
- **Type:** Fragment mismatch
- **Concern:** § 2.5 says no failure scope has both its RTO and RPO "under 10 seconds" and not every scope has both "over 6 hours". Neither number is in a fragment (`02-classification.md` gives only "Recovery tier: none" and "Closest worked example: none") and neither is cited by an ID. They read as the engine's tier thresholds restated from memory.
- **Options:**
  - **A.** Drop the numbers and point to the fragment and the entries (text below) - same meaning, no unsourced number.
  - **B.** Have the engine print its tier rule in `02-classification.md`, then cite it - the numbers become sourced; needs an engine change.
- **Recommended Answer:** Option A - replace the § 2.5 text with "The engine names no closest worked example: the recovery tier in § 2.1 reads none for the RTO and RPO of both failure scopes (REL-03.1 and REL-04.1 for scope region, REL-03.2 and REL-04.2 for scope az)."
- **Why:** Fragment `02-classification.md` holds neither 10 seconds nor 6 hours, and every number in the prose must be in a fragment and cited by ID; the new text cites only entries whose values the fragments hold.
- **Status:** Accepted - applied
- **Resolution:** [02 § 2.5](./02-classification-and-path.md#25-closest-worked-example); decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

### OI-09: Some BRD references carry no BRD key

- **Where:** 03a BUS-02.2 and 01 § 1.4 (row "Track a refund request"); 03b CAP-07.2 label; 03c REL-01.1 and REL-01.2 labels (fragments)
- **Type:** ID error
- **Concern:** "Business Objective 2" (BUS-02.2 and 01 § 1.4) has no key, and both BRDs have a Business Objective 2 (REFUNDS: stop lost refund requests; LOYALTY: members check their points without calling a branch). The labels "LOYALTY/UC-01, UC-02" and "REFUNDS/UC-01 to UC-04" key only the first ID. A reader, or a script that resolves keyed IDs, cannot tell which BRD the bare IDs belong to.
- **Options:**
  - **A.** Key every BRD ID: wording changes in the project state, then `compute` and paste 03a, 03b and 03c, plus the 01 text - every reference resolves; three fragments change, no value changes.
  - **B.** Key only the prose in 01 § 1.4 - the fragments keep bare IDs.
- **Recommended Answer:** Option A - project-state wording changes: BUS-02.2 value ends "(REFUNDS Business Objective 2)." instead of "(Business Objective 2)."; CAP-07.2 label "Open the points balance and the points history (LOYALTY/UC-01, LOYALTY/UC-02)"; REL-01.1 label "Refund journeys for customers and branch managers (REFUNDS/UC-01 to REFUNDS/UC-04)"; REL-01.2 label "Points balance and points history screens (LOYALTY/UC-01, LOYALTY/UC-02)"; then `compute` and paste the three fragments; in 01 § 1.4 replace "(Business Objective 2)" with "(REFUNDS Business Objective 2)".
- **Why:** REFUNDS 01 and LOYALTY 01 each list a Business Objective 2, and the master states that every BRD reference carries its key (`REFUNDS/NFR-03`); the changes alter wording only.
- **Status:** Decided - pending application
- **Resolution:** Recommendation accepted by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) on 2026-10-27. The engine refused the four wording changes from the policy (BUS-02.2, CAP-07.2, REL-01.1 and REL-01.2 are protected: Confirmed, so only a person may change them), so nothing is applied; a person applies them, with the 01 § 1.4 text, in the next request.

---

### OI-10: The register guide points to OVL rows in a chunk 08 this Pre-SDD does not have

- **Where:** 03a § How to Read the Register (last paragraph)
- **Type:** ID error
- **Concern:** The sentence "the migration overlay rows `OVL-01` to `OVL-12` in chunk 08" cites rows and a chunk that do not exist here: the overlay does not apply (02 § 2.1, 02 § 2.4) and chunk 08 is omitted on purpose. A reader looks for a chunk that is not there.
- **Options:**
  - **A.** Say that the overlay rows are absent (text below) - accurate for this path.
  - **B.** No change: the sentence is the template's general text - leaves IDs cited that do not exist.
- **Recommended Answer:** Option A - replace "The header rows `HDR-01` to `HDR-10` are in chunk 01, and the migration overlay rows `OVL-01` to `OVL-12` in chunk 08." with "The header rows `HDR-01` to `HDR-10` are in chunk 01. The migration overlay does not apply (02 § 2.4), so this Pre-SDD has no `OVL` rows and no chunk 08."
- **Why:** `register.overlay.applies` is false in the project state, and the master and chunk 00 list no chunk 08; IDs must exist where they are cited.
- **Status:** Accepted - applied
- **Resolution:** [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register); decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

### OI-11: The classification fragment says "source unknown" where HDR-09.1 confirms there is no source

- **Where:** 02 § 2.1 (fragment `02-classification.md`, row "Migration overlay"); 02 § 2.4
- **Type:** Ambiguity
- **Concern:** The fragment reads "Migration overlay | does not apply, source unknown", while HDR-09.1 (Confirmed) says there is no source platform (refunds are on paper and by phone today) and HDR-10.1 reads none. "Source unknown" suggests a missing answer where the answer is known, and a signer of G3-03 (migration direction explicit, or N/A with reason) may read it as open.
- **Options:**
  - **A.** Explain the fragment's wording in 02 § 2.4 (text below) - clear without an engine change.
  - **B.** Set `register.overlay.source` to a value that means no source, if the engine accepts one, then `compute` and paste `02-classification.md` - fixes the fragment itself; which values the engine accepts was not checked.
  - **C.** No change - the contradiction stays for the signers to work out.
- **Recommended Answer:** Option A - in 02 § 2.4, replace "Not applicable: no workload crosses a hosting or platform boundary." with "Not applicable: no workload crosses a hosting or platform boundary. HDR-09.1 confirms there is no source platform and HDR-10.1 reads none; the fragment's `source unknown` is the unset source field of the overlay (`register.overlay.source`), not an open question."
- **Why:** The project state holds `register.overlay.source = unknown` with `applies = false`, and `model.json` holds `sourcePlatform = unknown`, while HDR-09.1 and HDR-10.1 are Confirmed by the fixture owner; Option A adds no value and leaves the fragment as the engine wrote it.
- **Status:** Accepted - applied
- **Resolution:** [02 § 2.4](./02-classification-and-path.md#24-migration-overlay); decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

### OI-12: The decision log records none of the applied review decisions

- **Where:** decision-log.md § Clarification register (records of OI-01, OI-02, OI-03, OI-07, OI-08, OI-10, OI-11; also OI-04, OI-05, OI-09)
- **Type:** Missing source
- **Concern:** The seven items marked `Accepted - applied` changed 00, 02, 03a, 04, 07, 10, 12, the master and the OPT-01 and OPT-02 shapes, and OI-04, OI-05 and OI-09 are decided too, yet decision-log.md § Clarification register still reads "The review (step 12) has not run yet." The accept loop records each decision there (review-and-open-items.md § The accept loop, step 4; the WORKFLOW line of this chunk), and the content chunks rely on the decision log as the one home of the decision story (check 10). A G3 signer or a later update that reads the decision history finds no record of who decided the changed text, under which policy, or which derive patch changed the option shapes, and the log contradicts the master's progress row.
- **Options:**
  - **A.** Write one entry per decided item in the template's form (text below) - the record matches chunk 13 and the patches; the decision log grows by ten short entries.
  - **B.** Replace the line with one state line that points to the Resolution Log of chunk 13 - shorter, but the decision story stays in chunk 13 instead of its home, and the template asks for one entry per decided item.
- **Recommended Answer:** Option A - in decision-log.md § Clarification register, replace "The review (step 12) has not run yet." with the text below (every fact in it is in this chunk's Status and Resolution lines or in `studio/patches/`):

  ```markdown
  Ten of the eleven open items from the review are decided on 2026-10-27; OI-06 waits for the fixture owner.

  ### OI-01 - Option shapes and the asynchronous replication of the shape

  **Question:** Should the shape text of OPT-01 and OPT-02 follow the engine shape (asynchronous inside the primary region), or should the shape change to synchronous replication inside the primary region?

  **Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). OPT-01 and OPT-02 shape data now read "relational, strongly consistent; asynchronous to the zone standby and to the recovery region" (derive patch 20261027T171100Z-review-OI-01-policy.json); Fixture: Product Owner stand-in (test-run policy) confirmed the unchanged costs and scores again (20261027T171130Z-review-OI-01-fixture-reconfirm.json). ADR-DATA-001 carries the rationale.

  **Open remainder:** None.

  **Rule home:** [07 § 7.1 Options](./07-options-and-economics.md#71-options)

  ### OI-02 - The SLO-15@region finding

  **Question:** Is the region outage that outlasts the 30-day downtime budget a measurement question for the SDD, or an open business answer?

  **Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). The finding stands in 04 § 4.3, and the exclusions are named as open under REL-02.1; no value changed.

  **Open remainder:** Whether a declared region loss counts against REL-01.1 and REL-01.2 (REL-02.1), with the Refunds and Loyalty Product Owner, due 2026-11-30.

  **Rule home:** [04 § 4.3 What the Numbers Mean](./04-targets-and-calculations.md#43-what-the-numbers-mean)

  ### OI-03 - Peak active users read by no calculation

  **Question:** How does the Pre-SDD treat the peak simultaneously active users of CAP-03.1, which no calculation reads?

  **Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). 04 § 4.3 states that CALC-02 and CALC-03 count only CAP-01.1, and risk R7 joins 10 § 10.2; no value changed.

  **Open remainder:** The screen request rate as a CAP-01 entry, with the Refunds and Loyalty Product Owner (risk R7).

  **Rule home:** [10 § 10.2 Risks](./10-validation-risks-unknowns.md#102-risks)

  ### OI-04 - Lock-list gap in the engine's landing map

  **Question:** Do DAT-01, INT-03, CAP-08 and REL-10 join the lock list through the engine's landing map?

  **Decision record, 2026-10-27:** Option A, the recommendation, accepted by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27); pending application, since the change is to the engine's landing map, outside this project.

  **Open remainder:** The landing-map change; the lock list stays as the engine renders it until the engine changes.

  **Rule home:** [12 § 12.2 Locked Items](./12-sdd-handoff-guide.md#122-locked-items)

  ### OI-05 - The granter of EXC-01

  **Question:** Does EXC-01 on SEC-01.1 stand with Product Owner (fixture owner) as its granter?

  **Decision record, 2026-10-27:** The Recommended Answer read No change; Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) took it, so the item is Rejected and no document changed. Ruling R23 and the history op `add-exception` (actor type `person`) record the granter.

  **Open remainder:** None for this fixture run; outside a fixture run, a named person who owns the risk of SEC-01.1 grants the exception.

  **Rule home:** [11 § 11.1 Gate Result](./11-gate-and-sign-off.md#111-gate-result)

  ### OI-07 - Chunk 13 chained in

  **Question:** Is chunk 13 chained into the footers, the master and the chunk 00 indexes?

  **Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). The chunk 12 footer, the master (index row, dependency graph, reading order) and the chunk 00 Table of Contents and ID Index now carry chunk 13.

  **Open remainder:** None.

  **Rule home:** [Master, Handoff and Review](./refunds-platform-pre-sdd-master.md#handoff-and-review)

  ### OI-08 - Unsourced numbers in 02 § 2.5

  **Question:** Do the tier thresholds stay in 02 § 2.5 without a fragment that holds them?

  **Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). 02 § 2.5 cites the recovery tier of § 2.1 and the entries REL-03.1, REL-04.1, REL-03.2 and REL-04.2 instead of the numbers.

  **Open remainder:** None.

  **Rule home:** [02 § 2.5 Closest Worked Example](./02-classification-and-path.md#25-closest-worked-example)

  ### OI-09 - BRD references without a key

  **Question:** Does every BRD ID in BUS-02.2, CAP-07.2, REL-01.1, REL-01.2 and 01 § 1.4 carry its BRD key?

  **Decision record, 2026-10-27:** Option A, the recommendation, accepted by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27); pending application, since the engine refused the four wording changes from the policy (the entries are Confirmed and protected).

  **Open remainder:** A person applies the four wording changes and the 01 § 1.4 text in the next request.

  **Rule home:** [03a BUS-02](./03a-register-business.md#bus-02)

  ### OI-10 - OVL rows cited in a chunk 08 that does not exist

  **Question:** Does the register guide keep citing OVL rows and a chunk 08 this Pre-SDD does not have?

  **Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). The guide states that the overlay does not apply, so there are no OVL rows and no chunk 08.

  **Open remainder:** None.

  **Rule home:** [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register)

  ### OI-11 - "Source unknown" in the classification fragment

  **Question:** How does the reader take the fragment's `source unknown` while HDR-09.1 confirms there is no source platform?

  **Decision record, 2026-10-27:** Option A, the recommendation, taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27). 02 § 2.4 explains that `source unknown` is the unset source field of the overlay, not an open question; the fragment is unchanged.

  **Open remainder:** None.

  **Rule home:** [02 § 2.4 Migration Overlay](./02-classification-and-path.md#24-migration-overlay)
  ```

- **Why:** decision-log.md line "The review (step 12) has not run yet." stands under § Clarification register while the master's progress row counts 7 Accepted - applied, 2 Decided - pending application and 1 Rejected, and review-and-open-items.md § The accept loop step 4 and the template `decision-log.md` § Clarification register ask for one entry per decided item. Every fact in the entries is taken from this chunk and the two OI-01 patches; the tradeoff is a longer decision log.
- **Status:** Accepted - applied
- **Resolution:** [decision-log.md § Clarification register](./decision-log.md#clarification-register); decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

### OI-13: ADR-PERF-001 still lists only the throughput drivers that count points movements

- **Where:** 09 § 9.5 (row ADR-PERF-001); depends on OI-03 (04 § 4.3, 10 § 10.2 risk R7)
- **Type:** Risk
- **Concern:** OI-03 named ADR-PERF-001 as a decision the unread CAP-03.1 may understate, and its applied answer adds risk R7, whose mitigation tells the SDD to size the screens from CAP-03.1 until the business gives a screen request rate. The ADR-PERF-001 row in 09 § 9.5, to which 12 § 12.4 points the SDD for the answers that drive each SDD ADR, still lists only CAP-01.1, CAP-01.2, CAP-04.1, CAP-07.1, CAP-07.2, CALC-02 and CALC-03. An SDD that writes ADR-PERF-001 (compute, cache and store strategy) from that row cites drivers that count only points movements and misses the user load that R7 asks it to size from.
- **Options:**
  - **A.** Add CAP-03.1 and the pointer to R7 to the row (text below) - the row agrees with 04 § 4.3 and R7; one cell changes, no value changes.
  - **B.** No change: CAP-03 lands in Q3 and §18 through the landing table of 12 § 12.2, so the SDD sees it there - the ADR row stays narrower than the mitigation of R7.
- **Recommended Answer:** Option A - in 09 § 9.5, row ADR-PERF-001, replace "CAP-01.1, CAP-01.2, CAP-04.1, CAP-07.1, CAP-07.2, CALC-02, CALC-03 (all Confirmed or computed)" with "CAP-01.1, CAP-01.2, CAP-03.1, CAP-04.1, CAP-07.1, CAP-07.2, CALC-02, CALC-03 (all Confirmed or computed); CAP-03.1 is read by no calculation (risk R7, chunk 10)".
- **Why:** Fragment `03b-register-capacity.md` holds CAP-03.1 Confirmed (300 peak simultaneously active users), fragment `04-calculations.md` has no CALC row that reads CAP-03, and R7 in 10 § 10.2 links CAP-03.1, CALC-03 and LOAD-04; the template row (CAP-01, CAP-04, CAP-07, CALC) asks for the driving answers by entry ID and status, not a closed list. The tradeoff is one more driver in a row the SDD reads.
- **Status:** Accepted - applied
- **Resolution:** [09 § 9.5](./09-decisions.md#95-sdd-adrs-driven-by-this-pre-sdd), row ADR-PERF-001; decided by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27).

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-10-27 | OPT-01, OPT-02 (07 § 7.1) | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-02 | 2026-10-27 | 04 § 4.3 | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-03 | 2026-10-27 | 04 § 4.3; 10 § 10.2 | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-04 | 2026-10-27 | Engine landing map (not applied) | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)); pending application |
| OI-05 | 2026-10-27 | None | Rejected: No change taken by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) |
| OI-07 | 2026-10-27 | 12 footer; master; 00 § Indexes | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-08 | 2026-10-27 | 02 § 2.5 | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-09 | 2026-10-27 | BUS-02.2, CAP-07.2, REL-01.1, REL-01.2 (not applied) | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)); pending application |
| OI-10 | 2026-10-27 | 03a § How to Read the Register | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-11 | 2026-10-27 | 02 § 2.4 | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-12 | 2026-10-27 | decision-log.md § Clarification register | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |
| OI-13 | 2026-10-27 | 09 § 9.5 | Accepted recommendation (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27)) |

---

## Reviewer Notes

| Check | Checked | Findings | Notes |
|---|---|---|---|
| 1. Every value has a source; every Confirmed value has who and when | All 80 register rows (98 entries: 72 Confirmed, 24 Open, 2 N/A) and 22 sizing factors in `project-state.json`, against the register fragments | No issue found | Every Confirmed entry and factor carries `confirmed_by` and `confirmed_at`; CAP-12.1 and ECO-05.1 carry a source and an N/A reason; every Open entry carries an owner name and a due date. Four Open factors (CAP-07.2 meanLatencyMs, CAP-10.1 queryShape, DAT-05.2 transactionNeed, INT-08.1 cidrPrefix) hold no value, so no source is due. |
| 2. No business number guessed, proposed outside REL-01, REL-03, REL-04, CAP-07, or set by a policy where only a person may give it | Source type of every value; the history ops `propose`, `accept-proposal`, `confirm-group`; decision-log.md § Proposal record | No issue found | Policy-sourced values are only CAP-07.1, CAP-07.2, REL-01.1, REL-01.2 (allowed rows). Appendix defaults (callsPerTxn, requestFactor, utilization, networkOverhead, meanLatencyMs, indexFactor, copies) and the engine defaults CAP-08.1 and OPS-04.1 are stated defaults the policy confirmed. Facts, costs, horizon and weights come from the fixture owner; the REL-03.1 and REL-04.1 proposals were superseded by the fixture owner. REL-01.1 (99.9 %) is stricter than the 2 hours of REFUNDS/NFR-02 and stays inside it. |
| 3. Each fragment region equals its file; every prose number is in a fragment, cited by ID | Byte compare of all 17 ENGINE-FRAGMENT regions with `studio/fragments/` (all equal, none unused); the 4 diagrams in 05 with `studio/diagrams/*.mmd` (all equal); prose numbers in 01, 02, 04, 05, 07, 09, 10, 12 | 1 finding (OI-08) | The 2 hours cited in 04 § 4.3 through the BRD only is folded into OI-02. |
| 4. Shape only: no product, version, or architecture style; a provider only as a hard constraint | Text scan of all chunks and the diagrams for products, versions, styles and hosting providers | No issue found | CardPay Ltd, MsgHub and the Retail IT team are the partners REFUNDS 08 names (CardPay is a Hard dependency in REFUNDS 02), not design choices; no hosting provider is named; the diagrams use generic shape words. |
| 5. Every hard Open entry listed with owner and due date, and blocks the gate or has a person's time-bound exception | Hard entries in the project state; 10 § 10.3; 11 § 11.1; 12 § 12.5; handoff-guide.md § Conditions, exceptions, and unknowns | 2 findings (OI-05, OI-06) | SEC-01.1 is the only hard Open entry; it is listed with Legal Counsel and 2026-12-15 and carries EXC-01 (expires 2027-12-31, review 2027-03-31). |
| 6. Every conflict stands, unsmoothed and unranked | `model.json` `validation.conflicts` and `shape.conflicts` (both empty); the rule trace; option shapes against the shape; prose in 04, 05, 07, 09 | 2 findings (OI-01, OI-02) | OI-03 is a related risk: the capacity prose reads the load as small while CAP-03.1 is unread. No option is ranked over a conflict. |
| 7. Chunk 12's lock list is complete and the guide reads on its own | Fragment `12-locked-items.md` against handoff-guide.md § The lock and § What is left to the SDD; § 12.3 names all 13 places of the landing table; § 12.1 gate line against the master | 1 finding (OI-04) | The gate line in § 12.1 equals the master's; the guide states the gate rule, the lock, the open-item rule and the citations without pointing to the skill's rule files. |
| 8. IDs exist where cited; rule IDs use LOAD-04 and DB-READ-17; every BRD reference has its key; every row heading exists once | Script over all chunks: register IDs, CALC, OPT, DT, QD, R, EXC, G3, ADR, rule IDs; BRD links and anchors; `### <ROW-ID>` headings | 2 findings (OI-09, OI-10) | 80 row headings, each once. LOAD-04 is used and DB-READ-17 is not triggered; SEC-11 and DB-10 are rule IDs that equal no item ID (SEC rows end at SEC-08). COND-01 appears only as the citation example in 12 § 12.7. Every BRD anchor resolves. |
| 9. The chunk set matches the mode and path; headers and footers chain; the master agrees with the engine | Full mode, GF-CL, no overlay: 00 to 05, 07, 09 to 12 present, 06 and 08 omitted; header fields and footers against the templates; master gate line, path, engine version, BRD versions and stage against `model.json` and the project state | 2 findings (OI-07, OI-11) | Footers 00 to 11 chain correctly with 06 and 08 skipped; the master's gate line "G2 - G3: Not signed - SDD authorized: No" matches the engine's gate label G2, G3 Not signed, authorized false. |
| 10. No decision story in the content chunks | Prose of chunks 01 to 12 outside the fragments | No issue found | Only template-required lines name who decided (00 Confirmer, 07 § 7.2 Weights, ADR status lines, the exception granter); the story is in decision-log.md. |
| 11. No em dash or en dash | Scan for U+2014 and U+2013 in all chunks, the master and decision-log.md, and in this chunk | No issue found | None found. |
| [2026-10-27] application check: OI-01 (v1.0) | `options.list[OPT-01]` and `[OPT-02]` `shape.data` in the project state; the policy patch and the fixture reconfirm patch; fragment `07-options.md` against the 07 § 7.1 region (byte equal); option shape against 05 § 5.1, 09 § 9.2 and § 9.4, 12 § 12.2 and `model.json` `shape.replication`; no "synchronous inside the primary region" left in any chunk | 1 finding (OI-12) | Applied as recommended; costs and scores Confirmed again by the fixture owner and unchanged. OI-12 is the missing decision-log record. |
| [2026-10-27] application check: OI-02 (v1.0) | 04 § 4.3 Availability and recovery bullet against the two replacement texts; REL-08.1, REL-01 Window `TBD` and REL-02.1 (`Open`, owner, 2026-11-30) in fragment `03c-register-reliability.md`; SLO-15@region in fragment `09-rule-trace.md`; prose numbers (2 hours, 2026-11-30) in fragments | 1 finding (OI-12) | Both texts applied verbatim; no remaining prose calls the finding a measurement question for the SDD. |
| [2026-10-27] application check: OI-03 (v1.0) | 04 § 4.3 Capacity bullet and the R7 row in 10 § 10.2 against the recommended texts; CAP-03.1 in fragment `03b-register-capacity.md`; no CALC row reads CAP-03 in fragment `04-calculations.md`; LOAD-04 in 09 § 9.3; dependents in 09 § 9.5 and 12 § 12.2 to § 12.5 | 2 findings (OI-12, OI-13) | Applied verbatim; OI-13 is the ADR-PERF-001 driver list that R7 now outgrows. |
| [2026-10-27] application check: OI-07 (v1.0) | Chunk 12 footer; master Handoff and Review row, dependency graph line, Reading Order rows; chunk 00 Table of Contents and ID Index rows; each against the recommended text and the templates `chunks/12-sdd-handoff-guide.md`, `chunks/pre-sdd-master.md`, `chunks/00-cover-and-changelog.md`; footer chain 00 to 13 | 1 finding (OI-12) | All five parts applied as the templates hold them; the chain now runs 11, 12, 13 with 06 and 08 skipped. |
| [2026-10-27] application check: OI-08 (v1.0) | 02 § 2.5 against the recommended text; fragment `02-classification.md`; REL-03.1, REL-04.1 (scope region) and REL-03.2, REL-04.2 (scope az) in fragment `03c-register-reliability.md`; no "10 seconds" or "6 hours" left in any chunk | 1 finding (OI-12) | Applied verbatim; every ID it cites holds the scope it names. |
| [2026-10-27] application check: OI-10 (v1.0) | 03a § How to Read the Register against the recommended text; `register.overlay.applies` false in the project state; no `OVL` or chunk 08 reference left in the chunks, the master or chunk 00 | 1 finding (OI-12) | Applied verbatim. |
| [2026-10-27] application check: OI-11 (v1.0) | 02 § 2.4 against the recommended text; `register.overlay.source` = unknown and `applies` = false in the project state; `model.json` `v.sourcePlatform` = unknown; HDR-09.1 and HDR-10.1 Confirmed in fragment `01-header.md`; fragment `02-classification.md` unchanged and byte equal to 02 § 2.1 | 1 finding (OI-12) | Applied verbatim. |

- Coverage: 11 checks run on the first full build (all chunks), 11 open items raised.
- Observed and not raised as items: CAP-02.1 prints 0.22916666666666669 req/s in 03b and 12 § 12.2, the same value CALC-03 prints as 0.2292 req/s (engine rounding); the option TCO reads "currency units" while ECO-02.1 states EUR (engine label); `studio/diagrams/security.mmd` is not pasted, and the chunk 05 template lists only four diagrams; G3-09 and G3-10 (brownfield and migration lines) read Open and are expected to be ticked N/A with their reason at the G3 stop; risk R5 says the questions go to "the Product manager" while its owner column names the Refunds and Loyalty Product Owner; the sources "Default: project rule CAP-08" and "Default: project rule OPS-04" are engine defaults (history reason "Decision 11: project default"), not rules from the project's AGENTS.md.
- Not checked, because the files are outside the reviewed set: the text of ruling R23 (OI-05), the engine's landing map (OI-04), and the values the engine accepts for `register.overlay.source` (OI-11). `studio/diagrams/architecture.drawio` was not reviewed, since no chunk embeds it.

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 12-sdd-handoff-guide.md | NEXT: none -->
