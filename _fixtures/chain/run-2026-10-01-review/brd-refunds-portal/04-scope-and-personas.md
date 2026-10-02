<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
-->

# Project Scope

Customers request refunds online and follow them until they are paid, when the payout is sent to their card. Branch managers decide on each request for their branch. Customers are told the outcome at each step.

## In Scope

- Online refund requests for purchases made in branches.
- Refund decisions by branch managers, in full or in part.
- Refund reports: a daily report for each branch manager (UC-06) and a monthly head-office report (09; its audience's role is 13 / OI-13).
- Payout to the customer's original card.
- Customer accounts: customers register themselves with an email address, which is verified, and may add a mobile number to receive SMS.
- Customer messages by email, and by SMS when the customer's account has a mobile number.
- Reporting each paid refund to Loyalty Points, so that points earned on the refunded purchase are taken back (08).

## Out of Scope

- Refunds for online-shop purchases (a separate system handles them).
- Cash refunds.
- Recording refunds handled at a branch outside the portal: walk-in requests, purchases older than the refund window, and purchases not paid by card.

---

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Customer | Buyer who wants money back | Request a refund and know where it stands | Own requests only |
| Branch Manager | Runs one branch | Decide quickly on refunds for the branch | Own branch only |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
