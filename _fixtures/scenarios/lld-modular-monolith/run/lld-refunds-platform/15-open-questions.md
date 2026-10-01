<!--
CHUNK: 15
TITLE: Open Questions, Drift Index, Confidence Flags
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 18. Open Questions & Flag Index

> **How to use this chunk:** this is the single review surface. Every `> Confirm:`, `> TODO:`, `⚠ drift`, `🆕 code-only`, `⛔ sdd-only`, and `⚠ policy` marker placed anywhere in the LLD has a row here pointing to its location. Reviewers should:
>
> 1. Open this file first.
> 2. Walk the tables in order: Drift and Policy Findings first (action items), then TODO (low-confidence), then Confirm (medium-confidence).
> 3. Edit the source chunk to resolve each row.
> 4. Ask lld-unifier to regenerate the changed chunks (SKILL.md step 9); this index is regenerated with them.

Totals: 43 `> TODO:` (low confidence), 46 `> Confirm:` (medium confidence), 0 drift markers, 0 `⚠ policy` findings. Locations name the chunk file and the nearest heading.

---

## 18.1 Drift Markers (hybrid mode only)

Not applicable - from-sdd direction: no code was read, so no `⚠ drift`, `🆕 code-only`, or `⛔ sdd-only` marker exists.

| Location | Marker | Summary | Severity | Recommended resolution | Why | Status |
|----------|--------|---------|----------|------------------------|-----|--------|
| - | - | None | - | - | - | - |

> **Severity guide:**
> - **High:** affects security, data integrity, or contract surface.
> - **Medium:** affects observability, performance, or cross-team integration.
> - **Low:** naming, documentation, or non-load-bearing detail.

## 18.2 Low-Confidence Inferences (TODO)

| Location | Best-guess content | Source / Reason | Status |
|----------|--------------------|----|--------|
| `03-architecture.md` § 6.2 Deployment Topology | 2 to 4 replicas, 1 vCPU / 1 GiB request, CPU-based autoscaling at 70% | from-sdd: replica maximum, CPU and memory requests and limits, and autoscaling bounds are open in SDD §11.3 and §18.3 | Open |
| `04-implementation/loyalty.md` § `TakeBackServiceImpl.onRefundPaid` | points for `paidAmount` at 1 point per 1 EUR rounded down, under the cumulative cap, so a full refund takes back every earned point | from-sdd: the take-back rule for a refund of some items or a lower amount is open in SDD §17.4 (R-04) | Open |
| `04-implementation/loyalty.md` § `PurchaseIntakeServiceImpl.ingest` (earn) | 1 point per whole EUR, rounded down (12.50 EUR earns 12 points) | from-sdd: rounding of purchase amounts with cents is open in SDD §17.4 (points are whole numbers, LOYALTY 11) | Open |
| `04-implementation/loyalty.md` § `PurchaseIntakeServiceImpl.ingest` (earn) | a POS push to an internal endpoint authenticated with a per-tenant client credential, feeding `PurchaseIntakePort.ingest` | from-sdd: the POS member purchase intake mode (push API, pull API, or daily file) is open in SDD §12 INT-03 (b) | Open |
| `04-implementation/loyalty.md` § `LoyaltyNightlyJob.run` | 30 days, matching the refund window | from-sdd: how long a pending take-back waits before it expires is open in SDD §17.4 | Open |
| `04-implementation/notification.md` § `PayoutFailedListener.on` | email, read from the Keycloak users holding `BRANCH_MANAGER` with that `branch_id` through a `BranchManagerDirectory` adapter, which adds an outbound call SDD §12 does not list | from-sdd: the channel of the branch manager alert and the source of the managers' contact details are open in SDD §17.3 | Open |
| `04-implementation/notification.md` § `NotificationDispatchServiceImpl.dispatchDue` | 10 attempts with backoff from 1 min doubling to a 1 h cap | from-sdd: the maximum attempts or age before a message is marked Failed is open in SDD §17.3 and §12 INT-02 | Open |
| `04-implementation/notification.md` § Pattern: Outbox (dispatch table for provider writes) | MsgHub honours an idempotency key, otherwise a crash window can send a message twice | from-sdd: MsgHub idempotency support is TBD - external (SDD §15.3 API-04) | Open |
| `04-implementation/payout.md` § `PayoutDispatchServiceImpl.dispatchDue` | poll every 30 s, initial delay 1 min doubling to a 1 h cap with full jitter, claim lease 2 min (longer than the CardPay timeout) | from-sdd: dispatcher poll interval, backoff initial delay, and maximum interval are open in SDD §17.2 | Open |
| `04-implementation/payout.md` § `PayoutReconciliationServiceImpl.reconcile` | a daily payout report keyed by our idempotency key | from-sdd: the CardPay data source of the reconciliation (payout report or status query) is TBD - external in SDD §15.3 API-03 | Open |
| `04-implementation/payout.md` § Pattern: Outbox (dispatch table for provider writes) | synchronous result with key-based deduplication | from-sdd: whether CardPay deduplicates on an idempotency key, and whether the result returns in the response or by callback, are TBD - external (SDD §15.3 API-03) | Open |
| `04-implementation/refund.md` § `BranchRefundReportServiceImpl.report` | read on demand only (no scheduled push) | from-sdd: SDD §17.1 leaves open whether "Daily" also means the report is pushed to the branch manager each day | Open |
| `05-data-model.md` § Service: `refund` - schema `refund` | `R` followed by a 9-digit zero-padded counter, for example `R000001234` | from-sdd: the reference number format is not stated in SDD §17.1 (varchar(20)) | Open |
| `05-data-model.md` § Schema `platform` (no owning module) | the LLD-only `event_publication_redelivery` table, maintained by `EventRedeliveryJob` | from-sdd: SDD §14.10 rule 5 stops re-delivery after a maximum count, but the Spring Modulith registry keeps no re-delivery count in the versions this LLD assumes | Open |
| `05-data-model.md` § 8.6 Retention & Archival | financial records (refund, payout, ledger) 10 years, messages 90 days, idempotency records 24 hours | from-sdd: every retention period above is open in SDD §17.1 to §17.4 | Open |
| `05-data-model.md` § 8.7 Encryption | yearly rotation with lazy re-encryption on write | from-sdd: key rotation cadence is open in SDD §17.1 and §11.6 | Open |
| `06-api-contracts.md` § 9. API Contracts (chunk header) | one YAML per module under `src/main/resources/openapi/` of the deployable, spec-first | from-sdd: the OpenAPI repository path is open in SDD §21 | Open |
| `06-api-contracts.md` § Service: `loyalty` | API-02, API-03, and API-04 stay TBD - external until the provider documentation is supplied (SDD §15.6); the clients are designed against their ports only - verify once the contracts exist | from-sdd: not derivable from the SDD | Open |
| `08-state-and-rules.md` § Rule: The purchase reference joins a refund to its points | one identifier, unique per tenant, so no `branch_id` joins the receipt keys | from-sdd: whether the member purchase intake carries the receipt number customers enter, and whether receipt numbers are unique across branches, is open in SDD §5 (Retail IT) | Open |
| `08-state-and-rules.md` § Algorithm: 30-day refund window | elapsed hours with the boundary inclusive, kept in this one function so the answer is a one-line change | from-sdd: elapsed 30 x 24 hours or 30 calendar days in the tenant's time zone is open in SDD §3 assumption 8 | Open |
| `09-cross-cutting.md` § 12.1 Authentication & Tenant Resolution | the static map above, changed only with SDD §16 in the same release | from-sdd: ADR-08 is Proposed with an open question (static map in the deployable or Keycloak client roles) | Open |
| `09-cross-cutting.md` § 12.2 Idempotency | 24 hours | from-sdd: the idempotency replay window is open in SDD §17.1 | Open |
| `09-cross-cutting.md` § 12.3 Resilience (downstream calls) | POS 3 s (a customer is waiting), CardPay 10 s, MsgHub 5 s, with the bulkhead sizes above | from-sdd: the provider call timeouts and rate limits are open in SDD §12 (INT-01 to INT-03) | Open |
| `09-cross-cutting.md` § 12.4 Outbox Pattern (mandatory for state-changing integration events) | age 5 min, interval 1 min, at most 10 re-deliveries, which keeps a take-back well inside the 1 hour of LOYALTY/NFR-02 | from-sdd: the re-delivery age threshold, job interval, and maximum re-deliveries are open in SDD §14.10 rules 3 and 5 | Open |
| `09-cross-cutting.md` § 12.5 Saga Pattern (cross-service transactions) | no action in this release beyond the alert and the reconciliation | from-sdd: after a payout ends Failed, who may retry or cancel it, and through which use case, is open in SDD §17.2 | Open |
| `09-cross-cutting.md` § 12.8 Tracing | 100% in Dev and SIT, 10% probabilistic in UAT and Prod, with errors always kept | from-sdd: trace backend and sampling rate are open in SDD §6 and §11.4 | Open |
| `09-cross-cutting.md` § 12.9 Configuration | none for this release | from-sdd: whether a feature flag tool is needed is open in SDD §11.5 | Open |
| `10-operations.md` § 13.4 Logs | 30 days hot, 1 year cold | from-sdd: log volume is an LLD estimate and the retention of the central log store is open in SDD §6 | Open |
| `10-operations.md` § 13.6 Dashboards | dashboard URLs - verify once the Grafana folders exist | from-sdd: not derivable from the SDD | Open |
| `10-operations.md` § 13.7 Alerts | alert thresholds and severities are LLD best guesses; the paging policy is open in SDD §20.3 - verify with on-call | from-sdd: not derivable from the SDD | Open |
| `10-operations.md` § 13.8 Runbook Procedures | concrete commands once code exists - verify; namespace, deployment name, and database access are open in SDD §20.1 (the placeholders `<ns>`, `<deploy>`, `<db>` below) | from-sdd: not derivable from the SDD | Open |
| `10-operations.md` § 13.9 On-Call | the development team's rota with escalation to the architect on call | from-sdd: on-call rota, escalation, and channel are open in SDD §20.3 | Open |
| `11-security.md` § 14.3 Secrets Management | provider credentials every 90 days, encryption keys yearly | from-sdd: secret rotation cadence and procedure are open in SDD §11.6 and §20.1.4 | Open |
| `11-security.md` § 14.4 Authentication / Authorisation Decisions | allowed (the guard only compares the same account) | from-sdd: whether a branch manager may decide a refund of their own purchase made through a separate customer account is open in SDD §17.1 Constraints | Open |
| `11-security.md` § 14.5 Threat Notes | full threat model - verify or replace with link to threat model doc; SDD §21 records it as not yet written | from-sdd: not derivable from the SDD | Open |
| `11-security.md` § 14.5 Threat Notes | 20 lookups per customer per hour at the gateway | from-sdd: the per-customer receipt lookup limit is open in SDD §17.1 Constraints | Open |
| `12-performance.md` § 15.1 SLOs (per service) | the LLD targets above (writes far below 1 RPS per SDD §18.2, reads assumed at 5 RPS, peak 3x per REFUNDS/NFR-03) | from-sdd: the `refund` and `loyalty` RPS and latency targets are open in SDD §18.2 and REFUNDS/NFR-03 | Open |
| `12-performance.md` § 15.4 Bulkhead & Concurrency | the database pool size is an LLD best guess (no SDD figure); with the POS call outside any transaction (SDD R-06) a pool of 20 per replica covers the 3x peak - verify in the load test | from-sdd: not derivable from the SDD | Open |
| `12-performance.md` § 15.6 Load-Test Strategy | k6 in UAT, 1 h at 3x, before each seasonal sale and major release | from-sdd: load-test tool, environment, durations, and cadence are open in SDD §18.4 | Open |
| `13-testing.md` § 16.7 CI Gates | 80% on changed files, warn only | from-sdd: the coverage threshold and static analysis tool are not set by the SDD (CI/CD platform open in SDD §6) | Open |
| `14-frontend.md` § 17.5 Theming | a neutral blue primary until the tenant supplies it | from-sdd: the brand key color is open in SDD §6 Frontend Stack row | Open |
| `14-frontend.md` § 17.6 i18n | the tenant default locale only in this release, with RTL-ready layouts | from-sdd: neither BRD names the languages to support | Open |
| `17-specs.md` § 2. Tech Stack | the Spring Modulith release line that supports Spring Boot 3.5 | from-sdd: the Spring Modulith and Keycloak version pins are open in SDD §6 (a missing pin the skill would ask about, taken as open in this non-interactive run) | Open |

## 18.3 Medium-Confidence Inferences (Confirm)

| Location | Inferred content | Source / Reason | Status |
|----------|------------------|----|--------|
| `03-architecture.md` § 6.3 Runtime Stack | Maven as the build tool, and Flyway and Resilience4j without a version pin, are LLD choices filling rows SDD §6 does not pin (CLAUDE.md defaults); the Spring Modulith, Keycloak, and observability versions stay open in SDD §6. | from-sdd: LLD design choice the SDD does not pin | Open |
| `03-architecture.md` § 6.4 Architectural Style - As Operationalised | the Spring Modulith API names used in this LLD (`ApplicationModules.verify()`, `@ApplicationModuleListener`, `IncompleteEventPublications`, `EventSerializer`) are taken from Spring Modulith 1.x; verify them against the version SDD §6 pins once it is chosen. | from-sdd: LLD design choice the SDD does not pin | Open |
| `04-implementation/loyalty.md` § Controllers | SDD §7.3 lists no event entry point for the take-back of LOYALTY/UC-02 (`Event: RefundPaid`), although §7.3 links §8.4.2 to it; `RefundPaidListener` therefore carries no `use_case`, and a take-back incident is not found by a use-case search until SDD §7.3 adds it. | from-sdd: upstream gap in SDD §7.3 (never filled in the LLD) | Open |
| `04-implementation/loyalty.md` § Domain Types (records) | the response record is named `PointsBalanceResponse` with OpenAPI schema name `PointsBalance` because the SDD uses `PointsBalance` for both the aggregate (§17.4 Boundaries) and the response (§17.4 List of APIs). | from-sdd: LLD design choice the SDD does not pin | Open |
| `04-implementation/loyalty.md` § Method Signatures (key methods only) | class and method names follow the CLAUDE.md naming conventions plus the hexagonal suffixes; verify with the team. | from-sdd: CLAUDE.md naming conventions | Open |
| `04-implementation/loyalty.md` § `TakeBackServiceImpl.onRefundPaid` | pseudocode derived from SDD §17.4 Take-back, Pending take-back, and Timeliness; the per-purchase advisory lock is an LLD addition that closes the race between a take-back and the earn step of the same purchase. | from-sdd: pseudocode from the SDD Business Logic, not pinned line by line | Open |
| `04-implementation/loyalty.md` § 7.6 Transaction Boundaries | transaction propagation defaults applied per CLAUDE.md; verify per method, in particular `REPEATABLE_READ` for the integrity check. | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/loyalty.md` § Workflow: Member purchase intake (earn) | earning points on member purchases is behaviour no BRD use case covers (LOYALTY 01 states it, LOYALTY 05 has no use case for it, SDD §17.4 marks it "no use case"); it is an open question for the LOYALTY owner, never a new use case. | from-sdd: behaviour no BRD use case covers (open question, never a new UC) | Open |
| `04-implementation/notification.md` § Method Signatures (key methods only) | class and method names follow the CLAUDE.md naming conventions plus the hexagonal suffixes; verify with the team. | from-sdd: CLAUDE.md naming conventions | Open |
| `04-implementation/notification.md` § `NotificationDispatchServiceImpl.dispatchDue` | pseudocode derived from SDD §17.3 Dispatch and Retries; the lease-based claim matches `payout` (A-03). | from-sdd: pseudocode from the SDD Business Logic, not pinned line by line | Open |
| `04-implementation/notification.md` § Pattern: Strategy (channel senders) | Strategy is a CLAUDE.md guideline applied because two channels exist and a third is planned; the SDD does not name the pattern. | from-sdd: CLAUDE.md guideline applied | Open |
| `04-implementation/notification.md` § 7.6 Transaction Boundaries | transaction propagation defaults applied per CLAUDE.md; verify per method. | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/payout.md` § Method Signatures (key methods only) | class and method names follow the CLAUDE.md naming conventions plus the hexagonal suffixes; `PayoutReport` and `ReconciliationResult` depend on what CardPay offers (API-03, TBD - external). | from-sdd: CLAUDE.md naming conventions | Open |
| `04-implementation/payout.md` § `PayoutPortAdapter.requestPayout` | pseudocode derived from SDD §15.3 API-01 and §17.2 Request; the currency check against the tenant currency (SDD §3 assumption 7) is an LLD addition. | from-sdd: pseudocode from the SDD Business Logic, not pinned line by line | Open |
| `04-implementation/payout.md` § `PayoutDispatchServiceImpl.dispatchDue` | pseudocode derived from SDD §17.2 Dispatch, Success, Failure, and Figure 17; the claim lease and the call outside the claim transaction are LLD choices (SDD §8.1.3 only says the dispatchers claim with row locks), so no database connection is held during a CardPay call. | from-sdd: pseudocode from the SDD Business Logic, not pinned line by line | Open |
| `04-implementation/payout.md` § 7.6 Transaction Boundaries | transaction propagation defaults applied per CLAUDE.md, with `MANDATORY` on the port; verify per method. | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/refund.md` § Controllers | SDD §7.3 lists no event entry point for REFUNDS/UC-04 step 7, so `PayoutSucceededListener` carries no `use_case` and its log lines and spans are not found by a use-case search; an SDD §7.3 update (`Event: PayoutSucceeded`) would add `@UseCase("REFUNDS/UC-04")`. | from-sdd: upstream gap in SDD §7.3 (never filled in the LLD) | Open |
| `04-implementation/refund.md` § Controllers | `GET /v1/branches/{branchId}/refund-report` serves REFUNDS 09 Reporting, which no BRD use case covers; it carries no `@UseCase` (behaviour no BRD use case covers: an open question, never a new UC). | from-sdd: behaviour no BRD use case covers (open question, never a new UC) | Open |
| `04-implementation/refund.md` § Method Signatures (key methods only) | class and method names follow the CLAUDE.md naming conventions (`*Controller`, `*Service`, `*ServiceImpl`, `*Repository`) plus the hexagonal suffixes (`*Port`, `*Adapter`, `*Listener`); verify with the team. | from-sdd: CLAUDE.md naming conventions | Open |
| `04-implementation/refund.md` § `ReceiptLookupServiceImpl.refundableItems` | pseudocode derived from SDD §17.1 Business Logic (Receipt lookup); the POS field names are placeholders until API-02 is supplied. | from-sdd: pseudocode from the SDD Business Logic, not pinned line by line | Open |
| `04-implementation/refund.md` § `RefundRequestServiceImpl.submit` | pseudocode derived from SDD §17.1 Submit; the replay-on-PK-violation step is an LLD design that uses the SDD `idempotency_record` table as defined (no in-progress status). | from-sdd: pseudocode from the SDD Business Logic, not pinned line by line | Open |
| `04-implementation/refund.md` § `RefundDecisionServiceImpl.decide` | pseudocode derived from SDD §17.1 Approve, Reject, Self-decision guard, and Figure 14; a missing reason on a partial approval maps to `PARTIAL_AMOUNT_INVALID` as Figure 14 draws it. | from-sdd: pseudocode from the SDD Business Logic, not pinned line by line | Open |
| `04-implementation/refund.md` § `RefundPaymentServiceImpl.onPayoutSucceeded` | SDD §17.1 says the listener dedups on `eventId`; this LLD dedups on the Approved to Paid transition and the `payoutId` (a re-delivered publication carries the same `eventId` and finds the request Paid), with no consumed-event table. | from-sdd: LLD design choice the SDD does not pin | Open |
| `04-implementation/refund.md` § Pattern: Durable in-process event publication | the stable listener identity (`id` attribute) assumes the Spring Modulith version in use supports naming a listener; otherwise the identity is the listener's class and method name, and a rename follows the expand-contract rule of SDD §14.10 rule 7. | from-sdd: LLD design choice the SDD does not pin | Open |
| `04-implementation/refund.md` § Pattern: Saga (choreography, in process) | the SDD does not name this flow a saga; it is recorded here as a choreography saga with no compensation, because the SDD keeps a failed payout Approved and leaves "After Failed" handling open (SDD §17.2). | from-sdd: LLD design choice the SDD does not pin | Open |
| `04-implementation/refund.md` § 7.6 Transaction Boundaries | transaction propagation defaults applied per CLAUDE.md (`REQUIRED`, `READ_COMMITTED`); verify per method, in particular `REPEATABLE_READ` for the report. | from-sdd: CLAUDE.md default applied | Open |
| `04-implementation/refund.md` § 7.7 Error Handling | a customer token without the `email` claim is refused at submission with 400 `VALIDATION_FAILED` (`customer_email` is not null in SDD §17.1); SDD ADR-07 names the claim but not the case where it is missing. | from-sdd: LLD design choice the SDD does not pin | Open |
| `05-data-model.md` § Service: `refund` - schema `refund` | `reference_sequence` is an LLD-only table backing the SDD's "per-tenant sequence" for reference numbers (`UPDATE ... SET next_value = next_value + 1 RETURNING next_value` inside the submit transaction); a row lock per tenant serialises submissions, acceptable at about 40 a day. | from-sdd: LLD design choice the SDD does not pin | Open |
| `05-data-model.md` § Service: `refund` - schema `refund` | `changed_by` is null for system transitions because SDD §17.1 types it uuid while SDD §11.1 names the system actor `system`. | from-sdd: LLD design choice the SDD does not pin | Open |
| `05-data-model.md` § Service: `payout` - schema `payout` | `trace_parent` is an LLD-only column realising "the trace context of the approval is stored with the payout" (SDD §17.2 Tracing). | from-sdd: LLD design choice the SDD does not pin | Open |
| `05-data-model.md` § Service: `notification` - schema `notification` | SDD §17.3 renders templates at dispatch time but its `notification` table has no column for the data the template needs; this LLD adds typed columns (`reference_number`, `amount`, `currency`, `reason`) rather than a JSON column, which SDD §11.1 reserves for event payloads and provider responses. | from-sdd: LLD design choice the SDD does not pin | Open |
| `05-data-model.md` § 8.4 Multi-Tenancy Strategy | `@TenantId` (Hibernate 6) and the transaction-start `set_config` hook are the LLD's choice of mechanism for the SDD's "repository tenant filter plus row-level security"; verify both with the Spring Boot 3.5 Hibernate version. | from-sdd: LLD design choice the SDD does not pin | Open |
| `05-data-model.md` § 8.7 Encryption | column encryption is done in the application (AES-256-GCM converter) and stored as `bytea`, because the SDD's varchar(254) and varchar(20) cannot hold the ciphertext of a full-length value; the PII fields of event publications use the same key (SDD §14.10 rule 8). | from-sdd: LLD design choice the SDD does not pin | Open |
| `06-api-contracts.md` § 9.2 Request / Response Shapes | the response shapes are proposed per CLAUDE.md REST conventions (records, ISO-8601 UTC timestamps, Money as amount and currency); SDD §17.1 and §17.4 name the schemas but do not shape them. | from-sdd: LLD design choice the SDD does not pin | Open |
| `06-api-contracts.md` § 9.4 Pagination, Sorting, Filtering | CLAUDE.md asks for sortable tables with export and bulk actions, while the SDD fixes the sort order and lists bulk approval as a future enhancement (SDD §17.1); this LLD follows the SDD. | from-sdd: LLD design choice the SDD does not pin | Open |
| `07-event-contracts.md` § 10.6 In-Process Domain Events (SDD §14.10) | SDD §14.10 gives `PayoutSucceeded` one When (REFUNDS/UC-04 step 7), while SDD §17.2 also publishes it from the daily reconciliation of an Unknown payout; this LLD publishes it from both places in `payout` with the same DTO, so `refund` sees one event type whatever produced it, and a reconciled payout can turn a request Paid days after the approval. | from-sdd: LLD design choice the SDD does not pin | Open |
| `09-cross-cutting.md` § 12.6 Error Model (RFC 9457 ProblemDetails) | the `type` URI scheme (`/problems/<module>/<error-slug>`) is an LLD choice; the SDD fixes only `errorCode`. | from-sdd: LLD design choice the SDD does not pin | Open |
| `09-cross-cutting.md` § Use-case attribute | `use_case` is an LLD convention; the SDD does not settle a use case attribute (drop this flag when SDD §11.4 or a 13x Observability section names one). | from-sdd: LLD convention; SDD §11.4 silent | Open |
| `10-operations.md` § 13.3 Metrics (RED: Rate, Errors, Duration) | the `module` label on `http_server_requests_seconds` is derived from the handler's top-level package by an observation filter; SDD §11.4 asks for RED per module but does not say how the label is set. | from-sdd: LLD design choice the SDD does not pin | Open |
| `11-security.md` § 14.2 PII Inventory | PII inventory is complete - verify with security review; the free-text reason columns are an LLD addition to the SDD's PII list, since a customer or manager can type personal data into them. | from-sdd: needs security or legal review | Open |
| `11-security.md` § 14.6 Compliance | compliance applicability per project - verify with legal/compliance. | from-sdd: needs security or legal review | Open |
| `12-performance.md` § 15.1 SLOs (per service) | SLO targets - verify with SDD §18.2 Throughput Targets. | from-sdd: template flag on SDD §18.2 targets | Open |
| `13-testing.md` § 16.1 Test Pyramid (per service) | the HTTP stub library for the provider contract tests is not chosen (CLAUDE.md: no new dependency without asking); WireMock is the assumed default to be approved. | from-sdd: LLD design choice the SDD does not pin | Open |
| `14-frontend.md` § 17.3 Routing | route paths and components are this LLD's design; `/manager/refunds` (the branch queue, REFUNDS/UC-04 steps 1-2) is mapped to REFUNDS/MK-03, which the BRD names the decision screen, as part of the same flow. | from-sdd: LLD design choice the SDD does not pin | Open |
| `14-frontend.md` § 17.3 Routing | `/manager/refund-report` serves REFUNDS 09 Reporting, which has neither a use case nor a screen ID or `MK-NN` in the BRD; it is marked a platform page (a page no BRD use case needs) until the BRD gives it a screen. | from-sdd: behaviour no BRD use case covers (open question, never a new UC) | Open |
| `14-frontend.md` § 17.3 Routing | the LOYALTY screens LOYALTY/LP-01 and LOYALTY/LP-02 are `In review` and not playable in LOYALTY chunk 14 (its delivery gate is shut); the routes follow their current rows and are re-checked when the mockups are approved. | from-sdd: LLD design choice the SDD does not pin | Open |

## 18.4 Decisions Pending

| ID | Decision needed | Recommended option | Why | Stakeholder | Blocking? | Target date |
|----|-----------------|--------------------|-----|-------------|-----------|-------------|
| OQ-01 | Take-back for a refund of some items or a lower amount: all points of the purchase, or the points for the paid amount (SDD §17.4, R-04) | Points for `paidAmount` at 1 point per 1 EUR, rounded down, under the cumulative cap | Mirrors the earn rule, gives LOYALTY/UC-02 AC-1 (-50 for a full refund) under the cap, and keeps LOYALTY/NFR-01 whichever way partial refunds go; accepted: a member keeps the points of the unrefunded part | LOYALTY owner | Yes (P4) | Before P4 build |
| OQ-02 | POS member purchase intake mode (SDD §12 INT-03 (b)) | POS push to an internal endpoint with a per-tenant client credential | Same-day delivery (LOYALTY 02 Assumption 1) with no polling job, and `PurchaseIntakePort` keeps the domain unchanged if the answer differs; accepted: one more inbound endpoint to secure | Retail IT team, architect | Yes (P4) | Before P4 build |
| OQ-03 | Provider contracts API-02, API-03, API-04 (TBD - external, SDD §15.6) | Obtain the three provider documents and complete SDD §15.3 before the adapters are built | The adapters, error mapping, CardPay deduplication (R-01), and the reconciliation source all depend on them; accepted: P1 and P3 wait for the documents | Architect with Retail IT, CardPay, MsgHub | Yes (P1, P3) | Before P1 build |
| OQ-04 | Branch manager alert channel and the source of managers' contacts (SDD §17.3, REFUNDS/UC-04 E1) | Email, contacts read from Keycloak users with `BRANCH_MANAGER` and the branch's `branch_id` | Uses the identity store that already holds `branch_id` (ADR-07) and needs no new data; accepted: a new outbound call to Keycloak that SDD §12 must list | REFUNDS owner, IAM team | Yes (P3) | Before P3 build |
| OQ-05 | SDD §7.3 lists no event entry point for the `PayoutSucceeded` listener (REFUNDS/UC-04 step 7) or the `RefundPaid` take-back (LOYALTY/UC-02 BR-1: points taken back when the purchase is refunded) | Add `Event: PayoutSucceeded` and `Event: RefundPaid` (service named) to §7.3 through sdd-unifier, then annotate both listeners | A listener failure is invisible to a `use_case` search today; the LLD cannot add a mapping §7.3 does not state; accepted: an SDD version bump | Architect (SDD owner) | No | Next SDD version |
| OQ-06 | Behaviour no BRD use case covers: earning points on member purchases (LOYALTY 01), and the branch refund report (REFUNDS 09, also no screen ID or `MK-NN`) | Ask both BRD owners whether each needs a use case and a screen; keep both as designed meanwhile | IDs belong to the BRD and the LLD never creates one; accepted: no `use_case` attribute and a platform-page route until then | LOYALTY owner, REFUNDS owner | No | Next BRD versions |
| OQ-07 | Event re-delivery age, interval, and maximum (SDD §14.10 rules 3 and 5) | 5 min age, 1 min interval, 10 re-deliveries, counted in `platform.event_publication_redelivery` | Keeps a failed take-back well inside the 1 hour of LOYALTY/NFR-02 while bounding retries of a poison event; accepted: one LLD-only table | Architect | Yes (P1 platform) | Before P1 build |
| OQ-08 | Encrypted PII columns: the SDD types them varchar(254) and varchar(20), too small for ciphertext | Update SDD §17.1 and §17.3 to ciphertext columns (`bytea`) | Application-level AES-GCM output exceeds the plaintext length; accepted: an SDD table edit | Architect (SDD owner) | No | Next SDD version |
| OQ-09 | 30-day window: elapsed 30 x 24 hours or 30 calendar days (SDD §3 assumption 8) | Elapsed 720 hours, boundary inclusive, until the Store refund policy v3 is read | Already the SDD's reading, and kept in one function so the answer is a one-line change; accepted: a customer near the boundary may see a different answer than at the counter | REFUNDS owner | No | Before UAT |
| OQ-10 | Brand key color (CLAUDE.md: always ask about the key color; SDD §6 open) | A neutral blue primary in the design tokens until the tenant supplies its brand | Tokens make the switch a one-file change; accepted: screenshots before the switch use the placeholder | Product owner | No | Before P1 UI build |

## 18.5 Inference Confidence Summary

High-confidence rows count the sub-sections emitted clean (no flag); medium and low count the `> Confirm:` and `> TODO:` flags.

| Section | High-confidence rows | Medium-confidence rows | Low-confidence rows |
|---------|---------------------|------------------------|---------------------|
| 6. Architecture Overview | 1 | 2 | 1 |
| 7. Implementation (per service) | 86 | 25 | 11 |
| 8. Data Model | 5 | 6 | 4 |
| 9. API Contracts | 6 | 2 | 2 |
| 10. Event Contracts | 5 | 1 | 0 |
| 11. State & Rules | 11 | 0 | 2 |
| 12. Cross-Cutting | 2 | 2 | 7 |
| 13. Operations | 9 | 1 | 5 |
| 14. Security | 1 | 2 | 4 |
| 15. Performance | 3 | 1 | 3 |
| 16. Testing | 6 | 1 | 1 |
| 17. Frontend | 6 | 3 | 2 |
| 20. Specs | 3 | 0 | 1 |

> **Convention:** these counts are updated whenever a chunk is regenerated.

## 18.6 Policy Findings (every mode that reads code)

Not applicable - from-sdd direction: no code was read.

| Location | Marker | Rule (source) | Finding | Severity | Recommended fix | Why | Status |
|----------|--------|---------------|---------|----------|-----------------|-----|--------|
| - | - | - | None | - | - | - | - |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 14-frontend.md | NEXT: 16-references.md -->
