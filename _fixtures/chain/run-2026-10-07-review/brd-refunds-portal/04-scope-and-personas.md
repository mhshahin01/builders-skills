<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Refunds Portal
VERSION: 1.7
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
-->

# Project Scope

Customers request refunds online and follow them until they are paid. Branch managers decide on each request for their branch. Customers are told the outcome at each step.

## In Scope

- Online refund requests for purchases made in branches.
- Refund decisions by branch managers, in full or in part.
- Payout to the customer's original card.
- Messages to customers and branch managers by email and SMS.
- Tracking of each refund request by the customer until it is paid.
- Cancelling a request that is not decided yet.
- The branch refund report ([09](./09-reporting-and-analytics.md)).
- Return of the items to the branch before a refund is approved.
- Customer sign-up and sign-in, with a confirmed email address and mobile number.
- Branch manager sign-in, with the access set up outside the portal ([02 / Assumption 3](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- One portal that customers use on a computer, tablet, or phone. A separate mobile app is not part of this release.

## Out of Scope

- Refunds for online-shop purchases (a separate system handles them).
- Cash refunds, because payouts go only to the card used for the purchase ([02 / Constraint 2](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- Refunds given in person at a branch. These include paper requests still open at go-live, and claims under consumer law after the refund window, such as claims for faulty goods. The portal treats items refunded at a branch as already refunded (UC-01 A1, E5).

---

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Customer | Buyer who wants money back | Request a refund and know where it stands | Own requests only |
| Branch Manager | Runs one branch | Decide quickly on refunds for the branch | Own branch only, or a branch they cover |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
