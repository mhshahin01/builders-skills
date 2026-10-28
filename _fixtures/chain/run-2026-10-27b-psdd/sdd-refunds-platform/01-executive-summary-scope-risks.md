<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 1. Executive Summary

The Refunds Platform is one Java 21 / Spring Boot modular monolith (one deployable, four modules: refund-request, payout, notification, and loyalty-points) on one PostgreSQL database with one schema per module, served to browsers by one web frontend. It realises two source BRDs: the Refunds Portal (REFUNDS: online refund requests for branch purchases, branch manager decisions, payouts to the original card through CardPay Ltd, customer messages through MsgHub, the daily branch report) and Loyalty Points (LOYALTY: points earned on branch purchases from Point-of-Sale Records, the member's balance and history, points taken back after a paid refund). The numbers and the shape it designs to are the locked items of the G3-signed Pre-SDD ([00 § Document Lineage](./00-cover-and-changelog.md#document-lineage), key `PSDD`).

Modules talk in process: state changes travel as durable in-process domain events recorded in a publication log in the publisher's transaction (§14.10), queries go through module ports (§15), and every provider write that must follow a state change (a payout to CardPay Ltd, a message through MsgHub) leaves through a transactional outbox, so no state change and its effect are ever dual-written ([ADR-02](./06-principles-and-decisions.md#10-architectural-decisions), [ADR-08](./06-principles-and-decisions.md#10-architectural-decisions)). The platform runs in one cloud region with a pilot-light recovery region ([PSDD/HDR-08.1](../pre-sdd-refunds-platform/02-classification-and-path.md#21-classification), [PSDD/REL-05.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05), [PSDD/REL-05.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05); [§8.6](./05a-infrastructure-and-network.md#86-infrastructure-architecture)).

Core technical capabilities at a glance:

- A refund request state machine (Submitted, Approved, Rejected, Paid, Cancelled) with an append-only decision record that nobody can change ([REFUNDS 03 § Refund request lifecycle](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-request-lifecycle), [REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record); [§17.1](./13a-service-refund-request.md#171-refund-request)).
- Idempotent payouts with retry, a card-dispute hold, and a two-person manual result, so no payout is lost or paid twice ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), [PSDD/REL-10.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-10); [§17.2](./13b-service-payout.md#172-payout)).
- Customer messages by email and SMS on every status change, which never block a refund request ([REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages); [§17.3](./13c-service-notification.md#173-notification)).
- An append-only points ledger whose balance is the sum of its movements, with exactly-once take-back per paid refund ([LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement), [PSDD/INT-05.1](../pre-sdd-refunds-platform/03f-register-integration.md#int-05); [§17.4](./13d-service-loyalty-points.md#174-loyalty-points)).

Key technical bets and trade-offs:

- **One deployable now, modules cut for extraction later.** Both products are first production releases with modest load ([PSDD/CAP-02.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-02), [PSDD/CAP-03.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-03)); module ports and in-process events keep each bounded context separable, and [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) states the extraction trigger. The trade-off is one release unit for two products that may go live on different dates ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope), [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope)), handled by in-house go-live switches (§11.5).
- **No message broker.** Every event stays inside one deployable; a durable publication log gives at-least-once delivery to each listener without a broker to run ([ADR-02](./06-principles-and-decisions.md#10-architectural-decisions)). Extracting a module brings a broker decision back.
- **Money correctness over latency.** Payouts are asynchronous behind the outbox, keyed by the payout's own ID as the idempotency key towards CardPay Ltd ([PSDD/REL-10.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-10)); a branch manager's decision returns before the payout is sent.
- **Locked numbers, open questions kept open.** The Pre-SDD's open entries, its exception [PSDD/EXC-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result), and its unknowns [PSDD/QD-01](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns) to [PSDD/QD-08](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns) stay open in this SDD and are cited where the design relies on them; its condition [PSDD/COND-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result) is risk R-03.

**Project Type:** Greenfield - no source BRD names an existing codebase that this system extends (CardPay Ltd, MsgHub, and Point-of-Sale Records are systems it integrates with), and the Pre-SDD classifies the change as greenfield ([PSDD/HDR-07.1](../pre-sdd-refunds-platform/02-classification-and-path.md#21-classification)).

---

# 2. Scope

## 2.1 In Scope

The business scope is the BRDs' own: [REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) and [LOYALTY 04 § In Scope](../brd-loyalty-points/04-scope-and-personas.md#in-scope). This SDD designs, at solution level:

- The four modules of [§13](./09-services-summary.md#13-services-decomposition-summary) in one deployable, and the web frontend for customers, branch managers, payout staff, and members.
- The in-process event registry ([§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core)), the API contract registry (§15), and the role catalogue (§16).
- The provider adapters for CardPay Ltd, MsgHub, and Point-of-Sale Records behind anti-corruption ports, with their external contracts `TBD - external` until the providers' documentation is supplied ([§15.6](./11-api-contracts.md#156-external-contracts-awaiting-the-user)).
- The pilot rollout per branch and the separate go-live of Loyalty Points as in-house go-live switches ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope), [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope); §11.5).
- The infrastructure in one cloud region with a pilot-light recovery region, and the network paths (§8.6, §8.7).

## 2.2 Out of Scope

- The BRDs' own exclusions, cited as the business prohibitions of [PSDD/BUS-07.1](../pre-sdd-refunds-platform/03a-register-business.md#bus-07): [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) and [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope).
- The member sign-in itself, until LOYALTY names who signs the member in ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) Preconditions); this SDD designs the authorization on the member's identity, not its issuance.
- A view across all 40 branches, until REFUNDS names its reader ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)).
- Changes to Point-of-Sale Records, CardPay Ltd, or MsgHub: the platform consumes their interfaces as offered.
- The wishlists ([REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist), [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist)); [§22](./17-appendix-and-wishlist.md#22-wishlist) adds only platform items.

---

# 3. Assumptions

The BRD assumptions are not restated: [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints). Technical assumptions of this design:

1. **One business, one platform:** both products serve one retail business and its 40 branches ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts)); the multi-tenancy model stays open until [PSDD/DAT-07.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-07) is settled ([§11.2](./07-cross-cutting-concerns.md#112-multi-tenancy-default)).
2. **Point-of-Sale Records answers a receipt lookup while the customer waits:** the lookup is a synchronous call within the customer's action ([PSDD/INT-02.1](../pre-sdd-refunds-platform/03f-register-integration.md#int-02)); its latency and quota are open ([PSDD/INT-03.2](../pre-sdd-refunds-platform/03f-register-integration.md#int-03)).
3. **CardPay Ltd reports each payout result asynchronously:** the platform receives a result for every payout it sends, by callback or by query; which one is a provider fact ([PSDD/QD-04](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns), [API-05](./11-api-contracts.md#api-05-payout-result-notification-cardpay-ltd---payout)).
4. **The member purchase feed reaches Loyalty Points the same day:** [LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints) Assumption 1 and [PSDD/INT-02.1](../pre-sdd-refunds-platform/03f-register-integration.md#int-02); the feed's mechanism is open ([API-08](./11-api-contracts.md#api-08-member-purchase-feed-point-of-sale-records---loyalty-points)).
5. **A receipt number identifies the purchase that earned points:** the refund outcome sent to Loyalty Points carries the receipt number as the purchase reference that LOYALTY matches on; **[NEEDS CLARIFICATION: Is the receipt number that the Refunds Portal sends the same purchase reference that Point-of-Sale Records gives Loyalty Points for the member's purchase? Owner: Retail IT team.]**

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | Paper records get lost and customers cannot see progress ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) Challenge 1): a refund request the platform fails to record repeats the problem it replaces. | L | H | The submit action commits the request and its decision-record row in one transaction before it answers ([§17.1](./13a-service-refund-request.md#171-refund-request)); messages never block it ([REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages)). | Refunds and Loyalty Product Owner |
| R-02 | Point-of-Sale Records is a hard dependency of the receipt lookup and of the member purchase feed, and its owner has not confirmed either ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies), [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies), [PSDD/QD-05](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)). | M | H | Both adapters sit behind ports with contracts `TBD - external` (API-01, API-08); a lookup that cannot reach the system answers as [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E5 says. | Retail IT team |
| R-03 | The Pre-SDD condition is open: CardPay Ltd confirms in writing that it refunds branch card purchases to the original card, before the SDD fixes the payout integration ([PSDD/COND-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result)). Until then the payout contract (API-04) stays `TBD - external`. | M | H | The payout module isolates CardPay Ltd behind its port; no provider field is fixed before the confirmation ([PSDD/QD-04](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)). | Refunds and Loyalty Product Owner (due 2026-12-15, [PSDD/COND-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result)) |
| R-04 | The applicable data-protection law is open; the Pre-SDD let G3 pass under an exception that expires 2027-12-31 ([PSDD/SEC-01.1](../pre-sdd-refunds-platform/03e-register-security.md#sec-01), [PSDD/EXC-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result)). A law that requires other retention, consent, or residency rules changes §11 and the data stores. | M | H | Data classification, encryption, retention, and residency follow the locked entries ([PSDD/DAT-03.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-03), [PSDD/SEC-04.1](../pre-sdd-refunds-platform/03e-register-security.md#sec-04), [PSDD/DAT-06.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-06), [PSDD/DAT-04.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-04)); prod promotion waits for the legal confirmation ([§11.3](./07-cross-cutting-concerns.md#113-deployment-default)). | Product Owner (fixture owner), per [PSDD/EXC-01](../pre-sdd-refunds-platform/11-gate-and-sign-off.md#111-gate-result) |
| R-05 | A paid refund that goes back to Approved (its payout sent back) reaches Loyalty Points, but LOYALTY has no rule for the points already taken back ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations) and [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations) differ on the outcomes exchanged). | M | M | The loyalty-points module records the outcome and adds no movement until LOYALTY states the rule ([§17.4](./13d-service-loyalty-points.md#174-loyalty-points)); **[NEEDS CLARIFICATION: When a paid refund goes back to Approved because its payout was sent back, does Loyalty Points give back the points it took back for that refund? Owner: Loyalty Points owner.]** | Loyalty Points owner |
| R-06 | Customer identity and member sign-in are open in both BRDs ([REFUNDS 03 § Customer identity](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-identity), [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) Preconditions); the identity provider and its flows are Proposed only. | H | M | Authorization is designed on the identity's claims (§16.2), independent of how it is issued; the identity provider is a reserved dependency ([§6](./02-ecosystem-overview.md#6-ecosystem-overview)). | Refunds and Loyalty Product Owner |
| R-07 | One deployable carries two products whose go-live dates differ ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope), [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope), [PSDD/QD-03](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)): a defect in one module can hold a release of the other. | M | M | Go-live switches per branch and per product (§11.5); module boundaries enforced at build time ([AP-04](./06-principles-and-decisions.md#9-architecture-principles)); the extraction trigger in [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions). | Software Architect |

| R-08 | A region failover loses up to [PSDD/REL-04.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04) of committed data ([PSDD/CALC-15](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations)): refund requests whose customers already hold a reference number, and payouts CardPay Ltd already accepted. | L | H | Recovery starts with payout sending paused and reconciles the window against CardPay Ltd before sending resumes ([§20.1.5](./16-operations-runbook.md#2015-database-failover)); results for unknown payouts are kept and alerted ([§17.2](./13b-service-payout.md#business-logic)); a customer whose request was lost submits again with the receipt. | Software Architect |

---

# 5. Glossary

Business terms are the BRDs' own: [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary). Technical terms this SDD adds:

| Term | Definition |
|------|------------|
| ADR | Architecture Decision Record: one decision with its context, rationale, and consequences ([§10](./06-principles-and-decisions.md#10-architectural-decisions)). |
| AZ | Availability zone: an isolated location inside one cloud region. |
| DR | Disaster recovery: restoring service in the recovery region after the primary region is lost. |
| DTO | Data transfer object: the typed payload of an in-process event or a port call. |
| E2E | End-to-end. |
| IAM | Identity and access management: the identity provider and its sign-in flows. |
| Idempotency key | A value the caller sends so that a repeated request has its effect once. |
| Modular monolith | One deployable built from modules that each own one bounded context and one database schema, and that call each other only through ports and in-process events. |
| Module port | A Java interface a module exposes to other modules in the same deployable ([§15](./11-api-contracts.md#15-service-integration-api-contracts)). |
| OIDC | OpenID Connect, the sign-in protocol of the Proposed identity provider. |
| Outbox | A table written in the same transaction as a state change, from which a relay performs the external effect after commit. |
| Pilot light | A recovery region that holds a replica of the data and the minimum infrastructure, scaled up only when the primary region is lost ([PSDD/REL-05.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05)). |
| Publication log | The `event_publication` table in which an in-process domain event is recorded in the publisher's transaction and kept until every listener completes ([§11.1](./07-cross-cutting-concerns.md#111-db-modeling-default)). |
| PSDD | The key of the source Pre-SDD; every Pre-SDD ID is cited `PSDD/<ID>`. |
| RPO | Recovery point objective: the most recent data that may be lost, as a time before the failure. |
| RTO | Recovery time objective: the longest time to restore service after a failure. |
| SMS | Short Message Service ([REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary)). |
| TLS | Transport Layer Security. |
| UUIDv7 | A time-ordered UUID used for every primary key. |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
