<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges, Dependencies
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
-->

# Glossary

| Term | Meaning |
|------|---------|
| Refund request | A customer's request to get money back for items bought in a branch. |
| Refund window | The 30 days after purchase during which a refund can be requested. |
| Partial refund | A refund of part of the requested amount. |
| Branch | A physical store. Every purchase belongs to one branch. |
| Payout | The money sent back to the customer's original card. |

# Assumptions / Constraints

1. Every purchase has a receipt number the customer can enter, and that number identifies one purchase across all branches (to confirm, Dependencies 2).
2. Payouts go only to the card used for the purchase.
3. The portal goes live in pilot branches first, then in waves until every branch uses it. No go-live and no wave falls inside the seasonal sales period (Facts 2).

# Facts

1. About 1,200 refund requests a month across 40 branches.
2. Seasonal sales triple the number of requests for about 3 weeks.

# Challenges

1. Paper records get lost, and customers cannot see progress.

# Dependencies

| # | Dependency | Status | Owner | What must be confirmed in writing | Needed before |
|---|------------|--------|-------|-----------------------------------|---------------|
| 1 | The payment provider (CardPay Ltd) refunds to the original card. (Hard dependency) | To confirm | Product manager | Refunds to the card used for the purchase, without card details from us; whether it is the acquirer of the branch card terminals, or linked to it; a payout sent twice is paid once; how and when we learn the result of a payout; whether a payout it has accepted can still fail or be reversed afterwards, and how we would learn of it (a refund already shown as Paid); which reference of the original card payment it needs; how many days a refund takes to appear on the card; a reference the customer can quote to their bank; whether a purchase the customer has disputed with their bank can be detected before a payout; its fees; whether it offers settlement records that paid refunds can be checked against (12 Wishlist item 4); a test environment that can refuse a payout | TASK-03 starts |
| 2 | Point-of-Sale Records (Retail IT team) answers a receipt look-up. | To confirm | Product manager | Look-up by receipt number with the items, amounts, branch, purchase date, and how the receipt was paid; the format of the receipt number, and whether it identifies one purchase across all branches and over time (if it does not, the customer also gives the branch, or a code printed on the receipt is used); its availability | TASK-01 starts |
| 3 | The notification partner (MsgHub) sends customer email and SMS. | To confirm | Product manager | Email and SMS to customers; a message sent twice reaches the customer once; a test environment | TASK-01 starts |

## Legal clearances

Each clearance is a condition of go-live, and of the BAT sign-off in chunk 16, unless it names an earlier point.

| # | Clearance | Status | Owner | What must be confirmed in writing | Needed before |
|---|-----------|--------|-------|-----------------------------------|---------------|
| L1 | Lawful basis for customer data | To confirm | Data protection owner | The legal ground recorded for using customers' contact details and refund records to handle their refund and tell them about it, and that erasing a customer's contact details on request, while keeping the closed refund record, answers an erasure request | Go-live |
| L2 | Partners that process customer data for us | To confirm | Data protection owner | A data processing agreement with the payment provider (CardPay Ltd) and the notification partner (MsgHub), and the countries where each processes the data | Go-live |
| L3 | Keeping periods | To confirm | Product manager, with finance and the data protection owner | The periods of [13 / OI-10](./13-open-items-and-clarifications.md#oi-10-how-long-refund-records-contact-details-and-message-records-are-kept) | Go-live |
| L4 | Card-payment security scope (PCI DSS) | To confirm | Security owner | With CardPay Ltd: the portal never receives card details, so its card-payment security scope excludes it | TASK-03 starts |
| L5 | Certifications | To confirm | Security owner | Whether an ISO 27001 or SOC 2 scope applies to the portal | Go-live |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
