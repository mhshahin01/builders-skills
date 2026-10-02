<!--
CHUNK: 00
TITLE: Cover, Changelog & Table of Contents
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: none
PART OF: BRD - Refunds Portal
-->

# Refunds Portal: Business Requirements Document (BRD)

**Project / Product Name:** Refunds Portal
**Version:** 1.1
**Status:** In Review (version 1.1 holds the changes of the business review of 2026-10-01, made after version 1.0 was approved; it needs sign-off by its approver, 14 / Delivery gate G6)
**Author:** Product Team
**Date:** 2026-10-01

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-09-22 | Product Team | Operations Lead | Head of Retail | Initial BRD. |
| 1.1 | 2026-10-01 | Product Team | Business review panel (Business Owner, SME, Product Manager, Principal Architect, Document Consistency) | - | Business review of 2026-10-01; its decision log is [review-comments-tracker.md](../review-comments-tracker.md), and each decision that changed this BRD is recorded in 13 with its tracker ID. 01: Objective 2 covers requests made in the portal; "How the objectives are measured", owned by the Head of Retail with a monthly review. 02: Assumptions / Constraints 1 (the receipt number, to confirm) and 3 (pilot branches, then waves, none in the seasonal sales period); Dependencies as a table (CardPay, POS Records, MsgHub: To confirm, each with an owner and the task it gates); Legal clearances L1 to L5. 03: Paid means the payment provider accepted the payout; "Customer account and messages". 04: Project Scope follows a request until it is paid; In Scope adds customer accounts, messages by SMS only when a mobile number is given, reporting paid refunds to Loyalty Points, and the refund reports; Out of Scope adds refunds handled at a branch outside the portal. 05: the Customer Journey starts with sign-in or registration and follows a request until Paid; UC-06 in the Use Case Summary. 06a: UC-01 Preconditions and E2 (online-shop purchases); UC-02 step 4 (payout delayed, payout reference), BR-2 (no native app). 06b: UC-04 step 7, E1 and AC-2 (the customer is told a payout is delayed), BR-4 (no decision on one's own request), screen SCR-03; new UC-06 View Branch Refund Report. The UC-02 and UC-04 future enhancements point to 12. 06a and 06b label every BR-n and AC-n inline at its existing position. 07: UC-06 row. 08: Loyalty Points row. 09: "Daily" defined (UC-06); monthly head-office refund report. 10: NFR-02 and NFR-03 measurable. 11: screens SCR-03 and SCR-04; the web app only. 12: Wishlist with an owner and a trigger per item. 13: OI-02 to OI-32 (15 applied, 16 open). 14: Business review table, gate Shut, new condition G6. 15 and 16 are Stale and not refreshed (gate shut). The review's verification pass also added the settlement-records question to 02 Dependencies 1, the refund reports to 04 In Scope, and mockup states to 14. Existing section numbers are unchanged. |

<!-- MASTER: refunds-portal-brd-master.md | PREV: none | NEXT: 01-executive-summary-and-context.md -->
