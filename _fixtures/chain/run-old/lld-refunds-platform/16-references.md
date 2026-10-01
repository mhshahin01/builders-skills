<!--
CHUNK: 16
TITLE: References
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 19. References

## 19.1 Source Documents

| Document | Path / URL | Version | Notes |
|----------|------------|---------|-------|
| Related SDD | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) | 1.0 | Chunked; all 14 SDD open items accepted and applied; SDD chunk 19 (e2e view) locked |
| Related BRD (REFUNDS) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | 1.0 | Reached through the SDD lineage; UAT cases in [REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md) |
| Related BRD (LOYALTY) | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | 1.0 | Reached through the SDD lineage |
| SDD decision log | [decision-log.md](../sdd-refunds-platform/decision-log.md) | 1.0 | Decision history; not a design source |
| Source code repo | Not applicable | - | from-sdd (greenfield) |

## 19.2 Architectural Decision Records

The ADRs are owned by [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions); cross-linked, not restated.

| ADR ID | Title | Status | Link |
|--------|-------|--------|------|
| ADR-01 | Hybrid architecture: core with two modules, two separate services | Accepted | [SDD §10](../sdd-refunds-platform/06-principles-and-decisions.md#10-architectural-decisions) |
| ADR-02 | Kafka, one topic per producing context, JSON Schema registry | Accepted | same |
| ADR-03 | Shared schema with `tenant_id` | Accepted | same |
| ADR-04 | REST, JSON, OpenAPI 3, URI versioning | Accepted | same |
| ADR-05 | Event choreography only; one synchronous hop | Accepted | same |
| ADR-06 | PostgreSQL, schema per module, database per service, Flyway | Accepted | same |
| ADR-07 | Keycloak single realm; JWT at the gateway and in each deployable | Accepted | same |
| ADR-08 | Authorization in each module; ABAC in the application and the queries | Accepted | same |
| ADR-09 | Contact details from Keycloak at send time | Accepted | same |
| ADR-10 | Exactly-once payout effect and the retry window | Accepted | same |
| ADR-11 | Partner ingress through a gateway partner route | Accepted | same |

> Note: ADRs that affect this LLD's design - even if owned by SDD level - should be cross-linked here for traceability.

## 19.3 OpenAPI Specifications

| Service | Path / URL | Notes |
|---------|------------|-------|
| `refunds-platform-core` (refund-service, loyalty-service) | `refunds-platform-core/src/main/resources/openapi/refunds-platform-core-v1.yaml` (proposed, 06) | Source of truth for 06 § 9 client endpoints and API-06 |
| `payout-service` | `payout-service/src/main/resources/openapi/payout-service-v1.yaml` (proposed, 06) | API-03 |
| Providers (API-01, API-02, API-04, API-05) | Awaiting provider documentation ([SDD §15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)) | `TBD - external` |

## 19.4 Event Schemas

| Topic | Schema location | Notes |
|-------|------------------|-------|
| `refunds-platform-refund-events` | Schema registry (product and location open, SDD §21) | Contracts: SDD §14.9.1 to §14.9.5, §14.9.8 |
| `refunds-platform-payout-events` | Schema registry (open) | Contracts: SDD §14.9.6, §14.9.7 |

## 19.5 Runbooks

| Runbook | Location | Linked from |
|---------|----------|-------------|
| RB-01 Drain outbox backlog | `10-operations.md` § 13.8 | Alert `OutboxBacklogAge` |
| RB-02 Replay DLQ | `10-operations.md` § 13.8 | Alert `DlqNotEmpty` |
| RB-03 Rotate secrets | `10-operations.md` § 13.8 | SDD §20.1.4 |
| RB-04 Payout failed after the retry window | `10-operations.md` § 13.8 | Alerts `PayoutWindowExpired`, `PayoutOutcomeOverdue`, `PayoutReconciliationMismatch` |
| RB-05 Balance drift and late take-backs | `10-operations.md` § 13.8 | Alerts `BalanceDrift`, `TakeBackAppliedLate`, `ParkedTakeBackStale` |
| RB-06 Unmatched payout results | `10-operations.md` § 13.8 | Alert `PayoutResultsUnmatched` |
| RB-07 to RB-09 Restart, failover, tenant incident | `10-operations.md` § 13.8 | SDD §20.1.1, §20.1.5, §20.1.6 |
| SDD runbook templates | [SDD §20](../sdd-refunds-platform/16-operations-runbook.md#20-operations-runbook) | Open in the SDD |

## 19.6 Threat Model

| Document | Path / URL |
|----------|------------|
| Threat model | Not written yet (SDD §21); lightweight notes in `11-security.md` § 14.5 |

## 19.7 External References

| Reference | URL |
|-----------|-----|
| RFC 9457 Problem Details | https://www.rfc-editor.org/rfc/rfc9457 |
| OpenTelemetry Java | https://opentelemetry.io/docs/languages/java/ |
| Resilience4j docs | https://resilience4j.readme.io/ |
| Flyway docs | https://flywaydb.org/documentation |
| W3C Trace Context | https://www.w3.org/TR/trace-context/ |

## 19.8 Related LLDs (sibling projects, cross-references)

| LLD | Reason for cross-reference |
|-----|----------------------------|
| None | This is the only LLD derived from the Refunds Platform SDD. |

<!-- MASTER: lld-master.md | PREV: 15-open-questions.md | NEXT: 17-specs.md -->
