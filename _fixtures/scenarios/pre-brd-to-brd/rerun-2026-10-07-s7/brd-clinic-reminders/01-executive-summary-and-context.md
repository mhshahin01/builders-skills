<!--
CHUNK: 01
TITLE: Executive Summary, Background & Business Objectives
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Executive Summary

Clinic Reminders is a monthly subscription service for small private clinics in Cairo and Giza. It reminds patients of their appointments on WhatsApp. When a WhatsApp reminder is not delivered, it sends an SMS with a short confirm or cancel link instead.

The main business problem it solves is lost doctor time. Patients forget their appointments or cancel without notice, and freed slots stay empty. Clinic Reminders replaces reminder calls with automatic messages. It turns silent no-shows into early cancellations and offers freed slots to patients on the clinic's waitlist.

Core capabilities:

- A clinic account with owner and receptionist logins.
- Appointment entry, and appointment import from a file.
- Scheduled WhatsApp reminders in Arabic or English, with Confirm and Cancel buttons.
- An SMS with a confirm or cancel link when the WhatsApp reminder is not delivered.
- Waitlist offers for cancelled slots: the first patient to accept takes the slot.
- A weekly no-show report sent to the Clinic Owner on WhatsApp.
- A consent record per patient, with guardian consent for children and opt-out by reply.

The full scope, with the roadmap phase of each item, is in [04 Project Scope](./04-scope-and-personas.md#project-scope).

---

# Background and Context / Problem Statement

Small private clinics in Cairo and Giza lose paid doctor time when patients do not come or cancel without notice. Forgetting is a leading cause of missed visits. Most private visits in Egypt are paid by the patient, so an empty slot is lost cash for the clinic owner. The evidence and the figures are in [pre-BRD 01 Concept Sheet, Problem Statement](../../run/pre-brd-clinic-reminders/01-concept-sheet.md) and [pre-BRD 10 EFAS, O1 and O2](../../run/pre-brd-clinic-reminders/10-efas.md).

Today the clinic works like this ([pre-BRD 03 Lean Canvas](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), [04 Value Proposition Canvas](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [05 Empathy Map](../../run/pre-brd-clinic-reminders/05-empathy-map.md)):

- The receptionist reminds patients by phone or from a personal WhatsApp account. Many calls go unanswered.
- Patients cancel late or not at all. Cancelling by phone is awkward, and the clinic line is often busy.
- The waiting list sits on paper or in a personal phone. A freed slot stays empty because waiting patients cannot be reached in time.
- The owner has no reliable no-show number to act on.

**[NEEDS CLARIFICATION: pre-BRD 24 OI-03 is open: do the target clinics book each patient into a timed slot, or admit patients in arrival order within a session? In arrival order, a no-show frees no slot to refill.]**

## Market context

The pre-BRD studies the market, the competitors, and the wider environment in these chunks. The figures stay there.

- [06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md)
- [07 Market Sizing](../../run/pre-brd-clinic-reminders/07-market-sizing-analysis.md)
- [08 PESTLE](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)
- [09 Porter's Five Forces](../../run/pre-brd-clinic-reminders/09-porters-five-forces.md)
- [10 EFAS](../../run/pre-brd-clinic-reminders/10-efas.md), [11 IFAS](../../run/pre-brd-clinic-reminders/11-ifas.md), and [12 SWOT](../../run/pre-brd-clinic-reminders/12-swot.md)

In short, booking platforms and clinic software already send reminders, so basic reminders are close to a commodity. All five competitive forces are high.

## Pre-BRD verdict

The pre-BRD verdict is **No-Go**, in both the [22 Executive Summary Scoreboard](../../run/pre-brd-clinic-reminders/22-executive-summary-scoreboard.md) and the [23 Investor Assessment](../../run/pre-brd-clinic-reminders/23-investor-assessment.md). The conditions for a full commitment are listed there. This BRD states the requirements of the scope the pre-BRD defines; it does not change the verdict.

---

# Business Objectives

The objectives below are the key results of [pre-BRD 15 OKRs](../../run/pre-brd-clinic-reminders/15-okrs.md), grouped under its four objectives (O1 to O4). The goals of [pre-BRD 02 Product Charter](../../run/pre-brd-clinic-reminders/02-product-charter.md) map to them: G1 to BO-01, G2 to BO-05 to BO-07, and G3 to BO-10 and BO-14. G4 (hold the licence before the first patient message) is constraint 5 in [chunk 02](./02-glossary-assumptions-facts.md#assumptions--constraints).

**[NEEDS CLARIFICATION: pre-BRD 24 OI-01 is open: should a low-cost validation gate (clinic records, owner interviews, and a small hand-run test) run before the build, with the build starting only if it passes? If yes, the dates of BO-01 to BO-09 move.]**

**Table 2 - Business Objectives**

| ID | Objective | Key result (measure) | By |
|----|-----------|----------------------|----|
| BO-01 | O1 Ship a compliant, reliable first release | All eight Must-have items in [04 In Scope](./04-scope-and-personas.md#in-scope) are live. | 2027-01-31 |
| BO-02 | O1 Ship a compliant, reliable first release | Meta business verification is complete, and the reminder, confirmation, and waitlist templates are approved in the utility category. | 2026-12-15 |
| BO-03 | O1 Ship a compliant, reliable first release | The SMS sender ID is registered on all four mobile networks. | 2026-12-31 |
| BO-04 | O1 Ship a compliant, reliable first release | The PDPC licence application is filed and a data protection officer (DPO) is registered. **[NEEDS CLARIFICATION: pre-BRD 24 OI-05 is open: should the target be a granted licence by 2027-01-15 rather than a filed application, and does each clinic need its own licence?]** | 2026-12-31 |
| BO-05 | O2 Prove the product cuts no-shows in the pilot (2027-02-01 to 2027-03-31) | 15 pilot clinics are live in Cairo and Giza. | Pilot |
| BO-06 | O2 Prove the product cuts no-shows in the pilot | A four-week no-show baseline is recorded in every pilot clinic before go-live. **[NEEDS CLARIFICATION: pre-BRD 24 OI-07 is open: the pilot overlaps Ramadan and has no control group; should half of each clinic's appointments get no reminder, with the baseline kept as daily counts only?]** | Before go-live |
| BO-07 | O2 Prove the product cuts no-shows in the pilot | No-shows fall by at least 25% against each clinic's baseline (relative reduction). **[NEEDS CLARIFICATION: pre-BRD 24 OI-07 is open: the pilot overlaps Ramadan and has no control group; should half of each clinic's appointments get no reminder, with the baseline kept as daily counts only?]** | Pilot |
| BO-08 | O2 Prove the product cuts no-shows in the pilot | At least 98% of reminders are delivered by WhatsApp or SMS. | Pilot |
| BO-09 | O2 Prove the product cuts no-shows in the pilot | At least 20% of cancelled slots are refilled from the waitlist. **[NEEDS CLARIFICATION: pre-BRD 24 OI-11 is open: should waitlist refill start as a manual-assist version (the system proposes the next patient and reception sends the offer in one click), with a keep-or-drop test in the pilot?]** | Pilot |
| BO-10 | O3 Turn the pilot into a paying base | 40 paying clinics. | 2027-09-30 |
| BO-11 | O3 Turn the pilot into a paying base | Monthly recurring revenue of EGP 26,000 (40 clinics x EGP 650 average revenue per clinic). **[NEEDS CLARIFICATION: pre-BRD 24 OI-10 is open: should the revenue plan use the company's own price list and plan mix (about EGP 594 a clinic) instead of the EGP 650 market anchor?]** | 2027-09-30 |
| BO-12 | O3 Turn the pilot into a paying base | Monthly logo churn is at or below 3%. | 2027-09-30 |
| BO-13 | O3 Turn the pilot into a paying base | At least 70% of Clinic Owners read the weekly report each week. | 2027-09-30 |
| BO-14 | O4 Stay inside the budget and be ready for a seed round | Year-one spend is at or below EGP 2,000,000. **[NEEDS CLARIFICATION: pre-BRD 24 OI-06 is open: should the budget be itemised with a three-month reserve, founder pay stated, and the seed process started at the pilot readout?]** | 2027-09-30 |
| BO-15 | O4 Stay inside the budget and be ready for a seed round | Blended customer acquisition cost (CAC) is at or below EGP 6,600, and CAC payback is 14 months or less. | 2027-09-30 |
| BO-16 | O4 Stay inside the budget and be ready for a seed round | A seed data room holds the pilot results and cohort retention. | 2027-09-30 |

BO-02 to BO-04, BO-06, and BO-14 to BO-16 are company and launch objectives. No use case serves them directly. The launch ones are tracked as [chunk 02 Dependencies](./02-glossary-assumptions-facts.md#dependencies).

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-glossary-assumptions-facts.md -->
