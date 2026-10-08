<!--
CHUNK: 01
TITLE: Purpose and Scope
PROJECT: Refunds Platform
VERSION: 1.3
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 1. Purpose

Define the build target for Refunds Platform [SDD 1.12](../sdd-refunds-platform/refunds-platform-sdd-master.md): module wiring, transaction boundaries, algorithms, persistence, operations, and the implementation trace. This is a design, not a claim that application code exists.

# 2. Scope

## 2.1 In Scope

All five modules in [SDD §13](../sdd-refunds-platform/09-services-summary.md), both web apps, their existing reports and source-defined platform jobs. The use-case trace follows [SDD §7.3](../sdd-refunds-platform/03-users-and-use-cases.md) and REFUNDS 1.9 / LOYALTY 1.8.

## 2.2 Out of Scope

Use the source [SDD scope](../sdd-refunds-platform/01-executive-summary-scope-risks.md) and the two BRD scope chunks. No new business behavior is authorized by a technical default. Provider interfaces cannot be implemented against an invented URL or schema. The REFUNDS objective calculation and the LOYALTY upheld-complaint tally stay with their named owners outside the product ([REFUNDS 01](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives), [LOYALTY 09](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics)); neither adds a reporting store or product field.

# 3. Assumptions

Design assumptions and their owners stay in [SDD §3](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions), Assumptions 7 and 8 among them; the rows below are this LLD's implementation assumptions only.

| ID | Assumption | Source | Risk if false |
| --- | --- | --- | --- |
| A-02 | SDD and BRD snapshots are current for this run | [SDD lineage](../sdd-refunds-platform/00-cover-and-changelog.md) | Refresh targeted chunks before implementation |
| A-03 | All fixture answers remain test values, not production approval | decision-log.md | Owners must replace fixture settings before release |
| A-04 | API-07, API-08 and API-09 arrive as provider calls on the gateway provider routes, so `LoyaltyFeedAdapter` is an inbound HTTP adapter | [SDD §3 Assumption 8](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions) | An SDD design change first, then a refresh of loyalty-points §7.2 and 06 §9.1 |


# 4. Glossary

Domain vocabulary remains in [SDD §5](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary). LLD terms: publication identity = stable Spring Modulith delivery identity; work claim = bounded database lock/lease used to serialize a provider send; replay response = first stored result for a tenant/idempotency key.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->
