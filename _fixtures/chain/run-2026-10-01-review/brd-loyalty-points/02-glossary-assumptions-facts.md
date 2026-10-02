<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges, Dependencies
PROJECT: Loyalty Points
VERSION: 1.3
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

| Dependency | Status | Owner | What must be confirmed in writing | Needed before |
|------------|--------|-------|-----------------------------------|---------------|
| Refunds Portal (refund outcomes) | Confirmed: the Refunds Portal BRD commits to report each paid refund (REFUNDS 04 In Scope, 08) | Product manager | - | TASK-01 acceptance: the Refunds Portal's refund decisions and payout (REFUNDS TASK-03) work end to end with the payment provider's test environment; the launch order is OI-17 |
| POS Records (every branch purchase by a member, reported on the day of the purchase, with its receipt number) | To confirm | Product manager | That POS Records (Retail IT team) reports each member purchase on the day of the purchase, with the receipt number a refund of it will quote, in the same form as the receipt look-up of the Refunds Portal; and whether that number identifies one purchase across all branches and over time | TASK-01 starts |
| Member sign-in (existing loyalty program account) | To confirm | Product manager | Which system members sign in with, and how their member number reaches Loyalty Points, in the same form as POS Records reports it with each purchase | TASK-02 starts |

## Legal clearances

Each clearance is a condition of go-live, and of the BAT sign-off in chunk 16.

| # | Clearance | Status | Owner | What must be confirmed in writing | Needed before |
|---|-----------|--------|-------|-----------------------------------|---------------|
| L1 | Lawful basis for member data | To confirm | Data protection owner | The legal ground recorded for keeping members' purchases and points records and showing them to the member, and that deleting a member's points record on request answers an erasure request | Go-live |
| L2 | Loyalty program terms | To confirm | Product manager, with the retailer's legal adviser | That the terms members agreed to cover earning 1 point per whole euro (03) and taking points back after a refund (UC-02 BR-1, BR-3, BR-4), whether the existing program's exclusions and expiry apply ([13 / OI-15](./13-open-items-and-clarifications.md#oi-15-moving-from-the-existing-loyalty-program)), and what happens to the record of a member who leaves ([13 / OI-11](./13-open-items-and-clarifications.md#oi-11-what-happens-to-a-members-points-record-when-they-leave-the-program)); or that members are told of new terms before go-live | Go-live |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
