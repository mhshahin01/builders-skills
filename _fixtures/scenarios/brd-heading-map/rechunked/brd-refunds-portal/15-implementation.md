<!--
CHUNK: 15
TITLE: Implementation Plan
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 02, 03, 05, 06a, 06b, 07, 08, 09, 10, 11, 13, 14
PART OF: BRD - Refunds Portal
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared: all five steps Complete with evidence, every to-do item Resolved (Deferred does not count), no override. Never written or refreshed while the gate is shut.
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: One actionable, dependency-ordered plan that consolidates every 06* use case into implementation tasks other agents can pick up: what to do, in what order, and how completion is assessed.
LANGUAGE: Business language only. Tasks describe capabilities to deliver, never technology, architecture, or tooling. The how is owned by the SDD and LLD.
RULES: delivery-chunks.md in the brd-unifier skill. The BRD body is authoritative; this plan cites it and never adds requirements.
-->

# Implementation Plan

**Status:** Up to date | **Basis:** BRD v1.0 (see [14-todo.md](./14-todo.md))

## Waves

| Task | Title | Type | Wave | Use cases | Depends on | Status basis |
|------|-------|------|------|-----------|------------|--------------|
| TASK-01 | Refund requests | Use-case delivery | 1 | UC-01 | None | Confirmed |
| TASK-02 | Request tracking and cancellation | Use-case delivery | 2 | UC-02, UC-03 | TASK-01 | Confirmed |
| TASK-03 | Refund decisions and payout | Use-case delivery | 2 | UC-04 | TASK-01 | Confirmed |

## Use-case coverage

Use cases: [06a](./06a-use-cases-customer.md) (customer) and [06b](./06b-use-cases-branch-manager.md) (branch manager). Assumptions: [02 / Assumptions](./02-glossary-assumptions-facts.md#assumptions--constraints). Acceptance cases: [16-uat-bat-test-cases.md](./16-uat-bat-test-cases.md).

| Use case | Tasks |
|----------|-------|
| [UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund) | TASK-01 |
| [UC-02](./06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) | TASK-02 |
| [UC-03](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | TASK-02 |
| [UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TASK-03 |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 14-todo.md | NEXT: 16-uat-bat-test-cases.md -->
