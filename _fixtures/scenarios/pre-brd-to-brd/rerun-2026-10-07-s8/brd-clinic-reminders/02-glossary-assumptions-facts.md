<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges & Dependencies
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
-->

# Glossary

| Term | Definition |
|------|-----------|
| Appointment | A booked visit of one patient with one doctor of the clinic, at a set date and time. |
| Attended | Appointment status: the patient came to the visit. Reception sets it. |
| Baseline | A clinic's own no-show rate over the four weeks before go-live. Business Objective 1 is measured against it. |
| Booked | Appointment status: the appointment is entered and the patient has not answered yet. |
| BRD | Business Requirements Document: this document. It states what the product must do. |
| Cancelled | Appointment status: the patient or the receptionist cancelled the visit. |
| Clinic | A private clinic with 1 to 5 doctors in dentistry, dermatology, or pediatrics, in Cairo or Giza. The clinic is the customer of Clinic Reminders. |
| Clinic account | The clinic's space in Clinic Reminders, with one owner login and receptionist logins. |
| Clinic Owner | The doctor who owns the clinic and buys the service (persona, chunk 04). |
| Confirm-or-cancel link | The short link in the fallback SMS. It opens a page where the patient confirms or cancels. |
| Confirmed | Appointment status: the patient confirmed that they will come. |
| Consent record | The record of one patient's consent to messages: when and how consent was given, who recorded it, where the written proof is, the guardian if any, and any opt-out ([03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules)). |
| Controller | Under the PDPL, the party that decides why and how personal data is used. |
| Dashboard | The screens that the Clinic Owner and the receptionists use to work with Clinic Reminders. |
| Data protection officer (DPO) | The person registered with the PDPC who oversees personal-data protection. |
| Day view | The dashboard list of one day's appointments with their status and reply status (UC-10). |
| Delivered | WhatsApp or the SMS aggregator reports that the message reached the patient's phone. |
| EGP | Egyptian pound. |
| Go-live | The day Clinic Reminders starts sending messages to the patients of the pilot clinics. |
| Greater Cairo | Cairo and Giza governorates. |
| Guardian | The parent or legal guardian of a patient under 15. The guardian gives consent and receives the messages. |
| Late cancellation | A cancellation that arrives close to the visit time. **[NEEDS CLARIFICATION: How close to the visit does a cancellation count as late?]** |
| Message allowance | The number of reminders a monthly subscription includes. |
| Meta | The company that runs WhatsApp and the WhatsApp Business Platform. |
| MoSCoW | A priority method: Must have, Should have, Could have, Won't have (now). |
| MVP | Minimum viable product: the Must-have scope, live by 2027-01-31. |
| NFR | Non-functional requirement: a quality the business expects, such as availability (chunk 10). |
| No-show | Appointment status: the patient did not come and did not cancel. Reception sets it. |
| No-show rate | The no-show measure of the weekly report and of Business Objective 1, by the formula in [03 / Measures](./03-definitions-and-domain-concepts.md#measures). |
| NTRA | National Telecom Regulatory Authority of Egypt. It licenses SMS sending and data hosting in Egypt. |
| OKR, KR | Objectives and key results, a goal method used in the pre-BRD. A KR is one key result. |
| Opt-out | A patient's request to stop messages, given by replying STOP or its Arabic equivalent, or to reception at the desk or by phone. Which messages it stops is set in [03 / Consent rules](./03-definitions-and-domain-concepts.md#consent-rules), rule 6. |
| PDPC | Personal Data Protection Center, the regulator under the PDPL. |
| PDPL | Personal Data Protection Law, Law 151/2020. |
| Pilot | The trial with 15 clinics in Cairo and Giza (04 / Release phases). |
| Processor | Under the PDPL, the party that handles personal data for a controller. |
| Reminder | The message sent to a patient before the visit, asking them to confirm or cancel. |
| Reply status | Whether the patient confirmed, cancelled, or has not replied, or the reminder has not gone yet. |
| SDD | Solution Design Document: the technical design that follows this BRD. |
| Sender name | The registered name that patients see as the sender of an SMS. |
| Slot | The date, time, and doctor of an appointment. |
| SMS | A short text message to a mobile phone. |
| SMS aggregator | A company licensed by the NTRA to send business SMS to all mobile networks. |
| SMS fallback | The SMS sent when the WhatsApp reminder is not delivered. |
| Subscription | The clinic's monthly or annual fee for Clinic Reminders, in EGP. |
| Top-up | Extra reminders bought above the message allowance. |
| Use case (UC) | One goal a persona reaches with Clinic Reminders, written as numbered steps (chunks 06a to 06c). |
| Utility template | A WhatsApp message format that Meta approves for non-promotional messages, such as reminders. |
| Waitlist | The clinic's list of patients who asked for an earlier visit if a slot frees up. |
| Waitlist offer | A WhatsApp message that offers a freed slot to a waitlisted patient. |
| Walk-in | A patient who comes without an appointment. |
| WCAG | Web Content Accessibility Guidelines, the common standard for accessible screens. |
| Weekly no-show report | The weekly summary of no-shows, cancellations, and refilled slots that the owner gets on WhatsApp. |
| WhatsApp Business Platform | Meta's service that lets a business send and receive WhatsApp messages. |

---

# Assumptions / Constraints

1. **Constraint: PDPC licence**; Clinic Reminders must hold a PDPC licence or permit before it handles patient data (PDPL; [pre-BRD 08 PESTLE, Legal (1)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). The roles are Assumption 25. **[NEEDS CLARIFICATION: Which licence does Clinic Reminders need (processor or controller)? How are records counted across clinics, and which fee tier applies? Does each small clinic need its own controller licence? Is the PDPC licensing portal live? Counsel to confirm (pre-BRD 08, Legal (1)).]**
2. **Constraint: Written explicit consent**; Health data is sensitive data. Handling it needs the patient's written explicit consent (PDPL; [pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
3. **Constraint: Guardian consent**; For a patient under 15, a guardian gives the consent ([pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
4. **Constraint: Data protection officer**; A registered DPO must be in place before the first patient message ([pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md); [pre-BRD 02 Product Charter, G4](../../run/pre-brd-clinic-reminders/02-product-charter.md)).
5. **Constraint: Breach notice**; Clinic Reminders must report a personal-data breach to the PDPC within 72 hours ([pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
6. **Constraint: Transfers abroad**; Sending patient data outside Egypt needs a PDPC licence for the transfer ([pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). **[NEEDS CLARIFICATION: Will patient data be kept in Egypt or abroad? Does sending messages through Meta's WhatsApp service count as a transfer abroad that needs its own licence? (pre-BRD 08, Legal (3))]**
7. **Constraint: Activity log retention**; Activity logs are kept for 180 days (Anti-Cybercrime Law 175/2018; [pre-BRD 08 PESTLE, Legal (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
8. **Constraint: Opt-in before messaging**; WhatsApp messages go only to people who opted in (WhatsApp Business Messaging Policy; [pre-BRD 08 PESTLE, Legal (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
9. **Constraint: Every opt-out honoured**; Clinic Reminders honours every opt-out (WhatsApp Business Messaging Policy; [pre-BRD 08 PESTLE, Legal (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
10. **Constraint: No health information in messages**; Messages carry no health information where regulations prohibit it (WhatsApp Business Messaging Policy). Messages carry no diagnosis ([pre-BRD 08 PESTLE, Legal (2) and (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). **[NEEDS CLARIFICATION: Does the PDPC treat appointment or specialty details, such as the clinic's specialty or the doctor's name, as health data? (pre-BRD 08, Legal (2))]**
11. **Constraint: Consent for electronic marketing**; Electronic marketing needs the person's prior consent (PDPL Arts. 17-18; [pre-BRD 08 PESTLE, Legal (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
12. **Constraint: Marketing consent records**; Consent records for electronic marketing are kept for three years (PDPL Arts. 17-18; [pre-BRD 08 PESTLE, Legal (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
13. **Constraint: Code of Medical Ethics**; The Medical Syndicate's Code of Medical Ethics governs patient confidentiality and advertising ([pre-BRD 08 PESTLE, Legal (5)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). **[NEEDS CLARIFICATION: Do the Code of Medical Ethics or Ministry of Health rules restrict a third-party service that messages patients for a private clinic? (pre-BRD 08, Legal (5))]**
14. **Constraint: Licensed SMS sending**; SMS goes only through an NTRA-licensed SMS aggregator (Law 10/2003; [pre-BRD 08 PESTLE, Political (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
15. **Constraint: Licensed hosting in Egypt**; If patient data is kept in Egypt, the provider that keeps it holds an NTRA licence (Law 10/2003; [pre-BRD 08 PESTLE, Political (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
16. **Constraint: SMS sender registration**; The SMS sender name must be registered with the mobile networks before use. Registration takes about three weeks ([pre-BRD 08 PESTLE, Technological (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
17. **Constraint: No replies to SMS**; Egyptian networks do not support two-way business SMS, so a patient cannot reply to the SMS. The SMS carries a confirm-or-cancel link instead ([pre-BRD 08 PESTLE, Technological (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md); [pre-BRD 02 Product Charter, Limitations (1)](../../run/pre-brd-clinic-reminders/02-product-charter.md)).
18. **Constraint: No medicine content in SMS**; The mobile networks bar medicine-related content in SMS ([pre-BRD 08 PESTLE, Technological (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
19. **Constraint: Approved WhatsApp templates**; Messages that Clinic Reminders starts on WhatsApp use templates that Meta has approved ([pre-BRD 02 Product Charter, Limitations (2)](../../run/pre-brd-clinic-reminders/02-product-charter.md)). Meta bills a template that mixes a reminder with promotion as marketing. Reminders, confirmations, and waitlist offers therefore carry no promotion ([pre-BRD 08 PESTLE, Technological (1)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
20. **Constraint: WhatsApp daily limit**; Until Meta verifies the business, WhatsApp messages reach at most 250 unique users a day ([pre-BRD 02 Product Charter, Limitations (2)](../../run/pre-brd-clinic-reminders/02-product-charter.md); [pre-BRD 11 IFAS, S3](../../run/pre-brd-clinic-reminders/11-ifas.md)).
21. **Assumption: Timed slots**; Target clinics book each patient into a timed slot, so a cancelled slot can go to another patient ([pre-BRD 24, A-26](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)). **[NEEDS CLARIFICATION: The problem assumes that each patient holds a timed slot. What share of target clinics book timed slots rather than admitting patients in arrival order, and are arrival-order clinics in the target market? (pre-BRD 24, OI-03)]**
22. **Assumption: Reminder effect holds locally**; The published effect of reminders ([pre-BRD 10 EFAS, O2](../../run/pre-brd-clinic-reminders/10-efas.md)) holds for private clinics in Greater Cairo ([pre-BRD 24, A-25](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)).
23. **Assumption: Comparable baseline**; A baseline recorded in January is comparable with a pilot in February and March ([pre-BRD 24, A-27](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)). **[NEEDS CLARIFICATION: The pilot overlaps Ramadan and has no control group. Should the no-show cut be measured against a random half of each clinic's appointments that get no reminder, instead of against a baseline recorded before go-live? (pre-BRD 24, OI-07)]**
24. **Assumption: Licence lead time**; The PDPC grants a licence within about a month of filing ([pre-BRD 24, A-28](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)) (open question: 02 / Dependencies, PDPC licence).
25. **Assumption: Processor role**; Each clinic is the controller of its patients' data, and Clinic Reminders is its processor ([pre-BRD 24, A-29](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)). The open question is in Constraint 1.
26. **Assumption: Utility templates approved**; Meta approves the reminders, confirmations, and waitlist offers as utility templates ([pre-BRD 24, A-14](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)). It also approves the weekly report template (02 / Constraint 19).
27. **Assumption: WhatsApp reaches most patients**; WhatsApp is the default channel for most patients, and SMS covers the rest ([pre-BRD 24, A-32](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)).
28. **Assumption: Manual entry**; Reception enters or imports appointments by hand. Clinic Reminders has no link to clinic software in this release ([pre-BRD 24, A-33](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md)).

---

# Facts

1. Private visits in Egypt are mostly paid by the patient. A no-show is lost income for the clinic owner ([pre-BRD 08 PESTLE, Economic (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
2. Receptionists today remind patients by phone or from a personal WhatsApp. They keep the waiting list on paper ([pre-BRD 05 Empathy Map, Receptionist](../../run/pre-brd-clinic-reminders/05-empathy-map.md)).
3. Clinic owners overbook to cover no-shows ([pre-BRD 05 Empathy Map, Clinic owner](../../run/pre-brd-clinic-reminders/05-empathy-map.md)).
4. Not every patient can be reached on WhatsApp ([pre-BRD 08 PESTLE, Social (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
5. Arabic is the official language, and not every adult reads well. Short Arabic messages with tap buttons work better than typed replies ([pre-BRD 08 PESTLE, Social (4)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
6. Reminders do not help with walk-in patients ([pre-BRD 02 Product Charter, Limitations (4)](../../run/pre-brd-clinic-reminders/02-product-charter.md)).
7. Meta charges per WhatsApp message in US dollars. From 2026-10-01 it also charges for replies inside a conversation ([pre-BRD 08 PESTLE, Technological (1)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).

---

# Challenges

1. Meta controls the main channel. It sets WhatsApp prices in US dollars, the template categories, and the message limits. It can change them each quarter ([pre-BRD 10 EFAS, T1](../../run/pre-brd-clinic-reminders/10-efas.md); [pre-BRD 11 IFAS, W4](../../run/pre-brd-clinic-reminders/11-ifas.md)).
2. The PDPL licence and the consent rules for health data must be settled before the first patient message. The legal answers are still open (Constraints 1, 6, 10, and 13; [pre-BRD 10 EFAS, T2](../../run/pre-brd-clinic-reminders/10-efas.md)).
3. The no-show report is only as good as reception's attendance marks ([pre-BRD 06 Market Comparison, No-show and cancellation analytics](../../run/pre-brd-clinic-reminders/06-market-comparison.md)).
4. Replies can be hard to match to an appointment. Families share phones, and some patients type free Arabic text instead of tapping a button ([pre-BRD 06 Market Comparison, Two-way confirm or cancel](../../run/pre-brd-clinic-reminders/06-market-comparison.md)).
5. Some patients confirm and still do not come ([pre-BRD 06 Market Comparison, Two-way confirm or cancel](../../run/pre-brd-clinic-reminders/06-market-comparison.md)).
6. A waitlist offer worded as a promotion is billed at Meta's much higher marketing rate ([pre-BRD 11 IFAS, S2](../../run/pre-brd-clinic-reminders/11-ifas.md)).
7. The commercial risks stay in the pre-BRD: willingness to pay, competitors that bundle reminders, no sales capability, a tight budget, and a small market ([pre-BRD 02 Product Charter, Risks](../../run/pre-brd-clinic-reminders/02-product-charter.md)).

| Challenge ID | Source(s) & Evidence |
|-------------|---------------------|
| Challenge 3 | A Vezeeta doctor review (2021-01-05): "you don't expect me to be going to the app on daily basis to click 'no show'" ([pre-BRD 06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md)) |
| Challenge 5 | A Vezeeta doctor review (2026-07-06): patients "would confirm coming and then never show" ([pre-BRD 06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md)) |

---

# Dependencies

| Dependency | Type | Owner | Status | Needed before | Notes |
|-----------|------|-------|--------|---------------|-------|
| Meta business verification, and approval of the reminder, confirmation, waitlist-offer, and weekly-report templates in the utility category | Hard | Founders | Pending | Go-live | Target date 2026-12-15 ([pre-BRD 15 OKRs, O1 KR2](../../run/pre-brd-clinic-reminders/15-okrs.md)). Verification takes from 10 minutes to 14 working days ([pre-BRD 11 IFAS, S3](../../run/pre-brd-clinic-reminders/11-ifas.md)). The sender model is open (open question: [08, WhatsApp Business Platform](./08-integrations.md)). |
| SMS sender name registered on all four mobile networks | Hard | Founders | Pending | Go-live | Target date 2026-12-31 ([pre-BRD 15 OKRs, O1 KR3](../../run/pre-brd-clinic-reminders/15-okrs.md)). The registration rule is Constraint 16. |
| Contract with an NTRA-licensed SMS aggregator | Hard | Founders | Pending | Build of UC-02 and UC-15 | The aggregator is not chosen yet ([08 Integrations](./08-integrations.md)). Source: [pre-BRD 06 Market Comparison, SMS channel](../../run/pre-brd-clinic-reminders/06-market-comparison.md). |
| PDPC licence | Hard | Founders | Pending | Go-live | Filing target 2026-12-31 ([pre-BRD 15 OKRs, O1 KR4](../../run/pre-brd-clinic-reminders/15-okrs.md)). The licence must be held before the first patient message ([pre-BRD 02 Product Charter, G4](../../run/pre-brd-clinic-reminders/02-product-charter.md)). **[NEEDS CLARIFICATION: By when must the PDPC licence be granted, not only filed, so that the pilot can start on time? (pre-BRD 24, OI-05)]** |
| Registered data protection officer (DPO) | Hard | Founders | Pending | Go-live | Target date 2026-12-31 ([pre-BRD 15 OKRs, O1 KR4](../../run/pre-brd-clinic-reminders/15-okrs.md)). The rule is Constraint 4. **[NEEDS CLARIFICATION: Will the DPO be appointed in-house or outsourced? (pre-BRD 11, W2)]** |
| Incorporation in Egypt | Hard | Founders | Pending | Go-live | Needed for Meta business verification and SMS sender registration ([pre-BRD 11 IFAS, S3](../../run/pre-brd-clinic-reminders/11-ifas.md); [pre-BRD 21 Roadmap, Q4-2026](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)). **[NEEDS CLARIFICATION: Is the company incorporated in Egypt, with a commercial register and a tax card? (pre-BRD 11, S3)]** |
| Counsel answers on the PDPL | Hard | Founders, with Egyptian data-protection counsel | Pending | Build of UC-09 | Licence type, consent form, and data location ([pre-BRD 21 Roadmap, Q4-2026](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md); [pre-BRD 22 Scoreboard, condition 5](../../run/pre-brd-clinic-reminders/22-executive-summary-scoreboard.md)). The open questions are in Constraints 1, 6, 10, and 13 and in [03 / Consent and opt-out](./03-definitions-and-domain-concepts.md#consent-and-opt-out). |
| Contract with a local payment gateway | Hard | Founders | Pending | Build of UC-06 | The gateway is not chosen yet ([08 Integrations](./08-integrations.md)). Source: [pre-BRD 21 Roadmap, Q2-2027](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md). |
| No-show baseline in each pilot clinic | Soft | Founders, with the pilot clinics | Pending | Go-live | The baseline that Business Objective 1 is measured against ([01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives); [pre-BRD 15 OKRs, O2 KR2](../../run/pre-brd-clinic-reminders/15-okrs.md)) (open question: 02 / Assumption 23). |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
