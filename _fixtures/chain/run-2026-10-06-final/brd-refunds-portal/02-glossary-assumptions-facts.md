<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges & Dependencies
PROJECT: Refunds Portal
VERSION: 1.7
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
-->

# Glossary

| Term | Definition |
|------|-----------|
| Refund request | A customer's request to get money back for items bought in a branch. |
| Refund window | The period after purchase during which a refund can be requested. Its length is set in the Business Rules of [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund). |
| Partial refund | A refund of part of the requested amount. |
| Branch | A physical store. Every purchase belongs to one branch. |
| Payout | The money sent back to the customer's original card. |
| Original card | The card the customer paid with for the purchase. |
| Receipt number | The number that identifies a purchase receipt. The customer enters it to start a refund request. |
| Reference number | The number the portal gives a refund request when the customer submits it. |
| Point-of-Sale Records | The branch sales records. They hold each receipt with its items, amounts, branch, and purchase date. |
| SMS | A text message sent to a mobile phone. |
| Item | One unit of a product on a receipt. A receipt line with 3 units holds 3 items. |
| WCAG | Web Content Accessibility Guidelines: the public standard for screens that people with disabilities can use. Level AA is its middle level. |
| CSV | Comma-separated values: a simple file of rows and columns that spreadsheet programs open. |

---

# Assumptions / Constraints

1. **Receipt number (confirmed assumption)**; every purchase has a receipt number the customer can enter.
2. **Original card only (constraint)**; payouts go only to the card used for the purchase. The only exception is a request in Payout failed, which the branch settles outside the portal.
3. **Branch manager access (confirmed assumption)**; who is a branch manager, which branch they run, who covers them, and their email address and mobile number are set up outside the portal. Branch managers sign in to the portal with that access.

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
| Payment provider support for refunds to the original card | Hard | Payment Provider (CardPay Ltd, [08](./08-integrations.md)) | To be verified | Build of UC-04 | Every payout depends on it. |
| Point-of-Sale Records with every branch's receipts, which also stop items in a portal request from being refunded at a branch | Hard | Retail IT team ([08](./08-integrations.md)) | To be verified | Build of UC-01 | Every request starts with a receipt check. The portal tells them the items in each request and the items freed again (UC-01 step 6, UC-03 step 5, UC-04 A2, E1). |
| Notification Partner sending email and SMS to customers and branch managers | Hard | Notification Partner (MsgHub, [08](./08-integrations.md)) | To be verified | Build of UC-06 | Sign-up and a password reset cannot finish without it (UC-06 step 4, A3). For later messages, customers still see the status in UC-02. |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
