<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 01
PART OF: BRD - Clinic Reminders
-->

# Project Scope

The requirements cover the reminder-to-reply-to-refill journey and the Should features. Priority is governed by [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md); phases are taken from [pre-BRD 21](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md). [pre-BRD 13](../../run/pre-brd-clinic-reminders/13-rice-framework.md) orders priority within scope; its scores are not requirements.

## In Scope

| Capability | Priority | Source roadmap phase | Requirement home |
|------------|----------|----------------------|------------------|
| Clinic account with owner and receptionist logins | Must | Q4-2026 build; MVP by 2027-01-31 | UC-01 |
| Appointment entry and import | Must | Q4-2026 build; MVP by 2027-01-31 | UC-05 |
| Scheduled Arabic and English WhatsApp reminders | Must | Q4-2026 build; MVP by 2027-01-31 | UC-06 |
| One-reply confirm or cancel with appointment status update | Must | Q4-2026 build; MVP by 2027-01-31 | UC-09 |
| SMS fallback with a confirm or cancel link | Must | Q4-2026 build; MVP by 2027-01-31 | UC-06, UC-09 |
| Consent, guardian consent, opt-out and a per-patient record | Must | Q4-2026 build; MVP by 2027-01-31 | UC-04, UC-11 |
| Ordered waitlist offers; first acceptance takes a cancelled slot | Must | Q4-2026 build; MVP by 2027-01-31 | UC-07, UC-10 |
| Weekly no-show report to the owner | Must | Q4-2026 build; MVP by 2027-01-31 | UC-02; 09 |
| Second reminder on visit day | Should | Q2-2027 paid launch | UC-06 |
| Per-doctor calendars inside one clinic | Should | Q2-2027 paid launch | UC-05 |
| Configurable reminder timing | Should | Not assigned in pre-BRD 21 | UC-06 |
| Delivery and reply status per message | Should | Not assigned in pre-BRD 21 | UC-06 |
| Audit log of staff actions | Should | Not assigned in pre-BRD 21 | NFR-05 |
| Subscription billing in EGP through a local payment gateway | Should | Q2-2027 paid launch | UC-03 |

**[NEEDS CLARIFICATION: Founders to assign roadmap phases to configurable timing, per-message status and staff audit; pre-BRD 14 makes them Should but pre-BRD 21 assigns no phase.]**

## Out of Scope

Could items stay in [Wishlist](./12-appendix-and-wishlist.md#wishlist): rescheduling by reply, self-booking link, calendar export, extra no-show breakdowns and an English dashboard. The source places rescheduling and the booking link in Q4-2027 after seed funding; the other Could phases are unstated.

Won't items: clinical records, appointment payments or deposits, telemedicine, a patient app, clinic-software integrations, marketing broadcasts, and launch outside Cairo and Giza. Subscription billing is for the clinic's service; it does not collect appointment fees. Source: [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|--------------|
| Clinic Owner | Doctor-owner and buyer | Use the clinic account, read results, pay the clinic subscription | Clinic account; exact boundary pending 03. |
| Receptionist | Daily clinic user | Record consent and appointments; handle waiting patients and the day's statuses | Staff login; exact boundary pending 03. |
| Patient | Message recipient, including a guardian acting for a pediatric patient | Confirm, cancel, take an earlier visit or stop messages | Reply and message link; no patient app. Identity rules pending 03. |

Personas and journeys come from [pre-BRD 03](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md) and [pre-BRD 05](../../run/pre-brd-clinic-reminders/05-empathy-map.md). Interview quotes in 05 are hypotheses, not validated user testimony.

## Upstream questions

- **[NEEDS CLARIFICATION: Founders to reconcile the No-Go and full-build plan; pre-BRD 24 OI-01 remains Open.]** Source: [pre-BRD OI-01](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-01-a-robust-no-go-sits-on-top-of-a-plan-that-starts-the-full-build-on-2026-10-01).
- **[NEEDS CLARIFICATION: Founders and clinic owners to validate timed-slot admission and waitlist suitability; pre-BRD 24 OI-03 remains Open.]** Source: [pre-BRD OI-03](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-03-the-problem-and-the-waitlist-assume-timed-slots-but-many-target-clinics-may-admit-patients-in-arrival-order).
- **[NEEDS CLARIFICATION: Egyptian counsel and founders to settle licence grant timing and per-clinic licensing; pre-BRD 24 OI-05 remains Open.]** Source: [pre-BRD OI-05](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-05-the-pdpc-licence-gates-the-pilot-with-about-a-month-of-slack-and-per-clinic-licensing-is-unresolved).
- **[NEEDS CLARIFICATION: Founders to confirm funding, founder pay and the budget basis before commitment; pre-BRD 24 OI-06 remains Open.]** Source: [pre-BRD OI-06](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-06-the-year-one-budget-has-no-line-items-no-runway-buffer-and-an-unconfirmed-funding-source).
- **[NEEDS CLARIFICATION: Founders and pilot clinic owners to settle pilot design, baseline comparability and consent for data collection; pre-BRD 24 OI-07 remains Open.]** Source: [pre-BRD OI-07](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-07-the-pilots-before-after-design-overlaps-ramadan-and-has-no-control-group).
- **[NEEDS CLARIFICATION: Founders to validate messaging cost, pricing and payback assumptions before subscription rules are final; pre-BRD 24 OI-09 remains Open.]** Source: [pre-BRD OI-09](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-09-gross-margin-and-churn-behind-ltvcac-are-assumptions-and-the-cost-side-omits-charged-replies-offers-and-hosting).
- **[NEEDS CLARIFICATION: Founders to confirm the price and tier mix behind BO-11; its planning revenue is not validated; pre-BRD 24 OI-10 remains Open.]** Source: [pre-BRD OI-10](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-10-the-planning-arpu-is-a-competitor-anchor-and-the-tier-mix-that-matches-it-has-no-basis).
- **[NEEDS CLARIFICATION: Founders and clinic owners to decide waitlist demand and automatic versus manual-assist scope; pre-BRD 24 OI-11 remains Open.]** Source: [pre-BRD OI-11](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-11-the-headline-differentiator-is-the-least-evidenced-must-have).
- **[NEEDS CLARIFICATION: Founders to re-estimate scope and build dates; waitlist and report reductions remain unaccepted upstream proposals; pre-BRD 24 OI-12 remains Open.]** Source: [pre-BRD OI-12](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-12-the-mvp-schedule-assumes-all-founder-time-goes-to-coding).
- **[NEEDS CLARIFICATION: Founders to decide the WhatsApp sender identity, onboarding and billing model; pre-BRD 24 OI-15 remains Open.]** Source: [pre-BRD OI-15](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-15-the-whatsapp-sender-model-is-undecided-but-drives-cost-limits-billing-and-trust).
- **[NEEDS CLARIFICATION: Founders to reconcile the source SMS charging conflict; linked figure and citation corrections remain upstream; pre-BRD 24 OI-16 remains Open.]** Source: [pre-BRD OI-16](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-16-minor-figure-and-citation-inconsistencies).


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->
