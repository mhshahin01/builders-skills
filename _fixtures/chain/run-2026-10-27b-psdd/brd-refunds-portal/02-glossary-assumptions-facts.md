<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges & Dependencies
PROJECT: Refunds Portal
VERSION: 1.4
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
-->

# Glossary

| Term | Definition |
|------|-----------|
| Refund request | A customer's request to get money back for items bought in a branch. |
| Refund window | The 30 days after purchase during which a refund can be requested. |
| Partial refund | A refund of part of the requested amount. |
| Branch | A physical store. Every purchase belongs to one branch. |
| Payout | The money sent back to the customer's original card. |
| Receipt number | The number printed on a branch receipt. The customer enters it to start a refund request. |
| Reference number | The number the portal gives a refund request when it is submitted. |
| SMS | Short Message Service: a text message sent to the customer's mobile phone. |
| BAT | Business acceptance testing: the business checks the portal and signs it off before go-live. |
| Card dispute | A customer's claim to their bank to get back a card payment. |

---

# Assumptions / Constraints

1. **Receipt number on every purchase**; every purchase has a receipt number the customer can enter.
2. **Payout to the original card only**; payouts go only to the card used for the purchase.
3. **One receipt number, one purchase**; the receipt number alone identifies one purchase across all branches and days. **[NEEDS CLARIFICATION: Is a receipt number unique across all 40 branches and all days, or must the customer also give the branch and the purchase date to identify the purchase?]**
4. **Receipts can be found soon after the purchase**; a customer can start a refund request on the day of the purchase. **[NEEDS CLARIFICATION: How soon after a purchase can its receipt be found in Point-of-Sale Records?]**

---

# Facts

1. About 1,200 refund requests a month across 40 branches.
2. Seasonal sales triple the number of requests for about 3 weeks.

---

# Challenges

1. Paper records get lost, and customers cannot see progress.

---

# Dependencies

| Dependency | Type | Owner | Status | Needed before | Notes |
|-----------|------|-------|--------|---------------|-------|
| Payment provider supports refunds to the original card | Hard | CardPay Ltd ([08 / Payment Provider](./08-integrations.md)) | **[NEEDS CLARIFICATION: Has CardPay Ltd confirmed that it supports refunds to the original card for purchases paid by card at a branch?]** **[NEEDS CLARIFICATION: Does CardPay Ltd require one merchant account for all branches or one account per branch to support these refunds?]** **[NEEDS CLARIFICATION: What time limit after the purchase, if any, does CardPay Ltd impose on these refunds?]** **[NEEDS CLARIFICATION: Which details of the original payment does CardPay Ltd need to support these refunds?]** | Build of UC-04 | CardPay's answer can change how the payout works, so it is needed before the build of [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) starts. **[NEEDS CLARIFICATION: Can CardPay Ltd report a dispute of the original card payment and its outcome ([06b / UC-04 BR-8](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund))?]** |
| Legal confirmation: which data-protection law applies to customer personal data, and whether consumer law gives refund rights beyond the 30-day refund window | Hard | **[NEEDS CLARIFICATION: Who confirms which data-protection law and which consumer refund rights apply to the Refunds Portal?]** | Pending | Go-live | Answers the open questions in [NFR-04](./10-nfrs.md#non-functional-requirements) and [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund) BR-8. |
| Point-of-Sale Records gives each receipt and its items | Hard | Retail IT team ([08 / Point-of-Sale Records](./08-integrations.md)) | **[NEEDS CLARIFICATION: Has the Retail IT team agreed to give the Refunds Portal the receipt lookup it needs (receipt, items, amounts, branch, purchase date, how the purchase was paid)?]** | Build of UC-01 | Every refund request starts with the receipt lookup ([06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund) step 2). |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
