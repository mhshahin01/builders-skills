<!--
CHUNK: 12
TITLE: Appendix & Wishlist
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Appendix

**Table 14 - Source files**

| File Description | File (Attached) |
|-----------------|-----------------|
| Pre-BRD master index (the source of this BRD) | [00-pre-brd-master.md](../../run/pre-brd-clinic-reminders/00-pre-brd-master.md) |
| Concept Sheet: idea, problem, solution, audience, features | [01-concept-sheet.md](../../run/pre-brd-clinic-reminders/01-concept-sheet.md) |
| Product Charter: goals, scope, limitations, risks | [02-product-charter.md](../../run/pre-brd-clinic-reminders/02-product-charter.md) |
| Lean Canvas: problems, revenue streams, cost structure | [03-lean-canvas.md](../../run/pre-brd-clinic-reminders/03-lean-canvas.md) |
| Value Proposition Canvas and Empathy Map: the three personas | [04-value-proposition-canvas.md](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [05-empathy-map.md](../../run/pre-brd-clinic-reminders/05-empathy-map.md) |
| PESTLE: the regulatory and platform rules behind the constraints | [08-pestle-analysis.md](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md) |
| MoSCoW: the scope decision | [14-moscow-method.md](../../run/pre-brd-clinic-reminders/14-moscow-method.md) |
| OKRs: the business objectives | [15-okrs.md](../../run/pre-brd-clinic-reminders/15-okrs.md) |
| Roadmap, pricing, and go-to-market | [21-roadmap-project-plan.md](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md) |
| Open Items and Assumptions Log of the pre-BRD | [24-open-items-and-assumptions-log.md](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md) |

## Technical Inputs for the SDD

**Table 15 - Technical Inputs for the SDD**

| Source Statement (verbatim) | Source Location | Relevant To |
|-----------------------------|-----------------|-------------|
| "WhatsApp Business Platform through a direct Cloud API integration (utility templates, quick-reply buttons, status webhooks); an NTRA-licensed Egyptian SMS aggregator with a registered sender ID; a web dashboard and backend on the team's default stack (Angular with PrimeNG, Java 21 with Spring Boot, PostgreSQL), final choices in the SDD; hosting in Egypt or abroad pending the PDPL decision ([08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Legal); a local payment gateway for EGP billing." **[NEEDS CLARIFICATION: pre-BRD 24 OI-15 is open: do the clinic's messages go from the clinic's own WhatsApp number or from one shared Clinic Reminders number? This decides set-up, the sender name patients see, and whether the 250-user limit binds.]** | [pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Technology / Tools Used | SDD technology stack, WhatsApp and SMS integrations, hosting |
| "the health exchange uses HL7 and FHIR ([Legal 500 TMT, 2025](https://www.legal500.com/guides/wp-content/uploads/sites/1/2025/08/Egypt-TMT.pdf)). Implication: policy favours paperless clinics; keep the appointment model FHIR-friendly." | [pre-BRD 08 PESTLE](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Political (1) | SDD appointment data model |
| "Implication: build reminders and confirmations as utility templates with quick-reply buttons; keep waitlist offers non-promotional and tied to the patient's own waitlist request." | pre-BRD 08 PESTLE, Technological (1) | SDD WhatsApp template design (business rule: constraint 17 in chunk 02) |
| "Arabic SMS uses UCS-2 at 70 characters a segment ([Twilio](https://www.twilio.com/docs/glossary/what-is-ucs-2-character-encoding))." | pre-BRD 08 PESTLE, Technological (2) | SDD SMS message design and cost |
| "No AWS, Azure, or Google Cloud region in Egypt; nearest are Bahrain, the UAE, and Qatar ([AWS](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html); [Azure](https://learn.microsoft.com/en-us/azure/reliability/regions-list); [Google Cloud](https://cloud.google.com/about/locations)); Huawei Cloud runs a Cairo region since May 2024 ([Huawei, 2024](https://www.huawei.com/en/news/2024/5/huawei-cloud-goes-live-in-egypt)); WhatsApp Cloud API local storage is not offered for Egypt ([Meta, Local storage](https://developers.facebook.com/docs/whatsapp/cloud-api/overview/local-storage)). Implication: the hosting choice decides the cross-border licensing in Legal." | pre-BRD 08 PESTLE, Technological (4) | SDD hosting and data residency (constraints 4 and 10 in chunk 02) |
| "a tech provider can onboard 10 businesses per rolling 7 days, 200 after verification ([Meta, Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup/)), and a new portfolio starts at 250 unique users a day ([Meta, Messaging limits](https://developers.facebook.com/docs/whatsapp/messaging-limits/))" | [pre-BRD 09 Porter's Five Forces](../../run/pre-brd-clinic-reminders/09-porters-five-forces.md), Threat of New Entrants | SDD WhatsApp onboarding and sender model |
| Automatic SMS fallback: "WhatsApp sent, wait for delivered status or failure, send SMS, log the channel, prevent duplicates"; dependencies "WhatsApp webhooks, SMS gateway, idempotency keys" | [pre-BRD 06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md), section 3, Automatic SMS fallback row | SDD reminder and fallback design |
| Waitlist auto-fill: "Cancel reply frees the slot, waitlist ranked, offers sent with an expiry, first accept claims the slot atomically, others told it is filled"; technical risk "High: race conditions, offer expiry, template category of proactive offers" | pre-BRD 06 Market Comparison, section 3, Waitlist auto-fill row | SDD waitlist offer design |
| Two-way confirm or cancel: "Reminder with quick-reply buttons, inbound webhook, reply matched to the appointment, status set, reception notified"; technical risk "Medium: shared family phones, free-text Arabic replies, idempotent webhooks" | pre-BRD 06 Market Comparison, section 2, Two-way confirm or cancel row | SDD reply handling |
| Arabic: "Arabic templates approved; RTL UI"; dependencies "i18n framework; Arabic copywriting" | pre-BRD 06 Market Comparison, section 2, Arabic-language messages and UI row | SDD localisation |
| "Illustrative minimal hosting (2 x [DigitalOcean Basic Droplet at USD 24/month](https://www.digitalocean.com/pricing/droplets) + [Managed PostgreSQL 2 GiB at USD 30.45/month](https://www.digitalocean.com/pricing/managed-databases)) = USD 941.40 a year = EGP 49,009, 2.5% of the budget" | [pre-BRD 11 IFAS](../../run/pre-brd-clinic-reminders/11-ifas.md), S4 | SDD hosting cost |

---

# Wishlist

*Next features (after future enhancements section of each use case)*

These are the Could-have items of [pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md) and [pre-BRD 13 RICE](../../run/pre-brd-clinic-reminders/13-rice-framework.md). Pre-BRD 21 plans items 1 and 2 after the seed round (Q4-2027).

1. Reschedule by reply.
2. An online booking link the clinic can share, so patients book without calling.
3. Calendar export.
4. No-show breakdown by doctor, weekday, and specialty. **[NEEDS CLARIFICATION: pre-BRD 21 lists per-doctor reports in the Clinic plan, but pre-BRD 14 puts the no-show breakdown by doctor in Could have. Are per-doctor reports in this release?]**
5. An English dashboard.
6. A no-show risk flag with an extra reminder.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 11-summary-and-uiux.md | NEXT: 13-open-items-and-clarifications.md -->
