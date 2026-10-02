<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 1. Executive Summary

The Refunds Platform is one web platform that realises two BRDs: the Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY), both listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Customers request and track refunds for branch purchases, branch managers decide on their own branch's requests, approved refunds are paid back to the original card through the payment provider, and members see their points balance and history. Points earned on a purchase are taken back once the refund of that purchase is paid through the Refunds Portal, which is the one rule that joins the two BRDs ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back when the refund is reported paid).

Technically, the platform is a hybrid (ADR-01): one core deployable, `refunds-platform-core`, holds the refund-service and loyalty-service modules (DDD modules, hexagonal inside, in-process ports and domain events), and two extracted services, payout-service and notification-service, run as their own deployables with their own PostgreSQL databases. Every fact that leaves a deployable is an integration event on Kafka, written through the transactional outbox. An Angular web app reaches the core through an API gateway, and Keycloak authenticates every user.

Core technical capabilities at a glance:

- A refund request state machine (Submitted, Approved, Rejected, Cancelled, Paid) with a reference number and a full status history per request (§17.1).
- One payout per approved refund, with an idempotent consumer, a unique payout per refund, and retries that continue past the §17.2 retry window until the payout succeeds.
- Event-driven customer messages by email and SMS through the notification partner (§17.3).
- A points ledger of immutable movements with a balance kept in the same transaction, and the take-back of points when a refund is paid (§17.4).
- Shared-schema multi-tenancy with branch-scoped and owner-scoped authorization (§11.2, §16).

Key technical bets and trade-offs:

- **Hybrid, not microservices.** About 1,200 requests a month and one team do not justify four deployables; only the two parts with different failure needs (the external payout provider and the message fan-out) are extracted, so a provider outage never takes the portal down (REFUNDS/NFR-02). The trade-off is that loyalty-service shares the core's release cycle until its extraction trigger in ADR-01 fires.
- **Events, not synchronous calls, between deployables.** No deployable calls another over HTTP (ADR-05). Payouts and messages survive provider outages through retries and never block a customer or a branch manager (REFUNDS/NFR-01, REFUNDS/NFR-02). The trade-off is eventual consistency: a refund shows Paid only after the payout event returns.
- **In-process take-back of points.** The cross-BRD rule runs inside the core after the refund's Paid transition commits, through a durable publication log, well within the one-hour target (LOYALTY/NFR-02). The trade-off is that extracting loyalty-service later means consuming, from Kafka, a PII-free paid-refund event with the `RefundPaidEvent` fields on a topic of its own, never `REFUND_PAID`, with the cutover rule of the §14.7 Extraction contract (ADR-01).

**Project Type:** Greenfield - neither BRD names an existing codebase, and [REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary) describes today's paper-and-phone process.

---

# 2. Scope

## 2.1 In Scope

Business scope lives in [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) and [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope). Solution-level delta:

- The `refunds-platform-core` deployable (refund-service and loyalty-service modules) and the payout-service and notification-service deployables (§13).
- One Angular web app for customers, members, and branch managers, working on phones and computers ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)).
- The API gateway, the Keycloak realm configuration, the Kafka topics (§14.4), and their schema registry subjects.
- The integrations INT-01 to INT-03 (§12) and their API contracts API-01 to API-04 (§15).
- The daily branch refund report, served in the web app ([REFUNDS/UC-06](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-06-view-branch-refund-report), [REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)), and the monthly head-office refund report of the same chunk once its head-office role exists (REFUNDS OI-13).

## 2.2 Out of Scope

- Business exclusions stay in the BRDs: [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) and [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope).
- Member accounts and member numbers: the platform builds no loyalty sign-up or member sign-in of its own and uses the member's existing loyalty program account as it is (§3 assumption 3).
- Staff account provisioning and branch assignment (§16.6).
- A native mobile app. "Web and Mobile" in the title of [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) means the web app on phones and computers (REFUNDS OI-11, applied by business review PM-12).
- Push notifications: they need a native app, which is not planned ([REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) item 2).

---

# 3. Assumptions

BRD assumptions are referenced, not restated: [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions). Technical assumptions:

1. **Signed-in users:** customers, members, and branch managers sign in with a Keycloak account; customers register themselves with a verified email address and an optional mobile number ([REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope), [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) precondition: the customer is signed in), and both BRDs imply identity ([REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) BR-1: customers see only their own requests; [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) precondition: the member is signed in with their existing loyalty program account). One account per person, staff excepted: a staff member who shops uses a separate customer account (§16.3).
2. **Branch claim:** every branch manager account carries exactly one branch, issued as the `branch_id` token claim. POS Records is the source of truth for branch identifiers: the claim carries the identifier POS Records returns as the branch of a receipt (API-01), which the staff administrator takes from the list of POS Records branch identifiers the Retail IT team supplies (§16.6).
3. **Member claim:** a signed-in member's token carries the loyalty member number as the `member_id` claim. POS Records is the source of truth for member numbers: the claim carries the member number POS Records reports with each member purchase (API-04), in the same form, so that the own-points gate compares like with like (§17.4). Members sign in with their existing loyalty program account, a LOYALTY dependency still to confirm before TASK-02 ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)), and joining the program stays outside the platform ([LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope)). **[NEEDS CLARIFICATION: is the existing loyalty program account a Keycloak account in this platform's realm, or does the realm broker the member's sign-in to the loyalty program's own identity provider, and which account attribute carries the member number into the `member_id` claim? §16.2 states what each answer requires. Tracked for the LOYALTY owner as LOYALTY TD-27.]**
4. **Contact details:** the customer's verified email address and, when they gave one, mobile number come from their Keycloak profile (`email` and `phone_number` claims) when the request is submitted; SMS goes only when the profile has a mobile number ([REFUNDS 03 § Customer account and messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-account-and-messages)).
5. **Receipt lookup:** POS Records answers a lookup by receipt number in real time with items, amounts, branch, purchase date, and the receipt's payment methods with its card-paid amount ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations); the payment data is required by §15.3 API-01).
6. **Member purchases:** POS Records serves the member purchases it has reported, with member number, purchase reference, receipt number, amount, purchase date (the POS Records row of [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations), which lists the receipt number since the business review of 2026-10-01), and the time it reported each one, to a pull by cursor (API-04, R-05); it reports every member purchase on the day of the purchase, with its receipt number, a LOYALTY dependency still to confirm before TASK-01 ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)).
7. **Tenancy:** the retailer is one tenant today, and neither BRD plans another tenant, a brand split, resale, or a white-label offer. The platform is multi-tenant because the house platform rule makes every product multi-tenant (ADR-03), not for a commercial reason; ADR-03 lists what each tenant costs to onboard.
8. **Hosting:** on-prem Kubernetes (ADR-09); neither BRD states the hosting.
9. **Currency:** amounts are in EUR today ([LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) Earning: 1 point for each whole 1 EUR spent); every amount still carries its ISO 4217 currency code.
10. **Delivery team:** one team builds and runs the platform in this release; neither BRD states the team size.
11. **Shared platform:** an on-prem platform team already operates Kubernetes, Kafka with a schema registry, PostgreSQL, and Keycloak, and hosts this platform's topics, databases, and realm, with service levels that fit the REFUNDS/NFR-02 budget of 2 hours of disruption a month. The Solution Architecture Team confirms both with the platform team before build starts; if either does not hold, the ADR-01 re-open trigger applies.
12. **Receipt numbers:** a receipt number identifies one purchase across all of the tenant's branches and over time, and POS Records returns it in one documented format through API-01 and API-04; the Retail IT team confirms both in writing before TASK-01 of each BRD ([REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) 1 and [§ Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 2; [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)). If numbers repeat across branches or tills, the receipt lookup, the BR-2 index, and the take-back match key become branch plus receipt number (or a code printed on the receipt), API-01 takes the branch, and `RefundPaid` carries it; the rest of the design stands.

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | Branches keep recording refunds on paper during rollout, so some requests stay lost or invisible to customers ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) 1). | M | M | The rollout: pilot branches first, then waves, none inside the seasonal sales period ([REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) 3), with branch training and a date per branch to stop recording refunds on paper, set in the rollout plan (REFUNDS OI-15). Refunds handled at a branch outside the portal ([REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope)) stay on paper until REFUNDS OI-20 decides a staff-assisted request. | Operations Lead |
| R-02 | The payment provider cannot refund to the original card, or needs card data the platform does not hold, or can fail a payout after accepting it, when the platform has already reported the refund as Paid and taken points back ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 1, hard dependency). | M | H | Confirm the refund-to-original-card capability, safe re-sends, result delivery, whether an accepted payout can still fail or be reversed (if it can, the way back is designed before the payout is built, §15.3 API-02), and the reference of the original payment with CardPay in writing before TASK-03 starts (REFUNDS 02 § Dependencies 1); API-02 stays `TBD - external` until its documentation arrives (§15.6). | Product manager (REFUNDS) |
| R-03 | Cross-BRD data link: the take-back finds the member purchase by the receipt number, which the Refunds Portal reports with every paid refund (the Refunds Portal row of [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)) and POS Records reports with each member purchase, so a gap in that number takes points back from the wrong purchase or not at all ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back when the refund is reported paid). A POS Records that cannot send the receipt number with each member purchase stops all earning, because such records are rejected; a number that repeats across branches or tills, or reaches the two modules in different forms, blocks valid refunds or parks take-backs as pending with no error. | M | H | The take-back matches on the receipt number POS Records reports with each member purchase (§17.4); a member purchase record without one is rejected and alerted; whether POS Records can send it is asked with API-04 (§15.3) and must be confirmed in writing before TASK-01 starts ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)); one normalised form for API-01 and API-04 (§15.3), the uniqueness confirmation with its stated fallback (§3 assumption 12), and an alert on the share of take-backs left pending (§17.4 Metrics). | Product manager (LOYALTY) |
| R-04 | A POS Records outage blocks new refund requests (receipt lookup), which counts against REFUNDS/NFR-02, and delays points earning. | M | H | Circuit breaker with a clear "try again later" answer (§17.1); the purchase import resumes from its cursor (§17.4); POS Records' availability is confirmed with the Retail IT team as a REFUNDS dependency ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 2). | Retail IT team |
| R-05 | POS Records may only push purchases instead of serving them, which changes the direction of API-04. | M | L | API-04 stays `TBD - external`; the import adapter sits behind a port, so a push adapter replaces it without touching the domain (§17.4). | Solution Architecture Team |
| R-06 | Customer contact details travel in event payloads, which widens the personal-data footprint (topics and their retained log). | M | M | ADR-10; one bounded retention for the refund topic and its DLQs, whose value is still open in §6 (an e2e gate item, E3); the §14.9 erasure map. | Data protection owner |

---

# 5. Glossary

Business terms are defined in the BRDs and not restated: [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary), [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary), and [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement). SDD terms:

| Term | Definition |
|------|------------|
| BRD key | The short capital name of a source BRD (REFUNDS, LOYALTY) carried by every BRD reference in this SDD, for example `REFUNDS/UC-04` or REFUNDS OI-06. An open item without a key is this SDD's own (chunk 18); a CL-NN is this SDD's clarification record of that ID in the decision log. Business rules and acceptance criteria are cited by the BR-n and AC-n labels written in the BRD use cases. |
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
| Tenant settings | The per-tenant time zone, currency, locale, points earn rate, payout retry window, and retention settings held in Helm values keyed by `tenant_id` (§11.2). |
| Tenant ref (`tenant_ref`) | A keyed hash of `tenant_id` written in every log line and used as a metric label, so telemetry can isolate a tenant without the raw id (§11.4). |
| Lease | The time-bounded claim a payout-service worker holds on a payout in `SENDING`; an expired lease makes the payout due again (§17.2). |
| Payout watchdog | The refund-service job that flags approved requests with no payout outcome after the §17.2 retry window plus one hour (§17.1). |
| Member purchase | A purchase POS Records reports for a member, recorded once by loyalty-service with its receipt number, amount, date, and points earned, which may be 0 (§17.4). |
| Pending take-back | A take-back recorded as `PENDING_EARN` because POS Records has not reported the refunded purchase yet; it is kept until the import records the purchase and applies it (§17.4). |
| Break-glass | Time-boxed, approved, and audited access to production data outside the web app (§20.3). |
| Take-back | A points movement of type `TAKEN_BACK` that removes points earned on a purchase once a refund of it is paid; how many follows [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3 (§17.4). |
| Reference number | The human-readable identifier of a refund request given at submission, unique per tenant; its format is set in the §17.1 Tables Design. |
| Purchase reference | The LOYALTY name of the identifier of a POS purchase; a paid refund finds its purchase through the receipt number POS Records reports with each member purchase (§17.4). |
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
