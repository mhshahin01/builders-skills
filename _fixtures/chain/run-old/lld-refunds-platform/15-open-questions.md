<!--
CHUNK: 15
TITLE: Open Questions, Drift Index, Confidence Flags
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 18. Open Questions & Flag Index

> **How to use this chunk:** this is the single review surface. Every `> Confirm:` and `> TODO:` marker placed anywhere in the LLD has a row here pointing to its location (80 flags: 31 Confirm, 49 TODO). Reviewers should:
>
> 1. Open this file first.
> 2. Walk the tables in order - Drift first (action items), then TODO (low-confidence), then Confirm (medium-confidence).
> 3. Edit the source chunk to resolve each row.
> 4. Re-run `/lld-unifier` (with `--regenerate` if needed) to refresh this index.

---

## 18.1 Drift Markers (hybrid mode only)

<!-- Every row carries the author's recommended reconciliation AND the reason behind it - never a bare "Pending". -->

| Location | Marker | Summary | Severity | Recommended resolution | Why | Status |
|----------|--------|---------|----------|------------------------|-----|--------|
| - | None | Not applicable: this LLD is from-sdd (no code exists), so no drift, code-only, or sdd-only markers are emitted | - | - | - | - |

> **Severity guide:**
> - **High:** affects security, data integrity, or contract surface.
> - **Medium:** affects observability, performance, or cross-team integration.
> - **Low:** naming, documentation, or non-load-bearing detail.

## 18.2 Low-Confidence Inferences (TODO)

| Location | Best-guess content | Source / Reason | Status |
|----------|--------------------|-----------------|--------|
| `01-purpose-and-scope.md` § 3 | LA-02: the `member_id` claim is the loyalty member number | from-sdd: SDD A-5 open | Open |
| `02-context.md` § 5.5 | In-house UUIDv7 generator behind `IdGenerator` | from-sdd: Java 21 has no version-7 factory; a library needs approval | Open |
| `03-architecture.md` § 6.2 | One namespace per environment; replicas core 2/6, payout 2/3, notification 2/6 | from-sdd: SDD §11.3 and §19 leave sizing open | Open |
| `03-architecture.md` § 6.2 | Consumer-lag autoscaling needs an external-metrics source | from-sdd: no component named in SDD §6 | Open |
| `03-architecture.md` § 6.3 | Version pins for Kafka, registry, Keycloak, gateway, Flyway, Resilience4j, PrimeNG, Tailwind, build tool | from-sdd: not derivable (SDD §6 open) | Open |
| `03-architecture.md` § 6.4 | Base package and repository layout | from-sdd: not in the SDD | Open |
| `04-implementation/refund-service.md` § 7.3 | No self-decision: 403 when the request's `customer_id` is the manager's subject | from-sdd: segregation of duties not ruled (SDD §16, BRD) | Open |
| `04-implementation/refund-service.md` § 7.3 | `paid_at` = provider `succeededAt`; a paid amount unequal to the approved amount is accepted with an alert | from-sdd: not in SDD §17.1 | Open |
| `04-implementation/refund-service.md` § 7.8 (Report) | The daily report counts status changes during the day, not a day-end snapshot | from-sdd: REFUNDS 09 and SDD §17.1 ambiguous | Open |
| `04-implementation/payout-service.md` § 7.2 | API-03 path `/v1/partners/{partnerKey}/payout-results` | from-sdd: SDD API-03 `TBD - external` | Open |
| `04-implementation/payout-service.md` § 7.2 | `queryStatus` and `listPayouts` on `PayoutProviderPort` as stubs | from-sdd: CardPay capabilities `TBD - external` | Open |
| `04-implementation/payout-service.md` § 7.3 | A final status query before `PAYOUT_FAILED` when the last attempt is in doubt | from-sdd: depends on API-02 | Open |
| `04-implementation/payout-service.md` § 7.3 | A non-final API-02 response waits for the result, then queries status | from-sdd: depends on API-02 | Open |
| `04-implementation/payout-service.md` § 7.8 | `dedup_key` = CardPay result id, else SHA-256 of the verified body | from-sdd: depends on API-03 | Open |
| `04-implementation/notification-service.md` § 7.3 | One MsgHub email per `REFUND_PAYOUT_FAILED` row, to all managers of the branch | from-sdd: API-04 `TBD - external` | Open |
| `04-implementation/loyalty-service.md` § 7.2 | API-06 path `/v1/partners/{partnerKey}/member-purchases` | from-sdd: SDD API-06 `TBD - external` | Open |
| `04-implementation/loyalty-service.md` § 7.3 | Partial take-back = whole EUR of the paid amount, capped; earn = floor of EUR | from-sdd: SDD §17.4 proposal; R-04 open | Open |
| `04-implementation/loyalty-service.md` § 7.3 | Non-EUR purchases earn and take back 0 points | from-sdd: LOYALTY glossary rate is per EUR | Open |
| `05-data-model.md` § 8.6 | Retention periods of business records and topic retention | from-sdd: not derivable (SDD §17.x, §6) | Open |
| `05-data-model.md` § 8.7 | Encryption mechanism, key management, masking method | from-sdd: not derivable (SDD §11.6, §19) | Open |
| `06-api-contracts.md` header | OpenAPI file paths | from-sdd: SDD §21 open | Open |
| `06-api-contracts.md` § 9.1 | Provider fields of API-01 to API-06 | from-sdd: not derivable (SDD §15.6) | Open |
| `06-api-contracts.md` § 9.4 | Cursor `limit` default 20, maximum 100 | from-sdd: not in SDD §17.1 or §17.4 | Open |
| `07-event-contracts.md` § 10.1 | 6 partitions and 14-day retention on event topics; DLQs 1 partition, 30 days | from-sdd: SDD §6 open | Open |
| `07-event-contracts.md` § 10.2 | Registry subject naming, one subject per event type | from-sdd: not derivable (registry product open) | Open |
| `08-state-and-rules.md` § 11.3 | Payout backoff base 1 minute, cap 2 hours | from-sdd: SDD §12 INT-01 open | Open |
| `08-state-and-rules.md` § 11.3 | Reference number `RF-` plus 8 digits | from-sdd: SDD §17.1 fixes only length and uniqueness | Open |
| `09-cross-cutting.md` § 12.1 | Gateway rate limits beyond the receipt lookup; partner allowlists | from-sdd: not derivable (gateway product, providers) | Open |
| `09-cross-cutting.md` § 12.3 | Timeouts, circuit-breaker thresholds, bulkheads, notification backoff (1 min, 30 min, 6 attempts) | from-sdd: SDD §12 INT-01 to INT-04 open | Open |
| `09-cross-cutting.md` § 12.6 | The `problemBase` URI | from-sdd: not derivable | Open |
| `10-operations.md` § 13.4 | Log volume estimates | from-sdd: read traffic open (SDD §18.1) | Open |
| `10-operations.md` § 13.6 | Dashboard URLs and tool | from-sdd: SDD §6 open | Open |
| `10-operations.md` § 13.7 | Per-customer `ReceiptNotFoundBurst` via a WARN log with a keyed hash of the subject | from-sdd: alert need vs no PII at INFO | Open |
| `10-operations.md` § 13.7 | Alert thresholds and paging tool | from-sdd: SDD §11.4 open | Open |
| `10-operations.md` § 13.8 | Concrete runbook commands | from-sdd: no code yet | Open |
| `10-operations.md` § 13.9 | On-call rota, escalation, channel, Helm chart owners | from-sdd: not derivable (SDD §20.3) | Open |
| `11-security.md` § 14.3 | Secrets manager, certificate authority, rotation cadences | from-sdd: not derivable (SDD §6, §11.6) | Open |
| `11-security.md` § 14.5 | Full threat model; staff access-token lifetime | from-sdd: SDD §21 and §16.2 silent | Open |
| `12-performance.md` § 15.1 | Latency targets (reads p95 300 ms; submit and decision p95 800 ms; event-to-send p95 60 s) | from-sdd: SDD §18.2 open | Open |
| `12-performance.md` § 15.4 | DB pool and batch sizes | from-sdd: SDD §11.3 open | Open |
| `12-performance.md` § 15.5 | Peak multipliers of the CardPay recovery and POS catch-up | from-sdd: SDD §18.3 open | Open |
| `12-performance.md` § 15.6 | Load-test tool, environment, cadence, result store | from-sdd: not derivable (SDD §18.4) | Open |
| `13-testing.md` § 16.3 | Kafka test image and HTTP stub server library | from-sdd: new dependency; Kafka version open | Open |
| `13-testing.md` § 16.7 | Coverage threshold, static analysis tool, CI platform | from-sdd: not derivable (SDD §6) | Open |
| `14-frontend.md` § 17.3 | OIDC client library | from-sdd: new dependency | Open |
| `14-frontend.md` § 17.4 | PrimeNG version | from-sdd: SDD §6 open | Open |
| `14-frontend.md` § 17.5 | Brand key color | from-sdd: SDD §6 open; CLAUDE.md asks for it | Open |
| `14-frontend.md` § 17.5 | Tenant branding from a static per-tenant file on the tenant hostname | from-sdd: no source in SDD §6 | Open |
| `17-specs.md` § 2 | Version pins in the Specs Tech Stack | from-sdd: not derivable; the user could not be asked | Open |

## 18.3 Medium-Confidence Inferences (Confirm)

| Location | Inferred content | Source / Reason | Status |
|----------|------------------|-----------------|--------|
| `01-purpose-and-scope.md` § 3 | LA-01, LA-03, LA-05 (tenant configuration home, shared library, per-tenant hostname) | from-sdd: inferred, not stated in the SDD | Open |
| `03-architecture.md` § 6.2 | One datasource, pool, and database role per core module | from-sdd: LLD proposal realising R-07 and ADR-01 | Open |
| `03-architecture.md` § 6.4 | ArchUnit for the ADR-01 architecture tests | from-sdd: new test dependency | Open |
| `04-implementation/refund-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming default applied | Open |
| `04-implementation/refund-service.md` § 7.3 | POS re-read before the transaction; write in a `TransactionTemplate` | from-sdd: LLD design | Open |
| `04-implementation/refund-service.md` § 7.6 | Transaction propagation per method | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/payout-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming default applied | Open |
| `04-implementation/payout-service.md` § 7.3 | A result naming another tenant's payout surfaces as UNMATCHED with an alert | from-sdd: reading of ADR-11 under SDD §11.2 | Open |
| `04-implementation/payout-service.md` § 7.4 (RFC 9457) | Problem Details on API-03 until CardPay's format is known | from-sdd: SDD §17.2 defers to CardPay | Open |
| `04-implementation/payout-service.md` § 7.6 | Transaction propagation per method | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/notification-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming default applied | Open |
| `04-implementation/notification-service.md` § 7.3 | Supersession within (refund, channel, recipient) | from-sdd: narrower than the SDD §17.3 wording | Open |
| `04-implementation/notification-service.md` § 7.4 (Strategy) | Strategy for channel senders and recipient resolvers | from-sdd: CLAUDE.md guideline pattern | Open |
| `04-implementation/notification-service.md` § 7.6 | Transaction propagation per method | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/loyalty-service.md` § 7.2 | Class names | from-sdd: CLAUDE.md naming default applied | Open |
| `04-implementation/loyalty-service.md` § 7.6 | Transaction propagation per method | from-sdd: CLAUDE.md default applied | Open |
| `05-data-model.md` § 8.2 | Composite tenant-first primary and foreign keys | from-sdd: LLD choice for the tenant-index rule | Open |
| `05-data-model.md` § 8.5 | Two Flyway instances in the core; migration and application roles | from-sdd: LLD proposal | Open |
| `06-api-contracts.md` § 9.2 | Request and response JSON shapes | from-sdd: SDD names schemas only | Open |
| `06-api-contracts.md` § 9.2 | Money as a decimal string in REST and events | from-sdd: SDD §14.9 types it without a JSON form | Open |
| `07-event-contracts.md` § 10.3 | Idempotent producer, snappy, `event_type` header | from-sdd: LLD choices | Open |
| `07-event-contracts.md` § 10.4 | 3 retries (1 s, 2 s, 4 s) before the DLQ | from-sdd: LLD proposal | Open |
| `07-event-contracts.md` § 10.5 | Per-consumer DLQ redrive listener | from-sdd: design for SDD §20.1.3 | Open |
| `09-cross-cutting.md` § 12.2 | 4xx outcomes stored as COMPLETED and replayed | from-sdd: SDD §11.1 states only the 5xx rule | Open |
| `09-cross-cutting.md` § 12.4 | Per-tenant polling, synchronous sends, delete after acknowledgement | from-sdd: LLD choices for the SDD relay | Open |
| `09-cross-cutting.md` § 12.7 | Spring Boot structured logging | from-sdd: avoids a new dependency | Open |
| `11-security.md` § 14.2 | PII inventory complete (DLQs and `payout_result.raw_body` added) | from-sdd: security review needed | Open |
| `11-security.md` § 14.6 | Compliance applicability; PAN-rejection test | from-sdd: legal review needed | Open |
| `13-testing.md` § 16.5 | Accessibility checker library in Playwright | from-sdd: new test dependency | Open |
| `14-frontend.md` § 17.4 | Reduced CLAUDE.md data-table scope | from-sdd: SDD cursor APIs with fixed sort | Open |
| `14-frontend.md` § 17.6 | Build-time `@angular/localize` | from-sdd: fit with the tenant-locale model | Open |

## 18.4 Decisions Pending

<!-- Every open decision carries the author's recommended option AND the reason behind it - the stakeholder decides with a default in hand, never from a blank slate. -->

| ID | Decision needed | Recommended option | Why | Stakeholder | Blocking? | Target date |
|----|-----------------|--------------------|-----|-------------|-----------|-------------|
| OQ-01 | Replay rule for 4xx outcomes of idempotent writes | Store 4xx as COMPLETED and replay it (09 § 12.2) | Without it an IN_PROGRESS row blocks the key for 24 hours after any business error; replaying the same error is what a retry of the same body should see | Architect | Yes (P1) | Before P1 build |
| OQ-02 | JSON form of money in REST and events | Decimal string with 4 places plus ISO currency (06 § 9.2) | SDD §6 forbids floating point; a JSON number is parsed as a double by the web app and many consumers | Architect | Yes (P1) | Before P1 build |
| OQ-03 | Primary-key shape | Composite (`tenant_id`, `id`) everywhere (05 § 8.2) | Meets the CLAUDE.md tenant-index rule with no exception and makes cross-tenant child rows impossible; cost is composite JPA ids | Architect, team | Yes (P1) | Before P1 build |
| OQ-04 | Tenant configuration source (backend and web branding) | Mounted Helm configuration for services; static per-tenant file for the web app (LA-01, LA-05) | SDD §11.5 makes Helm values the source of truth; no service owns tenant configuration, and one tenant exists today | Architect | Yes (P1) | Before P1 build |
| OQ-05 | New dependencies | Approve ArchUnit, an HTTP stub server, an accessibility checker, and an OIDC client library; build the UUIDv7 generator in-house (02 § 5.5) | CLAUDE.md requires approval for every new dependency; each fills a gap the SDD mandates (architecture tests, provider stubs, WCAG, PKCE, UUIDv7) | Team lead | Yes (P1) | Before P1 build |
| OQ-06 | Segregation of duties on decisions | Forbid a manager from deciding a request filed from their own customer account (403) | A cheap check that closes self-approval of a money-moving decision; the BRD and SDD are silent | REFUNDS owner | No | Before P3 |
| OQ-07 | Notification supersession scope | Within (refund, channel, recipient) (notification-service 7.3) | Under the SDD wording a delayed customer `REFUND_APPROVED` message can be skipped because a manager email of the same refund was sent, breaking REFUNDS UC-04 AC-1 | Architect | No | Before P3 |
| OQ-08 | Daily report semantics | Count status changes during the day (refund-service 7.8) | Matches "average time to decision" for the same day and needs no snapshot table | REFUNDS owner | No | Before P3 |
| OQ-09 | `member_id` claim content (A-5) | Loyalty member number (LA-02) | POS purchases carry the member number, so members resolve without a separate link table | LOYALTY owner, architect | Yes (P4) | Before P4 build |
| OQ-10 | Partial take-back and rounding (R-04) | The SDD §17.4 proposal: whole EUR of the paid amount, capped at the points still held | Keeps LOYALTY/NFR-01 provable per purchase; isolated in `EurPointsPolicy` so a different rule is one class | LOYALTY owner | Yes (P4) | Before P4 build |
| OQ-11 | Data-table scope in the web app | Accept cursor pagination with fixed sort, no export, no bulk actions for this release (14 § 17.4) | The SDD APIs and the BRD scope do not support the full CLAUDE.md table rule; bulk approval is a BRD future enhancement | Product owner | No | Before P2 |
| OQ-12 | Detection signal for receipt enumeration (R-09) | WARN log event with a keyed hash of the subject, alerted in the log store (10 § 13.7) | A per-customer metric label or `customer_id` at INFO would break the logging rule; a keyed hash is not reversible | Security | No | Before P1 go-live |

**SDD items that shaped implementation choices (not repeated as flags):** R-01 (CardPay honouring the idempotency key) drives the in-doubt and reconciliation paths of payout-service; R-02 and A-6 (original payment reference) keep `originalPaymentRef` a required field of `Receipt`; R-03 and A-4 drive the (branch, receipt number) purchase identity; R-08 drives the `posRecords` instance and the 503 path; R-09 drives the minimal lookup response. SDD future enhancements that constrain today's design: a third notification channel (push) is a new `MessageSender`; a manual "retry FAILED payout" action would need a new `FAILED -> PENDING` transition with a new key rule (ADR-10), so none is built now.

## 18.5 Inference Confidence Summary

High-confidence rows count the `##` sub-sections of each chunk that carry no flag; Medium and Low count the flags.

| Section | High-confidence rows | Medium-confidence rows | Low-confidence rows |
|---------|---------------------|------------------------|---------------------|
| 1-6. Purpose, Scope, Context, Architecture | 7 | 3 | 6 |
| 7. Implementation (per service) | 16 | 13 | 12 |
| 8. Data Model | 3 | 2 | 2 |
| 9. API Contracts | 2 | 2 | 3 |
| 10. Event Contracts | 0 | 3 | 2 |
| 11. State & Rules | 2 | 0 | 2 |
| 12. Cross-Cutting | 4 | 3 | 3 |
| 13. Operations | 4 | 0 | 6 |
| 14. Security | 2 | 2 | 2 |
| 15. Performance | 2 | 0 | 4 |
| 16. Testing | 4 | 1 | 2 |
| 17. Frontend | 5 | 2 | 4 |
| 20. Specs | 3 | 0 | 1 |
| **Total** | **54** | **31** | **49** |

> **Convention:** these counts are updated whenever a chunk is regenerated.

<!-- MASTER: lld-master.md | PREV: 14-frontend.md | NEXT: 16-references.md -->
