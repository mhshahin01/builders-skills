<!--
CHUNK: 01
TITLE: Executive Summary, Background & Business Objectives
PROJECT: Loyalty Points
VERSION: 1.5
DEPENDS_ON: none
PART OF: BRD - Loyalty Points
-->

# Executive Summary

Loyalty Points lets members earn points on branch purchases and see their points balance and history online.

[Background and Context / Problem Statement](#background-and-context--problem-statement) describes the business problem it solves.

Core capabilities:

- Members see their current points balance ([UC-01](./06a-use-cases-member.md#uc-01-view-points-balance)).
- Members see the history of their points movements ([UC-02](./06a-use-cases-member.md#uc-02-view-points-history)).
- The system takes back points when a purchase is refunded ([UC-02](./06a-use-cases-member.md#uc-02-view-points-history), Business Rules).
- A Loyalty Administrator corrects a member's points when a complaint is upheld ([UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)).

---

# Background and Context / Problem Statement

Today members cannot check their points balance or its history themselves. To check their points, they call a branch.

---

# Business Objectives

1. Members trust their points balance, measured by NFR-01 (chunk 10).
2. Members check their points online instead of calling a branch: calls to branches about points fall by at least 50%. The measure takes the calls in the 6th calendar month after the go-live month. It compares them with the monthly average of the 3 calendar months before the go-live month. Branches count these calls in their daily call log.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-glossary-assumptions-facts.md -->
