<!--
CHUNK: 08
TITLE: Integrations
PROJECT: Refunds Portal
VERSION: 1.4
DEPENDS_ON: 05, 03
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. Name the business system or partner and the business purpose of the integration (e.g., "Integration with Payment Gateway"). Protocols, data formats, authentication, and SLAs are technical design - they are owned by the SDD.
-->

# Integrations

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| Payment Provider | Send refund payouts to the customer's original card | Payout requests, payout results, disputes of the original card payment and their outcome | Both ways | Critical | CardPay Ltd |
| Notification Partner | Tell customers about their refund by email and SMS | Customer contact details, message content | We send | Important | MsgHub |
| Point-of-Sale Records | Look up the receipt and its items when a customer requests a refund | Receipt number, items, amounts, branch, purchase date, how the purchase was paid | We receive | Critical | Retail IT team |
| Loyalty Points | Tell Loyalty Points the outcome of each refund request, so it takes back the points of a paid refund | Reference number, receipt number, refunded amount, outcome (Paid, Rejected or Cancelled, or back to Approved when a Paid payout is sent back), date the refund was paid | We send | Important | Loyalty Points owner (the Loyalty Points BRD) |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 07-users-use-cases-matrix.md | NEXT: 09-reporting-and-analytics.md -->
