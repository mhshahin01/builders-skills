# Step 5 findings log (business-reviewer-unifier on the step 4 chain)

Run folder: SP\s5 (see step5-plan.md). Input: `chain/run-2026-10-01-e2e` (REFUNDS 1.0 Approved, LOYALTY 1.2 In Review, SDD 1.2 Draft with the e2e gate open, LLD 1.1). Skill: business-reviewer-unifier as of 86cab74 (unchanged since).

## P: panel and merge (this session as orchestrator; 12:35 to 13:17)

**Result.** Five background general-purpose reviewers, one per persona, read-only, launched in one message. Each read the 63 files of the two BRDs and the SDD (about 584 KB) and returned exactly 12 findings in the schema, each with a Where. They took 30 to 38 minutes and about 420K to 460K tokens each (about 2.2M in all). No reviewer returned zero, so the zero-findings re-dispatch did not run. Merge: 60 raw findings became 39 points (21 findings merged into 15 surviving rows; BO 9, SME 9, PM 6, PA 10, DC 5). The tracker follows tracker-schema.md (LF, no em dash).

**Intake.**
- I1. The skill's default scope did not pick up the LLD. SKILL.md step 1 detects "numbered business docs, BRD chunk folders, SDDs", and an `lld-*` folder is none of these; "Default: the whole chain" does not say whether the chain ends at the SDD. The root README diagram shows the reviewer pointing at the pre-BRD, BRD, and SDD only, which agrees with the detection list.
- I2. The SME domain was inferred from the BRDs (REFUNDS 01: 40 retail branches, refunds to the original card; LOYALTY 01: members earn points on branch purchases) and accepted as the user's confirmation.

**Skill text (panel and merge).**
- K1. reviewer-personas.md universal rule 3 says the schema is "Per `panel-orchestration.md`: Reviewer, Concern (short), Where, Why it matters, Suggested direction", but the schema in panel-orchestration.md names the fields `Why` and `Direction`. A reviewer does not receive panel-orchestration.md, so the rule was adapted to "As given below".
- K2. The SME charter keeps examples from its first project (deposit norms, inspection practice, secondary residents, association boards), and the `[DOMAIN]` placeholder points to "template rules below" that are intake rules for the orchestrator, with a Propifive example. Both were left out of the SME brief. The SME still stayed in the retail domain.
- K3. The BO charter assumes a product sold to customers (pricing, packaging, churn after year one). Here the product is a retailer's own system; the BO turned that into a cost case and a commercial case for the multi-tenant design (BO-08, BO-09).
- K4. Every reviewer returned exactly 12, the top of "5 to 12": the cap may have cut findings.
- K5. Merge rule gaps:
  - "Keep the more senior framing as the primary" defines no seniority. This run used: the finding that covers most of the merged set; ties go to the persona listed first in SKILL.md.
  - SKILL.md step 3 says to record "merged with X-NN" on both sides, but tracker-schema.md lists only the surviving row, so the absorbed side survives only in the raw findings.
  - No rule covers a finding that two different decisions would resolve. Seven raw findings had a second part that belongs to another point (BO-01, BO-10, PM-03, PM-04, PM-08, SME-04, PA-12). They were merged by their main part and noted in the Concern cell as "X part: see ID".
- K6. tracker-schema.md keeps only the short concern and the target docs. Each finding's Why and Direction are gone once the panel ends, so a walkthrough resumed in a new session must rebuild every issue from the tracker. Here the raw findings were handed to the walkthrough agent to stand in for same-session memory.

**What the panel found in the Known gap areas (lineage, §7.3 traceability, contract registries).**
- L1. **Lineage, wrong on both counts.** DC-11 and PA-12 both say the Child LLDs row (LLD 1.1, SDD version 1.2) overstates the LLD's basis. The row is right: the LLD's own 16 §19.1 says it read SDD 1.2, and its Changes Log row 1.1 records the targeted refresh to SDD 1.2. Two things misled them:
  - the LLD was outside the panel's scope (I1);
  - the SDD decision log's last "Child LLDs check" (A2b, before the LLD refresh) still records LLD 1.0 reading SDD 1.0. lld-unifier rewrites only its own row, so that record goes stale by design.
  A lineage check needs both ends: the parent's row and the child's own version record.
- L2. **Lineage, right.** DC-11 also notes that the SDD Changes Log has two rows numbered 1.0 (= C1-5) and that Source BRDs does not show LOYALTY 1.2's In Review status (= S5 and X4).
- L3. **§7.3.** No finding checks a §7.3 row against its homes (owner, entry points, flows, APIs, events). The checkers find §7.3 consistent, so this run cannot tell a gap from a clean area.
- L4. **Registries.** PA-06 (wire format, the in-process event's versioning) and PA-07 (relay ordering, dedup retention) are design findings about the event registry. No finding checks chunk 10 against the 13x Event Models, chunk 11 against the 13x API lists, or the chunk 12 tokens. Of the 50 check_sdd problems (unlinked or unkeyed IDs), the panel reported one (DC-12: an unkeyed UC citation in the 1.1 Changes Log row).

**Overlap with what step 4 already knew.**
- Caught:
  - Figure 3 omits `core_events` (V1 source-chunk item, in DC-04).
  - Doctrine 8 rests on the Proposed ADR-08, and E3 does not cover ADRs (V1, W7; PA-12 and DC-02).
  - Figure 18 against the payout flow (related to C1's Figure 18 item; PA-01 finds it disagrees with Figure 20).
  - The REFUNDS side of the LOYALTY dependency: REFUNDS 08 has no Loyalty Points row (related to X1; PM-07, DC-07).
- Not caught:
  - V1's one wrong statement in chunk 19 (§24.5.2 "the one planned change") and two of its misleading ones (§24.7 = V-1; §24.8.2 publication order);
  - four of C1's five SDD inconsistencies (PII masking vs §19, INT-02 dead-letter vs §17.3, `refund_takeback.refund_reference`, 503 vs 500);
  - T7 (13b's doubled "and reports").
- New beyond steps 2 to 4 (examples): the permanent payout failure end state (BO-03 and three merged findings), take-backs for refunds outside the portal (BO-04 and two merged findings), the receipt number as an unverified cross-product key (PA-03, SME-09, DC-01), the gate scope (PA-12, DC-02), and OI-18 and OI-19 superseded without a note (DC-03).

## W: walkthrough and apply (one background agent playing the skill and the user; 13:23 to about 16:20)

**Result.** All 39 points were presented, accepted as recommended, applied, and set to Applied. The run took about 3 hours, 578K tokens, and 829 tool calls. The 13:17 launch had stopped at its first step on an API safeguard error and written nothing.
- **Files.** 59 changed: REFUNDS 19 of 19, LOYALTY 15 of 19 (not 05, 07, 09, 10), the SDD 24 of 25 (not chunk 19), and the tracker. No file was added or deleted. The LLD and `sdd-marker-decisions.md` were not touched.
- **Write scope.** Clean against the backup, except one temporary file in `/tmp`, which the agent deleted and reported.
- **Log.** `SP\s5-logs\walkthrough-log.md` (278 KB).
- **Tracker.** 39 of 39 Applied. Seven major structural decisions:
  - a sixth refund event, `REFUND_PAYOUT_DELAYED`;
  - LOYALTY take-backs narrowed to refunds paid through the portal;
  - sign-off as a gate (G6) in both BRDs, with REFUNDS back to In Review;
  - REFUNDS Objective 2 narrowed to portal requests;
  - a new use case, REFUNDS/UC-06 View Branch Refund Report;
  - a PII-free paid-refund event for an extracted loyalty-service;
  - a wider E3 in this SDD.
- **Decision pattern.** Most business points became gating open items in the BRDs rather than decided content. REFUNDS 13 went from 1 open item to 32 and LOYALTY 13 from 8 to 18, and both BRD delivery gates are now Shut. The agent asked whether such a point is Applied or Deferred; tracker-schema.md does not say, and it used Applied.

**Protocol.** The log holds 39 point sections titled `Point N (ID): <full concern>`. Each restates the tracker and gives the issue with its location, why it matters, options, and a recommendation. Eight points had first-principles security notes. One breach: on PA-11 the agent made the SDD edits before it wrote the presentation and the answer (Core principle 4, "Never applies a Pending point"); the decision came out the same.

**What the apply phase did to the chain (checkers on the post-W state, against the baseline).** Links stay clean everywhere: REFUNDS 34, LOYALTY 227, SDD 666, 0 bad; SDD-to-BRD 338, 0 broken. The registry checks in check_sdd pass:
- §7.3 entry points against 13x;
- 13x events against chunk 10;
- API IDs against chunk 11;
- permission tokens against chunk 12.
The new use case got its §7.3 row, owner, and entry point, and the new event its chunk 10 rows. Against that:
- A1. **The SDD's lineage tables changed shape.** DC-11's decision added a Status column to Source BRDs and a State column to Child LLDs. The sdd-unifier template defines both tables, and lld-unifier writes the Child LLDs row with six columns.
  - check_uc_keys can no longer read the register: 169 "key not in register" problems, 0 before.
  - check_lld_trace flags the Child LLDs columns.
  - The out-of-date note sits in the new column, not in the form sdd-unifier appends to the SDD version cell ("(out of date: SDD is now vX.X; refresh through lld-unifier)").
- A2. **A status value outside the gate's vocabulary.** DC-03's decision added a "Superseded in part" status to chunk 18. sdd-unifier's E1 accepts only `Accepted - applied`, `Adjusted - applied`, and `Rejected`, so E1 now fails on three open items.
- A3. **Gate rules rewritten inside documents.**
  - PA-12 widened E3 in this SDD only, a local rule beyond sdd-unifier step 8b.
  - BO-06 added a sixth delivery gate condition, G6 (sign-off), to both BRDs, beyond brd-unifier's G1 to G5.
  - The e2e gate line now reads "Shut - Stale" with E4 unmet, which is honest. But chunk 19 was left as it was: check_e2e finds 9 problems (Counts 7 vs 8 events; no edge for `REFUND_PAYOUT_DELAYED`).
- A4. **Versions deferred.** SKILL.md step 7 bumps versions only in verify. Until then the SDD read "1.2" over changed content, against its own master VERSIONING rule ("bump on any chunk update"). For three hours, "LLD 1.1 read SDD 1.2" named two different SDDs.
- A5. **The child LLD is now behind, and only a note says so.** check_trace went from 5 to 11 problems:
  - the REFUNDS/UC-01 entry point became `POST /v1/receipt-lookups` (PA-10), while the LLD still has the GET route;
  - REFUNDS/UC-06 has no LLD block;
  - the LLD index order no longer matches §7.3.
  The skill has no step that hands off to lld-unifier.
- A6. **ID hygiene.** check_sdd went from 50 to 66 problems, all of the known unlinked-or-unkeyed class. Most are in new decision-log records (bare `UC-NN` and `NFR-NN` without their key, and keyed IDs without a link); one is in a body chunk (03 Summary: an unlinked REFUNDS/UC-06).
- A7. **BRD language.** The new BRD open items and LOYALTY decision-log records cite SDD internals: API-04, CL-NN, look-up limits of 10 a minute and 50 a day. These are references, not requirements, but brd-unifier's reviewer flags technical language in the business text.
- A8. **Delivery chunks Stale, not refreshed.** BRD chunks 15 and 16 and SDD chunk 19 were marked Stale with refresh items. Their own gates forbid writing them while shut, and the skill's "apply chain-wide" does not say what to do with gated chunks.

**Skill text (walkthrough), as the agent reported it.**
- The walkthrough order is "the user's choice" (panel-orchestration.md merge rule 4), but no file says whether to ask.
- The tracker restatement is a "compact table" in the contract and a single line in the worked example.
- "Security-related" is undefined.
- Applied or Deferred for a point that becomes a gating open item.
- "Chain-wide" against document gates, and whether the child LLD is in the chain.
- Versioning deferred to verify against the documents' bump-on-change rules.
- Whether each document's own decision log must also carry the decision.
- No rule for changes to structures other skills own: E3, chunk 18 status values, the lineage table columns, the E4 reconciliation.
- "Major structural decisions" is a judgement call.
- Go-live and launch gates have no home in the BRD template.

## V1: the verify phase's remnant hunt (fresh read-only agent, the apply-and-verify.md brief verbatim; about 16:28 to 16:55)

**Result.** Score 8/10. 26 remnants: 1 High, 5 Medium, 20 Low. It took 28 minutes and 591K tokens, and wrote nothing (RUN identical to the post-W snapshot). Report: `SP\s5-logs\verify-report.md`.
- **High.** The SDD §1 summary still says an extracted loyalty-service consumes `REFUND_PAID`, against PA-08.
- **Medium.**
  - R-03 still names the purchase reference;
  - "push notifications in the mobile app" survives in 13a and 13c after the no-native-app decision;
  - none of the three documents records the review in its Changes Log or version (= A4);
  - the REFUNDS mockup rows do not carry the new states and the registration screen;
  - the LOYALTY step 1 evidence still says chunk 13 has no open item.
- **Low.** Dated records, register rows, and restated defaults. One is the 18 GATES note naming only "Superseded" while three items read "Superseded in part" (= A2).

**What it does not look at.** Its brief hunts stale remnants of the decisions. It does not check that a structure still follows the template that owns it. It called the Source BRDs and Child LLDs rows "right" although both tables now have a column the sdd-unifier template does not (A1), and it does not test the gate conditions against the owning skill's vocabulary (A2). It caught the missing version bumps only as a stale remnant (M3).

## V2: the rest of verify, then version and close (fresh agent playing the skill; 16:56 to about 17:40)

**Result.** 24 of the 26 remnants were confirmed and fixed. While confirming L13 it found one more (13b "Retry for one day") and fixed it. M3 was handled under versioning. Two were rejected:
- L20, a Stale banner in chunk 19: its GATE header forbids writing it while the gate is shut;
- the optional dedup note.
- **Tracker.** It now has both blocks (Verification pass 8/10, one line per fix; Versioning).
- **Versions.**
  - REFUNDS 1.0 to 1.1 (master and 00-14; 15 and 16 keep "1.0 (baselined)").
  - LOYALTY 1.3 for the master, the decision log, and the 11 chunks the review changed; 05, 07, 09, and 10 keep their versions, and 15 and 16 stay at 1.2.
  - SDD 1.3 (master, decision log, 00 to 18; 19 stays 1.2).
  - Each has a Changes Log row naming the review and the tracker.
- **Files.** 55, all inside the three reviewed folders and the tracker; nothing renamed. It took about 45 minutes and 684K tokens. The record is `SP\s5-logs\verify-log.md`.
- **Write scope.** Three temporary files outside the scope, all deleted at once and reported: one in `s5-logs`, two in `/tmp`.
- **Side effect it reported.** The LLD now cites the old 13b label "Retry for one day", one more place where the LLD is behind.

**Skill text (verify), as the agent reported it.**
- Versioning checklist item 1: "every edited doc" could mean the document or the chunk. It does not say what to do with baseline-versioned or gated chunks, the bump size, or Reviewed By and Approved By in the new row.
- Item 3's note about citations staying valid is tied to renames.
- The changelog lives in chunk 00, not in "each edited doc header".
- SKILL.md §6 says remnants "of the structural changes"; the brief says "all decisions".
- "Fix what it finds" vs "Fix every confirmed remnant", and nothing covers remnants found while confirming.
- tracker-schema.md shows the Verification pass as one line, while apply-and-verify.md asks for a line per fix. No rule covers re-scoring after the fixes.
- Whether a verify fix that marks a supersession must annotate both sides.
- Whether verify fixes extend a row's Target doc(s).
- "Mark Stale" against a chunk whose gate forbids writing it (L20).
- Whether step 7's "files touched" means the whole session or verify only.
- Two possible fixes for one remnant (L8).

## Checks on the final state (2026-10-01 17:45; the saved copy gives the same results)

| Check | `run-2026-10-01-e2e` | `run-2026-10-01-review` |
|---|---|---|
| Links: LLD (check_links, _linkcheck) | 512, 0 broken | 512, 0 broken (LLD unchanged) |
| Links: REFUNDS, LOYALTY, SDD (_linkcheck per folder) | 25, 185, 519, 0 bad | 35, 234, 670, 0 bad |
| check_uc_links (SDD to BRD) | 260, 0 broken | 340, 0 broken |
| check_uc_keys | 0 | 166: the Source BRDs register gained a Status column, so no key is found in it (A1) |
| check_lld_trace lineage | 1 (`Angular web app`) | 3: plus the seventh Child LLDs column, and no out-of-date note for SDD 1.3 in the SDD version cell |
| check_trace | 5 (routes) | 11: the LLD is behind the SDD (UC-01 entry point, UC-06, index order, two `@UseCase`, 06 §9.1) |
| check_sdd | 50, 83 markers | 68, 74 markers (unlinked or unkeyed IDs; no registry-class problem) |
| check_e2e | gate met, `Open - Up to date`, 5 problems (V-1) | gate not met: E1 fails on 5 `Superseded in part` OIs; E4 reads met because the check compares dates and the review ran on the same day; line `Shut - Stale`; chunk 19 at 1.2 with 9 problems (Counts 7 vs 8 events, no `REFUND_PAYOUT_DELAYED` edge, V-1) |
| check_mermaid | LLD 43/0, SDD 30/6, LOYALTY 2/0 | the same (no block added or removed) |
| list_flags, check_refs | 21 TODO, 40 Confirm; 182 refs, 0 | the same |
| Em dashes, CR bytes (counted with Python; Git Bash `grep $'\r'` cannot see CR) | 0, 0 | 0, 0 (all 88 run files and the step 5 logs) |

**diff_runs against `run-2026-10-01-e2e` (levels 2).**
- **Size.**
  - REFUNDS 33.5 KB to 104 KB (open items 1 to 32);
  - LOYALTY 136 KB to 187 KB (open items 8 to 18);
  - SDD 415 KB to 515 KB (markers 83 to 74, links 519 to 670);
  - the LLD is unchanged.
- **Removals, all from decisions or reshaped tables:**
  - the SDD Source BRDs and Child LLDs headers (A1);
  - the chunk 10 per-producer event-table headers, which gained a `Final` column (PA-06): a registry table changed shape;
  - the REFUNDS 02 Dependencies header (BO-05) and a new Legal clearances table (BO-07). Neither follows brd-unifier chunk 02, which has `Dependency | Type | Owner | Status | Notes` and no legal section;
  - `REFUND_PAID` in SDD 17 (PA-08);
  - the unkeyed UC IDs in SDD 00 (DC-12).

**Checker notes for step 6.**
- check_e2e's E4 compares dates only, so a change on the reconciliation's day passes.
- check_e2e prints set items in a varying order.
- check_uc_keys reports "key not in register" when it cannot read the register at all; it should say so.

## Summary of the evidence for the Known gap

**Detection.**
- The default panel raised lineage on its own (DC, PA) but read it wrong: the LLD was out of scope and the SDD decision log's last check is stale by design (L1).
- It left §7.3 alone (L3).
- It treated registries at design level, not consistency level (L4).

**Apply.** The walkthrough kept links, §7.3, and the registry cross-references consistent. But it changed structures that sdd-unifier, brd-unifier, and lld-unifier own, and their checks now fail:
- lineage tables (A1);
- a chunk 10 registry table;
- the BRD 02 dependency table;
- chunk 18 status values (A2);
- gate conditions (A3).
It deferred version bumps against the documents' own rules (A4). It left the LLD behind, and the e2e gate and three delivery chunks Stale, with no hand-off to the skill that refreshes them (A5, A8).

**Verify.** The remnant hunt looks for stale text only, so it passed the reshaped tables.

## The Known gap decision: option (c), implemented 2026-10-01 (uncommitted)

The user chose (c): hand chain integrity to the owning skills. What changed is listed in `UNIFIER-ENHANCEMENTS.md` § Step 5, "Option (c) as implemented".

A read-only consistency check of the change found:
- (A) Wrong or contradictory, 4 items:
  - the verify pass could rewrite lineage rows the review must leave to the hand-off;
  - the both-sides supersession rule clashed with the owners' single-home decision logs;
  - the BRD Stale marks missed the master's Delivery Chunks State cell, which lld-unifier reads first;
  - the review's Changes Log row did not name the chunks it changed, which the LLD refresh needs.
- (B) Ambiguous, 15 items. Among them:
  - whether the review may edit an LLD (now never);
  - what a review session is (one tracker);
  - versions for business documents no skill versions;
  - when a hand-off row is Done;
  - an absolute ban on editing gated chunks;
  - templates for combined documents;
  - file renames against lineage links;
  - which LLD request follows a BRD change (both, when use cases, test cases, or screens changed);
  - empty-argument detection;
  - lineage points and the owner's open items;
  - the new-use-case rows, `BR-n` and `AC-n` order, and merged rows;
  - the BRD's business language;
  - several changed BRDs in one request;
  - B15: the pre-BRD scope.
- (C) Cosmetic, 12 items.

All are fixed except:
- B15 is held for the user: the README and Band files put the pre-BRD in the reviewer's scope, but the skill's Intake does not list it. This predates (c).
- C11 (= K1) goes to step 6.
- A3 also showed that brd-unifier's own Stale rules omit the master's Delivery Chunks State cell (step 6).

The change has not been run yet. Step 6's chain rerun should repeat this review under the new rules and check:
- no template structure changes;
- one version bump per document;
- a Hand-offs block;
- that the hand-offs, run in order, leave the checkers as clean as before the review.

**B15 decided (2026-10-01): option A, with the pre-BRD optional.** The reviewer's Intake lists a pre-BRD when the project has one and never mentions it otherwise. pre-brd-unifier has no version, changelog, decision log, or update request, so a pre-BRD:
- keeps its template and takes Answer-cell changes only, with sourced figures and derived values recomputed from `frameworks.md`;
- keeps its investor verdict (chunk 23), which the close-out notes predates the change;
- gets nothing added to it (the tracker's Versioning block lists its changed chunks);
- reaches the owner of a BRD made from it through that BRD's "update the todo" row.
