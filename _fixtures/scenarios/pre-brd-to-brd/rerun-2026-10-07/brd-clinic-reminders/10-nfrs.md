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
| NFR-01 | Reminder reach | Reach patients through the stated reminder channels | Pilot target BO-08 in [01](./01-executive-summary-and-context.md); **[NEEDS CLARIFICATION: Founders to define the delivery denominator, observation window and evidence for the pre-BRD 15 reminder-delivery target.]** |
| NFR-02 | Privacy | Consent and opt-out govern patient messages | UC-04 and UC-11; counsel must settle the applicability questions in 02. |
| NFR-03 | Confidentiality | Keep diagnoses out of message text and respect clinic access boundaries | Source constraint in 02 and pending permissions in 03 and 07. |
| NFR-04 | Availability and timeliness | The reminder service supports booked visits | **[NEEDS CLARIFICATION: Founders and clinic owners to set tolerable disruption, reminder lateness and recovery expectations; pre-BRD 15 calls the MVP reliable but supplies no business limit.]** |
| NFR-05 | Staff accountability | Keep an audit log of staff actions in the Should scope | **[NEEDS CLARIFICATION: Founders and counsel to define auditable actions, who can inspect them and required audit evidence; pre-BRD 14 states the log only.]** |
| NFR-06 | Data lifecycle | Meet the saved source retention and breach obligations | Source values and open legal treatment in 02; **[NEEDS CLARIFICATION: Egyptian counsel and DPO to confirm retention, deletion, export and breach-notice treatment for appointments, consent and staff logs; pre-BRD 08 Legal.]** |
| NFR-07 | Usability and language | Reception uses an Arabic interface; patient templates are Arabic or English | See 11; **[NEEDS CLARIFICATION: Founders and clinic owners to set task success and accessibility measures; pre-BRD 01, 04 and 14 provide no acceptance threshold.]** |
| NFR-08 | Capacity | Support the source clinic segment and pilot scope | **[NEEDS CLARIFICATION: Founders to provide appointments per clinic, peak message volume and SMS fallback share; pre-BRD 03 Cost Structure leaves volume open.]** |

## Upstream questions

- **[NEEDS CLARIFICATION: Egyptian counsel and founders to settle licence grant timing and per-clinic licensing; pre-BRD 24 OI-05 remains Open.]** Source: [pre-BRD OI-05](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-05-the-pdpc-licence-gates-the-pilot-with-about-a-month-of-slack-and-per-clinic-licensing-is-unresolved).


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->
