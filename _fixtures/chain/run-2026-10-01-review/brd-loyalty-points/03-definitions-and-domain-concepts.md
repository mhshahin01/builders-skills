<!--
CHUNK: 03
TITLE: Definitions & Domain Concepts
PROJECT: Loyalty Points
VERSION: 1.3
DEPENDS_ON: 02
PART OF: BRD - Loyalty Points
-->

# Definitions & Important Details

## Points movement

Every change to a member's balance is a points movement: points earned on a purchase, or points taken back after a refund of that purchase. The balance is the sum of the movements.

- **Earning:** A purchase earns 1 point for each whole 1 EUR spent. Cents earn no points: a 12.60 EUR purchase earns 12 points.
- **Earning rule changes:** The earning rule is set by this BRD and owned by its product manager. A purchase keeps the rule it earned under: a refund of it takes points back by that rule, even if the rule has changed since.
- **Taking back:** [UC-02 BR-1, BR-3, and BR-4](./06a-use-cases-member.md#uc-02-view-points-history) state when a refund takes points back, and how many.
- **No 0-point movements:** A purchase or refund that changes the balance by 0 points creates no movement. For example, a 0.80 EUR purchase earns no points and creates no movement.
- **Movement date:** A movement of points earned carries the purchase date. A movement of points taken back carries the date the Refunds Portal reported the refund as paid, which is the Paid date the customer sees in the Refunds Portal.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 02-glossary-assumptions-facts.md | NEXT: 04-scope-and-personas.md -->
