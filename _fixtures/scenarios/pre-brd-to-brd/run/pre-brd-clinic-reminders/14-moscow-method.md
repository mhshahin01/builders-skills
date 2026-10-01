<!--
PRE-BRD CHUNK: 14
TITLE: MoSCoW Method
TIER: Tier 3: Prioritization
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# MoSCoW Method

A prioritization technique used in product management, software development, and project planning. It helps stakeholders agree on the importance of requirements by categorizing them into four groups. Common uses: agile and Scrum sprints, MVP scoping, release planning, product backlog grooming, and cross-functional alignment between business and technical teams. It keeps focus on what matters, avoids scope creep, and supports realistic delivery timelines.

| Priority | Definition | Answer (items) |
|---|---|---|
| Must have | Non-negotiable core features; the product fails without them. | MVP by 2027-01-31: (1) clinic account with owner and receptionist logins; (2) appointment entry and CSV import; (3) scheduled WhatsApp reminder from approved Arabic and English utility templates; (4) one-reply confirm or cancel that updates the appointment status; (5) SMS fallback when the WhatsApp reminder is not delivered, carrying a short confirm or cancel link because two-way SMS is not supported in Egypt; (6) patient consent capture with guardian consent for children, opt-out by reply, and a consent record per patient (PDPL, see [08-pestle-analysis.md](08-pestle-analysis.md)); (7) waitlist that offers a cancelled slot to waitlisted patients in order, first to accept takes it; (8) weekly no-show report to the owner. |
| Should have | Important but not essential; can be postponed if needed. | Second reminder on the visit day; per-doctor calendars inside one clinic; configurable reminder timing; delivery and reply status per message; audit log of staff actions; subscription billing in EGP through a local payment gateway. |
| Could have | Nice to have; low impact or low effort; only if time and resources allow. | Reschedule by reply; online booking link the clinic can share; calendar export; no-show breakdown by doctor, weekday, and specialty; English dashboard. |
| Won't have (now) | Not a priority for this release; can be re-evaluated later. | Clinical records or EMR; appointment deposits or payments; telemedicine; a patient mobile app; integrations with clinic-management software; marketing or broadcast campaigns; launch outside Cairo and Giza. |
