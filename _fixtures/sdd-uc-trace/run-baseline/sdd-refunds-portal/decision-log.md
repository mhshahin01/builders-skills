<!--
TYPE: Decision Log
PROJECT: Refunds Portal
VERSION: 1.0
PART OF: SDD - Refunds Portal
PURPOSE: Single home for the architecture questionnaire record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - Refunds Portal

## How to read

The numbered chunks hold the current settled design; the ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how those decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.

## Architecture questionnaire record

**Outcome, 2026-09-28:** Walked through. The walkthrough was the recommended path because one driver, the team count (Q2), is missing from the BRD. Every question was answered with its recommended option under the delegation recorded below; no interactive answer was given. Style: modular monolith; followed the recommendation.

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| Q1 Release stage | First production release of a product that will grow (Recommended) / MVP or proof of concept / Platform at scale | First production release | BRD 01 objectives are production outcomes; BRD 12 Wishlist item 1 signals growth; no pilot or MVP wording | [§8.1.2 Why](./04-architecture-style-and-diagrams.md#812-why) |
| Q2 Teams in the next 12 months | One team (Recommended) / Two or three teams / Four or more teams | One team | Missing from the BRD; the scope (BRD 04 personas, BRD 05 use cases, BRD 08 integrations) fits one team | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q3 Load and availability | Moderate with peaks (Recommended) / Modest / High and uneven | Moderate with peaks | BRD 02 Facts 1 and 2; NFR-02 (use at any time); NFR-03 (seasonal peaks) | [§8.1.2 Why](./04-architecture-style-and-diagrams.md#812-why) |
| Q4 Architecture style | Modular monolith (Recommended) / Hybrid / Microservices | Modular monolith | Q1 to Q3 match the first-production-release profile; no module has a distinct scaling, failure, or release need | [ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q5 Communication | In-process ports, with domain events and an outbox for anything that leaves the process (Recommended) / Event-driven backbone with a broker plus REST for queries / Mostly synchronous REST | In-process ports with a transactional outbox | Q4; NFR-01; the BRD 08 integrations are provider calls, not consumers of platform events | [ADR-02](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q6 Data ownership | One database, one schema per module (Recommended) / One database per service / One database per service with a reporting store | One database, one schema per module | Q4; TI-02; BRD 09 has one report, served by its owning module | [ADR-03](./06-principles-and-decisions.md#10-architectural-decisions) |
| Q7 Multi-tenancy | Shared schema with `tenant_id` (Recommended) / Schema per tenant / Database per tenant / Single tenant | Shared schema with `tenant_id` | Platform rule (shared schema for low-volume contexts); BRD 02 Facts 1; one retailer at launch | [ADR-04](./06-principles-and-decisions.md#10-architectural-decisions), [§11.2](./07-cross-cutting-concerns.md#112-multi-tenancy-default) |
| Q8 Deployment target | Kubernetes with one Helm chart per deployable (Recommended) / Managed container service / Simple container or VM setup | Kubernetes, one Helm chart | Platform deployment default; NFR-02; hosting not stated in the BRD (R-08) | [ADR-09](./06-principles-and-decisions.md#10-architectural-decisions) |

## Walkthrough and delegation history

**Delegation, 2026-09-28:** The run was requested as non-interactive. Wherever the skill asks the user (intake, Project Type, architecture questionnaire, ecosystem selection, service decomposition confirmation), the skill's recommended or default answer is taken. The request supplied the project name (Refunds Portal), the Project Type (Greenfield), the output mode (chunks), and the generation option (whole). Under this delegation the architecture questionnaire took every recommended option, and the ecosystem selection took "Accept all", with no row overridden.

### Action entries

**Derivation run, 2026-09-28:** Read the BRD chunks 00 to 13 (`14-todo.md` skipped as a working artefact). Wrote chunks 01 to 09, then 13a, 13b, and 13c, then 10, 12, and 11, in that order; then ran the contract reconciliation (step 6a) with no drift between chunks 10, 11, 12 and 13a to 13c; then wrote chunk 00 and the master index. While writing the payouts spec, the CardPay status query was given its own contract (API-06) instead of being folded into API-03; chunks 01, 03, 04, 06, 08, and 09 were updated to match, and the glossary was back-filled with the terms of chunks 10 to 13c. The run ends at step 6a: chunks 14 to 18 are pending, chunk 19 is locked, and the reviewer pass (step 7) and the open-items acceptance loop (step 8) have not run.

<!-- MASTER: refunds-portal-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
