<!--
CHUNK: 00
TITLE: Cover, Changelog & Indexes
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: Pre-SDD - Refunds Platform
-->

# Refunds Platform: Pre-SDD (Pre-Solution Design)

**Project / Product Name:** Refunds Platform
**Version:** 1.0
**Mode:** full
**Gate:** G3 Approved with conditions
**Engine:** pre-sdd-engine 3.0.0, skill pre-sdd-unifier 1.0.0
**Author:** E2E Architect (pre-sdd-unifier)
**Confirmer:** Fixture: Product Owner stand-in (test-run policy); Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) for the choices it may take
**Signers:** Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27): Business sponsor, Product owner / business process owner, Lead / principal architect, Infrastructure / platform owner, Network owner, Security and privacy/compliance, Data owner, SRE / operations, Finance / procurement, Architecture review authority (Approved with conditions, 2026-10-27)
**Date:** 2026-10-27
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and the consuming SDD)

---

## Document Lineage

### Source BRDs (parents)

| Key | BRD | Version | Status | Link | Covers |
|-----|-----|---------|--------|------|--------|
| REFUNDS | Refunds Portal | 1.5 | In Review | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests, branch manager decisions, payouts to the original card, customer messages, refund outcomes to Loyalty Points |
| LOYALTY | Loyalty Points | 1.7 | In Review | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) | Points earned on branch purchases, points balance and history, points taken back after a paid refund |

Neither source BRD is `Approved`: both covers read `In Review`.

### Consuming SDD (child)

| SDD | Version | Pre-SDD version it loaded | Link |
|-----|---------|---------------------------|------|
| None yet | - | - | - |

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | 2026-10-27   | E2E Architect (pre-sdd-unifier) | Cleared-context reviewer (pre-sdd-unifier), 2026-10-27 | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27), all ten applicable roles, Approved with conditions | Initial build from REFUNDS v1.5 and LOYALTY v1.7 (both In Review). The review accept loop applied OI-01, OI-02, OI-03, OI-07, OI-08, OI-10, OI-11, OI-12 and OI-13. Chunks: none (initial build) |

---

## Indexes

### Table of Contents

| Section | Chunk |
|---------|-------|
| 1. Business Brief | [01-business-brief.md](./01-business-brief.md) |
| 2. Classification and Path | [02-classification-and-path.md](./02-classification-and-path.md) |
| 3. Requirement Register | [03a](./03a-register-business.md) to [03h](./03h-register-economics.md) |
| 4. Targets and Calculations | [04-targets-and-calculations.md](./04-targets-and-calculations.md) |
| 5. Target Shape | [05-target-shape.md](./05-target-shape.md) |
| 7. Options and Economics | [07-options-and-economics.md](./07-options-and-economics.md) |
| 9. Decisions | [09-decisions.md](./09-decisions.md) |
| 10. Validation, Risks and Unknowns | [10-validation-risks-unknowns.md](./10-validation-risks-unknowns.md) |
| 11. Gate and Sign-off | [11-gate-and-sign-off.md](./11-gate-and-sign-off.md) |
| 12. SDD Handoff Guide | [12-sdd-handoff-guide.md](./12-sdd-handoff-guide.md) |
| 13. Open Items and Clarifications | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md) |

### Register Index

| Rows | Group | Chunk |
|------|-------|-------|
| HDR-01 to HDR-10 | Project header | [01 § 1.1](./01-business-brief.md#11-project-header) |
| BUS-01 to BUS-08 | Business | [03a](./03a-register-business.md) |
| CAP-01 to CAP-12 | Capacity | [03b](./03b-register-capacity.md) |
| REL-01 to REL-10 | Reliability | [03c](./03c-register-reliability.md) |
| DAT-01 to DAT-09 | Data | [03d](./03d-register-data.md) |
| SEC-01 to SEC-08 | Security | [03e](./03e-register-security.md) |
| INT-01 to INT-09 | Integration | [03f](./03f-register-integration.md) |
| OPS-01 to OPS-08 | Operations | [03g](./03g-register-operations.md) |
| ECO-01 to ECO-06 | Economics | [03h](./03h-register-economics.md) |

### ID Index

| IDs | What | Chunk |
|-----|------|-------|
| `CALC-NN` (`CALC-21@OPT-NN`, `CALC-22@OPT-NN`) | Calculations; option TCO and weighted score | [04 § 4.2](./04-targets-and-calculations.md#42-calculations), [07 § 7.1](./07-options-and-economics.md#71-options) |
| `OPT-NN` | Options (shapes, never products) | [07 § 7.1](./07-options-and-economics.md#71-options) |
| `DT-01` to `DT-15` | Decision rules | [09 § 9.2](./09-decisions.md#92-decision-tree) |
| `ADR-<AREA>-NNN` | Pre-SDD ADRs | [09 § 9.4](./09-decisions.md#94-pre-sdd-adrs) |
| `QD-NN` | Unknowns | [10 § 10.1](./10-validation-risks-unknowns.md#101-validation-and-unknowns) |
| `G3-01` to `G3-14`, `COND-NN`, `EXC-NN` | G3 checklist, conditions, exceptions | [11 § 11.1](./11-gate-and-sign-off.md#111-gate-result) |
| `OI-NN` | Reviewer open items | [13](./13-open-items-and-clarifications.md) |

### Figures

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Infrastructure | [05 § 5.2.1](./05-target-shape.md#521-infrastructure) |
| Figure 2 | Network | [05 § 5.2.2](./05-target-shape.md#522-network) |
| Figure 3 | Disaster Recovery | [05 § 5.2.3](./05-target-shape.md#523-disaster-recovery) |
| Figure 4 | Data | [05 § 5.2.4](./05-target-shape.md#524-data) |

### Tables

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Project header (HDR-01 to HDR-10) | [01 § 1.1](./01-business-brief.md#11-project-header) |
| Table 2 | Critical journeys | [01 § 1.4](./01-business-brief.md#14-critical-journeys) |
| Table 3 | Classification | [02 § 2.1](./02-classification-and-path.md#21-classification) |
| Table 4 | Targets | [04 § 4.1](./04-targets-and-calculations.md#41-targets) |
| Table 5 | Calculations | [04 § 4.2](./04-targets-and-calculations.md#42-calculations) |
| Table 6 | Target shape | [05 § 5.1](./05-target-shape.md#51-shape) |
| Table 7 | Options | [07 § 7.1](./07-options-and-economics.md#71-options) |
| Table 8 | Decision tree | [09 § 9.2](./09-decisions.md#92-decision-tree) |
| Table 9 | Validation and unknowns | [10 § 10.1](./10-validation-risks-unknowns.md#101-validation-and-unknowns) |
| Table 10 | Gate result and sign-off register | [11 § 11.1](./11-gate-and-sign-off.md#111-gate-result) |
| Table 11 | Locked items | [12 § 12.2](./12-sdd-handoff-guide.md#122-locked-items) |

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: none | NEXT: 01-business-brief.md -->
