<!--
CHUNK: 11
TITLE: Summary & UI/UX Expectations
PROJECT: Loyalty Points
VERSION: 1.1
DEPENDS_ON: 01, 10
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. UI/UX expectations describe what users experience, not how it is implemented. Technical implementation expectations are owned by the SDD.
-->

# Summary

Loyalty Points lets members see their points balance and every points movement, including points taken back after a refund.

---

# UI/UX Expectations

- **Primary Color**: **[NEEDS CLARIFICATION: What is the brand or key color for Loyalty Points?]**
- **Data Tables**: The points history lists movements newest first ([UC-02 step 2](./06a-use-cases-member.md#main-flow-1)). **[NEEDS CLARIFICATION: How many movements does the points history show at once, and how does the member reach older movements?]**
- **Filtration**: **[NEEDS CLARIFICATION: Can the member filter the points history, for example by date or by kind of movement?]**
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: The screens work on phones and computers.
- **Language & Locale**: **[NEEDS CLARIFICATION: Which languages do the screens support?]** **[NEEDS CLARIFICATION: Which date formats do the screens use?]** **[NEEDS CLARIFICATION: Which number formats do the screens use?]**
- **Points display**: Points are whole numbers. Negative movements show a minus sign.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
