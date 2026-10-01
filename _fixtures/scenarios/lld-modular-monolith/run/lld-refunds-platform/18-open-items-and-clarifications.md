<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: Refunds Platform
VERSION: 1.0
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

### OI-01: Tenant context is bound at transaction start, but listeners set it inside their transaction

- **Where:** global / 09 § 12.1 `CallContext` lifecycle and 05 § 8.4 tenant filter enforcement; listener pseudocode in refund § 7.3 (`onPayoutSucceeded`), notification § 7.3 (`RefundEventsListener`, `PayoutFailedListener`), loyalty § 7.3 (`onRefundPaid`); refund § 7.3 `submit`, `cancel`, `decide` step 1
- **Type:** Transaction boundary
- **Concern:** Both tenant guards read the call context when a transaction begins: `TenantAwareTransactionManager` runs `set_config('app.tenant_id', :tenant, true)` "as the first statement of every transaction", and the `@TenantId` resolver is consulted when the Hibernate session opens, which under Spring's JPA transaction manager is also at transaction start (05 § 8.4). Every listener, however, runs in its own `REQUIRES_NEW` transaction (the § 7.6 tables of refund, notification, and loyalty; 07 § 10.6), and its body only then calls `callContext.runAsSystem(event.tenantId(), ...)` as step 1. Each listener transaction therefore starts with no tenant: under `FORCE ROW LEVEL SECURITY` the policy's `current_setting('app.tenant_id')` errors or matches nothing, so every listener fails on every delivery and re-delivery, and with it the Paid status (REFUNDS/UC-04 step 7), every customer message, and every take-back (LOYALTY/UC-02 BR-1: points taken back when the purchase is refunded). The same hook misses reads outside a transaction: `submit`, `cancel`, and `decide` call `idempotency.replayIfPresent` before the business transaction opens (refund § 7.3 step 1), while refund § 7.4 says the service reads the record "inside the business transaction". Chunk 15 flags the choice of mechanism (05 § 8.4 Confirm), not this ordering defect.
- **Options:**
  - **A.** Listener adapters become non-transactional async after-commit listeners that set `CallContext` from the DTO and then call the application service, whose method carries `@Transactional(propagation = REQUIRES_NEW)`; every repository call, the replay read included, runs inside a transaction - the transaction begins after the tenant is known; one extra layer per listener, and the listener identities of SDD §14.10 rule 7 must be kept.
  - **B.** An aspect ordered before the transaction interceptor reads `tenantId` from the listener's event argument (all DTOs implement one tenant-carrying interface) - no listener refactor; correctness rests on advisor ordering that a later change can silently break.
  - **C.** Bind the tenant when a connection is checked out instead of when a transaction starts - also covers non-transactional reads; a session-level setting on pooled connections can leak one tenant to the next borrower and still leaves the Hibernate session without a tenant.
- **Recommendation:** A. Write the listener shape once in 09 § 12.1 (set the context, then call a `REQUIRES_NEW` service), update the four listener pseudocode blocks and 07 § 10.6, move the replay read into the business transaction (it moves there anyway under OI-02), and add one integration test per listener running as the non-owner role under `FORCE ROW LEVEL SECURITY` (OI-21).
- **Why:** A delivers what SDD §11.2 asks ("listeners from the DTO", row-level security "set per transaction") in an order that can be read and tested; B hides the same ordering in an annotation detail, and C reopens the cross-tenant leak that the second guard of SDD ADR-03 exists to stop. Tradeoff accepted: the single-annotation listener convenience is lost, and the exact Spring Modulith listener annotations still need checking against the pinned version (03 § 6.4 Confirm).
- **Status:** Open

---

### OI-02: A concurrent duplicate POST fails on another constraint before it reaches the idempotency key

- **Where:** refund / § 7.3 `submit`, `cancel`, `decide`; § 7.4 Pattern: Idempotency; 09 § 12.2 In-flight handling
- **Type:** Concurrency hazard
- **Concern:** 09 § 12.2 promises that "a concurrent duplicate fails on the primary key at commit, rolls back, and replays the stored response", but the idempotency row is the last write of each transaction, so whether the duplicate ever reaches that key depends on a statement order the pseudocode either gets wrong or leaves open. In `submit` it is fixed and wrong: `saveAndFlush` (step 4g) inserts the items before `idempotency.store` (step 4i), so a retry sent while the first request is still in flight (the client timed out during the POS re-read) waits on `uq_refund_item_active`, then gets 422 `ITEM_ALREADY_REFUNDED` although its own request was just created. In `cancel` and `decide` it depends on whether the record insert executes before the flush: if not, a duplicate cancellation loses the version check and gets 409 `REFUND_ALREADY_DECIDED` although nobody decided, and a duplicate decision either loses the version check the same way or fails on `uq_payout_refund` with a `DataIntegrityViolationException` that 09 § 12.6 maps to 500 `INTERNAL_ERROR`. The chunk 15 Confirm on `submit` covers reusing the SDD table without an in-progress status; it does not cover this write order.
- **Options:**
  - **A.** Claim the key first: the first statement of each business transaction is `INSERT INTO idempotency_record (...) ON CONFLICT DO NOTHING` with the hash and no response; a concurrent duplicate waits on that insert until the first transaction ends, then reads the committed record and replays it (same hash) or returns 409 `CONFLICT`; the response is written by an `UPDATE` at the end of the same transaction - one ordering rule for all three POSTs and no new column; `response_status` and `response_body` become nullable.
  - **B.** Keep the insert last and, on any unique or optimistic-lock failure, re-run `replayIfPresent` in a new transaction before mapping the error - no change to the write order; three error paths each need the extra lookup, and the next new constraint breaks it again.
- **Recommendation:** A. Rewrite step 1 and the store step of the three pseudocode blocks, § 7.4, and 09 § 12.2 In-flight handling as claim-first, and add same-key in-flight duplicates to 13 § 16.3 (OI-21).
- **Why:** CLAUDE.md requires idempotency on every write endpoint and assumes at-least-once retries; with the key as the first lock taken, a duplicate can only replay, which is what SDD §17.1 API Standards promises ("a replay with the same key and body returns the stored response"), whereas B patches three symptoms. Tradeoff accepted: the key is reserved for the length of the business transaction, and a rolled-back transaction releases it, which is correct for a retry.
- **Status:** Open

---

### OI-03: The idempotency fingerprint ignores the target resource and the caller

- **Where:** refund / § 7.4 Pattern: Idempotency; § 7.3 `submit` step 1 (`sha256(body)`); 09 § 12.2 Dedup tuple; 05 § 8.2 `idempotency_record`; 11 § 14.5 Threat Notes
- **Type:** Idempotency gap
- **Concern:** The record is keyed by (`tenant_id`, `idempotency_key`) and compared on `request_hash`, "SHA-256 of the canonical body" (09 § 12.2). The target of two of the three POSTs is in the path: `POST /v1/refund-requests/{refundId}/cancellation` has no body at all (SDD §17.1 List of APIs), and `RefundDecision` carries no `refundId` (06 § 9.2). A client that reuses one key for two cancellations, or for two full approvals with the same body, receives the first request's stored 200 for the second: the second request is never cancelled or approved, and the response shows another request's detail, which can belong to another customer because the key is not scoped to the caller. For a decision this leaves a refund the manager believes approved with no payout instruction (REFUNDS/NFR-01: refund money is never lost or paid twice). The threat note in 11 § 14.5 covers reuse across tenants only.
- **Options:**
  - **A.** Hash the method, the route template with its path parameters, the caller's subject, and the canonical body into `request_hash`; any mismatch on a known key returns 409 `CONFLICT` - no schema change; a key collision between two callers becomes a 409 instead of a leak.
  - **B.** Extend the primary key to (`tenant_id`, `subject`, `idempotency_key`) and hash method, path, and body - keys become per caller by construction; changes the SDD §17.1 table, so it needs an SDD update.
- **Recommendation:** A. State the fingerprint in 09 § 12.2 and refund § 7.4, and add a threat-note row in 11 § 14.5 for key reuse across requests and callers.
- **Why:** The SDD contract is "the same key with another body returns 409 `CONFLICT`" (SDD §17.1 API Standards); A applies it to the whole request rather than to the body bytes, inside the table the SDD defines, and closes both the silent non-execution and the cross-customer response leak (REFUNDS/NFR-04: only the customer and their branch's manager can see a request). B buys nothing more and reopens a reconciled SDD table. Tradeoff accepted: a client bug that reuses keys now surfaces as 409 errors it used to hide.
- **Status:** Open

---

### OI-04: The web app has no Idempotency-Key lifecycle

- **Where:** refund / 14 § 17.1 Module / Component Tree (`shared/services`), § 17.2 State Management Boundaries, § 17.9 Component Architecture
- **Type:** Idempotency gap
- **Concern:** The three refund POSTs require `Idempotency-Key` (06 § 9.1; a missing key is 400 `VALIDATION_FAILED`, refund § 7.7), yet chunk 14 never says where the key is created, how long it lives, or when it is reused. If an HTTP interceptor creates a fresh key per request, a timeout-and-retry or a double click becomes a second attempt the server cannot recognise (a manager whose approval succeeded gets 409 `REFUND_ALREADY_DECIDED` on the retry and believes it failed); if one key is kept per page or session, it triggers the cross-request replay of OI-03. Neither matches the CLAUDE.md idempotency rule, which only works when a retry carries the original key.
- **Options:**
  - **A.** Put the rule in each container component: one key per user intent, created at the confirm step (submit, cancel confirmation, approve or reject confirmation), held in the component's signal state, reused on network errors, timeouts, and 5xx, and discarded after any 2xx or 4xx; never generated in a global interceptor - correct retries; the rule is repeated in three components.
  - **B.** The same rule implemented once in a shared `IdempotentCommandService` in `shared/services`, which wraps the three POSTs and owns key creation and retry - one tested implementation; every future write must go through it.
- **Recommendation:** B. Add the service and its rules to 14 § 17.2 and § 17.9, use a browser-generated UUID (no new dependency), and cover retry-after-timeout in the REFUNDS/UC-01 and REFUNDS/UC-04 Playwright specs.
- **Why:** The server guarantee (SDD §17.1: a replay returns the stored response) only holds if the client resends the same key; one container-level service follows the CLAUDE.md rule "logic in services or stores, not templates" and keeps the three write flows identical, where A copies the rule three times. Tradeoff accepted: one more shared service and a convention that new writes use it.
- **Status:** Open

---

### OI-05: The per-tenant reference counter has no row for a new tenant

- **Where:** refund / § 7.3 `submit` step 4e; 05 § 8.2 `reference_sequence` and its Confirm; 05 § 8.5 Migration Plan
- **Type:** Implementation gap
- **Concern:** `JdbcReferenceNumberGenerator` runs `UPDATE ... SET next_value = next_value + 1 RETURNING next_value` (05 § 8.2 Confirm), but nothing creates the tenant's row: `V1__create_refund_tables.sql` creates the table only, and tenants live in the Helm values (`TenantConfig`, 09 § 12.9), which a Flyway migration cannot read. The first refund request of every tenant, including the first one at go-live, updates zero rows and fails with a 500 inside the submit transaction (REFUNDS/UC-01 step 6). The chunk 15 Confirm covers the per-tenant row lock, not the missing seed.
- **Options:**
  - **A.** Upsert in one statement: `INSERT INTO reference_sequence (tenant_id, next_value, <auditing columns>) VALUES (:tenant, 1, ...) ON CONFLICT (tenant_id) DO UPDATE SET next_value = reference_sequence.next_value + 1 RETURNING next_value` - self-seeding with the same row lock; one statement to test.
  - **B.** Seed the row in each tenant's onboarding change (a versioned migration per tenant) - explicit; ties every new tenant to a schema migration and fails at runtime when the step is missed.
- **Recommendation:** A, in 05 § 8.2 and refund § 7.3 step 4e, with an integration test for the first request of a new tenant (OI-21).
- **Why:** A removes a deterministic day-one failure without a new component and keeps the serialisation the Confirm already accepted at about 40 requests a day; B adds an onboarding step that SDD §11.5 does not list. Tradeoff accepted: the counter's start value (1) is fixed in code, so the reference-format TODO in 05 § 8.2 must start from it.
- **Status:** Open

---

### OI-06: The dispatch lease does not cover the sequential batch, and a stale claimant can still record an outcome

- **Where:** payout / § 7.3 `PayoutDispatchServiceImpl.dispatchDue` and `recordOutcome`; notification / § 7.3 `NotificationDispatchServiceImpl.dispatchDue`; 01 § 3 A-03; 10 § 13.1; 12 § 15.4; 08 § 11.1 Payout transition rules
- **Type:** Concurrency hazard
- **Concern:** A dispatcher claims a whole batch, pushes `next_attempt_at` forward by one lease, then calls the provider row by row. With the defaults, 50 payouts at up to 12 s each (2 s connect plus the 10 s CardPay timeout, 09 § 12.3 and 10 § 13.1) take up to 600 s against a 120 s lease, and 100 messages at up to 7 s each take up to 700 s against a notification lease no setting defines (12 § 15.4, A-03). During a slow-provider episode, rows still queued in one replica's batch become claimable by the other replicas, so the same payout or message is sent concurrently; A-03 sizes the lease against one call only. Both claimants then record an outcome: `recordOutcome` re-reads the row by ID in a new transaction, so the "optimistic version check" compares against a fresh version and cannot detect the stale claimant. Effects: `attempt_count` grows twice per real attempt (skewing backoff and the notification attempt limit), a stale refusal at the 24 h mark can end a payout `FAILED` and publish `PayoutFailed` while the other claimant's call succeeded, and the whole path rests on provider deduplication that is still TBD (SDD R-01). Chunk 15 flags the lease value, not this sizing rule or the missing claimant check.
- **Options:**
  - **A.** A claim token: the claim sets LLD-only `claim_id` and `lease_until` per row; before each provider call the dispatcher renews that row's lease (`UPDATE ... WHERE id = :id AND claim_id = :claim AND lease_until > now()`) and skips the row when no row matches; `recordOutcome` updates only `WHERE id = :id AND claim_id = :claim AND status IN ('PENDING','RETRYING')` and keeps a stale outcome as an attempt row without a state change - a stale claimant can neither send late nor overwrite; two LLD-only columns per dispatch table and one renewal per send.
  - **B.** Size the batch to the lease (batch at most half of lease divided by connect plus read timeout), re-checked whenever either value changes - no schema change; the invariant lives in configuration and breaks silently when a timeout is raised.
  - **C.** Claim and send one row per cycle - simplest; one claim round trip per row, affordable at about 1,200 payouts and 4,800 messages a month (SDD §18.1).
- **Recommendation:** A for both dispatchers, with the batch also capped as in B; add the columns to 05 § 8.2 as LLD-only (like `trace_parent`), the settings to 10 § 13.1, and a two-dispatcher test with a slow provider stub (OI-21).
- **Why:** CLAUDE.md wants provider writes marked done only after confirmation, with duplicates assumed; A returns "the provider idempotency key absorbs it" (A-03) to a crash-only path instead of a routine one, which REFUNDS/NFR-01 (refund money is never lost or paid twice) needs while CardPay's deduplication is unconfirmed. C is a close second at this volume. Tradeoff accepted: two LLD-only columns and one extra update per send.
- **Status:** Open

---

### OI-07: Dispatchers neither stop claiming nor finish in-flight work on shutdown

- **Where:** payout / § 7.2 Controllers (`PayoutDispatcher`), § 7.3 `dispatchDue`; notification / § 7.2 Controllers (`NotificationDispatcher`), § 7.3 `dispatchDue`; 03 § 6.2 Deployment Topology
- **Type:** Implementation gap
- **Concern:** SDD §17.2 Deployment Strategy requires that "a dispatcher stops claiming on shutdown and finishes its in-flight attempt", and SDD §17.3 that it stops claiming; the LLD gives neither dispatcher any shutdown behaviour, while 03 § 6.2 deploys by rolling update. A pod stopped mid-batch abandons a CardPay call whose outcome is then unknown and leaves up to a whole batch leased (OI-06) until the lease ends, so every rollout adds a resend with an unknown first outcome, and up to one lease of delay, to the payouts and messages it interrupts.
- **Options:**
  - **A.** A lifecycle stop hook per dispatcher: stop claiming, finish and record the current row, release the unsent rows of the batch (`next_attempt_at = now()`, claim cleared), then return; the pod's termination grace period is required to exceed the provider timeout plus a margin - matches the SDD; one hook per dispatcher and one deployment value.
  - **B.** Rely on lease expiry - nothing to build; every rollout becomes an unknown-outcome window for in-flight payouts, contradicting SDD §17.2.
- **Recommendation:** A, in payout and notification § 7.3, with the grace-period requirement named in 03 § 6.2 (the Helm value itself stays outside this LLD).
- **Why:** A implements an SDD requirement the LLD dropped and removes rollout-made resends that would otherwise depend on CardPay deduplication (SDD R-01); B is only acceptable if a lease-based resend were free, which it is not for money. Tradeoff accepted: a pod shutdown that can last one provider timeout longer.
- **Status:** Open

---

### OI-08: The catch-all Resilience4j fallback turns refusals and timeouts into "not called"

- **Where:** payout / § 7.4 Pattern: Resilience4j on the CardPay call, § 7.3 `recordOutcome`; notification / § 7.4 Pattern: Resilience4j on the MsgHub call; 09 § 12.3 Resilience
- **Type:** Error path
- **Concern:** `CardPayAdapter.send` declares `fallbackMethod = "notCalled"` with a `Throwable` parameter that returns `ProviderResult.error("CIRCUIT_OPEN or BULKHEAD_FULL")` (payout § 7.4), and the MsgHub adapter declares the same fallback (notification § 7.4). A fallback with a `Throwable` parameter receives every exception the call throws, not only the open-circuit and full-bulkhead rejections, so an HTTP client that throws on a 4xx refusal or a read timeout is recorded as `ERROR`, never `REFUSED` or `TIMEOUT`. A payout refused for 24 hours then ends `UNKNOWN` instead of `FAILED` (`p.end(result.outcome == REFUSED ? FAILED : UNKNOWN)`), contradicting SDD §17.2 Failure ("a payout whose last attempt was refused moves to Failed"), and `payout_attempts_total{outcome}` and RB-01 read the wrong outcome. Which outcomes count as circuit-breaker failures is not stated either: refusals counted as failures can open the breaker for every payout. The instances are one per provider while credentials are per tenant (09 § 12.9), so one tenant's expired credential (a MsgHub authentication failure opens the breaker, SDD §17.3) stops sending for every tenant.
- **Options:**
  - **A.** Exact outcomes: the adapter maps every provider response (success, refusal, timeout, transport error) to a `ProviderResult` itself, lets only transport failures, 5xx, and timeouts count as breaker failures, and limits the fallback to the open-circuit and full-bulkhead exceptions - outcomes and the Failed versus Unknown split become right; one tenant's credential failure still opens the shared breaker.
  - **B.** A plus breaker and bulkhead instances keyed by provider and tenant, created from `TenantConfig` and named by a tenant alias rather than the tenant UUID - one tenant cannot stop another; more instances to configure and watch.
  - **C.** Keep the catch-all fallback - nothing to change; a thrown refusal can never reach Failed and the outcome metrics stay wrong.
- **Recommendation:** B, recorded in payout and notification § 7.4 and in the 09 § 12.3 instance table.
- **Why:** The Failed versus Unknown split is an SDD contract (SDD §17.2, Figure 15) that tells the branch manager whether money may have moved, and it only works on exact attempt outcomes; CLAUDE.md asks for circuit breakers and bulkheads per downstream provider, and with per-tenant credentials the failure domain is provider plus tenant. Tradeoff accepted: per-tenant instance names in metrics and dashboards.
- **Status:** Open

---

### OI-09: The daily reconciliation compares misaligned windows, from our side only

- **Where:** payout / § 7.3 `PayoutReconciliationServiceImpl.reconcile`; § 7.8 Workflow: Daily payout reconciliation
- **Type:** Missing edge case
- **Concern:** The job reads CardPay's records for `day`, loops only over our payouts that became terminal in that day window (`findTerminalBetween`), and settles an `UNKNOWN` payout as `FAILED` when it is absent from that day's report. A payout turns `UNKNOWN` 24 hours after its first attempt, so the CardPay call that may have paid it happened on an earlier day than the one it is compared with: a payout CardPay paid is settled `FAILED` with no mismatch, and is never compared again because `FAILED` is terminal and the next run looks at another day. The loop never iterates CardPay's rows either, so "any payout CardPay paid that is not Succeeded" (SDD §17.2 Reconciliation) is caught only when our row happens to be terminal in the same window; a CardPay payment for a payout still `RETRYING`, or terminal on another day, is never flagged. Finally, "the next daily run retries a failed report read" (§ 7.8) does not hold for a day-keyed job: a failed day is skipped for good. Chunk 15 flags the CardPay data source, not this algorithm.
- **Options:**
  - **A.** Reconcile both sides over a rolling window: compare CardPay's records for the last N days (N at least 2, covering the 24 h retry window) with every payout of the tenant whose first attempt falls in the window, as a full outer match on the payout ID (the idempotency key); settle `UNKNOWN` only when CardPay's records cover the whole span since its first attempt; keep a per-tenant watermark of the last fully reconciled day so a failed run is retried - catches both mismatch directions with any report-style source; reads more report days per run.
  - **B.** A per-payout status query for each `UNKNOWN` payout plus the daily report for mismatch alerts - exact for each Unknown; depends on CardPay offering a status query (TBD - external, SDD §15.6).
- **Recommendation:** A, keyed to whatever source OQ-03 settles: record the window rule, the watermark, and "never settle `FAILED` from absence in one day's report" in § 7.3, and add date-misaligned cases to 13 § 16.3 (OI-21).
- **Why:** REFUNDS/NFR-01 (refund money is never lost or paid twice) is measured as "0 mismatches in the daily reconciliation with CardPay's records" (SDD §18); A is the only option that sees a payment CardPay made while our record says otherwise, whatever CardPay turns out to offer. Tradeoff accepted: larger report reads per run and one watermark row per tenant.
- **Status:** Open

---

### OI-10: Event re-delivery has no backoff and gives up after about 15 minutes

- **Where:** global / 09 § 12.4 In-process event delivery (`EventRedeliveryJob` pseudocode); 05 § 8.2 `event_publication_redelivery`; 10 § 13.1 defaults
- **Type:** Pattern misapplication
- **Concern:** The re-delivery predicate selects every incomplete publication older than `EVENT_REDELIVERY_AGE` (5 min) and re-delivers it on every run (1 min) until its count passes `EVENT_MAX_REDELIVERIES` (10). A failing listener is therefore retried ten times within about ten minutes and declared stuck about 15 minutes after publication; `last_redelivered_at` is stored but never read. Any dependency outage longer than that (the manager directory of OI-12, a database failover, lock contention) turns every affected publication into a manual RB-02 reset, while deterministic poison events are retried at the same aggressive rate. CLAUDE.md prescribes retries with exponential backoff and jitter, and the LLD already has that algorithm (08 § 11.3). Chunk 15 flags the three values, not the missing backoff.
- **Options:**
  - **A.** Exponential backoff per publication: eligible once `now()` passes `last_redelivered_at` plus `min(cap, base x 2^count)` with full jitter (`BackoffPolicy`), base 1 min, cap 1 h, a horizon of several hours before "stuck"; `EventPublicationLag` keeps paging at 30 minutes - transient outages heal themselves; a truly stuck event is declared later.
  - **B.** Keep the fixed cadence and raise `EVENT_MAX_REDELIVERIES` - one value to change; still no spacing, so a longer horizon means many more futile runs.
- **Recommendation:** A, reusing `BackoffPolicy`: update the predicate in 09 § 12.4 and the defaults and their meaning in 10 § 13.1.
- **Why:** A follows the CLAUDE.md retry rule with an algorithm and a column the LLD already has, and separates "late" (paged at 30 minutes, well inside LOYALTY/NFR-02: points taken back within 1 hour of the refund being paid) from "stuck"; B keeps an operator in the loop for every short outage. Tradeoff accepted: a stuck publication is declared hours rather than minutes after it starts failing, which the lag alert already covers.
- **Status:** Open

---

### OI-11: Problem Details misses filter-level and framework errors

- **Where:** global / 09 § 12.6 Error Model and § 12.1 `CallContextFilter`; refund § 7.7; loyalty § 7.7
- **Type:** Error path
- **Concern:** 09 § 12.6 says `ProblemDetailsAdvice` maps "Spring Security's 401 and 403", but a missing or invalid token is rejected by the resource-server filter and a token without `tenant_id` by `CallContextFilter` (09 § 12.1), both before any controller runs, so a `@RestControllerAdvice` never sees them and they leave with the framework's default body instead of `application/problem+json`. The advice also sends "anything else" to 500 `INTERNAL_ERROR`, which catches framework exceptions that carry their own 4xx: a malformed JSON body, a missing `Idempotency-Key` header, a non-UUID `refundId` or `movementId`, an unsupported media type, an unknown route. refund § 7.7 lists "malformed body, ... missing key" as 400 Bean Validation failures and SDD §17.4 requires 400 `VALIDATION_FAILED` for a malformed movement ID, but none of these is a Bean Validation error. Each such client mistake would count as a 5xx against REFUNDS/NFR-02, whose SLI counts every 5xx at the gateway (SDD §18). The filter's handling of a malformed `X-Correlation-Id` is undefined too, while SDD §14.10 rule 6 types `correlationId` as a UUID.
- **Options:**
  - **A.** Configure the security entry point and access-denied handler, and `CallContextFilter`, to write Problem Details (`UNAUTHENTICATED`, `FORBIDDEN`); make the advice extend Spring MVC's `ResponseEntityExceptionHandler` (or map those framework exceptions explicitly) so they keep 400, 404, 405, and 415 with `VALIDATION_FAILED` or `NOT_FOUND`; replace a non-UUID `X-Correlation-Id` with a generated one - one envelope for every response the deployable sends; three small pieces of configuration.
  - **B.** Let the API gateway normalise error bodies - no deployable change; the deployable validates tokens itself (ADR-07), so its own 401 and 403 still leave unformatted, and framework 4xx still become 500.
- **Recommendation:** A, documented in 09 § 12.6 and the refund and loyalty § 7.7 tables, with an integration test per error class (OI-21).
- **Why:** CLAUDE.md requires RFC 9457 Problem Details through a global advice and SDD §11.6 requires a `detail` that says what to do next; A is the only option that covers responses the advice cannot reach and keeps client mistakes out of the availability budget. Tradeoff accepted: a little security configuration outside the advice.
- **Status:** Open

---

### OI-12: PayoutFailedListener calls the manager directory inside its transaction, without resilience

- **Where:** notification / § 7.3 `PayoutFailedListener.on`; § 7.6 Transaction Boundaries; 09 § 12.3 resilience instances; 11 § 14.3 Secrets Management
- **Type:** Transaction boundary
- **Concern:** The listener runs in its own `REQUIRES_NEW` transaction (§ 7.6), and its step 2 calls `branchManagerDirectory.managersOf(...)`, which OQ-04 proposes to back with Keycloak, an outbound HTTP call. The call holds a database connection and an open transaction for its whole duration, has no Resilience4j instance (09 § 12.3 lists only `pos-records`, `cardpay`, `msghub`), no timeout, and no credential in 11 § 14.3 or 10 § 13.1, whereas the LLD keeps every other provider call outside transactions (02 § 5.3, payout § 7.3), SDD §17.3 Developer Notes keep provider calls out of listeners, and CLAUDE.md asks for timeouts, circuit breakers, and bulkheads on downstream calls. Under the cadence of OI-10, a directory outage of about 15 minutes makes the `PayoutFailed` publication stuck and the REFUNDS/UC-04 E1 alert is not sent. OQ-04 covers the source and the existence of the call, not where it runs.
- **Options:**
  - **A.** Resolve the managers outside the transaction: the listener adapter (non-transactional, as in OI-01) calls the directory through a new `manager-directory` Resilience4j instance with a timeout and bulkhead, then inserts the rows in a short `REQUIRES_NEW` transaction; the directory credential is listed in 11 § 14.3 - no connection held during I/O; one more instance and one more secret.
  - **B.** Insert one branch-level alert row in the listener and resolve the managers in the dispatcher at send time - the listener stays insert-only like the others; changes the row model and the per-manager `recipient_key` that SDD §17.3 fixes.
- **Recommendation:** A, recorded in notification § 7.3 and § 7.6 and in 09 § 12.3, and folded into the OQ-04 decision.
- **Why:** A applies the rule the LLD follows everywhere else (no provider I/O inside a database transaction) and gives the new dependency the CLAUDE.md resilience defaults, while B departs from the SDD §17.3 notification key. Tradeoff accepted: one more Resilience4j instance and credential.
- **Status:** Open

---

### OI-13: A render failure stalls a notification batch, and the dispatcher settings are missing

- **Where:** notification / § 7.3 `NotificationDispatchServiceImpl.dispatchDue`; § 7.5 Dependency Injection Graph; 10 § 13.1; 12 § 15.4
- **Type:** Error path
- **Concern:** `renderer.render(n.templateKey, n.locale, n.renderData)` runs before the send and outside the outcome transaction, and no branch handles its failure. A message whose template is missing for its locale (customer locales come from the `locale` claim, SDD ADR-07) or whose render data is incomplete throws out of the loop: no attempt is recorded, `attempt_count` never grows, the row never reaches `FAILED`, and the rest of the batch stays leased; when the lease ends the same row is claimed again, so one bad row stalls its batch every cycle without ever alerting. SDD §17.3 renders "in the customer's locale (tenant locale by default)", which needs an explicit fallback. The dispatcher is also under-specified: 10 § 13.1 has no notification batch size, lease, or backoff setting (12 § 15.4 names only a "notification batch property"), and § 7.5 does not wire the `backoff` the pseudocode calls.
- **Options:**
  - **A.** Treat rendering as part of the attempt: a missing locale template falls back to the tenant default locale; any other render error is recorded as an attempt (outcome `ERROR` with the reason), counts toward `NOTIFICATION_MAX_ATTEMPTS`, and is isolated per row so the loop continues; add `NOTIFICATION_BATCH_SIZE`, `NOTIFICATION_CLAIM_LEASE_MS`, `NOTIFICATION_BACKOFF_INITIAL_MS`, and `NOTIFICATION_BACKOFF_MAX_MS` to 10 § 13.1 and `BackoffPolicy` to § 7.5 - every row ends `SENT` or `FAILED`; a few lines of per-row error handling.
  - **B.** Check at startup that every template exists for every configured locale and leave the loop as is - catches missing templates early; incomplete render data still stalls the batch.
- **Recommendation:** A.
- **Why:** SDD §17.3 says a message that exhausts its retries "is marked Failed and alerted, never dropped silently"; only A gives every row a terminal state and stops one bad message from delaying the customer messages queued behind it. Tradeoff accepted: a message may go out in the tenant's default language rather than not at all.
- **Status:** Open

---

### OI-14: The purchase intake takes the tenant from the payload

- **Where:** loyalty / § 7.2 Domain Types (`MemberPurchase`) and Authorization (`PurchaseIntakeAdapter`); § 7.3 `PurchaseIntakeServiceImpl.ingest` step 1
- **Type:** Multi-tenancy leak
- **Concern:** `ingest` starts with `callContext.runAsSystem(purchase.tenantId())`, yet `MemberPurchase` holds "member ID, purchase reference, amount, currency, purchase time" and no tenant, and the intake's authentication is "TBD with its mode"; SDD §17.4 says the intake sets the tenant "from the DTO or the purchase record". If the tenant comes from the payload, an intake credential of one tenant can write EARN movements, and apply pending take-backs, in another tenant's ledger, and row-level security passes because the context was set from that same payload. OQ-02 decides the intake mode, not where the tenant comes from.
- **Options:**
  - **A.** Bind the tenant to the authenticated intake channel (a per-tenant client credential, file location, or pull job configured per tenant in `TenantConfig`); the adapter passes it explicitly as `ingest(TenantId tenant, MemberPurchase purchase)`, and a tenant in the payload, if POS sends one, must match or the record is rejected and counted - a payload cannot choose its tenant; every intake mode needs a per-tenant channel.
  - **B.** Trust the payload tenant - nothing to build; one misconfigured or compromised feed writes across tenants.
- **Recommendation:** A, in § 7.2 and § 7.3, counting mismatches in `loyalty_purchases_ingested_total{outcome}`, and ask sdd-unifier to align the SDD §17.4 wording.
- **Why:** CLAUDE.md treats tenant isolation as non-negotiable and SDD ADR-03 requires two failures for a cross-tenant leak; taking the tenant from the record being written defeats both guards at once. Tradeoff accepted: whichever intake mode OQ-02 picks must carry a per-tenant credential or source.
- **Status:** Open

---

### OI-15: Balance updates conflict across purchases and can move the last-movement date backwards

- **Where:** loyalty / § 7.2 Repositories (`PointsBalanceRepository.apply`); § 7.3 `onRefundPaid` step 9, `ingest` steps 4 and 5; 05 § 8.2 `points_balance`
- **Type:** Concurrency hazard
- **Concern:** `apply(memberId, delta, at)` is a read-modify-write guarded by an optimistic `version`, but the only lock is per purchase (`PurchaseLock`), so a take-back and an earn for two purchases of the same member, or two take-backs, collide on the member's balance row: one rolls back and its publication waits for the re-delivery job, and a parallel intake (for example a daily file) collides repeatedly. Who inserts a member's first `points_balance` row is not stated, so two first movements race on the primary key. `apply` also sets `last_movement_at` to the movement's `at`, so a purchase that arrives late (its `purchasedAt` older than movements already recorded) moves the date LOYALTY/UC-01 step 2 shows ("the date of the last movement") backwards.
- **Options:**
  - **A.** One atomic upsert: `INSERT ... ON CONFLICT (tenant_id, member_id) DO UPDATE SET balance = points_balance.balance + EXCLUDED.balance, last_movement_at = GREATEST(points_balance.last_movement_at, EXCLUDED.last_movement_at), version = points_balance.version + 1` - no lost update, no optimistic retry, creates the first row; the row lock serialises one member's movements until commit.
  - **B.** Keep the optimistic update and add a per-member advisory lock before it - explicit; two locks per transaction with a fixed order (purchase, then member) to avoid deadlocks, and the first-row race still needs its own fix.
- **Recommendation:** A, in § 7.2 and 05 § 8.2, keeping `ck_balance_non_negative` as the backstop, with a concurrent-member test (OI-21).
- **Why:** LOYALTY/NFR-01 (the points balance is always right) and LOYALTY/NFR-02 (take-back within 1 hour of the refund being paid) both suffer when routine concurrency becomes rollbacks and delayed re-deliveries; A makes the projection update one statement whose atomicity PostgreSQL guarantees. Tradeoff accepted: `version` no longer detects anything on this table.
- **Status:** Open

---

### OI-16: A ledger correction cannot be recorded, so RB-06 cannot be executed

- **Where:** loyalty / § 7.2 Domain Types (`MovementType`), § 7.3 `LoyaltyNightlyJob.run`; 05 § 8.2 `points_movement`; 10 § 13.8 RB-06
- **Type:** Error path
- **Concern:** The `BalanceMismatch` alert pages (10 § 13.7), and RB-06 step 3 says "a correction is a new movement ... followed by a balance update", as SDD §17.4 Constraints requires. The schema cannot hold one: `MovementType` is `EARN` or `TAKE_BACK`, `ck_movement_sign` ties the sign to those two types, `purchase_reference` is not null, `uq_movement_earn` allows one EARN per purchase, and a TAKE_BACK needs a refund. RB-06 also treats every mismatch as a ledger error, while SDD §20.2 names the likely cause as "a movement written without its balance update, or a manual data change", where the ledger is right and only the projection is wrong. The page therefore has no executable fix.
- **Options:**
  - **A.** Two repair paths: a projection rebuild (recompute one member's `points_balance` from their movements, using the OI-15 update) when the ledger is right, and an `ADJUSTMENT` movement type (signed points, mandatory reason, change reference, no purchase or refund) when the ledger is wrong, with `PointsMovementDetail.source.kind` gaining `ADJUSTMENT` additively - both SDD §20.2 causes get a reviewed fix; the SDD §17.4 type list must change through sdd-unifier.
  - **B.** Only the projection rebuild - no schema change; a wrong movement can never be corrected without breaking the append-only rule.
- **Recommendation:** A, in § 7.2, 05 § 8.2, and RB-06, flagged for the SDD owner because it extends the SDD type list.
- **Why:** SDD §17.4 promises that "a correction is a new movement" and LOYALTY/NFR-01 (the points balance is always right) needs a way back once the integrity job finds a difference; A gives each cause its own fix. Tradeoff accepted: a new movement kind that the member's history must render (LOYALTY/UC-02 step 4 shows the purchase or refund a movement came from).
- **Status:** Open

---

### OI-17: Primary and foreign keys do not carry tenant_id

- **Where:** global / 05 § 8.2 Tables (every `id` primary key; `fk_item_request`, `fk_history_request`, `fk_attempt_payout`, `fk_attempt_notification`); 05 § 8.3 closing sentence
- **Type:** Multi-tenancy leak
- **Concern:** 05 § 8.3 states that "every index and unique constraint starts with `tenant_id`", but every primary key is `id` alone and every foreign key references `id` alone. Besides contradicting the CLAUDE.md rule ("every index in shared-schema includes `tenant_id`"), this leaves the one isolation hole row-level security cannot close: PostgreSQL checks foreign keys without applying row-level security, so a child row written with the right `tenant_id` but a parent ID from another tenant (an application bug) is accepted. Both guards of SDD ADR-03 look only at the child's own `tenant_id`.
- **Options:**
  - **A.** Composite primary keys (`tenant_id`, `id`) and composite foreign keys everywhere - the rule holds literally; composite ID mapping on every JPA entity.
  - **B.** Keep the UUIDv7 primary key, add `UNIQUE (tenant_id, id)` on the three parent tables (`refund_request`, `payout`, `notification`) and composite foreign keys `(tenant_id, <parent>_id)` on their children, and record the primary-key index as an explicit exception in 05 § 8.3 - closes the cross-tenant reference with simple JPA IDs; three extra unique indexes and a written exception to a CLAUDE.md rule.
- **Recommendation:** B, as a close call, with the exception flagged `> Confirm:` for the owner of the CLAUDE.md rule.
- **Why:** B removes the only cross-tenant path the two guards miss at the cost of three indexes, while A spreads composite IDs through every aggregate for the same protection; the remaining deviation (the primary-key index itself) carries no data risk because every lookup also carries the `@TenantId` predicate. Tradeoff accepted: a documented exception to "every index includes `tenant_id`".
- **Status:** Open

---

### OI-18: Runbook queries and the idempotency cleanup job run without a tenant context

- **Where:** global / 10 § 13.8 RB-05 step 1 and RB-06 step 2; 05 § 8.6 Retention (`idempotency_record` cleanup job); 09 § 12.2 TTL; refund § 7.2
- **Type:** Multi-tenancy leak
- **Concern:** RB-01 sets `app.tenant_id` before reading `payout.payout`, but RB-05 step 1 and RB-06 step 2 query `payout.payout` and `loyalty.points_movement` with no tenant: run as the application role under `FORCE ROW LEVEL SECURITY` they error, and run as a role that bypasses row-level security they mix tenants. RB-06 sums by `member_id` alone although `member_id` is unique only within a tenant (`points_balance` primary key (`tenant_id`, `member_id`)), so its answer can add two members' movements. Separately, 05 § 8.6 and 09 § 12.2 promise a daily idempotency cleanup ("purged daily"), but refund § 7.2 has no such job, no schedule, no single-replica lock, and no tenant loop, and SDD §11.3 does not list it among the background jobs.
- **Options:**
  - **A.** Every runbook query starts with `SELECT set_config('app.tenant_id', '<tenant>', false);`, filters on `tenant_id`, and runs as the application role, never a bypassing role; the cleanup becomes `IdempotencyRecordPurgeJob` in refund § 7.2, under `SingleReplicaJobLock`, looping over `TenantConfig` like the other jobs, with `IDEMPOTENCY_RETENTION_HOURS` in 10 § 13.1 - copy-pasteable and isolated; one more job to build.
  - **B.** Fix the runbooks and drop the cleanup promise until SDD §17.1 sets the replay window - nothing to build now; the table grows unbounded (small at about 40 requests a day plus their decisions) and 09 § 12.2 must stop saying "purged daily".
- **Recommendation:** A.
- **Why:** CLAUDE.md forbids cross-tenant queries and SDD §11.2 extends that to background work; runbooks are run under pressure by someone new to the service (10 § 13.8 convention), so the tenant step must be in the text. Tradeoff accepted: one more scheduled job whose retention value stays a TODO.
- **Status:** Open

---

### OI-19: Background work lacks the alerts and trace links the SDD asks for

- **Where:** notification / 05 § 8.2 `notification` columns, § 7.3 `PayoutFailedListener`; payout / § 7.8 reconciliation Error handling; loyalty / § 7.3 `LoyaltyNightlyJob`; 10 § 13.3 and § 13.7
- **Type:** Implementation gap
- **Concern:** Three SDD observability requirements have no instrument. (1) SDD §17.3 says a message with no usable recipient, and one that exhausts its retries, is "marked Failed and alerted", but 10 § 13.7 has no alert on `notification_messages_total{status="FAILED"}` (only `MessageBacklog` on pending age), and the "no manager found" path of `PayoutFailedListener` alerts on nothing measurable. (2) SDD §17.3 Tracing links each MsgHub call to "the trace of the source event", yet `notification` stores no trace context (payout has `trace_parent` for exactly this), so the dispatcher's span starts a new trace with a new correlation ID and a customer's submit cannot be followed to the SMS. (3) The four single-replica jobs have no liveness signal: a reconciliation whose report read failed is "logged at ERROR and alerted" (payout § 7.8) with no metric behind the alert, and a nightly integrity job that stopped running reports zero balance mismatches, which reads as healthy.
- **Options:**
  - **A.** Add a `NotificationFailed` alert (Warn, `increase(notification_messages_total{status="FAILED"}[15m]) > 0`, RB-03) and a counter for alerts without a recipient; store `trace_parent` and `correlation_id` on `notification` (LLD-only, as on `payout`) and link the MsgHub span; export a last-success timestamp per single-replica job with one staleness alert per job - every SDD "alerted" has a rule; a few more alert rules and two columns.
  - **B.** Rely on ERROR logs for these cases - nothing to add; contradicts CLAUDE.md's alerting on SLOs and leaves a silent nightly job indistinguishable from a healthy one.
- **Recommendation:** A, in 05 § 8.2, 10 § 13.3, § 13.7, and § 13.8.
- **Why:** CLAUDE.md makes observability non-optional, and SDD §11.4 alerts on the REFUNDS/NFR-01 and LOYALTY/NFR-01 controls, which only mean something if the jobs producing them are known to run. Tradeoff accepted: a few more rules for on-call to own.
- **Status:** Open

---

### OI-20: Event DTO and OpenAPI compatibility is asserted but not enforced

- **Where:** global / 07 header (Schema registry, Serialisation); 09 § 12.4 `PiiEncryptingEventSerializer`; 06 § 9.5; 13 § 16.7 CI Gates; 03 § 6.2 rolling update
- **Type:** Implementation gap
- **Concern:** The LLD relies on "additive only" for event DTOs (SDD §14.10 rule 7) and on `/v1` with "breaking changes require a new version" for REST, but nothing checks either. During a rolling update old and new pods share the publication log, and `EventRedeliveryJob` runs on whichever pod holds the lock: a publication written by a new pod with an added field is read back by an old pod through `PiiEncryptingEventSerializer`, whose unknown-property policy is not stated (Spring Boot's default mapper ignores unknown properties; a serializer with its own mapper may not), and each failure spends a re-delivery. On the REST side, 13 § 16.7 has no gate that would catch a breaking change to `refund-v1.yaml` or `loyalty-v1.yaml`, including the Problem `type` URIs clients may key on.
- **Options:**
  - **A.** State a tolerant-reader rule for the serializer (ignore unknown properties, treat a missing new field as absent), add a round-trip test per event DTO against JSON fixtures of the previous release, and add an OpenAPI breaking-change check to CI once its tool is approved - compatibility is tested rather than assumed; a tool choice to ask about (CLAUDE.md: no new dependency without asking).
  - **B.** Document the rules only - no build change; the first violation shows up in production during a rollout.
- **Recommendation:** A, with the OpenAPI tool flagged `> Confirm:` in 13 § 16.7.
- **Why:** CLAUDE.md requires backward-compatible schemas and URI versioning, and SDD AP-10 makes additive change the contract; A turns both into checks, and the fixture test needs nothing new. Tradeoff accepted: fixtures to refresh at each release.
- **Status:** Open

---

### OI-21: The required integration tests omit the failure modes found in this review

- **Where:** global / 13 § 16.3 Integration Test Conventions (Required cases), § 16.2 examples, § 16.4
- **Type:** Test gap
- **Concern:** The required cases cover the races the SDD names (concurrent submissions on the item index, cancel versus decide, API-01 atomicity, concurrent claims, duplicate `RefundPaid`, refund before purchase, the nightly job, tenant isolation) but none of the failure modes above: listeners under row-level security (OI-01), a same-key duplicate in flight (OI-02), one key across two requests or two callers (OI-03), the first request of a new tenant (OI-05), a lease expiring under a slow provider with two dispatchers (OI-06), shutdown mid-batch (OI-07), refusal and timeout classification behind the fallback (OI-08), reconciliation across days (OI-09), the re-delivery limit and the RB-02 reset (OI-10), Problem Details for 401, 403, malformed bodies, and malformed IDs (OI-11), a directory outage (OI-12), a missing template (OI-13), an intake tenant mismatch (OI-14), and concurrent or late movements of one member (OI-15). Each of these is a race, an ordering, or a row-level security effect that passes CI today.
- **Options:**
  - **A.** Add one named integration test per item to 13 § 16.3 (CLAUDE.md naming, for example `onRefundPaid_forcedRowLevelSecurity_recordsTakeBack`, `submit_sameKeyInFlight_replaysCreatedResponse`, `dispatchDue_leaseExpiresDuringSlowCall_sendsOnce`), on Testcontainers PostgreSQL with real repositories and the non-owner role - each defect gets a regression test; a longer integration stage.
  - **B.** Cover the same items with unit tests and mocked repositories - faster; mocks cannot reproduce locks, constraint order, or row-level security, so the defects stay invisible.
- **Recommendation:** A, adjusting each test to the option chosen when its OI is resolved.
- **Why:** CLAUDE.md requires Testcontainers integration tests with no mocked repositories, and only a real database shows these effects. Tradeoff accepted: a slower integration stage.
- **Status:** Open

---

### OI-22: SDD content is restated instead of referenced

- **Where:** global / 08 § 11.1 (`RefundRequest` and `Payout` state diagrams); 13 § 16.3 Required cases; 12 § 15.5 Peak Scenarios; 09 § 12.1 role-to-permission row
- **Type:** Duplication
- **Concern:** Several sections copy SDD facts instead of linking them and adding the delta. 08 § 11.1 redraws SDD Figure 12 and Figure 15 transition for transition (the guard and side-effect tables below them are the real delta). Chunk 13 opens with "SDD AP-11 and each module's SDD Developer Notes (testing), referenced, not restated", then § 16.3 restates those notes almost word for word ("the unique active-item index under two concurrent submissions; the cancel-versus-decide race; ... two refunds of one purchase paid before and after the purchase arrives; the nightly integrity job"). 12 § 15.5 says it "adds the mechanism only" but repeats the SDD §18.3 multipliers, durations, and mitigations. 09 § 12.1 repeats the SDD §16.12.2 permission counts (4, 2, 4). Each copy drifts silently when the SDD changes (sdd-to-lld.md § One fact, one home, rules 1, 4, and 5).
- **Options:**
  - **A.** Replace each copy with a link plus the delta: link Figures 12 and 15 above the transition tables; in 13 § 16.3 link the SDD Developer Notes and list only the cases the LLD adds; in 12 § 15.5 keep the scenario name and the LLD mechanism; drop the counts in 09 § 12.1 - one home per fact; one more link to follow.
  - **B.** Keep the copies as derived views with a Source column and a drift rule, as 03 § 6.3 does - self-contained reading; every SDD change needs a sweep of the copies.
- **Recommendation:** A.
- **Why:** The skill's own rule makes restated upstream content a review defect whose fix is a reference-based rewrite, and these copies add nothing an implementer needs beyond the delta tables already present. Tradeoff accepted: the state diagrams live only in the SDD.
- **Status:** Open

---

### OI-23: The Specs Mission promises exactly-once payment, and the Tech Stack and Roadmap overstate the body

- **Where:** global / 17-specs § 1 Mission, § 2 Tech Stack, § 3 Roadmap (P1)
- **Type:** Specs-body mismatch
- **Concern:** The Mission says "Every refund is recorded, decided once, and paid exactly once". The body and the SDD promise less: a payout can end `FAILED` or `UNKNOWN` after 24 hours with the request left Approved and nothing designed after that (SDD §17.2 Failure and After Failed, 09 § 12.5), and the SDD §18 target for REFUNDS/NFR-01 is zero duplicates with every payout terminal and reconciled, that is at most once with failures surfaced; rejected and cancelled refunds are never paid at all. Because speckit `/constitution` reads the Mission verbatim, an implementer can take "paid exactly once" as licence to re-request failed payouts, which RB-05 ("never re-request a payout") and SDD §17.2 (an Unknown payout is "never retried or re-requested until reconciled") forbid. Two smaller mismatches: § 2 says "The stack equals `03-architecture.md` § 6.3", but § 6.3 also carries Keycloak, Resilience4j, the observability stack, Maven, and "Cache: None"; and Roadmap P1 delivers the "Keycloak realm", which 01 § 2.2 puts out of scope ("Keycloak realm configuration ... referenced, not designed here").
- **Options:**
  - **A.** Reword: Mission sentence 2 to "Every refund is recorded and decided once; an approved refund is paid at most once, and a payout that cannot complete is surfaced and reconciled; every points balance equals the sum of its movements"; § 2 to "summarises § 6.3"; P1 to "Keycloak realm integration (realm configuration out of scope, § 2.2)" - the constitution says what the body builds; three text edits.
  - **B.** Keep the Mission as an aspiration and add a caveat in 01 § 2.2 - no Specs edit; the constitution input keeps a promise the design does not make.
- **Recommendation:** A.
- **Why:** The Specs chunk is the constitution-grade summary of the body and SDD §1 (sdd-to-lld.md § Specs ownership), so a stronger promise than the design is exactly the drift it must not carry, here on money. Tradeoff accepted: a less absolute Mission sentence.
- **Status:** Open

---

### OI-24: A business rule is cited without its label, once without its key

- **Where:** loyalty / § 7.8 LOYALTY/UC-02 (Trigger line and the take-back sequence diagram note)
- **Type:** Traceability gap
- **Concern:** The Trigger line reads "the take-back of BR-1 is realised by `RefundPaidListener`", with neither the use case key nor the rule's label, and the sequence diagram note reads "LOYALTY/UC-02 BR-1, after REFUNDS/UC-04 step 7" without the label. sdd-to-lld.md § The link rule 5 treats `BR-n` and `AC-n` as positions that always carry a short label; a bare "BR-1" is ambiguous between LOYALTY/UC-01 BR-1 (members see only their own points) and LOYALTY/UC-02 BR-1 (points taken back when the purchase is refunded). Every other BR and AC citation in the LLD is keyed and labelled.
- **Options:**
  - **A.** Write "the take-back of LOYALTY/UC-02 BR-1: points taken back when the purchase is refunded" in the Trigger line and "LOYALTY/UC-02 BR-1: points taken back on refund" in the diagram note - consistent with the rest of the LLD; two edits.
  - **B.** Leave them because the surrounding text names LOYALTY/UC-02 - no edit; a search for the labelled rule misses both lines.
- **Recommendation:** A.
- **Why:** The traceability rules exist so that a search by rule finds every place that realises it; the fix is mechanical. Tradeoff accepted: none beyond the edit.
- **Status:** Open

---

### OI-25: A payout reconciled to Succeeded after the managers were told it failed gets no follow-up

- **Where:** payout / § 7.3 `PayoutReconciliationServiceImpl.reconcile`; notification / § 7.2 Event to message plan (`payout-failed`)
- **Type:** Missing scenario
- **Concern:** A payout still unresolved 24 hours after its first attempt ends `UNKNOWN` and publishes `PayoutFailed`, so the branch managers are emailed that it failed (REFUNDS/UC-04 E1). If the daily reconciliation later finds CardPay paid it, the payout moves to `SUCCEEDED`, `PayoutSucceeded` makes the request Paid, and the customer is told, but the managers who were told of a failure hear nothing more and may act on stale information (SDD R-07 notes that refunds are still handled on paper at the counter during rollout). No BRD use case covers a resolved alert: REFUNDS/UC-04 E1 ends at telling the manager. The chunk 15 Confirm on 07 § 10.6 covers the late Paid status, not the managers' view.
- **Options:**
  - **A.** Raise it as an open question to the REFUNDS owner in 15 § 18.4 (never a new use case), and meanwhile add a step to RB-05 to tell the branch when a reconciled payout clears an earlier alert - no contract change; relies on the runbook until the BRD decides.
  - **B.** Send a "payout resolved" message to the managers when a reconciled payout succeeds - closes the loop automatically; needs `notification` to listen to `PayoutSucceeded`, which the SDD §14.7 payout outcome doctrine forbids, or a new event, both SDD changes without a BRD basis.
- **Recommendation:** A.
- **Why:** The LLD must not invent behaviour or use cases (sdd-to-lld.md § IDs and keys, rule 1) and B would break the SDD §14.7 doctrine; A leaves the decision with the BRD owner while closing the operational gap by procedure. Tradeoff accepted: a manual step until the BRD decides.
- **Status:** Open

---

## Resolution Log

<!-- When an open item is resolved, move its summary here with a pointer to the LLD update (chunk + service + sub-section). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| - | - | - | No item resolved yet |

---

## Reviewer Notes

<!-- The coverage table is required (SKILL.md step 7): one row per risk surface per service, plus the three `global` rows. Zero findings is valid for a surface that was checked. Free-form notes that did not become a numbered open item follow it. -->

| Service | Risk surface | Checked | Findings | What was checked |
|---------|--------------|---------|----------|------------------|
| refund | Error envelope (RFC 9457) | Yes | OI-11, OI-02 | refund § 7.7 against SDD §17.1 Error Handling and §15.1 codes: the eight domain codes and their statuses match (`RECEIPT_NOT_FOUND` 404 to `REJECTION_REASON_REQUIRED` 422); 09 § 12.6 envelope fields and mapping rules; 06 § 9.2 409 sample; 06 § 9.1 status columns. Filter-level and framework errors fall outside the advice (OI-11); a concurrent duplicate decision can surface as 500 (OI-02). |
| refund | Transactions | Yes | OI-01, OI-02 | § 7.6 against § 7.3: POS reads outside any transaction (`refundableItems` step 1, `submit` step 2), REQUIRED and READ_COMMITTED business transactions, MANDATORY join of API-01 (payout § 7.6), REQUIRES_NEW listener, REPEATABLE_READ read-only report; tenant binding order against 05 § 8.4 and 09 § 12.1 (OI-01); write order inside `submit`, `cancel`, `decide` (OI-02). |
| refund | Idempotency | Yes | OI-02, OI-03, OI-04 | § 7.4 Pattern: Idempotency, 09 § 12.2, 05 § 8.2 `idempotency_record`, 06 § 9.1 Idempotency-Key column, 11 § 14.5, chunk 14, against SDD §17.1 API Standards and CLAUDE.md; API-01 idempotency on `refundId` (08 § 11.2 matrix) holds. |
| refund | Multi-tenancy | Yes | OI-01, OI-05, OI-17, OI-18 | Every repository method in § 7.2 under `@TenantId` and row-level security; native `BranchRefundReportQuery` under the explicit-predicate rule of 05 § 8.4; all refund indexes in 05 § 8.3 lead with `tenant_id`; per-tenant `reference_sequence` seed (OI-05); keys (OI-17); listener and replay-read binding (OI-01); idempotency cleanup job (OI-18). |
| refund | Outbox | Yes | No issue found | Publication points (`submit` 4h, `cancel` 2c, `decide` 2e, `onPayoutSucceeded` 6) sit inside the business transaction; the log is the registry in schema `platform` (05 § 8.2); a publication completes only when its listener commits (SDD §14.10 rule 2); every listener dedups (07 § 10.6); refund makes no provider write, and its API-01 row commits with the approval. |
| refund | Saga compensation | Yes | No issue found | § 7.4 Pattern: Saga step table; API-01 errors roll the approval back (08 § 11.2 matrix, § 7.6); a poison `PayoutSucceeded` stays incomplete for RB-02; the missing post-Failed compensation is already a chunk 15 TODO (09 § 12.5) and is not repeated. |
| refund | Retry and backoff | Yes | OI-10 | `pos-records`: one retry with jitter on timeout or 503 per SDD §12 INT-03 (a), bulkhead 20, breaker 50% over 20 calls, no in-call retry on writes (09 § 12.3); re-delivery cadence of the `PayoutSucceeded` listener (OI-10). |
| refund | Observability | Yes | No issue found | refund metrics in 10 § 13.3 against SDD §17.1 Metrics (four match, plus LLD-only `refund_poison_events_total` with the `RefundPoisonEvent` alert); `@UseCase` on the seven traced entry points with the SDD §7.3 values (09 § 12.8); INFO content per SDD §17.1 Logging; span naming in 10 § 13.5; no tenant or contact data at INFO. |
| refund | Test coverage | Yes | OI-21 | 13 § 16.2 `RefundDecisionServiceImplTest` and `RefundWindowPolicyTest`; § 16.3 required cases; § 16.8 four REFUNDS specs against BRD chunk 16 (13 distinct cases tagged; REFUNDS/TC-DEC-04, REFUNDS/TC-NFR-01, REFUNDS/TC-NFR-02 not automated with reasons). |
| refund | Schema versioning | Yes | OI-20 | `/v1` prefix and `refund-v1.yaml` (06 header, § 9.5 snippet); event DTOs in `refund.api` changed additively (07 header, SDD §14.10 rule 7); serializer tolerance and CI compatibility checks (OI-20). |
| refund | Duplication | Yes | OI-22 | 08 § 11.1 `RefundRequest` diagram against SDD Figure 12; 13 § 16.3 refund cases against SDD §17.1 Developer Notes; 05 § 8.2 refund tables accepted as the template's physical schema view (rows cite "As SDD §17.1"). |
| payout | Error envelope (RFC 9457) | Yes | No issue found | No REST surface (SDD §17.2 API Standards, 06 § 9.1); the three API-01 typed errors extend `ServiceException` with their SDD §15.3 `errorCode` and reach the client through the platform advice at refund's REST edge (payout § 7.7, refund § 7.7); provider failures never surface as errors. RFC 9457 does not apply to the module itself. |
| payout | Transactions | Yes | OI-06 | MANDATORY on `requestPayout` (06 § 9.6); claim and outcome in separate REQUIRES_NEW transactions with the CardPay call outside (§ 7.6); one transaction per reconciled payout; the reconciliation lock's dedicated connection (09 § 12.9); the `recordOutcome` re-read cannot catch a stale claimant (OI-06). |
| payout | Idempotency | Yes | OI-06 | API-01 dedup on (`tenant_id`, `refund_id`) with the amount check (§ 7.3 step 4, SDD §15.3 Behaviour); CardPay key = payout ID (ADR-09); concurrent sends after lease expiry (OI-06); CardPay deduplication itself is a chunk 15 TODO. |
| payout | Multi-tenancy | Yes | OI-08, OI-17, OI-18 | `claimDue` native query with `tenant_id` and the per-tenant loop (SDD §11.2); reconciliation per tenant under row-level security; `idx_payout_claim` and `uq_payout_refund` lead with `tenant_id`; breaker scope across tenant credentials (OI-08); keys (OI-17); RB-05 query (OI-18). |
| payout | Outbox | Yes | OI-06, OI-07 | Dispatch-table outbox (§ 7.4): row written in the approval transaction through MANDATORY, separate dispatcher in every replica with SKIP LOCKED, SUCCEEDED only after CardPay confirms, FAILED or UNKNOWN never dropped, same key on resend (09 § 12.4); lease sizing and claimant check (OI-06); shutdown drain (OI-07). |
| payout | Saga compensation | Yes | OI-09, OI-25 | Step 2 of the choreography (refund § 7.4); terminal states and reconciliation as the settle path for Unknown (SDD §17.2 Reconciliation, 08 § 11.1); no compensation by design (chunk 15 TODO); reconciliation algorithm (OI-09); managers' follow-up after a reconciled success (OI-25). |
| payout | Retry and backoff | Yes | OI-06, OI-08 | `BackoffPolicy` full jitter with a cap and an exponent cap (08 § 11.3); 24 h window from the first attempt; open circuit counted as an attempt (SDD §17.2 Failure); `cardpay` bulkhead 5 and breaker settings (09 § 12.3); fallback scope and failure classification (OI-08); lease against batch (OI-06). |
| payout | Observability | Yes | OI-19 | payout metrics in 10 § 13.3 against SDD §17.2 Metrics (five match); `PayoutNotTerminal`, `PayoutFailedOrUnknown`, `PayoutReconciliationMismatch` alerts; `trace_parent` link (05 § 8.2); port and dispatcher spans (10 § 13.5); a failed reconciliation run has no metric (OI-19). |
| payout | Test coverage | Yes | OI-21 | 13 § 16.2 `PayoutDispatchServiceImplTest` (four cases); § 16.3 concurrent claims and the 24 h rule with a fixed clock; § 16.4 consumer contract once API-03 exists; no lease, fallback, reconciliation, or shutdown case (OI-21). |
| payout | Schema versioning | Yes | OI-20 | `PayoutSucceededEvent`, `PayoutFailedEvent`, `RequestPayoutCommand`, `PayoutAccepted` in `payout.api`, additive per SDD AP-10; API-01 is checked at compile time in process; event serializer tolerance (OI-20). |
| payout | Duplication | Yes | OI-22 | 08 § 11.1 `Payout` diagram against SDD Figure 15; 12 § 15.5 CardPay outage row against SDD §18.3; the § 7.4 delivery rules are LLD delta. |
| notification | Error envelope (RFC 9457) | Yes | No issue found | No REST endpoint and no port (SDD §17.3 API Standards; § 7.7 closing line); failures are attempt outcomes and alerts. RFC 9457 does not apply. |
| notification | Transactions | Yes | OI-01, OI-12 | Listener REQUIRES_NEW, claim and outcome transactions with the MsgHub call outside, purge per batch (§ 7.6); listener tenant binding (OI-01); directory call inside the listener transaction (OI-12). |
| notification | Idempotency | Yes | OI-06 | `insertIfAbsent` with ON CONFLICT on (`tenant_id`, `source_event_id`, `channel`, `recipient_key`) against SDD §14.10 `RefundSubmitted` Notes and SDD §17.3; MsgHub key = notification ID; concurrent resends after lease expiry (OI-06); MsgHub deduplication is a chunk 15 TODO. |
| notification | Multi-tenancy | Yes | OI-01, OI-08, OI-17 | `claimDue` per tenant; tenant in the dedup key; listener tenant from the DTO (SDD §17.3 API Standards); `managersOf(tenantId, branchId)`; the purge job falls under the per-tenant job rule of 05 § 8.4; shared `msghub` breaker across tenant credentials (OI-08); listener binding (OI-01); keys (OI-17). |
| notification | Outbox | Yes | OI-06, OI-07, OI-13 | Dispatch-table outbox (§ 7.4): rows written in the listener transaction, separate dispatcher, SENT only after MsgHub accepts, FAILED never silent (SDD §17.3); lease and claimant (OI-06); shutdown (OI-07); render failure path (OI-13). |
| notification | Saga compensation | Yes | No issue found | Participant at step 4 only (refund § 7.4); messages never change refund or payout state (SDD §17.3 Responsibility), so there is nothing to compensate; a failed message ends FAILED per SDD §17.3. |
| notification | Retry and backoff | Yes | OI-08, OI-10, OI-13 | Dispatcher backoff with jitter and an attempt limit (§ 7.3; the limit is a chunk 15 TODO); `BackoffPolicy` not wired and settings missing (OI-13); fallback shape (OI-08); listener re-delivery during a directory outage (OI-10). |
| notification | Observability | Yes | OI-19 | notification metrics in 10 § 13.3 against SDD §17.3 Metrics (three match); `MessageBacklog` alert; recipient and body never logged (SDD §17.3 Logging); FAILED messages not alerted and no trace context on rows (OI-19). |
| notification | Test coverage | Yes | OI-21 | 13 § 16.3 duplicate events and concurrent dispatchers (SDD §17.3 Developer Notes); no render-failure, directory-outage, or stale-claimant case (OI-21). |
| notification | Schema versioning | Yes | OI-20 | Consumer of five DTOs from `refund.api` and `payout.api`; listener identities named per SDD §14.10 rule 7 (07 § 10.6); tolerant reader unspecified (OI-20). |
| notification | Duplication | Yes | OI-22 | 12 § 15.5 MsgHub outage row against SDD §18.3; the § 7.2 event-to-message plan cites SDD §17.3 and adds template keys and render data (delta, not duplication). |
| loyalty | Error envelope (RFC 9457) | Yes | OI-11 | § 7.7 against SDD §17.4 Error Handling: 403 `FORBIDDEN` without `member_id`, 404 `NOT_FOUND` for another member's movement, 400 `VALIDATION_FAILED` for a malformed cursor; a non-UUID `movementId` fails in framework conversion, outside the mapped exceptions (OI-11). |
| loyalty | Transactions | Yes | OI-01, OI-15 | Listener REQUIRES_NEW with a per-purchase `pg_advisory_xact_lock`, `ingest` REQUIRED per purchase, nightly REPEATABLE_READ per tenant and step (§ 7.6); listener tenant binding (OI-01); balance update conflicts and first-row creation (OI-15). |
| loyalty | Idempotency | Yes | No issue found | `uq_movement_earn`, `uq_movement_take_back`, `uq_pending_refund` (05 § 8.3) with the existence check under the purchase lock (§ 7.3 step 3) and `insertEarnIfAbsent`; matches SDD §17.4 (idempotent on `refundId` and on (`tenant_id`, `purchase_reference`)); the cumulative cap of 08 § 11.2 holds under concurrency. |
| loyalty | Multi-tenancy | Yes | OI-14, OI-17, OI-18 | `PointsController` queries bound to the `member_id` claim, never a path parameter (SDD §17.4 Constraints); purchase lock key includes the tenant; nightly job per tenant; intake tenant source (OI-14); keys (OI-17); RB-06 query (OI-18). |
| loyalty | Outbox | Yes | No issue found | Publishes no event and makes no provider write (§ 7.4 Pattern: Outbox not applied; SDD §17.4 Output); as a listener its publication completes only when its own transaction commits. Not applicable beyond that. |
| loyalty | Saga compensation | Yes | OI-16 | TAKE_BACK as the compensating entry of a refunded purchase under the cumulative cap (08 § 11.2); pending take-backs and their expiry (wait period is a chunk 15 TODO); corrections required by SDD §17.4 cannot be recorded (OI-16). |
| loyalty | Retry and backoff | Yes | OI-10 | Take-back re-delivery against LOYALTY/NFR-02 (1 hour) and the `TakeBackLag` alert (OI-10); intake retries depend on the open intake mode (OQ-02, chunk 15). |
| loyalty | Observability | Yes | OI-19 | loyalty metrics in 10 § 13.3 against SDD §17.4 Metrics (five match); `TakeBackLag` and `BalanceMismatch` alerts; `member_id` only at DEBUG; the nightly job's liveness has no signal (OI-19). |
| loyalty | Test coverage | Yes | OI-21 | 13 § 16.2 `TakeBackServiceImplTest`; § 16.3 duplicate `RefundPaid`, refund before purchase, two refunds of one purchase, nightly job; no concurrent-member, late-purchase, or intake-tenant case (OI-21). |
| loyalty | Schema versioning | Yes | OI-20 | `loyalty-v1.yaml` with `/v1` (06 header); OpenAPI schema name `PointsBalance` (chunk 15 Confirm); `RefundPaid` consumer tolerance (OI-20). |
| loyalty | Duplication | Yes | OI-22 | 13 § 16.3 loyalty cases against SDD §17.4 Developer Notes (restated nearly word for word). |
| global | Contract drift (SDD §14 with §14.10 in-process events, §15 with Internal (in-process) ports, §16) | Yes | No issue found | 07 § 10.6 against SDD §14.10: six event names, publishers, listeners, after-commit phase, DTO names, and When cells match; DTO fields used in the pseudocode (`RefundPaidEvent`, `PayoutSucceededEvent`, `PayoutFailedEvent`) match §14.10 and §14.9.0; listener dedup keys match the Notes. 06 § 9.6 and payout § 7.3 against SDD §15.3 API-01: port, operation, both DTOs and their fields, three errors with codes, `payout.payout.request` at the port, joins the caller's transaction, idempotent on `refundId`; API-02 to API-04 kept TBD - external. The nine SDD §16.11 tokens are used verbatim per entry point (04 § 7.2 Authorization, 06 § 9.1); role counts 4, 2, 4 match §16.12.2; route guards use the §16 role names. Deviations already flagged in chunk 15 (dedup of `PayoutSucceeded` on the transition, reconciliation as a second publisher) are not repeated. |
| global | Specs-body consistency | Yes | OI-23 | 17 § 1 Mission against SDD §1 and the payout outcome rules (SDD §17.2, §18); § 2 Tech Stack against 03 § 6.3 and SDD §6 (versions agree; the "equals" claim does not); § 3 Roadmap: all four services exist in SDD §13 and every UC ID is keyed as §7.3 writes it; P1's Keycloak realm against 01 § 2.2; § 4 Project Type (Greenfield) against SDD §1. |
| global | Use-case traceability | Yes | OI-24, OI-25 | Six workflow blocks (REFUNDS/UC-01, REFUNDS/UC-02, REFUNDS/UC-03, REFUNDS/UC-04 in refund; LOYALTY/UC-01, LOYALTY/UC-02 in loyalty) against SDD §7.3 rows and BRD headings: IDs, titles, keys, owners, and entry points match, and no use case has two blocks; UAT/BAT fields against BRD chunk 16 Related UC and its Traceability Matrix (16 cases); § 19.9 seven rows against §7.3 (order, groups, REFUNDS/UC-05 merged with "-" cells); the 12 routes of 14 § 17.3 against BRD chunk 14 Mockup coverage (REFUNDS/SCR-01, REFUNDS/SCR-02, REFUNDS/MK-03, LOYALTY/LP-01, LOYALTY/LP-02) and the route data; the six specs of 13 § 16.8; `@UseCase` on the ten traced entry points; 271 relative links resolved by file and GitHub-slug anchor (for example `#uc-04-approve--reject-refund`, `#73-use-case-traceability-brd--sdd`, `#2-refund-decisions-uc-04-mk-03`, `#1410-in-process-domain-events-modular-monolith--hybrid-core`, `#refundsuc-04-approve--reject-refund`); BR and AC labels (OI-24); behaviour no BRD use case covers (OI-25). |

- **Coverage totals:** 47 surfaces checked (44 service rows, 3 global rows); 38 carry at least one finding, 9 were checked with no issue found.
- **Overlaps with chunk 15, kept on purpose:** each of these items names a defect the matching flag does not, so resolve each pair together: OI-01 with the 05 § 8.4 Confirm (mechanism), OI-02 with the refund `submit` Confirm (table without an in-progress status), OI-06 with the payout `dispatchDue` TODO (lease value), OI-09 with the reconciliation data-source TODO, OI-10 with the 09 § 12.4 TODO (re-delivery values), OI-12 with OQ-04, OI-13 with the notification attempt-limit TODO, OI-14 with OQ-02, OI-25 with the 07 § 10.6 Confirm.
- **Link and flag checks:** all 271 relative links in the 22 LLD files written before this chunk resolve to an existing file and, where an anchor is given, to a heading slug built with GitHub's rules; the only unresolved link was the master's link to this chunk, which this file satisfies. The body holds 46 `> Confirm:` and 43 `> TODO:` flags, matching 00 Confidence Flag Summary and the chunk 15 tables.
- **Considered, not raised:** 05 § 8.2 restates the SDD columns, but the template expects the physical schema there and the rows cite "As SDD §17.x"; `REQUIRES_NEW` in jobs with no outer transaction is harmless; the purge job's tenant loop follows the general per-tenant job rule of 05 § 8.4.
- **Worth a `> Confirm:` in the body:** SDD ADR-09 and SDD §17.2 Developer Notes ask for a Resilience4j retry around the CardPay adapter, while payout § 7.4 makes `BackoffPolicy` the retry and uses no in-call retry; the delta is sound (no retry overlaps a call with an unknown outcome) but the deviation is not recorded.
- **For the PII-inventory review flagged in chunk 15:** `notification.reason` (the copied rejection reason) and the `rejectionReason` of serialized `RefundRejected` publications are free text outside 11 § 14.2 and outside `PiiEncryptingEventSerializer`, which encrypts only the `ContactPoint` fields.
- **Minor:** the `pos-records` adapter stacks `@Retry` over `@CircuitBreaker`; the retry should ignore open-circuit rejections so an open circuit fails fast instead of being retried.
- **Minor:** 09 § 12.7 keeps `tenant_id` at DEBUG only but does not say that `CallContextFilter` must keep the tenant out of the log MDC; an MDC field would appear on every INFO line.
- **Minor:** `SingleReplicaJobLock` holds a session-level advisory lock on a dedicated connection; if that connection drops, PostgreSQL releases the lock while the job keeps running, so a second replica can start the same job (idempotent per row, so the effect is duplicate alerts), and a transaction-pooling proxy would defeat the lock (none is planned in SDD §6).
- **Minor:** 06 § 9.1 omits 429 for `GET /v1/receipts/{receiptNumber}/refundable-items`, which the per-customer gateway limit returns (SDD §15.1 `RATE_LIMITED`); chunk 14 does not say whether the cancel and decide actions are hidden or disabled with a tooltip once a request is no longer Submitted (CLAUDE.md: permissions drive UI).
- **Contract and trace status:** no contract drift beyond what chunk 15 already flags; the use-case trace is otherwise complete (six blocks, seven index rows, twelve routes, six specs, ten annotated entry points).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 17-specs.md | NEXT: none -->
