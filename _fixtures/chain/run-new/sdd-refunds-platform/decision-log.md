<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: SDD - Refunds Platform
PURPOSE: Single home for the architecture questionnaire record, the intake and delegation record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Refunds Platform

## How to read

The numbered chunks hold the current settled design; the ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how the decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-09-28:** Accept all. Answered by the user through a standing delegation to take every recommended answer (see Walkthrough and delegation history). Style: hybrid; followed the recommendation. The drivers were clear and consistent, so "Accept all" was the recommended option; the assumed Q2 does not change the Q4 recommendation (two or three teams would give the same profile).

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Stage | First production release (Recommended) / MVP / Platform at scale | First production release | REFUNDS 01 (paper process replaced, 40 branches); LOYALTY 04 (redemption is a later phase); both wishlists | [§8.1](./04-architecture-style-and-diagrams.md#81-architecture-style) |
| Q2 Teams | One team (Recommended) / Two or three / Four or more | One team | assumption - BRD silent (pre-filled from Q1) | [§8.1](./04-architecture-style-and-diagrams.md#81-architecture-style) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | REFUNDS 02 Facts (1,200 a month, 3x for 3 weeks); REFUNDS/NFR-02, REFUNDS/NFR-03 | [§18](./14-performance-and-capacity.md#18-performance--capacity-planning) |
| Q4 Architecture style | Hybrid (Recommended) / Modular monolith / Microservices | Hybrid | Q1-Q3 profile "first production release"; two parts with different failure needs (CardPay payouts, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 and REFUNDS/NFR-01; MsgHub fan-out) | [§10 ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process inside the core, event backbone with outbox between deployables (Recommended) / Event backbone everywhere / Mostly synchronous REST | Event backbone with outbox between deployables; the two core modules also exchange facts only through the broker | Q4; audit and replay needs of refunds (REFUNDS/NFR-01) | [§10 ADR-05](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | Schema per module, own database per extracted service (Recommended) / Database per service / Database per service plus reporting store | Schema per module, own database per extracted service | Q4; one report only (REFUNDS 09) | [§10 ADR-06](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy | Shared schema with `tenant_id` (Recommended) / Schema per tenant / Database per tenant / Single tenant | Shared schema with `tenant_id` | Platform rule (low volume); one retailer today; BRDs silent on tenants | [§10 ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q8 Deployment | Kubernetes, one Helm chart per deployable (Recommended) / Managed container service / Simple container setup | Kubernetes (on-premises), one Helm chart per deployable | BRDs silent on hosting; Kafka and Keycloak are the on-premises defaults | [§11.3](./07-cross-cutting-concerns.md#113-deployment-default) |

## Ecosystem selection record

**Outcome, 2026-09-28:** Accept all, under the same delegation. No row was walked through or overridden; the §6 Notes column carries each row's source (BRD-mandated rows: REFUNDS/TI-01, REFUNDS/TI-02).

## Clarification register

All 14 open items from the review (chunk 18) are decided on 2026-09-28. Each was decided by the user through the standing delegation "accept every Recommended Answer", and each Recommended Answer was applied as written.

### OI-01 - Questionnaire citations and the team-size driver

**Question:** Should the design text cite the architecture questionnaire by question number, and where does the "one team" driver of ADR-01 live?

**Decision record, 2026-09-28:** Option A accepted: questionnaire citations replaced by their settled evidence; team size recorded as assumption A-9 and cited by ADR-01; the §6 legend uses `ADR` instead of `questionnaire`. Rationale: a driver that is an assumption must be visible in §3, where its failure can be tested.

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions), [§10](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-02 - Partner ingress and tenant resolution for provider calls

**Question:** How do provider calls into the platform (API-03, API-06) reach it and resolve their tenant, and how is an API-05 read checked against the event's tenant?

**Decision record, 2026-09-28:** Option A accepted: ADR-11 (a partner route on the API gateway with a per-tenant partner key resolved before signature verification) and a tenant check on every API-05 read. Rationale: ADR-11.

**Rule home:** [§10 ADR-11](./06-principles-and-decisions.md#10-architectural-decisions), [§11.2](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### OI-03 - Readiness scope and relay ordering

**Question:** Should Kafka and the outbox relay gate readiness of the core, and what guarantees per-aggregate event order?

**Decision record, 2026-09-28:** Option A accepted: readiness checks the database only; one active outbox relay per publisher under a PostgreSQL advisory lock; notification-service skips superseded messages. Rationale: the broker must never sit on the request path (ADR-05, REFUNDS/NFR-02), and one relay per database makes per-aggregate order hold at this volume.

**Rule home:** [§11.3](./07-cross-cutting-concerns.md#113-deployment-default), [§14.6](./10-events-hub.md#146-cross-cutting-event-guarantees)

### OI-04 - Purchase identity and business dates

**Question:** Is a receipt number unique per tenant, and in which time zone do calendar rules run?

**Decision record, 2026-09-28:** Option A accepted: a purchase is identified by (branch, receipt number) in every key and match; business calendar rules use the tenant's time zone. Rationale: correct under either POS numbering scheme at the cost of index changes before any data exists; the BRD counts days as the customer and the branch see them.

**Rule home:** [§6](./02-ecosystem-overview.md#6-ecosystem-overview), [§17.1](./13a-service-refund.md#171-refund-service), [§17.4](./13d-service-loyalty.md#174-loyalty-service)

### OI-05 - Idempotency records

**Question:** Where is the first response of an idempotent write kept, for whom, and how is a concurrent repeat answered?

**Decision record, 2026-09-28:** Option A accepted: `idempotency_record` per module or service, scoped by tenant, caller, and operation, with an IN_PROGRESS state and a 24-hour expiry. Rationale: a replay promise needs a stored response, and the caller scope closes a leak REFUNDS/NFR-04 forbids.

**Rule home:** [§11.1](./07-cross-cutting-concerns.md#111-db-modeling-default)

### OI-06 - Payout attempts from committed state

**Question:** How is a first attempt tied to a committed payout, and what resumes an attempt interrupted by a crash?

**Decision record, 2026-09-28:** Option A accepted: every attempt is made by the scheduler from committed rows under a lease; an expired lease re-attempts in doubt. Rationale: ADR-10 (How).

**Rule home:** [§17.2](./13b-service-payout.md#172-payout-service), [§10 ADR-10](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-07 - Stored and matched CardPay results

**Question:** How is a CardPay result matched when the payout has no provider reference yet?

**Decision record, 2026-09-28:** Option A accepted: every API-03 result is stored before acknowledgement and matched on our echoed identifiers, then on the provider reference; the rule lives only in API-03. Rationale: the in-doubt case is exactly where the provider reference is missing, and storing first loses nothing (REFUNDS/NFR-01).

**Rule home:** [API-03](./11-api-contracts.md#api-03-receive-a-payout-result-cardpay---payout-service)

### OI-08 - Approval message and refund-level payout failure

**Question:** Is the customer told of an approval, and which fact tells the branch manager that a payout failed?

**Decision record, 2026-09-28:** Option A accepted: notification-service consumes `REFUND_APPROVED`; refund-service publishes `REFUND_PAYOUT_FAILED`, which emails the branch's managers; the queue flag stays. Rationale: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-1 and three REFUNDS scope statements require the approval message, and E1 requires that the manager be told.

**Rule home:** [§14.5](./10-events-hub.md#145-platform-event-catalog), [§17.3](./13c-service-notification.md#173-notification-service)

### OI-09 - Availability measure and its dependencies

**Question:** What counts as disruption for REFUNDS/NFR-02, and which dependencies does the target cover?

**Decision record, 2026-09-28:** Option A accepted: a disrupted-minute measure at the gateway over customer, member, and branch manager endpoints, POS-caused 503s included and reported separately; Keycloak and the gateway with at least two replicas; risk R-08. Rationale: REFUNDS/NFR-02 is written from the customer's side.

**Rule home:** [§18](./14-performance-and-capacity.md#18-performance--capacity-planning)

### OI-10 - Payout completeness checks

**Question:** How is REFUNDS/NFR-01 verified without reading two private databases, and who sees a duplicate at CardPay?

**Decision record, 2026-09-28:** Option A accepted: two daily checks, each inside its owner (the refund-service watchdog and the payout-service reconciliation with CardPay). Rationale: both halves of "never lost or paid twice" are verified where each can fail, keeping data ownership.

**Rule home:** [§18](./14-performance-and-capacity.md#18-performance--capacity-planning)

### OI-11 - Late purchases and closed take-backs

**Question:** What happens to a take-back closed before its delayed purchase arrives?

**Decision record, 2026-09-28:** Option A accepted: closed take-backs stay matchable and apply, with an alert, when the purchase arrives; a stalled-feed alert; the LOYALTY targets restated; the one-hour exception is a BRD follow-up for the LOYALTY owner. Rationale: a delayed feed is a planned scenario and must not make a take-back irreversible.

**Rule home:** [§17.4](./13d-service-loyalty.md#174-loyalty-service)

### OI-12 - Receipt lookup exposure

**Question:** How is a receipt protected from a signed-in customer who guesses its number?

**Decision record, 2026-09-28:** Option B (the recommended option) accepted: minimal lookup response, a per-customer lookup limit, an alert, and risk R-09; proof of possession is a BRD follow-up for the REFUNDS owner. Rationale: it closes enumeration and over-disclosure now without changing an approved BRD flow.

**Rule home:** [§17.1](./13a-service-refund.md#171-refund-service), [§4](./01-executive-summary-scope-risks.md#4-risks)

### OI-13 - Business objective metric and tenant context in telemetry

**Question:** How is REFUNDS Business Objective 1 measured, and how do logs and metrics carry tenant context without `tenant_id`?

**Decision record, 2026-09-28:** Option A accepted: a submission-to-PAID histogram; `tenant_ref` on every log line and metric. Rationale: the main business objective must be measured continuously, and an opaque alias gives tenant context without logging `tenant_id`.

**Rule home:** [§11.4](./07-cross-cutting-concerns.md#114-observability-default)

### OI-14 - One home for the payout retry window

**Question:** Where is the length of the payout retry window stated?

**Decision record, 2026-09-28:** Option A accepted: ADR-10 holds it; every other place references "the ADR-10 retry window". Rationale: one fact, one home; a change becomes a single edit.

**Rule home:** [§10 ADR-10](./06-principles-and-decisions.md#10-architectural-decisions)

## Walkthrough and delegation history

**Delegation, 2026-09-28:** the user asked for a non-interactive run and gave these answers up front: output shape chunks; generation whole; direction derive from the BRDs; BRD keys REFUNDS (Refunds Portal) and LOYALTY (Loyalty Points); accept every recommendation of the architecture questionnaire and the ecosystem selection; the service decomposition below; accept every Recommended Answer in the open-items loop; no chunk 19 and no Miro board.

### Action entries

**Intake, 2026-09-28:** both BRDs were read in full; both masters show every generation part Complete (REFUNDS parts 1-3, LOYALTY whole). REFUNDS 15 and 16 were read as context only (both Up to date); REFUNDS 14 and LOYALTY 14 were skipped as working artifacts; LOYALTY 15-17 are Locked (not produced). Project type: Greenfield, inferred without a question from REFUNDS 01 (paper-based process today) and from neither BRD naming a codebase; rule home [§1](./01-executive-summary-scope-risks.md#1-executive-summary).

**Service decomposition, 2026-09-28 (user answer):** refund-service owns [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) ([REFUNDS/UC-05](../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary) is merged into [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) in its BRD); payout-service pays approved refunds and owns no use case; notification-service sends customer email and SMS and owns no use case; loyalty-service owns [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) and takes points back when a refund is paid ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1). Mapped onto the hybrid of ADR-01: refund-service and loyalty-service are modules of the core deployable, payout-service and notification-service separate deployables. Rule home: [§13](./09-services-summary.md#13-services-decomposition-summary).

**Cross-BRD reconciliation, 2026-09-28:** no conflict needed a question. Findings and where each landed:

| Overlap | Finding | Landed in |
|---------|---------|-----------|
| Persona | REFUNDS Customer and LOYALTY Member are different roles of one person (a member is a customer who joined the program) | Two actors, one identity: [§7.1](./03-users-and-use-cases.md#71-actors), ADR-07 |
| Term | No term with two meanings | [§5](./01-executive-summary-scope-risks.md#5-glossary) |
| Partner | POS Records appears in both BRDs | One row, INT-03: [§12](./08-integrations.md#12-integrations) |
| Quality | Different qualities per BRD; no shared measure | Per-scope targets: [§18](./14-performance-and-capacity.md#18-performance--capacity-planning) |
| Technical mandate | Only REFUNDS states mandates (REFUNDS/TI-01, REFUNDS/TI-02); LOYALTY states none, and the defaults match | [§6](./02-ecosystem-overview.md#6-ecosystem-overview) |
| Dependency | LOYALTY takes points back when a REFUNDS refund is paid | `REFUND_PAID` consumed by loyalty-service; the data gaps are flagged as A-4 and in §17.4, with risks R-03 and R-04 |
| Same behaviour | None | - |

**Contract design, 2026-09-28:** the per-service API lists, event models, and database models of chunks 13a to 13d were proposed from the BRD use cases and the settled ADRs and taken under the delegation; values the BRDs and the delegation do not settle (timeouts, sizing, retention, provider contracts) stay flagged in the chunks.

**Reconciliation, 2026-09-28:** step 6a run over chunks 03, 05, 09, 10, 11, 12, and 13a-13d: names, producers and consumers, payload fields, permission tokens, API IDs, entry points, and every UC link checked; no divergence found.

**Review, 2026-09-28:** the cleared-context reviewer wrote chunk 18 with 14 open items and 12 reviewer notes (notes are not decisions and were not applied).

**Acceptance loop, 2026-09-28:** all 14 Recommended Answers accepted under the standing delegation and applied as plain design text; chunk 18 statuses set to Accepted - applied with Resolution Log rows; one Changes Log row added in chunk 00. The keyed use-case citations in the chunk 18 item text were made into links to match the SDD link rule; no wording changed.

**Reconciliation rerun, 2026-09-28:** after the loop (new event `REFUND_PAYOUT_FAILED`, ADR-11, contract and table changes): step 6a rerun over the same chunks; no divergence found.

**E2E gate, 2026-09-28:** checked after the loop: E1, E2, and E4 met; E3 not met (clarification markers remain in chunks 10, 13a, 13b, 13c, and 13d). Chunk 19 stays Locked and was not written; the user also asked for no chunk 19 in this run.

<!-- MASTER: refunds-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
