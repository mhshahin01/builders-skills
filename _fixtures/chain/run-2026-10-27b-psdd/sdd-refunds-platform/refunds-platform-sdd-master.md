<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: SDD - Refunds Platform
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and chunk 00 carry the current SDD version; every other chunk carries the version in which its content last changed, and chunk 19 the version it was written at (a later write that changes none of its content keeps it). Chunk 20 (the deck brief) carries the SDD version it is based on; its write and its Stale mark bump nothing.
MAINTENANCE: When adding or removing chunks (especially 13x service chunks), update the tables below, the dependency graph, and the reading-order table, and repoint the PREV and NEXT footers of the chunks on each side.
-->

# SDD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Solution Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Lineage:** this SDD's source BRDs (REFUNDS, LOYALTY), its source Pre-SDD (key `PSDD`), and its child LLDs are listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference in the chunks carries its BRD key (`REFUNDS/UC-04`), and every Pre-SDD reference is `PSDD/<ID>`.

> **Specs note:** The constitution-grade `Specs` chunk (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with each child LLD (`../lld-[lld-slug]/17-specs.md`), synthesised from this SDD's body. The SDD carries no Specs chunk.

> **Decision history:** [decision-log.md](./decision-log.md) holds the architecture questionnaire record, the ecosystem selection record, the Pre-SDD record, the clarification Q&A, and how each decision was reached. The chunks below state only the settled design.

---

## Generation Progress

**Generation:** whole
**Intent:** derive-from-BRD
**Source:** ../brd-refunds-portal/refunds-portal-brd-master.md; ../brd-loyalty-points/loyalty-points-brd-master.md; ../pre-sdd-refunds-platform/refunds-platform-pre-sdd-master.md

**Reconciled:** 1. 2026-10-27, step 6a by the author (sdd-unifier), first build, run after the last edit to chunks 00-17 before the baseline review: 11 in-process events matched from both sides, 13 permission tokens, 8 API contracts, §7.3 entry points, APIs, and events, every ERD against its Tables Design; 0 divergences
2. 2026-10-27, step 6a by the author (sdd-unifier), first build, run after the last applied answer (OI-36) and the last edit to chunks 00-17: 11 in-process events, 15 permission tokens, 9 API contracts, §7.3, and every ERD against its Tables Design; 0 divergences; content sha256:4cedb1b7e270bff0 (chunks 00-17, Changes Log and Child LLDs left out)
**Review passes:** 3 of 3 (baseline + 2 application)
**E2E gate (chunk 19):** Locked - E1 not met (OI-23 and OI-24 Open, owned by the E2E Architect, HR-004 and HR-005; OI-27 Open for the product owner; OI-37 and OI-38 Decided - pending application); E2 met (no Open row in §14.8, §15.5, or §16.12.3); E3 not met (17 blocking markers, inventory below); E4 met (Reconciled entry 2)
**E2E basis:** None (chunk 19 not written)
**Deck brief (chunk 20):** Locked - not written

### E3 marker inventory

| Marker source / question | Owner | Dependent E2E claim / reference path | Blocks E3 / reason | Next action |
|---|---|---|---|---|
| [3. Assumptions](./01-executive-summary-scope-risks.md#3-assumptions): Is the receipt number that the Refunds Portal sends the same purchase reference that Point-of-Sale Records gives Loyalty Points for the member's purchase? | Retail IT team | §24.8 saga refund paid to points taken back ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9, [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3: once per paid refund): the purchase match of the take-back | Yes | Answer with the Retail IT team; update §3 assumption 5 and §17.4 |
| [4. Risks](./01-executive-summary-scope-risks.md#4-risks): When a paid refund goes back to Approved because its payout was sent back, does Loyalty Points give back the points it took back for that refund? | Loyalty Points owner | §24.8 saga refund paid to points taken back ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9, [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3: once per paid refund): the outcome of a returned refund | Yes | LOYALTY owner states the rule (BRD follow-up); apply in §17.4 |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which cloud provider hosts the platform? | product owner | None | No: chunk 19 names no provider; the layered view cites §8.3, which shows the hosting target only | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting the cloud provider's managed container service as the runtime? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve running PostgreSQL as the cloud provider's managed database service? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting Keycloak as the identity provider? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting the cloud provider's secrets manager and key management service? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting the cloud provider's build and deployment pipeline service? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting the cloud provider's managed log service? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting the cloud provider's managed metrics service? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting OpenTelemetry and the cloud provider's managed tracing service? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which resilience library does the product owner approve for the provider adapters' timeouts, retries, and circuit breakers? | product owner | None | No: a library choice changes no count, edge, or claim of chunk 19 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): What is the brand or key color of the platform's screens? | product owner | None | No: a screen token, no chunk 19 claim | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Does the product owner approve adopting Angular for the web frontend? | product owner | None | No: chunk 19 asserts no product; the products stay §6 rows and Proposed ADRs are left out of §24.6 | None |
| [6. Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview): Which currency or currencies do refunds and payouts use? | Refunds and Loyalty Product Owner | None | No: amounts are `Money` values in every DTO whatever the currency; no edge changes | None |
| [7.1 Actors](./03-users-and-use-cases.md#71-actors): Which team records payout results by hand and confirms them? | Refunds and Loyalty Product Owner | None | No: the role `PAYOUT_STAFF` and its tokens stand; which team holds it changes no role or edge | None |
| [8.3 High-Level Architecture Diagram](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram): Which value does the Pre-SDD set for PSDD/INT-03.1, the limits CardPay Ltd imposes? | E2E Architect (pre-sdd-unifier), with CardPay Ltd ([PSDD/QD-04](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)) | None | No: provider limits size §12 and §18; chunk 19 asserts no limit | None |
| [8.3 High-Level Architecture Diagram](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram): Which value does the Pre-SDD set for PSDD/INT-03.2, the limits Point-of-Sale Records imposes? | E2E Architect (pre-sdd-unifier), with the Retail IT team ([PSDD/QD-05](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)) | None | No: provider limits size §12 and §18; chunk 19 asserts no limit | None |
| [8.3 High-Level Architecture Diagram](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram): Which value does the Pre-SDD set for PSDD/INT-03.3, open in its lock list? | E2E Architect (pre-sdd-unifier) | None | No: provider limits size §12 and §18; chunk 19 asserts no limit | None |
| [8.6.1 Deployment Topology](./05a-infrastructure-and-network.md#861-deployment-topology): In which countries or regions must the platform's data stay, given that data residency applies (PSDD/DAT-04.1 reads yes)? | E2E Architect (pre-sdd-unifier) | None | No: residency places §8.6 regions; chunk 19 asserts no region | None |
| [8.6.4 Backup and Disaster Recovery](./05a-infrastructure-and-network.md#864-backup-and-disaster-recovery): Which value does the Pre-SDD set for PSDD/DAT-09.1, open in its lock list, which §8.6.4 and the restore procedure of §20.1.5 design to? | E2E Architect (pre-sdd-unifier) | None | No: restore granularity is §8.6.4 and §20; no chunk 19 claim | None |
| [8.7.2 Ingress Path](./05a-infrastructure-and-network.md#872-ingress-path): Which threat protection does the Pre-SDD set for the public edge, open as PSDD/SEC-03.1? | E2E Architect (pre-sdd-unifier) | None | No: an edge protection component is §8.7.2; chunk 19 cites §8.3, which has none | None |
| [8.7.3 Egress to External Systems](./05a-infrastructure-and-network.md#873-egress-to-external-systems): Does CardPay Ltd require an IP allow-list, a private link, or a VPN for the payout API? | CardPay Ltd | None | No: a network path of §8.7.3; no chunk 19 claim | None |
| [8.7.3 Egress to External Systems](./05a-infrastructure-and-network.md#873-egress-to-external-systems): Does MsgHub require an IP allow-list for its messaging API? | MsgHub | None | No: a network path of §8.7.3; no chunk 19 claim | None |
| [8.7.3 Egress to External Systems](./05a-infrastructure-and-network.md#873-egress-to-external-systems): Is Point-of-Sale Records reachable over the internet, or only over a private connection to the business's network? | Retail IT team | None | No: a network path of §8.7.3; the API-01 and API-08 edges exist either way | None |
| [8.7.3 Egress to External Systems](./05a-infrastructure-and-network.md#873-egress-to-external-systems): Which value does the Pre-SDD set for PSDD/INT-06.1, which §8.7.3 designs the egress paths to? | E2E Architect (pre-sdd-unifier) | None | No: egress paths of §8.7.3; no chunk 19 claim | None |
| [8.7.7 Ports and Protocols](./05a-infrastructure-and-network.md#877-ports-and-protocols): Which container port does the managed container service map to the deployable? | Software Architect | None | No: a port of §8.7.7; no chunk 19 claim | None |
| [10. Architectural Decisions](./06-principles-and-decisions.md#10-architectural-decisions): Which tenancy model and isolation level does the Pre-SDD set in PSDD/DAT-07.1, within which the SDD chooses its multi-tenancy strategy? | E2E Architect (pre-sdd-unifier) | §24.5 and §24.7 tenant context on every event and sync edge (§15.1, §11.2); ADR-05 doctrine | Yes | E2E Architect settles PSDD/DAT-07.1; then Q7 and ADR-05 |
| [11.1 DB Modeling (Default)](./07-cross-cutting-concerns.md#111-db-modeling-default): Which database migration tool does the product owner approve for the versioned SQL migrations? | product owner | None | No: a library choice, no chunk 19 claim | None |
| [11.2 Multi-Tenancy (Default)](./07-cross-cutting-concerns.md#112-multi-tenancy-default): Which multi-tenancy strategy does the platform follow, within the isolation level that PSDD/DAT-07.1 sets once it is settled? | E2E Architect (pre-sdd-unifier) | §24.5 and §24.7 tenant context on every event and sync edge (§11.2) | Yes | Choose within PSDD/DAT-07.1 once set; update §11.2 and ADR-05 |
| [11.6 Security (Default)](./07-cross-cutting-concerns.md#116-security-default): Which data-protection law applies to customer and member personal data (PSDD/SEC-01.1, open under PSDD/EXC-01 until 2027-12-31)? | Product Owner (fixture owner), per PSDD/EXC-01, with Legal Counsel | None | No: retention, encryption, and classification are locked (PSDD/DAT-06.1, PSDD/SEC-04.1, PSDD/DAT-03.1); chunk 19 asserts no legal rule | None |
| [11.6 Security (Default)](./07-cross-cutting-concerns.md#116-security-default): Which value does the Pre-SDD set for PSDD/SEC-06.1, open in its lock list, which §11.6 designs to? | E2E Architect (pre-sdd-unifier) | None | No: a §11.6 default; chunk 19 references §16 roles without restating §11.6 | None |
| [11.6 Security (Default)](./07-cross-cutting-concerns.md#116-security-default): Which value does the Pre-SDD set for PSDD/SEC-08.1, open in its lock list, which §11.6 designs to? | E2E Architect (pre-sdd-unifier) | None | No: a §11.6 default; chunk 19 references §16 roles without restating §11.6 | None |
| [12. Integrations](./08-integrations.md#12-integrations): Does CardPay Ltd report payout results by calling the platform, or must the platform query each payout's result? | CardPay Ltd | §24.7 sync edges: API-05 inbound callback or an outbound query; §24.8 saga approval to payout ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 8-9, E1) | Yes | CardPay Ltd documents the result mechanism; update API-05 and §17.2 |
| [12. Integrations](./08-integrations.md#12-integrations): Can CardPay Ltd report a dispute of the original card payment and its outcome? | CardPay Ltd | §24.5 event `CardDisputeDecided` and §24.7 edge API-06 exist only if CardPay Ltd reports disputes | Yes | CardPay Ltd confirms; update API-06, §17.2, §14.10 |
| [12. Integrations](./08-integrations.md#12-integrations): Through which channel is the branch manager told that a payout still fails after one day ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1): email through MsgHub, a notice in the branch area of the portal, or another channel? | Refunds and Loyalty Product Owner | §24.7 sync edge API-07 for the branch manager message, or a portal notice with no provider edge | Yes | Product owner names the channel; update §12 INT-02 and §17.3 |
| [12. Integrations](./08-integrations.md#12-integrations): How does Point-of-Sale Records deliver member purchases to Loyalty Points: by calling the platform, by the platform querying it, or by a daily file? | Retail IT team | §24.7 edge API-08: inbound call, outbound query, or a file | Yes | Retail IT team documents the feed; update API-08 |
| [14.10 In-Process Domain Events (modular monolith / hybrid core)](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core): The DTO field types, required flags, and any further fields of the eleven in-process events beyond the identifiers, amounts, references, and timestamps listed. The BRDs' use cases imply the state changes but do not commit to a payload structure. | Software Architect | None | No: field types and required flags change no event or edge; the names, publishers, and listeners are fixed in §14.10 | None |
| [16.6 Grant / Invitation Authority (who can create whom)](./12-centralized-user-roles.md#166-grant--invitation-authority-who-can-create-whom): Who in the business approves giving a staff member the branch manager or payout staff role, and who removes it? | Refunds and Loyalty Product Owner | None | No: grant authority is §16.6; chunk 19 asserts the roles, not who grants them | None |
| [Business Logic](./13a-service-refund-request.md#business-logic): Which items or item types can never be refunded under store refund policy v3? | Refunds and Loyalty Product Owner | None | No: a refund rule inside refund-request; no edge or claim | None |
| [Business Logic](./13a-service-refund-request.md#business-logic): Is day 30 after the purchase inside the refund window, and is the window checked when the customer enters the receipt or when they submit? | Refunds and Loyalty Product Owner | None | No: a refund rule inside refund-request; no edge or claim | None |
| [Business Logic](./13a-service-refund-request.md#business-logic): How is an item's refund amount worked out when the receipt carries a discount on the whole receipt or on a group of items? | Refunds and Loyalty Product Owner | None | No: a refund rule inside refund-request; no edge or claim | None |
| [Business Logic](./13a-service-refund-request.md#business-logic): Must the customer give both an email address and a mobile number, or is one of them enough? | Refunds and Loyalty Product Owner | None | No: a validation rule; the message edge API-07 exists either way | None |
| [Business Logic](./13a-service-refund-request.md#business-logic): Within how many days must a branch manager decide on a Submitted request? | Refunds and Loyalty Product Owner | None | No: the late mark on a list; no saga timing | None |
| [Business Logic](./13a-service-refund-request.md#business-logic): How does the platform know that a branch manager is the customer of a refund request: are staff and customer identities linked in the identity provider, or matched on contact details? | Refunds and Loyalty Product Owner | None | No: an identity check inside refund-request; the identity provider is operational infrastructure, so no edge is added | None |
| [Business Logic](./13a-service-refund-request.md#business-logic): Above which refund amount, if any, must a second person also approve a refund? | Refunds and Loyalty Product Owner | §24.1 and §16 roles (a second approver role would be added) and the approval saga (a second approval step) | Yes | Product owner answers [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-7: second approval; update §16 and §17.1 |
| [Business Logic](./13a-service-refund-request.md#business-logic): What period does the daily branch refund report cover, and is it a screen, an export file, or both? | Refunds and Loyalty Product Owner | None | No: report content and format; no edge or claim | None |
| [List of APIs (Swagger-friendly)](./13a-service-refund-request.md#list-of-apis-swagger-friendly): Request and response fields for the endpoints of this List of APIs beyond the identifiers, statuses, and amounts named in Business Logic. The BRD's use cases imply them but do not specify them. | Software Architect | None | No: the endpoints and their owners exist; fields change no edge | None |
| [Business Logic](./13b-service-payout.md#business-logic): When the platform resends a payout with an idempotency key CardPay Ltd has already seen, does CardPay Ltd return the stored result or process the payout again, and for how long does it keep the keys? | CardPay Ltd | None | No: our handling of the call (the key we send), not a provider contract field or an edge | None |
| [Business Logic](./13b-service-payout.md#business-logic): How long does the system keep trying a failed payout before it stops? | Refunds and Loyalty Product Owner | §24.8 saga approval to payout ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 8-9, E1): when the payout stops for a manual result | Yes | Product owner states the retry duration; update §17.2 and §12 INT-01 |
| [Business Logic](./13b-service-payout.md#business-logic): How is a customer paid when the payout to their original card can never succeed, for example because the card is closed? | Refunds and Loyalty Product Owner | §24.8 saga approval to payout ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 8-9, E1): the outcome of a payout that never succeeds | Yes | Product owner states the rule; update §17.2 |
| [Business Logic](./13b-service-payout.md#business-logic): When the customer's bank refunds a disputed card payment after the refund payout was already paid, how does the business recover the second refund? | Refunds and Loyalty Product Owner | §24.8 saga approval to payout ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) steps 8-9, E1): the outcome of a dispute refunded after the payout succeeded | Yes | Product owner states the recovery rule; update §17.2 |
| [Business Logic](./13b-service-payout.md#business-logic): Which REFUNDS use case covers recording a payout result by hand and its confirmation by a second staff member? | Refunds and Loyalty Product Owner | §24.1 service landscape ownership and entry points: a new use case would get a §7.3 row, an owner, and an entry point | Yes | REFUNDS owner adds or names the use case (BRD follow-up) |
| [Business Logic](./13b-service-payout.md#business-logic): Which report or query of CardPay Ltd lists the refunds it paid, for the monthly check? | CardPay Ltd | §24.7 a sync edge to CardPay Ltd for the monthly check may be added | Yes | CardPay Ltd documents the report; update §17.2 and §15 |
| [Business Logic](./13b-service-payout.md#business-logic): Which REFUNDS use case and which team cover the monthly check that no payout is missing or paid twice (REFUNDS/NFR-01)? | Refunds and Loyalty Product Owner | §24.1 ownership and entry points: a new use case would get a §7.3 row, an owner, and an entry point | Yes | REFUNDS owner adds or names the use case and the team (BRD follow-up) |
| [List of APIs (Swagger-friendly)](./13b-service-payout.md#list-of-apis-swagger-friendly): Request and response fields for the manual-result endpoints beyond the payout, the paid flag, and the staff members named in Business Logic. | Software Architect | None | No: the endpoints and their owners exist; fields change no edge | None |
| [Business Logic](./13c-service-notification.md#business-logic): How many days after the payout does a refund usually show on the customer's card statement? | Refunds and Loyalty Product Owner | None | No: message content; no edge or claim | None |
| [Business Logic](./13c-service-notification.md#business-logic): Which languages do the customer messages use? | Refunds and Loyalty Product Owner | None | No: message content; no edge or claim | None |
| [Business Logic](./13d-service-loyalty-points.md#business-logic): When a purchase amount is not a whole number of euros, is the number of points rounded down, rounded up, or to the nearest whole point? | Loyalty Points owner | None | No: a points calculation inside loyalty-points; no edge | None |
| [Business Logic](./13d-service-loyalty-points.md#business-logic): What is the date from which branch purchases earn points? | Loyalty Points owner | None | No: a points rule inside loyalty-points; no edge | None |
| [Business Logic](./13d-service-loyalty-points.md#business-logic): Which member number does the member's sign-in carry, and is it the same member reference that Point-of-Sale Records sends with each purchase? | Loyalty Points owner, with the Retail IT team | None | No: the identity claim that links two identifiers inside loyalty-points; no edge or role changes | None |
| [Business Logic](./13d-service-loyalty-points.md#business-logic): Which system tells Loyalty Points that a member has left the loyalty program, and how? | Loyalty Points owner | §24.2 system context and §24.7 edges: an inbound source of membership changes may be added | Yes | Loyalty Points owner names the system; update §17.4 and §12 |
| [Retention Policy](./13d-service-loyalty-points.md#retention-policy): How long must the system keep the purchase and refund details behind a points movement? | Loyalty Points owner | None | No: retention inside loyalty-points; no edge | None |
| [List of APIs (Swagger-friendly)](./13d-service-loyalty-points.md#list-of-apis-swagger-friendly): Request and response fields for the member endpoints beyond the balance, dates, references, and points named in Business Logic. | Software Architect | None | No: the endpoints and their owners exist; fields change no edge | None |
| [18.1 Load Estimates](./14-performance-and-capacity.md#181-load-estimates): Which value does the Pre-SDD set for PSDD/CAP-05.1, open in its lock list, that §18.1 projects Years 2 and 3 from? | E2E Architect (pre-sdd-unifier) | None | No: growth sizes §18; chunk 19 asserts no load | None |
| [18.1 Load Estimates](./14-performance-and-capacity.md#181-load-estimates): Which value does the Pre-SDD set for PSDD/CAP-10.1, open in its lock list, that §18 sizes for? | E2E Architect (pre-sdd-unifier) | None | No: sizing of §18; chunk 19 asserts no load | None |
| [18.2 Throughput Targets (per service)](./14-performance-and-capacity.md#182-throughput-targets-per-service): How does the platform-wide peak of PSDD/CAP-02.1 split between the refund-request and loyalty-points endpoints, and which p50 and p99 targets go with the 2,000 ms targets of PSDD/CAP-07.1 and PSDD/CAP-07.2? | Software Architect | None | No: per-module sizing and percentiles of §18.2; no chunk 19 claim | None |
| [18.4 Stress Testing Strategy](./14-performance-and-capacity.md#184-stress-testing-strategy): Which load-testing tool does the product owner approve? | product owner | None | No: a tool choice; no chunk 19 claim | None |
| [18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets): Does a declared region disaster count toward the REFUNDS/NFR-02 limit of 2 hours of disruption a month and toward the PSDD/REL-01.1 target (PSDD/QD-07)? | Refunds and Loyalty Product Owner | None | No: availability accounting of §18.5; no chunk 19 claim | None |
| [18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets): Technical target for REFUNDS/NFR-07: which refund document the platform produces for a paid refund, and to which fiscal register or accounts system it is recorded. | Refunds and Loyalty Product Owner | §24.2 system context and §24.7 edges: a fiscal register or accounts system may be added | Yes | Product owner answers the REFUNDS/NFR-07 questions; update §18.5, §12, §17.1 |
| [18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets): Technical target for LOYALTY/NFR-03: by when must points earned on a purchase show in the member's balance and history? | Loyalty Points owner | None | No: the earning time inside loyalty-points; the earning path is one module, not a saga | None |
| [19. Environments](./15-environments.md#19-environments): Which domain and host names does the platform use per environment? | Refunds and Loyalty Product Owner | None | No: §19 DNS; no chunk 19 claim | None |
| [20. Operations Runbook](./16-operations-runbook.md#20-operations-runbook): Which value does the Pre-SDD set for PSDD/REL-07.1, open in its lock list, which the failover procedures of §20 follow? | E2E Architect (pre-sdd-unifier) | None | No: the failover procedure of §20; no chunk 19 claim | None |
| [20. Operations Runbook](./16-operations-runbook.md#20-operations-runbook): Which value does the Pre-SDD set for PSDD/OPS-06.1, open in its lock list, which §20 follows? | E2E Architect (pre-sdd-unifier) | None | No: §20; no chunk 19 claim | None |
| [20.3 On-Call](./16-operations-runbook.md#203-on-call): Which team runs on-call for the platform, and on which rotation? | Refunds and Loyalty Product Owner | None | No: §20.3; no chunk 19 claim | None |

---

## Document Metadata & History

| Section | Chunk |
|---------|-------|
| Title block, Version, Author, Reviewers, Approvers, Status | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Document Lineage (source BRDs with keys, source Pre-SDD, child LLDs) | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
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
| 6. Ecosystem Overview (full tech stack table, incl. Architecture Doctrine: EDA + DDD + Hexagonal defaults) | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |
| Ecosystem-level rules | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |
| Integration landscape (each external system: owner, role, interface style, spec source; linked to §12) | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Integration planning |

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
| 8.6 Infrastructure Architecture (deployment topology, data stores, backup and disaster recovery, scaling) | [05a-infrastructure-and-network.md](./05a-infrastructure-and-network.md) |
| 8.7 Network Architecture (zones, ingress, egress, TLS and mTLS, ports and protocols) | [05a-infrastructure-and-network.md](./05a-infrastructure-and-network.md) |

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
| 17.1 Refund Request - Detailed Spec | [13a-service-refund-request.md](./13a-service-refund-request.md) |
| 17.2 Payout - Detailed Spec | [13b-service-payout.md](./13b-service-payout.md) |
| 17.3 Notification - Detailed Spec | [13c-service-notification.md](./13c-service-notification.md) |
| 17.4 Loyalty Points - Detailed Spec | [13d-service-loyalty-points.md](./13d-service-loyalty-points.md) |

> **Contract consistency:** chunk 10 (event hub) is the platform event contract registry - event names and DTOs in every `13x` chunk must match it verbatim; chunk 11 is the same for synchronous API contracts (external ones stay `TBD - external` until the user supplies them); chunk 12 is the same for roles and permission tokens. Divergences are flagged in the registries' consistency/drift sections, never silently reconciled.

### Service Spec Sub-Sections (within each 13x chunk)

| Sub-Section | Description |
|-------------|-------------|
| What | Service definition & bounded context |
| Boundaries | Owns / does not own / upstream / downstream |
| Input | Inbound triggers (REST, events, schedules) |
| Business Logic | Core logic + state machines |
| Output | Outbound responses and events |
| Integrations | Per-service integration details, each with its API ID (chunk 11) or event (chunk 10) |
| DB Modeling | ERD, tables, retention, archival, encryption |
| Multi-Tenancy Specifications | Overrides to platform defaults |
| API Standards | Style, versioning, auth, idempotency, API list (integration endpoints carry their API ID and link to chunk 11) |
| Event-Driven Architecture | Published + consumed events (must match chunk 10), messaging infra, DLQ |
| Constraints | Service-specific constraints |
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
| 18.5 NFR Targets (each BRD NFR: technical target, where realised; a recovery NFR's RPO and RTO: §8.6.4) | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| 19. Environments (dev, test, stage, prod, dr) | [15-environments.md](./15-environments.md) |
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

> Generated *after* the main SDD body by a cleared-context reviewer. Every item carries a **Recommended Answer** with the **Why** behind it, ready to apply; the acceptance loop decides each item (an answer policy the user set for the run accepts the recommendations it may), then the accepted answers are reflected into the body and logged in the Resolution Log.

## End-to-End View (gated)

| Section | Chunk |
|---------|-------|
| 24. End-to-End System Design (services · topics · producers · consumers) | 19-e2e-system-design.md - [Locked until chunk 18 is cleared] |

> Chunk 19 is written last only when E1-E4 are met: no open/deferred OI or divergence; no unresolved value required by an E2E claim after following source references, regardless of marker location; final relevant sources reconciled with ordered evidence. Use the E3 inventory above and the external black-box exception. It consolidates chunks 02-13x, citing context/layers and adding fan-out/saga views. Link it once written; keep an already-current body after verifying its sources/gate.

## Architecture Deck Brief (gated, on request)

| Section | Chunk |
|---------|-------|
| Architecture deck brief (system design, infrastructure, network, and integration slides for a deck-generating agent; not an SDD section) | 20-for-ppt.md - [plain text until it exists; written only on request, once the e2e gate reads Open - Up to date] |

> Chunk 20 is derived from chunks 00-19 and the E3 marker inventory above, and adds no requirement or design. It is written only on request, when the e2e gate reads `Open - Up to date` and chunk 19 exists (no override). It is never part of the merged or combined SDD, not an input to lld-unifier, outside the E3 body and the E4 hash, and never written in a light run. Its state is the **Deck brief (chunk 20)** line in Generation Progress, the same as the status line of the chunk. Link it once written.

---

## Chunk Dependency Graph

```
refunds-platform-sdd-master.md (you are here)
|
+-- 00-cover-and-changelog.md ........... metadata, lineage (source BRDs, source Pre-SDD, child LLDs), version history
+-- 01-executive-summary-scope-risks.md . why + what + boundaries + risks + glossary
+-- 02-ecosystem-overview.md ............ tech stack + architecture doctrine (single source of truth)
+-- 03-users-and-use-cases.md ........... actors + use case diagram + use-case traceability (BRD -> SDD)
+-- 04-architecture-style-and-diagrams.md architecture style + context + HLA
+-- 05-workflows-and-sequences.md ....... end-to-end flows + sequence diagrams
+-- 05a-infrastructure-and-network.md ... infrastructure topology + network (where it runs, ingress, egress)
+-- 06-principles-and-decisions.md ...... governance: principles + ADRs
+-- 07-cross-cutting-concerns.md ........ platform defaults (DB, tenancy, deploy, observability, config)
+-- 08-integrations.md .................. external system connections
+-- 09-services-summary.md .............. decomposition overview table
|   +-- 10-events-hub.md ................ in-process domain events (event contract registry)
|   +-- 11-api-contracts.md ............. service integration API contracts (API contract registry)
|   +-- 12-centralized-user-roles.md .... platform-wide roles & authorities catalogue
|   +-- 13a-service-refund-request.md ... refund-request module
|   +-- 13b-service-payout.md ........... payout module
|   +-- 13c-service-notification.md ..... notification module
|   +-- 13d-service-loyalty-points.md ... loyalty-points module
+-- 14-performance-and-capacity.md ...... load, throughput, peaks, stress testing
+-- 15-environments.md .................. dev / test / stage / prod / dr
+-- 16-operations-runbook.md ............ procedures, diagnostics, on-call
+-- 17-appendix-and-wishlist.md ......... references + future platform enhancements
+-- 18-open-items-and-clarifications.md . reviewer findings with recommended answers (post-generation)
+-- 19-e2e-system-design.md ............. end-to-end system map (gated: only after 18 is cleared; consolidates 02-13x)
+-- 20-for-ppt.md ....................... architecture deck brief (derived; only on request, once the e2e gate is open; not merged; not read by lld-unifier)
```

### Reading Order by Task

| Agent Task | Start With | Then |
|------------|-----------|------|
| Understand the system | 19 (e2e, once written) | 01, 04, 02 |
| Design a new module | 07, 02 | 10 (event contracts), 11 (API contracts), 13a (copy as template), 09 |
| Review architecture | 04, 06 | 05, 05a, 07, 19 |
| Plan the infrastructure or the network (deployment, disaster recovery, ingress, egress) | 05a | 02 (ecosystem), 07 (deployment and security defaults), 08 (integrations), 15 (environments) |
| Add an integration | 08 | 11 (API contract), 05a §8.7 (egress path), 13a (service integrations sub-section) |
| Define DB schema | 07 (defaults) | 13a (DB Modeling sub-section) |
| Add / change an event | 10 (registry first) | the producing + consuming 13x chunks, then 18 |
| Define roles / permissions | 12 | 03, 11, the affected 13x chunks |
| Plan capacity / NFRs | 14 | 15, 01 (risks) |
| Write runbook procedures | 16 | 02 (ecosystem), 05a (topology, backup and disaster recovery), 07 (observability) |
| Audit completeness | 00 (ToC) | all chunks sequentially |
| Check cross-cutting standards | 07 | 06 (principles), 02 (ecosystem) |
| Check contract consistency | 10 §14.8, 11 §15.5, 12 §16.12 | every 13x Event Model and List of APIs |
| Complete an external API contract | 11 §15.6 | the provider documentation, then 11 §15.3 |
| Map BRD use cases to services | 03 §7.3 (use-case traceability) | 09, then the owner's 13x chunk; each UC ID links to the use case in the BRD |
| Check a locked Pre-SDD value | 00 § Document Lineage (Source Pre-SDD) | the `PSDD/<ID>` link in the citing chunk |
| Feed speckit `/constitution` | ../lld-[lld-slug]/17-specs.md (LLD-owned, one per child LLD) | 02, 09 |
| Steer `lld-unifier` (tech choices, contracts) | 02, 10, 11 | 09, 12, 05a (deployment topology); 00 § Document Lineage (Child LLDs) |
| Find the LLD for a use case | 03 §7.3 (owner service) | 00 § Document Lineage, the Child LLDs row whose scope names that service |
| Triage reviewer findings | 18 | the chunk(s) referenced by each open item |
| Present the architecture (deck brief) | 20 (exists only once requested and the e2e gate is open) | 04, 05a, 08, 10, 11, 19 |

### Cross-Document Navigation (BRD <-> SDD)

| BRD Chunk | Related SDD Chunk(s) | Relationship |
|-----------|---------------------|--------------|
| [REFUNDS 01 - Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [REFUNDS 04 - Scope & Personas](../brd-refunds-portal/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | BRD personas become SDD actors |
| [REFUNDS 05 - User Journeys Overview](../brd-refunds-portal/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner module in 09 |
| [REFUNDS 06a - Use Cases: Customer](../brd-refunds-portal/06a-use-cases-customer.md) | [sdd/03 §7.3](./03-users-and-use-cases.md), [13a](./13a-service-refund-request.md) | UC flows become module business logic and error handling |
| [REFUNDS 06b - Use Cases: Branch Manager](../brd-refunds-portal/06b-use-cases-branch-manager.md) | [sdd/03 §7.3](./03-users-and-use-cases.md), [13a](./13a-service-refund-request.md), [13b](./13b-service-payout.md) | UC flows become module business logic and error handling |
| [REFUNDS 07 - Users & Use Cases Matrix](../brd-refunds-portal/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-module authorization rules |
| [REFUNDS 08 - Integrations](../brd-refunds-portal/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md), [sdd/05a §8.7 - Network](./05a-infrastructure-and-network.md#87-network-architecture) | BRD names partners and purpose; SDD details protocol, auth, retries, the API contracts, and the egress paths |
| [REFUNDS 10 - NFRs](../brd-refunds-portal/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md), [sdd/05a §8.6 - Infrastructure](./05a-infrastructure-and-network.md#86-infrastructure-architecture) | Business expectations are quantified into technical targets, on the Pre-SDD's locked values |
| [REFUNDS 12 - Appendix (Technical Inputs for the SDD)](../brd-refunds-portal/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | [REFUNDS 12 TI-01](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) and [REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) lock the backend runtime and the database |
| [LOYALTY 01 - Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [LOYALTY 04 - Scope & Personas](../brd-loyalty-points/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | The Member persona becomes an actor |
| [LOYALTY 05 - User Journeys Overview](../brd-loyalty-points/05-user-journeys-overview.md) | [sdd/03 §7.3](./03-users-and-use-cases.md), [sdd/09](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner module |
| [LOYALTY 06a - Use Cases: Member](../brd-loyalty-points/06a-use-cases-member.md) | [sdd/03 §7.3](./03-users-and-use-cases.md), [13d](./13d-service-loyalty-points.md) | UC flows become module business logic and error handling |
| [LOYALTY 07 - Users & Use Cases Matrix](../brd-loyalty-points/07-users-use-cases-matrix.md) | [sdd/12](./12-centralized-user-roles.md) | Matrix drives the role catalogue |
| [LOYALTY 08 - Integrations](../brd-loyalty-points/08-integrations.md) | [sdd/08](./08-integrations.md), [sdd/11](./11-api-contracts.md) | POS Records shares the INT-03 row; Refunds Portal outcomes are in-process events |
| [LOYALTY 10 - NFRs](../brd-loyalty-points/10-nfrs.md) | [sdd/14](./14-performance-and-capacity.md) | Business expectations are quantified into technical targets |
