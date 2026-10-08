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

| Report / View | What It Shows | Audience | Frequency | Format |
|---------------|---------------|----------|-----------|--------|
| Weekly no-show report (UC-03) | How many appointments the clinic lost, kept, and refilled last week. The measures are in [03 / Measures](./03-definitions-and-domain-concepts.md#measures). | Clinic Owner | Weekly | WhatsApp message in Arabic |
| Day view (UC-10, UC-12) | Today's appointments with their reply status: confirmed, cancelled, no reply, or reminder not sent yet, plus the call list. From the Growth phase, also the channel and delivery status of each message. | Receptionist | Live: each reply updates it | Table in the dashboard |
| Consent records (UC-04) | Each patient's consent: when and how it was given, who recorded it, where the written proof is, the guardian, and any opt-out | Clinic Owner | On demand | Table in the dashboard, with an export file |
| Staff action log (Growth) | Which staff member did what, and when ([03 / Staff action log](./03-definitions-and-domain-concepts.md#staff-action-log)) | Clinic Owner | On demand | Table in the dashboard |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 08-integrations.md | NEXT: 10-nfrs.md -->
