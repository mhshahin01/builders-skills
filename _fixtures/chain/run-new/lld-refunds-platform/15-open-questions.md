<!--
CHUNK: 15
TITLE: Open Questions, Drift Index, Confidence Flags
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 18. Open Questions & Flag Index

> **How to use this chunk:** this is the single review surface. Every `> Confirm:` and `> TODO:` marker placed anywhere in the LLD has a row here pointing to its location (from-sdd: no drift markers). Reviewers should:
>
> 1. Open this file first.
> 2. Walk the tables in order: TODO (low-confidence), then Confirm (medium-confidence), then Decisions Pending.
> 3. Edit the source chunk to resolve each row; decisions that belong upstream go to the SDD or BRD, never only here.
> 4. Re-run `/lld-unifier` to refresh this index.

---

## 18.1 Drift Markers (hybrid mode only)

| Location | Marker | Summary | Severity | Recommended resolution | Why | Status |
|----------|--------|---------|----------|------------------------|-----|--------|
| - | - | Not applicable: from-sdd LLD, no code to compare | - | - | - | - |

## 18.2 Low-Confidence Inferences (TODO)

| Location | Best-guess content | Source / Reason | Status |
|----------|--------------------|----|--------|
| `03-architecture.md` § 6.2 | 2 replicas minimum; max 6 (core, notification), 3 (payout) | from-sdd: SDD §11.3 sizing open | Open |
| `03-architecture.md` § 6.3 | Maven build; other versions unpinned | from-sdd: SDD §6 pins open | Open |
| `04-implementation/loyalty-service.md` § 7.2 | API-06 as a JSON batch push `POST /v1/partners/{partnerKey}/member-purchases` with HMAC | from-sdd: API-06 TBD - external | Open |
| `04-implementation/loyalty-service.md` § LOYALTY/UC-02 | Partial take-back = whole EUR of the paid amount, capped at points held | from-sdd: SDD §17.4, R-04 open | Open |
| `04-implementation/notification-service.md` § 7.3 | Message retries: 8 attempts, jitter 1 min to 1 h | from-sdd: SDD INT-02 open | Open |
| `04-implementation/notification-service.md` § 7.3 | Several branch managers per row: one multi-recipient call, else per-manager keys | from-sdd: API-04 TBD - external | Open |
| `04-implementation/payout-service.md` § 7.2 | API-03 as a JSON callback `POST /v1/partners/{partnerKey}/payout-results` with HMAC | from-sdd: API-03 TBD - external | Open |
| `04-implementation/payout-service.md` § 7.3 (`receive`) | `dedup_key` = CardPay event id, else hash of ref, outcome, echoed reference | from-sdd: API-03 fields TBD | Open |
| `04-implementation/payout-service.md` § 7.3 (`BackoffPolicy`) | Base 1 min, cap 2 h (about 19 attempts in 24 h) | from-sdd: SDD INT-01 open | Open |
| `04-implementation/payout-service.md` § Workflow: Provider reconciliation | Daily CardPay report over API-02's host | from-sdd: report TBD - external | Open |
| `04-implementation/refund-service.md` § 7.3 (`findRefundableItems`) | Not-found alert via a per-customer daily counter table and a burst metric | from-sdd: SDD §17.1 names the alert, not its mechanism | Open |
| `04-implementation/refund-service.md` § Workflow: Daily branch refund report | Day semantics per figure (submission, payment, decision day) | from-sdd: REFUNDS 09 and SDD §17.1 silent | Open |
| `05-data-model.md` § 8.6 | Inbox and send-log cleanup at topic retention + 7 days (7 + 7) | from-sdd: topic retention open | Open |
| `06-api-contracts.md` § 9.1 | Adapters coded against ports with provisional stubs | from-sdd: all six contracts TBD - external | Open |
| `06-api-contracts.md` § 9.2 | Reference number `RF` + 8 digits | from-sdd: format not specified | Open |
| `07-event-contracts.md` § 10.1 | 6 partitions per topic, 1 per DLQ; 7 and 30 days retention | from-sdd: SDD §6 open | Open |
| `07-event-contracts.md` § 10.4 | Consumer retries: 3, 1 s doubling | from-sdd: not pinned | Open |
| `08-state-and-rules.md` § 11.3 | Floor rounding; non-EUR purchases refused | from-sdd: SDD §17.4, A-8 open | Open |
| `09-cross-cutting.md` § 12.3 | Every timeout and bulkhead size | from-sdd: SDD §12 timeouts open | Open |
| `09-cross-cutting.md` § 12.6 | `problem-base-uri` = `https://problems.<platform-domain>/refunds-platform` | from-sdd: not named | Open |
| `09-cross-cutting.md` § 12.9 | Mounted secrets read with `configtree:` | from-sdd: secrets manager open | Open |
| `10-operations.md` § 13.6 | Dashboard tool and URLs | from-sdd: observability products open | Open |
| `10-operations.md` § 13.7 | Consumer-lag thresholds 100 (loyalty) and 500 | from-sdd: SDD §18 open | Open |
| `10-operations.md` § 13.8 | Skeleton runbook commands and placeholders | from-sdd: SDD §20 templates | Open |
| `11-security.md` § 14.3 | Rotation 90 days (credentials), 30 days (cursor key) | from-sdd: SDD §11.6 open | Open |
| `11-security.md` § 14.5 | Threat model to be written (STRIDE) | from-sdd: SDD §21 open | Open |
| `12-performance.md` § 15.1 | p95 below 300 ms reads, 800 ms POS-backed writes | from-sdd: SDD §18.2 open | Open |
| `12-performance.md` § 15.4 | Pool and batch sizes | from-sdd: sizing open | Open |
| `12-performance.md` § 15.5 | Peak multipliers for CardPay recovery and POS catch-up | from-sdd: SDD §18.3 open | Open |
| `14-frontend.md` § 17.5 | Neutral `--brand-primary` token until the key color is chosen | from-sdd: SDD §6 key color open | Open |
| `17-specs.md` § 2 | Kafka, Keycloak, registry versions to be pinned | from-sdd: SDD §6 pins open | Open |

## 18.3 Medium-Confidence Inferences (Confirm)

| Location | Inferred content | Source / Reason | Status |
|----------|------------------|----|--------|
| `01-purpose-and-scope.md` § 3 | A-L01 to A-L03, A-L06 (monorepo, JDBC, static tenant config, shorter window below Prod) | from-sdd: LLD choices | Open |
| `03-architecture.md` § 6.4 | Architecture-test tool (ArchUnit or Spring Modulith) | from-sdd: new dependency | Open |
| `04-implementation/loyalty-service.md` § 7.2 | Class and port names | from-sdd: CLAUDE.md naming default | Open |
| `04-implementation/loyalty-service.md` § 7.3 (`getBalance`) | `member_id` claim = member number | from-sdd: SDD A-5 open | Open |
| `04-implementation/loyalty-service.md` § 7.3 (`onRefundPaid`) | Per-purchase advisory lock against the earn/take-back race | from-sdd: concurrency rule not in SDD | Open |
| `04-implementation/notification-service.md` § 7.2 | Class and port names | from-sdd: CLAUDE.md naming default | Open |
| `04-implementation/notification-service.md` § 7.3 | Duplicate message after a crash unless MsgHub honours the key | from-sdd: API-04 idempotency TBD | Open |
| `04-implementation/notification-service.md` § 7.4 (Strategy) | Recipient-resolution Strategy | from-sdd: CLAUDE.md guideline pattern | Open |
| `04-implementation/payout-service.md` § 7.2 | Class and port names | from-sdd: CLAUDE.md naming default | Open |
| `04-implementation/payout-service.md` § 7.3 (`receive`) | Foreign-tenant payout ids stay UNMATCHED (no cross-tenant read) | from-sdd: reading of ADR-11 | Open |
| `04-implementation/payout-service.md` § 7.4 (Strategy) | In-doubt resolution Strategy, default `RESEND` | from-sdd: CLAUDE.md guideline pattern | Open |
| `04-implementation/payout-service.md` § 7.4 (RFC 9457) | API-03 error envelope may follow CardPay | from-sdd: SDD §17.2 API Standards | Open |
| `04-implementation/payout-service.md` § 7.6 | Transaction defaults; `recordOutcome` row lock | from-sdd: default propagation applied | Open |
| `04-implementation/refund-service.md` § 7.2 (Controllers) | `GET /v1/refund-requests/{refundId}` tagged REFUNDS/UC-02 only | from-sdd: SDD §7.3 omission (SDD reviewer note) | Open |
| `04-implementation/refund-service.md` § 7.2 | Class and port names | from-sdd: CLAUDE.md naming default | Open |
| `04-implementation/refund-service.md` § 7.3 (`findRefundableItems`) | Lookup response carries `lineId` | from-sdd: SDD response list omits it | Open |
| `04-implementation/refund-service.md` § 7.3 (`decide`) | REFUNDS/TC-DEC-02 enforced on the UI partial field; API accepts equal as full | from-sdd: BRD and SDD inconsistency | Open |
| `04-implementation/refund-service.md` § 7.3 (`onPayoutSucceeded`) | Report "amounts paid" from `approved_amount`; mismatch alerted | from-sdd: no paid-amount column | Open |
| `04-implementation/refund-service.md` § 7.6 | 4xx outcomes stored as COMPLETED idempotency records | from-sdd: SDD §11.1 states only 5xx | Open |
| `04-implementation/refund-service.md` § Workflow: Daily branch refund report | No BRD use case or screen; no `use_case` | from-sdd: upstream gap | Open |
| `04-implementation/refund-service.md` § Workflow: Payout watchdog | Cron `0 15 3 * * *` UTC | from-sdd: SDD says "daily" | Open |
| `04-implementation/refund-service.md` § Cross-service Saga | SAGA-01 has no compensating transactions | from-sdd: CLAUDE.md asks for compensation per step | Open |
| `05-data-model.md` § 8.4 | Composite primary keys (`tenant_id`, `id`) | from-sdd: CLAUDE.md index rule vs SDD ERDs | Open |
| `05-data-model.md` § 8.5 | Both core schema migrations at startup | from-sdd: LLD choice | Open |
| `06-api-contracts.md` § 9 | OpenAPI file paths and CI spec check tool | from-sdd: SDD §21 open | Open |
| `06-api-contracts.md` § 9.2 | DTO fields beyond the SDD's | from-sdd: shapes not pinned | Open |
| `06-api-contracts.md` § 9.4 | No sorting, bulk actions, or export in `v1` | from-sdd: CLAUDE.md table defaults vs BRD scope | Open |
| `07-event-contracts.md` § 10.2 | One registry subject per event type | from-sdd: registry product open | Open |
| `07-event-contracts.md` § 10.4 | State-based transition validation instead of a version store | from-sdd: reading of SDD §14.6 item 3 | Open |
| `07-event-contracts.md` § 10.5 | DLQ redrive via a stopped listener and an actuator endpoint | from-sdd: SDD §20.1.3 template | Open |
| `09-cross-cutting.md` § 12.2 | `Idempotent-Replayed` header | from-sdd: LLD addition | Open |
| `09-cross-cutting.md` § 12.4 | Transaction-level advisory lock per relay cycle | from-sdd: reading of SDD §11.3 | Open |
| `09-cross-cutting.md` § 12.8 | `use_case` attribute convention | from-sdd: not settled by SDD §11.4 | Open |
| `09-cross-cutting.md` § 12.8 | No `use_case` on event consumers and jobs (§7.3 lists REST only) | from-sdd: upstream gap | Open |
| `11-security.md` § 14.4 | Actuator on a management port only | from-sdd: admin access not described | Open |
| `11-security.md` § 14.6 | Compliance decisions pending | from-sdd: SDD Compliance open | Open |
| `13-testing.md` § 16.4 | Contract-test and stub tools | from-sdd: new dependency | Open |
| `13-testing.md` § 16.5 | Accessibility checker | from-sdd: new dependency | Open |
| `14-frontend.md` § 17.2 | Hand-written typed API services | from-sdd: avoid a generator dependency | Open |
| `14-frontend.md` § 17.3 | Route paths and components | from-sdd: LLD design choice | Open |
| `14-frontend.md` § 17.3 | `/manager/reports/daily` recorded as a platform page | from-sdd: upstream gap (no BRD screen or UC) | Open |
| `14-frontend.md` § 17.3 | RUM backend and SDK | from-sdd: not pinned | Open |
| `14-frontend.md` § 17.5 | Tenant configuration as a static per-environment file | from-sdd: no SDD endpoint | Open |
| `14-frontend.md` § 17.6 | Build-time `@angular/localize`, one deployment per locale | from-sdd: LLD choice | Open |

## 18.4 Decisions Pending

| ID | Decision needed | Recommended option | Why | Stakeholder | Blocking? | Target date |
|----|-----------------|--------------------|-----|-------------|-----------|-------------|
| OQ-01 | How is "50.00 of 50.00 refused as a partial amount" (REFUNDS/TC-DEC-02, SDD test name) reconciled with "equal amount = full approval" (SDD §17.1)? | Keep the API contract; enforce the partial range on the decision screen's partial field; the SDD owner decides whether `RefundDecision` gains a partial flag | Satisfies the UAT case without changing an SDD contract from the LLD; the tradeoff is that the API alone does not refuse an equal "partial" amount | REFUNDS owner, SDD owner | No (P3) | Before P3 build |
| OQ-02 | Should SDD §7.3 list the event entry points (`Event: REFUND_APPROVED` for payout-service, `Event: PAYOUT_SUCCEEDED` and `Event: PAYOUT_FAILED` for refund-service, `Event: REFUND_PAID` for LOYALTY/UC-02) and add `GET /v1/refund-requests/{refundId}` under REFUNDS/UC-04? | Yes: update §7.3 through sdd-unifier, then refresh the trace so those listeners carry `@UseCase` | Production bugs of REFUNDS/UC-04 E1 and LOYALTY/NFR-02 surface in consumers, which today have no `use_case`; the tradeoff is one SDD revision | SDD owner | No | Before P3 build |
| OQ-03 | Which BRD use case and screen cover the daily branch refund report (REFUNDS 09)? | The REFUNDS owner adds a screen ID (and a use case if wanted) through brd-unifier; the LLD keeps the route as a platform page until then | IDs belong to the BRD and are never created by the LLD; the tradeoff is an untraced report page for now | REFUNDS owner | No | Before P3 build |
| OQ-04 | What does the `member_id` claim hold, and how is a customer linked to a member (SDD A-5)? | The claim holds the loyalty member number; the link flow is decided by the LOYALTY owner | Members are created from POS purchases by member number, so the number is the only key known on both sides; the tradeoff is that re-numbering a member needs a Keycloak update | LOYALTY owner, SDD owner | Yes (P4) | Before P4 build |
| OQ-05 | How many points does a partial refund take back, and how are fractional EUR rounded (SDD §17.4, R-04)? | The SDD proposal: whole EUR of the paid amount, capped at the points still held from that purchase | Never takes back more than was earned and matches a full refund exactly; the tradeoff is that fractional EUR are lost to the member | LOYALTY owner | Yes (P4) | Before P4 build |
| OQ-06 | When do the six provider contracts arrive (SDD §15.6)? | Obtain all six documents before SIT; build adapters behind ports with provisional stubs until then | Every adapter, the API-03 and API-06 paths, and the CardPay idempotency guarantee depend on them; the tradeoff is stub rework | Product, provider owners | Yes (SIT) | Before SIT |
| OQ-07 | Adopt composite primary keys (`tenant_id`, `id`) platform-wide? | Yes, and update the SDD ERDs to match | Makes the CLAUDE.md "every index includes tenant_id" rule hold without exception; the tradeoff is composite foreign keys | SDD owner, tech lead | No | Before P1 build |
| OQ-08 | Which versions pin Kafka, the schema registry, Keycloak, the gateway, and the build tool? | The platform team pins them in SDD §6; this LLD and `17-specs.md` follow | Version pins have one home (SDD §6); the tradeoff is a short wait before scaffolding | Platform team | Yes (P1) | Before P1 build |
| OQ-09 | What are the latency and RPS targets of SDD §18.2? | Agree them before the load test and record them in SDD §18.2 | Pool, bulkhead, and index choices cannot be verified without them | Product, SRE | No | Before load test |
| OQ-10 | When is LOYALTY BRD chunk 16 written? | Complete LOYALTY BRD steps 3 to 5 and generate chunk 16, then refresh the trace | The LOYALTY traceability lines and specs carry `Pending (BRD 16 not written)` until then | LOYALTY owner | No | Before P4 UAT |
| OQ-11 | What is the brand key color? | The product owner names it; tokens take it from tenant configuration | CLAUDE.md asks for it before UI work; the tradeoff is a placeholder theme until then | Product owner | No | Before P1 UI build |

## 18.5 Inference Confidence Summary

High-confidence rows are a proxy: the table rows of each chunk, header rows included (flags sit outside tables); medium and low are the `> Confirm:` and `> TODO:` flags of the chunk.

| Section | High-confidence rows | Medium-confidence rows | Low-confidence rows |
|---------|---------------------|------------------------|---------------------|
| 7. Implementation (per service) | 279 | 20 | 10 |
| 8. Data Model | 51 | 2 | 1 |
| 9. API Contracts | 28 | 3 | 2 |
| 10. Event Contracts | 24 | 3 | 2 |
| 11. State & Rules | 26 | 0 | 1 |
| 12. Cross-Cutting | 50 | 4 | 3 |
| 13. Operations | 58 | 0 | 3 |
| 14. Security | 52 | 2 | 2 |
| 15. Performance | 32 | 0 | 3 |
| 16. Testing | 21 | 2 | 0 |
| 17. Frontend | 37 | 6 | 1 |
| Other (01, 03, 17) | - | 2 | 3 |

> **Convention:** these counts are updated whenever a chunk is regenerated. Totals: 44 `> Confirm:`, 31 `> TODO:`.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 14-frontend.md | NEXT: 16-references.md -->
