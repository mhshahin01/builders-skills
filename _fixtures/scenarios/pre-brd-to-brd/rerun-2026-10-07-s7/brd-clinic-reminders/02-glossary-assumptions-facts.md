<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges & Dependencies
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
-->

# Glossary

**Table 3 - Glossary**

| Term | Definition |
|------|-----------|
| Appointment | One patient's booked visit to the clinic at a set date and time. Its statuses are in [chunk 03](./03-definitions-and-domain-concepts.md#appointment-statuses). |
| Approved message template | A fixed WhatsApp message text that Meta approves before the service can send it. Reminders, confirmations, slot offers, and the weekly report use approved templates. |
| Baseline | A clinic's no-show rate, measured over four weeks before the clinic starts using the service (BO-06). |
| Call list | The day view's list of appointments the Receptionist calls (UC-10). |
| Clinic | A private clinic in Cairo or Giza with 1 to 5 doctors that subscribes to the service. |
| Clinic account | The clinic's space in the service: its details, doctors, staff logins, plan, patients, appointments, consent records, and waitlist. |
| Clinic Owner, Receptionist, Patient | The three personas. See [chunk 04](./04-scope-and-personas.md#personas--actors). |
| Cohort retention | The share of clinics that started in the same month and still pay after a given number of months. |
| Confirm or cancel link | A short link in the fallback SMS. It opens a page where the patient confirms or cancels the appointment. |
| Consent record | The record of a patient's (or guardian's) agreement to receive messages, and of any opt-out. See [chunk 03](./03-definitions-and-domain-concepts.md#consent-record). |
| CSV file | A simple spreadsheet file that spreadsheet programs can save. The Receptionist uses it to import appointments. |
| Customer acquisition cost (CAC) | Sales and marketing spend divided by the number of new paying clinics. CAC payback is the number of months of revenue that pays back the CAC. |
| Data protection officer (DPO) | The person registered with the PDPC who oversees how the company protects personal data. |
| Day view | The Receptionist's list of the day's appointments with their statuses (UC-10). |
| EGP | Egyptian pound. |
| Guardian | The parent or legal guardian of a patient under 15. The guardian gives consent and receives the messages for the child. |
| Logo churn | The share of paying clinics that stop paying in a month. |
| Message allowance | The number of WhatsApp reminders a plan includes each month. |
| Meta | The company that runs WhatsApp and its business messaging platform. |
| Monthly recurring revenue (MRR) | The subscription revenue billed each month across all paying clinics. |
| MVP | Minimum viable product: the first release, made of the Must-have items, live by 2027-01-31. |
| No-show | An appointment that was not cancelled, and the patient did not come. |
| No-show rate | The share of appointments that end as no-shows. How the weekly report works out the rate is in [chunk 09](./09-reporting-and-analytics.md#reporting--analytics). |
| NTRA | National Telecom Regulatory Authority, Egypt's telecom regulator. It licenses bulk SMS services and hosting. |
| OKR | Objectives and key results: goals with measurable results. The business objectives in chunk 01 are the key results of the pre-BRD OKRs. |
| Opt-out | A patient's request that stops all messages (UC-17). |
| PDPC | Personal Data Protection Center, the regulator that licenses the processing of personal data. |
| PDPL | Personal Data Protection Law, Law 151 of 2020. |
| Pilot | The trial with 15 clinics from 2027-02-01 to 2027-03-31. |
| Pre-BRD framework names | MoSCoW, RICE, PESTLE, EFAS, IFAS, SWOT, and the other names in pre-BRD citations are the analysis frameworks of the pre-BRD. See the [pre-BRD master](../../run/pre-brd-clinic-reminders/00-pre-brd-master.md). |
| Reminder | The message sent to a patient before an appointment. |
| Seed data room | The set of documents that investors review in a seed funding round. |
| Sender ID | The sender name a patient sees on an SMS. It must be registered with each mobile network. |
| Slot | A time in a doctor's day that a patient can book. |
| Slot offer | A message that offers a freed slot to a patient on the waitlist (UC-16). |
| SMS aggregator | A company licensed by NTRA to send SMS on all Egyptian mobile networks. |
| SMS fallback | Sending the reminder by SMS when the WhatsApp reminder is not delivered. |
| SOM | Serviceable obtainable market: the part of the market the business can realistically win in its first years. The figure is in pre-BRD 07. |
| Staff activity log | The record of the actions staff take in the clinic account (UC-06). |
| Subscription plan | The Starter or Clinic plan. See [chunk 03](./03-definitions-and-domain-concepts.md#subscription-plans). |
| Top-up | Extra reminders bought above the monthly allowance. |
| Utility category | Meta's class for non-promotional service messages. Meta bills it at a lower rate than marketing messages. |
| WCAG 2.1 AA | Web Content Accessibility Guidelines, version 2.1, level AA: a common standard for screens that people with disabilities can use. |
| Waitlist | The clinic's list of patients who asked for an earlier slot. See [chunk 03](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers). |
| Weekly no-show report | The weekly WhatsApp summary for the Clinic Owner. See [chunk 09](./09-reporting-and-analytics.md#reporting--analytics). |

---

# Assumptions / Constraints

Constraints 3 to 20 are the regulatory and platform rules in [pre-BRD 08 PESTLE](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), one per obligation. Assumptions 24 to 28 come from the [pre-BRD 24 Assumptions Log](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md) and are not yet confirmed.

1. **Service area**; This release serves clinics in Cairo and Giza governorates only ([pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md), Won't have).
2. **No clinic-software link**; Appointment data depends on reception entering or importing it. This release has no link to clinic-management software ([pre-BRD 02 Product Charter](../../run/pre-brd-clinic-reminders/02-product-charter.md), Limitations (3)).
3. **Licensed SMS sending**; SMS goes out only through an SMS aggregator licensed by NTRA (Law 10/2003; pre-BRD 08, Political (4)).
4. **Licensed hosting in Egypt**; If patient data is hosted in Egypt, the host must hold an NTRA licence (Law 10/2003; pre-BRD 08, Political (4)).
5. **PDPC licence**; Clinic Reminders must hold a PDPC licence (3 years) or permit (1 year) before it processes patient data. It must hold it before the first patient message (PDPL; pre-BRD 08, Legal (1); pre-BRD 02, G4). **[NEEDS CLARIFICATION: pre-BRD 08 Legal (1): Egyptian counsel to confirm the licence type (processor or controller), how records are counted across clinics, the fee tier, whether each small clinic needs its own controller licence, and whether the PDPC licensing portal is live.]** **[NEEDS CLARIFICATION: pre-BRD 24 OI-05 is open: should the target be a granted licence by 2027-01-15 rather than a filed application, and does each clinic need its own licence?]**
6. **Written explicit consent**; Health data is sensitive data. Processing it needs the patient's written explicit consent (PDPL; pre-BRD 08, Legal (2)). **[NEEDS CLARIFICATION: pre-BRD 08 Legal (2): does a WhatsApp opt-in count as the written explicit consent the PDPL requires? How does a patient who books by phone give it?]**
7. **Guardian consent**; A patient under 15 needs a guardian's consent (PDPL; pre-BRD 08, Legal (2)).
8. **Data protection officer**; Clinic Reminders must register a data protection officer (DPO) (PDPL; pre-BRD 08, Legal (2)). **[NEEDS CLARIFICATION: pre-BRD 11 IFAS W2: will the DPO be appointed in-house or outsourced?]**
9. **Breach notice**; A personal data breach is reported to the PDPC within 72 hours (PDPL; pre-BRD 08, Legal (2)). **[NEEDS CLARIFICATION: proposed: Clinic Reminders reports the breach and tells the Clinic Owner of each affected clinic; counsel to confirm who notifies the PDPC and the patients when Clinic Reminders is the processor (assumption 27), and how fast each clinic must be told; confirm or replace]**
10. **Transfers abroad**; Moving patient data out of Egypt needs a PDPC licence for the transfer (PDPL; pre-BRD 08, Legal (2)). **[NEEDS CLARIFICATION: pre-BRD 08 Legal (3): will patient data be hosted in Egypt or abroad, and does routing messages through Meta's platform count as a transfer abroad that needs its own licence?]**
11. **Log retention**; The service keeps its logs for 180 days (Anti-Cybercrime Law 175/2018; pre-BRD 08, Legal (2)). **[NEEDS CLARIFICATION: which records count as logs under the law (message records, staff sign-ins, the staff activity log), and is 180 days a minimum or a fixed period?]**
12. **Opt-in only**; WhatsApp messages go only to people who opted in (WhatsApp Business Messaging Policy; pre-BRD 08, Legal (4)).
13. **Honour every opt-out**; Every opt-out is honoured (WhatsApp Business Messaging Policy; pre-BRD 08, Legal (4)).
14. **No health information in messages**; Messages carry no health information where the rules forbid it. No message text names a diagnosis (WhatsApp Business Messaging Policy and PDPL; pre-BRD 08, Legal (2) and (4)). **[NEEDS CLARIFICATION: pre-BRD 08 Legal (2): does the PDPC treat the appointment itself or the clinic's specialty as health data?]**
15. **Marketing consent and consent records**; Electronic marketing needs prior consent. Consent records are kept for at least three years (PDPL Articles 17 and 18; pre-BRD 08, Legal (4)). **[NEEDS CLARIFICATION: proposed: the three years run from the last message sent under the consent, or from the opt-out if that is later; counsel to confirm]** **[NEEDS CLARIFICATION: pre-BRD 08 Legal (2): do waitlist slot offers count as electronic marketing that needs its own licence?]**
16. **Medical ethics**; The Medical Syndicate's Code of Medical Ethics governs confidentiality and advertising (pre-BRD 08, Legal (5)). **[NEEDS CLARIFICATION: pre-BRD 08 Legal (5): do the Code of Medical Ethics or Ministry of Health rules restrict a third-party service from messaging patients on a private clinic's behalf?]**
17. **Utility templates without promotion**; WhatsApp messages to patients use templates that Meta approves. Meta bills a template that mixes service and promotion as marketing. So reminder, confirmation, and slot-offer templates carry no promotion. Each slot offer answers the patient's own waitlist request (Meta template rules; pre-BRD 08, Technological (1)).
18. **Registered SMS sender name**; The SMS sender ID must be registered with each of the four mobile networks before use. Registration takes about three weeks (pre-BRD 08, Technological (2); [pre-BRD 09](../../run/pre-brd-clinic-reminders/09-porters-five-forces.md), Suppliers).
19. **No replies to SMS**; Two-way SMS and local long or short codes are not supported in Egypt. Patients cannot reply to an SMS (pre-BRD 08, Technological (2); pre-BRD 02, Limitations (1)).
20. **No medicine content in SMS**; Mobile operators bar medicine-related content in SMS (pre-BRD 08, Technological (2)).
21. **New WhatsApp sender limit**; A new business portfolio can message at most 250 unique users a day until Meta verifies it ([pre-BRD 02](../../run/pre-brd-clinic-reminders/02-product-charter.md), Limitations (2); [pre-BRD 11 IFAS](../../run/pre-brd-clinic-reminders/11-ifas.md), S3). **[NEEDS CLARIFICATION: pre-BRD 24 OI-15 is open: do the clinic's messages go from the clinic's own WhatsApp number or from one shared Clinic Reminders number? This decides set-up, the sender name patients see, and whether the 250-user limit binds.]**
22. **Walk-ins**; Walk-in patients are out of scope: see [04 Out of Scope](./04-scope-and-personas.md#out-of-scope).
23. **Prices in EGP**; Clinics pay in EGP (pre-BRD 01 Concept Sheet, Business Model).
24. **Timed slots (assumption)**; The target clinics book each patient into a timed slot (pre-BRD 24, A-26). **[NEEDS CLARIFICATION: pre-BRD 24 OI-03 is open: do the target clinics book each patient into a timed slot, or admit patients in arrival order within a session? In arrival order, a no-show frees no slot to refill.]**
25. **WhatsApp reach (assumption)**; Most patients use WhatsApp, so WhatsApp is the first channel and SMS the fallback (pre-BRD 24, A-32). **[NEEDS CLARIFICATION: pre-BRD 10 EFAS O3: what share of Egyptian internet users used WhatsApp monthly in 2025-2026?]**
26. **Utility category (assumption)**; Meta approves reminders, confirmations, and slot offers in the utility category (pre-BRD 24, A-14).
27. **Processor role (assumption)**; Clinic Reminders processes patient data for each clinic. Each clinic is the controller of its patients' data (pre-BRD 24, A-29; pre-BRD 08, Legal (1)).
28. **Message volume (assumption)**; A Starter clinic sends about 600 reminders a month (pre-BRD 24, A-15). **[NEEDS CLARIFICATION: pre-BRD 03 Cost Structure: what are the average monthly appointments per target clinic, and what share of patients will need the SMS fallback?]**
29. **Patient requests**; **[NEEDS CLARIFICATION: which requests about their data (for example to see, correct, or delete it) does the PDPL give patients, and what must Clinic Reminders do for the clinic, within what time?]**

---

# Facts

1. Universal Health Insurance does not cover Cairo and Giza yet and has no announced date. Private visits in the launch area stay patient-paid, so no insurer link is needed ([pre-BRD 08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Political (2)).
2. Most health spending in Egypt is paid out of pocket. A no-show is lost cash for the clinic owner (pre-BRD 08, Economic (4)).
3. Arabic is Egypt's official language (pre-BRD 08, Social (4)).
4. Meta bills WhatsApp messages in US dollars, while clinics pay in EGP (pre-BRD 08, Economic (2)).

---

# Challenges

1. **Willingness to pay**; Clinics may not pay for a standalone reminder service. Booking platforms and clinic software already bundle reminders ([pre-BRD 10 EFAS](../../run/pre-brd-clinic-reminders/10-efas.md), T3 and T4; [pre-BRD 02](../../run/pre-brd-clinic-reminders/02-product-charter.md), Risks).
2. **Meta price and policy changes**; Meta sets WhatsApp prices in US dollars and can change them every quarter. From 2026-10-01 it also charges for replies inside the service window (pre-BRD 10, T1; [pre-BRD 11 IFAS](../../run/pre-brd-clinic-reminders/11-ifas.md), W4). **[NEEDS CLARIFICATION: pre-BRD 24 OI-09 is open: the cost side leaves out charged replies, slot offers, and hosting; should the top-up price be set on the reply-inclusive cost?]**
3. **Exchange rate**; The pound moves against the dollar. Message and hosting costs change while plan prices stay fixed in EGP ([pre-BRD 08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Economic (2)).
4. **Data protection**; Licensing and consent for sensitive health data must be in place before the first patient message (pre-BRD 10, T2; pre-BRD 11, W2).
5. **No sales capability**; The founding team has no sales staff or clinic relationships yet (pre-BRD 11, W1).
6. **Tight budget**; The year-one budget fits only at median developer pay (pre-BRD 11, W3).
7. **Small market**; The obtainable market is small ([pre-BRD 07 Market Sizing](../../run/pre-brd-clinic-reminders/07-market-sizing-analysis.md), SOM).

---

# Dependencies

**Table 4 - Dependencies**

| Dependency | Type | Owner | Status | Needed before | Notes |
|-----------|------|-------|--------|---------------|-------|
| Company incorporated in Egypt | Hard | Founders | Pending | Go-live | Needed for Meta business verification and SMS sender ID registration ([pre-BRD 21](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md), Q4-2026). **[NEEDS CLARIFICATION: pre-BRD 11 IFAS S3: is the company incorporated in Egypt (commercial register and tax card), so it can complete Meta business verification and SMS sender ID registration before the pilot?]** |
| Meta business verification and approved templates | Hard | Founders | Pending | Go-live | Target 2026-12-15 (BO-02). Needed to send any WhatsApp message. Templates needed before go-live: the reminder, the confirmation, and the slot offer, each in Arabic and English, and the weekly report. **[NEEDS CLARIFICATION: in which Meta category is the weekly report template approved, and does the receptionist invitation (UC-02) go by WhatsApp, which would need its own template?]** **[NEEDS CLARIFICATION: pre-BRD 24 OI-15 is open: do the clinic's messages go from the clinic's own WhatsApp number or from one shared Clinic Reminders number? This decides set-up, the sender name patients see, and whether the 250-user limit binds.]** |
| SMS aggregator contract and sender ID on all four networks | Hard | Founders | Pending | Go-live | Target 2026-12-31 (BO-03). Registration takes about three weeks (constraint 18). Needed for UC-15. |
| PDPC licence and registered DPO | Hard | Founders | Pending | Go-live | Before the first patient message (constraint 5). **[NEEDS CLARIFICATION: pre-BRD 24 OI-05 is open: should the target be a granted licence by 2027-01-15 rather than a filed application, and does each clinic need its own licence?]** |
| Counsel opinion on the PDPL questions | Hard | Founders, with Egyptian data-protection counsel | Pending | Go-live | Answers the open points of constraints 5, 6, 9, 10, 11, 14, 15, 16, and 29, and the under-15 proposal in chunk 03 Consent record. |
| Hosting location decision | Hard | Founders | Pending | Go-live | Decides constraints 4 and 10. |
| Payment gateway contract | Hard | Founders | Pending | Build of UC-05 | Billing starts with the paid launch in Q2-2027 ([pre-BRD 21](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md), Q2-2027). |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
