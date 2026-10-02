<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.3
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

All 22 open items from the review were decided on 2026-09-30, each by the user through the run's standing instruction to accept every Recommended Answer. On 2026-10-01 the LOYALTY v1.2 update superseded part of the OI-18 and OI-19 records, as their newest records say. Also on 2026-10-01, the user decided the 23 inline clarification markers that kept the e2e gate shut (chunks 10, 12, and 13a to 13d) through the decisions file [sdd-marker-decisions.md](../sdd-marker-decisions.md) (outside this SDD), section "Update after LOYALTY v1.2 (SDD v1.1)", Apply list rows 1 to 23; their records follow the open items, in Apply list order, and "CL-NN" names the decisions file's entry.

**How CL IDs resolve (business review DC-12):** in this SDD, a CL-NN citation means this file's record with that ID: the SDD's own copy of the decision, which names the decisions-file Apply list row it applied. Where the decisions file holds two entries with one ID (CL-19, CL-21, CL-22, and CL-25: a first and a replacement entry), the record is the applied entry, as it says. CL-18 and CL-20 exist there only as first-part entries that were not applied, and no rule in this SDD cites them.

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

**Superseded in part, 2026-10-01 (business review PA-08, record below):** extraction no longer adds `receiptNumber` to `REFUND_PAID`; an extracted loyalty-service reads a PII-free paid-refund event with the `RefundPaidEvent` fields (§14.7 Extraction contract). The `tenantId` part stands.

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

**Tracking note, 2026-10-01 (business review BO-06):** the follow-up is REFUNDS OI-06, open in the REFUNDS BRD.

**Rule home:** [§17.1 refund-service](./13a-service-refund.md#171-refund-service)

### OI-14 - Refund abuse controls are missing

**Question:** Receipt enumeration and a branch manager deciding their own request were possible.

**Decision record, 2026-09-30:** Accepted option A: a per-user lookup rate limit (proposed 10 a minute and 50 a day), staff accounts never hold customer roles, and a self-decision guard. BRD follow-up for the REFUNDS owner: a second receipt factor at lookup. Rationale: closes the cheap paths at no BRD cost.

**Tracking note, 2026-10-01 (business review BO-06):** the follow-up, with the look-up limit the customer sees, is REFUNDS OI-07, open in the REFUNDS BRD.

**Extended, 2026-10-01 (business review SME-05, record below):** the self-decision guard also compares the request's `customer_id` with the staff member's own customer account (`own_customer_id`), because staff use a separate customer account whose `sub` the original guard never matched; the rule is now [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-4.

**Extended, 2026-10-01 (business review PA-10, record below):** the rate-limited lookup is now `POST /v1/receipt-lookups`, with the receipt number in the body, so it no longer reaches gateway logs or spans.

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

**Decision record, 2026-10-01:** The close rule now follows LOYALTY v1.2, applied in the targeted update the user requested ("BRD LOYALTY has a new version"); no new choice was needed. [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-4 keeps a refund reported as paid before its purchase until POS Records reports the purchase, LOYALTY/NFR-01 sets no time limit on a purchase POS Records has not reported yet, and the LOYALTY 02 assumption the close rule rested on is now a confirmed dependency. A `PENDING_EARN` take-back is kept until the import applies it, and the `NO_EARN` status is removed. This supersedes the `NO_EARN` close rule of the 2026-09-30 record; the pending take-back that the import applies stands.

**Note, 2026-10-01 (business review BO-05, record below):** that LOYALTY 02 dependency is no longer Confirmed: it is To confirm before TASK-01 (LOYALTY TD-26). The pending take-back, kept until the import applies it, does not rest on it.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

### OI-19 - One bad purchase record stops the points import

**Question:** A record that cannot become an earned movement failed every run.

**Decision record, 2026-09-30:** Accepted option A: per-record validation into `purchase_import_rejection`, with an alert; only transport or authentication failures stop a run. BRD follow-up for the LOYALTY owner: how till returns and voids affect points. Rationale: an isolated, visible rejection serves LOYALTY/NFR-01 better than halting all earning.

**Decision record, 2026-10-01:** LOYALTY v1.2 settles the records that earn no points, applied in the same targeted update: [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) earns 1 point per whole euro and creates no 0-point movement, so a purchase under 1 EUR is a normal outcome. It is recorded as a member purchase with no movement and counted as `no_points`; it is no longer rejected, so it raises no alert. This supersedes the "yields no positive points" rejection criterion of the 2026-09-30 record; per-record validation stands for non-positive amounts, other currencies, and invalid records. The BRD follow-up on till returns and voids stays open for the LOYALTY owner: v1.2 does not cover them.

**Tracking note, 2026-10-01 (business review BO-04, record below):** the follow-up on till returns and voids is now LOYALTY OI-10 (TD-25), open in the LOYALTY BRD.

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

### §14.9 ratification of the event payload contracts (CL-01)

**Question:** Are the seven candidate payload contracts of §14.9.1 to §14.9.7 ratified, and with which amendments?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 1, CL-01 as written), over B (ratify them unchanged) and C (keep them `candidate` until the CardPay and MsgHub documentation arrives). All seven are `committed` in P1 as version 1.0.0 of their JSON Schema subjects; money travels as a decimal string and time as an ISO-8601 UTC string. Four amendments apply: `customerContact` becomes conditional (absent after an erasure), `customerId` is tagged `pii` and joins the erasure map, the `PAYOUT_FAILED` business cell states that `PAYOUT_SUCCEEDED` can still follow, and every `candidate` status in §14.1, §14.5, §14.9, and §17.1 to §17.3 becomes `committed`. Rationale: every field each consumer relies on already exists, the amendments come from the erasure path and the personal-data rule, and schema evolution stays additive (§14.6 rule 5), so a field a provider needs later is a 1.1.0 version, not a reason to wait.

**Rule home:** [§14.9 Payload Contract Samples](./10-events-hub.md#149-payload-contract-samples)

### §16.6 who provisions branch manager accounts (CL-02)

**Question:** Who creates branch manager accounts and assigns each its branch, when no BRD use case covers staff provisioning?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 2, CL-02 as written), over B (a platform tenant administrator role with a staff screen) and C (federation from a staff directory): a tenant staff administrator in the Keycloak realm administration, outside the web app, creates the `STAFF` account and sets its `tenant_id`, `branch_id`, and `BRANCH_MANAGER` role together; Figure 12 follows. Rationale: §2.2 already keeps staff provisioning out of the platform, the SDD never adds a use case, and ADR-07 makes the realm the identity source of staff; no role, token, or §16.12.2 count changes. Follow-up for the REFUNDS owner: who holds the administrator account for the current tenant.

**Tracking note, 2026-10-01 (business review BO-06):** the follow-up is REFUNDS OI-08, open in the REFUNDS BRD.

**Rule home:** [§16.6 Grant / Invitation Authority](./12-centralized-user-roles.md#166-grant--invitation-authority-who-can-create-whom)

### §17.1 how the branch manager is told about a failing payout (CL-03)

**Question:** Is the branch manager told about a payout still failing after one day only in the portal, or also by email or SMS?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 3, CL-03 as written), over B (email or SMS through notification-service) and C (both): in the portal only, through the payout-failing list, the flag on the request detail, and the count shown when the branch area opens. Rationale: REFUNDS 08 gives the notification partner customer messages only, and REFUNDS/UC-04 E1 and AC-2 name no channel; B would add a staff message type, a consumer, and staff contact data no BRD states. Follow-up for the REFUNDS owner: an active staff alert, if wanted.

**Tracking note, 2026-10-01 (business review BO-06):** the follow-up is REFUNDS OI-09, open in the REFUNDS BRD; reminders and escalation for undecided requests are REFUNDS OI-22 (business review SME-05).

**Rule home:** [§17.1 Business Logic, Payout outcome](./13a-service-refund.md#business-logic)

### §17.1 columns, constraints, and indexes of the `refund` schema (CL-04)

**Question:** Which further columns, constraints, and indexes of the `refund` schema does the SDD fix, and what is left to the child LLD?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 4, CL-04 as written), over B (the full physical schema now) and C (hand everything to the LLD): every column a §17.1 rule, event field, API field, tenancy rule, or retention clock relies on, the index behind each query and worker, and `tenant_id` on `refund_status_history` (Figure 15); lengths, check wording, plan-driven indexes, and the `Idempotency-Key` store go to the LLD's data section. Rationale: each added column traces to a stated rule, and the LLD cannot change a key.

**Rule home:** [§17.1 Tables Design](./13a-service-refund.md#tables-design)

### §17.1 retention of refund records and contact details (CL-05)

**Question:** How long are refund records and customer contact details kept, when the statutory period is unknown to the design?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 5, CL-05 as written), over B (one fixed period for everything) and C (no purge until the period is known): the tenant settings `refundRecordRetention` (default 10 years after `closed_at`) and `contactDetailsRetention` (default 30 days after `closed_at`), owned by the REFUNDS owner and added to the §11.2 tenant settings with `messageLogRetention`. Rationale: no law is asserted, a second tenant can differ, and contact data is minimised early; the 10-year default only prevents a purge before the owner confirms the value. Follow-up for the REFUNDS owner: the real values, with the finance and data protection advisers.

**Tracking note, 2026-10-01 (business review BO-06):** the follow-up is REFUNDS OI-10, open in the REFUNDS BRD, together with the CL-15 value.

**Rule home:** [§17.1 Retention Policy](./13a-service-refund.md#retention-policy), [§11.2 Multi-Tenancy (Default)](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### §17.1 business fields of the refund-service DTOs (CL-06)

**Question:** What are the business fields of the request and response DTOs of the nine refund-service endpoints?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 6, CL-06 as written), over B (the full OpenAPI document in the SDD) and C (leave the fields to the LLD): one table of business fields (name, type, required) and query parameters, with shared conventions (`Money`, timestamps, the page wrapper); the OpenAPI document (§21) adds formats, lengths, and examples. Rationale: AP-07 specifies client-facing endpoints before implementation, and rules that live in fields (`expectedAmount`, the partial amount range, the card-paid cap) must not be redesigned outside the SDD.

**Rule home:** [§17.1 List of APIs](./13a-service-refund.md#list-of-apis-swagger-friendly)

### §14.6 consumer retries before the DLQ (CL-07)

**Question:** How many times, and after which delays, does a consumer retry an event before sending it to its DLQ?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 7, CL-07 as written), over B (non-blocking retry topics per consumer group) and C (dead-letter on the first failure): one platform rule, §14.6 rule 4, by failure class: a message that can never apply goes to the DLQ at once; any other failure gets 3 retries at 1 s, 4 s, and 16 s with jitter, then the DLQ; while the deployable's own database is down the consumer pauses and retries every 30 s without dead-lettering. refund-service's poison-message line points to it. Rationale: in-place retries keep the per-refund order of the `refundRequestId` key and add no topic, the inbox commit makes them safe, and a database outage does not fill the DLQs; the values are design choices.

**Rule home:** [§14.6 Cross-Cutting Event Guarantees](./10-events-hub.md#146-cross-cutting-event-guarantees)

### §17.1 lawful basis, erasure path, and certifications for refund-service (CL-08)

**Question:** What lawful basis, retention, and erasure path apply to refund records and contact details, and do ISO 27001 or SOC 2 controls apply to the module?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 8, CL-08 as written), over B (a self-service erasure endpoint) and C (deleting every refund row of the customer): the purpose is fixed, the lawful basis is the one the retailer's data protection owner records, the `refund-contact-erasure` operations job clears one customer's contact details at once under the §20.3 break-glass rule and keeps the closed financial record, and no certification-specific control is added beyond §11.6. A §17.1 Input row follows. Rationale: the lawful basis is the controller's legal determination, so the SDD does not state it; B adds a use case and C may delete records a retention requires. Follow-ups: the data protection owner confirms the basis and that the erasure path answers an erasure request; the security owner decides any ISO 27001 or SOC 2 scope.

**Tracking note, 2026-10-01 (business review BO-07):** the follow-ups are REFUNDS 02 Legal clearances L1 and L5, needed before go-live.

**Rule home:** [§17.1 Compliance](./13a-service-refund.md#compliance)

### §17.2 a payout still failing after the retry window (CL-09)

**Question:** What happens to an approved refund whose payout still fails at the end of the retry window?

**Decision record, 2026-10-01:** Option B, decided by the user (decisions file, Apply list row 9, CL-09 as written), over A (stop and leave the payout `FAILED` for good) and C to E (a manual retry, another payout route, or closing the refund): `PAYOUT_FAILED` is written once at the end of the window, the refund stays Approved and flagged, and the payout keeps being retried with the same idempotency key at a 6-hour post-window interval until the provider accepts it; §1, §12 INT-01, §13, §14.5.2, and §18.3 follow. Rationale: REFUNDS/UC-04 E1 requires telling the branch manager at one day and says the system tries again, not that it stops; A strands every refund of a CardPay outage longer than the window, and C to E add behaviour neither BRD states. Follow-up for the REFUNDS owner: an end for a payout the provider refuses for good, and the post-window interval value.

**Superseded in part, 2026-10-01 (business review BO-03, record below):** the customer is now told when the payout still fails at the end of the window (`REFUND_PAYOUT_DELAYED`), the window is counted from the approval as one tenant setting, and the end for a payout the provider refuses for good is tracked in the REFUNDS BRD as OI-03. Retrying until the provider accepts stands until OI-03 is decided.

**Back-fill completed, 2026-10-01 (business review DC-04, record below):** ADR-01 now argues from retries within the retry window and then at the post-window interval; Figures 4 and 7 show the post-window loop (BO-03).

**Rule home:** [§17.2 Business Logic, After the retry window](./13b-service-payout.md#business-logic)

### §17.2 which reference identifies the original card payment (CL-10)

**Question:** Which reference identifies the original card payment to CardPay, and how does the design stay free of card data before the CardPay documentation is supplied?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 10, CL-10 as written), over B (capture a card payment reference now) and C (let payout-service receive card data): only references the platform holds (the receipt number, with the payout id as the idempotency key); no deployable handles card data; a reference CardPay turns out to need becomes an optional `REFUND_APPROVED` field, and card data needs a new ADR first. API-02's data need and its `TBD - EXTERNAL` question are extended, and the §17.2 PCI-DSS line follows. Rationale: the reference is a provider fact, so the question moves to the API-02 external item, and additive schema evolution makes a later field non-breaking. Follow-ups: the CardPay documentation (§15.6); the security owner confirms the PCI DSS scope with CardPay.

**Tracking note, 2026-10-01 (business reviews BO-05 and BO-07):** the follow-ups are REFUNDS 02 Dependencies 1 and Legal clearances L4, both needed before TASK-03 starts.

**Rule home:** [§17.2 Business Logic, Original card](./13b-service-payout.md#business-logic)

### §17.2 columns, constraints, and indexes of the payout database (CL-11)

**Question:** Which further columns, constraints, and indexes of the payout database does the SDD fix, given that some depend on undocumented API-02 fields?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 11, CL-11 as written), over B (wait for the API-02 documentation) and C (the full physical schema now): the columns the rules need (references, provider results in generic columns, attempt count, failure-report time, success time, `tenant_id` on `payout_attempt` and in Figure 19), the due-work, lease, and retention indexes, and an expand migration for any provider field later. Rationale: complete for every rule now and independent of the provider document.

**Rule home:** [§17.2 Tables Design](./13b-service-payout.md#tables-design)

### §17.2 retention of payout records (CL-12)

**Question:** How long are payout records kept?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 12, CL-12 as written), over B (a separate payout setting) and C (no end): `refundRecordRetention` counted from `succeeded_at`; a payout that has not succeeded is kept. Rationale: a refund and its payout age out together under one setting, and no law is assumed.

**Rule home:** [§17.2 Retention Policy](./13b-service-payout.md#retention-policy)

### §17.2 payout-service consumer retries (CL-13)

**Question:** How does the payout-service consumer retry a `REFUND_APPROVED` before sending it to its DLQ?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 13, CL-13 as written), over B (retry topics) and C (dead-letter on the first failure): §14.6 rule 4, with consumer retries covering database writes only, because the API-02 call happens in the `payout-retry` worker. Rationale: one consumer policy for every consumer (the CL-07 record above).

**Rule home:** [§17.2 Error Handling](./13b-service-payout.md#error-handling)

### §17.3 columns, constraints, and indexes of the notification database (CL-14)

**Question:** Which further columns, constraints, and indexes of the notification database does the SDD fix, given that some message fields depend on the API-03 documentation?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 14, CL-14 as written), over B (wait for the API-03 documentation) and C (no claim lease): the columns the rules need, generic MsgHub result columns, a `claimed_until` lease so two replicas never send one message twice, the worker and retention indexes, and the delivery log's unique key as the inbox; Business Logic and Replicas follow. The CL-14 index list carried an edit instruction for the §17.3 Boundaries; it was applied to Boundaries instead of being pasted into the index list. Rationale: MsgHub's idempotency support is unknown (§15.6), and row locks alone cannot keep one message per event and channel during the provider call.

**Rule home:** [§17.3 Tables Design](./13c-service-notification.md#tables-design)

### §17.3 retention of the delivery log (CL-15)

**Question:** How long is the delivery log kept?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 15, CL-15 as written), over B (as long as the refund record) and C (delete each row when final): the tenant setting `messageLogRetention`, default 90 days after `final_at`, owned by the REFUNDS owner. Rationale: a support window over masked data, with no law assumed. Follow-up for the REFUNDS owner: the real value.

**Tracking note, 2026-10-01 (business review BO-06):** the follow-up is part of REFUNDS OI-10, open in the REFUNDS BRD.

**Rule home:** [§17.3 Retention Policy](./13c-service-notification.md#retention-policy)

### §17.3 notification-service consumer retries (CL-16)

**Question:** How does the notification-service consumer retry a refund event before sending it to its DLQ?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 16, CL-16 as written), over B (retry topics) and C (dead-letter on the first failure): §14.6 rule 4, with consumer retries covering database writes only, because API-03 is called by the `message-retry` worker under the §12 INT-02 attempt limit. Rationale: one consumer policy, and the consumer and provider retry loops never stack.

**Rule home:** [§17.3 Error Handling](./13c-service-notification.md#error-handling)

### §17.3 lawful basis, retention, and certifications for the delivery log (CL-17)

**Question:** What lawful basis and retention apply to the delivery log, and do ISO 27001 or SOC 2 controls apply to notification-service?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 17, CL-17 as written), over B (add `customer_id` to the delivery log for targeted erasure): the §17.1 purpose and basis, erasure by age through `messageLogRetention` because the log keeps only masked addresses and no customer id, both channels `SKIPPED` for an event without `customerContact`, and no certification-specific control. Rationale: B would add personal data in order to make it erasable. Follow-ups: as for §17.1 (data protection owner, security owner).

**Tracking note, 2026-10-01 (business review BO-07):** the follow-ups are REFUNDS 02 Legal clearances L1, L2, and L5.

**Rule home:** [§17.3 Compliance](./13c-service-notification.md#compliance)

### §17.4 the identifier that links a paid refund to its member purchase (CL-19)

**Question:** On which identifier does a paid refund find the member purchase it refunds, given that whether the LOYALTY purchase reference is the REFUNDS receipt number is a fact about POS Records data that the design does not know?

**Decision record, 2026-10-01:** Option A of the replacement CL-19 entry, decided by the user (decisions file, Apply list row 18), over B (keep matching the purchase reference against the receipt number), C (carry the purchase reference with the refund), and D (look the purchase up in POS Records when the refund is paid): the receipt number is the match key; API-04 supplies it with each member purchase, `member_purchase` stores it unique per tenant, the listener and the import serialise on it, and a member purchase record without one, or with one another member purchase already has, is rejected. §14.10, API-04, §3 assumption 6, R-03, and the §5 glossary follow. Rationale: neither BRD says the two identifiers are the same, so the design must not rest on it; ADR-01 and §14.7 already name `receiptNumber` as the match key after an extraction; B now fails silently and for good, because a pending take-back has no expiry; C changes the §14.10 contract and moves a LOYALTY identifier into refund-service; D puts an external call inside the take-back. This supersedes the flag on the purchase reference question in the cross-BRD reconciliation records of 2026-09-30 ("Terms") and 2026-10-01 ("Dependency gap"), and the lock on the purchase reference in the LOYALTY v1.2 register entry on partial take-backs and in the targeted-update entry of 2026-10-01 (notes there, added by business review DC-03). The first CL-19 entry of the decisions file was not applied: the replacement supersedes it. Follow-up (external): POS Records confirms it can send the receipt number with each member purchase (API-04, §15.6).

**Rule home:** [§17.4 Business Logic, Take points back](./13d-service-loyalty.md#business-logic)

**Extended, 2026-10-01 (business review PA-03, record below):** the receipt number has one normalised form for API-01 and API-04 (§15.3 Receipt number form), refund-service stores the value API-01 returns, its uniqueness across branches is §3 assumption 12 (with the fallback to branch plus receipt number), and `loyalty_takeback_total` alerts on the share of take-backs left pending. The rejection of a member purchase without a receipt number stands.

### §17.4 columns, constraints, and indexes of the `loyalty` schema (CL-21)

**Question:** Which further columns, constraints, and indexes of the `loyalty` schema does the SDD fix, now that it records each member purchase and applies LOYALTY/UC-02 BR-3 and BR-4?

**Decision record, 2026-10-01:** Option A of the replacement CL-21 entry, decided by the user (decisions file, Apply list row 19), over B (the full physical schema now) and C (hand the rest to the LLD): `member_purchase.receipt_number` unique per tenant, `points_earned` and `reported_at` NOT NULL, `refund_takeback` with `currency`, `receipt_number`, and a `purchase_reference` set once applied, the `purchase_import_rejection` reasons without `NO_POINTS`, auditing columns with `version` on `member_balance`, the indexes behind the history, the BR-3 sums, the BR-4 order, the movement detail, and the erasure and retention jobs, and Figure 24 to match. The index list's pointer "(CL-22)" was written as "(Retention Policy)", the SDD section it means, because CL-NN IDs belong to the decisions file. Rationale: each change realises a stated rule, and the LLD fills lengths and may add indexes, never a key.

**Rule home:** [§17.4 Tables Design](./13d-service-loyalty.md#tables-design)

### §17.4 retention of a member's ledger after the member leaves (CL-22)

**Question:** How long are a member's purchases, movements, and balance kept after the member leaves the program, and how long are the take-back, rejection, and cursor records kept?

**Decision record, 2026-10-01:** Option A of the replacement CL-22 entry, decided by the user (decisions file, Apply list row 20), over B (delete a ledger after a period without movements) and C (consume a "member left" signal): the ledger and member purchases stay until the member erasure job deletes them; an `APPLIED` take-back stays as long as the member purchase it refunds and a `PENDING_EARN` one until the import applies it; rejections are deleted after 90 days; the cursor stays while the tenant exists. Rationale: joining and leaving the program are outside the platform and no signal exists; B would make points expire, which LOYALTY does not state; LOYALTY/UC-02 BR-3 counts refunds that took back 0 points toward the refunded total, so their records stay with their purchase. Follow-ups: a "member left" signal is a BRD question for the LOYALTY owner; the data protection owner accepts that pending take-backs of non-member purchases have no end (they name no member).

**Tracking note, 2026-10-01 (business review BO-06):** both follow-ups are LOYALTY OI-11 (TD-28), open in the LOYALTY BRD.

**Rule home:** [§17.4 Retention Policy](./13d-service-loyalty.md#retention-policy)

### §17.4 business fields of the loyalty-service DTOs (CL-23)

**Question:** What are the business fields of the three loyalty-service response DTOs?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 21, CL-23 as written), over B (the full OpenAPI document in the SDD) and C (leave the fields to the LLD): a field table for `PointsBalanceView`, `PointsMovementPage`, and `PointsMovementDetail` with the §17.1 conventions, and no member number in any field. Its "LOYALTY v1.1 draft" note needed no edit, because `occurred_at` of a `TAKEN_BACK` movement is already the paid date. Rationale: the fields realise LOYALTY/UC-01 step 2, A1, and AC-1, and LOYALTY/UC-02 steps 2 and 4, A1, and BR-2.

**Rule home:** [§17.4 List of APIs](./13d-service-loyalty.md#list-of-apis-swagger-friendly)

### §17.4 redeliveries of a failing `RefundPaid` before the alert (CL-24)

**Question:** How many times is a failing `RefundPaid` redelivered before its alert fires?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 22, CL-24 as written), over B (alert on the first failure) and C (stop after N attempts and park the event): the publication-log replay resubmits every 5 minutes, the alert fires at 30 minutes (about six redeliveries), and redelivery continues until the listener completes; the cadence is added to §11.1 and the alert to §11.4. Rationale: ADR-05 requires that the take-back is never lost, and an alert at 30 minutes leaves half of the LOYALTY/NFR-02 hour to act; the values are design choices.

**Rule home:** [§17.4 Error Handling](./13d-service-loyalty.md#error-handling), [§11.1 DB Modeling (Default)](./07-cross-cutting-concerns.md#111-db-modeling-default)

### §17.4 lawful basis, erasure path, and certifications for the member ledger (CL-25)

**Question:** What lawful basis and erasure path apply to a member's purchases and ledger, and do ISO 27001 or SOC 2 controls apply to the module?

**Decision record, 2026-10-01:** Option A of the replacement CL-25 entry, decided by the user (decisions file, Apply list row 23), over B (anonymise instead of delete) and C (a self-service erasure endpoint): the purpose is fixed, the basis is the one the data protection owner records, and the `loyalty-member-erasure` operations job deletes one member's balance, movements, member purchases, and the `APPLIED` take-backs of those purchases in one transaction under the receipt-number locks; a refund of an erased purchase paid later stays a pending take-back; no certification-specific control is added. A §17.4 Input row and the Developer Notes follow, and §16.8 item 4 points to both erasure paths. Rationale: as for §17.1; deleting purchases, movements, and the balance together keeps the stored balance equal to the ledger (LOYALTY/NFR-01), and B leaves identifying references in place. The first CL-25 entry of the decisions file was not applied: the replacement supersedes it. Follow-ups: as for §17.1.

**Tracking note, 2026-10-01 (business review BO-07):** the follow-ups are LOYALTY 02 Legal clearances L1 and L2.

**Rule home:** [§17.4 Compliance](./13d-service-loyalty.md#compliance)

## LOYALTY v1.2 update clarification register

Inline clarification markers that LOYALTY v1.2 answered, resolved in the targeted update of 2026-10-01. Markers the update raised stay in the chunks; the action entry below lists them.

### §17.4 how a purchase amount with cents becomes whole points

**Resolution (2026-10-01):** answered by the BRD, not by a design choice: [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) Earning (1 point for each whole 1 EUR spent; cents earn no points). The import rounds the amount down to whole euros at the tenant's earn rate, and the marker is removed.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

### §17.4 how many points a refund of part of a purchase takes back

**Resolution (2026-10-01):** answered by the BRD: [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3 (1 point for each whole euro refunded, never more than the purchase earned, all of them once the whole purchase is refunded) and AC-6: a 30.50 EUR refund of an 80-point purchase takes back 30. The take-back computes this per refund under a lock on the purchase reference; the marker is removed, and R-03 keeps only the purchase reference question.

**Superseded in part, 2026-10-01 (CL-19; noted by business review DC-03):** the take-back now serialises on the receipt number (a lock on `tenant_id` and `receipt_number`), not the purchase reference, and R-03 covers the receipt number (§17.4 Take points back).

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

## Business review register

Decisions of the business review of 2026-10-01 that change this SDD, each decided by the user in the review walkthrough. The review's own decision log is [review-comments-tracker.md](../review-comments-tracker.md); each record below names its tracker ID.

### BO-03 - A payout refused for good, the customer's message, and one payout clock

**Question:** An approved refund whose payout the provider refuses for good stayed Approved with no end, the customer was not told, and the retry deadline ran on two clocks (payout-service from the first attempt, the payout watchdog from the approval).

**Decision record, 2026-10-01:** Option B, over A (decide the end state now) and C (accept retrying with no end): `REFUND_PAYOUT_DELAYED` (§14.5.1, §14.9.8) tells the customer by email and SMS when `PAYOUT_FAILED` arrives, and `payoutFailingSince` shows on the customer's request detail ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 and AC-2 and [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) step 4, as amended); the retry window is the tenant setting `payoutRetryWindow` (§11.2), counted from the approval by payout-service and by the payout watchdog, and its end is a due time of its own (Figures 18 and 20); the end for a payout the provider refuses for good is REFUNDS OI-03, open. Supersedes in part the CL-09 record; also the ADR-10 event list and the §18.1 message count in the chunk 18 answers to OI-10 and OI-11, and, with CL-09, the first chunk 18 Reviewer Note on the circuit breaker (marked there in the verification pass). Rationale: the every-step rule of REFUNDS 04 and 05 already required the message, as it did for SDD OI-11; one origin and one value remove the false overdue flags; the end state is a money-handling choice that needs finance and the provider's refusal answers.

**Rule home:** [§17.1 Business Logic, Payout outcome](./13a-service-refund.md#business-logic), [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### BO-04 - Refunds made outside the Refunds Portal

**Question:** LOYALTY 01 and 04 promised a take-back after any refund, while the design takes points back only on `RefundPaid` and rejects POS Records records with a non-positive amount.

**Decision record, 2026-10-01:** Option B: LOYALTY 01 and 04 now limit the take-back to refunds the Refunds Portal reports as paid and list refunds made outside it as out of scope; the design is unchanged and states that a till return or void reported with a non-positive amount is rejected and takes no points back (§17.4 Earn points), and §18.2 counts such refunds outside LOYALTY/NFR-01. A second take-back source is LOYALTY OI-10, open; the OI-19 follow-up is tracked there.

**Rule home:** [§17.4 Business Logic, Earn points](./13d-service-loyalty.md#business-logic)

### BO-05 - Owners and confirmation points for external dependencies

**Question:** No §4 risk had an owner; CardPay, POS Records, and the platform team had no confirmation date; and LOYALTY 02 called two dependencies Confirmed that §15.3 and §3 assumption 3 show unverified.

**Decision record, 2026-10-01:** Option A: §4 names owners for R-02 to R-06 (R-01 is left to BO-12) and rates R-03 High impact, because a POS Records that cannot send receipt numbers stops all earning; §3 assumptions 3 and 6 now cite LOYALTY dependencies still to confirm, and assumption 11 adds the platform team's service levels within the REFUNDS/NFR-02 budget, confirmed before build by the Solution Architecture Team; §12 INT-03, §15.6, and §20.3 point to the BRD dependency owners. The BRDs hold the confirmations: REFUNDS 02 Dependencies 1 to 3 and LOYALTY 02 (TD-26, TD-27).

**Rule home:** [§4 Risks](./01-executive-summary-scope-risks.md#4-risks), [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions)

### BO-06 - Follow-ups held outside the BRD registers, and build on unsigned scope

**Question:** This register handed business decisions to the BRD owners as follow-ups that no BRD register held, the SDD and the LOYALTY versions it reads are unsigned, and §18.2 kept a marker that LOYALTY TD-15 had already answered.

**Decision record, 2026-10-01:** Option A, over B (one register in chunk 18) and C (register only): every follow-up is an open item in its BRD (tracking notes on OI-13, OI-14, OI-19, CL-02, CL-03, CL-05, CL-09, CL-15, and CL-22; the §2.2 and §3 assumption 3 markers point to REFUNDS OI-11 and LOYALTY TD-27); the legal follow-ups of CL-08, CL-10, CL-17, and CL-25 are left to BO-07. §18.2 cites TD-15 in place of its marker. The Document Lineage states the sign-off rule: a child LLD is refreshed, and build starts, only once this SDD is Approved and its source BRD versions are signed off. Rationale: a register its owner and gate already read cannot miss a decision.

**Superseded in part, 2026-10-01 (business review PM-12, record below):** the §2.2 marker no longer points to REFUNDS OI-11: PM-12 applied OI-11 (no native app in this release), and §2.2 states that decision. The §3 assumption 3 marker still points to LOYALTY TD-27.

**Rule home:** [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage), [§18.2](./14-performance-and-capacity.md#182-throughput-targets-per-service)

### BO-07 - Legal clearances as release conditions

**Question:** The lawful basis, the processor agreements and data location of CardPay and MsgHub, the keeping periods, the PCI DSS scope, certifications, and the loyalty program terms could each stop go-live, yet no BRD listed them and the §17.x Compliance sections left them to unnamed follow-ups.

**Decision record, 2026-10-01:** Option A, over B (keep them in the SDD) and C (also gate the BRD delivery outputs on them): REFUNDS 02 and LOYALTY 02 hold Legal clearances tables (owner, what to confirm, needed before go-live; the PCI DSS scope before TASK-03), and the §17.1 to §17.4 Compliance sections point to their rows; tracking notes on CL-08, CL-10, CL-17, and CL-25. Rationale: the clearances gate the release, and the one that decides whether card data may enter the platform gates the payout task.

**Rule home:** [§17.1 Compliance](./13a-service-refund.md#compliance), [§17.4 Compliance](./13d-service-loyalty.md#compliance)

### BO-08 - Why the platform is multi-tenant, and what it costs to run

**Question:** The platform is multi-tenant "by platform rule" while neither BRD plans a second tenant or states a commercial model, and no running cost was estimated.

**Decision record, 2026-10-01:** Option A, over B (ask the business for a multi-tenant purpose) and C (single tenant): multi-tenancy stays as the house platform rule, stated as not a commercial offer in §3 assumption 7 and ADR-03, which also lists each tenant's onboarding cost; §18.1 lists the running-cost drivers, priced once CardPay's fees and the platform team's charges are known. No BRD change. Rationale: the rule is house doctrine, not a business requirement; inventing a commercial case would mislead.

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions), [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions), [§18.1](./14-performance-and-capacity.md#181-load-estimates)

### BO-09 - The earn rate's owner and the rate a take-back uses

**Question:** The tenant earn rate (§11.2) had no business owner, and the take-back applied the rate in force on the refund date, so a rate change would take back a different number of points than the purchase earned.

**Decision record, 2026-10-01:** Option B: the earn rate is the LOYALTY 03 earning rule, owned by the LOYALTY product manager (§11.2); `member_purchase.earn_rate` records the rate each purchase earned at, and the take-back uses it (§17.4 Earn points, Take points back, Tables Design, Figure 24). The program's outcome objective and volumes (LOYALTY OI-12) and the redemption horizon with a points-owed report (LOYALTY OI-13) are open in the LOYALTY BRD; §18.1's member volume marker points to OI-12. Rationale: [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3 caps a take-back at what the purchase earned, which only the purchase's own rate guarantees.

**Rule home:** [§17.4 Business Logic](./13d-service-loyalty.md#business-logic), [§11.2 Multi-Tenancy (Default)](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### BO-11 - Customer care, head office, and staff administration

**Question:** No role let customer care, head office, or the staff administrator see a request or a ledger, so the only path was break-glass.

**Decision record, 2026-10-01:** Option B, over A (add the roles now) and C (accept no access): the roles are open items in the BRDs (REFUNDS OI-13, LOYALTY OI-14 with TD-31, and REFUNDS OI-08 for staff administration), each recommending read-only roles; §16.1 states that these people have no platform role until then, and §20.3 states that break-glass is never a routine support channel. Rationale: the roles widen who sees personal data, so the sponsor and the data protection owner decide them.

**Rule home:** [§16.1 Business Overview](./12-centralized-user-roles.md#161-business-overview), [§20.3 On-Call](./16-operations-runbook.md#203-on-call)

### BO-12 - The rollout and the owner of R-01

**Question:** No document planned how the portal reaches 40 branches or kept a launch out of the seasonal peak, R-01 had no mitigation or owner, and the languages customers need were unknown while a tenant has one locale.

**Decision record, 2026-10-01:** Option A, over B (write the whole plan now) and C (leave it to project management): REFUNDS 02 Assumptions / Constraints 3 fixes pilot-then-waves outside the seasonal sales period; R-01 is owned by the Operations Lead and mitigated by the rollout, whose plan (pilot branches, waves, training, customer communication, languages, paper retirement dates) is REFUNDS OI-15, open; §11.2 notes that a second language would make the locale a per-customer choice.

**Rule home:** [§4 Risks](./01-executive-summary-scope-risks.md#4-risks)

### SME-01 - The goods before the money

**Question:** A refund could be approved and paid with no step for the goods coming back, being inspected, or being disposed of, and the design stores no evidence.

**Decision record, 2026-10-01:** Option C: whether goods must return before payout, who confirms them, and whether any refund may be returnless is REFUNDS OI-16, open and gating TASK-03 (owner: the Operations Lead, from Store refund policy v3). No design change until it closes; the §6 Object Storage row notes that photo evidence would need storage.

**Rule home:** [§6 Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview)

### SME-02 - What a paid refund updates outside the portal

**Question:** A paid refund updated no sales, VAT, stock, or fiscal record, issued no credit note, and nobody owned the reconciliation of payouts with the provider's settlement.

**Decision record, 2026-10-01:** Option C: REFUNDS OI-17, open and gating TASK-03 (owner: the REFUNDS product manager with finance and the Retail IT team), recommends reporting each paid refund back as a return and a finance reconciliation report owned by finance. No design change until it closes; §12 INT-03 and §22 item 2 point to it.

**Rule home:** [§12 Integrations](./08-integrations.md#12-integrations)

### SME-03 - The market and the legal guarantee

**Question:** No document named the market, so the §17.x Compliance sections recorded "none stated" for local regulations, and faulty goods went through the 30-day commercial window.

**Decision record, 2026-10-01:** Option B: REFUNDS OI-18, open and gating TASK-01 (owner: the REFUNDS product manager with the retailer's legal adviser), names the market, adds its rules to REFUNDS 02, and splits change-of-mind refunds from faulty-goods claims; the four Local regulations lines point to it and will trace to the per-market section.

**Rule home:** [§17.1 Compliance](./13a-service-refund.md#compliance)

### SME-04 - Refunds handled at a branch

**Question:** Walk-in requests and the cases the design sends to the branch (past the window, not card-paid) had no way into the portal, while REFUNDS Objective 2 promised every request recorded.

**Decision record, 2026-10-01:** Option B: REFUNDS Objective 2 now covers requests made in the portal, and REFUNDS 04 lists branch-handled refunds as out of scope (REFUNDS OI-19); a staff-assisted request is REFUNDS OI-20, open. R-01's mitigation names both the rollout and OI-20. No design change: the §16.3 rule that a staff account never acts as a customer stands until OI-20 decides.

**Rule home:** [§4 Risks](./01-executive-summary-scope-risks.md#4-risks)

### SME-05 - A branch manager deciding alone, and on their own refund

**Question:** A manager could approve a refund filed on their own customer account, because the guard compared only the staff `sub` with the request's `customer_id`, and no decision deadline, deputy, escalation, or approval limit existed.

**Decision record, 2026-10-01:** Option B, over A (decide every control now) and C (leave the loophole to an open item): [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-4 states that a branch manager never decides on a refund request they made as a customer; the staff administrator records a staff member's own customer account as `own_customer_id` (§16.6, mapped into the token, §16.2, ADR-07), and the §17.1 guard refuses a decision when the `sub` or that claim equals the request's `customer_id`. Extends the OI-14 record. Residual risk: an undeclared customer account; head-office oversight (REFUNDS OI-13, PM-05) is the detective control. The decision deadline, reminders, escalation, deputy cover, and approval limit are REFUNDS OI-22, open.

**Rule home:** [§17.1 Business Logic, Decide](./13a-service-refund.md#business-logic), [§16.6 Grant / Invitation Authority](./12-centralized-user-roles.md#166-grant--invitation-authority-who-can-create-whom)

### SME-06 - What Paid means to the customer, and the card facts to confirm

**Question:** Paid meant the provider's acceptance while the BRD promised "until the money is back on their card", the customer got no reference to quote to their bank, and nothing confirmed CardPay's link to the terminals' acquirer or how disputes are detected.

**Decision record, 2026-10-01:** Option A, over B (a mandatory dispute check now) and C (leave it to customer care): REFUNDS 03, 04, 05, UC-04 step 7, and UC-02 step 4 define Paid as accepted by the payment provider and tell the customer the payout reference and that the money can take some days (REFUNDS OI-23). The design carries the provider's reference to the customer: `refund_request.payout_reference`, `REFUND_PAID.payoutReference` (§14.5.1, §14.9.5), `RefundRequestDetail.payoutReference`, and the §17.3 Paid message. The acquirer link, posting time, bank-quotable reference, and dispute detection are REFUNDS 02 Dependencies 1 questions, asked with API-02 (§15.3, §17.2 Original card).

**Rule home:** [§17.1 Business Logic, Payout outcome](./13a-service-refund.md#business-logic), [§14.9.5](./10-events-hub.md#1495-refund_paid---committed)

### SME-08 - The store refund policy rules

**Question:** Only two of the store's refund rules reached UC-01, and the design refunds whole receipt lines at their line price, with no unit-level refunds or promotion allocation.

**Decision record, 2026-10-01:** Option B: REFUNDS OI-24, open and gating TASK-01 (owner: the Operations Lead, from Store refund policy v3), decides which policy rules the portal applies and how part of a line and promotion items are refunded; §17.1 Submit states the whole-line behaviour until then, and the API-01 external question asks POS Records for each line's quantity, category, and net amount paid.

**Rule home:** [§17.1 Business Logic, Submit](./13a-service-refund.md#business-logic), [§15.3 API-01](./11-api-contracts.md#api-01-look-up-a-receipt-and-its-items-refund-service---pos-records)

### SME-11 - Moving from the existing loyalty program

**Question:** Members already belong to a loyalty program, yet nothing set their opening balances, the date from which purchases earn, the treatment of refunds of earlier purchases, or the program's exclusions and expiry, and the import cursor had no defined first position.

**Decision record, 2026-10-01:** Option C: LOYALTY OI-15 (TD-32), open and gating TASK-01, decides them (carry balances over as one opening movement if members hold points today, otherwise start at 0 with member communication). §17.4 states that the import cursor's first position is that date and that a refund of a purchase made before it stays a pending take-back. No other design change until it closes.

**Rule home:** [§17.4 Tables Design](./13d-service-loyalty.md#tables-design)

### SME-12 - Putting a balance right

**Question:** The append-only ledger has no correction path, so an upheld complaint, a missing-points claim, a goodwill credit, or an account merge, card replacement, or closure in the existing program could not reach the ledger.

**Decision record, 2026-10-01:** Option B: LOYALTY OI-16 (TD-33), open, decides between an adjustment movement made by a loyalty-operations persona and a partner flow from the existing program (depending on LOYALTY OI-15). §17.4 Developer Notes state that a correction is never an edit and cannot be made in this release until OI-16 closes.

**Rule home:** [§17.4 Developer Notes](./13d-service-loyalty.md#developer-notes)

### PM-04 - The customer account

**Question:** The design required self-registration and read the contact details from the account, but REFUNDS never said a customer needs an account, how it is verified, or whether a mobile number is required.

**Decision record, 2026-10-01:** Option A, over B (mobile number required) and C (no account): REFUNDS 04 In Scope, 05, UC-01 Preconditions, and 03 now state the account, registered with a verified email address and an optional mobile number, with SMS only when a number is given (REFUNDS OI-25). §3 assumptions 1 and 4, §16.6, and §17.3 Missing address cite it. The customer-facing step the CL-02 rationale kept out of the SDD is now in the BRD. No behaviour changes.

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions), [§16.6 Grant / Invitation Authority](./12-centralized-user-roles.md#166-grant--invitation-authority-who-can-create-whom)

### PM-05 - Measuring the objectives, and the head-office report

**Question:** The objectives had no measure or owner, and no report showed the sponsors whether they were met; `refund_request_to_paid_seconds` is only an operations metric.

**Decision record, 2026-10-01:** Option A: REFUNDS 01 defines each objective's measure (Objective 1: monthly average from Submitted to Paid), owned by the Head of Retail, and REFUNDS 09 adds a monthly head-office refund report (REFUNDS OI-26; starting figures in OI-27); LOYALTY Objective 1 is measured by LOYALTY/NFR-01. §17.1 specifies the report's content, computed from the module's own tables; its endpoint, token, and role wait for the head-office role of REFUNDS OI-13. §2.1, §6 Reporting, §14.7, and §22 item 3 name both reports.

**Rule home:** [§17.1 Business Logic, Head-office report](./13a-service-refund.md#business-logic)

### PM-07 - The REFUNDS side of the loyalty feed

**Question:** `RefundPaid` realised a LOYALTY 08 row that REFUNDS never committed to, and neither BRD sequenced the two launches.

**Decision record, 2026-10-01:** Option A: REFUNDS 04 In Scope and REFUNDS 08 now carry the Loyalty Points row (REFUNDS OI-28); LOYALTY 02 records that its TASK-01 acceptance waits for REFUNDS TASK-03 with the payment provider sandbox, as §19 already runs it; the launch order is LOYALTY OI-17, open. §12 and §14.10 cite both BRD rows. No design change.

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### PM-10 - The branch report as a use case

**Question:** The branch report endpoint, token, and indexes traced to REFUNDS 09 and the Proposed ADR-08 rather than to a use case and matrix row, its counting rule was never stated, and "Daily" had become on demand without a decision.

**Decision record, 2026-10-01:** Option A: REFUNDS adds [REFUNDS/UC-06](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-06-view-branch-refund-report) View Branch Refund Report (matrix row, screen SCR-04; "Daily" means one day per view, on demand) and gives the decision screen SCR-03 (REFUNDS OI-29). §17.1 Branch report states the counting rule (submitted that day by current status; paid that day; average time to decision of the requests decided that day); §7.3 gains the REFUNDS/UC-06 row and Figure 1 its node; §13 and §16.10 trace the report to UC-06. The endpoint, token, and indexes stay as designed. This changes §7.3, which the e2e gate's E3 reads.

**Rule home:** [§17.1 Business Logic, Branch report](./13a-service-refund.md#business-logic), [§7.3 Use Case Traceability](./03-users-and-use-cases.md#73-use-case-traceability-brd--sdd)

### PM-11 - Measurable NFRs and runnable UAT cases

**Question:** REFUNDS/NFR-02 did not define disruption, REFUNDS/NFR-03 had no measure, the UAT environment lacked the MsgHub sandbox, and LOYALTY P8 had no legitimate staging.

**Decision record, 2026-10-01:** Option A: REFUNDS/NFR-02 counts any time customers cannot submit, track, or cancel or managers cannot decide, whatever the cause, and NFR-03 requires the same response at three times the normal number (REFUNDS OI-30). §18.2 spells out what counts as disruption (POS Records and Keycloak outages and planned maintenance count; a messaging outage alone does not) and R-04 notes that a POS Records outage counts. §19 adds the MsgHub sandbox to UAT and stages LOYALTY P8 through the POS Records sandbox (a member purchase reported for less than its receipt's items), so no UAT-only publisher of `RefundPaid` is needed; the §19 marker now covers P5 and P6 only. Business review BO-06 already aligned §18.2 with LOYALTY TD-15.

**Rule home:** [§18.2 Throughput Targets](./14-performance-and-capacity.md#182-throughput-targets-per-service), [§19 Environments](./15-environments.md#19-environments)

### PM-12 - Deferred features: horizons and triggers

**Question:** Deferred features had no horizon or owner; the §2.2 marker on "Web and Mobile" waited on REFUNDS OI-11; the ADR-01 extraction trigger (points redemption) and the §22 settlement reconciliation had no decision point.

**Decision record, 2026-10-01:** Option A: REFUNDS OI-11 is applied (no native app in this release; "Web and Mobile" means the web app on phones and computers), so the §2.2 marker is replaced by that statement; each BRD's 12 Wishlist now lists an owner and a trigger per item. ADR-01's redemption trigger is reviewed when LOYALTY OI-13 sets the redemption horizon; §22 item 1 cites it, and §22 item 2 takes its owner and trigger from REFUNDS 12 Wishlist item 4. Supersedes the §2.2 part of the BO-06 tracking record above.

**Rule home:** [§2.2 Out of Scope](./01-executive-summary-scope-risks.md#22-out-of-scope), [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions), [§22 Wishlist](./17-appendix-and-wishlist.md#22-wishlist)

### PA-02 - One paid time; a payout that fails after acceptance

**Question:** `paid_at` came "from `PAYOUT_SUCCEEDED`", which carries no time; the LOYALTY/NFR-02 hour was phrased three ways; and nothing asked whether a payout CardPay has accepted can still fail.

**Decision record, 2026-10-01:** Option A, over B (reserve an inbound contract and reversals now) and C (CardPay's acceptance time): `paid_at` is the time of the PAID transition, taken once in the PAID transaction; it is also the PAID row's `changed_at`, the `REFUND_PAID` envelope `occurred_at`, and `RefundPaidEvent.paidAt`, so it starts the LOYALTY/NFR-02 hour as LOYALTY OI-02 decided and dates the take-back (LOYALTY 03 Movement date). §17.1, §14.9.5, §14.10, §17.4, §18.2, and §19 say so. Whether an accepted payout can still fail or be reversed is a written CardPay confirmation (REFUNDS 02 Dependencies 1, §12 INT-01, §15.3 API-02, §15.6, R-02) before TASK-03; if it can, the way back is designed then. This changes chunks 10, 11, 13a, and 13d, which the e2e gate reads.

**Rule home:** [§17.1 Tables Design](./13a-service-refund.md#tables-design), [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core), [§15.3 API-02](./11-api-contracts.md#api-02-send-a-refund-payout-to-the-original-card-payout-service---payment-provider)

### PA-03 - One receipt number across the platform

**Question:** The receipt number joins a paid refund to its member purchase, yet its source was mis-cited, its uniqueness across branches was assumed nowhere, refund-service stored the typed value while loyalty-service stored the API-04 value, and a mismatch parked take-backs for ever with no alert.

**Decision record, 2026-10-01:** Option A, over B (key on branch plus receipt number now) and C (earn without a receipt number): one normalisation rule for API-01 and API-04 (§15.3 Receipt number form); refund-service stores the value API-01 returns (§17.1); the format and the uniqueness scope are written confirmations before TASK-01 (§3 assumption 12, REFUNDS 02 Assumption 1 and Dependency 2, LOYALTY 02 Dependencies, the API-01 and API-04 external questions and §15.6), with the fallback stated (branch plus receipt number, or a code printed on the receipt); §3 assumption 6 cites the corrected LOYALTY 08 row; R-03 covers repeats and form drift; `loyalty_takeback_total` alerts on the share of take-backs left pending against the pilot baseline (§17.4). The CL-19 rejection of a member purchase without a receipt number stands. This changes chunks 11, 13a, and 13d, which the e2e gate reads.

**Rule home:** [§15.3 API-01](./11-api-contracts.md#api-01-look-up-a-receipt-and-its-items-refund-service---pos-records), [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions), [§17.4 Metrics](./13d-service-loyalty.md#metrics)

### PA-05 - Member sign-in and the owner of member and branch identifiers

**Question:** Member sign-in had no integration or contract, §16.3 and §16.6 described the member's identity source differently, §16.6 cited §3 assumption 1 for a rule it did not state, and the `member_id` and `branch_id` claims were compared with POS Records values that nobody owned.

**Decision record, 2026-10-01:** Option A, over B (decide now on a realm account) and C (decide now on brokering): POS Records is the source of truth for member numbers and branch identifiers (§3 assumptions 2 and 3; §17.1 and §17.4 Tables Design); the staff administrator takes `branch_id` from the POS Records list the Retail IT team supplies (§16.6). §16.2 step 1 states what each answer to §3 assumption 3 requires (realm account; or brokered, with `tenant_id` from the host's client, `member_id` from the provider, and linking to the person's customer account); §16.3, §16.6, and §16.8 follow; §12 adds the member sign-in note, with the INT row, contract, and mapping added when LOYALTY TD-27 is answered. §3 assumption 1 now states "one account per person, staff excepted". The §3 assumption 3 marker stays open (TD-27). This changes chunks 12, 13a, and 13d, which the e2e gate reads.

**Rule home:** [§16.2 Resolution Model](./12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action), [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions)

### PA-06 - Event wire format, in-process event versioning, and final facts

**Question:** ADR-10's header filter had no header to read, the registry had no subject-naming rule for topics that carry several event types, the in-process `RefundPaidEvent` had no version or evolution rule although the publication log replays it across deployments, and `PAYOUT_FAILED` named a failure that is not final.

**Decision record, 2026-10-01:** Option A, over B (rename `PAYOUT_FAILED`) and C (no headers): §14.3 Wire format (key `refundRequestId`; headers `event_id`, `event_type`, `schema_version`, `tenant_id`, `correlation_id`, `traceparent`, written by the relay; value the whole JSON envelope; one subject per event type, `<topic>-<EVENT_TYPE>`); §14.5 types every event as final or not (`PAYOUT_FAILED` and `REFUND_PAYOUT_DELAYED` are not), with notes in §14.9.7 and §14.9.8; `RefundPaidEvent` carries `schemaVersion` under §14.6 rule 5 (§14.10, §17.1, §17.4, §11.1); ADR-10 and §17.2 filter on the `event_type` header; the §17.1 outbox row names the headers. This changes chunks 10, 13a, 13b, and 13d, which the e2e gate reads.

**Rule home:** [§14.3 Standard Event Envelope](./10-events-hub.md#143-standard-event-envelope-every-event-every-topic), [§14.6 Cross-Cutting Event Guarantees](./10-events-hub.md#146-cross-cutting-event-guarantees)

### PA-07 - Publishing order and the dedup window

**Question:** The per-refund order promised by §14.3 depended on how many relays publish one outbox, which no chunk stated, and the exactly-once effect depended on dedup records outliving every redelivery, while inbox rows were purged after 7 days and notification-service's dedup lived only as long as `messageLogRetention`.

**Decision record, 2026-10-01:** Option A, over B (drop the ordering promise) and C (fit every retention inside 7 days): §14.6 rule 3 sets one active relay per outbox under a database lock, publishing in commit order with an idempotent producer, and lists the consumers that rely on per-refund order; §14.6 rule 2 adds the dedup window (topic retention plus DLQ retention plus replay window); the inbox purge in §17.1 and §17.2 follows it (kept until the §6 and §20.1.3 values are set); `messageLogRetention` can never be below it (§17.3); §14.2, §6, §20.1.3, and §20.1.7 follow; the §23 reviewer note that left relay concurrency to the LLD is superseded in part. This changes chunks 10, 13a, 13b, and 13c, which the e2e gate reads.

**Rule home:** [§14.6 Cross-Cutting Event Guarantees](./10-events-hub.md#146-cross-cutting-event-guarantees) rules 2 and 3

### PA-08 - The loyalty extraction contract

**Question:** ADR-01 reduced extraction to consuming `REFUND_PAID` with `receiptNumber` added, which would put contact data into loyalty-service, had no cutover rule for the take-back dedup in the core database, and left no policy for a take-back after redemption.

**Decision record, 2026-10-01:** Option A, over B (`REFUND_PAID` with fields added) and C (leave it to the extraction project): §14.7 Extraction contract: a PII-free paid-refund event with exactly the `RefundPaidEvent` fields, key `refundRequestId`, on a topic of its own (names set at extraction), never the refund topic; cutover by publishing both ways in the PAID transaction for one release, draining the publication log, copying the `loyalty` schema with `refund_takeback`, and consuming from the start of the new topic; ADR-01 Consequences, §14.9.5, and §22 items 1 and 3 follow; ADR-10 gains the revisit trigger "any new reader of the refund topic"; the §17.4 "No redemption" invariant points to LOYALTY OI-13, which now asks what a take-back does to points already spent. Supersedes the extraction part of OI-04 (note above and chunk 18). This changes chunks 10 and 13d, which the e2e gate reads.

**Rule home:** [§14.7 Universal Subscribers & Cross-Service Doctrines](./10-events-hub.md#147-universal-subscribers--cross-service-doctrines)

### PA-09 - Refund details on a member's points movement

**Question:** §17.4 shows the refund reference, paid date, and amount to the member whose purchase was refunded, who may not be the refund's customer, while REFUNDS/NFR-04 lets only the customer and their branch's manager see a request; the `RefundPaid` contract did not say which refund attributes may leave the refund context.

**Decision record, 2026-10-01:** Option A, over B (replace the reference now) and C (narrow NFR-04 now): the conflict is raised to both BRD owners as REFUNDS OI-32 and LOYALTY OI-18 (TD-35), recommending amount and date without the reference, decided before LOYALTY TASK-04. §14.10 lists the attributes that leave the refund context (`referenceNumber`, `receiptNumber`, `paidAmount`, `paidAt`; no customer identity or contact detail) and who sees them; §17.4 `PointsMovementDetail` and §16.2 step 4 follow; a note records the gap in the cross-BRD reconciliation. This changes chunks 10, 12, and 13d, which the e2e gate reads.

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### PA-10 - Personal data in URLs, logs, and traces

**Question:** The receipt lookup carried a declared personal-data value in its URL path, which gateway logs and spans record; gateway logs and traces were in no erasure path; and a request log recording the host would name the tenant in clear.

**Decision record, 2026-10-01:** Option A, over B (redact the route at the gateway and in spans) and C (treat receipt numbers as not personal): the lookup is `POST /v1/receipt-lookups` with `ReceiptLookupRequest`, a read that changes no state (200, no `Idempotency-Key`), rate-limited at the gateway (§6); §11.4 bars personal data from URL paths and query strings in every API, and gateway logs and spans record the route template and `tenant_ref`, never the raw URL, a body, or the host name; §14.9 maps the log and trace stores; §7.3, Figure 6, §16.2, §17.1, and §17.4 follow; OI-14 notes the new route. The child LLD still names the old route until it is refreshed. This changes chunks 10, 12, 13a, and 13d, which the e2e gate reads.

**Rule home:** [§11.4 Observability](./07-cross-cutting-concerns.md#114-observability-default), [§17.1 List of APIs](./13a-service-refund.md#list-of-apis-swagger-friendly)

### PA-11 - Composite primary and foreign keys

**Question:** ADR-03 and §11.1 make `tenant_id` the leading column of every index, yet most tables and both outboxes were keyed on a single column and every foreign key referenced the bare `id`, which row-level security does not check; each Tables Design also barred the LLD from changing a key.

**Decision record, 2026-10-01:** Option A, over B (a recorded exception for UUIDv7 keys with a compensating control): every primary key leads with `tenant_id` (`(tenant_id, id)` or a natural key that leads with it), every foreign key is `(tenant_id, parent id)` referencing the parent's composite key, and the outboxes are keyed `(tenant_id, event_id)`. ADR-03 and §11.1 state the rule; the Tables Design of §17.1, §17.2, §17.3, and §17.4 and Figures 15, 19, 22, and 24 follow (rows added for `payout_attempt.id`, `payout_id` and `notification_message.template_id`). The LLD clause "never change a key" now protects composite keys. This changes chunks 13a to 13d, which the e2e gate reads.

**Rule home:** [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions), [§11.1 DB Modeling](./07-cross-cutting-concerns.md#111-db-modeling-default)

### PA-12 - The scope of gate condition E3

**Question:** E3 checked markers only inside chunks 09-13x and §7.3, so the gate opened while the gated specs computed from §12 timeouts and retries, the §6 retention, and the §20.1.3 replay window, all markers, and from the Proposed ADR-04 and ADR-08.

**Decision record, 2026-10-01:** Option A, over B (accepted exceptions in chunk 19) and C (resolve the markers now): in this SDD, E3 also covers every marker and Proposed ADR that a rule in chunks 09-13x or a §24.6 doctrine cites normatively (master, End-to-End View note); the master gate line lists today's items and flags §24.6 item 8 on the Proposed ADR-08; R-06 and the §14.9 erasure map say the retention bound is still open; the last gate-check record is marked superseded. Chunk 19 is not edited while the gate is shut; its GATE header takes the wider E3 at its next refresh. The lineage-row part of the review point is DC-11. This changes chunk 10 (the §14.9 erasure-map note), which the e2e gate reads.

**Rule home:** [master, End-to-End View](./refunds-platform-sdd-master.md#end-to-end-view-gated)

### DC-03 - A Superseded status for chunk 18

**Question:** Chunk 18 showed OI-18 and OI-19 as applied in forms later decisions replaced, its legend had no status for that, and two decision-log entries still described the purchase-reference lock that CL-19 replaced.

**Decision record, 2026-10-01:** Option A, over B (rewrite chunk 18 in place) and C (leave it): chunk 18's legend and GATES note gain `Superseded` (in full or in part, with pointers), which counts as resolved; OI-18, OI-19, and OI-04 are "Superseded in part" with pointers to the superseding records and the live rule, and their Resolution Log rows say so; the LOYALTY v1.2 register entry on partial take-backs and the targeted-update entry carry supersession notes, and the CL-19 record lists them.

**Rule home:** [§23 How to read each item](./18-open-items-and-clarifications.md#how-to-read-each-item)

### DC-04 - Architecture views behind CL-09 and OI-03

**Question:** ADR-01 still argued from one-day retries, Figure 3 omitted the `core_events` schema, and the CL-09 back-fill record left out §8.4.1, §8.5.2, and ADR-01 (Figures 4 and 7 were already redrawn by BO-03).

**Decision record, 2026-10-01:** Option A, over B (fix ADR-01 and Figure 3 only): ADR-01 Why and Alternatives & Trade-offs describe retries within the tenant's retry window and then at the post-window interval; Figure 3's core database node and its summary show `core_events`; notes on the CL-09 record and the "Clarification decisions applied" record list what the back-fill missed and where it was closed.

**Rule home:** [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions), [§8.3 Figure 3](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram)

### DC-08 - The whole-purchase rule and the card-paid cap

**Question:** The card-paid cap (§17.1) makes LOYALTY/UC-02 BR-3's "whole purchase refunded" unreachable for a receipt paid partly by card, and the take-back compares API-01 item amounts with the API-04 purchase amount with no shared basis.

**Decision record, 2026-10-01:** Option A, over B (`RefundPaid` reports a completed receipt now) and C (leave it): the meaning of "whole purchase" is LOYALTY OI-19 (TD-36, before TASK-01), linked to REFUNDS OI-06, recommending "every item returned"; the API-01 and API-04 external questions and §15.6 ask whether the amounts share one basis; §17.4 Take points back states both limits and the additive `RefundPaid` field the recommended answer would need; a note records the gap in the cross-BRD reconciliation. This changes chunks 11 and 13d, which the e2e gate reads.

**Rule home:** [§17.4 Business Logic, Take points back](./13d-service-loyalty.md#business-logic)

### DC-11 - The lineage rows and the duplicate 1.0

**Question:** The Child LLDs row disagreed with the last Child LLDs check and could not show that the LLD is out of date, Source BRDs showed no status for BRD versions nobody had signed off, and the Changes Log had two rows numbered 1.0.

**Decision record, 2026-10-01:** Option A, over B (renumber and shift later rows) and C (merge the 1.0 rows): the LLD's own Changes Log (row 1.1) confirms it read SDD 1.2, so the row's numbers stay; Child LLDs gains a State column (Out of date since the business review; refreshed once this SDD is Approved), Source BRDs a Status column (both In Review, awaiting sign-off G6); the second 1.0 Changes Log row is relabelled "1.0 (amended)" with a note on the missed bump; the Child LLDs check record is marked superseded. Resolves the lineage-row part of PA-12.

**Rule home:** [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage)

### DC-12 - IDs that resolve to one thing

**Question:** CL-NN IDs pointed outside the SDD, where four have two entries; the SDD's own OI-NN overlapped the BRDs' OI-NN (§14.8's "OI-04"); the v1.1 Changes Log cited "UC-01 and UC-02 E1" without a key; and BR-n and AC-n existed only as positions in the BRD use cases.

**Decision record, 2026-10-01:** Option A, over B (renumber CL and key every OI across the chain) and C (label BR and AC only): the Clarification register states that a CL-NN citation means the SDD's own record (which names its Apply list row; for a duplicated ID, the applied entry); chunk 18's ID field and the §5 Glossary state that an unkeyed OI-NN is the SDD's own and BRD items carry their key; §14.8 row 1 cites "SDD OI-04"; the v1.1 Changes Log row cites LOYALTY/UC-01 and LOYALTY/UC-02 E1; REFUNDS 06a and 06b and LOYALTY 06a label every BR-n and AC-n inline at its current position.

**Rule home:** [§5 Glossary, BRD key](./01-executive-summary-scope-risks.md#5-glossary), [Clarification register](#clarification-register)

## Walkthrough and delegation history

**Delegation, 2026-09-30:** the user fixed the run's answers in advance: output mode chunks, generation whole, intent derive from the BRDs; BRD keys REFUNDS (Refunds Portal) and LOYALTY (Loyalty Points); accept all recommendations in the architecture questionnaire and the ecosystem selection; the service decomposition (refund-service owns REFUNDS/UC-01 to REFUNDS/UC-04; payout-service pays approved refunds and owns no use case; notification-service sends customer email and SMS and owns no use case; loyalty-service owns LOYALTY/UC-01 and LOYALTY/UC-02 and takes points back when a refund is paid, per LOYALTY/UC-02 BR-1); accept every Recommended Answer in the open items loop; no chunk 19 and no Miro board.

**Project Type, 2026-09-30:** neither BRD states greenfield or brownfield and the fixed answers do not cover it, so it was set to Greenfield from the BRD evidence without asking (REFUNDS 01 describes a paper-and-phone process; no codebase is named). Rule home: [§1 Executive Summary](./01-executive-summary-scope-risks.md#1-executive-summary).

**Delegation, 2026-10-01:** the user's request was "BRD LOYALTY has a new version", with the run's answers fixed in advance: accept the recommendation wherever the skill would ask, accept every Recommended Answer of any new open item, no Miro board, and no chunk 19 or other next step in this run.

**Delegation, 2026-10-01 (clarification decisions):** the user's request was "Here are my decisions on the open clarifications: [sdd-marker-decisions.md](../sdd-marker-decisions.md). Take each Recommended Answer named in the Apply list of its section 'Update after LOYALTY v1.2 (SDD v1.1)' as my decision. Apply them, then generate the e2e design (chunk 19)." The run's answers were fixed in advance: accept the recommendation wherever the skill would ask, accept every Recommended Answer of any new open item, and no Miro board. The decisions file is the user's; this register records its 23 decisions above and does not restate it.

### Action entries

**Cross-BRD reconciliation, 2026-09-30:** REFUNDS and LOYALTY were read in full and checked against each other before the questionnaire. Personas: the REFUNDS Customer and the LOYALTY Member are different roles, kept as two actors ([§7.1](./03-users-and-use-cases.md#71-actors)). Terms: whether the LOYALTY purchase reference is the REFUNDS receipt number is flagged in [§17.4](./13d-service-loyalty.md#174-loyalty-service) and as R-03. Partner: POS Records appears in both BRDs and is one §12 row, INT-03 ([§12](./08-integrations.md#12-integrations)). Qualities: REFUNDS measures availability and LOYALTY does not; flagged in [§18.2](./14-performance-and-capacity.md#182-throughput-targets-per-service). Technical mandates: only REFUNDS states any (TI-01, TI-02), so none conflict. Dependency: points taken back after a paid refund (LOYALTY/UC-02 BR-1) is designed as the in-process `RefundPaid` event ([§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)), with its two data gaps flagged in §17.4. Same behaviour in two use cases: none. Drivers: consistent (both a first production release).

**Generation, 2026-09-30:** chunks 00 to 17, the master index, and this register were written in one run (whole). Step 6a reconciliation ran on chunks 09 to 13d and §7.3 with no divergence to record.

**Review, 2026-09-30:** the cleared-context reviewer, a separate subagent given the SKILL.md step 7 prompt skeleton, wrote chunk 18 with 22 open items and a coverage record for every required area.

**Acceptance loop, 2026-09-30:** all 22 items were accepted under the standing instruction and applied to chunks 01 to 17. The contract changes (OI-04, OI-05, OI-10, OI-11) triggered a step 6a rerun, which was clean once §14.8 row 1 (OI-04) was recorded as fixed. BRD follow-ups raised: OI-13 and OI-14 for the REFUNDS owner, OI-19 for the LOYALTY owner.

**E2E gate check, 2026-09-30:** E1, E2, and E4 are met; E3 is not, because clarification markers remain in chunks 10, 12, and 13a to 13d. Chunk 19 stays Locked; the run's instructions also exclude chunk 19.

**LOYALTY version check, 2026-10-01:** the Source BRDs register held LOYALTY 1.0; the BRD's cover and master read 1.2. The BRD master shows its one generation part Complete, so the BRD is finished; its cover reads In Review (version 1.1 awaits sign-off), which the skill does not gate on. The update ran as a targeted update in the SDD's own mode (chunks, whole). LOYALTY is a chunked BRD, so only the register Version changed; its Link and every link into it stay.

**Cross-BRD reconciliation, 2026-10-01 (LOYALTY v1.2 against REFUNDS v1.0):** Personas: unchanged, two actors. Terms: LOYALTY's "refund of part of a purchase" ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3: whole euros refunded) is not the REFUNDS glossary's "Partial refund" (part of the requested amount); the take-back follows the refunded amount whatever its cause, so the SDD needs no glossary split. Partner: POS Records stays one §12 row, INT-03, now also citing LOYALTY 02 Dependencies; the new Refunds Portal row of LOYALTY 08 is REFUNDS itself, realised in process by `RefundPaid`, whose DTO carries every item that row lists except the member, which comes from the matching purchase ([§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)). Qualities: LOYALTY/NFR-02 now counts from the later of the paid refund and the POS Records report, and LOYALTY/NFR-03 is new; no REFUNDS measure covers the same quality. Technical mandates: LOYALTY 12 still states none. Dependency gap: whether the LOYALTY purchase reference is the REFUNDS receipt number stays flagged in §17.4 and R-03. Same behaviour in two use cases: none. Drivers: unchanged. No conflict needed a question.

**Note, 2026-10-01 (business review PA-09):** neither reconciliation above checked the conflict between REFUNDS/NFR-04 (only the customer and their branch's manager see a request) and LOYALTY/UC-02 step 4 and AC-4 (refund details shown to the member whose purchase was refunded); it is now REFUNDS OI-32 and LOYALTY OI-18, and §14.10 states the attributes that leave the refund context.

**Note, 2026-10-01 (business review DC-08):** the reconciliation also did not examine the card-paid cap against LOYALTY/UC-02 BR-3 ("whole purchase refunded"), unreachable for a receipt paid partly by card, or whether the API-01 item amounts and the API-04 purchase amount share a basis; these are now LOYALTY OI-19 (linked to REFUNDS OI-06) and the API-01 and API-04 external questions.

**Targeted update, 2026-10-01 (LOYALTY v1.0 to v1.2):** the delta was read from the LOYALTY Changes Log (v1.1, v1.2) and the chunks; v1.2 itself only added diagrams. No use case was added, merged, removed, or re-titled, so §7.3 keeps its two LOYALTY rows (group row now v1.2) and 09 keeps loyalty-service as their owner. Every cited BR-n and AC-n was re-checked: none moved; the BR-1 label follows its new wording in 01, 04, 06, 10, and 13d, and the new UC-01 A1, E1, AC-2, AC-3 and UC-02 A2, E1, AC-2 to AC-8 are cited where §17.4 realises them. Rules, integrations, and qualities flowed to: §17.4 (member purchase record, whole-euro earning, no 0-point movement, movement dates, the BR-3 take-back under a lock on the purchase reference, the BR-4 pending take-back with no expiry, the movement detail of step 4, E1 handling, a 15-minute import, earn and take-back lag metrics), §8.4.2 and §8.5.3, the §13 loyalty-service row, §14.10 (BR-1 label, Refunds Portal mapping), §15.3 API-04 data needs, §12 (Refunds Portal note, INT-03 dependency), the §11.4 alert, §18.2 and §18.4, §19 (LOYALTY UAT prerequisites), §20.1.9, §21, §3 (assumptions 1, 3, 6, 9), §2.2, §4 R-03, §5, §7.1, §7.2, and §16.6, §16.8, and Figure 12. Markers resolved by the BRD: two in §17.4 (register above). Markers raised: §3 assumption 3 (member sign-in with the existing loyalty program account) and §19 (how UAT stages LOYALTY P5, P6, and P8); neither sits in a chunk the e2e gate reads. Marker changed: §20.1.9 item (4). New open items: none, because no behaviour lacks a BRD use case and no two use cases overlap. Version 1.0 to 1.1; the Child LLDs row is marked out of date.

**Superseded in part, 2026-10-01 (CL-19; noted by business review DC-03):** "the BR-3 take-back under a lock on the purchase reference" above now reads under a lock on the receipt number, which is also the match key (§17.4 Take points back).

**Contract reconciliation, 2026-10-01:** step 6a rerun on chunks 09 to 13d and §7.3 after the update. Topic and event names, producer and consumer lists, and payload fields are unchanged; `RefundPaid` matches §14.10 from both sides by name, publisher, listener, phase, and DTO fields; `loyalty.points.read-own` matches §16.11; API-04 keeps its §15.4 coverage and no new synchronous integration appeared; §7.3 agrees with 09, the §17.4 List of APIs, the 05 `Use cases:` lines, §15.2, and §14.10; every link resolves, file and anchor. No divergence to record; §14.8 row 1 stays Fixed in v1.0. The master's Reconciled date is 2026-10-01.

**E2E gate check, 2026-10-01:** E1 met (22 items, all Accepted - applied; no new item), E2 met (no Open row in §14.8, §15.5, or §16.12.3), E4 met (reconciled after the last change); E3 not met: markers remain in chunks 10 (1), 12 (1), 13a (6), 13b (5), 13c (4), and 13d (6). Chunk 19 stays Locked; it does not exist, so nothing is marked Stale.

**Handoff offer, 2026-10-01:** the skill's closing offer ("Want me to fill in section X now that you have decisions?") was recorded and declined under the run's instructions; chunk 19 was not offered, because the gate is shut.

**Child LLDs check, 2026-10-01 (clarification decisions run):** the one row (Refunds Platform, from-sdd, LLD 1.0, read SDD 1.0) links to `../lld-refunds-platform/refunds-platform-lld-master.md`, which exists and whose Related SDD line links back to this SDD's master; its four scope services are §13 rows (its "Angular web app" scope item is not a §13 service and is left as lld-unifier wrote it). No unregistered sibling LLD exists. The row's SDD version note now names v1.2; only lld-unifier refreshes the row.

**Superseded, 2026-10-01 (business review DC-11, record in the Business review register):** after this check, lld-unifier refreshed the LLD to 1.1 against SDD 1.2 (LLD 00 Changes Log, row 1.1), which is what the row shows. The row now also has a State column: Out of date, because the business review changed this SDD after 1.2.

**E2E gate check, 2026-10-01 (before the clarification decisions):** E1 met (22 open items, all Accepted - applied), E2 met (§14.8 has one row, Fixed in v1.0; §15.5 and §16.12.3 have none), E4 met (reconciled after the LOYALTY v1.2 update); E3 not met: 23 markers in chunks 10 (1), 12 (1), 13a (6), 13b (5), 13c (4), and 13d (6), the 23 the Apply list names.

**Clarification decisions applied, 2026-10-01:** the 23 Apply list entries were applied in the decisions file's apply order (CL-09, CL-10, CL-03, and CL-08, then CL-01; CL-02; CL-04 to CL-07; CL-11 to CL-17; CL-19, then CL-21 to CL-25), each with its "Also apply" edits, removing every marker of chunks 10, 12, and 13a to 13d. Not applied, as the Apply list's rules say: the first-part entries CL-18 to CL-22 and CL-25, the "LOYALTY v1.1 draft found during this run" section, and the inline "LOYALTY v1.1 draft" notes. Adaptations: CL-06's two unlinked use-case references were written as keyed links (SKILL.md principle 17); CL-14's index bullet carried an edit instruction for the §17.3 Boundaries, applied to Boundaries ("whose unique key is the inbox") and not pasted as a bullet; CL-21's "(CL-22)" was written "(Retention Policy)"; CL-01 amendment 2's "Notes gain `pii`" was written as "; `pii`" after an existing note. Back-fill beyond the Apply list, so that no chunk contradicts a decision: §8.1.2 (payouts are retried until they succeed, instead of "for up to one day", after CL-09), the §5 Tenant settings definition (adds the retention settings of CL-05), and §20.1.9 item (1) (points to "§17.2 After the retry window" instead of the clarification CL-09 removed, as the decisions file's out-of-scope note asks). No decision sets an architecture direction, so no ADR was added or changed, and each rationale is in its record above. Chunk 18 is unchanged: these were inline markers, not open items, and no new open item was raised. Version 1.1 to 1.2, with one Changes Log row.

**Note, 2026-10-01 (business review DC-04):** the CL-09 back-fill above missed §8.4.1 Figure 4, §8.5.2 Figure 7, and ADR-01. The two figures were redrawn with the post-window retry loop by business review BO-03, ADR-01 was reworded by DC-04, and Figure 3 now shows the `core_events` schema that OI-03 added.

**Contract reconciliation, 2026-10-01 (after the clarification decisions):** step 6a rerun on chunks 09 to 13d and §7.3, including §14.10 (CL-19 Notes cell), API-02 and API-04 (CL-10, CL-19), and §16.6 and §16.8 (CL-02, CL-25). Topic and event names match §14.4 and §14.5 character for character; each of the seven events has one producer, and every consumer list matches the consumed tables; every field a consumer relies on is in §14.9 (`customerContact` is now conditional, which §17.3 handles as `SKIPPED`); `RefundPaid` matches §14.10 from both sides by name, publisher, listener, phase, and DTO fields; the eight permission tokens and three roles match §16.11; the four API contracts keep their §15.4 coverage, stay `TBD - external`, and no synchronous chain is deeper than one hop; §7.3 agrees with 09, the Lists of APIs, the 05 `Use cases:` lines, §15.2, §14.5, and §14.10; all 470 relative links resolve, file and anchor. No divergence to record; §14.8 row 1 stays Fixed in v1.0. The master's Reconciled date is 2026-10-01.

**E2E gate check, 2026-10-01 (after the clarification decisions):** E1 met (22 open items, all Accepted - applied; no new item), E2 met (unchanged registers, no Open row), E3 met (no clarification marker in chunks 09, 10, 11, 12, 13a to 13d, or in §7.3), E4 met (reconciled after the last change). The gate is open.

**Superseded, 2026-10-01 (business review PA-12, record in the Business review register):** E3 is wider in this SDD: it also covers markers and Proposed ADRs that a rule in chunks 09-13x or a §24.6 doctrine cites (§12 INT-01 to INT-03, §6, §20.1.3, ADR-04, ADR-08), none of which this check read. The gate is Shut (master), also for E4 after the business review.

**End-to-end design, 2026-10-01:** chunk 19 written from its skeleton as a consolidation of 09, 10, 11, 12, and 13a to 13d: 4 services, 2 topics, 7 integration events and 1 in-process event, 4 synchronous HTTP edges (all to external systems), no in-process port call, 2 sagas, Figures 26 to 30, and Tables 25 to 27. The counts were checked against §13, §14.4, the §14.9.99 coverage matrix, and §14.10, every synchronous edge against §15.2, and every Mermaid block by reading. The master links chunk 19 and reads E2E gate Open - Up to date.

<!-- MASTER: refunds-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
