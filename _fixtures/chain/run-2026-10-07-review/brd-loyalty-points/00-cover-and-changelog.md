<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Loyalty Points
VERSION: 1.8
DEPENDS_ON: none
PART OF: BRD - Loyalty Points
-->

# Loyalty Points - Business Requirements & High-Level Design

**Version:** 1.8
**Author:** Product Team
**Date:** 2026-10-06
**Status:** In Review

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|-------------|------------|---------------------|----------------|
| 1.0     | 2026-09-24  | Product Team | Reviewed: Operations Lead; Approved: Head of Retail | Initial BRD. |
| 1.1     | 2026-10-05  | Product Team |                     | Migrated to the current template. Applied review items OI-02 to OI-19: earning rule, opening balance at go-live, no expiry, sign-in as a dependency, take-back on paid refunds, partial and early refunds, repeated reports, Loyalty Administrator persona with UC-03, exception flows, movement details, both outside systems in Dependencies and Integrations, NFR-03 to NFR-07, retention, measurable objectives, single homes for two facts. Applied OI-20 to OI-24, raised by the consistency check: take-back capped at the balance, staff sign-in dependency, three more Integrations rows, no balance after a member leaves, corrections linked to missing purchases. Consistency corrections CF-01, CF-05, CF-06, CF-07, CF-12, CF-13, CF-14, CF-16, CF-17, CF-19, CF-20, CF-21. Raised OI-25 to OI-28 (open). Chunks: 00, 01, 02, 03, 04, 05, 06a, 06b, 07, 08, 10, 11, 12, 13 |
| 1.2     | 2026-10-05  | Product Team |                     | To-do step 1: applied OI-25 to OI-28 (missing purchases entered by amount paid, purchases that already show, rejoining members, the Loyalty Administrator role from the staff sign-in) and the decisions on TD-02 (Opening balance and Correction labels), TD-03 (Refunds Portal Needed before and Status), TD-07 (problems reported at a branch), TD-08 (UC-03 exception flows and criteria confirmed), TD-15 (signed-in customers who are not members), TD-16 (Monthly corrections report), TD-17 (Background), TD-18 (Facts), TD-19 (Challenges), TD-22 (data table and filter standards). Applied OI-29 and OI-30, raised by the consistency check: only the movements since a member last joined count and show, and purchases from before a rejoin never change the balance. Consistency corrections CF-27, CF-29, CF-30, CF-31, CF-32, CF-35, CF-36, CF-38. Raised OI-31 (open). Chunks: 00, 01, 02, 03, 04, 06a, 06b, 08, 09, 10, 11, 13 |
| 1.3     | 2026-10-05  | Product Team |                     | To-do step 1 finished: applied OI-31 (the rule on purchases made before a member last joined covers members who rejoined only: UC-02 BR-7, UC-03 E5) and the product manager's values for TD-01, TD-03 to TD-06, TD-09 to TD-14, TD-20, TD-21, TD-23, TD-27, and TD-28: owners and status of the five dependencies, the POS Records reporting time and branch closing time, unique references and the Refunds Portal reporting time, the Business Objective 2 target, the NFR-04 to NFR-07 measures, the retention period, the Loyalty Administrator team, the primary color, and the language and formats. Applied OI-32 and OI-33, raised by the consistency check: the opening balance is the points held at the start of the go-live date (UC-02 AC-19), and NFR-04 counts planned maintenance. Applied the product manager's value for TD-40: the Loyalty Administrator finds a member by their member number. Applied OI-34, raised by the consistency check: a missing purchase dated before the go-live date is refused (UC-03 E6, AC-12), because its points are part of the opening balance. Consistency corrections CF-43 (UC-01 AC-5, UC-02 AC-15 to AC-18), CF-44 to CF-46, CF-48, CF-49, and CF-50 (UC-03 AC-13). Chunks: 00, 01, 02, 03, 04, 06a, 06b, 08, 10, 11, 13 |
| 1.4     | 2026-10-05  | Product Team |                     | To-do step 2: consistency corrections CF-51 (purchases made before the day a member rejoins: 03 Membership end and data retention, UC-02 AC-13; carries OI-31), CF-52 (opening a Correction or an Opening balance movement: UC-02 AC-20, AC-21; carries OI-11 with TD-02), CF-53, CF-55, and CF-56. Applied OI-35 and OI-36, raised by the consistency check: a member who rejoins on the day they left counts as rejoining on the next day, and as a former member until then (UC-01 AC-6, UC-02 AC-22, AC-23, UC-03 AC-14). Chunks: 00, 03, 06a, 06b, 13 |
| 1.5     | 2026-10-05  | Product Team |                     | To-do step 3: applied the grill-me decisions TD-44 to TD-56: movements worth 0 points add no movement (UC-02 AC-24, AC-25); purchases made before go-live and reported later (UC-02 AC-26); refunds of a corrected missing purchase (UC-03 BR-6, AC-15, AC-16); a late rejoin notice (03, NFR-03, UC-02 AC-27); the Business Objective 2 measure month; NFR-04 disruption; NFR-06 screens; NFR-07 report audience and staff test; partial refunds with cents (UC-02 AC-28, AC-29); the Monthly corrections wording; UC-02 supports Business Objectives 1 and 2; UC-01 shows the date of the newest movement; a later refund after a capped take-back (UC-02 AC-30). Applied OI-37, raised by the consistency check: the other member's take-back uses the amount paid that POS Records reported (UC-03 BR-6, AC-17). Consistency correction CF-59. Chunks: 00, 01, 03, 06a, 06b, 09, 10, 13 |
| 1.6     | 2026-10-05  | Product Team |                     | To-do step 4: the approved Figma prototype of the correction screen (MK-03) is recorded in the UC-03 UI/UX section. Consistency correction CF-60. Chunks: 00, 06b |
| 1.7     | 2026-10-05  | Product Team |                     | To-do step 5: added the use-case diagram (Figure 2, chunk 05) and the flowcharts of UC-02 (Figure 3) and UC-03 (Figure 4); UC-01 has fewer than 3 Main Flow steps, so it has no flowchart. Consistency corrections CF-61 and CF-62 (Figures 3 and 4 follow the UC-02 A4 and UC-03 E5 wording) and CF-63. Chunks: 00, 05, 06a, 06b |
| 1.8 | 2026-10-06 | Codex (business-reviewer-unifier) | | Business review 2026-10-06 in Codex ([tracker](../review-comments-tracker.md)). BO-01: 09, 10; SME-05: 13. Owner hand-offs pending; gated outputs Stale. Verification confirmed the template and preserved criterion order. Chunks: 09, 10, 13. |

---

## Table of Contents

- [00 Cover, Changelog & Table of Contents](./00-cover-and-changelog.md)
- [01 Executive Summary, Background & Business Objectives](./01-executive-summary-and-context.md)
- [02 Glossary, Assumptions, Facts, Challenges & Dependencies](./02-glossary-assumptions-facts.md)
- [03 Definitions & Important Details](./03-definitions-and-domain-concepts.md)
- [04 Project Scope & Personas](./04-scope-and-personas.md)
- [05 User Journeys & Use Cases - Overview](./05-user-journeys-overview.md)
- [06a Detailed Use Cases - Member](./06a-use-cases-member.md)
- [06b Detailed Use Cases - Loyalty Administrator](./06b-use-cases-loyalty-administrator.md)
- [07 Users & Use Cases Matrix](./07-users-use-cases-matrix.md)
- [08 Integrations](./08-integrations.md)
- [09 Reporting & Analytics](./09-reporting-and-analytics.md)
- [10 Non-Functional Requirements](./10-nfrs.md)
- [11 Summary & UI/UX Expectations](./11-summary-and-uiux.md)
- [12 Appendix & Wishlist](./12-appendix-and-wishlist.md)
- [13 Open Items & Clarifications](./13-open-items-and-clarifications.md)
- [14 Product Manager To-Do](./14-todo.md)
- [15 Implementation Plan](./15-implementation.md)
- [16 UAT/BAT Test Cases](./16-uat-bat-test-cases.md)
- [Decision Log](./decision-log.md)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Summarized Workflow: Member | [05 / Summarized Workflow](./05-user-journeys-overview.md#figure-1---summarized-workflow-member) |
| Figure 2 | Use cases: Overview | [05 / Use Case Diagrams](./05-user-journeys-overview.md#figure-2---use-cases-overview) |
| Figure 3 | Flowchart: UC-02 View Points History | [06a / UC-02 Flowchart](./06a-use-cases-member.md#figure-3---flowchart-uc-02-view-points-history) |
| Figure 4 | Flowchart: UC-03 Correct a Member's Points | [06b / UC-03 Flowchart](./06b-use-cases-loyalty-administrator.md#figure-4---flowchart-uc-03-correct-a-members-points) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Glossary | [02 / Glossary](./02-glossary-assumptions-facts.md#glossary) |
| Table 2 | Dependencies | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) |
| Table 3 | Personas / Actors | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors) |
| Table 4 | Use Case Summary | [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary) |
| Table 5 | Users & Use Cases Matrix | [07 / Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix) |
| Table 6 | Integrations | [08 / Integrations](./08-integrations.md#integrations) |
| Table 7 | Non-Functional Requirements | [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) |
| Table 8 | Appendix files | [12 / Appendix](./12-appendix-and-wishlist.md#appendix) |
| Table 9 | Reporting / Analytics | [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics) |

<!-- MASTER: loyalty-points-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
