<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 09
PART OF: SDD - Refunds Platform
-->

# 18. Performance & Capacity Planning

The BRD NFRs are owned by the BRDs ([REFUNDS 10 § Non-Functional Requirements](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), [LOYALTY 10 § Non-Functional Requirements](../brd-loyalty-points/10-nfrs.md#non-functional-requirements)); this section quantifies each one per scope. REFUNDS states availability as a measure (REFUNDS/NFR-02); LOYALTY states it only as Business Objective 2 ("at any time"), so the member endpoints share the REFUNDS/NFR-02 target, a BRD follow-up for the LOYALTY owner to confirm.

| BRD NFR | Technical target | Realised by |
|---------|------------------|-------------|
| REFUNDS/NFR-01 | 0 duplicate and 0 missing payouts per month, verified daily by two checks, each inside its owner: refund-service alerts on any APPROVED request whose payout status is still PENDING when the ADR-10 retry window plus 1 hour has passed since the decision; payout-service compares the previous day's SUCCEEDED payouts with CardPay's payout records and alerts on any payout CardPay shows twice or that only one side has | ADR-10, §14.6 item 7, §17.1, §17.2 |
| REFUNDS/NFR-02 | At most 120 disrupted minutes per calendar month (99.72%). A minute is disrupted when more than 5% of the requests to the customer, member, or branch manager endpoints fail at the API gateway with 5xx, 503 `RECEIPT_LOOKUP_UNAVAILABLE` included; POS-caused minutes are also reported on their own | Rolling deploys, readiness gates and core replicas (§11.3), API gateway and Keycloak with at least two replicas each, R-08 |
| REFUNDS/NFR-03 | The §18.2 latency targets hold at three times the baseline request rate for three weeks | §18.3 seasonal scenario |
| REFUNDS/NFR-04 | 0 reads of a request by anyone other than its customer and its branch's managers | §16.2 gates, ADR-08 |
| LOYALTY/NFR-01 | Every paid refund of a member purchase has exactly one take-back, including purchases recorded after the refund was paid; the balance equals the sum of movements at each daily reconciliation; no PARKED take-back is older than two days | §17.4 balance integrity |
| LOYALTY/NFR-02 | `paidAt` to take-back commit at most 60 minutes for every matched take-back; when the purchase is recorded after the refund is paid, the take-back applies in the transaction that records it; this exception to the one-hour measure is a BRD follow-up for the LOYALTY owner. [NEEDS CLARIFICATION: consumer-lag alert threshold for loyalty-service.] | §14, §17.4 |

## 18.1 Load Estimates

| Dimension | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Refund requests per month | 1,200 | See note | See note | REFUNDS 02 Facts 1; 40 branches (REFUNDS 01) |
| Refund requests per month at the seasonal rate | 3,600, for about 3 weeks | See note | See note | Three times normal (REFUNDS 02 Facts 2, REFUNDS/NFR-03) |
| Customer messages per month | At most 7,200 (21,600 at the seasonal rate) | See note | See note | Derived: at most 6 per request, 2 at submission, 2 at approval, and 2 at payment (§17.3); branch manager emails only on failed payouts |
| Payouts per month | At most 1,200 | See note | See note | Derived: at most one per request |
| Members and member purchases per day | [NEEDS CLARIFICATION: member count and daily member purchases; LOYALTY states no volume] | See note | See note | Drives API-06 and the earn movements |
| Read requests (tracking, queue, points views) | [NEEDS CLARIFICATION: expected read traffic per day] | See note | See note | Neither BRD states it |

**Note:** Year 2 and Year 3: [NEEDS CLARIFICATION: expected growth of refund requests, members, and purchases; neither BRD states one.]

## 18.2 Throughput Targets (per service)

Write rates follow from §18.1: at the seasonal rate (about 120 requests a day), even if a whole day's requests arrived within one hour, submissions stay under 0.05 per second, so capacity is set by read traffic and latency, not by writes.

| Service | Sustained RPS | Peak RPS | p50 latency | p95 latency | p99 latency |
|---------|----------------|----------|-------------|-------------|-------------|
| refund-service | [NEEDS CLARIFICATION: read and write RPS] | [NEEDS CLARIFICATION: three times sustained] | [NEEDS CLARIFICATION: target] | [NEEDS CLARIFICATION: target] | [NEEDS CLARIFICATION: target] |
| payout-service | Event-driven; at most one payout per approved request (§18.1) | Retry burst after a CardPay outage (§18.3) | Not applicable (asynchronous) | Not applicable | Not applicable |
| notification-service | Event-driven; message volume per §18.1 | Three times sustained during seasonal sales | Not applicable (asynchronous) | [NEEDS CLARIFICATION: event-to-send delay target] | Not applicable |
| loyalty-service | [NEEDS CLARIFICATION: points view RPS] | [NEEDS CLARIFICATION: peak RPS] | [NEEDS CLARIFICATION: target] | [NEEDS CLARIFICATION: target] | [NEEDS CLARIFICATION: target] |

## 18.3 Peak Scenarios

| Scenario | Trigger | Expected Multiplier on Baseline | Mitigation |
|----------|---------|---------------------------------|------------|
| Seasonal sales | Sale season (REFUNDS 02 Facts 2, REFUNDS/NFR-03) | 3x requests and messages for about 3 weeks | Horizontal autoscaling of the core and notification-service (notification-service also on consumer lag, §17.3); asynchronous messaging absorbs bursts. [NEEDS CLARIFICATION: autoscaling thresholds and replica maximum (§11.3).] |
| CardPay recovery after an outage | CardPay unavailable, then back | [NEEDS CLARIFICATION: payouts due at once after the longest expected outage] | Jittered backoff spreads the retries; bulkhead and circuit breaker around the CardPay adapter; the ADR-10 retry window bounds the retry work |
| POS member-purchase catch-up | The POS feed is delayed, then delivered | [NEEDS CLARIFICATION: largest expected backlog] | Idempotent ingestion on the purchase reference; parked take-backs apply when their purchases arrive (§17.4) |

## 18.4 Stress Testing Strategy

- **Tooling:** [NEEDS CLARIFICATION: load-testing tool.]
- **Environments:** [NEEDS CLARIFICATION: UAT or a dedicated performance environment with provider stubs.]
- **Scenarios:** baseline; 3x seasonal rate for a sustained soak; CardPay outage and recovery; Kafka consumer restart with backlog; POS feed catch-up.
- **Acceptance criteria:** the §18.2 targets hold at the 3x rate; zero duplicate payouts and zero lost events across every scenario (REFUNDS/NFR-01); take-back lag within 60 minutes (LOYALTY/NFR-02).
- **Cadence:** [NEEDS CLARIFICATION: before the first release and before each sale season, or another cadence.]
- **Reporting:** [NEEDS CLARIFICATION: where results are stored.]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 13d-service-loyalty.md | NEXT: 15-environments.md -->
