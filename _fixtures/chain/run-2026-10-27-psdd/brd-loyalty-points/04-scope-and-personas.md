<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Loyalty Points
VERSION: 1.6
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
-->

# Project Scope

Members see their points balance and the history of their points movements online.

Loyalty Points can go live on its own date: it does not wait for the Refunds Portal. It goes live in all branches at once, after BAT sign-off, once every dependency needed before go-live is in place ([02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)).

## In Scope

- Earning points on branch purchases, using the earning rule in [03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points) and the purchases received from POS Records ([08 / Integrations](./08-integrations.md#integrations)).
- Points balance and history for members.
- Taking points back when the Refunds Portal reports a refund as paid ([UC-02 BR-1, BR-4, BR-5 and BR-7](./06a-use-cases-member.md#business-rules--constraints-1)).

## Out of Scope

- Redeeming points (a later phase). **[NEEDS CLARIFICATION: When is redeeming points planned?]** At launch, the points balance tells members that points cannot be used yet ([UC-01 step 2](./06a-use-cases-member.md#main-flow)).
- Handling member complaints about points, and correcting points by hand. Complaints are handled by **[NEEDS CLARIFICATION: Which team receives and decides member complaints about points?]**.

---

# Personas / Actors

**Table 3 - Personas**

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Member | Customer in the loyalty program | Know their points balance and where it comes from | Own points only |

People who answer member calls and complaints about points have no view of a member's points in this release ([NFR-05](./10-nfrs.md#non-functional-requirements)).

<!-- MASTER: loyalty-points-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
