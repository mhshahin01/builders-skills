<!--
CHUNK: 11
TITLE: Summary & UI/UX Expectations
PROJECT: Refunds Portal
VERSION: 1.3
DEPENDS_ON: 01, 10
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. UI/UX expectations describe what users experience, not how it is implemented. Technical implementation expectations are owned by the SDD.
-->

# Summary

Customers request and follow refunds online. Branch managers decide in one place. Approved refunds are paid to the original card, and customers are told about every step.

---

# UI/UX Expectations

- **Primary Color**: #1F6FEB (blue).
- **Data Tables**: Lists can be sorted and show 20 rows per page by default. Report formats are set in [09](./09-reporting-and-analytics.md).
- **Filtration**: No filters in this release, because the lists are short: one customer's own requests, and the Submitted requests of a branch manager's own branch and of any branch they cover (volumes in [02 / Facts](./02-glossary-assumptions-facts.md#facts)).
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: The product must be usable on desktop, tablet and mobile screen sizes as a minimum.
- **Language & Locale**: The portal is in English. Amounts are in euro and always show the code EUR. Dates and numbers use the format of the branch's country.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
