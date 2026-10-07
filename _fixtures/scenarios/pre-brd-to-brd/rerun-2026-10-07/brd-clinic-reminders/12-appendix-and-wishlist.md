<!--
CHUNK: 12
TITLE: Appendix & Wishlist
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: none
PART OF: BRD - Clinic Reminders
-->

# Appendix

| File Description | File (Attached) |
|------------------|-----------------|
| Approved-as-is pre-BRD 00 | [00-pre-brd-master.md](../../run/pre-brd-clinic-reminders/00-pre-brd-master.md) |
| Approved-as-is pre-BRD 01 | [01-concept-sheet.md](../../run/pre-brd-clinic-reminders/01-concept-sheet.md) |
| Approved-as-is pre-BRD 02 | [02-product-charter.md](../../run/pre-brd-clinic-reminders/02-product-charter.md) |
| Approved-as-is pre-BRD 03 | [03-lean-canvas.md](../../run/pre-brd-clinic-reminders/03-lean-canvas.md) |
| Approved-as-is pre-BRD 04 | [04-value-proposition-canvas.md](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md) |
| Approved-as-is pre-BRD 05 | [05-empathy-map.md](../../run/pre-brd-clinic-reminders/05-empathy-map.md) |
| Approved-as-is pre-BRD 06 | [06-market-comparison.md](../../run/pre-brd-clinic-reminders/06-market-comparison.md) |
| Approved-as-is pre-BRD 07 | [07-market-sizing-analysis.md](../../run/pre-brd-clinic-reminders/07-market-sizing-analysis.md) |
| Approved-as-is pre-BRD 08 | [08-pestle-analysis.md](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md) |
| Approved-as-is pre-BRD 09 | [09-porters-five-forces.md](../../run/pre-brd-clinic-reminders/09-porters-five-forces.md) |
| Approved-as-is pre-BRD 10 | [10-efas.md](../../run/pre-brd-clinic-reminders/10-efas.md) |
| Approved-as-is pre-BRD 11 | [11-ifas.md](../../run/pre-brd-clinic-reminders/11-ifas.md) |
| Approved-as-is pre-BRD 12 | [12-swot.md](../../run/pre-brd-clinic-reminders/12-swot.md) |
| Approved-as-is pre-BRD 13 | [13-rice-framework.md](../../run/pre-brd-clinic-reminders/13-rice-framework.md) |
| Approved-as-is pre-BRD 14 | [14-moscow-method.md](../../run/pre-brd-clinic-reminders/14-moscow-method.md) |
| Approved-as-is pre-BRD 15 | [15-okrs.md](../../run/pre-brd-clinic-reminders/15-okrs.md) |
| Approved-as-is pre-BRD 16 | [16-bcg-matrix.md](../../run/pre-brd-clinic-reminders/16-bcg-matrix.md) |
| Approved-as-is pre-BRD 17 | [17-ansoff-matrix.md](../../run/pre-brd-clinic-reminders/17-ansoff-matrix.md) |
| Approved-as-is pre-BRD 18 | [18-vrio.md](../../run/pre-brd-clinic-reminders/18-vrio.md) |
| Approved-as-is pre-BRD 19 | [19-product-strategy-canvas.md](../../run/pre-brd-clinic-reminders/19-product-strategy-canvas.md) |
| Approved-as-is pre-BRD 20 | [20-product-lifecycle.md](../../run/pre-brd-clinic-reminders/20-product-lifecycle.md) |
| Approved-as-is pre-BRD 21 | [21-roadmap-project-plan.md](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md) |
| Approved-as-is pre-BRD 22 | [22-executive-summary-scoreboard.md](../../run/pre-brd-clinic-reminders/22-executive-summary-scoreboard.md) |
| Approved-as-is pre-BRD 23 | [23-investor-assessment.md](../../run/pre-brd-clinic-reminders/23-investor-assessment.md) |
| Approved-as-is pre-BRD 24 | [24-open-items-and-assumptions-log.md](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md) |

## Source crosswalk

| Source | BRD home | Treatment |
|--------|----------|-----------|
| 01, 02, 15 | 01 | Problem and goals; all 16 key results retained as objectives with their unresolved qualifications. |
| 03, 04, 05 | 04, 05 and detailed use cases | Personas, jobs, pains and journeys; no commercial price list copied. |
| 06-12 | 01 context; 02 facts/challenges; 10 legal quality candidates | Research figures linked only. Source-stated technical mandates parked below. Competitor functionality does not become product scope. |
| 13, 14 | 04; 12 Wishlist | MoSCoW controls scope; priority evidence does not replace the Must/Should boundary. |
| 16-20 | None | Read for context only; no strategy feature adopted as a requirement. |
| 21 | 04; 12 Wishlist | Explicit phases attached to scope; no guessed phase for unassigned Should items. |
| 22, 23 | 01 | No-Go word retained next to both citations; no scores copied. |
| 24 | 02 and every affected home | No assumptions validated. Open concerns stay markers; proposed upstream resolutions not silently applied. |

## Technical Inputs for the SDD

Source statements below are quoted only to preserve technical mandates. They do not approve a choice or copy market analysis into requirements.

| Source Statement (verbatim) | Source Location | Relevant To |
|-----------------------------|-----------------|-------------|
| WhatsApp Business Platform through a direct Cloud API integration (utility templates, quick-reply buttons, status webhooks); an NTRA-licensed Egyptian SMS aggregator with a registered sender ID; a web dashboard and backend on the team's default stack (Angular with PrimeNG, Java 21 with Spring Boot, PostgreSQL), final choices in the SDD; hosting in Egypt or abroad pending the PDPL decision ([08](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md), Legal); a local payment gateway for EGP billing. | [01 Technology / Tools Used](../../run/pre-brd-clinic-reminders/01-concept-sheet.md) | Stack, messaging, hosting and payments |
| appointment entry and CSV import | [14 Must-have item 2](../../run/pre-brd-clinic-reminders/14-moscow-method.md) | Appointment import mandate |
| keep the appointment model FHIR-friendly. | [08 Political point 1](../../run/pre-brd-clinic-reminders/08-pestle-analysis.md) | Source technical direction, despite clinic integrations being out of scope |

**[NEEDS CLARIFICATION: SDD owner and founders to carry pre-BRD 24 OI-15 sender model and counsel-dependent residency from pre-BRD 08 into the technical design; no option is selected by this transform.]**

# Wishlist

| Feature | Priority | Source phase |
|---------|----------|--------------|
| Reschedule by reply | Could | Q4-2027 after seed |
| Online booking link | Could | Q4-2027 after seed |
| Calendar export | Could | Unstated |
| No-show breakdown by doctor, weekday and specialty | Could | Unstated |
| English dashboard | Could | Unstated |

Source: [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md) and [pre-BRD 21](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md). Won't items remain excluded in 04. Strategy chapters 16-20 do not authorize additional features.

## Upstream questions

- **[NEEDS CLARIFICATION: Founders to decide the WhatsApp sender identity, onboarding and billing model; pre-BRD 24 OI-15 remains Open.]** Source: [pre-BRD OI-15](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-15-the-whatsapp-sender-model-is-undecided-but-drives-cost-limits-billing-and-trust).


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 11-summary-and-uiux.md | NEXT: 13-open-items-and-clarifications.md -->
