<!--
CHUNK: 15
TITLE: Implementation Plan
PROJECT: Refunds Portal
VERSION: 1.0 (baselined against BRD v1.0)
PART OF: BRD - Refunds Portal
TYPE: Delivery chunk
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
