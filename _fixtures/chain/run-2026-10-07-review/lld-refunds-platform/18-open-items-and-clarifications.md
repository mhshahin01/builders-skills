<!--
CHUNK: 18
TITLE: Open Items and Clarifications
PROJECT: Refunds Platform
VERSION: 1.3
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# Open Items & Clarifications

## How to read each item

This is the separate Codex disk re-read pass after body and Specs, under resume-codex.md's outside-Claude-Code rule. It has no independent model/context reset. Existing author flags in chunk 15 were excluded from findings; internal inconsistencies and missed boundaries below are distinct findings. Fixed test PM answers are applied within initial version 1.0.

## Open Items

### OI-01: Draft class and signature drift

- **Where:** all modules §7.2/§7.3; frontend §17.3
- **Type:** Inconsistency
- **Concern:** The disk draft used handle1-style signatures without resource ids, different pseudocode class names, and hyphens in three TypeScript identifiers. These cannot be a coherent build target.
- **Options:**
  - **A.** Use one named service implementation and explicit resource/subject/query arguments; normalize proposed component identifiers.
  - **B.** Keep shorthand signatures and let each implementer reconcile them; smaller document but contradictory wiring.
- **Recommendation:** A; corrected signatures, class names and identifiers.
- **Why:** The implementation template requires load-bearing method signatures and an internally consistent class map; clearer wiring costs a few additional lines.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-02: API-14 replay must bind to the source message row

- **Where:** notifications §7.3; §12.2
- **Type:** Contract drift
- **Concern:** Generic request-hash conflict wording had leaked into API-14, whose source errors and schema contain no such error or notifications idempotency_record table. The first success/error replay fields were unstated.
- **Options:**
  - **A.** Bind replay to message_key, status, last_error_code and ended_at; return first result/error and preserve source errors.
  - **B.** Add a new replay table/hash-conflict error; more uniform REST logic but changes the port contract.
- **Recommendation:** A; source-message binding and explicit first error/result replay applied.
- **Why:** SDD API-14 repeats the first outcome, and 13d provides its message row; source fidelity wins over a uniform generic rule.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-03: Late rejoin replay needs a lock-order boundary

- **Where:** loyalty-points §7.3
- **Type:** Concurrency hazard
- **Concern:** The notice pseudocode immediately reevaluated held purchases after period mutation, without releasing the member lock. That can invert the stated purchase-before-member order against a concurrent refund.
- **Options:**
  - **A.** Commit notice/period work, then re-drive each held purchase in a fresh purchase-first transaction and recheck period under lock.
  - **B.** Hold member and purchase locks across all replay; simpler orchestration but a deadlock cycle.
- **Recommendation:** A; phase boundary and concurrency test plan applied.
- **Why:** SDD 13e mandates purchase-first locking and durable late-notice reconciliation; the tradeoff is a crash-recoverable two-phase implementation within existing behavior.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-04: Report screen text was mistaken for a UC mapping

- **Where:** global §17.3 and §19.9
- **Type:** Traceability gap
- **Concern:** [LOYALTY/MK-04](../brd-loyalty-points/14-todo.md#mockup-coverage) says None, then cites [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) as report provenance. The draft parsed that citation as the screen UC and gave the report route use_case.
- **Options:**
  - **A.** Read only the mapping before the None report explanation; report keeps [LOYALTY/MK-04](../brd-loyalty-points/14-todo.md#mockup-coverage) screen only.
  - **B.** Infer [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) from provenance; easy drill-down but contradicts the BRD screen row.
- **Recommendation:** A; corrected route data, workflow Screens and index.
- **Why:** The trace rule reads the screen UC cell and explicitly separates report workflows; it accepts screen-only telemetry.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-05: Entry-point matching must compare complete paths

- **Where:** refund-requests §7.2
- **Type:** Traceability gap
- **Concern:** Substring matching incorrectly treated POST /v1/refund-requests as an entry point of cancellation and decision UCs too. The source lists distinct full paths.
- **Options:**
  - **A.** Compare the full method/path token from SDD §7.3; preserve row order only for genuine shared endpoints.
  - **B.** Keep prefix matching; less parsing work but wrong use_case spans/logs.
- **Recommendation:** A; exact matching applied and all named entry-point annotations rechecked.
- **Why:** sdd-to-lld trace checks require exact entry points; path prefixes are not the same operation.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-06: Copied confidence text needs rebased links

- **Where:** global §18.3
- **Type:** Traceability gap
- **Concern:** Five index descriptions retained ../../ SDD paths copied from module files, so their links resolved outside the run when read from chunk 15.
- **Options:**
  - **A.** Rebase only the copied index description links to its directory and validate every local file/anchor.
  - **B.** Remove source links from index text; fewer links but loses provenance.
- **Recommendation:** A; descriptions rebased; source module flags unchanged.
- **Why:** The skill requires every relative link to resolve; rebasing keeps provenance without duplicating a different fact.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-07: Notifications template and publication roles were generic

- **Where:** notifications §7.4; payouts §7.4
- **Type:** Pattern misapplication
- **Concern:** The initial diagram assigned a fictitious HTTP controller to provider-only modules and gave notifications an outgoing durable registry writer even though it publishes no catalog event. Runtime template selection also lacked its own pattern roles.
- **Options:**
  - **A.** Use actual port/callback adapters, incoming message-work/inbox roles and a type/channel template Strategy.
  - **B.** Leave generic controller/outbox diagrams as examples; concise but misleading production wiring.
- **Recommendation:** A; module-specific adapter/work diagrams and template Strategy applied.
- **Why:** SDD 13c/13d expose provider/port entry points and 13d names runtime templates; CLAUDE.md asks for appropriate Strategy and composition.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-08: Broad UI defaults would add release behavior

- **Where:** frontend §17.9; source BRD 11
- **Type:** Missing scenario
- **Concern:** CLAUDE.md table defaults include bulk actions and persistent preferences, plus export. Applying all of them would add behavior absent from these BRDs; points-history export is a future enhancement.
- **Options:**
  - **A.** Keep source paging/sorting, report exports and existing cancellation/decision actions only.
  - **B.** Add bulk actions, persistent preferences and points-history export to satisfy every general table default; increases product scope.
- **Recommendation:** A; reject the new behavior proposed in B and retain the source scope.
- **Why:** Both BRD 11 chunks and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) define this release; the fixed test PM policy overrides a broad technical default.
- **Status:** Rejected - out of scope for this release (test-fixture policy)

### OI-09: The last-period deletion is blocked by member rows outside the deletion set

- **Where:** loyalty-points §7.3 ([notice and retention](./04-implementation/loyalty-points.md#loyaltypointsserviceimplnotice-and-retention), former-member-retention step 4); 05 §8.6; 13 §16.3
- **Type:** Missing edge case
- **Concern:** Step 4 deletes "with the last period, points_balance and member too", 05 §8.6 says that with every loyalty key at NO ACTION "that order, never a cascade, removes the referring rows", and the new 13 §16.3 case asserts that "no key fails the member's transaction". Two cases break this. First, each period's set is the [SDD Retention Policy](../sdd-refunds-platform/13e-service-loyalty-points.md#retention-policy) set, purchases "dated in that period, or after it and before the day the member next rejoined", but the [SDD membership model](../sdd-refunds-platform/13e-service-loyalty-points.md#business-logic) gives a member first seen through a rejoin notice a first period that starts on the rejoin day, and Earning stores every reported purchase for its member, adding no movement for one dated before that day; such a purchase, reported after the notice (a late POS delivery, or a purchase dated before go-live), is in no period's set, so it and any refund application recorded for it outlive every period and the member delete fails on `purchase.member_id`. Second, "for each period 24 months after the member left" sets no order, and the SDD v1.6 review saw, outside its delta, that "nothing orders two overdue deletions of one member after an unrelated failure": with two periods due in one run, deleting the newer one first, and the member with it, fails on `membership_period.member_id`. Either way the member's one transaction rolls back every night, the ended period's personal data outlives the 24 months of [LOYALTY 03 § Membership end and data retention](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention), and `retention_overdue_rows` sends the operator to [SDD §20.1.16](../sdd-refunds-platform/16-operations-runbook.md#20116-retention-overdue), whose "Fix the cause" step has no designed fix: the failure mode SDD OI-44 removed for `movement_id`.
- **Options:**
  - **A.** In §7.3, delete a member's due periods oldest first in its one transaction; add to the first period's set the member's purchases dated before that period's start date (a first period opened by a rejoin notice), with their refund applications and the refunds left with none; delete `points_balance` and `member` only when no `membership_period` of the member remains; add both cases to the 13 §16.3 retention test; hand the set wording to sdd-unifier - every due deletion completes and no row names a deleted member; the LLD reads the SDD set for a case the SDD does not name until the SDD confirms it.
  - **B.** Keep the SDD set and skip the `member` and `points_balance` delete while a purchase still names the member - no key fails; the member number, those purchases and their refund rows stay indefinitely, against LOYALTY 03.
  - **C.** Keep the text and leave both cases to `retention_overdue_rows` - no change; the period's history outlives its 24 months until an operator edits production data under no stated rule.
- **Recommendation:** A; oldest-first deletion of due periods, the pre-start purchases in the first period's set, `member` and `points_balance` deleted after the last remaining period, two more test cases, and the Retention Policy wording raised through sdd-unifier.
- **Why:** SDD 13e deletes `member` and `points_balance` "with their last membership period", and this LLD keeps every key at NO ACTION (§7.3, 05 §8.6), so no row may still name the member at that point, and LOYALTY 03 deletes a former member's history 24 months after they leave; a purchase dated before the first known period comes from a time that ended before that period began, so deleting it with that period never shortens its retention, and oldest-first order makes "the last period" the last remaining one. The tradeoff accepted: an LLD reading of the SDD set, pending its confirmation upstream, and two more integration cases.
- **Status:** Resolved - accepted recommendation applied in 1.3

### OI-10: Step 4 has no rule for the notices that opened or closed a period

- **Where:** loyalty-points §7.3 ([notice and retention](./04-implementation/loyalty-points.md#loyaltypointsserviceimplnotice-and-retention): former-member-retention step 4 and the notice replay); 13 §16.3
- **Type:** Missing edge case
- **Concern:** Step 4 deletes "the period with the notices that opened or closed it", but a `membership_notice` row names no period (its key columns are member number, type and `effective_on`, 05 §8.2), and the [SDD membership model](../sdd-refunds-platform/13e-service-loyalty-points.md#business-logic) opens a period on the rejoin day "or from the next day when it is dated on the day of leaving". After a same-day leave and rejoin ([LOYALTY/TC-BAL-10](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-mk-01--lp-01-nfr-03), [LOYALTY/TC-HIS-26](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-mk-02--lp-02-nfr-02)), the REJOIN notice that opened the kept period is dated on the ended period's last day: matching notices by the ended period's date range deletes it, so a later reconciliation that replays the stored notices in effective-date order (the §7.3 notice path) has lost the notice that opened the current membership, while matching a REJOIN only to the period whose `starts_on` equals its date never deletes it, so it outlives the member. A notice that opened or closed no period (for example a second LEAVE, with another date, for a member already former) has no deletion rule in the [SDD Retention Policy](../sdd-refunds-platform/13e-service-loyalty-points.md#retention-policy) at all. Each leak keeps a member number, personal data in the 13e Data Encryption list, after the member row is gone and past the 24 months of LOYALTY 03.
- **Options:**
  - **A.** State the match in §7.3: a LEAVE closed the period whose `ends_on` is its date; a REJOIN opened the period that starts on its date, or on the next day when its date is the previous period's `ends_on`; delete exactly those notices with each period, and with the member's last remaining period every remaining notice of that member number; add a same-day leave and rejoin case to the 13 §16.3 retention test (the kept period's REJOIN survives the ended period's deletion); hand the case of a notice that opened or closed no period to sdd-unifier - follows the SDD model with no schema change and leaves no notice past its member; one date rule that the notice path and the job must share.
  - **B.** Link each notice to the period it opened or closed with a new column - an exact match; a column SDD 13e Tables Design does not have, so an SDD change first and a migration of every notice writer.
  - **C.** Leave the match to the implementer - no text; either a current membership loses its opening notice or notices outlive the member.
- **Recommendation:** A; the same-day aware match, the last-period sweep of the member's notices, one more test case, and the uncovered notice case raised through sdd-unifier.
- **Why:** SDD 13e already fixes the same-day rule and that a notice is "deleted with the membership period it opened or closed", so A derives the match without changing an SDD-owned table, and the sweep ends the member number with the member row, as LOYALTY 03 and the 13e PII list require; B is exact but changes the SDD schema. The tradeoff accepted: a date rule kept in step between the notice reconciliation and the retention job, and one more test case.
- **Status:** Resolved - accepted recommendation applied in 1.3

### OI-11: Retention deletes purchase_lock rows that the lock acquisition assumes exist

- **Where:** loyalty-points §7.3 ([recordPurchase, applyRefund and correct](./04-implementation/loyalty-points.md#loyaltypointsserviceimplrecordpurchase-applyrefund-and-correct): the purchase-lock rule; [notice and retention](./04-implementation/loyalty-points.md#loyaltypointsserviceimplnotice-and-retention): former-member-retention and waiting-refund-check); 13 §16.3
- **Type:** Concurrency hazard
- **Concern:** Every purchase-related path "inserts purchase_lock if absent then locks it first", and the new retention text deletes the lock row itself ("purchase_lock goes with the last purchase and refund of its reference"), in former-member-retention, which states no lock, and in waiting-refund-check, which works "under the purchase lock". Under PostgreSQL READ COMMITTED, a `SELECT ... FOR UPDATE` that waits on a row whose deleting transaction then commits returns no row, and the insert-if-absent step before it found the row present and inserted nothing, so a POS report or a missing-purchase correction on that purchase reference ends its acquisition holding no lock: it fails if the code checks, or runs unserialized if it does not, against SDD 13e One purchase at a time ("so each step sees the committed result of the one before it"). The window is small (a step on a reference at the moment its last rows are deleted) and mostly self-healing, but the acquisition is the module's only serialization of a purchase and the pseudocode leaves its behaviour under deletion to each repository call; the gap is a missing rule, not the generic verification CONFIRM-05 asks for.
- **Options:**
  - **A.** Acquire the purchase lock with one statement that always ends holding a row (an `INSERT ... ON CONFLICT (tenant_id, purchase_reference) DO UPDATE` no-op, which PostgreSQL resolves to an insert or an update under concurrency, or an insert-then-lock loop until the row comes back), and let both jobs delete a `purchase_lock` row only while holding it, after rechecking that no purchase or refund of its reference remains; add a Testcontainers barrier case (a job deletes the last purchase and refund of a reference while a POS report of that reference for another member waits; the report ends holding a lock row and records its purchase once) - the lock survives the deletion the Retention Policy requires; one PostgreSQL-specific statement in the repository.
  - **B.** Never delete `purchase_lock` rows - no race; keeps purchase references, personal data in the 13e Data Encryption list, against the 13e Retention Policy.
  - **C.** Leave it to implementation - no text; whether a waiter fails or runs unlocked depends on how each repository call is written.
- **Recommendation:** A; an always-locking acquisition, lock-row deletion only under that lock, and one barrier test.
- **Why:** SDD 13e makes the purchase lock the serialization of every step on one purchase and its Retention Policy deletes the lock row, so the acquisition must tolerate that deletion; A keeps the purchase-first order of OI-03's resolution (no member lock is held while a purchase lock is taken) and adds no new lock order. The tradeoff accepted: a database-specific acquisition statement and a recheck in each job before the row goes.
- **Status:** Resolved - accepted recommendation applied in 1.3

### OI-12: The API-07 to API-09 calls have no transaction rule, and API-09 no service operation or run mapping

- **Where:** loyalty-points [§7.2](./04-implementation/loyalty-points.md#72-class--interface-map) (Method Signatures), §7.3, [§7.6](./04-implementation/loyalty-points.md#76-transaction-boundaries); 01 §3 A-04
- **Type:** Implementation gap
- **Concern:** SDD 1.7 settles that POS Records, the Customer Accounts team and the Marketing team call the provider routes ([SDD §3 Assumption 8](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions)), with "one record or a batch per call" still to come ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)), and A-04 makes `LoyaltyFeedAdapter` an inbound HTTP adapter, but the refresh kept the module's provider path as it was. §7.6 sets no boundary for the adapter, so a batch built as one transaction, the natural reading of an atomic batch, would take one purchase lock after another while holding member locks, against the §7.3 rule never to keep a member lock while acquiring another purchase lock, and would roll back the records that applied with the one that did not; [SDD 13e Error Handling](../sdd-refunds-platform/13e-service-loyalty-points.md#error-handling) answers an unappliable record with an error "so that the sender retries it", which works only if each record commits alone and the business keys of [13e API Standards](../sdd-refunds-platform/13e-service-loyalty-points.md#api-standards) skip the applied ones on the resend. API-09 has an adapter row and an authorization row in §7.2 but no `LoyaltyPointsService` operation and one line in §7.3, while SDD 13e keeps `go_live_import` at "One row per run" (RUNNING, COMPLETED or FAILED, with counts) and [SDD §11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default) promotes to Prod only with the balances "delivered and imported": with one call or a batch of calls, nothing says which call opens or closes a run, or what the gate and the R-03 totals check read. The SDD v1.7 review saw the run question and left it for its owner, next to the question SDD OI-22 left to the LOYALTY owner.
- **Options:**
  - **A.** Add an opening-balance operation to `LoyaltyPointsService`; state in §7.6 that `LoyaltyFeedAdapter` holds no transaction and each record (a purchase, a notice, one member's opening balance) runs in its own REQUIRED service transaction, purchase lock first when it names a purchase; answer a call with the provider's error form (`TBD - external`) when any of its records failed; add a `> TODO:`, home SDD 13e Tables Design and §11.3 through sdd-unifier, for how calls map to `go_live_import` runs and what the gate reads - buildable for either call pattern without deciding an SDD-owned record; one more TODO until the Marketing team and the owner answer.
  - **B.** As A, and also decide in the LLD that each API-09 call is one `go_live_import` run with its own counts - complete for the implementer; fixes the meaning of an SDD table and the input of the §11.3 gate and the R-03 totals check, which SDD v1.7 left to their owner.
  - **C.** Wait for TODO-25 to TODO-27 - no rework if a provider's form surprises; until then the adapter has no transaction rule and API-09 no operation.
- **Recommendation:** A; the API-09 service operation, per-record transactions in §7.6, the batch answer rule, and a TODO for the run mapping.
- **Why:** per-record commits are what the resend in SDD 13e Error Handling and the business keys of 13e API Standards rely on, and they keep the purchase-before-member lock order for any call pattern; the run mapping is a fact of an SDD table and its promotion gate, which SDD v1.7 left to its owner, so the LLD flags it rather than deciding it. The tradeoff accepted: a batch is not atomic (the resend completes it), and one TODO stays open.
- **Status:** Resolved - accepted recommendation applied in 1.3

### OI-13: A-01 copies SDD §3 Assumption 7 and its owner

- **Where:** 01 §3 Assumptions (A-01; the risk cell of A-04)
- **Type:** Duplication
- **Concern:** The refresh re-sourced A-01 to [SDD §3 Assumption 7](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions) and added its owner, so the row now restates the SDD's own assumption ("One delivery team builds both products", "owned by the Head of Retail") with ADR-01's extraction trigger as its risk, and adds no implementation delta. sdd-to-lld.md maps SDD 01 Assumptions to LLD §3 as reference plus delta ("list ONLY LLD-specific implementation assumptions"), and its One fact, one home rule 5 makes such a restatement a review defect; the cost has already shown, since SDD 1.6 reworded Assumption 7 (owner added, the extraction-trigger sentence dropped) and forced this edit. A-04 is a reference plus delta (the adapter type and what to refresh) but repeats Assumption 8's file-or-feed clause in its risk cell.
- **Options:**
  - **A.** Delete A-01, open §3 with one line linking SDD §3 for the design assumptions (Assumptions 7 and 8 among them), and trim A-04's risk cell to its delta ("an SDD design change first, then a refresh of loyalty-points §7.2 and 06 §9.1") - one home for the assumption and its owner; a reader follows one link to see who owns it.
  - **B.** Keep A-01 as a sourced restatement - §3 reads on its own; its wording and owner must be re-edited on every SDD §3 change, as between 1.5 and 1.7.
- **Recommendation:** A; A-01 removed, a §3 lead-in link to SDD §3, and A-04's risk cell trimmed to its delta.
- **Why:** sdd-to-lld.md § Field mapping table (01 Assumptions) and § One fact, one home, rules 1 and 5, keep design assumptions and their owners in SDD §3; A-01 has no LLD-specific content to keep, while A-04's adapter consequence is an implementation assumption. The tradeoff accepted: the delivery-team assumption is one link away from the LLD.
- **Status:** Resolved - accepted recommendation applied in 1.3

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
| --- | --- | --- | --- |
| OI-01 | 2026-10-06 | 04-implementation and 14-frontend.md | Resolved; A; corrected signatures, class names and identifiers. |
| OI-02 | 2026-10-06 | 04-implementation/notifications.md and 09-cross-cutting.md | Resolved; A; source-message binding and explicit first error/result replay applied. |
| OI-03 | 2026-10-06 | 04-implementation/loyalty-points.md and 13-testing.md | Resolved; A; phase boundary and concurrency test plan applied. |
| OI-04 | 2026-10-06 | 14-frontend.md and 16-references.md | Resolved; A; corrected route data, workflow Screens and index. |
| OI-05 | 2026-10-06 | 04-implementation/refund-requests.md | Resolved; A; exact matching applied and all named entry-point annotations rechecked. |
| OI-06 | 2026-10-06 | 15-open-questions.md | Resolved; A; descriptions rebased; source module flags unchanged. |
| OI-07 | 2026-10-06 | 04-implementation/notifications.md and 04-implementation/payouts.md | Resolved; A; module-specific adapter/work diagrams and template Strategy applied. |
| OI-08 | 2026-10-06 | 14-frontend.md §17.9; out of scope for this release (test-fixture policy) | Rejected; A; reject the new behavior proposed in B and retain the source scope. |
| OI-09 | 2026-10-07 | 04-implementation/loyalty-points.md §7.3 and 13-testing.md §16.3 | Resolved; A; due periods deleted oldest first, the pre-start purchases in the first period's set (CONFIRM-23 routes the set wording to sdd-unifier), `points_balance` and `member` deleted once no period remains, two more test cases. |
| OI-10 | 2026-10-07 | 04-implementation/loyalty-points.md §7.3 and 13-testing.md §16.3 | Resolved; A; the same-day aware notice match, the last-period sweep of the member's notices (CONFIRM-24 routes the uncovered case to sdd-unifier), one more test case. |
| OI-11 | 2026-10-07 | 04-implementation/loyalty-points.md §7.3 and 13-testing.md §16.3 | Resolved; A; an always-locking purchase_lock acquisition, lock-row deletion only while held after a recheck, one barrier test. |
| OI-12 | 2026-10-07 | 04-implementation/loyalty-points.md §7.2, §7.3 and §7.6 | Resolved; A; `importOpeningBalance`, per-record transactions for `LoyaltyFeedAdapter`, the error answer for a call with a failed record, and TODO-38 for the run mapping. |
| OI-13 | 2026-10-07 | 01-purpose-and-scope.md §3 | Resolved; A; A-01 removed, a §3 lead-in link to SDD §3, A-04's risk cell trimmed to its delta. |

## Reviewer Notes

| Service | Risk surface | Checked | Findings | What was checked |
| --- | --- | --- | --- | --- |
| customer-accounts | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/customer-accounts.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| customer-accounts | Transactions | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| customer-accounts | Idempotency | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| customer-accounts | Multi-tenancy | Yes | No issue found | 04-implementation/customer-accounts.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| customer-accounts | Outbox | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| customer-accounts | Saga compensation | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| customer-accounts | Retry and backoff | Yes | No issue found | 04-implementation/customer-accounts.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| customer-accounts | Observability | Yes | No issue found | 04-implementation/customer-accounts.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| customer-accounts | Test coverage | Yes | No issue found | 04-implementation/customer-accounts.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| customer-accounts | Schema versioning | Yes | No issue found | 04-implementation/customer-accounts.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| customer-accounts | Duplication | Yes | OI-01 | 04-implementation/customer-accounts.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| loyalty-points | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/loyalty-points.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| loyalty-points | Transactions | Yes | OI-03 | 04-implementation/loyalty-points.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| loyalty-points | Idempotency | Yes | No issue found | 04-implementation/loyalty-points.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| loyalty-points | Multi-tenancy | Yes | No issue found | 04-implementation/loyalty-points.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| loyalty-points | Outbox | Yes | No issue found | 04-implementation/loyalty-points.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| loyalty-points | Saga compensation | Yes | No issue found | 04-implementation/loyalty-points.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| loyalty-points | Retry and backoff | Yes | No issue found | 04-implementation/loyalty-points.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| loyalty-points | Observability | Yes | No issue found | 04-implementation/loyalty-points.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| loyalty-points | Test coverage | Yes | No issue found | 04-implementation/loyalty-points.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| loyalty-points | Schema versioning | Yes | No issue found | 04-implementation/loyalty-points.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| loyalty-points | Duplication | Yes | OI-01 | 04-implementation/loyalty-points.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| notifications | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/notifications.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| notifications | Transactions | Yes | OI-02 | 04-implementation/notifications.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| notifications | Idempotency | Yes | OI-02 | 04-implementation/notifications.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| notifications | Multi-tenancy | Yes | No issue found | 04-implementation/notifications.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| notifications | Outbox | Yes | OI-07 | 04-implementation/notifications.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| notifications | Saga compensation | Yes | No issue found | 04-implementation/notifications.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| notifications | Retry and backoff | Yes | No issue found | 04-implementation/notifications.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| notifications | Observability | Yes | No issue found | 04-implementation/notifications.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| notifications | Test coverage | Yes | OI-02 | 04-implementation/notifications.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| notifications | Schema versioning | Yes | No issue found | 04-implementation/notifications.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| notifications | Duplication | Yes | OI-01 | 04-implementation/notifications.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| payouts | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/payouts.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| payouts | Transactions | Yes | No issue found | 04-implementation/payouts.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| payouts | Idempotency | Yes | No issue found | 04-implementation/payouts.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| payouts | Multi-tenancy | Yes | No issue found | 04-implementation/payouts.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| payouts | Outbox | Yes | OI-07 | 04-implementation/payouts.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| payouts | Saga compensation | Yes | No issue found | 04-implementation/payouts.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| payouts | Retry and backoff | Yes | No issue found | 04-implementation/payouts.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| payouts | Observability | Yes | No issue found | 04-implementation/payouts.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| payouts | Test coverage | Yes | No issue found | 04-implementation/payouts.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| payouts | Schema versioning | Yes | No issue found | 04-implementation/payouts.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| payouts | Duplication | Yes | OI-01 | 04-implementation/payouts.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| refund-requests | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/refund-requests.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| refund-requests | Transactions | Yes | No issue found | 04-implementation/refund-requests.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| refund-requests | Idempotency | Yes | No issue found | 04-implementation/refund-requests.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| refund-requests | Multi-tenancy | Yes | No issue found | 04-implementation/refund-requests.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| refund-requests | Outbox | Yes | No issue found | 04-implementation/refund-requests.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| refund-requests | Saga compensation | Yes | No issue found | 04-implementation/refund-requests.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| refund-requests | Retry and backoff | Yes | No issue found | 04-implementation/refund-requests.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| refund-requests | Observability | Yes | OI-05 | 04-implementation/refund-requests.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| refund-requests | Test coverage | Yes | No issue found | 04-implementation/refund-requests.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| refund-requests | Schema versioning | Yes | No issue found | 04-implementation/refund-requests.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| refund-requests | Duplication | Yes | OI-01 | 04-implementation/refund-requests.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| global | Contract drift (SDD §14/§15/§16) | Yes | OI-02, OI-07 | Ten catalog rows and DTO ownership; three exact port contracts; all endpoint/port tokens checked against source register |
| global | Specs-body | Yes | No issue found | Mission SDD §1; stack §6.3 vs Specs; five phases/modules and Greenfield source type; no local pins |
| global | Use-case traceability | Yes | OI-01, OI-04, OI-05, OI-06 | Nine source rows, eight workflows/specs, all 154 source cases, nine screens/fifteen routes; exact owner/entry/Related UC and resolving links |
| 2026-10-07 delta: 01-purpose-and-scope.md | Duplication; contract drift (SDD §3 Assumptions 7 and 8, ADR-01); links | Yes | OI-13 | §1 link to SDD 1.7; A-01 and A-04 against the v1.7 text of SDD §3 Assumptions 7 and 8, the ADR-01 Why and extraction trigger, and the sdd-to-lld.md 01 Assumptions row and One fact, one home rules 1 and 5; A-04 against the §15.2 External inbound type, the §11.6 provider routes and the loyalty-points adapter rows; both §3 links and the ADR-01 link resolve |
| 2026-10-07 delta: 04-implementation/loyalty-points.md | Error envelope (RFC 9457); Transactions; Idempotency; Multi-tenancy; Outbox; Saga compensation; Retry and backoff; Observability; Test coverage; Schema versioning; Duplication | Yes | OI-09, OI-10, OI-11, OI-12 | Take-back write order against Figure 27 and the Tables Design (movement before its application, `movement_id` NULL at delta 0, both in the listener transaction with its inbox row, so a duplicate rolls back both); retention steps 1 to 4 against the 13e Retention Policy, every NO ACTION key of 05 §8.2, the membership model (first-sight rules, same-day rejoin, date-order notices) and SDD OI-43 and OI-44; the purchase-lock rule against 13e One purchase at a time and READ COMMITTED delete semantics; the API-07 to API-09 path (§7.2, §7.3, §7.6) against SDD §3 Assumption 8, §15.3, §15.6, INT-06, §11.3 and 13e Error Handling; no new HTTP error (provider answers stay `TBD - external`); the module publishes nothing and gains no compensation; jobs run per registry tenant under RLS; failures logged by id and `retention_overdue_rows` per 13e; OI-03's purchase-first order unchanged; considered, not raised (outside the delta, SDD set unchanged by 1.6 and 1.7): a HELD purchase dated on or after a rejoin whose notice lands only after the ended period's due run is deleted with that period |
| 2026-10-07 delta: 05-data-model.md | Schema versioning (Flyway keys and indexes); Multi-tenancy; Duplication (sourced derived view); Retention (§8.6) | Yes | OI-09 | Scripted compare: the loyalty ERD equals Figure 27 line for line and the 54 loyalty §8.2 rows equal the 13e Tables Design cell for cell, each with its Source link; the three FKs new since 1.2 are composite (`tenant_id`, column) to a PK, the five new indexes start with `tenant_id`, and every key the deletion meets is indexed; NULL `movement_id`, `purchase_id` and `refund_id` pass the default MATCH SIMPLE; FK checks bypass FORCE RLS; Greenfield baseline, so no NOT VALID or backfill step; the §8.6 claim that the order removes every referring row fails in the OI-09 cases |
| 2026-10-07 delta: 06-api-contracts.md | Contract drift (SDD §15.3, §15.6); Multi-tenancy (API-09 tenant secret); Error envelope and versioning of provider routes; Duplication | Yes | No issue found | TODO-25 to TODO-27 against the v1.7 §15.3 markers and §15.6 rows of API-07 to API-09 (call pattern, URI, version, headers, body, expected response, error codes, auth); "resend behaviour" traced to 13e Error Handling (the sender retries, `TBD - external`); the API-09 tenant secret against §15.3 Credentials storage and §6 Secrets Management (SDD OI-47); API IDs and the provider table verbatim; no provider field invented; the TODOs reference §15.6 rather than copy a contract body; the §15.6 anchor resolves |
| 2026-10-07 delta: 13-testing.md | Contract, integration and e2e test coverage; naming; traceability tags | Yes | OI-09, OI-10, OI-11 | The new §16.3 retention case against SDD OI-44's late-notice case and the 05 §8.2 keys; methodName_scenario_expectedResult naming and real PostgreSQL per CLAUDE.md; the cases still missing are named in OI-09 (a member first seen through a rejoin notice, two periods due in one run), OI-10 (same-day leave and rejoin) and OI-11 (a job deleting a lock row a waiter needs); §16.8 rows unchanged, as are both BRD chunk 16 suites; considered, not raised: [LOYALTY/TC-NFR-07](../brd-loyalty-points/16-uat-bat-test-cases.md#7-nfr-acceptance-nfr-01nfr-07) stays BAT-only, though the retention test could carry its keyed tag for the 24 months and 1 day boundary |
| 2026-10-07 delta: 15-open-questions.md | Flag index consistency; Duplication | Yes | No issue found | TODO-25 to TODO-27 equal the 06 §9.1 TODOs word for word; TODO-18 (05 line 520), CONFIRM-05 (line 128), CONFIRM-06 (line 310) and TODO-25 to TODO-27 (06 lines 91, 93, 95) point at their flag lines; 37 TODO and 22 Confirm flags in the body match §18.5 and the 00 Confidence Flag Summary; no author flag covers the new retention text, so OI-09 to OI-12 duplicate none |
| 2026-10-07 delta: 16-references.md | Use-case traceability (§19.1 sources); links | Yes | No issue found | §19.1 SDD 1.7 Draft, E2E gate Open - Up to date, against the SDD 1.7 Changes Log and master gate line; REFUNDS 1.9 and LOYALTY 1.8 against the SDD Source BRDs register; the SDD Child LLDs row reads LLD 1.3 and SDD 1.7; SDD §7.3 not in rows 1.6 or 1.7, so §19.9 unchanged; all 1155 LLD links resolve (file and anchor), with no CRLF and no em dash |
| 2026-10-07 delta: decision-log.md | Refresh record; open-item status (sdd-to-lld.md Refresh triggers) | Yes | OI-12 | The 1.3 section against SDD Changes Log rows 1.6 and 1.7 and the sdd-to-lld.md field mapping, each mapped-and-changed and mapped-and-retained claim rechecked: the retained provider-side loyalty-points rows hold for credential-to-tenant mapping but not for the call pattern (OI-12); OI-01 to OI-08 against SDD OI-42 to OI-47, none settled, superseded or reopened; editorial, not raised: the 1.3 Changes Log row omits decision-log.md, which the 1.2 row lists, and counts two new FKs where §8.2 gained three since 1.2 |
| 2026-10-07 delta: global | Contract drift (SDD §14/§15/§16) | Yes | No issue found | §14 and §14.10 (`RefundPaidDto`) untouched by SDD 1.6 and 1.7, so 07 §10.6 and the loyalty listener rows stand; §15 changed only the API-07 to API-09 markers, the API-09 credential rows and §15.6, carried into TODO-25 to TODO-27; §16 tokens in loyalty §7.2 verbatim; no new API ID, event or token |
| 2026-10-07 delta: global | Specs-body | Yes | No issue found | 17-specs (still 1.2) against SDD §1 at 1.7 (only the ADR-01 bullet's team wording changed; the Mission does not cite it), §6 (only the Secrets Management Notes changed, outside §6.3 and the Tech Stack bullets) and §13 (unchanged); Roadmap modules and Greenfield type unchanged |
| 2026-10-07 delta: global | Use-case traceability | Yes | No issue found | BRDs unchanged (REFUNDS 1.9, LOYALTY 1.8); SDD 03 §7.3 not in rows 1.6 or 1.7; added LLD lines carry no unkeyed BRD ID; the retention and provider paths stay system workflows with no use case and no annotation; links resolve |

Author flags remain implementation verification work, not reopened reviewer findings. Mermaid was checked as text only; no renderer/Miro/external tool was used. Review disposition applies to this documentation fixture, not production code or legal approval.

- 2026-10-07 delta review (LLD 1.3): run by a cleared-context reviewer agent (Claude Code), scoped to the chunks of the 1.3 Changes Log row (01, 04-implementation/loyalty-points.md, 05, 06, 13, 15, 16, with decision-log.md) and to the SDD 1.5 to 1.7 change behind them (Changes Log rows 1.6 and 1.7, SDD OI-42 to OI-47), including retained chunks that change reaches; the BRDs did not change. OI-01 to OI-08 were read first and not re-raised; SDD 1.6 and 1.7 settle, supersede or reopen none of them (OI-11 applies OI-03's purchase-first order to the retention path without reopening it). New items: OI-09, OI-10, OI-11, OI-12 and OI-13, all Open; chunk 15 author flags were excluded. Mermaid was read as text only; no application test was run.
- 2026-10-07 decisions (LLD 1.3): under the fixed test-fixture policy the author accepted the recommended option A of OI-09 to OI-13; none adds business behaviour that no BRD states (OI-09 and OI-10 follow [LOYALTY 03](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention) and the SDD 13e Retention Policy, OI-11 and OI-12 are technical, OI-13 is documentation), so none was rejected. Applied in 01 §3, loyalty-points §7.2, §7.3 and §7.6, and 13 §16.3; the two upstream questions are CONFIRM-23 and CONFIRM-24 and the run mapping is TODO-38, all in chunk 15. No second review pass was dispatched: every new coverage row is checked with its evidence (SKILL.md step 7, item 4).


## CHK correction review - 2026-10-06

User approved the CHK triage. Codex re-read the corrected files from disk in this context. This is one LLD update, version 1.1. Existing TODO/Confirm flags remain source/implementation questions and are not new reviewer findings.

- Canonical Controllers columns restored in all five modules; all 15 registered entry points retain their source annotations, including the event and scheduled trigger.
- Removed three extra annotations from profile, movement-detail and branch-detail reads because SDD section 7.3 does not register those endpoints for the named UCs. Endpoint behavior and permission checks are unchanged.
- Six bare BRD IDs in API/review prose now use keyed source links. Historical OI meanings and decisions are unchanged.
- The 58 original reviewer coverage rows remain. Targeted checks cover annotation/register equality, route mappings, source case links and parent lineage; checker parser corrections are tracked in the CHK stage log.
- No new business scenario was added. No new person-only decision or mockup change was required by these LLD edits.

## R3d delta review - 2026-10-06

Separate same-context disk reread under resume-codex.md: chunk 18 first, then chunk 15, current LLD/Specs, upstream SDD/BRDs and disk templates. This is not an independent model or context reset. Scope is the v1.2 Changes Log and its upstream deltas. Each changed module is checked across all eleven required surfaces; global checks cover contracts, Specs and use-case trace. Existing OI-01 to OI-08 remain seven Resolved and one Rejected; no item is settled, superseded or reopened by this refresh. No new OI is warranted by this pass. Author flags remain separate implementation/provider work.

| Date | Changed chunk | Checked surfaces and evidence | Findings |
| --- | --- | --- | --- |
| 2026-10-06 | 01-purpose-and-scope.md | Mission/scope vs SDD 01, owner-only objective/tally excluded from product scope; no new schema or endpoint. | Checked: no new issue found |
| 2026-10-06 | 04-implementation/loyalty-points.md | All eleven module surfaces: tenant-zone month boundaries, row preservation, current-tenant role guard, snapshot read, no complaint join/publication, existing lock order and source errors, owner BAT split, durable listener context and versioned DTO homes. | Checked: no new issue found |
| 2026-10-06 | 04-implementation/refund-requests.md | All eleven module surfaces: tenant/branch guards; purchase-before-request lock and current confirmation cap; replay/publication atomicity unchanged; cutoff history excludes later transitions; first-decision/Paid denominators and nulls; provider retry/compensation unchanged; current keyed cases and fixture assertions. | Checked: no new issue found |
| 2026-10-06 | 06-api-contracts.md | Nullable report mapping vs SDD 13b; no new fields; API-06/API-11 staff source distinct from provider contract gaps; all fourteen API IDs, port operations and source DTO/error/transaction/token bindings retained. | Checked: no new issue found |
| 2026-10-06 | 09-cross-cutting.md | Staff refresh source and failure fallback vs INT-05; staff data single source home; durable outbox and tenant/MDC restoration unaffected; provider timeouts remain flagged. | Checked: no new issue found |
| 2026-10-06 | 11-security.md | BO-05 and source staff basis, deciding manager included; superseded FX-03 documented; retention, permissions, PII inventory, erasure and log restrictions unchanged. | Checked: no new issue found |
| 2026-10-06 | 12-performance.md | LOYALTY/NFR-01 atomic invariant distinct from owner business tally; planned tests only; source latency/availability targets unchanged. | Checked: no new issue found |
| 2026-10-06 | 13-testing.md | Every source case/Related UC and new case link; cap barrier plan, report snapshot/null/denominator/export assertions; outside-product objective/tally evidence explicitly manual; no BAT results or executable test pass claimed. | Checked: no new issue found |
| 2026-10-06 | 14-frontend.md | Nullable averages and export representation; empty-state counts; exact screen/UC rows and route data; report routes screen-only; no new complaint UI or filters. | Checked: no new issue found |
| 2026-10-06 | 16-references.md | Upstream source versions/state, nine row order/title/owner/entry point groups, workflow/screens/routes/case sets and spec homes in both directions; full link/key checks. | Checked: no new issue found |
| 2026-10-06 | 17-specs.md | Mission vs changed SDD 01; each stack bullet equals SDD 02 and LLD 03; unchanged five-module roadmap and Greenfield/from-sdd direction; no invented pins. | Checked: no new issue found |
| 2026-10-06 | 18-open-items-and-clarifications.md | Existing eight items/decisions checked first, none settled/superseded/reopened; author flags excluded; new dated delta coverage only. | Checked: no new issue found |
| 2026-10-06 | decision-log.md | One request/one version, authorized direction/refresh; FX-03 supersession with named DPO fixture owner; rejected SME-05 remains out of scope; no erased historical decisions. | Checked: no new issue found |

Mapped destinations that already agree with the changed sources were checked and retained, as recorded in the R3d refresh audit. FX-03 supersession is recorded in the decision log, while the current staff basis stays at SDD §11.6. Mermaid blocks were read as text with heuristics; no renderer or parser was used. Application tests and BAT are still planned.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 17-specs.md | NEXT: none -->
