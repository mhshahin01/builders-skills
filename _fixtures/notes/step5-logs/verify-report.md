## Stale-remnant hunt: REFUNDS, LOYALTY and SDD after the business review

**Chain consistency: 8/10.**

I found 1 High remnant, 5 Medium and 20 Low. All 39 tracker decisions are in their main homes, and the registers, gates and counts check out (listed at the end). What remains sits in secondary text: the SDD executive summary, the risk register, future-enhancement lists, to-do evidence, mockup rows and dated records. None of the three documents records the review in its Changes Log.

Base path for every file below: `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\23e92d30-8ed6-494a-b8a9-6f1c0f209d91\scratchpad\s5\`

### High

**H1.** `sdd-refunds-platform\01-executive-summary-scope-risks.md:28` (§1, "In-process take-back").
- **Stale:** "extracting loyalty-service later means consuming the Kafka event `REFUND_PAID` instead (ADR-01)". This contradicts PA-08 (structural decision 6), ADR-01, §14.7 and §14.9.5 ("never `REFUND_PAID`").
- **Should say:** "...means consuming a PII-free paid-refund event with the `RefundPaidEvent` fields, on a topic of its own, never the refund topic, with the cutover of the §14.7 Extraction contract (ADR-01)."

### Medium

**M1.** `sdd-refunds-platform\01-executive-summary-scope-risks.md:81` (R-03 Description).
- **Stale:** "the LOYALTY purchase reference, which the Refunds Portal row of LOYALTY 08 expects with every paid refund, may not be the REFUNDS receipt number". Since PA-03, the LOYALTY 08 Refunds Portal row carries the receipt number, not the member or purchase reference.
- **Should say:** open with "the take-back finds the member purchase by the receipt number the Refunds Portal reports (LOYALTY 08)", then keep the missing, repeating and form-drift risks. The mitigation's "whether or not the two identifiers are the same" can go.

**M2.** `sdd-refunds-platform\13a-service-refund.md:403` and `13c-service-notification.md:301` (Future Enhancements).
- **Stale:** "Push notifications in the mobile app (as a new channel)". This contradicts REFUNDS OI-11 as applied by PM-12: there is no native app, and push waits for one that is not planned.
- **Should say:** "Push notifications, which need a native app that is not planned ([REFUNDS 12 Wishlist] item 2)".
- **Related wording:** `01-executive-summary-scope-risks.md:52` ("a REFUNDS/UC-02 future enhancement") and `13c:218` ("push notifications are a future enhancement") should cite the Wishlist item.

**M3.** None of the three documents records the review in its Changes Log or version.
- **REFUNDS** (`brd-refunds-portal\00-cover-and-changelog.md:24`): the only row is 1.0, already Approved By Head of Retail. G6 (`14-todo.md:70`, "Approved By in the Changes Log") therefore reads as met by that row, and cannot show sign-off of the review changes. Add a row for the 2026-10-01 changes with Approved By empty, and point G6 at it.
- **LOYALTY** (`brd-loyalty-points\00-cover-and-changelog.md:14, :26`): the Status names only versions 1.1 and 1.2. The latest row, 1.2, says "No requirement changed", yet the review changed 01-04, 08 and 11-13. Add a review row and name it in the Status, matching G6 (`14-todo.md:75`).
- **SDD** (`sdd-refunds-platform\00-cover-and-changelog.md:44-49`, master `:7` VERSIONING rule): the review changed chunks 01-18 with no bump and no row. This is the same defect DC-11 labelled on "1.0 (amended)", and `00:38` itself says "the review changed this SDD after 1.2". Add a row.

**M4.** `brd-refunds-portal\14-todo.md:96-97` (Step 4 Mockup coverage).
- **Stale:** the MK-03 row reads "Approved" and honours only BR-1 to BR-3. Yet the Business review rows require a payout-delayed state (BO-03, `:36`) and an own-request refusal state for BR-4 (SME-05, `:46`).
- **Stale:** the SCR-02 row's states and update note omit the Paid state with the payout reference (SME-06, `:47`).
- **Stale:** the registration screen required by PM-04 (`:49`) has no row, although SCR-04 got one.
- **Should say:** MK-03 "Update needed (payout-delayed and own-request refusal states)" with BR-4 and E1 added; SCR-02 gains a "Paid (payout reference)" state; add a "Not started" row for the registration screen.

**M5.** `brd-loyalty-points\14-todo.md:99` (Step 1 Evidence).
- **Stale:** "Chunk 13 has no open or deferred item". Chunk 13 (`:14`) and G1 now list OI-10 to OI-19 as open.
- **Should say:** the evidence holds as of v1.2 only; the business review raised OI-10 to OI-19 (TD-25 to TD-36), which are open.

### Low

**L1. LOYALTY 14 Step 2 Evidence** (`brd-loyalty-points\14-todo.md:154`).
- **Stale:** "Run 6 ... after the last content change to 00-13 (the v1.2 diagrams)". The step's own Status (`:150`) says the review changed 00-13 after Run 6.
- **Should say:** "...the last content change before the business review of 2026-10-01".

**L2. LOYALTY 14 mockup brief label** (`brd-loyalty-points\14-todo.md:269`).
- **Stale:** "v1.2 added only diagrams, so it still applies". The LP-01 update needs the PM-12 rule.
- **Should say:** the brief points at the post-review BRD, which adds the 11 rule "points cannot be spent yet".

**L3. LOYALTY 14 register rows TD-01 and TD-08** (`brd-loyalty-points\14-todo.md:107` and `:126`).
- **Stale:** both still read plain "Resolved". The decision log (`decision-log.md:34`, `:92`) and the BO-05 row (`14-todo.md:45`) mark them superseded in part.
- **Should say:** add "superseded in part by TD-27" to TD-01 and "superseded in part by TD-26" to TD-08.

**L4. LOYALTY 14 TD-26** (`brd-loyalty-points\14-todo.md:111`).
- **Stale:** it asks only for same-day reporting with the receipt number.
- **Should say:** also the PA-03 asks now in `02:27`: the same form as the Refunds Portal look-up, and uniqueness across branches and over time. TD-27 was widened the same way for PA-05.

**L5. LOYALTY TD-15** (`brd-loyalty-points\decision-log.md:148, :150`; register `14-todo.md:139`).
- **Stale:** the record says "The BRD stays as written", its Rule home says "01 / Business Objectives (unchanged)", and the register row says "confirmed as written". PM-05 has since changed 01 Objective 2.
- **Should say:** add a note that the availability reading stands, and that Objective 2's measure is reopened as OI-12 (PM-05).

**L6. LOYALTY 02 L2** (`brd-loyalty-points\02-glossary-assumptions-facts.md:37`).
- **Stale:** the clearance does not mention the program's exclusions and expiry, although OI-15 (`13-open-items-and-clarifications.md:192`) sends that question to "02 Legal clearances L2".
- **Should say:** add exclusions and expiry to what L2 must confirm.

**L7. LOYALTY Business review register coverage** (`brd-loyalty-points\decision-log.md:224` onward; `14-todo.md:56`).
- **Stale:** the register has records for PA-09 and DC-08, which only raise open items, but none for BO-11, SME-11 or SME-12, which do the same. The 14 PA-02 row omits "decision log" from Chunks changed, although a PA-02 record exists.
- **Should say:** add the three records, or state the rule for which decisions get one; add "decision log" to the PA-02 row.

**L8. REFUNDS 12 Wishlist item 4** (`brd-refunds-portal\12-appendix-and-wishlist.md:34`).
- **Stale:** its trigger cites "(02 Dependencies 1)", but Dependencies 1 (`02:39`) asks nothing about settlement records.
- **Should say:** add "whether it provides settlement records" to Dependencies 1, or drop the pointer.

**L9. REFUNDS 04 In Scope** (`brd-refunds-portal\04-scope-and-personas.md:16-21`). Optional.
- **Stale:** no line for the branch refund report (now UC-06) or the monthly head-office report (09).
- **Should say:** add a line for each.

**L10. SDD ISO lines** (`13b-service-payout.md:341`, `13c-service-notification.md:288`).
- **Stale:** §17.2 says "none stated by the BRDs", and §17.3 has no pointer, although REFUNDS 02 L5 now states the certification clearance and `13a:390` cites it.
- **Should say:** point both lines to L5, as §17.1 does.

**L11. SDD 13a Constraints** (`13a-service-refund.md:299`).
- **Stale:** the Business rules line lists UC-04 BR-2 and BR-3 but not BR-4, which Decide and Error Handling enforce.
- **Should say:** add BR-4.

**L12. SDD §15.6 table** (`11-api-contracts.md:226-227`).
- **Stale:** the API-01 row omits line quantity, category and net amount (SME-08, asked at `:100`). The API-02 row omits the original-payment reference, acquirer link, posting time, bank-quotable reference and dispute detection (SME-06, asked at `:127`).
- **Should say:** list them in "Fields still TBD".

**L13. Retry-window default restated** (`06-principles-and-decisions.md:33` ADR-01, `07-cross-cutting-concerns.md:33` §11.2).
- **Stale:** both restate "default 24 hours", although OI-22 made §17.2 Constraints (`13b:251`) the single home of that value.
- **Should say:** "the §17.2 retry window".

**L14. SDD 18 GATES note** (`18-open-items-and-clarifications.md:7`).
- **Stale:** it lists only "Superseded". The legend (`:34`) has both forms, and OI-04, OI-18 and OI-19 are "Superseded in part".
- **Should say:** "Superseded or Superseded in part".

**L15. SDD 18 OI-11 count** (`18-open-items-and-clarifications.md:193, :195`).
- **Stale:** the answer still says "at most six" messages (7,200 a month, 21,600 at peak), shown as plain "Accepted - applied". BO-03 made it eight (9,600 and 28,800, `14-performance-and-capacity.md:20`). OI-10's four-event ADR-10 text (`:179`) has the same issue.
- **Should say:** "Superseded in part (BO-03)", following the DC-03 convention.

**L16. SDD 18 Reviewer Notes** (`18-open-items-and-clarifications.md:406`, `:392`).
- **Stale:** bullet 1 quotes the old UC-04 E1 wording and leaves the circuit-breaker question to "the inline §17.2 clarification". CL-09 and then BO-03 settled it: the window's end is its own due time, counted from the approval. Row `:392` says "seven integration events" (now eight).
- **Should say:** mark bullet 1 superseded, as bullet 3 is for PA-07; row `:392` can be noted as dated.

**L17. SDD master E4 list** (`refunds-platform-sdd-master.md:30`).
- **Stale:** it omits PA-12, which changed chunk 10 (the §14.9 erasure-map note "an e2e gate item", `10-events-hub.md:293`). The PA-12 record (`decision-log.md:731`) also lacks "This changes chunk 10".
- **Should say:** add PA-12 to the list, and the sentence to the record.

**L18. SDD decision-log OI-18 record** (`sdd-refunds-platform\decision-log.md:193`).
- **Stale:** "the LOYALTY 02 assumption ... is now a confirmed dependency". Since BO-05 it is To confirm (TD-26).
- **Should say:** add a note recording the change.

**L19. SDD decision-log BO-06 record** (`sdd-refunds-platform\decision-log.md:491`).
- **Stale:** its §2.2 marker part was superseded by PM-12, which only the PM-12 record (`:651`) says.
- **Should say:** annotate BO-06, as CL-09 and OI-04 are annotated.

**L20. SDD chunk 19** (`19-e2e-system-design.md`).
- **Stale:** there is no Stale banner in the file itself, unlike the gated BRD 15/16, which carry one. Only the master says "Shut - Stale". The chunk still shows 7 events (`:30`), refund-service 5 (`:39`), Figure 28 without `REFUND_PAYOUT_DELAYED` (`:140`), and "22 items, all Accepted - applied" (`:268`).
- **Should say:** a one-line banner pointing to the master, if the gate rule allows it. This may be intentional.

**Optional nit:** dedup is still described as `(consumer, event_id)` in AP-02, the §6 rules, §14.2, §14.3, §14.6 rule 2 and the glossary, and as `(source_event_id, channel)` in `13c:47`. Since PA-11 the keys lead with `tenant_id`. The meaning is the same because event ids are UUIDv7.

### Verified consistent
- **Event and message counts:** eight integration events (6 + 2), three DLQs, eight messages per request (9,600 a month, 28,800 at peak).
- **Roles and endpoints:** eight permission tokens split 4 / 1 / 3; nine plus three client endpoints.
- **Open-item lists:** REFUNDS has 16 open items, and its header matches G1. LOYALTY has OI-10 to OI-19 with TD-25 to TD-36, and G1 lists them all.
- **Review records:** all 39 decisions have SDD decision-log records.
- **Lineage, tasks and anchors:** the Source BRD and Child LLD lineage rows are right, TASK names match across documents, and every cross-document anchor I checked resolves.
