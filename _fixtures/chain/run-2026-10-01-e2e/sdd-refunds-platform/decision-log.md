<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.2
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

All 22 open items from the review were decided on 2026-09-30, each by the user through the run's standing instruction to accept every Recommended Answer. On 2026-10-01 the LOYALTY v1.2 update superseded part of the OI-18 and OI-19 records, as their newest records say. Also on 2026-10-01, the user decided the 23 inline clarification markers that kept the e2e gate shut (chunks 10, 12, and 13a to 13d) through the decisions file [sdd-marker-decisions.md](../sdd-marker-decisions.md), section "Update after LOYALTY v1.2 (SDD v1.1)", Apply list rows 1 to 23; their records follow the open items, in Apply list order, and "CL-NN" names the decisions file's entry.

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

**Decision record, 2026-10-01:** The close rule now follows LOYALTY v1.2, applied in the targeted update the user requested ("BRD LOYALTY has a new version"); no new choice was needed. [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-4 keeps a refund reported as paid before its purchase until POS Records reports the purchase, LOYALTY/NFR-01 sets no time limit on a purchase POS Records has not reported yet, and the LOYALTY 02 assumption the close rule rested on is now a confirmed dependency. A `PENDING_EARN` take-back is kept until the import applies it, and the `NO_EARN` status is removed. This supersedes the `NO_EARN` close rule of the 2026-09-30 record; the pending take-back that the import applies stands.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

### OI-19 - One bad purchase record stops the points import

**Question:** A record that cannot become an earned movement failed every run.

**Decision record, 2026-09-30:** Accepted option A: per-record validation into `purchase_import_rejection`, with an alert; only transport or authentication failures stop a run. BRD follow-up for the LOYALTY owner: how till returns and voids affect points. Rationale: an isolated, visible rejection serves LOYALTY/NFR-01 better than halting all earning.

**Decision record, 2026-10-01:** LOYALTY v1.2 settles the records that earn no points, applied in the same targeted update: [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) earns 1 point per whole euro and creates no 0-point movement, so a purchase under 1 EUR is a normal outcome. It is recorded as a member purchase with no movement and counted as `no_points`; it is no longer rejected, so it raises no alert. This supersedes the "yields no positive points" rejection criterion of the 2026-09-30 record; per-record validation stands for non-positive amounts, other currencies, and invalid records. The BRD follow-up on till returns and voids stays open for the LOYALTY owner: v1.2 does not cover them.

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

**Rule home:** [§16.6 Grant / Invitation Authority](./12-centralized-user-roles.md#166-grant--invitation-authority-who-can-create-whom)

### §17.1 how the branch manager is told about a failing payout (CL-03)

**Question:** Is the branch manager told about a payout still failing after one day only in the portal, or also by email or SMS?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 3, CL-03 as written), over B (email or SMS through notification-service) and C (both): in the portal only, through the payout-failing list, the flag on the request detail, and the count shown when the branch area opens. Rationale: REFUNDS 08 gives the notification partner customer messages only, and REFUNDS/UC-04 E1 and AC-2 name no channel; B would add a staff message type, a consumer, and staff contact data no BRD states. Follow-up for the REFUNDS owner: an active staff alert, if wanted.

**Rule home:** [§17.1 Business Logic, Payout outcome](./13a-service-refund.md#business-logic)

### §17.1 columns, constraints, and indexes of the `refund` schema (CL-04)

**Question:** Which further columns, constraints, and indexes of the `refund` schema does the SDD fix, and what is left to the child LLD?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 4, CL-04 as written), over B (the full physical schema now) and C (hand everything to the LLD): every column a §17.1 rule, event field, API field, tenancy rule, or retention clock relies on, the index behind each query and worker, and `tenant_id` on `refund_status_history` (Figure 15); lengths, check wording, plan-driven indexes, and the `Idempotency-Key` store go to the LLD's data section. Rationale: each added column traces to a stated rule, and the LLD cannot change a key.

**Rule home:** [§17.1 Tables Design](./13a-service-refund.md#tables-design)

### §17.1 retention of refund records and contact details (CL-05)

**Question:** How long are refund records and customer contact details kept, when the statutory period is unknown to the design?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 5, CL-05 as written), over B (one fixed period for everything) and C (no purge until the period is known): the tenant settings `refundRecordRetention` (default 10 years after `closed_at`) and `contactDetailsRetention` (default 30 days after `closed_at`), owned by the REFUNDS owner and added to the §11.2 tenant settings with `messageLogRetention`. Rationale: no law is asserted, a second tenant can differ, and contact data is minimised early; the 10-year default only prevents a purge before the owner confirms the value. Follow-up for the REFUNDS owner: the real values, with the finance and data protection advisers.

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

**Rule home:** [§17.1 Compliance](./13a-service-refund.md#compliance)

### §17.2 a payout still failing after the retry window (CL-09)

**Question:** What happens to an approved refund whose payout still fails at the end of the retry window?

**Decision record, 2026-10-01:** Option B, decided by the user (decisions file, Apply list row 9, CL-09 as written), over A (stop and leave the payout `FAILED` for good) and C to E (a manual retry, another payout route, or closing the refund): `PAYOUT_FAILED` is written once at the end of the window, the refund stays Approved and flagged, and the payout keeps being retried with the same idempotency key at a 6-hour post-window interval until the provider accepts it; §1, §12 INT-01, §13, §14.5.2, and §18.3 follow. Rationale: REFUNDS/UC-04 E1 requires telling the branch manager at one day and says the system tries again, not that it stops; A strands every refund of a CardPay outage longer than the window, and C to E add behaviour neither BRD states. Follow-up for the REFUNDS owner: an end for a payout the provider refuses for good, and the post-window interval value.

**Rule home:** [§17.2 Business Logic, After the retry window](./13b-service-payout.md#business-logic)

### §17.2 which reference identifies the original card payment (CL-10)

**Question:** Which reference identifies the original card payment to CardPay, and how does the design stay free of card data before the CardPay documentation is supplied?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 10, CL-10 as written), over B (capture a card payment reference now) and C (let payout-service receive card data): only references the platform holds (the receipt number, with the payout id as the idempotency key); no deployable handles card data; a reference CardPay turns out to need becomes an optional `REFUND_APPROVED` field, and card data needs a new ADR first. API-02's data need and its `TBD - EXTERNAL` question are extended, and the §17.2 PCI-DSS line follows. Rationale: the reference is a provider fact, so the question moves to the API-02 external item, and additive schema evolution makes a later field non-breaking. Follow-ups: the CardPay documentation (§15.6); the security owner confirms the PCI DSS scope with CardPay.

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

**Rule home:** [§17.3 Retention Policy](./13c-service-notification.md#retention-policy)

### §17.3 notification-service consumer retries (CL-16)

**Question:** How does the notification-service consumer retry a refund event before sending it to its DLQ?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 16, CL-16 as written), over B (retry topics) and C (dead-letter on the first failure): §14.6 rule 4, with consumer retries covering database writes only, because API-03 is called by the `message-retry` worker under the §12 INT-02 attempt limit. Rationale: one consumer policy, and the consumer and provider retry loops never stack.

**Rule home:** [§17.3 Error Handling](./13c-service-notification.md#error-handling)

### §17.3 lawful basis, retention, and certifications for the delivery log (CL-17)

**Question:** What lawful basis and retention apply to the delivery log, and do ISO 27001 or SOC 2 controls apply to notification-service?

**Decision record, 2026-10-01:** Option A, decided by the user (decisions file, Apply list row 17, CL-17 as written), over B (add `customer_id` to the delivery log for targeted erasure): the §17.1 purpose and basis, erasure by age through `messageLogRetention` because the log keeps only masked addresses and no customer id, both channels `SKIPPED` for an event without `customerContact`, and no certification-specific control. Rationale: B would add personal data in order to make it erasable. Follow-ups: as for §17.1 (data protection owner, security owner).

**Rule home:** [§17.3 Compliance](./13c-service-notification.md#compliance)

### §17.4 the identifier that links a paid refund to its member purchase (CL-19)

**Question:** On which identifier does a paid refund find the member purchase it refunds, given that whether the LOYALTY purchase reference is the REFUNDS receipt number is a fact about POS Records data that the design does not know?

**Decision record, 2026-10-01:** Option A of the replacement CL-19 entry, decided by the user (decisions file, Apply list row 18), over B (keep matching the purchase reference against the receipt number), C (carry the purchase reference with the refund), and D (look the purchase up in POS Records when the refund is paid): the receipt number is the match key; API-04 supplies it with each member purchase, `member_purchase` stores it unique per tenant, the listener and the import serialise on it, and a member purchase record without one, or with one another member purchase already has, is rejected. §14.10, API-04, §3 assumption 6, R-03, and the §5 glossary follow. Rationale: neither BRD says the two identifiers are the same, so the design must not rest on it; ADR-01 and §14.7 already name `receiptNumber` as the match key after an extraction; B now fails silently and for good, because a pending take-back has no expiry; C changes the §14.10 contract and moves a LOYALTY identifier into refund-service; D puts an external call inside the take-back. This supersedes the flag on the purchase reference question in the cross-BRD reconciliation records of 2026-09-30 ("Terms") and 2026-10-01 ("Dependency gap"). The first CL-19 entry of the decisions file was not applied: the replacement supersedes it. Follow-up (external): POS Records confirms it can send the receipt number with each member purchase (API-04, §15.6).

**Rule home:** [§17.4 Business Logic, Take points back](./13d-service-loyalty.md#business-logic)

### §17.4 columns, constraints, and indexes of the `loyalty` schema (CL-21)

**Question:** Which further columns, constraints, and indexes of the `loyalty` schema does the SDD fix, now that it records each member purchase and applies LOYALTY/UC-02 BR-3 and BR-4?

**Decision record, 2026-10-01:** Option A of the replacement CL-21 entry, decided by the user (decisions file, Apply list row 19), over B (the full physical schema now) and C (hand the rest to the LLD): `member_purchase.receipt_number` unique per tenant, `points_earned` and `reported_at` NOT NULL, `refund_takeback` with `currency`, `receipt_number`, and a `purchase_reference` set once applied, the `purchase_import_rejection` reasons without `NO_POINTS`, auditing columns with `version` on `member_balance`, the indexes behind the history, the BR-3 sums, the BR-4 order, the movement detail, and the erasure and retention jobs, and Figure 24 to match. The index list's pointer "(CL-22)" was written as "(Retention Policy)", the SDD section it means, because CL-NN IDs belong to the decisions file. Rationale: each change realises a stated rule, and the LLD fills lengths and may add indexes, never a key.

**Rule home:** [§17.4 Tables Design](./13d-service-loyalty.md#tables-design)

### §17.4 retention of a member's ledger after the member leaves (CL-22)

**Question:** How long are a member's purchases, movements, and balance kept after the member leaves the program, and how long are the take-back, rejection, and cursor records kept?

**Decision record, 2026-10-01:** Option A of the replacement CL-22 entry, decided by the user (decisions file, Apply list row 20), over B (delete a ledger after a period without movements) and C (consume a "member left" signal): the ledger and member purchases stay until the member erasure job deletes them; an `APPLIED` take-back stays as long as the member purchase it refunds and a `PENDING_EARN` one until the import applies it; rejections are deleted after 90 days; the cursor stays while the tenant exists. Rationale: joining and leaving the program are outside the platform and no signal exists; B would make points expire, which LOYALTY does not state; LOYALTY/UC-02 BR-3 counts refunds that took back 0 points toward the refunded total, so their records stay with their purchase. Follow-ups: a "member left" signal is a BRD question for the LOYALTY owner; the data protection owner accepts that pending take-backs of non-member purchases have no end (they name no member).

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

**Rule home:** [§17.4 Compliance](./13d-service-loyalty.md#compliance)

## LOYALTY v1.2 update clarification register

Inline clarification markers that LOYALTY v1.2 answered, resolved in the targeted update of 2026-10-01. Markers the update raised stay in the chunks; the action entry below lists them.

### §17.4 how a purchase amount with cents becomes whole points

**Resolution (2026-10-01):** answered by the BRD, not by a design choice: [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) Earning (1 point for each whole 1 EUR spent; cents earn no points). The import rounds the amount down to whole euros at the tenant's earn rate, and the marker is removed.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

### §17.4 how many points a refund of part of a purchase takes back

**Resolution (2026-10-01):** answered by the BRD: [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3 (1 point for each whole euro refunded, never more than the purchase earned, all of them once the whole purchase is refunded) and AC-6: a 30.50 EUR refund of an 80-point purchase takes back 30. The take-back computes this per refund under a lock on the purchase reference; the marker is removed, and R-03 keeps only the purchase reference question.

**Rule home:** [§17.4 loyalty-service](./13d-service-loyalty.md#174-loyalty-service)

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

**Targeted update, 2026-10-01 (LOYALTY v1.0 to v1.2):** the delta was read from the LOYALTY Changes Log (v1.1, v1.2) and the chunks; v1.2 itself only added diagrams. No use case was added, merged, removed, or re-titled, so §7.3 keeps its two LOYALTY rows (group row now v1.2) and 09 keeps loyalty-service as their owner. Every cited BR-n and AC-n was re-checked: none moved; the BR-1 label follows its new wording in 01, 04, 06, 10, and 13d, and the new UC-01 A1, E1, AC-2, AC-3 and UC-02 A2, E1, AC-2 to AC-8 are cited where §17.4 realises them. Rules, integrations, and qualities flowed to: §17.4 (member purchase record, whole-euro earning, no 0-point movement, movement dates, the BR-3 take-back under a lock on the purchase reference, the BR-4 pending take-back with no expiry, the movement detail of step 4, E1 handling, a 15-minute import, earn and take-back lag metrics), §8.4.2 and §8.5.3, the §13 loyalty-service row, §14.10 (BR-1 label, Refunds Portal mapping), §15.3 API-04 data needs, §12 (Refunds Portal note, INT-03 dependency), the §11.4 alert, §18.2 and §18.4, §19 (LOYALTY UAT prerequisites), §20.1.9, §21, §3 (assumptions 1, 3, 6, 9), §2.2, §4 R-03, §5, §7.1, §7.2, and §16.6, §16.8, and Figure 12. Markers resolved by the BRD: two in §17.4 (register above). Markers raised: §3 assumption 3 (member sign-in with the existing loyalty program account) and §19 (how UAT stages LOYALTY P5, P6, and P8); neither sits in a chunk the e2e gate reads. Marker changed: §20.1.9 item (4). New open items: none, because no behaviour lacks a BRD use case and no two use cases overlap. Version 1.0 to 1.1; the Child LLDs row is marked out of date.

**Contract reconciliation, 2026-10-01:** step 6a rerun on chunks 09 to 13d and §7.3 after the update. Topic and event names, producer and consumer lists, and payload fields are unchanged; `RefundPaid` matches §14.10 from both sides by name, publisher, listener, phase, and DTO fields; `loyalty.points.read-own` matches §16.11; API-04 keeps its §15.4 coverage and no new synchronous integration appeared; §7.3 agrees with 09, the §17.4 List of APIs, the 05 `Use cases:` lines, §15.2, and §14.10; every link resolves, file and anchor. No divergence to record; §14.8 row 1 stays Fixed in v1.0. The master's Reconciled date is 2026-10-01.

**E2E gate check, 2026-10-01:** E1 met (22 items, all Accepted - applied; no new item), E2 met (no Open row in §14.8, §15.5, or §16.12.3), E4 met (reconciled after the last change); E3 not met: markers remain in chunks 10 (1), 12 (1), 13a (6), 13b (5), 13c (4), and 13d (6). Chunk 19 stays Locked; it does not exist, so nothing is marked Stale.

**Handoff offer, 2026-10-01:** the skill's closing offer ("Want me to fill in section X now that you have decisions?") was recorded and declined under the run's instructions; chunk 19 was not offered, because the gate is shut.

**Child LLDs check, 2026-10-01 (clarification decisions run):** the one row (Refunds Platform, from-sdd, LLD 1.0, read SDD 1.0) links to `../lld-refunds-platform/refunds-platform-lld-master.md`, which exists and whose Related SDD line links back to this SDD's master; its four scope services are §13 rows (its "Angular web app" scope item is not a §13 service and is left as lld-unifier wrote it). No unregistered sibling LLD exists. The row's SDD version note now names v1.2; only lld-unifier refreshes the row.

**E2E gate check, 2026-10-01 (before the clarification decisions):** E1 met (22 open items, all Accepted - applied), E2 met (§14.8 has one row, Fixed in v1.0; §15.5 and §16.12.3 have none), E4 met (reconciled after the LOYALTY v1.2 update); E3 not met: 23 markers in chunks 10 (1), 12 (1), 13a (6), 13b (5), 13c (4), and 13d (6), the 23 the Apply list names.

**Clarification decisions applied, 2026-10-01:** the 23 Apply list entries were applied in the decisions file's apply order (CL-09, CL-10, CL-03, and CL-08, then CL-01; CL-02; CL-04 to CL-07; CL-11 to CL-17; CL-19, then CL-21 to CL-25), each with its "Also apply" edits, removing every marker of chunks 10, 12, and 13a to 13d. Not applied, as the Apply list's rules say: the first-part entries CL-18 to CL-22 and CL-25, the "LOYALTY v1.1 draft found during this run" section, and the inline "LOYALTY v1.1 draft" notes. Adaptations: CL-06's two unlinked use-case references were written as keyed links (SKILL.md principle 17); CL-14's index bullet carried an edit instruction for the §17.3 Boundaries, applied to Boundaries ("whose unique key is the inbox") and not pasted as a bullet; CL-21's "(CL-22)" was written "(Retention Policy)"; CL-01 amendment 2's "Notes gain `pii`" was written as "; `pii`" after an existing note. Back-fill beyond the Apply list, so that no chunk contradicts a decision: §8.1.2 (payouts are retried until they succeed, instead of "for up to one day", after CL-09), the §5 Tenant settings definition (adds the retention settings of CL-05), and §20.1.9 item (1) (points to "§17.2 After the retry window" instead of the clarification CL-09 removed, as the decisions file's out-of-scope note asks). No decision sets an architecture direction, so no ADR was added or changed, and each rationale is in its record above. Chunk 18 is unchanged: these were inline markers, not open items, and no new open item was raised. Version 1.1 to 1.2, with one Changes Log row.

**Contract reconciliation, 2026-10-01 (after the clarification decisions):** step 6a rerun on chunks 09 to 13d and §7.3, including §14.10 (CL-19 Notes cell), API-02 and API-04 (CL-10, CL-19), and §16.6 and §16.8 (CL-02, CL-25). Topic and event names match §14.4 and §14.5 character for character; each of the seven events has one producer, and every consumer list matches the consumed tables; every field a consumer relies on is in §14.9 (`customerContact` is now conditional, which §17.3 handles as `SKIPPED`); `RefundPaid` matches §14.10 from both sides by name, publisher, listener, phase, and DTO fields; the eight permission tokens and three roles match §16.11; the four API contracts keep their §15.4 coverage, stay `TBD - external`, and no synchronous chain is deeper than one hop; §7.3 agrees with 09, the Lists of APIs, the 05 `Use cases:` lines, §15.2, §14.5, and §14.10; all 470 relative links resolve, file and anchor. No divergence to record; §14.8 row 1 stays Fixed in v1.0. The master's Reconciled date is 2026-10-01.

**E2E gate check, 2026-10-01 (after the clarification decisions):** E1 met (22 open items, all Accepted - applied; no new item), E2 met (unchanged registers, no Open row), E3 met (no clarification marker in chunks 09, 10, 11, 12, 13a to 13d, or in §7.3), E4 met (reconciled after the last change). The gate is open.

**End-to-end design, 2026-10-01:** chunk 19 written from its skeleton as a consolidation of 09, 10, 11, 12, and 13a to 13d: 4 services, 2 topics, 7 integration events and 1 in-process event, 4 synchronous HTTP edges (all to external systems), no in-process port call, 2 sagas, Figures 26 to 30, and Tables 25 to 27. The counts were checked against §13, §14.4, the §14.9.99 coverage matrix, and §14.10, every synchronous edge against §15.2, and every Mermaid block by reading. The master links chunk 19 and reads E2E gate Open - Up to date.

<!-- MASTER: refunds-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
