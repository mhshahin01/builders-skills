<!--
CHUNK: 01
TITLE: Executive Summary, Background & Business Objectives
PROJECT: Loyalty Points
VERSION: 1.6
DEPENDS_ON: none
PART OF: BRD - Loyalty Points
-->

# Executive Summary

Loyalty Points keeps each member's points and shows them to the member online. Members earn points on branch purchases. Members see their points balance and the history of their points movements. When the Refunds Portal reports a refund as paid, the system takes back points for the refunded amount ([UC-02 BR-1, BR-4, BR-5 and BR-7](./06a-use-cases-member.md#business-rules--constraints-1)).

Core capabilities:

- Points earned on each branch purchase of a member ([03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points)).
- Points balance for each member ([UC-01](./06a-use-cases-member.md#uc-01-view-points-balance)).
- Points history for each member, including points taken back after a refund ([UC-02](./06a-use-cases-member.md#uc-02-view-points-history)).
- Taking points back when the Refunds Portal reports a refund as paid ([UC-02 BR-1, BR-4, BR-5 and BR-7](./06a-use-cases-member.md#business-rules--constraints-1)).

---

# Background and Context / Problem Statement

The Background and Context / Problem Statement section is required by the template but is not present in the source. **[NEEDS CLARIFICATION: What is the current state today?]** **[NEEDS CLARIFICATION: What problem does Loyalty Points solve?]**

**[NEEDS CLARIFICATION: What is Loyalty Points expected to cost to build and run?]** **[NEEDS CLARIFICATION: What business value is Loyalty Points expected to return, for example more repeat purchases or fewer branch calls?]**

---

# Business Objectives

1. Members trust their points balance. Measure: [NFR-01](./10-nfrs.md#non-functional-requirements).
2. Members can check their points at any time without calling a branch. Measure: branch calls about points go down from **[NEEDS CLARIFICATION: How many calls about points do branches receive per month today?]** to **[NEEDS CLARIFICATION: How many branch calls about points per month is the target after go-live?]** by **[NEEDS CLARIFICATION: By which date must the branch-call target be reached?]**. Each branch counts the calls about points it receives. Counting starts at least one full calendar month before go-live, so the result can be compared, and goes on after go-live.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-glossary-assumptions-facts.md -->
