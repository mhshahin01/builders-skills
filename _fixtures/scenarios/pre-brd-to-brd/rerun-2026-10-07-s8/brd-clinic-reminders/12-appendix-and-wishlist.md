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
| Pre-BRD master index: the source of this BRD (generated 2026-09-30) | [00-pre-brd-master.md](../../run/pre-brd-clinic-reminders/00-pre-brd-master.md) |
| Pre-BRD priorities: MoSCoW, the basis of the scope | [14-moscow-method.md](../../run/pre-brd-clinic-reminders/14-moscow-method.md) |
| Pre-BRD regulatory scan: the basis of the constraints | [08-pestle-analysis.md](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md) |
| Pre-BRD roadmap, pricing, and go-to-market | [21-roadmap-project-plan.md](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md) |
| Pre-BRD open items and assumptions log | [24-open-items-and-assumptions-log.md](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md) |

## Technical Inputs for the SDD

| Source Statement (verbatim) | Source Location | Relevant To |
|-----------------------------|-----------------|-------------|
| "WhatsApp Business Platform through a direct Cloud API integration (utility templates, quick-reply buttons, status webhooks); an NTRA-licensed Egyptian SMS aggregator with a registered sender ID; a web dashboard and backend on the team's default stack (Angular with PrimeNG, Java 21 with Spring Boot, PostgreSQL), final choices in the SDD; hosting in Egypt or abroad pending the PDPL decision ([08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Legal); a local payment gateway for EGP billing." | pre-BRD 01 Concept Sheet, Technology / Tools Used | SDD ecosystem, integrations, and hosting |
| "the health exchange uses HL7 and FHIR ([Legal 500 TMT, 2025](https://www.legal500.com/guides/wp-content/uploads/sites/1/2025/08/Egypt-TMT.pdf)). Implication: policy favours paperless clinics; keep the appointment model FHIR-friendly." | pre-BRD 08 PESTLE, Political (1) | SDD data model |
| "Implication: build reminders and confirmations as utility templates with quick-reply buttons; keep waitlist offers non-promotional and tied to the patient's own waitlist request." | pre-BRD 08 PESTLE, Technological (1) | SDD messaging design |
| "SMS in Egypt: alphanumeric sender IDs need about three weeks of pre-registration, two-way SMS and local long or short codes are not supported, and operators bar medicine-related content ([Twilio, Egypt SMS guidelines](https://www.twilio.com/en-us/guidelines/eg/sms); [Telnyx](https://support.telnyx.com/en/articles/6670411-egypt-sms-guidelines)); Arabic SMS uses UCS-2 at 70 characters a segment ([Twilio](https://www.twilio.com/docs/glossary/what-is-ucs-2-character-encoding)). Implication: one-reply confirm or cancel cannot work over SMS, so the fallback SMS carries a short confirm or cancel link; start registration in Q4-2026." | pre-BRD 08 PESTLE, Technological (2) | SDD SMS design |
| "No AWS, Azure, or Google Cloud region in Egypt; nearest are Bahrain, the UAE, and Qatar ([AWS](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html); [Azure](https://learn.microsoft.com/en-us/azure/reliability/regions-list); [Google Cloud](https://cloud.google.com/about/locations)); Huawei Cloud runs a Cairo region since May 2024 ([Huawei, 2024](https://www.huawei.com/en/news/2024/5/huawei-cloud-goes-live-in-egypt)); WhatsApp Cloud API local storage is not offered for Egypt ([Meta, Local storage](https://developers.facebook.com/docs/whatsapp/cloud-api/overview/local-storage)). Implication: the hosting choice decides the cross-border licensing in Legal." | pre-BRD 08 PESTLE, Technological (4) | SDD hosting and data location |
| "a tech provider can onboard 10 businesses per rolling 7 days, 200 after verification ([Meta, Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup/)), and a new portfolio starts at 250 unique users a day ([Meta, Messaging limits](https://developers.facebook.com/docs/whatsapp/messaging-limits/))" | pre-BRD 09 Porter's Five Forces, Threat of New Entrants | SDD WhatsApp onboarding and sender model |
| "WhatsApp-first design, with the in-house skill to integrate Meta's Cloud API directly instead of paying a reseller markup" | pre-BRD 11 IFAS, S3 | SDD integrations |
| "Illustrative minimal hosting (2 x [DigitalOcean Basic Droplet at USD 24/month](https://www.digitalocean.com/pricing/droplets) + [Managed PostgreSQL 2 GiB at USD 30.45/month](https://www.digitalocean.com/pricing/managed-databases)) = USD 941.40 a year = EGP 49,009, 2.5% of the budget; [Huawei Cloud has run a Cairo region since May 2024](https://www.huawei.com/en/news/2024/5/huawei-cloud-goes-live-in-egypt) for in-country hosting." | pre-BRD 11 IFAS, S4 | SDD hosting |
| Automated appointment reminders. Workflow: "Appointment saved, reminder queued, sent by WhatsApp or SMS, delivery logged". Technical risk: "Medium: scheduling accuracy, template approval, delivery failures". Dependencies: "Appointment data, job scheduler, WhatsApp and SMS channels". | pre-BRD 06 Market Comparison, section 2 | SDD reminder scheduling |
| WhatsApp channel. Workflow: "Approved template, send through the Cloud API, status webhooks". Technical risk: "Medium-High: business verification, template category, number quality, Meta price changes". Dependencies: "Meta business verification; sender-number decision". | pre-BRD 06 Market Comparison, section 2 | SDD messaging design |
| SMS channel. Workflow: "Send under a registered sender name, delivery-report callback, log". Technical risk: "Medium: sender-ID approval; Arabic SMS uses shorter segments". Dependencies: "SMS aggregator contract and sender ID". | pre-BRD 06 Market Comparison, section 2 | SDD SMS design |
| Two-way confirm or cancel by one reply. Workflow: "Reminder with quick-reply buttons, inbound webhook, reply matched to the appointment, status set, reception notified". Technical risk: "Medium: shared family phones, free-text Arabic replies, idempotent webhooks". Dependencies: "WhatsApp interactive templates, inbound webhooks, schedule". | pre-BRD 06 Market Comparison, section 2 | SDD reply handling |
| Schedule and calendar management. Workflow: "Reception adds or imports appointments; statuses drive reminders and reports". Technical risk: "Medium: receptionists used to paper or Excel". Dependencies: "Optional CSV import". | pre-BRD 06 Market Comparison, section 2 | SDD appointment import (UC-08 file format) |
| Arabic-language messages and UI. Workflow: "Arabic templates approved; RTL UI". Technical risk: "Low-Medium: template wording approval, RTL layout". Dependencies: "i18n framework; Arabic copywriting". | pre-BRD 06 Market Comparison, section 2 | SDD language support |
| Waitlist auto-fill of cancelled slots. Workflow: "Cancel reply frees the slot, waitlist ranked, offers sent with an expiry, first accept claims the slot atomically, others told it is filled". Technical risk: "High: race conditions, offer expiry, template category of proactive offers". Dependencies: "Two-way reply, schedule, waitlist capture". | pre-BRD 06 Market Comparison, section 3 | SDD waitlist offers |
| No-show and cancellation analytics. Workflow: "Attendance captured, aggregated, shown in a dashboard". Technical risk: "Medium: depends on reception marking attendance". Dependencies: "Schedule statuses; reporting store". | pre-BRD 06 Market Comparison, section 3 | SDD reporting |
| Automatic SMS fallback when WhatsApp is not delivered. Workflow: "WhatsApp sent, wait for delivered status or failure, send SMS, log the channel, prevent duplicates". Technical risk: "Medium: webhook latency, duplicate sends, double cost". Dependencies: "WhatsApp webhooks, SMS gateway, idempotency keys". | pre-BRD 06 Market Comparison, section 3 | SDD SMS fallback |
| Multi-doctor and multi-branch support. Workflow: "Owner adds doctors; per-doctor schedules and reports". Technical risk: "Low". Dependencies: "Clinic and doctor data model". | pre-BRD 06 Market Comparison, section 3 | SDD data model |
| Weekly owner no-show digest pushed to WhatsApp. Workflow: "Weekly job aggregates analytics, renders the summary, sends an approved template". Technical risk: "Low". Dependencies: "No-show analytics; fee per doctor; owner opt-in". | pre-BRD 06 Market Comparison, section 4 | SDD weekly report |
| Per-patient messaging consent and opt-out ledger. Workflow: "Consent captured at booking or import, opt-out reply blocks sends, audit export". Technical risk: "Medium: needs legal interpretation; legacy lists may lack consent". Dependencies: "Counsel review; inbound reply handling". | pre-BRD 06 Market Comparison, section 4 | SDD consent records |

---

# Wishlist

*Next features (after future enhancements section of each use case)*

These are the Could-have items of [pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md) and [pre-BRD 13 RICE](../../run/pre-brd-clinic-reminders/13-rice-framework.md).

1. Reschedule by reply.
   - Planned for Q4-2027 ([pre-BRD 21 Roadmap](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)).
2. An online booking link that the clinic can share.
   - Planned for Q4-2027 ([pre-BRD 21 Roadmap](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)).
3. Calendar export.
4. A no-show breakdown by doctor, weekday, and specialty.
5. An English dashboard.
6. A no-show risk flag: patients with past no-shows, or still unconfirmed 3 hours before the visit, get an extra reminder and join a reception call list ([pre-BRD 06 Market Comparison, section 4](../../run/pre-brd-clinic-reminders/06-market-comparison.md); [pre-BRD 13 RICE](../../run/pre-brd-clinic-reminders/13-rice-framework.md)).

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 11-summary-and-uiux.md | NEXT: 13-open-items-and-clarifications.md -->
