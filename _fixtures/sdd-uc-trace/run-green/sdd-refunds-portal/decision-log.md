<!--
TYPE: Decision Log
PROJECT: Refunds Portal
VERSION: 1.0
PART OF: SDD - Refunds Portal
PURPOSE: Single home for the ecosystem selection record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Refunds Portal

## How to read

The numbered content chunks hold the current settled design; the ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how the decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-09-28:** Walked through. The opening question recommended the walkthrough because one driver (Q2, teams) is not stated in the BRD. Every question was answered with its recommended option under the run's delegation (see Walkthrough and delegation history); no answer was confirmed by the user. Style: modular monolith; followed the recommendation.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release of a product that will grow (Recommended) / MVP or proof of concept / Platform at scale | First production release of a product that will grow | BRD 01 Business Objectives (the portal replaces the paper process in every branch); BRD 12 Wishlist (online-shop refunds later); Future Enhancements of [UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) and [UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | [§8.1.2 Why](./04-architecture-style-and-diagrams.md#812-why) |
| Q2 Teams in the next 12 months | One team (Recommended) / Two or three teams / Four or more teams with separate release cycles | One team | Not stated in the BRD; inferred from the scope: four active use cases, two personas, three integrations (BRD 05, 07, 08) | [§8.1.2 Why](./04-architecture-style-and-diagrams.md#812-why) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | BRD 02 Facts 1-2 (monthly volume, seasonal triple); NFR-02 (use at any time, bounded monthly disruption); NFR-03 (seasonal peak with no noticeable slowdown) | [§8.1.2 Why](./04-architecture-style-and-diagrams.md#812-why) |
| Q4 Architecture style | Modular monolith (Recommended) / Hybrid / Microservices | Modular monolith | Q1-Q3; small, stable bounded contexts (BRD 03); no part has a scaling, failure, or release need that differs from the refund core | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process calls through module ports, with domain events and an outbox for anything that leaves the process (Recommended) / Event-driven backbone plus synchronous REST for queries / Mostly synchronous REST | In-process ports, domain events, and an outbox | Q4; NFR-01 (money never lost or paid twice); BRD 08 (payouts and messages leave the process) | [ADR-05](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One database, one schema per module, no cross-module joins (Recommended) / One database per service / One database per service with a reporting store | One database, one schema per module | Q4; BRD 12 TI-02; BRD 09 (one daily branch report, no reporting store needed) | [ADR-06](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy model | Shared schema with `tenant_id` (Recommended) / Single tenant / Schema per tenant | Shared schema with `tenant_id` | Platform rule for low-volume modules (CLAUDE.md); BRD 01 and 02 describe one retailer, so go-live has one tenant | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q8 Deployment target | Kubernetes with one Helm chart per deployable (Recommended) / Managed container service / Simple container or VM setup | Kubernetes with one Helm chart | CLAUDE.md deployment default; Q1 (production release); BRD 12 Technical Inputs silent on hosting | [ADR-09](./06-principles-and-decisions.md#10-architectural-decisions) |

## Walkthrough and delegation history

**Delegation, 2026-09-28:** The run settings delegated every question the skill asks to its recommended or default answer, with no user input. Output mode `chunks` and generation option `whole` were given. The project name (Refunds Portal) and the Project Type (Greenfield) were given. The architecture questionnaire took the recommended walkthrough and the recommended option for Q1-Q8 (record above). The ecosystem selection took the recommended Accept all with no row overridden, so no ecosystem selection record is written; each §6 row carries its source label. The service decomposition was not put to the user: every active BRD use case maps to one owner module without ambiguity.

### Action entries

**Derivation run, 2026-09-28:** Chunks 00-09, 13a-13c, 10, 12, and 11 written from BRD v1.0; §7.3 filled in one pass; contract consistency reconciliation (step 6a) run with no divergence left open. Chunks 14-18 are not written and chunk 19 is locked: the run stopped after step 6a by its settings, so the reviewer pass (step 7) and the open-items acceptance loop (step 8) have not run.

<!-- MASTER: refunds-portal-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
