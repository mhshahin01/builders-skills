<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: SDD - Refunds Platform
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: All chunks share the SDD version number. When any chunk is updated, bump the SDD version in this master and in the updated chunk(s).
MAINTENANCE: When adding or removing chunks (especially 13x service chunks), update the tables below, the dependency graph, and the reading-order table.
-->

# SDD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Solution Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Lineage:** this SDD's source BRDs (parents, each with its key) and child LLDs are listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference in the chunks carries its BRD key (`REFUNDS/UC-04`, `LOYALTY/UC-02`).

> **Specs note:** The constitution-grade `Specs` chunk (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with each child LLD (`../lld-[lld-slug]/17-specs.md`), synthesised from this SDD's body. The SDD carries no Specs chunk.

> **Decision history:** [decision-log.md](./decision-log.md) holds the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, and how each decision was reached. The chunks below state only the settled design.

---

## Generation Progress

**Generation:** whole
**Intent:** derive-from-BRD
**Source:** ../brd-refunds-portal/refunds-portal-brd-master.md, ../brd-loyalty-points/loyalty-points-brd-master.md

**Reconciled:** 2026-10-07, SDD v1.1; final content edits -> delta disk review -> step 6a, including the first legacy 13x data-model sweep (four models, unresolved gaps flagged) -> E3 inventory. Checked in Codex.
**E2E gate (chunk 19):** Locked - E3: required owner values remain; E1, E2 and E4 are met. See E3 marker inventory.
**E2E basis:** Not written; no chunk 19 exists. Legacy Reconciled 2026-09-30 is not current gate evidence.


### E3 marker inventory

All live body markers are classified by their claim dependency, including repeated questions per source file. Provider placeholders in API-01 to API-04 stay black boxes; no provider-defined fields are asserted.

| Marker source | Named owner | Dependent claim / reference path | Blocks E3 | Next owner action |
|---|---|---|---|---|
| [00-cover-and-changelog.md](./00-cover-and-changelog.md): architecture reviewers | Solution Architecture Team | Document review/approval and downstream registration; no runtime E2E claim depends on the answer | No: governance metadata is outside the system consolidation | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [00-cover-and-changelog.md](./00-cover-and-changelog.md): approvers | Solution Architecture Team | Document review/approval and downstream registration; no runtime E2E claim depends on the answer | No: governance metadata is outside the system consolidation | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md): does "Mobile" in the title of [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) mean the web app on phones (REFUNDS 11 says the customer screens work on phones and computers) or a native app, which the [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) future enhancement "push notifications in the mobile app" implies? | REFUNDS BRD owner | E2E client topology -> section 1 scope -> web versus native mobile application | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md): mitigation strategy for R-01 | Solution Architecture Team | Risk register administration and rollout mitigation; no runtime value is asserted | No: risk ownership and rollout planning do not determine topology or saga behavior | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [01-executive-summary-scope-risks.md](./01-executive-summary-scope-risks.md): risk owner | Solution Architecture Team | Risk register administration and rollout mitigation; no runtime value is asserted | No: risk ownership and rollout planning do not determine topology or saga behavior | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): Kubernetes distribution, version, and cluster topology | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): version | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): ingress controller product and version | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): HA topology, replicas, and backup policy | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): Kafka version, schema registry product, and topic retention period | Security and Data Protection owners | E2E compliance -> ADR-10 -> section 14.9 erasure paths -> topic and DLQ retention | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): secrets manager product + version + topology | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): CI/CD platform + version | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): aggregator product + version + retention | Security and Data Protection owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): collector version, tracing backend, sampling rate | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [02-ecosystem-overview.md](./02-ecosystem-overview.md): primary brand colour | Platform and SRE owners | Ecosystem implementation pin or platform sizing; system component names remain known | No: consolidation uses the selected component role and does not assert an unresolved product pin or size | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [06-principles-and-decisions.md](./06-principles-and-decisions.md): confirm REST as the API style for every service; the architecture questionnaire and the ecosystem selection leave the API style open. | Solution Architecture Team | E2E accepted doctrine -> ADR-04 REST style or ADR-08 service-local authorization | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [06-principles-and-decisions.md](./06-principles-and-decisions.md): confirm service-local permission checks over a central policy engine; the architecture questionnaire and the ecosystem selection leave the enforcement approach open. | IAM and Security owners | E2E accepted doctrine -> ADR-04 REST style or ADR-08 service-local authorization | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md): CPU and memory requests and limits, and HPA minimum and maximum replicas per deployable. | Platform and SRE owners | Platform deployment or operational procedure; no quantitative runtime guarantee is asserted | No: the E2E design need not assert sizing, tool names, rotation cadence or certificate procedures | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md): certificate issuance and renewal on the on-prem platform. | Platform and SRE owners | Platform deployment or operational procedure; no quantitative runtime guarantee is asserted | No: the E2E design need not assert sizing, tool names, rotation cadence or certificate procedures | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md): encryption mechanism and key management on the on-prem platform. | Security and Platform owners | E2E security -> section 11.6 -> encryption at rest and key custody | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md): rotation cadence per secret. | Platform and SRE owners | Platform deployment or operational procedure; no quantitative runtime guarantee is asserted | No: the E2E design need not assert sizing, tool names, rotation cadence or certificate procedures | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md): scanning tool and severity thresholds. | Platform and SRE owners | Platform deployment or operational procedure; no quantitative runtime guarantee is asserted | No: the E2E design need not assert sizing, tool names, rotation cadence or certificate procedures | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [07-cross-cutting-concerns.md](./07-cross-cutting-concerns.md): scanning tool. | Platform and SRE owners | Platform deployment or operational procedure; no quantitative runtime guarantee is asserted | No: the E2E design need not assert sizing, tool names, rotation cadence or certificate procedures | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [08-integrations.md](./08-integrations.md): timeout per payout call | Solution Architecture Team with the relevant provider owner | E2E saga failure path -> section 12 integration -> timeout, retries or terminal message outcome | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [08-integrations.md](./08-integrations.md): first and maximum retry delay | Solution Architecture Team with the relevant provider owner | E2E saga failure path -> section 12 integration -> timeout, retries or terminal message outcome | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [08-integrations.md](./08-integrations.md): timeout per message call | Solution Architecture Team with the relevant provider owner | E2E saga failure path -> section 12 integration -> timeout, retries or terminal message outcome | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [08-integrations.md](./08-integrations.md): attempt limit per message | Solution Architecture Team with the relevant provider owner | E2E saga failure path -> section 12 integration -> timeout, retries or terminal message outcome | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [08-integrations.md](./08-integrations.md): timeout for the receipt lookup and for the purchase import call | Solution Architecture Team with the relevant provider owner | E2E saga failure path -> section 12 integration -> timeout, retries or terminal message outcome | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [08-integrations.md](./08-integrations.md): retry attempts for the receipt lookup | Solution Architecture Team with the relevant provider owner | E2E saga failure path -> section 12 integration -> timeout, retries or terminal message outcome | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [10-events-hub.md](./10-events-hub.md): ratify the candidate payload contracts below; they are derived from the use-case steps and from what each consumer needs, and the architect has not yet confirmed them. | Solution Architecture Team | E2E event edges -> section 14.9 candidate payloads -> ratification of producer/consumer agreement | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [12-centralized-user-roles.md](./12-centralized-user-roles.md): who creates branch manager accounts and assigns their branch; no BRD use case covers staff provisioning | REFUNDS BRD owner and IAM owner | E2E roles -> section 16.6 -> branch-manager grant authority | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13a-service-refund.md](./13a-service-refund.md): must the branch manager also be told by email or SMS when a payout still fails after one day ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1)? The Notification Partner row of REFUNDS 08 covers customer messages only, so the design tells the branch manager in the portal. | IAM and Security owners | E2E saga and security -> 13a-service-refund.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13a-service-refund.md](./13a-service-refund.md): the full column list, remaining constraints, and secondary indexes of the `refund` schema; the BRD describes the concepts, not a relational schema. | Solution Architecture Team and service owner | DDL columns and client-facing response fields are outside the E2E edge inventory; tenant-key conflicts are separately inventoried | No: no internal synchronous contract or consolidation count requires the full client schema or secondary-index list | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13a-service-refund.md](./13a-service-refund.md): Solution Architecture Team and refund-service owner must reconcile the missing inbox entity, tenant-leading primary and foreign keys, and every ERD key with Tables Design. Complete nullability, constraints and index coverage before generating DDL; the legacy ERD and table summaries are not a complete schema. | Solution Architecture Team, service owner and Data Protection owner | E2E tenant-isolation and retention doctrine -> DB Modeling -> unresolved key and lifecycle consistency | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13a-service-refund.md](./13a-service-refund.md): retention period for refund records and customer contact details; refunds are financial records and may carry a statutory retention period. | Security and Data Protection owners | E2E saga and security -> 13a-service-refund.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13a-service-refund.md](./13a-service-refund.md): field-level request and response schemas (OpenAPI) for the endpoints above; the paths follow the use-case steps and §15.1, the field shapes need architect input. | Solution Architecture Team and service owner | DDL columns and client-facing response fields are outside the E2E edge inventory; tenant-key conflicts are separately inventoried | No: no internal synchronous contract or consolidation count requires the full client schema or secondary-index list | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13a-service-refund.md](./13a-service-refund.md): consumer retry attempts and delays before a payout event goes to the DLQ. | Solution Architecture Team | E2E saga and security -> 13a-service-refund.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13a-service-refund.md](./13a-service-refund.md): lawful basis, retention, and the erasure path for refund records and contact details, and whether ISO 27001 or SOC 2 controls apply to this module. | Security and Data Protection owners | E2E saga and security -> 13a-service-refund.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13b-service-payout.md](./13b-service-payout.md): what happens to a refund whose payout is `FAILED` at the end of the retry window: a manual retry, another payout route, or closing the refund? No REFUNDS use case covers it; the design stops automatic retries and leaves the refund Approved. | Solution Architecture Team | E2E saga and security -> 13b-service-payout.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13b-service-payout.md](./13b-service-payout.md): which reference CardPay needs to refund the original card: the receipt number, or a card payment reference that REFUNDS 08 does not list among the POS data? PCI DSS stays out of this service's scope only if no card data is needed. | Security and Data Protection owners | E2E saga and security -> 13b-service-payout.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13b-service-payout.md](./13b-service-payout.md): the full column list, remaining constraints, and secondary indexes of the payout database; they depend on the API-02 fields the provider documentation defines. | Solution Architecture Team and service owner | DDL columns and client-facing response fields are outside the E2E edge inventory; tenant-key conflicts are separately inventoried | No: no internal synchronous contract or consolidation count requires the full client schema or secondary-index list | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13b-service-payout.md](./13b-service-payout.md): Solution Architecture Team and payout-service owner must reconcile tenant-leading keys for payout, payout_attempt, outbox_event and inbox_message; every ERD key needs a Tables Design row with type, nullability and constraints. Existing summaries are not a complete schema. | Solution Architecture Team, service owner and Data Protection owner | E2E tenant-isolation and retention doctrine -> DB Modeling -> unresolved key and lifecycle consistency | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13b-service-payout.md](./13b-service-payout.md): retention period for payout records; payouts are financial records and may carry a statutory retention period. | Security and Data Protection owners | E2E saga and security -> 13b-service-payout.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13b-service-payout.md](./13b-service-payout.md): consumer retry attempts and delays before a message goes to the DLQ. | Solution Architecture Team | E2E saga and security -> 13b-service-payout.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13c-service-notification.md](./13c-service-notification.md): the full column list, remaining constraints, and secondary indexes of the notification database; the message fields depend on the API-03 provider documentation. | Solution Architecture Team and service owner | DDL columns and client-facing response fields are outside the E2E edge inventory; tenant-key conflicts are separately inventoried | No: no internal synchronous contract or consolidation count requires the full client schema or secondary-index list | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13c-service-notification.md](./13c-service-notification.md): Solution Architecture Team and notification-service owner must reconcile the message_template and notification_message keys and relationship, tenant-leading indexes, nullability and full constraints across the ERD and Tables Design before generating DDL. | Solution Architecture Team, service owner and Data Protection owner | E2E tenant-isolation and retention doctrine -> DB Modeling -> unresolved key and lifecycle consistency | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13c-service-notification.md](./13c-service-notification.md): retention period of the delivery log. | Security and Data Protection owners | E2E saga and security -> 13c-service-notification.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13c-service-notification.md](./13c-service-notification.md): consumer retry attempts and delays before a message goes to the DLQ. | Solution Architecture Team | E2E saga and security -> 13c-service-notification.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13c-service-notification.md](./13c-service-notification.md): lawful basis and retention for the delivery log, and whether ISO 27001 or SOC 2 controls apply to this service. | Security and Data Protection owners | E2E saga and security -> 13c-service-notification.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): how a purchase amount with cents becomes whole points (LOYALTY 11 says points are whole numbers): round down, round half up, or round up? | LOYALTY and REFUNDS BRD owners with Retail IT | E2E saga and security -> 13d-service-loyalty.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): is the LOYALTY purchase reference ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)) the same identifier as the REFUNDS receipt number ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1)? The take-back matches them one to one. | LOYALTY and REFUNDS BRD owners with Retail IT | E2E saga and security -> 13d-service-loyalty.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): LOYALTY owner must decide how a refund below 1 EUR is shown when its whole-point take-back is zero, and whether multiple partial refunds aggregate cents or cap total points; BR-3 and AC-2 do not state these rules. No cumulative rounding or cap is assumed. | LOYALTY and REFUNDS BRD owners with Retail IT | E2E saga and security -> 13d-service-loyalty.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): the full column list, remaining constraints, and secondary indexes of the `loyalty` schema; the BRD describes the concepts, not a relational schema. | Solution Architecture Team and service owner | DDL columns and client-facing response fields are outside the E2E edge inventory; tenant-key conflicts are separately inventoried | No: no internal synchronous contract or consolidation count requires the full client schema or secondary-index list | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): Solution Architecture Team and loyalty-service owner must reconcile tenant-leading points_movement and refund_takeback keys, member and movement foreign keys, occurred_at and rejection id coverage, and retention for purchase_import_cursor, purchase_import_rejection and handled refunds with no movement. The new paid amount and refund reference must survive the pending-import path; full schema and retention approval remain open. | Solution Architecture Team, service owner and Data Protection owner | E2E tenant-isolation and retention doctrine -> DB Modeling -> unresolved key and lifecycle consistency | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): retention after a member leaves the program. | Security and Data Protection owners | E2E saga and security -> 13d-service-loyalty.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): field-level response schemas (OpenAPI) for the endpoints above; the paths follow the use-case steps and §15.1, the field shapes need architect input. | Solution Architecture Team and service owner | DDL columns and client-facing response fields are outside the E2E edge inventory; tenant-key conflicts are separately inventoried | No: no internal synchronous contract or consolidation count requires the full client schema or secondary-index list | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): redelivery attempts before the alert. | Solution Architecture Team | E2E saga and security -> 13d-service-loyalty.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [13d-service-loyalty.md](./13d-service-loyalty.md): lawful basis and the erasure path for a member's ledger, and whether ISO 27001 or SOC 2 controls apply to this module. | Security and Data Protection owners | E2E saga and security -> 13d-service-loyalty.md -> Business Logic, tenant isolation, retry boundary or compliance | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): growth | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): approval rate, which sets the real payout count | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): member count and member purchases per day | LOYALTY and REFUNDS BRD owners with Retail IT | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): availability target for the LOYALTY screens; LOYALTY 01 objective 2 says members can check their points "at any time" without a measure, and the core serves them at the REFUNDS level. | LOYALTY and REFUNDS BRD owners with Retail IT | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): sustained RPS | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): p50, p95, and p99 latency per endpoint group | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): peak RPS | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): p50, p95, and p99 latency | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): sustained events per second | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): time from `REFUND_APPROVED` to the first API-02 attempt | REFUNDS BRD owner and service owner | E2E saga timing -> section 18.2 -> approval-to-payout or notification completion boundary | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): time from the event to an accepted message | REFUNDS BRD owner and service owner | E2E saga timing -> section 18.2 -> approval-to-payout or notification completion boundary | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): load-testing tool | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): cadence, for example before each seasonal sale and each major release | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [14-performance-and-capacity.md](./14-performance-and-capacity.md): where results are stored and who signs them off | Platform and SRE owners | Load-test planning and performance sizing; not used to establish E2E topology or behavior | No: no consolidation count, edge or role depends on this capacity estimate or test-tool detail | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [15-environments.md](./15-environments.md): per-environment sizing rules for the three deployables, PostgreSQL, and Kafka | Platform and SRE owners | Deployment environment naming and sizing | No: consolidation does not assert a DNS name or replica count | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [15-environments.md](./15-environments.md): DNS naming convention per environment | Platform and SRE owners | Deployment environment naming and sizing | No: consolidation does not assert a DNS name or replica count | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [15-environments.md](./15-environments.md): who may access each environment, and the elevation rules for Prod | Security and Platform owners | E2E security -> section 19 -> production access and privilege elevation | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): restart procedure for refunds-platform-core, payout-service, and notification-service: pre-checks (no rollout in progress, no payout claimed mid-call), commands, log capture, health verification, and escalation. | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): not applicable while the platform has no cache tier (§6 Caching); confirm, or write the procedure for the gateway's token and key caches. | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): replay procedure for each <topic>.<consumer group>.dlq (§14.4): how to inspect a message, fix the cause, reset or re-feed the consumer group from the retained log, and confirm the inbox dedup made the replay safe. | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): rotation procedure for the CardPay, MsgHub, and POS Records credentials, the database credentials, and the Kafka credentials, without a redeploy (§11.6). | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): failover procedure for the core, payout, and notification databases, including how the outbox relays and payout-retry workers resume after failover. | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): procedure for an incident limited to one tenant, found and isolated by its tenant_ref in logs and metrics (§11.4): isolating its traffic at the gateway, pausing its payouts, and communicating with its branches, without logging tenant_id at INFO. | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): commands and checks for operations. | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): procedures for (1) an approved refund whose payout is FAILED at the end of the §17.2 retry window (see the §17.2 clarification), (2) a request flagged by the payout watchdog (§17.1), (3) a RefundPaid publication stuck in the publication log (§11.1), and (4) a purchase import with no successful run for a day or with rejected records (§17.4). | LOYALTY and REFUNDS BRD owners with Retail IT | E2E terminal payout and recovery outcomes -> section 20.1 -> section 17.2 unresolved failed-payout business action | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): severity model | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): diagnostics entries per deployable: symptom, first check, likely cause, action | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): rotation policy and on-call assignment | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): escalation path, including CardPay, MsgHub, and the Retail IT team for POS Records | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): SEV1, SEV2, and SEV3 rules | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): RCA expectations and timelines | Platform and SRE owners | Operational commands, on-call routing and incident procedures | No: consolidation names the operational handoff without claiming concrete commands or staffing values | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [16-operations-runbook.md](./16-operations-runbook.md): approvers and tooling for break-glass access. | IAM and Security owners | E2E security -> section 20.3 -> break-glass approval authority | Yes: this value is required by the stated claim path | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md): repository path | Platform and SRE owners | Locations of supporting artifacts | No: artifact repository paths are not runtime identities or behavior | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md): registry location | Platform and SRE owners | Locations of supporting artifacts | No: artifact repository paths are not runtime identities or behavior | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |
| [17-appendix-and-wishlist.md](./17-appendix-and-wishlist.md): threat model owner and location | Platform and SRE owners | Locations of supporting artifacts | No: artifact repository paths are not runtime identities or behavior | Owner supplies and records the answer at the source; rerun affected reconciliation and E3. |

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
| 6. Ecosystem Overview (full tech stack table, incl. Architecture Doctrine: EDA + DDD + Hexagonal defaults) | [02-ecosystem-overview.md](./02-ecosystem-overview.md) | Implementation Constitution & Planned specs |
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
| 15. Service Integration API Contracts (HTTP: URI, headers, body, error codes, security, auth; in-process: port, DTOs, errors, permission) | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities (platform-wide) | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 refund-service - Detailed Spec | [13a-service-refund.md](./13a-service-refund.md) |
| 17.2 payout-service - Detailed Spec | [13b-service-payout.md](./13b-service-payout.md) |
| 17.3 notification-service - Detailed Spec | [13c-service-notification.md](./13c-service-notification.md) |
| 17.4 loyalty-service - Detailed Spec | [13d-service-loyalty.md](./13d-service-loyalty.md) |

> **Contract consistency:** chunk 10 (event hub) is the platform event contract registry - topic names, event names, and payload contracts in every `13x` chunk must match it verbatim; chunk 11 is the same for synchronous API contracts (method and URI match each `13x` List of APIs; external contracts stay `TBD - external` until the user supplies them); chunk 12 is the same for roles and permission tokens. Divergences are flagged in the registries' consistency/drift sections, never silently reconciled.

### Service Spec Sub-Sections (within each 13x chunk)

Each `13x` service chunk contains these sub-sections in order:

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

> Generated *after* the main SDD body by a cleared-context reviewer. Captures architecture-level gaps, missing scenarios, ADR ambiguities, and cross-chunk contract mismatches. Every item carries a **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply; the skill walks the user through each item for acceptance, then reflects accepted answers into the body and logs them in the Resolution Log.

## End-to-End View (gated)

| Section | Chunk |
|---------|-------|
| 24. End-to-End System Design (services · topics · producers · consumers) | 19-e2e-system-design.md - Locked |

> Chunk 19 is written LAST and only when the e2e gate is open (SKILL.md step 8b): every open item in chunk 18 resolved (`Deferred` counts as open), no open contract divergence, no clarification marker in chunks 09-13x or in 03 §7.3, and the reconciliation rerun after the last change. It consolidates chunks 09, 10, 11, 12, and 13x into one self-contained system map. Link it here once written.

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
|   +-- 10-events-hub.md ................ platform event catalog + payload contracts (event contract registry)
|   +-- 11-api-contracts.md ............. service integration API contracts (API contract registry)
|   +-- 12-centralized-user-roles.md .... platform-wide roles & authorities catalogue
|   +-- 13a-service-refund.md ........... refund-service module spec (events match 10, APIs match 11, roles match 12)
|   +-- 13b-service-payout.md ........... payout-service spec
|   +-- 13c-service-notification.md ..... notification-service spec
|   +-- 13d-service-loyalty.md .......... loyalty-service module spec
+-- 14-performance-and-capacity.md ...... load, throughput, peaks, stress testing
+-- 15-environments.md .................. Dev / SIT / UAT / Prod
+-- 16-operations-runbook.md ............ procedures, diagnostics, on-call
+-- 17-appendix-and-wishlist.md ......... references + future platform enhancements
+-- 18-open-items-and-clarifications.md . reviewer findings with recommended answers (post-generation)
+-- 19-e2e-system-design.md ............. end-to-end system map (gated: only after 18 is cleared; consolidates 09-13x)
```

### Reading Order by Task

| Agent Task | Start With | Then |
|------------|-----------|------|
| Understand the system | 19 (e2e, once written) | 01, 04, 02 |
| Design a new service | 07, 02 | 10 (event contracts), 11 (API contracts), 13a (copy as template), 09 |
| Review architecture | 04, 06 | 05, 07, 19 |
| Add an integration | 08 | 11 (API contract), 13a (service integrations sub-section) |
| Define DB schema | 07 (defaults) | 13a (DB Modeling sub-section) |
| Add / change an event | 10 (registry first) | the producing + consuming 13x chunks, then 18 |
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
| [REFUNDS 06a - Use Cases: Customer](../brd-refunds-portal/06a-use-cases-customer.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/13a - refund-service](./13a-service-refund.md) | UC main/exception flows become service business logic and error handling; each UC ID in the SDD links to its heading here |
| [REFUNDS 06b - Use Cases: Branch Manager](../brd-refunds-portal/06b-use-cases-branch-manager.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/13a - refund-service](./13a-service-refund.md) | UC main/exception flows become service business logic and error handling; each UC ID in the SDD links to its heading here |
| [REFUNDS 07 - Users & Use Cases Matrix](../brd-refunds-portal/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-service authorization rules |
| [REFUNDS 08 - Integrations](../brd-refunds-portal/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md) | BRD names partners and purpose; SDD details protocol/auth/retries and the API contract (external ones `TBD - external` until the provider documentation is supplied) |
| [REFUNDS 10 - NFRs](../brd-refunds-portal/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [REFUNDS 12 - Appendix (Technical Inputs for the SDD)](../brd-refunds-portal/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | Source technical mandates (parked verbatim in the BRD) seed the SDD ecosystem selection and override CLAUDE.md defaults |
| [LOYALTY 01 - Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [LOYALTY 04 - Scope & Personas](../brd-loyalty-points/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | BRD personas become SDD actors |
| [LOYALTY 05 - User Journeys Overview](../brd-loyalty-points/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner service in 09 |
| [LOYALTY 06a - Use Cases: Member](../brd-loyalty-points/06a-use-cases-member.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/13d - loyalty-service](./13d-service-loyalty.md) | UC main/exception flows become service business logic and error handling; each UC ID in the SDD links to its heading here |
| [LOYALTY 07 - Users & Use Cases Matrix](../brd-loyalty-points/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-service authorization rules |
| [LOYALTY 08 - Integrations](../brd-loyalty-points/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md) | BRD names the POS Records partner and purpose; SDD details the purchase import and API-04 (`TBD - external`) |
| [LOYALTY 10 - NFRs](../brd-loyalty-points/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [LOYALTY 12 - Appendix (Technical Inputs for the SDD)](../brd-loyalty-points/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | States no technical mandate; CLAUDE.md defaults and the REFUNDS mandates carry §6 |
