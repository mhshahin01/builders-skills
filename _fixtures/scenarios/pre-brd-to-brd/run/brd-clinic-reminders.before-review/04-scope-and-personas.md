<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
-->

# Project Scope

The owner sets up the clinic and its doctors, and adds receptionist logins. Every day the receptionist enters or imports appointments and records each patient's consent. Before each visit the system reminds the patient on WhatsApp, or by SMS when WhatsApp is not delivered. The patient confirms or cancels with one reply or one tap. A cancelled slot is offered to the waitlist, and the first patient to accept takes it. The receptionist starts the day with a list of who confirmed, who cancelled, and who did not reply, and marks who came. Each week the owner receives a no-show report on WhatsApp.

Scope follows the pre-BRD priorities ([pre-BRD 14 MoSCoW](../pre-brd-clinic-reminders/14-moscow-method.md), [pre-BRD 21 Roadmap](../pre-brd-clinic-reminders/21-roadmap-project-plan.md)). Must-have items form the MVP, due by 2027-01-31. Should-have items come with the paid launch from 2027-04-01. Could-have items are in the Wishlist (chunk 12).

## In Scope

**Market:** private clinics with 1 to 5 doctors in dentistry, dermatology, and pediatrics, in Cairo and Giza governorates.

**MVP (by 2027-01-31):**

1. Clinic account with owner and receptionist logins (UC-01, UC-02).
2. Appointment entry and CSV file import (UC-07, UC-08, UC-10).
3. Scheduled WhatsApp reminder from approved Arabic and English service templates (UC-13).
4. One-reply confirm or cancel that updates the appointment status (UC-12, UC-13).
5. SMS fallback with a confirm or cancel link when the WhatsApp reminder is not delivered (UC-14).
6. Patient consent capture with guardian consent for children, opt-out by reply, and a consent record per patient (UC-09, UC-16).
7. Waitlist that offers a cancelled slot to waitlisted patients in order; the first to accept takes it (UC-11, UC-15).
8. Weekly no-show report to the owner (UC-03).

**Paid launch (from 2027-04-01):**

9. Second reminder on the visit day (UC-04).
10. Configurable reminder timing (UC-04).
11. Per-doctor calendars inside one clinic (UC-12).
12. Delivery and reply status per message (UC-12).
13. Audit log of staff actions (UC-05).
14. Subscription billing in EGP through a local payment gateway (UC-06).

## Out of Scope

- Clinical records or medical history: Clinic Reminders is not a clinic management system.
- Appointment deposits or payments by patients.
- Telemedicine.
- A patient mobile app: patients use WhatsApp, SMS, and the confirm or cancel link.
- Links to clinic management software: appointments are entered or imported (chunk 02, Assumption 5).
- Marketing or broadcast campaigns: every message serves one patient's own appointment or waitlist request.
- Clinics outside Cairo and Giza.
- Online self-booking by patients and the other Could-have items: see the Wishlist (chunk 12).

---

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Clinic Owner | The doctor who owns the clinic and buys the subscription | Keep every paid hour filled; see each week how many visits were lost and refilled; avoid an extra hire | Clinic administrator: clinic setup, staff logins, reminder settings, reports, billing; views the day's list |
| Receptionist | The staff member who runs the clinic's schedule every day | Confirm tomorrow's list without calls; handle cancellations; refill slots from the waitlist; spend time on patients at the desk | Clinic staff: appointments, consent records, waitlist, the day's list |
| Patient | The person who has the appointment, or the guardian who answers for a child under 15 | Remember the visit; confirm or cancel without a call; get an earlier slot; stop unwanted messages | No login: answers WhatsApp messages and opens the confirm or cancel link |

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
