# [Project / Product Name]: Pre-SDD (Pre-Solution Design)

**Project / Product Name:** [Project Name] <!-- HDR-01, as chunk 01 holds it. -->
**Version:** [X.X] <!-- The current Pre-SDD version (project.pre_sdd_version); the file name carries the same. -->
**Engine:** pre-sdd-engine [3.0.0], skill pre-sdd-unifier [1.0.0] <!-- As `cli.mjs --version` prints them. -->
**Author:** E2E Architect (pre-sdd-unifier)
**Confirmer:** [Name of the person whose answers and confirmations this run records; one line per person who answered]
**Signers:** [Each G3 signer with the roles they signed, or "Not signed"] <!-- From chunk 11; writing a signature here bumps nothing. -->
**Date:** [YYYY-MM-DD]
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and the consuming SDD)

<!-- The generation state a chunked Pre-SDD keeps in its master; in COMBINED mode it is written here, in the cover, at setup (SKILL.md step 5), right after `cli.mjs new`, and updated after every answered batch, every save, and every stop. Resume reads it (SKILL.md step 1). Generation: the mode (full or quick), plus light when set; a resume keeps it, and only the set-run op changes it, by a person or a fixture owner. Source BRDs: the system's BRDs with their keys and versions, so a resume can match this Pre-SDD to its system. Gate: the engine's gate label (Discovery in quick mode; otherwise a new Pre-SDD reads Draft until G0 is met, ahead of Blocked, even while G3 reads Blocked), the G3 status, and whether the SDD may start, copied from the engine's gate result (derive prints it; compute writes it to model.json), never from memory. Next: the stage and group the run continues with (the set-run pointer in the project state names the same), and what the run waits for. -->

**Generation:** [full | quick][, light]
**Source BRDs:** [KEY] v[X.X] ([status]) [one per BRD]
**Gate:** [Draft | G0 | G1 | G2 | Blocked | G3 Approved | G3 Approved with conditions | Discovery] - G3: [Not signed | Blocked | Review | Approved | Approved with conditions] - SDD authorized: [Yes | No]
**Next:** stage [N], group [GROUP] - [waiting for: the user's answers | "continue" at the G1 review stop | "continue" at the G2 review stop | the signers at the G3 stop | nothing: handed off]

<!-- One row per stage. Status: Pending, In progress, Waiting (at a review or sign-off stop), or Done. Group: the group in hand or next, in the stage 2 order HDR, BUS, SEC, DAT, INT, CAP, REL, OPS, ECO (OVL in stage 3 while the overlay applies). Gate: the engine's result for the stage's gate. Write-up: which chunks were written, at which version. Review: the review stop's state, and in stage 4 the review passes (N of 3; N of 2 in a light run) and the open items still Open. Handoff: the handoff request and its state. A quick Pre-SDD fills only the stage 1 row (its gate reads Discovery, and its Handoff cell gives the board row Done v1.0, with no request to the Software Architect); the other rows read "Not in quick mode". -->

| Stage | Status | Group | Gate | Write-up | Review | Handoff |
|-------|--------|-------|------|----------|--------|---------|
| 1. Discovery | [Pending / In progress / Done] | [stage 1 rows, or the batch in hand] | [Full: -; quick: Discovery] | [Quick: the cover and sections 1, 2, 3, and 10 at v1.0; full: -] | - | [Quick: board row Done v1.0; full: -] |
| 2. Register | [Pending / In progress / Waiting / Done] | [HDR, BUS, SEC, DAT, INT, CAP, REL, OPS, ECO: the group in hand] | G1 [Met / Not met] | - | [G1 review stop: waiting / passed YYYY-MM-DD by the person or the policy label] | - |
| 3. Assess | [Pending / In progress / Waiting / Done] | [OVL while the overlay applies, or -] | G2 [shortlist / blocker / incomplete] | - | [G2 review stop: waiting / passed YYYY-MM-DD by the person or the policy label] | - |
| 4. Confirm and decide | [Pending / In progress / Waiting / Done] | [the group whose confirm is in hand, or -] | G3 [Not signed / Blocked / Review / Approved / Approved with conditions] | [Sections written at vX.Y, YYYY-MM-DD] | [Review passes N of 3; open items: N Open] | [HR-NNN to the Software Architect: Open / Accepted / Done; or "Not raised: G3 not signed"] |

---

## Document Lineage

<!-- One Pre-SDD per system. Its parent BRDs are the ones the SDD will have. The project state holds the same list (project.brds), written by `cli.mjs new --brd` and later by the set-brd op. -->

### Source BRDs (parents)

<!-- One row per source BRD, in the project state's order. Key: the short capital key given at intake (REFUNDS, WALLET), stable once seen; every BRD reference in this Pre-SDD carries it (REFUNDS/NFR-03). Version: the BRD version this Pre-SDD was built from or last updated against. Status: the BRD cover's Status at that version; a BRD that is not Approved is named in the handoff summary, and the answer to "go on?" is in decision-log.md. Link: the BRD master (chunked) or combined file, relative to the project root, where this file lives. -->

| Key | BRD | Version | Status | Link | Covers |
|-----|-----|---------|--------|------|--------|
| [KEY] | [BRD project name] | [X.X] | [Draft / In Review / Approved] | [[brd-slug]-brd-master.md](./brd-[brd-slug]/[brd-slug]-brd-master.md) | [What this BRD contributes] |

### Consuming SDD (child)

<!-- The SDD that loads this Pre-SDD (sdd-unifier). This skill never writes into the SDD: it fills this row from the SDD's own chunk 00, whose Source Pre-SDD row names this Pre-SDD, the first time it finds one beside this folder. Filling the row adds a link, which is not a content change: it bumps nothing. Before any SDD exists: one row "None yet". -->

| SDD | Version | Pre-SDD version it loaded | Link |
|-----|---------|---------------------------|------|
| None yet | - | - | - |

---

## Changes Log

<!-- One update, one version (SKILL.md § Output conventions, Versions). The first build is 1.0 and its row ends with "Chunks: none (initial build)". A later update's first content change bumps the version one minor step (the set-version op) and opens one row, which every later change in the update joins; the row ends with "Chunks:" and the number of every chunk whose content changed. Sign-offs, gate and status lines, board rows, links, footers, and index rows bump nothing. Reviewed By: the cleared-context reviewer pass (chunk 13). Approved By: the G3 signers of that version, from chunk 11; filling it bumps nothing. -->

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial build. Chunks: none (initial build) |

---

## Indexes

### Table of Contents

<!-- One row per chunk this Pre-SDD holds. An omitted chunk (06 without brownfield or mixed, 08 without the overlay, 04 to 09 and 11 to 13 in quick mode) has no row. -->

| Section | Link |
|---------|------|
| 1. Business Brief | [§ 1](#1-business-brief) |
| 2. Classification and Path | [§ 2](#2-classification-and-path) |
| 3. Requirement Register | [03a](#31-business-bus-01-to-bus-08) to [03h](#38-economics-eco-01-to-eco-06) |
| 4. Targets and Calculations | [§ 4](#4-targets-and-calculations) |
| 5. Target Shape | [§ 5](#5-target-shape) |
| 6. Existing Estate | [§ 6](#6-existing-estate) |
| 7. Options and Economics | [§ 7](#7-options-and-economics) |
| 8. Migration Overlay | [§ 8](#8-migration-overlay) |
| 9. Decisions | [§ 9](#9-decisions) |
| 10. Validation, Risks and Unknowns | [§ 10](#10-validation-risks-and-unknowns) |
| 11. Gate and Sign-off | [§ 11](#11-gate-and-sign-off) |
| 12. SDD Handoff Guide | [§ 12](#12-sdd-handoff-guide) |
| 13. Open Items and Clarifications | [§ 13](#13-open-items--clarifications) |

### Register Index

<!-- Where each register row lives, so a `PSDD/<ID>` link resolves. Each row is a `### <ROW-ID>` heading in its chunk. -->

| Rows | Group | Section |
|------|-------|-------|
| HDR-01 to HDR-10 | Project header | [01 § 1.1](#11-project-header) |
| BUS-01 to BUS-08 | Business | [03a](#31-business-bus-01-to-bus-08) |
| CAP-01 to CAP-12 | Capacity | [03b](#32-capacity-cap-01-to-cap-12) |
| REL-01 to REL-10 | Reliability | [03c](#33-reliability-rel-01-to-rel-10) |
| DAT-01 to DAT-09 | Data | [03d](#34-data-dat-01-to-dat-09) |
| SEC-01 to SEC-08 | Security | [03e](#35-security-sec-01-to-sec-08) |
| INT-01 to INT-09 | Integration | [03f](#36-integration-int-01-to-int-09) |
| OPS-01 to OPS-08 | Operations | [03g](#37-operations-ops-01-to-ops-08) |
| ECO-01 to ECO-06 | Economics | [03h](#38-economics-eco-01-to-eco-06) |
| OVL-01 to OVL-12, per workload `WL-NN` | Migration overlay (only when it applies) | [08 § 8.1](#81-overlay-register) |

### ID Index

| IDs | What | Section |
|-----|------|-------|
| `CALC-NN` (`CALC-21@OPT-NN`, `CALC-22@OPT-NN`) | Calculations; option TCO and weighted score | [04 § 4.2](#42-calculations), [07 § 7.1](#71-options) |
| `OPT-NN` | Options (shapes, never products) | [07 § 7.1](#71-options) |
| `DT-01` to `DT-15` | Decision rules | [09 § 9.2](#92-decision-tree) |
| `ADR-<AREA>-NNN` | Pre-SDD ADRs | [09 § 9.4](#94-pre-sdd-adrs) |
| `QD-NN` | Unknowns | [10 § 10.1](#101-validation-and-unknowns) |
| `R-NN` | Risks | [10 § 10.2](#102-risks) |
| `G3-01` to `G3-14`, `COND-NN`, `EXC-NN` | G3 checklist, conditions, exceptions | [11 § 11.1](#111-gate-result) |
| `OI-NN` | Reviewer open items | [13](#13-open-items--clarifications) |

### Figures

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | [Title] | [Section] |

### Tables

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | [Title] | [Section] |

---

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

[Why this initiative exists and what it must achieve, citing BUS-01.1 and the BRD: "[KEY/ID](./brd-[brd-slug]/NN-chunk.md#anchor)".]

## 1.3 Scope

<!-- BUS-03: in scope, out of scope, dependencies, MVP against later phases; link the BRD scope chunk (04) rather than restating it. -->

| In scope | Out of scope | Source |
|----------|--------------|--------|
| [Item] | [Item] | [[KEY] 04 § Scope](./brd-[brd-slug]/04-scope-and-personas.md#anchor) |

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

---

# 2. Classification and Path

<!-- Rules: classification-and-paths.md. The classification follows the Standard: change type (HDR-07: greenfield, brownfield, or mixed) crossed with the intended target (HDR-08: on-prem, cloud, hybrid, or undecided), which gives the path code (GF-OP, GF-CL, BF-OP, BF-CL). Hybrid is one cloud and one on-prem sub-assessment plus a boundary analysis, never a fifth path. The migration overlay sits on top of any path. The recovery tier (Simple, Complex, or none) only points at the closest worked example. -->

## 2.1 Classification

<!-- The engine renders the classification from the project state (fragment `02-classification.md`): the change type, the target, the path code, hybrid, the migration overlay (applies or not, source platform, direction), the recovery tier, and the closest worked example. Paste it unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 02-classification.md -->
| Item | Value | Source |
|------|-------|--------|
| Change type (HDR-07) | [greenfield / brownfield / mixed] | [Source] |
| Intended target (HDR-08) | [onprem / cloud / hybrid / undecided] | [Source] |
| Path code | [GF-OP / GF-CL / BF-OP / BF-CL / hybrid: both codes] | Engine |
| Migration overlay | [applies / does not apply], source [unknown / onprem / samecloud / othercloud / mixed] | [Source] |
| Recovery tier | [Simple / Complex / none] | Engine |
| Closest worked example | [example file, or none] | Engine |
<!-- /ENGINE-FRAGMENT -->

## 2.2 Path Evidence

<!-- The Standard's § 7 extension for the selected path: the additional evidence it asks for, what this Pre-SDD holds for each, and where (a register entry, a BRD citation, or an unknown QD-NN). Undecided target: say which placements are compared and point to chunk 07. Each line cites its evidence; a line with none names its unknown. -->

| Evidence the path needs (Standard § 7) | What this Pre-SDD holds | Where |
|----------------------------------------|-------------------------|-------|
| [Evidence item for the path] | [Summary] | [Entry ID, BRD citation, or QD-NN] |

**Required outputs of the path:**

<!-- The Standard's § 7 "Required outputs" for the selected path, each with the chunk that holds it (for example "fault-domain and DR model: chunk 05 § 5.2"), or the unknown that keeps it open. -->

- [Required output]: [chunk and section, or QD-NN]

## 2.3 Hybrid Boundary

<!-- Only for a hybrid target: which components sit on each side, the boundary flows, and the latency and data rules across it (DT-06). Otherwise write exactly: "Not applicable: the target is not hybrid." -->

[Boundary analysis, or "Not applicable: the target is not hybrid."]

## 2.4 Migration Overlay

<!-- Whether the overlay applies (switched on in stage 2 with the set-overlay op, by a person or a fixture owner, or by the skill with its citation in `cite`), the source platform, and the workloads (WL-NN). When it applies, point to chunk 08; otherwise write "Not applicable: no workload crosses a hosting or platform boundary." -->

[Statement, with a link to [08 Migration Overlay](#8-migration-overlay), or "Not applicable: no workload crosses a hosting or platform boundary."]

## 2.5 Closest Worked Example

<!-- The engine's pointer to the closest of the eight worked examples, from the path code and the recovery tier. The example is an illustration, never a template or a source of values. A light run gives no pointer: write "Not given in a light run." -->

[Example, from the fragment, and one line on what it illustrates; or "Not given in a light run."]

---

# 3. Requirement Register

## How to Read the Register

<!-- Written once, before § 3.1; it covers every register group. Rules: register-and-entries.md. -->

Each register row is a `### <ROW-ID>` heading, its title in bold (the Standard's wording), and its entries table. A row the Standard answers per journey, transaction type, failure scope, dataset, workload, or external system holds several entries; `.1` is the primary entry, which every row has. Downstream documents cite a row or an entry as `PSDD/<ID>` (`PSDD/REL-03.2`), linked to the row heading (`#rel-03`).

| Field | Meaning |
|---|---|
| **Entry** | The row ID, a dot, and the entry number (`REL-03.2`). |
| **Label** | The journey, transaction type, failure scope, dataset, workload, or external system the entry answers; blank for a row with one entry. |
| **Value, Unit, Window** | The value with its unit and observation window. A value the sources do not give reads `TBD`, never zero. |
| **Priority** | Must, Should, or Could. |
| **Kind** | `hard` (a guardrail), `target` (negotiable), `forecast`, or `assumption`. An `Open` hard entry blocks the gate unless a named person grants a time-bound exception (chunk 11). |
| **Status** | `Open`, `Estimated`, `Confirmed` (with who and when), or `N/A` (with a reason). |
| **Source** | `BRD: KEY/ID`, `Derived: CALC-NN from <items>`, `Answer: <who>, <UTC date>`, `Default: <appendix or rule>`, a policy label, or `Import: Studio v2.2`. |
| **Owner, Due** | The owner code (B, E, D, Sec, Ops, Fin, Legal) and, for an `Open` entry, the owner's name and the due date. |

The sizing factors that refine a row (for example the calls per transaction under CAP-02) are listed under that row with their own status and source. The header rows `HDR-01` to `HDR-10` are in chunk 01, and the migration overlay rows `OVL-01` to `OVL-12` in chunk 08.


## 3.1 Business (BUS-01 to BUS-08)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03a-register-business.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03a-register-business.md -->
### BUS-01

**Problem, business outcome and KPI with baseline, target, deadline**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### BUS-02

**Critical user journeys, failure impact and journey priorities**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-03

**In/out of scope; dependencies; MVP versus later phases**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-04

**Revenue/loss or safety impact per outage and per degraded minute**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-05

**Launch date, hard deadlines, blackout/change windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-06

**Countries, users, contracts and accessibility/localization commitments**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-07

**Explicit prohibitions / non-goals (e.g., forbidden data movement)**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-08

**Commercial/legal obligations to customers and penalty conditions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

## 3.2 Capacity (CAP-01 to CAP-12)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03b-register-capacity.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03b-register-capacity.md -->
### CAP-01

**Transactions by type: normal and peak TPS, and define what a transaction counts**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### CAP-02

**API request rate (RPS), reads/writes, retries, fan-out, requests per business transaction**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-03

**DAU/MAU, peak simultaneously active users, sessions and session duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-04

**Hourly/daily/weekly peaks, seasonality, campaign and burst size/duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-05

**Forecasted growth by period and confidence, major future feature/product launches**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-06

**Payload/request/response sizes, file/object sizes, compression assumptions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-07

**p50, p95, p99 (and p99.9 if justified) per critical journey; units and observation window**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-08

**Define where latency is measured (client end-to-end, ingress, service, batch completion) and what counts as failure**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-09

**Max queue age, processing deadline, freshness, end-to-end batch completion and backlog recovery target**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-10

**Read/write mix, hot keys, expensive operations, query/report schedules**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-10.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-11

**Expected request failures/timeouts/retry behavior at dependencies and load-shedding tolerance**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-11.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### CAP-12

**Resource-intensive AI/ML/media jobs if in scope: model size, token/compute demand, jobs and deadlines**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-12.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

## 3.3 Reliability (REL-01 to REL-10)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03c-register-reliability.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03c-register-reliability.md -->
### REL-01

**Availability SLO per user journey; denominator, service window, and measurement period**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### REL-02

**SLA to customers vs internal SLO; what failures/exclusions count; penalties**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-03

**RTO per service/journey and disaster scenario: acceptable elapsed time to restored usable service**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-04

**RPO per dataset/transaction and disaster scenario: acceptable age of last recoverable data point**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-05

**Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-06

**Maximum tolerable business interruption, minimum service during degradation, manual fallback and reconciliation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-07

**Recovery sequence and dependencies: authentication, payments, ledger, reporting, etc.**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-08

**Approved planned downtime, maintenance restrictions, deployment and upgrade windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-09

**Frequency and accepted evidence for restore, failover, failback and cyber-recovery drills**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-10

**Data durability and correctness expectations distinct from availability**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-10.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

## 3.4 Data (DAT-01 to DAT-09)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03d-register-data.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03d-register-data.md -->
### DAT-01

**Business entities, system of record, ownership and data contracts**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### DAT-02

**Starting volume; records/day, GB/day, object size, peak writes and retention horizon**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-03

**Sensitivity classification: PII, financial, confidential, secrets, public**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-04

**Residency, allowed processing/storage/backup locations and cross-border restrictions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-05

**Consistency, freshness, correctness, ordering and atomicity by operation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-06

**Retention, records hold, archive, deletion, portability and right-to-erasure requirements**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-07

**Multi-tenancy model, tenant isolation level, noisy-neighbor tolerance, tenants and growth**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-08

**Reporting, analytics, batch exports, reconciliation frequency and data latency**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-09

**Restore granularity (tenant/table/whole system), point-in-time needs and recovery verification**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

## 3.5 Security (SEC-01 to SEC-08)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03e-register-security.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03e-register-security.md -->
### SEC-01

**Laws, contracts, certifications and organization policies actually applicable; control mappings**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### SEC-02

**Actors, partner identities, workforce, machine principals, customer identity sources**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### SEC-03

**Threat/risk classification, acceptable residual risk and adversary concerns**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### SEC-04

**Encryption at rest/in transit, BYOK/HYOK, key custody, rotation, certificate requirements**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### SEC-05

**Audit events, non-repudiation, investigation and evidence retention**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### SEC-06

**Vulnerability, patch, pen-test, SBOM/supply-chain and incident reporting obligations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### SEC-07

**Required separation of duties, privileged access, break glass and tenant/customer administration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### SEC-08

**Third-party processor/subprocessor and vendor risk restrictions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

## 3.6 Integration (INT-01 to INT-09)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03f-register-integration.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03f-register-integration.md -->
### INT-01

**Catalogue of upstream/downstream systems, owner, interface, business criticality**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### INT-02

**Synchronous API vs event/file/batch, update frequency, order and delivery expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-03

**External API quotas, latencies, SLAs, maintenance and rate limits**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-04

**Failure behavior: reject, retry, queue, compensate, or manual handling**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-05

**Consistency and ordering guarantees, duplicate tolerance, maximum delay**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-06

**Existing public IP, allowlists, firewall change process, proxies, DNS and certificate dependencies**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-07

**Client geography, edge locations, remote branches, IoT and intermittent/offline operation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-08

**Address ranges, DNS zones, IP overlap, IPv4/IPv6, routing and private connectivity constraints**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-09

**External SLA dependencies; legal or operational inability to move a peer system**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

## 3.7 Operations (OPS-01 to OPS-08)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03g-register-operations.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03g-register-operations.md -->
### OPS-01

**Support hours, user hours, incident severities, response and escalation commitments**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### OPS-02

**Team skills, support model, managed-service restrictions and ownership boundaries**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OPS-03

**Release frequency, rollback tolerance and change-freeze windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OPS-04

**Environments needed: dev, test, perf, stage, prod, DR; isolation and test data rules**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OPS-05

**Logging/tracing/metric retention, event cardinality, alerting and forensic search**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OPS-06

**Business continuity runbooks, escalation matrix and authority to invoke failover**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OPS-07

**Changeover, reversibility, customer communication and decommissioning expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### OPS-08

**Testing scope: load, soak, chaos/fault injection, DR, security, compliance, accessibility**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

## 3.8 Economics (ECO-01 to ECO-06)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03h-register-economics.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03h-register-economics.md -->
### ECO-01

**One-time implementation/migration budget and recurring annual/monthly run-cost envelope**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### ECO-02

**CapEx/OpEx preferences, currency, commitment period, chargeback unit**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-03

**TCO horizon and required benefits (cost, speed, risk, flexibility)**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-04

**Delivery deadline, acceptable delivery risk, available people and vendor approval duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-05

**Environmental/energy footprint goals if applicable, measurement expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-06

**Exit portability expectations, vendor lock-in tolerance and contract termination rights**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

---

<!-- Sections 4 to 9 and 11 to 13 are written in full mode only; quick mode writes the cover, sections 1 to 3, and section 10. -->

# 4. Targets and Calculations

<!-- Every number in this section comes from the engine: the register fragments (03a to 03h) and the calculations fragment below. None is worked out by hand or in prose. A value with an Open input reads TBD, never zero. -->

## 4.1 Targets

<!-- The settled targets, by entry ID, one table per kind: the service level objectives (REL-01 per journey, REL-02), the latency budgets (CAP-07 per journey, measured where CAP-08 says), the recovery targets (REL-03 and REL-04 per scope, journey, and dataset; REL-05 per failure scope), and the capacity drivers (CAP-01, CAP-03, CAP-04, CAP-05, DAT-02). Copy each value with its unit and status from the register fragment; write TBD where the fragment does. -->

| Target | Entry | Value | Status | Register |
|--------|-------|-------|--------|----------|
| [Availability SLO, journey] | REL-01.1 | [value and unit, or TBD] | [Status] | [03c](#rel-01) |
| [P99 latency, journey] | CAP-07.1 | [value and unit, or TBD] | [Status] | [03b](#cap-07) |
| [RTO, scope and journey] | REL-03.1 | [value and unit, or TBD] | [Status] | [03c](#rel-03) |
| [RPO, scope and dataset] | REL-04.1 | [value and unit, or TBD] | [Status] | [03c](#rel-04) |
| [Peak transactions, type] | CAP-01.1 | [value and unit, or TBD] | [Status] | [03b](#cap-01) |

## 4.2 Calculations

<!-- The engine renders every calculation CALC-01 to CALC-20 with its formula, inputs (by entry ID), result, and status (fragment `04-calculations.md`). The option rows CALC-21@OPT-NN (TCO) and CALC-22@OPT-NN (weighted score) are in chunk 07. Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 04-calculations.md -->
| ID | Calculation | Formula | Inputs | Result | Status |
|----|-------------|---------|--------|--------|--------|
| CALC-01 | [Name] | [Formula] | [Entry IDs] | [value and unit, or TBD] | [Status] |
<!-- /ENGINE-FRAGMENT -->

## 4.3 What the Numbers Mean

<!-- Two to six sentences per topic on what the targets and results mean for the shape: headroom, burst handling, the error budget, the recovery window, storage growth, bandwidth. Cite each value by its ID (CALC-03, REL-03.2) and state no number the fragments do not hold. Shape words only: never a product, a version, or the architecture style. A result that reads TBD names the Open entry that holds it back. -->

- **Capacity:** [Meaning, citing CALC-NN]
- **Latency:** [Meaning, citing CAP-07.n and CALC-NN]
- **Availability and recovery:** [Meaning, citing REL-01.n, REL-03.n, REL-04.n]
- **Data growth and bandwidth:** [Meaning, citing CALC-NN]

---

# 5. Target Shape

<!-- The shape, never a product: hosting (cloud, on-prem, or hybrid; a provider only when the business makes it a hard constraint), topology (for example multi-AZ, two regions), the DR strategy per failure scope (local HA, backup, pilot light, warm standby, active; cyber review for a cyber scope with an RTO or RPO of 0; unresolved while an input is missing), the data shape per workload (kind, consistency, the replication the RPO needs), and the network shape (public, private, hybrid, partner). The SDD picks the products, versions, architecture style, and detailed design. -->

## 5.1 Shape

<!-- The engine renders the target shape from the project state (fragment `05-target-shape.md`): hosting, topology, the DR strategy for each failure-scope entry of REL-05 with the replication each RPO needs, the data shape, the network shape, any decision override (with its reason and who decided), and the shape's conflicts. A failure scope whose strategy the shape cannot satisfy is a conflict: it stays in the fragment and in chunk 10, never smoothed over in prose. Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 05-target-shape.md -->
| Aspect | Shape | Basis |
|--------|-------|-------|
| Hosting | [cloud / onprem / hybrid] | [Entry IDs, rule IDs] |
| Topology | [Topology] | [Entry IDs, rule IDs] |
| DR strategy, scope [az] | [localHA / backup / pilot / warm / active / cyberReview / unresolved] | REL-05.1, REL-03.1, REL-04.1 |
| Data | [kind, consistency, replication] | [Entry IDs] |
| Network | [public / private / hybrid / partner] | INT-08.1 |
<!-- /ENGINE-FRAGMENT -->

## 5.2 Diagrams

<!-- Paste the engine's diagrams (`studio/diagrams/<id>.mmd`) inline, unchanged, each in a mermaid code block, each followed by a 1-2 sentence summary so the chunk reads without a renderer. Place every diagram compute writes, and no other: the infrastructure, network, and DR diagrams always; the data, security, integration, and deployment diagrams only when compute writes them, each by its own condition below, or all four when the Studio's show-optional setting is on. A light run keeps the infrastructure, network, and DR diagrams and leaves out the four optional ones. Provider names in a diagram are illustration only. -->

### 5.2.1 Infrastructure

```mermaid
%% Paste studio/diagrams/infrastructure.mmd unchanged.
```

[1-2 sentence summary: what the diagram shows, in shape words.]

### 5.2.2 Network

```mermaid
%% Paste studio/diagrams/network.mmd unchanged.
```

[1-2 sentence summary.]

### 5.2.3 Disaster Recovery

```mermaid
%% Paste studio/diagrams/dr.mmd unchanged.
```

[1-2 sentence summary.]

### 5.2.4 Data

<!-- Only when compute writes studio/diagrams/data.mmd (the engine draws it when the data kind is known or extra data workloads exist); otherwise leave this subsection out. Left out in a light run. -->

```mermaid
%% Paste studio/diagrams/data.mmd unchanged.
```

[1-2 sentence summary.]

### 5.2.5 Security

<!-- Only when compute writes studio/diagrams/security.mmd (the engine draws it when DAT-03 reads sensitive or DAT-04 reads yes); otherwise leave this subsection out. Left out in a light run. -->

```mermaid
%% Paste studio/diagrams/security.mmd unchanged.
```

[1-2 sentence summary.]

### 5.2.6 Integration

<!-- Only when compute writes studio/diagrams/integration.mmd (the engine draws it when INT-08 reads hybrid or partner, or HDR-07 reads brownfield); otherwise leave this subsection out. Left out in a light run. -->

```mermaid
%% Paste studio/diagrams/integration.mmd unchanged.
```

[1-2 sentence summary.]

### 5.2.7 Deployment

<!-- Only when compute writes studio/diagrams/deployment.mmd (the engine draws it when HDR-07 reads brownfield or HDR-08 reads hybrid); otherwise leave this subsection out. Left out in a light run. -->

```mermaid
%% Paste studio/diagrams/deployment.mmd unchanged.
```

[1-2 sentence summary.]

## 5.3 Reading the Shape

<!-- Two to six sentences: why this shape follows from the register (cite the rule IDs of the rule trace in chunk 09 and the entry IDs), what each conflict means and who owns it (by its validation ID in chunk 10), and what the shape leaves to the SDD. Shape words only. -->

[Reading, citing rule IDs and entry IDs.]

---

<!-- Section 6 exists only in full mode for a brownfield change type (HDR-07 brownfield or mixed). Omitted otherwise, never stubbed. -->

# 6. Existing Estate

<!-- The brownfield inventory, as-is and to-be (Standard § 7, the BF-OP and BF-CL extensions, and § 14 D). There is no engine fragment here: every value is cited by the register entry that holds it (for example HDR-09 for the source platforms, CAP-07 for an observed latency, OVL-05 for a migration baseline), and a number no entry holds is not written. Evidence is cited by reference (a BRD section, a telemetry export, an inventory file). A gap is flagged as **[NEEDS CLARIFICATION: <specific question>]** and raised as an unknown (QD-NN). -->

## 6.1 Inventory

<!-- Components, owners, and the last-verified dependency graph, based on runtime traffic, not on diagrams alone. Shape words only: name a component by its role (for example "the settlement batch", "the customer store"), never by a product or version. -->

| Component | Role | Owner | Dependencies | Evidence |
|-----------|------|-------|--------------|----------|
| [Component] | [Role] | [Owner] | [Components it calls or feeds] | [Reference] |

## 6.2 Observed Baseline

<!-- Source workload patterns, latency percentiles, availability, incidents, saturation, and cost, each cited by the register entry that holds it. The gap between the observed baseline and the target is stated by ID (for example "CAP-07.1 target against the observed value in OVL-05.1"). -->

| Measure | Observed (entry) | Target (entry) | Gap |
|---------|------------------|----------------|-----|
| [Measure] | [Entry ID] | [Entry ID] | [Gap in words, or "None"] |

## 6.3 Constraints and Support Status

<!-- Licences, support end dates, network and address constraints (INT-06, INT-08), undocumented jobs and integrations, change tolerance, and technical debt that limit the target. Cite each by entry or evidence reference. -->

- [Constraint, with its entry ID or evidence]

## 6.4 As-Is and To-Be

<!-- The delta from the current estate to the target shape (chunk 05): what is kept, improved, consolidated, relocated, replatformed, refactored, or retired, per component. Do not reproduce a critical defect by copying the current environment. With the migration overlay, the per-workload 7R lives in chunk 08; this section names the component disposition only. -->

| Component | As-is | To-be | Disposition |
|-----------|-------|-------|-------------|
| [Component] | [Current shape] | [Target shape] | [Keep / Improve / Consolidate / Relocate / Replatform / Refactor / Retire] |

---

# 7. Options and Economics

<!-- Rules: options-and-economics.md. Each option is a shape, never a product (for example "one region, multi-AZ" against "two regions, warm standby"). The Standard's § 9.4 worksheet: first the hard-constraint filter, then a comparison with weights a person approved, never invented ones. Scores (1 to 5 per criterion) are proposed by the E2E Architect as Estimated, each with a one-line reason, and a person confirms them; the one-time and monthly costs, the TCO horizon (ECO-03), and the weights come from a person. A light run compares the recommended shape with one alternative and gives no weighted comparison unless the weights are already approved; the fragment lists every option in the project state and stands as the engine wrote it, and only the prose follows the light run. -->

## 7.1 Options

<!-- The engine renders the options from the project state (fragment `07-options.md`): each OPT-NN with its shape, the hard-constraint result (pass, fail, or cannot run yet, with the failing check; an option a person excluded with the exclude-option op fails the check `excluded`, naming the entry it breaks), the criterion scores with status and reason, the costs, and for each score and cost who last set or confirmed it and when (UTC), the TCO (CALC-21@OPT-NN), the weighted score (CALC-22@OPT-NN), the weights with who approved them, the flags (UNWEIGHTED when no weights are approved), and the chosen option. An option that breaks a hard entry or a conflict is never ranked. A missing cost gives TBD and an unknown. Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 07-options.md -->
| Option | Shape | Hard constraints | TCO (CALC-21) | Weighted score (CALC-22) | Status |
|--------|-------|------------------|---------------|--------------------------|--------|
| OPT-01 | [Shape] | [pass / fail: check / cannot run yet] | [value, or TBD] | [value, or TBD, or UNWEIGHTED] | [Status] |
| OPT-02 | [Shape] | [...] | [...] | [...] | [...] |
<!-- /ENGINE-FRAGMENT -->

## 7.2 Reading the Comparison

<!-- Plain present tense, citing OPT-NN, CALC-21@OPT-NN, CALC-22@OPT-NN, and entry IDs; no number the fragment does not hold. Cover: which options the hard-constraint filter removes and why; whether the comparison is weighted (who approved the weights) or flagged UNWEIGHTED; the TCO over the horizon (ECO-03); the recommended shape and its rationale; the cost sensitivities; the pilots or PoCs still needed; and the condition that would reverse the recommendation. The decision itself (the chosen option, who chose it) is the engine's `decisions.chosen_option`, shown in the fragment; the story of how it was chosen goes in decision-log.md. -->

- **Hard-constraint filter:** [Which options pass, which fail and why]
- **Weights:** [Approved by <name> on <date>, or "None approved: the comparison is unweighted (UNWEIGHTED)"]
- **TCO:** [Reading of CALC-21 per option over the ECO-03 horizon]
- **Recommended shape:** [OPT-NN, with its rationale in one or two sentences]
- **Reversal condition:** [The evidence or change that would reverse it]
- **Pilots and PoCs needed:** [List, or "None"]

---

<!-- Section 8 exists only in full mode while the migration overlay applies. Omitted otherwise, never stubbed. -->

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

---

# 9. Decisions

<!-- The Pre-SDD records the problem and the constraints; an ADR records the choice and why; the SDD describes the implementation (Standard § 10). This section states the settled decisions in plain present tense. Who decided, when, and what was offered go in decision-log.md. Shape words only: never a product, a version, or the architecture style. -->

## 9.1 Requirement-to-Consequence Trace

<!-- The Standard's § 10.1 traceability matrix, filled for this project: one row per decision area, with the register entries that drive it (by ID), the architectural issue, the consequence for the shape, the ADR, the SDD sections it lands in (as chunk 12 lists them), and the validation evidence the SDD must produce. Never create an ADR row before the business-approved value it depends on is Confirmed; until then the row names the Open entry. -->

| Requirements | Issue | Consequence for the shape | ADR | SDD sections | Validation evidence |
|--------------|-------|---------------------------|-----|--------------|---------------------|
| REL-01, REL-03, REL-05 | Fault domains; active against passive recovery | [Consequence, citing entry IDs] | ADR-DR-001 | §8.6, §11, §18.5, §19, §20 | Failover exercise |
| REL-04, DAT-05 | Synchronous against asynchronous replication | [Consequence] | ADR-DATA-001 | §8.6, §11, §18.5 | RPO and integrity test |
| ECO-01, ECO-06, BUS-07 | Hosting placement | [Consequence] | ADR-PLATFORM-001 (hosting part) | Q8, §8.3, §8.6 | Compliance and TCO validation |
| CAP-01, CAP-04, CAP-07 | Workload processing model | [Driver for the SDD] | ADR-PERF-001 (SDD) | Q3, §18 | Peak and burst p99 test |
| INT-02, INT-04, INT-05 | Integration reliability | [Driver for the SDD] | ADR-INT-001 (SDD) | §6 Notes, §8.3 | Fault and replay tests |
| SEC-02, DAT-07 | Identity and tenancy | [Driver for the SDD] | ADR-IAM-001 (SDD) | Q7, §11 | Isolation and access tests |

## 9.2 Decision Tree

<!-- The Standard's § 9.3 rules DT-01 to DT-15, one row each, with the outcome in this Pre-SDD. The engine checks DT-01, DT-02, DT-03, DT-11, and DT-15 and reports each STOP or BLOCK as a validation finding (chunk 10): copy the outcome and cite the finding's ID, never restate it from memory. For the other rules, state the architect's response with its evidence. Outcomes: "STOP" or "BLOCK" (with the finding ID), "Applied" (the response taken), or "Not triggered" (why). -->

| Rule | Observable condition (Standard § 9.3) | Outcome here | Evidence |
|------|---------------------------------------|--------------|----------|
| DT-01 | Business outcome or owner missing | [Not triggered / STOP: finding ID] | [Entry IDs] |
| DT-02 | User-facing p99 not defined for a latency-critical journey | [Not triggered / BLOCK: finding ID] | [CAP-07 entries] |
| DT-03 | RPO or RTO unknown for critical data or function | [Not triggered / BLOCK: finding ID] | [REL-03, REL-04, REL-05 entries] |
| DT-04 | Hard residency or compliance restriction excludes an option | [Applied: option removed / Not triggered] | [DAT-04, SEC-01, OPT-NN] |
| DT-05 | Expected peak exceeds proven capacity | [Applied / Not triggered] | [CALC-NN] |
| DT-06 | Tight latency between components would span sites or clouds | [Applied / Not triggered] | [Entry IDs] |
| DT-07 | Target must survive a stated fault domain | [Applied: independent failure domains / Not triggered] | [REL-05 entries] |
| DT-08 | RPO implies stringent consistency | [Applied: replication trade-off in ADR-DATA-001 / Not triggered] | [REL-04, DAT-05] |
| DT-09 | Target needs unsupported technology or licensing | [Applied / Not triggered] | [Entry IDs] |
| DT-10 | Costs, lead times, quotas, or skills violate limits | [Applied / Not triggered] | [ECO entries, CALC-21] |
| DT-11 | Migration destination differs from source | [Not triggered / BLOCK: finding ID / Applied: 7R per workload] | [OVL-04 entries] |
| DT-12 | A critical decision has more than one viable option | [Applied: the ADR compares them] | [OPT-NN] |
| DT-13 | Only one feasible option exists | [Applied: the ADR records the eliminating constraints / Not triggered] | [OPT-NN] |
| DT-14 | Mandatory security or DR acceptance cannot be tested | [BLOCK / Not triggered] | [Verification method of the entries] |
| DT-15 | Open high-severity risks not approved | [Not triggered / BLOCK: finding ID] | [Chunk 10, chunk 11] |

## 9.3 Rule Trace

<!-- The engine renders the recommendation rules that fired, with their IDs, triggers, assessments, verification, and the register rows they cite (fragment `09-rule-trace.md`). Rule IDs keep the Studio's IDs, except LOAD-04 (was CAP-04) and DB-READ-17 (was DB-READ-11). Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 09-rule-trace.md -->
| Rule | Title | Trigger | Assessment | Verification | Rows |
|------|-------|---------|------------|--------------|------|
| [Rule ID] | [Title] | [Trigger] | [Candidate] | [Validation] | [Row IDs] |
<!-- /ENGINE-FRAGMENT -->

## 9.4 Pre-SDD ADRs

<!-- The Standard's ADR set splits at the boundary (Pre-SDD settles numbers and shape; the SDD picks products and style). Three ADRs are Pre-SDD decisions: ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001. A fourth, ADR-MIG-001, is a Pre-SDD decision only when the migration overlay applies. Each follows the Standard's § 10.2 template, in shape words. An ADR is Proposed until G3 is signed; the G3 sign-off in chunk 11 accepts it, so its Status line does not change at signing. Keep ADRs append-only: a later change supersedes, never silently rewrites. -->

### ADR-DR-001: Resilience topology

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Lead architect (HDR-04)] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** REL-01, REL-03, REL-05 [and the entries that apply]
- **Business context:** [Why the decision is needed]
- **Hard constraints and agreed targets:** [Entry IDs and their status]
- **Options considered:** [Shapes, for example "one region, multi-AZ" and "two regions, warm standby"; OPT-NN]
- **Evidence:** [CALC-NN, rule IDs, drills]
- **Option comparison:** [Infrastructure, network, software, data, security, reliability, operations, TCO, migration, and reversibility, per option considered, in shape words]
- **Decision and rationale:** [The topology and the DR strategy per failure scope, as chunk 05 states them]
- **Consequences and residual risks:** [Consequences; risks by ID in chunk 10]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** §8.6, §11, §18.5, §19, §20 / [Failover exercise]

### ADR-DATA-001: Data replication and consistency

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Owner] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** REL-04, DAT-05 [and the entries that apply]
- **Business context:** [Why]
- **Hard constraints and agreed targets:** [Entry IDs]
- **Options considered:** [Synchronous or asynchronous replication, per workload]
- **Evidence:** [CALC-15, rule IDs]
- **Option comparison:** [The same aspects for synchronous and asynchronous replication, per workload]
- **Decision and rationale:** [The replication shape each RPO needs, per workload, as chunk 05 states it]
- **Consequences and residual risks:** [Write-latency and availability impact]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** §8.6, §11, §18.5 / [RPO and integrity test]

### ADR-PLATFORM-001: Hosting choice (hosting part)

<!-- Only the hosting part is a Pre-SDD decision: cloud, on-prem, or hybrid, and a named provider only when the business makes it a hard constraint (BUS-07, DAT-04, SEC-01). Managed against self-managed, the provider when it is not constrained, and the products are the SDD's. -->

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Owner] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** ECO-01, ECO-06, BUS-07, HDR-08 [and the entries that apply]
- **Business context:** [Why]
- **Hard constraints:** [Residency, prohibitions, obligations, by entry ID]
- **Options considered:** [Placements compared; OPT-NN]
- **Evidence:** [CALC-21@OPT-NN, CALC-22@OPT-NN, rule IDs]
- **Option comparison:** [The same aspects for each placement compared, from chunk 07]
- **Decision and rationale:** [The hosting target, as chunk 05 states it]
- **Left to the SDD:** the provider when not constrained, managed or self-managed, and the products.
- **Consequences and residual risks:** [Consequences]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** Q8, §8.3, §8.6 / [Compliance and TCO validation]

### ADR-MIG-001: Workload 7R and transition

<!-- Exists only when the migration overlay applies (chunk 08 is present); leave this whole ADR out, heading included, when it does not. It is a Pre-SDD decision because the 7R and the transition shape are numbers and shape, not products. Fed by OVL-04 (the 7R per workload) and the cutover items OVL-08, OVL-09, and OVL-10. -->

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Migration owner] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** OVL-04, OVL-08, OVL-09, OVL-10, DT-11 [and the entries that apply]
- **Business context:** [Why the workloads move, and what the downtime contract (OVL-09) allows]
- **Hard constraints and agreed targets:** [Entry IDs and their status, including the approved cutover window]
- **Options considered:** [The Rs compared per workload, for example "rehost" and "replatform"; OPT-NN]
- **Evidence:** [CALC-17, rule IDs, rehearsals]
- **Option comparison:** [The same aspects for each R compared, per workload, in shape words]
- **Decision and rationale:** [The one primary R per workload (OVL-04), the dependency waves, the cutover mode, the fallback, and the no-return point, as chunk 08 states them]
- **Consequences and residual risks:** [Consequences; risks by ID in chunk 10]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** Migration plan, data, network / [Rehearsal and reconciliation]

## 9.5 SDD ADRs Driven by This Pre-SDD

<!-- The other ADRs of the Standard's set are SDD decisions: the SDD writes them and cites the Pre-SDD answers that drive them as PSDD/<ID>. List each with those answers, by entry ID and status; never pre-decide them here. -->

| SDD ADR | Decides | Driving answers |
|---------|---------|-----------------|
| ADR-PERF-001 Workload processing model | Synchronous or queued processing; compute, cache, and store strategy | [CAP-01.n, CAP-04.n, CAP-07.n, CALC-NN] |
| ADR-INT-001 Integration reliability | The mechanism: broker, outbox, deduplication, or synchronous calls | [INT-02.n, INT-04.n, INT-05.n] |
| ADR-IAM-001 Identity and tenancy | The identity product, the authorization model, and the schema strategy within the isolation level | [SEC-02.n, DAT-07.n] |

---

# 10. Validation, Risks and Unknowns

<!-- Written in quick and full mode. In quick mode this section closes the discovery: the stage 1 values by status come from the register chunks, and the unknowns register below lists every open question with its impact, owner, and due date. -->

## 10.1 Validation and Unknowns

<!-- The engine renders the validation from the project state (fragment `10-validation.md`): the blockers (including the DT STOP and BLOCK findings), the conflicts (a failure scope the shape cannot satisfy, a hard entry an option breaks), and the advisories, each with its ID, message, owner, and entry; then the unknowns QD-NN, the open ones with their entry, impact, owner, and due date, and the closed ones with their resolution. A conflict is never smoothed over in prose. Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 10-validation.md -->
**Blockers**

| ID | Message | Owner | Entry |
|----|---------|-------|-------|
| [Finding ID] | [Message] | [Owner] | [Entry ID, or none] |

**Conflicts**

| ID | Message | Owner | Entry |
|----|---------|-------|-------|
| [Finding ID] | [Message] | [Owner] | [Entry ID, or none] |

**Advisories**

| ID | Message | Owner | Entry |
|----|---------|-------|-------|
| [Finding ID] | [Message] | [Owner] | [Entry ID, or none] |

**Unknowns**

| ID | Question | Entry | Impact | Owner | Due | Status | Resolution |
|----|----------|-------|--------|-------|-----|--------|------------|
| QD-01 | [Question] | [Entry ID, or none] | [Impact] | [Owner name] | [YYYY-MM-DD] | [open / closed] | [Resolution, when closed] |
<!-- /ENGINE-FRAGMENT -->

## 10.2 Risks

<!-- The risks the register and the shape imply, beyond the engine's findings: each with its ID (`R-NN`, the next free number, never renumbered or reused), likelihood, impact, mitigation, owner, and the IDs it rests on. A high risk still open at G3 must be closed or formally accepted by an empowered owner (G3-11, DT-15); never accept one in prose. -->

| ID | Risk | Likelihood | Impact | Mitigation | Owner | Linked IDs |
|----|------|------------|--------|------------|-------|------------|
| R-01 | [Risk] | [Low / Medium / High] | [Low / Medium / High] | [Mitigation] | [Owner] | [Entry, finding, or QD IDs] |

## 10.3 Hard Entries Still Open

<!-- Every hard entry (kind `hard`) that is Open, with its owner and due date, and the exception that lets it pass, if any (EXC-NN, who granted it, its expiry and review date, from the gate fragment in chunk 11). Only a named person grants an exception. In quick mode there is no gate: list the Open hard entries only. Write "None" when there are none. -->

| Entry | Owner | Due | Exception |
|-------|-------|-----|-----------|
| [Entry ID] | [Owner name] | [YYYY-MM-DD] | [EXC-NN: granted by <name>, expires YYYY-MM-DD, review YYYY-MM-DD; or "None"] |

---

# 11. Gate and Sign-off

<!-- Rules: gates-and-signoff.md. The gates are the Standard's: G0 Initiate, G1 Discover, G2 Assess, and G3 Approve, with the 14-line G3 checklist (§ 11.1) and the sign-off register (§ 11.2). G3 is signed in chat only, at the skill's G3 stop, after the write-up and the review; the Studio shows the register read-only. Only a person ticks a checklist line; only a named person, never a stand-in, grants an exception; the skill never signs. Rewrite this section from the new fragment after every signing: writing a signature here is not a content change, so it reopens nothing and bumps nothing. -->

## 11.1 Gate Result

<!-- The engine renders the gate from the project state (fragment `11-gate.md`): G0, G1, and G2 with what each still misses; the G3 status (Not signed, Blocked, Review, Approved, or Approved with conditions) and every problem it names; the gate label and whether the SDD is authorized to start; the G3 checklist G3-01 to G3-14, each Done or N/A with its reason, or Open, with who ticked it and when; the sign-off register, one row per applicable role (the migration owner only with the overlay), each with its signer, decision, and UTC time, or not applicable with the reason, or Not signed, and whether it counts, a stand-in marked as one; the conditions COND-NN with owner and due date; and the exceptions EXC-NN with the entry, who granted it, the reason, the expiry, and the review date. Paste it unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 11-gate.md -->
| Gate | Result | Missing |
|------|--------|---------|
| G0 Initiate | [Met / Not met] | [What is missing] |
| G1 Discover | [Met / Not met] | [What is missing] |
| G2 Assess | [shortlist / blocker / incomplete] | [What is missing] |
| G3 Approve | [Not signed / Blocked / Review / Approved / Approved with conditions] | [Problems] |

**Gate label:** [Draft / G0 / G1 / G2 / Blocked / G3 Approved / G3 Approved with conditions]

**Authorized to start the SDD:** [Yes / No]

**G3 checklist**

| Line | Text | Status | Reason (N/A) | Ticked by | At |
|------|------|--------|--------------|-----------|----|
| G3-01 | A named business sponsor and product owner approved the problem, scope and success measures. | [Done / N/A / Open] | [Reason] | [Name] | [UTC] |

**Sign-off register**

| Role | Name | Decision | At | Comments |
|------|------|----------|----|----------|
| Business sponsor | [Name, or Stand-in: Approver (policy, set by name, date)] | [Approved / Approved with conditions / Rejected / Not applicable: reason / Not signed] | [UTC] | [Counted / Not counted][, stand-in] |

**Conditions**

| ID | Condition | Owner | Due |
|----|-----------|-------|-----|
| COND-01 | [Condition] | [Owner name] | [YYYY-MM-DD] |

**Exceptions**

| ID | Entry | Reason | Granted by | Expires | Review | Valid |
|----|-------|--------|------------|---------|--------|-------|
| EXC-01 | [Entry ID] | [Reason] | [Name] | [YYYY-MM-DD] | [YYYY-MM-DD] | [yes / no] |
<!-- /ENGINE-FRAGMENT -->

## 11.2 SDD Initiation Authorized By

<!-- One line, written from the gate fragment after every signing: when the engine reads G3 Approved or Approved with conditions (authorized), the signers by role, the latest signature time, and the conditions the SDD carries; otherwise "Not authorized:" and the G3 status with the problems still named. A quick Pre-SDD claims no gate and authorizes no SDD (this section is not written in quick mode). -->

**SDD initiation authorized by:** [Each signer with the roles they signed, YYYY-MM-DD; with conditions COND-NN] | [Not authorized: G3 <status>; see § 11.1]

---

# 12. SDD Handoff Guide

<!-- AUDIENCE: sdd-unifier (the Software Architect). It reads this section first, then the cover's gate line, then § 11, and never this skill's rule files, so the guide is self-contained. -->

> **What this guide is.** The contract between this Pre-SDD and the SDD that builds on it. The Pre-SDD settles numbers and shape (TPS and RPS, latency budgets, availability, RTO and RPO, data growth, bandwidth, cost; hosting target, fault scope, DR strategy, topology, data-store shape). Once G3 is signed, every item in § 12.2 is **locked** for the SDD: the SDD cites it and designs to it, and never changes it. The SDD picks the products, versions, architecture style, and detailed design (§ 12.4).

<!-- Rules for writing this section: handoff-guide.md. Rewrite it after every compute and after every signing (§ 12.1 and § 12.5 change with the gate; writing a signature bumps nothing). Every value comes from the engine fragments; none is restated from memory. -->

## 12.1 Pre-SDD, Gate and Signers

<!-- Copied from the cover and the gate fragment in § 11. The Gate row holds the engine's gate label only, as the cover's gate line opens with it; the G3 status and the authorization have their own rows, and the cover keeps the full gate line. -->

| Item | Value |
|------|-------|
| Pre-SDD | [Project Name], version [X.X] (this file) |
| Source BRDs | [KEY] v[X.X] ([status]) [one per BRD, as chunk 00 lists them] |
| Gate | [the engine's gate label only: Draft / G0 / G1 / G2 / Blocked / G3 Approved / G3 Approved with conditions] |
| G3 status | [Not signed / Blocked / Review / Approved / Approved with conditions] |
| Authorized to start the SDD | [Yes / No] |
| Signers | [Role: name, decision, YYYY-MM-DD, one per applicable role; a stand-in marked as one; or "Not signed"] |
| Engine | pre-sdd-engine [3.0.0], skill pre-sdd-unifier [1.0.0] |

**How the SDD reads this gate:**

- **G3 Approved or Approved with conditions** (authorized `Yes`, and the cover's gate line does not read `Review`): load this Pre-SDD and lock every item in § 12.2.
- **Any other G3 status** (`Not signed`, `Blocked`, or `Review`): the Pre-SDD is not signed. Do not load it. Stop, and raise a handoff request to the E2E Architect (`pre-sdd-unifier`) on `unifier-status.md` that lists what G3 still needs (§ 11.1).
- A content change after G3 sends G3 back to `Review` until every applicable role signs again; until then the SDD treats the new version as not signed: a new SDD waits, and an SDD that loaded an earlier signed version keeps that version locked.

## 12.2 Locked Items

<!-- The engine renders the lock list (fragment `12-locked-items.md`): one row per entry of every row in the landing map, in register order, with the entry ID, what it measures (the row's title and the entry's label or scope, in the register's words), the value with its unit (TBD when it has none) and, for a data workload (DAT-01), its store kind, the status, the owner (as the register prints it; the row's owner when the entry has none), and where it lands in the SDD; then the calculations: each `CALC-NN` of chunk 04 with what it measures and its value with its unit (TBD when it is open), in chunk 04's words, which §18 cites; then the target-shape decisions: hosting, topology, the DR strategy per failure scope, the data shape (store kind and consistency), and the chosen option when one is set; then the landing table: each SDD place with the rows that land there, in register order, from the engine's landing map. Paste it unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 12-locked-items.md -->
| ID | Measures | Value | Status | Owner | Lands in the SDD |
|----|----------|-------|--------|-------|------------------|
| [Entry ID] | [Row title; entry label or scope] | [value and unit, or TBD] | [Status] | [Owner] | [Project Type / Q3 / Q7 / Q8 / §6 Notes / §8.3 / §8.6 / §8.7 / §11 / §18 / §18.5 / §19 / §20] |

| ID | Measures | Value |
|----|----------|-------|
| [CALC-NN] | [Calculation, as chunk 04 names it] | [value and unit, or TBD] |

| Decision | Value |
|----------|-------|
| Hosting | [cloud / onprem / hybrid] |
| Topology | [Topology] |
| DR strategy, scope [scope] | [Strategy] |
| Data | [kind, consistency] |
| Chosen option | [OPT-NN, or none] |

| Lands in the SDD | Rows |
|------------------|------|
| [Project Type / Q3 / Q7 / Q8 / §6 Notes / §8.3 / §8.6 / §8.7 / §11 / §18 / §18.5 / §19 / §20] | [Row IDs, in register order] |
<!-- /ENGINE-FRAGMENT -->

An item that reads `TBD` or `Open` is locked as open: the SDD carries it as an open question that says what it measures and names its owner (the Measures and Owner columns), links it to its register row through its `PSDD/<ID>` link (where its due date stands), and never fills it.

## 12.3 Where Each Item Lands in the SDD

The lock is on numbers and shape, never on the SDD's own questions. Which rows land in each place is the landing table of the locked-items fragment in § 12.2, which the engine renders from its landing map; this section never copies it. How the SDD applies what lands in each place:

| SDD place | How the SDD applies it |
|-----------|------------------------|
| Project Type | Pre-fills the Project Type question with the change type (HDR-07). The Standard's brownfield means a workload or state to preserve; the SDD's means a codebase to extend. When this Pre-SDD is brownfield with no codebase to extend (for example a rewrite with a data migration), the SDD answers Greenfield and carries the migration context. |
| Q3 (load and availability) | The evidence for Q3, cited as `PSDD/<ID>`. Q3 stays the SDD's choice. |
| Q7 (multi-tenancy model) | Q7 is chosen within the isolation level of DAT-07 (tenancy model and isolation level): `single` allows Single tenant; `shared-logical` allows shared schema with `tenant_id`, schema per tenant, or database per tenant; `schema-isolated` allows schema per tenant or database per tenant; `database-isolated` and `deployment-isolated` allow database per tenant. |
| Q8 (deployment target) | The hosting target (cloud, on-prem, or hybrid; a provider only when the business made it a hard constraint) is locked. The runtime option is the SDD's. |
| §6 Notes | Each affected §6 row carries the constraint in its Notes; the data-store row carries the store kind of each data workload (DAT-01), and the product stays the SDD's. A product that breaks a constraint becomes an open item (§ 12.6). |
| §8.3 (high-level architecture) | The diagram follows the hosting, data, integration, and network shape: the data workloads and their store kind (DAT-01), and the external dependencies with the partner quotas, latencies, SLAs, maintenance windows, and rate limits they impose (INT-03). |
| §8.6 (infrastructure architecture) | The deployment topology follows the hosting target, the topology, the availability targets, the failure scopes, the residency, and the client and edge locations: the regions or sites, the zones, and the redundancy cite them as `PSDD/<ID>`. §8.6.4 (backup and disaster recovery) is the home of the RTO and RPO per failure scope, with the DR strategy of each scope and the restore granularity; the §18.5 row of a recovery NFR links there and restates neither figure. The storage redundancy and replication meet the durability and correctness targets (REL-10). |
| §8.7 (network architecture) | The zones, the ingress and egress paths, TLS termination, the network policies, and administrative access follow the network constraints: address ranges and private connectivity, allow-lists, firewall, DNS and proxy dependencies, client and edge locations, where residency lets data flow, the threat posture, encryption in transit, and privileged access, each cited as `PSDD/<ID>`. |
| §11 (cross-cutting concerns) | The defaults follow the DR strategy, the data classification, residency and retention, the isolation level, the security obligations, the business prohibitions and obligations (BUS-07, BUS-08), and the durability and correctness targets (REL-10). |
| §18 (performance and capacity) | §18 cites the `PSDD/CALC-NN` values from the calculations table of § 12.2, each linked to its chunk 04 anchor (§ 12.7), and never recomputes them. It sizes within the partner quotas and latencies (INT-03) and for the peak simultaneously active users (CAP-03), which no calculation reads, and its latency targets are measured where CAP-08 says, with what counts as a failure. |
| §18.5 (NFR targets) | The settled targets; each BRD NFR row cites the entry that quantifies it. A latency target states its measurement point and what counts as a failure (CAP-08); a durability or correctness NFR takes its target from REL-10. |
| §19 (environments) | The environments follow the DR strategy and the environment list. |
| §20 (operations runbook) | The runbook follows the DR strategy, the recovery sequence, the failover authority, and the restore granularity. |

## 12.4 Left to the SDD

The Pre-SDD settles nothing below; the SDD decides each, within the locked items:

- **Products and versions** for every layer, and managed or self-managed.
- **The architecture style** (Q4), **communication** (Q5), and **data ownership** (Q6). The Pre-SDD gives only their drivers.
- **The provider**, when the business did not make one a hard constraint.
- **Detailed DR procedures**, failover mechanics, and the environment layout.
- **Per-service sizing**, the per-service breakdown, and caching.
- **The schema strategy** per service (Q7, within the isolation level), partitioning, and ERDs.
- **The integration mechanism** (broker, outbox, synchronous calls) and the contracts.
- **The identity product** and the authorization model; the network design, firewall rules, and routes; the cost per component.
- **The SDD ADRs** ADR-PERF-001 (workload processing model), ADR-INT-001 (integration reliability), and ADR-IAM-001 (identity and tenancy), each citing the Pre-SDD answers that drive it ([09 § 9.5](#95-sdd-adrs-driven-by-this-pre-sdd)). The Pre-SDD ADRs ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001 are locked, and so is ADR-MIG-001 (workload 7R and transition) when the migration overlay applies ([09 § 9.4](#94-pre-sdd-adrs)).

## 12.5 Conditions, Exceptions and Unknowns

<!-- Copied from the gate fragment (chunk 11) and the validation fragment (chunk 10): every condition of an Approved with conditions sign-off, every time-bound exception, and every unknown that did not block G3, each with its owner and due date. Write "None" under a heading with none. -->

**Conditions** (the SDD shows each open condition as a §4 risk citing `PSDD/COND-NN`):

| ID | Condition | Owner | Due |
|----|-----------|-------|-----|
| COND-01 | [Condition] | [Owner name] | [YYYY-MM-DD] |

**Exceptions** (an `Open` hard entry that a named person let pass G3 until its expiry; the person who granted it owns it, and the expiry is its due date):

| ID | Entry | Granted by (owner) | Expires (due) | Review |
|----|-------|--------------------|---------------|--------|
| EXC-01 | [Entry ID] | [Name] | [YYYY-MM-DD] | [YYYY-MM-DD] |

**Unknowns** (open questions the SDD carries, never fills):

| ID | Question | Entry | Owner | Due |
|----|----------|-------|-------|-----|
| QD-01 | [Question] | [Entry ID, or none] | [Owner name] | [YYYY-MM-DD] |

## 12.6 When the SDD Disagrees

The SDD never edits a locked item, and never edits this Pre-SDD. When it finds a locked item wrong, or in conflict with a source or a design need:

1. It raises an open item in its chunk 18, with `Owner: E2E Architect (pre-sdd-unifier)`, citing the item as `PSDD/<ID>`. Its e2e gate treats the item like any other open item.
2. It raises a handoff request to the E2E Architect on `unifier-status.md`, naming the open item.
3. The E2E Architect decides with the owner: change the item, or keep it with the reason. A change runs one Pre-SDD update with a new version, a review, and the G3 sign-off again.
4. The E2E Architect raises a handoff request back to the Software Architect: "Pre-SDD has a new version", naming the open item, or the decision to keep the item with its reason. The SDD closes its open item on its next run.

## 12.7 Citing This Pre-SDD

Cite every Pre-SDD ID as `PSDD/<ID>`, with a link to where it lives in this file (there is one Pre-SDD per SDD; the links below are written from the SDD folder):

- a register row or entry links to its row heading: [PSDD/REL-03.2](../PRE-SDD-[ProjectName]-vX.Y.md#rel-03);
- a header row or entry links to its row heading in § 1.1, where the header rows stand: [PSDD/HDR-07.1](../PRE-SDD-[ProjectName]-vX.Y.md#hdr-07);
- a calculation links to [04 § 4.2](../PRE-SDD-[ProjectName]-vX.Y.md#42-calculations) (`PSDD/CALC-03`), and an option's rows to [07 § 7.1](../PRE-SDD-[ProjectName]-vX.Y.md#71-options) (`PSDD/CALC-21@OPT-02`);
- a condition or an exception links to [11 § 11.1](../PRE-SDD-[ProjectName]-vX.Y.md#111-gate-result) (`PSDD/COND-01`, `PSDD/EXC-01`);
- an unknown links to [10 § 10.1](../PRE-SDD-[ProjectName]-vX.Y.md#101-validation-and-unknowns) (`PSDD/QD-03`);
- a Pre-SDD ADR links to [09 § 9.4](../PRE-SDD-[ProjectName]-vX.Y.md#94-pre-sdd-adrs) (`PSDD/ADR-DR-001`), and a decision rule to [09 § 9.2](../PRE-SDD-[ProjectName]-vX.Y.md#92-decision-tree) (`PSDD/DT-07`).

Entry IDs are the row ID, a dot, and the entry number (`REL-03.2`; `.1` is the primary entry). BRD IDs keep their BRD key (`REFUNDS/NFR-03`). An ID is never renumbered or reused.

---

# 13. Open Items & Clarifications

<!-- Written in full mode only, by the cleared-context reviewer after the write-up and before the G3 stop (review-and-open-items.md); then the accept loop runs. An accepted answer that changes a value goes into the project state through `derive --apply` and a new `compute`, never into a fragment by hand. -->

> **What this section is.** A backlog of findings a reviewer with cleared context raised after the Pre-SDD was written. Each comes with a **Recommended Answer**, a concrete resolution ready to apply. Items are decisions awaiting a person's acceptance.
>
> **What this section is not.** It is not a list of the inline `[NEEDS CLARIFICATION: ...]` markers or the unknowns (`QD-NN`, chunk 10): those stay where they are. It is not the engine's validation (chunk 10) either; a finding here may point at one, for example a conflict the prose smooths over.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions, never renumbered or reused. |
| **Where** | Chunk and section (for example `03c § 3.3`, `05 § 5.3`), or "global". |
| **Type** | Missing source / Guessed value / Fragment mismatch / Product named / Open hard item / Conflict / Lock-list gap / ID error / Dash character / Ambiguity / Risk / Duplication (BRD content restated instead of cited). |
| **Concern** | One paragraph: what is wrong and why it matters for the G3 sign-off or the SDD. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The proposed resolution, ready to apply: the project-state change (the entry and its new value, status, or source) or the exact text for the chunk. A finding that needs no change reads `No change: <evidence>`. Applicable: a value or label change names the op and who may run it (a Confirmed or person-answered value changes only by a person); a change no op can make is recommended as ops that can, for example "close QD-NN and add a new unknown with the corrected owner or due date". |
| **Why** | REQUIRED. One or two lines: the evidence behind the recommendation and the tradeoff it accepts. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Decided - pending application / Decided - waiting for a person / Accepted - applied / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`. |

Write the Status field as the literal legend value, for example `- **Status:** Accepted - applied`. Put the update link on a separate `- **Resolution:**` line.

---

## Open Items

### OI-01: [Short title]

- **Where:** [Chunk and section, or "global"]
- **Type:** [Missing source | Guessed value | Fragment mismatch | Product named | Open hard item | Conflict | Lock-list gap | ID error | Dash character | Ambiguity | Risk | Duplication]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
  - **C.** [Option C] - [one-line tradeoff]. *(Optional.)*
- **Recommended Answer:** [Option letter + the concrete resolution, e.g. "Option A - set REL-04.2 to Open with owner and due date (its value has no source); ask the data owner".]
- **Why:** [The reason this option wins, with its evidence.]
- **Status:** Open

---

<!-- Repeat the OI block for each open item. -->

---

## Resolution Log

<!-- When an open item is decided, add its row here with a pointer to the change (the chunk and heading, or the project-state entry). A source is a person's answer, a BRD version (`[KEY] v[X.X]`), or an answer policy (`Policy: <policy> (set by <name>, <date>)`). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk and section, or entry ID] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected / Settled by [source]] |

---

## Reviewer Notes

<!-- Coverage record first (required): one row per check in the reviewer brief (review-and-open-items.md § The checks), each "checked: N findings (OI IDs)" or "checked: no issue found", with what was checked. A zero-finding review is valid. A delta review adds one dated row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN (vX.X)`; a scoped application pass adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: OI-NN (vX.X)`. A light run says so in the first row, so what it skips reads as intentional. A defect a delta review or an application pass notices outside its scope is a note labelled `Out of scope, for the next review`, not an open item. -->

| Check | Checked | Findings | Notes |
|---|---|---|---|
| [Every value has a source] | [What was checked] | [N findings (OI-NN), or No issue found] | [Notes] |

- [Note]
