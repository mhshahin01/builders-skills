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
|------|------------|
| Clinic Owner | Doctor-owner who buys the service and reads the weekly report. |
| Receptionist | Clinic staff member who maintains appointments and the waiting list. |
| Patient | Message recipient; a guardian acts for a pediatric patient. |
| No-show | An appointment the patient does not attend. The counting boundary needs confirmation in 09. |
| Waitlist | Patients who asked for an earlier slot at the clinic. |
| Reminder | A message before a booked visit. |
| Opt-out | A patient's request to stop messages. |
| SMS | Short text message sent to a phone; its response uses a link in this product. |
| EGP | Egyptian pound. |
| PDPL | Personal Data Protection Law named in the saved pre-BRD. |
| PDPC | Personal Data Protection Center named in the saved pre-BRD. |
| DPO | Data protection officer. |
| NTRA | National Telecom Regulatory Authority named in the saved pre-BRD. |
| MVP | First release containing the Must scope. |
| OKR | Objective and key result in the pre-BRD; each key result maps to 01. |
| RICE | Source prioritisation by reach, impact, confidence and effort; scores stay upstream. |
| MoSCoW | Must, Should, Could and Won't priority groups. |
| ARPU | Average revenue per user, here per clinic; the planning input remains disputed. |
| CAC | Customer acquisition cost; a business measure, not a new report requirement. |

# Assumptions / Constraints

1. **Launch footprint:** the source scope is private clinics with 1 to 5 doctors in Cairo and Giza. Specialties and actor needs come from [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 03](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md) and [pre-BRD 05](../../run/pre-brd-clinic-reminders/05-empathy-map.md).
2. **Appointment entry:** reception enters or imports appointments. The MVP does not integrate with clinic-management software ([pre-BRD 02](../../run/pre-brd-clinic-reminders/02-product-charter.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md)).
3. **Consent and legal treatment:** [pre-BRD 08 Legal](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md) states explicit written consent, guardian consent under 15, a registered DPO and a licence before patient messaging. It also states breach notice within 72 hours, 180-day log retention, and three-year consent records for electronic marketing. These are saved source statements awaiting counsel's applicability decisions; no legal research was rerun. **[NEEDS CLARIFICATION: Egyptian counsel to confirm licence type, clinic licensing, record counting, fee tier, portal status, written consent, health-data classification, waitlist marketing treatment, residency, cross-border treatment and medical-ethics restrictions; pre-BRD 08 Legal.]**
4. **Message content:** messages contain no diagnoses; consent and opt-out apply to patient messaging. Source: [pre-BRD 08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md). Required behaviour is in [UC-04](./06b-use-cases-receptionist.md#uc-04-record-patient-consent) and [UC-11](./06c-use-cases-patient.md#uc-11-stop-patient-messages).
5. **Unvalidated assumptions:** the assumptions in [pre-BRD 24 Assumptions Log](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#assumptions-log) have bases and risks, but no validation record. None is promoted to a confirmed BRD fact. Timed-slot admission, pilot comparability, waitlist demand, incorporation and legal lead times remain open at the affected requirement homes.

# Facts

The source describes calls, paper records and personal messaging as the current workflow ([pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)). Its research and figures remain in [pre-BRD 06](../../run/pre-brd-clinic-reminders/06-market-comparison.md), [pre-BRD 07](../../run/pre-brd-clinic-reminders/07-market-sizing-analysis.md), [pre-BRD 08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), [pre-BRD 09](../../run/pre-brd-clinic-reminders/09-porters-five-forces.md), [pre-BRD 10](../../run/pre-brd-clinic-reminders/10-efas.md), [pre-BRD 11](../../run/pre-brd-clinic-reminders/11-ifas.md) and [pre-BRD 12](../../run/pre-brd-clinic-reminders/12-swot.md). Local observations and customer interviews are not supplied.

# Challenges

| Challenge | Source evidence | Requirement consequence |
|-----------|-----------------|-------------------------|
| Demand and local no-show effect are unproven | [pre-BRD 10](../../run/pre-brd-clinic-reminders/10-efas.md); [pre-BRD 24](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md) | Pilot measures and waitlist suitability need owners. |
| Consent and licensing are unresolved | [pre-BRD 08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md); [pre-BRD 11](../../run/pre-brd-clinic-reminders/11-ifas.md) | Messaging cannot claim legal readiness. |
| Suppliers, costs and paid demand can change | [pre-BRD 09](../../run/pre-brd-clinic-reminders/09-porters-five-forces.md); [pre-BRD 10](../../run/pre-brd-clinic-reminders/10-efas.md); [pre-BRD 12](../../run/pre-brd-clinic-reminders/12-swot.md) | Sender choice and subscription treatment stay open. |
| Reception must keep appointment records current | [pre-BRD 02](../../run/pre-brd-clinic-reminders/02-product-charter.md); [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md) | Report definitions and attendance input need confirmation. |

**[NEEDS CLARIFICATION: Founders to appoint the product manager and DPO and confirm their responsibilities; pre-BRD 02 and 11 leave those appointments open.]**

# Dependencies

| Dependency | Type | Owner | Status | Needed before | Notes |
|------------|------|-------|--------|---------------|-------|
| Legal treatment, licence and DPO | Hard | Founders and Egyptian counsel; DPO appointment unresolved | Pending | First patient message | Source 02 G4; 08 Legal; 24 OI-05. |
| Meta verification and approved templates | Hard | Founders; Meta | Pending | Reminder, reply and waitlist use | Source 15 O1 KR2. **[NEEDS CLARIFICATION: Founders to confirm incorporation and the sender model; pre-BRD 11 S3 and 24 OI-15.]** |
| SMS partner and registered sender | Hard | Founders; NTRA-licensed SMS aggregator not selected | Pending | SMS fallback | Source 15 O1 KR3. **[NEEDS CLARIFICATION: Founders to identify the contracted SMS aggregator and confirm registration evidence; pre-BRD 01 and 15.]** |
| Local payment gateway | Hard for paid-launch billing | Founders; provider not named | Pending | UC-03 at Q2-2027 paid launch | **[NEEDS CLARIFICATION: Founders to name the payment provider and contractual payment outcomes; pre-BRD 21 Q2-2027.]** |
| Pilot clinics and baseline records | Hard for pilot validation | Founders; clinic owners | Pending | Pilot measurement | **[NEEDS CLARIFICATION: Founders to identify participating clinics and approved baseline collection treatment; pre-BRD 11 W1 and 24 OI-07.]** |
| Unstated delivery milestones | Hard to finalise dependencies | Founders | Pending | BRD completion | **[NEEDS CLARIFICATION: Founders to classify each dependency milestone as Build of the affected UC, BAT sign-off or go-live; the source states operating prerequisites without this delivery distinction.]** |

## Upstream questions

- **[NEEDS CLARIFICATION: Founders to reconcile the No-Go and full-build plan; pre-BRD 24 OI-01 remains Open.]** Source: [pre-BRD OI-01](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-01-a-robust-no-go-sits-on-top-of-a-plan-that-starts-the-full-build-on-2026-10-01).
- **[NEEDS CLARIFICATION: Founders and clinic owners to validate timed-slot admission and waitlist suitability; pre-BRD 24 OI-03 remains Open.]** Source: [pre-BRD OI-03](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-03-the-problem-and-the-waitlist-assume-timed-slots-but-many-target-clinics-may-admit-patients-in-arrival-order).
- **[NEEDS CLARIFICATION: Egyptian counsel and founders to settle licence grant timing and per-clinic licensing; pre-BRD 24 OI-05 remains Open.]** Source: [pre-BRD OI-05](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-05-the-pdpc-licence-gates-the-pilot-with-about-a-month-of-slack-and-per-clinic-licensing-is-unresolved).
- **[NEEDS CLARIFICATION: Founders to confirm funding, founder pay and the budget basis before commitment; pre-BRD 24 OI-06 remains Open.]** Source: [pre-BRD OI-06](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-06-the-year-one-budget-has-no-line-items-no-runway-buffer-and-an-unconfirmed-funding-source).
- **[NEEDS CLARIFICATION: Founders and pilot clinic owners to settle pilot design, baseline comparability and consent for data collection; pre-BRD 24 OI-07 remains Open.]** Source: [pre-BRD OI-07](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-07-the-pilots-before-after-design-overlaps-ramadan-and-has-no-control-group).
- **[NEEDS CLARIFICATION: Founders to validate messaging cost, pricing and payback assumptions before subscription rules are final; pre-BRD 24 OI-09 remains Open.]** Source: [pre-BRD OI-09](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-09-gross-margin-and-churn-behind-ltvcac-are-assumptions-and-the-cost-side-omits-charged-replies-offers-and-hosting).
- **[NEEDS CLARIFICATION: Founders to confirm the price and tier mix behind BO-11; its planning revenue is not validated; pre-BRD 24 OI-10 remains Open.]** Source: [pre-BRD OI-10](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-10-the-planning-arpu-is-a-competitor-anchor-and-the-tier-mix-that-matches-it-has-no-basis).
- **[NEEDS CLARIFICATION: Founders to decide the WhatsApp sender identity, onboarding and billing model; pre-BRD 24 OI-15 remains Open.]** Source: [pre-BRD OI-15](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-15-the-whatsapp-sender-model-is-undecided-but-drives-cost-limits-billing-and-trust).
- **[NEEDS CLARIFICATION: Founders to reconcile the source SMS charging conflict; linked figure and citation corrections remain upstream; pre-BRD 24 OI-16 remains Open.]** Source: [pre-BRD OI-16](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-16-minor-figure-and-citation-inconsistencies).


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->
