<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: SDD - Refunds Platform
PURPOSE: Single home for the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Refunds Platform

## How to read

The numbered content chunks hold the current settled design; the ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how the decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-09-30:** Accept all. Answered by the user through the run's standing instruction to accept every recommended answer. Style: hybrid; followed the recommendation.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release of a product that will grow (Recommended) / MVP or proof of concept / Platform at scale | First production release | REFUNDS 01 objectives (a production portal for 40 branches); REFUNDS 12 Wishlist (online-shop refunds later); LOYALTY 04 Out of Scope (redeeming points in a later phase) | [§8.1 Architecture Style](./04-architecture-style-and-diagrams.md#81-architecture-style) |
| Q2 Teams | One team (Recommended) / Two or three teams / Four or more teams | One team | assumption - BRD silent (from Q1); two or three teams keep the same Q4 recommendation | [§8.1 Architecture Style](./04-architecture-style-and-diagrams.md#81-architecture-style) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | REFUNDS 02 Facts (1,200 requests a month; three times that in seasonal sales); REFUNDS/NFR-02 (2 hours of disruption a month); REFUNDS/NFR-03; LOYALTY/NFR-02 | [§8.1 Architecture Style](./04-architecture-style-and-diagrams.md#81-architecture-style) |
| Q4 Architecture style | Hybrid (Recommended) / Modular monolith / Microservices | Hybrid | Profile "first production release"; payout = external provider integration with money-critical failure handling (REFUNDS 08 Payment Provider, REFUNDS/UC-04 E1, REFUNDS/NFR-01); notification fan-out (REFUNDS 08 Notification Partner) | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process ports and domain events inside the core, Kafka backbone with outbox between deployables (Recommended) / Event-driven backbone plus REST queries between all parts / Mostly synchronous REST | In-process inside the core, Kafka between deployables | Q4; REFUNDS/NFR-01 (never lost or paid twice); LOYALTY/NFR-02 (take-back within one hour) | [ADR-02, ADR-05](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One core database with a schema per module and a database per extracted service (Recommended) / One database per service / One database per service plus a reporting store | Schema per module, database per extracted service | Q4; REFUNDS 12 TI-02 (PostgreSQL); REFUNDS 09 needs no reporting store | [ADR-06](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy | Shared schema with `tenant_id` (Recommended) / Schema per tenant / Database per tenant / Single tenant | Shared schema with `tenant_id` | CLAUDE.md platform rule; low volume (REFUNDS 02 Facts) | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q8 Deployment target | Kubernetes, one Helm chart per deployable (Recommended) / Managed container service / Simple container or VM setup | Kubernetes, one Helm chart per deployable | CLAUDE.md deployment unit; Kafka and Keycloak are the on-prem defaults; neither BRD states the hosting | [ADR-09](./06-principles-and-decisions.md#10-architectural-decisions) |

## Ecosystem selection record

**Outcome, 2026-09-30:** Accept all, answered by the user through the run's standing instruction. No row was walked through or overridden, so no row is listed; the §6 Notes column carries each row's source ([§6 Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview)).

## Clarification register

All 22 open items from the review were decided on 2026-09-30, each by the user through the run's standing instruction to accept every Recommended Answer. One inline clarification, the points taken back after a partial refund (§17.4), was settled by LOYALTY v1.1 on 2026-09-30.

### OI-01 - The hybrid style rests on two unrecorded assumptions

**Question:** ADR-01 used "one team" and ADR-09 an existing on-prem platform as premises that §3 did not hold.

**Decision record, 2026-09-30:** Accepted option A: §3 assumptions 10 (one delivery team) and 11 (a shared on-prem platform) are added and cited in ADR-01 and ADR-09, with a re-open trigger in ADR-01. Rationale: ADR-01.

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions), [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-02 - Decision-process citations and dated check stamps in content chunks

**Question:** The ADRs, §6, and §8.1.2 cited questionnaire question numbers, and three registers carried dated check stamps.

**Decision record, 2026-09-30:** Accepted option A: each citation is replaced by the driver it stands for, and the dates are removed from §14.8, §15.5, and §16.12.3. Rationale: the chunks state the settled design; question numbers and dates live in this register and in the master.

**Rule home:** [§10 Architectural Decisions](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-03 - The publication log is owned by refund-service but completed by loyalty-service

**Question:** The in-process publication log sat in the `refund` schema while loyalty-service completed its entries.

**Decision record, 2026-09-30:** Accepted option A: the log is core infrastructure in its own `core_events` schema, owned by no module, and §15 states that no module calls another module's port. Rationale: one schema per module with no cross-module access holds only if the shared log belongs to neither module.

**Rule home:** [§11.1 DB Modeling (Default)](./07-cross-cutting-concerns.md#111-db-modeling-default)

### OI-04 - `RefundPaid` carries no tenant

**Question:** The in-process event had no tenant for the after-commit listener, and `REFUND_PAID` lacked the match key an extracted loyalty-service needs.

**Decision record, 2026-09-30:** Accepted option A: `tenantId` is added to `RefundPaidEvent` on both sides, and extraction adds `receiptNumber` to `REFUND_PAID`. Recorded as row 1 of §14.8, fixed in v1.0. Rationale: the listener needs the tenant on the replay path the publication log exists for.

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-05 - §7.3 omits `RefundPaid` from the LOYALTY/UC-02 row

**Question:** The LOYALTY/UC-02 row showed no event although `RefundPaid` realises its BR-1.

**Decision record, 2026-09-30:** Accepted option A: `RefundPaid` is listed on the LOYALTY/UC-02 and REFUNDS/UC-04 rows. So that §7.3 still reads only what its home states, the §14.10 When cell now also names the rule the event realises (LOYALTY/UC-02 BR-1). Rationale: the event is fired by one use case and realises the rule of another.

**Rule home:** [§7.3 Use Case Traceability](./03-users-and-use-cases.md#73-use-case-traceability-brd--sdd)

### OI-06 - Messaging and child tables break the tenant rule

**Question:** The outbox, inbox, publication log, and `refund_item` lacked `tenant_id`, and background workers had no model under row-level security.

**Decision record, 2026-09-30:** Accepted option A: `tenant_id` on every table, and a worker database role that selects due work across tenants and then sets the row's tenant. Rationale: the tenant rule is platform doctrine; option B carved a standing exception into it.

**Rule home:** [§11.2 Multi-Tenancy (Default)](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### OI-07 - Nothing gives a self-registered account its `tenant_id` claim

**Question:** No chunk said how a self-registered account gets its tenant.

**Decision record, 2026-09-30:** Accepted option A: one host and one OIDC client per tenant; registration stores the client's tenant, and the gateway rejects a token whose tenant differs from the host's. Rationale: the tenant must come from something the platform controls.

**Rule home:** [§16.2 Resolution Model](./12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action)

### OI-08 - Tenant-scoped settings have no home

**Question:** The time zone, currency, locale, and earn rate were used without a defined source.

**Decision record, 2026-09-30:** Accepted option A: tenant settings live in the environment's Helm values keyed by `tenant_id`. Rationale: every use already existed; one declared home removes guesswork without a new role or API.

**Rule home:** [§11.2 Multi-Tenancy (Default)](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### OI-09 - Production logs and metrics carry no tenant context

**Question:** Tenant context was DEBUG-only, so production telemetry could not isolate a tenant.

**Decision record, 2026-09-30:** Accepted option A: `tenant_ref`, a keyed hash of `tenant_id`, in every log line and as a metric label. Rationale: it meets both logging rules with one label value per tenant.

**Rule home:** [§11.4 Observability (Default)](./07-cross-cutting-concerns.md#114-observability-default)

### OI-10 - Customer contact data on the broker needs a decision and a complete erasure map

**Question:** Contact details in refund events had no ADR, and the erasure map missed the DLQ topics and the outbox.

**Decision record, 2026-09-30:** Accepted option A: ADR-10 is added (it lists `REFUND_APPROVED` too, after OI-11), the §14.9 erasure map covers the DLQ topics and `refund.outbox_event`, and R-06 points to ADR-10. Rationale: ADR-10.

**Rule home:** [ADR-10](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-11 - The customer is not told when a refund is approved

**Question:** The BRD's every-step rule and REFUNDS/UC-04 AC-1 imply a message at approval, which the design did not send.

**Decision record, 2026-09-30:** Accepted option A: `REFUND_APPROVED` gains `customerId` and `customerContact`, notification-service consumes it, and the customer gets email and SMS with the approved amount. Rationale: three BRD chunks state the every-step rule.

**Rule home:** [§17.3 notification-service](./13c-service-notification.md#173-notification-service)

### OI-12 - REFUNDS/UC-01 step 4 has no realisation

**Question:** The customer could not see the refund amount before submitting.

**Decision record, 2026-09-30:** Accepted option A: the web app shows the sum of the server-supplied item amounts; the submit call carries `expectedAmount` and answers 409 `CONFLICT` when the recomputed amount differs. Rationale: the server still decides the recorded amount, with no extra endpoint.

**Rule home:** [§17.1 refund-service](./13a-service-refund.md#171-refund-service)

### OI-13 - Purchases not paid by card have no path

**Question:** A cash-paid or split-tender purchase could be requested and approved but not paid to a card.

**Decision record, 2026-09-30:** Accepted option A: API-01 must supply the payment methods and the card-paid amount; a receipt with no card payment answers `RECEIPT_NOT_CARD_PAID`, and split tender is capped at the card-paid amount. BRD follow-up for the REFUNDS owner: confirm the card-only rule for cash and mixed purchases. Rationale: the BRD constraint makes such requests unpayable.

**Rule home:** [§17.1 refund-service](./13a-service-refund.md#171-refund-service)

### OI-14 - Refund abuse controls are missing

**Question:** Receipt enumeration and a branch manager deciding their own request were possible.

**Decision record, 2026-09-30:** Accepted option A: a per-user lookup rate limit (proposed 10 a minute and 50 a day), staff accounts never hold customer roles, and a self-decision guard. BRD follow-up for the REFUNDS owner: a second receipt factor at lookup. Rationale: closes the cheap paths at no BRD cost.

**Rule home:** [§16.3 User Types](./12-centralized-user-roles.md#163-user-types-tier-1), [§17.1 refund-service](./13a-service-refund.md#171-refund-service)

### OI-15 - A claimed payout has no in-flight state

**Question:** Two replicas could send the same payout while the provider's idempotency support is unknown.

**Decision record, 2026-09-30:** Accepted option A: a `SENDING` state with a lease; outcomes commit only while the lease is held; re-sends reuse the key or query the status first. Rationale: REFUNDS/NFR-01 is zero-tolerance and the provider-side guarantee is unconfirmed.

**Rule home:** [§17.2 payout-service](./13b-service-payout.md#172-payout-service)

### OI-16 - REFUNDS/NFR-01 cannot be measured per refund

**Question:** Aggregate counters could not name a missing payout, and a dead-lettered approval stayed silent.

**Decision record, 2026-09-30:** Accepted option A: a payout watchdog in refund-service with the gauge `refund_payout_outcome_overdue_requests`, and a per-payout duplicate proxy in §18.2. Rationale: measurable now from data each service owns.

**Rule home:** [§17.1 refund-service](./13a-service-refund.md#171-refund-service)

### OI-17 - notification-service's worker has no data to send or retry

**Question:** The worker could neither render nor address a message, because neither the clear address nor the template variables were stored.

**Decision record, 2026-09-30:** Accepted option A: an encrypted `delivery_payload` on the pending message, erased when the message is final. Rationale: it keeps retry with backoff and bounds personal data to the attempt window.

**Rule home:** [§17.3 notification-service](./13c-service-notification.md#173-notification-service)

### OI-18 - A refund paid before its purchase is imported never takes the points back

**Question:** The listener recorded "no movement" and replays were no-ops, so points imported later were never taken back.

**Decision record, 2026-09-30:** Accepted option A: a `PENDING_EARN` take-back that the import applies, closed as `NO_EARN` after the next-day import. Rationale: the ledger stays right in any arrival order, and the close rule rests on LOYALTY 02 assumption 1.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

### OI-19 - One bad purchase record stops the points import

**Question:** A record that cannot become an earned movement failed every run.

**Decision record, 2026-09-30:** Accepted option A: per-record validation into `purchase_import_rejection`, with an alert; only transport or authentication failures stop a run. BRD follow-up for the LOYALTY owner: how till returns and voids affect points. Rationale: an isolated, visible rejection serves LOYALTY/NFR-01 better than halting all earning.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

### OI-20 - A Kafka outage takes the portal down through readiness

**Question:** The core's readiness included the Kafka producer, although the outbox makes the broker non-blocking for writes.

**Decision record, 2026-09-30:** Accepted option A: readiness covers the database only, and asynchronous dependencies are watched by alerts; the §11.3 rule is applied to every deployable. Rationale: a recoverable backlog must not become an outage.

**Rule home:** [§11.3 Deployment (Default)](./07-cross-cutting-concerns.md#113-deployment-default)

### OI-21 - The runbook omits shared-dependency outages and break-glass access

**Question:** No procedure covered Kafka, schema registry, or Keycloak outages, and §20.3 had no break-glass rule.

**Decision record, 2026-09-30:** Accepted option A: §20.1.7, §20.1.8, and a break-glass rule in §20.3, with the command detail left to operations. Rationale: these dependencies decide REFUNDS/NFR-02, and the break-glass rule decides REFUNDS/NFR-04.

**Rule home:** [§20.1 Common Operations](./16-operations-runbook.md#201-common-operations)

### OI-22 - Scalar facts and provider policies are restated across chunks

**Question:** The retry window, the import schedule, and the reference number format were stated in many places, and §15.3 restated §12 policy.

**Decision record, 2026-09-30:** Accepted option A: one home per fact (the retry window in §17.2 Constraints, the schedule in §17.4 Input, the reference format in the §17.1 Tables Design, provider policy in §12), referenced everywhere else. Rationale: one fact, one home.

**Rule home:** [§17.2 payout-service](./13b-service-payout.md#172-payout-service)

### §17.4 points taken back after a partial refund (inline clarification)

**Question:** How many points are taken back when a refund covers only some items of a purchase or a partial amount (REFUNDS/UC-04 A1)? LOYALTY v1.0 covered only a whole refunded purchase (LOYALTY/UC-02 AC-1), so §17.4 carried the question as an inline clarification.

**Decision record, 2026-09-30:** Settled by the LOYALTY owner in LOYALTY v1.1: LOYALTY/UC-02 BR-3 (only the points of the refunded amount are taken back, 1 point for each full 1 EUR refunded) and AC-2 (a partial refund of 30.50 EUR of an 80.00 EUR purchase that earned 80 points shows -30). The inline clarification is removed. The technical realisation was applied under the run's standing instruction to accept every recommendation: the points due count the purchase as a whole (the full EUR paid back on it so far, never more than it earned, minus earlier take-backs), `refund_takeback` keeps the paid amount so the import can apply a pending take-back, a refund whose points due are 0 writes no movement, and the listener and the import serialize per purchase. Rationale: counting the purchase as a whole meets BR-1, BR-3, AC-1, and AC-2 together, while counting each refund on its own would leave a point on a purchase refunded in full through several partial refunds with cents; storing the paid amount keeps the pending path and the direct path on one rule. Open remainder: the earn rounding (the §17.4 Earn points clarification) decides whether a whole refund of a purchase with cents takes back every point it earned.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

## Walkthrough and delegation history

**Delegation, 2026-09-30:** the user fixed the run's answers in advance: output mode chunks, generation whole, intent derive from the BRDs; BRD keys REFUNDS (Refunds Portal) and LOYALTY (Loyalty Points); accept all recommendations in the architecture questionnaire and the ecosystem selection; the service decomposition (refund-service owns REFUNDS/UC-01 to REFUNDS/UC-04; payout-service pays approved refunds and owns no use case; notification-service sends customer email and SMS and owns no use case; loyalty-service owns LOYALTY/UC-01 and LOYALTY/UC-02 and takes points back when a refund is paid, per LOYALTY/UC-02 BR-1); accept every Recommended Answer in the open items loop; no chunk 19 and no Miro board.

**Project Type, 2026-09-30:** neither BRD states greenfield or brownfield and the fixed answers do not cover it, so it was set to Greenfield from the BRD evidence without asking (REFUNDS 01 describes a paper-and-phone process; no codebase is named). Rule home: [§1 Executive Summary](./01-executive-summary-scope-risks.md#1-executive-summary).

**Delegation, 2026-09-30 (LOYALTY v1.1 update):** the user reported that BRD LOYALTY has a new version and fixed the answers in advance: keep the chunks shape; accept every recommendation; accept every Recommended Answer of any open item the update raises; no Miro board; chunk 19 only if the e2e gate is open.

### Action entries

**Cross-BRD reconciliation, 2026-09-30:** REFUNDS and LOYALTY were read in full and checked against each other before the questionnaire. Personas: the REFUNDS Customer and the LOYALTY Member are different roles, kept as two actors ([§7.1](./03-users-and-use-cases.md#71-actors)). Terms: whether the LOYALTY purchase reference is the REFUNDS receipt number is flagged in [§17.4](./13d-service-loyalty.md#174-loyalty-service) and as R-03. Partner: POS Records appears in both BRDs and is one §12 row, INT-03 ([§12](./08-integrations.md#12-integrations)). Qualities: REFUNDS measures availability and LOYALTY does not; flagged in [§18.2](./14-performance-and-capacity.md#182-throughput-targets-per-service). Technical mandates: only REFUNDS states any (TI-01, TI-02), so none conflict. Dependency: points taken back after a paid refund (LOYALTY/UC-02 BR-1) is designed as the in-process `RefundPaid` event ([§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)), with its two data gaps flagged in §17.4. Same behaviour in two use cases: none. Drivers: consistent (both a first production release).

**Generation, 2026-09-30:** chunks 00 to 17, the master index, and this register were written in one run (whole). Step 6a reconciliation ran on chunks 09 to 13d and §7.3 with no divergence to record.

**Review, 2026-09-30:** the cleared-context reviewer, a separate subagent given the SKILL.md step 7 prompt skeleton, wrote chunk 18 with 22 open items and a coverage record for every required area.

**Acceptance loop, 2026-09-30:** all 22 items were accepted under the standing instruction and applied to chunks 01 to 17. The contract changes (OI-04, OI-05, OI-10, OI-11) triggered a step 6a rerun, which was clean once §14.8 row 1 (OI-04) was recorded as fixed. BRD follow-ups raised: OI-13 and OI-14 for the REFUNDS owner, OI-19 for the LOYALTY owner.

**E2E gate check, 2026-09-30:** E1, E2, and E4 are met; E3 is not, because clarification markers remain in chunks 10, 12, and 13a to 13d. Chunk 19 stays Locked; the run's instructions also exclude chunk 19.

**LOYALTY v1.1 update, 2026-09-30:** LOYALTY was read in full; its chunk 00 names the change (LOYALTY/UC-02 BR-3 and AC-2: a partial refund takes back only the points of the refunded amount), and only its chunk 06a changed. The Source BRDs register and the §7.3 group row moved to v1.1. Every cited BR-n, AC-n, and A-n of LOYALTY/UC-01 and LOYALTY/UC-02 still matches its label, because BR-3 and AC-2 were appended; no use case was added, merged, removed, or re-titled. Cross-BRD reconciliation against REFUNDS v1.0: personas, partners, quality measures, and technical mandates are unchanged; the term "partial refund" now means part of the requested amount in REFUNDS and part of a purchase in LOYALTY, so §5 has a row per meaning with a clarification for both BRD owners; the dependency needs no new data, since `RefundPaid` already carries `paidAmount`. The delta went to §17.4 (take-back rule, `refund_takeback`, Figures 24 and 25, Constraints, Developer Notes), §1, §4 R-03, §5, §8.4.2, §8.5.3, §7.3, and §21. Markers: one resolved in §17.4 (partial refunds), one raised in §5 (partial refund term), and the §17.4 earn-rounding clarification extended with its effect on a whole refund. Step 6a reran on 09 to 13d and §7.3 with no divergence; every link and anchor resolves. The Child LLDs row of Refunds Platform is marked out of date (it read SDD v1.0). BRD follow-ups: the partial refund term (REFUNDS and LOYALTY owners) and the earn rounding (LOYALTY owner).

**E2E gate check, 2026-09-30 (v1.1):** E1, E2, and E4 are met; E3 is not, because clarification markers remain in chunks 10, 12, and 13a to 13d. Chunk 19 does not exist, so it stays Locked rather than Stale, and nothing of it was written.

<!-- MASTER: refunds-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
