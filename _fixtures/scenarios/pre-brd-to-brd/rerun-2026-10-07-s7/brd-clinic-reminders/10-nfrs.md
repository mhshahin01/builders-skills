<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
LANGUAGE: Business language only. State WHAT quality the business expects (highly available, scalable, fast, secure) and how the business would recognise it. HOW it is achieved (architecture, clustering, replication, technology) is owned by the SDD.
-->

# Non-Functional Requirements

**Table 13 - Non-Functional Requirements**

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Reminder reliability | Reminders reach patients by WhatsApp or by SMS, at the rate BO-08 sets. | The share of reminders delivered meets BO-08 ([chunk 01](./01-executive-summary-and-context.md#business-objectives)). |
| NFR-02 | Availability | Reminders go out at their set time, and reception can use the day view during clinic hours. | **[NEEDS CLARIFICATION: how late can a reminder go out, and how long per month can the reception screens be unavailable, before a clinic is harmed?]** |
| NFR-03 | Capacity | The service handles the pilot and the year-one base with no slowdown: 15 pilot clinics (BO-05) and 40 paying clinics (BO-10). The new-sender limit in [constraint 21](./02-glossary-assumptions-facts.md#assumptions--constraints) applies. | **[NEEDS CLARIFICATION: pre-BRD 03 Cost Structure: what are the average monthly appointments per target clinic, and what share of patients will need the SMS fallback?]** |
| NFR-04 | Security and privacy | Only the staff of the patient's own clinic see the patient's data. Messages carry no health detail. A personal data breach is reported to the PDPC within 72 hours (constraint 9). | No one can do a use case the [Users & Use Cases Matrix](./07-users-use-cases-matrix.md) marks "-" for them; no message contains a diagnosis (constraint 14); a breach is reported within 72 hours (constraint 9). Where patient data may be hosted follows constraints 4 and 10. |
| NFR-05 | Data retention | Records are kept for as long as the rules require. | Consent records are kept for at least three years; when the period starts is open in constraint 15. The service keeps its logs for 180 days; which records count as logs is open in constraint 11. **[NEEDS CLARIFICATION: how long are appointments, patient details, and the staff activity log kept, and what happens to a clinic's data when the clinic stops paying?]** |
| NFR-06 | Ease of use | Patients answer with a tap, not by typing, and reception works in Arabic ([pre-BRD 08 PESTLE](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Social (4)). | A patient confirms or cancels with one tap on WhatsApp, or one tap on the SMS link page (UC-14, UC-15). The reception screens are in Arabic ([chunk 11](./11-summary-and-uiux.md#uiux-expectations)). |
| NFR-07 | Timeliness | A patient's answer shows in the day view, and a freed slot goes to the waitlist, within a set number of minutes. | **[NEEDS CLARIFICATION: within how many minutes of the patient's answer or the cancellation?]** |
| NFR-08 | Data safety | After a failure, a clinic loses at most a short stretch of recent work. Older records, such as consent records, are never lost. | **[NEEDS CLARIFICATION: how many minutes of recent work can a clinic afford to enter again after a failure?]** |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->
