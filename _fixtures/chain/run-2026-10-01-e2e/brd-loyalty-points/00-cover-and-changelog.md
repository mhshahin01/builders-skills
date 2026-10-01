<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Loyalty Points
VERSION: 1.2
DEPENDS_ON: none
PART OF: BRD - Loyalty Points
-->

# Loyalty Points: Business Requirements Document (BRD)

**Project / Product Name:** Loyalty Points
**Version:** 1.2
**Status:** In Review
**Author:** Product Team
**Date:** 2026-10-01

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-09-24 | Product Team | Operations Lead | Head of Retail | Initial BRD. |
| 1.1 | 2026-10-01 | Product Team | Product manager (grill-me session; open items OI-02 to OI-09) | - | Applied the grill-me decisions TD-01 to TD-16, then the consistency check open items OI-02 to OI-09 (TD-17 to TD-24) and corrections CF-07, CF-09, CF-11, CF-12, and CF-13 ([14-todo.md](./14-todo.md), [decision-log.md](./decision-log.md)). 01: the summary points to UC-02 BR-1, BR-3, and BR-4 for the refund rules. Scope (04): earning points is in scope; taking points back reads "after a refund of a purchase"; sign-in and joining the program are out of scope. 02: member sign-in and POS Records same-day reporting are confirmed dependencies, so Assumptions is empty; POS Records is in the Glossary as a partner; the earning rule moved to 03. 03: whole-euro earning, no 0-point movements, movement dates, and a pointer to UC-02 BR-1, BR-3, and BR-4. 08: Refunds Portal added; purchase date added to POS Records. UC-01: POS Records and the Refunds Portal as supporting actors, precise A1, new E1, AC-2, AC-3. UC-02: the same supporting actors, step 4 details, A1 continues at step 3, new A2 (empty history) and E1, BR-1 (points taken back when the Refunds Portal reports the refund as paid), BR-3 (partial refunds), BR-4 (a refund reported before its purchase is kept), AC-1 and AC-6 start at the Refunds Portal's report, AC-2 to AC-8 added. 10: NFR-01 defines an upheld complaint and the differences that are not a mismatch; NFR-02 counts from the Refunds Portal's report, or from POS Records' report if later; new NFR-03 (earned points within 1 hour). 00: status In Review until version 1.1 is signed off. TD-15 keeps Objective 2 as written. |
| 1.2 | 2026-10-01 | Product Team | - | - | To-do step 5: added the use-case diagram to 05 (Figure 1) and the UC-02 flowchart to 06a (Figure 2). UC-01 has no flowchart: its Main Flow has fewer than 3 steps. No requirement changed. |

---

## Table of Contents

| # | Chunk |
|---|-------|
| 00 | [Cover, Changelog & Table of Contents](./00-cover-and-changelog.md) |
| 01 | [Executive Summary & Context](./01-executive-summary-and-context.md) |
| 02 | [Glossary, Assumptions, Facts, Challenges, Dependencies](./02-glossary-assumptions-facts.md) |
| 03 | [Definitions & Domain Concepts](./03-definitions-and-domain-concepts.md) |
| 04 | [Project Scope & Personas](./04-scope-and-personas.md) |
| 05 | [User Journeys & Use Cases - Overview](./05-user-journeys-overview.md) |
| 06a | [Detailed Use Cases - Member](./06a-use-cases-member.md) |
| 07 | [Users & Use Cases Matrix](./07-users-use-cases-matrix.md) |
| 08 | [Integrations](./08-integrations.md) |
| 09 | [Reporting & Analytics](./09-reporting-and-analytics.md) |
| 10 | [Non-Functional Requirements](./10-nfrs.md) |
| 11 | [Summary & UI/UX Expectations](./11-summary-and-uiux.md) |
| 12 | [Appendix & Wishlist](./12-appendix-and-wishlist.md) |
| 13 | [Open Items & Clarifications](./13-open-items-and-clarifications.md) |
| 14 | [Product Manager To-Do](./14-todo.md) (delivery chunk; not merged) |
| 15 | [Implementation Plan](./15-implementation.md) (delivery chunk) |
| 16 | [Loyalty Points - UAT/BAT Test Cases](./16-uat-bat-test-cases.md) (delivery chunk) |
| - | [Decision Log](./decision-log.md) (companion register; not merged) |

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Use cases: Overview | [05 / Use Case Diagrams](./05-user-journeys-overview.md#use-case-diagrams) |
| Figure 2 | Flowchart: UC-02 View Points History | [06a / UC-02 Flowchart](./06a-use-cases-member.md#flowchart) |

<!-- MASTER: loyalty-points-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
