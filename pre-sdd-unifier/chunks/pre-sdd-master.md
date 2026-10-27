<!--
TYPE: Master Index
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: Pre-SDD - [Project Name]
PURPOSE: Navigation for people and agents, and the run's progress record. Load this file first, then follow the links to the chunks you need. sdd-unifier reads chunk 12 first, then this file's gate line, then chunk 11.
VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and chunk 00 carry the current Pre-SDD version; every other chunk carries the version in which its content last changed.
MAINTENANCE: Written at setup (SKILL.md step 5), right after `cli.mjs new`, with stage 1 as the next stage. The progress table, the Next line, and the gate line are updated after every answered batch, every save, and every stop, so a run stopped mid-stage or at a review stop resumes from here. The index rows are added as the chunks are written; an omitted chunk has no row.
-->

# Pre-SDD Master Index - [Project Name]

> **How to use:** This file is the entry point for the Pre-SDD (pre-solution design) of [Project Name]. Each row below links a chunk. Links are relative to this folder.

> **Lineage:** the source BRDs, each with its key, version, and status, and the consuming SDD are in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage). Every BRD reference carries its BRD key (`REFUNDS/NFR-03`).

> **Decision history:** [decision-log.md](./decision-log.md) holds the answers, the proposals taken, who decided and when, the delegations, and the sign-off record. The chunks state only the settled values and shape. (Link it once the register exists; it is created on first use and never merged.)

> **Project state:** [studio/project-state.json](./studio/project-state.json) is the project state of record; every number in the chunks comes from the engine's output for it (`studio/model.json`, `studio/fragments/`).

---

## Generation Progress

<!-- Resume reads this section (SKILL.md step 1). Generation: the mode (full or quick), plus light when set; a resume keeps it, and only the set-run op changes it, by a person or a fixture owner. Source BRDs: the system's BRDs with their keys and versions, so a resume can match this Pre-SDD to its system. Gate: the engine's gate label (Discovery in quick mode; otherwise a new Pre-SDD reads Draft until G0 is met, ahead of Blocked, even while G3 reads Blocked), the G3 status, and whether the SDD may start, copied from the engine's gate result (derive prints it; compute writes it to model.json), never from memory. Next: the stage and group the run continues with (the set-run pointer in the project state names the same), and what the run waits for. -->

**Generation:** [full | quick][, light]
**Source BRDs:** [KEY] v[X.X] ([status]) [one per BRD]
**Gate:** [Draft | G0 | G1 | G2 | Blocked | G3 Approved | G3 Approved with conditions | Discovery] - G3: [Not signed | Blocked | Review | Approved | Approved with conditions] - SDD authorized: [Yes | No]
**Next:** stage [N], group [GROUP] - [waiting for: the user's answers | "continue" at the G1 review stop | "continue" at the G2 review stop | the signers at the G3 stop | nothing: handed off]

<!-- One row per stage. Status: Pending, In progress, Waiting (at a review or sign-off stop), or Done. Group: the group in hand or next, in the stage 2 order HDR, BUS, SEC, DAT, INT, CAP, REL, OPS, ECO (OVL in stage 3 while the overlay applies). Gate: the engine's result for the stage's gate. Write-up: which chunks were written, at which version. Review: the review stop's state, and in stage 4 the review passes (N of 3; N of 2 in a light run) and the open items still Open. Handoff: the handoff request and its state. A quick Pre-SDD fills only the stage 1 row (its gate reads Discovery, and its Handoff cell gives the board row Done v1.0, with no request to the Software Architect); the other rows read "Not in quick mode". -->

| Stage | Status | Group | Gate | Write-up | Review | Handoff |
|-------|--------|-------|------|----------|--------|---------|
| 1. Discovery | [Pending / In progress / Done] | [stage 1 rows, or the batch in hand] | [Full: -; quick: Discovery] | [Quick: chunks 00, 01, 02, 03a-03h, 10 at v1.0; full: -] | - | [Quick: board row Done v1.0; full: -] |
| 2. Register | [Pending / In progress / Waiting / Done] | [HDR, BUS, SEC, DAT, INT, CAP, REL, OPS, ECO: the group in hand] | G1 [Met / Not met] | - | [G1 review stop: waiting / passed YYYY-MM-DD by the person or the policy label] | - |
| 3. Assess | [Pending / In progress / Waiting / Done] | [OVL while the overlay applies, or -] | G2 [shortlist / blocker / incomplete] | - | [G2 review stop: waiting / passed YYYY-MM-DD by the person or the policy label] | - |
| 4. Confirm and decide | [Pending / In progress / Waiting / Done] | [the group whose confirm is in hand, or -] | G3 [Not signed / Blocked / Review / Approved / Approved with conditions] | [Chunks written at vX.Y, YYYY-MM-DD] | [Review passes N of 3; open items: N Open] | [HR-NNN to the Software Architect: Open / Accepted / Done; or "Not raised: G3 not signed"] |

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
| 6. Existing estate (brownfield or mixed) | [06-existing-estate.md](./06-existing-estate.md) |
| 7. Options and economics (OPT-NN, CALC-21, CALC-22) | [07-options-and-economics.md](./07-options-and-economics.md) |
| 8. Migration overlay (OVL-01 to OVL-12 per workload; only when it applies) | [08-migration-overlay.md](./08-migration-overlay.md) |

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
[slug]-pre-sdd-master.md (you are here)
|
+-- 00-cover-and-changelog.md ............ title, lineage (source BRDs, consuming SDD), gate, engine, changes, indexes
+-- 01-business-brief.md ................. project header (HDR rows), outcome, scope, journeys, business constraints
+-- 02-classification-and-path.md ........ path code, hybrid, overlay, recovery tier, path evidence
+-- 03a-03h register chunks .............. the 70 items, one chunk per group
+-- 04-targets-and-calculations.md ....... targets and every CALC-NN
+-- 05-target-shape.md ................... hosting, topology, DR per scope, data, network, diagrams
+-- 06-existing-estate.md ................ brownfield or mixed
+-- 07-options-and-economics.md .......... options, hard-constraint filter, weights, TCO
+-- 08-migration-overlay.md .............. overlay only: 7R per workload, cutover, transfer math
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
| Plan a migration | 08 | 02, 06 |
| Find who owns an open question | 10 | 03a-03h (the entry's owner and due date) |
| Sign G3 | 11 | 10, 12, 13 |
| Triage reviewer findings | 13 | the chunks each item names |
| Answer an SDD open item on a locked item | 12 § 12.6 | the item's register row, 09 |

### Cross-Document Navigation (BRD -> Pre-SDD -> SDD)

<!-- One set of rows per source BRD, with the BRD's real file names and its key in the link text. The SDD rows are added once a consuming SDD exists (chunk 00). -->

| BRD Chunk | Pre-SDD Chunk(s) | Relationship |
|-----------|------------------|--------------|
| [[KEY] 01 - Executive Summary](../brd-[brd-slug]/01-executive-summary-and-context.md) | [01 - Business Brief](./01-business-brief.md) | The BRD states the business problem; the Pre-SDD cites it as BUS-01 |
| [[KEY] 04 - Scope & Personas](../brd-[brd-slug]/04-scope-and-personas.md) | [01 - Business Brief](./01-business-brief.md), [03a](./03a-register-business.md) | Scope and personas pre-fill BUS-02, BUS-03, BUS-06 |
| [[KEY] 08 - Integrations](../brd-[brd-slug]/08-integrations.md) | [03f - Integration](./03f-register-integration.md) | Partners and purpose pre-fill the INT rows |
| [[KEY] 10 - NFRs](../brd-[brd-slug]/10-nfrs.md) | [03b](./03b-register-capacity.md), [03c](./03c-register-reliability.md), [04](./04-targets-and-calculations.md) | Business expectations become settled targets and calculations |
| [[KEY] 12 - Technical Inputs for the SDD](../brd-[brd-slug]/12-appendix-and-wishlist.md) | [02](./02-classification-and-path.md), [03a-03h](./03a-register-business.md) | Technical mandates pre-fill the classification and the register, for shape only |

| Pre-SDD Chunk | SDD Chunk(s) | Relationship |
|---------------|--------------|--------------|
| [12 - SDD Handoff Guide](./12-sdd-handoff-guide.md) | [SDD 00 § Document Lineage](../sdd-[sdd-slug]/00-cover-and-changelog.md), the places 12 § 12.3 names | The SDD loads and locks the items, and cites them as `PSDD/<ID>` |
