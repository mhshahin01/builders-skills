<!--
CHUNK: 08
TITLE: Integrations
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: 05, 03
PART OF: BRD - Refunds Portal
-->

# Integrations

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| Payment Provider | Send refund payouts to the customer's original card | Payout requests, payout results | Both ways | Critical | CardPay Ltd |
| Notification Partner | Tell customers about their refund by email and SMS | Customer contact details, message content | We send | Important | MsgHub |
| Point-of-Sale Records | Look up the receipt and its items when a customer requests a refund | Receipt number, items, amounts, branch, purchase date | We receive | Critical | Retail IT team |
| Loyalty Points | Take back the points earned on a purchase once its refund is paid | Refund reference, receipt number, refunded amount, date the refund was paid | We send | High | Product Team (Loyalty Points BRD) |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 07-users-use-cases-matrix.md | NEXT: 09-reporting-and-analytics.md -->
