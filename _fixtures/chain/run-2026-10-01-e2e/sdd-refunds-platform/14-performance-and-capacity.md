<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
PROJECT: Refunds Platform
VERSION: 1.2
DEPENDS_ON: 09
PART OF: SDD - Refunds Platform
-->

# 18. Performance & Capacity Planning

The business measures are in [REFUNDS 10 § Non-Functional Requirements](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) and [LOYALTY 10 § Non-Functional Requirements](../brd-loyalty-points/10-nfrs.md#non-functional-requirements); this chunk turns them into technical targets.

## 18.1 Load Estimates

| Dimension | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Refund requests per month | 1,200 | [NEEDS CLARIFICATION: growth] | [NEEDS CLARIFICATION: growth] | [REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 1, across 40 branches (about 40 a day) |
| Refund requests per month in seasonal sales | 3,600, for about 3 weeks | [NEEDS CLARIFICATION: growth] | [NEEDS CLARIFICATION: growth] | REFUNDS 02 Facts 2 and REFUNDS/NFR-03: three times the normal number (about 120 a day) |
| Customer messages per month | Up to 7,200 (up to 21,600 at the seasonal rate) | Follows requests | Follows requests | Derived: at most six messages per request (email and SMS at submission, at approval, and when Paid; email and SMS when Rejected; one email when Cancelled) |
| Payouts per month | Up to 1,200 | Follows requests | Follows requests | At most one payout per request. [NEEDS CLARIFICATION: approval rate, which sets the real payout count] |
| Loyalty members and member purchases per day | [NEEDS CLARIFICATION: member count and member purchases per day] | [NEEDS CLARIFICATION: growth] | [NEEDS CLARIFICATION: growth] | LOYALTY states no volume |

## 18.2 Throughput Targets (per service)

Service level objectives derived from the BRD measures:

- **Availability:** at least 99.7% a month for the web app and the core APIs (REFUNDS/NFR-02: at most 2 hours of disruption in a month of about 730 hours). **[NEEDS CLARIFICATION: availability target for the LOYALTY screens; LOYALTY 01 objective 2 says members can check their points "at any time" without a measure, and the core serves them at the REFUNDS level.]**
- **Payout correctness** (REFUNDS/NFR-01): no overdue request in the month (`refund_payout_outcome_overdue_requests` = 0, §17.1) and no payout with more than one accepted API-02 attempt in `payout_attempt` (§17.2), until the §22 CardPay reconciliation replaces the duplicate proxy.
- **Take-back lag:** every take-back within 1 hour of the refund being paid, or of POS Records reporting the purchase if that is later (LOYALTY/NFR-02), measured by `loyalty_takeback_lag_seconds` (§17.4).
- **Earn lag:** every earned movement within 1 hour of POS Records reporting the purchase (LOYALTY/NFR-03), measured by `loyalty_earn_lag_seconds` (§17.4); the import schedule (§17.4 Input) keeps the target with one failed run inside the hour.
- **Balance correctness:** the stored balance always equals the sum of the movements (LOYALTY/NFR-01), enforced in one transaction (§17.4); every movement follows the LOYALTY 03 and LOYALTY/UC-02 rules as §17.4 realises them, so the only differences LOYALTY/NFR-01 allows are an unreported purchase and the two lags above.
- **Seasonal peak:** the latency targets below hold at three times the normal load (REFUNDS/NFR-03).

| Service | Sustained RPS | Peak RPS | p50 latency | p95 latency | p99 latency |
|---------|----------------|----------|-------------|-------------|-------------|
| refund-service (core) | [NEEDS CLARIFICATION: sustained RPS] | 3 x sustained (REFUNDS/NFR-03) | [NEEDS CLARIFICATION: p50, p95, and p99 latency per endpoint group] | With p50 | With p50 |
| loyalty-service (core) | [NEEDS CLARIFICATION: sustained RPS] | [NEEDS CLARIFICATION: peak RPS] | [NEEDS CLARIFICATION: p50, p95, and p99 latency] | With p50 | With p50 |
| payout-service (events) | [NEEDS CLARIFICATION: sustained events per second] | 3 x sustained (REFUNDS/NFR-03) | [NEEDS CLARIFICATION: time from `REFUND_APPROVED` to the first API-02 attempt] | With p50 | With p50 |
| notification-service (events) | [NEEDS CLARIFICATION: sustained events per second] | 3 x sustained (REFUNDS/NFR-03) | [NEEDS CLARIFICATION: time from the event to an accepted message] | With p50 | With p50 |

## 18.3 Peak Scenarios

| Scenario | Trigger | Expected Multiplier on Baseline | Mitigation |
|----------|---------|---------------------------------|------------|
| Seasonal sales | Seasonal sales ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 2) | 3x for about 3 weeks (REFUNDS/NFR-03) | HPA on the core deployable (§11.3); Kafka absorbs the payout and message bursts; consumer groups scale with partitions. |
| Payment provider outage | CardPay unavailable or refusing payouts | Retries per pending payout with backoff, within the §17.2 retry window ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1), then at the post-window interval until paid | Circuit breaker, bulkhead, and jitter in payout-service; the portal is unaffected (ADR-01). |
| POS Records outage | POS Records unavailable | Customers retry submissions | Circuit breaker and a fast "try again later" answer (§17.1); the purchase import resumes from its cursor (§17.4). |
| Notification partner outage | MsgHub unavailable | Message backlog up to the attempt limit | Retries with backoff in notification-service; refunds are never blocked (§17.3). |

## 18.4 Stress Testing Strategy

- **Tooling:** [NEEDS CLARIFICATION: load-testing tool]
- **Environments:** UAT (§19), sized like production for the run.
- **Scenarios:** baseline (the 1,200-a-month profile), seasonal peak (three times the baseline for a sustained window), provider failure injection (payout refusals for a day, as prerequisite P4 in [REFUNDS 16 § Test environment and data prerequisites](../brd-refunds-portal/16-uat-bat-test-cases.md#test-environment-and-data-prerequisites) describes), POS Records and MsgHub outages, and a POS Records report held back past the paid refund of its purchase (as prerequisite P6 in [LOYALTY 16 § Test environment and data prerequisites](../brd-loyalty-points/16-uat-bat-test-cases.md#test-environment-and-data-prerequisites) describes).
- **Acceptance criteria:** the §18.2 objectives hold in every scenario, with no lost or duplicate payout and no earned or taken-back movement later than its hour.
- **Cadence:** [NEEDS CLARIFICATION: cadence, for example before each seasonal sale and each major release]
- **Reporting:** [NEEDS CLARIFICATION: where results are stored and who signs them off]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 13d-service-loyalty.md | NEXT: 15-environments.md -->
