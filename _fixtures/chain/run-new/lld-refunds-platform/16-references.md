<!--
CHUNK: 16
TITLE: References
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 19. References

## 19.1 Source Documents

The use-case trace of this LLD was built from the upstream state below (2026-09-28).

| Document | Path / URL | Version / state | Notes |
|----------|------------|-----------------|-------|
| Related BRD (REFUNDS) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | v1.0, Approved 2026-09-22; generation parts 1-3 Complete | Key from the SDD's Source BRDs register |
| Related BRD (LOYALTY) | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | v1.0, Approved 2026-09-24; whole, Complete | Key from the SDD's Source BRDs register |
| Related SDD | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) | v1.0, Complete 2026-09-28 (chunks 00-18; chunk 19 Locked, e2e gate shut) | Source BRDs register and Child LLDs table in [00 § Document Lineage](../sdd-refunds-platform/00-cover-and-changelog.md#document-lineage) |
| SDD §7.3 Use Case Traceability | [03-users-and-use-cases.md § 7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | SDD v1.0 | 7 rows: REFUNDS 5 (4 active, REFUNDS/UC-05 merged into REFUNDS/UC-04), LOYALTY 2 (active) |
| REFUNDS UAT/BAT test cases (BRD chunk 16) | [16-uat-bat-test-cases.md](../brd-refunds-portal/16-uat-bat-test-cases.md) | Up to date (2026-09-25, baselined on BRD v1.0) | 16 cases; `Related UC` agrees with the chunk's Traceability Matrix |
| LOYALTY UAT/BAT test cases (BRD chunk 16) | Not written | Pending (BRD 16 not written): Locked, delivery gate shut (LOYALTY 14: step 3 not started) | Every LOYALTY test case slot reads `Pending (BRD 16 not written)` |
| REFUNDS Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-refunds-portal/14-todo.md#mockup-coverage) | As of BRD v1.0 (2026-09-25): REFUNDS/SCR-01, REFUNDS/SCR-02, REFUNDS/MK-03 Approved and playable | `REFUNDS/MK-03` stands in for the missing REFUNDS/UC-04 screen ID |
| LOYALTY Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-loyalty-points/14-todo.md#mockup-coverage) | As of BRD v1.0 (2026-09-24): LOYALTY/LP-01, LOYALTY/LP-02 In review, not playable | Screen IDs LOYALTY/LP-01 and LOYALTY/LP-02 are defined in the use cases' UI/UX sections |
| Source code repo | Not applicable (greenfield, from-sdd) | - | - |

## 19.2 Architectural Decision Records

| ADR ID | Title | Status | Link |
|--------|-------|--------|------|
| ADR-01 | Hybrid architecture (core modular monolith + payout-service + notification-service) | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-02 | Kafka, one topic per producing context, JSON Schema registry | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-03 | Shared schema with `tenant_id` | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-04 | REST, JSON, OpenAPI 3, `/v1` | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-05 | Event choreography only; one synchronous hop | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-06 | PostgreSQL, schema per module, UUIDv7, Flyway | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-07 | Keycloak, one realm, JWT at the gateway and in each deployable | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-08 | Authorization in each module; ABAC in the application and every query | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-09 | Contacts from Keycloak at send time; no PII on the bus | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-10 | Exactly-once payout effect and the retry window | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-11 | Partner ingress through the gateway with per-tenant partner keys | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |

> Note: the SDD's decision history (questionnaire, clarification register) is in its [decision-log.md](../sdd-refunds-platform/decision-log.md); this LLD adds no ADR.

## 19.3 OpenAPI Specifications

| Service | Path / URL | Notes |
|---------|------------|-------|
| `refunds-platform-core` (refund-service, loyalty-service) | `refunds-platform-core/src/main/resources/openapi/refunds-platform-core.v1.yaml` (proposed) | Source of truth for § 9 client endpoints |
| `payout-service` | `payout-service/src/main/resources/openapi/payout-service.v1.yaml` (proposed) | API-03 once CardPay's contract is supplied |
| `notification-service` | None | No business endpoint |

## 19.4 Event Schemas

| Topic | Schema location | Notes |
|-------|------------------|-------|
| `refunds-platform-refund-events` | Schema registry (product open, SDD §6); contracts in [SDD §14.9](../sdd-refunds-platform/10-events-hub.md#149-payload-contract-samples) | Six refund events |
| `refunds-platform-payout-events` | Same | Two payout events |

## 19.5 Runbooks

| Runbook | Location | Linked from |
|---------|----------|-------------|
| RB-01 Drain outbox backlog | `10-operations.md` § 13.8 | Alert `OutboxBacklog` |
| RB-02 Replay DLQ | `10-operations.md` § 13.8 | Alert `DlqNotEmpty` |
| RB-03 Consumer lag | `10-operations.md` § 13.8 | Alert `ConsumerLag` |
| RB-04 Payout failed, overdue, unmatched, or mismatched | `10-operations.md` § 13.8 | Payout alerts |
| RB-05 POS outage, secret and partner-key rotation | `10-operations.md` § 13.8 | Alert `ReceiptLookupCircuitOpen` |
| RB-06 Notification failures | `10-operations.md` § 13.8 | Alert `NotificationFailed` |
| RB-07 Loyalty ledger alerts | `10-operations.md` § 13.8 | Alerts `PointsBalanceDrift`, `TakeBackParkedStale`, `TakeBackAppliedLate` |
| RB-08 Security events | `10-operations.md` § 13.8 | Alert `SecurityEvents` |
| RB-09 Restart and availability budget | `10-operations.md` § 13.8 | Alerts `RefundsNfr02Budget`, `DbPoolSaturation` |
| SDD procedures | [SDD §20](../sdd-refunds-platform/16-operations-runbook.md#20-operations-runbook) | Templates awaiting the operations team |

## 19.6 Threat Model

| Document | Path / URL |
|----------|------------|
| Threat model | Not written (SDD §21: owner and date open); lightweight notes in `11-security.md` § 14.5 |

## 19.7 External References

| Reference | URL |
|-----------|-----|
| RFC 9457 Problem Details | https://www.rfc-editor.org/rfc/rfc9457 |
| RFC 9562 UUIDs (UUIDv7) | https://www.rfc-editor.org/rfc/rfc9562 |
| OpenTelemetry Java | https://opentelemetry.io/docs/languages/java/ |
| Resilience4j | https://resilience4j.readme.io/ |
| Flyway | https://flywaydb.org/documentation |
| Playwright test annotations and tags | https://playwright.dev/docs/test-annotations |

## 19.8 Related LLDs (sibling projects, cross-references)

| LLD | Reason for cross-reference |
|-----|----------------------------|
| None | This LLD covers every SDD §13 service; no sibling LLD exists |

## 19.9 Use-Case Traceability Index

> **Start here for a production bug.** Take the `use_case` and `screen` from the error report, log line, or span (`09-cross-cutting.md` § 12.7-12.8), or search this table for the route, screen, or test case. The row links to the workflow block, the BRD use case, the SDD §7.3 row, the test cases, and the spec.

| Use case (BRD) | Title | SDD §7.3 | LLD workflow | Screens (BRD) | Routes (LLD) | UAT/BAT test cases (BRD) | E2E specs (LLD) | Status |
|----------------|-------|----------|--------------|---------------|--------------|--------------------------|-----------------|--------|
| **[Refunds Portal v1.0](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS)** | | | | | | | | |
| [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | Request a Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-01-request-a-refund) | [REFUNDS/SCR-01](../brd-refunds-portal/11-summary-and-uiux.md#screens) | `/refunds/new` | [REFUNDS/TC-REQ-01](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-02](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-03](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-04](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-01-request-a-refund.spec.ts` | Active |
| [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) | Track Refund Status (Web and Mobile) | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-02-track-refund-status-web-and-mobile) | [REFUNDS/SCR-02](../brd-refunds-portal/11-summary-and-uiux.md#screens) | `/refunds`, `/refunds/:refundId` | [REFUNDS/TC-REQ-05](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-06](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-02-track-refund-status-web-and-mobile.spec.ts` | Active |
| [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | Cancel a Refund Request | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-03-cancel-a-refund-request) | [REFUNDS/SCR-02](../brd-refunds-portal/11-summary-and-uiux.md#screens) | `/refunds`, `/refunds/:refundId` | [REFUNDS/TC-REQ-07](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-08](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) | `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | Active |
| [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Approve / Reject Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-service](./04-implementation/refund-service.md#refundsuc-04-approve--reject-refund) | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/manager/refunds`, `/manager/refunds/:refundId` | [REFUNDS/TC-DEC-01](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-02](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-03](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-04](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-05](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | Active |
| [REFUNDS/UC-05](../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary) | Issue Partial Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | - | - | - | - | - | Merged into UC-04 |
| **[Loyalty Points v1.0](../brd-loyalty-points/loyalty-points-brd-master.md) (LOYALTY)** | | | | | | | | |
| [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | View Points Balance | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty-service](./04-implementation/loyalty-service.md#loyaltyuc-01-view-points-balance) | [LOYALTY/LP-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | `/points` | Pending (BRD 16 not written) | `e2e/loyalty-uc-01-view-points-balance.spec.ts` | Active |
| [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | View Points History | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty-service](./04-implementation/loyalty-service.md#loyaltyuc-02-view-points-history) | [LOYALTY/LP-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `/points/history`, `/points/history/:movementId` | Pending (BRD 16 not written) | `e2e/loyalty-uc-02-view-points-history.spec.ts` | Active |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 15-open-questions.md | NEXT: 17-specs.md -->
