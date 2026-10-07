<!--
CHUNK: 15
TITLE: Open Questions and Flag Index
PROJECT: Refunds Platform
VERSION: 1.4
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 18. Open Questions & Flag Index

## 18.1 Drift Markers (hybrid mode only)

Not applicable - from-sdd.

## 18.2 Low-Confidence Inferences (TODO)

| ID | Location | Inference / verification |
| --- | --- | --- |
| TODO-01 | [03-architecture.md:62](./03-architecture.md#63-runtime-stack) | Missing version pin: Spring Modulith - verify compatible exact pin in SDD §6 through sdd-unifier; no local pin. |
| TODO-02 | [03-architecture.md:63](./03-architecture.md#63-runtime-stack) | Missing version pin: Resilience4j - verify in SDD §6 through sdd-unifier; no local pin. |
| TODO-03 | [03-architecture.md:64](./03-architecture.md#63-runtime-stack) | Missing version pin: Flyway - verify in SDD §6 through sdd-unifier; no local pin. |
| TODO-04 | [03-architecture.md:65](./03-architecture.md#63-runtime-stack) | Missing version pin: PrimeNG - verify in SDD §6 through sdd-unifier; no local pin. |
| TODO-05 | [03-architecture.md:66](./03-architecture.md#63-runtime-stack) | Missing version pin: Tailwind - verify in SDD §6 through sdd-unifier; no local pin. |
| TODO-06 | [03-architecture.md:67](./03-architecture.md#63-runtime-stack) | Missing version pin: Kubernetes - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-07 | [03-architecture.md:68](./03-architecture.md#63-runtime-stack) | Missing version pin: containerd - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-08 | [03-architecture.md:69](./03-architecture.md#63-runtime-stack) | Missing version pin: NGINX Ingress Controller - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-09 | [03-architecture.md:70](./03-architecture.md#63-runtime-stack) | Missing version pin: Keycloak - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-10 | [03-architecture.md:71](./03-architecture.md#63-runtime-stack) | Missing version pin: HashiCorp Vault - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-11 | [03-architecture.md:72](./03-architecture.md#63-runtime-stack) | Missing version pin: Spring Cloud Gateway - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-12 | [03-architecture.md:73](./03-architecture.md#63-runtime-stack) | Missing version pin: Grafana Loki - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-13 | [03-architecture.md:74](./03-architecture.md#63-runtime-stack) | Missing version pin: Prometheus - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-14 | [03-architecture.md:75](./03-architecture.md#63-runtime-stack) | Missing version pin: Grafana - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-15 | [03-architecture.md:76](./03-architecture.md#63-runtime-stack) | Missing version pin: OpenTelemetry - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-16 | [03-architecture.md:77](./03-architecture.md#63-runtime-stack) | Missing version pin: Grafana Tempo - verify in SDD §6 Compute / Infra through sdd-unifier. |
| TODO-17 | [03-architecture.md:78](./03-architecture.md#63-runtime-stack) | CI platform and deployment tool, plus hosting target, are unspecified - verify at SDD §6; keep configuration portable. |
| TODO-18 | [05-data-model.md:520](./05-data-model.md#platform-owned-tables) | Verify Spring Modulith registry DDL, identity mapping and migration against the exact upstream pin before generating SQL; do not invent registry columns. |
| TODO-19 | [06-api-contracts.md:79](./06-api-contracts.md#external-provider-contracts) | API-01 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-20 | [06-api-contracts.md:81](./06-api-contracts.md#external-provider-contracts) | API-02 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-21 | [06-api-contracts.md:83](./06-api-contracts.md#external-provider-contracts) | API-03 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-22 | [06-api-contracts.md:85](./06-api-contracts.md#external-provider-contracts) | API-04 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-23 | [06-api-contracts.md:87](./06-api-contracts.md#external-provider-contracts) | API-05 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-24 | [06-api-contracts.md:89](./06-api-contracts.md#external-provider-contracts) | API-06 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-25 | [06-api-contracts.md:91](./06-api-contracts.md#external-provider-contracts) | API-07 stays TBD - external; POS Records calls our provider route (SDD §3 Assumption 8): obtain the call pattern (one record or a batch per call), method, URI, version, headers, body, expected response, error codes, auth scheme and resend behaviour from POS Records ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)) before adapter implementation; a file-only or feed-only delivery is an SDD design change. |
| TODO-26 | [06-api-contracts.md:93](./06-api-contracts.md#external-provider-contracts) | API-08 stays TBD - external; the Customer Accounts team calls our provider route with leave and rejoin notices (SDD §3 Assumption 8): obtain the call pattern (one record or a batch per call), method, URI, version, headers, body, expected response, error codes, auth scheme and resend behaviour from that team ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)) before adapter implementation; a file-only or feed-only delivery is an SDD design change. |
| TODO-27 | [06-api-contracts.md:95](./06-api-contracts.md#external-provider-contracts) | API-09 stays TBD - external; the Marketing team calls our provider route with the one-off balances (SDD §3 Assumption 8), verified with the tenant's own Vault secret: obtain the call pattern (one record or a batch per call), method, URI, version, headers, body, expected response, error codes, auth scheme and resend behaviour from the Marketing team ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)) before adapter implementation; a file-only or feed-only delivery is an SDD design change. |
| TODO-28 | [06-api-contracts.md:97](./06-api-contracts.md#external-provider-contracts) | API-10 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-29 | [06-api-contracts.md:99](./06-api-contracts.md#external-provider-contracts) | API-11 stays TBD - external; obtain method, URI, request/response, auth, acknowledgements and idempotency contract from its named SDD §15 owner before adapter implementation. |
| TODO-30 | [09-cross-cutting.md:46](./09-cross-cutting.md#123-resilience-downstream-calls) | Verify production provider timeouts for API-02, API-03, event API-05 and API-06 at SDD §12; no invented production values. |
| TODO-31 | [09-cross-cutting.md:47](./09-cross-cutting.md#123-resilience-downstream-calls) | Verify Keycloak confirmation/reset/admin time budgets at SDD 13a; the stated 500 ms value covers creation, not every operation. |
| TODO-32 | [09-cross-cutting.md:76](./09-cross-cutting.md#use-case-attribute) | Trace sampling rate is unspecified in SDD §11.4 - verify there; use deterministic full sampling in test fixtures only. |
| TODO-33 | [10-operations.md:41](./10-operations.md#131-configuration-per-service) | CPU/memory requests and limits, autoscaling thresholds, and connection-pool capacity require measured load; upstream home SDD §11.3 / §18. |
| TODO-34 | [10-operations.md:90](./10-operations.md#rb-03-rotate-database-secret) | Operator commands, deployment namespace and runtime dashboard links need the actual environment; verify with the platform operator at SDD §20. |
| TODO-35 | [11-security.md:24](./11-security.md#143-secrets-management) | Certificate issuer/renewal, credential rotation cadence, image/dependency scan tools and blocking policies remain unspecified in SDD §11.6; verify there before a production release. |
| TODO-36 | [12-performance.md:27](./12-performance.md#151-slos-per-service) | p50/p95 distributions, sustained/peak RPS, concurrency and LOYALTY volume are unknown in SDD §18 - measure; do not turn end-to-end budgets into module percentile targets. |
| TODO-37 | [12-performance.md:28](./12-performance.md#151-slos-per-service) | The identity brokers' availability commitment remains a source SDD §18.5 dependency; verify against the 60-minute combined budget. |
| TODO-38 | [04-implementation/loyalty-points.md:205](./04-implementation/loyalty-points.md#loyaltypointsserviceimplnotice-and-retention) | Best guess: one `go_live_import` run per API-09 call, its counts read by the [SDD §11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default) promotion check and the R-03 totals check; how calls map to runs (SDD 13e Tables Design: one row per run) is not stated now that API-09 arrives by calls - verify at SDD 13e and §11.3 through sdd-unifier before building the import. |

## 18.3 Medium-Confidence Inferences (Confirm)

| ID | Location | Inference / verification |
| --- | --- | --- |
| CONFIRM-01 | [04-implementation/customer-accounts.md:28](./04-implementation/customer-accounts.md#72-class--interface-map) | customer-accounts class names and method signatures are proposed; verify during implementation against [SDD §17 customer-accounts](../sdd-refunds-platform/13a-service-customer-accounts.md). |
| CONFIRM-02 | [04-implementation/customer-accounts.md:132](./04-implementation/customer-accounts.md#73-method-level-pseudocode-non-trivial-logic-only) | customer-accounts pseudocode combines the stated algorithm with inferred lock/transaction wiring; verify failure and concurrency paths in PostgreSQL integration tests. |
| CONFIRM-03 | [04-implementation/customer-accounts.md:305](./04-implementation/customer-accounts.md#76-transaction-boundaries) | transaction propagation and read snapshot isolation are implementation choices; ports use the SDD contract verbatim in §9.6. Fault-test lock order and rollback visibility. |
| CONFIRM-04 | [04-implementation/loyalty-points.md:28](./04-implementation/loyalty-points.md#72-class--interface-map) | loyalty-points class names and method signatures are proposed; verify during implementation against [SDD §17 loyalty-points](../sdd-refunds-platform/13e-service-loyalty-points.md). |
| CONFIRM-05 | [04-implementation/loyalty-points.md:129](./04-implementation/loyalty-points.md#73-method-level-pseudocode-non-trivial-logic-only) | loyalty-points pseudocode combines the stated algorithm with inferred lock/transaction wiring; verify failure and concurrency paths in PostgreSQL integration tests. |
| CONFIRM-06 | [04-implementation/loyalty-points.md:329](./04-implementation/loyalty-points.md#76-transaction-boundaries) | transaction propagation and read snapshot isolation are implementation choices; ports use the SDD contract verbatim in §9.6. Fault-test lock order and rollback visibility. |
| CONFIRM-07 | [04-implementation/notifications.md:28](./04-implementation/notifications.md#72-class--interface-map) | notifications class names and method signatures are proposed; verify during implementation against [SDD §17 notifications](../sdd-refunds-platform/13d-service-notifications.md). |
| CONFIRM-08 | [04-implementation/notifications.md:105](./04-implementation/notifications.md#73-method-level-pseudocode-non-trivial-logic-only) | notifications pseudocode combines the stated algorithm with inferred lock/transaction wiring; verify failure and concurrency paths in PostgreSQL integration tests. |
| CONFIRM-09 | [04-implementation/notifications.md:268](./04-implementation/notifications.md#76-transaction-boundaries) | transaction propagation and read snapshot isolation are implementation choices; ports use the SDD contract verbatim in §9.6. Fault-test lock order and rollback visibility. |
| CONFIRM-10 | [04-implementation/payouts.md:28](./04-implementation/payouts.md#72-class--interface-map) | payouts class names and method signatures are proposed; verify during implementation against [SDD §17 payouts](../sdd-refunds-platform/13c-service-payouts.md). |
| CONFIRM-11 | [04-implementation/payouts.md:93](./04-implementation/payouts.md#73-method-level-pseudocode-non-trivial-logic-only) | payouts pseudocode combines the stated algorithm with inferred lock/transaction wiring; verify failure and concurrency paths in PostgreSQL integration tests. |
| CONFIRM-12 | [04-implementation/payouts.md:229](./04-implementation/payouts.md#76-transaction-boundaries) | transaction propagation and read snapshot isolation are implementation choices; ports use the SDD contract verbatim in §9.6. Fault-test lock order and rollback visibility. |
| CONFIRM-13 | [04-implementation/refund-requests.md:28](./04-implementation/refund-requests.md#72-class--interface-map) | refund-requests class names and method signatures are proposed; verify during implementation against [SDD §17 refund-requests](../sdd-refunds-platform/13b-service-refund-requests.md). |
| CONFIRM-14 | [04-implementation/refund-requests.md:143](./04-implementation/refund-requests.md#73-method-level-pseudocode-non-trivial-logic-only) | refund-requests pseudocode combines the stated algorithm with inferred lock/transaction wiring; verify failure and concurrency paths in PostgreSQL integration tests. |
| CONFIRM-15 | [04-implementation/refund-requests.md:351](./04-implementation/refund-requests.md#76-transaction-boundaries) | transaction propagation and read snapshot isolation are implementation choices; ports use the SDD contract verbatim in §9.6. Fault-test lock order and rollback visibility. |
| CONFIRM-16 | [09-cross-cutting.md:22](./09-cross-cutting.md#122-idempotency) | cross-system operation reservation uses a bounded per-key advisory lock plus source reconciliation; verify lock release, crash recovery and outcome persistence without holding a DB transaction over provider I/O. |
| CONFIRM-17 | [09-cross-cutting.md:45](./09-cross-cutting.md#123-resilience-downstream-calls) | default circuit-breaker and bulkhead values are LLD proposals for unpinned instances, not added SDD facts; test their saturation and fast-failure effect on the source budgets. |
| CONFIRM-18 | [09-cross-cutting.md:61](./09-cross-cutting.md#126-error-model-rfc-9457-problemdetails) | proposed problem type URNs are a project convention; agree stable identifiers with the implementer without changing the SDD errorCode. |
| CONFIRM-19 | [09-cross-cutting.md:75](./09-cross-cutting.md#use-case-attribute) | @UseCase, use_case MDC/span and frontend route data are LLD conventions; the source SDD does not settle them. Test context restoration with a reused worker thread. |
| CONFIRM-20 | [10-operations.md:40](./10-operations.md#131-configuration-per-service) | configuration variable names are proposed; bind typed records and keep their source meanings unchanged. |
| CONFIRM-21 | [10-operations.md:89](./10-operations.md#rb-03-rotate-database-secret) | RB-01 to RB-03 are implementation procedures derived from SDD §20; validate commands and access against the built deployment before use. |
| CONFIRM-22 | [14-frontend.md:22](./14-frontend.md#173-routing) | route paths, component names and guards are proposed LLD choices; verify with implementer. Screen and use-case mappings are read verbatim from BRD chunk 14. |
| CONFIRM-23 | [04-implementation/loyalty-points.md:201](./04-implementation/loyalty-points.md#loyaltypointsserviceimplnotice-and-retention) | the [SDD Retention Policy](../sdd-refunds-platform/13e-service-loyalty-points.md#retention-policy) set names no home for a member's purchases dated before a first period that a rejoin notice opened; this LLD deletes them, with their refund applications, in that first period's set, as [LOYALTY 03](../brd-loyalty-points/03-definitions-and-domain-concepts.md#membership-end-and-data-retention) deletes a former member's history 24 months after they leave. Confirm the set wording through sdd-unifier. |
| CONFIRM-24 | [04-implementation/loyalty-points.md:203](./04-implementation/loyalty-points.md#loyaltypointsserviceimplnotice-and-retention) | the [SDD Retention Policy](../sdd-refunds-platform/13e-service-loyalty-points.md#retention-policy) gives no rule for a notice that opened or closed no period (for example a second LEAVE for a member already former); this LLD deletes every remaining notice of the member number with the member's last remaining period. Confirm through sdd-unifier. |
| CONFIRM-25 | [13-testing.md:28](./13-testing.md#163-integration-test-conventions) | `account-closure` copies the real-time Keycloak sign-in event times into `last_sign_in_at` and compares them with the business clock, so under a business clock offset the two clocks disagree; the SDD v1.8 review left that reading to the SDD owner ([SDD Reviewer Notes](../sdd-refunds-platform/18-open-items-and-clarifications.md#reviewer-notes)). Confirm through sdd-unifier how `last_sign_in_at` reads the event times under an offset. |

## 18.4 Decisions Pending

Source version/provider/deployment gaps await their named technical owners. Test-fixture person-only choices are settled in [decision-log.md](./decision-log.md). Review decisions are recorded in chunk 18; no new business behavior is silently adopted.

## 18.5 Inference Confidence Summary

| Section | Confirm | TODO |
| --- | --- | --- |
| §1 | 0 | 0 |
| §2 | 0 | 0 |
| §3 | 0 | 0 |
| §4 | 0 | 0 |
| §5 | 0 | 0 |
| §6 | 0 | 17 |
| §7 customer-accounts | 3 | 0 |
| §7 loyalty-points | 5 | 1 |
| §7 notifications | 3 | 0 |
| §7 payouts | 3 | 0 |
| §7 refund-requests | 3 | 0 |
| §8 | 0 | 1 |
| §9 | 0 | 11 |
| §10 | 0 | 0 |
| §11 | 0 | 0 |
| §12 | 4 | 3 |
| §13 | 2 | 2 |
| §14 | 0 | 1 |
| §15 | 0 | 2 |
| §16 | 1 | 0 |
| §17 | 1 | 0 |
| §20 Specs | 0 | 0 |
| Global (§18) | 0 | 0 |
| Total | 25 | 38 |

## 18.6 Policy Findings (every mode that reads code)

Not applicable - application code was not read. Source ADRs intentionally override the microservices/broker default; no policy finding is invented for that choice.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 14-frontend.md | NEXT: 16-references.md -->
