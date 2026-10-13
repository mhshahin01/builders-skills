<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 1. Executive Summary

The Refunds Platform is one Java 21 / Spring Boot deployable (`refunds-platform-app`) built as a modular monolith with four domain modules: `refund-request`, `payout`, `customer-notification`, and `loyalty-points` (§13). It realises two source BRDs: the Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY), listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). One PostgreSQL 17+ database holds one schema per module; no module reads another module's schema.

Modules talk to each other in process: state changes travel as durable in-process domain events recorded in a publication log in the publisher's transaction (§14.10), and the few synchronous needs go through module ports, one hop at most (§15). Provider work that follows a state change (payouts to CardPay Ltd, messages through MsgHub) is queued in the owning module's tables in the same transaction as the state change and sent after commit, so a provider outage never loses or duplicates work; read-only provider queries (the receipt lookup in Point-of-Sale Records, API-04) run synchronously in the request path with a timeout and a circuit breaker, and change no state. There is no message broker in this release (ADR-02).

Core technical capabilities at a glance:

- Refund request lifecycle with an immutable decision record per status change (`refund-request`, §17.1).
- Exactly one payout per approved refund request, retried until it succeeds or stops, held while a card dispute of the original payment is open, and paid again when the customer's bank sends it back (`payout`, §17.2).
- Customer messages by email and SMS that never block a refund (`customer-notification`, §17.3).
- A points ledger whose balance is always the sum of its movements, with idempotent take-back on paid refunds (`loyalty-points`, §17.4).
- One web frontend for customers, members, and branch managers, authenticated through the platform IAM (§6, §16).

Key technical bets and trade-offs:

- **Modular monolith first** (ADR-01): the load is small and seasonal (§18.1) and one team builds it, so one deployable with strict module boundaries costs less than services; the ADR-01 extraction triggers say when a module leaves.
- **No broker, durable in-process events** (ADR-02): the only consumers of every event are modules in the same process, so a publication log in PostgreSQL gives at-least-once delivery without running Kafka; it is replaced by the hub (§14) when a module is extracted.
- **Money facts have one writer**: only `payout` talks to CardPay, and only `refund-request` changes a refund's status; this is how REFUNDS/NFR-01 (never lost or paid twice) is met.
- **Cross-BRD link by event**: LOYALTY takes points back when REFUNDS reports a paid refund ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: refund paid takes points back), realised as the in-process event `RefundRequestPaid` (§8.4.3); the other refund outcomes REFUNDS reports to Loyalty Points travel as in-process events too (§12).

**Project Type:** Greenfield - no source BRD names an existing codebase this system extends; CardPay Ltd, MsgHub, and Point-of-Sale Records are external systems it only integrates with.

---

# 2. Scope

## 2.1 In Scope

The business scope is [REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) and [LOYALTY 04 § In Scope](../brd-loyalty-points/04-scope-and-personas.md#in-scope). Solution-level refinements:

- One deployable with the four modules of §13, one PostgreSQL database with one schema per module, and one web frontend for the customer, member, branch manager, and payout operator screens.
- Provider adapters for CardPay Ltd, MsgHub, and Point-of-Sale Records behind module ports (§12, §15).
- Authentication through the platform IAM (§6) and authorization by permission tokens (§16).
- The take-back of points on a paid refund as an in-process event between `refund-request` and `loyalty-points` (§8.4.3).
- Earning points from POS Records purchases ([LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points)) as a platform flow (§8.4.4); LOYALTY keeps earning as a rule with no use case ([LOYALTY 05 § Use Case Summary](../brd-loyalty-points/05-user-journeys-overview.md#use-case-summary)).
- The refund outcomes REFUNDS reports to Loyalty Points ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations)) as in-process events from `refund-request` to `loyalty-points`, kept in the publication log while Loyalty Points is switched off (§11.3).
- The pilot rollout of [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope): the portal takes refund requests only for the branches that have started (§11.5).
- The branch refund report of [REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics), served by `refund-request` from its own tables.

## 2.2 Out of Scope

The business exclusions are [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope) and [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope). Solution-level exclusions:

- A message broker and separately deployed services: added only when an ADR-01 extraction trigger fires.
- A separate reporting store or BI tool: the one report is served from `refund-request` tables (§6 Reporting / BI row).
- A tool for correcting points by hand: excluded by LOYALTY 04 Out of Scope; the open complaint-correction question is in §17.4.
- A customer mobile app and redeeming points: excluded by REFUNDS 04 and LOYALTY 04; their wishlist rows are referenced in §22.

---

# 3. Assumptions

The business assumptions are [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints). Technical assumptions:

1. **One tenant:** the retailer of [REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) is the only tenant; no source names a second business. Tables still carry `tenant_id` (ADR-03).
2. **Same-day purchase feed:** LOYALTY 02 Assumption 1 (every member purchase is known the same day) holds for the POS Records delivery to `loyalty-points`, whatever its mechanism (§17.4 Input).
3. **Original-payment reference:** a payout to the original card needs a reference to the original card payment; §17.2 states where that reference is still open.
4. **Staff accounts in the IAM:** every branch manager has an account in the platform IAM that carries the branch they manage (§16.6).
5. **Reachable providers:** CardPay Ltd, MsgHub, and Point-of-Sale Records are reachable from the hosting environment over TLS.
6. **One team:** one team builds and runs the platform in the next 12 months; no BRD states it (ADR-01 drivers).

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | Requests lost in the move from paper to the portal ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) 1): paper requests still open at go-live are not in the portal. | M | H | Every online request is recorded at submission in the same transaction as its first decision-record row (§17.1). The handling of open paper requests is a REFUNDS question ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope)). | Not assigned (marker below) |
| R-02 | CardPay Ltd has not confirmed refunds to the original card ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies), Hard). | M | H | CardPay sits behind the `payout` adapter; API-01 and API-02 stay `TBD - external`; the confirmation, with CardPay's conditions (merchant account per branch, refund time limit, original-payment details), is needed before the build of [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) and the `payout` module starts (§11.3). | Not assigned (marker below) |
| R-03 | Point-of-Sale Records is a hard dependency of both BRDs ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) and [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies), status open in both). | M | H | The receipt lookup agreement is a start condition of its build (§11.3); receipt lookup failure follows [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E5; purchase intake is idempotent and late purchases still earn points (§17.4). | Not assigned (marker below) |
| R-04 | A paid refund cannot be matched to the purchase that earned its points: the link between the REFUNDS receipt number and the LOYALTY purchase reference is open (§5). | M | H | `RefundRequestPaid` carries the receipt number; the matching rule is settled before the take-back is built (§5 marker). | Not assigned (marker below) |
| R-05 | A payout is lost or paid twice (REFUNDS/NFR-01). | L | H | One payout per refund request (unique key), a CardPay idempotency key per payout round (provider support `TBD - external`), and durable in-process events (§17.2, ADR-02). | Not assigned (marker below) |
| R-06 | How customers and members sign in is undecided in both BRDs (§16.2), which blocks the build of every customer and member use case. | H | H | The IAM integration is isolated in the inbound security adapter; ADR-07 stays Proposed until the sign-in method is set. | Not assigned (marker below) |
| R-07 | One deployable: a defect or load spike in one module affects every module (ADR-01 trade-off). | M | M | Bulkheads per provider adapter, module boundaries enforced by architecture tests (§17.X Developer Notes), and the ADR-01 extraction triggers. | Not assigned (marker below) |
| R-08 | Two open REFUNDS questions (item return before approval, in-person requests after go-live) can each add a state or an entry point to `refund-request` after the build starts. | M | M | The refund request state machine and the submission path are internal to `refund-request` (§17.1), so either change stays in one module; both answers are needed before the build of [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) and [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund). | Not assigned (§4 risk-owner marker) |
| R-09 | A card dispute or a payout sent back by the customer's bank is not reported by CardPay Ltd, or a dispute opens after the payout succeeded, so a customer can be refunded twice, once by their bank and once by the payout ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute). | M | H | `payout` holds a payout while a reported dispute is open, cancels a payout whose dispute the bank refunded to the customer before it paid, and pays again only after a reported return (§17.2 Disputes, Payout sent back); whether and how CardPay reports both is asked of CardPay before the `payout` build (§11.3, §17.2 markers); the daily reconciliation compares payouts with CardPay's records (API-07). | Not assigned (§4 risk-owner marker) |

**[NEEDS CLARIFICATION: Who owns the mitigation and monitoring of each risk R-01 to R-09? Owner: product owner.]**

---

# 5. Glossary

Business terms are defined in [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary). Technical terms and the cross-BRD terms:

| Term | Definition |
|------|------------|
| Modular monolith | One deployable made of modules with strict boundaries: each module owns its schema and is reached only through its ports and its domain events (ADR-01). |
| Module | A bounded context inside `refunds-platform-app` (§13); this SDD uses the template's "service" headings for modules. |
| Port | An interface a module exposes (inbound) or needs (outbound); adapters implement it (hexagonal architecture). |
| Adapter | The code that connects a port to a transport or a provider (REST controller, provider client, repository). |
| In-process domain event | A fact one module publishes and other modules of the same deployable handle (§14.10). |
| Publication log | The table, written in the publisher's transaction, that records each in-process domain event until every listener has completed it (§11.1). |
| Outbox | Work recorded in the owning module's tables in the same transaction as a state change and sent to a provider after commit; here the payout attempt and message rows play this role (ADR-02). |
| Idempotency key | A key that makes a repeated request have the effect of one request (§15.1). |
| Permission token | The runtime name of an allowed action, checked by a module (§16.11). |
| IAM | Identity and access management: the component that signs users in and issues tokens (§6). |
| OIDC | OpenID Connect, the sign-in protocol between the frontend, the IAM, and the deployable. |
| UUIDv7 | A time-ordered UUID used for every primary key (§11.1). |
| Problem Details | The RFC 9457 error format of every API error (§15.1). |
| Payout attempt | One call to CardPay Ltd for one payout (§17.2). |
| Refund (LOYALTY) and Refund request (REFUNDS) | The same concept: LOYALTY 02 "Refund" is the request the Refunds Portal handles; its outcomes paid, rejected, and cancelled are the REFUNDS statuses Paid, Rejected, and Cancelled ([REFUNDS 03 § Refund request lifecycle](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-request-lifecycle)). [REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations) also reports a Paid request that goes back to Approved, an outcome [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations) does not name; its effect on points is open (§17.4 Other refund outcomes). |
| Point-of-Sale Records (REFUNDS) and POS Records (LOYALTY) | The same partner, one §12 row (INT-03). |
| Rejected after a card dispute (REFUNDS) and rejected refund (LOYALTY) | REFUNDS also marks a request Rejected when the customer's bank refunded the disputed card payment ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute), so the customer has the money back; LOYALTY takes back no points for a rejected refund ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: rejected or cancelled takes back nothing). The platform takes back no points for it. **[NEEDS CLARIFICATION: Does a refund request Rejected because the customer's bank refunded the disputed card payment take back points like a paid refund, and for which amount? Owner: LOYALTY BRD owner with the REFUNDS BRD owner.]** |
| Purchase reference (LOYALTY) and Receipt number (REFUNDS) | LOYALTY 08 identifies a purchase by its purchase reference; REFUNDS 02 identifies it by the receipt number the customer enters. **[NEEDS CLARIFICATION: Is the LOYALTY purchase reference the same identifier as the REFUNDS receipt number, and if not, which data links a paid refund to the purchase that earned the points? Owner: REFUNDS and LOYALTY BRD owners, with the Retail IT team (POS Records).]** |
| Refund reference (LOYALTY) and Reference number (REFUNDS) | The same identifier: the reference number REFUNDS gives a refund request at submission ([REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary)) is the refund reference LOYALTY shows in the points history ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)) and the key of the `loyalty-points` processed-refund inbox (§17.4). |
| Currency | LOYALTY counts purchases in EUR ([LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary)); REFUNDS leaves the currency open ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)). The platform assumes one currency per tenant, EUR for the retailer. **[NEEDS CLARIFICATION: Are all branch purchases and refunds in EUR? Owner: REFUNDS BRD owner.]** |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
