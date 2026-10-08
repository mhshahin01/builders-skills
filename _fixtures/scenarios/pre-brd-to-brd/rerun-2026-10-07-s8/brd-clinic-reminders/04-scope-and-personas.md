<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
-->

# Project Scope

A receptionist enters or imports the clinic's appointments. Before each visit, Clinic Reminders reminds the patient on WhatsApp, or by SMS when WhatsApp does not reach them. The patient confirms or cancels with one tap. Reception sees who confirmed, who cancelled, and who has not replied, and calls only the patients on the call list (UC-10). A cancelled slot is offered to the clinic's waitlist, and the first patient to accept takes it. After each visit, reception marks who came. Each week, the owner gets a no-show report on WhatsApp.

The service is for private clinics with 1 to 5 doctors in dentistry, dermatology, and pediatrics, in Cairo and Giza ([pre-BRD 01 Concept Sheet, Target Audience](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)). Scope follows the MoSCoW priorities: Must and Should items are in scope, and Could and Won't items are not ([pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md)). Each scope item carries its release phase.

## Release phases

| Phase | When | Source |
|-------|------|--------|
| MVP | Build from 2026-10-01; live by 2027-01-31 | [pre-BRD 02 Product Charter, Timeline](../../run/pre-brd-clinic-reminders/02-product-charter.md); [pre-BRD 21 Roadmap, Q4-2026](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md) |
| Pilot | 15 clinics in Cairo and Giza, from 2027-02-01 to 2027-03-31 | [pre-BRD 02 Product Charter, G2](../../run/pre-brd-clinic-reminders/02-product-charter.md); [pre-BRD 21 Roadmap, Q1-2027](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md) |
| Paid launch | Cairo and Giza, from 2027-04-01 (Q2-2027) | [pre-BRD 02 Product Charter, Timeline](../../run/pre-brd-clinic-reminders/02-product-charter.md); [pre-BRD 21 Roadmap, Q2-2027](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md) |
| Growth | From 2027-10, after the seed round | [pre-BRD 20 Product Lifecycle, Growth](../../run/pre-brd-clinic-reminders/20-product-lifecycle.md) |

**[NEEDS CLARIFICATION: Pre-BRD 24 proposes a validation gate from 2026-10-01 to 2026-11-30 before the build, which could move the MVP and pilot dates by up to two months. Which MVP and pilot dates hold? (pre-BRD 24, OI-01)]**

The second reminder, per-doctor calendars, and subscription billing come with the paid launch, as in [pre-BRD 21 Roadmap, Q2-2027](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md). The other Should items come in Growth ([pre-BRD 20 Product Lifecycle, Growth](../../run/pre-brd-clinic-reminders/20-product-lifecycle.md)).

## In Scope

**MVP (Must have):**

- A clinic account with owner and receptionist logins (UC-01, UC-02).
- Appointment entry, and import of appointments from a file (UC-07, UC-08).
- Scheduled WhatsApp reminders from approved Arabic and English templates (UC-14).
- One-reply confirm or cancel that updates the appointment status (UC-14, UC-10).
- An SMS with a confirm-or-cancel link when the WhatsApp reminder is not delivered (UC-15).
- Patient consent, with guardian consent for children, opt-out by reply, and a consent record for each patient (UC-09, UC-17, UC-04).
- A waitlist that offers a cancelled slot to waitlisted patients in order; the first patient to accept takes it (UC-13, UC-16).
- A weekly no-show report to the owner (UC-03).
- Appointment statuses, changes, and attendance marks that feed the reminders and the report (UC-10, UC-11, UC-12; [pre-BRD 13 RICE, Clinic accounts row](../../run/pre-brd-clinic-reminders/13-rice-framework.md)).
- A record of each staff action, and of each message's channel and delivery result, kept from go-live (02 / Constraint 7; Business Objective 2).

**Paid launch (Should have, [pre-BRD 21 Roadmap, Q2-2027](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)):**

- A second reminder on the visit day ([03 / Channel rules](./03-definitions-and-domain-concepts.md#channel-rules)).
- Per-doctor calendars inside one clinic ([03 / Doctors and fees](./03-definitions-and-domain-concepts.md#doctors-and-fees)).
- Subscription billing in EGP through a local payment gateway (UC-06).

**Growth (Should have, [pre-BRD 20 Product Lifecycle, Growth](../../run/pre-brd-clinic-reminders/20-product-lifecycle.md)):**

- Configurable reminder timing (UC-05).
- The day view shows the channel and delivery result of each message (UC-10, A2).
- The Clinic Owner can read the staff action log ([09](./09-reporting-and-analytics.md)).

## Out of Scope

- **Won't have in this release** ([pre-BRD 14 MoSCoW, Won't](../../run/pre-brd-clinic-reminders/14-moscow-method.md)): clinical records; appointment deposits or payments; telemedicine; a patient mobile app; links to clinic-management software; marketing or broadcast campaigns; clinics outside Cairo and Giza.
- **Could have** items go to the [Wishlist](./12-appendix-and-wishlist.md#wishlist) ([pre-BRD 14 MoSCoW, Could](../../run/pre-brd-clinic-reminders/14-moscow-method.md)).
- **Walk-in patients**: reminders do not cover them (02 / Fact 6).
- **Insurer links**: none needed. Greater Cairo private clinics stay patient-paid through the MVP and seed horizon ([pre-BRD 08 PESTLE, Political (2)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)).
- **Trials and referral credits**: the 14-day trial and the referral credit of one free month per referred paying clinic ([pre-BRD 21 Roadmap, Go-To-Market](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md)) are go-to-market offers. Clinic Reminders does not track them in this release. The founders apply them by hand. **[NEEDS CLARIFICATION: How do the founders apply a free month or a trial: by moving the clinic's next due date (UC-06)?]**

---

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Clinic Owner | The doctor who owns a private clinic with 1 to 5 doctors and buys the service ([pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 05](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). | Keep every paid hour of the schedule filled. Know each week how many appointments were lost, and why. Need no extra hire. | Owner login: the clinic account, receptionist logins, reminder settings, the weekly report, the consent export, and the subscription. **[NEEDS CLARIFICATION: proposed: the Clinic Owner can also do every receptionist use case (UC-07 to UC-13); confirm or replace]** |
| Receptionist | The clinic staff member who runs the daily schedule: the daily user ([pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 05](../../run/pre-brd-clinic-reminders/05-empathy-map.md)). | Confirm tomorrow's list, handle cancellations, rebook from the waitlist, and make fewer calls. | Receptionist login: appointments, consent records, the day view, attendance marks, and the waitlist. |
| Patient | A patient of the clinic, or the guardian of a patient under 15. The patient receives the messages ([pre-BRD 01, Target Audience](../../run/pre-brd-clinic-reminders/01-concept-sheet.md); [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). | Remember the visit. Confirm or cancel without a call. Get an earlier slot when one frees up. | No login. The patient acts through WhatsApp replies and the SMS link page. |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
