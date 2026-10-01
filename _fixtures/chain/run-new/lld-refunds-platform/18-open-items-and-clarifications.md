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

> **What this section is.** A structured backlog of implementation-level concerns identified after the main LLD was authored, by a reviewer running with cleared context. Items are not blockers in themselves; they are decisions the implementer or technical lead needs to make before code can be written confidently.
>
> **What this section is not.** It is not a list of inline `> Confirm:` or `> TODO:` flags found in the body; those are indexed in chunk 15 (Open Questions). This section is the reviewer's *external* findings: edge cases the body did not consider, pattern applications that look wrong, error paths that were assumed away.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Service name + sub-section (e.g., `payout-service / 7.3 Method Pseudocode`), or "global" if cross-cutting. |
| **Type** | Implementation gap / Missing edge case / Pattern misapplication / Error path / Concurrency hazard / Transaction boundary / Idempotency gap / Multi-tenancy leak / Test gap / Drift (hybrid-mode only) / Duplication (SDD content restated instead of referenced) / Traceability gap (a use case, route, test case, spec, or entry point the trace misses, a link that does not resolve, or a BRD ID without its key) / Missing scenario (behaviour the design needs that no BRD use case covers; never a new UC). This review also uses Contract drift (a name, field, or rule that differs from the SDD registries or service specs) and Specs-body mismatch (the Specs chunk disagrees with the body or its sources). |
| **Concern** | One paragraph. What was missed and why it matters for code correctness or production reliability. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommendation** | REQUIRED. The reviewer's suggested option: always pick one, even for close calls (state that it is a close call in the Why). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins, meaning the evidence behind it (CLAUDE.md rule, SDD contract, code fact, correctness/production risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open / Resolved (link to LLD update) / Deferred (with rationale). |

---

## Open Items

### OI-01: The idempotency executor caches 5xx, deletes committed records, and never frees a stale IN_PROGRESS

- **Where:** kernel `IdempotentCommandExecutor` (`09-cross-cutting.md` § 12.2); refund-service § 7.6, § 7.7; web app `14-frontend.md` § 17.2
- **Type:** Idempotency gap
- **Concern:** The executor branches on exception type, not HTTP status: every `ServiceException` is stored as a COMPLETED record, yet `ReceiptLookupUnavailableException` is a `ServiceException` with status 503 (`refund-service.md` § 7.7: "all exceptions extend `ServiceException`"). A POS outage during `POST /v1/refund-requests` is therefore replayed as 503 for 24 hours to a web app that reuses the same key on every retry (§ 17.2), against SDD §11.1 ("a command that ends in 5xx deletes its record so the client can retry"). The generic catch deletes the record unconditionally, so an exception raised after the command transaction committed (lost commit acknowledgement, response mapping) deletes a COMPLETED record, and the retry answers 409 `ITEM_ALREADY_REFUNDED` or `REFUND_ALREADY_DECIDED` for work that succeeded, the false error SDD OI-05 introduced these records to remove. Nothing frees an IN_PROGRESS record whose pod died mid-command (rolling updates, SDD §11.3): every retry gets 409 `REQUEST_IN_PROGRESS` for 24 hours, and the web app retries silently with no cap. (Whether 4xx outcomes are stored is flagged in chunk 15; this item is about 5xx, deletion, and staleness.)
- **Options:**
  - **A.** Classify by the exception's HTTP status (store below 500, delete from 500), delete only `WHERE status = 'IN_PROGRESS'`, and add a `locked_until` lease (above the worst-case command time) after which a repeat may take the record over with a compare-and-set - one column and one CAS; a re-run after takeover is safe because the command commits its COMPLETED record atomically.
  - **B.** Keep type-based branching, move 5xx exceptions off `ServiceException`, and let IN_PROGRESS wait for the 24-hour expiry - fewer changes, but a crashed command still blocks that user action for a day.
  - **C.** Drop IN_PROGRESS and rely on the domain constraints for concurrent repeats - simplest, but it brings back the false 409s SDD OI-05 removed.
- **Recommendation:** A. In § 12.2: status-based classification, `records.deleteIfInProgress(ctx)` on 5xx, `idempotency_record.locked_until` in `05-data-model.md` § 8.2 with takeover after expiry, and `OptimisticConflictException` mapped to `RefundAlreadyDecidedException` inside the service so the executor stores the 409. In § 17.2, cap silent `REQUEST_IN_PROGRESS` retries (for example 5) and then show an actionable message.
- **Why:** SDD §11.1 makes 5xx retryable, and the web app's key reuse turns a cached 503 into a day-long failure of that customer action; A is the only option that keeps both the replay promise and recovery after a crash, at the cost of one column and a CAS update.
- **Status:** Open

---

### OI-02: ProblemDetailsAdvice sends Spring MVC client errors to the 500 branch, and gateway errors have no Problem Details contract

- **Where:** global, `09-cross-cutting.md` § 12.6; refund-service § 7.7; loyalty-service § 7.7; API gateway routes (`01-purpose-and-scope.md` § 2.1)
- **Type:** Error path
- **Concern:** § 12.6 maps only `ServiceException`, Bean Validation, `AccessDeniedException`, and authentication failures; "anything else" is 500 `INTERNAL_ERROR`. A missing `Idempotency-Key` (`MissingRequestHeaderException`), a non-UUID key or path id (`MethodArgumentTypeMismatchException`, which refund-service § 7.7 files under `MethodArgumentNotValidException`), an unreadable body (`HttpMessageNotReadableException`), 405, 415, and method-parameter validation (`HandlerMethodValidationException`) therefore return 500, although `06-api-contracts.md` § 9.1 promises 400. SDD §18 counts 5xx at the gateway as REFUNDS/NFR-02 disruption, so client mistakes burn the availability budget and page on-call. Separately, the gateway itself produces 429 `RATE_LIMITED` (receipt lookup, refund-service § REFUNDS/UC-01), 401 at the edge, and 502/504 when the core is unreachable, but nothing requires those bodies to be `application/problem+json` with `errorCode`, which `ProblemMessageComponent` (14 § 17.4) needs to show an actionable message.
- **Options:**
  - **A.** Make `ProblemDetailsAdvice` extend `ResponseEntityExceptionHandler`, add explicit 400 `VALIDATION_FAILED` handlers (with `errors[]`) for the header, type-mismatch, unreadable-body, and method-validation exceptions, and pin the gateway's error templates to RFC 9457 with SDD §15.1 codes - one kernel base class plus gateway configuration once the product is chosen.
  - **B.** Enable `spring.mvc.problemdetails.enabled` and accept Spring's default bodies - no code, but no `errorCode`, so the web app cannot map them, and `type` URIs differ from § 12.6.
- **Recommendation:** A, with a kernel test that sends each malformed request and asserts 400 and `errorCode`, and a "gateway-generated errors" row in `06-api-contracts.md` § 9.3.
- **Why:** CLAUDE.md requires Problem Details from one global advice and SDD §15.1 fixes 400 for schema errors; A keeps client mistakes out of the REFUNDS/NFR-02 5xx count for the cost of one base class and a gateway template.
- **Status:** Open

---

### OI-03: The partner endpoints (API-03, API-06) have no security chain and no tenant-context setup

- **Where:** payout-service § 7.2, § 7.3 (`PayoutResultController`, `receive`); loyalty-service § 7.2 (`MemberPurchaseController`); `09-cross-cutting.md` § 12.1; `06-api-contracts.md` § 9.3
- **Type:** Implementation gap
- **Concern:** Each deployable is a resource server that "rejects a token without `tenant_id` (401)" (§ 12.1, § 9.3), and `TenantScopedJdbcRepository` refuses a call whose tenant differs from `TenantContext`, which is set only by `TenantContextFilter` (from the JWT), the listener wrapper, and scheduler loops. The partner routes carry no JWT (ADR-11), so as written every POS push to the core and every CardPay result to payout-service is refused with 401 before `PartnerKeyResolver` runs; once a permit rule is added, every repository call after `partnerKey` resolution is refused (or, if an empty context is treated as "unchecked", the tenant guard is silently bypassed). `tenant_ref` never reaches the MDC for these requests either, so partner-route logs carry no tenant context (SDD §11.4).
- **Options:**
  - **A.** A second `SecurityFilterChain`, ordered first, for `/v1/partners/**` (no JWT, stateless, CSRF off), plus a kernel `PartnerTenantFilter` that resolves `partnerKey`, sets and clears `TenantContext` and `tenant_ref`, and hands the tenant to the signature verifier - one kernel component used by both deployables.
  - **B.** Resolve the tenant inside each controller and set `TenantContext` by hand - no kernel change, but two copies of a security control that can diverge.
- **Recommendation:** A; document it in § 12.1 and add a test that a partner call with a valid key but another tenant's signature secret is 401 and writes nothing.
- **Why:** ADR-11 requires the tenant before the signature, and CLAUDE.md requires tenant context on every request; A implements it once in the kernel, B duplicates security-critical code in two services.
- **Status:** Open

---

### OI-04: One failing tenant or row stalls scheduled work

- **Where:** `09-cross-cutting.md` § 12.4 (`OutboxRelay.cycle`); payout-service § 7.3 (`claimDue`); refund-service § Workflow: Payout watchdog; loyalty-service and notification-service scheduled jobs
- **Type:** Error path
- **Concern:** `claimDue` handles up to 10 payouts in one transaction ordered by `next_attempt_at`. A deterministic failure for one payout (for example a `PAYOUT_FAILED` payload the producer schema check rejects) rolls back the whole batch, and because that row keeps the oldest `next_attempt_at` it heads every later batch: no payout of that tenant is attempted again, and only the watchdog notices, after the window plus 1 hour. The relay has the same head-of-line shape per tenant (rows in `seq` order, "on failure: rollback (rows stay)"), and RB-01's remedy (restart) does not clear a poison row. No per-tenant loop (relay, attempt scheduler, dispatcher, watchdog, closure and reconciliation jobs) states that an exception for one tenant is caught before the next tenant runs, and the watchdog runs all tenants in one read-only transaction, so one tenant's failure blinds the check for every tenant: a cross-tenant blast radius.
- **Options:**
  - **A.** Per-row transactions (or savepoints) in `claimDue`, a per-tenant try/catch with a `scheduled_tenant_failures_total{job,tenant_ref}` counter in every loop, and a quarantine path (`last_error`, failure count, skip after N with an alert); for the outbox, hold back only the failing aggregate's later rows and keep relaying the others - bounded blast radius, small code.
  - **B.** Keep batch transactions and alert on "oldest due payout age" - detection only; the stall lasts until someone fixes data by hand.
- **Recommendation:** A, plus an RB-01 and RB-04 step for a quarantined row.
- **Why:** REFUNDS/NFR-01 ("never lost") cannot depend on every row being well formed, and CLAUDE.md's tenant isolation means tenant A's data must never stop tenant B's payouts; A costs one transaction per row at about 1,200 payouts a month.
- **Status:** Open

---

### OI-05: Every scheduled job shares Spring's single default scheduler thread

- **Where:** global; the "Other entry points" tables of refund-service, payout-service, notification-service, and loyalty-service § 7.2; `09-cross-cutting.md` § 12.4; `12-performance.md` § 15.4
- **Type:** Concurrency hazard
- **Concern:** The relay (`fixedDelay` 500 ms), the payout attempt scheduler, the notification dispatcher, the watchdog, the take-back closure, both reconciliations, and `HousekeepingJob` are all `@Scheduled`, and the LLD sizes no scheduler (no `spring.task.scheduling.pool.size`, no virtual threads), so Spring Boot runs them on one thread per deployable. In the core, the daily `LedgerReconciliationJob` (a REPEATABLE_READ sum over every member of every tenant) blocks `OutboxRelay` for its whole run, delaying `REFUND_APPROVED` and `REFUND_PAID` (LOYALTY/NFR-02 budget); in payout-service the daily CardPay report fetch blocks both the relay and the attempt scheduler; in notification-service the dispatcher's sequential Keycloak and MsgHub calls occupy the same thread as housekeeping. The `OutboxBacklog` page (30 s for 5 minutes) will fire on every reconciliation run.
- **Options:**
  - **A.** Size a scheduler pool per deployable and hand long jobs (reconciliations, housekeeping, dispatch) to a dedicated executor, so the relay and the attempt scheduler never wait behind them - explicit sizing in § 15.4.
  - **B.** Enable virtual threads (`spring.threads.virtual.enabled`) so each scheduled task runs on its own thread - one property on Java 21, but blocking JDBC and pool contention need a load test.
- **Recommendation:** A; record the pool sizes and the job-to-executor mapping in `12-performance.md` § 15.4.
- **Why:** the outbox relay is the heartbeat of every SAGA-01 step and the SDD's outbox-age alert assumes it runs continuously; A isolates it deterministically, while B is attractive on Java 21 but less predictable with blocking JDBC.
- **Status:** Open

---

### OI-06: The tenant directory is copied into three charts, and unknown tenants are skipped or accepted silently

- **Where:** global; `09-cross-cutting.md` § 12.1, § 12.9; `10-operations.md` § 13.1 (`refunds-platform.tenants[]` for all three deployables); `05-data-model.md` § 8.4 (loops over `TenantDirectory.all()`)
- **Type:** Multi-tenancy leak
- **Concern:** Relays, schedulers, and jobs iterate `TenantDirectory.all()` from each deployable's own Helm values. A tenant present in the core's list but missing from payout-service's gets payouts created by the consumer (which trusts the envelope `tenant_id`) that the attempt scheduler never claims; a tenant missing from the core's list has its outbox rows never relayed. Both fail silently until the daily watchdog. Consumers never check that the envelope tenant is known locally, and the core only checks that `tenant_id` is present (06 § 9.3), while SDD §16.2 requires "a known `tenant_id`" at the edge and ADR-07 repeats token validation in each deployable. Onboarding a second retailer (ADR-03) is exactly when three copies drift. (A-L03, static tenant configuration, is flagged in chunk 15; this consistency hazard is not.)
- **Options:**
  - **A.** One tenant-registry values file rendered into all three charts, a startup `tenant_directory_info{hash}` metric with an alert when deployables disagree, consumers that dead-letter an event of an unknown tenant with an alarm, and a core that rejects a token whose `tenant_id` is not in its directory (401) - one home, loud failure.
  - **B.** Iterate the tenants found in the data (for example `SELECT DISTINCT tenant_id` in the relay) - no drift, but a cross-tenant query, which SDD §11.2 forbids in application code.
- **Recommendation:** A; add the check to § 12.1 and a tenant-onboarding procedure to `10-operations.md` § 13.8.
- **Why:** a tenant that silently gets no payouts breaks REFUNDS/NFR-01; A keeps tenant data single-homed and turns drift into an alert, while B breaks the no-cross-tenant-query rule.
- **Status:** Open

---

### OI-07: The schema registry sits inside write transactions and on the consume path

- **Where:** `07-event-contracts.md` § 10.2 (implementation rules); refund-service § 7.4 (`envelopeReader.read`); `09-cross-cutting.md` § 12.4; SDD §14.3
- **Type:** Pattern misapplication
- **Concern:** Producers "validate the payload against [the registry version] before `OutboxEventWriter.append`" and consumers "validate on read and dead-letter what fails". Unless schemas are bundled, `append` reaches the registry inside the aggregate transaction, against the LLD's own rule that no remote call runs inside an aggregate transaction (refund-service § 7.6), and makes the registry a synchronous dependency of submit, cancel, decide, and every payout state commit: a registry outage becomes REFUNDS/NFR-02 disruption. On the consume side a registry outage fails validation for every record, so whether it is classified as `MalformedEventException` or retried three times, every event of every consumer ends in its DLQ. The envelope's `schema_version` is a semver in SDD §14.3 but "the registry version of the event's subject" here, which most registries number as an integer (contract drift).
- **Options:**
  - **A.** Bundle each event's JSON Schema in the kernel artifact at build time (CI checks that it is registered and backward compatible), validate against the bundled copy on both sides, keep the registry off the runtime path, and write the SDD's semver into `schema_version` from the schema's metadata - no runtime dependency; a new schema version ships with a release.
  - **B.** Runtime lookups with a local cache, and "schema unavailable" treated as transient (pause the container instead of dead-lettering) - dynamic, but a cold cache still couples writes to the registry.
- **Recommendation:** A; state it in § 10.2 and § 12.4.
- **Why:** ADR-05 and SDD OI-03 keep broker infrastructure off the request path; A applies the same rule to the registry and keeps `schema_version` equal to §14.3, while B only softens the failure.
- **Status:** Open

---

### OI-08: DLQ redrive can loop a still-failing record back into the DLQ it drains, and its endpoint is described two ways

- **Where:** `07-event-contracts.md` § 10.5; `10-operations.md` § 13.8 RB-01, RB-02; `11-security.md` § 14.4
- **Type:** Error path
- **Concern:** `DlqRedriveListener` consumes `<consumer>.dlq` and "passes each record to the same handler", but nothing says what happens when a redriven record fails again. With the shared `DefaultErrorHandler` and `DeadLetterPublishingRecoverer` it is appended to the same `<consumer>.dlq`, which the running redrive listener reads again, so a poison record loops every retry cycle and `dlq_depth` never reaches 0 (RB-02 step 4). A redrive also takes every tenant's records at once, although SDD §20.1.6 asks for tenant-scoped incident handling. The endpoint lives on "a separate management port, not routed by the ingress" (14.4), yet RB-01 and RB-02 call `localhost:8080/actuator/...`, so either the runbooks fail or actuator shares the application port; no authentication or audit record is specified for this state-changing action. (The redrive mechanism and the management port are flagged as LLD choices; these defects are not.)
- **Options:**
  - **A.** Give the redrive container its own error handler that stops the redrive and leaves the failing record uncommitted (no republish), bound each redrive to the DLQ end offsets captured at start, accept an optional `tenant_id` filter, use the management port in the runbooks, and write an audit event for each start and stop - no new topic; the operator sees exactly which record still fails.
  - **B.** Republish re-failures to a separate parked topic - drains the DLQ, but adds a topic the SDD §14 registry does not have.
- **Recommendation:** A.
- **Why:** SDD §14.6 item 6 allows redrive only into the consumer group, and a redrive that can loop forever is not a procedure an on-call engineer can trust; A needs no SDD change, B does.
- **Status:** Open

---

### OI-09: Dedup records expire before DLQ and replay records do

- **Where:** `05-data-model.md` § 8.6; `07-event-contracts.md` § 10.1 (DLQ retention 30 days); notification-service § 7.3; refund-service § 7.3 (`onPayoutSucceeded`)
- **Type:** Idempotency gap
- **Concern:** Inbox and send-log rows are deleted at "the consumed topic's retention, plus 7 days" (14 days with the best-guess topics), but DLQ records live 30 days and SDD §14.6 item 6 allows replay from the topic or an archive. A record redriven after day 14 finds neither its inbox row nor its send-log row, so notification-service sends the customer a stale message again (SDD §17.3: "receives each message once"), and the superseded check cannot help because the later SENT rows were purged too. In refund-service a replayed `PAYOUT_SUCCEEDED` for a request already PAID throws `InvalidTransitionException` and returns to the DLQ with an alarm, whereas `onPayoutFailed` already treats PAID as a no-op. `HousekeepingJob` is not limited to terminal rows either, so a PENDING message older than the retention disappears without a FAILED alert. (Chunk 15 flags the retention numbers, not this rule.)
- **Options:**
  - **A.** Keep dedup rows at least max(topic retention, DLQ retention, replay horizon) plus a margin, make `onPayoutSucceeded` a no-op for a request already PAID, and let housekeeping delete only SENT, SKIPPED, and FAILED rows - a few thousand more rows a month per consumer.
  - **B.** Keep 14 days and cap DLQ retention at the topic retention - smaller tables, but a DLQ record older than the fix can no longer be redriven.
- **Recommendation:** A; state the rule once in § 8.6 and reference it from § 10.5.
- **Why:** at-least-once delivery (CLAUDE.md) includes redrive and replay, so the dedup window must cover them; A costs little storage at SDD §18.1 volumes, B trades recoverability for it.
- **Status:** Open

---

### OI-10: SDD metrics and alert inputs have no emission point, and job-set gauges vanish on restart

- **Where:** `10-operations.md` § 13.3, § 13.7; payout-service § 7.3; refund-service § Workflow: Payout watchdog; loyalty-service § Workflow: Ledger reconciliation; `03-architecture.md` § 6.2; `12-performance.md` § 15.5
- **Type:** Implementation gap
- **Concern:** § 13.7 alerts on `payout_window_expired_total`, which no pseudocode increments (the `claimDue` fail path meters nothing), and on `payout_results_unmatched`, a gauge nothing computes; `dlq_depth` and the outbox gauges have no stated computation. SDD metrics `refund_payout_failed_open` (SDD §17.1 alerts on it; § 13.7 has no such alert), `payouts_in_retry`, `payout_attempts_total` (SDD: refusal-spike alert), `notifications_pending`, `points_take_backs_parked`, `refund_requests_submitted_total`, `refund_decisions_total`, and `refund_time_to_decision_seconds` have no emission point at all. `refund_payout_outcome_overdue` and the "PARKED older than 2 days" figure are set once a day by one replica into in-memory gauges, so a rolling restart resets them to 0 and the paging alert resolves in the middle of an incident; database-derived gauges exported by several replicas are multiplied by `sum()`. notification-service also autoscales on consumer lag (§ 6.2, § 15.5), but planning commits at once, so the send backlog lives in PENDING rows and never shows as lag.
- **Options:**
  - **A.** A kernel `BusinessGaugeRefresher` per deployable (every minute, per tenant, `tenant_ref` label, a documented `max by (tenant_ref)` aggregation), explicit counter increments in each pseudocode step, the missing SDD alerts in § 13.7, and the notification HPA on `notifications_pending` or the oldest PENDING age - one component; alerts survive restarts.
  - **B.** Emit gauges only from the daily jobs and document the reset - no new component, but alerts go blind after every deploy.
- **Recommendation:** A.
- **Why:** CLAUDE.md makes RED metrics and SLO alerting non-optional, and the REFUNDS/NFR-01 checks of SDD §18 are only as good as the gauges they read; A adds one small query per gauge per minute at trivial volume.
- **Status:** Open

---

### OI-11: The LLD forbids at INFO the ids the SDD makes mandatory log fields

- **Where:** `11-security.md` § 14.1 (internal UUIDs "never logged at INFO"), § 14.5 (log allow-list); `09-cross-cutting.md` § 12.7; `10-operations.md` RB-04, RB-08; refund-service § 7.3 (audit event "at DEBUG only")
- **Type:** Contract drift
- **Concern:** SDD §17.1 to §17.4 make `refund_id`, `payout_id` with `attempt` and `outcome`, `notification_id` with `event_type`, `channel`, and `status`, and `movement_id` or `refund_id` mandatory log fields, and SDD §11.4 bans only `tenant_id`, `customer_id`, `member_id`, contact details, and payment references at INFO. The LLD classifies all internal UUIDs as Confidential and never logged at INFO, lists no per-service mandatory fields in § 12.7, and RB-04 tells on-call to find payouts by trace id because "ids are not at INFO"; the formatter allow-list of § 14.5 would strip the SDD's fields. RB-08 identifies a customer "from the security audit stream", but the only audit write is a DEBUG log line that production does not emit, and no audit channel is designed.
- **Options:**
  - **A.** Follow the SDD: allow aggregate ids at INFO (UUIDv7 surrogates, not PII), add the per-service mandatory fields to § 12.7 and the allow-list, and define a restricted security-audit log channel (own appender, access, and retention) for pseudonymous customer ids - matches the SDD and makes RB-04 and RB-08 executable.
  - **B.** Keep the stricter rule and ask the SDD owner to drop the fields - fewer identifiers in logs, but triage then depends on trace sampling (not pinned), and RB-08 still has no evidence.
- **Recommendation:** A.
- **Why:** the SDD owns the logging contract and names these fields for triage, while CLAUDE.md bans tenant ids and PII, not surrogate keys; B needs an SDD change and leaves the security runbook without data.
- **Status:** Open

---

### OI-12: Nothing designs how tokens get the `tenant_id`, `branch_id`, and `member_id` claims

- **Where:** `09-cross-cutting.md` § 12.1; `11-security.md` § 14.4; SDD §16.3, §16.6, §16.12.1, and the SDD reviewer note on self-registration
- **Type:** Missing scenario
- **Concern:** Every deployable rejects a token without `tenant_id`, and the ownership gates read `branch_id` and `member_id`, yet no chunk designs how those claims reach the token: no realm-import file (SDD §16.12.1: "seeded by a versioned realm import"), no protocol mappers from user attributes to claims, and no step that stamps `tenant_id` on a self-registered `CUSTOMER` (SDD §16.6) in a realm shared by all tenants. As written, a customer who self-registers holds no `tenant_id` and gets 401 on every call; with a second retailer there is no rule for which tenant a registration belongs to, or whether one person can be a customer of two retailers. No BRD use case covers registration (the SDD reviewer raised it as a candidate missing scenario), so the LLD cannot invent one. (What `member_id` holds is flagged as OQ-04; this item is about provisioning any of the claims, `tenant_id` first.)
- **Options:**
  - **A.** Raise it to the REFUNDS and LOYALTY owners and the SDD owner as a missing scenario; meanwhile add to the LLD, as `> Confirm:` items, the realm-import location, the three attribute-to-claim mappers, and a per-tenant registration client (tenant-specific client and theme that stamp `tenant_id`) - unblocks integration tests; the two-retailer customer question stays with the owners.
  - **B.** Stamp one default tenant at registration until a second retailer arrives - works for A-3 today, but every self-registered account must be migrated later.
- **Recommendation:** A.
- **Why:** CLAUDE.md fixes single-realm multi-tenancy, which only works if the tenant is stamped when the account is created; A keeps IDs with their owners (no new use case) while making the claim pipeline implementable now.
- **Status:** Open

---

### OI-13: The POS lookup's Resilience4j setup leaves decorator order, retried exceptions, and the latency budget open

- **Where:** refund-service § 7.4 (Pattern: Resilience4j on the POS Records call); `09-cross-cutting.md` § 12.3
- **Type:** Pattern misapplication
- **Concern:** `PosReceiptLookupAdapter.lookup` stacks `@Retry`, `@CircuitBreaker(fallbackMethod = "unavailable")`, and `@Bulkhead`. In Resilience4j's default aspect order Retry wraps CircuitBreaker, so the retry only ever sees what the fallback throws: `ReceiptNotFoundException` or `ReceiptLookupUnavailableException`. With the default retry predicate (all exceptions) a not-found receipt is looked up three times, and bulkhead-full or open-circuit calls are retried into the saturation they signal; if `retryExceptions` names the I/O exceptions instead, nothing is ever retried, because the fallback has already converted them. § 12.3 states the intent ("not found is not a failure", "only on idempotent reads") but no `ignoreExceptions` or `retryExceptions`. Worst case, three attempts of 2 s connect plus 5 s read plus backoff is about 21.6 s on a customer request thread, far beyond the best-guess 800 ms p95 and probably beyond the gateway timeout, so the core keeps working after the gateway has answered 504. (Chunk 15 flags the timeout values, not the predicates or the budget rule.)
- **Options:**
  - **A.** Per instance: the fallback declared on `@Retry` (the outermost aspect), `ignoreExceptions` with `ReceiptNotFoundException`, `CallNotPermittedException`, and `BulkheadFullException` on the retry and the not-found exception on the circuit breaker, `retryExceptions` limited to I/O and 5xx, and a total time budget below the gateway route timeout - predictable behaviour and latency.
  - **B.** Drop the in-call retry for this synchronous lookup and let the customer retry - simpler, but SDD INT-03 asks for up to 2 retries.
- **Recommendation:** A; record the gateway route timeout next to the budget in § 12.3.
- **Why:** CLAUDE.md asks for retries with backoff and circuit breakers that behave as intended, and SDD R-08 counts every POS failure against REFUNDS/NFR-02; A honours INT-03 without tripling lookups or outliving the gateway.
- **Status:** Open

---

### OI-14: `findRefundableItems` has no stated transaction boundary, and its REQUIRES_NEW counter can deadlock the pool

- **Where:** refund-service § 7.3 (`ReceiptQueryServiceImpl.findRefundableItems`), § 7.6
- **Type:** Transaction boundary
- **Concern:** § 7.6 lists `RefundQueryServiceImpl.*` as REQUIRED read-only but nothing for `ReceiptQueryServiceImpl`, which calls POS (up to about 21 s, OI-13) and then increments the not-found counter with REQUIRES_NEW. A REQUIRED default (the skill's § 7.6 default) applied to this unlisted method, or the chunk's own read-only convention for query services, puts the POS call inside a transaction that holds a connection, and the REQUIRES_NEW increment then needs a second connection while holding the first. The `pos-receipt` bulkhead (20) equals the core pool (20, `12-performance.md` § 15.4), so 20 concurrent not-found lookups can each hold one connection and wait for a second: a pool deadlock that also stops the loyalty endpoints sharing the pool (SDD R-07). Step 1 also uses `today` before step 2 computes it.
- **Options:**
  - **A.** Declare `findRefundableItems` non-transactional: the POS call holds no connection, the claim read runs in its own short read-only transaction, and the counter increment runs in a plain REQUIRED transaction - no nested transactions.
  - **B.** Keep a read-only transaction and move the counter increment after it closes - works, but still holds a connection across the POS call.
- **Recommendation:** A; add the row to § 7.6 and fix the step order.
- **Why:** the LLD's own convention (refund-service § 7.6: no POS call inside a transaction) and the SDD's matching rule for CardPay (§17.2 Developer Notes) keep remote calls out of transactions; A removes both the long-held connection and the nested-transaction deadlock at no cost.
- **Status:** Open

---

### OI-15: The branch queue returns no reason, although REFUNDS/UC-04 step 2 lists it

- **Where:** `06-api-contracts.md` § 9.2 (`RefundRequestPageResponse`, `RefundRequestResponse`); refund-service § 7.3 (`branchQueue`), § REFUNDS/UC-04; `14-frontend.md` § 17.1 (`BranchQueueComponent`)
- **Type:** Implementation gap
- **Concern:** REFUNDS/UC-04 step 2 ("lists them, oldest first, with amount and reason") and SDD §17.1 ("with amount and reason") require the reason in the queue, but `GET /v1/branches/{branchId}/refund-requests` returns `RefundRequestPage` of `RefundRequest` items, whose proposed shape has no `reason`; only `RefundRequestDetail` carries it. `BranchQueueComponent` can therefore show the reason (REFUNDS/MK-03 "Default" state) only with one detail call per row. (Chunk 15 flags the DTO fields the LLD added; this is a field the upstream documents require and the shape lacks.)
- **Options:**
  - **A.** A queue item record (`BranchQueueItem` = the `RefundRequest` fields plus `reason`) for the branch queue only - one more schema; the customer list stays as REFUNDS/UC-02 step 2 describes it.
  - **B.** Add `reason` to `RefundRequest` for both lists - one schema, but the customer list then carries a field REFUNDS/UC-02 step 2 does not ask for.
- **Recommendation:** A, flagged `> Confirm:` like the other § 9.2 shape proposals.
- **Why:** the BRD step and the SDD business logic both name the reason; A satisfies them without an N+1 read on the manager's screen and without widening the customer list.
- **Status:** Open

---

### OI-16: Money inputs are not checked against the currency's minor units or the line sign

- **Where:** refund-service § 7.3 (`submit` step 4, `decide` APPROVE branch); `05-data-model.md` § 8.2 (`ck_rr_requested`, `refund_request_item.amount >= 0`); `06-api-contracts.md` § 9.2; `14-frontend.md` § 17.4
- **Type:** Missing edge case
- **Concern:** `decide` checks only `0 < amount <= requested` and the currency, so an `approvedAmount` of "20.0001" passes (scale 4 everywhere, `02-context.md` § 5.5) and reaches CardPay, whose refusal is then retried for the whole ADR-10 window and ends as `PAYOUT_FAILED` for a typo. In `submit`, "requested must be > 0" names no error, so a selection of zero-amount lines ends in the `ck_rr_requested` violation, and a POS line with a negative amount (discount, coupon, deposit) violates `amount >= 0`; both surface as 500 `INTERNAL_ERROR`, counted as REFUNDS/NFR-02 disruption. Neither BRD says whether zero or negative lines are refundable, so that rule is an owner question.
- **Options:**
  - **A.** Validate the `approvedAmount` scale against the ISO-4217 minor units of the request currency (400 `VALIDATION_FAILED`, field `approvedAmount`), return non-positive POS lines with `refundable: false`, answer a selection whose sum is not above 0 with 400 on `lineIds`, and ask the REFUNDS owner for the discount-line rule - deterministic 4xx instead of 500s and provider refusals.
  - **B.** Round approved amounts half-even to the minor unit and let POS decide line eligibility - no rejection, but it silently changes the amount the manager confirmed.
- **Recommendation:** A; mirror the minor-unit rule in the decision form's currency input.
- **Why:** money must never reach a provider in a form it will refuse for a whole day (REFUNDS/NFR-01, ADR-10), and database CHECKs are a last line of defence, not a user-facing error (CLAUDE.md: errors are actionable).
- **Status:** Open

---

### OI-17: A failed payout can never be closed, and a late CardPay success after manual resolution pays twice

- **Where:** refund-service § Cross-service Saga; `08-state-and-rules.md` § 11.1; payout-service § 7.3 (late success in `recordOutcome` and `receive`); `10-operations.md` RB-04 step 5
- **Type:** Missing scenario
- **Concern:** After the window a request stays APPROVED with payout status FAILED for ever: no transition closes it once the branch resolves it by hand (RB-04 step 5), so it stays flagged in the queue, `refund_payout_failed_open` (SDD §17.1) never returns to zero, and the customer sees Approved indefinitely (REFUNDS/UC-02). Worse, the late-confirmation path (FAILED to SUCCEEDED, then PAID and `REFUND_PAID`) stays open with no limit, so if the branch refunds the customer by hand and CardPay later confirms the original payout, the customer is paid twice and told "paid" again: the duplicate REFUNDS/NFR-01 forbids. No BRD use case covers resolving a failed payout (SDD §17.2 lists a retry action as a future enhancement); chunk 15 flags only that SAGA-01 has no compensation.
- **Options:**
  - **A.** Raise a missing scenario to the REFUNDS owner and the SDD owner: a recorded manual resolution (who, how, reference) that closes the request and is refused while CardPay shows the payout pending or paid; until then RB-04 must require a CardPay status check and forbid manual payment while any attempt is in doubt - IDs stay with their owners; needs an SDD state or field.
  - **B.** Keep FAILED open and rely on RB-04 discipline - no change, but the path to a second payment stays automated.
- **Recommendation:** A.
- **Why:** REFUNDS/NFR-01 is "never paid twice", and the only automated route to a second payment is the unbounded late confirmation; A closes it through an owner decision rather than an LLD-invented state.
- **Status:** Open

---

### OI-18: The CardPay fallback turns post-send timeouts, post-send 5xx, and response-mapping errors into UNAVAILABLE

- **Where:** payout-service § 7.4 (Pattern: Resilience4j on the CardPay call), § 7.3 (`runAttempt` mapping), § 7.7
- **Type:** Error path
- **Concern:** The fallback returns IN_DOUBT only when `t instanceof SocketTimeoutException`. Spring's `RestClient` wraps I/O failures in `ResourceAccessException` (the timeout is its cause), so read timeouts become UNAVAILABLE and the next attempt is a plain PAY instead of the in-doubt resolution, skipping the status query that R-01 and ADR-10 rely on once CardPay offers one. A 5xx returned after CardPay received the request (502 or 504 from its edge) is also UNAVAILABLE, although the payout may have been made. Any exception while mapping a 2xx response (an unexpected field) is caught by the same fallback, so every same-key retry repeats the parsing failure until the window closes and `PAYOUT_FAILED` tells the branch that a refund CardPay paid was not paid.
- **Options:**
  - **A.** Classify by cause chain and phase: failures before the request was written (connect refused, circuit open, bulkhead full) are UNAVAILABLE; everything after it was written (read timeout, 5xx other than documented refusals, response-mapping errors) is IN_DOUBT, with a `payout_response_unmapped_total` alert; unknown defaults to IN_DOUBT - one classifier with a unit test per branch.
  - **B.** Treat every exception as IN_DOUBT - safe for money, but a CardPay outage then turns every due payout into in-doubt resolutions.
- **Recommendation:** A.
- **Why:** SDD §17.2 treats timeouts and lost responses as "in doubt" and ADR-10 resolves doubt with the same key or a status query; A applies that per phase, while B floods status queries during outages.
- **Status:** Open

---

### OI-19: The window can close on an in-doubt attempt, and reconciliation never applies CardPay's evidence

- **Where:** payout-service § 7.3 (`claimDue`), § Workflow: Provider reconciliation; `10-operations.md` RB-04 step 4
- **Type:** Missing edge case
- **Concern:** When `claimDue` finds an expired lease at or after the window end, it marks the open attempt IN_DOUBT and fails the payout at once, so a timed-out call that CardPay executed ends as `PAYOUT_FAILED` unless an API-03 result arrives later, and API-03's transport (callback or polling) is still TBD. RB-04 step 4 says "the next matched API-03 result or the reconciliation evidence moves it to SUCCEEDED", but the reconciliation job reads only SUCCEEDED payouts and meters mismatches: a CardPay payout for a FAILED row counts as "only in theirs" and nothing moves it. The runbook promises an automation the design lacks, and the branch is steered towards paying by hand money that already left (OI-17). (Chunk 15 flags the report's availability, not this behaviour.)
- **Options:**
  - **A.** Include FAILED and in-flight payouts in the reconciliation set and apply a matching CardPay record through the SDD's late-confirmation transition (`succeed` and `PAYOUT_SUCCEEDED`, SDD §17.2); once the status query exists, run one final resolution before failing a payout whose last attempt is in doubt - reuses an existing transition; depends on the CardPay report (TBD).
  - **B.** Keep reconciliation as detection only and correct RB-04 - honest, but a paid refund can stay FAILED until someone acts.
- **Recommendation:** A, with RB-04 rewritten to match.
- **Why:** SDD §17.2 already allows FAILED to SUCCEEDED "so money that did leave is never reported as lost"; A gives that rule a trigger that does not depend on CardPay pushing a result.
- **Status:** Open

---

### OI-20: The attempt lease starts when a payout is claimed, not when CardPay is called

- **Where:** payout-service § 7.3 (`claimDue`, `runAttempt`), § 7.4 (bounded attempt executor); `12-performance.md` § 15.4
- **Type:** Concurrency hazard
- **Concern:** `claimDue` sets `next_attempt_at = now + call timeout + 60 s` and commits, then queues each attempt on the 10-thread executor. The scheduler claims 10 due payouts per tenant per tick on every replica whatever the executor's free capacity, so after a CardPay outage (the SDD §18.3 recovery burst) with 20 s read timeouts the queue outgrows the lease: another replica sees the lease expired, marks the attempt IN_DOUBT, and opens a new attempt while the first is still queued. The result is two concurrent calls with the same key, spurious `PayoutLeaseExpired` alerts, and inflated `attempts` in `PAYOUT_FAILED`. If the executor rejects a task, the claimed payout waits a full lease and is then retried "in doubt" although no call was made.
- **Options:**
  - **A.** Claim only as many payouts as the executor has free permits, and let `runAttempt` skip the call when its attempt is no longer the payout's latest (a short read before calling) - no double calls; slightly lower claim throughput.
  - **B.** Refresh the lease in a short transaction when the call actually starts - an accurate lease for one more write per attempt.
- **Recommendation:** A, and B too if a queue can still build up.
- **Why:** ADR-10's lease exists to detect crashed attempts, not queued ones; A keeps "at most one attempt in flight" (`08-state-and-rules.md` § 11.1) true in practice instead of relying on CardPay's same-key behaviour under concurrency, which API-02 has not documented.
- **Status:** Open

---

### OI-21: `rematch` inside `recordOutcome` sees an unsaved payout, and `receive` does not lock the payout it changes

- **Where:** payout-service § 7.3 (`recordOutcome` step 3, `PayoutResultServiceImpl.receive` step 4), § 7.6
- **Type:** Concurrency hazard
- **Concern:** `recordOutcome` sets `providerPayoutRef` on its locked in-memory payout and calls `rematch(tenant, ref)` before saving (step 7). `rematch` receives only the tenant and the reference, so it must load the payout by reference: either it finds nothing (not yet saved) and the unmatched result is never re-matched, contrary to API-03 ("re-matched whenever an API-02 response or status query records a provider payout reference"), or it loads a second copy and applies the result there, after which `recordOutcome` applies CONFIRMED again on its stale copy (a second, distinct `PAYOUT_SUCCEEDED` that refund-service dead-letters) or fails its version check, rolls back, and waits for a lease expiry. `receive` matches the payout without `FOR UPDATE`, so a concurrent `recordOutcome` makes it fail its version check and answer 5xx without storing the result, relying on CardPay redelivery that is still TBD. (Chunk 15 flags only `recordOutcome`'s own row lock.)
- **Options:**
  - **A.** Save the reference first, call `rematch(tenant, payout)` with the locked aggregate so results are applied to the same instance, and take `SELECT ... FOR UPDATE` on the matched payout in `receive` - one lock order (payout row, then results) on both paths.
  - **B.** Move re-matching to a periodic job over UNMATCHED results - no in-transaction coupling, but a confirmation waits for the next run.
- **Recommendation:** A.
- **Why:** SDD API-03 promises store-before-acknowledge and re-matching, and REFUNDS/NFR-01 needs exactly one `PAYOUT_SUCCEEDED`; A enforces both with a single lock order, while B delays PAID for no benefit at this volume.
- **Status:** Open

---

### OI-22: `PAYOUT_SUCCEEDED` requires `providerPayoutRef`, but both success paths can lack one

- **Where:** payout-service § 7.3 (`recordOutcome` CONFIRMED, `receive` success); `07-event-contracts.md` § 10.2; SDD §14.9.6
- **Type:** Contract drift
- **Concern:** SDD §14.9.6 marks `providerPayoutRef` Required, and producers validate every payload before `append` (§ 10.2). A CONFIRMED outcome from API-02 or a status query without a CardPay reference, or an API-03 success matched by the echoed payout id or reference number without one (`payout.providerPayoutRef ??= r.providerPayoutRef` stays null), produces an invalid payload: `recordOutcome` rolls back and re-runs in doubt until the window closes and the payout ends FAILED although CardPay confirmed it, and `receive` answers 5xx for ever. No consumer reads the field (refund-service uses `refundId` and `paidAmount`).
- **Options:**
  - **A.** Ask the SDD owner, through sdd-unifier, to make `providerPayoutRef` conditional (required when CardPay supplies one), and until then treat a reference-less confirmation as IN_DOUBT with an alert - the contract stays honest; PAID may wait for a reference.
  - **B.** Fill the field with the payout id when CardPay gives none - passes validation, but puts our id in a field §14.9.6 defines as CardPay's reference.
- **Recommendation:** A.
- **Why:** a schema check must never turn a confirmed payout into a reported failure (REFUNDS/NFR-01); A fixes the contract at its home (one fact, one home), B silently changes what a field means.
- **Status:** Open

---

### OI-23: A stale dispatcher can overwrite SENT, because the recording guard is `attempt_count`

- **Where:** notification-service § 7.3 (`claimDue`, `dispatch` step 6), § 7.6
- **Type:** Concurrency hazard
- **Concern:** Outcomes are recorded "optimistic on `attempt_count`", but recording SENT does not change `attempt_count`. When a lease expires (its length is never given: § 7.3 says only "now + lease"), a second replica can dispatch the same row; if the first records SENT and the second then records a rejection, the second's `WHERE attempt_count = n` still matches and moves the row from SENT back to PENDING, against the "never back" rule of `08-state-and-rules.md` § 11.1, and the message goes out again later. Rows are dispatched one at a time (20 per tenant per tick, on the scheduler thread, OI-05), so the lease must cover the whole batch, not one Keycloak lookup with two retries plus one MsgHub call. (The crash-time duplicate is flagged in chunk 15; this race needs no crash.)
- **Options:**
  - **A.** A `claim_token` set by `claimDue`, with every outcome recorded `WHERE id = ? AND status = 'PENDING' AND claim_token = ?`, and a lease sized from the per-row timeouts times the batch (or one row claimed at a time) - one column; a stale dispatcher's write is always a no-op.
  - **B.** A `version` column bumped on every write - generic, but it still needs the PENDING predicate to protect SENT.
- **Recommendation:** A.
- **Why:** SDD §17.3 promises each message once and a row that never goes back, and MsgHub idempotency is unconfirmed (API-04 TBD); A lets the database enforce it instead of timing.
- **Status:** Open

---

### OI-24: Branch managers are resolved by a branch code that other tenants can share

- **Where:** notification-service § 7.2 (`ContactDirectory.branchManagers`), § 7.3 (`dispatch` step 2)
- **Type:** Multi-tenancy leak
- **Concern:** `REFUND_PAYOUT_FAILED` rows resolve "users holding `BRANCH_MANAGER` with that `branch_id`" through the Admin API of one realm shared by all tenants (ADR-07). Branch codes are POS codes (`varchar(20)`, for example "0040") that two retailers can both use, so the read also returns another tenant's managers, and step 2 fails the whole row with a security alert as soon as one contact's `tenant_id` differs. Once a second retailer onboards, every payout-failure email for a shared code is never sent (REFUNDS/UC-04 E1, AC-2), each raises a false security incident, and the read pulls other tenants' staff records into memory.
- **Options:**
  - **A.** Query by both attributes (`tenant_id` and `branch_id`) and check the role, drop any foreign contact that still appears (counted in a security metric), and fail the row only when no manager of the tenant remains - correct recipients; relies on Keycloak attribute search (API-05 TBD).
  - **B.** Make branch ids globally unique by prefixing the tenant reference - no query change, but it rewrites POS branch codes in every table and event.
- **Recommendation:** A.
- **Why:** CLAUDE.md requires tenant context on every outgoing call and SDD §11.2 checks the tenant of every API-05 read; A applies the tenant filter at the source instead of failing after the fact.
- **Status:** Open

---

### OI-25: The superseded check ignores who the message is for

- **Where:** notification-service § 7.3 (`dispatch` step 1); `05-data-model.md` § 8.3 (`ix_notification_supersede`); SDD §17.3 (Superseded messages)
- **Type:** Missing edge case
- **Concern:** A row is skipped when a SENT row exists for the same refund and channel with a higher `aggregate_version`, whatever its `recipient`. The branch managers' `REFUND_PAYOUT_FAILED` email is an EMAIL row of the same refund, so if the customer's `REFUND_APPROVED` email is redriven from the DLQ, or delayed past the window by a Keycloak outage, the managers' email suppresses it and the customer is never told the approved amount (REFUNDS/UC-04 AC-1). The SDD's wording has the same gap, so the LLD should not fix it silently.
- **Options:**
  - **A.** Add `recipient` to the predicate and to `ix_notification_supersede`, and ask the SDD owner to add "for the same recipient" to §17.3 - one more column in the predicate.
  - **B.** Keep the rule and exclude `REFUND_PAYOUT_FAILED` rows by event type - narrower, but it breaks again with the next manager-facing message.
- **Recommendation:** A.
- **Why:** supersession exists to stop stale messages to the same person (SDD §14.6 item 3), not to let a staff alert cancel a customer message; A states that intent once.
- **Status:** Open

---

### OI-26: API-06 purchases that earn no points loop for ever, and the batch failure rules contradict each other

- **Where:** loyalty-service § 7.3 (`EarnServiceImpl.recordPurchase`), § 7.6, § Workflow: Earn movements; `08-state-and-rules.md` § 11.3 (`PointsPolicy.earned`); `05-data-model.md` § 8.2 (`ck_movement_sign`)
- **Type:** Error path
- **Concern:** `earned` returns `floor(amount)`, so any purchase below 1 EUR (and a negative amount, if the feed carries returns) yields 0 or fewer points and the EARNED insert violates `ck_movement_sign` (`points > 0`); a non-EUR purchase fails `require currency == EUR`. Each is a deterministic exception in that purchase's transaction, § 7.6 answers the batch with 5xx "so POS redelivers the batch", and POS redelivers it for ever. § Workflow: Earn movements instead says a malformed purchase gets "400 for the batch", which, if POS drops a rejected batch, loses the valid purchases after it: missed earns, then closed take-backs, against LOYALTY/NFR-01. The batch size is unbounded and processed on one HTTP thread, so a POS catch-up (SDD §18.3) can outlive the gateway timeout and be redelivered while still running. (Chunk 15 flags the rounding and non-EUR rule, not these failure modes.)
- **Options:**
  - **A.** Parse the whole batch first (400 only for an unparseable batch, nothing committed); then, per purchase, record zero-point, non-EUR, or negative purchases as acknowledged skips with a counter and an alert, answer 5xx only for transient failures, and cap the batch size - no poison loop, no silent loss.
  - **B.** Store each batch raw on receipt and process it asynchronously with a per-purchase status - most robust, but a new table and job.
- **Recommendation:** A (B if API-06 turns out to be a file feed).
- **Why:** API-06 is idempotent by natural key (SDD §17.4), so deterministic failures must be acknowledged rather than redelivered; A keeps LOYALTY/NFR-01 honest and stops a redelivery storm on the partner route.
- **Status:** Open

---

### OI-27: SDD R-07's "separate thread pools per module" is not realised in the core

- **Where:** global, `refunds-platform-core`; `12-performance.md` § 15.4; `03-architecture.md` § 6.4; SDD §4 R-07
- **Type:** Implementation gap
- **Concern:** SDD R-07 mitigates the core's shared failure domain with "separate schemas and thread pools per module", but the LLD gives the core one HikariCP pool of 20 and one servlet thread pool for the refund and loyalty endpoints, API-06 ingestion (a transaction and an advisory lock per purchase), two listeners, the relay, and the scheduled jobs. A POS member-purchase catch-up (SDD §18.3) or a slow reconciliation can exhaust the pool, so refund endpoints wait for connections and fail with 5xx, counted against REFUNDS/NFR-02. The `pos-receipt` bulkhead (20) also equals the pool size (OI-14).
- **Options:**
  - **A.** A connection pool per module (and a small one for the relay, listeners, and jobs), plus a semaphore bulkhead on API-06 processing, all sized in § 15.4 - isolates the modules as R-07 intends; more connections to budget on the core database.
  - **B.** One pool with Resilience4j bulkheads on the loyalty endpoints and API-06 only - fewer pools, but database waits still spill across modules.
- **Recommendation:** A.
- **Why:** R-07 is the SDD's stated mitigation for keeping two modules in one pod, so without it the ADR-01 hybrid bet loses its safety margin; A costs a few connections at this volume.
- **Status:** Open

---

### OI-28: The web app loses the Idempotency-Key on reload, turning a recorded submission into a 409

- **Where:** `14-frontend.md` § 17.2 (HTTP layer)
- **Type:** Missing edge case
- **Concern:** The key is "created once per user action ... and reused on every retry of that action", but it lives only in memory. After a gateway 504 or a dropped connection where the core committed, a customer who reloads and submits again sends a new key, and the server answers 409 `ITEM_ALREADY_REFUNDED` ("Reload the receipt") for the request it just recorded, while the email and SMS confirm it; a branch manager who reloads and decides again gets 409 `REFUND_ALREADY_DECIDED` for their own decision. These are the false errors SDD OI-05 introduced idempotency records to remove, reappearing on the client side.
- **Options:**
  - **A.** Keep a pending action's key in `sessionStorage` (keyed by action and form hash) until a definitive response, and on 409 `ITEM_ALREADY_REFUNDED` look up the caller's own list for a SUBMITTED request on the same receipt and show it as the result - a small store change; the key survives reloads in the tab.
  - **B.** Derive the key from the form content - survives reloads, but two genuine requests with the same content collide.
- **Recommendation:** A.
- **Why:** CLAUDE.md requires actionable errors, and SDD §17.1 wants repeats replayed, not failed; A covers the realistic reload case without changing the server contract.
- **Status:** Open

---

### OI-29: The permission map has no single home: a Helm key on the server and an unspecified copy in the web app

- **Where:** `09-cross-cutting.md` § 12.1; `10-operations.md` § 13.1 (`refunds-platform.*.security.role-permissions.*`); `14-frontend.md` § 17.2 (`SessionStore`), § 17.3 (`permissionGuard`)
- **Type:** Duplication
- **Concern:** SDD §11.5 and §16.12.1 keep the role-to-permission map "versioned with the code" and reviewed against §16. The LLD lists it among the per-environment keys that Helm values render, with no default (13.1), so any environment can grant tokens without a code review: an authorization change hidden in deployment values. The web app guards and hides routes by permission token, but the access token carries only realm roles and no endpoint returns permissions, so `SessionStore`'s "caller permissions" can only come from a hand-written copy of the map, a second home that drifts from §16.11.
- **Options:**
  - **A.** Package the map as a versioned resource in each module (not a Helm key) and generate the web app's role-to-permission table from the same file at build time, with a CI check against the §16.12.2 counts - one source for server and UI.
  - **B.** Add a `GET /v1/me/permissions` endpoint - runtime truth, but an endpoint the SDD's List of APIs does not have.
- **Recommendation:** A.
- **Why:** one fact, one home (the skill's rule) and SDD §16.12.1 both place the map with the code; A removes the per-environment override path and the UI copy without a new SDD contract.
- **Status:** Open

---

### OI-30: The test plan skips the paths most likely to lose or double money

- **Where:** `13-testing.md` § 16.2 to § 16.4, § 16.6
- **Type:** Test gap
- **Concern:** § 16.3 covers concurrent POSTs with one key, cancel versus decide, and take-back versus purchase, but not: the executor's error branches (a 503 must not be replayed, a committed record must survive a late exception, a stale IN_PROGRESS must be recoverable, OI-01); the payout races (an API-03 success while an attempt is in flight, `rematch` during `recordOutcome`, lease expiry while queued, window close with an in-doubt attempt, OI-19 to OI-21); partner-endpoint security (unknown key, another tenant's secret, replayed result, OI-03); tenant isolation of relays, schedulers, and jobs (only repository tests seed two tenants); DLQ redrive idempotency (OI-08); and the contract between the hand-written Angular services (14 § 17.2) and `refunds-platform-core.v1.yaml`. The SDD asks for a CardPay stub that "refuses, times out, and confirms late"; no integration test uses its late-confirmation mode.
- **Options:**
  - **A.** Testcontainers suites for these cases (named `methodName_scenario_expectedResult`), a two-tenant fixture for every scheduled job, and a CI check of the Angular services against the OpenAPI file - more CI minutes, coverage where REFUNDS/NFR-01 can fail.
  - **B.** Cover them only in SIT e2e runs - fewer tests, but races are not reproducible end to end.
- **Recommendation:** A.
- **Why:** CLAUDE.md requires Testcontainers integration tests against real PostgreSQL and Kafka, and these are the only places the design's money guarantees can be proven deterministically.
- **Status:** Open

---

### OI-31: The LOYALTY e2e specs have no way to create earned points or a take-back

- **Where:** `13-testing.md` § 16.6, § 16.8 (`e2e/loyalty-uc-01-view-points-balance.spec.ts`, `e2e/loyalty-uc-02-view-points-history.spec.ts`)
- **Type:** Test gap
- **Concern:** The specs claim LOYALTY/UC-01 steps 1-2 and A1, and LOYALTY/UC-02 steps 1-4, A1, and BR-1 (the take-back), but EARNED movements come only from API-06 through the partner route with a per-tenant signature, and the test data lists stubs for POS receipts, CardPay, MsgHub, and Keycloak only: no signed API-06 driver and no seeded movements. LOYALTY/UC-02 BR-1 also needs the POS stub's receipt (API-01) and member purchase (API-06) to share a branch and receipt number (SDD A-4) so the full chain (submit, approve, pay, `REFUND_PAID`, take-back) meets in one run; no fixture guarantees it.
- **Options:**
  - **A.** A signed API-06 test driver (a per-tenant partner key and secret in SIT) and a POS fixture that emits the same receipt to API-01 and API-06, used by both LOYALTY specs - realistic chain; the driver follows the provisional API-06 shape until the contract arrives.
  - **B.** Seed movements directly into the `loyalty` schema - fast, but it bypasses the earn path and cannot cover LOYALTY/UC-02 BR-1 end to end.
- **Recommendation:** A.
- **Why:** LOYALTY/UC-02 BR-1 is the cross-BRD dependency most likely to break (SDD R-03, R-04), and it can only be accepted through the real earn and take-back paths.
- **Status:** Open

---

### OI-32: SDD content and scalars are restated instead of referenced

- **Where:** `12-performance.md` § 15.6; `10-operations.md` § 13.1 (`refunds-platform.payout.retry-window` in two deployables); refund-service § 7.2, `11-security.md` § 14.5, `12-performance.md` § 15.4 (receipt lookup limit)
- **Type:** Duplication
- **Concern:** § 15.6 copies SDD §18.4's scenario set and acceptance criteria almost word for word ("SDD §18.4: baseline; 3x seasonal soak; ...") and adds no implementation delta (which stub mode, metric, or query decides pass or fail for each scenario). The ADR-10 window is configured twice at runtime, in the core (watchdog cutoff) and in payout-service (retry window): shortening only payout-service below Prod (A-L06, flagged for its per-environment value) leaves the watchdog blind, and shortening only the core raises false `PayoutOutcomeOverdue` pages during REFUNDS/TC-DEC-04 runs. The "10 lookups per rolling hour" limit, owned by SDD §17.1 Constraints, is restated in three chunks.
- **Options:**
  - **A.** Replace the § 15.6 rows with a link to SDD §18.4 plus a per-scenario delta table (stub mode, metrics, pass query), render one Helm value for the window into both charts, and cite SDD §17.1 for the limit - one home per fact.
  - **B.** Keep the copies and add a consistency checklist - no rewrite, but drift is found only after it happens.
- **Recommendation:** A.
- **Why:** the skill's one-fact-one-home rules (sdd-to-lld.md, rules 1 and 4) make restated upstream content a defect, and SDD OI-14 removed twenty copies of the window from the SDD; A stops the LLD from reintroducing them.
- **Status:** Open

---

### OI-33: The Roadmap puts decisions after the phase whose acceptance needs them

- **Where:** `17-specs.md` § 3 Roadmap; REFUNDS BRD chunk 15 (waves) and chunk 16; SDD §14.4, §14.5
- **Type:** Specs-body mismatch
- **Concern:** P2 (REFUNDS/UC-02, REFUNDS/UC-03) precedes P3 (REFUNDS/UC-04), but P2's own UAT cases need a decision: REFUNDS/TC-REQ-05 opens "an approved request" (REFUNDS/UC-02 AC-1) and REFUNDS/TC-REQ-08 needs "a request approved while the customer has it open" (REFUNDS/UC-03 E1). The BRD's implementation plan (REFUNDS chunk 15) puts both tasks in Wave 2 after Wave 1, not one after the other. The labels also collide: SDD §14.4 and §14.5 mark both topics phase "P1", while the LLD's P1 contains no payout-service, and this LLD's own chunk 15 ("Before P3 build") uses the LLD's meaning.
- **Options:**
  - **A.** Merge P2 and P3 into one phase (matching the BRD's Wave 2), and give the LLD phases labels distinct from the SDD's topic phases (or ask the SDD owner to align that column) - a roadmap that can pass its own acceptance.
  - **B.** Keep the order and mark REFUNDS/TC-REQ-05 and REFUNDS/TC-REQ-08 blocked until P3 - no change, but P2 cannot be accepted when delivered.
- **Recommendation:** A.
- **Why:** the Roadmap feeds speckit `/constitution` and delivery planning, so a phase that cannot pass its own acceptance cases is a planning defect; merging follows the BRD's own wave plan.
- **Status:** Open

---

### OI-34: `12-performance.md` cites two NFR IDs without their BRD key

- **Where:** `12-performance.md` § 15.1 (the paragraph under the SLO table)
- **Type:** Traceability gap
- **Concern:** The sentence quoted as `REFUNDS/NFR-01, NFR-02, NFR-04; LOYALTY/NFR-01` writes the second and third IDs without the `REFUNDS/` key. The skill requires every BRD ID to carry its key (sdd-to-lld.md, IDs and keys rule 2, check 8), and with two BRDs the unkeyed second ID is ambiguous: LOYALTY/NFR-02 (the one-hour take-back) exists too.
- **Options:**
  - **A.** Write "REFUNDS/NFR-01, REFUNDS/NFR-02, REFUNDS/NFR-04; LOYALTY/NFR-01" - one edit.
  - **B.** Leave it - no work, but a search for REFUNDS/NFR-02 misses this row, and the ID reads as LOYALTY's.
- **Recommendation:** A.
- **Why:** keys exist because the two BRDs reuse ID numbers; the fix costs one line.
- **Status:** Open

---

## Resolution Log

<!-- When an open item is resolved, move its summary here with a pointer to the LLD update (chunk + service + sub-section). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|

---

## Reviewer Notes

<!-- Optional. Free-form notes that did not crystallise into a numbered open item. -->

- **Checked with no finding:** topic names, event names, envelope fields, consumer groups, and DLQ names match SDD §14 character for character (drift only in OI-07 and OI-22); every payload record in the pseudocode carries the §14.9 fields; permission tokens and role names match SDD §16.11 and the §16.12.2 counts; every state change that must produce an event writes its outbox row in the aggregate's transaction (refund, payout). On the trace: each §7.3 use case has exactly one block in its owner's file with the BRD's key, ID, and title; every line's owner, entry points, UAT/BAT cases, and screens equal §7.3, REFUNDS chunk 16, and 14 § 17.3; every route has a screen and use-case cell; every traced entry point carries `@UseCase`; every non-retired REFUNDS test case has a spec or a Not automated reason; and all 280 relative links and anchors in the LLD resolve (the master's link to this chunk resolves now that it exists).
- **Refusals under one key:** REFUNDS/UC-04 E1 asks the system to "try again" after a refusal, but if CardPay stores the refusal against the `Idempotency-Key`, every same-key retry replays it and the window only delays the manager's email; worth one question in the CardPay contract work (OQ-06).
- **`payout_result.raw_body jsonb`** normalises the body, so the signature can no longer be re-verified for audit, and a non-JSON body fails the insert; `bytea` or `text` keeps the exact bytes.
- **Partner-key probing:** 404 for an unknown key versus 401 for a bad signature lets a caller test which partner keys exist; one uniform 401 hides it.
- **Routes:** `/forbidden` and `**` sit inside the `authGuard` shell in the routes code, while the 14 § 17.3 table lists no guard for them.
- **Branch queue index:** `branchQueue` orders by a CASE expression and filters on `payout_status`, so `ix_rr_branch_queue` cannot return rows in index order as 12 § 15.3 states; harmless at this volume, but the claim should go.
- **Relay timing:** the relay waits 10 s for acknowledgements while `delivery.timeout.ms` is 120 s, so a slow broker leads to re-sends of rows still in flight; the inbox absorbs them.
- **`use_case` in access logs:** the interceptor removes `use_case` from the MDC in `afterCompletion`, before an embedded-server access log is written; a servlet filter would keep it there if the access log should carry it.
- **Alert style:** `DbPoolSaturation` alerts on raw resource usage, which CLAUDE.md steers away from; keeping it as a Warn next to the SLO alerts is fine.
- **Reference numbers:** `refund.reference_number_seq` is shared by all tenants, so one tenant's reference numbers reveal another's volume once a second retailer onboards; a per-tenant sequence avoids it.
- **Message retries:** permanent MsgHub rejections are retried like transient ones, and whether `retryLater` during a Keycloak outage consumes an attempt is not stated.
- **Segregation of duties:** the one-account case (`decided_by` equal to the request's `customer_id`) is a one-line check the LLD could add now; 11 § 14.5 leaves the rule to the REFUNDS owner.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 17-specs.md | NEXT: none -->
