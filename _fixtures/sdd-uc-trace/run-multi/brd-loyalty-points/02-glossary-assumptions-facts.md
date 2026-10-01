<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges, Dependencies
PROJECT: Loyalty Points
VERSION: 1.2
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
-->

# Glossary

| Term | Meaning |
|------|---------|
| Points | Credit a customer earns on purchases: 1 point for every 1 unit of currency spent. |
| Voucher | A code worth a fixed amount off a future purchase, bought with points. |
| Adjustment | A correction to a customer's points made by a loyalty manager, always with a reason. |
| Payout | The points added to a customer's balance for a purchase. |

# Assumptions / Constraints

1. Every purchase is linked to the customer's loyalty card at the till.

# Facts

1. About 200,000 customers hold points.
2. A voucher is worth 10 units of currency for every 500 points.

# Challenges

1. Customers cannot see their balance today.

# Dependencies

1. Purchase records from the tills, including refunds. (Hard dependency)

<!-- MASTER: loyalty-points-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
