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

The numbered chunks hold the current settled design; the ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how the decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-09-30:** Walked through. Answered by the user through answers supplied with the request (Q4: Modular monolith; every other question: the recommended answer, with Q5-Q8 re-derived from Q1-Q4). The single prompt had marked Accept all as recommended (drivers clear and consistent; the assumed Q2 does not decide the style). Style: modular monolith; followed the recommendation.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release of a product that will grow (Recommended) / MVP or proof of concept / Platform at scale | First production release | REFUNDS 00 status Approved; growth in REFUNDS 12 Wishlist (online-shop refunds) and LOYALTY 04 Out of Scope (redemption later); no MVP or pilot wording in either BRD | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q2 Teams | One team (Recommended; assumption - BRD silent) / Two or three teams / Four or more teams | One team | assumption - BRD silent (both BRDs) | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | REFUNDS 02 Facts 1-2 (about 1,200 requests a month, 3x for 3 weeks); REFUNDS/NFR-02 (2 h disruption a month), REFUNDS/NFR-03 | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q4 Architecture style | Modular monolith (Recommended) / Hybrid (payout or notification extracted) / Microservices | Modular monolith | Q1-Q3; four bounded contexts with low volume; the only cross-product dependency is one fact (refund paid) | [§8.1](./04-architecture-style-and-diagrams.md#81-architecture-style), [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process calls through module ports, domain events, outbox for what leaves the process (Recommended) / Event-driven backbone plus REST queries / Mostly synchronous REST | In-process ports and domain events | Q4; every integration in REFUNDS 08 and LOYALTY 08 is an external provider; REFUNDS/NFR-01 | [ADR-02, ADR-05](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One database, one schema per module, no cross-module joins (Recommended) / One database per service / Database per service plus reporting store | One database, schema per module | Q4; one daily report (REFUNDS 09), none in LOYALTY 09 | [ADR-06](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy | Shared schema with `tenant_id` (Recommended) / Schema per tenant / Database per tenant / Single tenant | Shared schema with `tenant_id` | Platform rule (CLAUDE.md): shared schema for low-volume modules; REFUNDS 02 Facts 1 | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions), [§11.2](./07-cross-cutting-concerns.md#112-multi-tenancy-default) |
| Q8 Deployment target | Kubernetes with one Helm chart per deployable (Recommended) / Managed container service / Simple container or VM | Kubernetes, one Helm chart | CLAUDE.md deployment unit (one container, one Helm chart); REFUNDS/NFR-02 needs two or more replicas; hosting unknown | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions), [§6](./02-ecosystem-overview.md#6-ecosystem-overview) |

## Ecosystem selection record

**Outcome, 2026-09-30:** Accept all, as adapted to the modular monolith. Answered by the user through answers supplied with the request. No row was walked through or overridden; the §6 Notes column carries each row's source (BRD-mandated: REFUNDS TI-01 backend runtime, TI-02 PostgreSQL).

| Layer | Offered (recommended first) | Chosen | Source | Rule home |
|-------|-----------------------------|--------|--------|-----------|

## Clarification register

All 22 open items from the review (chunk 18) are decided on 2026-09-30: each Recommended Answer accepted and applied. Every decision below was taken by the user through the answer supplied with the request ("accept every Recommended Answer and apply it").

### OI-01 - Publication log keeps contact data in clear and for ever

**Question:** How is the customer contact carried by four in-process events protected in the event publication log, and how long does it stay there?

**Decision record, 2026-09-30:** Option A accepted: `pii` fields encrypted in the log, a publication deleted when its last listener completes, erasure extended to incomplete publications, the `platform` schema exception stated. Rationale: aligns the log with §11.6 and REFUNDS/NFR-04 without reopening the six reconciled event contracts; accepted cost: an encrypting serializer.

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-02 - In-process listener retries undefined

**Question:** What re-delivers a failed in-process listener while the deployable runs, how often, how many times, and how is a stuck publication seen?

**Decision record, 2026-09-30:** Option A accepted: a re-delivery job by age, a re-delivery limit, and two platform metrics with an alert; the age threshold and the limit stay open as markers. Rationale: LOYALTY/NFR-02 and REFUNDS/NFR-01 need a bounded retry time that restarts alone cannot give.

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-03 - Background work across replicas and releases

**Question:** How are scheduled jobs and re-delivery coordinated across replicas, and how does a release rename an event class or listener safely?

**Decision record, 2026-09-30:** Option A accepted: one-replica-at-a-time database locks for scheduled jobs, re-delivery by age only, dedup-key violations treated as handled, expand-contract for event and listener identity. Rationale: keeps the single deployable and turns harmless duplicates into no-ops.

**Rule home:** [§11.3 Deployment](./07-cross-cutting-concerns.md#113-deployment-default)

### OI-04 - Cross-tenant background work versus row-level security

**Question:** How do the dispatchers and the nightly job work across tenants when row-level security forbids cross-tenant reads?

**Decision record, 2026-09-30:** Option A accepted: per-tenant loops over a tenant configuration in the Helm values, and an application database role that owns no table. ADR-06 now carries the role rule.

**Rule home:** [§11.2 Multi-Tenancy](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### OI-05 - Sources of the tenant, member, and branch claims

**Question:** Which account attributes back the `tenant_id`, `member_id`, and `branch_id` claims, and who may write them?

**Decision record, 2026-09-30:** Option A accepted: owner-read-only attributes with named writers; the membership link process stays an open question in §3. Rationale: the ownership gates are only as strong as the claims behind them.

**Rule home:** [§16.8 Lifecycle, Scope & Revocation Rules](./12-centralized-user-roles.md#168-lifecycle-scope--revocation-rules)

### OI-06 - R-06 versus the synchronous POS lookup

**Question:** How do R-06 and ADR-09 describe the one provider call that runs on the request thread?

**Decision record, 2026-09-30:** Option A accepted: R-06 and ADR-09 reworded; the POS read finishes before the submit transaction opens. ADR-09 carries the corrected consequence.

**Rule home:** [§4 Risks](./01-executive-summary-scope-risks.md#4-risks)

### OI-07 - Any customer can read and claim any receipt

**Question:** What stops a customer who knows another buyer's receipt number from seeing it or blocking its items?

**Decision record, 2026-09-30:** Option A accepted: risk R-08 recorded, the missing ownership gate stated in §16.5, proof of purchase asked of the REFUNDS owner, and the POS proof data requested in API-02. Rationale: the exposure touches REFUNDS/NFR-04 but no money, and a proof rule would be invented.

**Rule home:** [§17.1 Constraints](./13a-service-refund.md#constraints)

### OI-08 - One read token, two ownership gates

**Question:** Which ownership gate applies to `refund.request.read` when one account could hold customer and staff roles, and can a manager decide their own refund?

**Decision record, 2026-09-30:** Option A accepted: one user type per account, a self-decision guard in the decision command, and the cross-account case asked of the REFUNDS owner. Rationale: one rule and one check, with the §16.11 grid unchanged.

**Rule home:** [§16.8 Lifecycle, Scope & Revocation Rules](./12-centralized-user-roles.md#168-lifecycle-scope--revocation-rules)

### OI-09 - Receipt number versus purchase reference

**Question:** Are the REFUNDS receipt number and the LOYALTY purchase reference the same identifier, and how unique are receipt numbers?

**Decision record, 2026-09-30:** Option A accepted: `refund` stores the purchase reference POS returns and sends it in API-01 and `RefundPaid`; a glossary term and a question to the Retail IT team record the rest. Rationale: works whatever POS answers, at the cost of one column.

**Rule home:** [§5 Glossary](./01-executive-summary-scope-risks.md#5-glossary)

### OI-10 - A refundable item is a whole POS line

**Question:** Is the refundable unit a receipt line or a single unit of a multi-unit line?

**Decision record, 2026-09-30:** Option A accepted: the whole-line rule stated, the line quantity stored, and the unit question asked of the REFUNDS owner. Rationale: the unit of refund is a business rule; the stored quantity keeps a unit-level answer cheap.

**Rule home:** [§5 Glossary](./01-executive-summary-scope-risks.md#5-glossary)

### OI-11 - Purchases not paid by card

**Question:** What happens to a request for a purchase that was not paid, or only partly paid, by card?

**Decision record, 2026-09-30:** Option A accepted: the card-paid amount limits refundability at lookup and submission (`NO_CARD_PAYMENT`, `CARD_AMOUNT_EXCEEDED`), confirmed with the REFUNDS owner. Rationale: a non-card refund can never be paid (REFUNDS 02 Assumptions / Constraints 2), so it fails early with a next step.

**Rule home:** [§17.1 Business Logic](./13a-service-refund.md#business-logic)

### OI-12 - The 30-day window boundary

**Question:** Is the refund window 30 x 24 hours or 30 calendar days?

**Decision record, 2026-09-30:** Option A accepted: one domain function with elapsed time until the policy owner confirms; boundary tests added. Rationale: either answer becomes a one-function change.

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions)

### OI-13 - Unknown payout outcome and reconciliation

**Question:** What state does a payout take when its last attempt has an unknown outcome, and what proves REFUNDS/NFR-01 against CardPay's records?

**Decision record, 2026-09-30:** Option A accepted: an Unknown state, breaker-skipped calls counted as attempts, and a daily reconciliation with CardPay (data source TBD - external). Rationale: no payout is declared failed while CardPay may have paid.

**Rule home:** [§17.2 Business Logic](./13b-service-payout.md#business-logic)

### OI-14 - Customer contact profile

**Question:** Which claims feed the contact snapshot, how does `notification` learn the customer's locale, and is a mobile number guaranteed?

**Decision record, 2026-09-30:** Option A accepted: the OIDC claims `email`, `phone_number`, and `locale` named in ADR-07, an optional `locale` added to `ContactPoint` (additive), and the mobile question recorded. The §14.8 register keeps the divergence as Fixed in v1.1.

**Rule home:** [§14.9.0 Common Value Objects](./10-events-hub.md#1490-common-value-objects)

### OI-15 - One notification row per event and channel

**Question:** How does a `PayoutFailed` alert reach every manager of a branch under the notification dedup key?

**Decision record, 2026-09-30:** Option A accepted: `recipient_key` joins the unique key. Rationale: keeps the listener idempotent for any number of recipients.

**Rule home:** [§17.3 Business Logic](./13c-service-notification.md#business-logic)

### OI-16 - Several refunds of one purchase

**Question:** How is the take-back capped when several refunds hit one purchase?

**Decision record, 2026-09-30:** Option A accepted: a cumulative cap per purchase. Rationale: correct under both readings of the open partial-refund rule and keeps `balance >= 0`.

**Rule home:** [§17.4 Business Logic](./13d-service-loyalty.md#business-logic)

### OI-17 - Pending take-backs of non-member purchases

**Question:** What ends the wait of a pending take-back that will never match, such as a refund of a non-member purchase?

**Decision record, 2026-09-30:** Option A accepted: an EXPIRED state, a late-purchase counter, R-05 re-rated, and the member ID requested from POS. Rationale: keeps the pending gauge a signal without depending on POS data.

**Rule home:** [§17.4 Business Logic](./13d-service-loyalty.md#business-logic)

### OI-18 - The daily branch refund report

**Question:** What day and which measures make up the daily branch refund report, and is it pushed or read?

**Decision record, 2026-09-30:** Option A accepted: a calendar day in the tenant's time zone, three measures defined from the status history, read on demand; push delivery asked of the REFUNDS owner.

**Rule home:** [§17.1 Business Logic](./13a-service-refund.md#business-logic)

### OI-19 - Availability chain behind REFUNDS/NFR-02

**Question:** Which components does the 99.7% availability SLI cover?

**Decision record, 2026-09-30:** Option A accepted: the SLI counts dependency-caused 5xx, the gateway and Keycloak run two or more replicas, and POS availability is risk R-09. Rationale: the SLI must see what customers see.

**Rule home:** [§18 Performance & Capacity Planning](./14-performance-and-capacity.md#18-performance--capacity-planning)

### OI-20 - Diagnostics rows for every alert

**Question:** Which first check does on-call follow for the alerts the SDD defines but §20.2 did not list?

**Decision record, 2026-09-30:** Option A accepted: four rows added, severity and action still open.

**Rule home:** [§20.2 Diagnostics Cheatsheet](./16-operations-runbook.md#202-diagnostics-cheatsheet)

### OI-21 - MsgHub in UAT

**Question:** How does UAT run the REFUNDS message test cases?

**Decision record, 2026-09-30:** Option A accepted: UAT connects to the MsgHub sandboxes, or live with test recipients only.

**Rule home:** [§19 Environments](./15-environments.md#19-environments)

### OI-22 - Restated API-01 contract and a question with four homes

**Question:** Where do the API-01 rules and the control-set question live?

**Decision record, 2026-09-30:** Option A accepted: §17.2 references API-01 instead of restating it, and the control-set question moves to §11.6 once. Rationale: one fact, one home.

**Rule home:** [§11.6 Security](./07-cross-cutting-concerns.md#116-security-default)

## Walkthrough and delegation history

The run was non-interactive: the user supplied every answer with the request (shape chunks, generation whole, derive from the BRDs, BRD keys REFUNDS and LOYALTY, module decomposition, questionnaire answers, ecosystem accept-all, open items accept-all) and delegated every other question to the skill's recommended answer.

### Action entries

**Intake, 2026-09-30:** BRD keys proposed and fixed: REFUNDS (Refunds Portal v1.0), LOYALTY (Loyalty Points v1.0). Both BRD masters show every generation part Complete. REFUNDS delivery chunks 15 and 16 (Up to date) read as context only; LOYALTY 15 and 16 are Locked (absent). Project Type: Greenfield, from REFUNDS 01 (paper process today, no codebase named); the skill gives no recommended answer for this question, so the BRD evidence decided it.

**Cross-BRD reconciliation, 2026-09-30:** no conflicting technical mandate (LOYALTY states none). Findings and where they landed: the term "refunded purchase" (LOYALTY UC-02 BR-1) versus item-level and partial refunds (REFUNDS UC-04 A1): two §5 Glossary rows with a clarification marker, and risk R-04; REFUNDS Customer and LOYALTY Member: two actors on one end-customer identity (§7.1); POS Records named by both BRDs: one §12 row, INT-03; LOYALTY's dependency on refund outcomes: realised by the in-process event `RefundPaid` (§14.10, §8.4.2).

**Module decomposition, 2026-09-30:** refund (REFUNDS/UC-01 to UC-04), payout (no use case), notification (no use case), loyalty (LOYALTY/UC-01, UC-02, and the take-back of UC-02 BR-1), all Type `module`, as supplied with the request. REFUNDS/UC-05 is merged into UC-04 in its BRD.

**Whole run, 2026-09-30:** chunks 00-17, the master, and this register written; contract reconciliation (step 6a) run with no divergence.

**Review and acceptance loop, 2026-09-30:** an independent cleared-context reviewer wrote chunk 18 with 22 open items (coverage record: 16 risk surfaces checked, API contracts with no issue). All 22 accepted through the answer supplied with the request and applied as one batch (version 1.1). Consistency edits implied by the accepted answers: the Unknown payout state carried into §13, §18, the payout metrics, and §20.2; the payout reconciliation added to the §11.3 scheduled-job list; the notification and loyalty diagrams, keys, and metrics aligned. Editorial fix from the reviewer notes: the §17.1 Error Handling and Rules citations of BR-1, BR-2, and BR-3 now carry their labels. Step 6a rerun after the last change: no divergence; the §14.8 register keeps one row (OI-14) as Fixed in v1.1.

**E2E gate check, 2026-09-30:** E1 met (22 of 22 Accepted - applied), E2 met (no Open register row), E4 met (reconciled after the last change); E3 not met (31 clarification markers in chunk 10 and chunks 13a-13d). Chunk 19 not written; the master shows the gate Locked.

<!-- MASTER: refunds-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
