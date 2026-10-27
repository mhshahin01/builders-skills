<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# Refunds Platform: Solution Design Document (SDD)

**Project / Product Name:** Refunds Platform
**Version:** 1.0
**Status:** Draft
**Author:** Software Architect agent (sdd-unifier skill, Claude Code)
**Reviewers:** -
**Approvers:** -
**Date:** 2026-10-27
**Lineage:** [Document Lineage](#document-lineage) (source BRDs, source Pre-SDD, and child LLDs)

---

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| REFUNDS | Refunds Portal | 1.5 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Online refund requests for branch purchases, branch manager decisions, payouts to the original card, customer messages, the daily branch report, refund outcomes sent to Loyalty Points |
| LOYALTY | Loyalty Points | 1.7 | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points earned on branch purchases, the member's balance and history, points taken back after a paid refund |

Neither BRD is `Approved`: both covers read `In Review`, and this SDD is derived from them as they stand.

### Source Pre-SDD

| Key | Pre-SDD | Version | Gate | Link |
|-----|---------|---------|------|------|
| PSDD | Refunds Platform | 1.0 | G3 Approved with conditions | [refunds-platform-pre-sdd-master.md](../pre-sdd-refunds-platform/refunds-platform-pre-sdd-master.md) |

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| None yet | - | - | - | - | - |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-10-27 | Software Architect agent (sdd-unifier skill, Claude Code) | | | Initial draft, derived from REFUNDS v1.5 and LOYALTY v1.7 on the G3-signed Pre-SDD PSDD v1.0 via sdd-unifier. The acceptance loop applied OI-01 to OI-17, OI-18 (adjusted), OI-20 to OI-22, OI-25, OI-26, and OI-28 to OI-36; OI-19 is rejected; OI-23 and OI-24 (E2E Architect, HR-004 and HR-005) and OI-27 (product owner) are open; OI-37 and OI-38 are decided and pending application. Chunks: none (initial build) |

---

## Table of Contents

- [00 Cover, Changelog & Table of Contents](./00-cover-and-changelog.md)
- [01 Executive Summary, Scope, Assumptions, Risks & Glossary](./01-executive-summary-scope-risks.md)
- [02 Ecosystem Overview](./02-ecosystem-overview.md)
- [03 System Users & Use Cases](./03-users-and-use-cases.md)
- [04 Architecture Style, Context & HLA Diagrams](./04-architecture-style-and-diagrams.md)
- [05 Workflow & Sequence Diagrams](./05-workflows-and-sequences.md)
- [05a Infrastructure & Network Architecture](./05a-infrastructure-and-network.md)
- [06 Architecture Principles & Architectural Decisions](./06-principles-and-decisions.md)
- [07 Cross-Cutting Concerns](./07-cross-cutting-concerns.md)
- [08 Integrations](./08-integrations.md)
- [09 Services Decomposition Summary](./09-services-summary.md)
- [10 Centralized Event Hub](./10-events-hub.md)
- [11 Service Integration API Contracts](./11-api-contracts.md)
- [12 Centralized User Roles & Authorities](./12-centralized-user-roles.md)
- [13a Detailed Service Spec - Refund Request](./13a-service-refund-request.md)
- [13b Detailed Service Spec - Payout](./13b-service-payout.md)
- [13c Detailed Service Spec - Notification](./13c-service-notification.md)
- [13d Detailed Service Spec - Loyalty Points](./13d-service-loyalty-points.md)
- [14 Performance & Capacity Planning](./14-performance-and-capacity.md)
- [15 Environments](./15-environments.md)
- [16 Operations Runbook](./16-operations-runbook.md)
- [17 Appendix & Wishlist](./17-appendix-and-wishlist.md)
- [18 Open Items & Clarifications](./18-open-items-and-clarifications.md)
- 19 End-to-End System Design: Locked (the e2e gate is shut: [master](./refunds-platform-sdd-master.md#generation-progress))

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use Case Diagram | [03 § 7.2](./03-users-and-use-cases.md#72-use-case-diagram) |
| Figure 2 | System Context Diagram | [04 § 8.2](./04-architecture-style-and-diagrams.md#82-context-diagram) |
| Figure 3 | High-Level Architecture | [04 § 8.3](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram) |
| Figure 4 | Infrastructure Deployment | [05a § 8.6.6](./05a-infrastructure-and-network.md#866-deployment-diagram) |
| Figure 5 | Network Architecture | [05a § 8.7.8](./05a-infrastructure-and-network.md#878-network-diagram) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Source BRDs, Source Pre-SDD, Child LLDs | [00 § Document Lineage](#document-lineage) |
| Table 2 | Risks | [01 § 4](./01-executive-summary-scope-risks.md#4-risks) |
| Table 3 | Ecosystem Overview | [02 § 6](./02-ecosystem-overview.md#6-ecosystem-overview) |
| Table 4 | Actors | [03 § 7.1](./03-users-and-use-cases.md#71-actors) |
| Table 5 | Use Case Traceability | [03 § 7.3](./03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) |
| Table 6 | Backup and Disaster Recovery | [05a § 8.6.4](./05a-infrastructure-and-network.md#864-backup-and-disaster-recovery) |
| Table 7 | Architectural Decisions | [06 § 10](./06-principles-and-decisions.md#10-architectural-decisions) |
| Table 8 | Integrations | [08 § 12](./08-integrations.md#12-integrations) |
| Table 9 | Services Decomposition | [09 § 13](./09-services-summary.md#13-services-decomposition-summary) |
| Table 10 | In-Process Domain Events | [10 § 14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) |
| Table 11 | Contract Index | [11 § 15.2](./11-api-contracts.md#152-contract-index) |
| Table 12 | Permission × Role Matrix | [12 § 16.11](./12-centralized-user-roles.md#1611-permission--role-matrix-platform-wide) |
| Table 13 | NFR Targets | [14 § 18.5](./14-performance-and-capacity.md#185-nfr-targets) |
| Table 14 | Environments | [15 § 19](./15-environments.md#19-environments) |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: none | NEXT: 01-executive-summary-scope-risks.md -->
