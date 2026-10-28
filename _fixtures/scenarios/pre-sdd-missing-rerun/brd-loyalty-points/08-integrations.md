<!--
CHUNK: 08
TITLE: Integrations
PROJECT: Loyalty Points
VERSION: 1.5
DEPENDS_ON: 05, 03
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. Name the business system or partner and the business purpose of the integration (e.g., "Integration with Payment Gateway"). Protocols, data formats, authentication, and SLAs are technical design - they are owned by the SDD.
-->

# Integrations

**Table 6 - Integrations**

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| POS Records | Know which purchases earn points | Member, purchase reference, purchase date, branch, amount | We receive | Critical | Retail IT team (the owner the Refunds Portal BRD names for the same Point-of-Sale Records) |
| Refunds Portal | Know which purchases are refunded, so the system takes their points back | Refund reference, purchase reference, refunded amount, refund outcome (paid, rejected or cancelled), date the refund was paid | We receive | Critical | See [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 07-users-use-cases-matrix.md | NEXT: 09-reporting-and-analytics.md -->
