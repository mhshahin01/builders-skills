<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 1. Executive Summary

The Refunds Platform is the technical solution for two source BRDs (chunk 00 § Document Lineage): the Refunds Portal (REFUNDS), where customers request and track refunds for branch purchases, branch managers decide on them, and approved refunds are paid back to the original card; and Loyalty Points (LOYALTY), where members see their points balance and history, and points earned on a purchase are taken back when that purchase's refund is paid. The two products share their customers, the POS Records source, and one refund-to-points dependency ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)), so they are designed as one platform.

Technically it is a hybrid architecture (ADR-01). One core deployable, `refunds-platform-core`, holds the refund-service and loyalty-service modules as a modular monolith (DDD modules, hexagonal inside, one PostgreSQL schema per module). Two separately deployed services, payout-service and notification-service, isolate the two external-provider edges: CardPay payouts and MsgHub messages. Every state change that leaves a module travels as an event on Kafka through a transactional outbox; synchronous calls are limited to client requests through the API gateway and to external providers. Identity is Keycloak (one realm), the backend is Java 21 / Spring Boot, and the web app is Angular.

**Project type:** Greenfield. The refund process is paper-based today ([REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary)) and neither BRD names an existing codebase; POS Records, CardPay, and MsgHub are existing external systems reached only through adapters.

Core technical capabilities at a glance:

- Refund request lifecycle with a state machine, branch-scoped decisions, and a full status history (refund-service).
- Exactly-once payout effect per approved refund, with the ADR-10 retry window and a failure signal back to the branch (payout-service).
- Customer email and SMS on each refund outcome, with no customer contact data on the event bus (notification-service).
- A points ledger of append-only movements, with take-back movements driven by the refund-paid event (loyalty-service).

Key technical bets and trade-offs:

- **Hybrid over microservices:** refund and loyalty are low-volume, stable contexts ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts): about 1,200 requests a month), so they share one deployable; the provider-facing parts get their own failure domain and scaling. Trade-off: the two modules release together until an extraction trigger fires (ADR-01).
- **Choreography over orchestration:** the refund, payout, and points steps form a short saga of four facts with one owner each; no central orchestrator is needed (ADR-05).
- **Idempotency as the money guarantee:** one payout row per refund plus a provider idempotency key realise REFUNDS/NFR-01, "never lost or paid twice" (ADR-10).

---

# 2. Scope

## 2.1 In Scope

Business scope is owned by the BRDs and is not restated: [REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) and [LOYALTY 04 § In Scope](../brd-loyalty-points/04-scope-and-personas.md#in-scope). Solution-level delta:

- Three deployables: `refunds-platform-core` (refund-service and loyalty-service modules), payout-service, and notification-service (§13).
- Two Kafka topics with outbox publishing and inbox deduplication (§14).
- Six synchronous external API contracts, held as `TBD - external` until the provider documentation is supplied (§15).
- One Keycloak realm with the `CUSTOMER`, `MEMBER`, and `BRANCH_MANAGER` roles and the `tenant_id`, `branch_id`, and `member_id` claims (§16).
- One responsive Angular web app with customer, member, and branch manager areas, behind an API gateway.
- Points earn movements ingested from the POS Records member purchases, the source of the balance shown in [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history).
- The daily branch refund report ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)), served from refund-service data.

## 2.2 Out of Scope

BRD exclusions: [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) and [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope). Solution-level delta:

- Native mobile apps: "Web and Mobile" in [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) is served by the responsive web app (A-7).
- A staff-account administration UI: `BRANCH_MANAGER` accounts are managed in the Keycloak admin console (§16.6).
- A loyalty enrollment flow: no BRD use case covers it (A-5).
- A BI tool or analytics store: the only report is the daily branch refund report.

---

# 3. Assumptions

BRD assumptions are referenced, not restated: [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions). Technical assumptions:

1. **A-1 Greenfield:** no existing refund or loyalty code is extended; POS Records, CardPay, and MsgHub are reached only through their APIs.
2. **A-2 On-premises Kubernetes:** the platform runs on an on-premises Kubernetes cluster. Neither BRD states hosting; Kafka and Keycloak are the on-premises defaults (§6).
3. **A-3 One tenant today:** one retailer operates the platform. Every record still carries `tenant_id`, so a second retailer needs no schema change (ADR-03).
4. **A-4 Receipt number is the purchase reference:** the purchase reference in the POS member-purchase feed ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)) is the receipt number customers enter (REFUNDS 02 Assumption 1), so a paid refund can be matched to the purchase that earned points. **[NEEDS CLARIFICATION: confirm with the Retail IT team that the loyalty purchase reference equals the receipt number.]** The platform identifies a purchase by (branch, receipt number), which is correct whether POS Records numbers receipts per branch or per retailer.
5. **A-5 Customer-to-member link:** a signed-in customer's loyalty membership is carried as a `member_id` claim on the Keycloak token. **[NEEDS CLARIFICATION: how, and by whom, a customer account is linked to a loyalty member number; no BRD use case covers enrollment.]**
6. **A-6 Original payment reference:** the POS receipt lookup returns the reference of the original card payment, which CardPay needs to pay back to the same card (REFUNDS 02 Assumption 2). **[NEEDS CLARIFICATION: confirm with the Retail IT team and CardPay; REFUNDS 08 lists receipt, items, amounts, branch, and purchase date only.]**
7. **A-7 Mobile is the responsive web app:** "Web and Mobile" in [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) is the responsive web app ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)). **[NEEDS CLARIFICATION: whether an existing retailer mobile app must call these APIs in this release; [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) lists push notifications in the mobile app as a future enhancement.]**
8. **A-8 One currency per purchase:** each receipt has one currency, taken from POS Records; points use the rate in [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary).
9. **A-9 One delivery team:** one team builds and runs the platform in this release. Neither BRD states team size. With two or three teams the ADR-01 choice still holds, because the provider edges already deploy separately; a second team owning loyalty is an ADR-01 extraction trigger.

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | A payout call times out with an unknown outcome and is re-sent, paying twice (REFUNDS/NFR-01; the payment provider is a hard dependency, [REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies)). | M | H | One payout per refund (unique `refund_id`), the same `Idempotency-Key` on every attempt, status check before a re-send (ADR-10). | [NEEDS CLARIFICATION: risk owner] |
| R-02 | POS receipt data lacks the original payment reference, so CardPay cannot pay back to the original card (A-6). | M | H | Confirm the POS and CardPay contracts (API-01, API-02) before build; fallback is a CardPay lookup by receipt, if CardPay offers one. | [NEEDS CLARIFICATION: risk owner] |
| R-03 | The loyalty purchase reference differs from the receipt number, so paid refunds cannot be matched to earned points (A-4; cross-BRD dependency REFUNDS to LOYALTY). | M | M | Confirm with the Retail IT team; loyalty-service parks unmatched take-backs instead of dropping them (§17.4). | [NEEDS CLARIFICATION: risk owner] |
| R-04 | The points to take back for a partial refund are not defined: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1 allows a partial amount, [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1 takes back the purchase's points. A wrong rule breaks LOYALTY/NFR-01. | M | M | Proposed rule flagged in §17.4 as a BRD follow-up for the LOYALTY owner. | [NEEDS CLARIFICATION: risk owner] |
| R-05 | Seasonal sales triple refund requests for about three weeks (REFUNDS/NFR-03), with a matching rise in messages. | H | L | Horizontal autoscaling of the core deployable and notification-service; asynchronous messaging absorbs bursts (§18.3). | [NEEDS CLARIFICATION: risk owner] |
| R-06 | Lost paper records ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges)) reappear as lost events or messages. | L | M | Outbox and inbox on every edge, dead-letter queues with alarms, and a full status history per request (§14.6). | [NEEDS CLARIFICATION: risk owner] |
| R-07 | The two modules of the core deployable share one failure domain: a loyalty defect can take refund endpoints down. | L | M | Separate schemas and thread pools per module, readiness on the database only so a module's broker or consumer fault never takes the pod out of service (§11.3), and the ADR-01 extraction trigger. | [NEEDS CLARIFICATION: risk owner] |
| R-08 | Refund intake calls POS Records synchronously at [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 2 and 5 with no fallback, so every POS Records outage is disruption counted against REFUNDS/NFR-02. | M | M | Agree an availability commitment and maintenance windows for the receipt lookup with the Retail IT team as part of API-01; circuit breaker and a plain-language 503 (§12 INT-03); POS-caused minutes reported separately (§18). | [NEEDS CLARIFICATION: risk owner] |
| R-09 | A signed-in customer who knows or guesses a receipt number sees that purchase's lines and can file a refund on it, claiming its items ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2) and, once paid, taking back the purchaser's points; the money still goes to the original card (REFUNDS 02 Assumption 2). | M | M | Minimal lookup response, per-customer lookup limit, and alert (§17.1); proof of possession (a second receipt fact entered with the number) is a BRD follow-up for the REFUNDS owner because it changes [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1. | [NEEDS CLARIFICATION: risk owner] |

---

# 5. Glossary

Business terms are defined in the BRDs and are not restated: [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary), [REFUNDS 03 § Definitions & Important Details](../brd-refunds-portal/03-definitions-and-domain-concepts.md#definitions--important-details), [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary), and [LOYALTY 03 § Definitions & Important Details](../brd-loyalty-points/03-definitions-and-domain-concepts.md#definitions--important-details). The two BRDs define no term with two meanings. Technical terms added by this SDD:

| Term | Definition |
|------|------------|
| ABAC | Attribute-based access control: a rule on an attribute of the caller and the record (own records, own branch). |
| ADR | Architecture Decision Record (§10). |
| API gateway | The edge component that validates tokens, resolves the tenant, rate-limits, and routes requests (§6). |
| Core deployable | `refunds-platform-core`, the one deployable that holds the refund-service and loyalty-service modules (ADR-01). |
| DLQ | Dead-letter queue: the topic where a consumer parks a message it cannot process, with an alarm and a redrive procedure. |
| Hybrid architecture | A modular monolith core plus separately deployed services for the parts with different failure or scaling needs. |
| Idempotency-Key | Request header that makes a retried write return the first result instead of acting twice. |
| Inbox | Per-consumer table of processed `event_id` values; it turns at-least-once delivery into an exactly-once effect. |
| JWT | JSON Web Token, the access token Keycloak issues. |
| Module | A bounded context inside the core deployable, with its own schema and ports; it shares no tables and makes no calls into another module. |
| OIDC / PKCE | OpenID Connect, and Proof Key for Code Exchange, the browser sign-in flow used by the web app. |
| Outbox | A table written in the same database transaction as the state change; a relay publishes its rows to Kafka after commit. |
| Payout attempt | One call to CardPay for a payout; a payout has one or more attempts inside its retry window. |
| Problem Details | RFC 9457 error body (`application/problem+json`) with an `errorCode` extension. |
| Retry window | The window after the first payout attempt during which payout-service keeps retrying; its length is set in ADR-10 ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1). |
| Take-back movement | The negative points movement recorded when a purchase's refund is paid (LOYALTY 03 § Points movement). |
| UUIDv7 | Time-ordered UUID used for every primary key and event id. |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
