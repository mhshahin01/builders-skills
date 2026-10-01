<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 09
PART OF: SDD - Refunds Platform
-->

# 18. Performance & Capacity Planning

BRD NFRs quantified ([REFUNDS 10 § NFRs](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), [LOYALTY 10 § NFRs](../brd-loyalty-points/10-nfrs.md#non-functional-requirements)); the business measure stays in the BRD, this table states only the technical target and where it is realised:

| NFR | Technical target | Realised in |
|-----|------------------|-------------|
| REFUNDS/NFR-01 | 0 approved requests without a payout row (API-01 in the approval transaction); 0 duplicate CardPay payouts (payout ID as idempotency key, R-01); every payout Succeeded, Failed, or Unknown within 24 h of its first attempt plus one dispatcher cycle; 0 mismatches in the daily reconciliation with CardPay's records | ADR-05, ADR-09, §17.2 |
| REFUNDS/NFR-02 | Monthly availability of the customer and branch manager APIs of at least 99.7% (2 h of about 730 h), measured at the gateway. The SLI counts every 5xx answered at the gateway, including 503 `UNAVAILABLE` when POS records are down, so the 2-hour budget covers the gateway, Keycloak sign-in, the deployable, PostgreSQL, and the POS receipt lookup | §11.3 (two or more replicas), §11.4 (SLO alert) |
| REFUNDS/NFR-03 | Capacity for 3x baseline refund traffic for 3 weeks (§18.3) with the latency targets of §18.2 unchanged. [NEEDS CLARIFICATION: p95 latency that customers do not notice, for submit, track, and decision] | §18.2, §18.3 |
| REFUNDS/NFR-04 | Every refund read is filtered by customer or branch; PII encrypted at rest and masked in logs; tested by access-control integration tests | §11.6, §16 |
| LOYALTY/NFR-01 | Nightly integrity check: 0 balances that differ from the sum of their movements; take-back idempotent per refund | §17.4 |
| LOYALTY/NFR-02 | 100% of take-backs whose purchase is known recorded within 1 h of `paidAt`; alert when `loyalty_take_back_lag_seconds` nears 1 h | §17.4, §11.4 |

The deployable serves both BRDs, so the REFUNDS/NFR-02 availability target also covers the loyalty screens; LOYALTY states no availability measure of its own ([LOYALTY 01 § Business Objectives](../brd-loyalty-points/01-executive-summary-and-context.md#business-objectives) 2 asks for "any time").

## 18.1 Load Estimates

| Dimension | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Refund requests | about 1,200 a month (about 40 a day); about 3,600 a month during 3 weeks of seasonal sales | [NEEDS CLARIFICATION: growth] | [NEEDS CLARIFICATION: growth] | [REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 1-2 |
| Branches | 40 | [NEEDS CLARIFICATION: growth] | [NEEDS CLARIFICATION: growth] | [REFUNDS 01 § Background and Context](../brd-refunds-portal/01-executive-summary-and-context.md#background-and-context) |
| CardPay payout calls | at most about 1,200 a month plus retries | follows refund requests | follows refund requests | Derived: at most one payout per request |
| MsgHub messages | about 4,800 a month | follows refund requests | follows refund requests | Derived: about 4 messages per request (2 at submission, 2 at payment or rejection; 1 for a cancellation) |
| Members and member purchases a day | [NEEDS CLARIFICATION: member count and purchases a day] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | LOYALTY states no volume |
| Status reads (tracking, history) | [NEEDS CLARIFICATION: reads per request and per member] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | Not derivable from the BRDs |

## 18.2 Throughput Targets (per service)

Write volume derived from §18.1 is far below one request per second; read traffic is unknown, so the per-module targets are open.

| Service | Sustained RPS | Peak RPS | p50 latency | p95 latency | p99 latency |
|---------|----------------|----------|-------------|-------------|-------------|
| refund | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION: 3x sustained per REFUNDS/NFR-03, once sustained is known] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] |
| payout | Not applicable: no inbound HTTP; dispatcher throughput follows §18.1 | Not applicable | Not applicable | Not applicable | Not applicable |
| notification | Not applicable: no inbound HTTP; dispatcher throughput follows §18.1 | Not applicable | Not applicable | Not applicable | Not applicable |
| loyalty | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] |

## 18.3 Peak Scenarios

| Scenario | Trigger | Expected Multiplier on Baseline | Mitigation |
|----------|---------|---------------------------------|------------|
| Seasonal sales | Sales periods ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 2, REFUNDS/NFR-03) | 3x refund requests, messages, and payouts for about 3 weeks | Two or more replicas, horizontal autoscaling of the deployable [NEEDS CLARIFICATION: autoscaling bounds and trigger]; dispatchers absorb bursts through their tables |
| CardPay outage | Provider downtime | Payout backlog that grows for up to 24 h | Circuit breaker and bulkhead per provider; payouts retry with backoff; `PayoutFailed` after 24 h (§17.2) |
| MsgHub outage | Provider downtime | Message backlog for the outage duration | Messages stay pending and retry; refunds are not affected (§17.3) |
| POS records outage | Provider downtime | Refund submissions refused while it lasts | 503 `UNAVAILABLE` with a try-again message; tracking, decisions, and loyalty reads keep working |

## 18.4 Stress Testing Strategy

- **Tooling:** [NEEDS CLARIFICATION: load-testing tool.]
- **Environments:** [NEEDS CLARIFICATION: environment sized like Prod for load runs; SIT or UAT (§19).]
- **Scenarios:** baseline, 3x seasonal peak for a sustained window, provider outage injection (CardPay, MsgHub, POS records), restart during dispatch. [NEEDS CLARIFICATION: scenario durations.]
- **Acceptance criteria:** the §18.2 latency targets hold at 3x, no duplicate payout and no lost event publication after restarts. [NEEDS CLARIFICATION: numeric pass thresholds.]
- **Cadence:** [NEEDS CLARIFICATION: before each seasonal sale and on major releases?]
- **Reporting:** [NEEDS CLARIFICATION: where results are stored.]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 13d-service-loyalty.md | NEXT: 15-environments.md -->
