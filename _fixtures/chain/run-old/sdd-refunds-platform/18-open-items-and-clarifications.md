<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: all preceding SDD chunks (00 through 17)
GATES: chunk 19 (End-to-End System Design). Chunk 19 is written only after every item here is resolved: Accepted - applied, Adjusted - applied, or Rejected. Open and Deferred items keep the gate shut (SKILL.md step 8b).
PART OF: SDD - Refunds Platform
PURPOSE: Output of the post-generation cleared-context reviewer pass. Captures architecture-level gaps, missing scenarios, integration corner cases, ADR ambiguities, and cross-chunk contract mismatches flagged by an independent reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the SDD body once the architect accepts it.
GENERATED_BY: sdd-unifier post-generation reviewer (cleared-context subagent run after the main SDD body is complete).
SCOPE: The reviewer reads ALL preceding chunks. Contract-consistency findings are first-class: topic names, event names, payload fields, and consumer lists that diverge between the Centralized Event Hub (chunk 10), the per-service chunks (13x), the Centralized User Roles catalogue (chunk 12), and the Service Integration API Contracts (chunk 11) are valid OI items. The End-to-End System Design (chunk 19) does not exist yet when this review runs; it is written after this chunk is cleared.
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s), the item moves to the Resolution Log, and the Changes Log is bumped.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of architectural concerns identified after the main SDD was authored, by a reviewer running with cleared context. Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting the architect's acceptance: accept the recommendation (or adjust it), and it gets reflected into the SDD body.
>
> **What this section is not.** It is not a list of inline `[NEEDS CLARIFICATION: ...]` markers found in the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for, and contract inconsistencies between the centralized catalogues (chunks 10, 11, 12) and the per-service chunks they consolidate.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section number (e.g., §6, §17.1), service name, or "global" if cross-cutting. |
| **Type** | Architecture gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / NFR shortfall / ADR needed / Contract mismatch (topic, event, payload, consumer list, or role/permission divergence across chunks) / Duplication (BRD content or another chunk's content restated instead of referenced). |
| **Concern** | One paragraph. What was missed and why it matters for downstream LLD or implementation. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply SDD content (the exact row, decision, sub-section, or wording that would close the item). This is what gets injected into the body when accepted. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives, that is, the evidence behind it (BRD requirement, NFR, doctrine/CLAUDE.md default, operational risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: Decision-process narration in §6 and §8.1.2 hides an unrecorded "one team" driver behind ADR-01

- **Where:** §8.1.2 (04), §6 (02), §3 (01), §10 ADR-01 (06)
- **Type:** Inconsistency
- **Concern:** The settled design cites the architecture questionnaire by question number instead of stating its evidence: §8.1.2 grounds "a first production release built by one team" in "(questionnaire Q1, Q2)", and the §6 Notes cite "questionnaire (ADR-01)", "questionnaire Q8 (A-2)", and "questionnaire Q5 (ADR-02)", under a Notes legend that defines `default` as "CLAUDE.md platform default". Question numbers and a tooling file are references into the decision process that a reader of the SDD cannot resolve; the master states that the chunks carry only the settled design and that the questionnaire lives in decision-log.md. Behind the narration sits a real traceability gap in the architecture style: stage (REFUNDS 01, LOYALTY 04) and load (REFUNDS 02 Facts, REFUNDS/NFR-03) are BRD facts, but team size is not. Neither BRD states it, §3 has no assumption for it, and ADR-01 lists "one team" as a driver, so an LLD author or a later ADR review cannot see that the chosen style rests partly on an assumption, nor what happens to ADR-01 if the assumption is false.
- **Options:**
  - **A.** Replace every questionnaire citation with its settled evidence (BRD reference, ADR, or assumption) and record team size as assumption A-9, cited by ADR-01 - four small text edits; the questionnaire stays only in decision-log.md.
  - **B.** Keep the citations and link each one to decision-log.md - no rewrite, but the design text keeps depending on the decision history, and "Q2" still reads as evidence.
- **Recommended Answer:** Option A. Apply these edits:
  1. `01-executive-summary-scope-risks.md` §3, add after A-8:
     ```markdown
     9. **A-9 One delivery team:** one team builds and runs the platform in this release. Neither BRD states team size. With two or three teams the ADR-01 choice still holds, because the provider edges already deploy separately; a second team owning loyalty is an ADR-01 extraction trigger.
     ```
  2. `04-architecture-style-and-diagrams.md` §8.1.2, replace the first bullet with:
     ```markdown
     - **Stage and team:** a first production release (the paper process is replaced, [REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary); redemption is a later phase, [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope)) built by one delivery team (A-9) gains nothing from four release trains; a modular monolith keeps one deployable for the two business contexts.
     ```
  3. `06-principles-and-decisions.md` §10, ADR-01 Why: replace "Drivers: first production release, one team, moderate load" with "Drivers: first production release (REFUNDS 01), one delivery team (A-9), moderate load".
  4. `02-ecosystem-overview.md` §6: in the legend, replace "`questionnaire` (the architecture questionnaire, ADR-01), `default` (CLAUDE.md platform default)" with "`ADR` (an architectural decision in §10), `default` (platform default)"; Architecture Doctrine Notes: "ADR-01. Deviation from the microservices default is recorded in ADR-01."; Compute / Infra Notes: "A-2; one Helm chart per deployable (3 charts)."; Event Broker / Streaming Notes: "default (on-premises); ADR-02. Topic defaults: [NEEDS CLARIFICATION: partitions and retention per topic]."
- **Why:** The master says the chunks state only the settled design, and decision-log.md itself records Q2 as "assumption - BRD silent", so an ADR-01 driver that is an assumption must be visible in §3, where its failure can be tested and its effect stated. Option A costs four text edits; B keeps the design dependent on a companion file that is never merged into the SDD.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-02: Provider calls into the platform have no ingress path, no tenant resolution, and no tenant check

- **Where:** §10 (06), §11.2 (07), §15.1, API-03, API-05, API-06 (11), §17.3 (13c), Figure 3 in §8.3 (04)
- **Type:** ADR needed
- **Concern:** §11.2 and §15.1 resolve the tenant only from the `tenant_id` claim of a Keycloak token at the API gateway, and the gateway's edge gate (§16.2) rejects calls without such a token. The two external inbound contracts carry no Keycloak token: CardPay payout results (API-03, into payout-service) and POS member purchases (API-06, into the loyalty-service module of the gateway-fronted core). Figure 3 draws both straight into the services, bypassing the gateway, so nothing decides how they reach the cluster, which edge controls (rate limit, allowlist, request logging) apply, or how the tenant is known. API-03 and API-06 keep a verification secret per tenant, so the tenant must be known before the signature can be checked; taking it from the payload lets the payload choose its own verification key. The outbound side has the mirror gap: API-05 reads users through one notification-service Keycloak client across the single realm, and nothing checks that the `customerId` of a tenant-A event belongs to tenant A before tenant A's templates and MsgHub sender are used (§17.3), against AP-06 and the platform rule that every call carries tenant context. None of this depends on the provider documentation still awaited (§15.6): it is our side of the contracts, and ADR-03 already designs for a second retailer.
- **Options:**
  - **A.** ADR-11: a dedicated partner route on the API gateway, with an opaque per-tenant partner key in our path that is resolved to the tenant before the provider's signature is verified, plus a tenant check on every API-05 read - one more route, and one key per tenant and provider to issue, rotate, and register.
  - **B.** Expose payout-service and the core's partner endpoints through their own ingress and derive the tenant from the provider account named in the payload - no gateway change, but it bypasses edge rate limiting and logging, and the payload selects the key that verifies it.
  - **C.** One shared secret per provider for all tenants, with the tenant read from the payload after verification - simplest, but one leaked secret exposes every tenant, contradicting the per-tenant credentials of §6 and §15.
- **Recommended Answer:** Option A. Apply these edits:
  1. `06-principles-and-decisions.md` §10, add after ADR-10:
     ```markdown
     | ADR-11 | Accepted | Partner ingress: provider calls into the platform (API-03 CardPay payout results, API-06 POS Records member purchases) enter through a dedicated partner route on the API gateway, separate from the web app route. The route does not require a Keycloak token; the tenant is resolved from a partner key in our path before the provider's signature is verified. | Providers hold no Keycloak token (§16.2), and §11.2 resolves the tenant only from that token; API-03 and API-06 verify with a per-tenant secret, which must be chosen before the payload is trusted; payout results and member purchases change money state and points. | A partner hostname per environment; per provider, an IP allowlist and mutual TLS where the provider supports them [TBD - EXTERNAL: CardPay and the Retail IT team], a rate limit, and request logging at the gateway. When a provider pushes, our path follows `/v1/partners/{partnerKey}/<resource>`, where `partnerKey` is an opaque key issued per tenant and provider and registered with the provider. The receiving service resolves `partnerKey` to `tenant_id`, verifies the signature with that tenant's secret, and refuses, as a security event, any body that names a payout or member of another tenant. A file-based POS feed, if API-06 is one, lands in a per-tenant location under the same rule. | One more gateway route; one key per tenant and provider to issue, rotate (§20.1.4), and register with each provider. | Provider calls to each service's own ingress with the tenant read from the payload: rejected, it bypasses the edge controls and lets the payload choose its own verification key. One secret per provider for all tenants: rejected, one leaked secret exposes every tenant. |
     ```
  2. `07-cross-cutting-concerns.md` §11.2, Tenant context, append: "Partner calls (API-03, API-06) carry no token: the tenant is resolved from the partner key in our path before the provider's signature is verified (ADR-11). Keycloak Admin API reads (API-05): the caller checks that the user's `tenant_id` attribute equals the `tenant_id` of the event it is serving before it uses the data."
  3. `11-api-contracts.md` §15.1, Tenant context row, replace the default with: "Inbound from users: the `tenant_id` token claim. Inbound from partners (API-03, API-06): the partner key in our path, resolved before the signature is verified (ADR-11). Outbound to a provider: the per-tenant provider credential and account identify the tenant. API-05 reads: the user's `tenant_id` attribute must equal the tenant of the event being served." and its Source "§11.2, ADR-11". API-03 and API-06, Method and URI rows: "TBD (when the provider pushes, our path follows the ADR-11 pattern `/v1/partners/{partnerKey}/<resource>`)"; Authentication rows: "TBD (provider scheme), verified with the secret of the tenant resolved from the partner key (ADR-11)".
  4. `13c-service-notification.md` Business Logic, Contact resolution, append: "The user's `tenant_id` attribute must equal the event's `tenant_id`; otherwise the row is FAILED and a security alert fires." Error Handling, Domain errors, append: "tenant mismatch on the contact lookup -> row FAILED and a security alert."
  5. `04-architecture-style-and-diagrams.md` §8.3 Figure 3: route the `PAY` payout-results edge and the `POS` member-purchases edge through `GW` (partner route) instead of straight to `PS` and `LS`, and add "Provider calls into the platform enter through the gateway's partner route (ADR-11)." to its Summary.
- **Why:** Option A is the only one that keeps both platform rules at once: cross-cutting concerns (rate limiting, request logging) live at the gateway, and tenant context is established before any tenant-scoped secret or data is used; it needs nothing from the pending provider documentation. B and C let a payload or a single secret decide tenancy, which the second retailer ADR-03 prepares for would turn into a cross-tenant exposure.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-03: Core readiness ties every endpoint to Kafka, and concurrent outbox relays can reorder an aggregate's events

- **Where:** §11.3 (07), §4 R-07 (01), §14.6 item 3 (10), Deployment Strategy of §17.1 to §17.4 and Business Logic, Tables Design, and Event Model of §17.3 (13a to 13d)
- **Type:** Risk
- **Concern:** The two core modules share one pod, and Kubernetes gates readiness per pod, not per module. §17.1 puts the outbox relay into readiness and §17.4 puts the Kafka consumer into readiness, so a Kafka outage or a stuck consumer marks every core pod not ready and takes all customer, member, and branch manager endpoints out of service, although the outbox exists precisely so that synchronous requests never depend on the broker (ADR-05). R-07's mitigation "readiness probes per module" cannot be realised inside one pod. payout-service has the same coupling: while Kafka is down it is not ready, so CardPay's API-03 results are refused. Separately, the relay's runtime is unspecified: the core autoscales (§11.3) and rolling updates run old and new pods side by side, so several relays can poll the same `outbox_event` table and publish two events of one refund (for example `REFUND_SUBMITTED`, then `REFUND_CANCELLED` seconds later) out of order. §14.6 item 3 rests ordering on `aggregate_version` validation in refund-service and payout-service only, yet §17.3 promises "messages for one refund are sent in `aggregate_version` order" with no mechanism in its flow (Figure 20) and no version column in its send log, so a customer can be told "cancelled" before "submitted", and a redriven old event can send a stale message.
- **Options:**
  - **A.** Readiness checks the database only; relay and consumer health go to the existing alerts; one active relay per publisher under a PostgreSQL advisory lock, publishing in outbox order; notification-service skips a message superseded by a later version - relay failover waits for the lock to be released, and one relay per database caps publish throughput far above 1,200 requests a month.
  - **B.** Keep the readiness contents and split them into per-module health groups - still one pod-level probe, so a Kafka outage still removes the pod, and the ordering gap remains.
  - **C.** Allow concurrent relays and make every consumer buffer and reorder by version - no lock, but every consumer needs version state, which notification-service does not keep today.
- **Recommended Answer:** Option A. Apply these edits:
  1. `07-cross-cutting-concerns.md` §11.3, add bullet:
     ```markdown
     - **Health and relays:** readiness checks only what a pod needs to answer its synchronous requests, the database. Outbox relays and Kafka consumers never gate readiness; they report through the outbox backlog age and consumer lag alerts (§11.4). Each publishing module or service runs one active relay: the relay holds a PostgreSQL advisory lock on its database, so one replica publishes at a time, in `outbox_event` insertion order.
     ```
  2. `13a-service-refund.md`, `13b-service-payout.md`, `13c-service-notification.md`, `13d-service-loyalty.md`, Deployment Strategy, Health checks: "liveness and readiness probes; readiness checks the database only (§11.3)."
  3. `01-executive-summary-scope-risks.md` §4, R-07 Mitigation: "Separate schemas and thread pools per module, readiness on the database only so a module's broker or consumer fault never takes the pod out of service (§11.3), and the ADR-01 extraction trigger."
  4. `10-events-hub.md` §14.6, replace item 3 with: "**Ordering:** per aggregate: one active relay per publisher publishes in outbox order (§11.3) to a topic keyed by `aggregate_id`; refund-service and payout-service validate transitions with `aggregate_version`; notification-service skips a message whose `aggregate_version` is lower than one already sent for the same refund and channel (for example after a DLQ redrive). Not broker ordering across aggregates."
  5. `13c-service-notification.md`: Business Logic, add bullet "**Superseded messages:** a planned row whose `aggregate_version` is lower than that of a row already SENT for the same refund and channel is SKIPPED as superseded."; Tables Design, `notification`: add `aggregate_version` int NOT NULL (from the envelope); Event Model, `REFUND_PAID` Idempotency / ordering cell: "Same; ordering per §14.6 item 3".
- **Why:** The outbox and ADR-05 exist so that the broker is never on the request path, and REFUNDS/NFR-02 counts every minute the core is out of service; readiness on the database alone restores that design intent. A single relay per database is the simplest mechanism that makes §14.6 item 3 and the §17.3 promise true at this volume; B leaves the outage path intact and C spreads buffering logic into every consumer.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-04: Purchase identity and business dates: receipt numbers are keyed tenant-wide, and calendar rules run in UTC

- **Where:** §3 A-4 (01), §6 ecosystem rules (02), §17.1 (13a), §17.4 (13d), API-01 and API-06 (11)
- **Type:** Corner case
- **Concern:** The SDD treats a receipt number as unique within a tenant everywhere: the lookup `GET /v1/receipts/{receiptNumber}/refundable-items` (API-01), the item-claim index UNIQUE (`tenant_id`, `receipt_number`, `receipt_line_id`), loyalty's EARNED index UNIQUE (`tenant_id`, `purchase_reference`), API-06 idempotency on (`tenant_id`, purchase reference), and the take-back match on the event's `receiptNumber`. Neither BRD says receipt numbers are unique across the 40 branches (REFUNDS 02 Assumption 1 only says every purchase has one), and POS numbering is often per branch or per till. If numbers repeat across branches, a claim on one branch's receipt blocks the same line of another branch's receipt ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2 applied to the wrong purchase), and a paid refund takes back points from another member's purchase ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1, LOYALTY/NFR-01). The A-4 marker asks whether the loyalty reference equals the receipt number, not how unique that number is. Dates carry the same silent choice: the refund window compares the POS purchase date with "today (UTC)", the daily branch report covers "one day (UTC)", and the parking deadline is "the end of the day after `purchaseDate`" with no zone at all. A purchase date is a local calendar date, so for part of every day the UTC date differs from the branch's date: [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) AC-2 ("a purchase 31 days old ... told the refund window has passed") passes or fails depending on the hour of the request, and the daily report splits a branch's business day in two.
- **Options:**
  - **A.** Identify a purchase by (branch, receipt number) in every key and match, which is correct whether numbering is per branch or per retailer, and evaluate business dates in the tenant's time zone from tenant configuration - two index changes, one extra column on two tables, and one zone setting per tenant.
  - **B.** Confirm global uniqueness with the Retail IT team first, keep the current keys, and keep UTC dates - no change now, but a wrong answer found after go-live means migrating live claims and ledger rows, and the date defect stays.
- **Recommended Answer:** Option A. Apply these edits:
  1. `01-executive-summary-scope-risks.md` §3, A-4, append: "The platform identifies a purchase by (branch, receipt number), which is correct whether POS Records numbers receipts per branch or per retailer."
  2. `02-ecosystem-overview.md` §6 Ecosystem-level rules, replace the Time rule with:
     ```markdown
     - **Time:** UTC for every stored and transmitted timestamp (ISO-8601); the web app renders dates in the tenant locale. Business calendar rules (the refund window of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-1, the day a daily branch refund report covers, and the take-back parking deadline of §17.4) use calendar dates in the tenant's time zone, an IANA zone id held in tenant configuration; POS purchase dates are read as dates in that zone.
     ```
  3. `13a-service-refund.md`: Business Logic, [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2: "more than 30 calendar days before today (UTC)" becomes "more than 30 calendar days before today in the tenant's time zone (§6)"; daily report bullet: "for one day (UTC)" becomes "for one calendar day in the tenant's time zone (§6)"; Tables Design, `refund_request_item`: add `branch_id` varchar(20) NOT NULL (copied from the request) and change the claim index to UNIQUE (`tenant_id`, `branch_id`, `receipt_number`, `receipt_line_id`) WHERE `claim_active`.
  4. `13d-service-loyalty.md`: Business Logic, take-back bullet: "looks up the EARNED movement for the tenant, the event's `branchId`, and its `receiptNumber` (A-4)"; parking sub-bullets: "the end of the day after `purchaseDate` in the tenant's time zone (§6)"; Earn movements bullet: "idempotent on (`tenant_id`, `branch_id`, `purchase_reference`)"; Tables Design: EARNED index UNIQUE (`tenant_id`, `branch_id`, `purchase_reference`) WHERE type = EARNED; `pending_take_back` adds `branch_id` varchar(20) NOT NULL and its index becomes (`tenant_id`, `branch_id`, `purchase_reference`).
  5. `11-api-contracts.md`: API-06, Idempotency and replay: "Our side: idempotent on (`tenant_id`, branch, purchase reference); a redelivered purchase is a no-op"; API-01 TBD - EXTERNAL marker, append: "whether a receipt number is unique per retailer or per branch; if per branch, `GET /v1/receipts/{receiptNumber}/refundable-items` takes a required `branchId` query parameter and SCR-01 gains a branch choice (a BRD follow-up for the REFUNDS owner)."
- **Why:** A composite key is correct under either numbering scheme and costs only index changes before any data exists, whereas B bets claim integrity ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2) and ledger integrity (LOYALTY/NFR-01) on an answer nobody has given. The BRD acceptance criterion counts days as the customer and the branch see them, which only a tenant time zone reproduces; stored timestamps stay UTC.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-05: Idempotency-Key replay has no store, no caller scope, and no in-flight rule

- **Where:** §11.1 (07), §15.1 (11), §17.1 API Standards and Error Handling (13a)
- **Type:** Architecture gap
- **Concern:** AP-02 and §15.1 require `Idempotency-Key` on the three money- and message-producing writes of refund-service (submit, cancel, decide), and §17.1 promises that "a replay returns the first response", but no chunk says where the first response is kept, for how long, for whom, or how a repeat that arrives while the first is still running is answered. §11.1 standardises only `outbox_event` and `inbox_event`, and its JSON rule forbids a stored response body. Without an in-flight rule, the realistic double submission (a double click, or the web app retrying after a gateway timeout) does not replay: the second `POST /v1/refund-requests` hits the active-claim index and answers 409 `ITEM_ALREADY_REFUNDED` for a request that was recorded, a repeated decision answers 409 `REFUND_ALREADY_DECIDED`, and a repeated cancellation finds the request no longer SUBMITTED and tells the customer the branch decided when it did not. Without a caller scope, a key reused by another user could replay that user's response, a leak REFUNDS/NFR-04 forbids. The §15.1 409 `CONFLICT` for "key reused with a different body" also needs a stored request hash that no table holds.
- **Options:**
  - **A.** A standard `idempotency_record` table in every module or service that accepts the header, scoped by tenant, caller, and operation, with an IN_PROGRESS state and a 24-hour expiry - one table and one interceptor per deployable; stored responses add a little storage.
  - **B.** Rely on the domain constraints (claim index, optimistic lock) and drop the replay promise - no new table, but routine retries surface as false errors on money and cancellation screens, contradicting AP-02 and REFUNDS 11 ("Error messages say what went wrong and what the user can do next").
- **Recommended Answer:** Option A. Apply these edits:
  1. `07-cross-cutting-concerns.md` §11.1, add after the Naming bullet:
     ```markdown
     - **Idempotency records:** every module or service that accepts `Idempotency-Key` keeps `idempotency_record` (`tenant_id`, `subject`, `operation`, `idempotency_key`, `request_hash`, `status` in (IN_PROGRESS, COMPLETED), `response_status`, `response_body`, `expires_at`), primary key (`tenant_id`, `subject`, `operation`, `idempotency_key`), where `subject` is the token subject and `operation` the method and route. The record is inserted as IN_PROGRESS in its own transaction before the command runs and completed in the command's transaction. A repeat with the same key and hash replays the stored response; a different hash returns 409 `CONFLICT`; a repeat while IN_PROGRESS returns 409 `REQUEST_IN_PROGRESS` with `Retry-After`; a command that ends in 5xx deletes its record so the client can retry. Records expire 24 hours after creation.
     ```
     and replace the JSON columns bullet with: "**JSON columns:** only for the outbox payload, provider raw responses kept for audit, and `idempotency_record.response_body`; never for queried business fields."
  2. `13a-service-refund.md` API Standards, Idempotency: "`Idempotency-Key` required on `POST /v1/refund-requests`, `POST /v1/refund-requests/{refundId}/cancellation`, and `POST /v1/refund-requests/{refundId}/decision`, scoped to the caller and the operation; replay and in-flight handling per the §11.1 idempotency records." Error Handling, Domain errors, add: "a repeat of a request still being processed -> 409 `REQUEST_IN_PROGRESS` (retry after `Retry-After`; the web app retries without showing an error)."
  3. `11-api-contracts.md` §15.1, Idempotency row, append: "; replay, caller scope, and in-flight rules per the §11.1 idempotency records."
- **Why:** "A replay returns the first response" is only true with a stored response and an in-flight state, and the double click the header exists for is exactly the concurrent case; scoping by caller closes the replay leak REFUNDS/NFR-04 forbids. Option A is one table and one interceptor per deployable, while B turns retries into misleading errors on the screens where users handle money.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-06: Payout attempts: the first attempt is not tied to a committed payout, and a crashed attempt stays PENDING forever

- **Where:** §17.2 (13b), §10 ADR-10 (06)
- **Type:** Corner case
- **Concern:** §17.2 says that on `REFUND_APPROVED` the service "creates the payout and fires the first attempt", with `Idempotency-Key` = the payout id, a UUIDv7 generated when the row is inserted. It does not say the first CardPay call happens only after that row commits; notification-service states this rule for its sends, payout-service does not. If the call runs inside the consumer transaction and the transaction then rolls back (pod killed, database error, consumer rebalance), the redelivered event inserts a new payout with a new id, and CardPay receives a second payout under a different key: a duplicate, against REFUNDS/NFR-01 and the "one payout per refund" guarantee of §14.6 item 7, which only holds for committed rows. Second, PENDING means "an attempt in flight", and the scheduler only fires attempts that are due (RETRY_WAIT with `next_attempt_at`). A pod that dies during an attempt, including on every rolling update (§11.3), leaves the payout PENDING with nothing to resume it: it is never retried, never reaches FAILED, never emits `PAYOUT_FAILED`, so the branch manager is never told ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1), and `payouts_in_retry` does not count it. The Deployment Strategy line "in-flight attempts survive a restart because the state is in the database" is true of the state, not of the attempt.
- **Options:**
  - **A.** Make every attempt, the first included, from committed state through the scheduler, each under a lease stored in `next_attempt_at`; an expired lease makes the payout due again as in doubt, re-sent with the same key - the first attempt waits for one scheduler tick after approval.
  - **B.** Keep the first attempt in the consumer, derive the key from the refund id, and add a watchdog that moves old PENDING rows to RETRY_WAIT - no scheduler delay, but a remote call inside a database transaction and a second recovery mechanism to build and test.
- **Recommended Answer:** Option A. Apply these edits to `13b-service-payout.md` unless stated otherwise:
  1. Business Logic, Payout creation, replace the first sentence with: "On `REFUND_APPROVED` the consumer transaction inserts the inbox row and one payout (PENDING, `next_attempt_at` = now) and makes no provider call; the unique (`tenant_id`, `refund_id`) index turns a redelivered or replayed event into a no-op, so a refund is never paid twice."
  2. Business Logic, Attempt, replace with: "**Attempt:** every attempt, the first included, is made by the scheduler from committed state. In one short transaction the scheduler claims a due payout (`FOR UPDATE SKIP LOCKED`), sets `next_attempt_at` to now plus the API-02 call timeout plus 60 seconds as the attempt lease, and inserts the `payout_attempt` row; it then calls CardPay (API-02) with `Idempotency-Key` = the payout id and records the outcome. A payout whose lease expires with no recorded outcome is due again, and its next attempt is IN_DOUBT (same key, or a status query). The window check treats a payout with an expired lease like RETRY_WAIT."
  3. State machine: add `PENDING --> PENDING: attempt lease expired, re-attempt in doubt`; Summary: "PENDING (due, or an attempt in flight under a lease)". Tables Design, `first_attempt_at`, `next_attempt_at` Notes: "`next_attempt_at` is the due time, or the lease expiry while an attempt is in flight". Metrics, add: "| `payout_attempt_leases_expired_total` | counter | - | Attempts interrupted by a crash or restart; alert above zero |". Deployment Strategy, Strategy: "rolling (§11.3); an attempt interrupted by a restart is re-run in doubt when its lease expires." Event Model, consumed `REFUND_APPROVED`, Effect: "Creates the payout; the scheduler makes the first attempt after commit (uses `aggregate_id` as the refund id, `approvedAmount`, `originalPaymentRef`, `referenceNumber`)".
  4. `06-principles-and-decisions.md` §10, ADR-10 How, append: "Attempts are made only by the scheduler from committed payout rows, never inside the consumer transaction; an attempt whose lease expires is resolved as in doubt."
- **Why:** The idempotency key prevents duplicates only if it exists in committed state before CardPay sees it, and every attempt needs a trigger that survives the crash it guards against; Option A gives both with the scheduler and unique index §17.2 already has. B keeps a remote call inside a database transaction (holding a connection through a CardPay timeout) and adds a second recovery path to test.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-07: CardPay results for in-doubt attempts are acknowledged and discarded

- **Where:** API-03 (11), §17.2 (13b)
- **Type:** Corner case
- **Concern:** API-03 and §17.2 match a CardPay result to its payout only by the provider payout reference (UNIQUE `provider_payout_ref` "matches API-03 results to the payout"), and "a result for an unknown payout is acknowledged, not applied, and alerted". The provider reference is learned from an API-02 response, so in exactly the in-doubt case R-01 is about (timeout or lost response) the payout has no provider reference yet. When CardPay then reports the outcome through API-03, the result matches nothing, is acknowledged (so CardPay stops redelivering), and is dropped. If CardPay answers the next same-key attempt with a duplicate-request error rather than the original result (unknown until API-02 is documented), the payout ends FAILED after the retry window although the money left: the branch manager is told the payout failed, the late-confirmation path of §17.2 cannot fire because its confirming result was discarded, and a manual re-payout under §20.1.7 pays twice. The rule is also stated four times (API-03, and §17.2 Integrations, API Standards, and Error Handling), so a fix made in one place would leave three stale copies, against the chunk 11 rule that 13x never restates contract fields.
- **Options:**
  - **A.** Store every result before acknowledging it; match first on our identifiers that CardPay echoes (the payout id sent as the idempotency key, or the refund reference number sent in the API-02 body), then on the provider reference; keep unmatched results for re-matching; state the rule once in API-03 - one small table; which identifier CardPay echoes is added to the existing TBD marker.
  - **B.** Answer an unmatched result with a retryable error so CardPay redelivers it later - no table, but it depends on CardPay's redelivery policy (TBD) and loses the result once redelivery stops.
- **Recommended Answer:** Option A. Apply these edits:
  1. `11-api-contracts.md` API-03, Idempotency and replay row, replace with: "Our side: every result is stored in `payout_result` before it is acknowledged. It is matched to its payout by the payout id (sent as the idempotency key) or the refund reference number (sent in the API-02 body), whichever CardPay returns, and otherwise by the provider payout reference. A duplicate result is a no-op. A result that matches no payout stays UNMATCHED with an alarm and is re-matched whenever an API-02 response or status query records a provider payout reference." TBD - EXTERNAL marker, append: "which of our identifiers (the idempotency key or the reference number) CardPay returns in the result."
  2. `13b-service-payout.md` Tables Design, add:
     ```markdown
     | `payout_result` | `id`, `payout_id`, `provider_payout_ref`, `echoed_reference`, `outcome`, `status`, `received_at` | uuid, uuid, varchar(100), varchar(100), varchar(20), varchar(10), timestamptz | `payout_id` NULL while UNMATCHED; status in (MATCHED, UNMATCHED); INDEX (`tenant_id`, `status`, `received_at`) | Every API-03 result, stored before acknowledgement (API-03) |
     ```
     Business Logic, Unknown outcome, append: "A result that arrives through API-03 for an in-doubt attempt is applied through the API-03 matching rule (§15), so a confirmation received while the payout waits is never lost." Metrics, add: "| `payout_results_unmatched` | gauge | - | API-03 results waiting for a match; alert above zero |".
  3. `13b-service-payout.md`, replace the restatements with pointers: Integrations (CardPay, Inbound) Failure Handling: "Signature check and matching per API-03 (§15)"; API Standards, Idempotency: "per API-03 (§15)"; Error Handling, Domain errors: "results that match no payout: per API-03 (§15); a duplicate result is a no-op."
- **Why:** The in-doubt case is the one ADR-10 and R-01 are built for, and it is precisely the case where the provider reference is missing; storing before acknowledging is the only option that loses nothing whatever CardPay's redelivery policy turns out to be (REFUNDS/NFR-01, "never lost"). Stating the rule once in API-03 applies the SDD's own one-home rule for contract fields.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-08: Customers are not told of an approval, and no refund-level fact exists when a payout fails

- **Where:** §17.3 (13c), §14.5.1, §14.7, §14.9 (10), §17.1 (13a), §13 (09), §7.3 (03), §8.4.1 and §8.5.2 (05), API-04 and API-05 (11), §16.3 (12), §18.1 (14)
- **Type:** Missing scenario
- **Concern:** The REFUNDS BRD says three times that the customer hears about every step: "Customers are told the outcome at each step" (REFUNDS 04 Project Scope), "The customer is told the outcome at each step" (REFUNDS 05 Summarized Workflow, step 4), and "customers hear about every step" (REFUNDS 11 Summary); [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-1 reads "when the branch manager approves it, then the payout is sent and the customer is told". notification-service messages SUBMITTED, CANCELLED, REJECTED, and PAID only, so a customer whose refund was approved, possibly for a lower amount with a reason ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1), hears nothing until the payout is confirmed, and nothing at all if it fails. The failure path has a second, structural gap: the §14.7 re-publication doctrine lets only refund-service consume payout facts and re-publish refund-level facts, but refund-service re-publishes only success (`REFUND_PAID`); on `PAYOUT_FAILED` it sets a flag in the branch queue and publishes nothing. No consumer can therefore act on a failed payout, and "the branch manager is told" ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 and AC-2) is met only if the manager happens to open the queue. This is distinct from the inline markers on the manual resolution procedure (§20.1.7) and on the retry action (§17.2 Future Enhancements).
- **Options:**
  - **A.** notification-service also consumes `REFUND_APPROVED` (customer email and SMS with the approved amount, and the reason for a partial approval); refund-service re-publishes the failure as `REFUND_PAYOUT_FAILED`, which notification-service turns into an email to the branch's managers; the queue flag stays - one new event and two new message types, and API-05 must also resolve a branch's managers (Keycloak side TBD - external).
  - **B.** Add only the approval message and keep the queue flag as the way the branch manager is told - smallest change, but a failed payout still reaches nobody unless the queue is opened, and the doctrine stays one-sided.
  - **C.** State in §17.3 that the four existing messages plus [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) tracking realise "told at each step", as a BRD follow-up - no change, but it contradicts [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-1 and three scope statements.
- **Recommended Answer:** Option A. Apply these edits:
  1. `10-events-hub.md` §14.5.1: `REFUND_APPROVED` Consumers becomes "payout-service, notification-service", and its why gains "; the customer is told the approved amount ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope))". Add row:
     ```markdown
     | `REFUND_PAYOUT_FAILED` | notification-service | `referenceNumber`, `branchId`, `approvedAmount`, `attempts`, `failedAt` | The payout of an approved refund was not confirmed within the ADR-10 retry window · [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1, when refund-service applies `PAYOUT_FAILED` · the branch's managers are told by email; the request stays APPROVED and flagged in the branch queue | committed |
     ```
     Add §14.9.8 (and the event to the §14.9.0 `Money` "Used by" list and a §14.9.99 row "| `REFUND_PAYOUT_FAILED` | ✓ | §14.9.8 | committed |"):
     ```markdown
     ### 14.9.8 `REFUND_PAYOUT_FAILED` - committed

     **Producer:** refund-service · **Topic:** `refunds-platform-refund-events` · **Key family:** tenant-keyed

     | Field | Type | Required | Notes |
     |---|---|---|---|
     | `referenceNumber` | string | R | Shown to the branch manager |
     | `branchId` | string | R | Selects the managers to tell |
     | `approvedAmount` | ref(Money) | R | The amount that could not be paid |
     | `attempts` | int | R | From `PAYOUT_FAILED` |
     | `failedAt` | timestamp | R | From `PAYOUT_FAILED` |
     ```
     Figure 10: the refund-topic edge to notification-service lists "REFUND_SUBMITTED, REFUND_CANCELLED, REFUND_APPROVED, REFUND_REJECTED, REFUND_PAID, REFUND_PAYOUT_FAILED". §14.7, Payout re-publication doctrine: "... consumed only by refund-service, which re-publishes the refund-level facts (`REFUND_PAID` on success, `REFUND_PAYOUT_FAILED` when the retry window closes); notification-service and loyalty-service react to refund facts, never to payout facts."
  2. `13a-service-refund.md`: Business Logic, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1, append: "and writes `REFUND_PAYOUT_FAILED` in the same transaction, which tells the branch's managers by email; the flag in the branch queue stays." Output and Integrations (Kafka, Outbound): add `REFUND_PAYOUT_FAILED`. Event Model, published: `REFUND_APPROVED` Consumers "payout-service, notification-service" and Consumer Specs "groups `payout-service` (inbox dedup plus unique `refund_id`) and `notification-service` (inbox dedup)"; add row:
     ```markdown
     | `REFUND_PAYOUT_FAILED` | refund-service | `refunds-platform-refund-events`, key `aggregate_id` | notification-service | group `notification-service`, inbox dedup | `referenceNumber`, `branchId`, `approvedAmount`, `attempts`, `failedAt` (§14.9.8) | At-least-once, exactly-once effect |
     ```
  3. `13c-service-notification.md`: What: "The refund messaging bounded context: turns the refund events that the customer, or the branch's managers, must be told about into messages sent through MsgHub." Input: add `REFUND_APPROVED` and `REFUND_PAYOUT_FAILED`. Business Logic table, add rows:
     ```markdown
     | `REFUND_APPROVED` | Email and SMS with the approved amount; a partial approval adds the reason | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 6 and AC-1; [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) |
     | `REFUND_PAYOUT_FAILED` | Email to the managers of `branchId` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 and AC-2 |
     ```
     Contact resolution, append: "For `REFUND_PAYOUT_FAILED` the port resolves the users holding `BRANCH_MANAGER` with that `branch_id` (API-05); nothing is stored." Tables Design, `notification`: `customer_id` becomes nullable and `recipient` varchar(20) in (CUSTOMER, BRANCH_MANAGERS) NOT NULL is added. Error Handling, Validation errors: "an event missing a field its plan needs (§14.9) is dead-lettered." Event Model, consumed, add rows:
     ```markdown
     | `REFUND_APPROVED` | refund-service | `refunds-platform-refund-events` | Email and SMS with the approved amount, and the reason when `partial` (uses `customerId`, `referenceNumber`, `approvedAmount`, `partial`, `decisionReason`) | Inbox on (`notification-service`, `event_id`) plus the unique send-log key |
     | `REFUND_PAYOUT_FAILED` | refund-service | `refunds-platform-refund-events` | Email to the managers of the branch (uses `branchId`, `referenceNumber`, `approvedAmount`) | Same |
     ```
  4. `09-services-summary.md` §13: refund-service Output adds `REFUND_PAYOUT_FAILED`; notification-service Overview "Customer and branch manager messages for refund outcomes", Responsibility adds "and email to a branch's managers when a payout fails", Input adds `REFUND_APPROVED` and `REFUND_PAYOUT_FAILED`.
  5. `03-users-and-use-cases.md` §7.3, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) Events: add `REFUND_PAYOUT_FAILED`.
  6. `05-workflows-and-sequences.md`: Figure 4 node H "APPROVED: REFUND_APPROVED, customer told the approved amount", node M "Stays APPROVED: PAYOUT_FAILED, then REFUND_PAYOUT_FAILED; branch managers emailed and the request flagged in the queue"; Figure 7: after `K-)PS: REFUND_APPROVED` add `K-)N: REFUND_APPROVED, customer told the approved amount`, and in the failure branch after `K-)R: PAYOUT_FAILED, stays APPROVED, branch manager alerted` add `R-)K: REFUND_PAYOUT_FAILED` and `K-)N: REFUND_PAYOUT_FAILED, branch managers emailed`.
  7. `11-api-contracts.md`: API-04 Purpose adds "[REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 6 and E1"; API-05 Purpose adds "and the email of a branch's managers for `REFUND_PAYOUT_FAILED`", and its TBD - EXTERNAL marker adds "the read of the users holding a realm role with a given `branch_id` attribute".
  8. `12-centralized-user-roles.md` §16.3, Service identities: "notification-service holds Keycloak's own user-read role for API-05 (customers, and the branch managers of a branch), which is the provider's scheme (§15.1)."
  9. `14-performance-and-capacity.md` §18.1, Customer messages per month row: "At most 7,200 (21,600 at the seasonal rate) | ... | Derived: at most 6 per request, 2 at submission, 2 at approval, and 2 at payment (§17.3); branch manager emails only on failed payouts".
- **Why:** Three BRD statements and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-1 make the approval message a requirement, not an enhancement, and E1 requires that the manager be told, which a pull-only flag does not guarantee; re-publishing the failure makes the §14.7 doctrine symmetric, so no consumer ever needs payout facts. The accepted cost is one event, two templates, and a wider API-05 read; B leaves failures silent and C contradicts the BRD.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-09: The REFUNDS/NFR-02 target leaves out POS Records, Keycloak, the member endpoints, and what counts as disruption

- **Where:** §18 NFR table (14), §4 (01), §6 (02)
- **Type:** NFR shortfall
- **Concern:** §18 turns REFUNDS/NFR-02 ("no more than 2 hours of disruption a month") into "monthly availability of the customer and branch manager endpoints at least 99.72%", realised by rolling deploys, readiness gates, and core replicas. It does not define a disrupted minute, and it does not budget the synchronous dependencies that decide the number. Refund intake calls POS Records synchronously at [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 2 and 5 with no fallback (503 "try again later", §12 INT-03), so every POS Records outage is a customer-visible disruption, yet POS availability is unknown (API-01 is TBD - external) and absent from §4. Sign-in and token refresh depend on Keycloak, and every call on the API gateway, and §6 gives neither a replica count. The member endpoints are outside the target, although LOYALTY Business Objective 2 wants members to "check their points at any time", they run in the same pods, and §18's premise that "the two BRDs measure different qualities" overlooks that LOYALTY states the same quality without a measure: a cross-BRD quality difference that is neither decided nor flagged. The Kafka coupling through readiness is raised separately in OI-03.
- **Options:**
  - **A.** Define the SLI at the gateway over customer, member, and branch manager endpoints, count POS-caused 503s as disruption (the customer's view) while reporting them separately, run Keycloak and the gateway with at least two replicas, add R-08 for POS Records with an availability ask to the Retail IT team, and extend the target to the member endpoints as a LOYALTY follow-up - honest to the customer's view; part of the number depends on a partner.
  - **B.** Measure only platform components and exclude partner-caused failures - the number is fully under our control, but it can be green while no customer can submit a refund.
  - **C.** Add a local receipt read model fed from POS Records so intake survives POS outages - removes the dependency, but it is a new feed with storage of every receipt and staleness rules, beyond this release (§2.2).
- **Recommended Answer:** Option A. Apply these edits:
  1. `14-performance-and-capacity.md` §18: replace the last sentence of the intro with "REFUNDS states availability as a measure (REFUNDS/NFR-02); LOYALTY states it only as Business Objective 2 ('at any time'), so the member endpoints share the REFUNDS/NFR-02 target, a BRD follow-up for the LOYALTY owner to confirm." Replace the REFUNDS/NFR-02 row with:
     ```markdown
     | REFUNDS/NFR-02 | At most 120 disrupted minutes per calendar month (99.72%). A minute is disrupted when more than 5% of the requests to the customer, member, or branch manager endpoints fail at the API gateway with 5xx, 503 `RECEIPT_LOOKUP_UNAVAILABLE` included; POS-caused minutes are also reported on their own | Rolling deploys, readiness gates and core replicas (§11.3), API gateway and Keycloak with at least two replicas each, R-08 |
     ```
  2. `01-executive-summary-scope-risks.md` §4, add row:
     ```markdown
     | R-08 | Refund intake calls POS Records synchronously at REFUNDS/UC-01 steps 2 and 5 with no fallback, so every POS Records outage is disruption counted against REFUNDS/NFR-02. | M | M | Agree an availability commitment and maintenance windows for the receipt lookup with the Retail IT team as part of API-01; circuit breaker and a plain-language 503 (§12 INT-03); POS-caused minutes reported separately (§18). | [NEEDS CLARIFICATION: risk owner] |
     ```
  3. `02-ecosystem-overview.md` §6, IAM / AuthN Notes and API Gateway Notes, append: "At least two replicas (REFUNDS/NFR-02, §18)."
- **Why:** REFUNDS/NFR-02 is written from the customer's side ("customers can use the portal at any time"), so a partner outage that blocks refund intake is disruption whatever its cause; naming it, measuring it, and giving it a risk row is what makes the 99.72% testable (the REFUNDS UAT case TC-NFR-02 observes disruption, not component uptime). B hides the dominant risk and C is a new integration the release does not need.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-10: The REFUNDS/NFR-01 check joins two private databases and never compares with CardPay

- **Where:** §18 NFR table (14), §17.1 (13a), §17.2 (13b), API-02 and §15.6 (11)
- **Type:** NFR shortfall
- **Concern:** The technical target for REFUNDS/NFR-01 is "0 APPROVED requests without a payout row older than the relay lag; a daily check compares PAID requests with SUCCEEDED payouts". APPROVED and PAID live in the `refund` schema of the core database and payout rows in the separate `payout` database, and payout-service exposes no read API, so the check can only be built by reading two private databases, which ADR-06, AP-04, and §8.1.3 forbid (and which would block the ADR-01 extraction). It also checks the wrong boundary for half of the measure: a duplicate payout happens at CardPay (R-01: the key not honoured; a manual re-payout under §20.1.7), and comparing our two databases can never see a payout CardPay executed twice. Finally, "a payout row exists" passes for a payout stuck in PENDING (OI-06) or for a `REFUND_APPROVED` parked in `payout-service.dlq`, so missing payouts stay invisible to the very check meant to count them.
- **Options:**
  - **A.** Two daily checks, each inside its owner: refund-service flags any APPROVED request whose payout status is still PENDING when the ADR-10 retry window plus one hour has passed since the decision; payout-service compares its SUCCEEDED payouts with CardPay's own payout records - no cross-database read; the provider comparison depends on CardPay offering a report or a query by date (TBD - external).
  - **B.** One reconciliation job with read access to both databases - a single query, but it breaks data ownership and blocks the extraction of either side.
  - **C.** A reporting store fed by both topics - clean ownership, but a new component that §2.2 excludes from this release.
- **Recommended Answer:** Option A. Apply these edits:
  1. `14-performance-and-capacity.md` §18, replace the REFUNDS/NFR-01 row with:
     ```markdown
     | REFUNDS/NFR-01 | 0 duplicate and 0 missing payouts per month, verified daily by two checks, each inside its owner: refund-service alerts on any APPROVED request whose payout status is still PENDING when the ADR-10 retry window plus 1 hour has passed since the decision; payout-service compares the previous day's SUCCEEDED payouts with CardPay's payout records and alerts on any payout CardPay shows twice or that only one side has | ADR-10, §14.6 item 7, §17.1, §17.2 |
     ```
  2. `13a-service-refund.md`: Business Logic, add bullet "**Payout watchdog (REFUNDS/NFR-01):** a daily job flags APPROVED requests whose payout status is still PENDING when the ADR-10 retry window plus 1 hour has passed since `decided_at`."; Metrics, add "| `refund_payout_outcome_overdue` | gauge | - | APPROVED requests with no payout outcome after the window; alert above zero |".
  3. `13b-service-payout.md`: Business Logic, add bullet "**Provider reconciliation (REFUNDS/NFR-01):** a daily job compares the previous day's SUCCEEDED payouts with CardPay's payout records and alerts on any difference."; Input, add "| Schedule | Provider reconciliation | Daily comparison with CardPay's payout records |"; Metrics, add "| `payout_reconciliation_mismatches_total` | counter | - | Payouts CardPay shows twice or only one side has; alert above zero |".
  4. `11-api-contracts.md`: API-02 TBD - EXTERNAL marker, append "whether CardPay offers a payout report or a query by date for daily reconciliation"; §15.6, API-02 row, Fields still TBD, append "reconciliation report".
- **Why:** Option A verifies both halves of "never lost or paid twice" at the boundary where each can go wrong (our saga for missing payouts, CardPay for duplicates) while keeping the private-database rule the rest of the SDD enforces. B trades that rule for one query, and C adds a component the release excludes.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-11: Take-backs closed before a late POS purchase are never applied, and the LOYALTY NFR targets cannot see it

- **Where:** §17.4 (13d), §18 NFR table (14)
- **Type:** Corner case
- **Concern:** A take-back whose purchase is not yet recorded is parked until "the end of the day after `purchaseDate`" and then CLOSED "as not a member purchase"; when a purchase arrives, only PARKED take-backs are applied. The design itself expects the POS feed to fall behind (§12 INT-03 "until the feed catches up", §18.3 "POS member-purchase catch-up"), so a feed delay past that deadline turns a real member purchase into a CLOSED take-back, and when the purchase finally arrives it earns points that are never taken back, against [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1 and its acceptance criterion. The LOYALTY/NFR-01 target cannot catch this: "balance equals the sum of movements" is true by construction, because §17.4 updates the balance in the same transaction as each movement, so the daily reconciliation tests the projection, never whether the movements are the right ones. The LOYALTY/NFR-02 row also exempts parked take-backs ("parked take-backs apply as soon as their purchase arrives") while the BRD measure ("within 1 hour of the refund being paid") states no exception, and a refund paid on the day of purchase, before that day's feed, always breaks it. The partial-refund amount question is already flagged (R-04, §17.4) and is not repeated here.
- **Options:**
  - **A.** Keep CLOSED take-backs matchable, so a late purchase applies them in its own transaction and raises an alert; alert on PARKED rows older than two days; restate the LOYALTY/NFR-01 target as source correctness; flag the LOYALTY/NFR-02 exception to the LOYALTY owner - one lookup per earn movement and one more alert; the BRD owner decides the exception.
  - **B.** Never close a take-back and keep it PARKED until a purchase arrives - simplest matching, but every refund of a non-member purchase parks forever and the "not a member purchase" signal disappears.
- **Recommended Answer:** Option A. Apply these edits:
  1. `13d-service-loyalty.md` Business Logic: replace the take-back sub-bullet "Not found, and that time has passed: the take-back is closed as not a member purchase." with "Not found, and that time has passed: the take-back is CLOSED as not a member purchase so far. A CLOSED take-back stays matchable: if an EARNED movement for the same purchase arrives later (a delayed POS feed, §18.3), the take-back is applied in that transaction, marked APPLIED, and counted in `points_take_backs_applied_late_total` with an alert."; Earn movements bullet: "applies any parked or closed take-back for that purchase"; Balance integrity bullet, append: "An alert fires when a PARKED take-back is older than two days, the sign of a stalled feed."
  2. `13d-service-loyalty.md` Metrics, add: "| `points_take_backs_applied_late_total` | counter | - | Take-backs applied after they were closed; alert above zero |".
  3. `14-performance-and-capacity.md` §18: LOYALTY/NFR-01 Technical target becomes "Every paid refund of a member purchase has exactly one take-back, including purchases recorded after the refund was paid; the balance equals the sum of movements at each daily reconciliation; no PARKED take-back is older than two days". In the LOYALTY/NFR-02 row, replace "parked take-backs apply as soon as their purchase arrives" with "when the purchase is recorded after the refund is paid, the take-back applies in the transaction that records it; this exception to the one-hour measure is a BRD follow-up for the LOYALTY owner" (the consumer-lag marker stays).
- **Why:** A delayed feed is a scenario the SDD already plans for, so the closing rule must not make it irreversible; Option A keeps the design's "not a member purchase" signal and turns the only silent balance error into an alert. B trades that signal for unbounded parked rows, and only a source-level target matches what LOYALTY/NFR-01 measures ("zero balance complaints upheld").
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-12: Any signed-in customer can read, and claim, any receipt

- **Where:** §17.1 (13a), §16.2 (12), §4 (01)
- **Type:** Risk
- **Concern:** `GET /v1/receipts/{receiptNumber}/refundable-items` needs only `refund.receipt.read`, which every self-registered `CUSTOMER` holds, and checks nothing that ties the caller to the receipt, so anyone who knows or guesses a receipt number (receipt numbers are often short and sequential per till) sees what was bought, where, when, and for how much. `POST /v1/refund-requests` then lets that caller file a refund on a stranger's purchase: the payout still goes to the original card (REFUNDS 02 Assumption 2), but the items are claimed so the real purchaser can no longer refund them ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2), the messages go to the requester, and once paid the purchaser's points are taken back ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1). REFUNDS/NFR-04 protects customer personal data, and the REFUNDS persona table limits the customer to "own requests only". The only control is the gateway's generic per-user rate limit (§16.2), the fields the lookup returns are not restricted although the POS response behind it includes the original payment reference (A-6), and §4 has no risk for any of it.
- **Options:**
  - **A.** Proof of possession: the lookup also takes a second fact printed on the receipt (for example the total) and answers 404 `RECEIPT_NOT_FOUND` on a mismatch - the strongest control, but it changes [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1, so only the REFUNDS owner can adopt it.
  - **B.** Limit and detect without changing the flow: a dedicated per-customer lookup limit, an alert on bursts of not-found answers, a minimal response, and the residual risk recorded as R-09 with A as the BRD follow-up - no flow change; a known receipt number still discloses its lines.
  - **C.** Allow online refunds only for purchases linked to the signed-in member - removes the exposure, but excludes non-members, contradicting REFUNDS 04 In Scope.
- **Recommended Answer:** Option B. Apply these edits:
  1. `13a-service-refund.md`: Business Logic, [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2, append: "The response carries, per line, only the description, quantity, amount with currency, and the refundable flag, plus the branch name and purchase date; never the original payment reference or any member data." Constraints, add: "A customer can look up at most 10 receipts per rolling hour (429 `RATE_LIMITED`, enforced at the API gateway on this route); an alert fires when one customer receives more than 20 `RECEIPT_NOT_FOUND` answers in a day."
  2. `12-centralized-user-roles.md` §16.2, step 2, append: "with a dedicated limit on the receipt lookup (§17.1)."
  3. `01-executive-summary-scope-risks.md` §4, add row:
     ```markdown
     | R-09 | A signed-in customer who knows or guesses a receipt number sees that purchase's lines and can file a refund on it, claiming its items (REFUNDS/UC-01 BR-2) and, once paid, taking back the purchaser's points; the money still goes to the original card (REFUNDS 02 Assumption 2). | M | M | Minimal lookup response, per-customer lookup limit, and alert (§17.1); proof of possession (a second receipt fact entered with the number) is a BRD follow-up for the REFUNDS owner because it changes REFUNDS/UC-01 step 1. | [NEEDS CLARIFICATION: risk owner] |
     ```
- **Why:** B closes enumeration and over-disclosure now without touching an approved BRD flow, and puts the residual risk in front of an owner; A is the stronger control but changes [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1, and C contradicts the BRD scope. Ten lookups an hour is far above what a genuine customer needs, since each refund request starts from one receipt.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-13: Observability does not measure REFUNDS Business Objective 1 and carries no tenant context

- **Where:** §11.4 (07), §17.1 Metrics (13a), §20.1.6 (16)
- **Type:** Inconsistency
- **Concern:** The headline REFUNDS objective is to "cut the average time from request to payout from 10 days to 3 days" (REFUNDS 01, Business Objective 1), yet no metric measures submission to payout: `refund_time_to_decision_seconds` is labelled "Business objective 1 tracking (request to payout)" but measures submission to decision, and the refund-flow dashboard (§11.4) shows statuses, pending and failed payouts, and take-back lag, not time to payout, so the product cannot show whether it met its main goal. Separately, §11.4 bars `tenant_id` from INFO logs and defines no other tenant context, and no metric in §17.1 to §17.4 carries a tenant label, so no log line or metric can scope an incident to a tenant. That contradicts the platform rule that logs carry correlation id and tenant context, and it makes the tenant-specific incident response of §20.1.6 impossible to perform, even though ADR-03 designs for a second retailer.
- **Options:**
  - **A.** Add a submission-to-PAID histogram and correct the decision metric's purpose; add `tenant_ref`, an opaque non-reversible alias from tenant configuration, to every log line and as a label on RED and business metrics - one metric, one log field, one label whose cardinality equals the number of tenants.
  - **B.** Derive time to payout from the daily report query only, and switch to DEBUG to see `tenant_id` during an incident - no new fields, but DEBUG needs a rolling restart in the middle of the incident (§11.5 has no hot reload), and nothing trends the objective.
- **Recommended Answer:** Option A. Apply these edits:
  1. `13a-service-refund.md` Metrics: `refund_time_to_decision_seconds` Purpose becomes "Submission to decision: the 'average time to decision' of the daily branch refund report (REFUNDS 09)"; add row "| `refund_time_to_paid_seconds` | histogram | - | Submission to PAID, observed on APPROVED to PAID: REFUNDS Business Objective 1 (average of 3 days or less) |".
  2. `07-cross-cutting-concerns.md` §11.4: Logging, append "Every line carries `tenant_ref`, an opaque, non-reversible alias of the tenant from tenant configuration, never the `tenant_id`."; Metrics, append "Every RED and business metric carries a `tenant_ref` label in addition to the labels listed in §17.1 to §17.4."; Dashboards, the refund-flow dashboard becomes "(requests by status, average and 90th percentile time from submission to PAID against the 3-day objective, payouts pending and failed, take-back lag)".
- **Why:** Business Objective 1 is the reason the portal exists, so it must be measured continuously, and the current label claims coverage that does not exist. A tenant alias satisfies both platform rules at once (tenant context in logs, no `tenant_id` at INFO) and is what §20.1.6 needs; B leaves the objective untracked and adds a restart to every tenant incident.
- **Status:** Accepted - applied (see Resolution Log)

---

### OI-14: The payout retry window is restated twenty times outside ADR-10

- **Where:** §10 ADR-10 (06) as the home; restatements in §1 and §5 (01), §8.1.2 (04), §8.4.1 (05), ADR-01 (06), §12 INT-01 (08), §13 (09), §14.5.2 (10), API-02 (11), §17.1 (13a), §17.2 (13b), §18.3 (14)
- **Type:** Duplication
- **Concern:** The length of the payout retry window, derived from [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 ("the branch manager is told if it still fails after one day"), is decided in ADR-10 and restated as "24-hour", "24 hours", "one-day", or "a day" twenty more times: the §1 capabilities and §5 glossary, §8.1.2, Figure 4 and its summary, the ADR-01 Why, §12 INT-01, the §13 payout-service row, the §14.5.2 `PAYOUT_FAILED` row, API-02, the §17.1 Input table, eight places in §17.2 (What, Business Logic, two state machine labels, the state machine summary, Integrations, Tables Design, Constraints), and §18.3. The value is a business parameter the REFUNDS owner can reasonably change (business days, 48 hours), and every change would need about twenty edits in lockstep; the reconciliation step checks names, not scalars, so a partial edit would leave the state machine, the event contract, and the integration policy disagreeing silently.
- **Options:**
  - **A.** One home: ADR-10 states the window and its BRD source; every other place says "the ADR-10 retry window" without the number - about twenty one-phrase edits once, then one edit per future change.
  - **B.** Keep the restatements and add the value to the reconciliation checklist - no rewrite now, but every change still needs twenty edits and a new check to maintain.
- **Recommended Answer:** Option A. ADR-10 in `06-principles-and-decisions.md` stays the only place with the number ("a 24-hour retry window after the first attempt", citing [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1). Replace the number with the reference everywhere else:
  1. `01-executive-summary-scope-risks.md`: §1 capability "with the ADR-10 retry window and a failure signal back to the branch"; §5 Retry window "The window after the first payout attempt during which payout-service keeps retrying; its length is set in ADR-10 ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1)."
  2. `04-architecture-style-and-diagrams.md` §8.1.2 and `06-principles-and-decisions.md` ADR-01 Why: "payouts are retried within the ADR-10 retry window".
  3. `05-workflows-and-sequences.md` Figure 4 node J "Payout confirmed within the retry window (ADR-10)?", and its Summary "at the end of its retry window (ADR-10)".
  4. `08-integrations.md` INT-01, Retries & Backoff: "Exponential backoff with jitter inside the ADR-10 retry window from the first attempt".
  5. `09-services-summary.md` §13, payout-service Responsibility: "retry window (ADR-10)".
  6. `10-events-hub.md` §14.5.2, `PAYOUT_FAILED`: "The ADR-10 retry window closed without a confirmed payout".
  7. `11-api-contracts.md` API-02, Timeout, retries, circuit breaker: "§12 INT-01; retries run inside the ADR-10 retry window".
  8. `13a-service-refund.md` Input, `PAYOUT_FAILED`: "The payout's retry window (ADR-10) closed without success".
  9. `13b-service-payout.md`: What "retried within the ADR-10 retry window"; Business Logic "When the ADR-10 retry window closes without success"; state machine labels "next attempt is due inside the retry window" and "retry window closed"; state machine Summary "or the retry window closes"; Integrations "backoff inside the ADR-10 retry window"; Tables Design note "The ADR-10 window starts at `first_attempt_at`"; Constraints "Retries run inside the ADR-10 retry window".
  10. `14-performance-and-capacity.md` §18.3: "the ADR-10 retry window bounds the retry work".
- **Why:** One fact, one home is the rule the SDD applies to its contract registries (chunks 10 to 12), and the retry window is a contract parameter that drives `PAYOUT_FAILED`, the branch manager's alert, and INT-01; Option A makes a future change a single edit, while B only detects drift after it has happened.
- **Status:** Accepted - applied (see Resolution Log)

---

## Resolution Log

<!-- When an open item is accepted (or adjusted) and applied, move its summary here with a pointer to the SDD update (chunk + heading). Audit trail. -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-28 | 01 §3 (A-9); 04 §8.1.2; 06 §10 ADR-01; 02 §6 | Accepted recommendation |
| OI-02 | 2026-09-28 | 06 §10 ADR-11; 07 §11.2; 11 §15.1, API-03, API-06; 13c §17.3; 04 §8.3 | Accepted recommendation |
| OI-03 | 2026-09-28 | 07 §11.3; 13a to 13d Deployment Strategy; 01 §4 R-07; 10 §14.6; 13c §17.3 | Accepted recommendation |
| OI-04 | 2026-09-28 | 01 §3 A-4; 02 §6 rules; 13a §17.1; 13d §17.4; 11 API-01, API-06 | Accepted recommendation |
| OI-05 | 2026-09-28 | 07 §11.1; 13a §17.1; 11 §15.1 | Accepted recommendation |
| OI-06 | 2026-09-28 | 13b §17.2; 06 §10 ADR-10 | Accepted recommendation |
| OI-07 | 2026-09-28 | 11 API-03; 13b §17.2 | Accepted recommendation |
| OI-08 | 2026-09-28 | 10 §14.5.1, §14.7, §14.9.8, §14.9.99; 13a §17.1; 13c §17.3; 09 §13; 03 §7.3; 05 §8.4.1, §8.5.2; 11 API-04, API-05; 12 §16.3; 14 §18.1 | Accepted recommendation |
| OI-09 | 2026-09-28 | 14 §18; 01 §4 R-08; 02 §6 | Accepted recommendation |
| OI-10 | 2026-09-28 | 14 §18; 13a §17.1; 13b §17.2; 11 API-02, §15.6 | Accepted recommendation |
| OI-11 | 2026-09-28 | 13d §17.4; 14 §18; 05 §8.4.2 | Accepted recommendation |
| OI-12 | 2026-09-28 | 13a §17.1; 12 §16.2; 01 §4 R-09 | Accepted recommendation |
| OI-13 | 2026-09-28 | 13a §17.1 Metrics; 07 §11.4 | Accepted recommendation |
| OI-14 | 2026-09-28 | ADR-10 stays the home of the retry window; references in 01, 04, 05, 06, 08, 09, 10, 11, 13a, 13b, 14, 16 | Accepted recommendation |

---

## Reviewer Notes

<!-- Optional. Free-form notes that did not crystallise into a numbered open item. -->

- **Customer self-registration is asserted, not designed:** §16.3 and §16.6 grant `CUSTOMER` through self-registration "with verified email and phone", but no flow, integration row, or message path realises the phone verification (the SMS of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 depends on it, since a missing phone skips the SMS), how `tenant_id` is stamped on a self-registered account, or whether a person who shops at two retailers can hold two accounts in the one realm. No BRD use case covers registration and §2 does not scope it in or out; a candidate Missing scenario for the next review round.
- **Tenant-index rule exceptions:** §11.1 says every index starts with `tenant_id`, but every primary key is on `id` alone and the inbox dedup key is (`consumer`, `event_id`) (§14.2.1). State these exceptions in §11.1 (UUIDv7 values are globally unique) or make the keys composite, so the tenant-index rule has no silent exception.
- **Customer-to-member link has two homes:** the Keycloak `member_id` attribute (§16.12.1) and `member.customer_id` (§17.4). Whatever A-5 settles, one should be the source and the other derived from it.
- **Segregation of duties:** nothing stops a branch manager from deciding a request filed from their own customer account; a `decided_by` versus `customer_id` check covers the one-account case, and a person-level rule is a question for the REFUNDS owner.
- **Access-token lifetime:** §16.8 revokes access "at the next token refresh", but no token lifetime is stated, so a disabled branch manager can keep deciding refunds until the token expires; a short staff lifetime belongs in §16.2.
- **§7.3 entry points:** the [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) row omits `GET /v1/refund-requests/{refundId}`, which the branch manager uses at step 3 ("opens a request").
- **Schedules missing from Input tables:** loyalty-service closes parked take-backs and reconciles balances daily, and notification-service runs a retry scheduler, but neither Input table lists a Schedule row the way §17.2 does.
- **Alerts without procedures:** outbox backlog age, balance drift, notification FAILED, and the open receipt-lookup circuit page on-call with no §20 procedure beyond the existing templates; every alert should map to one.
- **Payout field naming:** the payout amount is `paidAmount` in `PAYOUT_SUCCEEDED` and `amount` in `PAYOUT_FAILED`, on the same topic.
- **ADR-01 rationale:** the rejection of a full modular monolith rests on provider calls exhausting customer-facing pools, which ADR-05's asynchronous provider calls plus bulkheads already prevent; the stronger argument is a separate failure and release domain for money movement.
- **Send-log retention versus replay:** the notification send log is deleted after topic retention (§17.3), so a replay from the long-term archive (§22 item 2) would re-send customer messages; the dedup key should live as long as the replay source.
- **Item versus receipt line:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2 ("an item can be refunded only once") is realised per receipt line, so a line with a quantity above 1 cannot be refunded one unit at a time; worth confirming with the REFUNDS owner.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 17-appendix-and-wishlist.md | NEXT: 19-e2e-system-design.md -->
