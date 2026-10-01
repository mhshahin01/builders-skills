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
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, defer, or reject the Recommended Answer. Accepted answers are applied to the referenced chunk(s), the item moves to the Resolution Log, and the Changes Log is bumped.
-->

# 23. Open Items & Clarifications

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
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives - the evidence behind it (BRD requirement, NFR, doctrine/CLAUDE.md default, operational risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: The hybrid style rests on two unrecorded assumptions

- **Where:** §3, §8.1.2, §10 ADR-01 and ADR-09
- **Type:** Risk
- **Concern:** ADR-01 and §8.1.2 use "one team" as a style driver, and ADR-09 lists "the platform team runs Kubernetes, Kafka, PostgreSQL, and Keycloak on-prem" as a consequence, but §3 holds neither, and neither BRD states team size or an existing platform (the decision log records the team size as BRD-silent). The hybrid's cost depends on both: without a shared on-prem Kafka with a schema registry and Keycloak, one delivery team must stand them up and run three databases for about 40 requests a day, which changes the ADR-01 trade-off.
- **Options:**
  - **A.** Record both as §3 assumptions and add a re-open trigger to ADR-01 - keeps the accepted style and makes its premise testable at build start.
  - **B.** Switch now to a modular monolith with database-backed payout and message workers - cheapest to run, but reverses an accepted ADR on an unverified premise.
  - **C.** Leave as is - the cost stays hidden until build start.
- **Recommended Answer:** Option A. Add to §3: "10. **Delivery team:** one team builds and runs the platform in this release; neither BRD states the team size." and "11. **Shared platform:** an on-prem platform team already operates Kubernetes, Kafka with a schema registry, PostgreSQL, and Keycloak, and hosts this platform's topics, databases, and realm." Cite them in ADR-01 Why and ADR-09 Consequences, and add to ADR-01 Consequences: "Re-open ADR-01 and ADR-02 if §3 assumption 11 does not hold at build start: without a shared Kafka platform, a modular monolith whose payout and notification modules run as outbox-driven workers is the cheaper fit for this load."
- **Why:** The style is sound only on these premises and the SDD already treats them as facts; recording them costs two rows, while B overturns an accepted ADR without evidence that the platform is missing.
- **Status:** Accepted - applied

---

### OI-02: Decision-process citations and dated check stamps in content chunks

- **Where:** §6 (Compute / Infra Notes), §8.1.2, §10 (ADR-01, ADR-02, ADR-03, ADR-05, ADR-06, ADR-09), §14.8, §15.5, §16.12.3
- **Type:** Inconsistency
- **Concern:** The master says the chunks state only the settled design and the decision log holds how it was reached, yet the ADR Why cells cite questionnaire answers ("Q5 answer", "Q6 answer", "Q7 answer", "Q8 answer", "(Q1)", "(Q2)", "(Q3: ...)"), §8.1.2 cites "questionnaire Q1 and Q2", §6 cites "questionnaire Q8", and three registers carry progress stamps ("checked ... on 2026-09-30", "No divergence found on 2026-09-30"). An ADR reader is pointed at a process instead of a driver, and the dates go stale at the next reconciliation.
- **Options:**
  - **A.** Replace each citation with the driver it stands for and drop the dates - the text reads as settled; provenance stays in the decision log.
  - **B.** Keep the citations and link each to the decision log - traceable, but the narration stays in the design text.
- **Recommended Answer:** Option A. §6 Compute / Infra Notes: "questionnaire (ADR-09); default (CLAUDE.md: ...)". §8.1.2 first bullet: "a first production release of two products for one retailer, built by one team (§3 assumption 10), so one core deployable keeps build, test, and release simple." ADR-01 Why: "Drivers: first production release, one delivery team (§3 assumption 10), moderate load with seasonal peaks ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts), REFUNDS/NFR-03). ..." Delete "Q5 answer; " (ADR-02, ADR-05), "Q7 answer; " (ADR-03), "Q6 answer; " (ADR-06), and "Q8 answer; " (ADR-09). §14.8: "Full reconciliation achieved: no divergence between this chunk and §17.1 to §17.4, checked from the producer and the consumer side." §15.5: "No divergence between this chunk and §12, ...". §16.12.3: drop ", checked on 2026-09-30". (Assumption 10 comes from OI-01; if OI-01 is rejected, write "one team (BRD silent)".)
- **Why:** The §6 Notes convention already uses "questionnaire" as a source tag without question numbers, and the master's Reconciled stamp and the decision log are the homes for dates and question numbers; B keeps the narration where the design must read as settled.
- **Status:** Accepted - applied

---

### OI-03: The core's publication log is owned by refund-service but completed by loyalty-service

- **Where:** §5 (Module), §8.5.3, §17.1 Boundaries and DB Modeling, §17.4, §6 ecosystem rules, §15 intro
- **Type:** Inconsistency
- **Concern:** §17.1 lists the publication log among refund-service's tables in the `refund` schema, while §8.5.3 has loyalty-service mark `RefundPaid` completed in it; that breaks "modules never read each other's tables" (§5) and §17.4's "Avoid: reading the `refund` schema", and a future loyalty publisher would write into the refund schema. Relatedly, §6 says module-to-module changes use "`Internal (in-process)` port calls (§15)", while §15 says no module calls another through a port "(ADR-05)", which ADR-05 does not state.
- **Options:**
  - **A.** Make the publication log core eventing infrastructure in its own schema, written and completed only by that infrastructure - both modules stay inside their schemas.
  - **B.** Keep it in `refund` and let the listener write its completion - one fewer schema, but a cross-module write the ADR-01 build rules would have to allow.
- **Recommended Answer:** Option A. Add to §11.1: "The core's in-process event publication log (`event_publication`) is core infrastructure in its own schema `core_events`, owned by no module: the eventing infrastructure writes an entry in the publisher's transaction and marks it completed when the listener's transaction completes; module code never reads or writes it." Remove "publication log" from §17.1 Owns and from the Figure 15 summary; §8.5.3's last step becomes "PL marks RefundPaid completed once the listener commits". Replace the §15 intro sentence with: "The only module-to-module interaction in this release is the in-process `RefundPaid` event (§14.10); no module calls another module's port, so §15 has no `Internal (in-process)` contract; a future port call gets its own API-NN of that type."
- **Why:** One schema per module with no cross-module access (§11.1, ADR-01 build rules) holds only if the shared log belongs to neither module; B trades that rule for one table.
- **Status:** Accepted - applied

---

### OI-04: `RefundPaid` carries no tenant, and `REFUND_PAID` cannot replace it on extraction

- **Where:** §14.10, §17.1, §17.4, §14.9.5, §14.7, ADR-01
- **Type:** Contract mismatch
- **Concern:** `RefundPaidEvent` (`refundRequestId`, `referenceNumber`, `receiptNumber`, `paidAmount`, `paidAt`) has no tenant, and an in-process event has no §14.3 envelope. The listener runs after commit and on publication-log replay after a restart, outside any request, yet §11.2 filters every query by tenant under row-level security and `refund_takeback` and `points_movement` are keyed by `tenant_id`; with a second tenant, the receipt-number match could also hit another tenant's purchase. Separately, ADR-01, §1, §14.7, and §22 say an extracted loyalty-service consumes `REFUND_PAID` instead, but `REFUND_PAID` (§14.9.5) lacks the `receiptNumber` the take-back matches on.
- **Options:**
  - **A.** Add `tenantId` to `RefundPaidEvent` and state the additive field extraction needs - explicit and survives replay.
  - **B.** Capture the tenant from the publishing thread's context - lost on replay after a restart.
  - **C.** Look the tenant up on the refund request - reads the `refund` schema from loyalty-service.
- **Recommended Answer:** Option A. In §14.10, §17.1, and §17.4 the payload becomes "`RefundPaidEvent`: `tenantId`, `refundRequestId`, `referenceNumber`, `receiptNumber`, `paidAmount`, `paidAt`", with the note "the listener sets the tenant context from `tenantId` before any query". Add to ADR-01 Consequences and §14.7: "extraction adds `receiptNumber` to `REFUND_PAID` (additive), so the take-back keeps its match key."
- **Why:** §11.2 has every consumer take the tenant from the event, and the in-process listener needs the same on the crash path the publication log exists for; B fails exactly there and C breaks the module boundary.
- **Status:** Accepted - applied

---

### OI-05: §7.3 omits `RefundPaid` from the LOYALTY/UC-02 row

- **Where:** §7.3
- **Type:** Inconsistency
- **Concern:** §14.10 states that the `RefundPaid` listener realises [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1 (points taken back after a refund), and §8.5.3 is listed as a LOYALTY/UC-02 flow, but the §7.3 Events cell of LOYALTY/UC-02 is "-"; the event appears only on REFUNDS/UC-04. Tracing the take-back from the LOYALTY use case finds no event.
- **Options:**
  - **A.** List `RefundPaid` on both rows - each use case shows the event that realises it.
  - **B.** Move it from REFUNDS/UC-04 to LOYALTY/UC-02 - one mention, but REFUNDS/UC-04 step 7 fires it.
- **Recommended Answer:** Option A. Set the Events cell of the LOYALTY/UC-02 row of §7.3 to "`RefundPaid`"; keep it on the REFUNDS/UC-04 row.
- **Why:** §7.3 must agree with §14.10, the home of in-process events; the event is fired by one use case and realises the rule of another, so both rows are true.
- **Status:** Accepted - applied

---

### OI-06: Messaging and child tables break the tenant rule, and workers have no tenant model under row-level security

- **Where:** ADR-03, §11.1, §11.2, §17.1 and §17.2 DB Modeling, §17.3 and §17.4 workers
- **Type:** Inconsistency
- **Concern:** ADR-03 and §11.1 put `tenant_id` on every table as the leading index column and §11.2 adds row-level security, but `outbox_event`, `inbox_message`, and `event_publication` (§17.1; outbox and inbox also in §17.2) have no `tenant_id`, and the inbox key is (`consumer`, `event_id`). The outbox relays, `payout-retry`, `message-retry`, and publication-log replay all select work across tenants, which row-level security blocks unless the design says how they run. `refund_item`'s partial unique index names `tenant_id` and `receipt_number`, which Figure 15 holds only on `refund_request`; an index cannot span two tables.
- **Options:**
  - **A.** `tenant_id` on every table, plus a worker database role that selects due work across tenants and then sets the row's tenant - the rule holds everywhere.
  - **B.** Exempt messaging tables from `tenant_id` and row-level security - fewer columns, but breaks the platform rule that every shared-schema index includes `tenant_id`.
- **Recommended Answer:** Option A. Add to §11.2: "Messaging tables (outbox, inbox, publication log) and child tables carry `tenant_id` like every other table, leading their indexes (inbox key `tenant_id`, `consumer`, `event_id`). Background workers (outbox relays, `payout-retry`, `message-retry`, publication-log replay, `loyalty-purchase-import`) run under a worker database role whose row-level security policy lets it select due rows of its own work table across tenants; each unit of work then sets the row's tenant for its transaction, so domain tables stay under the tenant policy." Add `tenant_id` and `receipt_number` (copied from the request) to `refund_item` in Figure 15 and the §17.1 Tables Design.
- **Why:** The tenant rule is non-negotiable platform doctrine and A meets it with one column per table and one role; B carves a standing exception into it.
- **Status:** Accepted - applied

---

### OI-07: Nothing gives a self-registered account its `tenant_id` claim

- **Where:** §16.2, §16.3, §16.6, ADR-07, §11.6 (CORS)
- **Type:** Missing scenario
- **Concern:** The gateway rejects a token without `tenant_id` (§16.2) and customers self-register in the one realm (§16.3, §16.6), but no chunk says how a self-registered account gets its tenant, or what one person using two tenants gets. A default works while there is one tenant, but the platform is multi-tenant by rule (§3 assumption 7), and the answer shapes the Keycloak and web app setup.
- **Options:**
  - **A.** One host and one OIDC client per tenant; registration stores the client's tenant on the account - the tenant is never user-supplied; onboarding adds a host and a client.
  - **B.** A realm-wide default tenant written at registration - trivial now, wrong the day a second tenant arrives.
  - **C.** The user picks the tenant at registration - spoofable.
- **Recommended Answer:** Option A. Add to §16.2 step 1: "Each tenant's web app runs on its own host with its own OIDC client in the realm; the registration flow stores that client's tenant as the account attribute `tenant_id`, mapped into the token; staff provisioning sets it for staff (§16.6). An account belongs to exactly one tenant in this release." Add to step 2: "The gateway also rejects a token whose `tenant_id` differs from the tenant of the requesting host." §11.6 CORS allows each tenant host.
- **Why:** Shared-schema isolation (ADR-03) holds only if the tenant comes from something the platform controls; A costs a host and a client per tenant, B defers a breaking change, C is unsafe.
- **Status:** Accepted - applied

---

### OI-08: Tenant-scoped settings (time zone, currency, earn rate, locale) have no home

- **Where:** §6 ecosystem rules, §11.2, §17.1, §17.3, §17.4
- **Type:** Ambiguity
- **Concern:** The design uses settings it never defines: the 30-day window counts days "in the branch's time zone" (§17.1) with no source for it, the daily branch report has no day boundary, the web app and messages use a "tenant locale" (§6, §17.3), and points are 1 per 1 EUR (§17.4) while §3 assumption 9 only says amounts are in EUR today. A second tenant with another currency or time zone would get wrong windows, report days, or points.
- **Options:**
  - **A.** Tenant settings in the environment's Helm values, keyed by `tenant_id`, read at start by the deployables that need them - matches §11.5; onboarding a tenant needs a deploy.
  - **B.** A settings table in the core with an admin API - runtime changes, but needs an operator role §16 does not have, and notification-service cannot read it synchronously.
- **Recommended Answer:** Option A. Add to §11.2: "**Tenant settings:** each tenant has an IANA time zone, an ISO 4217 currency, a locale, and a points earn rate, held in the environment's Helm values keyed by `tenant_id` (§11.5) and read at start by the core and notification-service. refund-service uses the time zone for the 30-day window and the report day; loyalty-service earns only on purchases in the tenant currency; notification-service and the web app use the locale." In §17.1, "the branch's time zone" becomes "the tenant's time zone".
- **Why:** Every use already exists in the design, so one declared home removes guesswork at build time; A needs no new role or API, which B does.
- **Status:** Accepted - applied

---

### OI-09: Production logs and metrics carry no tenant context

- **Where:** §11.4, §20.1.6
- **Type:** Architecture gap
- **Concern:** §11.4 writes tenant context only at DEBUG and gives RED metrics no tenant dimension, so production telemetry cannot isolate one tenant, which the §20.1.6 tenant-specific incident response needs. The platform doctrine asks for both tenant context in logs and no `tenant_id` at INFO; the SDD kept only the second.
- **Options:**
  - **A.** An opaque tenant alias at INFO and as a metric label - per-tenant filtering without the raw id.
  - **B.** Raw `tenant_id` at INFO - simple, breaks the logging rule.
  - **C.** Keep DEBUG only - no per-tenant view in production.
- **Recommended Answer:** Option A. Add to §11.4 Logging: "Every log line carries `tenant_ref`, a keyed hash of `tenant_id` (key in the secrets manager, first 12 hex characters); `tenant_id` itself stays DEBUG-only." Add to Metrics: "RED metrics, consumer lag, and DLQ depth carry a `tenant_ref` label (one value per tenant)." §20.1.6 isolates a tenant by `tenant_ref`.
- **Why:** A satisfies both doctrine rules at once with a label cardinality of one per tenant; B and C each give one of them up.
- **Status:** Accepted - applied

---

### OI-10: Customer contact data on the broker needs a recorded decision and a complete erasure map

- **Where:** §4 R-06, §10, §11.6, §14.9 erasure mapping, §17.1, §17.2 Compliance
- **Type:** ADR needed
- **Concern:** Carrying `customerContact` in four refund events is a GDPR-relevant choice with no ADR. R-06 cites topic ACLs as a mitigation, but ACLs are per topic and payout-service is a listed reader of `refunds-platform-refund-events`, so it receives every contact detail although §17.2 says it holds no personal data. The §14.9 erasure map lists only the topic log; it omits the DLQ topics (`<topic>.<consumer group>.dlq`), which keep full copies, and the `refund` outbox payloads kept for 7 days. The retained log is also the replay source (§14.2), so erasure and replay pull the retention in opposite directions.
- **Options:**
  - **A.** Keep event-carried contact data, recorded as ADR-10 with one bounded retention and a complete erasure map - no new moving parts at this volume.
  - **B.** A second refund topic that only notification-service reads - payout-service never sees contact data; two topics for one producer.
  - **C.** Field-level encryption with per-customer keys, erasure by key deletion - strongest; adds key management.
- **Recommended Answer:** Option A. Add ADR-10 (Accepted): "Customer contact details travel in `REFUND_SUBMITTED`, `REFUND_CANCELLED`, `REFUND_REJECTED`, and `REFUND_PAID` because notification-service cannot call refund-service (ADR-05). Every reader of the topic receives them; payout-service filters by `event_type` before deserializing and stores no other event. The refund topic and its DLQ topics share one retention, no longer than the replay window §20.1.3 needs. Alternatives: a notification-only topic (rejected at this volume; revisit with a second tenant); field-level encryption with key deletion (the upgrade path if erasure must reach the retained log)." Add §14.9 erasure rows for the DLQ topics and `refund.outbox_event`, and change R-06's mitigation to "ADR-10; one bounded retention for the refund topic and its DLQs; the §14.9 erasure map".
- **Why:** The choice is sound at 1,200 requests a month but must be explicit with every PII copy mapped; B and C stay documented upgrade paths instead of day-one cost.
- **Status:** Accepted - applied

---

### OI-11: The customer is not told when a refund is approved

- **Where:** §17.3 channel matrix, §14.5.1 and §14.9.3 (`REFUND_APPROVED`), §8.4.1, §18.1
- **Type:** Missing scenario
- **Concern:** [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) and [REFUNDS 05 § Summarized Workflow](../brd-refunds-portal/05-user-journeys-overview.md#summarized-workflow) step 4 say the customer is told the outcome at each step, [REFUNDS 11 § Summary](../brd-refunds-portal/11-summary-and-uiux.md#summary) says customers hear about every step, and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-1 ties "the customer is told" to the approval. The SDD messages only on Submitted, Cancelled, Rejected, and Paid, and `REFUND_APPROVED` carries no contact: a partially approved customer learns the lower amount only at Paid, and one whose payout retries for a day hears nothing after submitting.
- **Options:**
  - **A.** Message on approval (email and SMS, with the approved amount and, when partial, the reason) - meets the BRD wording; payout-service then receives contact data in the one event it reads, and stores none.
  - **B.** Keep messages at Paid only and confirm that reading with the REFUNDS owner - no change; the partial amount stays unannounced until paid.
- **Recommended Answer:** Option A. Add `customerId` and `customerContact` to `REFUND_APPROVED` (additive, candidate) in §14.5.1, §14.9.3, and §17.1; add notification-service as its consumer in §12 INT-02, §13, §14.2.2, §14.5.1, §17.1, and §17.3; add the §17.3 channel row "`REFUND_APPROVED` | Email and SMS | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 6 and A1: the customer is told the approved amount and, when partial, the reason"; in §18.1 change "at most four messages per request" to "at most six" (up to 7,200 a month, 21,600 at the seasonal rate).
- **Why:** Three BRD chunks state the every-step rule and the AC attaches it to approval; the cost is one more message pair per approval and one more PII-carrying event, which ADR-10 (OI-10) covers.
- **Status:** Accepted - applied

---

### OI-12: REFUNDS/UC-01 step 4 (show the amount before submitting) has no realisation

- **Where:** §17.1 Business Logic (Submit), List of APIs, Developer Notes
- **Type:** Missing scenario
- **Concern:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 4 shows the refund amount before the customer submits at step 5. §17.1 maps step 4 to the amount computed inside the submit call, after submission, its Developer Notes forbid computing amounts in the web app, and no endpoint returns the amount of a selection, so the customer cannot see the amount before submitting.
- **Options:**
  - **A.** The web app previews the sum of the selected items' server-supplied amounts; the server recomputes at submit - no new endpoint; the recorded amount stays server-side.
  - **B.** A read-only quote endpoint - all arithmetic server-side; one more endpoint and POS Records call per change of selection.
- **Recommended Answer:** Option A. §17.1 Submit: "the web app shows the sum of the selected items' amounts from `RefundableItemsView` (step 4); `SubmitRefundRequest` carries it as `expectedAmount`; refund-service recomputes the amount and answers 409 `CONFLICT` when it differs, so the customer reviews the refreshed items." The Developer Notes "Avoid" item becomes "trusting an amount computed by the web app".
- **Why:** Summing line amounts in one currency carries no rounding risk and the server still decides the recorded amount; B adds an endpoint and a POS Records round trip for a display value.
- **Status:** Accepted - applied

---

### OI-13: Purchases not paid by card have no path

- **Where:** §17.1 (Receipt lookup), §15.3 API-01 (Data the platform needs), §17.2
- **Type:** Missing scenario
- **Concern:** Payouts go only to the card used for the purchase ([REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) 2) and cash refunds are out of scope ([REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope)), yet the receipt lookup checks only the window and item availability and API-01's data list has no payment method. A cash-paid purchase can be requested and approved, then fails at CardPay for a day and stays Approved; a split-tender purchase can be approved above its card-paid amount.
- **Options:**
  - **A.** Read the tender at lookup; refuse receipts with no card payment and cap split-tender receipts at the card-paid amount - the customer is told at step 2, like E1.
  - **B.** Let branch managers reject such requests - no data change; relies on each manager noticing.
- **Recommended Answer:** Option A. Add to API-01 "Data the platform needs": "the receipt's payment methods and its card-paid amount". Add to §17.1 Receipt lookup: "a receipt with no card payment answers 422 `RECEIPT_NOT_CARD_PAID` ('this purchase can be refunded at the branch'); for a receipt paid partly by card, the refundable amount is capped at the card-paid amount." Raise the rule to the REFUNDS owner as a BRD question.
- **Why:** The BRD constraint makes these requests unpayable, so stopping them at step 2 avoids a day of failed payouts each; B depends on manual vigilance and still lets the customer submit.
- **Status:** Accepted - applied

---

### OI-14: Refund abuse controls are missing (receipt enumeration, self-decision)

- **Where:** §6 (API Gateway row), §16.3, §16.4.1, §17.1 (Receipt lookup, Decide)
- **Type:** Risk
- **Concern:** Any self-registered `CUSTOMER` can look up any receipt number (§16.4.1) and file a request against it, which reveals purchase contents and locks the items for the real buyer ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once) until a manager rejects; the gateway "applies rate limits" but no limit is set anywhere. One realm holds customers and staff (ADR-07) and nothing stops a `STAFF` account from also holding `CUSTOMER`, so a branch manager could decide their own request.
- **Options:**
  - **A.** A per-user lookup rate limit, a role-separation rule, and a self-decision guard - cheap; no BRD change.
  - **B.** A plus a second receipt factor at lookup, such as the purchase date - stronger; changes REFUNDS/UC-01 step 1.
- **Recommended Answer:** Option A, with the second factor raised to the REFUNDS owner. §6 API Gateway row: "per-user rate limit on `GET /v1/receipts/{receiptNumber}/refundable-items` (proposed 10 a minute and 50 a day), 429 `RATE_LIMITED` beyond it". §16.3: "A `STAFF` account never holds `CUSTOMER` or `MEMBER`; staff use a separate customer account." §17.1 Decide: "a decision whose caller `sub` equals the request's `customer_id` answers 403 `FORBIDDEN`" (defence in depth if the realm rule is misconfigured).
- **Why:** Payouts go to the original card, so the harm is data exposure, blocked refunds, and conflict of interest rather than theft; A closes the cheap paths at no BRD cost, and B needs a business decision.
- **Status:** Accepted - applied

---

### OI-15: A claimed payout has no in-flight state, so two replicas can send it at once

- **Where:** §17.2 (Business Logic: Send; state machine; Tables Design)
- **Type:** Corner case
- **Concern:** The `payout-retry` worker claims due payouts with row locks and calls API-02 outside the database transaction, so the lock is gone during the call while the payout is still `PENDING` or `RETRY_SCHEDULED` with a past `next_attempt_at`; another replica can claim and send it concurrently. Safety then rests on CardPay honouring the idempotency key, which §15.6 lists as unknown, against REFUNDS/NFR-01 (never paid twice).
- **Options:**
  - **A.** A `SENDING` state with a lease - at most one call in flight per payout, whatever the provider supports.
  - **B.** Hold the row lock across the call - simple, but a slow provider holds a transaction and a connection per payout, which §17.2 set out to avoid.
- **Recommended Answer:** Option A. Add state `SENDING` and column `lease_until`: "The claim transaction moves a due payout to `SENDING` with `lease_until` set to now plus the INT-01 timeout plus one minute, and commits; the worker calls API-02 and commits the outcome only while it still holds the lease (version check). A `SENDING` payout whose lease expired is due again and is re-sent with the same idempotency key; if CardPay does not honour idempotency keys (§15.6), a re-send is preceded by a status query by payout id, and a payout whose status cannot be read is held and alerted instead of re-sent." Update Figure 18 and the `status` CHECK to five states.
- **Why:** NFR-01 is a zero-tolerance money rule and the provider-side guarantee is unconfirmed; A makes the platform side sufficient on its own, while B brings back the long transaction.
- **Status:** Accepted - applied

---

### OI-16: REFUNDS/NFR-01 cannot be measured per refund, and a lost approval is silent

- **Where:** §18.2 (Payout correctness), §17.1 (Payout outcome), §11.4 alerting, §22 item 2
- **Type:** NFR shortfall
- **Concern:** §18.2 measures "zero lost or duplicate payouts" by comparing approved refunds with `payouts_total`, an aggregate counter in another deployable; month boundaries and retries make the two counts differ legitimately, and neither names a missing refund. A `REFUND_APPROVED` that dead-letters in payout-service leaves the request `APPROVED` with no `payout_failing_since`, so it never reaches the branch manager's payout-failing list; only a DLQ alarm fires. Duplicates are prevented by construction, but only the §22 reconciliation "once CardPay offers them" could detect one.
- **Options:**
  - **A.** A payout watchdog in refund-service plus a per-payout duplicate proxy - measurable now from data each service owns.
  - **B.** A cross-service reconciliation job - reads two private databases, which §6 and ADR-06 rule out.
- **Recommended Answer:** Option A. Add to §17.1 Business Logic: "**Payout watchdog** (REFUNDS/NFR-01): a scheduled job flags every `APPROVED` request with no payout outcome (not `PAID`, no `payout_failing_since`) once the §17.2 retry window plus one hour has passed since approval, sets `payout_outcome_overdue_since`, shows it on the branch manager's payout-failing list, and counts it in the gauge `refund_payout_outcome_overdue_requests`, alerted above zero (§11.4)." §18.2 Payout correctness becomes: "no overdue request in the month (`refund_payout_outcome_overdue_requests` = 0) and no payout with more than one accepted API-02 attempt in `payout_attempt`, until the §22 CardPay reconciliation replaces the duplicate proxy."
- **Why:** The BRD measure is per refund and [REFUNDS 16 TC-NFR-01](../brd-refunds-portal/16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) compares approved with paid refunds; A gives both without breaking database ownership, which B does.
- **Status:** Accepted - applied

---

### OI-17: notification-service's worker has no data to send or retry a message

- **Where:** §17.3 (Business Logic, Tables Design, Developer Notes, Figure 23)
- **Type:** Inconsistency
- **Concern:** The consumer only inserts a `PENDING` message, and a separate worker renders the template and calls API-03 later and on every retry. But the clear address is "never stored", `notification_message` holds only `recipient_masked`, no column keeps the template variables (reference number, amounts, rejection reason), and calling refund-service is ruled out, so the worker can neither render nor address the message.
- **Options:**
  - **A.** Keep the address and variables encrypted on the pending row, erased when the message is final - keeps the worker model; PII at rest only for the attempt window.
  - **B.** Send from the consumer and retry by redelivery - no stored PII, but a MsgHub outage stalls the partition and pushes events to the DLQ.
- **Recommended Answer:** Option A. Add to the §17.3 Tables Design: "`notification_message` | `delivery_payload` | bytea | NULL allowed | the address and template variables, encrypted at the application layer with a key from the secrets manager; set by the consumer, erased when the message reaches `SENT`, `FAILED`, or `SKIPPED`." "Recipient data" becomes: "the address is kept encrypted until the message is final, then only in masked form."
- **Why:** A keeps the INT-02 retry-with-backoff design working and bounds PII to the attempt window, while B turns a provider outage into consumer backpressure and DLQ traffic, which extracting the service was meant to absorb.
- **Status:** Accepted - applied

---

### OI-18: A refund paid before its purchase is imported never takes the points back

- **Where:** §17.4 (Take points back, DB Modeling, Metrics)
- **Type:** Corner case
- **Concern:** Purchases arrive by an hourly import (with a day of outage before its alert), while `RefundPaid` can be handled first, for a same-day refund or during a POS Records outage. The listener then finds no `EARNED` movement, records the refund as handled with no movement, and `refund_takeback` makes every replay a no-op; the purchase imported later earns points that are never taken back, against [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1 and LOYALTY/NFR-01, and `loyalty_takeback_lag_seconds` never sees the miss.
- **Options:**
  - **A.** A pending take-back that the import applies when the purchase arrives - event-driven, no polling.
  - **B.** Fail the listener until the purchase exists, so the publication log keeps redelivering - no schema change, but stuck-publication alerts and no end for purchases that never earned points.
- **Recommended Answer:** Option A. `refund_takeback` gains `purchase_reference` and `status` (`APPLIED`, `PENDING_EARN`, `NO_EARN`): "When no `EARNED` movement exists, the listener records `PENDING_EARN`. The import, in the transaction that inserts an `EARNED` movement, applies a `PENDING_EARN` take-back for the same tenant and purchase reference and sets it to `APPLIED`. A `PENDING_EARN` closes as `NO_EARN` after the first successful import run that starts more than one day after `paidAt` ([LOYALTY 02 § Assumptions](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions) 1: member purchases are known the same day). `loyalty_takeback_lag_seconds` also covers take-backs applied by the import."
- **Why:** The ledger stays right whatever order the two sources arrive in, and the close rule rests on a BRD assumption rather than a guess; B abuses the replay mechanism and never ends for non-member purchases.
- **Status:** Accepted - applied

---

### OI-19: One bad purchase record stops the points import

- **Where:** §17.4 (Earn points, Integrations, Tables Design, Metrics)
- **Type:** Corner case
- **Concern:** The import stops on failure and resumes from the same cursor, so a record that cannot become an `EARNED` movement fails every run: a purchase under 1 EUR that rounds to 0 points, a till return or void with a zero or negative amount, or an unexpected currency violates the `EARNED > 0` check or the earn rule. Earning then stops for every member until someone intervenes, signalled only by the no-success-for-a-day alert; the import metric already names a `skipped` outcome with no rule behind it.
- **Options:**
  - **A.** Validate per record; reject into a table and advance the cursor; stop only on transport or authentication failures - one bad record never blocks the rest.
  - **B.** Keep stop-on-failure and fix records by hand - simple, but up to a day of no earning per bad record.
- **Recommended Answer:** Option A. Add to §17.4 Earn points: "Each record is validated: one that yields no positive points, has a non-positive amount, is not in the tenant currency, or fails validation is written to `purchase_import_rejection` (`tenant_id`, `purchase_reference`, `reason`, `received_at`), counted with `outcome=rejected`, and passed by the cursor. Only a transport or authentication failure stops the run." Alert on rejections above zero in a run, and raise till returns and voids to the LOYALTY owner as a BRD question.
- **Why:** LOYALTY/NFR-01 is better served by an isolated, visible rejection than by halting all earning; the rounding mode itself stays with the inline §17.4 clarification.
- **Status:** Accepted - applied

---

### OI-20: A Kafka outage takes the portal down through the core's readiness probe

- **Where:** §17.1 Deployment Strategy, §11.3
- **Type:** Risk
- **Concern:** The core's readiness "includes the database connection and the Kafka producer". With the broker down, every core pod turns unready and the portal goes dark, although the transactional outbox exists so that writes commit without the broker and the relay catches up later. A broker incident then spends the two-hour monthly budget of REFUNDS/NFR-02, contrary to ADR-01's aim that an outside failure never takes the portal down.
- **Options:**
  - **A.** Readiness on the database only; broker health through the outbox backlog-age alert - the portal keeps serving; events wait.
  - **B.** Keep Kafka in readiness - fail-fast, at the cost of availability.
- **Recommended Answer:** Option A. §17.1 Health checks: "liveness and readiness probes; readiness includes the database connection only; while Kafka is down the core keeps serving and writing to the outbox, and the outbox backlog-age alert (§11.4) pages." Add to §11.3: "Readiness covers only what a deployable's synchronous requests need; asynchronous dependencies (Kafka, providers) are watched by alerts, never by readiness."
- **Why:** The outbox already makes the broker non-blocking for writes, so tying readiness to it turns a recoverable backlog into an outage; B buys nothing the backlog alert does not already give.
- **Status:** Accepted - applied

---

### OI-21: The runbook omits shared-dependency outages and break-glass access

- **Where:** §20.1, §20.3, §19 (Prod row)
- **Type:** Missing scenario
- **Concern:** §20.1 has no procedure for the dependencies every user path shares: Kafka with its schema registry, Keycloak, and the API gateway; a Keycloak outage alone stops every sign-in and counts against REFUNDS/NFR-02. §19 grants Prod "break-glass access per §20.3", but §20.3 has no break-glass content, although an operator reading a refund request is an exception to REFUNDS/NFR-04 (only the customer and their branch's manager see a request) and must be controlled and audited.
- **Options:**
  - **A.** Add the entries with the design behaviour now; operations fills the commands before go-live - the intent is fixed in the design.
  - **B.** Leave every procedure to operations - the NFR-04 exception stays undefined and the §19 reference dangles.
- **Recommended Answer:** Option A. Add "20.1.7 Broker or schema registry outage: the core keeps serving and commits outbox rows; payouts and messages wait; watch outbox backlog age; after recovery the relays drain and consumers dedup, with no manual replay." Add "20.1.8 Keycloak outage: new sign-ins and token refreshes fail; issued tokens work until they expire; the web app shows that sign-in is unavailable; escalate to the platform team." Add to §20.3: "Break-glass: Prod data access outside the web app needs a named approver, a time-boxed account, and an audit record reviewed after use (REFUNDS/NFR-04)." Command detail stays a NEEDS CLARIFICATION for operations.
- **Why:** These dependencies decide REFUNDS/NFR-02 and the break-glass rule decides NFR-04; three short entries fix the intent now, while B leaves both open at go-live.
- **Status:** Accepted - applied

---

### OI-22: Scalar facts and provider policies are restated across chunks

- **Where:** §1, §5, §8.1.2, §12 INT-01, §13, §14.5.2, §14.9.1, §14.9.7, §15.3 (API-02, API-04), §17.1, §17.2, §17.4, §18.3
- **Type:** Duplication
- **Concern:** The payout retry window ("24 hours" or "one day") is stated in about a dozen places across ten chunks; the import schedule ("hourly") in four, including §15.3 API-04, which attributes "the next hourly run" to §12 INT-03, where no schedule appears; the reference number format ("`RF-` and 10 digits") in §5, §14.9.1, and §17.1. §15.3 API-02 restates the INT-01 retry policy while API-01, API-03, and API-04 point to §12. Each value change needs many edits, and the API-04 drift shows it already happens.
- **Options:**
  - **A.** One home per fact; every other place references it - one edit per change.
  - **B.** Keep the copies and add a consistency check - no text change; recurring maintenance.
- **Recommended Answer:** Option A. Homes: the retry window in §17.2 Constraints ("Retry window"), referenced elsewhere as "the §17.2 retry window" (BRD references to [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 keep "one day"); the import schedule in §17.4 Input, with the API-04 fallback reading "§12 INT-03; the next run resumes from the cursor (§17.4)"; the reference number format in the §17.1 Tables Design, with §5 and §14.9.1 pointing to it; provider policy in §12, with every §15.3 "Timeout, retries, circuit breaker" and "Fallback when unavailable" row reading "§12 INT-0N" only.
- **Why:** One fact, one home removes the drift already visible in API-04; B keeps a dozen copies alive for every future change.
- **Status:** Accepted - applied

---

## Resolution Log

<!-- When an open item is accepted (or adjusted) and applied, move its summary here with a pointer to the SDD update (chunk + heading). Audit trail. -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-30 | 01 §3 (assumptions 10 and 11); 06 §10 ADR-01 and ADR-09 | Accepted recommendation |
| OI-02 | 2026-09-30 | 02 §6; 04 §8.1.2; 06 §10 ADR-01, ADR-02, ADR-03, ADR-05, ADR-06, ADR-09; 10 §14.8; 11 §15.5; 12 §16.12.3 | Accepted recommendation |
| OI-03 | 2026-09-30 | 07 §11.1; 13a §17.1 Boundaries and DB Modeling; 05 §8.5.3; 11 §15 introduction; also 01 §5, 02 §6, 04 §8.1.3, 06 ADR-06 | Accepted recommendation |
| OI-04 | 2026-09-30 | 10 §14.10 and §14.7; 13a §17.1; 13d §17.4; 06 ADR-01; also 05 §8.5.3, 17 §22, 10 §14.8 row 1 | Accepted recommendation |
| OI-05 | 2026-09-30 | 03 §7.3 LOYALTY/UC-02 row; 10 §14.10 When cell, so §7.3 reads the mapping from its home | Accepted recommendation |
| OI-06 | 2026-09-30 | 07 §11.2; 13a §17.1 DB Modeling; also 13b §17.2 outbox and inbox | Accepted recommendation |
| OI-07 | 2026-09-30 | 12 §16.2; 07 §11.6; also 06 ADR-07 | Accepted recommendation |
| OI-08 | 2026-09-30 | 07 §11.2; 13a §17.1; also 13d §17.4 earn rate | Accepted recommendation |
| OI-09 | 2026-09-30 | 07 §11.4; 16 §20.1.6 | Accepted recommendation |
| OI-10 | 2026-09-30 | 06 §10 ADR-10; 10 §14.9 erasure map; 01 §4 R-06; also 13b §17.2 Compliance | Accepted recommendation |
| OI-11 | 2026-09-30 | 10 §14.2.2, §14.5.1, §14.9.3; 13a §17.1; 13c §17.3; 08 §12 INT-02; 09 §13; 14 §18.1; also 05 §8.4.1 and §8.5.2, 11 §15.3 API-03 | Accepted recommendation |
| OI-12 | 2026-09-30 | 13a §17.1 Business Logic, Error Handling, Developer Notes, Figure 16 | Accepted recommendation |
| OI-13 | 2026-09-30 | 11 §15.3 API-01; 13a §17.1; also 01 §3 assumption 5 | Accepted recommendation |
| OI-14 | 2026-09-30 | 02 §6 API Gateway row; 12 §16.3; 13a §17.1 | Accepted recommendation |
| OI-15 | 2026-09-30 | 13b §17.2 Business Logic, Figures 18, 20, and 21, Tables Design; also 11 §15.3 API-02 | Accepted recommendation |
| OI-16 | 2026-09-30 | 13a §17.1; 14 §18.2; 07 §11.4 | Accepted recommendation |
| OI-17 | 2026-09-30 | 13c §17.3 Business Logic, Tables Design, Data Encryption, Compliance | Accepted recommendation |
| OI-18 | 2026-09-30 | 13d §17.4; also 05 §8.4.2 and §8.5.3 | Accepted recommendation |
| OI-19 | 2026-09-30 | 13d §17.4 | Accepted recommendation |
| OI-20 | 2026-09-30 | 13a §17.1 Deployment Strategy; 07 §11.3; also 13b §17.2 and 13c §17.3 health checks | Accepted recommendation |
| OI-21 | 2026-09-30 | 16 §20.1.7, §20.1.8, §20.3 | Accepted recommendation |
| OI-22 | 2026-09-30 | 01 §1 and §5; 05 §8.4.1 and §8.5.2; 08 §12 INT-01; 09 §13; 10 §14.5.2, §14.9.1, §14.9.7; 11 §15.3; 13b §17.2; 13d §17.4; 14 §18.3 | Accepted recommendation |

---

## Reviewer Notes

| Risk surface | Checked | Findings | Notes |
|---|---|---|---|
| Architecture style fit | ADR-01 against the BRD drivers (stage, team, load: REFUNDS 02 Facts, REFUNDS/NFR-01 to NFR-03, LOYALTY/NFR-02); §8.1; §13 boundaries; module schemas and ports (§17.x Developer Notes); outbox or an equivalent work table on every path that leaves a process | 2 findings (OI-01, OI-03) | Every cross-deployable fact goes through an outbox, and provider calls are driven from the payout and delivery-log tables; the hybrid fits the drivers once its premises are recorded. |
| ADR completeness | ADR-01 to ADR-09 (status, why, how, consequences, alternatives); design decisions made in the body without an ADR | 2 findings (OI-10, OI-02) | ADR-04 and ADR-08 stay Proposed behind their inline markers. |
| Cross-cutting concerns | §11.1 to §11.6 against every §17.x table design, worker, and override | 3 findings (OI-06, OI-08, OI-09) | |
| Per-service contract completeness | §17.1 to §17.4: inputs, outputs, state machines, tables, error handling, List of APIs against the use-case steps | 3 findings (OI-12, OI-17, OI-19) | Field-level schemas stay behind the inline OpenAPI markers. |
| Event contract consistency | Topic, event, and payload field names, keys, groups, and DLQ names of every §17.x Event Model against §14.4, §14.5, §14.9, and §14.10 verbatim; one producer per consumed event; consumer lists from both sides; §12 INT-02 and §13 Input/Output | 1 finding (OI-04) | The seven integration events match verbatim from both sides and each consumed event has exactly one producer. |
| Role catalogue consistency | Permission tokens in §17.1 and §17.4 (List of APIs, Constraints) against §16.4, §16.5, §16.11, and the §16.12.2 counts; REFUNDS 07 and LOYALTY 07 matrices | No issue found | Eight tokens, three roles, counts 4 / 1 / 3 agree everywhere. |
| API contract completeness | §15.2 to §15.6 against §12, §8.5, and every §17.x Integrations table; `TBD - external` handling; sync chain depth | 1 finding (OI-13) | Four External outbound contracts, all `TBD - external`, none invented; no chain deeper than one hop; the missing-port-call statement is in OI-03. |
| NFR realisability | REFUNDS/NFR-01 to NFR-04 and LOYALTY/NFR-01, NFR-02 against §18.2, §11.4, and §17.x | 3 findings (OI-16, OI-18, OI-20) | Latency targets and the LOYALTY availability target stay behind their inline markers. |
| Integration error paths and timeouts | §12 INT-01 to INT-03, §15.3 policy rows, and provider failure handling in §17.1 to §17.4 | 2 findings (OI-15, OI-19) | Timeouts, retry delays, and attempt limits stay behind their inline markers. |
| Multi-tenancy edge cases | Tenant resolution, event envelope, in-process events, background workers under row-level security, tenant-specific settings, self-registration | 4 findings (OI-04, OI-06, OI-07, OI-08) | |
| Observability | §11.4 and every §17.x metric and alert against the NFRs and the runbook | 2 findings (OI-09, OI-16) | |
| Security and compliance hooks | §11.6, §16, §17.x Compliance, per-service authorization against REFUNDS 07 and LOYALTY 07, PII flow on the broker | 2 findings (OI-10, OI-14) | Authorization matches both BRD matrices; retention, lawful basis, and ISO / SOC questions stay behind their inline markers. |
| Deployment failure modes | §11.3, §17.x Deployment Strategy, probes, replicas and workers during rolling updates | 2 findings (OI-20, OI-15) | |
| Runbook completeness | §20.1 to §20.3 against the §18.3 peak scenarios and the shared dependencies | 1 finding (OI-21) | The listed procedures stay behind their inline markers. |
| BRD-to-SDD traceability | §7.3 as checklist: one owner and entry point per UC, each cell against §13, §17.x List of APIs, §8.4 / §8.5, §15.2, §14.5, and §14.10; BRD keys and anchors; UC step realisation; cross-BRD personas, terms, qualities, and mandates | 4 findings (OI-05, OI-11, OI-12, OI-13) | Every UC of both BRDs has one owner and an entry point, and every link opens the right BRD heading; the cross-BRD differences are decided (§7.1, §12, §16.3, §6) or flagged inline (§17.4, §18.2). |
| Duplication | BRD content restated; chunk 11 and §17.x restating each other; scalar facts stated in several chunks | 1 finding (OI-22) | |
| Decision-process narration | Content chunks 00 to 17 for question citations, dated check stamps, option letters, and walkthrough notes | 1 finding (OI-02) | |

- [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 reads "the system tries again, and the branch manager is told if it still fails after one day", which also supports telling the manager at one day while retries continue. That is input to the inline §17.2 clarification on `FAILED` payouts, not a new item; the same answer should settle whether time with the circuit breaker open counts against the window, because a CardPay outage longer than the window fails every pending payout at once.
- §14.8, §15.5, and §16.12.3 record no divergence, yet OI-03, OI-04, and OI-05 are divergences between chunks; rerun the reconciliation after they are applied.
- Left for the LLD: the `Idempotency-Key` store behind the §17.1 POST endpoints (table, scope per caller, retention), and outbox relay concurrency across core replicas (today's consumers tolerate reordering: notification-service needs no order, and each refund has one payout event type).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 17-appendix-and-wishlist.md | NEXT: 19-e2e-system-design.md -->
