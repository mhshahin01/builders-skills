<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
PROJECT: Refunds Platform
VERSION: 1.4
DEPENDS_ON: 09
PART OF: SDD - Refunds Platform
-->

# 18. Performance & Capacity Planning

## 18.1 Load Estimates

| Dimension | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Refund requests | About 1,200 a month, about 40 a day | [NEEDS CLARIFICATION: growth of refund requests and members after year 1] | See Year 2 | Across 40 branches ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts), Fact 1); a day is a 30-day month's share |
| Refund requests at the seasonal peak | About 120 a day for about 3 weeks | See Year 2 | See Year 2 | Three times the normal number ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts), Fact 2) |
| Branch managers | 40, one per branch | See Year 2 | See Year 2 | A branch manager runs one branch ([REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors)) |
| Members and member purchases | [NEEDS CLARIFICATION: number of members and of member purchases a day; LOYALTY states no volume] | See Year 2 | See Year 2 | POS Records reports each day's purchases by 22:00 branch local time ([LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints), Assumption 1) |

## 18.2 Throughput Targets (per service)

| Service | Sustained RPS | Peak RPS | p50 latency | p95 latency | p99 latency |
|---------|----------------|----------|-------------|-------------|-------------|
| customer-accounts | See the clarification below | See the clarification below | See the clarification below | See the clarification below | 3 s end to end at most (REFUNDS/NFR-05) |
| refund-requests | See the clarification below | See the clarification below | See the clarification below | See the clarification below | 3 s end to end at most for everyday actions (REFUNDS/NFR-05) |
| payouts | Not applicable: no user calls | Not applicable | Not applicable | Not applicable | Not applicable |
| notifications | Not applicable: no user calls | Not applicable | Not applicable | Not applicable | Not applicable |
| loyalty-points | See the clarification below | See the clarification below | See the clarification below | See the clarification below | 2 s end to end at most for the balance and the first history page (LOYALTY/NFR-05) |

[NEEDS CLARIFICATION: per-module sustained RPS, peak RPS, and p50 and p95 latency targets. The BRDs' business-language NFRs give only the end-to-end ceilings shown, with no request rates per module.]

## 18.3 Peak Scenarios

| Scenario | Trigger | Expected Multiplier on Baseline | Mitigation |
|----------|---------|---------------------------------|------------|
| Seasonal sales | Seasonal sales ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts), Fact 2) | 3 times the refund requests, for about 3 weeks | Horizontal replicas of the deployable. [NEEDS CLARIFICATION: autoscaling thresholds and the maximum replica count] |
| Evening purchase reporting | POS Records reports each day's member purchases by 22:00 branch local time | [NEEDS CLARIFICATION: purchases per evening; LOYALTY states no volume] | Inbound feed applied on receipt, idempotent; the feed is not on a user's path |
| Payout retries after a provider outage | Payment Provider outage (INT-01) | [NEEDS CLARIFICATION: payouts waiting after the longest expected outage] | Exponential backoff with jitter and a circuit breaker; retries are capped by the payout deadline (§17.3) |
| Go-live opening balances | The one-off import (API-09) | One batch of every member with points | Runs before go-live, before members use the product (§11.3 gate) |

## 18.4 Stress Testing Strategy

- **Tooling:** [NEEDS CLARIFICATION: load test tool]
- **Environments:** UAT, which stages the seasonal peak for the BRD acceptance cases ([REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md)); [NEEDS CLARIFICATION: whether a separate performance environment exists]
- **Scenarios:** [NEEDS CLARIFICATION: scenario set: baseline, seasonal peak, spike, soak, provider failure injection]
- **Acceptance criteria:** the §18.5 targets at the seasonal peak; [NEEDS CLARIFICATION: further criteria]
- **Cadence:** [NEEDS CLARIFICATION: before each release, or another cadence]
- **Reporting:** [NEEDS CLARIFICATION: where results are kept]

## 18.5 NFR Targets

The availability budgets differ per BRD. Both products run in one deployable (ADR-01), so the deployable as a whole meets the stricter LOYALTY/NFR-04 budget.

| BRD NFR | Technical target | Realised in |
|---------|------------------|-------------|
| REFUNDS/NFR-01 | 0 missing and 0 duplicate payouts a month: one payout per refund request (unique key), one key per payout attempt, kept while its outcome is unknown (§17.3), events never lost (publication log) | §17.3, ADR-02 |
| REFUNDS/NFR-02 | At most 120 minutes of disruption a month for the refunds scope, planned and unplanned, about 99.72% of a 30-day month; a partner outage handled with its own message ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E4, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1, [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) E3) does not count | §11.3, §11.4, §6 Primary RDBMS |
| REFUNDS/NFR-03 | The seasonal peak of 3 times the normal requests for about 3 weeks (§18.1) with everyday actions inside the REFUNDS/NFR-05 ceiling | §18.3 |
| REFUNDS/NFR-04 | Only the customer, the branch's manager, and the manager covering the branch can read a request: permission token plus own-request or own-or-covered-branch gate on every read | §16.11, §17.2 Constraints |
| REFUNDS/NFR-05 | Everyday actions, such as checking a receipt or opening a request, within 3 s end to end; the receipt lookup times out per §12 INT-03 | §18.2, §12 |
| REFUNDS/NFR-06 | Every Refunds Portal web screen meets WCAG 2.1 AA | §6 Frontend Stack |
| LOYALTY/NFR-01 | The balance always equals the sum of the member's movements since they last joined: every movement and its balance change commit in one transaction; 0 mismatches in acceptance tests. The monthly upheld-complaint measure is the owner-held business tally in [LOYALTY 09](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics), separate from the correction report | §17.5 |
| LOYALTY/NFR-02 | A take-back shows within 1 hour of the refund being paid, or of the purchase showing if that is later: `RefundPaid` is handled after commit through the publication log, with an alert on publications incomplete after 15 minutes | §14.10, §11.4 |
| LOYALTY/NFR-03 | A purchase shows by the end of its day: each purchase is applied on receipt, at most 2 hours after the 22:00 reporting deadline ([LOYALTY 02 § Assumptions / Constraints](../brd-loyalty-points/02-glossary-assumptions-facts.md#assumptions--constraints), Assumption 1); a late rejoin notice re-evaluates kept purchases the day it arrives | §17.5, §11.4 |
| LOYALTY/NFR-04 | At most 60 minutes a month in which members cannot open their balance or history, planned maintenance included, about 99.86% of a 30-day month; the deployable meets this budget. The budget covers the whole member path, the member sign-in (API-10) included. [NEEDS CLARIFICATION: the Customer Accounts team's availability commitment for the member sign-in, or a LOYALTY decision to leave a member sign-in outage out of LOYALTY/NFR-04, as REFUNDS/NFR-02 leaves out partner outages.] | §11.3, §11.4, §6 Primary RDBMS |
| LOYALTY/NFR-05 | The balance and the first history page within 2 s end to end; the balance is kept with each movement, not summed at read time | §18.2, §17.5 |
| LOYALTY/NFR-06 | The [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) screens of Loyalty Points web meet WCAG 2.1 AA; a first-time member completes them unaided | §6 Frontend Stack |
| LOYALTY/NFR-07 | No access outside the LOYALTY Users & Use Cases Matrix and the report audience: permission tokens plus own-points gate; GDPR handling owned by the Data Protection Officer | §16.11, §17.5 Constraints and Compliance |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 13e-service-loyalty-points.md | NEXT: 15-environments.md -->
