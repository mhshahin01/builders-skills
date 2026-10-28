<!--
CHUNK: 01
TITLE: Business Brief
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00
PART OF: Pre-SDD - [Project Name]
-->

# 1. Business Brief

<!-- Outcome, scope, and why: the business items in summary, linked to the BRD. One fact, one home: cite the BRD by key, ID, and link (REFUNDS/NFR-03), and add only the delta. State the settled outcome in plain present tense; the decision story goes in decision-log.md. Prose cites a value by its ID (BUS-05.1) and states no number the fragments do not hold. A gap is flagged as **[NEEDS CLARIFICATION: <specific question>]**, never filled with a plausible invention. -->

## 1.1 Project Header

<!-- The engine renders the header rows HDR-01 to HDR-10 (the project's identity: solution name, sponsor, product owner, lead architect, architecture review authority, budget owner, change type, intended target, source platforms, migration direction) from the project state (fragment `01-header.md`). Paste it unchanged between the markers. G0 needs the sponsor (HDR-02) and the lead architect (HDR-04). -->

<!-- ENGINE-FRAGMENT: 01-header.md -->
### HDR-01

**Solution name**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-01.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-02

**Business sponsor**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-03

**Product owner**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-04

**Lead architect**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-05

**Architecture review authority**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-06

**Business budget owner**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-07

**Change type**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-08

**Intended target**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-09

**Source platforms**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### HDR-10

**Migration direction**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-10.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |
<!-- /ENGINE-FRAGMENT -->

## 1.2 Outcome and Why

<!-- BUS-01: the business problem, the outcome, and the KPI with its baseline, target, and deadline, cited by entry ID and linked to the BRD section that states it. Two to four sentences. -->

[Why this initiative exists and what it must achieve, citing BUS-01.1 and the BRD: "[KEY/ID](../brd-[brd-slug]/NN-chunk.md#anchor)".]

## 1.3 Scope

<!-- BUS-03: in scope, out of scope, dependencies, MVP against later phases; link the BRD scope chunk (04) rather than restating it. -->

| In scope | Out of scope | Source |
|----------|--------------|--------|
| [Item] | [Item] | [[KEY] 04 § Scope](../brd-[brd-slug]/04-scope-and-personas.md#anchor) |

## 1.4 Critical Journeys

<!-- BUS-02, one entry per journey: the journey, its failure impact, and its priority. Each journey's targets live in the register (CAP-07, REL-01, REL-03 per journey); cite their entry IDs, not their values. -->

| Journey | Entry | Failure impact | Priority | Targets |
|---------|-------|----------------|----------|---------|
| [Journey name] | BUS-02.1 | [What the business loses when it fails] | [Must / Should / Could] | [CAP-07.1, REL-01.1, REL-03.1] |

## 1.5 Business Constraints and Obligations

<!-- The hard business rows: BUS-07 (explicit prohibitions and non-goals) and BUS-08 (commercial and legal obligations, penalties), plus the delivery dates of BUS-05. One line each, by entry ID. A hard entry that is Open is named here and in chunk 10. -->

- **Prohibitions (BUS-07):** [Statement, citing BUS-07.1 and the BRD]
- **Obligations (BUS-08):** [Statement, citing BUS-08.1 and the BRD]
- **Dates and windows (BUS-05):** [Statement, citing BUS-05.1]

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-classification-and-path.md -->
