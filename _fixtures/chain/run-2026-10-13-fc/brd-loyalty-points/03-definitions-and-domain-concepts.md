<!--
CHUNK: 03
TITLE: Definitions & Important Details
PROJECT: Loyalty Points
VERSION: 1.6
DEPENDS_ON: 02
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. Explain domain concepts as the business understands them - lifecycles, rules, relationships. No data-schema, protocol, or implementation detail; that is owned by the SDD.
-->

# Definitions & Important Details

## Points movement

### Overview

Every change to a member's points balance is a points movement. There are two kinds:

- **Earned:** points a member earns on a branch purchase.
- **Taken back:** points the system takes back when the Refunds Portal reports that the refund of that purchase is paid ([UC-02 BR-1, BR-4, BR-5 and BR-7](./06a-use-cases-member.md#business-rules--constraints-1)).

The points balance is the sum of the movements.

**Expiry:** Points do not expire in this release. Points earned before redeeming or an expiry rule is added keep their full value. If a later release adds expiry, the expiry period of those points starts on the day the expiry rule starts, not on the day they were earned.

**[NEEDS CLARIFICATION: When a complaint about points is upheld, how is the member's balance corrected, given that Loyalty Points has no correction movement?]**

### Earning points

A member earns 1 point per 1 EUR spent on a branch purchase.

Points are whole numbers ([11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations)). **[NEEDS CLARIFICATION: When a purchase amount is not a whole number of euros (for example 12.60 EUR), is the number of points rounded down, rounded up, or rounded to the nearest whole point?]**

A purchase that reaches Loyalty Points after the day it was made still earns its points. This does not apply once the member has left the loyalty program ([Member leaves the loyalty program](#member-leaves-the-loyalty-program)). The movement of a late purchase keeps the purchase date ([UC-02 step 2](./06a-use-cases-member.md#main-flow-1)).

### Start of points

Branch purchases made on or after **[NEEDS CLARIFICATION: What is the date from which branch purchases earn points?]** earn points. A refund of a purchase made before that date takes back no points ([UC-02 BR-4](./06a-use-cases-member.md#business-rules--constraints-1)).

**[NEEDS CLARIFICATION: Do members have points from an earlier program that must show as an opening balance on the start date?]**

### Keeping points history

The system keeps every points movement while the member is in the loyalty program, so the balance always equals the sum of the movements. The system keeps the purchase and refund details behind each movement for **[NEEDS CLARIFICATION: How long must the system keep the purchase and refund details behind a points movement?]**. After that time, the movement stays in the history without its details ([UC-02 A2](./06a-use-cases-member.md#alternate--exception-flows-1)).

### Member leaves the loyalty program

When a member leaves the loyalty program, their points balance closes. A person who has left the loyalty program can no longer open their points balance or points history. A refund paid after the member left takes back no points. A purchase that reaches Loyalty Points after the member left earns no points, even if the member made it before leaving. The system deletes the member's points history and purchase details **[NEEDS CLARIFICATION: How long after a member leaves must the system delete their points history and purchase details?]**.

**[NEEDS CLARIFICATION: Which system or team records that a member has left the loyalty program?]**

**[NEEDS CLARIFICATION: Which data-protection law applies to members' points and purchase data?]**

<!-- MASTER: loyalty-points-brd-master.md | PREV: 02-glossary-assumptions-facts.md | NEXT: 04-scope-and-personas.md -->
