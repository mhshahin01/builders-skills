<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges & Dependencies
PROJECT: Clinic Reminders
VERSION: 1.1
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
-->

# Glossary

| Term | Definition |
|------|-----------|
| Accept link | A short web link in an SMS slot offer. It opens a page where the patient accepts the offered slot (UC-15, E1). |
| Appointment | A booked visit of one patient with one doctor of the clinic at a set date and time. |
| Attended | The appointment status the receptionist sets when the patient came. |
| Baseline | A clinic's no-show rate before it starts using Clinic Reminders, measured over four weeks. |
| Cancelled slot | The date and time freed when a patient cancels or moves an appointment (UC-10, UC-13, UC-14). A slot the clinic frees is not a cancelled slot. |
| Clinic | A private clinic with 1 to 5 doctors that subscribes to Clinic Reminders. It holds one clinic account. |
| Clinic Owner | The doctor who owns the clinic and buys the subscription. Persona (chunk 04). |
| Confirm or cancel link | A short web link in the fallback SMS. It opens a page where the patient confirms or cancels the appointment. |
| Consent record | The record that a patient (or guardian) agreed to receive reminders and slot offers: who agreed, how, when, who recorded it, and which version of the consent wording was used. |
| CSV file | A simple spreadsheet file that the receptionist uses to import many appointments at once. |
| Dashboard | The screens of Clinic Reminders where the owner and the receptionist work. |
| DPO | Data protection officer: the person registered with the PDPC who oversees how patient data is handled. |
| EGP | Egyptian pound. |
| Guardian | The parent or legal guardian who agrees to messages for a child under 15 and answers them. In this BRD a guardian acting for a child is covered by the Patient persona. |
| Late cancellation | A cancellation made shortly before the visit. The cut-off is not yet set (chunk 03). |
| MVP | Minimum viable product: the first release, due by 2027-01-31. |
| No-show | An appointment the patient did not attend and did not cancel. The receptionist marks it. |
| No-show rate | The share of a clinic's due appointments that end as no-shows (formula in chunk 03). |
| NTRA | National Telecom Regulatory Authority of Egypt. It licenses bulk SMS providers. |
| Opt-out | A patient's request to stop all messages from the clinic through Clinic Reminders. It can also be recorded by staff (UC-09, A1). |
| Paid launch | The second release, from 2027-04-01, when clinics start paying. |
| Patient | The person who has the appointment and receives the messages. Persona (chunk 04). |
| PDPC | Personal Data Protection Center: the Egyptian regulator that licenses the handling of personal data. |
| PDPL | Personal Data Protection Law, Law 151 of 2020. |
| Pilot | The test run with 15 clinics from 2027-02-01 to 2027-03-31. |
| Receptionist | The clinic staff member who manages the schedule every day. Persona (chunk 04). |
| Reminder | The message sent to a patient before an appointment, asking them to confirm or cancel. |
| Reminder time | When the reminder is sent: 24 hours before the visit by default. |
| Sender name | The registered name shown as the sender of an SMS. Each mobile network registers it. |
| Service template | A message text that WhatsApp (Meta) approves in advance as a non-promotional service message (WhatsApp calls it a utility template). |
| Slot offer | A message that offers a cancelled slot to a patient on the waitlist. |
| SMS fallback | The SMS sent instead when the WhatsApp reminder is not delivered. |
| Waitlist | The clinic's list of patients who asked for an earlier slot. |
| WCAG | Web Content Accessibility Guidelines: the public standard for screens that people with disabilities can use (chunk 11). |
| Weekly no-show report | The weekly summary of no-shows, cancellations, and refilled slots sent to the owner. |
| WhatsApp sender | The WhatsApp number that a clinic's reminders and slot offers come from (UC-01, step 6). |
| WhatsApp (Meta) | The messaging service used for reminders, replies, slot offers, and the weekly report. Meta owns it. |

---

# Assumptions / Constraints

1. **Timed slots (assumption)**; target clinics book each patient into a timed slot. A no-show then leaves the doctor idle, and a cancelled slot can be refilled. In a clinic that admits patients in arrival order, there is no slot to refill. **[NEEDS CLARIFICATION: What share of 1 to 5 doctor dental, dermatology, and pediatric clinics in Cairo and Giza book timed slots rather than arrival-order sessions? Should a clinic qualify only if it books timed slots (pre-BRD OI-03)?]**
2. **WhatsApp first (assumption)**; most patients use WhatsApp. Patients the WhatsApp reminder does not reach get an SMS ([pre-BRD 10 EFAS, O3](../pre-brd-clinic-reminders/10-efas.md)).
3. **Service templates (assumption)**; WhatsApp (Meta) approves the reminder, confirmation, slot offer, and weekly report messages as service templates. A message judged promotional, including one that mixes service and promotion, is billed at the much higher marketing rate ([pre-BRD 11 IFAS, S2](../pre-brd-clinic-reminders/11-ifas.md)).
4. **Processor role (assumption)**; Clinic Reminders handles patient data on behalf of each clinic. Each clinic decides why the data is used (the controller). Counsel has not confirmed this yet (see Dependencies, PDPC licence).
5. **Manual appointment data (constraint)**; appointments exist only if the receptionist enters or imports them. The MVP has no link to clinic software.
6. **Personal data law (constraint)**; under the PDPL, health data and children's data are sensitive. Handling them needs a PDPC licence, written explicit consent, guardian consent for a child under 15, and a registered DPO. A data breach is reported to the PDPC within 72 hours. Moving data abroad needs its own licence ([pre-BRD 08 PESTLE, Legal](../pre-brd-clinic-reminders/08-pestle-analysis.md)). **[NEEDS CLARIFICATION: Does the PDPC treat appointment or specialty details as health data, does a WhatsApp opt-in count as written consent, and do slot offers count as electronic marketing that needs its own licence?]**
7. **Medical ethics (constraint)**; the Egyptian Medical Syndicate's Code of Medical Ethics governs patient confidentiality and advertising. **[NEEDS CLARIFICATION: Do the Code of Medical Ethics or Ministry of Health rules restrict a third-party service messaging patients on a private clinic's behalf?]**
8. **WhatsApp rules (constraint)**; WhatsApp messages go only to patients who opted in. Every opt-out is honoured. No health information is sent where the rules forbid it.
9. **SMS rules in Egypt (constraint)**; Egypt does not support two-way SMS, so a patient cannot answer an SMS. The fallback SMS carries a confirm or cancel link instead. Mobile operators bar medicine-related content. Only an NTRA-licensed provider may send bulk SMS. Each of the four mobile networks registers the sender name, which takes about three weeks. An Arabic SMS holds 70 characters per part; a longer message is billed as two parts.
10. **WhatsApp sending limit (constraint)**; until WhatsApp (Meta) verifies the business, a new business account can message at most 250 different people a day.
11. **Walk-ins (constraint)**; reminders do not help walk-in patients. The pilot measures the walk-in share separately.
12. **Launch area (constraint)**; the service is sold only to clinics in Cairo and Giza governorates.

---

# Facts

1. Patients pay for most private clinic visits themselves, so an empty slot is lost cash for the owner ([pre-BRD 08 PESTLE, Economic](../pre-brd-clinic-reminders/08-pestle-analysis.md)).
2. Universal Health Insurance does not cover Cairo and Giza yet, and no date is announced. Target clinics stay patient-paid, so no insurer link is needed ([pre-BRD 08 PESTLE, Political](../pre-brd-clinic-reminders/08-pestle-analysis.md)).
3. Most Egyptians are online on mobile, and WhatsApp is one of the most-used platforms. Part of the population is offline, so SMS is needed as a fallback ([pre-BRD 08 PESTLE, Social](../pre-brd-clinic-reminders/08-pestle-analysis.md)).
4. Arabic is the official language. Short Arabic messages with tap buttons work better than typed replies.
5. Meta prices WhatsApp messages in US dollars and can change prices each quarter. From 2026-10-01 Meta also charges for replies ([pre-BRD 10 EFAS, T1](../pre-brd-clinic-reminders/10-efas.md)).
6. Published studies show that text and WhatsApp reminders raise attendance ([pre-BRD 10 EFAS, O2](../pre-brd-clinic-reminders/10-efas.md)).

---

# Challenges

1. **No local baseline.** No one has measured the no-show rate of small private clinics in Greater Cairo ([pre-BRD 10 EFAS, O1](../pre-brd-clinic-reminders/10-efas.md)). The pilot measures it per clinic (BO-06).
2. **Attendance marking.** The no-show report is only right if the receptionist marks attended and no-show every day (CH-01).
3. **Confirmed is not attended.** Some patients confirm and still do not come (CH-02).
4. **Unclear replies.** Patients may type free-text Arabic replies instead of tapping a button, and families often share one phone ([pre-BRD 06 Market Comparison](../pre-brd-clinic-reminders/06-market-comparison.md)).
5. **Consent gaps.** Patient lists that clinics import may have no consent record.
6. **Crowded market.** Booking platforms and clinic software already bundle reminders ([pre-BRD 10 EFAS, T3](../pre-brd-clinic-reminders/10-efas.md)).

| Challenge ID | Source(s) & Evidence |
|-------------|---------------------|
| CH-01 | A doctor's review of the Vezeeta doctor app (2021-01-05) complains about having to open the app every day to mark no-shows ([pre-BRD 06, Schedule and calendar management](../pre-brd-clinic-reminders/06-market-comparison.md)). |
| CH-02 | A doctor's review of the Vezeeta doctor app (2026-07-06) says patients confirm and then never show ([pre-BRD 06, Two-way confirm or cancel](../pre-brd-clinic-reminders/06-market-comparison.md)). |

---

# Dependencies

| Dependency | Type | Owner | Status | Notes |
|-----------|------|-------|--------|-------|
| WhatsApp (Meta) business verification and approved service templates | Hard | Founders | Pending | Due by 2026-12-15 (BO-02). Verification takes from 10 minutes to 14 working days. No WhatsApp reminder can be sent without it. |
| Company incorporated in Egypt | Hard | Founders | Pending | Needed for WhatsApp business verification and SMS sender registration. **[NEEDS CLARIFICATION: Is the company incorporated in Egypt (commercial register and tax card), so it can complete WhatsApp business verification and SMS sender registration before the February 2027 pilot?]** |
| SMS Provider contract and registered sender name | Hard | Founders | Pending | An NTRA-licensed provider. Sender name registered on all four networks by 2026-12-31 (BO-03). |
| PDPC licence and registered DPO | Hard | Founders | Pending | Held before the first patient record is entered or imported (BO-04). **[NEEDS CLARIFICATION: Egyptian counsel to confirm the licence type (processor or controller), how records are counted across clinics, the fee tier, whether each small clinic needs its own controller licence, whether the PDPC licensing portal is live, and whether the licence must be granted, not only filed, by 2027-01-15 (pre-BRD OI-05).]** |
| 15 pilot clinics in Cairo and Giza | Hard | Founders | Pending | Needed for the pilot (BO-05). **[NEEDS CLARIFICATION: Do the founders have clinic relationships in Cairo or Giza (pilot sites or letters of intent) to recruit the 15 pilot clinics?]** |
| Payment Gateway contract | Soft | Founders | Pending | Needed for subscription payments (UC-06) from the paid launch on 2027-04-01. |
| Named product owner | Soft | Founders | Pending | Owns this BRD's decisions, the pilot clinics, and pricing. **[NEEDS CLARIFICATION: Which of the three founders owns product management (roadmap, pilot clinics, pricing, and clinic discovery) and approves this BRD?]** |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
