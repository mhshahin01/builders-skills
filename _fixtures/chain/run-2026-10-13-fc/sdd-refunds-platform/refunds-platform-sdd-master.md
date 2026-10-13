<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.4
PART OF: SDD - Refunds Platform
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and chunk 00 carry the current SDD version; every other chunk carries the version in which its content last changed, and chunk 19 the version it was written at (a later write that changes none of its content keeps it).
MAINTENANCE: When adding or removing chunks (especially 13x service chunks), update the tables below, the dependency graph, and the reading-order table.
-->

# SDD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Solution Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Lineage:** this SDD's source BRDs (parents, each with its key) and child LLDs are listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference in the chunks carries its BRD key (for example `REFUNDS/UC-NN`).

> **Specs note:** The constitution-grade `Specs` chunk (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with each child LLD (`../lld-[lld-slug]/17-specs.md`), synthesised from this SDD's body. The SDD carries no Specs chunk.

> **Decision history:** [decision-log.md](./decision-log.md) holds the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, the settled markers, and how each decision was reached. The chunks below state only the settled design.

---

## Generation Progress

**Generation:** whole
**Intent:** derive-from-BRD
**Source:** ../brd-refunds-portal/refunds-portal-brd-master.md (REFUNDS v1.5); ../brd-loyalty-points/loyalty-points-brd-master.md (LOYALTY v1.7)

**Reconciled:**
1. 2026-10-10, step 6a by the author (sdd-unifier), initial build request, before the review: items 1-10 checked, no divergence, nothing to flag; checked content `sha256:fbca640b40504b18 (chunks 00-17, Changes Log and Child LLDs left out)`.
2. 2026-10-10, step 6a by the author (sdd-unifier), initial build request, after the acceptance loop, the marker walk, both scoped application checks, and the last body edit (the BRD key on the REFUNDS 12 TI-01 and REFUNDS 12 TI-02 citations of §8.1.2, fixed by this run): items 1-10 checked; the divergences OI-26 carries (a §11.2 job list, INT-01 cells, API-03 key wording, the Figure 17 summary, §17.2 concepts) follow that item and are not fixed here; no other divergence; checked content `sha256:7db2238cb81ef76b (chunks 00-17, Changes Log and Child LLDs left out)`.
3. 2026-10-10, step 6a by the author (sdd-unifier), request "Apply the decisions waiting for application in the Refunds Platform SDD (OI-26, OI-27)" (v1.1), after the last body edit of the request (OI-26, OI-27, and OI-28 applied; both scoped checks done): items 1-10 checked, with the data-model check of item 7 on 13b (Entity Relationship and Boundaries changed) and the entry-point tie of item 8 for the new `Schedule` rows of §17.2 and §17.3 Input (no use case cited); no divergence, nothing to flag. The request started from content `sha256:7db2238cb81ef76b`, which matches entry 2, so no edit outside the skill. Checked content `sha256:9bd43f74c393244d (chunks 00-17, Changes Log and Child LLDs left out)`.
4. 2026-10-10, step 6a by the author (sdd-unifier), request "BRD REFUNDS and BRD LOYALTY have a new version, after the business review of 2026-10-10" (v1.3), run after the request's last body edit (the short labels on the BR-8 and AC-13 citations, after the last review pass): items 1-10 checked, with the data-model check of item 7 on 13a, 13b, and 13d (DB Modeling changed) and the §7.3 checks of item 8 against REFUNDS v1.5 and LOYALTY v1.7; 13 in-process events reconciled from both sides, every token in §16.11, every link and anchor resolving, every BRD ID keyed; fixed: the BRD key on four `REFUNDS/NFR-01` and `REFUNDS/NFR-04` citations (13b, chunk 18) and on the review records of decision-log.md; no divergence left, nothing flagged. The request started from content `sha256:87f6ffde646c31af`, whose difference from entry 3 is the v1.2 business review row, so no edit outside the skill. Checked content `sha256:383424054ea98b4f (chunks 00-17, Changes Log and Child LLDs left out)`.
5. 2026-10-10, step 6a by the author (sdd-unifier), request "Apply the decisions waiting for application in the Refunds Platform SDD (OI-47)" (v1.4), run after the request's last body edit (OI-47 applied to §17.2 Disputes; the BRD key on the REFUNDS 12 TI-01 citation of the §6 Observability: Metrics row; the application check done): items 1-10 checked, the data-model check of item 7 not owed (no DB Modeling changed); 13 in-process events reconciled from both sides by name, publisher, listeners, and DTO; every 13x permission token in §16.11; every cited API ID in §15.2; every link and anchor resolving; fixed: the BRD key on the REFUNDS 12 TI-01 citation of §6; no divergence left, nothing flagged. The request started from content `sha256:383424054ea98b4f`, which matches entry 4, so no edit outside the skill. Checked content `sha256:96819fd891ef423f (chunks 00-17, Changes Log and Child LLDs left out)`.
**E2E gate (chunk 19):** Locked - E1 met (OI-01 to OI-47 are Accepted - applied or Rejected); E2 met (no Open row in §14.8, §15.5, or §16.12.3); E3 not met (23 blocking markers, inventory below); E4 met (Reconciled entry 5)
**E2E basis:** None (chunk 19 not written)

### E3 marker inventory

Rechecked 2026-10-10 at v1.4 from chunks 01-17 (chunk 00 holds no marker; HTML comments and the Changes Log left out), after the request's last body edit, against content `sha256:96819fd891ef423f`; no marker changed since v1.3: 78 live markers, 23 block E3; every row copies its marker's question verbatim and every live marker has its row. No `[TBD - EXTERNAL: ...]` placeholder needs a row: API-01, API-02, API-03, API-04, API-05, API-07, API-08, and API-09 are named black boxes and no claim asserts a provider contract field. Every blocking marker is a fact for a named owner (BRD owners, Retail IT team, CardPay Ltd, the product owner); none is a design choice.

| Marker source / question | Owner | Dependent E2E claim / reference path | Blocks E3 / reason | Next action |
|---|---|---|---|---|
| [01 § 4. Risks](./01-executive-summary-scope-risks.md#4-risks): Who owns the mitigation and monitoring of each risk R-01 to R-09? | product owner | None | No: risk ownership is not asserted by any chunk 19 claim | None |
| [01 § 5. Glossary](./01-executive-summary-scope-risks.md#5-glossary): Does a refund request Rejected because the customer's bank refunded the disputed card payment take back points like a paid refund, and for which amount? | LOYALTY BRD owner with the REFUNDS BRD owner | Saga 'refund saga' compensating steps (§14.7, §17.4 Other refund outcomes): a yes adds a take-back for a Rejected outcome with `rejectionKind` `DISPUTE_REFUNDED` | Yes | Answer in [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) with the REFUNDS owner; then the SDD adds the take-back in §17.4 and its fields in §14.10 |
| [01 § 5. Glossary](./01-executive-summary-scope-risks.md#5-glossary): Is the LOYALTY purchase reference the same identifier as the REFUNDS receipt number, and if not, which data links a paid refund to the purchase that earned the points? | REFUNDS and LOYALTY BRD owners, with the Retail IT team (POS Records) | Saga 'take back points for a paid refund' (§8.4.3, §8.5.3): the event RefundRequestPaid -> loyalty-points can only match the purchase once this is answered | Yes | Answer the question; then the SDD applies the matching rule in §5 and §17.4 |
| [01 § 5. Glossary](./01-executive-summary-scope-risks.md#5-glossary): Are all branch purchases and refunds in EUR? | REFUNDS BRD owner | None | No: the currency changes amounts only; no edge, role, or saga outcome | None |
| [02 § 6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which managed container service and hosting location (cloud provider and region, or on-premises) runs the deployable? | product owner | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers, versions, or regions; the location follows the data-protection law (§11.3), whose marker is also nonblocking | None |
| [02 § 6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which PostgreSQL 17 offering and which high-availability topology (standby, backups, point-in-time recovery) meets REFUNDS/NFR-02? | product owner with the platform team | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [02 § 6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which secrets manager stores the provider credentials and the IAM client secrets? | product owner | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [02 § 6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which CI/CD platform builds and deploys the container image? | product owner | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [02 § 6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which log, metrics, and trace backends receive the deployable's telemetry? | product owner | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [02 § 6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): What is the brand or key color of the platform's web screens? REFUNDS 11 and LOYALTY 11 leave it open. | product owner | None | No: frontend styling; no chunk 19 claim | None |
| [02 § 6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which versions are pinned for the components whose Version / Tier cell reads "Pin at build"? | platform team | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [07 § 11.3 Deployment (Default)](./07-cross-cutting-concerns.md#113-deployment-default): What CPU and memory requests, limits, and autoscaling bounds does the deployable run with? | platform team | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [07 § 11.6 Security (Default)](./07-cross-cutting-concerns.md#116-security-default): What rotation cadence applies to provider credentials and IAM client secrets? | product owner | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [07 § 11.6 Security (Default)](./07-cross-cutting-concerns.md#116-security-default): Which vulnerability and dependency scanning tools run in the pipeline, and which severity blocks a release? | product owner | None | No: ecosystem or platform setting; chunk 19 cites §8.3 layers, not providers or versions | None |
| [08 § 12. Integrations](./08-integrations.md#12-integrations): What timeout, retry count, and backoff bounds apply to CardPay payout calls, within the provider's limits? | solution architect, once CardPay's documentation is supplied | None | No: our-side timeout and retry numbers; no edge or saga outcome depends on them | None |
| [08 § 12. Integrations](./08-integrations.md#12-integrations): What timeout, retry count, and backoff bounds apply to MsgHub message calls? | solution architect, once MsgHub's documentation is supplied | None | No: our-side timeout and retry numbers; no edge or saga outcome depends on them | None |
| [08 § 12. Integrations](./08-integrations.md#12-integrations): What timeout and retry bounds apply to the receipt lookup, which the customer waits for? | solution architect, once the POS Records documentation is supplied | None | No: our-side timeout and retry numbers; no edge or saga outcome depends on them | None |
| [12 § 16.2 Resolution Model - How a Role Becomes an Allowed Action](./12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action): How do customers and members prove who they are, and does one end-customer sign-in serve both the refund and the loyalty screens? REFUNDS 03 § Customer identity and the [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) precondition leave it open. | REFUNDS and LOYALTY BRD owners | Actors, identity edge and role claims (§8.2, §16.2, §24.2): web app -> IAM sign-in for CUSTOMER and MEMBER (the own-request gate does not depend on it: one identity per person, ADR-07) | Yes | Answer in REFUNDS 03 and LOYALTY 06a; then ADR-07 and §16.2 are settled |
| [12 § 16.4.2 STAFF Roles](./12-centralized-user-roles.md#1642-staff-roles): Which role, besides the branch manager of the branch, may read a refund request's decision record? REFUNDS 03 § Decision record leaves it open. | REFUNDS BRD owner | Role catalogue claim (§16.4, §16.11): which roles read the decision record | Yes | Answer in REFUNDS 03 § Decision record |
| [12 § 16.4.2 STAFF Roles](./12-centralized-user-roles.md#1642-staff-roles): Which role decides on a branch's refund requests when its branch manager is away or the post is vacant, and with which scope? REFUNDS 03 § Branch ownership leaves it open. | REFUNDS BRD owner | Role catalogue claim (§16.4, §16.11): cover decider role and scope | Yes | Answer in REFUNDS 03 § Branch ownership |
| [12 § 16.4.2 STAFF Roles](./12-centralized-user-roles.md#1642-staff-roles): Which role decides on a refund request that a branch manager submits for a purchase at their own branch? [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-6: no decision on own request leaves the decider open. | REFUNDS BRD owner | Role catalogue claim (§16.4, §16.11): decider of a branch manager's own request | Yes | Answer in [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-6: no decision on own request |
| [12 § 16.4.2 STAFF Roles](./12-centralized-user-roles.md#1642-staff-roles): Does the decision view show the customer's earlier refund requests, and from which branches? [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-4: earlier requests leaves it open, and the answer widens the branch manager's read scope. | REFUNDS BRD owner | Role and security claim (§16.4, §16.5): branch manager read scope | Yes | Answer in [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-4: earlier requests |
| [12 § 16.4.2 STAFF Roles](./12-centralized-user-roles.md#1642-staff-roles): Above which refund amount, if any, must a second person also approve a refund, and which role is that person? [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-7: second approval above an amount leaves it open; a yes adds a role, a permission token, and an approval step before Approved. | REFUNDS BRD owner | Role catalogue claim and saga step (§16.4, §16.11, §14.7): a yes adds a role, a permission token, and an approval step before Approved | Yes | Answer in [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-7: second approval above an amount |
| [12 § 16.4.2 STAFF Roles](./12-centralized-user-roles.md#1642-staff-roles): Do customer care agents get a read-only view of a customer's refund requests? [REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors) leaves it open; a yes adds a staff role with a read permission token and widens who may see a request under REFUNDS/NFR-04. | REFUNDS BRD owner | Role catalogue claim (§16.4, §16.11): a yes adds a read-only staff role | Yes | Answer in REFUNDS 04 § Personas / Actors |
| [12 § 16.4.2 STAFF Roles](./12-centralized-user-roles.md#1642-staff-roles): Which team holds `PAYOUT_OPERATOR`, recording and confirming payout results by hand and checking every month that no payout is missing or paid twice? [REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors) leaves it open. | REFUNDS BRD owner | None | No: it names the team that holds an existing role; chunk 19 asserts roles, not teams | None |
| [12 § 16.6 Grant / Invitation Authority (who can create whom)](./12-centralized-user-roles.md#166-grant--invitation-authority-who-can-create-whom): Which system records that a person joins or leaves the loyalty program, which member identifier links a POS Records purchase to the signed-in member, how does Loyalty Points learn both, and how long after a member leaves can the leave date reach Loyalty Points? The membership source owns joining and leaving; `loyalty-points` keeps a copy of the leave date (§17.4 Membership), so a late leave date can earn or take back points that LOYALTY 03 rules out. LOYALTY 03 § Member leaves the loyalty program leaves the leaving record open. | LOYALTY BRD owner | Grant authority and a possible inbound edge to loyalty-points (§16.6, §24.7): membership source | Yes | Answer in LOYALTY 03; then the SDD adds the membership integration |
| [12 § 16.6 Grant / Invitation Authority (who can create whom)](./12-centralized-user-roles.md#166-grant--invitation-authority-who-can-create-whom): Who creates branch manager accounts and assigns each one's branch, and from which source of record? | product owner with the Retail IT team | Grant authority claim (§16.6): who grants BRANCH_MANAGER with branch_id and PAYOUT_OPERATOR | Yes | Name the provisioning source of record |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Can a unit on a Rejected request be requested again, and can the rest of a unit refunded in part be requested? [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-6: request again after rejection and [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-7: rest after partial refund leave both open. | REFUNDS BRD owner | None | No: an eligibility setting inside refund-request; no edge or role | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Do purchases made in some periods or some item types have a refund window other than 30 days, and must the customer pick the reason from a list that separates a change of mind from a faulty item, with another window or remedy for a faulty item? [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-9: other refund windows and [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-10: reason list leave both open; the window becomes an eligibility setting per period or item type, and the reason a field with a list. | REFUNDS BRD owner | None | No: eligibility settings and a reason field inside refund-request; a different remedy would come as a new use case in a REFUNDS version | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Which items can never be refunded, how is the 30-day window counted, and how is a purchase paid partly by card refunded? [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-3: never-refundable items, [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-5: card purchases only, and REFUNDS/OI-11 leave these open, and store refund policy v3 is not attached. | REFUNDS BRD owner | None | No: eligibility rules inside refund-request; no edge or role | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Does the receipt number alone identify one purchase across all branches and days, and how soon after a purchase can Point-of-Sale Records find its receipt? The receipt lookup (API-04) and the unit-claim index on `(tenant_id, receipt_number, item_line, unit_no)` assume a unique receipt number; if it is not unique, both take the branch and purchase date as well. [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) 3 and 4 leave both open. | Retail IT team (Point-of-Sale Records) with the REFUNDS BRD owner | None | No: the key of the receipt lookup and of the unit-claim index inside refund-request; no edge, role, or saga outcome | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): How is the refund amount of a unit worked out when a discount applies to it or to the whole receipt? REFUNDS/OI-10 keeps this open in the BRD. | REFUNDS BRD owner | None | No: amount rule inside refund-request; no edge or role | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Is the 30-day refund window checked when the customer submits, or only when the customer enters the receipt? REFUNDS/OI-11 is still open on this. | REFUNDS BRD owner | None | No: an eligibility setting inside refund-request; no edge or role | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Must the customer give both an email address and a mobile number, or is one enough? If one is enough, a customer who gives no email address gets no cancellation message, because [REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages) sends it by email only. [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-4: email and mobile leaves it open. | REFUNDS BRD owner | None | No: a contact-detail setting inside refund-request; the message events and edges stay the same | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): How many days after submission is a request flagged late? [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-5: decide within the decision time leaves the number of days open. | REFUNDS BRD owner | None | No: a late flag inside refund-request; no edge or role | None |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Must the customer return the items to the branch before the branch manager approves a refund? A yes adds an items-received step before Approved to the state machine and a branch action that records it. [REFUNDS 03 § Refund request](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-request) leaves it open. | REFUNDS BRD owner | Saga and state claim (§17.1 state machine, §24.8): a yes adds a state and a branch entry point | Yes | Answer in REFUNDS 03 § Refund request |
| [13a § Business Logic](./13a-service-refund-request.md#business-logic): Are refund requests made in person at a branch after go-live recorded in the portal? A yes adds a staff-assisted submission entry point and a staff role that acts for the customer. [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) leaves it open. | REFUNDS BRD owner | Entry points and roles (§7.3, §16.4, §24.1): a yes adds a staff-assisted entry point and a role | Yes | Answer in REFUNDS 04 § Project Scope |
| [13a § Entity Relationship](./13a-service-refund-request.md#entity-relationship): ERD, table list, column types, constraints, and indexes for the refund request, its units, the decision record, the contact details, and the copy of the card disputes of refund-request. The BRD describes the concepts but does not commit to a relational schema. | solution architect | None | No: data model; chunk 19 asserts no table | None |
| [13a § Retention Policy](./13a-service-refund-request.md#retention-policy): How long are refund requests, decisions, and payout results kept, and how long are customer contact details kept after a request ends? REFUNDS/NFR-06 leaves both periods open. | REFUNDS BRD owner | None | No: retention period; chunk 19 asserts no retention claim | None |
| [13a § API Standards](./13a-service-refund-request.md#api-standards): Must a customer prove that a receipt is theirs (for example with details of the card used) before its items are shown? [REFUNDS 03 § Customer identity](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-identity) requires only that the customer proves who they are. | REFUNDS BRD owner | None | No: a check inside the receipt lookup of refund-request; no edge or role | None |
| [13a § List of APIs (Swagger-friendly)](./13a-service-refund-request.md#list-of-apis-swagger-friendly): Request and response fields of each refund-request endpoint; the use cases' acceptance criteria imply them but do not specify them. | solution architect | None | No: endpoint fields; chunk 19 names endpoints only | None |
| [13a § Compliance](./13a-service-refund-request.md#compliance): Which data-protection law applies to customer and member personal data, and what lawful basis and erasure duties follow from it? REFUNDS/NFR-04 and LOYALTY 03 § Member leaves the loyalty program leave it open. | REFUNDS and LOYALTY BRD owners | None | No: chunk 19 asserts no compliance claim; the law shapes retention, consent, and the hosting location, not edges, roles, or sagas | None |
| [13b § Business Logic](./13b-service-payout.md#business-logic): Does Point-of-Sale Records return, for a card purchase, the payment reference CardPay Ltd needs to refund the original card, and if not, where does the payout get it? | Retail IT team (POS Records) with CardPay Ltd | Saga 'decide and pay out' outcome (§8.4.2, §8.5.2): the payout needs the original-payment reference, and the answer may add a data source edge | Yes | Confirm with Retail IT and CardPay |
| [13b § Business Logic](./13b-service-payout.md#business-logic): How long does the payout module keep retrying a refused payout before it stops? [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 leaves it open. | REFUNDS BRD owner | Saga timing (§8.4.2, §14.7, §17.2): retry stop time of the payout saga, per round | Yes | Answer in [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |
| [13b § Business Logic](./13b-service-payout.md#business-logic): How is a customer paid when the payout to the original card can never succeed? [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 leaves it open. The answer adds a terminal payout outcome that `payout` reports to `refund-request` (a new event in §14.10), a refund request status after Approved (§17.1 Figure 16), the release of the request's unit claims, the customer message, and whether `loyalty-points` takes points back (§8.4.3). | REFUNDS BRD owner | Saga outcome (§8.4.2, §14.7, Figure 16): the answer adds a terminal payout event, a request status after Approved, the release of unit claims, a customer message, and the loyalty take-back decision | Yes | Answer in [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |
| [13b § Business Logic](./13b-service-payout.md#business-logic): Can CardPay Ltd report a dispute of the original card payment and its outcome, and does it send each dispute notice to the platform or does the platform fetch them? [REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) asks whether CardPay can report them. | CardPay Ltd, through the REFUNDS BRD owner | Synchronous edge API-09 CardPay <-> payout and its direction (§8.2, §8.3, §12, §24.7), and the hold step of the refund saga (§14.7) | Yes | Supply the CardPay dispute documentation (API-09) |
| [13b § Business Logic](./13b-service-payout.md#business-logic): How does CardPay Ltd tell the platform that the customer's bank sent back a payout CardPay had accepted: in a payout result callback (API-02), in its refund records (API-07), or another way? | CardPay Ltd, through the product owner | The edge that reports a payout sent back (API-02, API-07, or another) and the compensating step of §14.7 | Yes | Supply the CardPay documentation (API-02, API-07) |
| [13b § Integrations](./13b-service-payout.md#integrations): Does CardPay Ltd return the payout result in the response to the payout request, or later through a callback to the platform? | CardPay Ltd, through the product owner | Synchronous edge API-02 CardPay -> payout (§8.2, §8.5.2, §24.7): exists only if CardPay calls back | Yes | Supply the CardPay documentation (API-01, API-02) |
| [13b § Entity Relationship](./13b-service-payout.md#entity-relationship): ERD, table list, column types, constraints, and indexes for the payout, its rounds and attempts, its resolution rows, and the card disputes. The BRD describes the payout but does not commit to a relational schema. | solution architect | None | No: data model; chunk 19 asserts no table | None |
| [13b § Multi-Tenancy Specifications](./13b-service-payout.md#multi-tenancy-specifications): Does CardPay Ltd refund a branch card purchase through one merchant account for all branches or through the merchant account of the branch that made the sale? If per branch, the credentials and the payout carry the branch. [REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) asks it. | CardPay Ltd, through the REFUNDS BRD owner | None | No: per-branch credentials inside the payout adapter; no edge, role, or saga outcome | None |
| [13b § List of APIs (Swagger-friendly)](./13b-service-payout.md#list-of-apis-swagger-friendly): Request and response fields of each payout operator endpoint. | solution architect | None | No: endpoint fields; chunk 19 names endpoints only | None |
| [13c § Business Logic](./13c-service-customer-notification.md#business-logic): Which languages and wording do the customer messages use? REFUNDS 11 § UI/UX Expectations leaves the languages open. | REFUNDS BRD owner | None | No: message wording; no chunk 19 claim | None |
| [13c § Entity Relationship](./13c-service-customer-notification.md#entity-relationship): ERD, table list, column types, constraints, and indexes for the message and its send attempts. The BRD describes the messages but does not commit to a relational schema. | solution architect | None | No: data model; chunk 19 asserts no table | None |
| [13d § Input](./13d-service-loyalty-points.md#input): Does POS Records send each member purchase to Loyalty Points as it happens, or does Loyalty Points fetch the day's purchases, and on what schedule? | Retail IT team (POS Records) | Synchronous edge API-05 POS Records <-> loyalty-points direction (§8.2, §8.4.4, §24.7) | Yes | Supply the POS Records purchase-feed description (API-05) |
| [13d § Business Logic](./13d-service-loyalty-points.md#business-logic): How are points rounded for a purchase amount that is not a whole number of euros, and from which date do purchases earn points, with or without an opening balance from an earlier program? LOYALTY 03 § Earning points and § Start of points leave these open. | LOYALTY BRD owner | None | No: rounding and start date are rules inside loyalty-points; an opening balance is a one-time load, not a runtime edge | None |
| [13d § Business Logic](./13d-service-loyalty-points.md#business-logic): When the Refunds Portal reports that a Paid refund went back to Approved because the customer's bank sent the payout back, does Loyalty Points give back the points it took back, and does the refund take them back again when it is paid again? [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: paid refund takes points back and BR-3: once per paid refund, and [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations) names only the paid, rejected and cancelled outcomes. | LOYALTY BRD owner | Saga compensating step (§14.7, §17.4): whether a payout sent back gives points back | Yes | Answer in [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) |
| [13d § Business Logic](./13d-service-loyalty-points.md#business-logic): How is a member's balance corrected when a complaint about points is upheld, given that there is no correction movement? LOYALTY 03 § Points movement leaves it open, and the answer may add an entry point to loyalty-points. | LOYALTY BRD owner | Entry points of loyalty-points (§24.1 sync surface): the answer may add a correction entry point | Yes | Answer in LOYALTY 03 § Points movement |
| [13d § Entity Relationship](./13d-service-loyalty-points.md#entity-relationship): ERD, table list, column types, constraints, and indexes for the points account, movements, received purchases, processed refunds, refund outcomes, and parked take-backs. The BRD describes the concepts but does not commit to a relational schema. | solution architect | None | No: data model; chunk 19 asserts no table | None |
| [13d § Retention Policy](./13d-service-loyalty-points.md#retention-policy): How long are the purchase and refund details behind a movement kept, and how long after a member leaves is their history deleted? LOYALTY 03 § Keeping points history and § Member leaves the loyalty program leave both open. | LOYALTY BRD owner | None | No: retention period; chunk 19 asserts no retention claim | None |
| [13d § List of APIs (Swagger-friendly)](./13d-service-loyalty-points.md#list-of-apis-swagger-friendly): Request and response fields of each loyalty-points member endpoint; the use cases' acceptance criteria imply them but do not specify them. | solution architect | None | No: endpoint fields; chunk 19 names endpoints only | None |
| [14 § 18.1 Load Estimates](./14-performance-and-capacity.md#181-load-estimates): What volumes are expected in years 2 and 3 for refund requests, and how many loyalty members and member purchases per day does Loyalty Points handle in each year? | REFUNDS and LOYALTY BRD owners | None | No: capacity figures; not used by a chunk 19 claim | None |
| [14 § 18.2 Throughput Targets (per service)](./14-performance-and-capacity.md#182-throughput-targets-per-service): Sustained RPS, peak RPS, and p50, p95, and p99 latency targets for refund-request and loyalty-points; the BRD NFRs give no per-module technical granularity, and REFUNDS/NFR-05 leaves its seconds open. | solution architect with the REFUNDS BRD owner | None | No: capacity targets; not used by a chunk 19 claim | None |
| [14 § 18.4 Stress Testing Strategy](./14-performance-and-capacity.md#184-stress-testing-strategy): Which tooling, environment, scenario set, acceptance criteria, and cadence do stress tests use? | solution architect | None | No: stress-test plan; not used by a chunk 19 claim | None |
| [14 § 18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets): technical target for REFUNDS/NFR-05: REFUNDS 10 leaves the seconds of an everyday action open, so no latency budget can be derived. | REFUNDS BRD owner | None | No: NFR target; not used by a chunk 19 claim | None |
| [14 § 18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets): technical target for REFUNDS/NFR-07: REFUNDS 10 leaves open the countries whose tax law applies, the refund document the customer receives, and whether each paid refund is recorded in a fiscal register or in the branch's accounts; the answer may add a document the platform issues and an integration with a fiscal register or an accounting system. | REFUNDS BRD owner | Integrations and synchronous edges (§12, §24.7): the answer may add an integration with a fiscal register or an accounting system and a document the platform issues | Yes | Answer in REFUNDS/NFR-07 ([REFUNDS 10 § Non-Functional Requirements](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)) |
| [14 § 18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets): technical target for LOYALTY/NFR-03: LOYALTY 10 proposes "by the end of the day of the purchase" but leaves it to be confirmed, and the POS Records delivery (§17.4 Input) decides what is reachable. | LOYALTY BRD owner | None | No: NFR target; not used by a chunk 19 claim | None |
| [14 § 18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets): technical target for LOYALTY/NFR-04: LOYALTY 10 leaves the minutes of unavailability per month open; the shared deployable meets the REFUNDS/NFR-02 target meanwhile. | LOYALTY BRD owner | None | No: NFR target; not used by a chunk 19 claim | None |
| [15 § 19. Environments](./15-environments.md#19-environments): Which data refresh policy, sizing rules, DNS naming, and secrets layout does each environment use? The BRDs do not specify the environment model. | platform team | None | No: environment model; not used by a chunk 19 claim | None |
| [15 § 19. Environments](./15-environments.md#19-environments): Do CardPay Ltd, MsgHub, and Point-of-Sale Records offer test environments for SIT and UAT, and with what test data? | product owner with each provider | None | No: test environments; not used by a chunk 19 claim | None |
| [16 § 20.1.1 Restart a Service](./16-operations-runbook.md#2011-restart-a-service): What are the exact steps to restart one replica of refunds-platform-app on the chosen hosting service, and how is a restart confirmed healthy? | platform team | None | No: runbook step; not used by a chunk 19 claim | None |
| [16 § 20.1.3 Replay DLQ Messages](./16-operations-runbook.md#2013-replay-dlq-messages): What are the exact steps to inspect and re-drive incomplete publication-log listener rows, failed messages, and stopped payouts, and who may do it in Prod? | platform team | None | No: runbook step; not used by a chunk 19 claim | None |
| [16 § 20.1.4 Rotate Secrets](./16-operations-runbook.md#2014-rotate-secrets): What are the exact steps to rotate CardPay, MsgHub, POS Records, and IAM client credentials without downtime? | platform team | None | No: runbook step; not used by a chunk 19 claim | None |
| [16 § 20.1.5 Database Failover](./16-operations-runbook.md#2015-database-failover): What are the exact steps to fail over the PostgreSQL offering, and how are in-flight payouts checked afterwards? | platform team | None | No: runbook step; not used by a chunk 19 claim | None |
| [16 § 20.1.6 Tenant-Specific Incident Response](./16-operations-runbook.md#2016-tenant-specific-incident-response): What are the exact steps when one tenant's data or provider credentials are affected by an incident? | platform team | None | No: runbook step; not used by a chunk 19 claim | None |
| [16 § 20.1.7 Resolve a Stopped Payout](./16-operations-runbook.md#2017-resolve-a-stopped-payout): What are the exact steps for a payout that reached the retry stop time, and who contacts the customer? | REFUNDS BRD owner with operations | None | No: runbook step; not used by a chunk 19 claim | None |
| [16 § 20.1.8 Switch On a Product or Start More Branches](./16-operations-runbook.md#2018-switch-on-a-product-or-start-more-branches): What are the exact steps, approvals, and checks for switching the Refunds Portal or Loyalty Points on in Prod and for adding branches to `REFUNDS_PORTAL_BRANCHES`? | platform team with the product owner | None | No: runbook step; not used by a chunk 19 claim | None |
| [16 § 20.2 Diagnostics Cheatsheet](./16-operations-runbook.md#202-diagnostics-cheatsheet): Which severities, symptoms, first checks, and actions does the diagnostics cheatsheet list? | platform team | None | No: runbook content; not used by a chunk 19 claim | None |
| [16 § 20.3 On-Call](./16-operations-runbook.md#203-on-call): What are the on-call rotation, escalation path, paging policy per severity, and post-incident expectations? | product owner | None | No: on-call policy; not used by a chunk 19 claim | None |


---

## Document Metadata & History

| Section | Chunk |
|---------|-------|
| Title block, Version, Author, Reviewers, Approvers, Status | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Document Lineage (source BRDs with keys, child LLDs) | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Changes Log | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Table of Contents, Figures & Tables indices | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |

## Strategic Context & Risk

| Section | Chunk |
|---------|-------|
| 1. Executive Summary (technical) | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 2. Scope (In / Out) | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 3. Assumptions | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 4. Risks (likelihood, impact, mitigation) | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |
| 5. Glossary | [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md) |

## Technology Foundation

| Section | Chunk | Beneficial/ used for |
|---------|-------|-------|
| 6. Ecosystem Overview (full tech stack table, incl. Architecture Doctrine: modular monolith, DDD, hexagonal) | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |
| Ecosystem-level rules | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |

## Actors & Use Cases

| Section | Chunk |
|---------|-------|
| 7.1 Actors | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 7.2 Use Case Diagram | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |
| 7.3 Use Case Traceability (each BRD use case: owner service, entry points, flows, API contracts, events) | [03-users-and-use-cases.md](./03-users-and-use-cases.md) |

## System Architecture

| Section | Chunk |
|---------|-------|
| 8.1 Architecture Style (What / Why / How) | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.2 Context Diagram | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.3 High-Level Architecture Diagram | [04-architecture-style-and-diagrams.md](./04-architecture-style-and-diagrams.md) |
| 8.4 Workflow Diagrams | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |
| 8.5 Sequence Diagrams | [05-workflows-and-sequences.md](./05-workflows-and-sequences.md) |

## Governance & Decisions

| Section | Chunk |
|---------|-------|
| 9. Architecture Principles (AP-01 to AP-12) | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| 10. Architectural Decisions (ADRs) | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |

## Cross-Cutting Concerns

| Section | Chunk |
|---------|-------|
| 11.1 DB Modeling defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.2 Multi-Tenancy defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.3 Deployment defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.4 Observability defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.5 Configuration Management defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |
| 11.6 Security defaults | [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md) |

## Integrations

| Section | Chunk |
|---------|-------|
| 12. Integrations (protocol, auth, retries, rate limits) | [08-integrations.md](./08-integrations.md) |

## Services & Platform Contracts

| Section | Chunk |
|---------|-------|
| 13. Services Decomposition (summary table) | [09-services-summary.md](./09-services-summary.md) |
| 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts) | [10-events-hub.md](./10-events-hub.md) |
| 15. Service Integration API Contracts (HTTP: URI, headers, body, error codes, security, auth; in-process: port, DTOs, errors, permission, behaviour) | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities (platform-wide) | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 refund-request - Detailed Spec | [13a-service-refund-request.md](./13a-service-refund-request.md) |
| 17.2 payout - Detailed Spec | [13b-service-payout.md](./13b-service-payout.md) |
| 17.3 customer-notification - Detailed Spec | [13c-service-customer-notification.md](./13c-service-customer-notification.md) |
| 17.4 loyalty-points - Detailed Spec | [13d-service-loyalty-points.md](./13d-service-loyalty-points.md) |

> **Contract consistency:** chunk 10 (event hub) is the platform event contract registry - event names and DTOs in every `13x` chunk must match it verbatim; chunk 11 is the same for synchronous API contracts (method and URI match each `13x` List of APIs; external contracts stay `TBD - external` until the user supplies them); chunk 12 is the same for roles and permission tokens. Divergences are flagged in the registries' consistency/drift sections, never silently reconciled.

### Service Spec Sub-Sections (within each 13x chunk)

| Sub-Section | Description |
|-------------|-------------|
| What | Module definition & bounded context |
| Boundaries | Owns / does not own / upstream / downstream |
| Input | Inbound triggers (REST, events, schedules) |
| Business Logic | Core logic + state machines |
| Output | Outbound responses and events |
| Integrations | Per-module integration details, each with its API ID (chunk 11) or event (chunk 10) |
| DB Modeling | ERD, tables, retention, archival, encryption |
| Multi-Tenancy Specifications | Overrides to platform defaults |
| API Standards | Style, versioning, auth, idempotency, API list |
| Event-Driven Architecture | In-process events (must match chunk 10) |
| Constraints | Module-specific constraints and authorization notes |
| Error Handling | Sync + async error strategies |
| Observability & Monitoring | Logging, metrics, tracing |
| Developer Notes | Patterns, anti-patterns, test strategy |
| Service-Level Diagrams | Flow charts, sequence diagrams (inline Mermaid) |
| Compliance | GDPR, PCI-DSS, ISO, local regs |
| Deployment Strategy | Replicas, strategy, health, rollback |
| Future Enhancements | Known gaps and planned improvements |

## Performance & Operations

| Section | Chunk |
|---------|-------|
| 18.1 Load Estimates | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 18.2 Throughput Targets | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 18.3 Peak Scenarios | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 18.4 Stress Testing Strategy | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 18.5 NFR Targets (each BRD NFR: technical target, where realised) | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 19. Environments (Dev/SIT/UAT/Prod) | [15-environments.md](./15-environments.md) |
| 20.1 Common Operations (runbook procedures) | [16-operations-runbook.md](./16-operations-runbook.md) |
| 20.2 Diagnostics Cheatsheet | [16-operations-runbook.md](./16-operations-runbook.md) |
| 20.3 On-Call | [16-operations-runbook.md](./16-operations-runbook.md) |

## Appendices

| Section | Chunk |
|---------|-------|
| 21. Appendix (references, specs, schemas) | [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md) |
| 22. Wishlist (platform-level future enhancements) | [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md) |

## Review Output

| Section | Chunk |
|---------|-------|
| 23. Open Items & Clarifications | [18-open-items-and-clarifications.md](./18-open-items-and-clarifications.md) |

> Generated *after* the main SDD body by a cleared-context reviewer. Captures architecture-level gaps, missing scenarios, ADR ambiguities, and cross-chunk contract mismatches. Every item carries a **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply; the skill walks the user through each item for acceptance (an answer policy the user set for the run accepts the recommendations it may), then reflects accepted answers into the body and logs them in the Resolution Log.

## End-to-End View (gated)

| Section | Chunk |
|---------|-------|
| 24. End-to-End System Design (services · topics · producers · consumers) | 19-e2e-system-design.md - Locked until chunk 18 is cleared |

> Chunk 19 is written last only when E1-E4 are met: no open/deferred OI or divergence; no unresolved value required by an E2E claim after following source references, regardless of marker location; final relevant sources reconciled with ordered evidence. Use the E3 inventory above and the external black-box exception. It consolidates chunks 02-13x, citing context/layers and adding fan-out/saga views. Link it once written; keep an already-current body after verifying its sources/gate.

---

## Chunk Dependency Graph

```
refunds-platform-sdd-master.md (you are here)
|
+-- 00-cover-and-changelog.md ........... metadata, lineage (source BRDs, child LLDs), version history
+-- 01-executive-summary-scope-risks.md . why + what + boundaries + risks + glossary
+-- 02-ecosystem-overview.md ............ tech stack + architecture doctrine (single source of truth)
+-- 03-users-and-use-cases.md ........... actors + use case diagram + use-case traceability (BRD -> SDD)
+-- 04-architecture-style-and-diagrams.md architecture style + context + HLA
+-- 05-workflows-and-sequences.md ....... end-to-end flows + sequence diagrams
+-- 06-principles-and-decisions.md ...... governance: principles + ADRs
+-- 07-cross-cutting-concerns.md ........ platform defaults (DB, tenancy, deploy, observability, config)
+-- 08-integrations.md .................. external system connections
+-- 09-services-summary.md .............. decomposition overview table
|   +-- 10-events-hub.md ................ in-process event catalog (event contract registry)
|   +-- 11-api-contracts.md ............. integration API contracts (API contract registry)
|   +-- 12-centralized-user-roles.md .... platform-wide roles & authorities catalogue
|   +-- 13a-service-refund-request.md ... refund-request module spec
|   +-- 13b-service-payout.md ........... payout module spec
|   +-- 13c-service-customer-notification.md customer-notification module spec
|   +-- 13d-service-loyalty-points.md ... loyalty-points module spec
+-- 14-performance-and-capacity.md ...... load, throughput, peaks, stress testing
+-- 15-environments.md .................. Dev / SIT / UAT / Prod
+-- 16-operations-runbook.md ............ procedures, diagnostics, on-call
+-- 17-appendix-and-wishlist.md ......... references + future platform enhancements
+-- 18-open-items-and-clarifications.md . reviewer findings with recommended answers (post-generation)
+-- 19-e2e-system-design.md ............. end-to-end system map (gated: only after 18 is cleared; consolidates 02-13x)
```

### Reading Order by Task

| Agent Task | Start With | Then |
|------------|-----------|------|
| Understand the system | 19 (e2e, once written) | 01, 04, 02 |
| Design a new module | 07, 02 | 10 (event contracts), 11 (API contracts), 13a (copy as template), 09 |
| Review architecture | 04, 06 | 05, 07, 19 |
| Add an integration | 08 | 11 (API contract), 13x (module integrations sub-section) |
| Define DB schema | 07 (defaults) | 13x (DB Modeling sub-section) |
| Add / change an event | 10 (registry first) | the publishing + listening 13x chunks, then 18 |
| Define roles / permissions | 12 | 03, 11, the affected 13x chunks |
| Plan capacity / NFRs | 14 | 15, 01 (risks) |
| Write runbook procedures | 16 | 02 (ecosystem), 07 (observability) |
| Audit completeness | 00 (ToC) | all chunks sequentially |
| Check cross-cutting standards | 07 | 06 (principles), 02 (ecosystem) |
| Check contract consistency | 10 §14.8, 11 §15.5, 12 §16.12 | every 13x Event Model and List of APIs |
| Complete an external API contract | 11 §15.6 | the provider documentation, then 11 §15.3 |
| Map BRD use cases to services | 03 §7.3 (use-case traceability) | 09, then the owner's 13x chunk; each UC ID links to the use case in the BRD |
| Feed speckit `/constitution` | ../lld-[lld-slug]/17-specs.md (LLD-owned, one per child LLD) | 02, 09 |
| Steer `lld-unifier` (tech choices, contracts) | 02, 10, 11 | 09, 12; 00 § Document Lineage (Child LLDs) |
| Find the LLD for a use case | 03 §7.3 (owner service) | 00 § Document Lineage, the Child LLDs row whose scope names that service |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |

### Cross-Document Navigation (BRD <-> SDD)

| BRD Chunk | Related SDD Chunk(s) | Relationship |
|-----------|---------------------|--------------|
| [REFUNDS 01 - Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [REFUNDS 04 - Scope & Personas](../brd-refunds-portal/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | BRD personas become SDD actors |
| [REFUNDS 05 - User Journeys Overview](../brd-refunds-portal/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner service in 09 |
| [REFUNDS 06a - Use Cases: Customer](../brd-refunds-portal/06a-use-cases-customer.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [13a](./13a-service-refund-request.md) | UC flows become module business logic and error handling |
| [REFUNDS 06b - Use Cases: Branch Manager](../brd-refunds-portal/06b-use-cases-branch-manager.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [13a](./13a-service-refund-request.md), [13b](./13b-service-payout.md), [13c](./13c-service-customer-notification.md) | UC flows become module business logic and error handling |
| [REFUNDS 07 - Users & Use Cases Matrix](../brd-refunds-portal/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-module authorization rules |
| [REFUNDS 08 - Integrations](../brd-refunds-portal/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md), [sdd/10 - Event Hub](./10-events-hub.md) | BRD names partners and purpose; SDD details protocol, auth, retries, and the API contract; the Loyalty Points row becomes the in-process refund outcome events |
| [REFUNDS 10 - NFRs](../brd-refunds-portal/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [REFUNDS 12 - Appendix (Technical Inputs for the SDD)](../brd-refunds-portal/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | REFUNDS 12 TI-01 and REFUNDS 12 TI-02 seed the ecosystem selection |
| [LOYALTY 01 - Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [LOYALTY 04 - Scope & Personas](../brd-loyalty-points/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | BRD personas become SDD actors |
| [LOYALTY 05 - User Journeys Overview](../brd-loyalty-points/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner service in 09 |
| [LOYALTY 06a - Use Cases: Member](../brd-loyalty-points/06a-use-cases-member.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [13d](./13d-service-loyalty-points.md) | UC flows become module business logic and error handling |
| [LOYALTY 07 - Users & Use Cases Matrix](../brd-loyalty-points/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md) | Matrix drives the role catalogue |
| [LOYALTY 08 - Integrations](../brd-loyalty-points/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/10 - Event Hub](./10-events-hub.md) | POS Records becomes INT-03; the Refunds Portal row becomes the in-process refund outcome events (`RefundRequestPaid`, `RefundRequestRejected`, `RefundRequestCancelled`, `RefundRequestPayoutReturned`) |
| [LOYALTY 10 - NFRs](../brd-loyalty-points/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md) | Business expectations are quantified into technical targets |
| [LOYALTY 12 - Appendix](../brd-loyalty-points/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | No Technical Inputs for the SDD in this BRD |
