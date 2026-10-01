<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Clinic Reminders
VERSION: 1.1
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Clinic Reminders - Business Requirements & High-Level Design

**Version:** 1.1
**Author:** Clinic Reminders founding team
**Date:** 2026-09-30
**Status:** Draft

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|-------------|------------|---------------------|----------------|
| 1.0     | 2026-09-30  | Clinic Reminders founding team (drafted with brd-unifier) |                     | Initial draft, transformed from the approved pre-BRD in `../pre-brd-clinic-reminders/`. |
| 1.1     | 2026-09-30  | Clinic Reminders founding team (drafted with brd-unifier) |                     | Open items OI-01 to OI-30 accepted and applied (chunk 13, Resolution Log). Added UC-17 End the clinic's service, UC-18 Update or remove a patient's details, NFR-10 Responsiveness, and NFR-11 Data safety. The owner can also do the receptionist's work (chunk 07, footnote 3). |
| 1.1     | 2026-10-01  | Clinic Reminders founding team (drafted with brd-unifier) |                     | Consistency check Run 1 (chunk 14, step 2): mechanical corrections CF-03, CF-04, CF-11, CF-13, CF-14, CF-18, CF-19, CF-22. Open items OI-31 to OI-44, raised by the check, accepted and applied: added UC-19 Export the consent and opt-out log and 30 acceptance criteria; the owner may also mark attendance. Consistency check Run 2: mechanical corrections CF-25 to CF-30; open items OI-45 to OI-47 accepted and applied (opt-out confirmation, doctor filter release, reminders for refilled visits); Glossary adds Dashboard and WhatsApp sender, and three sentences are simplified (UC-01 Why, UC-14 Business Rules, NFR-02). Consistency check Run 3: mechanical corrections CF-33, CF-34, CF-36 to CF-39; open item OI-48 accepted and applied (ending the service in a free period). Consistency check Run 4: mechanical corrections CF-44 to CF-47 (accept link named; chunk 09 points to its sources; UC-17 date choice; two criteria marked); open items OI-49 to OI-51 accepted and applied (no reply after an opt-out, earlier-slot matching, complete imported consent). Consistency check Run 5: mechanical corrections CF-48, CF-50 to CF-52; open item OI-52 accepted and applied (two proposals confirmed). |

---

## Table of Contents

1. [Cover, Changelog & Table of Contents](./00-cover-and-changelog.md)
2. [Executive Summary, Background & Business Objectives](./01-executive-summary-and-context.md)
3. [Glossary, Assumptions, Facts, Challenges & Dependencies](./02-glossary-assumptions-facts.md)
4. [Definitions & Important Details](./03-definitions-and-domain-concepts.md)
5. [Project Scope & Personas](./04-scope-and-personas.md)
6. [User Journeys & Use Cases - Overview](./05-user-journeys-overview.md)
7. [Detailed Use Cases - Clinic Owner](./06a-use-cases-clinic-owner.md)
8. [Detailed Use Cases - Receptionist](./06b-use-cases-receptionist.md)
9. [Detailed Use Cases - Patient](./06c-use-cases-patient.md)
10. [Users & Use Cases Matrix](./07-users-use-cases-matrix.md)
11. [Integrations](./08-integrations.md)
12. [Reporting & Analytics](./09-reporting-and-analytics.md)
13. [Non-Functional Requirements](./10-nfrs.md)
14. [Summary & UI/UX Expectations](./11-summary-and-uiux.md)
15. [Appendix & Wishlist](./12-appendix-and-wishlist.md)
16. [Open Items & Clarifications](./13-open-items-and-clarifications.md)
17. [Product Manager To-Do](./14-todo.md)
18. [Decision Log (companion register)](./decision-log.md)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Appointment lifecycle | [03 / Appointment, Lifecycle](./03-definitions-and-domain-concepts.md#lifecycle) |
| Figure 2 | Summarized workflow: from booking to the weekly report | [05 / Summarized Workflow](./05-user-journeys-overview.md#summarized-workflow) |
| Figure 3 | Business partners of Clinic Reminders | [08 / Integrations](./08-integrations.md#integrations) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Business Objectives | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) |
| Table 2 | Glossary Table | [02 / Glossary](./02-glossary-assumptions-facts.md#glossary) |
| Table 3 | Challenge evidence | [02 / Challenges](./02-glossary-assumptions-facts.md#challenges) |
| Table 4 | Dependencies | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) |
| Table 5 | Weekly no-show report measures | [03 / Weekly no-show report measures](./03-definitions-and-domain-concepts.md#weekly-no-show-report-measures) |
| Table 6 | Personas | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors) |
| Table 7 | Use Case Summary | [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary) |
| Table 8 | Users & Use Cases Matrix | [07 / Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix) |
| Table 9 | Integrations | [08 / Integrations](./08-integrations.md#integrations) |
| Table 10 | Reports and views | [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics) |
| Table 11 | Non-Functional Requirements | [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) |
| Table 12 | Appendix files | [12 / Appendix](./12-appendix-and-wishlist.md#appendix) |
| Table 13 | Technical Inputs for the SDD | [12 / Technical Inputs for the SDD](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
