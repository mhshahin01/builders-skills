<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges, Dependencies
PROJECT: Refunds Portal
VERSION: 1.0
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

1. Every purchase has a receipt number the customer can enter.
2. Payouts go only to the card used for the purchase.

# Facts

1. About 1,200 refund requests a month across 40 branches.
2. Seasonal sales triple the number of requests for about 3 weeks.

# Challenges

1. Paper records get lost, and customers cannot see progress.

# Dependencies

1. The payment provider must support refunds to the original card. (Hard dependency)

<!-- MASTER: refunds-portal-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
