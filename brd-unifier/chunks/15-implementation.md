<!--
CHUNK: 15
TITLE: Implementation Plan
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 02, 03, 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 13, 14
PART OF: BRD - [Project Name]
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared: all five steps Complete with evidence, every to-do item Resolved (Deferred does not count), no override. Never written or refreshed while the gate is shut.
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: One actionable, dependency-ordered plan that consolidates every 06* use case into implementation tasks other agents can pick up: what to do, in what order, and how completion is assessed.
LANGUAGE: Business language only. Tasks describe capabilities to deliver, never technology, architecture, or tooling. The how is owned by the SDD and LLD.
RULES: delivery-chunks.md in the brd-unifier skill. The BRD body is authoritative; this plan cites it and never adds requirements.
-->

# Implementation Plan

> **What this is.** Every use case in chunks 06* turned into scoped tasks with stable IDs, ordered so that no task comes before something it depends on. Shared prerequisites and duplicate work are consolidated once.
>
> **What this is not.** It is not a design. It names what to deliver and how completion is judged; the solution design (SDD) and low-level design (LLD) own the how.

**Plan status:** [Up to date / Provisional (TD-NN) / Stale] | **Basis:** BRD v[X.X] | **Gate verified:** [YYYY-MM-DD] (see [14-todo.md](./14-todo.md)) | **Flowcharts used:** [Figures N-M] | **New items raised while writing this plan:** [0, or TD-NN ...]

## How to use this plan

1. Read [brd-master.md](./brd-master.md), then the use cases a task cites, before starting the task.
2. Work wave by wave. Start a task only when every task in its **Dependencies** is complete.
3. Tasks listed together in a wave can run in parallel.
4. A task is complete when every completion criterion holds and the test cases in [16-uat-bat-test-cases.md](./16-uat-bat-test-cases.md) whose Related Task names it pass.
5. A `Provisional (TD-NN)` task may be started, but the part named by its to-do item is not final. A `Blocked` task, and any task that waits for it, must not be started.
6. If the BRD and this plan disagree, the BRD wins. Report the difference; do not resolve it silently.

## Use-case coverage

<!-- Every use case from every 06* chunk appears here with at least one task. -->

| Use case | Source chunk | Tasks |
|----------|--------------|-------|
| UC-01 [Short Title] | [06a](./06a-use-cases-[persona-slug].md) | TASK-01, TASK-03 |
| UC-02 [Short Title] | [06a](./06a-use-cases-[persona-slug].md) | TASK-04 |

## Execution sequence

<!-- Document order is execution order. Tasks inside one wave have no dependency path between them. Blocked tasks, and tasks caught in a cycle, are not placed in a wave. A Provisional task stays in its wave. -->

| Wave | Tasks (can run in parallel) | Depends on |
|------|-----------------------------|-----------|
| 1 | TASK-01, TASK-02 | None |
| 2 | TASK-03, TASK-04 | Wave 1 |
| Not sequenced | [TASK-NN, TASK-NN] | [DP-01] |

## Dependency problems

<!-- Circular dependency / Missing prerequisite / Blocker. Flagged here, never presented as a valid sequence. If none: write "None identified." and state what was checked. -->

| ID | Type | Tasks and use cases affected | Evidence | Needed to unblock | To-do item | Status |
|----|------|------------------------------|----------|-------------------|-----------|--------|
| DP-01 | [Circular dependency] | [TASK-05 <-> TASK-07 (UC-05, UC-08)] | [UC-05 Preconditions require the outcome of UC-08; UC-08 step 2 requires the outcome of UC-05] | Recommendation: [how the cycle could be broken]. Decision needed from the product manager. | [TD-NN](./14-todo.md) | [Open / Resolved] |

<!-- Every dependency problem raises a to-do item, which shuts the delivery gate again: finish this chunk, do not start chunk 16, and report what must be decided. -->

---

## Tasks

### TASK-01: [Title - a capability, in business terms]

| | |
|---|---|
| **Objective** | [What is delivered and for whom, one or two sentences] |
| **Scope** | In: [what this task covers]. Out: [what it leaves to other tasks, by TASK-NN]. |
| **Type** | [Foundation / Use-case delivery / Cross-cutting] |
| **Wave** | [1] |
| **Source use cases** | [06a / UC-01](./06a-use-cases-[persona-slug].md), [06b / UC-06](./06b-use-cases-[persona-slug].md) |
| **Source requirements** | [UC-01 BR-1; NFR-04 (10); 07 matrix; 08 / [Partner]; 11 / [Standard]] |
| **Dependencies** | [None / TASK-NN, TASK-NN] |
| **Can run in parallel with** | [TASK-02] |
| **Status basis** | [Confirmed / Provisional (TD-NN) / Blocked (DP-NN, TD-NN) / Blocked (waits for TASK-NN)] |

**Expected deliverables**

- [Deliverable 1: an outcome a business reader can recognise]
- [Deliverable 2]

**Completion criteria** (each cites its source; a short label, not the restated text)

- [ ] [UC-01 AC-1: short label]
- [ ] [UC-01 AC-2: short label]
- [ ] [UC-01 E1 handled as documented]
- [ ] [NFR-04 business measure observed]

**Assumptions, open questions, blockers**

- Assumption: [text] ([02 / Assumption 3](./02-glossary-assumptions-facts.md))
- Open question: [TD-NN](./14-todo.md) - [what it leaves provisional in this task]
- Blocker: [DP-NN or TD-NN, or "None."]

---

<!-- Repeat the TASK block for every task, in execution order. -->

### Not sequenced

<!-- Only when dependency problems exist: the task blocks that are Blocked or caught in a cycle go here, after the last wave, with Wave = "Not sequenced". Remove this heading when every task is sequenced. -->

<!-- MASTER: brd-master.md | PREV: 14-todo.md | NEXT: 16-uat-bat-test-cases.md -->
