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

Clinic Reminders is a WhatsApp-first reminder service for small private clinics in Cairo and Giza. It reminds patients before each visit and lets them confirm or cancel with one tap. It offers cancelled slots to the clinic's waitlist and gives the owner a weekly no-show report. Its value is fewer empty slots without reminder calls, built Arabic-first and around the patient's consent.

---

# UI/UX Expectations

- **Primary Color**: Teal, #0F766E, the brand color confirmed for Clinic Reminders. No UI/UX constitution exists for this project.
- **Data Tables**: Sortable columns, 20 rows per page by default, headers that stay visible while scrolling, and export to CSV and Excel. Bulk actions appear where a list allows them. Each user's column, sort, and page-size choices are remembered.
- **Filtration**: Lists filter by date, doctor, and status, with one action to clear all filters. Each user's last filters are remembered.
- **Forms**: Each field is checked when the user leaves it. An error message says how to fix the field. Required fields are marked the same way on every form.
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Empty States**: Every list or page that has nothing to show says why and what the user can do next. Loading and error states are shown the same way on every screen, and an error offers a way to try again.
- **Destructive Actions**: Cancelling an appointment, removing a login, and similar actions need a second, explicit confirmation that names what will change.
- **Permissions**: A screen a role can never use is hidden from that role. An action that is not possible right now is shown disabled with a short reason.
- **Responsive Design**: The product must be usable on desktop, tablet and mobile screen sizes as a minimum.
- **Language & Locale**: Arabic first. Reception screens are in Arabic and read right to left. Patient messages are in Arabic or English, per the patient's setting. Dates and times show in Cairo local time. Amounts show in EGP with the currency code. Numbers and dates follow the clinic's language setting.
- **Accessibility**: Screens meet WCAG 2.1 level AA: they work with a keyboard, show a visible focus, and keep text contrast at 4.5:1 or more. Meaning is never shown by color alone.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 10-nfrs.md | NEXT: 12-appendix-and-wishlist.md -->
