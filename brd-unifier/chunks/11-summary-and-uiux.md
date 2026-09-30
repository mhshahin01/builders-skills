<!--
CHUNK: 11
TITLE: Summary & UI/UX Expectations
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01, 10
PART OF: BRD - [Project Name]
LANGUAGE: Business language only. UI/UX expectations describe what users experience, not how it is implemented. Technical implementation expectations are owned by the SDD.
-->

# Summary

<!-- 1-2 paragraphs summarizing what the system is and the core problem it solves. Acts as a quick refresher. -->

[System Name] is [short summary restating the purpose and key value proposition].

---

# UI/UX Expectations

<!-- Global UI/UX standards that apply across all pages, from the user's point of view. -->

- **Primary Color**: [With a UI/UX constitution: its color token by name, e.g., `color.primary`, and the constitution section that defines it, by name, not number. Without one: the brand or key color the user confirms (asked once). Never an invented value.]
- **Data Tables**: [Sorting, pagination: default 20 rows/page, export (csv & excel), filtering standards]
- **Filtration**: [Standardized filter patterns]
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: The product must be usable on desktop, tablet and mobile screen sizes as a minimum. [With a UI/UX constitution only, add: "It follows the breakpoints and behaviour in the [section name] section of the global UI/UX constitution." Without one, the first sentence stands alone.]
- **Language & Locale**: [Supported languages; date/number/currency formats per audience. Add right-to-left support only when a right-to-left language such as Arabic is in scope; omit it for English-only products.]
- [Other global UX rules]

<!-- MASTER: [project-slug]-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
