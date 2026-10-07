<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Loyalty Points
VERSION: 1.3
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
-->

# Project Scope

Members see their points balance and the history of their points movements online.

## In Scope

- Earning points on branch purchases.
- Points balance and history for members.
- Taking points back when a purchase is refunded.
- Carrying over each member's points at go-live.
- Correcting a member's points when a complaint is upheld (UC-03).
- A monthly report of corrections for the Loyalty Administrator (chunk 09).
- Ending a former member's points and deleting their history after the retention period (chunk 03).

## Out of Scope

- Redeeming points: a later phase ([Wishlist](./12-appendix-and-wishlist.md#wishlist), item 1).
- Points expiry (chunk 03, Expiry). Any expiry rule comes with redeeming points in a later phase.
- Joining the loyalty program, member sign-in, and staff sign-in: other products provide them (chunk 02, Dependencies).

---

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Member | Customer in the loyalty program | Know their points balance and where it comes from | Own points only |
| Loyalty Administrator | Staff member of the Customer Service team who handles members' points complaints | Fix a member's balance when a complaint is upheld | All members' points: view and correct |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
