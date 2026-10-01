<!--
CHUNK: 09
TITLE: Reporting & Analytics
PROJECT: Clinic Reminders
VERSION: 1.1
DEPENDS_ON: 05
PART OF: BRD - Clinic Reminders
LANGUAGE: Business language only. Describe what each report shows and who reads it - not where the data is stored or how it is produced.
-->

# Reporting / Analytics

| Report / View | What It Shows | Audience | Frequency | Format |
|---------------|---------------|----------|-----------|--------|
| Weekly no-show report (UC-03) | Is the clinic losing fewer visits? Every measure in chunk 03, Weekly no-show report measures | Clinic Owner | Weekly | WhatsApp message in Arabic; the same report in the dashboard (MVP scope of the dashboard view is open in UC-03) |
| Day's list (UC-12) | Who is coming today? Each appointment with its status (UC-12, Business Rules) | Receptionist; Clinic Owner (chunk 07, footnote ³) | Real-time | Table with filters |
| Message status per appointment (UC-12, paid launch) | Did the reminder reach the patient? Each message sent and its outcome, as listed in UC-12, A3 | Receptionist; Clinic Owner (chunk 07, footnote ³) | Real-time | Table |
| Consent and opt-out log (UC-19) | Can the clinic show it messages lawfully? Each consent and each opt-out, as listed in UC-19, step 2 | Clinic Owner | On demand | Table; export CSV & Excel |
| Staff activity log (UC-05, paid launch) | Who changed what, and when? | Clinic Owner | On demand | Table; export CSV & Excel |
| Pilot and business metrics | Is the product working across clinics? Delivery rate (BO-08), refill share (BO-09), no-show change per clinic (BO-07), owners' read rate (BO-13), and reply rate | Clinic Reminders founding team | Weekly during the pilot | **[NEEDS CLARIFICATION: Who in the Clinic Reminders team views the cross-clinic metrics, and is this a report inside the product or worked out outside it?]** |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 08-integrations.md | NEXT: 10-nfrs.md -->
