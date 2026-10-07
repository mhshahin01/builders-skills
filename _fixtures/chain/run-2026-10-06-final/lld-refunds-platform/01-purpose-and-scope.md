<!--
CHUNK: 01
TITLE: Purpose and Scope
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 1. Purpose

Define the build target for Refunds Platform SDD 1.3: module wiring, transaction boundaries, algorithms, persistence, operations, and the implementation trace. This is a design, not a claim that application code exists.

# 2. Scope

## 2.1 In Scope

All five modules in [SDD §13](../sdd-refunds-platform/09-services-summary.md), both web apps, their existing reports and source-defined platform jobs. The use-case trace follows [SDD §7.3](../sdd-refunds-platform/03-users-and-use-cases.md) and both BRDs 1.7.

## 2.2 Out of Scope

Use the source [SDD scope](../sdd-refunds-platform/01-executive-summary-scope-risks.md) and the two BRD scope chunks. No new business behavior is authorized by a technical default. Provider interfaces cannot be implemented against an invented URL or schema.

# 3. Assumptions

| ID | Assumption | Source | Risk if false |
| --- | --- | --- | --- |
| A-01 | One delivery team builds both products | [SDD ADR-01](../sdd-refunds-platform/06-principles-and-decisions.md) | Revisit extraction trigger with Head of Retail |
| A-02 | SDD and BRD snapshots are current for this run | [SDD lineage](../sdd-refunds-platform/00-cover-and-changelog.md) | Refresh targeted chunks before implementation |
| A-03 | All fixture answers remain test values, not production approval | decision-log.md | Owners must replace fixture settings before release |


# 4. Glossary

Domain vocabulary remains in [SDD §5](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary). LLD terms: publication identity = stable Spring Modulith delivery identity; work claim = bounded database lock/lease used to serialize a provider send; replay response = first stored result for a tenant/idempotency key.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->
