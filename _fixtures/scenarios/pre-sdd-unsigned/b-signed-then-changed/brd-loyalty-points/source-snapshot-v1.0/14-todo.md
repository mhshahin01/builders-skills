<!--
CHUNK: 14
TITLE: Product Manager To-Do
PROJECT: Loyalty Points
VERSION: 1.0
PART OF: BRD - Loyalty Points
TYPE: Delivery chunk - living checklist
MERGE: Excluded. Never part of the merged or combined BRD. Not an input to sdd-unifier.
-->

# Product Manager To-Do

**Last updated:** 2026-09-24 | **BRD version:** 1.0 | **Steps complete:** 2 of 5

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | Complete | OI-01 accepted and applied (2026-09-24) | Step 2 |
| 2 | Run a consistency check across all BRD chunks | Complete | Run 1, 2026-09-24, 0 findings | Step 3 |
| 3 | Finalise requirements with the grill-me skill | Not started | None yet | Steps 4 and 5 |
| 4 | Generate mockups in Figma | Pending gate | None yet | The delivery gate |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Pending gate | None yet | The delivery gate |

## Delivery gate

**Gate:** Shut | **Next action:** Run /grill-me (step 3).

## Downstream outputs

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | 15-implementation.md | Locked | G3, G4, G5 |
| UAT/BAT test cases | 16-uat-bat-test-cases.md | Locked | Gate, then chunk 15 |
| Presentation and video brief | 17-for-ppt.md | Locked | Gate, then chunks 15 and 16 |

## Step 4 - Generate mockups in Figma

### Mockup coverage

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| LP-01 | Points balance | UC-01 | UC-01 BR-1 | Default, no points yet | P1 | N | - | In review | - | https://www.figma.com/proto/LOYL01/loyalty-points?node-id=lp-01 |
| LP-02 | Points history | UC-02 | UC-02 BR-1, BR-2 | Default, refund taken back | P1 | N | - | In review | - | https://www.figma.com/proto/LOYL01/loyalty-points?node-id=lp-02 |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: none -->
