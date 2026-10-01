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

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Availability | Reminders go out every day, and patient replies are never lost. Receptionists can open the day's list whenever the clinic is open. | **[NEEDS CLARIFICATION: How much disruption per month is tolerable to the business, and may a reminder ever be late or missed?]** |
| NFR-02 | Scalability | The service grows from the pilot to the year-one paying base with no slower experience for clinics or patients. | 15 clinics in the pilot (BO-05) and 40 paying clinics by 2027-09-30 (BO-10). **[NEEDS CLARIFICATION: What are the average monthly appointments per target clinic and the share of patients who will need SMS fallback?]** |
| NFR-03 | Timeliness | Reminders go out at the reminder time. A patient's reply shows on the day's list straight away. | **[NEEDS CLARIFICATION: How many minutes after the reminder time may a reminder go out, and how soon must a reply show on the day's list?]** |
| NFR-04 | Reach | Reminders reach patients by WhatsApp or by SMS. | The delivery target in BO-08 (chunk 01). |
| NFR-05 | Security & Privacy | Only the clinic's own staff see its patients, each with the access the matrix gives. No message carries a diagnosis or a medicine. Sensitive health data is handled only under a PDPC licence (chunk 02, Constraint 6). | Access outside the Users & Use Cases Matrix (chunk 07) is impossible. No clinic sees another clinic's patients. Zero messages contain a diagnosis or a medicine. **[NEEDS CLARIFICATION: Will patient data be kept in Egypt or abroad, and does sending messages through WhatsApp (Meta) count as a transfer abroad that needs its own licence?]** |
| NFR-06 | Data retention | Records are kept as long as the law requires. | Consent and opt-out records: at least three years (PDPL Articles 17 and 18). Records of activity: at least 180 days (Anti-Cybercrime Law 175 of 2018). **[NEEDS CLARIFICATION: How long are patient and appointment records kept after the visit, and after a clinic ends its subscription?]** |
| NFR-07 | Consent | No patient gets a message without consent, and every opt-out is honoured. | Zero messages to a patient with no consent record or after an opt-out (UC-09, UC-16). |
| NFR-08 | Breach response | A data breach is reported to the regulator in time. | The PDPC is told within 72 hours of a breach (chunk 02, Constraint 6). |
| NFR-09 | Usability & Language | Patients and receptionists use the product in their own language. | Message templates in Arabic and English. Reception screens in Arabic, reading right to left (chunk 11). **[NEEDS CLARIFICATION: What measure shows that a receptionist can use the screens without training?]** |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->
