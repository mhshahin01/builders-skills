<!--
CHUNK: 14
TITLE: Product Manager To-Do
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: all BRD chunks (00 through 13); updated again after 15, 16, 17 are produced
PART OF: BRD - Refunds Portal
TYPE: Delivery chunk - living checklist
MERGE: Excluded. Never part of the merged or combined BRD. Not an input to sdd-unifier.
-->

# Product Manager To-Do

> **What this is.** The ordered list of what still has to happen before this BRD can be treated as final, and what each downstream output is waiting for.

**Last updated:** 2026-09-25 | **BRD version:** 1.0 | **Steps complete:** 5 of 5

---

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | Complete | All OI rows closed in chunk 13 (2026-09-22, Product Team) | Step 2 |
| 2 | Run a consistency check across all BRD chunks | Complete | Run 2, 2026-09-23, 0 open findings | Step 3 |
| 3 | Finalise requirements with the grill-me skill | Complete | PM confirmed session on 2026-09-23 | Steps 4 and 5 |
| 4 | Generate mockups in Figma | Complete | Figma links in the use cases; play-through confirmed by PM on 2026-09-24 | The delivery gate |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Complete | Skipped for this small BRD with reasons below (2026-09-24) | The delivery gate |

## Delivery gate

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete | Met | - |
| G2 | Step 2 complete | Met | - |
| G3 | Step 3 complete | Met | - |
| G4 | Step 4 complete | Met | - |
| G5 | Step 5 complete | Met | - |

**Gate:** Open | **Next action:** None.

## Downstream outputs

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | [15-implementation.md](./15-implementation.md) | Up to date (2026-09-25, BRD v1.0) | - |
| UAT/BAT test cases | [16-uat-bat-test-cases.md](./16-uat-bat-test-cases.md) | Up to date (2026-09-25, BRD v1.0) | - |
| Presentation and video brief | 17-for-ppt.md | Locked | Not requested yet |

---

## Step 4 - Generate mockups in Figma

| | |
|---|---|
| **Status** | Complete |
| **Evidence** | Play-through confirmed by the PM on 2026-09-24; Figma links recorded in each use case's UI/UX section |

### Mockup coverage

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| SCR-01 | Refund request form | UC-01 | UC-01 BR-1, BR-2; 11 / Amounts show the currency | Default, window passed, receipt not found | P1 | Y | Mobile, tablet, desktop | Approved | Confirmed by PM, 2026-09-24, pass | https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-01 |
| SCR-02 | My refund requests (list and request detail) | UC-02, UC-03 | UC-02 BR-1; UC-03 BR-1 | Default, empty, cancelled, already decided | P1 | Y | Mobile, tablet, desktop | Approved | Confirmed by PM, 2026-09-24, pass | https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02 |
| MK-03 | Branch manager decision screen | UC-04 | UC-04 BR-1, BR-2, BR-3 | Default, partial amount, reject with reason, payout failed | P1 | Y | Desktop, tablet, mobile | Approved | Confirmed by PM, 2026-09-24, pass | https://www.figma.com/proto/RFND01/refunds-portal?node-id=mk-03 |

---

## Step 5 - Update the use-case chunks with use-case diagrams and flowcharts

### Use-case flowcharts (chunks 06*)

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-customer.md) | 6 | A1, E1, E2 | Skip - fixture | Skipped | - |
| UC-02 | [06a](./06a-use-cases-customer.md) | 4 | A1 | Skip - fixture | Skipped | - |
| UC-03 | [06a](./06a-use-cases-customer.md) | 5 | E1 | Skip - fixture | Skipped | - |
| UC-04 | [06b](./06b-use-cases-branch-manager.md) | 7 | A1, A2, E1 | Skip - fixture | Skipped | - |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->
