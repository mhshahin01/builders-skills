<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges & Dependencies
PROJECT: Loyalty Points
VERSION: 1.6
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
-->

# Glossary

**Table 1 - Glossary**

| Term | Definition |
|------|-----------|
| Member | A customer who joined the loyalty program. |
| Points | The reward a member earns on branch purchases. The earning rule is in [03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points). |
| Points movement | One change to a member's points balance: points earned on a purchase, or points taken back after that purchase is refunded. See [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement). |
| Points balance | The sum of all points movements of one member. See [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement). |
| Points history | The list of all points movements of one member. |
| Branch | A store of the business where members make purchases. |
| Refund | A customer's request to get money back for a purchase. The Refunds Portal handles it and reports its outcome: paid, rejected or cancelled. A refund made outside the Refunds Portal does not reach Loyalty Points ([UC-02 BR-7](./06a-use-cases-member.md#business-rules--constraints-1)). |
| Refunds Portal | The business system that handles refunds and their outcomes. |
| POS Records | The business's records of branch purchases (POS: point of sale). |
| EUR | Euro, the currency in which purchases are counted for points. |
| BAT | Business acceptance testing: the business checks the product before sign-off. |

---

# Assumptions / Constraints

1. **Same-day purchase records**; every branch purchase by a member is known the same day.

---

# Facts

**[NEEDS CLARIFICATION: section Facts is required by the template but not present in the source. Which known facts drive the design of Loyalty Points?]**

---

# Challenges

**[NEEDS CLARIFICATION: section Challenges is required by the template but not present in the source. Which known risks or data problems affect Loyalty Points?]**

---

# Dependencies

**Table 2 - Dependencies**

| Dependency | Type | Owner | Status | Needed before | Notes |
|-----------|------|-------|--------|---------------|-------|
| Refunds Portal (refund outcomes) | Hard | **[NEEDS CLARIFICATION: Who owns the Refunds Portal dependency?]** | Confirmed | None in this release: go-live does not wait for it ([04 / Project Scope](./04-scope-and-personas.md#project-scope)). | Gives the refund outcomes that take points back ([UC-02 BR-1](./06a-use-cases-member.md#business-rules--constraints-1), [NFR-02](./10-nfrs.md#non-functional-requirements)). UC-02 take-backs start once the Refunds Portal reports refund outcomes. A refund paid before the day it starts to report takes back no points ([UC-02 BR-7](./06a-use-cases-member.md#business-rules--constraints-1)). |
| POS Records (branch purchases) | Hard | See [08 / Integrations](./08-integrations.md#integrations) | **[NEEDS CLARIFICATION: Is the POS Records dependency confirmed, with its owner and treatment agreed?]** | **[NEEDS CLARIFICATION: When is the POS Records dependency needed: before the build of UC-01, before BAT sign-off, or before go-live?]** | Gives the branch purchases that earn points ([03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points), Assumption 1). |
| Legal confirmation: which data-protection law applies to members' points and purchase data | Hard | **[NEEDS CLARIFICATION: Who confirms which data-protection law applies to Loyalty Points?]** | Pending | Go-live | Answers the open question in [03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program). |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
