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
**Author:** **[NEEDS CLARIFICATION: Founders to name the BRD author; pre-BRD 02 names no product manager.]**
**Date:** 2026-10-07
**Status:** Draft

## Changes Log

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|--------------|------------|----------------------|----------------|
| 1.0 | 2026-10-07 | Codex | | Initial draft transformed from the approved-as-is pre-BRD; owner questions retained; OI-01 and OI-02 applied, consistency corrections included. Chunks: none (initial build) |


## Table of Contents

- [Executive Summary](./01-executive-summary-and-context.md#executive-summary)
- [Background and Context / Problem Statement](./01-executive-summary-and-context.md#background-and-context--problem-statement)
- [Business Objectives](./01-executive-summary-and-context.md#business-objectives)
  - [Upstream questions](./01-executive-summary-and-context.md#upstream-questions)
- [Glossary](./02-glossary-assumptions-facts.md#glossary)
- [Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)
- [Facts](./02-glossary-assumptions-facts.md#facts)
- [Challenges](./02-glossary-assumptions-facts.md#challenges)
- [Dependencies](./02-glossary-assumptions-facts.md#dependencies)
  - [Upstream questions](./02-glossary-assumptions-facts.md#upstream-questions)
- [Definitions & Important Details](./03-definitions-and-domain-concepts.md#definitions--important-details)
  - [Appointment and reply](./03-definitions-and-domain-concepts.md#appointment-and-reply)
  - [Waitlist and slot allocation](./03-definitions-and-domain-concepts.md#waitlist-and-slot-allocation)
  - [Consent and message eligibility](./03-definitions-and-domain-concepts.md#consent-and-message-eligibility)
  - [Clinic boundaries](./03-definitions-and-domain-concepts.md#clinic-boundaries)
  - [Upstream questions](./03-definitions-and-domain-concepts.md#upstream-questions)
- [Project Scope](./04-scope-and-personas.md#project-scope)
  - [In Scope](./04-scope-and-personas.md#in-scope)
  - [Out of Scope](./04-scope-and-personas.md#out-of-scope)
- [Personas / Actors](./04-scope-and-personas.md#personas--actors)
  - [Upstream questions](./04-scope-and-personas.md#upstream-questions)
- [User Journeys & Use Cases](./05-user-journeys-overview.md#user-journeys--use-cases)
  - [User Journeys](./05-user-journeys-overview.md#user-journeys)
  - [Summarized Workflow](./05-user-journeys-overview.md#summarized-workflow)
  - [Use Case Summary](./05-user-journeys-overview.md#use-case-summary)
  - [Upstream questions](./05-user-journeys-overview.md#upstream-questions)
- [Detailed Use Cases - Clinic Owner](./06a-use-cases-clinic-owner.md#detailed-use-cases---clinic-owner)
  - [UC-01: Use the clinic account](./06a-use-cases-clinic-owner.md#uc-01-use-the-clinic-account)
  - [UC-02: Read the weekly no-show report](./06a-use-cases-clinic-owner.md#uc-02-read-the-weekly-no-show-report)
  - [UC-03: Pay the clinic subscription](./06a-use-cases-clinic-owner.md#uc-03-pay-the-clinic-subscription)
  - [Upstream questions](./06a-use-cases-clinic-owner.md#upstream-questions)
- [Detailed Use Cases - Receptionist](./06b-use-cases-receptionist.md#detailed-use-cases---receptionist)
  - [UC-04: Record patient consent](./06b-use-cases-receptionist.md#uc-04-record-patient-consent)
  - [UC-05: Maintain clinic appointments](./06b-use-cases-receptionist.md#uc-05-maintain-clinic-appointments)
  - [UC-06: Run and inspect appointment reminders](./06b-use-cases-receptionist.md#uc-06-run-and-inspect-appointment-reminders)
  - [UC-07: Maintain the waitlist](./06b-use-cases-receptionist.md#uc-07-maintain-the-waitlist)
  - [UC-08: Review the day's appointment status](./06b-use-cases-receptionist.md#uc-08-review-the-days-appointment-status)
  - [Upstream questions](./06b-use-cases-receptionist.md#upstream-questions)
- [Detailed Use Cases - Patient](./06c-use-cases-patient.md#detailed-use-cases---patient)
  - [UC-09: Confirm or cancel a visit](./06c-use-cases-patient.md#uc-09-confirm-or-cancel-a-visit)
  - [UC-10: Take an offered slot](./06c-use-cases-patient.md#uc-10-take-an-offered-slot)
  - [UC-11: Stop patient messages](./06c-use-cases-patient.md#uc-11-stop-patient-messages)
  - [Upstream questions](./06c-use-cases-patient.md#upstream-questions)
- [Users & Use Cases Matrix](./07-users-use-cases-matrix.md#users--use-cases-matrix)
- [Integrations](./08-integrations.md#integrations)
  - [Upstream questions](./08-integrations.md#upstream-questions)
- [Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)
  - [Upstream questions](./09-reporting-and-analytics.md#upstream-questions)
- [Non-Functional Requirements](./10-nfrs.md#non-functional-requirements)
  - [Upstream questions](./10-nfrs.md#upstream-questions)
- [Summary](./11-summary-and-uiux.md#summary)
- [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)
- [Appendix](./12-appendix-and-wishlist.md#appendix)
  - [Source crosswalk](./12-appendix-and-wishlist.md#source-crosswalk)
  - [Technical Inputs for the SDD](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)
- [Wishlist](./12-appendix-and-wishlist.md#wishlist)
  - [Upstream questions](./12-appendix-and-wishlist.md#upstream-questions)
- [Open Items & Clarifications](./13-open-items-and-clarifications.md#open-items--clarifications)
  - [How to read each item](./13-open-items-and-clarifications.md#how-to-read-each-item)
  - [Open Items](./13-open-items-and-clarifications.md#open-items)
  - [Resolution Log](./13-open-items-and-clarifications.md#resolution-log)
  - [Reviewer Notes](./13-open-items-and-clarifications.md#reviewer-notes)
- [Product Manager To-Do](./14-todo.md#product-manager-to-do)
  - [Checklist at a glance](./14-todo.md#checklist-at-a-glance)
  - [Delivery gate](./14-todo.md#delivery-gate)
  - [Downstream outputs](./14-todo.md#downstream-outputs)
  - [Step 1 - Resolve open items and clarifications](./14-todo.md#step-1---resolve-open-items-and-clarifications)
  - [Step 2 - Run a consistency check across all BRD chunks](./14-todo.md#step-2---run-a-consistency-check-across-all-brd-chunks)
  - [Step 3 - Finalise requirements with the grill-me skill](./14-todo.md#step-3---finalise-requirements-with-the-grill-me-skill)
  - [Step 4 - Generate mockups in Figma](./14-todo.md#step-4---generate-mockups-in-figma)
  - [Step 5 - Update the use-case chunks with use-case diagrams and flowcharts](./14-todo.md#step-5---update-the-use-case-chunks-with-use-case-diagrams-and-flowcharts)

## Figures Index

| Figure | Title | Location |
|--------|-------|----------|
| Figure 1 | Appointment reply lifecycle | [03](./03-definitions-and-domain-concepts.md#figure-1---appointment-reply-lifecycle) |
| Figure 2 | Reminder and refill journey | [05](./05-user-journeys-overview.md#figure-2---reminder-and-refill-journey) |
| Figure 3 | Business partners | [08](./08-integrations.md#figure-3---business-partners) |

## Tables Index

| Table | Title | Location |
|-------|-------|----------|
| Table 1 | Business Objectives | [01](./01-executive-summary-and-context.md#business-objectives) |
| Table 2 | Glossary | [02](./02-glossary-assumptions-facts.md#glossary) |
| Table 3 | Challenges | [02](./02-glossary-assumptions-facts.md#challenges) |
| Table 4 | Dependencies | [02](./02-glossary-assumptions-facts.md#dependencies) |
| Table 5 | In Scope | [04](./04-scope-and-personas.md#in-scope) |
| Table 6 | Personas / Actors | [04](./04-scope-and-personas.md#personas--actors) |
| Table 7 | Use Case Summary | [05](./05-user-journeys-overview.md#use-case-summary) |
| Table 8 | UC-01: Use the clinic account | [06a](./06a-use-cases-clinic-owner.md#uc-01-use-the-clinic-account) |
| Table 9 | UC-02: Read the weekly no-show report | [06a](./06a-use-cases-clinic-owner.md#uc-02-read-the-weekly-no-show-report) |
| Table 10 | UC-03: Pay the clinic subscription | [06a](./06a-use-cases-clinic-owner.md#uc-03-pay-the-clinic-subscription) |
| Table 11 | UC-04: Record patient consent | [06b](./06b-use-cases-receptionist.md#uc-04-record-patient-consent) |
| Table 12 | UC-05: Maintain clinic appointments | [06b](./06b-use-cases-receptionist.md#uc-05-maintain-clinic-appointments) |
| Table 13 | UC-06: Run and inspect appointment reminders | [06b](./06b-use-cases-receptionist.md#uc-06-run-and-inspect-appointment-reminders) |
| Table 14 | UC-07: Maintain the waitlist | [06b](./06b-use-cases-receptionist.md#uc-07-maintain-the-waitlist) |
| Table 15 | UC-08: Review the day's appointment status | [06b](./06b-use-cases-receptionist.md#uc-08-review-the-days-appointment-status) |
| Table 16 | UC-09: Confirm or cancel a visit | [06c](./06c-use-cases-patient.md#uc-09-confirm-or-cancel-a-visit) |
| Table 17 | UC-10: Take an offered slot | [06c](./06c-use-cases-patient.md#uc-10-take-an-offered-slot) |
| Table 18 | UC-11: Stop patient messages | [06c](./06c-use-cases-patient.md#uc-11-stop-patient-messages) |
| Table 19 | Users & Use Cases Matrix | [07](./07-users-use-cases-matrix.md#users--use-cases-matrix) |
| Table 20 | Integrations | [08](./08-integrations.md#integrations) |
| Table 21 | Reporting / Analytics | [09](./09-reporting-and-analytics.md#reporting--analytics) |
| Table 22 | Non-Functional Requirements | [10](./10-nfrs.md#non-functional-requirements) |
| Table 23 | Appendix | [12](./12-appendix-and-wishlist.md#appendix) |
| Table 24 | Source crosswalk | [12](./12-appendix-and-wishlist.md#source-crosswalk) |
| Table 25 | Technical Inputs for the SDD | [12](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) |
| Table 26 | Wishlist | [12](./12-appendix-and-wishlist.md#wishlist) |
| Table 27 | Resolution Log | [13](./13-open-items-and-clarifications.md#resolution-log) |
| Table 28 | Reviewer Notes | [13](./13-open-items-and-clarifications.md#reviewer-notes) |
| Table 29 | Checklist at a glance | [14](./14-todo.md#checklist-at-a-glance) |
| Table 30 | Delivery gate | [14](./14-todo.md#delivery-gate) |
| Table 31 | Downstream outputs | [14](./14-todo.md#downstream-outputs) |
| Table 32 | Open items register | [14](./14-todo.md#open-items-register) |
| Table 33 | Check runs | [14](./14-todo.md#check-runs) |
| Table 34 | Consistency findings | [14](./14-todo.md#consistency-findings) |
| Table 35 | Mockup coverage | [14](./14-todo.md#mockup-coverage) |
| Table 36 | Step 5 - Update the use-case chunks with use-case diagrams and flowcharts | [14](./14-todo.md#step-5---update-the-use-case-chunks-with-use-case-diagrams-and-flowcharts) |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
