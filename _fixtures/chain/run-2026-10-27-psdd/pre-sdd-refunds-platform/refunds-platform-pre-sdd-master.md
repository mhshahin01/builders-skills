<!--
TYPE: Master Index
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: Pre-SDD - Refunds Platform
PURPOSE: Navigation for people and agents, and the run's progress record. Load this file first, then follow the links to the chunks you need. sdd-unifier reads chunk 12 first, then this file's gate line, then chunk 11.
VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and chunk 00 carry the current Pre-SDD version; every other chunk carries the version in which its content last changed.
MAINTENANCE: Written at setup (SKILL.md step 5), right after `cli.mjs new`, with stage 1 as the next stage. The progress table, the Next line, and the gate line are updated after every answered batch, every save, and every stop, so a run stopped mid-stage or at a review stop resumes from here. The index rows are added as the chunks are written; an omitted chunk has no row.
-->

# Pre-SDD Master Index - Refunds Platform

> **How to use:** This file is the entry point for the Pre-SDD (pre-solution design) of Refunds Platform. Each row below links a chunk. Links are relative to this folder.

> **Lineage:** the source BRDs, each with its key, version, and status, and the consuming SDD are in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference carries its BRD key (`REFUNDS/NFR-03`).

> **Decision history:** [decision-log.md](./decision-log.md) holds the answers, the proposals taken, who decided and when, the delegations, and the sign-off record. The chunks state only the settled values and shape.

> **Project state:** [studio/project-state.json](./studio/project-state.json) is the project state of record; every number in the chunks comes from the engine's output for it (`studio/model.json`, `studio/fragments/`).

---

## Generation Progress

**Generation:** full
**Source BRDs:** REFUNDS v1.5 (In Review); LOYALTY v1.7 (In Review)
**Gate:** G3 Approved with conditions - G3: Approved with conditions - SDD authorized: Yes
**Next:** nothing: handed off (HR-006 to the Software Architect, Later)

| Stage | Status | Group | Gate | Write-up | Review | Handoff |
|-------|--------|-------|------|----------|--------|---------|
| 1. Discovery | Done | HDR-07, HDR-08, BUS-05, CAP-01, CAP-03, CAP-04, CAP-07, REL-01, REL-03, REL-04, REL-05, DAT-02, ECO-01 | - | - | - | - |
| 2. Register | Done | HDR, BUS, SEC, DAT, INT, CAP, REL, OPS, ECO | G1 Met | - | G1 review stop: passed 2026-10-27 by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | - |
| 3. Assess | Done | - | G2 shortlist | - | G2 review stop: passed 2026-10-27 by Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | - |
| 4. Confirm and decide | Done | - | G3 Approved with conditions | Chunks written at v1.0, 2026-10-27 | Review passes 2 of 3; open items: 1 Open (OI-06), 2 Decided - pending application (OI-04, OI-09), 9 Accepted - applied, 1 Rejected (OI-05) | HR-006 to the Software Architect: Later |

---

## Front Matter

| Section | Chunk |
|---------|-------|
| Title block, version, mode, gate, engine version, signers | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Document Lineage (source BRDs with keys, consuming SDD) | [00-cover-and-changelog.md](./00-cover-and-changelog.md#document-lineage) |
| Changes Log | [00-cover-and-changelog.md](./00-cover-and-changelog.md#changes-log) |
| Indexes (contents, register, IDs, figures, tables) | [00-cover-and-changelog.md](./00-cover-and-changelog.md#indexes) |

## Business and Classification

| Section | Chunk |
|---------|-------|
| 1.1 Project Header (HDR-01 to HDR-10) | [01-business-brief.md](./01-business-brief.md#11-project-header) |
| 1.2 to 1.5 Outcome, scope, critical journeys, business constraints | [01-business-brief.md](./01-business-brief.md) |
| 2. Classification, path evidence, hybrid boundary, overlay, closest worked example | [02-classification-and-path.md](./02-classification-and-path.md) |

## Requirement Register

| Section | Chunk |
|---------|-------|
| How to read the register | [03a-register-business.md](./03a-register-business.md#how-to-read-the-register) |
| 3.1 Business (BUS-01 to BUS-08) | [03a-register-business.md](./03a-register-business.md) |
| 3.2 Capacity (CAP-01 to CAP-12) | [03b-register-capacity.md](./03b-register-capacity.md) |
| 3.3 Reliability (REL-01 to REL-10) | [03c-register-reliability.md](./03c-register-reliability.md) |
| 3.4 Data (DAT-01 to DAT-09) | [03d-register-data.md](./03d-register-data.md) |
| 3.5 Security (SEC-01 to SEC-08) | [03e-register-security.md](./03e-register-security.md) |
| 3.6 Integration (INT-01 to INT-09) | [03f-register-integration.md](./03f-register-integration.md) |
| 3.7 Operations (OPS-01 to OPS-08) | [03g-register-operations.md](./03g-register-operations.md) |
| 3.8 Economics (ECO-01 to ECO-06) | [03h-register-economics.md](./03h-register-economics.md) |

## Assessment

| Section | Chunk |
|---------|-------|
| 4. Targets and calculations (CALC-01 to CALC-20) | [04-targets-and-calculations.md](./04-targets-and-calculations.md) |
| 5. Target shape, DR strategy per failure scope, diagrams | [05-target-shape.md](./05-target-shape.md) |
| 7. Options and economics (OPT-NN, CALC-21, CALC-22) | [07-options-and-economics.md](./07-options-and-economics.md) |

## Decisions, Validation and Gate

| Section | Chunk |
|---------|-------|
| 9. Requirement-to-consequence trace, decision tree (DT-01 to DT-15), rule trace, Pre-SDD ADRs | [09-decisions.md](./09-decisions.md) |
| 10. Validation, risks, unknowns (QD-NN), open hard entries | [10-validation-risks-unknowns.md](./10-validation-risks-unknowns.md) |
| 11. Gates G0 to G3, G3 checklist, sign-off register, conditions, exceptions, SDD initiation | [11-gate-and-sign-off.md](./11-gate-and-sign-off.md) |

## Handoff and Review

| Section | Chunk |
|---------|-------|
| 12. SDD handoff guide (the contract sdd-unifier reads first) | [12-sdd-handoff-guide.md](./12-sdd-handoff-guide.md) |
| 13. Open items and clarifications (OI-NN) | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md) |

> Chunk 13 is written after the body by a cleared-context reviewer, before the G3 stop. Every item carries a **Recommended Answer** with its **Why**; the skill walks the user through each item for acceptance (an answer policy accepts the recommendations it may).

---

## Chunk Dependency Graph

```
refunds-platform-pre-sdd-master.md (you are here)
|
+-- 00-cover-and-changelog.md ............ title, lineage (source BRDs, consuming SDD), gate, engine, changes, indexes
+-- 01-business-brief.md ................. project header (HDR rows), outcome, scope, journeys, business constraints
+-- 02-classification-and-path.md ........ path code, hybrid, overlay, recovery tier, path evidence
+-- 03a-03h register chunks .............. the 70 items, one chunk per group
+-- 04-targets-and-calculations.md ....... targets and every CALC-NN
+-- 05-target-shape.md ................... hosting, topology, DR per scope, data, network, diagrams
+-- 07-options-and-economics.md .......... options, hard-constraint filter, weights, TCO
+-- 09-decisions.md ...................... trace, decision tree, rule trace, Pre-SDD ADRs
+-- 10-validation-risks-unknowns.md ...... blockers, conflicts, advisories, risks, unknowns
+-- 11-gate-and-sign-off.md .............. G0 to G3, checklist, sign-offs, conditions, exceptions
+-- 12-sdd-handoff-guide.md .............. the contract for sdd-unifier: locked items and where they land
+-- 13-open-items-and-clarifications.md .. reviewer findings with recommended answers
+-- decision-log.md ...................... companion: decision history (never merged)
+-- studio/ .............................. project state, Studio, compute output (fragments, diagrams, blueprint)
```

### Reading Order by Task

| Task | Start With | Then |
|------|-----------|------|
| Load the Pre-SDD into an SDD (sdd-unifier) | 12 | this file's gate line, 11 |
| Check whether the SDD may start | this file's gate line | 11 § 11.1, 12 § 12.1 |
| Understand the system's targets | 04 | 03b, 03c, 05 |
| Review the shape and its conflicts | 05 | 10, 09 |
| Compare options and cost | 07 | 03h, 04 |
| Find who owns an open question | 10 | 03a-03h (the entry's owner and due date) |
| Sign G3 | 11 | 10, 12, 13 |
| Triage reviewer findings | 13 | the chunks each item names |
| Answer an SDD open item on a locked item | 12 § 12.6 | the item's register row, 09 |

### Cross-Document Navigation (BRD -> Pre-SDD -> SDD)

| BRD Chunk | Pre-SDD Chunk(s) | Relationship |
|-----------|------------------|--------------|
| [REFUNDS 01 - Executive Summary](../brd-refunds-portal/01-executive-summary-and-context.md) | [01 - Business Brief](./01-business-brief.md) | The BRD states the business problem; the Pre-SDD cites it as BUS-01 |
| [LOYALTY 01 - Executive Summary](../brd-loyalty-points/01-executive-summary-and-context.md) | [01 - Business Brief](./01-business-brief.md) | The BRD states the business problem; the Pre-SDD cites it as BUS-01 |
| [REFUNDS 04 - Scope & Personas](../brd-refunds-portal/04-scope-and-personas.md) | [01 - Business Brief](./01-business-brief.md), [03a](./03a-register-business.md) | Scope and personas pre-fill BUS-02, BUS-03, BUS-06 |
| [LOYALTY 04 - Scope & Personas](../brd-loyalty-points/04-scope-and-personas.md) | [01 - Business Brief](./01-business-brief.md), [03a](./03a-register-business.md) | Scope and personas pre-fill BUS-02, BUS-03, BUS-06 |
| [REFUNDS 08 - Integrations](../brd-refunds-portal/08-integrations.md) | [03f - Integration](./03f-register-integration.md) | Partners and purpose pre-fill the INT rows |
| [LOYALTY 08 - Integrations](../brd-loyalty-points/08-integrations.md) | [03f - Integration](./03f-register-integration.md) | Partners and purpose pre-fill the INT rows |
| [REFUNDS 10 - NFRs](../brd-refunds-portal/10-nfrs.md) | [03b](./03b-register-capacity.md), [03c](./03c-register-reliability.md), [04](./04-targets-and-calculations.md) | Business expectations become settled targets and calculations |
| [LOYALTY 10 - NFRs](../brd-loyalty-points/10-nfrs.md) | [03b](./03b-register-capacity.md), [03c](./03c-register-reliability.md), [04](./04-targets-and-calculations.md) | Business expectations become settled targets and calculations |
| [REFUNDS 12 - Technical Inputs for the SDD](../brd-refunds-portal/12-appendix-and-wishlist.md) | [02](./02-classification-and-path.md), [03d](./03d-register-data.md) | Technical mandates pre-fill the register for shape only (DAT-01.1 store kind) |

<!-- MASTER INDEX | Pre-SDD - Refunds Platform -->
