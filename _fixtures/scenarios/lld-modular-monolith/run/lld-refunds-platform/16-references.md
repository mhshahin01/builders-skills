<!--
CHUNK: 16
TITLE: References
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 19. References

## 19.1 Source Documents

| Document | Path / URL | Version / state | Notes |
|----------|------------|-----------------|-------|
| Related BRD (REFUNDS) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | 1.0 (Approved) | Key from the SDD's Source BRDs register |
| Related BRD (LOYALTY) | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | 1.0 (Approved) | Key from the SDD's Source BRDs register |
| Related SDD | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) | 1.1 (Draft) | Generation whole; e2e gate (chunk 19) Locked with 31 clarification markers; the version SKILL.md step 3c compares on the next run |
| SDD §7.3 Use Case Traceability | [03-users-and-use-cases.md § 7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | SDD v1.1 | 7 rows: 6 Active, 1 Merged (REFUNDS/UC-05) |
| REFUNDS UAT/BAT test cases (BRD chunk 16) | [16-uat-bat-test-cases.md](../brd-refunds-portal/16-uat-bat-test-cases.md) | Up to date | 16 cases; Traceability Matrix agrees with each case's `Related UC` |
| LOYALTY UAT/BAT test cases (BRD chunk 16) | Not written | Pending (BRD 16 not written) | Locked: the LOYALTY delivery gate is shut (grill step not started) |
| REFUNDS Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-refunds-portal/14-todo.md#mockup-coverage) | as of BRD v1.0 | Rows REFUNDS/SCR-01, REFUNDS/SCR-02, REFUNDS/MK-03, all Approved, with Figma links |
| LOYALTY Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-loyalty-points/14-todo.md#mockup-coverage) | as of BRD v1.0 | Rows LOYALTY/LP-01, LOYALTY/LP-02, In review, not playable |
| Source code repo | Not applicable (from-sdd) | - | (from-code / hybrid) |

## 19.2 Architectural Decision Records

| ADR ID | Title | Status | Link |
|--------|-------|--------|------|
| ADR-01 | Modular monolith, four modules | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-02 | No message broker; in-process events from a durable publication log | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-03 | Shared schema with `tenant_id` | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-04 | REST, OpenAPI per module, `/v1` | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-05 | One port call (API-01), events for every other interaction | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-06 | PostgreSQL 17+, schema per module, Flyway per module | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-07 | Keycloak, one realm, OIDC with PKCE | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-08 | Authorization enforcement split | Proposed | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-09 | Provider writes through dispatch tables | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |

> Note: ADRs that affect this LLD's design - even if owned by SDD level - should be cross-linked here for traceability.

## 19.3 OpenAPI Specifications

| Service | Path / URL | Notes |
|---------|------------|-------|
| `refund` | `src/main/resources/openapi/refund-v1.yaml` (planned) | Source of truth for §9 API Contracts; path open in SDD §21 (06 TODO) |
| `loyalty` | `src/main/resources/openapi/loyalty-v1.yaml` (planned) | Same |

## 19.4 Event Schemas

| Topic | Schema location | Notes |
|-------|------------------|-------|
| None (no broker) | In-process DTO records in `refund.api` and `payout.api`; registry view [SDD §14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `07-event-contracts.md` § 10.6 |

## 19.5 Runbooks

| Runbook | Location | Linked from |
|---------|----------|-------------|
| RB-01 Payouts not turning Paid | `10-operations.md` § 13.8 | Alert `PayoutNotTerminal` |
| RB-02 Stuck or poison event publications | `10-operations.md` § 13.8 | Alerts `EventPublicationLag`, `EventPublicationStuck`, `TakeBackLag`, `RefundPoisonEvent` |
| RB-03 Message backlog | `10-operations.md` § 13.8 | Alert `MessageBacklog` |
| RB-04 POS records unavailable | `10-operations.md` § 13.8 | Alerts `PosLookupDown`, `AvailabilitySLO` |
| RB-05 Payout Failed or Unknown | `10-operations.md` § 13.8 | Alerts `PayoutFailedOrUnknown`, `PayoutReconciliationMismatch` |
| RB-06 Balance mismatch | `10-operations.md` § 13.8 | Alert `BalanceMismatch` |
| SDD procedures | [SDD §20](../sdd-refunds-platform/16-operations-runbook.md#20-operations-runbook) | Mostly open in the SDD |

## 19.6 Threat Model

| Document | Path / URL |
|----------|------------|
| Threat model | Not yet written ([SDD §21](../sdd-refunds-platform/17-appendix-and-wishlist.md#21-appendix)); lightweight notes in `11-security.md` § 14.5 |

## 19.7 External References

| Reference | URL |
|-----------|-----|
| RFC 9457 ProblemDetails | https://www.rfc-editor.org/rfc/rfc9457 |
| OpenTelemetry Java SDK | https://opentelemetry.io/docs/languages/java/ |
| Resilience4j docs | https://resilience4j.readme.io/ |
| Flyway docs | https://flywaydb.org/documentation |
| Spring Modulith reference | https://docs.spring.io/spring-modulith/reference/ |

## 19.8 Related LLDs (sibling projects, cross-references)

| LLD | Reason for cross-reference |
|-----|----------------------------|
| None | This LLD covers all four SDD §13 modules; the SDD's Child LLDs table listed no other LLD |

## 19.9 Use-Case Traceability Index

> **Start here for a production bug.** Take the `use_case` and `screen` from the error report, log line, or span (`09-cross-cutting.md` § 12.7-12.8), or search this table for the route, screen, or test case. The row links to the workflow block, the BRD use case, the SDD §7.3 row, the test cases, and the spec.

| Use case (BRD) | Title | SDD §7.3 | LLD workflow | Screens (BRD) | Routes (LLD) | UAT/BAT test cases (BRD) | E2E specs (LLD) | Status |
|----------------|-------|----------|--------------|---------------|--------------|--------------------------|-----------------|--------|
| **[Refunds Portal v1.0](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS)** | | | | | | | | |
| [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | Request a Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund](./04-implementation/refund.md#refundsuc-01-request-a-refund) | [REFUNDS/SCR-01](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/refunds/new` | [REFUNDS/TC-REQ-01](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-02](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-03](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-04](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-01-request-a-refund.spec.ts` | Active |
| [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) | Track Refund Status (Web and Mobile) | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund](./04-implementation/refund.md#refundsuc-02-track-refund-status-web-and-mobile) | [REFUNDS/SCR-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/refunds`, `/refunds/:refundId` | [REFUNDS/TC-REQ-05](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-06](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-02-track-refund-status-web-and-mobile.spec.ts` | Active |
| [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | Cancel a Refund Request | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund](./04-implementation/refund.md#refundsuc-03-cancel-a-refund-request) | [REFUNDS/SCR-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/refunds`, `/refunds/:refundId` | [REFUNDS/TC-REQ-07](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-08](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) | `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | Active |
| [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Approve / Reject Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund](./04-implementation/refund.md#refundsuc-04-approve--reject-refund) | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/manager/refunds`, `/manager/refunds/:refundId` | [REFUNDS/TC-DEC-01](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-02](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-03](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-04](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-05](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | Active |
| [REFUNDS/UC-05](../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary) | Issue Partial Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | - | - | - | - | - | Merged into REFUNDS/UC-04 |
| **[Loyalty Points v1.0](../brd-loyalty-points/loyalty-points-brd-master.md) (LOYALTY)** | | | | | | | | |
| [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | View Points Balance | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty](./04-implementation/loyalty.md#loyaltyuc-01-view-points-balance) | [LOYALTY/LP-01](../brd-loyalty-points/14-todo.md#mockup-coverage) | `/points` | Pending (BRD 16 not written) | `e2e/loyalty-uc-01-view-points-balance.spec.ts` | Active |
| [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | View Points History | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty](./04-implementation/loyalty.md#loyaltyuc-02-view-points-history) | [LOYALTY/LP-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | `/points/history`, `/points/history/:movementId` | Pending (BRD 16 not written) | `e2e/loyalty-uc-02-view-points-history.spec.ts` | Active |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 15-open-questions.md | NEXT: 17-specs.md -->
