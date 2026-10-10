<!--
TYPE: Master Index
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: BRD - [Project Name]
PURPOSE: Navigation graph for AI agents and human readers. Each node links to a self-describing chunk. Load this file first, then follow links to the chunks you need.
VERSIONING: One update, one version (delivery-chunks.md § Refresh triggers, Version). This master and chunk 00 carry the current BRD version; every other chunk carries the version in which its content last changed, and 15-17 the version they were written at. Status, link, and delivery-tracking updates bump nothing.
MAINTENANCE: When adding or removing chunks, update the tables below, the dependency graph, and the reading-order table.
PARTS: In parts generation this file is written in part 1 and updated at the end of every part. A chunk that is not written yet is listed as plain text followed by "Pending (part N)"; it becomes a link when it is written.
DELIVERY CHUNKS: 14-17 are derived from the BRD body (00-13) and never add requirements. 14 is written at the end of every generation (part 3 in parts generation). 15, 16, and 17 are locked until every action item in 14 is closed (Deferred counts as open; no override). 14 and 17 are never part of the merged / combined BRD.
LANGUAGE: The whole BRD is business language only - the WHAT. Technical stack, terminology, and the HOW are owned by the SDD (sdd-unifier).
STYLE: Plain language in every chunk: simple, clear, precise, easy to understand. Short sentences, common words, active voice, one term for one thing, the exact number instead of a vague word. Simple never means incomplete: every number, rule, and exception stays.
-->

# BRD Master Index - [Project Name]

> **How to use:** This file is the entry point. Each section below maps to a chunk file containing the full template content. Links are relative to this directory. An AI agent should load this file first, identify which chunk(s) are relevant to the task, and navigate to only those chunks.

---

## Generation Progress

**Generation:** [parts | whole; a light parts build writes "parts, light" (SKILL.md § Light run)]
**Source:** [path of every source file (SoW, old BRD, notes), or "conversation"]

<!-- Parts generation only. Keep the table after part 3 completes: it is the record of how the BRD was built. In a whole run, keep only the two lines above. -->

| Part | Chunks | Status | Completed |
|------|--------|--------|-----------|
| 1 | 00-05 | [Complete / In progress (last step done) / Pending] | [YYYY-MM-DD or -] |
| 2 | 06a+, 07 | [Complete / In progress (last step done) / Pending] | [YYYY-MM-DD or -] |
| 3 | 08-14 | [Complete / In progress (last step done) / Pending] | [YYYY-MM-DD or -] |

## Document Metadata & History

| Section | Chunk |
|---------|-------|
| Title block, Version, Author, Date, Status | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Changes Log | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Table of Contents | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Figures Index | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |
| Tables Index | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |

## Strategic Context

| Section | Chunk |
|---------|-------|
| Executive Summary | [01-executive-summary-and-context.md](./01-executive-summary-and-context.md) |
| Background and Context / Problem Statement | [01-executive-summary-and-context.md](./01-executive-summary-and-context.md) |
| Business Objectives | [01-executive-summary-and-context.md](./01-executive-summary-and-context.md) |

## Domain Knowledge

| Section | Chunk |
|---------|-------|
| Glossary (business terms) | [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md) |
| Assumptions / Constraints | [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md) |
| Facts | [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md) |
| Challenges (incl. evidence table) | [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md) |
| Dependencies | [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md) |
| Definitions & Important Details | [03-definitions-and-domain-concepts.md](./03-definitions-and-domain-concepts.md) |

## Scope & Actors

| Section | Chunk |
|---------|-------|
| Project Scope (In Scope / Out of Scope) | [04-scope-and-personas.md](./04-scope-and-personas.md) |
| Personas / Actors | [04-scope-and-personas.md](./04-scope-and-personas.md) |

## User Journeys & Use Cases

| Section | Chunk |
|---------|-------|
| User Journeys (per persona) | [05-user-journeys-overview.md](./05-user-journeys-overview.md) |
| Summarized Workflow | [05-user-journeys-overview.md](./05-user-journeys-overview.md) |
| Use Case Summary Table | [05-user-journeys-overview.md](./05-user-journeys-overview.md) |
| Use Case Diagrams (added at to-do step 5; absent until then) | [05-user-journeys-overview.md](./05-user-journeys-overview.md) |
| Detailed Use Cases (per persona; Actor/Goal/Why/Preconditions/Main Flow/Alt Flows/Rules/Acceptance/Future/UI; a Flowchart for branching use cases is added at to-do step 5) | [06a-use-cases-[persona-slug].md](./06a-use-cases-[persona-slug].md) |
| Users & Use Cases Matrix (who may do what) | [07-users-use-cases-matrix.md](./07-users-use-cases-matrix.md) |

<!-- When a real BRD has multiple personas, add rows here:
| Detailed Use Cases - [Persona 2] | [06b-use-cases-[persona-slug].md](./06b-use-cases-[persona-slug].md) |
| Detailed Use Cases - [Persona 3] | [06c-use-cases-[persona-slug].md](./06c-use-cases-[persona-slug].md) |
-->

## Integrations & Data

| Section | Chunk |
|---------|-------|
| Integrations (business-level) | [08-integrations.md](./08-integrations.md) |
| Reporting / Analytics | [09-reporting-and-analytics.md](./09-reporting-and-analytics.md) |

## Quality & Standards

| Section | Chunk |
|---------|-------|
| Non-Functional Requirements (business language) | [10-nfrs.md](./10-nfrs.md) |
| Summary | [11-summary-and-uiux.md](./11-summary-and-uiux.md) |
| UI/UX Expectations | [11-summary-and-uiux.md](./11-summary-and-uiux.md) |

## Appendices

| Section | Chunk |
|---------|-------|
| Appendix (incl. Technical Inputs for the SDD, parked verbatim) | [12-appendix-and-wishlist.md](./12-appendix-and-wishlist.md) |
| Wishlist | [12-appendix-and-wishlist.md](./12-appendix-and-wishlist.md) |

## Review Output

| Section | Chunk |
|---------|-------|
| Open Items & Clarifications | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md) |
| Decision history & clarification Q&A (companion register) | decision-log.md (not created yet) |

<!-- Turn decision-log.md into a link ([decision-log.md](./decision-log.md)) once it exists: it is created with its first record (a decision, or a business review point). -->

> Generated *after* the main BRD by a cleared-context reviewer. Captures gaps, missing scenarios, corner cases the body did not flag inline. Every unapplied item carries a **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply; the skill walks the user through each item for acceptance, then reflects accepted answers into the body and logs them in the Resolution Log. An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.

## Delivery Chunks

| Section | Chunk | State | In merged BRD | Input to the SDD |
|---------|-------|-------|---------------|------------------|
| Product Manager To-Do (open items, consistency check, grill-me, Figma mockups, use-case diagrams) | [14-todo.md](./14-todo.md) | Living checklist | No | No |
| Implementation Plan (dependency-ordered tasks for implementation agents) | 15-implementation.md | [Locked / Up to date / Provisional (TD-NN) / Stale] | Yes | Context only |
| UAT/BAT Test Cases | 16-uat-bat-test-cases.md | [Locked / Up to date / Provisional (TD-NN) / Stale] | Yes | Context only |
| Presentation & Video Brief (executive deck brief, 30-second use-case videos) | 17-for-ppt.md | [Locked / Up to date / Provisional (TD-NN) / Stale] | No | No |

<!-- Turn 15, 16, 17 into links once the files exist: [15-implementation.md](./15-implementation.md). State matches the chunk's status line and its Downstream outputs row in 14-todo.md; that row may add the date and basis after Up to date (delivery-chunks.md § The delivery gate, Re-lock). -->

> Derived from chunks 00-13, in the order 14 -> 15 -> 16 -> 17. They cite the BRD by ID and link and never add requirements: if a delivery chunk and the BRD body disagree, the body wins.
>
> **Guardrail.** The to-do (14) is written at the end of every generation. Chunks 15, 16, and 17 are **locked** until every action item in the to-do is closed: all five steps complete with evidence and every item resolved. A deferred item counts as open. There is no override. `Locked` means the file does not exist yet.
>
> Use-case diagrams (chunk 05) and use-case flowcharts (chunks 06a+) are added only at step 5 of the to-do, after steps 1-3 are complete (in parallel with step 4).

---

## Chunk Dependency Graph

```
[project-slug]-brd-master.md (you are here)
|
+-- 00-cover-and-changelog.md .... metadata, version history
+-- 01-executive-summary-and-context.md .... why this project exists
+-- 02-glossary-assumptions-facts.md .... prerequisite knowledge
+-- 03-definitions-and-domain-concepts.md .... deep domain models
+-- 04-scope-and-personas.md .... boundaries & actors
+-- 05-user-journeys-overview.md .... journeys & use case summary
|   +-- 06a-use-cases-[persona-slug].md .... detailed use cases per persona
|   +-- [06b, 06c, ...] .... additional persona chunks
+-- 07-users-use-cases-matrix.md .... who is allowed to do what
+-- 08-integrations.md .... business integrations (what, not how)
+-- 09-reporting-and-analytics.md .... outputs & dashboards
+-- 10-nfrs.md .... business-language quality expectations
+-- 11-summary-and-uiux.md .... summary & UX standards
+-- 12-appendix-and-wishlist.md .... supporting files, parked technical inputs, future ideas
+-- 13-open-items-and-clarifications.md .... reviewer findings with recommended answers
+-- 14-todo.md .... product-manager checklist (living; every generation; not merged)
    |  [delivery gate: opens only when every to-do item is closed]
    +-- 15-implementation.md .... dependency-ordered implementation tasks (from 06a+ and capabilities with no use case)
        +-- 16-uat-bat-test-cases.md .... UAT/BAT test cases traced to use cases or owning sections, NFRs, tasks
            +-- 17-for-ppt.md .... presentation brief and 30-second videos (not merged)
```

### Reading order by task

| Agent Task | Start With | Then |
|------------|-----------|------|
| Understand the project | 01 | 02, 03 |
| Write or review use cases | 05 | 06a+, 07 |
| Check who may do what | 07 | 04, 06a+ |
| Derive an SDD (`sdd-unifier`) | brd-master | chunks 00-13; 15 and 16 as context only when they exist; never 14 or 17; technical inputs parked in 12 |
| Check scope & boundaries | 04 | 01 |
| Audit completeness | 00 (ToC) | all chunks sequentially |
| Add integrations | 08 | 03, 05 |
| Define NFRs | 10 | 01 |
| Triage reviewer findings | 13 | the chunk(s) referenced by each open item |
| See what must be decided or done next | 14 | 13, then the chunk(s) each to-do item references |
| Implement the product (implementation agents) | 15 (exists only once the to-do is cleared) | the use cases each task cites (06a+), 07, 10, 11; the SDD / LLD when they exist |
| Plan or run acceptance testing | 16 (exists only once the to-do is cleared) | 06a+, 10, 15 |
| Build the executive deck or the use-case videos | 17 (exists only once the to-do is cleared) | 01, 04, 05, 14 |
