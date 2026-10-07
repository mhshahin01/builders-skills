<!--
CHUNK: 08
TITLE: Integrations
PROJECT: Refunds Portal
VERSION: 1.8
DEPENDS_ON: 05, 03
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. Name the business system or partner and the business purpose of the integration (e.g., "Integration with Payment Gateway"). Protocols, data formats, authentication, and SLAs are technical design - they are owned by the SDD.
-->

# Integrations

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| Payment Provider | Send refund payouts to the customer's original card | Payout requests, payout results | Both ways | Critical | CardPay Ltd |
| Notification Partner | Confirm customers' email addresses and mobile numbers at sign-up, send the code that resets a forgotten password, and tell customers and branch managers about refunds by email and SMS | Customer and branch manager contact details, message content | We send | Critical | MsgHub |
| Point-of-Sale Records | Look up the receipt and its items when a customer requests a refund, and share which items were refunded at a branch and which are in a portal request | Receipt number, items, amounts, branch, purchase date, items refunded at a branch (we receive), items in a portal request, and items freed again (we send), how the purchase was paid, discounts | Both ways | Critical | Retail IT team |
| Staff sign-in and branch manager access | Sign branch managers in, tell the portal which branches they run or cover, and supply contact details for their messages | Staff identity, branch manager access, branch, cover and cover dates, email address, mobile number | We receive | Critical | Retail IT team |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 07-users-use-cases-matrix.md | NEXT: 09-reporting-and-analytics.md -->
