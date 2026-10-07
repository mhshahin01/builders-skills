<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Portal
VERSION: 1.9
DEPENDS_ON: none
PART OF: BRD - Refunds Portal
-->

# Refunds Portal - Business Requirements & High-Level Design

**Version:** 1.9
**Author:** Product Team
**Date:** 2026-10-06
**Status:** In Review

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|-------------|------------|---------------------|----------------|
| 1.0 | 2026-09-22 | Product Team | Operations Lead (reviewed); Head of Retail (approved) | Initial BRD. |
| 1.1 | 2026-10-04 | Product Team | | Migrated to the current template. Cover: new title, one Reviewed/Approved By column, Table of Contents, Figures and Tables indices. 01: Executive Summary split from Background, with a core capabilities list; the request volume is kept once, in 02 Facts. 02: Glossary adds Original card, Receipt number, Reference number, Point-of-Sale Records, SMS; assumptions and constraints labelled; Dependencies become a table (Owner, Status, Needed before). 03: lifecycle figure (Figure 1). 05: Summarized Workflow figure (Figure 2). 06a, 06b: use-case structure list. 07: footnote 2 (own requests only) for the Customer on UC-02 and UC-03. 09: Format column. 10: Quality column. 11: UI/UX Expectations follow the template standards; the screen list moves to the use cases and the to-do. 12: Technical Inputs table reshaped; the v1.0 implementation plan and test cases are kept as reference files. Review items OI-02 to OI-23 accepted and applied: Objective 1 measured from Submitted to Paid; In Scope completed; items returned before approval; customer sign-up and sign-in (new UC-06); no mobile app, and UC-02 renamed from "Track Refund Status (Web and Mobile)" to "Track Refund Status" (ID unchanged); in-branch refunds shared with Point-of-Sale Records; receipt total asked; card-only refunds; refund amount, item, repeat-request, and window rules; preconditions corrected; new exception flows UC-01 E3 and E4, UC-03 E2, UC-04 E2; partial-approval reason shown; new end status Payout failed; daily waiting-requests message and cover branch manager; Supporting Actors and two Dependencies added; NFR-05 Performance and NFR-06 Accessibility; refund records rule; the window and the seasonal peak kept once. Consistency check Run 1 corrections: the cover branch manager carried into 03, 04, UC-04, and NFR-04 (OI-18); tracking ends at Paid in 01, 04, and 05 (OI-02); messages to branch managers in 02, 04, and 08 (OI-17, OI-18); privacy notice at sign-up (OI-22); UC-06 A2 (OI-05). Items OI-24 to OI-27 (raised by Run 1) accepted and applied: Notification Partner rated Hard and Critical; requests unlinked from the account at the end of the keeping period; Point-of-Sale Records told about portal requests; nine acceptance criteria for alternate and exception flows. Consistency check Run 2 corrections: the Point-of-Sale Records dependency covers the items the portal sends (OI-26); UC-01 AC-4 matches BR-6 (OI-11). Items OI-28 and OI-29 (raised by Run 2) accepted and applied: a cover gets the covered branch's messages; an unused account is closed after a period the legal owner sets. Consistency check Run 3 corrections: UC-01 A1 matches BR-6 (OI-11); UC-01 E1 covers the second window check at step 5 (OI-12); the Point-of-Sale Records purpose names the items in a portal request (OI-26). Chunks: 00, 01, 02, 03, 04, 05, 06a, 06b, 07, 08, 09, 10, 11, 12, 13. |
| 1.2 | 2026-10-05 | Product Team | | To-do step 1 decisions applied (TD-01, TD-03 to TD-12, TD-15 to TD-17): UC-06 sign-up details confirmed (a password, a confirmation code for each address, a new code for a wrong or expired one, one account per email address); dependency owners and Needed before confirmed while the dependencies stay to be verified; the receipt-number and branch-manager-access assumptions confirmed, with branch manager contact details and sign-in (new UC-04 precondition); report format confirmed and CSV added to the Glossary; a payout that still fails after 24 hours becomes Payout failed; the cancellation message goes by email and SMS; branch managers can open Payout failed requests (UC-04 BR-7, AC-7); a customer care view and online-shop refunds in the portal added to the Wishlist; Data Tables, Filtration, and Language & Locale confirmed; the cash refunds reason confirmed. Consistency check Run 4 corrections: UC-04 A3 and its precondition for Payout failed requests (TD-11); the cover rule in UC-04 BR-7 and 11 Filtration (OI-18, OI-28); branch manager sign-in in In Scope (TD-07); UC-01 AC-8 for the window check at submission (OI-27). Item OI-30 (raised by Run 4) accepted and applied: the 24-hour limit is kept once, in UC-04 E1, with 03 pointing to it. Chunks: 00, 02, 03, 04, 06a, 06b, 09, 11, 12, 13. |
| 1.3 | 2026-10-05 | Product Team | | To-do step 1 finished (TD-02, TD-13, TD-14, TD-24), with values the product manager gave as test-fixture values (decision-log.md): a request is kept 7 years after its last status change; an account with no sign-in for 2 years and no linked request is closed; claims under consumer law after the refund window are handled in person at the branch (04 Out of Scope); the primary color is #1F6FEB. Consistency check Run 7 correction: UC-01 step 2 shows every item on the receipt, as A1 and AC-4 say (OI-11, OI-27). Chunks: 00, 03, 04, 06a, 11. |
| 1.4 | 2026-10-05 | Product Team | | Grill-me session decisions applied (TD-26 to TD-40; 10 change the BRD, 5 confirm it as written): Objective 1 includes the customer's trip to bring the items back; the approval confirms that the items are back (UC-04 BR-4); NFR-02 counts planned and unplanned disruption, but not a partner outage the portal handles with its own message; UC-01 A1 goes on to step 3; UC-06 E1 sends a new code on request and returns to step 5, and E2 leads to sign-in as in A1; UC-04 E1 goes on at step 7 when a later try succeeds; a confirmation code works for 15 minutes, and only the latest one works (UC-06 BR-3, BR-4); the daily waiting-requests message goes only on days with waiting requests (UC-04 BR-5); the branch refund report counts all of the branch's requests up to the end of the previous day. Plain-language edits in UC-04 A3 and E1 (no fact changed). Consistency check Run 9 corrections: UC-04 BR-4 names a lower amount or a rejection when items come back incomplete or damaged (TD-38); acceptance criteria UC-01 AC-9, UC-06 AC-6, and UC-04 AC-8 test the new flow outcomes (OI-27). Item OI-31 (raised by Run 9) accepted and applied: UC-06 E3 when codes cannot be sent, with UC-06 AC-7, and NFR-02 names it. Chunks: 00, 01, 06a, 06b, 09, 10, 13. |
| 1.5 | 2026-10-05 | Product Team | | To-do step 4: the product manager approved the prototypes MK-01 to MK-05 after review and a play-through (a test-fixture confirmation, recorded in 14-todo.md). UC-06 UI/UX now links its approved prototype (mockup MK-04) instead of a pending wireframe. Chunks: 00, 06a. |
| 1.6 | 2026-10-05 | Product Team | | To-do step 5: the use-case diagram (Figure 3) added to 05; flowcharts added to UC-01, UC-02, UC-03, and UC-06 (06a) and to UC-04 (06b) (Figures 4-8). Consistency check Run 13 corrections: Figure 4 keeps "not Cancelled" (OI-11); Figure 8 points at UC-04 E1 for the time limit (OI-30). Item OI-32 (raised by Run 13) accepted and applied: UC-06 E1 and E2 say what happens when the customer turns down the offer, with UC-06 AC-8 and AC-9, and Figure 7 shows both paths. Consistency check Run 14 correction: Figure 7 shows the customer's choices in UC-06 E1 and E2 as decision nodes, with steps 1-2 in one node (CF-51). Figure 8 node O3 says the items are freed at the branch, as UC-04 E1 says (CF-56). Consistency check Run 15 correction: the Figure 7 Summary is two sentences, with no fact changed (CF-53). Chunks: 00, 05, 06a, 06b, 13. |
| 1.7 | 2026-10-05 | Product Team | | Items OI-33 and OI-34 (raised by consistency check Run 16) accepted and applied: UC-06 A3 for a forgotten password and E4 for a failed sign-in, with UC-06 AC-10 and AC-11, Figure 7 showing both paths, and the reset code named in 08 / Notification Partner and 02 / Dependencies; UC-01 E5 for a receipt with nothing left to refund, with UC-01 AC-10, Figure 4 showing it, and 04 / Out of Scope pointing to it. Consistency check Run 16 corrections: the v1.6 row names the Figure 8 O3 wording (CF-56) and the Run 15 correction (CF-57); the run records in 14 (CF-58); three supersede notes in decision-log.md (CF-59). Consistency check Run 17 correction: the step 5 record in 14 (CF-60). Consistency check Run 18 corrections: the step 1 record in 14 (CF-62) and this row (CF-63). Chunks: 00, 02, 04, 06a, 08, 13. |
| 1.8 | 2026-10-06 | Codex (business-reviewer-unifier) | | Business review 2026-10-06 in Codex ([tracker](../review-comments-tracker.md)). BO-02: 01, 09; BO-03: 02, 08; BO-04: 06a, 06b. Owner hand-offs pending; gated outputs Stale. Verification confirmed the template and preserved criterion order. Chunks: 01, 02, 06a, 06b, 08, 09. |
| 1.9 | 2026-10-06 | Codex (brd-unifier) | | R3b owner hand-off: carry BO-04 into Figure 4 submission and Figure 8 approval labels. Existing branches and outcomes stay the same. Tracking correction CF-64 and derived count/index correction CF-65 recorded; gated delivery refresh follows the source rules BO-02 to BO-04. Chunks: 06a, 06b. |

<!-- One row per update that changes content (delivery-chunks.md § Refresh triggers, Version). Status follows sign-off (delivery-chunks.md § Refresh triggers, Cover status): Approved, with the approver's name in Reviewed/Approved By, only when the user names the approver. -->

---

## Table of Contents

- [00 Cover, Changelog & Table of Contents](./00-cover-and-changelog.md)
- [01 Executive Summary, Background & Business Objectives](./01-executive-summary-and-context.md)
- [02 Glossary, Assumptions, Facts, Challenges & Dependencies](./02-glossary-assumptions-facts.md)
- [03 Definitions & Important Details](./03-definitions-and-domain-concepts.md)
- [04 Project Scope & Personas](./04-scope-and-personas.md)
- [05 User Journeys & Use Cases - Overview](./05-user-journeys-overview.md)
- [06a Detailed Use Cases - Customer](./06a-use-cases-customer.md)
- [06b Detailed Use Cases - Branch Manager](./06b-use-cases-branch-manager.md)
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
| Figure 1 | Refund request lifecycle | [03 / Refund request lifecycle](./03-definitions-and-domain-concepts.md#figure-1---refund-request-lifecycle) |
| Figure 2 | Summarized Workflow | [05 / Summarized Workflow](./05-user-journeys-overview.md#figure-2---summarized-workflow) |
| Figure 3 | Use cases: Overview | [05 / Use Case Diagrams](./05-user-journeys-overview.md#figure-3---use-cases-overview) |
| Figure 4 | Flowchart: UC-01 Request a Refund | [06a / UC-01 Flowchart](./06a-use-cases-customer.md#figure-4---flowchart-uc-01-request-a-refund) |
| Figure 5 | Flowchart: UC-02 Track Refund Status | [06a / UC-02 Flowchart](./06a-use-cases-customer.md#figure-5---flowchart-uc-02-track-refund-status) |
| Figure 6 | Flowchart: UC-03 Cancel a Refund Request | [06a / UC-03 Flowchart](./06a-use-cases-customer.md#figure-6---flowchart-uc-03-cancel-a-refund-request) |
| Figure 7 | Flowchart: UC-06 Sign Up and Sign In | [06a / UC-06 Flowchart](./06a-use-cases-customer.md#figure-7---flowchart-uc-06-sign-up-and-sign-in) |
| Figure 8 | Flowchart: UC-04 Approve / Reject Refund | [06b / UC-04 Flowchart](./06b-use-cases-branch-manager.md#figure-8---flowchart-uc-04-approve--reject-refund) |

| Figure 9 | UC-06 - Used email address and sign-up code retry | [06 / Flowchart continuation](./06a-use-cases-customer.md#figure-9---uc-06---used-email-address-and-sign-up-code-retry) |
| Figure 10 | UC-06 - Sign-in and failed sign-in | [06 / Flowchart continuation](./06a-use-cases-customer.md#figure-10---uc-06---sign-in-and-failed-sign-in) |
| Figure 11 | UC-06 - Forgotten password and reset code | [06 / Flowchart continuation](./06a-use-cases-customer.md#figure-11---uc-06---forgotten-password-and-reset-code) |
| Figure 12 | UC-04 - Payout result and retry | [06 / Flowchart continuation](./06b-use-cases-branch-manager.md#figure-12---uc-04---payout-result-and-retry) |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Glossary | [02 / Glossary](./02-glossary-assumptions-facts.md#glossary) |
| Table 2 | Dependencies | [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) |
| Table 3 | Personas / Actors | [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors) |
| Table 4 | Use Case Summary | [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary) |
| Table 5 | Users & Use Cases Matrix | [07](./07-users-use-cases-matrix.md) |
| Table 6 | Integrations | [08](./08-integrations.md) |
| Table 7 | Reporting / Analytics | [09](./09-reporting-and-analytics.md) |
| Table 8 | Non-Functional Requirements | [10](./10-nfrs.md) |
| Table 9 | Appendix files | [12 / Appendix](./12-appendix-and-wishlist.md#appendix) |
| Table 10 | Technical Inputs for the SDD | [12 / Technical Inputs for the SDD](./12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) |

<!-- MASTER: refunds-portal-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
