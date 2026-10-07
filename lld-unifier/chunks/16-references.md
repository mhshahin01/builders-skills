<!--
CHUNK: 16
TITLE: References
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 19. References

## 19.1 Source Documents

<!-- One row per source BRD, keyed as in the SDD's Source BRDs register. The use-case trace rows record the upstream state the trace was built from, so a later run can see what changed (sdd-to-lld.md § Use-case traceability). The Related SDD version is what SKILL.md step 3c compares with the SDD's current version on the next run. Each version cell holds the upstream version this LLD last read, at its build or its last accepted refresh. It is not the version in which that part last changed, so the §7.3 row repeats the Related SDD version. -->

| Document | Path / URL | Version / state | Notes |
|----------|------------|-----------------|-------|
| Related BRD ([KEY]) | [[brd-slug]-brd-master.md](../brd-[brd-slug]/[brd-slug]-brd-master.md) [or `Not applicable`] | [version] | Key from the SDD's Source BRDs register |
| Related SDD | [[sdd-slug]-sdd-master.md](../sdd-[sdd-slug]/[sdd-slug]-sdd-master.md) [or `Not applicable`] | [version] | |
| SDD §7.3 Use Case Traceability | [03-users-and-use-cases.md § 7.3](../sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | SDD v[X.X] | Owners and entry points of the traced use cases |
| [KEY] UAT/BAT test cases (BRD chunk 16) | [16-uat-bat-test-cases.md](../brd-[brd-slug]/16-uat-bat-test-cases.md) [or `Not written`] | [Up to date / Provisional (TD-NN) / Stale / Pending (BRD 16 not written)] | Test case IDs and their `Related UC` |
| [KEY] Mockup coverage (BRD chunk 14) | [14-todo.md § Mockup coverage](../brd-[brd-slug]/14-todo.md#mockup-coverage) | [as of BRD v[X.X]] | `MK-NN` rows (the screen references, one per screen or flow) and their use cases; the Figma links stay in the BRD row |
| Source code repo | [URL] | [commit / branch] | (from-code / hybrid) |

## 19.2 Architectural Decision Records

| ADR ID | Title | Status | Link |
|--------|-------|--------|------|
| ADR-01 | [Title] | Accepted | [link] |

> Note: ADRs that affect this LLD's design - even if owned by SDD level - should be cross-linked here for traceability.

## 19.3 OpenAPI Specifications

| Service | Path / URL | Notes |
|---------|------------|-------|
| `[service-a]` | [path/openapi.yaml] | Source of truth for §9 API Contracts |

## 19.4 Event Schemas

| Topic | Schema location | Notes |
|-------|------------------|-------|
| `foo.lifecycle.created` | [schema registry URL or file path] | |

## 19.5 Runbooks

| Runbook | Location | Linked from |
|---------|----------|-------------|
| RB-01 Drain outbox backlog | `10-operations.md` § 13.8 | Alert `OutboxBacklog` |
| RB-02 Replay DLQ | `10-operations.md` § 13.8 | Alert `DLQ rows` |

## 19.6 Threat Model

| Document | Path / URL |
|----------|------------|
| Threat model | [link] |

## 19.7 External References

| Reference | URL |
|-----------|-----|
| RFC 9457 ProblemDetails | https://www.rfc-editor.org/rfc/rfc9457 |
| OpenTelemetry Java SDK | https://opentelemetry.io/docs/languages/java/ |
| Resilience4j docs | https://resilience4j.readme.io/ |
| Flyway docs | https://flywaydb.org/documentation |

## 19.8 Related LLDs (sibling projects, cross-references)

| LLD | Reason for cross-reference |
|-----|----------------------------|
| [LLD path] | [Why related] |

## 19.9 Use-Case Traceability Index

<!--
The production-bug entry point: a consolidated view, never a home (sdd-to-lld.md § Use-case traceability). One row per SDD §7.3 row, in the same order and BRD groups (repeat §7.3's group rows), merged and removed use cases included. Each column is read from its home and never states a mapping its home does not state:
  Use case (BRD), Title, Status: SDD §7.3 (the BRD's ID and title, with the SDD's key; Status is Active, Merged into [KEY]/UC-NN (keyed), or Removed, copied from SDD §7.3).
  SDD §7.3: the §7.3 heading link.
  LLD workflow: the ### [KEY]/UC-NN heading in the owner's 04-implementation file, labelled with the owner; "Not in this LLD - owner: [service]" when the owner is out of scope (linked to its LLD when the SDD's Child LLDs table names one); "Not built yet - [service]", linked to its placeholder, when the owner has no code yet.
  Screens (BRD), Routes (LLD): 14-frontend.md § 17.3; "Not applicable - no UI" when chunk 14 is omitted.
  UAT/BAT test cases (BRD): BRD chunk 16, one by one, never a range; "Pending (BRD 16 not written)" while it is locked.
  E2E specs (LLD): 13-testing.md § 16.8.
Merged and removed rows show "-" in every mapping column. Checked both ways: every §7.3 row has a row here, and every cell here equals its home.
With no source BRD, write "Not applicable - no source BRD."
-->

> **Start here for a production bug.** Take the `use_case` and `screen` from the error report, log line, or span (`09-cross-cutting.md` § 12.7-12.8), or search this table for the route, screen, or test case. The row links to the workflow block, the BRD use case, the SDD §7.3 row, the test cases, and the spec.

| Use case (BRD) | Title | SDD §7.3 | LLD workflow | Screens (BRD) | Routes (LLD) | UAT/BAT test cases (BRD) | E2E specs (LLD) | Status |
|----------------|-------|----------|--------------|---------------|--------------|--------------------------|-----------------|--------|
| **[[BRD project name] v[X.X]](../brd-[brd-slug]/[brd-slug]-brd-master.md) ([KEY])** | | | | | | | | |
| [[KEY]/UC-01](../brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | [Title, as in the BRD] | [§7.3](../sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | [[service-a]](./04-implementation/[service-a-slug].md#[key-lowercase]uc-01-[title-slug]) | [[KEY]/MK-01](../brd-[brd-slug]/14-todo.md#mockup-coverage) | `/foo` | [[KEY]/TC-[AREA]-01](../brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]), [[KEY]/TC-[AREA]-02](../brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) | `e2e/[key-lowercase]-uc-01-[title-slug].spec.ts` | Active |
| [[KEY]/UC-02](../brd-[brd-slug]/05-user-journeys-overview.md#use-case-summary) | [Title] | [§7.3](../sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | - | - | - | - | - | [Merged into [KEY]/UC-01 / Removed] |
| [[KEY]/UC-03](../brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-03-[title-slug]) | [Title] | [§7.3](../sdd-[sdd-slug]/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) | Not in this LLD - owner: [service-z] ([LLD](../lld-[other-slug]/[other-slug]-lld-master.md)) | - | - | [[KEY]/TC-[AREA]-03](../brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) | - | Active |

<!-- MASTER: [project-slug]-lld-master.md | PREV: 15-open-questions.md | NEXT: 17-specs.md -->
