<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Portal
VERSION: 1.5
DEPENDS_ON: none
PART OF: BRD - Refunds Portal
-->

# Refunds Portal - Business Requirements & High-Level Design

**Version:** 1.5
**Author:** Product Team
**Date:** 2026-10-10
**Status:** In Review

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|-------------|------------|---------------------|----------------|
| 1.0 | 2026-09-22 | Product Team | Reviewed: Operations Lead; Approved: Head of Retail | Initial BRD. Chunks: none (initial build) |
| 1.1 | 2026-10-10 | Requirements Analyst agent (brd-unifier skill, Claude Code) | | Migrated to the current template from BRD v1.0 (read-only copy in 12 / Appendix). Clarification markers added where the current template asks for content the source does not give. Independent review raised OI-02 to OI-26: OI-02 to OI-09 and OI-12 to OI-26 accepted and applied; OI-10 and OI-11 still open. UC-02 renamed from "Track Refund Status (Web and Mobile)" to "Track Refund Status"; its ID is unchanged (OI-05). Mockups for screens SCR-01 and SCR-02 are now MK-01 and MK-02; MK-03 is unchanged. Matrix footnote 2 added for own-requests access. Reviewer Notes applied: Technical Inputs note restored, SoW listed in the Appendix, UC-04 E1 split into short sentences. Consistency check Run 3 raised OI-27 and OI-28, both accepted and applied (new acceptance criteria; Point-of-Sale Records named in UC-01), and corrected CF-01 to CF-06, CF-09 and CF-10 (statements that answered open markers now point to them, a mobile app listed as Out of Scope, own-branch and own-requests rules linked to their 03 homes, Tables index renumbered from Table 3). Run 4 corrected CF-12 (03 / Customer messages states the partial-approval message decided by OI-16; the open marker now asks only about a full approval; UC-04 AC-1 reworded to match step 9), CF-13 (NFR-04 also points to UC-04 BR-4) and CF-16 (04 / Out of Scope no longer restates 11). Chunks: 01, 02, 03, 04, 05, 06a, 06b, 07, 08, 09, 10, 11, 12, 13 |
| 1.2 | 2026-10-10 | Requirements Analyst agent (brd-unifier skill, Claude Code) | | Applied the correction that waited for application, TD-40 (CF-19): the first sentence of the NFR-04 measure now says who the answers to the open questions allow to see a request. Took the grill-me session of 2026-10-10: it returned no decisions. Its new questions N1 to N3 raised OI-29 to OI-31, accepted and applied: planned maintenance counts toward the NFR-02 limit (OI-29); in a partial approval the branch manager lowers the amount item by item, with UC-04 A1 and BR-2 reworded and AC-9 added (OI-30); a payout still being tried again under UC-04 E1 at the end of a month counts as delayed, not missing, in NFR-01 (OI-31). OI-10 and OI-11 still open. Consistency check Run 6 corrected CF-21 (the OI-10 Concern now quotes the current UC-04 BR-2). Chunks: 06b, 10 |
| 1.3 | 2026-10-10 | Review Panel agent (business-reviewer-unifier skill, Claude Code) | | Business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md)); its points were decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08). Points applied: BO-02 (01: marker on today's cost and the expected saving); BO-06 (02: Legal confirmation dependency, needed before go-live); BO-08 (06b: UC-04 BR-7, marker on a second approver above an amount); BO-09 (01: Business Objectives 4 and 5, targets as markers); SME-02 (02: Assumptions 3 and 4 with markers); SME-03 (03: what Paid means, marker on a Paid payout sent back, Paid message says when the money shows); SME-04 (06b: UC-04 BR-8, marker on card disputes); SME-05 (02: CardPay row asks its conditions, needed before the build of UC-04, answers the TD-07 marker); SME-06 (10: NFR-07 Tax and accounting records); SME-07 (03: decision-record actor for a payout result recorded by hand; 04: marker on who owns payout exceptions and the monthly check); SME-09 (06a: UC-01 BR-9 and BR-10 markers); PM-02 (04: goes live on its own date, rollout marker); PM-03 (09: marker on a view across all branches); PM-04 (05: report in the Branch Manager Journey; 11: report has no screen ID or mockup yet); PM-09 (12: marker on when wishlist items start); PM-10 (03: customer told on a full approval; 06b: UC-04 step 8 and AC-10, answers TD-10); PM-11 (04: marker on a customer care view); DC-06 (02: Point-of-Sale Records dependency; 08: Loyalty Points row); DC-07 (03: the decision record is deleted only when the NFR-06 period ends). Rejected with no change: BO-07, DC-10. Verify fixes: 05 Figure 1 and its Summary show the approval message (PM-10). Records: [decision-log / Business review register](./decision-log.md#business-review-register). Chunks: 01, 02, 03, 04, 05, 06a, 06b, 08, 09, 10, 11, 12 |
| 1.4 | 2026-10-10 | Requirements Analyst agent (brd-unifier skill, Claude Code) | | Took the hand-off of the business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md)). Its decisions were checked, not applied again; its open remainders raised TD-44 to TD-68 and the open items OI-32 to OI-47; TD-07 and TD-10 are closed as settled by review points SME-05 and PM-10. Open items accepted and applied: OI-37 (a Paid payout the customer's bank sends back goes back to Approved and follows UC-04 E1; UC-04 AC-11; 08 / Loyalty Points outcome); OI-38 (the payout waits while the customer's card dispute is open; UC-04 BR-8, E3, AC-12, AC-13; 03 lifecycle, Customer messages and Decision record; 08 / Payment Provider; 02 / Glossary "Card dispute"); OI-40 (a payout recorded by hand as paid needs a second staff member; 03 / Decision record); OI-41 (the UC-04 E1 message to the branch manager is for information only); OI-44 (the portal starts in a pilot group of branches, with three markers; UC-01 E6 and AC-10). OI-40 and OI-41 also narrowed the 04 / Personas payout marker. Consistency check Run 8 raised OI-48 and OI-49, both accepted and applied: a payout held for a card dispute counts as waiting, not missing, in NFR-01 (OI-48); Loyalty Points is an external supporting party of UC-03 and UC-04, with UC-03 BR-3 and AC-3 and UC-04 BR-9 and AC-14 (OI-49). Run 8 also corrected CF-23 (NFR-04 names the staff who record a payout result by hand and points to the new open questions in 04 and UC-04 BR-7), CF-24 (03 / Customer messages row "Back to Approved"), CF-26 (02 CardPay row marker on disputes), CF-28 ("the customer's bank" in 03 and UC-04), CF-29 (two 04 / In Scope bullets), CF-31 (the 01, 02 CardPay and NFR-07 markers split, one question each) and CF-36 (UC-04 AC-1 "with no card dispute"), and added Carried notes to decision-log.md (CF-30) and the next free 06 chunk to the OI-47 Recommended Answer (CF-35). Consistency check Run 9 raised OI-50, accepted and applied: until Loyalty Points starts, the portal keeps the refund outcomes and sends them when it starts, and 04 / In Scope lists the outcomes sent to Loyalty Points (OI-50). Run 9 also corrected CF-37 (UC-04 AC-15 and AC-16 for the dispute shown and the payout sent after a refused dispute), CF-39 (NFR-04: staff who record or confirm a payout result by hand) and CF-40 (OI-47 Concern, OI-39 Where). New to-do rows: TD-44 to TD-77. OI-10, OI-11, OI-32 to OI-36, OI-39, OI-42, OI-43 and OI-45 to OI-47 still open. Chunks: 01, 02, 03, 04, 06a, 06b, 08, 10 |
| 1.5 | 2026-10-10 | Requirements Analyst agent (brd-unifier skill, Claude Code) | | Applied the two corrections that waited for application. TD-78 (CF-42, carries OI-50): UC-03 BR-3 and UC-04 BR-9 now say that, before Loyalty Points starts, the system keeps the outcome and sends it when Loyalty Points starts, with a link to 04 / Project Scope; UC-03 AC-4 and UC-04 AC-17 test it. TD-79 (CF-43): the undecided OI-39 now names NFR-04 in its Where field and its Recommended Answer. Consistency check Run 11 corrected CF-44 (the 11 / Language & Locale currency and formats marker split in two, one question each) and reworded three undecided open items so that applying them leaves no stale pointer: CF-45 (OI-32 names UC-04 step 8, AC-1 and NFR-04), CF-46 (OI-39 and OI-47 each remove their own team from the NFR-04 note after the 04 / Personas link; OI-47 replaces the 04 customer care marker) and CF-47 (OI-45 adds the use case the new persona needs). Run 12 corrected, again in undecided open items only, CF-48 (OI-32 and OI-47 use the next free 06 chunk), CF-49 (OI-32 also covers UC-04 BR-8 and AC-16 and adds a criterion for the second approval) and CF-50 (the 09 row OI-45 inserts asks its frequency and format as markers). UC-03 BR-3 and UC-04 BR-9 were put in plain language with the system as actor, meaning unchanged. New to-do rows: TD-80 (from CF-44) and TD-81 (CF-52, found by Run 13, waits for the next request). OI-10, OI-11, OI-32 to OI-36, OI-39, OI-42, OI-43 and OI-45 to OI-47 still open. Chunks: 06a, 06b, 11 |

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
- [Decision Log](./decision-log.md)

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | [Summarized refund workflow](./05-user-journeys-overview.md#figure-1---summarized-refund-workflow) | 05 / Summarized Workflow |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Glossary Table | 02 / Glossary |
| Table 2 | Dependencies | 02 / Dependencies |
| Table 3 | Customer messages | 03 / Customer messages |
| Table 4 | Personas / Actors | 04 / Personas / Actors |
| Table 5 | Use Case Summary | 05 / Use Case Summary |
| Table 6 | Users & Use Cases Matrix | 07 / Users & Use Cases Matrix |
| Table 7 | Integrations | 08 / Integrations |
| Table 8 | Reports | 09 / Reporting / Analytics |
| Table 9 | Non-Functional Requirements | 10 / Non-Functional Requirements |
| Table 10 | Screens | 11 / Screens |
| Table 11 | Appendix files | 12 / Appendix |
| Table 12 | Technical Inputs for the SDD | 12 / Technical Inputs for the SDD |

<!-- MASTER: refunds-portal-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
