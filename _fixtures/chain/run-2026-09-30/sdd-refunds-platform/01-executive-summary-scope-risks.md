<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 1. Executive Summary

The Refunds Platform is one web platform that realises two BRDs: the Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY), both listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Customers request and track refunds for branch purchases, branch managers decide on their own branch's requests, approved refunds are paid back to the original card through the payment provider, and members see their points balance and history. Points earned on a purchase are taken back once the refund of that purchase is paid, which is the one rule that joins the two BRDs ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back after a refund).

Technically, the platform is a hybrid (ADR-01): one core deployable, `refunds-platform-core`, holds the refund-service and loyalty-service modules (DDD modules, hexagonal inside, in-process ports and domain events), and two extracted services, payout-service and notification-service, run as their own deployables with their own PostgreSQL databases. Every fact that leaves a deployable is an integration event on Kafka, written through the transactional outbox. An Angular web app reaches the core through an API gateway, and Keycloak authenticates every user.

Core technical capabilities at a glance:

- A refund request state machine (Submitted, Approved, Rejected, Cancelled, Paid) with a reference number and a full status history per request (§17.1).
- One payout per approved refund, with an idempotent consumer, a unique payout per refund, and retries within the §17.2 retry window.
- Event-driven customer messages by email and SMS through the notification partner (§17.3).
- A points ledger of immutable movements with a balance kept in the same transaction, and the take-back of points when a refund is paid (§17.4).
- Shared-schema multi-tenancy with branch-scoped and owner-scoped authorization (§11.2, §16).

Key technical bets and trade-offs:

- **Hybrid, not microservices.** About 1,200 requests a month and one team do not justify four deployables; only the two parts with different failure needs (the external payout provider and the message fan-out) are extracted, so a provider outage never takes the portal down (REFUNDS/NFR-02). The trade-off is that loyalty-service shares the core's release cycle until its extraction trigger in ADR-01 fires.
- **Events, not synchronous calls, between deployables.** No deployable calls another over HTTP (ADR-05). Payouts and messages survive provider outages through retries and never block a customer or a branch manager (REFUNDS/NFR-01, REFUNDS/NFR-02). The trade-off is eventual consistency: a refund shows Paid only after the payout event returns.
- **In-process take-back of points.** The cross-BRD rule runs inside the core after the refund's Paid transition commits, through a durable publication log, well within the one-hour target (LOYALTY/NFR-02). The trade-off is that extracting loyalty-service later means consuming the Kafka event `REFUND_PAID` instead (ADR-01).

**Project Type:** Greenfield - neither BRD names an existing codebase, and [REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary) describes today's paper-and-phone process.

---

# 2. Scope

## 2.1 In Scope

Business scope lives in [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) and [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope). Solution-level delta:

- The `refunds-platform-core` deployable (refund-service and loyalty-service modules) and the payout-service and notification-service deployables (§13).
- One Angular web app for customers, members, and branch managers, working on phones and computers ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)).
- The API gateway, the Keycloak realm configuration, the Kafka topics (§14.4), and their schema registry subjects.
- The integrations INT-01 to INT-03 (§12) and their API contracts API-01 to API-04 (§15).
- The daily branch refund report, served in the web app ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)).

## 2.2 Out of Scope

- Business exclusions stay in the BRDs: [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) and [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope).
- Loyalty enrolment and the link between a sign-in account and a member number: neither BRD covers it (§3 assumption 3).
- Staff account provisioning and branch assignment (§16.6).
- A native mobile app. **[NEEDS CLARIFICATION: does "Mobile" in the title of [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) mean the web app on phones (REFUNDS 11 says the customer screens work on phones and computers) or a native app, which the [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) future enhancement "push notifications in the mobile app" implies?]**
- Push notifications, a [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) future enhancement.

---

# 3. Assumptions

BRD assumptions are referenced, not restated: [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions). Technical assumptions:

1. **Signed-in users:** customers, members, and branch managers sign in with a Keycloak account; both BRDs imply identity ([REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) BR-1: customers see only their own requests; [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) precondition: the member is signed in).
2. **Branch claim:** every branch manager account carries exactly one branch, issued as the `branch_id` token claim.
3. **Member claim:** a signed-in member's token carries the loyalty member number as the `member_id` claim, set at enrolment outside both BRDs.
4. **Contact details:** the customer's email address and mobile number come from their Keycloak profile (`email` and `phone_number` claims) when the request is submitted.
5. **Receipt lookup:** POS Records answers a lookup by receipt number in real time with items, amounts, branch, purchase date, and the receipt's payment methods with its card-paid amount ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations); the payment data is required by §15.3 API-01).
6. **Member purchases:** POS Records can hand over each day's member purchases with member number, purchase reference, and amount ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations); LOYALTY 02 assumption 1).
7. **Tenancy:** the retailer is one tenant today; the platform is multi-tenant by platform rule (ADR-03).
8. **Hosting:** on-prem Kubernetes (ADR-09); neither BRD states the hosting.
9. **Currency:** amounts are in EUR today (LOYALTY 02 Glossary, Points: 1 point per 1 EUR spent); every amount still carries its ISO 4217 currency code.
10. **Delivery team:** one team builds and runs the platform in this release; neither BRD states the team size.
11. **Shared platform:** an on-prem platform team already operates Kubernetes, Kafka with a schema registry, PostgreSQL, and Keycloak, and hosts this platform's topics, databases, and realm.

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | Branches keep recording refunds on paper during rollout, so some requests stay lost or invisible to customers ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) 1). | M | M | [NEEDS CLARIFICATION: mitigation strategy for R-01] | [NEEDS CLARIFICATION: risk owner] |
| R-02 | The payment provider cannot refund to the original card, or needs card data the platform does not hold ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 1, hard dependency). | M | H | Confirm the refund-to-original-card capability with CardPay before build; API-02 stays `TBD - external` until its documentation arrives (§15.6). | [NEEDS CLARIFICATION: risk owner] |
| R-03 | Cross-BRD data link: the LOYALTY purchase reference may not be the REFUNDS receipt number, and the points to take back after a partial refund are not defined, so points could be taken back wrongly ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back after a refund). | M | M | Both questions are flagged in §17.4 for the two BRD owners; the take-back handler is idempotent, so a corrected rule can be replayed. | [NEEDS CLARIFICATION: risk owner] |
| R-04 | A POS Records outage blocks new refund requests (receipt lookup) and delays points earning. | M | H | Circuit breaker with a clear "try again later" answer (§17.1); the purchase import resumes from its cursor (§17.4). | [NEEDS CLARIFICATION: risk owner] |
| R-05 | POS Records may only push purchases instead of serving them, which changes the direction of API-04. | M | L | API-04 stays `TBD - external`; the import adapter sits behind a port, so a push adapter replaces it without touching the domain (§17.4). | [NEEDS CLARIFICATION: risk owner] |
| R-06 | Customer contact details travel in event payloads, which widens the personal-data footprint (topics and their retained log). | M | M | ADR-10; one bounded retention for the refund topic and its DLQs; the §14.9 erasure map. | [NEEDS CLARIFICATION: risk owner] |

---

# 5. Glossary

Business terms are defined in the BRDs and not restated: [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary), [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary), and [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement). SDD terms:

| Term | Definition |
|------|------------|
| BRD key | The short capital name of a source BRD (REFUNDS, LOYALTY) carried by every BRD reference in this SDD, for example `REFUNDS/UC-04`. |
| Hybrid architecture | A modular monolith core plus separately deployed services for the parts with different scaling, failure, or release needs (ADR-01). |
| Core deployable | `refunds-platform-core`: the one deployable that holds the refund-service and loyalty-service modules. |
| Module | A bounded context inside the core deployable, with its own schema and ports; modules never read each other's tables. |
| Extracted service | A bounded context deployed on its own, with its own database: payout-service and notification-service. |
| Integration event | An event published to Kafka through the transactional outbox and catalogued in §14.5. |
| In-process domain event | An event one core module publishes and another core module handles in the same deployable, catalogued in §14.10. |
| Durable publication log | The `event_publication` table in the core's `core_events` schema, owned by no module, that records each in-process domain event in the publishing transaction and keeps it until its listener completes, so a crash replays it (§11.1). |
| Transactional outbox | A table written in the same transaction as the domain change; a relay publishes its rows to Kafka after commit (no dual-writes). |
| Inbox | A consumer-side table of processed `(consumer, event_id)` pairs, used to ignore redeliveries. |
| DLQ | Dead-letter queue: the Kafka topic that receives messages a consumer cannot process, with an alarm and a replay runbook. |
| Candidate event | An event whose name is fixed but whose payload contract is not yet ratified (§14.5 status legend). |
| Tenant settings | The per-tenant time zone, currency, locale, and points earn rate held in Helm values keyed by `tenant_id` (§11.2). |
| Tenant ref (`tenant_ref`) | A keyed hash of `tenant_id` written in every log line and used as a metric label, so telemetry can isolate a tenant without the raw id (§11.4). |
| Lease | The time-bounded claim a payout-service worker holds on a payout in `SENDING`; an expired lease makes the payout due again (§17.2). |
| Payout watchdog | The refund-service job that flags approved requests with no payout outcome after the §17.2 retry window plus one hour (§17.1). |
| Pending take-back | A take-back recorded as `PENDING_EARN` because the refunded purchase has not been imported yet; the import applies it (§17.4). |
| Break-glass | Time-boxed, approved, and audited access to production data outside the web app (§20.3). |
| Take-back | A points movement of type `TAKEN_BACK` that removes the points earned on a purchase once its refund is paid. |
| Reference number | The human-readable identifier of a refund request given at submission, unique per tenant; its format is set in the §17.1 Tables Design. |
| Purchase reference | The LOYALTY name of the identifier of a POS purchase; its link to the REFUNDS receipt number is an open question in §17.4. |
| Idempotency-Key | A request header that makes a retried write safe: the same key returns the original result (§15.1). |
| Problem Details | The RFC 9457 error format, extended with an `errorCode` (§15.1). |
| UUIDv7 | A time-ordered UUID used for every primary key and event id. |
| OIDC, PKCE, JWT | OpenID Connect sign-in, the Proof Key for Code Exchange extension for browser apps, and the signed JSON Web Token the gateway and the deployables validate. |
| Keycloak | The identity provider; one realm serves every tenant (ADR-07). |
| Kafka | The event broker between deployables (ADR-02); a consumer group per consuming deployable, partition key per aggregate. |
| Schema registry | The store of event payload schemas; changes are additive only. |
| API gateway | The edge component that validates tokens, resolves the tenant, applies rate limits, and logs requests before routing to the core. |
| Helm chart, HPA | The Kubernetes packaging of one deployable, and its Horizontal Pod Autoscaler. |
| RED metrics | Rate, Errors, Duration per endpoint and per consumer. |
| SPA | Single-page application: the Angular web app. |
| ADR, AP, API, INT, OI, R | SDD identifiers: Architectural Decision (§10), Architecture Principle (§9), API contract (§15), Integration (§12), Open Item (§23), Risk (§4). |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
