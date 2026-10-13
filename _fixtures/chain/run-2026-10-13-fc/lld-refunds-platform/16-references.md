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
| Related BRD (REFUNDS) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | 1.5 | Key from the SDD's Source BRDs register |
| Related BRD (LOYALTY) | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | 1.7 | Key from the SDD's Source BRDs register |
| Related SDD | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) | 1.4 | E2E gate (chunk 19) `Locked` (E3 not met: 23 blocking markers); chunk 19 not written |
| SDD §7.3 Use Case Traceability | [03-users-and-use-cases.md § 7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | SDD v1.4 | Owners and entry points of the traced use cases |
| REFUNDS UAT/BAT test cases (BRD chunk 16) | Not written | Pending (BRD 16 not written) | Delivery gate shut (`Locked`); the v1.0 test cases kept in REFUNDS 12 Appendix are reference files, not chunk 16 |
| LOYALTY UAT/BAT test cases (BRD chunk 16) | Not written | Pending (BRD 16 not written) | Delivery gate shut (`Locked`) |
| REFUNDS Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-refunds-portal/14-todo.md#mockup-coverage) | as of BRD v1.5 | REFUNDS/MK-01 (REFUNDS/UC-01), REFUNDS/MK-02 (REFUNDS/UC-02, REFUNDS/UC-03), REFUNDS/MK-03 (REFUNDS/UC-04), all `In progress`; REFUNDS/MK-04 (no use case: REFUNDS 09 branch refund report), `Pending gate` |
| LOYALTY Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-loyalty-points/14-todo.md#mockup-coverage) | as of BRD v1.7 | LOYALTY/MK-01 (LOYALTY/UC-01), LOYALTY/MK-02 (LOYALTY/UC-02); both `Blocked` |
| Source code repo | Not applicable | - | from-sdd: no code yet |

## 19.2 Architectural Decision Records

| ADR ID | Title | Status | Link |
|--------|-------|--------|------|
| ADR-01 | Modular monolith, four modules | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-02 | No broker; durable in-process events; queued provider work | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-03 | Shared schema with `tenant_id` | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-04 | REST, OpenAPI 3, `/v1`, RFC 9457 | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-05 | Events for state changes; ports for queries, one hop | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-06 | PostgreSQL 17+, one schema and one role per module | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-07 | Keycloak, OIDC with PKCE | Proposed | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-08 | Authorization enforcement (code map, adapters check tokens) | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-09 | One image, managed container service, rolling | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-10 | Flyway, Resilience4j, OpenTelemetry | Proposed | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-11 | Angular 17+ web app | Proposed | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-12 | Publication log in the deployable; ArchUnit; Testcontainers | Proposed | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |

> Note: the LLD links the ADRs and does not restate them.

## 19.3 OpenAPI Specifications

| Service | Path / URL | Notes |
|---------|------------|-------|
| `refunds-platform-app` (all modules) | `refunds-platform-app/src/main/resources/openapi/refunds-platform.yaml` (spec-first; not created yet) | One document for the deployable (SDD ADR-04, [§21](../sdd-refunds-platform/17-appendix-and-wishlist.md#21-appendix)) |

## 19.4 Event Schemas

| Topic | Schema location | Notes |
|-------|------------------|-------|
| (no topics) | Event DTO records in `refundsplatform.refundrequest.api` and `refundsplatform.payout.api` | In-process events (`07-event-contracts.md` § 10.6); fields as committed by SDD [§14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) (the complete DTOs of this release; a new field is an additive change, SDD AP-10) |

## 19.5 Runbooks

| Runbook | Location | Linked from |
|---------|----------|-------------|
| RB-01 Re-drive an incomplete listener | `10-operations.md` § 13.8; SDD [§20.1.3](../sdd-refunds-platform/16-operations-runbook.md#2013-replay-dlq-messages) | Alerts `PublicationListenerLag`, `LeaseExpiredTwice` |
| RB-02 Resolve an Unknown or Stopped payout | `10-operations.md` § 13.8; SDD [§20.1.7](../sdd-refunds-platform/16-operations-runbook.md#2017-resolve-a-stopped-payout) | Alerts `PayoutStopped`, `PayoutUnknown`, `PayoutDisputeRefundedUnresolved`, `PayoutSucceededAfterStop`, `ResolutionNotApplicable` |
| RB-04 Re-drive failed messages | `10-operations.md` § 13.8; SDD [§20.1.3](../sdd-refunds-platform/16-operations-runbook.md#2013-replay-dlq-messages) | Message status `FAILED` |
| RB-03 Rotate a provider or IAM secret | `10-operations.md` § 13.8; SDD [§20.1.4](../sdd-refunds-platform/16-operations-runbook.md#2014-rotate-secrets) | Alert `MsgHubAuthFailed` |
| RB-05 Switch on a product or start more branches | `10-operations.md` § 13.8; SDD [§20.1.8](../sdd-refunds-platform/16-operations-runbook.md#2018-switch-on-a-product-or-start-more-branches) | Planned change (no alert) |

## 19.6 Threat Model

| Document | Path / URL |
|----------|------------|
| Threat model | Not written (SDD §21 Threat Model: not created yet); lightweight notes in `11-security.md` § 14.5 |

## 19.7 External References

| Reference | URL |
|-----------|-----|
| RFC 9457 Problem Details | https://www.rfc-editor.org/rfc/rfc9457 |
| RFC 9562 UUIDs (version 7 and version 5) | https://www.rfc-editor.org/rfc/rfc9562 |
| OpenTelemetry Java | https://opentelemetry.io/docs/languages/java/ |
| Resilience4j | https://resilience4j.readme.io/ |
| Flyway | https://flywaydb.org/documentation |
| W3C Trace Context | https://www.w3.org/TR/trace-context/ |

## 19.8 Related LLDs (sibling projects, cross-references)

| LLD | Reason for cross-reference |
|-----|----------------------------|
| None | This LLD covers every SDD §13 module |

## 19.9 Use-Case Traceability Index

> **Start here for a production bug.** Take the `use_case` and `screen` from the error report, log line, or span (`09-cross-cutting.md` § 12.7-12.8), or search this table for the route, screen, or test case. The row links to the workflow block, the BRD use case, the SDD §7.3 row, the test cases, and the spec.

| Use case (BRD) | Title | SDD §7.3 | LLD workflow | Screens (BRD) | Routes (LLD) | UAT/BAT test cases (BRD) | E2E specs (LLD) | Status |
|----------------|-------|----------|--------------|---------------|--------------|--------------------------|-----------------|--------|
| **[Refunds Portal v1.5](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS)** | | | | | | | | |
| [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | Request a Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-request](./04-implementation/refund-request.md#refundsuc-01-request-a-refund) | [REFUNDS/MK-01](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/refunds/new` | Pending (BRD 16 not written) | `e2e/refunds-uc-01-request-a-refund.spec.ts` | Active |
| [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status) | Track Refund Status | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-request](./04-implementation/refund-request.md#refundsuc-02-track-refund-status) | [REFUNDS/MK-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/refunds`, `/refunds/:refundRequestId` | Pending (BRD 16 not written) | `e2e/refunds-uc-02-track-refund-status.spec.ts` | Active |
| [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | Cancel a Refund Request | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-request](./04-implementation/refund-request.md#refundsuc-03-cancel-a-refund-request) | [REFUNDS/MK-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | `/refunds`, `/refunds/:refundRequestId` | Pending (BRD 16 not written) | `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | Active |
| [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Approve / Reject Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [refund-request](./04-implementation/refund-request.md#refundsuc-04-approve--reject-refund) | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) (state E1 by email, see 14 § 17.3) | `/manager/refund-requests`, `/manager/refund-requests/:refundRequestId` | Pending (BRD 16 not written) | `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | Active |
| [REFUNDS/UC-05](../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary) | Issue Partial Refund | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | - | - | - | - | - | Merged into REFUNDS/UC-04 |
| **[Loyalty Points v1.7](../brd-loyalty-points/loyalty-points-brd-master.md) (LOYALTY)** | | | | | | | | |
| [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | View Points Balance | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty-points](./04-implementation/loyalty-points.md#loyaltyuc-01-view-points-balance) | [LOYALTY/MK-01](../brd-loyalty-points/14-todo.md#mockup-coverage) | `/points` | Pending (BRD 16 not written) | `e2e/loyalty-uc-01-view-points-balance.spec.ts` | Active |
| [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | View Points History | [§7.3](../sdd-refunds-platform/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [loyalty-points](./04-implementation/loyalty-points.md#loyaltyuc-02-view-points-history) | [LOYALTY/MK-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | `/points/history`, `/points/history/:movementId` | Pending (BRD 16 not written) | `e2e/loyalty-uc-02-view-points-history.spec.ts` | Active |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 15-open-questions.md | NEXT: 17-specs.md -->
