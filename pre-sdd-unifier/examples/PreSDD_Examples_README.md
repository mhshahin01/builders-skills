# Pre-SDD — Eight Fully Worked Architecture Scenarios

**Edition:** 1.0 (16 October 2026) · **Audience:** Architects preparing Pre-SDD, proposed ADRs and SDD inputs.

> **Educational examples only.** Each scenario uses fictional projects, numerical business targets, budgets, host sizing and recovery timings selected expressly to show the decision-making process. Provider documents are cited only for architectural patterns and product behavior. None of the worked examples is an operational SLO guarantee or signed design.

## The 4 × 2 reference matrix

| Target-state path | Simple: both RPO & RTO > 6 h | Complex: both RPO & RTO < 10 s |
|---|---|---|
| **GF-OP** — Greenfield / On-prem | [Employee Training & Certification Portal](./PreSDD_GF_OP_Simple.md) · RPO 12 h, RTO 12 h | [Factory Production-Order Release & Inventory Reservation](./PreSDD_GF_OP_Complex.md) · RPO 2 s, RTO 8 s |
| **GF-CL** — Greenfield / Cloud | [Customer Feedback & Event Registration Portal](./PreSDD_GF_CL_Simple.md) · RPO 12 h, RTO 12 h | [Real-Time Loyalty Credit Redemption API](./PreSDD_GF_CL_Complex.md) · RPO 3 s, RTO 8 s |
| **BF-OP** — Brownfield / On-prem | [Legacy Payroll Reporting Modernization](./PreSDD_BF_OP_Simple.md) · RPO 24 h, RTO 18 h | [Legacy Factory Order Scheduler — Resilience Refactor](./PreSDD_BF_OP_Complex.md) · RPO 2 s, RTO 8 s |
| **BF-CL** — Brownfield / Cloud | [On-Prem IT Service Desk Migration to AWS](./PreSDD_BF_CL_Simple.md) · RPO 24 h, RTO 12 h | [Cloud-to-Cloud Real-Time Usage Charging Migration](./PreSDD_BF_CL_Complex.md) · RPO 2 s, RTO 8 s |

## Scenario comparison — business inputs → architecture outcomes

| Case | Primary fault scope | Peak TPS / external RPS | p99 target | First-pass application CPU | 36-month modeled TCO | Migration overlay |
|---|---|---:|---:|---|---:|---|
| [GF_OP_Simple](./PreSDD_GF_OP_Simple.md) | loss of an application VM or storage host while application-consistent backup remains accessible | 6 / 12 | 1600 ms | 2 vCPU × 1 domain(s) (first pass) | $127,200 | None |
| [GF_OP_Complex](./PreSDD_GF_OP_Complex.md) | complete loss of any one rack (compute, switch, DB replica) while the other two racks remain healthy | 1,200 / 1,200 | 180 ms | 6 vCPU × 3 domain(s) (first pass) | $1,562,000 | None |
| [GF_CL_Simple](./PreSDD_GF_CL_Simple.md) | loss of the deployed application or database availability in the chosen region, recoverable from backups | 30 / 60 | 1800 ms | 2 vCPU × 1 domain(s) (first pass) | $100,800 | None |
| [GF_CL_Complex](./PreSDD_GF_CL_Complex.md) | loss of any single availability zone with the other two healthy; already-authenticated redemption only | 2,500 / 5,000 | 250 ms | 22 vCPU × 3 domain(s) (first pass) | $4,608,000 | None |
| [BF_OP_Simple](./PreSDD_BF_OP_Simple.md) | VM, primary database disk or application host outage | 10 / 30 | 3000 ms | 2 vCPU × 1 domain(s) (first pass) | $297,000 | Same-platform internal relocation/replatform |
| [BF_OP_Complex](./PreSDD_BF_OP_Complex.md) | loss of one host/rack (including current elected DB writer), other two racks healthy | 700 / 2,100 | 350 ms | 10 vCPU × 3 domain(s) (first pass) | $1,488,000 | Same-site modernization with data migration |
| [BF_CL_Simple](./PreSDD_BF_CL_Simple.md) | single application or database service failure in target AWS region | 25 / 75 | 1800 ms | 2 vCPU × 1 domain(s) (first pass) | $538,000 | On-premises → AWS cloud |
| [BF_CL_Complex](./PreSDD_BF_CL_Complex.md) | complete loss of a single Google Cloud availability zone after cutover, with remaining two zones healthy | 1,800 / 3,600 | 350 ms | 20 vCPU × 3 domain(s) (first pass) | $5,680,000 | Azure cloud → Google Cloud |

## Migration routes and 7Rs

- **On-prem → AWS:** [BF-CL Simple: IT Service Desk](./PreSDD_BF_CL_Simple.md). Illustrates phased rehost/replatform, SQL inventory, backup recovery, bulk copy, CDC, 7R dispositions, planned downtime, point-of-no-return and cost.
- **Azure → Google Cloud:** [BF-CL Complex: Real-Time Usage Charging](./PreSDD_BF_CL_Complex.md). Illustrates service and schema parity, cross-cloud egress math, Spanner migration, 7Rs, single-authority tenant cutover, 8-second *zone-only* steady-state RTO and validated rollback.
- **Same-platform brownfield upgrade:** [BF-OP Simple](./PreSDD_BF_OP_Simple.md) and [BF-OP Complex](./PreSDD_BF_OP_Complex.md) describe internal data migration, upgrade/refactor and controlled cutover; the 7Rs migration taxonomy is only used where applicable.

## How architects should use these documents

1. Begin with the [Master Architecture Standard](./Pre-SDD_Architecture_Standard_v1.md) and [Intake Template](./Pre-SDD_Project_Intake_Template.md).
2. Choose exactly one of four primary target-state paths; choose simple or complex only after the accountable business owner defines fault scenario + RPO/RTO.
3. Copy the matching worked example. Replace the **entire fictional requirement register** with real owners, forecasts and measurement evidence.
4. Recompute TPS→RPS, CPU, in-flight concurrency, bandwidth, growth/retention, downtime budget, recovery-time budget and TCO from actual facts.
5. Apply migration overlay/7R per source workload if relevant; document authoritative writes, cutover window and the real rollback point.
6. Draft ADRs with rejected alternatives; obtain test/PoC evidence and signed Pre-SDD Gate 3 before SDD.

## Critical limitations and definitions

- An **8-second RTO at zone/rack level** is not an **8-second site/region recovery guarantee**. Whole-site/region and corruption cases are listed separately in each worked file.
- **RPO is not backup frequency alone**: verify backup consistency, recoverability, replication and retention; for quorum durability check acknowledged data and network partition behavior.
- Calculated vCPU quantities are **CPU lower-bound screening estimates only** and **do not** size RAM/IOPS, database, network PPS, logs, queues or redundancy by themselves.
- Percentile limits are business target SLIs, **not** achieved measurements or end-to-end p99 values built by summing component p99s.
- Vendor RPO/RTO and availability characteristics are service/configuration/condition specific; do not cite a provider SLA as a personal end-to-end performance guarantee.

## Source references

- [AWS Well-Architected: Disaster recovery choices](https://docs.aws.amazon.com/wellarchitected/2024-06-27/framework/rel_planning_for_recovery_disaster_recovery.html)
- [AWS Prescriptive Guidance: Seven migration strategies](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html)
- [Azure: Disaster recovery guide](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/disaster-recovery)
- [Google Cloud: DR planning](https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide)
- [Google Cloud: Azure→Google Cloud migration](https://docs.cloud.google.com/architecture/migration-from-azure-get-started)
- [PostgreSQL: Synchronous replication caveats](https://www.postgresql.org/docs/17/warm-standby.html)
