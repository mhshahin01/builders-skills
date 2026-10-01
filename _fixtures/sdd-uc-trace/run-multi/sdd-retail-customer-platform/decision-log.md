<!--
TYPE: Decision Log
PROJECT: Retail Customer Platform
VERSION: 1.0
PART OF: SDD - Retail Customer Platform
PURPOSE: Single home for the ecosystem selection record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Retail Customer Platform

## How to read

The numbered chunks (00-09 so far) hold the current settled design; the ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how those decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-09-28:** Walked through, the recommended mode because a driver has no evidence in either BRD (Q2, delivery teams) and the hosting part of Q8 is also unstated. Every question was answered with its recommended option: this run applies the recommended answers by default, with no user input. Style: modular monolith; followed the recommendation.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release of a product that will grow (Recommended) / MVP or proof of concept / Platform at scale | First production release | REFUNDS 01 and LOYALTY 01 business objectives; both wishlists (REFUNDS 12, LOYALTY 12) name follow-on scope; both BRDs Approved, with no pilot or phase wording | [8.1.2 Why](./04-architecture-style-and-diagrams.md#812-why) |
| Q2 Delivery teams | One team (Recommended) / Two or three teams / Four or more teams with separate release cycles | One team | Neither BRD names a delivery team; REFUNDS 00 and LOYALTY 00 name two business owners (Head of Retail, Head of Marketing), kept as an extraction trigger | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | REFUNDS 02 Facts 1-2, REFUNDS/NFR-02, REFUNDS/NFR-03; LOYALTY 01 Background; LOYALTY/NFR-01. The two BRDs set different disruption budgets; flagged in §8.1.2 | [8.1.2 Why](./04-architecture-style-and-diagrams.md#812-why) |
| Q4 Architecture style | Modular monolith (Recommended) / Hybrid / Microservices | Modular monolith | Q1-Q3; small use-case set; no part with a clearly different scaling, failure, or release need yet | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process calls through module ports, with domain events and an outbox for anything that leaves the process (Recommended) / Event-driven backbone with a broker plus REST for queries / Mostly synchronous REST | In-process ports with domain events and an outbox | Q4; integrations REFUNDS 08 and LOYALTY 08 (all outbound or feed); REFUNDS/NFR-01 and LOYALTY/NFR-02 need no lost or duplicated effects | [ADR-06](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One database, one schema per module (Recommended) / One database per service / One database per service plus a reporting store | One database, one schema per module | Q4; light reporting (REFUNDS 09 daily report, LOYALTY 09 monthly report); the engine itself is settled in the ecosystem selection because REFUNDS/TI-02 and LOYALTY/TI-01 conflict | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy | Shared schema with tenant_id (Recommended) / Schema per tenant / Database per tenant / Single tenant | Shared schema with tenant_id | Platform rule (CLAUDE.md) for low-volume services; REFUNDS 02 Facts 1; one retailer in both BRDs | [ADR-04](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q8 Deployment target | Kubernetes with one Helm chart per deployable (Recommended) / Managed container service / A simple container or VM setup | Kubernetes with one Helm chart | Platform deployment-unit default (CLAUDE.md); both BRDs silent on hosting, so on-premises or cloud stays open in §6 | [6 Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview) |

## Ecosystem selection record

**Outcome, 2026-09-28:** Accept all, after one conflict question asked before it: the Primary RDBMS row was not locked because the source BRDs mandate different data stores (REFUNDS/TI-02 "Use PostgreSQL for all data." and LOYALTY/TI-01 "Loyalty data must be stored in MongoDB."). The conflict question and the accept-all question were answered with their recommended options by default, with no user input. No other row was walked through or overridden.

| Layer | Offered (recommended first) | Chosen | Source | Rule home |
|-------|-----------------------------|--------|--------|-----------|
| Primary RDBMS / data store | PostgreSQL 17+ for all data, one schema per module (Recommended) / PostgreSQL 17+ for refunds data and MongoDB for loyalty data / MongoDB for all data | PostgreSQL 17+ for all data | BRD-mandated REFUNDS/TI-02 and platform default; LOYALTY/TI-01 not applied | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |

## Clarification register

No clarification or open item has been decided yet. Open items are raised by the independent review in part 3.

## Walkthrough and delegation history

This run is non-interactive. Its instructions delegate every question the skill would ask to the skill's recommended or default answer: intake, Project Type, BRD keys, the architecture questionnaire, the ecosystem selection (including the cross-BRD data-store conflict), and the service decomposition confirmation.

### Action entries

**Intake and part 1, 2026-09-28:** Answers given in the request: project name Retail Customer Platform; both BRDs describe one system (one SDD with two parents); Project Type Greenfield; output mode chunks; generation `parts` (the default). BRD keys proposed and fixed by default: REFUNDS (Refunds Portal v1.0) and LOYALTY (Loyalty Points v1.2). The service decomposition maps every active use case of both BRDs to one owner module, so no confirmation question was needed; it is presented for review at the part 1 checkpoint. Chunks 00-09, the master index, and this register were written. Cross-BRD conflicts: data-store mandates (ADR-03), "Payout" defined differently in the two glossaries (flagged in §5), different availability budgets (flagged in §8.1.2), the source of refund facts for taking points back (flagged in §8.4.3); shared partners MsgHub and the Point-of-Sale Records have one §12 row each, and the Customer persona of both BRDs is one actor (§7.1). Part 2 is pending the user's go-ahead.

**Targeted update, 2026-09-28:** Requested in this session: the Loyalty Manager description in §7.1 now states that adjustments above 5,000 points need a second loyalty manager's approval. The number restates [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-manager.md#uc-03-adjust-a-customers-points) BR-2, which stays its home; if the BRD changes the threshold, §7.1 changes with it. The Child LLDs check found the sibling Refunds Core LLD (v0.1, from-sdd, scope refunds and card-payouts), whose Related SDD line links to this SDD's master, and added its row to 00 § Document Lineage; both scope modules are §13 rows. The part 1 exit checklist was rerun and passes. The version is unchanged during the first build. Part 2 is still pending.

<!-- MASTER: retail-customer-platform-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
