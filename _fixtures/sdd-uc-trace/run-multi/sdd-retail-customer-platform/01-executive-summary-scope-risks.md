<!--
CHUNK: 01
TITLE: Executive Summary, Scope, Assumptions, Risks & Glossary
PROJECT: Retail Customer Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Retail Customer Platform
-->

# 1. Executive Summary

The Retail Customer Platform is one web platform for the retailer's branch customers and staff. It realises two source BRDs as one system (keys and versions in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage)): refund requests for branch purchases, decided by branch managers and paid back to the original card ([REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary)), and loyalty points with balances, vouchers, and manager adjustments, where the points earned on a refunded purchase are taken back ([LOYALTY 01 § Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md#executive-summary)). Technically it is one Java / Spring Boot deployable made of DDD modules (§13) with one PostgreSQL database, Keycloak for identity, and a customer web app and a staff web app behind an API gateway. It integrates with the Payment Provider for card payouts, the Notification Partner for email and SMS, and the Point-of-Sale Records for receipts, purchases, and refunds (§12).

**Project Type:** Greenfield. No existing codebase is extended: refunds run on paper and phone calls today ([REFUNDS 01 § Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md#executive-summary)) and customers have no online access to their points ([LOYALTY 01 § Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md#executive-summary)). Existing points balances still have to be loaded before go-live (R-07).

The architecture style is a modular monolith (ADR-01): each module is a bounded context with a hexagonal structure; modules call each other through in-process ports, and every state change that another module or an external system reacts to leaves through a transactional outbox (ADR-02, ADR-06). The primary technical objectives are that refund money and points are never lost or counted twice (REFUNDS/NFR-01, LOYALTY/NFR-02), that customers can use the platform within the monthly disruption budgets (REFUNDS/NFR-02, LOYALTY/NFR-01), and that seasonal peaks (REFUNDS/NFR-03) cause no slowdown customers notice.

Core technical capabilities at a glance:

- A refund request state machine following [REFUNDS 03 § Refund request lifecycle](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-request-lifecycle), with decisions limited to the branch manager's own branch.
- Idempotent card payouts, retried for up to one day and then escalated to the branch manager ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1).
- An append-only points ledger fed by the Point-of-Sale purchase and refund feed, deduplicated per POS record, whose balance never goes below zero ([LOYALTY 03 § Points balance](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-balance)).
- Vouchers issued against the ledger in one transaction, and point adjustments that wait for a second loyalty manager above the threshold of [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-manager.md#uc-03-adjust-a-customers-points) BR-2.
- Customer messages by email and SMS, sent from the outbox so that a message failure never undoes a business step.
- In-app reports: the branch refund report ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)) and the monthly points report ([LOYALTY 09 § Reporting / Analytics](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics)).

Key technical bets and trade-offs:

- **Modular monolith first (ADR-01).** One team, a first production release, and moderate load do not need independent deployables; module boundaries, ports, and the outbox keep a later extraction cheap. Trade-off: all modules share one availability and one release until an extraction trigger fires.
- **PostgreSQL for all data (ADR-03).** The source BRDs mandate different engines (REFUNDS/TI-02, LOYALTY/TI-01); one engine fits one deployable and the Flyway SQL migration standard. Trade-off: LOYALTY/TI-01 is not applied and needs its owner's acceptance (R-06).
- **Idempotency is the integrity mechanism.** Outbox rows, inbox deduplication, idempotency keys on provider calls, and unique constraints (one payout per refund request, one ledger entry per POS record) realise REFUNDS/NFR-01 and LOYALTY/NFR-02.
- **No broker until a module leaves the process (ADR-02).** Trade-off: there is no broker log to replay from; a replay reads the outbox history.
- **Business objectives as technical implications:**
  - [REFUNDS 01 § Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives) objective 1 (shorter time from request to payout): the payout starts automatically at approval, from the outbox, with no manual step between decision and payment.
  - REFUNDS objective 2 (no lost requests): the request and its reference number are committed before the customer sees a confirmation, and every status change is kept as history.
  - REFUNDS objective 3 (one place per branch): a decision queue filtered by the branch claim in the branch manager's token.
  - [LOYALTY 01 § Business Objectives](../brd-loyalty-points/01-executive-summary-and-context.md#business-objectives) objective 1 (balance at any time): balance reads come from the loyalty module's own tables, never from a live call to the Point-of-Sale Records.
  - LOYALTY objective 2 (a voucher online in under a minute): the points debit and the voucher code are issued synchronously in one transaction; the email follows asynchronously.
  - LOYALTY objective 3 (points match purchases, including refunds): deduplication on POS record ids and one source for each refund fact (R-05).

---

# 2. Scope

## 2.1 In Scope

Business scope: every bullet of [REFUNDS 04 § In Scope](../brd-refunds-portal/04-scope-and-personas.md#in-scope) and of [LOYALTY 04 § In Scope](../brd-loyalty-points/04-scope-and-personas.md#in-scope). Solution-design scope added here:

- One deployable with the modules of §13, their PostgreSQL schemas, and one Helm chart.
- A customer web app that works on phones and computers and a staff web app, both signing in through Keycloak and calling the platform through the API gateway.
- The integrations of §12, including the ingestion of the Point-of-Sale purchase and refund feed.
- The branch refund report and the monthly points report, served in-app with CSV and Excel export.
- The link between a paid refund and the points taken back for it (§8.4.3).

## 2.2 Out of Scope

Business exclusions: [REFUNDS 04 § Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope), [LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope), and the wishlists ([REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist), [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist)). Solution-design exclusions added here:

- A message broker and separately deployed services, until an extraction trigger of ADR-01 fires (ADR-02).
- Changes to the Point-of-Sale systems, which the Retail IT team owns; what the tills need from this platform for vouchers is open (R-08).
- Native mobile apps. **[NEEDS CLARIFICATION: is a native mobile app in scope? [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) is titled "Web and Mobile" and names push notifications in the mobile app as a future enhancement, while [REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations) and [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations) ask only that the customer screens work on phones and computers.]**

---

# 3. Assumptions

Business assumptions: [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) and [LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints). Technical assumptions added by this SDD:

1. **Receipt lookup:** the Point-of-Sale Records answer a lookup by receipt number with the receipt's branch, purchase date, items, amounts, and the items already refunded at a till, so that [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) A1 covers till refunds as well as portal refunds.
2. **Stable POS record ids:** every purchase and refund record in the Point-of-Sale feed carries a unique, stable id, and the loyalty module deduplicates on it (LOYALTY/NFR-02).
3. **Original-card reference:** **[NEEDS CLARIFICATION: which reference lets the Payment Provider pay back to the original card? The receipt data in [REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations) has no card payment reference; confirm whether CardPay refunds by its own original transaction id (which the Point-of-Sale Records must then supply) or by receipt number.]**
4. **Customer identity:** customers sign in with a platform account in Keycloak that is linked to their loyalty card, and a refund request belongs to the signed-in customer. **[NEEDS CLARIFICATION: how a customer account is created and linked to a loyalty card; neither BRD has a sign-up, sign-in, or card-linking use case.]**
5. **Staff identity:** branch managers and loyalty managers have staff accounts in the same Keycloak realm, and each branch manager's branch is a token claim. **[NEEDS CLARIFICATION: where staff accounts and branch assignments come from: administered in Keycloak, or federated from a staff or store directory.]**
6. **Contact details:** the email address and mobile number used for customer messages come from the customer's account profile at send time.
7. **One tenant, one currency:** one tenant (the retailer) at go-live, and all branch purchases of a tenant are in one currency, on which points are computed ([LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary), "Points").

---

# 4. Risks

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01 | A request that looks submitted but is not durably recorded brings back the lost-request problem ([REFUNDS 02 § Challenges](../brd-refunds-portal/02-glossary-assumptions-facts.md#challenges) 1). | L | H | The request, its reference number, and its outbox row commit in one transaction before the confirmation is shown; every status change is kept as history for [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile). | **[NEEDS CLARIFICATION: risk owner]** |
| R-02 | Balances look wrong or stale when the Point-of-Sale feed lags, so customers keep calling customer care ([LOYALTY 02 § Challenges](../brd-loyalty-points/02-glossary-assumptions-facts.md#challenges) 1). | M | M | Balances show when they were last updated ([LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)); feed lag is a metric with an alert (§11.4); the feed mechanism is flagged in §12 (INT-03). | **[NEEDS CLARIFICATION: risk owner]** |
| R-03 | Hard dependency on the Payment Provider ([REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) 1): it may not pay back to the original card from the data the platform holds, or may not make payout requests idempotent, which blocks automatic payouts or risks paying twice (REFUNDS/NFR-01). | M | H | Confirm with CardPay before part 2: refunds to the original card (§3 item 3), idempotent requests or a payout status query, and how results are reported (INT-01). | **[NEEDS CLARIFICATION: risk owner]** |
| R-04 | Hard dependency on the Point-of-Sale purchase and refund records ([LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies) 1): a late, incomplete, or repeated feed makes points drift from purchases ([LOYALTY 01 § Business Objectives](../brd-loyalty-points/01-executive-summary-and-context.md#business-objectives) 3). | M | H | Deduplicate on POS record ids (§3 item 2); replay the feed after an outage; reconcile points earned against purchases every month, alongside the monthly points report. | **[NEEDS CLARIFICATION: risk owner]** |
| R-05 | A portal refund takes points back twice, or never, because refund facts may reach the loyalty module both from the Point-of-Sale feed and from the refunds module (LOYALTY/NFR-02). | M | H | One source per refund fact, settled by the clarification in §8.4.3; the take-back is keyed on the refund reference, so a repeat is a no-op. | **[NEEDS CLARIFICATION: risk owner]** |
| R-06 | LOYALTY/TI-01 (loyalty data in MongoDB) is not applied (ADR-03); if the CRM architecture note is binding, the loyalty persistence must change. | M | M | The loyalty persistence stays behind repository ports, so a MongoDB adapter can replace the PostgreSQL one; the owner of the CRM architecture note confirms the deviation. | **[NEEDS CLARIFICATION: risk owner]** |
| R-07 | Customers already hold points ([LOYALTY 01 § Background and Context](../brd-loyalty-points/01-executive-summary-and-context.md#background-and-context)), so their balances must be in the ledger before go-live; the system that holds them today and the loading method are unknown. | H | H | **[NEEDS CLARIFICATION: which system holds today's points balances, and how they are loaded into the loyalty ledger (a one-off migration with opening-balance entries, or a parallel run).]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-08 | Vouchers cannot be used at a till: [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations) names no flow that tells the Point-of-Sale systems about issued vouchers or reports their use, so a voucher could be refused or used twice. | H | H | **[NEEDS CLARIFICATION: how tills check a voucher code and mark it used: a voucher check call from the tills to the loyalty module, a voucher list pushed to the Point-of-Sale systems, or a process outside this platform.]** | **[NEEDS CLARIFICATION: risk owner]** |
| R-09 | Seasonal peaks (REFUNDS/NFR-03) and the Point-of-Sale purchase feed share one deployable (ADR-01); a feed backlog could slow the customer screens. | M | M | Stateless replicas scale out; feed ingestion runs in its own bounded worker pool, apart from web request handling (bulkhead); a separate loyalty deployable is an extraction trigger of ADR-01; targets in §18 (part 3). **[NEEDS CLARIFICATION: daily purchase count and peak rate of the Point-of-Sale feed; neither BRD states them.]** | **[NEEDS CLARIFICATION: risk owner]** |

---

# 5. Glossary

Business terms are defined in [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary) and [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary) and are not repeated here. One business term has a different meaning in each BRD, so both meanings are listed. The other rows are the technical terms and acronyms this SDD adds.

| Term | Definition |
|------|------------|
| Payout (REFUNDS) | The money sent back to the customer's original card, as defined in [REFUNDS 02 § Glossary](../brd-refunds-portal/02-glossary-assumptions-facts.md#glossary). SDD technical names use "card payout". |
| Payout (LOYALTY) | The points added to a customer's balance for a purchase, as defined in [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary). SDD technical names use "points earned". |
| Access token claim | A named value inside a Keycloak access token, such as the tenant or the branch of a branch manager. |
| Adapter | In hexagonal architecture, the component that connects a port to a transport or an infrastructure (REST controller, database repository, provider client, event handler). |
| ADR | Architecture Decision Record; one row of §10, numbered ADR-NN. |
| Anti-corruption adapter | An outbound adapter that translates an external system's model into the module's own model, so provider concepts never leak into the domain core. |
| AP | Architecture Principle; one row of §9, numbered AP-NN. |
| API | Application Programming Interface. |
| Angular | The web framework of the customer and staff web apps (standalone components). |
| API gateway | The edge component in front of the deployable that authenticates requests, resolves the tenant, applies rate limits, and logs requests. |
| AuthN | Authentication. |
| AWS | Amazon Web Services. |
| BI | Business Intelligence (reporting tools). |
| Bounded context | A DDD boundary inside which one model and one language apply; each module of §13 is one bounded context. |
| BRD | Business Requirements Document; the source documents of this SDD, each with a key (REFUNDS, LOYALTY) that prefixes every ID cited from it. |
| BRD citation grammar | After a keyed use case link: `step N` (Main Flow step), `A1` (alternate flow), `E1` (exception flow), `BR-N` (business rule), `AC-N` (acceptance criterion). |
| Bulkhead | An isolated pool of threads or connections for one dependency, so that a slow dependency cannot exhaust the resources of the others. |
| Card payout | SDD name for a REFUNDS payout: money sent back to the original card, owned by the card-payouts module. |
| CI/CD | Continuous Integration / Continuous Delivery. |
| Circuit breaker | A guard that stops calling a failing dependency for a while after repeated failures, then probes it again. |
| CLAUDE.md | The file that holds the platform defaults (stack, tenancy, messaging, and engineering rules) applied where the BRDs are silent. |
| CORS | Cross-Origin Resource Sharing. |
| Correlation id | An opaque id carried on every request, event, and log line of one business interaction. |
| CRM | Customer Relationship Management; the owner of the architecture note behind LOYALTY/TI-01. |
| CSV | Comma-Separated Values (export format). |
| DB | Database. |
| DDD | Domain-Driven Design. |
| DEBUG, INFO | Log levels; INFO and above never carry `tenant_id` or PII. |
| Deployable | The single runtime unit (one container image) that holds every module of §13. |
| Domain event | A fact a module records about its own state change (for example, a refund request approved), written to its outbox and delivered to other modules. |
| DTO | Data Transfer Object. |
| EDA | Event-Driven Architecture. |
| Expand-contract | A migration pattern: add the new structure, move readers and writers over, then remove the old structure, so two consecutive releases can run on the same schema. |
| Extraction trigger | A measurable condition, listed in ADR-01, that justifies moving a module into its own deployable. |
| Flyway | The database migration tool; versioned SQL files only. |
| HA | High Availability. |
| Helm chart | The package that deploys the deployable to Kubernetes, with values per environment. |
| Hexagonal architecture | Ports and adapters: a domain core with inbound and outbound ports, and adapters that plug transports and infrastructure into those ports. |
| HTTPS | Hypertext Transfer Protocol over TLS. |
| Hybrid | A modular monolith core plus separately deployed services for the parts that must scale, fail, or be released on their own. |
| IAM | Identity and Access Management. |
| Idempotency key | A client-supplied key that makes a repeated write return the first result instead of acting twice (`Idempotency-Key` header). |
| i18n | Internationalisation. |
| Inbox | A per-consumer table of processed event ids; a handler skips an event whose id is already there. |
| Ingress controller | The Kubernetes component that routes external HTTPS traffic into the cluster. |
| INT | Integration; one row of §12, numbered INT-NN. |
| ISO 4217 | The standard three-letter currency codes. |
| JSON | JavaScript Object Notation. |
| JUnit 5, Mockito, Testcontainers, Jest, Playwright | The test tools of AP-11: backend unit tests, mocks, integration tests against a real PostgreSQL, web app unit tests, and end-to-end browser tests. |
| Kafka | The platform's default event broker on-premises; not used in this release (ADR-02). |
| Keycloak | The identity provider; one realm holds customers and staff. |
| Kubernetes | The container orchestration platform that runs the deployable. |
| L/M/H | Low / Medium / High (risk likelihood and impact). |
| LLD | Low-Level Design; a child document derived from this SDD. |
| Microservices | One separately deployed service per bounded context, each with its own database. |
| Modular monolith | One deployable made of modules with strict boundaries (ADR-01). |
| Module | A bounded context inside the deployable, with its own schema, ports, and domain events; a row of §13. |
| MongoDB | A document database; the engine LOYALTY/TI-01 names for loyalty data, not applied (ADR-03). |
| NFR | Non-Functional Requirement; cited with its BRD key (REFUNDS/NFR-02). |
| OCI image | A container image in the Open Container Initiative format. |
| OIDC | OpenID Connect. |
| OnPush | The Angular change-detection strategy that re-renders a component only when its inputs or signals change. |
| OpenAPI | The specification format for REST APIs. |
| OpenTelemetry | The tracing and telemetry standard and toolkit. |
| Outbox | A table in each module schema where a state change and the event or provider call it causes are written in one transaction. |
| Outbox relay | The in-process component that reads committed outbox rows and delivers them to handlers and provider adapters. |
| Parked message | An outbox delivery that exhausted its retries and waits for an operator to redrive it. |
| PII | Personally Identifiable Information. |
| PKCE | Proof Key for Code Exchange (OIDC authorization code flow for browser apps). |
| Points earned | SDD name for a LOYALTY payout: points added to a balance for a purchase. |
| Points ledger | The append-only list of point entries (earned, taken back, spent, adjusted) from which a balance is computed. |
| Port | In hexagonal architecture, an interface the domain core exposes (inbound) or needs (outbound). |
| POS | Point-of-Sale; the Point-of-Sale Records of the Retail IT team. |
| PostgreSQL | The relational database of the platform (ADR-03). |
| PrimeNG, Tailwind | The UI component library and the utility-first styling framework of the web apps. |
| Problem Details | RFC 9457 error response format (`application/problem+json`), extended with an `errorCode`. |
| Prometheus | The metrics collection system. |
| RDBMS | Relational Database Management System. |
| RED metrics | Rate, Errors, Duration: the three metrics recorded per endpoint and per dependency. |
| Resilience4j | The library that provides timeouts, retries, circuit breakers, and bulkheads. |
| REST | Representational State Transfer. |
| RFC | Request for Comments (an internet standard document). |
| RTL | Right-to-left text direction (Arabic). |
| SDD | Solution Design Document (this document). |
| Shortfall | The points that could not be taken back because the balance would go below zero; recorded for the loyalty manager ([LOYALTY 03 § Points balance](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-balance)). |
| Signals | Angular's reactive state primitive, used for component state. |
| SIT | System Integration Testing environment. |
| SLO | Service Level Objective. |
| SMS | Short Message Service (text message). |
| SNS, SQS | Amazon Simple Notification Service and Simple Queue Service. |
| Spring Boot | The Java application framework of the deployable. |
| SQL | Structured Query Language. |
| TBD - external | A provider-owned contract field left open until the provider's documentation is supplied (§15). |
| Tenant, `tenant_id` | A customer organisation of the platform (the retailer at go-live) and the column that isolates its rows. |
| TI | Technical Input: a source mandate parked in a BRD appendix, cited with its key (REFUNDS/TI-01). |
| TLS | Transport Layer Security. |
| UAT | User Acceptance Testing environment. |
| UC | Use case; cited as `KEY/UC-NN` and linked to its heading in that BRD. |
| UI/UX | User Interface / User Experience. |
| URI | Uniform Resource Identifier (the path of an API endpoint). |
| UTC | Coordinated Universal Time. |
| UUIDv7 | A time-ordered UUID version, used for every primary key. |
| W3C trace context | The standard HTTP headers that carry a trace across services. |
| WCAG | Web Content Accessibility Guidelines; "WCAG 2.1 AA" is conformance level AA of version 2.1. |

**[NEEDS CLARIFICATION: "Payout" has a different meaning in each source BRD. Confirm one business term per meaning for screens, messages, and reports, for example "payout" for money back to the card and "points earned" for loyalty.]**

<!-- MASTER: retail-customer-platform-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-ecosystem-overview.md -->
