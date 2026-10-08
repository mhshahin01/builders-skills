<!--
CHUNK: 11
TITLE: Summary & UI/UX Expectations
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01, 10
PART OF: BRD - Clinic Reminders
LANGUAGE: Business language only. UI/UX expectations describe what users experience, not how it is implemented. Technical implementation expectations are owned by the SDD.
-->

# Summary

Clinic Reminders helps small private clinics in Cairo and Giza keep their schedules full without reminder calls. Patients answer a reminder with one tap, freed slots go to the waitlist, and the owner sees the result each week ([01 / Executive Summary](./01-executive-summary-and-context.md#executive-summary)).

---

# UI/UX Expectations

- **Primary Color**: #0E7C86 (test-fixture value; owner: product manager).
- **Data Tables**: **[NEEDS CLARIFICATION: proposed (from the user's global defaults, not a project source): the day view, the waitlist, and the consent records can be sorted and are split into pages, keep their headings in view while scrolling, and remember each user's sort and page size; confirm or replace]**
- **Filtration**: Each use case defines its own filters. In the day view: the call list (UC-10, steps 3 and 4) and, from the paid launch, one doctor (UC-10, A3).
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: **[NEEDS CLARIFICATION: Which screen sizes must the dashboard support? The source names a web dashboard ([pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)), and owners check the day's list on a phone ([pre-BRD 05](../../run/pre-brd-clinic-reminders/05-empathy-map.md)), but no screen size is set.]**
- **Language & Locale**: The dashboard is in Arabic, right to left ([pre-BRD 01 Concept Sheet, Unique Value Proposition](../../run/pre-brd-clinic-reminders/01-concept-sheet.md); [pre-BRD 06 Market Comparison, Arabic-language messages and UI](../../run/pre-brd-clinic-reminders/06-market-comparison.md)). An English dashboard is on the [Wishlist](./12-appendix-and-wishlist.md#wishlist). Patient messages go in Arabic or English ([03 / Message content](./03-definitions-and-domain-concepts.md#message-content)). Money shows in EGP. **[NEEDS CLARIFICATION: Which date, time, and number formats do the dashboard and the messages use, for example Arabic-Indic or Western digits?]**
- **Accessibility**: **[NEEDS CLARIFICATION: proposed (from the user's global defaults, not a project source): the dashboard meets WCAG 2.1 AA, works with a keyboard alone, shows a visible focus, and keeps text contrast at 4.5:1 or more; confirm or replace]**

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
