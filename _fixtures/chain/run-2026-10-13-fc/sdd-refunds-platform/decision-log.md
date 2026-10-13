<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.4
PART OF: SDD - Refunds Platform
PURPOSE: Single home for the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Refunds Platform

## How to read

The numbered chunks hold the current settled design; the ADRs in chunk 06 hold each architecture decision and its rationale; this file holds how the decisions were reached, who answered each question, and the delegation that answered them in this run. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-10-10:** Accept all. Answered by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Style: modular monolith; followed the recommendation. Accept all was the recommended option: every driver is given by a source BRD or is an assumed Q2 that does not change the Q4 recommendation, and no two drivers conflict.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release (Recommended) / MVP or proof of concept / Platform at scale | First production release | REFUNDS 01 Background (the portal replaces paper records and phone approvals for 40 branches); LOYALTY 04 Out of Scope (redeeming points is a later phase); no pilot wording in either BRD | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q2 Teams in the next 12 months | One team (Recommended) / Two or three teams / Four or more teams | One team | assumption - BRD silent (from Q1); two or three teams would give the same Q4 recommendation, so it does not count as missing | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | REFUNDS 02 Facts 1 and 2 (about 1,200 requests a month, 3x for about 3 weeks); REFUNDS/NFR-02 (2 hours a month, at any time); REFUNDS/NFR-03; LOYALTY/NFR-02 (1 hour) | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q4 Architecture style | Modular monolith (Recommended) / Hybrid / Microservices | Modular monolith | First-production profile; no BRD NFR or Technical Input states a separate scaling, failure, or release need for one part; the CardPay integration and the message fan-out become extraction triggers | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process calls through module ports, domain events, outbox for anything that leaves the process (Recommended) / Event-driven backbone plus REST for queries / Mostly synchronous REST | In-process ports and domain events | Q4; every consumer of a state change is a module of the same deployable | [ADR-02](./06-principles-and-decisions.md#10-architectural-decisions), [ADR-05](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One database, one schema per module (Recommended) / One database per service / One database per service plus a reporting store | One database, one schema per module | Q4; one report (REFUNDS 09) served from module tables; REFUNDS 12 TI-02 (PostgreSQL) | [ADR-06](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy | Shared schema with `tenant_id` (Recommended) / Schema per tenant / Database per tenant / Single tenant | Shared schema with `tenant_id` | Low volume (REFUNDS 02 Facts 1); the skill's platform rule gives shared schema for low-volume modules; no source names more than one business (single tenant offered as the alternative) | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q8 Deployment target | Managed container service (Recommended) / Kubernetes with one Helm chart per deployable / A simple container or VM | Managed container service | First-production profile; no deployment target in REFUNDS 12 Technical Inputs, none in LOYALTY, and none in the project defaults (`AGENTS.md` states none) | [ADR-09](./06-principles-and-decisions.md#10-architectural-decisions) |

## Ecosystem selection record

**Outcome, 2026-10-10:** Accept all, with no override. Answered by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). The proposal showed BRD-mandated rows locked (Java 21 / Spring Boot from REFUNDS 12 TI-01, PostgreSQL from REFUNDS 12 TI-02) and every new third-party dependency (Keycloak, the managed container service, the secrets manager, OpenTelemetry, Flyway, Resilience4j, Angular) as Proposed with an alternative, so accepting the table adopts no new dependency (`AGENTS.md`). Rule home: [02 § Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview).

## Clarification register

All 21 open items of the first-build review (OI-01 to OI-20) and the author item OI-21 were decided on 2026-10-10 by the answer policy: 20 accepted and applied, 1 rejected (OI-04, a `No change` Recommended Answer). OI-22 to OI-25, raised by the first scoped application check, were accepted and applied the same day. OI-26 and OI-27, raised by the second scoped application check, were decided the same day and applied in v1.1. OI-28, raised by the v1.1 application check, was accepted and applied in v1.1. In v1.3 the author raised OI-29 to OI-31 and the delta review raised OI-32 to OI-42; all 14 were accepted by the answer policy and applied in v1.3. The scoped application check raised OI-43 to OI-46, accepted by the answer policy and applied in v1.3. OI-47, raised by the last review pass of v1.3, was decided the same day and applied in v1.4.

### OI-01 - The doctrine says receipt lookups are queued after commit, but the lookup is a synchronous query

**Question:** Which resolution applies to "The doctrine says receipt lookups are queued after commit, but the lookup is a synchronous query"? Options offered (recommended marked in chunk 18): A. Reword the doctrine: provider work that follows a state change is queued and sent after commit; read-only provider queries run synchronously in the request path with a timeout and a circuit breaker and change no state / B. Make the receipt lookup asynchronous (queue the lookup, the screen polls for the result).

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §17.1, INT-03, and [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E5 already require a synchronous read, and the outbox exists to prevent dual writes, which a read does not make. Tradeoff accepted: a POS Records outage blocks new refund requests, which E5 already accepts.

**Open remainder:** None.

**Rule home:** [01 § Executive Summary](./01-executive-summary-scope-risks.md#1-executive-summary)

### OI-02 - Libraries the design relies on have no Proposed ADR

**Question:** Which resolution applies to "Libraries the design relies on have no Proposed ADR"? Options offered (recommended marked in chunk 18): A. ADR-12 (Proposed): publication log built in the deployable as §11.1 specifies; ArchUnit for architecture tests; Testcontainers for integration tests / B. ADR-12 (Proposed): Spring Modulith for the event publication registry and module verification / C. Hand-build everything (reflection-based boundary tests, a PostgreSQL service in CI).

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: in ADR-12.

**Open remainder:** None.

**Rule home:** [ADR-12](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-03 - Content chunks cite architecture questionnaire question numbers instead of evidence

**Question:** Which resolution applies to "Content chunks cite architecture questionnaire question numbers instead of evidence"? Options offered (recommended marked in chunk 18): A. Replace each question number with the evidence it stands for; keep the `questionnaire` source label in §6 without a number / B. Keep the references and link each to `decision-log.md`.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: The master and `decision-log.md` state that chunks hold only the settled design and the log holds how it was reached; A makes every ADR's Why carry its own evidence. Tradeoff accepted: none beyond the edit.

**Open remainder:** None.

**Rule home:** [06 § Architectural Decisions](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-04 - Every log line carries `tenant_id`

**Question:** Which resolution applies to "Every log line carries `tenant_id`"? Options offered (recommended marked in chunk 18): A. No change / B. Write `tenant_id` only at DEBUG (off in Prod) and move the tenant to a span attribute in the trace backend.

**Decision record, 2026-10-10:** The author held, with evidence, that the first finding rested on a rule outside this run; the reviewer, re-dispatched on the finding, rewrote it with the Recommended Answer `No change`. Decided Rejected by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), which takes a `No change` Recommended Answer (SKILL.md step 8, Answer policy, rule 2). Rationale: An item must rest on a rule of the run or a stated requirement, and the only cited rule comes from an instruction file outside this run's rules. Tradeoff accepted: if a later project rule or BRD forbids tenant identifiers in INFO logs, §11.4 changes then, through Option B.

**Open remainder:** None.

**Rule home:** [07 § 11.4 Observability](./07-cross-cutting-concerns.md#114-observability-default)

### OI-05 - The publication-log tables break AP-06 and lack the trace context §11.4 relies on

**Question:** Which resolution applies to "The publication-log tables break AP-06 and lack the trace context §11.4 relies on"? Options offered (recommended marked in chunk 18): A. Add `tenant_id` and `trace_context` to the §11.1 definition, with keys and the redelivery index leading with `tenant_id` / B. Exempt the publication-log tables from AP-06 as platform plumbing and drop the trace claim.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: AP-06, ADR-03, and the doctrine "every index in shared-schema includes `tenant_id`" apply to every table, and §11.4 already depends on the trace context being stored. Tradeoff accepted: one more column per listener row.

**Open remainder:** None.

**Rule home:** [07 § 11.1 DB Modeling](./07-cross-cutting-concerns.md#111-db-modeling-default)

### OI-06 - No tenant context for work that carries no user token

**Question:** Which resolution applies to "No tenant context for work that carries no user token"? Options offered (recommended marked in chunk 18): A. Tenant from the verifying credential for inbound provider calls, per-tenant iteration for jobs, tenant-bound module roles / B. A named system context with an allowlist of cross-tenant queries exempted from the architecture test.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §11.2's isolation rule and ADR-03's reason for keeping `tenant_id` both require a tenant before every query; A keeps the architecture test without exceptions at the cost of a per-tenant loop that runs once today, while B's allowlist is the usual path of a cross-tenant leak.

**Open remainder:** None.

**Rule home:** [07 § 11.2 Multi-Tenancy](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### OI-07 - A payout or message claimed before a crash is never sent

**Question:** Which resolution applies to "A payout or message claimed before a crash is never sent"? Options offered (recommended marked in chunk 18): A. A claim lease: the claim commits `Sending` with a lease expiry; an expired lease is an unknown outcome, re-sent with the same key only once CardPay's idempotency is confirmed, otherwise parked as `Unknown` with an alert / B. Hold the row lock across the provider call / C. A start-up sweep resets `Sending` rows to `Retrying`.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: REFUNDS/NFR-01 allows zero missing payouts and ADR-09's rolling deployments make process stops routine; A recovers every claimed row while keeping provider calls outside transactions and never re-sends money blindly while CardPay's idempotency support is `TBD - external`. Tradeoff accepted: one more payout status and a manual procedure until CardPay's documentation arrives.

**Open remainder:** None.

**Rule home:** [13b § Business Logic](./13b-service-payout.md#business-logic)

### OI-08 - A payout result that arrives while the payout is Retrying or Stopped has no transition

**Question:** Which resolution applies to "A payout result that arrives while the payout is Retrying or Stopped has no transition"? Options offered (recommended marked in chunk 18): A. Success is absorbing from every non-final state and from `Stopped`; failures after `Succeeded` are ignored and logged; no other payment until CardPay confirms no attempt succeeded / B. Keep `Stopped` final and reconcile late successes by hand.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: REFUNDS/NFR-01 forbids paying twice and §17.2 already expects a retry to return the first result; A makes a paid customer's request Paid (which also triggers the loyalty take-back) and blocks a second payment. Tradeoff accepted: two more transitions to build and test.

**Open remainder:** None.

**Rule home:** [13b § Business Logic](./13b-service-payout.md#business-logic)

### OI-09 - REFUNDS/NFR-01 cannot be measured: payout reconciliation is parked as a future enhancement

**Question:** Which resolution applies to "REFUNDS/NFR-01 cannot be measured: payout reconciliation is parked as a future enhancement"? Options offered (recommended marked in chunk 18): A. A daily reconciliation job in `payout`, comparing payouts with CardPay's refund records through a new external contract (API-07, `TBD / B. Monthly manual reconciliation by finance from CardPay statements only / C. Count from platform data only.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: The NFR's measure is a monthly count, and without a comparison with CardPay a duplicate on CardPay's side is invisible while CardPay's idempotency support is unconfirmed; A makes the count observable from go-live, with the manual fallback covering the period before CardPay documents its interface. Tradeoff accepted: one more external contract whose shape depends on what CardPay offers.

**Open remainder:** None.

**Rule home:** [13b § Business Logic](./13b-service-payout.md#business-logic)

### OI-10 - Loyalty ledger: a race strands parked take-backs, and the balance check cannot be a database check

**Question:** Which resolution applies to "Loyalty ledger: a race strands parked take-backs, and the balance check cannot be a database check"? Options offered (recommended marked in chunk 18): A. Serialize work per purchase with a transaction-scoped PostgreSQL advisory lock, lock the points account row for every movement, verify balances daily, and alert on old parked take-backs / B. Run both transactions at SERIALIZABLE isolation with retry on serialization failure / C. A sweeper job re-applies parked take-backs on a schedule.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-5: refund paid before earning and LOYALTY/NFR-02 require a parked take-back to apply when its purchase earns; the advisory lock closes the race without changing isolation for the whole module and adds no dependency, and the daily verification makes LOYALTY/NFR-01 observed rather than assumed. Tradeoff accepted: deliveries for the same purchase are serialized for the length of one short transaction.

**Open remainder:** None.

**Rule home:** [13d § Business Logic](./13d-service-loyalty-points.md#business-logic)

### OI-11 - The eligibility rule silently answers two open REFUNDS business rules

**Question:** Which resolution applies to "The eligibility rule silently answers two open REFUNDS business rules"? Options offered (recommended marked in chunk 18): A. State both rules as open in §17.1 with one marker, and design the eligibility check so either answer is a setting / B. Block both cases until the BRD answers / C. Keep the current text.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: A derive-from-BRD SDD realises business rules and never decides them (brd-to-sdd.md § What derivation is, and is not); A makes the dependency visible and keeps either answer cheap. Tradeoff accepted: two settings to carry until the BRD answers.

**Open remainder:** The new marker in [13a § Business Logic](./13a-service-refund-request.md#business-logic) (request again after rejection, rest after partial refund); owner: REFUNDS BRD owner.

**Rule home:** [13a § Business Logic](./13a-service-refund-request.md#business-logic)

### OI-12 - Two open REFUNDS questions that would change the refund lifecycle are not carried into the design

**Question:** Which resolution applies to "Two open REFUNDS questions that would change the refund lifecycle are not carried into the design"? Options offered (recommended marked in chunk 18): A. Carry both as markers in §17.1 with their design impact, plus a §4 risk row / B. Design both variants now behind settings (items-received state, staff submission endpoint).

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: The BRD holds both questions open and each answer changes the §17.1 state machine or adds an actor to §16; A keeps the decision with the BRD owner and makes the dependency visible before build. Tradeoff accepted: a possible late change, contained in one module.

**Open remainder:** The two new markers in [13a § Business Logic](./13a-service-refund-request.md#business-logic) (item return, in-person requests); owner: REFUNDS BRD owner.

**Rule home:** [13a § Business Logic](./13a-service-refund-request.md#business-logic)

### OI-13 - The branch-manager alert's recipient lookup is described nowhere and has no failure path

**Question:** Which resolution applies to "The branch-manager alert's recipient lookup is described nowhere and has no failure path"? Options offered (recommended marked in chunk 18): A. Specify the lookup and each outcome in §17.3, and the IAM client in §11.6 / B. Send the alert to a configured mailbox per branch instead of looking up the manager.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-2: still failing after one day is a stated acceptance criterion, and A gives each lookup failure a visible outcome while keeping the IAM as the only record of branch assignments (§16.6). Tradeoff accepted: an IAM read in the send path, retried like any provider failure.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-14 - A payout-delayed message can reach the customer after the paid message

**Question:** Which resolution applies to "A payout-delayed message can reach the customer after the paid message"? Options offered (recommended marked in chunk 18): A. On `RefundRequestPaid`, mark every unsent payout-delayed message of that refund request `Superseded` / B. Send the messages of one refund request strictly in order.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: The contradiction only arises for the delayed-then-paid pair, and A removes it without the head-of-line blocking of B, which could delay the paid message itself. Tradeoff accepted: a delayed message is dropped when the payout succeeds quickly, which is the outcome the customer needs.

**Decision record, 2026-10-10 (v1.3):** Superseded by REFUNDS v1.4: [REFUNDS 03 § Refund request lifecycle](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-request-lifecycle) now sends a Paid payout that the customer's bank returns back to Approved, so a payout failure after a paid message is no longer always stale. The applied rule now marks payout-delayed messages `Superseded` only while the newest refund status `customer-notification` has seen for the request (its highest `sequence`) is Paid. This supersedes the 2026-10-10 record above in that respect; the design follows the BRD change with one clearly right wording, so no new open item was raised.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-15 - Any signed-in customer can read any receipt, with no rate limit

**Question:** Which resolution applies to "Any signed-in customer can read any receipt, with no rate limit"? Options offered (recommended marked in chunk 18): A. A per-caller rate limit in the inbound adapter, counted in PostgreSQL so it holds across replicas, an enumeration alert, an owner question on proving receipt ownership, and the §16.5 footnote corrected / B. Require extra proof from the receipt (for example details of the card used) now / C. Accept the risk.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: REFUNDS/NFR-04 protects customer personal data, and the platform doctrine places rate limiting at the edge; with no gateway (§6), the inbound adapter is the edge, and PostgreSQL holds the counter without a new dependency. Tradeoff accepted: one counter write per lookup, and the stronger proof stays the business owner's call.

**Open remainder:** The new marker in [13a § API Standards](./13a-service-refund-request.md#api-standards) (proof of receipt ownership); owner: REFUNDS BRD owner.

**Rule home:** [13a § API Standards](./13a-service-refund-request.md#api-standards)

### OI-16 - Operations reach personal data through infrastructure access, outside the NFRs' allowed readers

**Question:** Which resolution applies to "Operations reach personal data through infrastructure access, outside the NFRs' allowed readers"? Options offered (recommended marked in chunk 18): A. Constrain the infrastructure path: the Prod operations database role has no read on personal-data columns and may update only operational columns; wider access is break-glass, time-limited, and logged / B. Operator endpoints behind an `OPERATOR` role so nobody touches the database / C. Accept and document.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: Both NFRs name who may see the data, and operations are not on either list; A closes the gap with PostgreSQL column privileges the design already uses (ADR-06 per-module roles). Tradeoff accepted: break-glass friction for the rare incident that needs personal data.

**Open remainder:** None.

**Rule home:** [12 § 16.4.3 Platform Plane](./12-centralized-user-roles.md#1643-platform-plane-operator---outside-tenant-tenancy)

### OI-17 - A member who leaves both loses `MEMBER` and gets `MEMBERSHIP_ENDED`, which cannot both happen

**Question:** Which resolution applies to "A member who leaves both loses `MEMBER` and gets `MEMBERSHIP_ENDED`, which cannot both happen"? Options offered (recommended marked in chunk 18): A. `MEMBER` is kept after leaving; `loyalty-points`' closed account is the single source and answers 403 `MEMBERSHIP_ENDED` / B. Remove `MEMBER` on leaving and drop `MEMBERSHIP_ENDED`; the web app shows the left-the-program text on `FORBIDDEN` from loyalty endpoints.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §17.4 already keeps the closed account and must use it for the [LOYALTY 03 § Member leaves the loyalty program](../brd-loyalty-points/03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program) rules (a refund paid after leaving takes nothing back; a late purchase earns nothing), so the module is the natural single source, and A removes the token-lag window. Tradeoff accepted: a former member keeps a role that grants nothing they can use.

**Open remainder:** None.

**Rule home:** [12 § 16.8 Lifecycle](./12-centralized-user-roles.md#168-lifecycle-scope--revocation-rules)

### OI-18 - The REFUNDS/NFR-02 budget is realised only at the application tier and ignores the IAM

**Question:** Which resolution applies to "The REFUNDS/NFR-02 budget is realised only at the application tier and ignores the IAM"? Options offered (recommended marked in chunk 18): A. Measure and design the budget over the whole request path (load balancer, IAM, deployable, PostgreSQL): the IAM runs highly available or is a managed identity service with at least the same target, and a synthetic probe measures the budget / B. Keep the budget on the deployable and give the IAM its own separate target.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: REFUNDS/NFR-02 is a customer measure ("customers can use the portal at any time") and sign-in is on every path, so a budget that leaves the IAM out reports time left while customers are locked out. Tradeoff accepted: the IAM becomes a highly available component with its own upgrades to plan.

**Open remainder:** None.

**Rule home:** [14 § 18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets)

### OI-19 - Two terms that differ between the BRDs are neither mapped nor flagged

**Question:** Which resolution applies to "Two terms that differ between the BRDs are neither mapped nor flagged"? Options offered (recommended marked in chunk 18): A. Add two §5 rows: the refund reference is the REFUNDS reference number (shown to the member, the inbox key); one currency per tenant, EUR, with a marker for the REFUNDS owner to confirm / B. Key the inbox on `refundRequestId` and show the reference number to the member.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: The cross-BRD reconciliation rule (brd-to-sdd.md § Cross-BRD reconciliation) asks for a §5 row per differing term plus a marker where the meaning is open; A uses the identifier the customer already sees in REFUNDS messages. Tradeoff accepted: the reference number becomes a cross-module identifier that must never be reused.

**Open remainder:** The new currency marker in [01 § Glossary](./01-executive-summary-scope-risks.md#5-glossary); owner: REFUNDS BRD owner.

**Rule home:** [01 § Glossary](./01-executive-summary-scope-risks.md#5-glossary)

### OI-20 - BRD scalars and catalogue counts are restated across chunks

**Question:** Which resolution applies to "BRD scalars and catalogue counts are restated across chunks"? Options offered (recommended marked in chunk 18): A. Keep each value in its home (§18.1 for load, citing REFUNDS 02 Facts; §18.5 for the LOYALTY/NFR-02 target; LOYALTY 03 for the earning rule; §14.10 for the events) and reference it elsewhere / B. Keep the copies and add the values to the step 6a checks.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: Scalar facts live once (brd-to-sdd.md § One fact, one home, item 4), and A removes four drift points with no loss of meaning. Tradeoff accepted: readers follow one more reference.

**Open remainder:** None.

**Rule home:** [14 § 18.1 Load Estimates](./14-performance-and-capacity.md#181-load-estimates)

### OI-21 - Earning points has no LOYALTY use case

**Question:** Which resolution applies to "Earning points has no LOYALTY use case"? Options offered (recommended marked in chunk 18): A. Keep earning as a platform flow traced to LOYALTY 03, state in §2.1 that it carries no use case until a LOYALTY version adds one, and hand the question to the LOYALTY BRD owner / B. Leave it unstated.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: brd-to-sdd.md § The link item 7 forbids SDD-made use cases and asks for a Missing scenario item; A keeps the behaviour designed and visible. Tradeoff accepted: earning has no §7.3 row until the BRD adds a use case.

**Open remainder:** Whether LOYALTY adds a use case for earning points; owner: LOYALTY BRD owner (BRD follow-up).

**Rule home:** [01 § 2.1 In Scope](./01-executive-summary-scope-risks.md#21-in-scope)


### OI-22 - Text the applied answers made wrong is not yet in line (job list, API-07 references, `MEMBER` wording, module tenant source)

**Question:** Which resolution applies to "Text the applied answers made wrong is not yet in line (job list, API-07 references, `MEMBER` wording, module tenant source)"? Raised by the first scoped application check. Options offered (recommended marked in chunk 18): A. Bring each line in line with the applied answer, naming the jobs in §11.2 explicitly / B. As A, but §11.2 refers to every `Schedule` row of §17.1 to §17.4 Input instead of naming jobs.

**Decision record, 2026-10-10:** Accept recommendation (Option B), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: SKILL.md step 8 item 3 brings text an applied decision makes wrong in line in the same step; each line above has one right wording under the applied answers, and a job with no stated tenant context breaks the §11.2 isolation rule. Tradeoff accepted: none beyond the edit.

**Open remainder:** None.

**Rule home:** [07 § 11.2 Multi-Tenancy](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### OI-23 - The branch-manager alert to several accounts shares one idempotency key

**Question:** Which resolution applies to "The branch-manager alert to several accounts shares one idempotency key"? Raised by the first scoped application check. Options offered (recommended marked in chunk 18): A. One MsgHub call per recipient at send time, with an idempotency key formed from the message id and the recipient's IAM user id; each recipient's outcome kept on the message's send attempts by IAM user id (never by address); the message is `Sent` when every recipient's call has succeeded, and a retry sends only to recipients without a successful call / B. Resolve the recipients in the `PayoutStillFailing` listener and create one message record per recipient, keyed `(tenant_id, event_id, channel, recipient_user_id)` / C. Send to one account only.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-2: still failing after one day requires the branch manager to be told, and the accepted OI-13 answer addresses every branch-manager account of the branch; A keeps OI-13's send-time read and its rule that addresses are never stored, and gives each recipient its own key. Tradeoff accepted: per-recipient outcomes in the send attempts of one message type.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-24 - A payout-delayed message created after the paid message is still sent

**Question:** Which resolution applies to "A payout-delayed message created after the paid message is still sent"? Raised by the first scoped application check. Options offered (recommended marked in chunk 18): A. The `PayoutAttemptFailed` listener checks the module's own message records for a paid message of the same refund request and, when one exists, creates the delayed message as `Superseded` / B. Accept the rare out-of-order message.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: OI-14 was accepted to remove the delayed-after-paid contradiction, and publication-log redelivery makes the reverse arrival order possible whenever one listener fails once; A closes it inside `customer-notification` with its own data. Tradeoff accepted: message records of both types carry the refund request id, which the OI-14 answer already requires of `PayoutAttemptFailedDto`.

**Decision record, 2026-10-10 (v1.3):** Superseded by REFUNDS v1.4 ([REFUNDS 03 § Refund request lifecycle](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-request-lifecycle)): the `PayoutAttemptFailed` listener creates the payout-delayed message as `Superseded` only while the newest refund status seen for the request is Paid, so that after a returned payout (`RefundRequestPayoutReturned`) later failures are told. This supersedes the 2026-10-10 record above in that respect.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-25 - An `Unknown` payout has no way out except a late success, and a status update by operations skips `PayoutSucceeded`

**Question:** Which resolution applies to "An `Unknown` payout has no way out except a late success, and a status update by operations skips `PayoutSucceeded`"? Raised by the first scoped application check. Options offered (recommended marked in chunk 18): A. Operations record the outcome checked with CardPay as a payout resolution row (paid or not paid); inserting that row, not updating a status, is the payout write of the Prod operations database role; the `payout-retry` job applies the row through the Result rules (paid sets `Succeeded` and records `PayoutSucceeded`; not paid on an `Unknown` payout sets `Retrying` with the same key) / B. Adopt Scope proposal 1 (an `OPERATOR` role and operator endpoints) for this resolution / C. Operations update the payout status and insert the matching publication-log row by hand.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: REFUNDS/NFR-01 allows no lost payout, and the Paid status, the paid message, and the loyalty take-back all depend on `PayoutSucceeded`, which only the module records; A keeps operations on an insert-only path inside the OI-16 access rules and leaves every state change to the job. Tradeoff accepted: a resolution table and its handling in the job, and a manual check per `Unknown` payout until CardPay's idempotency support is confirmed.

**Open remainder:** None.

**Rule home:** [13b § Business Logic](./13b-service-payout.md#business-logic)

### OI-26 - Text the applied OI-22, OI-23, and OI-25 answers left out of line (two purge jobs, INT-01 cells, the alert's idempotency key, payout Summary and concepts)

**Question:** Which resolution applies to "Text the applied OI-22, OI-23, and OI-25 answers left out of line (two purge jobs, INT-01 cells, the alert's idempotency key, payout Summary and concepts)"? Raised by the second (last) scoped application check of the first build. Options offered (recommended marked in chunk 18): A. Bring each line in line: add `Schedule` rows for the two purge jobs, so the OI-22 label stays a single reference / B. As A for items 2 to 4, but restore "and the retention purge job of each module (§17.X Retention Policy)" in the §11.2 label instead of adding the rows.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08) in the first build, where it waited as `Decided - pending application` because the first build's review passes were used up; applied in v1.1 by the request "Apply the decisions waiting for application in the Refunds Platform SDD (OI-26, OI-27)". Rationale: SKILL.md step 8 item 3 brings text an applied decision makes wrong in line, and each line here has one right wording under the applied answers; a purge job without a stated tenant context breaks the §11.2 isolation rule that OI-06 made absolute. Tradeoff accepted: two more Input rows. Text brought in line in the same step: the §17.3 Tenant filter now names the per-tenant run of each `Schedule` job, since `notification-retention-purge` is now one.

**Open remainder:** None.

**Rule home:** [13b § Input](./13b-service-payout.md#input)

### OI-27 - The payout-delayed and paid listeners can run at the same time and each miss the other's message

**Question:** Which resolution applies to "The payout-delayed and paid listeners can run at the same time and each miss the other's message"? Raised by the second (last) scoped application check of the first build. Options offered (recommended marked in chunk 18): A. Both listeners take a transaction-scoped PostgreSQL advisory lock on the hash of `(tenant_id, refund_request_id)` before they read or write that refund request's message records / B. Run both listeners at SERIALIZABLE isolation and retry on a serialization failure / C. Accept the residual race.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08) in the first build, where it waited as `Decided - pending application`; applied in v1.1 by the same request as OI-26. Rationale: OI-14 and OI-24 were accepted to remove the delayed-after-paid contradiction, and the OI-24 text claims independence from arrival order, which holds only when the two listener transactions do not overlap; A makes the claim true with a built-in PostgreSQL feature already used by §17.4. Tradeoff accepted: the two listeners are serialized per refund request for one short transaction.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-28 - The branch-manager alert's per-recipient idempotency key does not fit the `Idempotency-Key` format of §15.1

**Question:** Which resolution applies to "The branch-manager alert's per-recipient idempotency key does not fit the `Idempotency-Key` format of §15.1"? Raised by the application check of the v1.1 update. Options offered (recommended marked in chunk 18): A. The per-recipient key is a name-based UUID (RFC 9562 version 5) with the message id as namespace and the recipient's IAM user id as name / B. Generate a UUIDv7 per recipient at the first call, store it on the message's send attempts with the IAM user id, and reuse it on every retry / C. Keep the two ids as a composite string and record an API-03 exception to the §15.1 format.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); applied in v1.1. Rationale: §15.1 sets one `Idempotency-Key` format (UUID) for every provider write, and the API-03 text the OI-26 answer added departs from it without saying how the two ids become one key; A keeps the format and gives the same key on every retry, which the OI-23 retry rule needs, with no stored value and no new dependency (a SHA-1 hash per RFC 9562, under the `AGENTS.md` dependency rule). Tradeoff accepted: a derivation rule the LLD must state, and the key cannot be read back to its two ids.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-29 - The own-request rule cannot be checked across two IAM realms

**Question:** Which resolution applies to "The own-request rule cannot be checked across two IAM realms"? Raised by the author as the open remainder of business review point DC-08 (a design choice left to this SDD's owner). Options offered (recommended first): A. One realm for every person, one identity (`sub`) per person / B. Two realms with a link stored on the staff account / C. Two realms matched on contact details.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). ADR-07 (still Proposed: Keycloak is a new dependency) carries the rationale.

**Open remainder:** None.

**Rule home:** [ADR-07](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-30 - The remaining fields and types of the in-process event DTOs are open

**Question:** Which resolution applies to "The remaining fields and types of the in-process event DTOs are open"? Raised by the author as the open remainder of business review point PA-06 (a design choice left to this SDD's owner). Options offered (recommended first): A. Close the DTOs now, with `originalPaymentReference` added and a types table / B. Leave fields and types to the LLD / C. Keep the marker open.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: every listener's needs are known, so typing them closes each in-process contract and the gap that `payout` had no field for the original-payment reference; AP-10 keeps later additions cheap. Tradeoff accepted: a type change later is a new event name. Applied together with the fields OI-31, OI-33 and OI-37 add, so the types table covers them; the §14.10 DTO marker is removed.

**Open remainder:** None.

**Rule home:** [10 § 14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-31 - Recording a payout result by hand, with a second person's confirmation, has no entry point, role, or decision-record actor

**Question:** Which resolution applies to "Recording a payout result by hand, with a second person's confirmation, has no entry point, role, or decision-record actor"? Raised by the author (Missing scenario: [REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record), changed in REFUNDS v1.3 and v1.4, has no REFUNDS use case). Options offered (recommended first): A. A `PAYOUT_OPERATOR` staff role, three tokens and three `payout` endpoints, a paid result confirmed by a second operator / B. Personal database logins with insert-only rows / C. Leave it out until REFUNDS adds a use case.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: both staff members enter the immutable decision record and REFUNDS/NFR-04 names them as readers, so they need an authenticated identity and a permission check (ADR-08). Tradeoff accepted: three endpoints, a back-office screen, and one more staff role that no REFUNDS use case covers yet; a use case for it is a BRD follow-up for the REFUNDS BRD owner, and the team that holds the role is a new §16.4.2 marker. It adopts the Reviewer Notes scope proposal on operator endpoints; no new dependency.

**Open remainder:** None for this SDD (the team marker in §16.4.2 is a fact for the REFUNDS BRD owner).

**Rule home:** [12 § 16.4 Role Catalogue](./12-centralized-user-roles.md#164-role-catalogue---authorities--related-services)

### OI-32 - A card dispute the bank decides for the customer while no payout is held is never acted on

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. Read the payment's open and closed disputes at Create and before every attempt / B. Show closed disputes at decision time only / C. Leave it to the daily reconciliation.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8 and AC-13 tie the Rejected outcome to the bank refunding the payment, whatever the arrival order. Tradeoff accepted: a dispute read before each attempt and a manual check for the rare Unknown or Stopped case.

**Open remainder:** None.

**Rule home:** [13b § Business Logic](./13b-service-payout.md#business-logic)

### OI-33 - The card dispute events have no ordering rule

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. A per-dispute `sequence`, closed rows kept in the copy / B. Treat Closed as final per dispute id.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §14.10 already uses `sequence` against redelivery out of order, and the dispute copy drives the decision view and the §11.4 alert exception. Tradeoff accepted: one more field and closed rows kept until the purge.

**Open remainder:** None.

**Rule home:** [10 § 14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-34 - Status messages not yet sent are superseded by a later status

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. Send status messages in `sequence` order and always send the submission and approval messages / B. Repeat superseded content in later messages / C. Keep the rule.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-6 and AC-10 need the approval message, which no later message repeats. Tradeoff accepted: a request's status messages wait behind a failing earlier one, within the INT-02 bounds. This supersedes, for unsent messages, the rule applied by business review point PA-10 (stale messages superseded); its intent (no older status after a newer one) is kept.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-35 - A message in `Sending` is neither clearly superseded nor protected from being sent again

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review from the chunk 18 note "Out of scope, for the next review" on 13c. Options offered (recommended first): A. `Queued` or `Sending` count as not yet sent; status writes only while `Sending` / B. The sender holds the advisory lock across the MsgHub call / C. Re-read the status before the call.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: a compare-and-set keeps the superseding rules true for every message state without a lock held over a provider call. Tradeoff accepted: a call already in flight can still arrive.

**Open remainder:** None.

**Rule home:** [13c § Business Logic](./13c-service-customer-notification.md#business-logic)

### OI-36 - A stale `RefundRequestPaid` takes the processed-refund inbox slot

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. Apply the ordering rule before the inbox, every outcome logged with its `sequence` / B. Delete a stale Paid's inbox row later.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1 and BR-3 make the final Paid outcome count once. Tradeoff accepted: one more log row per paid refund.

**Open remainder:** None.

**Rule home:** [13d § Business Logic](./13d-service-loyalty-points.md#business-logic)

### OI-37 - A request Rejected because the bank refunded the disputed payment is a rejected refund to LOYALTY

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review (a term the two BRDs read differently). Options offered (recommended first): A. Flag it in §5 with a marker for the BRD owners and add `rejectionKind` / B. Treat it as a paid refund now.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: the cross-BRD reconciliation rule asks for a §5 row and a marker where two BRDs give a term different meanings; B would set a business rule in the design. Tradeoff accepted: one DTO field with no behaviour today.

**Open remainder:** The §5 marker, a question for the LOYALTY BRD owner with the REFUNDS BRD owner.

**Rule home:** [01 § 5 Glossary](./01-executive-summary-scope-risks.md#5-glossary)

### OI-38 - LOYALTY/NFR-02 is measured from the wrong moments

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. Measure from the latest of the three moments LOYALTY v1.7 names, and count the listener alert from switch-on / B. Leave parked and start-day take-backs out of the metric.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §18.5 states the NFR's three start moments; the metric and the alert now match them. Tradeoff accepted: one recorded switch-on time.

**Open remainder:** None.

**Rule home:** [13d § Observability & Monitoring](./13d-service-loyalty-points.md#observability--monitoring)

### OI-39 - Text written before payout rounds still says one idempotency key per payout

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. Bring §18.5, R-05 and the §14.10 Notes in line with §17.2 / B. Replace them with references.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §17.2 is the home of the payout rules, and the key per round is what makes a returned payment get paid again. Tradeoff accepted: none beyond the edit.

**Open remainder:** None.

**Rule home:** [14 § 18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets)

### OI-40 - The runbook has no procedure for switching a product on or starting more branches

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. A §20.1.8 heading with its marker and design facts / B. Leave it to §11.5.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: the refund-reporting start date is the one setting whose mistake changes balances with no correction path. Tradeoff accepted: one more procedure for the platform team to write.

**Open remainder:** The §20.1.8 procedure marker, for the platform team with the product owner.

**Rule home:** [16 § 20.1.8](./16-operations-runbook.md#2018-switch-on-a-product-or-start-more-branches)

### OI-41 - Two LOYALTY v1.5 additions have no realisation in §17.4

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. Fixed screen text for the line and a Future Enhancement row / B. A response field for the line.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) AC-9 needs a home, and the line holds until redeeming is planned. Tradeoff accepted: changing the line needs a frontend release.

**Open remainder:** None.

**Rule home:** [13d § Business Logic](./13d-service-loyalty-points.md#business-logic)

### OI-42 - The branch refund report and the request-to-payout metric do not say how a request paid twice counts

**Question:** Which resolution applies to this item? Raised by the v1.3 delta review. Options offered (recommended first): A. Count each request once / B. Count every Paid row.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: REFUNDS 09 and Business Objective 1 count requests once. Tradeoff accepted: the histogram leaves out the delay of paying again, which `payouts_returned_total` counts.

**Open remainder:** None.

**Rule home:** [13a § Business Logic](./13a-service-refund-request.md#business-logic)

### OI-43 - Text the applied OI-29 and OI-31 answers left out of line

**Question:** Which resolution applies to this item? Raised by the v1.3 scoped application check (review pass 2). Options offered (recommended first): A. Bring each list in line with §16.2, §16.4.3, §16.6 and ADR-07 / B. Replace the enumerations with references and fix only ADR-07, §16.8 and §17.2.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: the lists that restate the gates, the grantor, the operations rule and the tenant source must state the same set as their homes, and a BR-n or AC-n position carries its label. Tradeoff accepted: none beyond the edit.

**Open remainder:** None.

**Rule home:** [12 § 16.8 Lifecycle, Scope & Revocation Rules](./12-centralized-user-roles.md#168-lifecycle-scope--revocation-rules)

### OI-44 - Text the applied OI-32 answer left out of line

**Question:** Which resolution applies to this item? Raised by the v1.3 scoped application check (review pass 2). Options offered (recommended first): A. Bring Figure 5, §14.7, §11.4, §17.2 Send and §20.1.7 in line with §17.2 Disputes / B. Fix Figure 5 only.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §17.2 Disputes is the home of the rule that realises [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8; the places that restate it must not contradict it. Tradeoff accepted: none beyond the edit.

**Open remainder:** None.

**Rule home:** [13b § Business Logic](./13b-service-payout.md#business-logic)

### OI-45 - Text the applied OI-33, OI-36 and OI-39 answers left out of line

**Question:** Which resolution applies to this item? Raised by the v1.3 scoped application check (review pass 2). Options offered (recommended first): A. Bring §17.1, Figures 6 and 10, and API-01 in line with their homes / B. Replace the restatements with references.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: §17.1 Decide, §17.4 Take-back and §17.2 Send are the homes of the three rules; the API-01 cell is what the CardPay adapter is built from. Tradeoff accepted: none beyond the edit.

**Open remainder:** None.

**Rule home:** [11 § 15.3 API-01](./11-api-contracts.md#api-01-request-a-payout-payout---cardpay-ltd)

### OI-46 - With staff and end customers in one realm, the staff lookup client's limit depends on an IAM capability nothing asks for

**Question:** Which resolution applies to this item? Raised by the v1.3 scoped application check (review pass 2). Options offered (recommended first): A. State the limit as a requirement on the IAM and ask it in the API-08 marker / B. A staff directory the platform owns / C. Accept a client that reads every user.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rationale: ADR-07 Consequences carries it; it keeps the OI-29 choice and turns a limit the two-realm design gave by construction into a stated requirement checked against the IAM documentation API-08 already waits for. Tradeoff accepted: until ADR-07 is settled, the limit is a requirement, not a confirmed fact.

**Open remainder:** Whether the settled IAM supports the limit, asked in the API-08 `TBD - EXTERNAL` placeholder (provider documentation).

**Rule home:** [ADR-07](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-47 - Text the applied OI-45 answer left out of line (the §17.2 Disputes statement of the `refund-request` dispute copy)

**Question:** Which resolution applies to "Text the applied OI-45 answer left out of line (the §17.2 Disputes statement of the `refund-request` dispute copy)"? Raised by the v1.3 scoped application check of OI-43 to OI-46 (review pass 3 of 3, a last-pass discovery). Options offered (recommended first): A. Restate the copy's scope as §17.1 sets it / B. Replace the clause with a reference to §17.1 Boundaries.

**Decision record, 2026-10-10:** Accept recommendation (Option A), decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08) in the v1.3 request, where it waited as `Decided - pending application` because that request's review passes were used up; applied in v1.4 by the request "Apply the decisions waiting for application in the Refunds Platform SDD (OI-47)". Rationale: since OI-45, §17.1 Boundaries and Decide are the home of the dispute copy; the §17.2 sentence restates it and must state the same scope, or the ordering rule of OI-33 loses the closed rows it compares against. Tradeoff accepted: none beyond the edit. No other text needed bringing in line: §14.10, §17.1 Input, Tables Design, and Error Handling already describe the copy with its closed rows.

**Open remainder:** None.

**Rule home:** [13b § Business Logic](./13b-service-payout.md#business-logic)

## Marker register

### Authorization enforcement point (ADR-08)

**Resolution (2026-10-10):** The gate-blocking design-choice marker on ADR-08 ("Where is each Users & Use Cases Matrix rule enforced: role claims in the token checked by each module, a policy engine, or per-module checks against a permission store?") was walked in step 8 item 6 with three options: role claims mapped to permission tokens by one code map, checked in each module's inbound adapter, with contextual gates in the module's domain (Recommended); a policy engine (a new dependency, `AGENTS.md`); per-module checks against a permission store in the database. Taken: the recommended option, by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). ADR-08 is now Accepted and carries the rationale; the marker is removed and §16.2 item 5 states the enforcement point.

**Open remainder:** None.

**Rule home:** [ADR-08](./06-principles-and-decisions.md#10-architectural-decisions)

### loyalty-points parking period for a take-back waiting for its purchase

**Resolution (2026-10-10):** Settled by LOYALTY v1.5: [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-5: refund paid before earning now sets the wait (LOYALTY/OI-43, applied in LOYALTY v1.5). The §17.4 marker "How long does loyalty-points wait for the purchase of a paid refund before the parked take-back ends with no movement?" is removed, and §17.4 Take-back, §8.4.3 Figure 6 and its Summary refer to the wait that BR-5 sets instead of a setting. It answers the open remainder of business review point PA-02.

**Open remainder:** None.

**Rule home:** [13d § Business Logic](./13d-service-loyalty-points.md#business-logic)

## Business review register

### BO-06 - Legal launch gates

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the Prod promotion gate of §11.3 listed only the CardPay and POS Records dependencies, while the applicable data-protection law and consumer refund rights are open in both BRDs and the hosting location is open in §6. Decided: Option A. Each BRD now has a Hard dependency "Legal confirmation", Pending, needed before go-live (REFUNDS 02 and LOYALTY 02 § Dependencies), and §11.3 makes it a Prod gate; the hosting location and region are chosen only after the applicable data-protection law is named. It replaced the two-dependency Prod gate. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none for this SDD; the law and the owner of the confirmation are facts for the BRD owners, asked by markers in their BRDs. Whether the E3 inventory classifies the law and hosting-location markers as blocking is left to this SDD's owner at the hand-off.

**Rule home:** [07 § 11.3 Deployment](./07-cross-cutting-concerns.md#113-deployment-default)

### SME-02 - Receipt number as the purchase key

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the receipt lookup (API-04) and the unit-claim index of §17.1 assume a receipt number unique across all branches and days, which no source confirms. Decided: Option A. REFUNDS 02 now states the assumption with a marker, and §17.1 Eligibility carries a matching clarification marker naming what changes if the number is not unique. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a fact for the Retail IT team with the REFUNDS BRD owner (marker in §17.1); the key design that follows a "not unique" answer is a design choice for this SDD's owner after that answer.

**Rule home:** [13a § 17.1 Business Logic](./13a-service-refund-request.md#business-logic)

### SME-05 - CardPay confirmation before the build

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that R-02 made CardPay's confirmation a promotion gate, after the `payout` module is built, and that §17.2 assumes one CardPay credential set per tenant. Decided: Option A. REFUNDS 02 now needs the confirmation before the build of [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); R-02 and §11.3 say it is a start condition of the `payout` module build; §17.2 Multi-Tenancy Specifications carries a provider marker on one merchant account or one per branch. It replaced "the confirmation is a promotion gate" in R-02. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a provider question for CardPay Ltd (marker in §17.2); how credentials and payouts carry the branch, if the answer is per branch, is a design choice for this SDD's owner after that answer.

**Rule home:** [01 § 4 Risks](./01-executive-summary-scope-risks.md#4-risks)

### PM-01 - Points taken back for a partial refund

**Decision record, 2026-10-10:** The business review of 2026-10-10 decided the LOYALTY rule for a partial refund: 1 point per 1 EUR of the refunded amount, rounded as earning is rounded, within the BR-6 cap ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1). The §17.4 Take-back marker that asked this is replaced by the rule. It replaced the marker "How many points are taken back when only part of a purchase is refunded?". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none for this SDD beyond the existing rounding marker. The master's E3 inventory row for the removed marker is updated by this SDD's owner at the hand-off. The per-unit or per-refund amount the take-back needs is part of point PA-06.

**Rule home:** [13d § 17.4 Business Logic](./13d-service-loyalty-points.md#business-logic)

### PM-02 - A Prod gate per product

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings PM-02, BO-04) found that the single Prod gate of §11.3 tied each product's go-live to the other's slowest dependency, and that §11.5 ruled out any switch. Decided: Option A. §11.3 now has a Prod gate per product (Refunds Portal: CardPay confirmed; Loyalty Points: POS Records agreed; each with its BAT sign-off and legal confirmation), and §11.5 adds one enablement setting per product as plain configuration (`REFUNDS_PORTAL_ENABLED`, `LOYALTY_POINTS_ENABLED`), off until that product's gate is met; no feature-flag library is adopted (AGENTS.md). It replaced the shared two-dependency Prod gate and "Feature flags: not applicable for this release". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none for this SDD; the rollout order is a business choice in both BRDs (markers in their 04). Who owns the shared platform's cost is part of point BO-02.

**Rule home:** [07 § 11.3 Deployment](./07-cross-cutting-concerns.md#113-deployment-default)

### PM-03 - The metric of REFUNDS Business Objective 1

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that `refund_decision_wait_seconds` was labelled as the measure of REFUNDS Business Objective 1, which runs from request to payout, while the metric stops at the decision. Decided: Option A. §17.1 Metrics adds `refund_submitted_to_paid_seconds` (Submitted to Paid, by branch and across all branches) as the Objective 1 measure, and the decision-wait metric is relabelled as the decision part of it. It replaced the label "BRD Objective 1" on the decision-wait metric. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none for this SDD; who reads the objectives across branches is a REFUNDS business choice (marker in REFUNDS 09).

**Rule home:** [13a § 17.1 Observability & Monitoring](./13a-service-refund-request.md#observability--monitoring)

### PM-07 - Open REFUNDS rules the design had settled

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings PM-07, DC-03) found that §17.1 Submit took two open REFUNDS questions: "at least one contact detail is required" while [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-4 (REFUNDS/TD-04) is open, and a second refund-window check at submission while REFUNDS/OI-11 is open; with only a mobile number, the email-only cancellation message never reaches the customer. Decided: Option A. Both are now settings that follow the BRD answer, each with a clarification marker linked to its REFUNDS source; the contact marker names the cancellation-message consequence. It replaced "until it is answered, both are accepted as optional and at least one is required" and "re-runs the eligibility check at submission". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: two questions for the REFUNDS BRD owner, kept as the two markers in §17.1 (they are not design choices, so no open item). This SDD's owner adds them to the master E3 inventory at the hand-off.

**Rule home:** [13a § 17.1 Business Logic](./13a-service-refund-request.md#business-logic)

### PM-10 - The full-approval message

**Decision record, 2026-10-10:** The business review of 2026-10-10 decided that the customer is told by email and SMS when a request is approved in full (REFUNDS 03 / Customer messages, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8). §17.3 Select now produces the full-approval message on `RefundRequestApproved` when no unit was lowered, and the §14.10 Notes cell of `RefundRequestApproved` names both approval messages. It replaced "For a full approval it produces no message until the BRD settles it" and its marker. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none. The master's E3 inventory row for the removed marker, and the §18.1 message count, are rechecked by this SDD's owner at the hand-off.

**Rule home:** [13c § 17.3 Business Logic](./13c-service-customer-notification.md#business-logic)

### PA-01 - A payout that stops or can never succeed

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings PA-01, DC-05) found that only `PayoutSucceeded` ends a refund, so a `Stopped` payout leaves its request Approved forever, and that §17.2 and §20.1.7 assumed the customer could be "paid another way", which REFUNDS 02 Assumption 2 (original card only) and the open [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 marker do not allow. Decided: Option A. §17.2 Result and §20.1.7 no longer assume another way to pay; §17.2 states that until REFUNDS answers, a `Stopped` payout leaves the request Approved; the never-succeeds marker now names what its answer changes (a terminal payout outcome event in §14.10, a refund request status after Approved in Figure 16, the release of unit claims, the customer message, and the loyalty take-back of §8.4.3). It replaced "A `Stopped` payout is paid another way only after CardPay confirms..." and "check CardPay before paying the customer another way". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: the REFUNDS BRD owner's question (the widened marker in §17.2); once answered, the terminal event and status are a design choice for this SDD's owner. The master's E3 row for this marker should list the widened dependent claims; that is updated by this SDD's owner at the hand-off. The decision-record actor for a manual payout result is point SME-07 (REFUNDS 03).

**Rule home:** [13b § 17.2 Business Logic](./13b-service-payout.md#business-logic)

### PA-02 - Parked take-backs end, and the alert names the real exception

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that every refund of a non-member purchase parks a take-back forever (POS Records sends only member purchases), and that the §11.4 alert on any parked take-back older than 1 day would fire for most of them. Decided: Option A. §17.4 Take-back says a parked take-back ends with no movement after a parking period, a setting that follows the LOYALTY answer (marker linked to [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-5), ended by the `loyalty-retention-purge` job (§17.4 Input); §11.4 now alerts on a member purchase that arrives more than 1 day after its take-back was parked, and the parked count is a gauge. It replaced the alert "any parked take-back older than 1 day". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for the LOYALTY BRD owner, kept as the marker in §17.4.

**Rule home:** [13d § 17.4 Business Logic](./13d-service-loyalty-points.md#business-logic)

### PA-05 - The refund saga and its deadline

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that no chunk declares the cross-module flows as sagas (style, steps, compensation, timeout owners), and that nothing alerts on a refund Approved but not Paid. Decided: Option A. §14.7 has a saga doctrine: choreography; the refund saga's four steps with their owning modules and timeout owners; no compensation in this release, with the two open REFUNDS questions that would add it. §11.4 alerts on a refund request Approved for more than 3 days and not Paid (REFUNDS Business Objective 1), owned by `refund-request`. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none new.

**Rule home:** [10 § 14.7 Universal Subscribers & Cross-Service Doctrines](./10-events-hub.md#147-universal-subscribers--cross-service-doctrines)

### PA-06 - The committed event payload fields

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings PA-06, DC-01) found that §14.10 left every DTO field open while other chunks already committed to fields (R-04, §5, the 18 notes on OI-24 and OI-27), that `PayoutStillFailing` needs a `branch_id` that `payout` does not own, and that §11.6 allows personal data in payloads only where §14.10 states it. Decided: Option A. §14.10 now lists the committed fields of every DTO (common fields; the reference number; `branchId` in `RefundRequestApprovedDto`, kept by `payout` for `PayoutStillFailingDto`; the receipt number, paid date and refunded amounts per unit in `RefundRequestPaidDto`), states that no payload carries a contact detail or a member identifier, and that payload purchase data stays only until the completed publication row is purged; §16.4.3 adds `event_publication.payload` to the columns the operations role cannot read; the DTO marker now covers only the remaining fields and types. It replaced the marker "Which DTO fields does each in-process domain event carry?" and the Payload cells "fields per the marker above". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a design choice for this SDD's owner (remaining fields and types, and whether the marker blocks E3), kept as the narrowed marker; the §5 purchase-link marker still decides whether the receipt number is enough.

**Rule home:** [10 § 14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### PA-07 - The branch-manager lookup as a contract

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that §15.1 exempted "reading a branch manager's email address by `branch_id`" as infrastructure, although it decides who receives a business message and §15.1 itself says a business integration cannot claim the exemption; `customer-notification` was bound to the IAM user query with no port, timeout or typed errors. Decided: Option A. The lookup is now API-08 (`StaffDirectoryPort.findBranchManagers`, customer-notification to the platform IAM, external outbound, status TBD - ADR-07) in §15.2, §15.3 and §15.4; §15.1 keeps only token validation as infrastructure; §12 (the IAM paragraph), §17.3 Boundaries, Select and Integrations refer to API-08. It replaced the exemption and "through the platform IAM's user query". No new dependency is adopted. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: the IAM query and timeout follow ADR-07 (a design choice already open for this SDD's owner). Step 6a reconciliation of the new contract runs at the hand-off.

**Rule home:** [11 § 15.3 API-08](./11-api-contracts.md#api-08-find-the-branch-managers-of-a-branch-customer-notification---platform-iam)

### PA-08 - Who owns membership

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that membership was owned three ways (the membership source of §16.6, the IAM `MEMBER` role of §16.8, and `loyalty-points`, which closes the account although §17.4 Boundaries says it does not own membership records), and that the local copy of the leave fact had no freshness contract. Decided: Option A. §17.4 Membership says the membership source owns joining and leaving, and `loyalty-points` keeps a copy of the leave date to close the account and to apply LOYALTY 03 (earning by arrival time, take-back by paid date); the §16.6 marker also asks how late the leave date can reach Loyalty Points, and why it matters. It replaced "The source of membership and of the member identifier is open (§16.6)". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a fact for the LOYALTY BRD owner and the membership source (the delay), added to the §16.6 marker.

**Rule home:** [13d § 17.4 Business Logic](./13d-service-loyalty-points.md#business-logic)

### PA-09 - Extraction triggers and a second refund source

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that ADR-01 had no extraction trigger for `customer-notification`, although the architecture questionnaire record (§ Architecture questionnaire record, Q4) named the message fan-out as one, and no rule for a second source of paid refunds into `loyalty-points`. Decided: Option A. ADR-01 now extracts `customer-notification` when a new channel (push for the customer mobile app, REFUNDS 12 Wishlist item 2) or the message fan-out volume needs its own scaling, and states that a second source of paid refunds reaches `loyalty-points` only through its own inbound adapter translating it into the same take-back, with no other module writing the ledger. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none; whether such a source exists is the [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-7 question (point BO-01).

**Rule home:** [06 § 10 ADR-01](./06-principles-and-decisions.md#10-architectural-decisions)

### PA-10 - Event ordering and stale messages

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that §14.10 states no ordering, that redelivery can make a listener run late, and that §17.3 handled only the payout-delayed-then-paid pair, so a still-failing alert after Paid, or a Submitted or approval message after Rejected or Paid, could still be sent. Decided: Option A. §14.10 states that no order is guaranteed and that every `refund-request` event carries `sequence` (the decision-record row number); §17.3 Select keeps the highest sequence per request and creates or marks older status messages `Superseded`, and Paid also supersedes the still-failing alert. It replaced the Paid rule that superseded only payout-delayed messages. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none.

**Rule home:** [10 § 14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### PA-11 - No business references in logs

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that §17.4 logged `purchase_reference` and `refund_reference`, and §17.1 the reference number, although §11.6 keeps purchase data out of logs and a logged receipt number lets any signed-in customer read the receipt. Decided: Option A. §17.4 Logging now logs `movement_id` and the internal ids of the received purchase and the processed refund; §17.1 Logging logs `refund_request_id` only; neither logs a business reference. It replaced "with `movement_id`, `purchase_reference`, or `refund_reference`" and "with `refund_request_id` and the reference number". Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none.

**Rule home:** [13d § 17.4 Observability & Monitoring](./13d-service-loyalty-points.md#observability--monitoring)

### DC-02 - API-05 direction and the API-02 callback stay open in the text

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the master treats the API-05 direction (push or fetch) and the API-02 callback (only if CardPay calls back) as open and blocking, while §7.1, Figure 2, Figure 9, §15.2, §11.2 and §17.4 stated them as settled. Decided: Option A. §7.1 rows, the §15.2 API-05 Type, §11.2 Inbound provider calls, §17.4 Input and Integrations, Figure 2 (dotted, conditional edges) and Figure 9 (the callback labelled "if CardPay calls back") now state both as open; §17.4 Input names the fetch-job alternative. It replaced "calls in with payout results (API-02)", "External inbound API-05", "Inbound, sync" and the unconditional figure edges. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none new; both stay provider questions (existing markers). Which chunks change for each answer can be added to the E3 rows by this SDD's owner at the hand-off.

**Rule home:** [03 § 7.1 Actors](./03-users-and-use-cases.md#71-actors)

### DC-04 - Stopped and Unknown payouts in the REFUNDS/NFR-01 measure

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the REFUNDS/NFR-01 measure in §17.2 Reconciliation and §18.5 counted only CardPay mismatches, while REFUNDS/NFR-01 counts every missing payout and excepts only one still being tried again. Decided: Option A. §17.2 and §18.5 now count a payout `Stopped` or `Unknown` at month end as missing. It replaced nothing; it adds to the measure. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none.

**Rule home:** [13b § 17.2 Business Logic](./13b-service-payout.md#business-logic)

### DC-07 - Deleting the history of a member who left

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that §17.4 Constraints said movements are never deleted, while §17.4 Input and LOYALTY 03 delete the history of a member who left; on the REFUNDS side, REFUNDS 03 now states that the decision record is deleted only when its REFUNDS/NFR-06 period ends, which matches the purge grant of §17.1. Decided: Option A. §17.4 Constraints now says movements are never updated (except detail columns cleared by the purge) and never deleted except by the retention purge, which deletes a leaver's history once its period ends. It replaced "Movements are never updated or deleted, except detail columns cleared by the retention purge." Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none new.

**Rule home:** [13d § 17.4 Constraints](./13d-service-loyalty-points.md#constraints)

### DC-08 - Two realms, the own-request rule, and the IdP choice

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that ADR-07's two realms make a branch manager's staff and customer identities different, so the own-request gate ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-6, AC-4) cannot be checked; that §18.5 treated ADR-07's alternative (a managed identity service) as an equal choice; and that §11.2 said `tenant_id` is set "per realm". Decided: Option A. ADR-07 now says both realms set the same `tenant_id` claim and that the own-request rule needs a link between the two identities, which it leaves open; §18.5 states the availability condition for each ADR-07 outcome; §11.2 says both realms set the same tenant claim. ADR-07 stays Proposed (a new dependency, `AGENTS.md`). It replaced "set by the IAM per realm" and the §18.5 sentence that put the two IdP options side by side. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a design choice for this SDD's owner (how a staff account is linked to the same person's customer account, or one realm), to be raised as an open item at the hand-off; the master's E3 row for §16.2 should then list [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-6 and AC-4 as dependent.

**Rule home:** [06 § 10 ADR-07](./06-principles-and-decisions.md#10-architectural-decisions)

### DC-09 - Detail endpoints in the §7.3 entry points

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that §7.3 left out three detail endpoints that §17.1 and §17.4 define for steps 3-4 of their use cases. Decided: Option A. The §7.3 Entry points cells now list `GET /v1/refund-requests/{refundRequestId}` ([REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status)), `GET /v1/branches/{branchId}/refund-requests/{refundRequestId}` ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)) and `GET /v1/members/me/points-movements/{movementId}` ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)). It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none; step 6a rechecks §7.3 at the hand-off.

**Rule home:** [03 § 7.3 Use Case Traceability](./03-users-and-use-cases.md#73-use-case-traceability-brd--sdd)

## Walkthrough and delegation history

**Delegation, 2026-10-10:** Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Text: "answer policy: accept the recommended option. Continue at part checkpoints. Stand-ins: Approver." It takes the recommended option or stated default of any question that carries one; it never chooses anything else, never supplies a fact only a person or provider can give, and never adopts a decision `AGENTS.md` reserves for the product owner (a new third-party dependency). Stops it may pass: part checkpoints (none arise in this `whole` run). Approver stand-in: named; it signs only in a sign-off request (SKILL.md step 10), not in this build.

### Action entries

**Intake, 2026-10-10:** Request: "Derive one SDD for the Refunds Platform from the BRDs P\run\brd-refunds-portal and P\run\brd-loyalty-points. Write it to P\run\sdd-refunds-platform." Project name, sources, output mode (chunks), and generation option (whole) came from the request and the run brief; no intake question was asked. Intent: derive-from-BRD, both BRDs chunked brd-unifier output, both finished (Generation: whole, no part pending). BRD keys from the run brief: REFUNDS (brd-refunds-portal), LOYALTY (brd-loyalty-points).

**Unapproved source BRDs, 2026-10-10:** REFUNDS v1.2 and LOYALTY v1.3 both have cover Status In Review. Question for each: "Derive the SDD from this BRD although its cover is not Approved?" Options: Yes, proceed (Recommended) / No, wait for approval. Answered Yes for both by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rule home: [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage).

**Project Type, 2026-10-10:** Question: "Greenfield (new product, no existing code) or Brownfield (extending an existing codebase)? If brownfield, where is the codebase?" Options: Greenfield (Recommended: no source BRD names an existing codebase this system extends) / Brownfield. Answered Greenfield by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rule home: [01 § Executive Summary](./01-executive-summary-scope-risks.md#1-executive-summary).

**Cross-BRD reconciliation, 2026-10-10:** No conflicting technical mandate (only REFUNDS has Technical Inputs), no phase conflict (neither BRD is phase-based), no conflicting drivers, and no two use cases with the same behaviour, so no reconciliation question was asked. Findings and where each landed: REFUNDS Customer and LOYALTY Member are different roles, two actors (§7.1), with the shared sign-in open (§16.2 marker); Point-of-Sale Records and POS Records are one partner, one row (INT-03); REFUNDS 08 names Retail IT team as its owner while LOYALTY 08 leaves the owner open (BRD follow-up for LOYALTY); LOYALTY's refund outcome is designed as the in-process event `RefundRequestPaid` and checked from both sides: REFUNDS holds the refund reference, paid amount, outcome, and paid date, but the link between the receipt number and the LOYALTY purchase reference is open (§5 marker, R-04); REFUNDS 08 does not name Loyalty Points as a receiver of refund outcomes (BRD follow-up for REFUNDS); availability measures differ (REFUNDS/NFR-02 set, LOYALTY/NFR-04 open), so §18.5 keeps a target per BRD; both BRDs leave the data-protection law and the brand color open (§17.1 and §6 markers).

**Service decomposition, 2026-10-10:** Every active use case maps cleanly to one module (REFUNDS use cases to `refund-request`, LOYALTY use cases to `loyalty-points`), so the decomposition question of brd-to-sdd.md workflow step 4 was not asked. Derivation assumptions: `payout` and `customer-notification` are separate modules for REFUNDS/NFR-01 isolation and for the message fan-out; the POS Records adapters sit in the two consuming modules.

**Generation, 2026-10-10:** Chunks 00-17 written in one run (`whole`), with the master and this register.

**Review and acceptance loop, 2026-10-10:** Baseline review (cleared-context reviewer, full first-build scope) raised OI-01 to OI-20; the author appended OI-21 (earning points has no LOYALTY use case). The author held OI-04 wrong (its only evidence was a rule outside this run) and re-dispatched the reviewer on it, which rewrote it as `No change` (not a new pass). The loop presented the items in batches of up to four (OI-01 to OI-04, OI-05 to OI-08, OI-09 to OI-12, OI-13 to OI-16, OI-17 to OI-20, OI-21); the answer policy answered every item, so no item was left for "later". Scoped application check 1 verified the applied items and the ADR-08 marker answer and raised OI-22 to OI-25, decided in one batch and applied. Scoped application check 2 (the request's last review pass) verified them and raised OI-26 and OI-27, decided in one batch and left `Decided - pending application`.

**Marker walk, 2026-10-10:** The E3 inventory (master) lists 66 live markers, 16 of them blocking. One blocking marker was a design choice (ADR-08 enforcement point), walked and answered by the policy (§ Marker register). The other 15 blocking markers are facts for a named owner (BRD owners, Retail IT team, CardPay Ltd) and are handed off; the policy supplies no fact.

**Gate, 2026-10-10:** Step 6a reran after the last edit (master Reconciled entry 2). Chunk 19 is Locked: E1 (OI-26, OI-27 pending application) and E3 (16 blocking markers) are not met.

**Update v1.1, 2026-10-10:** Request: "Apply the decisions waiting for application in the Refunds Platform SDD (OI-26, OI-27)." Not a resume (Generation: whole, no part pending); the Child LLDs table holds no child (`None yet`), so no row is out of date, before or after the bump. The request started from content matching master Reconciled entry 2 (`sha256:7db2238cb81ef76b`), so no edit outside the skill. Applied OI-26 and OI-27 first (SKILL.md step 8 item 3); brought the §17.3 Tenant filter in line with OI-26. Baseline: application check of the applied items (fresh cleared-context reviewer, pass 1 of 3), which raised OI-28. The acceptance loop presented OI-28 alone in one batch; the answer policy accepted its recommendation, and it was applied. Scoped verification of OI-28 (fresh reviewer, pass 2 of 3) found no issue, so no third pass ran. Step 6a reran after the last body edit (master Reconciled entry 3). Marker walk: the E3 inventory was rechecked against the live markers (66 markers, 16 blocking); every blocking marker is a fact for a named owner, none a design choice, so the policy answered none and each is handed off. Chunk 19 stays Locked: E3 is not met. Rule home: [00 § Changes Log](./00-cover-and-changelog.md#changes-log).

**Update v1.3, 2026-10-10:** Request: "BRD REFUNDS and BRD LOYALTY have a new version, after the business review of 2026-10-10 (review-comments-tracker.md), for the SDD Refunds Platform". Not a resume (Generation: whole). Taken as the "BRD <KEY> has a new version" row with the business review row run in the same update, one version (v1.3). The review hand-off had not been taken before: no Changes Log row or Reconciled entry by this skill after the review's v1.2 row. This entry records that the hand-off of the business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md), hand-off 3) was taken in v1.3. The request started from content `sha256:87f6ffde646c31af`, explained by the v1.2 row, so no edit outside the skill.

- **Unapproved source BRDs:** REFUNDS v1.5 and LOYALTY v1.7 both have cover Status In Review. Question for each: "Derive the SDD from this BRD version although its cover is not Approved?" Options: Yes, proceed (Recommended) / No, wait for approval. Answered Yes for both by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Rule home: [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage).
- **Cross-BRD reconciliation on what changed:** no new technical mandate, no phase-based BRD, no conflicting drivers, so no reconciliation question was asked. Findings: REFUNDS 08 now names Loyalty Points as a receiver; it sends one outcome LOYALTY 08 does not name (a Paid request back to Approved), flagged by the §17.4 marker and the §5 Refund row; a Rejected request after a refunded card dispute is read differently by the two BRDs (OI-37, §5 marker); [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-7: only refunds the Refunds Portal reports cut-off and REFUNDS 04 keeping outcomes until Loyalty Points starts agree and are realised by the publication log and the refund-reporting start date (§11.5); the purchase link (§5 marker) stays open.
- **Items the change settles:** the §17.4 parking-period marker (LOYALTY v1.5, § Marker register); OI-14 and OI-24 superseded by REFUNDS v1.4 (their records above). No open or deferred item existed.
- **Business review steps:** step 6a rerun with §7.3, API-08 / INT-04 and the §7.3 detail endpoints checked; open remainders that are design choices for this SDD's owner raised as OI-29 (DC-08) and OI-30 (PA-06); the PA-01 and SME-02 and SME-05 remainders wait for their owners' answers; the SME-03 remainder (a Paid payout sent back) was answered by REFUNDS v1.4 and derived in §17.2 and §17.1; the SME-07 remainder (the staff who record a payout result by hand) raised as OI-31; BO-06, PM-01, PM-07, PM-10, PA-01, DC-02 and DC-08 E3 rows rebuilt in the inventory. Child LLDs check: the Refunds Platform LLD records SDD v1.1, so its row carries the out-of-date note (SDD is now v1.3).
- **Review passes (3 of 3):** pass 1, the delta review of chunks 01 and 03 to 16 (the review's v1.2 chunks and this update's), raised OI-32 to OI-42; pass 2, the scoped application check of OI-29 to OI-42, raised OI-43 to OI-46; pass 3, the scoped application check of OI-43 to OI-46, raised OI-47 (a last-pass discovery).
- **Acceptance loop:** batches of up to four: OI-29 to OI-32, OI-33 to OI-36, OI-37 to OI-40, OI-41 and OI-42; then OI-43 to OI-46; then OI-47. The answer policy accepted every recommendation; none needed a fact or a new dependency. OI-47 is `Decided - pending application`; the next request applies it first and writes its record then.
- **Marker walk:** the E3 inventory lists 78 live markers, 23 blocking; every blocking marker is a fact for a named owner, none a design choice, so the policy answered none and each is handed off.
- **Gate:** step 6a reran after the last body edit (master Reconciled entry 4). Chunk 19 stays Locked: E1 (OI-47 pending application) and E3 (23 blocking markers) are not met.

Rule home: [00 § Changes Log](./00-cover-and-changelog.md#changes-log).

**Update v1.4, 2026-10-10:** Request: "Apply the decisions waiting for application in the Refunds Platform SDD (OI-47), at P\run\sdd-refunds-platform." Not a resume (Generation: whole, no part pending). The request started from content matching master Reconciled entry 4 (`sha256:383424054ea98b4f`), so no edit outside the skill. REFUNDS (v1.5) and LOYALTY (v1.7) are unchanged since v1.3. Child LLDs check: the Refunds Platform LLD still records SDD v1.1, so its row's out-of-date note now names v1.4. Applied OI-47 first (SKILL.md step 8 item 3); no other text needed bringing in line. Step 6a fix: the BRD key on the REFUNDS 12 TI-01 citation of the §6 Observability: Metrics row. Baseline: application check of OI-47 (fresh cleared-context reviewer, pass 1 of 3), no issue found; it added one out-of-scope note on the 1.4 Changes Log row, which now names the step 6a fix (note marked Resolved in v1.4). No item was `Open`, so the acceptance loop asked nothing, and no further pass ran. Marker walk: the E3 inventory was rechecked against the live markers (78 markers, 23 blocking, no marker changed); every blocking marker is a fact for a named owner, none a design choice, so the policy answered none and each is handed off. Step 6a reran after the last body edit (master Reconciled entry 5). Chunk 19 stays Locked: E1, E2, and E4 are met; E3 is not. Rule home: [00 § Changes Log](./00-cover-and-changelog.md#changes-log).
