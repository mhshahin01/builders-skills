<!--
CHUNK: 04
TITLE: Targets and Calculations
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03a-03h
PART OF: Pre-SDD - [Project Name]
-->

# 4. Targets and Calculations

<!-- Every number in this chunk comes from the engine: the register fragments (03a to 03h) and the calculations fragment below. None is worked out by hand or in prose. A value with an Open input reads TBD, never zero. -->

## 4.1 Targets

<!-- The settled targets, by entry ID, one table per kind: the service level objectives (REL-01 per journey, REL-02), the latency budgets (CAP-07 per journey, measured where CAP-08 says), the recovery targets (REL-03 and REL-04 per scope, journey, and dataset; REL-05 per failure scope), and the capacity drivers (CAP-01, CAP-03, CAP-04, CAP-05, DAT-02). Copy each value with its unit and status from the register fragment; write TBD where the fragment does. -->

| Target | Entry | Value | Status | Register |
|--------|-------|-------|--------|----------|
| [Availability SLO, journey] | REL-01.1 | [value and unit, or TBD] | [Status] | [03c](./03c-register-reliability.md#rel-01) |
| [P99 latency, journey] | CAP-07.1 | [value and unit, or TBD] | [Status] | [03b](./03b-register-capacity.md#cap-07) |
| [RTO, scope and journey] | REL-03.1 | [value and unit, or TBD] | [Status] | [03c](./03c-register-reliability.md#rel-03) |
| [RPO, scope and dataset] | REL-04.1 | [value and unit, or TBD] | [Status] | [03c](./03c-register-reliability.md#rel-04) |
| [Peak transactions, type] | CAP-01.1 | [value and unit, or TBD] | [Status] | [03b](./03b-register-capacity.md#cap-01) |

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

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 03h-register-economics.md | NEXT: 05-target-shape.md -->
