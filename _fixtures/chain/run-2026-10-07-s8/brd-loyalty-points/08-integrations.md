<!--
CHUNK: 08
TITLE: Integrations
PROJECT: Loyalty Points
VERSION: 1.3
DEPENDS_ON: 05, 03
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. Name the business system or partner and the business purpose of the integration (e.g., "Integration with Payment Gateway"). Protocols, data formats, authentication, and SLAs are technical design - they are owned by the SDD.
-->

# Integrations

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| POS Records | Tells this product which member purchases earn points | Member, purchase reference, purchase date, branch, amount paid | We receive | Critical | Store Operations team |
| Refunds Portal | Take back points when a refund is paid | Refund reference, purchase reference, refund date, amount refunded, refund outcome | We receive | Critical | See chunk 02, Dependencies |
| Member sign-in and membership | Tells this product which member is signed in and when a member leaves or rejoins the program | Member and their member number, date the member left or rejoined the program | We receive | Critical | See chunk 02, Dependencies |
| Staff sign-in | Tells this product which staff member is signed in and whether they hold the Loyalty Administrator role | Staff member, Loyalty Administrator role | We receive | Critical | See chunk 02, Dependencies |
| Points balances at go-live | Gives each member's points at the start of the go-live date, once | Member, points held at the start of the go-live date | We receive | Critical | See chunk 02, Dependencies |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 07-users-use-cases-matrix.md | NEXT: 09-reporting-and-analytics.md -->
