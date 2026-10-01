<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: none
PART OF: BRD - Refunds Portal
-->

# Refunds Portal: Business Requirements Document (BRD)

**Project / Product Name:** Refunds Portal
**Version:** 1.0
**Status:** Approved
**Author:** Product Team
**Date:** 2026-09-22

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-09-22 | Product Team | Operations Lead | Head of Retail | Initial BRD. |

---

## Table of Contents

- [Executive Summary](./01-executive-summary-and-context.md)
- [Background and Context](./01-executive-summary-and-context.md#background-and-context)
- [Business Objectives](./01-executive-summary-and-context.md#business-objectives)
- [Glossary](./02-glossary-assumptions-facts.md)
- [Assumptions / Constraints](./02-glossary-assumptions-facts.md#assumptions--constraints)
- [Facts](./02-glossary-assumptions-facts.md#facts)
- [Challenges](./02-glossary-assumptions-facts.md#challenges)
- [Dependencies](./02-glossary-assumptions-facts.md#dependencies)
- [Definitions & Important Details](./03-definitions-and-domain-concepts.md)
  - [Refund request lifecycle](./03-definitions-and-domain-concepts.md#refund-request-lifecycle)
  - [Branch ownership](./03-definitions-and-domain-concepts.md#branch-ownership)
- [Project Scope](./04-scope-and-personas.md)
  - [In Scope](./04-scope-and-personas.md#in-scope)
  - [Out of Scope](./04-scope-and-personas.md#out-of-scope)
- [Personas / Actors](./04-scope-and-personas.md#personas--actors)
- [User Journeys & Use Cases](./05-user-journeys-overview.md)
  - [User Journeys](./05-user-journeys-overview.md#user-journeys)
    - [Customer Journey](./05-user-journeys-overview.md#customer-journey)
    - [Branch Manager Journey](./05-user-journeys-overview.md#branch-manager-journey)
  - [Summarized Workflow](./05-user-journeys-overview.md#summarized-workflow)
  - [Use Case Summary](./05-user-journeys-overview.md#use-case-summary)
- [Detailed Use Cases - Customer](./06a-use-cases-customer.md)
  - [UC-01: Request a Refund](./06a-use-cases-customer.md#uc-01-request-a-refund)
  - [UC-02: Track Refund Status (Web and Mobile)](./06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile)
  - [UC-03: Cancel a Refund Request](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request)
- [Detailed Use Cases - Branch Manager](./06b-use-cases-branch-manager.md)
  - [UC-04: Approve / Reject Refund](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)
- [Users & Use Cases Matrix](./07-users-use-cases-matrix.md)
- [Integrations](./08-integrations.md)
- [Reporting / Analytics](./09-reporting-and-analytics.md)
- [Non-Functional Requirements](./10-nfrs.md)
- [Summary](./11-summary-and-uiux.md)
- [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)
  - [Screens](./11-summary-and-uiux.md#screens)
- [Appendix](./12-appendix-and-wishlist.md)
  - [Technical Inputs for the SDD](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd)
- [Wishlist](./12-appendix-and-wishlist.md#wishlist)
- [Open Items & Clarifications](./13-open-items-and-clarifications.md)
  - [Open Items](./13-open-items-and-clarifications.md#open-items)
    - [OI-01: Partial refunds as a separate use case](./13-open-items-and-clarifications.md#oi-01-partial-refunds-as-a-separate-use-case)
  - [Resolution Log](./13-open-items-and-clarifications.md#resolution-log)
- [Product Manager To-Do](./14-todo.md)
- [Implementation Plan](./15-implementation.md)
  - [Waves](./15-implementation.md#waves)
  - [Use-case coverage](./15-implementation.md#use-case-coverage)
- [Refunds Portal - UAT/BAT Test Cases](./16-uat-bat-test-cases.md)
  - [How to use this document](./16-uat-bat-test-cases.md#how-to-use-this-document)
  - [Test environment and data prerequisites](./16-uat-bat-test-cases.md#test-environment-and-data-prerequisites)
  - [1. Refund Requests (UC-01, UC-02, UC-03, SCR-01, SCR-02)](./16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02)
  - [2. Refund Decisions (UC-04, MK-03)](./16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03)
  - [3. Cross-Cutting UI/UX Standards (chunk 11)](./16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11)
  - [4. NFR Acceptance (NFR-01, NFR-02)](./16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02)
  - [Traceability Matrix](./16-uat-bat-test-cases.md#traceability-matrix)
  - [Provisional and blocked scenarios](./16-uat-bat-test-cases.md#provisional-and-blocked-scenarios)
  - [Coverage gaps](./16-uat-bat-test-cases.md#coverage-gaps)
  - [Execution summary (fill at the end of the cycle)](./16-uat-bat-test-cases.md#execution-summary-fill-at-the-end-of-the-cycle)

<!-- MASTER: refunds-portal-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
