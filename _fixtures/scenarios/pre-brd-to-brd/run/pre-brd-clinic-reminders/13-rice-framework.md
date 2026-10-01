<!--
PRE-BRD CHUNK: 13
TITLE: RICE Framework
TIER: Tier 3: Prioritization
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# RICE Framework

A product management prioritization framework that helps decide which features or ideas to work on first by quantifying their potential impact across Reach, Impact, Confidence, and Effort.

## Metric definitions

- Reach: how many people will be affected by this initiative, measured per time period (for example, users per month).
- Impact: how much this moves the needle for each affected user. Rated 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal.
- Confidence: how sure you are about the estimates, as a decimal. 1.0 = high, 0.8 = medium, 0.5 = low.
- Effort: how much time this takes, in person-months or developer-weeks.

## Scoring rule

RICE Score = (Reach x Impact x Confidence) / Effort. Priorities are ranked by RICE Score (higher first).

Add one row per feature or initiative.

| Feature / initiative | Reach | Impact | Confidence | Effort | RICE score |
|---|---|---|---|---|---|
| Per-patient consent and opt-out ledger with guardian consent (Must) | 40 clinics per quarter (the year-one paying-clinic target in [15-okrs.md](15-okrs.md)) | 1 | 1.0 | 2.5 developer-weeks (06 estimate 2-3) | 16.00 = (40 x 1 x 1.0) / 2.5 |
| One-reply confirm or cancel (Must) | 40 clinics per quarter | 2 | 0.8 | 4.5 developer-weeks (06: 4-5) | 14.22 = (40 x 2 x 0.8) / 4.5 |
| Clinic accounts, appointment entry, CSV import, and schedule statuses (Must) | 40 clinics per quarter | 2 | 1.0 | 6 developer-weeks (06: 4-6, upper bound to cover accounts) | 13.33 = (40 x 2 x 1.0) / 6 |
| Weekly no-show report: analytics plus WhatsApp digest to the owner (Must) | 40 clinics per quarter | 2 | 0.8 | 5 developer-weeks (06: 3-4 plus 1-2) | 12.80 = (40 x 2 x 0.8) / 5 |
| SMS fallback with a confirm or cancel link (Must) | 40 clinics per quarter | 1 | 0.8 | 4 developer-weeks (06: 1-2 plus 2-3) | 8.00 = (40 x 1 x 0.8) / 4 |
| No-show risk flag with an extra reminder (Could) | 40 clinics per quarter | 1 | 0.5 | 2.5 developer-weeks (06: 2-3) | 8.00 = (40 x 1 x 0.5) / 2.5 |
| Scheduled WhatsApp reminders from approved Arabic and English templates (Must) | 40 clinics per quarter | 3 | 0.8 | 12.5 developer-weeks (06: reminders 4-6, WhatsApp 4-6, Arabic 2-3) | 7.68 = (40 x 3 x 0.8) / 12.5 |
| Waitlist auto-fill of cancelled slots (Must) | 20 clinics per quarter (assumption: half of clinics keep a waitlist) | 2 | 0.5 | 7 developer-weeks (06: 6-8) | 2.86 = (20 x 2 x 0.5) / 7 |
| Online prepayment or deposit (Won't now) | 20 clinics per quarter (assumption: half want deposits) | 1 | 0.5 | 7 developer-weeks (06: 6-8) | 1.43 = (20 x 1 x 0.5) / 7 |
| Online patient self-booking (Could) | 20 clinics per quarter (assumption: half want online booking) | 0.5 | 0.5 | 7 developer-weeks (06: 6-8) | 0.71 = (20 x 0.5 x 0.5) / 7 |
