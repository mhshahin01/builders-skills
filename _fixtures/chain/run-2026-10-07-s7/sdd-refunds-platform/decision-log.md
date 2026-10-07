<!--
TYPE: Decision Log
PROJECT: Refunds Platform
VERSION: 1.8
PART OF: SDD - Refunds Platform
PURPOSE: Single home for the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Refunds Platform

## How to read

The numbered chunks hold the current settled design, and the ADRs in [chunk 06 § 10](./06-principles-and-decisions.md#10-architectural-decisions) hold each architecture decision with its rationale. This companion file holds how those decisions were reached: the questionnaire and ecosystem answers, the open items decided after the review, the clarification markers settled in the decision walk, and the session record. Read the chunks for what the system is; read this file for the history behind it.

## Architecture questionnaire record

**Outcome, 2026-10-06:** Accept all. The user answered. Style: modular monolith; followed the recommendation.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release of a product that will grow (Recommended) / MVP or proof of concept / Platform at scale | First production release of a product that will grow | [REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) ("A separate mobile app is not part of this release"); [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist); [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope) (redeeming points is a later phase); [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist) | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q2 Teams in the next 12 months | One team (Recommended) / Two or three teams / Four or more teams | One team | assumption - BRD silent (both BRDs); two or three teams would not change the Q4 recommendation for this profile | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | [REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) (about 1,200 requests a month across 40 branches; seasonal sales triple requests for about 3 weeks); REFUNDS/NFR-02, REFUNDS/NFR-03, REFUNDS/NFR-05; LOYALTY/NFR-04, LOYALTY/NFR-05; LOYALTY states no volumes | [§18](./14-performance-and-capacity.md#18-performance--capacity-planning) |
| Q4 Architecture style | Modular monolith (Recommended) / Hybrid / Microservices | Modular monolith | Profile "first production release": no BRD NFR or Technical Input states a separate scaling, failure, or release need for one part | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process calls through module ports, with domain events and an outbox for anything that leaves the process (Recommended) / Event-driven backbone plus synchronous REST for queries / Mostly synchronous REST | In-process calls through module ports, with domain events and an outbox | Q4; every partner in [REFUNDS 08](../brd-refunds-portal/08-integrations.md#integrations) and [LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations) is outside the deployable; REFUNDS/NFR-01 (never lost or paid twice) | [ADR-02, ADR-05](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One database, one schema per module, no cross-module joins (Recommended) / One database per service / One database per service with a reporting store | One database, one schema per module | Q4; the two reports ([REFUNDS 09](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics), [LOYALTY 09](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics)) read one module each | [ADR-06](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy | Shared schema with `tenant_id` (Recommended) / Schema per tenant / Database per tenant / Single tenant | Shared schema with `tenant_id` | CLAUDE.md platform rule (shared schema for low-volume parts); REFUNDS 02 Facts volumes; both BRDs describe one retailer (REFUNDS 13 and LOYALTY 13 Reviewer Notes) | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q8 Deployment target | Kubernetes with one Helm chart per deployable (Recommended) / Managed container service / A simple container or VM setup | Kubernetes with one Helm chart per deployable | CLAUDE.md default (one container, one Helm chart per deployable); no BRD Technical Input names a target | [§11.3](./07-cross-cutting-concerns.md#113-deployment-default) |

**Later record, 2026-10-07 (v1.6):** the Q2 answer (one team) is confirmed by a test-fixture answer, owner the Head of Retail: the Finance team has no delivery team of its own for the Refunds Portal, and one delivery team builds both products (Marker register, "§3 Assumption 7 - one delivery team for both products"). The table above keeps the evidence as it stood on 2026-10-06.

## Ecosystem selection record

**Outcome, 2026-10-06:** Accept all. The user answered; no row was walked through or overridden. Each row's source stays in the [§6](./02-ecosystem-overview.md#6-ecosystem-overview) Notes column.

## Clarification register

All 26 open items from the review are decided on 2026-10-06: 25 accepted and applied, 1 rejected (OI-22). The delta review of v1.1 added OI-27 to OI-34, all decided on 2026-10-06: 7 accepted and applied, 1 rejected (OI-27). The delta review of v1.2 added OI-35 to OI-41, all decided on 2026-10-06: 4 accepted and applied, 1 adjusted and applied (OI-36), and 2 rejected (OI-35, OI-39). The delta review of v1.6 added OI-42 and OI-43, and the scoped check of their application added OI-44, all decided on 2026-10-07: 3 accepted and applied. The chunk 19 faithfulness check of v1.6 raised OI-45, decided on 2026-10-07 and accepted and applied in v1.7; the scoped check of its application added OI-46 and OI-47, both decided on 2026-10-07 and accepted and applied. The delta review of v1.8 added no item. Each record below is the process; the chunks carry the settled design.

### OI-01 - Module dependency cycles

**Question:** Two module pairs depended on each other (customer-accounts and notifications through API-12 and API-14; refund-requests and payouts through their events), which fails the boundary check that AP-11 and ADR-01 run on every build.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: customer-accounts owns the API-14 port and notifications implements it, payouts declares the DTOs of its three contract events, and AP-11 states the acyclic module graph. Offered: A (recommended), B a shared kernel module, C relax the cycle rule. Rationale: the boundary check is a build gate, so a cycle is a defect; applying the port rule in one direction keeps payouts a lower module. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-02 - The team evidence of ADR-01

**Question:** ADR-01 read both BRDs as silent on teams, while [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) names the Finance team as owner of the Refunds Portal.

**Decision record, 2026-10-06:** Option A: ADR-01 cites LOYALTY 02 and reads the Finance team as the business owner, and §3 Assumption 7 records one delivery team. Offered: A (recommended), B treat the Finance team as a second delivery team now. Rationale: the team count is the first driver of ADR-01 and the only one tied to its extraction trigger, so its evidence must match the BRDs. Open remainder: whether the Finance team has its own delivery team, marked in §3 Assumption 7 for the Head of Retail. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Decision record, 2026-10-07 (v1.6):** The open remainder is answered by the user with a test-fixture answer, owner the Head of Retail: the Finance team has no delivery team of its own for the Refunds Portal, and one delivery team builds both products. ADR-01 stands as decided, and its extraction trigger is not met at the start; §3 Assumption 7 states the answer and its marker is removed (Marker register, "§3 Assumption 7 - one delivery team for both products"). OI-42 then kept the [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) link on the ownership it states.

**Rule home:** [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-03 - The outbox rule and the synchronous outside calls

**Question:** The SDD stated that every call leaving the process runs from the publication log, while four synchronous outside calls are designed.

**Decision record, 2026-10-06:** Option A: the rule covers every outside call that follows a committed state change, and §8.1.1 lists the four synchronous exceptions once; §15.5 names API-14 followed by API-05 as the one two-step path. Offered: A (recommended), B route every outside call through the log. Rationale: the synchronous calls are deliberate (ADR-05 and the immediate answers of the BRD error paths), so the doctrine text, not the design, was wrong. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§8.1.1 What](./04-architecture-style-and-diagrams.md#811-what)

### OI-04 - API-13 provider in Figure 3

**Question:** Figure 3 drew API-13 on customer-accounts, while §15.2 registers refund-requests as its provider.

**Decision record, 2026-10-06:** Option A: one edge per port and provider. Offered: A (recommended), B remove the port labels. Rationale: §15 is the contract registry and the figures follow it. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§8.3 High-Level Architecture Diagram](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram)

### OI-05 - Retries from the publication log

**Question:** The publication log keeps no attempt count, so the promised backoff and jitter could not happen, two replicas could run one listener at once, and the 15-minute alert could not tell a stuck listener from a planned retry.

**Decision record, 2026-10-06:** Option A: a listener that leads to an outside call records the work under a unique key and completes, a send job of its module makes every later try with backoff and jitter, one `publication-resubmit` job resubmits stale entries, and listener identities stay stable across releases. Offered: A (recommended), B attempt records inside the listeners, C drop backoff and jitter. Rationale: one run per effect for REFUNDS/NFR-01 and for messages sent once, with backoff that protects partners; it reuses the shape payouts already had. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§11.1 DB Modeling](./07-cross-cutting-concerns.md#111-db-modeling-default)

### OI-06 - Tenancy for jobs, redeliveries, and platform tables

**Question:** Scheduled jobs and redelivered events had no tenant to run in, and platform tables could not follow the `tenant_id`-first rule.

**Decision record, 2026-10-06:** Option A: a `platform.tenant` registry that every job iterates, `tenantId` and `correlationId` in every in-process DTO, a named exemption for platform tables, and a provisioning list in ADR-03. Offered: A (recommended), B a job role that bypasses row-level security. Rationale: the CLAUDE.md multi-tenancy rules are non-negotiable, and row-level security stays the last line of defence. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§11.2 Multi-Tenancy](./07-cross-cutting-concerns.md#112-multi-tenancy-default)

### OI-07 - Gateway route classes

**Question:** The gateway rejected every call without a token, which public sign-up routes and provider callbacks must pass.

**Decision record, 2026-10-06:** Option A: user, public, and provider route classes, each with its own checks. Offered: A (recommended), B client-credential tokens for every provider. Rationale: the provider schemes are `TBD - external`, so the route policy cannot wait for them, and a source-address limit protects the payout callback meanwhile. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§11.6 Security](./07-cross-cutting-concerns.md#116-security-default)

### OI-08 - Keycloak realm and client settings

**Question:** Keycloak self-registration and its own password reset could bypass the confirmed sign-up, the two web apps could mix identities, and token lifetimes were not set.

**Decision record, 2026-10-06:** Option A: the realm and client settings in ADR-07. Offered: A (recommended), B one realm per population. The token lifetimes are proposals for the security owner; ADR-07 carries the rationale. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [ADR-07](./06-principles-and-decisions.md#10-architectural-decisions)

### OI-09 - Branch reference data and business dates

**Question:** Branch country and time zone had no source, loyalty-points and notifications needed branch dates they could not compute, and dates with no branch had no time zone.

**Decision record, 2026-10-06:** Option A: the module that owns a fact computes its business date once and passes it on; events carry the branch-local date and the branch country; a tenant business time zone covers dates with no branch. Offered: A (recommended), B a branch directory port. Rationale: [LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations) already lists the refund date among the facts the Refunds Portal sends, so option A follows the BRDs' own data flow. Open remainder: the system of record of the branch list (§3 Assumption 4) and the business time zone (§6) are marked for their owners. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§6 Ecosystem Overview, Time rule](./02-ecosystem-overview.md#6-ecosystem-overview)

### OI-10 - Number and amount formats per product

**Question:** The two BRDs format numbers and amounts differently, and only dates were decided.

**Decision record, 2026-10-06:** Option A: each product keeps its BRD rule, and only the web apps, message templates, and report exports format values. Offered: A (recommended), B one format for both. Rationale: each BRD states its own rule for its own screens. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§11.6 Security, UX standards](./07-cross-cutting-concerns.md#116-security-default)

### OI-11 - Code sends within the sign-up budget

**Question:** Sequential code sends could exceed the 3 s of REFUNDS/NFR-05, and a half-sent pair left a sign-up in an unclear state.

**Decision record, 2026-10-06:** Option A: both codes sent concurrently under one shared 2 s deadline, a 500 ms Keycloak timeout, the sign-up closed on any failed send, and a separate bulkhead for API-14. Offered: A (recommended), B sequential sends with 1 s each, C background sends. Rationale: fits the budget with margin without changing what the customer sees; 500 ms is a proposal. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§12 INT-02](./08-integrations.md#12-integrations)

### OI-12 - Branch assignment refresh

**Question:** The refresh had no sign-in trigger and no interval, so access after a cover change had no bound.

**Decision record, 2026-10-06:** Option A: a refresh every 15 minutes, plus one at a branch manager's first request in each sign-in session, with an alert after 30 minutes. Offered: A (recommended), B a Keycloak event listener extension, C the schedule only. Rationale: meets REFUNDS/TC-DEC-12 of [REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md) without custom Keycloak code; the interval is a proposal. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### OI-13 - The POS adapter as a listener

**Question:** The POS adapter of refund-requests handled four events but appeared only in Notes, not in the listener columns.

**Decision record, 2026-10-06:** Option A: the adapter is named in the listener columns of §14.10 and the 13x tables, and the §17.2 Input table lists the four events. Offered: A (recommended), B keep it in Notes. Rationale: the publication log tracks one entry per listener, so the listener column must name every handler. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### OI-14 - Items notices out of order

**Question:** Per-event items notices retried side by side could leave items blocked at POS Records for a cancelled request.

**Decision record, 2026-10-06:** Option A: the adapter sends the request's current item state and only when it differs from the last acknowledged one. Offered: A (recommended), B sequence numbers at POS Records, C a daily reconciliation. Rationale: keeps the promise of [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 without waiting for the POS Records documentation. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### OI-15 - Keycloak user writes outside the outbox

**Question:** Sign-up, confirmation, and closure wrote to Keycloak and to the module with no shared transaction.

**Decision record, 2026-10-06:** Option A: the Keycloak user lifecycle of §17.1: inline compensation, expiry of abandoned sign-ups, deletion of closed users from the publication log, and an hourly reconciliation. Offered: A (recommended), B create the user only at confirmation, C fix by hand. Rationale: closure is a removal promise ([REFUNDS 03 § Refund records](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-records)) and [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) E2 is a statement about accounts, so both must hold after a crash; the 24-hour expiry is a proposal. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.1 Business Logic](./13a-service-customer-accounts.md#business-logic)

### OI-16 - The last sign-in that drives closure

**Question:** The last sign-in was written only by a GET from the web app, so a missed call could close an active account.

**Decision record, 2026-10-06:** Option A: the closure job reads Keycloak's saved sign-in events, and the GET only reads. Offered: A (recommended), B a POST from the client, C a write on every request. Rationale: closure cannot be undone, so the record comes from the system that performs every sign-in; the 7-day event expiry is a proposal. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.1 Business Logic](./13a-service-customer-accounts.md#business-logic)

### OI-17 - Attempt limits for codes, resets, and passwords

**Question:** REFUNDS handed the limit on tries to the SDD ([REFUNDS 13 OI-32](../brd-refunds-portal/13-open-items-and-clarifications.md#oi-32-sign-up-does-not-say-what-happens-when-the-customer-turns-down-an-offer), [REFUNDS 13 OI-33](../brd-refunds-portal/13-open-items-and-clarifications.md#oi-33-sign-in-has-no-failure-path-and-no-way-back-for-a-forgotten-password)), and the SDD had none.

**Decision record, 2026-10-06:** Option A: 6-digit codes from a secure random source, 5 wrong entries per code, 5 codes per address and 3 resets per account per hour, Keycloak brute-force detection, and gateway limits on the confirmation endpoints. Offered: A (recommended), B gateway limits per client address only. Rationale: the BRD delegated the limit, so leaving it out leaves a hole its reviewers believe is closed; the values are proposals for the security owner. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.1 Business Logic](./13a-service-customer-accounts.md#business-logic)

### OI-18 - The card-paid cap under concurrency

**Question:** Two concurrent submissions on one receipt could pass the card-paid cap together, and which requests count against the cap is a business rule no BRD states.

**Decision record, 2026-10-06:** Option A: every submission and cancellation of one purchase takes a row lock on its purchase record, and the counting rule stays a marked question. Offered: A (recommended), B check the cap at approval. Rationale: the cap is a money limit (REFUNDS/NFR-01) and the lock costs nothing at the BRD volumes. Open remainder: whether a Rejected or Payout failed request counts against the card-paid amount ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-4: refund capped at the card-paid amount), marked in §17.2 Amounts for the REFUNDS owner. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Decision record, 2026-10-06 (v1.1):** The open remainder is settled by the user's answer, given as a test-fixture value: only Approved and Paid refund amounts count against the card-paid amount (§ Marker register, "§17.2 refund-requests: card-paid counting rule"). This supersedes the lock scope of the record above: the purchase lock is now taken by every submission and every approval, not by cancellations. The item keeps its status, Accepted - applied.

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### OI-19 - Payout attempts and keys

**Question:** Retrying a refused payout with the same key may replay the refusal, while a new key on every try may pay twice after a timeout.

**Decision record, 2026-10-06:** Option A: one open attempt per payout with its own key, the same key while the outcome is unknown, and a new key only after a definitive refusal. Offered: A (recommended), B the same key for every try, C a new key for every try. Rationale: the only option that lets a later try succeed ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1) and never pays twice (REFUNDS/NFR-01); the CardPay answers it depends on are `TBD - external`. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.3 Business Logic](./13c-service-payouts.md#business-logic)

### OI-20 - A payout success after Payout failed

**Question:** A provider success after the request became Payout failed, plus a branch settlement, pays the customer twice.

**Decision record, 2026-10-06:** Option A: risk R-14, an immediate page with the refund reference and the branch, and the §20.1.8 procedure. Offered: A (recommended), B a new status after Payout failed. Rationale: keeps the BRD lifecycle and stops the loss at the branch counter. Open remainder: the R-14 owner and the §20.1.8 contact and response time stay marked for the operations owner. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§20.1.8 Late Payout Success](./16-operations-runbook.md#2018-late-payout-success)

### OI-21 - One purchase at a time in the points ledger

**Question:** Purchase reports, take-backs, and corrections for one purchase could race and leave a balance too high.

**Decision record, 2026-10-06:** Option A: every step on one purchase takes a row lock on its purchase record, plus a daily `waiting-refund-check` job. Offered: A (recommended), B a periodic sweep only. Rationale: LOYALTY/NFR-01 accepts zero mismatches, and the lock is cheap. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.5 Business Logic](./13e-service-loyalty-points.md#business-logic)

### OI-22 - Acceptance of the go-live import

**Question:** The go-live import had no acceptance step, a rerun had no defined winner, and the promotion gate waited on an import that can run only in Prod.

**Decision record, 2026-10-06:** Rejected as out of scope, through the standing answer for this run (reject a new item that adds business behaviour no BRD states). The Recommended Answer adds business behaviour that neither BRD states: an acceptance of the opening balances by a role the business must name, and member routes kept closed until that acceptance. Offered: A (recommended) a staged import with one acceptance, B the last run wins until the go-live date ends. Nothing was applied: §17.5 and INT-06 keep one Opening balance movement per member, and a rerun adds no second one. Open remainder: who accepts the opening balances, what a rerun with a corrected file does, and how the import fits the promotion gate are questions for the LOYALTY owner ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) names the import as a go-live dependency); an answer comes back as a new LOYALTY version.

**Rule home:** [§17.5 Business Logic](./13e-service-loyalty-points.md#business-logic)

### OI-23 - Availability across the request path

**Question:** The availability budgets covered only the deployable and its database, and no measure defined an unavailable minute.

**Decision record, 2026-10-06:** Option A: at least 2 replicas for the ingress, the gateway, and Keycloak, a 5-minute database failover, a defined availability measure, and the member sign-in question for the LOYALTY owner. Offered: A (recommended), B leave the rest to hosting. Rationale: a budget that leaves out the components every request passes cannot be shown to be met; 5 minutes and 5% are proposals. Open remainder: the member sign-in availability, marked in §18.5 for the LOYALTY owner. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§11.4 Observability](./07-cross-cutting-concerns.md#114-observability-default)

### OI-24 - A settable business clock for the BAT suites

**Question:** The BAT suites that gate promotion need to move time ([LOYALTY 16](../brd-loyalty-points/16-uat-bat-test-cases.md) prerequisite P1), and nothing in the design allowed it.

**Decision record, 2026-10-06:** Option A: one injected business clock with an offset setting in Dev, SIT, and UAT and none in Prod; security checks keep real time. Offered: A (recommended), B run time-dependent cases in real time. Rationale: the suites are the promotion gate, so their prerequisites are platform requirements. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§19 Environments](./15-environments.md#19-environments)

### OI-25 - Runbook procedures for the designed alerts

**Question:** Six alerts raised in the body had no runbook procedure.

**Decision record, 2026-10-06:** Option A: one procedure per alert with its trigger, first check, and action, with only contacts and owners marked. Offered: A (recommended), B leave all procedures to the operations owner. Rationale: each alert belongs to a designed failure path, so its first response is design. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§20.1 Common Operations](./16-operations-runbook.md#201-common-operations)

### OI-26 - One home for the payout deadline and the lookup timeout

**Question:** The 24-hour payout limit was stated 24 times in 9 chunks, and the 2 s lookup timeout three times in §17.2.

**Decision record, 2026-10-06:** Option A: the 24-hour number lives in §17.3 Create and send and the lookup timeout in §12 INT-03; every other mention names the rule. Offered: A (recommended), B keep the copies. Rationale: REFUNDS moved this number to one home after copies cost it ([REFUNDS 13 OI-30](../brd-refunds-portal/13-open-items-and-clarifications.md#oi-30-the-24-hour-payout-limit-is-stated-in-two-homes)). Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.3 Business Logic](./13c-service-payouts.md#business-logic)

### OI-27 - A late payout success and the card-paid cap

**Question:** A payout that succeeds after its request became Payout failed reaches the card, but under the v1.1 counting rule a Payout failed request no longer counts against the card-paid amount, so a later approval on the same receipt can pass the cap.

**Decision record, 2026-10-06:** Rejected through the standing answer for this run (reject a new item that adds business behaviour no BRD states). Option A counts the late-paid amount of a Payout failed request, which changes the counting rule the REFUNDS owner gave in v1.1 (Payout failed requests do not count). Offered: A (recommended) count the late-paid amount, B keep counting by status and add a cap check to §20.1.8, C ask the REFUNDS owner and leave it out until answered. Nothing was applied. Open remainder: whether money that a late success puts on the card counts against the card-paid amount is a question for the REFUNDS owner, to be answered with the R-15 follow-up; until then R-14 and §20.1.8 cover a late success.

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### OI-28 - One home for the card-paid amount left

**Question:** The counting rule and the scope of the purchase lock were stated in four sentences of §17.2.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: "the card-paid amount left" is defined once in Amounts, and Decision and the `purchase_lock` note refer to it. Offered: A (recommended), B keep the copies. Rationale: a rule its owner may change again needs one home; the request being approved is still Submitted when it is checked, so it is not among the amounts that count. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### OI-29 - The card-paid counting rule as a BRD follow-up

**Question:** The counting rule lives only in the SDD, so no UAT case of [REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md) tests it and the BAT sign-off does not cover it.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: risk R-15, owned by the REFUNDS owner, and Amounts cites it. Offered: A (recommended), B leave the follow-up in this register. Rationale: a money rule held only by the SDD is never tested at the gate the business signs; R-15 follows the R-09 pattern. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Settlement record (R3c), 2026-10-06:** [BO-04](../review-comments-tracker.md) and the REFUNDS owner test-fixture answer now have their rule home in REFUNDS v1.9, with REFUNDS/TC-REQ-24 and REFUNDS/TC-DEC-16 in [REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md). This supersedes the pending BRD and business-suite follow-up in the earlier decision record. R-15 now describes the implementation risk and current acceptance coverage, rather than an absent requirement or stale suite. OI-29 stays Accepted - applied. The tests are designed, not executed.

**Rule home:** [§4 Risks](./01-executive-summary-scope-risks.md#4-risks)

### OI-30 - The most approvable amount at step 4

**Question:** With Submitted requests no longer counted, the branch manager could confirm an amount at [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 4 that the approval then refuses.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: `maxApprovable` on the branch read of a Submitted request, the Decision text, and Figure 8 showing the purchase lock and the check. Offered: A (recommended), B the refusal as the only signal. Rationale: the read must carry the limit that the write enforces; the 422 covers an approval that commits in between. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### OI-31 - Staff personal data

**Question:** The v1.1 application put staff personal data (branch manager and cover contact details, staff ids, the Loyalty Administrator id) under the customer's and the member's contract.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: one home for staff data in §11.6, its lawful basis marked for the Data Protection Officer, and §17.2, §17.4, and §17.5 referring to it. Offered: A (recommended), B a staff basis in each module, C read "contract" as the employment contract. This supersedes the reading recorded in the Marker register entry "§17.2 refund-requests: lawful basis", which applied the basis to the branch manager contact details as well: the §17.2 basis now covers the customer data only. Rationale: GDPR Art. 6(1)(b) needs the data subject to be party to the contract. Open remainder: the staff lawful basis, marked in §11.6 for the Data Protection Officer, outside the gated chunks. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Settlement record (R3c), 2026-10-06:** [BO-05](../review-comments-tracker.md) supplies the Data Protection Officer-owned test-fixture answer at the existing Rule home. It supersedes the open staff-basis remainder in the earlier decision record, including the deciding branch manager id. OI-31 stays Accepted - applied. This records a fixture answer, not real DPO approval.

**Rule home:** [§11.6 Security](./07-cross-cutting-concerns.md#116-security-default)

### OI-32 - The 7-year unlinking as anonymisation

**Question:** After the 7-year obligation, unlinked refund records still held identifiers: the reference number, the purchase and payment references, actor and staff ids, and the audit columns.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: the unlinking clears every identifying column and keeps the branch, the statuses, the dates, and the amounts. Offered: A (recommended), B keep the identifiers and ask for a basis, C delete the rows at 7 years. Rationale: [REFUNDS 03 § Refund records](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-records) asks for a request no longer linked to its customer and keeps only amounts and dates, and the legal-obligation basis ends at 7 years. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.2 Retention Policy](./13b-service-refund-requests.md#retention-policy)

### OI-33 - Former-member history and waiting refunds

**Question:** Former-member history, and paid refunds waiting for their purchase (also those of customers who are not members), are processed without a current membership, outside the loyalty contract basis.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: §17.5 Compliance names both parts with a marker for the Data Protection Officer. Offered: A (recommended), B state that the program's terms cover the 24 months, C delete history when a member leaves and drop waiting refunds early. Rationale: neither part concerns a person in a running program contract, and refusing an earlier erasure needs a GDPR Art. 17(3) ground that only the Data Protection Officer can name. Open remainder: the marker in §17.5 Compliance, a gated chunk, keeps the e2e gate shut (E3) until the Data Protection Officer answers; the marker walk kept it because its answer is a legal basis from outside the design. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Decision record, 2026-10-06 (v1.2):** The first part of the open remainder is settled by the user's answer, given as a test-fixture value, not a decision taken by the Data Protection Officer: the lawful basis for former-member history and for paid refunds waiting for their purchase is legitimate interests (GDPR Art. 6(1)(f)), to settle refunds and complaints within the retention period; owner: the Data Protection Officer (LOYALTY/NFR-07) (§ Marker register, "§17.5 loyalty-points: lawful basis for former-member history and waiting refunds"). The answer does not name the GDPR Art. 17(3) ground for refusing an earlier erasure of former-member history, the second question of the marker, so that part stays marked. The item keeps its status, Accepted - applied.

**Decision record, 2026-10-06 (v1.2, marker walk):** The second part of the open remainder is settled by the user's answer, given as a test-fixture value under the standing answer for this run (a question only a person can answer, here a legal ground, is answered by the user with a plausible value and its owner), not a decision taken by the Data Protection Officer: an earlier erasure of former-member history is refused under GDPR Art. 17(3)(e), the establishment, exercise, or defence of legal claims, for the refunds and complaints settled within the retention period; owner: the Data Protection Officer (LOYALTY/NFR-07) (§ Marker register, "§17.5 loyalty-points: erasure ground for former-member history"). The marker is removed, and OI-33 has no open remainder left. The item keeps its status, Accepted - applied.

**Rule home:** [§17.5 Compliance](./13e-service-loyalty-points.md#compliance)

### OI-34 - Data subject requests

**Question:** The contract basis brings access and portability rights (GDPR Art. 15 and 20) that no procedure served.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: the §20.1.15 procedure with a reviewed read-only export query per module, referenced from §17.1, §17.2, and §17.5 Compliance. Offered: A (recommended), B a self-service export in both web apps, C leave the requests to the Data Protection Officer. Rationale: a one-month legal limit needs a prepared path, and B adds product scope that the BRDs deferred. Open remainder: the secure hand-over of export files, marked in §20.1.15, outside the gated chunks. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§20.1.15 Data Subject Request](./16-operations-runbook.md#20115-data-subject-request)

### OI-35 - Former-member history and the complaint path

**Question:** The legitimate interest named for former-member history is settling refunds and complaints, but no designed step reaches the history: a former member's refunds take nothing back, [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) E1 finds no former member, and LOYALTY decided that staff do not see earlier movements.

**Decision record, 2026-10-06:** Rejected through the standing answer for this run (reject a new item that adds business behaviour no BRD states). Its question closes only with a path from a complaint about a former membership to the history, business behaviour no BRD states, which LOYALTY decided not to add ("no flow is added"; the search finds only current members; LOYALTY decision log, OI-29). Offered: A (recommended) a marker for the LOYALTY owner and the Data Protection Officer, B a runbook read of former-member history for a complaint, C keep the text. Nothing was applied; §17.5 keeps the basis as the Data Protection Officer gave it. Open remainder: whether a complaint about a former membership needs a path to the history (the LOYALTY owner), and whether the legitimate-interests basis holds without one (the Data Protection Officer); an answer comes back as a new LOYALTY version or a decision of the Data Protection Officer.

**Rule home:** [§17.5 Compliance](./13e-service-loyalty-points.md#compliance)

### OI-36 - Purchases held for a former member

**Question:** Purchases reported while a person counts as a former member are held (HELD) so that a late rejoin notice can make them earn ([LOYALTY 03 § Membership end and data retention](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention); LOYALTY/NFR-03), but neither stated basis named them and the Retention Policy gave them no end.

**Decision record, 2026-10-06:** Adjusted: the two edits of Option A, with the user's answer in place of the marker that Option A adds, given as a test-fixture value under the standing answer for this run (a question only a person can answer, here a lawful basis, is answered by the user with a plausible value and its owner), not a decision taken by the Data Protection Officer: the lawful basis for holding purchases reported after a member left is legitimate interests (GDPR Art. 6(1)(f)), crediting the points of a purchase that a later rejoin notice makes count (LOYALTY/NFR-03); owner: the Data Protection Officer (LOYALTY/NFR-07). The Retention Policy now deletes purchases dated after a leave and before the next rejoin day with that leave's former-member history. Offered: A (recommended) a basis marker and the retention change, B drop purchases reported for a former member, C read the legitimate-interests sentence as covering held purchases. Rationale: holding is a BRD rule, so B is closed, and C would stretch an answer given for another purpose; the retention change gives held purchases the BRD's 24 months and clears the foreign key that blocked deleting the member row.

**Rule home:** [§17.5 Compliance](./13e-service-loyalty-points.md#compliance)

### OI-37 - Deleting unmatched refunds and overdue retention

**Question:** No job deleted the paid refunds that never find their purchase, a deletion that failed was only logged, and the jobs ran only for active tenants, while the new basis ends with the retention period.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: `waiting-refund-check` also deletes a refund still waiting at the end of its retention period, under the purchase lock; the `retention_overdue_rows` gauge with an alert 2 days after a period ends; the retention steps run for every tenant in the registry; and the §20.1.16 procedure. Offered: A (recommended), B a separate `refund-retention` job, C rely on the logs. Applied with the 24-month period referenced to the Retention Policy instead of restated, as OI-41 requires in the same update. Rationale: rows kept past their period have no basis (GDPR Art. 5(1)(e)), and the step belongs to the job that already owns waiting refunds and their lock; the 2-day threshold is a proposal for the operations owner. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.5 Business Logic](./13e-service-loyalty-points.md#business-logic)

### OI-38 - Access requests for the data kept under legitimate interests

**Question:** §20.1.15 found loyalty data only by member number and exported only the current membership, so former-member history and waiting refunds never reached an access answer, and access and portability were one export.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: step 1 also takes the customer's reference numbers from refund-requests, step 2 exports every membership still held and the waiting refunds that carry one of those references, and a portability file takes only the current membership. Offered: A (recommended), B keep the scope and tell the Data Protection Officer what is left out. Rationale: GDPR Art. 15 reaches all the personal data the module holds, portability covers only the contract part (Art. 20(1)(a)), and the REFUNDS reference number is the LOYALTY refund reference (§5 Glossary). Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§20.1.15 Data Subject Request](./16-operations-runbook.md#20115-data-subject-request)

### OI-39 - The right to object under legitimate interests

**Question:** The legitimate-interests basis brings a right to object (GDPR Art. 21(1)), restriction while an objection is decided (Art. 18(1)(d)), and the duty to tell people of the right (Art. 13(1)(d), 21(4)), and no procedure served them.

**Decision record, 2026-10-06:** Rejected through the standing answer for this run (reject a new item that adds business behaviour no BRD states). Option A carries out an upheld objection by deleting one member's former-member history or one waiting refund before its retention period ends, a rule no BRD states and against the LOYALTY rule that a deletion request does not shorten the period ([LOYALTY 03 § Membership end and data retention](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention)). Offered: A (recommended) an objection step in §20.1.15 with a reviewed delete script and a marker for restriction and the privacy information, B a self-service objection in both web apps, C leave objections outside the design. Nothing was applied. Open remainder: how objections to the keeping of former-member history and waiting refunds are received, decided, and carried out, how processing is restricted meanwhile, and where the privacy information names the interest and the right, for the Data Protection Officer (LOYALTY/NFR-07), with the LOYALTY owner for any change to the retention rule.

**Rule home:** [§20.1.15 Data Subject Request](./16-operations-runbook.md#20115-data-subject-request)

### OI-40 - Waiting refunds as personal data

**Question:** §17.5 gave waiting refunds a lawful basis while its personal-data sentence and its PII columns tied the module's data to a member number, so the identifying columns of a waiting refund were not masked outside production.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: the GDPR sentence names waiting refunds, and the PII columns list the identifying columns of purchases and refunds, with each purchase reference masked to the same value in every table. Offered: A (recommended), B keep both lists. Rationale: a lawful basis presumes personal data, the PII list drives masking, and §17.2 already masks the same reference values. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.5 Data Encryption](./13e-service-loyalty-points.md#data-encryption)

### OI-41 - One home for the former-member retention rule

**Question:** The 24-month rule with its deletion-request clause was stated five times, twice in the §17.5 GDPR bullet.

**Decision record, 2026-10-06:** Option A, the Recommended Answer: §17.5 Compliance and §16.8 refer to the Retention Policy, which keeps the rule with its BRD link. Offered: A (recommended), B keep the copies. Rationale: OI-26 and OI-28 applied one fact, one home to restated values. Decided by the user through the standing answer for this run (accept every Recommended Answer).

**Rule home:** [§17.5 Retention Policy](./13e-service-loyalty-points.md#retention-policy)

### OI-42 - The BRD link of §3 Assumption 7

**Question:** Once the Assumption 7 marker was answered, the answer sat in the sentence that ends with the [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) link, which states the Finance team's ownership of the Refunds Portal and nothing about delivery teams.

**Decision record, 2026-10-07:** Option A, the Recommended Answer: the link stays on the ownership that LOYALTY 02 states, and §3 Assumption 7 names the Head of Retail as owner of the assumption. Offered: A (recommended), B the link on the ownership only with no owner named, C no change. Rationale: every link holds what it cites, and whoever later checks the ADR-01 extraction trigger knows whom to ask; the tradeoff is a business role named in a technical assumption. Decided by the user through the fixed answers of this request (accept every Recommended Answer, except an item that adds business behaviour no BRD states).

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions)

### OI-43 - Keys and indexes of the take-back links

**Question:** Once the reconciliation keyed `points_movement.purchase_id`, the take-back's `points_movement.refund_id` and `refund_application.movement_id` still had no keys, Figure 27 drew neither link, and the foreign keys on the former-member deletion path had no index.

**Decision record, 2026-10-07:** Option A, the Recommended Answer: both take-back links are foreign keys drawn in Figure 27, five indexes, each starting with `tenant_id`, cover the referencing columns of the deletion path, and the Retention Policy states the deletion order. Offered: A (recommended), B drop `refund_application.movement_id` and key the rest, C keep the links without keys. Rationale: [LOYALTY 03 § Structure](../brd-loyalty-points/03-definitions-and-domain-concepts.md#structure) makes the refund the source of a Taken back movement, which [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) step 4 and A1 read from the movement, and the indexes keep the daily deletions from scanning the referencing tables; the tradeoff is two constraints and five indexes on the module's writes. Decided by the user through the fixed answers of this request.

**Rule home:** [§17.5 Tables Design](./13e-service-loyalty-points.md#tables-design)

### OI-44 - Kept refund applications and the former-member deletion

**Question:** With the OI-43 key on `refund_application.movement_id`, the deletion of an ended membership period fails, every night, when a refund application kept with a purchase of a later membership names a Taken back movement recorded in the ended period (the late-notice case in the chunk 18 Reviewer Notes).

**Decision record, 2026-10-07:** Option A, the Recommended Answer: before it deletes the period's movements, the deletion clears `movement_id` in each refund application it keeps that names one of them, and the column's null case says so. Offered: A (recommended), B move the movements of purchases dated on or after the rejoin day into the new period when a late notice lands, C a runbook step only. Rationale: the deletion completes within the 24 months of [LOYALTY 03 § Membership end and data retention](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention) with both keys in place, and nothing a member or the Loyalty Administrator sees changes; the tradeoff is a kept application that took points back but names no movement. Option B would repair the older late-notice case itself, which stays for the owner's review of §17.5. Decided by the user through the fixed answers of this request (accept every Recommended Answer, except an item that adds business behaviour no BRD states).

**Rule home:** [§17.5 Retention Policy](./13e-service-loyalty-points.md#retention-policy)

### OI-45 - The delivery form of API-07, API-08, and API-09

**Question:** §15.3 and §15.6 left open whether POS Records (API-07), the Customer Accounts team (API-08), and the Marketing team (API-09) deliver by a call, a file, or a feed, while §8.1.3, Figure 3, §11.6, §14.1, and §17.5 build on an inbound call through the gateway's provider routes, the External inbound type of §15.2.

**Decision record, 2026-10-07:** Option A, the Recommended Answer: §3 Assumption 8 states the delivery by call and what a provider that can deliver only a file or a feed would change, and the three §15.3 markers and §15.6 cells ask only how each provider calls. Offered: A (recommended), B a form-neutral body with a file or feed path `TBD - external`, C ask the three providers now and keep both texts until they answer. Rationale: §15.2 already types the three contracts External inbound and five chunks build on that form, so the open questions now match the design and the assumption shows what changes if a provider cannot call; neither option adds business behaviour, since [LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations) names each partner with the direction "We receive" and leaves the mechanism to the SDD; the tradeoff is a delivery form assumed before the providers' documentation confirms it. Decided by the user through the fixed answers of the v1.6 request (accept every Recommended Answer, except an item that adds business behaviour no BRD states). The chunk 19 faithfulness check of v1.6 raised it after the last review pass of that request, so it waited as Decided - pending application; the v1.7 request applied it before its other steps. Open remainder: none for the decision; the providers' documentation, asked for in the §15.6 rows of API-07, API-08, and API-09, confirms the call pattern, or refutes the assumption, which then needs the design change §3 Assumption 8 names.

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions) and [§15.6 External Contracts Awaiting the User](./11-api-contracts.md#156-external-contracts-awaiting-the-user)

### OI-46 - The API-09 documentation request

**Question:** After OI-45, the API-09 marker and its §15.6 row still asked the Marketing team for "format and fields" and "origin authentication" and named an "Opening balance file or feed specification", a form §3 Assumption 8 treats as a design change, while the API-09 block keeps the call's Method and URI, Version, Request headers, Responses, and Error codes `TBD`.

**Decision record, 2026-10-07:** Option A, the Recommended Answer: the marker and the §15.6 row ask for the call fields that API-07 and API-08 ask their providers for, and the document is an "Opening balance call specification". Offered: A (recommended), B rename the document only, C no edit. Rationale: the request now fits Assumption 8 and covers every API-09 row kept `TBD`, while B leaves five rows with no question and C keeps asking for the excluded form; no option adds business behaviour, since [LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations) leaves the mechanism to the SDD; the tradeoff is a full call contract asked of the Marketing team for a one-off delivery. Raised by the scoped check of the OI-45 application in v1.7 (review pass 1) and decided by the user through the fixed answers of this request (accept every Recommended Answer, except an item that adds business behaviour no BRD states).

**Rule home:** [§15.6 External Contracts Awaiting the User](./11-api-contracts.md#156-external-contracts-awaiting-the-user)

### OI-47 - A per-tenant credential for the API-09 provider route

**Question:** §3 Assumption 8 sends API-09 through a provider route, and §6, §11.2, §11.6, §15.1, and §17.5 take a provider route's tenant only from the caller's credential, but API-09 had no secret per tenant and no endpoint check, and §6 Secrets Management did not list the Marketing team among the provider credentials kept per tenant.

**Decision record, 2026-10-07:** Option A, the Recommended Answer: API-09 takes the per-tenant secret and the endpoint check of the other provider routes, and §6 Secrets Management lists the Marketing team for the points balances at go-live. Offered: A (recommended), B take the API-09 tenant from the request host, as public routes do, C no edit. Rationale: CLAUDE.md makes multi-tenancy non-negotiable (ADR-03), and the four provider routes now map their callers to a tenant one way, as ADR-03 provisions per retailer, while B adds a second tenant rule and lets one credential reach every tenant, and C leaves the contract silent on its tenant; no option adds business behaviour; the tradeoff is a secret per tenant to issue and rotate for a delivery made once. Raised by the scoped check of the OI-45 application in v1.7 (review pass 1) and decided by the user through the fixed answers of this request.

**Rule home:** [§15.3 API-09](./11-api-contracts.md#api-09-receive-opening-balances-points-balances-at-go-live---loyalty-points) and [§6 Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview)

## Marker register

The decision walk of 2026-10-06 offered the 51 markers left in chunks 10 to 13e (50 from generation, 1 added by OI-18). Of the first 50 entries below, 47 were settled and 3 settled in part (the Compliance markers of 13a, 13b, and 13e, whose lawful basis stays marked); the OI-18 counting rule stays marked (see the action entries). Settled by the user, who accepted every proposed answer of the decision walk (standing answer for this run). The last four entries (v1.1) settle the four markers that stayed, with the answers the user gave later as test-fixture values.

### §14.10 DTO fields of the in-process events

**Resolution (2026-10-06):** chunk 10. Offered: A (recommended) the fields each listener needs, with `tenantId` and `correlationId` in every DTO and the business dates the publisher computes, field types stated once under the table; B a snapshot of the whole aggregate; C ids only, read back through ports. Chosen: A. The ten DTOs are listed in §14.10 and repeated verbatim in the 13x tables.

**Rule home:** [§14.10 In-Process Domain Events](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)

### API-12 DTO fields

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) the account id in, the confirmed email address and mobile number of an active account out; B the whole account profile. Chosen: A.

**Rule home:** [API-12](./11-api-contracts.md#api-12-get-a-customers-contact-details-notifications---customer-accounts)

### API-12 errors

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) one typed error per outcome (`CustomerAccountNotFound`, `CustomerAccountClosed`, `PortAccessDenied`); B an empty result for an unknown or closed account. Chosen: A.

**Rule home:** [API-12](./11-api-contracts.md#api-12-get-a-customers-contact-details-notifications---customer-accounts)

### API-12 behaviour

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) read-only in its own read-only transaction; B join the caller's transaction. Chosen: A.

**Rule home:** [API-12](./11-api-contracts.md#api-12-get-a-customers-contact-details-notifications---customer-accounts)

### API-13 DTO fields

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) the branch and the branch-local date of the message in, the manager and any cover active on that date with their contact details out; B the recipients at the time of the call. Chosen: A.

**Rule home:** [API-13](./11-api-contracts.md#api-13-get-a-branchs-recipients-notifications---refund-requests)

### API-13 errors

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) `BranchNotFound`, `NoBranchRecipient`, and `PortAccessDenied`; B an empty list. Chosen: A.

**Rule home:** [API-13](./11-api-contracts.md#api-13-get-a-branchs-recipients-notifications---refund-requests)

### API-13 behaviour

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) read-only over the last synced branch assignments, never calling API-06; B a live API-06 call, a second hop. Chosen: A.

**Rule home:** [API-13](./11-api-contracts.md#api-13-get-a-branchs-recipients-notifications---refund-requests)

### API-14 DTO fields

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) one address per call with the idempotency key, the template, the code, and the shared deadline; B both addresses in one call. Chosen: A.

**Rule home:** [API-14](./11-api-contracts.md#api-14-send-a-message-now-customer-accounts---notifications)

### API-14 errors

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) `NotificationPartnerUnavailable` ([REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) E3), `InvalidDestination`, and `PortAccessDenied`; B one generic failure. Chosen: A.

**Rule home:** [API-14](./11-api-contracts.md#api-14-send-a-message-now-customer-accounts---notifications)

### API-14 behaviour

**Resolution (2026-10-06):** chunk 11. Offered: A (recommended) idempotent on the key, in its own transaction that records the outcome, ended by the deadline inside its bulkhead; B join the caller's transaction, which would hold a transaction open across a provider call (§8.1.1). Chosen: A.

**Rule home:** [API-14](./11-api-contracts.md#api-14-send-a-message-now-customer-accounts---notifications)

### §16.2 enforcement point of the authorization rules

**Resolution (2026-10-06):** chunk 12, with the ADR-08 marker of chunk 06. Offered: A (recommended) the gateway checks the token only, and each module checks the permission token through its seeded role permissions and runs the contextual gates; B role checks at the gateway; C a policy engine. Chosen: A. ADR-08 became Accepted and carries the rationale.

**Rule home:** [§16.2 Resolution Model](./12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action)

### §16.11 permission token naming

**Resolution (2026-10-06):** chunk 12. Offered: A (recommended) keep `[module].[resource].[action]`, with `-own` for actions on the caller's own records; B scopes without the module prefix. Chosen: A.

**Rule home:** [§16.11 Permission × Role Matrix](./12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide)

### §16.12.1 seed of the role permissions

**Resolution (2026-10-06):** chunk 12. Offered: A (recommended) a versioned Flyway seed per module, the realm export for the realm roles, and an integration test that compares both with §16.11; B the realm export only, with the mapping in code; C a fixture loaded at start. Chosen: A; ADR-03 provisioning gained the seed.

**Rule home:** [§16.12.1 Seed Strategy](./12-centralized-user-roles.md#16121-seed-strategy)

### §17.1 customer-accounts: boundary

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) confirm the boundary as written: the module owns accounts, sign-ups, resets, codes, and the linked-request count, and Keycloak owns credentials and sessions; B move the linked-request count into refund-requests. Chosen: A.

**Rule home:** [§17.1 Boundaries](./13a-service-customer-accounts.md#boundaries)

### §17.1 customer-accounts: step 6 sign-in

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) the confirmation carries the password once more and the module obtains the first token set through the confidential client `refunds-platform-sign-in`, the only client with direct access grants, never storing the password; B send the customer to the Keycloak sign-in page after confirmation, which asks for the password again; C a custom Keycloak authenticator. Chosen: A, so [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) step 6 signs the customer in at once; ADR-07 and Figure 9 state the client.

**Rule home:** [§17.1 Business Logic](./13a-service-customer-accounts.md#business-logic)

### §17.1 customer-accounts: DB model

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) seven tables (account, sign-up, password reset, confirmation code, and the common role permission, inbox, and idempotency tables) with retention per table; B one table holding sign-ups and accounts. Chosen: A.

**Rule home:** [§17.1 Entity Relationship](./13a-service-customer-accounts.md#entity-relationship)

### §17.1 customer-accounts: tenancy override

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) no override: the shared schema with `tenant_id`, PostgreSQL, and the §11.4 instrumentation; B a module-specific override. Chosen: A.

**Rule home:** [§17.1 Multi-Tenancy Specifications](./13a-service-customer-accounts.md#multi-tenancy-specifications)

### §17.1 customer-accounts: request and response fields

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) the field table of the six endpoints, the token set returned at confirmation and reset; B leave the fields to the OpenAPI spec. Chosen: A.

**Rule home:** [§17.1 List of APIs](./13a-service-customer-accounts.md#list-of-apis-swagger-friendly)

### §17.1 customer-accounts: retry and poison-message strategy

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) listener runs retried by `publication-resubmit` and parked after 10 failed runs with an alert, jobs working one account per transaction; B retry without limit. Chosen: A.

**Rule home:** [§17.1 Error Handling](./13a-service-customer-accounts.md#error-handling)

### §17.1 customer-accounts: module metrics

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) six metrics for sign-ups, codes, code checks, waits, closures, and reconciliation fixes; B the §11.4 defaults only. Chosen: A.

**Rule home:** [§17.1 Metrics](./13a-service-customer-accounts.md#metrics)

### §17.1 customer-accounts: compliance

**Resolution (2026-10-06):** chunk 13a. Offered: A (recommended) the GDPR applies, with the closure rule as retention and erasure, PCI-DSS not applicable, and the §11.6 controls, keeping the lawful basis marked; B leave the whole sub-section to the Data Protection Officer. Chosen: A. Settled in part: the lawful basis needs a legal decision, so its marker stays, owned by the Data Protection Officer (LOYALTY/NFR-07).

**Rule home:** [§17.1 Compliance](./13a-service-customer-accounts.md#compliance)

### §17.2 refund-requests: boundary

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) confirm the boundary as written: the module owns the request lifecycle, the branch scope, and the items notices, payouts owns the money movement, and notifications owns every message; B move the branch assignments into a module of their own. Chosen: A.

**Rule home:** [§17.2 Boundaries](./13b-service-refund-requests.md#boundaries)

### §17.2 refund-requests: state machine

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) the figure is the persisted status model: decisions and cancellations update only from Submitted at the version the caller read, and the payout listeners update only from Approved; B a separate status table with a workflow engine. Chosen: A.

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### §17.2 refund-requests: DB model

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) thirteen tables with the item lock, the purchase lock, the items notice state, the branch data, and the common tables, with retention per table; B a document column for items and history. Chosen: A.

**Rule home:** [§17.2 Entity Relationship](./13b-service-refund-requests.md#entity-relationship)

### §17.2 refund-requests: tenancy override

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) no override: the shared schema with `tenant_id`, PostgreSQL, and the §11.4 instrumentation; B a module-specific override. Chosen: A.

**Rule home:** [§17.2 Multi-Tenancy Specifications](./13b-service-refund-requests.md#multi-tenancy-specifications)

### §17.2 refund-requests: request and response fields

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) the field table of the nine endpoints, with versions for the race between a cancellation and a decision; B leave the fields to the OpenAPI spec. Chosen: A.

**Rule home:** [§17.2 List of APIs](./13b-service-refund-requests.md#list-of-apis-swagger-friendly)

### §17.2 refund-requests: retry and poison-message strategy

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) listener runs parked after 10 failed runs, the `items-notice-send` job retrying from 1 minute doubling to at most 30 minutes until POS Records acknowledges, the branch refresh keeping its last copy, and other jobs working one item per transaction; B a give-up limit for items notices. Chosen: A.

**Rule home:** [§17.2 Error Handling](./13b-service-refund-requests.md#error-handling)

### §17.2 refund-requests: module metrics

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) seven metrics for lookups, transitions, branch waits, items notices, and assignment age; B the §11.4 defaults only. Chosen: A.

**Rule home:** [§17.2 Metrics](./13b-service-refund-requests.md#metrics)

### §17.2 refund-requests: compliance

**Resolution (2026-10-06):** chunk 13b. Offered: A (recommended) the GDPR applies, with the 7-year rule and unlinking as retention and erasure, PCI-DSS not applicable, and the §11.6 controls, keeping the lawful basis marked; B leave the whole sub-section to the Data Protection Officer. Chosen: A. Settled in part: the lawful basis stays marked, owned by the Data Protection Officer (LOYALTY/NFR-07).

**Rule home:** [§17.2 Compliance](./13b-service-refund-requests.md#compliance)

### §17.3 payouts: boundary

**Resolution (2026-10-06):** chunk 13c. Offered: A (recommended) confirm the boundary as written, adding that no other module calls the Payment Provider; B let refund-requests call the provider directly. Chosen: A.

**Rule home:** [§17.3 Boundaries](./13c-service-payouts.md#boundaries)

### §17.3 payouts: state machine

**Resolution (2026-10-06):** chunk 13c. Offered: A (recommended) the persisted payout model: an unknown outcome resends the open attempt with the same key, a definitive refusal returns the payout to Pending, and the payout deadline ends a Pending or Sent payout Failed, a later success being the late success of R-14; B a payout still Sent at the deadline waits for its outcome before it fails. Chosen: A, which keeps the limit of [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1.

**Rule home:** [§17.3 Business Logic](./13c-service-payouts.md#business-logic)

### §17.3 payouts: DB model

**Resolution (2026-10-06):** chunk 13c. Offered: A (recommended) payout, attempt, and result tables plus the inbox, with at most one open attempt per payout and the provider result kept as an opaque payload for audit; B one payout table with the attempts in a document column. Chosen: A.

**Rule home:** [§17.3 Entity Relationship](./13c-service-payouts.md#entity-relationship)

### §17.3 payouts: tenancy override

**Resolution (2026-10-06):** chunk 13c. Offered: A (recommended) no override: the shared schema with `tenant_id`, PostgreSQL, and the §11.4 instrumentation; B a module-specific override. Chosen: A.

**Rule home:** [§17.3 Multi-Tenancy Specifications](./13c-service-payouts.md#multi-tenancy-specifications)

### §17.3 payouts: retry and poison-message strategy

**Resolution (2026-10-06):** chunk 13c. Offered: A (recommended) the `payout-retry` job spacing tries from 5 minutes, doubling to at most 30 minutes, until the payout deadline, each call bounded by the INT-01 timeout, a circuit breaker at 50% of the last 20 calls with a trial after 60 seconds, and listener runs parked after 10 failed runs; B a 2-hour cap between tries, which can miss the last hour of the deadline that REFUNDS/TC-DEC-09 of [REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md) exercises. Chosen: A.

**Rule home:** [§17.3 Error Handling](./13c-service-payouts.md#error-handling)

### §17.3 payouts: module metrics

**Resolution (2026-10-06):** chunk 13c. Offered: A (recommended) six metrics for payouts, tries, open payouts, time to the deadline, late successes, and results; B the §11.4 defaults only. Chosen: A.

**Rule home:** [§17.3 Metrics](./13c-service-payouts.md#metrics)

### §17.3 payouts: compliance

**Resolution (2026-10-06):** chunk 13c. Offered: A (recommended) the GDPR applies through pseudonymous data only, with 7-year retention, under the lawful basis recorded for the refund request data, PCI-DSS not applicable; B a lawful basis question of its own. Chosen: A; fully settled.

**Rule home:** [§17.3 Compliance](./13c-service-payouts.md#compliance)

### §17.4 notifications: boundary

**Resolution (2026-10-06):** chunk 13d. Offered: A (recommended) confirm the boundary: delivery and templates only, no stored contact details or message bodies, with template parameters kept until a message ends; B store the rendered message bodies. Chosen: A.

**Rule home:** [§17.4 Boundaries](./13d-service-notifications.md#boundaries)

### §17.4 notifications: DB model

**Resolution (2026-10-06):** chunk 13d. Offered: A (recommended) one message table keyed by the message key, plus the role permission and inbox tables, the parameters cleared when a message ends and rows deleted 90 days later; B a log per channel. Chosen: A. §11.1 now allows template parameters of a waiting message as a JSON column.

**Rule home:** [§17.4 Entity Relationship](./13d-service-notifications.md#entity-relationship)

### §17.4 notifications: tenancy override

**Resolution (2026-10-06):** chunk 13d. Offered: A (recommended) no override: the shared schema with `tenant_id`, PostgreSQL, and the §11.4 instrumentation; B a module-specific override. Chosen: A.

**Rule home:** [§17.4 Multi-Tenancy Specifications](./13d-service-notifications.md#multi-tenancy-specifications)

### §17.4 notifications: retry and poison-message strategy

**Resolution (2026-10-06):** chunk 13d. Offered: A (recommended) listener runs parked after 10 failed runs, the `message-send` job retrying from 1 minute doubling to at most 30 minutes, and a give-up 24 hours after the first try that marks the message failed with an alert; B no give-up limit. Chosen: A. The give-up limit lives in §12 INT-02, which also clears the INT-02 give-up marker of chunk 08.

**Rule home:** [§17.4 Error Handling](./13d-service-notifications.md#error-handling)

### §17.4 notifications: module metrics

**Resolution (2026-10-06):** chunk 13d. Offered: A (recommended) six metrics for messages, pending messages and their age, code sends, partner call time, and bulkhead rejections; B the §11.4 defaults only. Chosen: A.

**Rule home:** [§17.4 Metrics](./13d-service-notifications.md#metrics)

### §17.4 notifications: compliance

**Resolution (2026-10-06):** chunk 13d. Offered: A (recommended) the GDPR applies to addresses in transit and to pending parameters, with 90-day retention, under the lawful basis recorded for the contact and refund request data, PCI-DSS not applicable; B a lawful basis question of its own. Chosen: A; fully settled.

**Rule home:** [§17.4 Compliance](./13d-service-notifications.md#compliance)

### §17.5 loyalty-points: boundary

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) confirm the boundary: the module owns the ledger and the membership state it is told about, and refund-requests owns the refund facts it sends; B read refunds from refund-requests on demand. Chosen: A.

**Rule home:** [§17.5 Boundaries](./13e-service-loyalty-points.md#boundaries)

### §17.5 loyalty-points: state machine

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) the persisted membership model: one row per membership period, first-sight rules for purchases, opening balances, sign-ins, and notices, a rejoin opening a new period, and notices applied in date order; B the latest notice wins by arrival. Chosen: A.

**Rule home:** [§17.5 Business Logic](./13e-service-loyalty-points.md#business-logic)

### §17.5 loyalty-points: DB model

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) thirteen tables for members, periods, notices, purchases, refunds and their applications, movements, balances, import runs, the purchase lock, and the common tables, with retention per table; B a movement table only, with balances summed at read time. Chosen: A.

**Rule home:** [§17.5 Entity Relationship](./13e-service-loyalty-points.md#entity-relationship)

### §17.5 loyalty-points: tenancy override

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) no override: the shared schema with `tenant_id`, PostgreSQL, and the §11.4 instrumentation; B a module-specific override. Chosen: A.

**Rule home:** [§17.5 Multi-Tenancy Specifications](./13e-service-loyalty-points.md#multi-tenancy-specifications)

### §17.5 loyalty-points: request and response fields

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) the field table of the six endpoints, with the two correction kinds; B leave the fields to the OpenAPI spec. Chosen: A.

**Rule home:** [§17.5 List of APIs](./13e-service-loyalty-points.md#list-of-apis-swagger-friendly)

### §17.5 loyalty-points: retry and poison-message strategy

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) listener runs parked after 10 failed runs, feed records that cannot be applied answered with an error so the sender retries, and jobs working one member or refund per transaction; B accept and drop feed records that fail. Chosen: A.

**Rule home:** [§17.5 Error Handling](./13e-service-loyalty-points.md#error-handling)

### §17.5 loyalty-points: module metrics

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) seven metrics for movements, purchase reports, feed lag, waiting refunds, balance mismatches, and read times, with a daily `balance-invariant-check` job; B the §11.4 defaults only. Chosen: A.

**Rule home:** [§17.5 Metrics](./13e-service-loyalty-points.md#metrics)

### §17.5 loyalty-points: compliance

**Resolution (2026-10-06):** chunk 13e. Offered: A (recommended) the GDPR applies, with the 24-month rule as retention and erasure and members' own views as access, PCI-DSS not applicable, keeping the lawful basis marked; B leave the whole sub-section to the Data Protection Officer. Chosen: A. Settled in part: the lawful basis stays marked, owned by the Data Protection Officer (LOYALTY/NFR-07).

**Rule home:** [§17.5 Compliance](./13e-service-loyalty-points.md#compliance)

### §17.1 customer-accounts: lawful basis

**Resolution (2026-10-06, v1.1):** chunk 13a. Settled by the user with a test-fixture value, not a decision taken by the Data Protection Officer: contract (GDPR Art. 6(1)(b)) for the account and sign-in; owner: the Data Protection Officer (LOYALTY/NFR-07). It completes the entry "§17.1 customer-accounts: compliance", settled in part; the marker is removed.

**Rule home:** [§17.1 Compliance](./13a-service-customer-accounts.md#compliance)

### §17.2 refund-requests: lawful basis

**Resolution (2026-10-06, v1.1):** chunk 13b. Settled by the user with a test-fixture value, not a decision taken by the Data Protection Officer: contract (GDPR Art. 6(1)(b)) for handling a refund request, and legal obligation (GDPR Art. 6(1)(c)) for keeping refund records 7 years ([REFUNDS 03 § Refund records](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-records)); owner: the Data Protection Officer (LOYALTY/NFR-07). Applied as the basis of all the module's processing that the marker named, the customer link, the free-text reasons, and the branch manager contact details. It completes the entry "§17.2 refund-requests: compliance", settled in part; the marker is removed. §17.3 and §17.4 Compliance already refer to this basis and are unchanged.

**Rule home:** [§17.2 Compliance](./13b-service-refund-requests.md#compliance)

### §17.5 loyalty-points: lawful basis

**Resolution (2026-10-06, v1.1):** chunk 13e. Settled by the user with a test-fixture value, not a decision taken by the Data Protection Officer: contract (GDPR Art. 6(1)(b)) under the loyalty program's terms; owner: the Data Protection Officer (LOYALTY/NFR-07). It completes the entry "§17.5 loyalty-points: compliance", settled in part; the marker is removed.

**Rule home:** [§17.5 Compliance](./13e-service-loyalty-points.md#compliance)

### §17.2 refund-requests: card-paid counting rule

**Resolution (2026-10-06, v1.1):** chunk 13b. Settled by the user with a test-fixture value: only Approved and Paid refund amounts count against a purchase's card-paid amount; Rejected, Cancelled, and Payout failed requests do not; owner: the REFUNDS owner. It answers the open remainder of OI-18 ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-4: refund capped at the card-paid amount). Read with "only", a Submitted request does not count either. Because Submitted requests no longer count when a request is submitted, BR-4 is also enforced at the approval: an approval takes the purchase lock, which cancellations no longer need, and an amount above the card-paid amount left is refused with the most that can still be approved, so the branch manager approves at most that amount (A1) or rejects (A2); the error is 422 `CARD_PAID_AMOUNT_EXCEEDED`. The marker is removed. Follow-up for the REFUNDS owner: the rule is not in the BRD; it belongs in [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-4 in a later REFUNDS version.

**Rule home:** [§17.2 Business Logic](./13b-service-refund-requests.md#business-logic)

### §17.5 loyalty-points: lawful basis for former-member history and waiting refunds

**Resolution (2026-10-06, v1.2):** chunk 13e. Settled in part by the user with a test-fixture value, not a decision taken by the Data Protection Officer: the lawful basis for keeping former-member history and paid refunds waiting for their purchase is legitimate interests (GDPR Art. 6(1)(f)), to settle refunds and complaints within the retention period; owner: the Data Protection Officer (LOYALTY/NFR-07). It answers the first question of the marker that OI-33 added; applied as design text in §17.5 Compliance. The marker's second question, the GDPR Art. 17(3) ground for refusing an earlier erasure of former-member history, is not answered by it; it stays marked, and a legal ground is not proposed by the skill (step 8 item 6).

**Rule home:** [§17.5 Compliance](./13e-service-loyalty-points.md#compliance)

### §17.5 loyalty-points: erasure ground for former-member history

**Resolution (2026-10-06, v1.2):** chunk 13e, in the marker walk after the delta review. The skill proposed no value, because the answer is a legal ground from outside the design, and named its owner; the user then answered it with a test-fixture value under the standing answer for this run, not a decision taken by the Data Protection Officer: an earlier erasure of former-member history is refused under GDPR Art. 17(3)(e), the establishment, exercise, or defence of legal claims, for the refunds and complaints settled within the retention period; owner: the Data Protection Officer (LOYALTY/NFR-07). It completes the entry "§17.5 loyalty-points: lawful basis for former-member history and waiting refunds", settled in part; applied as design text in §17.5 Compliance, and the marker is removed.

**Rule home:** [§17.5 Compliance](./13e-service-loyalty-points.md#compliance)

### §12 INT-05 - Staff directory source settled by business review

**Question:** Which existing source holds the branch manager, cover dates and staff contact details?

**Decision record (R3c), 2026-10-06:** [BO-03](../review-comments-tracker.md), confirmed by the REFUNDS owner under the test-fixture policy. The named Retail IT source in [REFUNDS 08](../brd-refunds-portal/08-integrations.md#integrations) answers the marker removed by the review. The standing recommended answer is accepted; the alternative was to leave the source question open. It clarifies the existing staff dependency without staff administration behavior. API-06 and API-11 provider-owned contract fields remain TBD - external.

**Rule home:** [§12 INT-05](./08-integrations.md#12-integrations)

### §11.6 - Staff personal-data basis settled by business review

**Question:** What basis covers the existing employee data, including the deciding branch manager id?

**Decision record (R3c), 2026-10-06:** [BO-05](../review-comments-tracker.md), a test-fixture answer owned by the Data Protection Officer under the user's fixed policy. The review applied the named owner's fixture value at the Rule home and removed the marker. The recommended answer is accepted; the alternative was to keep the owner question marked. The value concerns existing processing only. The OI-31 settlement above supersedes the unanswered remainder. No real DPO approval is asserted.

**Rule home:** [§11.6 Security](./07-cross-cutting-concerns.md#116-security-default)

### §3 Assumption 7 - one delivery team for both products

**Resolution (2026-10-07, v1.6):** chunk 01. Settled by the user with a test-fixture answer, not a decision taken by the Head of Retail: confirmed, the Finance team has no delivery team of its own for the Refunds Portal, and one delivery team builds both products; owner: the Head of Retail. It answers the open remainder of OI-02. Applied as design text in §3 Assumption 7, with the matching wording in §1 (Key technical bets) and the ADR-01 Why; the marker is removed. OI-42 then kept the [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) link on the ownership it states and named the Head of Retail as owner of the assumption. The ADR-01 extraction trigger ("a second team takes over one product's modules") is therefore not met at the start, and ADR-01 and ADR-02 stand.

**Open remainder:** None.

**Rule home:** [§3 Assumptions](./01-executive-summary-scope-risks.md#3-assumptions)

### §5 Receipt number and purchase reference - one purchase identifier (R-08)

**Resolution (2026-10-07, v1.6):** chunk 01. Settled by the user with a test-fixture answer, not a decision taken by the POS Records owner: confirmed, the receipt number a customer enters and the purchase reference POS Records reports for loyalty identify the same purchase; owner: the POS Records owner, the Retail IT team per [REFUNDS 08](../brd-refunds-portal/08-integrations.md#integrations). Applied as design text in the §5 Glossary row and in the §4 R-08 Mitigation; the marker is removed. The take-back of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: take back on paid refunds, which matches `RefundPaidDto.purchaseReference` (taken from API-01) against the API-07 purchases (§17.5), needs no other change.

**Open remainder:** None for this question. Still open elsewhere, unchanged by this answer: R-10, the one owner of POS Records across [REFUNDS 08](../brd-refunds-portal/08-integrations.md#integrations) (Retail IT team) and [LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations) (Store Operations team), marked in §12 INT-03 for the REFUNDS and LOYALTY owners; the R-08 risk owner, marked in §4; and whether the API-01 answer carries the purchase reference, a provider contract field kept `TBD - external` in §15.3 API-01.

**Rule home:** [§5 Glossary](./01-executive-summary-scope-risks.md#5-glossary)

## Business review register

### BO-01 - Corrections cannot count distinct upheld complaints

**Decision record, 2026-10-06:** Option A applied across the ledger report description and NFR mapping. The existing correction report continues to list corrections only. The external, owner-held complaint tally is the business measure from the reviewed LOYALTY requirement, a test-fixture clarification owned by LOYALTY. This replaces the implicit use of corrections as complaint evidence; no endpoint, event, database column or contract registry changes. Delivery and E2E evidence refresh through the owning hand-offs. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).

**Rule home:** [17.5 / Business Logic](./13e-service-loyalty-points.md#business-logic) and [18.5 / NFR targets](./14-performance-and-capacity.md#185-nfr-targets)


### BO-02 - Refund averages lack denominators and empty-sample rules

**Decision record, 2026-10-06:** Option A applied. The refund report reconstructs the previous-day as-of state from timestamps; its decision and payment samples match REFUNDS 09. Its existing decimal average fields explicitly allow null on an empty sample. This replaces unspecified sample/empty-value behavior, with no response field, route or report added. The LLD and E2E design stay untouched pending the owning hand-offs. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).

**Rule home:** [17.2 / Business Logic](./13b-service-refund-requests.md#business-logic) and [17.2 / Request and response fields](./13b-service-refund-requests.md#list-of-apis-swagger-friendly)


### BO-03 - Staff access is absent from REFUNDS dependency and integration tables

**Decision record, 2026-10-06:** Option A applied with the REFUNDS owner test-fixture source answer. The answered INT-05 source marker is removed: the Retail IT staff sign-in serves both products and its staff directory owns the branch, cover dates and contact details. This replaces the unresolved source question only. API-06 and API-11 remain TBD - external until real provider documentation is supplied; protocols, credentials and payloads are not invented. No owner open-item status is edited by the review. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).

**Rule home:** [12 / INT-05](./08-integrations.md#12-integrations)


### BO-04 - Card-paid counting rule lacks a BRD requirement and acceptance evidence

**Decision record, 2026-10-06:** Option A applied. The already settled REFUNDS owner fixture counting rule now has its source home in [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-4. Amounts no longer calls it absent from the BRD, and R-15 now describes only the still-pending business acceptance refresh. This supersedes OI-29's pending BRD-source follow-up while preserving its earlier record and owner item status. No cap arithmetic, API, event, permission, late-success policy or transaction behavior changes. The BRD owner refreshes acceptance evidence and the SDD owner closes the answered part of OI-29. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).

**Rule home:** [4 / R-15](./01-executive-summary-scope-risks.md#4-risks) and [17.2 / Business Logic](./13b-service-refund-requests.md#business-logic)


### BO-05 - Staff personal-data basis remains an unanswered owner question

**Decision record, 2026-10-06:** Option A accepted with the user's standing person-only answer policy. Test-fixture value, owner the Data Protection Officer: the existing staff data processing uses legitimate interests (GDPR Art. 6(1)(f)) for branch work, operational messages and accountability for decisions and corrections; the deciding manager id uses that staff basis rather than an assumed customer refund-record legal obligation. The value replaces the exact staff-basis marker in §11.6 and answers OI-31's remaining basis question. It is a fictional owner answer for this run, not legal advice, a real DPO decision or a launch approval. Retention and permissions stay as designed. OI-31's historical record and status stay unchanged; its owner closes the answered remainder in R3c. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).

**Rule home:** [11.6 / Staff personal data](./07-cross-cutting-concerns.md#116-security-default)


### SME-05 - Branch-settled refunds leave loyalty points unchanged

**Decision record, 2026-10-06:** The panel recommendation to consume branch-settlement refund facts is Rejected: out of scope for this release (test-fixture policy), owning item LOYALTY OI-38. R-09 already documents the gap and remains unchanged. This decision records why the current portal-paid RefundPaid source is retained; it does not replace the take-back rule or any previous rejection. No new event, adapter, endpoint or settlement workflow is designed. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).

**Rule home:** [4 / R-09](./01-executive-summary-scope-risks.md#4-risks)


## Walkthrough and delegation history

### Action entries

**Intake, 2026-10-06:** Arguments `chunks whole`: CHUNKS mode, generation `whole`. No SDD folder existed, so no resume. Intent derive-from-BRD from two chunked BRDs, one SDD with two parents. Both BRD masters show a finished whole generation. Both covers show Status `In Review`, not `Approved`; the user was asked once and chose to derive from both (recommended: yes). Keys proposed and kept: REFUNDS for `brd-refunds-portal`, LOYALTY for `brd-loyalty-points`. Project Type asked: Greenfield (recommended; no BRD names an existing codebase this system extends). Technical inputs: [REFUNDS 12 TI-01](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) and [REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd); LOYALTY states none. No legacy BRD sections.

**Cross-BRD reconciliation, 2026-10-06:** No conflicting technical mandates, so no question was asked before the questionnaire. Overlaps found and where they land: Customer and Member stay two actors ([§7.1](./03-users-and-use-cases.md#71-actors), R-12); Branch Manager and Loyalty Administrator stay two actors; one POS Records partner with two owners ([INT-03](./08-integrations.md#12-integrations), R-10); branch manager access and staff sign-in as one partner to confirm ([INT-05](./08-integrations.md#12-integrations)); receipt number and purchase reference ([§5](./01-executive-summary-scope-risks.md#5-glossary), R-08); reference number and refund reference ([§5](./01-executive-summary-scope-risks.md#5-glossary)); availability and performance measured per BRD scope ([§18.5](./14-performance-and-capacity.md#185-nfr-targets)); the paid-refund dependency of LOYALTY on REFUNDS designed in process ([§8.4.2](./05-workflows-and-sequences.md#842-workflow-points-from-purchases-and-paid-refunds)); refunds settled at a branch keep their points (R-09).

**Questionnaire and ecosystem, 2026-10-06:** Both shown as one table and accepted with Accept all.

**Decomposition, 2026-10-06:** The use-case to module mapping was clean, so no confirmation question was asked; the five modules are listed as a derivation assumption in the handoff.

**Post-generation review, 2026-10-06:** A cleared-context reviewer subagent read chunks 00 to 17 against both BRDs and the templates and wrote chunk 18: 26 open items (OI-01 to OI-26), each with options, a Recommended Answer, and a Why, and a coverage record over the 16 risk surfaces of the brief. No author items were appended: the two BRDs share no use case behaviour, and every designed behaviour traces to a BRD use case, a BRD rule or report section, or platform behaviour with no business use case.

**Standing answers, 2026-10-06:** Before the run the user gave standing answers for every decision of this build: accept every Recommended Answer of the open items, except a new item that adds business behaviour no BRD states, which is rejected as out of scope; accept every proposed answer of the marker walk; resolve BRD conflicts with the recommended resolution; keep external contracts `TBD - external`; no Miro board.

**Open items loop, 2026-10-06:** The 26 items were presented in batches with their Recommended Answers and Whys. 25 were accepted and applied to chunks 01 to 16; OI-22 was rejected as out of scope (its answer adds an acceptance step and closed member routes no BRD states). Back-fills that the accepted answers made necessary: the §14.7 doctrine wording, the listener and Input tables of 13a to 13e, and Figure 7. Step 6a was rerun after the changes to chunks 09 to 13e.

**Marker walk, 2026-10-06:** The 51 gate-blocking markers of chunks 10, 11, 12, and 13a to 13e were offered in batches, each with options, a Recommended Answer, and its Why; none was in chunk 09 or §7.3. 47 were settled and 3 settled in part (Marker register). Kept, because the answer must come from outside the design: the lawful basis in §17.1, §17.2, and §17.5 Compliance (owner: the Data Protection Officer, LOYALTY/NFR-07), and whether a Rejected or Payout failed request counts against the card-paid amount in §17.2 Amounts (owner: the REFUNDS owner). ADR-08 became Accepted. Changes outside the gated chunks that the answers required: ADR-03 provisioning, ADR-07 How, Figure 9, the §11.1 JSON and common-table rules, the §12 INT-02 give-up limit, the §15.1 infrastructure note, the §13 Input and Integrations cells, and the §20.1.3 marker wording. Step 6a was rerun: no finding.

**E2E gate check, 2026-10-06:** E1 met (25 Accepted - applied, 1 Rejected, none Open or Deferred); E2 met (no row in §14.8, §15.5, or §16.12.3); E4 met (step 6a rerun after the last change). E3 not met: 4 markers remain in chunks 13a, 13b, and 13e. Chunk 19 was not written; the master shows the gate Locked.

**Marker answers (v1.1), 2026-10-06:** The user gave the answers to the four markers that kept E3 unmet, each as a test-fixture value (Marker register, last four entries). Applied as design text in §17.1, §17.2, and §17.5 Compliance and §17.2 Amounts, and the markers removed. Back-fill the counting rule needs, all in 13b: the approval-time cap check in Decision, the `purchase_lock` note, the `DecisionRequest` amount constraint, the `CARD_PAID_AMOUNT_EXCEEDED` error, and the test note. Version 1.1 opened with its Changes Log row. Child LLDs check: no LLD exists next to this SDD; the table stays `None yet`. Step 6a rerun after the change: no finding (events, listeners, and DTOs from both sides; permission tokens; API IDs; §7.3 against its homes; every link and anchor; the 13b data model).

**Delta review (v1.1), 2026-10-06:** A cleared-context reviewer subagent read chunk 18 first, then reviewed chunks 13a, 13b, and 13e against the change behind v1.1 (the four marker answers and the 13b back-fill), and wrote OI-27 to OI-34 and one delta coverage row per changed chunk into chunk 18. No author item was appended: the counting rule is the only behaviour no BRD states, and OI-29 carries its BRD follow-up.

**Open items loop (v1.1), 2026-10-06:** The 8 items were presented in two batches of 4, each with its Recommended Answer and Why, and decided with the standing answers of this run (accept every Recommended Answer, reject a new item that adds business behaviour no BRD states): OI-28 to OI-34 accepted and applied to chunks 01, 05, 07, 13a, 13b, 13d, 13e, and 16; OI-27 rejected. Step 6a rerun after the changes to 13b, 13d, and 13e: no contract, traceability, or data-model finding.

**Marker walk (v1.1), 2026-10-06:** One gate-blocking marker is left, added by OI-33 in §17.5 Compliance. Its answer is a legal basis and a GDPR Art. 17(3) ground from the Data Protection Officer, so no value was proposed and the marker stays. The markers that OI-31 and OI-34 added (§11.6, §20.1.15) are outside the gated chunks.

**E2E gate check (v1.1), 2026-10-06:** E1 met (34 items: 32 Accepted - applied, 2 Rejected; none Open or Deferred); E2 met (no row in §14.8, §15.5, or §16.12.3); E4 met (step 6a rerun after the last change). E3 not met: 1 marker in chunk 13e (§17.5 Compliance, from OI-33). Chunk 19 was not written; the master shows the gate Locked.

**E2E design request, 2026-10-06:** The user asked for the e2e design (chunk 19), with no decision to apply. Child LLDs check: none. Step 6a rerun before the gate check, because the Reconciled date shares its date with the last change, which the previous request made: no finding. E1, E2, and E4 met; E3 not met: the marker of §17.5 Compliance (OI-33), whose answer is a legal basis from the Data Protection Officer. Chunk 19 was not written and the gate stays Locked. Next action: the Data Protection Officer's answer to that marker, given to this SDD with a request for the e2e design.

**Marker answer (v1.2), 2026-10-06:** The user gave the answer to the one marker that kept E3 unmet, as a test-fixture value: the lawful basis for keeping former-member history and paid refunds waiting for their purchase is legitimate interests (GDPR Art. 6(1)(f)), to settle refunds and complaints within the retention period; owner the Data Protection Officer (Marker register). Applied as design text in §17.5 Compliance. The answer does not name the GDPR Art. 17(3) ground, the marker's second question, so the marker was narrowed to that ground and kept. Version 1.2 opened with its Changes Log row. Source BRDs unchanged (REFUNDS 1.7, LOYALTY 1.7). Child LLDs check: no `lld-*` folder or `LLD-*.md` file next to this SDD; the table stays `None yet`. Step 6a rerun after the change: no finding.

**Delta review (v1.2), 2026-10-06:** A cleared-context reviewer subagent read chunk 18 first, then reviewed chunk 13e, the only chunk the 1.2 row listed, against the change behind it, and wrote OI-35 to OI-41 and one delta coverage row into chunk 18. No author item was appended: the update adds no behaviour that no BRD use case covers, and the two BRDs still share no use case behaviour.

**Open items loop (v1.2), 2026-10-06:** The 7 items were presented in two batches (OI-35 to OI-38, OI-39 to OI-41), each with its Recommended Answer and Why, and decided with the standing answers of this run: accept every Recommended Answer; reject a new item that adds business behaviour no BRD states; answer a question only a person can answer with a plausible test-fixture value and its owner. OI-37, OI-38, OI-40, and OI-41 accepted and applied; OI-36 adjusted, with the user's test-fixture value for the basis of held purchases in place of its marker, and applied; OI-35 and OI-39 rejected. Changes applied to chunks 12, 13e, and 16. Step 6a rerun after the changes to 12 and 13e: no finding.

**Marker walk (v1.2), 2026-10-06:** One gate-blocking marker was left: the GDPR Art. 17(3) ground in §17.5 Compliance. Its answer is a legal ground from outside the design, so no value was proposed and its owner, the Data Protection Officer, was named; the user then answered it with a test-fixture value under the standing answer (Marker register, "§17.5 loyalty-points: erasure ground for former-member history"), and the marker was removed. The accepted items added no marker to chunks 09 to 13e or §7.3. Step 6a rerun after the walk: no finding.

**E2E gate check and chunk 19 (v1.2), 2026-10-06:** Step 8b at the end of the update (step 8 item 7), verified against the files. E1 met (41 items: 36 Accepted - applied, 1 Adjusted - applied, 4 Rejected; none Open or Deferred); E2 met (no row in §14.8, §15.5, or §16.12.3); E3 met (no marker in chunks 09 to 13e or §7.3); E4 met (step 6a rerun after the last change, in this run). Chunk 19 written at v1.2; every Mermaid block validated by reading; the Counts at a Glance checked against §13, §14.4, §14.9.99, and §14.10; §24.7 checked against §15.2 both ways. Faithfulness check: a cleared-context subagent read chunk 19 against chunks 02 to 13e and changed no file. Mismatches, fixed in chunk 19: §24.2 drew Keycloak with no module behind it (misleading; the customer-accounts admin and token edge is now drawn, and the omitted OIDC sign-ins are declared in the Faithfulness list); the shape legend did not cover the Keycloak realm, the job, the POS adapter, or the publication log table (cosmetic; widened). Source problems, each a plain inconsistency with one clearly right side, fixed in their chunks and recorded in the 1.2 row: §8.5.5 Figure 11 answered E2 with 422 where 13e answers 400 `VALIDATION_FAILED`; §12 INT-03 keyed purchases by purchase reference alone where 13e and API-07 key them by purchase reference and member (the same key corrected in §4 R-02, found while fixing it); §12 INT-04 and API-08 keyed notices by member number and date where 13e keys them by member number, type, and date; §8.1.1 promised a §12 timeout for every synchronous outside call, while §12 holds them only for the provider calls and the Keycloak user creation of the sign-up, so §8.1.1 now says so and marks the unset Keycloak timeouts of the confirmation and password reset (chunk 04, outside the gated chunks). Step 6a rerun after the API-08 fix: no finding. No open item was raised, so the gate stays open. The master links chunk 19 and shows the gate Open - Up to date; chunk 00 indexes Figures 29 to 33 and Tables 17 to 19.

**E2E design request (v1.3), 2026-10-06:** The user asked for the e2e design (chunk 19), with no decision to apply. Child LLDs check: no sibling LLD; the table stays `None yet`. Step 6a rerun before the gate check, because the Reconciled date shares its date with the last change, which the previous request made: no finding. E1, E2, E3, and E4 met, verified against the files. Chunk 19 written again from chunks 02 to 13e, which had not changed since its last write, so the write reproduced the file; the Mermaid blocks, the counts, and §24.7 checked again. Faithfulness check: a second cleared-context subagent read chunk 19 against chunks 02 to 13e and changed no file. Mismatches, fixed in chunk 19: §24.6 left out the module-private-schema doctrine of ADR-06 while the Faithfulness list said no doctrine was left out (misleading; added as item 7, and the list now says which ADRs are not doctrines on how modules interact); the §24.3 bullet did not name the resubmission job that Figure 30 draws (cosmetic). Source problems, each a plain inconsistency with one clearly right side, fixed in their chunks and recorded in the 1.3 row: §16.7 gave CUSTOMER write on customer-accounts where §16.4.1, §16.5, and §16.11 give it read only; §11.1 keyed the work records by the publication and the listener where 13b, 13c, and 13d key them per request, per refund request, and per source publication, channel, and recipient; ADR-07 pointed to §16.3 for the realm roles, which §16.4 lists. Step 6a rerun after the §16.7 fix: no finding. Version 1.3 opened with its Changes Log row. No open item was raised; the gate stays Open - Up to date.

**R3c intake (v1.5), 2026-10-06, Codex:** Targeted CHUNKS / whole hand-off. Both source BRDs are finished but In Review. The user's fixed answer accepts the recommendation to derive from them: REFUNDS v1.9 and LOYALTY v1.8. Read the review tracker and prior SDD review row; reconcile both parent deltas in one update. No architecture questionnaire or ecosystem selection is reopened. The five module IDs, UC owners, API IDs, events, routes and permission tokens remain stable. No new endpoint is proposed. The BO-01 and BO-02 report changes already fit the current source rules; BO-03 and BO-05 marker answers and the BO-04 remainder are recorded above. The review register's refresh hand-offs are work instructions, with no unanswered design choice requiring a new OI. SME-05 remains rejected: out of scope for this release (test-fixture policy); R-09 stays a known release gap.

**R3c Child LLDs check, 2026-10-06, Codex:** The sibling Refunds Platform LLD master links to this SDD, its row exists, its link resolves, and its five scope modules are active §13 rows. LLD v1.1 records SDD v1.3. Its Source SDD cell now carries the required out-of-date note for SDD v1.5. No child LLD is written in R3c; lld-unifier owns its refresh in R3d.

**R3c reconciliation and delta review (v1.5), 2026-10-06, Codex:** Step 6a rerun after the last source change; 22 module event rows, all 14 contracts, 16 permission tokens, six role counts, the 13b data model and nine use-case trace rows reconcile with no unflagged finding. A separate disk-reading reviewer pass reads chunk 18 first, then the review changes and current parent deltas. All 16 risk surfaces are covered in the R3c audit, and chunk 18 adds a dated coverage row for every changed source chunk. Zero new OI is valid with that coverage. The answered OI-29 and OI-31 remainders are settled above; no unanswered review remainder needs a new OI. Existing statuses remain 36 Accepted - applied, 1 Adjusted - applied and 4 Rejected. No acceptance loop or marker walk is needed for new findings. Mermaid is checked by reading and heuristics only.

**R3c E2E gate and faithfulness (v1.5), 2026-10-06, Codex:** E1 met: 41 closed items, 36 Accepted - applied, 1 Adjusted - applied, 4 Rejected, none Open or Deferred. E2 met: no divergence row in §14.8, §15.5 or §16.12.3. E3 met: no clarification marker in 09 to 13e or §7.3. E4 met: step 6a rerun in this stage after the last source change, with source hashes recorded before the E2E write. Chunk 19 refreshed at v1.5; its whole-system topology stays faithful without adding behavior. A separate read-only same-context disk pass checks landscape event sets, ten fan-out edges, the six notification edges declared omitted, four POS-adapter edges, three port contracts, both sagas and doctrine homes: 0 wrong, 0 misleading, 0 cosmetic and no source problem. Five E2E Mermaid blocks are checked by reading; figures and table indices remain valid. The master now reads Open - Up to date. No application tests or renderer ran. Specs (Mission / Tech Stack / Roadmap / Project Type) is synthesised by lld-unifier from this SDD. R3c stops before R3d.

**R3c final citation verification, 2026-10-06, Codex:** check_sdd found two defects in the newly written delta-review coverage notes: an unkeyed REFUNDS use case and an unkeyed LOYALTY NFR. The checker output and comparison with existing keyed coverage rows locate the cause in those notes, not in the settled design or source contracts. Both are fixed at their source, with a keyed UC link and a keyed NFR. New business test citations in R-15 and its settlement record also carry the REFUNDS key. These are mechanical citation corrections in the same v1.5 update, with no OI, semantic change or new source contract. Pre-fix checker evidence is kept in the R3c audit.

**E2E refresh request (v1.6), 2026-10-07:** The user asked to refresh the e2e design with two marker answers, both test-fixture values with named owners, and to fix what the gate check of 2026-10-07 found. Fixed answers for this request: accept every recommendation and every Recommended Answer, except an item that adds business behaviour no BRD states, which is rejected as out of scope for this release (test-fixture policy); no other test-fixture answer, so any other question only an owner can answer stays a hand-off with its named owner. Child LLDs check: the Refunds Platform LLD v1.2 links this SDD's master, its link resolves, and its five scope modules are active §13 rows; it records SDD v1.5, so its row now carries the out-of-date note for v1.6. Source BRDs unchanged: REFUNDS v1.9, LOYALTY v1.8.

**Marker answers (v1.6), 2026-10-07:** Applied as design text through step 8 item 6 and recorded in the Marker register ("§3 Assumption 7 - one delivery team for both products" and "§5 Receipt number and purchase reference - one purchase identifier (R-08)"); both markers removed, and the master's E3 marker inventory drops their two rows (67 rows remain, none blocking). Version 1.6 opened with its Changes Log row.

**Gate check findings (v1.6), 2026-10-07:** The missing REFUNDS key added to REFUNDS/TC-DEC-09 in 13c Developer Notes, to six test-case IDs in closed chunk 18 records (OI-12, OI-14, OI-19, OI-24, OI-29), and to two in this register (the OI-12 record and "§17.3 payouts: retry and poison-message strategy"), each an editorial fix. The 13e ERD marked `points_movement.purchase_id` as FK while its Tables Design gave none: the ERD, with its `sources` relationship, is plainly right, since every other reference inside the module is a foreign key and no designed deletion leaves a movement that outlives its purchase, so the Tables Design took the FK, a content change of 13e. The `TI-01` and `TI-02` of [REFUNDS 12 § Technical Inputs for the SDD](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) are SoW locations that the BRD quotes, not BRD IDs, so they take no key.

**Step 6a (v1.6), 2026-10-07:** Four runs: after the marker answers and the fixes, with every 13x data model checked once under the Legacy SDDs rule; after OI-43; after OI-44; and the final run, recorded on the master's Reconciled line with the hash of chunks 01 to 17. No finding beyond the 13e FK.

**Delta review (v1.6), 2026-10-07:** A cleared-context reviewer subagent read chunk 18 first, then reviewed chunks 01, 06, and 13e against the change behind v1.6, and wrote OI-42 and OI-43 and one delta coverage row per changed chunk. It reported, outside its scope, a pre-existing §17.5 case: a purchase reported before late leave and rejoin notices earns in the ended period and never counts in the new membership, against [LOYALTY 03 § Membership end and data retention](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention); asked to keep it on record, it added a "Considered and not raised" bullet to the chunk 18 Reviewer Notes. It is not raised as an open item and is left for the owner's next full or targeted review of §17.5.

**Open items loop (v1.6), 2026-10-07:** OI-42 and OI-43 accepted and applied under the fixed answers; neither adds business behaviour. The scoped check of their application, pass 2 of the three review passes the request allows, found both applied verbatim and raised OI-44, accepted and applied; the scoped check of OI-44, pass 3 and the last, found it applied verbatim and no issue. Seen by pass 3 outside its scope and not raised: §11.1 audit columns are missing on `refund_application`, `refund`, and `membership_period`, and nothing orders two overdue deletions of one member after an unrelated failure.

**E2E gate and chunk 19 (v1.6), 2026-10-07:** Step 8b, verified against the files: E1 met (44 items: 39 Accepted - applied, 1 Adjusted - applied, 4 Rejected), E2 met, E3 met (67 live markers, none blocking), E4 met (the final step 6a run follows the last content change). The E2E basis was legacy, so chunk 19 was written again at v1.6 from the current template: its header, the template's no-topic phase, and the earlier content where it still traces to its sources; the counts, §24.7 against §15.2, and the Mermaid blocks were checked. Faithfulness check: a cleared-context subagent read chunk 19 against chunks 02 to 13e and changed no file. Mismatches, fixed in chunk 19: §24.7 row 2 placed the reading of a branch's recipients at send time, while 13d reads them when the messages are recorded and reads their contact details at send time (misleading); the Faithfulness list did not name Figure 32's single attempt and its failure branch without `RefundPayoutFailed`, How to Read skipped §24.6, the §24.8.1 Summary cited R-14 and §20.1.8 rather than §17.3, §24.5.3 restated §14.7, and two §24.9 pointers did not fit an in-process system (cosmetic). It also found one wrong and two imprecise reasons in the master's E3 marker inventory, corrected together with the two reasons that cited R-14 and §20.1.8, and one source design question: the delivery form of API-07, API-08, and API-09 is open in §15 and settled as an inbound call in the body. That is not a mechanical fix with one clearly right side, so the author raised it as OI-45, which shut the gate. It was decided under the fixed answers (Option A) and, found after the last review pass, is left Decided - pending application: the next request that changes this SDD applies it, runs its scoped verification and step 6a, writes its decision record, and checks the gate again. The master links chunk 19, its gate line reads Stale, its E2E basis records chunk 19 v1.6, and its chunk 19 note now uses the current template wording.

**Pending decision and e2e refresh request (v1.7), 2026-10-07:** The user asked to apply the pending decision and refresh the e2e design. Fixed answers for this request: accept every recommendation and every Recommended Answer, except an item that adds business behaviour no BRD states, which is rejected as out of scope for this release (test-fixture policy); no test-fixture answer, so a question only an owner can answer stays a hand-off with its named owner; issues outside this request's delta stay known gaps for their owners. Not a resume: the generation is whole and no part is pending. Child LLDs check: the Refunds Platform LLD v1.2 links this SDD's master, its link resolves, and its five scope modules are active §13 rows; it records SDD v1.5, so its row carries the out-of-date note for v1.7; no other sibling LLD. Source BRDs unchanged: REFUNDS v1.9, LOYALTY v1.8.

**Pending decision applied (v1.7), 2026-10-07:** OI-45 was applied first, through step 8 item 3: its Recommended Answer as design text in §3 Assumption 8, in the API-07, API-08, and API-09 markers of §15.3, and in their §15.6 cells; its status Accepted - applied, its Resolution Log row, and its Clarification register record. Version 1.7 opened with its Changes Log row.

**Step 6a (v1.7), 2026-10-07:** Three runs: after the OI-45 edits, after the OI-46 and OI-47 edits, and a final run on unchanged content after review pass 2, recorded on the master's Reconciled line with the hash of chunks 01 to 17. No finding.

**Review passes (v1.7), 2026-10-07:** Pass 1, a cleared-context reviewer subagent, read chunk 18 first, checked the OI-45 application in chunks 01 and 11 and the places that build on it, and wrote one application-check row per changed chunk: the three edits are applied verbatim, and it raised OI-46 and OI-47, both on API-09. Both were accepted and applied under the fixed answers; neither adds business behaviour. Pass 2, the scoped check of their application, found both applied verbatim and no issue, so the third pass the request allows was not needed. Seen by the passes outside their scope and not raised, each older than this change and left for its owner: how a go-live import delivered over several calls opens and closes one `go_live_import` run (next to the question OI-22 left to the LOYALTY owner); no alert for a refused call on API-07, API-08, or API-09 like the API-04 one (§20.1.12); the business keys of the inbound endpoints in place of the `Idempotency-Key` header, as for API-04; the §12 INT-04, INT-05, and INT-06 Auth cells, which name no credential store; the API-10 and API-11 credential rows, not stated per tenant while §6 keeps the two sign-in brokers per tenant; the API-09 marker, which names no document, unlike API-07 and API-08 (editorial); ADR-03 How, which takes the tenant from the token claim only, narrower than §11.2; and the §11.6 source-address check, which assumes the Marketing team calls from known addresses.

**Marker walk (v1.7), 2026-10-07:** No marker answer was given, and no applied item added, narrowed, or removed a marker; the 67 live markers stay, none blocking (E3 marker inventory), and its external placeholder note now covers the narrowed API-07, API-08, and API-09 placeholders.

**E2E gate and chunk 19 (v1.7), 2026-10-07:** Step 8b, verified against the files: E1 met (47 items: 42 Accepted - applied, 1 Adjusted - applied, 4 Rejected), E2 met (no row in §14.8, §15.5, or §16.12.3), E3 met (67 live markers, none blocking), E4 met (the final step 6a run follows the last content change). Not already current: the gate line read Stale, and chunks 02 and 11, both chunk 19 sources, changed after its v1.6 basis. Chunk 19 written again at v1.7: every count, row, edge, doctrine, and saga still traced to chunks 02 to 13e, so its content was kept; the Mermaid blocks, the counts, and §24.7 against §15.2 were checked. Faithfulness check: a cleared-context subagent read chunk 19 against chunks 02 to 13e and changed no file. Mismatches, fixed in chunk 19 and confirmed closed by the same agent: §24.7 row 2 recorded one message for each recipient, while 13d records one per recipient and channel (misleading); the same cell restated the data source of the API-13 behaviour (cosmetic); a Faithfulness bullet named only the send jobs as making the outside calls, while §14.7 also names the listener's first try (cosmetic; its first rewording overstated that every listener makes one, so it now uses the §14.7 wording); How to Read did not explain the sequence arrows of Figures 32 and 33 or the dotted edge of Figure 30 (cosmetic). Source items it reported, none of which a chunk 19 claim depends on: `CustomerAccountClosed` names both the internal publication of 13a, which Figure 30 draws as 13a states it, and an API-12 typed error of §15.3, a naming question with two plausible answers (rename the error, or keep both in separate packages) that is older than this request and outside its delta, so under the fixed answers it is not raised and is left for the architecture team; the "one batch" wording of §12 INT-06, the API-09 retries row, and §18.3 next to the API-09 call pattern, and the INT-06 Auth cell without the per-tenant secret, which review pass 2 had already judged consistent with the change. No source open item was raised, so the gate opened: the master's gate line reads Open - Up to date, and its E2E basis records chunk 19 v1.7.

**Targeted update request (v1.8), 2026-10-07:** The user asked to add to the Testing bullet of §17.1 Developer Notes (13a, customer-accounts) that the code-rule tests run with a fixed clock, so the 15-minute expiry is deterministic. Fixed answers for this request: accept every recommendation and every Recommended Answer, except a new item that adds business behaviour no source BRD states, which is rejected as out of scope for this release (test-fixture policy); a question only a named owner can answer stays a marker or a hand-off to that owner; no Mermaid renderer, so Mermaid is checked by reading. No argument was given and the folder holds a finished SDD, so CHUNKS mode is kept without asking; not a resume (generation whole, no part pending); a targeted update of one section, run whole. No item was Decided - pending application, so nothing was applied first. Child LLDs check: the Refunds Platform LLD v1.3 links this SDD's master, its link resolves, and its five scope modules are active §13 rows; it records SDD v1.7, so once this update opened v1.8 its row took the out-of-date note for v1.8; no other sibling LLD. Source BRDs unchanged: REFUNDS v1.9, LOYALTY v1.8.

**Testing bullet (v1.8), 2026-10-07:** Applied as design text, "with a fixed business clock (§19) so the 15-minute expiry is deterministic", in the SDD's one term for the injected clock that every rule and job reads (§5 Glossary, §6 Time rule, §19 Business clock). No back-fill: no other chunk states the test strategy of the code rules, and AP-11, the §6 Time rule, and §19 stay true. Version 1.8 opened with its Changes Log row. Rule home: [§17.1 Developer Notes](./13a-service-customer-accounts.md#developer-notes).

**Step 6a (v1.8), 2026-10-07:** One run after the 13a edit, recorded on the master's Reconciled line with the hash of chunks 01 to 17: no finding. The change touches no 13x DB Modeling, so no data model check was owed.

**Delta review (v1.8), 2026-10-07:** A cleared-context reviewer subagent read chunk 18 first, then reviewed chunk 13a, the only chunk the 1.8 row listed, against the change behind it, and wrote one delta coverage row into chunk 18: no issue found and no open item; it named the second "15-minute" in the bullet an editorial repeat, not a finding. No author item was appended: the change adds no behaviour. Seen outside its scope, each older than this change and unrelated to it, and kept on record by the reviewer, at the author's request, in a "Considered and not raised" bullet of the chunk 18 Reviewer Notes, for the owner's next full or targeted review: two concurrent password-reset requests for one account can leave two working codes, against [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) BR-4: only the latest code works (§17.1); one UAT clock offset serves the cases of both products (§19); and `last_sign_in_at` mixes the real time of the Keycloak sign-in events with the business clock (§17.1). This was review pass 1 of the three the request allows; with no item to apply, no scoped check followed.

**Open items loop and marker walk (v1.8), 2026-10-07:** No new item to decide and no marker answer given; the change adds, narrows, or removes no marker, so the 67 live markers stay, none blocking (E3 marker inventory).

**E2E gate and chunk 19 (v1.8), 2026-10-07:** Step 8b at the end of the update (step 8 item 7), verified against the files: E1 met (47 items: 42 Accepted - applied, 1 Adjusted - applied, 4 Rejected; none Open, Deferred, or Decided - pending application); E2 met (no row in §14.8, §15.5, or §16.12.3); E3 met (67 live markers, none blocking); E4 met (the step 6a run follows the request's only content edit, at sha256 be4d581fda9b95de, which the chunks still match). The 13a edit had marked chunk 19 Stale. Behind that mark no claim chunk 19 asserts had changed, so its body and version (1.7) were kept; the Counts at a Glance, §24.7 against §15.2, and the five Mermaid blocks were checked again by the author. Faithfulness check: a cleared-context subagent read chunk 19 against chunks 02 to 13e as on disk and changed no file: 0 wrong, 0 misleading, 0 cosmetic mismatches. It reported five source problems, none in the text this request changed and none a chunk 19 claim depends on, and none a plain contradiction with one clearly right side: the `CustomerAccountClosed` name of both the 13a publication and an API-12 error (seen in v1.7 too, and now on record); how the Keycloak user deletion after closure is retried, next to the send-job rule of ADR-02 and §11.1; the narrower failure label of Figure 8; two uses of the Boundaries event bullets across 13a to 13e; and the "each other's ports" wording of §16.1. Under step 8b item 3 they are not raised, but recorded in the chunk 18 Reviewer Notes with their source and owner (the Architecture team) and named in the handoff; the gate stays open. The master's gate line reads Open - Up to date, and its E2E basis records this verification.

**E2E refresh request (v1.8), 2026-10-07:** A new request: the user asked to refresh the e2e design, with no decision to apply. CHUNKS mode kept from the folder; not a resume. Child LLDs check: the Refunds Platform LLD v1.3 links this SDD's master, its link resolves, its five scope modules are active §13 rows, and it still records SDD v1.7, so its row keeps the out-of-date note for v1.8; no other sibling LLD. Source BRDs unchanged: REFUNDS v1.9, LOYALTY v1.8. No chunk changed since the v1.8 Reconciled entry (chunks 01 to 17 still at sha256 be4d581fda9b95de), so its entry proves the order and step 6a was not rerun. E1 to E4 verified against the files: E1 met (47 items: 42 Accepted - applied, 1 Adjusted - applied, 4 Rejected), E2 met (no row in §14.8, §15.5, or §16.12.3), E3 met (67 live markers, none blocking), E4 met. Already current: the gate line read Open - Up to date and no source claim changed since the E2E basis, so chunk 19 keeps its body and version (1.7), the verification is recorded on the E2E basis line, and no content, version, or Changes Log row changed. No review pass ran: the request changes no content.

<!-- MASTER: refunds-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
