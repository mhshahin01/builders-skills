<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Clinic Reminders - Business Requirements & High-Level Design

**Version:** 1.0
**Author:** **[NEEDS CLARIFICATION: Who is the BRD author?]**
**Date:** 2026-10-07
**Status:** Draft

---

## Changes Log

**Table 1 - Changes Log**

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|-------------|------------|---------------------|----------------|
| 1.0 | 2026-10-07 | Claude (brd-unifier skill, Claude Code) | | Initial draft, transformed from the Clinic Reminders pre-BRD. Review items OI-02 to OI-04, OI-06 to OI-09, OI-11, OI-14 to OI-20, and OI-22 to OI-32 applied. Consistency corrections CF-01, CF-02, CF-05 to CF-07, CF-09 to CF-17, and CF-22 to CF-27 applied. Chunks: none (initial build) |

---

## Table of Contents

- [00 Cover, Changelog & Table of Contents](./00-cover-and-changelog.md)
- [01 Executive Summary, Background & Business Objectives](./01-executive-summary-and-context.md)
- [02 Glossary, Assumptions, Facts, Challenges & Dependencies](./02-glossary-assumptions-facts.md)
- [03 Definitions & Important Details](./03-definitions-and-domain-concepts.md)
- [04 Project Scope & Personas](./04-scope-and-personas.md)
- [05 User Journeys & Use Cases - Overview](./05-user-journeys-overview.md)
- [06a Detailed Use Cases - Clinic Owner](./06a-use-cases-clinic-owner.md)
- [06b Detailed Use Cases - Receptionist](./06b-use-cases-receptionist.md)
- [06c Detailed Use Cases - Patient](./06c-use-cases-patient.md)
- [07 Users & Use Cases Matrix](./07-users-use-cases-matrix.md)
- [08 Integrations](./08-integrations.md)
- [09 Reporting & Analytics](./09-reporting-and-analytics.md)
- [10 Non-Functional Requirements](./10-nfrs.md)
- [11 Summary & UI/UX Expectations](./11-summary-and-uiux.md)
- [12 Appendix & Wishlist](./12-appendix-and-wishlist.md)
- [13 Open Items & Clarifications](./13-open-items-and-clarifications.md)
- [14 Product Manager To-Do](./14-todo.md)
- [Decision Log (companion register)](./decision-log.md)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Appointment statuses | [03 / Appointment statuses](./03-definitions-and-domain-concepts.md#appointment-statuses) |
| Figure 2 | How the main concepts relate | [03 / How the main concepts relate](./03-definitions-and-domain-concepts.md#how-the-main-concepts-relate) |
| Figure 3 | Summarized workflow | [05 / Summarized Workflow](./05-user-journeys-overview.md#summarized-workflow) |
| Figure 4 | Integrations | [08 / Integrations](./08-integrations.md#integrations) |

**Tables**

The Actor & Goal table at the top of each use case is part of the use-case block and is not numbered.

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Changes Log | [00 / Changes Log](#changes-log) |
| Table 2 | Business Objectives | [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives) |
| Table 3 | Glossary | [02 / Glossary](./02-glossary-assumptions-facts.md#glossary) |
| Table 4 | Dependencies | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) |
| Table 5 | Appointment statuses | [03 / Appointment statuses](./03-definitions-and-domain-concepts.md#appointment-statuses) |
| Table 6 | Subscription plans | [03 / Subscription plans](./03-definitions-and-domain-concepts.md#subscription-plans) |
| Table 7 | In Scope items | [04 / In Scope](./04-scope-and-personas.md#in-scope) |
| Table 8 | Personas | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors) |
| Table 9 | Use Case Summary | [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary) |
| Table 10 | Users & Use Cases Matrix | [07 / Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix) |
| Table 11 | Integrations | [08 / Integrations](./08-integrations.md#integrations) |
| Table 12 | Reports and views | [09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics) |
| Table 13 | Non-Functional Requirements | [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements) |
| Table 14 | Source files | [12 / Appendix](./12-appendix-and-wishlist.md#appendix) |
| Table 15 | Technical Inputs for the SDD | [12 / Technical Inputs for the SDD](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) |
| Table 16 | How to read each item | [13 / How to read each item](./13-open-items-and-clarifications.md#how-to-read-each-item) |
| Table 17 | Resolution Log | [13 / Resolution Log](./13-open-items-and-clarifications.md#resolution-log) |
| Table 18 | Reviewer coverage record | [13 / Reviewer Notes](./13-open-items-and-clarifications.md#reviewer-notes) |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
