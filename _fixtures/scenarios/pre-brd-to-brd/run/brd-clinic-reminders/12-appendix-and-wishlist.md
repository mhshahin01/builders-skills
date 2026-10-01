<!--
CHUNK: 12
TITLE: Appendix & Wishlist
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Appendix

| File Description | File (Attached) |
|-----------------|-----------------|
| Pre-BRD of Clinic Reminders (source of this BRD), master index | [00-pre-brd-master.md](../pre-brd-clinic-reminders/00-pre-brd-master.md) |
| Pre-BRD open items and assumptions log | [24-open-items-and-assumptions-log.md](../pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md) |
| Plans, prices, and reminder allowances (used by UC-06) | [21-roadmap-project-plan.md, Pricing & packaging](../pre-brd-clinic-reminders/21-roadmap-project-plan.md) |

## Technical Inputs for the SDD

| Source Statement (verbatim) | Source Location | Relevant To |
|-----------------------------|-----------------|-------------|
| "WhatsApp Business Platform through a direct Cloud API integration (utility templates, quick-reply buttons, status webhooks); an NTRA-licensed Egyptian SMS aggregator with a registered sender ID; a web dashboard and backend on the team's default stack (Angular with PrimeNG, Java 21 with Spring Boot, PostgreSQL), final choices in the SDD; hosting in Egypt or abroad pending the PDPL decision ([08](../pre-brd-clinic-reminders/08-pestle-analysis.md), Legal); a local payment gateway for EGP billing." | pre-BRD 01 Concept Sheet, Technology / Tools Used | SDD ecosystem overview; integrations (08) |
| "the health exchange uses HL7 and FHIR ([Legal 500 TMT, 2025](https://www.legal500.com/guides/wp-content/uploads/sites/1/2025/08/Egypt-TMT.pdf)). Implication: policy favours paperless clinics; keep the appointment model FHIR-friendly." | pre-BRD 08 PESTLE, Political (1) | SDD data model (chunk 03, Appointment) |
| "Arabic SMS uses UCS-2 at 70 characters a segment" | pre-BRD 08 PESTLE, Technological (2) | SDD SMS integration (UC-14) |
| "No AWS, Azure, or Google Cloud region in Egypt; nearest are Bahrain, the UAE, and Qatar ...; Huawei Cloud runs a Cairo region since May 2024 ...; WhatsApp Cloud API local storage is not offered for Egypt ... Implication: the hosting choice decides the cross-border licensing in Legal." | pre-BRD 08 PESTLE, Technological (4) | SDD hosting; NFR-05 data location |
| "the Anti-Cybercrime Law 175/2018 requires 180-day log retention" | pre-BRD 08 PESTLE, Legal (2) | SDD logging; NFR-06 |
| "Illustrative minimal hosting (2 x DigitalOcean Basic Droplet at USD 24/month + Managed PostgreSQL 2 GiB at USD 30.45/month) = USD 941.40 a year" | pre-BRD 11 IFAS, S4 | SDD hosting cost |
| "WhatsApp-first design, with the in-house skill to integrate Meta's Cloud API directly instead of paying a reseller markup"; "direct integration avoids reseller fees such as Twilio's USD 0.005 per message" | pre-BRD 11 IFAS, S3 | SDD WhatsApp integration (08) |
| "Reminder with quick-reply buttons, inbound webhook, reply matched to the appointment, status set, reception notified"; "Medium: shared family phones, free-text Arabic replies, idempotent webhooks" | pre-BRD 06 Market Comparison, section 2, Two-way confirm or cancel | SDD reply handling (UC-13) |
| "Cancel reply frees the slot, waitlist ranked, offers sent with an expiry, first accept claims the slot atomically, others told it is filled"; "High: race conditions, offer expiry, template category of proactive offers" | pre-BRD 06 Market Comparison, section 3, Waitlist auto-fill | SDD slot offers (UC-15) |
| "WhatsApp sent, wait for delivered status or failure, send SMS, log the channel, prevent duplicates"; "WhatsApp webhooks, SMS gateway, idempotency keys" | pre-BRD 06 Market Comparison, section 3, Automatic SMS fallback | SDD fallback (UC-14) |

---

# Wishlist

*Next features (after future enhancements section of each use case)*

1. Reschedule by reply: the patient picks a new time from the reminder ([pre-BRD 14 MoSCoW, Could](../pre-brd-clinic-reminders/14-moscow-method.md)).
2. Online booking: a booking link the clinic can share, and online self-booking by patients (Could).
3. Calendar export (Could).
4. No-show breakdown by doctor, weekday, and specialty (Could).
5. English dashboard (Could).
6. No-show risk flag: patients with past no-shows, or still unconfirmed 3 hours before the visit, get an extra reminder and join a reception call list (Could; [pre-BRD 06, New features](../pre-brd-clinic-reminders/06-market-comparison.md)).
7. Later phases ([pre-BRD 20 Product Lifecycle](../pre-brd-clinic-reminders/20-product-lifecycle.md), [pre-BRD 21 Roadmap](../pre-brd-clinic-reminders/21-roadmap-project-plan.md)):
   - Links to clinic management software.
   - A cross-clinic no-show dataset.
   - The next governorate after Cairo and Giza.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 11-summary-and-uiux.md | NEXT: 13-open-items-and-clarifications.md -->
