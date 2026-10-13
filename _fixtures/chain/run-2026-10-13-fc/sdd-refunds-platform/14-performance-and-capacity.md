<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 09
PART OF: SDD - Refunds Platform
-->

# 18. Performance & Capacity Planning

## 18.1 Load Estimates

| Dimension | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Refund requests per month, normal | About 1,200 | Per the marker below | Per the marker below | [REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 1, across 40 branches; about 40 a day on a 30-day month |
| Refund requests per month, seasonal peak | About 3,600 for about 3 weeks | Per the marker below | Per the marker below | REFUNDS 02 Facts 2 and REFUNDS/NFR-03 (3 times normal); about 120 a day |
| Messages per refund request | Up to 2 per status change (email and SMS) | Same | Same | [REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages) |
| Loyalty members and member purchases per day | Per the marker below | Per the marker below | Per the marker below | No LOYALTY chunk gives them |

**[NEEDS CLARIFICATION: What volumes are expected in years 2 and 3 for refund requests, and how many loyalty members and member purchases per day does Loyalty Points handle in each year? Owner: REFUNDS and LOYALTY BRD owners.]**

## 18.2 Throughput Targets (per service)

| Service | Sustained RPS | Peak RPS | p50 latency | p95 latency | p99 latency |
|---------|----------------|----------|-------------|-------------|-------------|
| refund-request | Per the marker below | Per the marker below | Per the marker below | Per the marker below | Per the marker below |
| payout | Not applicable: no inbound user traffic; attempts follow approvals | - | - | - | - |
| customer-notification | Not applicable: no inbound user traffic | - | - | - | - |
| loyalty-points | Per the marker below | Per the marker below | Per the marker below | Per the marker below | Per the marker below |

**[NEEDS CLARIFICATION: Sustained RPS, peak RPS, and p50, p95, and p99 latency targets for refund-request and loyalty-points; the BRD NFRs give no per-module technical granularity, and REFUNDS/NFR-05 leaves its seconds open. Owner: solution architect with the REFUNDS BRD owner.]**

## 18.3 Peak Scenarios

| Scenario | Trigger | Expected Multiplier on Baseline | Mitigation |
|----------|---------|---------------------------------|------------|
| Seasonal sales | Seasonal sales ([REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts) 2) | 3x refund requests for about 3 weeks (REFUNDS/NFR-03) | Add replicas of the one deployable within the autoscaling bounds of §11.3; payout and message senders drain their queues at provider-safe rates (INT-01, INT-02) |
| Provider outage recovery | CardPay or MsgHub back after an outage | Queued attempts and messages released at once | Senders release queued work in batches with jitter; circuit breakers close gradually (ADR-10) |
| POS Records late batch | Purchases arrive late in bulk | Depends on the POS Records delivery (§17.4 Input) | Intake is idempotent and per purchase; late purchases still earn their points |

## 18.4 Stress Testing Strategy

**[NEEDS CLARIFICATION: Which tooling, environment, scenario set, acceptance criteria, and cadence do stress tests use? Owner: solution architect.]**

- **Tooling:** per the marker; a load-testing tool is a new dependency (`AGENTS.md`).
- **Environments:** per the marker; UAT-sized at minimum (§19).
- **Scenarios:** baseline (§18.1 normal), seasonal peak (3x for a sustained run), provider outage recovery, and a soak test.
- **Acceptance criteria:** the §18.2 targets once set, and REFUNDS/NFR-05.
- **Cadence:** per the marker.
- **Reporting:** per the marker.

## 18.5 NFR Targets

| BRD NFR | Technical target | Realised in |
|---------|------------------|-------------|
| REFUNDS/NFR-01 | 0 duplicate payouts and 0 lost payouts per month: one payout per refund request (unique key), one idempotency key per payout round across its attempts (a new round only when the customer's bank sends a paid payout back, §17.2), approval and its event in one transaction, durable publication log; a payout still retrying at month end counts as delayed, a payout `Held` for a card dispute at month end counts as waiting, a payout `Stopped` or `Unknown` at month end counts as missing, and a payment the customer's bank sent back is not counted as paid, so the round that pays again is not a duplicate | §17.2 (prevention and reconciliation), ADR-02, §11.1 |
| REFUNDS/NFR-02 | Monthly availability of at least 99.72% on a 30-day month (2 hours of 720), planned maintenance included, measured over the whole request path: load balancer, IAM sign-in and token issue, deployable, and PostgreSQL. Whichever IAM ADR-07 settles (Proposed) meets the target: Keycloak, its proposal, runs at least 2 nodes with rolling upgrades and its own highly available database; the hosting environment's managed identity service, its alternative, needs a published availability of at least the same target. A synthetic probe signs in and reads one list every minute; its failures consume the error budget. | §11.3, §11.4, ADR-07, ADR-09 |
| REFUNDS/NFR-03 | 3x the normal refund request volume (about 3,600 a month) for 3 weeks while meeting REFUNDS/NFR-05 | §18.3, §18.2 |
| REFUNDS/NFR-04 | Only the customer and their branch's manager can read a request (owner and branch gates), plus the staff who record or confirm a payout result by hand (`PAYOUT_OPERATOR`, §16.4.2) and the roles the §16.4 markers settle; personal data never in logs | §16.2, §16.4, §11.4, §17.1 Compliance, §17.1 API Standards (rate limits), §16.4.3 (operations access) |
| REFUNDS/NFR-05 | **[NEEDS CLARIFICATION: technical target for REFUNDS/NFR-05: REFUNDS 10 leaves the seconds of an everyday action open, so no latency budget can be derived. Owner: REFUNDS BRD owner.]** | §18.2 |
| REFUNDS/NFR-06 | Retention purge jobs per module apply the periods once set | §17.1, §17.2, §17.3 Retention Policy |
| REFUNDS/NFR-07 | **[NEEDS CLARIFICATION: technical target for REFUNDS/NFR-07: REFUNDS 10 leaves open the countries whose tax law applies, the refund document the customer receives, and whether each paid refund is recorded in a fiscal register or in the branch's accounts; the answer may add a document the platform issues and an integration with a fiscal register or an accounting system. Owner: REFUNDS BRD owner.]** | §17.1, §17.2 Compliance |
| LOYALTY/NFR-01 | 0 upheld balance complaints per month: balance equals the sum of movements (account row lock, daily verification), one take-back per paid refund (inbox), take-backs capped at the points earned | §17.4 |
| LOYALTY/NFR-02 | Take-back committed within 1 hour of the latest of: the refund being paid, the kept outcome reaching `loyalty-points` when Loyalty Points is switched on (a refund paid on the refund-reporting start date), and the purchase earning its points within the wait of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-5; alert at 30 minutes of listener lag | §14.10, §11.1, §11.4, §17.4, §17.4 Metrics |
| LOYALTY/NFR-03 | **[NEEDS CLARIFICATION: technical target for LOYALTY/NFR-03: LOYALTY 10 proposes "by the end of the day of the purchase" but leaves it to be confirmed, and the POS Records delivery (§17.4 Input) decides what is reachable. Owner: LOYALTY BRD owner.]** | §17.4 |
| LOYALTY/NFR-04 | **[NEEDS CLARIFICATION: technical target for LOYALTY/NFR-04: LOYALTY 10 leaves the minutes of unavailability per month open; the shared deployable meets the REFUNDS/NFR-02 target meanwhile. Owner: LOYALTY BRD owner.]** | §11.3 |
| LOYALTY/NFR-05 | No member can read another member's points, history, or purchase details: member gate on every loyalty endpoint, 404 for another member's movement | §16.2, §17.4, §16.4.3 (operations access) |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 13d-service-loyalty-points.md | NEXT: 15-environments.md -->
