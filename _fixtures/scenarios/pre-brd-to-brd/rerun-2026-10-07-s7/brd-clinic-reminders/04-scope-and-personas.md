<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
-->

# Project Scope

A small clinic in Cairo or Giza subscribes and sets up its account. The Receptionist adds or imports appointments and records each patient's consent. Before each visit, the patient gets a WhatsApp reminder, or an SMS with a link when WhatsApp is not delivered. The patient confirms or cancels with one tap. A cancellation frees the slot, and the system offers it to patients on the clinic's waitlist. Each week, the Clinic Owner gets a no-show report on WhatsApp.

The release serves private clinics with 1 to 5 doctors in dentistry, dermatology, and pediatrics in Cairo and Giza governorates ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), Target Audience). The scope follows [pre-BRD 14 MoSCoW](../../run/pre-brd-clinic-reminders/14-moscow-method.md): Must and Should items are in scope; Could and Won't items are not. Each item carries its phase from [pre-BRD 21 Roadmap](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md): MVP means built from Q4-2026 and live by 2027-01-31; Q2-2027 means the paid launch.

**[NEEDS CLARIFICATION: pre-BRD 24 OI-01 is open: should a low-cost validation gate (clinic records, owner interviews, and a small hand-run test) run before the build, with the build starting only if it passes? If yes, the dates of BO-01 to BO-09 move.]** **[NEEDS CLARIFICATION: pre-BRD 24 OI-12 is open: the MVP plan assumes the founders code full time; should the team re-estimate at 65% coding time and cut Must (7) to a manual-assist waitlist and Must (8) to a template-only report?]**

## In Scope

**Table 7 - In Scope items**

| # | Item | Priority | Phase | Use cases |
|---|------|----------|-------|-----------|
| 1 | Clinic account with owner and receptionist logins | Must | MVP | UC-01, UC-02 |
| 2 | Appointment entry, and appointment import from a CSV file | Must | MVP | UC-07, UC-09 |
| 3 | Scheduled WhatsApp reminders from approved Arabic and English templates in the utility category | Must | MVP | UC-14 |
| 4 | One-reply confirm or cancel that updates the appointment status | Must | MVP | UC-10, UC-14 |
| 5 | SMS fallback with a short confirm or cancel link when the WhatsApp reminder is not delivered | Must | MVP | UC-15 |
| 6 | Patient consent capture, guardian consent for children, opt-out by reply, and a consent record per patient | Must | MVP | UC-08, UC-17 |
| 7 | A waitlist that offers a cancelled slot to waitlisted patients in order; the first to accept takes it. **[NEEDS CLARIFICATION: pre-BRD 24 OI-11 is open: should waitlist refill start as a manual-assist version (the system proposes the next patient and reception sends the offer in one click), with a keep-or-drop test in the pilot?]** | Must | MVP | UC-11, UC-12, UC-16 |
| 8 | Weekly no-show report to the Clinic Owner | Must | MVP | UC-03, UC-13 |
| 9 | Second reminder on the visit day | Should | Q2-2027 | UC-04, UC-14 |
| 10 | Per-doctor calendars inside one clinic (Clinic plan only) | Should | Q2-2027 | UC-01, UC-07, UC-09, UC-10, UC-12 |
| 11 | Configurable reminder timing | Should | See the marker below | UC-04 |
| 12 | Delivery and reply status per message | Should | See the marker below | UC-10 |
| 13 | Staff activity log (audit log of staff actions) | Should | See the marker below | UC-06 |
| 14 | Subscription billing in EGP through a local payment gateway | Should | Q2-2027 | UC-05 |

- **[NEEDS CLARIFICATION: pre-BRD 21 does not place items 11, 12, and 13 in a roadmap phase. Which phase delivers configurable reminder timing, the delivery and reply status per message, and the staff activity log?]**
- **[NEEDS CLARIFICATION: pre-BRD 21 plans a 14-day trial and a referral credit (one free month per referred paying clinic), but pre-BRD 14 MoSCoW lists neither. Does the product run the trial and apply the referral credit in billing, or are both handled outside the product?]**

## Out of Scope

- Clinical records or an electronic medical record (Won't have).
- Appointment deposits or payments by patients (Won't have).
- Telemedicine (Won't have).
- A patient mobile app (Won't have).
- Links to clinic-management software (Won't have).
- Marketing or broadcast campaigns (Won't have).
- Launch outside Cairo and Giza (Won't have).
- Walk-in patients: reminders do not cover them ([pre-BRD 02](../../run/pre-brd-clinic-reminders/02-product-charter.md), Limitations (4)).
- The Could-have items wait in the [Wishlist](./12-appendix-and-wishlist.md#wishlist).

---

# Personas / Actors

**Table 8 - Personas**

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Clinic Owner | The doctor who owns the clinic and pays for the subscription (the buyer) | Keep every paid hour of the schedule filled; see each week how many appointments were lost and how many were saved; avoid hiring extra staff | Owner login: sets up the account, gives receptionists logins, sets the reminder timing, pays for the plan, reads the weekly report and the staff activity log |
| Receptionist | The staff member who runs the appointment book every day (the daily user) | Confirm the day's list without a round of calls; handle cancellations; refill freed slots from the waitlist | Receptionist login: adds and imports appointments, records consent, keeps the waitlist, checks the day view, records attendance |
| Patient | A person with an appointment at the clinic who receives the messages. For a patient under 15, the guardian receives the messages and answers them. | Remember the appointment; confirm or cancel without a call; get an earlier slot when one opens | No login: answers WhatsApp messages, or uses the link in an SMS |

The personas come from [pre-BRD 04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md) and [pre-BRD 05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md). Meta, the SMS aggregator, and the payment gateway are business partners, not personas: they appear in the use cases and in [chunk 08](./08-integrations.md).

Clinic Reminders team members help clinics in person and on a WhatsApp support line ([pre-BRD 03 Lean Canvas](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), Customer Relationships). **[NEEDS CLARIFICATION: proposed: team members have no login to clinic accounts and see no patient data (NFR-04); how does a Clinic Owner who loses the owner login get it back?; confirm or replace]**

**[NEEDS CLARIFICATION: can the Clinic Owner also do the Receptionist's work (add appointments, keep the waitlist, record attendance) with the owner login, for example in a clinic with no receptionist?]**

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
