<!--
PRE-BRD CHUNK: 02
TITLE: Product Charter
TIER: Tier 1: Idea Definition
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# Product Charter

A foundational document that defines the purpose, goals, scope, stakeholders, and boundaries of a product or project. It aligns the team, sponsors, and stakeholders before development begins. It is often used in product management, project kickoffs, or agile initiatives to make sure everyone is on the same page.

| Section | What to capture | Answer |
|---|---|---|
| Product Name | The official name of the product, reflecting its purpose. | Clinic Reminders |
| Product Manager | The person responsible for leading the product's development, roadmap, and execution. | [NEEDS CLARIFICATION: Which of the three founders owns product management (roadmap, pilot clinics, pricing, and clinic discovery)?] |
| Date | Date of the charter (YYYY-MM-DD). | 2026-09-30 |
| Stakeholders | Key internal and external parties involved (sponsor, product manager, engineering lead, UX designer, pilot clients). | Sponsors and builders: the three founding developers. Customers: owners and receptionists of pilot clinics in Cairo and Giza. Message recipients: patients and guardians. Investors: seed-round investors. Suppliers: Meta (WhatsApp Business Platform), an NTRA-licensed SMS aggregator, a cloud host, a payment gateway. Regulators: the Personal Data Protection Center (PDPC) and NTRA. Advisors: Egyptian data-protection counsel and a data protection officer (DPO). |
| Problem Statement | What problem or pain point are we solving? See Concept Sheet, Problem Statement. | See [01-concept-sheet.md](01-concept-sheet.md), Problem Statement. |
| Purpose / Vision | Why this product exists and the long-term goal it supports. | Every booked visit in an Egyptian private clinic is either kept or handed to another patient in time. Long-term goal: become the patient-messaging layer for small clinics, starting in Greater Cairo. |
| Objectives / Goals | What we aim to achieve, stated as SMART goals. | G1: ship the Must-have scope by 2027-01-31. G2: pilot with 15 clinics in Cairo and Giza from 2027-02-01 to 2027-03-31 and measure each clinic's no-show change against its own baseline. G3: reach 40 paying clinics by 2027-09-30 within the EGP 2,000,000 first-year budget. G4: hold the PDPC licence and a registered DPO before the first patient message. Key results in [15-okrs.md](15-okrs.md). |
| Scope (MVP) | What is included in this phase of the product. | The Must-have set in [14-moscow-method.md](14-moscow-method.md): reminders, one-reply confirm or cancel, SMS fallback with a link, waitlist refill, weekly no-show report, and the consent ledger, for clinics in Cairo and Giza. |
| Out of Scope (MVP) | What is excluded in this phase of the product. | The Won't-have set in [14-moscow-method.md](14-moscow-method.md): clinical records, payments and deposits, telemedicine, a patient app, clinic-software integrations, marketing broadcasts, and other governorates. |
| Key Features / Deliverables | Core features or deliverables for this phase. See Concept Sheet, Key Features. | See [01-concept-sheet.md](01-concept-sheet.md), Key Features. |
| Limitations | Known limitations. | (1) Two-way SMS is not supported in Egypt, so SMS patients confirm or cancel through a link ([08-pestle-analysis.md](08-pestle-analysis.md), Technological). (2) WhatsApp needs patient opt-in and approved templates, and a new business portfolio is limited to 250 unique users a day until verified ([11-ifas.md](11-ifas.md), S3). (3) Appointment data depends on reception entering or importing it; there is no clinic-software integration in the MVP. (4) Reminders do not address walk-ins. |
| Risks | Known potential risks. | Low willingness to pay and competitors bundling reminders ([10-efas.md](10-efas.md), T3 and T4); Meta price and policy changes ([10](10-efas.md), T1; [11](11-ifas.md), W4); PDPL licensing and consent ([10](10-efas.md), T2; [11](11-ifas.md), W2); no sales capability ([11](11-ifas.md), W1); a budget that only fits at median pay ([11](11-ifas.md), W3); a small obtainable market ([07-market-sizing-analysis.md](07-market-sizing-analysis.md), SOM). |
| Success Metrics | How success will be measured. See Concept Sheet, Success Metrics. | See [01-concept-sheet.md](01-concept-sheet.md), Success Metrics. |
| Timeline / Milestones | High-level phases or key dates. | 2026-10-01 build starts; 2027-01-31 MVP live; 2027-02-01 to 2027-03-31 pilot; 2027-04-01 paid launch in Cairo and Giza; 2027-09-30 year-one review and seed raise. Quarter plan in [21-roadmap-project-plan.md](21-roadmap-project-plan.md). |
