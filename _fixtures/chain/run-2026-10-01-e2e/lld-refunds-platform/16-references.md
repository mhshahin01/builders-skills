<!--
CHUNK: 16
TITLE: References
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 19. References

## 19.1 Source Documents

| Document | Path / URL | Version / state | Notes |
|----------|------------|-----------------|-------|
| Related BRD (REFUNDS) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | 1.0 (Approved) | Key from the SDD's Source BRDs register |
| Related BRD (LOYALTY) | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | 1.2 (In Review; generation Complete) | Key from the SDD's Source BRDs register (register version 1.2) |
| Related SDD | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) | 1.2 (generation whole, reconciled 2026-10-01; chunk 19 written, e2e gate Open - Up to date) | Read for this LLD's v1.1 refresh (Changes Log rows 1.1 and 1.2); the version SKILL.md step 3c compares on the next run |
| SDD §7.3 Use Case Traceability | [03-users-and-use-cases.md § 7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | SDD v1.2 (chunk 03 at v1.1: LOYALTY group row reads v1.2; owners and entry points unchanged) | Owners and entry points of the traced use cases |
| REFUNDS UAT/BAT test cases (BRD chunk 16) | [16-uat-bat-test-cases.md](../brd-refunds-portal/16-uat-bat-test-cases.md) | Up to date (2026-09-25, baselined on BRD v1.0) | Test case IDs and their `Related UC`; the Traceability Matrix agrees with every `Related UC` |
| LOYALTY UAT/BAT test cases (BRD chunk 16) | [16-uat-bat-test-cases.md](../brd-loyalty-points/16-uat-bat-test-cases.md) | Up to date (2026-10-01, baselined on BRD v1.2) | Test case IDs and their `Related UC`; the Traceability Matrix agrees with every `Related UC` |
| REFUNDS Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-refunds-portal/14-todo.md#mockup-coverage) | As of BRD v1.0: rows REFUNDS/SCR-01, REFUNDS/SCR-02, REFUNDS/MK-03, all Approved | `MK-NN` rows (the screen references, one per screen or flow) and their Figma links |
| LOYALTY Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-loyalty-points/14-todo.md#mockup-coverage) | As of BRD v1.2: rows LOYALTY/LP-01, LOYALTY/LP-02, both Approved and playable | `MK-NN` rows (the screen references, one per screen or flow) and their Figma links |
| Source code repo | Not applicable | - | (from-code / hybrid) |

## 19.2 Architectural Decision Records

| ADR ID | Title | Status | Link |
|--------|-------|--------|------|
| ADR-01 | Hybrid architecture: modular monolith core plus payout-service and notification-service | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-02 | Kafka backbone with outbox and inbox dedup | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-03 | Shared schema with `tenant_id`; branch as a row-level scope | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-04 | REST with JSON, OpenAPI, URI versioning | Proposed | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-05 | No synchronous call between deployables; in-process events with a durable publication log | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-06 | PostgreSQL for all data; core database with module schemas | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-07 | Keycloak, one realm, OIDC with PKCE | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-08 | Authorization in the owning module | Proposed | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-09 | On-prem Kubernetes, one image and Helm chart per deployable | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-10 | Customer contact details travel in the refund events | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |

> Note: ADRs that affect this LLD's design - even if owned by SDD level - should be cross-linked here for traceability.

## 19.3 OpenAPI Specifications

| Service | Path / URL | Notes |
|---------|------------|-------|
| `refund-service`, `loyalty-service` (one document for the core) | `refunds-platform-core/core-app/src/main/resources/openapi/refunds-platform-core-v1.yaml` (proposed; 06) | Source of truth for §9 API Contracts once written |
| `payout-service`, `notification-service` | None | No business REST API |
| API-01 to API-04 (providers) | [SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user) | `TBD - external` |

## 19.4 Event Schemas

| Topic | Schema location | Notes |
|-------|------------------|-------|
| `refunds-platform-refund-events` | Schema registry subjects `refunds-platform-refund-events-<EVENT_TYPE>` (07 § 10.2); contracts in [SDD §14.9](../sdd-refunds-platform/10-events-hub.md#149-payload-contract-samples) | Five events, all `committed`, version 1.0.0 |
| `refunds-platform-payout-events` | Subjects `refunds-platform-payout-events-<EVENT_TYPE>`; contracts in SDD §14.9 | Two events, all `committed`, version 1.0.0 |
| In-process `RefundPaid` | `RefundPaidEvent` record in `core-contracts`; contract in [SDD §14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | Not in the registry (never leaves the process) |

## 19.5 Runbooks

| Runbook | Location | Linked from |
|---------|----------|-------------|
| RB-01 Drain outbox backlog | `10-operations.md` § 13.8 | Alert `OutboxBacklog` |
| RB-02 Replay DLQ | `10-operations.md` § 13.8 | Alert `DLQ rows` |
| RB-03 Rotate database secret | `10-operations.md` § 13.8 | Secret rotation (11 § 14.3) |
| RB-04 RefundPaid publication stuck or take-back late | `10-operations.md` § 13.8 | Alerts `EventPublicationStuck`, `TakebackLagSLO`; SDD §20.1.9 item 3 |
| RB-05 Payout failed, held, or overdue | `10-operations.md` § 13.8 | Alerts `RefundPayoutOverdue`, `PayoutHeld`, `PayoutFailed`; SDD §20.1.9 items 1 and 2 |
| RB-06 Purchase import stale or rejecting | `10-operations.md` § 13.8 | Alerts `PurchaseImportStale`, `EarnLagSLO`, `PurchaseImportRejections`; SDD §20.1.9 item 4 |
| RB-07 Provider or shared-dependency outage | `10-operations.md` § 13.8 | Alert `ProviderCircuitOpen`; SDD §20.1.7, §20.1.8 |
| RB-08 Erase a customer's contact details or a member's ledger | `10-operations.md` § 13.8 | An approved erasure request; SDD §16.8 item 4, §17.1 and §17.4 Compliance |

## 19.6 Threat Model

| Document | Path / URL |
|----------|------------|
| Threat model | Not written (owner and location NEEDS CLARIFICATION in [SDD §21](../sdd-refunds-platform/17-appendix-and-wishlist.md#21-appendix)); lightweight notes in 11 § 14.5 |

## 19.7 External References

| Reference | URL |
|-----------|-----|
| RFC 9457 ProblemDetails | https://www.rfc-editor.org/rfc/rfc9457 |
| RFC 9562 UUIDs (UUIDv7) | https://www.rfc-editor.org/rfc/rfc9562 |
| OpenTelemetry Java SDK | https://opentelemetry.io/docs/languages/java/ |
| Resilience4j docs | https://resilience4j.readme.io/ |
| Flyway docs | https://flywaydb.org/documentation |

## 19.8 Related LLDs (sibling projects, cross-references)

| LLD | Reason for cross-reference |
|-----|----------------------------|
| None | This LLD covers every SDD §13 service; the SDD's Child LLDs table lists no other LLD |

## 19.9 Use-Case Traceability Index

> **Start here for a production bug.** Take the `use_case` and `screen` from the error report, log line, or span (`09-cross-cutting.md` § 12.7-12.8), or search this table for the route, screen, or test case. The row links to the workflow block, the BRD use case, the SDD §7.3 row, the test cases, and the spec.

| Use case (BRD) | Title | SDD §7.3 | LLD workflow | Screens (BRD) | Routes (LLD) | UAT/BAT test cases (BRD) | E2E specs (LLD) | Status |
|----------------|-------|----------|--------------|---------------|--------------|--------------------------|-----------------|--------|
| **[Refunds Portal v1.0](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS)** | | | | | | | | |
| [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | Request a Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-01-request-a-refund) | [REFUNDS/SCR-01](../brd-refunds-portal/11-summary-and-uiux.md#screens) | `/refunds/new` | [REFUNDS/TC-REQ-01](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-02](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-03](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-04](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-01-request-a-refund.spec.ts` | Active |
| [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) | Track Refund Status (Web and Mobile) | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-02-track-refund-status-web-and-mobile) | [REFUNDS/SCR-02](../brd-refunds-portal/11-summary-and-uiux.md#screens) | `/refunds`, `/refunds/:refundRequestId` | [REFUNDS/TC-REQ-05](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-06](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-02-track-refund-status-web-and-mobile.spec.ts` | Active |
| [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | Cancel a Refund Request | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-03-cancel-a-refund-request) | [REFUNDS/SCR-02](../brd-refunds-portal/11-summary-and-uiux.md#screens) | `/refunds`, `/refunds/:refundRequestId` | [REFUNDS/TC-REQ-07](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-08](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) | `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | Active |
| [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Approve / Reject Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-04-approve--reject-refund) | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/branch/refund-requests`, `/branch/refund-requests/:refundRequestId` | [REFUNDS/TC-DEC-01](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-02](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-03](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-04](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-05](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | Active |
| [REFUNDS/UC-05](../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary) | Issue Partial Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | - | - | - | - | - | Merged into REFUNDS/UC-04 |
| **[Loyalty Points v1.2](../brd-loyalty-points/loyalty-points-brd-master.md) (LOYALTY)** | | | | | | | | |
| [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | View Points Balance | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty-service](./04-implementation/loyalty-service.md#loyaltyuc-01-view-points-balance) | [LOYALTY/LP-01](../brd-loyalty-points/06a-use-cases-member.md#uiux) | `/points` | [LOYALTY/TC-ACC-01](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-ACC-02](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-BAL-01](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-BAL-02](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-BAL-03](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-BAL-04](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-UIX-01](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-UIX-03](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-NFR-01](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03) | `e2e/loyalty-uc-01-view-points-balance.spec.ts` | Active |
| [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | View Points History | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty-service](./04-implementation/loyalty-service.md#loyaltyuc-02-view-points-history) | [LOYALTY/LP-02](../brd-loyalty-points/06a-use-cases-member.md#uiux-1) | `/points/history`, `/points/history/:movementId` | [LOYALTY/TC-ACC-03](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-ACC-04](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-HIS-01](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-02](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-03](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-04](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-05](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-06](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-07](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-PTS-01](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-02](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-03](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-04](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-05](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-06](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-07](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-UIX-02](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-UIX-04](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-NFR-01](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03), [LOYALTY/TC-NFR-03](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03), [LOYALTY/TC-NFR-04](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03), [LOYALTY/TC-NFR-05](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03) | `e2e/loyalty-uc-02-view-points-history.spec.ts` | Active |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 15-open-questions.md | NEXT: 17-specs.md -->
