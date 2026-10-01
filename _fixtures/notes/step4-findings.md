# Step 4 findings log (for the step 4 report and step 6)

## B1: LOYALTY delivery gate and chunks 15-16 (brd-unifier, simulated PM; 2026-10-01 05:27 to about 08:40)

Result: LOYALTY v1.0 -> v1.2 (cover "In Review", OI-08); to-do steps 1-5 Complete with evidence; G1-G5 Met; chunk 15 (4 tasks, 2 waves: TASK-01 record points earned and taken back, TASK-02 own points only, TASK-03 balance (UC-01, LP-01), TASK-04 history (UC-02, LP-02)); chunk 16 (31 cases: TC-ACC-01..04, TC-BAL-01..04, TC-HIS-01..07, TC-PTS-01..07, TC-UIX-01..04, TC-NFR-01..05; P1-P8); chunk 17 not written. decision-log.md created (back-filled OI-01). Mockups LP-01, LP-02 Approved with a test-fixture confirmation; Figure 1 use-case diagram (05), Figure 2 UC-02 flowchart (06a; UC-01 skipped, fewer than 3 steps).
- BRD content changes (affect the SDD): grill-me TD-01..16 (earning in scope; sign-in from the existing loyalty account, out of scope; Refunds Portal row in 08; take-back when the refund is reported paid; whole euros only; same-day POS reporting a dependency; UC-01 A1/AC-2, E1/AC-3; UC-02 A1, E1/AC-5, step 4 detail, AC-3/AC-4; POS Records defined; NFR-01 complaint measure; UC-02 BR-3 partial refunds with top-up; NFR-02 from the later event; movement dates; no 0-point movements). Accepted OI-02..09: NFR-02 counts from the Refunds Portal report; new UC-02 BR-4 (a refund reported before its purchase is kept); new NFR-03 (earned points show within 1 hour); UC-02 A2/AC-8 (empty history); POS Records and Refunds Portal as supporting actors; cover In Review; late POS report not counted against NFR-01.
- Consistency check: 13 runs (CF-01..CF-36) before it stopped; no stop condition (same as step 3 A1). Strong case for a design fix.

Skill issues reported:
- G1 grill-me/SKILL.md only says to call the Skill tool with "grilling" (indirection; a non-Skill-tool runtime must read grilling/SKILL.md). The fixture to-do had no step 3 inputs or prompt (rebuilt from the chunks/14 skeleton).
- G2 = A1 (step 3): consistency reruns have no stop condition (13 runs here).
- G3 delivery-chunks.md Step 3 "apply through the step 8 mechanics (OI status, Resolution Log, Changes Log)" vs § Special cases "a decision with no OI gets its own TD-NN row".
- G4 Changes Log rows: § Refresh triggers "one minor step per run, one row" vs SKILL.md step 8.3 "once for the batch" (one run applied two batches; one 1.1 row used).
- G5 no rule for the cover Status and Date after a post-approval change (surfaced as CF-01, resolved by OI-08 "In Review").
- G6 chunks/14-todo.md step 5 row statuses (Skipped, Pending gate, Drafted, Provisional, Final) have no value for "gate met, not yet drawn".
- G7 two definitions of "Locked": chunks/14-todo.md "gate shut, never generated" vs chunks/brd-master.md "the file does not exist yet".
- G8 a missing NFR target: a missing fact (to-do row holding the gate) or a business choice (OI-04 added NFR-03 at 1 hour)?
- G9 "Corrected" vs needing confirmation: whether an earlier confirmed decision counts as confirmation for completing text (CF-07, CF-09, CF-13).
- G10 the non-content-change list does not mention editorial rewording (Figure 2 Summary rewritten after Run 6 without a recheck).
- G11 chunk 16 wave rule when a case names tasks from different waves (CF-14 named the later-wave task in Related Task).
- G12 delivery-chunks.md § Citing the source precisely says citations always carry a short label; the chunk 16 skeleton's Related UC format (`UC-04 (E1, AC-3)`) has none.
- G13 figure captions: chunk 05 skeleton `### Figure N` heading; chunk 06a skeleton gives no caption format.
- G14 principle 16 asks the key color once; the fixture BRD never had one, so the step 4 brief says "chunk 11 names no colors".
- G15 chunk 16 points to a reference file outside the skill folder (`PricePulse/brd-pricepulse/uat-bat-test-cases.md`), unreachable: a broken external reference in the skill.
- G16 MK-NN rule ("the BRD never defines its own screen IDs") vs LP-01/LP-02 kept by instruction (fixture staleness; step 6 decision).
- G17 fixture quality: the old to-do claimed steps 1-2 Complete with no register and "0 findings" despite C7 gaps; template gaps left (master off-skeleton, 02 without Facts/Challenges, 10 non-template columns, 11 missing items, 13 without coverage record and OI-01 block).

## A1: proposals for the 25 E3 markers (read-only architect agent; done 06:20)

- File `s4/sdd-marker-decisions.md`: CL-01..CL-25 with options, Recommended Answer, Why, Linked, Registry impact; apply order and "after applying" notes; follow-ups for the BRD, data protection, security owners, CardPay and POS Records.
- It read LOYALTY v1.0 (as registered in the SDD); its section "LOYALTY v1.1 draft found during this run" adjusts CL-18, CL-20, CL-21, CL-23 to the 06:14 draft. B1 kept changing LOYALTY until about 08:40 (v1.2: BR-4, NFR-03, A2, movement dates, 0-point rule, take-back on the Refunds Portal's paid report), so the 13d answers (CL-18..CL-25) must be re-proposed after the SDD takes LOYALTY v1.2.
- CL-09 is the one real design change (payout keeps retrying every 6 h after PAYOUT_FAILED; FAILED no longer final). CL-01 ratifies the 7 payload contracts as committed 1.0.0 with amendments. CL-02 leaves Keycloak per-tenant admin limits to the LLD (uncertain).
- Applying the answers changes chunks 10 and 11, so step 6a must be rerun before E4 holds.

## A2a: "BRD LOYALTY has a new version" (sdd-unifier; 2026-10-01 09:35 to 10:07, 32 min)

Result (verified against the pre-run backup and check_e2e.py): SDD v1.0 -> v1.1; register LOYALTY 1.2; Child LLDs row "1.0 (out of date: SDD is now v1.1; refresh through lld-unifier)"; 19 SDD files changed (02, 13a, 13b, 13c, 18 unchanged); nothing written outside the SDD; step 6a clean (465 links), Reconciled 2026-10-01; no OI added; gate still Locked on E3 with 23 markers (10:1, 12:1, 13a:6, 13b:5, 13c:4, 13d:6). LOYALTY v1.2 answered two 13d markers (cents rounding; partial take-back). Two non-gate markers added: 01 §3 assumption 3 (how the existing loyalty account reaches the `member_id` claim) and 15 §19 (how UAT stages P5, P6, P8). Bracketed markers SDD-wide 106 before and after. 0 em dashes, LF.
- Delta applied: whole-euro earning and no 0-point movements (new `MemberPurchase` record, `no_points` count), movement dates, BR-3 partial take-back with a lock on the purchase reference, BR-4 pending take-backs never expire (replaces the next-day `NO_EARN` close), UC-01/UC-02 E1 and the new ACs, step 4 detail, NFR-01 redefined, NFR-02 from the later report, new NFR-03 (import every 15 minutes, earn-lag metric, alert after two failed runs), LOYALTY 08 Refunds Portal row mapped to the in-process `RefundPaid`, BR-1 labels, LOYALTY UAT prerequisites in 15 §19. OI-18 and OI-19 kept `Accepted - applied`, with superseding decision records.

Skill issues reported:
- S1 = C1 (reproduced): SKILL.md step 10 "mark chunk 19 Stale" is unconditional; step 8b.2 marks Stale only when chunk 19 exists (the run kept Locked).
- S2 the reviewer is mandatory in SKILL.md step 7, but the step 10 update row and brd-to-sdd.md § Changes after the SDD exists omit it, and parts-mode.md reruns it only on request (the SDD counterpart of L1).
- S3 chunking.md "chunk 18 is never authored by the same context that wrote the SDD" vs brd-to-sdd.md (use-case traceability rule 7, cross-BRD reconciliation) having the author raise OIs.
- S4 SKILL.md step 1 skips the mode prompt only for an SDD "in progress"; read literally, a finished SDD would be asked again.
- S5 no rule for a source BRD whose cover is "In Review" (an unsigned version); the only gate is the master's part status (brd-to-sdd.md § Source BRDs rule 1).
- S6 brd-to-sdd.md § Field mapping "each external dependency becomes an Integration row" vs the part 1 checklist "every §12 row owned by a service": the member sign-in dependency went to 01 §3 plus a marker instead of an INT row.
- S7 = step 2 item 7 / C7 (reproduced): Child LLDs scope "Angular web app" is not a §13 row; brd-to-sdd.md § Child LLDs rule 2 has no marker for it.
- S8 = C5 (extended): no rule on reopening an OI whose applied design a BRD change overturns (step 8b.4 mentions "reopened OI"); decision-log.md has no section for markers a BRD update answers, and its "who decided" field does not fit a BRD-driven change (the run used superseding records and a new "LOYALTY v1.2 update clarification register").
- S9 "re-check every cited BR-n against its label" does not say whether a label that still loosely fits follows a reworded rule (the run updated content chunks, left chunk 18 and the decision log).
- S10 = version-bump family (A7, C2, D3, L4): minor vs major not stated (1.1 used; VERSION bumped only in changed chunks, per the master's VERSIONING comment).
- Also: SKILL.md step 5 Mermaid parse validation not done (brief: read only).

## A1b: answers re-checked against SDD v1.1 and LOYALTY v1.2 (read-only architect agent; 10:10 to 10:31)

Result (verified: the first 95,989 bytes of the decisions file are unchanged, the SDD is unchanged): section "Update after LOYALTY v1.2 (SDD v1.1)" appended at line 951 of `s4/sdd-marker-decisions.md`, with a count table, a mapping, four replacement entries, and an Apply list of 23 rows (one per marker) plus apply rules and order. All 23 markers match an earlier entry word for word: 19 kept, 4 changed (CL-19, CL-21, CL-22, CL-25), 2 retired (CL-18 earning rule and CL-20 partial take-back, answered by LOYALTY v1.2), none new. No registry row added; wording edits to 10 §14.10 (`RefundPaid` Notes), 11 API-04, 12 §16.8 item 4.
- Design call to report to the user: CL-19 matches a paid refund to its member purchase on the receipt number that POS Records sends with each purchase (API-04). Rejected option C (refund-service carries the LOYALTY purchase reference in `RefundPaid`) follows LOYALTY 08's wording literally but changes the `RefundPaid` contract and brings a LOYALTY identifier into refund-service. Accepted per the user's accept-all rule.

Inconsistencies it found (for step 6):
- X1 cross-BRD (from B1): LOYALTY 08's new Refunds Portal row says the portal sends the member and the purchase reference, but REFUNDS v1.0 holds neither. A2a's cross-BRD reconciliation raised no question (it only kept the 13d marker on purchase reference vs receipt number), so brd-to-sdd.md § Cross-BRD reconciliation missed half of a data dependency gap.
- X2 SDD 13d after A2a: a take-back record is kept "as long as the movement it created", but a 0-point take-back has no movement and still counts toward BR-3's refunded total (LOYALTY TC-PTS-04); the purchase lock and §14.10 assume purchase reference = receipt number, and with `NO_EARN` gone a mismatch leaves take-backs pending forever with no alert; the rejection table has no `id` (Figure 24 shows one) and a NOT NULL `purchase_reference` that would stop the import run instead of rejecting the record; Figure 24 omits `tenant_id` from the take-back key; `reported_at` is nullable though the earn-lag metric needs it (CL-19, CL-21, CL-22 fix these). A2a's targeted update introduced these and nothing in the update path re-checks them (the reviewer is skipped, S2).
- X3 = S8: chunk 18 OI-18 and OI-19 still show their v1.0 answers with no pointer to the 2026-10-01 superseding records.
- X4 = S5 / G5: LOYALTY v1.2 is In Review with no approver on its 1.1 and 1.2 Changes Log rows; its master still shows Part 1 completed 2026-09-24.

## A2b: decisions applied, gate opened, chunk 19 written (sdd-unifier; 10:33 to 11:09, 36 min)

Result (verified against the post-A2a snapshot and the checkers): SDD v1.1 -> v1.2; all 23 Apply list entries applied (one Changes Log row, 23 Clarification register records, no ADR, no OI); step 6a clean (519 links), Reconciled 2026-10-01; gate E1-E4 met, gate line `Open - Up to date`; chunk 19 written (Figures 26-30, Tables 25-27) and linked from the master; Child LLDs note now names v1.2. Changed: 00, 01, 04, 07, 08, 09, 10, 11, 12, 13a-13d, 14, 16, decision log, master; new 19; unchanged 02, 03, 05, 06, 15, 17, 18. Nothing outside the SDD. Bracketed markers SDD-wide 106 -> 83 (gate chunks 0; 4 `TBD - EXTERNAL` in 11 do not block). 0 em dashes, LF.
- Checkers on the SDD: check_e2e E1-E4 met, chunk 19 consistent on counts, §24.1, §24.5 (every event and consumer, the `in-process:` edge), §24.2, §24.8, no restated registry; 5 problems, all one issue (V-1 below). check_uc_links and check_uc_keys 0 problems. check_mermaid 30 blocks, 6 over the ~30-line guideline (19 Figure at line 79, 41 lines). check_sdd 50 problems (baseline 37): the known class (unlinked or unkeyed IDs in chunk 18 and the decision log, step 2 item 1) plus the 1.1 Changes Log row (00:39) and two content-chunk lines A2a wrote (03:22 Figure 1 Summary `REFUNDS/UC-04`, 14:25 §18.2 `LOYALTY/UC-02`), all unlinked.
- Chunk 19 Counts at a Glance: Services 4, Topics 2, Distinct published events 7, In-process domain events 1 (row added), Synchronous HTTP edges 4 (all external), In-process port calls 0, Sagas documented 2.

Skill issues reported or found:
- V-1 chunk 19 §24.7 lists the four External outbound contracts as synchronous edges and counts them ("Synchronous HTTP edges 4"); the template frames §24.7 as service-to-service, and SKILL.md step 8b E3 says external systems appear at the system-context level only (the chunk's own Faithfulness list says the same). The template does not say what §24.7 holds when every §15.2 contract is external. check_e2e flags it.
- T1 no home for user decisions on inline markers outside parts mode: SKILL.md step 8.3 is written for OIs (the run used the decision-log Clarification register).
- T2 step 10 "leaving the rest untouched" vs principle 10 back-fill: three back-fills made (04 §8.1.2, 01 Glossary, 16 §20.1.9), but ADR-01's "one-day retries", the Figure 20 Summary, and §15.6 were left as is. Checked: 06 ADR-01 still says "one-day retries" and "one-day retry loops" while 13b now retries after the window until paid (CL-09); the wording is stale but its failure-isolation rationale still holds, so this is cosmetic, not a contradiction.
- T3 E4 compares dates only: the reconciliation and the edits share 2026-10-01; same-day order lives only in the decision log.
- T4 the Child LLDs out-of-date note: the rule says "append"; the run replaced the v1.1 note with a v1.2 one.
- T5 chunk 19 template gaps for a hybrid: no Counts row for in-process domain events (the run added one); "24.5.2 Phase 2+" kept as "Not applicable for this release"; no rule for chunk 19's VERSION.
- T6 Mermaid validated by reading only (brief); Figure 29's `else ... at the end of the retry window` label contains "end" (Figure 7 uses the same construct).
- T7 decisions applied not quite as written: bare IDs made keyed links (CL-06), an embedded edit instruction (CL-14), "(CL-22)" replaced by "(Retention Policy)" (CL-21); CL-09 applied verbatim left 13b What with two "and reports" (a wording defect from the decisions file).

## V1: chunk 19 faithfulness review (read-only agent; 11:15 to 11:32)

17 mismatches in chunk 19 (by its own per-item labels: 1 wrong, 3 misleading, 13 cosmetic; its summary line miscounted 4 and 12). All 5 Mermaid blocks valid by reading; all 9 links resolve. Consistent: §24.1 to §24.3 deployables, modules, databases, Kafka, gateway, Keycloak, external systems; §24.5.1 against §14.5 and the DLQ names; the saga steps, events, API IDs, states, and use-case lines; the §24.7 "why synchronous" claims; the pointer sections.
- Wrong: 19:152 §24.5.2 calls the loyalty-service extraction "the one planned change"; ADR-01 makes it a conditional trigger, and two other conditional changes exist (ADR-01 assumption 11 reopening ADR-01/ADR-02; ADR-10 notification-only topic). A new claim the source chunks do not make (FAITHFULNESS_RULE).
- Misleading: (1) = V-1, §24.7 and "Synchronous HTTP edges 4" (it agrees with check_e2e: 0 edges, a "None" §24.7 pointing to §15.2); (3) 19:45 "external systems appear at system-context level only" while the chunk draws them in §24.3, §24.7, and both sagas; (5) 19:239-245 §24.8.2 puts the `RefundPaid` publication completion after the import steps, but it completes when the listener commits and the import runs later on its 15-minute schedule (§11.1, 13d, §8.5.3 has it right).
- Cosmetic: "so no synchronous chain exists" vs §15.5 "no chain deeper than one hop"; simplifications not in the no-silent-caps list (in-window retries in §24.8.1, the member read in §24.8.2, DLQs and labels in §24.3); "drawn only ... (and in ...)"; payout watchdog wording vs §17.1; `RefundPaid` "never reaches the broker" cited to §14.10 instead of §14.7; §24.4 "per-consumer queue" (consumer groups, no queues); the DLQ naming rule restated from §14.4; doctrine 4 "every event edge" (broker events only); doctrine 8 homed in ADR-08, which is Proposed with an open marker; §24.1 Archetype and Phase have no source column; saga participants not verbatim (`RefundPaid` listener, `loyalty-purchase-import`); §24.3 Summary "its own API contract" (the core uses API-01 and API-04); Sources and DEPENDS_ON omit 02, 03, 06, 07, 08, and §8.2.

Template and SKILL.md ambiguities (for step 6):
- W1 §24.7 scope: external contracts in or out; the direction of the 8b.3 "every sync edge against §15.2" check; "system-context level" as a location or a level of detail; what §24.7 and the Counts say with no service-to-service edge. V1's reading: §24.7 holds Internal and Internal (in-process) contracts only; the 8b.3 check runs from §24.7 to §15.2; "system-context level" means named black boxes with API IDs and no contract fields.
- W2 NO_DUPLICATION_RULE vs the required diagrams: §24.2/§24.3 overlap §8.2/§8.3, §24.5 overlaps §14.2.2 Figure 10 (which draws every edge in a small system), §24.8 overlaps §8.5; no rule to reference an existing figure and draw only the difference.
- W3 §24.1: archetype vocabulary undefined and without a source column in chunk 09; phase per service has no home in §13; "key family" in the comment but not the table.
- W4 Counts at a Glance: no in-process domain events row (= T5); the scope of "Synchronous HTTP edges" unstated.
- W5 "24.5.1 Phase 1 Core" collides with the hybrid core deployable's name.
- W6 fixed wording that breaks for an in-process edge: §24.4 "per-consumer queue"; §24.9 "guarantees every edge inherits: §14.6" (§14.6 excludes in-process events).
- W7 FAITHFULNESS_RULE names only 09-13x as sources, but §24.2, §24.3, §24.6, §24.8 need 02 and 04-08, and E3 does not check those chunks, so a Proposed ADR with an open marker can become a doctrine's home.
- W8 §24.8 "load-bearing cross-service flow" has no selection criterion; in-process module flows unclear.
- W9 mermaid-diagrams.md: the ~30-line rule does not fit layered views (§24.3 and §8.3 are 41 lines); no convention for async arrows in sequence diagrams (template `--)`, chunk 05 `->>`).

Source-chunk problems found (not chunk 19): §17.1 Submit re-reads the receipt through API-01 (13a:42, 13a:350) but §8.5.1, §12 INT-03, and §15.3 mention steps 1-2 only; §8.3's core DB label (04:70) omits `core_events`; §14.2.2 Figure 10 draws every edge.

## C1: "lld-unifier chunks: refresh the trace" (lld-unifier; 11:15 to 12:25, 70 min)

Result (verified against the pre-run backup and the checkers): step 3c found SDD v1.2 against the recorded v1.0 and offered a targeted refresh (accepted); the run treated "refresh the trace" and "the SDD has a new version" as one targeted regeneration, one step 6a, and one bump. LLD v1.0 -> v1.1; 21 files changed (00 to 16, the four 04 files, the master; 17 and 18 unchanged at 1.0); outside the LLD only its Child LLDs row changed (now `1.1 | 1.2`). The brief did not mention LOYALTY chunk 16; step 3b found it on its own. LOYALTY trace: UC-01 cites 9 test cases, UC-02 22 (31 in all, 30 automated, TC-NFR-02 not), 13 §16.8 rows and tags, 16 §19.9 test-case cells, §19.1 records SDD 1.2, LOYALTY 1.2 (In Review), and LOYALTY BRD 16 Up to date. Design taken from SDD v1.1 and v1.2 into 01 to 16 (post-window payout retries, receipt-number match and lock, BR-3 take-back calculator, BR-4 pending take-backs, whole-euro earning, 15-minute import, retention and erasure jobs, `claimed_until` lease, committed contracts, §14.6 rule 4, 5-minute replay, pinned DTO fields). Flags 29 TODO / 37 Confirm -> 21 / 40; OQ-01, OQ-03, OQ-04, OQ-07 settled. 512 links, 43 Mermaid blocks, 0 em dashes, LF.

Skill issues reported:
- C1-1 (step 2 em dash item, reproduced): SKILL.md step 2 says "Ask exactly this question", and the question holds em dashes that CLAUDE.md forbids (the run used colons).
- C1-2 = L1 and L5 (reproduced): the refresh rows skip the mandatory step 7 review, so chunk 18 was not refreshed; OI-09, OI-10, and part of OI-14 are now overtaken by SDD v1.2 and no rule retires LLD open items an SDD change settles.
- C1-3 step 6b (Specs) is "mandatory" but not in the refresh rows, and the field mapping table maps nothing to chunk 17.
- C1-4 step 3c "name the SDD chunks they changed", but the SDD Changes Log names sections; SDD chunk headers 03, 06, and 17 read v1.1 while the 1.1 row names no section in them.
- C1-5 the SDD Changes Log has two rows reading 1.0, so an LLD written between them could not be placed (version-bump family).
- C1-6 = S7 / C7 (reproduced): Child LLDs "Scope (§13 services)" header vs the value rule "§2.1 In Scope" (sdd-to-lld.md § SDD lineage).
- C1-7 LP-01 and LP-02 are both BRD screen IDs (06a UI/UX) and chunk 14 Mockup coverage rows; sdd-to-lld.md gives each kind a different link target with no precedence (related to G16 and the step 2 screen-link item).
- C1-8 = step 2 "Direct lift vs one fact, one home": the 10 §13.1 configuration table needs concrete SDD defaults (PT6H, the 15-minute cron, PT5M).
- C1-9 version family: lld-master.md VERSIONING "all chunks share the LLD version" vs "bump the updated chunk(s)" (17 and 18 read 1.0 in a 1.1 LLD).
- C1-10 no counting method for the §18.5 High column.
- Run hygiene: after a context compaction the run read its own subagent transcript (under `~/.claude/projects/`) to recover the v1.0 text; it read no other transcript. Future briefs should say whether that is allowed.

SDD inconsistencies it found and left (6a.2 says never resolve them in the LLD): §17.1 and §17.4 mask PII "in non-production data" while §19 says production data never leaves Prod; §12 INT-02 "dead-lettered after the attempt limit" vs §17.3 only `FAILED`; 13d `refund_takeback` has no `refund_reference` (the LLD adds it with a Confirm); §17.4 answers 503 for a database outage, §17.1 answers 500; Figure 18 `RETRY_SCHEDULED -> FAILED` vs §17.2 failing a payout from SENDING after the window.

## Checks after C1 (2026-10-01 12:30)

All on `s4`, then again on the saved copy `_fixtures/chain/run-2026-10-01-e2e/` (87 files, identical, LF):
- check_links 512 links, 0 broken; _linkcheck 512, 0 bad, no flags; check_uc_links 260 BRD links, 0 broken; check_uc_keys 0; check_refs 182 references, 0 problems.
- check_lld_trace: the same two known items as run-2026-09-30 (`REFUNDS/UC-010` template example; `Angular web app` scope); `Pending (BRD 16 not written)` 8 -> 0.
- check_trace: 5 problems, the same route problems as run-2026-09-30 (step 2 item 5); the LOYALTY test cases pass in the 04 lines, the §19.9 index, and §16.8 (the 5 LOYALTY problems before C1 are gone).
- check_e2e: E1 to E4 met, E3 0 markers, gate `Open - Up to date`, chunk 19 consistent except V-1 (5 problems, one issue).
- check_sdd: 50 problems (37 in run-2026-09-30; see A2b), 83 markers.
- check_mermaid: LLD 43 blocks, 0 issues; SDD 30 blocks, 6 over the ~30-line guideline.
- list_flags: 21 TODO, 40 Confirm. Em dashes 0 and CRLF 0 in the LLD, SDD, and LOYALTY BRD.
- diff_runs against run-2026-09-30 (levels 2): additions only, except removals that follow decisions: `NO_EARN` (LOYALTY BR-4), `APPROVE_FULL` and `APPROVE_PARTIAL` (the pinned `RefundDecision`, CL-06), `LP-02` and `RETRY_SCHEDULED` in LLD 15 (settled open questions), `R-03` in LLD 10 (risk narrowed), and two REFUNDS use-case references in SDD 13d (they lived in resolved marker texts). REFUNDS BRD unchanged.

## The 23 answers applied in A2b (Apply list of `sdd-marker-decisions.md`; one Clarification register record each in the SDD decision log)

| # | Entry | Where | Answer applied |
|---|-------|-------|----------------|
| 1 | CL-01 | 10 §14.9 | The seven event payload contracts ratified as JSON Schema 1.0.0, all `committed`, money as decimal strings, with four amendments (`customerContact` conditional, `customerId` tagged `pii`) |
| 2 | CL-02 | 12 §16.6 | A tenant staff administrator in the Keycloak realm administration provisions branch managers with their branch |
| 3 | CL-03 | 13a Payout outcome | The branch manager is told about a failing payout in the portal only (payout-failing list, flag, count); no staff email or SMS |
| 4 | CL-04 | 13a Tables Design | The `refund` columns, constraints, and indexes the rules need; lengths and plan-driven indexes left to the LLD |
| 5 | CL-05 | 13a Retention | Tenant settings `refundRecordRetention` (default 10 years after `closed_at`) and `contactDetailsRetention` (default 30 days) |
| 6 | CL-06 | 13a List of APIs | Business fields of the nine refund-service DTOs; the OpenAPI document adds formats |
| 7 | CL-07 | 13a Poison messages | One consumer rule in §14.6 rule 4: dead-letter at once if never appliable, else 3 retries at 1, 4, 16 s with jitter; pause while the database is down |
| 8 | CL-08 | 13a Compliance | Lawful basis recorded by the data protection owner; a `refund-contact-erasure` job; no certification-specific control |
| 9 | CL-09 | 13b After the retry window | `PAYOUT_FAILED` once at the end of the window, then retries every 6 hours until paid (the one real design change) |
| 10 | CL-10 | 13b Original card | The receipt number identifies the card payment; no card data in any deployable |
| 11 | CL-11 | 13b Tables Design | Payout columns with generic provider columns; indexes; the rest to the LLD |
| 12 | CL-12 | 13b Retention | Payout records follow `refundRecordRetention` from `succeeded_at` |
| 13 | CL-13 | 13b Poison messages | payout-service follows §14.6 rule 4 |
| 14 | CL-14 | 13c Tables Design | Delivery log columns with a claim lease; indexes; the rest to the LLD |
| 15 | CL-15 | 13c Retention | `messageLogRetention`, default 90 days after `final_at` |
| 16 | CL-16 | 13c Poison messages | notification-service follows §14.6 rule 4 |
| 17 | CL-17 | 13c Compliance | Lawful basis from the data protection owner; delivery log erased by age; no certification-specific control |
| 18 | CL-19 (changed) | 13d Take points back | Match a paid refund to its member purchase on the receipt number POS Records sends with each purchase (API-04); lock on the receipt number; reject a member purchase without one (option C, the LOYALTY purchase reference in `RefundPaid`, rejected) |
| 19 | CL-21 (changed) | 13d Tables Design | `loyalty` columns for the receipt number, pending take-backs, and rejections; indexes for BR-3, BR-4, the history, and erasure |
| 20 | CL-22 (changed) | 13d Retention | Ledger and member purchases kept until the erasure job; applied take-backs kept with their purchase, pending ones until applied |
| 21 | CL-23 | 13d List of APIs | Business fields of the three loyalty DTOs |
| 22 | CL-24 | 13d Poison messages | Publication-log replay every 5 minutes, alert at 30 minutes, never stops |
| 23 | CL-25 (changed) | 13d Compliance | Lawful basis from the data protection owner; `loyalty-member-erasure` deletes the balance, movements, member purchases, and applied take-backs; no certification-specific control |

Retired: CL-18 (cents rounding) and CL-20 (partial take-back), answered by LOYALTY v1.2 (03 Earning; UC-02 BR-3). Every value is a design default with a named owner, not a legal or provider fact.
