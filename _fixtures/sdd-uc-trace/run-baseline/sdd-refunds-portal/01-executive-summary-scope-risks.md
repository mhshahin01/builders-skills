<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Portal
-->

# 1. Executive Summary

The Refunds Portal is a web system in which customers request and track refunds for branch purchases, branch managers decide on them, and approved refunds are paid back to the original card through the payment provider. Technically it is one Java 21 / Spring Boot backend deployable (`refunds-portal-backend`) organised as DDD modules with hexagonal structure inside each module, one Angular frontend (`refunds-portal-web`) with a customer area and a branch-manager area, and one PostgreSQL database with one schema per module. The business context is in the BRD ([BRD 01](../brd-refunds-portal/01-executive-summary-and-context.md)) and is not restated here.

**Project Type:** Greenfield. There is no existing codebase to extend: refund requests are handled on paper and by phone today ([BRD 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary)).

The architecture style is a **modular monolith** (ADR-01, §8.1): modules talk through in-process ports for queries and through domain events for state changes, and every event or provider call that leaves a module's transaction goes through a transactional outbox in PostgreSQL. There is no message broker in this release (ADR-02). The primary technical objective is money safety: a refund is paid exactly once to the original card, and no request is ever lost ([BRD 10 NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)).

Core technical capabilities at a glance:

- Receipt lookup against the Point-of-Sale records with refund-window and item-once eligibility checks (UC-01, §17.1).
- A refund request aggregate with an enforced lifecycle and optimistic locking, so a cancellation and a decision on the same request cannot both succeed (UC-03 E1, §17.1).
- Branch-scoped decisions (full, partial, reject) with a status history that doubles as the decision audit trail (UC-04, §17.1).
- Exactly-once payout dispatch to CardPay with durable retries and escalation (UC-04 E1, §17.2, ADR-08).
- Customer email and SMS messages through MsgHub, driven by lifecycle events (§17.3).
- Tenant-aware, role- and scope-checked APIs behind an API gateway and the platform IAM (§16).

Key technical bets and trade-offs:

- **One deployable instead of services.** The scope is small and one team builds it (§8.1.2), so a modular monolith avoids a broker, network hops between parts, and several release pipelines. The cost is a shared failure and release unit; module boundaries, ports, and the outbox keep extraction cheap when an ADR-01 trigger fires.
- **Outbox everywhere money or messages leave the process.** Payout and message dispatch run from committed state, never from inside a request thread, which is what NFR-01 needs. The cost is a relay and dispatch latency of seconds instead of milliseconds.
- **Payout exactly-once depends on the provider.** The payout id is the idempotency key for every attempt (ADR-08). Whether CardPay honours it, or offers a status query, is not known until its documentation is supplied (§15.6); R-03 tracks this.
- **Multi-tenant from day one, one tenant at launch.** The shared schema carries `tenant_id` (ADR-04) although the retailer is the only tenant today; the cost is a column and an index prefix per table, the gain is onboarding another brand without a schema change.

---

# 2. Scope

## 2.1 In Scope

The business scope is [BRD 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope), all four bullets; it is not restated. This SDD adds the solution-level scope below.

- The `refunds-portal-backend` deployable with the modules listed in §13, realising UC-01 to UC-04 (UC-05 is merged into UC-04, [BRD 05 § Use Case Summary](../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary)) and the branch refund report ([BRD 09](../brd-refunds-portal/09-reporting-and-analytics.md)).
- The `refunds-portal-web` frontend: a responsive customer area ([BRD 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)) and a branch-manager area, in one Angular application.
- Anti-corruption adapters for the three integrations of [BRD 08](../brd-refunds-portal/08-integrations.md), with outbox-driven dispatch, retries, and escalation (§12, §15).
- IAM integration: sign-in for customers and branch managers, role and branch claims in the access token (§16).
- Platform plumbing inside the deployable: per-module transactional outbox and relay, inbox deduplication, schedulers, health and readiness endpoints, Prometheus metrics, OpenTelemetry tracing, JSON logs.
- Packaging and deployment: one OCI image and one Helm chart for the backend deployable (ADR-09).

## 2.2 Out of Scope

The business exclusions of [BRD 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) hold, both bullets. Technical exclusions for this release:

- A message broker. Cross-module events stay in-process through the outbox (ADR-02); a broker arrives with the first module extraction.
- A native mobile app. The customer area is a responsive web app. **[NEEDS CLARIFICATION: UC-02 is titled "Web and Mobile" and its future enhancement mentions push notifications "in the mobile app"; confirm that the customer channel for this release is the responsive web app only.]**
- A BI or reporting tool. The branch refund report is served in-app from the refund-requests module (§17.1).
- An administration UI for branch-manager accounts. No BRD persona or use case covers it; accounts and branch assignments are managed in the IAM. **[NEEDS CLARIFICATION: who provisions branch-manager accounts and their branch assignment (see §16.6)?]**
- Payout reconciliation against CardPay settlement data. **[NEEDS CLARIFICATION: is a periodic reconciliation with CardPay needed to evidence NFR-01's business measure (zero missing or duplicate payouts per month)? If yes it becomes a payouts-module job and a new integration API.]**

---

# 3. Assumptions

The business assumptions are in [BRD 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and are not restated. Technical assumptions of this SDD:

1. **One tenant at launch:** the retailer operating the branches of [BRD 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) is the only tenant; every table and event still carries `tenant_id` (ADR-04).
2. **Online receipt lookup:** the Point-of-Sale records system answers a receipt lookup synchronously while the customer waits, returning the receipt's lines, amounts, branch, and purchase date. **[NEEDS CLARIFICATION: confirm Retail IT exposes an online lookup (not a batch export) and its availability hours.]**
3. **Original payment reference is obtainable:** either the Point-of-Sale record or CardPay can supply the reference of the original card payment, so a payout can target that card (BRD 02 Assumption 2). BRD 08 does not list it among the data exchanged with the Point-of-Sale records. **[NEEDS CLARIFICATION: source of the original payment reference (POS lookup, API-01, or a CardPay lookup).]**
4. **Idempotent payouts at the provider:** CardPay accepts an idempotency key on refund requests, or offers a status query by our payout id, so a retried attempt can never pay twice (ADR-08). **[TBD - EXTERNAL: confirm from the CardPay API documentation, API-03 and API-06.]**
5. **Customers sign in with an account:** customers authenticate in the platform IAM before looking up a receipt, requesting, tracking, or cancelling, and their account holds a verified email address and mobile number used for messages. **[NEEDS CLARIFICATION: customer identity model: self-registered IAM account, or a guest flow (for example receipt number plus one-time code)? This decides §16.6 and the contact source for API-02.]**
6. **One branch per branch manager:** a branch manager manages exactly one branch ([BRD 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors)), and that branch is available to the backend as an access-token claim. **[NEEDS CLARIFICATION: source of the branch assignment (IAM user attribute or group, or a branch directory owned by Retail IT) and whether a manager can cover a second branch.]**
7. **One currency per receipt:** every amount on a receipt is in one currency and the payout is made in that currency; amounts are always carried with their currency code (BRD 11). **[NEEDS CLARIFICATION: confirm single-currency operation.]**
8. **Branch identifiers come from the Point-of-Sale records:** the branch of a request is the branch on its receipt (BRD 03 § Branch ownership); the portal keeps no separate branch master data. **[NEEDS CLARIFICATION: source of branch display names for the branch-manager area and the report.]**

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | Refunds handled outside the portal (paper or in person, [BRD 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) item 1) stay invisible to customers and to the portal's item-once check, so one item can be refunded twice (NFR-01). | M | H | **[NEEDS CLARIFICATION: mitigation strategy for R-01: does the Point-of-Sale record in-branch returns so API-01 can mark those lines non-refundable, or do branches stop in-person refunds at go-live?]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-02 | CardPay cannot refund to the original card, or the original payment reference is not available ([BRD 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) item 1, a hard dependency; Assumption 2; §3 assumption 3). Payouts would be impossible. | M | H | Confirm the capability from the CardPay documentation (API-03) and the data from Retail IT (API-01) before build. **[NEEDS CLARIFICATION: mitigation strategy for R-02 if either answer is no.]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-03 | A CardPay call times out after the provider has paid, and the retry pays again (NFR-01). | M | H | ADR-08: one payout per approved request, payout id as the idempotency key on every attempt, status check before a retry when the provider offers one. Depends on §3 assumption 4. | **[NEEDS CLARIFICATION: risk owner]** |
| R-04 | The Point-of-Sale records are unavailable, so customers cannot submit requests (BRD 08 criticality Critical). | M | H | Timeout, circuit breaker, and an actionable error message (BRD 11) on API-01. **[NEEDS CLARIFICATION: mitigation strategy for R-04 beyond fail-fast: Point-of-Sale availability commitment from Retail IT.]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-05 | Receipt-number probing: a signed-in user tries receipt numbers that are not theirs, sees purchase lines (NFR-04), and requests refunds for them (the payout still goes to the original card). | M | M | Gateway rate limit on receipt lookups; the lookup returns only what UC-01 step 2 needs. **[NEEDS CLARIFICATION: mitigation strategy for R-05: should a receipt be bound to the requester, for example by a second purchase detail?]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-06 | A request waits with no signal when its branch manager is absent: [BRD 01 § Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives) objective 1 sets a payout-time target, but the BRD defines no reminder, deadline, or delegate for undecided requests. | M | M | **[NEEDS CLARIFICATION: mitigation strategy for R-06: decision reminders or a delegate role?]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-07 | An escalated payout (UC-04 E1) has no resolving actor or use case, so the request can stay Approved indefinitely. | M | M | **[NEEDS CLARIFICATION: mitigation strategy for R-07: who acts on an escalated payout, and with what options (retry later, alternative payout, cancel)?]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-08 | Hosting is undecided (on-premises or cloud), which blocks the ingress, secrets manager, IAM hosting, and the broker chosen at extraction (§6). | H | M | Decide hosting before the environments are built (§6, ADR-09). | **[NEEDS CLARIFICATION: risk owner]** |
| R-09 | One deployable is one failure domain: a defect or resource exhaustion in one module (for example a message retry storm) degrades every module (NFR-02). | L | M | Separate executor pools and database connection limits per module and per provider adapter (bulkheads), circuit breakers on every provider call, ADR-01 extraction triggers. | **[NEEDS CLARIFICATION: risk owner]** |
| R-10 | Seasonal peaks (NFR-03) exceed the deployable's sized capacity. | L | M | Stateless deployable scaled horizontally; targets and sizing in §18. | **[NEEDS CLARIFICATION: risk owner]** |

---

# 5. Glossary

Business terms (refund request, refund window, partial refund, branch, payout) are defined in [BRD 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and are not restated. Technical terms and acronyms used in this SDD:

| Term | Definition |
|------|------------|
| ACL (anti-corruption layer) | An adapter that translates an external system's model and errors into the module's own model, so provider changes stay inside the adapter. |
| Adapter | In hexagonal architecture, the technology-specific code that plugs into a port: inbound (REST controller, event handler, scheduler) or outbound (persistence, provider client). |
| ADR-NN | Architecture decision record identifier; the decisions are summarised in §10. |
| Aggregate | A cluster of domain objects changed as one unit inside one transaction, with one root (for example `RefundRequest`). |
| Aggregate version | A per-aggregate counter incremented on every change; used for optimistic locking and carried as `aggregate_version` on events. |
| API gateway | The edge component that validates tokens, resolves the tenant, rate-limits, and logs requests before they reach the backend deployable. |
| API-NN | Identifier of a synchronous integration contract in §15. |
| AP-NN | Architecture principle identifier (§9). |
| AWS | Amazon Web Services; named only for the platform's broker default at extraction (SNS + SQS). |
| BCP 47 | The standard format of language tags (for example `en`, `ar`) used for message locales. |
| BI | Business intelligence (reporting tools). |
| Bounded context | A domain boundary inside which one model and one vocabulary apply; each module of §13 owns one. |
| Bulkhead | An isolated resource pool (threads, connections) per downstream dependency, so one slow dependency cannot exhaust shared resources. |
| Candidate (event status) | An event whose name is fixed and whose payload contract awaits ratification (§14.5). |
| CDN | Content delivery network. |
| CI/CD | Continuous integration and continuous delivery pipeline. |
| Circuit breaker | A guard that stops calling a failing dependency for a cool-down period after repeated failures. |
| Contact snapshot | The customer's email address, mobile number, and locale stored with a refund request at submission, read by notifications through API-02. |
| Correlation id | An opaque identifier carried across calls and events to tie one business interaction together in logs and traces; carries no tenant data or PII. |
| CORS | Cross-origin resource sharing, the browser rule that decides which web origins may call an API. |
| CPU | Central processing unit; used here for container resource requests and limits. |
| DB | Database. |
| DDD | Domain-driven design. |
| Dead-letter | The state of an event delivery or dispatch that failed its retries or is invalid; it is kept, alarmed, and redriven by runbook, never dropped (also DLQ, dead-letter queue). |
| DEBUG, INFO, WARN | Log levels, from most to least verbose; the logging rules of §11.4 refer to them. |
| Dispatcher | A scheduled component that claims due work rows (payouts, message dispatches) with row locking and calls the provider outside any database transaction. |
| Domain event | An immutable, past-tense fact published by the module that owns the aggregate (for example `REFUND_REQUEST_APPROVED`). |
| E.164 | The international telephone number format used for mobile numbers. |
| EDA | Event-driven architecture. |
| Envelope | The standard metadata wrapped around every event payload (§14.3). |
| ERD | Entity relationship diagram. |
| Escalation window | The period after the first failed payout attempt after which the branch manager is told (UC-04 E1). |
| Expand-contract | A migration approach that first adds the new schema elements, moves readers and writers, and removes the old elements only in a later release, so two application versions can run on one schema. |
| Flyway | The schema migration tool; versioned SQL files per module schema. |
| GDPR, PCI-DSS, ISO 27001, SOC 2 | Data-protection regulation, card-data security standard, and security-control frameworks checked per module in §17.X Compliance. |
| HA | High availability. |
| Helm chart | The Kubernetes packaging unit for one deployable. |
| Hexagonal architecture | Ports and adapters: the domain core depends only on ports; adapters implement them. |
| HLA | High-level architecture (§8.3). |
| HTTPS | HTTP over TLS. |
| IAM | Identity and access management; here Keycloak (§6). |
| Idempotency key | A client-chosen key sent with a write so a retried request has the effect of one request. |
| Inbox | A per-consumer-module table of processed `event_id` values, used to apply each event's effect once. |
| INT-NN | Integration identifier in §12. |
| ISO-4217 | The standard three-letter currency codes (for example `EUR`). |
| ISO-8601 | The standard date and time format used in every API and event. |
| Item claim | The refund-requests record that marks a receipt line as reserved by an open request or consumed by an approved one; it enforces the item-once rule of UC-01. |
| JSON Schema | The schema language used for event payload contracts (§14.9). |
| JWT | JSON Web Token; the signed access token issued by the IAM. |
| Key family | The set of identifiers an event is keyed and ordered by (§14.3). |
| KPI | Key performance indicator. |
| Liveness / readiness probe | Kubernetes health checks: liveness restarts a stuck container; readiness decides whether a replica receives traffic. |
| LLD | Low-level design, the document derived from this SDD. |
| Logical topic | A named event channel owned by one module (§14.4); in this release it is a column on the outbox, and it becomes a broker topic with the same name when a module is extracted. |
| Modular monolith | One deployable made of modules with enforced boundaries, each owning its bounded context and schema. |
| Module | A bounded-context unit inside the backend deployable; plays the role of a "service" in §13 and §17. |
| Module-boundary test | An automated build test that fails when one module uses another module's internal code or schema instead of its published ports and events. |
| NFR-NN, UC-NN, TI-NN | BRD identifiers of non-functional requirements, use cases, and technical inputs; cited, never restated. |
| OCI image | A container image in the Open Container Initiative format. |
| OIDC | OpenID Connect, the sign-in protocol on top of OAuth 2.0. |
| OpenAPI | The specification format for the backend's REST APIs. |
| OpenTelemetry | The tracing and telemetry standard and SDK. |
| Optimistic locking | Concurrency control that rejects a write when the aggregate version changed since it was read. |
| Outbox publication | One outbox row per event and subscribing module; the relay completes, retries, or dead-letters each one independently (§14.2). |
| Outbox relay | The component that reads committed outbox rows and delivers them to subscribers or dispatchers. |
| Outbox (transactional outbox) | A table written in the same transaction as the domain change; a relay publishes its rows only after commit, so there is no dual-write. |
| Permission token | The runtime name of an allowed action, checked by the backend (§16.11). |
| PII | Personally identifiable information. |
| PKCE | Proof Key for Code Exchange, the protection for the OIDC authorization-code flow used by the single-page app. |
| PK, FK, UK | Primary key, foreign key, unique key. |
| Port | An interface owned by a module's domain: inbound (use cases it offers) or outbound (what it needs from outside). |
| POS | Point of sale; "POS records" is the BRD 08 Point-of-Sale Records system owned by Retail IT. |
| Problem Details | RFC 9457 error format (`application/problem+json`) used by every HTTP error in this system (§11.7). |
| Prometheus | The metrics collection system scraping the deployable's metrics endpoint. |
| RDBMS | Relational database management system. |
| RED metrics | Rate, errors, and duration per endpoint or handler. |
| Reference number | The human-readable identifier of a refund request shown to the customer (UC-01 step 6), distinct from the internal UUIDv7 id. |
| REST | HTTP APIs over resources, with JSON bodies. |
| R-NN | Risk identifier (§4). |
| RTL | Right-to-left text direction (for example Arabic). |
| Semver | Semantic versioning (`major.minor.patch`), used for event schema versions. |
| SIT, UAT | System integration testing and user acceptance testing environments (§11.3, §19). |
| SLA | Service level agreement. |
| SLO | Service level objective. |
| SMS | Short message service, a text message to a mobile phone. |
| SNS + SQS | AWS notification and queue services; the platform's broker default on AWS when a module is extracted (ADR-02). |
| SPA | Single-page application; here the Angular frontend. |
| Tenant | An organisation whose data is isolated from other organisations' data; the retailer is the tenant at launch (ADR-04). |
| TLS | Transport Layer Security. |
| traceparent | The W3C Trace Context header that propagates the trace across HTTP calls. |
| UI, UX | User interface, user experience. |
| URI | Uniform resource identifier; the path of a REST endpoint. |
| UTC | Coordinated Universal Time; the time zone of every stored and transmitted datetime. |
| UUIDv7 | Time-ordered UUID used for every primary key and event id, generated by the application. |
| VM | Virtual machine. |
| WCAG | Web Content Accessibility Guidelines. |

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
