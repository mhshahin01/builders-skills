<!--
CHUNK: 08
TITLE: Migration Overlay
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 02, 03a-03h, 04, 05
WRITTEN: full mode, only while the migration overlay applies. Omitted otherwise, never stubbed.
PART OF: Pre-SDD - [Project Name]
-->

# 8. Migration Overlay

<!-- Rules: migration-overlay.md. The overlay applies regardless of the path, for every workload that crosses a hosting or platform boundary (Standard § 8). Each overlay row OVL-01 to OVL-12 holds one entry per workload WL-NN, and each workload has one primary R (7R) in OVL-04. DT-11 applies: the 7Rs are evaluated per workload, with the dependency wave, the cutover, and the rollback. -->

## 8.1 Overlay Register

<!-- The engine renders the overlay rows per workload from the project state (fragment `08-overlay.md`, which exists only while the overlay applies). Paste it unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 08-overlay.md -->
### OVL-01

**Source → target**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-01.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-01.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-02

**Migration objective**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-02.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-02.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-03

**Workload group**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-03.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-03.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-04

**7R strategy**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-04.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-04.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-05

**Current-state baseline**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-05.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-05.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-06

**Destination fit**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-06.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-06.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-07

**Transition and data plan**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-07.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-07.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-08

**Network/cutover plan**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-08.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-08.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-09

**Downtime contract**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-09.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-09.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-10

**Fallback**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-10.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-10.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-11

**Acceptance criteria**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-11.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-11.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OVL-12

**Decommission criteria**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OVL-12.1 | [WL-01 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
| OVL-12.2 | [WL-02 workload name] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
<!-- /ENGINE-FRAGMENT -->

## 8.2 Workloads and 7R

<!-- One row per workload: its primary R and the reason, by entry ID. The 7R definitions are the Standard's § 8.1; never a "blind lift-and-shift" where DT-09 applies. -->

| Workload | Primary R (OVL-04) | Reason | Wave |
|----------|--------------------|--------|------|
| [WL-01 name] | [OVL-04.1] | [Reason, citing evidence] | [Wave] |

## 8.3 Cutover and Fallback

<!-- The Standard's § 8.4 cutover rules applied per workload: the downtime contract (OVL-09), the fallback and the point of no return (OVL-10), the acceptance criteria (OVL-11), and the decommission criteria (OVL-12), each cited by entry ID. -->

- [Workload]: [Cutover approach, fallback, point of no return, citing OVL entry IDs]

## 8.4 Transfer Math

<!-- The bulk transfer and the link it needs come from the engine (CALC-17 in chunk 04, from OVL-07 and OVL-08 and their factors). Cite the result by ID and state what it means for the cutover window (OVL-09); never compute it here. -->

[Reading, citing CALC-17 and the OVL entries.]

## 8.5 Hazards

<!-- The Standard's § 8.2 (on-prem to cloud) or § 8.3 (cloud to cloud) hazards that apply to this migration, each with its owner and the entry or unknown (QD-NN) that tracks it. -->

| Hazard | Applies to | Owner | Tracked by |
|--------|------------|-------|------------|
| [Hazard] | [Workloads] | [Owner] | [Entry ID or QD-NN] |

## 8.6 Wave Record

<!-- The dependency waves: which workloads move together and in which order, with the dependency that sets the order. -->

| Wave | Workloads | Depends on | Notes |
|------|-----------|------------|-------|
| 1 | [WL-NN] | [Dependency] | [Notes] |

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 07-options-and-economics.md | NEXT: 09-decisions.md -->
