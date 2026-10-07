<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.8
PART OF: SDD - Refunds Platform
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and chunk 00 carry the current SDD version; every other chunk carries the version in which its content last changed, and chunk 19 the version it was written at.
MAINTENANCE: When adding or removing chunks (especially 13x service chunks), update the tables below, the dependency graph, and the reading-order table.
-->

# SDD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Solution Design Document. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

> **Lineage:** this SDD's source BRDs (parents, each with its key) and child LLDs are listed in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference in the chunks carries its BRD key (`REFUNDS/UC-04`, `LOYALTY/UC-02`).

> **Specs note:** The constitution-grade `Specs` chunk (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with each child LLD (`../lld-[lld-slug]/17-specs.md`), synthesised from this SDD's body. The SDD carries no Specs chunk.

> **Decision history:** [decision-log.md](./decision-log.md) holds the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, the settled markers, the business review records, and how each decision was reached. The chunks below state only the settled design.

---

## Generation Progress

**Generation:** whole
**Intent:** derive-from-BRD
**Source:** ../brd-refunds-portal/refunds-portal-brd-master.md; ../brd-loyalty-points/loyalty-points-brd-master.md

**Reconciled:** 2026-10-07, step 6a rerun by sdd-unifier (Claude) for the request "update the Testing bullet of 13a Developer Notes" (v1.8), one run; order: run after the request's only content edit to chunks 01 to 17 (the Testing bullet of §17.1 Developer Notes in 13a), and no later edit touches those chunks: only chunk 18 (the delta review's coverage row and Reviewer Notes bullet), chunk 00, this master, and decision-log.md are written after it, none of them a reconciliation source; checked content: chunks 01 to 17 as on disk, sha256 be4d581fda9b95de (each file name, a NUL byte, and its bytes, in name order); parents REFUNDS v1.9 and LOYALTY v1.8, child LLD v1.3; result: no finding: the 10 in-process events from both sides (names, publishers, listeners, DTOs, and the Input tables of 13a to 13e), the 16 permission tokens of 13a to 13e and chunk 11 against §16.11 and the six role counts against §16.12.2, the 14 API contracts (the §15.2 index against the §15.3 blocks, and every API reference of chunks 01 to 17 against §15.2), the 9 §7.3 rows' entry points against the 13x Lists of APIs, no row in §14.8, §15.5, or §16.12.3, and the 1126 relative links and anchors of this folder; the change touches no 13x DB Modeling, so no data model check is owed (the one-time sweep is recorded in the v1.6 entry); earlier entries: 2026-10-07 (v1.7, chunks 01 to 17 at sha256 c8dbd190559473ea, three runs, no finding), 2026-10-07 (v1.6, chunks 01 to 17 at sha256 2e8724c56c828c79, with the data model sweep), 2026-10-07 (the gate check that built the E3 marker inventory), 2026-10-06 (date only, legacy)
**E2E gate (chunk 19):** Open - Up to date
**E2E basis:** chunk 19 v1.7, written 2026-10-07 against the v1.7 Reconciled entry (chunks 01 to 17 at sha256 c8dbd190559473ea), and last verified 2026-10-07 for v1.8 against the v1.8 Reconciled entry above (chunks 01 to 17 at sha256 be4d581fda9b95de; REFUNDS v1.9, LOYALTY v1.8), with E1 to E4 verified against the files: no claim chunk 19 asserts changed (the one v1.8 source change is the Testing bullet of §17.1 Developer Notes), so its body and version are kept; faithfulness check 2026-10-07 (v1.8) by a cleared-context agent against chunks 02 to 13e as on disk: 0 wrong, 0 misleading, 0 cosmetic mismatches; five source problems it reported, none in text the v1.8 request changed and none a chunk 19 claim depends on, are recorded in the chunk 18 Reviewer Notes for their owner, not raised; the v1.7 write's faithfulness check: 0 wrong, 1 misleading, and 3 cosmetic mismatches, all fixed in chunk 19 and confirmed; verified again 2026-10-07 for the request "refresh the e2e" (v1.8): E1 to E4 verified against the files, and a direct comparison of chunks 01 to 17 with this basis (sha256 be4d581fda9b95de, unchanged, the same as the Reconciled entry above) shows no changed source claim, so chunk 19 is already current: body and version kept, no change

### E3 marker inventory

| Marker source / question | Owner | Dependent E2E claim / reference path | Blocks E3 / reason | Next action |
|---|---|---|---|---|
| [01 §3 Assumption 4](./01-executive-summary-scope-risks.md#3-assumptions): the system of record and owner of the branch list. | REFUNDS owner (Finance team) | None | No: branch country and time zone are configuration per tenant (§11.5, §17.2 `branch`) whatever their source; chunk 19 asserts no branch data, and its saga deadline is 24 hours from the first try (§17.3) | Name the system of record and the owner of the branch list |
| [01 §4 R-01 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-01 | REFUNDS owner (Finance team) | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-01 |
| [01 §4 R-02 Mitigation](./01-executive-summary-scope-risks.md#4-risks): mitigation for a purchase POS Records never reports, beyond corrections | LOYALTY owner | None | No: an added mitigation for a §4 risk; §24.8.1 shows a paid refund waiting for its purchase, an outcome §17.5 already settles (the refund waits, then is deleted at the end of its retention) | Decide whether a mitigation beyond corrections is needed |
| [01 §4 R-02 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-02 | LOYALTY owner | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-02 |
| [01 §4 R-07 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-07 | REFUNDS owner (Finance team) | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-07 |
| [01 §4 R-08 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-08 | REFUNDS owner and LOYALTY owner | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-08 |
| [01 §4 R-09 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-09 | REFUNDS owner and LOYALTY owner | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-09 |
| [01 §4 R-10 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-10 | REFUNDS owner and LOYALTY owner | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-10 |
| [01 §4 R-11 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-11 | REFUNDS owner and LOYALTY owner | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-11 |
| [01 §4 R-12 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-12 | REFUNDS owner and LOYALTY owner | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-12 |
| [01 §4 R-13 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-13 | LOYALTY owner | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership | Name the owner of R-13 |
| [01 §4 R-14 Owner](./01-executive-summary-scope-risks.md#4-risks): risk owner for R-14 | REFUNDS owner (Finance team) | None | No: names the owner of a §4 risk; chunk 19 asserts no risk ownership and does not cite R-14 (its late-success claim cites §17.3) | Name the owner of R-14 |
| [02 §6 Compute / Infra](./02-ecosystem-overview.md#6-ecosystem-overview): hosting (an on-premises cluster or a managed cloud Kubernetes service) and the version pins of the cluster stack: Kubernetes, containerd, the ingress controller, Keycloak, Vault, the gateway, and the observability components. Neither BRD names a hosting target. | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Choose the hosting and pin the cluster stack versions |
| [02 §6 CI/CD](./02-ecosystem-overview.md#6-ecosystem-overview): CI platform and deployment tool; neither the BRDs nor the CLAUDE.md defaults name one | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Choose the CI platform and deployment tool |
| [02 §6 Time rule](./02-ecosystem-overview.md#6-ecosystem-overview): the business time zone for LOYALTY corrections and the monthly corrections report. | LOYALTY owner | None | No: chunk 19 states no correction or report date; corrections change loyalty-points only, whatever their date (Faithfulness list) | Set the business time zone of corrections and the monthly corrections report |
| [04 §8.1.1 What](./04-architecture-style-and-diagrams.md#811-what): timeout of the Keycloak admin and token calls of the confirmation and password reset requests. | Architecture team (SDD author) | None | No: §24.6 item 4 points to §8.1.1 for the exceptions and §24.2 draws the Keycloak admin client edge, but no claim states or needs the timeout; Keycloak is platform infrastructure, not a §24.7 edge (§15.1) | Set these Keycloak call timeouts inside the REFUNDS/NFR-05 budget |
| [07 §11.3 Resource model](./07-cross-cutting-concerns.md#113-deployment-default): CPU and memory requests and limits, and the autoscaling thresholds; §18 gives no load numbers to size them. | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Set requests, limits, and autoscaling thresholds |
| [07 §11.4 Tracing](./07-cross-cutting-concerns.md#114-observability-default): trace sampling rate | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Set the trace sampling rate |
| [07 §11.6 TLS](./07-cross-cutting-concerns.md#116-security-default): certificate issuer and renewal tooling | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Choose the certificate issuer and renewal tooling |
| [07 §11.6 Secret rotation](./07-cross-cutting-concerns.md#116-security-default): rotation cadence for provider credentials and the Keycloak client secrets | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Set the rotation cadence |
| [07 §11.6 Vulnerability scanning](./07-cross-cutting-concerns.md#116-security-default): container image scanning tool, cadence, and the severity that blocks a release | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Choose the image scanning tool, cadence, and blocking severity |
| [07 §11.6 Dependency scanning](./07-cross-cutting-concerns.md#116-security-default): dependency scanning tool and the policy for critical CVEs | Architecture team (SDD author) | None | No: a stack or tooling setting (§6, §11); chunk 19 asserts no hosting, version, sizing, or tooling value | Choose the dependency scanning tool and the critical CVE policy |
| [08 §12 INT-01 Timeout](./08-integrations.md#12-integrations): timeout of the payout call | Architecture team (SDD author) | None | No: §24.8.1 bounds the saga by the 24-hour payout deadline (§17.3), not by the call timeout; a timed-out attempt stays open and is resent with the same key, so no outcome depends on the value | Set the payout call timeout once the CardPay documentation (API-03) is supplied |
| [08 §12 INT-02 Timeout](./08-integrations.md#12-integrations): timeout for event-driven messages | Architecture team (SDD author) | None | No: chunk 19 draws API-05 only as an edge label in §24.2, leaves the notifications event edges out of §24.5.1 and its messages out of §24.8 (Faithfulness list), and states no timeout; the value is a resilience setting | Set the timeout of event-driven messages |
| [08 §12 INT-03 Timeout](./08-integrations.md#12-integrations): timeout of the items notice | Architecture team (SDD author) | None | No: API-02 appears only as an edge label in §24.2, and §24.8 leaves the items notices out (Faithfulness list) | Set the items notice timeout |
| [08 §12 INT-03 Notes](./08-integrations.md#12-integrations): the owner of POS Records: the Retail IT team (REFUNDS 08) or the Store Operations team (LOYALTY 08); R-10 | REFUNDS owner and LOYALTY owner | None | No: chunk 19 shows POS Records as a named black box with API-01, API-02, and API-07 and names no owner | Agree one owner of POS Records |
| [08 §12 INT-05 Timeout](./08-integrations.md#12-integrations): timeout of the branch assignment lookup | Architecture team (SDD author) | None | No: §24.2 draws API-06 as an edge, and §24.7 row 2 reads the last synced assignments, never API-06 (§15.3 API-13) | Set the branch assignment lookup timeout |
| [14 §18.1 Refund requests](./14-performance-and-capacity.md#181-load-estimates): growth of refund requests and members after year 1 | REFUNDS owner and LOYALTY owner | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Give the growth after year 1 |
| [14 §18.1 Members and member purchases](./14-performance-and-capacity.md#181-load-estimates): number of members and of member purchases a day; LOYALTY states no volume | LOYALTY owner | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Give the number of members and of member purchases a day |
| [14 §18.2 Throughput Targets](./14-performance-and-capacity.md#182-throughput-targets-per-service): per-module sustained RPS, peak RPS, and p50 and p95 latency targets. The BRDs' business-language NFRs give only the end-to-end ceilings shown, with no request rates per module. | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Derive per-module targets once the volumes are known |
| [14 §18.3 Seasonal sales](./14-performance-and-capacity.md#183-peak-scenarios): autoscaling thresholds and the maximum replica count | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Set the autoscaling thresholds and the maximum replica count |
| [14 §18.3 Evening purchase reporting](./14-performance-and-capacity.md#183-peak-scenarios): purchases per evening; LOYALTY states no volume | LOYALTY owner | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Give the purchases per evening |
| [14 §18.3 Payout retries after a provider outage](./14-performance-and-capacity.md#183-peak-scenarios): payouts waiting after the longest expected outage | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure; the deadline outcome is fixed by §17.3 whatever the backlog | Estimate the payouts waiting after the longest expected outage |
| [14 §18.4 Tooling](./14-performance-and-capacity.md#184-stress-testing-strategy): load test tool | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Choose the load test tool |
| [14 §18.4 Environments](./14-performance-and-capacity.md#184-stress-testing-strategy): whether a separate performance environment exists | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Decide whether a separate performance environment exists |
| [14 §18.4 Scenarios](./14-performance-and-capacity.md#184-stress-testing-strategy): scenario set: baseline, seasonal peak, spike, soak, provider failure injection | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Define the scenario set |
| [14 §18.4 Acceptance criteria](./14-performance-and-capacity.md#184-stress-testing-strategy): further criteria | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Set any further acceptance criteria |
| [14 §18.4 Cadence](./14-performance-and-capacity.md#184-stress-testing-strategy): before each release, or another cadence | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Set the test cadence |
| [14 §18.4 Reporting](./14-performance-and-capacity.md#184-stress-testing-strategy): where results are kept | Architecture team (SDD author) | None | No: a §18 capacity or test value; chunk 19 asserts no load, rate, latency, or test figure | Decide where results are kept |
| [14 §18.5 LOYALTY/NFR-04](./14-performance-and-capacity.md#185-nfr-targets): the Customer Accounts team's availability commitment for the member sign-in, or a LOYALTY decision to leave a member sign-in outage out of LOYALTY/NFR-04, as REFUNDS/NFR-02 leaves out partner outages. | Customer Accounts team (commitment) or LOYALTY owner (scope decision) | None | No: an availability commitment; chunk 19 asserts no availability figure, and API-10 stays a brokered black-box edge in §24.2 | State the member sign-in availability commitment, or decide to leave its outages out of LOYALTY/NFR-04 |
| [15 §19 Sizing](./15-environments.md#19-environments): replica counts and database size per environment; §18 gives no load numbers to size them | Architecture team (SDD author) | None | No: a §19 environment setting; chunk 19 asserts nothing about environments | Set replica counts and database size per environment |
| [15 §19 Data refresh](./15-environments.md#19-environments): refresh policy for SIT and UAT; production data never leaves Prod unmasked | Delivery team (operations owner of §20) | None | No: a §19 environment setting; chunk 19 asserts nothing about environments | Set the SIT and UAT data refresh policy |
| [15 §19 Feature flags](./15-environments.md#19-environments): the hour the daily waiting-requests message is sent ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-5); a business value for the Refunds Portal owner | REFUNDS owner (Finance team) | None | No: a per-environment setting; chunk 19 names `WaitingRequestsSummarised` in §24.1 (published by refund-requests, handled by notifications) and in the Faithfulness list (left out of every diagram), and states no time for it | Give the hour of the daily waiting-requests message |
| [15 §19 DNS](./15-environments.md#19-environments): host names of the two web apps and the gateway per environment | Delivery team (operations owner of §20) | None | No: a §19 environment setting; chunk 19 asserts nothing about environments | Name the host names per environment |
| [15 §19 Access controls](./15-environments.md#19-environments): elevation process | Delivery team (operations owner of §20) | None | No: a §19 environment setting; chunk 19 asserts nothing about environments | Define the production access elevation process |
| [16 §20.1.1 Restart a Service](./16-operations-runbook.md#2011-restart-a-service): restart procedure for the refunds-platform deployable: rollout check, pod selection, log capture, health verification, escalation. | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Write the restart procedure |
| [16 §20.1.3 Replay DLQ Messages](./16-operations-runbook.md#2013-replay-dlq-messages): procedure to replay the events parked in each module's inbox_entry table, to resubmit incomplete event publications in platform.event_publication (the platform has no broker DLQ, ADR-02), and to replay a failed provider call. | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step; it cites §14.10 and §11.1 for redelivery, not the manual replay | Write the replay and resubmission procedure |
| [16 §20.1.4 Rotate Secrets](./16-operations-runbook.md#2014-rotate-secrets): rotation procedure for the provider credentials and Keycloak client secrets in Vault, with the order of steps that avoids downtime. | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Write the rotation procedure |
| [16 §20.1.5 Database Failover](./16-operations-runbook.md#2015-database-failover): failover procedure from the PostgreSQL primary to the standby, the checks before and after, and the reconnection of the deployable. | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Write the failover procedure |
| [16 §20.1.6 Tenant-Specific Incident Response](./16-operations-runbook.md#2016-tenant-specific-incident-response): incident procedure for one tenant: isolating the tenant's traffic, tenant-scoped diagnostics without logging tenant_id at INFO, and communication. | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Write the tenant incident procedure |
| [16 §20.1.7 Payouts Near the Payout Deadline](./16-operations-runbook.md#2017-payouts-near-the-payout-deadline): procedure when payouts approach the payout deadline (§17.3) during a Payment Provider outage: who checks the provider status and who tells the branches. | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step; the deadline outcome of §24.8.1 is fixed by §17.3, whoever checks the provider | Write the procedure with the REFUNDS owner |
| [16 §20.1.8 Late Payout Success](./16-operations-runbook.md#2018-late-payout-success): who contacts the branch, and the response time. | REFUNDS owner (Finance team) | None | No: chunk 19 does not cite §20.1.8; its late-success claim in §24.8.1 (no status change) rests on §17.3, not on who calls the branch | Name who contacts the branch and the response time |
| [16 §20.1.9 Stale Branch Assignments](./16-operations-runbook.md#2019-stale-branch-assignments): contact at the INT-05 owner. | Retail IT team | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Give the contact at the INT-05 owner |
| [16 §20.1.10 Branch With No Recipient](./16-operations-runbook.md#20110-branch-with-no-recipient): who corrects branch assignments. | Retail IT team | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Name who corrects branch assignments |
| [16 §20.1.11 Malformed Contact Address](./16-operations-runbook.md#20111-malformed-contact-address): whether operations may correct a customer's address. | REFUNDS owner (Finance team), with the Data Protection Officer | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Decide whether operations may correct a customer's address |
| [16 §20.1.12 Payout Callback Signature Failure](./16-operations-runbook.md#20112-payout-callback-signature-failure): CardPay Ltd security contact. | CardPay Ltd | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Give the security contact |
| [16 §20.1.13 Purchase Feed Lag](./16-operations-runbook.md#20113-purchase-feed-lag): POS Records owner contact (R-10). | POS Records owner: Retail IT team (REFUNDS 08) or Store Operations team (LOYALTY 08), not yet settled (R-10) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Give the POS Records owner contact |
| [16 §20.1.14 Items Notice Lag](./16-operations-runbook.md#20114-items-notice-lag): Retail IT team contact. | Retail IT team | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Give the Retail IT team contact |
| [16 §20.1.15 Data Subject Request](./16-operations-runbook.md#20115-data-subject-request): the secure hand-over of export files to the Data Protection Officer. | Data Protection Officer | None | No: a step of a compliance procedure (§20.1.15); chunk 19 asserts no data subject handling | Define the secure hand-over of export files |
| [16 §20.2 Severity](./16-operations-runbook.md#202-diagnostics-cheatsheet): severity | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Set the severities |
| [16 §20.2 Symptom](./16-operations-runbook.md#202-diagnostics-cheatsheet): diagnostics cheatsheet rows for receipt checks failing, payouts failing, messages not sent, points not updated, and sign-in failing | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Write the diagnostics cheatsheet rows |
| [16 §20.3 Rotation](./16-operations-runbook.md#203-on-call): on-call rotation | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Set the on-call rotation |
| [16 §20.3 Escalation](./16-operations-runbook.md#203-on-call): escalation path, including the provider contacts at CardPay Ltd, MsgHub, and the POS Records owner | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Write the escalation path with the provider contacts |
| [16 §20.3 Paging policy](./16-operations-runbook.md#203-on-call): SEV1, SEV2, and SEV3 rules against the §18.5 availability budgets | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Set the SEV1 to SEV3 paging rules |
| [16 §20.3 Post-incident](./16-operations-runbook.md#203-on-call): RCA expectations and timelines | Delivery team (operations owner of §20) | None | No: an operating procedure or contact of §20; chunk 19 asserts no operational step | Set the RCA expectations and timelines |
| [17 §21 OpenAPI Specs](./17-appendix-and-wishlist.md#21-appendix): repository path of the OpenAPI documents | Delivery team (operations owner of §20) | None | No: a document location of §21; chunk 19 cites §15 and §16, not these documents | Give the repository path of the OpenAPI documents |
| [17 §21 Threat Model](./17-appendix-and-wishlist.md#21-appendix): threat model owner and location | Architecture team (SDD author) | None | No: a document location of §21; chunk 19 cites §15 and §16, not these documents | Name the threat model owner and location |

External placeholders: the eleven `[TBD - EXTERNAL: ...]` placeholders of chunk 11 (API-01 to API-11) need no row: chunk 19 shows each outside system as a named black box with its API IDs and asserts no provider contract field; the attempt key and the API-04 result in §24.8.1, and the API-03 success the Faithfulness list names, are our side's handling (§17.3); the API-07, API-08, and API-09 placeholders ask only how each provider calls our endpoint and with which fields, while the inbound edges of §24.1 and §24.2 rest on their External inbound type in §15.2 (§3 Assumption 8), not on a provider field. Checked sources: chunks 00 to 17 (the chunk 00 Changes Log excluded); chunk 18 holds marker text only inside closed OI records, and chunks 03, 05, 06, 09 to 13e, and 19 hold no marker.

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
| 15. Service Integration API Contracts (HTTP: URI, headers, body, error codes, security, auth; in-process: port, DTOs, errors, permission, behaviour) | [11-api-contracts.md](./11-api-contracts.md) |
| 16. Centralized User Roles & Authorities (platform-wide) | [12-centralized-user-roles.md](./12-centralized-user-roles.md) |
| 17.1 customer-accounts - Detailed Spec | [13a-service-customer-accounts.md](./13a-service-customer-accounts.md) |
| 17.2 refund-requests - Detailed Spec | [13b-service-refund-requests.md](./13b-service-refund-requests.md) |
| 17.3 payouts - Detailed Spec | [13c-service-payouts.md](./13c-service-payouts.md) |
| 17.4 notifications - Detailed Spec | [13d-service-notifications.md](./13d-service-notifications.md) |
| 17.5 loyalty-points - Detailed Spec | [13e-service-loyalty-points.md](./13e-service-loyalty-points.md) |

> **Contract consistency:** chunk 10 (event hub) is the platform event contract registry - topic names, event names, and payload contracts in every `13x` chunk must match it verbatim; chunk 11 is the same for synchronous API contracts (method and URI match each `13x` List of APIs; external contracts stay `TBD - external` until the user supplies them); chunk 12 is the same for roles and permission tokens. Divergences are flagged in the registries' consistency/drift sections, never silently reconciled.

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

> Generated *after* the main SDD body by a cleared-context reviewer. Captures architecture-level gaps, missing scenarios, ADR ambiguities, and cross-chunk contract mismatches. Every item carries a **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply; the skill walks the user through each item for acceptance, then reflects accepted answers into the body and logs them in the Resolution Log.

## End-to-End View (gated)

| Section | Chunk |
|---------|-------|
| 24. End-to-End System Design (services · topics · producers · consumers) | [19-e2e-system-design.md](./19-e2e-system-design.md) |

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
|   +-- 10-events-hub.md ................ in-process domain events (event contract registry)
|   +-- 11-api-contracts.md ............. service integration API contracts (API contract registry)
|   +-- 12-centralized-user-roles.md .... platform-wide roles & authorities catalogue
|   +-- 13a-service-customer-accounts.md  customer accounts and codes
|   +-- 13b-service-refund-requests.md .. refund request lifecycle
|   +-- 13c-service-payouts.md .......... payouts to the original card
|   +-- 13d-service-notifications.md .... email and SMS
|   +-- 13e-service-loyalty-points.md ... points ledger
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
| [REFUNDS 06a - Use Cases: Customer](../brd-refunds-portal/06a-use-cases-customer.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [13a](./13a-service-customer-accounts.md), [13b](./13b-service-refund-requests.md) | UC main/exception flows become service business logic and error handling; each UC ID in the SDD links to its heading here |
| [REFUNDS 06b - Use Cases: Branch Manager](../brd-refunds-portal/06b-use-cases-branch-manager.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [13b](./13b-service-refund-requests.md), [13c](./13c-service-payouts.md) | UC main/exception flows become service business logic and error handling |
| [REFUNDS 07 - Users & Use Cases Matrix](../brd-refunds-portal/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-service authorization rules |
| [REFUNDS 08 - Integrations](../brd-refunds-portal/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md) | BRD names partners and purpose; SDD details protocol/auth/retries and the API contract (external ones `TBD - external` until the provider documentation is supplied) |
| [REFUNDS 10 - NFRs](../brd-refunds-portal/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [REFUNDS 12 - Appendix (Technical Inputs for the SDD)](../brd-refunds-portal/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | Source technical mandates (parked verbatim in the BRD) seed the SDD ecosystem selection and override CLAUDE.md defaults |
| [LOYALTY 01 - Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md) | [sdd/01 - Executive Summary](./01-executive-summary-scope-risks.md) | BRD states business problem; SDD states technical solution |
| [LOYALTY 04 - Scope & Personas](../brd-loyalty-points/04-scope-and-personas.md) | [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | BRD personas become SDD actors |
| [LOYALTY 05 - User Journeys Overview](../brd-loyalty-points/05-user-journeys-overview.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [sdd/09 - Services Summary](./09-services-summary.md) | Every BRD use case gets one §7.3 row and one owner service in 09 |
| [LOYALTY 06a - Use Cases: Member](../brd-loyalty-points/06a-use-cases-member.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [13e](./13e-service-loyalty-points.md) | UC main/exception flows become service business logic and error handling |
| [LOYALTY 06b - Use Cases: Loyalty Administrator](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md) | [sdd/03 §7.3 - Use Case Traceability](./03-users-and-use-cases.md), [13e](./13e-service-loyalty-points.md) | UC main/exception flows become service business logic and error handling |
| [LOYALTY 07 - Users & Use Cases Matrix](../brd-loyalty-points/07-users-use-cases-matrix.md) | [sdd/12 - Centralized User Roles](./12-centralized-user-roles.md), [sdd/03 - Users & Use Cases](./03-users-and-use-cases.md) | Matrix drives the platform role catalogue and per-service authorization rules |
| [LOYALTY 08 - Integrations](../brd-loyalty-points/08-integrations.md) | [sdd/08 - Integrations](./08-integrations.md), [sdd/11 - API Contracts](./11-api-contracts.md), [sdd/10 - Event Hub](./10-events-hub.md) | BRD names partners and purpose; the Refunds Portal row becomes the in-process `RefundPaid` event |
| [LOYALTY 10 - NFRs](../brd-loyalty-points/10-nfrs.md) | [sdd/14 - Performance](./14-performance-and-capacity.md), [sdd/04 - Architecture](./04-architecture-style-and-diagrams.md) | Business expectations are quantified into technical targets and architecture drivers |
| [LOYALTY 12 - Appendix](../brd-loyalty-points/12-appendix-and-wishlist.md) | [sdd/02 - Ecosystem](./02-ecosystem-overview.md) | LOYALTY parks no technical input; its rows come from defaults and recommendations |
