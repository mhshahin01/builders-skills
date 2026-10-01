<!--
PRE-BRD CHUNK: 16
TITLE: BCG Matrix
TIER: Tier 4: Strategy and Planning
PROJECT: Clinic Reminders
PART OF: PRE-BRD - Clinic Reminders
-->

# BCG Matrix

A product evaluation tool (Boston Consulting Group Matrix). The matrix has four quadrants based on high or low market growth and high or low market share.

## Quadrants

- High market growth: Stars (high share), Question Marks (low share).
- Low market growth: Cash Cows (high share), Dogs (low share).
- Best evaluation is Star; worst is Dog.

## Calculation rules

- Market Growth Rate (%) = ((current year market size - last year market size) / last year market size) x 100. More than 10% is high; less than 10% is low.
- Relative Market Share = your market share / market leader's share. A value from 0.1 to 1 is low; 1 to 10 is high.

Add one row per product or company being positioned. For each, list the competitor shares used to derive relative market share.

| Product / company | Market growth rate (%) | Your share vs competitor (%) | Relative market share (yours / leader) | Quadrant (Star, Question Mark, Cash Cow, Dog) | Comments |
|---|---|---|---|---|---|
| Clinic Reminders (end of year one, target) | 12.9% = ((535.1 - 474.0) / 474.0) x 100, global medical scheduling software 2025 to 2026 (canonical figures in [07-market-sizing-analysis.md](07-market-sizing-analysis.md)), used as the growth proxy for Egypt: high | Share proxy by clinic customers: 40 target clinics ([15-okrs.md](15-okrs.md)) vs the leader Vezeeta's 9,446 network clinics (all markets, 2024) | 0.004 = 40 / 9,446: low | Question Mark | High growth, negligible share; the pilot and the seed must prove share can be won. [NEEDS CLARIFICATION: Egypt-only market shares for clinic reminder and scheduling software are not published; all shares in this table are clinic-count proxies across mixed geographies.] |
| Vezeeta | 12.9%: high | Leader by clinic count: 9,446 network clinics (all six markets, 2024) vs the next largest, TabeebPlus, at 1,200+ | 7.87 = 9,446 / 1,200 (leader measured against the next largest): high | Star | Marketplace scale, but SMS-only reminders without reply handling ([06-market-comparison.md](06-market-comparison.md)). |
| TabeebPlus | 12.9%: high | 1,200+ active clinics in 9+ Arab countries (vendor claim, 2026) vs 9,446 | 0.13 = 1,200 / 9,446: low | Question Mark | Closest feature overlap (WhatsApp buttons) at the lowest listed price (06). |
| PDental | 12.9%: high | 500+ clinics in 5+ countries (vendor claim, 2026) vs 9,446 | 0.05 = 500 / 9,446: low | Question Mark | Dental only; WhatsApp and SMS but no automatic fallback (06). |
| iClinicOS | 12.9%: high | 200+ clinics in Egypt (vendor claim, 2026; the same site also says 500+) vs 9,446 | 0.02 = 200 / 9,446: low | Question Mark | AI WhatsApp receptionist, WhatsApp only (06). |
