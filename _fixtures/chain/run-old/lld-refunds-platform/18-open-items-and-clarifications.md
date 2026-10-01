<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: all preceding LLD chunks
PART OF: LLD - Refunds Platform
PURPOSE: Output of the post-generation cleared-context reviewer pass. Captures implementation-level gaps, missing edge cases, untested error paths, and pattern application questions flagged by an independent reviewer. Complements (does not replace) chunk 15 (Open Questions / confidence-flag index), which is author-generated.
GENERATED_BY: lld-unifier post-generation reviewer (cleared-context subagent run after the main LLD generation completes).
RELATIONSHIP_TO_15: chunk 15 indexes the author's own `> Confirm:` and `> TODO:` flags emitted during generation. Chunk 18 captures the *external* reviewer's adversarial findings: gaps the author did not flag inline.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of implementation-level concerns identified after the main LLD was authored, by a reviewer running with cleared context. Items are not blockers in themselves: they are decisions the implementer or technical lead needs to make before code can be written confidently.
>
> **What this section is not.** It is not a list of inline `> Confirm:` or `> TODO:` flags found in the body; those are indexed in chunk 15 (Open Questions). This section is the reviewer's *external* findings: edge cases the body did not consider, pattern applications that look wrong, error paths that were assumed away.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Service name + sub-section (e.g., `wallet-core / Method Pseudocode`), or "global" if cross-cutting. |
| **Type** | Implementation gap / Missing edge case / Pattern misapplication / Error path / Concurrency hazard / Transaction boundary / Idempotency gap / Multi-tenancy leak / Test gap / Drift (hybrid-mode only) / Duplication (SDD content restated instead of referenced). |
| **Concern** | One paragraph. What was missed and why it matters for code correctness or production reliability. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommendation** | REQUIRED. The reviewer's suggested option: always pick one, even for close calls (state that it is a close call in the Why). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins, that is, the evidence behind it (CLAUDE.md rule, SDD contract, code fact, correctness/production risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open / Resolved (link to LLD update) / Deferred (with rationale). |

---

## Open Items

### OI-01: Refund events take `aggregate_version` from the JPA version before the flush, so two events of one refund carry the same version

- **Where:** refund-service / `04-implementation/refund-service.md` § 7.4 (Pattern: Outbox, pseudocode skeleton) and § 7.3 (`submit`, `cancel`, `decide`); consumer side in `04-implementation/notification-service.md` § 7.3 (`dispatchOne` step B)
- **Type:** Concurrency hazard
- **Concern:** The outbox skeleton sets `aggregate_version = request.version`, and every command appends after mutating the aggregate but before the flush that increments the `@Version` column; only `submit` flushes first (`saveAndFlush`, step 5d). Hibernate increments the version during the flush at commit, so the value read at append time is the pre-update version: `REFUND_SUBMITTED` carries 0, the following `REFUND_APPROVED` or `REFUND_REJECTED` also carries 0, `REFUND_CANCELLED` carries 0 or 1 depending on whether `releaseClaims` happens to trigger a flush, and `REFUND_PAID` carries 1. SDD §14.3 defines the field as a per-aggregate monotonic counter and SDD §14.6 item 3 makes it notification-service's ordering guard, which skips a row only when a strictly newer version was already SENT (`existsNewerSent`). A `REFUND_SUBMITTED` redriven from the DLQ after `REFUND_APPROVED` was sent is therefore not superseded, and the customer receives "submitted" after "approved", the case the 13 § 16.3 scenario "DLQ redrive of an older event" claims to cover. Payout events are emitted from separate transactions and stay increasing, so the defect is refund-side.
- **Options:**
  - **A.** An explicit event counter on the aggregate: each transition method (`submit`, `cancel`, `approve`, `reject`, `markPaid`, `markPayoutFailed`) increments it and returns the domain event carrying the new value, which the outbox row copies - independent of flush timing; one column and one unit test per transition.
  - **B.** Flush before every append and read `version` afterwards - no new column, but correctness depends on every command, now and later, remembering the flush.
  - **C.** Write `version + 1` at append time - one-line change, but wrong for the insert case and silently wrong whenever a flush runs earlier.
- **Recommendation:** Option A: add an event-version column to `refund_request` (keep `@Version` for optimistic locking only), have `OutboxWriter.append` take the version from the domain event, and add tests asserting strictly increasing versions across SUBMITTED, APPROVED, and PAID, plus the DLQ-redrive scenario with real versions.
- **Why:** SDD §14.3 and §14.6 item 3 make this field the only ordering guard for customer messages; as drawn it is blind for the submission/decision pair, so REFUNDS 04 "told the outcome at each step" breaks on every redrive. A costs one column and removes the dependency on ORM flush timing; B works today but is one forgotten flush away from the same defect.
- **Status:** Open

---

### OI-02: `applyPayoutFailed` never records the payout event version, and a NULL version breaks the guard

- **Where:** refund-service / `04-implementation/refund-service.md` § 7.3 (`applyPayoutSucceeded` steps 2 and 5, `applyPayoutFailed` steps 2 to 6); `05-data-model.md` § 8.2 (`refund_request.last_payout_event_version`, NULL)
- **Type:** Implementation gap
- **Concern:** The stale-redelivery guard is `event.aggregateVersion <= request.lastPayoutEventVersion`, but only `applyPayoutSucceeded` stores the version it applied; `applyPayoutFailed` checks it ("stale version -> skip") and never writes it. The column is nullable and nothing defaults it, so the first payout event of every refund compares against NULL: an unboxing `NullPointerException` with an `Integer` field, which 07 § 10.4 treats as retryable (three retries, then `refund-service.dlq`, leaving the refund unpaid in the platform's view), or a load failure with an `int` field. Once that is patched, an older `PAYOUT_FAILED` redriven after a newer one is still re-applied, because the newer failure was never recorded, and it re-publishes `REFUND_PAYOUT_FAILED`, emailing the branch's managers a second time.
- **Options:**
  - **A.** Store the version in both handlers and declare `last_payout_event_version int NOT NULL DEFAULT 0` (a payout event always follows at least one claim, so it carries 1 or more) - one line plus the migration default.
  - **B.** Keep NULL as "nothing applied yet" with an explicit null branch - works, but every future reader of the column must remember it.
- **Recommendation:** Option A, with unit tests "FAILED then an older FAILED is skipped" and "FAILED then a newer SUCCEEDED is applied".
- **Why:** SDD §14.6 item 3 assigns `aggregate_version` validation to refund-service, and 07 § 10.4 lists `last_payout_event_version` as this consumer's idempotency strategy; applied to one handler only, it protects neither the failure path nor the first event. A is a one-line fix; B keeps a null trap in a money path.
- **Status:** Open

---

### OI-03: A payout success for a PAID refund is silently skipped, where SDD §17.1 dead-letters it

- **Where:** refund-service / `04-implementation/refund-service.md` § 7.3 (`applyPayoutSucceeded` step 3); `08-state-and-rules.md` § 11.1 (RefundRequest transition table)
- **Type:** Drift
- **Concern:** SDD §17.1 (Consumed events) says of `PAYOUT_SUCCEEDED`: "a request not in APPROVED goes to the DLQ"; the LLD makes the PAID case an "idempotent no-op" and does not flag the divergence in chunk 15. Exact redeliveries never reach this step (the inbox stops the same `event_id`), and payout-service emits at most one success per payout (both the record step and `receive` check for SUCCEEDED first), so a second `PAYOUT_SUCCEEDED` with a new `event_id` for a PAID refund can only come from an anomaly: a payout-service defect, a hand-made correction (RB-06 "reviewed script", see OI-13), or a second payout surfacing at CardPay. Those are the "paid twice" signals REFUNDS/NFR-01 exists to catch, and the no-op hides them with no metric, no log level, and no alarm.
- **Options:**
  - **A.** Follow SDD §17.1: throw `InvalidTransitionException` for PAID as well, so the event reaches `refund-service.dlq` and pages (`DlqNotEmpty`) - contract-true; RB-02 must then say to discard it after investigation, since a redrive fails again.
  - **B.** Keep the skip, add `refund_payout_success_on_paid_total` with a page, and log the divergence in chunk 15 for an SDD change - no DLQ noise, but the LLD deviates from the SDD until the SDD is amended.
- **Recommendation:** Option A, and add to RB-02 that a `PAYOUT_SUCCEEDED` for a PAID refund is a possible double payout to check with CardPay (RB-04 step 2) before it is discarded.
- **Why:** Close call. 01 § 1 keeps the SDD as the home of every contract decision, and the only sources of this event are money anomalies; a silent skip removes the one place refund-service would notice them. B is quieter but needs an SDD amendment to be legitimate.
- **Status:** Open

---

### OI-04: `IdempotencyInterceptor.afterCompletion` never sees the exceptions that `ProblemDetailsAdvice` handles

- **Where:** refund-service (shared `IdempotencyInterceptor`) / `09-cross-cutting.md` § 12.2 (flow, `afterCompletion`), § 12.6 (`ProblemDetailsAdvice`); `04-implementation/refund-service.md` § 7.7
- **Type:** Error path
- **Concern:** The flow records 4xx outcomes (`recordError`) and deletes records on 5xx (`abandon`) in "`afterCompletion` (exception thrown)". In Spring MVC, the exception passed to `HandlerInterceptor.afterCompletion` "does not include exceptions that have been handled through an exception resolver" (Spring Framework Javadoc), and every exception in this design is resolved by the global `@RestControllerAdvice`, including the catch-all 500. Implemented as written, neither branch ever runs: every business error and every 5xx leaves the record IN_PROGRESS for 24 hours, the web app's silent retry of `REQUEST_IN_PROGRESS` never ends, and a customer who received 503 `RECEIPT_LOOKUP_UNAVAILABLE` cannot retry with the same key, the very outcome OQ-01 and the SDD §11.1 "5xx deletes its record" rule are meant to prevent.
- **Options:**
  - **A.** Complete the record where the outcome is decided: `ProblemDetailsAdvice` reads the idempotency scope from the request attribute and calls `recordError` (4xx) or `abandon` (5xx) in `REQUIRES_NEW` before writing the body - one place that knows status and body; couples the advice to the idempotency component.
  - **B.** Keep the interceptor and branch on `response.getStatus()`, with the advice leaving the Problem body in a request attribute - no new logic in the advice, but two components share state through attributes and the response is already committed when it runs.
  - **C.** Move the idempotency flow into a servlet filter that wraps the response - sees every outcome, but re-implements body buffering and content negotiation.
- **Recommendation:** Option A, keeping in `afterCompletion` only a safety net that abandons a record still IN_PROGRESS when `response.getStatus() >= 500`; integration tests through the real advice: same key after 422 replays the 422, same key after 503 runs the command.
- **Why:** CLAUDE.md requires the global `@RestControllerAdvice`, which guarantees exceptions are resolved before `afterCompletion`; SDD §11.1 requires the 5xx delete and OQ-01 the 4xx replay. A puts the rule where the status is decided; B works but spreads it across two components.
- **Status:** Open

---

### OI-05: `abandon` deletes unconditionally, so a 5xx raised after commit lets a retry run the command again

- **Where:** refund-service (shared `IdempotencyService`) / `09-cross-cutting.md` § 12.2 (`abandon`: "REQUIRES_NEW: delete"); `04-implementation/refund-service.md` § 7.3 (`complete` inside the command transaction); `10-operations.md` § 13.3 (metrics recorded "after commit")
- **Type:** Idempotency gap
- **Concern:** `complete` commits with the command, but the request continues after that commit: after-commit metrics (`refund_requests_submitted_total`, `refund_time_to_decision_seconds`), response serialisation, and any later interceptor or response advice. An exception there is a 5xx, and `abandon` deletes the record even though it is now COMPLETED. The client's retry with the same key is then a first request: `submit` hits the claim index and answers 409 `ITEM_ALREADY_REFUNDED` for a request that was recorded, and `decide` or `cancel` answer 409 `REFUND_ALREADY_DECIDED`, the false errors SDD §11.1 was written to stop.
- **Options:**
  - **A.** Make `abandon` conditional (`DELETE ... WHERE status = 'IN_PROGRESS'`) - a COMPLETED record survives and replays; one predicate.
  - **B.** Never delete: mark the record ABANDONED and let `begin` take over ABANDONED rows - keeps an audit trail, adds a status and a branch in `begin`.
- **Recommendation:** Option A, and make after-commit side effects non-throwing (catch and log at WARN) so they cannot turn a committed command into a 5xx.
- **Why:** SDD §11.1 deletes on 5xx so that a command that did not happen can be retried; a committed command did happen and must replay. A is a one-predicate fix; B adds state for little benefit at about 1,200 requests a month.
- **Status:** Open

---

### OI-06: A record left IN_PROGRESS by a crash is never taken over, and the web app retries it every second

- **Where:** refund-service and web app / `09-cross-cutting.md` § 12.2 (`begin`: "existing IN_PROGRESS -> 409 REQUEST_IN_PROGRESS, Retry-After: 1"); `14-frontend.md` § 17.1 (`IdempotentCommand`)
- **Type:** Idempotency gap
- **Concern:** `begin` commits IN_PROGRESS in its own transaction before the handler runs, and a submit can hold it for about 10 seconds of POS calls (3 s timeout with two retries, 09 § 12.3). A pod killed in that window (rolling update, OOM, node loss) leaves a record nothing moves: no lease, no takeover, only the 24-hour expiry. Because `complete` commits with the command, a record still IN_PROGRESS after its handler died proves the command did not commit, so taking it over is safe, but the design has no rule for it. Meanwhile `IdempotentCommand` retries `REQUEST_IN_PROGRESS` after `Retry-After: 1` with no cap: one request per second from that browser, and a silent spinner for the customer or branch manager for as long as the page stays open.
- **Options:**
  - **A.** A `locked_until` column set to now plus the worst-case handler time (for example 30 s); `begin` takes over an IN_PROGRESS record whose `locked_until` has passed - one column; a handler slower than the lease could run twice, which the claim index and the optimistic lock still stop.
  - **B.** Keep the 24-hour rule and let the web app mint a new key after N retries - no backend change, but a new key after a command that did commit is the duplicate the key exists to prevent.
- **Recommendation:** Option A, plus a cap in `IdempotentCommand` (for example 10 retries or 30 s) after which the web app reloads the request state and shows an actionable message instead of retrying.
- **Why:** SDD §11.1 defines IN_PROGRESS as a command still running, which a dead pod falsifies, and the takeover is safe because completion commits with the command; A bounds both the lockout and the client loop. B trades a lockout for the duplicate risk.
- **Status:** Open

---

### OI-07: `POST /v1/refund-requests` is a receipt oracle outside the lookup limit

- **Where:** refund-service / `04-implementation/refund-service.md` § 7.3 (`submit` steps 1 to 3); `09-cross-cutting.md` § 12.1 (gateway: "10 receipt lookups per customer per rolling hour on `GET /v1/receipts/*`"); `11-security.md` § 14.5 (receipt enumeration row)
- **Type:** Missing edge case
- **Concern:** R-09's mitigation (SDD §4, SDD §17.1 Constraints) is a per-customer limit on receipt lookups, and the gateway requirement applies it only to `GET /v1/receipts/*`. `submit` runs the same POS lookup and answers each case differently: 404 `RECEIPT_NOT_FOUND` (no receipt), 422 `REFUND_WINDOW_PASSED` (exists, old), 400 `VALIDATION_FAILED` on `lineIds` (exists, recent, wrong line), so a signed-in customer can probe receipt numbers through the POST with made-up line ids and a fresh `Idempotency-Key` each time, limited only by the unspecified per-user default. `ReceiptNotFoundBurst` still counts the 404s, but the 10-per-hour budget is never consumed, and every probe costs a call to a provider that has no fallback (R-08).
- **Options:**
  - **A.** One per-customer budget at the gateway shared by `GET /v1/receipts/*` and `POST /v1/refund-requests` - one gateway rule; a customer who looks up and then submits uses two of ten.
  - **B.** Enforce the budget inside refund-service with a per-subject counter - gateway-independent, but a second home for rate limiting and a write per lookup.
- **Recommendation:** Option A: amend the user-route requirement in 09 § 12.1 accordingly.
- **Why:** The limit is the SDD's mitigation for R-09 and is void while a second endpoint performs the same lookup without it; CLAUDE.md puts rate limiting in the gateway, so A keeps one home. B duplicates the rule in the service.
- **Status:** Open

---

### OI-08: The approved amount is not checked against the currency's minor unit

- **Where:** refund-service, payout-service, web app / `04-implementation/refund-service.md` § 7.3 (`decide`, APPROVE branch); `06-api-contracts.md` § 9.2 (Money as a 4-place decimal string); `04-implementation/payout-service.md` § 7.4 (`CardPayPayoutAdapter.pay`); `14-frontend.md` § 17.4 (`InputNumber`)
- **Type:** Missing edge case
- **Concern:** `decide` checks the currency, `> 0`, and `<= requested`, but not the scale. `approvedAmount` travels as a 4-place decimal string, so 19.9950 EUR or 10.505 EUR passes, is stored in `numeric(19,4)`, carried in `REFUND_APPROVED`, and handed to the CardPay adapter, while card payouts settle in the currency's minor unit (API-02 is `TBD - external`). The adapter must then round, in a mode nobody has chosen, or send an amount CardPay refuses; a refusal is retried with the same key for the whole ADR-10 window (OI-11) before the managers hear of it, and a rounded payout pays an amount the manager never confirmed (REFUNDS UC-04 step 4). The web app's `InputNumber` restricts decimals only if configured per currency, and the API must not rely on it.
- **Options:**
  - **A.** Reject an `approvedAmount` whose scale exceeds the currency's default fraction digits (`java.util.Currency#getDefaultFractionDigits`) with 400 `VALIDATION_FAILED`, and configure `InputNumber` with the same digits - exact money end to end; one check.
  - **B.** Round half-even to the minor unit in `decide` before storing - lenient, but the confirmed amount and the paid amount can differ.
- **Recommendation:** Option A, plus an adapter assertion that `PayoutInstruction.amount` is exact in minor units (a violation is a defect, never a CardPay attempt).
- **Why:** 08 § 11.2 ("Money comes from the source") and SDD §6 (exact decimal money) require the paid amount to be the approved amount, and UC-04 step 4 has the manager confirm it; A keeps the two equal. B silently changes a confirmed amount.
- **Status:** Open

---

### OI-09: `runDueAttempts` computes the window end before the first attempt sets `first_attempt_at`

- **Where:** payout-service / `04-implementation/payout-service.md` § 7.3 (`runDueAttempts` steps A and C)
- **Type:** Implementation gap
- **Concern:** Step A computes `windowEnd = p.firstAttemptAt + payoutRetryWindow` before `p.startAttempt(...)` sets `firstAttemptAt` on the first attempt, and step C passes that `windowEnd` to `retrySchedule.nextAttemptAt(p.attemptCount, now, windowEnd)`. Taken literally, step A throws on every payout's first claim (null plus a duration), the claim rolls back, and no payout is ever attempted; guarded, step C receives a null cap, so the first REFUSED, UNAVAILABLE, or IN_DOUBT outcome cannot be recorded, the record transaction rolls back, and the payout falls into lease expiry and in-doubt re-attempts (OI-10) instead of a scheduled retry. Step C also works on the row re-read by `lockById`, so a value carried over from step A can be stale.
- **Options:**
  - **A.** Derive the window from the locked row wherever it is used (after `startAttempt` in step A, after `lockById` in step C) - no new state.
  - **B.** Store `window_ends_at` on the payout when the first attempt starts and read it in the claim check, `RetrySchedule`, and the window metrics - one column, one source, and in-flight payouts keep their window if `PAYOUT_RETRY_WINDOW` is changed later.
- **Recommendation:** Option B, with unit tests `runDueAttempts_firstAttemptRefused_schedulesRetryBeforeWindowEnd` and `runDueAttempts_windowClosed_writesPayoutFailed`.
- **Why:** ADR-10 anchors the window at the first attempt (SDD §5 Retry window, SDD §17.2 Tables Design), and every attempt depends on it; storing it once removes the ordering trap. A is smaller but keeps several computations that must stay in step.
- **Status:** Open

---

### OI-10: The record step completes an attempt without checking that it still owns the payout's lease

- **Where:** payout-service / `04-implementation/payout-service.md` § 7.3 (`runDueAttempts` steps A to C), § 7.6 (record step); `05-data-model.md` § 8.2 (`payout_attempt.outcome` NULL while in flight)
- **Type:** Concurrency hazard
- **Concern:** The lease in `next_attempt_at` (call timeout plus 60 s) is the only thing keeping two replicas off one payout, and step C never checks it: after `lockById` it completes "the" attempt and, unless the payout is SUCCEEDED, calls `scheduleRetry`, overwriting `next_attempt_at`. If replica A's call outlives its lease (a GC pause, a slow record transaction, or a timeout that is not enforced, see OI-32), replica B claims the payout, inserts attempt n+1, and calls CardPay; A then records REFUSED or IN_DOUBT and sets `next_attempt_at` to a backoff time that can precede B's lease end, so replica C can start a third call while B's is in flight. The unchanged key protects the money only if CardPay honours it (R-01, open). The expired attempt row also keeps `outcome = NULL` forever, so later "open attempt" checks cannot tell a live call from a dead one.
- **Options:**
  - **A.** Guard the record step: apply the outcome to the payout only if the attempt is the latest (`attempt.attemptNo == p.attemptCount`); otherwise record it on its own attempt row and leave `next_attempt_at` alone, except that a late CONFIRMED still runs `succeed` or `confirmLate` - one predicate, no schema change.
  - **B.** Store the current attempt id on the payout (`lease_owner`) and require it in the record update - explicit ownership, one column.
- **Recommendation:** Option A, plus closing a lease-expired attempt as `IN_DOUBT` with `completed_at` in the claim step that detects it, and an integration test in which the first call outlives its lease.
- **Why:** ADR-10 rests REFUNDS/NFR-01 on "an attempt whose lease expires is resolved as in doubt", which assumes the expired attempt stops steering the payout; today it can shorten the next lease. A restores that with one predicate; B adds state for a case A already covers.
- **Status:** Open

---

### OI-11: A definitive CardPay refusal is re-sent with the same idempotency key for the whole window

- **Where:** payout-service / `04-implementation/payout-service.md` § 7.3 (record step "otherwise -> scheduleRetry"; `receive` step 4c "REFUSED -> recorded only"), § 7.4 (Resilience4j: CardPay codes mapped to CONFIRMED, REFUSED, UNAVAILABLE, IN_DOUBT)
- **Type:** Missing edge case
- **Concern:** Every REFUSED outcome is rescheduled with the same key until the window closes, as SDD §17.2 and ADR-10 ask (retry, never change the key). A provider that honours idempotency keys typically returns the stored result for a repeated key, so a refusal for a closed card or an invalid original payment reference comes back unchanged on every attempt: the retries cannot succeed, add provider traffic, and delay the branch managers' failure email by a day for a payout that failed in its first minute. Other providers answer a reused key with a conflict error, which the adapter would map to IN_DOUBT (switching to status queries) or UNAVAILABLE (feeding the circuit breaker). What a same-key request returns after a refusal, and which codes are final, appears neither in the adapter mapping nor among the API-02 questions indexed in chunk 15.
- **Options:**
  - **A.** Split REFUSED into `REFUSED_RETRYABLE` and `REFUSED_FINAL` in the adapter; after a final refusal stop calling CardPay, keep the payout in RETRY_WAIT with `next_attempt_at` at the window end so ADR-10's `PAYOUT_FAILED` still comes at window close, and alert operations at once - no contract change.
  - **B.** Fail the payout at once on a final refusal - fastest signal to the managers, but changes ADR-10 and the REFUNDS UC-04 E1 timing ("after one day"), so it needs an SDD decision.
  - **C.** Keep retrying every refusal - simplest; spends the window on calls that cannot succeed.
- **Recommendation:** Option A now; add both questions to the API-02 `TBD - EXTERNAL` list (SDD §15.6) and raise B with the SDD owner once CardPay's codes are known.
- **Why:** ADR-10 fixes the key and the window, not the number of calls; against a replaying provider the retries are no-ops that cost the branch a day (UC-04 E1). A keeps the ADR-10 contract and stops useless calls; B needs a decision the LLD cannot take.
- **Status:** Open

---

### OI-12: `PAYOUT_SUCCEEDED` carries the approved amount and our own clock, not what CardPay confirmed

- **Where:** payout-service and refund-service / `04-implementation/payout-service.md` § 7.2 (`ProviderOutcome`, `PayoutResult`), § 7.4 (Outbox skeleton: `paidAmount = payout.amount`), § 7.3 (`succeed(ref, now)`; `reconcile` step 1); `08-state-and-rules.md` § 11.2 (Rule "Money comes from the source"); `10-operations.md` § 13.3 (`refund_paid_amount_mismatch_total`)
- **Type:** Implementation gap
- **Concern:** 08 § 11.2 says PAID "records the provider-confirmed amount" and `applyPayoutSucceeded` alerts when `paidAmount` differs from the approved amount, but payout-service fills `PAYOUT_SUCCEEDED.paidAmount` from `payout.amount` (the approved amount) and `succeededAt` from its own clock when it records the outcome; `ProviderOutcome` and `PayoutResult` hold no amount and no provider time. The mismatch alert can never fire, a short or rounded CardPay payment is reported as paid in full, and the refund-service TODO indexed in chunk 15 about `paid_at` and the paid amount rests on values nothing produces. The reconciliation, which selects "SUCCEEDED with `succeeded_at` inside the previous tenant-zone day", dates a late confirmation on the day it was recorded rather than the day CardPay paid: each late confirmation shows as theirs-only one day and ours-only the next, paging `PayoutReconciliationMismatch` twice, and payouts recorded just after midnight produce the same false pair.
- **Options:**
  - **A.** Add `confirmedAmount` and `providerTimestamp` to `ProviderOutcome` and `PayoutResult` (nullable until API-02 and API-03 are documented), store them on `payout`, fill `PAYOUT_SUCCEEDED` from them when present, and reconcile by idempotency key over a two-day window instead of by our recording date - delivers 08 § 11.2 as soon as CardPay supplies the fields.
  - **B.** Declare `paidAmount` the approved amount and `succeededAt` our recording time, remove the mismatch alert, and reconcile by key only - honest and simple, but drops the only detector of a short payment.
- **Recommendation:** Option A.
- **Why:** REFUNDS/NFR-01 is verified by the two daily checks (SDD §18); an alert that cannot fire and a comparison that pages on every late confirmation both weaken it. A fulfils what 08 § 11.2 promises; B is cheaper but abandons the promise.
- **Status:** Open

---

### OI-13: Manual corrections (RB-06 "reviewed script", RB-04) bypass the domain transition and the outbox

- **Where:** payout-service / `10-operations.md` § 13.8 (RB-04 step 3, RB-06 step 2); `04-implementation/payout-service.md` § 7.3 (TODO under `runDueAttempts`: "the daily reconciliation corrects it") and § 7.8 (reconciliation: "no state change")
- **Type:** Pattern misapplication
- **Concern:** RB-06 has the operator "link it by a reviewed script and apply it" when an unmatched result does not re-match, and RB-04 waits for an API-03 result for a payout CardPay did pay. A SQL script that sets `payout.status` or `payout_result.payout_id` changes state without writing `PAYOUT_SUCCEEDED` to `outbox_event`, so refund-service never marks the request PAID, the customer is never told, and the points are never taken back: a dual write done by hand, which CLAUDE.md and SDD §14.6 item 1 forbid. The payout-service TODO says the daily reconciliation "corrects" a payout failed in doubt, while `reconcile` only alerts, so for a payout CardPay paid but this service marked FAILED the script is the only correction path left.
- **Options:**
  - **A.** An operator command in payout-service (a tenant-scoped, audited Kubernetes Job, so 11 § 14.4 "no admin endpoints" still holds) `applyResult(payoutId, resultId)` that runs the same `succeed`/`confirmLate` code as API-03 and writes the outbox row; RB-04 and RB-06 call it instead of SQL - one entry point, tested code.
  - **B.** Keep scripts but require each to insert the `outbox_event` row with the SDD §14.9.6 payload - no new code, but hand-written event JSON in a money path.
- **Recommendation:** Option A, and correct the TODO text: the reconciliation alerts only (SDD §17.2), and corrections go through the operator command.
- **Why:** The outbox rule applies to every state change that must produce an event, and the operator path runs under incident pressure, when a hand-built payload is most likely to be wrong; A reuses the transition API-03 already exercises. B keeps the dual-write risk in the runbook.
- **Status:** Open

---

### OI-14: `findBranchManagers` must filter on the tenant in the Keycloak query, not after it

- **Where:** notification-service / `04-implementation/notification-service.md` § 7.2 (`ContactDirectory.findBranchManagers(tenantId, branchId)`), § 7.3 (`dispatchOne` step C); SDD §17.3 (Contact resolution), SDD §15 API-05
- **Type:** Multi-tenancy leak
- **Concern:** Branch ids are POS branch codes (`varchar(20)`) issued by each retailer's own POS, nothing makes them unique across tenants, and all tenants share one realm (ADR-07). A Keycloak query for "users holding `BRANCH_MANAGER` with `branch_id = B01`" returns every tenant's managers of a branch coded B01; step C then finds a contact whose `tenantId` differs and fails the whole row with a security alert. With a second retailer, every `REFUND_PAYOUT_FAILED` email for a shared branch code fails, the managers who must act on a failed payout (REFUNDS UC-04 E1) are not told, and the security alert becomes routine noise. The tenant check and its test ("contact of another tenant", 13 § 16.3) are designed for the single-customer lookup, not for this list query.
- **Options:**
  - **A.** Query on the role plus both attributes (`tenant_id` and `branch_id`), and keep the per-contact check as a defence that drops and alerts only on a mismatched contact - one adapter query; the SDD §11.2 check stays.
  - **B.** Query by branch and silently drop foreign contacts - the right managers are emailed, but a genuine attribute defect goes unseen.
- **Recommendation:** Option A, with an integration test: two tenants share a branch code, only the event tenant's managers are emailed, and no security alert fires.
- **Why:** CLAUDE.md single-realm multi-tenancy and SDD §11.2 make the tenant a query predicate everywhere; filtering afterwards turns a normal collision into a failed message and a false security event. B hides the attribute defects the alert exists for.
- **Status:** Open

---

### OI-15: The dispatch lease has no defined length and nothing ties it to the call timeouts

- **Where:** notification-service / `04-implementation/notification-service.md` § 7.3 (`dispatchOne` step A: `row.nextAttemptAt = now + lease`; step F), § 7.6 (record step); `10-operations.md` § 13.1 (no lease key); `09-cross-cutting.md` § 12.3 (`keycloakAdmin` 3 s with two retries; `msgHubEmail`, `msgHubSms` 5 s)
- **Type:** Concurrency hazard
- **Concern:** payout-service defines its lease (`PAYOUT_LEASE_GRACE`, call timeout plus 60 s); notification-service only says "lease", with no key, value, or rule. One row's work is up to three Keycloak calls (about 10 s with backoff), one MsgHub call (5 s), and rendering; with a shorter lease a second replica claims the row while the first is still sending, and the only remaining guard is the MsgHub idempotency key, which is sent "only if MsgHub supports a key" (`TBD - external`). The record step also completes the row unconditionally, so a late first sender can overwrite the second claim's outcome. SDD §17.3 Constraints require that each recipient "receives each message once".
- **Options:**
  - **A.** A `NOTIFICATION_LEASE` key (for example `PT60S`) with a startup check that it exceeds the Keycloak worst case plus the MsgHub timeout plus a margin, and a record step that completes only if the row is still PENDING with the `attempt_count` it claimed - one key, one predicate.
  - **B.** Hold the row lock for the whole dispatch - no lease, but a database connection is held across two provider calls, which 7.6 rules out ("no transaction, no connection held").
- **Recommendation:** Option A.
- **Why:** Until MsgHub idempotency is confirmed (SDD §15 API-04), the lease is the only duplicate-send guard, and an undefined lease makes "each message once" an implementer's guess. B contradicts the no-connection-during-provider-call rule.
- **Status:** Open

---

### OI-16: Provider outages burn message attempts, so messages fail for good after about half an hour

- **Where:** notification-service / `04-implementation/notification-service.md` § 7.3 (step F: "retryable and attemptCount + 1 < maxAttempts"), § 7.4 (open circuit or full bulkhead returns `retryable = true`, "UNAVAILABLE"), § 7.7 ("Credential rejected ... rows wait for the fix"); `10-operations.md` § 13.1 (6 attempts, 1-minute base, 30-minute cap)
- **Type:** Error path
- **Concern:** SDD §17.3 says a Keycloak or MsgHub credential rejection "opens the circuit and alerts; messages wait for the fix and then resume", and 7.7 repeats it, but the pseudocode counts an open-circuit UNAVAILABLE result, where no call was made, as a used attempt. With six attempts and waits of about 1, 2, 4, 8, and 16 minutes, every message planned during a MsgHub or Keycloak outage longer than roughly half an hour ends FAILED for good; nothing re-queues FAILED rows, so after an outage in the seasonal peak thousands of customers are never told of a submission, approval, or payment. `NotificationFailed` warns, but no runbook step or tool resends.
- **Options:**
  - **A.** Do not count "no call made" outcomes (open circuit, full bulkhead) against `maxAttempts`: reschedule at the backoff cap without incrementing `attempt_count`, and fail rows only past a maximum message age (for example 72 h) as stale - implements SDD §17.3; backlogs drain on recovery.
  - **B.** Keep the counting and add an operator re-queue for rows FAILED by provider errors - simple code, but every outage needs a manual action and a judgement about stale messages.
- **Recommendation:** Option A, with supersession still applied at send time and the age limit as configuration.
- **Why:** SDD §17.3 promises that messages wait for a credential fix, and REFUNDS 04 that customers are told at each step; counting circuit-open ticks turns an outage into permanent message loss. B makes recovery manual.
- **Status:** Open

---

### OI-17: Autoscaling on consumer lag watches the planning queue, not the send backlog

- **Where:** notification-service / `03-architecture.md` § 6.2 (HPA "also on consumer lag"); `12-performance.md` § 15.5 (seasonal mitigation); `04-implementation/notification-service.md` § 7.3 (plan in the listener, send in the scheduler)
- **Type:** Pattern misapplication
- **Concern:** SDD §17.3 asks for autoscaling "on consumer lag as well as CPU" for seasonal peaks, but in this design the listener only inserts PENDING rows in one short transaction, and the slow work (Keycloak lookup, MsgHub send) runs in `NotificationDispatchScheduler`. Consumer lag stays near zero while `notifications_pending` grows, so the HPA does not scale for the backlog it exists for. When replicas are added for any reason, the per-replica bulkheads (10 per channel, 09 § 12.3) multiply the concurrent MsgHub calls by the replica count, so the provider-facing cap is not a cap.
- **Options:**
  - **A.** Scale on the dispatch backlog (`notifications_pending`, or the age of the oldest due row) and size the per-replica bulkhead so replicas times bulkhead stays under MsgHub's limit - scales the slow part; needs the same external-metrics source as the lag metric (TODO indexed in chunk 15).
  - **B.** Keep lag and CPU - matches the SDD wording, misses its intent.
- **Recommendation:** Option A, and log the deviation from the SDD §17.3 wording in chunk 15 for an SDD update.
- **Why:** SDD §17.3 only requires the send to run after the plan commits; the scheduler-driven send is an LLD choice, so the scaling signal must follow it to meet REFUNDS/NFR-03. Lag measures a queue this design keeps empty; B satisfies the words only.
- **Status:** Open

---

### OI-18: Take-back paths are not serialised per purchase: concurrent take-backs exceed the cap, and an earn racing a take-back strands it

- **Where:** loyalty-service / `04-implementation/loyalty-service.md` § 7.3 (`onRefundPaid` steps 3 to 5, `ingest` step 4, `applyWaiting`), § 7.6 (`READ_COMMITTED`); `07-event-contracts.md` § 10.1 (key = refund id); `12-performance.md` § 15.4 (listener concurrency = partitions); `08-state-and-rules.md` § 11.2 (Rule "Points taken back never exceed the points earned")
- **Type:** Concurrency hazard
- **Concern:** Both take-back paths decide from rows they only read. (1) `REFUND_PAID` is keyed by refund id, so two refunds of one receipt land on different partitions and run concurrently; both read the same `sumTakenBack`, so `EurPointsPolicy` caps each against a stale "remaining". The cap matters exactly when the paid amounts exceed the earned basis (the third row of the 08 § 11.2 matrix, or a POS purchase amount lower than the receipt lines), which is when the race takes back more than was earned. (2) `onRefundPaid` finds no EARNED row and inserts PARKED while `earnOne` for the same purchase inserts EARNED and finds no waiting take-back; both commit, the PARKED row closes at its deadline, and no later earn can apply it (redelivered purchases are `ON CONFLICT DO NOTHING` no-ops). That take-back is lost silently: the balance still equals the sum of movements, so the daily reconciliation passes, and a CLOSED row never counts as a stale PARKED one. Both cases break LOYALTY/NFR-01 ("exactly one take-back"), and the delayed-feed catch-up of SDD §18.3 is when (2) is most likely.
- **Options:**
  - **A.** A transaction-scoped advisory lock (`pg_advisory_xact_lock`) on a hash of (tenant, branch, purchase reference), taken right after the inbox guard in `onRefundPaid` and before the EARNED insert in `earnOne` - serialises the few writers of one purchase; negligible contention at this volume.
  - **B.** Lock the EARNED row (`SELECT ... FOR UPDATE`) - fixes (1) only; in (2) there is no row to lock yet.
  - **C.** Let the parking job re-match PARKED and CLOSED rows against existing EARNED rows - repairs (2) up to 15 minutes late; does nothing for (1).
- **Recommendation:** Option A, plus C as a safety net in `closeExpiredParked`; integration tests: two concurrent `REFUND_PAID` on one receipt stay within the cap, and a `REFUND_PAID` racing its purchase ends APPLIED.
- **Why:** 08 § 11.2 makes loyalty-service the enforcement point of the cap, and SDD §14.2 keys the topic by refund, so nothing orders two refunds of one receipt; only an explicit per-purchase lock lets both paths see each other. B and C each close one case.
- **Status:** Open

---

### OI-19: A purchase that earns 0 points violates the EARNED CHECK, and POS redelivers it forever

- **Where:** loyalty-service / `04-implementation/loyalty-service.md` § 7.3 (`ingest` step 4b, `EurPointsPolicy`), § 7.6 (`earnOne` rollback: "reported failed and POS redelivers"); `05-data-model.md` § 8.2 (`points_movement` CHECK: EARNED requires `points > 0`)
- **Type:** Missing edge case
- **Concern:** Earn is the floor of the EUR amount, and a TODO indexed in chunk 15 proposes 0 points for non-EUR purchases, so every purchase under 1 EUR and every non-EUR purchase yields `points = 0`. `earnOne` inserts an EARNED movement with 0, the CHECK rejects it, the transaction rolls back, the purchase is reported failed, and POS redelivers it on every delivery with the same result. The purchase never exists in the ledger, so a later refund of it parks and closes, and the failure count in `IngestionResult` is permanently inflated, which hides real failures.
- **Options:**
  - **A.** Record 0-point purchases: CHECK `points >= 0` for EARNED, skip `applyDelta` for 0, and filter 0-point rows out of the member's history - idempotent and matchable; a change to the SDD §17.4 Tables Design rule.
  - **B.** Accept 0-point purchases as no-ops without a row (counted as ignored) - no schema change, but a refund of that purchase parks, closes, and stays CLOSED forever.
- **Recommendation:** Option A, flagged against SDD §17.4 Tables Design.
- **Why:** SDD API-06 ("a redelivered purchase is a no-op") and CLAUDE.md consumer idempotency assume every valid purchase can be recorded once; a CHECK that rejects a valid purchase turns it into an endless redelivery. B avoids the schema change but leaves unmatchable take-backs.
- **Status:** Open

---

### OI-20: API-06 answers 200 when some purchases failed, so they are lost unless POS parses the counts

- **Where:** loyalty-service / `04-implementation/loyalty-service.md` § 7.3 (`ingest` step 5: "200 with IngestionResult(accepted, duplicates)"), § 7.2 (`IngestionResult`: accepted, duplicates, failed), § 7.8 (Earn workflow, error handling)
- **Type:** Error path
- **Concern:** Each purchase runs in its own transaction and a failed one "is reported in the response so POS can redeliver it", yet the answer is 200 with counts only (step 5 even omits `failed`), and no failed purchase is identified. Partners usually redeliver on a non-2xx status, and the POS redelivery rules are `TBD - external`; with a 200, a transient database error on one purchase of a batch loses that purchase's points, which LOYALTY/NFR-01 ("the balance is always right") cannot absorb. API-03 avoids the problem by storing every result before acknowledging it (SDD §15 API-03); API-06 has no such store.
- **Options:**
  - **A.** Store the raw batch per tenant with a dedup key before answering 200, and ingest from the store asynchronously with retries and a parked state for poison purchases - the API-03 rule applied to API-06; one table and a worker.
  - **B.** Answer 503 when any purchase failed and rely on idempotent redelivery of the whole batch - no table, but one poison purchase blocks its batch forever.
  - **C.** Answer 207 with per-purchase outcomes - precise, but only helps if POS handles per-item results (`TBD - external`).
- **Recommendation:** Option A.
- **Why:** SDD API-03 already sets "stored before acknowledged" for partner input that changes money or points; applying it to API-06 makes the outcome independent of POS's unknown redelivery policy. B lets one bad row stall a feed; C depends on the partner.
- **Status:** Open

---

### OI-21: API-06 creates members on first sight, so the ADR-11 refusal of another tenant's member cannot happen

- **Where:** loyalty-service / `04-implementation/loyalty-service.md` § 7.3 (`ingest` steps 1 and 4a); SDD §10 (ADR-11)
- **Type:** Multi-tenancy leak
- **Concern:** ADR-11 requires the receiving service to refuse, "as a security event, any body that names a payout or member of another tenant". `ingest` resolves the tenant from the partner key and then creates any unknown member number in that tenant (`findByMemberNumber(...) or insert Member`), so a misrouted batch (a POS integration configured with another tenant's partner key, or one feed serving two retailers) silently creates members and awards points in the wrong tenant, and nothing alerts. Chunk 15 indexes the payout-side reading of the same ADR-11 rule (a foreign result surfaces as UNMATCHED with an alert); the loyalty side has neither a refusal nor an alert.
- **Options:**
  - **A.** Validate each purchase's branch against the tenant's branch list in the tenant registry and refuse, as a security event, purchases for unknown branches - detects misrouting inside the tenant's own data; needs branch lists in tenant configuration (LA-01).
  - **B.** Require members to exist (created by the A-5 member link) and park purchases for unknown members with an alert - strict, but A-5 is open and unlinked members would earn nothing.
  - **C.** Keep auto-create and alert on a spike of new members per feed - detection only.
- **Recommendation:** Option A, recorded in chunk 15 next to the payout-side reading so the architect confirms both readings of ADR-11 together.
- **Why:** ADR-11 exists because a partner call chooses its tenant by key alone; with auto-create there is no signal at all when the key is wrong, and points are data members must trust (LOYALTY/NFR-01). A needs no cross-tenant lookup, which SDD §11.2 forbids.
- **Status:** Open

---

### OI-22: The web app's key rule does not say when a corrected resubmission needs a new `Idempotency-Key`

- **Where:** web app / `14-frontend.md` § 17.1 (`IdempotentCommand`), § 17.2 (`RefundFormStore` holds the "submit command and its key", `DecisionStore`); `09-cross-cutting.md` § 12.2 (4xx stored as COMPLETED; same key with a different hash -> 409 `CONFLICT`)
- **Type:** Idempotency gap
- **Concern:** `IdempotentCommand` keeps one key per user action and reuses it on every retry. The backend stores a 4xx as COMPLETED and replays it for the same key and body (OQ-01), and answers 409 `CONFLICT` for the same key with a different body. A branch manager who receives 422 `INVALID_PARTIAL_AMOUNT`, corrects the amount, and presses Approve again is still performing "the approve action on this request", so the corrected request goes out with the old key and gets 409 `CONFLICT` ("use a new key"), a message the user cannot act on. The same happens after 422 `REASON_REQUIRED`, and after 409 `ITEM_ALREADY_REFUNDED` when the customer deselects the claimed line and submits again.
- **Options:**
  - **A.** Bind the key to the body: the helper mints a new key when the body differs from the one the key was first sent with, or after any 4xx, and reuses it only for identical retries (network error, 5xx, `REQUEST_IN_PROGRESS`) - one rule, testable in Jest.
  - **B.** A new key per button press - simplest, but a double click sends two keys, the case the header exists for.
- **Recommendation:** Option A, with Jest tests "422, then a corrected body, gets a new key" and "timeout, then retry, keeps the key".
- **Why:** SDD §11.1 scopes a key to one request body (a different hash is a conflict), and REFUNDS 11 requires errors that say what to do next; reusing a key across corrections produces a CONFLICT that says neither. B reintroduces double submission (SDD §17.1).
- **Status:** Open

---

### OI-23: A late payout confirmation after `REFUND_PAYOUT_FAILED` gives the branch managers no signal

- **Where:** global (SAGA-01) / `09-cross-cutting.md` § 12.5 (no compensation; RB-04); `08-state-and-rules.md` § 11.2 (matrix row "Confirmation arrives after FAILED"); `04-implementation/notification-service.md` § 7.2 (`EventPlanRegistry`, the SDD §17.3 table); `10-operations.md` § 13.8 (RB-04 step 4)
- **Type:** Missing edge case
- **Concern:** When the ADR-10 window closes, `REFUND_PAYOUT_FAILED` emails the branch's managers and flags the request, and the manual path is still open (RB-04 step 4, SDD §20.1.7). If CardPay later confirms (an in-doubt attempt, a late API-03 result), the machines move the payout to SUCCEEDED and the request to PAID, and `REFUND_PAID` tells the customer only. The managers who were told "failed" never hear "paid after all", and the request quietly leaves the failed section of their queue. A manager who has meanwhile settled the refund some other way, which is all the design leaves them, has now caused a double payment, and because no manual settlement is recorded anywhere, the platform cannot even detect it.
- **Options:**
  - **A.** notification-service emails the branch's managers on `REFUND_PAID` when its send log holds a `REFUND_PAYOUT_FAILED` row for the same refund, and refund-service counts and pages on `refund_paid_after_failure_total` - no event-contract change (the plan reads its own send log); an addition to the SDD §17.3 plan table.
  - **B.** An additive `paidAfterFailure` field on `REFUND_PAID` that drives the manager email - explicit in the contract, but an SDD §14.9.5 change and a schema version.
  - **C.** Leave it to RB-04 - no build cost; relies on an operator acting before a manager does.
- **Recommendation:** Option A, and add to RB-04 that a manual settlement must be recorded before any money moves outside CardPay; raise a "settled manually" state with the SDD owner under SDD §20.1.7.
- **Why:** REFUNDS/NFR-01 forbids paying twice, and the design's only failure resolution is manual; the late-confirmation path (SDD §17.2: money that did leave is never reported as lost) protects the ledger but not the people who acted on the failure email. A reaches them with no contract change; B is cleaner but costs an SDD and registry change.
- **Status:** Open

---

### OI-24: Claim-bearing user attributes are not locked down, and self-registration has no rule for stamping `tenant_id`

- **Where:** global (Keycloak realm) / `11-security.md` § 14.4 (Realm seed row); `09-cross-cutting.md` § 12.1 (tenant from the `tenant_id` claim; `CallerContextResolver`); `04-implementation/loyalty-service.md` § 7.2 (member "from the `member_id` claim, never from the path"); `04-implementation/refund-service.md` § 7.2 (`branchId` must equal the `branch_id` claim)
- **Type:** Multi-tenancy leak
- **Concern:** Every scope decision that is not a role comes from three user attributes mapped to claims: `tenant_id` (the tenant of every query), `branch_id` (the branch gate), and `member_id` (whose points are shown). The realm seed maps them to token claims but says nothing about who may write them. Depending on the Keycloak version and its user-profile configuration, users can set attributes themselves (account console, account REST API, extra registration form fields); if `member_id` is user-editable, any customer can read another member's balance and history by entering that member number, and a user-editable `tenant_id` moves the account into another tenant. CUSTOMER accounts are self-registered (SDD §16.6), yet nothing states how a self-registered account receives its `tenant_id` (the SDD's reviewer notes leave it open): without one the gateway rejects every new customer's token, and with a user-supplied one it is the leak above.
- **Options:**
  - **A.** Declare the three attributes in the realm's user profile as viewable and editable by administrators only and never settable at registration; stamp `tenant_id` server-side during registration from the tenant's hostname or client (LA-05); add a realm-import test that a user cannot change them - closes both gaps in configuration; stamping needs one registration-flow step or one client per tenant.
  - **B.** Keep the attributes as they are and cross-check claims against application data (for example `member.customer_id`) - defence in depth, but a second identity home (ADR-09 rejects one) and `tenant_id` stays unprotected.
- **Recommendation:** Option A, and record the registration stamping as an SDD follow-up under SDD §16.6.
- **Why:** SDD §16.2 and ADR-08 make these claims the only source of scope, so their integrity is the whole ABAC model behind REFUNDS/NFR-04 and LOYALTY UC-01 BR-1, and CLAUDE.md single-realm multi-tenancy depends on the tenant attribute being admin-controlled. B adds a second home and still trusts `tenant_id`.
- **Status:** Open

---

### OI-25: The core's two module datasources need per-module instances of every shared platform component

- **Where:** global (refunds-platform-core) / `03-architecture.md` § 6.2 (one datasource, pool, and role per module), § 6.4 (`<base>.platform`); `09-cross-cutting.md` § 12.2 (`InboxGuard`), § 12.4 (`OutboxWriter`, `MANDATORY`); `04-implementation/refund-service.md` § 7.6; `04-implementation/loyalty-service.md` § 7.6
- **Type:** Transaction boundary
- **Concern:** Two datasources mean two `EntityManagerFactory` instances and two transaction managers in one Spring context, and an unqualified `@Transactional`, `TransactionTemplate`, or Spring Data repository binds to whichever is primary. The shared library ships one `InboxGuard`, one `OutboxWriter`, one `IdempotencyService`, and one set of platform repositories in one package, while their tables exist in both schemas (`refund.inbox_event`, `loyalty.inbox_event`). If the loyalty listener's inbox insert runs on the refund transaction manager, the inbox row and the take-back movement commit in different transactions, which removes the "inbox guard first, same transaction" guarantee of 09 § 12.2, or the insert fails on `refund_app`'s grants; `MANDATORY` checks only the transaction manager its annotation names, so a mis-bound component silently joins or rejects the wrong transaction. The Confirm indexed in chunk 15 covers the wiring cost of two datasources, not this binding.
- **Options:**
  - **A.** Make the platform components plain classes built per module by a module configuration (datasource, transaction manager, schema), implemented with `JdbcTemplate` rather than JPA repositories, with qualified `TransactionTemplate`s and listener container factories bound to the module's transaction manager - explicit binding; no entity-scanning conflicts.
  - **B.** Keep JPA repositories and register them per module with `@EnableJpaRepositories` - familiar, but one package cannot be registered under two factories without per-module copies.
- **Recommendation:** Option A, plus an architecture test forbidding unqualified `@Transactional` in `<base>.refund` and `<base>.loyalty`, and an integration test that rolls back a take-back and asserts its inbox row rolled back too.
- **Why:** The inbox guard inside the domain transaction is the exactly-once mechanism (SDD §14.6 item 2), and ADR-01 puts two modules with two datasources in one process; the binding must be explicit or the guarantee fails in one module only. B fights package-based repository registration.
- **Status:** Open

---

### OI-26: Steps that catch a unique violation and carry on cannot run in PostgreSQL as written

- **Where:** global / `04-implementation/payout-service.md` § 7.3 (`receive` step 4a: "duplicate dedupKey -> commit and return"); `04-implementation/notification-service.md` § 7.3 (`plan` step 3: "unique violation ... -> skip that channel"); `04-implementation/loyalty-service.md` § 7.3 (`ingest` step 4a: find or insert `Member`)
- **Type:** Transaction boundary
- **Concern:** In PostgreSQL a failed statement aborts the transaction (every later statement fails until rollback), and a failed JPA flush marks the transaction rollback-only, so its commit throws. Three steps assume they can catch a unique violation and continue: a duplicate API-03 result would end in 500 instead of the promised no-op, and CardPay would keep redelivering the duplicate; a replanned channel would fail the whole listener transaction, retry three times, and dead-letter the event together with its other channel; and two first purchases of one new member in parallel would fail one purchase. Only `insertEarned` and the inbox guard use `INSERT ... ON CONFLICT DO NOTHING`.
- **Options:**
  - **A.** `INSERT ... ON CONFLICT DO NOTHING` (followed by a re-select where the row is needed) for every insert whose duplicate is an expected outcome - one statement each; no aborted transaction.
  - **B.** A savepoint around each such insert, catching the violation - keeps JPA inserts, but savepoints are easy to forget and add round trips.
- **Recommendation:** Option A for `payout_result`, `notification`, and `member`, following `insertEarned` in `04-implementation/loyalty-service.md` § 7.4, with an integration test per path that sends the duplicate.
- **Why:** CLAUDE.md "assume at-least-once delivery everywhere" makes duplicates normal input, so a duplicate must never cost a 500, a DLQ entry, or a failed purchase; A is the pattern the LLD already uses. B works but is fragile.
- **Status:** Open

---

### OI-27: With application-assigned UUIDv7 ids, Spring Data `save()` treats new entities as existing

- **Where:** global / `02-context.md` § 5.5 (UUIDv7 generated in the application); `04-implementation/refund-service.md` § 7.3 (`repo.saveAndFlush(request with items)`); the Spring Data repositories in § 7.2 of every `04-implementation/*.md`
- **Type:** Implementation gap
- **Concern:** Spring Data JPA chooses `persist` or `merge` by the version attribute (new when a non-primitive version is null) or, without one, by a null id, and "a primitive version property cannot be used to determine whether an entity is new or not" (Spring Data JPA reference, Entity State-detection Strategies). Every id here is assigned before saving, and most tables have no version (`refund_request_item`, `refund_status_history`, `points_movement`, `payout_attempt`, `payout_result`, `notification`, `pending_take_back`), so `save` calls `merge`: an extra SELECT per insert, and the managed copy is returned while the caller keeps the original, so reads and changes made on the original after the save (such as the version read for the outbox, OI-01) do not reflect what was stored. The LLD fixes neither the version type nor an `isNew` strategy.
- **Options:**
  - **A.** A shared `Persistable` base class (transient `isNew` flag flipped in `@PostPersist` and `@PostLoad`), the pattern the Spring Data reference gives for assigned identifiers - one base class.
  - **B.** A wrapper-type (`Integer`) `@Version` on aggregates and `EntityManager.persist` for append-only tables - no base class, two rules to remember.
- **Recommendation:** Option A in the shared platform library, with a repository test asserting that saving a new entity issues no SELECT.
- **Why:** CLAUDE.md and SDD §11.1 mandate application-generated UUIDv7 keys, exactly the case Spring Data's default detection handles poorly; the extra SELECTs are cheap here, but the merged-copy trap sits in the aggregate paths that write the outbox. B relies on per-entity discipline.
- **Status:** Open

---

### OI-28: The outbox relay checks its advisory lock once and never again

- **Where:** global / `09-cross-cutting.md` § 12.4 (`OutboxRelay.run`: "if not lockHeld: lockHeld = select pg_try_advisory_lock(...)"); `10-operations.md` § 13.8 (RB-01 step 2, RB-08)
- **Type:** Concurrency hazard
- **Concern:** `lockHeld` is set once and never checked again. A session-level advisory lock ends with its session, so after a network blip, a database failover (RB-08), or a pool evicting the "dedicated" connection, another replica acquires the lock while the first still believes it holds it. If the first replica's queries continue on a new connection, two relays publish the same rows concurrently: duplicates, which the inbox absorbs, and the silent loss of the single-publisher property that SDD §11.3 and §14.6 item 3 rely on; if they do not, that relay spins on a dead connection. RB-01 step 2 (grep for "OutboxRelay lock acquired") then points at the wrong pod.
- **Options:**
  - **A.** A transaction-scoped lock per poll (`pg_try_advisory_xact_lock` in the transaction that selects, sends, and deletes the batch) - ownership is re-proved on every poll; the connection is held while at most 100 rows are sent.
  - **B.** Keep the session lock on a truly dedicated, non-pooled connection, reset `lockHeld` on any SQL error, and check ownership in `pg_locks` before each batch - keeps the design, adds a check per poll.
- **Recommendation:** Option A, with a gauge `outbox_relay_active` per pod (1 while the pod holds the lock) replacing the log grep in RB-01.
- **Why:** SDD §11.3 makes "one replica publishes at a time" the ordering mechanism; a lock that can be lost silently turns that into "usually one". A costs nothing at this volume; B depends on connection handling staying exactly as designed.
- **Status:** Open

---

### OI-29: Daily and periodic jobs run on every replica

- **Where:** global / `03-architecture.md` § 6.1 ("consumers and schedulers run on every replica"); `04-implementation/refund-service.md` § 7.3 (`PayoutWatchdogJob`); `04-implementation/payout-service.md` § 7.2 (`PayoutReconciliationJob`); `04-implementation/loyalty-service.md` § 7.2 (`TakeBackParkingJob`, `BalanceReconciliationJob`); `10-operations.md` § 13.1 (cron keys), § 13.3 (job-set gauges)
- **Type:** Concurrency hazard
- **Concern:** Only the payout attempt scheduler and the notification dispatcher are built for concurrency (SKIP LOCKED); the cron jobs have no single-runner mechanism, so with 2 to 6 core replicas and 2 to 3 payout replicas each runs N times. `reconcile` calls CardPay's payout listing N times and adds each mismatch N times to `payout_reconciliation_mismatches_total` (N pages); `points_balance_drift_total` counts every drift N times; the watchdog writes duplicate WARN lines. Gauges set by a job or "on each payout outcome" (`refund_payout_outcome_overdue`, `refund_payout_failed_open`) exist only in the pod that ran the code, so replicas export different, possibly stale values, and a pod restarted after the run exports none until the next day. The cron expressions carry no zone, so they run in the JVM default zone.
- **Options:**
  - **A.** A transaction-scoped advisory lock per job and tenant (first runner wins, the others skip), and gauges derived from the database at scrape time in every pod - no new dependency; reuses the relay's lock mechanism.
  - **B.** A scheduler-lock library (for example ShedLock) - proven, but a new dependency needing approval per CLAUDE.md.
- **Recommendation:** Option A, with `zone = "UTC"` on every cron and a last-success metric per job (OI-39).
- **Why:** The two REFUNDS/NFR-01 checks are among these jobs (SDD §18), and duplicated counters and pages make their alerts untrustworthy; CLAUDE.md sets UTC for all datetime handling. A needs no approval; B is standard but does.
- **Status:** Open

---

### OI-30: Loops over the tenant registry strand the work of a tenant missing from a deployable's registry

- **Where:** global / `09-cross-cutting.md` § 12.2 (the listener sets the tenant from the envelope, no registry check), § 12.4 (relay loops over `activeTenants()`), § 12.9 (registry per deployable); `04-implementation/payout-service.md` § 7.4 (`PayoutAttemptScheduler.tick`); `05-data-model.md` § 8.4 (jobs "loop over the tenant registry"); `10-operations.md` § 13.1 (`TENANT_REGISTRY_PATH` in every deployable)
- **Type:** Multi-tenancy leak
- **Concern:** Each deployable mounts its own registry (LA-01), consumers accept any `tenant_id` in an envelope, and every background loop visits only `activeTenants()`. If payout-service's registry lacks a tenant that refund-service has (drift between three independently released charts, a tenant being onboarded, or one deactivated with work in flight), `REFUND_APPROVED` still creates the payout, but no scheduler ever attempts it or closes its window: no CardPay call, no `PAYOUT_FAILED`, no manager email, and refund-service's watchdog skips that tenant too if its own registry also lacks it. The same holds for outbox rows (never published), notification rows (never sent), and purges. Nothing measures work that belongs to tenants outside the registry.
- **Options:**
  - **A.** Treat an event for a tenant missing from the registry as non-retryable (DLQ with the page), and run a daily check counting rows per `tenant_id` not in the registry (`orphan_tenant_rows`, alert above zero) - fails loudly at the edge; one query per table.
  - **B.** Drive background loops from the tenants present in the work tables instead of the registry - never strands work, but runs jobs for tenants whose zone and credentials are missing.
- **Recommendation:** Option A, and define deactivation as "drain first": a deactivated tenant stays in the background loops until its payouts, outbox rows, and notifications are empty.
- **Why:** CLAUDE.md makes multi-tenancy non-negotiable and REFUNDS/NFR-01 forbids missing payouts; a registry mismatch is a realistic configuration error that today loses money flows without a trace. B hides the error and runs jobs without settings.
- **Status:** Open

---

### OI-31: One circuit breaker and bulkhead per provider is shared by all tenants

- **Where:** global / `09-cross-cutting.md` § 12.3 ("One named instance per provider and channel"); `04-implementation/notification-service.md` § 7.7 ("Credential rejected ... Circuit opens"); `04-implementation/payout-service.md` § 7.4; `04-implementation/refund-service.md` § 7.4
- **Type:** Multi-tenancy leak
- **Concern:** Credentials for POS Records, CardPay, and MsgHub are per tenant (SDD §15 API-01, API-02, API-04; 09 § 12.1), but each provider has one Resilience4j instance. One tenant's expired CardPay credential or suspended MsgHub account produces failures that open the shared circuit: every tenant's payouts go to RETRY_WAIT with UNAVAILABLE, every tenant's messages stop, and every tenant's receipt lookups answer 503, counted as disrupted minutes for all (REFUNDS/NFR-02). 7.7 names credential rejection as a circuit-opening event, and one tenant's traffic can also fill the shared bulkhead.
- **Options:**
  - **A.** Instances keyed by provider and tenant (for example `cardPay-<tenant_ref>`, created on demand from one shared configuration) for the three per-tenant providers; `keycloakAdmin` stays single because it uses one platform credential - isolates a tenant's failure; a provider-wide outage opens each tenant's circuit separately.
  - **B.** Keep shared instances and exclude 401 and 403 from the failure rate, alerting on them per tenant - fewer instances, but any other tenant-specific failure still trips everyone.
- **Recommendation:** Option A, with the circuit alert in 10 § 13.7 grouped by provider so a platform-wide outage is still one page.
- **Why:** CLAUDE.md single-realm multi-tenancy and RB-09 ("provider credentials per tenant can be revoked alone") assume a tenant incident stays inside the tenant; a shared circuit turns one revoked credential into a platform outage. B narrows the blast radius for authentication errors only.
- **Status:** Open

---

### OI-32: `@TimeLimiter` on synchronous adapters cannot enforce the timeouts the leases depend on

- **Where:** global / `04-implementation/payout-service.md` § 7.4 (`@TimeLimiter(name = "cardPay")` on `ProviderOutcome pay(...)`); `04-implementation/notification-service.md` § 7.4 (`msgHubSms`, `keycloakAdmin`); `04-implementation/refund-service.md` § 7.4 (`posRecords`: no time limiter, one `fallback`); `09-cross-cutting.md` § 12.3 (timeouts)
- **Type:** Pattern misapplication
- **Concern:** Resilience4j's TimeLimiter bounds asynchronous executions (`Future` and `CompletionStage` suppliers, and reactive types through the annotation aspects), while these adapters return `ProviderOutcome`, `SendResult`, `Optional<Contact>`, and `Optional<Receipt>` synchronously, so the annotation cannot enforce their timeouts, and `posRecords` has no time limiter at all. The 3 s, 5 s, and 10 s timeouts of 09 § 12.3 then exist only if each HTTP client's connect and response timeouts are set, which the LLD never states, and the payout lease (call timeout plus 60 s) and the notification lease (OI-15) are safe only if they are. Separately, the default aspect order is Retry(CircuitBreaker(RateLimiter(TimeLimiter(Bulkhead(call))))) (Resilience4j reference), and the `posRecords` `fallback(ex)` is not tied to an annotation: on `@CircuitBreaker` it converts the first failure before Retry sees it, so no retry ever happens; on `@Retry` it lets Retry repeat calls rejected by an open circuit.
- **Options:**
  - **A.** Enforce timeouts in each HTTP client from the same configuration as 09 § 12.3, drop `@TimeLimiter` from synchronous adapters, attach the fallback to `@Retry`, and exclude `CallNotPermittedException` and `BulkheadFullException` from retries - keeps the synchronous design.
  - **B.** Make the adapters asynchronous (`CompletableFuture` with a thread-pool bulkhead) so `@TimeLimiter` applies - uses the annotations as drawn, but adds thread pools and async plumbing to two schedulers.
- **Recommendation:** Option A, with a startup check that each lease exceeds its client timeout plus a margin, and an adapter test per provider that a slow stub fails at the configured timeout.
- **Why:** CLAUDE.md requires timeouts on provider calls, and ADR-10's lease-based in-doubt handling assumes the call ends before its lease; the time limiter as drawn does not guarantee that. A achieves it without changing the concurrency model; B changes it for no functional gain.
- **Status:** Open

---

### OI-33: The consumer error handler dead-letters transient failures after about seven seconds

- **Where:** global / `07-event-contracts.md` § 10.4 (retryable exceptions retried 3 times at 1, 2, and 4 s, then the DLQ), § 10.5 (DLQ retention 30 days); `05-data-model.md` § 8.6 (inbox and `notification` kept "at least the consumed topic's retention", 14 days in 07 § 10.1)
- **Type:** Error path
- **Concern:** SDD §14.6 item 4 sends "invalid transitions and undeserializable messages" to the DLQ; the LLD sends every retryable failure there too once three retries within seven seconds are spent. A database failover or a lock storm (RB-08) therefore moves every event in flight into four DLQs: `REFUND_APPROVED` waits for a manual redrive before payout-service creates the payout, payout facts wait before requests become PAID, and `DlqNotEmpty` pages for events that would have succeeded a minute later. Because DLQ retention (30 days) exceeds inbox and send-log retention (14 days), a late redrive of a `REFUND_SUBMITTED` can also slip past supersession (the newer SENT row is purged) and send a stale message. The Confirm indexed in chunk 15 covers the retry numbers, not the classification of transient failures as poison.
- **Options:**
  - **A.** Retry transient failures (database, broker, lock timeouts) without a limit, with exponential backoff, jitter, and a cap, blocking the partition (which preserves per-key order), and dead-letter only the non-retryable list - matches SDD §14.6 item 4; a long outage shows as consumer lag, which is monitored.
  - **B.** Keep a bounded budget but raise it (for example ten attempts over five minutes) - fewer DLQ entries; a longer outage still dead-letters healthy events.
- **Recommendation:** Option A, with a lag alert per group as the outage signal and a redrive that refuses records older than the inbox retention unless forced.
- **Why:** SDD §14.6 reserves the DLQ for poison, and CLAUDE.md asks for retries with exponential backoff and jitter; dead-lettering healthy events turns a blip into manual work and delayed payouts (REFUNDS/NFR-01). B only moves the threshold.
- **Status:** Open

---

### OI-34: The consumer offset-reset policy is not specified

- **Where:** global / `07-event-contracts.md` § 10.4 (consumer container settings); `17-specs.md` § 3 (P3 and P4 add consumer groups)
- **Type:** Missing edge case
- **Concern:** The settings fix manual commits but not `auto.offset.reset`, which decides where a group starts when it has no committed offset: at first start (payout-service in P3, loyalty-service in P4) and whenever committed offsets expire after a group has been down longer than the broker keeps them. With `latest`, the Kafka client default, a group that lost its offsets silently skips everything published meanwhile: `REFUND_APPROVED` never becomes a payout and `REFUND_PAID` never becomes a take-back. With `earliest`, loyalty-service's first start in P4 replays up to 14 days of `REFUND_PAID` with no earn movements behind them and creates PARKED and CLOSED take-backs for purchases the feed never delivered.
- **Options:**
  - **A.** `earliest` for every group, relying on the inbox for dedup, plus an explicit starting offset for each new group at its go-live (P3, P4) - never skips; replays stay idempotent.
  - **B.** `latest` with an alert on offset resets - no replay load, but the loss has already happened when the alert fires.
- **Recommendation:** Option A, with the broker's consumer-offset retention set above the longest expected consumer outage.
- **Why:** CLAUDE.md "assume at-least-once delivery everywhere" and the inbox make replay safe, while a skip is unrecoverable for money (REFUNDS/NFR-01) and points (LOYALTY/NFR-01). B detects the loss after the fact.
- **Status:** Open

---

### OI-35: The event envelope, with `tenant_id`, is logged at INFO, and database error details put tenant ids and receipt numbers in logs and DLQ headers

- **Where:** global / `07-event-contracts.md` § 10.2 ("the envelope is logged without `payload` at INFO"), § 10.5 (DLQ headers carry the exception message); `09-cross-cutting.md` § 12.7 (`tenant_id` never at INFO or above); `05-data-model.md` § 8.2 and § 8.3 (every key and unique index starts with `tenant_id`)
- **Type:** Multi-tenancy leak
- **Concern:** The SDD §14.3 envelope contains `tenant_id`, so logging it at INFO breaks CLAUDE.md ("never log `tenant_id` ... at INFO level"), SDD §11.4, SDD §9 AP-06, and the LLD's own 09 § 12.7 rule. A second path leaks the same data: PostgreSQL constraint errors carry the violated key's values, and the PostgreSQL JDBC driver copies server error details into exception messages by default (`logServerErrorDetail`, pgJDBC documentation). Since every key here starts with `tenant_id` and the claim index includes the receipt number, every logged constraint violation (the claim index, the duplicate paths of OI-26) and every DLQ record whose exception message becomes a header carries a tenant id and a purchase reference, which SDD §17.4 classifies as PII.
- **Options:**
  - **A.** Log a curated envelope view at INFO (`event_id`, `event_type`, `aggregate_type`, `aggregate_version`, `correlation_id`, `tenant_ref`), set `logServerErrorDetail=false` on every JDBC URL, and put the exception class plus a sanitised code, not the raw message, in DLQ headers - logging-only change.
  - **B.** Log the envelope at DEBUG only - simplest, but INFO then carries no event trace.
- **Recommendation:** Option A, with a test over the integration-suite log output that fails when a `tenant_id` value or a receipt number appears at INFO or WARN.
- **Why:** The rule is non-negotiable in CLAUDE.md and restated in SDD §11.4, and both leaks are structural (every envelope, every constraint message), not accidental. A keeps useful INFO lines with `tenant_ref`; B loses them.
- **Status:** Open

---

### OI-36: Framework exceptions fall into "anything else -> 500", turning client errors into pages and deleted idempotency records

- **Where:** global / `09-cross-cutting.md` § 12.6 (global handler list); `04-implementation/refund-service.md` § 7.8 (daily report: "400 (bad date)"); `06-api-contracts.md` § 9.4 (malformed cursor -> 400); `10-operations.md` § 13.7 (`5xx rate` page)
- **Type:** Error path
- **Concern:** `ProblemDetailsAdvice` maps `ServiceException`, Bean Validation, access denied, authentication failures, and "anything else" to 500. Spring MVC's own client errors are not listed: malformed JSON, a non-UUID `refundId` or an unparseable `date`, a missing `date` parameter, an unsupported media type or method, an unknown path, and the cursor decoder's parse errors. A catch-all `@ExceptionHandler` runs before Spring's default exception resolver, so each becomes 500 `INTERNAL_ERROR`: the 400s promised in 06 § 9.4 and refund-service § 7.8 cannot be produced, a malformed request counts toward the `5xx rate` page and REFUNDS/NFR-02 disrupted minutes, and on an idempotent POST the 5xx deletes the record.
- **Options:**
  - **A.** Extend `ResponseEntityExceptionHandler` (or add explicit handlers) so every framework exception keeps its 4xx status with the SDD code (400 `VALIDATION_FAILED`, 404 `NOT_FOUND`, 405 and 415 with a Problem body), and map the cursor decoder's errors to 400 - standard Spring; one class.
  - **B.** Derive the status in the catch-all from the exception when it carries one - fewer handlers, easy to miss a type.
- **Recommendation:** Option A, with a parameterised MockMvc test per malformed-input class asserting the status, the `errorCode`, and `application/problem+json`.
- **Why:** CLAUDE.md requires Problem Details and alerting on SLOs, and SDD §18 counts 5xx as disrupted minutes; misclassifying client mistakes as server errors breaks both and corrupts the idempotency rule. B leaves gaps by construction.
- **Status:** Open

---

### OI-37: Errors produced before the advice (resource-server 401, gateway 401, 429, 502, 504) are not Problem Details

- **Where:** global and web app / `09-cross-cutting.md` § 12.6 ("authentication failures (401 UNAUTHENTICATED)"), § 12.1 (gateway requirements); `06-api-contracts.md` § 9.1 (429 `RATE_LIMITED` from the gateway); `14-frontend.md` § 17.1 (`ProblemMessageComponent`: `errorCode` to text)
- **Type:** Error path
- **Concern:** An invalid or expired token is rejected by Spring Security's resource-server filter chain before the `DispatcherServlet`, so no `@RestControllerAdvice` sees it, and the default entry point answers 401 with a `WWW-Authenticate` header and no Problem body. The gateway's own 401, 429 (the receipt limit), 502, and 504 come from a product not yet chosen, in its own format, and the gateway requirements in 09 § 12.1 do not ask for Problem Details. The web app turns errors into text only through `errorCode`, so these responses, including the 429 that SDD §17.1 names, reach the user as a generic failure or a raw code, against CLAUDE.md ("never expose ... raw codes") and REFUNDS 11.
- **Options:**
  - **A.** A Problem-writing `AuthenticationEntryPoint` and `AccessDeniedHandler` in each deployable, "errors as `application/problem+json` with the SDD `errorCode`" added to the gateway requirements, and a fallback by HTTP status in `ProblemMessageComponent` when `errorCode` is absent - covers every source.
  - **B.** Only the web-app fallback by status - no backend or gateway work, but API consumers still see mixed formats.
- **Recommendation:** Option A.
- **Why:** SDD §15.1 and §11.6 require Problem Details with a plain-language detail on every endpoint we own, and the gateway is part of that surface for the user; the status fallback still protects against a gateway that cannot be configured. B leaves the contract incomplete.
- **Status:** Open

---

### OI-38: Trace context is lost at the scheduler hops of payout-service and notification-service

- **Where:** payout-service and notification-service / `09-cross-cutting.md` § 12.8 (the outbox stores `traceparent` at write time); `05-data-model.md` § 8.2 (`payout` and `notification` have no trace column); `04-implementation/payout-service.md` § 7.3 and `04-implementation/notification-service.md` § 7.3 (work done by schedulers); `10-operations.md` § 13.5
- **Type:** Implementation gap
- **Concern:** SDD §17.2 requires that "the trace context of `REFUND_APPROVED` continues into the CardPay call and into the payout events", and SDD §17.3 that "the trace of the refund event continues into the Keycloak and MsgHub calls". Here the consumer transaction only inserts a row, the CardPay call and the send run later on a scheduler thread with no parent span, and neither table stores the `traceparent`. Each attempt span is a new root, and the `PAYOUT_SUCCEEDED` outbox row captures that root, so a refund's trace ends at payout creation: an operator following a slow refund from decision to PAID (the SDD §11.4 refund-flow dashboard) cannot see the CardPay attempts or the messages.
- **Options:**
  - **A.** Store `traceparent` on `payout` and `notification` when the row is created, and start each attempt or dispatch span from it (as parent for the first attempt, as a span link for retries) - two columns; traces stay end to end without one trace spanning a 24-hour window.
  - **B.** Correlate through `correlation_id` in logs only - no schema change; no trace continuity.
- **Recommendation:** Option A.
- **Why:** CLAUDE.md makes distributed tracing non-optional and the SDD states continuity for both services; the scheduler hop is an LLD choice (ADR-10 attempts from committed state), so the LLD must carry the context across it. B satisfies neither SDD line.
- **Status:** Open

---

### OI-39: RED metrics per consumer and per job, and SLO-burn alerting, are missing

- **Where:** global / `10-operations.md` § 13.3 (default metrics), § 13.7 (`5xx rate` paging per minute), § 13.8 (jobs: "a failed run alerts")
- **Type:** Implementation gap
- **Concern:** SDD §11.4 asks for "RED metrics (rate, errors, duration) per endpoint and per consumer" and for alerts "on SLO burn (§18)". 13.3 gives consumers only a consumed counter and lag, with no processing-error counter or duration, so a listener failing and retrying shows no error rate; the relay has a log event (`outbox_publish_failed`) but no counter; the inbox has no duplicate counter; and no job exports a run, failure, or last-success metric, so a watchdog or reconciliation that stops running (a bad cron, or the locking of OI-29) leaves its gauges at their last value and the NFR-01 checks end silently. The availability alert pages whenever 5% of requests fail in one minute, which pages on each disrupted minute rather than on burn of the 120-minute monthly budget of REFUNDS/NFR-02.
- **Options:**
  - **A.** Add `event_processing_seconds{group, event_type, outcome}`, `inbox_duplicates_total{group}`, `outbox_publish_failures_total`, `job_runs_total{job, outcome}`, and `job_last_success_timestamp_seconds{job}` with an alert when older than the schedule plus a margin, and replace the per-minute page with multi-window burn-rate alerts on the NFR-02 budget - standard RED and SLO practice.
  - **B.** Keep the current set and rely on DLQ depth and lag - fewer metrics; job failures and slow consumers stay invisible.
- **Recommendation:** Option A.
- **Why:** CLAUDE.md ("RED metrics per service, alerting on SLOs not on raw resource usage") and SDD §11.4 both require it, and both NFR-01 checks are jobs whose liveness must be visible. B leaves the money checks unmonitored.
- **Status:** Open

---

### OI-40: Schema compatibility is checked in one direction only, and nothing gates breaking changes to the `/v1` OpenAPI files

- **Where:** global / `07-event-contracts.md` § 10.2 (shared contracts artefact); `13-testing.md` § 16.4 ("CI checks backward compatibility"; OpenAPI conformance), § 16.7 (Contract gate)
- **Type:** Implementation gap
- **Concern:** Producers and consumers deploy independently (CLAUDE.md: no shared release trains). After a producer adds a field, consumers built on the previous contracts artefact must read the new events (forward compatibility), and a new consumer must read retained and DLQ events up to 30 days old (backward compatibility); CI checks backward only. In JSON Schema registries, whether an added property is compatible also depends on the schema's content model (`additionalProperties`), which is not fixed, and the consumers' tolerance of unknown fields is not stated. On the REST side, CI checks controllers against the OpenAPI files, but nothing detects an in-place breaking edit of `refunds-platform-core-v1.yaml`, which CLAUDE.md forbids ("breaking changes require a new version, never an in-place change").
- **Options:**
  - **A.** Full transitive compatibility per subject in the registry, a content model chosen so that an optional added field passes it, consumers that ignore unknown fields, and an OpenAPI diff gate against the last released `v1` file - both directions and REST covered; one CI step each.
  - **B.** Backward-only checks plus manual review - no tooling; relies on reviewers spotting direction-specific breaks.
- **Recommendation:** Option A, with the registry setting chosen together with the registry product (open in SDD §6); an OpenAPI diff tool is a new dependency needing approval per CLAUDE.md.
- **Why:** SDD §14.6 item 5 and AP-10 promise additive-only evolution, which holds only if both reader directions are checked, and ADR-04 versions REST by URI, which needs a gate to keep `/v1` stable. B leaves both promises to review discipline.
- **Status:** Open

---

### OI-41: The test plan misses the concurrency and error paths where this design is weakest

- **Where:** global / `13-testing.md` § 16.2 (unit examples), § 16.3 (must-have scenarios), § 16.4 (contract tests), § 16.6 (tenant fixtures)
- **Type:** Test gap
- **Concern:** The must-have list covers the happy idempotent paths and several races, but none of the failure modes found in this review: redrives with real `aggregate_version` values (OI-01, OI-02), the interceptor's 4xx replay and 5xx delete through the real advice (OI-04, OI-05), a crash that leaves IN_PROGRESS (OI-06), a CardPay call outliving its lease (OI-10), concurrent take-backs and an earn racing a take-back (OI-18), zero-point purchases (OI-19), duplicate API-03 results and replanned channels (OI-26), relay lock loss (OI-28), jobs on two replicas (OI-29), tenant-scoped circuits (OI-31), and malformed requests (OI-36). Tenant isolation is tested per repository, not per query method, so a native aggregate query in `BranchReportRepository` or a job statement can omit the tenant predicate while the architecture test, which checks only the method signature, passes. SAGA-01 is never tested across the three deployables below the UI (decision to PAID to take-back), and loyalty-service and notification-service have no consumer-driven check that the payload fields they require stay required.
- **Options:**
  - **A.** Add these as must-have Testcontainers scenarios, one tenant-isolation test per query method including native queries and job statements, and one SIT saga test (API decision, stubbed CardPay confirmation, PAID, take-back) - covers the failure surface; a longer CI run.
  - **B.** Cover them with unit tests and mocked repositories - fast, but aborted transactions, advisory locks, and SKIP LOCKED cannot be reproduced with mocks.
- **Recommendation:** Option A.
- **Why:** CLAUDE.md requires Testcontainers with a real database and no mocked repositories in integration tests, and every item listed is database or broker behaviour; the current list would pass while each defect ships. B cannot reproduce them.
- **Status:** Open

---

### OI-42: 08 § 11.1 redraws SDD Figures 14 and 17 and silently adds payout transitions

- **Where:** global (documentation) / `08-state-and-rules.md` § 11.1 (RefundRequest and Payout diagrams); SDD §17.1 Figure 14, SDD §17.2 Figure 17
- **Type:** Duplication
- **Concern:** The chunk states that the design-level machines are SDD Figures 14 and 17 and that it adds "the implementing method, guard, and side effect", but it redraws both: the refund machine repeats Figure 14 almost verbatim, and the payout machine adds `PENDING --> FAILED` (window closed at claim) and `RETRY_WAIT --> SUCCEEDED` (API-03 confirmation while waiting), which Figure 17 does not draw although SDD §17.2 implies them ("a confirmation received while the payout waits is never lost"). Two drawings of one machine drift apart, and the added transitions sit in the LLD with nothing telling the SDD owner that Figure 17 is incomplete.
- **Options:**
  - **A.** Keep only the transition tables (the implementation delta), link the SDD figures, and record the two missing transitions in chunk 15 as an SDD Figure 17 update - one home per machine.
  - **B.** Keep the redrawn diagrams and mark every difference from the SDD figure - readable in place; still two homes.
- **Recommendation:** Option A.
- **Why:** 01 § 1 keeps the SDD as the home of every design decision and the LLD as the implementation delta; an unflagged transition added in a copy is the drift that rule exists to prevent. B keeps the duplication and needs discipline to stay aligned.
- **Status:** Open

---

### OI-43: The PII inventory has two homes in the LLD that disagree, and both miss the event payloads

- **Where:** global (documentation) / `05-data-model.md` § 8.7 (PII columns); `11-security.md` § 14.2 (PII inventory)
- **Type:** Duplication
- **Concern:** 05 § 8.7 lists PII columns and 11 § 14.2 lists them again with handling, and the lists differ: 11 adds `payout.original_payment_ref`, `payout_result.raw_body`, and the DLQ topics, and 05 has none of them. Both omit data the SDD classifies: `outbox_event.payload` in schema `refund` and database `payout` (carrying `customerId`, `decisionReason`, `originalPaymentRef`, `providerPayoutRef`), the source topics themselves (SDD §14.9: `customerId` and `decisionReason` "live on retained topics"), `pending_take_back.purchase_reference` and the `receipt_number` columns of `refund_request` and `refund_request_item` (purchase references are PII per SDD §17.4), and staff subjects in `decided_by` and `changed_by`. Non-production masking and erasure are driven from this inventory, so a missing row is data that escapes masking. The Confirm indexed in chunk 15 asks whether the inventory is complete; it does not address the two diverging copies.
- **Options:**
  - **A.** Keep the inventory only in 11 § 14.2, replace 05 § 8.7's list with a link, and add the missing locations - one home; 05 keeps the encryption approach.
  - **B.** Keep both and add a CI check that they match - two homes with a guard.
- **Recommendation:** Option A.
- **Why:** One fact, one home applies inside the LLD as well as against the SDD, and this inventory drives GDPR masking and erasure (SDD §17.1 and §17.4 Compliance), where a stale copy is a compliance defect. B adds tooling to maintain a duplication.
- **Status:** Open

---

### OI-44: The ADR-10 retry window is configured twice, in two independently released charts

- **Where:** global (configuration) / `10-operations.md` § 13.1 (`REFUND_PAYOUT_RETRY_WINDOW` in the core, `PAYOUT_RETRY_WINDOW` in payout-service, both `PT24H`)
- **Type:** Duplication
- **Concern:** payout-service closes the ADR-10 window with `PAYOUT_RETRY_WINDOW` and the core's watchdog flags overdue payouts with `REFUND_PAYOUT_RETRY_WINDOW`; the two values live in two Helm charts released independently. When ADR-10 changes and one chart is updated first, the watchdog either pages for payouts still legitimately retrying (window lengthened) or flags a missing outcome later than it should (window shortened), and that watchdog is one of the two REFUNDS/NFR-01 checks. The SDD's accepted OI-14 removed twenty restatements of this value to give it one home (ADR-10); the LLD reintroduces two at the configuration level.
- **Options:**
  - **A.** One value in shared Helm values consumed by both charts, each deployable exporting the value it runs with as a gauge, and an alert when the two differ - one source plus a drift signal.
  - **B.** Decouple the watchdog from ADR-10 with a documented fixed threshold (for example 48 hours after the decision) - no shared value, but a window lengthened beyond it breaks the check silently.
- **Recommendation:** Option A.
- **Why:** SDD OI-14 and ADR-10 establish one home for the window, and the copy that drifts is the NFR-01 detector; A keeps one source and surfaces drift. B trades coupling for a threshold that can fall behind ADR-10.
- **Status:** Open

---

### OI-45: The Specs claims do not match the body or the sources

- **Where:** global (Specs) / `17-specs.md` § 1 (Mission), § 2 (Tech Stack, its cross-check line and TODO), § 3 (Roadmap note); `03-architecture.md` § 6.3; SDD §1; BRD REFUNDS 15 (Waves)
- **Type:** Drift
- **Concern:** § 2 states it is "equal to this LLD's 03 § 6.3 ... no mismatch", yet its version-pin TODO omits Resilience4j, which its Backend bullet names without a version and which the 03 § 6.3 TODO lists as unpinned together with the API gateway and the build tool; Resilience4j is also not an SDD §6 row (03 § 6.3 sources it to CLAUDE.md), although § 2 is defined as consolidated from SDD §6. § 3 says P1 to P3 "follow the REFUNDS implementation plan waves", but REFUNDS 15 puts UC-02 and UC-03 (TASK-02) and UC-04 (TASK-03) both in wave 2, each depending only on TASK-01, while the Roadmap serialises them as P2 then P3. § 1 drops an outcome SDD §1 lists among the core capabilities (customer email and SMS on each refund outcome, added by the SDD's accepted OI-08), so the constitution input omits the purpose of notification-service while P1 builds it. Speckit `/constitution` reads this chunk verbatim.
- **Options:**
  - **A.** Correct the three statements: one Mission clause for customer messaging, a Tech Stack pin list and source note consistent with 03 § 6.3, and a Roadmap that either marks P2 and P3 as parallel or states that wave 2 is re-sequenced and why - three small edits.
  - **B.** Leave the Specs as synthesised - no work; the constitution input contradicts the body and the BRD plan.
- **Recommendation:** Option A.
- **Why:** The Specs template requires the Tech Stack to agree with 03 § 6.3 ("a mismatch is drift to flag, not to hide") and takes the Mission from SDD §1; this chunk feeds downstream agents verbatim, so an inaccurate claim propagates. B keeps known inaccuracies in the constitution input.
- **Status:** Open

---

## Resolution Log

<!-- When an open item is resolved, move its summary here with a pointer to the LLD update (chunk + service + sub-section). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| - | - | - | None yet |

---

## Reviewer Notes

<!-- Optional. Free-form notes that did not crystallise into a numbered open item. -->

- **Type "Drift" in a from-sdd LLD:** OI-03 and OI-45 use Drift for divergences between this LLD and its SDD, or between the Specs and the body; the template reserves the label for hybrid mode, and no code exists here.
- **A test that contradicts the pseudocode:** `decide_partialAmountEqualToRequested_throwsInvalidPartialAmount` (13 § 16.2, copied from SDD §17.1) cannot pass against `04-implementation/refund-service.md` § 7.3: an APPROVE whose amount equals the requested amount is a full approval, and `RefundDecision` carries no "partial" intent. Drop the test, or add the intent to the body so REFUNDS UC-04 BR-2 ("less than the requested amount") becomes checkable.
- **APPROVE without an amount:** refund-service § 7.3 dereferences `body.approvedAmount` without a presence check; require it for APPROVE and reject it for REJECT with 400 `VALIDATION_FAILED`.
- **Daily report currencies:** refund-service § 7.8 sums `paid_amount` across currencies, while 06 § 9.2 returns `amountsPaid` as a list of Money; group by currency (CLAUDE.md: show the currency code in multi-currency views).
- **Post-load gates:** `getDetail` and `decide` load by (tenant, id) and check owner or branch afterwards, which contradicts 11 § 14.4 ("in the query predicate, never after loading"); the 403-for-another-branch rule of SDD §16.2 needs the post-load check, so the security text should state that exception.
- **`raw_body` as `jsonb`:** `jsonb` normalises key order and whitespace, so the exact signed bytes of an API-03 call cannot be re-verified later, and the TODO's fallback `dedup_key` (SHA-256 of the verified body) cannot be recomputed from what is stored; keep the original bytes (`bytea` or `text`) beside it.
- **Shared reference sequence:** one `reference_number_seq` for all tenants (08 § 11.3) lets a customer infer platform-wide volume from the gaps; the TODO indexed in chunk 15 covers the format only. A per-tenant counter avoids it once a second tenant exists.
- **Client-supplied correlation ids:** `X-Correlation-Id` from the browser is copied into `correlation_id`, which SDD §14.3 types as UUIDv7, while browsers generate v4; mint or re-validate it at the gateway.
- **Expired-key race in `begin`:** "existing and expired -> delete it and insert again" lets two concurrent requests both delete; the loser's `ON CONFLICT DO NOTHING` inserts nothing and the flow has no branch for it (it should re-read the record).
- **SMS length:** `REFUND_REJECTED` SMS templates carry a free-text reason of up to 500 characters, which in UCS-2 (Arabic) spans several SMS segments; define truncation or an SMS-specific template.
- **Concurrent dispatch order:** two PENDING rows of one refund, channel, and recipient can be sent by two replicas at once, because the supersession check is not atomic with the send; acceptable at this volume, but the supersession test in 13 § 16.3 should not assume ordering between rows due at the same time.
- **CLOSED take-backs for non-member purchases:** every paid refund of a non-member purchase ends as a CLOSED `pending_take_back` kept indefinitely while retention is open (05 § 8.6); a purge horizon beyond the POS catch-up window keeps the table bounded.

<!-- MASTER: lld-master.md | PREV: 17-specs.md | NEXT: none -->
