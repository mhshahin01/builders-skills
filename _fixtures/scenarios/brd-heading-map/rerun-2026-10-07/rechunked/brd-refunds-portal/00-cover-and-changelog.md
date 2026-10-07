<!--
CHUNK: 00
TITLE: Refunds Portal: Business Requirements Document (BRD)
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

- [00 Refunds Portal: Business Requirements Document (BRD)](./00-cover-and-changelog.md)
- [01 Executive Summary](./01-executive-summary-and-context.md)
- [02 Glossary](./02-glossary-assumptions-facts.md)
- [03 Definitions & Important Details](./03-definitions-and-domain-concepts.md)
- [04 Project Scope](./04-scope-and-personas.md)
- [05 User Journeys & Use Cases](./05-user-journeys-overview.md)
- [06a Detailed Use Cases - Customer](./06a-use-cases-customer.md)
- [06b Detailed Use Cases - Branch Manager](./06b-use-cases-branch-manager.md)
- [07 Users & Use Cases Matrix](./07-users-use-cases-matrix.md)
- [08 Integrations](./08-integrations.md)
- [09 Reporting / Analytics](./09-reporting-and-analytics.md)
- [10 Non-Functional Requirements](./10-nfrs.md)
- [11 Summary](./11-summary-and-uiux.md)
- [12 Appendix](./12-appendix-and-wishlist.md)
- [13 Open Items & Clarifications](./13-open-items-and-clarifications.md)
- [14 Product Manager To-Do](./14-todo.md)
- [15 Implementation Plan](./15-implementation.md)
- [16 Refunds Portal - UAT/BAT Test Cases](./16-uat-bat-test-cases.md)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Changes Log | [Changes Log](./00-cover-and-changelog.md#changes-log) |
| Table 2 | Glossary | [Glossary](./02-glossary-assumptions-facts.md) |
| Table 3 | Personas / Actors | [Personas / Actors](./04-scope-and-personas.md#personas--actors) |
| Table 4 | Use Case Summary | [Use Case Summary](./05-user-journeys-overview.md#use-case-summary) |
| Table 5 | UC-01: Request a Refund | [UC-01: Request a Refund](./06a-use-cases-customer.md#uc-01-request-a-refund) |
| Table 6 | UC-02: Track Refund Status (Web and Mobile) | [UC-02: Track Refund Status (Web and Mobile)](./06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) |
| Table 7 | UC-03: Cancel a Refund Request | [UC-03: Cancel a Refund Request](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request) |
| Table 8 | UC-04: Approve / Reject Refund | [UC-04: Approve / Reject Refund](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) |
| Table 9 | Users & Use Cases Matrix | [Users & Use Cases Matrix](./07-users-use-cases-matrix.md) |
| Table 10 | Integrations | [Integrations](./08-integrations.md) |
| Table 11 | Reporting / Analytics | [Reporting / Analytics](./09-reporting-and-analytics.md) |
| Table 12 | Non-Functional Requirements | [Non-Functional Requirements](./10-nfrs.md) |
| Table 13 | Screens | [Screens](./11-summary-and-uiux.md#screens) |
| Table 14 | Appendix | [Appendix](./12-appendix-and-wishlist.md) |
| Table 15 | Technical Inputs for the SDD | [Technical Inputs for the SDD](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) |
| Table 16 | Resolution Log | [Resolution Log](./13-open-items-and-clarifications.md#resolution-log) |
| Table 17 | Waves | [Waves](./15-implementation.md#waves) |
| Table 18 | Use-case coverage | [Use-case coverage](./15-implementation.md#use-case-coverage) |
| Table 19 | Test environment and data prerequisites | [Test environment and data prerequisites](./16-uat-bat-test-cases.md#test-environment-and-data-prerequisites) |
| Table 20 | 1. Refund Requests (UC-01, UC-02, UC-03, SCR-01, SCR-02) | [1. Refund Requests (UC-01, UC-02, UC-03, SCR-01, SCR-02)](./16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) |
| Table 21 | 2. Refund Decisions (UC-04, MK-03) | [2. Refund Decisions (UC-04, MK-03)](./16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03) |
| Table 22 | 3. Cross-Cutting UI/UX Standards (chunk 11) | [3. Cross-Cutting UI/UX Standards (chunk 11)](./16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) |
| Table 23 | 4. NFR Acceptance (NFR-01, NFR-02) | [4. NFR Acceptance (NFR-01, NFR-02)](./16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) |
| Table 24 | Traceability Matrix | [Traceability Matrix](./16-uat-bat-test-cases.md#traceability-matrix) |
| Table 25 | Execution summary (fill at the end of the cycle) | [Execution summary (fill at the end of the cycle)](./16-uat-bat-test-cases.md#execution-summary-fill-at-the-end-of-the-cycle) |

<!-- MASTER: refunds-portal-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
