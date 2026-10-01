<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 1. Executive Summary

The Refunds Platform is one Java 21 / Spring Boot 3.5+ deployable, a modular monolith (ADR-01), that realises two business products: the Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY). Four modules, each one bounded context with its own PostgreSQL schema, sit behind one REST API: `refund` (refund requests and decisions), `payout` (payouts to the original card through CardPay), `notification` (customer email and SMS through MsgHub), and `loyalty` (points ledger, balance, and history).

Modules interact only in process: an `Internal (in-process)` port call where a command must commit with the caller (the payout instruction on approval, API-01), and in-process domain events for facts (§14.10), delivered after commit from a durable event publication log. No event leaves the deployable, so there is no message broker in this release (ADR-02). Writes to external providers are recorded in module dispatch tables in the business transaction and sent after commit with idempotency keys (ADR-09).

Core technical capabilities at a glance:

- Refund request lifecycle as an explicit state machine (Submitted, Approved, Rejected, Cancelled, Paid) from [REFUNDS 03 § Refund request lifecycle](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-request-lifecycle), with optimistic locking for the cancel-versus-decide race.
- Exactly-once payout effect: the payout instruction commits with the approval, and every CardPay call carries the payout ID as its idempotency key (REFUNDS/NFR-01, [REFUNDS 10 § NFRs](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)).
- Points ledger where the balance is the sum of movements ([LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement)), with points taken back on `RefundPaid` ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back when the purchase is refunded).
- Role and attribute authorization: own requests, own branch, own points (§16).

Key technical bets and trade-offs ([REFUNDS 01 § Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives), [LOYALTY 01 § Business Objectives](../brd-loyalty-points/01-executive-summary-and-context.md#business-objectives)):

- Request-to-payout in 3 days (REFUNDS objective 1) means no manual step after approval: the payout starts automatically from the approval transaction.
- No lost requests (REFUNDS objective 2) and a trusted balance (LOYALTY objective 1) mean every state change is a committed row, every fact a durable in-process event, and every listener idempotent.
- Modular monolith over microservices: about 1,200 requests a month with 3x seasonal peaks ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts)) need no independent scaling; ports and event DTOs keep each module extractable (ADR-01 trigger). The cost is one failure domain, contained with per-provider bulkheads (R-06).

**Project Type:** Greenfield - refunds are handled on paper today ([REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary)) and neither BRD names an existing codebase; POS records, CardPay, and MsgHub are external systems the platform integrates with, not code it extends.

---

# 2. Scope

## 2.1 In Scope

Business scope: [REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) and [LOYALTY 04 § In Scope](../brd-loyalty-points/04-scope-and-personas.md#in-scope). Solution-level refinements:

- One deployable with four modules (`refund`, `payout`, `notification`, `loyalty`) and one PostgreSQL database, one schema per module (§13).
- REST APIs (OpenAPI, `/v1`) for the customer and branch manager screens (REFUNDS SCR-01, SCR-02, MK-03) and the member screens (LOYALTY LP-01, LP-02).
- Integrations: CardPay payouts (INT-01), MsgHub email and SMS (INT-02), POS records receipt lookup and member purchase intake (INT-03).
- Points earning from member purchases received from POS records, which feeds [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history).
- The branch refund report API ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)).

## 2.2 Out of Scope

Business exclusions: [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) and [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope). Solution-level exclusions:

- A message broker, a cache tier, object storage, and a BI tool: not needed at this volume (§6, ADR-02).
- Account registration, loyalty enrolment, and staff account provisioning: done in the IAM outside the BRD use cases (§3 assumptions 1, 2, and 6).
- A native mobile app: the responsive web app serves phones (§3 assumption 5).

---

# 3. Assumptions

Business assumptions: [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions). Technical assumptions:

1. **Customer sign-in:** customers and members sign in to the platform's Keycloak realm before any refund or points screen; REFUNDS/NFR-04 (only the customer and their branch's manager see a request) needs an authenticated customer. **[NEEDS CLARIFICATION: [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) states no sign-in precondition; confirm that customers sign in before requesting a refund.]** **[NEEDS CLARIFICATION: is a mobile number required at registration, so every customer gets the SMS of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7?]**
2. **Member link:** a member's account carries the loyalty member ID as a token claim (`member_id`), and POS purchase records carry the same member ID ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)). Enrolment is outside both BRDs. **[NEEDS CLARIFICATION: which system and process write the POS member ID onto an online account, and how the member proves the membership; both BRDs are silent.]**
3. **One tenant today:** both BRDs describe one retailer; every row is still keyed by `tenant_id` (ADR-03).
4. **Message channels:** where a use case does not name the channel, the customer is told by email and SMS ([REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope): customer messages by email and SMS). This applies to [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2.
5. **Mobile:** "Web and Mobile" in [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) is served by the responsive web app on phones ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); a native app would reuse the same REST APIs. **[NEEDS CLARIFICATION: is a native mobile app in scope for this release?]**
6. **Staff accounts:** branch manager accounts are created by IAM administrators with the manager's branch as a token claim (`branch_id`); no BRD use case grants roles.
7. **Currency:** amounts use one currency per tenant, EUR today ([LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary): points per EUR spent).
8. **Time:** the 30-day refund window ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-1: refund only within 30 days of purchase) is evaluated by one domain function from the POS purchase timestamp and the submission time, both stored in UTC; a request is in time when it is submitted within 30 x 24 hours of the purchase timestamp. **[NEEDS CLARIFICATION: elapsed 30 x 24 hours, or 30 calendar days in the tenant's time zone (§11.5)? What does the Store refund policy v3 (REFUNDS 12 Appendix) say?]**

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | CardPay may not deduplicate a repeated payout request (a timeout, then a retry), which would pay a refund twice (REFUNDS/NFR-01). | M | H | Send the payout ID as the provider idempotency key, or query the payout status before a retry; confirm from the CardPay documentation (API-03). | [NEEDS CLARIFICATION: risk owner] |
| R-02 | Payouts depend on CardPay supporting refunds to the original card ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 1, Hard). | L | H | Confirm in the CardPay documentation before build (API-03); there is no other payout path. | [NEEDS CLARIFICATION: risk owner] |
| R-03 | The POS receipt data named in [REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations) (receipt number, items, amounts, branch, purchase date) may not identify the original card payment that CardPay needs for the payout. | M | H | Confirm the reference CardPay needs and whether POS supplies it (API-02, API-03). | [NEEDS CLARIFICATION: risk owner] |
| R-04 | Cross-BRD dependency: [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1 takes back the points of a refunded purchase, but a REFUNDS refund can cover some items or a lower amount ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1); the points taken back in that case are not defined, so balances may be wrong (LOYALTY/NFR-01). | H | M | `RefundPaid` carries the paid amount and the purchase reference so either rule can be applied; the rule is a BRD follow-up (§5 Glossary, §17.4). | [NEEDS CLARIFICATION: risk owner] |
| R-05 | A refund of a non-member purchase, or of a member purchase not yet received ([LOYALTY 02 § Assumptions](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions) 1: purchases known the same day), finds no earn movement to take back. | H | M | Unmatched take-backs are kept pending, applied when the purchase arrives, and expired after the wait of §17.4. | [NEEDS CLARIFICATION: risk owner] |
| R-06 | One deployable is one failure domain: a slow provider could exhaust shared threads and slow every module (REFUNDS/NFR-02). | M | M | Provider writes run only in background dispatchers (ADR-09). The one synchronous provider call, the POS receipt lookup (API-02), runs on the request thread inside its own Resilience4j bulkhead and timeout and never inside a database transaction. Each provider has its own bulkhead, timeout, and circuit breaker (§12). | [NEEDS CLARIFICATION: risk owner] |
| R-07 | Paper refunds at the branch counter during rollout ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) 1) can refund an item the portal refunds too ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once). | M | M | Treat items the POS record reports as refunded as not refundable, if POS reports them (API-02). | [NEEDS CLARIFICATION: risk owner] |
| R-08 | A signed-in customer who knows a receipt number can see that purchase and request a refund of its items, blocking the real buyer's items ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once) until the request is rejected or cancelled. | M | M | Lookup rate limit per customer (§17.1); payouts only to the original card; a rejection or cancellation releases the items at once (§17.1 `active`); proof of purchase is a REFUNDS follow-up. | [NEEDS CLARIFICATION: risk owner] |
| R-09 | POS records availability caps REFUNDS/NFR-02 for refund submission ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 2 and 5). | M | M | Obtain the Retail IT availability commitment for the receipt lookup **[TBD - EXTERNAL: POS records availability]**; alert on the API-02 circuit breaker. | [NEEDS CLARIFICATION: risk owner] |

---

# 5. Glossary

Business terms: [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary). Technical terms, acronyms, and cross-BRD terms used in this SDD:

| Term | Definition |
|------|------------|
| ADR | Architectural Decision Record (§10). |
| API-NN | A synchronous integration contract in §15 (HTTP or in-process). |
| BRD / BRD key | Business Requirements Document; each source BRD has a short key (REFUNDS, LOYALTY) carried by every BRD reference (chunk 00 § Document Lineage). |
| Customer and Member | REFUNDS Customer and LOYALTY Member are two actors with one end-customer identity; a member is a customer who joined the loyalty program ([LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary)). |
| DDD | Domain-Driven Design; each module owns one bounded context. |
| Dispatch table | A module table where an outgoing provider call (payout, message) is recorded in the business transaction and sent after commit by a background dispatcher (ADR-09). |
| DTO | Data transfer object carried by a port call or an in-process domain event. |
| Event publication log | Table where an in-process domain event is stored in the publishing transaction and marked complete when its listener succeeds; incomplete publications are retried (§14.10). |
| Hexagonal architecture | Ports and adapters: each module's domain core is isolated from REST, persistence, and provider adapters. |
| Idempotency key | Key that makes a repeated write return the first result instead of acting twice (§15.1). |
| In-process domain event | A fact one module publishes and other modules of the same deployable handle in process (§14.10); never on a broker. |
| JWT | JSON Web Token; the Keycloak access token. |
| LLD | Low-Level Design, derived from this SDD by lld-unifier. |
| Modular monolith | One deployable built from modules with strict boundaries, ports, and one schema each (ADR-01). |
| Module | A bounded context inside the deployable: `refund`, `payout`, `notification`, `loyalty` (§13). |
| NFR | Non-functional requirement, cited with its BRD key (REFUNDS/NFR-01). |
| OIDC / PKCE | OpenID Connect sign-in with Proof Key for Code Exchange, used by the web app with Keycloak. |
| OpenAPI / REST | The API description format and the HTTP API style of every module (ADR-04). |
| Outbox | Recording an outgoing message in the same transaction as the state change and sending it after commit; realised by the event publication log and the dispatch tables. |
| Permission token | Runtime permission a module checks, `[module].[resource].[action]` (§16.11). |
| PII | Personally identifiable information: customer email and mobile number. |
| Port | Interface a module exposes to other modules in its `api` package; the only way to call into a module (§15). |
| POS | Point of sale; POS records are the Retail IT team's purchase records (INT-03). |
| Problem Details | RFC 9457 error format with an `errorCode` extension (§15.1). |
| RED metrics | Rate, errors, and duration per module and endpoint. |
| Receipt number / purchase reference | The POS identifier of one branch purchase: REFUNDS says receipt number (REFUNDS 02 Assumptions / Constraints 1), LOYALTY says purchase reference (LOYALTY 08). `refund` stores the purchase reference POS records return with the receipt (`refund_request.purchase_reference`, equal to the receipt number when POS uses one identifier) and sends it as `purchaseReference` in API-01 and `RefundPaid`; `loyalty` matches on it. **[NEEDS CLARIFICATION: Retail IT team: does the member purchase intake carry the receipt number customers enter, and are receipt numbers unique across branches? If unique per branch only, `branch_id` joins every receipt key and the customer also gives the branch at lookup.]** |
| Refund (REFUNDS) | A refund request covers selected items of one receipt and may be approved for a lower amount ([REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1). |
| Refundable item | One POS receipt line (`pos_line_id`), refunded once and in full. **[NEEDS CLARIFICATION: may a customer refund some units of a receipt line that holds several units, given [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once?]** |
| Refunded purchase (LOYALTY) | A purchase "refunded in the Refunds Portal", whose earned points are taken back ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1); the BRD example covers a full refund only (AC-1: -50 points for a refunded purchase that earned 50). **[NEEDS CLARIFICATION: for a REFUNDS refund of some items or a lower amount, are all points of the purchase taken back, or the points for the paid amount (1 point per 1 EUR)?]** |
| SDD | Solution Design Document (this document). |
| Tenant | The retail company that operates the branches; key `tenant_id` on every row (ADR-03). |
| TLS | Transport Layer Security on every network hop. |
| UC-NN | A BRD use case, always cited with its BRD key and a link to its heading. |
| UTC | Time zone of every stored and exchanged timestamp. |
| UUIDv7 | Time-ordered UUID used for every primary key. |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
