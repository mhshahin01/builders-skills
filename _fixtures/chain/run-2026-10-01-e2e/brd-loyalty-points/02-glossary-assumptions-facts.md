<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges, Dependencies
PROJECT: Loyalty Points
VERSION: 1.1
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
-->

# Glossary

| Term | Definition |
|------|------------|
| Member | A customer who joined the loyalty program. |
| Points | Credit a member earns on branch purchases. [Chunk 03](./03-definitions-and-domain-concepts.md#points-movement) states how points are earned and taken back. |
| POS Records | The partner that reports member purchases made at branch checkouts. POS means point of sale. |

# Assumptions

None.

# Dependencies

| Dependency | Status |
|------------|--------|
| Refunds Portal (refund outcomes) | Confirmed |
| POS Records (every branch purchase by a member, reported on the day of the purchase) | Confirmed |
| Member sign-in (existing loyalty program account) | Confirmed |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
