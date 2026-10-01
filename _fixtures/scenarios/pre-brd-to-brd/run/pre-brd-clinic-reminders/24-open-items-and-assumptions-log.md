<!--
PRE-BRD CHUNK: 24
TITLE: Open Items & Assumptions Log
TIER: Review Output
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
PURPOSE: Output of the post-generation cleared-context reviewer pass (runs LAST, after the investor pass, reviewing chunks 01-23). Captures unsourced or shaky figures, competitor coverage gaps, cross-chunk figure inconsistencies, cross-tier incoherence, and weak go/no-go logic. Every item carries a Recommended Answer AND the Why behind it. Also logs the assumptions the authoring pass made, each with its basis and the risk if wrong.
GENERATED_BY: pre-brd-unifier post-generation reviewer (cleared-context subagent). The reviewer authors this chunk only - it never edits chunks 01-23.
-->

# Open Items & Assumptions Log

> **What this section is.** A structured backlog of concerns identified after the pre-BRD was filled, by a reviewer running with cleared context, plus the log of assumptions the analysis rests on. Each open item comes with a **Recommended Answer** and its **Why**, so the decision-maker always has a reasoned default in hand.
>
> **What this section is not.** It is not a list of inline `[NEEDS CLARIFICATION: ...]` markers - those remain inline in the framework chunks. This section is the reviewer's *external* findings.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Framework chunk(s), e.g., "07 Market Sizing" or "22 ↔ 23" or "global". |
| **Type** | Unsourced figure / Figure inconsistency / Coverage gap / Cross-tier incoherence / Weak verdict logic / Ambiguity / Risk. |
| **Concern** | One paragraph. What is shaky or missing, and why it matters for the go/no-go decision. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | REQUIRED. The reviewer's concrete proposed resolution, ready to apply to the framework chunk(s) (the exact figure + source, row, or wording that would close the item). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives - the evidence behind it (source quality, cross-check result, framework logic) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: A robust No-Go sits on top of a plan that starts the full build on 2026-10-01

- **Where:** 22 ↔ 23 ↔ 02, 15, 17, 20, 21 (Tier 3 and Tier 4 plan)
- **Type:** Cross-tier incoherence
- **Concern:** 22 (2.31 of 5) and 23 (2.85 of 10) both return a robust No-Go, yet 02, 15, 20, and 21 start the four-month build on 2026-10-01, the day after this document, with no decision gate and no local evidence, and 17 commits to market penetration in Greater Cairo for years one and two while 22's first condition asks for a sized wider market before commitment. 23's path back to Go is circular: its conditions need pilot results from 15 clinics, which exist only after the build the verdict rejects. No chunk states what the founders should do next, which is the decision this document exists to support.
- **Options:**
  - **A.** Insert a low-cost validation gate before the build and make the build conditional on it - tests the verdict's top reasons first, at the cost of moving the MVP by up to two months.
  - **B.** Keep the plan and relabel 21 as "plan if the verdict is overturned" - no delay, but the deliverable still recommends No-Go while scheduling a Go.
  - **C.** Reframe as a bootstrapped side business with part-time founders - sidesteps the venture test, but the 342-clinic break-even in 23 still exceeds the 116 to 218-clinic SOM.
- **Recommended Answer:** Option A. Add a first row to 21's roadmap and a row 0 to 22's Conditions: "Validation gate, 2026-10-01 to 2026-11-30, budget at most EGP 100,000: (1) aggregate no-show counts from the appointment books of at least 20 timed-slot dental clinics in Cairo and Giza; (2) 25 owner interviews with a priced offer; (3) a 4-week concierge test in 3 to 5 clinics in which the clinic's own receptionist sends scripted WhatsApp reminders and waitlist offers, recording reply and refill rates; (4) a sized multi-specialty or multi-country SAM for condition 1. Build only if the median baseline no-show rate is at least 14.2% (the primary-care median in 10, O1) and at least 10 owners sign a letter of intent at the EGP 549 Starter price." Set the Q4-2026 build row's status to "Blocked until the gate passes".
- **Why:** The verdict's top reasons (market ceiling, unvalidated demand and price) can be tested in weeks from clinic records and interviews, and the concierge test keeps patient data inside the clinic, so it needs no PDPC licence. The tradeoff is a later MVP, which also moves the pilot past Ramadan (OI-07).
- **Status:** Open

---

### OI-02: SAM and SOM are stated in two incompatible units

- **Where:** 07 Market Sizing (canonical figures, SAM, SOM) → 17, 20, 22, 23
- **Type:** Figure inconsistency
- **Concern:** The canonical table gives "SAM clinics 4,368", but the canonical SAM value, EGP 18.09M, equals about 2,320 clinic-equivalents at the canonical EGP 7,800 ARPU (and TAM EGP 64.62M about 8,284, not 15,601). The SOM % is justified as "5% of 4,368 SAM clinics = 218 clinics, about 6 net new a month", while the SOM value is 5% of EGP 18.09M = EGP 0.90M = 116 clinics. 20 then plans growth to 116 clinics, 22 scores on EGP 0.90M, and 23 quotes "116 to 218". The verdict's headline deal-breaker carries two values for one pool, a defect under the reconciliation rule.
- **Options:**
  - **A.** Keep the formula-mandated average (frameworks.md) and restate every count as clinic-equivalents of it, showing the bottom-up 218 clinics only as a labelled upper bound - template-compliant, smaller headline.
  - **B.** Make the bottom-up chain canonical (TAM EGP 121.69M, SAM EGP 34.07M, SOM EGP 1.70M, 218 clinics) - consistent units, but breaks the averaging rule and rests on list price at 100% adoption.
  - **C.** Carry the range EGP 0.90M to 1.70M everywhere - transparent, but no single canonical value.
- **Recommended Answer:** Option A. In 07, change the canonical row to "Addressable and SAM clinics: 15,601 and 4,368 (bottom-up counts); the blended TAM and SAM equal about 8,284 and 2,320 clinic-equivalents at EGP 7,800", and the SOM % basis to "5% of SAM = 116 clinics by 2029-09-30: 40 in year one (15) plus about 3.2 net new a month for 24 months; upper bound 218 clinics (bottom-up path)". Add to 22's Result: "With the bottom-up SOM (EGP 1.70M, 0.85x) Market Attractiveness is 2.5 and the composite 2.51, still No-Go."
- **Why:** Only Option A satisfies both the averaging rule and the one-canonical-value rule, and the verdict is the same under either SOM (2.31 or 2.51), so the larger number buys nothing but a weaker basis. The tradeoff is a smaller headline SOM.
- **Status:** Open

---

### OI-03: The problem and the waitlist assume timed slots, but many target clinics may admit patients in arrival order

- **Where:** 01 Problem Statement, 03 Problem, 07 % addressable, 13 waitlist reach, 21 beachhead
- **Type:** Risk
- **Concern:** The economic case ("an empty slot in a private clinic is lost cash", 01) and waitlist refill both assume each patient holds a timed slot. Many Egyptian private clinics book patients into a session and admit them in arrival order: the deliverable itself shows queue-number booking (Dentolize's bot "confirms with a queue number", 06), and in the reviewer's observation Vezeeta's Egyptian profiles distinguish fixed-time from first-come entry (not verified in this pass; Vezeeta returned HTTP 403). In an arrival-order session a no-show shortens the queue rather than idling the doctor, and there is no slot to refill. The 35% specialty fit (07) counts pediatrics and dermatology, where session entry appears most common, so problem size, SAM, and waitlist reach may all be overstated.
- **Options:**
  - **A.** Make admission mode a qualifying criterion: size and sell only to timed-slot clinics, dental first, and measure the share in discovery - smaller SAM, sharper segment.
  - **B.** Keep the segment and add a queue-mode feature ("your turn is near") - wider fit, but new scope with unproven value.
- **Recommended Answer:** Option A. Add to 07's % addressable row: "x share of clinics that book timed slots [NEEDS CLARIFICATION: What share of 1 to 5 doctor dental, dermatology, and pediatric clinics in Cairo and Giza book timed slots rather than arrival-order sessions? Measure it in the validation gate (OI-01).]"; add "books timed slots" to the qualified-lead definition in 21's funnel; extend 08 Social, point (3), to "measure the admission mode alongside the walk-in share".
- **Why:** The dental beachhead in 21 already leans to timed, multi-visit appointments, so A costs little and protects the core ROI claim, while B adds build effort before the premise is checked. The tradeoff is a SAM that will likely shrink, which reinforces rather than changes the No-Go.
- **Status:** Open

---

### OI-04: Both sizing chains rest on weak proxies, and the clinic universe may exclude dental clinics

- **Where:** 07 Market Sizing (top-down rows, universe row) → 09, 22, 23
- **Type:** Unsourced figure
- **Concern:** The top-down chain applies a healthcare-IT country share (Egypt 9.83% of MEA, Reports Insights) to one publisher's 2025 MEA share (3.8%) of the highest of three global estimates, giving EGP 104.0M for all Egyptian end users; half of Vezeeta's 18,525 Egypt-listed doctors at its 2022 entry package would alone pay about that (18,525 x 50% x EGP 899 x 12 = EGP 99.9M; marketplace fees, so indicative only), which suggests the chain under-counts. The bottom-up chain assumes list price at 100% adoption. The two differ 16x and the average leans on the bottom-up. Separately, the universe (79,210 private + 9,936 specialized clinics, El Watan 2026) has no dental category (reviewer check of the source, 2026-09-30), while El Watan 2024 counts Cairo's 2,289 dental clinics separately from its 9,774 private clinics, so the dental beachhead may sit outside the universe used in 07, 09, and 23.
- **Options:**
  - **A.** Keep both chains under the averaging rule, label the top-down a floor and the bottom-up a ceiling, and add the cross-check and a dental-scope marker - honest bounds, no new research.
  - **B.** Replace the top-down with an installed-base estimate from vendor clinic counts and prices - closer to observed spend, but built on self-reported vendor claims.
- **Recommended Answer:** Option A. In 07 section 1, append to the Regional market row: "Floor estimate: the Egypt share is a healthcare-IT proxy; half of Vezeeta's 18,525 Egypt-listed doctors at the 2022 entry package (EGP 899 a month) would alone pay about EGP 99.9M a year." In section 2, append to the universe row: "El Watan 2026 lists no dental category and El Watan 2024 counts Cairo's dental clinics separately, so dental clinics may be outside 89,146. [NEEDS CLARIFICATION: How many dental clinics does the Ministry of Health and Population license nationally and in Cairo and Giza (2026), and are they inside the 79,210 private clinics?]"
- **Why:** No better published Egypt figure exists, so labelled bounds are the defensible move, and the dental question decides whether the beachhead is in the sized pool at all. Fixing it can only move 23's USD 13.4M ceiling modestly, so the verdict holds; the tradeoff is a wider stated range.
- **Status:** Open

---

### OI-05: The PDPC licence gates the pilot with about a month of slack, and per-clinic licensing is unresolved

- **Where:** 02 G4, 08 Legal, 10 T2, 11 W2, 15 O1 KR4, 21 Q4-2026 and Q1-2027, 22 condition 5
- **Type:** Risk
- **Concern:** 02 requires the PDPC licence before the first patient message on 2027-02-01, but 15 only targets filing by 2026-12-31, leaving about one month for a grant whose processing time and portal status are unknown (08), after a regularization period that ends 2026-11-01. 10 T2 and 11 W2 call fees "small at pilot volumes", yet 08 records conflicting exemption thresholds (100,000 records per GLA, 10,000 per Legal500), and 15 pilot clinics can pass 10,000 patient records. Most material: whether each small clinic needs its own controller licence is open (08); if yes, every sale waits on the customer's own licensing, a go-to-market blocker no chunk prices in.
- **Options:**
  - **A.** Engage counsel in October 2026 for a written opinion by 2026-11-15 on role, per-clinic licensing, and fee tier; target a granted licence and plan on the conservative 10,000-record reading - earlier legal spend, largest legal unknown removed before the build.
  - **B.** Keep the filing target and accept a possible pilot slip - no early cost, but the pilot date rests on an unknown lead time.
- **Recommended Answer:** Option A. Change 15 O1 KR4 to "PDPC licence granted and a DPO registered by 2027-01-15"; add to 08 Legal (1): "Planning basis until counsel confirms: Clinic Reminders is a processor; each clinic is a controller that may need its own licence or permit; fee exemption taken at 10,000 records"; extend 22 condition 5 with "and whether each clinic needs its own licence"; replace "fees are low at small record volumes" (10 T2) and "Licence fees are small at pilot volumes" (11 W2) with "fee tier open (08)".
- **Why:** A per-clinic licence would change the sales motion for every customer, so it must be known before money goes into the build, and planning on the lower of two conflicting secondary sources avoids a favourable-case bias. The tradeoff is legal spend from a thin residual budget (OI-06).
- **Status:** Open

---

### OI-06: The year-one budget has no line items, no runway buffer, and an unconfirmed funding source

- **Where:** 02 G3, 03 Cost Structure, 11 W3, 15 O4, 21 Q3-2027
- **Type:** Risk
- **Concern:** 03 leaves one residual (EGP 792,739 at median pay, EGP 210,619 at five-year pay) for messaging, DPO, counsel, PDPC fees, incorporation, marketing, and contingency, none itemized; whether the EGP 2,000,000 is secured and whether founders draw salary are open (11 W3); salary benchmarks are 2025 figures with no indexation (14.5% inflation adds about EGP 104,400 for the three developers at median). The seed raise is set for 2027-09-30 (02, 21), the day the budget ends, so any slip in a market where Egyptian startup funding fell 11% in H1 2026 (09) leaves no runway. Counting the roadmap's six-month sales hire (EGP 162,764), 21's EGP 100,000 marketing line, and a three-month reserve of EGP 300,000 (post-hire burn about EGP 100,605 a month), median pay leaves EGP 555,502 for messaging and all compliance, and five-year pay leaves minus EGP 26,618.
- **Options:**
  - **A.** Itemize the residual with quotes, state founder pay, hold a three-month reserve, and start the seed process at the pilot readout - realistic, smaller spend envelope.
  - **B.** Assume unpaid founders in year one - frees about EGP 833K, but investors will add market salaries back.
- **Recommended Answer:** Option A. Add a line-item table to 03: three developers at median pay EGP 832,725 (state the founder-pay basis); sales hire for six months EGP 162,764; hosting EGP 49,009; marketing EGP 100,000 (21); reserve EGP 300,000; quoted lines for DPO, counsel, PDPC fees, incorporation, and messaging totalling no more than EGP 555,502. State whether the EGP 2,000,000 is committed. In 02 G3 and 21 Q3-2027, start the seed process on 2027-04-01 and target close by 2027-09-30.
- **Why:** The recomputation shows the plan closes only at median pay once a reserve and the marketing line are counted, turning an implicit assumption into a visible constraint; starting the raise at the pilot readout gives six months of runway for the round instead of none. The tradeoff is less discretionary spend.
- **Status:** Open

---

### OI-07: The pilot's before-after design overlaps Ramadan and has no control group

- **Where:** 15 O2 (KR2, KR3), 21 Q1-2027, 02 G2; the evidence 22 condition 4 and 23 condition (2) depend on
- **Type:** Risk
- **Concern:** 15 measures each clinic's no-show change against a four-week baseline recorded before go-live (January 2027), with the pilot running 2027-02-01 to 2027-03-31. Ramadan 1448 is expected around 2027-02-08 to 2027-03-09, with Eid al-Fitr around 2027-03-10 (tabular calendar; moon sighting may shift a day), when clinic hours and attendance change, so the before-after result will mix the reminder effect with the season. KR3 (at least 25% relative reduction) is the proof 22 and 23 require for any future Go, so a confounded design can yield a false Go or a false No-Go. Copying baselines from appointment books may also mean processing patient data before the licence (OI-05).
- **Options:**
  - **A.** Concurrent control: within each clinic, a random half of appointments gets reminders throughout the pilot, and any baseline is kept as aggregate daily counts - removes the seasonal confound and keeps the dates.
  - **B.** Move the pilot after Eid (2027-03-15 to 2027-05-14) - cleaner season, but paid launch slips about six weeks and the comparison still spans different months.
- **Recommended Answer:** Option A. Replace 15 O2 KR2 and KR3 with: "KR2: within each pilot clinic, a random half of appointments receives reminders for the whole pilot; any pre-go-live baseline is recorded only as aggregate daily counts with no patient identifiers. KR3: the no-show rate in the reminder arm is at least 25% lower than in the no-reminder arm." Mirror the wording in 21 Q1-2027.
- **Why:** A concurrent control is the only design in which Ramadan, Eid, and clinic differences hit both arms equally, it costs no calendar time, and aggregate counts keep identifiers out of the baseline. The tradeoff is that half the pilot appointments get no reminder, which pilot clinics must accept in writing.
- **Status:** Open

---

### OI-08: The competitor scan omits the products the deliverable itself uses as price anchors

- **Where:** 06 Market Comparison ↔ 07, 09, 10, 21 (claims in 01, 03, 18, 19)
- **Type:** Coverage gap
- **Concern:** 06 compares five products, but other chunks cite seven more Egyptian or regional rivals: Tabbaba (07's ARPU anchor and 21's price benchmark), Tabib Mate (EGP 299, 07), MEDOC (1,500+ clients, 07), ClinicGateway, SofClinic, SYNAX, and MD System with free WhatsApp integration (09). "None offers waitlist auto-fill or SMS fallback" (01, 03, 19, 21) and VRIO "Rare = Yes" (18) are tested against five of at least twelve products. Tabbaba is cited at EGP 649 (07, 21) and EGP 799 (09, 10) without labels; a reviewer check of its pricing page (2026-09-30) shows both prices are real but belong to different product lines. 21 also cites 06 for Tabbaba's 14-day trial, although Tabbaba is not in 06.
- **Options:**
  - **A.** Add the omitted products as section-1 rows (variable rows) and note their marks for the two differentiators, keeping the five-column matrix - template-compliant, closes the claim gap.
  - **B.** Swap Tabbaba into the five-column matrix for the least relevant product - one matrix, but drops a rival that matters to the dental beachhead.
- **Recommended Answer:** Option A. Add a section-1 row for Tabbaba: "WhatsApp Bot Basic EGP 649 a month (up to 2 doctors), Bot Smart AI EGP 1,199 (up to 5); clinic management Starter EGP 799 (1 doctor), Clinic EGP 1,599 (up to 3), Pro EGP 3,299 (up to 8); every WhatsApp message included ('no other bill'); 14-day trial; annual billed at 10 months; setup EGP 2,500, waived for the first 10 clinics; no SMS or waitlist shown on its pricing pages ([Tabbaba pricing](https://tabbaba.com/pricing/), checked 2026-09-30)". Add MEDOC and MD System rows with "[NEEDS CLARIFICATION: waitlist auto-fill and automatic SMS fallback, verify in a demo]". Label Tabbaba prices by product line in 07, 09, 10, and 21, and point 21's trial citation to the new 06 row. Keep "none of the five" wording until the demos are done.
- **Why:** The closest substitute in function and price (a WhatsApp booking bot with reminders and all messages included, EGP 100 above the planned Starter) is missing from the matrix the moat claims rest on; the template allows extra rows and the Tabbaba facts are verified. The tradeoff is two open markers until demos.
- **Status:** Open

---

### OI-09: Gross margin and churn behind LTV:CAC are assumptions, and the cost side omits charged replies, offers, and hosting

- **Where:** 21 Pricing (top-up row) and Acquisition funnel & CAC; 03 Cost Structure; 10 T1; 23 aspect 4
- **Type:** Unsourced figure
- **Concern:** LTV EGP 16,250, LTV:CAC 2.5:1, and the 13.5-month payback rest on an assumed 75% gross margin and 3% monthly churn (21). Meta's own pricing page (reviewer check, 2026-09-30) confirms that service messages and in-window utility replies are charged from 2026-10-01 at the utility rate and shows no free monthly allowance; the 1,000-message allowance in 03 and 10 comes only from 360dialog and Wati. Yet 21's top-up rationale prices the reminder alone (EGP 21 per 100) against a reply-inclusive EGP 42.75 per 100 with VAT; waitlist offers are uncosted (EGP 0.21 each as utility, EGP 3.82 as marketing, with VAT); and hosting is EGP 102 per clinic a month at 40 clinics. A Starter clinic using its 600 reminders costs EGP 112 to 225 in WhatsApp plus EGP 102 hosting against EGP 549, a 40% to 61% year-one gross margin. At 55%, LTV:CAC is 1.8:1 and payback 18.4 months, failing 21's 14-month KPI.
- **Options:**
  - **A.** Build gross margin bottom-up per clinic, restate LTV, LTV:CAC, and payback at year-one and at-scale margins, and reprice top-ups on the reply-inclusive cost - harder numbers, weaker ratio.
  - **B.** Keep 75% labelled as an at-scale target - simpler, but year-one economics stay unstated.
- **Recommended Answer:** Option A. In 21, replace the LTV line with a COGS build: WhatsApp EGP 0.19 to 0.375 per appointment before VAT (03), waitlist offers at the utility rate, hosting EGP 102 per clinic a month at 40 clinics and EGP 35 at 116; state a year-one gross margin of 40% to 61% (Starter, 600 appointments) and recompute LTV:CAC and payback (1.8:1 and 18.4 months at 55%). Raise the top-up to EGP 85 per 100 reminders (2x the reply-inclusive EGP 42.75 with VAT). In 03 and 10, replace "free within 1,000 service messages a month" with "allowance not shown on Meta's pricing page; plan at the reply-inclusive cost".
- **Why:** The primary source contradicts the free-allowance assumption, and the deliverable's own figures imply a margin well below 75% at year-one scale; stating it keeps 23's economics score honest. The tradeoff is a weaker LTV:CAC that points to a smaller included allowance or a higher price.
- **Status:** Open

---

### OI-10: The planning ARPU is a competitor anchor, and the tier mix that matches it has no basis

- **Where:** 07 ARPU row ↔ 03 Revenue Streams ↔ 15 O3 KR2 ↔ 21 Pricing
- **Type:** Figure inconsistency
- **Concern:** 07 sets ARPU at EGP 650 a month from Tabbaba's Bot Basic plan, and 21 reaches EGP 662 only through an assumed 75/25 Starter-to-Clinic mix. 07 itself notes that a private clinic has one physician (Law 51/1981), and private clinics are 79,210 of the 89,146-clinic universe (88.9%), which points to a Starter share near 90%: 0.9 x 549 + 0.1 x 999 = EGP 594 a month, before the two-months-free annual plan and referral credits. The same EGP 650 drives 15's MRR target (EGP 26,000) and 21's LTV.
- **Options:**
  - **A.** Keep EGP 650 as the labelled market price anchor for sizing in 07 and derive the company's planning ARPU in 21 from its own price list and a sourced mix (EGP 594) - two labelled figures with distinct jobs.
  - **B.** Keep EGP 650 everywhere and log the mix as an assumption - fewer edits, but revenue is overstated by about 9%.
- **Recommended Answer:** Option A. In 21, add: "Planning ARPU EGP 594 a month = 90% Starter (EGP 549) + 10% Clinic (EGP 999); mix from the 88.9% single-physician share of the universe (07), before annual and referral discounts"; use it in 15 O3 KR2 (MRR EGP 23,760 for 40 clinics) and in 21's LTV and payback (with OI-09). In 07, relabel the ARPU row "market price anchor (competitor list price)".
- **Why:** Market sizing should use what the market pays, while the revenue plan should use the company's own prices and a mix grounded in the clinic structure; the reconciliation rule allows two values when each carries its own scope label. The 9% gap does not move the verdict; the tradeoff is two ARPU figures to keep labelled.
- **Status:** Open

---

### OI-11: The headline differentiator is the least-evidenced Must-have

- **Where:** 01 UVP, 03 Unfair Advantage, 18 VRIO, 19 Differentiators, 21 Positioning ↔ 13 RICE, 14 MoSCoW, 15 O2 KR5
- **Type:** Cross-tier incoherence
- **Concern:** Automatic waitlist refill leads the UVP, positioning, and VRIO, yet 13 scores it the lowest Must (2.86, confidence 0.5) on an unsourced reach ("half of clinics keep a waitlist"); at 7 developer-weeks it is the second-largest Must, and 15 accepts a 20% refill rate as success. If pilot clinics keep no active waitlist, or run arrival-order sessions (OI-03), positioning falls back to parity (18: reminders with replies are parity). 13 also labels every reach "40 clinics per quarter", although 40 is the cumulative year-one target (15 O3), so RICE reduces to impact x confidence / effort.
- **Options:**
  - **A.** Keep waitlist refill in the MVP as a manual-assist version (the system proposes the next waitlisted patient; reception sends the offer in one click), add a keep-or-drop criterion, and lead the pitch with the evidenced mechanism until the pilot reads out - lower effort, honest positioning.
  - **B.** Demote waitlist refill to Should and reposition on SMS fallback and the weekly report - frees effort, but drops the most distinctive claim.
- **Recommended Answer:** Option A. In 14 Must (7), add "manual-assist for the pilot; automatic offers after the pilot if kept"; in 15 O2, add "KR6: at least half of pilot clinics keep an active waitlist; otherwise waitlist refill leaves the UVP"; in 01 UVP and 21 positioning, lead with "WhatsApp-first reminders with one-reply confirm or cancel and automatic SMS fallback" and list waitlist refill as "in pilot"; in 13, change every reach to "clinics by 2027-09-30 (year one)".
- **Why:** 13 and 18 already say the feature is unproven and copyable in 6 to 8 developer-weeks, so leading with it overstates the evidence; a manual-assist version tests demand at lower build cost and eases the schedule (OI-12). The tradeoff is a less striking pitch until pilot data exists.
- **Status:** Open

---

### OI-12: The MVP schedule assumes all founder time goes to coding

- **Where:** 13 RICE (effort), 15 O1 notes, 20 Development, 21 Q4-2026, 23 aspect 6
- **Type:** Risk
- **Concern:** 15 and 21 set 41.5 Must-have developer-weeks against about 52 available (three developers x 17.6 weeks from 2026-10-01 to 2027-01-31), 80% utilization at full-time coding, while the same three founders must incorporate, complete Meta verification and templates, register sender IDs on four networks, file with the PDPC and appoint a DPO, and recruit 15 pilot clinics in the same quarter (21), with no allowance for QA, security, or operations. The efforts are desk estimates from the research pass (06), not team estimates, and 23 accepted the capacity as stated. At 65% coding time a four-month window gives about 34 developer-weeks.
- **Options:**
  - **A.** Re-estimate with the team, plan at 65% coding time, and cut scope to fit: manual-assist waitlist (OI-11) and a template-only weekly report - keeps the window, thinner MVP.
  - **B.** Keep the full scope and extend the build by about six weeks - fuller MVP, later revenue and seed readout.
- **Recommended Answer:** Option A. In 15 O1 notes and 21's build row, replace "41.5 developer-weeks against about 52 available" with "[NEEDS CLARIFICATION: team re-estimate of each Must-have] against about 34 developer-weeks at 65% coding time in a four-month window; non-coding work: incorporation, Meta verification, sender IDs, PDPC and DPO, pilot recruitment"; reduce Must (7) to manual-assist and Must (8) to a template-only report for the MVP. Apply it to whichever build window follows the gate (OI-01).
- **Why:** The non-coding work lands in the same quarter on the same three people, so full-time coding is not credible; cutting the two least-evidenced Musts protects the evidenced core and the pilot date. The tradeoff is a thinner first release.
- **Status:** Open

---

### OI-13: Several Available / Not available marks in 06 are unsupported

- **Where:** 06 sections 2 and 3 → 18, 19, 23
- **Type:** Coverage gap
- **Concern:** Vezeeta is marked Not available for two-way confirm or cancel, yet the same row quotes a Vezeeta doctor saying patients "would confirm coming and then never show", and 09 says its doctor app sends confirmation messages; 19 positions against Vezeeta on "two-way replies" and 23 counts reply handling at three of five rivals on this mark. Dentolize is marked Not available for Arabic messages and UI on the evidence of an English-only iOS app, although it is an Egyptian vendor with a Saudi office running a WhatsApp booking bot. TabeebPlus is Not available for no-show analytics despite 19 reports, because none is named for no-shows. PDental's automatic SMS fallback is Not available only because it is "not stated". The uniqueness claims rest on absence of evidence.
- **Options:**
  - **A.** Re-verify the four marks in vendor demos and record the basis of every Not available mark - accurate, small effort.
  - **B.** Change only the mark contradicted by in-document evidence and leave the rest - fast, partial.
- **Recommended Answer:** Option A, with an interim edit: set Vezeeta's two-way confirm or cancel mark to Available (basis: the 2026-07-06 review quoted in the row and 09), change 23's "three of five" to "four of five" and 19's Vezeeta differentiator to "WhatsApp-first replies"; add under each feature table: "Not available = not shown on the vendor's public pages, checked 2026-09. [NEEDS CLARIFICATION: verify Dentolize Arabic, TabeebPlus no-show analytics, and PDental SMS fallback in a demo.]"
- **Why:** The Vezeeta mark is contradicted inside its own row, while the other three are unverified rather than shown wrong, so a basis note is the honest fix. The tradeoff is a slightly weaker differentiation story, which 23's moat score (2 of 10) already prices in.
- **Status:** Open

---

### OI-14: 22's market mapping measures cost coverage, and 23's return test compares a seed cheque with annual SAM

- **Where:** 22 Scoreboard and Result ↔ 23 aspects 1 and 7; 10 total row
- **Type:** Weak verdict logic
- **Concern:** 22 scores Market Attractiveness by comparing year-three SOM with the year-one budget, which tests self-funding viability rather than market size; its bands, the +0.5 growth bonus, and the Strategic Fit formula "3 + EFAS net + IFAS net" (a weighted-score difference added to a rating-scale difference) are author-defined, and the sensitivity check covers only one notch, not mapping choices. 23's return test ("a USD 1.0M seed is 2.9x the annual SAM") compares a one-time investment with a yearly revenue pool, which is not a return measure. Both conclusions survive, but neither shows it on a defensible basis. Also, 10's "Total 3.82" adds threat strength to opportunity strength, so it must not be read as a favourable score.
- **Options:**
  - **A.** Keep the scores, add a mapping-sensitivity line to 22, and restate 23's test as an ARR path - stronger logic, same verdict.
  - **B.** Redesign the 22 mappings - more rigorous, but changes a template-level method for no change in outcome.
- **Recommended Answer:** Option A. Add to 22's Result: "Mapping sensitivity: with the bottom-up SOM (score 2.5), problem / solution fit from O1 and O2 only ((0.64 + 0.56) / 0.30 = 4.00), and buyer power at 2 (Competitive Risk 1.4), the composite is 2.62, still No-Go." In 23, replace the seed-to-SAM ratio with: "An illustrative USD 1M ARR milestone needs about 6,674 clinics at EGP 7,800, 2.9x the SAM's 2,320 clinic-equivalents and 43% of Egypt's 15,601 addressable clinics." Add to 10's total row: "the total adds threat strength; read the net (+0.18), not 3.82".
- **Why:** The No-Go holds under the most favourable plausible mappings (2.62 of 5), which is stronger evidence than a one-notch test, and an ARR path is the question a seed investor actually asks. The tradeoff is a longer Result cell.
- **Status:** Open

---

### OI-15: The WhatsApp sender model is undecided but drives cost, limits, billing, and trust

- **Where:** 01 Technology, 06 WhatsApp channel (dependencies), 09 New Entrants, 10 T1, 11 S3, 21 Q4-2026
- **Type:** Ambiguity
- **Concern:** 06 lists a "sender-number decision" as a dependency, but no chunk decides whether reminders go from one Clinic Reminders number or from each clinic's own number (iClinicOS uses the clinic's own number, 06). The choice sets per-clinic versus one-time Meta verification; whether the 250-unique-users-a-day cap for unverified portfolios binds (11 S3: one shared number exceeds it once 15 pilot clinics each send more than about 17 reminders a day); onboarding throughput as a tech provider (10 businesses per 7 days before verification, 09); who pays Meta in USD and how that is rebilled in EGP; the sender name patients see; and the controller-processor split (08).
- **Options:**
  - **A.** Per-clinic numbers through Embedded Signup - the clinic's name is shown and per-clinic limits rarely bind, but each clinic needs a business portfolio and a USD billing path.
  - **B.** One shared verified number naming the clinic in each template - one verification and simple billing, but an unfamiliar sender and one shared quality rating for all clinics.
- **Recommended Answer:** Option A for the pilot, recorded as a decision: add to 01 Technology and to 21's Q4-2026 dependencies "[NEEDS CLARIFICATION: sender model, decided by 2026-10-31: per-clinic numbers through Embedded Signup (default) or one shared number; confirm how Meta's USD charges are billed and rebilled in EGP]".
- **Why:** Patients trust their clinic's own name, one clinic's quality rating cannot sink another's, and a 1 to 5 doctor clinic is unlikely to message 250 unique patients a day; iClinicOS shows the model works locally. The tradeoff is per-clinic onboarding work and an open billing path.
- **Status:** Open

---

### OI-16: Minor figure and citation inconsistencies

- **Where:** 01, 03, 07, 08, 16, 18, 21, 22
- **Type:** Figure inconsistency
- **Concern:** Small defects a diligence reader will notice: (1) 01 reads "no-shows 21% vs 15% ..., a 25% relative cut", but 21% to 15% is 28.6%; the 25% is the pooled RR 0.75 (10 O2). (2) 03 cites top-decile developer pay of EGP 45,112 with "sources in 11", but 11 gives no source for it. (3) 16 names TabeebPlus (1,200+) the next largest after Vezeeta although 07 cites MEDOC at 1,500+ clients, and Dentolize (06) has no BCG row. (4) 18 cites "Vezeeta's network reaches 9,446 clinics" without the scope "all six markets, 2024". (5) 21's Starter includes "SMS fallback at cost" while the top-up row prices SMS "at cost plus 20%". (6) 08 gives 82.7% internet penetration on DataReportal's population base while the canonical population is CAPMAS 109.54M (98.2M is 89.6% of it). (7) 22 lists the Giza clinic count as SAM's open input, but SAM % uses population and dentist shares, not clinic counts. (8) 07's canonical WhatsApp rate cites two vendor blogs while 08 cites Meta for the same rate.
- **Options:**
  - **A.** Apply the eight wording fixes now - minutes of editing, cleaner diligence.
  - **B.** Defer to the next revision - no effort now, defects carry into investor material.
- **Recommended Answer:** Option A: (1) 01: "RR 0.75, a 25% relative cut (pooled); crude rates 21% vs 15%"; (2) 03: cite the source of EGP 45,112 or drop the top-decile case; (3) 16: Vezeeta's relative share 6.30 = 9,446 / 1,500 (MEDOC), still Star, plus a Dentolize row with "[NEEDS CLARIFICATION: clinic count]"; (4) 18: add "(all six markets, 2024)"; (5) 21: one SMS rule, "at cost plus 20%", on all plans; (6) 08: "82.7% of DataReportal's population estimate"; (7) 22: replace the Giza note with "the two methods differ about 16x (07)"; (8) 07: cite Meta's rate card as the canonical source and keep the blogs as cross-checks.
- **Why:** Each fix is mechanical and sourced inside the deliverable; none changes a score, but left alone they erode trust in the numbers that do. The tradeoff is only editing time.
- **Status:** Open

---

<!-- Repeat the OI block for each open item. -->

---

## Assumptions Log

<!-- Every material assumption the authoring pass made while filling chunks 01-23. Each row: what was assumed, its basis, and the risk if it turns out wrong. The reviewer adds rows for implicit assumptions it uncovered. -->

| # | Assumption | Made in | Basis | Risk if wrong |
|---|------------|---------|-------|----------------|
| A-01 | TAM is scoped to Egypt rather than the template's global definition | 07, 23 | Labelled scope choice in 07 | A venture thesis needs the wider view 22 condition 1 asks for; the national scope caps the ceiling by design |
| A-02 | The clinic universe of 89,146 MoHP-licensed private and specialized clinics (June 2026) contains the target specialties | 07, 09, 23 | El Watan 2026 (no dental category in the source) | If dental clinics are counted separately, the dental beachhead is outside the sized pool (OI-04) |
| A-03 | Specialty fit 35% (dental, dermatology, pediatrics), cut from about 45% | 07 | Cairo 2024 dental share (19.0% to 23.4%) plus Vezeeta Cairo listing shares (26.5%), cut by judgment for listing bias | Each 10 points moves bottom-up TAM, SAM, and SOM by about 29%; verdict unchanged |
| A-04 | 50% of specialty-fit clinics have the need and budget | 07 | Judgment midpoint for a fragmented sector (IFC 2023) | Proportional swing in the bottom-up chain; no local willingness-to-pay data (10 T4) |
| A-05 | % relevant 7.25% = clinics' 20.72% of end-user spend x 35% specialty fit | 07 | MRFR 2025 end-user split; specialty fit reused from A-03 | Top-down Serviceable TAM moves proportionally |
| A-06 | Egypt is 9.83% of MEA scheduling-software spend, the 2025 MEA share (3.8%) holds in 2026, and the global market is the highest of three estimates (USD 535.1M) | 07, 16, 20, 22 | Healthcare-IT proxy (Reports Insights); MRFR 2025 and 2026 | Top-down may be off by an order of magnitude, the source of the 16x gap (OI-04) |
| A-07 | TAM = simple average of two estimates 16x apart | 07 | Template formula (frameworks.md) | SAM and SOM are order-of-magnitude only; drives the SOM unit conflict (OI-02) |
| A-08 | Market ARPU EGP 650 a month (EGP 7,800 a year), anchored on Tabbaba's Bot Basic plan | 03, 07, 15, 21, 23 | Tabbaba pricing 2026 (EGP 649, verified 2026-09-30) | Company ARPU is about EGP 594 at a 90/10 mix; SOM and LTV about 9% high (OI-10) |
| A-09 | 75/25 Starter-to-Clinic tier mix | 21 | Assumption fitted to the EGP 650 anchor | 88.9% of the universe are single-physician clinics (OI-10) |
| A-10 | SAM % 28% = midpoint of the population share (18.6%) and the dentist share (37%) | 07, 17 | CAPMAS 2026; Dental Syndicate via Youm7 2025 (37% stated; 40,000 derived) | The 18.6% to 37% range moves SAM by -34% to +32%; verdict unchanged |
| A-11 | SOM 5% of SAM by 2029-09-30 (sensitivity 3% to 10%) | 07, 17, 20, 22, 23 | Capacity judgment under founder-led sales | Even 10% gives EGP 1.81M a year, below the year-one cost base; verdict unchanged |
| A-12 | Exchange rate EGP 52.06 per USD, held flat for all conversions and USD costs | 03, 07, 08, 11, 21 | CBE official sell rate, 2026-09-30 | The 2026 range was 46.60 to 54.85; a devaluation step raises Meta and hosting costs while prices stay fixed in EGP |
| A-13 | WhatsApp utility rate USD 0.0036 per message, replies charged at the same rate from 2026-10-01, 1,000 free service messages a month | 03, 07, 08, 09, 10, 11, 21 | Rate from vendor blogs; charging confirmed on Meta's page; allowance only in 360dialog and Wati | Meta's page shows no allowance (reviewer check); quarterly repricing (10 T1); cost up to 2x the reminder-only figure (OI-09) |
| A-14 | Reminders, confirmations, and waitlist offers are approved as utility templates | 08, 11 S2, 14 | Meta template categorization guidance | Offers judged promotional bill at the marketing rate, USD 0.0644 (17.9x) |
| A-15 | Appointments per clinic about 600 a month for a Starter clinic, with an unsized SMS-fallback share | 03, 21 | Starter allowance in 21; both inputs open in 03 | Messaging COGS and gross margin are unsized (OI-09) |
| A-16 | Gross margin 75% | 21, 23 | Assumption | Year-one margin recomputes to 40% to 61%; LTV:CAC 1.8:1 at 55% (OI-09) |
| A-17 | Monthly logo churn 3% | 15, 21 | Target used as an estimate | At 5%, LTV falls 40% and LTV:CAC to 1.5:1 |
| A-18 | Funnel: 400 qualified leads, 40% demo, 50% trial, 50% paid (10% lead-to-paid) | 21 | Planning assumptions, no benchmark cited | At 5% lead-to-paid the year-one target halves to 20 clinics and CAC doubles |
| A-19 | CAC of EGP 6,569 excludes founder selling time | 21, 23 | Stated in 21 | CAC is understated through Q1-2027, when only founders sell |
| A-20 | Developer pay at the Cairo median (EGP 20,000 a month, 2025) with no indexation; sales hire at EGP 23,996; social insurance 18.75% on a EGP 16,700 cap | 03, 11 | Glassdoor 2025; Paylab 2026; Mondaq 2026 | Indexing for 14.5% inflation adds about EGP 104,400; five-year pay breaks the budget once a reserve is held (OI-06) |
| A-21 | Founders draw market salaries and the EGP 2,000,000 is available from 2026-10-01 | 02, 03, 11 W3 | Implied by the cost test; open in 11 | If not secured, the plan cannot start; if founders are unpaid, the cost test overstates spend |
| A-22 | Hosting USD 941.40 a year on an illustrative non-Egyptian cloud | 03, 11 S4 | DigitalOcean list prices | No costed in-country option (Huawei Cloud Cairo) if PDPL residency requires it |
| A-23 | Must-haves take 41.5 developer-weeks against about 52 available at full-time coding | 13, 15, 20, 21, 23 | Desk estimates from 06 | MVP slips past 2027-01-31 (OI-12) |
| A-24 | RICE reach: 40 clinics for every Must, 20 for waitlist refill ("half keep a waitlist") | 13 | Assumption; 40 is the cumulative year-one target, labelled per quarter | Ranking rests on impact, confidence, and effort alone; waitlist demand unknown (OI-11) |
| A-25 | The published reminder effect (RR 0.75) transfers to Greater Cairo private clinics | 01, 10 O2, 15 O2 | Global meta-analyses and trials | KR3 missed; 22's problem / solution fit (3.85) overstated |
| A-26 | Target clinics book timed slots (implicit, reviewer-uncovered) | 01, 03, 07, 13 | Not stated | In arrival-order sessions a no-show idles less doctor time and frees no slot to refill (OI-03) |
| A-27 | A January baseline is comparable with a February-March pilot (implicit, reviewer-uncovered) | 15 O2 | Not stated | Ramadan and Eid confound the before-after result (OI-07) |
| A-28 | The PDPC grants a licence within about a month of filing (implicit, reviewer-uncovered) | 02 G4, 15 O1, 21 | Not stated | The pilot start slips (OI-05) |
| A-29 | Clinic Reminders is a processor, clinics are controllers, and fees are small at pilot volumes | 08, 10 T2, 11 W2 | Counsel pending; conflicting thresholds (100,000 vs 10,000 records) | Controller status or per-clinic licences add cost and sales friction (OI-05) |
| A-30 | Developer-founders recruit 15 pilot clinics in Q4-2026 and sell until a Q2-2027 hire | 02, 15, 21 | Intake; no relationships named (11 W1) | Pilot and paid launch slip; CAC rises |
| A-31 | Beachhead: 1 to 5 dentist clinics in Cairo and Giza | 19, 21 | 37% dentist concentration, 19% to 23% dental share of Cairo's clinics, appointment-based treatment plans | Dental rivals (Dentolize, PDental) sell full suites; their users may not buy an add-on |
| A-32 | WhatsApp is the default channel for most patients | 08, 10 O3 | 2017 usage figure (75% of internet users) | A larger SMS share raises cost (EGP 0.14 to 1.00 a segment, two segments for long Arabic messages) |
| A-33 | Reception enters or imports appointments by hand (no integrations in the MVP) | 02, 14 | Scope choice | Double entry for clinics already on clinic software raises churn |
| A-34 | Global category growth of 12.9% (2025 to 2026) applies to Egypt | 16, 20, 22 | MRFR 2026 | Earns the +0.5 bonus in 22's Market Attractiveness; Egypt growth unknown |
| A-35 | All five Porter's forces are high (3) | 09, 22 | Sourced rationales; uniform scores | Buyer power at 2 gives Competitive Risk 1.4; composite still No-Go (OI-14) |
| A-36 | EFAS and IFAS weights and ratings, including S1 and S3 rated 4 without stated team experience | 10, 11, 22 | Research-pass judgment; inference from intake | Feasibility (2.52) and Strategic Fit (2.70) may be overstated |
| A-37 | 22 signal mappings: Market Attractiveness = SOM against the year-one budget with bands and a +0.5 growth bonus; Problem / Solution Fit = EFAS opportunity average; Feasibility = IFAS total; Strategic Fit = 3 + EFAS net + IFAS net | 22 | Author-defined rules on the skill's propagation map | Alternative mappings tested give 2.31 to 2.62; verdict unchanged (OI-14) |
| A-38 | Venture-return lens for the investor pass | 23 | Intake: a startup planning a seed round | A business-case lens weighs the ceiling less, but the 342-clinic break-even (23) still exceeds the SOM |
| A-39 | Clinics will pay EGP 549 to 999 a month despite 14.5% inflation | 10 T4, 21 | Competitor prices; no survey | Willingness to pay below the Starter price breaks the SOM and LTV |

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| None | - | - | No items resolved yet (as of 2026-09-30); OI-01 to OI-16 are Open. |

---

## Reviewer Notes

- Overall judgment: the No-Go in 22 (2.31 of 5) and 23 (2.85 of 10) is directionally sound and robust; it holds under the bottom-up SOM (2.51), under the most favourable plausible 22 mappings (2.62), and OI-03 and OI-09 push further toward No-Go. The weakness is what surrounds the verdict: a Go-shaped plan with no gate (OI-01), a SOM carried in two incompatible units (OI-02), and a pilot design that cannot produce clean evidence (OI-07).
- What I checked: recomputed every derived value (top-down and bottom-up chains, TAM 64.62M, SAM 18.09M, SOM 0.90M, EFAS 3.82 and net +0.18, IFAS 2.52, Porter's 3.0, all ten RICE scores and the 41.5-week Must total, BCG growth 12.9% and four relative shares, the Ansoff averages, CAC 6,569, LTV 16,250, payback 13.5 months, the 03 cost test and residuals, 22's 2.314, and 23's 2.85); all arithmetic is correct as written, so the defects are in inputs, units, and logic. I swept shared figures across chunks and spot-checked five cited sources on 2026-09-30: Tabbaba pricing (both prices real, different product lines), El Watan 2026 (no dental category), Youm7 (37% stated, 40,000 derived), Meta non-template pricing (charging from 2026-10-01 confirmed, no free allowance shown), and Vezeeta listings (HTTP 403, unverified).
- Template compliance: headings match the skeletons, no em dashes, LF line endings; guidance is intact apart from 07's Notes / source column, where source text replaced some guidance phrases (acceptable, since that column carries sources), and the 00 index paragraph rewritten for the project. Minor duplication: PDPL facts and the exchange-rate history are restated in 08, 10, 11, and 23 with different sources instead of cross-referencing 08.
- Skill-template note, not a deliverable defect: the chunk 23 skeleton's intro says the investor runs "after ... the reviewer pass is complete", which contradicts SKILL.md (investor first, reviewer last). Fix it in the skill, not here.
- Most important fix: OI-01. Insert the low-cost validation gate before committing the EGP 2,000,000 build, and pair it with OI-07's concurrent-control pilot so the next go/no-go rests on clean local evidence.

<!-- MASTER: 00-pre-brd-master.md | PREV: 23-investor-assessment.md | NEXT: none -->
