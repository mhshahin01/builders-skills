<!--
CHUNK: 01
TITLE: Executive Summary, Background & Business Objectives
PROJECT: Clinic Reminders
VERSION: 1.1
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Executive Summary

Clinic Reminders is a monthly subscription service for small private clinics in Cairo and Giza. A target clinic has 1 to 5 doctors in dentistry, dermatology, or pediatrics. The service reminds patients of their appointments on WhatsApp, and by SMS when WhatsApp is not delivered. Patients confirm or cancel with one reply. A cancelled slot is offered to the clinic's waitlist. The clinic owner gets a weekly no-show report.

The main business problem is lost doctor time. Patients forget their appointments or cancel without telling the clinic, and the paid slot stays empty. Today receptionists remind patients by phone or from a personal WhatsApp. Clinic Reminders replaces these calls with automatic reminders. It turns silent no-shows into early cancellations and refilled slots.

Core capabilities:
- Clinic account with owner and receptionist logins
- Appointment entry and import from a file
- Scheduled WhatsApp reminders in Arabic or English, with one-reply confirm or cancel
- SMS with a confirm or cancel link when the WhatsApp reminder is not delivered
- Slot offers to the waitlist for cancelled slots: the first patient to accept takes the slot
- Weekly no-show report to the owner on WhatsApp
- Messaging consent and opt-out record per patient, with guardian consent for children

---

# Background and Context / Problem Statement

**Current state.** Small private clinics book patients by phone or WhatsApp. The receptionist calls patients the day before, or messages them from a personal WhatsApp. Many calls go unanswered. Patients who change plans often skip the visit instead of calling. Cancellations arrive late or never. The waitlist sits on paper or in a personal phone, so a freed slot cannot be offered in time. The owner has no reliable no-show number and overbooks to cover the gaps ([pre-BRD 05 Empathy Map](../pre-brd-clinic-reminders/05-empathy-map.md)).

**Why it matters.** Published studies show that no-shows are common and that forgetting is a leading cause ([pre-BRD 10 EFAS, O1](../pre-brd-clinic-reminders/10-efas.md)). The cost of an empty slot, the evidence that reminders raise attendance, and the missing local baseline are in chunk 02 (Facts 1 and 6, Challenge 1).

**Market context.** Booking platforms and clinic software in Egypt already send reminders, and WhatsApp reminders with reply buttons are common. The competitor comparison is in [pre-BRD 06 Market Comparison](../pre-brd-clinic-reminders/06-market-comparison.md). Market size, competitive pressure, and the strategic analysis are in [pre-BRD 07 Market Sizing](../pre-brd-clinic-reminders/07-market-sizing-analysis.md), [pre-BRD 09 Porter's Five Forces](../pre-brd-clinic-reminders/09-porters-five-forces.md), and [pre-BRD 12 SWOT](../pre-brd-clinic-reminders/12-swot.md).

**Pre-BRD verdict.** The pre-BRD's go / no-go verdict and its conditions are in [pre-BRD 22 Executive Summary Scoreboard](../pre-brd-clinic-reminders/22-executive-summary-scoreboard.md) and [pre-BRD 23 Investor Assessment](../pre-brd-clinic-reminders/23-investor-assessment.md). This BRD states the requirements of the product as scoped in the approved pre-BRD.

---

# Business Objectives

The objectives come from the pre-BRD product charter and OKRs ([pre-BRD 02 Product Charter](../pre-brd-clinic-reminders/02-product-charter.md), [pre-BRD 15 OKRs](../pre-brd-clinic-reminders/15-okrs.md)). "Outside the product" means no use case delivers the objective; the founding team delivers it.

| ID | Objective | Measure | Served by |
|----|-----------|---------|-----------|
| BO-01 | Ship the MVP scope | All eight MVP features (chunk 04, In Scope) live by 2027-01-31 | UC-01 to UC-03, UC-07 to UC-19 |
| BO-02 | Clear the WhatsApp gates | WhatsApp business verification complete, and the reminder, confirmation, slot offer, and weekly report templates approved as service (utility) templates by 2026-12-15. **[NEEDS CLARIFICATION: Does the notice that a slot is filled (UC-15, step 6) need its own approved template?]** | UC-03, UC-13, UC-15 (enabler; see chunk 02 Dependencies) |
| BO-03 | Clear the SMS gate | SMS sender name registered on all four mobile networks by 2026-12-31 | UC-14 (enabler; see chunk 02 Dependencies) |
| BO-04 | Clear the data-protection gate | PDPC licence application filed and a DPO registered by 2026-12-31. The licence is held before the first patient record is entered or imported (UC-07, UC-08). | UC-09, UC-16, UC-19 (enabler; see chunk 02 Dependencies) |
| BO-05 | Run the pilot | 15 pilot clinics in Cairo and Giza live from 2027-02-01 to 2027-03-31 | UC-01 |
| BO-06 | Know each pilot clinic's starting point | A four-week no-show baseline recorded in every pilot clinic before go-live. **[NEEDS CLARIFICATION: Is the no-show reduction measured against this four-week baseline, or against a concurrent control in which a random half of each pilot clinic's appointments gets no reminder (pre-BRD OI-07: the pilot overlaps Ramadan)? A control arm changes UC-13 and UC-14.]** | Outside the product (pilot activity) |
| BO-07 | Cut no-shows | No-show rate at least 25% lower than the clinic's baseline (relative reduction), per pilot clinic | UC-03, UC-07, UC-12, UC-13, UC-14 |
| BO-08 | Reach patients | At least 98% of reminders delivered by WhatsApp or SMS | UC-13, UC-14 |
| BO-09 | Refill cancelled slots | At least 20% of cancelled slots refilled from the waitlist | UC-10, UC-11, UC-15 |
| BO-10 | Build a paying base | 40 paying clinics by 2027-09-30 | UC-06 (sales are outside the product) |
| BO-11 | Earn recurring revenue | Monthly recurring revenue of EGP 26,000 (40 clinics x EGP 650) by 2027-09-30 | UC-06 |
| BO-12 | Keep clinics | Monthly logo churn at or below 3% | UC-03 |
| BO-13 | Make the report a habit | At least 70% of owners read the weekly report each week | UC-03 |
| BO-14 | Stay in budget | Year-one spend at or below EGP 2,000,000 | Outside the product |
| BO-15 | Acquire clinics at a fair cost | Blended acquisition cost at or below EGP 6,600 per clinic, paid back in 14 months or less | Outside the product |
| BO-16 | Be ready to raise a seed round | A seed data room with pilot results and cohort retention by 2027-09-30 | Outside the product (uses UC-03 report data) |

**[NEEDS CLARIFICATION: Does a low-cost validation gate run from 2026-10-01 to 2026-11-30 before the build starts, as pre-BRD OI-01 recommends? If yes, the dates in BO-01 to BO-09 move.]**

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-glossary-assumptions-facts.md -->
