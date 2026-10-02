Reviewer: DC
Concern: Receipt number now gates all points earning, but its source is mis-cited and its uniqueness is assumed nowhere
Where: SDD 01 §3 assumption 6; LOYALTY 08 (POS Records row); SDD 13d §17.4 Earn points and Tables Design (member_purchase.receipt_number NOT NULL, UNIQUE; MISSING_RECEIPT_NUMBER, DUPLICATE_RECEIPT); SDD 11 §15.3 API-04 TBD-EXTERNAL note; SDD 01 §4 R-03; SDD decision-log CL-19 (follow-up); SDD 13a §17.1 Tables Design (refund_item partial UNIQUE) and List of APIs (GET /v1/receipts/{receiptNumber}/refundable-items); REFUNDS 02 Assumptions 1
Why: §3 assumption 6 lists the receipt number among the fields POS Records serves and cites LOYALTY 08 as the source. That row exchanges only member, purchase reference, amount, and purchase date. R-03, the API-04 external note, and the CL-19 follow-up all say it is unconfirmed whether POS Records can send the receipt number. Since CL-19, §17.4 rejects every member purchase that has no receipt number. A "no" from POS Records would therefore stop all earning (LOYALTY UC-01, UC-02, NFR-01, NFR-03) and fire the rejection alert on every run. R-03 rates the impact M and describes only wrong or missing take-backs. Separately, several designs assume receipt numbers are unique across the 40 branches: the member_purchase key, the refund_item index, and a receipt lookup that takes no branch. REFUNDS 02 Assumption 1 says only that every purchase has a receipt number, and §3 records no uniqueness assumption. If numbers repeat per branch or till, DUPLICATE_RECEIPT silently drops genuine purchases and the lookup can return the wrong receipt.
Direction: (a) Recast assumption 6 as an open external dependency, re-rate R-03, and decide whether a purchase without a receipt number still earns, blocking only its take-back.
(b) Record tenant-wide receipt uniqueness as a §3 assumption and a REFUNDS question, or key on branch plus receipt number.

---

Reviewer: DC
Concern: E2E gate reads Open while gated chunks take values and decisions from open markers outside the gate's scope
Where: SDD master (E2E gate line); SDD decision-log "E2E gate check, 2026-10-01 (after the clarification decisions)" E3; SDD 08 §12 INT-01, INT-02, INT-03 (Timeout and Retries markers); SDD 13b §17.2 Business Logic, Send (lease_until); SDD 13c §17.3 Sending and retries, Tables Design claimed_until; SDD 11 §15.3 ("Timeout, retries, circuit breaker" rows); SDD 06 ADR-04, ADR-08; SDD 13a and 13d API Standards; SDD 19 §24.6 item 8; SDD 06 ADR-10 How; SDD 16 §20.1.3; SDD 02 §6 Event Broker row; SDD 10 §14.9 Erasure-path mapping; SDD 01 §4 R-06
Why: E3 checks only chunks 09 to 13x and §7.3. OI-22 made §12 the single home of provider policy, so the gated specs now compute from values that are still markers. lease_until is the INT-01 timeout plus one minute, claimed_until is the INT-02 timeout plus one minute, and a message fails at "the attempt limit of §12 INT-02". None of these numbers exist. Chunk 19 names ADR-08 as a normative home, though it is still Proposed with an open marker, and 13a and 13d base their API style on the Proposed ADR-04. The only limit on customer PII in the retained refund topic and its DLQs is ADR-10's "no longer than the replay window §20.1.3 needs". §20.1.3 is an empty placeholder and the §6 retention is a marker. So the §14.9 erasure map, 13a Compliance, and R-06 ("one bounded retention") promise a limit that no document sets. "Open - Up to date" tells LLD authors these contracts are complete when they are not.
Direction: (a) Extend E3 to every section a gated chunk cites normatively (06 ADRs, 08 §12, 02 §6, 16 §20.1.3), or resolve those markers and rerun the gate.
(b) Set a numeric broker retention or take the ADR-10 encryption path, and flag §24.6 item 8 as resting on a Proposed ADR.

---

Reviewer: DC
Concern: Chunk 18 still records OI-18 and OI-19 as applied in their superseded form, with no supersession note
Where: SDD 18 OI-18 and OI-19 (Recommended Answer, Status), Resolution Log rows OI-18 and OI-19, and the "How to read" Status legend; SDD decision-log Clarification register intro and the 2026-10-01 records of OI-18 and OI-19; SDD decision-log "LOYALTY v1.2 update clarification register" (partial take-back entry) and "Targeted update, 2026-10-01"; SDD 13d §17.4 Earn points, Take points back; LOYALTY 02 Assumptions
Why: Chunk 18 is still v1.0 and shows OI-18 as "Accepted - applied" with:
- a NO_EARN close one day after paidAt;
- a match on purchase reference;
- "no EARNED movement" as the trigger;
- a citation of "LOYALTY 02 § Assumptions 1", which now reads "None.".
It also shows OI-19 rejecting 0-point purchases into purchase_import_rejection. The live §17.4 does none of this. It keeps PENDING_EARN with no expiry, matches on receipt number (CL-19), sets pending status only when the purchase is unreported, and records 0-point purchases as no_points. The supersession is written only in the decision log, and the chunk 18 status legend has no value for it. The decision log's own v1.2 register entry and its targeted-update entry still say the take-back runs "under a lock on the purchase reference". CL-19 replaced that lock but does not list these entries among what it supersedes. The master sends reviewers to chunk 18 to triage findings. A reader who takes it as the decision record would restore the one-day close, dropping BR-4 take-backs against LOYALTY/NFR-01, and the false rejection alerts.
Direction: (a) Add a Superseded status with a pointer to the superseding record, and apply it to OI-18, OI-19, and their Resolution Log rows.
(b) Mark the decision-log v1.2 register entry and the targeted-update entry as superseded by CL-19.

---

Reviewer: DC
Concern: Workflow figures and ADR-01 still end the payout at the retry window, contradicting CL-09
Where: SDD 05 §8.4.1 Figure 4 (node Q); SDD 05 §8.5.2 Figure 7 (else branch) and Summary; SDD 06 ADR-01 Why and Alternatives & Trade-offs; SDD 04 §8.3 Figure 3 (Core DB node); SDD 13b §17.2 After the retry window and Figure 18; SDD 10 §14.5.2 PAYOUT_FAILED; SDD 19 Figure 29; SDD decision-log CL-09 and "Clarification decisions applied" (back-fill list)
Why: Since CL-09, a FAILED payout keeps retrying at the post-window interval and PAYOUT_SUCCEEDED can still follow (§17.2, §14.5.2, Figure 29). Figure 4 still ends at "Stays APPROVED: branch manager told" with no path to PAID. Figure 7 and its summary present PAYOUT_SUCCEEDED and PAYOUT_FAILED as alternative final outcomes. ADR-01 still argues from "one-day retries" and "one-day retry loops". Chunks 05 and 06 stayed at v1.1, and the CL-09 back-fill list leaves out §8.4.1, §8.5.2, and ADR-01. Figure 3 also still labels the core database "refund and loyalty schemas", although OI-03 added core_events (Figure 27 shows it). The master's "Review architecture" path reads 04, 06, and 05 before 19, so readers meet the stale model first. A consumer built from Figure 7 may treat PAYOUT_FAILED as terminal.
Direction: (a) Redraw Figures 4 and 7 with the post-window retry loop, reword ADR-01, add core_events to Figure 3, and bump the changed chunks.
(b) Add §8.4.1, §8.5.2, and ADR-01 to the CL-09 back-fill record.

---

Reviewer: DC
Concern: The start of the LOYALTY/NFR-02 hour, which also dates a take-back, is stated three ways, and paid_at has no source
Where: SDD 14 §18.2 (Take-back lag); SDD 13d §17.4 Constraints (Timing) and Metrics (loyalty_takeback_lag_seconds); SDD 13a §17.1 Tables Design (paid_amount, paid_at, payout_id row); SDD 10 §14.10 (paidAt) and §14.9.6; SDD 15 §19 (LOYALTY acceptance); LOYALTY 10 NFR-02; LOYALTY 13 OI-02; LOYALTY 03 Movement date
Why: LOYALTY OI-02 moved the start of the NFR-02 hour from the payment to the Refunds Portal's report. SDD §18.2 was rewritten in v1.1 but still says "within 1 hour of the refund being paid". §17.4 Constraints says "when the refund is marked Paid", §19 uses the Paid status change, and the lag metric starts at paidAt. refund_request.paid_at is listed as "From PAYOUT_SUCCEEDED", but that payload carries no timestamp. So paid_at is either the envelope occurred_at (when the provider accepted) or the PAID commit. If it is provider acceptance, broker outages and consumer retries before the PAID commit count against the loyalty hour, which OI-02 placed outside the measure. Near midnight, the TAKEN_BACK movement date (LOYALTY 03, UC-02 AC-4, TC-PTS-05) can also differ from the Paid date the same person sees in the REFUNDS status history.
Direction: (a) Define paid_at and RefundPaidEvent.paidAt explicitly, for example as the PAID transition commit, in §17.1 Tables Design and §14.10.
(b) Reword §18.2 to count from the Refunds Portal's report, as LOYALTY OI-02 decided.

---

Reviewer: DC
Concern: Identity rules in §16 contradict each other and rest on the open §3 assumption 3
Where: SDD 12 §16.6 (self-registration row: "One account per person (§3 assumption 1)"); SDD 01 §3 assumptions 1 and 3; SDD 12 §16.3 (END_CUSTOMER identity source; STAFF note); SDD 12 §16.2 steps 1 and 2; SDD 12 §16.6 (member row) and §16.8 item 1; SDD 03 §7.1 Member; LOYALTY 04 Out of Scope; LOYALTY 16 P2
Why: §16.6 attributes "one account per person" to §3 assumption 1, which says only that users sign in with a Keycloak account. §16.3 then requires staff who shop to hold a second, customer account. §16.3 also defines every END_CUSTOMER, members included, as a self-registered realm account, and §16.2 gives those accounts their tenant_id through the registration flow. Yet §3 assumption 3 leaves open whether the existing loyalty account lives in this realm or signs in through a brokered identity provider. If brokered, a person who is both customer and member (§7.1, §16.1) has two identities that nothing links. A brokered member also gets no tenant_id from any registration flow, so the gateway rejects the token (§16.2 step 2). Chunk 12 passed the E3 marker check only because the open question sits in chunk 01, which the gate does not check. LOYALTY 16 P2 also expects test members R1 to R12 "created as needed", which the platform cannot do.
Direction: (a) Resolve §3 assumption 3, then rewrite §16.2, §16.3, §16.6, and §16.8 for that identity model, including account linking and the member tenant claim.
(b) State "one account per person, staff excepted" in §3, or drop the citation.

---

Reviewer: DC
Concern: Questions the SDD hands to BRD owners are tracked in neither BRD, and a BRD answer never reached the SDD
Where: SDD decision-log follow-ups in OI-13, OI-14, OI-19 (2026-10-01), CL-02, CL-03, CL-05, CL-09, CL-15, CL-22; SDD 01 §2.2 (mobile marker) and §3 assumption 3; REFUNDS 13 Open Items; REFUNDS 14 Delivery gate ("Next action: None"); LOYALTY 13 Open Items ("None open"); LOYALTY 14 Open items register; SDD 14 §18.2 (LOYALTY availability marker); LOYALTY decision-log TD-15; SDD 13a §17.1 Receipt lookup (RECEIPT_NOT_CARD_PAID); SDD 02 §6 API Gateway row; LOYALTY 02 Dependencies; REFUNDS 04 In Scope; REFUNDS 08
Why: Eleven business questions the design depends on exist only as decision-log narrative or SDD markers:
- the card-only rule for cash and split tender;
- a second receipt factor;
- till returns and voids;
- who holds the staff administrator account;
- a staff alert;
- retention values;
- an end for a payout refused for good;
- the message-log retention;
- a member-left signal;
- native mobile versus web;
- how members sign in.
REFUNDS v1.0 is Approved with "Next action: None" and LOYALTY 13 says none are open, so no owner, priority, or gate holds these questions. Customer-visible behaviour the SDD added (422 RECEIPT_NOT_CARD_PAID at UC-01 step 2, the 429 lookup limit) appears in no REFUNDS use case or UAT case. The loop also fails in the other direction. LOYALTY TD-15 already settled the §18.2 question (no availability measure in this release), but the SDD v1.2 update left the marker open. Finally, LOYALTY 02 calls the Refunds Portal dependency Confirmed, while REFUNDS 04 and 08 carry no obligation to report paid refunds to Loyalty Points.
Direction: (a) Register each SDD follow-up as an OI or TD row in the owning BRD, reopening its gate, or as an SDD chunk 18 item with an "Awaiting BRD owner" status.
(b) Close the §18.2 marker by citing LOYALTY TD-15, and add a Loyalty Points row to REFUNDS 08.

---

Reviewer: DC
Concern: The card-paid cap leaves LOYALTY BR-3's "whole purchase refunded" unreachable for split-tender receipts
Where: SDD 13a §17.1 Receipt lookup and SubmitRefundRequest (expectedAmount capped at cardPaidAmount); SDD 18 OI-13; SDD 13d §17.4 Take points back; LOYALTY 06a UC-02 BR-3; SDD 11 §15.3 API-01 and API-04 (Data the platform needs); SDD 15 §19 (LOYALTY acceptance); SDD decision-log "Cross-BRD reconciliation, 2026-10-01 (LOYALTY v1.2 against REFUNDS v1.0)"
Why: OI-13 caps every refund at the receipt's card-paid amount. §17.4 realises BR-3 ("all points once the whole purchase is refunded") by comparing the refunded money total with the member purchase amount. For a split-tender receipt, every item can be returned yet the total never reaches the purchase amount, so the member keeps points for a fully returned purchase. The comparison also mixes two sources: API-01 receipt item amounts and the API-04 member purchase amount. Nothing states that they share a basis, for example after discounts or items that earn no points. If they differ, the cap or the whole-purchase branch fires wrongly. That divergence is also the only way the BR-3 cap can ever trigger in production (§19: refund-service never over-refunds). The cross-BRD reconciliation concluded "no glossary split" without examining either effect, and OI-13's question went to the REFUNDS owner only.
Direction: (a) Ask the LOYALTY owner whether "whole purchase refunded" means all items returned or the full amount repaid; if it means items, carry that fact in RefundPaid.
(b) State in §3 or API-04 that the member purchase amount equals the receipt total, or reconcile the two amounts.

---

Reviewer: DC
Concern: The daily branch report is built in the SDD but has no task, test, or screen in REFUNDS, and its counting rule dangles
Where: REFUNDS 09 (Branch refund report); REFUNDS 07; REFUNDS 15 Use-case coverage; REFUNDS 16 Traceability Matrix; REFUNDS 11 Screens; REFUNDS 14 Mockup coverage; SDD 13a §17.1 Business Logic (Branch report), List of APIs row 9, and BranchRefundReport DTO; SDD 12 §16.10 (report row); SDD 03 §7.3
Why: REFUNDS 09 requires a daily per-branch report, but no use case, matrix row, implementation task, UAT case, screen ID, or mockup covers it. Delivery and BAT sign-off can therefore omit it while 15 and 16 report full coverage. The SDD still ships an endpoint, a permission token, and two indexes for it. §16.10 traces them to the Proposed ADR-08 rather than a BRD matrix row. The BranchRefundReport DTO says "the counting rule is the one §17.1 Branch report states". §17.1 never says which date places a request in a day's "requests per status": submitted, decided, or current status. The BRD's "Daily" frequency also silently becomes an on-demand query by date.
Direction: (a) Add the report to REFUNDS 15, 16, and 11 or 14, or give it a use case.
(b) Write the per-metric date rule into §17.1 Branch report, and record whether "Daily" means a scheduled push or on demand.

---

Reviewer: DC
Concern: UAT suites claim coverage and prerequisites that the BRDs and the SDD environment do not deliver
Where: REFUNDS 16 Coverage gaps, Traceability Matrix, P1, P2, TC-REQ-07, TC-DEC-01; REFUNDS 10 NFR-03, NFR-04; REFUNDS 06a UC-02 Business Rules & Constraints; SDD 15 §19 (UAT row and LOYALTY acceptance marker); LOYALTY 16 P8, TC-PTS-07, Task acceptance, Exit criteria; SDD 10 §14.10
Why: REFUNDS 16 checked "2 NFRs" and reports "Without a case: 0", but REFUNDS 10 has four NFRs. NFR-03 (seasonal load) and NFR-04 (only the customer and their branch manager see a request) have no case, and neither does UC-02 BR-1. P2 also provides only one customer account, so own-request isolation cannot be tested. The suite's counts are wrong as well: there are four alternate flows and six acceptance criteria, not three and five. The P2 no-role account is used by no case. Neither REFUNDS P1 nor SDD §19 provides the notification partner in UAT, yet TC-REQ-07 and TC-DEC-01 pass only if the customer gets a message. LOYALTY TC-PTS-07 is required for TASK-01, TASK-04, and the BAT exit. SDD §19, however, says refund-service can never produce the P8 scenario and leaves its staging open. One option it names is a UAT-only RefundPaid publisher, which the §14.10 single-publisher contract does not allow.
Direction: (a) Add REFUNDS cases for NFR-03, NFR-04, and UC-02 BR-1, with a second customer in P2, and correct the coverage counts.
(b) Add the MsgHub sandbox to REFUNDS P1 and SDD §19, and decide how P8 is staged or mark TC-PTS-07 Provisional.

---

Reviewer: DC
Concern: The SDD lineage misstates the child LLD's SDD basis and hides that the LOYALTY source is unapproved
Where: SDD 00 Document Lineage (Child LLDs row: LLD 1.1, SDD version 1.2; Source BRDs row: LOYALTY 1.2); SDD decision-log "Child LLDs check, 2026-10-01 (clarification decisions run)" and "Targeted update, 2026-10-01"; SDD 00 Changes Log (two 1.0 rows); SDD master VERSIONING; LOYALTY 00 cover and Changes Log (Status In Review; v1.1 and v1.2 Approved By "-")
Why: The Child LLDs row reads LLD 1.1 against SDD 1.2. The latest recorded check says the LLD is 1.0 and read SDD 1.0, that the v1.1 update marked the row out of date, and that only lld-unifier may refresh it. The SDD run nonetheless set the SDD version cell to 1.2, and the row shows no out-of-date flag. Anyone tracing from the LLD back to the SDD would assume the LLD carries CL-01 to CL-25 (committed contracts, DTO fields, retention, the receipt-number match), when it may predate them. The Changes Log has two rows numbered 1.0. The second one applied 22 open items, including contract changes, against the master rule to bump the version on every change. Source BRDs lists LOYALTY 1.2 with no status, though its cover reads In Review and nobody has approved 1.1 or 1.2. The §17.4 design for BR-3, BR-4, and NFR-03 therefore rests on unapproved requirements without saying so.
Direction: (a) Add a state column to Child LLDs (Up to date, or Out of date since SDD vX, with the LLD's actual basis) and a status column to Source BRDs.
(b) Renumber the second 1.0 Changes Log row.

---

Reviewer: DC
Concern: Decision and requirement IDs collide or resolve ambiguously across the chain
Where: SDD decision-log Clarification register intro, records CL-19, CL-21, CL-22, CL-25, and "Clarification decisions applied" (first-part entries CL-18 to CL-22, CL-25); SDD 10 §14.8 row 1 ("OI-04"); LOYALTY 13 OI-04; SDD 01 §5 Glossary (BRD key); SDD 00 Changes Log v1.1; REFUNDS 06a and 06b, LOYALTY 06a (Business Rules & Constraints, Acceptance Criteria); LOYALTY 13 OI-03
Why: CL-NN IDs point into ../sdd-marker-decisions.md, which is outside the SDD set. There, CL-19, CL-21, CL-22, and CL-25 each have a first and a replacement entry, and CL-18 and CL-20 appear only as unapplied first-part entries. A bare CL-19 therefore resolves to two texts, and the SDD keeps a copy of neither. The SDD's own OI-01 to OI-22 carry no document key and overlap LOYALTY OI-01 to OI-09 and REFUNDS OI-01. For example, §14.8's "OI-04" is the SDD tenant fix, while LOYALTY OI-04 is the NFR-01 allowed-times decision. The v1.1 Changes Log row cites "UC-01 and UC-02 E1" without the LOYALTY key, although REFUNDS also has a UC-01 and UC-02. That breaks the §5 rule that every BRD reference carries its key. BR-n and AC-n are unlabelled bullets numbered only by position in all three use-case chunks, yet BRD chunks 13 to 16 and the SDD cite them by number. LOYALTY OI-03 had to choose its option to keep those positions stable, and any insertion silently renumbers every downstream citation.
Direction: (a) Give CL entries unique IDs copied into the decision log, and key the SDD's own IDs (for example SDD/OI-04) where BRD IDs share the same numbering.
(b) Label BR-n and AC-n inline in the use-case chunks.
