<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Portal
-->

# 1. Executive Summary

The Refunds Portal is a responsive web application and one backend deployable that record refund requests for branch purchases, route each request to its branch manager for a decision, pay approved refunds back to the original card through the payment provider (CardPay Ltd), and message customers by email and SMS through the notification partner (MsgHub). Receipts are read from POS Records while the customer waits. The business problem, objectives, and volumes are stated in the [BRD Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary) and [Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives); this section states the technical answer.

**Project Type:** Greenfield. Refunds are handled on paper and by phone today ([BRD Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary)), so no refunds system or codebase is extended; POS Records, CardPay, and MsgHub are existing external systems reached through adapters.

The backend is a **modular monolith** (ADR-01): DDD modules for refund requests, payouts, and notifications (§13), each hexagonal and owning one schema in a single PostgreSQL database, packaged as one container image and deployed with one Helm chart on Kubernetes. A module changes another module's state only through domain events recorded in a transactional outbox and dispatched in-process after commit; calls to the payment provider and the notification partner leave the process only through that outbox, so a crash or a provider outage never loses a payout or a message. The primary technical objectives are no lost request and no lost or duplicate payout (NFR-01), availability at any time (NFR-02), and seasonal peaks without noticeable slowdown (NFR-03), with every request visible only to its customer and their branch's manager (NFR-04).

Core technical capabilities at a glance:

- Receipt eligibility check against POS Records (refund window, items already refunded) and transactional recording of each request with a customer-facing reference number.
- A refund request state machine (Submitted, Approved, Rejected, Cancelled, Paid) with optimistic locking, so a cancellation and a decision cannot both win.
- A branch-scoped decision queue and a daily branch report, behind an own-branch authorization gate.
- Idempotent payout execution (one payout per refund request) with retries and escalation to the branch manager.
- Outbox-driven customer messages by email and SMS.

Key technical bets and trade-offs:

- **Modular monolith, not microservices (ADR-01).** The volume is low and one team builds the release, so one deployable avoids a broker, service-to-service security, and distributed failure modes. Trade-off: the modules scale and release together; module boundaries, the outbox, and logical event channels keep a later extraction cheap.
- **Outbox-backed domain events between modules, no broker (ADR-02, ADR-05).** Delivers Business Objective 2 (no lost requests) and NFR-01 with at-least-once dispatch and inbox deduplication on PostgreSQL alone. Trade-off: event throughput is bounded by the database; a broker arrives with the first extraction trigger of ADR-01.
- **Payout idempotency is the load-bearing money control (NFR-01).** A payout is unique per refund request and every provider call reuses the payout's idempotency key; an unknown outcome is resolved before any retry. Trade-off: this depends on CardPay capabilities that are not documented yet (API-02, R-03).
- **Business Objective 1 (shorter time to payout) is met by automation.** The payout starts when the manager approves, and the time to decision and to payout are measured (§17.1 metrics, daily branch report).

---

# 2. Scope

The business scope is the BRD's: [In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) and [Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope). This section adds only the solution-level refinements.

## 2.1 In Scope

- The backend deployable with the refund, payout, and notification modules (§13) and its REST API under `/v1` for the customer and branch-manager screens (§17.1).
- A responsive single-page web application for customers on phones and computers ([BRD UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)) and for branch managers.
- Anti-corruption adapters for POS Records, CardPay, and MsgHub (§12, §15).
- Identity and role set-up in the platform IAM for the two personas (§16).
- The daily branch refund report of [BRD Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics), served by the refund module (§17.1).

## 2.2 Out of Scope

- The BRD's out-of-scope items, cited above; online-shop refunds stay on the [BRD Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist).
- A native mobile app. **[NEEDS CLARIFICATION: does "Mobile" in the title of [UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) mean the responsive web portal on phones (BRD UI/UX Expectations), or a native app ("the mobile app" in the Future Enhancements of the same use case)? This design covers the responsive web portal only.]**
- A message broker, a cache, and a BI tool: not needed at this volume (ADR-02, §6); each arrives only with a trigger named in ADR-01 or §6.
- Migration of paper refund requests still open at go-live. **[NEEDS CLARIFICATION: are open paper requests migrated into the portal, or finished on paper?]**

---

# 3. Assumptions

The business assumptions are the BRD's ([Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints)). Technical assumptions of this design:

1. **Synchronous receipt lookup:** POS Records answers a lookup by receipt number while the customer waits, returning the items, amounts, branch, and purchase date named in [BRD Integrations](../brd-refunds-portal/08-integrations.md#integrations). If false, the receipt check of [UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 2 needs an asynchronous or cached design.
2. **Refund to the original card is addressable:** CardPay can pay a refund back to the card of the original purchase from a reference the platform holds (receipt number or original payment reference), as [BRD Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 1 requires. If false, the payout design (§17.2) changes (R-02, R-04).
3. **Customer identity:** customers sign in with an identity in the platform IAM (§6) whose profile carries the email address and mobile number used for their messages.
4. **One branch per manager:** each branch manager belongs to exactly one branch, carried as a claim in the identity token ([BRD Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors)).
5. **Shared branch identifiers:** POS Records and the IAM identify a branch with the same identifier, so the branch of a receipt can be compared with the branch claim of a manager.
6. **One tenant at go-live:** the portal serves one retailer; tenancy keys exist from day one (ADR-03), with one tenant provisioned.
7. **One currency per receipt:** every receipt's amounts are in one currency, and its refund is paid in that currency.

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | Branches keep taking paper requests alongside the portal during roll-out, so requests are still lost and invisible ([BRD Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) 1). | M | M | **[NEEDS CLARIFICATION: mitigation strategy for R-01]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-02 | Hard dependency on CardPay supporting refunds to the original card ([BRD Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 1); without it no approved refund can be paid. | M | H | Confirm the capability from CardPay's API documentation before build (API-02, §15.6). | **[NEEDS CLARIFICATION: risk owner]** |
| R-03 | A payout call that times out has an unknown outcome; a blind retry can pay twice (NFR-01). | M | H | One payout per refund request, one idempotency key for all its attempts, and no new attempt while the outcome is unknown (§17.2); depends on CardPay idempotency or a status query (API-02, API-03). | **[NEEDS CLARIFICATION: risk owner]** |
| R-04 | The original card cannot be addressed: the POS data named in [BRD Integrations](../brd-refunds-portal/08-integrations.md#integrations) carries no payment reference. | M | H | **[NEEDS CLARIFICATION: mitigation strategy for R-04: POS Records returns the original payment reference (API-01), or CardPay resolves the card from the receipt (API-02)]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-05 | A POS Records outage blocks every new request (the receipt check of [UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 2; criticality Critical in [BRD Integrations](../brd-refunds-portal/08-integrations.md#integrations)). | M | M | Timeout, bounded retries, and a circuit breaker on API-01; the customer is told to try again later (§12 INT-01). | **[NEEDS CLARIFICATION: risk owner]** |
| R-06 | Receipt numbers are not bound to a customer identity, so anyone who knows a receipt number can request its refund; the payout still goes only to the original card ([BRD Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) 2). | M | L | **[NEEDS CLARIFICATION: mitigation strategy for R-06]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-07 | Module boundaries erode inside the single deployable (cross-schema queries, direct calls), making the ADR-01 extraction expensive. | M | M | Module boundary rules checked in CI (AP-05); one schema per module with no cross-schema grants (§11.1). | **[NEEDS CLARIFICATION: risk owner]** |
| R-08 | The seasonal peak ([BRD Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 2, NFR-03) exceeds the capacity of the deployable or the database. | L | M | Stateless replicas scale horizontally (AP-01); capacity targets in §18. | **[NEEDS CLARIFICATION: risk owner]** |

---

# 5. Glossary

Business terms are defined in the [BRD Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and are not repeated here. Technical terms and acronyms used in this SDD:

| Term | Definition |
|------|------------|
| ADR | Architectural Decision Record; the ADR rows are in §10. |
| Anti-corruption adapter | An outbound adapter that translates an external system's model into the module's own model, so provider terms never leak into the domain. |
| AP | Architecture Principle; the AP rows are in §9. |
| API-NN | Identifier of a synchronous integration contract in §15. |
| BI | Business intelligence (reporting and analytics tooling). |
| BRD | Business Requirements Document; the source of this SDD ([BRD master](../brd-refunds-portal/refunds-portal-brd-master.md)). |
| Bulkhead | A resource limit (threads, connections) per downstream system, so a slow provider cannot exhaust the whole application. |
| CI/CD | Continuous integration and continuous delivery pipelines. |
| Circuit breaker | A guard that stops calls to a failing dependency for a cool-down period and fails fast instead. |
| Correlation id | An opaque identifier carried on every call and event of one business interaction, for tracing; it carries no tenant data or PII. |
| CORS | Cross-Origin Resource Sharing; the browser rule set that decides which web origins may call the API. |
| CVE | Common Vulnerabilities and Exposures; the public identifier of a known vulnerability. |
| DB | Database; here the single PostgreSQL database of the deployable (§6). |
| DDD | Domain-Driven Design; each module is one bounded context. |
| Dead-letter table | A table holding events or messages that failed processing after their retries, with an alert and a redrive procedure. |
| Deployable | One unit that is built, packaged, and deployed together; this system has one backend deployable. |
| Domain event | A past-tense fact published by a module when its state changes, in SCREAMING_SNAKE_CASE (§14). |
| DTO | Data transfer object; a request or response shape, written as a Java record. |
| EDA | Event-driven architecture. |
| Envelope | The standard fields every domain event carries around its payload (§14.3). |
| Helm chart | The Kubernetes packaging and configuration unit for one deployable. |
| Hexagonal architecture | Ports and adapters: the domain core depends only on ports; REST controllers, event handlers, persistence, and provider clients are adapters. |
| HLA | High-level architecture (§8.3). |
| IAM | Identity and access management; Keycloak (§6). |
| Idempotency key | A client-chosen key that makes a repeated write return the original result instead of acting twice. |
| Inbox | The per-consumer record of processed event ids, used to apply each event once. |
| INT-NN | Identifier of an integration row in §12. |
| JDBC | Java Database Connectivity; the database access layer instrumented for tracing. |
| JWT | JSON Web Token; the signed access token Keycloak issues. |
| Log levels | DEBUG, INFO, WARN, ERROR: the severity of a log entry; `tenant_id` and PII are never logged at INFO level (§11.4). |
| Logical channel | The named stream of one producing module's events (§14.4); dispatched in-process today, a broker topic after extraction. |
| Modular monolith | One deployable made of modules with strict boundaries, private schemas, and explicit ports, so each module can later become a service. |
| Module | One bounded context inside the deployable: refund, payout, or notification (§13). |
| NFR | Non-functional requirement ([BRD Non-Functional Requirements](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)). |
| OCI image | A container image in the Open Container Initiative format. |
| OI-NN | Identifier of an open item in §23. |
| OIDC | OpenID Connect; the sign-in protocol on top of OAuth 2.0. |
| OpenTelemetry | The vendor-neutral standard and SDK for traces, metrics, and logs. |
| Optimistic locking | Concurrency control by a version number: a write based on a stale version fails instead of overwriting a newer change. |
| Outbox (transactional) | A table in the producing module's schema where an event is written in the same transaction as the state change; a relay dispatches it after commit, so no dual write exists. |
| Permission token | The runtime name of one allowed action, `[module].[resource].[action]` (§16.11). |
| PII | Personally identifiable information. |
| PK | Primary key. |
| PKCE | Proof Key for Code Exchange; protects the OIDC authorization code flow of a browser application. |
| POS | Point of Sale; POS Records is the retailer's system of receipts. |
| Problem Details | The RFC 9457 JSON error format (`application/problem+json`), extended with an `errorCode`. |
| RDBMS | Relational database management system; PostgreSQL here (§6). |
| RED metrics | Rate, errors, and duration per endpoint or handler. |
| Relay | The in-process component that reads committed outbox rows and dispatches them to the consuming modules' handlers. |
| REST | Resource-oriented HTTP API style with JSON bodies. |
| SDK | Software development kit; a client library. |
| SIT | System integration testing environment (§19). |
| SLO | Service level objective; a measurable reliability target (§18). |
| SPA | Single-page application; the Angular web front end. |
| Tenant | The retailer organisation whose data is isolated by `tenant_id`; one tenant at go-live (ADR-03). |
| TLS | Transport Layer Security; the encryption of HTTPS. |
| UAT | User acceptance testing environment (§19). |
| UC-NN | Identifier of a BRD use case, cited with a link to its BRD heading. |
| UC part citations | `step N`, `A1`, `E1`, `BR-N`, `AC-N` after a UC link: a Main Flow step, an alternate or exception flow, a business rule, or an acceptance criterion of that BRD use case. |
| URI | Uniform Resource Identifier; the path of an endpoint (§15.1). |
| UTC | Coordinated Universal Time; the time zone of every stored and exchanged timestamp. |
| UUID, UUIDv7 | Universally unique identifier; UUIDv7 is the time-ordered variant used for every primary key. |
| VM | Virtual machine. |

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
