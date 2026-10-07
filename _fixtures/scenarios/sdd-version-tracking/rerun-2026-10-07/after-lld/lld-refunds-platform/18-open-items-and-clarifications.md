<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: all preceding LLD chunks
PART OF: LLD - Refunds Platform
PURPOSE: Output of the post-generation cleared-context reviewer pass. Captures implementation-level gaps, missing edge cases, untested error paths, and pattern application questions flagged by an independent reviewer. Complements (does not replace) chunk 15 (Open Questions / confidence-flag index), which is author-generated.
GENERATED_BY: lld-unifier post-generation reviewer (cleared-context subagent run after the main LLD generation completes).
RELATIONSHIP_TO_15: chunk 15 indexes the author's own `> Confirm:` and `> TODO:` flags emitted during generation. Chunk 18 captures the *external* reviewer's adversarial findings - gaps the author did not flag inline.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of implementation-level concerns identified after the main LLD was authored, by a reviewer running with cleared context. Items are not blockers in themselves - they are decisions the implementer or technical lead needs to make before code can be written confidently.
>
> **What this section is not.** It is not a list of inline `> Confirm:` or `> TODO:` flags found in the body - those are indexed in chunk 15 (Open Questions). This section is the reviewer's *external* findings: edge cases the body did not consider, pattern applications that look wrong, error paths that were assumed away.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Service name + sub-section (e.g., `wallet-core / Method Pseudocode`), or "global" if cross-cutting. |
| **Type** | Implementation gap / Missing edge case / Pattern misapplication / Error path / Concurrency hazard / Transaction boundary / Idempotency gap / Multi-tenancy leak / Test gap / Drift (hybrid-mode only) / Contract drift (vs SDD §14/§15/§16) / Specs-body mismatch / Duplication (SDD content restated instead of referenced) / Traceability gap (a use case, route, test case, spec, or entry point the trace misses, a link that does not resolve, or a BRD ID without its key) / Missing scenario (behaviour the design needs that no BRD use case covers; never a new UC). |
| **Concern** | One paragraph. What was missed and why it matters for code correctness or production reliability. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommendation** | REQUIRED. The reviewer's suggested option - always pick one, even for close calls (state that it is a close call in the Why). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins - the evidence behind it (CLAUDE.md rule, SDD contract, code fact, correctness/production risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open / Resolved (link to LLD update) / Deferred (with rationale). |

---

## Open Items

### OI-01: Propagation declared on self-invoked methods never applies

- **Where:** global (payout-service / § 7.3 and § 7.6 `settle`; notification-service / § 7.3 and § 7.6 `settle`; loyalty-service / § 7.6 `importPage`, `closeExpiredPending`; refund-service / § 7.6 `flagOverduePayouts`; 07 § 10.6 `dispatch`)
- **Type:** Transaction boundary
- **Concern:** The 7.6 tables put `REQUIRES_NEW` on methods that the same class calls through `this`: `PayoutServiceImpl.send` calls `settle`, `NotificationServiceImpl.send` calls `settle`, `PurchaseImportServiceImpl.runImport` runs `importPage` and `closeExpiredPending`, and `EventPublicationDispatcher.onRecorded` calls `dispatch`; none of them is on the interface the caller goes through, and `flagOverduePayouts` opens its per-row transactions inside its own loop with no mechanism named. Spring's proxy-based `@Transactional` ignores self-invocation. In payout-service `settle` then runs with no transaction (its caller `send` is `NOT_SUPPORTED`), so `PayoutEventOutboxAdapter.append` (`MANDATORY`) throws and no payout ever settles. In loyalty-service the cursor `findForUpdate` runs outside a transaction and the movement, balance, and cursor writes stop committing together, against SDD §17.4 ("the cursor advances in the same transaction") and LOYALTY/NFR-01. The after-commit `dispatch` runs the `MANDATORY` take-back with no transaction, so only the replay job (another bean) ever completes a `RefundPaid`.
- **Options:**
  - **A.** Move each unit of work into its own bean behind an interface (`PayoutSettlement.settle`, `MessageSettlement.settle`, `PurchasePageImporter.importPage` and `closeExpiredPending`, `OverduePayoutFlagger.flag`, and `dispatch` called from a separate listener bean) - the 7.6 declarations become true and each unit can be mocked; a few more classes.
  - **B.** `TransactionTemplate` with `PROPAGATION_REQUIRES_NEW` inside the loops - no new classes; the transaction rules move from the 7.6 tables into method bodies.
  - **C.** AspectJ weaving so self-invocation is intercepted - fixes every case at once; a new build toolchain dependency that CLAUDE.md asks about first.
- **Recommendation:** A. Extract the five units into separate beans, keep the declarative propagation each 7.6 table states, and add one integration test per unit that asserts an active transaction and atomic rollback (fail after the first write, assert nothing committed).
- **Why:** The payout outbox and the points ledger both depend on these boundaries (REFUNDS/NFR-01, LOYALTY/NFR-01); A keeps them in the tables implementers read and follows CLAUDE.md composition over inheritance, at the cost of five small classes, where B scatters the rule and C adds a dependency.
- **Status:** Open

---

### OI-02: The card-paid cap is applied per request, not per receipt

- **Where:** refund-service / § 7.3 `ReceiptLookupServiceImpl.lookup` and `RefundRequestServiceImpl.submit`
- **Type:** Missing edge case
- **Concern:** SDD §17.1 caps the refundable amount of a split-tender receipt at its card-paid amount, and REFUNDS/UC-01 BR-2 (one refund per item) with A1 (already-refunded items shown but not selectable) means one receipt can carry several requests. The LLD caps each request alone: `refundableCap = receipt.cardPaidAmount` and `amount = min(sum(selected lines), receipt.cardPaidAmount)`, while `existsActiveItemLines` returns line ids only. A 100.00 EUR receipt paid 50.00 by card and 50.00 in cash can be refunded 50.00 to the card twice, through two requests on different lines, and two concurrent submissions on one receipt are not serialised either. The second payout either exceeds what CardPay can refund (a day of refusals, then `PAYOUT_FAILED`) or returns cash-paid money to the card, against REFUNDS/NFR-01 and the card-only constraint of REFUNDS 02.
- **Options:**
  - **A.** Cap per receipt: remaining cap = card-paid amount minus the requested or approved amounts of the receipt's active requests (SUBMITTED, APPROVED, PAID); return it as `refundableCap` and re-check it in `submit` under a transaction-scoped advisory lock on (tenant, receipt number) - correct across requests and under concurrency; one aggregate query and one lock per submit.
  - **B.** One active request per split-tender receipt - simple; blocks legitimate later requests on untouched items.
  - **C.** Rely on CardPay refusing an over-refund - no code; turns an input error into a day of failed payouts.
- **Recommendation:** A. Add `sumActiveAmountsByReceipt(tenantId, receiptNumber)`, compute the remaining cap in `RefundEligibilityPolicy.evaluate`, take `pg_advisory_xact_lock` on the (tenant, receipt number) hash as the first statement of the submit transaction and re-check there, and add integration tests for two sequential and two concurrent requests on one split-tender receipt.
- **Why:** The SDD cap is a money rule on the receipt, and only A keeps the total card refund within the card-paid amount (REFUNDS/NFR-01); the tradeoff is one query and one per-receipt lock at about 40 submissions a day.
- **Status:** Open

---

### OI-03: A PAYOUT_SUCCEEDED outside APPROVED is logged and dropped

- **Where:** refund-service / § 7.3 `PayoutOutcomeServiceImpl.applyPayoutSucceeded`
- **Type:** Contract drift
- **Concern:** Step 4 returns after a WARN when the request is not APPROVED, and after a DEBUG when it is PAID, committing the inbox row in both cases. A `PAYOUT_SUCCEEDED` for a SUBMITTED, REJECTED, or CANCELLED request means money left for a refund nobody approved, and one for a PAID request whose `aggregate_id` differs from the stored `payout_id` is a second payout; both are what REFUNDS/NFR-01 forbids, and the design keeps only a log line. SDD §14.6 item 4 and the §17.1 Integrations row say invalid transitions dead-letter with an alarm and are never silently dropped, while the §17.1 Consumed events table says "ignored and logged"; the LLD took the weaker wording without flagging the conflict, although the chunk 10 consistency rule says divergences are flagged, never silently reconciled.
- **Options:**
  - **A.** Throw a non-retryable exception (DLQ plus the money-path page) for a `PAYOUT_SUCCEEDED` on a request that is not APPROVED, and on a PAID request with a different payout id; keep a same-payout redelivery a DEBUG no-op; treat `PAYOUT_FAILED` on SUBMITTED, REJECTED, or CANCELLED the same way - every money anomaly pages and stays replayable; operations handles rare DLQ records.
  - **B.** Keep ignore-and-log and add a counter with an alert - no DLQ traffic; the event is consumed and cannot be replayed once the cause is fixed.
- **Recommendation:** A, and raise the §14.6 versus §17.1 wording conflict to the SDD owner so the §17.1 Consumed events cell reads "otherwise dead-lettered".
- **Why:** SDD §14.6 is the registry rule and REFUNDS/NFR-01 is zero-tolerance; a dead-lettered record keeps the evidence and the RB-02 replay path, which a WARN line does not.
- **Status:** Open

---

### OI-04: Re-sending after a refusal with the same key replays the refusal

- **Where:** payout-service / § 7.3 `send` and `settle`; § 7.4 Pattern: Strategy (re-send guard)
- **Type:** Pattern misapplication
- **Concern:** Every attempt, including those after a definitive `Refused`, sends `payout.id` as CardPay's idempotency key, and `IdempotentKeyResendGuard` always answers `Send`. A provider that honours idempotency keys stores the first response under the key and returns it to every later request with that key, so once `payout.provider.idempotency-key-supported` is true, the one-day retry that REFUNDS/UC-04 E1 asks for ("the system tries again") can never change a refusal: it replays it until `PAYOUT_FAILED`, and the same holds for any error response the provider caches. SDD §17.2 asks for both a stable key (Developer Notes: avoid a new key on retry) and retries of refusals (Error Handling) without resolving the two, and the API-02 TODO names idempotency support but not this interaction.
- **Options:**
  - **A.** One key per unknown outcome: reuse `payout.id` while the outcome is unknown (timeout, connection failure, lease loss); after a refusal that CardPay documents as final with no payout created, send the next attempt with a derived key (`payoutId:attemptNo`) recorded on `payout_attempt`, preceded by a status query where available - retries become real; depends on CardPay's refusal semantics and an SDD Developer Notes change.
  - **B.** Treat a definitive refusal as terminal (`FAILED` and `PAYOUT_FAILED` at once) - simple; contradicts REFUNDS/UC-04 E1 and SDD §17.2.
  - **C.** Keep one key and confirm with CardPay that a refused key may be retried - no change if CardPay allows it; wrong for any provider that caches refusals.
- **Recommendation:** A. Add `idempotency_key` to `payout_attempt`, derive a new key only after a refusal the provider marks final, and add the question to 15 § 18.4 and SDD §17.2 for CardPay's documentation.
- **Why:** A keeps the double-payout guard wherever the outcome is unknown (REFUNDS/NFR-01) and makes the E1 retry meaningful where it is known; the tradeoff is one derived key per refused attempt, gated on the provider's semantics.
- **Status:** Open

---

### OI-05: Lease-lost outcomes leave no attempt row, so the duplicate proxy is blind

- **Where:** payout-service / § 7.3 `settle`
- **Type:** Error path
- **Concern:** `settle` returns on `p.version != c.version` before `attempts.insert`, so a worker whose lease expired during the API-02 call discards its outcome, `Accepted` included. That is the one path on which a double payout can happen (the lease expired and another replica re-sent), yet it leaves no `payout_attempt` row, while the SDD §17.2 Tables Design says one row per API-02 call and SDD §18.2 measures REFUNDS/NFR-01 as "no payout with more than one accepted API-02 attempt in `payout_attempt`". The proxy that the REFUNDS/TC-NFR-01 BAT observation relies on (13 § 16.8) cannot see the case it exists for.
- **Options:**
  - **A.** Record every API-02 outcome in its own short transaction before the version check, with a `lease_lost` flag, and page when a lease-lost outcome is `Accepted` - the proxy sees every call; one write per attempt.
  - **B.** Log lease-lost outcomes at WARN only - no schema change; the evidence lives only as long as the logs.
- **Recommendation:** A. Insert the attempt row first, then run the version-checked settle; add `payout_lease_lost_outcomes_total{outcome}` with a paging alert on `Accepted`, and a test that expires the lease during a stubbed accepted call.
- **Why:** SDD §18.2 makes `payout_attempt` the per-payout evidence for REFUNDS/NFR-01 until the §22 reconciliation exists; discarding the only double-payout signal defeats it, while A costs one row per attempt.
- **Status:** Open

---

### OI-06: Provider timeouts rely on TimeLimiter, which cannot bound a synchronous call

- **Where:** global (refund-service / § 7.4 Resilience4j on API-01; loyalty-service / § 7.4 on API-04; payout-service / § 7.4 on API-02; notification-service / § 7.4 on API-03; 09 § 12.3)
- **Type:** Pattern misapplication
- **Concern:** All four adapters are synchronous Spring `RestClient` calls, yet the timeouts of 09 § 12.3 sit on Resilience4j TimeLimiter instances (`posRecords`, `cardPay`, `msgHub`; "timeout from TimeLimiter" in `PosReceiptHttpAdapter`), and no connect or read timeout is set on any `RestClient`. A TimeLimiter bounds only a `CompletionStage` or `Future`; it cannot stop a blocking call on the caller's thread. A hung CardPay then holds a bulkhead slot with no end (five slots stall every payout), and the payout lease (`cardPayTimeout + 1 min`) assumes a timeout nothing enforces, so leases expire mid-call and trigger re-sends. Separately, `posRecords` allows 3 attempts at 3 s inside the customer's request, about 9.6 s in the worst case, against this LLD's own 3000 ms p99 for the lookup (12 § 15.1).
- **Options:**
  - **A.** Enforce each timeout as the connect and read timeout of the provider's `RestClient` request factory, drop TimeLimiter from the synchronous instances, derive the payout and message leases from the read timeout, and size posRecords attempts times timeout plus backoff under the lookup p99 - enforced by the transport; no threads added.
  - **B.** Run provider calls on a thread-pool bulkhead returning `CompletableFuture` so TimeLimiter applies - keeps the TimeLimiter config; cancelling the future does not abort the HTTP exchange, and it adds thread pools.
- **Recommendation:** A. Rewrite the Timeout column of 09 § 12.3 as the adapter's HTTP connect and read timeout, remove TimeLimiter from the four Policies rows, and add an adapter test against a stub that never answers.
- **Why:** CLAUDE.md requires a timeout on every provider call and the payout lease is safe only if the call ends before it; A enforces that with the client already chosen, while B adds concurrency machinery for no stronger guarantee.
- **Status:** Open

---

### OI-07: A concurrent retry with the same key gets 422 or 409 instead of the replay

- **Where:** refund-service / § 7.3 `submit`, `cancel`, `decide`; 09 § 12.2 In-flight handling
- **Type:** Idempotency gap
- **Concern:** 09 § 12.2 says a concurrent twin "hits the primary key, rolls back, and replays", but in every POST a business constraint fires first. In `submit` the twin waits on the counter row, then fails `ux_refund_item_active_line` at `saveAndFlush` (step 6d) and answers `ITEM_ALREADY_REFUNDED` (422) before it reaches the idempotency insert (step 6g); in `cancel` and `decide` it answers `REFUND_ALREADY_DECIDED` (409) through the status guard or the optimistic lock. A browser retry of a slow submission, the case the key exists for, tells the customer their own items are already refunded, against SDD §17.1 ("the Idempotency-Key makes a retried submission return the same request"). The prescribed "re-read r" after `OptimisticLockException` also runs inside a transaction already marked rollback-only, whose Hibernate session is no longer usable. The 09 § 12.2 Confirm asks to verify the design but does not name this defect.
- **Options:**
  - **A.** Serialise same-key requests: the business transaction's first statement takes `pg_advisory_xact_lock` on the hash of (tenant, subject, key) and re-checks the store, so the twin waits and then replays; map `OptimisticLockException` straight to 409 with no in-transaction re-read - no new state or dependency; one lock per POST.
  - **B.** Claim the key first with an `IN_PROGRESS` record in its own committed transaction; a twin gets 409 with `Retry-After` - the common shape; adds a state and a stale-claim expiry.
  - **C.** On any business conflict, re-check the store in a fresh transaction and replay when found - small change; every error branch must remember it.
- **Recommendation:** A, with integration tests that fire two concurrent requests with one key at each POST endpoint and assert the same status and body twice.
- **Why:** SDD §17.1 promises a replay and A delivers it for all three endpoints with one mechanism; B is sound but adds state the SDD did not ask for, and C spreads the rule across every conflict path.
- **Status:** Open

---

### OI-08: The idempotency fingerprint ignores the target resource

- **Where:** refund-service / § 7.3 `submit` step 1 and § 7.4 Pattern: Idempotency; 09 § 12.2; 14 § 17.2
- **Type:** Idempotency gap
- **Concern:** The request hash is `sha256(canonical(request))` over the body only and the key tuple is (tenant, subject, key), but `cancel` and `decide` carry their target in the path: every cancellation has the same empty body (`CancelRefundRequest()`) and every full approval the same `{type: APPROVE_FULL}`. A key reused for another refund request is then a hash match, so the server replays the first request's 200, the second request is never cancelled or approved, and the caller sees the wrong request's detail. The web app keeps the key "until the call succeeds or the body changes" (14 § 17.2), and Angular reuses the component when only the route parameter changes, so a key left by a failed call on one request can reach the next.
- **Options:**
  - **A.** Fingerprint = hash of method, route template, path variables, and canonical body; the same key with another fingerprint answers 409 `CONFLICT`; the web app also renews the key when the target id changes - misuse is refused, never replayed.
  - **B.** Add the route and path variables to the key tuple - no false replay; key reuse across resources succeeds silently and hides client bugs.
- **Recommendation:** A. Store the fingerprint in `request_hash`, state it in 09 § 12.2, reset the key signal on a route-parameter change in 14 § 17.2, and add a test that reuses one key for two cancellations.
- **Why:** SDD §15.1 answers 409 for a key reused with a different request, and a request is its target plus its body; A enforces that, whereas B lets the same client bug pass unnoticed.
- **Status:** Open

---

### OI-09: Several refunds of one purchase repeat the whole take-back

- **Where:** loyalty-service / § 7.3 `handleRefundPaid` and `runImport`; 05 § 8.2 `refund_takeback`, `member_balance`
- **Type:** Missing edge case
- **Concern:** One receipt can carry several refund requests (REFUNDS/UC-01 BR-2 is per item, and A1 shows already-refunded items), but each `RefundPaid` writes `-earned.points` for the whole purchase, deduplicated only by `refund_request_id`, so the second paid refund of a receipt takes the full points again. The import assumes one pending take-back per purchase (`findPendingByPurchaseReference` is singular and `ix_refund_takeback_pending` is not unique), so two PENDING_EARN rows either break the lookup, failing that page every hour, or get applied once. When the balance cannot absorb a repeated take-back, the `points >= 0` CHECK rolls the listener back and the publication replays every minute without end. OQ-03 settles the amount rule (proportional) but not the multiplicity, and `refund_takeback` stores no refunded amount, so a proportional take-back cannot be computed on the pending path.
- **Options:**
  - **A.** A take-back per refund against the purchase: store `paid_amount` and its currency on `refund_takeback`, compute each take-back from it by the OQ-03 rule, cap it at the purchase's earned points minus earlier take-backs, and let the import apply every PENDING_EARN row of the purchase in `paid_at` order - right for any number of refunds; two columns and a list lookup.
  - **B.** One take-back per purchase (dedupe on the purchase reference): the first refund takes the whole purchase, later ones are no-ops - simple; over-takes after a small first refund and conflicts with OQ-03.
- **Recommendation:** A, with tests for two refunds of one purchase before and after its import, and the cap turning an over-large take-back into a capped movement instead of a CHECK violation.
- **Why:** LOYALTY/NFR-01 and LOYALTY/UC-02 BR-1 hold only if each paid refund takes back its own share exactly once; A is what OQ-03's own recommendation needs, which today's columns cannot carry.
- **Status:** Open

---

### OI-10: A take-back racing the import leaves an orphan PENDING_EARN

- **Where:** loyalty-service / § 7.3 `handleRefundPaid` and `runImport`; § 7.6 Confirm
- **Type:** Concurrency hazard
- **Concern:** Under READ_COMMITTED the listener looks for the EARNED movement, misses it because the import's page transaction inserted it but has not committed, and writes PENDING_EARN; the import then looks for pending take-backs, misses the listener's uncommitted row, and commits the EARNED movement. Both commit, the pending row is never applied, and the first successful run a day later closes it as NO_EARN, so the points are never taken back (LOYALTY/UC-02 BR-1, LOYALTY/NFR-01). The window is a whole page transaction, and same-day refunds meet hourly imports. The § 7.6 Confirm says the balance lock serialises take-back and import writes, but the pending path touches no balance row and knows no member.
- **Options:**
  - **A.** Take `pg_advisory_xact_lock` on the hash of (tenant, purchase reference) first in `handleRefundPaid` and before each EARNED insert in the import, and let `closeExpiredPending` apply a pending row whose EARNED movement exists instead of closing it - the two paths serialise per purchase; one lock per record.
  - **B.** SERIALIZABLE isolation for both transactions with retry on serialization failure - no explicit locks; whole import pages retry under contention.
  - **C.** Only the close-time re-check - never loses the take-back; applies it up to a day late, against the one-hour LOYALTY/NFR-02.
- **Recommendation:** A, with an integration test that interleaves the two transactions on one purchase.
- **Why:** A closes the race at its source for one lock per purchase, keeps the one-hour budget, and keeps the re-check as a safety net; B is heavier for the import and C trades correctness for lateness.
- **Status:** Open

---

### OI-11: Native queries skip the @TenantId filter

- **Where:** refund-service / § 7.2 Repositories (`BranchReportQuery`, `existsActiveItemLines`) and 08 § 11.3 Daily branch report; loyalty-service / § 7.2 (`closePendingOlderThan`); 05 § 8.4
- **Type:** Multi-tenancy leak
- **Concern:** 05 § 8.4 makes Hibernate `@TenantId` the first line ("every JPA query gets `tenant_id = ?`"), but that filter does not apply to native SQL. The branch report is native SQL (§ 7.2) whose algorithm filters by `branch_id` only (08 § 11.3), although branch ids come from each tenant's POS Records and can repeat across tenants; `existsActiveItemLines(receiptNumber)` and `closePendingOlderThan(cutoff)` carry no tenant either, and nothing requires native or bulk statements to add one. RLS alone then stands between tenants, where SDD §11.2 requires a query filter and RLS as a second line, and CLAUDE.md forbids cross-tenant queries at the application layer.
- **Options:**
  - **A.** Every native or bulk statement takes an explicit `tenant_id = :tenantId` predicate, with a repository test per statement that seeds two tenants sharing a branch id and a receipt number - two lines everywhere; a few more parameters.
  - **B.** Accept RLS as the only line for native SQL and document it - no change; one wrong policy, or a test run as the owner role, exposes another tenant's rows.
- **Recommendation:** A. Add the predicate to the 08 § 11.3 query and the three repository signatures, and state in 05 § 8.4 that native SQL filters by tenant explicitly.
- **Why:** SDD §11.2 names two independent lines and CLAUDE.md makes cross-tenant access non-negotiable; A costs one parameter per native statement.
- **Status:** Open

---

### OI-12: Tenant and role binding per transaction is undefined for workers and listeners

- **Where:** global (05 § 8.4 Tenant filter enforcement; 09 § 12.1; 07 § 10.6 `dispatch`; refund-service / § 7.3 `applyPayoutSucceeded`; payout-service and notification-service / § 7.3 `claimNextDue`; 10 § 13.1)
- **Type:** Implementation gap
- **Concern:** `TenantContext.apply()` sets `app.tenant_id` as the first statement of a transaction, but listeners, claims, and the dispatcher learn the tenant inside it (`tenantContext.set(...)` is step 1 of `applyPayoutSucceeded`, follows the claim in `claimNextDue`, and follows the lookup in `dispatch`), and nothing says `set()` then issues `set_config`; if it does not, the inbox insert fails the RLS `WITH CHECK` and every payout event dead-letters. The policy casts `current_setting('app.tenant_id', true)::uuid`; on a pooled connection that has already run a tenant transaction the setting reverts to an empty string, not NULL, so any statement before `set_config` fails with an invalid-uuid error instead of seeing no rows. How a job runs as `<deployable>_worker` is not designed: 10 § 13.1 has `DB_WORKER_USER`, but no second DataSource or transaction manager exists. And the worker policy grants cross-tenant SELECT and UPDATE on `refund_request`, a domain table, where SDD §11.2 lets workers select due rows of their own work table and keeps "domain tables under the tenant policy". The 05 § 8.4 Confirm asks to verify these choices; this item names the defects.
- **Options:**
  - **A.** `TenantContext.set()` runs `set_config('app.tenant_id', ?, true)` at once inside an active transaction and unbinds in `finally`; policies read `NULLIF(current_setting('app.tenant_id', true), '')::uuid`; a second DataSource and transaction manager for `_worker`, used only by job and relay beans; the worker's cross-tenant policy on `refund_request` is SELECT-only, with updates made under the tenant policy - fail-safe on pooled connections and aligned with SDD §11.2.
  - **B.** `SET LOCAL ROLE <deployable>_worker` at the start of job transactions on the one app pool - a single pool; the app role must then be a member of the worker role, so any code path can escalate across tenants.
- **Recommendation:** A, with an integration test on a reused pooled connection that runs a tenant transaction, then a listener transaction, then a worker claim.
- **Why:** Every consumer, worker, and take-back crosses these lines on each message, so an unspecified binding either drops events or fails closed at random; A is the smallest precise mechanism and keeps domain rows out of cross-tenant writes as SDD §11.2 requires.
- **Status:** Open

---

### OI-13: Session advisory locks leak through the connection pool

- **Where:** global (09 § 12.4 `OutboxRelay.poll`; refund-service / § 7.3 `flagOverduePayouts`; loyalty-service / § 7.3 `runImport`; 07 § 10.6 replay job; 01 § 3 A-04)
- **Type:** Concurrency hazard
- **Concern:** The relays hold a session-level advisory lock "while this replica is leader", and the watchdog takes `pg_try_advisory_lock` with no unlock. A session lock belongs to one PostgreSQL connection, and the pooled connection returns to HikariCP after the call: the next poll borrows another connection, whose `tryAcquire` fails against the lock the earlier connection still holds, and skips; the lock goes away only when the pool retires that connection. The relay then publishes only when it happens to get the same connection, so the outbox stalls erratically, and a job that re-enters on the same connection stacks lock counts that are never released. A-04 chose advisory locks, but no connection handling or release is designed.
- **Options:**
  - **A.** `pg_try_advisory_xact_lock` as the first statement of a job-run transaction, released at commit or rollback, with per-row work in separate units (OI-01) - nothing survives on a pooled connection; each run holds one connection while it lasts.
  - **B.** A dedicated, non-pooled leader connection per lock with explicit `pg_advisory_unlock` and a liveness check - long-lived leadership; more code to own.
  - **C.** ShedLock - proven; a new dependency CLAUDE.md asks about first.
- **Recommendation:** A for the relays (one lock per poll), the watchdog, the publication replay, and the import, documented in 09 § 12.4 and A-04.
- **Why:** A keeps A-04's no-new-dependency choice and removes the leak by construction; the cost is one connection per running job, well within the 12 § 15.4 pool sizes at this volume.
- **Status:** Open

---

### OI-14: Trace context is lost at every persisted hand-off

- **Where:** global (09 § 12.4 relay headers; 05 § 8.2 `outbox_event`, `payout`, `notification_message`, `core_events.event_publication`; 09 § 12.8)
- **Type:** Implementation gap
- **Concern:** The relay sets `traceparent` "from the payload", but the SDD §14.3 envelope has no trace field and `outbox_event` no column for it, so each Kafka record carries the relay's scheduled-poll span and the consumer's trace starts at the relay, not at the customer's request. The same break occurs wherever work is parked in a table: payout-service keeps no context from the `REFUND_APPROVED` headers, so `PAYOUT_*` cannot carry it (SDD §17.2 Tracing: taken from those headers "and carried into `PAYOUT_*` events"); `notification_message` keeps none for the API-03 span; and `event_publication` keeps none for the listener link SDD §17.4 Tracing requires, which matters on replay. SDD §11.4 asks for one W3C trace from the web app through Kafka to the services.
- **Options:**
  - **A.** Persist `trace_context` (traceparent and tracestate) on `outbox_event` at append, `payout` at accept, `notification_message` at record, and `event_publication` at publish; the relay sets the Kafka header from it, and workers and the dispatcher start their spans linked to it - end-to-end traces with no contract change; four columns.
  - **B.** Add `traceparent` to the SDD §14.3 envelope - one mechanism for broker events; an SDD revision, and the parked tables still need it.
  - **C.** Correlate by `correlation_id` only - no change; contradicts SDD §11.4 and §17.2.
- **Recommendation:** A, with a test that asserts one trace id from `POST /v1/refund-requests` to the MsgHub stub call.
- **Why:** The SDD requires the trace across Kafka and the parked work, and A realises it inside this LLD's own tables; B changes a shared contract for what is transport metadata.
- **Status:** Open

---

### OI-15: No consumer-lag alert although readiness ignores Kafka

- **Where:** global (10 § 13.7 Alerts; the consumers of refund-service, payout-service, notification-service)
- **Type:** Implementation gap
- **Concern:** 10 § 13.2 says consumer lag, outbox backlog, and circuit-breaker alerts watch Kafka because readiness leaves it out, and SDD §17.2 and §17.3 Deployment Strategy say the same, but 10 § 13.7 has no consumer-lag alert. A stalled `payout-service` group (a hung database call, a rebalance loop) delays every payout and only `RefundPayoutOverdue` notices, about 25 hours after approval; a stalled `notification-service` group silences customer messages with no page at all.
- **Options:**
  - **A.** `ConsumerLagHigh` per group on `kafka_consumer_lag` (lag above a threshold for 10 minutes), paging for `payout-service` and `refund-service`, warning for `notification-service`, with a runbook entry - minutes instead of a day; one threshold to tune.
  - **B.** Rely on the watchdog and the outbox backlog - no change; up to a day of silent payout delay.
- **Recommendation:** A, with the threshold marked as a best guess until SDD §18.2 sets the event latencies.
- **Why:** The SDD names consumer-lag alerts as the Kafka health signal once readiness drops it, and CLAUDE.md alerts on service objectives such as payout timeliness; A is one rule per group.
- **Status:** Open

---

### OI-16: Exceptions before settle loop forever and keep the payload

- **Where:** notification-service / § 7.3 `send` and `claimNextDue`, § 7.7 (the same shape in payout-service / § 7.3 `send`)
- **Type:** Error path
- **Concern:** § 7.7 says a `PayloadDecryptionException` marks the message FAILED, but `send` decrypts, looks up the template, and renders with no handler, so any exception there skips `settle`: the message stays PENDING with `next_attempt_at` at the lease end, is claimed again, `attempt_count` grows past `MESSAGE_MAX_ATTEMPTS` (the claim never checks it), and it never becomes FAILED. The encrypted address stays in `delivery_payload` with no end, against SDD §17.3 (erased when final), and the old key version can never be retired (11 § 14.3). `TEMPLATE_MISSING` reaches `settle` as an ordinary failure and is retried eight times. payout-service `send` has the same shape; there the watchdog eventually flags the refund, but no `PAYOUT_FAILED` is ever written.
- **Options:**
  - **A.** Catch everything between claim and provider call and pass it to `settle` as an outcome: decryption failure and missing template terminal (FAILED, payload erased, `notifications_failed_total{reason}`), anything else a retryable failure; the claim takes only rows under the attempt limit and fails the rest - every message ends; a few mapping branches.
  - **B.** Keep the loop and alert on the age of `notifications_pending` - no code; contact data stays at rest and attempts are unbounded.
- **Recommendation:** A, and in payout-service map an unexpected exception in `send` to `TransientFailure` so the retry window and `PAYOUT_FAILED` still apply; add tests with a corrupt payload and a missing template.
- **Why:** SDD §17.3 requires the payload erased when final and the §12 INT-02 attempt limit to end retries; A guarantees both, while B keeps customer contact data encrypted at rest indefinitely.
- **Status:** Open

---

### OI-17: The problem handler misses framework and security exceptions

- **Where:** refund-service / § 7.4 Pattern: RFC 9457 error model (`GlobalProblemHandler`, shared with loyalty-service); 09 § 12.6
- **Type:** Error path
- **Concern:** `GlobalProblemHandler` has three handlers: `ServiceException`, `MethodArgumentNotValidException`, and a catch-all `Exception`. A POST without `Idempotency-Key` (`MissingRequestHeaderException`), malformed JSON, a non-UUID `refundRequestId` (`MethodArgumentTypeMismatchException`), a `size` above 100 (method validation), and 405 or 415 cases all reach the catch-all and answer 500 `INTERNAL_ERROR`, where 06 § 9.1 and SDD §15.1 expect 400 `VALIDATION_FAILED`. A `@PreAuthorize` denial (`AccessDeniedException`) is caught by the catch-all as well unless it is mapped first, and an invalid or expired JWT is rejected by the resource-server filter before any controller advice runs, so its 401 has no problem+json body; 09 § 12.6 says the handler "maps Spring Security's 401 and 403", which an advice cannot do for filter-level failures.
- **Options:**
  - **A.** `GlobalProblemHandler` extends `ResponseEntityExceptionHandler` (Spring Framework 6 ProblemDetail support) and adds `errorCode` to its responses; `MissingRequestHeaderException` and type mismatches map to 400 `VALIDATION_FAILED`, `AccessDeniedException` to 403 ahead of the catch-all; the resource server gets an `AuthenticationEntryPoint` and an `AccessDeniedHandler` that write problem+json - every 06 § 9.1 status carries the SDD envelope; a few handlers.
  - **B.** Keep the three handlers and list the 500s as known - no work; client mistakes read as server faults and burn the availability budget.
- **Recommendation:** A, with a contract test per status code of 06 § 9.1, including a missing `Idempotency-Key` and an expired token.
- **Why:** CLAUDE.md requires RFC 9457 errors that say how to fix the request and SDD §15.1 fixes the 400/401/403 codes; A uses the framework's own ProblemDetail support, while B also inflates `AvailabilitySLOBurn` with client errors.
- **Status:** Open

---

### OI-18: DLQ replay takes the portal down and expires before the DLQ

- **Where:** refund-service / 10 § 13.8 RB-02 and 07 § 10.1 retention
- **Type:** Error path
- **Concern:** RB-02 empties the consumer group with `kubectl scale ... --replicas=0` before the offset reset; for the `refund-service` group that deployable is `refunds-platform-core`, so each replay of a payout event is a full portal outage charged to REFUNDS/NFR-02 (two hours a month). Replay works only from the source topic (SDD §14.2 and §14.6 item 6 forbid re-publishing), yet `refunds-platform-payout-events` keeps 7 days while its DLQ keeps 30, so a dead-lettered `PAYOUT_SUCCEEDED` investigated for more than a week can no longer be applied: the refund stays APPROVED although paid, the customer is never told, and the points are never taken back. The 07 § 10.1 TODO flags the retention values as guesses, not the procedure or the mismatch.
- **Options:**
  - **A.** Stop and start only the group's listener container through a management operation (`KafkaListenerEndpointRegistry` on the cluster-internal management port) so the group is empty while the portal serves; keep `refunds-platform-payout-events` at least as long as its 30-day DLQ (no contact data, so ADR-10 does not bound it); state each topic's replay deadline in RB-02 and alert as a DLQ record nears it - no outage and no expired money events.
  - **B.** Re-publish DLQ copies to the source topic with their original `event_id` - simple replay; contradicts SDD §14.2 and §14.6 item 6 and needs an SDD change.
- **Recommendation:** A.
- **Why:** REFUNDS/NFR-01 and REFUNDS/NFR-02 are both at stake and A meets them within the SDD's replay rule; the cost is one management operation and a longer retention on a topic without personal data.
- **Status:** Open

---

### OI-19: aggregate_version repeats after submit

- **Where:** refund-service / § 7.3 `submit` steps 6d-6e and § 7.4 Pattern: Outbox (`RefundEventOutboxAdapter.append`)
- **Type:** Contract drift
- **Concern:** `append` writes `aggregate.version + 1`, which is right where it runs before the flush (`cancel`, `decide`, `applyPayoutSucceeded`), but `submit` flushes first (`saveAndFlush`, step 6d), so the new aggregate is already at version 0 and `REFUND_SUBMITTED` carries 1; the next transition from version 0 writes 1 again. SDD §14.3 defines `aggregate_version` as a per-aggregate monotonic counter and ordering guard, and 07 § 10.3 as "the aggregate's version after the transition", so the first two facts of every refund collide for any consumer that orders by it.
- **Options:**
  - **A.** Append after the flush in every command and write `aggregate.version` as it stands - one rule that matches 07 § 10.3; every command flushes before appending.
  - **B.** Keep `version + 1` and move the submit append before `saveAndFlush` - smallest change; the step 6d unique-violation mapping then fires at commit instead.
- **Recommendation:** A, with a test asserting strictly increasing `aggregate_version` over SUBMITTED, APPROVED, and PAID.
- **Why:** A makes the value equal the committed version by construction, which is what SDD §14.3 promises consumers; B holds only while every command keeps its statement order.
- **Status:** Open

---

### OI-20: E2E specs cannot assert the customer messages they claim

- **Where:** notification-service / 13 § 16.6 and § 16.8
- **Type:** Test gap
- **Concern:** [REFUNDS/TC-REQ-07](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) succeeds only if "the customer gets an email" and [REFUNDS/TC-DEC-01](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03) only if "the customer is told", and § 16.8 claims AC-1 for both specs, but the specs are Playwright runs gated in SIT (§ 16.7), where SDD §19 uses provider sandboxes; § 16.6 lists Dev stubs for API-01 to API-04 but gives none a way for a spec to read what was sent. The message half of both test cases is therefore unasserted or checked by hand.
- **Options:**
  - **A.** Run the § 16.8 specs against a MsgHub stub that records accepted messages and exposes them to the spec (channel, reference number, amount with currency), and keep the SIT sandbox run as a smoke check - the test cases are automated as written; one stub endpoint to maintain.
  - **B.** Put the message half of REFUNDS/TC-REQ-07 and REFUNDS/TC-DEC-01 on the Not automated line with its reason - honest; manual checks every cycle.
- **Recommendation:** A, and extend § 16.6 so the MsgHub stub, like the CardPay stub, belongs to the e2e environment.
- **Why:** The BRD success criteria include the message and CLAUDE.md sets Playwright for e2e; A automates them without reading notification-service's private database.
- **Status:** Open

---

### OI-21: The Roadmap disagrees with the SDD phase and the REFUNDS plan

- **Where:** global (17 § 3 Roadmap)
- **Type:** Specs-body mismatch
- **Concern:** The Roadmap labels its phases P1 to P4 and puts payout-service in P3, while SDD §14.4 gives both topics, including payout-service's `refunds-platform-payout-events`, phase P1, so one label now names two scopes. It serialises REFUNDS/UC-04 after REFUNDS/UC-02 and REFUNDS/UC-03, whereas REFUNDS 15 (Up to date) puts REFUNDS/TASK-02 (REFUNDS/UC-02, REFUNDS/UC-03) and REFUNDS/TASK-03 (REFUNDS/UC-04) in the same wave 2, and it lists "gateway and realm configuration" as P1 work although 01 § 2.2 keeps both outside this LLD's implementation files. Speckit `/constitution` reads the Roadmap verbatim, so the plan it seeds contradicts the SDD and the BRD's own implementation plan.
- **Options:**
  - **A.** Re-cut the Roadmap on the REFUNDS 15 waves (Wave 1: REFUNDS/UC-01 with notification-service; Wave 2: REFUNDS/UC-02, REFUNDS/UC-03, and REFUNDS/UC-04 with payout-service), then LOYALTY/UC-01 and LOYALTY/UC-02 (LOYALTY 15 Locked); state that every wave ships within SDD §14.4's P1, and list the gateway and realm configuration as consumed configuration - consistent with both upstream documents.
  - **B.** Keep P1 to P4 and add a note on the label clash - less work; the ordering conflict with REFUNDS 15 remains.
- **Recommendation:** A.
- **Why:** The Specs is the canonical input to delivery planning; A aligns it with the only upstream plan (REFUNDS 15) and the SDD phase at the cost of renaming four phases.
- **Status:** Open

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|---|---|---|---|
| OI-09 | 2026-10-07 | [SDD v1.1 Business Logic](../sdd-refunds-platform/13d-service-loyalty.md#business-logic) and [loyalty implementation](./04-implementation/loyalty-service.md#73-method-level-pseudocode-non-trivial-logic-only) | Settled in part: paid amount and refund reference persist; the direct and pending paths use the refunded amount. Remains Open: multiple-refund behavior and cap are owner questions. Reject new cap behavior as out of scope for this release (test-fixture policy). OI-10 concurrency and the other existing OIs are not settled by this source update. |


<!-- When an open item is resolved, move its summary here with a pointer to the LLD update (chunk + service + sub-section). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| - | - | - | No item resolved yet |

---

## Reviewer Notes

### 2026-10-07 fresh-session refresh

Codex same-context disk pass, reading only the after-sdd folder and current skill. Shape chunks; recommended direction from-sdd accepted under fixed answers. Step 3c found SDD 1.1 versus recorded 1.0 and LOYALTY 1.1 versus 1.0. Offer accepted: one targeted refresh from the new semantic Chunks list.

Mapping read from sdd-to-lld.md: SDD 01 -> LLD 01, 15 and 17; SDD 05 -> service 04 workflows; SDD 13a-13d -> service 04 and 03, 05, 06, 07, 08, 09, 10, 11, 13 for their changed subsections. The actual legacy sweep changes DB Modeling, so its required carry is 05. SDD 18 has no direct field mapping; review settlement is checked here. LOYALTY version refresh -> 04, 13, 14, 16 trace surfaces. Only material changes are written, plus metadata, 15, 18 and this child row.

Offer to migrate all remaining legacy conventions or implement all old OIs as a different request: declined by fixed answers. Old findings remain visible. No code or application test was executed.

| Changed chunk | Surfaces checked in disk reread | Result |
|---|---|---|
| 04-implementation/loyalty-service.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 04-implementation/notification-service.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 04-implementation/refund-service.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 05-data-model.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 09-cross-cutting.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 13-testing.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 14-frontend.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 15-open-questions.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 16-references.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |
| 17-specs.md | Upstream amount, contract names, trace links, owner markers, confidence flags and duplication; implementation files also checked for transaction, idempotency, tenant and error paths affected by the delta | No new unmarked issue; existing OIs remain, OI-09 partially settled only. |


<!-- The coverage table is required (SKILL.md step 7): one row per risk surface per service, plus the three `global` rows. Zero findings is valid for a surface that was checked. Free-form notes that did not become a numbered open item follow it. -->

| Service | Risk surface | Checked | Findings | What was checked |
|---------|--------------|---------|----------|------------------|
| refund-service | Error envelope (RFC 9457) | Yes | OI-17 | § 7.7 and `GlobalProblemHandler` against 06 § 9.1 statuses and SDD §15.1 codes |
| refund-service | Transactions | Yes | OI-01, OI-02, OI-07 | § 7.6 propagation, flush and optimistic-lock paths, per-receipt concurrency |
| refund-service | Idempotency | Yes | OI-07, OI-08 | Idempotency-Key store, request hash, twin handling, payout-event inbox |
| refund-service | Multi-tenancy | Yes | OI-11, OI-12 | Repository signatures, native SQL, RLS policy, worker-role grants |
| refund-service | Outbox | Yes | OI-13, OI-19 | `MANDATORY` append, relay ack-before-mark, relay lock, envelope version |
| refund-service | Saga compensation | Yes | OI-03 | Payout outcome guards, watchdog, FAILED path (OQ-01 excluded) |
| refund-service | Retry and backoff | Yes | OI-06, OI-18 | `posRecords` budget against 12 § 15.1, consumer retries, DLQ replay |
| refund-service | Observability | Yes | OI-14, OI-15 | Relay trace headers, SDD §17.1 metrics and alerts |
| refund-service | Test coverage | Yes | OI-02, OI-07 | 13 § 16.2-16.3 cases against concurrency and multi-request paths |
| refund-service | Schema versioning | Yes | OI-19 | `/v1` URIs, registry subjects, envelope fields against SDD §14.3 |
| refund-service | Duplication | Yes | No issue found | § 7.1, § 7.7, 05, 06 against SDD §17.1 (references with deltas) |
| loyalty-service | Error envelope (RFC 9457) | Yes | OI-17 | Shared `GlobalProblemHandler`; § 7.7 against SDD §17.4 Error Handling |
| loyalty-service | Transactions | Yes | OI-01, OI-10 | `importPage` and `closeExpiredPending` propagation, dispatcher transaction, isolation against the import |
| loyalty-service | Idempotency | Yes | OI-09 | `refund_takeback` key, earned-purchase index, pending lookup |
| loyalty-service | Multi-tenancy | Yes | OI-11, OI-12 | Listener tenant binding, `closePendingOlderThan`, replay under the worker role |
| loyalty-service | Outbox | Yes | OI-01, OI-13 | No broker events; publication-log dispatch, completion mark, replay lock |
| loyalty-service | Saga compensation | Yes | No issue found | In-process reaction, not a saga; PENDING_EARN and NO_EARN closure (OQ-03 excluded) |
| loyalty-service | Retry and backoff | Yes | OI-06 | `posPurchases` policy; replay cadence (TODO excluded) |
| loyalty-service | Observability | Yes | OI-14 | Listener span link on replay; SDD §17.4 metrics and alerts |
| loyalty-service | Test coverage | Yes | OI-09, OI-10 | Ledger and replay tests against multi-refund and race cases |
| loyalty-service | Schema versioning | Yes | No issue found | `/v1` member endpoints; `RefundPaidEvent` fields against SDD §14.10 |
| loyalty-service | Duplication | Yes | No issue found | § 7.1 and § 7.3 rules against SDD §17.4 |
| payout-service | Error envelope (RFC 9457) | Yes | No issue found | No business REST API; actuator endpoints only (SDD §17.2 API Standards) |
| payout-service | Transactions | Yes | OI-01 | Claim, send, settle split; `settle` propagation against the `MANDATORY` outbox |
| payout-service | Idempotency | Yes | OI-04 | Inbox, `ux_payout_refund`, provider key on every attempt |
| payout-service | Multi-tenancy | Yes | OI-12 | Cross-tenant claim, tenant set after the claim, RLS on payout tables |
| payout-service | Outbox | Yes | OI-01, OI-13 | `settle` append, relay lock, ack-before-mark, refund-service inbox dedup |
| payout-service | Saga compensation | Yes | OI-04 | Retry window to `PAYOUT_FAILED`, held payouts (OQ-01 and the circuit TODO excluded) |
| payout-service | Retry and backoff | Yes | OI-04, OI-06 | `BackoffPolicy`, `cardPay` timeout against the lease, re-send guards |
| payout-service | Observability | Yes | OI-05, OI-14, OI-15 | `payout_attempt` proxy, trace from `REFUND_APPROVED`, consumer lag |
| payout-service | Test coverage | Yes | OI-05 | § 16.2 cases against a lease that expires during a call |
| payout-service | Schema versioning | Yes | No issue found | `PAYOUT_*` payloads against SDD §14.9.6 and §14.9.7; tolerant `RefundApprovedForPayout` reader |
| payout-service | Duplication | Yes | No issue found | § 7.1 and 08 § 11.1 against SDD §17.2 |
| notification-service | Error envelope (RFC 9457) | Yes | No issue found | No business REST API; actuator endpoints only (SDD §17.3 API Standards) |
| notification-service | Transactions | Yes | OI-01 | `recordMessages`, claim, send, `settle` propagation |
| notification-service | Idempotency | Yes | No issue found | Unique (`tenant_id`, `source_event_id`, `channel`); message id as the provider key |
| notification-service | Multi-tenancy | Yes | OI-12 | Cross-tenant claim, tenant set after the claim, templates per tenant |
| notification-service | Outbox | Yes | No issue found | Publishes no event (SDD §14.4); no outbox needed |
| notification-service | Saga compensation | Yes | No issue found | Not a saga participant; a failed message never touches a refund |
| notification-service | Retry and backoff | Yes | OI-06, OI-16 | `msgHub` schedule, attempt limit, lease, exception paths |
| notification-service | Observability | Yes | OI-14, OI-15 | API-03 span link, SDD §17.3 metrics, consumer lag |
| notification-service | Test coverage | Yes | OI-20 | Dedup, encryption, retry tests; e2e message assertions |
| notification-service | Schema versioning | Yes | No issue found | `JsonNode` reads, unknown fields tolerated, payload fields against SDD §14.9 |
| notification-service | Duplication | Yes | No issue found | Channel matrix referenced to SDD §17.3, not re-specified |
| global | Contract drift (SDD §14/§15/§16) | Yes | OI-03, OI-19 | §14.3 to §14.10 names, payloads, envelope, DLQs; §15 in-process ports (none); §16 tokens and 403/404 rules |
| global | Specs-body | Yes | OI-21 | Mission against SDD §1, Tech Stack against 03 § 6.3, Roadmap against SDD §13, §14.4, and REFUNDS 15 |
| global | Use-case traceability | Yes | No issue found | Blocks, lines, routes, specs, `@UseCase`, keys, and every link and anchor against SDD §7.3 and BRD 05, 06, 11, 14, 16 |

- Every chunk 15 flag (29 TODO, 37 Confirm, OQ-01 to OQ-08) was excluded. Where an item touches a flagged area (OI-07 and the 09 § 12.2 Confirm, OI-09 and OQ-03, OI-12 and the 05 § 8.4 Confirm, OI-18 and the 07 § 10.1 retention TODO), it names a concrete defect the flag does not.
- Traceability check: every relative link and anchor in chunks 00 to 17 resolves against the real headings (GitHub slug rules, repeated headings suffixed); every BRD ID carries its key; §7.3 owners, entry points, and chunk 16 `Related UC` values match each 04 line and the 16 § 19.9 index; each screen's use cases match the BRD. The master's link to this chunk resolves now that it exists.
- Minor, not raised: `RefundPaidEvent` rows in `event_publication` can outlive a deploy, so `core-contracts` records and handler `listenerId` values need the additive-only rule of 07 § 10.2; a rename strands incomplete rows.
- Minor, not raised: the `phone_number` claim is copied into `ContactPoint.mobileNumber`, which SDD §14.9.0 types as E.164; normalise or validate it at submit.
- Minor, not raised: the branch-manager UI calls the API with its own `branch_id`, so opening another branch's request through the UI answers 404, not the 403 that the REFUNDS/UC-04 error handling pairs with [REFUNDS/TC-DEC-05](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03); both refuse access, but the backend harness should put the other branch in the path to assert the 403.
- For sdd-unifier: SDD §12 INT-02 says a failed message is dead-lettered after the attempt limit while §17.3 says only FAILED (the LLD follows §17.3); and the watchdog counts from approval while the retry window counts from the first attempt, so a payout-service backlog longer than one hour raises `RefundPayoutOverdue` for healthy payouts.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 17-specs.md | NEXT: none -->
