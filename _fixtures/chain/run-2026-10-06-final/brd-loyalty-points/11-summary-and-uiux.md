<!--
CHUNK: 11
TITLE: Summary & UI/UX Expectations
PROJECT: Loyalty Points
VERSION: 1.3
DEPENDS_ON: 01, 10
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. UI/UX expectations describe what users experience, not how it is implemented. Technical implementation expectations are owned by the SDD.
-->

# Summary

Members see their points balance and every points movement, including points taken back after a refund.

---

# UI/UX Expectations

- **Primary Color**: #1F6FEB (blue).
- **Data Tables**: The points history (UC-02) shows 20 movements per page by default and has no export in this release (export is a future enhancement of UC-02). The Monthly corrections report (chunk 09) has its own format.
- **Filtration**: The points history has no filters in this release.
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: The product must be usable on desktop, tablet and mobile screen sizes as a minimum.
- **Language & Locale**: English only. Dates show as DD/MM/YYYY. Amounts show in EUR with two decimals, for example 12.80 EUR.
- **Points display**: Negative movements show a minus sign.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
