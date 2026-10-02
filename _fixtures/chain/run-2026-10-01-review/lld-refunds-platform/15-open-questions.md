<!--
CHUNK: 15
TITLE: Open Questions, Drift Index, Confidence Flags
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 18. Open Questions & Flag Index

> **How to use this chunk:** this is the single review surface. Every `> Confirm:`, `> TODO:`, `⚠ drift`, `🆕 code-only`, `⛔ sdd-only`, and `⚠ policy` marker placed anywhere in the LLD has a row here pointing to its location. Reviewers should:
>
> 1. Open this file first.
> 2. Walk the tables in order: Drift and Policy Findings first (action items), then TODO (low-confidence), then Confirm (medium-confidence).
> 3. Edit the source chunk to resolve each row.
> 4. Ask lld-unifier to regenerate the changed chunks (SKILL.md step 9); this index is regenerated with them.

Totals: 21 `> TODO:` (§ 18.2), 40 `> Confirm:` (§ 18.3), 0 drift markers, 0 policy findings. Regenerated for LLD v1.1 (refresh to SDD v1.2 and LOYALTY v1.2): the 8 `> TODO:` and 2 `> Confirm:` flags the refreshed upstream settled are kept below as `Replaced` rows, with where they were.

---

## 18.1 Drift Markers (hybrid mode only)

Not applicable - from-sdd direction: no code was read, so there are no `⚠ drift`, `🆕 code-only`, or `⛔ sdd-only` markers.

> **Severity guide:**
> - **High:** affects security, data integrity, or contract surface.
> - **Medium:** affects observability, performance, or cross-team integration.
> - **Low:** naming, documentation, or non-load-bearing detail.

## 18.2 Low-Confidence Inferences (TODO)

| Location | Best-guess content | Source / Reason | Status |
|----------|--------------------|----|--------|
| `03-architecture.md` § 6.2 | Replicas core 2-6, payout 2-3, notification 2-3, web 2-4; resource requests open | from-sdd: SDD §11.3 NEEDS CLARIFICATION | Open |
| `03-architecture.md` § 6.3 | No version pins for Kafka, registry, Keycloak, gateway, observability, containerd, Kubernetes; no build tool | from-sdd: SDD §6 NEEDS CLARIFICATION | Open |
| `04-implementation/loyalty-service.md` § 7.4 Pattern: Resilience4j on API-04 | `PosPurchaseHttpAdapter` stays a stub; cursor or push (R-05) and the receipt number with each purchase (R-03) unconfirmed | from-sdd: API-04 `TBD - external` | Open |
| `04-implementation/notification-service.md` § 7.3 `send` | Missing template -> `FAILED` `TEMPLATE_MISSING` + alert | from-sdd: SDD §17.3 silent | Open |
| `04-implementation/notification-service.md` § 7.4 Pattern: Resilience4j on API-03 | `MsgHubAdapter` stays a stub | from-sdd: API-03 `TBD - external` | Open |
| `04-implementation/payout-service.md` § 7.4 Pattern: Resilience4j on API-02 | `CardPayPayoutAdapter` stays a stub; the receipt number goes as the original-payment reference (SDD §17.2) until CardPay confirms what it needs | from-sdd: API-02 `TBD - external` | Open |
| `04-implementation/refund-service.md` § 7.3 `submit` | No `email` and no `phone_number` claim -> 422 `BUSINESS_RULE_VIOLATION` | from-sdd: SDD silent on a contact-less token | Open |
| `04-implementation/refund-service.md` § 7.4 Pattern: Resilience4j on API-01 | `PosReceiptHttpAdapter` stays a stub | from-sdd: API-01 `TBD - external` | Open |
| `06-api-contracts.md` § 9.1 | API-01 to API-04 method, URI, auth, bodies, errors open | from-sdd: SDD §15.6 `TBD - external` | Open |
| `07-event-contracts.md` § 10.1 | 6 partitions per topic, 1 per DLQ; 7-day retention (payout DLQ 30 days) | from-sdd: SDD §6 retention NEEDS CLARIFICATION | Open |
| `08-state-and-rules.md` § 11.3 Payout retry schedule | First delay 1 minute, max 1 hour; ±10% jitter on the post-window interval | from-sdd: SDD §12 INT-01 NEEDS CLARIFICATION; SDD §17.2 gives no jitter size | Open |
| `09-cross-cutting.md` § 12.3 | All timeouts, retries, attempt limits, breaker thresholds | from-sdd: SDD §12 NEEDS CLARIFICATION; rate limits `TBD - external` | Open |
| `09-cross-cutting.md` § 12.8 | Sampling 100% Dev/SIT, 10% UAT/Prod | from-sdd: SDD §6 NEEDS CLARIFICATION | Open |
| `10-operations.md` § 13.6 | Dashboard URLs not created | from-sdd: no environment yet | Open |
| `10-operations.md` § 13.8 | Runbook commands use placeholder names | from-sdd: SDD §19 DNS and §20.1 NEEDS CLARIFICATION | Open |
| `10-operations.md` § 13.9 | On-call rota, escalation, paging, chat tool open | from-sdd: SDD §20.3 NEEDS CLARIFICATION | Open |
| `11-security.md` § 14.3 | Secrets manager product, rotation cadences, certificates | from-sdd: SDD §6, §11.6 NEEDS CLARIFICATION | Open |
| `11-security.md` § 14.5 | Full threat model missing | from-sdd: SDD §21 NEEDS CLARIFICATION | Open |
| `12-performance.md` § 15.1 | RPS and latency targets per endpoint group | from-sdd: SDD §18.2 NEEDS CLARIFICATION | Open |
| `12-performance.md` § 15.6 | k6 as the load-testing tool | from-sdd: SDD §18.4 NEEDS CLARIFICATION | Open |
| `14-frontend.md` § 17.5 | Neutral placeholder palette; no brand colour | from-sdd: SDD §6 NEEDS CLARIFICATION; CLAUDE.md asks for the key colour | Open |
| `04-implementation/loyalty-service.md` § 7.3 `handleRefundPaid` (v1.0) | Purchase reference equals receipt number; whole purchase points taken back | Settled by SDD v1.2 §17.4 Take points back (receipt-number match key) and LOYALTY/UC-02 BR-3: 1 point per whole euro refunded, never more than the purchase earned | Replaced |
| `04-implementation/loyalty-service.md` § 7.3 `PointsCalculator.earn` (v1.0) | Round down to whole points | Settled by LOYALTY 03 Earning and SDD v1.2 §17.4 Earn points | Replaced |
| `04-implementation/payout-service.md` § 7.3 `claimNextDue` / `send` (v1.0) | Circuit-open time counts against the retry window | Settled by SDD v1.2 §17.2 Constraints (24 hours from the first attempt), Tables Design (an open-circuit call is an `ERROR` attempt), and After the retry window | Replaced |
| `04-implementation/refund-service.md` § 7.4 Pattern: Saga (v1.0) | No compensation after a `FAILED` payout | Settled by SDD v1.2 §17.2 After the retry window: retried at the post-window interval until paid | Replaced |
| `04-implementation/refund-service.md` § REFUNDS/UC-04 (v1.0) | Branch manager told only in the portal | Settled by SDD v1.2 §17.1 Payout outcome (portal only) | Replaced |
| `05-data-model.md` § 8.6 (v1.0) | Retention open for refund, payout, delivery-log, and post-membership records; 90 days for import rejections | Settled by SDD v1.2 §17.1 to §17.4 Retention Policy and the §11.2 retention settings | Replaced |
| `07-event-contracts.md` § 10.4 (v1.0) | 3 consumer retries (1 s, 2 s, 4 s) before the DLQ | Settled by SDD v1.2 §14.6 rule 4 | Replaced |
| `07-event-contracts.md` § 10.6 (v1.0) | Unlimited replay every minute; alert on age, not attempts | Settled by SDD v1.2 §11.1 (every 5 minutes) and §17.4 Error Handling | Replaced |

## 18.3 Medium-Confidence Inferences (Confirm)

| Location | Inferred content | Source / Reason | Status |
|----------|------------------|----|--------|
| `01-purpose-and-scope.md` § 2.2 | Gateway and realm configuration out of the implementation files | from-sdd: scope choice (not SDD §13 rows) | Open |
| `03-architecture.md` § 6.1 | Build modules `core-contracts`, `core-eventing`, `core-refund`, `core-loyalty`, `core-app` | from-sdd: ADR-01 build rule realised without ArchUnit | Open |
| `03-architecture.md` § 6.3 | Resilience4j as the resilience library | from-sdd: CLAUDE.md default applied (SDD §6 silent) | Open |
| `04-implementation/loyalty-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming convention | Open |
| `04-implementation/loyalty-service.md` § 7.3 `runImport` | One transaction per API-04 page; receipt locks of a page taken first, sorted; `refund_reference` stored on `refund_takeback` (a column the SDD table does not list) | from-sdd: reading of SDD §17.4 | Open |
| `04-implementation/loyalty-service.md` § 7.3 `PointsCalculator.earn` | Whole-number earn rate; a fractional rate fails at start | from-sdd: SDD §11.2 and §17.4 state the rate, not the rounding of a fractional one | Open |
| `04-implementation/loyalty-service.md` § 7.4 Pattern: RFC 9457 error model | 503 `UNAVAILABLE` on the member endpoints only, through a controller-scoped advice | from-sdd: SDD §17.4 and §17.1 Error Handling differ | Open |
| `04-implementation/loyalty-service.md` § 7.6 | Transaction defaults; receipt lock before any balance row | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/notification-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming convention | Open |
| `04-implementation/notification-service.md` § 7.4 Pattern: Strategy | `MessageContentMapper` per event type | from-sdd: CLAUDE.md guideline pattern | Open |
| `04-implementation/notification-service.md` § 7.6 | Transaction defaults | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/payout-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming convention | Open |
| `04-implementation/payout-service.md` § 7.3 `settle` | A held payout is never re-sent and writes no `PAYOUT_FAILED` while held | from-sdd: reading of SDD §17.2 "held and alerted" | Open |
| `04-implementation/payout-service.md` § 7.4 Pattern: Strategy | `ResendGuard` selected by configuration | from-sdd: CLAUDE.md guideline pattern | Open |
| `04-implementation/payout-service.md` § 7.6 | Separate claim and settle transactions | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/refund-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming convention | Open |
| `04-implementation/refund-service.md` § 7.3 `applyPayoutSucceeded` | Amount mismatch dead-lettered | from-sdd: LLD guard for REFUNDS/NFR-01 | Open |
| `04-implementation/refund-service.md` § 7.6 | Transaction defaults; `SUPPORTS` lookup; per-row watchdog transactions | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/refund-service.md` § Workflow: Daily branch refund report | No use case, no `@UseCase`, no BRD screen | from-sdd: behaviour no BRD use case covers (REFUNDS 09) | Open |
| `04-implementation/refund-service.md` § Workflow: Refund record retention and contact erasure | Operations jobs launched as one-off Kubernetes Jobs of the core image | from-sdd: SDD §17.1, §17.4 name the jobs, not the launch | Open |
| `05-data-model.md` § 8.2 | Columns, types, lengths, and indexes marked `LLD` | from-sdd: completion of the SDD Tables Design | Open |
| `05-data-model.md` § 8.4 | Database roles, the `app.tenant_id` aspect, worker work tables; `role_permission` without `tenant_id` | from-sdd: implementation of SDD §11.2; exception to ADR-03 | Open |
| `05-data-model.md` § 8.6 | Purge job names, daily schedule, batch size | from-sdd: SDD retention rules name no job | Open |
| `07-event-contracts.md` § 10.2 | Subject naming, envelope casing, `event_type` header | from-sdd: transport conventions not in SDD §14.3 | Open |
| `07-event-contracts.md` § 10.6 | Hand-rolled `event_publication` instead of Spring Modulith | from-sdd: CLAUDE.md no new dependency; SDD §11.2 `tenant_id` | Open |
| `08-state-and-rules.md` § 11.3 Daily branch report | "Requests per status" = status changes that day | from-sdd: REFUNDS 09 and SDD §17.1 ambiguous | Open |
| `09-cross-cutting.md` § 12.1 | Gateway rate-limit store (Redis not in SDD §6) | from-sdd: implementation gap in SDD §6 | Open |
| `09-cross-cutting.md` § 12.2 | Idempotency store scope, TTL, no in-flight state | from-sdd: item left to the LLD by the SDD (§17.1 Tables Design) | Open |
| `09-cross-cutting.md` § 12.6 | `TYPE_BASE` placeholder URI | from-sdd: SDD §15.1 fixes codes, not type URIs | Open |
| `09-cross-cutting.md` § 12.8 | `use_case` attribute convention | from-sdd: LLD convention (SDD §11.4 silent) | Open |
| `09-cross-cutting.md` § 12.8 | No `use_case` on listeners and jobs (SDD §7.3 lists REST only) | from-sdd: upstream gap, OQ-02 | Open |
| `11-security.md` § 14.2 | PII inventory complete | from-sdd: template flag | Open |
| `11-security.md` § 14.6 | Compliance applicability | from-sdd: template flag (SDD Compliance now states basis, erasure, and certifications) | Open |
| `12-performance.md` § 15.1 | SLO targets | from-sdd: SDD §18.2 service-level only | Open |
| `13-testing.md` § 16.4 | Provider contract test tool (new dependency) | from-sdd: AP-11 without a tool | Open |
| `13-testing.md` § 16.8 | REFUNDS/TC-DEC-04 automated with a 2-minute window in e2e only | from-sdd: test design | Open |
| `13-testing.md` § 16.8 | LOYALTY P5, P6, P8 staged with e2e stubs and request interception; one-hour waits with a shortened import cron | from-sdd: test design; SDD §19 staging NEEDS CLARIFICATION | Open |
| `14-frontend.md` § 17.3 | Route paths; REFUNDS/MK-03 on the queue route | from-sdd: route-to-screen choice (confidence rules: Medium) | Open |
| `14-frontend.md` § 17.3 | OIDC client and browser telemetry libraries (new dependencies) | from-sdd: CLAUDE.md asks before adding | Open |
| `14-frontend.md` § 17.4 | Datatable export limited to the loaded page | from-sdd: no SDD export endpoint | Open |
| `04-implementation/notification-service.md` § 7.3 `claimNextDue` (v1.0) | Lease on `next_attempt_at` instead of a `SENDING` state | Settled by SDD v1.2 §17.3 Tables Design (`claimed_until`) | Replaced |
| `06-api-contracts.md` § 9.2 (v1.0) | Request and response record fields | Settled by SDD v1.2 §17.1 and §17.4 List of APIs (DTO business fields) | Replaced |

## 18.4 Decisions Pending

| ID | Decision needed | Recommended option | Why | Stakeholder | Blocking? | Target date |
|----|-----------------|--------------------|-----|-------------|-----------|-------------|
| OQ-02 | Add `Event:` and `Schedule:` entry points to SDD §7.3 (payout, notification, take-back listeners; watchdog; import) | Add them in the next SDD version, so their spans and logs carry `use_case` | Production bugs in the async half of REFUNDS/UC-04 and LOYALTY/UC-02 become traceable by use case; the tradeoff is one SDD revision and an LLD trace refresh | Architect (sdd-unifier) | No | Next SDD version |
| OQ-05 | Store behind the gateway's per-user rate limit | Per-replica in-memory counters with the limit divided by the gateway replica count | The limit is an abuse brake, not a quota, and AP-12 adds no component until a driver needs it; the tradeoff is approximate enforcement | Platform team | No | Before SIT |
| OQ-06 | Hand-rolled publication log or Spring Modulith | Hand-rolled `core_events.event_publication` (07 § 10.6) | Meets SDD §11.2 (`tenant_id`, RLS) with no new dependency; the tradeoff is about 200 lines of eventing code to own | Architect | No | Before build of the core |
| OQ-08 | A customer token with no email and no mobile number | Require an email at Keycloak self-registration, keep the 422 guard | Every refund then has a contact point for the SDD §14.9.0 `ContactPoint`; the tradeoff is one mandatory registration field | REFUNDS owner, platform team | No | Before SIT |

Settled by the v1.1 refresh and removed from this table (IDs not reused): OQ-01 (what follows a `FAILED` payout: SDD v1.2 §17.2 After the retry window), OQ-03 (the take-back match and amount: SDD v1.2 §17.4 Take points back and LOYALTY/UC-02 BR-3: 1 point per whole euro refunded, never more than the purchase earned), OQ-04 (rounding of cents: LOYALTY 03 Earning), and OQ-07 (how the branch manager is told: SDD v1.2 §17.1 Payout outcome, portal only).

## 18.5 Inference Confidence Summary

Unit: one table, pseudocode block, diagram, or workflow block. High = carried from the SDD or a CLAUDE.md hard rule with no flag. Medium and low count the open `> Confirm:` and `> TODO:` flags of the section.

| Section | High-confidence rows | Medium-confidence rows | Low-confidence rows |
|---------|---------------------|------------------------|---------------------|
| 7. Implementation (per service) | 126 | 17 | 6 |
| 8. Data Model | 10 | 3 | 0 |
| 9. API Contracts | 7 | 0 | 1 |
| 10. Event Contracts | 8 | 2 | 1 |
| 11. State & Rules | 10 | 1 | 1 |
| 12. Cross-Cutting | 11 | 5 | 2 |
| 13. Operations | 10 | 0 | 3 |
| 14. Security | 4 | 2 | 2 |
| 15. Performance | 4 | 1 | 2 |
| 16. Testing | 8 | 3 | 0 |
| 17. Frontend | 8 | 3 | 1 |

> **Convention:** these counts are updated whenever a chunk is regenerated.

## 18.6 Policy Findings (every mode that reads code)

Not applicable - from-sdd direction: no code was read, so there is no `⚠ policy` finding.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 14-frontend.md | NEXT: 16-references.md -->
