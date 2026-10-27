<!--
CHUNK: 11
TITLE: Summary & UI/UX Expectations
PROJECT: Refunds Portal
VERSION: 1.5
DEPENDS_ON: 01, 10
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. UI/UX expectations describe what users experience, not how it is implemented. Technical implementation expectations are owned by the SDD.
-->

# Summary

The Refunds Portal lets customers request and follow refunds online. Branch managers decide in one place. Approved refunds are paid to the original card, and customers are told about their request as [03 / Customer messages](./03-definitions-and-domain-concepts.md#customer-messages) sets out.

---

# UI/UX Expectations

- **Primary Color**: **[NEEDS CLARIFICATION: What is the brand or key color of the Refunds Portal?]**
- **Data Tables**: Lists keep the order their use case states (UC-04 step 2: oldest first). **[NEEDS CLARIFICATION: Do the refund request lists need paging or export, and if so which?]**
- **Filtration**: **[NEEDS CLARIFICATION: Do the refund request lists need filters?]** **[NEEDS CLARIFICATION: If filters are needed for the refund request lists, which ones are required, for example status?]**
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: The customer use cases (UC-01 to UC-03) work in a web browser on phones and computers. A customer mobile app is out of scope ([04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)). **[NEEDS CLARIFICATION: On which devices must the branch manager's screens work?]**
- **Language & Locale**: **[NEEDS CLARIFICATION: Which languages does the portal support?]** **[NEEDS CLARIFICATION: Which currency does the portal use?]** **[NEEDS CLARIFICATION: Which date and number formats does the portal use?]**
- **Amounts**: Amounts always show the currency.
- **Accessibility**: The customer screens meet **[NEEDS CLARIFICATION: Which accessibility standard and level must the customer screens meet?]**.

## Screens

| Screen ID | Screen | Use cases |
|-----------|--------|-----------|
| SCR-01 | Refund request form | UC-01 |
| SCR-02 | My refund requests (list and request detail) | UC-02, UC-03 |

The branch manager's decision screen has no screen ID yet. Its mockup is MK-03 ([14-todo.md](./14-todo.md)). The [branch refund report](./09-reporting-and-analytics.md#reporting--analytics) has no screen ID and no mockup yet.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
