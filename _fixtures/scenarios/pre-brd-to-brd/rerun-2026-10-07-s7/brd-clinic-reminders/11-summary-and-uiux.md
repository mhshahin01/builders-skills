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

Clinic Reminders is a monthly subscription that helps small private clinics in Cairo and Giza keep their schedules full. It reminds patients on WhatsApp, or by SMS with a link when WhatsApp is not delivered. Patients confirm or cancel with one tap. Freed slots go to the clinic's waitlist, and the owner gets a weekly no-show report.

---

# UI/UX Expectations

The project has no UI/UX constitution file, so this chunk is the visual baseline.

- **Primary Color**: **[NEEDS CLARIFICATION: what is the brand or key color of Clinic Reminders? The pre-BRD does not name one, and the product owner has not set it.]**
- **Data Tables**: **[NEEDS CLARIFICATION: proposed (from the author's global UX defaults, not a project source): tables can be sorted by each column, keep the header row visible while scrolling, can be exported to CSV and Excel, and remember each user's table settings; confirm or replace]**
- **Filtration**: The day view filters by status, including the call list, and by doctor once per-doctor calendars are live (UC-10). The staff activity log filters by staff member and by date (UC-06).
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: **[NEEDS CLARIFICATION: proposed: the reception screens work in a web browser at the reception desk and on a phone, because owners check the day's list on a phone between patients ([pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md), Clinic owner, Does); the SMS link page works on a phone; confirm the screen sizes to support]**
- **Language & Locale**: The reception screens are in Arabic, laid out right to left. The product is built Arabic-first ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Unique Value Proposition). An English dashboard is a Could-have item in the [Wishlist](./12-appendix-and-wishlist.md#wishlist). Patient messages are in Arabic or English (UC-07). Prices show in EGP. **[NEEDS CLARIFICATION: proposed: dates and times show in Egypt local time, in the format of the screen's language; confirm or replace]**
- **Other global rules**: **[NEEDS CLARIFICATION: proposed (from the author's global UX defaults, not a project source): screens meet WCAG 2.1 level AA (keyboard use, visible focus, 4.5:1 text contrast); cancelling an appointment or removing a login needs an explicit second step; every screen has clear loading, empty, and error states; forms check each field when the user leaves it and say how to fix an error; confirm or replace]**

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
