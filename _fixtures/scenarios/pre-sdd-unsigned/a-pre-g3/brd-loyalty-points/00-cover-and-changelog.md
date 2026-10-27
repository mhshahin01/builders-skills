<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Loyalty Points
VERSION: 1.7
DEPENDS_ON: none
PART OF: BRD - Loyalty Points
-->

# Loyalty Points - Business Requirements & High-Level Design

**Version:** 1.7
**Author:** Product Team
**Date:** 2026-10-10
**Status:** In Review

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|-------------|------------|---------------------|----------------|
| 1.0 | 2026-09-24 | Product Team | Reviewed By: Operations Lead; Approved By: Head of Retail | Initial BRD. Chunks: none (initial build) |
| 1.1 | 2026-10-10 | Requirements Analyst agent (Claude Opus 5.5, brd-unifier) | | Migrated to the current template (source v1.0 snapshot: [12 / Appendix](./12-appendix-and-wishlist.md#appendix)). Applied open items OI-02 to OI-17 ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log)): earning points in scope; start of points; measured objectives; E1 flows; paid-refund take-back rules; delay note; movement dates and details; POS Records dependency; NFR-03, NFR-04, NFR-05; complaints out of scope; member leaving; expiry; keeping history. Applied OI-18 and OI-19 (raised by the consistency check): new acceptance criteria and the A1 condition. Consistency corrections CF-03, CF-04, CF-05 and CF-06 ([14 / Step 2](./14-todo.md#step-2---run-a-consistency-check-across-all-brd-chunks)). Chunks: 00, 01, 02, 03, 04, 05, 06a, 07, 08, 09, 10, 11, 12, 13 |
| 1.2 | 2026-10-10 | Requirements Analyst agent (Claude Opus 5.5, brd-unifier) | | Applied the decisions of the grill-me session of 2026-10-10 ([decision-log / Marker register](./decision-log.md#marker-register)): points do not expire (TD-06); Refunds Portal integration row (TD-15). Applied open items OI-20 to OI-26, raised from the questions the session left open ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log)): zero-balance criterion (UC-01 AC-6); NFR-01 expectation; a person who left can no longer open their points; take-back limit per purchase (UC-02 BR-6, AC-12); purchases that arrive after the member left; Refunds Portal criticality and refund outcome. Applied OI-27 to OI-32 (raised by the consistency check): the date of the last movement (UC-01 BR-3); the Glossary "Refund"; leaving the program in the use cases (UC-01 AC-7, UC-02 AC-13); history dates and note (UC-02 AC-14, AC-15); "paid refund" wording (OI-31); a criterion for the date of the last movement (UC-01 AC-8, OI-32). Consistency corrections CF-07, CF-10, CF-15, CF-16, CF-19, CF-20, CF-21, CF-24, CF-25, CF-26 and CF-28 ([14 / Step 2](./14-todo.md#step-2---run-a-consistency-check-across-all-brd-chunks)). Chunks: 02, 03, 06a, 08, 10, 13 |
| 1.3 | 2026-10-10 | Requirements Analyst agent (Claude Opus 5.5, brd-unifier) | | Applied the decisions that waited for application (TD-48 to TD-50; [13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log)): UC-01 AC-8 now uses two purchases, so it pins the date of the last movement (OI-33); UC-02 A1 now names the taken-back movement (OI-34). Consistency corrections: CF-27 and CF-30, the v1.2 row lists CF-19, CF-21, CF-24, CF-25, CF-26 and CF-28; CF-29, UC-02 A1 points to BR-4 and BR-5 for a refund of a purchase that has not earned points; CF-31, CF-32 and CF-33, chunk 14 names BRD v1.3, shows G2 as met and puts UC-02 A1 in the grill-me prompt ([14 / Step 2](./14-todo.md#step-2---run-a-consistency-check-across-all-brd-chunks)). Chunks: 06a, 13 |
| 1.4 | 2026-10-10 | Review Panel agent (business-reviewer-unifier skill, Claude Code) | | Business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md)); its points were decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Points applied: BO-01 (02, 06a: refunds outside the Refunds Portal take back no points, UC-02 BR-7 with its marker; Glossary "Refund"); BO-02 (01: marker on the cost and the expected value); BO-06 (02: Legal confirmation dependency, needed before go-live); PM-01 (06a: UC-02 BR-1 partial take-back of 1 point per 1 EUR refunded, answers TD-03; UC-02 AC-16); PM-02 (04: goes live on its own date, with a marker); PM-06 (05: earning has no use case, with a marker); PM-08 (01: branch calls counted before go-live, with a marker); PM-09 (04: marker on when redeeming comes; 03: marker on points earned before redeeming or expiry); PM-10 (06a: UC-02 BR-8 marker on telling members of a take-back); PM-11 (04: marker on a view for the people who answer points calls); PA-02 (06a: UC-02 BR-5 marker on how long to wait for the purchase); DC-06 (08: POS Records owner is the Retail IT team, answers TD-16). Verify fixes: 01 Executive Summary and core capabilities, and 04 In Scope, follow UC-02 BR-1 and BR-7 (PM-01, BO-01). Records: [decision-log / Business review register](./decision-log.md#business-review-register). Chunks: 01, 02, 03, 04, 05, 06a, 08 |
| 1.5 | 2026-10-10 | Requirements Analyst agent (Claude Opus 5.5, brd-unifier) | | Took the hand-off of the business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md)). Checked the points the review applied in v1.4; TD-03 (PM-01) and TD-16 (DC-06) are closed ([decision-log / Marker register](./decision-log.md#marker-register)). Applied open items OI-35 to OI-43, raised from the review's open remainders ([13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log)): refunds made outside the Refunds Portal take back no points in this release, with a Wishlist item (OI-35); go-live in all branches at once, after BAT sign-off (OI-36); earning points stays a rule in 03 with no use case (OI-37); each branch counts calls about points from at least one full month before go-live (OI-38); the balance screen says points cannot be used yet (OI-39; UC-01 step 2, AC-9); points earned before redeeming or expiry keep their value (OI-40); no message when points are taken back (OI-41; UC-02 BR-8, Future Enhancements); no view of points for the people who answer points calls, with a Wishlist item (OI-42); a 30-day wait for the purchase of a paid refund (OI-43; UC-02 BR-5, AC-11, AC-17). Applied OI-44 to OI-46 (raised by consistency check Run 11): Criticality "Critical" for both integrations (OI-44); the Refunds Portal milestone question narrowed to what 04 allows (OI-45); no online-shop example in UC-02 BR-7 and Wishlist item 2 (OI-46). Applied OI-47 (raised by consistency check Run 12): the Refunds Portal is needed before no milestone of this release. Consistency corrections: CF-37, NFR-02 follows the UC-02 BR-5 wait (carries Q-43); CF-42, 03 / Overview follows UC-02 BR-7 (carries Q-35); CF-43, NFR-02 measure split in two sentences (carries Q-43); CF-38, CF-39, CF-40 and CF-44, chunk 14 step 2 evidence, step 4 version and the UC-02 decision points; CF-45, forward notes in decision-log Q-25, Q-35 and Q-45 ([14 / Step 2](./14-todo.md#step-2---run-a-consistency-check-across-all-brd-chunks)). Chunks: 01, 02, 03, 04, 05, 06a, 08, 10, 12, 13 |
| 1.6 | 2026-10-10 | Requirements Analyst agent (Claude Opus 5.5, brd-unifier) | | Applied the decisions that waited for application (TD-69, TD-70; [13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log)): a refund paid before the Refunds Portal starts to report refund outcomes takes back no points (OI-48; UC-02 BR-7). Applied OI-49 (raised by consistency check Run 14): a criterion for that rule (UC-02 AC-18). Applied OI-50 (raised by consistency check Run 15): the cut-off is the day the Refunds Portal starts to report, because it sends only the date a refund was paid (UC-02 BR-7, AC-18, AC-19; 02 / Dependencies, Refunds Portal Notes). Consistency corrections: CF-48, 03 / Overview, Taken back, cites UC-02 BR-1, BR-4, BR-5 and BR-7 (carries Q-07 and Q-43); CF-51, 01 / Executive Summary (twice) and 04 / In Scope cite the same four rules (carries Q-07 and Q-43); CF-52, 02 / Dependencies, Refunds Portal Notes, points to UC-02 BR-7 (carries Q-48); CF-54, UC-02 A1 points to UC-02 BR-7 (carries Q-35, Q-48 and Q-50) ([14 / Step 2](./14-todo.md#step-2---run-a-consistency-check-across-all-brd-chunks)). Chunks: 01, 02, 03, 04, 06a, 13 |
| 1.7 | 2026-10-10 | Requirements Analyst agent (Claude Opus 5.5, brd-unifier) | | Applied the decision that waited for application (TD-73; [13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log)): for a refund paid on the day the Refunds Portal starts to report refund outcomes, NFR-02 counts the 1 hour from the Refunds Portal reporting it as paid (OI-51; 10 / NFR-02). Consistency corrections: CF-58, the NFR-02 wait for a purchase that earns its points after the refund now applies on the start day too (carries Q-43 and Q-51); CF-59, CF-60 and CF-61, chunk 14 and decision-log Q-50 follow NFR-02 and name every to-do row that blocks step 4 and MK-02 ([14 / Step 2](./14-todo.md#step-2---run-a-consistency-check-across-all-brd-chunks)). Chunks: 10, 13 |

---

## Table of Contents

- [00 Cover, Changelog & Table of Contents](./00-cover-and-changelog.md)
- [01 Executive Summary, Background & Business Objectives](./01-executive-summary-and-context.md)
- [02 Glossary, Assumptions, Facts, Challenges & Dependencies](./02-glossary-assumptions-facts.md)
- [03 Definitions & Important Details](./03-definitions-and-domain-concepts.md)
- [04 Project Scope & Personas](./04-scope-and-personas.md)
- [05 User Journeys & Use Cases - Overview](./05-user-journeys-overview.md)
- [06a Detailed Use Cases - Member](./06a-use-cases-member.md)
- [07 Users & Use Cases Matrix](./07-users-use-cases-matrix.md)
- [08 Integrations](./08-integrations.md)
- [09 Reporting & Analytics](./09-reporting-and-analytics.md)
- [10 Non-Functional Requirements](./10-nfrs.md)
- [11 Summary & UI/UX Expectations](./11-summary-and-uiux.md)
- [12 Appendix & Wishlist](./12-appendix-and-wishlist.md)
- [13 Open Items & Clarifications](./13-open-items-and-clarifications.md)
- [14 Product Manager To-Do](./14-todo.md)
- [Decision Log](./decision-log.md)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Summarized Workflow: Member | [05 / Summarized Workflow](./05-user-journeys-overview.md#figure-1---summarized-workflow-member) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Glossary | [02 / Glossary](./02-glossary-assumptions-facts.md#glossary) |
| Table 2 | Dependencies | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) |
| Table 3 | Personas | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors) |
| Table 4 | Use Case Summary | [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary) |
| Table 5 | Users & Use Cases Matrix | [07 / Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix) |
| Table 6 | Integrations | [08 / Integrations](./08-integrations.md#integrations) |
| Table 7 | Non-Functional Requirements | [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) |
| Table 8 | Appendix files | [12 / Appendix](./12-appendix-and-wishlist.md#appendix) |

<!-- MASTER: loyalty-points-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
