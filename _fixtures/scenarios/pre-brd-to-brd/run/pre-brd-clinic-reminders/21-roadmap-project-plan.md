<!--
PRE-BRD CHUNK: 21
TITLE: Roadmap, Project Plan and Go-To-Market
TIER: Tier 4: Strategy and Planning
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# Roadmap, Project Plan and Go-To-Market

A strategic document that outlines the timeline for developing and evolving the product and the plan for taking it to market. It aligns teams around what will be built, why it matters, when it will be delivered, and how it reaches its first customers.

## Roadmap and Project Plan

Add one row per quarter (or planning horizon). Set Status per row (for example: Not started, In progress, Done, At risk).

| Quarter - Year | Primary goal | Key features & tasks | Dependencies | Owner | Status |
|---|---|---|---|---|---|
| Q4-2026 | Build the MVP and clear the platform and legal gates | Must-haves in [14-moscow-method.md](14-moscow-method.md) (41.5 developer-weeks estimated against about 52 available, [13-rice-framework.md](13-rice-framework.md)); Meta business verification and utility templates; SMS sender ID on all four networks; PDPC licence application and DPO; recruit 15 pilot clinics | Incorporation in Egypt ([11-ifas.md](11-ifas.md), S3); counsel answers on PDPL ([08-pestle-analysis.md](08-pestle-analysis.md), Legal) | Founders (product owner open in [02-product-charter.md](02-product-charter.md)) | Not started |
| Q1-2027 | MVP live by 2027-01-31 and pilot run | Go-live; four-week baselines in pilot clinics; pilot 2027-02-01 to 2027-03-31; measure no-show change and waitlist use; fix onboarding | MVP complete; PDPC licence; consent flows | Founders | Not started |
| Q2-2027 | Paid launch in Cairo and Giza | EGP billing through a local payment gateway; pricing below; referral credit; field sales with the first sales hire; second reminder and per-doctor calendars (Should-haves) | Pilot results; payment gateway contract | Founders and the sales hire | Not started |
| Q3-2027 | 40 paying clinics and seed readiness | Scale onboarding; churn reviews; weekly-report improvements; seed data room and raise | Year-one budget; pilot evidence | Founders | Not started |
| Q4-2027 | Post-seed growth | Sales team; Could-haves (reschedule by reply, booking link); evaluate the next governorate ([17-ansoff-matrix.md](17-ansoff-matrix.md)) | Seed closed | Founders and new hires | Not started |

## Go-To-Market Strategy

How the product reaches its market: who we target first, how we position and price it, which channels carry it, and how we measure launch traction. Keep this coherent with Market Comparison (06), Market Sizing (07, SOM), Ansoff (17), and the Product Strategy Canvas (19).

### Target segment & positioning

| Beachhead segment | Why this segment first | Positioning statement | Key differentiator |
|---|---|---|---|
| Private dental clinics with 1 to 5 dentists in Cairo and Giza | Largest specialty pool: about 40,000 of Egypt's 108,000 registered dentists are in Cairo and Giza, and dental clinics are 19% to 23% of Cairo's private clinics ([07-market-sizing-analysis.md](07-market-sizing-analysis.md)); dentistry runs on appointments and multi-visit treatment plans, so a no-show repeats as lost chair time; the dental-only rivals (Dentolize, PDental) are full practice suites with opaque pricing ([06-market-comparison.md](06-market-comparison.md)) | For owners of small dental clinics in Cairo and Giza who lose chair time to no-shows, Clinic Reminders is a WhatsApp-first reminder service that confirms, cancels, and refills appointments automatically; unlike booking platforms and full clinic systems, it adds automatic waitlist refill, SMS fallback, and a weekly no-show report without changing how the clinic works. | Automatic waitlist refill and SMS fallback, offered by none of the five products in 06 |

### Pricing & packaging

| Tier / package | Target buyer | Price point | What's included | Rationale |
|---|---|---|---|---|
| Starter | Clinics with 1 to 2 doctors | EGP 549 a month, or EGP 5,490 a year prepaid | Up to 2 doctors; 600 WhatsApp reminders a month with confirm or cancel; SMS fallback at cost; waitlist refill; weekly report | Below Tabbaba's EGP 649 bot plan ([07](07-market-sizing-analysis.md)) and iClinicOS's EGP 1,199 Starter ([06](06-market-comparison.md)), above Tabib Mate's EGP 299 |
| Clinic | Clinics with 3 to 5 doctors | EGP 999 a month, or EGP 9,990 a year prepaid | Up to 5 doctors; 2,000 reminders a month; per-doctor calendars and reports | Below iClinicOS Pro (EGP 2,299) and ClinicGateway (EGP 2,500); a 75/25 Starter-to-Clinic mix (assumption) gives EGP 662 a month, near the EGP 650 planning ARPU ([03-lean-canvas.md](03-lean-canvas.md)) |
| Message top-up | Any plan | EGP 50 per 100 extra WhatsApp reminders; SMS at cost plus 20% | Reminders beyond the monthly allowance | WhatsApp costs about EGP 21 per 100 reminders with VAT at the canonical rate, so top-ups protect margin under Meta's USD pricing ([10-efas.md](10-efas.md), T1) |

### Channels & launch plan

| Channel | Role (awareness / acquisition / retention) | Launch phase | Owner |
|---|---|---|---|
| Founder-led field visits to clinics in Cairo and Giza | Acquisition | Pilot recruitment (Q4-2026) and paid launch (Q2-2027) | Founders, then the sales hire |
| Arabic landing page with a no-show cost calculator and WhatsApp click-to-chat | Awareness and acquisition | Pilot (Q1-2027) | Founders |
| Dental supply distributors and specialty society events | Awareness | Paid launch (Q2-2027) | Founders |
| Facebook and Instagram ads targeted at doctors | Awareness | Paid launch (Q2-2027) | Founders |
| Referral credit: one free month per referred paying clinic | Acquisition and retention | Paid launch (Q2-2027) | Founders |
| Weekly no-show report pushed to the owner | Retention | Pilot onward | Product |

### Acquisition funnel & CAC

| Funnel stage | Conversion assumption | Channel(s) | Notes |
|---|---|---|---|
| Qualified lead | 400 leads in year one (planning assumption) | Field visits, landing page, ads, referrals | Clinics matching the segment |
| Demo held | 40% of leads (assumption) | Field visits | Validate in the pilot |
| Trial started | 50% of demos (assumption) | Demo | 14-day trial, matching Tabbaba and iClinicOS ([06](06-market-comparison.md)) |
| Paid | 50% of trials (assumption) | Trial | 400 x 0.4 x 0.5 x 0.5 = 40 paying clinics; willingness to pay is unvalidated ([10](10-efas.md), T4) |

Blended CAC estimate: EGP 6,569 per paying clinic - Source / assumption: (about six months of the sales hire in year one, EGP 162,764, plus a EGP 100,000 marketing allocation for ads, events, and referral credits) / 40 paying clinics; founder selling time is not costed. Target LTV:CAC ratio: 3:1; the current estimate is 2.5:1 (LTV EGP 16,250 = EGP 650 ARPU x 75% assumed gross margin / 3% monthly churn), so CAC must fall or ARPU rise.

### GTM KPIs

| KPI | Definition | Target | Time horizon |
|---|---|---|---|
| Qualified leads | Segment clinics contacted or inbound | 400 | 2026-10-01 to 2027-09-30 |
| Demo-to-trial rate | Trials started / demos held | 50% or more | Each quarter from Q1-2027 |
| Trial-to-paid rate | Paying clinics / trials started | 50% or more | Each quarter from Q2-2027 |
| Blended CAC | Sales and marketing spend / new paying clinics | EGP 6,600 or less | Year one |
| CAC payback | CAC / (ARPU x gross margin) = 6,569 / (650 x 0.75) | 14 months or less | Year one |
| Referral share | Paying clinics acquired through referrals | 25% or more | By 2027-09-30 |
