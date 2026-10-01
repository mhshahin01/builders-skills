<!--
PRE-BRD CHUNK: 07
TITLE: Market Sizing and Analysis
TIER: Tier 2: Market and Competition
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# Market Sizing and Analysis

TAM, SAM, and SOM, sized two ways and cross-checked. Top-down starts from the relevant industry market (from industry reports) and narrows to the addressable slice. Bottom-up multiplies the addressable customer count by annual software spend (ARPU). The two estimates are averaged and then reduced to SAM and SOM.

## Definitions

| Item | Definition | Answer |
|---|---|---|
| TAM (Total Addressable Market) | The total demand for the product globally. | EGP 64.62M a year (USD 1.24M): annual spend on appointment scheduling and reminder software by small private dental, dermatology, and pediatric clinics in Egypt, 2026 (average of the two methods in section 3). Scoped to the national segment rather than the world; for context, the global medical scheduling software market is USD 535.1M in 2026 (section 1). |
| SAM (Serviceable Available Market) | The portion of TAM serviceable based on business model and geography. | EGP 18.09M a year (USD 0.35M): the same segment in the launch footprint, Greater Cairo (Cairo and Giza governorates), 2026. |
| SOM (Serviceable Obtainable Market) | The realistic share of SAM that can be captured initially. | EGP 0.90M a year (USD 17.4K) by the end of year three (2029-09-30): 5% of SAM, equal to about 116 clinics at the EGP 7,800 ARPU (the bottom-up path gives 218 clinics and EGP 1.70M). |

**Canonical figures** (one value, scope, and year per shared magnitude; chunks 06, 08, 09, 10, 11, 16, and 22 use these exactly):

| Figure | Value | Scope and year | Source |
|---|---|---|---|
| Exchange rate | EGP 52.06 per USD | Central Bank of Egypt official sell rate, 2026-09-30 | [CBE rates via AllRatesToday](https://allratestoday.com/central-bank-rates-api/cbe/); same rate on [EGX News](https://www.egx.news/en/usd) |
| Category market and growth | USD 535.1M (EGP 27.86B); 2025: USD 474.0M; CAGR 12.9% (2026-2035) | Global medical scheduling software, all end users, 2026 | [Market Research Future, 2026](https://www.marketresearchfuture.com/reports/medical-scheduling-software-market-33115) |
| Clinic universe | 89,146 clinics (79,210 private + 9,936 specialized) | Clinics licensed by the Ministry of Health and Population, Egypt, June 2026 | [El Watan, 2026](https://www.elwatannews.com/news/details/8298605) |
| Addressable and SAM clinics | 15,601 (Egypt); 4,368 (Greater Cairo) | Small dental, dermatology, and pediatric clinics, 2026, derived below | This chunk |
| Population | Cairo 10.5M, Giza 9.9M, Egypt 109.54M (launch footprint 18.6%) | Domestic population, CAPMAS, September 2026 | [EgyptToday, 2026](https://www.egypttoday.com/Article/1/149579/Egypt%E2%80%99s-domestic-population-reaches-109-5-Million-CAPMAS) |
| WhatsApp utility rate | USD 0.0036 = EGP 0.19 per delivered message (EGP 0.21 with 14% VAT) | Meta rate for Egyptian recipients, 2026 | [ChatMaxima, 2026](https://chatmaxima.com/whatsapp-api-pricing/egypt/); [ArabyBot, 2026](https://arabybot.com/guides/whatsapp-api-pricing-egypt?lang=en) |
| Vezeeta scale | 27,762 network doctors and 9,446 private clinics (all six markets, 2024); 18,525 doctors listed in Egypt (2026) | Vezeeta network and Egypt listings | [Team Fund Health, 2025](https://teamfundhealth.org/uploads/final-2025-09-17-2024-vezeeta-impact-spotlight.pdf); [Vezeeta](https://www.vezeeta.com/en/doctor/all-specialities/egypt) |
| Inflation | 14.5% | Urban headline CPI, Egypt, August 2026 | [EnterpriseAM citing CAPMAS, 2026](https://enterpriseam.com/egypt/2026/09/13/urban-inflation-unexpectedly-slowed-to-14-5-in-august/) |

## 1. Top-down (from the relevant industry software market)

| Item | Value | Notes / source |
|---|---|---|
| Global market (current year) | USD 535.1M (EGP 27.86B) | Global medical scheduling software, 2026, CAGR 12.9% to 2035 ([Market Research Future, 2026](https://www.marketresearchfuture.com/reports/medical-scheduling-software-market-33115)). Cross-checks: USD 496.19M in 2026, CAGR 11.92% ([Mordor Intelligence, 2026](https://www.mordorintelligence.com/industry-reports/medical-scheduling-software-market)); USD 386.7M in 2024, CAGR 13.8% ([MarketsandMarkets](https://www.marketsandmarkets.com/Market-Reports/appointment-scheduling-market-260824796.html)). Dedicated "reminder software" reports disagree and were not used. |
| Region share of market | 0.3735% (= Middle East and Africa 3.8% x Egypt 9.83% of MEA) | MEA share of medical scheduling software 3.8%, 2025 (Market Research Future, same report). Egypt share of MEA is a proxy from healthcare IT: USD 1.38B / USD 14.04B = 9.83%, 2025 ([Reports Insights, Egypt](https://www.reportsinsights.com/quants/research/healthcare-it-market/egypt); [Reports Insights, MEA](https://www.reportsinsights.com/quants/research/healthcare-it-market/middle-east-africa)); no publisher gives an Egypt share for scheduling software. |
| Regional market (TAM, all segments) | USD 2.00M (EGP 104.0M) | = Global x region share = 535.1 x 0.3735%. Egypt medical scheduling software, all end users, 2026; assumes the 2025 shares hold in 2026. |
| % relevant to the target segment | 7.25% | Assumption: clinics' share of end users 20.72% (USD 98.2M of USD 474.0M in 2025, Market Research Future) x 35% of clinics in the three target specialties (bottom-up basis below). |
| Serviceable TAM (segment, region) | USD 144.9K (EGP 7.54M) | = USD 2.00M x 7.25%. Egypt, small private dental, dermatology, and pediatric clinics, 2026. |

## 2. Bottom-up (from addressable customer count)

| Item | Value | Notes / source |
|---|---|---|
| Total addressable customers (universe) | 89,146 clinics | 79,210 private + 9,936 specialized clinics licensed by the Ministry of Health and Population, Egypt, June 2026 ([El Watan, 2026](https://www.elwatannews.com/news/details/8298605)); a private clinic has one physician or dentist ([Law 51/1981](https://lawhub.info/eg/?p=11668)). Cairo governorate alone: 9,774 private clinics + 2,289 dental clinics, 2024 ([El Watan, 2024](https://www.elwatannews.com/news/details/7198084)). [NEEDS CLARIFICATION: How many licensed private and specialized clinics are in Giza governorate?] |
| % addressable (right size / need) | 17.5% | Assumption: 35% specialty fit x 50% with need and budget. Specialty fit: dental clinics are 19.0% to 23.4% of Cairo's private clinics (2024), and pediatrics plus dermatology are 26.5% of Vezeeta's 8,562 Cairo-listed doctors ((1,823 + 445) / 8,562, 2026, [Vezeeta](https://www.vezeeta.com/en/doctor/all-specialities/cairo)), about 45% together, cut to 35% because booking-platform listings over-represent bookable specialties. Need and budget: 50% judgment midpoint for a "highly fragmented" sector ([IFC and World Bank, 2023](https://www.ifc.org/content/dam/ifc/doc/2023/egypt-private-sector-diagnostic-health-sector-deep-dive.pdf)). |
| Addressable customers | 15,601 clinics | = universe x addressable % = 89,146 x 17.5% |
| Annual software spend per customer (ARPU, in currency) | EGP 7,800 a year (EGP 650 a month; USD 149.8) | Anchored on the closest comparable, Tabbaba's WhatsApp Bot Basic plan at EGP 649 a month for up to 2 doctors ([Tabbaba pricing, 2026](https://tabbaba.com/pricing/)); Egyptian list prices for comparable tools run from EGP 299 a month ([Tabib Mate](https://www.tabibmate.com/)) to EGP 3,999 a month (iClinicOS Enterprise, see [06-market-comparison.md](06-market-comparison.md)). Excludes setup fees and message pass-through. |
| Bottom-up TAM | EGP 121.69M (USD 2.34M) | = addressable customers x ARPU = 15,601 x EGP 7,800 |

## 3. TAM / SAM / SOM summary

| Item | Value | Basis |
|---|---|---|
| TAM | EGP 64.62M (USD 1.24M) | Average of top-down and bottom-up: (7.54 + 121.69) / 2. The two methods differ about 16x: industry reports tie MEA demand to hospital projects and likely under-count Egypt's single-doctor clinics, while the bottom-up uses list prices before discounts and churn. |
| SAM % | 28% | % of TAM in launch footprint. Midpoint of two sourced bounds: Cairo + Giza share of Egypt's population, 18.6% (canonical figures above), and their share of registered dentists, 37% (about 40,000 of 108,000, [Youm7, 2025](https://www.youm7.com/story/2025/3/23/%D9%86%D9%82%D8%A7%D8%A8%D8%A9-%D8%A3%D8%B7%D8%A8%D8%A7%D8%A1-%D8%A7%D9%84%D8%A3%D8%B3%D9%86%D8%A7%D9%86-%D8%AA%D8%AD%D8%B0%D8%B1-%D8%B2%D9%8A%D8%A7%D8%AF%D8%A9-%D8%A3%D8%B9%D8%AF%D8%A7%D8%AF-%D8%A7%D9%84%D8%AE%D8%B1%D9%8A%D8%AC%D9%8A%D9%86-%D8%AA%D9%87%D8%AF%D8%AF-%D9%85%D8%B3%D8%AA%D9%82%D8%A8%D9%84-%D8%A7%D9%84%D9%85%D9%87%D9%86%D8%A9/6928558)): (18.6% + 37%) / 2 = 27.8%, rounded. |
| SAM value | EGP 18.09M (USD 0.35M) | = TAM x SAM % = 64.62 x 28%. Bottom-up only: 4,368 clinics (15,601 x 28%) x EGP 7,800 = EGP 34.07M. |
| SOM % | 5% | % of SAM captured early (year 1 to 3). Capacity-based assumption: 5% of 4,368 SAM clinics = 218 clinics, about 6 net new paying clinics a month for 36 months under founder-led sales; sensitivity range 3% to 10%. For scale, MEDOC, an established Giza-based clinic-software vendor, claims 1,500+ clients ([MEDOC, 2026](https://medoc.care/ar/solution/clinic-management-system)). |
| SOM value | EGP 0.90M a year (USD 17.4K) | = SAM x SOM % = 18.09 x 5%, by 2029-09-30; about 116 clinics at EGP 7,800. Bottom-up path: 218 clinics x EGP 7,800 = EGP 1.70M. |

## Tools and sources

Google Trends and Keyword Planner (search volume); Crunchbase and PitchBook (competitor funding, signals potential); Statista, Gartner, IBISWorld, local chambers of commerce; surveys and interviews with real users. Governmental statistics portals are valid sources where available.
