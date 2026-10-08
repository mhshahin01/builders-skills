<!--
CHUNK: 01
TITLE: Executive Summary, Background & Business Objectives
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Executive Summary

Clinic Reminders is a monthly subscription service for small private clinics in Cairo and Giza. It reminds patients of their appointments on WhatsApp, and by SMS when WhatsApp does not reach them. Patients confirm or cancel with one reply. A cancelled slot is offered to the clinic's waitlist. Each week, the clinic owner gets a no-show report on WhatsApp.

The business problem is lost doctor time. Patients forget their visits or cancel without notice, and receptionists spend hours on reminder calls. Clinic Reminders replaces these calls with automatic reminders. It turns silent no-shows into early cancellations, and it fills freed slots from the waitlist.

Core capabilities:

- A clinic account with owner and receptionist logins.
- Appointment entry, and import of appointments from a file.
- WhatsApp reminders in Arabic or English, with Confirm and Cancel buttons.
- An SMS with a confirm-or-cancel link when the WhatsApp reminder is not delivered.
- Waitlist offers for cancelled slots: the first patient to accept takes the slot.
- A weekly no-show report to the owner on WhatsApp.
- A consent record for every patient, with guardian consent for children and opt-out by reply.

---

# Background and Context / Problem Statement

Small private clinics lose paid doctor time when patients do not come or cancel without notice. An empty slot is lost income for the owner (02 / Fact 1). The problem assumes that each patient holds a timed slot (open question: 02 / Assumption 21). Forgetting is a leading cause of no-shows ([pre-BRD 10 EFAS, O1](../../run/pre-brd-clinic-reminders/10-efas.md)).

Today, reminders and the waiting list depend on the receptionist's calls, paper, and personal phone (02 / Fact 2). Many calls go unanswered, and cancellations arrive late or never. A freed slot stays empty because waiting patients cannot be reached in time ([pre-BRD 01 Concept Sheet](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)).

Published studies show that reminders raise attendance ([pre-BRD 10 EFAS, O2](../../run/pre-brd-clinic-reminders/10-efas.md)). No no-show baseline exists yet for private clinics in Greater Cairo.

Basic reminders are common in Egyptian clinic software. None of the five products compared in the pre-BRD offers automatic waitlist refill or automatic SMS fallback ([pre-BRD 06 Market Comparison](../../run/pre-brd-clinic-reminders/06-market-comparison.md)). Market size and competition are analysed in [pre-BRD 07 Market Sizing](../../run/pre-brd-clinic-reminders/07-market-sizing-analysis.md) and [pre-BRD 09 Porter's Five Forces](../../run/pre-brd-clinic-reminders/09-porters-five-forces.md).

The pre-BRD verdict is No-Go ([pre-BRD 22 Executive Summary Scoreboard](../../run/pre-brd-clinic-reminders/22-executive-summary-scoreboard.md); [pre-BRD 23 Investor Assessment](../../run/pre-brd-clinic-reminders/23-investor-assessment.md)). This BRD states the requirements of the product as the pre-BRD scopes it.

---

# Business Objectives

Objectives 1, 2, and 3 are measured in the pilot ([04 / Release phases](./04-scope-and-personas.md#release-phases)).

1. **Fewer no-shows.** In each pilot clinic, the no-show rate falls by at least 25%. The rate is compared with the clinic's own four-week baseline, recorded before go-live ([pre-BRD 15 OKRs, O2 KR2 and KR3](../../run/pre-brd-clinic-reminders/15-okrs.md)). The baseline and the pilot use the same no-show formula ([03 / Measures](./03-definitions-and-domain-concepts.md#measures)) (open question: 02 / Assumption 23).
2. **Reminders reach patients.** At least 98% of reminders are delivered, by WhatsApp or by SMS ([pre-BRD 15 OKRs, O2 KR4](../../run/pre-brd-clinic-reminders/15-okrs.md)).
3. **Cancelled slots are refilled.** At least 20% of cancelled slots are refilled from the waitlist ([pre-BRD 15 OKRs, O2 KR5](../../run/pre-brd-clinic-reminders/15-okrs.md)) (open question: [03 / Waitlist and slot offers](./03-definitions-and-domain-concepts.md#waitlist-and-slot-offers)).
4. **Owners read the weekly report.** At least 70% of owners read the weekly no-show report each week ([pre-BRD 15 OKRs, O3 KR4](../../run/pre-brd-clinic-reminders/15-okrs.md)). A report counts as read when WhatsApp shows it as read. An owner who turns off read receipts counts as not read.
5. **Patients answer reminders.** The share of reminders that get a confirm or cancel reply is measured for each clinic ([pre-BRD 01 Concept Sheet, Success Metrics (3)](../../run/pre-brd-clinic-reminders/01-concept-sheet.md)). **[NEEDS CLARIFICATION: What patient reply rate is the target? Pre-BRD 01 names the measure, and pre-BRD 15 sets no target for it.]**
6. **Fewer reminder calls.** Reception calls only the patients on the call list (UC-10; [pre-BRD 04 Value Proposition Canvas, Receptionist](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md)). The pilot measures the receptionist call time saved ([pre-BRD 08 PESTLE, Environmental (1)](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md)). **[NEEDS CLARIFICATION: What cut in reminder-call time counts as success?]**

Company targets stay in the pre-BRD: paying clinics, revenue, churn, budget, sales cost, and the seed round ([pre-BRD 15 OKRs, O3 KR1 to KR3 and O4](../../run/pre-brd-clinic-reminders/15-okrs.md)). The launch prerequisites (Meta verification, SMS sender registration, the PDPC licence, and the data protection officer) are dependencies in [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies).

<!-- MASTER: clinic-reminders-brd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-glossary-assumptions-facts.md -->
