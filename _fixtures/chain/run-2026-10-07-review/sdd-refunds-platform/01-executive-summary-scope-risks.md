<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Platform
VERSION: 1.7
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 1. Executive Summary

Refunds Platform is one Java 21 / Spring Boot deployable that realises two products: the Refunds Portal ([REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary)) and Loyalty Points ([LOYALTY 01 § Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md#executive-summary)). It serves two Angular web apps, keeps all data in one PostgreSQL database with one schema per module, signs users in through one Keycloak realm, and integrates with six outside systems (§12).

The architecture is a modular monolith (ADR-01): five DDD modules with hexagonal structure inside, talking through in-process ports and durable in-process domain events. A publication log records every domain event in the publisher's transaction and acts as the outbox for every outside call that follows a committed state change (ADR-02; exceptions in §8.1.1). The paid-refund dependency of LOYALTY on REFUNDS is an in-process event inside the deployable (§8.4.2).

Core technical capabilities at a glance:

- Customer accounts with a confirmed email address and mobile number, credentials held in Keycloak (§17.1).
- A refund request lifecycle with receipt checks against POS Records, branch-scoped decisions, and retention (§17.2).
- Payouts to the original card with retries until the payout deadline and one payout per request (§17.3).
- Email and SMS messages through the Notification Partner, driven by domain events (§17.4).
- A points ledger fed by POS Records purchases, paid refunds, go-live balances, and corrections (§17.5).
- Two reports with CSV and Excel export: the branch refund report and the monthly corrections report.

Key technical bets and trade-offs:

- **One deployable for two products** (ADR-01): one delivery team (§3 Assumption 7) and moderate load favour one deployable with enforced module boundaries; the cost is one shared availability budget, so the deployable meets the stricter LOYALTY/NFR-04 budget (§18.5). The extraction trigger is in ADR-01.
- **Durable in-process events instead of a broker** (ADR-02): REFUNDS/NFR-01 (never lost or paid twice) and LOYALTY/NFR-01 (balance matches movements) are met with local transactions plus the publication log, without distributed transactions; a broker is added at the first extraction.
- **REFUNDS Objective 1** (Submitted to Paid falls from 10 days to 3, [REFUNDS 01 § Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives)) needs every status change timestamped, which the status history provides and the branch refund report averages over the Paid requests at its branch-local cutoff. The REFUNDS owner combines branches by total elapsed time and total Paid-request count ([REFUNDS 01](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives)).
- **LOYALTY Objective 2** (calls about points fall by at least 50%, [LOYALTY 01 § Business Objectives](../brd-loyalty-points/01-executive-summary-and-context.md#business-objectives)) makes the balance and history reads the availability and latency priority (LOYALTY/NFR-04, LOYALTY/NFR-05).

**Project Type:** Greenfield - no source BRD names an existing codebase this system extends; POS Records, CardPay Ltd, MsgHub, the member sign-in, and the staff sign-in are outside systems it only integrates with.

---

# 2. Scope

## 2.1 In Scope

Business scope: [REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) and [LOYALTY 04 § In Scope](../brd-loyalty-points/04-scope-and-personas.md#in-scope). Solution-design delta:

- One deployable `refunds-platform` with the five modules of §13 and one Helm chart.
- Two responsive Angular web apps: Refunds Portal web (customers, branch managers) and Loyalty Points web (members, Loyalty Administrators).
- Adapters for the six integrations of §12; external contracts stay `TBD - external` until the provider documentation is supplied (§15.6).
- A Keycloak realm with local customer accounts and two identity brokers (ADR-07).
- The in-process paid-refund flow from refund-requests to loyalty-points (§8.4.2).
- Scheduled retention jobs for refund records, customer accounts, and former-member history ([REFUNDS 03 § Refund records](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-records), [LOYALTY 03 § Membership end and data retention](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention)).
- A one-off import of the points balances at go-live (API-09).

## 2.2 Out of Scope

Business exclusions: [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) and [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope). Solution-design delta:

- A message broker, a cache tier, object storage, and a BI tool (§6 rows marked Not applicable; ADR-02).
- Splitting modules into separate services: only when the ADR-01 extraction trigger is met.
- Building the member sign-in, the staff sign-in, or POS Records: the platform integrates with them.
- Linking a customer's portal account to a member identity: neither BRD asks for it (R-12).

---

# 3. Assumptions

Business assumptions: [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints). LOYALTY Assumption 1 (purchases reported by 22:00) carries a risk, R-13. Technical assumptions:

1. **Reachable providers:** CardPay Ltd, MsgHub, POS Records, and the two sign-in providers expose network interfaces reachable from the cluster over TLS; their contracts are `TBD - external` (§15.6).
2. **Brokerable identity providers:** the member sign-in (Customer Accounts team) and the staff sign-in (Retail IT team) support a federation protocol Keycloak can broker, and their tokens carry the member number, the staff identity, and the Loyalty Administrator role.
3. **Original card reference:** the POS Records receipt lookup (API-01) returns the reference the Payment Provider needs to pay back to the original card, because the customer never enters card details ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-3: no card details entered).
4. **Branch reference data:** refund-requests holds each branch's country and time zone, keyed by the POS Records branch identifier, as configuration per environment and tenant (§11.5). [NEEDS CLARIFICATION: the system of record and owner of the branch list.] A receipt lookup for a branch the platform does not know answers [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E4 and raises an alert.
5. **One tenant at go-live:** the retailer is the only tenant; tenancy keys are carried for the platform rule (ADR-03).
6. **Hosting:** the hosting provides Kubernetes and PostgreSQL 17+ (§6 Compute / Infra).
7. **One delivery team:** one delivery team builds and runs both products. The Finance team, which [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) names as owner of the Refunds Portal, is its business owner and has no delivery team of its own for it. The Head of Retail owns this assumption.
8. **Inbound deliveries by call:** POS Records (API-07), the member sign-in and membership (API-08), and the points balances at go-live (API-09) deliver by calling the platform's provider routes over HTTPS (§11.6), as their §15.2 type, External inbound, states. A provider that can deliver only a file, or only a feed the platform reads, needs an inbound file or polling adapter, which is a design change.

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | A refund request or its outgoing effects are lost between steps, as paper records were ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges), Challenge 1). | L | H | Every state change commits with its domain events in one transaction (publication log, ADR-02); the reference number is given at submission. | [NEEDS CLARIFICATION: risk owner for R-01] |
| R-02 | POS Records reports purchases incompletely or late, so balances are wrong ([LOYALTY 02 § Challenges](../brd-loyalty-points/02-glossary-assumptions-facts.md#challenges), Challenge 1). | M | H | Idempotent purchase feed keyed by purchase reference and member, take-backs held until the purchase shows, feed-lag alert; [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) corrections for upheld complaints. [NEEDS CLARIFICATION: mitigation for a purchase POS Records never reports, beyond corrections] | [NEEDS CLARIFICATION: risk owner for R-02] |
| R-03 | Opening balances at go-live are wrong or late ([LOYALTY 02 § Challenges](../brd-loyalty-points/02-glossary-assumptions-facts.md#challenges), Challenge 2). | M | H | One-off import with a totals check, a UAT rehearsal, and a go-live gate (§11.3). | Marketing team ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)) |
| R-04 | Payouts to the original card are not verified with the Payment Provider ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies), To be verified). | M | H | Verify before the build of [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund); API-03 and API-04 stay `TBD - external` until then. | CardPay Ltd ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies)) |
| R-05 | The POS Records receipt lookup and the request-items notice are not verified ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies)). | M | H | Verify before the build of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund); API-01 and API-02 stay `TBD - external`. | Retail IT team ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies)) |
| R-06 | Email and SMS sending is not verified with the Notification Partner ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies)). | M | H | Verify before the build of [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in); API-05 stays `TBD - external`. | MsgHub ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies)) |
| R-07 | An ambiguous provider answer (a timeout) followed by a retry pays a refund twice (REFUNDS/NFR-01). | M | H | One open attempt per payout, the same key while its outcome is unknown, a new key only after a definitive refusal (§17.3); which CardPay answers are definitive refusals, and whether it replays the stored result for a reused key, is `TBD - external` (API-03). | [NEEDS CLARIFICATION: risk owner for R-07] |
| R-08 | LOYALTY takes points back by the POS Records purchase reference ([LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints), Assumption 2), while REFUNDS names the purchase by its receipt number; if they differ, take-backs miss their purchase. | M | H | `RefundPaid` carries the purchase reference returned by API-01 (§14.10), which names the same purchase as the customer's receipt number (§5). | [NEEDS CLARIFICATION: risk owner for R-08] |
| R-09 | Refunds settled at a branch keep their points: after Payout failed ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1) and for in-person refunds (REFUNDS 04 Out of Scope), because LOYALTY takes back points only for refunds the Refunds Portal pays ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: take back on paid refunds). | H | M | None in this design; a BRD follow-up for both owners. | [NEEDS CLARIFICATION: risk owner for R-09] |
| R-10 | POS Records has two owners across the BRDs: the Retail IT team ([REFUNDS 08](../brd-refunds-portal/08-integrations.md#integrations)) and the Store Operations team ([LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations)). | M | M | One §12 row (INT-03) with a clarification; one owner confirmed before build. | [NEEDS CLARIFICATION: risk owner for R-10] |
| R-11 | One deployable for two products: an outage or a faulty release of any module stops both products. | M | M | At least 2 replicas, rolling updates, module boundary tests in CI (§11.3); extraction trigger in ADR-01. | [NEEDS CLARIFICATION: risk owner for R-11] |
| R-12 | One person can hold two customer identities, a portal account ([REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)) and a member sign-in ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies)); the BRDs do not link them. | L | L | Separate identity sources (ADR-07); no cross-product view in this release. | [NEEDS CLARIFICATION: risk owner for R-12] |
| R-13 | POS Records reports a purchase after 22:00 ([LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints), Assumption 1), so its points miss the end of the purchase day (LOYALTY/NFR-03). | L | M | Each purchase is applied on receipt; a feed-lag alert pages the on-call engineer (§11.4). | [NEEDS CLARIFICATION: risk owner for R-13] |
| R-14 | The Payment Provider completes a payout after its request became Payout failed, and the branch also settles it in person, so the customer is paid twice (REFUNDS/NFR-01). | L | H | Late successes page the on-call engineer at once with the refund reference and the branch; §20.1.8 warns the branch before it settles; the REFUNDS owner decides how a double payment is recovered. | [NEEDS CLARIFICATION: risk owner for R-14] |
| R-15 | Concurrent requests on one partly card-paid receipt can exceed the current card-paid amount left if submission or approval omits the purchase lock and cap check of §17.2. | M | M | The business rule home is [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-4 and AC-11: cap at submission; [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 4 and AC-9: cap at confirmation. [REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md) REFUNDS/TC-REQ-24 and REFUNDS/TC-DEC-16 cover the counting rule and concurrent approvals. BAT sign-off of §11.3 requires their results; §17.2 Developer Notes covers the implementation lock test. | The REFUNDS owner |

---

# 5. Glossary

Business terms: [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary). SDD delta (technical terms, acronyms, and cross-BRD term rows):

| Term | Definition |
|------|------------|
| ADR / AP | Architectural decision record (§10) / architecture principle (§9). |
| API-NN / INT-NN / OI-NN / R-NN | SDD identifiers: API contract (§15), integration (§12), open item (§23), risk (§4). |
| BAT / UAT / SIT | Business acceptance testing / user acceptance testing / system integration testing (§19). |
| DDD / EDA | Domain-driven design / event-driven architecture (§6 rules). |
| DTO | Data transfer object: the payload of an in-process event or port call. |
| Data subject request | A customer's or member's request to exercise a GDPR right, such as access (Art. 15) or portability (Art. 20), handled by §20.1.15. |
| ERD | Entity relationship diagram (§17.X DB Modeling). |
| HA | High availability. |
| IAM | Identity and access management (Keycloak, §6). |
| Identity brokering | Keycloak signs a user in through an outside identity provider and issues a platform token (ADR-07). |
| Idempotency key | A client-chosen key that makes a repeated write return the first result instead of acting twice (§15.1). |
| Inbox | A record of the event or message ids a listener has processed, so each effect applies once. |
| In-process domain event | A fact one module publishes and other modules of the same deployable handle (§14.10). |
| JWT / OIDC / PKCE / SAML | JSON Web Token / OpenID Connect / Proof Key for Code Exchange / Security Assertion Markup Language. |
| LLD | Low-level design, derived from this SDD by lld-unifier. |
| Modular monolith | One deployable built from modules with enforced boundaries (ADR-01). |
| Module | One bounded context inside the deployable, owning one database schema (§13). |
| PII | Personally identifiable information. |
| Port / adapter | A hexagonal interface and its implementation; modules call each other only through ports (§15). |
| Business clock | The one injected clock every rule and job reads; settable in Dev, SIT, and UAT only (§19). |
| Route class | The gateway's user, public, and provider routes, each with its own checks (§11.6). |
| Send job | A module job that makes the outside calls its listeners recorded, with backoff and jitter (§11.1). |
| Tenant registry | The `platform.tenant` table that scheduled jobs iterate (§11.2). |
| Problem Details | The RFC 9457 error body every API returns (§15.1). |
| Publication log | The `platform.event_publication` table that records each in-process domain event in the publisher's transaction and redelivers it until every listener completes; it is the outbox for anything that leaves the process (§11.1). |
| RED metrics / SLO | Rate, errors, duration metrics / service level objective (§11.4). |
| RLS | PostgreSQL row-level security (§11.2). |
| RPS | Requests per second (§18.2). |
| SPA | Single-page application (the two Angular web apps). |
| `TBD - external` | Status of a §15 contract whose provider-owned fields wait for the provider's documentation. |
| Tenant / `tenant_id` | The business using the platform; one tenant, the retailer, at go-live (ADR-03). |
| TLS | Transport Layer Security. |
| UUIDv7 | A time-ordered UUID used for every primary key (§6 rules). |
| Receipt number (REFUNDS) / Purchase reference (LOYALTY) | The receipt number a customer enters and the purchase reference POS Records reports for loyalty identify the same branch purchase in POS Records; the platform carries it as `purchaseReference`, taken from the API-01 receipt lookup. |
| Reference number (REFUNDS) / Refund reference (LOYALTY) | The REFUNDS reference number of a refund request is the refund reference the loyalty take-back uses (`RefundPaid`, §14.10). |
| Point-of-Sale Records (REFUNDS) / POS Records (LOYALTY) | One partner under two names (INT-03). |
| Refunds Portal (in LOYALTY) | An outside product in LOYALTY; in this platform it is the refund-requests and payouts modules (§8.4.2). |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
