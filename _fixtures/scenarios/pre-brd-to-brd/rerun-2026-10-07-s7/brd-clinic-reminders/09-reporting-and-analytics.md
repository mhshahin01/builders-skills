<!--
CHUNK: 09
TITLE: Reporting & Analytics
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 05
PART OF: BRD - Clinic Reminders
LANGUAGE: Business language only. Describe what each report shows and who reads it - not where the data is stored or how it is produced.
-->

# Reporting / Analytics

**Table 12 - Reports and views**

| Report / View | What It Shows | Audience | Frequency | Format |
|---------------|---------------|----------|-----------|--------|
| Weekly no-show report (UC-03) | For the past week: the no-show rate, the share of appointments confirmed, and the number of cancelled slots refilled from the waitlist ([pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), Clinic owner, Gain Creators). **[NEEDS CLARIFICATION: proposed: the no-show rate is no-shows divided by the week's appointments that were not cancelled, and the confirmed share is confirmed appointments divided by appointments that got a reminder; confirm or replace]** **[NEEDS CLARIFICATION: pre-BRD 24 OI-12 is open: the MVP plan assumes the founders code full time; should the team re-estimate at 65% coding time and cut Must (7) to a manual-assist waitlist and Must (8) to a template-only report?]** | Clinic Owner | Weekly | WhatsApp message from an approved template |
| Day view of appointment statuses (UC-10) | Each appointment of the day with its status, and each message sent with its channel and whether it was delivered and answered, and an alert for new patient cancellations, as UC-14 A1 proposes | Receptionist | As answers arrive, within the NFR-07 time | Table on screen |
| Staff activity log (UC-06) | Staff actions in the clinic account: who did what, and when | Clinic Owner | On demand | Table on screen |

The no-show breakdown by doctor, weekday, and specialty is a Could-have item: see the [Wishlist](./12-appendix-and-wishlist.md#wishlist). **[NEEDS CLARIFICATION: pre-BRD 21 lists per-doctor reports in the Clinic plan, but pre-BRD 14 puts the no-show breakdown by doctor in Could have. Are per-doctor reports in this release?]**

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 08-integrations.md | NEXT: 10-nfrs.md -->
