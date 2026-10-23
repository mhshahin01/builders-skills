# Technical Pre-SDD validation report
Status: Provisional / review required
Automated blockers: 1
Automated warnings: 4

## Blocking items
- OPEN-residency: Regulatory and geographic restrictions have not been assessed. (owner: Lead architect / responsible owner)

## Advisories
- EVID-01: Accountable owner not identified
- EVID-02: No measurement or approval evidence reference supplied
- DR-zeroRTO-unverified: Zero-second RTO is a business aspiration, not a guaranteed failover result; define outage detection/SLI granularity and test end-to-end, including partitions.
- DATA-commit-protocol: Active-active application capacity is not proof of RPO=0. Require a validated acknowledgement/quorum/commit model, including latency and network partition trade-offs.

Formal G3 approval has not been independently verified.