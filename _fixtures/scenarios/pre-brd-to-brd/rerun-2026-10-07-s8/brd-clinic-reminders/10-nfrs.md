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
| NFR-01 | Reliability of reminders | Every reminder reaches the patient on WhatsApp, or by SMS when WhatsApp does not deliver it. A patient never gets the same reminder twice. | The delivery rate in Business Objective 2 ([01](./01-executive-summary-and-context.md#business-objectives)). |
| NFR-02 | Timeliness | Reminders go out at their set time before the visit. The SMS follows a set wait after a WhatsApp reminder that was not delivered. | The reminder time and the SMS wait in [03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules). |
| NFR-03 | Availability | Reminders and waitlist offers go out at their set times on every day of the week. Reception can use the dashboard during clinic hours. | **[NEEDS CLARIFICATION: How much disruption per month can the business accept, for reminder sending and for the dashboard?]** |
| NFR-04 | Capacity | Clinic Reminders serves the clinics planned for the first year without delayed reminders. | 40 paying clinics by 2027-09-30 ([pre-BRD 15 OKRs, O3 KR1](../../run/pre-brd-clinic-reminders/15-okrs.md)). **[NEEDS CLARIFICATION: How many appointments does a target clinic have each month, and what share of patients will need the SMS fallback? (pre-BRD 03, Cost Structure)]** WhatsApp's daily limit before verification also applies (02 / Constraint 20). |
| NFR-05 | Security and access | Each user sees only their own clinic's data, and only what their role allows. | No user can see another clinic's patients or appointments. Each role can do only what the [Users & Use Cases Matrix](./07-users-use-cases-matrix.md) allows. |
| NFR-06 | Privacy of messages | Messages reveal nothing about a patient's health. | No message holds a diagnosis, health information, or medicine-related content (02 / Constraints 10 and 18). |
| NFR-07 | Breach response | A personal-data breach is reported to the regulator in time. Every clinic whose patients are affected is told. | The PDPC deadline in 02 / Constraint 5. **[NEEDS CLARIFICATION: By when must Clinic Reminders tell an affected clinic, and must the clinic or Clinic Reminders tell the affected patients? Counsel to confirm under the PDPL.]** |
| NFR-08 | Data location | Patient data stays where the law allows. | If kept in Egypt, only with an NTRA-licensed provider (02 / Constraint 15). If sent abroad, only under a PDPC transfer licence (02 / Constraint 6, with its open question). |
| NFR-09 | Data retention | Records are kept for the periods the law sets. | Activity logs: the period in 02 / Constraint 7. Marketing consent records: the period in 02 / Constraint 12. **[NEEDS CLARIFICATION: How long are patient details, appointments, replies, and reminder consent records kept, and what happens to a clinic's data when the clinic leaves the service?]** |
| NFR-10 | Ease of answering | A patient answers a reminder in one step, without a call. | WhatsApp: one tap on Confirm or Cancel. SMS: open the link, then one tap ([pre-BRD 01 Concept Sheet, Unique Value Proposition](../../run/pre-brd-clinic-reminders/01-concept-sheet.md); 02 / Fact 5). |
| NFR-11 | Ease of use for reception | Reception spends phone time only on the patients on the call list. | Reminder calls go only to the call list (UC-10). The time saved is Business Objective 6 ([01](./01-executive-summary-and-context.md#business-objectives)). |
| NFR-12 | Safe answers | Every patient answer counts: a Confirm, a Cancel, an Accept, a link-page answer, or an opt-out. An answer that arrives during a disruption is applied when the service is back, in the order the patient gave it. | No answer is lost. No message goes after an opt-out (02 / Constraint 9). **[NEEDS CLARIFICATION: How long after a disruption may an answer wait before it is applied?]** |
| NFR-13 | Safe answer links | Only the person who got a link can use it. A link opens only its own appointment and shows only the reminder content. Nobody can work out another patient's link from their own. A link takes no answer after the visit time (UC-15, E2). | No link can change another patient's appointment or consent. |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->
